# Prompt 18-v2 verification (Session P)

**Date:** 2026-05-17
**N_LINES at verify:** 144245
**Prompt re-anchored at (Session N):** 145,624 lines
**Measured uniform drift:** +3 lines (Session M removals all at L63954+, below this band)

## Per-anchor status

- Anchor `updatePedBikeTab`: **FOUND @59228**
- BLK_START_NEW: 59228
- BLK_END_NEW: 62695 (line before `// PEOPLE INJURY ANALYSIS` @62696)
- LOC: 3468
- Drift from snapshot (~L59225 start / ~3468 LOC): +3 start / +3 end / 0 LOC

Supporting anchors all FOUND, live lines:
`applyPedFilters`@59436, `_fetchPedBikeDetailAggregates`@59681,
`updatePedDetailPanel`@59814, `applyBikeFilters`@60403,
`updateBikeDetailPanel`@60632, `setPedViewMode`@61185,
`setBikeViewMode`@61819, `jumpToCMFFromPedBike`@62485,
`showLocationDetail`@62589. `showLocationDetail`@62589 is in the contiguous
tail before `// PEOPLE INJURY ANALYSIS`@62696 — the §0 "re-verify external
callers / window-mirror if shared" check is an **extraction-time** decision,
not a verify-time blocker. Band ends cleanly at @62696 (not crossed).

## Per-child status (7 children, ranges re-offset +3 from §1 table)

- 18a `pedbike/pedbike-tab-ped-core.js`: BLK 59228 → before `_fetchPedBikeDetailAggregates`@59681, ~453 LOC, load anchor `data/supabase-map-bridge.js` FOUND (1), target FREE
- 18b `pedbike/pedbike-tab-ped-detail.js`: BLK 59681 → before `applyBikeFilters`@60403, split →≤500 (split before `initPedDetailCharts` per §1), load anchor FOUND, target FREE
- 18c `pedbike/pedbike-tab-bike-core.js`: BLK 60403 → before `updateBikeDetailPanel`@60632, ~228 LOC, load anchor FOUND, target FREE
- 18d `pedbike/pedbike-tab-bike-detail.js`: BLK 60632 → before `setPedViewMode`@61185, split →≤500, load anchor FOUND, target FREE
- 18e `pedbike/pedbike-tab-ped-export.js`: BLK 61185 → before `setBikeViewMode`@61819, split →≤500, load anchor FOUND, target FREE
- 18f `pedbike/pedbike-tab-bike-export.js`: BLK 61819 → before legacy wrappers (~62478), ~459 LOC, load anchor FOUND, target FREE
- 18g `pedbike/pedbike-tab-shared.js`: BLK ~62478 → band END 62695, ~217 LOC, load anchor FOUND, target FREE

`CL.pedbike` root NOT in `loader.js` → child session adds that one key.
`app/modules/pedbike/` absent — all 7 targets FREE.

## Verdict

**STATUS: GREEN**

## Required prompt edits

None. §0 name-anchored; every child boundary is an explicit §0 brace-read; +3
drift absorbed. Highest split-risk of the tab set (7-child) but no
anchor/contiguity/target issue — recommended last among the tab chain.
