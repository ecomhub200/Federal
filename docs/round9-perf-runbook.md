# Round 9 Performance Runbook

This document covers everything in the Round 9 perf brief, what shipped in
code, what's queued for operator action, and the verification checklist.

---

## Code changes (already on `claude/optimize-crash-lens-performance-DGkyn`)

| Fix | What | Files |
|-----|------|-------|
| **1A** | 60-s in-memory cache for `getSummary` (LRU 50, TTL 60s) | `app/modules/data/supabase-bridge.js` |
| **3** | Shimmer skeleton placeholders for KPIs/charts | `app/modules/ui/skeletons.js`, CSS in `app/index.html` |
| **4** | Service worker — stale-while-revalidate for static assets | `app/sw.js` + registration in `app/index.html` |
| **5** | `paintWhenVisible()` IntersectionObserver wrapping for the 8 dashboard `createChart` calls | `app/index.html` |
| **6** (partial) | `defer` attribute on jsPDF / autotable / html2canvas / marked / docx CDN tags + chunk-loader scaffolding | `app/index.html`, `app/modules/data/chunk-loader.js` |
| **7** | Shared matview cache (`CL.data.cachedMatview`) wrapping `getIntersectionSummary`, `getSafetyCategories`, `getAnalysisBreakdown`, `getPedBikeBreakdowns` | `app/modules/data/matview-cache.js` + 4 sites in `app/index.html` |

---

## Operator actions (required for full speed-up)

### A. Apply the SQL migration

**File:** `docs/supabase/migrations/2026-05-10_round9_perf_indexes_and_cron.sql`

What it does:
- Adds **5 covering indexes** on `dashboard_summary` (one per tier-filter
  pattern: county / district / mpo / planning_district / state). Without
  these, queries that don't filter the leading composite-index column do
  a sequential scan.
- Adds **UNIQUE indexes** to every matview so `REFRESH … CONCURRENTLY`
  works without taking an `AccessExclusiveLock`. Each is wrapped in a
  `DO $$ … EXCEPTION WHEN undefined_column $$;` block so the migration
  is idempotent and won't error if a matview's actual columns differ
  from what's expected — instead you get a `RAISE NOTICE` line you can
  use to fix the index definition.
- Schedules **daily pg_cron refreshes** for all matviews, staggered
  04:00–06:00 UTC at 15-minute intervals. Drops + reschedules so it's
  re-runnable.

Pre-flight (run once):
```sql
-- 1. Confirm pg_cron is installed:
SELECT 1 FROM pg_extension WHERE extname = 'pg_cron';
-- If empty: CREATE EXTENSION pg_cron;
-- (Requires superuser — run via Supabase Studio → Database → Extensions
--  or the postgres role.)

-- 2. List the matviews that actually exist:
SELECT schemaname, matviewname FROM pg_matviews
 WHERE schemaname = 'public'
 ORDER BY matviewname;
```

If a matview listed in the migration doesn't exist on your instance, it
will be silently skipped (each cron block is gated on
`pg_matviews` existence). If a matview's column list differs from what
the migration expects (e.g. `mv_safety_categories` doesn't have a `year`
column), the unique index for that matview will be skipped with a
`RAISE NOTICE` — edit the index definition in the migration to match
your actual schema and re-run.

How to apply:

| Method | Steps |
|---|---|
| **Supabase Studio** | SQL Editor → paste the file contents → Run |
| **psql (direct connection)** | `psql -h srv1503081.hstgr.cloud -p 5433 -U postgres -d postgres -f docs/supabase/migrations/2026-05-10_round9_perf_indexes_and_cron.sql` |
| **Supabase MCP** (if reachable) | `mcp__…__apply_migration` with the file's contents |

After applying, run the verification queries at the bottom of the SQL
file. The previously-slow `dashboard_summary` query should drop to
<500 ms; `cron.job` should have 7-8 entries.

### B. Cloudflare CDN in front of GitHub Pages

This step lives outside the codebase. The big win is HTTP/2 + Brotli +
edge caching, which collapses module-load head-of-line blocking on
GitHub Pages's HTTP/1.1 origin (~1.8 s per `.js` → ~80–120 ms each).

Steps:
1. **Pick a subdomain** (e.g. `app.crashlens.dev` — use whichever zone
   is already in your Cloudflare account).
2. **Add a CNAME**: `app` → `ecomhub200.github.io` in Cloudflare DNS.
   Leave proxy status **on** (orange cloud).
3. **GitHub Pages settings** for the `Federal` repo → Custom domain →
   `app.crashlens.dev` → tick "Enforce HTTPS".
4. **Page Rules** in Cloudflare:
   - `app.crashlens.dev/Federal/app/modules/*` → Cache Everything,
     Edge TTL **1 month**
   - `app.crashlens.dev/Federal/app/chunks/*` → Cache Everything,
     Edge TTL **1 month** (in advance of any future code-split work)
   - `app.crashlens.dev/Federal/app/index.html` → Cache Everything,
     Edge TTL **1 hour**, Bypass Cache on Cookie
   - `app.crashlens.dev/Federal/app/sw.js` → Cache Everything,
     Edge TTL **5 minutes** (so SW updates propagate quickly)
