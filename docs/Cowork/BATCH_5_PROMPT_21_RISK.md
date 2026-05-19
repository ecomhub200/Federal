# Batch 5 risk analysis — Prompt 21 `fatal-speeding/fatal-speeding-tab.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor | Snapshot (stale) | **Live decl** | True LOC | Callsites | onclick |
|---|---|---|---|---|---|
| `initFatalSpeedingTab` | L109100–L113700 | **L104271** | 28 | 1 | 1 |
| `applyFSFilters` | (same range) | **L104880** | 35 | 5 | 5 |

- Both anchors exist, **exactly 1 decl match each** — locatable.
- Drift: snapshot start L109100 → live L104271 (**−4,829**). The "~4,601-line"
  size is a stale next-decl heuristic.
- The two anchors are ~609 lines apart (L104271 → L104880) within one
  contiguous Fatal & Speeding region (L104271 ≈ L104960). No foreign feature
  cluster between them per regenerated INDEX_MAP_part3.
- **Not inside a shared foreign IIFE.**

## §2 Shared-global usage

`initFatalSpeedingTab` body reads: `COL`, `crashState`, `jurisdictionContext`
— all **app-wide shared**: leave inline, expose `window` mirrors, do NOT
relocate. **No module-private global** for this module (prompt §1 lists none),
so there is no non-contiguous-state hazard (unlike prompt 20).

No R1/R3 off-limits-name collision in this band (collisions are at
L79383–L80522, far away).

## §3 Onclick consumers

| fn | onclick / call refs | Back-compat surface |
|---|---|---|
| `initFatalSpeedingTab` | 1 | `window.initFatalSpeedingTab` |
| `applyFSFilters` | 5 | `window.applyFSFilters` |

Both covered by the prompt's dual-export block.

## §4 Extraction safety verdict

**NEEDS-PRE-WORK** (then SAFE-WITH-PAUSE).

- §0 check #4 (`grep '<script src="modules/crash-tree/crash-tree-tab.js">'`)
  returns **0** — the load anchor is the module created by **prompt 20**,
  which has not run. Running 21 now triggers the §0 ABORT.
- Intrinsically the **cleanest of the six**: two well-isolated anchors, no
  module-private global, no off-limits collision, contiguous.
- After prompt 20 ships: **SAFE-WITH-PAUSE** (LARGE BLOCK callout) — minimal
  residual risk.

## §5 Contribution to Batch 5 order

Gated by **prompt 20** (its load anchor = `crash-tree/crash-tree-tab.js`).
Position 3 in the 19→20→21→22 chain. Lowest-risk LARGE BLOCK once unblocked —
a good confidence-builder to run right after 20.
