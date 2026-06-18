# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (124956 lines)

Declarations in this part: **1065**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40033 | 40086 | 40039 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40087 | 40137 | 40087 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40138 | 40141 | 40138 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40142 | 40162 | 40148 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40163 | 40183 | 40182 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40184 | 40197 | 40195 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40198 | 40223 | 40214 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40224 | 40235 | 40234 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40236 | 40242 | 40241 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40243 | 40253 | 40252 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40254 | 40274 | 40273 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 40275 | 40284 | 40283 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 40285 | 40289 | 40288 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 40290 | 40296 | 40342 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 40297 | 40297 | 40297 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40298 | 40343 | 40298 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40344 | 40348 | 40347 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 40349 | 40370 | 40379 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 40371 | 40380 | 40371 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40381 | 40410 | 40400 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40411 | 40431 | 40429 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 40432 | 40452 | 40450 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 40453 | 40457 | 40455 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40458 | 40519 | 40490 | 62 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40520 | 40529 | 40538 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 40530 | 40544 | 40530 | 15 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 40545 | 40554 | 40563 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40555 | 40565 | 40555 | 11 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 40566 | 40581 | 40573 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40582 | 40584 | 40602 | 3 | 21 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 40585 | 40595 | 40592 | 11 | 8 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40596 | 40607 | 40599 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40608 | 40665 | 40700 | 58 | 93 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40666 | 40707 | 40669 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 40708 | 40719 | 40829 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40720 | 40831 | 40729 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40832 | 40854 | 40853 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 40855 | 40886 | 40884 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40887 | 40925 | 40921 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40926 | 40963 | 40948 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40964 | 40973 | 40971 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 40974 | 40982 | 40981 | 9 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40983 | 40986 | 40985 | 4 | 3 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40987 | 40998 | 40997 | 12 | 11 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40999 | 41035 | 41033 | 37 | 35 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 41036 | 41059 | 41058 | 24 | 23 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41060 | 41067 | 41066 | 8 | 7 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41068 | 41103 | 41102 | 36 | 35 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41104 | 41123 | 41122 | 20 | 19 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41124 | 41132 | 41131 | 9 | 8 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 41133 | 41151 | 41155 | 19 | 23 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41152 | 41152 | 41152 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 41153 | 41167 | 41153 | 15 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41168 | 41246 | 41240 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 41247 | 41252 | 41251 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41253 | 41263 | 41512 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 41264 | 41264 | 41264 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41265 | 41460 | 41265 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41461 | 41480 | 41504 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41481 | 41518 | 41493 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41519 | 41538 | 41547 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 41539 | 41548 | 41539 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41549 | 41695 | 41693 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41696 | 41751 | 41750 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41752 | 41829 | 41871 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 41830 | 41872 | 41833 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41873 | 41885 | 41938 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 41886 | 41939 | 41923 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41940 | 41981 | 41954 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41982 | 42031 | 42029 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 42032 | 42044 | 42042 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42045 | 42058 | 42056 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42059 | 42078 | 42076 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42079 | 42112 | 42110 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42113 | 42130 | 42121 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42131 | 42149 | 42148 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 42150 | 42196 | 42157 | 47 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42197 | 42212 | 42206 | 16 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42213 | 42236 | 42228 | 24 | 16 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42237 | 42267 | 42257 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42268 | 42328 | 42293 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 42329 | 42393 | 42389 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42394 | 42442 | 42425 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42443 | 42472 | 42464 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42473 | 42531 | 42510 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42532 | 42534 | 42578 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42535 | 42545 | 42544 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42546 | 42583 | 42559 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42584 | 42595 | 42589 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42596 | 42678 | 42671 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42679 | 42734 | 42725 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42735 | 42770 | 42764 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42771 | 42792 | 42790 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42793 | 42857 | 42802 | 65 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 42858 | 42929 | 42928 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 42930 | 42934 | 42932 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42935 | 42963 | 42961 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42964 | 42996 | 43022 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42997 | 43008 | 42999 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43009 | 43024 | 43015 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43025 | 43102 | 43100 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 43103 | 43114 | 43171 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43115 | 43137 | 43117 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43138 | 43145 | 43138 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43146 | 43173 | 43146 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43174 | 43187 | 43185 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43188 | 43220 | 43212 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43221 | 43280 | 43278 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43281 | 43304 | 43302 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43305 | 43386 | 43381 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43387 | 43445 | 43426 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 43446 | 43479 | 43446 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 43480 | 43503 | 43480 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43504 | 43521 | 43507 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43522 | 43549 | 43522 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43550 | 43551 | 43550 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43552 | 43552 | 43552 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43553 | 43567 | 43553 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43568 | 43586 | 43571 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43587 | 43611 | 43607 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 43612 | 43625 | 43621 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43626 | 43629 | 43644 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 43630 | 43630 | 43630 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43631 | 43655 | 43631 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43656 | 43701 | 43686 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 43702 | 43876 | 43930 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43877 | 43932 | 43877 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43933 | 43936 | 43935 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43937 | 43943 | 43942 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43944 | 43972 | 43971 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43973 | 43973 | 43988 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43974 | 43979 | 43976 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43980 | 43980 | 43980 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43981 | 43983 | 43981 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43984 | 43997 | 43984 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43998 | 44019 | 44078 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44020 | 44032 | 44022 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44033 | 44079 | 44039 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44080 | 44084 | 44141 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44085 | 44107 | 44087 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44108 | 44108 | 44108 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44109 | 44112 | 44109 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44113 | 44142 | 44113 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44143 | 44152 | 44151 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44153 | 44191 | 44190 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44192 | 44220 | 44213 | 29 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44221 | 44281 | 44279 | 61 | 59 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 44282 | 44301 | 44333 | 20 | 52 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 44302 | 44335 | 44302 | 34 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44336 | 44417 | 44415 | 82 | 80 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 44418 | 44464 | 44462 | 47 | 45 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44465 | 44546 | 44543 | 82 | 79 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44547 | 44554 | 44603 | 8 | 57 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44555 | 44605 | 44568 | 51 | 14 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 44606 | 44618 | 44645 | 13 | 40 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44619 | 44632 | 44631 | 14 | 13 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44633 | 44647 | 44635 | 15 | 3 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44648 | 44658 | 44656 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44659 | 44673 | 44671 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44674 | 44682 | 44691 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44683 | 44694 | 44683 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44695 | 44699 | 44697 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44700 | 44716 | 44714 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44717 | 44727 | 44725 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44728 | 44740 | 44738 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44741 | 44756 | 44755 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44757 | 44820 | 44761 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44821 | 44934 | 44932 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44935 | 44943 | 44942 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44944 | 44954 | 44953 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44955 | 44971 | 44970 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44972 | 44997 | 44996 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44998 | 45003 | 45002 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45004 | 45014 | 45013 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45015 | 45024 | 45023 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45025 | 45031 | 45030 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45032 | 45061 | 45060 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45062 | 45090 | 45089 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45091 | 45105 | 45104 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45106 | 45135 | 45127 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45136 | 45145 | 45141 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45146 | 45153 | 45149 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45154 | 45166 | 45162 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45167 | 45210 | 45206 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45211 | 45220 | 45216 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45221 | 45256 | 45252 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45257 | 45267 | 45263 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45268 | 45308 | 45304 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45309 | 45319 | 45315 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45320 | 45345 | 45344 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45346 | 45388 | 45387 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45389 | 45443 | 45430 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 45444 | 45464 | 45463 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45465 | 45483 | 45479 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45484 | 45509 | 45505 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45510 | 45570 | 45569 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45571 | 45656 | 45693 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45657 | 45657 | 45657 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45658 | 45665 | 45658 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45666 | 45694 | 45666 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45695 | 45712 | 45711 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45713 | 45731 | 45730 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 45732 | 45738 | 45737 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45739 | 45745 | 45744 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45746 | 45753 | 45752 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45754 | 45800 | 45799 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45801 | 45853 | 45848 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45854 | 46018 | 46017 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46019 | 46022 | 46021 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 46023 | 46041 | 46120 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46042 | 46123 | 46048 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46124 | 46137 | 46255 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 46138 | 46168 | 46144 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46169 | 46173 | 46169 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46174 | 46177 | 46176 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46178 | 46178 | 46178 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46179 | 46257 | 46179 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46258 | 46271 | 46391 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 46272 | 46302 | 46278 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46303 | 46317 | 46303 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46318 | 46318 | 46318 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46319 | 46393 | 46319 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46394 | 46420 | 46470 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46421 | 46473 | 46421 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46474 | 46640 | 46638 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 46641 | 46647 | 46645 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46648 | 46651 | 46708 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46652 | 46669 | 46652 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46670 | 46672 | 46670 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46673 | 46681 | 46673 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46682 | 46710 | 46682 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46711 | 46759 | 46757 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46760 | 46764 | 46762 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46765 | 46769 | 46767 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 46770 | 46809 | 46807 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46810 | 46830 | 46829 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 46831 | 46842 | 46841 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46843 | 46854 | 46894 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46855 | 46870 | 46869 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46871 | 46922 | 46871 | 52 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46923 | 46927 | 47213 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46928 | 46935 | 46933 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46936 | 47143 | 46941 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47144 | 47214 | 47149 | 71 | 6 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 47215 | 47241 | 47239 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47242 | 47259 | 48487 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 47260 | 47274 | 47272 | 15 | 13 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 47275 | 47291 | 47289 | 17 | 15 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 47292 | 47302 | 47300 | 11 | 9 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 47303 | 47334 | 47332 | 32 | 30 | `drawKPI` | fn | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 47335 | 47354 | 47352 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47355 | 47437 | 47365 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 47438 | 47517 | 47438 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47518 | 47662 | 47518 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47663 | 47707 | 47667 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47708 | 47789 | 47717 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47790 | 47990 | 47790 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47991 | 48533 | 47991 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48534 | 48555 | 48551 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 48556 | 48564 | 48560 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48565 | 48734 | 48658 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48735 | 48750 | 48744 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48751 | 48767 | 48760 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48768 | 48777 | 48770 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48778 | 48804 | 48798 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48805 | 48817 | 48811 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48818 | 48835 | 48917 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48836 | 48852 | 48846 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48853 | 48923 | 48853 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48924 | 48934 | 48928 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48935 | 48966 | 48960 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48967 | 48985 | 48980 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48986 | 49006 | 48999 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49007 | 49053 | 49047 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 49054 | 49127 | 49122 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49128 | 49204 | 49197 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49205 | 49239 | 49234 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 49240 | 49567 | 49563 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49568 | 49667 | 49663 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 49668 | 49668 | 49732 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49669 | 49691 | 49670 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49692 | 49736 | 49692 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49737 | 49824 | 49820 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49825 | 49825 | 49893 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49826 | 49897 | 49827 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49898 | 49915 | 49910 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49916 | 49929 | 49925 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49930 | 50039 | 50035 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50040 | 50060 | 50092 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50061 | 50096 | 50061 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50097 | 50120 | 50116 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50121 | 50136 | 50132 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 50137 | 50143 | 50169 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50144 | 50161 | 50160 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50162 | 50173 | 50162 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50174 | 50206 | 50237 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50207 | 50240 | 50217 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50241 | 50263 | 50261 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50264 | 50282 | 50280 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50283 | 50293 | 50291 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50294 | 50311 | 50309 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50312 | 50319 | 50317 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50320 | 50367 | 50357 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50368 | 50386 | 50553 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50387 | 50389 | 50392 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50390 | 50447 | 50390 | 58 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50448 | 50453 | 50453 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 50454 | 50512 | 50460 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50513 | 50535 | 50517 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 50536 | 50555 | 50536 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50556 | 50613 | 50764 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50614 | 50766 | 50614 | 153 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50767 | 50807 | 50805 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50808 | 50824 | 50822 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50825 | 51033 | 51031 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51034 | 51056 | 51054 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 51057 | 51066 | 51124 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51067 | 51069 | 51067 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51070 | 51126 | 51070 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51127 | 51144 | 51142 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51145 | 51197 | 51278 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51198 | 51225 | 51198 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51226 | 51239 | 51226 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51240 | 51253 | 51240 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 51254 | 51267 | 51254 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51268 | 51280 | 51268 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51281 | 51285 | 51325 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51286 | 51296 | 51286 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51297 | 51327 | 51303 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 51328 | 51365 | 51363 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51366 | 51409 | 51412 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51410 | 51413 | 51410 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51414 | 51437 | 51814 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51438 | 51572 | 51455 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51573 | 51674 | 51591 | 102 | 19 | `drawKPI` | fn | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 51675 | 51815 | 51684 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51816 | 51826 | 51824 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51827 | 51833 | 51832 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51834 | 51858 | 51837 | 25 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51859 | 51875 | 51859 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51876 | 51910 | 51909 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51911 | 51939 | 51927 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51940 | 51964 | 51963 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51965 | 52011 | 51997 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52012 | 52031 | 52030 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 52032 | 52059 | 52044 | 28 | 13 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52060 | 52136 | 52095 | 77 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52137 | 52174 | 52166 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52175 | 52188 | 52183 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52189 | 52231 | 52227 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52232 | 52256 | 52252 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 52257 | 52290 | 52261 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52291 | 52309 | 52301 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52310 | 52336 | 52329 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 52337 | 52360 | 52351 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 52361 | 52385 | 52378 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52386 | 52395 | 52411 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52396 | 52406 | 52400 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52407 | 52407 | 52407 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52408 | 52419 | 52408 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52420 | 52435 | 52429 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52436 | 52436 | 52468 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 52437 | 52448 | 52442 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52449 | 52460 | 52453 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52461 | 52475 | 52464 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52476 | 52647 | 52476 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 52648 | 52662 | 52656 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 52663 | 52675 | 52670 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 52676 | 52694 | 52768 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52695 | 52774 | 52695 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52775 | 52776 | 52792 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52777 | 52796 | 52781 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52797 | 52814 | 52810 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52815 | 52824 | 52891 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52825 | 52868 | 52825 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52869 | 52895 | 52869 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52896 | 52905 | 52921 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 52906 | 52929 | 52909 | 24 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52930 | 52930 | 52941 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 52931 | 52945 | 52931 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52946 | 52968 | 52964 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 52969 | 52985 | 52981 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 52986 | 52998 | 53018 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 52999 | 53030 | 53005 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 53031 | 53059 | 53054 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 53060 | 53096 | 53094 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 53097 | 53107 | 53106 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 53108 | 53136 | 53128 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 53137 | 53237 | 53378 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 53238 | 53258 | 53238 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53259 | 53259 | 53259 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53260 | 53260 | 53260 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53261 | 53262 | 53261 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53263 | 53304 | 53263 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53305 | 53386 | 53305 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53387 | 53422 | 53416 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 53423 | 53424 | 53446 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 53425 | 53447 | 53432 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53448 | 53595 | 53548 | 148 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 53596 | 53629 | 53690 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53630 | 53708 | 53630 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53709 | 53761 | 54188 | 53 | 480 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53762 | 53768 | 53762 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 53769 | 53792 | 53769 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 53793 | 53849 | 53796 | 57 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 53850 | 53850 | 53850 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53851 | 53851 | 53851 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53852 | 53884 | 53852 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53885 | 53912 | 53889 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53913 | 53914 | 53923 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 53915 | 53978 | 53915 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 53979 | 53985 | 53985 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53986 | 53991 | 53991 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53992 | 54027 | 54006 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54028 | 54089 | 54028 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54090 | 54192 | 54090 | 103 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54193 | 54287 | 54408 | 95 | 216 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 54288 | 54313 | 54288 | 26 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54314 | 54314 | 54314 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54315 | 54315 | 54315 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54316 | 54369 | 54316 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54370 | 54370 | 54389 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54371 | 54411 | 54371 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54412 | 54449 | 54448 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54450 | 54462 | 54537 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54463 | 54545 | 54466 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 54546 | 54552 | 54551 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54553 | 54632 | 54631 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54633 | 54639 | 54638 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54640 | 54648 | 54678 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54649 | 54679 | 54649 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 54680 | 54729 | 54728 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54730 | 54747 | 54746 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54748 | 54804 | 54775 | 57 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54805 | 54836 | 55079 | 32 | 275 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54837 | 54940 | 54837 | 104 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54941 | 55080 | 54941 | 140 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 55081 | 55089 | 55126 | 9 | 46 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55090 | 55090 | 55090 | 1 | 1 | `fmt` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55091 | 55104 | 55096 | 14 | 6 | `parseLocal` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55105 | 55120 | 55105 | 16 | 1 | `qLastDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55121 | 55127 | 55121 | 7 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55128 | 55144 | 55176 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55145 | 55165 | 55145 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55166 | 55177 | 55170 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 55178 | 55222 | 55221 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55223 | 55241 | 55240 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55242 | 55272 | 55286 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55273 | 55287 | 55276 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 55288 | 55324 | 55323 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55325 | 55342 | 55350 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55343 | 55351 | 55343 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55352 | 55367 | 55387 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55368 | 55374 | 55368 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55375 | 55388 | 55375 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55389 | 55426 | 55482 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55427 | 55488 | 55427 | 62 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55489 | 55526 | 55525 | 38 | 37 | `_activeTierLabel` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55527 | 55579 | 55736 | 53 | 210 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55580 | 55580 | 55580 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55581 | 55617 | 55581 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55618 | 55649 | 55623 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55650 | 55737 | 55650 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55738 | 55772 | 55819 | 35 | 82 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55773 | 55820 | 55777 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55821 | 55830 | 55829 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55831 | 55845 | 55840 | 15 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55846 | 55892 | 55860 | 47 | 15 | `_cc367_filename` | window fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55893 | 55942 | 55937 | 50 | 45 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55943 | 55993 | 55992 | 51 | 50 | `exportReportPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55994 | 56055 | 56040 | 62 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56056 | 56069 | 56068 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56070 | 56087 | 56086 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56088 | 56112 | 56111 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 56113 | 56113 | 56129 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56114 | 56130 | 56114 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56131 | 56144 | 56143 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56145 | 56158 | 56157 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56159 | 56209 | 56207 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 56210 | 56250 | 56248 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56251 | 56317 | 56354 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56318 | 56320 | 56318 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 56321 | 56327 | 56325 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56328 | 56356 | 56334 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56357 | 56378 | 56388 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56379 | 56390 | 56381 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56391 | 56406 | 56404 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 56407 | 56413 | 56411 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56414 | 56426 | 56424 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 56427 | 56429 | 56439 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56430 | 56440 | 56433 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56441 | 56442 | 56452 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56443 | 56448 | 56443 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56449 | 56453 | 56449 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56454 | 56505 | 56504 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 56506 | 56534 | 57217 | 29 | 712 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56535 | 56550 | 56548 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56551 | 56558 | 56556 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56559 | 56565 | 56563 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 56566 | 56575 | 56573 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56576 | 56613 | 56611 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56614 | 56614 | 56637 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56615 | 56639 | 56615 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56640 | 56640 | 56685 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56641 | 56693 | 56641 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56694 | 56713 | 56699 | 20 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 56714 | 56716 | 56714 | 3 | 1 | `cc370EmptyLine` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56717 | 56718 | 56733 | 2 | 17 | `cc370BarList` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56719 | 56734 | 56719 | 16 | 1 | `max` | const arrow | — | refs:228 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56735 | 56736 | 56758 | 2 | 24 | `generateContributingFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56737 | 56759 | 56738 | 23 | 2 | `factorObjs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56760 | 56773 | 56772 | 14 | 13 | `generateRecommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56774 | 57218 | 56802 | 445 | 29 | `generateFundingSection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57219 | 57230 | 57227 | 12 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57231 | 57280 | 57279 | 50 | 49 | `_stateFundingPrograms` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57281 | 57320 | 57868 | 40 | 588 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57321 | 57337 | 57336 | 17 | 16 | `addText` | const arrow | — | refs:149 | Unassigned | `app/modules/app/unassigned.js` |
| 57338 | 57338 | 57338 | 1 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 57339 | 57341 | 57339 | 3 | 1 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 57342 | 57376 | 57368 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57377 | 57379 | 57377 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57380 | 57388 | 57386 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 57389 | 57575 | 57399 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 57576 | 57584 | 57576 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57585 | 57636 | 57585 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57637 | 57684 | 57637 | 48 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57685 | 57751 | 57685 | 67 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57752 | 57833 | 57752 | 82 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57834 | 57869 | 57834 | 36 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57870 | 57878 | 57877 | 9 | 8 | `hexToRgb` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 57879 | 57896 | 58202 | 18 | 324 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57897 | 58204 | 57897 | 308 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58205 | 58341 | 58314 | 137 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58342 | 58391 | 58386 | 50 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58392 | 58472 | 58468 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58473 | 58573 | 58569 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58574 | 58591 | 58666 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58592 | 58672 | 58592 | 81 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58673 | 58817 | 58793 | 145 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58818 | 58839 | 58837 | 22 | 20 | `switchBAMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58840 | 58846 | 58844 | 7 | 5 | `setBatchBAAnalysisType` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 58847 | 58857 | 58855 | 11 | 9 | `initBALocationDropdown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 58858 | 58906 | 58903 | 49 | 46 | `updateBALocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58907 | 58972 | 58970 | 66 | 64 | `filterBALocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58973 | 58980 | 58978 | 8 | 6 | `handleBASearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58981 | 58998 | 59021 | 18 | 41 | `triggerBASearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58999 | 59006 | 58999 | 8 | 1 | `matchingRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59007 | 59023 | 59009 | 17 | 3 | `matchingNode` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59024 | 59055 | 59053 | 32 | 30 | `selectBASearchResult` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59056 | 59103 | 59101 | 48 | 46 | `loadBALocation` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 59104 | 59110 | 59108 | 7 | 5 | `getMatchedCrashesFromMapSelection` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59111 | 59122 | 59120 | 12 | 10 | `computeStatsFromMapPoints` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59123 | 59167 | 59165 | 45 | 43 | `updateBALocationSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59168 | 59203 | 59202 | 36 | 35 | `selectBALocationFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59204 | 59208 | 59207 | 5 | 4 | `closeBAMapModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59209 | 59216 | 59214 | 8 | 6 | `goToMapForBASelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59217 | 59243 | 59241 | 27 | 25 | `useMapSelectionForBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59244 | 59256 | 59254 | 13 | 11 | `setBAStudyPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59257 | 59296 | 59294 | 40 | 38 | `calculateBAPeriods` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59297 | 59316 | 59314 | 20 | 18 | `updateBAPeriodDisplay` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 59317 | 59342 | 59340 | 26 | 24 | `updateBAMethodInfo` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59343 | 59381 | 59379 | 39 | 37 | `resetBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59382 | 59473 | 59549 | 92 | 168 | `runBeforeAfterAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59474 | 59551 | 59477 | 78 | 4 | `_statsFromRpc` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59552 | 59561 | 59559 | 10 | 8 | `filterCrashesByPeriod` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 59562 | 59572 | 59570 | 11 | 9 | `normalCDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59573 | 59604 | 59602 | 32 | 30 | `displayBAResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59605 | 59647 | 59645 | 43 | 41 | `displayBAKPIComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59648 | 59697 | 59695 | 50 | 48 | `displayBAStatisticalResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59698 | 59778 | 59776 | 81 | 79 | `createBACharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59779 | 59806 | 59804 | 28 | 26 | `calculateMonthlyTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59807 | 59893 | 59891 | 87 | 85 | `displayBADetailedTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59894 | 59942 | 59940 | 49 | 47 | `displayBAFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59943 | 59973 | 59971 | 31 | 29 | `displayBAConclusions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59974 | 59978 | 59976 | 5 | 3 | `printBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59979 | 60069 | 60334 | 91 | 356 | `downloadBAPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60070 | 60336 | 60093 | 267 | 24 | `drawKPI` | fn | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 60337 | 60372 | 60370 | 36 | 34 | `exportBAData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60373 | 60418 | 60413 | 46 | 41 | `copyBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60419 | 60447 | 60445 | 29 | 27 | `openBAEmailSchedule` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60448 | 60582 | 60580 | 135 | 133 | `generateBAPDFForEmail` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60583 | 60602 | 60785 | 20 | 203 | `testBAEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60603 | 60630 | 60605 | 28 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60631 | 60787 | 60726 | 157 | 96 | `buildBAEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60788 | 60802 | 60800 | 15 | 13 | `updateBADeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60803 | 60811 | 60809 | 9 | 7 | `updateBAFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60812 | 60845 | 60840 | 34 | 29 | `calculateBANextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 60846 | 60867 | 60905 | 22 | 60 | `initBAMonitoringPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60868 | 60889 | 60868 | 22 | 1 | `el` | const arrow | — | refs:272 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60890 | 60906 | 60890 | 17 | 1 | `el` | const arrow | — | refs:272 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60907 | 60926 | 60925 | 20 | 19 | `toggleBAMonitoringEnabled` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60927 | 60940 | 60939 | 14 | 13 | `updateBAMonitoringLocationDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 60941 | 60947 | 60946 | 7 | 6 | `updateBAAlertRowStyle` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 60948 | 60952 | 60951 | 5 | 4 | `toggleBAMonitorScheduleUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60953 | 60960 | 60959 | 8 | 7 | `updateBAMonitorFreqUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60961 | 60961 | 61024 | 1 | 64 | `saveBAMonitoringSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60962 | 61025 | 60962 | 64 | 1 | `el` | const arrow | — | refs:272 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61026 | 61041 | 61124 | 16 | 99 | `evaluateBAAlertConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61042 | 61065 | 61045 | 24 | 4 | `recentCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61066 | 61125 | 61070 | 60 | 5 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61126 | 61202 | 61201 | 77 | 76 | `buildBAAlertEmailHtml` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61203 | 61230 | 61304 | 28 | 102 | `sendBAMonitoringTestAlert` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61231 | 61305 | 61231 | 75 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61306 | 61335 | 61334 | 30 | 29 | `renderBAMonitoringStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61336 | 61361 | 61426 | 26 | 91 | `checkBAMonitoringOnDataLoad` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61362 | 61363 | 61362 | 2 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61364 | 61427 | 61364 | 64 | 1 | `plainText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61428 | 61437 | 61450 | 10 | 23 | `addBAMonitorSubscriber` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61438 | 61451 | 61438 | 14 | 1 | `existing` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61452 | 61458 | 61457 | 7 | 6 | `removeBAMonitorSubscriber` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61459 | 61486 | 61480 | 28 | 22 | `refreshBAMonitorSubscriberChips` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61487 | 61507 | 61559 | 21 | 73 | `syncBAMonitoringToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61508 | 61544 | 61508 | 37 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61545 | 61563 | 61545 | 19 | 1 | `result` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61564 | 61588 | 61584 | 25 | 21 | `deleteBAMonitoringFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61589 | 61598 | 61597 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61599 | 61622 | 61621 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61623 | 61640 | 61629 | 18 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 61641 | 61672 | 61671 | 32 | 31 | `loadSavedKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61673 | 61708 | 61707 | 36 | 35 | `handleAIFileSelect` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61709 | 61719 | 61718 | 11 | 10 | `renderAttachments` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61720 | 61724 | 61723 | 5 | 4 | `removeAttachment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61725 | 61729 | 61728 | 5 | 4 | `askSuggestion` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 61730 | 61789 | 61788 | 60 | 59 | `clearAIChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61790 | 61794 | 61793 | 5 | 4 | `clearApiKey` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61795 | 61833 | 61832 | 39 | 38 | `addMessage` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61834 | 61846 | 61845 | 13 | 12 | `addTypingIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61847 | 61851 | 61850 | 5 | 4 | `removeTypingIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61852 | 61920 | 61912 | 69 | 61 | `buildCrashDataContext` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61921 | 61929 | 61929 | 9 | 9 | `initMUTCDLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 61930 | 61945 | 61945 | 16 | 16 | `loadMUTCDLocation` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 61946 | 61952 | 61950 | 7 | 5 | `clearMUTCDLocation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 61953 | 61972 | 61970 | 20 | 18 | `loadMUTCDIndex` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 61973 | 62107 | 62094 | 135 | 122 | `buildMUTCDContext` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 62108 | 62164 | 62183 | 57 | 76 | `queryPineconeRAG` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62165 | 62185 | 62174 | 21 | 10 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62186 | 62289 | 62210 | 104 | 25 | `buildPineconeRAGContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62290 | 62329 | 62452 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 62330 | 62380 | 62334 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 62381 | 62719 | 62381 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62720 | 62782 | 62772 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 62783 | 62794 | 62930 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 62795 | 62935 | 62799 | 141 | 5 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 62936 | 62989 | 62984 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62990 | 63073 | 63068 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63074 | 63138 | 63134 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63139 | 63278 | 63273 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63279 | 63322 | 63368 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63323 | 63373 | 63345 | 51 | 23 | `updateProgress` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 63374 | 63379 | 63377 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 63380 | 63428 | 63426 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63429 | 63452 | 63431 | 24 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 63453 | 63498 | 63503 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63499 | 63505 | 63499 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63506 | 63518 | 63516 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63519 | 63531 | 63529 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63532 | 63536 | 63534 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 63537 | 63541 | 63539 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63542 | 63552 | 63652 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63553 | 63571 | 63553 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 63572 | 63654 | 63572 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63655 | 63682 | 63681 | 28 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63683 | 63783 | 63773 | 101 | 91 | `buildSystemPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63784 | 63938 | 63934 | 155 | 151 | `getAIAnalysisContext` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 63939 | 63945 | 63941 | 7 | 3 | `buildLocationCrashContext` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 63946 | 63970 | 63969 | 25 | 24 | `updateAIContextIndicator` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 63971 | 64013 | 64012 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 64014 | 64030 | 64029 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64031 | 64049 | 64048 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64050 | 64058 | 64057 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64059 | 64185 | 64184 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 64186 | 64229 | 64228 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64230 | 64287 | 64286 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 64288 | 64323 | 64322 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64324 | 64389 | 64357 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64390 | 64429 | 64427 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64430 | 64454 | 64452 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64455 | 64620 | 64468 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64621 | 64637 | 64621 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64638 | 64653 | 64638 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64654 | 64671 | 64656 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64672 | 64690 | 64672 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64691 | 64691 | 64691 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64692 | 64709 | 64694 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64710 | 64727 | 64710 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64728 | 64748 | 64730 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64749 | 64749 | 64749 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64750 | 64767 | 64750 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64768 | 64789 | 64787 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64790 | 64807 | 64805 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64808 | 64830 | 64871 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64831 | 64831 | 64831 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64832 | 64834 | 64832 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64835 | 64835 | 64835 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64836 | 64873 | 64836 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64874 | 64895 | 64893 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64896 | 64932 | 64930 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64933 | 64978 | 65122 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64979 | 64991 | 64979 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64992 | 65003 | 64992 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65004 | 65018 | 65007 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65019 | 65124 | 65022 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65125 | 65141 | 65151 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65142 | 65142 | 65142 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65143 | 65153 | 65143 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65154 | 65195 | 65193 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65196 | 65231 | 65229 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65232 | 65236 | 65249 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65237 | 65251 | 65244 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 65252 | 65257 | 65255 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65258 | 65273 | 65272 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 65274 | 65341 | 65339 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 65342 | 65352 | 65350 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 65353 | 65372 | 65407 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 65373 | 65389 | 65384 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65390 | 65409 | 65390 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65410 | 65445 | 65443 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65446 | 65460 | 65499 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65461 | 65471 | 65461 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65472 | 65501 | 65480 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65502 | 65516 | 65558 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65517 | 65530 | 65520 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65531 | 65560 | 65539 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65561 | 65579 | 65577 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65580 | 65598 | 65596 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65599 | 65687 | 65685 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65688 | 65710 | 65708 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65711 | 65776 | 65763 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 65777 | 65812 | 65805 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65813 | 65836 | 65831 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65837 | 65872 | 65868 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65873 | 65903 | 65895 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65904 | 65927 | 65935 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 65928 | 65945 | 65932 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65946 | 65979 | 65977 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65980 | 66036 | 66031 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66037 | 66091 | 66086 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66092 | 66120 | 66118 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 66121 | 66140 | 66138 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 66141 | 66146 | 66144 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66147 | 66156 | 66154 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66157 | 66179 | 66177 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66180 | 66203 | 66202 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66204 | 66225 | 66223 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66226 | 66353 | 66352 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66354 | 66375 | 66373 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 66376 | 66436 | 66429 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66437 | 66483 | 66482 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66484 | 66507 | 66506 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66508 | 66571 | 66569 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66572 | 66664 | 66662 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66665 | 66774 | 66792 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66775 | 66794 | 66775 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66795 | 66822 | 66820 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66823 | 66851 | 66850 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66852 | 66861 | 66859 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66862 | 66905 | 66903 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66906 | 66921 | 66920 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66922 | 66953 | 66952 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66954 | 67013 | 67009 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67014 | 67068 | 67064 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67069 | 67094 | 67093 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67095 | 67098 | 67128 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67099 | 67129 | 67099 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 67130 | 67183 | 67181 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67184 | 67192 | 67201 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67193 | 67193 | 67193 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67194 | 67203 | 67194 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67204 | 67215 | 67213 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67216 | 67224 | 67222 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 67225 | 67236 | 67234 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67237 | 67242 | 67240 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 67243 | 67253 | 67251 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67254 | 67259 | 67257 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67260 | 67267 | 67265 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67268 | 67306 | 67304 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67307 | 67333 | 67328 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67334 | 67462 | 67457 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67463 | 67488 | 67708 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67489 | 67716 | 67494 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 67717 | 67724 | 67723 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67725 | 67735 | 67734 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 67736 | 67769 | 67768 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67770 | 67792 | 67791 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67793 | 67797 | 67796 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67798 | 67803 | 67801 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67804 | 67826 | 67824 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67827 | 67843 | 67832 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67844 | 67852 | 67867 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67853 | 67869 | 67853 | 17 | 1 | `formatDate` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 67870 | 67885 | 67883 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67886 | 67913 | 67911 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67914 | 67954 | 67952 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67955 | 67979 | 67977 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67980 | 68005 | 68002 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68006 | 68013 | 68011 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 68014 | 68063 | 68061 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 68064 | 68077 | 68069 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68078 | 68099 | 68116 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68100 | 68146 | 68100 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68147 | 68149 | 68186 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 68150 | 68187 | 68150 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68188 | 68305 | 68188 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68306 | 68352 | 68306 | 47 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 68353 | 68366 | 68366 | 14 | 14 | `make` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68367 | 68367 | 68367 | 1 | 1 | `segments` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68368 | 68399 | 68368 | 32 | 1 | `intersections` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68400 | 68453 | 68415 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68454 | 68481 | 68475 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68482 | 68491 | 68485 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68492 | 68497 | 68495 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68498 | 68563 | 68561 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68564 | 68577 | 68575 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68578 | 68585 | 68583 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68586 | 68641 | 68639 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68642 | 68661 | 68659 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68662 | 68668 | 68666 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68669 | 68709 | 68704 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 68710 | 68720 | 68717 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 68721 | 68729 | 68728 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68730 | 68775 | 68885 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68776 | 68887 | 68792 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68888 | 68932 | 68997 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68933 | 68954 | 68933 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68955 | 68965 | 68955 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68966 | 69000 | 68966 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69001 | 69004 | 69003 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69005 | 69095 | 69089 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 69096 | 69109 | 69107 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 69110 | 69117 | 69115 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69118 | 69315 | 69356 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 69316 | 69362 | 69316 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69363 | 69431 | 69429 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69432 | 69463 | 69461 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69464 | 69474 | 69472 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69475 | 69499 | 69493 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69500 | 69524 | 69522 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69525 | 69553 | 69551 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69554 | 69562 | 69560 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69563 | 69579 | 69577 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69580 | 69598 | 69596 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69599 | 69604 | 69602 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69605 | 69615 | 69613 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69616 | 69634 | 69632 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69635 | 69645 | 69643 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69646 | 69655 | 69653 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69656 | 69698 | 69696 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69699 | 69750 | 69810 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69751 | 69812 | 69753 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 69813 | 69848 | 69846 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69849 | 69854 | 69900 | 6 | 52 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69855 | 69902 | 69855 | 48 | 1 | `_isoYr` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69903 | 69935 | 69933 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69936 | 69974 | 69972 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69975 | 70011 | 70009 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70012 | 70251 | 70249 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70252 | 70311 | 70465 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70312 | 70321 | 70312 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70322 | 70332 | 70322 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70333 | 70348 | 70333 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70349 | 70365 | 70349 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70366 | 70377 | 70366 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70378 | 70467 | 70378 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70468 | 70493 | 70491 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70494 | 70501 | 70664 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70502 | 70508 | 70506 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70509 | 70509 | 70529 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70510 | 70693 | 70510 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70694 | 70710 | 70703 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70711 | 70748 | 70741 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70749 | 70789 | 70783 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 70790 | 70807 | 70801 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 70808 | 70840 | 70831 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70841 | 70930 | 70921 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70931 | 71004 | 70994 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71005 | 71032 | 71026 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71033 | 71041 | 71280 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71042 | 71048 | 71046 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71049 | 71059 | 71051 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71060 | 71060 | 71060 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71061 | 71061 | 71061 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71062 | 71065 | 71062 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71066 | 71137 | 71066 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71138 | 71282 | 71138 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71283 | 71320 | 72766 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71321 | 71334 | 71332 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71335 | 71347 | 71345 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71348 | 71355 | 71353 | 8 | 6 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 71356 | 71363 | 71361 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 71364 | 71374 | 71372 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 71375 | 71846 | 71385 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71847 | 71936 | 71851 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71937 | 72178 | 71943 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 72179 | 72254 | 72179 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72255 | 72255 | 72255 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72256 | 72304 | 72256 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72305 | 72544 | 72318 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72545 | 72768 | 72545 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72769 | 72775 | 72773 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72776 | 72780 | 72779 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 72781 | 72955 | 73755 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 72956 | 72963 | 72956 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72964 | 73412 | 72964 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73413 | 73666 | 73413 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73667 | 73678 | 73670 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73679 | 73757 | 73681 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73758 | 73759 | 73905 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73760 | 73861 | 73760 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73862 | 73873 | 73865 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73874 | 73879 | 73878 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 73880 | 73906 | 73880 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73907 | 73957 | 74220 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 73958 | 73958 | 73958 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73959 | 73959 | 73959 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73960 | 73960 | 73960 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73961 | 73963 | 73961 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73964 | 74045 | 73964 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74046 | 74046 | 74046 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 74047 | 74222 | 74047 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74223 | 74223 | 74279 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74224 | 74281 | 74224 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74282 | 74282 | 74294 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74283 | 74296 | 74283 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74297 | 74315 | 74313 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74316 | 74337 | 74335 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74338 | 74347 | 74345 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74348 | 74363 | 74361 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74364 | 74372 | 74526 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74373 | 74528 | 74375 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74529 | 74549 | 74547 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74550 | 74566 | 74593 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74567 | 74570 | 74567 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 74571 | 74595 | 74571 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 74596 | 74604 | 74638 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74605 | 74639 | 74605 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 74640 | 74667 | 74666 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74668 | 74705 | 74704 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74706 | 74710 | 74708 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74711 | 74728 | 74719 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74729 | 74834 | 74739 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74835 | 75366 | 74840 | 532 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75367 | 75415 | 75413 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 75416 | 75465 | 75421 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75466 | 75483 | 75481 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75484 | 75584 | 75582 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75585 | 75595 | 75591 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75596 | 75646 | 75674 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75647 | 75677 | 75650 | 31 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75678 | 75687 | 75700 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75688 | 75703 | 75688 | 16 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75704 | 75824 | 75820 | 121 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75825 | 75969 | 75968 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75970 | 75987 | 75977 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 75988 | 76023 | 76017 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 76024 | 76101 | 76090 | 78 | 67 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76102 | 76155 | 76153 | 54 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76156 | 76160 | 76158 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 76161 | 76189 | 76188 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 76190 | 76214 | 76243 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76215 | 76218 | 76218 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76219 | 76244 | 76219 | 26 | 1 | `values` | const arrow | — | refs:72 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76245 | 76274 | 76299 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76275 | 76275 | 76275 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76276 | 76300 | 76276 | 25 | 1 | `values` | const arrow | — | refs:72 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76301 | 76330 | 76356 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76331 | 76331 | 76331 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76332 | 76357 | 76332 | 26 | 1 | `values` | const arrow | — | refs:72 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76358 | 76387 | 76413 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76388 | 76388 | 76388 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76389 | 76414 | 76389 | 26 | 1 | `values` | const arrow | — | refs:72 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76415 | 76426 | 76523 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76427 | 76474 | 76455 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76475 | 76484 | 76475 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76485 | 76485 | 76485 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76486 | 76525 | 76486 | 40 | 1 | `values` | const arrow | — | refs:72 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76526 | 76536 | 76535 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76537 | 76606 | 76596 | 70 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76607 | 76631 | 76629 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76632 | 76646 | 76644 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76647 | 76669 | 76667 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76670 | 76691 | 76689 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76692 | 76702 | 76700 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76703 | 76707 | 76705 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76708 | 76712 | 76710 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76713 | 76720 | 76718 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76721 | 76738 | 76732 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76739 | 76750 | 76744 | 12 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76751 | 76795 | 76791 | 45 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76796 | 77011 | 77009 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77012 | 77034 | 77032 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 77035 | 77046 | 77105 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77047 | 77049 | 77047 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77050 | 77111 | 77050 | 62 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77112 | 77188 | 77269 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77189 | 77216 | 77189 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77217 | 77230 | 77217 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77231 | 77244 | 77231 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 77245 | 77258 | 77245 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77259 | 77271 | 77259 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77272 | 77319 | 77307 | 48 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77320 | 77359 | 77346 | 40 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 77360 | 77394 | 77386 | 35 | 27 | `exportCrashesToCSV` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 77395 | 77409 | 77403 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77410 | 77451 | 78066 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77452 | 77463 | 77462 | 12 | 11 | `addFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 77464 | 77475 | 77474 | 12 | 11 | `drawMiniHeader` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 77476 | 77488 | 77487 | 13 | 12 | `drawSectionHeader` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 77489 | 77496 | 77495 | 8 | 7 | `addNewPage` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 77497 | 77692 | 77503 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 77693 | 77824 | 77702 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77825 | 77898 | 77828 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77899 | 77907 | 77899 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77908 | 77967 | 77912 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77968 | 78002 | 77971 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78003 | 78003 | 78003 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78004 | 78073 | 78004 | 70 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78074 | 78103 | 78101 | 30 | 28 | `runSafetyDataCheck` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78104 | 78112 | 78110 | 9 | 7 | `sfAddCheck` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 78113 | 78155 | 78153 | 43 | 41 | `sfCheckSeverityTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78156 | 78189 | 78187 | 34 | 32 | `sfCheckEPDOCalculations` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 78190 | 78234 | 78232 | 45 | 43 | `sfCheckCategorySums` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78235 | 78267 | 78265 | 33 | 31 | `sfCheckLocationTableConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78268 | 78398 | 78396 | 131 | 129 | `sfCheckCrossAnalysisConsistency` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 78399 | 78471 | 78469 | 73 | 71 | `sfCheckFilterConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78472 | 78618 | 78626 | 147 | 155 | `sfCheckDetailPanelAccuracy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78619 | 78628 | 78619 | 10 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78629 | 78669 | 78667 | 41 | 39 | `sfCheckPercentageDenominators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78670 | 78682 | 78747 | 13 | 78 | `displaySafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78683 | 78704 | 78683 | 22 | 1 | `statusIcon` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 78705 | 78705 | 78705 | 1 | 1 | `catPassed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78706 | 78706 | 78706 | 1 | 1 | `catFailed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78707 | 78708 | 78707 | 2 | 1 | `catWarn` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78709 | 78749 | 78709 | 41 | 1 | `catName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78750 | 78772 | 78766 | 23 | 17 | `exportSafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78773 | 78826 | 78825 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 78827 | 78843 | 78842 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78844 | 78850 | 78860 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78851 | 78872 | 78851 | 22 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78873 | 78891 | 78888 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78892 | 78922 | 78919 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 78923 | 79269 | 79260 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79270 | 79281 | 79332 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79282 | 79291 | 79287 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 79292 | 79302 | 79302 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 79303 | 79307 | 79307 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79308 | 79338 | 79321 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79339 | 79418 | 79409 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79419 | 79422 | 79499 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 79423 | 79426 | 79423 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 79427 | 79500 | 79446 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 79501 | 79536 | 79535 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79537 | 79544 | 79543 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79545 | 79843 | 79842 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 79844 | 79885 | 79879 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 79886 | 79932 | 79925 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79933 | 79935 | 79947 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79936 | 79948 | 79936 | 13 | 1 | `entries` | const arrow | — | refs:276 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79949 | 79951 | 79963 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79952 | 79964 | 79952 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79965 | 79967 | 79979 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79968 | 79980 | 79968 | 13 | 1 | `entries` | const arrow | — | refs:276 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79981 | 79983 | 79995 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79984 | 79996 | 79984 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79997 | 79999 | 80011 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80000 | 80012 | 80000 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
