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

## 2026-05-10 Round 12 — Detail data + Asset Deficiency wiring
- Backend (already applied to live Supabase by Murad 2026-05-10):
  - `mv_safety_categories` extended with `alcohol` (4,058 DE) + `drug`
    (1,341 DE) categories. `impaired` retained as the (alcohol OR drug)
    union for back-compat.
  - NEW `mv_analysis_extra` (4,069 DE rows) — adds `dow`, `roadsurface`,
    `trafficcontrol`, `firstevent` dimensions. Same row schema as
    `mv_analysis_summary` so `getAnalysisBreakdown` can union them.
  - NEW `mv_hotspots_detail` (31,160 DE rows) — per (state, location_type,
    location_name) JSONB breakdowns (by_year/month/dow/hour/collision/
    weather/light/roadsurface/trafficctrl/firstevent) plus per-factor
    counts (alcohol/speed/distracted/drowsy/drug/hitrun/ped/bike/moto/
    senior/young/unrestrained/workzone/school/night/adverse_weather).
  - NEW `mv_pedbike_locations` (6,129 DE rows) — top ped/bike crash
    locations per mode + at_intersection/night counts.
  - NEW `mv_safety_focus_locations` (173,151 DE rows) — top crash
    locations per Safety Focus category.
  - NEW `find_crashes_near_assets(state, assets jsonb, radius_ft, ...)` RPC
    for the Asset Deficiency spatial join.
