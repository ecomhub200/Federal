# MODULAR_PLAN.md — proposed module structure

Snapshot: 2026-05-15. Companion to `INDEX_MAP.md` (function-level inventory) and `modular-prompts/` (one executable extraction prompt per module).

## Context

`app/index.html` is 159,387 lines / 3,685 declarations across 11 inline `<script>` blocks. Per-section edits keep breaking unrelated sections because line offsets shift. This plan splits the inline JS into ≤500-line `CL.*` modules, extracted **one per session** in the order below (safest→riskiest). No behavior change — each extraction is a verbatim copy + dual `window.<fn>`/`CL.<area>.<fn>` exposure.

## §1 Existing modules (recap — DO NOT touch)

These ~36 files are already extracted and **off-limits**. Do not re-extract, rename, move, or edit them (except `loader.js` to add a new top-level `CL.*` key when a module needs a new namespace root):

- `app/modules/loader.js` (namespace skeleton — only edit to add a new top-level `CL.*` key)
- `app/modules/core/constants.js`, `core/epdo.js`
- `app/modules/utils/date-utils.js`
- `app/modules/analysis/crash-profile.js`, `analysis/baselines.js`, `analysis/hotspots.js`
- `app/modules/warrants/signal.js`  (warrant MATH — distinct from new `warrants/signal-tmc.js`)
- `app/modules/ai/context.js`
- `app/modules/grants/ranking.js`
- `app/modules/batch-ba/` (all 10: state, upload, engine, results, charts, export-pdf, export-pdf-details, export-csv, export-kml, duration)
- `app/modules/upload/` (upload-tab, road-defaults, upload-pipeline, api-connector, upload-tier-ui)
- `app/modules/upload/worker/csv-worker.js`, `worker/sample-rows-loader.js`
- `app/modules/data/` (road-type-mapping, matview-cache, prewarm, chunk-loader, supabase-bridge, lazy-loader, tab-loaders, supabase-map-bridge)
- `app/modules/ui/skeletons.js`


## §2 Proposed NEW modules

46 modules. Line ranges are an exploration **snapshot**; every prompt's §0 pre-flight re-verifies exact lines and ABORTS on mismatch.

### 01. `app/modules/spatial/hierarchy-registry.js`

