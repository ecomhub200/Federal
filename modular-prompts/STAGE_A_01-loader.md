# Stage A Conversion 01 — `app/modules/loader.js` IIFE → ESM

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

- **Module:** `app/modules/loader.js`
- **CL namespace:** `(none — special)`
- **Baseline size (IIFE era):** 34 lines (re-snapshot before editing)

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `node --check app/modules/loader.js` passes (pre-state).
- [ ] `wc -l app/modules/loader.js` snapshotted (expect ~34).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## Special: namespace root (side-effect module)
- `loader.js` is NOT an IIFE. It has no functions to `export`.
- Conversion = leave the body as-is; it becomes a **side-effect module**.
- `app/main.js` does `import "./modules/loader.js";` **first**, before any
  other module (use the real relative form `import './modules/loader.js';`).
- `window.CL` MUST stay — remaining inline `app/index.html` code reads `CL.*`.
- Do NOT add `export`/`import`. Only §2 (entry-point ordering) applies.

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
`loader.js` has no IIFE and no exports. **No `§1` code transform** beyond
confirming it is import-safe (pure side effect). Keep `window.CL`, all
`CL.*` key creation, `CL._loaded`, and `CL._registerModule` exactly as-is.

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`). Do **not** touch `app/index.html`
  script tags in this prompt.

## §3 Post-flight
- [ ] `node --check app/modules/loader.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/loader.js` (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / `Failed to resolve module specifier`;
      `window.CL` + every `CL.*` key exist before any module runs.

## §4 Rollback
```bash
git checkout -- app/modules/loader.js
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
