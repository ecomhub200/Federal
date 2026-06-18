# index.html function inventory — PART 4 (L120001–end)

Snapshot: 2026-05-20 · source `app/index.html` (124956 lines)

Declarations in this part: **129**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 120006 | 120020 | 120015 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120021 | 120021 | 120068 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 120022 | 120025 | 120022 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120026 | 120076 | 120029 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120077 | 120085 | 120391 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120086 | 120104 | 120086 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120105 | 120240 | 120125 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120241 | 120262 | 120241 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120263 | 120279 | 120271 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 120280 | 120304 | 120287 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 120305 | 120395 | 120308 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 120396 | 120418 | 120414 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120419 | 120421 | 120460 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120422 | 120464 | 120422 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120465 | 120466 | 120511 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120467 | 120480 | 120467 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120481 | 120519 | 120498 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 120520 | 120525 | 120742 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120526 | 120579 | 120531 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120580 | 120596 | 120588 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 120597 | 120668 | 120604 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 120669 | 120715 | 120672 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 120716 | 120718 | 120716 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120719 | 120746 | 120722 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120747 | 120775 | 120771 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120776 | 120777 | 120804 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120778 | 120808 | 120782 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120809 | 120810 | 120853 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120811 | 120827 | 120815 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120828 | 120874 | 120841 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 120875 | 120912 | 120908 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 120913 | 120948 | 120944 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120949 | 120966 | 120962 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120967 | 120984 | 120980 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 120985 | 120996 | 120990 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120997 | 121080 | 121303 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121081 | 121101 | 121085 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121102 | 121120 | 121102 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 121121 | 121131 | 121129 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 121132 | 121198 | 121192 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121199 | 121217 | 121206 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121218 | 121307 | 121223 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121308 | 121321 | 121363 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121322 | 121367 | 121322 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121368 | 121430 | 121426 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121431 | 121465 | 121435 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121466 | 121504 | 121483 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 121505 | 121514 | 121510 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121515 | 121595 | 121590 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 121596 | 121603 | 121598 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121604 | 121628 | 121609 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121629 | 121642 | 121631 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121643 | 121659 | 121686 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 121660 | 121690 | 121660 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121691 | 121708 | 121704 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 121709 | 121716 | 121712 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121717 | 121733 | 121729 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 121734 | 121770 | 121766 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121771 | 121796 | 121818 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121797 | 121825 | 121808 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 121826 | 121885 | 121879 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121886 | 121933 | 121928 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121934 | 121938 | 122007 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121939 | 122011 | 121939 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122012 | 122036 | 122032 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122037 | 122132 | 122128 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122133 | 122148 | 122382 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 122149 | 122267 | 122152 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122268 | 122386 | 122328 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 122387 | 122432 | 122428 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 122433 | 122444 | 122440 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122445 | 122458 | 122454 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122459 | 122494 | 122488 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122495 | 122545 | 122540 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122546 | 122623 | 122612 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 122624 | 122651 | 122689 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 122652 | 122707 | 122654 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122708 | 122726 | 122722 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122727 | 122770 | 122758 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 122771 | 122777 | 122773 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 122778 | 122836 | 122832 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 122837 | 122844 | 122895 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 122845 | 122899 | 122845 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122900 | 122950 | 122989 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 122951 | 122971 | 122954 | 21 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 122972 | 123001 | 122979 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 123002 | 123031 | 123027 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 123032 | 123067 | 123037 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 123068 | 123209 | 123103 | 142 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 123210 | 123217 | 123215 | 8 | 6 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123218 | 123231 | 123227 | 14 | 10 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123232 | 123236 | 123235 | 5 | 4 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123237 | 123241 | 123239 | 5 | 3 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123242 | 123283 | 123282 | 42 | 41 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123284 | 123289 | 123288 | 6 | 5 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123290 | 123300 | 123298 | 11 | 9 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123301 | 123361 | 123359 | 61 | 59 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123362 | 123386 | 123384 | 25 | 23 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123387 | 123404 | 123402 | 18 | 16 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123405 | 123473 | 123505 | 69 | 101 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123474 | 123506 | 123481 | 33 | 8 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 123507 | 123516 | 123515 | 10 | 9 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123517 | 123557 | 123554 | 41 | 38 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123558 | 123602 | 123601 | 45 | 44 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123603 | 123650 | 123649 | 48 | 47 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123651 | 123721 | 123720 | 71 | 70 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123722 | 123744 | 123743 | 23 | 22 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123745 | 123765 | 123764 | 21 | 20 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123766 | 123786 | 123785 | 21 | 20 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123787 | 123807 | 123806 | 21 | 20 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123808 | 123834 | 123832 | 27 | 25 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123835 | 123896 | 123895 | 62 | 61 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123897 | 123964 | 123963 | 68 | 67 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123965 | 123979 | 123978 | 15 | 14 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123980 | 123995 | 123994 | 16 | 15 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 123996 | 124013 | 124011 | 18 | 16 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124014 | 124018 | 124017 | 5 | 4 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124019 | 124085 | 124084 | 67 | 66 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124086 | 124163 | 124162 | 78 | 77 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124164 | 124173 | 124172 | 10 | 9 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124174 | 124177 | 124176 | 4 | 3 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124178 | 124193 | 124191 | 16 | 14 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124194 | 124226 | 124224 | 33 | 31 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124227 | 124263 | 124262 | 37 | 36 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124264 | 124306 | 124305 | 43 | 42 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124307 | 124310 | 124309 | 4 | 3 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124311 | 124348 | 124347 | 38 | 37 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124349 | 124841 | 124478 | 493 | 130 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 124842 | 124956 | 124848 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
