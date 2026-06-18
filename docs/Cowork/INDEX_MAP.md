# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **124956** lines
- Total declarations inventoried: **2604** (named fns **1866**, window fns **8**, const-arrow **730**)
- Top-level globals: **252** · Top-level event listeners: **56**

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
| 19608 | `EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19609 | `EPDO_ACTIVE_PRESET` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19610 | `EPDO_PRESETS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19617 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19668 | `STATE_EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 19731 | `_TIER_EXTENSIONS` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19746 | `TIER_TAB_VISIBILITY` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19792 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19845 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19904 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19906 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19914 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19915 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19917 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19918 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19925 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19943 | `_jurisdictionChangedDebounce` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20145 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20171 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20179 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20180 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22283 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22607 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22610 | `COL` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22613 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22616 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 22655 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22666 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 22771 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22962 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22963 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23145 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23186 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 23223 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23240 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23354 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23365 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23386 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 23973 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23992 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 24021 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24029 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 26408 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26416 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26427 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26428 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26439 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26486 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26512 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26523 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 26532 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26551 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26562 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26592 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26611 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26617 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26630 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26633 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26638 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27198 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27264 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27320 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27329 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27330 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 27331 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27332 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27333 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27342 | `calcEPDO` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27361 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 27679 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28451 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30408 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 31357 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 32877 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34616 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34624 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34715 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36191 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36302 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36313 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36521 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36612 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36629 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36643 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36771 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36851 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 36990 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 37764 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 38808 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 40217 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 40222 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 40956 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40957 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40958 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40959 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40960 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40961 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41962 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42128 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42129 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42161 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42299 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42321 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42441 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42520 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42730 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42731 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42732 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42733 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43217 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43218 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43219 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44764 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44788 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44789 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44790 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44791 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44792 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44793 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 44794 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44795 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44796 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44797 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44804 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44807 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44810 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44811 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44812 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 44815 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46901 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48494 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 48497 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 48515 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 48665 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48689 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48703 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48709 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48718 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48723 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48724 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53025 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53561 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 53571 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 54410 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54544 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54803 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55870 | `_cc367_h2cOpts` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 56050 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58326 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58801 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 61635 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 62100 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 62221 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 62236 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 62461 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 62569 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 63440 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64360 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 64491 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64493 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64527 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64604 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64612 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67714 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67715 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68709 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68720 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70672 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 70682 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 74868 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74915 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74926 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 74965 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74989 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75225 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 75424 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75984 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 80735 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83291 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85067 | `PED_SSD_TABLE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85364 | `PED_TIER_TABLE_UNDIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85404 | `PED_TIER_TABLE_DIVIDED` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85439 | `PED_COUNTERMEASURE_CODES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86361 | `stopsignManualTotals` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 90556 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 90896 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91515 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 91522 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 93095 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 93096 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97383 | `signalPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97384 | `signalReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97385 | `signalCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97386 | `signalIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97387 | `signalUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97388 | `signalAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97389 | `signalExpectedHourCount` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99003 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99004 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99005 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99006 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99007 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99008 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 101609 | `speedstudyAutoSaveTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103896 | `trafficdataPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103897 | `trafficdataAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103898 | `trafficdataUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103899 | `trafficdataReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103900 | `trafficdataCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 103901 | `trafficdataIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106192 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106199 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106270 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106299 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106314 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 106497 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107050 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107161 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 107382 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108001 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108028 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108098 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108146 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108233 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108245 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108250 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108599 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108612 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 108625 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 111477 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 111478 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 111794 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 111997 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 115407 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 116892 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 117855 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 118600 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 119097 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 119116 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 119180 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 119184 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 119193 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 119252 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 120864 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 121442 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 121492 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 122696 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 122992 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 123045 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 123125 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 123155 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 123230 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 19809 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 23129 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 23135 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 26216 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 26264 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 26397 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 27861 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 31310 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 31315 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 31327 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 31336 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 33874 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 40499 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 42176 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 42230 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42231 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 42258 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42259 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 42295 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42296 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 42429 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42467 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42803 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42804 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 42809 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42828 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 42841 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 43991 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51840 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 51930 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 52000 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 52050 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 52098 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 52112 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 52264 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 53695 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 54778 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 64472 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 67835 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 74723 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 78890 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 80746 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 83307 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 83326 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 83408 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 105436 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 106027 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 106035 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 107017 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 107978 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 115188 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 119091 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 119362 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 121612 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 121623 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 122761 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
