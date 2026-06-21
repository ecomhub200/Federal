# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (88651 lines)

Declarations in this part: **247**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80137 | 80186 | 80182 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80187 | 80294 | 80287 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 80295 | 80339 | 80334 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80340 | 80454 | 80448 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80455 | 80517 | 80511 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80518 | 80618 | 80614 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80619 | 80716 | 80712 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 80717 | 80727 | 80723 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 80728 | 80785 | 80781 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80786 | 80796 | 80792 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80797 | 80839 | 80835 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80840 | 80874 | 80870 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80875 | 80886 | 80882 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80887 | 80895 | 80891 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80896 | 80933 | 80929 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80934 | 80948 | 80944 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80949 | 80969 | 80965 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80970 | 80982 | 80978 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80983 | 80995 | 80991 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80996 | 81025 | 81021 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81026 | 81046 | 81042 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81047 | 81053 | 81049 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81054 | 81104 | 81100 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81105 | 81138 | 81134 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81139 | 81158 | 81153 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81159 | 81284 | 81279 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81285 | 81348 | 81344 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81349 | 81360 | 81355 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81361 | 81390 | 81389 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81391 | 81401 | 81400 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 81402 | 81412 | 81411 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81413 | 81423 | 81422 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81424 | 81434 | 81433 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81435 | 81442 | 81441 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 81443 | 81459 | 81454 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81460 | 81462 | 81491 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81463 | 81492 | 81469 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81493 | 81509 | 81508 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81510 | 81535 | 81534 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81536 | 81558 | 81557 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81559 | 81576 | 81575 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81577 | 81587 | 81582 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81588 | 81599 | 81598 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81600 | 81619 | 81618 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 81620 | 81654 | 81649 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 81655 | 81671 | 81670 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81672 | 81727 | 81726 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81728 | 81779 | 81778 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81780 | 81830 | 81849 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81831 | 81850 | 81833 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81851 | 81868 | 81884 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81869 | 81885 | 81869 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81886 | 81912 | 81911 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81913 | 81921 | 81956 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81922 | 81957 | 81925 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81958 | 81961 | 81971 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81962 | 81964 | 81964 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81965 | 81972 | 81969 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81973 | 81992 | 81991 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81993 | 81998 | 82021 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81999 | 82022 | 82001 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82023 | 82036 | 82035 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82037 | 82043 | 82042 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82044 | 82048 | 82047 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82049 | 82103 | 82102 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82104 | 82162 | 82161 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82163 | 82189 | 82188 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82190 | 82195 | 82194 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82196 | 82201 | 82206 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82202 | 82207 | 82202 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82208 | 82256 | 82251 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82257 | 82257 | 82396 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 82258 | 82307 | 82258 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82308 | 82404 | 82308 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82405 | 82439 | 82500 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 82440 | 82502 | 82440 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82503 | 82514 | 82509 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82515 | 82525 | 82580 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 82526 | 82581 | 82529 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82582 | 82592 | 82772 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 82593 | 82602 | 82595 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82603 | 82651 | 82603 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82652 | 82652 | 82652 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82653 | 82653 | 82653 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82654 | 82664 | 82654 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82665 | 82666 | 82665 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82667 | 82667 | 82667 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82668 | 82669 | 82668 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82670 | 82670 | 82670 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82671 | 82777 | 82671 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82778 | 82781 | 82798 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82782 | 82805 | 82782 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82806 | 82816 | 82862 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82817 | 82863 | 82819 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82864 | 82868 | 82867 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82869 | 82879 | 82878 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 82880 | 82895 | 82894 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 82896 | 82900 | 82899 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82901 | 82916 | 82911 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 82917 | 82931 | 82930 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82932 | 82941 | 82940 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82942 | 82954 | 82953 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82955 | 82966 | 82975 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82967 | 82976 | 82967 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82977 | 82998 | 82997 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82999 | 83027 | 83026 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83028 | 83035 | 83115 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83036 | 83047 | 83036 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83048 | 83061 | 83051 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83062 | 83100 | 83099 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83101 | 83122 | 83101 | 22 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83123 | 83166 | 83165 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83167 | 83172 | 83259 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 83173 | 83260 | 83173 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83261 | 83267 | 83266 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 83268 | 83271 | 83284 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83272 | 83289 | 83272 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83290 | 83290 | 83317 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83291 | 83312 | 83291 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83313 | 83325 | 83313 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83326 | 83376 | 83608 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 83377 | 83445 | 83385 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83446 | 83474 | 83464 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83475 | 83524 | 83484 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83525 | 83533 | 83532 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 83534 | 83609 | 83541 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83610 | 83628 | 83626 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83629 | 83761 | 83645 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83762 | 83787 | 83774 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83788 | 83802 | 83801 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83803 | 83867 | 83866 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83868 | 83920 | 83919 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83921 | 83928 | 83927 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 83929 | 83940 | 83939 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83941 | 83993 | 83973 | 53 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83994 | 84063 | 84053 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 84064 | 84093 | 84073 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 84094 | 84162 | 84133 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 84163 | 84170 | 84169 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84171 | 84207 | 84202 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84208 | 84228 | 84211 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84229 | 84241 | 84237 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84242 | 84319 | 84314 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84320 | 84337 | 84324 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84338 | 84361 | 84357 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 84362 | 84369 | 84365 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84370 | 84382 | 84675 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 84383 | 84389 | 84383 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84390 | 84498 | 84390 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84499 | 84509 | 84505 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84510 | 84567 | 84562 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84568 | 84682 | 84568 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84683 | 84701 | 84907 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 84702 | 84774 | 84704 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84775 | 84911 | 84777 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84912 | 84930 | 84926 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 84931 | 84970 | 84965 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84971 | 84985 | 84980 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84986 | 84986 | 85033 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84987 | 84990 | 84987 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84991 | 85041 | 84994 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85042 | 85050 | 85356 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85051 | 85069 | 85051 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85070 | 85205 | 85090 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85206 | 85227 | 85206 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85228 | 85244 | 85236 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85245 | 85269 | 85252 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85270 | 85360 | 85273 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 85361 | 85383 | 85379 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85384 | 85386 | 85425 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85387 | 85429 | 85387 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85430 | 85431 | 85476 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85432 | 85445 | 85432 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85446 | 85484 | 85463 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85485 | 85490 | 85707 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85491 | 85544 | 85496 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85545 | 85561 | 85553 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85562 | 85633 | 85569 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85634 | 85680 | 85637 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 85681 | 85683 | 85681 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85684 | 85711 | 85687 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85712 | 85740 | 85736 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85741 | 85742 | 85769 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85743 | 85773 | 85747 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85774 | 85775 | 85818 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85776 | 85792 | 85780 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85793 | 85839 | 85806 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85840 | 85877 | 85873 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85878 | 85913 | 85909 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85914 | 85931 | 85927 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85932 | 85949 | 85945 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 85950 | 85961 | 85955 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85962 | 86045 | 86268 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86046 | 86066 | 86050 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86067 | 86085 | 86067 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86086 | 86096 | 86094 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86097 | 86163 | 86157 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86164 | 86182 | 86171 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86183 | 86272 | 86188 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86273 | 86286 | 86328 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86287 | 86332 | 86287 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86333 | 86395 | 86391 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86396 | 86430 | 86400 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86431 | 86469 | 86448 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86470 | 86479 | 86475 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86480 | 86560 | 86555 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86561 | 86568 | 86563 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86569 | 86593 | 86574 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86594 | 86607 | 86596 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86608 | 86624 | 86651 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86625 | 86655 | 86625 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86656 | 86673 | 86669 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 86674 | 86681 | 86677 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86682 | 86698 | 86694 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86699 | 86735 | 86731 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86736 | 86761 | 86783 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86762 | 86790 | 86773 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86791 | 86850 | 86844 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86851 | 86898 | 86893 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86899 | 86903 | 86972 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86904 | 86976 | 86904 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86977 | 87001 | 86997 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87002 | 87097 | 87093 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87098 | 87113 | 87347 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 87114 | 87232 | 87117 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87233 | 87351 | 87293 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87352 | 87397 | 87393 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87398 | 87409 | 87405 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87410 | 87423 | 87419 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87424 | 87459 | 87453 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87460 | 87510 | 87505 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87511 | 87588 | 87577 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87589 | 87616 | 87654 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87617 | 87672 | 87619 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87673 | 87691 | 87687 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87692 | 87735 | 87723 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 87736 | 87742 | 87738 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 87743 | 87801 | 87797 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 87802 | 87809 | 87860 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87810 | 87864 | 87810 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87865 | 87915 | 87954 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87916 | 87936 | 87919 | 21 | 4 | `setVal` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 87937 | 87966 | 87944 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87967 | 87996 | 87992 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 87997 | 88032 | 88002 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 88033 | 88536 | 88068 | 504 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 88537 | 88651 | 88543 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
