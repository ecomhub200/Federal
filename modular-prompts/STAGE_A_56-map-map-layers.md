# Stage A Conversion 56 — `app/modules/map/map-layers.js` IIFE → ESM

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

- **Module:** `app/modules/map/map-layers.js`
- **CL namespace:** `map/map-layers` (CL key `CL.map`)
- **Baseline size (IIFE era):** 304 lines (re-snapshot before editing)
- **Post-snapshot module** (IIFE Session G, map address search) — folded
  into the Session K design docs.

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/map/map-layers.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/map/map-layers.js` passes (pre-state).
- [ ] `wc -l app/modules/map/map-layers.js` snapshotted (expect ~304).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.map.*` or
   `window.*` (public API). Leave module-private helpers unexported.

### Imports to ADD (top of file)
_None — leaf module (only self `CL.map.*` reads)._ If the post-01–46
re-scan finds new cross-module reads, add the matching
`import { … } from '<rel>/<file>.js';` per `STAGE_A_IMPORT_GRAPH.md`.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module **owns onclick survivors** → keep these under the legacy
comment block:
```js
// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.clearMapAddressSearch = clearMapAddressSearch;
window.selectAddressResult = selectAddressResult;
```
**ALSO keep (shared-global rule — STAGE_A_CONVERSION_TEMPLATE.md "do NOT
move app-wide shared globals still read by inline code"):** per
`CLAUDE.md`, `getDistanceMeters` has 6 external inline `app/index.html`
callers and `updateMapSearchClearButton` has 2 — these are **not** onclick
survivors but ARE read by remaining inline code, so retain their
`window.*` mirror until the IIFE round removes those inline callers:
```js
window.getDistanceMeters = getDistanceMeters;
window.updateMapSearchClearButton = updateMapSearchClearButton;
```
Delete every **other** `window.*` line (consumers `import` instead).
Confirm the inline-caller counts on the post-01–46 re-scan; if Item 1 has
removed all inline callers of either fn, drop its mirror then.

4. Keep transitional `CL.map = CL.map || {}; CL.map.X = X;` writes + the
   `window.CL = window.CL || {};` guard (stripped in a later
   Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('map/map-layers');` (load tracker).

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (L1 leaf — see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`, already listed). Do **not** touch
  `app/index.html` script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/map/map-layers.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/map/map-layers.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: map/map-layers`
      prints; map address search (clear + select result) still fires and
      inline `getDistanceMeters` callers still resolve.

## §4 Rollback
```bash
git checkout -- app/modules/map/map-layers.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
