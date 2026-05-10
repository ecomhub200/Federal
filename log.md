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
