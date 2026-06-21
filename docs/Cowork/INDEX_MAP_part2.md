# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (83345 lines)

Declarations in this part: **1007**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40001 | 40208 | 40006 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40209 | 40279 | 40214 | 71 | 6 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 40280 | 40306 | 40304 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40307 | 40324 | 41552 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 40325 | 40339 | 40337 | 15 | 13 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 40340 | 40356 | 40354 | 17 | 15 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 40357 | 40367 | 40365 | 11 | 9 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 40368 | 40399 | 40397 | 32 | 30 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 40400 | 40419 | 40417 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40420 | 40502 | 40430 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 40503 | 40582 | 40503 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40583 | 40727 | 40583 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40728 | 40772 | 40732 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40773 | 40854 | 40782 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40855 | 41055 | 40855 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41056 | 41598 | 41056 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41599 | 41620 | 41616 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 41621 | 41629 | 41625 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41630 | 41799 | 41723 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41800 | 41815 | 41809 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41816 | 41832 | 41825 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41833 | 41842 | 41835 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41843 | 41869 | 41863 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41870 | 41882 | 41876 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41883 | 41900 | 41982 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41901 | 41917 | 41911 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41918 | 41988 | 41918 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41989 | 41999 | 41993 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42000 | 42031 | 42025 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42032 | 42050 | 42045 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42051 | 42071 | 42064 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42072 | 42118 | 42112 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 42119 | 42192 | 42187 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42193 | 42269 | 42262 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42270 | 42304 | 42299 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 42305 | 42632 | 42628 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42633 | 42732 | 42728 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 42733 | 42733 | 42797 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42734 | 42756 | 42735 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42757 | 42801 | 42757 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42802 | 42889 | 42885 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42890 | 42890 | 42958 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42891 | 42962 | 42892 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42963 | 42980 | 42975 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 42981 | 42994 | 42990 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42995 | 43104 | 43100 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43105 | 43125 | 43157 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43126 | 43161 | 43126 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43162 | 43185 | 43181 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43186 | 43201 | 43197 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 43202 | 43208 | 43234 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43209 | 43226 | 43225 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43227 | 43238 | 43227 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43239 | 43271 | 43302 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43272 | 43305 | 43282 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43306 | 43328 | 43326 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43329 | 43347 | 43345 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43348 | 43358 | 43356 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43359 | 43376 | 43374 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43377 | 43384 | 43382 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43385 | 43432 | 43422 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43433 | 43451 | 43618 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43452 | 43454 | 43457 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43455 | 43512 | 43455 | 58 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43513 | 43518 | 43518 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 43519 | 43577 | 43525 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43578 | 43600 | 43582 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 43601 | 43620 | 43601 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43621 | 43678 | 43829 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43679 | 43831 | 43679 | 153 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43832 | 43872 | 43870 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43873 | 43889 | 43887 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43890 | 44098 | 44096 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44099 | 44121 | 44119 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 44122 | 44131 | 44189 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44132 | 44134 | 44132 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44135 | 44191 | 44135 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44192 | 44209 | 44207 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44210 | 44262 | 44343 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44263 | 44290 | 44263 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44291 | 44304 | 44291 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44305 | 44318 | 44305 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 44319 | 44332 | 44319 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44333 | 44345 | 44333 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44346 | 44350 | 44390 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44351 | 44361 | 44351 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44362 | 44392 | 44368 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44393 | 44430 | 44428 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44431 | 44474 | 44477 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44475 | 44478 | 44475 | 4 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44479 | 44502 | 44879 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44503 | 44637 | 44520 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44638 | 44739 | 44656 | 102 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 44740 | 44880 | 44749 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44881 | 44891 | 44889 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44892 | 44898 | 44897 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44899 | 44923 | 44902 | 25 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44924 | 44940 | 44924 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44941 | 44975 | 44974 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44976 | 45004 | 44992 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45005 | 45029 | 45028 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45030 | 45076 | 45062 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45077 | 45096 | 45095 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 45097 | 45124 | 45109 | 28 | 13 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45125 | 45201 | 45160 | 77 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45202 | 45239 | 45231 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45240 | 45253 | 45248 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45254 | 45296 | 45292 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45297 | 45321 | 45317 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 45322 | 45355 | 45326 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45356 | 45374 | 45366 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45375 | 45401 | 45394 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 45402 | 45425 | 45416 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 45426 | 45450 | 45443 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45451 | 45460 | 45476 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 45461 | 45471 | 45465 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45472 | 45472 | 45472 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45473 | 45484 | 45473 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45485 | 45500 | 45494 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45501 | 45501 | 45533 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 45502 | 45513 | 45507 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45514 | 45525 | 45518 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45526 | 45540 | 45529 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45541 | 45712 | 45541 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45713 | 45727 | 45721 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 45728 | 45740 | 45735 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45741 | 45759 | 45833 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45760 | 45839 | 45760 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45840 | 45841 | 45857 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45842 | 45861 | 45846 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45862 | 45879 | 45875 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45880 | 45889 | 45956 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45890 | 45933 | 45890 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45934 | 45960 | 45934 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45961 | 45970 | 45986 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45971 | 45994 | 45974 | 24 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45995 | 45995 | 46006 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 45996 | 46010 | 45996 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46011 | 46033 | 46029 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46034 | 46050 | 46046 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 46051 | 46063 | 46083 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46064 | 46095 | 46070 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 46096 | 46124 | 46119 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 46125 | 46161 | 46159 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 46162 | 46172 | 46171 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46173 | 46201 | 46193 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46202 | 46302 | 46443 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46303 | 46323 | 46303 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46324 | 46324 | 46324 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46325 | 46325 | 46325 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46326 | 46327 | 46326 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46328 | 46369 | 46328 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46370 | 46451 | 46370 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46452 | 46487 | 46481 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46488 | 46489 | 46511 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46490 | 46512 | 46497 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46513 | 46660 | 46613 | 148 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 46661 | 46694 | 46755 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46695 | 46773 | 46695 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46774 | 46826 | 47253 | 53 | 480 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46827 | 46833 | 46827 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 46834 | 46857 | 46834 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 46858 | 46914 | 46861 | 57 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 46915 | 46915 | 46915 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46916 | 46916 | 46916 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46917 | 46949 | 46917 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46950 | 46977 | 46954 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46978 | 46979 | 46988 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 46980 | 47043 | 46980 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47044 | 47050 | 47050 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47051 | 47056 | 47056 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47057 | 47092 | 47071 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47093 | 47154 | 47093 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47155 | 47257 | 47155 | 103 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47258 | 47352 | 47473 | 95 | 216 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 47353 | 47378 | 47353 | 26 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47379 | 47379 | 47379 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47380 | 47380 | 47380 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47381 | 47434 | 47381 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47435 | 47435 | 47454 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47436 | 47476 | 47436 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47477 | 47514 | 47513 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47515 | 47527 | 47602 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47528 | 47610 | 47531 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47611 | 47617 | 47616 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47618 | 47697 | 47696 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47698 | 47704 | 47703 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47705 | 47713 | 47743 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47714 | 47744 | 47714 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47745 | 47794 | 47793 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47795 | 47812 | 47811 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47813 | 47898 | 47840 | 86 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47899 | 47948 | 47943 | 50 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47949 | 48029 | 48025 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48030 | 48130 | 48126 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48131 | 48148 | 48223 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48149 | 48229 | 48149 | 81 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48230 | 48377 | 48350 | 148 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48378 | 48387 | 48386 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 48388 | 48411 | 48410 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 48412 | 48503 | 48418 | 92 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 48504 | 48543 | 48666 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 48544 | 48594 | 48548 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 48595 | 48933 | 48595 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48934 | 48996 | 48986 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 48997 | 49008 | 49144 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49009 | 49149 | 49013 | 141 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 49150 | 49203 | 49198 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49204 | 49287 | 49282 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49288 | 49352 | 49348 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49353 | 49492 | 49487 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49493 | 49536 | 49582 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 49537 | 49587 | 49559 | 51 | 23 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 49588 | 49593 | 49591 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 49594 | 49642 | 49640 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 49643 | 49666 | 49645 | 24 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 49667 | 49712 | 49717 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 49713 | 49719 | 49713 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49720 | 49732 | 49730 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49733 | 49745 | 49743 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49746 | 49750 | 49748 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49751 | 49755 | 49753 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49756 | 49766 | 49866 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49767 | 49785 | 49767 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 49786 | 49868 | 49786 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49869 | 49897 | 49895 | 29 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49898 | 49940 | 49939 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 49941 | 49957 | 49956 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49958 | 49976 | 49975 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49977 | 49985 | 49984 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49986 | 50112 | 50111 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 50113 | 50156 | 50155 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50157 | 50214 | 50213 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50215 | 50250 | 50249 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50251 | 50316 | 50284 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50317 | 50356 | 50354 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 50357 | 50381 | 50379 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 50382 | 50547 | 50395 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 50548 | 50564 | 50548 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50565 | 50580 | 50565 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50581 | 50598 | 50583 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50599 | 50617 | 50599 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50618 | 50618 | 50618 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50619 | 50636 | 50621 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50637 | 50654 | 50637 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50655 | 50675 | 50657 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50676 | 50676 | 50676 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50677 | 50694 | 50677 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50695 | 50716 | 50714 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 50717 | 50734 | 50732 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50735 | 50757 | 50798 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 50758 | 50758 | 50758 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50759 | 50761 | 50759 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50762 | 50762 | 50762 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50763 | 50800 | 50763 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50801 | 50822 | 50820 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 50823 | 50859 | 50857 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50860 | 50905 | 51049 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 50906 | 50918 | 50906 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50919 | 50930 | 50919 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50931 | 50945 | 50934 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50946 | 51051 | 50949 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51052 | 51068 | 51078 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51069 | 51069 | 51069 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51070 | 51080 | 51070 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51081 | 51122 | 51120 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51123 | 51158 | 51156 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51159 | 51163 | 51176 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 51164 | 51178 | 51171 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 51179 | 51184 | 51182 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51185 | 51200 | 51199 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 51201 | 51268 | 51266 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 51269 | 51279 | 51277 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 51280 | 51299 | 51334 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 51300 | 51316 | 51311 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51317 | 51336 | 51317 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51337 | 51372 | 51370 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51373 | 51387 | 51426 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51388 | 51398 | 51388 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51399 | 51428 | 51407 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51429 | 51443 | 51485 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51444 | 51457 | 51447 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51458 | 51487 | 51466 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51488 | 51506 | 51504 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51507 | 51525 | 51523 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51526 | 51614 | 51612 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51615 | 51637 | 51635 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51638 | 51703 | 51690 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 51704 | 51739 | 51732 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51740 | 51763 | 51758 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51764 | 51799 | 51795 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51800 | 51830 | 51822 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51831 | 51854 | 51862 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51855 | 51872 | 51859 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51873 | 51906 | 51904 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51907 | 51963 | 51958 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51964 | 52018 | 52013 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52019 | 52047 | 52045 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 52048 | 52067 | 52065 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 52068 | 52073 | 52071 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52074 | 52083 | 52081 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52084 | 52106 | 52104 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52107 | 52130 | 52129 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52131 | 52152 | 52150 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52153 | 52280 | 52279 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52281 | 52302 | 52300 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 52303 | 52363 | 52356 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52364 | 52410 | 52409 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52411 | 52434 | 52433 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 52435 | 52498 | 52496 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 52499 | 52591 | 52589 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52592 | 52701 | 52719 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52702 | 52721 | 52702 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52722 | 52749 | 52747 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52750 | 52778 | 52777 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52779 | 52788 | 52786 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52789 | 52832 | 52830 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52833 | 52848 | 52847 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52849 | 52880 | 52879 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52881 | 52940 | 52936 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52941 | 52995 | 52991 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52996 | 53021 | 53020 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53022 | 53025 | 53055 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 53026 | 53056 | 53026 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 53057 | 53110 | 53108 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53111 | 53119 | 53128 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53120 | 53120 | 53120 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53121 | 53130 | 53121 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53131 | 53142 | 53140 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53143 | 53151 | 53149 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 53152 | 53163 | 53161 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53164 | 53169 | 53167 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 53170 | 53180 | 53178 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53181 | 53186 | 53184 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53187 | 53194 | 53192 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 53195 | 53233 | 53231 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53234 | 53260 | 53255 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53261 | 53389 | 53384 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53390 | 53415 | 53635 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53416 | 53643 | 53421 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 53644 | 53651 | 53650 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53652 | 53662 | 53661 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 53663 | 53696 | 53695 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 53697 | 53719 | 53718 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 53720 | 53724 | 53723 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53725 | 53730 | 53728 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 53731 | 53753 | 53751 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 53754 | 53770 | 53759 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53771 | 53779 | 53794 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53780 | 53796 | 53780 | 17 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 53797 | 53812 | 53810 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53813 | 53840 | 53838 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53841 | 53881 | 53879 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53882 | 53906 | 53904 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53907 | 53932 | 53929 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 53933 | 53940 | 53938 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 53941 | 53990 | 53988 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 53991 | 54004 | 53996 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54005 | 54026 | 54043 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54027 | 54073 | 54027 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54074 | 54076 | 54113 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 54077 | 54114 | 54077 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54115 | 54232 | 54115 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54233 | 54279 | 54233 | 47 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 54280 | 54293 | 54293 | 14 | 14 | `make` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54294 | 54294 | 54294 | 1 | 1 | `segments` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54295 | 54326 | 54295 | 32 | 1 | `intersections` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54327 | 54380 | 54342 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54381 | 54408 | 54402 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54409 | 54418 | 54412 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 54419 | 54424 | 54422 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54425 | 54490 | 54488 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54491 | 54504 | 54502 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54505 | 54512 | 54510 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54513 | 54568 | 54566 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54569 | 54588 | 54586 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54589 | 54595 | 54593 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54596 | 54636 | 54631 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 54637 | 54647 | 54644 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 54648 | 54656 | 54655 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54657 | 54702 | 54812 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54703 | 54814 | 54719 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54815 | 54859 | 54924 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54860 | 54881 | 54860 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54882 | 54892 | 54882 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54893 | 54927 | 54893 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54928 | 54931 | 54930 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54932 | 55022 | 55016 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 55023 | 55036 | 55034 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55037 | 55044 | 55042 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55045 | 55242 | 55283 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55243 | 55289 | 55243 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55290 | 55358 | 55356 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55359 | 55390 | 55388 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55391 | 55401 | 55399 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55402 | 55426 | 55420 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55427 | 55451 | 55449 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55452 | 55480 | 55478 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55481 | 55489 | 55487 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55490 | 55506 | 55504 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55507 | 55525 | 55523 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55526 | 55531 | 55529 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55532 | 55542 | 55540 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55543 | 55561 | 55559 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55562 | 55572 | 55570 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55573 | 55582 | 55580 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55583 | 55625 | 55623 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55626 | 55677 | 55737 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55678 | 55739 | 55680 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 55740 | 55775 | 55773 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55776 | 55781 | 55827 | 6 | 52 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55782 | 55829 | 55782 | 48 | 1 | `_isoYr` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55830 | 55862 | 55860 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55863 | 55901 | 55899 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55902 | 55938 | 55936 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55939 | 56178 | 56176 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56179 | 56238 | 56392 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56239 | 56248 | 56239 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56249 | 56259 | 56249 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56260 | 56275 | 56260 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56276 | 56292 | 56276 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56293 | 56304 | 56293 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56305 | 56394 | 56305 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56395 | 56420 | 56418 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56421 | 56428 | 56591 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56429 | 56435 | 56433 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56436 | 56436 | 56456 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56437 | 56620 | 56437 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56621 | 56637 | 56630 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 56638 | 56675 | 56668 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56676 | 56716 | 56710 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 56717 | 56734 | 56728 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 56735 | 56767 | 56758 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56768 | 56857 | 56848 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56858 | 56931 | 56921 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56932 | 56959 | 56953 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 56960 | 56968 | 57207 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56969 | 56975 | 56973 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56976 | 56986 | 56978 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56987 | 56987 | 56987 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56988 | 56988 | 56988 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56989 | 56992 | 56989 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56993 | 57064 | 56993 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57065 | 57209 | 57065 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 57210 | 57247 | 58693 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57248 | 57261 | 57259 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57262 | 57274 | 57272 | 13 | 11 | `addPageFooter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57275 | 57282 | 57280 | 8 | 6 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 57283 | 57290 | 57288 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 57291 | 57301 | 57299 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 57302 | 57773 | 57312 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57774 | 57863 | 57778 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57864 | 58105 | 57870 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 58106 | 58181 | 58106 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58182 | 58182 | 58182 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58183 | 58231 | 58183 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58232 | 58471 | 58245 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58472 | 58695 | 58472 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58696 | 58702 | 58700 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58703 | 58707 | 58706 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 58708 | 58882 | 59682 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 58883 | 58890 | 58883 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58891 | 59339 | 58891 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59340 | 59593 | 59340 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59594 | 59605 | 59597 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59606 | 59684 | 59608 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59685 | 59686 | 59832 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59687 | 59788 | 59687 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59789 | 59800 | 59792 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59801 | 59806 | 59805 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 59807 | 59833 | 59807 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59834 | 59884 | 60147 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59885 | 59885 | 59885 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59886 | 59886 | 59886 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59887 | 59887 | 59887 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59888 | 59890 | 59888 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59891 | 59972 | 59891 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59973 | 59973 | 59973 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 59974 | 60149 | 59974 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60150 | 60150 | 60206 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60151 | 60208 | 60151 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60209 | 60209 | 60221 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60210 | 60223 | 60210 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60224 | 60242 | 60240 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60243 | 60264 | 60262 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60265 | 60274 | 60272 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 60275 | 60290 | 60288 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60291 | 60299 | 60453 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60300 | 60455 | 60302 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60456 | 60476 | 60474 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60477 | 60493 | 60520 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60494 | 60497 | 60494 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 60498 | 60522 | 60498 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60523 | 60531 | 60565 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60532 | 60566 | 60532 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 60567 | 60594 | 60593 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60595 | 60632 | 60631 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60633 | 60637 | 60635 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60638 | 60655 | 60646 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60656 | 60761 | 60666 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60762 | 61293 | 60767 | 532 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61294 | 61342 | 61340 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61343 | 61392 | 61348 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61393 | 61410 | 61408 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61411 | 61511 | 61509 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61512 | 61522 | 61518 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61523 | 61573 | 61601 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61574 | 61604 | 61577 | 31 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61605 | 61614 | 61627 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61615 | 61630 | 61615 | 16 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61631 | 61751 | 61747 | 121 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61752 | 61896 | 61895 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61897 | 61914 | 61904 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 61915 | 61950 | 61944 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 61951 | 62028 | 62017 | 78 | 67 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62029 | 62082 | 62080 | 54 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62083 | 62087 | 62085 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 62088 | 62116 | 62115 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 62117 | 62141 | 62170 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62142 | 62145 | 62145 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62146 | 62171 | 62146 | 26 | 1 | `values` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62172 | 62201 | 62226 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62202 | 62202 | 62202 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62203 | 62227 | 62203 | 25 | 1 | `values` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62228 | 62257 | 62283 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62258 | 62258 | 62258 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62259 | 62284 | 62259 | 26 | 1 | `values` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62285 | 62314 | 62340 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62315 | 62315 | 62315 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62316 | 62341 | 62316 | 26 | 1 | `values` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62342 | 62353 | 62450 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62354 | 62401 | 62382 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 62402 | 62411 | 62402 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62412 | 62412 | 62412 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62413 | 62452 | 62413 | 40 | 1 | `values` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62453 | 62463 | 62462 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62464 | 62533 | 62523 | 70 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62534 | 62558 | 62556 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62559 | 62573 | 62571 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62574 | 62596 | 62594 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 62597 | 62618 | 62616 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 62619 | 62629 | 62627 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 62630 | 62634 | 62632 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62635 | 62639 | 62637 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62640 | 62647 | 62645 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62648 | 62665 | 62659 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62666 | 62677 | 62671 | 12 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62678 | 62722 | 62718 | 45 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62723 | 62938 | 62936 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62939 | 62961 | 62959 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62962 | 62973 | 63032 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62974 | 62976 | 62974 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62977 | 63038 | 62977 | 62 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63039 | 63115 | 63196 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63116 | 63143 | 63116 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63144 | 63157 | 63144 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63158 | 63171 | 63158 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 63172 | 63185 | 63172 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63186 | 63198 | 63186 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63199 | 63246 | 63234 | 48 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63247 | 63286 | 63273 | 40 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 63287 | 63321 | 63313 | 35 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 63322 | 63336 | 63330 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63337 | 63378 | 63993 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63379 | 63390 | 63389 | 12 | 11 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 63391 | 63402 | 63401 | 12 | 11 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 63403 | 63415 | 63414 | 13 | 12 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 63416 | 63423 | 63422 | 8 | 7 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 63424 | 63619 | 63430 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 63620 | 63751 | 63629 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63752 | 63825 | 63755 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63826 | 63834 | 63826 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63835 | 63894 | 63839 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63895 | 63929 | 63898 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63930 | 63930 | 63930 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63931 | 64006 | 63931 | 76 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64007 | 64060 | 64059 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 64061 | 64077 | 64076 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 64078 | 64084 | 64094 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64085 | 64106 | 64085 | 22 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64107 | 64125 | 64122 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 64126 | 64156 | 64153 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64157 | 64503 | 64494 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64504 | 64515 | 64566 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64516 | 64525 | 64521 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 64526 | 64536 | 64536 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 64537 | 64541 | 64541 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64542 | 64572 | 64555 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 64573 | 64652 | 64643 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64653 | 64656 | 64733 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 64657 | 64660 | 64657 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 64661 | 64734 | 64680 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 64735 | 64770 | 64769 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 64771 | 64778 | 64777 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64779 | 65077 | 65076 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 65078 | 65119 | 65113 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 65120 | 65166 | 65159 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65167 | 65169 | 65181 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65170 | 65182 | 65170 | 13 | 1 | `entries` | const arrow | — | refs:190 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65183 | 65185 | 65197 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65186 | 65198 | 65186 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65199 | 65201 | 65213 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65202 | 65214 | 65202 | 13 | 1 | `entries` | const arrow | — | refs:190 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65215 | 65217 | 65229 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65218 | 65230 | 65218 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65231 | 65233 | 65245 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65234 | 65246 | 65234 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65247 | 65291 | 65303 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65292 | 65304 | 65292 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65305 | 65325 | 65324 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65326 | 65328 | 65340 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65329 | 65341 | 65329 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65342 | 65358 | 65357 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65359 | 65382 | 65381 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65383 | 65396 | 65395 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65397 | 65418 | 65417 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65419 | 65454 | 65453 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65455 | 65485 | 65529 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 65486 | 65506 | 65486 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65507 | 65531 | 65507 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65532 | 65541 | 65564 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65542 | 65565 | 65542 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65566 | 65596 | 65636 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 65597 | 65617 | 65597 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65618 | 65638 | 65618 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65639 | 65648 | 65667 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65649 | 65668 | 65649 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65669 | 65732 | 65730 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 65733 | 65758 | 65757 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65759 | 65777 | 65800 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 65778 | 65778 | 65785 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65779 | 65801 | 65781 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65802 | 65849 | 65868 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65850 | 65851 | 65854 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65852 | 65869 | 65852 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65870 | 65940 | 65938 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65941 | 65969 | 65964 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65970 | 65981 | 65979 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65982 | 65993 | 65991 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65994 | 66002 | 65999 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66003 | 66076 | 66074 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 66077 | 66135 | 66133 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 66136 | 66238 | 66236 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66239 | 66296 | 66295 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66297 | 66337 | 66336 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66338 | 66349 | 66402 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66350 | 66350 | 66350 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66351 | 66358 | 66356 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66359 | 66361 | 66359 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66362 | 66403 | 66362 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66404 | 66432 | 66431 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66433 | 66487 | 66486 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 66488 | 66497 | 66520 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66498 | 66521 | 66498 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66522 | 66538 | 66612 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66539 | 66564 | 66539 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66565 | 66590 | 66583 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66591 | 66613 | 66591 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66614 | 66631 | 66642 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66632 | 66643 | 66632 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66644 | 66656 | 66655 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66657 | 66661 | 66695 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66662 | 66669 | 66662 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66670 | 66672 | 66680 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66673 | 66696 | 66675 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66697 | 66714 | 66713 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66715 | 66736 | 66735 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 66737 | 66745 | 66744 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66746 | 66769 | 66768 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66770 | 66779 | 66778 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66780 | 66790 | 66789 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66791 | 66899 | 67654 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66900 | 66930 | 66907 | 31 | 8 | `hexToRgb` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 66931 | 66939 | 66937 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66940 | 66947 | 66945 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66948 | 66964 | 66962 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66965 | 66989 | 66987 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66990 | 67000 | 66998 | 11 | 9 | `newPage` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 67001 | 67009 | 67007 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 67010 | 67030 | 67028 | 21 | 19 | `addText` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 67031 | 67046 | 67044 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 67047 | 67057 | 67055 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 67058 | 67111 | 67109 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67112 | 67134 | 67132 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 67135 | 67395 | 67135 | 261 | 1 | `addSpacer` | const arrow | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 67396 | 67517 | 67401 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67518 | 67551 | 67522 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67552 | 67660 | 67557 | 109 | 6 | `formatHour` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67661 | 67681 | 67676 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67682 | 67757 | 67755 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67758 | 67765 | 67763 | 8 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67766 | 67777 | 67773 | 12 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67778 | 67787 | 67780 | 10 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 67788 | 67819 | 67814 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 67820 | 68059 | 68057 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 68060 | 68074 | 68072 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68075 | 68085 | 68083 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68086 | 68101 | 68099 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68102 | 68133 | 68127 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68134 | 68173 | 68171 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68174 | 68203 | 68241 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68204 | 68219 | 68207 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68220 | 68243 | 68223 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68244 | 68258 | 68256 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68259 | 68271 | 68269 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68272 | 68310 | 68450 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68311 | 68348 | 68314 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68349 | 68452 | 68352 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68453 | 68467 | 68465 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68468 | 68485 | 68477 | 18 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68486 | 68525 | 68511 | 40 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68526 | 68616 | 68536 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68617 | 68653 | 68640 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68654 | 68656 | 68654 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 68657 | 68660 | 68657 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 68661 | 68690 | 68701 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 68691 | 68704 | 68691 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68705 | 68721 | 68748 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 68722 | 68750 | 68722 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68751 | 68761 | 68759 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 68762 | 68813 | 68811 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 68814 | 68888 | 68886 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 68889 | 68948 | 68946 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 68949 | 68955 | 68953 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 68956 | 69010 | 69004 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 69011 | 69019 | 69044 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 69020 | 69046 | 69020 | 27 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 69047 | 69063 | 69061 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 69064 | 69076 | 69107 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 69077 | 69109 | 69077 | 33 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 69110 | 69128 | 69126 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 69129 | 69169 | 69163 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 69170 | 69186 | 69216 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 69187 | 69218 | 69187 | 32 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 69219 | 69259 | 69257 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 69260 | 69285 | 69283 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 69286 | 69343 | 69341 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 69344 | 69400 | 69398 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 69401 | 69415 | 69483 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 69416 | 69439 | 69426 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69440 | 69458 | 69440 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69459 | 69466 | 69459 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69467 | 69473 | 69467 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 69474 | 69485 | 69480 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 69486 | 69499 | 69596 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 69500 | 69563 | 69512 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69564 | 69572 | 69564 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69573 | 69579 | 69573 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 69580 | 69604 | 69586 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 69605 | 69614 | 69667 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69615 | 69623 | 69618 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69624 | 69669 | 69627 | 46 | 4 | `setText` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 69670 | 69760 | 69758 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 69761 | 69858 | 69856 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 69859 | 69907 | 69918 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 69908 | 69920 | 69908 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69921 | 70175 | 70173 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 70176 | 70181 | 70179 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 70182 | 70224 | 70235 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 70225 | 70251 | 70225 | 27 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70252 | 70259 | 70254 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 70260 | 70296 | 70287 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 70297 | 70318 | 70314 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 70319 | 70328 | 70324 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 70329 | 70339 | 70334 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 70340 | 70378 | 70374 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70379 | 70454 | 70445 | 76 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 70455 | 70475 | 70485 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70476 | 70489 | 70476 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70490 | 70522 | 70518 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70523 | 70539 | 70525 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70540 | 70616 | 70612 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 70617 | 70650 | 70646 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70651 | 70700 | 70694 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70701 | 70772 | 70765 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 70773 | 70796 | 70792 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 70797 | 70813 | 70809 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 70814 | 70842 | 70833 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 70843 | 70921 | 70916 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 70922 | 70938 | 70934 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70939 | 71178 | 71174 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 71179 | 71253 | 71353 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 71254 | 71254 | 71254 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71255 | 71357 | 71255 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71358 | 71436 | 71482 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71437 | 71518 | 71437 | 82 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71519 | 71598 | 71633 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71599 | 71599 | 71599 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71600 | 71637 | 71600 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71638 | 71721 | 71919 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 71722 | 71722 | 71722 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71723 | 71852 | 71723 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71853 | 71853 | 71853 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71854 | 71920 | 71854 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71921 | 71943 | 71942 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 71944 | 72092 | 71974 | 149 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 72093 | 72241 | 72221 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72242 | 72250 | 72375 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72251 | 72377 | 72251 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72378 | 72394 | 72383 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72395 | 72401 | 72399 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72402 | 72412 | 72410 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72413 | 72431 | 72426 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72432 | 72445 | 72444 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72446 | 72451 | 72450 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72452 | 72462 | 72461 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 72463 | 72669 | 72668 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72670 | 72721 | 72720 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72722 | 72782 | 72781 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72783 | 72827 | 72826 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72828 | 72841 | 72840 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72842 | 72855 | 72854 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72856 | 72896 | 72895 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72897 | 72925 | 72924 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72926 | 73001 | 72974 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73002 | 73015 | 73014 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73016 | 73022 | 73021 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73023 | 73065 | 73064 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73066 | 73070 | 73069 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 73071 | 73099 | 73098 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73100 | 73132 | 73131 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73133 | 73235 | 73135 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73236 | 73482 | 73247 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 73483 | 73571 | 73483 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 73572 | 73599 | 73620 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 73600 | 73628 | 73600 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73629 | 73665 | 73655 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 73666 | 73699 | 73694 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 73700 | 73724 | 73718 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 73725 | 73756 | 73751 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73757 | 73825 | 73821 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 73826 | 73877 | 73873 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 73878 | 73892 | 73888 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 73893 | 73910 | 73906 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 73911 | 73928 | 73922 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 73929 | 74142 | 73963 | 214 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74143 | 74154 | 74152 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74155 | 74668 | 74164 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 74669 | 74830 | 74824 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74831 | 74880 | 74876 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 74881 | 74988 | 74981 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 74989 | 75033 | 75028 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75034 | 75148 | 75142 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75149 | 75211 | 75205 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75212 | 75312 | 75308 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75313 | 75410 | 75406 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 75411 | 75421 | 75417 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 75422 | 75479 | 75475 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75480 | 75490 | 75486 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75491 | 75533 | 75529 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 75534 | 75568 | 75564 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75569 | 75580 | 75576 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75581 | 75589 | 75585 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75590 | 75627 | 75623 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 75628 | 75642 | 75638 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75643 | 75663 | 75659 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75664 | 75676 | 75672 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75677 | 75689 | 75685 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75690 | 75719 | 75715 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75720 | 75740 | 75736 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75741 | 75747 | 75743 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75748 | 75798 | 75794 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75799 | 75832 | 75828 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75833 | 75852 | 75847 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75853 | 75978 | 75973 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75979 | 76042 | 76038 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76043 | 76054 | 76049 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76055 | 76084 | 76083 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76085 | 76095 | 76094 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 76096 | 76106 | 76105 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76107 | 76117 | 76116 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76118 | 76128 | 76127 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76129 | 76136 | 76135 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 76137 | 76153 | 76148 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76154 | 76156 | 76185 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76157 | 76186 | 76163 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76187 | 76203 | 76202 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76204 | 76229 | 76228 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76230 | 76252 | 76251 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76253 | 76270 | 76269 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76271 | 76281 | 76276 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76282 | 76293 | 76292 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76294 | 76313 | 76312 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 76314 | 76348 | 76343 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76349 | 76365 | 76364 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76366 | 76421 | 76420 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76422 | 76473 | 76472 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76474 | 76524 | 76543 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76525 | 76544 | 76527 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76545 | 76562 | 76578 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76563 | 76579 | 76563 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76580 | 76606 | 76605 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76607 | 76615 | 76650 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76616 | 76651 | 76619 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76652 | 76655 | 76665 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76656 | 76658 | 76658 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76659 | 76666 | 76663 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76667 | 76686 | 76685 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76687 | 76692 | 76715 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76693 | 76716 | 76695 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76717 | 76730 | 76729 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76731 | 76737 | 76736 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76738 | 76742 | 76741 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76743 | 76797 | 76796 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76798 | 76856 | 76855 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76857 | 76883 | 76882 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76884 | 76889 | 76888 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76890 | 76895 | 76900 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76896 | 76901 | 76896 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76902 | 76950 | 76945 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76951 | 76951 | 77090 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 76952 | 77001 | 76952 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77002 | 77098 | 77002 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77099 | 77133 | 77194 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 77134 | 77196 | 77134 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77197 | 77208 | 77203 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77209 | 77219 | 77274 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 77220 | 77275 | 77223 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77276 | 77286 | 77466 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 77287 | 77296 | 77289 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77297 | 77345 | 77297 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77346 | 77346 | 77346 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77347 | 77347 | 77347 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77348 | 77358 | 77348 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77359 | 77360 | 77359 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77361 | 77361 | 77361 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77362 | 77363 | 77362 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77364 | 77364 | 77364 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77365 | 77471 | 77365 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77472 | 77475 | 77492 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77476 | 77499 | 77476 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77500 | 77510 | 77556 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77511 | 77557 | 77513 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77558 | 77562 | 77561 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77563 | 77573 | 77572 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 77574 | 77589 | 77588 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 77590 | 77594 | 77593 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77595 | 77610 | 77605 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 77611 | 77625 | 77624 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77626 | 77635 | 77634 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77636 | 77648 | 77647 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77649 | 77660 | 77669 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77661 | 77670 | 77661 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77671 | 77692 | 77691 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77693 | 77721 | 77720 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77722 | 77729 | 77809 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77730 | 77741 | 77730 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77742 | 77755 | 77745 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77756 | 77794 | 77793 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77795 | 77816 | 77795 | 22 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77817 | 77860 | 77859 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77861 | 77866 | 77953 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 77867 | 77954 | 77867 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77955 | 77961 | 77960 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 77962 | 77965 | 77978 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77966 | 77983 | 77966 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77984 | 77984 | 78011 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77985 | 78006 | 77985 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78007 | 78019 | 78007 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78020 | 78070 | 78302 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 78071 | 78139 | 78079 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78140 | 78168 | 78158 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78169 | 78218 | 78178 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78219 | 78227 | 78226 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 78228 | 78303 | 78235 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78304 | 78322 | 78320 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78323 | 78455 | 78339 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78456 | 78481 | 78468 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78482 | 78496 | 78495 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78497 | 78561 | 78560 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78562 | 78614 | 78613 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78615 | 78622 | 78621 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 78623 | 78634 | 78633 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78635 | 78687 | 78667 | 53 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78688 | 78757 | 78747 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78758 | 78787 | 78767 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 78788 | 78856 | 78827 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78857 | 78864 | 78863 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78865 | 78901 | 78896 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78902 | 78922 | 78905 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78923 | 78935 | 78931 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78936 | 79013 | 79008 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 79014 | 79031 | 79018 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 79032 | 79055 | 79051 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 79056 | 79063 | 79059 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 79064 | 79076 | 79369 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 79077 | 79083 | 79077 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79084 | 79192 | 79084 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 79193 | 79203 | 79199 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79204 | 79261 | 79256 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79262 | 79376 | 79262 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79377 | 79395 | 79601 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 79396 | 79468 | 79398 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79469 | 79605 | 79471 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79606 | 79624 | 79620 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 79625 | 79664 | 79659 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79665 | 79679 | 79674 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79680 | 79680 | 79727 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 79681 | 79684 | 79681 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79685 | 79735 | 79688 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79736 | 79744 | 80050 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79745 | 79763 | 79745 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79764 | 79899 | 79784 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79900 | 79921 | 79900 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79922 | 79938 | 79930 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 79939 | 79963 | 79946 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 79964 | 80054 | 79967 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
