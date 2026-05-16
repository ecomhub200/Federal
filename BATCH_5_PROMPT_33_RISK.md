# Batch 5 risk analysis — Prompt 33 `cmf/cmf-deficiency.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor | Snapshot (stale) | **Live decl** | True LOC | onclick |
|---|---|---|---|---|
| `runADAnalysis` | L90000–L99600 | **L85125** | 127 | 2 |
| `runGPT4VAnalysis` | (same) | **L85275** | 54 | 2 |
| `getGPT4VPrompt` | (same) | **L85336** | 46 | 2 |
| `detectDeficiencies` | (same) | **L85722** | 28 | 2 |
| `calculateRiskScore` | (same) | **L85761** | 42 | 3 |

- All 5 anchors exist, **exactly 1 decl match each** — locatable.
- 🔴 **The snapshot is a heuristic phantom.** §1 claims "L90000–L99600,
  **~9,601 lines**, LARGEST of the six". Reality: the 5 anchors span
  **L85125–L85802 (~680 lines)**; with surrounding helpers the candidate
  block is ≈ L85125–L86100 (~1,000 lines). The 9.6k figure is the same
  next-decl-1 over-estimate that produced the navigateTo phantom — exactly
  what the INDEX_MAP regen corrects.

## §2 Shared-global usage & block cohesion

`runADAnalysis` body reads `COL` (app-wide shared — leave inline + mirror).
Low shared-global coupling overall.

🔴 **The block is NOT single-ownership / NOT cleanly contiguous.** Per
regenerated INDEX_MAP_part3 over L85125–L86100:
- `runADAnalysis` (L85125) and `runGPT4VAnalysis` (L85275) are curated
  **`Analysis`** (name-join preserved the prior assignment), not
  `cmf-deficiency`.
- A long run of `Unassigned` helper arrows L85336–L86090.
- At **L86103+** the block becomes interleaved with **`CMF/Countermeasures`**
  and **`Grants`** decls (e.g. L86103/86124 CMF, L86115/86136 Grants).

So "extract the single contiguous block" does **not** hold: the 5 anchors mix
`Analysis`-tagged AI functions with `Unassigned` helpers and downstream
`Grants`/`CMF` declarations. Splitting cmf-deficiency cleanly requires a
name-anchored boundary decision, not a line-range cut.

No R1/R3 off-limits-name collision (collisions at L79383–L80522, outside).

## §3 Onclick consumers

`runADAnalysis` 2 · `runGPT4VAnalysis` 2 · `getGPT4VPrompt` 2 ·
`detectDeficiencies` 2 · `calculateRiskScore` 3. All five need
`window.<fn>` back-compat (prompt's dual-export covers them).

## §4 Extraction safety verdict

**NEEDS-SPLIT + NEEDS-PRE-WORK** — highest-risk of the six.

1. §0 check #4 (`grep '<script src="modules/cmf/cmf-ai.js">'`) = **0**: load
   anchor module is **prompt 32 (`cmf/cmf-ai.js`)**, not run. The prompt also
   `Depends on cmf/cmf-search` (**prompt 31**), file absent. Two prerequisite
   extractions gate it → §0 ABORT today.
2. The block is interleaved with `Analysis`/`Grants`/`CMF` ownership (§2). A
   single verbatim contiguous extraction would drag foreign-tagged decls.
   Recommend a name-anchored re-derivation and the sub-split flagged in
   MODULAR_PLAN §2 (e.g. `-deficiency` core vs. AD/GPT4V AI helpers), decided
   under Cowork review on the regenerated INDEX_MAP — not the 9.6k snapshot.

## §5 Contribution to Batch 5 order

Gated by **prompts 31 → 32** (cmf-search, cmf-ai). Even after those, do **not**
auto-run: requires a human sub-split decision first. Sequence it **after** the
20–22 chain (lower-risk wins first), in its own session, post-prework.