- Frontend (this branch):
  - `assets/js/data-client.js`: added `getAnalysisExtra`, `getHotspotDetail`,
    `getPedBikeLocations`, `getSafetyFocusLocations`, `findCrashesNearAssets`.
    `getAnalysisBreakdown` now unions mv_analysis_extra into the same
    response (byDow/byRoadSurface/byTrafficControl/byFirstEvent buckets) so
    existing Dashboard fallbacks (chartDOW) light up automatically.
  - `app/modules/data/prewarm.js`: added `mv_pedbike_locations:pedestrian`,
    `mv_pedbike_locations:bicycle`, and `mv_analysis_extra` to `_buildBatch`.
  - `app/index.html`:
    - Dashboard chartDOW placeholder text updated; data now sourced
      transparently via `getAnalysisBreakdown`.
    - Ped/Bike: new `renderPedBikeLocationsFromMatview` populates the
      Pedestrian/Bicycle High-Crash Locations tables and rebuilds the
      Location Type pies from `mv_pedbike_locations` (fixes the
      "100
## 2026-05-10 Round 12 — Detail data + Asset Deficiency wiring
- Backend (already applied to live Supabase by Murad 2026-05-10):
  - `mv_safety_categories` extended with `alcohol` (4,058 DE) + `drug`
    (1,341 DE) categories. `impaired` retained as the (alcohol OR drug)
    union for back-compat.
  - NEW `mv_analysis_extra` (4,069 DE rows) — adds `dow`, `roadsurface`,
    `trafficcontrol`, `firstevent` dimensions. Same row schema as
    `mv_analysis_summary` so `getAnalysisBreakdown` can union them.
  - NEW `mv_hotspots_detail` (31,160 DE rows) — per (state, location_type,
    location_name) JSONB breakdowns (by_year/month/dow/hour/collision/
    weather/light/roadsurface/trafficctrl/firstevent) plus per-factor
    counts (alcohol/speed/distracted/drowsy/drug/hitrun/ped/bike/moto/
    senior/young/unrestrained/workzone/school/night/adverse_weather).
  - NEW `mv_pedbike_locations` (6,129 DE rows) — top ped/bike crash
    locations per mode + at_intersection/night counts.
  - NEW `mv_safety_focus_locations` (173,151 DE rows) — top crash
    locations per Safety Focus category.
  - NEW `find_crashes_near_assets(state, assets jsonb, radius_ft, ...)` RPC
    for the Asset Deficiency spatial join.
- Frontend (this branch):
  - `assets/js/data-client.js`: added `getAnalysisExtra`, `getHotspotDetail`,
    `getPedBikeLocations`, `getSafetyFocusLocations`, `findCrashesNearAssets`.
    `getAnalysisBreakdown` now unions mv_analysis_extra into the same
    response (byDow/byRoadSurface/byTrafficControl/byFirstEvent buckets) so
    existing Dashboard fallbacks (chartDOW) light up automatically.
  - `app/modules/data/prewarm.js`: added `mv_pedbike_locations:pedestrian`,
    `mv_pedbike_locations:bicycle`, and `mv_analysis_extra` to `_buildBatch`.
  - `app/index.html`:
    - Dashboard chartDOW placeholder text updated; data now sourced
      transparently via `getAnalysisBreakdown`.
    - Ped/Bike: new `renderPedBikeLocationsFromMatview` populates the
      Pedestrian/Bicycle High-Crash Locations tables and rebuilds the
      Location Type pies from `mv_pedbike_locations` (fixes the
      "100% Non-Intersection" bug). New
      `renderPedBikeComparisonTableFromCats` populates the
      Pedestrian-vs-Bicycle Comparison table from mv_safety_categories.
    - Safety Focus: `_hydrateSafetyLocationsFromMatview(category)` hydrates
      the Top Locations table from `mv_safety_focus_locations` when in
      matview mode (no sampleRows). `alcoholonly` UI card now reads from
      the new `alcohol` matview category. The 6 truly-zero categories
      (workzone/senior/young/lgtruck/hitrun/drowsy) now label "No data
      for this state" instead of "(matview pending)".
    - F&S: `_hydrateFSHotspotsFromMatview` populates
      `fatalSpeedingState.{fatalData,speedData}.byRoute` from
      `mv_safety_focus_locations`, so Fatal/Speed/Combined hotspot tables
      paint at aggregate tier.
    - Hot Spots / Intersection detail panels: new
      `_hydrateHotspotDetailFromMatview(which)` fetches per-location
      `mv_hotspots_detail` rows and merges JSONB dim buckets and factor
      counts into the panel `aggregatedData`, then re-renders. Charts
      (Yearly/Monthly/DoW/Hour/Collision/Weather/Light/RoadSurface/
      TrafficCtrl) now populate end-to-end without sampleRows.
    - Asset Deficiency: when `crashState.mapPoints` is empty,
      `assetRunAnalysis` now falls back to
      `assetRunAnalysisViaRpc(activeAssets)` which calls the new
      `find_crashes_near_assets` RPC and reshapes results into
      `assetState.associations`. Prioritized Infrastructure Locations
      table now populates with 464+ transit-stop / school inputs at
      aggregate tier.
- Migration source-of-truth: 7 placeholder SQL files committed under
  `docs/supabase/migrations/2026-05-10_round12_*.sql`. Bodies to be
  inserted from Cowork apply log in a follow-up.
- Tabs verified end-to-end: Dashboard, Safety Focus, F&S, Hot Spots,
  Intersection, Ped/Bike, Asset Deficiency.
- Deferred to Round 13: Dashboard Census Subdivisions (CCD) table —
  needs TIGER subdivision boundary ingestion + spatial join. Crash Tree
  K/A in deep nodes — frontend tree-walker bug, requires investigation.

## 2026-05-11 Round 16 — Map factor-chip parity + state capabilities + AADT bulk-import + Email Edge Function + Crash Tree §0
- §0 Crash Tree severity walker (Round 15 carry-over): added a post-order recursive aggregator in `initCrashTreeFromMatview` (`app/index.html`) that propagates `k/a/b/c/o/K/A/B/C/O/ka/kaPct/unfilteredKA` up from children to every non-leaf node. Defensive against missing per-row severity columns in `mv_crash_tree`. KA values on D…FOCUS / facility-class children now reflect real counts instead of 0.
- §2 data-client: 4 new methods on `CrashLensDataClient` (`assets/js/data-client.js`).
  - `getMapMetrics({state,juris,mpo,pd,factor})` — REST GET `/mv_map_metrics`.
  - `getStateCapabilities(state)` — REST GET `/states` with `or=(abbr.ilike,name.ilike)`.
  - `aadtBulkImport(rows)` — RPC POST `/rpc/aadt_bulk_import`.
  - `formatScheduledReportEmail(queueId)` — RPC POST `/rpc/format_scheduled_report_email`.
- §3 Map factor-chip parity: `app/index.html` now renders a 13-chip rail (18 factors minus 5 hidden by DE capabilities) in `#mapFactorChips`, populated by `renderMapFactorChips()` and re-rendered on every Map-tab show and on `CL:tierChanged`. Each chip shows `total` + a fatal sub-count when k>0.
- §4 BLOCKED-UPSTREAM honest banner: capability cache + `getActiveStateCapabilities()`, `applySafetyFocusCapabilityGates()` (drowsy/hitrun/lgtruck/young/senior → "—" + ⓘ tooltip badge), `applyInjuryBCCapabilityGate()` (kpiInjuryBC → "—" when both `has_severity_b` and `has_severity_c` are false). Hooks fire from `showTab('safety')` and after the Dashboard KPI strip render.
- §5 AADT bulk-import UI: "📥 Import AADT" button next to "📈 ADT Data" on Hot Spots opens a modal with a paste-CSV textarea. `submitAadtImport()` parses, normalizes types, POSTs via `aadtBulkImport`, then re-renders hotspot rates.
- §6 Email Edge Function: `supabase/functions/send_scheduled_emails/index.ts` — pulls due `email_send_queue` rows, calls `format_scheduled_report_email`, sends via SendGrid, then patches `sent_at` on success or increments `attempts` + records `error` on failure. Deploy with `supabase functions deploy send_scheduled_emails`.
- Verification (manual): `crashLensClient.getMapMetrics()` returns rows; chip count ≥ 13 for DE; `getStateCapabilities()` reports `has_drowsy_flag=false`; Crash Tree D-node KA > 0.

## 2026-05-11 Round 17 — Tier-adaptive Jurisdiction Breakdown + filter-audit enrichment
- §2 data-client: new `getJurisdictionBreakdown({state, tier, value})` on `CrashLensDataClient` (`assets/js/data-client.js`) — RPC POST `/rpc/get_jurisdiction_breakdown`, normalizes `out_*` columns into JS-friendly keys (`breakdown_kind`, `label`, `crash_count`, `fatals`, `serious`, `epdo`, `ped_count`, `bike_count`, `ka_rate_pct`, `is_blocked_upstream`).
- §3/§4 `renderMagisterialDistricts` rewritten as tier-adaptive in `app/index.html`: state/federal/region → 3+ county cards, MPO/PD → counties-in-scope, county → CCD cards or BLOCKED-UPSTREAM banner, city → single host-county card. Section title updates per tier via `#magisterialDistrictTitle`. Listener on `jurisdictionChanged` re-renders. Renders into `#magisterialDistrictContainer` if present, else legacy `#districtStatisticsContainer`.
- §5 click-to-drill: clicking a "county" card from state/MPO/PD rollups calls `setTierAndJurisdiction('county', label)` (no-op when helper isn't available).
- §9.5 date-safe `computeDayOfWeekAnalysis`, `computeHourlyDistribution`, `computeMonthlyTrends`: defensive parse (numeric epoch → ISO fallback → bail on Invalid Date) — fixes the Comprehensive Quarterly Report crash on `days[undefined].count`.
- §9.6 stop 200K bulk-fetch: `getCrashes(filters.all=true, maxRows>10000)` now chunks via PostgREST `Range:` header (10K rows/request) — eliminates statement-timeout 500s. Comprehensive Quarterly Report cap dropped from 200K → 100K (chunks internally).
- §9.1 Hot Spots / Intersection detail drilldown: `_hydrateHotspotDetailFromMatview` now maps each selected location's `loc` (display name) → `nodeId` via `crashState.hotspots` before calling `mv_hotspots_detail` (the matview keys on raw node id, not display name). Post-process re-buckets `byHour` → `byPeakPeriod` (AM/Midday/PM/Night) so the Time-of-Day chart paints; rebuilds `byMonth` keys from `"M"` → `"YYYY-MM"` proportionally weighted by each year's total so the Monthly Heatmap shows seasonal patterns. Same fix applies to the Intersection panel via `which='intersection'`.
- §9.4 Dashboard comparisons: `crashDataLoaded` listener for `source=supabase` now fires `updateDashboardTierSections()` so region/MPO/county comparison tables hydrate from `mv_dashboard_comparisons` in Supabase-only mode (previously `updateDashboard()` was intentionally skipped to avoid zeroing matview-painted KPIs, but that also skipped comparisons).
- §9.7 404-spew gate: new `_isApiBackendAvailable()` one-shot probe (`/api/notify/status`) caches result on `window._apiBackendAvailable`. Preferences/Subscribers/Forecasts call sites short-circuit when backend is offline. Forecasts now prefer Supabase `getForecasts({jurisdiction})`, subscribers prefer Supabase `listEmailSubscribers(state)`. Eliminates the `/api/preferences/load`, `/api/subscribers/db/load`, `/api/subscribers/load`, `/api/forecasts/check` 404 spew on GitHub Pages.
- §9.8 Supabase REST retry: `_supabaseQuery` wraps fetch in a 3-attempt loop with exponential backoff (200ms, 400ms) for transient `ERR_CONNECTION_CLOSED` / `Failed to fetch` / `NetworkError` errors. Non-transient errors (HTTP 4xx/5xx) surface immediately.
- Verification: `crashLensClient.getJurisdictionBreakdown({tier:'state'})` returns 3 DE counties; `tier:'county', value:'Kent County'` returns BLOCKED-UPSTREAM sentinel; `tier:'city', value:'Dover'` returns single host-county card. Section title updates correctly on tier change. Hot Spots detail panel charts paint when sampleRows is empty.
