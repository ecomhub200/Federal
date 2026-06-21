# index.html function inventory (master)

Snapshot: 2026-05-20

- Total file size: **87792** lines
- Total declarations inventoried: **1850** (named fns **1242**, window fns **8**, const-arrow **600**)
- Top-level globals: **222** · Top-level event listeners: **54**

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
| 14816 | `EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14817 | `EPDO_ACTIVE_PRESET` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14818 | `EPDO_PRESETS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14825 | `_stateCenterCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14876 | `STATE_EPDO_WEIGHTS` | var | (coarse — see PLAN §5) | `app/modules/core/epdo-presets.js` |
| 14939 | `_TIER_EXTENSIONS` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 14954 | `TIER_TAB_VISIBILITY` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15000 | `APP_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15053 | `APP_PATHS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15112 | `R2_BASE_URL` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15114 | `r2State` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15122 | `appConfig` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15123 | `appSettings` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15125 | `MAP_CENTER` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15126 | `MAP_ZOOM` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15133 | `jurisdictionContext` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15151 | `_jurisdictionChangedDebounce` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15353 | `API_AVAILABILITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15379 | `CONFIG_RETRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15387 | `CONFIG_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 15388 | `CONFIG_CACHE_VERSION_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17491 | `_filterRefreshTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17815 | `HENRICO_CENTER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17818 | `COL` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17821 | `roadProperties` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17824 | `crashState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 17863 | `geocodeState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 17874 | `crashTreeState` | const | (coarse — see PLAN §5) | `app/modules/crash-tree/crash-tree.js` |
| 17979 | `connectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18170 | `_reconnectTargetJurisdiction` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18171 | `_reconnectTargetState` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18353 | `originalResetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18394 | `grantState` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 18431 | `districtState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18448 | `GRANT_SCORING_PROFILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18562 | `mutcdState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 18573 | `selectionState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 18594 | `warrantsState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19181 | `WARRANT_DB_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19200 | `warrantDbState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 19229 | `CRASH_CACHE_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 19237 | `crashCacheState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 20069 | `SIGNAL_WARRANT7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20077 | `SIGNAL_PAGONES_FACTORS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20088 | `SIGNAL_TMC_APPROACHES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20089 | `SIGNAL_TMC_MOVEMENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20100 | `ROUNDABOUT_CONVERSION_CMFS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20147 | `ROUNDABOUT_SPF_COEFFICIENTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20173 | `ROUNDABOUT_ICD_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20184 | `ROUNDABOUT_LEG_CMF` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 20193 | `ROUNDABOUT_CAPACITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20212 | `ICE_SCORING_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20223 | `ROUNDABOUT_CRASH_PATTERNS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20253 | `STOPSIGN_VOLUME_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20272 | `STOPSIGN_CRASH_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20278 | `STOPSIGN_SUSCEPTIBLE_CRASH_TYPES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20291 | `STOPSIGN_SPEED_THRESHOLD` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20294 | `STOPSIGN_REQUIRED_HOURS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20299 | `ApiKeySecurity` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20859 | `STATE_HSO_REGISTRY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20925 | `VIRGINIA_GRANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20981 | `currentFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20990 | `charts` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20991 | `crashMap` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 20992 | `streetTileLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20993 | `currentMapMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 20994 | `PAGE_SIZE` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21003 | `calcEPDO` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21022 | `paginationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 21340 | `ORG_SETTINGS_KEYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 22112 | `_autoLoadGeneration` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 24069 | `displayVirginiaGrants` | const | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 25018 | `notificationState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 26538 | `tempEmailList` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28277 | `CRASH_COST_PRESETS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28285 | `STATE_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 28376 | `API_KEY_LINKS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29852 | `COUNTERMEASURE_AI_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 29963 | `cmfAIState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 29974 | `CMF_SEARCH_TOOL` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30182 | `AI_CMF_LOOKUP_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30273 | `cmfAgentState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30290 | `VDOT_CRASH_COSTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 30304 | `CMF_AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30432 | `CMF_AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30512 | `CMF_AGENT3_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 30651 | `CMF_AGENT4_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 31425 | `grantSearchAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 32469 | `cmfAIAttachments` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 33878 | `originalDisplayCrashProfile` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 33883 | `grantWritingAttachments` | let | (coarse — see PLAN §5) | `app/modules/grants/grants.js` |
| 34617 | `dashSearchResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34618 | `dashSearchTotal` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34619 | `dashCurrentSearchPage` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34620 | `dashSearchFilters` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34621 | `dashSearchMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 34622 | `dashSearchInFlight` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35450 | `FILTER_TO_COLUMN` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35616 | `_stateCapabilities` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35617 | `_stateCapabilitiesStateKey` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35649 | `_SAFETY_CARD_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35787 | `_MAP_FACTOR_DISPLAY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35809 | `_FACTOR_CAPABILITY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 35929 | `isMapFullscreen` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36008 | `mapSnapState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36218 | `mapSelectionMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36219 | `selectedMapLocations` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36220 | `selectedMapLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36221 | `routePolylines` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36705 | `mapSearchData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36706 | `mapSearchDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 36707 | `currentAddressMarker` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37826 | `originalInitMap` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37850 | `drawingMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37851 | `isDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37852 | `currentDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37853 | `drawingPoints` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37854 | `tempDrawingLayer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37855 | `selectedCrashesFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 37856 | `selectedTIFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37857 | `selectedBTSFromDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37858 | `drawingStartPoint` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37859 | `drawingHighlightGroup` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37866 | `currentDrawingShape` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37869 | `_refreshingDrawingSelection` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37872 | `MEASURE_BUFFER_METERS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37873 | `measureVertexMarkers` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37874 | `measureLengthDisplay` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 37877 | `layerStatesBeforeDrawing` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 39963 | `SELECTION_PDF_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41556 | `hotspotFilters` | let | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 41559 | `hotspotDetailState` | const | (coarse — see PLAN §5) | `app/modules/hotspots/hotspots.js` |
| 41577 | `segmentAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 41727 | `FHWA_FUNC_CLASS_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41751 | `FUNC_CLASS_FILTER_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41765 | `MIN_SEGMENT_LENGTH_MILES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41771 | `SEGMENT_OVERPASS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41780 | `segmentCurrentEndpointIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41785 | `OSM_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 41786 | `OSM_CACHE_EXPIRY_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46087 | `intFilters` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 46623 | `pedAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/analysis/analysis.js` |
| 46633 | `bikeAnalysisState` | const | (coarse — see PLAN §5) | `app/modules/pedbike/pedbike.js` |
| 47472 | `quickLocationData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47606 | `globalSelectedLocation` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 47865 | `infographicDefaults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 48945 | `_cc367_h2cOpts` | var | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 49125 | `comprehensiveReportData` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51401 | `MEMO_STYLES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51876 | `baState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 51953 | `mutcdAgentState` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 51968 | `MUTCD_WARRANT_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 52193 | `AGENT1_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 52301 | `AGENT2_SYSTEM_PROMPT` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53172 | `WARRANT_7_THRESHOLDS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 53805 | `MUTCD_SECTION_DATA` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |
| 53936 | `CMF_EMBEDDED_DATA` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 53938 | `cmfState` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 53972 | `assetDeficiencyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54049 | `DEFICIENCY_SEVERITY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 54057 | `DEFICIENCY_RULES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 57159 | `AD_CACHE_KEY` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 57160 | `AD_CACHE_EXPIRY_DAYS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58154 | `_ctFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 58165 | `_fsFilterToastLastShown` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 60117 | `CMF_COLLISION_MAP` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 60127 | `CMF_COST_KEYWORDS` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64313 | `safetyState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64360 | `sfDetailState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64371 | `fatalSpeedingState` | const | (coarse — see PLAN §5) | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64410 | `fsFactorConfig` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64434 | `safetyCategories` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 64670 | `safetyCategoryToCMFQuery` | const | (coarse — see PLAN §5) | `app/modules/cmf/cmf.js` |
| 64869 | `SAFETY_CURATED_COUNTERMEASURES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 65429 | `SAFETY_MATVIEW_PENDING` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 69487 | `_fsHideBCCache` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 72043 | `safetyInitAttempts` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74050 | `geocodeDebounceTimer` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 74051 | `GEOCODE_DEBOUNCE_MS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75013 | `speedstudyPendingExtractions` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75014 | `speedstudyUploadedFiles` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75015 | `speedstudyAllValidationResults` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75016 | `speedstudyIsReviewMode` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75017 | `speedstudyReviewQueue` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 75018 | `speedstudyCurrentReviewIndex` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76660 | `ASSET_MODULE_VERSION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76667 | `ASSET_CONSTANTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76738 | `ASSET_ICONS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76767 | `assetState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76782 | `builtInLayersState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 76965 | `BTS_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77518 | `overtureStacState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77629 | `OvertureVTDecoder` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 77850 | `OVERTURE_ENDPOINTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78469 | `MAPILLARY_SIGN_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78496 | `SIGN_FILTER_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78566 | `MAPILLARY_FEATURE_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78614 | `TI_SIGN_SVG` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78701 | `TI_PARENT_GROUPS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78713 | `TI_PARENT_ORDER` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 78718 | `TI_MAP_CATEGORIES` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79067 | `TI_LEGACY_KEY_MAP` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79080 | `trafficInventoryLayerState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 79093 | `TI_SIGNAL_CONSOLIDATION` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81945 | `assetTableHasSchoolHeaders` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 81946 | `assetTableAdditionalLabels` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 82262 | `assetMapLayers` | let | (coarse — see PLAN §5) | `app/modules/map/map.js` |
| 82465 | `mapAssetVisibility` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83203 | `originalComputeAggregates` | const | (coarse — see PLAN §5) | `app/modules/spatial/spatial.js` |
| 83222 | `arcgisState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83286 | `VA_SCHOOL_JURISDICTIONS` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83290 | `schoolsDataCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83299 | `vaSchoolsCache` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 83358 | `SCHOOL_GRADE_WEIGHTS` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 84970 | `schoolsState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85548 | `TRANSIT_CONFIG` | let | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 85598 | `transitState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 86802 | `schoolTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 87098 | `schoolTabTableState` | const | (coarse — see PLAN §5) | `app/modules/assets/school-tab.js` |
| 87151 | `transitTabState` | const | (coarse — see PLAN §5) | `app/modules/assets/transit-tab.js` |
| 87231 | `signDefState` | const | (coarse — see PLAN §5) | `app/modules/app/unassigned.js` |
| 87261 | `SIGNDEF_MUTCD_CONFIG` | const | (coarse — see PLAN §5) | `app/modules/warrants/warrants.js` |

