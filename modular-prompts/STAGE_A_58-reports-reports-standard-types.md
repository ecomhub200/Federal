# Stage A Conversion 58 — `app/modules/reports/reports-standard-types.js` IIFE → ESM

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

- **Module:** `app/modules/reports/reports-standard-types.js`
- **CL namespace:** `reports/reports-standard-types` (CL key `CL.reports.standardTypes`)
- **Baseline size (IIFE era):** 948 lines (re-snapshot before editing) —
  documented oversized exception (Standard Reports band, prompt 42b1).
- **Post-snapshot module** — base of the `reports/*types*` mini-cluster
  (`reports-standard-types2` imports from this file). Folded into the
  Session K design docs.

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/reports/reports-standard-types.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/reports/reports-standard-types.js` passes (pre-state).
- [ ] `wc -l app/modules/reports/reports-standard-types.js` snapshotted (expect ~948).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.reports.standardTypes.*`
   or `window.*` (public API). **`reports-standard-types2.js` imports from
   this file** — make sure each member it reads is exported by name. Leave
   the module-private `reportSequence` const unexported.

### Imports to ADD (top of file)
_None — base module of the types mini-cluster (no cross-module `CL.*`
reads)._ If the post-01–46 re-scan finds new cross-module reads, add the
matching `import { … } from '<rel>/<file>.js';` per
`STAGE_A_IMPORT_GRAPH.md`.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module owns **no** onclick survivor → **delete ALL `window.*`
lines**. Consumers (`reports-standard-types2`) `import { … }` the members
instead. If the post-01–46 re-scan finds an inline-`index.html`
`window.*`/on\* reader of any member, add it to the legacy block then
(FLOOR — extend, never shrink).

4. Keep transitional `CL.reports = CL.reports || {}; CL.reports.standardTypes = …;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('reports/reports-standard-types');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (L1 leaf, base of
  the types cluster — see `STAGE_A_MAIN_ENTRY_DRAFT.js`, already listed).
  Do **not** touch `app/index.html` script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/reports/reports-standard-types.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/reports/reports-standard-types.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named` (esp. from `reports-standard-types2`);
      `[CL] Module loaded: reports/reports-standard-types` prints; the
      Standard Reports band renders.

## §4 Rollback
```bash
git checkout -- app/modules/reports/reports-standard-types.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
