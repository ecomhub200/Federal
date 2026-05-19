# Stage A — Onclick API (the `window.*` survivor set)

ES modules execute in their own scope. A function declared in an ESM
module is **not** on `window`, so any HTML `onclick="fn()"` (static in
`app/index.html` or built as a string inside a module and injected via
`innerHTML`) breaks unless the module still does an explicit
`window.fn = fn`.

This file is the authoritative list of module-owned `window.*` functions
that **must keep their `window.*` exposure** after IIFE → ESM conversion.
Every other `window.*` write in a module is dropped (consumers `import`
instead).

> **Regenerated Session K (2026-05-17)** against the live 61-module tree.
> The survivor floor grew **25 → 72** as post-snapshot modules
> (`grants/grants-ui`, `spatial/geo-tier`, `ai/ai-mode-toggle`,
> `map/map-layers`, `reports/reports-standard-*`) landed and the
> `onchange/oninput/onsubmit` scan was folded in. **Re-scan again before
> executing Stage A** — remaining IIFE prompts (01–46, Item 1) will move
> still more onclick-bound functions into modules. Re-run:
> ```
> grep -rhoE 'on(click|change|input|submit)="[a-zA-Z_][a-zA-Z0-9_]*\(' app/index.html app/modules \
>   | sed -E 's/.*"([a-zA-Z_][a-zA-Z0-9_]*)\(/\1/' | sort -u
> ```
> against the final tree and extend the table. **Treat 72 as a floor, not
> a ceiling.** `onsubmit` produced zero module-owned hits.

## Survivor set (72 confirmed)

`refs (idx.html / module)` = count of on\* attributes resolving to this
function in `app/index.html` vs in JS-injected module HTML.
`Example site` = first occurrence (`(JS-injected)` = string built in JS
and injected via innerHTML/template).

