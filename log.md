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

## 2026-05-11 Round 18 — Global FilterEngine, ChartRegistry, flyTo NaN guard, 17 audit fixes
- Filter audit fixes shipped: §2 global FilterEngine (`assets/js/filter-engine.js`) — subscription model wires Dashboard / Hot Spots / Intersections / F&S / Ped-Bike date / severity / min-crashes / traffic-control / group-by / people-injury-type filters. Boot-time event listeners (`crashDataLoaded`, `DOMContentLoaded`) bind DOM filter inputs through `FilterEngine.setFilter`, and per-tab subscribers re-render off the new spec.
- §3 `safeFlyTo` / `safeFitBounds` / `safeFlyToBounds` + `getStateCenter` table installed in `app/index.html`. All 32 `crashMap.flyTo / fitBounds / flyToBounds` callsites converted via a balanced-paren rewriter; two stray `mapInstance.flyTo` / `mapRef.flyTo` callsites converted by hand. `handleTierChange('state')` now falls back to `getStateCenter()` so City→State no longer crashes with a NaN LatLng (F005).
- §4 Intersections Traffic Control dropdown populated from `get_traffic_control_types` RPC (`crashLensClient.getTrafficControlTypes(state)`); cached per-state, refreshed on tab show.
- §5 `recalculateAllEPDO()` cascade wrapped so it also fires `CL.data.supabaseBridge.injectFastDashboard({force:true})` — KPI cards now refresh at aggregate tiers where `updateDashboard()` early-returns.
- §6 `ChartRegistry` (`assets/js/chart-registry.js`) installs a Chart-constructor guard that destroys any prior instance bound to the same canvas before delegating to the original Chart.js constructor. Eliminates "Canvas is already in use" errors across all ~80 callsites without rewriting them (F017).
- §7 Active Scope card refresh: change listeners on `tierMPOSelect`, `tierRegionSelect`, `tierPlanningDistrictSelect`, `jurisdictionSelect`, `tierCountySelect`, `stateSelect` now call `CL.upload.tierUI.applyUploadTierUI(tier)`.
- §8 State-aware defaults: `cmfVirginiaFirst` defaults checked only when state is Virginia; `cmfProvenOnly` checked for all other states. User interactions latch a `data-userTouched` flag so we never overwrite their choice.
- §9 Find Countermeasures validation: `setCMFMode('algo', …)` wrapped — emits a warning toast and focuses the road-search input when no location is selected (F016).
- §10 Loading spinner sync: `handleTierChange(tier)` wrapped to call `showLoading('Switching to {label} view…')` before any async work, with a guaranteed `hideLoading()` on completion (F004/L001).
- §11 EPDO chevron `toggleEPDOSection()` now sets `textContent` (▼/▶) in addition to the CSS rotation, so screen readers and the audit-runner read the correct character (F006).
- New `data-client` methods: `getTrafficControlTypes`, `getYearFilterOptions`, `getHotspotsYearly`. Back the §1.1/1.2/1.3 RPCs Cowork pre-applied (verified: 200,000 rows / 560,231 DE crashes in `mv_hotspots_yearly`; 4 DE traffic-control types; 17-year DE coverage 2009-2025).
- 16 of 20 filter-audit findings closed. F008/F018 remain BLOCKED-UPSTREAM (Delaware source lacks B/C severity + young/senior age fields — Round 16 §4 banner already surfaces this). F001 (Federal == State for DE) is expected behavior — only the DE partition is populated.
- Files touched: `assets/js/filter-engine.js` (new), `assets/js/chart-registry.js` (new), `assets/js/data-client.js`, `app/index.html`.

