# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (101803 lines)

Declarations in this part: **522**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80352 | 80372 | 80382 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80373 | 80386 | 80373 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80387 | 80419 | 80415 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80420 | 80436 | 80422 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80437 | 80513 | 80509 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 80514 | 80547 | 80543 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80548 | 80597 | 80591 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80598 | 80669 | 80662 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80670 | 80693 | 80689 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 80694 | 80710 | 80706 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 80711 | 80739 | 80730 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 80740 | 80818 | 80813 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 80819 | 80835 | 80831 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80836 | 81075 | 81071 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 81076 | 81150 | 81250 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 81151 | 81151 | 81151 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81152 | 81254 | 81152 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81255 | 81333 | 81379 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81334 | 81415 | 81334 | 82 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81416 | 81495 | 81530 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81496 | 81496 | 81496 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81497 | 81534 | 81497 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81535 | 81618 | 81816 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81619 | 81619 | 81619 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81620 | 81749 | 81620 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81750 | 81750 | 81750 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81751 | 81817 | 81751 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81818 | 81840 | 81839 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 81841 | 81989 | 81871 | 149 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 81990 | 82138 | 82118 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82139 | 82147 | 82272 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82148 | 82274 | 82148 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82275 | 82291 | 82280 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82292 | 82298 | 82296 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82299 | 82309 | 82307 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82310 | 82328 | 82323 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82329 | 82342 | 82341 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82343 | 82348 | 82347 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82349 | 82359 | 82358 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82360 | 82566 | 82565 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82567 | 82618 | 82617 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82619 | 82679 | 82678 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82680 | 82724 | 82723 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82725 | 82738 | 82737 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82739 | 82752 | 82751 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82753 | 82793 | 82792 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82794 | 82822 | 82821 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82823 | 82898 | 82871 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82899 | 82912 | 82911 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82913 | 82919 | 82918 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82920 | 82962 | 82961 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82963 | 82967 | 82966 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 82968 | 82996 | 82995 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82997 | 83029 | 83028 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83030 | 83132 | 83032 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83133 | 83379 | 83144 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 83380 | 83468 | 83380 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83469 | 83496 | 83517 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 83497 | 83525 | 83497 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83526 | 83562 | 83552 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 83563 | 83596 | 83591 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 83597 | 83621 | 83615 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 83622 | 83653 | 83648 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83654 | 83722 | 83718 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 83723 | 83774 | 83770 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 83775 | 83789 | 83785 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83790 | 83807 | 83803 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 83808 | 83825 | 83819 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 83826 | 83911 | 83860 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83912 | 83916 | 83982 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83917 | 83934 | 83917 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83935 | 83952 | 83935 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83953 | 83987 | 83953 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83988 | 84299 | 84002 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84300 | 84348 | 84300 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84349 | 84426 | 84349 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84427 | 84508 | 84504 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84509 | 84573 | 84569 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84574 | 84590 | 84586 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84591 | 84621 | 84616 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 84622 | 84688 | 84684 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84689 | 84739 | 84735 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84740 | 84754 | 84750 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84755 | 84771 | 84767 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 84772 | 84787 | 84783 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84788 | 84968 | 84822 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84969 | 84980 | 84978 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 84981 | 85494 | 84990 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85495 | 85656 | 85650 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85657 | 85706 | 85702 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 85707 | 85814 | 85807 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85815 | 85859 | 85854 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85860 | 85974 | 85968 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85975 | 86037 | 86031 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86038 | 86138 | 86134 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86139 | 86236 | 86232 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 86237 | 86247 | 86243 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 86248 | 86305 | 86301 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86306 | 86316 | 86312 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86317 | 86359 | 86355 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86360 | 86394 | 86390 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86395 | 86406 | 86402 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86407 | 86415 | 86411 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86416 | 86453 | 86449 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86454 | 86468 | 86464 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86469 | 86489 | 86485 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86490 | 86502 | 86498 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86503 | 86515 | 86511 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86516 | 86545 | 86541 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 86546 | 86566 | 86562 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86567 | 86573 | 86569 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86574 | 86624 | 86620 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86625 | 86658 | 86654 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86659 | 86678 | 86673 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86679 | 86804 | 86799 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86805 | 86868 | 86864 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86869 | 86880 | 86875 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86881 | 86910 | 86909 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86911 | 86921 | 86920 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 86922 | 86932 | 86931 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86933 | 86943 | 86942 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 86944 | 86954 | 86953 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86955 | 86962 | 86961 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 86963 | 86979 | 86974 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86980 | 86982 | 87011 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86983 | 87012 | 86989 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87013 | 87029 | 87028 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87030 | 87055 | 87054 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87056 | 87078 | 87077 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87079 | 87096 | 87095 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87097 | 87107 | 87102 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87108 | 87119 | 87118 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87120 | 87139 | 87138 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 87140 | 87174 | 87169 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 87175 | 87191 | 87190 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87192 | 87247 | 87246 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87248 | 87299 | 87298 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87300 | 87350 | 87369 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87351 | 87370 | 87353 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87371 | 87388 | 87404 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87389 | 87405 | 87389 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87406 | 87432 | 87431 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87433 | 87441 | 87476 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87442 | 87477 | 87445 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87478 | 87481 | 87491 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87482 | 87484 | 87484 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87485 | 87492 | 87489 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87493 | 87512 | 87511 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87513 | 87518 | 87541 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87519 | 87542 | 87521 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87543 | 87556 | 87555 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87557 | 87563 | 87562 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87564 | 87568 | 87567 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87569 | 87623 | 87622 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87624 | 87682 | 87681 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87683 | 87709 | 87708 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87710 | 87715 | 87714 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87716 | 87721 | 87726 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87722 | 87727 | 87722 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87728 | 87776 | 87771 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87777 | 87777 | 87916 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 87778 | 87827 | 87778 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87828 | 87924 | 87828 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87925 | 87959 | 88020 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 87960 | 88022 | 87960 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88023 | 88034 | 88029 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88035 | 88045 | 88100 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 88046 | 88101 | 88049 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88102 | 88112 | 88292 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 88113 | 88122 | 88115 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88123 | 88171 | 88123 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88172 | 88172 | 88172 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88173 | 88173 | 88173 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88174 | 88184 | 88174 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88185 | 88186 | 88185 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88187 | 88187 | 88187 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88188 | 88189 | 88188 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88190 | 88190 | 88190 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88191 | 88297 | 88191 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88298 | 88301 | 88318 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88302 | 88325 | 88302 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88326 | 88336 | 88382 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88337 | 88383 | 88339 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88384 | 88388 | 88387 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88389 | 88399 | 88398 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 88400 | 88415 | 88414 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 88416 | 88420 | 88419 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88421 | 88436 | 88431 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 88437 | 88451 | 88450 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88452 | 88461 | 88460 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88462 | 88474 | 88473 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88475 | 88486 | 88495 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88487 | 88496 | 88487 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88497 | 88518 | 88517 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88519 | 88547 | 88546 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88548 | 88555 | 88635 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88556 | 88567 | 88556 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88568 | 88581 | 88571 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88582 | 88620 | 88619 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88621 | 88642 | 88621 | 22 | 1 | `csv` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88643 | 88686 | 88685 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88687 | 88692 | 88779 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 88693 | 88780 | 88693 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88781 | 88787 | 88786 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 88788 | 88791 | 88804 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88792 | 88809 | 88792 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88810 | 88810 | 88837 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88811 | 88832 | 88811 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88833 | 88845 | 88833 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88846 | 88896 | 89128 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 88897 | 88965 | 88905 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88966 | 88994 | 88984 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88995 | 89044 | 89004 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89045 | 89053 | 89052 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89054 | 89129 | 89061 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89130 | 89148 | 89146 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89149 | 89281 | 89165 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89282 | 89307 | 89294 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 89308 | 89322 | 89321 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89323 | 89387 | 89386 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89388 | 89440 | 89439 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89441 | 89448 | 89447 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 89449 | 89460 | 89459 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89461 | 89502 | 89493 | 42 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89503 | 89537 | 89531 | 35 | 29 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89538 | 89575 | 89570 | 38 | 33 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89576 | 89645 | 89709 | 70 | 134 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89646 | 89713 | 89648 | 68 | 3 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89714 | 89782 | 89778 | 69 | 65 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89783 | 89800 | 89796 | 18 | 14 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89801 | 89812 | 89808 | 12 | 8 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89813 | 89831 | 89820 | 19 | 8 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89832 | 89913 | 89909 | 82 | 78 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89914 | 89930 | 89924 | 17 | 11 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89931 | 89990 | 89986 | 60 | 56 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 89991 | 90009 | 89999 | 19 | 9 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90010 | 90062 | 90061 | 53 | 52 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90063 | 90085 | 90071 | 23 | 9 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90086 | 90115 | 90180 | 30 | 95 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90116 | 90181 | 90118 | 66 | 3 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 90182 | 90198 | 90197 | 17 | 16 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90199 | 90207 | 90206 | 9 | 8 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90208 | 90219 | 90215 | 12 | 8 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90220 | 90230 | 90226 | 11 | 7 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90231 | 90274 | 90268 | 44 | 38 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90275 | 90328 | 90323 | 54 | 49 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90329 | 90341 | 90332 | 13 | 4 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 90342 | 90378 | 90373 | 37 | 32 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 90379 | 90490 | 90678 | 112 | 300 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 90491 | 90500 | 90559 | 10 | 69 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90501 | 90524 | 90505 | 24 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90525 | 90619 | 90525 | 95 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90620 | 90620 | 90620 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90621 | 90682 | 90621 | 62 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90683 | 90790 | 90786 | 108 | 104 | `displayMagisterialDistricts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 90791 | 90806 | 90802 | 16 | 12 | `removeMagisterialDistrictsLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 90807 | 90818 | 90814 | 12 | 8 | `saveMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90819 | 90851 | 90846 | 33 | 28 | `loadMagisterialDistrictsVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90852 | 90914 | 90933 | 63 | 82 | `loadPendingDistrictsOnMapReady` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90915 | 90938 | 90920 | 24 | 6 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90939 | 90989 | 90984 | 51 | 46 | `updateMagisterialDistricts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90990 | 91013 | 91008 | 24 | 19 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91014 | 91072 | 91065 | 59 | 52 | `refreshDistrictStatisticsOnDataLoad` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 91073 | 91131 | 91462 | 59 | 390 | `preloadDistrictsForStatistics` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 91132 | 91218 | 91163 | 87 | 32 | `showDistrictLoadError` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91219 | 91225 | 91223 | 7 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91226 | 91245 | 91335 | 20 | 110 | `fetchWithRetry` | async const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91246 | 91285 | 91246 | 40 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91286 | 91400 | 91286 | 115 | 1 | `postTimeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91401 | 91401 | 91401 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91402 | 91467 | 91402 | 66 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91468 | 91487 | 91482 | 20 | 15 | `pointInPolygon` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91488 | 91494 | 91515 | 7 | 28 | `computeFeatureBoundingBox` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91495 | 91520 | 91509 | 26 | 15 | `processCoords` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91521 | 91530 | 91525 | 10 | 5 | `pointInBoundingBox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91531 | 91563 | 91558 | 33 | 28 | `pointInFeature` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 91564 | 91649 | 91765 | 86 | 202 | `computeDistrictCrashStatistics` | async fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 91650 | 91769 | 91761 | 120 | 112 | `processBatch` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91770 | 91823 | 91819 | 54 | 50 | `refreshDistrictPopups` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91824 | 91849 | 91845 | 26 | 22 | `filterCrashesByDistrict` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 91850 | 91871 | 91867 | 22 | 18 | `highlightDistrictCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 91872 | 91885 | 91881 | 14 | 10 | `clearDistrictFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91886 | 91912 | 91895 | 27 | 10 | `updateDistrictStatisticsUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91913 | 91936 | 92003 | 24 | 91 | `renderMagisterialDistricts` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 91937 | 91968 | 91937 | 32 | 1 | `esc` | const arrow | — | refs:114 | Unassigned | `app/modules/app/unassigned.js` |
| 91969 | 92009 | 91969 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92010 | 92045 | 92030 | 36 | 21 | `attachJurisdictionCardClicks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92046 | 92061 | 92060 | 16 | 15 | `renderDistrictStatistics` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 92062 | 92151 | 92147 | 90 | 86 | `_renderDistrictStatisticsLegacy` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92152 | 92168 | 92248 | 17 | 97 | `exportDistrictStatistics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92169 | 92259 | 92190 | 91 | 22 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92260 | 92313 | 92308 | 54 | 49 | `showDistrictMatrixLoading` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 92314 | 92344 | 92339 | 31 | 26 | `showDistrictMatrixError` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92345 | 92373 | 92367 | 29 | 23 | `retryLoadDistrictMatrix` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92374 | 92425 | 92420 | 52 | 47 | `refreshMagisterialDistrictCache` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92426 | 92653 | 92649 | 228 | 224 | `renderDistrictMatrixWidget` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92654 | 92668 | 92664 | 15 | 11 | `toggleDistrictMatrixExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92669 | 92686 | 92681 | 18 | 13 | `updateDistrictMatrixExpandButton` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92687 | 92717 | 92901 | 31 | 215 | `renderDistrictMatrixCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92718 | 92718 | 92718 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92719 | 92730 | 92719 | 12 | 1 | `colors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92731 | 92839 | 92731 | 109 | 1 | `totalData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92840 | 92851 | 92840 | 12 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92852 | 92867 | 92852 | 16 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92868 | 92905 | 92868 | 38 | 1 | `epdoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92906 | 92933 | 92961 | 28 | 56 | `exportDistrictMatrixCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92934 | 92970 | 92941 | 37 | 8 | `totals` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92971 | 93018 | 93014 | 48 | 44 | `populateDistrictFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93019 | 93025 | 93021 | 7 | 3 | `getDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 93026 | 93042 | 93033 | 17 | 8 | `getAllDistrictStatistics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 93043 | 93053 | 93266 | 11 | 224 | `showDistrictDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93054 | 93054 | 93054 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93055 | 93270 | 93055 | 216 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93271 | 93280 | 93276 | 10 | 6 | `closeDistrictDrillDown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 93281 | 93322 | 93318 | 42 | 38 | `findDistrictHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 93323 | 93347 | 93343 | 25 | 21 | `calculateDistrictYearTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93348 | 93367 | 93363 | 20 | 16 | `filterByDistrictFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93368 | 93371 | 93388 | 4 | 21 | `jumpToLocationFromDrillDown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93372 | 93397 | 93372 | 26 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 93398 | 93416 | 93683 | 19 | 286 | `generateDistrictReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93417 | 93417 | 93417 | 1 | 1 | `allDistricts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93418 | 93687 | 93418 | 270 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93688 | 93751 | 93730 | 64 | 43 | `generateDistrictRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93752 | 93948 | 93944 | 197 | 193 | `openDistrictPresentationMode` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 93949 | 93967 | 93963 | 19 | 15 | `closeDistrictPresentationMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93968 | 93993 | 93989 | 26 | 22 | `presHandleKeydown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93994 | 94082 | 94078 | 89 | 85 | `presRenderSlide` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 94083 | 94128 | 94124 | 46 | 42 | `presShowOverview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94129 | 94135 | 94131 | 7 | 3 | `presNextSlide` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94136 | 94142 | 94138 | 7 | 3 | `presPrevSlide` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94143 | 94168 | 94164 | 26 | 22 | `presToggleAutoPlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94169 | 94254 | 94250 | 86 | 82 | `generateAllDistrictsReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94255 | 94271 | 94267 | 17 | 13 | `clearDistrictStatisticsCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94272 | 94304 | 94300 | 33 | 29 | `toggleDistrictStatsExpanded` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94305 | 94403 | 94394 | 99 | 90 | `initDistrictStatisticsOnGrantsTab` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 94404 | 94422 | 94418 | 19 | 15 | `toggleMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94423 | 94542 | 94538 | 120 | 116 | `addMapillaryCoverageLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 94543 | 94559 | 94555 | 17 | 13 | `removeMapillaryCoverageLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 94560 | 94571 | 94567 | 12 | 8 | `addMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94572 | 94583 | 94579 | 12 | 8 | `removeMapillaryAttribution` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94584 | 94590 | 94586 | 7 | 3 | `getMapillaryViewUrl` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94591 | 94598 | 94594 | 8 | 4 | `openMapillaryAtLocation` | fn | — | refs:5 | Map | `app/modules/map/map.js` |
| 94599 | 94609 | 94605 | 11 | 7 | `saveMapillaryVisibility` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 94610 | 94623 | 94619 | 14 | 10 | `loadMapillaryVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94624 | 94651 | 94643 | 28 | 20 | `restoreMapillaryLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94652 | 94676 | 94672 | 25 | 21 | `getMapillarySignInfo` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 94677 | 94752 | 94695 | 76 | 19 | `getMapillaryFeatureInfo` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 94753 | 94816 | 94812 | 64 | 60 | `getMapillaryInlineSvg` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94817 | 94824 | 94819 | 8 | 3 | `svgToDataUri` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94825 | 94842 | 94837 | 18 | 13 | `createMapillaryIcon` | fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 94843 | 94867 | 94859 | 25 | 17 | `toggleMapillaryTrafficSignsLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 94868 | 94895 | 94891 | 28 | 24 | `renderSignFilterItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94896 | 94909 | 94905 | 14 | 10 | `toggleSignFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94910 | 94954 | 94950 | 45 | 41 | `toggleSignFilter` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94955 | 94981 | 94977 | 27 | 23 | `shouldShowSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94982 | 94998 | 94993 | 17 | 12 | `getSignFilterCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94999 | 95020 | 95015 | 22 | 17 | `toggleMapillaryMapFeaturesLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 95021 | 95206 | 95202 | 186 | 182 | `addMapillaryTrafficSignsLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 95207 | 95218 | 95214 | 12 | 8 | `removeMapillaryTrafficSignsLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95219 | 95399 | 95395 | 181 | 177 | `addMapillaryMapFeaturesLayer` | fn | — | refs:0 | Map | `app/modules/map/map.js` |
| 95400 | 95411 | 95407 | 12 | 8 | `removeMapillaryMapFeaturesLayer` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95412 | 95425 | 95421 | 14 | 10 | `saveMapillarySubLayersVisibility` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 95426 | 95459 | 95440 | 34 | 15 | `loadMapillarySubLayersVisibility` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 95460 | 95513 | 95509 | 54 | 50 | `addMapillaryTrafficSignsViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95514 | 95530 | 95526 | 17 | 13 | `debounceTrafficSignsRefresh` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 95531 | 95577 | 95666 | 47 | 136 | `refreshTrafficSignsFromGraphAPI` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 95578 | 95670 | 95578 | 93 | 1 | `sampleValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95671 | 95686 | 95682 | 16 | 12 | `removeMapillaryTrafficSignsGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95687 | 95740 | 95736 | 54 | 50 | `addMapillaryMapFeaturesViaGraphAPI` | async fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95741 | 95862 | 95858 | 122 | 118 | `refreshMapFeaturesFromGraphAPI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95863 | 95875 | 95870 | 13 | 8 | `removeMapillaryMapFeaturesGraphAPI` | fn | — | refs:3 | Map | `app/modules/map/map.js` |
| 95876 | 95945 | 95935 | 70 | 60 | `assetInit` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95946 | 95975 | 95955 | 30 | 10 | `computeAggregates` | window fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 95976 | 96044 | 96015 | 69 | 40 | `assetSwitchSourceTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 96045 | 96052 | 96051 | 8 | 7 | `isVaSchoolsCacheValid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96053 | 96089 | 96084 | 37 | 32 | `initVASchoolJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96090 | 96110 | 96093 | 21 | 4 | `schoolsReinitJurisdictions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96111 | 96123 | 96119 | 13 | 9 | `assetInitSchoolsJurisdiction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96124 | 96201 | 96196 | 78 | 73 | `schoolsSyncFromContext` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 96202 | 96219 | 96206 | 18 | 5 | `assetSchoolJurisdictionChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96220 | 96243 | 96239 | 24 | 20 | `assetShowSchoolStatus` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 96244 | 96251 | 96247 | 8 | 4 | `assetHideSchoolStatus` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96252 | 96264 | 96557 | 13 | 306 | `assetLoadSchools` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 96265 | 96271 | 96265 | 7 | 1 | `existingSchoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96272 | 96380 | 96272 | 109 | 1 | `jurisdiction` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96381 | 96391 | 96387 | 11 | 7 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96392 | 96449 | 96444 | 58 | 53 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96450 | 96564 | 96450 | 115 | 1 | `uniqueCountyCodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96565 | 96583 | 96789 | 19 | 225 | `assetLoadSchoolsForTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 96584 | 96656 | 96586 | 73 | 3 | `existingAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96657 | 96793 | 96659 | 137 | 3 | `getSchoolCountyCode` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96794 | 96812 | 96808 | 19 | 15 | `_updateSchoolTierScopeNotice` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 96813 | 96852 | 96847 | 40 | 35 | `assetDetermineSchoolLevel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96853 | 96867 | 96862 | 15 | 10 | `assetCalcSchoolVulnerability` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96868 | 96868 | 96915 | 1 | 48 | `assetCalcSchoolMetrics` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96869 | 96872 | 96869 | 4 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96873 | 96923 | 96876 | 51 | 4 | `location` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96924 | 96932 | 97238 | 9 | 315 | `updateSchoolSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 96933 | 96951 | 96933 | 19 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96952 | 97087 | 96972 | 136 | 21 | `isSchoolDay` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97088 | 97109 | 97088 | 22 | 1 | `originalCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97110 | 97126 | 97118 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 97127 | 97151 | 97134 | 25 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 97152 | 97242 | 97155 | 91 | 4 | `updateTimeElement` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 97243 | 97265 | 97261 | 23 | 19 | `switchSchoolResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97266 | 97268 | 97307 | 3 | 42 | `schoolSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97269 | 97311 | 97269 | 43 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97312 | 97313 | 97358 | 2 | 47 | `schoolSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97314 | 97327 | 97314 | 14 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97328 | 97366 | 97345 | 39 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97367 | 97372 | 97589 | 6 | 223 | `updateTransitSafetyMetrics` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97373 | 97426 | 97378 | 54 | 6 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97427 | 97443 | 97435 | 17 | 9 | `updateSeveritySegment` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 97444 | 97515 | 97451 | 72 | 8 | `updateFactor` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 97516 | 97562 | 97519 | 47 | 4 | `setTimeValue` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 97563 | 97565 | 97563 | 3 | 1 | `zoneKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97566 | 97593 | 97569 | 28 | 4 | `setZoneValue` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97594 | 97622 | 97618 | 29 | 25 | `switchTransitResourceTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97623 | 97624 | 97651 | 2 | 29 | `transitSafetyViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97625 | 97655 | 97629 | 31 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97656 | 97657 | 97700 | 2 | 45 | `transitSafetyExportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97658 | 97674 | 97662 | 17 | 5 | `transitResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97675 | 97721 | 97688 | 47 | 14 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97722 | 97759 | 97755 | 38 | 34 | `schoolsUpdateJurisdictionInfo` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97760 | 97795 | 97791 | 36 | 32 | `schoolsOnJurisdictionChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97796 | 97813 | 97809 | 18 | 14 | `detectCurrentJurisdiction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97814 | 97831 | 97827 | 18 | 14 | `schoolsShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 97832 | 97843 | 97837 | 12 | 6 | `schoolsHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97844 | 97927 | 98150 | 84 | 307 | `schoolsFetchData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97928 | 97948 | 97932 | 21 | 5 | `countyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97949 | 97967 | 97949 | 19 | 1 | `getUniqueValues` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 97968 | 97978 | 97976 | 11 | 9 | `getCountyCode` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 97979 | 98045 | 98039 | 67 | 61 | `countySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98046 | 98064 | 98053 | 19 | 8 | `sampleSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98065 | 98154 | 98070 | 90 | 6 | `possibleCountyFields` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98155 | 98168 | 98210 | 14 | 56 | `schoolsShowPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98169 | 98214 | 98169 | 46 | 1 | `sortedSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98215 | 98277 | 98273 | 63 | 59 | `schoolsConfirmLoad` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 98278 | 98312 | 98282 | 35 | 5 | `schoolsCancelLoad` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 98313 | 98351 | 98330 | 39 | 18 | `initTransitConfig` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98352 | 98361 | 98357 | 10 | 6 | `transitInitCountyDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98362 | 98442 | 98437 | 81 | 76 | `transitSyncFromContext` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 98443 | 98450 | 98445 | 8 | 3 | `transitOnCountyChange` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 98451 | 98475 | 98456 | 25 | 6 | `transitQuickSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 98476 | 98489 | 98478 | 14 | 3 | `hasTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98490 | 98506 | 98533 | 17 | 44 | `transitClearStops` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98507 | 98537 | 98507 | 31 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98538 | 98555 | 98551 | 18 | 14 | `transitShowStatus` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 98556 | 98563 | 98559 | 8 | 4 | `transitHideStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98564 | 98580 | 98576 | 17 | 13 | `transitGetFieldValue` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 98581 | 98617 | 98613 | 37 | 33 | `transitTryGeoJSON` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98618 | 98643 | 98665 | 26 | 48 | `transitTryGRTC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98644 | 98672 | 98655 | 29 | 12 | `features` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98673 | 98732 | 98726 | 60 | 54 | `transitTryStatewideData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98733 | 98780 | 98775 | 48 | 43 | `transitTryVirginiaOpenData` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 98781 | 98785 | 98854 | 5 | 74 | `transitParseGTFSCsv` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98786 | 98858 | 98786 | 73 | 1 | `header` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98859 | 98883 | 98879 | 25 | 21 | `transitParseCsvLine` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98884 | 98979 | 98975 | 96 | 92 | `transitTryEndpoint` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98980 | 98995 | 99229 | 16 | 250 | `transitLoadStops` | async fn | — | refs:7 | Transit Safety | `app/modules/assets/transit-tab.js` |
| 98996 | 99114 | 98999 | 119 | 4 | `existingTransitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99115 | 99233 | 99175 | 119 | 61 | `locations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 99234 | 99279 | 99275 | 46 | 42 | `getCountyBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99280 | 99291 | 99287 | 12 | 8 | `transitIsInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99292 | 99305 | 99301 | 14 | 10 | `transitDistanceMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99306 | 99341 | 99335 | 36 | 30 | `transitValidateLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99342 | 99392 | 99387 | 51 | 46 | `transitGenerateDemoStops` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99393 | 99470 | 99459 | 78 | 67 | `transitDiagnostics` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 99471 | 99498 | 99536 | 28 | 66 | `transitSaveAsAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99499 | 99554 | 99501 | 56 | 3 | `existingTransitAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99555 | 99573 | 99569 | 19 | 15 | `initSchoolSafetyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99574 | 99617 | 99605 | 44 | 32 | `schoolTabSyncFromContext` | fn | — | refs:4 | School Safety | `app/modules/assets/school-tab.js` |
| 99618 | 99624 | 99620 | 7 | 3 | `schoolTabJurisdictionChange` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 99625 | 99683 | 99679 | 59 | 55 | `schoolTabLoadSchools` | async fn | — | refs:1 | School Safety | `app/modules/assets/school-tab.js` |
| 99684 | 99691 | 99742 | 8 | 59 | `updateSchoolTabUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 99692 | 99746 | 99692 | 55 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99747 | 99797 | 99836 | 51 | 90 | `updateSchoolTabMetrics` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99798 | 99818 | 99801 | 21 | 4 | `setVal` | const arrow | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 99819 | 99848 | 99826 | 30 | 8 | `sevBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99849 | 99878 | 99874 | 30 | 26 | `schoolTabSortTable` | fn | — | refs:0 | School Safety | `app/modules/assets/school-tab.js` |
| 99879 | 99914 | 99884 | 36 | 6 | `schoolTabGoToPage` | fn | — | refs:2 | School Safety | `app/modules/assets/school-tab.js` |
| 99915 | 100056 | 99950 | 142 | 36 | `attemptAutoload` | fn | — | refs:1 | Bootstrap | `app/modules/app/bootstrap.js` |
| 100057 | 100064 | 100062 | 8 | 6 | `signDef_getCutoffDate` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100065 | 100078 | 100074 | 14 | 10 | `signDef_filterByMonths` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100079 | 100083 | 100082 | 5 | 4 | `signDef_calcEPDO` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100084 | 100088 | 100086 | 5 | 3 | `signDef_nextId` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100089 | 100130 | 100129 | 42 | 41 | `signDef_init` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100131 | 100136 | 100135 | 6 | 5 | `signDef_reanalyze` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100137 | 100147 | 100145 | 11 | 9 | `signDef_onFilterChange` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100148 | 100208 | 100206 | 61 | 59 | `signDef_loadInventory` | async fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100209 | 100233 | 100231 | 25 | 23 | `signDef_hasNearbyInventory` | fn | — | refs:7 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100234 | 100251 | 100249 | 18 | 16 | `signDef_getPostedSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100252 | 100320 | 100352 | 69 | 101 | `signDef_analyze` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100321 | 100353 | 100328 | 33 | 8 | `buildSev` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 100354 | 100363 | 100362 | 10 | 9 | `signDef_applyFilters` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100364 | 100404 | 100401 | 41 | 38 | `signDef_addDeficiency` | fn | — | refs:8 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100405 | 100449 | 100448 | 45 | 44 | `signDef_checkSignal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100450 | 100497 | 100496 | 48 | 47 | `signDef_checkStopSign` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100498 | 100568 | 100567 | 71 | 70 | `signDef_checkStreetLight` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100569 | 100591 | 100590 | 23 | 22 | `signDef_checkCrosswalk` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100592 | 100612 | 100611 | 21 | 20 | `signDef_checkSchoolZone` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100613 | 100633 | 100632 | 21 | 20 | `signDef_checkAnimal` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100634 | 100654 | 100653 | 21 | 20 | `signDef_checkBike` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100655 | 100681 | 100679 | 27 | 25 | `signDef_checkSpeed` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100682 | 100743 | 100742 | 62 | 61 | `signDef_initMap` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100744 | 100811 | 100810 | 68 | 67 | `signDef_addMarker` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100812 | 100826 | 100825 | 15 | 14 | `signDef_renderLegend` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100827 | 100842 | 100841 | 16 | 15 | `signDef_renderLayerToggles` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100843 | 100860 | 100858 | 18 | 16 | `signDef_toggleCategory` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100861 | 100865 | 100864 | 5 | 4 | `signDef_renderUI` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100866 | 100932 | 100931 | 67 | 66 | `signDef_renderSummaryCards` | fn | — | refs:1 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 100933 | 101010 | 101009 | 78 | 77 | `signDef_renderTable` | fn | — | refs:4 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101011 | 101020 | 101019 | 10 | 9 | `signDef_sortTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101021 | 101024 | 101023 | 4 | 3 | `signDef_filterTable` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101025 | 101040 | 101038 | 16 | 14 | `signDef_zoomTo` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101041 | 101073 | 101071 | 33 | 31 | `signDef_navigateToWarrant` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101074 | 101110 | 101109 | 37 | 36 | `signDef_exportCSV` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101111 | 101153 | 101152 | 43 | 42 | `signDef_exportKML` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101154 | 101157 | 101156 | 4 | 3 | `signDef_escXml` | fn | — | refs:2 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101158 | 101195 | 101194 | 38 | 37 | `signDef_exportGeoJSON` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101196 | 101688 | 101325 | 493 | 130 | `signDef_exportPDF` | fn | — | refs:0 | Sign Deficiency | `app/modules/safety/sign-deficiency.js` |
| 101689 | 101803 | 101695 | 115 | 7 | `_earlySkel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