| # | `window.*` fn | Owning module | refs (idx.html / module) | Example site |
|---|---|---|---|---|
| 1 | `assetExportKML` | assets/asset-export.js | 1 / 0 | `index.html:8206 onclick="assetExportKML();hideAssetExportMenu()` |
| 2 | `assetExportPDF` | assets/asset-export.js | 1 / 0 | `index.html:8208 onclick="assetExportPDF();hideAssetExportMenu()` |
| 3 | `clearHeaderApiKey` | ai/ai-mode-toggle.js | 1 / 0 | `index.html:4536 onclick="clearHeaderApiKey()` |
| 4 | `clearMapAddressSearch` | map/map-layers.js | 1 / 0 | `index.html:6016 onclick="clearMapAddressSearch()` |
| 5 | `closeHelpModal` | grants/grants-ui.js | 5 / 0 | `index.html:18152 onclick="closeHelpModal()` |
| 6 | `closeNewAppModal` | grants/grants-ui.js | 2 / 0 | `index.html:18105 onclick="closeNewAppModal()` |
| 7 | `deleteApplication` | grants/grants-ui.js | 0 / 1 | `grants-ui.js:718 (JS-injected)` |
| 8 | `download4AgentApplicationPDF` | grants/grants-ui.js | 1 / 0 | `index.html:12159 onclick="download4AgentApplicationPDF()` |
| 9 | `download4AgentApplicationWord` | grants/grants-ui.js | 1 / 0 | `index.html:12162 onclick="download4AgentApplicationWord()` |
| 10 | `exportAllApplications` | grants/grants-ui.js | 1 / 0 | `index.html:12194 onclick="exportAllApplications()` |
| 11 | `exportScorecardCSV` | scorecard/scorecard.js | 1 / 0 | `index.html:19078 onclick="exportScorecardCSV()` |
| 12 | `exportSingleApplication` | grants/grants-ui.js | 0 / 1 | `grants-ui.js:717 (JS-injected)` |
| 13 | `generateReport` | reports/reports-standard-core.js | 1 / 0 | `index.html:9653 onclick="generateReport()` |
| 14 | `handleCitySelection` | spatial/geo-tier.js | 1 / 0 | `index.html:4853 onchange="handleCitySelection()` |
| 15 | `handleCountySelection` | spatial/geo-tier.js | 1 / 0 | `index.html:4847 onchange="handleCountySelection()` |
| 16 | `handleMPOSelection` | spatial/geo-tier.js | 1 / 0 | `index.html:4835 onchange="handleMPOSelection()` |
| 17 | `handlePlanningDistrictSelection` | spatial/geo-tier.js | 1 / 0 | `index.html:4841 onchange="handlePlanningDistrictSelection()` |
| 18 | `handleRegionSelection` | spatial/geo-tier.js | 1 / 0 | `index.html:4829 onchange="handleRegionSelection()` |
| 19 | `handleTierChange` | core/tier.js | 7 / 0 | `index.html:4817 onclick="handleTierChange('federal')` |
| 20 | `helpNavigateTo` | grants/grants-ui.js | 21 / 0 | `index.html:18183 onclick="helpNavigateTo('upload')` |
| 21 | `loadEPDOPreset` | core/epdo-presets.js | 5 / 0 | `index.html:4939 onchange="loadEPDOPreset('stateDefault')` |
| 22 | `loadScorecardData` | scorecard/scorecard.js | 3 / 0 | `index.html:19025 onchange="loadScorecardData()` |
| 23 | `navigateTo` | app/tab-dispatcher.js | 18 / 0 | `index.html:4605 onclick="navigateTo('upload')` |
| 24 | `onScorecardModeChange` | scorecard/scorecard.js | 1 / 0 | `index.html:19029 onchange="onScorecardModeChange()` |
| 25 | `openNewAppModal` | grants/grants-ui.js | 1 / 0 | `index.html:12193 onclick="openNewAppModal()` |
| 26 | `renderScorecardTable` | scorecard/scorecard.js | 2 / 0 | `index.html:19050 onchange="renderScorecardTable(_scorecardData)` |
| 27 | `resetScorecardPins` | scorecard/scorecard.js | 1 / 0 | `index.html:19077 onclick="resetScorecardPins()` |
| 28 | `runFullAnalysis` | grants/grants-ui.js | 1 / 0 | `index.html:11891 onclick="runFullAnalysis()` |
| 29 | `saveCustomEPDOWeights` | core/epdo-presets.js | 5 / 0 | `index.html:4963 onchange="saveCustomEPDOWeights()` |
| 30 | `saveHeaderApiKey` | ai/ai-mode-toggle.js | 1 / 0 | `index.html:4535 onclick="saveHeaderApiKey()` |
| 31 | `saveNewApplication` | grants/grants-ui.js | 1 / 0 | `index.html:18140 onclick="saveNewApplication()` |
| 32 | `schoolTabClearSchools` | assets/school-tab.js | 1 / 0 | `index.html:143870 onclick="schoolTabClearSchools()` |
| 33 | `schoolTabViewOnMapSingle` | assets/school-tab.js | 0 / 1 | `school-tab.js:157 (JS-injected)` |
| 34 | `scrollToGrantSearch` | grants/grants-ui.js | 2 / 0 | `index.html:11893 onclick="scrollToGrantSearch()` |
| 35 | `scrollToWritingAssistant` | grants/grants-ui.js | 2 / 0 | `index.html:11894 onclick="scrollToWritingAssistant()` |
| 36 | `selectAddressResult` | map/map-layers.js | 1 / 0 | `index.html:46231 onclick="selectAddressResult(${addr.lat}, ${addr.lng}, …` |
| 37 | `showHelpModal` | grants/grants-ui.js | 2 / 0 | `index.html:4567 onclick="showHelpModal()` |
| 38 | `showHowTo` | grants/grants-ui.js | 26 / 0 | `index.html:18704 onclick="showHowTo('hotspots')` |
| 39 | `showReportSubTab` | reports/reports-standard-core.js | 2 / 0 | `index.html:9590 onclick="showReportSubTab('standard')` |
| 40 | `showTab` | app/tab-dispatcher.js\* | 0 / 4 | `reports-standard-core.js:64 (JS-injected)` |
| 41 | `showTab` | data/chunk-loader.js\* | 0 / 4 | `reports-standard-core.js:64 (JS-injected)` |
| 42 | `signal_addCurrentDay` | warrants/signal-tmc.js | 1 / 0 | `index.html:16226 onclick="signal_addCurrentDay()` |
| 43 | `signal_autoPopulateW4MajorVolumes` | warrants/signal-tmc.js | 1 / 0 | `index.html:16363 onclick="signal_autoPopulateW4MajorVolumes()` |
| 44 | `signal_clearAIUploads` | warrants/signal-tmc.js | 1 / 0 | `index.html:16504 onclick="signal_clearAIUploads();closeClearActionsMenu('signal')` |
| 45 | `signal_clearAll` | warrants/signal-tmc.js | 1 / 0 | `index.html:16511 onclick="signal_clearAll();closeClearActionsMenu('signal')` |
| 46 | `signal_clearTMCForm` | warrants/signal-tmc.js | 2 / 0 | `index.html:16229 onclick="signal_clearTMCForm()` |
| 47 | `signal_handleDisclaimerCheckbox` | warrants/signal-tmc.js | 1 / 0 | `index.html:15985 onchange="signal_handleDisclaimerCheckbox()` |
| 48 | `signal_markTotalManual` | warrants/signal-tmc.js | 0 / 1 | `signal-tmc.js:441 (JS-injected)` |
| 49 | `signal_saveData` | warrants/signal-tmc.js | 1 / 0 | `index.html:16492 onclick="signal_saveData()` |
| 50 | `signal_selectAveragingMethod` | warrants/signal-tmc.js | 4 / 0 | `index.html:16246 onclick="signal_selectAveragingMethod('tue-wed-thu')` |
| 51 | `signal_setCountType` | warrants/signal-tmc.js | 3 / 0 | `index.html:15890 onchange="signal_setCountType(this.value)` |
| 52 | `signal_toggleAIPanel` | warrants/signal-tmc.js | 1 / 0 | `index.html:15874 onclick="signal_toggleAIPanel()` |
| 53 | `signal_toggleDisclaimer` | warrants/signal-tmc.js | 1 / 0 | `index.html:15928 onclick="signal_toggleDisclaimer()` |
| 54 | `signal_toggleExportButtons` | warrants/signal-tmc.js | 1 / 0 | `index.html:115818 onchange="signal_toggleExportButtons()` |
| 55 | `signal_toggleWarrant7` | warrants/signal-tmc.js | 1 / 0 | `index.html:16437 onchange="signal_toggleWarrant7()` |
| 56 | `signal_toggleWeekendAnalysis` | warrants/signal-tmc.js | 1 / 0 | `index.html:16264 onchange="signal_toggleWeekendAnalysis(this.checked)` |
| 57 | `signal_updateDaySlots` | warrants/signal-tmc.js | 1 / 0 | `index.html:15897 onchange="signal_updateDaySlots()` |
| 58 | `signal_updateRowTotal` | warrants/signal-tmc.js | 0 / 2 | `signal-tmc.js:425 (JS-injected)` |
| 59 | `switchHelpTab` | grants/grants-ui.js | 5 / 0 | `index.html:18158 onclick="switchHelpTab('quickstart')` |
| 60 | `toggleAIMode` | ai/ai-mode-toggle.js | 1 / 0 | `index.html:4524 onclick="toggleAIMode()` |
| 61 | `toggleAssetExportMenu` | assets/asset-export.js | 1 / 0 | `index.html:8203 onclick="toggleAssetExportMenu()` |
| 62 | `toggleConceptCard` | grants/grants-ui.js | 3 / 0 | `index.html:18307 onclick="toggleConceptCard(this)` |
| 63 | `toggleEPDOSection` | core/epdo-presets.js | 1 / 0 | `index.html:4931 onclick="toggleEPDOSection()` |
| 64 | `transitLoadStopsForTier` | assets/transit-tab.js | 1 / 0 | `index.html:6938 onclick="transitLoadStopsForTier()` |
| 65 | `transitTabClearStops` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:562 (JS-injected)` |
| 66 | `transitTabLoadStops` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:585 (JS-injected)` |
| 67 | `transitTabViewOnMapSingle` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:707 (JS-injected)` |
| 68 | `updateAppStatus` | grants/grants-ui.js | 0 / 1 | `grants-ui.js:709 (JS-injected)` |
| 69 | `updateGrantProgramUI` | grants/grants-ui.js | 1 / 0 | `index.html:12108 onchange="updateGrantProgramUI()` |
| 70 | `updateHeaderProviderLink` | ai/ai-mode-toggle.js | 1 / 0 | `index.html:4530 onchange="updateHeaderProviderLink()` |
| 71 | `updateReportOptions` | reports/reports-standard-core.js | 1 / 0 | `index.html:9600 onchange="updateReportOptions()` |
| 72 | `updateScorecardChart` | scorecard/scorecard.js | 1 / 0 | `index.html:19096 onchange="updateScorecardChart()` |

