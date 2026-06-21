# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (83345 lines)

Declarations in this part: **79**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80055 | 80077 | 80073 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80078 | 80080 | 80119 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80081 | 80123 | 80081 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80124 | 80125 | 80170 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80126 | 80139 | 80126 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80140 | 80178 | 80157 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80179 | 80184 | 80401 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80185 | 80238 | 80190 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80239 | 80255 | 80247 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 80256 | 80327 | 80263 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 80328 | 80374 | 80331 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 80375 | 80377 | 80375 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80378 | 80405 | 80381 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80406 | 80434 | 80430 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80435 | 80436 | 80463 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80437 | 80467 | 80441 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80468 | 80469 | 80512 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80470 | 80486 | 80474 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80487 | 80533 | 80500 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80534 | 80571 | 80567 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80572 | 80607 | 80603 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80608 | 80625 | 80621 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80626 | 80643 | 80639 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 80644 | 80655 | 80649 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80656 | 80739 | 80962 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80740 | 80760 | 80744 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80761 | 80779 | 80761 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 80780 | 80790 | 80788 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80791 | 80857 | 80851 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80858 | 80876 | 80865 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80877 | 80966 | 80882 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80967 | 80980 | 81022 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80981 | 81026 | 80981 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81027 | 81089 | 81085 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81090 | 81124 | 81094 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81125 | 81163 | 81142 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81164 | 81173 | 81169 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81174 | 81254 | 81249 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 81255 | 81262 | 81257 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81263 | 81287 | 81268 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81288 | 81301 | 81290 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81302 | 81318 | 81345 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81319 | 81349 | 81319 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81350 | 81367 | 81363 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 81368 | 81375 | 81371 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81376 | 81392 | 81388 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 81393 | 81429 | 81425 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81430 | 81455 | 81477 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81456 | 81484 | 81467 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81485 | 81544 | 81538 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81545 | 81592 | 81587 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 81593 | 81597 | 81666 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81598 | 81670 | 81598 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81671 | 81695 | 81691 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81696 | 81791 | 81787 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81792 | 81807 | 82041 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 81808 | 81926 | 81811 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81927 | 82045 | 81987 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 82046 | 82091 | 82087 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82092 | 82103 | 82099 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82104 | 82117 | 82113 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82118 | 82153 | 82147 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82154 | 82204 | 82199 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82205 | 82282 | 82271 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82283 | 82310 | 82348 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82311 | 82366 | 82313 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82367 | 82385 | 82381 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82386 | 82429 | 82417 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 82430 | 82436 | 82432 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 82437 | 82495 | 82491 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 82496 | 82503 | 82554 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82504 | 82558 | 82504 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82559 | 82609 | 82648 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82610 | 82630 | 82613 | 21 | 4 | `setVal` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 82631 | 82660 | 82638 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82661 | 82690 | 82686 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 82691 | 82726 | 82696 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 82727 | 83230 | 82762 | 504 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 83231 | 83345 | 83237 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