## Event listeners attached at module top-level

| L | Event | Selector / target | Handler | Proposed module |
|---|---|---|---|---|
| 15017 | `load` | `window` | inline | `app/modules/app/unassigned.js` |
| 18337 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 18343 | `beforeunload` | `window` | inline | `app/modules/app/unassigned.js` |
| 19925 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 20058 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 21522 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 24971 | `crashtab:hotspots:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 24976 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 24988 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 24997 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 27535 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 34160 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 35664 | `crashtab:safety:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35718 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35719 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35746 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35747 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35783 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 35784 | `crashtab:dashboard:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 35917 | `CL:tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 35955 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 36291 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36292 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 36297 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36316 | `tierChanged` | `document` | inline | `app/modules/core/tier.js` |
| 36329 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 37479 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 44902 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 44992 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45062 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45112 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45160 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 45174 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 45326 | `message` | `window` | inline | `app/modules/app/unassigned.js` |
| 46757 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 47840 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 53917 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 57280 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 64168 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 67642 | `crashtab:fatalspeeding:shown` | `window` | inline | `app/modules/app/unassigned.js` |
| 69498 | `jurisdictionChanged` | `window` | inline | `app/modules/data/filter-wiring.js` |
| 72059 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 72078 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 72160 | `crashDataLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 75904 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 76495 | `click` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 76503 | `keydown` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 77485 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 78446 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 83197 | `DOMContentLoaded` | `document` | inline | `app/modules/app/bootstrap.js` |
| 83468 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 85718 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 85729 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
| 86867 | `jurisdictionChanged` | `document` | inline | `app/modules/data/filter-wiring.js` |
