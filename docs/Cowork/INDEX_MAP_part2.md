# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-20 · source `app/index.html` (131696 lines)

Declarations in this part: **1087**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40004 | 40013 | 40022 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 40014 | 40028 | 40014 | 15 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 40029 | 40038 | 40047 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40039 | 40049 | 40039 | 11 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 40050 | 40065 | 40057 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40066 | 40068 | 40084 | 3 | 19 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 40069 | 40077 | 40074 | 9 | 6 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40078 | 40089 | 40081 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40090 | 40143 | 40178 | 54 | 89 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40144 | 40185 | 40147 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 40186 | 40197 | 40307 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40198 | 40309 | 40207 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40310 | 40332 | 40331 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 40333 | 40364 | 40362 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40365 | 40403 | 40399 | 39 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 40404 | 40441 | 40426 | 38 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40442 | 40451 | 40449 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 40452 | 40460 | 40459 | 9 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40461 | 40464 | 40463 | 4 | 3 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40465 | 40476 | 40475 | 12 | 11 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 40477 | 40513 | 40511 | 37 | 35 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 40514 | 40537 | 40536 | 24 | 23 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40538 | 40545 | 40544 | 8 | 7 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40546 | 40581 | 40580 | 36 | 35 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40582 | 40601 | 40600 | 20 | 19 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40602 | 40610 | 40609 | 9 | 8 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 40611 | 40629 | 40633 | 19 | 23 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40630 | 40630 | 40630 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 40631 | 40645 | 40631 | 15 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40646 | 40724 | 40718 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 40725 | 40730 | 40729 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40731 | 40741 | 40990 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 40742 | 40742 | 40742 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40743 | 40938 | 40743 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40939 | 40958 | 40982 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40959 | 40996 | 40971 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40997 | 41016 | 41025 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 41017 | 41026 | 41017 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41027 | 41173 | 41171 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41174 | 41229 | 41228 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41230 | 41307 | 41349 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 41308 | 41350 | 41311 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41351 | 41363 | 41416 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 41364 | 41417 | 41401 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41418 | 41459 | 41432 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41460 | 41509 | 41507 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 41510 | 41522 | 41520 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41523 | 41536 | 41534 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41537 | 41556 | 41554 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41557 | 41590 | 41588 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 41591 | 41608 | 41599 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41609 | 41627 | 41626 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 41628 | 41648 | 41635 | 21 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 41649 | 41695 | 41669 | 47 | 21 | `applySafetyFocusCapabilityGates` | async fn | — | refs:3 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 41696 | 41712 | 41705 | 17 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41713 | 41725 | 41717 | 13 | 5 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41726 | 41756 | 41746 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41757 | 41817 | 41782 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 41818 | 41882 | 41878 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 41883 | 41931 | 41914 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41932 | 41961 | 41953 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41962 | 42020 | 41999 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42021 | 42023 | 42067 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42024 | 42034 | 42033 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42035 | 42072 | 42048 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42073 | 42084 | 42078 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42085 | 42167 | 42160 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42168 | 42223 | 42214 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42224 | 42259 | 42253 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42260 | 42281 | 42279 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42282 | 42329 | 42291 | 48 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 42330 | 42401 | 42400 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 42402 | 42406 | 42404 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42407 | 42435 | 42433 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42436 | 42468 | 42494 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42469 | 42480 | 42471 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42481 | 42496 | 42487 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42497 | 42574 | 42572 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42575 | 42586 | 42643 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42587 | 42609 | 42589 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42610 | 42617 | 42610 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42618 | 42645 | 42618 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42646 | 42659 | 42657 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42660 | 42692 | 42684 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42693 | 42752 | 42750 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42753 | 42776 | 42774 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42777 | 42858 | 42853 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42859 | 42917 | 42898 | 59 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 42918 | 42951 | 42918 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42952 | 42975 | 42952 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42976 | 42993 | 42979 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42994 | 43021 | 42994 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43022 | 43023 | 43022 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43024 | 43024 | 43024 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43025 | 43039 | 43025 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43040 | 43058 | 43043 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43059 | 43083 | 43079 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 43084 | 43097 | 43093 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43098 | 43101 | 43116 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 43102 | 43102 | 43102 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43103 | 43127 | 43103 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43128 | 43173 | 43158 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 43174 | 43348 | 43402 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43349 | 43404 | 43349 | 56 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43405 | 43408 | 43407 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43409 | 43415 | 43414 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43416 | 43444 | 43443 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43445 | 43445 | 43460 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43446 | 43451 | 43448 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43452 | 43452 | 43452 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43453 | 43455 | 43453 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43456 | 43469 | 43456 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43470 | 43491 | 43550 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43492 | 43504 | 43494 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43505 | 43551 | 43511 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43552 | 43556 | 43613 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43557 | 43579 | 43559 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43580 | 43580 | 43580 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43581 | 43584 | 43581 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43585 | 43614 | 43585 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43615 | 43624 | 43623 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 43625 | 43663 | 43662 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43664 | 43692 | 43685 | 29 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 43693 | 43753 | 43751 | 61 | 59 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43754 | 43773 | 43805 | 20 | 52 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 43774 | 43807 | 43774 | 34 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43808 | 43889 | 43887 | 82 | 80 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43890 | 43936 | 43934 | 47 | 45 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43937 | 44018 | 44015 | 82 | 79 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44019 | 44026 | 44075 | 8 | 57 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44027 | 44077 | 44040 | 51 | 14 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 44078 | 44090 | 44117 | 13 | 40 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44091 | 44104 | 44103 | 14 | 13 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44105 | 44119 | 44107 | 15 | 3 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44120 | 44130 | 44128 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44131 | 44145 | 44143 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44146 | 44154 | 44163 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44155 | 44166 | 44155 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44167 | 44171 | 44169 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 44172 | 44188 | 44186 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44189 | 44199 | 44197 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44200 | 44212 | 44210 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44213 | 44228 | 44227 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44229 | 44292 | 44233 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44293 | 44406 | 44404 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44407 | 44415 | 44414 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44416 | 44426 | 44425 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44427 | 44443 | 44442 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44444 | 44469 | 44468 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44470 | 44475 | 44474 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44476 | 44486 | 44485 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44487 | 44496 | 44495 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44497 | 44503 | 44502 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44504 | 44533 | 44532 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44534 | 44562 | 44561 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44563 | 44577 | 44576 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44578 | 44607 | 44599 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44608 | 44617 | 44613 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44618 | 44625 | 44621 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44626 | 44638 | 44634 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44639 | 44682 | 44678 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44683 | 44692 | 44688 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44693 | 44728 | 44724 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44729 | 44739 | 44735 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44740 | 44780 | 44776 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44781 | 44791 | 44787 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44792 | 44817 | 44816 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44818 | 44860 | 44859 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44861 | 44915 | 44902 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 44916 | 44936 | 44935 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 44937 | 44955 | 44951 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44956 | 44981 | 44977 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44982 | 45042 | 45041 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45043 | 45128 | 45165 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45129 | 45129 | 45129 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45130 | 45137 | 45130 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45138 | 45166 | 45138 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45167 | 45184 | 45183 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45185 | 45203 | 45202 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 45204 | 45210 | 45209 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45211 | 45217 | 45216 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45218 | 45225 | 45224 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45226 | 45272 | 45271 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 45273 | 45325 | 45320 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45326 | 45490 | 45489 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45491 | 45494 | 45493 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 45495 | 45513 | 45592 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 45514 | 45595 | 45520 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45596 | 45609 | 45727 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 45610 | 45640 | 45616 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45641 | 45645 | 45641 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45646 | 45649 | 45648 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45650 | 45650 | 45650 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45651 | 45729 | 45651 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45730 | 45743 | 45863 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 45744 | 45774 | 45750 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45775 | 45789 | 45775 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45790 | 45790 | 45790 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45791 | 45865 | 45791 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45866 | 45892 | 45942 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 45893 | 45945 | 45893 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45946 | 46112 | 46110 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 46113 | 46119 | 46117 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46120 | 46123 | 46180 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46124 | 46141 | 46124 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46142 | 46144 | 46142 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46145 | 46153 | 46145 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46154 | 46182 | 46154 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46183 | 46231 | 46229 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46232 | 46236 | 46234 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46237 | 46241 | 46239 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 46242 | 46281 | 46279 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 46282 | 46302 | 46301 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 46303 | 46314 | 46313 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46315 | 46326 | 46366 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46327 | 46342 | 46341 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46343 | 46394 | 46343 | 52 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46395 | 46399 | 46685 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46400 | 46407 | 46405 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46408 | 46615 | 46413 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46616 | 46686 | 46621 | 71 | 6 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 46687 | 46713 | 46711 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46714 | 46731 | 47959 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 46732 | 46746 | 46744 | 15 | 13 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 46747 | 46763 | 46761 | 17 | 15 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 46764 | 46774 | 46772 | 11 | 9 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 46775 | 46806 | 46804 | 32 | 30 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 46807 | 46826 | 46824 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46827 | 46909 | 46837 | 83 | 11 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 46910 | 46989 | 46910 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46990 | 47134 | 46990 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47135 | 47179 | 47139 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47180 | 47261 | 47189 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47262 | 47462 | 47262 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47463 | 48005 | 47463 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48006 | 48027 | 48023 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 48028 | 48036 | 48032 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48037 | 48206 | 48130 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48207 | 48222 | 48216 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48223 | 48239 | 48232 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48240 | 48249 | 48242 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48250 | 48276 | 48270 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48277 | 48289 | 48283 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48290 | 48307 | 48389 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48308 | 48324 | 48318 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48325 | 48395 | 48325 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48396 | 48406 | 48400 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48407 | 48438 | 48432 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48439 | 48457 | 48452 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48458 | 48478 | 48471 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48479 | 48525 | 48519 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 48526 | 48599 | 48594 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48600 | 48676 | 48669 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48677 | 48711 | 48706 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 48712 | 49039 | 49035 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49040 | 49139 | 49135 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 49140 | 49140 | 49204 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49141 | 49163 | 49142 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49164 | 49208 | 49164 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49209 | 49296 | 49292 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49297 | 49297 | 49365 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49298 | 49369 | 49299 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49370 | 49387 | 49382 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49388 | 49401 | 49397 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49402 | 49511 | 49507 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49512 | 49532 | 49564 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49533 | 49568 | 49533 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49569 | 49592 | 49588 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49593 | 49608 | 49604 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 49609 | 49615 | 49641 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49616 | 49633 | 49632 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49634 | 49645 | 49634 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49646 | 49678 | 49709 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49679 | 49712 | 49689 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49713 | 49735 | 49733 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49736 | 49754 | 49752 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49755 | 49765 | 49763 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49766 | 49783 | 49781 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49784 | 49791 | 49789 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49792 | 49839 | 49829 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49840 | 49858 | 50025 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 49859 | 49861 | 49864 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49862 | 49919 | 49862 | 58 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49920 | 49925 | 49925 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 49926 | 49984 | 49932 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49985 | 50007 | 49989 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 50008 | 50027 | 50008 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50028 | 50085 | 50236 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50086 | 50238 | 50086 | 153 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50239 | 50279 | 50277 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50280 | 50296 | 50294 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50297 | 50505 | 50503 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50506 | 50528 | 50526 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 50529 | 50538 | 50596 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50539 | 50541 | 50539 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50542 | 50598 | 50542 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50599 | 50616 | 50614 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50617 | 50669 | 50750 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50670 | 50697 | 50670 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50698 | 50711 | 50698 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50712 | 50725 | 50712 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 50726 | 50739 | 50726 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50740 | 50752 | 50740 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50753 | 50757 | 50797 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50758 | 50768 | 50758 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50769 | 50799 | 50775 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50800 | 50837 | 50835 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50838 | 50881 | 50884 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50882 | 50885 | 50882 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50886 | 50909 | 51286 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 50910 | 51044 | 50927 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51045 | 51146 | 51063 | 102 | 19 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 51147 | 51287 | 51156 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51288 | 51298 | 51296 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51299 | 51305 | 51304 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51306 | 51322 | 51309 | 17 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 51323 | 51352 | 51343 | 30 | 21 | `updateAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 51353 | 51398 | 51463 | 46 | 111 | `switchAnalysisSubtab` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 51399 | 51407 | 51399 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51408 | 51470 | 51408 | 63 | 1 | `months` | const arrow | — | refs:118 | Unassigned | `app/modules/app/unassigned.js` |
| 51471 | 51487 | 51471 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51488 | 51522 | 51521 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51523 | 51551 | 51539 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51552 | 51576 | 51575 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51577 | 51623 | 51609 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51624 | 51643 | 51642 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 51644 | 51648 | 51647 | 5 | 4 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51649 | 51724 | 51684 | 76 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51725 | 51762 | 51754 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51763 | 51776 | 51771 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51777 | 51819 | 51815 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51820 | 51844 | 51840 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 51845 | 51878 | 51849 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51879 | 51897 | 51889 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51898 | 51924 | 51917 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 51925 | 51948 | 51939 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 51949 | 51973 | 51966 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51974 | 51983 | 51999 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 51984 | 51994 | 51988 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51995 | 51995 | 51995 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51996 | 52007 | 51996 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52008 | 52023 | 52017 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52024 | 52024 | 52056 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 52025 | 52036 | 52030 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52037 | 52048 | 52041 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52049 | 52063 | 52052 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52064 | 52235 | 52064 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 52236 | 52250 | 52244 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 52251 | 52263 | 52258 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 52264 | 52282 | 52356 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52283 | 52362 | 52283 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52363 | 52364 | 52380 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52365 | 52384 | 52369 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52385 | 52402 | 52398 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52403 | 52412 | 52479 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52413 | 52456 | 52413 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52457 | 52483 | 52457 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52484 | 52493 | 52509 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 52494 | 52513 | 52497 | 20 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52514 | 52514 | 52527 | 1 | 14 | `exportPedCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52515 | 52531 | 52517 | 17 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52532 | 52532 | 52545 | 1 | 14 | `exportBikeCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 52533 | 52549 | 52535 | 17 | 3 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52550 | 52550 | 52561 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 52551 | 52565 | 52551 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52566 | 52588 | 52584 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 52589 | 52605 | 52601 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 52606 | 52618 | 52638 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 52619 | 52650 | 52625 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 52651 | 52679 | 52674 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 52680 | 52716 | 52714 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 52717 | 52727 | 52726 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 52728 | 52756 | 52748 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 52757 | 52857 | 52998 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 52858 | 52878 | 52858 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52879 | 52879 | 52879 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52880 | 52880 | 52880 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52881 | 52882 | 52881 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52883 | 52924 | 52883 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52925 | 53006 | 52925 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53007 | 53042 | 53036 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 53043 | 53044 | 53066 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 53045 | 53067 | 53052 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53068 | 53211 | 53168 | 144 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 53212 | 53218 | 53217 | 7 | 6 | `setPedViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53219 | 53222 | 53264 | 4 | 46 | `exportPedDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53223 | 53261 | 53223 | 39 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53262 | 53265 | 53262 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53266 | 53294 | 53576 | 29 | 311 | `exportPedDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53295 | 53317 | 53295 | 23 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53318 | 53321 | 53318 | 4 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53322 | 53340 | 53339 | 19 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 53341 | 53518 | 53352 | 178 | 12 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 53519 | 53577 | 53528 | 59 | 10 | `compData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53578 | 53581 | 53589 | 4 | 12 | `exportPedDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53582 | 53585 | 53582 | 4 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53586 | 53590 | 53586 | 5 | 1 | `description` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53591 | 53614 | 53617 | 24 | 27 | `exportPedLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53615 | 53618 | 53615 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53619 | 53642 | 53840 | 24 | 222 | `exportPedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53643 | 53765 | 53660 | 123 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 53766 | 53845 | 53779 | 80 | 14 | `tableBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53846 | 53852 | 53851 | 7 | 6 | `setBikeViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53853 | 53856 | 53898 | 4 | 46 | `exportBikeDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53857 | 53895 | 53857 | 39 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53896 | 53899 | 53896 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53900 | 53928 | 54210 | 29 | 311 | `exportBikeDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53929 | 53951 | 53929 | 23 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53952 | 53955 | 53952 | 4 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53956 | 53974 | 53973 | 19 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 53975 | 54152 | 53986 | 178 | 12 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 54153 | 54211 | 54162 | 59 | 10 | `compData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54212 | 54215 | 54223 | 4 | 12 | `exportBikeDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54216 | 54219 | 54216 | 4 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54220 | 54224 | 54220 | 5 | 1 | `description` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54225 | 54248 | 54251 | 24 | 27 | `exportBikeLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54249 | 54252 | 54249 | 4 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54253 | 54276 | 54474 | 24 | 222 | `exportBikeLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54277 | 54399 | 54294 | 123 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 54400 | 54475 | 54413 | 76 | 14 | `tableBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54476 | 54505 | 54503 | 30 | 28 | `updateBikeLocationTypeChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54506 | 54506 | 54506 | 1 | 1 | `updatePedLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54507 | 54507 | 54507 | 1 | 1 | `updateBikeLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54508 | 54508 | 54508 | 1 | 1 | `clearPedDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54509 | 54511 | 54509 | 3 | 1 | `clearBikeDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54512 | 54522 | 54521 | 11 | 10 | `jumpToCMFFromPedBike` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54523 | 54556 | 54555 | 34 | 33 | `zoomToPedBikeLocation` | fn | — | refs:4 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 54557 | 54615 | 54614 | 59 | 58 | `filterMapForPedBike` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 54616 | 54649 | 54710 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54650 | 54728 | 54650 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54729 | 54781 | 55201 | 53 | 473 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54782 | 54788 | 54782 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 54789 | 54812 | 54789 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 54813 | 54862 | 54816 | 50 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 54863 | 54863 | 54863 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54864 | 54864 | 54864 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54865 | 54897 | 54865 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54898 | 54925 | 54902 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54926 | 54927 | 54936 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 54928 | 54991 | 54928 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54992 | 54998 | 54998 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54999 | 55004 | 55004 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55005 | 55040 | 55019 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55041 | 55102 | 55041 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55103 | 55209 | 55103 | 107 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55210 | 55213 | 55329 | 4 | 120 | `renderPedBikeLocationsFromMatview` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 55214 | 55217 | 55214 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 55218 | 55242 | 55241 | 25 | 24 | `_hydrate` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 55243 | 55336 | 55287 | 94 | 45 | `_paintLocTypePie` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55337 | 55342 | 55385 | 6 | 49 | `renderPedBikeComparisonTableFromCats` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 55343 | 55386 | 55343 | 44 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 55387 | 55481 | 55595 | 95 | 209 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 55482 | 55500 | 55482 | 19 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55501 | 55501 | 55501 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55502 | 55502 | 55502 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55503 | 55556 | 55503 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55557 | 55557 | 55576 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 55558 | 55598 | 55558 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55599 | 55636 | 55635 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55637 | 55649 | 55724 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 55650 | 55732 | 55653 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 55733 | 55739 | 55738 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55740 | 55819 | 55818 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55820 | 55826 | 55825 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55827 | 55835 | 55865 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55836 | 55866 | 55836 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 55867 | 55916 | 55915 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55917 | 55934 | 55933 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55935 | 55991 | 55962 | 57 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55992 | 56100 | 56208 | 109 | 217 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56101 | 56209 | 56101 | 109 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 56210 | 56226 | 56225 | 17 | 16 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56227 | 56243 | 56275 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56244 | 56264 | 56244 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56265 | 56276 | 56269 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 56277 | 56321 | 56320 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56322 | 56340 | 56339 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56341 | 56371 | 56385 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56372 | 56386 | 56375 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 56387 | 56423 | 56422 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56424 | 56441 | 56449 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56442 | 56450 | 56442 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56451 | 56466 | 56486 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56467 | 56473 | 56467 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56474 | 56487 | 56474 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56488 | 56525 | 56581 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56526 | 56582 | 56526 | 57 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56583 | 56633 | 56790 | 51 | 208 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56634 | 56634 | 56634 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56635 | 56671 | 56635 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56672 | 56703 | 56677 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56704 | 56791 | 56704 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56792 | 56825 | 56872 | 34 | 81 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56826 | 56873 | 56830 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56874 | 56883 | 56882 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56884 | 56894 | 56893 | 11 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56895 | 56939 | 56938 | 45 | 44 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56940 | 56997 | 56986 | 58 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56998 | 57009 | 57164 | 12 | 167 | `generateComprehensiveReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57010 | 57165 | 57013 | 156 | 4 | `updateProgress` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 57166 | 57179 | 57178 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57180 | 57197 | 57196 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57198 | 57222 | 57221 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 57223 | 57223 | 57239 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57224 | 57240 | 57224 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57241 | 57254 | 57253 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57255 | 57268 | 57267 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57269 | 57319 | 57317 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 57320 | 57360 | 57358 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57361 | 57427 | 57464 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57428 | 57430 | 57428 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 57431 | 57437 | 57435 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57438 | 57466 | 57444 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57467 | 57488 | 57498 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57489 | 57500 | 57491 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57501 | 57516 | 57514 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 57517 | 57523 | 57521 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57524 | 57536 | 57534 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 57537 | 57539 | 57549 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57540 | 57550 | 57543 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57551 | 57552 | 57562 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57553 | 57558 | 57553 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57559 | 57563 | 57559 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57564 | 57615 | 57614 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 57616 | 57641 | 58149 | 26 | 534 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57642 | 57657 | 57655 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57658 | 57665 | 57663 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57666 | 57672 | 57670 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 57673 | 57682 | 57680 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57683 | 57720 | 57718 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57721 | 57721 | 57744 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57722 | 57746 | 57722 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57747 | 57747 | 57792 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57748 | 57800 | 57748 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57801 | 58150 | 57806 | 350 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 58151 | 58160 | 58159 | 10 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58161 | 58183 | 58718 | 23 | 558 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58184 | 58200 | 58199 | 17 | 16 | `addText` | const arrow | — | refs:148 | Unassigned | `app/modules/app/unassigned.js` |
| 58201 | 58201 | 58201 | 1 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 58202 | 58204 | 58202 | 3 | 1 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 58205 | 58239 | 58231 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58240 | 58242 | 58240 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58243 | 58251 | 58249 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58252 | 58438 | 58262 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58439 | 58447 | 58439 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58448 | 58499 | 58448 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58500 | 58542 | 58500 | 43 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58543 | 58598 | 58543 | 56 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58599 | 58682 | 58599 | 84 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58683 | 58719 | 58683 | 37 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58720 | 58728 | 58727 | 9 | 8 | `hexToRgb` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 58729 | 58742 | 59050 | 14 | 322 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58743 | 59052 | 58743 | 310 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59053 | 59167 | 59162 | 115 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59168 | 59230 | 59403 | 63 | 236 | `generateCountermeasuresReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59231 | 59300 | 59231 | 70 | 1 | `topTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59301 | 59316 | 59301 | 16 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 59317 | 59323 | 59321 | 7 | 5 | `topCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59324 | 59324 | 59324 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59325 | 59404 | 59325 | 80 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59405 | 59408 | 59407 | 4 | 3 | `generateIntersectionReport` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 59409 | 59434 | 59425 | 26 | 17 | `generateHotspotReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 59435 | 59460 | 59589 | 26 | 155 | `generateDashboardReport` | fn | — | refs:2 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 59461 | 59461 | 59461 | 1 | 1 | `nightCount` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 59462 | 59490 | 59462 | 29 | 1 | `speedCount` | const arrow | — | refs:82 | Unassigned | `app/modules/app/unassigned.js` |
| 59491 | 59528 | 59497 | 38 | 7 | `sevRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59529 | 59529 | 59529 | 1 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59530 | 59549 | 59536 | 20 | 7 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59550 | 59594 | 59550 | 45 | 1 | `intCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59595 | 59631 | 59729 | 37 | 135 | `generateCrashTreeSystemicReport` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 59632 | 59653 | 59635 | 22 | 4 | `facilityRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59654 | 59667 | 59657 | 14 | 4 | `collisionRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59668 | 59668 | 59668 | 1 | 1 | `topFacilities` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59669 | 59678 | 59669 | 10 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59679 | 59679 | 59679 | 1 | 1 | `matrixHeader` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59680 | 59680 | 59687 | 1 | 8 | `matrixRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59681 | 59706 | 59685 | 26 | 5 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59707 | 59707 | 59707 | 1 | 1 | `topCombos` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59708 | 59734 | 59710 | 27 | 3 | `comboRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59735 | 59745 | 59985 | 11 | 251 | `generateFatalSpeedReport` | async fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 59746 | 59746 | 59746 | 1 | 1 | `fatalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59747 | 59747 | 59747 | 1 | 1 | `speedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59748 | 59870 | 59748 | 123 | 1 | `fatalSpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59871 | 59990 | 59871 | 120 | 1 | `topFatalRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59991 | 60028 | 60088 | 38 | 98 | `generateHotspotRankingReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60029 | 60029 | 60029 | 1 | 1 | `routeRanking` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60030 | 60030 | 60030 | 1 | 1 | `nodeRanking` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60031 | 60042 | 60031 | 12 | 1 | `combined` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60043 | 60056 | 60046 | 14 | 4 | `rankRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60057 | 60069 | 60059 | 13 | 3 | `routeRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60070 | 60070 | 60070 | 1 | 1 | `routeTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60071 | 60094 | 60071 | 24 | 1 | `nodeTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60095 | 60099 | 60225 | 5 | 131 | `generateBeforeAfterStudyReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60100 | 60104 | 60104 | 5 | 5 | `fmtBA` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60105 | 60178 | 60114 | 74 | 10 | `parseBALocal` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 60179 | 60230 | 60185 | 52 | 7 | `compRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60231 | 60284 | 60333 | 54 | 103 | `generateGrantSupportReport` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 60285 | 60355 | 60288 | 71 | 4 | `locRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60356 | 60404 | 60400 | 49 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60405 | 60485 | 60481 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60486 | 60586 | 60582 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60587 | 60604 | 60679 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60605 | 60683 | 60605 | 79 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60684 | 60690 | 60769 | 7 | 86 | `generatePedBikeWordMemo` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 60691 | 60691 | 60691 | 1 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60692 | 60773 | 60692 | 82 | 1 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60774 | 60920 | 60894 | 147 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60921 | 60942 | 60940 | 22 | 20 | `switchBAMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60943 | 60949 | 60947 | 7 | 5 | `setBatchBAAnalysisType` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 60950 | 60960 | 60958 | 11 | 9 | `initBALocationDropdown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 60961 | 61009 | 61006 | 49 | 46 | `updateBALocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61010 | 61075 | 61073 | 66 | 64 | `filterBALocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61076 | 61083 | 61081 | 8 | 6 | `handleBASearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61084 | 61101 | 61124 | 18 | 41 | `triggerBASearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61102 | 61109 | 61102 | 8 | 1 | `matchingRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61110 | 61126 | 61112 | 17 | 3 | `matchingNode` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61127 | 61158 | 61156 | 32 | 30 | `selectBASearchResult` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61159 | 61206 | 61204 | 48 | 46 | `loadBALocation` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 61207 | 61213 | 61211 | 7 | 5 | `getMatchedCrashesFromMapSelection` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 61214 | 61225 | 61223 | 12 | 10 | `computeStatsFromMapPoints` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61226 | 61270 | 61268 | 45 | 43 | `updateBALocationSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61271 | 61306 | 61305 | 36 | 35 | `selectBALocationFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61307 | 61311 | 61310 | 5 | 4 | `closeBAMapModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61312 | 61319 | 61317 | 8 | 6 | `goToMapForBASelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61320 | 61346 | 61344 | 27 | 25 | `useMapSelectionForBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61347 | 61359 | 61357 | 13 | 11 | `setBAStudyPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61360 | 61399 | 61397 | 40 | 38 | `calculateBAPeriods` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61400 | 61419 | 61417 | 20 | 18 | `updateBAPeriodDisplay` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61420 | 61445 | 61443 | 26 | 24 | `updateBAMethodInfo` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61446 | 61490 | 61482 | 45 | 37 | `resetBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61491 | 61512 | 61550 | 22 | 60 | `initBAMonitoringPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61513 | 61534 | 61513 | 22 | 1 | `el` | const arrow | — | refs:291 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61535 | 61551 | 61535 | 17 | 1 | `el` | const arrow | — | refs:291 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61552 | 61571 | 61570 | 20 | 19 | `toggleBAMonitoringEnabled` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61572 | 61585 | 61584 | 14 | 13 | `updateBAMonitoringLocationDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61586 | 61592 | 61591 | 7 | 6 | `updateBAAlertRowStyle` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 61593 | 61597 | 61596 | 5 | 4 | `toggleBAMonitorScheduleUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61598 | 61605 | 61604 | 8 | 7 | `updateBAMonitorFreqUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61606 | 61606 | 61669 | 1 | 64 | `saveBAMonitoringSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61607 | 61670 | 61607 | 64 | 1 | `el` | const arrow | — | refs:291 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61671 | 61686 | 61769 | 16 | 99 | `evaluateBAAlertConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61687 | 61710 | 61690 | 24 | 4 | `recentCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61711 | 61770 | 61715 | 60 | 5 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61771 | 61847 | 61846 | 77 | 76 | `buildBAAlertEmailHtml` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61848 | 61875 | 61949 | 28 | 102 | `sendBAMonitoringTestAlert` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61876 | 61950 | 61876 | 75 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61951 | 61980 | 61979 | 30 | 29 | `renderBAMonitoringStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61981 | 62006 | 62071 | 26 | 91 | `checkBAMonitoringOnDataLoad` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62007 | 62008 | 62007 | 2 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62009 | 62072 | 62009 | 64 | 1 | `plainText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62073 | 62082 | 62095 | 10 | 23 | `addBAMonitorSubscriber` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62083 | 62096 | 62083 | 14 | 1 | `existing` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62097 | 62103 | 62102 | 7 | 6 | `removeBAMonitorSubscriber` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62104 | 62131 | 62125 | 28 | 22 | `refreshBAMonitorSubscriberChips` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 62132 | 62152 | 62204 | 21 | 73 | `syncBAMonitoringToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62153 | 62189 | 62153 | 37 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62190 | 62208 | 62190 | 19 | 1 | `result` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62209 | 62233 | 62229 | 25 | 21 | `deleteBAMonitoringFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62234 | 62243 | 62242 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62244 | 62267 | 62266 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62268 | 62357 | 62274 | 90 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 62358 | 62397 | 62520 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 62398 | 62448 | 62402 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 62449 | 62787 | 62449 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62788 | 62850 | 62840 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 62851 | 62862 | 62998 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 62863 | 63003 | 62867 | 141 | 5 | `updateProgress` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 63004 | 63057 | 63052 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63058 | 63141 | 63136 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63142 | 63206 | 63202 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63207 | 63346 | 63341 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63347 | 63390 | 63436 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63391 | 63441 | 63413 | 51 | 23 | `updateProgress` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 63442 | 63447 | 63445 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 63448 | 63496 | 63494 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63497 | 63501 | 63499 | 5 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 63502 | 63532 | 63513 | 31 | 12 | `askMUTCDForSafetyCategory` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 63533 | 63578 | 63583 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 63579 | 63585 | 63579 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63586 | 63598 | 63596 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63599 | 63611 | 63609 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63612 | 63616 | 63614 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 63617 | 63621 | 63619 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63622 | 63632 | 63732 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63633 | 63651 | 63633 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 63652 | 63734 | 63652 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63735 | 63762 | 63761 | 28 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63763 | 63805 | 63804 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 63806 | 63822 | 63821 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63823 | 63841 | 63840 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63842 | 63850 | 63849 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 63851 | 63977 | 63976 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 63978 | 64021 | 64020 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64022 | 64079 | 64078 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 64080 | 64115 | 64114 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64116 | 64181 | 64149 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64182 | 64221 | 64219 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64222 | 64246 | 64244 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64247 | 64412 | 64260 | 166 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 64413 | 64429 | 64413 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64430 | 64445 | 64430 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64446 | 64463 | 64448 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64464 | 64482 | 64464 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64483 | 64483 | 64483 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64484 | 64501 | 64486 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64502 | 64519 | 64502 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64520 | 64540 | 64522 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64541 | 64541 | 64541 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64542 | 64559 | 64542 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64560 | 64581 | 64579 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64582 | 64599 | 64597 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64600 | 64622 | 64663 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64623 | 64623 | 64623 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64624 | 64626 | 64624 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64627 | 64627 | 64627 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64628 | 64665 | 64628 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64666 | 64687 | 64685 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64688 | 64724 | 64722 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64725 | 64770 | 64914 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64771 | 64783 | 64771 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64784 | 64795 | 64784 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64796 | 64810 | 64799 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64811 | 64916 | 64814 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64917 | 64933 | 64943 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 64934 | 64934 | 64934 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64935 | 64945 | 64935 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64946 | 64987 | 64985 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64988 | 65023 | 65021 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65024 | 65028 | 65041 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 65029 | 65043 | 65036 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 65044 | 65049 | 65047 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65050 | 65065 | 65064 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 65066 | 65133 | 65131 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 65134 | 65144 | 65142 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 65145 | 65164 | 65199 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 65165 | 65181 | 65176 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65182 | 65201 | 65182 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65202 | 65237 | 65235 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65238 | 65252 | 65291 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65253 | 65263 | 65253 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65264 | 65293 | 65272 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65294 | 65308 | 65350 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 65309 | 65322 | 65312 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65323 | 65352 | 65331 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65353 | 65371 | 65369 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65372 | 65390 | 65388 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65391 | 65479 | 65477 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65480 | 65502 | 65500 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65503 | 65568 | 65555 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 65569 | 65604 | 65597 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 65605 | 65628 | 65623 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65629 | 65664 | 65660 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65665 | 65695 | 65687 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65696 | 65719 | 65727 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 65720 | 65737 | 65724 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65738 | 65771 | 65769 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65772 | 65828 | 65823 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65829 | 65883 | 65878 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65884 | 65912 | 65910 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 65913 | 65932 | 65930 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 65933 | 65938 | 65936 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65939 | 65948 | 65946 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65949 | 65971 | 65969 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65972 | 65995 | 65994 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65996 | 66017 | 66015 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66018 | 66145 | 66144 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66146 | 66167 | 66165 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 66168 | 66228 | 66221 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66229 | 66275 | 66274 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66276 | 66299 | 66298 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66300 | 66363 | 66361 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66364 | 66456 | 66454 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66457 | 66566 | 66584 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66567 | 66586 | 66567 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66587 | 66614 | 66612 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66615 | 66643 | 66642 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66644 | 66653 | 66651 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66654 | 66697 | 66695 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66698 | 66713 | 66712 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66714 | 66745 | 66744 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66746 | 66805 | 66801 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66806 | 66860 | 66856 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66861 | 66886 | 66885 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66887 | 66890 | 66920 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66891 | 66921 | 66891 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 66922 | 66975 | 66973 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 66976 | 66984 | 66993 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66985 | 66985 | 66985 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66986 | 66995 | 66986 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66996 | 67007 | 67005 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67008 | 67016 | 67014 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 67017 | 67028 | 67026 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67029 | 67034 | 67032 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 67035 | 67045 | 67043 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67046 | 67051 | 67049 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67052 | 67059 | 67057 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67060 | 67098 | 67096 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67099 | 67125 | 67120 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67126 | 67254 | 67249 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67255 | 67280 | 67500 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67281 | 67508 | 67286 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 67509 | 67516 | 67515 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67517 | 67527 | 67526 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 67528 | 67561 | 67560 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67562 | 67584 | 67583 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67585 | 67589 | 67588 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67590 | 67595 | 67593 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 67596 | 67618 | 67616 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67619 | 67635 | 67624 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67636 | 67644 | 67659 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67645 | 67661 | 67645 | 17 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 67662 | 67677 | 67675 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67678 | 67705 | 67703 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67706 | 67746 | 67744 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67747 | 67771 | 67769 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67772 | 67797 | 67794 | 26 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 67798 | 67805 | 67803 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 67806 | 67855 | 67853 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 67856 | 67869 | 67861 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67870 | 67891 | 67908 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67892 | 67938 | 67892 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67939 | 67941 | 67978 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 67942 | 67979 | 67942 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67980 | 68097 | 67980 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68098 | 68118 | 68098 | 21 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 68119 | 68172 | 68134 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68173 | 68200 | 68194 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68201 | 68210 | 68204 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68211 | 68216 | 68214 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68217 | 68282 | 68280 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68283 | 68296 | 68294 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68297 | 68304 | 68302 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68305 | 68360 | 68358 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68361 | 68380 | 68378 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68381 | 68387 | 68385 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 68388 | 68428 | 68423 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 68429 | 68439 | 68436 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 68440 | 68448 | 68447 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68449 | 68494 | 68604 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68495 | 68606 | 68511 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68607 | 68651 | 68716 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68652 | 68673 | 68652 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68674 | 68684 | 68674 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68685 | 68719 | 68685 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68720 | 68723 | 68722 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 68724 | 68814 | 68808 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 68815 | 68828 | 68826 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 68829 | 68836 | 68834 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68837 | 69034 | 69075 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 69035 | 69081 | 69035 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69082 | 69150 | 69148 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69151 | 69182 | 69180 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69183 | 69193 | 69191 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69194 | 69218 | 69212 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69219 | 69243 | 69241 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69244 | 69272 | 69270 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69273 | 69281 | 69279 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69282 | 69298 | 69296 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69299 | 69317 | 69315 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69318 | 69323 | 69321 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69324 | 69334 | 69332 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69335 | 69353 | 69351 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69354 | 69364 | 69362 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69365 | 69374 | 69372 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69375 | 69417 | 69415 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69418 | 69469 | 69529 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69470 | 69531 | 69472 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 69532 | 69567 | 69565 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 69568 | 69620 | 69618 | 53 | 51 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69621 | 69653 | 69651 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69654 | 69692 | 69690 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69693 | 69729 | 69727 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69730 | 69969 | 69967 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69970 | 70029 | 70183 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70030 | 70039 | 70030 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70040 | 70050 | 70040 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70051 | 70066 | 70051 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70067 | 70083 | 70067 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70084 | 70095 | 70084 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70096 | 70185 | 70096 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70186 | 70211 | 70209 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70212 | 70219 | 70382 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70220 | 70226 | 70224 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70227 | 70227 | 70247 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70228 | 70411 | 70228 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70412 | 70428 | 70421 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70429 | 70466 | 70459 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70467 | 70507 | 70501 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 70508 | 70525 | 70519 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 70526 | 70558 | 70549 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70559 | 70648 | 70639 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70649 | 70722 | 70712 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70723 | 70750 | 70744 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70751 | 70759 | 70998 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70760 | 70766 | 70764 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70767 | 70777 | 70769 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70778 | 70778 | 70778 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70779 | 70779 | 70779 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70780 | 70783 | 70780 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70784 | 70855 | 70784 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70856 | 71000 | 70856 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71001 | 71038 | 72484 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71039 | 71052 | 71050 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71053 | 71065 | 71063 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71066 | 71073 | 71071 | 8 | 6 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 71074 | 71081 | 71079 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 71082 | 71092 | 71090 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 71093 | 71564 | 71103 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71565 | 71654 | 71569 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71655 | 71896 | 71661 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 71897 | 71972 | 71897 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71973 | 71973 | 71973 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71974 | 72022 | 71974 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72023 | 72262 | 72036 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72263 | 72486 | 72263 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72487 | 72493 | 72491 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72494 | 72498 | 72497 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 72499 | 72673 | 73473 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 72674 | 72681 | 72674 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72682 | 73130 | 72682 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73131 | 73384 | 73131 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73385 | 73396 | 73388 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73397 | 73475 | 73399 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73476 | 73477 | 73623 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73478 | 73579 | 73478 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73580 | 73591 | 73583 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73592 | 73597 | 73596 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 73598 | 73624 | 73598 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73625 | 73675 | 73938 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 73676 | 73676 | 73676 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73677 | 73677 | 73677 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73678 | 73678 | 73678 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73679 | 73681 | 73679 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73682 | 73763 | 73682 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73764 | 73764 | 73764 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 73765 | 73940 | 73765 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73941 | 73941 | 73997 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73942 | 73999 | 73942 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74000 | 74000 | 74012 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74001 | 74014 | 74001 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74015 | 74033 | 74031 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74034 | 74055 | 74053 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74056 | 74065 | 74063 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74066 | 74081 | 74079 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74082 | 74090 | 74244 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74091 | 74246 | 74093 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74247 | 74267 | 74265 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74268 | 74284 | 74311 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74285 | 74288 | 74285 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 74289 | 74313 | 74289 | 25 | 1 | `reasons` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 74314 | 74322 | 74356 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74323 | 74357 | 74323 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 74358 | 74385 | 74384 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74386 | 74423 | 74422 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74424 | 74428 | 74426 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74429 | 74446 | 74437 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 74447 | 74552 | 74457 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74553 | 75080 | 74558 | 528 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75081 | 75093 | 75154 | 13 | 74 | `queryCMFForSafetyCategory` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 75094 | 75118 | 75094 | 25 | 1 | `keywordList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75119 | 75134 | 75119 | 16 | 1 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75135 | 75156 | 75135 | 22 | 1 | `matchCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75157 | 75205 | 75203 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 75206 | 75255 | 75211 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75256 | 75273 | 75271 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75274 | 75374 | 75372 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75375 | 75385 | 75381 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75386 | 75436 | 75464 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75437 | 75466 | 75440 | 30 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75467 | 75543 | 75542 | 77 | 76 | `initSafetyFocus` | fn | — | refs:5 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 75544 | 75553 | 75566 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75554 | 75567 | 75554 | 14 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 75568 | 75596 | 75595 | 29 | 28 | `applySafetyFilters` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 75597 | 75604 | 75603 | 8 | 7 | `clearSafetyDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75605 | 75724 | 75721 | 120 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75725 | 75771 | 75770 | 47 | 46 | `processSafetyDataForReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75772 | 75916 | 75915 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75917 | 75934 | 75924 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 75935 | 75970 | 75964 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 75971 | 76044 | 76033 | 74 | 63 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76045 | 76096 | 76095 | 52 | 51 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76097 | 76212 | 76211 | 116 | 115 | `selectSafetyCategory` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 76213 | 76217 | 76215 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 76218 | 76246 | 76245 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 76247 | 76271 | 76300 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76272 | 76275 | 76275 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76276 | 76301 | 76276 | 26 | 1 | `values` | const arrow | — | refs:75 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76302 | 76331 | 76356 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76332 | 76332 | 76332 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76333 | 76357 | 76333 | 25 | 1 | `values` | const arrow | — | refs:75 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76358 | 76387 | 76413 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76388 | 76388 | 76388 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76389 | 76414 | 76389 | 26 | 1 | `values` | const arrow | — | refs:75 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76415 | 76444 | 76470 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76445 | 76445 | 76445 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76446 | 76471 | 76446 | 26 | 1 | `values` | const arrow | — | refs:75 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76472 | 76483 | 76580 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76484 | 76531 | 76512 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76532 | 76541 | 76532 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76542 | 76542 | 76542 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76543 | 76581 | 76543 | 39 | 1 | `values` | const arrow | — | refs:75 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76582 | 76598 | 76597 | 17 | 16 | `_safetyFocusHasCofactors` | async fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 76599 | 76609 | 76608 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76610 | 76670 | 76669 | 61 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76671 | 76713 | 76756 | 43 | 86 | `updateSafetyLocationTable` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76714 | 76757 | 76714 | 44 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76758 | 76790 | 76788 | 33 | 31 | `renderSafetyLocationRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76791 | 76801 | 76795 | 11 | 5 | `goToSafetyPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76802 | 76826 | 76824 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76827 | 76841 | 76839 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76842 | 76864 | 76862 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76865 | 76886 | 76884 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76887 | 76897 | 76895 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76898 | 76902 | 76900 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76903 | 76907 | 76905 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 76908 | 76915 | 76913 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76916 | 76933 | 76927 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76934 | 76941 | 76939 | 8 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76942 | 76980 | 76978 | 39 | 37 | `updateSfDetailPanel` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76981 | 77027 | 77214 | 47 | 234 | `aggregateSfDetailData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77028 | 77055 | 77031 | 28 | 4 | `_hasPerRow` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77056 | 77216 | 77056 | 161 | 1 | `selected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77217 | 77259 | 77257 | 43 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77260 | 77276 | 77274 | 17 | 15 | `renderSfDetailContent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77277 | 77492 | 77490 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77493 | 77515 | 77513 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 77516 | 77527 | 77586 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77528 | 77530 | 77528 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77531 | 77588 | 77531 | 58 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77589 | 77593 | 77630 | 5 | 42 | `renderSfMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77594 | 77602 | 77594 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77603 | 77632 | 77609 | 30 | 7 | `getHeatmapColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77633 | 77650 | 77648 | 18 | 16 | `initSfDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77651 | 77727 | 77808 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77728 | 77755 | 77728 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77756 | 77769 | 77756 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77770 | 77783 | 77770 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 77784 | 77797 | 77784 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77798 | 77810 | 77798 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77811 | 77848 | 77846 | 38 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77849 | 77896 | 77901 | 48 | 53 | `exportSfDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77897 | 77902 | 77897 | 6 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77903 | 77949 | 78709 | 47 | 807 | `exportSfDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77950 | 77961 | 77960 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 77962 | 77973 | 77972 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 77974 | 77986 | 77985 | 13 | 12 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 77987 | 78005 | 78004 | 19 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 78006 | 78013 | 78012 | 8 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 78014 | 78153 | 78022 | 140 | 9 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 78154 | 78256 | 78158 | 103 | 5 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78257 | 78459 | 78266 | 203 | 10 | `yearTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78460 | 78527 | 78464 | 68 | 5 | `factorTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78528 | 78528 | 78528 | 1 | 1 | `darkCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78529 | 78571 | 78529 | 43 | 1 | `adverseWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78572 | 78588 | 78572 | 17 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78589 | 78711 | 78589 | 123 | 1 | `topOverall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78712 | 78734 | 78729 | 23 | 18 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78735 | 78747 | 78746 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78748 | 78757 | 78756 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78758 | 78790 | 78784 | 33 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 78791 | 78813 | 78808 | 23 | 18 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78814 | 78826 | 78825 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78827 | 78836 | 78835 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78837 | 78869 | 78863 | 33 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 78870 | 78913 | 79647 | 44 | 778 | `exportSafetyCategoryPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78914 | 78925 | 78924 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 78926 | 78937 | 78936 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 78938 | 78950 | 78949 | 13 | 12 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 78951 | 78969 | 78968 | 19 | 18 | `drawKPI` | fn | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 78970 | 79084 | 78976 | 115 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 79085 | 79183 | 79089 | 99 | 5 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79184 | 79227 | 79192 | 44 | 9 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 79228 | 79325 | 79275 | 98 | 48 | `drawNativeHBarChart` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79326 | 79434 | 79337 | 109 | 12 | `locTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79435 | 79510 | 79444 | 76 | 10 | `yearBreakdownData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79511 | 79549 | 79514 | 39 | 4 | `monthData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79550 | 79550 | 79581 | 1 | 32 | `profileData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79551 | 79567 | 79554 | 17 | 4 | `routeEntry` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79568 | 79649 | 79568 | 82 | 1 | `topColl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79650 | 79664 | 79658 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79665 | 79706 | 80321 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79707 | 79718 | 79717 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 79719 | 79730 | 79729 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 79731 | 79743 | 79742 | 13 | 12 | `drawSectionHeader` | fn | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 79744 | 79751 | 79750 | 8 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 79752 | 79947 | 79758 | 196 | 7 | `checkPageBreak` | fn | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 79948 | 80079 | 79957 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
