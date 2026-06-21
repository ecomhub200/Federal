# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-20 · source `app/index.html` (86010 lines)

Declarations in this part: **646**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 126 | 139 | 135 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140 | 149 | 145 | 10 | 6 | `esc` | window fn | — | refs:100 | Unassigned | `app/modules/app/unassigned.js` |
| 150 | 14822 | 161 | 14673 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 14823 | 14849 | 14846 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14850 | 14879 | 14854 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14880 | 14888 | 14882 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 14889 | 14914 | 14926 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14915 | 14999 | 14915 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15000 | 15003 | 15003 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15004 | 15029 | 15007 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15030 | 15147 | 15035 | 118 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15148 | 15160 | 15154 | 13 | 7 | `fireJurisdictionChanged` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15161 | 15180 | 15176 | 20 | 16 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15181 | 15198 | 15192 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15199 | 15273 | 15263 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15274 | 15307 | 15303 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 15308 | 15317 | 15312 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 15318 | 15325 | 15321 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 15326 | 15333 | 15329 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15334 | 15362 | 15346 | 29 | 13 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 15363 | 15388 | 15368 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 15389 | 15390 | 15389 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15391 | 15411 | 15391 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15412 | 15446 | 15412 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15447 | 15480 | 15476 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 15481 | 15500 | 15496 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15501 | 15513 | 15509 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15514 | 15560 | 15556 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15561 | 15564 | 15561 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15565 | 15572 | 15565 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15573 | 15584 | 15577 | 12 | 5 | `apply` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 15585 | 15678 | 15781 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15679 | 15785 | 15683 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15786 | 15839 | 15837 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15840 | 15855 | 15853 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15856 | 15877 | 15872 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15878 | 15909 | 15904 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 15910 | 15935 | 15928 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15936 | 15960 | 15953 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 15961 | 15981 | 15967 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15982 | 16041 | 16031 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 16042 | 16059 | 16049 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 16060 | 16085 | 16078 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 16086 | 16109 | 16107 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16110 | 16200 | 16193 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16201 | 16223 | 16218 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 16224 | 16269 | 16307 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16270 | 16270 | 16270 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16271 | 16312 | 16271 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16313 | 16479 | 16473 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16480 | 16514 | 16645 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16515 | 16651 | 16515 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16652 | 16666 | 16665 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 16667 | 16713 | 16774 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 16714 | 16775 | 16714 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16776 | 16852 | 16851 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 16853 | 17029 | 17023 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17030 | 17103 | 17102 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17104 | 17160 | 17153 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17161 | 17215 | 17208 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17216 | 17297 | 17292 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 17298 | 17348 | 17342 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17349 | 17369 | 17480 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17370 | 17487 | 17370 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 17488 | 17506 | 17498 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17507 | 17514 | 17513 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 17515 | 17585 | 17577 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 17586 | 17598 | 17596 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 17599 | 17648 | 17646 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17649 | 17700 | 17697 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17701 | 17722 | 17720 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17723 | 17772 | 17770 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 17773 | 17779 | 17778 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 17780 | 17785 | 17784 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17786 | 17791 | 17790 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17792 | 17801 | 17800 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17802 | 17988 | 17808 | 187 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17989 | 18090 | 18088 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 18091 | 18104 | 18102 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 18105 | 18115 | 18112 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 18116 | 18137 | 18129 | 22 | 14 | `apply` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 18138 | 18148 | 18146 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18149 | 18168 | 18160 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18169 | 18289 | 18287 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 18290 | 18351 | 18330 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 18352 | 18377 | 18375 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18378 | 19243 | 18387 | 866 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 19244 | 19280 | 19274 | 37 | 31 | `crashCacheOpen` | async fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 19281 | 19296 | 19292 | 16 | 12 | `getCrashCacheKey` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 19297 | 19347 | 19342 | 51 | 46 | `crashCacheSave` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19348 | 19438 | 19434 | 91 | 87 | `crashCacheLoad` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19439 | 19466 | 19462 | 28 | 24 | `crashCacheDelete` | async fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 19467 | 19495 | 19491 | 29 | 25 | `crashCacheClearAll` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 19496 | 19526 | 19522 | 31 | 27 | `crashCacheGetStats` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19527 | 19564 | 19560 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19565 | 19617 | 19609 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19618 | 19770 | 19766 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19771 | 19904 | 19897 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19905 | 19980 | 19976 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19981 | 19994 | 19990 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19995 | 20033 | 20029 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 20034 | 20044 | 20040 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 20045 | 20083 | 20072 | 39 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20084 | 20121 | 20115 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20122 | 20168 | 20163 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20169 | 20220 | 20200 | 52 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20221 | 20248 | 20244 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20249 | 20264 | 20260 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20265 | 20288 | 20284 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20289 | 20314 | 20310 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20315 | 20808 | 20333 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20809 | 21061 | 20813 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21062 | 21069 | 21068 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21070 | 21076 | 21075 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21077 | 21096 | 21095 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21097 | 21101 | 21100 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21102 | 21108 | 21107 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21109 | 21112 | 21111 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21113 | 21116 | 21115 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21117 | 21122 | 21121 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21123 | 21189 | 21125 | 67 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21190 | 21276 | 21200 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21277 | 21277 | 21277 | 1 | 1 | `isYes` | const arrow | — | refs:261 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21278 | 21279 | 21278 | 2 | 1 | `esc` | const arrow | — | refs:100 | Unassigned | `app/modules/app/unassigned.js` |
| 21280 | 21281 | 21280 | 2 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21282 | 21282 | 21282 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21283 | 21283 | 21283 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21284 | 21289 | 21289 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21290 | 21290 | 21290 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 21291 | 21291 | 21291 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21292 | 21310 | 21292 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 21311 | 21361 | 21359 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 21362 | 21379 | 21377 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21380 | 21392 | 21390 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 21393 | 21406 | 21404 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 21407 | 21415 | 21413 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21416 | 21424 | 21423 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21425 | 21434 | 21433 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21435 | 21444 | 21441 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21445 | 21453 | 21451 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21454 | 21484 | 21478 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 21485 | 21505 | 21503 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21506 | 21522 | 21520 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21523 | 21579 | 21577 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21580 | 21589 | 21587 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21590 | 21623 | 21615 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21624 | 21631 | 21629 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21632 | 21646 | 21644 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21647 | 21665 | 21663 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 21666 | 21673 | 21671 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21674 | 21737 | 21735 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21738 | 21750 | 21748 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21751 | 21763 | 21762 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21764 | 21768 | 21767 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21769 | 21782 | 21781 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21783 | 21790 | 21789 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21791 | 21810 | 21797 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21811 | 21837 | 21813 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21838 | 21854 | 21853 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21855 | 21861 | 21855 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21862 | 21879 | 21877 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21880 | 21887 | 21885 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21888 | 21910 | 21908 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21911 | 21918 | 21916 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21919 | 21925 | 21923 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21926 | 21962 | 21960 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21963 | 22010 | 22008 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22011 | 22027 | 22025 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22028 | 22045 | 22043 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22046 | 22056 | 22054 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 22057 | 22088 | 22086 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22089 | 22136 | 22134 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22137 | 22171 | 22165 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22172 | 22177 | 22175 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22178 | 22187 | 22185 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 22188 | 22213 | 22211 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22214 | 22422 | 22386 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22423 | 22429 | 22425 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22430 | 22477 | 22471 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 22478 | 22512 | 22505 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22513 | 22527 | 23296 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 22528 | 22858 | 22530 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22859 | 23300 | 22876 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23301 | 23369 | 23365 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23370 | 23400 | 23398 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23401 | 23432 | 23431 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23433 | 23446 | 23445 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23447 | 23626 | 23624 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 23627 | 23630 | 23629 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 23631 | 23844 | 23843 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 23845 | 23867 | 23855 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 23868 | 23874 | 23874 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 23875 | 23896 | 23896 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 23897 | 23908 | 23908 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23909 | 23928 | 23927 | 20 | 19 | `updateProgress` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 23929 | 23973 | 23972 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 23974 | 23974 | 24015 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 23975 | 23975 | 23975 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23976 | 23977 | 23976 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23978 | 23993 | 23978 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23994 | 24017 | 23994 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24018 | 24030 | 24028 | 13 | 11 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24031 | 24059 | 24057 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24060 | 24073 | 24080 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24074 | 24082 | 24074 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24083 | 24091 | 24089 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24092 | 24109 | 24103 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24110 | 24167 | 24161 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24168 | 24272 | 24270 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24273 | 24279 | 24294 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 24280 | 24296 | 24288 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24297 | 24304 | 24302 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 24305 | 24306 | 24315 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24307 | 24310 | 24307 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24311 | 24316 | 24311 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24317 | 24348 | 24345 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 24349 | 24360 | 24359 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24361 | 24395 | 24394 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24396 | 24397 | 24396 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 24398 | 24400 | 24417 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24401 | 24409 | 24401 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24410 | 24411 | 24410 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24412 | 24418 | 24412 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24419 | 24424 | 24423 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24425 | 24433 | 24432 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24434 | 24437 | 24436 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24438 | 24440 | 24447 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24441 | 24457 | 24441 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24458 | 24464 | 24463 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24465 | 24501 | 24497 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24502 | 24517 | 24513 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24518 | 24535 | 24533 | 18 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24536 | 24596 | 24837 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 24597 | 24702 | 24605 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24703 | 24712 | 24707 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24713 | 24790 | 24713 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24791 | 24846 | 24795 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24847 | 24875 | 24985 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24876 | 24986 | 24897 | 111 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24987 | 25035 | 25034 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25036 | 25039 | 25089 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25040 | 25090 | 25049 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 25091 | 25123 | 25118 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25124 | 25151 | 25150 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25152 | 25152 | 25177 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25153 | 25154 | 25153 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25155 | 25178 | 25155 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25179 | 25219 | 25215 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25220 | 25384 | 25248 | 165 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 25385 | 25418 | 25412 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25419 | 25437 | 25435 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 25438 | 25489 | 25487 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25490 | 25507 | 25505 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 25508 | 25539 | 25546 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25540 | 25548 | 25540 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25549 | 25559 | 25602 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25560 | 25595 | 25560 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 25596 | 25604 | 25596 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25605 | 25635 | 25651 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25636 | 25653 | 25636 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25654 | 25679 | 25677 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25680 | 25694 | 25692 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25695 | 25758 | 25756 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25759 | 25840 | 25838 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25841 | 25868 | 26533 | 28 | 693 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25869 | 25882 | 25871 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25883 | 25895 | 25887 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25896 | 26536 | 25898 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26537 | 26555 | 26553 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26556 | 26556 | 26580 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26557 | 26572 | 26561 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26573 | 26582 | 26573 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26583 | 26590 | 26589 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26591 | 26596 | 26595 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26597 | 26602 | 26601 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 26603 | 26607 | 26606 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26608 | 26616 | 26614 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26617 | 26622 | 26621 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26623 | 26630 | 26629 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26631 | 26661 | 26659 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 26662 | 26678 | 26676 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26679 | 26730 | 26728 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26731 | 26770 | 26768 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26771 | 26777 | 26775 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26778 | 26821 | 26809 | 44 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26822 | 26850 | 26848 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26851 | 26852 | 26982 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26853 | 26853 | 26853 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 26854 | 26857 | 26857 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 26858 | 26990 | 26861 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 26991 | 27061 | 27059 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27062 | 27094 | 27092 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27095 | 27101 | 27099 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27102 | 27134 | 27149 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27135 | 27151 | 27135 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27152 | 27156 | 27444 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27157 | 27191 | 27157 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27192 | 27272 | 27194 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27273 | 27414 | 27324 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27415 | 27446 | 27415 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27447 | 27471 | 27469 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 27472 | 27571 | 27472 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27572 | 27629 | 27572 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27630 | 27643 | 27730 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27644 | 27732 | 27646 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27733 | 27777 | 27776 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27778 | 27787 | 27785 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27788 | 27819 | 27810 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27820 | 27900 | 27820 | 81 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27901 | 27934 | 28006 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 27935 | 28008 | 27940 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 28009 | 28014 | 28012 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 28015 | 28043 | 28042 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 28044 | 28056 | 28055 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28057 | 28065 | 28064 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28066 | 28073 | 28072 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28074 | 28080 | 28079 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28081 | 28107 | 28121 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28108 | 28122 | 28108 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28123 | 28181 | 28175 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 28182 | 28221 | 28182 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 28222 | 28271 | 28222 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28272 | 28289 | 28287 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 28290 | 28346 | 28345 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28347 | 28359 | 28368 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28360 | 28369 | 28360 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28370 | 28377 | 28376 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28378 | 28389 | 28392 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28390 | 28393 | 28390 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28394 | 28408 | 28407 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28409 | 28423 | 28420 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 28424 | 28439 | 28438 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28440 | 28536 | 28535 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28537 | 28600 | 28550 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28601 | 28609 | 28604 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 28610 | 28629 | 28627 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 28630 | 28633 | 28632 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 28634 | 28660 | 28649 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28661 | 28677 | 28673 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 28678 | 28791 | 28790 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28792 | 29331 | 29330 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29332 | 29780 | 29894 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29781 | 29895 | 29781 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29896 | 29983 | 30120 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 29984 | 30121 | 30002 | 138 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 30122 | 30319 | 30124 | 198 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30320 | 30386 | 30457 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30387 | 30434 | 30387 | 48 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30435 | 31093 | 30450 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31094 | 31146 | 31225 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31147 | 31185 | 31149 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31186 | 31235 | 31186 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31236 | 31244 | 31386 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31245 | 31267 | 31249 | 23 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 31268 | 31390 | 31268 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31391 | 31482 | 31511 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31483 | 31491 | 31483 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31492 | 31513 | 31492 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31514 | 31521 | 31520 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31522 | 31529 | 31527 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31530 | 31549 | 31547 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31550 | 31569 | 31568 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 31570 | 31577 | 31576 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31578 | 31585 | 31584 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31586 | 31589 | 31588 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31590 | 31593 | 31592 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31594 | 31612 | 31611 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31613 | 31635 | 31631 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 31636 | 31704 | 31698 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31705 | 31717 | 31716 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31718 | 31727 | 31726 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31728 | 31745 | 31744 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31746 | 31766 | 31765 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31767 | 31773 | 31791 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 31774 | 31792 | 31774 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31793 | 31802 | 31801 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31803 | 31818 | 31843 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31819 | 31844 | 31819 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31845 | 31871 | 31866 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31872 | 31879 | 31878 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31880 | 31886 | 31885 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31887 | 31900 | 31899 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31901 | 31904 | 31903 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31905 | 31924 | 31923 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31925 | 31944 | 31943 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 31945 | 31949 | 31948 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31950 | 31960 | 31959 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31961 | 31990 | 31989 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31991 | 32063 | 32182 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32064 | 32068 | 32064 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32069 | 32074 | 32069 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32075 | 32083 | 32075 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32084 | 32092 | 32084 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32093 | 32098 | 32093 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32099 | 32183 | 32099 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32184 | 32196 | 32334 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32197 | 32335 | 32197 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32336 | 32356 | 32354 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32357 | 32390 | 32389 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32391 | 32404 | 32402 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32405 | 32476 | 32474 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32477 | 32519 | 32517 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32520 | 32588 | 32744 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32589 | 32748 | 32607 | 160 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 32749 | 32784 | 32783 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32785 | 32795 | 32794 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32796 | 32800 | 32799 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32801 | 32806 | 32804 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32807 | 32849 | 32847 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32850 | 32892 | 32890 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32893 | 32937 | 32935 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32938 | 32990 | 32988 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32991 | 32995 | 33014 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32996 | 33006 | 32996 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33007 | 33031 | 33007 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33032 | 33045 | 33208 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 33046 | 33138 | 33053 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 33139 | 33139 | 33139 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33140 | 33210 | 33142 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33211 | 33241 | 33564 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 33242 | 33284 | 33249 | 43 | 8 | `hexToRgb` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 33285 | 33290 | 33288 | 6 | 4 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33291 | 33305 | 33303 | 15 | 13 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33306 | 33325 | 33323 | 20 | 18 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33326 | 33335 | 33333 | 10 | 8 | `newPage` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 33336 | 33344 | 33342 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 33345 | 33371 | 33369 | 27 | 25 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 33372 | 33424 | 33422 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33425 | 33565 | 33437 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 33566 | 33604 | 33603 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33605 | 33729 | 33727 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33730 | 33781 | 34100 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33782 | 33853 | 33782 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33854 | 33858 | 33854 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33859 | 33971 | 33866 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33972 | 34025 | 33978 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34026 | 34076 | 34026 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34077 | 34080 | 34077 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34081 | 34101 | 34087 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34102 | 34122 | 34121 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34123 | 34136 | 34134 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34137 | 34162 | 34153 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 34163 | 34174 | 34173 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34175 | 34181 | 34180 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34182 | 34192 | 34191 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34193 | 34213 | 34212 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 34214 | 34223 | 34222 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 34224 | 34228 | 34227 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 34229 | 34235 | 34281 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 34236 | 34236 | 34236 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34237 | 34282 | 34237 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34283 | 34287 | 34286 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 34288 | 34309 | 34318 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 34310 | 34319 | 34310 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34320 | 34349 | 34339 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34350 | 34370 | 34368 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 34371 | 34391 | 34389 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34392 | 34396 | 34394 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34397 | 34458 | 34429 | 62 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34459 | 34468 | 34477 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 34469 | 34483 | 34469 | 15 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34484 | 34493 | 34502 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34494 | 34504 | 34494 | 11 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34505 | 34520 | 34512 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34521 | 34523 | 34541 | 3 | 21 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 34524 | 34534 | 34531 | 11 | 8 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34535 | 34546 | 34538 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34547 | 34604 | 34639 | 58 | 93 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34605 | 34646 | 34608 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 34647 | 34658 | 34768 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34659 | 34770 | 34668 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34771 | 34793 | 34792 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 34794 | 34825 | 34823 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34826 | 34864 | 34860 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34865 | 34902 | 34887 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34903 | 34912 | 34910 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 34913 | 34921 | 34920 | 9 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34922 | 34925 | 34924 | 4 | 3 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34926 | 34937 | 34936 | 12 | 11 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34938 | 34974 | 34972 | 37 | 35 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 34975 | 34998 | 34997 | 24 | 23 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34999 | 35006 | 35005 | 8 | 7 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35007 | 35042 | 35041 | 36 | 35 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35043 | 35062 | 35061 | 20 | 19 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35063 | 35071 | 35070 | 9 | 8 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35072 | 35090 | 35094 | 19 | 23 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35091 | 35091 | 35091 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 35092 | 35106 | 35092 | 15 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 35107 | 35185 | 35179 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 35186 | 35191 | 35190 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35192 | 35202 | 35451 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 35203 | 35203 | 35203 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35204 | 35399 | 35204 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35400 | 35419 | 35443 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35420 | 35457 | 35432 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35458 | 35477 | 35486 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35478 | 35487 | 35478 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35488 | 35634 | 35632 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35635 | 35690 | 35689 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35691 | 35768 | 35810 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 35769 | 35811 | 35772 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35812 | 35824 | 35877 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35825 | 35878 | 35862 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35879 | 35920 | 35893 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35921 | 35970 | 35968 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 35971 | 35983 | 35981 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35984 | 35997 | 35995 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35998 | 36017 | 36015 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36018 | 36051 | 36049 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36052 | 36069 | 36060 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36070 | 36088 | 36087 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36089 | 36135 | 36096 | 47 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36136 | 36151 | 36145 | 16 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36152 | 36175 | 36167 | 24 | 16 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36176 | 36206 | 36196 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36207 | 36267 | 36232 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 36268 | 36332 | 36328 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36333 | 36381 | 36364 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36382 | 36411 | 36403 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36412 | 36470 | 36449 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36471 | 36473 | 36517 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36474 | 36484 | 36483 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36485 | 36522 | 36498 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36523 | 36534 | 36528 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36535 | 36617 | 36610 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36618 | 36673 | 36664 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36674 | 36709 | 36703 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36710 | 36731 | 36729 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36732 | 36796 | 36741 | 65 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36797 | 36868 | 36867 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 36869 | 36873 | 36871 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36874 | 36902 | 36900 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36903 | 36935 | 36961 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36936 | 36947 | 36938 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36948 | 36963 | 36954 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36964 | 37041 | 37039 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37042 | 37053 | 37110 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37054 | 37076 | 37056 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37077 | 37084 | 37077 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37085 | 37112 | 37085 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37113 | 37126 | 37124 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37127 | 37159 | 37151 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37160 | 37219 | 37217 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37220 | 37243 | 37241 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37244 | 37325 | 37320 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37326 | 37384 | 37365 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37385 | 37418 | 37385 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 37419 | 37442 | 37419 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37443 | 37460 | 37446 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37461 | 37488 | 37461 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37489 | 37490 | 37489 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37491 | 37491 | 37491 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37492 | 37506 | 37492 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37507 | 37525 | 37510 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37526 | 37550 | 37546 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37551 | 37564 | 37560 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37565 | 37568 | 37583 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 37569 | 37569 | 37569 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37570 | 37594 | 37570 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37595 | 37640 | 37625 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37641 | 37815 | 37869 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37816 | 37871 | 37816 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37872 | 37875 | 37874 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37876 | 37882 | 37881 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37883 | 37911 | 37910 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37912 | 37912 | 37927 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37913 | 37918 | 37915 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37919 | 37919 | 37919 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37920 | 37922 | 37920 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37923 | 37936 | 37923 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37937 | 37958 | 38017 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37959 | 37971 | 37961 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37972 | 38018 | 37978 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38019 | 38023 | 38080 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38024 | 38046 | 38026 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38047 | 38047 | 38047 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38048 | 38051 | 38048 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38052 | 38081 | 38052 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38082 | 38091 | 38090 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 38092 | 38130 | 38129 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38131 | 38159 | 38152 | 29 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38160 | 38220 | 38218 | 61 | 59 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 38221 | 38240 | 38272 | 20 | 52 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 38241 | 38274 | 38241 | 34 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38275 | 38356 | 38354 | 82 | 80 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 38357 | 38403 | 38401 | 47 | 45 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38404 | 38485 | 38482 | 82 | 79 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38486 | 38493 | 38542 | 8 | 57 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38494 | 38544 | 38507 | 51 | 14 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 38545 | 38557 | 38584 | 13 | 40 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38558 | 38571 | 38570 | 14 | 13 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 38572 | 38586 | 38574 | 15 | 3 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38587 | 38597 | 38595 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38598 | 38612 | 38610 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38613 | 38621 | 38630 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38622 | 38633 | 38622 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38634 | 38638 | 38636 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 38639 | 38655 | 38653 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38656 | 38666 | 38664 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38667 | 38679 | 38677 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38680 | 38695 | 38694 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38696 | 38759 | 38700 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38760 | 38873 | 38871 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38874 | 38882 | 38881 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38883 | 38893 | 38892 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38894 | 38910 | 38909 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38911 | 38936 | 38935 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38937 | 38942 | 38941 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38943 | 38953 | 38952 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38954 | 38963 | 38962 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38964 | 38970 | 38969 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38971 | 39000 | 38999 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39001 | 39029 | 39028 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39030 | 39044 | 39043 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39045 | 39074 | 39066 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39075 | 39084 | 39080 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39085 | 39092 | 39088 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39093 | 39105 | 39101 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39106 | 39149 | 39145 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39150 | 39159 | 39155 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39160 | 39195 | 39191 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39196 | 39206 | 39202 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39207 | 39247 | 39243 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39248 | 39258 | 39254 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39259 | 39284 | 39283 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39285 | 39327 | 39326 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39328 | 39382 | 39369 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 39383 | 39403 | 39402 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39404 | 39422 | 39418 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39423 | 39448 | 39444 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39449 | 39509 | 39508 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39510 | 39595 | 39632 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39596 | 39596 | 39596 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39597 | 39604 | 39597 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39605 | 39633 | 39605 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39634 | 39651 | 39650 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39652 | 39670 | 39669 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 39671 | 39677 | 39676 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39678 | 39684 | 39683 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39685 | 39692 | 39691 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39693 | 39739 | 39738 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 39740 | 39792 | 39787 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39793 | 39957 | 39956 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39958 | 39961 | 39960 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 39962 | 39980 | 40059 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39981 | 40062 | 39987 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
