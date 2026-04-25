# Supabase Backend Cowork Prompt — Crash Lens Detail-Tab Matviews

**Purpose:** Hand this prompt to the AI agent / engineer responsible for the
Crash Lens Supabase database (`https://srv1503081.hstgr.cloud/rest/v1`). It is
self-contained — they should be able to read it, write the SQL, and ship.

**Author context:** The Crash Lens frontend was just refactored
(2026-04-25) so every detail tab tries Supabase first and only falls back
to R2 parquet if Supabase doesn't serve the data. The frontend is already
wired with placeholder client methods (`getHotspots`, `getCrashTree`,
`getGrantsBaseline`, `getSafetyCategories`, `getAnalysisBreakdown`) that
gracefully return `null` until the matviews below exist. Once you ship
each matview, the corresponding tab will auto-detect it and stop hitting
R2.

---

## 0. What's already there

You already maintain these tables/matviews — do **not** rebuild them:

| Object | Purpose | Used by frontend |
|---|---|---|
| `crashes` | Row-level crash table (one row per crash, snake_case columns) | `getCrashes`, `getMapCrashes`, `getCrashesByLocation`, `getViewportCrashes` |
| `dashboard_summary` | Pre-aggregated KPIs by tier × year × severity | `getSummary` (Dashboard) |
| `jurisdiction_baselines` | Per-jurisdiction baselines | `getBaselines` |
| `states` | State registry | `getStates` |

The 7-tier hierarchy is filtered server-side via these columns on `crashes`:

```
federal           → no filter
state             → state                  = eq.<state_key>
region            → dot_district           = eq.<value>
planning_district → planning_district      = eq.<value>
mpo               → mpo_name               = eq.<value>
county            → physical_juris_name    = eq.<value>
city              → physical_juris_name    = eq.<value>
```

The frontend always sends `state = eq.<state_key>` for non-federal tiers, then
adds the tier-column filter on top.

---

## 1. What needs to be built

