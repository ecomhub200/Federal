# index.html function inventory — PART 4 (L120001–end)

Snapshot: 2026-05-20 · source `app/index.html` (131696 lines)

Declarations in this part: **284**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 120015 | 120122 | 120118 | 108 | 104 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 120123 | 120138 | 120134 | 16 | 12 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 120139 | 120150 | 120146 | 12 | 8 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120151 | 120183 | 120178 | 33 | 28 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120184 | 120246 | 120265 | 63 | 82 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120247 | 120270 | 120252 | 24 | 6 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120271 | 120321 | 120316 | 51 | 46 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120322 | 120345 | 120340 | 24 | 19 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120346 | 120404 | 120397 | 59 | 52 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 120405 | 120463 | 120794 | 59 | 390 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 120464 | 120550 | 120495 | 87 | 32 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120551 | 120557 | 120555 | 7 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120558 | 120577 | 120667 | 20 | 110 | `fetchWithRetry` | async const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120578 | 120617 | 120578 | 40 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120618 | 120732 | 120618 | 115 | 1 | `postTimeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120733 | 120733 | 120733 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120734 | 120799 | 120734 | 66 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 120800 | 120819 | 120814 | 20 | 15 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120820 | 120826 | 120847 | 7 | 28 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120827 | 120852 | 120841 | 26 | 15 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 120853 | 120862 | 120857 | 10 | 5 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 120863 | 120895 | 120890 | 33 | 28 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 120896 | 120981 | 121097 | 86 | 202 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 120982 | 121101 | 121093 | 120 | 112 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 121102 | 121155 | 121151 | 54 | 50 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121156 | 121181 | 121177 | 26 | 22 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 121182 | 121203 | 121199 | 22 | 18 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 121204 | 121217 | 121213 | 14 | 10 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 121218 | 121244 | 121227 | 27 | 10 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121245 | 121268 | 121325 | 24 | 81 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 121269 | 121290 | 121269 | 22 | 1 | `esc` | const arrow | — | refs:117 | Unassigned | `app/modules/app/unassigned.js` |
| 121291 | 121331 | 121291 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121332 | 121367 | 121352 | 36 | 21 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121368 | 121383 | 121382 | 16 | 15 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 121384 | 121473 | 121469 | 90 | 86 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 121474 | 121490 | 121570 | 17 | 97 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121491 | 121581 | 121512 | 91 | 22 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 121582 | 121635 | 121630 | 54 | 49 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 121636 | 121666 | 121661 | 31 | 26 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 121667 | 121695 | 121689 | 29 | 23 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 121696 | 121747 | 121742 | 52 | 47 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121748 | 121975 | 121971 | 228 | 224 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 121976 | 121990 | 121986 | 15 | 11 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 121991 | 122008 | 122003 | 18 | 13 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 122009 | 122039 | 122223 | 31 | 215 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122040 | 122040 | 122040 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122041 | 122052 | 122041 | 12 | 1 | `colors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122053 | 122161 | 122053 | 109 | 1 | `totalData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122162 | 122173 | 122162 | 12 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 122174 | 122189 | 122174 | 16 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 122190 | 122227 | 122190 | 38 | 1 | `epdoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122228 | 122255 | 122283 | 28 | 56 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122256 | 122292 | 122263 | 37 | 8 | `totals` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122293 | 122340 | 122336 | 48 | 44 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122341 | 122347 | 122343 | 7 | 3 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 122348 | 122364 | 122355 | 17 | 8 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 122365 | 122375 | 122588 | 11 | 224 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122376 | 122376 | 122376 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122377 | 122592 | 122377 | 216 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122593 | 122602 | 122598 | 10 | 6 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 122603 | 122644 | 122640 | 42 | 38 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 122645 | 122669 | 122665 | 25 | 21 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122670 | 122689 | 122685 | 20 | 16 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122690 | 122693 | 122710 | 4 | 21 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122694 | 122719 | 122694 | 26 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 122720 | 122738 | 123005 | 19 | 286 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 122739 | 122739 | 122739 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 122740 | 123009 | 122740 | 270 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 123010 | 123073 | 123052 | 64 | 43 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123074 | 123270 | 123266 | 197 | 193 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 123271 | 123289 | 123285 | 19 | 15 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 123290 | 123315 | 123311 | 26 | 22 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 123316 | 123404 | 123400 | 89 | 85 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 123405 | 123450 | 123446 | 46 | 42 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123451 | 123457 | 123453 | 7 | 3 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 123458 | 123464 | 123460 | 7 | 3 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 123465 | 123490 | 123486 | 26 | 22 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123491 | 123576 | 123572 | 86 | 82 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123577 | 123593 | 123589 | 17 | 13 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123594 | 123626 | 123622 | 33 | 29 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 123627 | 123725 | 123716 | 99 | 90 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 123726 | 123744 | 123740 | 19 | 15 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123745 | 123864 | 123860 | 120 | 116 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 123865 | 123881 | 123877 | 17 | 13 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 123882 | 123893 | 123889 | 12 | 8 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123894 | 123905 | 123901 | 12 | 8 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123906 | 123912 | 123908 | 7 | 3 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123913 | 123920 | 123916 | 8 | 4 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 123921 | 123931 | 123927 | 11 | 7 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 123932 | 123945 | 123941 | 14 | 10 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123946 | 123973 | 123965 | 28 | 20 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 123974 | 123998 | 123994 | 25 | 21 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 123999 | 124074 | 124017 | 76 | 19 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 124075 | 124138 | 124134 | 64 | 60 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 124139 | 124146 | 124141 | 8 | 3 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124147 | 124164 | 124159 | 18 | 13 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 124165 | 124189 | 124181 | 25 | 17 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 124190 | 124217 | 124213 | 28 | 24 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124218 | 124231 | 124227 | 14 | 10 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124232 | 124276 | 124272 | 45 | 41 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 124277 | 124303 | 124299 | 27 | 23 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124304 | 124320 | 124315 | 17 | 12 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 124321 | 124342 | 124337 | 22 | 17 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 124343 | 124528 | 124524 | 186 | 182 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 124529 | 124540 | 124536 | 12 | 8 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 124541 | 124721 | 124717 | 181 | 177 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 124722 | 124733 | 124729 | 12 | 8 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 124734 | 124747 | 124743 | 14 | 10 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 124748 | 124781 | 124762 | 34 | 15 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 124782 | 124835 | 124831 | 54 | 50 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 124836 | 124852 | 124848 | 17 | 13 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 124853 | 124899 | 124988 | 47 | 136 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 124900 | 124992 | 124900 | 93 | 1 | `sampleValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 124993 | 125008 | 125004 | 16 | 12 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 125009 | 125062 | 125058 | 54 | 50 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 125063 | 125184 | 125180 | 122 | 118 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125185 | 125197 | 125192 | 13 | 8 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 125198 | 125267 | 125257 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 125268 | 125297 | 125277 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 125298 | 125366 | 125337 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 125367 | 125374 | 125373 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125375 | 125411 | 125406 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125412 | 125432 | 125415 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125433 | 125445 | 125441 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125446 | 125523 | 125518 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 125524 | 125541 | 125528 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 125542 | 125565 | 125561 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 125566 | 125573 | 125569 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 125574 | 125586 | 125879 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 125587 | 125593 | 125587 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 125594 | 125702 | 125594 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 125703 | 125713 | 125709 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 125714 | 125771 | 125766 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 125772 | 125886 | 125772 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 125887 | 125905 | 126111 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 125906 | 125978 | 125908 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 125979 | 126115 | 125981 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 126116 | 126134 | 126130 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 126135 | 126174 | 126169 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 126175 | 126189 | 126184 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 126190 | 126190 | 126234 | 1 | 45 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 126191 | 126194 | 126191 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126195 | 126242 | 126198 | 48 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126243 | 126251 | 126555 | 9 | 313 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 126252 | 126270 | 126252 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126271 | 126404 | 126291 | 134 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 126405 | 126426 | 126405 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126427 | 126443 | 126435 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 126444 | 126468 | 126451 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 126469 | 126559 | 126472 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 126560 | 126582 | 126578 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 126583 | 126585 | 126624 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 126586 | 126628 | 126586 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126629 | 126630 | 126675 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 126631 | 126644 | 126631 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126645 | 126683 | 126662 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 126684 | 126689 | 126906 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 126690 | 126743 | 126695 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126744 | 126760 | 126752 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 126761 | 126832 | 126768 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 126833 | 126879 | 126836 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 126880 | 126882 | 126880 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126883 | 126910 | 126886 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 126911 | 126939 | 126935 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 126940 | 126941 | 126968 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 126942 | 126972 | 126946 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126973 | 126974 | 127017 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 126975 | 126991 | 126979 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 126992 | 127025 | 127005 | 34 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 127026 | 127043 | 127039 | 18 | 14 | `arcgisShowStatus` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 127044 | 127053 | 127049 | 10 | 6 | `arcgisHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127054 | 127078 | 127074 | 25 | 21 | `arcgisNormalizeUrl` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127079 | 127102 | 127109 | 24 | 31 | `arcgisValidateUrl` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127103 | 127113 | 127103 | 11 | 1 | `hasValidPattern` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127114 | 127234 | 127230 | 121 | 117 | `arcgisFetchService` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 127235 | 127245 | 127302 | 11 | 68 | `arcgisShowFieldModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127246 | 127261 | 127251 | 16 | 6 | `fields` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 127262 | 127306 | 127262 | 45 | 1 | `match` | const arrow | — | refs:53 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127307 | 127317 | 127313 | 11 | 7 | `arcgisCloseFieldModal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 127318 | 127333 | 127329 | 16 | 12 | `arcgisToggleCustomType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127334 | 127343 | 127339 | 10 | 6 | `arcgisWebMercatorToWGS84` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 127344 | 127474 | 127506 | 131 | 163 | `arcgisImportFeatures` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127475 | 127510 | 127475 | 36 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127511 | 127575 | 127571 | 65 | 61 | `arcgisFetchAllFeatures` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127576 | 127630 | 127614 | 55 | 39 | `arcgisSaveAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 127631 | 127668 | 127664 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 127669 | 127704 | 127700 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127705 | 127722 | 127718 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127723 | 127740 | 127736 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 127741 | 127752 | 127746 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 127753 | 127836 | 128059 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 127837 | 127857 | 127841 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127858 | 127876 | 127858 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 127877 | 127887 | 127885 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 127888 | 127954 | 127948 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127955 | 127973 | 127962 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 127974 | 128063 | 127979 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128064 | 128077 | 128119 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128078 | 128123 | 128078 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128124 | 128186 | 128182 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 128187 | 128221 | 128191 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 128222 | 128260 | 128239 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 128261 | 128270 | 128266 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128271 | 128351 | 128346 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 128352 | 128359 | 128354 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 128360 | 128384 | 128365 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 128385 | 128398 | 128387 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128399 | 128415 | 128442 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 128416 | 128446 | 128416 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128447 | 128464 | 128460 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 128465 | 128472 | 128468 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128473 | 128489 | 128485 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 128490 | 128526 | 128522 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128527 | 128552 | 128574 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128553 | 128581 | 128564 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128582 | 128641 | 128635 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128642 | 128689 | 128684 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 128690 | 128694 | 128763 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128695 | 128767 | 128695 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 128768 | 128792 | 128788 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128793 | 128888 | 128884 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 128889 | 128904 | 129138 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 128905 | 129023 | 128908 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 129024 | 129142 | 129084 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 129143 | 129188 | 129184 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129189 | 129200 | 129196 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129201 | 129214 | 129210 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129215 | 129250 | 129244 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129251 | 129301 | 129296 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129302 | 129379 | 129368 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 129380 | 129407 | 129445 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 129408 | 129463 | 129410 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 129464 | 129482 | 129478 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 129483 | 129526 | 129514 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 129527 | 129533 | 129529 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 129534 | 129592 | 129588 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 129593 | 129600 | 129651 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 129601 | 129655 | 129601 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 129656 | 129706 | 129745 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 129707 | 129727 | 129710 | 21 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 129728 | 129757 | 129735 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 129758 | 129787 | 129783 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 129788 | 129823 | 129793 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 129824 | 129965 | 129859 | 142 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 129966 | 129973 | 129971 | 8 | 6 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 129974 | 129987 | 129983 | 14 | 10 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 129988 | 129992 | 129991 | 5 | 4 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 129993 | 129997 | 129995 | 5 | 3 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 129998 | 130039 | 130038 | 42 | 41 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130040 | 130045 | 130044 | 6 | 5 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130046 | 130056 | 130054 | 11 | 9 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130057 | 130117 | 130115 | 61 | 59 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130118 | 130142 | 130140 | 25 | 23 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130143 | 130160 | 130158 | 18 | 16 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130161 | 130229 | 130261 | 69 | 101 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130230 | 130262 | 130237 | 33 | 8 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 130263 | 130272 | 130271 | 10 | 9 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130273 | 130313 | 130310 | 41 | 38 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130314 | 130358 | 130357 | 45 | 44 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130359 | 130406 | 130405 | 48 | 47 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130407 | 130477 | 130476 | 71 | 70 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130478 | 130500 | 130499 | 23 | 22 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130501 | 130521 | 130520 | 21 | 20 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130522 | 130542 | 130541 | 21 | 20 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130543 | 130563 | 130562 | 21 | 20 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130564 | 130590 | 130588 | 27 | 25 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130591 | 130650 | 130649 | 60 | 59 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130651 | 130718 | 130717 | 68 | 67 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130719 | 130733 | 130732 | 15 | 14 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130734 | 130749 | 130748 | 16 | 15 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130750 | 130767 | 130765 | 18 | 16 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130768 | 130772 | 130771 | 5 | 4 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130773 | 130839 | 130838 | 67 | 66 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130840 | 130917 | 130916 | 78 | 77 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130918 | 130927 | 130926 | 10 | 9 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130928 | 130931 | 130930 | 4 | 3 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130932 | 130947 | 130945 | 16 | 14 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130948 | 130980 | 130978 | 33 | 31 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 130981 | 131017 | 131016 | 37 | 36 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 131018 | 131060 | 131059 | 43 | 42 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 131061 | 131064 | 131063 | 4 | 3 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 131065 | 131102 | 131101 | 38 | 37 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 131103 | 131595 | 131232 | 493 | 130 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 131596 | 131696 | 131602 | 101 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
