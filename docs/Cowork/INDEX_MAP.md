# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **131696** lines
- Total declarations inventoried: **2861** (named fns **1955**, window fns **7**, const-arrow **899**)
- Top-level globals: **249** · Top-level event listeners: **52**

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
| 19158 | `EPDO_WEIGHTS` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19159 | `EPDO_ACTIVE_PRESET` | let | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19160 | `EPDO_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19167 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19218 | `STATE_EPDO_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19281 | `_TIER_EXTENSIONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19296 | `TIER_TAB_VISIBILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19342 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19395 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19454 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19456 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19464 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19465 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19466 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19467 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19474 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19674 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19700 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19708 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19709 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21812 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22136 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22139 | `COL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22142 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22145 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 22183 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22194 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 22298 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22489 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22490 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22672 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22713 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 22750 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22767 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22881 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 22892 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22913 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23500 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23519 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23548 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23556 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 25935 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25943 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25954 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25955 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25966 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26013 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26039 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26050 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26059 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26078 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26089 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26119 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26138 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26144 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26157 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26160 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26165 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26725 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26791 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26847 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26856 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26857 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 26858 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26859 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26860 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26888 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27206 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27978 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29931 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 30859 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 32384 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34123 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34131 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34222 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35698 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35809 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 35820 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36028 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36119 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36136 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36150 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36278 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36358 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36497 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 37271 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 38315 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 39724 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 39729 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 40434 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40435 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40436 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40437 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40438 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40439 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41440 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41606 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41607 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41639 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41788 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41810 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41930 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42009 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42219 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42220 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42221 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42222 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42689 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42690 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42691 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44236 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44260 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44261 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44262 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44263 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44264 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44265 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 44266 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44267 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44268 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44269 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44276 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44279 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44282 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44283 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44284 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44287 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46373 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47966 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 47969 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 47987 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 48137 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48161 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48175 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48181 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48190 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48195 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48196 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51350 | `currentAnalysisSubtab` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 52645 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53181 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 53191 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 55597 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55731 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55990 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 56996 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60340 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60904 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 62289 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 62304 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 62529 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 62637 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 63520 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64152 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 64283 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64285 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64319 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64396 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64404 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67506 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67507 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68428 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68439 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70390 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 70400 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 74586 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74632 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74642 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 74681 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74705 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74941 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 75214 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75931 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 82633 | `CRASH_TREE_NAV_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86763 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 89474 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91250 | `PED_SSD_TABLE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91547 | `PED_TIER_TABLE_UNDIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91587 | `PED_TIER_TABLE_DIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91622 | `PED_COUNTERMEASURE_CODES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 92544 | `stopsignManualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 96739 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 97079 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97698 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97705 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 99277 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99278 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103564 | `signalPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103565 | `signalReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103566 | `signalCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103567 | `signalIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103568 | `signalUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103569 | `signalAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103570 | `signalExpectedHourCount` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105184 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105185 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105186 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105187 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105188 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 105189 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107790 | `speedstudyAutoSaveTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110075 | `trafficdataPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110076 | `trafficdataAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110077 | `trafficdataUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110078 | `trafficdataReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110079 | `trafficdataCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 110080 | `trafficdataIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112371 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112378 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112449 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112478 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112493 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 112676 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 113229 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 113340 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 113561 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114180 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114207 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114277 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114325 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114412 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114424 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114429 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114778 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114791 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 114804 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117656 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117657 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117973 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 118176 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 121576 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 123061 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124024 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 124769 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 125266 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 125285 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 125349 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 125353 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 125362 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 125421 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 127620 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128198 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 128248 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129452 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 129748 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 129801 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 129881 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 129911 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 129986 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 19359 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 22656 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 22662 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 25743 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 25791 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 25924 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 27388 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 30833 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 30838 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 30850 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 33381 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 41675 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41719 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41720 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41747 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41748 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41784 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 41785 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 41918 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 41956 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42292 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42293 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42298 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42313 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 43463 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51312 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51542 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51612 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51687 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 51701 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51852 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 54715 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 55965 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 64264 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 67627 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 74441 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 84918 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 86774 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 89490 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 89509 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 89591 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 111615 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 112206 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 112214 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 113196 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 114157 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 121357 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 125260 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 125531 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 128368 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 128379 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 129517 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