Five new materialized views (or RPCs if a matview can't satisfy the query
shape — read each section's "Implementation note"). All five should be:

- **Refreshable** — schedule a nightly `REFRESH MATERIALIZED VIEW CONCURRENTLY`
  on the same cron that updates `crashes`.
- **Indexed** — at minimum, btree on every column the frontend filters by
  (state, the tier column, year if present).
- **Granted** — `GRANT SELECT TO anon` so PostgREST exposes them under the
  same anon key the frontend already uses.
- **Performant** — target **<500ms** p95 for any single query (the matview
  rows themselves should be small; we're aggregating 100K-1M crash rows
  into 100-5000 result rows).

EPDO weights to use in any pre-computed `epdo` column:
`K=883, A=94, B=21, C=11, O=1` (FHWA 2025, FHWA-SA-25-021). Some states
override these — store an unweighted `epdo_fhwa2025` plus the raw severity
counts so the frontend can recompute with state-specific weights.

---

### 1.1 `mv_hotspots` — Hot Spots tab

**Purpose:** top intersections + segments per jurisdiction, ranked by EPDO.

**Granularity:** one row per (state, tier_value, road_type, location_type,
location_name).

**Schema:**

```sql
CREATE MATERIALIZED VIEW mv_hotspots AS
SELECT
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    road_type,                              -- 'all_roads'|'dot_roads'|'non_dot_roads'|'primary_roads'
    CASE WHEN node IS NOT NULL AND node <> '' THEN 'intersection'
         ELSE 'segment'
    END                        AS location_type,
    COALESCE(NULLIF(node, ''), rte_name) AS location_name,
    rte_name,                                -- Always populated (for segment context on intersections)
    intersection_name,
    COUNT(*)                   AS total_crashes,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o,
    -- Pre-computed FHWA 2025 EPDO; state-specific weights re-applied client-side if needed
    SUM(CASE crash_severity
        WHEN 'K' THEN 883 WHEN 'A' THEN 94
        WHEN 'B' THEN 21  WHEN 'C' THEN 11
        WHEN 'O' THEN 1   ELSE 0
    END)                       AS epdo,
    SUM(CASE WHEN pedestrian = 'Yes' THEN 1 ELSE 0 END) AS ped_count,
    SUM(CASE WHEN bike = 'Yes' THEN 1 ELSE 0 END)       AS bike_count,
    AVG(x)                     AS lon_centroid,
    AVG(y)                     AS lat_centroid,
    MIN(crash_year)            AS first_year,
    MAX(crash_year)            AS last_year
FROM crashes
WHERE rte_name IS NOT NULL
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         road_type, location_type, location_name, rte_name, intersection_name;

CREATE INDEX mv_hotspots_county_idx
    ON mv_hotspots (state, physical_juris_name, road_type, epdo DESC);
CREATE INDEX mv_hotspots_state_idx
    ON mv_hotspots (state, road_type, epdo DESC);
CREATE INDEX mv_hotspots_region_idx
    ON mv_hotspots (state, dot_district, road_type, epdo DESC);
CREATE INDEX mv_hotspots_mpo_idx
    ON mv_hotspots (state, mpo_name, road_type, epdo DESC);
CREATE INDEX mv_hotspots_pd_idx
    ON mv_hotspots (state, planning_district, road_type, epdo DESC);

GRANT SELECT ON mv_hotspots TO anon;
```

**Frontend method that calls this:** `client.getHotspots(tier, value, { roadType, limit })`.

**Sample query the frontend will run** (Delaware, Kent county, all roads, top 100):

```
GET /rest/v1/mv_hotspots
    ?state=eq.delaware
    &physical_juris_name=eq.Kent
    &road_type=eq.all_roads
    &order=epdo.desc
    &limit=200
```

Expected response: ~100 intersection rows + ~100 segment rows = `<200KB`.

---

### 1.2 `mv_crash_tree` — Crash Tree tab

**Purpose:** hierarchical drill-down counts (severity → factor → location).
The Crash Tree tab supports three "tree types" — `facility`, `crashType`,
`contributing` — each with a different grouping order. To avoid 3 separate
matviews, we use a single matview with a `tree_type` discriminator.

**Schema:**

```sql
CREATE MATERIALIZED VIEW mv_crash_tree AS

-- Facility tree: severity → relation_to_roadway → road_type
SELECT
    'facility'::text           AS tree_type,
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    crash_severity             AS level1,
    relation_to_roadway        AS level2,
    road_type                  AS level3,
    COUNT(*)                   AS total,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         crash_severity, relation_to_roadway, road_type

UNION ALL

-- Crash-type tree: collision_type → severity → road_type
SELECT
    'crashType'::text          AS tree_type,
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    collision_type             AS level1,
    crash_severity             AS level2,
    road_type                  AS level3,
    COUNT(*)                   AS total,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         collision_type, crash_severity, road_type

UNION ALL

-- Contributing-factor tree: contributing_factor → severity → location_type
SELECT
    'contributing'::text       AS tree_type,
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    contributing_factor        AS level1,
    crash_severity             AS level2,
    CASE WHEN node IS NOT NULL AND node <> '' THEN 'intersection' ELSE 'segment' END AS level3,
    COUNT(*)                   AS total,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
WHERE contributing_factor IS NOT NULL AND contributing_factor <> ''
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         contributing_factor, crash_severity, node;

CREATE INDEX mv_crash_tree_lookup_idx
    ON mv_crash_tree (state, tree_type, physical_juris_name);

GRANT SELECT ON mv_crash_tree TO anon;
```

**Frontend method:** `client.getCrashTree(tier, value, { treeType })`.

---

### 1.3 `mv_grants_baseline` — Grants tab

**Purpose:** per-location totals + EPDO + K/A counts for HSIP grant scoring.
Same shape as Hot Spots but **filtered to locations meeting HSIP minima**
(at least 3 crashes OR at least 1 KA crash) so the result set is small.

**Schema:**

```sql
CREATE MATERIALIZED VIEW mv_grants_baseline AS
SELECT
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    road_type,
    CASE WHEN node IS NOT NULL AND node <> '' THEN 'intersection'
         ELSE 'segment' END    AS location_type,
    COALESCE(NULLIF(node, ''), rte_name) AS location_name,
    rte_name,
    crash_year,
    COUNT(*)                   AS total_crashes,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o,
    SUM(CASE crash_severity
        WHEN 'K' THEN 883 WHEN 'A' THEN 94
        WHEN 'B' THEN 21  WHEN 'C' THEN 11
        WHEN 'O' THEN 1   ELSE 0
    END)                       AS epdo,
    SUM(CASE WHEN pedestrian = 'Yes' THEN 1 ELSE 0 END) AS ped,
    SUM(CASE WHEN bike = 'Yes' THEN 1 ELSE 0 END)       AS bike,
    AVG(x)                     AS lon_centroid,
    AVG(y)                     AS lat_centroid
FROM crashes
WHERE rte_name IS NOT NULL
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         road_type, location_type, location_name, rte_name, crash_year
HAVING COUNT(*) >= 3
   OR  SUM(CASE WHEN crash_severity IN ('K','A') THEN 1 ELSE 0 END) >= 1;

CREATE INDEX mv_grants_baseline_county_idx
    ON mv_grants_baseline (state, physical_juris_name, road_type, epdo DESC);
CREATE INDEX mv_grants_baseline_year_idx
    ON mv_grants_baseline (state, crash_year);

GRANT SELECT ON mv_grants_baseline TO anon;
```

**Frontend method:** `client.getGrantsBaseline(tier, value, { roadType, yearFrom, yearTo })`.

---

### 1.4 `mv_safety_categories` — Safety Focus tab

**Purpose:** counts per safety category (curves, work zones, school zones,
ped, bike, speed, alcohol, nighttime, distracted, animal, weather, etc.).

The frontend's Safety Focus tab tracks ~22 categories. Most map to a boolean
or a contributing-factor lookup on the `crashes` table. Pre-aggregating
them is straightforward but verbose — use long-form rows.

**Schema:**

```sql
CREATE MATERIALIZED VIEW mv_safety_categories AS
WITH base AS (
    SELECT
        state, physical_juris_name AS county,
        dot_district AS region, mpo_name AS mpo, planning_district,
        crash_year, crash_severity,
        -- Category flags
        (curve_indicator = 'Yes')                                  AS curves,
        (work_zone = 'Yes')                                        AS work_zone,
        (school_zone = 'Yes')                                      AS school_zone,
        (guardrail_struck = 'Yes')                                 AS guardrail,
        (driver_age >= 65)                                         AS senior,
        (driver_age <= 24)                                         AS young,
        (relation_to_roadway IN ('On Roadside','Off Road'))        AS road_departure,
        (vehicle_count >= 1 AND vehicle_type ILIKE '%truck%')      AS lg_truck,
        (pedestrian = 'Yes')                                       AS pedestrian,
        (bike = 'Yes')                                             AS bicycle,
        (speed_related = 'Yes')                                    AS speed,
        (alcohol_involved = 'Yes')                                 AS impaired,
        (node IS NOT NULL AND node <> '')                          AS intersection,
        (light_condition LIKE '%Dark%' OR light_condition LIKE '%Night%') AS nighttime,
        (distracted = 'Yes')                                       AS distracted,
        (vehicle_type ILIKE '%motorcycle%')                        AS motorcycle,
        (hit_and_run = 'Yes')                                      AS hitrun,
        (weather_condition NOT IN ('Clear','No Adverse Conditions','Unknown')) AS weather,
        (collision_type ILIKE '%animal%')                          AS animal,
        (restraint_used = 'No')                                    AS unrestrained,
        (fatigue = 'Yes')                                          AS drowsy,
        (alcohol_involved = 'Yes' AND speed_related <> 'Yes')      AS alcoholonly
    FROM crashes
)
SELECT
    state, county, region, mpo, planning_district,
    cat AS category,
    COUNT(*) AS total,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM base,
LATERAL (VALUES
    ('curves',       curves), ('workzone', work_zone), ('school', school_zone),
    ('guardrail',    guardrail), ('senior', senior), ('young', young),
    ('roaddeparture', road_departure), ('lgtruck', lg_truck),
    ('pedestrian',   pedestrian), ('bicycle', bicycle), ('speed', speed),
    ('impaired',     impaired), ('intersection', intersection),
    ('nighttime',    nighttime), ('distracted', distracted),
    ('motorcycle',   motorcycle), ('hitrun', hitrun), ('weather', weather),
    ('animal',       animal), ('unrestrained', unrestrained),
    ('drowsy',       drowsy), ('alcoholonly', alcoholonly)
) AS unpivot(cat, flag)
WHERE flag = TRUE
GROUP BY state, county, region, mpo, planning_district, cat;

CREATE INDEX mv_safety_categories_lookup_idx
    ON mv_safety_categories (state, county, category);

GRANT SELECT ON mv_safety_categories TO anon;
```

**Note:** Some category column names in the `base` CTE may not exist in your
schema (e.g., `curve_indicator`, `fatigue`). Drop or rename those before
running. The frontend will gracefully handle missing categories.

**Frontend method:** `client.getSafetyCategories(tier, value, { yearFrom, yearTo })`.

---

### 1.5 `mv_analysis_summary` — Analysis tab

**Purpose:** flat long-form table the Analysis tab can pivot client-side
into yearly / monthly / severity / collision / hour breakdowns.

**Schema:**

```sql
CREATE MATERIALIZED VIEW mv_analysis_summary AS

-- By year
SELECT
    state, physical_juris_name AS county, dot_district AS region,
    mpo_name AS mpo, planning_district,
    'year'::text                     AS dimension,
    crash_year::text                 AS dim_value,
    COUNT(*)                         AS total,
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
GROUP BY state, county, region, mpo, planning_district, crash_year

UNION ALL

-- By month (1-12)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    'month',
    EXTRACT(MONTH FROM crash_date)::text,
    COUNT(*),
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE crash_date IS NOT NULL
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         EXTRACT(MONTH FROM crash_date)

UNION ALL

-- By severity (just 5 rows per jurisdiction)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    'severity',
    crash_severity,
    COUNT(*), 0, 0, 0, 0, 0   -- detail breakdown not needed; total = K|A|B|C|O directly
FROM crashes
WHERE crash_severity IN ('K','A','B','C','O')
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district, crash_severity

UNION ALL

-- By collision type (top categories)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    'collision',
    collision_type,
    COUNT(*),
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE collision_type IS NOT NULL AND collision_type <> ''
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district, collision_type

UNION ALL

-- By hour (0-23)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    'hour',
    SUBSTRING(LPAD(crash_military_time, 4, '0') FROM 1 FOR 2),
    COUNT(*),
    SUM(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    SUM(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE crash_military_time IS NOT NULL AND crash_military_time <> ''
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         SUBSTRING(LPAD(crash_military_time, 4, '0') FROM 1 FOR 2);

CREATE INDEX mv_analysis_summary_lookup_idx
    ON mv_analysis_summary (state, physical_juris_name, dimension);

GRANT SELECT ON mv_analysis_summary TO anon;
```

**Frontend method:** `client.getAnalysisBreakdown(tier, value, { yearFrom, yearTo })`.

---

## 2. Refresh schedule

Wrap all five matview refreshes in a single procedure and run nightly via
`pg_cron` (or whatever scheduler you use):

```sql
CREATE OR REPLACE PROCEDURE refresh_crash_lens_matviews()
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_hotspots;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_crash_tree;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_grants_baseline;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_safety_categories;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_analysis_summary;
END;
$$;

-- pg_cron example:
SELECT cron.schedule('crash_lens_matview_refresh', '15 3 * * *',
    'CALL refresh_crash_lens_matviews()');
```

`CONCURRENTLY` avoids blocking reads — but it requires a unique index on the
matview, so add one (e.g. on `(state, physical_juris_name, road_type,
location_type, location_name)` for `mv_hotspots`).

---

## 3. Smoke tests

After each matview ships, run these from the frontend's perspective:

```bash
# 1. Hot Spots — Delaware Kent county top 10
curl -s "https://srv1503081.hstgr.cloud/rest/v1/mv_hotspots?state=eq.delaware&physical_juris_name=eq.Kent&road_type=eq.all_roads&order=epdo.desc&limit=10" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" | jq '.[0]'

# 2. Crash Tree — facility tree for Kent
curl -s "https://srv1503081.hstgr.cloud/rest/v1/mv_crash_tree?state=eq.delaware&tree_type=eq.facility&physical_juris_name=eq.Kent&limit=20" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY" | jq '. | length'

# 3. Grants baseline — Sussex 2020-2024
curl -s "https://srv1503081.hstgr.cloud/rest/v1/mv_grants_baseline?state=eq.delaware&physical_juris_name=eq.Sussex&and=(crash_year.gte.2020,crash_year.lte.2024)&limit=5" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"

# 4. Safety categories — Statewide DE
curl -s "https://srv1503081.hstgr.cloud/rest/v1/mv_safety_categories?state=eq.delaware&limit=22" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"

# 5. Analysis breakdown — Statewide DE
curl -s "https://srv1503081.hstgr.cloud/rest/v1/mv_analysis_summary?state=eq.delaware&dimension=eq.year" \
    -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"
```

Each should return in under 500ms with a non-empty array. If you get
`relation does not exist`, the matview hasn't shipped yet (frontend will keep
falling back to R2 until it does — no degradation).

