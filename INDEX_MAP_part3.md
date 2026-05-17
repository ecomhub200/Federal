# index.html function inventory — PART 3 (L80001–120000)

Snapshot: 2026-05-16 · source `app/index.html` (151729 lines)

Declarations in this part: **1044**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 80029 | 80082 | 80077 | 54 | 49 | `buildRAGQueries` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80083 | 80166 | 80161 | 84 | 79 | `buildNewAgent1Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80167 | 80231 | 80227 | 65 | 61 | `buildNewAgent2Input` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80232 | 80371 | 80366 | 140 | 135 | `formatMUTCDAnalysisForChat` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80372 | 80415 | 80461 | 44 | 90 | `triggerMUTCDAnalysis` | async fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 80416 | 80466 | 80438 | 51 | 23 | `updateProgress` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 80467 | 80472 | 80470 | 6 | 4 | `buildCountyWideCrashProfile` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 80473 | 80521 | 80519 | 49 | 47 | `askMUTCDGuidance` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 80522 | 80526 | 80524 | 5 | 3 | `buildLocationCrashProfile` | fn | — | refs:7 | Analysis | `app/modules/analysis/analysis.js` |
| 80527 | 80557 | 80538 | 31 | 12 | `askMUTCDForSafetyCategory` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 80558 | 80603 | 80608 | 46 | 51 | `initSignalWarrantChecker` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 80604 | 80610 | 80604 | 7 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80611 | 80623 | 80621 | 13 | 11 | `toggleWarrantChecker` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80624 | 80636 | 80634 | 13 | 11 | `toggleCrossingEvalSection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 80637 | 80641 | 80639 | 5 | 3 | `openCrossingEvalModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 80642 | 80646 | 80644 | 5 | 3 | `closeCrossingEvalModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80647 | 80657 | 80757 | 11 | 111 | `analyzeSignalWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80658 | 80676 | 80658 | 19 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 80677 | 80759 | 80677 | 83 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 80760 | 80787 | 80786 | 28 | 27 | `askAboutWarrant7` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 80788 | 80888 | 80878 | 101 | 91 | `buildSystemPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 80889 | 81043 | 81039 | 155 | 151 | `getAIAnalysisContext` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 81044 | 81050 | 81046 | 7 | 3 | `buildLocationCrashContext` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 81051 | 81075 | 81074 | 25 | 24 | `updateAIContextIndicator` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 81076 | 81118 | 81117 | 43 | 42 | `updateMUTCDAILocationBar` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 81119 | 81135 | 81134 | 17 | 16 | `copyMessageContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81136 | 81154 | 81153 | 19 | 18 | `updateMUTCDRefCounters` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81155 | 81163 | 81162 | 9 | 8 | `askAboutMUTCDSection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81164 | 81290 | 81289 | 127 | 126 | `askAI` | async fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 81291 | 81334 | 81333 | 44 | 43 | `callOpenAI` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81335 | 81392 | 81391 | 58 | 57 | `callClaude` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81393 | 81428 | 81427 | 36 | 35 | `callGemini` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81429 | 81494 | 81462 | 66 | 34 | `formatAIResponse` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81495 | 81534 | 81532 | 40 | 38 | `convertMUTCDReferencesToCards` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81535 | 81559 | 81557 | 25 | 23 | `renderMUTCDCitationCard` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81560 | 81706 | 81573 | 147 | 14 | `copyMUTCDCitation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 81707 | 81760 | 81754 | 54 | 48 | `initDomainKnowledge` | fn | — | refs:1 | AI Mode | `app/modules/ai/ai.js` |
| 81761 | 81774 | 81772 | 14 | 12 | `shouldUseQdrantProxy` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81775 | 81814 | 81775 | 40 | 1 | `qdrantFetch` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 81815 | 81846 | 81865 | 32 | 51 | `initQdrantConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81847 | 81867 | 81847 | 21 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 81868 | 81873 | 81871 | 6 | 4 | `qdrantGetCollections` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81874 | 81888 | 81886 | 15 | 13 | `qdrantCreateCollection` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81889 | 81911 | 81909 | 23 | 21 | `qdrantCreatePayloadIndex` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81912 | 81921 | 81919 | 10 | 8 | `qdrantEnsurePayloadIndexes` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 81922 | 81947 | 81945 | 26 | 24 | `qdrantSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 81948 | 81957 | 81955 | 10 | 8 | `qdrantGetCollectionInfo` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 81958 | 81966 | 81964 | 9 | 7 | `qdrantUpsertPoints` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 81967 | 82002 | 81996 | 36 | 30 | `testQdrantConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82003 | 82029 | 82027 | 27 | 25 | `voyageEmbed` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 82030 | 82035 | 82033 | 6 | 4 | `voyageEmbedQuery` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82036 | 82040 | 82038 | 5 | 3 | `voyageEmbedDocuments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82041 | 82062 | 82056 | 22 | 16 | `testVoyageConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82063 | 82073 | 82092 | 11 | 30 | `ragSearch` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82074 | 82095 | 82083 | 22 | 10 | `formattedResults` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82096 | 82106 | 82104 | 11 | 9 | `generateQdrantId` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82107 | 82143 | 82141 | 37 | 35 | `indexDocument` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82144 | 82150 | 82184 | 7 | 41 | `indexDocumentsBatch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82151 | 82154 | 82151 | 4 | 1 | `contents` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82155 | 82186 | 82170 | 32 | 16 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82187 | 82226 | 82224 | 40 | 38 | `testRAGPipeline` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82227 | 82316 | 82314 | 90 | 88 | `indexSampleDocuments` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82317 | 82321 | 82319 | 5 | 3 | `populateDKLocationDropdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82322 | 82379 | 82377 | 58 | 56 | `updateDKLocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82380 | 82433 | 82431 | 54 | 52 | `filterDKLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82434 | 82440 | 82438 | 7 | 5 | `handleDKSearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82441 | 82446 | 82444 | 6 | 4 | `triggerDKSearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82447 | 82459 | 82457 | 13 | 11 | `selectDKSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82460 | 82489 | 82487 | 30 | 28 | `loadDKLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82490 | 82517 | 82515 | 28 | 26 | `loadDKCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 82518 | 82530 | 82528 | 13 | 11 | `applyDKDateFilter` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 82531 | 82539 | 82556 | 9 | 26 | `applyDKDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82540 | 82558 | 82540 | 19 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 82559 | 82576 | 82574 | 18 | 16 | `clearDKDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82577 | 82590 | 82588 | 14 | 12 | `updateDKDateFilterStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82591 | 82608 | 82606 | 18 | 16 | `applyDKDateFilterInternal` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 82609 | 82676 | 82690 | 68 | 82 | `buildDKCrashProfile` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 82677 | 82698 | 82677 | 22 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 82699 | 82732 | 82752 | 34 | 54 | `renderDomainKnowledgeSources` | fn | — | refs:5 | AI Mode | `app/modules/ai/ai.js` |
| 82733 | 82753 | 82733 | 21 | 1 | `escapeHtml` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 82754 | 82767 | 82765 | 14 | 12 | `toggleDKSource` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 82768 | 82778 | 82776 | 11 | 9 | `syncDKSourcesFromUI` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82779 | 82793 | 82823 | 15 | 45 | `autoSelectDKSources` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 82794 | 82825 | 82797 | 32 | 4 | `_dkCheck` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 82826 | 82831 | 82829 | 6 | 4 | `selectDKFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82832 | 82836 | 82834 | 5 | 3 | `enableDKPolygonMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82837 | 82850 | 82848 | 14 | 12 | `clearDKChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82851 | 82857 | 82855 | 7 | 5 | `askDKSuggestion` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82858 | 82904 | 82902 | 47 | 45 | `askDKQuestion` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82905 | 82923 | 82915 | 19 | 11 | `buildDKContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 82924 | 82935 | 82934 | 12 | 11 | `_dkResolveOpenAIKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 82936 | 82981 | 82978 | 46 | 43 | `loadCorpusCounts` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 82982 | 83018 | 83044 | 37 | 63 | `embedPendingCorpus` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83019 | 83038 | 83019 | 20 | 1 | `errText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83039 | 83048 | 83039 | 10 | 1 | `safeMsg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83049 | 83068 | 83067 | 20 | 19 | `_dkOpenAIEmbed` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83069 | 83097 | 83095 | 29 | 27 | `_dkPgvectorSearch` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83098 | 83104 | 83233 | 7 | 136 | `queryDKSources` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83105 | 83129 | 83107 | 25 | 3 | `qdrantSources` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83130 | 83153 | 83130 | 24 | 1 | `_key` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 83154 | 83235 | 83160 | 82 | 7 | `citations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83236 | 83262 | 83260 | 27 | 25 | `callClaudeSimple` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83263 | 83275 | 83273 | 13 | 11 | `getActiveApiKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83276 | 83311 | 83309 | 36 | 34 | `addDKMessage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83312 | 83336 | 83334 | 25 | 23 | `showDKCitation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83337 | 83355 | 83353 | 19 | 17 | `updateDKSourcesPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83356 | 83374 | 83372 | 19 | 17 | `loadDKStreetView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 83375 | 83387 | 83385 | 13 | 11 | `switchDKStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 83388 | 83393 | 83391 | 6 | 4 | `changeDKViewDirection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 83394 | 83407 | 83405 | 14 | 12 | `toggleDKReferencePanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83408 | 83412 | 83410 | 5 | 3 | `attachDKImage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83413 | 83519 | 83420 | 107 | 8 | `runDKDeepAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 83520 | 83536 | 83520 | 17 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83537 | 83552 | 83537 | 16 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83553 | 83570 | 83555 | 18 | 3 | `hasRelevantCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83571 | 83589 | 83571 | 19 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83590 | 83590 | 83590 | 1 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83591 | 83608 | 83593 | 18 | 3 | `noSchoolSigns` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83609 | 83626 | 83609 | 18 | 1 | `schoolNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83627 | 83647 | 83629 | 21 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83648 | 83648 | 83648 | 1 | 1 | `transitNearby` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83649 | 83666 | 83649 | 18 | 1 | `hasPedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83667 | 83688 | 83686 | 22 | 20 | `switchCMFSubtab` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 83689 | 83706 | 83704 | 18 | 16 | `initAssetDeficiencyTab` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83707 | 83729 | 83770 | 23 | 64 | `syncADFromCMF` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 83730 | 83730 | 83730 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83731 | 83733 | 83731 | 3 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83734 | 83734 | 83734 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83735 | 83772 | 83735 | 38 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83773 | 83794 | 83792 | 22 | 20 | `showCMFDeficiencyPanelLoading` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 83795 | 83831 | 83829 | 37 | 35 | `loadAllADDataSourcesQuietly` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 83832 | 83877 | 84021 | 46 | 190 | `updateCMFDeficiencySummary` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 83878 | 83890 | 83878 | 13 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83891 | 83902 | 83891 | 12 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83903 | 83917 | 83906 | 15 | 4 | `nightCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 83918 | 84023 | 83921 | 106 | 4 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84024 | 84040 | 84050 | 17 | 27 | `updateADLocationDisplay` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 84041 | 84041 | 84041 | 1 | 1 | `fatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84042 | 84052 | 84042 | 11 | 1 | `serious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84053 | 84094 | 84092 | 42 | 40 | `clearADLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84095 | 84130 | 84128 | 36 | 34 | `parseADCoordinates` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84131 | 84135 | 84148 | 5 | 18 | `filterCrashesForADLocation` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 84136 | 84150 | 84143 | 15 | 8 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 84151 | 84156 | 84154 | 6 | 4 | `selectADFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84157 | 84172 | 84171 | 16 | 15 | `updateADDataSourcesUI` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 84173 | 84240 | 84238 | 68 | 66 | `updateSourceUI` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 84241 | 84251 | 84249 | 11 | 9 | `toggleADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 84252 | 84271 | 84306 | 20 | 55 | `renderADMapillaryList` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 84272 | 84288 | 84283 | 17 | 12 | `getAssetInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84289 | 84308 | 84289 | 20 | 1 | `sortedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84309 | 84344 | 84342 | 36 | 34 | `loadAllADDataSources` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84345 | 84359 | 84398 | 15 | 54 | `loadADSchools` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84360 | 84370 | 84360 | 11 | 1 | `schoolAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84371 | 84400 | 84379 | 30 | 9 | `nearbySchools` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84401 | 84415 | 84457 | 15 | 57 | `loadADTransit` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 84416 | 84429 | 84419 | 14 | 4 | `transitAsset` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84430 | 84459 | 84438 | 30 | 9 | `nearbyStops` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84460 | 84478 | 84476 | 19 | 17 | `updateADSchoolRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84479 | 84497 | 84495 | 19 | 17 | `updateADTransitRadius` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84498 | 84586 | 84584 | 89 | 87 | `loadADTrafficInventory` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84587 | 84609 | 84607 | 23 | 21 | `filterInventoryToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 84610 | 84675 | 84662 | 66 | 53 | `loadADMapillary` | async fn | — | refs:2 | Map | `app/modules/map/map.js` |
| 84676 | 84711 | 84704 | 36 | 29 | `calculateOffsetCoordinates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 84712 | 84735 | 84730 | 24 | 19 | `calculateZoomForBoxSize` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84736 | 84771 | 84767 | 36 | 32 | `checkMapboxSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84772 | 84802 | 84794 | 31 | 23 | `initSatelliteConnection` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84803 | 84826 | 84834 | 24 | 32 | `captureMapboxSatelliteImage` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 84827 | 84844 | 84831 | 18 | 5 | `base64Data` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 84845 | 84878 | 84876 | 34 | 32 | `captureAllSatelliteImages` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84879 | 84935 | 84930 | 57 | 52 | `loadADSatelliteImage` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84936 | 84990 | 84985 | 55 | 50 | `updateSatelliteImageGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 84991 | 85019 | 85017 | 29 | 27 | `openSatelliteImageView` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 85020 | 85039 | 85037 | 20 | 18 | `updateADAnalysisButton` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 85040 | 85045 | 85043 | 6 | 4 | `toggleADApiKeyPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85046 | 85055 | 85053 | 10 | 8 | `checkADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85056 | 85078 | 85076 | 23 | 21 | `loadADApiKeys` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85079 | 85102 | 85101 | 24 | 23 | `saveADApiKeys` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85103 | 85124 | 85122 | 22 | 20 | `updateADApiKeyStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85125 | 85252 | 85251 | 128 | 127 | `runADAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 85253 | 85274 | 85272 | 22 | 20 | `updateADProgressStep` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 85275 | 85335 | 85328 | 61 | 54 | `runGPT4VAnalysis` | async fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 85336 | 85382 | 85381 | 47 | 46 | `getGPT4VPrompt` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85383 | 85406 | 85405 | 24 | 23 | `getGeminiVerificationPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85407 | 85470 | 85468 | 64 | 62 | `getClaudeConsensusPrompt` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 85471 | 85563 | 85561 | 93 | 91 | `runGeminiVerification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85564 | 85673 | 85691 | 110 | 128 | `runClaudeConsensus` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85674 | 85693 | 85674 | 20 | 1 | `error` | const arrow | — | refs:215 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 85694 | 85721 | 85719 | 28 | 26 | `buildConsensusResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85722 | 85750 | 85749 | 29 | 28 | `detectDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85751 | 85760 | 85758 | 10 | 8 | `determineDeficiencySource` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85761 | 85804 | 85802 | 44 | 42 | `calculateRiskScore` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85805 | 85820 | 85819 | 16 | 15 | `displayADResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 85821 | 85852 | 85851 | 32 | 31 | `displayADRiskScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85853 | 85912 | 85908 | 60 | 56 | `displayADInfrastructure` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85913 | 85967 | 85963 | 55 | 51 | `formatApproachesSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85968 | 85993 | 85992 | 26 | 25 | `formatCrosswalksSection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 85994 | 85997 | 86027 | 4 | 34 | `formatInfraSection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 85998 | 86028 | 85998 | 31 | 1 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 86029 | 86082 | 86080 | 54 | 52 | `displayADDeficiencies` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86083 | 86091 | 86100 | 9 | 18 | `sortADDeficiencies` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86092 | 86092 | 86092 | 1 | 1 | `aCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86093 | 86102 | 86093 | 10 | 1 | `bCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86103 | 86114 | 86112 | 12 | 10 | `addDeficiencyToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86115 | 86123 | 86121 | 9 | 7 | `addDeficiencyToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 86124 | 86135 | 86133 | 12 | 10 | `addADToCMFRecommendations` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86136 | 86141 | 86139 | 6 | 4 | `addADToGrant` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 86142 | 86152 | 86150 | 11 | 9 | `viewADOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86153 | 86158 | 86156 | 6 | 4 | `toggleADInfraExpand` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86159 | 86166 | 86164 | 8 | 6 | `openADSatelliteFullView` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86167 | 86205 | 86203 | 39 | 37 | `exportADPDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 86206 | 86232 | 86227 | 27 | 22 | `exportADJSON` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86233 | 86361 | 86356 | 129 | 124 | `exportADCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86362 | 86387 | 86607 | 26 | 246 | `exportADPDFEnhanced` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86388 | 86615 | 86393 | 228 | 6 | `checkPageBreak` | const arrow | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 86616 | 86623 | 86622 | 8 | 7 | `getADCacheKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86624 | 86634 | 86633 | 11 | 10 | `loadADAnalysisCache` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 86635 | 86668 | 86667 | 34 | 33 | `saveADAnalysisToCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 86669 | 86691 | 86690 | 23 | 22 | `getADAnalysisFromCache` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 86692 | 86696 | 86695 | 5 | 4 | `clearADCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 86697 | 86702 | 86700 | 6 | 4 | `getCachedAnalysisCount` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 86703 | 86725 | 86723 | 23 | 21 | `checkADCacheForLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 86726 | 86742 | 86731 | 17 | 6 | `updateADCacheDisplay` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 86743 | 86751 | 86766 | 9 | 24 | `applyCMFDatePreset` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86752 | 86768 | 86752 | 17 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 86769 | 86784 | 86782 | 16 | 14 | `clearCMFDateFilter` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86785 | 86812 | 86810 | 28 | 26 | `applyCMFDateFilter` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86813 | 86853 | 86851 | 41 | 39 | `filterCMFCrashesByDate` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86854 | 86878 | 86876 | 25 | 23 | `updateCMFDateFilterStatus` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86879 | 86903 | 86901 | 25 | 23 | `checkCMFSampleSize` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86904 | 86954 | 86952 | 51 | 49 | `loadCMFDatabase` | async fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86955 | 86983 | 86982 | 29 | 28 | `transformCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86984 | 86993 | 87030 | 10 | 47 | `showCMFLoadedStatus` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 86994 | 86994 | 86994 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86995 | 86995 | 86995 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 86996 | 87031 | 86996 | 36 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87032 | 87041 | 87040 | 10 | 9 | `initCMFLocationDropdown` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87042 | 87093 | 87092 | 52 | 51 | `updateCMFLocationDropdown` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87094 | 87115 | 87141 | 22 | 48 | `buildCMFSearchData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87116 | 87138 | 87116 | 23 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87139 | 87142 | 87139 | 4 | 1 | `sortedNodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87143 | 87148 | 87146 | 6 | 4 | `populateCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87149 | 87156 | 87154 | 8 | 6 | `formatNodeId` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 87157 | 87206 | 87204 | 50 | 48 | `formatRouteName` | fn | — | refs:101 | Unassigned | `app/modules/app/unassigned.js` |
| 87207 | 87220 | 87212 | 14 | 6 | `getRoadNameOnly` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87221 | 87242 | 87259 | 22 | 39 | `getLocationDisplayName` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87243 | 87289 | 87243 | 47 | 1 | `nodeInfo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 87290 | 87292 | 87329 | 3 | 40 | `_buildLocationDataFromHotspots` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 87293 | 87330 | 87293 | 38 | 1 | `isNodeId` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 87331 | 87448 | 87331 | 118 | 1 | `buildLocationData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87449 | 87469 | 87449 | 21 | 1 | `populateLocationDropdown` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 87470 | 87523 | 87485 | 54 | 16 | `createOption` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87524 | 87551 | 87545 | 28 | 22 | `createLocationTypeSelector` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 87552 | 87561 | 87555 | 10 | 4 | `getSelectedLocationType` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 87562 | 87567 | 87565 | 6 | 4 | `setSelectedLocationType` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 87568 | 87633 | 87631 | 66 | 64 | `filterCMFLocations` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87634 | 87647 | 87645 | 14 | 12 | `selectCMFLocation` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87648 | 87655 | 87653 | 8 | 6 | `handleCMFSearchKeypress` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87656 | 87711 | 87709 | 56 | 54 | `triggerCMFSearch` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87712 | 87731 | 87729 | 20 | 18 | `runActiveCMFMode` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87732 | 87738 | 87736 | 7 | 5 | `selectFromMap` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 87739 | 87779 | 87774 | 41 | 36 | `showToast` | fn | — | refs:382 | Unassigned | `app/modules/app/unassigned.js` |
| 87780 | 87790 | 87787 | 11 | 8 | `showCrashTreeFilterUnavailableToast` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 87791 | 87799 | 87798 | 9 | 8 | `showFSFilterUnavailableToast` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 87800 | 87845 | 87955 | 46 | 156 | `loadLocationForCMF` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87846 | 87957 | 87862 | 112 | 17 | `_finalizeCMFAfterLocationLoad` | const arrow | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 87958 | 88002 | 88067 | 45 | 110 | `extractRoadProperties` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 88003 | 88024 | 88003 | 22 | 1 | `topIntType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88025 | 88035 | 88025 | 11 | 1 | `topTrafficCtrl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88036 | 88070 | 88036 | 35 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88071 | 88074 | 88073 | 4 | 3 | `buildCMFCrashProfile` | fn | — | refs:10 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88075 | 88165 | 88159 | 91 | 85 | `displayCrashProfile` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 88166 | 88179 | 88177 | 14 | 12 | `toggleDetailedCrashPanel` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88180 | 88187 | 88185 | 8 | 6 | `getRiskClass` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88188 | 88385 | 88426 | 198 | 239 | `displayDetailedCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 88386 | 88432 | 88386 | 47 | 1 | `yearCounts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 88433 | 88501 | 88499 | 69 | 67 | `setCMFMode` | fn | — | refs:11 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88502 | 88533 | 88531 | 32 | 30 | `showCachedResultsIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88534 | 88544 | 88542 | 11 | 9 | `getTimeAgo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88545 | 88569 | 88563 | 25 | 19 | `refreshCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88570 | 88594 | 88592 | 25 | 23 | `saveAIResultsToSessionStorage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88595 | 88623 | 88621 | 29 | 27 | `loadAIResultsFromSessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88624 | 88632 | 88630 | 9 | 7 | `clearAISessionStorage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 88633 | 88649 | 88647 | 17 | 15 | `updateCMFModeBadge` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88650 | 88668 | 88666 | 19 | 17 | `showCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88669 | 88674 | 88672 | 6 | 4 | `closeCMFApiPopover` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88675 | 88685 | 88683 | 11 | 9 | `syncCMFPopoverProvider` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88686 | 88704 | 88702 | 19 | 17 | `updateCMFPopoverKeyHelper` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88705 | 88715 | 88713 | 11 | 9 | `syncCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88716 | 88725 | 88723 | 10 | 8 | `clearCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88726 | 88768 | 88766 | 43 | 41 | `saveCMFPopoverApiKey` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88769 | 88820 | 88880 | 52 | 112 | `runAIRecommendation` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 88821 | 88882 | 88823 | 62 | 3 | `progressCallback` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 88883 | 88918 | 88916 | 36 | 34 | `cancelCMFAIAnalysis` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 88919 | 88971 | 88969 | 53 | 51 | `buildDataSourceIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 88972 | 89004 | 89002 | 33 | 31 | `renderDataSourceIndicatorsHTML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89005 | 89043 | 89041 | 39 | 37 | `update4AgentLoadingUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89044 | 89080 | 89078 | 37 | 35 | `update4AgentProgress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89081 | 89320 | 89318 | 240 | 238 | `display4AgentResults` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89321 | 89380 | 89534 | 60 | 214 | `buildAIContextString` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 89381 | 89390 | 89381 | 10 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89391 | 89401 | 89391 | 11 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89402 | 89417 | 89402 | 16 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89418 | 89434 | 89418 | 17 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89435 | 89446 | 89435 | 12 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89447 | 89536 | 89447 | 90 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89537 | 89562 | 89560 | 26 | 24 | `updateAILoadingStep` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 89563 | 89570 | 89733 | 8 | 171 | `displayAIRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 89571 | 89577 | 89575 | 7 | 5 | `uniqueRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89578 | 89578 | 89598 | 1 | 21 | `fullCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89579 | 89762 | 89579 | 184 | 1 | `fullCMF` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 89763 | 89779 | 89772 | 17 | 10 | `getCMFReductionPercent` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 89780 | 89817 | 89810 | 38 | 31 | `calculateExpectedReduction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89818 | 89858 | 89852 | 41 | 35 | `findMatchingCrashTypes` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 89859 | 89876 | 89870 | 18 | 12 | `estimateCostTier` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 89877 | 89909 | 89900 | 33 | 24 | `calculateConfidence` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 89910 | 89999 | 89990 | 90 | 81 | `generateRelevanceReasons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90000 | 90073 | 90063 | 74 | 64 | `calculateRelevanceScore` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90074 | 90101 | 90095 | 28 | 22 | `enrichCMFData` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 90102 | 90110 | 90349 | 9 | 248 | `displayAIRecommendationsAsCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90111 | 90117 | 90115 | 7 | 5 | `uniqueCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90118 | 90128 | 90120 | 11 | 3 | `recommendations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90129 | 90129 | 90129 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90130 | 90130 | 90130 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90131 | 90134 | 90131 | 4 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90135 | 90206 | 90135 | 72 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 90207 | 90351 | 90207 | 145 | 1 | `crashTypesFiltered` | const arrow | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 90352 | 90389 | 91835 | 38 | 1484 | `printFullCMFReport` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 90390 | 90403 | 90401 | 14 | 12 | `addPageHeader` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 90404 | 90416 | 90414 | 13 | 11 | `addPageFooter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90417 | 90424 | 90422 | 8 | 6 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 90425 | 90432 | 90430 | 8 | 6 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 90433 | 90443 | 90441 | 11 | 9 | `drawSectionTitle` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 90444 | 90915 | 90454 | 472 | 11 | `sanitizePropertyLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 90916 | 91005 | 90920 | 90 | 5 | `crashTypeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91006 | 91247 | 91012 | 242 | 7 | `createMiniDistribution` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 91248 | 91323 | 91248 | 76 | 1 | `yearTrendData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91324 | 91324 | 91324 | 1 | 1 | `positiveRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91325 | 91373 | 91325 | 49 | 1 | `negativeRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91374 | 91613 | 91387 | 240 | 14 | `summaryTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91614 | 91837 | 91614 | 224 | 1 | `reasonTexts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 91838 | 91844 | 91842 | 7 | 5 | `estimateTotalPages` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 91845 | 91849 | 91848 | 5 | 4 | `getPercentage` | fn | — | refs:31 | Unassigned | `app/modules/app/unassigned.js` |
| 91850 | 92024 | 92824 | 175 | 975 | `findCountermeasures` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 92025 | 92032 | 92025 | 8 | 1 | `matchingTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92033 | 92481 | 92033 | 449 | 1 | `topMatches` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92482 | 92735 | 92482 | 254 | 1 | `totalTemporal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92736 | 92747 | 92739 | 12 | 4 | `cmMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92748 | 92826 | 92750 | 79 | 3 | `crashTypeMatch` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92827 | 92828 | 92974 | 2 | 148 | `generateCountermeasureBundles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 92829 | 92930 | 92829 | 102 | 1 | `recNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92931 | 92942 | 92934 | 12 | 4 | `matchingCMs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92943 | 92948 | 92947 | 6 | 5 | `combinedCRF` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 92949 | 92975 | 92949 | 27 | 1 | `avgRating` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 92976 | 93026 | 93289 | 51 | 314 | `displayCMFRecommendations` | fn | — | refs:5 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93027 | 93027 | 93027 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93028 | 93028 | 93028 | 1 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93029 | 93029 | 93029 | 1 | 1 | `vaCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93030 | 93032 | 93030 | 3 | 1 | `highRelevanceCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93033 | 93114 | 93033 | 82 | 1 | `maxRelevance` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93115 | 93115 | 93115 | 1 | 1 | `crashTypesFiltered` | const arrow | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 93116 | 93291 | 93116 | 176 | 1 | `matchedTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93292 | 93292 | 93348 | 1 | 57 | `expandBundle` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93293 | 93350 | 93293 | 58 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93351 | 93351 | 93363 | 1 | 13 | `addBundleToShortlist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93352 | 93365 | 93352 | 14 | 1 | `bundle` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93366 | 93384 | 93382 | 19 | 17 | `copyCMFToClipboard` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93385 | 93406 | 93404 | 22 | 20 | `toggleCMFShortlist` | fn | — | refs:7 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93407 | 93416 | 93414 | 10 | 8 | `updateShortlistCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 93417 | 93432 | 93430 | 16 | 14 | `clearCMFShortlist` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93433 | 93441 | 93595 | 9 | 163 | `updateCombinedEffectCalculator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 93442 | 93597 | 93444 | 156 | 3 | `shortlistedCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93598 | 93618 | 93616 | 21 | 19 | `toggleCMFShortlistView` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93619 | 93635 | 93662 | 17 | 44 | `askAIAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93636 | 93639 | 93636 | 4 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 93640 | 93664 | 93640 | 25 | 1 | `reasons` | const arrow | — | refs:146 | Unassigned | `app/modules/app/unassigned.js` |
| 93665 | 93673 | 93707 | 9 | 43 | `askMUTCDAboutCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93674 | 93708 | 93674 | 35 | 1 | `crashTypes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 93709 | 93736 | 93735 | 28 | 27 | `sortCMFResults` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93737 | 93774 | 93773 | 38 | 37 | `exportCMFReport` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93775 | 93779 | 93777 | 5 | 3 | `printCMFReport` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93780 | 93797 | 93788 | 18 | 9 | `openCMFStreetView` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 93798 | 93903 | 93808 | 106 | 11 | `backupAutoloadTimeout` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 93904 | 94431 | 93909 | 528 | 6 | `checkDataLoaded` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94432 | 94444 | 94505 | 13 | 74 | `queryCMFForSafetyCategory` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94445 | 94469 | 94445 | 25 | 1 | `keywordList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94470 | 94485 | 94470 | 16 | 1 | `matches` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 94486 | 94507 | 94486 | 22 | 1 | `matchCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94508 | 94556 | 94554 | 49 | 47 | `generateCMFDescription` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 94557 | 94606 | 94562 | 50 | 6 | `getEffectivenessColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94607 | 94624 | 94622 | 18 | 16 | `renderCuratedCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94625 | 94725 | 94723 | 101 | 99 | `renderSafetyCountermeasures` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94726 | 94736 | 94732 | 11 | 7 | `adjustColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94737 | 94787 | 94815 | 51 | 79 | `enrichMissingCrashFields` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 94788 | 94817 | 94791 | 30 | 4 | `isTruck` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 94818 | 94894 | 94893 | 77 | 76 | `initSafetyFocus` | fn | — | refs:5 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 94895 | 94904 | 94917 | 10 | 23 | `populateSafetyYearFilters` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94905 | 94918 | 94905 | 14 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 94919 | 94947 | 94946 | 29 | 28 | `applySafetyFilters` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 94948 | 94955 | 94954 | 8 | 7 | `clearSafetyDateFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 94956 | 95075 | 95072 | 120 | 117 | `processSafetyData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 95076 | 95122 | 95121 | 47 | 46 | `processSafetyDataForReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95123 | 95267 | 95266 | 145 | 144 | `calculateCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 95268 | 95285 | 95275 | 18 | 8 | `extractSeverity` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 95286 | 95321 | 95315 | 36 | 30 | `updateSafetyCards` | fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 95322 | 95395 | 95384 | 74 | 63 | `_loadSafetyFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 95396 | 95447 | 95446 | 52 | 51 | `_hydrateSafetyLocationsFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95448 | 95563 | 95562 | 116 | 115 | `selectSafetyCategory` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 95564 | 95568 | 95566 | 5 | 3 | `calculateEPDO` | fn | — | refs:24 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 95569 | 95597 | 95596 | 29 | 28 | `updateSafetyGridVisibility` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 95598 | 95622 | 95651 | 25 | 54 | `updateSafetyBreakdownChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95623 | 95626 | 95626 | 4 | 4 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95627 | 95652 | 95627 | 26 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95653 | 95682 | 95707 | 30 | 55 | `updateSafetyCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95683 | 95683 | 95683 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95684 | 95708 | 95684 | 25 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95709 | 95738 | 95764 | 30 | 56 | `updateSafetyRoadwayChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95739 | 95739 | 95739 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95740 | 95765 | 95740 | 26 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95766 | 95795 | 95821 | 30 | 56 | `updateSafetyHarmfulEventChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95796 | 95796 | 95796 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95797 | 95822 | 95797 | 26 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95823 | 95834 | 95931 | 12 | 109 | `updateSafetyYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95835 | 95882 | 95863 | 48 | 29 | `extractCrashYear` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 95883 | 95892 | 95883 | 10 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95893 | 95893 | 95893 | 1 | 1 | `labels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95894 | 95932 | 95894 | 39 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 95933 | 95949 | 95948 | 17 | 16 | `_safetyFocusHasCofactors` | async fn | — | refs:6 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 95950 | 95960 | 95959 | 11 | 10 | `_renderSafetySubKpiUnavailable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 95961 | 96021 | 96020 | 61 | 60 | `updateSafetyFactorBadges` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96022 | 96064 | 96107 | 43 | 86 | `updateSafetyLocationTable` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 96065 | 96108 | 96065 | 44 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96109 | 96141 | 96139 | 33 | 31 | `renderSafetyLocationRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96142 | 96152 | 96146 | 11 | 5 | `goToSafetyPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96153 | 96177 | 96175 | 25 | 23 | `toggleSfSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96178 | 96192 | 96190 | 15 | 13 | `toggleAllSfSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96193 | 96215 | 96213 | 23 | 21 | `clearSfSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 96216 | 96237 | 96235 | 22 | 20 | `updateSfSelectionCount` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 96238 | 96248 | 96246 | 11 | 9 | `syncSfCheckboxStates` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 96249 | 96253 | 96251 | 5 | 3 | `toggleAllSafetyLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96254 | 96258 | 96256 | 5 | 3 | `updateSafetyLocationSelection` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 96259 | 96266 | 96264 | 8 | 6 | `syncSafetySelectedLocations` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 96267 | 96284 | 96278 | 18 | 12 | `updateSafetySelectionUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96285 | 96292 | 96290 | 8 | 6 | `setSfViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96293 | 96331 | 96329 | 39 | 37 | `updateSfDetailPanel` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 96332 | 96378 | 96565 | 47 | 234 | `aggregateSfDetailData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 96379 | 96406 | 96382 | 28 | 4 | `_hasPerRow` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96407 | 96567 | 96407 | 161 | 1 | `selected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96568 | 96610 | 96608 | 43 | 41 | `calculateSfCategoryBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96611 | 96627 | 96625 | 17 | 15 | `renderSfDetailContent` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 96628 | 96843 | 96841 | 216 | 214 | `renderSfCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96844 | 96866 | 96864 | 23 | 21 | `renderSfFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 96867 | 96878 | 96937 | 12 | 71 | `renderSfCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96879 | 96881 | 96879 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96882 | 96939 | 96882 | 58 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96940 | 96944 | 96981 | 5 | 42 | `renderSfMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96945 | 96953 | 96945 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 96954 | 96983 | 96960 | 30 | 7 | `getHeatmapColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 96984 | 97001 | 96999 | 18 | 16 | `initSfDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97002 | 97078 | 97159 | 77 | 158 | `initSfCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97079 | 97106 | 97079 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97107 | 97120 | 97107 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97121 | 97134 | 97121 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 97135 | 97148 | 97135 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 97149 | 97161 | 97149 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97162 | 97199 | 97197 | 38 | 36 | `initSfCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97200 | 97247 | 97252 | 48 | 53 | `exportSfDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97248 | 97253 | 97248 | 6 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 97254 | 97300 | 98060 | 47 | 807 | `exportSfDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 97301 | 97312 | 97311 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 97313 | 97324 | 97323 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 97325 | 97337 | 97336 | 13 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 97338 | 97356 | 97355 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 97357 | 97364 | 97363 | 8 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 97365 | 97504 | 97373 | 140 | 9 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 97505 | 97607 | 97509 | 103 | 5 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97608 | 97810 | 97617 | 203 | 10 | `yearTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97811 | 97878 | 97815 | 68 | 5 | `factorTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97879 | 97879 | 97879 | 1 | 1 | `darkCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97880 | 97922 | 97880 | 43 | 1 | `adverseWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97923 | 97939 | 97923 | 17 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 97940 | 98062 | 97940 | 123 | 1 | `topOverall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98063 | 98085 | 98080 | 23 | 18 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98086 | 98098 | 98097 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 98099 | 98108 | 98107 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98109 | 98141 | 98135 | 33 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 98142 | 98164 | 98159 | 23 | 18 | `exportSfDetailKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98165 | 98177 | 98176 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 98178 | 98187 | 98186 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98188 | 98220 | 98214 | 33 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 98221 | 98264 | 98998 | 44 | 778 | `exportSafetyCategoryPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 98265 | 98276 | 98275 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 98277 | 98288 | 98287 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 98289 | 98301 | 98300 | 13 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 98302 | 98320 | 98319 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 98321 | 98435 | 98327 | 115 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 98436 | 98534 | 98440 | 99 | 5 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98535 | 98578 | 98543 | 44 | 9 | `fitImageInBox` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 98579 | 98676 | 98626 | 98 | 48 | `drawNativeHBarChart` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 98677 | 98785 | 98688 | 109 | 12 | `locTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98786 | 98861 | 98795 | 76 | 10 | `yearBreakdownData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98862 | 98900 | 98865 | 39 | 4 | `monthData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98901 | 98901 | 98932 | 1 | 32 | `profileData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98902 | 98918 | 98905 | 17 | 4 | `routeEntry` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 98919 | 99000 | 98919 | 82 | 1 | `topColl` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99001 | 99015 | 99009 | 15 | 9 | `hexToRgbArray` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99016 | 99057 | 99672 | 42 | 657 | `exportSafetySelectedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99058 | 99069 | 99068 | 12 | 11 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 99070 | 99081 | 99080 | 12 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 99082 | 99094 | 99093 | 13 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 99095 | 99102 | 99101 | 8 | 7 | `addNewPage` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 99103 | 99298 | 99109 | 196 | 7 | `checkPageBreak` | fn | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 99299 | 99430 | 99308 | 132 | 10 | `contribData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99431 | 99504 | 99434 | 74 | 4 | `sevTableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99505 | 99513 | 99505 | 9 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99514 | 99573 | 99518 | 60 | 5 | `collisionData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99574 | 99608 | 99577 | 35 | 4 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99609 | 99609 | 99609 | 1 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99610 | 99679 | 99610 | 70 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 99680 | 99709 | 99707 | 30 | 28 | `runSafetyDataCheck` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 99710 | 99718 | 99716 | 9 | 7 | `sfAddCheck` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 99719 | 99761 | 99759 | 43 | 41 | `sfCheckSeverityTotals` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99762 | 99795 | 99793 | 34 | 32 | `sfCheckEPDOCalculations` | fn | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 99796 | 99840 | 99838 | 45 | 43 | `sfCheckCategorySums` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99841 | 99873 | 99871 | 33 | 31 | `sfCheckLocationTableConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 99874 | 100004 | 100002 | 131 | 129 | `sfCheckCrossAnalysisConsistency` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 100005 | 100077 | 100075 | 73 | 71 | `sfCheckFilterConsistency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100078 | 100224 | 100232 | 147 | 155 | `sfCheckDetailPanelAccuracy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100225 | 100234 | 100225 | 10 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100235 | 100275 | 100273 | 41 | 39 | `sfCheckPercentageDenominators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100276 | 100288 | 100353 | 13 | 78 | `displaySafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100289 | 100310 | 100289 | 22 | 1 | `statusIcon` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 100311 | 100311 | 100311 | 1 | 1 | `catPassed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100312 | 100312 | 100312 | 1 | 1 | `catFailed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100313 | 100314 | 100313 | 2 | 1 | `catWarn` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100315 | 100355 | 100315 | 41 | 1 | `catName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100356 | 100376 | 100372 | 21 | 17 | `exportSafetyDataCheckResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100377 | 100394 | 100393 | 18 | 17 | `viewSafetyOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100395 | 100412 | 100411 | 18 | 17 | `viewSafetyLocationOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100413 | 100466 | 100465 | 54 | 53 | `filterMapForSafety` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 100467 | 100483 | 100482 | 17 | 16 | `showMapFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 100484 | 100490 | 100500 | 7 | 17 | `clearSafetyMapFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 100491 | 100506 | 100491 | 16 | 1 | `hasQuickFilters` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100507 | 100558 | 100555 | 52 | 49 | `initCrashTreeTab` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100559 | 100592 | 100736 | 34 | 178 | `initCrashTreeFromMatview` | async fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100593 | 100627 | 100593 | 35 | 1 | `idSafe` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 100628 | 100670 | 100642 | 43 | 15 | `buildNode` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 100671 | 100674 | 100694 | 4 | 24 | `propagateSeverity` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100675 | 100675 | 100675 | 1 | 1 | `ck` | const arrow | — | refs:148 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100676 | 100676 | 100676 | 1 | 1 | `ca` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100677 | 100677 | 100677 | 1 | 1 | `cb` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100678 | 100678 | 100678 | 1 | 1 | `cc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100679 | 100738 | 100679 | 60 | 1 | `co` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 100739 | 100801 | 100799 | 63 | 61 | `setCrashTreeType` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100802 | 100812 | 100810 | 11 | 9 | `toggleCrashTreeSeverity` | fn | — | refs:5 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100813 | 100837 | 100835 | 25 | 23 | `updateCrashTreeSeverity` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100838 | 100872 | 100866 | 35 | 29 | `setTreeSeverityPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100873 | 100902 | 100900 | 30 | 28 | `applyCrashTreeDateFilter` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100903 | 100908 | 100937 | 6 | 35 | `setCrashTreeDatePreset` | fn | — | refs:3 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100909 | 100939 | 100909 | 31 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 100940 | 100968 | 100966 | 29 | 27 | `clearCrashTreeDateFilter` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100969 | 100980 | 100993 | 12 | 25 | `updateCrashTreeDateFilterStatus` | fn | — | refs:4 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 100981 | 100995 | 100985 | 15 | 5 | `formatDisplay` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 100996 | 101034 | 101031 | 39 | 36 | `getCrashTreeFilteredCrashes` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 101035 | 101066 | 101064 | 32 | 30 | `getCrashTreeDateOnlyFilteredCrashes` | fn | — | refs:6 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 101067 | 101088 | 101086 | 22 | 20 | `refreshCrashTreeAnalysis` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 101089 | 101119 | 101164 | 31 | 76 | `buildCrashTreeData` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 101120 | 101167 | 101142 | 48 | 23 | `filteredCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101168 | 101175 | 101338 | 8 | 171 | `buildFacilityTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101176 | 101185 | 101183 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 101186 | 101190 | 101188 | 5 | 3 | `getUnfilteredTotal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 101191 | 101199 | 101197 | 9 | 7 | `getUnfilteredKA` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 101200 | 101200 | 101200 | 1 | 1 | `atIntersection` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101201 | 101203 | 101201 | 3 | 1 | `atSegment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101204 | 101207 | 101207 | 4 | 4 | `signalFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101208 | 101211 | 101211 | 4 | 4 | `stopFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101212 | 101216 | 101215 | 5 | 4 | `uncontrolledFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101217 | 101220 | 101220 | 4 | 4 | `intSignalized` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101221 | 101224 | 101224 | 4 | 4 | `intStopControlled` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101225 | 101230 | 101228 | 6 | 4 | `intUncontrolled` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101231 | 101234 | 101234 | 4 | 4 | `arterialFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101235 | 101238 | 101238 | 4 | 4 | `collectorFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101239 | 101243 | 101242 | 5 | 4 | `localFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101244 | 101247 | 101247 | 4 | 4 | `segArterial` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101248 | 101251 | 101251 | 4 | 4 | `segCollector` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101252 | 101290 | 101255 | 39 | 4 | `segLocal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101291 | 101291 | 101291 | 1 | 1 | `unfilteredIntTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101292 | 101321 | 101292 | 30 | 1 | `unfilteredSegTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101322 | 101341 | 101325 | 20 | 4 | `rootUnfilteredKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101342 | 101348 | 101439 | 7 | 98 | `buildCrashTypeTree` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 101349 | 101358 | 101356 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 101359 | 101424 | 101371 | 66 | 13 | `getCrashCategory` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 101425 | 101443 | 101428 | 19 | 4 | `rootUnfilteredKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101444 | 101452 | 101958 | 9 | 515 | `buildContributingFactorsTree` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 101453 | 101462 | 101460 | 10 | 8 | `countSeverity` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 101463 | 101467 | 101465 | 5 | 3 | `getUnfilteredTotal` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 101468 | 101481 | 101474 | 14 | 7 | `getUnfilteredKA` | const arrow | — | refs:30 | Unassigned | `app/modules/app/unassigned.js` |
| 101482 | 101482 | 101482 | 1 | 1 | `impairedFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101483 | 101483 | 101483 | 1 | 1 | `alcoholFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101484 | 101484 | 101484 | 1 | 1 | `drugFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101485 | 101485 | 101485 | 1 | 1 | `combinedSubstanceFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101486 | 101486 | 101486 | 1 | 1 | `speedingFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101487 | 101487 | 101487 | 1 | 1 | `distractedFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101488 | 101538 | 101488 | 51 | 1 | `drowsyFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101539 | 101594 | 101541 | 56 | 3 | `driverBehaviorCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101595 | 101595 | 101595 | 1 | 1 | `youngDriverFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101596 | 101599 | 101596 | 4 | 1 | `seniorDriverFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101600 | 101629 | 101600 | 30 | 1 | `demographicsCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101630 | 101633 | 101630 | 4 | 1 | `unrestrainedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101634 | 101634 | 101634 | 1 | 1 | `nightFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101635 | 101638 | 101638 | 4 | 4 | `lightedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101639 | 101644 | 101643 | 6 | 5 | `unlightedFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101645 | 101648 | 101648 | 4 | 4 | `weatherFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101649 | 101652 | 101652 | 4 | 4 | `rainFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101653 | 101656 | 101656 | 4 | 4 | `snowIceFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101657 | 101661 | 101660 | 5 | 4 | `fogFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101662 | 101665 | 101665 | 4 | 4 | `surfaceFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101666 | 101669 | 101669 | 4 | 4 | `wetFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101670 | 101685 | 101673 | 16 | 4 | `icyFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101686 | 101824 | 101686 | 139 | 1 | `environmentalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101825 | 101825 | 101825 | 1 | 1 | `hitRunFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101826 | 101826 | 101826 | 1 | 1 | `workZoneFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101827 | 101831 | 101827 | 5 | 1 | `schoolZoneFilter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101832 | 101960 | 101832 | 129 | 1 | `specialCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 101961 | 102004 | 101981 | 44 | 21 | `renderCrashTree` | fn | — | refs:18 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102005 | 102022 | 102020 | 18 | 16 | `navigateFromCrashTree` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102023 | 102048 | 102122 | 26 | 100 | `renderTreeNode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102049 | 102091 | 102070 | 43 | 22 | `buildSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102092 | 102124 | 102094 | 33 | 3 | `childNodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102125 | 102135 | 102133 | 11 | 9 | `toggleCrashTreeNode` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102136 | 102136 | 102146 | 1 | 11 | `expandAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102137 | 102148 | 102143 | 12 | 7 | `addAllIds` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102149 | 102154 | 102152 | 6 | 4 | `collapseAllTreeNodes` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102155 | 102162 | 102194 | 8 | 40 | `autoExpandDominantPath` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 102163 | 102196 | 102165 | 34 | 3 | `dominant` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102197 | 102209 | 102207 | 13 | 11 | `findNodeById` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 102210 | 102238 | 102236 | 29 | 27 | `getTreeTypeLabel` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 102239 | 102258 | 102297 | 20 | 59 | `updateCrashTreeSummary` | fn | — | refs:2 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102259 | 102299 | 102262 | 41 | 4 | `pathNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102300 | 102371 | 102369 | 72 | 70 | `updateCrashTreeStats` | fn | — | refs:13 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102372 | 102376 | 102410 | 5 | 39 | `updateCrashTreeDataTable` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102377 | 102412 | 102406 | 36 | 30 | `addRows` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 102413 | 102422 | 102626 | 10 | 214 | `analyzeRiskFactors` | fn | — | refs:10 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102423 | 102433 | 102426 | 11 | 4 | `kaCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102434 | 102434 | 102434 | 1 | 1 | `nightAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102435 | 102453 | 102435 | 19 | 1 | `nightKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102454 | 102454 | 102454 | 1 | 1 | `speedAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102455 | 102473 | 102455 | 19 | 1 | `speedKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102474 | 102474 | 102474 | 1 | 1 | `intAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102475 | 102493 | 102475 | 19 | 1 | `intKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102494 | 102517 | 102497 | 24 | 4 | `wetFilter` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102518 | 102518 | 102518 | 1 | 1 | `pedAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102519 | 102537 | 102519 | 19 | 1 | `pedKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102538 | 102538 | 102538 | 1 | 1 | `bikeAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102539 | 102558 | 102539 | 20 | 1 | `bikeKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102559 | 102559 | 102559 | 1 | 1 | `youngAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102560 | 102579 | 102560 | 20 | 1 | `youngKA` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102580 | 102580 | 102580 | 1 | 1 | `overrepFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102581 | 102628 | 102581 | 48 | 1 | `highSeverityFactors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102629 | 102663 | 102741 | 35 | 113 | `buildSecondaryTreeAnalysis` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 102664 | 102690 | 102666 | 27 | 3 | `dominant` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102691 | 102700 | 102695 | 10 | 5 | `getTreeLabel` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 102701 | 102743 | 102704 | 43 | 4 | `pathNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102744 | 102770 | 102768 | 27 | 25 | `exportCrashTreeImage` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102771 | 102796 | 104204 | 26 | 1434 | `generateCrashTreeReport` | async fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 102797 | 102809 | 102800 | 13 | 4 | `focusPath` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102810 | 102810 | 102817 | 1 | 8 | `dateRange` | const arrow | — | refs:71 | Unassigned | `app/modules/app/unassigned.js` |
| 102811 | 102859 | 102811 | 49 | 1 | `dates` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102860 | 102993 | 102877 | 134 | 18 | `hydrated` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 102994 | 102996 | 103036 | 3 | 43 | `buildTreeBreakdownHtml` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 102997 | 102998 | 103014 | 2 | 18 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 102999 | 104206 | 103007 | 1208 | 9 | `subRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 104207 | 104251 | 104244 | 45 | 38 | `generateProfessionalTableRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104252 | 104270 | 104267 | 19 | 16 | `_showFSLoadingSkeleton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 104271 | 104301 | 104298 | 31 | 28 | `initFatalSpeedingTab` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 104302 | 104648 | 104639 | 347 | 338 | `initFatalSpeedingFromMatview` | async fn | — | refs:4 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 104649 | 104660 | 104711 | 12 | 63 | `_fatalSpeeding_fetchMatviews` | async fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 104661 | 104670 | 104666 | 10 | 6 | `applyTier` | const arrow | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 104671 | 104681 | 104681 | 11 | 11 | `applyMatrixTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 104682 | 104686 | 104686 | 5 | 5 | `mk` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 104687 | 104717 | 104700 | 31 | 14 | `fetchSafe` | async const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 104718 | 104797 | 104788 | 80 | 71 | `_applyFatalSpeedingFallback` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 104798 | 104801 | 104878 | 4 | 81 | `_hydrateFSHotspotsFromMatview` | async fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 104802 | 104805 | 104802 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 104806 | 104879 | 104825 | 74 | 20 | `_stubCrashes` | const arrow | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 104880 | 104915 | 104914 | 36 | 35 | `applyFSFilters` | fn | — | refs:9 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 104916 | 104923 | 104922 | 8 | 7 | `clearFSDateFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 104924 | 105222 | 105221 | 299 | 298 | `processFSData` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 105223 | 105264 | 105258 | 42 | 36 | `updateFSDisplay` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 105265 | 105311 | 105304 | 47 | 40 | `_applyFSYoungSeniorGate` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105312 | 105314 | 105326 | 3 | 15 | `paintFSFatalCollisionChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105315 | 105327 | 105315 | 13 | 1 | `entries` | const arrow | — | refs:417 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105328 | 105330 | 105342 | 3 | 15 | `paintFSFatalYearChart` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105331 | 105343 | 105331 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105344 | 105346 | 105358 | 3 | 15 | `paintFSSpeedCollisionChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105347 | 105359 | 105347 | 13 | 1 | `entries` | const arrow | — | refs:417 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105360 | 105362 | 105374 | 3 | 15 | `paintFSSpeedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105363 | 105375 | 105363 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105376 | 105378 | 105390 | 3 | 15 | `paintFSSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105379 | 105391 | 105379 | 13 | 1 | `data` | const arrow | — | refs:7077 | Unassigned | `app/modules/app/unassigned.js` |
| 105392 | 105436 | 105448 | 45 | 57 | `paintFSNonSpeedSeverityChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105437 | 105449 | 105437 | 13 | 1 | `data` | const arrow | — | refs:7077 | Unassigned | `app/modules/app/unassigned.js` |
| 105450 | 105470 | 105469 | 21 | 20 | `paintFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105471 | 105473 | 105485 | 3 | 15 | `paintFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105474 | 105486 | 105474 | 13 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105487 | 105503 | 105502 | 17 | 16 | `updateFSFatalKPIs` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105504 | 105527 | 105526 | 24 | 23 | `updateFSFatalFactorCards` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105528 | 105541 | 105540 | 14 | 13 | `updateFSSpeedKPIs` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105542 | 105563 | 105562 | 22 | 21 | `updateFSSpeedFactorCards` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105564 | 105599 | 105598 | 36 | 35 | `updateFSCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 105600 | 105630 | 105674 | 31 | 75 | `updateFSFatalHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 105631 | 105651 | 105631 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105652 | 105676 | 105652 | 25 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105677 | 105686 | 105709 | 10 | 33 | `goToFSFatalPage` | fn | — | refs:2 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105687 | 105710 | 105687 | 24 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105711 | 105741 | 105781 | 31 | 71 | `updateFSSpeedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 105742 | 105762 | 105742 | 21 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105763 | 105783 | 105763 | 21 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105784 | 105793 | 105812 | 10 | 29 | `goToFSSpeedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105794 | 105813 | 105794 | 20 | 1 | `aCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105814 | 105877 | 105875 | 64 | 62 | `updateFSCombinedHotspots` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 105878 | 105903 | 105902 | 26 | 25 | `goToFSCombinedPage` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 105904 | 105922 | 105945 | 19 | 42 | `updateFSFatalCrossAnalysis` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 105923 | 105923 | 105930 | 1 | 8 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105924 | 105946 | 105926 | 23 | 3 | `count` | const arrow | — | refs:3744 | Unassigned | `app/modules/app/unassigned.js` |
| 105947 | 105994 | 106013 | 48 | 67 | `updateFSCombinedCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 105995 | 105996 | 105999 | 2 | 5 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 105997 | 106014 | 105997 | 18 | 1 | `kCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106015 | 106085 | 106083 | 71 | 69 | `renderFSSpeedComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106086 | 106114 | 106109 | 29 | 24 | `switchFSMatrixTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 106115 | 106126 | 106124 | 12 | 10 | `_fsShouldHideBC` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106127 | 106138 | 106136 | 12 | 10 | `_fsRenderBCBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106139 | 106147 | 106144 | 9 | 6 | `renderFSYearlyMatrices` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106148 | 106221 | 106219 | 74 | 72 | `renderFSFatalSeverityMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 106222 | 106280 | 106278 | 59 | 57 | `renderFSFatalFactorMatrix` | fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 106281 | 106383 | 106381 | 103 | 101 | `renderFSSpeedSeverityMatrix` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106384 | 106441 | 106440 | 58 | 57 | `renderFSSpeedFactorMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106442 | 106482 | 106481 | 41 | 40 | `renderFSCombinedYearChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106483 | 106494 | 106547 | 12 | 65 | `renderFSCombinedHourChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106495 | 106495 | 106495 | 1 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106496 | 106503 | 106501 | 8 | 6 | `hourLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106504 | 106506 | 106504 | 3 | 1 | `combinedData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106507 | 106548 | 106507 | 42 | 1 | `barColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106549 | 106577 | 106576 | 29 | 28 | `setFSView` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106578 | 106632 | 106631 | 55 | 54 | `selectFSFactor` | fn | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 106633 | 106642 | 106665 | 10 | 33 | `updateFSCofactorGrid` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106643 | 106666 | 106643 | 24 | 1 | `count` | const arrow | — | refs:3744 | Unassigned | `app/modules/app/unassigned.js` |
| 106667 | 106683 | 106757 | 17 | 91 | `renderFSDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106684 | 106709 | 106684 | 26 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106710 | 106735 | 106728 | 26 | 19 | `extractYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106736 | 106758 | 106736 | 23 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106759 | 106776 | 106787 | 18 | 29 | `updateFSFactorLocationTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 106777 | 106788 | 106777 | 12 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106789 | 106801 | 106800 | 13 | 12 | `closeFSDetailPanel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106802 | 106806 | 106840 | 5 | 39 | `getTopFactor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106807 | 106814 | 106807 | 8 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106815 | 106817 | 106825 | 3 | 11 | `_matchHint` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106818 | 106841 | 106820 | 24 | 3 | `matched` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 106842 | 106859 | 106858 | 18 | 17 | `viewFSOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106860 | 106881 | 106880 | 22 | 21 | `viewFSLocationOnMap` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 106882 | 106890 | 106889 | 9 | 8 | `jumpToCMFFromFS` | fn | — | refs:6 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 106891 | 106914 | 106913 | 24 | 23 | `exportFSData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 106915 | 106924 | 106923 | 10 | 9 | `exportFSFactorData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 106925 | 106935 | 106934 | 11 | 10 | `getFSCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 106936 | 107044 | 107799 | 109 | 864 | `exportFSToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107045 | 107075 | 107052 | 31 | 8 | `hexToRgb` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 107076 | 107084 | 107082 | 9 | 7 | `cleanText` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 107085 | 107092 | 107090 | 8 | 6 | `getFactorName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107093 | 107109 | 107107 | 17 | 15 | `drawHeader` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 107110 | 107134 | 107132 | 25 | 23 | `drawFooter` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 107135 | 107145 | 107143 | 11 | 9 | `newPage` | const arrow | — | refs:42 | Unassigned | `app/modules/app/unassigned.js` |
| 107146 | 107154 | 107152 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 107155 | 107175 | 107173 | 21 | 19 | `addText` | const arrow | — | refs:168 | Unassigned | `app/modules/app/unassigned.js` |
| 107176 | 107191 | 107189 | 16 | 14 | `addSectionTitle` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 107192 | 107202 | 107200 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 107203 | 107256 | 107254 | 54 | 52 | `drawSeverityBar` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107257 | 107279 | 107277 | 23 | 21 | `drawKPICard` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 107280 | 107540 | 107280 | 261 | 1 | `addSpacer` | const arrow | — | refs:109 | Unassigned | `app/modules/app/unassigned.js` |
| 107541 | 107662 | 107546 | 122 | 6 | `crashYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107663 | 107696 | 107667 | 34 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 107697 | 107804 | 107702 | 108 | 6 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 107805 | 107836 | 107835 | 32 | 31 | `getSafetyCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 107837 | 107857 | 107852 | 21 | 16 | `getSafetyLocationCMF` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 107858 | 107933 | 107931 | 76 | 74 | `showSafetyLocationDetails` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107934 | 107940 | 107939 | 7 | 6 | `viewCurrentDetailOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107941 | 107947 | 107946 | 7 | 6 | `getCurrentDetailCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 107948 | 107957 | 107955 | 10 | 8 | `exportCurrentDetail` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 107958 | 107975 | 107974 | 18 | 17 | `exportCurrentDetailToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 107976 | 108006 | 108005 | 31 | 30 | `addCurrentDetailToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108007 | 108014 | 108009 | 8 | 3 | `closeSafetyModal` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 108015 | 108027 | 108026 | 13 | 12 | `exportSafetyData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 108028 | 108037 | 108036 | 10 | 9 | `exportSafetyLocationData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108038 | 108069 | 108064 | 32 | 27 | `exportCrashesToCSV` | fn | — | refs:13 | Analysis | `app/modules/analysis/analysis.js` |
| 108070 | 108309 | 108307 | 240 | 238 | `viewCrossAnalysis` | fn | — | refs:19 | Analysis | `app/modules/analysis/analysis.js` |
| 108310 | 108324 | 108322 | 15 | 13 | `viewCrossOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108325 | 108335 | 108333 | 11 | 9 | `exportCrossAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 108336 | 108351 | 108349 | 16 | 14 | `exportCrossToKML` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108352 | 108383 | 108377 | 32 | 26 | `addCrossToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108384 | 108423 | 108421 | 40 | 38 | `populateCustomMatrixDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108424 | 108453 | 108491 | 30 | 68 | `updateCustomMatrixPreview` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 108454 | 108469 | 108457 | 16 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108470 | 108493 | 108473 | 24 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108494 | 108508 | 108506 | 15 | 13 | `getSelectedCustomMatrixFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108509 | 108521 | 108519 | 13 | 11 | `clearCustomMatrixSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108522 | 108560 | 108700 | 39 | 179 | `runCustomMatrixAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 108561 | 108598 | 108564 | 38 | 4 | `factorLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108599 | 108702 | 108602 | 104 | 4 | `matchesAll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108703 | 108717 | 108715 | 15 | 13 | `viewCustomMatrixOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108718 | 108733 | 108727 | 16 | 10 | `exportCustomMatrixData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108734 | 108757 | 108755 | 24 | 22 | `exportSafetyToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 108758 | 108785 | 108783 | 28 | 26 | `addSafetyDataToReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108786 | 108825 | 108813 | 40 | 28 | `generateSafetyCategoryReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 108826 | 108916 | 108836 | 91 | 11 | `safetyCheckInterval` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 108917 | 108953 | 108940 | 37 | 24 | `refreshActiveTabAfterDataLoad` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 108954 | 108956 | 108954 | 3 | 1 | `updateWarrantAPIKeyStatus` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 108957 | 108960 | 108957 | 4 | 1 | `loadWarrantImagery` | window fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 108961 | 108990 | 109001 | 30 | 41 | `initWarrantsTab` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 108991 | 109004 | 108991 | 14 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109005 | 109021 | 109048 | 17 | 44 | `onWarrantsTabReentry` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109022 | 109050 | 109022 | 29 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109051 | 109061 | 109059 | 11 | 9 | `populateWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109062 | 109113 | 109111 | 52 | 50 | `updateWarrantLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 109114 | 109188 | 109186 | 75 | 73 | `showWarrantStudy` | fn | — | refs:22 | Warrants | `app/modules/warrants/warrants.js` |
| 109189 | 109248 | 109246 | 60 | 58 | `filterWarrantLocations` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109249 | 109255 | 109253 | 7 | 5 | `handleWarrantSearchKeypress` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109256 | 109310 | 109304 | 55 | 49 | `triggerWarrantSearch` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 109311 | 109319 | 109344 | 9 | 34 | `applyWarrantDatePreset` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 109320 | 109346 | 109320 | 27 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 109347 | 109363 | 109361 | 17 | 15 | `clearWarrantDateFilter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109364 | 109376 | 109407 | 13 | 44 | `autoSetWarrantDateByStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109377 | 109409 | 109377 | 33 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 109410 | 109428 | 109426 | 19 | 17 | `updateWarrantPeriodBadge` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 109429 | 109469 | 109463 | 41 | 35 | `applyWarrantDateFilter` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 109470 | 109486 | 109516 | 17 | 47 | `setDefaultWarrant7Period` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 109487 | 109518 | 109487 | 32 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 109519 | 109559 | 109557 | 41 | 39 | `filterWarrantCrashesByDate` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 109560 | 109585 | 109583 | 26 | 24 | `updateWarrantDateInfo` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 109586 | 109643 | 109641 | 58 | 56 | `checkWarrantPeriodCompliance` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 109644 | 109700 | 109698 | 57 | 55 | `updateWarrantCrashDisplay` | fn | — | refs:6 | Warrants | `app/modules/warrants/warrants.js` |
| 109701 | 109715 | 109783 | 15 | 83 | `selectWarrantLocation` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 109716 | 109739 | 109726 | 24 | 11 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109740 | 109758 | 109740 | 19 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109759 | 109766 | 109759 | 8 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109767 | 109773 | 109767 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 109774 | 109785 | 109780 | 12 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 109786 | 109799 | 109896 | 14 | 111 | `loadLocationForWarrants` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 109800 | 109863 | 109812 | 64 | 13 | `poll` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109864 | 109872 | 109864 | 9 | 1 | `fallback` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109873 | 109879 | 109873 | 7 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 109880 | 109904 | 109886 | 25 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 109905 | 109914 | 109967 | 10 | 63 | `_applyWarrantHotspotDetail` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 109915 | 109923 | 109918 | 9 | 4 | `num` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 109924 | 109969 | 109927 | 46 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 109970 | 110060 | 110058 | 91 | 89 | `loadLocationDataForWarrants` | fn | — | refs:13 | Warrants | `app/modules/warrants/warrants.js` |
| 110061 | 110158 | 110156 | 98 | 96 | `buildWarrantCrashProfile` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 110159 | 110207 | 110218 | 49 | 60 | `extractWarrantRoadProperties` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 110208 | 110220 | 110208 | 13 | 1 | `topRoadDesc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110221 | 110475 | 110473 | 255 | 253 | `autoPopulateWarrantForm` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 110476 | 110481 | 110479 | 6 | 4 | `selectFromMapForWarrants` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 110482 | 110524 | 110535 | 43 | 54 | `analyzeWarrantsFromMap` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 110525 | 110540 | 110525 | 16 | 1 | `routeNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110541 | 110612 | 110598 | 72 | 58 | `evaluatePedScreening` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 110613 | 110633 | 110631 | 21 | 19 | `getRequiredSSD` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110634 | 110656 | 110654 | 23 | 21 | `updatePedSSDRequired` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110657 | 110669 | 110667 | 13 | 11 | `updatePedContextSpacing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 110670 | 110714 | 110712 | 45 | 43 | `updatePedStreetViewStatus` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110715 | 110730 | 110728 | 16 | 14 | `openPedStreetView` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 110731 | 110750 | 110842 | 20 | 112 | `ped_loadCrashData` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 110751 | 110843 | 110753 | 93 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 110844 | 110982 | 110892 | 139 | 49 | `evaluatePedCriteria` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 110983 | 111020 | 111072 | 38 | 90 | `determinePedTier` | fn | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 111021 | 111073 | 111024 | 53 | 4 | `cmDescriptions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 111074 | 111104 | 111099 | 31 | 26 | `determinePedMarking` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111105 | 111582 | 111578 | 478 | 474 | `ped_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111583 | 111602 | 111593 | 20 | 11 | `ped_printReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111603 | 111673 | 111669 | 71 | 67 | `stopsign_initForm` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111674 | 111708 | 111704 | 35 | 31 | `stopsign_showTab` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 111709 | 111786 | 111782 | 78 | 74 | `stopsign_updateSpeedThreshold` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 111787 | 111798 | 111794 | 12 | 8 | `stopsign_updateConfig` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 111799 | 111847 | 111843 | 49 | 45 | `stopsign_updateTMCGrid` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 111848 | 111899 | 111892 | 52 | 45 | `stopsign_generateTMCRows` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111900 | 111917 | 111913 | 18 | 14 | `stopsign_updateRowTotal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111918 | 111927 | 111923 | 10 | 6 | `stopsign_markTotalManual` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 111928 | 111950 | 111944 | 23 | 17 | `stopsign_calculateApproachVolumes` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 111951 | 112037 | 112031 | 87 | 81 | `stopsign_computeHourlyAggregates` | fn | — | refs:2 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112038 | 112121 | 112117 | 84 | 80 | `stopsign_evaluateCriterionCFromAggregates` | fn | — | refs:1 | Spatial/Geo | `app/modules/spatial/spatial.js` |
| 112122 | 112154 | 112254 | 33 | 133 | `stopsign_updateVolumeSummary` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 112155 | 112155 | 112155 | 1 | 1 | `totalMajor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112156 | 112258 | 112156 | 103 | 1 | `totalMinor` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112259 | 112297 | 112293 | 39 | 35 | `stopsign_setCountType` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 112298 | 112328 | 112323 | 31 | 26 | `stopsign_clearTMCForm` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 112329 | 112336 | 112332 | 8 | 4 | `stopsign_generateVolumeTable` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 112337 | 112432 | 112428 | 96 | 92 | `stopsign_updateVolumeAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 112433 | 112455 | 112475 | 23 | 43 | `stopsign_buildCrashProfile` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 112456 | 112479 | 112458 | 24 | 3 | `isSusceptible` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 112480 | 112512 | 112508 | 33 | 29 | `stopsign_autoPopulateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112513 | 112541 | 112537 | 29 | 25 | `stopsign_evaluateCriterionA` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112542 | 112571 | 112567 | 30 | 26 | `stopsign_evaluateCriterionB` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112572 | 112584 | 112632 | 13 | 61 | `stopsign_evaluateCriterionC` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112585 | 112601 | 112590 | 17 | 6 | `updateSubcriterion` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112602 | 112637 | 112608 | 36 | 7 | `updateBadge` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 112638 | 112722 | 112718 | 85 | 81 | `stopsign_calculateLOS` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112723 | 112733 | 112729 | 11 | 7 | `stopsign_toggleHCSConfig` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112734 | 112777 | 112773 | 44 | 40 | `stopsign_evaluateCriterionD` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112778 | 112826 | 112822 | 49 | 45 | `stopsign_evaluateAllCriteria` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 112827 | 112896 | 112892 | 70 | 66 | `stopsign_updateResultsTab` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 112897 | 112907 | 112903 | 11 | 7 | `stopsign_updateResultCell` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 112908 | 112931 | 112927 | 24 | 20 | `stopsign_toggleAIPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112932 | 112952 | 112948 | 21 | 17 | `stopsign_toggleDisclaimer` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112953 | 112963 | 112959 | 11 | 7 | `stopsign_handleDisclaimerCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112964 | 112982 | 112978 | 19 | 15 | `stopsign_toggleExportButtons` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 112983 | 113005 | 113001 | 23 | 19 | `stopsign_clearVolumeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113006 | 113067 | 113063 | 62 | 58 | `stopsign_saveData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113068 | 113165 | 113161 | 98 | 94 | `stopsign_loadSavedData` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113166 | 113207 | 113203 | 42 | 38 | `stopsign_exportData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113208 | 113239 | 113235 | 32 | 28 | `stopsign_importData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113240 | 113248 | 113244 | 9 | 5 | `stopsign_toggleVirginiaMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113249 | 113260 | 113256 | 12 | 8 | `stopsign_toggleVirginiaInfo` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113261 | 113302 | 113298 | 42 | 38 | `stopsign_askAI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 113303 | 113349 | 113345 | 47 | 43 | `stopsign_updateProgressIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113350 | 113419 | 113415 | 70 | 66 | `stopsign_clearAll` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113420 | 113442 | 113438 | 23 | 19 | `stopsign_confirmExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113443 | 113466 | 113462 | 24 | 20 | `stopsign_enterReviewMode` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113467 | 113493 | 113489 | 27 | 23 | `stopsign_loadNextReview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113494 | 113558 | 113552 | 65 | 59 | `stopsign_populateTMCFromExtraction` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113559 | 113617 | 113613 | 59 | 55 | `stopsign_populateTMCFromDayData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 113618 | 113629 | 113625 | 12 | 8 | `stopsign_skipCurrentReview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113630 | 113641 | 113637 | 12 | 8 | `stopsign_advanceReviewQueue` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113642 | 113659 | 113655 | 18 | 14 | `stopsign_exitReviewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113660 | 113671 | 113667 | 12 | 8 | `stopsign_discardExtractedData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113672 | 113694 | 113687 | 23 | 16 | `stopsign_clearAllDays` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113695 | 113759 | 113755 | 65 | 61 | `stopsign_onFilesSelected` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113760 | 113781 | 113777 | 22 | 18 | `stopsign_updateDaySlots` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113782 | 113825 | 113820 | 44 | 39 | `stopsign_clearAIUploads` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113826 | 113858 | 113854 | 33 | 29 | `stopsign_selectAveragingMethod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 113859 | 113866 | 113862 | 8 | 4 | `stopsign_handleFileSelect` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113867 | 113876 | 113872 | 10 | 6 | `stopsign_handleFileDrop` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 113877 | 113917 | 113913 | 41 | 37 | `stopsign_processUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113918 | 113948 | 113944 | 31 | 27 | `stopsign_removeFile` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 113949 | 113958 | 113954 | 10 | 6 | `stopsign_clearUploadedFiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 113959 | 114029 | 114025 | 71 | 67 | `stopsign_addCurrentDayToAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 114030 | 114101 | 114097 | 72 | 68 | `stopsign_updateDayCards` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 114102 | 114110 | 114106 | 9 | 5 | `stopsign_removeDayFromAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 114111 | 114188 | 114184 | 78 | 74 | `stopsign_editDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114189 | 114230 | 114226 | 42 | 38 | `stopsign_saveEditedDay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114231 | 114241 | 114237 | 11 | 7 | `stopsign_cancelEdit` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114242 | 114280 | 114270 | 39 | 29 | `stopsign_collectCurrentTMCData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114281 | 114301 | 114297 | 21 | 17 | `stopsign_readFileContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114302 | 114310 | 114320 | 9 | 19 | `stopsign_extractPDFText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114311 | 114324 | 114311 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114325 | 114346 | 114342 | 22 | 18 | `stopsign_extractExcelText` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114347 | 114358 | 114354 | 12 | 8 | `stopsign_fileToBase64` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114359 | 114563 | 114559 | 205 | 201 | `stopsign_extractAllWithAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114564 | 114692 | 114724 | 129 | 161 | `stopsign_extractSingleFileWithDualAI` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114693 | 114728 | 114693 | 36 | 1 | `errorData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 114729 | 114819 | 114815 | 91 | 87 | `stopsign_validateExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114820 | 114893 | 114883 | 74 | 64 | `stopsign_populateFromExtractedData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 114894 | 115240 | 115236 | 347 | 343 | `stopsign_generatePDFReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115241 | 115552 | 115548 | 312 | 308 | `stopsign_generateWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115553 | 115652 | 115647 | 100 | 95 | `stopsign_exportCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115653 | 115660 | 115655 | 8 | 3 | `evaluateStopWarrant` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 115661 | 115697 | 115688 | 37 | 28 | `evaluateSignalWarrants` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 115698 | 115719 | 115715 | 22 | 18 | `calculateAnalysisPeriodYears` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 115720 | 115729 | 115725 | 10 | 6 | `syncRoundaboutField` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 115730 | 115740 | 115735 | 11 | 6 | `syncRoundaboutCheckbox` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 115741 | 115779 | 115775 | 39 | 35 | `syncMainFormToQuickPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 115780 | 115852 | 115846 | 73 | 67 | `updateQuickPanelCrashSummary` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 115853 | 115982 | 115978 | 130 | 126 | `roundabout_calculateSIDRAMetrics` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 115983 | 116025 | 116021 | 43 | 39 | `roundabout_updateSIDRADisplay` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116026 | 116103 | 116079 | 78 | 54 | `roundabout_updateResultBanner` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 116104 | 116116 | 116112 | 13 | 9 | `roundabout_toggleAADTConverter` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116117 | 116156 | 116151 | 40 | 35 | `roundabout_setAADTSource` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 116157 | 116192 | 116188 | 36 | 32 | `roundabout_setKFactor` | fn | — | refs:4 | Warrants | `app/modules/warrants/warrants.js` |
| 116193 | 116216 | 116212 | 24 | 20 | `roundabout_toggleCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116217 | 116229 | 116224 | 13 | 8 | `roundabout_applyCustomKFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116230 | 116267 | 116262 | 38 | 33 | `roundabout_setDOWFactor` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 116268 | 116323 | 116318 | 56 | 51 | `roundabout_updateSeasonalFactor` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116324 | 116377 | 116373 | 54 | 50 | `roundabout_calculateAADT` | fn | — | refs:7 | Warrants | `app/modules/warrants/warrants.js` |
| 116378 | 116488 | 116420 | 111 | 43 | `roundabout_applyCalculatedAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116489 | 116507 | 116503 | 19 | 15 | `roundaboutQuick_toggleAADTConverter` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 116508 | 116564 | 116560 | 57 | 53 | `roundaboutQuick_updateLocationFactors` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 116565 | 116574 | 116568 | 10 | 4 | `toggleElement` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 116575 | 116682 | 116731 | 108 | 157 | `roundaboutQuick_calculateAADT` | fn | — | refs:8 | Warrants | `app/modules/warrants/warrants.js` |
| 116683 | 116735 | 116683 | 53 | 1 | `setRef` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 116736 | 116765 | 116760 | 30 | 25 | `roundaboutQuick_applyAADT` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116766 | 116853 | 116849 | 88 | 84 | `evaluateRoundaboutQuick` | fn | — | refs:9 | Warrants | `app/modules/warrants/warrants.js` |
| 116854 | 116871 | 116866 | 18 | 13 | `scrollToFullRoundaboutForm` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116872 | 116928 | 116927 | 57 | 56 | `roundabout_onTabShow` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 116929 | 117061 | 117041 | 133 | 113 | `evaluateRoundabout` | fn | — | refs:34 | Warrants | `app/modules/warrants/warrants.js` |
| 117062 | 117110 | 117106 | 49 | 45 | `roundabout_updateSmartIndicators` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 117111 | 117165 | 117161 | 55 | 51 | `roundabout_updateIndicator1` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117166 | 117220 | 117216 | 55 | 51 | `roundabout_updateIndicator2` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117221 | 117356 | 117352 | 136 | 132 | `roundabout_updateRiskAssessment` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117357 | 117388 | 117384 | 32 | 28 | `roundabout_resetIndicatorsToManual` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 117389 | 117397 | 117392 | 9 | 4 | `roundabout_toggleIndicatorOverride` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 117398 | 117531 | 117527 | 134 | 130 | `roundabout_autoPopulateCrashData` | fn | — | refs:3 | Warrants | `app/modules/warrants/warrants.js` |
| 117532 | 117535 | 117566 | 4 | 35 | `roundabout_updateCrashDisplay` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 117536 | 117540 | 117539 | 5 | 4 | `setVal` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 117541 | 117570 | 117544 | 30 | 4 | `setText` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 117571 | 117585 | 117581 | 15 | 11 | `roundabout_toggleApproachTable` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117586 | 117604 | 117600 | 19 | 15 | `roundabout_updateTotalFromApproaches` | fn | — | refs:5 | Warrants | `app/modules/warrants/warrants.js` |
| 117605 | 117611 | 117607 | 7 | 3 | `roundabout_uploadTrafficStudy` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117612 | 117648 | 117644 | 37 | 33 | `roundabout_handleTrafficUpload` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117649 | 117718 | 117714 | 70 | 66 | `roundabout_extractTrafficData` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117719 | 117743 | 117767 | 25 | 49 | `roundabout_applyExtractedData` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 117744 | 117771 | 117750 | 28 | 7 | `setField` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 117772 | 117877 | 117872 | 106 | 101 | `roundabout_calculateSafetyPrediction` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 117878 | 118025 | 118021 | 148 | 144 | `roundabout_calculateICEScores` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 118026 | 118143 | 118139 | 118 | 114 | `roundabout_runEnhancedEvaluation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 118144 | 118160 | 118155 | 17 | 12 | `roundabout_refreshAnalysis` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 118161 | 118550 | 118542 | 390 | 382 | `roundabout_generateWordMemo` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 118551 | 118571 | 118581 | 21 | 31 | `parsePDFContent` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118572 | 118585 | 118572 | 14 | 1 | `pageText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 118586 | 118618 | 118614 | 33 | 29 | `parseExcelContent` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118619 | 118635 | 118621 | 17 | 3 | `parseCSVContent` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 118636 | 118712 | 118708 | 77 | 73 | `geocodeIntersectionName` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 118713 | 118746 | 118742 | 34 | 30 | `saveGeocodedLocation` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 118747 | 118796 | 118790 | 50 | 44 | `loadGeocodedLocation` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 118797 | 118868 | 118861 | 72 | 65 | `debouncedGeocode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 118869 | 118892 | 118888 | 24 | 20 | `updateGeocodeIndicator` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 118893 | 118909 | 118905 | 17 | 13 | `getCurrentIntersectionName` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 118910 | 118938 | 118929 | 29 | 20 | `initWarrantGeocodeHandlers` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 118939 | 119017 | 119012 | 79 | 74 | `openWarrantStreetView` | fn | — | refs:12 | Warrants | `app/modules/warrants/warrants.js` |
| 119018 | 119034 | 119030 | 17 | 13 | `updateCurrentGeocodeIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 119035 | 119274 | 119270 | 240 | 236 | `exportWarrantPDF` | async fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 119275 | 119349 | 119449 | 75 | 175 | `exportPedestrianPDF` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 119350 | 119350 | 119350 | 1 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119351 | 119453 | 119351 | 103 | 1 | `metCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119454 | 119532 | 119578 | 79 | 125 | `exportStopSignPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 119533 | 119587 | 119533 | 55 | 1 | `criteriaData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119588 | 119631 | 119627 | 44 | 40 | `signal_initState` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119632 | 119638 | 119634 | 7 | 3 | `signal_getLaneConfig` | fn | — | refs:10 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119639 | 119645 | 119641 | 7 | 3 | `signal_getReductionFactor` | fn | — | refs:8 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119646 | 119665 | 119661 | 20 | 16 | `signal_applyPagonesAdjustment` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119666 | 119691 | 119687 | 26 | 22 | `signal_applyRTAdjustment` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119692 | 119754 | 119748 | 63 | 57 | `signal_computeHourlyAggregates` | fn | — | refs:4 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119755 | 119780 | 119776 | 26 | 22 | `signal_computeHourlyAggregatesForDay` | fn | — | refs:1 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119781 | 119787 | 119783 | 7 | 3 | `signal_calculateStreetVolumes` | fn | — | refs:9 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119788 | 119794 | 119790 | 7 | 3 | `signal_interpolateThreshold` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119795 | 119870 | 119866 | 76 | 72 | `signal_evaluateWarrant1` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119871 | 119915 | 119911 | 45 | 41 | `signal_evaluateWarrant2` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119916 | 119949 | 119968 | 34 | 53 | `signal_evaluateWarrant3` | fn | — | refs:3 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119950 | 119972 | 119950 | 23 | 1 | `peakResult` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 119973 | 119988 | 120033 | 16 | 61 | `signal_evaluateWarrant4` | fn | — | refs:2 | Warrants (Signal) | `app/modules/warrants/signal-tmc.js` |
| 119989 | 120037 | 120000 | 49 | 12 | `getPedThreshold` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
