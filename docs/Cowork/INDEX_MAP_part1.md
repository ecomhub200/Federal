# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-20 · source `app/index.html` (101803 lines)

Declarations in this part: **638**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 126 | 139 | 135 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140 | 149 | 145 | 10 | 6 | `esc` | window fn | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 150 | 14821 | 161 | 14672 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 14822 | 14848 | 14845 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14849 | 14878 | 14853 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14879 | 14887 | 14881 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 14888 | 14913 | 14925 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14914 | 14998 | 14914 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 14999 | 15002 | 15002 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15003 | 15028 | 15006 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15029 | 15146 | 15034 | 118 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15147 | 15159 | 15153 | 13 | 7 | `fireJurisdictionChanged` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15160 | 15179 | 15175 | 20 | 16 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15180 | 15197 | 15191 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15198 | 15272 | 15262 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15273 | 15306 | 15302 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 15307 | 15316 | 15311 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 15317 | 15324 | 15320 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 15325 | 15332 | 15328 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15333 | 15361 | 15345 | 29 | 13 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 15362 | 15387 | 15367 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 15388 | 15389 | 15388 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15390 | 15410 | 15390 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15411 | 15445 | 15411 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15446 | 15479 | 15475 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 15480 | 15499 | 15495 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15500 | 15512 | 15508 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15513 | 15559 | 15555 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15560 | 15563 | 15560 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15564 | 15571 | 15564 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15572 | 15583 | 15576 | 12 | 5 | `apply` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 15584 | 15677 | 15780 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15678 | 15784 | 15682 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15785 | 15838 | 15836 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15839 | 15854 | 15852 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15855 | 15876 | 15871 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15877 | 15908 | 15903 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 15909 | 15934 | 15927 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15935 | 15959 | 15952 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 15960 | 15980 | 15966 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15981 | 16040 | 16030 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 16041 | 16058 | 16048 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 16059 | 16084 | 16077 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 16085 | 16108 | 16106 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16109 | 16199 | 16192 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16200 | 16222 | 16217 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 16223 | 16268 | 16306 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16269 | 16269 | 16269 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16270 | 16311 | 16270 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16312 | 16478 | 16472 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16479 | 16513 | 16644 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16514 | 16650 | 16514 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16651 | 16665 | 16664 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 16666 | 16712 | 16773 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 16713 | 16774 | 16713 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16775 | 16851 | 16850 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 16852 | 17028 | 17022 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17029 | 17102 | 17101 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17103 | 17159 | 17152 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17160 | 17214 | 17207 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17215 | 17296 | 17291 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 17297 | 17347 | 17341 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17348 | 17368 | 17479 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17369 | 17486 | 17369 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 17487 | 17505 | 17497 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17506 | 17513 | 17512 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 17514 | 17584 | 17576 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 17585 | 17597 | 17595 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 17598 | 17647 | 17645 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17648 | 17699 | 17696 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17700 | 17721 | 17719 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17722 | 17771 | 17769 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 17772 | 17778 | 17777 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 17779 | 17784 | 17783 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17785 | 17790 | 17789 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17791 | 17800 | 17799 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17801 | 17987 | 17807 | 187 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17988 | 18089 | 18087 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 18090 | 18103 | 18101 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 18104 | 18114 | 18111 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 18115 | 18136 | 18128 | 22 | 14 | `apply` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 18137 | 18147 | 18145 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18148 | 18167 | 18159 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18168 | 18288 | 18286 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 18289 | 18350 | 18329 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 18351 | 18376 | 18374 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18377 | 19242 | 18386 | 866 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 19243 | 19279 | 19273 | 37 | 31 | `crashCacheOpen` | async fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 19280 | 19295 | 19291 | 16 | 12 | `getCrashCacheKey` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 19296 | 19346 | 19341 | 51 | 46 | `crashCacheSave` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19347 | 19437 | 19433 | 91 | 87 | `crashCacheLoad` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19438 | 19465 | 19461 | 28 | 24 | `crashCacheDelete` | async fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 19466 | 19494 | 19490 | 29 | 25 | `crashCacheClearAll` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 19495 | 19525 | 19521 | 31 | 27 | `crashCacheGetStats` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19526 | 19563 | 19559 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19564 | 19616 | 19608 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19617 | 19769 | 19765 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19770 | 19903 | 19896 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19904 | 19979 | 19975 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19980 | 19993 | 19989 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19994 | 20032 | 20028 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 20033 | 20043 | 20039 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 20044 | 20079 | 20071 | 36 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20080 | 20126 | 20122 | 47 | 43 | `warrantDbOpen` | async fn | — | refs:15 | Warrants | `app/modules/warrants/warrants.js` |
| 20127 | 20160 | 20156 | 34 | 30 | `warrantDbSave` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 20161 | 20188 | 20184 | 28 | 24 | `warrantDbSaveWithId` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 20189 | 20210 | 20206 | 22 | 18 | `warrantDbLoadLatest` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 20211 | 20232 | 20228 | 22 | 18 | `warrantDbLoadAll` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 20233 | 20249 | 20245 | 17 | 13 | `warrantDbLoadById` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 20250 | 20269 | 20265 | 20 | 16 | `warrantDbDelete` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 20270 | 20290 | 20286 | 21 | 17 | `warrantDbClear` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 20291 | 20313 | 20309 | 23 | 19 | `warrantDbClearAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20314 | 20359 | 20348 | 46 | 35 | `warrantDbClearByDate` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20360 | 20397 | 20391 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20398 | 20444 | 20439 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20445 | 20484 | 20476 | 40 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20485 | 20503 | 20499 | 19 | 15 | `warrantDbScheduleAutoSave` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 20504 | 20532 | 20528 | 29 | 25 | `warrantDbAutoSave` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20533 | 20561 | 20557 | 29 | 25 | `warrantDbCollectSignalData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 20562 | 20595 | 20591 | 34 | 30 | `warrantDbCollectStopSignData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 20596 | 20638 | 20634 | 43 | 39 | `warrantDbCollectRoundaboutData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20639 | 20660 | 20652 | 22 | 14 | `warrantDbCollectPedestrianData` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 20661 | 20682 | 20678 | 22 | 18 | `warrantDbUpdateStorageStats` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 20683 | 20687 | 20701 | 5 | 19 | `warrantDbUpdateStorageIndicatorUI` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20688 | 20688 | 20688 | 1 | 1 | `totalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20689 | 20705 | 20689 | 17 | 1 | `totalSize` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20706 | 20726 | 20718 | 21 | 13 | `warrantDbUpdateIndicator` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20727 | 20756 | 20752 | 30 | 26 | `warrantDbExportAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20757 | 20784 | 20780 | 28 | 24 | `warrantDbExportType` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 20785 | 20823 | 20819 | 39 | 35 | `warrantDbImport` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20824 | 20843 | 20835 | 20 | 12 | `warrantDbShowImportDialog` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20844 | 20944 | 20940 | 101 | 97 | `warrantDbTransferSignalToStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20945 | 21035 | 21031 | 91 | 87 | `warrantDbTransferSignalToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21036 | 21072 | 21067 | 37 | 32 | `warrantDbTransferStopSignToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21073 | 21168 | 21160 | 96 | 88 | `warrantDbTransferStopSignToSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21169 | 21246 | 21242 | 78 | 74 | `warrantDbRestoreSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21247 | 21321 | 21317 | 75 | 71 | `warrantDbRestoreStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21322 | 21407 | 21399 | 86 | 78 | `warrantDbRestoreRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21408 | 21431 | 21416 | 24 | 9 | `warrantDbInit` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21432 | 21441 | 21437 | 10 | 6 | `toggleWarrantDataMenu` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 21442 | 21457 | 21453 | 16 | 12 | `toggleClearActionsMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21458 | 21484 | 21464 | 27 | 7 | `closeClearActionsMenu` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 21485 | 21512 | 21508 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21513 | 21528 | 21524 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 21529 | 21552 | 21548 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21553 | 21578 | 21574 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21579 | 22072 | 21597 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 22073 | 22325 | 22077 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22326 | 22333 | 22332 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22334 | 22340 | 22339 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22341 | 22360 | 22359 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22361 | 22365 | 22364 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22366 | 22372 | 22371 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22373 | 22376 | 22375 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22377 | 22380 | 22379 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22381 | 22386 | 22385 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22387 | 22453 | 22389 | 67 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22454 | 22540 | 22464 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22541 | 22541 | 22541 | 1 | 1 | `isYes` | const arrow | — | refs:261 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22542 | 22543 | 22542 | 2 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 22544 | 22545 | 22544 | 2 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22546 | 22546 | 22546 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22547 | 22547 | 22547 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22548 | 22553 | 22553 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22554 | 22554 | 22554 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 22555 | 22555 | 22555 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22556 | 22574 | 22556 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 22575 | 22625 | 22623 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 22626 | 22643 | 22641 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22644 | 22656 | 22654 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 22657 | 22670 | 22668 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 22671 | 22679 | 22677 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 22680 | 22688 | 22687 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22689 | 22698 | 22697 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22699 | 22708 | 22705 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22709 | 22717 | 22715 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22718 | 22748 | 22742 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 22749 | 22769 | 22767 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22770 | 22786 | 22784 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22787 | 22843 | 22841 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22844 | 22853 | 22851 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22854 | 22887 | 22879 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22888 | 22895 | 22893 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 22896 | 22910 | 22908 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22911 | 22929 | 22927 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 22930 | 22937 | 22935 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 22938 | 23001 | 22999 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23002 | 23014 | 23012 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23015 | 23027 | 23026 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23028 | 23032 | 23031 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23033 | 23046 | 23045 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23047 | 23054 | 23053 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23055 | 23074 | 23061 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23075 | 23101 | 23077 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23102 | 23118 | 23117 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23119 | 23125 | 23119 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23126 | 23143 | 23141 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23144 | 23151 | 23149 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23152 | 23174 | 23172 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23175 | 23182 | 23180 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23183 | 23189 | 23187 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23190 | 23226 | 23224 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23227 | 23274 | 23272 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23275 | 23291 | 23289 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23292 | 23309 | 23307 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23310 | 23320 | 23318 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23321 | 23352 | 23350 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23353 | 23400 | 23398 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23401 | 23435 | 23429 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23436 | 23441 | 23439 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 23442 | 23451 | 23449 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 23452 | 23477 | 23475 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23478 | 23686 | 23650 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23687 | 23693 | 23689 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23694 | 23741 | 23735 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 23742 | 23776 | 23769 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23777 | 23791 | 24560 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 23792 | 24122 | 23794 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24123 | 24564 | 24140 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24565 | 24633 | 24629 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 24634 | 24664 | 24662 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24665 | 24696 | 24695 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 24697 | 24710 | 24709 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24711 | 24890 | 24888 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 24891 | 24894 | 24893 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 24895 | 25108 | 25107 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 25109 | 25131 | 25119 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 25132 | 25138 | 25138 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 25139 | 25160 | 25160 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 25161 | 25172 | 25172 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25173 | 25192 | 25191 | 20 | 19 | `updateProgress` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 25193 | 25237 | 25236 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 25238 | 25238 | 25279 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 25239 | 25239 | 25239 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25240 | 25241 | 25240 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25242 | 25257 | 25242 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25258 | 25281 | 25258 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25282 | 25294 | 25292 | 13 | 11 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25295 | 25323 | 25321 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25324 | 25337 | 25344 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25338 | 25346 | 25338 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25347 | 25355 | 25353 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25356 | 25373 | 25367 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25374 | 25431 | 25425 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 25432 | 25536 | 25534 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25537 | 25543 | 25558 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 25544 | 25560 | 25552 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25561 | 25568 | 25566 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 25569 | 25570 | 25579 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25571 | 25574 | 25571 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25575 | 25580 | 25575 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25581 | 25612 | 25609 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 25613 | 25624 | 25623 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25625 | 25659 | 25658 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 25660 | 25661 | 25660 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 25662 | 25664 | 25681 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25665 | 25673 | 25665 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25674 | 25675 | 25674 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25676 | 25682 | 25676 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25683 | 25688 | 25687 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 25689 | 25697 | 25696 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25698 | 25701 | 25700 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25702 | 25704 | 25711 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25705 | 25721 | 25705 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25722 | 25728 | 25727 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 25729 | 25765 | 25761 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25766 | 25781 | 25777 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 25782 | 25799 | 25797 | 18 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 25800 | 25860 | 26101 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 25861 | 25966 | 25869 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25967 | 25976 | 25971 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25977 | 26054 | 25977 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26055 | 26110 | 26059 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26111 | 26139 | 26249 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26140 | 26250 | 26161 | 111 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26251 | 26299 | 26298 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26300 | 26303 | 26353 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26304 | 26354 | 26313 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26355 | 26387 | 26382 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26388 | 26415 | 26414 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26416 | 26416 | 26441 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26417 | 26418 | 26417 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26419 | 26442 | 26419 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26443 | 26483 | 26479 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26484 | 26648 | 26512 | 165 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 26649 | 26682 | 26676 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26683 | 26701 | 26699 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26702 | 26753 | 26751 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26754 | 26771 | 26769 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 26772 | 26803 | 26810 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26804 | 26812 | 26804 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26813 | 26823 | 26866 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26824 | 26859 | 26824 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26860 | 26868 | 26860 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26869 | 26899 | 26915 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26900 | 26917 | 26900 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26918 | 26943 | 26941 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26944 | 26958 | 26956 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26959 | 27022 | 27020 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27023 | 27104 | 27102 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27105 | 27132 | 27797 | 28 | 693 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27133 | 27146 | 27135 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27147 | 27159 | 27151 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27160 | 27800 | 27162 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27801 | 27819 | 27817 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27820 | 27820 | 27844 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27821 | 27836 | 27825 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 27837 | 27846 | 27837 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27847 | 27854 | 27853 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27855 | 27860 | 27859 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27861 | 27866 | 27865 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 27867 | 27871 | 27870 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27872 | 27880 | 27878 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27881 | 27886 | 27885 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27887 | 27894 | 27893 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27895 | 27925 | 27923 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 27926 | 27942 | 27940 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27943 | 27994 | 27992 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27995 | 28034 | 28032 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 28035 | 28041 | 28039 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28042 | 28085 | 28073 | 44 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 28086 | 28114 | 28112 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28115 | 28116 | 28246 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28117 | 28117 | 28117 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 28118 | 28121 | 28121 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 28122 | 28254 | 28125 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 28255 | 28325 | 28323 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28326 | 28358 | 28356 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28359 | 28365 | 28363 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28366 | 28398 | 28413 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28399 | 28415 | 28399 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28416 | 28420 | 28708 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28421 | 28455 | 28421 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28456 | 28536 | 28458 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28537 | 28678 | 28588 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28679 | 28710 | 28679 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28711 | 28735 | 28733 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 28736 | 28835 | 28736 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 28836 | 28893 | 28836 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28894 | 28907 | 28994 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 28908 | 28996 | 28910 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28997 | 29041 | 29040 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 29042 | 29051 | 29049 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29052 | 29083 | 29074 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 29084 | 29164 | 29084 | 81 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29165 | 29198 | 29270 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 29199 | 29272 | 29204 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 29273 | 29278 | 29276 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 29279 | 29307 | 29306 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 29308 | 29320 | 29319 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29321 | 29329 | 29328 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29330 | 29337 | 29336 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29338 | 29344 | 29343 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29345 | 29371 | 29385 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29372 | 29386 | 29372 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29387 | 29445 | 29439 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 29446 | 29485 | 29446 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 29486 | 29535 | 29486 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29536 | 29553 | 29551 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 29554 | 29610 | 29609 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 29611 | 29623 | 29632 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 29624 | 29633 | 29624 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29634 | 29641 | 29640 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29642 | 29653 | 29656 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29654 | 29657 | 29654 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29658 | 29672 | 29671 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 29673 | 29687 | 29684 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 29688 | 29703 | 29702 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29704 | 29800 | 29799 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 29801 | 29864 | 29814 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 29865 | 29873 | 29868 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 29874 | 29893 | 29891 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 29894 | 29897 | 29896 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 29898 | 29924 | 29913 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 29925 | 29941 | 29937 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 29942 | 30055 | 30054 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30056 | 30595 | 30594 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30596 | 31044 | 31158 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31045 | 31159 | 31045 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31160 | 31247 | 31384 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31248 | 31385 | 31266 | 138 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 31386 | 31583 | 31388 | 198 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31584 | 31650 | 31721 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31651 | 31698 | 31651 | 48 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31699 | 32357 | 31714 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32358 | 32410 | 32489 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32411 | 32449 | 32413 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32450 | 32499 | 32450 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32500 | 32508 | 32650 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32509 | 32531 | 32513 | 23 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 32532 | 32654 | 32532 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32655 | 32746 | 32775 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32747 | 32755 | 32747 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32756 | 32777 | 32756 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32778 | 32785 | 32784 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32786 | 32793 | 32791 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32794 | 32813 | 32811 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32814 | 32833 | 32832 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 32834 | 32841 | 32840 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32842 | 32849 | 32848 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32850 | 32853 | 32852 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32854 | 32857 | 32856 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32858 | 32876 | 32875 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32877 | 32899 | 32895 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 32900 | 32968 | 32962 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 32969 | 32981 | 32980 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 32982 | 32991 | 32990 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32992 | 33009 | 33008 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33010 | 33030 | 33029 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 33031 | 33037 | 33055 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 33038 | 33056 | 33038 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33057 | 33066 | 33065 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 33067 | 33082 | 33107 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 33083 | 33108 | 33083 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33109 | 33135 | 33130 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 33136 | 33143 | 33142 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33144 | 33150 | 33149 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33151 | 33164 | 33163 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33165 | 33168 | 33167 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33169 | 33188 | 33187 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33189 | 33208 | 33207 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 33209 | 33213 | 33212 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33214 | 33224 | 33223 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33225 | 33254 | 33253 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33255 | 33327 | 33446 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33328 | 33332 | 33328 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33333 | 33338 | 33333 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33339 | 33347 | 33339 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33348 | 33356 | 33348 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33357 | 33362 | 33357 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33363 | 33447 | 33363 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33448 | 33460 | 33598 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33461 | 33599 | 33461 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33600 | 33620 | 33618 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33621 | 33654 | 33653 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 33655 | 33668 | 33666 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33669 | 33740 | 33738 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33741 | 33783 | 33781 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33784 | 33852 | 34008 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33853 | 34012 | 33871 | 160 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 34013 | 34048 | 34047 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34049 | 34059 | 34058 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34060 | 34064 | 34063 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34065 | 34070 | 34068 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34071 | 34113 | 34111 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34114 | 34156 | 34154 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34157 | 34201 | 34199 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34202 | 34254 | 34252 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34255 | 34259 | 34278 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34260 | 34270 | 34260 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34271 | 34295 | 34271 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34296 | 34309 | 34472 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34310 | 34402 | 34317 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 34403 | 34403 | 34403 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34404 | 34474 | 34406 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34475 | 34505 | 34828 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34506 | 34548 | 34513 | 43 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 34549 | 34554 | 34552 | 6 | 4 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34555 | 34569 | 34567 | 15 | 13 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34570 | 34589 | 34587 | 20 | 18 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34590 | 34599 | 34597 | 10 | 8 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 34600 | 34608 | 34606 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 34609 | 34635 | 34633 | 27 | 25 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 34636 | 34688 | 34686 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34689 | 34829 | 34701 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 34830 | 34868 | 34867 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34869 | 34993 | 34991 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34994 | 35045 | 35364 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 35046 | 35117 | 35046 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35118 | 35122 | 35118 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35123 | 35235 | 35130 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35236 | 35289 | 35242 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35290 | 35340 | 35290 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35341 | 35344 | 35341 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35345 | 35365 | 35351 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35366 | 35386 | 35385 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 35387 | 35400 | 35398 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 35401 | 35426 | 35417 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 35427 | 35438 | 35437 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35439 | 35445 | 35444 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35446 | 35456 | 35455 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35457 | 35477 | 35476 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 35478 | 35487 | 35486 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 35488 | 35492 | 35491 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 35493 | 35499 | 35545 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 35500 | 35500 | 35500 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35501 | 35546 | 35501 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35547 | 35551 | 35550 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 35552 | 35573 | 35582 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35574 | 35583 | 35574 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35584 | 35613 | 35603 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35614 | 35634 | 35632 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 35635 | 35655 | 35653 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 35656 | 35660 | 35658 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35661 | 35722 | 35693 | 62 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35723 | 35732 | 35741 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 35733 | 35747 | 35733 | 15 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 35748 | 35757 | 35766 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35758 | 35768 | 35758 | 11 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 35769 | 35784 | 35776 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35785 | 35787 | 35805 | 3 | 21 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 35788 | 35798 | 35795 | 11 | 8 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35799 | 35810 | 35802 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35811 | 35868 | 35903 | 58 | 93 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 35869 | 35910 | 35872 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 35911 | 35922 | 36032 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35923 | 36034 | 35932 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36035 | 36057 | 36056 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 36058 | 36089 | 36087 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36090 | 36128 | 36124 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36129 | 36166 | 36151 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 36167 | 36176 | 36174 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 36177 | 36185 | 36184 | 9 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36186 | 36189 | 36188 | 4 | 3 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36190 | 36201 | 36200 | 12 | 11 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 36202 | 36238 | 36236 | 37 | 35 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 36239 | 36262 | 36261 | 24 | 23 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36263 | 36270 | 36269 | 8 | 7 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36271 | 36306 | 36305 | 36 | 35 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36307 | 36326 | 36325 | 20 | 19 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36327 | 36335 | 36334 | 9 | 8 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36336 | 36354 | 36358 | 19 | 23 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36355 | 36355 | 36355 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 36356 | 36370 | 36356 | 15 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 36371 | 36449 | 36443 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 36450 | 36455 | 36454 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36456 | 36466 | 36715 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 36467 | 36467 | 36467 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36468 | 36663 | 36468 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36664 | 36683 | 36707 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36684 | 36721 | 36696 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36722 | 36741 | 36750 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36742 | 36751 | 36742 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36752 | 36898 | 36896 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36899 | 36954 | 36953 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36955 | 37032 | 37074 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 37033 | 37075 | 37036 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37076 | 37088 | 37141 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37089 | 37142 | 37126 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37143 | 37184 | 37157 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37185 | 37234 | 37232 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 37235 | 37247 | 37245 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37248 | 37261 | 37259 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37262 | 37281 | 37279 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37282 | 37315 | 37313 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37316 | 37333 | 37324 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37334 | 37352 | 37351 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37353 | 37399 | 37360 | 47 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37400 | 37415 | 37409 | 16 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37416 | 37439 | 37431 | 24 | 16 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37440 | 37470 | 37460 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37471 | 37531 | 37496 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 37532 | 37596 | 37592 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37597 | 37645 | 37628 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37646 | 37675 | 37667 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37676 | 37734 | 37713 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37735 | 37737 | 37781 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37738 | 37748 | 37747 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37749 | 37786 | 37762 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37787 | 37798 | 37792 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37799 | 37881 | 37874 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37882 | 37937 | 37928 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37938 | 37973 | 37967 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37974 | 37995 | 37993 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37996 | 38060 | 38005 | 65 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 38061 | 38132 | 38131 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 38133 | 38137 | 38135 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38138 | 38166 | 38164 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38167 | 38199 | 38225 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38200 | 38211 | 38202 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38212 | 38227 | 38218 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38228 | 38305 | 38303 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38306 | 38317 | 38374 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38318 | 38340 | 38320 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38341 | 38348 | 38341 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38349 | 38376 | 38349 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38377 | 38390 | 38388 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38391 | 38423 | 38415 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38424 | 38483 | 38481 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38484 | 38507 | 38505 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38508 | 38589 | 38584 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38590 | 38648 | 38629 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 38649 | 38682 | 38649 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 38683 | 38706 | 38683 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38707 | 38724 | 38710 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38725 | 38752 | 38725 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38753 | 38754 | 38753 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38755 | 38755 | 38755 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38756 | 38770 | 38756 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38771 | 38789 | 38774 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38790 | 38814 | 38810 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38815 | 38828 | 38824 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38829 | 38832 | 38847 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 38833 | 38833 | 38833 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38834 | 38858 | 38834 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38859 | 38904 | 38889 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38905 | 39079 | 39133 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39080 | 39135 | 39080 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39136 | 39139 | 39138 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39140 | 39146 | 39145 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39147 | 39175 | 39174 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39176 | 39176 | 39191 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39177 | 39182 | 39179 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39183 | 39183 | 39183 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39184 | 39186 | 39184 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39187 | 39200 | 39187 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39201 | 39222 | 39281 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39223 | 39235 | 39225 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39236 | 39282 | 39242 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39283 | 39287 | 39344 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39288 | 39310 | 39290 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39311 | 39311 | 39311 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39312 | 39315 | 39312 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39316 | 39345 | 39316 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39346 | 39355 | 39354 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 39356 | 39394 | 39393 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39395 | 39423 | 39416 | 29 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39424 | 39484 | 39482 | 61 | 59 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39485 | 39504 | 39536 | 20 | 52 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 39505 | 39538 | 39505 | 34 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39539 | 39620 | 39618 | 82 | 80 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39621 | 39667 | 39665 | 47 | 45 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39668 | 39749 | 39746 | 82 | 79 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39750 | 39757 | 39806 | 8 | 57 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39758 | 39808 | 39771 | 51 | 14 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 39809 | 39821 | 39848 | 13 | 40 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39822 | 39835 | 39834 | 14 | 13 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39836 | 39850 | 39838 | 15 | 3 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39851 | 39861 | 39859 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39862 | 39876 | 39874 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39877 | 39885 | 39894 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39886 | 39897 | 39886 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39898 | 39902 | 39900 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 39903 | 39919 | 39917 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39920 | 39930 | 39928 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39931 | 39943 | 39941 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39944 | 39959 | 39958 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39960 | 40023 | 39964 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
