# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-20 · source `app/index.html` (88651 lines)

Declarations in this part: **649**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 126 | 139 | 135 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140 | 149 | 145 | 10 | 6 | `esc` | window fn | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 150 | 14823 | 161 | 14674 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 14824 | 14850 | 14847 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14851 | 14880 | 14855 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14881 | 14889 | 14883 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 14890 | 14915 | 14927 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14916 | 15000 | 14916 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15001 | 15004 | 15004 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15005 | 15030 | 15008 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15031 | 15148 | 15036 | 118 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15149 | 15161 | 15155 | 13 | 7 | `fireJurisdictionChanged` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15162 | 15181 | 15177 | 20 | 16 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15182 | 15199 | 15193 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15200 | 15274 | 15264 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15275 | 15308 | 15304 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 15309 | 15318 | 15313 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 15319 | 15326 | 15322 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 15327 | 15334 | 15330 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15335 | 15363 | 15347 | 29 | 13 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 15364 | 15389 | 15369 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 15390 | 15391 | 15390 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15392 | 15412 | 15392 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15413 | 15447 | 15413 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15448 | 15481 | 15477 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 15482 | 15501 | 15497 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15502 | 15514 | 15510 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15515 | 15561 | 15557 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15562 | 15565 | 15562 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15566 | 15573 | 15566 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15574 | 15585 | 15578 | 12 | 5 | `apply` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 15586 | 15679 | 15782 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15680 | 15786 | 15684 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15787 | 15840 | 15838 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15841 | 15856 | 15854 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15857 | 15878 | 15873 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15879 | 15910 | 15905 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 15911 | 15936 | 15929 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15937 | 15961 | 15954 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 15962 | 15982 | 15968 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15983 | 16042 | 16032 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 16043 | 16060 | 16050 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 16061 | 16086 | 16079 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 16087 | 16110 | 16108 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16111 | 16201 | 16194 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16202 | 16224 | 16219 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 16225 | 16270 | 16308 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16271 | 16271 | 16271 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16272 | 16313 | 16272 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16314 | 16480 | 16474 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16481 | 16515 | 16646 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16516 | 16652 | 16516 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16653 | 16667 | 16666 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 16668 | 16714 | 16775 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 16715 | 16776 | 16715 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16777 | 16853 | 16852 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 16854 | 17030 | 17024 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17031 | 17104 | 17103 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17105 | 17161 | 17154 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17162 | 17216 | 17209 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17217 | 17298 | 17293 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 17299 | 17349 | 17343 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17350 | 17370 | 17481 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17371 | 17488 | 17371 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 17489 | 17507 | 17499 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17508 | 17515 | 17514 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 17516 | 17586 | 17578 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 17587 | 17599 | 17597 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 17600 | 17649 | 17647 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17650 | 17701 | 17698 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17702 | 17723 | 17721 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17724 | 17773 | 17771 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 17774 | 17780 | 17779 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 17781 | 17786 | 17785 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17787 | 17792 | 17791 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17793 | 17802 | 17801 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17803 | 17989 | 17809 | 187 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17990 | 18091 | 18089 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 18092 | 18105 | 18103 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 18106 | 18116 | 18113 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 18117 | 18138 | 18130 | 22 | 14 | `apply` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 18139 | 18149 | 18147 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18150 | 18169 | 18161 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18170 | 18290 | 18288 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 18291 | 18352 | 18331 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 18353 | 18378 | 18376 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18379 | 19245 | 18388 | 867 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 19246 | 19283 | 19279 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19284 | 19336 | 19328 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19337 | 19489 | 19485 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19490 | 19623 | 19616 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19624 | 19699 | 19695 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19700 | 19713 | 19709 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19714 | 19752 | 19748 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 19753 | 19763 | 19759 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19764 | 19802 | 19791 | 39 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19803 | 19840 | 19834 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19841 | 19887 | 19882 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19888 | 19939 | 19919 | 52 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19940 | 19967 | 19963 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19968 | 19983 | 19979 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 19984 | 20007 | 20003 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20008 | 20033 | 20029 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20034 | 20527 | 20052 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20528 | 20780 | 20532 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20781 | 20788 | 20787 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20789 | 20795 | 20794 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20796 | 20815 | 20814 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20816 | 20820 | 20819 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20821 | 20827 | 20826 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20828 | 20831 | 20830 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20832 | 20835 | 20834 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20836 | 20841 | 20840 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20842 | 20908 | 20844 | 67 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20909 | 20995 | 20919 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 20996 | 20996 | 20996 | 1 | 1 | `isYes` | const arrow | — | refs:261 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20997 | 20998 | 20997 | 2 | 1 | `esc` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 20999 | 21000 | 20999 | 2 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21001 | 21001 | 21001 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21002 | 21002 | 21002 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21003 | 21008 | 21008 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21009 | 21009 | 21009 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 21010 | 21010 | 21010 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21011 | 21029 | 21011 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 21030 | 21080 | 21078 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 21081 | 21098 | 21096 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21099 | 21111 | 21109 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 21112 | 21125 | 21123 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 21126 | 21134 | 21132 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21135 | 21143 | 21142 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21144 | 21153 | 21152 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21154 | 21163 | 21160 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21164 | 21172 | 21170 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21173 | 21203 | 21197 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 21204 | 21224 | 21222 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21225 | 21241 | 21239 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21242 | 21298 | 21296 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21299 | 21308 | 21306 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21309 | 21342 | 21334 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21343 | 21350 | 21348 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21351 | 21365 | 21363 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21366 | 21384 | 21382 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 21385 | 21392 | 21390 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21393 | 21456 | 21454 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21457 | 21469 | 21467 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21470 | 21482 | 21481 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21483 | 21487 | 21486 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21488 | 21501 | 21500 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21502 | 21509 | 21508 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21510 | 21529 | 21516 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21530 | 21556 | 21532 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21557 | 21573 | 21572 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21574 | 21580 | 21574 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21581 | 21598 | 21596 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21599 | 21606 | 21604 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21607 | 21629 | 21627 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21630 | 21637 | 21635 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21638 | 21644 | 21642 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21645 | 21681 | 21679 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21682 | 21729 | 21727 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21730 | 21746 | 21744 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21747 | 21764 | 21762 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21765 | 21775 | 21773 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21776 | 21807 | 21805 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21808 | 21855 | 21853 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21856 | 21890 | 21884 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21891 | 21896 | 21894 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21897 | 21906 | 21904 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21907 | 21932 | 21930 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21933 | 22141 | 22105 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22142 | 22148 | 22144 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22149 | 22196 | 22190 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 22197 | 22231 | 22224 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22232 | 22246 | 23015 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 22247 | 22577 | 22249 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22578 | 23019 | 22595 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23020 | 23088 | 23084 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23089 | 23119 | 23117 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23120 | 23151 | 23150 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23152 | 23165 | 23164 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23166 | 23345 | 23343 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 23346 | 23349 | 23348 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 23350 | 23563 | 23562 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 23564 | 23586 | 23574 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 23587 | 23593 | 23593 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 23594 | 23615 | 23615 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 23616 | 23627 | 23627 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23628 | 23647 | 23646 | 20 | 19 | `updateProgress` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 23648 | 23692 | 23691 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 23693 | 23693 | 23734 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 23694 | 23694 | 23694 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23695 | 23696 | 23695 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23697 | 23712 | 23697 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23713 | 23736 | 23713 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23737 | 23749 | 23747 | 13 | 11 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23750 | 23778 | 23776 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23779 | 23792 | 23799 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23793 | 23801 | 23793 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23802 | 23810 | 23808 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23811 | 23828 | 23822 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23829 | 23886 | 23880 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 23887 | 23991 | 23989 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 23992 | 23998 | 24013 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 23999 | 24015 | 24007 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24016 | 24023 | 24021 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 24024 | 24025 | 24034 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24026 | 24029 | 24026 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24030 | 24035 | 24030 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24036 | 24067 | 24064 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 24068 | 24079 | 24078 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24080 | 24114 | 24113 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24115 | 24116 | 24115 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 24117 | 24119 | 24136 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24120 | 24128 | 24120 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24129 | 24130 | 24129 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24131 | 24137 | 24131 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24138 | 24143 | 24142 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24144 | 24152 | 24151 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24153 | 24156 | 24155 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24157 | 24159 | 24166 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24160 | 24176 | 24160 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24177 | 24183 | 24182 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24184 | 24220 | 24216 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24221 | 24236 | 24232 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24237 | 24254 | 24252 | 18 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24255 | 24315 | 24556 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 24316 | 24421 | 24324 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24422 | 24431 | 24426 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24432 | 24509 | 24432 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24510 | 24565 | 24514 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24566 | 24594 | 24704 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24595 | 24705 | 24616 | 111 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24706 | 24754 | 24753 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24755 | 24758 | 24808 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24759 | 24809 | 24768 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 24810 | 24842 | 24837 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24843 | 24870 | 24869 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24871 | 24871 | 24896 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24872 | 24873 | 24872 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24874 | 24897 | 24874 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24898 | 24938 | 24934 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24939 | 25103 | 24967 | 165 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 25104 | 25137 | 25131 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25138 | 25156 | 25154 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 25157 | 25208 | 25206 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25209 | 25226 | 25224 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 25227 | 25258 | 25265 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25259 | 25267 | 25259 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25268 | 25278 | 25321 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25279 | 25314 | 25279 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 25315 | 25323 | 25315 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25324 | 25354 | 25370 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25355 | 25372 | 25355 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25373 | 25398 | 25396 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25399 | 25413 | 25411 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25414 | 25477 | 25475 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25478 | 25559 | 25557 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25560 | 25587 | 26252 | 28 | 693 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25588 | 25601 | 25590 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25602 | 25614 | 25606 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25615 | 26255 | 25617 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26256 | 26274 | 26272 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26275 | 26275 | 26299 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26276 | 26291 | 26280 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26292 | 26301 | 26292 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26302 | 26309 | 26308 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26310 | 26315 | 26314 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26316 | 26321 | 26320 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 26322 | 26326 | 26325 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26327 | 26335 | 26333 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26336 | 26341 | 26340 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26342 | 26349 | 26348 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26350 | 26380 | 26378 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 26381 | 26397 | 26395 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26398 | 26449 | 26447 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26450 | 26489 | 26487 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26490 | 26496 | 26494 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26497 | 26540 | 26528 | 44 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26541 | 26569 | 26567 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26570 | 26571 | 26701 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26572 | 26572 | 26572 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 26573 | 26576 | 26576 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 26577 | 26709 | 26580 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 26710 | 26780 | 26778 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26781 | 26813 | 26811 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26814 | 26820 | 26818 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26821 | 26853 | 26868 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26854 | 26870 | 26854 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26871 | 26875 | 27163 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26876 | 26910 | 26876 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26911 | 26991 | 26913 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26992 | 27133 | 27043 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27134 | 27165 | 27134 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27166 | 27190 | 27188 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 27191 | 27290 | 27191 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27291 | 27348 | 27291 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27349 | 27362 | 27449 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27363 | 27451 | 27365 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27452 | 27496 | 27495 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27497 | 27506 | 27504 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27507 | 27538 | 27529 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27539 | 27619 | 27539 | 81 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27620 | 27653 | 27725 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 27654 | 27727 | 27659 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 27728 | 27733 | 27731 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27734 | 27762 | 27761 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 27763 | 27775 | 27774 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27776 | 27784 | 27783 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27785 | 27792 | 27791 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27793 | 27799 | 27798 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27800 | 27826 | 27840 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27827 | 27841 | 27827 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27842 | 27900 | 27894 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 27901 | 27940 | 27901 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 27941 | 27990 | 27941 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27991 | 28008 | 28006 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 28009 | 28065 | 28064 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28066 | 28078 | 28087 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28079 | 28088 | 28079 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28089 | 28096 | 28095 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28097 | 28108 | 28111 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28109 | 28112 | 28109 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28113 | 28127 | 28126 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28128 | 28142 | 28139 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 28143 | 28158 | 28157 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28159 | 28255 | 28254 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28256 | 28319 | 28269 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28320 | 28328 | 28323 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 28329 | 28348 | 28346 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 28349 | 28352 | 28351 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 28353 | 28379 | 28368 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28380 | 28396 | 28392 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 28397 | 28510 | 28509 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28511 | 29050 | 29049 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29051 | 29499 | 29613 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29500 | 29614 | 29500 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29615 | 29702 | 29839 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 29703 | 29840 | 29721 | 138 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 29841 | 30038 | 29843 | 198 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30039 | 30105 | 30176 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30106 | 30153 | 30106 | 48 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30154 | 30812 | 30169 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30813 | 30865 | 30944 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30866 | 30904 | 30868 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30905 | 30954 | 30905 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30955 | 30963 | 31105 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30964 | 30986 | 30968 | 23 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 30987 | 31109 | 30987 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31110 | 31201 | 31230 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31202 | 31210 | 31202 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31211 | 31232 | 31211 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31233 | 31240 | 31239 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31241 | 31248 | 31246 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31249 | 31268 | 31266 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31269 | 31288 | 31287 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 31289 | 31296 | 31295 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31297 | 31304 | 31303 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31305 | 31308 | 31307 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31309 | 31312 | 31311 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31313 | 31331 | 31330 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31332 | 31354 | 31350 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 31355 | 31423 | 31417 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31424 | 31436 | 31435 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31437 | 31446 | 31445 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31447 | 31464 | 31463 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31465 | 31485 | 31484 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31486 | 31492 | 31510 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 31493 | 31511 | 31493 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31512 | 31521 | 31520 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31522 | 31537 | 31562 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31538 | 31563 | 31538 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31564 | 31590 | 31585 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31591 | 31598 | 31597 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31599 | 31605 | 31604 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31606 | 31619 | 31618 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31620 | 31623 | 31622 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31624 | 31643 | 31642 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31644 | 31663 | 31662 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 31664 | 31668 | 31667 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31669 | 31679 | 31678 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31680 | 31709 | 31708 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31710 | 31782 | 31901 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31783 | 31787 | 31783 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31788 | 31793 | 31788 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31794 | 31802 | 31794 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31803 | 31811 | 31803 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31812 | 31817 | 31812 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31818 | 31902 | 31818 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31903 | 31915 | 32053 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31916 | 32054 | 31916 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32055 | 32075 | 32073 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32076 | 32109 | 32108 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32110 | 32123 | 32121 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32124 | 32195 | 32193 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32196 | 32238 | 32236 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32239 | 32307 | 32463 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32308 | 32467 | 32326 | 160 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 32468 | 32503 | 32502 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32504 | 32514 | 32513 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32515 | 32519 | 32518 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32520 | 32525 | 32523 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32526 | 32568 | 32566 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32569 | 32611 | 32609 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32612 | 32656 | 32654 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32657 | 32709 | 32707 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32710 | 32714 | 32733 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32715 | 32725 | 32715 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32726 | 32750 | 32726 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32751 | 32764 | 32927 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32765 | 32857 | 32772 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 32858 | 32858 | 32858 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32859 | 32929 | 32861 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32930 | 32960 | 33283 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 32961 | 33003 | 32968 | 43 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 33004 | 33009 | 33007 | 6 | 4 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33010 | 33024 | 33022 | 15 | 13 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33025 | 33044 | 33042 | 20 | 18 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33045 | 33054 | 33052 | 10 | 8 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 33055 | 33063 | 33061 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 33064 | 33090 | 33088 | 27 | 25 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 33091 | 33143 | 33141 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33144 | 33284 | 33156 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 33285 | 33323 | 33322 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33324 | 33448 | 33446 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33449 | 33500 | 33819 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33501 | 33572 | 33501 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33573 | 33577 | 33573 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33578 | 33690 | 33585 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33691 | 33744 | 33697 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33745 | 33795 | 33745 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33796 | 33799 | 33796 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33800 | 33820 | 33806 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33821 | 33841 | 33840 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33842 | 33855 | 33853 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33856 | 33881 | 33872 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33882 | 33893 | 33892 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33894 | 33900 | 33899 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33901 | 33911 | 33910 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33912 | 33932 | 33931 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 33933 | 33942 | 33941 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 33943 | 33947 | 33946 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 33948 | 33954 | 34000 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 33955 | 33955 | 33955 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33956 | 34001 | 33956 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34002 | 34006 | 34005 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 34007 | 34028 | 34037 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 34029 | 34038 | 34029 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34039 | 34068 | 34058 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34069 | 34089 | 34087 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 34090 | 34110 | 34108 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34111 | 34115 | 34113 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34116 | 34177 | 34148 | 62 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34178 | 34187 | 34196 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 34188 | 34202 | 34188 | 15 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34203 | 34212 | 34221 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34213 | 34223 | 34213 | 11 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34224 | 34239 | 34231 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34240 | 34242 | 34260 | 3 | 21 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 34243 | 34253 | 34250 | 11 | 8 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34254 | 34265 | 34257 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34266 | 34323 | 34358 | 58 | 93 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34324 | 34365 | 34327 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 34366 | 34377 | 34487 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34378 | 34489 | 34387 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34490 | 34512 | 34511 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 34513 | 34544 | 34542 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34545 | 34583 | 34579 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34584 | 34621 | 34606 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34622 | 34631 | 34629 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 34632 | 34652 | 34639 | 21 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34653 | 34731 | 34725 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 34732 | 34737 | 34736 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34738 | 34748 | 34997 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 34749 | 34749 | 34749 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34750 | 34945 | 34750 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34946 | 34965 | 34989 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34966 | 35003 | 34978 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35004 | 35023 | 35032 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35024 | 35033 | 35024 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35034 | 35180 | 35178 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35181 | 35236 | 35235 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35237 | 35314 | 35356 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 35315 | 35357 | 35318 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35358 | 35370 | 35423 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35371 | 35424 | 35408 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35425 | 35466 | 35439 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35467 | 35516 | 35514 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 35517 | 35529 | 35527 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35530 | 35543 | 35541 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35544 | 35563 | 35561 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35564 | 35597 | 35595 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35598 | 35615 | 35606 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35616 | 35634 | 35633 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35635 | 35681 | 35642 | 47 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35682 | 35697 | 35691 | 16 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35698 | 35721 | 35713 | 24 | 16 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35722 | 35752 | 35742 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35753 | 35813 | 35778 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 35814 | 35878 | 35874 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35879 | 35927 | 35910 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35928 | 35957 | 35949 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35958 | 36016 | 35995 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36017 | 36019 | 36063 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36020 | 36030 | 36029 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36031 | 36068 | 36044 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36069 | 36080 | 36074 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36081 | 36163 | 36156 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36164 | 36219 | 36210 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36220 | 36255 | 36249 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36256 | 36277 | 36275 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36278 | 36342 | 36287 | 65 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36343 | 36414 | 36413 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 36415 | 36419 | 36417 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36420 | 36448 | 36446 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36449 | 36481 | 36507 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36482 | 36493 | 36484 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36494 | 36509 | 36500 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36510 | 36587 | 36585 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36588 | 36599 | 36656 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36600 | 36622 | 36602 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36623 | 36630 | 36623 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36631 | 36658 | 36631 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36659 | 36672 | 36670 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36673 | 36705 | 36697 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36706 | 36765 | 36763 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36766 | 36789 | 36787 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36790 | 36871 | 36866 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36872 | 36930 | 36911 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36931 | 36964 | 36931 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36965 | 36988 | 36965 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36989 | 37006 | 36992 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37007 | 37034 | 37007 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37035 | 37036 | 37035 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37037 | 37037 | 37037 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37038 | 37052 | 37038 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37053 | 37071 | 37056 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37072 | 37096 | 37092 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37097 | 37110 | 37106 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37111 | 37114 | 37129 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 37115 | 37115 | 37115 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37116 | 37140 | 37116 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37141 | 37186 | 37171 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37187 | 37361 | 37415 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37362 | 37417 | 37362 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37418 | 37421 | 37420 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37422 | 37428 | 37427 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37429 | 37457 | 37456 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37458 | 37458 | 37473 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37459 | 37464 | 37461 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37465 | 37465 | 37465 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37466 | 37468 | 37466 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37469 | 37482 | 37469 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37483 | 37504 | 37563 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37505 | 37517 | 37507 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37518 | 37564 | 37524 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37565 | 37569 | 37626 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37570 | 37592 | 37572 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37593 | 37593 | 37593 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37594 | 37597 | 37594 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37598 | 37627 | 37598 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37628 | 37637 | 37636 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37638 | 37676 | 37675 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37677 | 37706 | 37698 | 30 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37707 | 37717 | 37715 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37718 | 37732 | 37730 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37733 | 37741 | 37750 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37742 | 37753 | 37742 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37754 | 37758 | 37756 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37759 | 37775 | 37773 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37776 | 37786 | 37784 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37787 | 37799 | 37797 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37800 | 37815 | 37814 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37816 | 37879 | 37820 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37880 | 37993 | 37991 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37994 | 38002 | 38001 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38003 | 38013 | 38012 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38014 | 38030 | 38029 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38031 | 38056 | 38055 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38057 | 38062 | 38061 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38063 | 38073 | 38072 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38074 | 38083 | 38082 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38084 | 38090 | 38089 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38091 | 38120 | 38119 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38121 | 38149 | 38148 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38150 | 38164 | 38163 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38165 | 38194 | 38186 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38195 | 38204 | 38200 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38205 | 38212 | 38208 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38213 | 38225 | 38221 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38226 | 38269 | 38265 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38270 | 38279 | 38275 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38280 | 38315 | 38311 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38316 | 38326 | 38322 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38327 | 38367 | 38363 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38368 | 38378 | 38374 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38379 | 38404 | 38403 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38405 | 38447 | 38446 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38448 | 38502 | 38489 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 38503 | 38523 | 38522 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38524 | 38542 | 38538 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38543 | 38568 | 38564 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38569 | 38629 | 38628 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38630 | 38715 | 38752 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38716 | 38716 | 38716 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38717 | 38724 | 38717 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38725 | 38753 | 38725 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38754 | 38771 | 38770 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38772 | 38790 | 38789 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 38791 | 38797 | 38796 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38798 | 38804 | 38803 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38805 | 38812 | 38811 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38813 | 38859 | 38858 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38860 | 38912 | 38907 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38913 | 39077 | 39076 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39078 | 39081 | 39080 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 39082 | 39100 | 39179 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39101 | 39182 | 39107 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39183 | 39196 | 39314 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 39197 | 39227 | 39203 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39228 | 39232 | 39228 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39233 | 39236 | 39235 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39237 | 39237 | 39237 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39238 | 39316 | 39238 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39317 | 39330 | 39450 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 39331 | 39361 | 39337 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39362 | 39376 | 39362 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39377 | 39377 | 39377 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39378 | 39452 | 39378 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39453 | 39479 | 39529 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39480 | 39532 | 39480 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39533 | 39699 | 39697 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 39700 | 39706 | 39704 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39707 | 39710 | 39767 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39711 | 39728 | 39711 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39729 | 39731 | 39729 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39732 | 39740 | 39732 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39741 | 39769 | 39741 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39770 | 39818 | 39816 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39819 | 39823 | 39821 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39824 | 39828 | 39826 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 39829 | 39868 | 39866 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39869 | 39889 | 39888 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 39890 | 39901 | 39900 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39902 | 39913 | 39953 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39914 | 39929 | 39928 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39930 | 39981 | 39930 | 52 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39982 | 39986 | 40272 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39987 | 39994 | 39992 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39995 | 40202 | 40000 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
