# Stage A Conversion 57 — `app/modules/grants/grants-ui.js` IIFE → ESM

> Read `STAGE_A_CONVERSION_TEMPLATE.md`, `STAGE_A_ONCLICK_API.md`, and
> `STAGE_A_IMPORT_GRAPH.md` in full before editing. Apply the canonical
> transformation exactly — **no behavior change, no reformatting**.
>
> ⚠️ **Stage A is ONE coordinated cutover, not one-ship-per-session.** A
> file containing `export` cannot load via a classic `<script src>`
> (`Unexpected token 'export'`). Convert on the Stage A branch and DO NOT
> ship/verify in isolation — the app only runs again after
> `STAGE_A_62-cutover` swaps the script tags. Per-file `node --check` is
> the only standalone gate here.

- **Module:** `app/modules/grants/grants-ui.js`
- **CL namespace:** `grants/grants-ui` (CL key `CL.grants.ui`)
- **Baseline size (IIFE era):** 2,267 lines (re-snapshot before editing) —
  documented oversized exception (verbatim 2,185-line grants block + grow).
- **Post-snapshot module** (IIFE prompt 30) — folded into the Session K
  design docs. Owns the **largest onclick-survivor surface** (19 fns).

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/grants/grants-ui.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/grants/grants-ui.js` passes (pre-state).
- [ ] `wc -l app/modules/grants/grants-ui.js` snapshotted (expect ~2267).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.grants.ui.*` or
   `window.*` (public API). Leave module-private helpers unexported.

### Imports to ADD (top of file)
_None as static module edges._ `grants-ui` reads `CL.grants.*` helpers
(`updateGrantProgramUI`, `scrollToGrantSearch`, `runGrant*`,
`populateGrantProgramDropdown`, `getGrantAISystemPrompt`) that are **still
inline `app/index.html` globals** — IIFE prompts 27/28/29 never ran, so
those helpers + `grantState` stay inline/global per `CLAUDE.md`. **Keep
them as runtime `CL.grants.*` reads — do NOT `import`** (no owning module
at module-eval time). See `STAGE_A_IMPORT_GRAPH.md` "still-inline globals".
If the post-01–46 re-scan shows Item 1 extracted any of these into a
module, promote that read to a real `import` then.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module **owns 19 onclick survivors** → keep exactly these under the
legacy comment block; **delete every other `window.*` line** (37 window
names total, 19 survive; consumers `import` instead):
```js
// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.closeHelpModal = closeHelpModal;
window.closeNewAppModal = closeNewAppModal;
window.deleteApplication = deleteApplication;
window.download4AgentApplicationPDF = download4AgentApplicationPDF;
window.download4AgentApplicationWord = download4AgentApplicationWord;
window.exportAllApplications = exportAllApplications;
window.exportSingleApplication = exportSingleApplication;
window.helpNavigateTo = helpNavigateTo;
window.openNewAppModal = openNewAppModal;
window.runFullAnalysis = runFullAnalysis;
window.saveNewApplication = saveNewApplication;
window.scrollToGrantSearch = scrollToGrantSearch;
window.scrollToWritingAssistant = scrollToWritingAssistant;
window.showHelpModal = showHelpModal;
window.showHowTo = showHowTo;
window.switchHelpTab = switchHelpTab;
window.toggleConceptCard = toggleConceptCard;
window.updateAppStatus = updateAppStatus;
window.updateGrantProgramUI = updateGrantProgramUI;
```

4. Keep transitional `CL.grants = CL.grants || {}; CL.grants.ui = …;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('grants/grants-ui');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (L1 — leaf re
  static edges; reads inline `CL.grants.*` at runtime; see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`, already listed). Do **not** touch
  `app/index.html` script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/grants/grants-ui.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/grants/grants-ui.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: grants/grants-ui`
      prints; the 19 onclick survivors (application/help modals, grant
      program dropdown, 4-agent analysis, exports) all fire.

## §4 Rollback
```bash
git checkout -- app/modules/grants/grants-ui.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
