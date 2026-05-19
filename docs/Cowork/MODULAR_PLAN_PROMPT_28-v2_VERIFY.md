# Prompt 28-v2 verification (Session P)

**Date:** 2026-05-17
**N_LINES at verify:** 144245
**Prompt re-anchored at (Session N):** 145,624 lines
**Measured uniform drift:** +3 / +4 lines (Session M removals all at L63954+, below this band)

## Per-anchor status

- Band-start divider `// AI-POWERED FULL APPLICATION GENERATION`: **FOUND @35592**
- Anchor `generateFullApplicationContent`: **FOUND @35594**
- Anchor `exportAppWord`: **FOUND @37038**
- BLK_START_NEW: 35592 (divider) / 35594 (fn)
- BLK_END_NEW: `exportAppWord`@37038 close, before
  `// AI COUNTERMEASURE ASSISTANT - SYSTEM PROMPT` @37044
- LOC: ~1452
- Drift from snapshot (`// AI-POWERED…`@35588 / `generateFullApplicationContent`@35591 Session N): +4 divider / +3 fn / LOC unchanged

Band END divider unambiguous: first `// AI COUNTERMEASURE ASSISTANT` match is
`- SYSTEM PROMPT`@37044 (immediately after `exportAppWord`); the second,
`// AI COUNTERMEASURE ASSISTANT FUNCTIONS`@38785, is well past the band — no
ambiguity. Band ends cleanly before @37044 (separate CMF-AI feature, not
crossed). Confirmed NOT in off-limits `grants-ui.js` (that was block
L37263–L39447; this band ends at ~37043, before it).

## Per-child status (3 children — internal cuts §0-derived)

- 28a `grants/grants-ai-generate.js`: BLK 35592 → first ≤500 brace cut after `generateFullApplicationContent`@35594, ~480 LOC, load anchor `grants/grants-ui.js` FOUND (1), target FREE
- 28b `grants/grants-ai-sections.js`: BLK 28a-end → next ≤500 brace cut, ~485 LOC, load anchor FOUND, target FREE
- 28c `grants/grants-ai-export.js`: BLK 28b-end → band END (`exportAppWord`@37038 close, ~37043), ~485 LOC, load anchor FOUND, target FREE

Only 2 pre-known anchors (`generateFullApplicationContent`, `exportAppWord`) —
both FOUND. 28a/28b internal boundaries are explicitly a §0
fn-enumeration+brace decision at extraction time. `CL.grants` root already in
`loader.js`:11 — no loader edit. `grants-ai-*` targets FREE.

## Verdict

**STATUS: GREEN**

## Required prompt edits

None. §0 divider/name-anchored; +3/+4 drift absorbed; band-end divider
unambiguous. Order-locked: run AFTER 27-v2.
