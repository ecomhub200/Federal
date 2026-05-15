# index.html function inventory — PART 4 (L120001–end)

Snapshot: 2026-05-15 · source `app/index.html` (159387 lines)

Declarations in this part: **881**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.

| Start L | End L | LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|
| 120127 | 120438 | 312 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120439 | 120538 | 100 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120539 | 120546 | 8 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 120547 | 120583 | 37 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 120584 | 120605 | 22 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 120606 | 120615 | 10 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 120616 | 120626 | 11 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 120627 | 120665 | 39 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120666 | 120738 | 73 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 120739 | 120868 | 130 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 120869 | 120911 | 43 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 120912 | 120989 | 78 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 120990 | 121002 | 13 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121003 | 121042 | 40 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 121043 | 121078 | 36 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 121079 | 121102 | 24 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121103 | 121115 | 13 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121116 | 121153 | 38 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 121154 | 121209 | 56 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121210 | 121263 | 54 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 121264 | 121374 | 111 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121375 | 121393 | 19 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 121394 | 121450 | 57 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 121451 | 121460 | 10 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121461 | 121568 | 108 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 121569 | 121621 | 53 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 121622 | 121651 | 30 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121652 | 121739 | 88 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 121740 | 121757 | 18 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121758 | 121814 | 57 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 121815 | 121947 | 133 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 121948 | 121961 | 14 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 121962 | 121996 | 35 | `injuryCount` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 121997 | 122051 | 55 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122052 | 122106 | 55 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122107 | 122242 | 136 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122243 | 122274 | 32 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 122275 | 122283 | 9 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 122284 | 122328 | 45 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 122329 | 122329 | 1 | `collType` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 122330 | 122417 | 88 | `severity` | const arrow | — | refs:1658 | Unassigned | `app/modules/app/unassigned.js` |
| 122418 | 122421 | 4 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 122422 | 122426 | 5 | `setVal` | const arrow | — | refs:51 | Unassigned | `app/modules/app/unassigned.js` |
| 122427 | 122456 | 30 | `setText` | const arrow | — | refs:667 | Unassigned | `app/modules/app/unassigned.js` |
| 122457 | 122471 | 15 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122472 | 122490 | 19 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 122491 | 122497 | 7 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122498 | 122534 | 37 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122535 | 122604 | 70 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122605 | 122629 | 25 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122630 | 122657 | 28 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 122658 | 122763 | 106 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 122764 | 122911 | 148 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 122912 | 123029 | 118 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 123030 | 123046 | 17 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 123047 | 123436 | 390 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 123437 | 123471 | 35 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123472 | 123504 | 33 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123505 | 123521 | 17 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 123522 | 123598 | 77 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 123599 | 123632 | 34 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 123633 | 123655 | 23 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123656 | 123682 | 27 | `cacheAge` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 123683 | 123754 | 72 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 123755 | 123778 | 24 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 123779 | 123795 | 17 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 123796 | 123824 | 29 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 123825 | 123903 | 79 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 123904 | 123920 | 17 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 123921 | 124160 | 240 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 124161 | 124339 | 179 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 124340 | 124473 | 134 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124474 | 124517 | 44 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124518 | 124524 | 7 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124525 | 124531 | 7 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124532 | 124551 | 20 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124552 | 124577 | 26 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124578 | 124640 | 63 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124641 | 124666 | 26 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124667 | 124673 | 7 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124674 | 124680 | 7 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124681 | 124756 | 76 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124757 | 124801 | 45 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124802 | 124858 | 57 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124859 | 124874 | 16 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124875 | 124878 | 4 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124879 | 124923 | 45 | `t` | const arrow | — | refs:641078 | Unassigned | `app/modules/app/unassigned.js` |
| 124924 | 124960 | 37 | `signal_evaluateWarrant5` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 124961 | 125027 | 67 | `signal_evaluateWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125028 | 125039 | 12 | `signal_autoPopulateWarrant7` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125040 | 125167 | 128 | `t` | const arrow | — | refs:641078 | Unassigned | `app/modules/app/unassigned.js` |
| 125168 | 125173 | 6 | `type` | const arrow | — | refs:4148 | Unassigned | `app/modules/app/unassigned.js` |
| 125174 | 125182 | 9 | `type` | const arrow | — | refs:4148 | Unassigned | `app/modules/app/unassigned.js` |
| 125183 | 125183 | 1 | `countInjury` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 125184 | 125223 | 40 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 125224 | 125227 | 4 | `signal_detectWarrant7Period` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125228 | 125236 | 9 | `months` | const arrow | — | refs:118 | Unassigned | `app/modules/app/unassigned.js` |
| 125237 | 125272 | 36 | `signal_updateWarrant7Display` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125273 | 125285 | 13 | `signal_refreshWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125286 | 125323 | 38 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 125324 | 125350 | 27 | `signal_runAnalysis` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125351 | 125366 | 16 | `isMinor` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 125367 | 125572 | 206 | `isMinor` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 125573 | 125628 | 56 | `signal_buildDayResults` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125629 | 125748 | 120 | `signal_updateResultsDisplay` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125749 | 125828 | 80 | `signal_buildDetailedResultsHTML` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125829 | 125844 | 16 | `signal_switchDetailTab` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125845 | 125894 | 50 | `signal_buildDayBreakdownTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125895 | 125944 | 50 | `signal_buildSummaryTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 125945 | 126034 | 90 | `signal_buildWarrant1Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126035 | 126089 | 55 | `signal_buildWarrant2Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126090 | 126122 | 33 | `signal_buildWarrant3Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126123 | 126172 | 50 | `signal_buildWarrant4Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126173 | 126209 | 37 | `signal_buildWarrant5Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126210 | 126257 | 48 | `signal_buildWarrant7Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126258 | 126300 | 43 | `signal_buildHourlyTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126301 | 126346 | 46 | `signal_buildRTTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126347 | 126361 | 15 | `signal_switchResultTab` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126362 | 126452 | 91 | `signal_renderMultiDayTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126453 | 126479 | 27 | `signal_renderHourlyTMC` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126480 | 126480 | 1 | `vol` | const arrow | — | refs:384 | Unassigned | `app/modules/app/unassigned.js` |
| 126481 | 126513 | 33 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 126514 | 126556 | 43 | `signal_renderRTAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126557 | 126559 | 3 | `isMinor` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 126560 | 126588 | 29 | `vol` | const arrow | — | refs:384 | Unassigned | `app/modules/app/unassigned.js` |
| 126589 | 126603 | 15 | `signal_addDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126604 | 126612 | 9 | `signal_removeDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126613 | 126632 | 20 | `signal_clearAllDays` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126633 | 126650 | 18 | `signal_calculateDayTotal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126651 | 126667 | 17 | `signal_editDay` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126668 | 126698 | 31 | `signal_renderTMCGrid` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126699 | 126762 | 64 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 126763 | 126785 | 23 | `signal_onTMCInput` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126786 | 126806 | 21 | `signal_updateModalRowTotal` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126807 | 126815 | 9 | `signal_saveTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126816 | 126822 | 7 | `signal_closeTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126823 | 126855 | 33 | `signal_updateConfigFromUI` | fn | — | refs:24 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126856 | 126858 | 3 | `signal_populateUIFromConfig` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126859 | 126859 | 1 | `setVal` | const arrow | — | refs:51 | Unassigned | `app/modules/app/unassigned.js` |
| 126860 | 126893 | 34 | `setChecked` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 126894 | 126932 | 39 | `signal_onTabShow` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126933 | 126989 | 57 | `signal_generatePDFReport` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 126990 | 127389 | 400 | `mapCrashes` | const arrow | — | refs:24 | Analysis | `app/modules/analysis/analysis.js` |
| 127390 | 127509 | 120 | `signal_exportCSV` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 127510 | 127811 | 302 | `signal_generateWordMemo` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 127812 | 127856 | 45 | `signal_readFileContent` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 127857 | 128178 | 322 | `signal_extractSingleFileWithDualAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128179 | 128193 | 15 | `signal_calculateExtractedTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128194 | 128254 | 61 | `signal_autoFillFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128255 | 128267 | 13 | `signal_handleBulkFileUpload` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128268 | 128675 | 408 | `expectedHourCount` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128676 | 128689 | 14 | `signal_extractAllWithAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128690 | 128738 | 49 | `signal_onFilesSelected` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128739 | 128797 | 59 | `signal_showAPIKeyWarning` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128798 | 128904 | 107 | `signal_agent3ReExtract` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128905 | 128982 | 78 | `signal_generateDataPreview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 128983 | 129017 | 35 | `hourTotal` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 129018 | 129032 | 15 | `signal_togglePreviewRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129033 | 129050 | 18 | `signal_confirmExtractedData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129051 | 129081 | 31 | `signal_enterReviewMode` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129082 | 129106 | 25 | `signal_exitReviewMode` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129107 | 129127 | 21 | `signal_updateReviewQueueIndicator` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129128 | 129178 | 51 | `signal_loadCurrentReviewData` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129179 | 129238 | 60 | `signal_populateTMCGridFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129239 | 129268 | 30 | `signal_doPopulateTMCValues` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129269 | 129285 | 17 | `total` | const arrow | — | refs:4309 | Unassigned | `app/modules/app/unassigned.js` |
| 129286 | 129362 | 77 | `signal_populateTMCFromDayData` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129363 | 129384 | 22 | `signal_skipCurrentReview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129385 | 129408 | 24 | `signal_advanceReviewQueue` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129409 | 129431 | 23 | `signal_rejectExtractedData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 129432 | 129467 | 36 | `speedstudy_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129468 | 129495 | 28 | `speedstudy_generateTableRows` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 129496 | 129529 | 34 | `speedstudy_updateTotals` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 129530 | 129582 | 53 | `speedstudy_setCountType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 129583 | 129601 | 19 | `speedstudy_updateConfigFromUI` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 129602 | 129621 | 20 | `speedstudy_clearForm` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129622 | 129640 | 19 | `speedstudy_initTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129641 | 129700 | 60 | `speedstudy_addCurrentDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129701 | 129746 | 46 | `speedstudy_renderDayCards` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129747 | 129756 | 10 | `speedstudy_removeDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129757 | 129767 | 11 | `speedstudy_updateDayCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129768 | 129783 | 16 | `speedstudy_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 129784 | 129810 | 27 | `speedstudy_runAnalysis` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 129811 | 129871 | 61 | `speedstudy_runAnalysisInternal` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 129872 | 129875 | 4 | `stdDev` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129876 | 129926 | 51 | `compliancePct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 129927 | 129940 | 14 | `speedstudy_getRecommendationReason` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129941 | 129954 | 14 | `speedstudy_displayResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 129955 | 130035 | 81 | `compliance` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 130036 | 130052 | 17 | `speedstudy_generateHistogram` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130053 | 130077 | 25 | `z` | const arrow | — | refs:11443 | Unassigned | `app/modules/app/unassigned.js` |
| 130078 | 130216 | 139 | `speedstudy_loadCrashData` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 130217 | 130217 | 1 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 130218 | 130255 | 38 | `contributing` | const arrow | — | refs:84 | Unassigned | `app/modules/app/unassigned.js` |
| 130256 | 130295 | 40 | `findMatchingRoute` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 130296 | 130305 | 10 | `speedstudy_calculateCrashRate` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 130306 | 130306 | 1 | `crashRate` | const arrow | — | refs:47 | Analysis | `app/modules/analysis/analysis.js` |
| 130307 | 130324 | 18 | `speedCrashRate` | const arrow | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 130325 | 130366 | 42 | `speedstudy_updateLocationSourceIndicator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 130367 | 130404 | 38 | `speedstudy_clearLocationBinding` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130405 | 130493 | 89 | `speedstudy_autoPopulateFromRoadProps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130494 | 130512 | 19 | `speedstudy_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130513 | 130521 | 9 | `speedstudy_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130522 | 130537 | 16 | `speedstudy_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130538 | 130577 | 40 | `speedstudy_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130578 | 130600 | 23 | `speedstudy_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130601 | 130656 | 56 | `speedstudy_readFileContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130657 | 130919 | 263 | `speedstudy_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 130920 | 131108 | 189 | `speedstudy_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131109 | 131148 | 40 | `speedstudy_populateGridFromExtraction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131149 | 131160 | 12 | `speedstudy_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131161 | 131169 | 9 | `speedstudy_toggleStudyType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131170 | 131182 | 13 | `speedstudy_importFromTMC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131183 | 131321 | 139 | `speedstudy_newStudy` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 131322 | 131787 | 466 | `speedstudy_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131788 | 131931 | 144 | `speedstudy_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 131932 | 131940 | 9 | `speedstudy_linkToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 131941 | 131975 | 35 | `speedstudy_saveData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 131976 | 132027 | 52 | `speedstudy_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132028 | 132040 | 13 | `speedstudy_scheduleAutoSave` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 132041 | 132150 | 110 | `speedstudy_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132151 | 132161 | 11 | `streetlight_onTabShow` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 132162 | 132224 | 63 | `streetlight_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 132225 | 132238 | 14 | `streetlight_analyzeCrashesByLight` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 132239 | 132239 | 1 | `lightCondition` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 132240 | 132272 | 33 | `severity` | const arrow | — | refs:1658 | Unassigned | `app/modules/app/unassigned.js` |
| 132273 | 132303 | 31 | `streetlight_calculateMetrics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132304 | 132395 | 92 | `streetlight_updateUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 132396 | 132436 | 41 | `streetlight_evaluateWarrant` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 132437 | 132467 | 31 | `streetlight_updateWarrantUI` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 132468 | 132495 | 28 | `updateCriterion` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 132496 | 132507 | 12 | `streetlight_toggleAdditionalFactors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132508 | 132518 | 11 | `streetlight_updateAdditionalFactors` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 132519 | 132530 | 12 | `streetlight_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132531 | 132554 | 24 | `streetlight_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132555 | 132735 | 181 | `streetlight_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132736 | 132796 | 61 | `streetlight_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132797 | 132839 | 43 | `streetlight_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132840 | 132860 | 21 | `streetlight_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132861 | 132912 | 52 | `streetlight_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 132913 | 133031 | 119 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133032 | 133314 | 283 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 133315 | 133337 | 23 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 133338 | 133377 | 40 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 133378 | 133422 | 45 | `trafficdata_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133423 | 133445 | 23 | `trafficdata_updateConfig` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 133446 | 133485 | 40 | `trafficdata_syncFromWarrantSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 133486 | 133504 | 19 | `trafficdata_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133505 | 133514 | 10 | `trafficdata_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133515 | 133523 | 9 | `trafficdata_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133524 | 133531 | 8 | `trafficdata_setCountType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133532 | 133546 | 15 | `trafficdata_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133547 | 133576 | 30 | `trafficdata_toggleSection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 133577 | 133649 | 73 | `trafficdata_renderTmcTable` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 133650 | 133666 | 17 | `trafficdata_updateTmcTotals` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 133667 | 133695 | 29 | `trafficdata_setTmcCountType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 133696 | 133710 | 15 | `trafficdata_updateTmcDate` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133711 | 133776 | 66 | `trafficdata_addTmcDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133777 | 133798 | 22 | `trafficdata_clearTmcForm` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 133799 | 133835 | 37 | `trafficdata_showDaysSummary` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 133836 | 133850 | 15 | `calculateDayTotalVolume` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133851 | 133864 | 14 | `trafficdata_deleteDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133865 | 133885 | 21 | `trafficdata_updateDayCounts` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 133886 | 133893 | 8 | `trafficdata_updatePedCounts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 133894 | 133926 | 33 | `trafficdata_addPedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133927 | 133952 | 26 | `trafficdata_saveSpeedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 133953 | 134035 | 83 | `trafficdata_updateReadiness` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 134036 | 134057 | 22 | `updateReadinessBar` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 134058 | 134104 | 47 | `trafficdata_convertTmcToTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134105 | 134138 | 34 | `trafficdata_convertPeakToAADT` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134139 | 134162 | 24 | `trafficdata_calcRoundaboutVolumes` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 134163 | 134220 | 58 | `trafficdata_refreshCrashData` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 134221 | 134253 | 33 | `trafficdata_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134254 | 134280 | 27 | `trafficdata_saveStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134281 | 134296 | 16 | `trafficdata_exportStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134297 | 134303 | 7 | `trafficdata_loadStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134304 | 134321 | 18 | `trafficdata_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134322 | 134359 | 38 | `trafficdata_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134360 | 134395 | 36 | `trafficdata_showAPIKeyWarning` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 134396 | 134549 | 154 | `trafficdata_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134550 | 134663 | 114 | `trafficdata_extractSingleFile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134664 | 134682 | 19 | `trafficdata_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134683 | 134703 | 21 | `trafficdata_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134704 | 134724 | 21 | `trafficdata_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134725 | 134760 | 36 | `trafficdata_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134761 | 134789 | 29 | `trafficdata_exitReviewMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 134790 | 134805 | 16 | `trafficdata_updateReviewQueueIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 134806 | 134861 | 56 | `trafficdata_loadCurrentReviewData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 134862 | 134902 | 41 | `trafficdata_loadHourlyDataIntoGrid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 134903 | 134910 | 8 | `trafficdata_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134911 | 134921 | 11 | `trafficdata_updateRtAdjustment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134922 | 134965 | 44 | `trafficdata_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 134966 | 135078 | 113 | `trafficdata_pushToSignal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135079 | 135183 | 105 | `trafficdata_pushToStopSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135184 | 135287 | 104 | `trafficdata_pushToRoundabout` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 135288 | 135365 | 78 | `trafficdata_pushToPedCrossing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135366 | 135558 | 193 | `trafficdata_pushToSpeedStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135559 | 135707 | 149 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 135708 | 135843 | 136 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 135844 | 135860 | 17 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 135861 | 135867 | 7 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135868 | 135878 | 11 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 135879 | 135897 | 19 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 135898 | 135911 | 14 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 135912 | 135917 | 6 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 135918 | 135928 | 11 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 135929 | 136135 | 207 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136136 | 136187 | 52 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 136188 | 136248 | 61 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136249 | 136293 | 45 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136294 | 136307 | 14 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136308 | 136321 | 14 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136322 | 136362 | 41 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136363 | 136391 | 29 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 136392 | 136467 | 76 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136468 | 136481 | 14 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 136482 | 136488 | 7 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136489 | 136531 | 43 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136532 | 136536 | 5 | `_fipsToAbbr` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 136537 | 136565 | 29 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136566 | 136598 | 33 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136599 | 136701 | 103 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 136702 | 136925 | 224 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 136926 | 136948 | 23 | `name` | const arrow | — | refs:8773 | Unassigned | `app/modules/app/unassigned.js` |
| 136949 | 137037 | 89 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 137038 | 137094 | 57 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 137095 | 137131 | 37 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 137132 | 137165 | 34 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 137166 | 137190 | 25 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 137191 | 137222 | 32 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 137223 | 137291 | 69 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 137292 | 137343 | 52 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 137344 | 137358 | 15 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 137359 | 137376 | 18 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 137377 | 137394 | 18 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 137395 | 137480 | 86 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 137481 | 137493 | 13 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 137494 | 137556 | 63 | `releaseVersions` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 137557 | 137733 | 177 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 137734 | 137887 | 154 | `lng` | const arrow | — | refs:689 | Unassigned | `app/modules/app/unassigned.js` |
| 137888 | 137995 | 108 | `name` | const arrow | — | refs:8773 | Unassigned | `app/modules/app/unassigned.js` |
| 137996 | 138021 | 26 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 138022 | 138029 | 8 | `totalTiles` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 138030 | 138077 | 48 | `reducedCount` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 138078 | 138142 | 65 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 138143 | 138159 | 17 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 138160 | 138190 | 31 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 138191 | 138257 | 67 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 138258 | 138308 | 51 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 138309 | 138323 | 15 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 138324 | 138340 | 17 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 138341 | 138356 | 16 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 138357 | 138537 | 181 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 138538 | 138549 | 12 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 138550 | 139063 | 514 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 139064 | 139225 | 162 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139226 | 139275 | 50 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 139276 | 139383 | 108 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 139384 | 139428 | 45 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139429 | 139543 | 115 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139544 | 139606 | 63 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139607 | 139707 | 101 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139708 | 139805 | 98 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 139806 | 139816 | 11 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 139817 | 139874 | 58 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 139875 | 139885 | 11 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 139886 | 139928 | 43 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 139929 | 139963 | 35 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 139964 | 139975 | 12 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139976 | 139984 | 9 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 139985 | 140022 | 38 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 140023 | 140037 | 15 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140038 | 140058 | 21 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140059 | 140071 | 13 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140072 | 140084 | 13 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140085 | 140114 | 30 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 140115 | 140135 | 21 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140136 | 140142 | 7 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140143 | 140193 | 51 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140194 | 140227 | 34 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140228 | 140247 | 20 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140248 | 140373 | 126 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140374 | 140437 | 64 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140438 | 140449 | 12 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140450 | 140479 | 30 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 140480 | 140490 | 11 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 140491 | 140501 | 11 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140502 | 140512 | 11 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 140513 | 140523 | 11 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140524 | 140531 | 8 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 140532 | 140548 | 17 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140549 | 140551 | 3 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140552 | 140581 | 30 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140582 | 140598 | 17 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140599 | 140624 | 26 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140625 | 140647 | 23 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140648 | 140665 | 18 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140666 | 140667 | 2 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 140668 | 140676 | 9 | `stateFips` | const arrow | — | refs:207 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 140677 | 140679 | 3 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140680 | 140680 | 1 | `dLat` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 140681 | 140688 | 8 | `dLng` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 140689 | 140708 | 20 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 140709 | 140743 | 35 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 140744 | 140760 | 17 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140761 | 140816 | 56 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140817 | 140868 | 52 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 140869 | 140939 | 71 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 140940 | 140974 | 35 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 140975 | 141001 | 27 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141002 | 141046 | 45 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141047 | 141049 | 3 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141050 | 141061 | 12 | `sample` | const arrow | — | refs:658 | Unassigned | `app/modules/app/unassigned.js` |
| 141062 | 141081 | 20 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 141082 | 141111 | 30 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141112 | 141125 | 14 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141126 | 141132 | 7 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 141133 | 141137 | 5 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 141138 | 141192 | 55 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141193 | 141251 | 59 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141252 | 141264 | 13 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 141265 | 141278 | 14 | `b` | const arrow | — | refs:85356 | Unassigned | `app/modules/app/unassigned.js` |
| 141279 | 141284 | 6 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 141285 | 141296 | 12 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141297 | 141345 | 49 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 141346 | 141360 | 15 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 141361 | 141382 | 22 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 141383 | 141478 | 96 | `isHigherTier` | const arrow | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 141479 | 141493 | 15 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 141494 | 141494 | 1 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 141495 | 141497 | 3 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 141498 | 141583 | 86 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 141584 | 141591 | 8 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 141592 | 141603 | 12 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141604 | 141611 | 8 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 141612 | 141670 | 59 | `currentJuris` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 141671 | 141773 | 103 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 141774 | 141780 | 7 | `start` | const arrow | — | refs:1401 | Unassigned | `app/modules/app/unassigned.js` |
| 141781 | 141806 | 26 | `injury` | const arrow | — | refs:192 | Unassigned | `app/modules/app/unassigned.js` |
| 141807 | 141866 | 60 | `val` | const arrow | — | refs:6013 | Unassigned | `app/modules/app/unassigned.js` |
| 141867 | 141894 | 28 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 141895 | 141952 | 58 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 141953 | 141957 | 5 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 141958 | 141968 | 11 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 141969 | 141984 | 16 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 141985 | 141989 | 5 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 141990 | 142005 | 16 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 142006 | 142020 | 15 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142021 | 142030 | 10 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 142031 | 142043 | 13 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 142044 | 142065 | 22 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142066 | 142087 | 22 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 142088 | 142116 | 29 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142117 | 142136 | 20 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142137 | 142137 | 1 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 142138 | 142211 | 74 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 142212 | 142255 | 44 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142256 | 142349 | 94 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 142350 | 142356 | 7 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 142357 | 142378 | 22 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 142379 | 142414 | 36 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 142415 | 142465 | 51 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 142466 | 142563 | 98 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 142564 | 142613 | 50 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142614 | 142622 | 9 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 142623 | 142698 | 76 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142699 | 142717 | 19 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142718 | 142850 | 133 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142851 | 142876 | 26 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 142877 | 142891 | 15 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 142892 | 142956 | 65 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 142957 | 143009 | 53 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 143010 | 143017 | 8 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 143018 | 143029 | 12 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143030 | 143071 | 42 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143072 | 143106 | 35 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143107 | 143144 | 38 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143145 | 143282 | 138 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143283 | 143351 | 69 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143352 | 143369 | 18 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143370 | 143381 | 12 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143382 | 143400 | 19 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143401 | 143482 | 82 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143483 | 143499 | 17 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143500 | 143559 | 60 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143560 | 143578 | 19 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143579 | 143631 | 53 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143632 | 143654 | 23 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143655 | 143684 | 30 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143685 | 143750 | 66 | `matches` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 143751 | 143767 | 17 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143768 | 143776 | 9 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143777 | 143788 | 12 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 143789 | 143799 | 11 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143800 | 143843 | 44 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143844 | 143897 | 54 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143898 | 143910 | 13 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 143911 | 143947 | 37 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 143948 | 144059 | 112 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 144060 | 144069 | 10 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 144070 | 144251 | 182 | `encodeArcGIS` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 144252 | 144359 | 108 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 144360 | 144375 | 16 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 144376 | 144387 | 12 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 144388 | 144420 | 33 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 144421 | 144482 | 62 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 144483 | 144485 | 3 | `mpoName` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 144486 | 144486 | 1 | `nm` | const arrow | — | refs:711 | Unassigned | `app/modules/app/unassigned.js` |
| 144487 | 144507 | 21 | `ac` | const arrow | — | refs:19926 | Unassigned | `app/modules/app/unassigned.js` |
| 144508 | 144558 | 51 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 144559 | 144582 | 24 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 144583 | 144641 | 59 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 144642 | 144700 | 59 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 144701 | 144787 | 87 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 144788 | 144794 | 7 | `encodeArcGIS` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 144795 | 145036 | 242 | `fetchWithRetry` | async const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 145037 | 145044 | 8 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145045 | 145056 | 12 | `intersect` | const arrow | — | refs:16639 | Unassigned | `app/modules/app/unassigned.js` |
| 145057 | 145063 | 7 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145064 | 145089 | 26 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145090 | 145099 | 10 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145100 | 145132 | 33 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 145133 | 145218 | 86 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 145219 | 145247 | 29 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145248 | 145261 | 14 | `severity` | const arrow | — | refs:1658 | Unassigned | `app/modules/app/unassigned.js` |
| 145262 | 145267 | 6 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 145268 | 145338 | 71 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 145339 | 145392 | 54 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145393 | 145418 | 26 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 145419 | 145440 | 22 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 145441 | 145454 | 14 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145455 | 145481 | 27 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145482 | 145505 | 24 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 145506 | 145568 | 63 | `esc` | const arrow | — | refs:6751 | Unassigned | `app/modules/app/unassigned.js` |
| 145569 | 145604 | 36 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145605 | 145620 | 16 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 145621 | 145710 | 90 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 145711 | 145818 | 108 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145819 | 145872 | 54 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 145873 | 145903 | 31 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 145904 | 145932 | 29 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 145933 | 145984 | 52 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 145985 | 146212 | 228 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 146213 | 146227 | 15 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146228 | 146245 | 18 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 146246 | 146399 | 154 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146400 | 146413 | 14 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 146414 | 146464 | 51 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 146465 | 146529 | 65 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146530 | 146577 | 48 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146578 | 146584 | 7 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 146585 | 146601 | 17 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 146602 | 146829 | 228 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146830 | 146839 | 10 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 146840 | 146881 | 42 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 146882 | 146892 | 11 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146893 | 146906 | 14 | `pctChange` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 146907 | 146926 | 20 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146927 | 146956 | 30 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146957 | 146979 | 23 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 146980 | 147184 | 205 | `vsAvgPct` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 147185 | 147246 | 62 | `pctChange` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 147247 | 147250 | 4 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147251 | 147310 | 60 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 147311 | 147507 | 197 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 147508 | 147526 | 19 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 147527 | 147552 | 26 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 147553 | 147570 | 18 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 147571 | 147641 | 71 | `vsAvgPct` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 147642 | 147669 | 28 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147670 | 147687 | 18 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 147688 | 147694 | 7 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 147695 | 147701 | 7 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 147702 | 147727 | 26 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147728 | 147813 | 86 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147814 | 147830 | 17 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147831 | 147863 | 33 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 147864 | 147962 | 99 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 147963 | 147981 | 19 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 147982 | 148101 | 120 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 148102 | 148118 | 17 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 148119 | 148130 | 12 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148131 | 148142 | 12 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148143 | 148149 | 7 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148150 | 148157 | 8 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 148158 | 148168 | 11 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 148169 | 148182 | 14 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148183 | 148210 | 28 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148211 | 148235 | 25 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 148236 | 148311 | 76 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 148312 | 148375 | 64 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148376 | 148383 | 8 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 148384 | 148401 | 18 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 148402 | 148426 | 25 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148427 | 148454 | 28 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 148455 | 148468 | 14 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 148469 | 148513 | 45 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 148514 | 148540 | 27 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 148541 | 148557 | 17 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 148558 | 148579 | 22 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 148580 | 148765 | 186 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 148766 | 148777 | 12 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 148778 | 148958 | 181 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 148959 | 148970 | 12 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 148971 | 148984 | 14 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 148985 | 149018 | 34 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 149019 | 149072 | 54 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 149073 | 149089 | 17 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 149090 | 149229 | 140 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 149230 | 149245 | 16 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 149246 | 149299 | 54 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 149300 | 149421 | 122 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 149422 | 149434 | 13 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 149435 | 149504 | 70 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 149505 | 149534 | 30 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 149535 | 149603 | 69 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 149604 | 149611 | 8 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 149612 | 149648 | 37 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 149649 | 149669 | 21 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 149670 | 149682 | 13 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 149683 | 149704 | 22 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 149705 | 149760 | 56 | `isHigherTier` | const arrow | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 149761 | 149778 | 18 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 149779 | 149802 | 24 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 149803 | 149810 | 8 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 149811 | 149939 | 129 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 149940 | 150123 | 184 | `getSchoolCountyCode` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 150124 | 150215 | 92 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 150216 | 150352 | 137 | `getSchoolCountyCode` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 150353 | 150371 | 19 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 150372 | 150411 | 40 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 150412 | 150426 | 15 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 150427 | 150479 | 53 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 150480 | 150507 | 28 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 150508 | 150663 | 156 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 150664 | 150666 | 3 | `updateSeveritySegment` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 150667 | 150680 | 14 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 150681 | 150705 | 25 | `updateFactor` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 150706 | 150752 | 47 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 150753 | 150796 | 44 | `barWidth` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 150797 | 150819 | 23 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 150820 | 150865 | 46 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 150866 | 150920 | 55 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 150921 | 150980 | 60 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 150981 | 150983 | 3 | `updateSeveritySegment` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 150984 | 150997 | 14 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 150998 | 151069 | 72 | `updateFactor` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 151070 | 151119 | 50 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 151120 | 151147 | 28 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 151148 | 151176 | 29 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 151177 | 151209 | 33 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151210 | 151262 | 53 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151263 | 151280 | 18 | `arcgisShowStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 151281 | 151290 | 10 | `arcgisHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151291 | 151315 | 25 | `arcgisNormalizeUrl` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151316 | 151350 | 35 | `arcgisValidateUrl` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151351 | 151471 | 121 | `arcgisFetchService` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 151472 | 151543 | 72 | `arcgisShowFieldModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151544 | 151554 | 11 | `arcgisCloseFieldModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 151555 | 151570 | 16 | `arcgisToggleCustomType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151571 | 151571 | 1 | `arcgisWebMercatorToWGS84` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 151572 | 151580 | 9 | `lng` | const arrow | — | refs:689 | Unassigned | `app/modules/app/unassigned.js` |
| 151581 | 151747 | 167 | `arcgisImportFeatures` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151748 | 151812 | 65 | `arcgisFetchAllFeatures` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151813 | 151867 | 55 | `arcgisSaveAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 151868 | 151905 | 38 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 151906 | 151941 | 36 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151942 | 151959 | 18 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151960 | 151977 | 18 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 151978 | 151989 | 12 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 151990 | 152094 | 105 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152095 | 152113 | 19 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 152114 | 152300 | 187 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 152301 | 152360 | 60 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152361 | 152423 | 63 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152424 | 152458 | 35 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152459 | 152497 | 39 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 152498 | 152507 | 10 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152508 | 152542 | 35 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 152543 | 152588 | 46 | `isHigherTier` | const arrow | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 152589 | 152596 | 8 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152597 | 152635 | 39 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152636 | 152683 | 48 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 152684 | 152701 | 18 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 152702 | 152709 | 8 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152710 | 152726 | 17 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 152727 | 152763 | 37 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152764 | 152818 | 55 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152819 | 152878 | 60 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 152879 | 152926 | 48 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 152927 | 153004 | 78 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153005 | 153029 | 25 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153030 | 153125 | 96 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153126 | 153379 | 254 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 153380 | 153383 | 4 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 153384 | 153384 | 1 | `centerLat` | const arrow | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 153385 | 153425 | 41 | `centerLng` | const arrow | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 153426 | 153437 | 12 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153438 | 153439 | 2 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153440 | 153440 | 1 | `dLat` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 153441 | 153451 | 11 | `dLng` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 153452 | 153487 | 36 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153488 | 153512 | 25 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153513 | 153513 | 1 | `latOffset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153514 | 153538 | 25 | `lngOffset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153539 | 153616 | 78 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 153617 | 153700 | 84 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 153701 | 153719 | 19 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 153720 | 153763 | 44 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 153764 | 153770 | 7 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 153771 | 153829 | 59 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 153830 | 153892 | 63 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 153893 | 153943 | 51 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 153944 | 153964 | 21 | `setVal` | const arrow | — | refs:51 | Unassigned | `app/modules/app/unassigned.js` |
| 153965 | 153967 | 3 | `sevBar` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 153968 | 153994 | 27 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 153995 | 154024 | 30 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154025 | 154034 | 10 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 154035 | 154133 | 99 | `updateSchoolTabTable` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 154134 | 154146 | 13 | `start` | const arrow | — | refs:1401 | Unassigned | `app/modules/app/unassigned.js` |
| 154147 | 154190 | 44 | `injury` | const arrow | — | refs:192 | Unassigned | `app/modules/app/unassigned.js` |
| 154191 | 154202 | 12 | `schoolTabClearSchools` | fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 154203 | 154239 | 37 | `schoolTabClearAllSchools` | fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 154240 | 154245 | 6 | `schoolTabRadiusChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154246 | 154262 | 17 | `schoolTabSetRadius` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154263 | 154275 | 13 | `schoolTabViewOnMap` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 154276 | 154287 | 12 | `schoolTabViewOnMapSingle` | fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 154288 | 154313 | 26 | `schoolTabFocusView` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154314 | 154373 | 60 | `schoolTabExportData` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154374 | 154396 | 23 | `schoolTabExportKML` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 154397 | 154473 | 77 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 154474 | 154486 | 13 | `escapeXML` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 154487 | 154515 | 29 | `softActivateSchoolLayer` | fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 154516 | 154548 | 33 | `initTransitSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 154549 | 154578 | 30 | `transitTabSyncFromContext` | fn | — | refs:5 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 154579 | 154630 | 52 | `isHigherTier` | const arrow | — | refs:10 | Core/Tier | `app/modules/core/tier.js` |
| 154631 | 154660 | 30 | `_expectedPrefix` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 154661 | 154667 | 7 | `transitTabCountyChange` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 154668 | 154676 | 9 | `transitTabQuickSelect` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 154677 | 154686 | 10 | `transitTabLoadStops` | async fn | — | refs:8 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 154687 | 154843 | 157 | `transitTabLoadStopsFromBTS` | async fn | — | refs:6 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 154844 | 155007 | 164 | `transitLoadStopsForTier` | async fn | — | refs:1 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155008 | 155026 | 19 | `_updateTransitTierScopeNotice` | fn | — | refs:3 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155027 | 155089 | 63 | `updateTransitTabUI` | fn | — | refs:11 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155090 | 155130 | 41 | `updateTransitTabMetrics` | fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155131 | 155148 | 18 | `setVal` | const arrow | — | refs:51 | Unassigned | `app/modules/app/unassigned.js` |
| 155149 | 155151 | 3 | `sevBar` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 155152 | 155170 | 19 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 155171 | 155180 | 10 | `updateTransitTabTable` | fn | — | refs:1 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155181 | 155181 | 1 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 155182 | 155203 | 22 | `pedBike` | const arrow | — | refs:48 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 155204 | 155211 | 8 | `transitTabClearStops` | fn | — | refs:1 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155212 | 155250 | 39 | `transitTabClearAllStops` | fn | — | refs:4 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155251 | 155256 | 6 | `transitTabRadiusChange` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155257 | 155273 | 17 | `transitTabSetRadius` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155274 | 155286 | 13 | `transitTabViewOnMap` | fn | — | refs:2 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155287 | 155298 | 12 | `transitTabViewOnMapSingle` | fn | — | refs:1 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155299 | 155324 | 26 | `transitTabFocusView` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155325 | 155342 | 18 | `transitTabExportData` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155343 | 155373 | 31 | `pedBike` | const arrow | — | refs:48 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 155374 | 155399 | 26 | `transitTabExportKML` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155400 | 155400 | 1 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 155401 | 155475 | 75 | `pedBike` | const arrow | — | refs:48 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 155476 | 155490 | 15 | `softActivateTransitLayer` | fn | — | refs:1 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155491 | 155513 | 23 | `switchSchoolTabResourceTab` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 155514 | 155540 | 27 | `switchTransitTabResourceTab` | fn | — | refs:0 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 155541 | 155550 | 10 | `toggleAssetExportMenu` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 155551 | 155569 | 19 | `hideAssetExportMenu` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 155570 | 155580 | 11 | `assetExportKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 155581 | 155687 | 107 | `getPriority` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 155688 | 155924 | 237 | `assetExportPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 155925 | 156066 | 142 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 156067 | 156074 | 8 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156075 | 156088 | 14 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156089 | 156093 | 5 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156094 | 156098 | 5 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156099 | 156140 | 42 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156141 | 156146 | 6 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156147 | 156157 | 11 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156158 | 156162 | 5 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156163 | 156164 | 2 | `stateConfig` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 156165 | 156167 | 3 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 156168 | 156218 | 51 | `baseUrl` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 156219 | 156243 | 25 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156244 | 156261 | 18 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156262 | 156330 | 69 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156331 | 156363 | 33 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 156364 | 156373 | 10 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156374 | 156414 | 41 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156415 | 156459 | 45 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156460 | 156507 | 48 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156508 | 156578 | 71 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156579 | 156601 | 23 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156602 | 156622 | 21 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156623 | 156643 | 21 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156644 | 156664 | 21 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156665 | 156691 | 27 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156692 | 156751 | 60 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156752 | 156819 | 68 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156820 | 156834 | 15 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156835 | 156850 | 16 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156851 | 156868 | 18 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156869 | 156873 | 5 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156874 | 156940 | 67 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 156941 | 157018 | 78 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157019 | 157028 | 10 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157029 | 157032 | 4 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157033 | 157048 | 16 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157049 | 157081 | 33 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157082 | 157118 | 37 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157119 | 157161 | 43 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157162 | 157165 | 4 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157166 | 157203 | 38 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157204 | 157349 | 146 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 157350 | 157354 | 5 | `_activeStateKey` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 157355 | 157367 | 13 | `_yearFromIsoDate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 157368 | 157388 | 21 | `populateTrafficControlDropdown` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 157389 | 157395 | 7 | `_applyTrafficCtrlOptions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 157396 | 157423 | 28 | `cnt` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 157424 | 157461 | 38 | `applyStateAwareCheckboxDefaults` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 157462 | 157494 | 33 | `_hasCMFLocationSelected` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 157495 | 157496 | 2 | `_refreshActiveScopeCard` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 157497 | 157599 | 103 | `tier` | const arrow | — | refs:1607 | Core/Tier | `app/modules/core/tier.js` |
| 157600 | 157638 | 39 | `_r18ApplyDashboardYearFilter` | async fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 157639 | 157660 | 22 | `_set` | const arrow | — | refs:45 | Unassigned | `app/modules/app/unassigned.js` |
| 157661 | 157669 | 9 | `_r18ReloadHotspots` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 157670 | 157688 | 19 | `tier` | const arrow | — | refs:1607 | Core/Tier | `app/modules/core/tier.js` |
| 157689 | 157744 | 56 | `key` | const arrow | — | refs:1934 | Unassigned | `app/modules/app/unassigned.js` |
| 157745 | 157789 | 45 | `_r18ReloadIntersections` | async fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 157790 | 157792 | 3 | `_r19LoadSafetyCategoriesWithFilter` | async fn | — | refs:1 | Filter Wiring | `app/modules/data/filter-wiring.js` |
| 157793 | 157796 | 4 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 157797 | 157799 | 3 | `t` | const arrow | — | refs:641078 | Unassigned | `app/modules/app/unassigned.js` |
| 157800 | 157917 | 118 | `yearActive` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 157918 | 157925 | 8 | `_bindOnce` | fn | — | refs:12 | Filter Wiring | `app/modules/data/filter-wiring.js` |
| 157926 | 157995 | 70 | `_bindFilterInputs` | fn | — | refs:4 | Filter Wiring | `app/modules/data/filter-wiring.js` |
| 157996 | 158396 | 401 | `_restoreFilterInputs` | fn | — | refs:3 | Filter Wiring | `app/modules/data/filter-wiring.js` |
| 158397 | 158529 | 133 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 158530 | 158532 | 3 | `_statePopulation` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 158533 | 158539 | 7 | `_titleCase` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 158540 | 158542 | 3 | `_inferScorecardTier` | fn | — | refs:4 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158543 | 158544 | 2 | `hier` | const arrow | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 158545 | 158560 | 16 | `norm` | const arrow | — | refs:593 | Unassigned | `app/modules/app/unassigned.js` |
| 158561 | 158582 | 22 | `setScorecardTier` | fn | — | refs:0 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158583 | 158606 | 24 | `_renderTierPills` | fn | — | refs:3 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158607 | 158647 | 41 | `_invalidateScorecard` | fn | — | refs:3 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158648 | 158669 | 22 | `initScorecardTab` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158670 | 158679 | 10 | `onScorecardModeChange` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158680 | 158735 | 56 | `loadScorecardData` | async fn | — | refs:11 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158736 | 158755 | 20 | `banner` | const arrow | — | refs:201 | Unassigned | `app/modules/app/unassigned.js` |
| 158756 | 158818 | 63 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 158819 | 158864 | 46 | `_aggregateRolling` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158865 | 158876 | 12 | `_rerank` | fn | — | refs:9 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158877 | 158886 | 10 | `renderScorecardTable` | fn | — | refs:11 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 158887 | 158888 | 2 | `isFederal` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 158889 | 158960 | 72 | `search` | const arrow | — | refs:1326 | Unassigned | `app/modules/app/unassigned.js` |
| 158961 | 158963 | 3 | `yoyRaw` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 158964 | 158973 | 10 | `yoyArr` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 158974 | 158995 | 22 | `heatFg` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 158996 | 159009 | 14 | `_matchesPeerPill` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159010 | 159017 | 8 | `inferred` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 159018 | 159026 | 9 | `_spark` | fn | — | refs:2 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159027 | 159031 | 5 | `_heatColor` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159032 | 159034 | 3 | `_escapeAttr` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 159035 | 159035 | 1 | `resetScorecardPins` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159036 | 159037 | 2 | `exportScorecardCSV` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159038 | 159052 | 15 | `isFederal` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 159053 | 159085 | 33 | `_renderFederalKpis` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159086 | 159092 | 7 | `_loadChoroplethDeps` | fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159093 | 159133 | 41 | `_renderChoropleth` | async fn | — | refs:1 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159134 | 159145 | 12 | `renderComparisonTable` | fn | — | refs:2 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159146 | 159186 | 41 | `_filtered` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 159187 | 159188 | 2 | `_rankColor` | fn | — | refs:2 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159189 | 159199 | 11 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 159200 | 159220 | 21 | `scorecardSort` | fn | — | refs:20 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159221 | 159227 | 7 | `scorecardDrillDown` | fn | — | refs:0 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159228 | 159228 | 1 | `jurs` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 159229 | 159283 | 55 | `norm` | const arrow | — | refs:593 | Unassigned | `app/modules/app/unassigned.js` |
| 159284 | 159288 | 5 | `updateScorecardChart` | fn | — | refs:5 | Safety Scorecard | `app/modules/scorecard/scorecard.js` |
| 159289 | 159291 | 3 | `isFederal` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 159292 | 159295 | 4 | `metricLabel` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 159296 | 159387 | 92 | `valueOf` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