\* `showTab`/`navigateTo` are mirrored on `window` by both
`app/tab-dispatcher.js` (canonical owner per `CLAUDE.md`) and
`data/chunk-loader.js`. Keep the `window.showTab` / `window.navigateTo`
write in **tab-dispatcher**; the chunk-loader mirror may be kept
transitionally (same reference) or dropped during its conversion.

## ⚠️ Watch list — onclick fns NOT yet module-isolated (pre-Item-1)

These 5 on\*-bound functions exist as `function NAME(){…}` in a module's
exposure block (via `CL.*.NAME`) **but are still also defined inline in
`app/index.html`**, which is what the live handler resolves to today (the
inline copy will be deleted when the IIFE round / Item 1 completes). They
are **not** survivors yet — they become survivors the moment the inline
copy is removed, at which point the owning module MUST add `window.NAME`:

| fn | module copy | inline copy (deleted by Item 1) |
|---|---|---|
| `clearUserPreferences` | upload/upload-tab.js:468 | index.html:21948 |
| `forceRefreshAllData` | upload/upload-tab.js:514 | index.html:22000 |
| `saveFilterProfile` | upload/upload-tab.js:386 | index.html:21814 |
| `saveUserPreferences` | upload/upload-tab.js:418 | index.html:21898 |
| `handleFileSelect` | upload/upload-pipeline.js:329 | index.html:27442 |