5. **Auto-enabled by Cloudflare**: HTTP/2, HTTP/3, Brotli, TLS 1.3.
6. **(Optional, paid)** Tiered Cache + Argo Smart Routing for ~30%
   additional speed-up on cold cache misses.

Once propagated, point the test harness at the new domain:
`https://app.crashlens.dev/Federal/app/?cachebust=$(date +%Y%m%d%H%M)`
and confirm module loads drop from ~1.8 s to ~120 ms in the Network panel.

---

## Deferred (not done — see brief for why)

### Fix 6 (full code-split)

The brief explicitly flags this as **"1–2 days, biggest engineering
effort, defer until everything else is in"**. The current monolith is
158K lines / 12 MB / 75 inline scripts with extensive cross-tab function
references. A safe split needs:

1. Per-tab function-usage audit (which functions are called from outside
   the tab they "belong" to)
2. Fence comments around each tab block
3. Run `scripts/split_index.py` (per the brief)
4. Manual verification of every tab path
5. Diff between `index.html` and `index.lean.html` to catch glue code
   that ended up in the wrong chunk

What **did** ship to make a future split easier:
- `app/modules/data/chunk-loader.js` — adds `CL.data.loadChunkOnce()` +
  a `showTab()` wrapper. Today the `TAB_TO_CHUNK` map is empty; once a
  chunk is extracted, add one entry and the lazy-load wires up
  automatically. `app/chunks/<name>.js` requests fail soft until the
  file actually exists, so this scaffolding is harmless to ship now.
- `defer` attribute on the 5 heavyweight CDN libraries (jsPDF, autotable,
  html2canvas, marked, docx — combined ~700 KB) gives most of Fix 6's
  cold-boot benefit without the regression risk.

### Fix 1B (`dashboard_summary_mv` aggregated matview replacement)

The brief assumed `dashboard_summary` was a row-projection VIEW that
needed to be aggregated. **It's already a matview**
(`docs/supabase/migrations/2026-04-30_dashboard_summary_road_type.sql`).
The slowness it observed (6–33 s, 0 KB responses) is from missing
covering indexes plus PostgREST timeouts during background refreshes
that lacked a unique index — both addressed by the Round 9 SQL
migration above. No matview rewrite needed.

---

## Verification protocol

After deploying the branch (and after running the SQL migration), open
the deployed app in Chrome and run:

```js
// Cold-start TTI measurement (paste in DevTools console)
performance.mark('test-start');
document.getElementById('stateSelect').value = '10';   // Delaware FIPS
document.getElementById('stateSelect').dispatchEvent(new Event('change', { bubbles: true }));
const intv = setInterval(() => {
    const v = document.getElementById('kpiCrashes')?.textContent;
    if (v && v !== '0' && v !== '—' && !document.querySelector('#kpiCrashes .kpi-skel')) {
        performance.mark('test-end');
        const m = performance.measure('cold-start-tti', 'test-start', 'test-end');
        console.log(`Cold-start TTI: ${Math.round(m.duration)} ms`);
        clearInterval(intv);
    }
}, 50);
setTimeout(() => clearInterval(intv), 30_000);
```

Targets per the brief:

| Metric | Today | After PRs 1+3+5+6+7 (this branch, no SQL) | After + SQL | After + Cloudflare |
|---|---|---|---|---|
| Cold-start TTI | ~12 s | ~6–8 s | ~3 s | <2 s |
| `dashboard_summary` query | 6–33 s | unchanged | <500 ms | <500 ms |
| Tier-change re-paint | ~6 s | ~1.5 s (cache hit) | <800 ms | <500 ms |
| Module load (.js each) | ~1.8 s | ~1.8 s | ~1.8 s | ~120 ms |
| Repeat-visit TTI | ~12 s | ~1 s (SW cached) | ~800 ms | <500 ms |

The biggest single visible win (Cloudflare) requires Step B above —
nothing in the codebase can fix HTTP/1.1 head-of-line on GitHub Pages.

---

## Caveats

- **Service worker scope.** `app/sw.js` is registered with scope
  `/Federal/app/` (driven by its own URL). It only intercepts assets
  under that path — the marketing pages at `/Federal/` are unaffected.
  If the app ever moves to a subdomain, update the path in the
  registration block in `app/index.html`.
- **Skeleton flash on tier change.** The skeleton is added every time
  `injectFastDashboard` runs. If the matview cache hit returns
  synchronously, the skeleton may briefly flash before being overwritten.
  Acceptable — the alternative (only show on cache miss) requires
  exposing cache state through the bridge, which isn't worth the
  complexity. If users complain, gate `showKpis()` on cache-miss.
- **Cache invalidation.** Both `_summaryCache` (in `supabase-bridge.js`)
  and `CL.data.cachedMatview` use a 60-second TTL. There is no
  explicit invalidation on tier change because each tier produces a
  different cache key. If the underlying data changes mid-session
  (e.g. a fresh upload), users won't see it for up to 60 seconds.
  Acceptable for read-only dashboards; revisit if write paths land.
