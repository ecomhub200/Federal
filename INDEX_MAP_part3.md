# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-15 · source `app/index.html` (159387 lines)

Declarations in this part: **1059**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.

| Start L | End L | LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|
| 80031 | 80094 | 64 | `createWordDocumentWithHeaderFooter` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80095 | 80107 | 13 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80108 | 80175 | 68 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 80176 | 80189 | 14 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80190 | 80276 | 87 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 80277 | 80289 | 13 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80290 | 80373 | 84 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 80374 | 80388 | 15 | `generatePedBikeWordMemo` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 80389 | 80463 | 75 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 80464 | 80474 | 11 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80475 | 80486 | 12 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 80487 | 80538 | 52 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 80539 | 80588 | 50 | `change` | const arrow | — | refs:3026 | Unassigned | `app/modules/app/unassigned.js` |
| 80589 | 80610 | 22 | `buildCollisionTypeBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80611 | 80649 | 39 | `buildSevereCrashPatterns` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80650 | 80697 | 48 | `generateMemoRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80698 | 80750 | 53 | `generateSafetyMemoRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80751 | 80792 | 42 | `generateVRURecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80793 | 80808 | 16 | `generateTrendAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 80809 | 80819 | 11 | `totalChange` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 80820 | 80860 | 41 | `kaChange` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80861 | 80882 | 22 | `switchBAMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80883 | 80889 | 7 | `setBatchBAAnalysisType` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 80890 | 80900 | 11 | `initBALocationDropdown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 80901 | 80949 | 49 | `updateBALocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 80950 | 81015 | 66 | `filterBALocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81016 | 81023 | 8 | `handleBASearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81024 | 81066 | 43 | `triggerBASearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81067 | 81098 | 32 | `selectBASearchResult` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81099 | 81146 | 48 | `loadBALocation` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81147 | 81153 | 7 | `getMatchedCrashesFromMapSelection` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 81154 | 81156 | 3 | `computeStatsFromMapPoints` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81157 | 81165 | 9 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 81166 | 81210 | 45 | `updateBALocationSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81211 | 81246 | 36 | `selectBALocationFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81247 | 81251 | 5 | `closeBAMapModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81252 | 81259 | 8 | `goToMapForBASelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81260 | 81286 | 27 | `useMapSelectionForBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81287 | 81299 | 13 | `setBAStudyPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81300 | 81339 | 40 | `calculateBAPeriods` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81340 | 81347 | 8 | `updateBAPeriodDisplay` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81348 | 81353 | 6 | `beforeYears` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 81354 | 81359 | 6 | `afterYears` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81360 | 81385 | 26 | `updateBAMethodInfo` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81386 | 81424 | 39 | `resetBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81425 | 81466 | 42 | `runBeforeAfterAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 81467 | 81467 | 1 | `beforeYears` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 81468 | 81486 | 19 | `afterYears` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81487 | 81530 | 44 | `zScore` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81531 | 81540 | 10 | `filterCrashesByPeriod` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 81541 | 81551 | 11 | `normalCDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81552 | 81583 | 32 | `displayBAResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81584 | 81626 | 43 | `displayBAKPIComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81627 | 81628 | 2 | `displayBAStatisticalResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81629 | 81676 | 48 | `confidencePercent` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81677 | 81757 | 81 | `createBACharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81758 | 81785 | 28 | `calculateMonthlyTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81786 | 81872 | 87 | `displayBADetailedTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81873 | 81921 | 49 | `displayBAFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81922 | 81952 | 31 | `displayBAConclusions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81953 | 81957 | 5 | `printBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81958 | 82046 | 89 | `downloadBAPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82047 | 82048 | 2 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 82049 | 82177 | 129 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 82178 | 82199 | 22 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 82200 | 82309 | 110 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 82310 | 82315 | 6 | `cleanLocation` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 82316 | 82351 | 36 | `exportBAData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82352 | 82397 | 46 | `copyBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82398 | 82426 | 29 | `openBAEmailSchedule` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82427 | 82554 | 128 | `generateBAPDFForEmail` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82555 | 82561 | 7 | `cleanLocation` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 82562 | 82581 | 20 | `testBAEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82582 | 82609 | 28 | `resetTestBtn` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 82610 | 82766 | 157 | `buildBAEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82767 | 82781 | 15 | `updateBADeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82782 | 82790 | 9 | `updateBAFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82791 | 82805 | 15 | `calculateBANextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82806 | 82824 | 19 | `daysUntil` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 82825 | 82885 | 61 | `initBAMonitoringPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82886 | 82905 | 20 | `toggleBAMonitoringEnabled` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82906 | 82919 | 14 | `updateBAMonitoringLocationDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82920 | 82926 | 7 | `updateBAAlertRowStyle` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 82927 | 82931 | 5 | `toggleBAMonitorScheduleUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82932 | 82939 | 8 | `updateBAMonitorFreqUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82940 | 83004 | 65 | `saveBAMonitoringSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83005 | 83046 | 42 | `evaluateBAAlertConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83047 | 83070 | 24 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 83071 | 83104 | 34 | `changePercent` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83105 | 83181 | 77 | `buildBAAlertEmailHtml` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83182 | 83284 | 103 | `sendBAMonitoringTestAlert` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83285 | 83314 | 30 | `renderBAMonitoringStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83315 | 83323 | 9 | `checkBAMonitoringOnDataLoad` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83324 | 83406 | 83 | `cooldownMs` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83407 | 83430 | 24 | `addBAMonitorSubscriber` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83431 | 83437 | 7 | `removeBAMonitorSubscriber` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83438 | 83465 | 28 | `refreshBAMonitorSubscriberChips` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83466 | 83476 | 11 | `syncBAMonitoringToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83477 | 83477 | 1 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 83478 | 83478 | 1 | `jurisdictionId` | const arrow | — | refs:281 | Unassigned | `app/modules/app/unassigned.js` |
| 83479 | 83486 | 8 | `roadType` | const arrow | — | refs:103 | Unassigned | `app/modules/app/unassigned.js` |
| 83487 | 83542 | 56 | `recipients` | const arrow | — | refs:25 | Unassigned | `app/modules/app/unassigned.js` |
| 83543 | 83567 | 25 | `deleteBAMonitoringFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83568 | 83577 | 10 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83578 | 83601 | 24 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83602 | 83619 | 18 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 83620 | 83651 | 32 | `loadSavedKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83652 | 83687 | 36 | `handleAIFileSelect` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83688 | 83698 | 11 | `renderAttachments` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83699 | 83703 | 5 | `removeAttachment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83704 | 83708 | 5 | `askSuggestion` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 83709 | 83768 | 60 | `clearAIChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83769 | 83773 | 5 | `clearApiKey` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 83774 | 83812 | 39 | `addMessage` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 83813 | 83825 | 13 | `addTypingIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83826 | 83830 | 5 | `removeTypingIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83831 | 83899 | 69 | `buildCrashDataContext` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 83900 | 83908 | 9 | `initMUTCDLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83909 | 83924 | 16 | `loadMUTCDLocation` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 83925 | 83931 | 7 | `clearMUTCDLocation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83932 | 83951 | 20 | `loadMUTCDIndex` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 83952 | 84086 | 135 | `buildMUTCDContext` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84087 | 84164 | 78 | `queryPineconeRAG` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84165 | 84268 | 104 | `buildPineconeRAGContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84269 | 84280 | 12 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 84281 | 84308 | 28 | `epdo` | const arrow | — | refs:982 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 84309 | 84698 | 390 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 84699 | 84761 | 63 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 84762 | 84773 | 12 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 84774 | 84914 | 141 | `updateProgress` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 84915 | 84968 | 54 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84969 | 85052 | 84 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85053 | 85117 | 65 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85118 | 85257 | 140 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85258 | 85301 | 44 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 85302 | 85352 | 51 | `updateProgress` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 85353 | 85358 | 6 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 85359 | 85407 | 49 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 85408 | 85412 | 5 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 85413 | 85443 | 31 | `askMUTCDForSafetyCategory` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 85444 | 85472 | 29 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 85473 | 85496 | 24 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 85497 | 85509 | 13 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85510 | 85522 | 13 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85523 | 85527 | 5 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 85528 | 85532 | 5 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85533 | 85550 | 18 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85551 | 85553 | 3 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 85554 | 85645 | 92 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 85646 | 85673 | 28 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 85674 | 85774 | 101 | `buildSystemPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85775 | 85781 | 7 | `getAIAnalysisContext` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 85782 | 85929 | 148 | `drawingTimestamp` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85930 | 85936 | 7 | `buildLocationCrashContext` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 85937 | 85961 | 25 | `updateAIContextIndicator` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 85962 | 86004 | 43 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 86005 | 86021 | 17 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86022 | 86040 | 19 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86041 | 86049 | 9 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86050 | 86176 | 127 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 86177 | 86220 | 44 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86221 | 86278 | 58 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86279 | 86314 | 36 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86315 | 86380 | 66 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86381 | 86420 | 40 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86421 | 86445 | 25 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86446 | 86592 | 147 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 86593 | 86596 | 4 | `initDomainKnowledge` | fn | — | refs:1 | AI Mode | `app/modules/ai/ai.js` |
| 86597 | 86646 | 50 | `_tabTier` | const arrow | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 86647 | 86660 | 14 | `shouldUseQdrantProxy` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86661 | 86700 | 40 | `qdrantFetch` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 86701 | 86753 | 53 | `initQdrantConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86754 | 86759 | 6 | `qdrantGetCollections` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86760 | 86774 | 15 | `qdrantCreateCollection` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86775 | 86797 | 23 | `qdrantCreatePayloadIndex` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86798 | 86807 | 10 | `qdrantEnsurePayloadIndexes` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 86808 | 86833 | 26 | `qdrantSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86834 | 86843 | 10 | `qdrantGetCollectionInfo` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86844 | 86852 | 9 | `qdrantUpsertPoints` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86853 | 86888 | 36 | `testQdrantConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86889 | 86915 | 27 | `voyageEmbed` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 86916 | 86921 | 6 | `voyageEmbedQuery` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86922 | 86926 | 5 | `voyageEmbedDocuments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86927 | 86948 | 22 | `testVoyageConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86949 | 86981 | 33 | `ragSearch` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86982 | 86992 | 11 | `generateQdrantId` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86993 | 87029 | 37 | `indexDocument` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87030 | 87072 | 43 | `indexDocumentsBatch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87073 | 87112 | 40 | `testRAGPipeline` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87113 | 87202 | 90 | `indexSampleDocuments` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87203 | 87207 | 5 | `populateDKLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87208 | 87265 | 58 | `updateDKLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87266 | 87319 | 54 | `filterDKLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87320 | 87326 | 7 | `handleDKSearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87327 | 87332 | 6 | `triggerDKSearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87333 | 87345 | 13 | `selectDKSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87346 | 87375 | 30 | `loadDKLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87376 | 87403 | 28 | `loadDKCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 87404 | 87416 | 13 | `applyDKDateFilter` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87417 | 87425 | 9 | `applyDKDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87426 | 87444 | 19 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 87445 | 87462 | 18 | `clearDKDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87463 | 87476 | 14 | `updateDKDateFilterStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87477 | 87494 | 18 | `applyDKDateFilterInternal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87495 | 87564 | 70 | `buildDKCrashProfile` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 87565 | 87584 | 20 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 87585 | 87588 | 4 | `renderDomainKnowledgeSources` | fn | — | refs:5 | AI Mode | `app/modules/ai/ai.js` |
| 87589 | 87618 | 30 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 87619 | 87639 | 21 | `escapeHtml` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87640 | 87653 | 14 | `toggleDKSource` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 87654 | 87664 | 11 | `syncDKSourcesFromUI` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87665 | 87679 | 15 | `autoSelectDKSources` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87680 | 87711 | 32 | `_dkCheck` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 87712 | 87717 | 6 | `selectDKFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87718 | 87722 | 5 | `enableDKPolygonMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87723 | 87736 | 14 | `clearDKChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87737 | 87743 | 7 | `askDKSuggestion` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87744 | 87790 | 47 | `askDKQuestion` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87791 | 87809 | 19 | `buildDKContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87810 | 87821 | 12 | `_dkResolveOpenAIKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87822 | 87833 | 12 | `loadCorpusCounts` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87834 | 87840 | 7 | `pendingCount` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 87841 | 87867 | 27 | `key` | const arrow | — | refs:1934 | Unassigned | `app/modules/app/unassigned.js` |
| 87868 | 87934 | 67 | `embedPendingCorpus` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87935 | 87939 | 5 | `_dkOpenAIEmbed` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87940 | 87954 | 15 | `apiKey` | const arrow | — | refs:256 | Unassigned | `app/modules/app/unassigned.js` |
| 87955 | 87960 | 6 | `_dkPgvectorSearch` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87961 | 87983 | 23 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 87984 | 88015 | 32 | `queryDKSources` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88016 | 88121 | 106 | `_key` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 88122 | 88148 | 27 | `callClaudeSimple` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88149 | 88161 | 13 | `getActiveApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88162 | 88197 | 36 | `addDKMessage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88198 | 88222 | 25 | `showDKCitation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88223 | 88241 | 19 | `updateDKSourcesPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88242 | 88260 | 19 | `loadDKStreetView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 88261 | 88273 | 13 | `switchDKStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88274 | 88279 | 6 | `changeDKViewDirection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88280 | 88293 | 14 | `toggleDKReferencePanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88294 | 88298 | 5 | `attachDKImage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88299 | 88457 | 159 | `runDKDeepAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88458 | 88552 | 95 | `wideCrossing` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88553 | 88574 | 22 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88575 | 88592 | 18 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88593 | 88599 | 7 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88600 | 88658 | 59 | `crashes` | const arrow | — | refs:3180 | Analysis | `app/modules/analysis/analysis.js` |
| 88659 | 88680 | 22 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88681 | 88717 | 37 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88718 | 88789 | 72 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88790 | 88804 | 15 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 88805 | 88909 | 105 | `manner` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88910 | 88938 | 29 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88939 | 88980 | 42 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88981 | 89016 | 36 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89017 | 89020 | 4 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 89021 | 89036 | 16 | `radiusM` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 89037 | 89042 | 6 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89043 | 89058 | 16 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 89059 | 89126 | 68 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 89127 | 89137 | 11 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 89138 | 89157 | 20 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 89158 | 89194 | 37 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89195 | 89230 | 36 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 89231 | 89286 | 56 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 89287 | 89345 | 59 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 89346 | 89364 | 19 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89365 | 89383 | 19 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89384 | 89403 | 20 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89404 | 89405 | 2 | `stateConfig` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 89406 | 89408 | 3 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 89409 | 89472 | 64 | `baseUrl` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 89473 | 89495 | 23 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89496 | 89561 | 66 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 89562 | 89597 | 36 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 89598 | 89621 | 24 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89622 | 89657 | 36 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89658 | 89688 | 31 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89689 | 89730 | 42 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 89731 | 89764 | 34 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89765 | 89821 | 57 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89822 | 89876 | 55 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89877 | 89905 | 29 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 89906 | 89925 | 20 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 89926 | 89931 | 6 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89932 | 89941 | 10 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89942 | 89964 | 23 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89965 | 89988 | 24 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89989 | 90010 | 22 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90011 | 90138 | 128 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 90139 | 90160 | 22 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 90161 | 90221 | 61 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 90222 | 90268 | 47 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90269 | 90292 | 24 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 90293 | 90356 | 64 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 90357 | 90449 | 93 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90450 | 90579 | 130 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90580 | 90607 | 28 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90608 | 90636 | 29 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90637 | 90646 | 10 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90647 | 90690 | 44 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90691 | 90706 | 16 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90707 | 90738 | 32 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90739 | 90798 | 60 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90799 | 90853 | 55 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90854 | 90879 | 26 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90880 | 90914 | 35 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 90915 | 90968 | 54 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90969 | 90988 | 20 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90989 | 91000 | 12 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91001 | 91009 | 9 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 91010 | 91021 | 12 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91022 | 91027 | 6 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 91028 | 91038 | 11 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91039 | 91044 | 6 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91045 | 91052 | 8 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 91053 | 91091 | 39 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 91092 | 91118 | 27 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91119 | 91247 | 129 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91248 | 91273 | 26 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91274 | 91501 | 228 | `checkPageBreak` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 91502 | 91509 | 8 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91510 | 91520 | 11 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 91521 | 91554 | 34 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 91555 | 91566 | 12 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 91567 | 91577 | 11 | `daysDiff` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91578 | 91582 | 5 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 91583 | 91588 | 6 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 91589 | 91611 | 23 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 91612 | 91628 | 17 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 91629 | 91637 | 9 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91638 | 91654 | 17 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 91655 | 91670 | 16 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91671 | 91698 | 28 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91699 | 91739 | 41 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91740 | 91764 | 25 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91765 | 91789 | 25 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91790 | 91840 | 51 | `loadCMFDatabase` | async fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91841 | 91869 | 29 | `transformCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91870 | 91917 | 48 | `showCMFLoadedStatus` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91918 | 91927 | 10 | `initCMFLocationDropdown` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91928 | 91979 | 52 | `updateCMFLocationDropdown` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 91980 | 92028 | 49 | `buildCMFSearchData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92029 | 92034 | 6 | `populateCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92035 | 92042 | 8 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 92043 | 92092 | 50 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 92093 | 92106 | 14 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92107 | 92175 | 69 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92176 | 92178 | 3 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 92179 | 92216 | 38 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92217 | 92334 | 118 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 92335 | 92355 | 21 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 92356 | 92409 | 54 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92410 | 92437 | 28 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 92438 | 92447 | 10 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 92448 | 92453 | 6 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 92454 | 92519 | 66 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92520 | 92533 | 14 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92534 | 92541 | 8 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92542 | 92597 | 56 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92598 | 92617 | 20 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92618 | 92624 | 7 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92625 | 92665 | 41 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 92666 | 92676 | 11 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 92677 | 92685 | 9 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 92686 | 92731 | 46 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92732 | 92751 | 20 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92752 | 92753 | 2 | `reqToken` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 92754 | 92843 | 90 | `tierInfo` | const arrow | — | refs:19 | Core/Tier | `app/modules/core/tier.js` |
| 92844 | 92956 | 113 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 92957 | 92960 | 4 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 92961 | 93001 | 41 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 93002 | 93022 | 21 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93023 | 93051 | 29 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93052 | 93065 | 14 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 93066 | 93073 | 8 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93074 | 93091 | 18 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 93092 | 93110 | 19 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93111 | 93128 | 18 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93129 | 93149 | 21 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93150 | 93161 | 12 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93162 | 93171 | 10 | `defectPct` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 93172 | 93183 | 12 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93184 | 93214 | 31 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93215 | 93222 | 8 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93223 | 93296 | 74 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 93297 | 93301 | 5 | `workPct` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93302 | 93318 | 17 | `schoolPct` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93319 | 93387 | 69 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93388 | 93419 | 32 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93420 | 93430 | 11 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93431 | 93455 | 25 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93456 | 93480 | 25 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93481 | 93509 | 29 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93510 | 93518 | 9 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93519 | 93535 | 17 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93536 | 93554 | 19 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93555 | 93560 | 6 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93561 | 93571 | 11 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93572 | 93590 | 19 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93591 | 93601 | 11 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93602 | 93611 | 10 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93612 | 93654 | 43 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93655 | 93706 | 52 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 93707 | 93768 | 62 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 93769 | 93804 | 36 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93805 | 93857 | 53 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93858 | 93890 | 33 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93891 | 93929 | 39 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93930 | 93934 | 5 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93935 | 93966 | 32 | `elapsedSec` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93967 | 93973 | 7 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 93974 | 94206 | 233 | `duration` | const arrow | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 94207 | 94241 | 35 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94242 | 94270 | 29 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94271 | 94280 | 10 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94281 | 94291 | 11 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94292 | 94307 | 16 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94308 | 94324 | 17 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94325 | 94336 | 12 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94337 | 94360 | 24 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94361 | 94386 | 26 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 94387 | 94387 | 1 | `weekdayPct` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 94388 | 94422 | 35 | `weekendPct` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 94423 | 94448 | 26 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94449 | 94648 | 200 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 94649 | 94665 | 17 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94666 | 94703 | 38 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94704 | 94744 | 41 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 94745 | 94747 | 3 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 94748 | 94762 | 15 | `nameLower` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94763 | 94795 | 33 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94796 | 94797 | 2 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94798 | 94850 | 53 | `cmfNameLower` | const arrow | — | refs:220 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94851 | 94856 | 6 | `pedPct` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 94857 | 94862 | 6 | `bikePct` | const arrow | — | refs:9 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 94863 | 94868 | 6 | `nightPct` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 94869 | 94885 | 17 | `distractedPct` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 94886 | 94887 | 2 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94888 | 94888 | 1 | `cmfNameLower` | const arrow | — | refs:220 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94889 | 94959 | 71 | `cmfCatLower` | const arrow | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94960 | 94987 | 28 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94988 | 95092 | 105 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95093 | 95237 | 145 | `crashTypesFiltered` | const arrow | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 95238 | 95275 | 38 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 95276 | 95289 | 14 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95290 | 95302 | 13 | `addPageFooter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95303 | 95310 | 8 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 95311 | 95318 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 95319 | 95329 | 11 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 95330 | 95399 | 70 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95400 | 95447 | 48 | `infoBoxWidth` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 95448 | 95474 | 27 | `metricBoxWidth` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95475 | 95705 | 231 | `box2Width` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95706 | 95769 | 64 | `mapCrashes` | const arrow | — | refs:24 | Analysis | `app/modules/analysis/analysis.js` |
| 95770 | 95891 | 122 | `tableHalfWidth` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 95892 | 95906 | 15 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 95907 | 96086 | 180 | `envColWidth` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 96087 | 96459 | 373 | `tempColWidth` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 96460 | 96723 | 264 | `metricColWidth` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96724 | 96730 | 7 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96731 | 96735 | 5 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 96736 | 96787 | 52 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 96788 | 96789 | 2 | `severityScore` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 96790 | 96797 | 8 | `hasKAcrashes` | const arrow | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 96798 | 96851 | 54 | `intPct` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 96852 | 96904 | 53 | `blendedWeight` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96905 | 97103 | 199 | `cmfDescLower` | const arrow | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 97104 | 97136 | 33 | `cmfDiv` | const arrow | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 97137 | 97137 | 1 | `kaPct` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 97138 | 97368 | 231 | `injuryPct` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 97369 | 97369 | 1 | `amPct` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97370 | 97370 | 1 | `pmPct` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97371 | 97522 | 152 | `nightPeriodPct` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 97523 | 97712 | 190 | `cmfDescLower` | const arrow | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 97713 | 97861 | 149 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97862 | 98177 | 316 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98178 | 98236 | 59 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98237 | 98251 | 15 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98252 | 98270 | 19 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98271 | 98292 | 22 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98293 | 98302 | 10 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 98303 | 98318 | 16 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98319 | 98349 | 31 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98350 | 98362 | 13 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 98363 | 98483 | 121 | `avgCrashCost` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 98484 | 98496 | 13 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98497 | 98504 | 8 | `intPct` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 98505 | 98521 | 17 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98522 | 98525 | 4 | `crashTypes` | const arrow | — | refs:5900 | Analysis | `app/modules/analysis/analysis.js` |
| 98526 | 98550 | 25 | `reasons` | const arrow | — | refs:146 | Unassigned | `app/modules/app/unassigned.js` |
| 98551 | 98559 | 9 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98560 | 98594 | 35 | `crashTypes` | const arrow | — | refs:5900 | Analysis | `app/modules/analysis/analysis.js` |
| 98595 | 98614 | 20 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98615 | 98622 | 8 | `intPct` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 98623 | 98660 | 38 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98661 | 98665 | 5 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 98666 | 99069 | 404 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 99070 | 99117 | 48 | `intAnalysis` | const arrow | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 99118 | 99136 | 19 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 99137 | 99317 | 181 | `harmful` | const arrow | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 99318 | 99342 | 25 | `queryCMFForSafetyCategory` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 99343 | 99370 | 28 | `searchText` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 99371 | 99393 | 23 | `searchText` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 99394 | 99442 | 49 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 99443 | 99492 | 50 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99493 | 99510 | 18 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99511 | 99611 | 101 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99612 | 99622 | 11 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99623 | 99656 | 34 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 99657 | 99660 | 4 | `fhe` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 99661 | 99671 | 11 | `wildAnimal` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99672 | 99672 | 1 | `tu1` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 99673 | 99687 | 15 | `tu2` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 99688 | 99703 | 16 | `intType` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 99704 | 99780 | 77 | `initSafetyFocus` | fn | — | refs:5 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 99781 | 99804 | 24 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 99805 | 99833 | 29 | `applySafetyFilters` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 99834 | 99841 | 8 | `clearSafetyDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99842 | 99961 | 120 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 99962 | 100008 | 47 | `processSafetyDataForReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100009 | 100091 | 83 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 100092 | 100092 | 1 | `isNight` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 100093 | 100153 | 61 | `isPed` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 100154 | 100154 | 1 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 100155 | 100171 | 17 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 100172 | 100181 | 10 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 100182 | 100207 | 26 | `count` | const arrow | — | refs:3744 | Unassigned | `app/modules/app/unassigned.js` |
| 100208 | 100209 | 2 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100210 | 100281 | 72 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 100282 | 100333 | 52 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100334 | 100449 | 116 | `selectSafetyCategory` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 100450 | 100454 | 5 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 100455 | 100460 | 6 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 100461 | 100470 | 10 | `hasVisibleCards` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100471 | 100483 | 13 | `hasVisibleCards` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100484 | 100538 | 55 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100539 | 100594 | 56 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100595 | 100651 | 57 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100652 | 100708 | 57 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100709 | 100720 | 12 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100721 | 100818 | 98 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 100819 | 100835 | 17 | `_safetyFocusHasCofactors` | async fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 100836 | 100846 | 11 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100847 | 100871 | 25 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100872 | 100872 | 1 | `speed` | const arrow | — | refs:3508 | Unassigned | `app/modules/app/unassigned.js` |
| 100873 | 100873 | 1 | `senior` | const arrow | — | refs:196 | Unassigned | `app/modules/app/unassigned.js` |
| 100874 | 100874 | 1 | `young` | const arrow | — | refs:188 | Unassigned | `app/modules/app/unassigned.js` |
| 100875 | 100875 | 1 | `night` | const arrow | — | refs:840 | Unassigned | `app/modules/app/unassigned.js` |
| 100876 | 100876 | 1 | `alcohol` | const arrow | — | refs:205 | Unassigned | `app/modules/app/unassigned.js` |
| 100877 | 100877 | 1 | `drug` | const arrow | — | refs:86 | Unassigned | `app/modules/app/unassigned.js` |
| 100878 | 100907 | 30 | `distracted` | const arrow | — | refs:230 | Unassigned | `app/modules/app/unassigned.js` |
| 100908 | 100947 | 40 | `updateSafetyLocationTable` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 100948 | 100994 | 47 | `j` | const arrow | — | refs:9414 | Unassigned | `app/modules/app/unassigned.js` |
| 100995 | 101000 | 6 | `renderSafetyLocationRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101001 | 101027 | 27 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 101028 | 101038 | 11 | `goToSafetyPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101039 | 101063 | 25 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101064 | 101078 | 15 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101079 | 101101 | 23 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101102 | 101123 | 22 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 101124 | 101134 | 11 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 101135 | 101139 | 5 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 101140 | 101144 | 5 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 101145 | 101152 | 8 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 101153 | 101170 | 18 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101171 | 101178 | 8 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101179 | 101217 | 39 | `updateSfDetailPanel` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101218 | 101386 | 169 | `aggregateSfDetailData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 101387 | 101391 | 5 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 101392 | 101395 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 101396 | 101399 | 4 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 101400 | 101453 | 54 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 101454 | 101496 | 43 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101497 | 101513 | 17 | `renderSfDetailContent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 101514 | 101516 | 3 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101517 | 101518 | 2 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 101519 | 101729 | 211 | `vruPct` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 101730 | 101752 | 23 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 101753 | 101762 | 10 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101763 | 101825 | 63 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 101826 | 101839 | 14 | `renderSfMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101840 | 101869 | 30 | `getHeatmapColor` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101870 | 101887 | 18 | `initSfDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 101888 | 102047 | 160 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102048 | 102085 | 38 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102086 | 102139 | 54 | `exportSfDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102140 | 102166 | 27 | `exportSfDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102167 | 102169 | 3 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 102170 | 102186 | 17 | `vruPct` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 102187 | 102198 | 12 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 102199 | 102210 | 12 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 102211 | 102223 | 13 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 102224 | 102242 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 102243 | 102250 | 8 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 102251 | 102307 | 57 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 102308 | 102373 | 66 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 102374 | 102422 | 49 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 102423 | 102495 | 73 | `chartW` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 102496 | 102649 | 154 | `yrEpdo` | const arrow | — | refs:3 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 102650 | 102948 | 299 | `factorCardW` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 102949 | 102971 | 23 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102972 | 102984 | 13 | `exportSafetyData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 102985 | 102994 | 10 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102995 | 103007 | 13 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 103008 | 103027 | 20 | `val` | const arrow | — | refs:6013 | Unassigned | `app/modules/app/unassigned.js` |
| 103028 | 103050 | 23 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103051 | 103063 | 13 | `exportSafetyData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 103064 | 103073 | 10 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103074 | 103086 | 13 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 103087 | 103106 | 20 | `val` | const arrow | — | refs:6013 | Unassigned | `app/modules/app/unassigned.js` |
| 103107 | 103150 | 44 | `exportSafetyCategoryPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103151 | 103162 | 12 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 103163 | 103174 | 12 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 103175 | 103187 | 13 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 103188 | 103206 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 103207 | 103270 | 64 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 103271 | 103303 | 33 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 103304 | 103365 | 62 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 103366 | 103416 | 51 | `factorCardW` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 103417 | 103420 | 4 | `chartW` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 103421 | 103464 | 44 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 103465 | 103797 | 333 | `drawNativeHBarChart` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 103798 | 103886 | 89 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 103887 | 103901 | 15 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103902 | 103943 | 42 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 103944 | 103955 | 12 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 103956 | 103967 | 12 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 103968 | 103980 | 13 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 103981 | 103988 | 8 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 103989 | 104238 | 250 | `checkPageBreak` | fn | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 104239 | 104301 | 63 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 104302 | 104387 | 86 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 104388 | 104565 | 178 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 104566 | 104595 | 30 | `runSafetyDataCheck` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 104596 | 104604 | 9 | `sfAddCheck` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 104605 | 104647 | 43 | `sfCheckSeverityTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104648 | 104681 | 34 | `sfCheckEPDOCalculations` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 104682 | 104726 | 45 | `sfCheckCategorySums` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104727 | 104759 | 33 | `sfCheckLocationTableConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104760 | 104890 | 131 | `sfCheckCrossAnalysisConsistency` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 104891 | 104963 | 73 | `sfCheckFilterConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104964 | 105120 | 157 | `sfCheckDetailPanelAccuracy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105121 | 105161 | 41 | `sfCheckPercentageDenominators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105162 | 105174 | 13 | `displaySafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105175 | 105241 | 67 | `statusIcon` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 105242 | 105262 | 21 | `exportSafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105263 | 105280 | 18 | `viewSafetyOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105281 | 105298 | 18 | `viewSafetyLocationOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105299 | 105352 | 54 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105353 | 105369 | 17 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105370 | 105392 | 23 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105393 | 105393 | 1 | `initCrashTreeTab` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105394 | 105444 | 51 | `_ctTier` | const arrow | — | refs:3 | Core/Tier | `app/modules/core/tier.js` |
| 105445 | 105445 | 1 | `initCrashTreeFromMatview` | async fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105446 | 105478 | 33 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 105479 | 105489 | 11 | `idSafe` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 105490 | 105490 | 1 | `l1` | const arrow | — | refs:40 | Unassigned | `app/modules/app/unassigned.js` |
| 105491 | 105491 | 1 | `l2` | const arrow | — | refs:61 | Unassigned | `app/modules/app/unassigned.js` |
| 105492 | 105513 | 22 | `l3` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 105514 | 105556 | 43 | `buildNode` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 105557 | 105624 | 68 | `propagateSeverity` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105625 | 105656 | 32 | `setCrashTreeType` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105657 | 105687 | 31 | `_ctTier` | const arrow | — | refs:3 | Core/Tier | `app/modules/core/tier.js` |
| 105688 | 105698 | 11 | `toggleCrashTreeSeverity` | fn | — | refs:5 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105699 | 105723 | 25 | `updateCrashTreeSeverity` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105724 | 105758 | 35 | `setTreeSeverityPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105759 | 105788 | 30 | `applyCrashTreeDateFilter` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105789 | 105794 | 6 | `setCrashTreeDatePreset` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105795 | 105825 | 31 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 105826 | 105854 | 29 | `clearCrashTreeDateFilter` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105855 | 105866 | 12 | `updateCrashTreeDateFilterStatus` | fn | — | refs:4 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105867 | 105881 | 15 | `formatDisplay` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105882 | 105895 | 14 | `getCrashTreeFilteredCrashes` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105896 | 105920 | 25 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 105921 | 105952 | 32 | `getCrashTreeDateOnlyFilteredCrashes` | fn | — | refs:6 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105953 | 105974 | 22 | `refreshCrashTreeAnalysis` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 105975 | 106007 | 33 | `buildCrashTreeData` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 106008 | 106031 | 24 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 106032 | 106053 | 22 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106054 | 106061 | 8 | `buildFacilityTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106062 | 106064 | 3 | `countSeverity` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 106065 | 106071 | 7 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106072 | 106076 | 5 | `getUnfilteredTotal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 106077 | 106079 | 3 | `getUnfilteredKA` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 106080 | 106090 | 11 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106091 | 106094 | 4 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106095 | 106098 | 4 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106099 | 106103 | 5 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106104 | 106107 | 4 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106108 | 106111 | 4 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106112 | 106117 | 6 | `ctrl` | const arrow | — | refs:64 | Unassigned | `app/modules/app/unassigned.js` |
| 106118 | 106121 | 4 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106122 | 106125 | 4 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106126 | 106130 | 5 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106131 | 106134 | 4 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106135 | 106138 | 4 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106139 | 106208 | 70 | `fc` | const arrow | — | refs:1215 | Unassigned | `app/modules/app/unassigned.js` |
| 106209 | 106227 | 19 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106228 | 106234 | 7 | `buildCrashTypeTree` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 106235 | 106237 | 3 | `countSeverity` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 106238 | 106244 | 7 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106245 | 106245 | 1 | `getCrashCategory` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 106246 | 106264 | 19 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 106265 | 106311 | 47 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 106312 | 106329 | 18 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106330 | 106338 | 9 | `buildContributingFactorsTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106339 | 106341 | 3 | `countSeverity` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 106342 | 106348 | 7 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106349 | 106353 | 5 | `getUnfilteredTotal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 106354 | 106356 | 3 | `getUnfilteredKA` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 106357 | 106521 | 165 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 106522 | 106525 | 4 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 106526 | 106531 | 6 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 106532 | 106535 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 106536 | 106539 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 106540 | 106543 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 106544 | 106548 | 5 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 106549 | 106552 | 4 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 106553 | 106556 | 4 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 106557 | 106846 | 290 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 106847 | 106890 | 44 | `renderCrashTree` | fn | — | refs:18 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 106891 | 106908 | 18 | `navigateFromCrashTree` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 106909 | 106934 | 26 | `renderTreeNode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106935 | 106946 | 12 | `buildSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106947 | 107010 | 64 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 107011 | 107021 | 11 | `toggleCrashTreeNode` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107022 | 107022 | 1 | `expandAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107023 | 107034 | 12 | `addAllIds` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107035 | 107040 | 6 | `collapseAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107041 | 107082 | 42 | `autoExpandDominantPath` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 107083 | 107095 | 13 | `findNodeById` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 107096 | 107124 | 29 | `getTreeTypeLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 107125 | 107185 | 61 | `updateCrashTreeSummary` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107186 | 107221 | 36 | `updateCrashTreeStats` | fn | — | refs:13 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107222 | 107257 | 36 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 107258 | 107262 | 5 | `updateCrashTreeDataTable` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107263 | 107298 | 36 | `addRows` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107299 | 107309 | 11 | `analyzeRiskFactors` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107310 | 107380 | 71 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 107381 | 107514 | 134 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 107515 | 107576 | 62 | `buildSecondaryTreeAnalysis` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 107577 | 107599 | 23 | `getTreeLabel` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107600 | 107629 | 30 | `cKA` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 107630 | 107656 | 27 | `exportCrashTreeImage` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107657 | 107680 | 24 | `generateCrashTreeReport` | async fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 107681 | 107711 | 31 | `kaTotal` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 107712 | 107748 | 37 | `_treeRows` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107749 | 107749 | 1 | `kaCount` | const arrow | — | refs:71 | Unassigned | `app/modules/app/unassigned.js` |
| 107750 | 107794 | 45 | `allPct` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 107795 | 107879 | 85 | `diff` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 107880 | 107883 | 4 | `buildTreeBreakdownHtml` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107884 | 107885 | 2 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 107886 | 107929 | 44 | `subKa` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107930 | 107945 | 16 | `analysisOverviewHtml` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 107946 | 107946 | 1 | `_activeStateKey` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 107947 | 109092 | 1146 | `_activeStateName` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109093 | 109137 | 45 | `generateProfessionalTableRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109138 | 109147 | 10 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 109148 | 109156 | 9 | `t` | const arrow | — | refs:641078 | Unassigned | `app/modules/app/unassigned.js` |
| 109157 | 109160 | 4 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109161 | 109170 | 10 | `_fsTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 109171 | 109187 | 17 | `tabRows` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109188 | 109188 | 1 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109189 | 109204 | 16 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 109205 | 109208 | 4 | `_fsFetchFatalFactors` | const arrow | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109209 | 109215 | 7 | `_fsFetchSpeedSummary` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109216 | 109484 | 269 | `_fsFetchSpeedSevMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109485 | 109534 | 50 | `speedKAll` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109535 | 109546 | 12 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109547 | 109556 | 10 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 109557 | 109567 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 109568 | 109572 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 109573 | 109603 | 31 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 109604 | 109683 | 80 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109684 | 109687 | 4 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 109688 | 109691 | 4 | `_calcEpdo` | const arrow | — | refs:10 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 109692 | 109701 | 10 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 109702 | 109765 | 64 | `yr` | const arrow | — | refs:155 | Unassigned | `app/modules/app/unassigned.js` |
| 109766 | 109801 | 36 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 109802 | 109809 | 8 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 109810 | 109824 | 15 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 109825 | 109856 | 32 | `spec` | const arrow | — | refs:735 | Unassigned | `app/modules/app/unassigned.js` |
| 109857 | 110108 | 252 | `data` | const arrow | — | refs:7077 | Unassigned | `app/modules/app/unassigned.js` |
| 110109 | 110131 | 23 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 110132 | 110150 | 19 | `_supabaseFS` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110151 | 110156 | 6 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110157 | 110157 | 1 | `hideYoung` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110158 | 110197 | 40 | `hideSenior` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 110198 | 110199 | 2 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110200 | 110213 | 14 | `byCol` | const arrow | — | refs:141 | Unassigned | `app/modules/app/unassigned.js` |
| 110214 | 110215 | 2 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110216 | 110229 | 14 | `byYear` | const arrow | — | refs:483 | Unassigned | `app/modules/app/unassigned.js` |
| 110230 | 110231 | 2 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110232 | 110245 | 14 | `byCol` | const arrow | — | refs:141 | Unassigned | `app/modules/app/unassigned.js` |
| 110246 | 110247 | 2 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110248 | 110261 | 14 | `byYear` | const arrow | — | refs:483 | Unassigned | `app/modules/app/unassigned.js` |
| 110262 | 110263 | 2 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110264 | 110277 | 14 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 110278 | 110307 | 30 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110308 | 110308 | 1 | `totalSev` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110309 | 110315 | 7 | `speedSev` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 110316 | 110335 | 20 | `speedTot` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 110336 | 110337 | 2 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110338 | 110338 | 1 | `fy` | const arrow | — | refs:1133 | Unassigned | `app/modules/app/unassigned.js` |
| 110339 | 110356 | 18 | `sy` | const arrow | — | refs:1769 | Unassigned | `app/modules/app/unassigned.js` |
| 110357 | 110358 | 2 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110359 | 110372 | 14 | `byHour` | const arrow | — | refs:93 | Unassigned | `app/modules/app/unassigned.js` |
| 110373 | 110389 | 17 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110390 | 110400 | 11 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110401 | 110413 | 13 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 110414 | 110427 | 14 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110428 | 110436 | 9 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110437 | 110449 | 13 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 110450 | 110461 | 12 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110462 | 110462 | 1 | `fatalSpeedPct` | const arrow | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110463 | 110485 | 23 | `speedFatalPct` | const arrow | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110486 | 110513 | 28 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 110514 | 110533 | 20 | `j` | const arrow | — | refs:9414 | Unassigned | `app/modules/app/unassigned.js` |
| 110534 | 110562 | 29 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110563 | 110567 | 5 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110568 | 110596 | 29 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110597 | 110624 | 28 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 110625 | 110644 | 20 | `j` | const arrow | — | refs:9414 | Unassigned | `app/modules/app/unassigned.js` |
| 110645 | 110669 | 25 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110670 | 110674 | 5 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110675 | 110699 | 25 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110700 | 110741 | 42 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 110742 | 110763 | 22 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110764 | 110767 | 4 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110768 | 110789 | 22 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 110790 | 110812 | 23 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 110813 | 110832 | 20 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 110833 | 110900 | 68 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 110901 | 110971 | 71 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110972 | 111000 | 29 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 111001 | 111012 | 12 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111013 | 111024 | 12 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111025 | 111033 | 9 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111034 | 111107 | 74 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 111108 | 111166 | 59 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 111167 | 111269 | 103 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111270 | 111327 | 58 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111328 | 111368 | 41 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111369 | 111434 | 66 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111435 | 111463 | 29 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111464 | 111518 | 55 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 111519 | 111552 | 34 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111553 | 111595 | 43 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111596 | 111644 | 49 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111645 | 111674 | 30 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111675 | 111687 | 13 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111688 | 111700 | 13 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111701 | 111727 | 27 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111728 | 111745 | 18 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111746 | 111767 | 22 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 111768 | 111776 | 9 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 111777 | 111800 | 24 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 111801 | 111810 | 10 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111811 | 111821 | 11 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 111822 | 111839 | 18 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111840 | 111846 | 7 | `rows` | const arrow | — | refs:847 | Unassigned | `app/modules/app/unassigned.js` |
| 111847 | 111847 | 1 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 111848 | 111930 | 83 | `isFatal` | const arrow | — | refs:10 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 111931 | 111961 | 31 | `hexToRgb` | const arrow | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 111962 | 111970 | 9 | `cleanText` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 111971 | 111978 | 8 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111979 | 111995 | 17 | `drawHeader` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 111996 | 112020 | 25 | `drawFooter` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 112021 | 112031 | 11 | `newPage` | const arrow | — | refs:46 | Unassigned | `app/modules/app/unassigned.js` |
| 112032 | 112040 | 9 | `checkPageBreak` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 112041 | 112061 | 21 | `addText` | const arrow | — | refs:171 | Unassigned | `app/modules/app/unassigned.js` |
| 112062 | 112077 | 16 | `addSectionTitle` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 112078 | 112088 | 11 | `addSubsectionTitle` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 112089 | 112090 | 2 | `drawSeverityBar` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 112091 | 112109 | 19 | `total` | const arrow | — | refs:4309 | Unassigned | `app/modules/app/unassigned.js` |
| 112110 | 112142 | 33 | `width` | const arrow | — | refs:3062 | Unassigned | `app/modules/app/unassigned.js` |
| 112143 | 112165 | 23 | `drawKPICard` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 112166 | 112193 | 28 | `addSpacer` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 112194 | 112582 | 389 | `totalCardsWidth` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 112583 | 112690 | 108 | `formatHour` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 112691 | 112722 | 32 | `getSafetyCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 112723 | 112743 | 21 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 112744 | 112819 | 76 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112820 | 112826 | 7 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112827 | 112833 | 7 | `getCurrentDetailCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 112834 | 112835 | 2 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112836 | 112843 | 8 | `routeClean` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 112844 | 112861 | 18 | `exportCurrentDetailToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112862 | 112892 | 31 | `addCurrentDetailToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 112893 | 112900 | 8 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 112901 | 112913 | 13 | `exportSafetyData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 112914 | 112923 | 10 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112924 | 112936 | 13 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 112937 | 112955 | 19 | `val` | const arrow | — | refs:6013 | Unassigned | `app/modules/app/unassigned.js` |
| 112956 | 113019 | 64 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 113020 | 113020 | 1 | `isNight` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 113021 | 113195 | 175 | `isPed` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 113196 | 113210 | 15 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113211 | 113221 | 11 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 113222 | 113237 | 16 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113238 | 113269 | 32 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113270 | 113309 | 40 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113310 | 113379 | 70 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 113380 | 113394 | 15 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113395 | 113407 | 13 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113408 | 113588 | 181 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 113589 | 113603 | 15 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113604 | 113619 | 16 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113620 | 113643 | 24 | `exportSafetyToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113644 | 113671 | 28 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113672 | 113802 | 131 | `generateSafetyCategoryReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113803 | 113839 | 37 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113840 | 113842 | 3 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 113843 | 113846 | 4 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 113847 | 113890 | 44 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 113891 | 113936 | 46 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 113937 | 113947 | 11 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 113948 | 113999 | 52 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 114000 | 114074 | 75 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 114075 | 114134 | 60 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 114135 | 114141 | 7 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 114142 | 114196 | 55 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 114197 | 114205 | 9 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 114206 | 114232 | 27 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 114233 | 114249 | 17 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 114250 | 114262 | 13 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 114263 | 114295 | 33 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 114296 | 114314 | 19 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 114315 | 114355 | 41 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 114356 | 114372 | 17 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 114373 | 114404 | 32 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 114405 | 114445 | 41 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 114446 | 114471 | 26 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 114472 | 114529 | 58 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 114530 | 114546 | 17 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 114547 | 114586 | 40 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 114587 | 114636 | 50 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 114637 | 114652 | 16 | `tierInfo` | const arrow | — | refs:19 | Core/Tier | `app/modules/core/tier.js` |
| 114653 | 114671 | 19 | `crashes` | const arrow | — | refs:3180 | Analysis | `app/modules/analysis/analysis.js` |
| 114672 | 114724 | 53 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 114725 | 114733 | 9 | `tierInfo` | const arrow | — | refs:19 | Core/Tier | `app/modules/core/tier.js` |
| 114734 | 114758 | 25 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 114759 | 114790 | 32 | `crashes` | const arrow | — | refs:3180 | Analysis | `app/modules/analysis/analysis.js` |
| 114791 | 114791 | 1 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 114792 | 114809 | 18 | `d` | const arrow | — | refs:303672 | Unassigned | `app/modules/app/unassigned.js` |
| 114810 | 114855 | 46 | `setText` | const arrow | — | refs:667 | Unassigned | `app/modules/app/unassigned.js` |
| 114856 | 114946 | 91 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 114947 | 115044 | 98 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 115045 | 115106 | 62 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 115107 | 115361 | 255 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 115362 | 115367 | 6 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 115368 | 115426 | 59 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 115427 | 115498 | 72 | `evaluatePedScreening` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 115499 | 115519 | 21 | `getRequiredSSD` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115520 | 115542 | 23 | `updatePedSSDRequired` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115543 | 115555 | 13 | `updatePedContextSpacing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115556 | 115600 | 45 | `updatePedStreetViewStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115601 | 115616 | 16 | `openPedStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115617 | 115645 | 29 | `ped_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 115646 | 115655 | 10 | `severity` | const arrow | — | refs:1658 | Unassigned | `app/modules/app/unassigned.js` |
| 115656 | 115658 | 3 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 115659 | 115661 | 3 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 115662 | 115668 | 7 | `intType` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 115669 | 115729 | 61 | `epdo` | const arrow | — | refs:982 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 115730 | 115868 | 139 | `evaluatePedCriteria` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 115869 | 115959 | 91 | `determinePedTier` | fn | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 115960 | 115990 | 31 | `determinePedMarking` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 115991 | 116052 | 62 | `ped_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116053 | 116468 | 416 | `mapCrashes` | const arrow | — | refs:24 | Analysis | `app/modules/analysis/analysis.js` |
| 116469 | 116488 | 20 | `ped_printReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116489 | 116559 | 71 | `stopsign_initForm` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116560 | 116594 | 35 | `stopsign_showTab` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 116595 | 116672 | 78 | `stopsign_updateSpeedThreshold` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 116673 | 116684 | 12 | `stopsign_updateConfig` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 116685 | 116702 | 18 | `stopsign_updateTMCGrid` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 116703 | 116733 | 31 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 116734 | 116756 | 23 | `stopsign_generateTMCRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116757 | 116785 | 29 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 116786 | 116803 | 18 | `stopsign_updateRowTotal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116804 | 116813 | 10 | `stopsign_markTotalManual` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116814 | 116822 | 9 | `stopsign_calculateApproachVolumes` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 116823 | 116836 | 14 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 116837 | 116888 | 52 | `stopsign_computeHourlyAggregates` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 116889 | 116923 | 35 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 116924 | 117007 | 84 | `stopsign_evaluateCriterionCFromAggregates` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 117008 | 117144 | 137 | `stopsign_updateVolumeSummary` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 117145 | 117183 | 39 | `stopsign_setCountType` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 117184 | 117214 | 31 | `stopsign_clearTMCForm` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 117215 | 117222 | 8 | `stopsign_generateVolumeTable` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 117223 | 117318 | 96 | `stopsign_updateVolumeAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 117319 | 117330 | 12 | `stopsign_buildCrashProfile` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 117331 | 117365 | 35 | `collType` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 117366 | 117398 | 33 | `stopsign_autoPopulateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117399 | 117427 | 29 | `stopsign_evaluateCriterionA` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117428 | 117457 | 30 | `stopsign_evaluateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117458 | 117470 | 13 | `stopsign_evaluateCriterionC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117471 | 117487 | 17 | `updateSubcriterion` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117488 | 117523 | 36 | `updateBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 117524 | 117608 | 85 | `stopsign_calculateLOS` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117609 | 117619 | 11 | `stopsign_toggleHCSConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117620 | 117663 | 44 | `stopsign_evaluateCriterionD` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117664 | 117712 | 49 | `stopsign_evaluateAllCriteria` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 117713 | 117782 | 70 | `stopsign_updateResultsTab` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 117783 | 117793 | 11 | `stopsign_updateResultCell` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 117794 | 117817 | 24 | `stopsign_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117818 | 117838 | 21 | `stopsign_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117839 | 117849 | 11 | `stopsign_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117850 | 117868 | 19 | `stopsign_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117869 | 117891 | 23 | `stopsign_clearVolumeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117892 | 117953 | 62 | `stopsign_saveData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 117954 | 118051 | 98 | `stopsign_loadSavedData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118052 | 118093 | 42 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118094 | 118125 | 32 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118126 | 118134 | 9 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118135 | 118146 | 12 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118147 | 118188 | 42 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 118189 | 118235 | 47 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118236 | 118305 | 70 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118306 | 118328 | 23 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118329 | 118352 | 24 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118353 | 118379 | 27 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118380 | 118444 | 65 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118445 | 118503 | 59 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 118504 | 118515 | 12 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118516 | 118527 | 12 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118528 | 118545 | 18 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118546 | 118557 | 12 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 118558 | 118580 | 23 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118581 | 118645 | 65 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118646 | 118667 | 22 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118668 | 118711 | 44 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118712 | 118744 | 33 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 118745 | 118752 | 8 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 118753 | 118762 | 10 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 118763 | 118803 | 41 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118804 | 118834 | 31 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118835 | 118844 | 10 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118845 | 118915 | 71 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 118916 | 118947 | 32 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 118948 | 118987 | 40 | `isMajor` | const arrow | — | refs:88 | Unassigned | `app/modules/app/unassigned.js` |
| 118988 | 118996 | 9 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 118997 | 119074 | 78 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119075 | 119116 | 42 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119117 | 119127 | 11 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119128 | 119166 | 39 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119167 | 119187 | 21 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119188 | 119210 | 23 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119211 | 119232 | 22 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119233 | 119244 | 12 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119245 | 119363 | 119 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119364 | 119364 | 1 | `nb` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 119365 | 119365 | 1 | `sb` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 119366 | 119366 | 1 | `eb` | const arrow | — | refs:997 | Unassigned | `app/modules/app/unassigned.js` |
| 119367 | 119449 | 83 | `wb` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 119450 | 119614 | 165 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119615 | 119705 | 91 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119706 | 119779 | 74 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119780 | 119849 | 70 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119850 | 120126 | 277 | `mapCrashes` | const arrow | — | refs:24 | Analysis | `app/modules/analysis/analysis.js` |
