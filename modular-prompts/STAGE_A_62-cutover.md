# Stage A Conversion 62 — Cutover: create `app/main.js`, swap script tags

> This is the ONLY prompt that makes the app run on ESM. Prompts
> `STAGE_A_01`…`STAGE_A_61` convert files but leave the app non-runnable
> (a file with `export` cannot load via a classic `<script src>`). Run this
> LAST, in the SAME branch/round as 01–61, as one atomic change.
>
> **Session K renumber:** the terminal cutover moved 54 → **62** when 8
> post-snapshot module prompts (54–61) were inserted. This is the highest
> `STAGE_A_NN` and the single terminal step.

## §0 Pre-flight (ABORT if any fails)
- [ ] All of `STAGE_A_01`…`STAGE_A_61` are applied on this branch and each
      passes `node --check`.
- [ ] `STAGE_A_MAIN_ENTRY_DRAFT.js` reviewed; topo order still valid against
      the final tree (re-derive import edges per `STAGE_A_IMPORT_GRAPH.md`).
- [ ] Onclick survivor set re-scanned vs final tree
      (`STAGE_A_ONCLICK_API.md`) — every survivor still self-exposed by its
      owning module.

## §1 Create `app/main.js`
- Materialize `STAGE_A_MAIN_ENTRY_DRAFT.js` as `app/main.js` (drop the
  "DRAFT/planning" banner; keep the path + ordering notes).
- Enable the legacy re-exposure block only for any survivor whose owning
  module no longer self-exposes it (should be none if 01–61 followed spec).

## §2 Swap `app/index.html` script tags (atomic)
- Delete ALL `<script src="modules/…">` tags (≈60 incl. loader; EARLY +
  LATE clusters — re-locate against the final tree, the L-ranges drift)
  **and** the `modules/loader.js` tag.
- Insert ONE tag where `loader.js` was (EARLY cluster):
  `<script type="module" src="main.js"></script>`
- Confirm `worker/csv-worker.js`'s `new Worker(..., { type:'module' })`
  edit (from `STAGE_A_53`) is present at the worker instantiation site.
- Touch nothing else in `app/index.html`.

## §3 Post-flight — full verification (REQUIRED)
- [ ] `node --check app/main.js` passes.
- [ ] Served over http(s) (GitHub Pages / nginx) — never `file://`
      (ESM is CORS-gated).
- [ ] Playwright smoke on `https://ecomhub200.github.io/Federal/app/`:
  - `playwright-cli console` shows NO `Unexpected token 'export'`,
    `Failed to resolve module specifier`, `does not provide an export
    named`, or MIME (`Failed to load module script`) errors.
  - `[CL] Module loaded: …` prints for all 60 CL modules
    (`CL._loaded.length === 60` in console — 61 module files minus
    `worker/csv-worker.js`, which has no `_registerModule`).
  - Exercise every onclick survivor (72 — see `STAGE_A_ONCLICK_API.md`):
    tab switch (`navigateTo`/`showTab`), tier change (`handleTierChange`),
    scorecard CSV/reset/mode/chart, EPDO preset+toggle, `signal_*` TMC
    form actions, school/transit clear + view-on-map, asset export menu +
    KML + PDF, AI Mode toggle + header API key, geo-tier dropdowns
    (region/MPO/PD/county/city), grants help/how-to/app modals + exports,
    standard reports generate/sub-tab/options, map address search.
  - Worker path still runs (CSV upload → sample rows load) with no worker
    console error.
- [ ] `git diff --stat` for the whole Stage A branch = 61 modules +
      `app/main.js` (new) + `app/index.html` only.

## §4 Rollback
```bash
# Whole-branch rollback — Stage A is all-or-nothing.
git checkout -- app/index.html app/main.js app/modules/
# or: git revert the Stage A merge commit.
```
