# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-20 · source `app/index.html` (124956 lines)

Declarations in this part: **471**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 126 | 139 | 135 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140 | 149 | 145 | 10 | 6 | `esc` | window fn | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 150 | 19618 | 161 | 19469 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 19619 | 19645 | 19642 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19646 | 19675 | 19650 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19676 | 19684 | 19678 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 19685 | 19710 | 19722 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19711 | 19795 | 19711 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19796 | 19799 | 19799 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19800 | 19825 | 19803 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19826 | 19943 | 19831 | 118 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19944 | 19956 | 19950 | 13 | 7 | `fireJurisdictionChanged` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19957 | 19976 | 19972 | 20 | 16 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19977 | 19994 | 19988 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19995 | 20069 | 20059 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 20070 | 20103 | 20099 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 20104 | 20113 | 20108 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 20114 | 20121 | 20117 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 20122 | 20129 | 20125 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 20130 | 20158 | 20142 | 29 | 13 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 20159 | 20184 | 20164 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 20185 | 20186 | 20185 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20187 | 20207 | 20187 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20208 | 20242 | 20208 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20243 | 20276 | 20272 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 20277 | 20296 | 20292 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20297 | 20309 | 20305 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20310 | 20356 | 20352 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20357 | 20360 | 20357 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20361 | 20368 | 20361 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20369 | 20380 | 20373 | 12 | 5 | `apply` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 20381 | 20474 | 20577 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20475 | 20581 | 20479 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20582 | 20635 | 20633 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20636 | 20651 | 20649 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20652 | 20673 | 20668 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20674 | 20705 | 20700 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 20706 | 20731 | 20724 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 20732 | 20756 | 20749 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20757 | 20777 | 20763 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20778 | 20837 | 20827 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 20838 | 20855 | 20845 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 20856 | 20881 | 20874 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 20882 | 20905 | 20903 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20906 | 20996 | 20989 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 20997 | 21019 | 21014 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 21020 | 21065 | 21103 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21066 | 21066 | 21066 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21067 | 21108 | 21067 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21109 | 21275 | 21269 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 21276 | 21310 | 21441 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21311 | 21447 | 21311 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21448 | 21462 | 21461 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21463 | 21509 | 21570 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 21510 | 21571 | 21510 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21572 | 21648 | 21647 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21649 | 21825 | 21819 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 21826 | 21899 | 21898 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21900 | 21956 | 21949 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21957 | 22011 | 22004 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22012 | 22093 | 22088 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22094 | 22144 | 22138 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 22145 | 22165 | 22276 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 22166 | 22283 | 22166 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22284 | 22302 | 22294 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22303 | 22310 | 22309 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 22311 | 22381 | 22373 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 22382 | 22394 | 22392 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 22395 | 22444 | 22442 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22445 | 22496 | 22493 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22497 | 22518 | 22516 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22519 | 22568 | 22566 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 22569 | 22575 | 22574 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 22576 | 22581 | 22580 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22582 | 22587 | 22586 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22588 | 22597 | 22596 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 22598 | 22784 | 22604 | 187 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 22785 | 22886 | 22884 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 22887 | 22900 | 22898 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 22901 | 22911 | 22908 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 22912 | 22933 | 22925 | 22 | 14 | `apply` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 22934 | 22944 | 22942 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22945 | 22964 | 22956 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22965 | 23085 | 23083 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23086 | 23147 | 23126 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 23148 | 23173 | 23171 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23174 | 24039 | 23183 | 866 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 24040 | 24076 | 24070 | 37 | 31 | `crashCacheOpen` | async fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 24077 | 24092 | 24088 | 16 | 12 | `getCrashCacheKey` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 24093 | 24143 | 24138 | 51 | 46 | `crashCacheSave` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 24144 | 24234 | 24230 | 91 | 87 | `crashCacheLoad` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 24235 | 24262 | 24258 | 28 | 24 | `crashCacheDelete` | async fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 24263 | 24291 | 24287 | 29 | 25 | `crashCacheClearAll` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 24292 | 24322 | 24318 | 31 | 27 | `crashCacheGetStats` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 24323 | 24360 | 24356 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 24361 | 24413 | 24405 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 24414 | 24566 | 24562 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24567 | 24700 | 24693 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24701 | 24776 | 24772 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24777 | 24790 | 24786 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24791 | 24829 | 24825 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 24830 | 24840 | 24836 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 24841 | 24876 | 24868 | 36 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24877 | 24923 | 24919 | 47 | 43 | `warrantDbOpen` | async fn | — | refs:15 | Warrants | `app/modules/warrants/warrants.js` |
| 24924 | 24957 | 24953 | 34 | 30 | `warrantDbSave` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 24958 | 24985 | 24981 | 28 | 24 | `warrantDbSaveWithId` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 24986 | 25007 | 25003 | 22 | 18 | `warrantDbLoadLatest` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 25008 | 25029 | 25025 | 22 | 18 | `warrantDbLoadAll` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 25030 | 25046 | 25042 | 17 | 13 | `warrantDbLoadById` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 25047 | 25066 | 25062 | 20 | 16 | `warrantDbDelete` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 25067 | 25087 | 25083 | 21 | 17 | `warrantDbClear` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 25088 | 25110 | 25106 | 23 | 19 | `warrantDbClearAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25111 | 25156 | 25145 | 46 | 35 | `warrantDbClearByDate` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25157 | 25194 | 25188 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25195 | 25241 | 25236 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25242 | 25281 | 25273 | 40 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25282 | 25300 | 25296 | 19 | 15 | `warrantDbScheduleAutoSave` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 25301 | 25329 | 25325 | 29 | 25 | `warrantDbAutoSave` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25330 | 25358 | 25354 | 29 | 25 | `warrantDbCollectSignalData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 25359 | 25392 | 25388 | 34 | 30 | `warrantDbCollectStopSignData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 25393 | 25435 | 25431 | 43 | 39 | `warrantDbCollectRoundaboutData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25436 | 25457 | 25449 | 22 | 14 | `warrantDbCollectPedestrianData` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 25458 | 25479 | 25475 | 22 | 18 | `warrantDbUpdateStorageStats` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 25480 | 25484 | 25498 | 5 | 19 | `warrantDbUpdateStorageIndicatorUI` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25485 | 25485 | 25485 | 1 | 1 | `totalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25486 | 25502 | 25486 | 17 | 1 | `totalSize` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25503 | 25523 | 25515 | 21 | 13 | `warrantDbUpdateIndicator` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25524 | 25553 | 25549 | 30 | 26 | `warrantDbExportAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25554 | 25581 | 25577 | 28 | 24 | `warrantDbExportType` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 25582 | 25620 | 25616 | 39 | 35 | `warrantDbImport` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25621 | 25640 | 25632 | 20 | 12 | `warrantDbShowImportDialog` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25641 | 25741 | 25737 | 101 | 97 | `warrantDbTransferSignalToStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25742 | 25832 | 25828 | 91 | 87 | `warrantDbTransferSignalToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25833 | 25869 | 25864 | 37 | 32 | `warrantDbTransferStopSignToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25870 | 25965 | 25957 | 96 | 88 | `warrantDbTransferStopSignToSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25966 | 26043 | 26039 | 78 | 74 | `warrantDbRestoreSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26044 | 26118 | 26114 | 75 | 71 | `warrantDbRestoreStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26119 | 26204 | 26196 | 86 | 78 | `warrantDbRestoreRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26205 | 26228 | 26213 | 24 | 9 | `warrantDbInit` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26229 | 26238 | 26234 | 10 | 6 | `toggleWarrantDataMenu` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 26239 | 26254 | 26250 | 16 | 12 | `toggleClearActionsMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26255 | 26281 | 26261 | 27 | 7 | `closeClearActionsMenu` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 26282 | 26309 | 26305 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26310 | 26325 | 26321 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26326 | 26349 | 26345 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26350 | 26375 | 26371 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26376 | 26869 | 26394 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26870 | 27122 | 26874 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27123 | 27130 | 27129 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27131 | 27137 | 27136 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27138 | 27157 | 27156 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27158 | 27162 | 27161 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27163 | 27169 | 27168 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27170 | 27173 | 27172 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27174 | 27177 | 27176 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27178 | 27183 | 27182 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27184 | 27250 | 27186 | 67 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27251 | 27337 | 27261 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 27338 | 27338 | 27338 | 1 | 1 | `isYes` | const arrow | — | refs:261 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27339 | 27340 | 27339 | 2 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 27341 | 27342 | 27341 | 2 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27343 | 27343 | 27343 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27344 | 27344 | 27344 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27345 | 27350 | 27350 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27351 | 27351 | 27351 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 27352 | 27352 | 27352 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27353 | 27371 | 27353 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 27372 | 27422 | 27420 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 27423 | 27440 | 27438 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27441 | 27453 | 27451 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 27454 | 27467 | 27465 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 27468 | 27476 | 27474 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 27477 | 27485 | 27484 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27486 | 27495 | 27494 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27496 | 27505 | 27502 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27506 | 27514 | 27512 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27515 | 27545 | 27539 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 27546 | 27566 | 27564 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27567 | 27583 | 27581 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27584 | 27640 | 27638 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27641 | 27650 | 27648 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27651 | 27684 | 27676 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27685 | 27692 | 27690 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 27693 | 27707 | 27705 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27708 | 27726 | 27724 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 27727 | 27734 | 27732 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27735 | 27798 | 27796 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27799 | 27811 | 27809 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27812 | 27824 | 27823 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27825 | 27829 | 27828 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27830 | 27843 | 27842 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27844 | 27851 | 27850 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27852 | 27871 | 27858 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27872 | 27898 | 27874 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27899 | 27915 | 27914 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27916 | 27922 | 27916 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27923 | 27940 | 27938 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27941 | 27948 | 27946 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27949 | 27971 | 27969 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27972 | 27979 | 27977 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27980 | 27986 | 27984 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27987 | 28023 | 28021 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28024 | 28071 | 28069 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28072 | 28088 | 28086 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28089 | 28106 | 28104 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28107 | 28117 | 28115 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28118 | 28149 | 28147 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28150 | 28197 | 28195 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28198 | 28232 | 28226 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28233 | 28238 | 28236 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 28239 | 28248 | 28246 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 28249 | 28274 | 28272 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28275 | 28483 | 28447 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28484 | 28490 | 28486 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28491 | 28538 | 28532 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 28539 | 28573 | 28566 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28574 | 28588 | 29357 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 28589 | 28919 | 28591 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28920 | 29361 | 28937 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29362 | 29430 | 29426 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 29431 | 29461 | 29459 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29462 | 29493 | 29492 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 29494 | 29507 | 29506 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29508 | 29687 | 29685 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 29688 | 29691 | 29690 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 29692 | 29905 | 29904 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 29906 | 29928 | 29916 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 29929 | 29935 | 29935 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 29936 | 29957 | 29957 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 29958 | 29969 | 29969 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29970 | 29989 | 29988 | 20 | 19 | `updateProgress` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 29990 | 30034 | 30033 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 30035 | 30035 | 30076 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 30036 | 30036 | 30036 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30037 | 30038 | 30037 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30039 | 30054 | 30039 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30055 | 30078 | 30055 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30079 | 30091 | 30089 | 13 | 11 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30092 | 30120 | 30118 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30121 | 30134 | 30141 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30135 | 30143 | 30135 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30144 | 30152 | 30150 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30153 | 30170 | 30164 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30171 | 30228 | 30222 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30229 | 30333 | 30331 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30334 | 30340 | 30355 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 30341 | 30357 | 30349 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30358 | 30365 | 30363 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 30366 | 30367 | 30376 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30368 | 30371 | 30368 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30372 | 30377 | 30372 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30378 | 30409 | 30406 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 30410 | 30421 | 30420 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30422 | 30456 | 30455 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30457 | 30458 | 30457 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 30459 | 30461 | 30478 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30462 | 30470 | 30462 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30471 | 30472 | 30471 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30473 | 30479 | 30473 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30480 | 30485 | 30484 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30486 | 30494 | 30493 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30495 | 30498 | 30497 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30499 | 30501 | 30508 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30502 | 30518 | 30502 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30519 | 30525 | 30524 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30526 | 30562 | 30558 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30563 | 30578 | 30574 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30579 | 30596 | 30594 | 18 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30597 | 30657 | 30898 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 30658 | 30763 | 30666 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30764 | 30773 | 30768 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30774 | 30851 | 30774 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30852 | 30907 | 30856 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30908 | 30936 | 31046 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30937 | 31047 | 30958 | 111 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31048 | 31096 | 31095 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31097 | 31100 | 31150 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31101 | 31151 | 31110 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31152 | 31184 | 31179 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31185 | 31212 | 31211 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 31213 | 31213 | 31238 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31214 | 31215 | 31214 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31216 | 31239 | 31216 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31240 | 31280 | 31276 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31281 | 31445 | 31309 | 165 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 31446 | 31479 | 31473 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 31480 | 31498 | 31496 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 31499 | 31550 | 31548 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31551 | 31568 | 31566 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 31569 | 31600 | 31607 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31601 | 31609 | 31601 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31610 | 31620 | 31663 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31621 | 31656 | 31621 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31657 | 31665 | 31657 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31666 | 31696 | 31712 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31697 | 31714 | 31697 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31715 | 31740 | 31738 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31741 | 31755 | 31753 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 31756 | 31819 | 31817 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 31820 | 31901 | 31899 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31902 | 31929 | 32594 | 28 | 693 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 31930 | 31943 | 31932 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31944 | 31956 | 31948 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31957 | 32597 | 31959 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32598 | 32616 | 32614 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32617 | 32617 | 32641 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32618 | 32633 | 32622 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 32634 | 32643 | 32634 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32644 | 32651 | 32650 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32652 | 32657 | 32656 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32658 | 32663 | 32662 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 32664 | 32668 | 32667 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32669 | 32677 | 32675 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32678 | 32683 | 32682 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32684 | 32691 | 32690 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32692 | 32722 | 32720 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 32723 | 32739 | 32737 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32740 | 32791 | 32789 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32792 | 32831 | 32829 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32832 | 32838 | 32836 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32839 | 32882 | 32870 | 44 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 32883 | 32911 | 32909 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32912 | 32913 | 33043 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32914 | 32914 | 32914 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 32915 | 32918 | 32918 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 32919 | 33051 | 32922 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 33052 | 33122 | 33120 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33123 | 33155 | 33153 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33156 | 33162 | 33160 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33163 | 33195 | 33210 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33196 | 33212 | 33196 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33213 | 33217 | 33505 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33218 | 33252 | 33218 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33253 | 33333 | 33255 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33334 | 33475 | 33385 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33476 | 33507 | 33476 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33508 | 33532 | 33530 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 33533 | 33632 | 33533 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33633 | 33690 | 33633 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33691 | 33704 | 33791 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33705 | 33793 | 33707 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33794 | 33838 | 33837 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33839 | 33848 | 33846 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33849 | 33880 | 33871 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 33881 | 33961 | 33881 | 81 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33962 | 33995 | 34067 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 33996 | 34069 | 34001 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 34070 | 34075 | 34073 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34076 | 34104 | 34103 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 34105 | 34117 | 34116 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34118 | 34126 | 34125 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34127 | 34134 | 34133 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34135 | 34141 | 34140 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34142 | 34168 | 34182 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34169 | 34183 | 34169 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34184 | 34242 | 34236 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 34243 | 34282 | 34243 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 34283 | 34332 | 34283 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34333 | 34350 | 34348 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 34351 | 34407 | 34406 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34408 | 34420 | 34429 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 34421 | 34430 | 34421 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34431 | 34438 | 34437 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34439 | 34450 | 34453 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34451 | 34454 | 34451 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34455 | 34469 | 34468 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34470 | 34484 | 34481 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 34485 | 34500 | 34499 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34501 | 34597 | 34596 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 34598 | 34661 | 34611 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 34662 | 34670 | 34665 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 34671 | 34690 | 34688 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 34691 | 34694 | 34693 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 34695 | 34721 | 34710 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34722 | 34738 | 34734 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 34739 | 34852 | 34851 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34853 | 35392 | 35391 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35393 | 35841 | 35955 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35842 | 35956 | 35842 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35957 | 36044 | 36181 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 36045 | 36182 | 36063 | 138 | 19 | `drawKPI` | fn | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 36183 | 36380 | 36185 | 198 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 36381 | 36447 | 36518 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 36448 | 36495 | 36448 | 48 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 36496 | 37154 | 36511 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37155 | 37207 | 37286 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37208 | 37246 | 37210 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37247 | 37296 | 37247 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37297 | 37305 | 37447 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37306 | 37328 | 37310 | 23 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 37329 | 37451 | 37329 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37452 | 37543 | 37572 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37544 | 37552 | 37544 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37553 | 37574 | 37553 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37575 | 37582 | 37581 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37583 | 37590 | 37588 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37591 | 37610 | 37608 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37611 | 37630 | 37629 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 37631 | 37638 | 37637 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37639 | 37646 | 37645 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37647 | 37650 | 37649 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37651 | 37654 | 37653 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37655 | 37673 | 37672 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 37674 | 37696 | 37692 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 37697 | 37765 | 37759 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 37766 | 37778 | 37777 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 37779 | 37788 | 37787 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 37789 | 37806 | 37805 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 37807 | 37827 | 37826 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 37828 | 37834 | 37852 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 37835 | 37853 | 37835 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37854 | 37863 | 37862 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 37864 | 37879 | 37904 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 37880 | 37905 | 37880 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37906 | 37932 | 37927 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 37933 | 37940 | 37939 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37941 | 37947 | 37946 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37948 | 37961 | 37960 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37962 | 37965 | 37964 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37966 | 37985 | 37984 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 37986 | 38005 | 38004 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 38006 | 38010 | 38009 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38011 | 38021 | 38020 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38022 | 38051 | 38050 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38052 | 38124 | 38243 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38125 | 38129 | 38125 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38130 | 38135 | 38130 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38136 | 38144 | 38136 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38145 | 38153 | 38145 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38154 | 38159 | 38154 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38160 | 38244 | 38160 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38245 | 38257 | 38395 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38258 | 38396 | 38258 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38397 | 38417 | 38415 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38418 | 38451 | 38450 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38452 | 38465 | 38463 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38466 | 38537 | 38535 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38538 | 38580 | 38578 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38581 | 38649 | 38805 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38650 | 38809 | 38668 | 160 | 19 | `drawKPI` | fn | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 38810 | 38845 | 38844 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38846 | 38856 | 38855 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38857 | 38861 | 38860 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38862 | 38867 | 38865 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38868 | 38910 | 38908 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38911 | 38953 | 38951 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38954 | 38998 | 38996 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38999 | 39051 | 39049 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39052 | 39056 | 39075 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39057 | 39067 | 39057 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39068 | 39092 | 39068 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39093 | 39106 | 39269 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39107 | 39199 | 39114 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 39200 | 39200 | 39200 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39201 | 39271 | 39203 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39272 | 39302 | 39625 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 39303 | 39345 | 39310 | 43 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 39346 | 39351 | 39349 | 6 | 4 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39352 | 39366 | 39364 | 15 | 13 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39367 | 39386 | 39384 | 20 | 18 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39387 | 39396 | 39394 | 10 | 8 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 39397 | 39405 | 39403 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 39406 | 39432 | 39430 | 27 | 25 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 39433 | 39485 | 39483 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39486 | 39626 | 39498 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 39627 | 39665 | 39664 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39666 | 39790 | 39788 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39791 | 39842 | 40161 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39843 | 39914 | 39843 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39915 | 39919 | 39915 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39920 | 40032 | 39927 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
