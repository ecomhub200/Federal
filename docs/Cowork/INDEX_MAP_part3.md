# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (117385 lines)

Declarations in this part: **862**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80061 | 80102 | 80098 | 42 | 38 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80103 | 80134 | 80130 | 32 | 28 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80135 | 80143 | 80139 | 9 | 5 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80144 | 80155 | 80151 | 12 | 8 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80156 | 80197 | 80193 | 42 | 38 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80198 | 80244 | 80240 | 47 | 43 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80245 | 80314 | 80310 | 70 | 66 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80315 | 80337 | 80333 | 23 | 19 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80338 | 80361 | 80357 | 24 | 20 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80362 | 80388 | 80384 | 27 | 23 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80389 | 80453 | 80447 | 65 | 59 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80454 | 80512 | 80508 | 59 | 55 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80513 | 80524 | 80520 | 12 | 8 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80525 | 80536 | 80532 | 12 | 8 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80537 | 80554 | 80550 | 18 | 14 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80555 | 80566 | 80562 | 12 | 8 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80567 | 80589 | 80582 | 23 | 16 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80590 | 80654 | 80650 | 65 | 61 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80655 | 80676 | 80672 | 22 | 18 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80677 | 80720 | 80715 | 44 | 39 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80721 | 80753 | 80749 | 33 | 29 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80754 | 80761 | 80757 | 8 | 4 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80762 | 80771 | 80767 | 10 | 6 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80772 | 80812 | 80808 | 41 | 37 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80813 | 80843 | 80839 | 31 | 27 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80844 | 80853 | 80849 | 10 | 6 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80854 | 80924 | 80920 | 71 | 67 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80925 | 80996 | 80992 | 72 | 68 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 80997 | 81005 | 81001 | 9 | 5 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 81006 | 81083 | 81079 | 78 | 74 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81084 | 81125 | 81121 | 42 | 38 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81126 | 81136 | 81132 | 11 | 7 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81137 | 81175 | 81165 | 39 | 29 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81176 | 81196 | 81192 | 21 | 17 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81197 | 81205 | 81215 | 9 | 19 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81206 | 81219 | 81206 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81220 | 81241 | 81237 | 22 | 18 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81242 | 81253 | 81249 | 12 | 8 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81254 | 81458 | 81454 | 205 | 201 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81459 | 81587 | 81619 | 129 | 161 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81588 | 81623 | 81588 | 36 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81624 | 81714 | 81710 | 91 | 87 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81715 | 81788 | 81778 | 74 | 64 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81789 | 82135 | 82131 | 347 | 343 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82136 | 82447 | 82443 | 312 | 308 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82448 | 82547 | 82542 | 100 | 95 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82548 | 82555 | 82550 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 82556 | 82592 | 82583 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 82593 | 82614 | 82610 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 82615 | 82624 | 82620 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 82625 | 82635 | 82630 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 82636 | 82674 | 82670 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82675 | 82747 | 82741 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 82748 | 82877 | 82873 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 82878 | 82920 | 82916 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 82921 | 82998 | 82974 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 82999 | 83011 | 83007 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83012 | 83051 | 83046 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 83052 | 83087 | 83083 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 83088 | 83111 | 83107 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83112 | 83124 | 83119 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83125 | 83162 | 83157 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 83163 | 83218 | 83213 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83219 | 83272 | 83268 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 83273 | 83383 | 83315 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83384 | 83402 | 83398 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 83403 | 83459 | 83455 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83460 | 83469 | 83463 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83470 | 83577 | 83626 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 83578 | 83630 | 83578 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 83631 | 83660 | 83655 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83661 | 83748 | 83744 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 83749 | 83766 | 83761 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83767 | 83823 | 83822 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83824 | 83956 | 83936 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 83957 | 84005 | 84001 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84006 | 84060 | 84056 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84061 | 84115 | 84111 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84116 | 84251 | 84247 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84252 | 84283 | 84279 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84284 | 84292 | 84287 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84293 | 84427 | 84423 | 135 | 131 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 84428 | 84431 | 84462 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84432 | 84436 | 84435 | 5 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 84437 | 84466 | 84440 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 84467 | 84481 | 84477 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84482 | 84500 | 84496 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 84501 | 84507 | 84503 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84508 | 84544 | 84540 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84545 | 84614 | 84610 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84615 | 84639 | 84663 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84640 | 84667 | 84646 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84668 | 84773 | 84768 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84774 | 84921 | 84917 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84922 | 85039 | 85035 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85040 | 85056 | 85051 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 85057 | 85446 | 85438 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 85447 | 85467 | 85477 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85468 | 85481 | 85468 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85482 | 85514 | 85510 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85515 | 85531 | 85517 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85532 | 85608 | 85604 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 85609 | 85642 | 85638 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85643 | 85692 | 85686 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85693 | 85764 | 85757 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 85765 | 85788 | 85784 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 85789 | 85805 | 85801 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 85806 | 85834 | 85825 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 85835 | 85913 | 85908 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 85914 | 85930 | 85926 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85931 | 86170 | 86166 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 86171 | 86245 | 86345 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 86246 | 86246 | 86246 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86247 | 86349 | 86247 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86350 | 86428 | 86474 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86429 | 86483 | 86429 | 55 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86484 | 86527 | 86523 | 44 | 40 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86528 | 86534 | 86530 | 7 | 3 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86535 | 86541 | 86537 | 7 | 3 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86542 | 86561 | 86557 | 20 | 16 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86562 | 86587 | 86583 | 26 | 22 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86588 | 86650 | 86644 | 63 | 57 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86651 | 86676 | 86672 | 26 | 22 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86677 | 86683 | 86679 | 7 | 3 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86684 | 86690 | 86686 | 7 | 3 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86691 | 86766 | 86762 | 76 | 72 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86767 | 86811 | 86807 | 45 | 41 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86812 | 86845 | 86864 | 34 | 53 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86846 | 86868 | 86846 | 23 | 1 | `peakResult` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86869 | 86884 | 86929 | 16 | 61 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86885 | 86933 | 86896 | 49 | 12 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86934 | 86970 | 86966 | 37 | 33 | `signal_evaluateWarrant5` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 86971 | 87037 | 87032 | 67 | 62 | `signal_evaluateWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87038 | 87176 | 87229 | 139 | 192 | `signal_autoPopulateWarrant7` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87177 | 87182 | 87180 | 6 | 4 | `angleCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87183 | 87187 | 87190 | 5 | 8 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87188 | 87192 | 87188 | 5 | 1 | `isPedByType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87193 | 87233 | 87196 | 41 | 4 | `countInjury` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87234 | 87246 | 87240 | 13 | 7 | `signal_detectWarrant7Period` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87247 | 87282 | 87277 | 36 | 31 | `signal_updateWarrant7Display` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87283 | 87295 | 87329 | 13 | 47 | `signal_refreshWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87296 | 87333 | 87296 | 38 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 87334 | 87582 | 87578 | 249 | 245 | `signal_runAnalysis` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87583 | 87638 | 87634 | 56 | 52 | `signal_buildDayResults` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87639 | 87758 | 87754 | 120 | 116 | `signal_updateResultsDisplay` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87759 | 87838 | 87834 | 80 | 76 | `signal_buildDetailedResultsHTML` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87839 | 87854 | 87850 | 16 | 12 | `signal_switchDetailTab` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87855 | 87904 | 87900 | 50 | 46 | `signal_buildDayBreakdownTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87905 | 87954 | 87950 | 50 | 46 | `signal_buildSummaryTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87955 | 87965 | 88040 | 11 | 86 | `signal_buildWarrant1Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 87966 | 88044 | 87966 | 79 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88045 | 88050 | 88095 | 6 | 51 | `signal_buildWarrant2Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88051 | 88099 | 88051 | 49 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88100 | 88132 | 88128 | 33 | 29 | `signal_buildWarrant3Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88133 | 88182 | 88178 | 50 | 46 | `signal_buildWarrant4Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88183 | 88219 | 88215 | 37 | 33 | `signal_buildWarrant5Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88220 | 88267 | 88263 | 48 | 44 | `signal_buildWarrant7Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88268 | 88310 | 88306 | 43 | 39 | `signal_buildHourlyTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88311 | 88356 | 88352 | 46 | 42 | `signal_buildRTTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88357 | 88371 | 88367 | 15 | 11 | `signal_switchResultTab` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88372 | 88462 | 88458 | 91 | 87 | `signal_renderMultiDayTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88463 | 88523 | 88519 | 61 | 57 | `signal_renderHourlyTMC` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88524 | 88598 | 88594 | 75 | 71 | `signal_renderRTAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88599 | 88613 | 88599 | 15 | 1 | `signal_addDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88614 | 88622 | 88618 | 9 | 5 | `signal_removeDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88623 | 88642 | 88638 | 20 | 16 | `signal_clearAllDays` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88643 | 88660 | 88656 | 18 | 14 | `signal_calculateDayTotal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88661 | 88677 | 88673 | 17 | 13 | `signal_editDay` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88678 | 88772 | 88768 | 95 | 91 | `signal_renderTMCGrid` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88773 | 88795 | 88791 | 23 | 19 | `signal_onTMCInput` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88796 | 88816 | 88812 | 21 | 17 | `signal_updateModalRowTotal` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88817 | 88825 | 88821 | 9 | 5 | `signal_saveTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88826 | 88832 | 88828 | 7 | 3 | `signal_closeTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88833 | 88866 | 88862 | 34 | 30 | `signal_updateConfigFromUI` | fn | — | refs:24 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88867 | 88869 | 88900 | 3 | 34 | `signal_populateUIFromConfig` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88870 | 88870 | 88870 | 1 | 1 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 88871 | 88904 | 88871 | 34 | 1 | `setChecked` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88905 | 88943 | 88939 | 39 | 35 | `signal_onTabShow` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 88944 | 89143 | 89396 | 200 | 453 | `signal_generatePDFReport` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89144 | 89258 | 89150 | 115 | 7 | `w4Body` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89259 | 89400 | 89259 | 142 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89401 | 89441 | 89516 | 41 | 116 | `signal_exportCSV` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89442 | 89499 | 89442 | 58 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89500 | 89520 | 89500 | 21 | 1 | `totalVol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89521 | 89822 | 89803 | 302 | 283 | `signal_generateWordMemo` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89823 | 89867 | 89863 | 45 | 41 | `signal_readFileContent` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89868 | 90002 | 90185 | 135 | 318 | `signal_extractSingleFileWithDualAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90003 | 90189 | 90003 | 187 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90190 | 90204 | 90200 | 15 | 11 | `signal_calculateExtractedTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90205 | 90265 | 90260 | 61 | 56 | `signal_autoFillFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90266 | 90455 | 90682 | 190 | 417 | `signal_handleBulkFileUpload` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90456 | 90492 | 90461 | 37 | 6 | `hourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90493 | 90493 | 90493 | 1 | 1 | `volumes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90494 | 90566 | 90494 | 73 | 1 | `mean` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90567 | 90580 | 90567 | 14 | 1 | `issueIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90581 | 90583 | 90583 | 3 | 3 | `finalHourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90584 | 90605 | 90584 | 22 | 1 | `allSameHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90606 | 90606 | 90606 | 1 | 1 | `successCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90607 | 90607 | 90607 | 1 | 1 | `correctedCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90608 | 90608 | 90608 | 1 | 1 | `warningCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90609 | 90622 | 90609 | 14 | 1 | `errorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90623 | 90623 | 90623 | 1 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90624 | 90686 | 90624 | 63 | 1 | `resolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90687 | 90700 | 90694 | 14 | 8 | `signal_extractAllWithAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90701 | 90749 | 90745 | 49 | 45 | `signal_onFilesSelected` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90750 | 90808 | 90797 | 59 | 48 | `signal_showAPIKeyWarning` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90809 | 90915 | 90911 | 107 | 103 | `signal_agent3ReExtract` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90916 | 90930 | 91024 | 15 | 109 | `signal_generateDataPreview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90931 | 90968 | 90931 | 38 | 1 | `maxHoursInBatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90969 | 90987 | 90969 | 19 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90988 | 91028 | 90988 | 41 | 1 | `allHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91029 | 91043 | 91039 | 15 | 11 | `signal_togglePreviewRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91044 | 91061 | 91057 | 18 | 14 | `signal_confirmExtractedData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91062 | 91092 | 91088 | 31 | 27 | `signal_enterReviewMode` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91093 | 91117 | 91113 | 25 | 21 | `signal_exitReviewMode` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91118 | 91138 | 91134 | 21 | 17 | `signal_updateReviewQueueIndicator` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91139 | 91189 | 91185 | 51 | 47 | `signal_loadCurrentReviewData` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91190 | 91194 | 91245 | 5 | 56 | `signal_populateTMCGridFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91195 | 91195 | 91195 | 1 | 1 | `extractedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91196 | 91196 | 91196 | 1 | 1 | `hasEarlyHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91197 | 91207 | 91197 | 11 | 1 | `hasLateHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91208 | 91249 | 91208 | 42 | 1 | `allWithin12hr` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91250 | 91296 | 91290 | 47 | 41 | `signal_doPopulateTMCValues` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91297 | 91373 | 91369 | 77 | 73 | `signal_populateTMCFromDayData` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91374 | 91395 | 91391 | 22 | 18 | `signal_skipCurrentReview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91396 | 91419 | 91415 | 24 | 20 | `signal_advanceReviewQueue` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91420 | 91442 | 91425 | 23 | 6 | `signal_rejectExtractedData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91443 | 91478 | 91474 | 36 | 32 | `speedstudy_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91479 | 91506 | 91502 | 28 | 24 | `speedstudy_generateTableRows` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 91507 | 91540 | 91536 | 34 | 30 | `speedstudy_updateTotals` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 91541 | 91593 | 91589 | 53 | 49 | `speedstudy_setCountType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 91594 | 91612 | 91608 | 19 | 15 | `speedstudy_updateConfigFromUI` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 91613 | 91632 | 91627 | 20 | 15 | `speedstudy_clearForm` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 91633 | 91651 | 91647 | 19 | 15 | `speedstudy_initTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91652 | 91711 | 91707 | 60 | 56 | `speedstudy_addCurrentDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91712 | 91757 | 91753 | 46 | 42 | `speedstudy_renderDayCards` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 91758 | 91767 | 91763 | 10 | 6 | `speedstudy_removeDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91768 | 91778 | 91774 | 11 | 7 | `speedstudy_updateDayCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 91779 | 91794 | 91790 | 16 | 12 | `speedstudy_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 91795 | 91821 | 91817 | 27 | 23 | `speedstudy_runAnalysis` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 91822 | 91937 | 91933 | 116 | 112 | `speedstudy_runAnalysisInternal` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 91938 | 91951 | 91947 | 14 | 10 | `speedstudy_getRecommendationReason` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91952 | 92046 | 92042 | 95 | 91 | `speedstudy_displayResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92047 | 92088 | 92083 | 42 | 37 | `speedstudy_generateHistogram` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92089 | 92183 | 92262 | 95 | 174 | `speedstudy_loadCrashData` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 92184 | 92184 | 92184 | 1 | 1 | `locWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92185 | 92187 | 92185 | 3 | 1 | `routeWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92188 | 92266 | 92190 | 79 | 3 | `allWordsMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92267 | 92294 | 92302 | 28 | 36 | `findMatchingRoute` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92295 | 92306 | 92297 | 12 | 3 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92307 | 92335 | 92330 | 29 | 24 | `speedstudy_calculateCrashRate` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 92336 | 92377 | 92373 | 42 | 38 | `speedstudy_updateLocationSourceIndicator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 92378 | 92415 | 92410 | 38 | 33 | `speedstudy_clearLocationBinding` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92416 | 92504 | 92500 | 89 | 85 | `speedstudy_autoPopulateFromRoadProps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92505 | 92523 | 92519 | 19 | 15 | `speedstudy_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92524 | 92532 | 92528 | 9 | 5 | `speedstudy_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92533 | 92548 | 92544 | 16 | 12 | `speedstudy_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92549 | 92588 | 92581 | 40 | 33 | `speedstudy_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92589 | 92611 | 92607 | 23 | 19 | `speedstudy_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92612 | 92667 | 92663 | 56 | 52 | `speedstudy_readFileContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92668 | 92784 | 92926 | 117 | 259 | `speedstudy_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92785 | 92930 | 92785 | 146 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92931 | 92931 | 93115 | 1 | 185 | `speedstudy_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92932 | 93119 | 92932 | 188 | 1 | `files` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93120 | 93159 | 93155 | 40 | 36 | `speedstudy_populateGridFromExtraction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93160 | 93171 | 93167 | 12 | 8 | `speedstudy_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93172 | 93180 | 93176 | 9 | 5 | `speedstudy_toggleStudyType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93181 | 93193 | 93189 | 13 | 9 | `speedstudy_importFromTMC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93194 | 93332 | 93328 | 139 | 135 | `speedstudy_newStudy` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93333 | 93570 | 93794 | 238 | 462 | `speedstudy_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93571 | 93573 | 93586 | 3 | 16 | `dayRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93574 | 93574 | 93574 | 1 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93575 | 93575 | 93575 | 1 | 1 | `speeds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93576 | 93606 | 93576 | 31 | 1 | `avgP85` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93607 | 93798 | 93615 | 192 | 9 | `hourlyRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93799 | 93875 | 93938 | 77 | 140 | `speedstudy_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93876 | 93942 | 93876 | 67 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93943 | 93951 | 93947 | 9 | 5 | `speedstudy_linkToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93952 | 93986 | 93982 | 35 | 31 | `speedstudy_saveData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93987 | 94038 | 94033 | 52 | 47 | `speedstudy_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94039 | 94051 | 94046 | 13 | 8 | `speedstudy_scheduleAutoSave` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 94052 | 94091 | 94149 | 40 | 98 | `speedstudy_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94092 | 94161 | 94092 | 70 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94162 | 94172 | 94168 | 11 | 7 | `streetlight_onTabShow` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94173 | 94235 | 94231 | 63 | 59 | `streetlight_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 94236 | 94285 | 94281 | 50 | 46 | `streetlight_analyzeCrashesByLight` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 94286 | 94316 | 94312 | 31 | 27 | `streetlight_calculateMetrics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94317 | 94346 | 94404 | 30 | 88 | `streetlight_updateUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94347 | 94347 | 94354 | 1 | 8 | `conditions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94348 | 94348 | 94348 | 1 | 1 | `aIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94349 | 94408 | 94349 | 60 | 1 | `bIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94409 | 94449 | 94445 | 41 | 37 | `streetlight_evaluateWarrant` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 94450 | 94480 | 94507 | 31 | 58 | `streetlight_updateWarrantUI` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 94481 | 94508 | 94499 | 28 | 19 | `updateCriterion` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94509 | 94520 | 94519 | 12 | 11 | `streetlight_toggleAdditionalFactors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94521 | 94531 | 94530 | 11 | 10 | `streetlight_updateAdditionalFactors` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 94532 | 94543 | 94542 | 12 | 11 | `streetlight_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94544 | 94567 | 94566 | 24 | 23 | `streetlight_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94568 | 94748 | 94747 | 181 | 180 | `streetlight_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94749 | 94809 | 94808 | 61 | 60 | `streetlight_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94810 | 94852 | 94851 | 43 | 42 | `streetlight_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94853 | 94873 | 94872 | 21 | 20 | `streetlight_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94874 | 94925 | 94917 | 52 | 44 | `streetlight_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94926 | 95005 | 95040 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95006 | 95006 | 95006 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95007 | 95044 | 95007 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95045 | 95128 | 95326 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 95129 | 95129 | 95129 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95130 | 95259 | 95130 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95260 | 95260 | 95260 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95261 | 95327 | 95261 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95328 | 95350 | 95349 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 95351 | 95390 | 95381 | 40 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 95391 | 95435 | 95431 | 45 | 41 | `trafficdata_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95436 | 95458 | 95454 | 23 | 19 | `trafficdata_updateConfig` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 95459 | 95498 | 95494 | 40 | 36 | `trafficdata_syncFromWarrantSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 95499 | 95517 | 95513 | 19 | 15 | `trafficdata_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95518 | 95527 | 95523 | 10 | 6 | `trafficdata_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95528 | 95536 | 95532 | 9 | 5 | `trafficdata_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95537 | 95544 | 95540 | 8 | 4 | `trafficdata_setCountType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95545 | 95559 | 95555 | 15 | 11 | `trafficdata_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95560 | 95589 | 95585 | 30 | 26 | `trafficdata_toggleSection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 95590 | 95662 | 95658 | 73 | 69 | `trafficdata_renderTmcTable` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95663 | 95679 | 95675 | 17 | 13 | `trafficdata_updateTmcTotals` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95680 | 95708 | 95704 | 29 | 25 | `trafficdata_setTmcCountType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95709 | 95723 | 95718 | 15 | 10 | `trafficdata_updateTmcDate` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95724 | 95789 | 95785 | 66 | 62 | `trafficdata_addTmcDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95790 | 95811 | 95807 | 22 | 18 | `trafficdata_clearTmcForm` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 95812 | 95848 | 95844 | 37 | 33 | `trafficdata_showDaysSummary` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95849 | 95863 | 95859 | 15 | 11 | `calculateDayTotalVolume` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95864 | 95877 | 95873 | 14 | 10 | `trafficdata_deleteDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95878 | 95898 | 95894 | 21 | 17 | `trafficdata_updateDayCounts` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 95899 | 95906 | 95902 | 8 | 4 | `trafficdata_updatePedCounts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 95907 | 95939 | 95935 | 33 | 29 | `trafficdata_addPedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95940 | 95965 | 95961 | 26 | 22 | `trafficdata_saveSpeedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95966 | 96048 | 96044 | 83 | 79 | `trafficdata_updateReadiness` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 96049 | 96070 | 96066 | 22 | 18 | `updateReadinessBar` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 96071 | 96117 | 96113 | 47 | 43 | `trafficdata_convertTmcToTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96118 | 96151 | 96147 | 34 | 30 | `trafficdata_convertPeakToAADT` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96152 | 96175 | 96171 | 24 | 20 | `trafficdata_calcRoundaboutVolumes` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96176 | 96233 | 96229 | 58 | 54 | `trafficdata_refreshCrashData` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 96234 | 96266 | 96262 | 33 | 29 | `trafficdata_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96267 | 96293 | 96289 | 27 | 23 | `trafficdata_saveStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96294 | 96309 | 96305 | 16 | 12 | `trafficdata_exportStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96310 | 96316 | 96312 | 7 | 3 | `trafficdata_loadStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96317 | 96334 | 96320 | 18 | 4 | `trafficdata_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96335 | 96372 | 96368 | 38 | 34 | `trafficdata_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96373 | 96408 | 96404 | 36 | 32 | `trafficdata_showAPIKeyWarning` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96409 | 96530 | 96558 | 122 | 150 | `trafficdata_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96531 | 96531 | 96531 | 1 | 1 | `docTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96532 | 96562 | 96534 | 31 | 3 | `dominantType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96563 | 96650 | 96672 | 88 | 110 | `trafficdata_extractSingleFile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96651 | 96676 | 96651 | 26 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96677 | 96695 | 96691 | 19 | 15 | `trafficdata_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96696 | 96716 | 96712 | 21 | 17 | `trafficdata_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96717 | 96737 | 96733 | 21 | 17 | `trafficdata_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96738 | 96773 | 96769 | 36 | 32 | `trafficdata_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96774 | 96802 | 96798 | 29 | 25 | `trafficdata_exitReviewMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 96803 | 96818 | 96814 | 16 | 12 | `trafficdata_updateReviewQueueIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96819 | 96874 | 96869 | 56 | 51 | `trafficdata_loadCurrentReviewData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 96875 | 96915 | 96911 | 41 | 37 | `trafficdata_loadHourlyDataIntoGrid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96916 | 96923 | 96919 | 8 | 4 | `trafficdata_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96924 | 96934 | 96930 | 11 | 7 | `trafficdata_updateRtAdjustment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96935 | 96978 | 96968 | 44 | 34 | `trafficdata_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96979 | 97091 | 97086 | 113 | 108 | `trafficdata_pushToSignal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97092 | 97196 | 97191 | 105 | 100 | `trafficdata_pushToStopSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97197 | 97300 | 97295 | 104 | 99 | `trafficdata_pushToRoundabout` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97301 | 97378 | 97373 | 78 | 73 | `trafficdata_pushToPedCrossing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97379 | 97571 | 97459 | 193 | 81 | `trafficdata_pushToSpeedStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97572 | 97720 | 97700 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97721 | 97729 | 97854 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 97730 | 97856 | 97730 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97857 | 97873 | 97862 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97874 | 97880 | 97878 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97881 | 97891 | 97889 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97892 | 97910 | 97905 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 97911 | 97924 | 97923 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97925 | 97930 | 97929 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97931 | 97941 | 97940 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 97942 | 98148 | 98147 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98149 | 98200 | 98199 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 98201 | 98261 | 98260 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98262 | 98306 | 98305 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98307 | 98320 | 98319 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98321 | 98334 | 98333 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98335 | 98375 | 98374 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98376 | 98404 | 98403 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98405 | 98480 | 98453 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98481 | 98494 | 98493 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98495 | 98501 | 98500 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98502 | 98544 | 98543 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98545 | 98549 | 98548 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 98550 | 98578 | 98577 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98579 | 98611 | 98610 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98612 | 98714 | 98614 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98715 | 98961 | 98726 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 98962 | 99050 | 98962 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99051 | 99078 | 99099 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 99079 | 99107 | 99079 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99108 | 99144 | 99134 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 99145 | 99178 | 99173 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 99179 | 99203 | 99197 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 99204 | 99235 | 99230 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99236 | 99304 | 99300 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 99305 | 99356 | 99352 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 99357 | 99371 | 99367 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99372 | 99389 | 99385 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 99390 | 99407 | 99401 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 99408 | 99493 | 99442 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99494 | 99498 | 99564 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99499 | 99516 | 99499 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99517 | 99534 | 99517 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99535 | 99569 | 99535 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99570 | 99881 | 99584 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99882 | 99930 | 99882 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99931 | 100008 | 99931 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100009 | 100090 | 100086 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100091 | 100155 | 100151 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100156 | 100172 | 100168 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100173 | 100203 | 100198 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 100204 | 100270 | 100266 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 100271 | 100321 | 100317 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100322 | 100336 | 100332 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100337 | 100353 | 100349 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 100354 | 100369 | 100365 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100370 | 100550 | 100404 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100551 | 100562 | 100560 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 100563 | 101076 | 100572 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101077 | 101238 | 101232 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101239 | 101288 | 101284 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 101289 | 101396 | 101389 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 101397 | 101441 | 101436 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101442 | 101556 | 101550 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101557 | 101619 | 101613 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101620 | 101720 | 101716 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101721 | 101818 | 101814 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 101819 | 101829 | 101825 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 101830 | 101887 | 101883 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 101888 | 101898 | 101894 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 101899 | 101941 | 101937 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101942 | 101976 | 101972 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101977 | 101988 | 101984 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101989 | 101997 | 101993 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101998 | 102035 | 102031 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 102036 | 102050 | 102046 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102051 | 102071 | 102067 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102072 | 102084 | 102080 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102085 | 102097 | 102093 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102098 | 102127 | 102123 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 102128 | 102148 | 102144 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102149 | 102155 | 102151 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102156 | 102206 | 102202 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102207 | 102240 | 102236 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102241 | 102260 | 102255 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102261 | 102386 | 102381 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102387 | 102450 | 102446 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102451 | 102462 | 102457 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102463 | 102492 | 102491 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 102493 | 102503 | 102502 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 102504 | 102514 | 102513 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102515 | 102525 | 102524 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 102526 | 102536 | 102535 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102537 | 102544 | 102543 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 102545 | 102561 | 102556 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102562 | 102564 | 102593 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102565 | 102594 | 102571 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 102595 | 102611 | 102610 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102612 | 102637 | 102636 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102638 | 102660 | 102659 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102661 | 102678 | 102677 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 102679 | 102689 | 102684 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 102690 | 102701 | 102700 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102702 | 102721 | 102720 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 102722 | 102756 | 102751 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 102757 | 102773 | 102772 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102774 | 102829 | 102828 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102830 | 102881 | 102880 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 102882 | 102932 | 102951 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102933 | 102952 | 102935 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 102953 | 102970 | 102986 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102971 | 102987 | 102971 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 102988 | 103014 | 103013 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103015 | 103023 | 103058 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103024 | 103059 | 103027 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103060 | 103063 | 103073 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103064 | 103066 | 103066 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103067 | 103074 | 103071 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103075 | 103094 | 103093 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 103095 | 103100 | 103123 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103101 | 103124 | 103103 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103125 | 103138 | 103137 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103139 | 103145 | 103144 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103146 | 103150 | 103149 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103151 | 103205 | 103204 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103206 | 103264 | 103263 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103265 | 103291 | 103290 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103292 | 103297 | 103296 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103298 | 103303 | 103308 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103304 | 103309 | 103304 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103310 | 103358 | 103353 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103359 | 103359 | 103498 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 103360 | 103409 | 103360 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103410 | 103506 | 103410 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103507 | 103541 | 103602 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 103542 | 103604 | 103542 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103605 | 103616 | 103611 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103617 | 103627 | 103682 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 103628 | 103683 | 103631 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103684 | 103694 | 103874 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 103695 | 103704 | 103697 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103705 | 103753 | 103705 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103754 | 103754 | 103754 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103755 | 103755 | 103755 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103756 | 103766 | 103756 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103767 | 103768 | 103767 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103769 | 103769 | 103769 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103770 | 103771 | 103770 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103772 | 103772 | 103772 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103773 | 103879 | 103773 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103880 | 103883 | 103900 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103884 | 103907 | 103884 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103908 | 103918 | 103964 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103919 | 103965 | 103921 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103966 | 103970 | 103969 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103971 | 103981 | 103980 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 103982 | 103997 | 103996 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 103998 | 104002 | 104001 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104003 | 104018 | 104013 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 104019 | 104033 | 104032 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104034 | 104043 | 104042 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104044 | 104056 | 104055 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104057 | 104068 | 104077 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104069 | 104078 | 104069 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104079 | 104100 | 104099 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104101 | 104129 | 104128 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104130 | 104137 | 104217 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104138 | 104149 | 104138 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104150 | 104163 | 104153 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104164 | 104202 | 104201 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 104203 | 104224 | 104203 | 22 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104225 | 104268 | 104267 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104269 | 104274 | 104361 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 104275 | 104362 | 104275 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104363 | 104369 | 104368 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 104370 | 104373 | 104386 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104374 | 104391 | 104374 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104392 | 104392 | 104419 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104393 | 104414 | 104393 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104415 | 104427 | 104415 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104428 | 104478 | 104710 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 104479 | 104547 | 104487 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104548 | 104576 | 104566 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104577 | 104626 | 104586 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104627 | 104635 | 104634 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 104636 | 104711 | 104643 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104712 | 104730 | 104728 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104731 | 104863 | 104747 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104864 | 104889 | 104876 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104890 | 104904 | 104903 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104905 | 104969 | 104968 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104970 | 105022 | 105021 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105023 | 105030 | 105029 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 105031 | 105042 | 105041 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105043 | 105084 | 105075 | 42 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105085 | 105119 | 105113 | 35 | 29 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105120 | 105157 | 105152 | 38 | 33 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105158 | 105227 | 105291 | 70 | 134 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105228 | 105295 | 105230 | 68 | 3 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105296 | 105364 | 105360 | 69 | 65 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105365 | 105382 | 105378 | 18 | 14 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105383 | 105394 | 105390 | 12 | 8 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105395 | 105413 | 105402 | 19 | 8 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105414 | 105495 | 105491 | 82 | 78 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105496 | 105512 | 105506 | 17 | 11 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105513 | 105572 | 105568 | 60 | 56 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105573 | 105591 | 105581 | 19 | 9 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105592 | 105644 | 105643 | 53 | 52 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105645 | 105667 | 105653 | 23 | 9 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105668 | 105697 | 105762 | 30 | 95 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105698 | 105763 | 105700 | 66 | 3 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 105764 | 105780 | 105779 | 17 | 16 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105781 | 105789 | 105788 | 9 | 8 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105790 | 105801 | 105797 | 12 | 8 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105802 | 105812 | 105808 | 11 | 7 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105813 | 105856 | 105850 | 44 | 38 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105857 | 105910 | 105905 | 54 | 49 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105911 | 105923 | 105914 | 13 | 4 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105924 | 105960 | 105955 | 37 | 32 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105961 | 106072 | 106260 | 112 | 300 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 106073 | 106082 | 106141 | 10 | 69 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106083 | 106106 | 106087 | 24 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106107 | 106201 | 106107 | 95 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106202 | 106202 | 106202 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106203 | 106264 | 106203 | 62 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106265 | 106372 | 106368 | 108 | 104 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106373 | 106388 | 106384 | 16 | 12 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106389 | 106400 | 106396 | 12 | 8 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106401 | 106433 | 106428 | 33 | 28 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106434 | 106496 | 106515 | 63 | 82 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106497 | 106520 | 106502 | 24 | 6 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106521 | 106571 | 106566 | 51 | 46 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106572 | 106595 | 106590 | 24 | 19 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106596 | 106654 | 106647 | 59 | 52 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 106655 | 106713 | 107044 | 59 | 390 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 106714 | 106800 | 106745 | 87 | 32 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106801 | 106807 | 106805 | 7 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106808 | 106827 | 106917 | 20 | 110 | `fetchWithRetry` | async const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106828 | 106867 | 106828 | 40 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106868 | 106982 | 106868 | 115 | 1 | `postTimeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106983 | 106983 | 106983 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106984 | 107049 | 106984 | 66 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107050 | 107069 | 107064 | 20 | 15 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107070 | 107076 | 107097 | 7 | 28 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107077 | 107102 | 107091 | 26 | 15 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107103 | 107112 | 107107 | 10 | 5 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107113 | 107145 | 107140 | 33 | 28 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 107146 | 107231 | 107347 | 86 | 202 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 107232 | 107351 | 107343 | 120 | 112 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107352 | 107405 | 107401 | 54 | 50 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107406 | 107431 | 107427 | 26 | 22 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 107432 | 107453 | 107449 | 22 | 18 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 107454 | 107467 | 107463 | 14 | 10 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107468 | 107494 | 107477 | 27 | 10 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107495 | 107518 | 107585 | 24 | 91 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 107519 | 107550 | 107519 | 32 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 107551 | 107591 | 107551 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 107592 | 107627 | 107612 | 36 | 21 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107628 | 107643 | 107642 | 16 | 15 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 107644 | 107733 | 107729 | 90 | 86 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107734 | 107750 | 107830 | 17 | 97 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107751 | 107841 | 107772 | 91 | 22 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 107842 | 107895 | 107890 | 54 | 49 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 107896 | 107926 | 107921 | 31 | 26 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107927 | 107955 | 107949 | 29 | 23 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107956 | 108007 | 108002 | 52 | 47 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108008 | 108235 | 108231 | 228 | 224 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 108236 | 108250 | 108246 | 15 | 11 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108251 | 108268 | 108263 | 18 | 13 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108269 | 108299 | 108483 | 31 | 215 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108300 | 108300 | 108300 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108301 | 108312 | 108301 | 12 | 1 | `colors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108313 | 108421 | 108313 | 109 | 1 | `totalData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108422 | 108433 | 108422 | 12 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108434 | 108449 | 108434 | 16 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108450 | 108487 | 108450 | 38 | 1 | `epdoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108488 | 108515 | 108543 | 28 | 56 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108516 | 108552 | 108523 | 37 | 8 | `totals` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108553 | 108600 | 108596 | 48 | 44 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108601 | 108607 | 108603 | 7 | 3 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108608 | 108624 | 108615 | 17 | 8 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108625 | 108635 | 108848 | 11 | 224 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108636 | 108636 | 108636 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108637 | 108852 | 108637 | 216 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108853 | 108862 | 108858 | 10 | 6 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 108863 | 108904 | 108900 | 42 | 38 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 108905 | 108929 | 108925 | 25 | 21 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108930 | 108949 | 108945 | 20 | 16 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108950 | 108953 | 108970 | 4 | 21 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108954 | 108979 | 108954 | 26 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 108980 | 108998 | 109265 | 19 | 286 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108999 | 108999 | 108999 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109000 | 109269 | 109000 | 270 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109270 | 109333 | 109312 | 64 | 43 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109334 | 109530 | 109526 | 197 | 193 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 109531 | 109549 | 109545 | 19 | 15 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109550 | 109575 | 109571 | 26 | 22 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109576 | 109664 | 109660 | 89 | 85 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109665 | 109710 | 109706 | 46 | 42 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109711 | 109717 | 109713 | 7 | 3 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109718 | 109724 | 109720 | 7 | 3 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109725 | 109750 | 109746 | 26 | 22 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109751 | 109836 | 109832 | 86 | 82 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109837 | 109853 | 109849 | 17 | 13 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109854 | 109886 | 109882 | 33 | 29 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109887 | 109985 | 109976 | 99 | 90 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 109986 | 110004 | 110000 | 19 | 15 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110005 | 110124 | 110120 | 120 | 116 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 110125 | 110141 | 110137 | 17 | 13 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 110142 | 110153 | 110149 | 12 | 8 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110154 | 110165 | 110161 | 12 | 8 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110166 | 110172 | 110168 | 7 | 3 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110173 | 110180 | 110176 | 8 | 4 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 110181 | 110191 | 110187 | 11 | 7 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 110192 | 110205 | 110201 | 14 | 10 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110206 | 110233 | 110225 | 28 | 20 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110234 | 110258 | 110254 | 25 | 21 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 110259 | 110334 | 110277 | 76 | 19 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 110335 | 110398 | 110394 | 64 | 60 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110399 | 110406 | 110401 | 8 | 3 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110407 | 110424 | 110419 | 18 | 13 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 110425 | 110449 | 110441 | 25 | 17 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110450 | 110477 | 110473 | 28 | 24 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110478 | 110491 | 110487 | 14 | 10 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110492 | 110536 | 110532 | 45 | 41 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110537 | 110563 | 110559 | 27 | 23 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110564 | 110580 | 110575 | 17 | 12 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110581 | 110602 | 110597 | 22 | 17 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 110603 | 110788 | 110784 | 186 | 182 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 110789 | 110800 | 110796 | 12 | 8 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 110801 | 110981 | 110977 | 181 | 177 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 110982 | 110993 | 110989 | 12 | 8 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 110994 | 111007 | 111003 | 14 | 10 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 111008 | 111041 | 111022 | 34 | 15 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 111042 | 111095 | 111091 | 54 | 50 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 111096 | 111112 | 111108 | 17 | 13 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111113 | 111159 | 111248 | 47 | 136 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111160 | 111252 | 111160 | 93 | 1 | `sampleValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111253 | 111268 | 111264 | 16 | 12 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 111269 | 111322 | 111318 | 54 | 50 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 111323 | 111444 | 111440 | 122 | 118 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111445 | 111457 | 111452 | 13 | 8 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 111458 | 111527 | 111517 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111528 | 111557 | 111537 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 111558 | 111626 | 111597 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111627 | 111634 | 111633 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111635 | 111671 | 111666 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111672 | 111692 | 111675 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111693 | 111705 | 111701 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111706 | 111783 | 111778 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 111784 | 111801 | 111788 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111802 | 111825 | 111821 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 111826 | 111833 | 111829 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111834 | 111846 | 112139 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 111847 | 111853 | 111847 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111854 | 111962 | 111854 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111963 | 111973 | 111969 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111974 | 112031 | 112026 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112032 | 112146 | 112032 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112147 | 112165 | 112371 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 112166 | 112238 | 112168 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112239 | 112375 | 112241 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112376 | 112394 | 112390 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 112395 | 112434 | 112429 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112435 | 112449 | 112444 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112450 | 112450 | 112497 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 112451 | 112454 | 112451 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112455 | 112505 | 112458 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112506 | 112514 | 112820 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112515 | 112533 | 112515 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112534 | 112669 | 112554 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112670 | 112691 | 112670 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112692 | 112708 | 112700 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 112709 | 112733 | 112716 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 112734 | 112824 | 112737 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 112825 | 112847 | 112843 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112848 | 112850 | 112889 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112851 | 112893 | 112851 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112894 | 112895 | 112940 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112896 | 112909 | 112896 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112910 | 112948 | 112927 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 112949 | 112954 | 113171 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112955 | 113008 | 112960 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113009 | 113025 | 113017 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 113026 | 113097 | 113033 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 113098 | 113144 | 113101 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 113145 | 113147 | 113145 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113148 | 113175 | 113151 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113176 | 113204 | 113200 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113205 | 113206 | 113233 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113207 | 113237 | 113211 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113238 | 113239 | 113282 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113240 | 113256 | 113244 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113257 | 113303 | 113270 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113304 | 113341 | 113337 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113342 | 113377 | 113373 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113378 | 113395 | 113391 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113396 | 113413 | 113409 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 113414 | 113425 | 113419 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113426 | 113509 | 113732 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113510 | 113530 | 113514 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113531 | 113549 | 113531 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 113550 | 113560 | 113558 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113561 | 113627 | 113621 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113628 | 113646 | 113635 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113647 | 113736 | 113652 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113737 | 113750 | 113792 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113751 | 113796 | 113751 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113797 | 113859 | 113855 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113860 | 113894 | 113864 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113895 | 113933 | 113912 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113934 | 113943 | 113939 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113944 | 114024 | 114019 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 114025 | 114032 | 114027 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114033 | 114057 | 114038 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114058 | 114071 | 114060 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114072 | 114088 | 114115 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114089 | 114119 | 114089 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114120 | 114137 | 114133 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 114138 | 114145 | 114141 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114146 | 114162 | 114158 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 114163 | 114199 | 114195 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114200 | 114225 | 114247 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114226 | 114254 | 114237 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114255 | 114314 | 114308 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114315 | 114362 | 114357 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114363 | 114367 | 114436 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114368 | 114440 | 114368 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114441 | 114465 | 114461 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114466 | 114561 | 114557 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114562 | 114577 | 114811 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 114578 | 114696 | 114581 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114697 | 114815 | 114757 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114816 | 114861 | 114857 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 114862 | 114873 | 114869 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114874 | 114887 | 114883 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114888 | 114923 | 114917 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114924 | 114974 | 114969 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114975 | 115052 | 115041 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115053 | 115080 | 115118 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115081 | 115136 | 115083 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115137 | 115155 | 115151 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115156 | 115199 | 115187 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 115200 | 115206 | 115202 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 115207 | 115265 | 115261 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 115266 | 115273 | 115324 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 115274 | 115328 | 115274 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115329 | 115379 | 115418 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115380 | 115400 | 115383 | 21 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 115401 | 115430 | 115408 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 115431 | 115460 | 115456 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 115461 | 115496 | 115466 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 115497 | 115638 | 115532 | 142 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 115639 | 115646 | 115644 | 8 | 6 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115647 | 115660 | 115656 | 14 | 10 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115661 | 115665 | 115664 | 5 | 4 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115666 | 115670 | 115668 | 5 | 3 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115671 | 115712 | 115711 | 42 | 41 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115713 | 115718 | 115717 | 6 | 5 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115719 | 115729 | 115727 | 11 | 9 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115730 | 115790 | 115788 | 61 | 59 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115791 | 115815 | 115813 | 25 | 23 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115816 | 115833 | 115831 | 18 | 16 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115834 | 115902 | 115934 | 69 | 101 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115903 | 115935 | 115910 | 33 | 8 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 115936 | 115945 | 115944 | 10 | 9 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115946 | 115986 | 115983 | 41 | 38 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 115987 | 116031 | 116030 | 45 | 44 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116032 | 116079 | 116078 | 48 | 47 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116080 | 116150 | 116149 | 71 | 70 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116151 | 116173 | 116172 | 23 | 22 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116174 | 116194 | 116193 | 21 | 20 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116195 | 116215 | 116214 | 21 | 20 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116216 | 116236 | 116235 | 21 | 20 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116237 | 116263 | 116261 | 27 | 25 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116264 | 116325 | 116324 | 62 | 61 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116326 | 116393 | 116392 | 68 | 67 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116394 | 116408 | 116407 | 15 | 14 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116409 | 116424 | 116423 | 16 | 15 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116425 | 116442 | 116440 | 18 | 16 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116443 | 116447 | 116446 | 5 | 4 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116448 | 116514 | 116513 | 67 | 66 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116515 | 116592 | 116591 | 78 | 77 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116593 | 116602 | 116601 | 10 | 9 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116603 | 116606 | 116605 | 4 | 3 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116607 | 116622 | 116620 | 16 | 14 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116623 | 116655 | 116653 | 33 | 31 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116656 | 116692 | 116691 | 37 | 36 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116693 | 116735 | 116734 | 43 | 42 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116736 | 116739 | 116738 | 4 | 3 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116740 | 116777 | 116776 | 38 | 37 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 116778 | 117270 | 116907 | 493 | 130 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 117271 | 117385 | 117277 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
