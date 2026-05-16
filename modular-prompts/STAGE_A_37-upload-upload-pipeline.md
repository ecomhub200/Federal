# Stage A Conversion 37 — `app/modules/upload/upload-pipeline.js` IIFE → ESM

> Read `STAGE_A_CONVERSION_TEMPLATE.md`, `STAGE_A_ONCLICK_API.md`, and
> `STAGE_A_IMPORT_GRAPH.md` in full before editing. Apply the canonical
> transformation exactly — **no behavior change, no reformatting**.
>
> ⚠️ **Stage A is ONE coordinated cutover, not one-ship-per-session.** A
> file containing `export` cannot load via a classic `<script src>`
> (`Unexpected token 'export'`). Convert on the Stage A branch and DO NOT
> ship/verify in isolation — the app only runs again after
> `STAGE_A_54-cutover` swaps the script tags. Per-file `node --check` is
> the only standalone gate here.

- **Module:** `app/modules/upload/upload-pipeline.js`
- **CL namespace:** `upload/upload-pipeline`
- **Baseline size (IIFE era):** 773 lines (re-snapshot before editing)

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/upload/upload-pipeline.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/upload/upload-pipeline.js` passes (pre-state).
- [ ] `wc -l app/modules/upload/upload-pipeline.js` snapshotted (expect ~773).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.upload.*` or
   `window.*` (public API). Leave module-private helpers unexported.

### Imports to ADD (top of file)
```js
import { /* constants */ } from '../core/constants.js';
```
Replace each former `CL.<root>.<member>` *read* with the bare imported
name. **Singleton slots** (`CL.data.client/.supabaseBridge/.mapBridge/`
`.lazyLoader`) stay as runtime `CL.*` reads — do NOT import them.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module owns **no** onclick survivor → **delete ALL `window.*`
lines**. Consumers `import { … }` the members instead.

4. Keep transitional `CL.upload = CL.upload || {}; CL.upload.X = X;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('upload/upload-pipeline');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_54)
- Add this module to `app/main.js` at its topo position (see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`). Do **not** touch `app/index.html`
  script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/upload/upload-pipeline.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/upload/upload-pipeline.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_54-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: upload/upload-pipeline`
      prints; any onclick this module owns still fires.

## §4 Rollback
```bash
git checkout -- app/modules/upload/upload-pipeline.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
