# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (101803 lines)

Declarations in this part: **1026**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40024 | 40137 | 40135 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40138 | 40146 | 40145 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40147 | 40157 | 40156 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40158 | 40174 | 40173 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40175 | 40200 | 40199 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40201 | 40206 | 40205 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40207 | 40217 | 40216 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40218 | 40227 | 40226 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40228 | 40234 | 40233 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40235 | 40264 | 40263 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40265 | 40293 | 40292 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40294 | 40308 | 40307 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40309 | 40338 | 40330 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40339 | 40348 | 40344 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40349 | 40356 | 40352 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40357 | 40369 | 40365 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40370 | 40413 | 40409 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40414 | 40423 | 40419 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40424 | 40459 | 40455 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40460 | 40470 | 40466 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40471 | 40511 | 40507 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40512 | 40522 | 40518 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40523 | 40548 | 40547 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40549 | 40591 | 40590 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40592 | 40646 | 40633 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 40647 | 40667 | 40666 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40668 | 40686 | 40682 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40687 | 40712 | 40708 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40713 | 40773 | 40772 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40774 | 40859 | 40896 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40860 | 40860 | 40860 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40861 | 40868 | 40861 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40869 | 40897 | 40869 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40898 | 40915 | 40914 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40916 | 40934 | 40933 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 40935 | 40941 | 40940 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40942 | 40948 | 40947 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40949 | 40956 | 40955 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40957 | 41003 | 41002 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 41004 | 41056 | 41051 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41057 | 41221 | 41220 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41222 | 41225 | 41224 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 41226 | 41244 | 41323 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41245 | 41326 | 41251 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41327 | 41340 | 41458 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 41341 | 41371 | 41347 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41372 | 41376 | 41372 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41377 | 41380 | 41379 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41381 | 41381 | 41381 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41382 | 41460 | 41382 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41461 | 41474 | 41594 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 41475 | 41505 | 41481 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41506 | 41520 | 41506 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41521 | 41521 | 41521 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41522 | 41596 | 41522 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41597 | 41623 | 41673 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 41624 | 41676 | 41624 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41677 | 41843 | 41841 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 41844 | 41850 | 41848 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41851 | 41854 | 41911 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41855 | 41872 | 41855 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41873 | 41875 | 41873 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41876 | 41884 | 41876 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41885 | 41913 | 41885 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41914 | 41962 | 41960 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41963 | 41967 | 41965 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41968 | 41972 | 41970 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 41973 | 42012 | 42010 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 42013 | 42033 | 42032 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 42034 | 42045 | 42044 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42046 | 42057 | 42097 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42058 | 42073 | 42072 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 42074 | 42125 | 42074 | 52 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 42126 | 42130 | 42416 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42131 | 42138 | 42136 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42139 | 42346 | 42144 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42347 | 42417 | 42352 | 71 | 6 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 42418 | 42444 | 42442 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42445 | 42462 | 43690 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 42463 | 42477 | 42475 | 15 | 13 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 42478 | 42494 | 42492 | 17 | 15 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 42495 | 42505 | 42503 | 11 | 9 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 42506 | 42537 | 42535 | 32 | 30 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 42538 | 42557 | 42555 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42558 | 42640 | 42568 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 42641 | 42720 | 42641 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42721 | 42865 | 42721 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42866 | 42910 | 42870 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42911 | 42992 | 42920 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42993 | 43193 | 42993 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43194 | 43736 | 43194 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43737 | 43758 | 43754 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 43759 | 43767 | 43763 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43768 | 43937 | 43861 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43938 | 43953 | 43947 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43954 | 43970 | 43963 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43971 | 43980 | 43973 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43981 | 44007 | 44001 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44008 | 44020 | 44014 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44021 | 44038 | 44120 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44039 | 44055 | 44049 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44056 | 44126 | 44056 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44127 | 44137 | 44131 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44138 | 44169 | 44163 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44170 | 44188 | 44183 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44189 | 44209 | 44202 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44210 | 44256 | 44250 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 44257 | 44330 | 44325 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44331 | 44407 | 44400 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44408 | 44442 | 44437 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 44443 | 44770 | 44766 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44771 | 44870 | 44866 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 44871 | 44871 | 44935 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44872 | 44894 | 44873 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44895 | 44939 | 44895 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44940 | 45027 | 45023 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45028 | 45028 | 45096 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45029 | 45100 | 45030 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45101 | 45118 | 45113 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45119 | 45132 | 45128 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45133 | 45242 | 45238 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45243 | 45263 | 45295 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45264 | 45299 | 45264 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45300 | 45323 | 45319 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45324 | 45339 | 45335 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 45340 | 45346 | 45372 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45347 | 45364 | 45363 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45365 | 45376 | 45365 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45377 | 45409 | 45440 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45410 | 45443 | 45420 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45444 | 45466 | 45464 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45467 | 45485 | 45483 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45486 | 45496 | 45494 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45497 | 45514 | 45512 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45515 | 45522 | 45520 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45523 | 45570 | 45560 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45571 | 45589 | 45756 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45590 | 45592 | 45595 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45593 | 45650 | 45593 | 58 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45651 | 45656 | 45656 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 45657 | 45715 | 45663 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45716 | 45738 | 45720 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 45739 | 45758 | 45739 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45759 | 45816 | 45967 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 45817 | 45969 | 45817 | 153 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45970 | 46010 | 46008 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46011 | 46027 | 46025 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46028 | 46236 | 46234 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46237 | 46259 | 46257 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 46260 | 46269 | 46327 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46270 | 46272 | 46270 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46273 | 46329 | 46273 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46330 | 46347 | 46345 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46348 | 46400 | 46481 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46401 | 46428 | 46401 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46429 | 46442 | 46429 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46443 | 46456 | 46443 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 46457 | 46470 | 46457 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46471 | 46483 | 46471 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46484 | 46488 | 46528 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46489 | 46499 | 46489 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46500 | 46530 | 46506 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46531 | 46568 | 46566 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46569 | 46612 | 46615 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46613 | 46616 | 46613 | 4 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46617 | 46640 | 47017 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 46641 | 46775 | 46658 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46776 | 46877 | 46794 | 102 | 19 | `drawKPI` | fn | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 46878 | 47018 | 46887 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47019 | 47029 | 47027 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 47030 | 47036 | 47035 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 47037 | 47061 | 47040 | 25 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 47062 | 47078 | 47062 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47079 | 47113 | 47112 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 47114 | 47142 | 47130 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47143 | 47167 | 47166 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47168 | 47214 | 47200 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47215 | 47234 | 47233 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 47235 | 47262 | 47247 | 28 | 13 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47263 | 47339 | 47298 | 77 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47340 | 47377 | 47369 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47378 | 47391 | 47386 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47392 | 47434 | 47430 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47435 | 47459 | 47455 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 47460 | 47493 | 47464 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47494 | 47512 | 47504 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47513 | 47539 | 47532 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 47540 | 47563 | 47554 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 47564 | 47588 | 47581 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47589 | 47598 | 47614 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47599 | 47609 | 47603 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47610 | 47610 | 47610 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47611 | 47622 | 47611 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47623 | 47638 | 47632 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47639 | 47639 | 47671 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 47640 | 47651 | 47645 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 47652 | 47663 | 47656 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47664 | 47678 | 47667 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47679 | 47850 | 47679 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 47851 | 47865 | 47859 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 47866 | 47878 | 47873 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 47879 | 47897 | 47971 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47898 | 47977 | 47898 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47978 | 47979 | 47995 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47980 | 47999 | 47984 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 48000 | 48017 | 48013 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48018 | 48027 | 48094 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48028 | 48071 | 48028 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48072 | 48098 | 48072 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48099 | 48108 | 48124 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 48109 | 48132 | 48112 | 24 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 48133 | 48133 | 48144 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 48134 | 48148 | 48134 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48149 | 48171 | 48167 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 48172 | 48188 | 48184 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 48189 | 48201 | 48221 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 48202 | 48233 | 48208 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 48234 | 48262 | 48257 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 48263 | 48299 | 48297 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 48300 | 48310 | 48309 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 48311 | 48339 | 48331 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 48340 | 48440 | 48581 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 48441 | 48461 | 48441 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48462 | 48462 | 48462 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48463 | 48463 | 48463 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48464 | 48465 | 48464 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48466 | 48507 | 48466 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48508 | 48589 | 48508 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48590 | 48625 | 48619 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 48626 | 48627 | 48649 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 48628 | 48650 | 48635 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48651 | 48798 | 48751 | 148 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 48799 | 48832 | 48893 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48833 | 48911 | 48833 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48912 | 48964 | 49391 | 53 | 480 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48965 | 48971 | 48965 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 48972 | 48995 | 48972 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 48996 | 49052 | 48999 | 57 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 49053 | 49053 | 49053 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49054 | 49054 | 49054 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49055 | 49087 | 49055 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49088 | 49115 | 49092 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49116 | 49117 | 49126 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 49118 | 49181 | 49118 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49182 | 49188 | 49188 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49189 | 49194 | 49194 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49195 | 49230 | 49209 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49231 | 49292 | 49231 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49293 | 49395 | 49293 | 103 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49396 | 49490 | 49611 | 95 | 216 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 49491 | 49516 | 49491 | 26 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49517 | 49517 | 49517 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49518 | 49518 | 49518 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49519 | 49572 | 49519 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49573 | 49573 | 49592 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 49574 | 49614 | 49574 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49615 | 49652 | 49651 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49653 | 49665 | 49740 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 49666 | 49748 | 49669 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 49749 | 49755 | 49754 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49756 | 49835 | 49834 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49836 | 49842 | 49841 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49843 | 49851 | 49881 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49852 | 49882 | 49852 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 49883 | 49932 | 49931 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49933 | 49950 | 49949 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49951 | 50007 | 49978 | 57 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50008 | 50039 | 50282 | 32 | 275 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50040 | 50143 | 50040 | 104 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50144 | 50283 | 50144 | 140 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 50284 | 50292 | 50329 | 9 | 46 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50293 | 50293 | 50293 | 1 | 1 | `fmt` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50294 | 50307 | 50299 | 14 | 6 | `parseLocal` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50308 | 50323 | 50308 | 16 | 1 | `qLastDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50324 | 50330 | 50324 | 7 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50331 | 50347 | 50379 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50348 | 50368 | 50348 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50369 | 50380 | 50373 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 50381 | 50425 | 50424 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50426 | 50444 | 50443 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50445 | 50475 | 50489 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50476 | 50490 | 50479 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 50491 | 50527 | 50526 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50528 | 50545 | 50553 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50546 | 50554 | 50546 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50555 | 50570 | 50590 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50571 | 50577 | 50571 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50578 | 50591 | 50578 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50592 | 50629 | 50685 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50630 | 50691 | 50630 | 62 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50692 | 50729 | 50728 | 38 | 37 | `_activeTierLabel` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50730 | 50782 | 50939 | 53 | 210 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50783 | 50783 | 50783 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50784 | 50820 | 50784 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50821 | 50852 | 50826 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50853 | 50940 | 50853 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50941 | 50975 | 51022 | 35 | 82 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50976 | 51023 | 50980 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51024 | 51033 | 51032 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51034 | 51048 | 51043 | 15 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51049 | 51095 | 51063 | 47 | 15 | `_cc367_filename` | window fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51096 | 51145 | 51140 | 50 | 45 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51146 | 51196 | 51195 | 51 | 50 | `exportReportPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51197 | 51258 | 51243 | 62 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51259 | 51272 | 51271 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51273 | 51290 | 51289 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51291 | 51315 | 51314 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 51316 | 51316 | 51332 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51317 | 51333 | 51317 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51334 | 51347 | 51346 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51348 | 51361 | 51360 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51362 | 51412 | 51410 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 51413 | 51453 | 51451 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51454 | 51520 | 51557 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51521 | 51523 | 51521 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 51524 | 51530 | 51528 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51531 | 51559 | 51537 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51560 | 51581 | 51591 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51582 | 51593 | 51584 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51594 | 51609 | 51607 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 51610 | 51616 | 51614 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51617 | 51629 | 51627 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51630 | 51632 | 51642 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51633 | 51643 | 51636 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51644 | 51645 | 51655 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51646 | 51651 | 51646 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51652 | 51656 | 51652 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51657 | 51708 | 51707 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51709 | 51737 | 52420 | 29 | 712 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51738 | 51753 | 51751 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51754 | 51761 | 51759 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51762 | 51768 | 51766 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 51769 | 51778 | 51776 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51779 | 51816 | 51814 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51817 | 51817 | 51840 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51818 | 51842 | 51818 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51843 | 51843 | 51888 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51844 | 51896 | 51844 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51897 | 51916 | 51902 | 20 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 51917 | 51919 | 51917 | 3 | 1 | `cc370EmptyLine` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51920 | 51921 | 51936 | 2 | 17 | `cc370BarList` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51922 | 51937 | 51922 | 16 | 1 | `max` | const arrow | — | refs:228 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51938 | 51939 | 51961 | 2 | 24 | `generateContributingFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51940 | 51962 | 51941 | 23 | 2 | `factorObjs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51963 | 51976 | 51975 | 14 | 13 | `generateRecommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51977 | 52421 | 52005 | 445 | 29 | `generateFundingSection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52422 | 52433 | 52430 | 12 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52434 | 52483 | 52482 | 50 | 49 | `_stateFundingPrograms` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52484 | 52523 | 53071 | 40 | 588 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52524 | 52540 | 52539 | 17 | 16 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 52541 | 52541 | 52541 | 1 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 52542 | 52544 | 52542 | 3 | 1 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 52545 | 52579 | 52571 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52580 | 52582 | 52580 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52583 | 52591 | 52589 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52592 | 52778 | 52602 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 52779 | 52787 | 52779 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52788 | 52839 | 52788 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52840 | 52887 | 52840 | 48 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52888 | 52954 | 52888 | 67 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52955 | 53036 | 52955 | 82 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53037 | 53072 | 53037 | 36 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53073 | 53081 | 53080 | 9 | 8 | `hexToRgb` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 53082 | 53099 | 53405 | 18 | 324 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53100 | 53407 | 53100 | 308 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53408 | 53544 | 53517 | 137 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53545 | 53594 | 53589 | 50 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53595 | 53675 | 53671 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53676 | 53776 | 53772 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53777 | 53794 | 53869 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53795 | 53875 | 53795 | 81 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53876 | 54023 | 53996 | 148 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54024 | 54033 | 54032 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54034 | 54057 | 54056 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54058 | 54075 | 54064 | 18 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 54076 | 54107 | 54106 | 32 | 31 | `loadSavedKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54108 | 54143 | 54142 | 36 | 35 | `handleAIFileSelect` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54144 | 54154 | 54153 | 11 | 10 | `renderAttachments` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54155 | 54159 | 54158 | 5 | 4 | `removeAttachment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54160 | 54164 | 54163 | 5 | 4 | `askSuggestion` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 54165 | 54224 | 54223 | 60 | 59 | `clearAIChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54225 | 54229 | 54228 | 5 | 4 | `clearApiKey` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54230 | 54268 | 54267 | 39 | 38 | `addMessage` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54269 | 54281 | 54280 | 13 | 12 | `addTypingIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54282 | 54286 | 54285 | 5 | 4 | `removeTypingIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54287 | 54355 | 54347 | 69 | 61 | `buildCrashDataContext` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 54356 | 54364 | 54364 | 9 | 9 | `initMUTCDLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 54365 | 54380 | 54380 | 16 | 16 | `loadMUTCDLocation` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 54381 | 54387 | 54385 | 7 | 5 | `clearMUTCDLocation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54388 | 54407 | 54405 | 20 | 18 | `loadMUTCDIndex` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54408 | 54542 | 54529 | 135 | 122 | `buildMUTCDContext` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54543 | 54599 | 54618 | 57 | 76 | `queryPineconeRAG` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54600 | 54620 | 54609 | 21 | 10 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54621 | 54724 | 54645 | 104 | 25 | `buildPineconeRAGContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54725 | 54764 | 54887 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 54765 | 54815 | 54769 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 54816 | 55154 | 54816 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55155 | 55217 | 55207 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 55218 | 55229 | 55365 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 55230 | 55370 | 55234 | 141 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 55371 | 55424 | 55419 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55425 | 55508 | 55503 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55509 | 55573 | 55569 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55574 | 55713 | 55708 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 55714 | 55757 | 55803 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 55758 | 55808 | 55780 | 51 | 23 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 55809 | 55814 | 55812 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 55815 | 55863 | 55861 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 55864 | 55887 | 55866 | 24 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 55888 | 55933 | 55938 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 55934 | 55940 | 55934 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55941 | 55953 | 55951 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 55954 | 55966 | 55964 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55967 | 55971 | 55969 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55972 | 55976 | 55974 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55977 | 55987 | 56087 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 55988 | 56006 | 55988 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 56007 | 56089 | 56007 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56090 | 56117 | 56116 | 28 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56118 | 56218 | 56208 | 101 | 91 | `buildSystemPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56219 | 56373 | 56369 | 155 | 151 | `getAIAnalysisContext` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 56374 | 56380 | 56376 | 7 | 3 | `buildLocationCrashContext` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 56381 | 56405 | 56404 | 25 | 24 | `updateAIContextIndicator` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 56406 | 56448 | 56447 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 56449 | 56465 | 56464 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56466 | 56484 | 56483 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56485 | 56493 | 56492 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56494 | 56620 | 56619 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 56621 | 56664 | 56663 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56665 | 56722 | 56721 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56723 | 56758 | 56757 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56759 | 56824 | 56792 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56825 | 56864 | 56862 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56865 | 56889 | 56887 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56890 | 57055 | 56903 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 57056 | 57072 | 57056 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57073 | 57088 | 57073 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57089 | 57106 | 57091 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57107 | 57125 | 57107 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57126 | 57126 | 57126 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57127 | 57144 | 57129 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57145 | 57162 | 57145 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57163 | 57183 | 57165 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57184 | 57184 | 57184 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57185 | 57202 | 57185 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57203 | 57224 | 57222 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57225 | 57242 | 57240 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57243 | 57265 | 57306 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57266 | 57266 | 57266 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57267 | 57269 | 57267 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57270 | 57270 | 57270 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57271 | 57308 | 57271 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57309 | 57330 | 57328 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57331 | 57367 | 57365 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57368 | 57413 | 57557 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 57414 | 57426 | 57414 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57427 | 57438 | 57427 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57439 | 57453 | 57442 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57454 | 57559 | 57457 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57560 | 57576 | 57586 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 57577 | 57577 | 57577 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57578 | 57588 | 57578 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57589 | 57630 | 57628 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57631 | 57666 | 57664 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57667 | 57671 | 57684 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 57672 | 57686 | 57679 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 57687 | 57692 | 57690 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57693 | 57708 | 57707 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 57709 | 57776 | 57774 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 57777 | 57787 | 57785 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 57788 | 57807 | 57842 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 57808 | 57824 | 57819 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57825 | 57844 | 57825 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57845 | 57880 | 57878 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57881 | 57895 | 57934 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57896 | 57906 | 57896 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57907 | 57936 | 57915 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57937 | 57951 | 57993 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57952 | 57965 | 57955 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57966 | 57995 | 57974 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57996 | 58014 | 58012 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58015 | 58033 | 58031 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58034 | 58122 | 58120 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58123 | 58145 | 58143 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58146 | 58211 | 58198 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 58212 | 58247 | 58240 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58248 | 58271 | 58266 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58272 | 58307 | 58303 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58308 | 58338 | 58330 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58339 | 58362 | 58370 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 58363 | 58380 | 58367 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58381 | 58414 | 58412 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58415 | 58471 | 58466 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58472 | 58526 | 58521 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58527 | 58555 | 58553 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 58556 | 58575 | 58573 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 58576 | 58581 | 58579 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58582 | 58591 | 58589 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58592 | 58614 | 58612 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58615 | 58638 | 58637 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58639 | 58660 | 58658 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58661 | 58788 | 58787 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58789 | 58810 | 58808 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 58811 | 58871 | 58864 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58872 | 58918 | 58917 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58919 | 58942 | 58941 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58943 | 59006 | 59004 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 59007 | 59099 | 59097 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59100 | 59209 | 59227 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59210 | 59229 | 59210 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59230 | 59257 | 59255 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59258 | 59286 | 59285 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59287 | 59296 | 59294 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59297 | 59340 | 59338 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59341 | 59356 | 59355 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59357 | 59388 | 59387 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59389 | 59448 | 59444 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59449 | 59503 | 59499 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59504 | 59529 | 59528 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59530 | 59533 | 59563 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 59534 | 59564 | 59534 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 59565 | 59618 | 59616 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59619 | 59627 | 59636 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59628 | 59628 | 59628 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59629 | 59638 | 59629 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59639 | 59650 | 59648 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59651 | 59659 | 59657 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 59660 | 59671 | 59669 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59672 | 59677 | 59675 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 59678 | 59688 | 59686 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59689 | 59694 | 59692 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59695 | 59702 | 59700 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 59703 | 59741 | 59739 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59742 | 59768 | 59763 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59769 | 59897 | 59892 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59898 | 59923 | 60143 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59924 | 60151 | 59929 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 60152 | 60159 | 60158 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60160 | 60170 | 60169 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 60171 | 60204 | 60203 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 60205 | 60227 | 60226 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 60228 | 60232 | 60231 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60233 | 60238 | 60236 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 60239 | 60261 | 60259 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60262 | 60278 | 60267 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60279 | 60287 | 60302 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60288 | 60304 | 60288 | 17 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 60305 | 60320 | 60318 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60321 | 60348 | 60346 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60349 | 60389 | 60387 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60390 | 60414 | 60412 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60415 | 60440 | 60437 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60441 | 60448 | 60446 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 60449 | 60498 | 60496 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 60499 | 60512 | 60504 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60513 | 60534 | 60551 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 60535 | 60581 | 60535 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60582 | 60584 | 60621 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60585 | 60622 | 60585 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60623 | 60740 | 60623 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 60741 | 60787 | 60741 | 47 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 60788 | 60801 | 60801 | 14 | 14 | `make` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60802 | 60802 | 60802 | 1 | 1 | `segments` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60803 | 60834 | 60803 | 32 | 1 | `intersections` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60835 | 60888 | 60850 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 60889 | 60916 | 60910 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 60917 | 60926 | 60920 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 60927 | 60932 | 60930 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60933 | 60998 | 60996 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 60999 | 61012 | 61010 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61013 | 61020 | 61018 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61021 | 61076 | 61074 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61077 | 61096 | 61094 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61097 | 61103 | 61101 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61104 | 61144 | 61139 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 61145 | 61155 | 61152 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 61156 | 61164 | 61163 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61165 | 61210 | 61320 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61211 | 61322 | 61227 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61323 | 61367 | 61432 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61368 | 61389 | 61368 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61390 | 61400 | 61390 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61401 | 61435 | 61401 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61436 | 61439 | 61438 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61440 | 61530 | 61524 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 61531 | 61544 | 61542 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61545 | 61552 | 61550 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61553 | 61750 | 61791 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61751 | 61797 | 61751 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61798 | 61866 | 61864 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61867 | 61898 | 61896 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61899 | 61909 | 61907 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61910 | 61934 | 61928 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 61935 | 61959 | 61957 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61960 | 61988 | 61986 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61989 | 61997 | 61995 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61998 | 62014 | 62012 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62015 | 62033 | 62031 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62034 | 62039 | 62037 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62040 | 62050 | 62048 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62051 | 62069 | 62067 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62070 | 62080 | 62078 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62081 | 62090 | 62088 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62091 | 62133 | 62131 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62134 | 62185 | 62245 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 62186 | 62247 | 62188 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 62248 | 62283 | 62281 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 62284 | 62289 | 62335 | 6 | 52 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62290 | 62337 | 62290 | 48 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62338 | 62370 | 62368 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62371 | 62409 | 62407 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62410 | 62446 | 62444 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62447 | 62686 | 62684 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62687 | 62746 | 62900 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62747 | 62756 | 62747 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62757 | 62767 | 62757 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62768 | 62783 | 62768 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62784 | 62800 | 62784 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62801 | 62812 | 62801 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62813 | 62902 | 62813 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62903 | 62928 | 62926 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62929 | 62936 | 63099 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62937 | 62943 | 62941 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62944 | 62944 | 62964 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62945 | 63128 | 62945 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63129 | 63145 | 63138 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63146 | 63183 | 63176 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63184 | 63224 | 63218 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 63225 | 63242 | 63236 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 63243 | 63275 | 63266 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63276 | 63365 | 63356 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63366 | 63439 | 63429 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63440 | 63467 | 63461 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63468 | 63476 | 63715 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63477 | 63483 | 63481 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63484 | 63494 | 63486 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63495 | 63495 | 63495 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63496 | 63496 | 63496 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63497 | 63500 | 63497 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63501 | 63572 | 63501 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63573 | 63717 | 63573 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 63718 | 63755 | 65201 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 63756 | 63769 | 63767 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63770 | 63782 | 63780 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63783 | 63790 | 63788 | 8 | 6 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 63791 | 63798 | 63796 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 63799 | 63809 | 63807 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 63810 | 64281 | 63820 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64282 | 64371 | 64286 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64372 | 64613 | 64378 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 64614 | 64689 | 64614 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64690 | 64690 | 64690 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64691 | 64739 | 64691 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64740 | 64979 | 64753 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64980 | 65203 | 64980 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65204 | 65210 | 65208 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65211 | 65215 | 65214 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 65216 | 65390 | 66190 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 65391 | 65398 | 65391 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65399 | 65847 | 65399 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65848 | 66101 | 65848 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66102 | 66113 | 66105 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66114 | 66192 | 66116 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66193 | 66194 | 66340 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66195 | 66296 | 66195 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66297 | 66308 | 66300 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66309 | 66314 | 66313 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 66315 | 66341 | 66315 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66342 | 66392 | 66655 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66393 | 66393 | 66393 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66394 | 66394 | 66394 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66395 | 66395 | 66395 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66396 | 66398 | 66396 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66399 | 66480 | 66399 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66481 | 66481 | 66481 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66482 | 66657 | 66482 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66658 | 66658 | 66714 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66659 | 66716 | 66659 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66717 | 66717 | 66729 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66718 | 66731 | 66718 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66732 | 66750 | 66748 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66751 | 66772 | 66770 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66773 | 66782 | 66780 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 66783 | 66798 | 66796 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66799 | 66807 | 66961 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66808 | 66963 | 66810 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66964 | 66984 | 66982 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66985 | 67001 | 67028 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67002 | 67005 | 67002 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 67006 | 67030 | 67006 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67031 | 67039 | 67073 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67040 | 67074 | 67040 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 67075 | 67102 | 67101 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67103 | 67140 | 67139 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67141 | 67145 | 67143 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67146 | 67163 | 67154 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67164 | 67269 | 67174 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67270 | 67801 | 67275 | 532 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67802 | 67850 | 67848 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67851 | 67900 | 67856 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67901 | 67918 | 67916 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67919 | 68019 | 68017 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68020 | 68030 | 68026 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68031 | 68081 | 68109 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68082 | 68112 | 68085 | 31 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68113 | 68122 | 68135 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68123 | 68138 | 68123 | 16 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68139 | 68259 | 68255 | 121 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68260 | 68404 | 68403 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68405 | 68422 | 68412 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 68423 | 68458 | 68452 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 68459 | 68536 | 68525 | 78 | 67 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68537 | 68590 | 68588 | 54 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68591 | 68595 | 68593 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 68596 | 68624 | 68623 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 68625 | 68649 | 68678 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68650 | 68653 | 68653 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68654 | 68679 | 68654 | 26 | 1 | `values` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68680 | 68709 | 68734 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68710 | 68710 | 68710 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68711 | 68735 | 68711 | 25 | 1 | `values` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68736 | 68765 | 68791 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68766 | 68766 | 68766 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68767 | 68792 | 68767 | 26 | 1 | `values` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68793 | 68822 | 68848 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68823 | 68823 | 68823 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68824 | 68849 | 68824 | 26 | 1 | `values` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68850 | 68861 | 68958 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68862 | 68909 | 68890 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68910 | 68919 | 68910 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68920 | 68920 | 68920 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68921 | 68960 | 68921 | 40 | 1 | `values` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68961 | 68971 | 68970 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68972 | 69041 | 69031 | 70 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69042 | 69066 | 69064 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69067 | 69081 | 69079 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69082 | 69104 | 69102 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 69105 | 69126 | 69124 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69127 | 69137 | 69135 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69138 | 69142 | 69140 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69143 | 69147 | 69145 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69148 | 69155 | 69153 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 69156 | 69173 | 69167 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69174 | 69185 | 69179 | 12 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69186 | 69230 | 69226 | 45 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69231 | 69446 | 69444 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69447 | 69469 | 69467 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 69470 | 69481 | 69540 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69482 | 69484 | 69482 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69485 | 69546 | 69485 | 62 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69547 | 69623 | 69704 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69624 | 69651 | 69624 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69652 | 69665 | 69652 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69666 | 69679 | 69666 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 69680 | 69693 | 69680 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69694 | 69706 | 69694 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69707 | 69754 | 69742 | 48 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69755 | 69794 | 69781 | 40 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 69795 | 69829 | 69821 | 35 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 69830 | 69844 | 69838 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69845 | 69886 | 70501 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69887 | 69898 | 69897 | 12 | 11 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 69899 | 69910 | 69909 | 12 | 11 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 69911 | 69923 | 69922 | 13 | 12 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 69924 | 69931 | 69930 | 8 | 7 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 69932 | 70127 | 69938 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 70128 | 70259 | 70137 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70260 | 70333 | 70263 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70334 | 70342 | 70334 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70343 | 70402 | 70347 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70403 | 70437 | 70406 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70438 | 70438 | 70438 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70439 | 70508 | 70439 | 70 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70509 | 70538 | 70536 | 30 | 28 | `runSafetyDataCheck` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70539 | 70547 | 70545 | 9 | 7 | `sfAddCheck` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 70548 | 70590 | 70588 | 43 | 41 | `sfCheckSeverityTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70591 | 70624 | 70622 | 34 | 32 | `sfCheckEPDOCalculations` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 70625 | 70669 | 70667 | 45 | 43 | `sfCheckCategorySums` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70670 | 70702 | 70700 | 33 | 31 | `sfCheckLocationTableConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70703 | 70833 | 70831 | 131 | 129 | `sfCheckCrossAnalysisConsistency` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 70834 | 70906 | 70904 | 73 | 71 | `sfCheckFilterConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70907 | 71053 | 71061 | 147 | 155 | `sfCheckDetailPanelAccuracy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71054 | 71063 | 71054 | 10 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71064 | 71104 | 71102 | 41 | 39 | `sfCheckPercentageDenominators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71105 | 71117 | 71182 | 13 | 78 | `displaySafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71118 | 71139 | 71118 | 22 | 1 | `statusIcon` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 71140 | 71140 | 71140 | 1 | 1 | `catPassed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71141 | 71141 | 71141 | 1 | 1 | `catFailed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71142 | 71143 | 71142 | 2 | 1 | `catWarn` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71144 | 71184 | 71144 | 41 | 1 | `catName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71185 | 71207 | 71201 | 23 | 17 | `exportSafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71208 | 71261 | 71260 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 71262 | 71278 | 71277 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 71279 | 71285 | 71295 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71286 | 71307 | 71286 | 22 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71308 | 71326 | 71323 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 71327 | 71357 | 71354 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 71358 | 71704 | 71695 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 71705 | 71716 | 71767 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 71717 | 71726 | 71722 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 71727 | 71737 | 71737 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 71738 | 71742 | 71742 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71743 | 71773 | 71756 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71774 | 71853 | 71844 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 71854 | 71857 | 71934 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 71858 | 71861 | 71858 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 71862 | 71935 | 71881 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 71936 | 71971 | 71970 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 71972 | 71979 | 71978 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71980 | 72278 | 72277 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 72279 | 72320 | 72314 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 72321 | 72367 | 72360 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72368 | 72370 | 72382 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72371 | 72383 | 72371 | 13 | 1 | `entries` | const arrow | — | refs:245 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72384 | 72386 | 72398 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72387 | 72399 | 72387 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72400 | 72402 | 72414 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72403 | 72415 | 72403 | 13 | 1 | `entries` | const arrow | — | refs:245 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72416 | 72418 | 72430 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72419 | 72431 | 72419 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72432 | 72434 | 72446 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72435 | 72447 | 72435 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 72448 | 72492 | 72504 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72493 | 72505 | 72493 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 72506 | 72526 | 72525 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72527 | 72529 | 72541 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72530 | 72542 | 72530 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72543 | 72559 | 72558 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72560 | 72583 | 72582 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72584 | 72597 | 72596 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72598 | 72619 | 72618 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72620 | 72655 | 72654 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72656 | 72686 | 72730 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 72687 | 72707 | 72687 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72708 | 72732 | 72708 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72733 | 72742 | 72765 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72743 | 72766 | 72743 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72767 | 72797 | 72837 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 72798 | 72818 | 72798 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72819 | 72839 | 72819 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72840 | 72849 | 72868 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72850 | 72869 | 72850 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72870 | 72933 | 72931 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 72934 | 72959 | 72958 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72960 | 72978 | 73001 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 72979 | 72979 | 72986 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72980 | 73002 | 72982 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 73003 | 73050 | 73069 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 73051 | 73052 | 73055 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73053 | 73070 | 73053 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73071 | 73141 | 73139 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73142 | 73170 | 73165 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 73171 | 73182 | 73180 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73183 | 73194 | 73192 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73195 | 73203 | 73200 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73204 | 73277 | 73275 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 73278 | 73336 | 73334 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 73337 | 73439 | 73437 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73440 | 73497 | 73496 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73498 | 73538 | 73537 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73539 | 73550 | 73603 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73551 | 73551 | 73551 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73552 | 73559 | 73557 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73560 | 73562 | 73560 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73563 | 73604 | 73563 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73605 | 73633 | 73632 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 73634 | 73688 | 73687 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 73689 | 73698 | 73721 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73699 | 73722 | 73699 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 73723 | 73739 | 73813 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73740 | 73765 | 73740 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73766 | 73791 | 73784 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73792 | 73814 | 73792 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73815 | 73832 | 73843 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73833 | 73844 | 73833 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73845 | 73857 | 73856 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73858 | 73862 | 73896 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73863 | 73870 | 73863 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73871 | 73873 | 73881 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73874 | 73897 | 73876 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73898 | 73915 | 73914 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73916 | 73937 | 73936 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 73938 | 73946 | 73945 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 73947 | 73970 | 73969 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 73971 | 73980 | 73979 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73981 | 73991 | 73990 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 73992 | 74100 | 74855 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74101 | 74131 | 74108 | 31 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 74132 | 74140 | 74138 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 74141 | 74148 | 74146 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74149 | 74165 | 74163 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74166 | 74190 | 74188 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74191 | 74201 | 74199 | 11 | 9 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 74202 | 74210 | 74208 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 74211 | 74231 | 74229 | 21 | 19 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 74232 | 74247 | 74245 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 74248 | 74258 | 74256 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74259 | 74312 | 74310 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74313 | 74335 | 74333 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74336 | 74596 | 74336 | 261 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 74597 | 74718 | 74602 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74719 | 74752 | 74723 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74753 | 74861 | 74758 | 109 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 74862 | 74882 | 74877 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74883 | 74958 | 74956 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74959 | 74966 | 74964 | 8 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74967 | 74978 | 74974 | 12 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 74979 | 74988 | 74981 | 10 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74989 | 75020 | 75015 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 75021 | 75260 | 75258 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 75261 | 75275 | 75273 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75276 | 75286 | 75284 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75287 | 75302 | 75300 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75303 | 75334 | 75328 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75335 | 75374 | 75372 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75375 | 75404 | 75442 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75405 | 75420 | 75408 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75421 | 75444 | 75424 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75445 | 75459 | 75457 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75460 | 75472 | 75470 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75473 | 75511 | 75651 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75512 | 75549 | 75515 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75550 | 75653 | 75553 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75654 | 75668 | 75666 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75669 | 75686 | 75678 | 18 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75687 | 75726 | 75712 | 40 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75727 | 75817 | 75737 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75818 | 75854 | 75841 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75855 | 75857 | 75855 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 75858 | 75861 | 75858 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 75862 | 75891 | 75902 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 75892 | 75905 | 75892 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75906 | 75922 | 75949 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 75923 | 75951 | 75923 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75952 | 75962 | 75960 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 75963 | 76014 | 76012 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 76015 | 76089 | 76087 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 76090 | 76149 | 76147 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76150 | 76156 | 76154 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76157 | 76211 | 76205 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 76212 | 76220 | 76245 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 76221 | 76247 | 76221 | 27 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 76248 | 76264 | 76262 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76265 | 76277 | 76308 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76278 | 76310 | 76278 | 33 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 76311 | 76329 | 76327 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 76330 | 76370 | 76364 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 76371 | 76387 | 76417 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 76388 | 76419 | 76388 | 32 | 1 | `formatDate` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 76420 | 76460 | 76458 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 76461 | 76486 | 76484 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 76487 | 76544 | 76542 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 76545 | 76601 | 76599 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 76602 | 76616 | 76684 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 76617 | 76640 | 76627 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76641 | 76659 | 76641 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76660 | 76667 | 76660 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76668 | 76674 | 76668 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 76675 | 76686 | 76681 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 76687 | 76700 | 76797 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 76701 | 76764 | 76713 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76765 | 76773 | 76765 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76774 | 76780 | 76774 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 76781 | 76805 | 76787 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 76806 | 76815 | 76868 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 76816 | 76824 | 76819 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76825 | 76870 | 76828 | 46 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 76871 | 76961 | 76959 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 76962 | 77059 | 77057 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 77060 | 77108 | 77119 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77109 | 77121 | 77109 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77122 | 77376 | 77374 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 77377 | 77382 | 77380 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77383 | 77425 | 77436 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77426 | 77452 | 77426 | 27 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77453 | 77460 | 77455 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77461 | 77497 | 77488 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 77498 | 77519 | 77515 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 77520 | 77529 | 77525 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 77530 | 77540 | 77535 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 77541 | 77579 | 77575 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77580 | 77652 | 77646 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 77653 | 77782 | 77778 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 77783 | 77825 | 77821 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77826 | 77903 | 77879 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 77904 | 77916 | 77912 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 77917 | 77956 | 77951 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 77957 | 77992 | 77988 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 77993 | 78016 | 78012 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78017 | 78029 | 78024 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78030 | 78067 | 78062 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 78068 | 78123 | 78118 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78124 | 78177 | 78173 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 78178 | 78288 | 78220 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78289 | 78307 | 78303 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 78308 | 78364 | 78360 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 78365 | 78374 | 78368 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78375 | 78482 | 78531 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 78483 | 78535 | 78483 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 78536 | 78565 | 78560 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78566 | 78653 | 78649 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 78654 | 78671 | 78666 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78672 | 78728 | 78727 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78729 | 78861 | 78841 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 78862 | 78910 | 78906 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 78911 | 78965 | 78961 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 78966 | 79020 | 79016 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79021 | 79156 | 79152 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79157 | 79188 | 79184 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79189 | 79197 | 79192 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79198 | 79332 | 79328 | 135 | 131 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 79333 | 79336 | 79367 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79337 | 79341 | 79340 | 5 | 4 | `setVal` | const arrow | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 79342 | 79371 | 79345 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 79372 | 79386 | 79382 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79387 | 79405 | 79401 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 79406 | 79412 | 79408 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79413 | 79449 | 79445 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79450 | 79519 | 79515 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79520 | 79544 | 79568 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79545 | 79572 | 79551 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 79573 | 79678 | 79673 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79679 | 79826 | 79822 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79827 | 79944 | 79940 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79945 | 79961 | 79956 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 79962 | 80351 | 80343 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
