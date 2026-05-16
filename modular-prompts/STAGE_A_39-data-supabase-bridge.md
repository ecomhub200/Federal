# Stage A Conversion 39 — `app/modules/data/supabase-bridge.js` IIFE → ESM

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

- **Module:** `app/modules/data/supabase-bridge.js`
- **CL namespace:** `data/supabase-bridge`
- **Baseline size (IIFE era):** 1104 lines (re-snapshot before editing)

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/data/supabase-bridge.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/data/supabase-bridge.js` passes (pre-state).
- [ ] `wc -l app/modules/data/supabase-bridge.js` snapshotted (expect ~1104).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.data.*` or
   `window.*` (public API). Leave module-private helpers unexported.

### Imports to ADD (top of file)
```js
import { /* constants */ } from '../core/constants.js';
import { /* skeletons */ } from '../ui/skeletons.js';
import { /* tierUI */ } from '../upload/upload-tier-ui.js';
```
Replace each former `CL.<root>.<member>` *read* with the bare imported
name. **Singleton slots** (`CL.data.client/.supabaseBridge/.mapBridge/`
`.lazyLoader`) stay as runtime `CL.*` reads — do NOT import them.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module owns **no** onclick survivor → **delete ALL `window.*`
lines**. Consumers `import { … }` the members instead.

4. Keep transitional `CL.data = CL.data || {}; CL.data.X = X;`
   writes + the `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('data/supabase-bridge');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_54)
- Add this module to `app/main.js` at its topo position (see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`). Do **not** touch `app/index.html`
  script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/data/supabase-bridge.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/data/supabase-bridge.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_54-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: data/supabase-bridge`
      prints; any onclick this module owns still fires.

## §4 Rollback
```bash
git checkout -- app/modules/data/supabase-bridge.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
