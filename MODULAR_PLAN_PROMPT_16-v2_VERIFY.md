# Prompt 16-v2 verification (Session P)

**Date:** 2026-05-17
**N_LINES at verify:** 144245
**Prompt re-anchored at (Session N):** 145,624 lines
**Measured uniform drift:** +3 lines (Session M removals all at L63954+, below this band)

## Per-anchor status

- Anchor `analyzeHotspots`: **FOUND @54720**
- BLK_START_NEW: 54720
- BLK_END_NEW: ~55793 (line before the `// ====` divider above `// ANALYSIS TAB` @55795)
- LOC: ~1074
- Drift from snapshot (L54717–L55791 / 1074 LOC): +3 start / +3 end / 0 LOC

Supporting anchors all FOUND, live lines:
`getFilteredHotspotAggregates`@55156, `renderHotspots`@55322,
`showLocationModal`@55468, `exportHotspotsCSV`@55590,
`exportHotspotsPDF`@55614. `updateAnalysis`@55797 is the SEPARATE inline fn
(CLAUDE.md) — confirmed present just after the band; band ends cleanly before
it. Not superseded by off-limits `analysis/hotspots.js` (pure math) — distinct
feature, confirmed.

## Per-child status (3 children, ranges re-offset +3 from §1 table)

- 16a `hotspots/hotspots-tab-core.js`: BLK 54720 → before `getFilteredHotspotAggregates`@55156, ~436 LOC, load anchor `analysis/hotspots.js` FOUND (1), target FREE
- 16b `hotspots/hotspots-tab-render.js`: BLK 55156 → before `showLocationModal`@55468, ~312 LOC, load anchor FOUND, target FREE
- 16c `hotspots/hotspots-tab-modal.js`: BLK 55468 → band END ~55793, ~326 LOC, load anchor FOUND, target FREE

`CL.hotspots` root NOT in `loader.js` → child session adds that one key.
`app/modules/hotspots/` absent — all 3 targets FREE.

## Verdict

**STATUS: GREEN**

## Required prompt edits

None. §0 is name-anchored and explicitly re-derives by brace read; +3 drift
absorbed. Cleanest of the never-run set (clean boundary both ends) — lowest
split risk.
