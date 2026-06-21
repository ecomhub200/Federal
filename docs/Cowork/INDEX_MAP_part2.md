# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (87792 lines)

Declarations in this part: **966**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40206 | 40276 | 40211 | 71 | 6 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 40277 | 40303 | 40301 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40304 | 40321 | 41549 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 40322 | 40336 | 40334 | 15 | 13 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 40337 | 40353 | 40351 | 17 | 15 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 40354 | 40364 | 40362 | 11 | 9 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 40365 | 40396 | 40394 | 32 | 30 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 40397 | 40416 | 40414 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40417 | 40499 | 40427 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 40500 | 40579 | 40500 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40580 | 40724 | 40580 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40725 | 40769 | 40729 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40770 | 40851 | 40779 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40852 | 41052 | 40852 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41053 | 41595 | 41053 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41596 | 41617 | 41613 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 41618 | 41626 | 41622 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41627 | 41796 | 41720 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41797 | 41812 | 41806 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41813 | 41829 | 41822 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41830 | 41839 | 41832 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41840 | 41866 | 41860 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41867 | 41879 | 41873 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41880 | 41897 | 41979 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41898 | 41914 | 41908 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41915 | 41985 | 41915 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41986 | 41996 | 41990 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41997 | 42028 | 42022 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42029 | 42047 | 42042 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42048 | 42068 | 42061 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42069 | 42115 | 42109 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 42116 | 42189 | 42184 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42190 | 42266 | 42259 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42267 | 42301 | 42296 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 42302 | 42629 | 42625 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42630 | 42729 | 42725 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 42730 | 42730 | 42794 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42731 | 42753 | 42732 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42754 | 42798 | 42754 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42799 | 42886 | 42882 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42887 | 42887 | 42955 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42888 | 42959 | 42889 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42960 | 42977 | 42972 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 42978 | 42991 | 42987 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42992 | 43101 | 43097 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43102 | 43122 | 43154 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43123 | 43158 | 43123 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43159 | 43182 | 43178 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43183 | 43198 | 43194 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 43199 | 43205 | 43231 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43206 | 43223 | 43222 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43224 | 43235 | 43224 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43236 | 43268 | 43299 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43269 | 43302 | 43279 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43303 | 43325 | 43323 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43326 | 43344 | 43342 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43345 | 43355 | 43353 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43356 | 43373 | 43371 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43374 | 43381 | 43379 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43382 | 43429 | 43419 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43430 | 43448 | 43615 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43449 | 43451 | 43454 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43452 | 43509 | 43452 | 58 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43510 | 43515 | 43515 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 43516 | 43574 | 43522 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43575 | 43597 | 43579 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 43598 | 43617 | 43598 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43618 | 43675 | 43826 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43676 | 43828 | 43676 | 153 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43829 | 43869 | 43867 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43870 | 43886 | 43884 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43887 | 44095 | 44093 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44096 | 44118 | 44116 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 44119 | 44128 | 44186 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44129 | 44131 | 44129 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44132 | 44188 | 44132 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44189 | 44206 | 44204 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44207 | 44259 | 44340 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44260 | 44287 | 44260 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44288 | 44301 | 44288 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44302 | 44315 | 44302 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 44316 | 44329 | 44316 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44330 | 44342 | 44330 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44343 | 44347 | 44387 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44348 | 44358 | 44348 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44359 | 44389 | 44365 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44390 | 44427 | 44425 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44428 | 44471 | 44474 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44472 | 44475 | 44472 | 4 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44476 | 44499 | 44876 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44500 | 44634 | 44517 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44635 | 44736 | 44653 | 102 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 44737 | 44877 | 44746 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44878 | 44888 | 44886 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44889 | 44895 | 44894 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44896 | 44920 | 44899 | 25 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44921 | 44937 | 44921 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44938 | 44972 | 44971 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44973 | 45001 | 44989 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45002 | 45026 | 45025 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45027 | 45073 | 45059 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45074 | 45093 | 45092 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 45094 | 45121 | 45106 | 28 | 13 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45122 | 45198 | 45157 | 77 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45199 | 45236 | 45228 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45237 | 45250 | 45245 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45251 | 45293 | 45289 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45294 | 45318 | 45314 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 45319 | 45352 | 45323 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45353 | 45371 | 45363 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45372 | 45398 | 45391 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 45399 | 45422 | 45413 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 45423 | 45447 | 45440 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45448 | 45457 | 45473 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 45458 | 45468 | 45462 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45469 | 45469 | 45469 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45470 | 45481 | 45470 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45482 | 45497 | 45491 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45498 | 45498 | 45530 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 45499 | 45510 | 45504 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45511 | 45522 | 45515 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45523 | 45537 | 45526 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45538 | 45709 | 45538 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45710 | 45724 | 45718 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 45725 | 45737 | 45732 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45738 | 45756 | 45830 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45757 | 45836 | 45757 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45837 | 45838 | 45854 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45839 | 45858 | 45843 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45859 | 45876 | 45872 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45877 | 45886 | 45953 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45887 | 45930 | 45887 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45931 | 45957 | 45931 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45958 | 45967 | 45983 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45968 | 45991 | 45971 | 24 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45992 | 45992 | 46003 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 45993 | 46007 | 45993 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46008 | 46030 | 46026 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46031 | 46047 | 46043 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 46048 | 46060 | 46080 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46061 | 46092 | 46067 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 46093 | 46121 | 46116 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 46122 | 46158 | 46156 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 46159 | 46169 | 46168 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46170 | 46198 | 46190 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46199 | 46299 | 46440 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46300 | 46320 | 46300 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46321 | 46321 | 46321 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46322 | 46322 | 46322 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46323 | 46324 | 46323 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46325 | 46366 | 46325 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46367 | 46448 | 46367 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46449 | 46484 | 46478 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46485 | 46486 | 46508 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46487 | 46509 | 46494 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46510 | 46657 | 46610 | 148 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 46658 | 46691 | 46752 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46692 | 46770 | 46692 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46771 | 46823 | 47250 | 53 | 480 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46824 | 46830 | 46824 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 46831 | 46854 | 46831 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 46855 | 46911 | 46858 | 57 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 46912 | 46912 | 46912 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46913 | 46913 | 46913 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46914 | 46946 | 46914 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46947 | 46974 | 46951 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46975 | 46976 | 46985 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 46977 | 47040 | 46977 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47041 | 47047 | 47047 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47048 | 47053 | 47053 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47054 | 47089 | 47068 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47090 | 47151 | 47090 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47152 | 47254 | 47152 | 103 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47255 | 47349 | 47470 | 95 | 216 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 47350 | 47375 | 47350 | 26 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47376 | 47376 | 47376 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47377 | 47377 | 47377 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47378 | 47431 | 47378 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47432 | 47432 | 47451 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47433 | 47473 | 47433 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47474 | 47511 | 47510 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47512 | 47524 | 47599 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47525 | 47607 | 47528 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47608 | 47614 | 47613 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47615 | 47694 | 47693 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47695 | 47701 | 47700 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47702 | 47710 | 47740 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47711 | 47741 | 47711 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47742 | 47791 | 47790 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47792 | 47809 | 47808 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47810 | 47866 | 47837 | 57 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47867 | 47898 | 48154 | 32 | 288 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47899 | 48015 | 47899 | 117 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48016 | 48155 | 48016 | 140 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 48156 | 48164 | 48201 | 9 | 46 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48165 | 48165 | 48165 | 1 | 1 | `fmt` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48166 | 48179 | 48171 | 14 | 6 | `parseLocal` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48180 | 48195 | 48180 | 16 | 1 | `qLastDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48196 | 48202 | 48196 | 7 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48203 | 48219 | 48251 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48220 | 48240 | 48220 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48241 | 48252 | 48245 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 48253 | 48297 | 48296 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48298 | 48316 | 48315 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48317 | 48347 | 48361 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48348 | 48362 | 48351 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 48363 | 48399 | 48398 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48400 | 48417 | 48425 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48418 | 48426 | 48418 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48427 | 48442 | 48462 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48443 | 48449 | 48443 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48450 | 48463 | 48450 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48464 | 48501 | 48557 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48502 | 48563 | 48502 | 62 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48564 | 48601 | 48600 | 38 | 37 | `_activeTierLabel` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48602 | 48654 | 48811 | 53 | 210 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48655 | 48655 | 48655 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48656 | 48692 | 48656 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48693 | 48724 | 48698 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48725 | 48812 | 48725 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48813 | 48847 | 48894 | 35 | 82 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48848 | 48895 | 48852 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48896 | 48905 | 48904 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48906 | 48920 | 48915 | 15 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48921 | 48967 | 48935 | 47 | 15 | `_cc367_filename` | window fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48968 | 49017 | 49012 | 50 | 45 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49018 | 49068 | 49067 | 51 | 50 | `exportReportPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49069 | 49130 | 49115 | 62 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49131 | 49144 | 49143 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49145 | 49162 | 49161 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49163 | 49187 | 49186 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 49188 | 49188 | 49204 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49189 | 49205 | 49189 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49206 | 49219 | 49218 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49220 | 49233 | 49232 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49234 | 49284 | 49282 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 49285 | 49325 | 49323 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49326 | 49392 | 49429 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49393 | 49395 | 49393 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 49396 | 49402 | 49400 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49403 | 49431 | 49409 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49432 | 49453 | 49463 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49454 | 49465 | 49456 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49466 | 49481 | 49479 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 49482 | 49488 | 49486 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49489 | 49501 | 49499 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49502 | 49504 | 49514 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49505 | 49515 | 49508 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49516 | 49517 | 49527 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49518 | 49523 | 49518 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49524 | 49528 | 49524 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49529 | 49580 | 49579 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49581 | 49609 | 50292 | 29 | 712 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49610 | 49625 | 49623 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49626 | 49633 | 49631 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49634 | 49640 | 49638 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 49641 | 49650 | 49648 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49651 | 49688 | 49686 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49689 | 49689 | 49712 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49690 | 49714 | 49690 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49715 | 49715 | 49760 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49716 | 49768 | 49716 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49769 | 49788 | 49774 | 20 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 49789 | 49791 | 49789 | 3 | 1 | `cc370EmptyLine` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49792 | 49793 | 49808 | 2 | 17 | `cc370BarList` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49794 | 49809 | 49794 | 16 | 1 | `max` | const arrow | — | refs:228 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49810 | 49811 | 49833 | 2 | 24 | `generateContributingFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49812 | 49834 | 49813 | 23 | 2 | `factorObjs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49835 | 49848 | 49847 | 14 | 13 | `generateRecommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49849 | 50293 | 49877 | 445 | 29 | `generateFundingSection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50294 | 50305 | 50302 | 12 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50306 | 50355 | 50354 | 50 | 49 | `_stateFundingPrograms` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50356 | 50395 | 50943 | 40 | 588 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50396 | 50412 | 50411 | 17 | 16 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 50413 | 50413 | 50413 | 1 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 50414 | 50416 | 50414 | 3 | 1 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 50417 | 50451 | 50443 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50452 | 50454 | 50452 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50455 | 50463 | 50461 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50464 | 50650 | 50474 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50651 | 50659 | 50651 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50660 | 50711 | 50660 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50712 | 50759 | 50712 | 48 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50760 | 50826 | 50760 | 67 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50827 | 50908 | 50827 | 82 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50909 | 50944 | 50909 | 36 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50945 | 50953 | 50952 | 9 | 8 | `hexToRgb` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 50954 | 50971 | 51277 | 18 | 324 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50972 | 51279 | 50972 | 308 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51280 | 51416 | 51389 | 137 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51417 | 51466 | 51461 | 50 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51467 | 51547 | 51543 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51548 | 51648 | 51644 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51649 | 51666 | 51741 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51667 | 51747 | 51667 | 81 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51748 | 51895 | 51868 | 148 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51896 | 51905 | 51904 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51906 | 51929 | 51928 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51930 | 52021 | 51936 | 92 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 52022 | 52061 | 52184 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52062 | 52112 | 52066 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 52113 | 52451 | 52113 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52452 | 52514 | 52504 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 52515 | 52526 | 52662 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 52527 | 52667 | 52531 | 141 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 52668 | 52721 | 52716 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52722 | 52805 | 52800 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52806 | 52870 | 52866 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52871 | 53010 | 53005 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53011 | 53054 | 53100 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53055 | 53105 | 53077 | 51 | 23 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 53106 | 53111 | 53109 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 53112 | 53160 | 53158 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53161 | 53184 | 53163 | 24 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 53185 | 53230 | 53235 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53231 | 53237 | 53231 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53238 | 53250 | 53248 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53251 | 53263 | 53261 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 53264 | 53268 | 53266 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53269 | 53273 | 53271 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53274 | 53284 | 53384 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53285 | 53303 | 53285 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 53304 | 53386 | 53304 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53387 | 53415 | 53413 | 29 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53416 | 53458 | 53457 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 53459 | 53475 | 53474 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53476 | 53494 | 53493 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53495 | 53503 | 53502 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53504 | 53630 | 53629 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 53631 | 53674 | 53673 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53675 | 53732 | 53731 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53733 | 53768 | 53767 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53769 | 53834 | 53802 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53835 | 53874 | 53872 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53875 | 53899 | 53897 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53900 | 54065 | 53913 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54066 | 54082 | 54066 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54083 | 54098 | 54083 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54099 | 54116 | 54101 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54117 | 54135 | 54117 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54136 | 54136 | 54136 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54137 | 54154 | 54139 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54155 | 54172 | 54155 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54173 | 54193 | 54175 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54194 | 54194 | 54194 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54195 | 54212 | 54195 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54213 | 54234 | 54232 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54235 | 54252 | 54250 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54253 | 54275 | 54316 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54276 | 54276 | 54276 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54277 | 54279 | 54277 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54280 | 54280 | 54280 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54281 | 54318 | 54281 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54319 | 54340 | 54338 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54341 | 54377 | 54375 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54378 | 54423 | 54567 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54424 | 54436 | 54424 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54437 | 54448 | 54437 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54449 | 54463 | 54452 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54464 | 54569 | 54467 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54570 | 54586 | 54596 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 54587 | 54587 | 54587 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54588 | 54598 | 54588 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54599 | 54640 | 54638 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54641 | 54676 | 54674 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54677 | 54681 | 54694 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 54682 | 54696 | 54689 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 54697 | 54702 | 54700 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54703 | 54718 | 54717 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 54719 | 54786 | 54784 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 54787 | 54797 | 54795 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 54798 | 54817 | 54852 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 54818 | 54834 | 54829 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54835 | 54854 | 54835 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54855 | 54890 | 54888 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54891 | 54905 | 54944 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54906 | 54916 | 54906 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54917 | 54946 | 54925 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54947 | 54961 | 55003 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54962 | 54975 | 54965 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54976 | 55005 | 54984 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55006 | 55024 | 55022 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55025 | 55043 | 55041 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55044 | 55132 | 55130 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55133 | 55155 | 55153 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55156 | 55221 | 55208 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 55222 | 55257 | 55250 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55258 | 55281 | 55276 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55282 | 55317 | 55313 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55318 | 55348 | 55340 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55349 | 55372 | 55380 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 55373 | 55390 | 55377 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55391 | 55424 | 55422 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55425 | 55481 | 55476 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55482 | 55536 | 55531 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55537 | 55565 | 55563 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 55566 | 55585 | 55583 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 55586 | 55591 | 55589 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55592 | 55601 | 55599 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55602 | 55624 | 55622 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55625 | 55648 | 55647 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55649 | 55670 | 55668 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55671 | 55798 | 55797 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55799 | 55820 | 55818 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 55821 | 55881 | 55874 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55882 | 55928 | 55927 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55929 | 55952 | 55951 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55953 | 56016 | 56014 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56017 | 56109 | 56107 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56110 | 56219 | 56237 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56220 | 56239 | 56220 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56240 | 56267 | 56265 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56268 | 56296 | 56295 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56297 | 56306 | 56304 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56307 | 56350 | 56348 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56351 | 56366 | 56365 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56367 | 56398 | 56397 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56399 | 56458 | 56454 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56459 | 56513 | 56509 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56514 | 56539 | 56538 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56540 | 56543 | 56573 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 56544 | 56574 | 56544 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 56575 | 56628 | 56626 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56629 | 56637 | 56646 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56638 | 56638 | 56638 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56639 | 56648 | 56639 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56649 | 56660 | 56658 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 56661 | 56669 | 56667 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 56670 | 56681 | 56679 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 56682 | 56687 | 56685 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 56688 | 56698 | 56696 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56699 | 56704 | 56702 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56705 | 56712 | 56710 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56713 | 56751 | 56749 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56752 | 56778 | 56773 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56779 | 56907 | 56902 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56908 | 56933 | 57153 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56934 | 57161 | 56939 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 57162 | 57169 | 57168 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57170 | 57180 | 57179 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 57181 | 57214 | 57213 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 57215 | 57237 | 57236 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 57238 | 57242 | 57241 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57243 | 57248 | 57246 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 57249 | 57271 | 57269 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 57272 | 57288 | 57277 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57289 | 57297 | 57312 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57298 | 57314 | 57298 | 17 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 57315 | 57330 | 57328 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57331 | 57358 | 57356 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57359 | 57399 | 57397 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57400 | 57424 | 57422 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57425 | 57450 | 57447 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57451 | 57458 | 57456 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 57459 | 57508 | 57506 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 57509 | 57522 | 57514 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 57523 | 57544 | 57561 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57545 | 57591 | 57545 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57592 | 57594 | 57631 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57595 | 57632 | 57595 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57633 | 57750 | 57633 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 57751 | 57797 | 57751 | 47 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 57798 | 57811 | 57811 | 14 | 14 | `make` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57812 | 57812 | 57812 | 1 | 1 | `segments` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57813 | 57844 | 57813 | 32 | 1 | `intersections` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57845 | 57898 | 57860 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57899 | 57926 | 57920 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 57927 | 57936 | 57930 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 57937 | 57942 | 57940 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 57943 | 58008 | 58006 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58009 | 58022 | 58020 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58023 | 58030 | 58028 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58031 | 58086 | 58084 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58087 | 58106 | 58104 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58107 | 58113 | 58111 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 58114 | 58154 | 58149 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 58155 | 58165 | 58162 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 58166 | 58174 | 58173 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58175 | 58220 | 58330 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58221 | 58332 | 58237 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58333 | 58377 | 58442 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 58378 | 58399 | 58378 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58400 | 58410 | 58400 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58411 | 58445 | 58411 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58446 | 58449 | 58448 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58450 | 58540 | 58534 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 58541 | 58554 | 58552 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58555 | 58562 | 58560 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58563 | 58760 | 58801 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58761 | 58807 | 58761 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58808 | 58876 | 58874 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58877 | 58908 | 58906 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58909 | 58919 | 58917 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58920 | 58944 | 58938 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58945 | 58969 | 58967 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58970 | 58998 | 58996 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58999 | 59007 | 59005 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59008 | 59024 | 59022 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59025 | 59043 | 59041 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59044 | 59049 | 59047 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59050 | 59060 | 59058 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59061 | 59079 | 59077 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59080 | 59090 | 59088 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59091 | 59100 | 59098 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59101 | 59143 | 59141 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59144 | 59195 | 59255 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 59196 | 59257 | 59198 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 59258 | 59293 | 59291 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59294 | 59299 | 59345 | 6 | 52 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59300 | 59347 | 59300 | 48 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59348 | 59380 | 59378 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59381 | 59419 | 59417 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59420 | 59456 | 59454 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59457 | 59696 | 59694 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59697 | 59756 | 59910 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 59757 | 59766 | 59757 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59767 | 59777 | 59767 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59778 | 59793 | 59778 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59794 | 59810 | 59794 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59811 | 59822 | 59811 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59823 | 59912 | 59823 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59913 | 59938 | 59936 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 59939 | 59946 | 60109 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59947 | 59953 | 59951 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59954 | 59954 | 59974 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59955 | 60138 | 59955 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60139 | 60155 | 60148 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60156 | 60193 | 60186 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60194 | 60234 | 60228 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 60235 | 60252 | 60246 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 60253 | 60285 | 60276 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60286 | 60375 | 60366 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60376 | 60449 | 60439 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60450 | 60477 | 60471 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60478 | 60486 | 60725 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60487 | 60493 | 60491 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60494 | 60504 | 60496 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60505 | 60505 | 60505 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60506 | 60506 | 60506 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60507 | 60510 | 60507 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60511 | 60582 | 60511 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60583 | 60727 | 60583 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 60728 | 60765 | 62211 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60766 | 60779 | 60777 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60780 | 60792 | 60790 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60793 | 60800 | 60798 | 8 | 6 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 60801 | 60808 | 60806 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 60809 | 60819 | 60817 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 60820 | 61291 | 60830 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61292 | 61381 | 61296 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61382 | 61623 | 61388 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61624 | 61699 | 61624 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61700 | 61700 | 61700 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61701 | 61749 | 61701 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61750 | 61989 | 61763 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61990 | 62213 | 61990 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62214 | 62220 | 62218 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62221 | 62225 | 62224 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 62226 | 62400 | 63200 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 62401 | 62408 | 62401 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62409 | 62857 | 62409 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62858 | 63111 | 62858 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63112 | 63123 | 63115 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63124 | 63202 | 63126 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63203 | 63204 | 63350 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63205 | 63306 | 63205 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63307 | 63318 | 63310 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63319 | 63324 | 63323 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 63325 | 63351 | 63325 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63352 | 63402 | 63665 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63403 | 63403 | 63403 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63404 | 63404 | 63404 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63405 | 63405 | 63405 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63406 | 63408 | 63406 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63409 | 63490 | 63409 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63491 | 63491 | 63491 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 63492 | 63667 | 63492 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63668 | 63668 | 63724 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63669 | 63726 | 63669 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63727 | 63727 | 63739 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63728 | 63741 | 63728 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63742 | 63760 | 63758 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63761 | 63782 | 63780 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63783 | 63792 | 63790 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 63793 | 63808 | 63806 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63809 | 63817 | 63971 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63818 | 63973 | 63820 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63974 | 63994 | 63992 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63995 | 64011 | 64038 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64012 | 64015 | 64012 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 64016 | 64040 | 64016 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 64041 | 64049 | 64083 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64050 | 64084 | 64050 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 64085 | 64112 | 64111 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64113 | 64150 | 64149 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64151 | 64155 | 64153 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64156 | 64173 | 64164 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64174 | 64279 | 64184 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64280 | 64811 | 64285 | 532 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64812 | 64860 | 64858 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64861 | 64910 | 64866 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64911 | 64928 | 64926 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64929 | 65029 | 65027 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65030 | 65040 | 65036 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65041 | 65091 | 65119 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65092 | 65122 | 65095 | 31 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65123 | 65132 | 65145 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65133 | 65148 | 65133 | 16 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65149 | 65269 | 65265 | 121 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 65270 | 65414 | 65413 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65415 | 65432 | 65422 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 65433 | 65468 | 65462 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 65469 | 65546 | 65535 | 78 | 67 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65547 | 65600 | 65598 | 54 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65601 | 65605 | 65603 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 65606 | 65634 | 65633 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 65635 | 65659 | 65688 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65660 | 65663 | 65663 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65664 | 65689 | 65664 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65690 | 65719 | 65744 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65720 | 65720 | 65720 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65721 | 65745 | 65721 | 25 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65746 | 65775 | 65801 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65776 | 65776 | 65776 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65777 | 65802 | 65777 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65803 | 65832 | 65858 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65833 | 65833 | 65833 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65834 | 65859 | 65834 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65860 | 65871 | 65968 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65872 | 65919 | 65900 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65920 | 65929 | 65920 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65930 | 65930 | 65930 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65931 | 65970 | 65931 | 40 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65971 | 65981 | 65980 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65982 | 66051 | 66041 | 70 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66052 | 66076 | 66074 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66077 | 66091 | 66089 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66092 | 66114 | 66112 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66115 | 66136 | 66134 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66137 | 66147 | 66145 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66148 | 66152 | 66150 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66153 | 66157 | 66155 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66158 | 66165 | 66163 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66166 | 66183 | 66177 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66184 | 66195 | 66189 | 12 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66196 | 66240 | 66236 | 45 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66241 | 66456 | 66454 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66457 | 66479 | 66477 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66480 | 66491 | 66550 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66492 | 66494 | 66492 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66495 | 66556 | 66495 | 62 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66557 | 66633 | 66714 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66634 | 66661 | 66634 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66662 | 66675 | 66662 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66676 | 66689 | 66676 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 66690 | 66703 | 66690 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66704 | 66716 | 66704 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66717 | 66764 | 66752 | 48 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66765 | 66804 | 66791 | 40 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 66805 | 66839 | 66831 | 35 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 66840 | 66854 | 66848 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66855 | 66896 | 67511 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66897 | 66908 | 66907 | 12 | 11 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 66909 | 66920 | 66919 | 12 | 11 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 66921 | 66933 | 66932 | 13 | 12 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 66934 | 66941 | 66940 | 8 | 7 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 66942 | 67137 | 66948 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 67138 | 67269 | 67147 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67270 | 67343 | 67273 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67344 | 67352 | 67344 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67353 | 67412 | 67357 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67413 | 67447 | 67416 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67448 | 67448 | 67448 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67449 | 67524 | 67449 | 76 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67525 | 67578 | 67577 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67579 | 67595 | 67594 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67596 | 67602 | 67612 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67603 | 67624 | 67603 | 22 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67625 | 67643 | 67640 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67644 | 67674 | 67671 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 67675 | 68021 | 68012 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68022 | 68033 | 68084 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68034 | 68043 | 68039 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 68044 | 68054 | 68054 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 68055 | 68059 | 68059 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68060 | 68090 | 68073 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68091 | 68170 | 68161 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68171 | 68174 | 68251 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 68175 | 68178 | 68175 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 68179 | 68252 | 68198 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 68253 | 68288 | 68287 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68289 | 68296 | 68295 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68297 | 68595 | 68594 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68596 | 68637 | 68631 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 68638 | 68684 | 68677 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68685 | 68687 | 68699 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68688 | 68700 | 68688 | 13 | 1 | `entries` | const arrow | — | refs:205 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68701 | 68703 | 68715 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68704 | 68716 | 68704 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68717 | 68719 | 68731 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68720 | 68732 | 68720 | 13 | 1 | `entries` | const arrow | — | refs:205 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68733 | 68735 | 68747 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68736 | 68748 | 68736 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68749 | 68751 | 68763 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68752 | 68764 | 68752 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68765 | 68809 | 68821 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68810 | 68822 | 68810 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68823 | 68843 | 68842 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68844 | 68846 | 68858 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68847 | 68859 | 68847 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68860 | 68876 | 68875 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68877 | 68900 | 68899 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68901 | 68914 | 68913 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68915 | 68936 | 68935 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68937 | 68972 | 68971 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68973 | 69003 | 69047 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69004 | 69024 | 69004 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69025 | 69049 | 69025 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69050 | 69059 | 69082 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69060 | 69083 | 69060 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69084 | 69114 | 69154 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69115 | 69135 | 69115 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69136 | 69156 | 69136 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69157 | 69166 | 69185 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69167 | 69186 | 69167 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69187 | 69250 | 69248 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69251 | 69276 | 69275 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69277 | 69295 | 69318 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69296 | 69296 | 69303 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69297 | 69319 | 69299 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69320 | 69367 | 69386 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 69368 | 69369 | 69372 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69370 | 69387 | 69370 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69388 | 69458 | 69456 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69459 | 69487 | 69482 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69488 | 69499 | 69497 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69500 | 69511 | 69509 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69512 | 69520 | 69517 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69521 | 69594 | 69592 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69595 | 69653 | 69651 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69654 | 69756 | 69754 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69757 | 69814 | 69813 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69815 | 69855 | 69854 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69856 | 69867 | 69920 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69868 | 69868 | 69868 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69869 | 69876 | 69874 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69877 | 69879 | 69877 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69880 | 69921 | 69880 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69922 | 69950 | 69949 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 69951 | 70005 | 70004 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 70006 | 70015 | 70038 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70016 | 70039 | 70016 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70040 | 70056 | 70130 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70057 | 70082 | 70057 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70083 | 70108 | 70101 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70109 | 70131 | 70109 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70132 | 70149 | 70160 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70150 | 70161 | 70150 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70162 | 70174 | 70173 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70175 | 70179 | 70213 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70180 | 70187 | 70180 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70188 | 70190 | 70198 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70191 | 70214 | 70193 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70215 | 70232 | 70231 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70233 | 70254 | 70253 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 70255 | 70263 | 70262 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70264 | 70287 | 70286 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 70288 | 70297 | 70296 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70298 | 70308 | 70307 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70309 | 70417 | 71172 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70418 | 70448 | 70425 | 31 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 70449 | 70457 | 70455 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 70458 | 70465 | 70463 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70466 | 70482 | 70480 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70483 | 70507 | 70505 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70508 | 70518 | 70516 | 11 | 9 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 70519 | 70527 | 70525 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 70528 | 70548 | 70546 | 21 | 19 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 70549 | 70564 | 70562 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 70565 | 70575 | 70573 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 70576 | 70629 | 70627 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70630 | 70652 | 70650 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 70653 | 70913 | 70653 | 261 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 70914 | 71035 | 70919 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71036 | 71069 | 71040 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71070 | 71178 | 71075 | 109 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 71179 | 71199 | 71194 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71200 | 71275 | 71273 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71276 | 71283 | 71281 | 8 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71284 | 71295 | 71291 | 12 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71296 | 71305 | 71298 | 10 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 71306 | 71337 | 71332 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 71338 | 71577 | 71575 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 71578 | 71592 | 71590 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71593 | 71603 | 71601 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 71604 | 71619 | 71617 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71620 | 71651 | 71645 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 71652 | 71691 | 71689 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71692 | 71721 | 71759 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 71722 | 71737 | 71725 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71738 | 71761 | 71741 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71762 | 71776 | 71774 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71777 | 71789 | 71787 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71790 | 71828 | 71968 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 71829 | 71866 | 71832 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71867 | 71970 | 71870 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71971 | 71985 | 71983 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71986 | 72003 | 71995 | 18 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72004 | 72043 | 72029 | 40 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72044 | 72134 | 72054 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72135 | 72171 | 72158 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72172 | 72174 | 72172 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 72175 | 72178 | 72175 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 72179 | 72208 | 72219 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 72209 | 72222 | 72209 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72223 | 72239 | 72266 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72240 | 72268 | 72240 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72269 | 72279 | 72277 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72280 | 72331 | 72329 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 72332 | 72406 | 72404 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 72407 | 72466 | 72464 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72467 | 72473 | 72471 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72474 | 72528 | 72522 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 72529 | 72537 | 72562 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 72538 | 72564 | 72538 | 27 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 72565 | 72581 | 72579 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72582 | 72594 | 72625 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72595 | 72627 | 72595 | 33 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 72628 | 72646 | 72644 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 72647 | 72687 | 72681 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 72688 | 72704 | 72734 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 72705 | 72736 | 72705 | 32 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 72737 | 72777 | 72775 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 72778 | 72803 | 72801 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 72804 | 72861 | 72859 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 72862 | 72918 | 72916 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 72919 | 72933 | 73001 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 72934 | 72957 | 72944 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72958 | 72976 | 72958 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72977 | 72984 | 72977 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72985 | 72991 | 72985 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 72992 | 73003 | 72998 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73004 | 73017 | 73114 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73018 | 73081 | 73030 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73082 | 73090 | 73082 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73091 | 73097 | 73091 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73098 | 73122 | 73104 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73123 | 73132 | 73185 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 73133 | 73141 | 73136 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73142 | 73187 | 73145 | 46 | 4 | `setText` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 73188 | 73278 | 73276 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 73279 | 73376 | 73374 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 73377 | 73425 | 73436 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73426 | 73438 | 73426 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73439 | 73693 | 73691 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 73694 | 73699 | 73697 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73700 | 73742 | 73753 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73743 | 73769 | 73743 | 27 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73770 | 73777 | 73772 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73778 | 73814 | 73805 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 73815 | 73836 | 73832 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 73837 | 73846 | 73842 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 73847 | 73857 | 73852 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 73858 | 73896 | 73892 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73897 | 73972 | 73963 | 76 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 73973 | 73993 | 74003 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73994 | 74007 | 73994 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74008 | 74040 | 74036 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74041 | 74057 | 74043 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 74058 | 74134 | 74130 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 74135 | 74168 | 74164 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74169 | 74218 | 74212 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74219 | 74290 | 74283 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74291 | 74314 | 74310 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74315 | 74331 | 74327 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 74332 | 74360 | 74351 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 74361 | 74439 | 74434 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 74440 | 74456 | 74452 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74457 | 74696 | 74692 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 74697 | 74771 | 74871 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 74772 | 74772 | 74772 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74773 | 74875 | 74773 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74876 | 74954 | 75000 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74955 | 75036 | 74955 | 82 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75037 | 75116 | 75151 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75117 | 75117 | 75117 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75118 | 75155 | 75118 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75156 | 75239 | 75437 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 75240 | 75240 | 75240 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75241 | 75370 | 75241 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75371 | 75371 | 75371 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75372 | 75438 | 75372 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75439 | 75461 | 75460 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 75462 | 75610 | 75492 | 149 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 75611 | 75759 | 75739 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75760 | 75768 | 75893 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 75769 | 75895 | 75769 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75896 | 75912 | 75901 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75913 | 75919 | 75917 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75920 | 75930 | 75928 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75931 | 75949 | 75944 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 75950 | 75963 | 75962 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75964 | 75969 | 75968 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 75970 | 75980 | 75979 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75981 | 76187 | 76186 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76188 | 76239 | 76238 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76240 | 76300 | 76299 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76301 | 76345 | 76344 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76346 | 76359 | 76358 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76360 | 76373 | 76372 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76374 | 76414 | 76413 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76415 | 76443 | 76442 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76444 | 76519 | 76492 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76520 | 76533 | 76532 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76534 | 76540 | 76539 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76541 | 76583 | 76582 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76584 | 76588 | 76587 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 76589 | 76617 | 76616 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76618 | 76650 | 76649 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76651 | 76753 | 76653 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76754 | 77000 | 76765 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 77001 | 77089 | 77001 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77090 | 77117 | 77138 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 77118 | 77146 | 77118 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77147 | 77183 | 77173 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 77184 | 77217 | 77212 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 77218 | 77242 | 77236 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 77243 | 77274 | 77269 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77275 | 77343 | 77339 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 77344 | 77395 | 77391 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 77396 | 77410 | 77406 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77411 | 77428 | 77424 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 77429 | 77446 | 77440 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 77447 | 77532 | 77481 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77533 | 77537 | 77603 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77538 | 77555 | 77538 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77556 | 77573 | 77556 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77574 | 77608 | 77574 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77609 | 77920 | 77623 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77921 | 77969 | 77921 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77970 | 78047 | 77970 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78048 | 78129 | 78125 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78130 | 78194 | 78190 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78195 | 78211 | 78207 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78212 | 78242 | 78237 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78243 | 78309 | 78305 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 78310 | 78360 | 78356 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78361 | 78375 | 78371 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78376 | 78392 | 78388 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 78393 | 78408 | 78404 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78409 | 78589 | 78443 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78590 | 78601 | 78599 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 78602 | 79115 | 78611 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79116 | 79277 | 79271 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79278 | 79327 | 79323 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 79328 | 79435 | 79428 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 79436 | 79480 | 79475 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79481 | 79595 | 79589 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79596 | 79658 | 79652 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79659 | 79759 | 79755 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79760 | 79857 | 79853 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 79858 | 79868 | 79864 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 79869 | 79926 | 79922 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 79927 | 79937 | 79933 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 79938 | 79980 | 79976 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79981 | 80015 | 80011 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