- **Namespace:** `CL.spatial.hierarchyRegistry` (+ `window.<fn>` back-compat)
- **Responsibility:** Jurisdiction hierarchy registry (regions/TPRs/MPOs/counties lookups).
- **Source range (snapshot):** L22115–L22219  ·  **Cluster:** EARLY (after `modules/grants/ranking.js`)
- **Representative functions:** `HierarchyRegistry`
- **Globals to extract:** `HierarchyRegistry`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** spatial/boundary-service, map/*, grants/*, scorecard/*
- **Risk:** Parse-time `const HierarchyRegistry = (function(){…})()`. Preserve as window.HierarchyRegistry + CL.spatial.hierarchyRegistry; must load BEFORE first use (EARLY cluster).

### 02. `app/modules/spatial/boundary-service.js`

- **Namespace:** `CL.spatial.boundaryService` (+ `window.<fn>` back-compat)
- **Responsibility:** TIGERweb / BTS MPO boundary queries + ArcGIS→GeoJSON.
- **Source range (snapshot):** L22225–L22684  ·  **Cluster:** EARLY (after `modules/spatial/hierarchy-registry.js`)
- **Representative functions:** `BoundaryService`, `_queryTigerWeb`, `_arcgisJsonToGeoJSON`, `_queryBtsMpo`, `_spatialQueryBtsMpo`
- **Globals to extract:** `BoundaryService`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/hierarchy-registry`
- **Used by (load after):** spatial/federal-boundaries, map/map-boundary
- **Risk:** Parse-time IIFE; depends on HierarchyRegistry existing first.

### 03. `app/modules/spatial/federal-boundaries.js`

- **Namespace:** `CL.spatial.federalBoundaries` (+ `window.<fn>` back-compat)
- **Responsibility:** Multi-state boundary rendering / color map.
- **Source range (snapshot):** L22685–L22864  ·  **Cluster:** EARLY (after `modules/spatial/boundary-service.js`)
- **Representative functions:** `FederalBoundaries`, `_buildColorMap`, `getActiveStates`, `render`, `remove`
- **Globals to extract:** `FederalBoundaries`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/boundary-service`
- **Used by (load after):** map/map-boundary, scorecard/scorecard-choropleth
- **Risk:** Parse-time IIFE; generic method names (render/remove) — keep inside IIFE, expose only the registry object.

### 04. `app/modules/spatial/spatial-clip.js`

- **Namespace:** `CL.spatial.spatialClip` (+ `window.<fn>` back-compat)
- **Responsibility:** Turf-based point/line/polygon clipping to a jurisdiction polygon.
- **Source range (snapshot):** L22865–L22954  ·  **Cluster:** EARLY (after `modules/spatial/federal-boundaries.js`)
- **Representative functions:** `SpatialClipService`, `getJurisdictionPolygon`, `clipPoints`, `clipLines`, `clipPolygons`
- **Globals to extract:** `SpatialClipService`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/federal-boundaries`
- **Used by (load after):** map/*, analysis/*
- **Risk:** Parse-time IIFE; depends on Turf global (loaded via CDN before module cluster).

### 05. `app/modules/spatial/aggregate-loader.js`

- **Namespace:** `CL.spatial.aggregateLoader` (+ `window.<fn>` back-compat)
- **Responsibility:** R2/Supabase aggregate fetch + URL resolution.
- **Source range (snapshot):** L22955–L23146  ·  **Cluster:** EARLY (after `modules/spatial/spatial-clip.js`)
- **Representative functions:** `AggregateLoader`, `_resolveR2Url`, `_isSupabaseOnlyAggregatePath`, `_fetch`
- **Globals to extract:** `AggregateLoader`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/spatial-clip`
- **Used by (load after):** dashboard/*, hotspots/*, scorecard/*
- **Risk:** Parse-time IIFE; network code — copy verbatim, no retry/logic changes.

### 06. `app/modules/warrants/signal-tmc.js`

- **Namespace:** `CL.warrants.signalTmc` (+ `window.<fn>` back-compat)
- **Responsibility:** Signal-warrant TMC grid + day-card data entry UI (signal_* fns).
- **Source range (snapshot):** L16558–L17403  ·  **Cluster:** EARLY (after `modules/spatial/aggregate-loader.js`)
- **Representative functions:** `signal_updateTMCGrid`, `signal_generateTMCRows`, `signal_addCurrentDay`, `signal_saveData`, `signal_renderDayCards`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** `DOMContentLoaded@17394`
- **Depends on (load before):** `warrants/signal`
- **Used by (load after):** inline HTML onclick= in warrants tab
- **Risk:** Distinct from existing warrants/signal.js (warrant math). Many HTML onclick= callers → MUST keep window.signal_* globals. One DOMContentLoaded (TMC grid 100ms defer) moves with it.

### 07. `app/modules/warrants/signal-thresholds.js`

- **Namespace:** `CL.warrants.signalThresholds` (+ `window.<fn>` back-compat)
- **Responsibility:** MUTCD signal warrant threshold tables/curves (constants).
- **Source range (snapshot):** L30362–L30460  ·  **Cluster:** EARLY (after `modules/warrants/signal-tmc.js`)
- **Representative functions:** `SIGNAL_WARRANT1_THRESHOLDS`, `SIGNAL_WARRANT2_CURVES`, `SIGNAL_WARRANT3_CURVES`
- **Globals to extract:** `SIGNAL_WARRANT1_THRESHOLDS`, `SIGNAL_WARRANT2_CURVES`, `SIGNAL_WARRANT3_CURVES`, `SIGNAL_WARRANT4_CURVES`, `SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `warrants/signal`
- **Used by (load after):** warrants/signal, warrants/signal-tmc
- **Risk:** Pure const tables; const (no hoist) — load before consumers.

### 08. `app/modules/safety/sign-deficiency.js`

- **Namespace:** `CL.safety.signDeficiency` (+ `window.<fn>` back-compat)
- **Responsibility:** Sign/signal/marking deficiency analyzer tab (signDef_* fns).
- **Source range (snapshot):** L156067–L157349  ·  **Cluster:** LATE (after `modules/data/supabase-map-bridge.js`)
- **Representative functions:** `signDef_analyze`, `signDef_loadInventory`, `signDef_renderTable`, `signDef_exportPDF`, `signDef_initMap`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`, `spatial/spatial-clip`
- **Used by (load after):** inline HTML onclick= in sign-deficiency tab
- **Risk:** Self-contained prefix block; many onclick= → keep window.signDef_* globals. Owns its own Leaflet map instance.

### 09. `app/modules/assets/school-tab.js`

- **Namespace:** `CL.assets.schoolTab` (+ `window.<fn>` back-compat)
- **Responsibility:** School-zone safety tab (schoolTab* fns + escapeXML/KML export).
- **Source range (snapshot):** L154035–L154515  ·  **Cluster:** LATE (after `modules/safety/sign-deficiency.js`)
- **Representative functions:** `updateSchoolTabTable`, `schoolTabExportData`, `schoolTabExportKML`, `escapeXML`, `softActivateSchoolLayer`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`, `map/map-layers`
- **Used by (load after):** inline HTML onclick= in school tab, assets/asset-export
- **Risk:** `escapeXML` is shared with transit-tab — leave in school-tab, expose window.escapeXML; transit-tab depends on it.

### 10. `app/modules/assets/transit-tab.js`

- **Namespace:** `CL.assets.transitTab` (+ `window.<fn>` back-compat)
- **Responsibility:** Transit-stop safety tab (transitTab* / transitLoad* fns).
- **Source range (snapshot):** L154516–L155490  ·  **Cluster:** LATE (after `modules/assets/school-tab.js`)
- **Representative functions:** `initTransitSafetyTab`, `transitTabLoadStopsFromBTS`, `transitLoadStopsForTier`, `updateTransitTabTable`, `transitTabExportKML`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `assets/school-tab`
- **Used by (load after):** inline HTML onclick= in transit tab, assets/asset-export
- **Risk:** Depends on window.escapeXML from school-tab → school-tab loads first.

### 11. `app/modules/assets/asset-export.js`

- **Namespace:** `CL.assets.assetExport` (+ `window.<fn>` back-compat)
- **Responsibility:** Shared asset export menu (KML/PDF) for school+transit tabs.
- **Source range (snapshot):** L155491–L155924  ·  **Cluster:** LATE (after `modules/assets/transit-tab.js`)
- **Representative functions:** `toggleAssetExportMenu`, `hideAssetExportMenu`, `assetExportKML`, `assetExportPDF`, `switchSchoolTabResourceTab`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `assets/transit-tab`
- **Used by (load after):** inline HTML onclick=
- **Risk:** Reads school/transit state — load after both.

### 12. `app/modules/scorecard/scorecard-tier.js`

- **Namespace:** `CL.scorecard.tier` (+ `window.<fn>` back-compat)
- **Responsibility:** Scorecard tier inference + tier pills + cache invalidation.
- **Source range (snapshot):** L158397–L158647  ·  **Cluster:** LATE (after `modules/assets/asset-export.js`)
- **Representative functions:** `_inferScorecardTier`, `setScorecardTier`, `_renderTierPills`, `_invalidateScorecard`, `_earlySkel`
- **Globals to extract:** `_statePopulation`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/tier`, `ui/skeletons`
- **Used by (load after):** scorecard/scorecard-render
- **Risk:** `_earlySkel` paints skeleton early — keep ordering within scorecard sub-modules.

### 13. `app/modules/scorecard/scorecard-render.js`

- **Namespace:** `CL.scorecard.render` (+ `window.<fn>` back-compat)
- **Responsibility:** Scorecard table build, ranking, sort, drilldown, CSV export.
- **Source range (snapshot):** L158648–L159085  ·  **Cluster:** LATE (after `modules/scorecard/scorecard-tier.js`)
- **Representative functions:** `initScorecardTab`, `loadScorecardData`, `renderScorecardTable`, `scorecardSort`, `scorecardDrillDown`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `scorecard/scorecard-tier`, `spatial/aggregate-loader`
- **Used by (load after):** app/tab-dispatcher (showTab scorecard branch), inline onclick=
- **Risk:** `loadScorecardData` async — copy verbatim incl. await; no top-level await (inside async fn).

### 14. `app/modules/scorecard/scorecard-choropleth.js`

- **Namespace:** `CL.scorecard.choropleth` (+ `window.<fn>` back-compat)
- **Responsibility:** Federal KPIs + choropleth + comparison table.
- **Source range (snapshot):** L159086–L159347  ·  **Cluster:** LATE (after `modules/scorecard/scorecard-render.js`)
- **Representative functions:** `_renderFederalKpis`, `_loadChoroplethDeps`, `_renderChoropleth`, `renderComparisonTable`, `updateScorecardChart`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `scorecard/scorecard-render`, `spatial/federal-boundaries`
- **Used by (load after):** scorecard/scorecard-render
- **Risk:** `_loadChoroplethDeps` lazy-loads D3 — keep dynamic import/script-inject verbatim.

### 15. `app/modules/dashboard/dashboard-tab.js`

- **Namespace:** `CL.dashboard.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Dashboard KPI painting + district stats + matview fallback.
- **Source range (snapshot):** L48699–L51326  ·  **Cluster:** LATE (after `modules/scorecard/scorecard-choropleth.js`)
- **Representative functions:** `updateDashboard`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/aggregate-loader`, `data/matview-cache`
- **Used by (load after):** app/tab-dispatcher (showTab dashboard branch)
- **Risk:** Reads crashState.aggregates global — do NOT move crashState; window mirror only.

### 16. `app/modules/hotspots/hotspots-tab.js`

- **Namespace:** `CL.hotspots.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Hot Spots tab: clustering, detail panel, filter summaries.
- **Source range (snapshot):** L61500–L63344  ·  **Cluster:** LATE (after `modules/dashboard/dashboard-tab.js`)
- **Representative functions:** `analyzeHotspots`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `analysis/hotspots`, `spatial/aggregate-loader`
- **Used by (load after):** app/tab-dispatcher (showTab hotspots branch)
- **Risk:** Distinct from existing analysis/hotspots.js (pure math). Reuses CL.analysis.hotspots.scoreAndRank.

### 17. `app/modules/intersection/intersection-tab.js`

- **Namespace:** `CL.intersection.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Intersections tab + matview integration + detail charts.
- **Source range (snapshot):** L64600–L65800  ·  **Cluster:** LATE (after `modules/hotspots/hotspots-tab.js`)
- **Representative functions:** `updateIntersectionTab`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/aggregate-loader`, `data/matview-cache`
- **Used by (load after):** app/tab-dispatcher (showTab intersection branch)
- **Risk:** Overlaps line-range with hotspots/analysis — prompt §0 must grep exact fn boundaries before deleting.

### 18. `app/modules/pedbike/pedbike-tab.js`

- **Namespace:** `CL.pedbike.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Ped/Bike dual analysis tab + location charts.
- **Source range (snapshot):** L66772–L68500  ·  **Cluster:** LATE (after `modules/intersection/intersection-tab.js`)
- **Representative functions:** `updatePedBikeTab`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `analysis/crash-profile`
- **Used by (load after):** app/tab-dispatcher (showTab pedestrian branch)
- **Risk:** Shares crash-profile helpers — depend on existing analysis/crash-profile.js.

### 19. `app/modules/analysis/analysis-tab.js`

- **Namespace:** `CL.analysis.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Analysis tab: multi-asset source sub-tabs, AADT coverage, search.
- **Source range (snapshot):** L63345–L64599  ·  **Cluster:** LATE (after `modules/pedbike/pedbike-tab.js`)
- **Representative functions:** `updateAnalysis`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `analysis/baselines`, `analysis/crash-profile`
- **Used by (load after):** app/tab-dispatcher (showTab analysis branch)
- **Risk:** Distinct from existing analysis/* math modules; tab UI only.

### 20. `app/modules/crash-tree/crash-tree-tab.js`

- **Namespace:** `CL.crashTree.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Crash Tree tab: tree construction + risk-factor analysis.
- **Source range (snapshot):** L105300–L109000  ·  **Cluster:** LATE (after `modules/analysis/analysis-tab.js`)
- **Representative functions:** `initCrashTreeTab`
- **Globals to extract:** `crashTreeState`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** app/tab-dispatcher (showTab crashtree branch)
- **Risk:** Owns crashTreeState global (private to this tab) — moves with module.

### 21. `app/modules/fatal-speeding/fatal-speeding-tab.js`

- **Namespace:** `CL.fatalSpeeding.tab` (+ `window.<fn>` back-compat)
- **Responsibility:** Fatal & Speeding matrix + severity/factor filtering.
- **Source range (snapshot):** L109100–L113700  ·  **Cluster:** LATE (after `modules/crash-tree/crash-tree-tab.js`)
- **Representative functions:** `initFatalSpeedingTab`, `applyFSFilters`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** app/tab-dispatcher (showTab fatalspeeding branch)
- **Risk:** Self-contained; matview-aware.

### 22. `app/modules/safety/safety-focus.js`

- **Namespace:** `CL.safety.focus` (+ `window.<fn>` back-compat)
- **Responsibility:** Safety Focus tab: category selection, capability gates.
- **Source range (snapshot):** L99600–L105299  ·  **Cluster:** LATE (after `modules/fatal-speeding/fatal-speeding-tab.js`)
- **Representative functions:** `initSafetyFocus`, `updateSafetyCards`
- **Globals to extract:** `safetyState`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** app/tab-dispatcher (showTab safety branch)
- **Risk:** Owns safetyState; large range — prompt §0 greps exact fn list before deleting.

### 23. `app/modules/core/epdo-presets.js`

- **Namespace:** `CL.core.epdoPresets` (+ `window.<fn>` back-compat)
- **Responsibility:** EPDO preset load/save/UI + per-state weights.
- **Source range (snapshot):** L20090–L20399  ·  **Cluster:** EARLY (after `modules/warrants/signal-thresholds.js`)
- **Representative functions:** `loadEPDOPreset`, `saveCustomEPDOWeights`, `recalculateAllEPDO`, `applyStateDefaultEPDO`, `updateEPDOPresetUI`
- **Globals to extract:** `EPDO_WEIGHTS`, `EPDO_ACTIVE_PRESET`, `EPDO_PRESETS`, `STATE_EPDO_WEIGHTS`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/epdo`, `core/constants`
- **Used by (load after):** dashboard/*, hotspots/*, grants/*, scorecard/*
- **Risk:** EPDO_WEIGHTS is mutable global read app-wide — KEEP window.EPDO_WEIGHTS mirror; do not relocate readers.

### 24. `app/modules/core/tier.js`

- **Namespace:** `CL.core.tier` (+ `window.<fn>` back-compat)
- **Responsibility:** View-tier set/visibility/selector + handleTierChange.
- **Source range (snapshot):** L20400–L20766  ·  **Cluster:** EARLY (after `modules/core/epdo-presets.js`)
- **Representative functions:** `setViewTier`, `updateTabVisibilityForTier`, `updateTierSelectorUI`, `handleTierChange`, `getTierScopeKey`
- **Globals to extract:** `_TIER_EXTENSIONS`, `TIER_TAB_VISIBILITY`
- **Listeners to extract:** `tierChanged`, `CL:tierChanged`
- **Depends on (load before):** `core/constants`
- **Used by (load after):** app/tab-dispatcher, scorecard/*, map/*
- **Risk:** Wires tierChanged listeners — extract listeners with the module; many tabs react.

### 25. `app/modules/spatial/geo-tier.js`

- **Namespace:** `CL.spatial.geoTier` (+ `window.<fn>` back-compat)
- **Responsibility:** Geo dropdown population + tier selection handlers + bounds.
- **Source range (snapshot):** L20767–L22114  ·  **Cluster:** EARLY (after `modules/core/tier.js`)
- **Representative functions:** `loadGeoData`, `populateGeoTierDropdown`, `handleCountySelection`, `getBoundsForTier`, `getCountyFIPSListForTier`
- **Globals to extract:** `_geoDataCache`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/tier`, `spatial/hierarchy-registry`
- **Used by (load after):** map/*, upload/*
- **Risk:** Large range; depends on HierarchyRegistry — order after it (split if >500 lines: -dropdowns / -bounds).

### 26. `app/modules/spatial/r2-resolve.js`

- **Namespace:** `CL.spatial.r2Resolve` (+ `window.<fn>` back-compat)
- **Responsibility:** R2 manifest + data-availability + URL resolution + CSV fallback.
- **Source range (snapshot):** L23144–L23763  ·  **Cluster:** EARLY (after `modules/spatial/geo-tier.js`)
- **Representative functions:** `loadR2Manifest`, `checkR2DataAvailability`, `resolveDataUrl`, `fetchCsvWithFallback`, `diagR2Connection`
- **Globals to extract:** `R2_BASE_URL`, `r2State`, `APP_PATHS`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `spatial/aggregate-loader`
- **Used by (load after):** upload/*, dashboard/*, map/*
- **Risk:** R2 parquet-only policy (KB) — copy verbatim, no path-scheme edits.

### 27. `app/modules/grants/grants-rank.js`

- **Namespace:** `CL.grants.rank` (+ `window.<fn>` back-compat)
- **Responsibility:** Grant scoring/ranking engine + scoring profiles.
- **Source range (snapshot):** L34986–L37500  ·  **Cluster:** LATE (after `modules/scorecard/scorecard-choropleth.js`)
- **Representative functions:** `initGrantModule`
- **Globals to extract:** `grantState`, `GRANT_SCORING_PROFILES`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `grants/ranking`, `core/epdo-presets`
- **Used by (load after):** grants/grants-ui, app/tab-dispatcher (showTab grants branch)
- **Risk:** Reuses existing grants/ranking.js math. Owns grantState. Range approximate — §0 grep boundaries.

### 28. `app/modules/grants/grants-ai.js`

- **Namespace:** `CL.grants.ai` (+ `window.<fn>` back-compat)
- **Responsibility:** Grant AI agents + narrative generation.
- **Source range (snapshot):** L37501–L39672  ·  **Cluster:** LATE (after `modules/grants/grants-rank.js`)
- **Representative functions:** `showNotifTab`, `syncFromStandardReportsTab`, `updateEmailLocationVisibility`, `toggleGrantAlertOptions`, `calculateGrantNextDelivery`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `grants/grants-rank`, `ai/ai-mode`
- **Used by (load after):** grants/grants-ui
- **Risk:** Calls AI proxy — copy verbatim; depends on grants-rank state.

### 29. `app/modules/grants/grants-email.js`

- **Namespace:** `CL.grants.email` (+ `window.<fn>` back-compat)
- **Responsibility:** Grant email scheduling + notification prefs.
- **Source range (snapshot):** L39673–L41500  ·  **Cluster:** LATE (after `modules/grants/grants-ai.js`)
- **Representative functions:** `generateReportForEmail`, `buildEmailSubjectLine`, `buildEmailStatsSection`, `buildEmailFindings`, `displayGrantLocations`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** `DOMContentLoaded@39669`
- **Depends on (load before):** `grants/grants-rank`
- **Used by (load after):** inline onclick=
- **Risk:** One DOMContentLoaded (email prefs init) moves with it. Overlaps grants-ai range — §0 grep exact fns.

### 30. `app/modules/grants/grants-ui.js`

- **Namespace:** `CL.grants.ui` (+ `window.<fn>` back-compat)
- **Responsibility:** Grants tab filtering/render/search UI.
- **Source range (snapshot):** L41501–L44527  ·  **Cluster:** LATE (after `modules/grants/grants-email.js`)
- **Representative functions:** `scrollToGrantSearch`, `populateGrantProgramDropdown`, `getGrantAISystemPrompt`, `runGrant4AgentAnalysis`, `updateGrantProgramUI`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `grants/grants-rank`, `grants/grants-ai`, `grants/grants-email`
- **Used by (load after):** app/tab-dispatcher, inline onclick=
- **Risk:** Load last among grants/* (depends on the other three).

### 31. `app/modules/cmf/cmf-search.js`

- **Namespace:** `CL.cmf.search` (+ `window.<fn>` back-compat)
- **Responsibility:** CMF database load + location population + search.
- **Source range (snapshot):** L44528–L48199  ·  **Cluster:** LATE (after `modules/grants/grants-ui.js`)
- **Representative functions:** `loadCMFDatabase`, `populateCMFLocations`
- **Globals to extract:** `cmfState`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** cmf/cmf-ai, cmf/cmf-deficiency, app/tab-dispatcher (showTab cmf)
- **Risk:** Owns cmfState. Range overlaps grants/AI bands — §0 grep exact cmf* fn boundaries before delete.

### 32. `app/modules/cmf/cmf-ai.js`

- **Namespace:** `CL.cmf.ai` (+ `window.<fn>` back-compat)
- **Responsibility:** CMF AI agents + recommendation narrative.
- **Source range (snapshot):** L48345–L48698  ·  **Cluster:** LATE (after `modules/cmf/cmf-search.js`)
- **Representative functions:** `initCMFAI`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `cmf/cmf-search`, `ai/ai-mode`
- **Used by (load after):** cmf/cmf-ui
- **Risk:** Embedded AI block; copy verbatim. Overlaps crash/filter band — §0 grep.

### 33. `app/modules/cmf/cmf-deficiency.js`

- **Namespace:** `CL.cmf.deficiency` (+ `window.<fn>` back-compat)
- **Responsibility:** CMF deficiency analysis + countermeasure matching.
- **Source range (snapshot):** L90000–L99600  ·  **Cluster:** LATE (after `modules/cmf/cmf-ai.js`)
- **Representative functions:** `runADAnalysis`, `runGPT4VAnalysis`, `getGPT4VPrompt`, `detectDeficiencies`, `calculateRiskScore`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `cmf/cmf-search`
- **Used by (load after):** cmf/cmf-ui
- **Risk:** Wide scattered range — §0 grep exact cmf* fns; may split into -deficiency/-ui if >500 lines.

### 34. `app/modules/map/map-safe-helpers.js`

- **Namespace:** `CL.map.safe` (+ `window.<fn>` back-compat)
- **Responsibility:** Safe Leaflet fly/fit wrappers.
- **Source range (snapshot):** L19966–L20032  ·  **Cluster:** EARLY (after `modules/spatial/r2-resolve.js`)
- **Representative functions:** `safeFlyTo`, `safeFitBounds`, `safeFlyToBounds`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/constants`
- **Used by (load after):** map/*, scorecard/*, hotspots/*
- **Risk:** Tiny pure wrappers; many callers — keep window.safe* globals.

### 35. `app/modules/map/map-init.js`

- **Namespace:** `CL.map.init` (+ `window.<fn>` back-compat)
- **Responsibility:** Leaflet map init + base layers + viewport.
- **Source range (snapshot):** L51400–L53500  ·  **Cluster:** LATE (after `modules/cmf/cmf-deficiency.js`)
- **Representative functions:** `initMap`, `updateMapDisplay`
- **Globals to extract:** `MAP_CENTER`, `MAP_ZOOM`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `map/map-safe-helpers`, `spatial/spatial-clip`
- **Used by (load after):** app/tab-dispatcher (showTab map branch), map/map-layers
- **Risk:** Owns the Leaflet map singleton — all other map/* depend on it; load first among map/* in LATE.

### 36. `app/modules/map/map-layers.js`

- **Namespace:** `CL.map.layers` (+ `window.<fn>` back-compat)
- **Responsibility:** Tile/Mapillary/overlay layer management.
- **Source range (snapshot):** L53501–L56000  ·  **Cluster:** LATE (after `modules/map/map-init.js`)
- **Representative functions:** `updateMapScopeLabel`, `searchMapboxAddresses`, `selectAddressResult`, `clearMapAddressSearch`, `findCrashesNearPoint`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `map/map-init`
- **Used by (load after):** map/map-render, assets/*
- **Risk:** Depends on map singleton from map-init.

### 37. `app/modules/map/map-render.js`

- **Namespace:** `CL.map.render` (+ `window.<fn>` back-compat)
- **Responsibility:** Marker/cluster/heat rendering + popups.
- **Source range (snapshot):** L56001–L59000  ·  **Cluster:** LATE (after `modules/map/map-layers.js`)
- **Representative functions:** `(map render/cluster fns)`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `map/map-layers`
- **Used by (load after):** map/map-boundary
- **Risk:** Range may overlap hotspots band — §0 grep exact map* fns.

### 38. `app/modules/map/map-boundary.js`

- **Namespace:** `CL.map.boundary` (+ `window.<fn>` back-compat)
- **Responsibility:** Boundary display + tier boundary restore.
- **Source range (snapshot):** L59001–L61499  ·  **Cluster:** LATE (after `modules/map/map-render.js`)
- **Representative functions:** `ensureTierBoundaryDisplayed`, `(boundary restore fns)`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** `jurisdictionChanged`, `tierChanged`
- **Depends on (load before):** `map/map-render`, `spatial/federal-boundaries`
- **Used by (load after):** app/tab-dispatcher
- **Risk:** Wires jurisdictionChanged/tierChanged listeners — extract listeners with module.

### 39. `app/modules/map/map-points-hydrate.js`

- **Namespace:** `CL.map.pointsHydrate` (+ `window.<fn>` back-compat)
- **Responsibility:** Map points hydration from matview/IndexedDB cache.
- **Source range (snapshot):** L28242–L28400  ·  **Cluster:** LATE (after `modules/map/map-boundary.js`)
- **Representative functions:** `_hydrateMapPointsFromMatview`
- **Globals to extract:** `_mapPointsInFlight`, `_MAP_POINTS_CACHE_DB`, `_MAP_POINTS_CACHE_STORE`
- **Listeners to extract:** — (none)
- **Depends on (load before):** `data/matview-cache`, `map/map-render`
- **Used by (load after):** map/map-boundary, app/tab-dispatcher
- **Risk:** Owns _mapPointsInFlight Map global — moves with module; range in core block, §0 grep.

### 40. `app/modules/ai/ai-mode.js`

- **Namespace:** `CL.ai.mode` (+ `window.<fn>` back-compat)
- **Responsibility:** MUTCD AI mode toggle + location dropdown + chat.
- **Source range (snapshot):** L12100–L16557  ·  **Cluster:** LATE (after `modules/map/map-points-hydrate.js`)
- **Representative functions:** `(ai mode fns — see INDEX_MAP part1)` — ⛔ BLOCKED (range inside `navigateTo` mega-fn L121–L16561; no in-range decls; not extractable — see prompt §1)
- **Globals to extract:** `aiState`
- **Listeners to extract:** `DOMContentLoaded@31271`
- **Depends on (load before):** `ai/context`, `core/constants`
- **Used by (load after):** cmf/cmf-ai, grants/grants-ai, app/tab-dispatcher (showTab ai)
- **Risk:** Reuses existing ai/context.js. Wide pre-signal range — §0 grep exact ai* fns; one DOMContentLoaded.

### 41. `app/modules/ai/ai-domain-knowledge.js`

- **Namespace:** `CL.ai.domainKnowledge` (+ `window.<fn>` back-compat)
- **Responsibility:** Domain Knowledge tab init + retrieval.
- **Source range (snapshot):** L86463–L88000  ·  **Cluster:** LATE (after `modules/ai/ai-mode.js`)
- **Representative functions:** `(domain knowledge fns)`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** `DOMContentLoaded@86463`
- **Depends on (load before):** `ai/ai-mode`
- **Used by (load after):** app/tab-dispatcher (showTab domain-knowledge)
- **Risk:** One DOMContentLoaded moves with it.

### 42. `app/modules/reports/reports-standard.js`

- **Namespace:** `CL.reports.standard` (+ `window.<fn>` back-compat)
- **Responsibility:** Standard report generation + Before/After report.
- **Source range (snapshot):** L9500–L14000  ·  **Cluster:** LATE (after `modules/ai/ai-domain-knowledge.js`)
- **Representative functions:** `(report fns — see INDEX_MAP part1)` — ⛔ BLOCKED (range inside `navigateTo` mega-fn L121–L16561; no in-range decls; not extractable — see prompt §1)
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `core/epdo-presets`, `analysis/crash-profile`
- **Used by (load after):** app/tab-dispatcher (showTab reports)
- **Risk:** Pre-signal-block range overlaps ai-mode band — §0 grep exact report* fns; do NOT touch batch-ba/* (already extracted).

### 43. `app/modules/reports/reports-custom.js`

- **Namespace:** `CL.reports.custom` (+ `window.<fn>` back-compat)
- **Responsibility:** Custom report builder UI.
- **Source range (snapshot):** L14001–L16556  ·  **Cluster:** LATE (after `modules/reports/reports-standard.js`)
- **Representative functions:** `(custom report builder fns)`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `reports/reports-standard`
- **Used by (load after):** inline onclick=
- **Risk:** Range abuts signal block (16558) — §0 grep boundary; stop before signal_*.

### 44. `app/modules/data/filter-wiring.js`

- **Namespace:** `CL.data.filterWiring` (+ `window.<fn>` back-compat)
- **Responsibility:** Cross-tab filter binding/restore + jurisdiction reload helpers.
- **Source range (snapshot):** L157350–L158040  ·  **Cluster:** LATE (after `modules/reports/reports-custom.js`)
- **Representative functions:** `_r18ApplyDashboardYearFilter`, `_r18ReloadHotspots`, `_r19LoadSafetyCategoriesWithFilter`, `_bindFilterInputs`, `_restoreFilterInputs`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** `jurisdictionChanged (multiple)`
- **Depends on (load before):** `dashboard/dashboard-tab`, `hotspots/hotspots-tab`, `intersection/intersection-tab`, `safety/safety-focus`
- **Used by (load after):** app/bootstrap
- **Risk:** Touches many tabs — load AFTER all feature tabs. Extract the jurisdictionChanged listeners it owns.

### 45. `app/modules/app/tab-dispatcher.js`

- **Namespace:** `CL.app.tabDispatcher` (+ `window.<fn>` back-compat)
- **Responsibility:** showTab()/navigateTo() central tab dispatcher.
- **Source range (snapshot):** L31759–L32200  ·  **Cluster:** LATE (after `modules/data/filter-wiring.js`)
- **Representative functions:** `showTab`, `navigateTo`
- **Globals to extract:** — (none; do NOT move app-wide globals still read by inline code)
- **Listeners to extract:** — (none)
- **Depends on (load before):** `(every feature tab module — all must load before this)`
- **Used by (load after):** inline HTML onclick=navigateTo(...), app/bootstrap
- **Risk:** 15+ tabId branches each calling a feature init fn — every referenced fn must exist on window before first navigateTo. Load LAST but one. Keep window.showTab/window.navigateTo.

### 46. `app/modules/app/bootstrap.js`

- **Namespace:** `CL.app.bootstrap` (+ `window.<fn>` back-compat)
- **Responsibility:** DOMContentLoaded init chain + autoLoadCrashData gateway.
- **Source range (snapshot):** L33186–L33600  ·  **Cluster:** LATE (after `modules/app/tab-dispatcher.js`)
- **Representative functions:** `autoLoadCrashData`, `_supabaseTabReady`, `attemptAutoload`
- **Globals to extract:** `crashState`
- **Listeners to extract:** `DOMContentLoaded (remaining boot listeners)`, `crashDataLoaded`
- **Depends on (load before):** `app/tab-dispatcher`, `spatial/r2-resolve`, `data/supabase-bridge`
- **Used by (load after):** (none — entry point)
- **Risk:** HIGHEST. crashState is app-wide — do NOT relocate the global; window mirror only. Bundle the remaining bootstrap DOMContentLoaded handlers. Extract LAST; full Playwright regression.

### ⚠️ Flagged for Cowork triage (prompt-prep round — overlap/anchor fix)

The overlap + placeholder-anchor fix (see `modular-prompts/`) resolved the 5
listed Class A collisions (23⊥34, 28⊥29, 30⊥31, 32⊥15, 38⊥16) and replaced
placeholder anchors in 28/33/36 (plus 29/30, which had unusable `grep 'grant'`
anchors). The following could **not** be auto-fixed and need human triage
before extraction starts:

1. **⛔ Prompts 40 (ai-mode) & 42 (reports-standard) are BLOCKED.** Their
   snapshot ranges (L12100–L16557 / L9500–L14000) fall entirely inside the
   `navigateTo` mega-function (INDEX_MAP: `navigateTo` spans L121–L16561).
   There are no in-range top-level declarations to anchor on and the blocks
   are not independently extractable. Class C resolution is impossible until
   `navigateTo` itself is decomposed. Self-check #1
   (`grep -l "see INDEX_MAP part"`) will still list 40 & 42 — expected.
2. **Residual snapshot-hint overlaps (intentionally NOT fixed).** Self-check
   #2 will still report: 42↔40 and 40↔43 (both BLOCKED, inside `navigateTo`);
   05↔26 (3-line overlap — prompt 05 is off-limits per task constraints);
   33↔22 (1-line off-by-one at L99600 — trivial; Cowork may simply trim
   prompt 33's snapshot end to L99599). These are flagged, not failures.
3. **Systemic snapshot↔anchor drift / interleaving.** Several prompts have
   snapshot ranges that no longer match their §0 anchors' live locations
   (e.g. 31 `loadCMFDatabase` now ~L91790 vs snapshot L44528; 38
   `ensureTierBoundaryDisplayed` ~L22k vs snapshot L59001). The overlap fix
   makes the snapshot HINT strings disjoint (self-check #2 green for the 5
   targets), but each block must still be re-derived by NAME at §0 runtime.
   Collision bands 30↔31 (grants↔CMF) and 38↔16 are physically **interleaved**
   in `app/index.html` — the "single contiguous block" model may not hold.
   Cowork should review §0 grep output before §4 delete on 30/31/38/16
   (all carry the 🔴 LARGE BLOCK callout where applicable).
4. **Other soft placeholders not in the Class C list (not fixed):** prompt 38
   §1/§2 still has `(boundary restore fns)` as a secondary bullet (its §0 grep
   uses the real `ensureTierBoundaryDisplayed`, so it still runs); prompt 37
   §0/§1/§2 still uses `(map render/cluster fns)`. Neither contains the literal
   "see INDEX_MAP part" string so they pass self-check #1, but Cowork should
   give them real anchors before extracting 37/38.
5. **Prompt 29 listener annotation.** `Listeners to extract:
   DOMContentLoaded@39669` now sits 4 lines before 29's new snapshot start
   (L39673); the L39669 listener falls in prompt 28's territory. The §0
   name-derived block is authoritative, but Cowork should confirm
   listener ownership when running 28/29.

## §3 Dependency-ordered `<script src>` insert list

Insert in `app/index.html` in this order. EARLY cluster appended after the current last EARLY tag (L4486, `modules/upload/worker/sample-rows-loader.js`); LATE cluster appended after the current last LATE tag (L158432, `modules/data/supabase-map-bridge.js`). Each prompt adds exactly one tag after the module named in its `after` field.

```
EARLY CLUSTER (after L4486):
  modules/spatial/hierarchy-registry.js
  modules/spatial/boundary-service.js
  modules/spatial/federal-boundaries.js
  modules/spatial/spatial-clip.js
  modules/spatial/aggregate-loader.js
  modules/warrants/signal-tmc.js
  modules/warrants/signal-thresholds.js
  modules/core/epdo-presets.js
  modules/core/tier.js
  modules/spatial/geo-tier.js
  modules/spatial/r2-resolve.js
  modules/map/map-safe-helpers.js

LATE CLUSTER (after L158432):
  modules/safety/sign-deficiency.js
  modules/assets/school-tab.js
  modules/assets/transit-tab.js
  modules/assets/asset-export.js
  modules/scorecard/scorecard-tier.js
  modules/scorecard/scorecard-render.js
  modules/scorecard/scorecard-choropleth.js
  modules/dashboard/dashboard-tab.js
  modules/hotspots/hotspots-tab.js
  modules/intersection/intersection-tab.js
  modules/pedbike/pedbike-tab.js
  modules/analysis/analysis-tab.js
  modules/crash-tree/crash-tree-tab.js
  modules/fatal-speeding/fatal-speeding-tab.js
  modules/safety/safety-focus.js
  modules/grants/grants-rank.js
  modules/grants/grants-ai.js
  modules/grants/grants-email.js
  modules/grants/grants-ui.js
  modules/cmf/cmf-search.js
  modules/cmf/cmf-ai.js
  modules/cmf/cmf-deficiency.js
  modules/map/map-init.js
  modules/map/map-layers.js
  modules/map/map-render.js
  modules/map/map-boundary.js
  modules/map/map-points-hydrate.js
  modules/ai/ai-mode.js
  modules/ai/ai-domain-knowledge.js
  modules/reports/reports-standard.js
  modules/reports/reports-custom.js
  modules/data/filter-wiring.js
  modules/app/tab-dispatcher.js
  modules/app/bootstrap.js
```

## §4 Extraction order (safest → riskiest)

Prompt numbering follows this list. Risk increases with caller fan-out, parse-time execution, and shared-global mutation:

1. **Tier 1** self-contained parse-time IIFE services (`spatial/*`) — clean boundaries, isolated.
2. **Tier 2** prefix-namespaced isolated blocks (`signal_*`, `signDef_*`, `schoolTab*`, `transitTab*`, `scorecard*`) — single feature, easy grep boundaries.
3. **Tier 3** single-tab feature blocks (dashboard, hotspots, intersection, pedbike, analysis, crash-tree, fatal-speeding, safety-focus).
4. **Tier 4** core helpers (`core/epdo-presets`, `core/tier`, `spatial/geo-tier`, `spatial/r2-resolve`) + grants + cmf sub-modules.
5. **Tier 5** map sub-modules + ai + reports.
6. **Tier 6** cross-cutting `data/filter-wiring` (touches many tabs — load after them).
7. **Tier 7** `app/tab-dispatcher` then `app/bootstrap` — every other module must already load.

Numbered queue:

01. `app/modules/spatial/hierarchy-registry.js` — Jurisdiction hierarchy registry (regions/TPRs/MPOs/counties lookups).
02. `app/modules/spatial/boundary-service.js` — TIGERweb / BTS MPO boundary queries + ArcGIS→GeoJSON.
03. `app/modules/spatial/federal-boundaries.js` — Multi-state boundary rendering / color map.
04. `app/modules/spatial/spatial-clip.js` — Turf-based point/line/polygon clipping to a jurisdiction polygon.
05. `app/modules/spatial/aggregate-loader.js` — R2/Supabase aggregate fetch + URL resolution.
06. `app/modules/warrants/signal-tmc.js` — Signal-warrant TMC grid + day-card data entry UI (signal_* fns).
07. `app/modules/warrants/signal-thresholds.js` — MUTCD signal warrant threshold tables/curves (constants).
08. `app/modules/safety/sign-deficiency.js` — Sign/signal/marking deficiency analyzer tab (signDef_* fns).
09. `app/modules/assets/school-tab.js` — School-zone safety tab (schoolTab* fns + escapeXML/KML export).
10. `app/modules/assets/transit-tab.js` — Transit-stop safety tab (transitTab* / transitLoad* fns).
11. `app/modules/assets/asset-export.js` — Shared asset export menu (KML/PDF) for school+transit tabs.
12. `app/modules/scorecard/scorecard-tier.js` — Scorecard tier inference + tier pills + cache invalidation.
13. `app/modules/scorecard/scorecard-render.js` — Scorecard table build, ranking, sort, drilldown, CSV export.
14. `app/modules/scorecard/scorecard-choropleth.js` — Federal KPIs + choropleth + comparison table.
15. `app/modules/dashboard/dashboard-tab.js` — Dashboard KPI painting + district stats + matview fallback.
16. `app/modules/hotspots/hotspots-tab.js` — Hot Spots tab: clustering, detail panel, filter summaries.
17. `app/modules/intersection/intersection-tab.js` — Intersections tab + matview integration + detail charts.
18. `app/modules/pedbike/pedbike-tab.js` — Ped/Bike dual analysis tab + location charts.
19. `app/modules/analysis/analysis-tab.js` — Analysis tab: multi-asset source sub-tabs, AADT coverage, search.
20. `app/modules/crash-tree/crash-tree-tab.js` — Crash Tree tab: tree construction + risk-factor analysis.
21. `app/modules/fatal-speeding/fatal-speeding-tab.js` — Fatal & Speeding matrix + severity/factor filtering.
22. `app/modules/safety/safety-focus.js` — Safety Focus tab: category selection, capability gates.
23. `app/modules/core/epdo-presets.js` — EPDO preset load/save/UI + per-state weights.
24. `app/modules/core/tier.js` — View-tier set/visibility/selector + handleTierChange.
25. `app/modules/spatial/geo-tier.js` — Geo dropdown population + tier selection handlers + bounds.
26. `app/modules/spatial/r2-resolve.js` — R2 manifest + data-availability + URL resolution + CSV fallback.
27. `app/modules/grants/grants-rank.js` — Grant scoring/ranking engine + scoring profiles.
28. `app/modules/grants/grants-ai.js` — Grant AI agents + narrative generation.
29. `app/modules/grants/grants-email.js` — Grant email scheduling + notification prefs.
30. `app/modules/grants/grants-ui.js` — Grants tab filtering/render/search UI.
31. `app/modules/cmf/cmf-search.js` — CMF database load + location population + search.
32. `app/modules/cmf/cmf-ai.js` — CMF AI agents + recommendation narrative.
33. `app/modules/cmf/cmf-deficiency.js` — CMF deficiency analysis + countermeasure matching.
34. `app/modules/map/map-safe-helpers.js` — Safe Leaflet fly/fit wrappers.
35. `app/modules/map/map-init.js` — Leaflet map init + base layers + viewport.
36. `app/modules/map/map-layers.js` — Tile/Mapillary/overlay layer management.
37. `app/modules/map/map-render.js` — Marker/cluster/heat rendering + popups.
38. `app/modules/map/map-boundary.js` — Boundary display + tier boundary restore.
39. `app/modules/map/map-points-hydrate.js` — Map points hydration from matview/IndexedDB cache.
40. `app/modules/ai/ai-mode.js` — MUTCD AI mode toggle + location dropdown + chat.
41. `app/modules/ai/ai-domain-knowledge.js` — Domain Knowledge tab init + retrieval.
42. `app/modules/reports/reports-standard.js` — Standard report generation + Before/After report.
43. `app/modules/reports/reports-custom.js` — Custom report builder UI.
44. `app/modules/data/filter-wiring.js` — Cross-tab filter binding/restore + jurisdiction reload helpers.
45. `app/modules/app/tab-dispatcher.js` — showTab()/navigateTo() central tab dispatcher.
46. `app/modules/app/bootstrap.js` — DOMContentLoaded init chain + autoLoadCrashData gateway.


## §5 Risk register

| Risk class | Where | Mitigation in the extraction prompt |
|---|---|---|
| Parse-time IIFE (`const X = (function(){…})()`) | `spatial/hierarchy-registry`, `boundary-service`, `federal-boundaries`, `spatial-clip`, `aggregate-loader` | Keep the IIFE intact inside the module; expose `window.X` + `CL.spatial.x`; place in EARLY cluster BEFORE first use. |
| Top-level / async-IIFE side effects | `_primeStateCenter` (async IIFE ~L20067), bootstrap | Copy the IIFE verbatim including its trailing `()`; do not convert to a function. No top-level `await` — all awaits stay inside their async fn. |
| Hoisted bare-global call sites + HTML `onclick=` | `signal_*`, `signDef_*`, `schoolTab*`, `transitTab*`, `showTab`/`navigateTo`, ~all feature fns | MANDATORY dual exposure: `window.<fn> = <fn>` AND `CL.<area>.<fn> = <fn>`. Verify `typeof window.<fn>==='function'` in §6. |
| `const`-arrow (no hoisting / TDZ) | ~1,101 const-arrow fns | Keep each with its enclosing feature module; never split a const-arrow from a caller that runs at parse-time; order such modules late. |
| Shared app-wide globals | `crashState`, `EPDO_WEIGHTS`, `crashState.aggregates`, `selectionState`, etc. (332 total) | Do NOT relocate a global still read by remaining inline code. Move only module-private globals (e.g. `crashTreeState`, `cmfState`, `_mapPointsInFlight`); for shared ones expose a `window` mirror and leave readers untouched until their own prompt. |
| Overlapping line bands | CMF (48k–99k) vs map/dashboard/analysis bands; grants vs cmf vs ai | Prompt §0 greps the EXACT named functions and derives the contiguous block; never delete by raw band. ABORT if grep count ≠ expected. |
| Listener wiring | `tierChanged`, `jurisdictionChanged`, `DOMContentLoaded` (74 total) | Each listener moves with the module that owns its handler (named in §2 `Listeners to extract`); do not duplicate. |
| Dispatcher fan-out | `showTab()` 15+ tabId branches | Extract LAST-but-one; every feature init fn it calls must already be `window`-exposed by an earlier prompt. |

Generic shared utilities that the heuristic routed to `app/unassigned` (e.g. `esc` with ~6.7k refs, `safeJsonParse`, `isMajor`) are intentionally **deferred**: they are NOT in the numbered queue. They will be batched into a `utils/*` follow-up round after the feature modules land, because moving a 6.7k-caller helper before its callers are modularized maximizes blast radius.

---

## § navigateTo split round (RESOLVED — non-issue; supersedes prompts 40 & 42)

**Added 2026-05-16 (CC Session B).** See `NAVIGATETO_STRUCTURE_SURVEY.md`
+ `NAVIGATETO_SPLIT_PLAN.md` (repo root) for the full forensic record.

**Finding.** `navigateTo` is NOT a mega-function. `app/index.html` L121-L132
is a 12-line early-boot stub; the real `showTab`/`navigateTo` dispatcher was
already extracted to `app/modules/app/tab-dispatcher.js` (prompt 45, done).
The `INDEX_MAP_part1.md` row `navigateTo | L121-L16561 | 16441 LOC` is a
heuristic artifact: that inventory was built from a stale 159,387-line
snapshot (live file = 153,085) and its "End L = next declaration - 1" rule
swallowed the CSS `<style>` block (L143-4438) + HTML body into the stub.

**Consequence.** Prompts 40 (ai-mode) & 42 (reports-standard) were never
blocked by a mega-function — only by stale snapshot ranges pointing at HTML
markup. The real AI-mode/reports code is ordinary top-level declarations,
extractable now (survey §4). Both exceed the 500-line cap, so they are
re-anchored and sub-split. **Self-check #1/#2 BLOCKED/overlap notes for
40/42/43 are artifacts of the same phantom range — disregard; re-anchor by
function name, not line range.**

**Superseding prompts (run in this order; one module per session):**

1. `40a-navigateTo-shell.md` — REFRAMED: no shell to extract; payload is
   INDEX_MAP regeneration + BLOCKED-claim re-validation (advisory).
2. `40b-ai-mode-toggle.md` -> `ai/ai-mode-toggle.js` (~232 LOC, L28041-L28273).
3. `40c-ai-analyst.md` (parent) -> `40c1-ai-analyst-chat.md` (owns `aiState`),
   `40c2-ai-analyst-mutcd.md` (mutcd/engine/warrant; engine = oversized
   exception; SKIP off-limits dups `buildCountyWideCrashProfile` L81823 &
   `buildLocationCrashProfile` L81878), `40c3-ai-analyst-context.md`
   (context/ui). Band ~L80084-L82947.
4. `42b-reports-standard.md` (parent) -> `42b1-reports-standard-core.md`,
   `42b2-reports-pdf.md`, `42b3-reports-charts.md`. Band ~L68281-L70781.
5. `42d-reports-countermeasures.md` -> countermeasures/memo/recommend.
   Band ~L75038-L77330.
6. `42c-reports-before-after.md` (parent) -> `42c1-report-ba-engine.md`,
   `42c3-report-ba-export.md`, `42c2-report-ba-monitoring.md`.
   Band ~L77331-L79908.

Original numbered prompts `40-ai-ai-mode.md` and `42-reports-reports-standard.md`
are **SUPERSEDED** — do not run them; use the prompts above. (Their files
are left intact per the no-edit-original-prompts rule; this pointer is the
authoritative redirect.) Risk register: `NAVIGATETO_SPLIT_PLAN.md` §5
(R1 off-limits name collisions, R3 oversized indivisible fn, R5 stale
ranges -> always name-anchor).

---

## §X Stage A — ESM Migration Queue (runs AFTER the IIFE round 01–46)

Stage A converts every `app/modules/*.js` from the IIFE + dual-exposure
pattern to native ES Modules (`import`/`export`), with a single
`<script type="module" src="main.js">` entry. Planning artifacts (this
session): `STAGE_A_MODULE_SURVEY.md`, `STAGE_A_ONCLICK_API.md`,
`STAGE_A_CONVERSION_TEMPLATE.md`, `STAGE_A_IMPORT_GRAPH.md`,
`STAGE_A_MAIN_ENTRY_DRAFT.js`, and `modular-prompts/STAGE_A_01..54`.

### ⚠️ Stage A is ONE coordinated cutover — NOT one-ship-per-session

Unlike IIFE extraction (01–46, shippable one at a time), a file containing
`export` **cannot** be loaded by a classic `<script src>`
(`Unexpected token 'export'`). Therefore:

- `STAGE_A_01..53` convert files but leave the app **non-runnable** in
  isolation. They are applied together on one Stage A branch.
- `STAGE_A_54-cutover` creates `app/main.js` and atomically swaps the 52+1
  `<script src>` tags for the single module entry. The app runs again
  only after 54.
- Per-file gate during 01–53 = `node --check` only. Full Playwright
  verification happens once, in 54.
- Rollback = revert the whole Stage A branch (all-or-nothing), not a
  single file.

### Queue order (topological — see `STAGE_A_IMPORT_GRAPH.md`)

| # | Prompt | Notes |
|---|---|---|
| 01 | `STAGE_A_01-loader` | Namespace root → side-effect module, imported FIRST; `window.CL` stays |
| 02–35 | leaf modules | 41 of 53 are import-free leaves; drop all non-onclick `window.*` |
| 36–50 | one-hop + `batch-ba/*` cluster | real `import`s (`STAGE_A_IMPORT_GRAPH.md`); batch-ba is a runtime-safe cycle |
| 51–52 | `app/tab-dispatcher`, `map/map-points-hydrate` | singleton-slot consumers (keep `CL.data.*` runtime reads) |
| 53 | `STAGE_A_53-worker-csv-worker` | Web Worker; the only allowed `app/index.html` non-tag edit (`{ type:'module' }` @ L30324) |
| 54 | `STAGE_A_54-cutover` | create `app/main.js`, swap script tags, full smoke test |

Onclick survivor set (25 floor — `STAGE_A_ONCLICK_API.md`) retains
`window.X = X`; all other `window.*` writes are dropped. Transitional
`CL.area.*` writes stay one round, stripped in a later Stage A-cleanup.