---

## 4. Reporting back

When you ship each matview, post in the team channel with:

1. Matview name + which Crash Lens tab it powers.
2. Row count after first refresh (sanity check — `mv_hotspots` for Delaware
   should be in the 1K-10K range, `mv_crash_tree` in the 10K-100K range).
3. p95 query latency from one of the smoke tests above.
4. Refresh duration (so we can budget the nightly cron window).

The frontend will pick each one up automatically — no redeploy needed on
the JS side. To verify a matview is live from the browser, open devtools
and run:

```js
await window.crashLensClient.getHotspots('county', 'Kent', { roadType: 'all_roads' });
// Should return { intersections: [...], segments: [...] } when matview is live
// Returns null when matview missing (frontend falls back to R2)
```

---

## 5. Out of scope (future tickets)

- **Trigram indexes for fuzzy `route` / `intersection` search** — would let
  us drop the client-side ILIKE fallback in `_supabaseCrashes`. Separate ticket.
- **PostGIS RPC for viewport queries** — `mv_map_tiles` could pre-aggregate
  crash dots by H3 hex at zoom levels 5/8/12, replacing the current
  point-by-point `getMapCrashes` for low zooms. Separate ticket.
- **Statewide aggregate matview** — already exists as `dashboard_summary`;
  no change needed.
