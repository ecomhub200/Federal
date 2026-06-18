# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (124956 lines)

Declarations in this part: **939**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80013 | 80057 | 80069 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80058 | 80070 | 80058 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80071 | 80091 | 80090 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80092 | 80094 | 80106 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80095 | 80107 | 80095 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80108 | 80124 | 80123 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80125 | 80148 | 80147 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80149 | 80162 | 80161 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80163 | 80184 | 80183 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80185 | 80220 | 80219 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80221 | 80251 | 80295 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 80252 | 80272 | 80252 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80273 | 80297 | 80273 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80298 | 80307 | 80330 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80308 | 80331 | 80308 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80332 | 80362 | 80402 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 80363 | 80383 | 80363 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80384 | 80404 | 80384 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80405 | 80414 | 80433 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80415 | 80434 | 80415 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80435 | 80498 | 80496 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 80499 | 80524 | 80523 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80525 | 80543 | 80566 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80544 | 80544 | 80551 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80545 | 80567 | 80547 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80568 | 80615 | 80634 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80616 | 80617 | 80620 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80618 | 80635 | 80618 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80636 | 80706 | 80704 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80707 | 80735 | 80730 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80736 | 80747 | 80745 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80748 | 80759 | 80757 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80760 | 80768 | 80765 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80769 | 80842 | 80840 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80843 | 80901 | 80899 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 80902 | 81004 | 81002 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81005 | 81062 | 81061 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81063 | 81103 | 81102 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81104 | 81115 | 81168 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81116 | 81116 | 81116 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81117 | 81124 | 81122 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81125 | 81127 | 81125 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81128 | 81169 | 81128 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81170 | 81198 | 81197 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81199 | 81253 | 81252 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 81254 | 81263 | 81286 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81264 | 81287 | 81264 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81288 | 81304 | 81378 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81305 | 81330 | 81305 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81331 | 81356 | 81349 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81357 | 81379 | 81357 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81380 | 81397 | 81408 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81398 | 81409 | 81398 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81410 | 81422 | 81421 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81423 | 81427 | 81461 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81428 | 81435 | 81428 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81436 | 81438 | 81446 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81439 | 81462 | 81441 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81463 | 81480 | 81479 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81481 | 81502 | 81501 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 81503 | 81511 | 81510 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 81512 | 81535 | 81534 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81536 | 81545 | 81544 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81546 | 81556 | 81555 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 81557 | 81665 | 82420 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81666 | 81696 | 81673 | 31 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 81697 | 81705 | 81703 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81706 | 81713 | 81711 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81714 | 81730 | 81728 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81731 | 81755 | 81753 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81756 | 81766 | 81764 | 11 | 9 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 81767 | 81775 | 81773 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 81776 | 81796 | 81794 | 21 | 19 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 81797 | 81812 | 81810 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 81813 | 81823 | 81821 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 81824 | 81877 | 81875 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81878 | 81900 | 81898 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 81901 | 82161 | 81901 | 261 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 82162 | 82283 | 82167 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82284 | 82317 | 82288 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82318 | 82426 | 82323 | 109 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 82427 | 82447 | 82442 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 82448 | 82523 | 82521 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82524 | 82531 | 82529 | 8 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82532 | 82543 | 82539 | 12 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82544 | 82553 | 82546 | 10 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 82554 | 82585 | 82580 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 82586 | 82825 | 82823 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 82826 | 82840 | 82838 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82841 | 82851 | 82849 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 82852 | 82867 | 82865 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82868 | 82899 | 82893 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 82900 | 82939 | 82937 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82940 | 82969 | 83007 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82970 | 82985 | 82973 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82986 | 83009 | 82989 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83010 | 83024 | 83022 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83025 | 83037 | 83035 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83038 | 83076 | 83216 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 83077 | 83114 | 83080 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83115 | 83218 | 83118 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83219 | 83233 | 83231 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83234 | 83251 | 83243 | 18 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83252 | 83291 | 83277 | 40 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83292 | 83382 | 83302 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83383 | 83419 | 83406 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83420 | 83422 | 83420 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 83423 | 83426 | 83423 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 83427 | 83456 | 83467 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 83457 | 83470 | 83457 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83471 | 83487 | 83514 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83488 | 83516 | 83488 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83517 | 83527 | 83525 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83528 | 83579 | 83577 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83580 | 83654 | 83652 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 83655 | 83714 | 83712 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83715 | 83721 | 83719 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83722 | 83776 | 83770 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83777 | 83785 | 83810 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 83786 | 83812 | 83786 | 27 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 83813 | 83829 | 83827 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83830 | 83842 | 83873 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83843 | 83875 | 83843 | 33 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 83876 | 83894 | 83892 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83895 | 83935 | 83929 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 83936 | 83952 | 83982 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83953 | 83984 | 83953 | 32 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 83985 | 84025 | 84023 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 84026 | 84051 | 84049 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 84052 | 84109 | 84107 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84110 | 84166 | 84164 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 84167 | 84181 | 84249 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 84182 | 84205 | 84192 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84206 | 84224 | 84206 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84225 | 84232 | 84225 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84233 | 84239 | 84233 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 84240 | 84251 | 84246 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 84252 | 84265 | 84362 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 84266 | 84329 | 84278 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84330 | 84338 | 84330 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84339 | 84345 | 84339 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 84346 | 84370 | 84352 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 84371 | 84380 | 84433 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 84381 | 84389 | 84384 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84390 | 84435 | 84393 | 46 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 84436 | 84526 | 84524 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 84527 | 84624 | 84622 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 84625 | 84673 | 84684 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84674 | 84686 | 84674 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84687 | 84941 | 84939 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84942 | 84947 | 84945 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84948 | 84990 | 85001 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84991 | 85006 | 84991 | 16 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85007 | 85078 | 85064 | 72 | 58 | `evaluatePedScreening` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 85079 | 85099 | 85097 | 21 | 19 | `getRequiredSSD` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85100 | 85122 | 85120 | 23 | 21 | `updatePedSSDRequired` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85123 | 85135 | 85133 | 13 | 11 | `updatePedContextSpacing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85136 | 85180 | 85178 | 45 | 43 | `updatePedStreetViewStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85181 | 85196 | 85194 | 16 | 14 | `openPedStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85197 | 85216 | 85308 | 20 | 112 | `ped_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 85217 | 85309 | 85219 | 93 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85310 | 85448 | 85358 | 139 | 49 | `evaluatePedCriteria` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 85449 | 85486 | 85538 | 38 | 90 | `determinePedTier` | fn | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 85487 | 85539 | 85490 | 53 | 4 | `cmDescriptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85540 | 85570 | 85565 | 31 | 26 | `determinePedMarking` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85571 | 86048 | 86044 | 478 | 474 | `ped_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86049 | 86068 | 86059 | 20 | 11 | `ped_printReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86069 | 86139 | 86135 | 71 | 67 | `stopsign_initForm` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86140 | 86174 | 86170 | 35 | 31 | `stopsign_showTab` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86175 | 86252 | 86248 | 78 | 74 | `stopsign_updateSpeedThreshold` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 86253 | 86264 | 86260 | 12 | 8 | `stopsign_updateConfig` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 86265 | 86313 | 86309 | 49 | 45 | `stopsign_updateTMCGrid` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 86314 | 86365 | 86358 | 52 | 45 | `stopsign_generateTMCRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86366 | 86383 | 86379 | 18 | 14 | `stopsign_updateRowTotal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86384 | 86393 | 86389 | 10 | 6 | `stopsign_markTotalManual` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86394 | 86416 | 86410 | 23 | 17 | `stopsign_calculateApproachVolumes` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86417 | 86503 | 86497 | 87 | 81 | `stopsign_computeHourlyAggregates` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 86504 | 86587 | 86583 | 84 | 80 | `stopsign_evaluateCriterionCFromAggregates` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 86588 | 86620 | 86720 | 33 | 133 | `stopsign_updateVolumeSummary` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 86621 | 86621 | 86621 | 1 | 1 | `totalMajor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86622 | 86724 | 86622 | 103 | 1 | `totalMinor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86725 | 86763 | 86759 | 39 | 35 | `stopsign_setCountType` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86764 | 86794 | 86789 | 31 | 26 | `stopsign_clearTMCForm` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 86795 | 86802 | 86798 | 8 | 4 | `stopsign_generateVolumeTable` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86803 | 86898 | 86894 | 96 | 92 | `stopsign_updateVolumeAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 86899 | 86921 | 86941 | 23 | 43 | `stopsign_buildCrashProfile` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 86922 | 86945 | 86924 | 24 | 3 | `isSusceptible` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86946 | 86978 | 86974 | 33 | 29 | `stopsign_autoPopulateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86979 | 87007 | 87003 | 29 | 25 | `stopsign_evaluateCriterionA` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87008 | 87037 | 87033 | 30 | 26 | `stopsign_evaluateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87038 | 87050 | 87098 | 13 | 61 | `stopsign_evaluateCriterionC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87051 | 87067 | 87056 | 17 | 6 | `updateSubcriterion` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87068 | 87103 | 87074 | 36 | 7 | `updateBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87104 | 87188 | 87184 | 85 | 81 | `stopsign_calculateLOS` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87189 | 87199 | 87195 | 11 | 7 | `stopsign_toggleHCSConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87200 | 87243 | 87239 | 44 | 40 | `stopsign_evaluateCriterionD` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87244 | 87292 | 87288 | 49 | 45 | `stopsign_evaluateAllCriteria` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 87293 | 87362 | 87358 | 70 | 66 | `stopsign_updateResultsTab` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87363 | 87373 | 87369 | 11 | 7 | `stopsign_updateResultCell` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87374 | 87397 | 87393 | 24 | 20 | `stopsign_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87398 | 87418 | 87414 | 21 | 17 | `stopsign_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87419 | 87429 | 87425 | 11 | 7 | `stopsign_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87430 | 87448 | 87444 | 19 | 15 | `stopsign_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87449 | 87471 | 87467 | 23 | 19 | `stopsign_clearVolumeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87472 | 87533 | 87529 | 62 | 58 | `stopsign_saveData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87534 | 87631 | 87627 | 98 | 94 | `stopsign_loadSavedData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87632 | 87673 | 87669 | 42 | 38 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87674 | 87705 | 87701 | 32 | 28 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87706 | 87714 | 87710 | 9 | 5 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87715 | 87726 | 87722 | 12 | 8 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87727 | 87768 | 87764 | 42 | 38 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87769 | 87815 | 87811 | 47 | 43 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87816 | 87885 | 87881 | 70 | 66 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87886 | 87908 | 87904 | 23 | 19 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87909 | 87932 | 87928 | 24 | 20 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87933 | 87959 | 87955 | 27 | 23 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87960 | 88024 | 88018 | 65 | 59 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88025 | 88083 | 88079 | 59 | 55 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88084 | 88095 | 88091 | 12 | 8 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88096 | 88107 | 88103 | 12 | 8 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88108 | 88125 | 88121 | 18 | 14 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88126 | 88137 | 88133 | 12 | 8 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88138 | 88160 | 88153 | 23 | 16 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88161 | 88225 | 88221 | 65 | 61 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88226 | 88247 | 88243 | 22 | 18 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88248 | 88291 | 88286 | 44 | 39 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88292 | 88324 | 88320 | 33 | 29 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88325 | 88332 | 88328 | 8 | 4 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88333 | 88342 | 88338 | 10 | 6 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88343 | 88383 | 88379 | 41 | 37 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88384 | 88414 | 88410 | 31 | 27 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88415 | 88424 | 88420 | 10 | 6 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88425 | 88495 | 88491 | 71 | 67 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88496 | 88567 | 88563 | 72 | 68 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 88568 | 88576 | 88572 | 9 | 5 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88577 | 88654 | 88650 | 78 | 74 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88655 | 88696 | 88692 | 42 | 38 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88697 | 88707 | 88703 | 11 | 7 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88708 | 88746 | 88736 | 39 | 29 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88747 | 88767 | 88763 | 21 | 17 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88768 | 88776 | 88786 | 9 | 19 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88777 | 88790 | 88777 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88791 | 88812 | 88808 | 22 | 18 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88813 | 88824 | 88820 | 12 | 8 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88825 | 89029 | 89025 | 205 | 201 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89030 | 89158 | 89190 | 129 | 161 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89159 | 89194 | 89159 | 36 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89195 | 89285 | 89281 | 91 | 87 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89286 | 89359 | 89349 | 74 | 64 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89360 | 89706 | 89702 | 347 | 343 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89707 | 90018 | 90014 | 312 | 308 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90019 | 90118 | 90113 | 100 | 95 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90119 | 90126 | 90121 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90127 | 90163 | 90154 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 90164 | 90185 | 90181 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 90186 | 90195 | 90191 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 90196 | 90206 | 90201 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 90207 | 90245 | 90241 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90246 | 90318 | 90312 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 90319 | 90448 | 90444 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 90449 | 90491 | 90487 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90492 | 90569 | 90545 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 90570 | 90582 | 90578 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90583 | 90622 | 90617 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 90623 | 90658 | 90654 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 90659 | 90682 | 90678 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90683 | 90695 | 90690 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90696 | 90733 | 90728 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 90734 | 90789 | 90784 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90790 | 90843 | 90839 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 90844 | 90954 | 90886 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90955 | 90973 | 90969 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 90974 | 91030 | 91026 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 91031 | 91040 | 91034 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91041 | 91148 | 91197 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 91149 | 91201 | 91149 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 91202 | 91231 | 91226 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91232 | 91319 | 91315 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 91320 | 91337 | 91332 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91338 | 91394 | 91393 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91395 | 91527 | 91507 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 91528 | 91576 | 91572 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 91577 | 91631 | 91627 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91632 | 91686 | 91682 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91687 | 91822 | 91818 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91823 | 91854 | 91850 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 91855 | 91863 | 91858 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 91864 | 91998 | 91994 | 135 | 131 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 91999 | 92002 | 92033 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 92003 | 92007 | 92006 | 5 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 92008 | 92037 | 92011 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 92038 | 92052 | 92048 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92053 | 92071 | 92067 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 92072 | 92078 | 92074 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92079 | 92115 | 92111 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92116 | 92185 | 92181 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92186 | 92210 | 92234 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92211 | 92238 | 92217 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 92239 | 92344 | 92339 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 92345 | 92492 | 92488 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92493 | 92610 | 92606 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 92611 | 92627 | 92622 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 92628 | 93017 | 93009 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 93018 | 93038 | 93048 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93039 | 93052 | 93039 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93053 | 93085 | 93081 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93086 | 93102 | 93088 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 93103 | 93179 | 93175 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 93180 | 93213 | 93209 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93214 | 93263 | 93257 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93264 | 93335 | 93328 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 93336 | 93359 | 93355 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 93360 | 93376 | 93372 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 93377 | 93405 | 93396 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 93406 | 93484 | 93479 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 93485 | 93501 | 93497 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93502 | 93741 | 93737 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 93742 | 93816 | 93916 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 93817 | 93817 | 93817 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93818 | 93920 | 93818 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93921 | 93999 | 94045 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94000 | 94054 | 94000 | 55 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94055 | 94098 | 94094 | 44 | 40 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94099 | 94105 | 94101 | 7 | 3 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94106 | 94112 | 94108 | 7 | 3 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94113 | 94132 | 94128 | 20 | 16 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94133 | 94158 | 94154 | 26 | 22 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94159 | 94221 | 94215 | 63 | 57 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94222 | 94247 | 94243 | 26 | 22 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94248 | 94254 | 94250 | 7 | 3 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94255 | 94261 | 94257 | 7 | 3 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94262 | 94337 | 94333 | 76 | 72 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94338 | 94382 | 94378 | 45 | 41 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94383 | 94416 | 94435 | 34 | 53 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94417 | 94439 | 94417 | 23 | 1 | `peakResult` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94440 | 94455 | 94500 | 16 | 61 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94456 | 94504 | 94467 | 49 | 12 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94505 | 94541 | 94537 | 37 | 33 | `signal_evaluateWarrant5` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94542 | 94608 | 94603 | 67 | 62 | `signal_evaluateWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94609 | 94747 | 94800 | 139 | 192 | `signal_autoPopulateWarrant7` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94748 | 94753 | 94751 | 6 | 4 | `angleCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94754 | 94758 | 94761 | 5 | 8 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94759 | 94763 | 94759 | 5 | 1 | `isPedByType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94764 | 94804 | 94767 | 41 | 4 | `countInjury` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94805 | 94817 | 94811 | 13 | 7 | `signal_detectWarrant7Period` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94818 | 94853 | 94848 | 36 | 31 | `signal_updateWarrant7Display` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94854 | 94866 | 94900 | 13 | 47 | `signal_refreshWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 94867 | 94904 | 94867 | 38 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 94905 | 95153 | 95149 | 249 | 245 | `signal_runAnalysis` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95154 | 95209 | 95205 | 56 | 52 | `signal_buildDayResults` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95210 | 95329 | 95325 | 120 | 116 | `signal_updateResultsDisplay` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95330 | 95409 | 95405 | 80 | 76 | `signal_buildDetailedResultsHTML` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95410 | 95425 | 95421 | 16 | 12 | `signal_switchDetailTab` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95426 | 95475 | 95471 | 50 | 46 | `signal_buildDayBreakdownTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95476 | 95525 | 95521 | 50 | 46 | `signal_buildSummaryTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95526 | 95536 | 95611 | 11 | 86 | `signal_buildWarrant1Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95537 | 95615 | 95537 | 79 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95616 | 95621 | 95666 | 6 | 51 | `signal_buildWarrant2Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95622 | 95670 | 95622 | 49 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95671 | 95703 | 95699 | 33 | 29 | `signal_buildWarrant3Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95704 | 95753 | 95749 | 50 | 46 | `signal_buildWarrant4Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95754 | 95790 | 95786 | 37 | 33 | `signal_buildWarrant5Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95791 | 95838 | 95834 | 48 | 44 | `signal_buildWarrant7Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95839 | 95881 | 95877 | 43 | 39 | `signal_buildHourlyTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95882 | 95927 | 95923 | 46 | 42 | `signal_buildRTTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95928 | 95942 | 95938 | 15 | 11 | `signal_switchResultTab` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 95943 | 96033 | 96029 | 91 | 87 | `signal_renderMultiDayTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96034 | 96094 | 96090 | 61 | 57 | `signal_renderHourlyTMC` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96095 | 96169 | 96165 | 75 | 71 | `signal_renderRTAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96170 | 96184 | 96170 | 15 | 1 | `signal_addDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96185 | 96193 | 96189 | 9 | 5 | `signal_removeDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96194 | 96213 | 96209 | 20 | 16 | `signal_clearAllDays` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96214 | 96231 | 96227 | 18 | 14 | `signal_calculateDayTotal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96232 | 96248 | 96244 | 17 | 13 | `signal_editDay` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96249 | 96343 | 96339 | 95 | 91 | `signal_renderTMCGrid` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96344 | 96366 | 96362 | 23 | 19 | `signal_onTMCInput` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96367 | 96387 | 96383 | 21 | 17 | `signal_updateModalRowTotal` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96388 | 96396 | 96392 | 9 | 5 | `signal_saveTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96397 | 96403 | 96399 | 7 | 3 | `signal_closeTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96404 | 96437 | 96433 | 34 | 30 | `signal_updateConfigFromUI` | fn | — | refs:24 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96438 | 96440 | 96471 | 3 | 34 | `signal_populateUIFromConfig` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96441 | 96441 | 96441 | 1 | 1 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 96442 | 96475 | 96442 | 34 | 1 | `setChecked` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96476 | 96514 | 96510 | 39 | 35 | `signal_onTabShow` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96515 | 96714 | 96967 | 200 | 453 | `signal_generatePDFReport` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 96715 | 96829 | 96721 | 115 | 7 | `w4Body` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96830 | 96971 | 96830 | 142 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96972 | 97012 | 97087 | 41 | 116 | `signal_exportCSV` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97013 | 97070 | 97013 | 58 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97071 | 97091 | 97071 | 21 | 1 | `totalVol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97092 | 97393 | 97374 | 302 | 283 | `signal_generateWordMemo` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97394 | 97438 | 97434 | 45 | 41 | `signal_readFileContent` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97439 | 97573 | 97756 | 135 | 318 | `signal_extractSingleFileWithDualAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97574 | 97760 | 97574 | 187 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97761 | 97775 | 97771 | 15 | 11 | `signal_calculateExtractedTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97776 | 97836 | 97831 | 61 | 56 | `signal_autoFillFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 97837 | 98026 | 98253 | 190 | 417 | `signal_handleBulkFileUpload` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98027 | 98063 | 98032 | 37 | 6 | `hourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98064 | 98064 | 98064 | 1 | 1 | `volumes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98065 | 98137 | 98065 | 73 | 1 | `mean` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98138 | 98151 | 98138 | 14 | 1 | `issueIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98152 | 98154 | 98154 | 3 | 3 | `finalHourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98155 | 98176 | 98155 | 22 | 1 | `allSameHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98177 | 98177 | 98177 | 1 | 1 | `successCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98178 | 98178 | 98178 | 1 | 1 | `correctedCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98179 | 98179 | 98179 | 1 | 1 | `warningCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98180 | 98193 | 98180 | 14 | 1 | `errorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98194 | 98194 | 98194 | 1 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98195 | 98257 | 98195 | 63 | 1 | `resolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98258 | 98271 | 98265 | 14 | 8 | `signal_extractAllWithAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98272 | 98320 | 98316 | 49 | 45 | `signal_onFilesSelected` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98321 | 98379 | 98368 | 59 | 48 | `signal_showAPIKeyWarning` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98380 | 98486 | 98482 | 107 | 103 | `signal_agent3ReExtract` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98487 | 98501 | 98595 | 15 | 109 | `signal_generateDataPreview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98502 | 98539 | 98502 | 38 | 1 | `maxHoursInBatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98540 | 98558 | 98540 | 19 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98559 | 98599 | 98559 | 41 | 1 | `allHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98600 | 98614 | 98610 | 15 | 11 | `signal_togglePreviewRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98615 | 98632 | 98628 | 18 | 14 | `signal_confirmExtractedData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98633 | 98663 | 98659 | 31 | 27 | `signal_enterReviewMode` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98664 | 98688 | 98684 | 25 | 21 | `signal_exitReviewMode` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98689 | 98709 | 98705 | 21 | 17 | `signal_updateReviewQueueIndicator` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98710 | 98760 | 98756 | 51 | 47 | `signal_loadCurrentReviewData` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98761 | 98765 | 98816 | 5 | 56 | `signal_populateTMCGridFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98766 | 98766 | 98766 | 1 | 1 | `extractedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98767 | 98767 | 98767 | 1 | 1 | `hasEarlyHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98768 | 98778 | 98768 | 11 | 1 | `hasLateHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98779 | 98820 | 98779 | 42 | 1 | `allWithin12hr` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98821 | 98867 | 98861 | 47 | 41 | `signal_doPopulateTMCValues` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98868 | 98944 | 98940 | 77 | 73 | `signal_populateTMCFromDayData` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98945 | 98966 | 98962 | 22 | 18 | `signal_skipCurrentReview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98967 | 98990 | 98986 | 24 | 20 | `signal_advanceReviewQueue` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 98991 | 99013 | 98996 | 23 | 6 | `signal_rejectExtractedData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 99014 | 99049 | 99045 | 36 | 32 | `speedstudy_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99050 | 99077 | 99073 | 28 | 24 | `speedstudy_generateTableRows` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99078 | 99111 | 99107 | 34 | 30 | `speedstudy_updateTotals` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 99112 | 99164 | 99160 | 53 | 49 | `speedstudy_setCountType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99165 | 99183 | 99179 | 19 | 15 | `speedstudy_updateConfigFromUI` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 99184 | 99203 | 99198 | 20 | 15 | `speedstudy_clearForm` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99204 | 99222 | 99218 | 19 | 15 | `speedstudy_initTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99223 | 99282 | 99278 | 60 | 56 | `speedstudy_addCurrentDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99283 | 99328 | 99324 | 46 | 42 | `speedstudy_renderDayCards` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99329 | 99338 | 99334 | 10 | 6 | `speedstudy_removeDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99339 | 99349 | 99345 | 11 | 7 | `speedstudy_updateDayCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99350 | 99365 | 99361 | 16 | 12 | `speedstudy_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99366 | 99392 | 99388 | 27 | 23 | `speedstudy_runAnalysis` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 99393 | 99508 | 99504 | 116 | 112 | `speedstudy_runAnalysisInternal` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 99509 | 99522 | 99518 | 14 | 10 | `speedstudy_getRecommendationReason` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99523 | 99617 | 99613 | 95 | 91 | `speedstudy_displayResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99618 | 99659 | 99654 | 42 | 37 | `speedstudy_generateHistogram` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99660 | 99754 | 99833 | 95 | 174 | `speedstudy_loadCrashData` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 99755 | 99755 | 99755 | 1 | 1 | `locWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99756 | 99758 | 99756 | 3 | 1 | `routeWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99759 | 99837 | 99761 | 79 | 3 | `allWordsMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99838 | 99865 | 99873 | 28 | 36 | `findMatchingRoute` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99866 | 99877 | 99868 | 12 | 3 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99878 | 99906 | 99901 | 29 | 24 | `speedstudy_calculateCrashRate` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 99907 | 99948 | 99944 | 42 | 38 | `speedstudy_updateLocationSourceIndicator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99949 | 99986 | 99981 | 38 | 33 | `speedstudy_clearLocationBinding` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99987 | 100075 | 100071 | 89 | 85 | `speedstudy_autoPopulateFromRoadProps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100076 | 100094 | 100090 | 19 | 15 | `speedstudy_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100095 | 100103 | 100099 | 9 | 5 | `speedstudy_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100104 | 100119 | 100115 | 16 | 12 | `speedstudy_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100120 | 100159 | 100152 | 40 | 33 | `speedstudy_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100160 | 100182 | 100178 | 23 | 19 | `speedstudy_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100183 | 100238 | 100234 | 56 | 52 | `speedstudy_readFileContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100239 | 100355 | 100497 | 117 | 259 | `speedstudy_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100356 | 100501 | 100356 | 146 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100502 | 100502 | 100686 | 1 | 185 | `speedstudy_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100503 | 100690 | 100503 | 188 | 1 | `files` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100691 | 100730 | 100726 | 40 | 36 | `speedstudy_populateGridFromExtraction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100731 | 100742 | 100738 | 12 | 8 | `speedstudy_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100743 | 100751 | 100747 | 9 | 5 | `speedstudy_toggleStudyType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100752 | 100764 | 100760 | 13 | 9 | `speedstudy_importFromTMC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100765 | 100903 | 100899 | 139 | 135 | `speedstudy_newStudy` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100904 | 101141 | 101365 | 238 | 462 | `speedstudy_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101142 | 101144 | 101157 | 3 | 16 | `dayRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101145 | 101145 | 101145 | 1 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101146 | 101146 | 101146 | 1 | 1 | `speeds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101147 | 101177 | 101147 | 31 | 1 | `avgP85` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101178 | 101369 | 101186 | 192 | 9 | `hourlyRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101370 | 101446 | 101509 | 77 | 140 | `speedstudy_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101447 | 101513 | 101447 | 67 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101514 | 101522 | 101518 | 9 | 5 | `speedstudy_linkToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 101523 | 101557 | 101553 | 35 | 31 | `speedstudy_saveData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101558 | 101609 | 101604 | 52 | 47 | `speedstudy_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101610 | 101622 | 101617 | 13 | 8 | `speedstudy_scheduleAutoSave` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 101623 | 101662 | 101720 | 40 | 98 | `speedstudy_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101663 | 101732 | 101663 | 70 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101733 | 101743 | 101739 | 11 | 7 | `streetlight_onTabShow` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101744 | 101806 | 101802 | 63 | 59 | `streetlight_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 101807 | 101856 | 101852 | 50 | 46 | `streetlight_analyzeCrashesByLight` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 101857 | 101887 | 101883 | 31 | 27 | `streetlight_calculateMetrics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101888 | 101917 | 101975 | 30 | 88 | `streetlight_updateUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101918 | 101918 | 101925 | 1 | 8 | `conditions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101919 | 101919 | 101919 | 1 | 1 | `aIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101920 | 101979 | 101920 | 60 | 1 | `bIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101980 | 102020 | 102016 | 41 | 37 | `streetlight_evaluateWarrant` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 102021 | 102051 | 102078 | 31 | 58 | `streetlight_updateWarrantUI` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 102052 | 102079 | 102070 | 28 | 19 | `updateCriterion` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 102080 | 102091 | 102090 | 12 | 11 | `streetlight_toggleAdditionalFactors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102092 | 102102 | 102101 | 11 | 10 | `streetlight_updateAdditionalFactors` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 102103 | 102114 | 102113 | 12 | 11 | `streetlight_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102115 | 102138 | 102137 | 24 | 23 | `streetlight_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102139 | 102319 | 102318 | 181 | 180 | `streetlight_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102320 | 102380 | 102379 | 61 | 60 | `streetlight_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102381 | 102423 | 102422 | 43 | 42 | `streetlight_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102424 | 102444 | 102443 | 21 | 20 | `streetlight_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102445 | 102496 | 102488 | 52 | 44 | `streetlight_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102497 | 102576 | 102611 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102577 | 102577 | 102577 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102578 | 102615 | 102578 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102616 | 102699 | 102897 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 102700 | 102700 | 102700 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102701 | 102830 | 102701 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102831 | 102831 | 102831 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102832 | 102898 | 102832 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102899 | 102921 | 102920 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 102922 | 102961 | 102952 | 40 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 102962 | 103006 | 103002 | 45 | 41 | `trafficdata_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103007 | 103029 | 103025 | 23 | 19 | `trafficdata_updateConfig` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 103030 | 103069 | 103065 | 40 | 36 | `trafficdata_syncFromWarrantSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 103070 | 103088 | 103084 | 19 | 15 | `trafficdata_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103089 | 103098 | 103094 | 10 | 6 | `trafficdata_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103099 | 103107 | 103103 | 9 | 5 | `trafficdata_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103108 | 103115 | 103111 | 8 | 4 | `trafficdata_setCountType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103116 | 103130 | 103126 | 15 | 11 | `trafficdata_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103131 | 103160 | 103156 | 30 | 26 | `trafficdata_toggleSection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 103161 | 103233 | 103229 | 73 | 69 | `trafficdata_renderTmcTable` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 103234 | 103250 | 103246 | 17 | 13 | `trafficdata_updateTmcTotals` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103251 | 103279 | 103275 | 29 | 25 | `trafficdata_setTmcCountType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103280 | 103294 | 103289 | 15 | 10 | `trafficdata_updateTmcDate` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103295 | 103360 | 103356 | 66 | 62 | `trafficdata_addTmcDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103361 | 103382 | 103378 | 22 | 18 | `trafficdata_clearTmcForm` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103383 | 103419 | 103415 | 37 | 33 | `trafficdata_showDaysSummary` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103420 | 103434 | 103430 | 15 | 11 | `calculateDayTotalVolume` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103435 | 103448 | 103444 | 14 | 10 | `trafficdata_deleteDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103449 | 103469 | 103465 | 21 | 17 | `trafficdata_updateDayCounts` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 103470 | 103477 | 103473 | 8 | 4 | `trafficdata_updatePedCounts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 103478 | 103510 | 103506 | 33 | 29 | `trafficdata_addPedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103511 | 103536 | 103532 | 26 | 22 | `trafficdata_saveSpeedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103537 | 103619 | 103615 | 83 | 79 | `trafficdata_updateReadiness` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 103620 | 103641 | 103637 | 22 | 18 | `updateReadinessBar` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 103642 | 103688 | 103684 | 47 | 43 | `trafficdata_convertTmcToTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103689 | 103722 | 103718 | 34 | 30 | `trafficdata_convertPeakToAADT` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103723 | 103746 | 103742 | 24 | 20 | `trafficdata_calcRoundaboutVolumes` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 103747 | 103804 | 103800 | 58 | 54 | `trafficdata_refreshCrashData` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 103805 | 103837 | 103833 | 33 | 29 | `trafficdata_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103838 | 103864 | 103860 | 27 | 23 | `trafficdata_saveStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103865 | 103880 | 103876 | 16 | 12 | `trafficdata_exportStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103881 | 103887 | 103883 | 7 | 3 | `trafficdata_loadStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103888 | 103905 | 103891 | 18 | 4 | `trafficdata_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103906 | 103943 | 103939 | 38 | 34 | `trafficdata_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103944 | 103979 | 103975 | 36 | 32 | `trafficdata_showAPIKeyWarning` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103980 | 104101 | 104129 | 122 | 150 | `trafficdata_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104102 | 104102 | 104102 | 1 | 1 | `docTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104103 | 104133 | 104105 | 31 | 3 | `dominantType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104134 | 104221 | 104243 | 88 | 110 | `trafficdata_extractSingleFile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104222 | 104247 | 104222 | 26 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104248 | 104266 | 104262 | 19 | 15 | `trafficdata_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104267 | 104287 | 104283 | 21 | 17 | `trafficdata_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104288 | 104308 | 104304 | 21 | 17 | `trafficdata_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104309 | 104344 | 104340 | 36 | 32 | `trafficdata_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104345 | 104373 | 104369 | 29 | 25 | `trafficdata_exitReviewMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104374 | 104389 | 104385 | 16 | 12 | `trafficdata_updateReviewQueueIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104390 | 104445 | 104440 | 56 | 51 | `trafficdata_loadCurrentReviewData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104446 | 104486 | 104482 | 41 | 37 | `trafficdata_loadHourlyDataIntoGrid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104487 | 104494 | 104490 | 8 | 4 | `trafficdata_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104495 | 104505 | 104501 | 11 | 7 | `trafficdata_updateRtAdjustment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104506 | 104549 | 104539 | 44 | 34 | `trafficdata_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104550 | 104662 | 104657 | 113 | 108 | `trafficdata_pushToSignal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104663 | 104767 | 104762 | 105 | 100 | `trafficdata_pushToStopSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104768 | 104871 | 104866 | 104 | 99 | `trafficdata_pushToRoundabout` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 104872 | 104949 | 104944 | 78 | 73 | `trafficdata_pushToPedCrossing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104950 | 105142 | 105030 | 193 | 81 | `trafficdata_pushToSpeedStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105143 | 105291 | 105271 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105292 | 105300 | 105425 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105301 | 105427 | 105301 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105428 | 105444 | 105433 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105445 | 105451 | 105449 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105452 | 105462 | 105460 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105463 | 105481 | 105476 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105482 | 105495 | 105494 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105496 | 105501 | 105500 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105502 | 105512 | 105511 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105513 | 105719 | 105718 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105720 | 105771 | 105770 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105772 | 105832 | 105831 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105833 | 105877 | 105876 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105878 | 105891 | 105890 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105892 | 105905 | 105904 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105906 | 105946 | 105945 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105947 | 105975 | 105974 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105976 | 106051 | 106024 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106052 | 106065 | 106064 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106066 | 106072 | 106071 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106073 | 106115 | 106114 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106116 | 106120 | 106119 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 106121 | 106149 | 106148 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106150 | 106182 | 106181 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106183 | 106285 | 106185 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106286 | 106532 | 106297 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 106533 | 106621 | 106533 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106622 | 106649 | 106670 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 106650 | 106678 | 106650 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106679 | 106715 | 106705 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 106716 | 106749 | 106744 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 106750 | 106774 | 106768 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 106775 | 106806 | 106801 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106807 | 106875 | 106871 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 106876 | 106927 | 106923 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 106928 | 106942 | 106938 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106943 | 106960 | 106956 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 106961 | 106978 | 106972 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 106979 | 107064 | 107013 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107065 | 107069 | 107135 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107070 | 107087 | 107070 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107088 | 107105 | 107088 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107106 | 107140 | 107106 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107141 | 107452 | 107155 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107453 | 107501 | 107453 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107502 | 107579 | 107502 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107580 | 107661 | 107657 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107662 | 107726 | 107722 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107727 | 107743 | 107739 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107744 | 107774 | 107769 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 107775 | 107841 | 107837 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 107842 | 107892 | 107888 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107893 | 107907 | 107903 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107908 | 107924 | 107920 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 107925 | 107940 | 107936 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107941 | 108121 | 107975 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108122 | 108133 | 108131 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 108134 | 108647 | 108143 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 108648 | 108809 | 108803 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108810 | 108859 | 108855 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 108860 | 108967 | 108960 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 108968 | 109012 | 109007 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109013 | 109127 | 109121 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109128 | 109190 | 109184 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109191 | 109291 | 109287 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109292 | 109389 | 109385 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 109390 | 109400 | 109396 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 109401 | 109458 | 109454 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 109459 | 109469 | 109465 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 109470 | 109512 | 109508 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109513 | 109547 | 109543 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109548 | 109559 | 109555 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109560 | 109568 | 109564 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109569 | 109606 | 109602 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 109607 | 109621 | 109617 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109622 | 109642 | 109638 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109643 | 109655 | 109651 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109656 | 109668 | 109664 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109669 | 109698 | 109694 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109699 | 109719 | 109715 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109720 | 109726 | 109722 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109727 | 109777 | 109773 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109778 | 109811 | 109807 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109812 | 109831 | 109826 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109832 | 109957 | 109952 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109958 | 110021 | 110017 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110022 | 110033 | 110028 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110034 | 110063 | 110062 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 110064 | 110074 | 110073 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 110075 | 110085 | 110084 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110086 | 110096 | 110095 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 110097 | 110107 | 110106 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110108 | 110115 | 110114 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 110116 | 110132 | 110127 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110133 | 110135 | 110164 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110136 | 110165 | 110142 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110166 | 110182 | 110181 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110183 | 110208 | 110207 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110209 | 110231 | 110230 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110232 | 110249 | 110248 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110250 | 110260 | 110255 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 110261 | 110272 | 110271 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110273 | 110292 | 110291 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 110293 | 110327 | 110322 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 110328 | 110344 | 110343 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110345 | 110400 | 110399 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110401 | 110452 | 110451 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110453 | 110503 | 110522 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110504 | 110523 | 110506 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 110524 | 110541 | 110557 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110542 | 110558 | 110542 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 110559 | 110585 | 110584 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110586 | 110594 | 110629 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110595 | 110630 | 110598 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110631 | 110634 | 110644 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110635 | 110637 | 110637 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110638 | 110645 | 110642 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110646 | 110665 | 110664 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 110666 | 110671 | 110694 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110672 | 110695 | 110674 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110696 | 110709 | 110708 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110710 | 110716 | 110715 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110717 | 110721 | 110720 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110722 | 110776 | 110775 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110777 | 110835 | 110834 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110836 | 110862 | 110861 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110863 | 110868 | 110867 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110869 | 110874 | 110879 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110875 | 110880 | 110875 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110881 | 110929 | 110924 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110930 | 110930 | 111069 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 110931 | 110980 | 110931 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110981 | 111077 | 110981 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111078 | 111112 | 111173 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 111113 | 111175 | 111113 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111176 | 111187 | 111182 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111188 | 111198 | 111253 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 111199 | 111254 | 111202 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111255 | 111265 | 111445 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 111266 | 111275 | 111268 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111276 | 111324 | 111276 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111325 | 111325 | 111325 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111326 | 111326 | 111326 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111327 | 111337 | 111327 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111338 | 111339 | 111338 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111340 | 111340 | 111340 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111341 | 111342 | 111341 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111343 | 111343 | 111343 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111344 | 111450 | 111344 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111451 | 111454 | 111471 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111455 | 111478 | 111455 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111479 | 111489 | 111535 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111490 | 111536 | 111492 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111537 | 111541 | 111540 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111542 | 111552 | 111551 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 111553 | 111568 | 111567 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 111569 | 111573 | 111572 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111574 | 111589 | 111584 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 111590 | 111604 | 111603 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111605 | 111614 | 111613 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111615 | 111627 | 111626 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111628 | 111639 | 111648 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111640 | 111649 | 111640 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111650 | 111671 | 111670 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111672 | 111700 | 111699 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111701 | 111708 | 111788 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111709 | 111720 | 111709 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111721 | 111734 | 111724 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111735 | 111773 | 111772 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111774 | 111795 | 111774 | 22 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111796 | 111839 | 111838 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111840 | 111845 | 111932 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 111846 | 111933 | 111846 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111934 | 111940 | 111939 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 111941 | 111944 | 111957 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111945 | 111962 | 111945 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111963 | 111963 | 111990 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111964 | 111985 | 111964 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111986 | 111998 | 111986 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111999 | 112049 | 112281 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 112050 | 112118 | 112058 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112119 | 112147 | 112137 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112148 | 112197 | 112157 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112198 | 112206 | 112205 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112207 | 112282 | 112214 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112283 | 112301 | 112299 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112302 | 112434 | 112318 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112435 | 112460 | 112447 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 112461 | 112475 | 112474 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112476 | 112540 | 112539 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112541 | 112593 | 112592 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112594 | 112601 | 112600 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 112602 | 112613 | 112612 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112614 | 112655 | 112646 | 42 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112656 | 112690 | 112684 | 35 | 29 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112691 | 112728 | 112723 | 38 | 33 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112729 | 112798 | 112862 | 70 | 134 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112799 | 112866 | 112801 | 68 | 3 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112867 | 112935 | 112931 | 69 | 65 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112936 | 112953 | 112949 | 18 | 14 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112954 | 112965 | 112961 | 12 | 8 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112966 | 112984 | 112973 | 19 | 8 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112985 | 113066 | 113062 | 82 | 78 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113067 | 113083 | 113077 | 17 | 11 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113084 | 113143 | 113139 | 60 | 56 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113144 | 113162 | 113152 | 19 | 9 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113163 | 113215 | 113214 | 53 | 52 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113216 | 113238 | 113224 | 23 | 9 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113239 | 113268 | 113333 | 30 | 95 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113269 | 113334 | 113271 | 66 | 3 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113335 | 113351 | 113350 | 17 | 16 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113352 | 113360 | 113359 | 9 | 8 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113361 | 113372 | 113368 | 12 | 8 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113373 | 113383 | 113379 | 11 | 7 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113384 | 113427 | 113421 | 44 | 38 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113428 | 113481 | 113476 | 54 | 49 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113482 | 113494 | 113485 | 13 | 4 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 113495 | 113531 | 113526 | 37 | 32 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113532 | 113643 | 113831 | 112 | 300 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 113644 | 113653 | 113712 | 10 | 69 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113654 | 113677 | 113658 | 24 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113678 | 113772 | 113678 | 95 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113773 | 113773 | 113773 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113774 | 113835 | 113774 | 62 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113836 | 113943 | 113939 | 108 | 104 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113944 | 113959 | 113955 | 16 | 12 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 113960 | 113971 | 113967 | 12 | 8 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113972 | 114004 | 113999 | 33 | 28 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114005 | 114067 | 114086 | 63 | 82 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114068 | 114091 | 114073 | 24 | 6 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114092 | 114142 | 114137 | 51 | 46 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114143 | 114166 | 114161 | 24 | 19 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114167 | 114225 | 114218 | 59 | 52 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 114226 | 114284 | 114615 | 59 | 390 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 114285 | 114371 | 114316 | 87 | 32 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114372 | 114378 | 114376 | 7 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114379 | 114398 | 114488 | 20 | 110 | `fetchWithRetry` | async const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114399 | 114438 | 114399 | 40 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114439 | 114553 | 114439 | 115 | 1 | `postTimeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114554 | 114554 | 114554 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114555 | 114620 | 114555 | 66 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114621 | 114640 | 114635 | 20 | 15 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114641 | 114647 | 114668 | 7 | 28 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114648 | 114673 | 114662 | 26 | 15 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114674 | 114683 | 114678 | 10 | 5 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114684 | 114716 | 114711 | 33 | 28 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 114717 | 114802 | 114918 | 86 | 202 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 114803 | 114922 | 114914 | 120 | 112 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114923 | 114976 | 114972 | 54 | 50 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114977 | 115002 | 114998 | 26 | 22 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 115003 | 115024 | 115020 | 22 | 18 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 115025 | 115038 | 115034 | 14 | 10 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115039 | 115065 | 115048 | 27 | 10 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115066 | 115089 | 115156 | 24 | 91 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 115090 | 115121 | 115090 | 32 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 115122 | 115162 | 115122 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 115163 | 115198 | 115183 | 36 | 21 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115199 | 115214 | 115213 | 16 | 15 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 115215 | 115304 | 115300 | 90 | 86 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115305 | 115321 | 115401 | 17 | 97 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115322 | 115412 | 115343 | 91 | 22 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 115413 | 115466 | 115461 | 54 | 49 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 115467 | 115497 | 115492 | 31 | 26 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115498 | 115526 | 115520 | 29 | 23 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115527 | 115578 | 115573 | 52 | 47 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115579 | 115806 | 115802 | 228 | 224 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115807 | 115821 | 115817 | 15 | 11 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115822 | 115839 | 115834 | 18 | 13 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115840 | 115870 | 116054 | 31 | 215 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115871 | 115871 | 115871 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115872 | 115883 | 115872 | 12 | 1 | `colors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115884 | 115992 | 115884 | 109 | 1 | `totalData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 115993 | 116004 | 115993 | 12 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116005 | 116020 | 116005 | 16 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116021 | 116058 | 116021 | 38 | 1 | `epdoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116059 | 116086 | 116114 | 28 | 56 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116087 | 116123 | 116094 | 37 | 8 | `totals` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116124 | 116171 | 116167 | 48 | 44 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116172 | 116178 | 116174 | 7 | 3 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116179 | 116195 | 116186 | 17 | 8 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116196 | 116206 | 116419 | 11 | 224 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116207 | 116207 | 116207 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116208 | 116423 | 116208 | 216 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116424 | 116433 | 116429 | 10 | 6 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 116434 | 116475 | 116471 | 42 | 38 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 116476 | 116500 | 116496 | 25 | 21 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116501 | 116520 | 116516 | 20 | 16 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116521 | 116524 | 116541 | 4 | 21 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116525 | 116550 | 116525 | 26 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 116551 | 116569 | 116836 | 19 | 286 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116570 | 116570 | 116570 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116571 | 116840 | 116571 | 270 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116841 | 116904 | 116883 | 64 | 43 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116905 | 117101 | 117097 | 197 | 193 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 117102 | 117120 | 117116 | 19 | 15 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117121 | 117146 | 117142 | 26 | 22 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117147 | 117235 | 117231 | 89 | 85 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 117236 | 117281 | 117277 | 46 | 42 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117282 | 117288 | 117284 | 7 | 3 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117289 | 117295 | 117291 | 7 | 3 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117296 | 117321 | 117317 | 26 | 22 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117322 | 117407 | 117403 | 86 | 82 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117408 | 117424 | 117420 | 17 | 13 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117425 | 117457 | 117453 | 33 | 29 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117458 | 117556 | 117547 | 99 | 90 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 117557 | 117575 | 117571 | 19 | 15 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117576 | 117695 | 117691 | 120 | 116 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 117696 | 117712 | 117708 | 17 | 13 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 117713 | 117724 | 117720 | 12 | 8 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117725 | 117736 | 117732 | 12 | 8 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117737 | 117743 | 117739 | 7 | 3 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117744 | 117751 | 117747 | 8 | 4 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 117752 | 117762 | 117758 | 11 | 7 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 117763 | 117776 | 117772 | 14 | 10 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117777 | 117804 | 117796 | 28 | 20 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117805 | 117829 | 117825 | 25 | 21 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 117830 | 117905 | 117848 | 76 | 19 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 117906 | 117969 | 117965 | 64 | 60 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 117970 | 117977 | 117972 | 8 | 3 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117978 | 117995 | 117990 | 18 | 13 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 117996 | 118020 | 118012 | 25 | 17 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 118021 | 118048 | 118044 | 28 | 24 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118049 | 118062 | 118058 | 14 | 10 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118063 | 118107 | 118103 | 45 | 41 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118108 | 118134 | 118130 | 27 | 23 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118135 | 118151 | 118146 | 17 | 12 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118152 | 118173 | 118168 | 22 | 17 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 118174 | 118359 | 118355 | 186 | 182 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 118360 | 118371 | 118367 | 12 | 8 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 118372 | 118552 | 118548 | 181 | 177 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 118553 | 118564 | 118560 | 12 | 8 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 118565 | 118578 | 118574 | 14 | 10 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 118579 | 118612 | 118593 | 34 | 15 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 118613 | 118666 | 118662 | 54 | 50 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 118667 | 118683 | 118679 | 17 | 13 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118684 | 118730 | 118819 | 47 | 136 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118731 | 118823 | 118731 | 93 | 1 | `sampleValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118824 | 118839 | 118835 | 16 | 12 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 118840 | 118893 | 118889 | 54 | 50 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 118894 | 119015 | 119011 | 122 | 118 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119016 | 119028 | 119023 | 13 | 8 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 119029 | 119098 | 119088 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 119099 | 119128 | 119108 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119129 | 119197 | 119168 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 119198 | 119205 | 119204 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119206 | 119242 | 119237 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119243 | 119263 | 119246 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119264 | 119276 | 119272 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119277 | 119354 | 119349 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 119355 | 119372 | 119359 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 119373 | 119396 | 119392 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 119397 | 119404 | 119400 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 119405 | 119417 | 119710 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 119418 | 119424 | 119418 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119425 | 119533 | 119425 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 119534 | 119544 | 119540 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119545 | 119602 | 119597 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119603 | 119717 | 119603 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119718 | 119736 | 119942 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 119737 | 119809 | 119739 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119810 | 119946 | 119812 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119947 | 119965 | 119961 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 119966 | 120005 | 120000 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
