# Federal — Change Log

## 2026-05-10 Round 10 — Apply migration + 3 perf bugfixes
- Task 1: polished `docs/supabase/migrations/2026-05-10_round9_perf_indexes_and_cron.sql` for manual apply by Murad. Uncommented Section 4 warm refreshes, added "How to apply" header block, moved verification queries into a runnable VERIFICATION section, added curl smoke test as a comment block.
  - Expected after Murad applies: dashboard_summary <300 ms (was 11–22 s).
- Task 2: `app/sw.js` now precaches `/Federal/app/` (directory URL) alongside `index.html` and aliases both URLs to the same cache entry in the fetch handler. Bumped `CACHE_NAME` to `crashlens-v20260511-r10` so the SW reinstalls.
  - Expected: warm reload `transferSize` <5 KB (was 12.4 MB), load event 5.2 s → ~1.5 s.
- Task 3: `_summaryCacheKey` in `app/modules/data/supabase-bridge.js` now normalizes filter objects (sorted keys, empty-array elision, sorted array contents) so equivalent specs share a cache slot.
  - Expected: ≤1 dashboard_summary call per state-change (was 3-4); 2nd-Nth callers log `[Phase2] summary cache hit`.
- Task 4: removed `(CL.data && CL.data.cachedMatview) ? ... : ...` conditional fallbacks in `app/index.html` (Dashboard charts, Intersections × 4, Ped/Bike, Fatal&Speed) and wrapped remaining unwrapped matview-style fetchers (`getGrantsBaseline`, `getHotspots`, `getHotspotsTopCollision`, `getHotspotsFactors`, `getSafetyCategories`, `getSummary`, `getAnalysisBreakdown`) in `CL.data.cachedMatview`. Live row fetchers (`getCrashes`, `getViewportCrashes`, `getCrashesByLocation`) intentionally untouched.
  - Expected: `matviewCacheStats().entries.length` ≥6 after a tab sweep; tier-change re-paint <500 ms warm.
- Task 5: code-splitting deferred — `chunk-loader.js` scaffold ready, `TAB_TO_CHUNK` still empty.

Cold-start TTI target: 12 s → 1.5 s. Warm reload target: 5.2 s → 1 s. Matches Round 9 targets.

## 2026-05-10 Round 11 — Parallel matview pre-warm during Upload tab
- New module `app/modules/data/prewarm.js` orchestrates parallel matview fetches (Promise.allSettled, debounced 800 ms, gated to Upload tab). Public API: `CL.data.prewarm.{schedule,runNow,cancel,stats}`.
- Wired from `injectFastDashboard` (`app/modules/data/supabase-bridge.js`) so pre-warm overlaps the dashboard fetch — fires immediately after `resolveTier()` resolves.
- Wired from `jurisdictionChanged` handler (`app/index.html`) to catch county/city/region/MPO/PD switches that don't go through full state-change.
- Registered in script load order after `matview-cache.js`; added to `app/sw.js` STATIC_PRECACHE so warm visits load it from cache.
- Up to 9 matviews pre-warmed in ~1.5–2.5 s wall-clock during Upload-tab idle time (Dashboard, Safety Categories, Crash Tree, Analysis, Hot Spots, Hotspot Factors, Intersection, Ped/Bike, Factor Year — `typeof === 'function'` guards skip any matview the active state's client doesn't expose).
- Expected: Tab clicks (Map/Hot Spots/Intersections/Ped/Bike/Analysis/F&S) drop from 1–2 s each to <200 ms (cache hits). Cumulative wait across first session: ~8 s → <1 s.
- Diagnostic: `CL.data.prewarm.stats()` + `CL.data.matviewCacheStats()` for live profiling.
- Doc: added "Performance: matview pre-warming" section to `CLAUDE.md` so future contributors keep `_buildBatch` in sync when adding new matview-backed tabs.

## 2026-05-10 Round 11.1 — Hot Spots prewarm cache gap + Round-9 SQL corrections committed
- `prewarm.js` now pre-warms `mv_hotspots` (with matching `topN` keyExtra),
  `mv_hotspots_topcoll`, `mv_hotspots_factors` (both state-scoped). Extended
  `_buildBatch.push()` signature to accept `keyExtra`, `tierOverride`, and
  `valueOverride` so state-scoped fetchers cache against `state:<stateKey>`
  while per-tier fetchers stay tier-keyed. Removed the dead
  `getHotspotFactors` (singular) and `getFactorYear` blocks — the actual
  client method is `getHotspotsFactors`, and `mv_factor_year` doesn't exist.
- Throttled `runNow` from `Promise.allSettled(all)` to waves of 3 to avoid
  saturating the self-hosted Supabase connection pool — live test showed the
  concurrent `dashboard_summary` fetch ballooning to 14.5 s when 7 prewarm
  fetches landed at once. Wall-clock ~1.5 s slower but leaves ≥2 connections
  free for the user-visible foreground summary.
- Pre-warm batch size 7 → 9; Hot Spots tab now zero-RPC cache hit (was 3
  RPCs on click). 6 of 6 cacheable analysis tabs now instant.
- Committed `docs/supabase/migrations/2026-05-10_round9_perf_actual_schema_corrections.sql`
  — the schema-actual UNIQUE indexes (using PG15 `NULLS NOT DISTINCT`) Murad
  applied manually 2026-05-10 via Cowork after the original Round-9
  migration's `IF EXISTS` defensive blocks skipped them silently. Adds
  `_uniq` indexes for `mv_analysis_summary`, `mv_safety_categories`,
  `mv_pedbike_breakdowns`, `mv_intersection_summary`, `mv_crash_tree`,
  `mv_hotspots_factors`, `mv_hotspots_topcoll`, plus `_concurrent_uq`
  sibling indexes for `mv_hotspots` and `mv_grants_baseline` (whose
  existing UNIQUE indexes wrap `COALESCE(...)` expressions and aren't
  eligible for `REFRESH ... CONCURRENTLY`).
- Doc: added "IMPORTANT: cache-key alignment" callout to `CLAUDE.md`'s
  matview pre-warming section so future contributors keep loader and
  prewarm `keyExtra` in lockstep.
