# Stage A Conversion 53 — `app/modules/worker/csv-worker.js` IIFE → ESM

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

- **Module:** `app/modules/worker/csv-worker.js`
- **CL namespace:** `(none — special)`
- **Baseline size (IIFE era):** 403 lines (re-snapshot before editing)

## §0 Pre-flight (ABORT if any fails)
- [ ] All IIFE extraction prompts (`modular-prompts/01-*`…`46-*`) are DONE
      and merged. Stage A starts only after the IIFE round closes.
- [ ] `node --check app/modules/worker/csv-worker.js` passes (pre-state).
- [ ] `wc -l app/modules/worker/csv-worker.js` snapshotted (expect ~403).
- [ ] Re-run the onclick + import re-scan vs the **final post-IIFE tree**;
      reconcile against this prompt's KEEP/import lists (lists are a
      FLOOR — extend, never shrink).

## Special: Web Worker (not a page module)
- Runs in a `Worker` thread; never on `window`; no `CL.*`.
- Convert to ESM ONLY if it `import`s a shared helper; else it MAY stay classic.
- If converted, the consumer edit is MANDATORY and is the **one allowed**
  `app/index.html` change outside the cutover script-tag swap, at
  `app/index.html:30324`:
  `const worker = new Worker('modules/worker/csv-worker.js', { type: 'module' });`
- Worker keeps `self.onmessage`/`self.postMessage`; imports resolve relative
  to the worker file.
- This prompt does the file conversion + that single line-30324 edit ONLY.

## §1 Conversion (per STAGE_A_CONVERSION_TEMPLATE.md)
See the **Special: Web Worker** block above — it governs §1 entirely.
- If the worker has an IIFE, unwrap it (steps 1–2 of the template).
- It has **no `CL.*` and no `window.*`** — nothing to export/expose;
  it communicates only via `self.onmessage`/`self.postMessage`.
- Add `import { … } from './<file>.js';` ONLY for a shared helper it
  actually pulls in; otherwise leave it import-free (it may stay classic).
- Do the mandatory `app/index.html:30324` `{ type: 'module' }` edit.

## §2 Entry-point wiring (NOT index.html script tags — that is STAGE_A_62)
- Add this module to `app/main.js` at its topo position (see
  `STAGE_A_MAIN_ENTRY_DRAFT.js`). Do **not** touch `app/index.html`
  script tags in this prompt.
- **EXCEPTION:** this prompt DOES edit `app/index.html:30324` — the
  `new Worker(..., { type: 'module' })` argument — that single line only.

## §3 Post-flight
- [ ] `node --check app/modules/worker/csv-worker.js` passes (no stray IIFE brace / bad import).
- [ ] No new `export`/`import` beyond this prompt's lists.
- [ ] `git diff --stat` = ONLY `app/modules/worker/csv-worker.js` + the 1-line `app/index.html:30324` edit (+ the `app/main.js` import line
      if you maintain `main.js` incrementally).
- [ ] Full app verification is DEFERRED to `STAGE_A_62-cutover`
      (Playwright smoke on `https://ecomhub200.github.io/Federal/app/`):
      no `Unexpected token` / worker `Failed to load module
      script`; CSV upload → worker sample-rows path runs error-free.

## §4 Rollback
```bash
git checkout -- app/modules/worker/csv-worker.js app/index.html
```
(Stage A as a whole rolls back by reverting the Stage A branch — never
ship a partially-converted tree.)
