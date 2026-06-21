# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **88651** lines
- Total declarations inventoried: **1873** (named fns **1264**, window fns **8**, const-arrow **601**)
- Top-level globals: **224** · Top-level event listeners: **54**

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
| 14813 | `EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14814 | `EPDO_ACTIVE_PRESET` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14815 | `EPDO_PRESETS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14822 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14873 | `STATE_EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14936 | `_TIER_EXTENSIONS` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14951 | `TIER_TAB_VISIBILITY` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14997 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15050 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15109 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15111 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15119 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15120 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15122 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15123 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15130 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15148 | `_jurisdictionChangedDebounce` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15350 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15376 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15384 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15385 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17488 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17812 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17815 | `COL` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17818 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17821 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 17860 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17871 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 17976 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18167 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18168 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18350 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18391 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 18428 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18445 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18559 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 18570 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18591 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19178 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19197 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19226 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19234 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 20066 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20074 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20085 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20086 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20097 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20144 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20170 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20181 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20190 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20209 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20220 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20250 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20269 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20275 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20288 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20291 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20296 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20856 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20922 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20978 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20987 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20988 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 20989 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20990 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20991 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21000 | `calcEPDO` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21019 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21337 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22109 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24066 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 25015 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26535 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28274 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28282 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28373 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29849 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29960 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 29971 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30179 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30270 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30287 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30301 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30429 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30509 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30648 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31422 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 32466 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 33875 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 33880 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 34614 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34615 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34616 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34617 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34618 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34619 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35447 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35613 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35614 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35646 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35784 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35806 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35926 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36005 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36215 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36216 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36217 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36218 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36702 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36703 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36704 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37823 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37847 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37848 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37849 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37850 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37851 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37852 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 37853 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37854 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37855 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37856 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37863 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37866 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37869 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37870 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37871 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37874 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39960 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41553 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 41556 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 41574 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 41724 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41748 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41762 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41768 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41777 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41782 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41783 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46084 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46620 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 46630 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 47469 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47603 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47862 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48942 | `_cc367_h2cOpts` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 49122 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51398 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51873 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51939 | `aiState` | const | (coarse — see PLAN §5) | `app/modules/ai/ai.js` |
| 52404 | `PINECONE_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52525 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 52540 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 52765 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52873 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53744 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54664 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 54795 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 54797 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 54831 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54908 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54916 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58018 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58019 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59013 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 59024 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60976 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 60986 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 65172 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65219 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65230 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65269 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65293 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65529 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 65728 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 66288 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 70346 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 72902 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74909 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74910 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75872 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75873 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75874 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75875 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75876 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75877 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77519 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77526 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77597 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77626 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77641 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77824 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78377 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78488 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78709 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79328 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79355 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79425 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79473 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79560 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79572 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79577 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79926 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79939 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79952 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 82804 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 82805 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83121 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 83324 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84062 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 84081 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84145 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84149 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84158 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84217 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85829 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86407 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86457 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 87661 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 87957 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 88010 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 88090 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 88120 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 15014 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 18334 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 18340 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 19922 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 20055 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 21519 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 24968 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 24973 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 24985 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 24994 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 27532 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 34157 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 35661 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35715 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35716 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35743 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35744 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35780 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35781 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35914 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 35952 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 36288 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36289 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 36294 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36313 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36326 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 37476 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 44899 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 44989 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45059 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45109 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45157 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45171 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 45323 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 46754 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47837 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 54776 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 58139 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 65027 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 68501 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 70357 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 72918 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 72937 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 73019 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 76763 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 77354 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 77362 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 78344 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 79305 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 84056 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 84327 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 86577 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 86588 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 87726 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