## 2026-05-11 Round 19 — Date-filter coverage, DB state centroids, knowledge-corpus embedding, county-suffix fix
- §2 `getHotspotsYearly` county-suffix bug fix (`assets/js/data-client.js`): inverted regex — was stripping ` County` but `mv_hotspots_yearly.jurisdiction_county` stores the canonical `'Kent County'` (Round 14 pollution-fix pattern). Now adds the suffix when missing, matching `getFatalFactors` / `getSpeedSummary`. Verification: `getHotspotsYearly({county:'Kent County', yearStart:2022, yearEnd:2024, limit:5})` now returns rows.
- §3 state centroid loader reads from `states.capabilities.center` (Cowork pre-applied DE/VA/CO rows). `getStateCenter(stateKey)` is now async with an in-memory cache + sync `getStateCenterSync()` helper for boot-path callsites. Retires the Round 18 JS-constant lookup table; adding a new state is an INSERT, no JS edit.
- §4 FilterEngine localStorage persistence (`assets/js/filter-engine.js`): spec is loaded on init and re-saved after every `setFilter`. `reset()` also wipes storage. `resetFilters()` in `app/index.html` now chains into `FilterEngine.reset()`. New `_restoreFilterInputs()` replays the persisted spec onto DOM inputs on boot + `crashDataLoaded`.
- §6 Knowledge corpus embedding workflow: new admin panel on the Domain Knowledge tab. `loadCorpusCounts()` lists `knowledge_corpus_pending` rows; `embedPendingCorpus()` fetches pending chunks, batch-embeds via OpenAI `text-embedding-3-small` (1536 dims), submits `{id, embedding}` pairs to `embed_pending_chunks(p_embeddings jsonb)` RPC. New `CrashLensDataClient.listPendingCorpusChunks()` + `embedPendingChunks()` methods.
- §7 ChartRegistry dev-tracker: opt-in `window.__DEV_TRACK_DIRECT_CHARTS` flag wraps `new Chart()` with a console.warn + stack trace so residual direct callsites can be migrated to `ChartRegistry.create()` over time. No-op by default.
- §8 Safety Focus date-filter wired to `mv_safety_categories_yearly` (Cowork pre-applied: 11,915 DE rows × 13 categories × 17 years). New `_r19LoadSafetyCategoriesWithFilter(spec)` + `FilterEngine.subscribe('safety-focus', …)` queries the yearly companion when `year_start`/`year_end` is set, folds (category × years) → per-category aggregates matching `getSafetyCategories` shape, then calls `updateSafetyCards()`. Falls back to the cached non-yearly path when no date filter is active.
- Backend pre-applied by Cowork: `states.capabilities.center` for DE/VA/CO; `mv_safety_categories_yearly` matview; `embed_pending_chunks(p_embeddings jsonb)` RPC.
- §5 AADT bulk-import UI already shipped Round 16 §5 — no changes needed.
- Files touched: `assets/js/data-client.js`, `assets/js/filter-engine.js`, `assets/js/chart-registry.js`, `app/index.html`, `log.md`.

