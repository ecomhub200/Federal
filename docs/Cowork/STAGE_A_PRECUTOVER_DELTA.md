# Stage A — Pre-Cutover Delta (Session K, 2026-05-17)

What changed since Session I's go/no-go (`STAGE_A_GO_NOGO_REPORT.md`) and
what is still required for a **GO**. This is the single scorecard for the
deterministic punch-list items 2–6; items 1 & 7 remain gated on the IIFE
round and are **not** addressed here.

Session K is **documentation only** — no code extracted or modified. Branch:
`claude/session-k-stage-a-prep`.

## Punch-list status (`STAGE_A_GO_NOGO_REPORT.md` §5)

| # | Item | Status |
|---|---|---|
| 1 | Burn down outstanding IIFE extraction queue | **PENDING** — gated, out of scope |
| 2 | Re-run module survey | ✅ DONE |
| 3 | Re-scan onclick API floor | ✅ DONE |
| 4 | Re-derive import edges | ✅ DONE |
| 5 | Author missing `STAGE_A_NN` prompts | ✅ DONE |
| 6 | Renumber so cutover is terminal | ✅ DONE |
| 7 | Re-run go/no-go | **PENDING** — gated on Item 1 |

## Item 2 — Module survey: **53 → 61**

`STAGE_A_MODULE_SURVEY.md` regenerated against the live tree (61
`app/modules/**/*.js`). The 8 modules added since Session C's frozen
snapshot:

| Module | Lines | Origin |
|---|---|---|
| `ai/ai-mode-toggle.js` | 259 | IIFE prompt 40b |
| `grants/grants-ui.js` | 2,267 | IIFE prompt 30 |
| `spatial/geo-tier.js` | 1,424 | IIFE batch 4 (geo-tier) |
| `map/map-layers.js` | 304 | IIFE Session G |
| `reports/reports-standard-core.js` | 804 | IIFE prompt 42b1 |
| `reports/reports-standard-core2.js` | 339 | IIFE prompt 42b1 |
| `reports/reports-standard-types.js` | 948 | IIFE prompt 42b1 |
| `reports/reports-standard-types2.js` | 437 | IIFE prompt 42b1 |

