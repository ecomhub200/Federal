# index.html function inventory (master)

Snapshot: 2026-05-15

- Total file size: **159387** lines
- Total declarations inventoried: **3685** (named fns **2577**, window fns **7**, const-arrow **1101**)
- Top-level globals: **332** · Top-level event listeners: **74**

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
| 16987 | `manualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19956 | `EPDO_WEIGHTS` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19957 | `EPDO_ACTIVE_PRESET` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19958 | `EPDO_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 20031 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20082 | `STATE_EPDO_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 20374 | `_TIER_EXTENSIONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20389 | `TIER_TAB_VISIBILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20760 | `_geoDataCache` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 22115 | `HierarchyRegistry` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 22225 | `BoundaryService` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 22685 | `FederalBoundaries` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22865 | `SpatialClipService` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 22955 | `AggregateLoader` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 23140 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23193 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23252 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23254 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23764 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23765 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23766 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23767 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23774 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23974 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24000 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24008 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24009 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24185 | `_configReadyResolve` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24186 | `configReadyPromise` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24189 | `_userDataReadyResolve` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24190 | `userDataReadyPromise` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26112 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26436 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26439 | `COL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26442 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26445 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 26483 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26494 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 26598 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26789 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26790 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26972 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27013 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 27050 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27067 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27181 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 27192 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27213 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 27800 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27819 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 27848 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27856 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 28242 | `_MAP_POINTS_CACHE_DB` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28243 | `_MAP_POINTS_CACHE_STORE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28303 | `_mapPointsInFlight` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30362 | `SIGNAL_WARRANT1_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30378 | `SIGNAL_WARRANT2_CURVES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30386 | `SIGNAL_WARRANT3_CURVES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30394 | `SIGNAL_WARRANT4_CURVES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30428 | `SIGNAL_WARRANT5_MIN_SCHOOLCHILDREN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30431 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30439 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30450 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30451 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30462 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30509 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30535 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30546 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30555 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30574 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30585 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30615 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30634 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30640 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30653 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30656 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30661 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31214 | `AI_MODE_STORAGE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31453 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31519 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31575 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31584 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31585 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 31586 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31587 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31588 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31593 | `isYes` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31594 | `esc` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31596 | `escJs` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31597 | `calcEPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 31598 | `fmtTime` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31599 | `getHour` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31600 | `isIntersection` | const | (coarse — see PLAN §5) | `app/modules/intersection/intersection.js` |
| 31606 | `pct` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31607 | `showLoading` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31608 | `hideLoading` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31616 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 32291 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 33063 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35151 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 35345 | `CRASH_PATTERN_REGEX` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35654 | `CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35663 | `COUNTERMEASURE_LOOKUP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36928 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38453 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40578 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40586 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40677 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43110 | `GRANT_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43164 | `GRANT_SEARCH_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43264 | `FULL_APPLICATION_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43274 | `grantAgentState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 43341 | `GRANT_PROGRAM_REQUIREMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43346 | `GRANT_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43421 | `GRANT_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43474 | `GRANT_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43534 | `GRANT_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44338 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44449 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44460 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44668 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44759 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44776 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44790 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44918 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 44998 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 45137 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 45911 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 46955 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 48364 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 48369 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 49739 | `_tierComparisonCache` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 49740 | `_tierComparisonCacheKey` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 49743 | `_tierNavHistory` | const | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 50048 | `_lastComparisonItems` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50051 | `_comparisonSortState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50811 | `_tierSectionDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/core/tier.js` |
| 51004 | `_countyHeatmapActive` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51036 | `_DASHBOARD_CHART_IDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51040 | `_dashboardChartsPainted` | let | (coarse — see PLAN §5) | `app/modules/dashboard/dashboard.js` |
| 51126 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51127 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51128 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51129 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51130 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51131 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52132 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52298 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52299 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52331 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52480 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52502 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52622 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52701 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52911 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52912 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52913 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52914 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53381 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53382 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53383 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55184 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55208 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55209 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55210 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55211 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55212 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55213 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 55214 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55215 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55216 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55217 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55224 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55227 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55230 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55231 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55232 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55235 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 57321 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58914 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 58917 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 58935 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 59085 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59109 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59123 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59129 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59138 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59143 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59144 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 63372 | `currentAnalysisSubtab` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 64667 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65846 | `intDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66766 | `originalApplyIntersectionFilters` | const | (coarse — see PLAN §5) | `app/modules/intersection/intersection.js` |
| 66948 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 66958 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 67220 | `pedDetailCharts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68177 | `bikeDetailCharts` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 71118 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 71252 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 71500 | `analysisSearchResults` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71501 | `analysisSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71502 | `analysisCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71503 | `analysisSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71504 | `analysisSearchMode` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71505 | `analysisSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 71506 | `analysisSelectedQuickLocation` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 73400 | `reportSequence` | let | (coarse — see PLAN §5) | `app/modules/reports/reports.js` |
| 74317 | `currentStandardReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75390 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76396 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79740 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 80844 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83614 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 84079 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84200 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 84215 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 84440 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84548 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85431 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86351 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 86482 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 86484 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 86517 | `dkState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88312 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88389 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88397 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91499 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91500 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 92665 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 92676 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94627 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 94637 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 98823 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 98869 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 98879 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 98918 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 98942 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99178 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 99451 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 100168 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106870 | `CRASH_TREE_NAV_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 111000 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 113711 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 113712 | `safetyCheckInterval` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115487 | `PED_SSD_TABLE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115784 | `PED_TIER_TABLE_UNDIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115824 | `PED_TIER_TABLE_DIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115859 | `PED_COUNTERMEASURE_CODES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116781 | `stopsignManualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 120976 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 121316 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 121935 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 121942 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 123514 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 123515 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127801 | `signalPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127802 | `signalReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127803 | `signalCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127804 | `signalIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127805 | `signalUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127806 | `signalAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127807 | `signalExpectedHourCount` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129421 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129422 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129423 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129424 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129425 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129426 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132027 | `speedstudyAutoSaveTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134312 | `trafficdataPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134313 | `trafficdataAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134314 | `trafficdataUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134315 | `trafficdataReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134316 | `trafficdataCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 134317 | `trafficdataIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136608 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136615 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136686 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136715 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136730 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 136913 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137466 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137577 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 137798 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138417 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138444 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138514 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138562 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138649 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138661 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 138666 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 139015 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 139028 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 139041 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 141893 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 141894 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 142210 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 142413 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 145813 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 147298 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 148261 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149006 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 149503 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 149522 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149586 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149590 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149599 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 149658 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 151857 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 152435 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 152485 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 153689 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 153985 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 154504 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 155982 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 156012 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 156087 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 158443 | `SCORECARD_COLUMNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 158501 | `_scorecardChart` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158502 | `_scorecardData` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158503 | `_scorecardSortCol` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158504 | `_scorecardSortAsc` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158505 | `_scorecardInited` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158506 | `_scorecardTierFilter` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158507 | `_scorecardActiveTier` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158512 | `_STATE_POP_2023` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 158573 | `_SCORECARD_PEER_PILLS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 158582 | `_scorecardActivePill` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158874 | `_scorecardSortKey` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158875 | `_scorecardSortDir` | let | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 158876 | `_scorecardPinned` | const | (coarse — see PLAN §5) | `app/modules/scorecard/scorecard.js` |
| 159026 | `_SCORECARD_HEAT_RAMP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 17394 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 24204 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 26754 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 26956 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 30167 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 30215 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 30348 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 30924 | `mousemove` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 31271 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 32473 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 32502 | `touchstart` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 32506 | `touchend` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 36919 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 39669 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 42722 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51052 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52411 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52439 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52476 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52610 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 52648 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52984 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 52985 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52990 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 53005 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 54411 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 62260 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 63723 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 70236 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 71486 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 71798 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 86463 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 91620 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 98678 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 113727 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 113746 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 113828 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 128777 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 135852 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 136443 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 136451 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 137433 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 138394 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142740 | `mousedown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142777 | `mousemove` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142816 | `mouseup` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142825 | `touchstart` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142835 | `touchmove` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142845 | `touchend` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 142867 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 145594 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 147500 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 149497 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 149768 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 152480 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 152605 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 152616 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 153754 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 154608 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 154625 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 155559 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 157405 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 157446 | `change` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 158022 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 158027 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 158032 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 158405 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 158625 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 158626 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 158627 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 158635 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 159337 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 159353 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 159374 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