## 2026-05-11 — Round 20 frontend merged (PDF-audit tab gaps + Prediction/DeepDive removal)
- §2 mv_crash_tree contributingFactors→contributing translation (5-line fix in data-client.js getCrashTree), plus matview-only stats panel write-back so updateCrashTreeStats() renders K/A/Total from crashTreeState when sampleRows is empty.
- §3 Hot Spots toolbar gains "📥 Import AADT" button + new aadtCoverageBanner that surfaces aadt_lookup row count and links to the import modal. Banner refreshes on jurisdictionChanged and after successful imports.
- §4.1 mv_speed_severity_matrix renderer hides B/C columns and emits a one-line banner when state capabilities.has_severity_b===false && has_severity_c===false. Capability cache resets on jurisdictionChanged.
- §4.2 mv_fatal_factors long-format support: fold rows into a jurisdiction-wide top-factor hint stored on fatalSpeedingState.fatalData.jurisdictionTopFactor; getTopFactor() falls back to it when per-row crashes are stubs, replacing the "-" placeholder.
- §5 Safety Focus sub-KPI row replaced with a single inline note (id: safety-subkpi-unavailable) whenever mv_safety_co_factors returns 404. _safetyFocusHasCofactors() caches the probe result.
- §6 People-Injured pie + legend drops the "Senior wearing seatbelt" slot when capabilities.has_senior_flag===false (both Supabase-only and legacy-row code paths).
- §8 Dashboard loading banner auto-hides once the six tracked canvases paint (createChart instrumented via _markDashboardChartPainted); crashtab:dashboard:shown event resizes those canvases to fix the blank-canvas-while-hidden bug.
- §9 Warrants location selection: when sampleRows aren't loaded but Supabase is configured, skip the polling loop entirely and let the existing Supabase path serve crashes (3s legacy poll timeout kept for the no-Supabase fallback).
- §10 Grants: _renderGrantDeadline() returns the raw string for un-parseable deadlines ("Quarterly", "Rolling", "TBD"), and displayStateGrants no longer filters those rows out as isPast.
- §11 Domain Knowledge corpus embedding banner (id: domainKnowledgeEmbedBanner) shows when knowledge_corpus_pending has rows; auto-refreshes on crashtab:knowledge:shown and crashtab:cmf:shown.
- §X8 Dashboard District Matrix widget short-circuits to a BLOCKED-UPSTREAM banner when state capabilities.has_ccd_assignment===false; charts hidden; re-checked on jurisdictionChanged.
- §X9 Crash Prediction tab removed: nav item, tab body, predictionState, initPredictionTab + 16 helper functions, predForecastDot, checkPredictionAvailabilityIndicator, generatePredictionForecastReport, How-To entry, reportType <option>, friendlyNames/pdfTitles/reportGenerators/pageCounts entries, getForecasts data-client method.
- §X9 Deep Dive tab removed: nav item, tab body, deepDiveState, initDeepDiveTab + 12 helper functions, detectDeepDiveColumns hooks, generateDeepDiveAnalysisReport, How-To entry, reportType <option>, all map entries.
- showTab dispatches new crashtab:{hotspots|dashboard|cmf|knowledge}:shown events for tab-aware banners.
- State-agnostic checklist: §3 keys on aadt_lookup count + has_aadt_full_coverage; §4.1 keys on has_severity_b/c; §5 keys on existence of mv_safety_co_factors (404 today); §6 keys on has_senior_flag; §X8 keys on has_ccd_assignment; §X9 removes uniformly with no per-state bypass. No new SQL.
- Verification: node -e new Function on app/index.html inline scripts (13 blocks, ~11MB) parses cleanly; data-client.js parses cleanly; grep -nE "predictionState|deepDiveState|tab-prediction|tab-deepdive|predForecastDot" returns 0 matches.
- Files touched: `assets/js/data-client.js`, `app/index.html`, `log.md`.
- Backend ask logged for future round: mv_safety_co_factors matview needed to re-enable Safety Focus sub-KPI breakdowns; schema sketched in §5 of Round 20 prompt.

