# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (88651 lines)

Declarations in this part: **977**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40203 | 40273 | 40208 | 71 | 6 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 40274 | 40300 | 40298 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40301 | 40318 | 41546 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 40319 | 40333 | 40331 | 15 | 13 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 40334 | 40350 | 40348 | 17 | 15 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 40351 | 40361 | 40359 | 11 | 9 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 40362 | 40393 | 40391 | 32 | 30 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 40394 | 40413 | 40411 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40414 | 40496 | 40424 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 40497 | 40576 | 40497 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40577 | 40721 | 40577 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40722 | 40766 | 40726 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40767 | 40848 | 40776 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40849 | 41049 | 40849 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41050 | 41592 | 41050 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41593 | 41614 | 41610 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 41615 | 41623 | 41619 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41624 | 41793 | 41717 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41794 | 41809 | 41803 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41810 | 41826 | 41819 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41827 | 41836 | 41829 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41837 | 41863 | 41857 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41864 | 41876 | 41870 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41877 | 41894 | 41976 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41895 | 41911 | 41905 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41912 | 41982 | 41912 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41983 | 41993 | 41987 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41994 | 42025 | 42019 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42026 | 42044 | 42039 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42045 | 42065 | 42058 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42066 | 42112 | 42106 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 42113 | 42186 | 42181 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42187 | 42263 | 42256 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42264 | 42298 | 42293 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 42299 | 42626 | 42622 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42627 | 42726 | 42722 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 42727 | 42727 | 42791 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42728 | 42750 | 42729 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42751 | 42795 | 42751 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42796 | 42883 | 42879 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42884 | 42884 | 42952 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42885 | 42956 | 42886 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42957 | 42974 | 42969 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 42975 | 42988 | 42984 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42989 | 43098 | 43094 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43099 | 43119 | 43151 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43120 | 43155 | 43120 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43156 | 43179 | 43175 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43180 | 43195 | 43191 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 43196 | 43202 | 43228 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43203 | 43220 | 43219 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43221 | 43232 | 43221 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43233 | 43265 | 43296 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43266 | 43299 | 43276 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43300 | 43322 | 43320 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43323 | 43341 | 43339 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43342 | 43352 | 43350 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43353 | 43370 | 43368 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43371 | 43378 | 43376 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43379 | 43426 | 43416 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43427 | 43445 | 43612 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43446 | 43448 | 43451 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43449 | 43506 | 43449 | 58 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43507 | 43512 | 43512 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 43513 | 43571 | 43519 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43572 | 43594 | 43576 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 43595 | 43614 | 43595 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43615 | 43672 | 43823 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43673 | 43825 | 43673 | 153 | 1 | `hs` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43826 | 43866 | 43864 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43867 | 43883 | 43881 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 43884 | 44092 | 44090 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44093 | 44115 | 44113 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 44116 | 44125 | 44183 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44126 | 44128 | 44126 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44129 | 44185 | 44129 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44186 | 44203 | 44201 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44204 | 44256 | 44337 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44257 | 44284 | 44257 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44285 | 44298 | 44285 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44299 | 44312 | 44299 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 44313 | 44326 | 44313 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44327 | 44339 | 44327 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44340 | 44344 | 44384 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44345 | 44355 | 44345 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44356 | 44386 | 44362 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44387 | 44424 | 44422 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44425 | 44468 | 44471 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44469 | 44472 | 44469 | 4 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44473 | 44496 | 44873 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44497 | 44631 | 44514 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44632 | 44733 | 44650 | 102 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 44734 | 44874 | 44743 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44875 | 44885 | 44883 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44886 | 44892 | 44891 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44893 | 44917 | 44896 | 25 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 44918 | 44934 | 44918 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44935 | 44969 | 44968 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44970 | 44998 | 44986 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44999 | 45023 | 45022 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45024 | 45070 | 45056 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45071 | 45090 | 45089 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 45091 | 45118 | 45103 | 28 | 13 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45119 | 45195 | 45154 | 77 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45196 | 45233 | 45225 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45234 | 45247 | 45242 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45248 | 45290 | 45286 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45291 | 45315 | 45311 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 45316 | 45349 | 45320 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45350 | 45368 | 45360 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45369 | 45395 | 45388 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 45396 | 45419 | 45410 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 45420 | 45444 | 45437 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45445 | 45454 | 45470 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 45455 | 45465 | 45459 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45466 | 45466 | 45466 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45467 | 45478 | 45467 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45479 | 45494 | 45488 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45495 | 45495 | 45527 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 45496 | 45507 | 45501 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45508 | 45519 | 45512 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45520 | 45534 | 45523 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45535 | 45706 | 45535 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45707 | 45721 | 45715 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 45722 | 45734 | 45729 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 45735 | 45753 | 45827 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45754 | 45833 | 45754 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45834 | 45835 | 45851 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45836 | 45855 | 45840 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45856 | 45873 | 45869 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45874 | 45883 | 45950 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45884 | 45927 | 45884 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45928 | 45954 | 45928 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45955 | 45964 | 45980 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45965 | 45988 | 45968 | 24 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 45989 | 45989 | 46000 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 45990 | 46004 | 45990 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46005 | 46027 | 46023 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46028 | 46044 | 46040 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 46045 | 46057 | 46077 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46058 | 46089 | 46064 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 46090 | 46118 | 46113 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 46119 | 46155 | 46153 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 46156 | 46166 | 46165 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46167 | 46195 | 46187 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46196 | 46296 | 46437 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46297 | 46317 | 46297 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46318 | 46318 | 46318 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46319 | 46319 | 46319 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46320 | 46321 | 46320 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46322 | 46363 | 46322 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46364 | 46445 | 46364 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46446 | 46481 | 46475 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 46482 | 46483 | 46505 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 46484 | 46506 | 46491 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46507 | 46654 | 46607 | 148 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 46655 | 46688 | 46749 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46689 | 46767 | 46689 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46768 | 46820 | 47247 | 53 | 480 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46821 | 46827 | 46821 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 46828 | 46851 | 46828 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 46852 | 46908 | 46855 | 57 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 46909 | 46909 | 46909 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46910 | 46910 | 46910 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46911 | 46943 | 46911 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46944 | 46971 | 46948 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46972 | 46973 | 46982 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 46974 | 47037 | 46974 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47038 | 47044 | 47044 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47045 | 47050 | 47050 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47051 | 47086 | 47065 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47087 | 47148 | 47087 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47149 | 47251 | 47149 | 103 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47252 | 47346 | 47467 | 95 | 216 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 47347 | 47372 | 47347 | 26 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47373 | 47373 | 47373 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47374 | 47374 | 47374 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47375 | 47428 | 47375 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47429 | 47429 | 47448 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47430 | 47470 | 47430 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47471 | 47508 | 47507 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47509 | 47521 | 47596 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47522 | 47604 | 47525 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47605 | 47611 | 47610 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47612 | 47691 | 47690 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47692 | 47698 | 47697 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47699 | 47707 | 47737 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47708 | 47738 | 47708 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47739 | 47788 | 47787 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47789 | 47806 | 47805 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47807 | 47863 | 47834 | 57 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 47864 | 47895 | 48151 | 32 | 288 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47896 | 48012 | 47896 | 117 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48013 | 48152 | 48013 | 140 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 48153 | 48161 | 48198 | 9 | 46 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48162 | 48162 | 48162 | 1 | 1 | `fmt` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48163 | 48176 | 48168 | 14 | 6 | `parseLocal` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48177 | 48192 | 48177 | 16 | 1 | `qLastDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48193 | 48199 | 48193 | 7 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48200 | 48216 | 48248 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48217 | 48237 | 48217 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48238 | 48249 | 48242 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 48250 | 48294 | 48293 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48295 | 48313 | 48312 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48314 | 48344 | 48358 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48345 | 48359 | 48348 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 48360 | 48396 | 48395 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48397 | 48414 | 48422 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48415 | 48423 | 48415 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48424 | 48439 | 48459 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48440 | 48446 | 48440 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48447 | 48460 | 48447 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48461 | 48498 | 48554 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48499 | 48560 | 48499 | 62 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48561 | 48598 | 48597 | 38 | 37 | `_activeTierLabel` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48599 | 48651 | 48808 | 53 | 210 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48652 | 48652 | 48652 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48653 | 48689 | 48653 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48690 | 48721 | 48695 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48722 | 48809 | 48722 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48810 | 48844 | 48891 | 35 | 82 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48845 | 48892 | 48849 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48893 | 48902 | 48901 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48903 | 48917 | 48912 | 15 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48918 | 48964 | 48932 | 47 | 15 | `_cc367_filename` | window fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48965 | 49014 | 49009 | 50 | 45 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49015 | 49065 | 49064 | 51 | 50 | `exportReportPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49066 | 49127 | 49112 | 62 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49128 | 49141 | 49140 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49142 | 49159 | 49158 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49160 | 49184 | 49183 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 49185 | 49185 | 49201 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49186 | 49202 | 49186 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49203 | 49216 | 49215 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49217 | 49230 | 49229 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49231 | 49281 | 49279 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 49282 | 49322 | 49320 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49323 | 49389 | 49426 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49390 | 49392 | 49390 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 49393 | 49399 | 49397 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49400 | 49428 | 49406 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49429 | 49450 | 49460 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49451 | 49462 | 49453 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49463 | 49478 | 49476 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 49479 | 49485 | 49483 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49486 | 49498 | 49496 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49499 | 49501 | 49511 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49502 | 49512 | 49505 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49513 | 49514 | 49524 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49515 | 49520 | 49515 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49521 | 49525 | 49521 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49526 | 49577 | 49576 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49578 | 49606 | 50289 | 29 | 712 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49607 | 49622 | 49620 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49623 | 49630 | 49628 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49631 | 49637 | 49635 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 49638 | 49647 | 49645 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49648 | 49685 | 49683 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49686 | 49686 | 49709 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49687 | 49711 | 49687 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49712 | 49712 | 49757 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49713 | 49765 | 49713 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49766 | 49785 | 49771 | 20 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 49786 | 49788 | 49786 | 3 | 1 | `cc370EmptyLine` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49789 | 49790 | 49805 | 2 | 17 | `cc370BarList` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49791 | 49806 | 49791 | 16 | 1 | `max` | const arrow | — | refs:228 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49807 | 49808 | 49830 | 2 | 24 | `generateContributingFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49809 | 49831 | 49810 | 23 | 2 | `factorObjs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49832 | 49845 | 49844 | 14 | 13 | `generateRecommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49846 | 50290 | 49874 | 445 | 29 | `generateFundingSection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50291 | 50302 | 50299 | 12 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50303 | 50352 | 50351 | 50 | 49 | `_stateFundingPrograms` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50353 | 50392 | 50940 | 40 | 588 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50393 | 50409 | 50408 | 17 | 16 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 50410 | 50410 | 50410 | 1 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 50411 | 50413 | 50411 | 3 | 1 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 50414 | 50448 | 50440 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50449 | 50451 | 50449 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50452 | 50460 | 50458 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50461 | 50647 | 50471 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50648 | 50656 | 50648 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50657 | 50708 | 50657 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50709 | 50756 | 50709 | 48 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50757 | 50823 | 50757 | 67 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50824 | 50905 | 50824 | 82 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50906 | 50941 | 50906 | 36 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50942 | 50950 | 50949 | 9 | 8 | `hexToRgb` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 50951 | 50968 | 51274 | 18 | 324 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50969 | 51276 | 50969 | 308 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51277 | 51413 | 51386 | 137 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51414 | 51463 | 51458 | 50 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51464 | 51544 | 51540 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51545 | 51645 | 51641 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51646 | 51663 | 51738 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51664 | 51744 | 51664 | 81 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51745 | 51892 | 51865 | 148 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51893 | 51902 | 51901 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51903 | 51926 | 51925 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51927 | 51944 | 51933 | 18 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 51945 | 51976 | 51975 | 32 | 31 | `loadSavedKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51977 | 52012 | 52011 | 36 | 35 | `handleAIFileSelect` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52013 | 52023 | 52022 | 11 | 10 | `renderAttachments` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52024 | 52028 | 52027 | 5 | 4 | `removeAttachment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52029 | 52033 | 52032 | 5 | 4 | `askSuggestion` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 52034 | 52093 | 52092 | 60 | 59 | `clearAIChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52094 | 52098 | 52097 | 5 | 4 | `clearApiKey` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 52099 | 52137 | 52136 | 39 | 38 | `addMessage` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52138 | 52150 | 52149 | 13 | 12 | `addTypingIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52151 | 52155 | 52154 | 5 | 4 | `removeTypingIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52156 | 52224 | 52216 | 69 | 61 | `buildCrashDataContext` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52225 | 52233 | 52233 | 9 | 9 | `initMUTCDLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 52234 | 52249 | 52249 | 16 | 16 | `loadMUTCDLocation` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 52250 | 52256 | 52254 | 7 | 5 | `clearMUTCDLocation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 52257 | 52276 | 52274 | 20 | 18 | `loadMUTCDIndex` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 52277 | 52411 | 52398 | 135 | 122 | `buildMUTCDContext` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 52412 | 52468 | 52487 | 57 | 76 | `queryPineconeRAG` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52469 | 52489 | 52478 | 21 | 10 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52490 | 52593 | 52514 | 104 | 25 | `buildPineconeRAGContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52594 | 52633 | 52756 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52634 | 52684 | 52638 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 52685 | 53023 | 52685 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53024 | 53086 | 53076 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 53087 | 53098 | 53234 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53099 | 53239 | 53103 | 141 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 53240 | 53293 | 53288 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53294 | 53377 | 53372 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53378 | 53442 | 53438 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53443 | 53582 | 53577 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53583 | 53626 | 53672 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53627 | 53677 | 53649 | 51 | 23 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 53678 | 53683 | 53681 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 53684 | 53732 | 53730 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53733 | 53756 | 53735 | 24 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 53757 | 53802 | 53807 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 53803 | 53809 | 53803 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53810 | 53822 | 53820 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53823 | 53835 | 53833 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 53836 | 53840 | 53838 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53841 | 53845 | 53843 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53846 | 53856 | 53956 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53857 | 53875 | 53857 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 53876 | 53958 | 53876 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53959 | 53986 | 53985 | 28 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 53987 | 54087 | 54077 | 101 | 91 | `buildSystemPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54088 | 54242 | 54238 | 155 | 151 | `getAIAnalysisContext` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 54243 | 54249 | 54245 | 7 | 3 | `buildLocationCrashContext` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 54250 | 54274 | 54273 | 25 | 24 | `updateAIContextIndicator` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 54275 | 54317 | 54316 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 54318 | 54334 | 54333 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54335 | 54353 | 54352 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54354 | 54362 | 54361 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54363 | 54489 | 54488 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 54490 | 54533 | 54532 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54534 | 54591 | 54590 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54592 | 54627 | 54626 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54628 | 54693 | 54661 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54694 | 54733 | 54731 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54734 | 54758 | 54756 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54759 | 54924 | 54772 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54925 | 54941 | 54925 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54942 | 54957 | 54942 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54958 | 54975 | 54960 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54976 | 54994 | 54976 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54995 | 54995 | 54995 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54996 | 55013 | 54998 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55014 | 55031 | 55014 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55032 | 55052 | 55034 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55053 | 55053 | 55053 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55054 | 55071 | 55054 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55072 | 55093 | 55091 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55094 | 55111 | 55109 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55112 | 55134 | 55175 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55135 | 55135 | 55135 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55136 | 55138 | 55136 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55139 | 55139 | 55139 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55140 | 55177 | 55140 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55178 | 55199 | 55197 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55200 | 55236 | 55234 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55237 | 55282 | 55426 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55283 | 55295 | 55283 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55296 | 55307 | 55296 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55308 | 55322 | 55311 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55323 | 55428 | 55326 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55429 | 55445 | 55455 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55446 | 55446 | 55446 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55447 | 55457 | 55447 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55458 | 55499 | 55497 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55500 | 55535 | 55533 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55536 | 55540 | 55553 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55541 | 55555 | 55548 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 55556 | 55561 | 55559 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55562 | 55577 | 55576 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 55578 | 55645 | 55643 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 55646 | 55656 | 55654 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 55657 | 55676 | 55711 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 55677 | 55693 | 55688 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55694 | 55713 | 55694 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55714 | 55749 | 55747 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55750 | 55764 | 55803 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55765 | 55775 | 55765 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55776 | 55805 | 55784 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55806 | 55820 | 55862 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55821 | 55834 | 55824 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55835 | 55864 | 55843 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55865 | 55883 | 55881 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55884 | 55902 | 55900 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55903 | 55991 | 55989 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55992 | 56014 | 56012 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56015 | 56080 | 56067 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 56081 | 56116 | 56109 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 56117 | 56140 | 56135 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56141 | 56176 | 56172 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56177 | 56207 | 56199 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56208 | 56231 | 56239 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 56232 | 56249 | 56236 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56250 | 56283 | 56281 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56284 | 56340 | 56335 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56341 | 56395 | 56390 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56396 | 56424 | 56422 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 56425 | 56444 | 56442 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 56445 | 56450 | 56448 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56451 | 56460 | 56458 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56461 | 56483 | 56481 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56484 | 56507 | 56506 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56508 | 56529 | 56527 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56530 | 56657 | 56656 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 56658 | 56679 | 56677 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 56680 | 56740 | 56733 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 56741 | 56787 | 56786 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56788 | 56811 | 56810 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56812 | 56875 | 56873 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56876 | 56968 | 56966 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56969 | 57078 | 57096 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57079 | 57098 | 57079 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57099 | 57126 | 57124 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57127 | 57155 | 57154 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57156 | 57165 | 57163 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57166 | 57209 | 57207 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57210 | 57225 | 57224 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57226 | 57257 | 57256 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57258 | 57317 | 57313 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57318 | 57372 | 57368 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57373 | 57398 | 57397 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57399 | 57402 | 57432 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 57403 | 57433 | 57403 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 57434 | 57487 | 57485 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57488 | 57496 | 57505 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57497 | 57497 | 57497 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57498 | 57507 | 57498 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57508 | 57519 | 57517 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57520 | 57528 | 57526 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 57529 | 57540 | 57538 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57541 | 57546 | 57544 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 57547 | 57557 | 57555 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57558 | 57563 | 57561 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57564 | 57571 | 57569 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 57572 | 57610 | 57608 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57611 | 57637 | 57632 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57638 | 57766 | 57761 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57767 | 57792 | 58012 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57793 | 58020 | 57798 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 58021 | 58028 | 58027 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58029 | 58039 | 58038 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 58040 | 58073 | 58072 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58074 | 58096 | 58095 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58097 | 58101 | 58100 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58102 | 58107 | 58105 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58108 | 58130 | 58128 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58131 | 58147 | 58136 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58148 | 58156 | 58171 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58157 | 58173 | 58157 | 17 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 58174 | 58189 | 58187 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58190 | 58217 | 58215 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58218 | 58258 | 58256 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58259 | 58283 | 58281 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58284 | 58309 | 58306 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58310 | 58317 | 58315 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 58318 | 58367 | 58365 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 58368 | 58381 | 58373 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58382 | 58403 | 58420 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 58404 | 58450 | 58404 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58451 | 58453 | 58490 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58454 | 58491 | 58454 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58492 | 58609 | 58492 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 58610 | 58656 | 58610 | 47 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 58657 | 58670 | 58670 | 14 | 14 | `make` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58671 | 58671 | 58671 | 1 | 1 | `segments` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58672 | 58703 | 58672 | 32 | 1 | `intersections` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58704 | 58757 | 58719 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 58758 | 58785 | 58779 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 58786 | 58795 | 58789 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 58796 | 58801 | 58799 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58802 | 58867 | 58865 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58868 | 58881 | 58879 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58882 | 58889 | 58887 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58890 | 58945 | 58943 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58946 | 58965 | 58963 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 58966 | 58972 | 58970 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 58973 | 59013 | 59008 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 59014 | 59024 | 59021 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 59025 | 59033 | 59032 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59034 | 59079 | 59189 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59080 | 59191 | 59096 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59192 | 59236 | 59301 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 59237 | 59258 | 59237 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59259 | 59269 | 59259 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59270 | 59304 | 59270 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59305 | 59308 | 59307 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59309 | 59399 | 59393 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 59400 | 59413 | 59411 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59414 | 59421 | 59419 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59422 | 59619 | 59660 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59620 | 59666 | 59620 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59667 | 59735 | 59733 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59736 | 59767 | 59765 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59768 | 59778 | 59776 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59779 | 59803 | 59797 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59804 | 59828 | 59826 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59829 | 59857 | 59855 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59858 | 59866 | 59864 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59867 | 59883 | 59881 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59884 | 59902 | 59900 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59903 | 59908 | 59906 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59909 | 59919 | 59917 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59920 | 59938 | 59936 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59939 | 59949 | 59947 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59950 | 59959 | 59957 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59960 | 60002 | 60000 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60003 | 60054 | 60114 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 60055 | 60116 | 60057 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 60117 | 60152 | 60150 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60153 | 60158 | 60204 | 6 | 52 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60159 | 60206 | 60159 | 48 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60207 | 60239 | 60237 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60240 | 60278 | 60276 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60279 | 60315 | 60313 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60316 | 60555 | 60553 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60556 | 60615 | 60769 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60616 | 60625 | 60616 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60626 | 60636 | 60626 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60637 | 60652 | 60637 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60653 | 60669 | 60653 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60670 | 60681 | 60670 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60682 | 60771 | 60682 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60772 | 60797 | 60795 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60798 | 60805 | 60968 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60806 | 60812 | 60810 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60813 | 60813 | 60833 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60814 | 60997 | 60814 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60998 | 61014 | 61007 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61015 | 61052 | 61045 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61053 | 61093 | 61087 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 61094 | 61111 | 61105 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 61112 | 61144 | 61135 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61145 | 61234 | 61225 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61235 | 61308 | 61298 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61309 | 61336 | 61330 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61337 | 61345 | 61584 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61346 | 61352 | 61350 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61353 | 61363 | 61355 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61364 | 61364 | 61364 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61365 | 61365 | 61365 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61366 | 61369 | 61366 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61370 | 61441 | 61370 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61442 | 61586 | 61442 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 61587 | 61624 | 63070 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61625 | 61638 | 61636 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61639 | 61651 | 61649 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61652 | 61659 | 61657 | 8 | 6 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 61660 | 61667 | 61665 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 61668 | 61678 | 61676 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 61679 | 62150 | 61689 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62151 | 62240 | 62155 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62241 | 62482 | 62247 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62483 | 62558 | 62483 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62559 | 62559 | 62559 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62560 | 62608 | 62560 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62609 | 62848 | 62622 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62849 | 63072 | 62849 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63073 | 63079 | 63077 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63080 | 63084 | 63083 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 63085 | 63259 | 64059 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 63260 | 63267 | 63260 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63268 | 63716 | 63268 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63717 | 63970 | 63717 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63971 | 63982 | 63974 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63983 | 64061 | 63985 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64062 | 64063 | 64209 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64064 | 64165 | 64064 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64166 | 64177 | 64169 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64178 | 64183 | 64182 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 64184 | 64210 | 64184 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64211 | 64261 | 64524 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64262 | 64262 | 64262 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64263 | 64263 | 64263 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64264 | 64264 | 64264 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64265 | 64267 | 64265 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64268 | 64349 | 64268 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64350 | 64350 | 64350 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 64351 | 64526 | 64351 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64527 | 64527 | 64583 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64528 | 64585 | 64528 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64586 | 64586 | 64598 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64587 | 64600 | 64587 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64601 | 64619 | 64617 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64620 | 64641 | 64639 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64642 | 64651 | 64649 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 64652 | 64667 | 64665 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64668 | 64676 | 64830 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64677 | 64832 | 64679 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64833 | 64853 | 64851 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64854 | 64870 | 64897 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64871 | 64874 | 64871 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 64875 | 64899 | 64875 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 64900 | 64908 | 64942 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64909 | 64943 | 64909 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 64944 | 64971 | 64970 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64972 | 65009 | 65008 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 65010 | 65014 | 65012 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 65015 | 65032 | 65023 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 65033 | 65138 | 65043 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65139 | 65670 | 65144 | 532 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65671 | 65719 | 65717 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 65720 | 65769 | 65725 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65770 | 65787 | 65785 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65788 | 65888 | 65886 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65889 | 65899 | 65895 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65900 | 65950 | 65978 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65951 | 65981 | 65954 | 31 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65982 | 65991 | 66004 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65992 | 66007 | 65992 | 16 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66008 | 66128 | 66124 | 121 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66129 | 66273 | 66272 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66274 | 66291 | 66281 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 66292 | 66327 | 66321 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 66328 | 66405 | 66394 | 78 | 67 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66406 | 66459 | 66457 | 54 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66460 | 66464 | 66462 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 66465 | 66493 | 66492 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 66494 | 66518 | 66547 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66519 | 66522 | 66522 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66523 | 66548 | 66523 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66549 | 66578 | 66603 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66579 | 66579 | 66579 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66580 | 66604 | 66580 | 25 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66605 | 66634 | 66660 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66635 | 66635 | 66635 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66636 | 66661 | 66636 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66662 | 66691 | 66717 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66692 | 66692 | 66692 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66693 | 66718 | 66693 | 26 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66719 | 66730 | 66827 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66731 | 66778 | 66759 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66779 | 66788 | 66779 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66789 | 66789 | 66789 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66790 | 66829 | 66790 | 40 | 1 | `values` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66830 | 66840 | 66839 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66841 | 66910 | 66900 | 70 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66911 | 66935 | 66933 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66936 | 66950 | 66948 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66951 | 66973 | 66971 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66974 | 66995 | 66993 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66996 | 67006 | 67004 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67007 | 67011 | 67009 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67012 | 67016 | 67014 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67017 | 67024 | 67022 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67025 | 67042 | 67036 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67043 | 67054 | 67048 | 12 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67055 | 67099 | 67095 | 45 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67100 | 67315 | 67313 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67316 | 67338 | 67336 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67339 | 67350 | 67409 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67351 | 67353 | 67351 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67354 | 67415 | 67354 | 62 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67416 | 67492 | 67573 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67493 | 67520 | 67493 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67521 | 67534 | 67521 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67535 | 67548 | 67535 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 67549 | 67562 | 67549 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67563 | 67575 | 67563 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67576 | 67623 | 67611 | 48 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67624 | 67663 | 67650 | 40 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 67664 | 67698 | 67690 | 35 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 67699 | 67713 | 67707 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67714 | 67755 | 68370 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67756 | 67767 | 67766 | 12 | 11 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 67768 | 67779 | 67778 | 12 | 11 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 67780 | 67792 | 67791 | 13 | 12 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 67793 | 67800 | 67799 | 8 | 7 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 67801 | 67996 | 67807 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 67997 | 68128 | 68006 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68129 | 68202 | 68132 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68203 | 68211 | 68203 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68212 | 68271 | 68216 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68272 | 68306 | 68275 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68307 | 68307 | 68307 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68308 | 68383 | 68308 | 76 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68384 | 68437 | 68436 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68438 | 68454 | 68453 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68455 | 68461 | 68471 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68462 | 68483 | 68462 | 22 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68484 | 68502 | 68499 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68503 | 68533 | 68530 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68534 | 68880 | 68871 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68881 | 68892 | 68943 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 68893 | 68902 | 68898 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 68903 | 68913 | 68913 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 68914 | 68918 | 68918 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68919 | 68949 | 68932 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68950 | 69029 | 69020 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69030 | 69033 | 69110 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69034 | 69037 | 69034 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 69038 | 69111 | 69057 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 69112 | 69147 | 69146 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69148 | 69155 | 69154 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69156 | 69454 | 69453 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 69455 | 69496 | 69490 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 69497 | 69543 | 69536 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69544 | 69546 | 69558 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69547 | 69559 | 69547 | 13 | 1 | `entries` | const arrow | — | refs:213 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69560 | 69562 | 69574 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69563 | 69575 | 69563 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69576 | 69578 | 69590 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69579 | 69591 | 69579 | 13 | 1 | `entries` | const arrow | — | refs:213 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69592 | 69594 | 69606 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69595 | 69607 | 69595 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69608 | 69610 | 69622 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69611 | 69623 | 69611 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69624 | 69668 | 69680 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69669 | 69681 | 69669 | 13 | 1 | `data` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69682 | 69702 | 69701 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69703 | 69705 | 69717 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69706 | 69718 | 69706 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69719 | 69735 | 69734 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69736 | 69759 | 69758 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69760 | 69773 | 69772 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69774 | 69795 | 69794 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69796 | 69831 | 69830 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69832 | 69862 | 69906 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69863 | 69883 | 69863 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69884 | 69908 | 69884 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69909 | 69918 | 69941 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 69919 | 69942 | 69919 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69943 | 69973 | 70013 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 69974 | 69994 | 69974 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69995 | 70015 | 69995 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70016 | 70025 | 70044 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70026 | 70045 | 70026 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70046 | 70109 | 70107 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 70110 | 70135 | 70134 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70136 | 70154 | 70177 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 70155 | 70155 | 70162 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70156 | 70178 | 70158 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70179 | 70226 | 70245 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 70227 | 70228 | 70231 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70229 | 70246 | 70229 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70247 | 70317 | 70315 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70318 | 70346 | 70341 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 70347 | 70358 | 70356 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70359 | 70370 | 70368 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70371 | 70379 | 70376 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70380 | 70453 | 70451 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 70454 | 70512 | 70510 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 70513 | 70615 | 70613 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70616 | 70673 | 70672 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70674 | 70714 | 70713 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70715 | 70726 | 70779 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70727 | 70727 | 70727 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70728 | 70735 | 70733 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70736 | 70738 | 70736 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70739 | 70780 | 70739 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70781 | 70809 | 70808 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 70810 | 70864 | 70863 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 70865 | 70874 | 70897 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70875 | 70898 | 70875 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70899 | 70915 | 70989 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70916 | 70941 | 70916 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70942 | 70967 | 70960 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70968 | 70990 | 70968 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70991 | 71008 | 71019 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71009 | 71020 | 71009 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71021 | 71033 | 71032 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71034 | 71038 | 71072 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71039 | 71046 | 71039 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71047 | 71049 | 71057 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71050 | 71073 | 71052 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71074 | 71091 | 71090 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71092 | 71113 | 71112 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 71114 | 71122 | 71121 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71123 | 71146 | 71145 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71147 | 71156 | 71155 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71157 | 71167 | 71166 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71168 | 71276 | 72031 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71277 | 71307 | 71284 | 31 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 71308 | 71316 | 71314 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71317 | 71324 | 71322 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71325 | 71341 | 71339 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71342 | 71366 | 71364 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71367 | 71377 | 71375 | 11 | 9 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 71378 | 71386 | 71384 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 71387 | 71407 | 71405 | 21 | 19 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 71408 | 71423 | 71421 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 71424 | 71434 | 71432 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 71435 | 71488 | 71486 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71489 | 71511 | 71509 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 71512 | 71772 | 71512 | 261 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 71773 | 71894 | 71778 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71895 | 71928 | 71899 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71929 | 72037 | 71934 | 109 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 72038 | 72058 | 72053 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 72059 | 72134 | 72132 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72135 | 72142 | 72140 | 8 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72143 | 72154 | 72150 | 12 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72155 | 72164 | 72157 | 10 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 72165 | 72196 | 72191 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 72197 | 72436 | 72434 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 72437 | 72451 | 72449 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72452 | 72462 | 72460 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 72463 | 72478 | 72476 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72479 | 72510 | 72504 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72511 | 72550 | 72548 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72551 | 72580 | 72618 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 72581 | 72596 | 72584 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72597 | 72620 | 72600 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72621 | 72635 | 72633 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72636 | 72648 | 72646 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72649 | 72687 | 72827 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 72688 | 72725 | 72691 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72726 | 72829 | 72729 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72830 | 72844 | 72842 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72845 | 72862 | 72854 | 18 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72863 | 72902 | 72888 | 40 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72903 | 72993 | 72913 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72994 | 73030 | 73017 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73031 | 73033 | 73031 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73034 | 73037 | 73034 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73038 | 73067 | 73078 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73068 | 73081 | 73068 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73082 | 73098 | 73125 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73099 | 73127 | 73099 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73128 | 73138 | 73136 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73139 | 73190 | 73188 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 73191 | 73265 | 73263 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 73266 | 73325 | 73323 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73326 | 73332 | 73330 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73333 | 73387 | 73381 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 73388 | 73396 | 73421 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 73397 | 73423 | 73397 | 27 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 73424 | 73440 | 73438 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73441 | 73453 | 73484 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73454 | 73486 | 73454 | 33 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 73487 | 73505 | 73503 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 73506 | 73546 | 73540 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 73547 | 73563 | 73593 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 73564 | 73595 | 73564 | 32 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 73596 | 73636 | 73634 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 73637 | 73662 | 73660 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 73663 | 73720 | 73718 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 73721 | 73777 | 73775 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 73778 | 73792 | 73860 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73793 | 73816 | 73803 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73817 | 73835 | 73817 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73836 | 73843 | 73836 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73844 | 73850 | 73844 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73851 | 73862 | 73857 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73863 | 73876 | 73973 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 73877 | 73940 | 73889 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73941 | 73949 | 73941 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73950 | 73956 | 73950 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73957 | 73981 | 73963 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73982 | 73991 | 74044 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 73992 | 74000 | 73995 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74001 | 74046 | 74004 | 46 | 4 | `setText` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 74047 | 74137 | 74135 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 74138 | 74235 | 74233 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 74236 | 74284 | 74295 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 74285 | 74297 | 74285 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74298 | 74552 | 74550 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 74553 | 74558 | 74556 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 74559 | 74601 | 74612 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 74602 | 74628 | 74602 | 27 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74629 | 74636 | 74631 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 74637 | 74673 | 74664 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 74674 | 74695 | 74691 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 74696 | 74705 | 74701 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 74706 | 74716 | 74711 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 74717 | 74755 | 74751 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74756 | 74831 | 74822 | 76 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 74832 | 74852 | 74862 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74853 | 74866 | 74853 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74867 | 74899 | 74895 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74900 | 74916 | 74902 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 74917 | 74993 | 74989 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 74994 | 75027 | 75023 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75028 | 75077 | 75071 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75078 | 75149 | 75142 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75150 | 75173 | 75169 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 75174 | 75190 | 75186 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 75191 | 75219 | 75210 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 75220 | 75298 | 75293 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 75299 | 75315 | 75311 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75316 | 75555 | 75551 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 75556 | 75630 | 75730 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 75631 | 75631 | 75631 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75632 | 75734 | 75632 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75735 | 75813 | 75859 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75814 | 75895 | 75814 | 82 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75896 | 75975 | 76010 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75976 | 75976 | 75976 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75977 | 76014 | 75977 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76015 | 76098 | 76296 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76099 | 76099 | 76099 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76100 | 76229 | 76100 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76230 | 76230 | 76230 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76231 | 76297 | 76231 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76298 | 76320 | 76319 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 76321 | 76469 | 76351 | 149 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 76470 | 76618 | 76598 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76619 | 76627 | 76752 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76628 | 76754 | 76628 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76755 | 76771 | 76760 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76772 | 76778 | 76776 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76779 | 76789 | 76787 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76790 | 76808 | 76803 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76809 | 76822 | 76821 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76823 | 76828 | 76827 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76829 | 76839 | 76838 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76840 | 77046 | 77045 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77047 | 77098 | 77097 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77099 | 77159 | 77158 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77160 | 77204 | 77203 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77205 | 77218 | 77217 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77219 | 77232 | 77231 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77233 | 77273 | 77272 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77274 | 77302 | 77301 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77303 | 77378 | 77351 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77379 | 77392 | 77391 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77393 | 77399 | 77398 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77400 | 77442 | 77441 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77443 | 77447 | 77446 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 77448 | 77476 | 77475 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77477 | 77509 | 77508 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77510 | 77612 | 77512 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77613 | 77859 | 77624 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 77860 | 77948 | 77860 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77949 | 77976 | 77997 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 77977 | 78005 | 77977 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78006 | 78042 | 78032 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 78043 | 78076 | 78071 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 78077 | 78101 | 78095 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 78102 | 78133 | 78128 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78134 | 78202 | 78198 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 78203 | 78254 | 78250 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 78255 | 78269 | 78265 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78270 | 78287 | 78283 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 78288 | 78305 | 78299 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 78306 | 78391 | 78340 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78392 | 78396 | 78462 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78397 | 78414 | 78397 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78415 | 78432 | 78415 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78433 | 78467 | 78433 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78468 | 78779 | 78482 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78780 | 78828 | 78780 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78829 | 78906 | 78829 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78907 | 78988 | 78984 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78989 | 79053 | 79049 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79054 | 79070 | 79066 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79071 | 79101 | 79096 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 79102 | 79168 | 79164 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 79169 | 79219 | 79215 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79220 | 79234 | 79230 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79235 | 79251 | 79247 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 79252 | 79267 | 79263 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79268 | 79448 | 79302 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79449 | 79460 | 79458 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 79461 | 79974 | 79470 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79975 | 80136 | 80130 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
