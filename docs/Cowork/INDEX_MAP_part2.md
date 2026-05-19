# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-16 · source `app/index.html` (151729 lines)

Declarations in this part: **1233**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.
>
> ⚠ End L is computed by next-declaration-start − 1. For monomorphic, well-bracketed code this is accurate. For mega-IIFEs (e.g., the L84-L134 early-boot block) it WILDLY overestimates and creates phantom "16,440-line functions." Trust this column only for blocks under 500 lines OR when cross-verified by brace-counting.
>
> `True End L`/`True LOC` are brace-matched (string/comment/regex/template aware) and authoritative; prefer them. `End L`/`LOC` are retained only to show the legacy heuristic and its drift.

| Start L | End L | True End L | LOC | True LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|---|---|
| 40416 | 40468 | 40547 | 53 | 132 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40469 | 40507 | 40471 | 39 | 3 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40508 | 40557 | 40508 | 50 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40558 | 40566 | 40708 | 9 | 151 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40567 | 40589 | 40571 | 23 | 5 | `updateProgress` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 40590 | 40712 | 40590 | 123 | 1 | `topCollisionType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40713 | 40804 | 40833 | 92 | 121 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 40805 | 40813 | 40805 | 9 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40814 | 40835 | 40814 | 22 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 40836 | 40843 | 40842 | 8 | 7 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40844 | 40851 | 40849 | 8 | 6 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40852 | 40871 | 40869 | 20 | 18 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 40872 | 40891 | 40890 | 20 | 19 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 40892 | 40899 | 40898 | 8 | 7 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40900 | 40907 | 40906 | 8 | 7 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40908 | 40911 | 40910 | 4 | 3 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40912 | 40915 | 40914 | 4 | 3 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 40916 | 40934 | 40933 | 19 | 18 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40935 | 40957 | 40953 | 23 | 19 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 40958 | 41026 | 41020 | 69 | 63 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 41027 | 41039 | 41038 | 13 | 12 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 41040 | 41049 | 41048 | 10 | 9 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 41050 | 41067 | 41066 | 18 | 17 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 41068 | 41088 | 41087 | 21 | 20 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 41089 | 41095 | 41113 | 7 | 25 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 41096 | 41114 | 41096 | 19 | 1 | `selectedNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41115 | 41124 | 41123 | 10 | 9 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 41125 | 41140 | 41165 | 16 | 41 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 41141 | 41166 | 41141 | 26 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41167 | 41193 | 41188 | 27 | 22 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 41194 | 41201 | 41200 | 8 | 7 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41202 | 41208 | 41207 | 7 | 6 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41209 | 41222 | 41221 | 14 | 13 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41223 | 41226 | 41225 | 4 | 3 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41227 | 41246 | 41245 | 20 | 19 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41247 | 41266 | 41265 | 20 | 19 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 41267 | 41271 | 41270 | 5 | 4 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41272 | 41282 | 41281 | 11 | 10 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41283 | 41312 | 41311 | 30 | 29 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41313 | 41385 | 41504 | 73 | 192 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41386 | 41390 | 41386 | 5 | 1 | `topLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41391 | 41396 | 41391 | 6 | 1 | `topWeather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41397 | 41405 | 41397 | 9 | 1 | `topSurface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41406 | 41414 | 41406 | 9 | 1 | `topAlign` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41415 | 41420 | 41415 | 6 | 1 | `topRelation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41421 | 41505 | 41421 | 85 | 1 | `topHarmful` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41506 | 41518 | 41656 | 13 | 151 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41519 | 41657 | 41519 | 139 | 1 | `topRecs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 41658 | 41678 | 41676 | 21 | 19 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41679 | 41712 | 41711 | 34 | 33 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 41713 | 41726 | 41724 | 14 | 12 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 41727 | 41798 | 41796 | 72 | 70 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41799 | 41841 | 41839 | 43 | 41 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41842 | 41910 | 42066 | 69 | 225 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 41911 | 42070 | 41929 | 160 | 19 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 42071 | 42106 | 42105 | 36 | 35 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 42107 | 42117 | 42116 | 11 | 10 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 42118 | 42122 | 42121 | 5 | 4 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 42123 | 42128 | 42126 | 6 | 4 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 42129 | 42171 | 42169 | 43 | 41 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 42172 | 42214 | 42212 | 43 | 41 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 42215 | 42259 | 42257 | 45 | 43 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42260 | 42312 | 42310 | 53 | 51 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42313 | 42317 | 42336 | 5 | 24 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42318 | 42328 | 42318 | 11 | 1 | `headers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42329 | 42353 | 42329 | 25 | 1 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42354 | 42367 | 42530 | 14 | 177 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42368 | 42460 | 42375 | 93 | 8 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 42461 | 42461 | 42461 | 1 | 1 | `sanitizedHeaders` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42462 | 42532 | 42464 | 71 | 3 | `sanitizedBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 42533 | 42563 | 42886 | 31 | 354 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 42564 | 42606 | 42571 | 43 | 8 | `hexToRgb` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 42607 | 42612 | 42610 | 6 | 4 | `cleanText` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 42613 | 42627 | 42625 | 15 | 13 | `drawHeader` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42628 | 42647 | 42645 | 20 | 18 | `drawFooter` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42648 | 42657 | 42655 | 10 | 8 | `newPage` | const arrow | — | refs:42 | Unassigned | `app/modules/app/unassigned.js` |
| 42658 | 42666 | 42664 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 42667 | 42693 | 42691 | 27 | 25 | `drawKPICard` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 42694 | 42746 | 42744 | 53 | 51 | `drawSeverityBar` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42747 | 42887 | 42759 | 141 | 13 | `addSectionTitle` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 42888 | 42926 | 42925 | 39 | 38 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 42927 | 43051 | 43049 | 125 | 123 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43052 | 43103 | 43422 | 52 | 371 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43104 | 43175 | 43104 | 72 | 1 | `toolUseBlocks` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43176 | 43180 | 43176 | 5 | 1 | `textBlock` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43181 | 43293 | 43188 | 113 | 8 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43294 | 43347 | 43300 | 54 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43348 | 43398 | 43348 | 51 | 1 | `functionCall` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43399 | 43402 | 43399 | 4 | 1 | `textPart` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43403 | 43423 | 43409 | 21 | 7 | `searchSummary` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43424 | 43444 | 43443 | 21 | 20 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43445 | 43458 | 43456 | 14 | 12 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43459 | 43484 | 43475 | 26 | 17 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 43485 | 43496 | 43495 | 12 | 11 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43497 | 43503 | 43502 | 7 | 6 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43504 | 43514 | 43513 | 11 | 10 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43515 | 43535 | 43534 | 21 | 20 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 43536 | 43545 | 43544 | 10 | 9 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 43546 | 43550 | 43549 | 5 | 4 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 43551 | 43557 | 43603 | 7 | 53 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 43558 | 43558 | 43558 | 1 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43559 | 43604 | 43559 | 46 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43605 | 43609 | 43608 | 5 | 4 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 43610 | 43631 | 43640 | 22 | 31 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 43632 | 43641 | 43632 | 10 | 1 | `selectedLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43642 | 43671 | 43661 | 30 | 20 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43672 | 43692 | 43690 | 21 | 19 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 43693 | 43713 | 43711 | 21 | 19 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 43714 | 43718 | 43716 | 5 | 3 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 43719 | 43757 | 43751 | 39 | 33 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43758 | 43767 | 43776 | 10 | 19 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 43768 | 43782 | 43768 | 15 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 43783 | 43792 | 43801 | 10 | 19 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43793 | 43803 | 43793 | 11 | 1 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 43804 | 43819 | 43811 | 16 | 8 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 43820 | 43822 | 43838 | 3 | 19 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 43823 | 43831 | 43828 | 9 | 6 | `parseYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43832 | 43843 | 43835 | 12 | 4 | `sevList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 43844 | 43897 | 43932 | 54 | 89 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 43898 | 43939 | 43901 | 42 | 4 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 43940 | 43951 | 44061 | 12 | 122 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 43952 | 44063 | 43961 | 112 | 10 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44064 | 44086 | 44085 | 23 | 22 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 44087 | 44118 | 44116 | 32 | 30 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44119 | 44154 | 44153 | 36 | 35 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 44155 | 44338 | 44334 | 184 | 180 | `getFilteredStats` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44339 | 44362 | 44361 | 24 | 23 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 44363 | 44412 | 44742 | 50 | 380 | `updateDashboard` | fn | — | refs:33 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 44413 | 44506 | 44413 | 94 | 1 | `filteredYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44507 | 44539 | 44507 | 33 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44540 | 44607 | 44618 | 68 | 79 | `calcPeriodMatchedStats` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44608 | 44623 | 44608 | 16 | 1 | `isYes` | const arrow | — | refs:356 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44624 | 44725 | 44649 | 102 | 26 | `getTrendHtml` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 44726 | 44743 | 44726 | 18 | 1 | `fcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44744 | 44787 | 44826 | 44 | 83 | `updateCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44788 | 44794 | 44788 | 7 | 1 | `fcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44795 | 44801 | 44795 | 7 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44802 | 44802 | 44802 | 1 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 44803 | 44803 | 44803 | 1 | 1 | `weatherLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44804 | 44814 | 44804 | 11 | 1 | `weatherData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44815 | 44815 | 44815 | 1 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 44816 | 44816 | 44816 | 1 | 1 | `lightLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44817 | 44828 | 44817 | 12 | 1 | `lightData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 44829 | 44863 | 44845 | 35 | 17 | `buildCustomLegend` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 44864 | 44916 | 44911 | 53 | 48 | `buildTierComparison` | fn | — | refs:5 | Core/Tier | `app/modules/core/tier.js` |
| 44917 | 44975 | 44970 | 59 | 54 | `buildRegionComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 44976 | 45032 | 45025 | 57 | 50 | `buildMPOComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45033 | 45049 | 45041 | 17 | 9 | `getComparisonRowColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45050 | 45052 | 45071 | 3 | 22 | `buildComparisonSparkline` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45053 | 45056 | 45053 | 4 | 1 | `values` | const arrow | — | refs:91 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45057 | 45077 | 45061 | 21 | 5 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45078 | 45097 | 45089 | 20 | 12 | `buildComparisonTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45098 | 45106 | 45159 | 9 | 62 | `renderComparisonRows` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 45107 | 45109 | 45107 | 3 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45110 | 45110 | 45110 | 1 | 1 | `epdoValues` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45111 | 45111 | 45111 | 1 | 1 | `mean` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45112 | 45175 | 45112 | 64 | 1 | `sd` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45176 | 45203 | 45197 | 28 | 22 | `sortComparisonTable` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45204 | 45234 | 45230 | 31 | 27 | `renderComparisonFooter` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 45235 | 45278 | 45274 | 44 | 40 | `renderRegionComparisonTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45279 | 45320 | 45316 | 42 | 38 | `renderMPOComparisonTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45321 | 45347 | 45398 | 27 | 78 | `renderCountyComparisonTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45348 | 45359 | 45348 | 12 | 1 | `memberNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45360 | 45407 | 45360 | 48 | 1 | `memberNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45408 | 45416 | 45477 | 9 | 70 | `hydrateComparisonsFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 45417 | 45422 | 45418 | 6 | 2 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45423 | 45423 | 45423 | 1 | 1 | `map` | const arrow | — | refs:3434 | Unassigned | `app/modules/app/unassigned.js` |
| 45424 | 45482 | 45444 | 59 | 21 | `_toItem` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45483 | 45488 | 45503 | 6 | 21 | `exportComparisonCSV` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 45489 | 45511 | 45493 | 23 | 5 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45512 | 45585 | 45580 | 74 | 69 | `handleComparisonDrillDown` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 45586 | 45620 | 45616 | 35 | 31 | `navigateBreadcrumbTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 45621 | 45660 | 45656 | 40 | 36 | `updateTierBreadcrumb` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 45661 | 45730 | 45714 | 70 | 54 | `updateTierScopeHeader` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 45731 | 45754 | 45753 | 24 | 23 | `paintWhenVisible` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 45755 | 45774 | 45918 | 20 | 164 | `paintDashboardChartsFromMatview` | async fn | — | refs:3 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 45775 | 45779 | 45775 | 5 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45780 | 45863 | 45784 | 84 | 5 | `yoy` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45864 | 45864 | 45864 | 1 | 1 | `wxLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45865 | 45870 | 45865 | 6 | 1 | `wxData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45871 | 45885 | 45871 | 15 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45886 | 45886 | 45886 | 1 | 1 | `ltLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45887 | 45892 | 45887 | 6 | 1 | `ltData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 45893 | 45926 | 45893 | 34 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45927 | 46002 | 45993 | 76 | 67 | `updateDashboardTierSections` | fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 46003 | 46013 | 46006 | 11 | 4 | `isMultiCountyTier` | fn | — | refs:14 | Core/Tier | `app/modules/core/tier.js` |
| 46014 | 46052 | 46042 | 39 | 29 | `buildCountyFilterDropdown` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46053 | 46109 | 46107 | 57 | 55 | `renderComparisonHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46110 | 46118 | 46115 | 9 | 6 | `_compHexToRgb` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46119 | 46154 | 46145 | 36 | 27 | `toggleCountyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46155 | 46167 | 46164 | 13 | 10 | `_markDashboardChartPainted` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 46168 | 46208 | 46168 | 41 | 1 | `createChart` | fn | — | refs:93 | Unassigned | `app/modules/app/unassigned.js` |
| 46209 | 46223 | 46222 | 15 | 14 | `showChartPlaceholder` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 46224 | 46247 | 46232 | 24 | 9 | `clearChartPlaceholder` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 46248 | 46257 | 46255 | 10 | 8 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 46258 | 46266 | 46265 | 9 | 8 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46267 | 46270 | 46269 | 4 | 3 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46271 | 46282 | 46281 | 12 | 11 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 46283 | 46319 | 46317 | 37 | 35 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 46320 | 46343 | 46342 | 24 | 23 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46344 | 46351 | 46350 | 8 | 7 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46352 | 46387 | 46386 | 36 | 35 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 46388 | 46407 | 46406 | 20 | 19 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46408 | 46416 | 46415 | 9 | 8 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 46417 | 46435 | 46439 | 19 | 23 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 46436 | 46436 | 46436 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46437 | 46451 | 46437 | 15 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 46452 | 46530 | 46524 | 79 | 73 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 46531 | 46536 | 46535 | 6 | 5 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46537 | 46547 | 46796 | 11 | 260 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 46548 | 46548 | 46548 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46549 | 46744 | 46549 | 196 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46745 | 46764 | 46788 | 20 | 44 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46765 | 46802 | 46777 | 38 | 13 | `pts` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46803 | 46822 | 46831 | 20 | 29 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 46823 | 46832 | 46823 | 10 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 46833 | 46979 | 46977 | 147 | 145 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 46980 | 47035 | 47034 | 56 | 55 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47036 | 47113 | 47155 | 78 | 120 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 47114 | 47156 | 47117 | 43 | 4 | `heatData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 47157 | 47169 | 47222 | 13 | 66 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47170 | 47223 | 47207 | 54 | 38 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47224 | 47265 | 47238 | 42 | 15 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47266 | 47315 | 47313 | 50 | 48 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 47316 | 47328 | 47326 | 13 | 11 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47329 | 47342 | 47340 | 14 | 12 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47343 | 47362 | 47360 | 20 | 18 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47363 | 47396 | 47394 | 34 | 32 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47397 | 47414 | 47405 | 18 | 9 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47415 | 47433 | 47432 | 19 | 18 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 47434 | 47454 | 47441 | 21 | 8 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47455 | 47501 | 47475 | 47 | 21 | `applySafetyFocusCapabilityGates` | async fn | — | refs:3 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 47502 | 47518 | 47511 | 17 | 10 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47519 | 47531 | 47523 | 13 | 5 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47532 | 47562 | 47552 | 31 | 21 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47563 | 47623 | 47588 | 61 | 26 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 47624 | 47688 | 47684 | 65 | 61 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47689 | 47737 | 47720 | 49 | 32 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47738 | 47767 | 47759 | 30 | 22 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47768 | 47826 | 47805 | 59 | 38 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 47827 | 47829 | 47873 | 3 | 47 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47830 | 47840 | 47839 | 11 | 10 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47841 | 47878 | 47854 | 38 | 14 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47879 | 47890 | 47884 | 12 | 6 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47891 | 47973 | 47966 | 83 | 76 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47974 | 48029 | 48020 | 56 | 47 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48030 | 48065 | 48059 | 36 | 30 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48066 | 48087 | 48085 | 22 | 20 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48088 | 48135 | 48097 | 48 | 10 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 48136 | 48207 | 48206 | 72 | 71 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 48208 | 48212 | 48210 | 5 | 3 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48213 | 48241 | 48239 | 29 | 27 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 48242 | 48274 | 48300 | 33 | 59 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48275 | 48286 | 48277 | 12 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48287 | 48302 | 48293 | 16 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48303 | 48380 | 48378 | 78 | 76 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48381 | 48392 | 48449 | 12 | 69 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48393 | 48415 | 48395 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48416 | 48423 | 48416 | 8 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48424 | 48451 | 48424 | 28 | 1 | `routePoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48452 | 48465 | 48463 | 14 | 12 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48466 | 48498 | 48490 | 33 | 25 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48499 | 48558 | 48556 | 60 | 58 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48559 | 48582 | 48580 | 24 | 22 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48583 | 48664 | 48659 | 82 | 77 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48665 | 48711 | 48704 | 47 | 40 | `updateMapSearchPlaceholder` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 48712 | 48722 | 48720 | 11 | 9 | `updateMapScopeLabel` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 48723 | 48806 | 48820 | 84 | 98 | `searchMapboxAddresses` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48807 | 48822 | 48808 | 16 | 2 | `locality` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 48823 | 48879 | 48877 | 57 | 55 | `selectAddressResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48880 | 48914 | 48912 | 35 | 33 | `clearMapAddressSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48915 | 48928 | 48926 | 14 | 12 | `updateMapSearchClearButton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 48929 | 48940 | 48938 | 12 | 10 | `findCrashesNearPoint` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 48941 | 48952 | 48950 | 12 | 10 | `getDistanceMeters` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 48953 | 48979 | 48960 | 27 | 8 | `calculateNearbyCrashSeverity` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 48980 | 49013 | 48980 | 34 | 1 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 49014 | 49037 | 49014 | 24 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49038 | 49055 | 49041 | 18 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49056 | 49083 | 49056 | 28 | 1 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49084 | 49085 | 49084 | 2 | 1 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49086 | 49086 | 49086 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49087 | 49101 | 49087 | 15 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49102 | 49120 | 49105 | 19 | 4 | `markers` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49121 | 49145 | 49141 | 25 | 21 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49146 | 49159 | 49155 | 14 | 10 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49160 | 49163 | 49178 | 4 | 19 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 49164 | 49164 | 49164 | 1 | 1 | `lats` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49165 | 49189 | 49165 | 25 | 1 | `lngs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49190 | 49235 | 49220 | 46 | 31 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 49236 | 49410 | 49464 | 175 | 229 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49411 | 49466 | 49411 | 56 | 1 | `count` | const arrow | — | refs:3744 | Unassigned | `app/modules/app/unassigned.js` |
| 49467 | 49470 | 49469 | 4 | 3 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49471 | 49477 | 49476 | 7 | 6 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49478 | 49506 | 49505 | 29 | 28 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49507 | 49507 | 49522 | 1 | 16 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49508 | 49513 | 49510 | 6 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49514 | 49514 | 49514 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49515 | 49517 | 49515 | 3 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49518 | 49531 | 49518 | 14 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49532 | 49553 | 49612 | 22 | 81 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49554 | 49566 | 49556 | 13 | 3 | `locationPoints` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49567 | 49613 | 49573 | 47 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49614 | 49618 | 49675 | 5 | 62 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49619 | 49641 | 49621 | 23 | 3 | `points` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49642 | 49642 | 49642 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49643 | 49646 | 49643 | 4 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49647 | 49676 | 49647 | 30 | 1 | `bounds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49677 | 49686 | 49685 | 10 | 9 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49687 | 49725 | 49724 | 39 | 38 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49726 | 49754 | 49747 | 29 | 22 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 49755 | 49815 | 49813 | 61 | 59 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 49816 | 49835 | 49867 | 20 | 52 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 49836 | 49869 | 49836 | 34 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 49870 | 49951 | 49949 | 82 | 80 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 49952 | 49998 | 49996 | 47 | 45 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49999 | 50080 | 50077 | 82 | 79 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50081 | 50088 | 50137 | 8 | 57 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50089 | 50139 | 50102 | 51 | 14 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 50140 | 50152 | 50179 | 13 | 40 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50153 | 50166 | 50165 | 14 | 13 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50167 | 50181 | 50169 | 15 | 3 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50182 | 50192 | 50190 | 11 | 9 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50193 | 50207 | 50205 | 15 | 13 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50208 | 50216 | 50225 | 9 | 18 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50217 | 50228 | 50217 | 12 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 50229 | 50233 | 50231 | 5 | 3 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 50234 | 50250 | 50248 | 17 | 15 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50251 | 50261 | 50259 | 11 | 9 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50262 | 50274 | 50272 | 13 | 11 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50275 | 50290 | 50289 | 16 | 15 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50291 | 50354 | 50295 | 64 | 5 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50355 | 50468 | 50466 | 114 | 112 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50469 | 50477 | 50476 | 9 | 8 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50478 | 50488 | 50487 | 11 | 10 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50489 | 50505 | 50504 | 17 | 16 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50506 | 50531 | 50530 | 26 | 25 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50532 | 50537 | 50536 | 6 | 5 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50538 | 50548 | 50547 | 11 | 10 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50549 | 50558 | 50557 | 10 | 9 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50559 | 50565 | 50564 | 7 | 6 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50566 | 50595 | 50594 | 30 | 29 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50596 | 50624 | 50623 | 29 | 28 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50625 | 50639 | 50638 | 15 | 14 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50640 | 50669 | 50661 | 30 | 22 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50670 | 50679 | 50675 | 10 | 6 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50680 | 50687 | 50683 | 8 | 4 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50688 | 50700 | 50696 | 13 | 9 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50701 | 50744 | 50740 | 44 | 40 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50745 | 50754 | 50750 | 10 | 6 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50755 | 50790 | 50786 | 36 | 32 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50791 | 50801 | 50797 | 11 | 7 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50802 | 50842 | 50838 | 41 | 37 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50843 | 50853 | 50849 | 11 | 7 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 50854 | 50879 | 50878 | 26 | 25 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50880 | 50922 | 50921 | 43 | 42 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50923 | 50977 | 50964 | 55 | 42 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 50978 | 50998 | 50997 | 21 | 20 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50999 | 51017 | 51013 | 19 | 15 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51018 | 51043 | 51039 | 26 | 22 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51044 | 51104 | 51103 | 61 | 60 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51105 | 51190 | 51227 | 86 | 123 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51191 | 51191 | 51191 | 1 | 1 | `sumLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51192 | 51199 | 51192 | 8 | 1 | `sumLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51200 | 51228 | 51200 | 29 | 1 | `crashRecords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51229 | 51246 | 51245 | 18 | 17 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51247 | 51265 | 51264 | 19 | 18 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 51266 | 51272 | 51271 | 7 | 6 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51273 | 51279 | 51278 | 7 | 6 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51280 | 51287 | 51286 | 8 | 7 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51288 | 51334 | 51333 | 47 | 46 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51335 | 51387 | 51382 | 53 | 48 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51388 | 51552 | 51551 | 165 | 164 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51553 | 51556 | 51555 | 4 | 3 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 51557 | 51575 | 51654 | 19 | 98 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 51576 | 51657 | 51582 | 82 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51658 | 51671 | 51789 | 14 | 132 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 51672 | 51702 | 51678 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51703 | 51707 | 51703 | 5 | 1 | `sortedRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51708 | 51711 | 51710 | 4 | 3 | `validCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51712 | 51712 | 51712 | 1 | 1 | `centroidLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51713 | 51791 | 51713 | 79 | 1 | `centroidLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51792 | 51805 | 51925 | 14 | 134 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 51806 | 51836 | 51812 | 31 | 7 | `matchedRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51837 | 51851 | 51837 | 15 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51852 | 51852 | 51852 | 1 | 1 | `topRoadType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51853 | 51927 | 51853 | 75 | 1 | `topAreaType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 51928 | 51954 | 52004 | 27 | 77 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 51955 | 52007 | 51955 | 53 | 1 | `topRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52008 | 52174 | 52172 | 167 | 165 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 52175 | 52181 | 52179 | 7 | 5 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52182 | 52185 | 52242 | 4 | 61 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52186 | 52203 | 52186 | 18 | 1 | `exists` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52204 | 52206 | 52204 | 3 | 1 | `inVisibleList` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52207 | 52215 | 52207 | 9 | 1 | `mapSelectionLoc` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52216 | 52244 | 52216 | 29 | 1 | `newIdx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 52245 | 52293 | 52291 | 49 | 47 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52294 | 52298 | 52296 | 5 | 3 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52299 | 52303 | 52301 | 5 | 3 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 52304 | 52343 | 52341 | 40 | 38 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 52344 | 52364 | 52363 | 21 | 20 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 52365 | 52376 | 52375 | 12 | 11 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52377 | 52388 | 52428 | 12 | 52 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52389 | 52404 | 52403 | 16 | 15 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 52405 | 52456 | 52405 | 52 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 52457 | 52461 | 52747 | 5 | 291 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52462 | 52469 | 52467 | 8 | 6 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52470 | 52677 | 52475 | 208 | 6 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52678 | 52748 | 52683 | 71 | 6 | `formatDate` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 52749 | 52775 | 52773 | 27 | 25 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52776 | 52793 | 54021 | 18 | 1246 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 52794 | 52808 | 52806 | 15 | 13 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 52809 | 52825 | 52823 | 17 | 15 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 52826 | 52836 | 52834 | 11 | 9 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 52837 | 52868 | 52866 | 32 | 30 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 52869 | 52888 | 52886 | 20 | 18 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52889 | 52971 | 52899 | 83 | 11 | `checkPageBreak` | fn | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 52972 | 53051 | 52972 | 80 | 1 | `maxSevCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53052 | 53196 | 53052 | 145 | 1 | `maxCollisionPct` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53197 | 53241 | 53201 | 45 | 5 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53242 | 53323 | 53251 | 82 | 10 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53324 | 53524 | 53324 | 201 | 1 | `hasSatelliteCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 53525 | 54067 | 53525 | 543 | 1 | `uniqueLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54068 | 54089 | 54085 | 22 | 18 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 54090 | 54098 | 54094 | 9 | 5 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54099 | 54268 | 54192 | 170 | 94 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54269 | 54284 | 54278 | 16 | 10 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54285 | 54301 | 54294 | 17 | 10 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54302 | 54311 | 54304 | 10 | 3 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54312 | 54338 | 54332 | 27 | 21 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54339 | 54351 | 54345 | 13 | 7 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54352 | 54369 | 54451 | 18 | 100 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54370 | 54386 | 54380 | 17 | 11 | `timeoutId` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54387 | 54457 | 54387 | 71 | 1 | `errorText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 54458 | 54468 | 54462 | 11 | 5 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54469 | 54500 | 54494 | 32 | 26 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54501 | 54519 | 54514 | 19 | 14 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54520 | 54540 | 54533 | 21 | 14 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54541 | 54587 | 54581 | 47 | 41 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 54588 | 54661 | 54656 | 74 | 69 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54662 | 54738 | 54731 | 77 | 70 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54739 | 54773 | 54768 | 35 | 30 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 54774 | 55101 | 55097 | 328 | 324 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55102 | 55201 | 55197 | 100 | 96 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 55202 | 55202 | 55266 | 1 | 65 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55203 | 55225 | 55204 | 23 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55226 | 55270 | 55226 | 45 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55271 | 55358 | 55354 | 88 | 84 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55359 | 55359 | 55427 | 1 | 69 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55360 | 55431 | 55361 | 72 | 2 | `segment` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55432 | 55449 | 55444 | 18 | 13 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55450 | 55463 | 55459 | 14 | 10 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55464 | 55573 | 55569 | 110 | 106 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55574 | 55594 | 55626 | 21 | 53 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55595 | 55630 | 55595 | 36 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55631 | 55654 | 55650 | 24 | 20 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55655 | 55670 | 55666 | 16 | 12 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 55671 | 55677 | 55703 | 7 | 33 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55678 | 55695 | 55694 | 18 | 17 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 55696 | 55707 | 55696 | 12 | 1 | `csvContent` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55708 | 55740 | 55771 | 33 | 64 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55741 | 55774 | 55751 | 34 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55775 | 55797 | 55795 | 23 | 21 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55798 | 55816 | 55814 | 19 | 17 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55817 | 55827 | 55825 | 11 | 9 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55828 | 55845 | 55843 | 18 | 16 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55846 | 55853 | 55851 | 8 | 6 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55854 | 55901 | 55891 | 48 | 38 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55902 | 55920 | 56087 | 19 | 186 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 55921 | 55923 | 55926 | 3 | 6 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55924 | 55981 | 55924 | 58 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 55982 | 55987 | 55987 | 6 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 55988 | 56046 | 55994 | 59 | 7 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56047 | 56069 | 56051 | 23 | 5 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 56070 | 56089 | 56070 | 20 | 1 | `yearTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56090 | 56147 | 56298 | 58 | 209 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 56148 | 56300 | 56148 | 153 | 1 | `hs` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56301 | 56341 | 56339 | 41 | 39 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56342 | 56358 | 56356 | 17 | 15 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 56359 | 56567 | 56565 | 209 | 207 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56568 | 56590 | 56588 | 23 | 21 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 56591 | 56600 | 56658 | 10 | 68 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56601 | 56603 | 56601 | 3 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56604 | 56660 | 56604 | 57 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56661 | 56678 | 56676 | 18 | 16 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 56679 | 56731 | 56812 | 53 | 134 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56732 | 56759 | 56732 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56760 | 56773 | 56760 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56774 | 56787 | 56774 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 56788 | 56801 | 56788 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 56802 | 56814 | 56802 | 13 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56815 | 56819 | 56859 | 5 | 45 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56820 | 56830 | 56820 | 11 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 56831 | 56861 | 56837 | 31 | 7 | `getHeatmapColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56862 | 56899 | 56897 | 38 | 36 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56900 | 56943 | 56946 | 44 | 47 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 56944 | 56947 | 56944 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 56948 | 56971 | 57348 | 24 | 401 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 56972 | 57106 | 56989 | 135 | 18 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57107 | 57208 | 57125 | 102 | 19 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 57209 | 57349 | 57218 | 141 | 10 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 57350 | 57360 | 57358 | 11 | 9 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57361 | 57367 | 57366 | 7 | 6 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57368 | 57381 | 57371 | 14 | 4 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57382 | 57435 | 57452 | 54 | 71 | `analyzeHotspots` | fn | — | refs:14 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57436 | 57458 | 57436 | 23 | 1 | `validLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57459 | 57676 | 57668 | 218 | 210 | `_loadHotspotsFromMatview` | async fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57677 | 57725 | 57718 | 49 | 42 | `_hotspots_fetchMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57726 | 57726 | 57775 | 1 | 50 | `_renderHotspotsTableFromMatview` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57727 | 57777 | 57769 | 51 | 43 | `mapped` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 57778 | 57802 | 57800 | 25 | 23 | `autoSelectTopHotspot` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57803 | 57817 | 57815 | 15 | 13 | `showHotspotInfoBanner` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57818 | 57856 | 57964 | 39 | 147 | `getFilteredHotspotAggregates` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57857 | 57888 | 57857 | 32 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57889 | 57947 | 57889 | 59 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57948 | 57950 | 57956 | 3 | 9 | `resolveJurisdiction` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57951 | 57966 | 57951 | 16 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 57967 | 57983 | 57982 | 17 | 16 | `updateHotspotFilterSummary` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 57984 | 58051 | 58049 | 68 | 66 | `renderHotspots` | fn | — | refs:15 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58052 | 58057 | 58055 | 6 | 4 | `goToHotspotPage` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58058 | 58060 | 58063 | 3 | 6 | `askMUTCDForHotspot` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58061 | 58070 | 58061 | 10 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 58071 | 58101 | 58128 | 31 | 58 | `openHotspotStreetView` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58102 | 58114 | 58106 | 13 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58115 | 58129 | 58119 | 15 | 5 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58130 | 58132 | 58159 | 3 | 30 | `showLocationModal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 58133 | 58160 | 58133 | 28 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 58161 | 58163 | 58186 | 3 | 26 | `zoomToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58164 | 58187 | 58172 | 24 | 9 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 58188 | 58237 | 58250 | 50 | 63 | `filterMapForLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58238 | 58238 | 58238 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58239 | 58251 | 58239 | 13 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58252 | 58275 | 58274 | 24 | 23 | `exportHotspotsCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58276 | 58289 | 58454 | 14 | 179 | `exportHotspotsPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 58290 | 58290 | 58290 | 1 | 1 | `totalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58291 | 58291 | 58291 | 1 | 1 | `totalFatal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58292 | 58292 | 58292 | 1 | 1 | `totalSerious` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58293 | 58304 | 58293 | 12 | 1 | `totalEPDO` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58305 | 58373 | 58322 | 69 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 58374 | 58458 | 58386 | 85 | 13 | `tableBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58459 | 58488 | 58479 | 30 | 21 | `updateAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 58489 | 58534 | 58599 | 46 | 111 | `switchAnalysisSubtab` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 58535 | 58543 | 58535 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 58544 | 58606 | 58544 | 63 | 1 | `months` | const arrow | — | refs:118 | Unassigned | `app/modules/app/unassigned.js` |
| 58607 | 58623 | 58607 | 17 | 1 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58624 | 58658 | 58657 | 35 | 34 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 58659 | 58687 | 58675 | 29 | 17 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58688 | 58712 | 58711 | 25 | 24 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58713 | 58759 | 58745 | 47 | 33 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58760 | 58779 | 58778 | 20 | 19 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 58780 | 58784 | 58783 | 5 | 4 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58785 | 58860 | 58820 | 76 | 36 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58861 | 58898 | 58890 | 38 | 30 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58899 | 58912 | 58907 | 14 | 9 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58913 | 58955 | 58951 | 43 | 39 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 58956 | 58980 | 58976 | 25 | 21 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 58981 | 59014 | 58985 | 34 | 5 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59015 | 59033 | 59025 | 19 | 11 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59034 | 59060 | 59053 | 27 | 20 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 59061 | 59084 | 59075 | 24 | 15 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 59085 | 59109 | 59102 | 25 | 18 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59110 | 59119 | 59135 | 10 | 26 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 59120 | 59130 | 59124 | 11 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59131 | 59131 | 59131 | 1 | 1 | `avgLat` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59132 | 59143 | 59132 | 12 | 1 | `avgLng` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59144 | 59159 | 59153 | 16 | 10 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59160 | 59160 | 59192 | 1 | 33 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 59161 | 59172 | 59166 | 12 | 6 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 59173 | 59184 | 59177 | 12 | 5 | `validCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59185 | 59199 | 59188 | 15 | 4 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59200 | 59371 | 59200 | 172 | 1 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 59372 | 59386 | 59380 | 15 | 9 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 59387 | 59399 | 59394 | 13 | 8 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 59400 | 59418 | 59492 | 19 | 93 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59419 | 59498 | 59419 | 80 | 1 | `drawingCrashIds` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59499 | 59500 | 59516 | 2 | 18 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59501 | 59520 | 59505 | 20 | 5 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 59521 | 59538 | 59534 | 18 | 14 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59539 | 59548 | 59615 | 10 | 77 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59549 | 59592 | 59549 | 44 | 1 | `coords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59593 | 59619 | 59593 | 27 | 1 | `lineCoords` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59620 | 59629 | 59645 | 10 | 26 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 59630 | 59649 | 59633 | 20 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 59650 | 59650 | 59663 | 1 | 14 | `exportPedCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59651 | 59667 | 59653 | 17 | 3 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59668 | 59668 | 59681 | 1 | 14 | `exportBikeCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 59669 | 59685 | 59671 | 17 | 3 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59686 | 59686 | 59697 | 1 | 12 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 59687 | 59701 | 59687 | 15 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 59702 | 59724 | 59720 | 23 | 19 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 59725 | 59741 | 59737 | 17 | 13 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 59742 | 59754 | 59774 | 13 | 33 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 59755 | 59786 | 59761 | 32 | 7 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 59787 | 59815 | 59810 | 29 | 24 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 59816 | 59852 | 59850 | 37 | 35 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 59853 | 59863 | 59862 | 11 | 10 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 59864 | 59892 | 59884 | 29 | 21 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 59893 | 59993 | 60134 | 101 | 242 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 59994 | 60014 | 59994 | 21 | 1 | `intTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60015 | 60015 | 60015 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60016 | 60016 | 60016 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60017 | 60018 | 60017 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60019 | 60060 | 60019 | 42 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60061 | 60142 | 60061 | 82 | 1 | `yrSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60143 | 60178 | 60172 | 36 | 30 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 60179 | 60180 | 60202 | 2 | 24 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60181 | 60203 | 60188 | 23 | 8 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60204 | 60305 | 60304 | 102 | 101 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 60306 | 60338 | 60410 | 33 | 105 | `updateIntersectionTab` | fn | — | refs:12 | Intersections | `app/modules/intersection/intersection.js` |
| 60339 | 60339 | 60339 | 1 | 1 | `tcSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60340 | 60340 | 60340 | 1 | 1 | `tcLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60341 | 60342 | 60341 | 2 | 1 | `tcData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60343 | 60352 | 60343 | 10 | 1 | `tcTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60353 | 60355 | 60353 | 3 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60356 | 60387 | 60356 | 32 | 1 | `icSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60388 | 60393 | 60388 | 6 | 1 | `top` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60394 | 60412 | 60394 | 19 | 1 | `nodeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60413 | 60433 | 60431 | 21 | 19 | `_updateIntersectionThead` | fn | — | refs:3 | Intersections | `app/modules/intersection/intersection.js` |
| 60434 | 60441 | 60464 | 8 | 31 | `_renderIntersectionRows` | fn | — | refs:5 | Intersections | `app/modules/intersection/intersection.js` |
| 60442 | 60466 | 60442 | 25 | 1 | `isSelected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60467 | 60473 | 60471 | 7 | 5 | `goToIntersectionPage` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60474 | 60503 | 60501 | 30 | 28 | `autoSelectTopIntersection` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60504 | 60518 | 60516 | 15 | 13 | `showIntInfoBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60519 | 60520 | 60523 | 2 | 5 | `askMUTCDForIntersection` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60521 | 60525 | 60521 | 5 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 60526 | 60527 | 60566 | 2 | 41 | `exportIntersectionCSV` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60528 | 60568 | 60528 | 41 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60569 | 60672 | 60953 | 104 | 385 | `exportIntersectionPDF` | async fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 60673 | 60679 | 60673 | 7 | 1 | `ys` | const arrow | — | refs:370 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60680 | 60690 | 60680 | 11 | 1 | `nodeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60691 | 60709 | 60708 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 60710 | 60879 | 60721 | 170 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 60880 | 60976 | 60890 | 97 | 11 | `tableData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 60977 | 60991 | 60998 | 15 | 22 | `toggleIntSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60992 | 61000 | 60992 | 9 | 1 | `idx` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61001 | 61002 | 61020 | 2 | 20 | `toggleAllIntSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61003 | 61022 | 61003 | 20 | 1 | `nodeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61023 | 61035 | 61033 | 13 | 11 | `clearIntSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61036 | 61057 | 61055 | 22 | 20 | `updateIntSelectionCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 61058 | 61065 | 61063 | 8 | 6 | `setIntViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61066 | 61084 | 61082 | 19 | 17 | `resetIntPeakDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61085 | 61094 | 61092 | 10 | 8 | `getIntPeakHours` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61095 | 61113 | 61111 | 19 | 17 | `isInIntPeakPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61114 | 61144 | 61142 | 31 | 29 | `updateIntDetailPanel` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61145 | 61163 | 61287 | 19 | 143 | `aggregateIntDetailData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61164 | 61289 | 61164 | 126 | 1 | `selectedNodes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61290 | 61290 | 61318 | 1 | 29 | `calculateIntCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61291 | 61320 | 61291 | 30 | 1 | `intCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61321 | 61333 | 61331 | 13 | 11 | `getIntCollisionProblemClass` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61334 | 61346 | 61344 | 13 | 11 | `renderIntDetailContent` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61347 | 61366 | 61443 | 20 | 97 | `renderIntCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61367 | 61445 | 61367 | 79 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61446 | 61454 | 61452 | 9 | 7 | `renderIntFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61455 | 61457 | 61475 | 3 | 21 | `renderIntCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61458 | 61465 | 61458 | 8 | 1 | `nodeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61466 | 61466 | 61466 | 1 | 1 | `topCollision` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61467 | 61477 | 61467 | 11 | 1 | `rank` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61478 | 61486 | 61485 | 9 | 8 | `initIntDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61487 | 61512 | 61546 | 26 | 60 | `initIntCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61513 | 61524 | 61513 | 12 | 1 | `events` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61525 | 61530 | 61525 | 6 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61531 | 61536 | 61531 | 6 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 61537 | 61542 | 61537 | 6 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61543 | 61547 | 61543 | 5 | 1 | `status` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61548 | 61551 | 61571 | 4 | 24 | `renderIntMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61552 | 61572 | 61552 | 21 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61573 | 61589 | 61587 | 17 | 15 | `initIntCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61590 | 61592 | 61596 | 3 | 7 | `exportIntDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61593 | 61593 | 61593 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 61594 | 61597 | 61594 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 61598 | 61632 | 61868 | 35 | 271 | `exportIntDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61633 | 61640 | 61633 | 8 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61641 | 61659 | 61658 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 61660 | 61869 | 61671 | 210 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 61870 | 61872 | 61877 | 3 | 8 | `exportIntDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61873 | 61889 | 61873 | 17 | 1 | `title` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61890 | 61950 | 62055 | 61 | 166 | `updatePedBikeTab` | fn | — | refs:3 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 61951 | 61983 | 61951 | 33 | 1 | `pedLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 61984 | 62081 | 61984 | 98 | 1 | `bikeLight` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62082 | 62089 | 62087 | 8 | 6 | `togglePedFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 62090 | 62097 | 62095 | 8 | 6 | `toggleBikeFilter` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62098 | 62205 | 62203 | 108 | 106 | `applyPedFilters` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 62206 | 62209 | 62273 | 4 | 68 | `renderPedLocationTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62210 | 62210 | 62210 | 1 | 1 | `filteredLocationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62211 | 62240 | 62211 | 30 | 1 | `pinnedLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62241 | 62275 | 62241 | 35 | 1 | `isSelected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62276 | 62282 | 62296 | 7 | 21 | `togglePedSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62283 | 62298 | 62283 | 16 | 1 | `locData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62299 | 62313 | 62311 | 15 | 13 | `toggleAllPedSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62314 | 62320 | 62318 | 7 | 5 | `clearPedSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62321 | 62323 | 62331 | 3 | 11 | `updatePedSelectionUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62324 | 62342 | 62324 | 19 | 1 | `isSelected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62343 | 62406 | 62474 | 64 | 132 | `_fetchPedBikeDetailAggregates` | async fn | — | refs:2 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 62407 | 62475 | 62407 | 69 | 1 | `selectedSet` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62476 | 62483 | 62827 | 8 | 352 | `updatePedDetailPanel` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62484 | 62506 | 62484 | 23 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62507 | 62612 | 62507 | 106 | 1 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62613 | 62625 | 62613 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62626 | 62626 | 62626 | 1 | 1 | `countyAlcohol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62627 | 62627 | 62627 | 1 | 1 | `countySpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62628 | 62628 | 62628 | 1 | 1 | `countyDistracted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62629 | 62629 | 62629 | 1 | 1 | `countyDrowsy` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62630 | 62630 | 62630 | 1 | 1 | `countyDrug` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62631 | 62633 | 62631 | 3 | 1 | `countyHitrun` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62634 | 62651 | 62649 | 18 | 16 | `renderPedFactorRow` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62652 | 62652 | 62652 | 1 | 1 | `darkCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62653 | 62829 | 62653 | 177 | 1 | `adverseWeatherCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62830 | 62854 | 62972 | 25 | 143 | `initPedDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62855 | 62880 | 62855 | 26 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62881 | 62888 | 62884 | 8 | 4 | `cleanLabel` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 62889 | 62916 | 62889 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62917 | 62930 | 62917 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62931 | 62944 | 62931 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 62945 | 62958 | 62945 | 14 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 62959 | 62974 | 62959 | 16 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 62975 | 62979 | 63017 | 5 | 43 | `renderPedMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62980 | 63019 | 62980 | 40 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63020 | 63031 | 63029 | 12 | 10 | `resetPedFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63032 | 63064 | 63059 | 33 | 28 | `updatePedLocationTypeChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63065 | 63167 | 63166 | 103 | 102 | `applyBikeFilters` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 63168 | 63171 | 63235 | 4 | 68 | `renderBikeLocationTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63172 | 63172 | 63172 | 1 | 1 | `filteredLocationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63173 | 63202 | 63173 | 30 | 1 | `pinnedLocations` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63203 | 63236 | 63203 | 34 | 1 | `isSelected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63237 | 63242 | 63256 | 6 | 20 | `toggleBikeSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63243 | 63257 | 63243 | 15 | 1 | `locData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63258 | 63271 | 63270 | 14 | 13 | `toggleAllBikeSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63272 | 63277 | 63276 | 6 | 5 | `clearBikeSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63278 | 63280 | 63288 | 3 | 11 | `updateBikeSelectionUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 63281 | 63293 | 63281 | 13 | 1 | `isSelected` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63294 | 63301 | 63639 | 8 | 346 | `updateBikeDetailPanel` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 63302 | 63321 | 63302 | 20 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63322 | 63424 | 63322 | 103 | 1 | `agg` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63425 | 63437 | 63425 | 13 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63438 | 63438 | 63438 | 1 | 1 | `countyAlcohol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63439 | 63439 | 63439 | 1 | 1 | `countySpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63440 | 63440 | 63440 | 1 | 1 | `countyDistracted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63441 | 63441 | 63441 | 1 | 1 | `countyDrowsy` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63442 | 63442 | 63442 | 1 | 1 | `countyDrug` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63443 | 63445 | 63443 | 3 | 1 | `countyHitrun` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63446 | 63463 | 63461 | 18 | 16 | `renderBikeFactorRow` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 63464 | 63464 | 63464 | 1 | 1 | `darkCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63465 | 63641 | 63465 | 177 | 1 | `adverseWeatherCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63642 | 63648 | 63784 | 7 | 143 | `initBikeDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63649 | 63672 | 63652 | 24 | 4 | `cleanLabel` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 63673 | 63700 | 63673 | 28 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63701 | 63728 | 63701 | 28 | 1 | `collisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63729 | 63742 | 63729 | 14 | 1 | `control` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63743 | 63756 | 63743 | 14 | 1 | `weather` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63757 | 63770 | 63757 | 14 | 1 | `light` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 63771 | 63786 | 63771 | 16 | 1 | `surface` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63787 | 63791 | 63829 | 5 | 43 | `renderBikeMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63792 | 63830 | 63792 | 39 | 1 | `sortedYears` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63831 | 63846 | 63841 | 16 | 11 | `resetBikeFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63847 | 63853 | 63852 | 7 | 6 | `setPedViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63854 | 63857 | 63899 | 4 | 46 | `exportPedDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63858 | 63896 | 63858 | 39 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63897 | 63900 | 63897 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 63901 | 63929 | 64211 | 29 | 311 | `exportPedDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63930 | 63952 | 63930 | 23 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63953 | 63956 | 63953 | 4 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 63957 | 63975 | 63974 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 63976 | 64153 | 63987 | 178 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 64154 | 64212 | 64163 | 59 | 10 | `compData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64213 | 64216 | 64224 | 4 | 12 | `exportPedDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64217 | 64220 | 64217 | 4 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64221 | 64225 | 64221 | 5 | 1 | `description` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64226 | 64249 | 64252 | 24 | 27 | `exportPedLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64250 | 64253 | 64250 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 64254 | 64277 | 64475 | 24 | 222 | `exportPedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64278 | 64400 | 64295 | 123 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 64401 | 64480 | 64414 | 80 | 14 | `tableBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64481 | 64487 | 64486 | 7 | 6 | `setBikeViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64488 | 64491 | 64533 | 4 | 46 | `exportBikeDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64492 | 64530 | 64492 | 39 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64531 | 64534 | 64531 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 64535 | 64563 | 64845 | 29 | 311 | `exportBikeDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64564 | 64586 | 64564 | 23 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64587 | 64590 | 64587 | 4 | 1 | `locationNames` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64591 | 64609 | 64608 | 19 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 64610 | 64787 | 64621 | 178 | 12 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 64788 | 64846 | 64797 | 59 | 10 | `compData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64847 | 64850 | 64858 | 4 | 12 | `exportBikeDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64851 | 64854 | 64851 | 4 | 1 | `allCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64855 | 64859 | 64855 | 5 | 1 | `description` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 64860 | 64883 | 64886 | 24 | 27 | `exportBikeLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64884 | 64887 | 64884 | 4 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 64888 | 64911 | 65109 | 24 | 222 | `exportBikeLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64912 | 65034 | 64929 | 123 | 18 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 65035 | 65110 | 65048 | 76 | 14 | `tableBody` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65111 | 65140 | 65138 | 30 | 28 | `updateBikeLocationTypeChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65141 | 65141 | 65141 | 1 | 1 | `updatePedLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65142 | 65142 | 65142 | 1 | 1 | `updateBikeLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65143 | 65143 | 65143 | 1 | 1 | `clearPedDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65144 | 65146 | 65144 | 3 | 1 | `clearBikeDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65147 | 65157 | 65156 | 11 | 10 | `jumpToCMFFromPedBike` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 65158 | 65191 | 65190 | 34 | 33 | `zoomToPedBikeLocation` | fn | — | refs:4 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 65192 | 65250 | 65249 | 59 | 58 | `filterMapForPedBike` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 65251 | 65284 | 65345 | 34 | 95 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65285 | 65363 | 65285 | 79 | 1 | `collisionsSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65364 | 65416 | 65836 | 53 | 473 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65417 | 65423 | 65417 | 7 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 65424 | 65447 | 65424 | 24 | 1 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 65448 | 65497 | 65451 | 50 | 4 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 65498 | 65498 | 65498 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65499 | 65499 | 65499 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65500 | 65532 | 65500 | 33 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65533 | 65560 | 65537 | 28 | 5 | `yearData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65561 | 65562 | 65571 | 2 | 11 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 65563 | 65626 | 65563 | 64 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 65627 | 65633 | 65633 | 7 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65634 | 65639 | 65639 | 6 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65640 | 65675 | 65654 | 36 | 15 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65676 | 65737 | 65676 | 62 | 1 | `pedLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65738 | 65844 | 65738 | 107 | 1 | `bikeLightTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 65845 | 65848 | 65964 | 4 | 120 | `renderPedBikeLocationsFromMatview` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 65849 | 65852 | 65849 | 4 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 65853 | 65877 | 65876 | 25 | 24 | `_hydrate` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 65878 | 65971 | 65922 | 94 | 45 | `_paintLocTypePie` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65972 | 65977 | 66020 | 6 | 49 | `renderPedBikeComparisonTableFromCats` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 65978 | 66021 | 65978 | 44 | 1 | `_calcEpdo` | const arrow | — | refs:6 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 66022 | 66116 | 66230 | 95 | 209 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 66117 | 66135 | 66117 | 19 | 1 | `totalPeople` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66136 | 66136 | 66136 | 1 | 1 | `typeColors` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66137 | 66137 | 66137 | 1 | 1 | `typeLabels` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66138 | 66191 | 66138 | 54 | 1 | `typeData` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 66192 | 66192 | 66211 | 1 | 20 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66193 | 66233 | 66193 | 41 | 1 | `total` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66234 | 66271 | 66270 | 38 | 37 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66272 | 66284 | 66359 | 13 | 88 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 66285 | 66367 | 66288 | 83 | 4 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66368 | 66374 | 66373 | 7 | 6 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66375 | 66454 | 66453 | 80 | 79 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66455 | 66461 | 66460 | 7 | 6 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66462 | 66470 | 66500 | 9 | 39 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66471 | 66501 | 66471 | 31 | 1 | `crashes` | const arrow | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66502 | 66551 | 66550 | 50 | 49 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66552 | 66569 | 66568 | 18 | 17 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66570 | 66621 | 66597 | 52 | 28 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66622 | 66629 | 66629 | 8 | 8 | `_analysisReadFilters` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66630 | 66632 | 66632 | 3 | 3 | `_analysisCanUseSupabase` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 66633 | 66641 | 66640 | 9 | 8 | `_analysisResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 66642 | 66651 | 66687 | 10 | 46 | `analysisQuickLocationFilter` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66652 | 66688 | 66655 | 37 | 4 | `matches` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 66689 | 66716 | 66715 | 28 | 27 | `analysisSelectLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 66717 | 66724 | 66723 | 8 | 7 | `analysisSelectTopQuickLocation` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66725 | 66749 | 66748 | 25 | 24 | `analysisGoToCountermeasures` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66750 | 66784 | 66783 | 35 | 34 | `analysisSearchCrashes` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 66785 | 66806 | 66805 | 22 | 21 | `_analysisFetchPage` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 66807 | 66814 | 66813 | 8 | 7 | `analysisClearSearch` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66815 | 66846 | 66845 | 32 | 31 | `analysisRenderSearchResults` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 66847 | 66863 | 66862 | 17 | 16 | `analysisRenderSearchPagination` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 66864 | 66872 | 66871 | 9 | 8 | `analysisGoSearchPage` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 66873 | 66890 | 66894 | 18 | 22 | `analysisExportSearchCSV` | async fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66891 | 66891 | 66891 | 1 | 1 | `rows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 66892 | 66896 | 66892 | 5 | 1 | `csv` | const arrow | — | refs:604 | Unassigned | `app/modules/app/unassigned.js` |
| 66897 | 66924 | 66905 | 28 | 9 | `initAnalysisSearch` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 66925 | 66947 | 66946 | 23 | 22 | `showReportSubTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66948 | 67053 | 67041 | 106 | 94 | `updateReportOptions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67054 | 67116 | 67105 | 63 | 52 | `buildAIContext` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67117 | 67146 | 67130 | 30 | 14 | `_safeAgg` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67147 | 67157 | 67213 | 11 | 67 | `hydrateReportFromMatviews` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 67158 | 67162 | 67158 | 5 | 1 | `baseParams` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67163 | 67215 | 67170 | 53 | 8 | `fetchJson` | async const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 67216 | 67284 | 67283 | 69 | 68 | `fetchReportDataForType` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67285 | 67521 | 67520 | 237 | 236 | `generateReport` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 67522 | 67526 | 67525 | 5 | 4 | `generateSystemwideReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67527 | 67621 | 67617 | 95 | 91 | `_legacySystemwideReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 67622 | 67709 | 67705 | 88 | 84 | `computeSystemwideCategoryData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67710 | 67785 | 67781 | 76 | 72 | `generateExplorationDashboard` | fn | — | refs:2 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 67786 | 67788 | 67791 | 3 | 6 | `getTopLocation` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 67789 | 67795 | 67789 | 7 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 67796 | 67805 | 67801 | 10 | 6 | `truncateRoute` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 67806 | 67809 | 67856 | 4 | 51 | `generateCategoryTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67810 | 67860 | 67840 | 51 | 31 | `buildTopTable` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67861 | 67938 | 67934 | 78 | 74 | `generateEnhancedFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67939 | 68027 | 68026 | 89 | 88 | `generateEnhancedRecommendations` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68028 | 68075 | 68093 | 48 | 66 | `generateCorridorReport` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68076 | 68076 | 68076 | 1 | 1 | `weatherRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68077 | 68094 | 68077 | 18 | 1 | `lightRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68095 | 68129 | 68177 | 35 | 83 | `generateSafetyReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68130 | 68142 | 68130 | 13 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68143 | 68145 | 68143 | 3 | 1 | `topSevereType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68146 | 68159 | 68146 | 14 | 1 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68160 | 68160 | 68160 | 1 | 1 | `kaByTypeRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68161 | 68178 | 68161 | 18 | 1 | `kaByLightRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68179 | 68179 | 68343 | 1 | 165 | `generatePedBikeReport` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 68180 | 68180 | 68180 | 1 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68181 | 68231 | 68181 | 51 | 1 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68232 | 68232 | 68232 | 1 | 1 | `pedDark` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68233 | 68299 | 68233 | 67 | 1 | `bikeDark` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68300 | 68300 | 68300 | 1 | 1 | `vruSpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68301 | 68301 | 68301 | 1 | 1 | `vruAlcohol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68302 | 68302 | 68302 | 1 | 1 | `vruDistracted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68303 | 68303 | 68303 | 1 | 1 | `vruSenior` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68304 | 68344 | 68304 | 41 | 1 | `vruYoung` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68345 | 68375 | 68393 | 31 | 49 | `createEnhancedPedBikeCharts` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 68376 | 68387 | 68376 | 12 | 1 | `pedLightSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68388 | 68394 | 68388 | 7 | 1 | `bikeLightSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68395 | 68485 | 68504 | 91 | 110 | `generateTrendReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68486 | 68514 | 68489 | 29 | 4 | `trendRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68515 | 68528 | 68523 | 14 | 9 | `generateReportId` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 68529 | 68546 | 68542 | 18 | 14 | `getFullTimestamp` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68547 | 68553 | 68549 | 7 | 3 | `getShortTimestamp` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 68554 | 68583 | 68598 | 30 | 45 | `buildExecutiveSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68584 | 68602 | 68584 | 19 | 1 | `topType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68603 | 68628 | 68624 | 26 | 22 | `updateReportFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68629 | 68656 | 68652 | 28 | 24 | `showTableOfContents` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68657 | 68782 | 68778 | 126 | 122 | `getDefaultTOCSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68783 | 68793 | 68791 | 11 | 9 | `showExecutiveSummary` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68794 | 68840 | 68836 | 47 | 43 | `computeStats` | fn | — | refs:40 | Unassigned | `app/modules/app/unassigned.js` |
| 68841 | 68863 | 68862 | 23 | 22 | `validateReportData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 68864 | 68864 | 68870 | 1 | 7 | `getDateRange` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 68865 | 68893 | 68865 | 29 | 1 | `dates` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68894 | 68894 | 68923 | 1 | 30 | `resolveReportPeriod` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 68895 | 68899 | 68899 | 5 | 5 | `fmt` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 68900 | 68924 | 68905 | 25 | 6 | `parseLocal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68925 | 68936 | 68943 | 12 | 19 | `generateFindings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 68937 | 68945 | 68937 | 9 | 1 | `topType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 68946 | 69155 | 69153 | 210 | 208 | `generateSafetyFocusReport` | fn | — | refs:1 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 69156 | 69220 | 69219 | 65 | 64 | `generateSafetyFocusRecommendations` | fn | — | refs:2 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 69221 | 69241 | 69240 | 21 | 20 | `generateYearlySection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69242 | 69253 | 69259 | 12 | 18 | `generateTopLocationsTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69254 | 69260 | 69254 | 7 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69261 | 69272 | 69278 | 12 | 18 | `generateNodeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69273 | 69279 | 69273 | 7 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69280 | 69288 | 69287 | 9 | 8 | `generateRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69289 | 69292 | 69297 | 4 | 9 | `generateSafetyRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69293 | 69298 | 69293 | 6 | 1 | `darkPct` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69299 | 69329 | 69328 | 31 | 30 | `generatePedBikeRecommendations` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 69330 | 69341 | 69340 | 12 | 11 | `generatePedBikeYearlySection` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 69342 | 69347 | 69357 | 6 | 16 | `generatePedBikeLocationTable` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 69348 | 69348 | 69348 | 1 | 1 | `pedTop` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69349 | 69359 | 69349 | 11 | 1 | `bikeTop` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69360 | 69362 | 69373 | 3 | 14 | `createReportCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69363 | 69374 | 69363 | 12 | 1 | `typeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69375 | 69383 | 69395 | 9 | 21 | `createSafetyCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69384 | 69389 | 69384 | 6 | 1 | `typeSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69390 | 69396 | 69390 | 7 | 1 | `lightSorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69397 | 69401 | 69411 | 5 | 15 | `createPedBikeCharts` | fn | — | refs:0 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 69402 | 69412 | 69402 | 11 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 69413 | 69427 | 69426 | 15 | 14 | `createTrendCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69428 | 69435 | 69428 | 8 | 1 | `printReport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 69436 | 69454 | 69449 | 19 | 14 | `storeReportData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 69455 | 69510 | 69506 | 56 | 52 | `downloadReportPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69511 | 69546 | 69511 | 36 | 1 | `generateStandardReportPDF` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 69547 | 69556 | 69554 | 10 | 8 | `hexToRgb` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 69557 | 69575 | 69568 | 19 | 12 | `cleanText` | const arrow | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 69576 | 69580 | 69580 | 5 | 5 | `fmtRptDate` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69581 | 69617 | 69586 | 37 | 6 | `parseRptLocal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69618 | 69648 | 69646 | 31 | 29 | `drawHeader` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69649 | 69668 | 69666 | 20 | 18 | `drawFooter` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 69669 | 69679 | 69677 | 11 | 9 | `newPage` | const arrow | — | refs:42 | Unassigned | `app/modules/app/unassigned.js` |
| 69680 | 69688 | 69686 | 9 | 7 | `checkPageBreak` | const arrow | — | refs:39 | Unassigned | `app/modules/app/unassigned.js` |
| 69689 | 69709 | 69707 | 21 | 19 | `addText` | const arrow | — | refs:168 | Unassigned | `app/modules/app/unassigned.js` |
| 69710 | 69724 | 69722 | 15 | 13 | `addSectionTitle` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 69725 | 69735 | 69733 | 11 | 9 | `addSubsectionTitle` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 69736 | 69786 | 69784 | 51 | 49 | `drawSeverityBar` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 69787 | 69803 | 69801 | 17 | 15 | `drawKPICard` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 69804 | 70158 | 69804 | 355 | 1 | `addSpacer` | const arrow | — | refs:109 | Unassigned | `app/modules/app/unassigned.js` |
| 70159 | 70159 | 70159 | 1 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70160 | 70211 | 70160 | 52 | 1 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70212 | 70238 | 70212 | 27 | 1 | `facilityRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70239 | 70256 | 70239 | 18 | 1 | `comboRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70257 | 70259 | 70257 | 3 | 1 | `fatalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70260 | 70277 | 70260 | 18 | 1 | `fatalCollRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70278 | 70282 | 70278 | 5 | 1 | `speedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70283 | 70292 | 70283 | 10 | 1 | `speedSevRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70293 | 70331 | 70293 | 39 | 1 | `fatalSpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70332 | 70336 | 70332 | 5 | 1 | `topLocs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70337 | 70356 | 70337 | 20 | 1 | `topCol` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70357 | 70388 | 70357 | 32 | 1 | `nodeRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70389 | 70422 | 70394 | 34 | 6 | `compRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70423 | 70493 | 70423 | 71 | 1 | `costRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70494 | 70505 | 70497 | 12 | 4 | `copyReportText` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70506 | 70614 | 70722 | 109 | 217 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70615 | 70723 | 70615 | 109 | 1 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 70724 | 70740 | 70739 | 17 | 16 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70741 | 70757 | 70789 | 17 | 49 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70758 | 70778 | 70758 | 21 | 1 | `sortedDays` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70779 | 70790 | 70783 | 12 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 70791 | 70835 | 70834 | 45 | 44 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70836 | 70854 | 70853 | 19 | 18 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70855 | 70885 | 70899 | 31 | 45 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70886 | 70900 | 70889 | 15 | 4 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 70901 | 70937 | 70936 | 37 | 36 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70938 | 70955 | 70963 | 18 | 26 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70956 | 70964 | 70956 | 9 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70965 | 70980 | 71000 | 16 | 36 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70981 | 70987 | 70981 | 7 | 1 | `dayName` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 70988 | 71001 | 70988 | 14 | 1 | `cellVal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71002 | 71039 | 71095 | 38 | 94 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71040 | 71096 | 71040 | 57 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71097 | 71147 | 71304 | 51 | 208 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71148 | 71148 | 71148 | 1 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71149 | 71185 | 71149 | 37 | 1 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71186 | 71217 | 71191 | 32 | 6 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71218 | 71305 | 71218 | 88 | 1 | `maxTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71306 | 71339 | 71386 | 34 | 81 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71340 | 71387 | 71344 | 48 | 5 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71388 | 71397 | 71396 | 10 | 9 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71398 | 71408 | 71407 | 11 | 10 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71409 | 71453 | 71452 | 45 | 44 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71454 | 71511 | 71500 | 58 | 47 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71512 | 71523 | 71678 | 12 | 167 | `generateComprehensiveReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71524 | 71679 | 71527 | 156 | 4 | `updateProgress` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 71680 | 71693 | 71692 | 14 | 13 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71694 | 71711 | 71710 | 18 | 17 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71712 | 71736 | 71735 | 25 | 24 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 71737 | 71737 | 71753 | 1 | 17 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71738 | 71754 | 71738 | 17 | 1 | `hours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 71755 | 71768 | 71767 | 14 | 13 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71769 | 71782 | 71781 | 14 | 13 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71783 | 71833 | 71831 | 51 | 49 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 71834 | 71874 | 71872 | 41 | 39 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71875 | 71941 | 71978 | 67 | 104 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71942 | 71944 | 71942 | 3 | 1 | `calcChange` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 71945 | 71951 | 71949 | 7 | 5 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71952 | 71980 | 71958 | 29 | 7 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71981 | 72002 | 72012 | 22 | 32 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72003 | 72014 | 72005 | 12 | 3 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72015 | 72030 | 72028 | 16 | 14 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 72031 | 72037 | 72035 | 7 | 5 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72038 | 72050 | 72048 | 13 | 11 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 72051 | 72053 | 72063 | 3 | 13 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72054 | 72064 | 72057 | 11 | 4 | `withLocation` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72065 | 72066 | 72076 | 2 | 12 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72067 | 72072 | 72067 | 6 | 1 | `locCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72073 | 72077 | 72073 | 5 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72078 | 72129 | 72128 | 52 | 51 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 72130 | 72155 | 72663 | 26 | 534 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72156 | 72171 | 72169 | 16 | 14 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72172 | 72179 | 72177 | 8 | 6 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72180 | 72186 | 72184 | 7 | 5 | `formatHour` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 72187 | 72196 | 72194 | 10 | 8 | `getHeatColor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72197 | 72234 | 72232 | 38 | 36 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72235 | 72235 | 72258 | 1 | 24 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72236 | 72260 | 72236 | 25 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72261 | 72261 | 72306 | 1 | 46 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72262 | 72314 | 72262 | 53 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72315 | 72664 | 72320 | 350 | 6 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 72665 | 72674 | 72673 | 10 | 9 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72675 | 72697 | 73232 | 23 | 558 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72698 | 72714 | 72713 | 17 | 16 | `addText` | const arrow | — | refs:168 | Unassigned | `app/modules/app/unassigned.js` |
| 72715 | 72715 | 72715 | 1 | 1 | `addSpacer` | const arrow | — | refs:109 | Unassigned | `app/modules/app/unassigned.js` |
| 72716 | 72718 | 72716 | 3 | 1 | `newPage` | const arrow | — | refs:42 | Unassigned | `app/modules/app/unassigned.js` |
| 72719 | 72753 | 72745 | 35 | 27 | `addPageFooter` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72754 | 72756 | 72754 | 3 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72757 | 72765 | 72763 | 9 | 7 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72766 | 72952 | 72776 | 187 | 11 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72953 | 72961 | 72953 | 9 | 1 | `maxDayCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 72962 | 73013 | 72962 | 52 | 1 | `peakHours` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73014 | 73056 | 73014 | 43 | 1 | `maxEpdo` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73057 | 73112 | 73057 | 56 | 1 | `maxFactorCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73113 | 73196 | 73113 | 84 | 1 | `maxMonthCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73197 | 73233 | 73197 | 37 | 1 | `locCoverage` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73234 | 73242 | 73241 | 9 | 8 | `hexToRgb` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 73243 | 73256 | 73564 | 14 | 322 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73257 | 73566 | 73257 | 310 | 1 | `fmtHour` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73567 | 73681 | 73676 | 115 | 110 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73682 | 73744 | 73917 | 63 | 236 | `generateCountermeasuresReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73745 | 73814 | 73745 | 70 | 1 | `topTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73815 | 73830 | 73815 | 16 | 1 | `matches` | const arrow | — | refs:156 | Unassigned | `app/modules/app/unassigned.js` |
| 73831 | 73837 | 73835 | 7 | 5 | `topCMFs` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73838 | 73838 | 73838 | 1 | 1 | `provenCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73839 | 73918 | 73839 | 80 | 1 | `hsmCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 73919 | 73922 | 73921 | 4 | 3 | `generateIntersectionReport` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 73923 | 73948 | 73939 | 26 | 17 | `generateHotspotReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 73949 | 73974 | 74103 | 26 | 155 | `generateDashboardReport` | fn | — | refs:2 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 73975 | 73975 | 73975 | 1 | 1 | `nightCount` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 73976 | 74004 | 73976 | 29 | 1 | `speedCount` | const arrow | — | refs:82 | Unassigned | `app/modules/app/unassigned.js` |
| 74005 | 74042 | 74011 | 38 | 7 | `sevRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74043 | 74043 | 74043 | 1 | 1 | `years` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74044 | 74063 | 74050 | 20 | 7 | `yearRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74064 | 74108 | 74064 | 45 | 1 | `intCount` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74109 | 74145 | 74243 | 37 | 135 | `generateCrashTreeSystemicReport` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 74146 | 74167 | 74149 | 22 | 4 | `facilityRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74168 | 74181 | 74171 | 14 | 4 | `collisionRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74182 | 74182 | 74182 | 1 | 1 | `topFacilities` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74183 | 74192 | 74183 | 10 | 1 | `topCollisions` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74193 | 74193 | 74193 | 1 | 1 | `matrixHeader` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74194 | 74194 | 74201 | 1 | 8 | `matrixRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74195 | 74220 | 74199 | 26 | 5 | `cells` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74221 | 74221 | 74221 | 1 | 1 | `topCombos` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74222 | 74248 | 74224 | 27 | 3 | `comboRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74249 | 74259 | 74499 | 11 | 251 | `generateFatalSpeedReport` | async fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 74260 | 74260 | 74260 | 1 | 1 | `fatalCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74261 | 74261 | 74261 | 1 | 1 | `speedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74262 | 74384 | 74262 | 123 | 1 | `fatalSpeed` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74385 | 74504 | 74385 | 120 | 1 | `topFatalRoutes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74505 | 74542 | 74602 | 38 | 98 | `generateHotspotRankingReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 74543 | 74543 | 74543 | 1 | 1 | `routeRanking` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74544 | 74544 | 74544 | 1 | 1 | `nodeRanking` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74545 | 74556 | 74545 | 12 | 1 | `combined` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74557 | 74570 | 74560 | 14 | 4 | `rankRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74571 | 74583 | 74573 | 13 | 3 | `routeRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74584 | 74584 | 74584 | 1 | 1 | `routeTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74585 | 74608 | 74585 | 24 | 1 | `nodeTotal` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74609 | 74613 | 74739 | 5 | 131 | `generateBeforeAfterStudyReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74614 | 74618 | 74618 | 5 | 5 | `fmtBA` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74619 | 74692 | 74628 | 74 | 10 | `parseBALocal` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 74693 | 74744 | 74699 | 52 | 7 | `compRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74745 | 74798 | 74847 | 54 | 103 | `generateGrantSupportReport` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 74799 | 74869 | 74802 | 71 | 4 | `locRows` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 74870 | 74918 | 74914 | 49 | 45 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74919 | 74971 | 74967 | 53 | 49 | `buildMemoHeader` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74972 | 75028 | 75024 | 57 | 53 | `buildMemoStatsTable` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 75029 | 75041 | 75037 | 13 | 9 | `buildMemoFindings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75042 | 75110 | 75106 | 69 | 65 | `buildMemoLocationsTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75111 | 75144 | 75140 | 34 | 30 | `buildMemoFooter` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75145 | 75208 | 75204 | 64 | 60 | `createWordDocumentWithHeaderFooter` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75209 | 75289 | 75285 | 81 | 77 | `generateSystemwideWordMemo` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75290 | 75390 | 75386 | 101 | 97 | `generateCorridorWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75391 | 75408 | 75483 | 18 | 93 | `generateSafetyWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75409 | 75487 | 75409 | 79 | 1 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75488 | 75494 | 75573 | 7 | 86 | `generatePedBikeWordMemo` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 75495 | 75495 | 75495 | 1 | 1 | `pedCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75496 | 75577 | 75496 | 82 | 1 | `bikeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75578 | 75702 | 75698 | 125 | 121 | `generateTrendWordMemo` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75703 | 75711 | 75720 | 9 | 18 | `buildCollisionTypeBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75712 | 75724 | 75712 | 13 | 1 | `sorted` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75725 | 75729 | 75759 | 5 | 35 | `buildSevereCrashPatterns` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75730 | 75745 | 75730 | 16 | 1 | `topTypes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75746 | 75763 | 75746 | 18 | 1 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75764 | 75811 | 75807 | 48 | 44 | `generateMemoRecommendations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75812 | 75816 | 75860 | 5 | 49 | `generateSafetyMemoRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75817 | 75843 | 75817 | 27 | 1 | `topType` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75844 | 75864 | 75844 | 21 | 1 | `darkCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75865 | 75906 | 75902 | 42 | 38 | `generateVRURecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75907 | 75942 | 75951 | 36 | 45 | `generateTrendAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 75943 | 75974 | 75943 | 32 | 1 | `peakYear` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 75975 | 75996 | 75994 | 22 | 20 | `switchBAMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75997 | 76003 | 76001 | 7 | 5 | `setBatchBAAnalysisType` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 76004 | 76014 | 76012 | 11 | 9 | `initBALocationDropdown` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 76015 | 76063 | 76060 | 49 | 46 | `updateBALocationDropdown` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76064 | 76129 | 76127 | 66 | 64 | `filterBALocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76130 | 76137 | 76135 | 8 | 6 | `handleBASearchKeypress` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76138 | 76155 | 76178 | 18 | 41 | `triggerBASearch` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76156 | 76163 | 76156 | 8 | 1 | `matchingRoute` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76164 | 76180 | 76166 | 17 | 3 | `matchingNode` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 76181 | 76212 | 76210 | 32 | 30 | `selectBASearchResult` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76213 | 76260 | 76258 | 48 | 46 | `loadBALocation` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76261 | 76267 | 76265 | 7 | 5 | `getMatchedCrashesFromMapSelection` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76268 | 76279 | 76277 | 12 | 10 | `computeStatsFromMapPoints` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76280 | 76324 | 76322 | 45 | 43 | `updateBALocationSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76325 | 76360 | 76359 | 36 | 35 | `selectBALocationFromMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76361 | 76365 | 76364 | 5 | 4 | `closeBAMapModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76366 | 76373 | 76371 | 8 | 6 | `goToMapForBASelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76374 | 76400 | 76398 | 27 | 25 | `useMapSelectionForBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76401 | 76413 | 76411 | 13 | 11 | `setBAStudyPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76414 | 76453 | 76451 | 40 | 38 | `calculateBAPeriods` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76454 | 76473 | 76471 | 20 | 18 | `updateBAPeriodDisplay` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 76474 | 76499 | 76497 | 26 | 24 | `updateBAMethodInfo` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76500 | 76538 | 76536 | 39 | 37 | `resetBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76539 | 76644 | 76642 | 106 | 104 | `runBeforeAfterAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76645 | 76654 | 76652 | 10 | 8 | `filterCrashesByPeriod` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 76655 | 76665 | 76663 | 11 | 9 | `normalCDF` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76666 | 76697 | 76695 | 32 | 30 | `displayBAResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76698 | 76740 | 76738 | 43 | 41 | `displayBAKPIComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76741 | 76790 | 76788 | 50 | 48 | `displayBAStatisticalResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76791 | 76871 | 76869 | 81 | 79 | `createBACharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76872 | 76899 | 76897 | 28 | 26 | `calculateMonthlyTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76900 | 76986 | 76984 | 87 | 85 | `displayBADetailedTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76987 | 77035 | 77033 | 49 | 47 | `displayBAFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77036 | 77066 | 77064 | 31 | 29 | `displayBAConclusions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77067 | 77071 | 77069 | 5 | 3 | `printBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77072 | 77162 | 77427 | 91 | 356 | `downloadBAPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77163 | 77429 | 77186 | 267 | 24 | `drawKPI` | fn | — | refs:80 | Unassigned | `app/modules/app/unassigned.js` |
| 77430 | 77465 | 77463 | 36 | 34 | `exportBAData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77466 | 77511 | 77506 | 46 | 41 | `copyBAReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77512 | 77540 | 77538 | 29 | 27 | `openBAEmailSchedule` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77541 | 77675 | 77673 | 135 | 133 | `generateBAPDFForEmail` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77676 | 77695 | 77878 | 20 | 203 | `testBAEmailNotification` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77696 | 77723 | 77698 | 28 | 3 | `resetTestBtn` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 77724 | 77880 | 77819 | 157 | 96 | `buildBAEmailHtml` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77881 | 77895 | 77893 | 15 | 13 | `updateBADeliveryModeUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77896 | 77904 | 77902 | 9 | 7 | `updateBAFrequencyUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77905 | 77938 | 77933 | 34 | 29 | `calculateBANextDelivery` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 77939 | 77960 | 77998 | 22 | 60 | `initBAMonitoringPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77961 | 77982 | 77961 | 22 | 1 | `el` | const arrow | — | refs:352 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 77983 | 77999 | 77983 | 17 | 1 | `el` | const arrow | — | refs:352 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78000 | 78019 | 78018 | 20 | 19 | `toggleBAMonitoringEnabled` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78020 | 78033 | 78032 | 14 | 13 | `updateBAMonitoringLocationDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78034 | 78040 | 78039 | 7 | 6 | `updateBAAlertRowStyle` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 78041 | 78045 | 78044 | 5 | 4 | `toggleBAMonitorScheduleUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78046 | 78053 | 78052 | 8 | 7 | `updateBAMonitorFreqUI` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78054 | 78054 | 78117 | 1 | 64 | `saveBAMonitoringSettings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78055 | 78118 | 78055 | 64 | 1 | `el` | const arrow | — | refs:352 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78119 | 78134 | 78217 | 16 | 99 | `evaluateBAAlertConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78135 | 78158 | 78138 | 24 | 4 | `recentCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78159 | 78218 | 78163 | 60 | 5 | `severeCrashes` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78219 | 78295 | 78294 | 77 | 76 | `buildBAAlertEmailHtml` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78296 | 78323 | 78397 | 28 | 102 | `sendBAMonitoringTestAlert` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78324 | 78398 | 78324 | 75 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78399 | 78428 | 78427 | 30 | 29 | `renderBAMonitoringStatus` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78429 | 78454 | 78519 | 26 | 91 | `checkBAMonitoringOnDataLoad` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78455 | 78456 | 78455 | 2 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78457 | 78520 | 78457 | 64 | 1 | `plainText` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78521 | 78530 | 78543 | 10 | 23 | `addBAMonitorSubscriber` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78531 | 78544 | 78531 | 14 | 1 | `existing` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78545 | 78551 | 78550 | 7 | 6 | `removeBAMonitorSubscriber` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78552 | 78579 | 78573 | 28 | 22 | `refreshBAMonitorSubscriberChips` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78580 | 78600 | 78652 | 21 | 73 | `syncBAMonitoringToServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78601 | 78637 | 78601 | 37 | 1 | `recipients` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78638 | 78656 | 78638 | 19 | 1 | `result` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 78657 | 78681 | 78677 | 25 | 21 | `deleteBAMonitoringFromServer` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78682 | 78691 | 78690 | 10 | 9 | `saveSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78692 | 78715 | 78714 | 24 | 23 | `loadSession` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78716 | 78733 | 78722 | 18 | 7 | `downloadFile` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 78734 | 78765 | 78764 | 32 | 31 | `loadSavedKey` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78766 | 78801 | 78800 | 36 | 35 | `handleAIFileSelect` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78802 | 78812 | 78811 | 11 | 10 | `renderAttachments` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 78813 | 78817 | 78816 | 5 | 4 | `removeAttachment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78818 | 78822 | 78821 | 5 | 4 | `askSuggestion` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 78823 | 78882 | 78881 | 60 | 59 | `clearAIChat` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78883 | 78887 | 78886 | 5 | 4 | `clearApiKey` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 78888 | 78926 | 78925 | 39 | 38 | `addMessage` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 78927 | 78939 | 78938 | 13 | 12 | `addTypingIndicator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78940 | 78944 | 78943 | 5 | 4 | `removeTypingIndicator` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 78945 | 79013 | 79005 | 69 | 61 | `buildCrashDataContext` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 79014 | 79022 | 79022 | 9 | 9 | `initMUTCDLocationDropdown` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79023 | 79038 | 79038 | 16 | 16 | `loadMUTCDLocation` | fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79039 | 79045 | 79043 | 7 | 5 | `clearMUTCDLocation` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79046 | 79065 | 79063 | 20 | 18 | `loadMUTCDIndex` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79066 | 79200 | 79187 | 135 | 122 | `buildMUTCDContext` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79201 | 79257 | 79276 | 57 | 76 | `queryPineconeRAG` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79258 | 79278 | 79267 | 21 | 10 | `results` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79279 | 79382 | 79303 | 104 | 25 | `buildPineconeRAGContext` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79383 | 79422 | 79545 | 40 | 163 | `buildProgrammaticCrashAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 79423 | 79473 | 79427 | 51 | 5 | `buildFactor` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 79474 | 79812 | 79474 | 339 | 1 | `peak` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js (new)` |
| 79813 | 79875 | 79865 | 63 | 53 | `runMUTCDAgent` | async fn | — | refs:2 | Warrants | `app/modules/warrants/warrants.js` |
| 79876 | 79887 | 80023 | 12 | 148 | `runMUTCDAIAnalysis` | async fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 79888 | 80028 | 79892 | 141 | 5 | `updateProgress` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
