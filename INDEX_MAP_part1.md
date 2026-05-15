# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-15 · source `app/index.html` (159387 lines)

Declarations in this part: **633**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.

| Start L | End L | LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|
| 97 | 110 | 14 | `safeJsonParse` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 111 | 120 | 10 | `esc` | window fn | — | refs:6751 | Unassigned | `app/modules/app/unassigned.js` |
| 121 | 16561 | 16441 | `navigateTo` | window fn | — | refs:34 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 16562 | 16569 | 8 | `signal_toggleAIPanel` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16570 | 16577 | 8 | `signal_toggleDisclaimer` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16578 | 16594 | 17 | `signal_toggleExportButtons` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16595 | 16622 | 28 | `signal_updateDaySlots` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16623 | 16629 | 7 | `signal_handleDisclaimerCheckbox` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16630 | 16636 | 7 | `signal_toggleVirginiaInfo` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16637 | 16656 | 20 | `signal_check70pct` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16657 | 16665 | 9 | `signal_toggleRTOptions` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16666 | 16673 | 8 | `signal_toggleWarrant4` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16674 | 16686 | 13 | `signal_updateW4HourVisibility` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16687 | 16705 | 19 | `signal_autoPopulateW4MajorVolumes` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16706 | 16706 | 1 | `approachTotal` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 16707 | 16743 | 37 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 16744 | 16750 | 7 | `signal_toggleWarrant5` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16751 | 16758 | 8 | `signal_toggleWarrant7` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16759 | 16780 | 22 | `signal_selectAveragingMethod` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16781 | 16799 | 19 | `signal_toggleWeekendAnalysis` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16800 | 16864 | 65 | `signal_setCountType` | fn | — | refs:5 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16865 | 16890 | 26 | `signal_updateTMCGrid` | fn | — | refs:7 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16891 | 16922 | 32 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 16923 | 16939 | 17 | `signal_generateTMCRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 16940 | 16953 | 14 | `hasUTurn` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16954 | 16989 | 36 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 16990 | 17005 | 16 | `signal_updateRowTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17006 | 17011 | 6 | `signal_markTotalManual` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17012 | 17026 | 15 | `signal_clearTMCForm` | fn | — | refs:5 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17027 | 17099 | 73 | `signal_addCurrentDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17100 | 17109 | 10 | `signal_advanceToNextDay` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17110 | 17152 | 43 | `signal_clearAIUploads` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17153 | 17190 | 38 | `signal_saveData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17191 | 17284 | 94 | `signal_loadSavedData` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17285 | 17305 | 21 | `signal_exportData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17306 | 17325 | 20 | `signal_clearAll` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17326 | 17357 | 32 | `signal_renderDayCards` | fn | — | refs:17 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 17358 | 17360 | 3 | `sumMovements` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 17361 | 19965 | 2605 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 19966 | 19986 | 21 | `safeFlyTo` | fn | — | refs:33 | Map | `app/modules/map/map.js` |
| 19987 | 20005 | 19 | `safeFitBounds` | fn | — | refs:20 | Map | `app/modules/map/map.js` |
| 20006 | 20032 | 27 | `safeFlyToBounds` | fn | — | refs:12 | Map | `app/modules/map/map.js` |
| 20033 | 20048 | 16 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20049 | 20059 | 11 | `center` | const arrow | — | refs:3062 | Unassigned | `app/modules/app/unassigned.js` |
| 20060 | 20068 | 9 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20069 | 20089 | 21 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 20090 | 20098 | 9 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20099 | 20129 | 31 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20130 | 20143 | 14 | `defaultState` | const arrow | — | refs:47 | Unassigned | `app/modules/app/unassigned.js` |
| 20144 | 20156 | 13 | `applyStateDefaultEPDO` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20157 | 20170 | 14 | `safeJsonParse` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 20171 | 20206 | 36 | `loadEPDOPreset` | fn | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20207 | 20221 | 15 | `spec` | const arrow | — | refs:735 | Unassigned | `app/modules/app/unassigned.js` |
| 20222 | 20261 | 40 | `loadSavedEPDOPreset` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20262 | 20265 | 4 | `saveCustomEPDOWeights` | fn | — | refs:5 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20266 | 20283 | 18 | `toggleEPDOSection` | fn | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20284 | 20313 | 30 | `updateEPDOPresetUI` | fn | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20314 | 20332 | 19 | `updateEPDOWeightLabels` | fn | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20333 | 20341 | 9 | `getEPDOPresetLabel` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20342 | 20399 | 58 | `recalculateAllEPDO` | fn | — | refs:7 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 20400 | 20440 | 41 | `setViewTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 20441 | 20457 | 17 | `updateTabVisibilityForTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 20458 | 20514 | 57 | `updateTierSelectorUI` | fn | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 20515 | 20591 | 77 | `handleTierChange` | async fn | — | refs:21 | Core/Tier | `app/modules/core/tier.js` |
| 20592 | 20653 | 62 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 20654 | 20665 | 12 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 20666 | 20766 | 101 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 20767 | 20769 | 3 | `loadGeoData` | async fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20770 | 20794 | 25 | `r2Base` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 20795 | 20802 | 8 | `_getCurrentStateFips` | fn | — | refs:5 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20803 | 20812 | 10 | `_getCurrentStateAbbr` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 20813 | 20836 | 24 | `_extractPlaceType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20837 | 20848 | 12 | `_placeSlugFor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20849 | 20923 | 75 | `lookupCountyKeyByFips` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20924 | 20975 | 52 | `_resolvePlaceParentCountyFips` | async fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20976 | 21010 | 35 | `populateGeoTierDropdown` | async fn | — | refs:3 | Core/Tier | `app/modules/core/tier.js` |
| 21011 | 21023 | 13 | `key` | const arrow | — | refs:1934 | Unassigned | `app/modules/app/unassigned.js` |
| 21024 | 21073 | 50 | `key` | const arrow | — | refs:1934 | Unassigned | `app/modules/app/unassigned.js` |
| 21074 | 21077 | 4 | `populatePlanningDistrictDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21078 | 21093 | 16 | `hierarchy` | const arrow | — | refs:65 | Unassigned | `app/modules/app/unassigned.js` |
| 21094 | 21109 | 16 | `name` | const arrow | — | refs:8773 | Unassigned | `app/modules/app/unassigned.js` |
| 21110 | 21118 | 9 | `handlePlanningDistrictSelection` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21119 | 21210 | 92 | `hierarchy` | const arrow | — | refs:65 | Unassigned | `app/modules/app/unassigned.js` |
| 21211 | 21236 | 26 | `handleCountySelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21237 | 21260 | 24 | `handleCitySelection` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21261 | 21376 | 116 | `place` | const arrow | — | refs:1026 | Unassigned | `app/modules/app/unassigned.js` |
| 21377 | 21434 | 58 | `tierResolved` | const arrow | — | refs:86 | Core/Tier | `app/modules/core/tier.js` |
| 21435 | 21470 | 36 | `loadStatewideCSVForTier` | async fn | — | refs:0 | Core/Tier | `app/modules/core/tier.js` |
| 21471 | 21485 | 15 | `normalized` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 21486 | 21512 | 27 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 21513 | 21523 | 11 | `populateRegionDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21524 | 21548 | 25 | `populateMPODropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21549 | 21639 | 91 | `handleRegionSelection` | async fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 21640 | 21672 | 33 | `handleMPOSelection` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 21673 | 21673 | 1 | `mpoName` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 21674 | 21676 | 3 | `mpoFullName` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21677 | 21679 | 3 | `matchMPOFeature` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21680 | 21680 | 1 | `acronym` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 21681 | 21829 | 149 | `name` | const arrow | — | refs:8773 | Unassigned | `app/modules/app/unassigned.js` |
| 21830 | 21889 | 60 | `getCountyFIPSListForTier` | fn | — | refs:5 | Core/Tier | `app/modules/core/tier.js` |
| 21890 | 21953 | 64 | `getBoundsForTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 21954 | 21984 | 31 | `getTierScopeKey` | fn | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 21985 | 22017 | 33 | `getTierScopeName` | fn | — | refs:5 | Core/Tier | `app/modules/core/tier.js` |
| 22018 | 22032 | 15 | `_estimateBoundsFromCenter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22033 | 22056 | 24 | `_computeMultiCountyBounds` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22057 | 22057 | 1 | `padLat` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22058 | 22065 | 8 | `padLng` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22066 | 22114 | 49 | `ensureTierBoundaryDisplayed` | async fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 22115 | 22119 | 5 | `HierarchyRegistry` | const arrow | — | refs:34 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 22120 | 22136 | 17 | `load` | async fn | — | refs:2980 | Unassigned | `app/modules/app/unassigned.js` |
| 22137 | 22137 | 1 | `getData` | fn | — | refs:40 | Unassigned | `app/modules/app/unassigned.js` |
| 22138 | 22139 | 2 | `getStateKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22140 | 22143 | 4 | `getRegions` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22144 | 22150 | 7 | `getTPRs` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22151 | 22151 | 1 | `getMPOs` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 22152 | 22153 | 2 | `getRuralTPRs` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22154 | 22162 | 9 | `getCountiesInRegion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22163 | 22171 | 9 | `getCountiesInTPR` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22172 | 22186 | 15 | `getCountyMemberships` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22187 | 22190 | 4 | `getCorridors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22191 | 22199 | 9 | `getCountiesOnCorridor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22200 | 22203 | 4 | `getCountyName` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22204 | 22207 | 4 | `getRegionTypeLabel` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 22208 | 22224 | 17 | `getTPRTypeLabel` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22225 | 22244 | 20 | `BoundaryService` | const arrow | — | refs:24 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 22245 | 22259 | 15 | `_openDB` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22260 | 22279 | 20 | `_getFromDB` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 22280 | 22290 | 11 | `_saveToDB` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 22291 | 22330 | 40 | `_queryTigerWeb` | async fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 22331 | 22352 | 22 | `_arcgisJsonToGeoJSON` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22353 | 22417 | 65 | `_queryBtsMpo` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 22418 | 22478 | 61 | `_spatialQueryBtsMpo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22479 | 22684 | 206 | `mpoQuery` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22685 | 22720 | 36 | `FederalBoundaries` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 22721 | 22734 | 14 | `_buildColorMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22735 | 22768 | 34 | `getActiveStates` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22769 | 22820 | 52 | `render` | async fn | — | refs:516 | Unassigned | `app/modules/app/unassigned.js` |
| 22821 | 22850 | 30 | `crashLine` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 22851 | 22864 | 14 | `remove` | fn | — | refs:577 | Unassigned | `app/modules/app/unassigned.js` |
| 22865 | 22867 | 3 | `SpatialClipService` | const arrow | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 22868 | 22875 | 8 | `getJurisdictionPolygon` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22876 | 22907 | 32 | `clipPoints` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22908 | 22930 | 23 | `clipLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22931 | 22954 | 24 | `clipPolygons` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22955 | 22959 | 5 | `AggregateLoader` | const arrow | — | refs:14 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 22960 | 22961 | 2 | `_resolveR2Url` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22962 | 22978 | 17 | `r2Base` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 22979 | 22990 | 12 | `_isSupabaseOnlyAggregatePath` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 22991 | 23143 | 153 | `_fetch` | async fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 23144 | 23147 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23148 | 23220 | 73 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23221 | 23224 | 4 | `r2Prefix` | const arrow | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 23225 | 23231 | 7 | `stAbbr` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 23232 | 23265 | 34 | `roadType` | const arrow | — | refs:103 | Unassigned | `app/modules/app/unassigned.js` |
| 23266 | 23324 | 59 | `loadR2Manifest` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23325 | 23372 | 48 | `checkR2DataAvailability` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23373 | 23411 | 39 | `getR2DataAvailabilitySummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23412 | 23445 | 34 | `resolveDataUrl` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 23446 | 23515 | 70 | `activeStateKey` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 23516 | 23551 | 36 | `diagR2Connection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23552 | 23616 | 65 | `buildLocalFallbackPaths` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23617 | 23680 | 64 | `fetchCsvWithFallback` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 23681 | 23703 | 23 | `_streamResponseChunks` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23704 | 23712 | 9 | `streamResponseToArrayBuffer` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23713 | 23727 | 15 | `streamResponseToText` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23728 | 23791 | 64 | `validateAppPaths` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23792 | 23813 | 22 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23814 | 23831 | 18 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23832 | 23835 | 4 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23836 | 23906 | 71 | `countyFips` | const arrow | — | refs:48 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 23907 | 23940 | 34 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 23941 | 23950 | 10 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 23951 | 23958 | 8 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 23959 | 23966 | 8 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 23967 | 23987 | 21 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 23988 | 24013 | 26 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 24014 | 24036 | 23 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24037 | 24071 | 35 | `fetchWithRetry` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 24072 | 24105 | 34 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 24106 | 24125 | 20 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24126 | 24138 | 13 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24139 | 24197 | 59 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24198 | 24209 | 12 | `apply` | const arrow | — | refs:380 | Unassigned | `app/modules/app/unassigned.js` |
| 24210 | 24410 | 201 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24411 | 24464 | 54 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24465 | 24480 | 16 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24481 | 24502 | 22 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24503 | 24534 | 32 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 24535 | 24547 | 13 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 24548 | 24560 | 13 | `fallbackState` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 24561 | 24585 | 25 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 24586 | 24606 | 21 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24607 | 24666 | 60 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 24667 | 24684 | 18 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 24685 | 24710 | 26 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 24711 | 24714 | 4 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24715 | 24734 | 20 | `map` | const arrow | — | refs:3434 | Unassigned | `app/modules/app/unassigned.js` |
| 24735 | 24825 | 91 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 24826 | 24848 | 23 | `_fipsToAbbr` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 24849 | 24937 | 89 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24938 | 25034 | 97 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 25035 | 25093 | 59 | `_hssTr` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25094 | 25104 | 11 | `locked` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 25105 | 25123 | 19 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25124 | 25276 | 153 | `mapInstance` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 25277 | 25291 | 15 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25292 | 25400 | 109 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 25401 | 25426 | 26 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 25427 | 25429 | 3 | `smartDefault` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25430 | 25460 | 31 | `filterProfile` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 25461 | 25477 | 17 | `activeTier` | const arrow | — | refs:36 | Core/Tier | `app/modules/core/tier.js` |
| 25478 | 25617 | 140 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 25618 | 25654 | 37 | `tierResolved` | const arrow | — | refs:86 | Core/Tier | `app/modules/core/tier.js` |
| 25655 | 25728 | 74 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 25729 | 25743 | 15 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 25744 | 25785 | 42 | `mapRef` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 25786 | 25840 | 55 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25841 | 25850 | 10 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25851 | 25922 | 72 | `geoBounds` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 25923 | 25973 | 51 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 25974 | 25976 | 3 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 25977 | 26052 | 76 | `geoConfig` | const arrow | — | refs:76 | Unassigned | `app/modules/app/unassigned.js` |
| 26053 | 26112 | 60 | `targetJurisdiction` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26113 | 26131 | 19 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26132 | 26139 | 8 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26140 | 26210 | 71 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 26211 | 26223 | 13 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 26224 | 26273 | 50 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26274 | 26325 | 52 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26326 | 26347 | 22 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26348 | 26361 | 14 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 26362 | 26397 | 36 | `ln` | const arrow | — | refs:949 | Unassigned | `app/modules/app/unassigned.js` |
| 26398 | 26404 | 7 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 26405 | 26410 | 6 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26411 | 26416 | 6 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26417 | 26426 | 10 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 26427 | 26611 | 185 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 26612 | 26713 | 102 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 26714 | 26727 | 14 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 26728 | 26738 | 11 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26739 | 26760 | 22 | `apply` | fn | — | refs:380 | Unassigned | `app/modules/app/unassigned.js` |
| 26761 | 26771 | 11 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26772 | 26791 | 20 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26792 | 26810 | 19 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26811 | 26912 | 102 | `currentState` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 26913 | 26974 | 62 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 26975 | 27000 | 26 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27001 | 27866 | 866 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27867 | 27903 | 37 | `crashCacheOpen` | async fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 27904 | 27904 | 1 | `getCrashCacheKey` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 27905 | 27908 | 4 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 27909 | 27919 | 11 | `tier` | const arrow | — | refs:1607 | Core/Tier | `app/modules/core/tier.js` |
| 27920 | 27970 | 51 | `crashCacheSave` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 27971 | 28012 | 42 | `crashCacheLoad` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28013 | 28061 | 49 | `currentState` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28062 | 28089 | 28 | `crashCacheDelete` | async fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 28090 | 28118 | 29 | `crashCacheClearAll` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 28119 | 28149 | 31 | `crashCacheGetStats` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28150 | 28187 | 38 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28188 | 28189 | 2 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28190 | 28244 | 55 | `currentState` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28245 | 28258 | 14 | `_openMapPointsCache` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28259 | 28262 | 4 | `_mapPointsDayBucket` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28263 | 28266 | 4 | `_mapPointsCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28267 | 28280 | 14 | `_readMapPointsCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28281 | 28304 | 24 | `_writeMapPointsCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28305 | 28310 | 6 | `_hydrateMapPointsFromMatview` | async fn | — | refs:7 | Map | `app/modules/map/map.js` |
| 28311 | 28323 | 13 | `t` | const arrow | — | refs:641078 | Unassigned | `app/modules/app/unassigned.js` |
| 28324 | 28330 | 7 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 28331 | 28364 | 34 | `promise` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 28365 | 28385 | 21 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28386 | 28399 | 14 | `_bgResolved` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28400 | 28460 | 61 | `snapshotState` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 28461 | 28488 | 28 | `currentState` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28489 | 28489 | 1 | `fields` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 28490 | 28517 | 28 | `rows` | const arrow | — | refs:847 | Unassigned | `app/modules/app/unassigned.js` |
| 28518 | 28556 | 39 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 28557 | 28651 | 95 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 28652 | 28673 | 22 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 28674 | 28727 | 54 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 28728 | 28741 | 14 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28742 | 28780 | 39 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 28781 | 28791 | 11 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28792 | 28827 | 36 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28828 | 28874 | 47 | `warrantDbOpen` | async fn | — | refs:15 | Warrants | `app/modules/warrants/warrants.js` |
| 28875 | 28908 | 34 | `warrantDbSave` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 28909 | 28936 | 28 | `warrantDbSaveWithId` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 28937 | 28958 | 22 | `warrantDbLoadLatest` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 28959 | 28980 | 22 | `warrantDbLoadAll` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 28981 | 28997 | 17 | `warrantDbLoadById` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 28998 | 29017 | 20 | `warrantDbDelete` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 29018 | 29038 | 21 | `warrantDbClear` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 29039 | 29061 | 23 | `warrantDbClearAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29062 | 29107 | 46 | `warrantDbClearByDate` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29108 | 29145 | 38 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29146 | 29192 | 47 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 29193 | 29232 | 40 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29233 | 29251 | 19 | `warrantDbScheduleAutoSave` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 29252 | 29280 | 29 | `warrantDbAutoSave` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29281 | 29309 | 29 | `warrantDbCollectSignalData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 29310 | 29343 | 34 | `warrantDbCollectStopSignData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 29344 | 29386 | 43 | `warrantDbCollectRoundaboutData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29387 | 29408 | 22 | `warrantDbCollectPedestrianData` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 29409 | 29430 | 22 | `warrantDbUpdateStorageStats` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 29431 | 29453 | 23 | `warrantDbUpdateStorageIndicatorUI` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29454 | 29474 | 21 | `warrantDbUpdateIndicator` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29475 | 29504 | 30 | `warrantDbExportAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29505 | 29532 | 28 | `warrantDbExportType` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 29533 | 29571 | 39 | `warrantDbImport` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29572 | 29591 | 20 | `warrantDbShowImportDialog` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29592 | 29692 | 101 | `warrantDbTransferSignalToStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29693 | 29726 | 34 | `warrantDbTransferSignalToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29727 | 29783 | 57 | `hourTotal` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 29784 | 29820 | 37 | `warrantDbTransferStopSignToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29821 | 29916 | 96 | `warrantDbTransferStopSignToSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29917 | 29994 | 78 | `warrantDbRestoreSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 29995 | 30069 | 75 | `warrantDbRestoreStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 30070 | 30155 | 86 | `warrantDbRestoreRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 30156 | 30179 | 24 | `warrantDbInit` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 30180 | 30189 | 10 | `toggleWarrantDataMenu` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 30190 | 30205 | 16 | `toggleClearActionsMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30206 | 30232 | 27 | `closeClearActionsMenu` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 30233 | 30260 | 28 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30261 | 30276 | 16 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 30277 | 30300 | 24 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30301 | 30326 | 26 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30327 | 31145 | 819 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 31146 | 31153 | 8 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31154 | 31160 | 7 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 31161 | 31180 | 20 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31181 | 31185 | 5 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 31186 | 31192 | 7 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31193 | 31196 | 4 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31197 | 31200 | 4 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31201 | 31206 | 6 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31207 | 31215 | 9 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31216 | 31237 | 22 | `toggleAIMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31238 | 31244 | 7 | `handleAIToggleKeydown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31245 | 31275 | 31 | `initAIModeToggle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31276 | 31311 | 36 | `saveHeaderApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31312 | 31324 | 13 | `clearHeaderApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31325 | 31348 | 24 | `updateHeaderKeyStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 31349 | 31375 | 27 | `updateAllAIStatusIndicators` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31376 | 31409 | 34 | `updateHeaderProviderLink` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31410 | 31505 | 96 | `initHeaderApiKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31506 | 31600 | 95 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 31601 | 31605 | 5 | `intAnalysis` | const arrow | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 31606 | 31607 | 2 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 31608 | 31626 | 19 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 31627 | 31647 | 21 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 31648 | 31677 | 30 | `startItem` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31678 | 31695 | 18 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31696 | 31703 | 8 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 31704 | 31708 | 5 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 31709 | 31722 | 14 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 31723 | 31731 | 9 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 31732 | 31740 | 9 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31741 | 31750 | 10 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31751 | 31758 | 8 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31759 | 31878 | 120 | `showTab` | fn | — | refs:104 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 31879 | 31898 | 20 | `tryRestore` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31899 | 31901 | 3 | `mpoName` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 31902 | 31902 | 1 | `acronym` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 31903 | 31941 | 39 | `name` | const arrow | — | refs:8773 | Unassigned | `app/modules/app/unassigned.js` |
| 31942 | 32099 | 158 | `_supabaseTabReady` | fn | — | refs:6 | Bootstrap | `app/modules/app/bootstrap.js` |
| 32100 | 32117 | 18 | `navigateTo` | fn | — | refs:34 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 32118 | 32126 | 9 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32127 | 32157 | 31 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 32158 | 32178 | 21 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32179 | 32195 | 17 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32196 | 32252 | 57 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32253 | 32262 | 10 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32263 | 32296 | 34 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32297 | 32304 | 8 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 32305 | 32319 | 15 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32320 | 32338 | 19 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 32339 | 32346 | 8 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32347 | 32410 | 64 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32411 | 32423 | 13 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32424 | 32436 | 13 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32437 | 32441 | 5 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32442 | 32455 | 14 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32456 | 32463 | 8 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32464 | 32483 | 20 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32484 | 32510 | 27 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32511 | 32527 | 17 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32528 | 32534 | 7 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32535 | 32552 | 18 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32553 | 32560 | 8 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32561 | 32583 | 23 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32584 | 32591 | 8 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32592 | 32598 | 7 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32599 | 32635 | 37 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 32636 | 32683 | 48 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 32684 | 32700 | 17 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32701 | 32718 | 18 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32719 | 32729 | 11 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 32730 | 32741 | 12 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32742 | 32761 | 20 | `normalized` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 32762 | 32782 | 21 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32783 | 32809 | 27 | `normalized` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 32810 | 32844 | 35 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32845 | 32850 | 6 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32851 | 32860 | 10 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32861 | 32868 | 8 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32869 | 32869 | 1 | `collisionVal` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 32870 | 32886 | 17 | `docNbr` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 32887 | 32947 | 61 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32948 | 32951 | 4 | `normalized` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 32952 | 32961 | 10 | `docNbr` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 32962 | 33095 | 134 | `collisionVal` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 33096 | 33102 | 7 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33103 | 33110 | 8 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 33111 | 33150 | 40 | `allRoadsSuffix` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 33151 | 33185 | 35 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33186 | 33270 | 85 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 33271 | 33531 | 261 | `_bootDefault` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33532 | 33553 | 22 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33554 | 33973 | 420 | `_requestedRoadTypeSuffix` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 33974 | 34042 | 69 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34043 | 34051 | 9 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34052 | 34073 | 22 | `normalized` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 34074 | 34105 | 32 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34106 | 34119 | 14 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34120 | 34299 | 180 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 34300 | 34303 | 4 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 34304 | 34314 | 11 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 34315 | 34315 | 1 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 34316 | 34316 | 1 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 34317 | 34317 | 1 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 34318 | 34517 | 200 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 34518 | 34540 | 23 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 34541 | 34547 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 34548 | 34569 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 34570 | 34581 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34582 | 34582 | 1 | `updateProgress` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 34583 | 34601 | 19 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 34602 | 34646 | 45 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 34647 | 34690 | 44 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 34691 | 34699 | 9 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34700 | 34728 | 29 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34729 | 34751 | 23 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34752 | 34760 | 9 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34761 | 34778 | 18 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34779 | 34836 | 58 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 34837 | 34838 | 2 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34839 | 34941 | 103 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 34942 | 34943 | 2 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 34944 | 34965 | 22 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 34966 | 34973 | 8 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 34974 | 34985 | 12 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34986 | 35018 | 33 | `initGrantModule` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35019 | 35023 | 5 | `mergeGrantProgramsFromSupabase` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35024 | 35028 | 5 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 35029 | 35037 | 9 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 35038 | 35073 | 36 | `stateSpecific` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 35074 | 35078 | 5 | `initYearRangeFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35079 | 35086 | 8 | `applyGrantDateFilter` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 35087 | 35095 | 9 | `resetGrantDateFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35096 | 35096 | 1 | `applyYearRangeFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 35097 | 35098 | 2 | `resetYearRange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 35099 | 35110 | 12 | `showGrantTab` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35111 | 35116 | 6 | `searchGrantsGovKeyword` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 35117 | 35120 | 4 | `openGrantsGovNewTab` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 35121 | 35152 | 32 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 35153 | 35164 | 12 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35165 | 35199 | 35 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35200 | 35201 | 2 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 35202 | 35213 | 12 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35214 | 35214 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35215 | 35222 | 8 | `grantText` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35223 | 35228 | 6 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35229 | 35237 | 9 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35238 | 35241 | 4 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35242 | 35261 | 20 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35262 | 35268 | 7 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35269 | 35271 | 3 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35272 | 35305 | 34 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 35306 | 35321 | 16 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35322 | 35356 | 35 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35357 | 35396 | 40 | `analyzeCrashPatterns` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 35397 | 35439 | 43 | `collisionVal` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 35440 | 35453 | 14 | `calculateSeverityTrend` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35454 | 35464 | 11 | `pctChange` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 35465 | 35503 | 39 | `calculateEnhancedGrantScore_legacy` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35504 | 35521 | 18 | `rate` | const arrow | — | refs:1998 | Unassigned | `app/modules/app/unassigned.js` |
| 35522 | 35523 | 2 | `getMatchingGrantsEnhanced_legacy` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35524 | 35587 | 64 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 35588 | 35588 | 1 | `getBestMatchProgramEnhanced_legacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35589 | 35618 | 30 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 35619 | 35633 | 15 | `getBestMatchProgram` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 35634 | 35721 | 88 | `getMatchingGrants` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 35722 | 35729 | 8 | `calculateCountyBaselines` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35730 | 35736 | 7 | `calculateORI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35737 | 35744 | 8 | `normalCDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35745 | 35752 | 8 | `testPatternSignificance` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35753 | 35759 | 7 | `calculatePSI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35760 | 35765 | 6 | `calculateFeasibilityAndBC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35766 | 35832 | 67 | `checkAndAdd` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 35833 | 35848 | 16 | `calculateFeasibilitySubScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35849 | 35857 | 9 | `calculateGrantFitScores` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35858 | 35898 | 41 | `calculateHSIPFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35899 | 35902 | 4 | `calculateSS4AFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35903 | 35903 | 1 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 35904 | 35934 | 31 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 35935 | 35965 | 31 | `calculate402Fit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35966 | 36001 | 36 | `calculate405dFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36002 | 36018 | 17 | `calculateImprovedGrantScore` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 36019 | 36023 | 5 | `getImprovedGrantMatches` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 36024 | 36024 | 1 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 36025 | 36086 | 62 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 36087 | 36104 | 18 | `getImprovedBestMatch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36105 | 36117 | 13 | `getGrantRankingCacheKey` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 36118 | 36129 | 12 | `showGrantRankingProgress` | fn | — | refs:15 | Grants | `app/modules/grants/grants.js` |
| 36130 | 36134 | 5 | `yieldToUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36135 | 36226 | 92 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 36227 | 36231 | 5 | `nodeEntries` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36232 | 36274 | 43 | `routeEntries` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36275 | 36294 | 20 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 36295 | 36356 | 62 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 36357 | 36370 | 14 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 36371 | 36382 | 12 | `nodeConcentration` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36383 | 36433 | 51 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 36434 | 36445 | 12 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 36446 | 36450 | 5 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 36451 | 36461 | 11 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 36462 | 36522 | 61 | `rt` | const arrow | — | refs:13997 | Unassigned | `app/modules/app/unassigned.js` |
| 36523 | 36586 | 64 | `key` | const arrow | — | refs:1934 | Unassigned | `app/modules/app/unassigned.js` |
| 36587 | 36596 | 10 | `applyLocationLimit` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 36597 | 36607 | 11 | `changeLocationLimit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36608 | 36613 | 6 | `changeGrantAggregation` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 36614 | 36629 | 16 | `changeGrantScoringProfile` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 36630 | 36633 | 4 | `hideScoringProfileBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36634 | 36639 | 6 | `changeGrantMinCrashes` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 36640 | 36688 | 49 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36689 | 36743 | 55 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36744 | 36776 | 33 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36777 | 36804 | 28 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36805 | 36831 | 27 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36832 | 36835 | 4 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36836 | 36872 | 37 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 36873 | 36876 | 4 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36877 | 36893 | 17 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 36894 | 36910 | 17 | `m` | const arrow | — | refs:177195 | Unassigned | `app/modules/app/unassigned.js` |
| 36911 | 37016 | 106 | `inst` | const arrow | — | refs:394 | Unassigned | `app/modules/app/unassigned.js` |
| 37017 | 37050 | 34 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37051 | 37069 | 19 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37070 | 37071 | 2 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37072 | 37121 | 50 | `user` | const arrow | — | refs:720 | Unassigned | `app/modules/app/unassigned.js` |
| 37122 | 37139 | 18 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 37140 | 37141 | 2 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37142 | 37180 | 39 | `user` | const arrow | — | refs:720 | Unassigned | `app/modules/app/unassigned.js` |
| 37181 | 37191 | 11 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37192 | 37236 | 45 | `recipients` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 37237 | 37285 | 49 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37286 | 37311 | 26 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37312 | 37314 | 3 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37315 | 37326 | 12 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 37327 | 37334 | 8 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37335 | 37390 | 56 | `user` | const arrow | — | refs:720 | Unassigned | `app/modules/app/unassigned.js` |
| 37391 | 37404 | 14 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37405 | 37472 | 68 | `user` | const arrow | — | refs:720 | Unassigned | `app/modules/app/unassigned.js` |
| 37473 | 38173 | 701 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38174 | 38192 | 19 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38193 | 38193 | 1 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38194 | 38219 | 26 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 38220 | 38227 | 8 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38228 | 38233 | 6 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38234 | 38239 | 6 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 38240 | 38244 | 5 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38245 | 38253 | 9 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38254 | 38259 | 6 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38260 | 38267 | 8 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38268 | 38298 | 31 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 38299 | 38315 | 17 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38316 | 38367 | 52 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38368 | 38407 | 40 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38408 | 38414 | 7 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38415 | 38455 | 41 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 38456 | 38460 | 5 | `initEmailChipState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38461 | 38466 | 6 | `isValidEmail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38467 | 38478 | 12 | `addEmailFromInput` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38479 | 38504 | 26 | `addEmailChip` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38505 | 38520 | 16 | `removeEmailChip` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38521 | 38528 | 8 | `setEmailPrimary` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38529 | 38538 | 10 | `clearAllEmails` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38539 | 38561 | 23 | `handleEmailInputKeydown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38562 | 38563 | 2 | `handleEmailPaste` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38564 | 38591 | 28 | `pastedText` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38592 | 38596 | 5 | `showEmailError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 38597 | 38601 | 5 | `showEmailSuccess` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38602 | 38621 | 20 | `showEmailToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38622 | 38677 | 56 | `refreshEmailChips` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38678 | 38706 | 29 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38707 | 38708 | 2 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38709 | 38709 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 38710 | 38713 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 38714 | 38846 | 133 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 38847 | 38852 | 6 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38853 | 38853 | 1 | `prefs` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js` |
| 38854 | 38855 | 2 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 38856 | 38917 | 62 | `userId` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38918 | 38950 | 33 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38951 | 38957 | 7 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38958 | 39007 | 50 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39008 | 39047 | 40 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39048 | 39055 | 8 | `resetTestBtn` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 39056 | 39128 | 73 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 39129 | 39129 | 1 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39130 | 39302 | 173 | `dateRange` | const arrow | — | refs:71 | Unassigned | `app/modules/app/unassigned.js` |
| 39303 | 39327 | 25 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 39328 | 39328 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39329 | 39382 | 54 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 39383 | 39419 | 37 | `locations` | const arrow | — | refs:579 | Unassigned | `app/modules/app/unassigned.js` |
| 39420 | 39485 | 66 | `locations` | const arrow | — | refs:579 | Unassigned | `app/modules/app/unassigned.js` |
| 39486 | 39499 | 14 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39500 | 39588 | 89 | `resetTestBtn` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 39589 | 39633 | 45 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39634 | 39643 | 10 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39644 | 39675 | 32 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39676 | 39704 | 29 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39705 | 39753 | 49 | `rowRoute` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39754 | 39796 | 43 | `buildEmailSubjectLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39797 | 39798 | 2 | `buildEmailStatsSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39799 | 39852 | 54 | `epdo` | const arrow | — | refs:982 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 39853 | 39861 | 9 | `buildEmailFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39862 | 39879 | 18 | `col` | const arrow | — | refs:8705 | Unassigned | `app/modules/app/unassigned.js` |
| 39880 | 39898 | 19 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 39899 | 39923 | 25 | `getDefaultReportTitle` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39924 | 39940 | 17 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 39941 | 39957 | 17 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 39958 | 39976 | 19 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 39977 | 40031 | 55 | `otherMatches` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
