# Stage A Conversion 55 — `app/modules/spatial/geo-tier.js` IIFE → ESM

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

- **Module:** `app/modules/spatial/geo-tier.js`
- **CL namespace:** `spatial/geo-tier` (CL key `CL.spatial.geoTier`)
- **Baseline size (IIFE era):** 1,424 lines (re-snapshot before editing) —
  documented oversized exception (verbatim geo-tier block).
- **Post-snapshot module** (IIFE batch 4, geo-tier) — folded into the
  Session K design docs.

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `app/modules/spatial/geo-tier.js` currently uses the IIFE wrapper `(function(){ … })();`.
- [ ] `node --check app/modules/spatial/geo-tier.js` passes (pre-state).
- [ ] `wc -l app/modules/spatial/geo-tier.js` snapshotted (expect ~1424).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
1. Remove the outer `(function(){` … `})();` wrapper; de-indent body
   (whitespace only — no reflow).
2. Keep `'use strict';` at the top.
3. `export` every member previously assigned to `CL.spatial.geoTier.*` /
   `CL.spatial.*` or `window.*` (public API). Leave module-private state
   (e.g. `_geoDataCache`) unexported.

### Imports to ADD (top of file)
One real static edge:
```js
import { /* tierUI members read */ } from '../upload/upload-tier-ui.js';  // was CL.upload.tierUI.*
```
**Keep as runtime `CL.*` reads (NOT imports):**
`CL.data.supabaseBridge`, `CL.data.mapBridge`, `CL.data.lazyLoader`
(singleton slots) and `CL.geo.places` (still-inline global — no owning
module; IIFE round has not extracted it). See `STAGE_A_IMPORT_GRAPH.md`.

### `window.*` policy (see STAGE_A_ONCLICK_API.md)
This module **owns onclick survivors** → keep exactly these under the
legacy comment block; **delete every other `window.*` line** (the ~20
non-survivor mirrors; consumers `import` instead):
```js
// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.handleRegionSelection = handleRegionSelection;
window.handleMPOSelection = handleMPOSelection;
window.handlePlanningDistrictSelection = handlePlanningDistrictSelection;
window.handleCountySelection = handleCountySelection;
window.handleCitySelection = handleCitySelection;
```

4. Keep transitional `CL.spatial = CL.spatial || {}; CL.spatial.geoTier = …;`
   + `CL.spatial.<fn>` writes + the `window.CL = window.CL || {};` guard
   (stripped in a later Stage A-cleanup round, NOT here).
5. Keep `CL._registerModule('spatial/geo-tier');` (load tracker).
6. **Cycle/TDZ caution:** only reference the imported `upload-tier-ui`
   bindings inside function bodies called at runtime, never at module
   top-level evaluation.

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (L2 — one-hop on
  `upload/upload-tier-ui`; see `STAGE_A_MAIN_ENTRY_DRAFT.js`, already
  listed). Do **not** touch `app/index.html` script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/spatial/geo-tier.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/spatial/geo-tier.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier` /
      `does not provide an export named`; `[CL] Module loaded: spatial/geo-tier`
      prints; the 5 geo-tier dropdown handlers (region/MPO/planning-district/
      county/city selection) still fire.

## §4 Rollback
```bash
git checkout -- app/modules/spatial/geo-tier.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
