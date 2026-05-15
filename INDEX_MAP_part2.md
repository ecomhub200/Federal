# index.html function inventory — PART 2 (L40001–80000)

Snapshot: 2026-05-15 · source `app/index.html` (159387 lines)

Declarations in this part: **1112**

> **End L is a heuristic** (next declaration start − 1). **Used by** = approximate whole-file substring fan-out (coarse risk signal). **Depends on** is filled only for deep-trace targets — see `MODULAR_PLAN.md` §5. Tab/module are prefix/line-band heuristics.

| Start L | End L | LOC | Name | Type | Depends on | Used by | Tab/feature | Proposed module |
|---|---|---|---|---|---|---|---|---|
| 40032 | 40037 | 6 | `goToGrantPage` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 40038 | 40066 | 29 | `updateTierLegend` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 40067 | 40079 | 13 | `toggleLocationSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40080 | 40088 | 9 | `toggleLocationCheckbox` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40089 | 40096 | 8 | `toggleSelectAll` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40097 | 40103 | 7 | `clearAllSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40104 | 40145 | 42 | `updateSelectionUI` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40146 | 40204 | 59 | `getCombinedSelectionStats` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 40205 | 40254 | 50 | `buildEnrichedGrantContext` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 40255 | 40294 | 40 | `totalCost` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 40295 | 40312 | 18 | `toggleSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 40313 | 40318 | 6 | `updateSelectionAnalysisPanels` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 40319 | 40321 | 3 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 40322 | 40323 | 2 | `localKARate` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 40324 | 40326 | 3 | `criticalRateFactor` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 40327 | 40369 | 43 | `annualCrashCost` | const arrow | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 40370 | 40384 | 15 | `updateAppBuilderFromSelection` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 40385 | 40392 | 8 | `bestMatch` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 40393 | 40400 | 8 | `analyzeLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40401 | 40416 | 16 | `populateLocationDropdowns` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40417 | 40431 | 15 | `loadCrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 40432 | 40446 | 15 | `saveCrashCosts` | fn | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 40447 | 40462 | 16 | `startApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 40463 | 40535 | 73 | `generateAppPreview` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 40536 | 40559 | 24 | `vru` | const arrow | — | refs:539 | Unassigned | `app/modules/app/unassigned.js` |
| 40560 | 40560 | 1 | `calculateBenefitCost` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 40561 | 40623 | 63 | `annualCrashCost` | const arrow | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 40624 | 40632 | 9 | `getStateCrashCosts` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 40633 | 40652 | 20 | `loadStateCrashCosts` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 40653 | 40656 | 4 | `loadVDOTCrashCosts` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 40657 | 40683 | 27 | `loadFHWACrashCosts` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 40684 | 40700 | 17 | `updateApiKeyHelper` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 40701 | 40814 | 114 | `generateFullApplicationContent` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 40815 | 41181 | 367 | `downloadFullApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41182 | 41354 | 173 | `totalCrashCost` | const arrow | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 41355 | 41415 | 61 | `downloadFullApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 41416 | 41918 | 503 | `totalCrashCost` | const arrow | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 41919 | 42004 | 86 | `exportAppPDF` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 42005 | 42006 | 2 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 42007 | 42144 | 138 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 42145 | 42148 | 4 | `exportAppWord` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 42149 | 42157 | 9 | `runFullAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 42158 | 42161 | 4 | `scrollToGrantSearch` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 42162 | 42176 | 15 | `scrollToWritingAssistant` | fn | — | refs:2 | AI Mode | `app/modules/ai/ai.js` |
| 42177 | 42181 | 5 | `populateGrantProgramDropdown` | async fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 42182 | 42193 | 12 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 42194 | 42195 | 2 | `escapeHtml` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 42196 | 42233 | 38 | `buildOpt` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42234 | 42237 | 4 | `buildGrantWritingContext` | async fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 42238 | 42239 | 2 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 42240 | 42242 | 3 | `indices` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42243 | 42274 | 32 | `all` | const arrow | — | refs:10472 | Unassigned | `app/modules/app/unassigned.js` |
| 42275 | 42330 | 56 | `openNewAppModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42331 | 42335 | 5 | `closeNewAppModal` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42336 | 42340 | 5 | `showHelpModal` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42341 | 42346 | 6 | `closeHelpModal` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 42347 | 42365 | 19 | `switchHelpTab` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 42366 | 42371 | 6 | `toggleConceptCard` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42372 | 42402 | 31 | `helpNavigateTo` | fn | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 42403 | 42737 | 335 | `showHowTo` | fn | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 42738 | 42776 | 39 | `saveNewApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42777 | 42780 | 4 | `saveApplications` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 42781 | 42807 | 27 | `loadApplications` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 42808 | 42844 | 37 | `displayApplications` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 42845 | 42850 | 6 | `updateAppStatus` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42851 | 42858 | 8 | `deleteApplication` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42859 | 42942 | 84 | `exportSingleApplication` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 42943 | 43056 | 114 | `exportAllApplications` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43057 | 43059 | 3 | `getGrantAISystemPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 43060 | 43111 | 52 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 43112 | 43113 | 2 | `getGrantSearchSystemPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 43114 | 43165 | 52 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 43166 | 43167 | 2 | `getFullApplicationSystemPrompt` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 43168 | 43294 | 127 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 43295 | 43296 | 2 | `buildGrantProgramRequirements` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43297 | 43298 | 2 | `stateInfo` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 43299 | 43613 | 315 | `hso` | const arrow | — | refs:43 | Unassigned | `app/modules/app/unassigned.js` |
| 43614 | 43687 | 74 | `callGrantAgentWithRetry` | async fn | — | refs:4 | Grants | `app/modules/grants/grants.js` |
| 43688 | 43696 | 9 | `runGrant4AgentAnalysis` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 43697 | 43764 | 68 | `updateProgress` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 43765 | 43806 | 42 | `buildGrantAgent1Input` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 43807 | 43856 | 50 | `updateGrantProgramUI` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 43857 | 43968 | 112 | `download4AgentApplicationPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 43969 | 44069 | 101 | `download4AgentApplicationWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 44070 | 44110 | 41 | `showGrant4AgentLoadingModal` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 44111 | 44115 | 5 | `hideGrant4AgentLoadingModal` | fn | — | refs:4 | Grants | `app/modules/grants/grants.js` |
| 44116 | 44142 | 27 | `updateGrant4AgentProgress` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 44143 | 44151 | 9 | `generateGrant4AgentPDF` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 44152 | 44152 | 1 | `addPage` | const arrow | — | refs:77 | Unassigned | `app/modules/app/unassigned.js` |
| 44153 | 44254 | 102 | `checkPageBreak` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 44255 | 44261 | 7 | `fileName` | const arrow | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 44262 | 44302 | 41 | `generateGrant4AgentWord` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 44303 | 44527 | 225 | `content` | const arrow | — | refs:1630 | Unassigned | `app/modules/app/unassigned.js` |
| 44528 | 44580 | 53 | `executeCMFSearch` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 44581 | 45301 | 721 | `searchText` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 45302 | 45443 | 142 | `runCMFAgent` | async fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 45444 | 45452 | 9 | `runCMF4AgentAnalysis` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 45453 | 45598 | 146 | `updateProgress` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 45599 | 45667 | 69 | `buildCMFAgent1Input` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 45668 | 45721 | 54 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 45722 | 45729 | 8 | `syncGrantProviderSettings` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45730 | 45737 | 8 | `syncGrantApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45738 | 45757 | 20 | `syncAllApiKeys` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 45758 | 45777 | 20 | `clearAllApiKeys` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 45778 | 45785 | 8 | `saveGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45786 | 45793 | 8 | `saveGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45794 | 45797 | 4 | `clearGrantSearchApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45798 | 45801 | 4 | `clearGrantWritingApiKey` | fn | — | refs:0 | Grants | `app/modules/grants/grants.js` |
| 45802 | 45820 | 19 | `loadGrantAISettings` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 45821 | 45843 | 23 | `getGrantApiKey` | fn | — | refs:11 | Grants | `app/modules/grants/grants.js` |
| 45844 | 45912 | 69 | `callGrantAI` | async fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 45913 | 45925 | 13 | `handleGrantSearchAttachment` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 45926 | 45935 | 10 | `removeGrantSearchAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 45936 | 45953 | 18 | `clearGrantSearchChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 45954 | 45974 | 21 | `addGrantSearchMessage` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 45975 | 46000 | 26 | `grantSearchAsk` | fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 46001 | 46010 | 10 | `sendGrantSearchPrompt` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 46011 | 46052 | 42 | `processGrantSearchQuery` | async fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 46053 | 46079 | 27 | `getStaticGrantRecommendations` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 46080 | 46087 | 8 | `syncCMFAIProviderSettings` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46088 | 46094 | 7 | `syncCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46095 | 46108 | 14 | `saveCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46109 | 46112 | 4 | `clearCMFAIApiKey` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46113 | 46132 | 20 | `updateCMFAIKeyHelper` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46133 | 46152 | 20 | `updateCrashAIKeyHelper` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 46153 | 46157 | 5 | `getCMFAIApiKey` | fn | — | refs:14 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46158 | 46168 | 11 | `clearCMFAIChat` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46169 | 46198 | 30 | `addCMFAIMessage` | fn | — | refs:13 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46199 | 46247 | 49 | `getCMFContext` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46248 | 46391 | 144 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 46392 | 46543 | 152 | `cmfAIAsk` | fn | — | refs:12 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46544 | 46564 | 21 | `sendCMFAIPrompt` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46565 | 46598 | 34 | `getAIRecommendedCountermeasures` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 46599 | 46612 | 14 | `scrollToAIAndRecommend` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 46613 | 46659 | 47 | `triggerAICMFLookup` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46660 | 46684 | 25 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 46685 | 46727 | 43 | `processAICMFLookupQuery` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46728 | 46793 | 66 | `downloadCMFAIChatPDF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46794 | 46796 | 3 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 46797 | 46835 | 39 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 46836 | 46852 | 17 | `sevTotal` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 46853 | 46956 | 104 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 46957 | 46992 | 36 | `handleCMFAIFileSelect` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 46993 | 47003 | 11 | `renderCMFAIAttachments` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47004 | 47008 | 5 | `removeCMFAIAttachment` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47009 | 47014 | 6 | `clearCMFAIAttachments` | fn | — | refs:0 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47015 | 47057 | 43 | `downloadGrantSearchPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 47058 | 47100 | 43 | `downloadGrantWritingPDF` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 47101 | 47145 | 45 | `sanitizeForPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47146 | 47198 | 53 | `parseMarkdownTables` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 47199 | 47239 | 41 | `parseTableLines` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 47240 | 47253 | 14 | `renderAIChatToPDF` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 47254 | 47418 | 165 | `checkNewPage` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 47419 | 47449 | 31 | `downloadCrashAnalysisPDF` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 47450 | 47492 | 43 | `hexToRgb` | const arrow | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 47493 | 47498 | 6 | `cleanText` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 47499 | 47513 | 15 | `drawHeader` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 47514 | 47533 | 20 | `drawFooter` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 47534 | 47543 | 10 | `newPage` | const arrow | — | refs:46 | Unassigned | `app/modules/app/unassigned.js` |
| 47544 | 47552 | 9 | `checkPageBreak` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 47553 | 47579 | 27 | `drawKPICard` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 47580 | 47580 | 1 | `drawSeverityBar` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 47581 | 47598 | 18 | `total` | const arrow | — | refs:4309 | Unassigned | `app/modules/app/unassigned.js` |
| 47599 | 47632 | 34 | `width` | const arrow | — | refs:3062 | Unassigned | `app/modules/app/unassigned.js` |
| 47633 | 47688 | 56 | `addSectionTitle` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 47689 | 47773 | 85 | `totalCardsWidth` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 47774 | 47812 | 39 | `processCMFAIQuery` | async fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47813 | 47937 | 125 | `callCMFAI` | async fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 47938 | 48309 | 372 | `callCMFAIWithTools` | async fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 48310 | 48330 | 21 | `getStaticCMFRecommendations` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 48331 | 48344 | 14 | `updateCMFAIDataBadge` | fn | — | refs:2 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 48345 | 48370 | 26 | `initCMFAI` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 48371 | 48382 | 12 | `handleGrantWritingAttachment` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 48383 | 48389 | 7 | `clearGrantWritingAttachments` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 48390 | 48400 | 11 | `clearGrantWritingChat` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 48401 | 48421 | 21 | `addGrantWritingMessage` | fn | — | refs:10 | Grants | `app/modules/grants/grants.js` |
| 48422 | 48431 | 10 | `showGrantWritingTyping` | fn | — | refs:2 | Grants | `app/modules/grants/grants.js` |
| 48432 | 48436 | 5 | `hideGrantWritingTyping` | fn | — | refs:6 | Grants | `app/modules/grants/grants.js` |
| 48437 | 48490 | 54 | `grantWritingGenerate` | async fn | — | refs:8 | Grants | `app/modules/grants/grants.js` |
| 48491 | 48495 | 5 | `grantWritingAsk` | async fn | — | refs:5 | Grants | `app/modules/grants/grants.js` |
| 48496 | 48527 | 32 | `sendGrantWritingPrompt` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 48528 | 48557 | 30 | `processGrantWritingQuery` | async fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 48558 | 48578 | 21 | `getMaxCrashDate` | fn | — | refs:9 | Analysis | `app/modules/analysis/analysis.js` |
| 48579 | 48599 | 21 | `getMinCrashDate` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 48600 | 48604 | 5 | `formatDateForDisplay` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48605 | 48643 | 39 | `updateDataFreshnessIndicators` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 48644 | 48653 | 10 | `applyDatePreset` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 48654 | 48668 | 15 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 48669 | 48678 | 10 | `applyMonthPreset` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48679 | 48689 | 11 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 48690 | 48705 | 16 | `clearDatePreset` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 48706 | 48721 | 16 | `_readGlobalFilterSpec` | window fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 48722 | 48729 | 8 | `severities` | const arrow | — | refs:5840 | Unassigned | `app/modules/app/unassigned.js` |
| 48730 | 48783 | 54 | `updateDashboardFromMatview` | async fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 48784 | 48825 | 42 | `setN` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 48826 | 48837 | 12 | `_refetchFSMatviewsWithDate` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 48838 | 48949 | 112 | `buildParams` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 48950 | 48972 | 23 | `applyFilters` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 48973 | 49004 | 32 | `resetFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49005 | 49040 | 36 | `resetFilterUI` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 49041 | 49074 | 34 | `getFilteredStats` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49075 | 49136 | 62 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 49137 | 49140 | 4 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 49141 | 49144 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 49145 | 49224 | 80 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 49225 | 49248 | 24 | `setDashboardLoadingState` | fn | — | refs:7 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 49249 | 49384 | 136 | `updateDashboard` | fn | — | refs:33 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 49385 | 49425 | 41 | `avgVehicles` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49426 | 49434 | 9 | `calcPeriodMatchedStats` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49435 | 49509 | 75 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 49510 | 49514 | 5 | `getTrendHtml` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 49515 | 49527 | 13 | `change` | const arrow | — | refs:3026 | Unassigned | `app/modules/app/unassigned.js` |
| 49528 | 49546 | 19 | `multiplier` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 49547 | 49547 | 1 | `lastKA` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49548 | 49551 | 4 | `prevKA` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49552 | 49552 | 1 | `lastVRU` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49553 | 49595 | 43 | `prevVRU` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49596 | 49629 | 34 | `pctChg` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 49630 | 49714 | 85 | `updateCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49715 | 49749 | 35 | `buildCustomLegend` | fn | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 49750 | 49762 | 13 | `buildTierComparison` | fn | — | refs:5 | Core/Tier | `app/modules/core/tier.js` |
| 49763 | 49770 | 8 | `juris` | const arrow | — | refs:2247 | Unassigned | `app/modules/app/unassigned.js` |
| 49771 | 49802 | 32 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 49803 | 49861 | 59 | `buildRegionComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 49862 | 49918 | 57 | `buildMPOComparison` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49919 | 49935 | 17 | `getComparisonRowColor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49936 | 49943 | 8 | `buildComparisonSparkline` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49944 | 49963 | 20 | `x` | const arrow | — | refs:50755 | Unassigned | `app/modules/app/unassigned.js` |
| 49964 | 49969 | 6 | `buildComparisonTrend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 49970 | 49983 | 14 | `pctChangeNum` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 49984 | 50061 | 78 | `renderComparisonRows` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 50062 | 50089 | 28 | `sortComparisonTable` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50090 | 50120 | 31 | `renderComparisonFooter` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 50121 | 50164 | 44 | `renderRegionComparisonTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50165 | 50206 | 42 | `renderMPOComparisonTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50207 | 50277 | 71 | `renderCountyComparisonTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50278 | 50293 | 16 | `maxDisplay` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 50294 | 50301 | 8 | `hydrateComparisonsFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50302 | 50309 | 8 | `scopes` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 50310 | 50310 | 1 | `_toItem` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50311 | 50340 | 30 | `ka` | const arrow | — | refs:485 | Unassigned | `app/modules/app/unassigned.js` |
| 50341 | 50368 | 28 | `maxDisplay` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 50369 | 50397 | 29 | `exportComparisonCSV` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 50398 | 50471 | 74 | `handleComparisonDrillDown` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50472 | 50506 | 35 | `navigateBreadcrumbTier` | async fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 50507 | 50546 | 40 | `updateTierBreadcrumb` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 50547 | 50616 | 70 | `updateTierScopeHeader` | fn | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 50617 | 50640 | 24 | `paintWhenVisible` | fn | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 50641 | 50641 | 1 | `paintDashboardChartsFromMatview` | async fn | — | refs:3 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 50642 | 50812 | 171 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 50813 | 50862 | 50 | `updateDashboardTierSections` | fn | — | refs:6 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 50863 | 50863 | 1 | `elapsed` | const arrow | — | refs:24 | Unassigned | `app/modules/app/unassigned.js` |
| 50864 | 50888 | 25 | `_sampleLen` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 50889 | 50899 | 11 | `isMultiCountyTier` | fn | — | refs:14 | Core/Tier | `app/modules/core/tier.js` |
| 50900 | 50938 | 39 | `buildCountyFilterDropdown` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 50939 | 50995 | 57 | `renderComparisonHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 50996 | 51004 | 9 | `_compHexToRgb` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51005 | 51040 | 36 | `toggleCountyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51041 | 51053 | 13 | `_markDashboardChartPainted` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 51054 | 51068 | 15 | `createChart` | fn | — | refs:93 | Unassigned | `app/modules/app/unassigned.js` |
| 51069 | 51094 | 26 | `stray` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51095 | 51109 | 15 | `showChartPlaceholder` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 51110 | 51133 | 24 | `clearChartPlaceholder` | fn | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 51134 | 51143 | 10 | `_dashResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 51144 | 51152 | 9 | `_dashReadFilters` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51153 | 51156 | 4 | `_dashCanUseSupabase` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51157 | 51168 | 12 | `initDashboardSearch` | fn | — | refs:1 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 51169 | 51188 | 20 | `dashSearchCrashes` | async fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 51189 | 51205 | 17 | `textLower` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51206 | 51229 | 24 | `_dashFetchPage` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51230 | 51237 | 8 | `dashClearSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51238 | 51239 | 2 | `dashRenderSearchResults` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51240 | 51273 | 34 | `page` | const arrow | — | refs:1196 | Unassigned | `app/modules/app/unassigned.js` |
| 51274 | 51293 | 20 | `dashRenderSearchPagination` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51294 | 51302 | 9 | `dashGoSearchPage` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51303 | 51337 | 35 | `dashExportSearchCSV` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 51338 | 51363 | 26 | `getMapCoordinateBounds` | fn | — | refs:18 | Unassigned | `app/modules/app/unassigned.js` |
| 51364 | 51364 | 1 | `latBuffer` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51365 | 51378 | 14 | `lngBuffer` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51379 | 51396 | 18 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 51397 | 51416 | 20 | `geoBounds` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 51417 | 51422 | 6 | `isValidMapPoint` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51423 | 51630 | 208 | `initMap` | fn | — | refs:10 | Map | `app/modules/map/map.js` |
| 51631 | 51642 | 12 | `_loadViewportFromMatview` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 51643 | 51688 | 46 | `_tr` | const arrow | — | refs:37 | Unassigned | `app/modules/app/unassigned.js` |
| 51689 | 51718 | 30 | `fitMapToData` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 51719 | 51735 | 17 | `getFilteredMapPoints` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 51736 | 51737 | 2 | `_tier` | const arrow | — | refs:23 | Core/Tier | `app/modules/core/tier.js` |
| 51738 | 51770 | 33 | `_cityLayer` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 51771 | 51865 | 95 | `activeFlagSets` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51866 | 51921 | 56 | `getActiveMapFilters` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 51922 | 51969 | 48 | `updateMapDisplay` | fn | — | refs:51 | Map | `app/modules/map/map.js` |
| 51970 | 52042 | 73 | `_mapKA` | const arrow | — | refs:26 | Unassigned | `app/modules/app/unassigned.js` |
| 52043 | 52055 | 13 | `createMarker` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52056 | 52056 | 1 | `_renderPopup` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52057 | 52109 | 53 | `route` | const arrow | — | refs:1502 | Unassigned | `app/modules/app/unassigned.js` |
| 52110 | 52151 | 42 | `setMapMode` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52152 | 52159 | 8 | `toggleQuickFilter` | async fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 52160 | 52201 | 42 | `tier` | const arrow | — | refs:1607 | Core/Tier | `app/modules/core/tier.js` |
| 52202 | 52214 | 13 | `toggleMapFilter` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52215 | 52228 | 14 | `toggleMapFiltersPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52229 | 52248 | 20 | `updateMapFiltersBadge` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52249 | 52282 | 34 | `updateQuickFilterBadge` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 52283 | 52300 | 18 | `clearQuickFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52301 | 52302 | 2 | `getActiveStateCapabilities` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 52303 | 52319 | 17 | `currentKey` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52320 | 52340 | 21 | `_buildBlockedBadgeEl` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52341 | 52372 | 32 | `applySafetyFocusCapabilityGates` | async fn | — | refs:3 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 52373 | 52387 | 15 | `txt` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 52388 | 52404 | 17 | `applyInjuryBCCapabilityGate` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52405 | 52417 | 13 | `applyAvgVehiclesCapabilityGate` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52418 | 52433 | 16 | `_renderStateCoverageBanner` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52434 | 52448 | 15 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 52449 | 52509 | 61 | `_hideDistrictWidgetIfUnsupported` | async fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 52510 | 52552 | 43 | `renderMapFactorChips` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52553 | 52574 | 22 | `active` | const arrow | — | refs:1031 | Unassigned | `app/modules/app/unassigned.js` |
| 52575 | 52623 | 49 | `toggleMapFactor` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52624 | 52653 | 30 | `toggleMapFullscreen` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52654 | 52712 | 59 | `setMapBaseLayer` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52713 | 52715 | 3 | `mapSnap_simplify` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52716 | 52726 | 11 | `perpDist` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52727 | 52764 | 38 | `rdp` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 52765 | 52776 | 12 | `mapSnap_sortRoutePoints` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52777 | 52859 | 83 | `mapSnap_fetchRoadGeometry` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 52860 | 52915 | 56 | `mapSnap_drawRoutePolyline` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52916 | 52935 | 20 | `setSelectionMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 52936 | 52951 | 16 | `_scope` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 52952 | 52953 | 2 | `getMapSearchScopeLabel` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 52954 | 52973 | 20 | `stateName` | const arrow | — | refs:116 | Unassigned | `app/modules/app/unassigned.js` |
| 52974 | 52976 | 3 | `updateMapSearchPlaceholder` | fn | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 52977 | 53021 | 45 | `mode` | const arrow | — | refs:566 | Unassigned | `app/modules/app/unassigned.js` |
| 53022 | 53023 | 2 | `populateMapList` | fn | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 53024 | 53093 | 70 | `searchTerm` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 53094 | 53098 | 5 | `filterMapList` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53099 | 53127 | 29 | `toggleMapLocationSelection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 53128 | 53188 | 61 | `aggregateMultiLocationStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53189 | 53266 | 78 | `updateMultiLocationSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 53267 | 53329 | 63 | `highlightMultipleLocationsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53330 | 53337 | 8 | `_mapKA2` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 53338 | 53351 | 14 | `selectAllMapLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53352 | 53384 | 33 | `clearAllMapLocationSelections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53385 | 53444 | 60 | `buildMapSearchData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53445 | 53468 | 24 | `handleMapSearchInput` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 53469 | 53550 | 82 | `performUnifiedSearch` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53551 | 53555 | 5 | `updateMapSearchPlaceholder` | fn | — | refs:21 | Unassigned | `app/modules/app/unassigned.js` |
| 53556 | 53597 | 42 | `tier` | const arrow | — | refs:1607 | Core/Tier | `app/modules/core/tier.js` |
| 53598 | 53598 | 1 | `updateMapScopeLabel` | fn | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 53599 | 53608 | 10 | `label` | const arrow | — | refs:3022 | Unassigned | `app/modules/app/unassigned.js` |
| 53609 | 53620 | 12 | `searchMapboxAddresses` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53621 | 53708 | 88 | `mapInstance` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 53709 | 53765 | 57 | `selectAddressResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53766 | 53800 | 35 | `clearMapAddressSearch` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 53801 | 53814 | 14 | `updateMapSearchClearButton` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 53815 | 53826 | 12 | `findCrashesNearPoint` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 53827 | 53828 | 2 | `getDistanceMeters` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 53829 | 53829 | 1 | `dLat` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 53830 | 53838 | 9 | `dLng` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 53839 | 53865 | 27 | `calculateNearbyCrashSeverity` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 53866 | 53941 | 76 | `getStaticMapUrl` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 53942 | 54006 | 65 | `getStaticMapUrlWithBounds` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54007 | 54031 | 25 | `fetchStaticMapAsBase64` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 54032 | 54045 | 14 | `getSeverityMarkerColor` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54046 | 54075 | 30 | `calculateZoomFromCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 54076 | 54121 | 46 | `addStaticMapToPDF` | async fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 54122 | 54352 | 231 | `addEnhancedMapSectionToPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54353 | 54356 | 4 | `searchMapLocations` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54357 | 54363 | 7 | `showMapSearchResults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54364 | 54392 | 29 | `selectMapSearchResult` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54393 | 54417 | 25 | `zoomToSearchedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54418 | 54499 | 82 | `selectMapLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54500 | 54555 | 56 | `highlightLocationOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54556 | 54562 | 7 | `_mapKA3` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 54563 | 54572 | 10 | `clearRouteHighlights` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 54573 | 54611 | 39 | `clearMapSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 54612 | 54640 | 29 | `generateLocationReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 54641 | 54701 | 61 | `locationJumpToCMF` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 54702 | 54755 | 54 | `locationJumpToMUTCD` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 54756 | 54779 | 24 | `locationJumpToGrants` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 54780 | 54837 | 58 | `score` | const arrow | — | refs:534 | Unassigned | `app/modules/app/unassigned.js` |
| 54838 | 54884 | 47 | `locationJumpToBAStudy` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54885 | 54966 | 82 | `locationAnalyze` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 54967 | 55025 | 59 | `locationExportPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55026 | 55067 | 42 | `locationExport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55068 | 55078 | 11 | `openStreetViewForSelectedLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55079 | 55093 | 15 | `exportSelectedLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55094 | 55114 | 21 | `exportMultiLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55115 | 55119 | 5 | `buildDetailedLocationProfile` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 55120 | 55136 | 17 | `toggleMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55137 | 55147 | 11 | `toggleMapOverlay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55148 | 55160 | 13 | `loadMapOverlayState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55161 | 55176 | 16 | `loadMapSelectionPanelState` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55177 | 55240 | 64 | `toggleMapLabels` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55241 | 55354 | 114 | `startDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55355 | 55363 | 9 | `handleDOMMouseDown` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55364 | 55374 | 11 | `handleDOMMouseMove` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55375 | 55391 | 17 | `handleDOMMouseUp` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55392 | 55417 | 26 | `showDrawingInstruction` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55418 | 55423 | 6 | `updateDrawingButtonStates` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55424 | 55434 | 11 | `handleDrawingClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55435 | 55444 | 10 | `handleDrawingMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55445 | 55451 | 7 | `handleDrawingDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55452 | 55481 | 30 | `updatePolygonPreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55482 | 55510 | 29 | `updateCirclePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55511 | 55525 | 15 | `finishPolygonDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55526 | 55555 | 30 | `finishCircleDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55556 | 55565 | 10 | `handleMeasureClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55566 | 55573 | 8 | `handleMeasureMouseMove` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55574 | 55586 | 13 | `handleMeasureDoubleClick` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55587 | 55630 | 44 | `updateMeasurePreview` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55631 | 55640 | 10 | `clearMeasureVertexMarkers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55641 | 55676 | 36 | `showMeasureLengthDisplay` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55677 | 55687 | 11 | `calculatePolylineLength` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55688 | 55728 | 41 | `finishMeasureDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55729 | 55739 | 11 | `isPointNearPolyline` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55740 | 55748 | 9 | `distanceToLineSegment` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55749 | 55765 | 17 | `lineLengthSq` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 55766 | 55808 | 43 | `finishDrawing` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55809 | 55863 | 55 | `selectCrashesInDrawing` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 55864 | 55884 | 21 | `refreshDrawingSelectionIfActive` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 55885 | 55892 | 8 | `isPointInPolygon` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 55893 | 55903 | 11 | `intersect` | const arrow | — | refs:16639 | Unassigned | `app/modules/app/unassigned.js` |
| 55904 | 55929 | 26 | `selectTIInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55930 | 55990 | 61 | `selectBTSInDrawing` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 55991 | 56024 | 34 | `updateDrawingSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56025 | 56114 | 90 | `areaAcres` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56115 | 56119 | 5 | `calculatePolygonArea` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56120 | 56132 | 13 | `j` | const arrow | — | refs:9414 | Unassigned | `app/modules/app/unassigned.js` |
| 56133 | 56151 | 19 | `highlightSelectedCrashes` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 56152 | 56158 | 7 | `clearDrawingHighlights` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 56159 | 56165 | 7 | `clearTempLayers` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 56166 | 56173 | 8 | `clearDrawingLayers` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56174 | 56220 | 47 | `cancelDrawing` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 56221 | 56273 | 53 | `clearDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56274 | 56438 | 165 | `analyzeDrawingSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 56439 | 56442 | 4 | `closeDrawingAnalysisModal` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 56443 | 56543 | 101 | `jumpToCMFWithSelection` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 56544 | 56677 | 134 | `jumpToWarrantsWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56678 | 56813 | 136 | `jumpToMUTCDWithSelection` | fn | — | refs:1 | Warrants | `app/modules/warrants/warrants.js` |
| 56814 | 56828 | 15 | `jumpToGrantsWithSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 56829 | 56893 | 65 | `score` | const arrow | — | refs:534 | Unassigned | `app/modules/app/unassigned.js` |
| 56894 | 56910 | 17 | `showMapSelectionAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 56911 | 56919 | 9 | `annualCrashCost` | const arrow | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 56920 | 56922 | 3 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 56923 | 56924 | 2 | `localKARate` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 56925 | 57060 | 136 | `criticalRateFactor` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 57061 | 57067 | 7 | `closeMapSelectionPanel` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57068 | 57130 | 63 | `addMapSelectionToTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57131 | 57179 | 49 | `exportMapSelectionPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57180 | 57184 | 5 | `openMapSelectionModal` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57185 | 57189 | 5 | `closeGrantMapModal` | fn | — | refs:3 | Grants | `app/modules/grants/grants.js` |
| 57190 | 57229 | 40 | `goToMapForGrantSelection` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 57230 | 57250 | 21 | `createPseudoRows` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 57251 | 57262 | 12 | `calculateSelectionStats` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57263 | 57342 | 80 | `exportDrawingSelection` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57343 | 57347 | 5 | `getSelectionPDFData` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57348 | 57355 | 8 | `parseMilitaryTimeToHour` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57356 | 57563 | 208 | `formatHour12` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57564 | 57569 | 6 | `formatDate` | const arrow | — | refs:49 | Unassigned | `app/modules/app/unassigned.js` |
| 57570 | 57634 | 65 | `exactPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57635 | 57661 | 27 | `exportSelectionPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 57662 | 57679 | 18 | `generateCrashSelectionPDF` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 57680 | 57694 | 15 | `addFooter` | fn | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 57695 | 57711 | 17 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 57712 | 57722 | 11 | `drawMiniHeader` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 57723 | 57754 | 32 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 57755 | 57756 | 2 | `drawHorizontalBar` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 57757 | 57774 | 18 | `barWidth` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 57775 | 57820 | 46 | `checkPageBreak` | fn | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 57821 | 57869 | 49 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 57870 | 57881 | 12 | `vruSectionHeight` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57882 | 57910 | 29 | `vruKpiWidth` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 57911 | 57917 | 7 | `datePct` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 57918 | 58027 | 110 | `timePct` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 58028 | 58064 | 37 | `isWeekend` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 58065 | 58082 | 18 | `colWidth` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 58083 | 58127 | 45 | `formatHourShort` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58128 | 58154 | 27 | `drawYearlyTableHeader` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 58155 | 58230 | 76 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 58231 | 58953 | 723 | `satMapCrashes` | const arrow | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 58954 | 58975 | 22 | `updateSegmentStep` | fn | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 58976 | 58984 | 9 | `resetSegmentSteps` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 58985 | 59037 | 53 | `runSegmentPreflight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59038 | 59154 | 117 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 59155 | 59156 | 2 | `segmentHaversineDistance` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59157 | 59157 | 1 | `dLat` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 59158 | 59170 | 13 | `dLon` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59171 | 59187 | 17 | `calculateOSMWayLength` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59188 | 59197 | 10 | `metersToMiles` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59198 | 59224 | 27 | `getFHWAClassFromOSM` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59225 | 59237 | 13 | `normalizeOverpassQuery` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59238 | 59247 | 10 | `executeSegmentOverpassQuery` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59248 | 59343 | 96 | `endpointIdx` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59344 | 59354 | 11 | `getOSMCacheKey` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59355 | 59386 | 32 | `loadOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59387 | 59405 | 19 | `saveOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59406 | 59426 | 21 | `clearOSMCache` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 59427 | 59443 | 17 | `resetSegmentAnalysisForJurisdictionChange` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 59444 | 59473 | 30 | `mapRef` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 59474 | 59547 | 74 | `fetchOSMCenterlineData` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59548 | 59624 | 77 | `getJurisdictionBounds` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 59625 | 59659 | 35 | `matchCrashRouteToOSM` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 59660 | 59987 | 328 | `analyzeOverRepSegments` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 59988 | 60087 | 100 | `renderSegmentAnalysisResults` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 60088 | 60156 | 69 | `showSegmentOnMap` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60157 | 60244 | 88 | `createSegmentPopupContent` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60245 | 60317 | 73 | `showSegmentDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 60318 | 60335 | 18 | `jumpToHotspotFromSegment` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60336 | 60349 | 14 | `openSegmentMeasureTool` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60350 | 60459 | 110 | `analyzeSelectedSegment` | async fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 60460 | 60516 | 57 | `showOverRepSegmentsOnMap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60517 | 60540 | 24 | `showSegmentMapLegend` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60541 | 60556 | 16 | `clearSegmentMapLayer` | fn | — | refs:1 | Map | `app/modules/map/map.js` |
| 60557 | 60593 | 37 | `exportOverRepSegmentsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60594 | 60660 | 67 | `exportOverRepSegmentsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60661 | 60683 | 23 | `toggleHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60684 | 60702 | 19 | `toggleAllHotspotSelection` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60703 | 60713 | 11 | `clearHotspotSelection` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60714 | 60731 | 18 | `updateHotspotSelectionCount` | fn | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60732 | 60739 | 8 | `setHotspotViewMode` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60740 | 60787 | 48 | `updateHotspotDetailPanel` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60788 | 60788 | 1 | `_hydrateHotspotDetailFromMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 60789 | 60791 | 3 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 60792 | 60806 | 15 | `stateState` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 60807 | 60821 | 15 | `_nodeIdFor` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60822 | 60822 | 1 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 60823 | 60867 | 45 | `tryTypes` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60868 | 60873 | 6 | `_mergeCount` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 60874 | 60932 | 59 | `_mergeYear` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 60933 | 60958 | 26 | `sumRange` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 60959 | 60975 | 17 | `w` | const arrow | — | refs:71667 | Unassigned | `app/modules/app/unassigned.js` |
| 60976 | 61076 | 101 | `aggregateHotspotDetailData` | fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61077 | 61118 | 42 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 61119 | 61123 | 5 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 61124 | 61127 | 4 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 61128 | 61131 | 4 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 61132 | 61186 | 55 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 61187 | 61227 | 41 | `calculateCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61228 | 61244 | 17 | `renderHotspotDetailContent` | fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61245 | 61247 | 3 | `renderCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61248 | 61249 | 2 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 61250 | 61453 | 204 | `vruPct` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 61454 | 61476 | 23 | `renderFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 61477 | 61484 | 8 | `renderCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61485 | 61546 | 62 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 61547 | 61564 | 18 | `initHotspotDetailCharts` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61565 | 61700 | 136 | `initCombinedCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 61701 | 61716 | 16 | `renderMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61717 | 61747 | 31 | `getHeatmapColor` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 61748 | 61785 | 38 | `initCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 61786 | 61833 | 48 | `exportHotspotDetailCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61834 | 61848 | 15 | `exportHotspotDetailPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61849 | 61989 | 141 | `_selectedHotspots` | const arrow | — | refs:5 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 61990 | 61992 | 3 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 61993 | 62064 | 72 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 62065 | 62094 | 30 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 62095 | 62235 | 141 | `addSectionHeader` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 62236 | 62246 | 11 | `exportHotspotDetailKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62247 | 62253 | 7 | `toggleHotspotExportMenu` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62254 | 62267 | 14 | `closeHotspotExportMenu` | fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62268 | 62271 | 4 | `analyzeHotspots` | fn | — | refs:14 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62272 | 62344 | 73 | `_tabTier` | const arrow | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 62345 | 62347 | 3 | `_loadHotspotsFromMatview` | async fn | — | refs:4 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62348 | 62357 | 10 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 62358 | 62369 | 12 | `groupBy` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 62370 | 62394 | 25 | `_ratesPromise` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62395 | 62413 | 19 | `k` | const arrow | — | refs:31203 | Unassigned | `app/modules/app/unassigned.js` |
| 62414 | 62475 | 62 | `useIntersections` | const arrow | — | refs:3 | Intersections | `app/modules/intersection/intersection.js` |
| 62476 | 62483 | 8 | `k1` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 62484 | 62490 | 7 | `fk` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62491 | 62562 | 72 | `rk` | const arrow | — | refs:3278 | Unassigned | `app/modules/app/unassigned.js` |
| 62563 | 62611 | 49 | `_hotspots_fetchMatview` | async fn | — | refs:2 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62612 | 62612 | 1 | `_renderHotspotsTableFromMatview` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62613 | 62663 | 51 | `mapped` | const arrow | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 62664 | 62688 | 25 | `autoSelectTopHotspot` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62689 | 62703 | 15 | `showHotspotInfoBanner` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62704 | 62729 | 26 | `getFilteredHotspotAggregates` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62730 | 62767 | 38 | `juris` | const arrow | — | refs:2247 | Unassigned | `app/modules/app/unassigned.js` |
| 62768 | 62804 | 37 | `juris` | const arrow | — | refs:2247 | Unassigned | `app/modules/app/unassigned.js` |
| 62805 | 62810 | 6 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 62811 | 62833 | 23 | `jurisdiction` | const arrow | — | refs:2044 | Unassigned | `app/modules/app/unassigned.js` |
| 62834 | 62852 | 19 | `resolveJurisdiction` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 62853 | 62869 | 17 | `updateHotspotFilterSummary` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62870 | 62896 | 27 | `renderHotspots` | fn | — | refs:15 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62897 | 62902 | 6 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 62903 | 62905 | 3 | `aadtCell` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62906 | 62937 | 32 | `rateCell` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 62938 | 62943 | 6 | `goToHotspotPage` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62944 | 62956 | 13 | `askMUTCDForHotspot` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 62957 | 63015 | 59 | `openHotspotStreetView` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 63016 | 63046 | 31 | `showLocationModal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 63047 | 63073 | 27 | `zoomToLocation` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63074 | 63092 | 19 | `filterMapForLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63093 | 63137 | 45 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 63138 | 63161 | 24 | `exportHotspotsCSV` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 63162 | 63190 | 29 | `exportHotspotsPDF` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 63191 | 63238 | 48 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 63239 | 63344 | 106 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 63345 | 63374 | 30 | `updateAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 63375 | 63416 | 42 | `switchAnalysisSubtab` | fn | — | refs:6 | Analysis | `app/modules/analysis/analysis.js` |
| 63417 | 63492 | 76 | `_paint` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 63493 | 63509 | 17 | `tiBeforeUnload` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63510 | 63526 | 17 | `sendAllJurisdictionsToTrafficInventory` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 63527 | 63544 | 18 | `jurStateKey` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 63545 | 63550 | 6 | `syncJurisdictionToTrafficInventory` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 63551 | 63573 | 23 | `r2BasePath` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 63574 | 63583 | 10 | `sendAllJurisdictionsToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 63584 | 63598 | 15 | `jurStateKey` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 63599 | 63615 | 17 | `syncJurisdictionToInventoryManager` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 63616 | 63645 | 30 | `r2BasePath` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 63646 | 63665 | 20 | `sendCrashDataToAssetDeficiency` | fn | — | refs:10 | Analysis | `app/modules/analysis/analysis.js` |
| 63666 | 63670 | 5 | `sendInventoryToAssetDeficiency` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63671 | 63679 | 9 | `sendConfigToAssetDeficiency` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 63680 | 63681 | 2 | `baseUrl` | const arrow | — | refs:38 | Unassigned | `app/modules/app/unassigned.js` |
| 63682 | 63746 | 65 | `r2Path` | const arrow | — | refs:17 | Unassigned | `app/modules/app/unassigned.js` |
| 63747 | 63758 | 12 | `sendAllJurisdictionsToValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63759 | 63784 | 26 | `stateAbbr` | const arrow | — | refs:63 | Unassigned | `app/modules/app/unassigned.js` |
| 63785 | 63790 | 6 | `buildValidatorJurisdictionKey` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63791 | 63798 | 8 | `stateAbbr` | const arrow | — | refs:63 | Unassigned | `app/modules/app/unassigned.js` |
| 63799 | 63814 | 16 | `syncJurisdictionToValidator` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 63815 | 63841 | 27 | `r2BasePath` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 63842 | 63866 | 25 | `loadValidatorIframe` | fn | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 63867 | 63900 | 34 | `reloadValidator` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63901 | 63919 | 19 | `normalizeLocationName` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 63920 | 63946 | 27 | `findCrashesForLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 63947 | 63970 | 24 | `openStreetView` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 63971 | 63995 | 25 | `openAssetLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 63996 | 64029 | 34 | `openStreetViewForLocation` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 64030 | 64045 | 16 | `hasValidCoordsForLocation` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 64046 | 64085 | 40 | `openStreetViewForCrashType` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 64086 | 64257 | 172 | `generateKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 64258 | 64272 | 15 | `escapeXml` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 64273 | 64285 | 13 | `downloadKML` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 64286 | 64384 | 99 | `exportMapToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64385 | 64406 | 22 | `exportLocationToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64407 | 64424 | 18 | `exportDrawingSelectionToKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64425 | 64457 | 33 | `generateDrawingSelectionKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64458 | 64459 | 2 | `angle` | const arrow | — | refs:688 | Unassigned | `app/modules/app/unassigned.js` |
| 64460 | 64460 | 1 | `dLat` | const arrow | — | refs:35 | Unassigned | `app/modules/app/unassigned.js` |
| 64461 | 64505 | 45 | `dLng` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 64506 | 64535 | 30 | `exportHotspotsToKML` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 64536 | 64553 | 18 | `exportPedCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 64554 | 64571 | 18 | `exportBikeCrashesToKML` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 64572 | 64587 | 16 | `exportIntersectionCrashesToKML` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 64588 | 64610 | 23 | `exportCMFLocationToKML` | fn | — | refs:1 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 64611 | 64627 | 17 | `exportWarrantLocationToKML` | fn | — | refs:0 | Warrants | `app/modules/warrants/warrants.js` |
| 64628 | 64672 | 45 | `exportGrantLocationsToKML` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 64673 | 64683 | 11 | `applyIntersectionFilters` | fn | — | refs:6 | Intersections | `app/modules/intersection/intersection.js` |
| 64684 | 64701 | 18 | `baseSpec` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 64702 | 64738 | 37 | `updateIntersectionTabFromMatview` | async fn | — | refs:4 | Intersections | `app/modules/intersection/intersection.js` |
| 64739 | 64749 | 11 | `resetIntersectionFilters` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 64750 | 64778 | 29 | `updateIntersectionFilterStatus` | fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 64779 | 64781 | 3 | `_loadIntersectionsFromHotspots` | async fn | — | refs:3 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 64782 | 64847 | 66 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 64848 | 64848 | 1 | `finalTotal` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 64849 | 64849 | 1 | `finalK` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 64850 | 64850 | 1 | `finalA` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 64851 | 65028 | 178 | `baseTotal` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 65029 | 65064 | 36 | `_intersections_fetchMatview` | async fn | — | refs:2 | Intersections | `app/modules/intersection/intersection.js` |
| 65065 | 65075 | 11 | `_renderIntersectionKpisFromMatview` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65076 | 65089 | 14 | `baseTotal` | const arrow | — | refs:16 | Unassigned | `app/modules/app/unassigned.js` |
| 65090 | 65116 | 27 | `getFilteredIntersectionData` | fn | — | refs:7 | Intersections | `app/modules/intersection/intersection.js` |
| 65117 | 65191 | 75 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 65192 | 65196 | 5 | `updateIntersectionTab` | fn | — | refs:12 | Intersections | `app/modules/intersection/intersection.js` |
| 65197 | 65266 | 70 | `_tabTier` | const arrow | — | refs:6 | Core/Tier | `app/modules/core/tier.js` |
| 65267 | 65298 | 32 | `juris` | const arrow | — | refs:2247 | Unassigned | `app/modules/app/unassigned.js` |
| 65299 | 65319 | 21 | `_updateIntersectionThead` | fn | — | refs:3 | Intersections | `app/modules/intersection/intersection.js` |
| 65320 | 65323 | 4 | `_renderIntersectionRows` | fn | — | refs:5 | Intersections | `app/modules/intersection/intersection.js` |
| 65324 | 65352 | 29 | `startIndex` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 65353 | 65359 | 7 | `goToIntersectionPage` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65360 | 65389 | 30 | `autoSelectTopIntersection` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65390 | 65404 | 15 | `showIntInfoBanner` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65405 | 65411 | 7 | `askMUTCDForIntersection` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65412 | 65454 | 43 | `exportIntersectionCSV` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65455 | 65576 | 122 | `exportIntersectionPDF` | async fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 65577 | 65595 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 65596 | 65637 | 42 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 65638 | 65658 | 21 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 65659 | 65704 | 46 | `rawWidth` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65705 | 65862 | 158 | `chartW` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 65863 | 65886 | 24 | `toggleIntSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65887 | 65908 | 22 | `toggleAllIntSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65909 | 65921 | 13 | `clearIntSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65922 | 65943 | 22 | `updateIntSelectionCount` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 65944 | 65951 | 8 | `setIntViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 65952 | 65970 | 19 | `resetIntPeakDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65971 | 65980 | 10 | `getIntPeakHours` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 65981 | 65999 | 19 | `isInIntPeakPeriod` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66000 | 66030 | 31 | `updateIntDetailPanel` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66031 | 66075 | 45 | `aggregateIntDetailData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66076 | 66110 | 35 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 66111 | 66114 | 4 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 66115 | 66118 | 4 | `firstHarmful` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 66119 | 66120 | 2 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 66121 | 66122 | 2 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 66123 | 66175 | 53 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 66176 | 66182 | 7 | `calculateIntCountyBenchmarks` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66183 | 66206 | 24 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 66207 | 66208 | 2 | `getIntCollisionProblemClass` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66209 | 66219 | 11 | `type` | const arrow | — | refs:4148 | Unassigned | `app/modules/app/unassigned.js` |
| 66220 | 66232 | 13 | `renderIntDetailContent` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 66233 | 66235 | 3 | `renderIntCombinedView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66236 | 66237 | 2 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 66238 | 66265 | 28 | `vruPct` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 66266 | 66331 | 66 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 66332 | 66340 | 9 | `renderIntFactorRow` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66341 | 66349 | 9 | `renderIntCompareView` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66350 | 66363 | 14 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 66364 | 66372 | 9 | `initIntDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66373 | 66433 | 61 | `initIntCombinedCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66434 | 66458 | 25 | `renderIntMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66459 | 66475 | 17 | `initIntCompareCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66476 | 66483 | 8 | `exportIntDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66484 | 66515 | 32 | `exportIntDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66516 | 66526 | 11 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 66527 | 66545 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 66546 | 66587 | 42 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 66588 | 66626 | 39 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 66627 | 66755 | 129 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 66756 | 66775 | 20 | `exportIntDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 66776 | 66896 | 121 | `updatePedBikeTab` | fn | — | refs:3 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 66897 | 66967 | 71 | `totalVRUKA` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 66968 | 66975 | 8 | `togglePedFilter` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 66976 | 66983 | 8 | `toggleBikeFilter` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 66984 | 66995 | 12 | `applyPedFilters` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 66996 | 67052 | 57 | `tabRows` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67053 | 67091 | 39 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 67092 | 67161 | 70 | `renderPedLocationTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67162 | 67184 | 23 | `togglePedSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67185 | 67199 | 15 | `toggleAllPedSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67200 | 67206 | 7 | `clearPedSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67207 | 67228 | 22 | `updatePedSelectionUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67229 | 67288 | 60 | `_fetchPedBikeDetailAggregates` | async fn | — | refs:2 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 67289 | 67361 | 73 | `rawRows` | const arrow | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 67362 | 67431 | 70 | `updatePedDetailPanel` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67432 | 67440 | 9 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 67441 | 67443 | 3 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 67444 | 67519 | 76 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 67520 | 67715 | 196 | `renderPedFactorRow` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 67716 | 67766 | 51 | `initPedDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67767 | 67860 | 94 | `cleanLabel` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 67861 | 67865 | 5 | `renderPedMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67866 | 67905 | 40 | `sortedYears` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 67906 | 67917 | 12 | `resetPedFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 67918 | 67950 | 33 | `updatePedLocationTypeChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 67951 | 67960 | 10 | `applyBikeFilters` | fn | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 67961 | 68017 | 57 | `tabRows` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68018 | 68053 | 36 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 68054 | 68122 | 69 | `renderBikeLocationTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68123 | 68143 | 21 | `toggleBikeSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68144 | 68157 | 14 | `toggleAllBikeSelection` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68158 | 68163 | 6 | `clearBikeSelection` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68164 | 68179 | 16 | `updateBikeSelectionUI` | fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68180 | 68243 | 64 | `updateBikeDetailPanel` | async fn | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68244 | 68252 | 9 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 68253 | 68255 | 3 | `weather` | const arrow | — | refs:290 | Unassigned | `app/modules/app/unassigned.js` |
| 68256 | 68331 | 76 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 68332 | 68527 | 196 | `renderBikeFactorRow` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 68528 | 68534 | 7 | `initBikeDetailCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68535 | 68672 | 138 | `cleanLabel` | const arrow | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 68673 | 68677 | 5 | `renderBikeMonthlyHeatmap` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68678 | 68716 | 39 | `sortedYears` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 68717 | 68732 | 16 | `resetBikeFilters` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68733 | 68739 | 7 | `setPedViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 68740 | 68748 | 9 | `exportPedDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68749 | 68786 | 38 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 68787 | 68821 | 35 | `exportPedDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 68822 | 68836 | 15 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 68837 | 68842 | 6 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 68843 | 68861 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 68862 | 68903 | 42 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 68904 | 68942 | 39 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 68943 | 69098 | 156 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 69099 | 69111 | 13 | `exportPedDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69112 | 69139 | 28 | `exportPedLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69140 | 69163 | 24 | `exportPedLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69164 | 69211 | 48 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 69212 | 69242 | 31 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 69243 | 69366 | 124 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 69367 | 69373 | 7 | `setBikeViewMode` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 69374 | 69382 | 9 | `exportBikeDetailCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69383 | 69420 | 38 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 69421 | 69455 | 35 | `exportBikeDetailPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69456 | 69470 | 15 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 69471 | 69476 | 6 | `kaRate` | const arrow | — | refs:92 | Unassigned | `app/modules/app/unassigned.js` |
| 69477 | 69495 | 19 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 69496 | 69537 | 42 | `drawSectionHeader` | fn | — | refs:58 | Unassigned | `app/modules/app/unassigned.js` |
| 69538 | 69576 | 39 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 69577 | 69732 | 156 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 69733 | 69745 | 13 | `exportBikeDetailKML` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69746 | 69773 | 28 | `exportBikeLocationsCSV` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69774 | 69797 | 24 | `exportBikeLocationsPDF` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 69798 | 69845 | 48 | `drawKPI` | fn | — | refs:96 | Unassigned | `app/modules/app/unassigned.js` |
| 69846 | 69876 | 31 | `kpiWidth` | const arrow | — | refs:147 | Unassigned | `app/modules/app/unassigned.js` |
| 69877 | 69996 | 120 | `segWidth` | const arrow | — | refs:50 | Unassigned | `app/modules/app/unassigned.js` |
| 69997 | 70026 | 30 | `updateBikeLocationTypeChart` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70027 | 70027 | 1 | `updatePedLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70028 | 70028 | 1 | `updateBikeLocations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70029 | 70029 | 1 | `clearPedDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70030 | 70032 | 3 | `clearBikeDateFilter` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 70033 | 70043 | 11 | `jumpToCMFFromPedBike` | fn | — | refs:4 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 70044 | 70077 | 34 | `zoomToPedBikeLocation` | fn | — | refs:4 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70078 | 70099 | 22 | `filterMapForPedBike` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70100 | 70136 | 37 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 70137 | 70163 | 27 | `showLocationDetail` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70164 | 70249 | 86 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 70250 | 70250 | 1 | `updatePeopleFromMatview` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70251 | 70286 | 36 | `dc` | const arrow | — | refs:1021 | Unassigned | `app/modules/app/unassigned.js` |
| 70287 | 70287 | 1 | `pedCat` | const arrow | — | refs:14 | Unassigned | `app/modules/app/unassigned.js` |
| 70288 | 70288 | 1 | `bikeCat` | const arrow | — | refs:10 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70289 | 70289 | 1 | `motoCat` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 70290 | 70290 | 1 | `unrestrainedCat` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 70291 | 70291 | 1 | `seniorCat` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 70292 | 70292 | 1 | `youngCat` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70293 | 70293 | 1 | `speedCat` | const arrow | — | refs:52 | Unassigned | `app/modules/app/unassigned.js` |
| 70294 | 70294 | 1 | `alcoholCat` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70295 | 70302 | 8 | `distractedCat` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70303 | 70309 | 7 | `_calcEpdo` | const arrow | — | refs:10 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 70310 | 70333 | 24 | `$set` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 70334 | 70446 | 113 | `getCount` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 70447 | 70512 | 66 | `factorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 70513 | 70519 | 7 | `_entriesByTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70520 | 70525 | 6 | `_entriesByYear` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70526 | 70582 | 57 | `_populateLegend` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70583 | 70643 | 61 | `_pedLocTotal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70644 | 70730 | 87 | `_bikeLocTotal` | const arrow | — | refs:2 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70731 | 70734 | 4 | `renderPedBikeLocationsFromMatview` | async fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70735 | 70738 | 4 | `_calcEpdo` | const arrow | — | refs:10 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 70739 | 70763 | 25 | `_hydrate` | const arrow | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 70764 | 70790 | 27 | `_paintLocTypePie` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 70791 | 70857 | 67 | `total` | const arrow | — | refs:4309 | Unassigned | `app/modules/app/unassigned.js` |
| 70858 | 70861 | 4 | `renderPedBikeComparisonTableFromCats` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70862 | 70862 | 1 | `ped` | const arrow | — | refs:2726 | Unassigned | `app/modules/app/unassigned.js` |
| 70863 | 70863 | 1 | `bike` | const arrow | — | refs:1061 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 70864 | 70868 | 5 | `_calcEpdo` | const arrow | — | refs:10 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 70869 | 70869 | 1 | `totalVRU` | const arrow | — | refs:34 | Unassigned | `app/modules/app/unassigned.js` |
| 70870 | 70870 | 1 | `totalVRUK` | const arrow | — | refs:12 | Unassigned | `app/modules/app/unassigned.js` |
| 70871 | 70874 | 4 | `totalVRUKA` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 70875 | 70907 | 33 | `allTotal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 70908 | 70910 | 3 | `updatePeopleAnalysis` | fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 70911 | 71077 | 167 | `_ppTier` | const arrow | — | refs:1 | Core/Tier | `app/modules/core/tier.js` |
| 71078 | 71119 | 42 | `createFactorChart` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 71120 | 71143 | 24 | `buildQuickLocationData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71144 | 71157 | 14 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 71158 | 71253 | 96 | `viewLocationCMF` | fn | — | refs:3 | CMF/Countermeasures | `app/modules/cmf/cmf.js` |
| 71254 | 71260 | 7 | `showGlobalQuickSearchBar` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 71261 | 71303 | 43 | `globalQuickLocationFilter` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71304 | 71340 | 37 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 71341 | 71347 | 7 | `showGlobalSearchResults` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 71348 | 71360 | 13 | `selectGlobalLocation` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71361 | 71387 | 27 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 71388 | 71402 | 15 | `showGlobalLocationPreview` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71403 | 71437 | 35 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 71438 | 71455 | 18 | `selectGlobalQuickLocation` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 71456 | 71507 | 52 | `goToCountermeasuresGlobal` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 71508 | 71515 | 8 | `_analysisReadFilters` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 71516 | 71518 | 3 | `_analysisCanUseSupabase` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 71519 | 71527 | 9 | `_analysisResolveTier` | fn | — | refs:2 | Core/Tier | `app/modules/core/tier.js` |
| 71528 | 71574 | 47 | `analysisQuickLocationFilter` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71575 | 71602 | 28 | `analysisSelectLocation` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 71603 | 71610 | 8 | `analysisSelectTopQuickLocation` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71611 | 71635 | 25 | `analysisGoToCountermeasures` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71636 | 71654 | 19 | `analysisSearchCrashes` | async fn | — | refs:4 | Analysis | `app/modules/analysis/analysis.js` |
| 71655 | 71670 | 16 | `textLower` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 71671 | 71692 | 22 | `_analysisFetchPage` | async fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 71693 | 71700 | 8 | `analysisClearSearch` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71701 | 71701 | 1 | `analysisRenderSearchResults` | fn | — | refs:3 | Analysis | `app/modules/analysis/analysis.js` |
| 71702 | 71732 | 31 | `page` | const arrow | — | refs:1196 | Unassigned | `app/modules/app/unassigned.js` |
| 71733 | 71749 | 17 | `analysisRenderSearchPagination` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 71750 | 71758 | 9 | `analysisGoSearchPage` | fn | — | refs:5 | Analysis | `app/modules/analysis/analysis.js` |
| 71759 | 71782 | 24 | `analysisExportSearchCSV` | async fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71783 | 71810 | 28 | `initAnalysisSearch` | fn | — | refs:0 | Analysis | `app/modules/analysis/analysis.js` |
| 71811 | 71833 | 23 | `showReportSubTab` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 71834 | 71837 | 4 | `updateReportOptions` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 71838 | 71939 | 102 | `showRouteGroup` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 71940 | 71940 | 1 | `buildAIContext` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 71941 | 71948 | 8 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 71949 | 72002 | 54 | `rt` | const arrow | — | refs:13997 | Unassigned | `app/modules/app/unassigned.js` |
| 72003 | 72032 | 30 | `_safeAgg` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72033 | 72043 | 11 | `hydrateReportFromMatviews` | async fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 72044 | 72048 | 5 | `baseParams` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72049 | 72101 | 53 | `fetchJson` | async const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 72102 | 72104 | 3 | `fetchReportDataForType` | async fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72105 | 72106 | 2 | `stateKey` | const arrow | — | refs:311 | Unassigned | `app/modules/app/unassigned.js` |
| 72107 | 72170 | 64 | `rt` | const arrow | — | refs:13997 | Unassigned | `app/modules/app/unassigned.js` |
| 72171 | 72184 | 14 | `generateReport` | fn | — | refs:22 | Unassigned | `app/modules/app/unassigned.js` |
| 72185 | 72186 | 2 | `hasNode` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72187 | 72187 | 1 | `fld` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72188 | 72208 | 21 | `target` | const arrow | — | refs:342 | Unassigned | `app/modules/app/unassigned.js` |
| 72209 | 72407 | 199 | `pickerRow` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72408 | 72412 | 5 | `generateSystemwideReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72413 | 72418 | 6 | `_legacySystemwideReport` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 72419 | 72507 | 89 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 72508 | 72519 | 12 | `computeSystemwideCategoryData` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72520 | 72557 | 38 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 72558 | 72595 | 38 | `intAnalysis` | const arrow | — | refs:8 | Analysis | `app/modules/analysis/analysis.js` |
| 72596 | 72671 | 76 | `generateExplorationDashboard` | fn | — | refs:2 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 72672 | 72681 | 10 | `getTopLocation` | fn | — | refs:9 | Unassigned | `app/modules/app/unassigned.js` |
| 72682 | 72691 | 10 | `truncateRoute` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72692 | 72695 | 4 | `generateCategoryTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72696 | 72746 | 51 | `buildTopTable` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 72747 | 72824 | 78 | `generateEnhancedFindings` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72825 | 72913 | 89 | `generateEnhancedRecommendations` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 72914 | 72919 | 6 | `generateCorridorReport` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 72920 | 72980 | 61 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 72981 | 72986 | 6 | `generateSafetyReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 72987 | 73064 | 78 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 73065 | 73071 | 7 | `generatePedBikeReport` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 73072 | 73084 | 13 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 73085 | 73230 | 146 | `totalVRUKA` | const arrow | — | refs:8 | Unassigned | `app/modules/app/unassigned.js` |
| 73231 | 73280 | 50 | `createEnhancedPedBikeCharts` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 73281 | 73286 | 6 | `generateTrendReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73287 | 73310 | 24 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 73311 | 73319 | 9 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 73320 | 73400 | 81 | `change` | const arrow | — | refs:3026 | Unassigned | `app/modules/app/unassigned.js` |
| 73401 | 73414 | 14 | `generateReportId` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 73415 | 73432 | 18 | `getFullTimestamp` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73433 | 73439 | 7 | `getShortTimestamp` | fn | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 73440 | 73471 | 32 | `buildExecutiveSummary` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73472 | 73488 | 17 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 73489 | 73514 | 26 | `updateReportFooter` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 73515 | 73542 | 28 | `showTableOfContents` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 73543 | 73668 | 126 | `getDefaultTOCSections` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 73669 | 73679 | 11 | `showExecutiveSummary` | fn | — | refs:13 | Unassigned | `app/modules/app/unassigned.js` |
| 73680 | 73700 | 21 | `computeStats` | fn | — | refs:40 | Unassigned | `app/modules/app/unassigned.js` |
| 73701 | 73726 | 26 | `rawSev` | const arrow | — | refs:10 | Unassigned | `app/modules/app/unassigned.js` |
| 73727 | 73749 | 23 | `validateReportData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 73750 | 73779 | 30 | `getDateRange` | fn | — | refs:20 | Unassigned | `app/modules/app/unassigned.js` |
| 73780 | 73780 | 1 | `resolveReportPeriod` | fn | — | refs:28 | Unassigned | `app/modules/app/unassigned.js` |
| 73781 | 73785 | 5 | `fmt` | const arrow | — | refs:32 | Unassigned | `app/modules/app/unassigned.js` |
| 73786 | 73810 | 25 | `parseLocal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 73811 | 73831 | 21 | `generateFindings` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 73832 | 74041 | 210 | `generateSafetyFocusReport` | fn | — | refs:1 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 74042 | 74106 | 65 | `generateSafetyFocusRecommendations` | fn | — | refs:2 | Safety Focus | `app/modules/safety/safety-focus.js` |
| 74107 | 74113 | 7 | `generateYearlySection` | fn | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 74114 | 74127 | 14 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 74128 | 74134 | 7 | `generateTopLocationsTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74135 | 74146 | 12 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 74147 | 74153 | 7 | `generateNodeTable` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74154 | 74165 | 12 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 74166 | 74174 | 9 | `generateRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74175 | 74184 | 10 | `generateSafetyRecommendations` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74185 | 74215 | 31 | `generatePedBikeRecommendations` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 74216 | 74227 | 12 | `generatePedBikeYearlySection` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 74228 | 74245 | 18 | `generatePedBikeLocationTable` | fn | — | refs:1 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 74246 | 74260 | 15 | `createReportCharts` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74261 | 74282 | 22 | `createSafetyCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74283 | 74298 | 16 | `createPedBikeCharts` | fn | — | refs:0 | Ped/Bike | `app/modules/pedbike/pedbike.js` |
| 74299 | 74313 | 15 | `createTrendCharts` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 74314 | 74321 | 8 | `printReport` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 74322 | 74340 | 19 | `storeReportData` | fn | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 74341 | 74396 | 56 | `downloadReportPDF` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74397 | 74432 | 36 | `generateStandardReportPDF` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74433 | 74442 | 10 | `hexToRgb` | const arrow | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 74443 | 74461 | 19 | `cleanText` | const arrow | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 74462 | 74466 | 5 | `fmtRptDate` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 74467 | 74503 | 37 | `parseRptLocal` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 74504 | 74534 | 31 | `drawHeader` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74535 | 74554 | 20 | `drawFooter` | const arrow | — | refs:7 | Unassigned | `app/modules/app/unassigned.js` |
| 74555 | 74565 | 11 | `newPage` | const arrow | — | refs:46 | Unassigned | `app/modules/app/unassigned.js` |
| 74566 | 74574 | 9 | `checkPageBreak` | const arrow | — | refs:44 | Unassigned | `app/modules/app/unassigned.js` |
| 74575 | 74595 | 21 | `addText` | const arrow | — | refs:171 | Unassigned | `app/modules/app/unassigned.js` |
| 74596 | 74610 | 15 | `addSectionTitle` | const arrow | — | refs:27 | Unassigned | `app/modules/app/unassigned.js` |
| 74611 | 74621 | 11 | `addSubsectionTitle` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 74622 | 74623 | 2 | `drawSeverityBar` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 74624 | 74641 | 18 | `total` | const arrow | — | refs:4309 | Unassigned | `app/modules/app/unassigned.js` |
| 74642 | 74672 | 31 | `width` | const arrow | — | refs:3062 | Unassigned | `app/modules/app/unassigned.js` |
| 74673 | 74689 | 17 | `drawKPICard` | const arrow | — | refs:15 | Unassigned | `app/modules/app/unassigned.js` |
| 74690 | 74730 | 41 | `addSpacer` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 74731 | 74776 | 46 | `totalCardsWidth` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 74777 | 74840 | 64 | `crashPct` | const arrow | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 74841 | 74900 | 60 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 74901 | 74969 | 69 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 74970 | 75094 | 125 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75095 | 75121 | 27 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75122 | 75212 | 91 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75213 | 75239 | 27 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75240 | 75379 | 140 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75380 | 75391 | 12 | `copyReportText` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75392 | 75437 | 46 | `generateInfographic` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75438 | 75497 | 60 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75498 | 75609 | 112 | `sum` | const arrow | — | refs:783 | Unassigned | `app/modules/app/unassigned.js` |
| 75610 | 75626 | 17 | `getQuarterLabel` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75627 | 75653 | 27 | `computePeakPatterns` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75654 | 75676 | 23 | `sum` | const arrow | — | refs:783 | Unassigned | `app/modules/app/unassigned.js` |
| 75677 | 75687 | 11 | `computeContributingFactors` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75688 | 75689 | 2 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 75690 | 75690 | 1 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 75691 | 75691 | 1 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 75692 | 75721 | 30 | `driver` | const arrow | — | refs:320 | Unassigned | `app/modules/app/unassigned.js` |
| 75722 | 75730 | 9 | `computeTopLocations` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75731 | 75740 | 10 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75741 | 75771 | 31 | `computeTrendComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75772 | 75786 | 15 | `calcChange` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 75787 | 75793 | 7 | `computeRiskyBehaviors` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75794 | 75794 | 1 | `restraintVal` | const arrow | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 75795 | 75795 | 1 | `driverAction` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 75796 | 75823 | 28 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 75824 | 75834 | 11 | `computeYearTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75835 | 75850 | 16 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 75851 | 75887 | 37 | `computeHeatmapData` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 75888 | 75902 | 15 | `determineFocusTopic` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 75903 | 75903 | 1 | `driver` | const arrow | — | refs:320 | Unassigned | `app/modules/app/unassigned.js` |
| 75904 | 75905 | 2 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 75906 | 75982 | 77 | `collision` | const arrow | — | refs:508 | Unassigned | `app/modules/app/unassigned.js` |
| 75983 | 76033 | 51 | `populateInfographicPage1` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76034 | 76034 | 1 | `fmtChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76035 | 76071 | 37 | `colorChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76072 | 76191 | 120 | `getHeatColor` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76192 | 76225 | 34 | `populateInfographicPage2` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76226 | 76273 | 48 | `formatChange` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76274 | 76283 | 10 | `showInfographicPage` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76284 | 76294 | 11 | `resetInfographicDefaults` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76295 | 76339 | 45 | `downloadInfographicPNG` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76340 | 76397 | 58 | `downloadInfographicPDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76398 | 76409 | 12 | `generateComprehensiveReport` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76410 | 76565 | 156 | `updateProgress` | const arrow | — | refs:60 | Unassigned | `app/modules/app/unassigned.js` |
| 76566 | 76571 | 6 | `computeCollisionBreakdown` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76572 | 76579 | 8 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76580 | 76590 | 11 | `computeMonthlyTrends` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76591 | 76597 | 7 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76598 | 76615 | 18 | `computeDayOfWeekAnalysis` | fn | — | refs:2 | Analysis | `app/modules/analysis/analysis.js` |
| 76616 | 76622 | 7 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76623 | 76633 | 11 | `computeHourlyDistribution` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76634 | 76640 | 7 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76641 | 76646 | 6 | `computeWeatherImpact` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76647 | 76654 | 8 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76655 | 76660 | 6 | `computeLightConditions` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76661 | 76668 | 8 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76669 | 76675 | 7 | `computeVulnerableUserAnalysis` | fn | — | refs:1 | Analysis | `app/modules/analysis/analysis.js` |
| 76676 | 76719 | 44 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76720 | 76737 | 18 | `computeDayHourMatrix` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76738 | 76760 | 23 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76761 | 76784 | 24 | `computeYoYComparison` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76785 | 76827 | 43 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 76828 | 76830 | 3 | `calcChange` | const arrow | — | refs:11 | Unassigned | `app/modules/app/unassigned.js` |
| 76831 | 76837 | 7 | `formatPeriod` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76838 | 76866 | 29 | `getQuarterName` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 76867 | 76873 | 7 | `generateDataInsight` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76874 | 76891 | 18 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 76892 | 76900 | 9 | `darkPct` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 76901 | 76916 | 16 | `sanitizeTextForExport` | fn | — | refs:23 | Unassigned | `app/modules/app/unassigned.js` |
| 76917 | 76923 | 7 | `formatCollisionType` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 76924 | 76936 | 13 | `isValidLocationCode` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 76937 | 76950 | 14 | `calculateLocationCoverage` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76951 | 76963 | 13 | `computeLocationDetails` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 76964 | 77015 | 52 | `generateAISectionInsight` | async fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 77016 | 77041 | 26 | `renderComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77042 | 77051 | 10 | `generateSeverityBar` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77052 | 77057 | 6 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 77058 | 77065 | 8 | `trendIndicator` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77066 | 77072 | 7 | `formatHour` | const arrow | — | refs:19 | Unassigned | `app/modules/app/unassigned.js` |
| 77073 | 77082 | 10 | `getHeatColor` | const arrow | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 77083 | 77120 | 38 | `generateDayHourMatrix` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77121 | 77123 | 3 | `generateCollisionBars` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77124 | 77146 | 23 | `barWidth` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 77147 | 77149 | 3 | `generateLocationCards` | const arrow | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77150 | 77200 | 51 | `barWidth` | const arrow | — | refs:36 | Unassigned | `app/modules/app/unassigned.js` |
| 77201 | 77201 | 1 | `validateEPDO` | const arrow | — | refs:1 | Core/EPDO | `app/modules/core/epdo-presets.js` |
| 77202 | 77550 | 349 | `computed` | const arrow | — | refs:29 | Unassigned | `app/modules/app/unassigned.js` |
| 77551 | 77560 | 10 | `renderComprehensiveTOC` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77561 | 77583 | 23 | `downloadComprehensivePDF` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 77584 | 77600 | 17 | `addText` | const arrow | — | refs:171 | Unassigned | `app/modules/app/unassigned.js` |
| 77601 | 77601 | 1 | `addSpacer` | const arrow | — | refs:112 | Unassigned | `app/modules/app/unassigned.js` |
| 77602 | 77604 | 3 | `newPage` | const arrow | — | refs:46 | Unassigned | `app/modules/app/unassigned.js` |
| 77605 | 77639 | 35 | `addPageFooter` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77640 | 77642 | 3 | `fmtHour` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77643 | 77651 | 9 | `addBar` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 77652 | 77883 | 232 | `addLabeledBar` | const arrow | — | refs:0 | Unassigned | `app/modules/app/unassigned.js` |
| 77884 | 77928 | 45 | `pctOfTotal` | const arrow | — | refs:6 | Unassigned | `app/modules/app/unassigned.js` |
| 77929 | 77944 | 16 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 77945 | 77953 | 9 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 77954 | 77959 | 6 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 77960 | 78119 | 160 | `pct` | const arrow | — | refs:742 | Unassigned | `app/modules/app/unassigned.js` |
| 78120 | 78128 | 9 | `hexToRgb` | fn | — | refs:33 | Unassigned | `app/modules/app/unassigned.js` |
| 78129 | 78142 | 14 | `downloadComprehensiveWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78143 | 78452 | 310 | `fmtHour` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 78453 | 78567 | 115 | `printComprehensivePreview` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78568 | 78573 | 6 | `generateCountermeasuresReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 78574 | 78609 | 36 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 78610 | 78612 | 3 | `light` | const arrow | — | refs:1995 | Unassigned | `app/modules/app/unassigned.js` |
| 78613 | 78804 | 192 | `surface` | const arrow | — | refs:402 | Unassigned | `app/modules/app/unassigned.js` |
| 78805 | 78808 | 4 | `generateIntersectionReport` | fn | — | refs:1 | Intersections | `app/modules/intersection/intersection.js` |
| 78809 | 78834 | 26 | `generateHotspotReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 78835 | 78840 | 6 | `generateDashboardReport` | fn | — | refs:2 | Dashboard | `app/modules/dashboard/dashboard.js` |
| 78841 | 78860 | 20 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 78861 | 78861 | 1 | `nightCount` | const arrow | — | refs:55 | Unassigned | `app/modules/app/unassigned.js` |
| 78862 | 78922 | 61 | `speedCount` | const arrow | — | refs:82 | Unassigned | `app/modules/app/unassigned.js` |
| 78923 | 78994 | 72 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 78995 | 79000 | 6 | `generateCrashTreeSystemicReport` | fn | — | refs:1 | Crash Tree | `app/modules/crash-tree/crash-tree.js` |
| 79001 | 79028 | 28 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 79029 | 79050 | 22 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 79051 | 79103 | 53 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 79104 | 79134 | 31 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 79135 | 79140 | 6 | `generateFatalSpeedReport` | async fn | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79141 | 79274 | 134 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 79275 | 79390 | 116 | `_topFatalRows` | const arrow | — | refs:1 | Fatal & Speeding | `app/modules/fatal-speeding/fatal-speeding.js` |
| 79391 | 79396 | 6 | `generateHotspotRankingReport` | fn | — | refs:1 | Hot Spots | `app/modules/hotspots/hotspots.js` |
| 79397 | 79415 | 19 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 79416 | 79494 | 79 | `s` | const arrow | — | refs:460919 | Unassigned | `app/modules/app/unassigned.js` |
| 79495 | 79499 | 5 | `generateBeforeAfterStudyReport` | fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79500 | 79504 | 5 | `fmtBA` | const arrow | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79505 | 79518 | 14 | `parseBALocal` | const arrow | — | refs:4 | Unassigned | `app/modules/app/unassigned.js` |
| 79519 | 79630 | 112 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 79631 | 79636 | 6 | `generateGrantSupportReport` | fn | — | refs:1 | Grants | `app/modules/grants/grants.js` |
| 79637 | 79755 | 119 | `yearRange` | const arrow | — | refs:110 | Unassigned | `app/modules/app/unassigned.js` |
| 79756 | 79804 | 49 | `downloadReportWord` | async fn | — | refs:1 | Unassigned | `app/modules/app/unassigned.js` |
| 79805 | 79857 | 53 | `buildMemoHeader` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
| 79858 | 79914 | 57 | `buildMemoStatsTable` | fn | — | refs:3 | Unassigned | `app/modules/app/unassigned.js` |
| 79915 | 79927 | 13 | `buildMemoFindings` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79928 | 79936 | 9 | `buildMemoLocationsTable` | fn | — | refs:2 | Unassigned | `app/modules/app/unassigned.js` |
| 79937 | 79996 | 60 | `sev` | const arrow | — | refs:8769 | Unassigned | `app/modules/app/unassigned.js` |
| 79997 | 80030 | 34 | `buildMemoFooter` | fn | — | refs:5 | Unassigned | `app/modules/app/unassigned.js` |
