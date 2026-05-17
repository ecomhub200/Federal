# Stage A Conversion 19 — `app/modules/warrants/signal-tmc.js` IIFE → ESM

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

- **Module:** `app/modules/warrants/signal-tmc.js`
- **CL namespace:** `warrants/signal-tmc`
- **Baseline size (IIFE era):** 902 lines (re-snapshot before editing)

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/warrants/signal-tmc.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/warrants/signal-tmc.js` passes (pre-state).
- [ ] `wc -l app/modules/warrants/signal-tmc.js` snapshotted (expect ~902).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.warrants.*` or
   `window.*` (public API). Leave module-private helpers unexported.

### Imports to ADD (top of file)
_None — leaf module (no cross-module `CL.*` reads)._ If the post-01–46
re-scan finds new cross-module reads, add the matching
`import { … } from '<rel>/<file>.js';` per `STAGE_A_IMPORT_GRAPH.md`.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
KEEP exactly these, grouped under a legacy comment at the bottom:
- `window.signal_addCurrentDay = signal_addCurrentDay;`
- `window.signal_autoPopulateW4MajorVolumes = signal_autoPopulateW4MajorVolumes;`
- `window.signal_clearAIUploads = signal_clearAIUploads;`
- `window.signal_clearAll = signal_clearAll;`
- `window.signal_clearTMCForm = signal_clearTMCForm;`
- `window.signal_saveData = signal_saveData;`
- `window.signal_selectAveragingMethod = signal_selectAveragingMethod;`
- `window.signal_setCountType = signal_setCountType;`
- `window.signal_toggleAIPanel = signal_toggleAIPanel;`
- `window.signal_toggleDisclaimer = signal_toggleDisclaimer;`
Delete EVERY OTHER `window.*` line (consumers `import` instead).

4. Keep transitional `CL.warrants = CL.warrants || {}; CL.warrants.X = X;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('warrants/signal-tmc');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`). Do **not** touch `app/index.html`
  script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/warrants/signal-tmc.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/warrants/signal-tmc.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: warrants/signal-tmc`
      prints; any onclick this module owns still fires.

## §4 Rollback
```bash
git checkout -- app/modules/warrants/signal-tmc.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