Session I estimated "+3"; the live count is **+8**. The 10 `batch-ba/*`
files and `worker/sample-rows-loader.js` were already surveyed/covered
(Session I's cross-ref false-negative on those is corrected here). Summary
metrics refreshed: 60 `<script src="modules/…">` tags (incl. loader; +1
worker via `new Worker`), ~327 `window.*` assignments, 263 unique names,
59 modules expose ≥1 `window.*`.

## Item 3 — Onclick API floor: **25 → 72**

`STAGE_A_ONCLICK_API.md` regenerated. The scan now covers
`onclick|onchange|oninput|onsubmit` across `app/index.html` **and**
module-injected HTML (805 distinct handler names in the universe; 72
resolve to a module-owned `window.*`). `onsubmit` produced zero
module-owned hits.

Owning modules grew **9 → 14**: added `ai/ai-mode-toggle` (4),
`grants/grants-ui` (19 — largest surface), `spatial/geo-tier` (5),
`map/map-layers` (2), `reports/reports-standard-core` (3), plus expanded
counts for `scorecard` (6), `core/epdo-presets` (3) and others.

**Watch list (new):** 5 on\*-bound fns (`clearUserPreferences`,
`forceRefreshAllData`, `saveFilterProfile`, `saveUserPreferences`,
`handleFileSelect`) live in `upload/upload-tab.js` /
`upload/upload-pipeline.js` **but are still also defined inline in
`app/index.html`** (the live handler binds to the inline copy). They are
not survivors yet — they become survivors when Item 1 deletes the inline
duplicates, at which point prompts `STAGE_A_37/38` must add their
`window.*`. Documented in `STAGE_A_ONCLICK_API.md` §Watch list.

## Item 4 — Import edges: **12 → 15 clusters**

`STAGE_A_IMPORT_GRAPH.md` regenerated. New static-export edges:

- `reports/reports-standard-core2.js` → `reports/reports-standard-core.js`
- `reports/reports-standard-types2.js` → `reports/reports-standard-types.js`
- `spatial/geo-tier.js` → `upload/upload-tier-ui.js`

Two new **acyclic** mini-clusters (`reports *core* / *types*`) documented
alongside the runtime-safe `batch-ba` cycle. New **runtime-only** reads
(kept as `CL.*`, NOT imports): `grants/grants-ui` → still-inline
`CL.grants.*` helpers (prompts 27/28/29 never ran); `spatial/geo-tier` →
`CL.geo.places` (inline) + `CL.data.*` singletons;
`reports/reports-standard-core` → `CL.data.supabaseBridge` singleton.
Topological load order and `STAGE_A_MAIN_ENTRY_DRAFT.js` updated with all
8 modules (L1: ai-mode-toggle, grants-ui, map-layers, reports-core,
reports-types; L2: geo-tier, reports-core2, reports-types2).

## Item 5 — New conversion prompts: **8 authored**

| Prompt | Module |
|---|---|
| `STAGE_A_54-ai-ai-mode-toggle.md` | `ai/ai-mode-toggle.js` |
| `STAGE_A_55-spatial-geo-tier.md` | `spatial/geo-tier.js` |
| `STAGE_A_56-map-map-layers.md` | `map/map-layers.js` |
| `STAGE_A_57-grants-grants-ui.md` | `grants/grants-ui.js` |
| `STAGE_A_58-reports-reports-standard-types.md` | `reports/reports-standard-types.js` |
| `STAGE_A_59-reports-reports-standard-types2.md` | `reports/reports-standard-types2.js` |
| `STAGE_A_60-reports-reports-standard-core.md` | `reports/reports-standard-core.js` |
| `STAGE_A_61-reports-reports-standard-core2.md` | `reports/reports-standard-core2.js` |

Each authored from `STAGE_A_CONVERSION_TEMPLATE.md` in the existing house
style (§0–§4), with per-module KEEP (onclick-survivor) and import lists
derived from the regenerated Items 3 & 4. Coverage verified: every one of
the 61 `app/modules/**/*.js` is now referenced by a `STAGE_A_*` prompt.

## Item 6 — Renumber: cutover **54 → 62**

8 new prompts appended as `STAGE_A_54..61` (existing `01–53` left
unrenumbered — minimal churn, preserves `git mv` history). Terminal
cutover `git mv`'d `STAGE_A_54-cutover.md` → `STAGE_A_62-cutover.md` and
its internals updated (prompt range `01–61`, ≈60 script tags,
`CL._loaded.length === 60`, 72-survivor exercise list). The literal token
`STAGE_A_54-cutover` was mechanically swapped to `STAGE_A_62-cutover`
across all 54 referencing `STAGE_A_*` files; the bare
`— that is STAGE_A_54)` §2 header token fixed in the 53 prior prompts.
Verified: `ls modular-prompts/STAGE_A_*.md | sort | tail -1` ⇒
`STAGE_A_62-cutover.md`; zero residual `STAGE_A_54-cutover` in any
`STAGE_A_*` file.

> **Known out-of-scope follow-up:** `MODULAR_PLAN.md` and `CLAUDE.md` still
> contain the old `STAGE_A_54-cutover` reference. Both are off-limits for
> Session K (non-`STAGE_A_*`, `MODULAR_PLAN.md` is a protected
> source-of-truth). A future doc-sync should update them when the IIFE
> round closes.

## What's still required for GO

1. **Item 1 (blocking):** burn down the outstanding IIFE extraction queue
   so `app/index.html` reaches "all inline JS extracted". Until then,
   not-yet-extracted inline IIFEs cannot coexist with a `type="module"`
   graph after cutover.
2. **Item 7:** re-run the go/no-go after Item 1 — and re-run Items 2–6's
   scans once more against the final post-IIFE tree (the regenerated docs
   self-flag this; all KEEP/import/survivor lists are a **floor**).

**Stage A status: still NO-GO.** Materially closer than Session I — the
three design docs and the prompt queue now match the live 61-module tree
and the terminal step is correctly positioned. The sole remaining gating
blocker is Item 1.
