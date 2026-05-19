# Prompt 17-v2 verification (Session P)

**Date:** 2026-05-17
**N_LINES at verify:** 144245
**Prompt re-anchored at (Session N):** 145,624 lines
**Measured uniform drift:** +3 lines (Session M removals all at L63954+, below this band)

## Per-anchor status

- Anchor `updateIntersectionTab`: **FOUND @57644**
- BLK_START_NEW: 57644
- BLK_END_NEW: 59225 (line before `// PEDESTRIAN / BICYCLE TAB` @59226)
- LOC: 1582
- Drift from snapshot (~L57641 start / 1582 LOC): +3 start / +3 end / 0 LOC

Supporting anchors all FOUND, live lines:
`exportIntersectionPDF`@57907, `toggleIntSelection`@58315,
`updateIntDetailPanel`@58452, `aggregateIntDetailData`@58483. Band ends
cleanly at `// PEDESTRIAN / BICYCLE TAB`@59226 (18-v2 territory — not crossed).

## Per-child status (4–5 children, ranges re-offset +3 from §1 table)

- 17a `intersection/intersection-tab-table.js`: BLK 57644 → before `exportIntersectionPDF`@57907, ~263 LOC, load anchor `data/supabase-map-bridge.js` FOUND (1), target FREE
- 17b `intersection/intersection-tab-export.js`: BLK 57907 → before `toggleIntSelection`@58315, ~408 LOC, load anchor FOUND, target FREE
- 17c `intersection/intersection-tab-selection.js`: BLK 58315 → before `aggregateIntDetailData`@58483, ~168 LOC, load anchor FOUND, target FREE
- 17d `intersection/intersection-tab-detail.js`: BLK 58483 → before `// Initialize charts` (~58815), ~330 LOC, load anchor FOUND, target FREE
- 17e `intersection/intersection-tab-charts.js`: BLK ~58815 → band END 59225, ~410 LOC, load anchor FOUND, target FREE

§1 permits 17c+17d or 17b+17c merge if combined ≤500 (extraction-time brace
decision). `CL.intersection` root NOT in `loader.js` → child session adds that
one key. `app/modules/intersection/` absent — all targets FREE.

## Verdict

**STATUS: GREEN**

## Required prompt edits

None. §0 name-anchored; 17d/17e internal cut is explicitly a §0 brace-read
decision; +3 drift absorbed; no false-abort risk.
