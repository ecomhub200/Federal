# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **101803** lines
- Total declarations inventoried: **2186** (named fns **1526**, window fns **8**, const-arrow **652**)
- Top-level globals: **233** · Top-level event listeners: **56**

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
| 14811 | `EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14812 | `EPDO_ACTIVE_PRESET` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14813 | `EPDO_PRESETS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14820 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14871 | `STATE_EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14934 | `_TIER_EXTENSIONS` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14949 | `TIER_TAB_VISIBILITY` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14995 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15048 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15107 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15109 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15117 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15118 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15120 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15121 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15128 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15146 | `_jurisdictionChangedDebounce` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15348 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15374 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15382 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15383 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17486 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17810 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17813 | `COL` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17816 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17819 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 17858 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17869 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 17974 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18165 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18166 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18348 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18389 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 18426 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18443 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18557 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 18568 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18589 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19176 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19195 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19224 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19232 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 21611 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21619 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21630 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21631 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21642 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 21689 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21715 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 21726 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 21735 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21754 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21765 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21795 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21814 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21820 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21833 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21836 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21841 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22401 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22467 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22523 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22532 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22533 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 22534 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22535 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22536 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22545 | `calcEPDO` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22564 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22882 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 23654 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 25611 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 26560 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28080 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29819 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29827 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29918 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31394 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31505 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31516 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31724 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31815 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31832 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 31846 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31974 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 32054 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 32193 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 32967 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 34011 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 35420 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 35425 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 36159 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36160 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36161 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36162 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36163 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36164 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37165 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37331 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37332 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37364 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37502 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37524 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37644 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37723 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37933 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37934 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37935 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37936 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38420 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38421 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 38422 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39967 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39991 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39992 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39993 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39994 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39995 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39996 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 39997 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39998 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39999 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40000 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40007 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40010 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40013 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40014 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40015 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 40018 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 42104 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43697 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 43700 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 43718 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 43868 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43892 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43906 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43912 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43921 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43926 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 43927 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48228 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48764 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 48774 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 49613 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 49747 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 50006 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51073 | `_cc367_h2cOpts` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51253 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53529 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54004 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54070 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 54535 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54656 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 54671 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 54896 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55004 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 55875 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 56795 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 56926 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 56928 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 56962 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 57039 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 57047 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60149 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60150 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 61144 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 61155 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 63107 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 63117 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 67303 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67350 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67361 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 67400 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67424 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 67660 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 67859 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 68419 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 73170 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75726 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77890 | `roundaboutAADTConverterState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 78230 | `AADT_REGIONAL_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78849 | `ROUNDABOUT_INDICATOR_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78856 | `roundaboutIndicatorOverrides` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 80429 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 80430 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81392 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81393 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81394 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81395 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81396 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81397 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83039 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83046 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83117 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83146 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83161 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83344 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83897 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84008 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84229 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84848 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84875 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84945 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84993 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85080 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85092 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85097 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85446 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85459 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85472 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88324 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88325 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88641 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 88844 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 92254 | `districtMatrixExpanded` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 93739 | `presentationState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 94702 | `MAPILLARY_INLINE_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 95447 | `mapillaryGraphAPIState` | const | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 95944 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 95963 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 96027 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 96031 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 96040 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 96099 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 97711 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 98289 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 98339 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 99543 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 99839 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 99892 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 99972 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 100002 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 100077 | `SIGNDEF_EPDO` | const | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 15012 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 18332 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 18338 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 21419 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 21467 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 21600 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 23064 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 26513 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 26518 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 26530 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 26539 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 29077 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 35702 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 37379 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 37433 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 37434 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 37461 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 37462 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 37498 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 37499 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 37632 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 37670 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 38006 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 38007 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 38012 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 38031 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 38044 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 39194 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47043 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47133 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 47203 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 47253 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 47301 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 47315 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47467 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 48898 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 49981 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 56907 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 60270 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 67158 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 71325 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 73181 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 75742 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 75761 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 75843 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 82283 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 82874 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 82882 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 83864 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 84825 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 92035 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 95938 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 96209 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 98459 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 98470 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 99608 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
