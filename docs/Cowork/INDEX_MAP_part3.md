# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (120144 lines)

Declarations in this part: **917**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80130 | 80135 | 80133 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80136 | 80178 | 80189 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80179 | 80194 | 80179 | 16 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80195 | 80266 | 80252 | 72 | 58 | `evaluatePedScreening` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80267 | 80287 | 80285 | 21 | 19 | `getRequiredSSD` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80288 | 80310 | 80308 | 23 | 21 | `updatePedSSDRequired` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80311 | 80323 | 80321 | 13 | 11 | `updatePedContextSpacing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80324 | 80368 | 80366 | 45 | 43 | `updatePedStreetViewStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80369 | 80384 | 80382 | 16 | 14 | `openPedStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80385 | 80404 | 80496 | 20 | 112 | `ped_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 80405 | 80497 | 80407 | 93 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80498 | 80636 | 80546 | 139 | 49 | `evaluatePedCriteria` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 80637 | 80674 | 80726 | 38 | 90 | `determinePedTier` | fn | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 80675 | 80727 | 80678 | 53 | 4 | `cmDescriptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80728 | 80758 | 80753 | 31 | 26 | `determinePedMarking` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80759 | 81236 | 81232 | 478 | 474 | `ped_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81237 | 81256 | 81247 | 20 | 11 | `ped_printReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81257 | 81327 | 81323 | 71 | 67 | `stopsign_initForm` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81328 | 81362 | 81358 | 35 | 31 | `stopsign_showTab` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81363 | 81440 | 81436 | 78 | 74 | `stopsign_updateSpeedThreshold` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81441 | 81452 | 81448 | 12 | 8 | `stopsign_updateConfig` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 81453 | 81501 | 81497 | 49 | 45 | `stopsign_updateTMCGrid` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 81502 | 81553 | 81546 | 52 | 45 | `stopsign_generateTMCRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81554 | 81571 | 81567 | 18 | 14 | `stopsign_updateRowTotal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81572 | 81581 | 81577 | 10 | 6 | `stopsign_markTotalManual` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81582 | 81604 | 81598 | 23 | 17 | `stopsign_calculateApproachVolumes` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81605 | 81691 | 81685 | 87 | 81 | `stopsign_computeHourlyAggregates` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 81692 | 81775 | 81771 | 84 | 80 | `stopsign_evaluateCriterionCFromAggregates` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 81776 | 81808 | 81908 | 33 | 133 | `stopsign_updateVolumeSummary` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 81809 | 81809 | 81809 | 1 | 1 | `totalMajor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81810 | 81912 | 81810 | 103 | 1 | `totalMinor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81913 | 81951 | 81947 | 39 | 35 | `stopsign_setCountType` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 81952 | 81982 | 81977 | 31 | 26 | `stopsign_clearTMCForm` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 81983 | 81990 | 81986 | 8 | 4 | `stopsign_generateVolumeTable` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81991 | 82086 | 82082 | 96 | 92 | `stopsign_updateVolumeAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 82087 | 82109 | 82129 | 23 | 43 | `stopsign_buildCrashProfile` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 82110 | 82133 | 82112 | 24 | 3 | `isSusceptible` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82134 | 82166 | 82162 | 33 | 29 | `stopsign_autoPopulateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82167 | 82195 | 82191 | 29 | 25 | `stopsign_evaluateCriterionA` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82196 | 82225 | 82221 | 30 | 26 | `stopsign_evaluateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82226 | 82238 | 82286 | 13 | 61 | `stopsign_evaluateCriterionC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82239 | 82255 | 82244 | 17 | 6 | `updateSubcriterion` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82256 | 82291 | 82262 | 36 | 7 | `updateBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82292 | 82376 | 82372 | 85 | 81 | `stopsign_calculateLOS` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82377 | 82387 | 82383 | 11 | 7 | `stopsign_toggleHCSConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82388 | 82431 | 82427 | 44 | 40 | `stopsign_evaluateCriterionD` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82432 | 82480 | 82476 | 49 | 45 | `stopsign_evaluateAllCriteria` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 82481 | 82550 | 82546 | 70 | 66 | `stopsign_updateResultsTab` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82551 | 82561 | 82557 | 11 | 7 | `stopsign_updateResultCell` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82562 | 82585 | 82581 | 24 | 20 | `stopsign_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82586 | 82606 | 82602 | 21 | 17 | `stopsign_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82607 | 82617 | 82613 | 11 | 7 | `stopsign_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82618 | 82636 | 82632 | 19 | 15 | `stopsign_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82637 | 82659 | 82655 | 23 | 19 | `stopsign_clearVolumeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82660 | 82721 | 82717 | 62 | 58 | `stopsign_saveData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82722 | 82819 | 82815 | 98 | 94 | `stopsign_loadSavedData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82820 | 82861 | 82857 | 42 | 38 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82862 | 82893 | 82889 | 32 | 28 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82894 | 82902 | 82898 | 9 | 5 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82903 | 82914 | 82910 | 12 | 8 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82915 | 82956 | 82952 | 42 | 38 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82957 | 83003 | 82999 | 47 | 43 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83004 | 83073 | 83069 | 70 | 66 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83074 | 83096 | 83092 | 23 | 19 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83097 | 83120 | 83116 | 24 | 20 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83121 | 83147 | 83143 | 27 | 23 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83148 | 83212 | 83206 | 65 | 59 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83213 | 83271 | 83267 | 59 | 55 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83272 | 83283 | 83279 | 12 | 8 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83284 | 83295 | 83291 | 12 | 8 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83296 | 83313 | 83309 | 18 | 14 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83314 | 83325 | 83321 | 12 | 8 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83326 | 83348 | 83341 | 23 | 16 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83349 | 83413 | 83409 | 65 | 61 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83414 | 83435 | 83431 | 22 | 18 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83436 | 83479 | 83474 | 44 | 39 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83480 | 83512 | 83508 | 33 | 29 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83513 | 83520 | 83516 | 8 | 4 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83521 | 83530 | 83526 | 10 | 6 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83531 | 83571 | 83567 | 41 | 37 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83572 | 83602 | 83598 | 31 | 27 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83603 | 83612 | 83608 | 10 | 6 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83613 | 83683 | 83679 | 71 | 67 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 83684 | 83755 | 83751 | 72 | 68 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 83756 | 83764 | 83760 | 9 | 5 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 83765 | 83842 | 83838 | 78 | 74 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83843 | 83884 | 83880 | 42 | 38 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83885 | 83895 | 83891 | 11 | 7 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83896 | 83934 | 83924 | 39 | 29 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83935 | 83955 | 83951 | 21 | 17 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83956 | 83964 | 83974 | 9 | 19 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83965 | 83978 | 83965 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83979 | 84000 | 83996 | 22 | 18 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84001 | 84012 | 84008 | 12 | 8 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84013 | 84217 | 84213 | 205 | 201 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84218 | 84346 | 84378 | 129 | 161 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84347 | 84382 | 84347 | 36 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84383 | 84473 | 84469 | 91 | 87 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84474 | 84547 | 84537 | 74 | 64 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84548 | 84894 | 84890 | 347 | 343 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84895 | 85206 | 85202 | 312 | 308 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85207 | 85306 | 85301 | 100 | 95 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85307 | 85314 | 85309 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85315 | 85351 | 85342 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 85352 | 85373 | 85369 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 85374 | 85383 | 85379 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 85384 | 85394 | 85389 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 85395 | 85433 | 85429 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85434 | 85506 | 85500 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 85507 | 85636 | 85632 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 85637 | 85679 | 85675 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85680 | 85757 | 85733 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 85758 | 85770 | 85766 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85771 | 85810 | 85805 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 85811 | 85846 | 85842 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 85847 | 85870 | 85866 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85871 | 85883 | 85878 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85884 | 85921 | 85916 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 85922 | 85977 | 85972 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85978 | 86031 | 86027 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 86032 | 86142 | 86074 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86143 | 86161 | 86157 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 86162 | 86218 | 86214 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 86219 | 86228 | 86222 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86229 | 86336 | 86385 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 86337 | 86389 | 86337 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 86390 | 86419 | 86414 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86420 | 86507 | 86503 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 86508 | 86525 | 86520 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86526 | 86582 | 86581 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86583 | 86715 | 86695 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 86716 | 86764 | 86760 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 86765 | 86819 | 86815 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86820 | 86874 | 86870 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86875 | 87010 | 87006 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87011 | 87042 | 87038 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 87043 | 87051 | 87046 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 87052 | 87186 | 87182 | 135 | 131 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 87187 | 87190 | 87221 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 87191 | 87195 | 87194 | 5 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 87196 | 87225 | 87199 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 87226 | 87240 | 87236 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87241 | 87259 | 87255 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 87260 | 87266 | 87262 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87267 | 87303 | 87299 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87304 | 87373 | 87369 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87374 | 87398 | 87422 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87399 | 87426 | 87405 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87427 | 87532 | 87527 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 87533 | 87680 | 87676 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87681 | 87798 | 87794 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 87799 | 87815 | 87810 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 87816 | 88205 | 88197 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 88206 | 88226 | 88236 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88227 | 88240 | 88227 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88241 | 88273 | 88269 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88274 | 88290 | 88276 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88291 | 88367 | 88363 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 88368 | 88401 | 88397 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88402 | 88451 | 88445 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88452 | 88523 | 88516 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 88524 | 88547 | 88543 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 88548 | 88564 | 88560 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 88565 | 88593 | 88584 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 88594 | 88672 | 88667 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 88673 | 88689 | 88685 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88690 | 88929 | 88925 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 88930 | 89004 | 89104 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 89005 | 89005 | 89005 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89006 | 89108 | 89006 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89109 | 89187 | 89233 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89188 | 89242 | 89188 | 55 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89243 | 89286 | 89282 | 44 | 40 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89287 | 89293 | 89289 | 7 | 3 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89294 | 89300 | 89296 | 7 | 3 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89301 | 89320 | 89316 | 20 | 16 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89321 | 89346 | 89342 | 26 | 22 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89347 | 89409 | 89403 | 63 | 57 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89410 | 89435 | 89431 | 26 | 22 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89436 | 89442 | 89438 | 7 | 3 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89443 | 89449 | 89445 | 7 | 3 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89450 | 89525 | 89521 | 76 | 72 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89526 | 89570 | 89566 | 45 | 41 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89571 | 89604 | 89623 | 34 | 53 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89605 | 89627 | 89605 | 23 | 1 | `peakResult` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89628 | 89643 | 89688 | 16 | 61 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89644 | 89692 | 89655 | 49 | 12 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89693 | 89729 | 89725 | 37 | 33 | `signal_evaluateWarrant5` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89730 | 89796 | 89791 | 67 | 62 | `signal_evaluateWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89797 | 89935 | 89988 | 139 | 192 | `signal_autoPopulateWarrant7` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 89936 | 89941 | 89939 | 6 | 4 | `angleCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89942 | 89946 | 89949 | 5 | 8 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89947 | 89951 | 89947 | 5 | 1 | `isPedByType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89952 | 89992 | 89955 | 41 | 4 | `countInjury` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 89993 | 90005 | 89999 | 13 | 7 | `signal_detectWarrant7Period` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90006 | 90041 | 90036 | 36 | 31 | `signal_updateWarrant7Display` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90042 | 90054 | 90088 | 13 | 47 | `signal_refreshWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90055 | 90092 | 90055 | 38 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 90093 | 90341 | 90337 | 249 | 245 | `signal_runAnalysis` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90342 | 90397 | 90393 | 56 | 52 | `signal_buildDayResults` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90398 | 90517 | 90513 | 120 | 116 | `signal_updateResultsDisplay` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90518 | 90597 | 90593 | 80 | 76 | `signal_buildDetailedResultsHTML` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90598 | 90613 | 90609 | 16 | 12 | `signal_switchDetailTab` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90614 | 90663 | 90659 | 50 | 46 | `signal_buildDayBreakdownTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90664 | 90713 | 90709 | 50 | 46 | `signal_buildSummaryTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90714 | 90724 | 90799 | 11 | 86 | `signal_buildWarrant1Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90725 | 90803 | 90725 | 79 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90804 | 90809 | 90854 | 6 | 51 | `signal_buildWarrant2Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90810 | 90858 | 90810 | 49 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90859 | 90891 | 90887 | 33 | 29 | `signal_buildWarrant3Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90892 | 90941 | 90937 | 50 | 46 | `signal_buildWarrant4Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90942 | 90978 | 90974 | 37 | 33 | `signal_buildWarrant5Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 90979 | 91026 | 91022 | 48 | 44 | `signal_buildWarrant7Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91027 | 91069 | 91065 | 43 | 39 | `signal_buildHourlyTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91070 | 91115 | 91111 | 46 | 42 | `signal_buildRTTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91116 | 91130 | 91126 | 15 | 11 | `signal_switchResultTab` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91131 | 91221 | 91217 | 91 | 87 | `signal_renderMultiDayTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91222 | 91282 | 91278 | 61 | 57 | `signal_renderHourlyTMC` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91283 | 91357 | 91353 | 75 | 71 | `signal_renderRTAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91358 | 91372 | 91358 | 15 | 1 | `signal_addDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91373 | 91381 | 91377 | 9 | 5 | `signal_removeDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91382 | 91401 | 91397 | 20 | 16 | `signal_clearAllDays` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91402 | 91419 | 91415 | 18 | 14 | `signal_calculateDayTotal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91420 | 91436 | 91432 | 17 | 13 | `signal_editDay` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91437 | 91531 | 91527 | 95 | 91 | `signal_renderTMCGrid` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91532 | 91554 | 91550 | 23 | 19 | `signal_onTMCInput` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91555 | 91575 | 91571 | 21 | 17 | `signal_updateModalRowTotal` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91576 | 91584 | 91580 | 9 | 5 | `signal_saveTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91585 | 91591 | 91587 | 7 | 3 | `signal_closeTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91592 | 91625 | 91621 | 34 | 30 | `signal_updateConfigFromUI` | fn | — | refs:24 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91626 | 91628 | 91659 | 3 | 34 | `signal_populateUIFromConfig` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91629 | 91629 | 91629 | 1 | 1 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 91630 | 91663 | 91630 | 34 | 1 | `setChecked` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91664 | 91702 | 91698 | 39 | 35 | `signal_onTabShow` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91703 | 91902 | 92155 | 200 | 453 | `signal_generatePDFReport` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 91903 | 92017 | 91909 | 115 | 7 | `w4Body` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92018 | 92159 | 92018 | 142 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92160 | 92200 | 92275 | 41 | 116 | `signal_exportCSV` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 92201 | 92258 | 92201 | 58 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92259 | 92279 | 92259 | 21 | 1 | `totalVol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92280 | 92581 | 92562 | 302 | 283 | `signal_generateWordMemo` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 92582 | 92626 | 92622 | 45 | 41 | `signal_readFileContent` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 92627 | 92761 | 92944 | 135 | 318 | `signal_extractSingleFileWithDualAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 92762 | 92948 | 92762 | 187 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92949 | 92963 | 92959 | 15 | 11 | `signal_calculateExtractedTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 92964 | 93024 | 93019 | 61 | 56 | `signal_autoFillFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93025 | 93214 | 93441 | 190 | 417 | `signal_handleBulkFileUpload` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93215 | 93251 | 93220 | 37 | 6 | `hourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93252 | 93252 | 93252 | 1 | 1 | `volumes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93253 | 93325 | 93253 | 73 | 1 | `mean` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93326 | 93339 | 93326 | 14 | 1 | `issueIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93340 | 93342 | 93342 | 3 | 3 | `finalHourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93343 | 93364 | 93343 | 22 | 1 | `allSameHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93365 | 93365 | 93365 | 1 | 1 | `successCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93366 | 93366 | 93366 | 1 | 1 | `correctedCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93367 | 93367 | 93367 | 1 | 1 | `warningCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93368 | 93381 | 93368 | 14 | 1 | `errorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93382 | 93382 | 93382 | 1 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93383 | 93445 | 93383 | 63 | 1 | `resolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93446 | 93459 | 93453 | 14 | 8 | `signal_extractAllWithAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93460 | 93508 | 93504 | 49 | 45 | `signal_onFilesSelected` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93509 | 93567 | 93556 | 59 | 48 | `signal_showAPIKeyWarning` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93568 | 93674 | 93670 | 107 | 103 | `signal_agent3ReExtract` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93675 | 93689 | 93783 | 15 | 109 | `signal_generateDataPreview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93690 | 93727 | 93690 | 38 | 1 | `maxHoursInBatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93728 | 93746 | 93728 | 19 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93747 | 93787 | 93747 | 41 | 1 | `allHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93788 | 93802 | 93798 | 15 | 11 | `signal_togglePreviewRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93803 | 93820 | 93816 | 18 | 14 | `signal_confirmExtractedData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93821 | 93851 | 93847 | 31 | 27 | `signal_enterReviewMode` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93852 | 93876 | 93872 | 25 | 21 | `signal_exitReviewMode` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93877 | 93897 | 93893 | 21 | 17 | `signal_updateReviewQueueIndicator` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93898 | 93948 | 93944 | 51 | 47 | `signal_loadCurrentReviewData` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93949 | 93953 | 94004 | 5 | 56 | `signal_populateTMCGridFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 93954 | 93954 | 93954 | 1 | 1 | `extractedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93955 | 93955 | 93955 | 1 | 1 | `hasEarlyHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93956 | 93966 | 93956 | 11 | 1 | `hasLateHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93967 | 94008 | 93967 | 42 | 1 | `allWithin12hr` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94009 | 94055 | 94049 | 47 | 41 | `signal_doPopulateTMCValues` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94056 | 94132 | 94128 | 77 | 73 | `signal_populateTMCFromDayData` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94133 | 94154 | 94150 | 22 | 18 | `signal_skipCurrentReview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94155 | 94178 | 94174 | 24 | 20 | `signal_advanceReviewQueue` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94179 | 94201 | 94184 | 23 | 6 | `signal_rejectExtractedData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94202 | 94237 | 94233 | 36 | 32 | `speedstudy_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94238 | 94265 | 94261 | 28 | 24 | `speedstudy_generateTableRows` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94266 | 94299 | 94295 | 34 | 30 | `speedstudy_updateTotals` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 94300 | 94352 | 94348 | 53 | 49 | `speedstudy_setCountType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94353 | 94371 | 94367 | 19 | 15 | `speedstudy_updateConfigFromUI` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 94372 | 94391 | 94386 | 20 | 15 | `speedstudy_clearForm` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94392 | 94410 | 94406 | 19 | 15 | `speedstudy_initTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94411 | 94470 | 94466 | 60 | 56 | `speedstudy_addCurrentDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94471 | 94516 | 94512 | 46 | 42 | `speedstudy_renderDayCards` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94517 | 94526 | 94522 | 10 | 6 | `speedstudy_removeDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94527 | 94537 | 94533 | 11 | 7 | `speedstudy_updateDayCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94538 | 94553 | 94549 | 16 | 12 | `speedstudy_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94554 | 94580 | 94576 | 27 | 23 | `speedstudy_runAnalysis` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 94581 | 94696 | 94692 | 116 | 112 | `speedstudy_runAnalysisInternal` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 94697 | 94710 | 94706 | 14 | 10 | `speedstudy_getRecommendationReason` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94711 | 94805 | 94801 | 95 | 91 | `speedstudy_displayResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94806 | 94847 | 94842 | 42 | 37 | `speedstudy_generateHistogram` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94848 | 94942 | 95021 | 95 | 174 | `speedstudy_loadCrashData` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 94943 | 94943 | 94943 | 1 | 1 | `locWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94944 | 94946 | 94944 | 3 | 1 | `routeWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94947 | 95025 | 94949 | 79 | 3 | `allWordsMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95026 | 95053 | 95061 | 28 | 36 | `findMatchingRoute` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95054 | 95065 | 95056 | 12 | 3 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95066 | 95094 | 95089 | 29 | 24 | `speedstudy_calculateCrashRate` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 95095 | 95136 | 95132 | 42 | 38 | `speedstudy_updateLocationSourceIndicator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95137 | 95174 | 95169 | 38 | 33 | `speedstudy_clearLocationBinding` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95175 | 95263 | 95259 | 89 | 85 | `speedstudy_autoPopulateFromRoadProps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95264 | 95282 | 95278 | 19 | 15 | `speedstudy_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95283 | 95291 | 95287 | 9 | 5 | `speedstudy_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95292 | 95307 | 95303 | 16 | 12 | `speedstudy_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95308 | 95347 | 95340 | 40 | 33 | `speedstudy_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95348 | 95370 | 95366 | 23 | 19 | `speedstudy_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95371 | 95426 | 95422 | 56 | 52 | `speedstudy_readFileContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95427 | 95543 | 95685 | 117 | 259 | `speedstudy_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95544 | 95689 | 95544 | 146 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95690 | 95690 | 95874 | 1 | 185 | `speedstudy_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95691 | 95878 | 95691 | 188 | 1 | `files` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95879 | 95918 | 95914 | 40 | 36 | `speedstudy_populateGridFromExtraction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95919 | 95930 | 95926 | 12 | 8 | `speedstudy_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95931 | 95939 | 95935 | 9 | 5 | `speedstudy_toggleStudyType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95940 | 95952 | 95948 | 13 | 9 | `speedstudy_importFromTMC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95953 | 96091 | 96087 | 139 | 135 | `speedstudy_newStudy` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96092 | 96329 | 96553 | 238 | 462 | `speedstudy_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96330 | 96332 | 96345 | 3 | 16 | `dayRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96333 | 96333 | 96333 | 1 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96334 | 96334 | 96334 | 1 | 1 | `speeds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96335 | 96365 | 96335 | 31 | 1 | `avgP85` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96366 | 96557 | 96374 | 192 | 9 | `hourlyRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96558 | 96634 | 96697 | 77 | 140 | `speedstudy_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96635 | 96701 | 96635 | 67 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96702 | 96710 | 96706 | 9 | 5 | `speedstudy_linkToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 96711 | 96745 | 96741 | 35 | 31 | `speedstudy_saveData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96746 | 96797 | 96792 | 52 | 47 | `speedstudy_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96798 | 96810 | 96805 | 13 | 8 | `speedstudy_scheduleAutoSave` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 96811 | 96850 | 96908 | 40 | 98 | `speedstudy_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96851 | 96920 | 96851 | 70 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96921 | 96931 | 96927 | 11 | 7 | `streetlight_onTabShow` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96932 | 96994 | 96990 | 63 | 59 | `streetlight_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 96995 | 97044 | 97040 | 50 | 46 | `streetlight_analyzeCrashesByLight` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 97045 | 97075 | 97071 | 31 | 27 | `streetlight_calculateMetrics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97076 | 97105 | 97163 | 30 | 88 | `streetlight_updateUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97106 | 97106 | 97113 | 1 | 8 | `conditions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97107 | 97107 | 97107 | 1 | 1 | `aIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97108 | 97167 | 97108 | 60 | 1 | `bIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97168 | 97208 | 97204 | 41 | 37 | `streetlight_evaluateWarrant` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 97209 | 97239 | 97266 | 31 | 58 | `streetlight_updateWarrantUI` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 97240 | 97267 | 97258 | 28 | 19 | `updateCriterion` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 97268 | 97279 | 97278 | 12 | 11 | `streetlight_toggleAdditionalFactors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97280 | 97290 | 97289 | 11 | 10 | `streetlight_updateAdditionalFactors` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 97291 | 97302 | 97301 | 12 | 11 | `streetlight_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97303 | 97326 | 97325 | 24 | 23 | `streetlight_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97327 | 97507 | 97506 | 181 | 180 | `streetlight_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97508 | 97568 | 97567 | 61 | 60 | `streetlight_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97569 | 97611 | 97610 | 43 | 42 | `streetlight_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97612 | 97632 | 97631 | 21 | 20 | `streetlight_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97633 | 97684 | 97676 | 52 | 44 | `streetlight_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97685 | 97764 | 97799 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97765 | 97765 | 97765 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97766 | 97803 | 97766 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97804 | 97887 | 98085 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97888 | 97888 | 97888 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97889 | 98018 | 97889 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98019 | 98019 | 98019 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98020 | 98086 | 98020 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98087 | 98109 | 98108 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 98110 | 98149 | 98140 | 40 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 98150 | 98194 | 98190 | 45 | 41 | `trafficdata_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98195 | 98217 | 98213 | 23 | 19 | `trafficdata_updateConfig` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 98218 | 98257 | 98253 | 40 | 36 | `trafficdata_syncFromWarrantSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98258 | 98276 | 98272 | 19 | 15 | `trafficdata_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98277 | 98286 | 98282 | 10 | 6 | `trafficdata_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98287 | 98295 | 98291 | 9 | 5 | `trafficdata_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98296 | 98303 | 98299 | 8 | 4 | `trafficdata_setCountType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98304 | 98318 | 98314 | 15 | 11 | `trafficdata_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98319 | 98348 | 98344 | 30 | 26 | `trafficdata_toggleSection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 98349 | 98421 | 98417 | 73 | 69 | `trafficdata_renderTmcTable` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 98422 | 98438 | 98434 | 17 | 13 | `trafficdata_updateTmcTotals` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98439 | 98467 | 98463 | 29 | 25 | `trafficdata_setTmcCountType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98468 | 98482 | 98477 | 15 | 10 | `trafficdata_updateTmcDate` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98483 | 98548 | 98544 | 66 | 62 | `trafficdata_addTmcDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98549 | 98570 | 98566 | 22 | 18 | `trafficdata_clearTmcForm` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 98571 | 98607 | 98603 | 37 | 33 | `trafficdata_showDaysSummary` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98608 | 98622 | 98618 | 15 | 11 | `calculateDayTotalVolume` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98623 | 98636 | 98632 | 14 | 10 | `trafficdata_deleteDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98637 | 98657 | 98653 | 21 | 17 | `trafficdata_updateDayCounts` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 98658 | 98665 | 98661 | 8 | 4 | `trafficdata_updatePedCounts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 98666 | 98698 | 98694 | 33 | 29 | `trafficdata_addPedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98699 | 98724 | 98720 | 26 | 22 | `trafficdata_saveSpeedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98725 | 98807 | 98803 | 83 | 79 | `trafficdata_updateReadiness` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 98808 | 98829 | 98825 | 22 | 18 | `updateReadinessBar` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 98830 | 98876 | 98872 | 47 | 43 | `trafficdata_convertTmcToTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98877 | 98910 | 98906 | 34 | 30 | `trafficdata_convertPeakToAADT` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98911 | 98934 | 98930 | 24 | 20 | `trafficdata_calcRoundaboutVolumes` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98935 | 98992 | 98988 | 58 | 54 | `trafficdata_refreshCrashData` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 98993 | 99025 | 99021 | 33 | 29 | `trafficdata_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99026 | 99052 | 99048 | 27 | 23 | `trafficdata_saveStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99053 | 99068 | 99064 | 16 | 12 | `trafficdata_exportStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99069 | 99075 | 99071 | 7 | 3 | `trafficdata_loadStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99076 | 99093 | 99079 | 18 | 4 | `trafficdata_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99094 | 99131 | 99127 | 38 | 34 | `trafficdata_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99132 | 99167 | 99163 | 36 | 32 | `trafficdata_showAPIKeyWarning` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99168 | 99289 | 99317 | 122 | 150 | `trafficdata_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99290 | 99290 | 99290 | 1 | 1 | `docTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99291 | 99321 | 99293 | 31 | 3 | `dominantType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99322 | 99409 | 99431 | 88 | 110 | `trafficdata_extractSingleFile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99410 | 99435 | 99410 | 26 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99436 | 99454 | 99450 | 19 | 15 | `trafficdata_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99455 | 99475 | 99471 | 21 | 17 | `trafficdata_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99476 | 99496 | 99492 | 21 | 17 | `trafficdata_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99497 | 99532 | 99528 | 36 | 32 | `trafficdata_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99533 | 99561 | 99557 | 29 | 25 | `trafficdata_exitReviewMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99562 | 99577 | 99573 | 16 | 12 | `trafficdata_updateReviewQueueIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99578 | 99633 | 99628 | 56 | 51 | `trafficdata_loadCurrentReviewData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99634 | 99674 | 99670 | 41 | 37 | `trafficdata_loadHourlyDataIntoGrid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99675 | 99682 | 99678 | 8 | 4 | `trafficdata_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99683 | 99693 | 99689 | 11 | 7 | `trafficdata_updateRtAdjustment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99694 | 99737 | 99727 | 44 | 34 | `trafficdata_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99738 | 99850 | 99845 | 113 | 108 | `trafficdata_pushToSignal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99851 | 99955 | 99950 | 105 | 100 | `trafficdata_pushToStopSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99956 | 100059 | 100054 | 104 | 99 | `trafficdata_pushToRoundabout` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 100060 | 100137 | 100132 | 78 | 73 | `trafficdata_pushToPedCrossing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100138 | 100330 | 100218 | 193 | 81 | `trafficdata_pushToSpeedStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100331 | 100479 | 100459 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100480 | 100488 | 100613 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 100489 | 100615 | 100489 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100616 | 100632 | 100621 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100633 | 100639 | 100637 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100640 | 100650 | 100648 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100651 | 100669 | 100664 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 100670 | 100683 | 100682 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100684 | 100689 | 100688 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100690 | 100700 | 100699 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 100701 | 100907 | 100906 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100908 | 100959 | 100958 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100960 | 101020 | 101019 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101021 | 101065 | 101064 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101066 | 101079 | 101078 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101080 | 101093 | 101092 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101094 | 101134 | 101133 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101135 | 101163 | 101162 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101164 | 101239 | 101212 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101240 | 101253 | 101252 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101254 | 101260 | 101259 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101261 | 101303 | 101302 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101304 | 101308 | 101307 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 101309 | 101337 | 101336 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101338 | 101370 | 101369 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101371 | 101473 | 101373 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101474 | 101720 | 101485 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 101721 | 101809 | 101721 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101810 | 101837 | 101858 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 101838 | 101866 | 101838 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101867 | 101903 | 101893 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 101904 | 101937 | 101932 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 101938 | 101962 | 101956 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 101963 | 101994 | 101989 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101995 | 102063 | 102059 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 102064 | 102115 | 102111 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 102116 | 102130 | 102126 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 102131 | 102148 | 102144 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 102149 | 102166 | 102160 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 102167 | 102252 | 102201 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102253 | 102257 | 102323 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102258 | 102275 | 102258 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102276 | 102293 | 102276 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102294 | 102328 | 102294 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102329 | 102640 | 102343 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102641 | 102689 | 102641 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102690 | 102767 | 102690 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102768 | 102849 | 102845 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102850 | 102914 | 102910 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102915 | 102931 | 102927 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102932 | 102962 | 102957 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 102963 | 103029 | 103025 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 103030 | 103080 | 103076 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103081 | 103095 | 103091 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103096 | 103112 | 103108 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 103113 | 103128 | 103124 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103129 | 103309 | 103163 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103310 | 103321 | 103319 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 103322 | 103835 | 103331 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103836 | 103997 | 103991 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103998 | 104047 | 104043 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104048 | 104155 | 104148 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 104156 | 104200 | 104195 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104201 | 104315 | 104309 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104316 | 104378 | 104372 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104379 | 104479 | 104475 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104480 | 104577 | 104573 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 104578 | 104588 | 104584 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 104589 | 104646 | 104642 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 104647 | 104657 | 104653 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 104658 | 104700 | 104696 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104701 | 104735 | 104731 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104736 | 104747 | 104743 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104748 | 104756 | 104752 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104757 | 104794 | 104790 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104795 | 104809 | 104805 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104810 | 104830 | 104826 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104831 | 104843 | 104839 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104844 | 104856 | 104852 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104857 | 104886 | 104882 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 104887 | 104907 | 104903 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104908 | 104914 | 104910 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104915 | 104965 | 104961 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104966 | 104999 | 104995 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105000 | 105019 | 105014 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105020 | 105145 | 105140 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105146 | 105209 | 105205 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105210 | 105221 | 105216 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105222 | 105251 | 105250 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105252 | 105262 | 105261 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 105263 | 105273 | 105272 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105274 | 105284 | 105283 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105285 | 105295 | 105294 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105296 | 105303 | 105302 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 105304 | 105320 | 105315 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105321 | 105323 | 105352 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105324 | 105353 | 105330 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105354 | 105370 | 105369 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105371 | 105396 | 105395 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105397 | 105419 | 105418 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105420 | 105437 | 105436 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105438 | 105448 | 105443 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105449 | 105460 | 105459 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105461 | 105480 | 105479 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 105481 | 105515 | 105510 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 105516 | 105532 | 105531 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105533 | 105588 | 105587 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105589 | 105640 | 105639 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105641 | 105691 | 105710 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105692 | 105711 | 105694 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 105712 | 105729 | 105745 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105730 | 105746 | 105730 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 105747 | 105773 | 105772 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105774 | 105782 | 105817 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105783 | 105818 | 105786 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105819 | 105822 | 105832 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105823 | 105825 | 105825 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105826 | 105833 | 105830 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105834 | 105853 | 105852 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105854 | 105859 | 105882 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105860 | 105883 | 105862 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105884 | 105897 | 105896 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105898 | 105904 | 105903 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105905 | 105909 | 105908 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105910 | 105964 | 105963 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105965 | 106023 | 106022 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106024 | 106050 | 106049 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106051 | 106056 | 106055 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106057 | 106062 | 106067 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106063 | 106068 | 106063 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106069 | 106117 | 106112 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106118 | 106118 | 106257 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 106119 | 106168 | 106119 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106169 | 106265 | 106169 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106266 | 106300 | 106361 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 106301 | 106363 | 106301 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106364 | 106375 | 106370 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106376 | 106386 | 106441 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 106387 | 106442 | 106390 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106443 | 106453 | 106633 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 106454 | 106463 | 106456 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106464 | 106512 | 106464 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106513 | 106513 | 106513 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106514 | 106514 | 106514 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106515 | 106525 | 106515 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106526 | 106527 | 106526 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106528 | 106528 | 106528 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106529 | 106530 | 106529 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106531 | 106531 | 106531 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106532 | 106638 | 106532 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106639 | 106642 | 106659 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106643 | 106666 | 106643 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106667 | 106677 | 106723 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106678 | 106724 | 106680 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106725 | 106729 | 106728 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106730 | 106740 | 106739 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 106741 | 106756 | 106755 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 106757 | 106761 | 106760 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106762 | 106777 | 106772 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 106778 | 106792 | 106791 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106793 | 106802 | 106801 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106803 | 106815 | 106814 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106816 | 106827 | 106836 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106828 | 106837 | 106828 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106838 | 106859 | 106858 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106860 | 106888 | 106887 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106889 | 106896 | 106976 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106897 | 106908 | 106897 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106909 | 106922 | 106912 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106923 | 106961 | 106960 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 106962 | 106983 | 106962 | 22 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106984 | 107027 | 107026 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107028 | 107033 | 107120 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 107034 | 107121 | 107034 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107122 | 107128 | 107127 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 107129 | 107132 | 107145 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107133 | 107150 | 107133 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107151 | 107151 | 107178 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 107152 | 107173 | 107152 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107174 | 107186 | 107174 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107187 | 107237 | 107469 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 107238 | 107306 | 107246 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107307 | 107335 | 107325 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107336 | 107385 | 107345 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107386 | 107394 | 107393 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 107395 | 107470 | 107402 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107471 | 107489 | 107487 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107490 | 107622 | 107506 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107623 | 107648 | 107635 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 107649 | 107663 | 107662 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107664 | 107728 | 107727 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107729 | 107781 | 107780 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107782 | 107789 | 107788 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 107790 | 107801 | 107800 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107802 | 107843 | 107834 | 42 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107844 | 107878 | 107872 | 35 | 29 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 107879 | 107916 | 107911 | 38 | 33 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 107917 | 107986 | 108050 | 70 | 134 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 107987 | 108054 | 107989 | 68 | 3 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108055 | 108123 | 108119 | 69 | 65 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108124 | 108141 | 108137 | 18 | 14 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108142 | 108153 | 108149 | 12 | 8 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108154 | 108172 | 108161 | 19 | 8 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108173 | 108254 | 108250 | 82 | 78 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108255 | 108271 | 108265 | 17 | 11 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108272 | 108331 | 108327 | 60 | 56 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108332 | 108350 | 108340 | 19 | 9 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108351 | 108403 | 108402 | 53 | 52 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108404 | 108426 | 108412 | 23 | 9 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108427 | 108456 | 108521 | 30 | 95 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108457 | 108522 | 108459 | 66 | 3 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108523 | 108539 | 108538 | 17 | 16 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108540 | 108548 | 108547 | 9 | 8 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108549 | 108560 | 108556 | 12 | 8 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108561 | 108571 | 108567 | 11 | 7 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108572 | 108615 | 108609 | 44 | 38 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108616 | 108669 | 108664 | 54 | 49 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108670 | 108682 | 108673 | 13 | 4 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 108683 | 108719 | 108714 | 37 | 32 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 108720 | 108831 | 109019 | 112 | 300 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 108832 | 108841 | 108900 | 10 | 69 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108842 | 108865 | 108846 | 24 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108866 | 108960 | 108866 | 95 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108961 | 108961 | 108961 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108962 | 109023 | 108962 | 62 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109024 | 109131 | 109127 | 108 | 104 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109132 | 109147 | 109143 | 16 | 12 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 109148 | 109159 | 109155 | 12 | 8 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109160 | 109192 | 109187 | 33 | 28 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109193 | 109255 | 109274 | 63 | 82 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109256 | 109279 | 109261 | 24 | 6 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109280 | 109330 | 109325 | 51 | 46 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109331 | 109354 | 109349 | 24 | 19 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109355 | 109413 | 109406 | 59 | 52 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109414 | 109472 | 109803 | 59 | 390 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 109473 | 109559 | 109504 | 87 | 32 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109560 | 109566 | 109564 | 7 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109567 | 109586 | 109676 | 20 | 110 | `fetchWithRetry` | async const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109587 | 109626 | 109587 | 40 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109627 | 109741 | 109627 | 115 | 1 | `postTimeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109742 | 109742 | 109742 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109743 | 109808 | 109743 | 66 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109809 | 109828 | 109823 | 20 | 15 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109829 | 109835 | 109856 | 7 | 28 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109836 | 109861 | 109850 | 26 | 15 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109862 | 109871 | 109866 | 10 | 5 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109872 | 109904 | 109899 | 33 | 28 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 109905 | 109990 | 110106 | 86 | 202 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 109991 | 110110 | 110102 | 120 | 112 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110111 | 110164 | 110160 | 54 | 50 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110165 | 110190 | 110186 | 26 | 22 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 110191 | 110212 | 110208 | 22 | 18 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 110213 | 110226 | 110222 | 14 | 10 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110227 | 110253 | 110236 | 27 | 10 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110254 | 110277 | 110344 | 24 | 91 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 110278 | 110309 | 110278 | 32 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 110310 | 110350 | 110310 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 110351 | 110386 | 110371 | 36 | 21 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110387 | 110402 | 110401 | 16 | 15 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 110403 | 110492 | 110488 | 90 | 86 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110493 | 110509 | 110589 | 17 | 97 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110510 | 110600 | 110531 | 91 | 22 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 110601 | 110654 | 110649 | 54 | 49 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 110655 | 110685 | 110680 | 31 | 26 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110686 | 110714 | 110708 | 29 | 23 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110715 | 110766 | 110761 | 52 | 47 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110767 | 110994 | 110990 | 228 | 224 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110995 | 111009 | 111005 | 15 | 11 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111010 | 111027 | 111022 | 18 | 13 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111028 | 111058 | 111242 | 31 | 215 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111059 | 111059 | 111059 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111060 | 111071 | 111060 | 12 | 1 | `colors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111072 | 111180 | 111072 | 109 | 1 | `totalData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111181 | 111192 | 111181 | 12 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111193 | 111208 | 111193 | 16 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111209 | 111246 | 111209 | 38 | 1 | `epdoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111247 | 111274 | 111302 | 28 | 56 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111275 | 111311 | 111282 | 37 | 8 | `totals` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111312 | 111359 | 111355 | 48 | 44 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111360 | 111366 | 111362 | 7 | 3 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111367 | 111383 | 111374 | 17 | 8 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111384 | 111394 | 111607 | 11 | 224 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111395 | 111395 | 111395 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111396 | 111611 | 111396 | 216 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111612 | 111621 | 111617 | 10 | 6 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 111622 | 111663 | 111659 | 42 | 38 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 111664 | 111688 | 111684 | 25 | 21 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111689 | 111708 | 111704 | 20 | 16 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111709 | 111712 | 111729 | 4 | 21 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111713 | 111738 | 111713 | 26 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 111739 | 111757 | 112024 | 19 | 286 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111758 | 111758 | 111758 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111759 | 112028 | 111759 | 270 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112029 | 112092 | 112071 | 64 | 43 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112093 | 112289 | 112285 | 197 | 193 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 112290 | 112308 | 112304 | 19 | 15 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112309 | 112334 | 112330 | 26 | 22 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112335 | 112423 | 112419 | 89 | 85 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 112424 | 112469 | 112465 | 46 | 42 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112470 | 112476 | 112472 | 7 | 3 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112477 | 112483 | 112479 | 7 | 3 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112484 | 112509 | 112505 | 26 | 22 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112510 | 112595 | 112591 | 86 | 82 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112596 | 112612 | 112608 | 17 | 13 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112613 | 112645 | 112641 | 33 | 29 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112646 | 112744 | 112735 | 99 | 90 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 112745 | 112763 | 112759 | 19 | 15 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112764 | 112883 | 112879 | 120 | 116 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 112884 | 112900 | 112896 | 17 | 13 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 112901 | 112912 | 112908 | 12 | 8 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112913 | 112924 | 112920 | 12 | 8 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112925 | 112931 | 112927 | 7 | 3 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112932 | 112939 | 112935 | 8 | 4 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 112940 | 112950 | 112946 | 11 | 7 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 112951 | 112964 | 112960 | 14 | 10 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112965 | 112992 | 112984 | 28 | 20 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 112993 | 113017 | 113013 | 25 | 21 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 113018 | 113093 | 113036 | 76 | 19 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 113094 | 113157 | 113153 | 64 | 60 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 113158 | 113165 | 113160 | 8 | 3 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113166 | 113183 | 113178 | 18 | 13 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 113184 | 113208 | 113200 | 25 | 17 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 113209 | 113236 | 113232 | 28 | 24 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113237 | 113250 | 113246 | 14 | 10 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113251 | 113295 | 113291 | 45 | 41 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113296 | 113322 | 113318 | 27 | 23 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113323 | 113339 | 113334 | 17 | 12 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113340 | 113361 | 113356 | 22 | 17 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 113362 | 113547 | 113543 | 186 | 182 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 113548 | 113559 | 113555 | 12 | 8 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 113560 | 113740 | 113736 | 181 | 177 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 113741 | 113752 | 113748 | 12 | 8 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 113753 | 113766 | 113762 | 14 | 10 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 113767 | 113800 | 113781 | 34 | 15 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 113801 | 113854 | 113850 | 54 | 50 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 113855 | 113871 | 113867 | 17 | 13 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113872 | 113918 | 114007 | 47 | 136 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113919 | 114011 | 113919 | 93 | 1 | `sampleValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114012 | 114027 | 114023 | 16 | 12 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 114028 | 114081 | 114077 | 54 | 50 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 114082 | 114203 | 114199 | 122 | 118 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114204 | 114216 | 114211 | 13 | 8 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 114217 | 114286 | 114276 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 114287 | 114316 | 114296 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 114317 | 114385 | 114356 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 114386 | 114393 | 114392 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114394 | 114430 | 114425 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114431 | 114451 | 114434 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114452 | 114464 | 114460 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114465 | 114542 | 114537 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 114543 | 114560 | 114547 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114561 | 114584 | 114580 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 114585 | 114592 | 114588 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114593 | 114605 | 114898 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 114606 | 114612 | 114606 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114613 | 114721 | 114613 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 114722 | 114732 | 114728 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114733 | 114790 | 114785 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114791 | 114905 | 114791 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114906 | 114924 | 115130 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 114925 | 114997 | 114927 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114998 | 115134 | 115000 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115135 | 115153 | 115149 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 115154 | 115193 | 115188 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115194 | 115208 | 115203 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115209 | 115209 | 115256 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 115210 | 115213 | 115210 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115214 | 115264 | 115217 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115265 | 115273 | 115579 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115274 | 115292 | 115274 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115293 | 115428 | 115313 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115429 | 115450 | 115429 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115451 | 115467 | 115459 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 115468 | 115492 | 115475 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 115493 | 115583 | 115496 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 115584 | 115606 | 115602 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115607 | 115609 | 115648 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115610 | 115652 | 115610 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115653 | 115654 | 115699 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115655 | 115668 | 115655 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115669 | 115707 | 115686 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 115708 | 115713 | 115930 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115714 | 115767 | 115719 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115768 | 115784 | 115776 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 115785 | 115856 | 115792 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 115857 | 115903 | 115860 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 115904 | 115906 | 115904 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115907 | 115934 | 115910 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115935 | 115963 | 115959 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115964 | 115965 | 115992 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115966 | 115996 | 115970 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115997 | 115998 | 116041 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115999 | 116015 | 116003 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116016 | 116062 | 116029 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116063 | 116100 | 116096 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116101 | 116136 | 116132 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116137 | 116154 | 116150 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116155 | 116172 | 116168 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 116173 | 116184 | 116178 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116185 | 116268 | 116491 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116269 | 116289 | 116273 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116290 | 116308 | 116290 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 116309 | 116319 | 116317 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116320 | 116386 | 116380 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116387 | 116405 | 116394 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116406 | 116495 | 116411 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116496 | 116509 | 116551 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116510 | 116555 | 116510 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116556 | 116618 | 116614 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116619 | 116653 | 116623 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116654 | 116692 | 116671 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116693 | 116702 | 116698 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116703 | 116783 | 116778 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 116784 | 116791 | 116786 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116792 | 116816 | 116797 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116817 | 116830 | 116819 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116831 | 116847 | 116874 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116848 | 116878 | 116848 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116879 | 116896 | 116892 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 116897 | 116904 | 116900 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116905 | 116921 | 116917 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 116922 | 116958 | 116954 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116959 | 116984 | 117006 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116985 | 117013 | 116996 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117014 | 117073 | 117067 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117074 | 117121 | 117116 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 117122 | 117126 | 117195 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117127 | 117199 | 117127 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117200 | 117224 | 117220 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117225 | 117320 | 117316 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117321 | 117336 | 117570 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 117337 | 117455 | 117340 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117456 | 117574 | 117516 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 117575 | 117620 | 117616 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 117621 | 117632 | 117628 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117633 | 117646 | 117642 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117647 | 117682 | 117676 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117683 | 117733 | 117728 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117734 | 117811 | 117800 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117812 | 117839 | 117877 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117840 | 117895 | 117842 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117896 | 117914 | 117910 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117915 | 117958 | 117946 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 117959 | 117965 | 117961 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 117966 | 118024 | 118020 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 118025 | 118032 | 118083 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 118033 | 118087 | 118033 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118088 | 118138 | 118177 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118139 | 118159 | 118142 | 21 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 118160 | 118189 | 118167 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 118190 | 118219 | 118215 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 118220 | 118255 | 118225 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 118256 | 118397 | 118291 | 142 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 118398 | 118405 | 118403 | 8 | 6 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118406 | 118419 | 118415 | 14 | 10 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118420 | 118424 | 118423 | 5 | 4 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118425 | 118429 | 118427 | 5 | 3 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118430 | 118471 | 118470 | 42 | 41 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118472 | 118477 | 118476 | 6 | 5 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118478 | 118488 | 118486 | 11 | 9 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118489 | 118549 | 118547 | 61 | 59 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118550 | 118574 | 118572 | 25 | 23 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118575 | 118592 | 118590 | 18 | 16 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118593 | 118661 | 118693 | 69 | 101 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118662 | 118694 | 118669 | 33 | 8 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 118695 | 118704 | 118703 | 10 | 9 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118705 | 118745 | 118742 | 41 | 38 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118746 | 118790 | 118789 | 45 | 44 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118791 | 118838 | 118837 | 48 | 47 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118839 | 118909 | 118908 | 71 | 70 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118910 | 118932 | 118931 | 23 | 22 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118933 | 118953 | 118952 | 21 | 20 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118954 | 118974 | 118973 | 21 | 20 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118975 | 118995 | 118994 | 21 | 20 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 118996 | 119022 | 119020 | 27 | 25 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119023 | 119084 | 119083 | 62 | 61 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119085 | 119152 | 119151 | 68 | 67 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119153 | 119167 | 119166 | 15 | 14 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119168 | 119183 | 119182 | 16 | 15 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119184 | 119201 | 119199 | 18 | 16 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119202 | 119206 | 119205 | 5 | 4 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119207 | 119273 | 119272 | 67 | 66 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119274 | 119351 | 119350 | 78 | 77 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119352 | 119361 | 119360 | 10 | 9 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119362 | 119365 | 119364 | 4 | 3 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119366 | 119381 | 119379 | 16 | 14 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119382 | 119414 | 119412 | 33 | 31 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119415 | 119451 | 119450 | 37 | 36 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119452 | 119494 | 119493 | 43 | 42 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119495 | 119498 | 119497 | 4 | 3 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119499 | 119536 | 119535 | 38 | 37 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 119537 | 120029 | 119666 | 493 | 130 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
