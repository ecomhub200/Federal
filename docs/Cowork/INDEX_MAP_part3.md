# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-20 · source `app/index.html` (131696 lines)

Declarations in this part: **995**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80080 | 80153 | 80083 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80154 | 80162 | 80154 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80163 | 80222 | 80167 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80223 | 80257 | 80226 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80258 | 80258 | 80258 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80259 | 80328 | 80259 | 70 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80329 | 80358 | 80356 | 30 | 28 | `runSafetyDataCheck` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80359 | 80367 | 80365 | 9 | 7 | `sfAddCheck` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 80368 | 80410 | 80408 | 43 | 41 | `sfCheckSeverityTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80411 | 80444 | 80442 | 34 | 32 | `sfCheckEPDOCalculations` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 80445 | 80489 | 80487 | 45 | 43 | `sfCheckCategorySums` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80490 | 80522 | 80520 | 33 | 31 | `sfCheckLocationTableConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80523 | 80653 | 80651 | 131 | 129 | `sfCheckCrossAnalysisConsistency` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80654 | 80726 | 80724 | 73 | 71 | `sfCheckFilterConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80727 | 80873 | 80881 | 147 | 155 | `sfCheckDetailPanelAccuracy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80874 | 80883 | 80874 | 10 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80884 | 80924 | 80922 | 41 | 39 | `sfCheckPercentageDenominators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80925 | 80937 | 81002 | 13 | 78 | `displaySafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80938 | 80959 | 80938 | 22 | 1 | `statusIcon` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 80960 | 80960 | 80960 | 1 | 1 | `catPassed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80961 | 80961 | 80961 | 1 | 1 | `catFailed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80962 | 80963 | 80962 | 2 | 1 | `catWarn` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80964 | 81004 | 80964 | 41 | 1 | `catName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81005 | 81025 | 81021 | 21 | 17 | `exportSafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81026 | 81043 | 81042 | 18 | 17 | `viewSafetyOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81044 | 81061 | 81060 | 18 | 17 | `viewSafetyLocationOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81062 | 81115 | 81114 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81116 | 81132 | 81131 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81133 | 81139 | 81149 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81140 | 81155 | 81140 | 16 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81156 | 81207 | 81204 | 52 | 49 | `initCrashTreeTab` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81208 | 81241 | 81385 | 34 | 178 | `initCrashTreeFromMatview` | async fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81242 | 81276 | 81242 | 35 | 1 | `idSafe` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81277 | 81319 | 81291 | 43 | 15 | `buildNode` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81320 | 81323 | 81343 | 4 | 24 | `propagateSeverity` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81324 | 81324 | 81324 | 1 | 1 | `ck` | const arrow | — | refs:148 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81325 | 81325 | 81325 | 1 | 1 | `ca` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81326 | 81326 | 81326 | 1 | 1 | `cb` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81327 | 81327 | 81327 | 1 | 1 | `cc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81328 | 81387 | 81328 | 60 | 1 | `co` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81388 | 81450 | 81448 | 63 | 61 | `setCrashTreeType` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81451 | 81461 | 81459 | 11 | 9 | `toggleCrashTreeSeverity` | fn | — | refs:5 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81462 | 81486 | 81484 | 25 | 23 | `updateCrashTreeSeverity` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81487 | 81521 | 81515 | 35 | 29 | `setTreeSeverityPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81522 | 81551 | 81549 | 30 | 28 | `applyCrashTreeDateFilter` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81552 | 81557 | 81586 | 6 | 35 | `setCrashTreeDatePreset` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81558 | 81588 | 81558 | 31 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 81589 | 81617 | 81615 | 29 | 27 | `clearCrashTreeDateFilter` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81618 | 81629 | 81642 | 12 | 25 | `updateCrashTreeDateFilterStatus` | fn | — | refs:4 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81630 | 81644 | 81634 | 15 | 5 | `formatDisplay` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81645 | 81683 | 81680 | 39 | 36 | `getCrashTreeFilteredCrashes` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81684 | 81715 | 81713 | 32 | 30 | `getCrashTreeDateOnlyFilteredCrashes` | fn | — | refs:6 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81716 | 81737 | 81735 | 22 | 20 | `refreshCrashTreeAnalysis` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81738 | 81768 | 81813 | 31 | 76 | `buildCrashTreeData` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 81769 | 81816 | 81791 | 48 | 23 | `filteredCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81817 | 81824 | 81987 | 8 | 171 | `buildFacilityTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81825 | 81834 | 81832 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 81835 | 81839 | 81837 | 5 | 3 | `getUnfilteredTotal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 81840 | 81848 | 81846 | 9 | 7 | `getUnfilteredKA` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 81849 | 81849 | 81849 | 1 | 1 | `atIntersection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81850 | 81852 | 81850 | 3 | 1 | `atSegment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81853 | 81856 | 81856 | 4 | 4 | `signalFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81857 | 81860 | 81860 | 4 | 4 | `stopFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81861 | 81865 | 81864 | 5 | 4 | `uncontrolledFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81866 | 81869 | 81869 | 4 | 4 | `intSignalized` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81870 | 81873 | 81873 | 4 | 4 | `intStopControlled` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81874 | 81879 | 81877 | 6 | 4 | `intUncontrolled` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81880 | 81883 | 81883 | 4 | 4 | `arterialFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81884 | 81887 | 81887 | 4 | 4 | `collectorFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81888 | 81892 | 81891 | 5 | 4 | `localFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81893 | 81896 | 81896 | 4 | 4 | `segArterial` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81897 | 81900 | 81900 | 4 | 4 | `segCollector` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81901 | 81939 | 81904 | 39 | 4 | `segLocal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81940 | 81940 | 81940 | 1 | 1 | `unfilteredIntTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81941 | 81970 | 81941 | 30 | 1 | `unfilteredSegTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81971 | 81990 | 81974 | 20 | 4 | `rootUnfilteredKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81991 | 81997 | 82088 | 7 | 98 | `buildCrashTypeTree` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 81998 | 82007 | 82005 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 82008 | 82073 | 82020 | 66 | 13 | `getCrashCategory` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 82074 | 82092 | 82077 | 19 | 4 | `rootUnfilteredKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82093 | 82101 | 82607 | 9 | 515 | `buildContributingFactorsTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82102 | 82111 | 82109 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 82112 | 82116 | 82114 | 5 | 3 | `getUnfilteredTotal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 82117 | 82130 | 82123 | 14 | 7 | `getUnfilteredKA` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 82131 | 82131 | 82131 | 1 | 1 | `impairedFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82132 | 82132 | 82132 | 1 | 1 | `alcoholFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82133 | 82133 | 82133 | 1 | 1 | `drugFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82134 | 82134 | 82134 | 1 | 1 | `combinedSubstanceFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82135 | 82135 | 82135 | 1 | 1 | `speedingFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82136 | 82136 | 82136 | 1 | 1 | `distractedFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82137 | 82187 | 82137 | 51 | 1 | `drowsyFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82188 | 82243 | 82190 | 56 | 3 | `driverBehaviorCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82244 | 82244 | 82244 | 1 | 1 | `youngDriverFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82245 | 82248 | 82245 | 4 | 1 | `seniorDriverFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82249 | 82278 | 82249 | 30 | 1 | `demographicsCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82279 | 82282 | 82279 | 4 | 1 | `unrestrainedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82283 | 82283 | 82283 | 1 | 1 | `nightFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82284 | 82287 | 82287 | 4 | 4 | `lightedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82288 | 82293 | 82292 | 6 | 5 | `unlightedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82294 | 82297 | 82297 | 4 | 4 | `weatherFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82298 | 82301 | 82301 | 4 | 4 | `rainFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82302 | 82305 | 82305 | 4 | 4 | `snowIceFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82306 | 82310 | 82309 | 5 | 4 | `fogFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82311 | 82314 | 82314 | 4 | 4 | `surfaceFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82315 | 82318 | 82318 | 4 | 4 | `wetFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82319 | 82334 | 82322 | 16 | 4 | `icyFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82335 | 82473 | 82335 | 139 | 1 | `environmentalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82474 | 82474 | 82474 | 1 | 1 | `hitRunFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82475 | 82475 | 82475 | 1 | 1 | `workZoneFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82476 | 82480 | 82476 | 5 | 1 | `schoolZoneFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82481 | 82609 | 82481 | 129 | 1 | `specialCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82610 | 82653 | 82630 | 44 | 21 | `renderCrashTree` | fn | — | refs:18 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 82654 | 82671 | 82669 | 18 | 16 | `navigateFromCrashTree` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 82672 | 82697 | 82771 | 26 | 100 | `renderTreeNode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82698 | 82740 | 82719 | 43 | 22 | `buildSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82741 | 82773 | 82743 | 33 | 3 | `childNodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82774 | 82784 | 82782 | 11 | 9 | `toggleCrashTreeNode` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 82785 | 82785 | 82795 | 1 | 11 | `expandAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82786 | 82797 | 82792 | 12 | 7 | `addAllIds` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82798 | 82803 | 82801 | 6 | 4 | `collapseAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82804 | 82811 | 82843 | 8 | 40 | `autoExpandDominantPath` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 82812 | 82845 | 82814 | 34 | 3 | `dominant` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82846 | 82858 | 82856 | 13 | 11 | `findNodeById` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 82859 | 82887 | 82885 | 29 | 27 | `getTreeTypeLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 82888 | 82907 | 82946 | 20 | 59 | `updateCrashTreeSummary` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 82908 | 82948 | 82911 | 41 | 4 | `pathNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82949 | 83020 | 83018 | 72 | 70 | `updateCrashTreeStats` | fn | — | refs:13 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 83021 | 83025 | 83059 | 5 | 39 | `updateCrashTreeDataTable` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 83026 | 83061 | 83055 | 36 | 30 | `addRows` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83062 | 83071 | 83275 | 10 | 214 | `analyzeRiskFactors` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 83072 | 83082 | 83075 | 11 | 4 | `kaCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83083 | 83083 | 83083 | 1 | 1 | `nightAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83084 | 83102 | 83084 | 19 | 1 | `nightKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83103 | 83103 | 83103 | 1 | 1 | `speedAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83104 | 83122 | 83104 | 19 | 1 | `speedKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83123 | 83123 | 83123 | 1 | 1 | `intAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83124 | 83142 | 83124 | 19 | 1 | `intKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83143 | 83166 | 83146 | 24 | 4 | `wetFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83167 | 83167 | 83167 | 1 | 1 | `pedAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83168 | 83186 | 83168 | 19 | 1 | `pedKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83187 | 83187 | 83187 | 1 | 1 | `bikeAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83188 | 83207 | 83188 | 20 | 1 | `bikeKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83208 | 83208 | 83208 | 1 | 1 | `youngAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83209 | 83228 | 83209 | 20 | 1 | `youngKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83229 | 83229 | 83229 | 1 | 1 | `overrepFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83230 | 83277 | 83230 | 48 | 1 | `highSeverityFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83278 | 83312 | 83390 | 35 | 113 | `buildSecondaryTreeAnalysis` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 83313 | 83339 | 83315 | 27 | 3 | `dominant` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83340 | 83349 | 83344 | 10 | 5 | `getTreeLabel` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83350 | 83392 | 83353 | 43 | 4 | `pathNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83393 | 83419 | 83417 | 27 | 25 | `exportCrashTreeImage` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 83420 | 83445 | 84853 | 26 | 1434 | `generateCrashTreeReport` | async fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 83446 | 83458 | 83449 | 13 | 4 | `focusPath` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83459 | 83459 | 83466 | 1 | 8 | `dateRange` | const arrow | — | refs:71 | Unassigned | `app/modules/app/unassigned.js` |
| 83460 | 83508 | 83460 | 49 | 1 | `dates` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83509 | 83642 | 83526 | 134 | 18 | `hydrated` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83643 | 83645 | 83685 | 3 | 43 | `buildTreeBreakdownHtml` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83646 | 83647 | 83663 | 2 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83648 | 84855 | 83656 | 1208 | 9 | `subRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84856 | 84900 | 84893 | 45 | 38 | `generateProfessionalTableRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84901 | 84919 | 84916 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 84920 | 84950 | 84947 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 84951 | 85297 | 85288 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85298 | 85309 | 85360 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85310 | 85319 | 85315 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 85320 | 85330 | 85330 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 85331 | 85335 | 85335 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85336 | 85366 | 85349 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85367 | 85446 | 85437 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85447 | 85450 | 85527 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 85451 | 85454 | 85451 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 85455 | 85528 | 85474 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 85529 | 85564 | 85563 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85565 | 85572 | 85571 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85573 | 85871 | 85870 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 85872 | 85913 | 85907 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 85914 | 85960 | 85953 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85961 | 85963 | 85975 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85964 | 85976 | 85964 | 13 | 1 | `entries` | const arrow | — | refs:306 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85977 | 85979 | 85991 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 85980 | 85992 | 85980 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85993 | 85995 | 86007 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85996 | 86008 | 85996 | 13 | 1 | `entries` | const arrow | — | refs:306 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86009 | 86011 | 86023 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86012 | 86024 | 86012 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86025 | 86027 | 86039 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86028 | 86040 | 86028 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86041 | 86085 | 86097 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86086 | 86098 | 86086 | 13 | 1 | `data` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 86099 | 86119 | 86118 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86120 | 86122 | 86134 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86123 | 86135 | 86123 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86136 | 86152 | 86151 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86153 | 86176 | 86175 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86177 | 86190 | 86189 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86191 | 86212 | 86211 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86213 | 86248 | 86247 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86249 | 86279 | 86323 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 86280 | 86300 | 86280 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86301 | 86325 | 86301 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86326 | 86335 | 86358 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86336 | 86359 | 86336 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86360 | 86390 | 86430 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 86391 | 86411 | 86391 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86412 | 86432 | 86412 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86433 | 86442 | 86461 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86443 | 86462 | 86443 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86463 | 86526 | 86524 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 86527 | 86552 | 86551 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86553 | 86571 | 86594 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86572 | 86572 | 86579 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86573 | 86595 | 86575 | 23 | 3 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86596 | 86643 | 86662 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 86644 | 86645 | 86648 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86646 | 86663 | 86646 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86664 | 86734 | 86732 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86735 | 86763 | 86758 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86764 | 86775 | 86773 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86776 | 86787 | 86785 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86788 | 86796 | 86793 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86797 | 86870 | 86868 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86871 | 86929 | 86927 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 86930 | 87032 | 87030 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87033 | 87090 | 87089 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87091 | 87131 | 87130 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87132 | 87143 | 87196 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87144 | 87144 | 87144 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87145 | 87152 | 87150 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87153 | 87155 | 87153 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87156 | 87197 | 87156 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87198 | 87226 | 87225 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87227 | 87281 | 87280 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 87282 | 87291 | 87314 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87292 | 87315 | 87292 | 24 | 1 | `count` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87316 | 87332 | 87406 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87333 | 87358 | 87333 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87359 | 87384 | 87377 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87385 | 87407 | 87385 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87408 | 87425 | 87436 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87426 | 87437 | 87426 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87438 | 87450 | 87449 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87451 | 87455 | 87489 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87456 | 87463 | 87456 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87464 | 87466 | 87474 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87467 | 87490 | 87469 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87491 | 87508 | 87507 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87509 | 87530 | 87529 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87531 | 87539 | 87538 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87540 | 87563 | 87562 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87564 | 87573 | 87572 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87574 | 87584 | 87583 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87585 | 87693 | 88448 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87694 | 87724 | 87701 | 31 | 8 | `hexToRgb` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 87725 | 87733 | 87731 | 9 | 7 | `cleanText` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87734 | 87741 | 87739 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87742 | 87758 | 87756 | 17 | 15 | `drawHeader` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87759 | 87783 | 87781 | 25 | 23 | `drawFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87784 | 87794 | 87792 | 11 | 9 | `newPage` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 87795 | 87803 | 87801 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 87804 | 87824 | 87822 | 21 | 19 | `addText` | const arrow | — | refs:148 | Unassigned | `app/modules/app/unassigned.js` |
| 87825 | 87840 | 87838 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 87841 | 87851 | 87849 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87852 | 87905 | 87903 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87906 | 87928 | 87926 | 23 | 21 | `drawKPICard` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87929 | 88189 | 87929 | 261 | 1 | `addSpacer` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 88190 | 88311 | 88195 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88312 | 88345 | 88316 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88346 | 88453 | 88351 | 108 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 88454 | 88485 | 88484 | 32 | 31 | `getSafetyCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88486 | 88506 | 88501 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88507 | 88582 | 88580 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88583 | 88589 | 88588 | 7 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88590 | 88596 | 88595 | 7 | 6 | `getCurrentDetailCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88597 | 88606 | 88604 | 10 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88607 | 88624 | 88623 | 18 | 17 | `exportCurrentDetailToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88625 | 88655 | 88654 | 31 | 30 | `addCurrentDetailToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 88656 | 88663 | 88658 | 8 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 88664 | 88676 | 88675 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88677 | 88686 | 88685 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88687 | 88718 | 88713 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 88719 | 88958 | 88956 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 88959 | 88973 | 88971 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88974 | 88984 | 88982 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88985 | 89000 | 88998 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89001 | 89032 | 89026 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 89033 | 89072 | 89070 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89073 | 89102 | 89140 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 89103 | 89118 | 89106 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89119 | 89142 | 89122 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89143 | 89157 | 89155 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89158 | 89170 | 89168 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89171 | 89209 | 89349 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 89210 | 89247 | 89213 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89248 | 89351 | 89251 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89352 | 89366 | 89364 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89367 | 89382 | 89376 | 16 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89383 | 89406 | 89404 | 24 | 22 | `exportSafetyToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89407 | 89434 | 89432 | 28 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 89435 | 89474 | 89462 | 40 | 28 | `generateSafetyCategoryReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 89475 | 89565 | 89485 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89566 | 89602 | 89589 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89603 | 89605 | 89603 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 89606 | 89609 | 89606 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 89610 | 89639 | 89650 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 89640 | 89653 | 89640 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89654 | 89670 | 89697 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 89671 | 89699 | 89671 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89700 | 89710 | 89708 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 89711 | 89762 | 89760 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 89763 | 89837 | 89835 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 89838 | 89897 | 89895 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 89898 | 89904 | 89902 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 89905 | 89959 | 89953 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 89960 | 89968 | 89993 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 89969 | 89995 | 89969 | 27 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 89996 | 90012 | 90010 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90013 | 90025 | 90056 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90026 | 90058 | 90026 | 33 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 90059 | 90077 | 90075 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 90078 | 90118 | 90112 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 90119 | 90135 | 90165 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90136 | 90167 | 90136 | 32 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 90168 | 90208 | 90206 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 90209 | 90234 | 90232 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 90235 | 90292 | 90290 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 90293 | 90349 | 90347 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 90350 | 90364 | 90432 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 90365 | 90388 | 90375 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90389 | 90407 | 90389 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90408 | 90415 | 90408 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90416 | 90422 | 90416 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 90423 | 90434 | 90429 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 90435 | 90448 | 90545 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 90449 | 90512 | 90461 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90513 | 90521 | 90513 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90522 | 90528 | 90522 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 90529 | 90553 | 90535 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 90554 | 90563 | 90616 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 90564 | 90572 | 90567 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90573 | 90618 | 90576 | 46 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 90619 | 90709 | 90707 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 90710 | 90807 | 90805 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 90808 | 90856 | 90867 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 90857 | 90869 | 90857 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90870 | 91124 | 91122 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 91125 | 91130 | 91128 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91131 | 91173 | 91184 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 91174 | 91189 | 91174 | 16 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91190 | 91261 | 91247 | 72 | 58 | `evaluatePedScreening` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 91262 | 91282 | 91280 | 21 | 19 | `getRequiredSSD` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91283 | 91305 | 91303 | 23 | 21 | `updatePedSSDRequired` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91306 | 91318 | 91316 | 13 | 11 | `updatePedContextSpacing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91319 | 91363 | 91361 | 45 | 43 | `updatePedStreetViewStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91364 | 91379 | 91377 | 16 | 14 | `openPedStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91380 | 91399 | 91491 | 20 | 112 | `ped_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 91400 | 91492 | 91402 | 93 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91493 | 91631 | 91541 | 139 | 49 | `evaluatePedCriteria` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 91632 | 91669 | 91721 | 38 | 90 | `determinePedTier` | fn | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 91670 | 91722 | 91673 | 53 | 4 | `cmDescriptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91723 | 91753 | 91748 | 31 | 26 | `determinePedMarking` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91754 | 92231 | 92227 | 478 | 474 | `ped_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92232 | 92251 | 92242 | 20 | 11 | `ped_printReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92252 | 92322 | 92318 | 71 | 67 | `stopsign_initForm` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92323 | 92357 | 92353 | 35 | 31 | `stopsign_showTab` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92358 | 92435 | 92431 | 78 | 74 | `stopsign_updateSpeedThreshold` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 92436 | 92447 | 92443 | 12 | 8 | `stopsign_updateConfig` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 92448 | 92496 | 92492 | 49 | 45 | `stopsign_updateTMCGrid` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 92497 | 92548 | 92541 | 52 | 45 | `stopsign_generateTMCRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92549 | 92566 | 92562 | 18 | 14 | `stopsign_updateRowTotal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92567 | 92576 | 92572 | 10 | 6 | `stopsign_markTotalManual` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92577 | 92599 | 92593 | 23 | 17 | `stopsign_calculateApproachVolumes` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92600 | 92686 | 92680 | 87 | 81 | `stopsign_computeHourlyAggregates` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 92687 | 92770 | 92766 | 84 | 80 | `stopsign_evaluateCriterionCFromAggregates` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 92771 | 92803 | 92903 | 33 | 133 | `stopsign_updateVolumeSummary` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 92804 | 92804 | 92804 | 1 | 1 | `totalMajor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92805 | 92907 | 92805 | 103 | 1 | `totalMinor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92908 | 92946 | 92942 | 39 | 35 | `stopsign_setCountType` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 92947 | 92977 | 92972 | 31 | 26 | `stopsign_clearTMCForm` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 92978 | 92985 | 92981 | 8 | 4 | `stopsign_generateVolumeTable` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92986 | 93081 | 93077 | 96 | 92 | `stopsign_updateVolumeAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 93082 | 93104 | 93124 | 23 | 43 | `stopsign_buildCrashProfile` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 93105 | 93128 | 93107 | 24 | 3 | `isSusceptible` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93129 | 93161 | 93157 | 33 | 29 | `stopsign_autoPopulateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93162 | 93190 | 93186 | 29 | 25 | `stopsign_evaluateCriterionA` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93191 | 93220 | 93216 | 30 | 26 | `stopsign_evaluateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93221 | 93233 | 93281 | 13 | 61 | `stopsign_evaluateCriterionC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 93234 | 93250 | 93239 | 17 | 6 | `updateSubcriterion` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 93251 | 93286 | 93257 | 36 | 7 | `updateBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 93287 | 93371 | 93367 | 85 | 81 | `stopsign_calculateLOS` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93372 | 93382 | 93378 | 11 | 7 | `stopsign_toggleHCSConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93383 | 93426 | 93422 | 44 | 40 | `stopsign_evaluateCriterionD` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93427 | 93475 | 93471 | 49 | 45 | `stopsign_evaluateAllCriteria` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 93476 | 93545 | 93541 | 70 | 66 | `stopsign_updateResultsTab` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93546 | 93556 | 93552 | 11 | 7 | `stopsign_updateResultCell` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 93557 | 93580 | 93576 | 24 | 20 | `stopsign_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93581 | 93601 | 93597 | 21 | 17 | `stopsign_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93602 | 93612 | 93608 | 11 | 7 | `stopsign_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93613 | 93631 | 93627 | 19 | 15 | `stopsign_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93632 | 93654 | 93650 | 23 | 19 | `stopsign_clearVolumeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93655 | 93716 | 93712 | 62 | 58 | `stopsign_saveData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93717 | 93814 | 93810 | 98 | 94 | `stopsign_loadSavedData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 93815 | 93856 | 93852 | 42 | 38 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93857 | 93888 | 93884 | 32 | 28 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93889 | 93897 | 93893 | 9 | 5 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93898 | 93909 | 93905 | 12 | 8 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93910 | 93951 | 93947 | 42 | 38 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 93952 | 93998 | 93994 | 47 | 43 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93999 | 94068 | 94064 | 70 | 66 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94069 | 94091 | 94087 | 23 | 19 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94092 | 94115 | 94111 | 24 | 20 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94116 | 94142 | 94138 | 27 | 23 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94143 | 94207 | 94201 | 65 | 59 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94208 | 94266 | 94262 | 59 | 55 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 94267 | 94278 | 94274 | 12 | 8 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94279 | 94290 | 94286 | 12 | 8 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94291 | 94308 | 94304 | 18 | 14 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94309 | 94320 | 94316 | 12 | 8 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94321 | 94343 | 94336 | 23 | 16 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94344 | 94408 | 94404 | 65 | 61 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94409 | 94430 | 94426 | 22 | 18 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94431 | 94474 | 94469 | 44 | 39 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94475 | 94507 | 94503 | 33 | 29 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 94508 | 94515 | 94511 | 8 | 4 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94516 | 94525 | 94521 | 10 | 6 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94526 | 94566 | 94562 | 41 | 37 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94567 | 94597 | 94593 | 31 | 27 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94598 | 94607 | 94603 | 10 | 6 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94608 | 94678 | 94674 | 71 | 67 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 94679 | 94750 | 94746 | 72 | 68 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 94751 | 94759 | 94755 | 9 | 5 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 94760 | 94837 | 94833 | 78 | 74 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94838 | 94879 | 94875 | 42 | 38 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94880 | 94890 | 94886 | 11 | 7 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94891 | 94929 | 94919 | 39 | 29 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94930 | 94950 | 94946 | 21 | 17 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94951 | 94959 | 94969 | 9 | 19 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94960 | 94973 | 94960 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94974 | 94995 | 94991 | 22 | 18 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94996 | 95007 | 95003 | 12 | 8 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95008 | 95212 | 95208 | 205 | 201 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95213 | 95341 | 95373 | 129 | 161 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95342 | 95377 | 95342 | 36 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95378 | 95468 | 95464 | 91 | 87 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95469 | 95542 | 95532 | 74 | 64 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95543 | 95889 | 95885 | 347 | 343 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95890 | 96201 | 96197 | 312 | 308 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96202 | 96301 | 96296 | 100 | 95 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96302 | 96309 | 96304 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96310 | 96346 | 96337 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 96347 | 96368 | 96364 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 96369 | 96378 | 96374 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 96379 | 96389 | 96384 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 96390 | 96428 | 96424 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96429 | 96501 | 96495 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 96502 | 96631 | 96627 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 96632 | 96674 | 96670 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96675 | 96752 | 96728 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 96753 | 96765 | 96761 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96766 | 96805 | 96800 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 96806 | 96841 | 96837 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 96842 | 96865 | 96861 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96866 | 96878 | 96873 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96879 | 96916 | 96911 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 96917 | 96972 | 96967 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 96973 | 97026 | 97022 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 97027 | 97137 | 97069 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97138 | 97156 | 97152 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 97157 | 97213 | 97209 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 97214 | 97223 | 97217 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97224 | 97331 | 97380 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 97332 | 97384 | 97332 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 97385 | 97414 | 97409 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97415 | 97502 | 97498 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 97503 | 97520 | 97515 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97521 | 97577 | 97576 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97578 | 97710 | 97690 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 97711 | 97759 | 97755 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 97760 | 97814 | 97810 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97815 | 97869 | 97865 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 97870 | 98005 | 98001 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98006 | 98037 | 98033 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 98038 | 98046 | 98041 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 98047 | 98180 | 98176 | 134 | 130 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 98181 | 98184 | 98215 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 98185 | 98189 | 98188 | 5 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 98190 | 98219 | 98193 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 98220 | 98234 | 98230 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98235 | 98253 | 98249 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 98254 | 98260 | 98256 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98261 | 98297 | 98293 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98298 | 98367 | 98363 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98368 | 98392 | 98416 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98393 | 98420 | 98399 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 98421 | 98526 | 98521 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 98527 | 98674 | 98670 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98675 | 98792 | 98788 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 98793 | 98809 | 98804 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 98810 | 99199 | 99191 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 99200 | 99220 | 99230 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99221 | 99234 | 99221 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99235 | 99267 | 99263 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99268 | 99284 | 99270 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 99285 | 99361 | 99357 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 99362 | 99395 | 99391 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99396 | 99445 | 99439 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99446 | 99517 | 99510 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 99518 | 99541 | 99537 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 99542 | 99558 | 99554 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 99559 | 99587 | 99578 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 99588 | 99666 | 99661 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 99667 | 99683 | 99679 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99684 | 99923 | 99919 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 99924 | 99998 | 100098 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 99999 | 99999 | 99999 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100000 | 100102 | 100000 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100103 | 100181 | 100227 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100182 | 100236 | 100182 | 55 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100237 | 100280 | 100276 | 44 | 40 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100281 | 100287 | 100283 | 7 | 3 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100288 | 100294 | 100290 | 7 | 3 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100295 | 100314 | 100310 | 20 | 16 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100315 | 100340 | 100336 | 26 | 22 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100341 | 100403 | 100397 | 63 | 57 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100404 | 100429 | 100425 | 26 | 22 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100430 | 100436 | 100432 | 7 | 3 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100437 | 100443 | 100439 | 7 | 3 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100444 | 100519 | 100515 | 76 | 72 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100520 | 100564 | 100560 | 45 | 41 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100565 | 100598 | 100617 | 34 | 53 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100599 | 100621 | 100599 | 23 | 1 | `peakResult` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100622 | 100637 | 100682 | 16 | 61 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100638 | 100686 | 100649 | 49 | 12 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100687 | 100723 | 100719 | 37 | 33 | `signal_evaluateWarrant5` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100724 | 100790 | 100785 | 67 | 62 | `signal_evaluateWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100791 | 100929 | 100982 | 139 | 192 | `signal_autoPopulateWarrant7` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 100930 | 100935 | 100933 | 6 | 4 | `angleCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100936 | 100940 | 100943 | 5 | 8 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100941 | 100945 | 100941 | 5 | 1 | `isPedByType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100946 | 100986 | 100949 | 41 | 4 | `countInjury` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 100987 | 100999 | 100993 | 13 | 7 | `signal_detectWarrant7Period` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101000 | 101035 | 101030 | 36 | 31 | `signal_updateWarrant7Display` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101036 | 101048 | 101082 | 13 | 47 | `signal_refreshWarrant7` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101049 | 101086 | 101049 | 38 | 1 | `formatDate` | const arrow | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 101087 | 101335 | 101331 | 249 | 245 | `signal_runAnalysis` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101336 | 101391 | 101387 | 56 | 52 | `signal_buildDayResults` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101392 | 101511 | 101507 | 120 | 116 | `signal_updateResultsDisplay` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101512 | 101591 | 101587 | 80 | 76 | `signal_buildDetailedResultsHTML` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101592 | 101607 | 101603 | 16 | 12 | `signal_switchDetailTab` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101608 | 101657 | 101653 | 50 | 46 | `signal_buildDayBreakdownTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101658 | 101707 | 101703 | 50 | 46 | `signal_buildSummaryTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101708 | 101718 | 101793 | 11 | 86 | `signal_buildWarrant1Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101719 | 101797 | 101719 | 79 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101798 | 101803 | 101848 | 6 | 51 | `signal_buildWarrant2Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101804 | 101852 | 101804 | 49 | 1 | `sortedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101853 | 101885 | 101881 | 33 | 29 | `signal_buildWarrant3Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101886 | 101935 | 101931 | 50 | 46 | `signal_buildWarrant4Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101936 | 101972 | 101968 | 37 | 33 | `signal_buildWarrant5Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 101973 | 102020 | 102016 | 48 | 44 | `signal_buildWarrant7Tab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102021 | 102063 | 102059 | 43 | 39 | `signal_buildHourlyTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102064 | 102109 | 102105 | 46 | 42 | `signal_buildRTTab` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102110 | 102124 | 102120 | 15 | 11 | `signal_switchResultTab` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102125 | 102215 | 102211 | 91 | 87 | `signal_renderMultiDayTable` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102216 | 102276 | 102272 | 61 | 57 | `signal_renderHourlyTMC` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102277 | 102351 | 102347 | 75 | 71 | `signal_renderRTAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102352 | 102366 | 102352 | 15 | 1 | `signal_addDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102367 | 102375 | 102371 | 9 | 5 | `signal_removeDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102376 | 102395 | 102391 | 20 | 16 | `signal_clearAllDays` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102396 | 102413 | 102409 | 18 | 14 | `signal_calculateDayTotal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102414 | 102430 | 102426 | 17 | 13 | `signal_editDay` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102431 | 102525 | 102521 | 95 | 91 | `signal_renderTMCGrid` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102526 | 102548 | 102544 | 23 | 19 | `signal_onTMCInput` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102549 | 102569 | 102565 | 21 | 17 | `signal_updateModalRowTotal` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102570 | 102578 | 102574 | 9 | 5 | `signal_saveTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102579 | 102585 | 102581 | 7 | 3 | `signal_closeTMCModal` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102586 | 102618 | 102614 | 33 | 29 | `signal_updateConfigFromUI` | fn | — | refs:24 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102619 | 102621 | 102652 | 3 | 34 | `signal_populateUIFromConfig` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102622 | 102622 | 102622 | 1 | 1 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 102623 | 102656 | 102623 | 34 | 1 | `setChecked` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102657 | 102695 | 102691 | 39 | 35 | `signal_onTabShow` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102696 | 102895 | 103148 | 200 | 453 | `signal_generatePDFReport` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 102896 | 103010 | 102902 | 115 | 7 | `w4Body` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103011 | 103152 | 103011 | 142 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103153 | 103193 | 103268 | 41 | 116 | `signal_exportCSV` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 103194 | 103251 | 103194 | 58 | 1 | `w1` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103252 | 103272 | 103252 | 21 | 1 | `totalVol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103273 | 103574 | 103555 | 302 | 283 | `signal_generateWordMemo` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 103575 | 103619 | 103615 | 45 | 41 | `signal_readFileContent` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 103620 | 103754 | 103937 | 135 | 318 | `signal_extractSingleFileWithDualAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 103755 | 103941 | 103755 | 187 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 103942 | 103956 | 103952 | 15 | 11 | `signal_calculateExtractedTotal` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 103957 | 104017 | 104012 | 61 | 56 | `signal_autoFillFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104018 | 104207 | 104434 | 190 | 417 | `signal_handleBulkFileUpload` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104208 | 104244 | 104213 | 37 | 6 | `hourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104245 | 104245 | 104245 | 1 | 1 | `volumes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104246 | 104318 | 104246 | 73 | 1 | `mean` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104319 | 104332 | 104319 | 14 | 1 | `issueIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104333 | 104335 | 104335 | 3 | 3 | `finalHourCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104336 | 104357 | 104336 | 22 | 1 | `allSameHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104358 | 104358 | 104358 | 1 | 1 | `successCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104359 | 104359 | 104359 | 1 | 1 | `correctedCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104360 | 104360 | 104360 | 1 | 1 | `warningCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104361 | 104374 | 104361 | 14 | 1 | `errorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104375 | 104375 | 104375 | 1 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104376 | 104438 | 104376 | 63 | 1 | `resolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104439 | 104452 | 104446 | 14 | 8 | `signal_extractAllWithAI` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104453 | 104501 | 104497 | 49 | 45 | `signal_onFilesSelected` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104502 | 104560 | 104549 | 59 | 48 | `signal_showAPIKeyWarning` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104561 | 104667 | 104663 | 107 | 103 | `signal_agent3ReExtract` | async fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104668 | 104682 | 104776 | 15 | 109 | `signal_generateDataPreview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104683 | 104720 | 104683 | 38 | 1 | `maxHoursInBatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104721 | 104739 | 104721 | 19 | 1 | `unresolvedIssues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104740 | 104780 | 104740 | 41 | 1 | `allHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104781 | 104795 | 104791 | 15 | 11 | `signal_togglePreviewRows` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104796 | 104813 | 104809 | 18 | 14 | `signal_confirmExtractedData` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104814 | 104844 | 104840 | 31 | 27 | `signal_enterReviewMode` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104845 | 104869 | 104865 | 25 | 21 | `signal_exitReviewMode` | fn | — | refs:6 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104870 | 104890 | 104886 | 21 | 17 | `signal_updateReviewQueueIndicator` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104891 | 104941 | 104937 | 51 | 47 | `signal_loadCurrentReviewData` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104942 | 104946 | 104997 | 5 | 56 | `signal_populateTMCGridFromExtraction` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 104947 | 104947 | 104947 | 1 | 1 | `extractedHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104948 | 104948 | 104948 | 1 | 1 | `hasEarlyHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104949 | 104959 | 104949 | 11 | 1 | `hasLateHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104960 | 105001 | 104960 | 42 | 1 | `allWithin12hr` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105002 | 105048 | 105042 | 47 | 41 | `signal_doPopulateTMCValues` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 105049 | 105125 | 105121 | 77 | 73 | `signal_populateTMCFromDayData` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 105126 | 105147 | 105143 | 22 | 18 | `signal_skipCurrentReview` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 105148 | 105171 | 105167 | 24 | 20 | `signal_advanceReviewQueue` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 105172 | 105194 | 105177 | 23 | 6 | `signal_rejectExtractedData` | fn | — | refs:0 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 105195 | 105230 | 105226 | 36 | 32 | `speedstudy_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105231 | 105258 | 105254 | 28 | 24 | `speedstudy_generateTableRows` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105259 | 105292 | 105288 | 34 | 30 | `speedstudy_updateTotals` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105293 | 105345 | 105341 | 53 | 49 | `speedstudy_setCountType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105346 | 105364 | 105360 | 19 | 15 | `speedstudy_updateConfigFromUI` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 105365 | 105384 | 105379 | 20 | 15 | `speedstudy_clearForm` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105385 | 105403 | 105399 | 19 | 15 | `speedstudy_initTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105404 | 105463 | 105459 | 60 | 56 | `speedstudy_addCurrentDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105464 | 105509 | 105505 | 46 | 42 | `speedstudy_renderDayCards` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105510 | 105519 | 105515 | 10 | 6 | `speedstudy_removeDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105520 | 105530 | 105526 | 11 | 7 | `speedstudy_updateDayCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105531 | 105546 | 105542 | 16 | 12 | `speedstudy_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105547 | 105573 | 105569 | 27 | 23 | `speedstudy_runAnalysis` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 105574 | 105689 | 105685 | 116 | 112 | `speedstudy_runAnalysisInternal` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 105690 | 105703 | 105699 | 14 | 10 | `speedstudy_getRecommendationReason` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105704 | 105798 | 105794 | 95 | 91 | `speedstudy_displayResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105799 | 105840 | 105835 | 42 | 37 | `speedstudy_generateHistogram` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105841 | 105935 | 106014 | 95 | 174 | `speedstudy_loadCrashData` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 105936 | 105936 | 105936 | 1 | 1 | `locWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105937 | 105939 | 105937 | 3 | 1 | `routeWords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105940 | 106018 | 105942 | 79 | 3 | `allWordsMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106019 | 106046 | 106054 | 28 | 36 | `findMatchingRoute` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106047 | 106058 | 106049 | 12 | 3 | `hasMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106059 | 106087 | 106082 | 29 | 24 | `speedstudy_calculateCrashRate` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 106088 | 106129 | 106125 | 42 | 38 | `speedstudy_updateLocationSourceIndicator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106130 | 106167 | 106162 | 38 | 33 | `speedstudy_clearLocationBinding` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106168 | 106256 | 106252 | 89 | 85 | `speedstudy_autoPopulateFromRoadProps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106257 | 106275 | 106271 | 19 | 15 | `speedstudy_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106276 | 106284 | 106280 | 9 | 5 | `speedstudy_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106285 | 106300 | 106296 | 16 | 12 | `speedstudy_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106301 | 106340 | 106333 | 40 | 33 | `speedstudy_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106341 | 106363 | 106359 | 23 | 19 | `speedstudy_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106364 | 106419 | 106415 | 56 | 52 | `speedstudy_readFileContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106420 | 106536 | 106678 | 117 | 259 | `speedstudy_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106537 | 106682 | 106537 | 146 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106683 | 106683 | 106867 | 1 | 185 | `speedstudy_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106684 | 106871 | 106684 | 188 | 1 | `files` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106872 | 106911 | 106907 | 40 | 36 | `speedstudy_populateGridFromExtraction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106912 | 106923 | 106919 | 12 | 8 | `speedstudy_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106924 | 106932 | 106928 | 9 | 5 | `speedstudy_toggleStudyType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106933 | 106945 | 106941 | 13 | 9 | `speedstudy_importFromTMC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106946 | 107084 | 107080 | 139 | 135 | `speedstudy_newStudy` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107085 | 107322 | 107546 | 238 | 462 | `speedstudy_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107323 | 107325 | 107338 | 3 | 16 | `dayRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107326 | 107326 | 107326 | 1 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107327 | 107327 | 107327 | 1 | 1 | `speeds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107328 | 107358 | 107328 | 31 | 1 | `avgP85` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107359 | 107550 | 107367 | 192 | 9 | `hourlyRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107551 | 107627 | 107690 | 77 | 140 | `speedstudy_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107628 | 107694 | 107628 | 67 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107695 | 107703 | 107699 | 9 | 5 | `speedstudy_linkToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 107704 | 107738 | 107734 | 35 | 31 | `speedstudy_saveData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107739 | 107790 | 107785 | 52 | 47 | `speedstudy_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107791 | 107803 | 107798 | 13 | 8 | `speedstudy_scheduleAutoSave` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 107804 | 107843 | 107901 | 40 | 98 | `speedstudy_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107844 | 107913 | 107844 | 70 | 1 | `totalN` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107914 | 107924 | 107920 | 11 | 7 | `streetlight_onTabShow` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107925 | 107987 | 107983 | 63 | 59 | `streetlight_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 107988 | 108035 | 108031 | 48 | 44 | `streetlight_analyzeCrashesByLight` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 108036 | 108066 | 108062 | 31 | 27 | `streetlight_calculateMetrics` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108067 | 108096 | 108154 | 30 | 88 | `streetlight_updateUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108097 | 108097 | 108104 | 1 | 8 | `conditions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108098 | 108098 | 108098 | 1 | 1 | `aIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108099 | 108158 | 108099 | 60 | 1 | `bIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108159 | 108199 | 108195 | 41 | 37 | `streetlight_evaluateWarrant` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 108200 | 108230 | 108257 | 31 | 58 | `streetlight_updateWarrantUI` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 108231 | 108258 | 108249 | 28 | 19 | `updateCriterion` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 108259 | 108270 | 108269 | 12 | 11 | `streetlight_toggleAdditionalFactors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108271 | 108281 | 108280 | 11 | 10 | `streetlight_updateAdditionalFactors` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 108282 | 108293 | 108292 | 12 | 11 | `streetlight_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108294 | 108317 | 108316 | 24 | 23 | `streetlight_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108318 | 108498 | 108497 | 181 | 180 | `streetlight_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108499 | 108559 | 108558 | 61 | 60 | `streetlight_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108560 | 108602 | 108601 | 43 | 42 | `streetlight_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108603 | 108623 | 108622 | 21 | 20 | `streetlight_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108624 | 108675 | 108667 | 52 | 44 | `streetlight_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108676 | 108755 | 108790 | 80 | 115 | `exportSignalPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108756 | 108756 | 108756 | 1 | 1 | `warrantData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108757 | 108794 | 108757 | 38 | 1 | `metWarrants` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108795 | 108878 | 109076 | 84 | 282 | `exportRoundaboutPDF` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 108879 | 108879 | 108879 | 1 | 1 | `safetyData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108880 | 109009 | 108880 | 130 | 1 | `safetyCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109010 | 109010 | 109010 | 1 | 1 | `constraintData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109011 | 109077 | 109011 | 67 | 1 | `constraintCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109078 | 109100 | 109099 | 23 | 22 | `saveWarrantProgress` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 109101 | 109140 | 109131 | 40 | 31 | `clearWarrantForm` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 109141 | 109185 | 109181 | 45 | 41 | `trafficdata_onTabShow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109186 | 109208 | 109204 | 23 | 19 | `trafficdata_updateConfig` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109209 | 109248 | 109244 | 40 | 36 | `trafficdata_syncFromWarrantSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109249 | 109267 | 109263 | 19 | 15 | `trafficdata_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109268 | 109277 | 109273 | 10 | 6 | `trafficdata_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109278 | 109286 | 109282 | 9 | 5 | `trafficdata_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109287 | 109294 | 109290 | 8 | 4 | `trafficdata_setCountType` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109295 | 109309 | 109305 | 15 | 11 | `trafficdata_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109310 | 109339 | 109335 | 30 | 26 | `trafficdata_toggleSection` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 109340 | 109412 | 109408 | 73 | 69 | `trafficdata_renderTmcTable` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 109413 | 109429 | 109425 | 17 | 13 | `trafficdata_updateTmcTotals` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109430 | 109458 | 109454 | 29 | 25 | `trafficdata_setTmcCountType` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109459 | 109473 | 109468 | 15 | 10 | `trafficdata_updateTmcDate` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109474 | 109539 | 109535 | 66 | 62 | `trafficdata_addTmcDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109540 | 109561 | 109557 | 22 | 18 | `trafficdata_clearTmcForm` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109562 | 109598 | 109594 | 37 | 33 | `trafficdata_showDaysSummary` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109599 | 109613 | 109609 | 15 | 11 | `calculateDayTotalVolume` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109614 | 109627 | 109623 | 14 | 10 | `trafficdata_deleteDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109628 | 109648 | 109644 | 21 | 17 | `trafficdata_updateDayCounts` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109649 | 109656 | 109652 | 8 | 4 | `trafficdata_updatePedCounts` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109657 | 109689 | 109685 | 33 | 29 | `trafficdata_addPedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109690 | 109715 | 109711 | 26 | 22 | `trafficdata_saveSpeedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109716 | 109798 | 109794 | 83 | 79 | `trafficdata_updateReadiness` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 109799 | 109820 | 109816 | 22 | 18 | `updateReadinessBar` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 109821 | 109867 | 109863 | 47 | 43 | `trafficdata_convertTmcToTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109868 | 109901 | 109897 | 34 | 30 | `trafficdata_convertPeakToAADT` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109902 | 109925 | 109921 | 24 | 20 | `trafficdata_calcRoundaboutVolumes` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109926 | 109983 | 109979 | 58 | 54 | `trafficdata_refreshCrashData` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 109984 | 110016 | 110012 | 33 | 29 | `trafficdata_newStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110017 | 110043 | 110039 | 27 | 23 | `trafficdata_saveStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110044 | 110059 | 110055 | 16 | 12 | `trafficdata_exportStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110060 | 110066 | 110062 | 7 | 3 | `trafficdata_loadStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110067 | 110084 | 110070 | 18 | 4 | `trafficdata_loadSavedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110085 | 110122 | 110118 | 38 | 34 | `trafficdata_onFilesSelected` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110123 | 110158 | 110154 | 36 | 32 | `trafficdata_showAPIKeyWarning` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110159 | 110280 | 110308 | 122 | 150 | `trafficdata_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110281 | 110281 | 110281 | 1 | 1 | `docTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110282 | 110312 | 110284 | 31 | 3 | `dominantType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110313 | 110400 | 110422 | 88 | 110 | `trafficdata_extractSingleFile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110401 | 110426 | 110401 | 26 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110427 | 110445 | 110441 | 19 | 15 | `trafficdata_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110446 | 110466 | 110462 | 21 | 17 | `trafficdata_clearAIUploads` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110467 | 110487 | 110483 | 21 | 17 | `trafficdata_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110488 | 110523 | 110519 | 36 | 32 | `trafficdata_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110524 | 110552 | 110548 | 29 | 25 | `trafficdata_exitReviewMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110553 | 110568 | 110564 | 16 | 12 | `trafficdata_updateReviewQueueIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110569 | 110624 | 110619 | 56 | 51 | `trafficdata_loadCurrentReviewData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110625 | 110665 | 110661 | 41 | 37 | `trafficdata_loadHourlyDataIntoGrid` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110666 | 110673 | 110669 | 8 | 4 | `trafficdata_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110674 | 110684 | 110680 | 11 | 7 | `trafficdata_updateRtAdjustment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110685 | 110728 | 110718 | 44 | 34 | `trafficdata_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110729 | 110841 | 110836 | 113 | 108 | `trafficdata_pushToSignal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110842 | 110946 | 110941 | 105 | 100 | `trafficdata_pushToStopSign` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110947 | 111050 | 111045 | 104 | 99 | `trafficdata_pushToRoundabout` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 111051 | 111128 | 111123 | 78 | 73 | `trafficdata_pushToPedCrossing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111129 | 111321 | 111209 | 193 | 81 | `trafficdata_pushToSpeedStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111322 | 111470 | 111450 | 149 | 129 | `initAuthProtection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111471 | 111479 | 111604 | 9 | 134 | `populateUserMenu` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111480 | 111606 | 111480 | 127 | 1 | `initials` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111607 | 111623 | 111612 | 17 | 6 | `toggleUserMenu` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111624 | 111630 | 111628 | 7 | 5 | `showApiKeysTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111631 | 111641 | 111639 | 11 | 9 | `handleSignOut` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111642 | 111660 | 111655 | 19 | 14 | `openBillingPortal` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111661 | 111674 | 111673 | 14 | 13 | `showAccountModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111675 | 111680 | 111679 | 6 | 5 | `closeAccountModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111681 | 111691 | 111690 | 11 | 10 | `switchAccountTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 111692 | 111898 | 111897 | 207 | 206 | `populateAccountModal` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111899 | 111950 | 111949 | 52 | 51 | `populateApiKeyTab` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111951 | 112011 | 112010 | 61 | 60 | `generateMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112012 | 112056 | 112055 | 45 | 44 | `revokeMCPApiKey` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112057 | 112070 | 112069 | 14 | 13 | `copyMCPApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112071 | 112084 | 112083 | 14 | 13 | `copyMCPConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112085 | 112125 | 112124 | 41 | 40 | `populateAccountStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112126 | 112154 | 112153 | 29 | 28 | `onAccountStateChange` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112155 | 112230 | 112203 | 76 | 49 | `saveAccountProfile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112231 | 112244 | 112243 | 14 | 13 | `checkProfileCompletion` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112245 | 112251 | 112250 | 7 | 6 | `showProfileCompletionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112252 | 112294 | 112293 | 43 | 42 | `populateProfileStateDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112295 | 112299 | 112298 | 5 | 4 | `_fipsToAbbr` | fn | — | refs:6 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112300 | 112328 | 112327 | 29 | 28 | `onProfileStateChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112329 | 112361 | 112360 | 33 | 32 | `submitProfileCompletion` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112362 | 112464 | 112364 | 103 | 3 | `skipProfileCompletion` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112465 | 112711 | 112476 | 247 | 12 | `getAssetIconInfo` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 112712 | 112800 | 112712 | 89 | 1 | `condLabel` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112801 | 112828 | 112849 | 28 | 49 | `btsFetchLayerData` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 112829 | 112857 | 112829 | 29 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112858 | 112894 | 112884 | 37 | 27 | `ensureJurisdictionBoundaryLoaded` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112895 | 112928 | 112923 | 34 | 29 | `clipBTSFeaturesToBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112929 | 112953 | 112947 | 25 | 19 | `btsGetJurisdictionBounds` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 112954 | 112985 | 112980 | 32 | 27 | `toggleBTSLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112986 | 113054 | 113050 | 69 | 65 | `addBTSLayer` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 113055 | 113106 | 113102 | 52 | 48 | `displayBTSLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 113107 | 113121 | 113117 | 15 | 11 | `removeBTSLayer` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 113122 | 113139 | 113135 | 18 | 14 | `clearBTSLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 113140 | 113157 | 113151 | 18 | 12 | `saveBTSLayerVisibility` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 113158 | 113243 | 113192 | 86 | 35 | `restoreBTSLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113244 | 113248 | 113314 | 5 | 71 | `overtureResolveLatestRelease` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113249 | 113266 | 113249 | 18 | 1 | `timer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113267 | 113284 | 113267 | 18 | 1 | `declaredLatest` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113285 | 113319 | 113285 | 35 | 1 | `headTimer` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113320 | 113631 | 113334 | 312 | 15 | `overtureGetPMTiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113632 | 113680 | 113632 | 49 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113681 | 113758 | 113681 | 78 | 1 | `icon` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 113759 | 113840 | 113836 | 82 | 78 | `overtureFetchLayerData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113841 | 113905 | 113901 | 65 | 61 | `overtureFetchTile` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113906 | 113922 | 113918 | 17 | 13 | `overtureBboxToTiles` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113923 | 113953 | 113948 | 31 | 26 | `toggleOvertureLayer` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113954 | 114020 | 114016 | 67 | 63 | `addOvertureLayer` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 114021 | 114071 | 114067 | 51 | 47 | `displayOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 114072 | 114086 | 114082 | 15 | 11 | `removeOvertureLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 114087 | 114103 | 114099 | 17 | 13 | `clearOvertureLayerCaches` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 114104 | 114119 | 114115 | 16 | 12 | `saveOvertureLayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114120 | 114300 | 114154 | 181 | 35 | `restoreOvertureLayers` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 114301 | 114312 | 114310 | 12 | 10 | `createTISpeedIcon` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 114313 | 114826 | 114322 | 514 | 10 | `createTISchoolSpeedIcon` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 114827 | 114988 | 114982 | 162 | 156 | `getTIMarkerSVG` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114989 | 115038 | 115034 | 50 | 46 | `resetTrafficInventoryForJurisdictionChange` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 115039 | 115146 | 115139 | 108 | 101 | `loadTrafficInventoryForMap` | async fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 115147 | 115191 | 115186 | 45 | 40 | `getTIParentCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115192 | 115306 | 115300 | 115 | 109 | `getTIChildCategory` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115307 | 115369 | 115363 | 63 | 57 | `classifyTIItems` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115370 | 115470 | 115466 | 101 | 97 | `consolidateTISignals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115471 | 115568 | 115564 | 98 | 94 | `addTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 115569 | 115579 | 115575 | 11 | 7 | `removeTIMapLayer` | fn | — | refs:4 | Map | `app/modules/map/map.js` |
| 115580 | 115637 | 115633 | 58 | 54 | `addTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 115638 | 115648 | 115644 | 11 | 7 | `removeTISpeedLayer` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 115649 | 115691 | 115687 | 43 | 39 | `toggleTICategory` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 115692 | 115726 | 115722 | 35 | 31 | `toggleTISpeedLayer` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115727 | 115738 | 115734 | 12 | 8 | `toggleTIExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115739 | 115747 | 115743 | 9 | 5 | `toggleTISpeedExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115748 | 115785 | 115781 | 38 | 34 | `toggleTIParent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 115786 | 115800 | 115796 | 15 | 11 | `toggleTIParentExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115801 | 115821 | 115817 | 21 | 17 | `getTIParentCheckState` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115822 | 115834 | 115830 | 13 | 9 | `getTIParentCount` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115835 | 115847 | 115843 | 13 | 9 | `updateTIParentCheckboxes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115848 | 115877 | 115873 | 30 | 26 | `saveTILayerVisibility` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 115878 | 115898 | 115894 | 21 | 17 | `loadTILayerVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115899 | 115905 | 115901 | 7 | 3 | `migrateTILegacyKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115906 | 115956 | 115952 | 51 | 47 | `restoreTILayers` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115957 | 115990 | 115986 | 34 | 30 | `showAllTILayers` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115991 | 116010 | 116005 | 20 | 15 | `hideAllTILayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116011 | 116136 | 116131 | 126 | 121 | `buildTIAssetPanelHTML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116137 | 116200 | 116196 | 64 | 60 | `updateTIMapLegend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116201 | 116212 | 116207 | 12 | 7 | `toggleTILegendCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116213 | 116242 | 116241 | 30 | 29 | `assetDbOpen` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 116243 | 116253 | 116252 | 11 | 10 | `assetDbSave` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 116254 | 116264 | 116263 | 11 | 10 | `assetDbLoadAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116265 | 116275 | 116274 | 11 | 10 | `assetDbDelete` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 116276 | 116286 | 116285 | 11 | 10 | `assetDbClearAll` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116287 | 116294 | 116293 | 8 | 7 | `assetSaveSettings` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 116295 | 116311 | 116306 | 17 | 12 | `assetLoadSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116312 | 116314 | 116343 | 3 | 32 | `assetDetectCoordinateColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116315 | 116344 | 116321 | 30 | 7 | `matchesPattern` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116345 | 116361 | 116360 | 17 | 16 | `assetDetectCoordinateFormat` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116362 | 116387 | 116386 | 26 | 25 | `assetConvertDmsToDecimal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116388 | 116410 | 116409 | 23 | 22 | `assetConvertDdmToDecimal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116411 | 116428 | 116427 | 18 | 17 | `assetConvertToDecimal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116429 | 116439 | 116434 | 11 | 6 | `assetValidateVirginiaBounds` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 116440 | 116451 | 116450 | 12 | 11 | `assetDistanceFeet` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116452 | 116471 | 116470 | 20 | 19 | `assetBuildSpatialGrid` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 116472 | 116506 | 116501 | 35 | 30 | `assetGetNearbyCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 116507 | 116523 | 116522 | 17 | 16 | `assetHandleFileSelect` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116524 | 116579 | 116578 | 56 | 55 | `assetSetupDragDrop` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116580 | 116631 | 116630 | 52 | 51 | `assetParseFile` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116632 | 116682 | 116701 | 51 | 70 | `assetParseCsv` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116683 | 116702 | 116685 | 20 | 3 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116703 | 116720 | 116736 | 18 | 34 | `assetParseExcel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116721 | 116737 | 116721 | 17 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116738 | 116764 | 116763 | 27 | 26 | `assetProcessParsedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116765 | 116773 | 116808 | 9 | 44 | `assetShowColumnModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116774 | 116809 | 116777 | 36 | 4 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116810 | 116813 | 116823 | 4 | 14 | `assetRenderColumnPreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116814 | 116816 | 116816 | 3 | 3 | `headerHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116817 | 116824 | 116821 | 8 | 5 | `bodyHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116825 | 116844 | 116843 | 20 | 19 | `assetUpdatePreviewHighlight` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 116845 | 116850 | 116873 | 6 | 29 | `assetAddAdditionalColumnRow` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116851 | 116874 | 116853 | 24 | 3 | `options` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 116875 | 116888 | 116887 | 14 | 13 | `assetOnAdditionalColumnChange` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116889 | 116895 | 116894 | 7 | 6 | `assetUpdateAdditionalColsEmptyState` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116896 | 116900 | 116899 | 5 | 4 | `assetCloseCoordModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 116901 | 116955 | 116954 | 55 | 54 | `assetConfirmColumns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116956 | 117014 | 117013 | 59 | 58 | `assetFinalizeUpload` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117015 | 117041 | 117040 | 27 | 26 | `assetShowBoundsWarning` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117042 | 117047 | 117046 | 6 | 5 | `assetCloseBoundsModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117048 | 117053 | 117058 | 6 | 11 | `assetProceedWithValid` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117054 | 117059 | 117054 | 6 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117060 | 117108 | 117103 | 49 | 44 | `assetSaveNewAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117109 | 117109 | 117248 | 1 | 140 | `assetRunAnalysis` | async fn | — | refs:17 | Analysis | `app/modules/analysis/analysis.js` |
| 117110 | 117159 | 117110 | 50 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117160 | 117256 | 117160 | 97 | 1 | `totalLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117257 | 117291 | 117352 | 35 | 96 | `assetRunAnalysisViaRpc` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 117292 | 117354 | 117292 | 63 | 1 | `allPedBike` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117355 | 117366 | 117361 | 12 | 7 | `_isPointInBounds` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117367 | 117377 | 117432 | 11 | 66 | `assetRenderList` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 117378 | 117433 | 117381 | 56 | 4 | `visibleAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117434 | 117444 | 117624 | 11 | 191 | `assetRenderResults` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 117445 | 117454 | 117447 | 10 | 3 | `hasDemoData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117455 | 117503 | 117455 | 49 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117504 | 117504 | 117504 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117505 | 117505 | 117505 | 1 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117506 | 117516 | 117506 | 11 | 1 | `totalKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117517 | 117518 | 117517 | 2 | 1 | `schoolResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117519 | 117519 | 117519 | 1 | 1 | `totalEnrollment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117520 | 117521 | 117520 | 2 | 1 | `schoolCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117522 | 117522 | 117522 | 1 | 1 | `highRiskSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117523 | 117629 | 117523 | 107 | 1 | `elementarySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117630 | 117633 | 117650 | 4 | 21 | `assetGetActiveAdditionalLabels` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117634 | 117657 | 117634 | 24 | 1 | `activeAssets` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117658 | 117668 | 117714 | 11 | 57 | `assetUpdateTableHeaders` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117669 | 117715 | 117671 | 47 | 3 | `additionalTh` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117716 | 117720 | 117719 | 5 | 4 | `assetGoToPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117721 | 117731 | 117730 | 11 | 10 | `assetSortTable` | fn | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 117732 | 117747 | 117746 | 16 | 15 | `assetShowLoading` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 117748 | 117752 | 117751 | 5 | 4 | `assetUpdateProgress` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117753 | 117768 | 117763 | 16 | 11 | `assetShowNotification` | fn | — | refs:48 | Unassigned | `app/modules/app/unassigned.js` |
| 117769 | 117783 | 117782 | 15 | 14 | `assetOnRadiusInput` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117784 | 117793 | 117792 | 10 | 9 | `assetSetRadius` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 117794 | 117806 | 117805 | 13 | 12 | `assetUpdateRadiusButtons` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 117807 | 117818 | 117827 | 12 | 21 | `assetToggleActive` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117819 | 117828 | 117819 | 10 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117829 | 117850 | 117849 | 22 | 21 | `assetDeleteAsset` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117851 | 117879 | 117878 | 29 | 28 | `assetClearAllData` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117880 | 117887 | 117967 | 8 | 88 | `assetExportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117888 | 117899 | 117888 | 12 | 1 | `hasSchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 117900 | 117913 | 117903 | 14 | 4 | `csvEscape` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 117914 | 117952 | 117951 | 39 | 38 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 117953 | 117974 | 117953 | 22 | 1 | `csv` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117975 | 118018 | 118017 | 44 | 43 | `assetViewOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118019 | 118024 | 118111 | 6 | 93 | `assetAddMapLayer` | fn | — | refs:6 | Map | `app/modules/map/map.js` |
| 118025 | 118112 | 118025 | 88 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118113 | 118119 | 118118 | 7 | 6 | `assetRemoveMapLayer` | fn | — | refs:11 | Map | `app/modules/map/map.js` |
| 118120 | 118123 | 118136 | 4 | 17 | `assetFitMapToAssets` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118124 | 118141 | 118124 | 18 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118142 | 118142 | 118169 | 1 | 28 | `assetShowOnMap` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 118143 | 118164 | 118143 | 22 | 1 | `asset` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118165 | 118177 | 118165 | 13 | 1 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118178 | 118228 | 118460 | 51 | 283 | `updateMapAssetPanel` | fn | — | refs:126 | Unassigned | `app/modules/app/unassigned.js` |
| 118229 | 118297 | 118237 | 69 | 9 | `getStatusBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118298 | 118326 | 118316 | 29 | 19 | `assetsHtml` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118327 | 118376 | 118336 | 50 | 10 | `getBTSStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118377 | 118385 | 118384 | 9 | 8 | `getBoundaryStatusBadge` | const arrow | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 118386 | 118461 | 118393 | 76 | 8 | `getDistrictsStatusBadge` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118462 | 118480 | 118478 | 19 | 17 | `toggleAssetPanelCollapse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118481 | 118613 | 118497 | 133 | 17 | `loadAssetPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118614 | 118639 | 118626 | 26 | 13 | `restorePanelSize` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 118640 | 118654 | 118653 | 15 | 14 | `toggleMapAssetLayer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118655 | 118719 | 118718 | 65 | 64 | `mapShowAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118720 | 118772 | 118771 | 53 | 52 | `mapHideAllAssets` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118773 | 118780 | 118779 | 8 | 7 | `saveMapAssetVisibility` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 118781 | 118792 | 118791 | 12 | 11 | `loadMapAssetVisibility` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118793 | 118834 | 118825 | 42 | 33 | `restoreMapAssetLayers` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118835 | 118869 | 118863 | 35 | 29 | `toggleJurisdictionBoundaryLayer` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 118870 | 118907 | 118902 | 38 | 33 | `ensureJurisdictionBoundary` | fn | — | refs:13 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 118908 | 118977 | 119041 | 70 | 134 | `addJurisdictionBoundaryLayer` | async fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 118978 | 119045 | 118980 | 68 | 3 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119046 | 119114 | 119110 | 69 | 65 | `displayJurisdictionBoundary` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119115 | 119132 | 119128 | 18 | 14 | `removeJurisdictionBoundaryLayer` | fn | — | refs:23 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119133 | 119144 | 119140 | 12 | 8 | `addTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119145 | 119163 | 119152 | 19 | 8 | `removeTigerwebAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119164 | 119245 | 119241 | 82 | 78 | `displayMPOBoundary` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119246 | 119262 | 119256 | 17 | 11 | `removeMPOBoundaryLayer` | fn | — | refs:15 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119263 | 119322 | 119318 | 60 | 56 | `displayRegionBoundary` | fn | — | refs:12 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119323 | 119341 | 119331 | 19 | 9 | `removeRegionBoundaryLayer` | fn | — | refs:11 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119342 | 119394 | 119393 | 53 | 52 | `displayPlanningDistrictBoundary` | fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119395 | 119417 | 119403 | 23 | 9 | `removePlanningDistrictBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119418 | 119447 | 119512 | 30 | 95 | `displayCityBoundary` | async fn | — | refs:3 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119448 | 119513 | 119450 | 66 | 3 | `matches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 119514 | 119530 | 119529 | 17 | 16 | `removeCityBoundaryLayer` | fn | — | refs:7 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119531 | 119539 | 119538 | 9 | 8 | `addBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119540 | 119551 | 119547 | 12 | 8 | `removeBTSMPOAttribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119552 | 119562 | 119558 | 11 | 7 | `saveJurisdictionBoundaryVisibility` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119563 | 119606 | 119600 | 44 | 38 | `loadJurisdictionBoundaryVisibility` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119607 | 119660 | 119655 | 54 | 49 | `updateJurisdictionBoundary` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119661 | 119673 | 119664 | 13 | 4 | `clearJurisdictionBoundaryCache` | fn | — | refs:4 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 119674 | 119710 | 119705 | 37 | 32 | `toggleMagisterialDistrictsLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 119711 | 119822 | 120010 | 112 | 300 | `loadMagisterialDistricts` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 119823 | 119832 | 119891 | 10 | 69 | `fetchEndpoint` | async const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119833 | 119856 | 119837 | 24 | 5 | `encodeArcGIS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119857 | 119951 | 119857 | 95 | 1 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119952 | 119952 | 119952 | 1 | 1 | `funcstatValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119953 | 120014 | 119953 | 62 | 1 | `funcstatCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
