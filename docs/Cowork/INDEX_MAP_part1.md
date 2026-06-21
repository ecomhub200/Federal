# index.html function inventory — PART 1 (L1–40000)

Snapshot: 2026-05-20 · source `app/index.html` (87792 lines)

Declarations in this part: **649**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 126 | 139 | 135 | 14 | 10 | `safeJsonParse` | window fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140 | 149 | 145 | 10 | 6 | `esc` | window fn | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 150 | 14826 | 161 | 14677 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
| 14827 | 14853 | 14850 | 27 | 24 | `getStateCenter` | async fn | — | refs:17 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14854 | 14883 | 14858 | 30 | 5 | `getStateCenterSync` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14884 | 14892 | 14886 | 9 | 3 | `getStateEPDOWeights` | fn | — | refs:4 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 14893 | 14918 | 14930 | 26 | 38 | `getCurrentStateFips` | fn | — | refs:9 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 14919 | 15003 | 14919 | 85 | 1 | `known` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15004 | 15007 | 15007 | 4 | 4 | `dismissAppLoadingOverlay` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15008 | 15033 | 15011 | 26 | 4 | `updateLoadingStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15034 | 15151 | 15039 | 118 | 6 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15152 | 15164 | 15158 | 13 | 7 | `fireJurisdictionChanged` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15165 | 15184 | 15180 | 20 | 16 | `updateJurisdictionContext` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15185 | 15202 | 15196 | 18 | 12 | `restoreJurisdictionContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15203 | 15277 | 15267 | 75 | 65 | `buildJurisdictionContextFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 15278 | 15311 | 15307 | 34 | 30 | `getJurisdictionLabel` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 15312 | 15321 | 15316 | 10 | 5 | `getJurisdictionStateLabel` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 15322 | 15329 | 15325 | 8 | 4 | `getReportAgencyLabel` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 15330 | 15337 | 15333 | 8 | 4 | `getReportDeptLabel` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15338 | 15366 | 15350 | 29 | 13 | `getDataSourceLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 15367 | 15392 | 15372 | 26 | 6 | `isApiAvailableForState` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 15393 | 15394 | 15393 | 2 | 1 | `fetchWithTimeout` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15395 | 15415 | 15395 | 21 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15416 | 15450 | 15416 | 35 | 1 | `fetchWithRetry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15451 | 15484 | 15480 | 34 | 30 | `updateJurisdictionDropdownStatus` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 15485 | 15504 | 15500 | 20 | 16 | `loadCachedConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15505 | 15517 | 15513 | 13 | 9 | `saveConfigToCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15518 | 15564 | 15560 | 47 | 43 | `getMinimalFallbackConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15565 | 15568 | 15565 | 4 | 1 | `configReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15569 | 15576 | 15569 | 8 | 1 | `userDataReadyPromise` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15577 | 15588 | 15581 | 12 | 5 | `apply` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 15589 | 15682 | 15785 | 94 | 197 | `loadAppConfig` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15683 | 15789 | 15687 | 107 | 5 | `stateJurisCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 15790 | 15843 | 15841 | 54 | 52 | `showConfigNotification` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15844 | 15859 | 15857 | 16 | 14 | `loadAppSettings` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15860 | 15881 | 15876 | 22 | 17 | `loadApiKeys` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 15882 | 15913 | 15908 | 32 | 27 | `getActiveJurisdictionId` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 15914 | 15939 | 15932 | 26 | 19 | `_getDefaultJurisdictionForActiveState` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 15940 | 15964 | 15957 | 25 | 18 | `_fipsToStateKey` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 15965 | 15985 | 15971 | 21 | 7 | `_abbrToStateKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 15986 | 16045 | 16035 | 60 | 50 | `_getActiveStateKey` | fn | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 16046 | 16063 | 16053 | 18 | 8 | `_resolveActiveState` | fn | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 16064 | 16089 | 16082 | 26 | 19 | `getActiveRoadTypeSuffix` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 16090 | 16113 | 16111 | 24 | 22 | `updateRoadTypeLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16114 | 16204 | 16197 | 91 | 84 | `getDataFilePath` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16205 | 16227 | 16222 | 23 | 18 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 16228 | 16273 | 16311 | 46 | 84 | `populateStateDropdown` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16274 | 16274 | 16274 | 1 | 1 | `supported` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16275 | 16316 | 16275 | 42 | 1 | `others` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16317 | 16483 | 16477 | 167 | 161 | `handleStateSelection` | async fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 16484 | 16518 | 16649 | 35 | 166 | `applyDynamicStateConfig` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 16519 | 16655 | 16519 | 137 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16656 | 16670 | 16669 | 15 | 14 | `syncStateDropdownToDetected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 16671 | 16717 | 16778 | 47 | 108 | `populateJurisdictionDropdown` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 16718 | 16779 | 16718 | 62 | 1 | `hasMultiStateEntries` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 16780 | 16856 | 16855 | 77 | 76 | `loadSavedSelections` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 16857 | 17033 | 17027 | 177 | 171 | `saveJurisdictionSelection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17034 | 17107 | 17106 | 74 | 73 | `applyUserJurisdiction` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17108 | 17164 | 17157 | 57 | 50 | `applyJurisdictionSelection` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17165 | 17219 | 17212 | 55 | 48 | `autoDetectJurisdictionFromData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17220 | 17301 | 17296 | 82 | 77 | `autoDetectJurisdictionFromCoordinates` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 17302 | 17352 | 17346 | 51 | 45 | `applyAutoDetectedJurisdiction` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 17353 | 17373 | 17484 | 21 | 132 | `applyStateAdapterConfig` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17374 | 17491 | 17374 | 118 | 1 | `hasAnyStateTag` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 17492 | 17510 | 17502 | 19 | 11 | `_debouncedBridgeRefresh` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17511 | 17518 | 17517 | 8 | 7 | `syncRoadTypeFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 17519 | 17589 | 17581 | 71 | 63 | `saveFilterProfile` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 17590 | 17602 | 17600 | 13 | 11 | `_resetRoadTypeForTierChange` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 17603 | 17652 | 17650 | 50 | 48 | `saveUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17653 | 17704 | 17701 | 52 | 49 | `clearUserPreferences` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17705 | 17726 | 17724 | 22 | 20 | `forceRefreshAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 17727 | 17776 | 17774 | 50 | 48 | `showFilterLoadingState` | fn | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 17777 | 17783 | 17782 | 7 | 6 | `showRefreshButton` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 17784 | 17789 | 17788 | 6 | 5 | `getSelectedJurisdiction` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17790 | 17795 | 17794 | 6 | 5 | `getSelectedFilterProfile` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 17796 | 17805 | 17804 | 10 | 9 | `updateCurrentSelectionDisplay` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 17806 | 17992 | 17812 | 187 | 7 | `updateAppSubtitle` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 17993 | 18094 | 18092 | 102 | 100 | `updateDataConnectionStatus` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 18095 | 18108 | 18106 | 14 | 12 | `logConnectionEvent` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 18109 | 18119 | 18116 | 11 | 8 | `toggleCollapsibleCard` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 18120 | 18141 | 18133 | 22 | 14 | `apply` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 18142 | 18152 | 18150 | 11 | 9 | `refreshDataConnection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18153 | 18172 | 18164 | 20 | 12 | `reconnectData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18173 | 18293 | 18291 | 121 | 119 | `attemptDataReconnection` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 18294 | 18355 | 18334 | 62 | 41 | `monitorCrashStateChanges` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 18356 | 18381 | 18379 | 26 | 24 | `getConnectionDiagnostics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 18382 | 19248 | 18391 | 867 | 10 | `logConnectionDiagnostics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 19249 | 19286 | 19282 | 38 | 34 | `updateCacheStatusUI` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19287 | 19339 | 19331 | 53 | 45 | `restoreCrashStateFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 19340 | 19492 | 19488 | 153 | 149 | `loadSampleRowsInBackground` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19493 | 19626 | 19619 | 134 | 127 | `processSampleRowsFromText` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19627 | 19702 | 19698 | 76 | 72 | `processSampleRowsFromObjects` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 19703 | 19716 | 19712 | 14 | 10 | `parseRowForSampleData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19717 | 19755 | 19751 | 39 | 35 | `showBackgroundLoadingIndicator` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 19756 | 19766 | 19762 | 11 | 7 | `refreshMapAfterBackgroundLoad` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 19767 | 19805 | 19794 | 39 | 28 | `showCacheStats` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19806 | 19843 | 19837 | 38 | 32 | `saveMagisterialToCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19844 | 19890 | 19885 | 47 | 42 | `loadMagisterialFromCache` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 19891 | 19942 | 19922 | 52 | 32 | `clearMagisterialCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19943 | 19970 | 19966 | 28 | 24 | `showClearByDateDialog` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 19971 | 19986 | 19982 | 16 | 12 | `confirmClearAllWarrantData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 19987 | 20010 | 20006 | 24 | 20 | `attachSignalAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20011 | 20036 | 20032 | 26 | 22 | `attachStopSignAutoSaveTriggers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20037 | 20530 | 20055 | 494 | 19 | `attachRoundaboutAutoSaveTriggers` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 20531 | 20783 | 20535 | 253 | 5 | `throttledRecord` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 20784 | 20791 | 20790 | 8 | 7 | `showSecuritySettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20792 | 20798 | 20797 | 7 | 6 | `closeSecurityModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20799 | 20818 | 20817 | 20 | 19 | `updateSecurityOptionsUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20819 | 20823 | 20822 | 5 | 4 | `selectSecurityMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 20824 | 20830 | 20829 | 7 | 6 | `updateSecurityTimeout` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20831 | 20834 | 20833 | 4 | 3 | `extendKeySession` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20835 | 20838 | 20837 | 4 | 3 | `clearKeyNow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20839 | 20844 | 20843 | 6 | 5 | `clearAllApiKeysSecure` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 20845 | 20911 | 20847 | 67 | 3 | `dismissExitWarning` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 20912 | 20998 | 20922 | 87 | 11 | `getStateHSO` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 20999 | 20999 | 20999 | 1 | 1 | `isYes` | const arrow | — | refs:261 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21000 | 21001 | 21000 | 2 | 1 | `esc` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 21002 | 21003 | 21002 | 2 | 1 | `escJs` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21004 | 21004 | 21004 | 1 | 1 | `fmtTime` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21005 | 21005 | 21005 | 1 | 1 | `getHour` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21006 | 21011 | 21011 | 6 | 6 | `isIntersection` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21012 | 21012 | 21012 | 1 | 1 | `pct` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 21013 | 21013 | 21013 | 1 | 1 | `showLoading` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 21014 | 21032 | 21014 | 19 | 1 | `hideLoading` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 21033 | 21083 | 21081 | 51 | 49 | `renderPaginationControls` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 21084 | 21101 | 21099 | 18 | 16 | `changePageSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21102 | 21114 | 21112 | 13 | 11 | `getPaginatedData` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 21115 | 21128 | 21126 | 14 | 12 | `setPaginationData` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 21129 | 21137 | 21135 | 9 | 7 | `goToPage` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21138 | 21146 | 21145 | 9 | 8 | `parseMilitaryTime` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21147 | 21156 | 21155 | 10 | 9 | `timeToMinutes` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21157 | 21166 | 21163 | 10 | 7 | `clearDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21167 | 21175 | 21173 | 9 | 7 | `toggleSidebarSection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21176 | 21206 | 21200 | 31 | 25 | `toggleMobileSidebar` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 21207 | 21227 | 21225 | 21 | 19 | `toggleSidebarCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21228 | 21244 | 21242 | 17 | 15 | `loadSidebarCollapseState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21245 | 21301 | 21299 | 57 | 55 | `initSidebarTooltips` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21302 | 21311 | 21309 | 10 | 8 | `saveSidebarState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21312 | 21345 | 21337 | 34 | 26 | `loadSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21346 | 21353 | 21351 | 8 | 6 | `getOrgSettings` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 21354 | 21368 | 21366 | 15 | 13 | `saveOrgSettings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21369 | 21387 | 21385 | 19 | 17 | `getReportAttribution` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 21388 | 21395 | 21393 | 8 | 6 | `updateOrgSettingsPreview` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21396 | 21459 | 21457 | 64 | 62 | `showSidebarSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21460 | 21472 | 21470 | 13 | 11 | `clearOrgSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21473 | 21485 | 21484 | 13 | 12 | `initOrgSettingsInForms` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21486 | 21490 | 21489 | 5 | 4 | `closeSidebarSettings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21491 | 21504 | 21503 | 14 | 13 | `resetSidebarState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21505 | 21512 | 21511 | 8 | 7 | `expandAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21513 | 21532 | 21519 | 20 | 7 | `collapseAllSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21533 | 21559 | 21535 | 27 | 3 | `updateHeaderHeight` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21560 | 21576 | 21575 | 17 | 16 | `handleSwipe` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21577 | 21583 | 21577 | 7 | 1 | `closeModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 21584 | 21601 | 21599 | 18 | 16 | `handleFileDrop` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21602 | 21609 | 21607 | 8 | 6 | `handleFileSelect` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 21610 | 21632 | 21630 | 23 | 21 | `resetUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21633 | 21640 | 21638 | 8 | 6 | `_getUploadFileType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21641 | 21647 | 21645 | 7 | 5 | `_decompressGzipToText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21648 | 21684 | 21682 | 37 | 35 | `_parseParquetGz` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21685 | 21732 | 21730 | 48 | 46 | `processUploadedFile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21733 | 21749 | 21747 | 17 | 15 | `_processCsvGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21750 | 21767 | 21765 | 18 | 16 | `_processParquetGzUpload` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21768 | 21778 | 21776 | 11 | 9 | `_showUploadError` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 21779 | 21810 | 21808 | 32 | 30 | `_processRowObjects` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21811 | 21858 | 21856 | 48 | 46 | `_parseCsvText` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21859 | 21893 | 21887 | 35 | 29 | `_onUploadComplete` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 21894 | 21899 | 21897 | 6 | 4 | `triggerMergeUpload` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21900 | 21909 | 21907 | 10 | 8 | `handleMergeFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 21910 | 21935 | 21933 | 26 | 24 | `buildExistingDedupKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 21936 | 22144 | 22108 | 209 | 173 | `mergeUploadedFile` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22145 | 22151 | 22147 | 7 | 3 | `_r2RoadTypeIsAllRoads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 22152 | 22199 | 22193 | 48 | 42 | `_r2AllRoadsPathForActiveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 22200 | 22234 | 22227 | 35 | 28 | `_r2RowMatchesRoadType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 22235 | 22249 | 23018 | 15 | 784 | `autoLoadCrashData` | async fn | — | refs:31 | Bootstrap | `app/modules/app/bootstrap.js` |
| 22250 | 22580 | 22252 | 331 | 3 | `check` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 22581 | 23022 | 22598 | 442 | 18 | `fetchWithR2Retry` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23023 | 23091 | 23087 | 69 | 65 | `_onAutoLoadComplete` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23092 | 23122 | 23120 | 31 | 29 | `_autoLoadMainThreadFallback` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23123 | 23154 | 23153 | 32 | 31 | `showAutoLoadFallback` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 23155 | 23168 | 23167 | 14 | 13 | `showLoadError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23169 | 23348 | 23346 | 180 | 178 | `resetState` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 23349 | 23352 | 23351 | 4 | 3 | `parseCrashDateToTimestamp` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 23353 | 23566 | 23565 | 214 | 213 | `processRow` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 23567 | 23589 | 23577 | 23 | 11 | `finalizeData` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 23590 | 23596 | 23596 | 7 | 7 | `_formatBytes` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 23597 | 23618 | 23618 | 22 | 22 | `setLoadProgress` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 23619 | 23630 | 23630 | 12 | 12 | `setLoadIndeterminate` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 23631 | 23650 | 23649 | 20 | 19 | `updateProgress` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 23651 | 23695 | 23694 | 45 | 44 | `showUploadSummary` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 23696 | 23696 | 23737 | 1 | 42 | `initDropdowns` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 23697 | 23697 | 23697 | 1 | 1 | `yearOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23698 | 23699 | 23698 | 2 | 1 | `routeOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23700 | 23715 | 23700 | 16 | 1 | `intOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23716 | 23739 | 23716 | 24 | 1 | `trafficCtrlOpts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23740 | 23752 | 23750 | 13 | 11 | `initReportLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23753 | 23781 | 23779 | 29 | 27 | `updateReportLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23782 | 23795 | 23802 | 14 | 21 | `updateReportLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23796 | 23804 | 23796 | 9 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 23805 | 23813 | 23811 | 9 | 7 | `initFilterLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 23814 | 23831 | 23825 | 18 | 12 | `updateFilterLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 23832 | 23889 | 23883 | 58 | 52 | `loadGrantsCSV` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 23890 | 23994 | 23992 | 105 | 103 | `getStateGrantPrograms` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 23995 | 24001 | 24016 | 7 | 22 | `getAllGrants` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 24002 | 24018 | 24010 | 17 | 9 | `filtered` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24019 | 24026 | 24024 | 8 | 6 | `_getAllGrantsLegacy` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 24027 | 24028 | 24037 | 2 | 11 | `findGrantById` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24029 | 24032 | 24029 | 4 | 1 | `found` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24033 | 24038 | 24033 | 6 | 1 | `csvFound` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24039 | 24070 | 24067 | 32 | 29 | `displayStateGrants` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 24071 | 24082 | 24081 | 12 | 11 | `_renderGrantDeadline` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24083 | 24117 | 24116 | 35 | 34 | `renderGrantCard` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24118 | 24119 | 24118 | 2 | 1 | `applyGrantFilters` | fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 24120 | 24122 | 24139 | 3 | 20 | `applyGrantFiltersToList` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24123 | 24131 | 24123 | 9 | 1 | `focusChecks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24132 | 24133 | 24132 | 2 | 1 | `grantFocus` | const arrow | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24134 | 24140 | 24134 | 7 | 1 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24141 | 24146 | 24145 | 6 | 5 | `updateGrantFilterInfo` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24147 | 24155 | 24154 | 9 | 8 | `toggleFavorite` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24156 | 24159 | 24158 | 4 | 3 | `updateFavoritesCount` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 24160 | 24162 | 24169 | 3 | 10 | `displayFavorites` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24163 | 24179 | 24163 | 17 | 1 | `favoriteGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24180 | 24186 | 24185 | 7 | 6 | `updateGrantEPDOIndicator` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 24187 | 24223 | 24219 | 37 | 33 | `updateGrantsTabForState` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24224 | 24239 | 24235 | 16 | 12 | `updateGrantAgencyFilter` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 24240 | 24257 | 24255 | 18 | 16 | `updateGrantQuickLinks` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24258 | 24318 | 24559 | 61 | 302 | `rankLocationsForGrants` | async fn | — | refs:9 | Grants | `app/modules/grants/grants.js` |
| 24319 | 24424 | 24327 | 106 | 9 | `filteredRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24425 | 24434 | 24429 | 10 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24435 | 24512 | 24435 | 78 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24513 | 24568 | 24517 | 56 | 5 | `matchingGrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24569 | 24597 | 24707 | 29 | 139 | `_loadGrantsFromMatview` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 24598 | 24708 | 24619 | 111 | 22 | `ranked` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24709 | 24757 | 24756 | 49 | 48 | `showScoringProfileHelp` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24758 | 24761 | 24811 | 4 | 54 | `openADTInputModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24762 | 24812 | 24771 | 51 | 10 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 24813 | 24845 | 24840 | 33 | 28 | `saveADTData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24846 | 24873 | 24872 | 28 | 27 | `openAadtImportModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 24874 | 24874 | 24899 | 1 | 26 | `_parseAadtCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24875 | 24876 | 24875 | 2 | 1 | `lines` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24877 | 24900 | 24877 | 24 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 24901 | 24941 | 24937 | 41 | 37 | `submitAadtImport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 24942 | 25106 | 24970 | 165 | 29 | `loadAadtCoverageBanner` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 25107 | 25140 | 25134 | 34 | 28 | `loadNotificationPreferences` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25141 | 25159 | 25157 | 19 | 17 | `_isApiBackendAvailable` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 25160 | 25211 | 25209 | 52 | 50 | `_loadPreferencesFromFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25212 | 25229 | 25227 | 18 | 16 | `saveNotificationPreferences` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 25230 | 25261 | 25268 | 32 | 39 | `_syncPreferencesToFirestore` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25262 | 25270 | 25262 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25271 | 25281 | 25324 | 11 | 54 | `syncScheduleToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25282 | 25317 | 25282 | 36 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 25318 | 25326 | 25318 | 9 | 1 | `err` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25327 | 25357 | 25373 | 31 | 47 | `loadSchedulesFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25358 | 25375 | 25358 | 18 | 1 | `localAddresses` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25376 | 25401 | 25399 | 26 | 24 | `mergeSubscribers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25402 | 25416 | 25414 | 15 | 13 | `_getSubscriberR2Path` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 25417 | 25480 | 25478 | 64 | 62 | `syncSubscribersToR2` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 25481 | 25562 | 25560 | 82 | 80 | `loadSubscribersFromR2` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 25563 | 25590 | 26255 | 28 | 693 | `openEmailNotificationModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 25591 | 25604 | 25593 | 14 | 3 | `reportTypeOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25605 | 25617 | 25609 | 13 | 5 | `deadlineDaysOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 25618 | 26258 | 25620 | 641 | 3 | `timezoneOptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26259 | 26277 | 26275 | 19 | 17 | `showNotifTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26278 | 26278 | 26302 | 1 | 25 | `syncFromStandardReportsTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26279 | 26294 | 26283 | 16 | 5 | `syncVal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26295 | 26304 | 26295 | 10 | 1 | `opts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26305 | 26312 | 26311 | 8 | 7 | `updateEmailLocationVisibility` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 26313 | 26318 | 26317 | 6 | 5 | `toggleReportScheduleOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26319 | 26324 | 26323 | 6 | 5 | `toggleGrantAlertOptions` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 26325 | 26329 | 26328 | 5 | 4 | `toggleDigestOptions` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 26330 | 26338 | 26336 | 9 | 7 | `updateFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26339 | 26344 | 26343 | 6 | 5 | `updateGrantDeliveryModeUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26345 | 26352 | 26351 | 8 | 7 | `updateGrantFrequencyUI` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 26353 | 26383 | 26381 | 31 | 29 | `calculateGrantNextDelivery` | fn | — | refs:7 | Grants | `app/modules/grants/grants.js` |
| 26384 | 26400 | 26398 | 17 | 15 | `toggleBrevoConfigSource` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 26401 | 26452 | 26450 | 52 | 50 | `checkCoolifyBrevoStatus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26453 | 26492 | 26490 | 40 | 38 | `setEmailTimeFrame` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 26493 | 26499 | 26497 | 7 | 5 | `updateDeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26500 | 26543 | 26531 | 44 | 32 | `calculateNextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 26544 | 26572 | 26570 | 29 | 27 | `injectEmailChipStyles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26573 | 26574 | 26704 | 2 | 132 | `saveEmailNotificationSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26575 | 26575 | 26575 | 1 | 1 | `getEl` | const arrow | — | refs:4258 | Unassigned | `app/modules/app/unassigned.js` |
| 26576 | 26579 | 26579 | 4 | 4 | `getVal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 26580 | 26712 | 26583 | 133 | 4 | `getChecked` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 26713 | 26783 | 26781 | 71 | 69 | `syncEmailScheduleToSupabase` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26784 | 26816 | 26814 | 33 | 31 | `showEmailSuccessPopup` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26817 | 26823 | 26821 | 7 | 5 | `toggleBrevoKeyVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26824 | 26856 | 26871 | 33 | 48 | `verifyBrevoConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26857 | 26873 | 26857 | 17 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26874 | 26878 | 27166 | 5 | 293 | `testEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26879 | 26913 | 26879 | 35 | 1 | `allRecipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 26914 | 26994 | 26916 | 81 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 26995 | 27136 | 27046 | 142 | 52 | `buildEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27137 | 27168 | 27137 | 32 | 1 | `errData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27169 | 27193 | 27191 | 25 | 23 | `showBrevoToast` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 27194 | 27293 | 27194 | 100 | 1 | `generateGrantSummaryEmail` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27294 | 27351 | 27294 | 58 | 1 | `programs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27352 | 27365 | 27452 | 14 | 101 | `testGrantEmailNotification` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27366 | 27454 | 27368 | 89 | 3 | `resetTestBtn` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27455 | 27499 | 27498 | 45 | 44 | `showNotificationHistory` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 27500 | 27509 | 27507 | 10 | 8 | `clearNotificationHistory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27510 | 27541 | 27532 | 32 | 23 | `getNotificationSummary` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 27542 | 27622 | 27542 | 81 | 1 | `generateReportForEmail` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27623 | 27656 | 27728 | 34 | 106 | `displayGrantLocations` | fn | — | refs:16 | Grants | `app/modules/grants/grants.js` |
| 27657 | 27730 | 27662 | 74 | 6 | `getTierStyle` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 27731 | 27736 | 27734 | 6 | 4 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 27737 | 27765 | 27764 | 29 | 28 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 27766 | 27778 | 27777 | 13 | 12 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27779 | 27787 | 27786 | 9 | 8 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27788 | 27795 | 27794 | 8 | 7 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27796 | 27802 | 27801 | 7 | 6 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27803 | 27829 | 27843 | 27 | 41 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 27830 | 27844 | 27830 | 15 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27845 | 27903 | 27897 | 59 | 53 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 27904 | 27943 | 27904 | 40 | 1 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 27944 | 27993 | 27944 | 50 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 27994 | 28011 | 28009 | 18 | 16 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 28012 | 28068 | 28067 | 57 | 56 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28069 | 28081 | 28090 | 13 | 22 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28082 | 28091 | 28082 | 10 | 1 | `names` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28092 | 28099 | 28098 | 8 | 7 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28100 | 28111 | 28114 | 12 | 15 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28112 | 28115 | 28112 | 4 | 1 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 28116 | 28130 | 28129 | 15 | 14 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28131 | 28145 | 28142 | 15 | 12 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 28146 | 28161 | 28160 | 16 | 15 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 28162 | 28258 | 28257 | 97 | 96 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 28259 | 28322 | 28272 | 64 | 14 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 28323 | 28331 | 28326 | 9 | 4 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 28332 | 28351 | 28349 | 20 | 18 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 28352 | 28355 | 28354 | 4 | 3 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 28356 | 28382 | 28371 | 27 | 16 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 28383 | 28399 | 28395 | 17 | 13 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 28400 | 28513 | 28512 | 114 | 113 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 28514 | 29053 | 29052 | 540 | 539 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29054 | 29502 | 29616 | 449 | 563 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 29503 | 29617 | 29503 | 115 | 1 | `contentParagraphs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 29618 | 29705 | 29842 | 88 | 225 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 29706 | 29843 | 29724 | 138 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 29844 | 30041 | 29846 | 198 | 3 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30042 | 30108 | 30179 | 67 | 138 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30109 | 30156 | 30109 | 48 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 30157 | 30815 | 30172 | 659 | 16 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30816 | 30868 | 30947 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30869 | 30907 | 30871 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30908 | 30957 | 30908 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 30958 | 30966 | 31108 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 30967 | 30989 | 30971 | 23 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 30990 | 31112 | 30990 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31113 | 31204 | 31233 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31205 | 31213 | 31205 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31214 | 31235 | 31214 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31236 | 31243 | 31242 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31244 | 31251 | 31249 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31252 | 31271 | 31269 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 31272 | 31291 | 31290 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 31292 | 31299 | 31298 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31300 | 31307 | 31306 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31308 | 31311 | 31310 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31312 | 31315 | 31314 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 31316 | 31334 | 31333 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31335 | 31357 | 31353 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 31358 | 31426 | 31420 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31427 | 31439 | 31438 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31440 | 31449 | 31448 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31450 | 31467 | 31466 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 31468 | 31488 | 31487 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 31489 | 31495 | 31513 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 31496 | 31514 | 31496 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31515 | 31524 | 31523 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31525 | 31540 | 31565 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31541 | 31566 | 31541 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31567 | 31593 | 31588 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 31594 | 31601 | 31600 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31602 | 31608 | 31607 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31609 | 31622 | 31621 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31623 | 31626 | 31625 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31627 | 31646 | 31645 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31647 | 31666 | 31665 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 31667 | 31671 | 31670 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31672 | 31682 | 31681 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31683 | 31712 | 31711 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31713 | 31785 | 31904 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31786 | 31790 | 31786 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31791 | 31796 | 31791 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31797 | 31805 | 31797 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31806 | 31814 | 31806 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31815 | 31820 | 31815 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31821 | 31905 | 31821 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 31906 | 31918 | 32056 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 31919 | 32057 | 31919 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32058 | 32078 | 32076 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32079 | 32112 | 32111 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 32113 | 32126 | 32124 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32127 | 32198 | 32196 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32199 | 32241 | 32239 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32242 | 32310 | 32466 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32311 | 32470 | 32329 | 160 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 32471 | 32506 | 32505 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32507 | 32517 | 32516 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32518 | 32522 | 32521 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32523 | 32528 | 32526 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 32529 | 32571 | 32569 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32572 | 32614 | 32612 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 32615 | 32659 | 32657 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32660 | 32712 | 32710 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 32713 | 32717 | 32736 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 32718 | 32728 | 32718 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32729 | 32753 | 32729 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32754 | 32767 | 32930 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 32768 | 32860 | 32775 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 32861 | 32861 | 32861 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32862 | 32932 | 32864 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 32933 | 32963 | 33286 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 32964 | 33006 | 32971 | 43 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 33007 | 33012 | 33010 | 6 | 4 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 33013 | 33027 | 33025 | 15 | 13 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 33028 | 33047 | 33045 | 20 | 18 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33048 | 33057 | 33055 | 10 | 8 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 33058 | 33066 | 33064 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 33067 | 33093 | 33091 | 27 | 25 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 33094 | 33146 | 33144 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 33147 | 33287 | 33159 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 33288 | 33326 | 33325 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33327 | 33451 | 33449 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33452 | 33503 | 33822 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33504 | 33575 | 33504 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33576 | 33580 | 33576 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33581 | 33693 | 33588 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33694 | 33747 | 33700 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33748 | 33798 | 33748 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33799 | 33802 | 33799 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33803 | 33823 | 33809 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33824 | 33844 | 33843 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33845 | 33858 | 33856 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33859 | 33884 | 33875 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 33885 | 33896 | 33895 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33897 | 33903 | 33902 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33904 | 33914 | 33913 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 33915 | 33935 | 33934 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 33936 | 33945 | 33944 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 33946 | 33950 | 33949 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 33951 | 33957 | 34003 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 33958 | 33958 | 33958 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 33959 | 34004 | 33959 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34005 | 34009 | 34008 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 34010 | 34031 | 34040 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 34032 | 34041 | 34032 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34042 | 34071 | 34061 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 34072 | 34092 | 34090 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 34093 | 34113 | 34111 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 34114 | 34118 | 34116 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34119 | 34180 | 34151 | 62 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34181 | 34190 | 34199 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 34191 | 34205 | 34191 | 15 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34206 | 34215 | 34224 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34216 | 34226 | 34216 | 11 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 34227 | 34242 | 34234 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 34243 | 34245 | 34263 | 3 | 21 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 34246 | 34256 | 34253 | 11 | 8 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34257 | 34268 | 34260 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34269 | 34326 | 34361 | 58 | 93 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34327 | 34368 | 34330 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 34369 | 34380 | 34490 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34381 | 34492 | 34390 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34493 | 34515 | 34514 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 34516 | 34547 | 34545 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34548 | 34586 | 34582 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 34587 | 34624 | 34609 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 34625 | 34634 | 34632 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 34635 | 34655 | 34642 | 21 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 34656 | 34734 | 34728 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 34735 | 34740 | 34739 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34741 | 34751 | 35000 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 34752 | 34752 | 34752 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34753 | 34948 | 34753 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 34949 | 34968 | 34992 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 34969 | 35006 | 34981 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35007 | 35026 | 35035 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35027 | 35036 | 35027 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35037 | 35183 | 35181 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35184 | 35239 | 35238 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35240 | 35317 | 35359 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 35318 | 35360 | 35321 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 35361 | 35373 | 35426 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35374 | 35427 | 35411 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35428 | 35469 | 35442 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35470 | 35519 | 35517 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 35520 | 35532 | 35530 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35533 | 35546 | 35544 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35547 | 35566 | 35564 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35567 | 35600 | 35598 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 35601 | 35618 | 35609 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35619 | 35637 | 35636 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 35638 | 35684 | 35645 | 47 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 35685 | 35700 | 35694 | 16 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35701 | 35724 | 35716 | 24 | 16 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35725 | 35755 | 35745 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35756 | 35816 | 35781 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 35817 | 35881 | 35877 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 35882 | 35930 | 35913 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 35931 | 35960 | 35952 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 35961 | 36019 | 35998 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36020 | 36022 | 36066 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36023 | 36033 | 36032 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36034 | 36071 | 36047 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36072 | 36083 | 36077 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36084 | 36166 | 36159 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36167 | 36222 | 36213 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36223 | 36258 | 36252 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36259 | 36280 | 36278 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36281 | 36345 | 36290 | 65 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36346 | 36417 | 36416 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 36418 | 36422 | 36420 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36423 | 36451 | 36449 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 36452 | 36484 | 36510 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36485 | 36496 | 36487 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36497 | 36512 | 36503 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36513 | 36590 | 36588 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 36591 | 36602 | 36659 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36603 | 36625 | 36605 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36626 | 36633 | 36626 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36634 | 36661 | 36634 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36662 | 36675 | 36673 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36676 | 36708 | 36700 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36709 | 36768 | 36766 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36769 | 36792 | 36790 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 36793 | 36874 | 36869 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 36875 | 36933 | 36914 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 36934 | 36967 | 36934 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 36968 | 36991 | 36968 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 36992 | 37009 | 36995 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37010 | 37037 | 37010 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37038 | 37039 | 37038 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37040 | 37040 | 37040 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37041 | 37055 | 37041 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37056 | 37074 | 37059 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37075 | 37099 | 37095 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37100 | 37113 | 37109 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37114 | 37117 | 37132 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 37118 | 37118 | 37118 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37119 | 37143 | 37119 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37144 | 37189 | 37174 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 37190 | 37364 | 37418 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37365 | 37420 | 37365 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37421 | 37424 | 37423 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37425 | 37431 | 37430 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37432 | 37460 | 37459 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37461 | 37461 | 37476 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37462 | 37467 | 37464 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37468 | 37468 | 37468 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37469 | 37471 | 37469 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37472 | 37485 | 37472 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37486 | 37507 | 37566 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37508 | 37520 | 37510 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37521 | 37567 | 37527 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37568 | 37572 | 37629 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37573 | 37595 | 37575 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37596 | 37596 | 37596 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37597 | 37600 | 37597 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37601 | 37630 | 37601 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37631 | 37640 | 37639 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37641 | 37679 | 37678 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 37680 | 37709 | 37701 | 30 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 37710 | 37720 | 37718 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37721 | 37735 | 37733 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37736 | 37744 | 37753 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37745 | 37756 | 37745 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 37757 | 37761 | 37759 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 37762 | 37778 | 37776 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37779 | 37789 | 37787 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37790 | 37802 | 37800 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37803 | 37818 | 37817 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37819 | 37882 | 37823 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 37883 | 37996 | 37994 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 37997 | 38005 | 38004 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38006 | 38016 | 38015 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38017 | 38033 | 38032 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38034 | 38059 | 38058 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38060 | 38065 | 38064 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38066 | 38076 | 38075 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38077 | 38086 | 38085 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38087 | 38093 | 38092 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38094 | 38123 | 38122 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38124 | 38152 | 38151 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38153 | 38167 | 38166 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38168 | 38197 | 38189 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38198 | 38207 | 38203 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38208 | 38215 | 38211 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38216 | 38228 | 38224 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38229 | 38272 | 38268 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38273 | 38282 | 38278 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38283 | 38318 | 38314 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38319 | 38329 | 38325 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38330 | 38370 | 38366 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38371 | 38381 | 38377 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38382 | 38407 | 38406 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38408 | 38450 | 38449 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38451 | 38505 | 38492 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 38506 | 38526 | 38525 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38527 | 38545 | 38541 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38546 | 38571 | 38567 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38572 | 38632 | 38631 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38633 | 38718 | 38755 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38719 | 38719 | 38719 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38720 | 38727 | 38720 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38728 | 38756 | 38728 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 38757 | 38774 | 38773 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 38775 | 38793 | 38792 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 38794 | 38800 | 38799 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 38801 | 38807 | 38806 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38808 | 38815 | 38814 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38816 | 38862 | 38861 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 38863 | 38915 | 38910 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 38916 | 39080 | 39079 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39081 | 39084 | 39083 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 39085 | 39103 | 39182 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 39104 | 39185 | 39110 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39186 | 39199 | 39317 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 39200 | 39230 | 39206 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39231 | 39235 | 39231 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39236 | 39239 | 39238 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39240 | 39240 | 39240 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39241 | 39319 | 39241 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39320 | 39333 | 39453 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 39334 | 39364 | 39340 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39365 | 39379 | 39365 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39380 | 39380 | 39380 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39381 | 39455 | 39381 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39456 | 39482 | 39532 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39483 | 39535 | 39483 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39536 | 39702 | 39700 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 39703 | 39709 | 39707 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39710 | 39713 | 39770 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39714 | 39731 | 39714 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39732 | 39734 | 39732 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39735 | 39743 | 39735 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39744 | 39772 | 39744 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 39773 | 39821 | 39819 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39822 | 39826 | 39824 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39827 | 39831 | 39829 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 39832 | 39871 | 39869 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 39872 | 39892 | 39891 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 39893 | 39904 | 39903 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39905 | 39916 | 39956 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 39917 | 39932 | 39931 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39933 | 39984 | 39933 | 52 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 39985 | 39989 | 40275 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 39990 | 39997 | 39995 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 39998 | 40205 | 40003 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