## 2026-05-11 — Round 20.1 hotfix
§B `loadAadtCoverageBanner` was querying `aadt_lookup?select=id` — column doesn't exist
(matview's PK is composite `(state, rte_name, rte_segment_id, measurement_year)`).
The 400 was swallowed by the catch; banner stayed at "checking…". Switched to `select=state`.

§C `mv_fatal_factors` is wide-format (`fatal_total, fatal_impaired, fatal_speed, fatal_distracted,
fatal_unrestrained, fatal_nighttime, fatal_intersection, fatal_weather, fatal_animal` plus 6
composite co-factor columns). Round 20's `jurisdictionTopFactor` derivation expected a long-format
`contributing_factor` column that doesn't exist — every county/PD-tier load returned `null` and the
Top Factor column rendered '—' across the table. Replaced with a walker that reads the existing
wide-format rollup (SINGLE_FACTOR_COLS map).

§D Polish: removed dead `.pred-*` CSS (~120 lines) and orphan `.dd-panel-*` / `.dd-arrow` /
`.dd-insight` / `.dd-no-data` selectors; trimmed `.pred-*` from the 768px media query (kept
`.hotspot-*` + `.int-vru-grid`); refreshed a stale "15 report types" comment that listed prediction
and deepdive.

Verification: ✅ AADT banner renders "N AADT records loaded" instead of "checking…";
✅ Fatal Crashes Top Factor renders icon+name at planning-district rollup;
✅ All 13 inline scripts + data-client.js parse cleanly.

Files touched: `app/index.html`, `log.md`.

## 2026-05-12 — Round 22 frontend merged

§1 chartFuncClass / chartWeather / chartLight — drop paintWhenVisible wrap, paint immediately.
   Resolves Chrome Claude matrix-audit finding (3 blank canvases at every tier — data is
   already loaded into D.byFuncClass / byWeather / byLight by getAnalysisBreakdown but the
   IntersectionObserver wrap never fired before screenshot / PDF capture).
§2 updateTierScopeHeader gains planning_district branch. Resolves T2 (MPO label persisted
   when switching MPO → Planning District). State-agnostic — keys on tier name + reads
   jurisdictionContext.tierPlanningDistrict.{name,shortName}.
§3a kpiPersonsInjured wired to dashboard_summary.total_injured (existing column, verified
   live). Card is display:none until total_injured > 0.
§3b kpiVehicleCountCard hidden via applyAvgVehiclesCapabilityGate (no vehicle column in
   dashboard_summary today). State-agnostic — gate flips to caps-driven when backend adds
   avg_vehicles_per_crash.
§4 F&S loading skeleton — _showFSLoadingSkeleton fires on initFatalSpeedingTab() entry and
   on the crashtab:fatalspeeding:shown event so users don't see all-zero KPIs for 4-5s on
   first activation.
§5a window._syncVirginiaFirstDefault alias for the Round 21 §8 audit health-check.
§5b Work Zone safety card → ⓘ Source-data gap badge on crashtab:safety:shown when count=0
   (DE has no has_workzone_flag capability today; card is outside _SAFETY_CARD_CAPABILITY_MAP).
§5c Data Connection Status card writer (line 26586) shows tierCity.name at city tier
   instead of parent county. Limited scope — getActiveJurisdictionId() left untouched
   because 30+ callers expect parent county slugs for R2 paths / data lookups.
§5d MPO header gains tooltip explaining boundary differences vs PD.
§6 Crash Tree secondary analysis 5s timeout — deferred per ship-order §8.

Backend: zero new SQL — every column verified live.

Backend ASKS (separate, for Cowork):
  - dashboard_summary.persons_injured + avg_vehicles_per_crash columns (to enable the
    Vehicle Count tile and refine Persons Injured semantics)
  - mv_safety_co_factors matview (still pending from Round 20 §5)

Files touched: `app/index.html`, `log.md`.

## 2026-05-12 — Round 23 frontend merged

§1 Reports tab matview-aware regeneration — `hydrateReportFromMatviews()` pulls
   dashboard_summary + mv_hotspots + mv_fatal_factors + mv_speed_summary +
   mv_safety_categories + mv_intersection_summary + mv_analysis_summary in parallel
   (~3s) instead of paginating 100K row-level crashes (~60-90s). Hooked into
   `generateReport()` for the `dashboard`/`systemwide` types via `MATVIEW_REPORT_TYPES`
   set (intentionally narrow — generators must be ported in §1.3 before adding more).
   Kills the "infinite time" hang on the Dashboard report at every aggregate tier.
   Other report types fall through to the legacy row pull (unchanged behavior) until
   their generators are ported in subsequent rounds.

§1.3 `computeStats()` ported to read `window._reportMatviewData` first — any future
   generator port automatically gets correct totals/severity/ped/bike from matviews.
   `generateDashboardReport` inline filters (nightCount, speedCount, intCount) and
   Year-Over-Year iteration also ported. K/A breakdown per-year is left at 0 (not
   surfaced by dashboard_summary at this rollup); the table still renders year +
   total + EPDO.

§2 Ped/Bike detail panels Supabase fallback — `updatePedDetailPanel` +
   `updateBikeDetailPanel` made async; hydrate from `mv_safety_focus_locations`
   (category=pedestrian/bicycle) + `mv_pedbike_breakdowns` (mode=ped/bike) when
   per-row `selected.crashes` is empty. Mirrors Round 21.1 §4 Safety Focus pattern.
   KPIs + sub-charts (Year/Collision/Light/Weather/Surface/TrafficControl) render
   at planning_district rollup. Demographics/contributing-factor sections show 0 in
   matview mode (alcohol/speed/distracted/etc. not surfaced by ped/bike matviews;
   acceptable for headline panel).

§3 qrcode.min.js CDN 404 fix — changed `/build/qrcode.min.js` → `/build/qrcode.js`
   (the npm package only ships unminified). Removes one console error.

Backend: zero new SQL. All matview shapes verified live via existing data-client.

Files touched: `app/index.html`, `log.md`.

## 2026-05-12 — Migration Phase 1+2 (frontend) merged

§1 config.json gained featureFlags.{useSupabaseAuth:false, supabaseAuthDualWrite:true}.
§2 Supabase JS SDK <script> tags added to login/index.html, app/index.html, pricing.html.
   (index.html, contact.html, contact-sales.html do not load Firebase scripts; skipped.)
§3 New file assets/js/supabase-auth.js (~280 lines) — wrapper exposing
   SupabaseAuth.{init,getUser,getUserAsync,signInWithEmail,signUpWithEmail,
   signInWithGoogle,signInWithMicrosoft,signOut,getProfile,upsertProfile,
   mapFirestoreToProfile,debug}.
§4 auth.js dual-write hooks at ensureUserDocument (new-doc + existing-doc paths),
   updateUserProfile, signOut — Firestore writes now also fire
   SupabaseAuth.upsertProfile().
§5 applyUserJurisdiction (app/index.html:25568) gained Supabase getProfile()
   fallback when Firebase userData is null. No-op when Firebase is the active
   provider.

Behavior: ZERO user-visible change. Firebase remains the auth provider. Supabase
rows populate in real time alongside Firestore writes. Rollback = config.json
flag flip.

Backend asks logged separately (4 items in §10 of source prompt): SQL migration,
Auth provider config, Firestore-export script, Stripe webhook live flag.

Files touched: `config.json`, `assets/js/supabase-auth.js` (new),
`assets/js/auth.js`, `login/index.html`, `app/index.html`, `pricing.html`,
`log.md`.

## 2026-05-17 — Day 2 start (compressed roadmap)

- O+P+Q verified clean (origin/main = `9be31e5`, PR #150 Session O extraction).
- Baseline snapshot: `app/index.html` 142,804 LOC · 70 modules · 28,687 module
  LOC · −16,583 (−10.4%) vs the 159,387 R1 baseline.
- 5 parallel lanes pushed: R+S+T (extract), Lane 2 (verify next-v2), Lane 3
  (author U+V), Lane 4 (Phase 4 survey), Lane 5 (housekeeping — this lane).
- New ledger `STAGE_A_INVENTORY.md` created (Lane-5-owned, per-wave snapshots).
- Expected end of Day 2: 13-14 new modules, `app/index.html` → ~137.5K, U+V
  prompts ready, Phase 4 plan ready.
- Branch: `claude/sync-meta-docs-Ouaq5` (system-required; task-template
  `claude/day2-lane5-housekeeping` overridden per Lane 5 branch decision).

Files touched: `STAGE_A_INVENTORY.md` (new), `MODULAR_PLAN.md`, `log.md`.
