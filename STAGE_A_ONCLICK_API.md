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

> **Re-scan before executing Stage A.** This was generated against the
> IIFE-era tree. Remaining extraction prompts (01–46) will move more
> onclick-bound functions into modules. Re-run the scan
> (`grep -rhoE 'onclick=\\?"<fn>\(' app/index.html app/modules`) against
> the final tree and extend the table. **Treat 25 as a floor, not a
> ceiling.** Also scan `addEventListener`-free inline `on*=` attributes
> beyond `onclick` (`onchange`, `oninput`, `onsubmit`) the same way — if
> any resolve to a module function, add it here.

## Survivor set (25 confirmed)

`src` = where the handler lives: `index.html:N` (static attribute) or
`module.js:N` (string built in JS, injected via innerHTML/template).

| # | `window.*` fn | Owning module | refs (idx.html / module) | Example site |
|---|---|---|---|---|
| 1 | `assetExportKML` | assets/asset-export.js | 1 / 0 | `index.html:8198 onclick="assetExportKML();hideAssetExportMenu()"` |
| 2 | `assetExportPDF` | assets/asset-export.js | 1 / 0 | `index.html:8200 onclick="assetExportPDF();hideAssetExportMenu()"` |
| 3 | `exportScorecardCSV` | scorecard/scorecard.js | 1 / 0 | `index.html:19070 onclick="exportScorecardCSV()"` |
| 4 | `handleTierChange` | core/tier.js | 7 / 0 | `index.html:4809 onclick="handleTierChange('federal')"` |
| 5 | `navigateTo` | app/tab-dispatcher.js | 18 / 0 | `index.html:4597 onclick="navigateTo('upload')"` |
| 6 | `resetScorecardPins` | scorecard/scorecard.js | 1 / 0 | `index.html:19069 onclick="resetScorecardPins()"` |
| 7 | `schoolTabClearSchools` | assets/school-tab.js | 1 / 0 | `index.html:150322 onclick="schoolTabClearSchools()"` |
| 8 | `schoolTabViewOnMapSingle` | assets/school-tab.js | 0 / 1 | `school-tab.js:157 onclick="schoolTabViewOnMapSingle(${lat}, ${lng})"` |
| 9 | `showTab` | app/tab-dispatcher.js* | 4 / 0 | `index.html:68336 onclick="showTab('cmf')"` |
| 10 | `signal_addCurrentDay` | warrants/signal-tmc.js | 1 / 0 | `index.html:16218 onclick="signal_addCurrentDay()"` |
| 11 | `signal_autoPopulateW4MajorVolumes` | warrants/signal-tmc.js | 1 / 0 | `index.html:16355` |
| 12 | `signal_clearAIUploads` | warrants/signal-tmc.js | 1 / 0 | `index.html:16496` |
| 13 | `signal_clearAll` | warrants/signal-tmc.js | 1 / 0 | `index.html:16503` |
| 14 | `signal_clearTMCForm` | warrants/signal-tmc.js | 2 / 0 | `index.html:16221` |
| 15 | `signal_saveData` | warrants/signal-tmc.js | 1 / 0 | `index.html:16484` |
| 16 | `signal_selectAveragingMethod` | warrants/signal-tmc.js | 4 / 0 | `index.html:16238` |
| 17 | `signal_setCountType` | warrants/signal-tmc.js | 2 / 0 | `index.html:16157` |
| 18 | `signal_toggleAIPanel` | warrants/signal-tmc.js | 1 / 0 | `index.html:15866` |
| 19 | `signal_toggleDisclaimer` | warrants/signal-tmc.js | 1 / 0 | `index.html:15920` |
| 20 | `toggleAssetExportMenu` | assets/asset-export.js | 1 / 0 | `index.html:8195` |
| 21 | `toggleEPDOSection` | core/epdo-presets.js | 1 / 0 | `index.html:4923` |
| 22 | `transitLoadStopsForTier` | assets/transit-tab.js | 1 / 0 | `index.html:6930` |
| 23 | `transitTabClearStops` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:562` |
| 24 | `transitTabLoadStops` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:585` |
| 25 | `transitTabViewOnMapSingle` | assets/transit-tab.js | 0 / 1 | `transit-tab.js:707 onclick="transitTabViewOnMapSingle(${r.lat||0}, ${r.lng||0})"` |

\* `showTab`/`navigateTo` are also mirrored on `window` by
`data/chunk-loader.js`; the canonical owner per `CLAUDE.md` is
`app/tab-dispatcher.js`. Keep the `window.showTab` / `window.navigateTo`
write in **tab-dispatcher** and drop the duplicate mirror from
chunk-loader during conversion (or keep both transitionally — they assign
the same reference).

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

`assets/asset-export.js`, `assets/school-tab.js`, `assets/transit-tab.js`,
`scorecard/scorecard.js`, `core/tier.js`, `core/epdo-presets.js`,
`app/tab-dispatcher.js`, `data/chunk-loader.js` (mirror — see note),
`warrants/signal-tmc.js`.

All other modules drop **all** `window.*` writes on conversion.
