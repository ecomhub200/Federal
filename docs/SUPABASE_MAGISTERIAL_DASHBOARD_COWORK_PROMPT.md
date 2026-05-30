# Supabase Backend CoWork Prompt — Magisterial-District Dashboard Breakdown

**Purpose:** Hand this prompt to the operator/agent with **direct access** to
the self-hosted Crash Lens Supabase database
(`https://srv1503081.hstgr.cloud`, PostgREST under `/rest/v1`). It is
self-contained: read it, run the diagnostics, apply whichever fix the
diagnostics point to, and report back.

**Why CoWork (not Claude Code):** The Claude Code agent that wrote this **cannot
reach this database**. The Supabase MCP tools in that environment are bound to
unrelated hosted projects and return `permission denied` against
`srv1503081.hstgr.cloud`. All SQL/RPC/matview/index/grant/cron work for this DB
must be done here, by someone with real credentials. (See the "SELF-HOSTED
Supabase" section in `CLAUDE.md`.)

---

## 0. Symptom & what the frontend already does

**User-reported symptom:** On the Dashboard, the **"Crashes by Magisterial
District"** widget (shown when a **county** jurisdiction is selected) loads
**slowly** and shows **stale / not-up-to-date** data.

**Frontend call path (already shipped, do not change):**

- File: `assets/js/data-client.js` → `getJurisdictionBreakdown({tier, value})`.
- It POSTs to **`/rest/v1/rpc/get_jurisdiction_breakdown`** with body
  `{ p_state, p_tier, p_value }` (`p_state` lowercased) and a request timeout
  (default ~`this.timeout`).
- The RPC is expected to return rows with these `out_`-prefixed columns:
  `out_breakdown_kind, out_label, out_crash_count, out_fatals, out_serious,
  out_epdo, out_ped_count, out_bike_count, out_ka_rate_pct,
  out_is_blocked_upstream`.
- **Tier → what the widget shows:**
  - `county` → one row **per magisterial district / CCD** within the county
    (`breakdown_kind = 'ccd'` or similar).
  - `state` / `region` / `mpo` / `planning_district` → one row **per county**
    in scope (`breakdown_kind = 'county'`).
  - `city` / `city_town` → host-county row (`breakdown_kind = 'host_county'`).

**Blocked-sentinel contract (already handled client-side):** If the matview
**cannot** compute a within-county breakdown for a state, the RPC should return
**exactly one row** with `out_is_blocked_upstream = true`. The frontend now
detects that and falls back to a **client-side TIGERweb** renderer that computes
the magisterial matrix in the browser. So:

> Returning the blocked sentinel is a **valid, supported** answer — it is NOT a
> failure. Only return it when the backend genuinely cannot produce CCD rows for
> that state.

Your job is to make sure that for states that **can** be served from the DB, the
RPC is **fast and fresh**; and for states that can't, it returns the **single
blocked sentinel** (not a slow timeout, not stale rows, not an error).

---

## 1. Diagnose first (run these, paste results when reporting back)

Replace `$ANON` with the anon key and pick a real county. Examples below use a
Virginia county (`p_state='va'`); adapt to whatever state shows the symptom.

```bash
ANON='...anon JWT...'
BASE='https://srv1503081.hstgr.cloud/rest/v1'

# (a) Does the RPC exist, and what does it return for a county?
curl -s "$BASE/rpc/get_jurisdiction_breakdown" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
  -H "Content-Type: application/json" \
  -d '{"p_state":"va","p_tier":"county","p_value":"Fairfax County"}' | jq '.'

# (b) Time it (slow symptom = look for >1s here)
time curl -s "$BASE/rpc/get_jurisdiction_breakdown" \
  -H "apikey: $ANON" -H "Authorization: Bearer $ANON" \
  -H "Content-Type: application/json" \
  -d '{"p_state":"va","p_tier":"county","p_value":"Fairfax County"}' > /dev/null
```

Then, **inside the database** (psql / SQL editor):

```sql
-- 1. Inspect the RPC definition: is it querying a matview, or scanning `crashes` live?
\sf get_jurisdiction_breakdown
-- (or)
SELECT pg_get_functiondef('get_jurisdiction_breakdown'::regproc);

-- 2. What backing object does it read? Look for the source matview, e.g.
--    mv_jurisdiction_breakdown / mv_magisterial_districts / a live GROUP BY on crashes.

-- 3. If it reads a matview, when was that matview last refreshed?
SELECT relname, last_refresh
FROM pg_stat_user_tables s          -- or your refresh-tracking table
WHERE relname LIKE 'mv_%';
-- If you don't track refresh time, check pg_cron history:
SELECT * FROM cron.job_run_details ORDER BY end_time DESC LIMIT 20;

-- 4. EXPLAIN ANALYZE the hot path for one county (find the slow node):
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM get_jurisdiction_breakdown('va','county','Fairfax County');

-- 5. Does the CCD/magisterial assignment column exist & is it populated for this state?
SELECT count(*) FILTER (WHERE ccd_name IS NOT NULL) AS have_ccd,
       count(*)                                     AS total
FROM crashes WHERE state = 'va';      -- adjust column name to your schema
```

**Interpret:**

| Finding | Likely cause | Fix → §2 |
|---|---|---|
| RPC scans `crashes` live (no matview), EXPLAIN shows seq scan / sort over 100K–1M rows | **Slow**: no pre-aggregation | §2.1 build/refresh `mv_jurisdiction_breakdown` + index |
| RPC reads a matview, but `last_refresh` is days old / before the latest `crashes` load | **Stale**: refresh not wired to data load | §2.2 add matview to nightly refresh |
| RPC returns the blocked sentinel for a state that *does* have CCD data | **Wrong blocker**: capability gate too aggressive | §2.3 fix the gate / populate CCD column |
| RPC errors / 404 `relation does not exist` | RPC or matview never shipped | §2.1 (build it) |
| RPC is fast + fresh + returns real rows | Backend is fine — symptom is frontend cache or deploy lag | report back; no DB change |

---

## 2. Fixes (apply the one the diagnosis points to)

### 2.1 Slow — pre-aggregate into a matview

If `get_jurisdiction_breakdown` aggregates `crashes` live per request, back it
with a matview so each call is an indexed lookup, not a full scan. Shape it to
match the `out_*` contract the RPC already returns.

```sql
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_jurisdiction_breakdown AS
SELECT
    state,
    physical_juris_name                       AS county,
    dot_district                              AS region,
    mpo_name                                  AS mpo,
    planning_district,
    ccd_name                                  AS ccd,        -- magisterial district / CCD
    COUNT(*)                                  AS crash_count,
    SUM((crash_severity='K')::int)            AS fatals,
    SUM((crash_severity='A')::int)            AS serious,
    SUM(CASE crash_severity
        WHEN 'K' THEN 883 WHEN 'A' THEN 94
        WHEN 'B' THEN 21  WHEN 'C' THEN 11
        WHEN 'O' THEN 1   ELSE 0 END)         AS epdo,       -- FHWA-SA-25-021
    SUM((pedestrian='Yes')::int)              AS ped_count,
    SUM((bike='Yes')::int)                    AS bike_count
FROM crashes
GROUP BY state, physical_juris_name, dot_district, mpo_name,
         planning_district, ccd_name;

-- Unique index REQUIRED for REFRESH ... CONCURRENTLY:
CREATE UNIQUE INDEX IF NOT EXISTS mv_jurisdiction_breakdown_uidx
    ON mv_jurisdiction_breakdown
    (state, county, region, mpo, planning_district, ccd);
-- Lookup indexes matching the RPC's WHERE clauses:
CREATE INDEX IF NOT EXISTS mv_jb_county_idx ON mv_jurisdiction_breakdown (state, county);
CREATE INDEX IF NOT EXISTS mv_jb_region_idx ON mv_jurisdiction_breakdown (state, region);
CREATE INDEX IF NOT EXISTS mv_jb_mpo_idx    ON mv_jurisdiction_breakdown (state, mpo);
CREATE INDEX IF NOT EXISTS mv_jb_pd_idx     ON mv_jurisdiction_breakdown (state, planning_district);

GRANT SELECT ON mv_jurisdiction_breakdown TO anon;
```

Then point `get_jurisdiction_breakdown` at the matview. The RPC must keep its
existing signature and `out_*` output columns. Sketch:

```sql
CREATE OR REPLACE FUNCTION get_jurisdiction_breakdown(
    p_state text, p_tier text, p_value text)
RETURNS TABLE (
    out_breakdown_kind text, out_label text, out_crash_count bigint,
    out_fatals bigint, out_serious bigint, out_epdo bigint,
    out_ped_count bigint, out_bike_count bigint,
    out_ka_rate_pct numeric, out_is_blocked_upstream boolean)
LANGUAGE sql STABLE AS $$
  -- county tier → one row per CCD within the county
  SELECT 'ccd', ccd, crash_count, fatals, serious, epdo, ped_count, bike_count,
         CASE WHEN crash_count>0 THEN round(100.0*(fatals+serious)/crash_count,1) ELSE 0 END,
         false
  FROM mv_jurisdiction_breakdown
  WHERE p_tier='county' AND state=lower(p_state)
        AND county=p_value AND ccd IS NOT NULL
  UNION ALL
  -- state/region/mpo/pd tier → one row per county (aggregate the CCD rows up)
  SELECT 'county', county, SUM(crash_count), SUM(fatals), SUM(serious), SUM(epdo),
         SUM(ped_count), SUM(bike_count),
         CASE WHEN SUM(crash_count)>0 THEN round(100.0*SUM(fatals+serious)/SUM(crash_count),1) ELSE 0 END,
         false
  FROM mv_jurisdiction_breakdown
  WHERE p_tier IN ('state','region','mpo','planning_district')
        AND state=lower(p_state)
        AND ( (p_tier='state')
           OR (p_tier='region' AND region=p_value)
           OR (p_tier='mpo' AND mpo=p_value)
           OR (p_tier='planning_district' AND planning_district=p_value) )
  GROUP BY county
  -- NOTE: emit the single blocked sentinel instead of an empty set when a
  -- county-tier request finds NO ccd rows for a state that has no CCD data:
  ;
$$;
```

> ⚠️ Preserve the **blocked-sentinel** behavior: when `p_tier='county'` and the
> state has **no** `ccd` data at all, return exactly one row with
> `out_is_blocked_upstream = true` (and the other columns 0/NULL) rather than an
> empty result. The frontend uses that to switch to its TIGERweb fallback. An
> empty result paints "No data for this filter set." instead.

### 2.2 Stale — wire the matview into the refresh cron

```sql
CREATE OR REPLACE PROCEDURE refresh_crash_lens_matviews()
LANGUAGE plpgsql AS $$
BEGIN
    -- ... existing REFRESH lines ...
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_jurisdiction_breakdown;
END; $$;
```

Make sure this procedure runs **after** every `crashes` load/append, not just on
a fixed nightly timer — if data is loaded ad hoc, call it at the end of the load
job too. Confirm via `cron.job_run_details` that it actually executed after the
most recent `crashes` update.

### 2.3 Wrong blocker — capability gate too aggressive

If the RPC returns the blocked sentinel for a state that **does** have CCD data
(e.g. `ccd_name` is populated but a per-state capability flag says "no CCD"),
fix the gate so the sentinel is returned **only** when `ccd` is genuinely
absent. Check any `state_capabilities` / `has_ccd_assignment` table the RPC
consults and correct the flag for the affected state, or base the decision on
`EXISTS (SELECT 1 FROM crashes WHERE state=... AND ccd_name IS NOT NULL)`.

---

## 3. Smoke tests (run after the fix)

```bash
ANON='...'; BASE='https://srv1503081.hstgr.cloud/rest/v1'
H=(-H "apikey: $ANON" -H "Authorization: Bearer $ANON" -H "Content-Type: application/json")

# County tier — expect multiple ccd rows, <500ms, is_blocked_upstream=false
time curl -s "$BASE/rpc/get_jurisdiction_breakdown" "${H[@]}" \
  -d '{"p_state":"va","p_tier":"county","p_value":"Fairfax County"}' | jq '.[0]'

# State tier — expect one row per county
curl -s "$BASE/rpc/get_jurisdiction_breakdown" "${H[@]}" \
  -d '{"p_state":"va","p_tier":"state","p_value":"Virginia"}' | jq 'length'

# A state with NO ccd data — expect EXACTLY one row, out_is_blocked_upstream=true
curl -s "$BASE/rpc/get_jurisdiction_breakdown" "${H[@]}" \
  -d '{"p_state":"<no-ccd-state>","p_tier":"county","p_value":"<county>"}' \
  | jq '. | {n: length, blocked: .[0].out_is_blocked_upstream}'
```

Browser verification (any device with the app open, devtools console):

```js
await window.crashLensClient.getJurisdictionBreakdown({ tier:'county', value:'Fairfax County' });
// → array of CCD rows with crash_count/epdo/etc.; is_blocked_upstream:false
```

---

## 4. Report back

Post:

1. **Diagnosis** — which §1 row matched (paste `EXPLAIN ANALYZE` + the
   `\sf get_jurisdiction_breakdown` definition + last refresh time).
2. **Fix applied** — §2.1 / §2.2 / §2.3 (with the exact SQL you ran).
3. **Row count** of `mv_jurisdiction_breakdown` after first refresh, and the
   per-state CCD coverage (`have_ccd / total` from §1 query 5).
4. **p95 latency** from the §3 county-tier smoke test (target <500ms).
5. **Refresh duration** + confirmation it's wired to the `crashes` load.
6. Which states return **real CCD rows** vs the **blocked sentinel** (so the
   frontend team knows which states use the TIGERweb fallback).

No JS redeploy is needed — the frontend picks up the corrected RPC
automatically. The companion frontend change already shipped: on the blocked
sentinel, `renderMagisterialDistricts()` hands off to the client-side TIGERweb
renderer (commit on branch `claude/eager-heisenberg-K3Zsr`).
