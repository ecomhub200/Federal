# Prompt 44 (`data/filter-wiring`) — Resolution: ⛔ BLOCKED

**Session:** Session A (retry #44 + Batch 4) — 2026-05-16
**Branch:** `claude/retry-prompt-batch-extract-1Ynzn`
**Decision:** Prompt 44 is **BLOCKED**. Not extracted. No change to
`app/index.html` for #44. This document records the diagnosis (the orchestrator
prompt explicitly authorizes writing this resolution file).

## Why blocked — IIFE entanglement

Prompt 44 wants to extract these 5 functions into
`app/modules/data/filter-wiring.js`:

| Anchor | Line (pre-session snapshot) |
|---|---|
| `_r18ApplyDashboardYearFilter` | L152206 |
| `_r18ReloadHotspots` | L152267 |
| `_r19LoadSafetyCategoriesWithFilter` | L152396 |
| `_bindFilterInputs` | L152532 |
| `_restoreFilterInputs` | L152602 |

Diagnosis (read-only):

1. **Shared IIFE.** All 5 anchors live inside a single
   `(function(){ 'use strict'; … })()` spanning **L151953–L152643**. There are
   **~253 lines of IIFE prologue (L151953→L152206) before the first anchor**,
   which almost certainly defines closure-private state the 5 functions read.
   Pulling the functions out of that closure would change their scope and risk
   silent `ReferenceError`/`undefined` behavior.

2. **Interleaved unrelated declarations.** Between the first and last anchor sit
   two functions that are **not** in the extraction set:
   - `_r18ReloadIntersections` @ L152351 (separate R18 intersections feature)
   - `_bindOnce` @ L152524 (generic internal helper)
   So the 5 anchors are **not a single contiguous filter-only block**.

3. **Decision-tree outcome.** The orchestrator's decision tree states: *"If
   neither path is safe (e.g., functions wrap inside an IIFE that hosts other
   features): MARK PROMPT 44 ⛔ BLOCKED and SKIP."* Both the contiguous-block
   path and the 44a/44b split path are unsafe here — the split would still
   extract functions out of a shared closure that hosts other features. →
   **BLOCKED.**

## Unblock prerequisite (future work, not this session)

Prompt 44 can only proceed after the entire IIFE at L151953–L152643 is
addressed as a unit — e.g. a dedicated prompt that extracts the whole IIFE
(prologue + all member functions, including `_r18ReloadIntersections` and
`_bindOnce`) into one module, or that first refactors the closure state onto a
`window`/`CL` namespace so the 5 filter functions become independently movable.
Until then `MODULAR_PLAN.md` should treat #44 as gated on that work.
(`MODULAR_PLAN.md` itself is a protected file and was **not** edited this
session; this resolution doc is the record.)

---

## Appendix — Batch 4 prompts also BLOCKED at hard `§0` gates

Three of the four Batch 4 prompts hard-fail their own `§0 #4` "load anchor
present" check (a documented ABORT condition — *"If any check fails … ABORT and
report — do not edit."*). Root cause: each declares a load-order dependency on a
sibling module that has **not been extracted/wired yet**.

| # | Module | Blocking `§0 #4` anchor (missing) | Notes |
|---|---|---|---|
| 41 | `ai/ai-domain-knowledge` | `<script src="modules/ai/ai-mode.js">` not in index.html (only `modules/ai/context.js`) | Snapshot also drifted ~3,400 lines (range now points at Asset-Deficiency code). |
| 43 | `reports/reports-custom` | `<script src="modules/reports/reports-standard.js">` not wired; `app/modules/reports/` dir absent | Anchor in §1 is a placeholder `(custom report builder fns)`, not a real symbol. |
| 31 | `cmf/cmf-search` | `<script src="modules/grants/grants-ui.js">` not wired (only `grants/ranking.js`) | Secondary blocker: `cmfState` referenced **345×** in index.html (def L82954) → cross-tab global; prompt's "move module-private" violates extraction rule #8 (no behavior change). |

These are **ordering dependencies**, not defects in the prompts. They become
extractable once their prerequisite modules (`ai/ai-mode`,
`reports/reports-standard`, `grants/grants-ui`) are extracted and wired in
earlier prompts.

## What DID land this session

| # | Module | Result |
|---|---|---|
| 25 | `app/modules/spatial/geo-tier.js` | ✅ **EXTRACTED** — 1,357-line verbatim block (24 fns + `_geoDataCache`) from `app/index.html` L19274–L20630. `node --check` pass; byte-exact vs original; all 24 prior globals mirrored to `window` + anchors on `CL.spatial`/`CL.spatial.geoTier`. `app/index.html` 153,085 → 151,729. |

**Smoke-test limitation (honest disclosure):** the `playwright-cli` agent
driver referenced in `CLAUDE.md` is **not installed** in this environment (only
the vanilla `playwright` test runner is present), and the deployed GitHub Pages
site serves the deployed branch — it does **not** reflect the unpushed feature
branch `claude/retry-prompt-batch-extract-1Ynzn`. The §6 deployed-site smoke
test therefore could not validate this change in-session. Local validation
performed instead: `node --check` pass, byte-exact `diff` of moved code vs
original, full `window` re-mirroring of all 24 previously-global functions to
guarantee zero behavior change, anchor relocation verified, script tag placed
in the correct EARLY cluster (after `core/tier.js`, before `spatial/r2-resolve.js`).
