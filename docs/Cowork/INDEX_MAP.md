# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **134486** lines
- Total declarations inventoried: **2926** (named fns **2012**, window fns **7**, const-arrow **907**)
- Top-level globals: **251** · Top-level event listeners: **52**

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
| 19149 | `EPDO_WEIGHTS` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19150 | `EPDO_ACTIVE_PRESET` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19151 | `EPDO_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19158 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19209 | `STATE_EPDO_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19272 | `_TIER_EXTENSIONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19287 | `TIER_TAB_VISIBILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19333 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19386 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19445 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19447 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19455 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19456 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19457 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19458 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19465 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19665 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19691 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19699 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19700 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21803 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22127 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22130 | `COL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22133 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22136 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 22174 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22185 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 22289 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22480 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22481 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22663 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22704 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 22741 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22758 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22872 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 22883 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22904 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23491 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23510 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23539 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23547 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 25926 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25934 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25945 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25946 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25957 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26004 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26030 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26041 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26050 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26069 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26080 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26110 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26129 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26135 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26148 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26151 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26156 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26716 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26782 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26838 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26847 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26848 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 26849 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26850 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26851 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26879 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27197 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27969 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29922 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 30850 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 32375 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34114 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34122 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34213 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35689 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35800 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 35811 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36019 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36110 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36127 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36141 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36269 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36349 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36488 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 37262 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 38306 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39715 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 39720 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 40425 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40426 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40427 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40428 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40429 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40430 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41431 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41597 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41598 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41630 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41779 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41801 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41921 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42000 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42210 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42211 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42212 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42213 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42680 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42681 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42682 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44227 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44251 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44252 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44253 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44254 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44255 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44256 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 44257 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44258 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44259 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44260 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44267 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44270 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44273 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44274 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44275 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44278 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46364 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47957 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 47960 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 47978 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 48128 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48152 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48166 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48172 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48181 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48186 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48187 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51341 | `currentAnalysisSubtab` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 52636 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53172 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 53182 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 55588 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55722 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55981 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 56987 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60331 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 61435 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64205 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 64670 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64791 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 64806 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 65031 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65139 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66022 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66942 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 67073 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 67075 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 67109 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67186 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67194 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70296 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70297 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 71218 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 71229 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 73180 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 73190 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 77376 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77422 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77432 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 77471 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77495 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77731 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 78004 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78721 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85423 | `CRASH_TREE_NAV_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 89553 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 92264 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94040 | `PED_SSD_TABLE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94337 | `PED_TIER_TABLE_UNDIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94377 | `PED_TIER_TABLE_DIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94412 | `PED_COUNTERMEASURE_CODES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 95334 | `stopsignManualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99529 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 99869 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 100488 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 100495 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 102067 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 102068 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106354 | `signalPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106355 | `signalReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106356 | `signalCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106357 | `signalIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106358 | `signalUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106359 | `signalAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106360 | `signalExpectedHourCount` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107974 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107975 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107976 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107977 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107978 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107979 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110580 | `speedstudyAutoSaveTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112865 | `trafficdataPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112866 | `trafficdataAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112867 | `trafficdataUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112868 | `trafficdataReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112869 | `trafficdataCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112870 | `trafficdataIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115161 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115168 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115239 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115268 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115283 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115466 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116019 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116130 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116351 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116970 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116997 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117067 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117115 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117202 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117214 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117219 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117568 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117581 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117594 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 120446 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 120447 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 120763 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 120966 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124366 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 125851 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 126814 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127559 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 128056 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 128075 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128139 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128143 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128152 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128211 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 130410 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 130988 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 131038 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132242 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 132538 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 132591 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 132671 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 132701 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 132776 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 19350 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 22647 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 22653 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 25734 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 25782 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 25915 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 27379 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 30824 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 30829 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 30841 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 33372 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 41666 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41710 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41711 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41738 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41739 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41775 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41776 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41909 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 41947 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42283 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42284 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42289 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42304 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 43454 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51303 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51533 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51603 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51678 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51692 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51843 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 54706 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 55956 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 67054 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 70417 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 77231 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 87708 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 89564 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 92280 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 92299 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 92381 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 114405 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 114996 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 115004 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 115986 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 116947 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 124147 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 128050 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 128321 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 131158 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 131169 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 132307 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
