# Stage A Conversion 60 — `app/modules/reports/reports-standard-core.js` IIFE → ESM

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

- **Module:** `app/modules/reports/reports-standard-core.js`
- **CL namespace:** `reports/reports-standard-core` (CL key `CL.reports.standardCore`)
- **Baseline size (IIFE era):** 804 lines (re-snapshot before editing) —
  documented oversized exception (Standard Reports band, prompt 42b1).
- **Post-snapshot module** — base of the `reports/*core*` mini-cluster
  (`reports-standard-core2` imports from this file). Folded into the
  Session K design docs.

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/reports/reports-standard-core.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/reports/reports-standard-core.js` passes (pre-state).
- [ ] `wc -l app/modules/reports/reports-standard-core.js` snapshotted (expect ~804).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.reports.standardCore.*`
   or `window.*` (public API). **`reports-standard-core2.js` imports from
   this file** — make sure each member it reads is exported by name. Leave
   module-private helpers unexported.

### Imports to ADD (top of file)
_None as static module edges._ This file reads the
`CL.data.supabaseBridge` **singleton slot** at runtime — **keep that as a
plain `CL.data.supabaseBridge` read, do NOT `import`** (the instance does
not exist at module-eval time; see `STAGE_A_IMPORT_GRAPH.md` singleton
rule). If the post-01–46 re-scan finds new static cross-module reads, add
the matching `import { … } from '<rel>/<file>.js';`.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module **owns onclick survivors** → keep exactly these under the
legacy comment block; **delete every other `window.*` line** (13 window
names total, 3 survive; consumers `import` instead):
```js
// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.generateReport = generateReport;
window.showReportSubTab = showReportSubTab;
window.updateReportOptions = updateReportOptions;
```

4. Keep transitional `CL.reports = CL.reports || {}; CL.reports.standardCore = …;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('reports/reports-standard-core');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (L1/L2 base of the
  core cluster; singleton-slot runtime reader — see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`, already listed). Do **not** touch
  `app/index.html` script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/reports/reports-standard-core.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/reports/reports-standard-core.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named` (esp. from `reports-standard-core2`);
      `[CL] Module loaded: reports/reports-standard-core` prints; the 3
      onclick survivors (generate report / sub-tab / options) fire.

## §4 Rollback
```bash
git checkout -- app/modules/reports/reports-standard-core.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