The `STAGE_A_*` prompts for `upload/upload-tab` (38) and
`upload/upload-pipeline` (37) must add these to their KEEP list once Item 1
deletes the inline duplicates. Re-check this list on the post-Item-1 re-scan.

## Rule for the conversion prompts

In each module's `STAGE_A_*` prompt §1:

1. For a `window.X = X` line where **X is in this table** → keep exactly
   one such line, grouped at the bottom under a comment:
   ```js
   // --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
   window.assetExportKML = assetExportKML;
   ```
2. For a `window.X = X` line where **X is NOT in this table** → delete it.
   Consumers must `import { X }` instead (tracked in
   `STAGE_A_IMPORT_GRAPH.md`).
3. Never convert these onclick handlers to `addEventListener` in Stage A.
   That is an explicit follow-up (Stage A-cleanup), out of scope here.

## Modules owning ≥1 survivor (must retain a legacy block)

`ai/ai-mode-toggle.js`, `app/tab-dispatcher.js`, `assets/asset-export.js`,
`assets/school-tab.js`, `assets/transit-tab.js`, `core/epdo-presets.js`,
`core/tier.js`, `data/chunk-loader.js` (`showTab` mirror — see note),
`grants/grants-ui.js`, `map/map-layers.js`,
`reports/reports-standard-core.js`, `scorecard/scorecard.js`,
`spatial/geo-tier.js`, `warrants/signal-tmc.js` — **14 modules**.

All other modules drop **all** `window.*` writes on conversion.
