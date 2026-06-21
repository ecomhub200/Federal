# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (87792 lines)

Declarations in this part: **235**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80016 | 80027 | 80023 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80028 | 80036 | 80032 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80037 | 80074 | 80070 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80075 | 80089 | 80085 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80090 | 80110 | 80106 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80111 | 80123 | 80119 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80124 | 80136 | 80132 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80137 | 80166 | 80162 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 80167 | 80187 | 80183 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80188 | 80194 | 80190 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80195 | 80245 | 80241 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80246 | 80279 | 80275 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80280 | 80299 | 80294 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80300 | 80425 | 80420 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80426 | 80489 | 80485 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80490 | 80501 | 80496 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80502 | 80531 | 80530 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80532 | 80542 | 80541 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 80543 | 80553 | 80552 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80554 | 80564 | 80563 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 80565 | 80575 | 80574 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80576 | 80583 | 80582 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 80584 | 80600 | 80595 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80601 | 80603 | 80632 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80604 | 80633 | 80610 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80634 | 80650 | 80649 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80651 | 80676 | 80675 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80677 | 80699 | 80698 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80700 | 80717 | 80716 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80718 | 80728 | 80723 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80729 | 80740 | 80739 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80741 | 80760 | 80759 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 80761 | 80795 | 80790 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80796 | 80812 | 80811 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80813 | 80868 | 80867 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80869 | 80920 | 80919 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80921 | 80971 | 80990 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80972 | 80991 | 80974 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80992 | 81009 | 81025 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81010 | 81026 | 81010 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81027 | 81053 | 81052 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81054 | 81062 | 81097 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81063 | 81098 | 81066 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81099 | 81102 | 81112 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81103 | 81105 | 81105 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81106 | 81113 | 81110 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81114 | 81133 | 81132 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81134 | 81139 | 81162 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81140 | 81163 | 81142 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81164 | 81177 | 81176 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81178 | 81184 | 81183 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81185 | 81189 | 81188 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81190 | 81244 | 81243 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81245 | 81303 | 81302 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81304 | 81330 | 81329 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81331 | 81336 | 81335 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81337 | 81342 | 81347 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81343 | 81348 | 81343 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81349 | 81397 | 81392 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81398 | 81398 | 81537 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 81399 | 81448 | 81399 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81449 | 81545 | 81449 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81546 | 81580 | 81641 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 81581 | 81643 | 81581 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81644 | 81655 | 81650 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81656 | 81666 | 81721 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 81667 | 81722 | 81670 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81723 | 81733 | 81913 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 81734 | 81743 | 81736 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81744 | 81792 | 81744 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81793 | 81793 | 81793 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81794 | 81794 | 81794 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81795 | 81805 | 81795 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81806 | 81807 | 81806 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81808 | 81808 | 81808 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81809 | 81810 | 81809 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81811 | 81811 | 81811 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81812 | 81918 | 81812 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81919 | 81922 | 81939 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81923 | 81946 | 81923 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81947 | 81957 | 82003 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81958 | 82004 | 81960 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82005 | 82009 | 82008 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82010 | 82020 | 82019 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 82021 | 82036 | 82035 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 82037 | 82041 | 82040 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82042 | 82057 | 82052 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 82058 | 82072 | 82071 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82073 | 82082 | 82081 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82083 | 82095 | 82094 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82096 | 82107 | 82116 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82108 | 82117 | 82108 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82118 | 82139 | 82138 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82140 | 82168 | 82167 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82169 | 82176 | 82256 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82177 | 82188 | 82177 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82189 | 82202 | 82192 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82203 | 82241 | 82240 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 82242 | 82263 | 82242 | 22 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 82264 | 82307 | 82306 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82308 | 82313 | 82400 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 82314 | 82401 | 82314 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82402 | 82408 | 82407 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 82409 | 82412 | 82425 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82413 | 82430 | 82413 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82431 | 82431 | 82458 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82432 | 82453 | 82432 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82454 | 82466 | 82454 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82467 | 82517 | 82749 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 82518 | 82586 | 82526 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82587 | 82615 | 82605 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82616 | 82665 | 82625 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82666 | 82674 | 82673 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 82675 | 82750 | 82682 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82751 | 82769 | 82767 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82770 | 82902 | 82786 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82903 | 82928 | 82915 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82929 | 82943 | 82942 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82944 | 83008 | 83007 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83009 | 83061 | 83060 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83062 | 83069 | 83068 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 83070 | 83081 | 83080 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83082 | 83134 | 83114 | 53 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83135 | 83204 | 83194 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83205 | 83234 | 83214 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 83235 | 83303 | 83274 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83304 | 83311 | 83310 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83312 | 83348 | 83343 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83349 | 83369 | 83352 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83370 | 83382 | 83378 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83383 | 83460 | 83455 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 83461 | 83478 | 83465 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83479 | 83502 | 83498 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 83503 | 83510 | 83506 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83511 | 83523 | 83816 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 83524 | 83530 | 83524 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83531 | 83639 | 83531 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83640 | 83650 | 83646 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83651 | 83708 | 83703 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83709 | 83823 | 83709 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83824 | 83842 | 84048 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 83843 | 83915 | 83845 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83916 | 84052 | 83918 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84053 | 84071 | 84067 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 84072 | 84111 | 84106 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84112 | 84126 | 84121 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84127 | 84127 | 84174 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84128 | 84131 | 84128 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84132 | 84182 | 84135 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84183 | 84191 | 84497 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84192 | 84210 | 84192 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84211 | 84346 | 84231 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84347 | 84368 | 84347 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84369 | 84385 | 84377 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 84386 | 84410 | 84393 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 84411 | 84501 | 84414 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84502 | 84524 | 84520 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84525 | 84527 | 84566 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84528 | 84570 | 84528 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84571 | 84572 | 84617 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84573 | 84586 | 84573 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84587 | 84625 | 84604 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84626 | 84631 | 84848 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84632 | 84685 | 84637 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84686 | 84702 | 84694 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 84703 | 84774 | 84710 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 84775 | 84821 | 84778 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84822 | 84824 | 84822 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84825 | 84852 | 84828 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84853 | 84881 | 84877 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84882 | 84883 | 84910 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84884 | 84914 | 84888 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84915 | 84916 | 84959 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84917 | 84933 | 84921 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84934 | 84980 | 84947 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84981 | 85018 | 85014 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85019 | 85054 | 85050 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85055 | 85072 | 85068 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85073 | 85090 | 85086 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 85091 | 85102 | 85096 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85103 | 85186 | 85409 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85187 | 85207 | 85191 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85208 | 85226 | 85208 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 85227 | 85237 | 85235 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85238 | 85304 | 85298 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85305 | 85323 | 85312 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85324 | 85413 | 85329 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85414 | 85427 | 85469 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85428 | 85473 | 85428 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85474 | 85536 | 85532 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85537 | 85571 | 85541 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85572 | 85610 | 85589 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85611 | 85620 | 85616 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85621 | 85701 | 85696 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 85702 | 85709 | 85704 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85710 | 85734 | 85715 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85735 | 85748 | 85737 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85749 | 85765 | 85792 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85766 | 85796 | 85766 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85797 | 85814 | 85810 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 85815 | 85822 | 85818 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85823 | 85839 | 85835 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 85840 | 85876 | 85872 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85877 | 85902 | 85924 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85903 | 85931 | 85914 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85932 | 85991 | 85985 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85992 | 86039 | 86034 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86040 | 86044 | 86113 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86045 | 86117 | 86045 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86118 | 86142 | 86138 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86143 | 86238 | 86234 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86239 | 86254 | 86488 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 86255 | 86373 | 86258 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86374 | 86492 | 86434 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86493 | 86538 | 86534 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86539 | 86550 | 86546 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86551 | 86564 | 86560 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86565 | 86600 | 86594 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86601 | 86651 | 86646 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86652 | 86729 | 86718 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86730 | 86757 | 86795 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86758 | 86813 | 86760 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86814 | 86832 | 86828 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86833 | 86876 | 86864 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 86877 | 86883 | 86879 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 86884 | 86942 | 86938 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 86943 | 86950 | 87001 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 86951 | 87005 | 86951 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87006 | 87056 | 87095 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87057 | 87077 | 87060 | 21 | 4 | `setVal` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 87078 | 87107 | 87085 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87108 | 87137 | 87133 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 87138 | 87173 | 87143 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 87174 | 87677 | 87209 | 504 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 87678 | 87792 | 87684 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
