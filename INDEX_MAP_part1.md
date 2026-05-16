# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-16 · source `app/index.html` (151729 lines)

Declarations in this part: **513**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 97 | 110 | 106 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111 | 120 | 116 | 10 | 6 | `esc` | window fn | — | refs:194 | Unassigned | `app/modules/app/unassigned.js` |
| 121 | 19135 | 132 | 19015 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 19136 | 19162 | 19159 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19163 | 19192 | 19167 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19193 | 19201 | 19195 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 19202 | 19227 | 19239 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 19228 | 19312 | 19228 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19313 | 19316 | 19316 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19317 | 19342 | 19320 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19343 | 19458 | 19348 | 116 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19459 | 19480 | 19476 | 22 | 18 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19481 | 19498 | 19492 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19499 | 19573 | 19563 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19574 | 19607 | 19603 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 19608 | 19617 | 19612 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 19618 | 19625 | 19621 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 19626 | 19633 | 19629 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 19634 | 19654 | 19638 | 21 | 5 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 19655 | 19680 | 19660 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 19681 | 19682 | 19681 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19683 | 19703 | 19683 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19704 | 19738 | 19704 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19739 | 19772 | 19768 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 19773 | 19792 | 19788 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19793 | 19805 | 19801 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19806 | 19852 | 19848 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19853 | 19856 | 19853 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19857 | 19864 | 19857 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 19865 | 19876 | 19869 | 12 | 5 | `apply` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 19877 | 19970 | 20073 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19971 | 20077 | 19975 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20078 | 20131 | 20129 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20132 | 20147 | 20145 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20148 | 20169 | 20164 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20170 | 20201 | 20196 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 20202 | 20227 | 20220 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 20228 | 20252 | 20245 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20253 | 20273 | 20259 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20274 | 20333 | 20323 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 20334 | 20351 | 20341 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 20352 | 20377 | 20370 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 20378 | 20401 | 20399 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20402 | 20492 | 20485 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 20493 | 20515 | 20510 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 20516 | 20561 | 20599 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20562 | 20562 | 20562 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20563 | 20604 | 20563 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20605 | 20771 | 20765 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 20772 | 20806 | 20937 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20807 | 20943 | 20807 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20944 | 20958 | 20957 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20959 | 21005 | 21066 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 21006 | 21067 | 21006 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21068 | 21144 | 21143 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21145 | 21321 | 21315 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 21322 | 21395 | 21394 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21396 | 21452 | 21445 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21453 | 21507 | 21500 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21508 | 21589 | 21584 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21590 | 21640 | 21634 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21641 | 21661 | 21772 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 21662 | 21779 | 21662 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21780 | 21798 | 21790 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21799 | 21806 | 21805 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21807 | 21877 | 21869 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 21878 | 21890 | 21888 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 21891 | 21940 | 21938 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21941 | 21992 | 21989 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21993 | 22014 | 22012 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22015 | 22064 | 22062 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 22065 | 22071 | 22070 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 22072 | 22077 | 22076 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22078 | 22083 | 22082 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22084 | 22093 | 22092 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 22094 | 22278 | 22100 | 185 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 22279 | 22380 | 22378 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 22381 | 22394 | 22392 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 22395 | 22405 | 22402 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 22406 | 22427 | 22419 | 22 | 14 | `apply` | fn | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 22428 | 22438 | 22436 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22439 | 22458 | 22450 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22459 | 22579 | 22577 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 22580 | 22641 | 22620 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 22642 | 22667 | 22665 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22668 | 23533 | 22677 | 866 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 23534 | 23570 | 23564 | 37 | 31 | `crashCacheOpen` | async fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 23571 | 23586 | 23582 | 16 | 12 | `getCrashCacheKey` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 23587 | 23637 | 23632 | 51 | 46 | `crashCacheSave` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 23638 | 23728 | 23724 | 91 | 87 | `crashCacheLoad` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 23729 | 23756 | 23752 | 28 | 24 | `crashCacheDelete` | async fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 23757 | 23785 | 23781 | 29 | 25 | `crashCacheClearAll` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 23786 | 23816 | 23812 | 31 | 27 | `crashCacheGetStats` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 23817 | 23854 | 23850 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 23855 | 23907 | 23899 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 23908 | 24060 | 24056 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24061 | 24194 | 24187 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24195 | 24270 | 24266 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24271 | 24284 | 24280 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24285 | 24323 | 24319 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 24324 | 24334 | 24330 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 24335 | 24370 | 24362 | 36 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24371 | 24417 | 24413 | 47 | 43 | `warrantDbOpen` | async fn | — | refs:15 | Warrants | `app/modules/warrants/warrants.js` |
| 24418 | 24451 | 24447 | 34 | 30 | `warrantDbSave` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 24452 | 24479 | 24475 | 28 | 24 | `warrantDbSaveWithId` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 24480 | 24501 | 24497 | 22 | 18 | `warrantDbLoadLatest` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 24502 | 24523 | 24519 | 22 | 18 | `warrantDbLoadAll` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 24524 | 24540 | 24536 | 17 | 13 | `warrantDbLoadById` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 24541 | 24560 | 24556 | 20 | 16 | `warrantDbDelete` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 24561 | 24581 | 24577 | 21 | 17 | `warrantDbClear` | async fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 24582 | 24604 | 24600 | 23 | 19 | `warrantDbClearAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 24605 | 24650 | 24639 | 46 | 35 | `warrantDbClearByDate` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 24651 | 24688 | 24682 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24689 | 24735 | 24730 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24736 | 24775 | 24767 | 40 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24776 | 24794 | 24790 | 19 | 15 | `warrantDbScheduleAutoSave` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 24795 | 24823 | 24819 | 29 | 25 | `warrantDbAutoSave` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 24824 | 24852 | 24848 | 29 | 25 | `warrantDbCollectSignalData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 24853 | 24886 | 24882 | 34 | 30 | `warrantDbCollectStopSignData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 24887 | 24929 | 24925 | 43 | 39 | `warrantDbCollectRoundaboutData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 24930 | 24951 | 24943 | 22 | 14 | `warrantDbCollectPedestrianData` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 24952 | 24973 | 24969 | 22 | 18 | `warrantDbUpdateStorageStats` | async fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 24974 | 24978 | 24992 | 5 | 19 | `warrantDbUpdateStorageIndicatorUI` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 24979 | 24979 | 24979 | 1 | 1 | `totalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24980 | 24996 | 24980 | 17 | 1 | `totalSize` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24997 | 25017 | 25009 | 21 | 13 | `warrantDbUpdateIndicator` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25018 | 25047 | 25043 | 30 | 26 | `warrantDbExportAll` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25048 | 25075 | 25071 | 28 | 24 | `warrantDbExportType` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 25076 | 25114 | 25110 | 39 | 35 | `warrantDbImport` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25115 | 25134 | 25126 | 20 | 12 | `warrantDbShowImportDialog` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25135 | 25235 | 25231 | 101 | 97 | `warrantDbTransferSignalToStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25236 | 25326 | 25322 | 91 | 87 | `warrantDbTransferSignalToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25327 | 25363 | 25358 | 37 | 32 | `warrantDbTransferStopSignToRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25364 | 25459 | 25451 | 96 | 88 | `warrantDbTransferStopSignToSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25460 | 25537 | 25533 | 78 | 74 | `warrantDbRestoreSignal` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25538 | 25612 | 25608 | 75 | 71 | `warrantDbRestoreStopSign` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25613 | 25698 | 25690 | 86 | 78 | `warrantDbRestoreRoundabout` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25699 | 25722 | 25707 | 24 | 9 | `warrantDbInit` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25723 | 25732 | 25728 | 10 | 6 | `toggleWarrantDataMenu` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 25733 | 25748 | 25744 | 16 | 12 | `toggleClearActionsMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25749 | 25775 | 25755 | 27 | 7 | `closeClearActionsMenu` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 25776 | 25803 | 25799 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25804 | 25819 | 25815 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 25820 | 25843 | 25839 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25844 | 25869 | 25865 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25870 | 26363 | 25888 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 26364 | 26616 | 26368 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26617 | 26624 | 26623 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26625 | 26631 | 26630 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26632 | 26651 | 26650 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26652 | 26656 | 26655 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26657 | 26663 | 26662 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26664 | 26667 | 26666 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26668 | 26671 | 26670 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26672 | 26677 | 26676 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26678 | 26686 | 26680 | 9 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26687 | 26708 | 26707 | 22 | 21 | `toggleAIMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26709 | 26715 | 26714 | 7 | 6 | `handleAIToggleKeydown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26716 | 26746 | 26739 | 31 | 24 | `initAIModeToggle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26747 | 26782 | 26781 | 36 | 35 | `saveHeaderApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26783 | 26795 | 26794 | 13 | 12 | `clearHeaderApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26796 | 26819 | 26818 | 24 | 23 | `updateHeaderKeyStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26820 | 26846 | 26845 | 27 | 26 | `updateAllAIStatusIndicators` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26847 | 26880 | 26879 | 34 | 33 | `updateHeaderProviderLink` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26881 | 26976 | 26916 | 96 | 36 | `initHeaderApiKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26977 | 27063 | 26987 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 27064 | 27064 | 27064 | 1 | 1 | `isYes` | const arrow | — | refs:356 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27065 | 27066 | 27065 | 2 | 1 | `esc` | const arrow | — | refs:194 | Unassigned | `app/modules/app/unassigned.js` |
| 27067 | 27067 | 27067 | 1 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27068 | 27068 | 27068 | 1 | 1 | `calcEPDO` | const arrow | — | refs:175 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27069 | 27069 | 27069 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27070 | 27070 | 27070 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27071 | 27076 | 27076 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27077 | 27077 | 27077 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 27078 | 27078 | 27078 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27079 | 27097 | 27079 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 27098 | 27148 | 27146 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 27149 | 27166 | 27164 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27167 | 27179 | 27177 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 27180 | 27193 | 27191 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 27194 | 27202 | 27200 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 27203 | 27211 | 27210 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27212 | 27221 | 27220 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27222 | 27231 | 27228 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27232 | 27240 | 27238 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27241 | 27271 | 27265 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 27272 | 27292 | 27290 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27293 | 27309 | 27307 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27310 | 27366 | 27364 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27367 | 27376 | 27374 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27377 | 27410 | 27402 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27411 | 27418 | 27416 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 27419 | 27433 | 27431 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27434 | 27452 | 27450 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 27453 | 27460 | 27458 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27461 | 27524 | 27522 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27525 | 27537 | 27535 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27538 | 27550 | 27549 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27551 | 27555 | 27554 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27556 | 27569 | 27568 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27570 | 27577 | 27576 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27578 | 27597 | 27584 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27598 | 27624 | 27600 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27625 | 27641 | 27640 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27642 | 27648 | 27642 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 27649 | 27666 | 27664 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27667 | 27674 | 27672 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 27675 | 27697 | 27695 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27698 | 27705 | 27703 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27706 | 27712 | 27710 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27713 | 27749 | 27747 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 27750 | 27797 | 27795 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 27798 | 27814 | 27812 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27815 | 27832 | 27830 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27833 | 27843 | 27841 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 27844 | 27875 | 27873 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27876 | 27923 | 27921 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27924 | 27958 | 27952 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27959 | 27964 | 27962 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27965 | 27974 | 27972 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27975 | 28000 | 27998 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28001 | 28209 | 28173 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28210 | 28216 | 28212 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28217 | 28264 | 28258 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 28265 | 28299 | 28292 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28300 | 28314 | 29083 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 28315 | 28645 | 28317 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28646 | 29087 | 28663 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29088 | 29156 | 29152 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 29157 | 29187 | 29185 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29188 | 29219 | 29218 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 29220 | 29233 | 29232 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29234 | 29413 | 29411 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 29414 | 29417 | 29416 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 29418 | 29631 | 29630 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 29632 | 29654 | 29642 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 29655 | 29661 | 29661 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 29662 | 29683 | 29683 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 29684 | 29695 | 29695 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 29696 | 29715 | 29714 | 20 | 19 | `updateProgress` | fn | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 29716 | 29760 | 29759 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 29761 | 29761 | 29802 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 29762 | 29762 | 29762 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29763 | 29764 | 29763 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29765 | 29780 | 29765 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29781 | 29804 | 29781 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29805 | 29813 | 29811 | 9 | 7 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29814 | 29842 | 29840 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 29843 | 29856 | 29863 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29857 | 29865 | 29857 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29866 | 29874 | 29872 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29875 | 29892 | 29886 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 29893 | 29950 | 29944 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 29951 | 30055 | 30053 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30056 | 30062 | 30077 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 30063 | 30079 | 30071 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30080 | 30087 | 30085 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 30088 | 30089 | 30098 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30090 | 30093 | 30090 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30094 | 30099 | 30094 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30100 | 30132 | 30125 | 33 | 26 | `initGrantModule` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30133 | 30146 | 30185 | 14 | 53 | `mergeGrantProgramsFromSupabase` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30147 | 30187 | 30147 | 41 | 1 | `have` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30188 | 30192 | 30191 | 5 | 4 | `initYearRangeFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30193 | 30200 | 30199 | 8 | 7 | `applyGrantDateFilter` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 30201 | 30209 | 30207 | 9 | 7 | `resetGrantDateFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30210 | 30210 | 30210 | 1 | 1 | `applyYearRangeFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30211 | 30212 | 30211 | 2 | 1 | `resetYearRange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30213 | 30224 | 30223 | 12 | 11 | `showGrantTab` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30225 | 30230 | 30229 | 6 | 5 | `searchGrantsGovKeyword` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 30231 | 30234 | 30233 | 4 | 3 | `openGrantsGovNewTab` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 30235 | 30266 | 30263 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 30267 | 30278 | 30277 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30279 | 30313 | 30312 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30314 | 30315 | 30314 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 30316 | 30318 | 30335 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30319 | 30327 | 30319 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30328 | 30329 | 30328 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30330 | 30336 | 30330 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30337 | 30342 | 30341 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30343 | 30351 | 30350 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30352 | 30355 | 30354 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 30356 | 30358 | 30365 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30359 | 30375 | 30359 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30376 | 30382 | 30381 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30383 | 30419 | 30415 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30420 | 30435 | 30431 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30436 | 30470 | 30451 | 35 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 30471 | 30553 | 30551 | 83 | 81 | `analyzeCrashPatterns` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 30554 | 30562 | 30576 | 9 | 23 | `calculateSeverityTrend` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 30563 | 30563 | 30563 | 1 | 1 | `olderAvg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30564 | 30578 | 30564 | 15 | 1 | `recentAvg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30579 | 30635 | 30633 | 57 | 55 | `calculateEnhancedGrantScore_legacy` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 30636 | 30701 | 30699 | 66 | 64 | `getMatchingGrantsEnhanced_legacy` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30702 | 30732 | 30730 | 31 | 29 | `getBestMatchProgramEnhanced_legacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 30733 | 30747 | 30745 | 15 | 13 | `getBestMatchProgram` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 30748 | 30835 | 30760 | 88 | 13 | `getMatchingGrants` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 30836 | 30843 | 30838 | 8 | 3 | `calculateCountyBaselines` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 30844 | 30850 | 30846 | 7 | 3 | `calculateORI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 30851 | 30858 | 30853 | 8 | 3 | `normalCDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 30859 | 30866 | 30861 | 8 | 3 | `testPatternSignificance` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 30867 | 30873 | 30869 | 7 | 3 | `calculatePSI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 30874 | 30879 | 30945 | 6 | 72 | `calculateFeasibilityAndBC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 30880 | 30946 | 30915 | 67 | 36 | `checkAndAdd` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 30947 | 30950 | 30959 | 4 | 13 | `calculateFeasibilitySubScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30951 | 30955 | 30951 | 5 | 1 | `bestBC` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30956 | 30962 | 30956 | 7 | 1 | `significantCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30963 | 30971 | 30970 | 9 | 8 | `calculateGrantFitScores` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 30972 | 30992 | 31011 | 21 | 40 | `calculateHSIPFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 30993 | 31004 | 30995 | 12 | 3 | `alignedAreas` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31005 | 31012 | 31005 | 8 | 1 | `significantPatterns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31013 | 31048 | 31047 | 36 | 35 | `calculateSS4AFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31049 | 31079 | 31078 | 31 | 30 | `calculate402Fit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31080 | 31115 | 31110 | 36 | 31 | `calculate405dFit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31116 | 31132 | 31128 | 17 | 13 | `calculateImprovedGrantScore` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 31133 | 31156 | 31196 | 24 | 64 | `getImprovedGrantMatches` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31157 | 31160 | 31159 | 4 | 3 | `infraPatterns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31161 | 31200 | 31163 | 40 | 3 | `reasons` | const arrow | — | refs:146 | Unassigned | `app/modules/app/unassigned.js` |
| 31201 | 31218 | 31216 | 18 | 16 | `getImprovedBestMatch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31219 | 31231 | 31229 | 13 | 11 | `getGrantRankingCacheKey` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 31232 | 31243 | 31241 | 12 | 10 | `showGrantRankingProgress` | fn | — | refs:15 | Grants | `app/modules/grants/grants.js` |
| 31244 | 31248 | 31246 | 5 | 3 | `yieldToUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 31249 | 31309 | 31550 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 31310 | 31415 | 31318 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31416 | 31425 | 31420 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31426 | 31503 | 31426 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31504 | 31559 | 31508 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31560 | 31588 | 31698 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31589 | 31700 | 31610 | 112 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31701 | 31710 | 31708 | 10 | 8 | `applyLocationLimit` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 31711 | 31721 | 31719 | 11 | 9 | `changeLocationLimit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31722 | 31727 | 31726 | 6 | 5 | `changeGrantAggregation` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31728 | 31743 | 31742 | 16 | 15 | `changeGrantScoringProfile` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31744 | 31747 | 31746 | 4 | 3 | `hideScoringProfileBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31748 | 31753 | 31752 | 6 | 5 | `changeGrantMinCrashes` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31754 | 31802 | 31801 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31803 | 31806 | 31856 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31807 | 31857 | 31816 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31858 | 31890 | 31885 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31891 | 31918 | 31917 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 31919 | 31919 | 31944 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31920 | 31921 | 31920 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31922 | 31945 | 31922 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31946 | 31986 | 31982 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 31987 | 32130 | 32015 | 144 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 32131 | 32164 | 32158 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32165 | 32183 | 32181 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 32184 | 32235 | 32233 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32236 | 32253 | 32251 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 32254 | 32285 | 32292 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32286 | 32294 | 32286 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32295 | 32305 | 32348 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32306 | 32341 | 32306 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32342 | 32350 | 32342 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32351 | 32381 | 32397 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32382 | 32399 | 32382 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32400 | 32425 | 32423 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32426 | 32440 | 32438 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32441 | 32504 | 32502 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 32505 | 32586 | 32584 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32587 | 32619 | 33284 | 33 | 698 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32620 | 32633 | 32622 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32634 | 32646 | 32638 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32647 | 33287 | 32649 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33288 | 33306 | 33304 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33307 | 33307 | 33331 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33308 | 33323 | 33312 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 33324 | 33333 | 33324 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33334 | 33341 | 33340 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33342 | 33347 | 33346 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 33348 | 33353 | 33352 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 33354 | 33358 | 33357 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 33359 | 33367 | 33365 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33368 | 33373 | 33372 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33374 | 33381 | 33380 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33382 | 33412 | 33410 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 33413 | 33429 | 33427 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33430 | 33481 | 33479 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33482 | 33521 | 33519 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 33522 | 33528 | 33526 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33529 | 33569 | 33560 | 41 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 33570 | 33574 | 33572 | 5 | 3 | `initEmailChipState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33575 | 33580 | 33578 | 6 | 4 | `isValidEmail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33581 | 33592 | 33590 | 12 | 10 | `addEmailFromInput` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33593 | 33618 | 33616 | 26 | 24 | `addEmailChip` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33619 | 33619 | 33632 | 1 | 14 | `removeEmailChip` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33620 | 33634 | 33620 | 15 | 1 | `index` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33635 | 33642 | 33640 | 8 | 6 | `setEmailPrimary` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 33643 | 33652 | 33650 | 10 | 8 | `clearAllEmails` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33653 | 33675 | 33673 | 23 | 21 | `handleEmailInputKeydown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33676 | 33680 | 33703 | 5 | 28 | `handleEmailPaste` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33681 | 33705 | 33681 | 25 | 1 | `emails` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33706 | 33710 | 33708 | 5 | 3 | `showEmailError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 33711 | 33715 | 33713 | 5 | 3 | `showEmailSuccess` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33716 | 33735 | 33733 | 20 | 18 | `showEmailToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33736 | 33791 | 33789 | 56 | 54 | `refreshEmailChips` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 33792 | 33820 | 33818 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33821 | 33822 | 33952 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33823 | 33823 | 33823 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 33824 | 33827 | 33827 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 33828 | 33960 | 33831 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 33961 | 34031 | 34029 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34032 | 34064 | 34062 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34065 | 34071 | 34069 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34072 | 34104 | 34119 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34105 | 34121 | 34105 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34122 | 34126 | 34414 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34127 | 34161 | 34127 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34162 | 34242 | 34164 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34243 | 34384 | 34294 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34385 | 34416 | 34385 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34417 | 34441 | 34439 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 34442 | 34541 | 34442 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34542 | 34599 | 34542 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34600 | 34613 | 34700 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34614 | 34702 | 34616 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34703 | 34747 | 34746 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34748 | 34757 | 34755 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34758 | 34789 | 34780 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 34790 | 34867 | 34790 | 78 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34868 | 34910 | 34908 | 43 | 41 | `buildEmailSubjectLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34911 | 34946 | 34964 | 36 | 54 | `buildEmailStatsSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34947 | 34966 | 34947 | 20 | 1 | `maxCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34967 | 34978 | 35010 | 12 | 44 | `buildEmailFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34979 | 35012 | 34979 | 34 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35013 | 35037 | 35033 | 25 | 21 | `getDefaultReportTitle` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35038 | 35071 | 35143 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 35072 | 35145 | 35077 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 35146 | 35151 | 35149 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 35152 | 35180 | 35179 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 35181 | 35193 | 35192 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35194 | 35202 | 35201 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35203 | 35210 | 35209 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35211 | 35217 | 35216 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35218 | 35244 | 35258 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35245 | 35259 | 35245 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35260 | 35318 | 35312 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 35319 | 35358 | 35319 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 35359 | 35408 | 35359 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35409 | 35426 | 35424 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 35427 | 35483 | 35482 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 35484 | 35496 | 35505 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35497 | 35506 | 35497 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35507 | 35514 | 35513 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35515 | 35526 | 35529 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35527 | 35530 | 35527 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35531 | 35545 | 35544 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 35546 | 35560 | 35557 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 35561 | 35576 | 35575 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35577 | 35673 | 35672 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 35674 | 35737 | 35687 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35738 | 35746 | 35741 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 35747 | 35766 | 35764 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 35767 | 35770 | 35769 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 35771 | 35797 | 35786 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 35798 | 35814 | 35810 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 35815 | 35928 | 35927 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35929 | 36468 | 36467 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36469 | 36917 | 37031 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36918 | 37032 | 36918 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37033 | 37120 | 37257 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37121 | 37258 | 37139 | 138 | 19 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 37259 | 37262 | 37261 | 4 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37263 | 37271 | 37270 | 9 | 8 | `runFullAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 37272 | 37275 | 37274 | 4 | 3 | `scrollToGrantSearch` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 37276 | 37290 | 37278 | 15 | 3 | `scrollToWritingAssistant` | fn | — | refs:2 | AI Mode | `app/modules/ai/ai.js` |
| 37291 | 37307 | 37340 | 17 | 50 | `populateGrantProgramDropdown` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 37308 | 37309 | 37308 | 2 | 1 | `escapeHtml` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37310 | 37320 | 37320 | 11 | 11 | `buildOpt` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37321 | 37321 | 37321 | 1 | 1 | `federal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37322 | 37347 | 37322 | 26 | 1 | `stateP` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37348 | 37357 | 37387 | 10 | 40 | `buildGrantWritingContext` | async fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 37358 | 37360 | 37358 | 3 | 1 | `picked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37361 | 37372 | 37366 | 12 | 6 | `details` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37373 | 37388 | 37373 | 16 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37389 | 37444 | 37443 | 56 | 55 | `openNewAppModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37445 | 37449 | 37447 | 5 | 3 | `closeNewAppModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37450 | 37454 | 37453 | 5 | 4 | `showHelpModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37455 | 37460 | 37458 | 6 | 4 | `closeHelpModal` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 37461 | 37479 | 37477 | 19 | 17 | `switchHelpTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37480 | 37485 | 37483 | 6 | 4 | `toggleConceptCard` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37486 | 37516 | 37514 | 31 | 29 | `helpNavigateTo` | fn | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 37517 | 37851 | 37833 | 335 | 317 | `showHowTo` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 37852 | 37890 | 37889 | 39 | 38 | `saveNewApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37891 | 37894 | 37893 | 4 | 3 | `saveApplications` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37895 | 37921 | 37920 | 27 | 26 | `loadApplications` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37922 | 37958 | 37957 | 37 | 36 | `displayApplications` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37959 | 37964 | 37963 | 6 | 5 | `updateAppStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37965 | 37972 | 37971 | 8 | 7 | `deleteApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37973 | 38056 | 38055 | 84 | 83 | `exportSingleApplication` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38057 | 38170 | 38164 | 114 | 108 | `exportAllApplications` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38171 | 38225 | 38222 | 55 | 52 | `getGrantAISystemPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 38226 | 38279 | 38277 | 54 | 52 | `getGrantSearchSystemPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 38280 | 38408 | 38377 | 129 | 98 | `getFullApplicationSystemPrompt` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38409 | 38727 | 38454 | 319 | 46 | `buildGrantProgramRequirements` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38728 | 38773 | 38797 | 46 | 70 | `callGrantAgentWithRetry` | async fn | — | refs:4 | Grants | `app/modules/grants/grants.js` |
| 38774 | 38801 | 38774 | 28 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38802 | 38810 | 38874 | 9 | 73 | `runGrant4AgentAnalysis` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 38811 | 38878 | 38813 | 68 | 3 | `updateProgress` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 38879 | 38920 | 38916 | 42 | 38 | `buildGrantAgent1Input` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38921 | 38970 | 38966 | 50 | 46 | `updateGrantProgramUI` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 38971 | 39082 | 39078 | 112 | 108 | `download4AgentApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39083 | 39183 | 39179 | 101 | 97 | `download4AgentApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39184 | 39224 | 39223 | 41 | 40 | `showGrant4AgentLoadingModal` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 39225 | 39229 | 39228 | 5 | 4 | `hideGrant4AgentLoadingModal` | fn | — | refs:4 | Grants | `app/modules/grants/grants.js` |
| 39230 | 39256 | 39252 | 27 | 23 | `updateGrant4AgentProgress` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 39257 | 39265 | 39371 | 9 | 115 | `generateGrant4AgentPDF` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39266 | 39266 | 39266 | 1 | 1 | `addPage` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 39267 | 39375 | 39267 | 109 | 1 | `checkPageBreak` | const arrow | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 39376 | 39641 | 39447 | 266 | 72 | `generateGrant4AgentWord` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39642 | 39708 | 39779 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39709 | 39756 | 39709 | 48 | 1 | `matches` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 39757 | 40415 | 39772 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
