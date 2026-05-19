# index.html function inventory (master)

Snapshot: 2026-05-16

- Total file size: **151729** lines
- Total declarations inventoried: **3556** (named fns **2388**, window fns **7**, const-arrow **1161**)
- Top-level globals: **287** · Top-level event listeners: **58**

## Function inventory parts (by start line)

| Part | Line band | File |
|---|---|---|
| 1 | L1–40000 | [`INDEX_MAP_part1.md`](INDEX_MAP_part1.md) |
| 2 | L40001–80000 | [`INDEX_MAP_part2.md`](INDEX_MAP_part2.md) |
| 3 | L80001–120000 | [`INDEX_MAP_part3.md`](INDEX_MAP_part3.md) |
| 4 | L120001–end | [`INDEX_MAP_part4.md`](INDEX_MAP_part4.md) |

## Top-level globals (let / const / var at module scope)

> Mutated/Read columns are coarse — shared-global mutation analysis is in `MODULAR_PLAN.md` §5. Globals still read by remaining inline code must NOT be moved (expose `window` mirror).

| L | Name | Type | Mutated/Read | Proposed module |
|---|---|---|---|---|
| 19125 | `EPDO_WEIGHTS` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19126 | `EPDO_ACTIVE_PRESET` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19127 | `EPDO_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19134 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19185 | `STATE_EPDO_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19248 | `_TIER_EXTENSIONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19263 | `TIER_TAB_VISIBILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19309 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19362 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19421 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19423 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19431 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19432 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19433 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19434 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19441 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19641 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19667 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19675 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19676 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21779 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22103 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22106 | `COL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22109 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22112 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 22150 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22161 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 22265 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22456 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22457 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22639 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22680 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 22717 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22734 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22848 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 22859 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22880 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23467 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23486 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23515 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23523 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 25902 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25910 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25921 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25922 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25933 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 25980 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26006 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26017 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26026 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26045 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26056 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26086 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26105 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26111 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26124 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26127 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26132 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26685 | `AI_MODE_STORAGE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26924 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26990 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27046 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27055 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27056 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 27057 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27058 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27059 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27087 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27405 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28177 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30265 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 30459 | `CRASH_PATTERN_REGEX` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30768 | `CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30777 | `COUNTERMEASURE_LOOKUP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 32042 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 33567 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35692 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35700 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35791 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38224 | `GRANT_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38278 | `GRANT_SEARCH_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38378 | `FULL_APPLICATION_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38388 | `grantAgentState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 38455 | `GRANT_PROGRAM_REQUIREMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38460 | `GRANT_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38535 | `GRANT_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38588 | `GRANT_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38648 | `GRANT_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39452 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39563 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39574 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39782 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39873 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39890 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39904 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 40032 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 40112 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 40251 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 41025 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 42069 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 43478 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 43483 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 44853 | `_tierComparisonCache` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 44854 | `_tierComparisonCacheKey` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 44857 | `_tierNavHistory` | const | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 45162 | `_lastComparisonItems` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 45165 | `_comparisonSortState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 45925 | `_tierSectionDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 46118 | `_countyHeatmapActive` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46150 | `_DASHBOARD_CHART_IDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46154 | `_dashboardChartsPainted` | let | (coarse — see PLAN §5) | `app/modules/dashboard/dashboard.js` |
| 46240 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46241 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46242 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46243 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46244 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46245 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47246 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47412 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47413 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47445 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47594 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47616 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47736 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47815 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48025 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48026 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48027 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48028 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48495 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48496 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48497 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50298 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50322 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50323 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50324 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50325 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50326 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50327 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 50328 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50329 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50330 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50331 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50338 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50341 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50344 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50345 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50346 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50349 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52435 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54028 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 54031 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 54049 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 54199 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54223 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54237 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54243 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54252 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54257 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54258 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58486 | `currentAnalysisSubtab` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 59781 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60960 | `intDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 61880 | `originalApplyIntersectionFilters` | const | (coarse — see PLAN §5) | `app/modules/intersection/intersection.js` |
| 62062 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 62072 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 62334 | `pedDetailCharts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 63291 | `bikeDetailCharts` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 66232 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66366 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66614 | `analysisSearchResults` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66615 | `analysisSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66616 | `analysisCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66617 | `analysisSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66618 | `analysisSearchMode` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66619 | `analysisSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66620 | `analysisSelectedQuickLocation` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 68514 | `reportSequence` | let | (coarse — see PLAN §5) | `app/modules/reports/reports.js` |
| 69431 | `currentStandardReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70504 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 71510 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74854 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75958 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78728 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 79193 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79314 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 79329 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 79554 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79662 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 80545 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81465 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 81596 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 81598 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 81631 | `dkState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83426 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83503 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83511 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86613 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86614 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 87779 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 87790 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 89741 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 89751 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 93937 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 93983 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 93993 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 94032 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94056 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94292 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 94565 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 95282 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 101984 | `CRASH_TREE_NAV_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106114 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108825 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110601 | `PED_SSD_TABLE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110898 | `PED_TIER_TABLE_UNDIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110938 | `PED_TIER_TABLE_DIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110973 | `PED_COUNTERMEASURE_CODES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 111895 | `stopsignManualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116090 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 116430 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117049 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117056 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 118628 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 118629 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122915 | `signalPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122916 | `signalReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122917 | `signalCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122918 | `signalIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122919 | `signalUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122920 | `signalAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122921 | `signalExpectedHourCount` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124535 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124536 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124537 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124538 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124539 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124540 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127141 | `speedstudyAutoSaveTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129426 | `trafficdataPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129427 | `trafficdataAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129428 | `trafficdataUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129429 | `trafficdataReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129430 | `trafficdataCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129431 | `trafficdataIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131722 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131729 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131800 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131829 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131844 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132027 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132580 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132691 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132912 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133531 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133558 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133628 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133676 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133763 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133775 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 133780 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134129 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134142 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134155 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137007 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137008 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137324 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 137527 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 140927 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 142412 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 143375 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 144120 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 144617 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 144636 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 144700 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 144704 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 144713 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 144772 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 146971 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 147549 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 147599 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 148803 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 149099 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 149152 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 149232 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149262 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 149337 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 19326 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 22623 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 22629 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 25710 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 25758 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 25891 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 26742 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 27587 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 32016 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 32021 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 32033 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 34783 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 37836 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 46166 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47481 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 47525 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47526 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 47553 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47554 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 47590 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47591 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 47724 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 47762 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 48098 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 48099 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 48104 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 48119 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 49525 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 57374 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 58678 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 58748 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 58823 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 58837 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 58988 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 65350 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 66600 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 66912 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 81577 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 82979 | `crashtab:knowledge:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 82980 | `crashtab:cmf:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 86734 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 93792 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 104269 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 106125 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 108841 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 108860 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 108942 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 130966 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 131557 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 131565 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 132547 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 133508 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 140708 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 144611 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 144882 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 147719 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 147730 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 148868 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
