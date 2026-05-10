## 2026-05-10 Round 10 — Apply migration + 3 perf bugfixes

- **Task 1 (NOT YET APPLIED — needs human/operator):** the SQL migration at
  `docs/supabase/migrations/2026-05-10_round9_perf_indexes_and_cron.sql`
  could not be applied via the connected Supabase MCP because the only
  project visible to it is `pobyjymyfxmthhspeftg` (`ai-student-success`,
  region us-east-2, status INACTIVE) — the wrong project, and inactive
  besides. The Round 9 brief specifies `supabase-self-hosted` MCP
  pointing at `srv1503081.hstgr.cloud`; that server isn't wired up in
  this session. Operator must apply the migration via Studio → SQL
  Editor on the self-hosted instance. Until applied, dashboard_summary
  REST queries continue to take 11–22 s (the live-test root cause).
- **Task 2:** `app/sw.js` — bumped `CACHE_NAME` to
  `crashlens-v20260511-r10`; added `/Federal/app/` to STATIC_PRECACHE;
  added a directory-URL alias handler that returns the
  `/Federal/app/index.html` cache entry for both `/Federal/app/` and
  `/Federal/app/index.html`. Warm reload should drop from 5.2 s to
  ~1.5 s once SW reinstalls.
- **Task 3:** `app/modules/data/supabase-bridge.js` —
  `_summaryCacheKey` now sorts keys, drops empty/null/empty-array
  values, and sorts array values. Equivalent specs across auto-load,
  injectFastDashboard, and the retry path now share a single cache
  slot (was 3-4 fresh `dashboard_summary` calls per state-change).
- **Task 4:** `app/index.html` (15 call sites) +
  `app/modules/data/supabase-map-bridge.js` — wrapped every
  remaining matview-style fetcher in `CL.data.cachedMatview`
  (`getGrantsBaseline`, all `getHotspots`, `getHotspotsTopCollision`,
  `getHotspotsFactors`, `getAnalysisBreakdown`, `getSafetyCategories`).
  Removed the `(CL.data && CL.data.cachedMatview) ? ... : ...`
  conditional fallbacks for `getIntersectionSummary` (3 sites) and the
  PedBike trio. Marked `getViewportCrashes` with `// no-cache: live`.
  After these wraps, `matviewCacheStats().entries.length` should
  grow as the user visits Dashboard → Map → Hot Spots → Intersections
  → Ped/Bike → F&S.
- **Task 5 (deferred):** code-splitting `index.html` is intentionally
  left for a follow-up branch — most of the perceived speed-up will
  come from Task 1 alone.

Cold-start TTI and warm-reload metrics will not improve to the brief's
targets until Task 1 has been applied to the live Supabase instance.
