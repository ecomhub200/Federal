# Survey B — Map Orchestration

Reference: commit `9be31e5` · `app/index.html` @ 142,804 LOC · 2026-05-17

Scope: inline map logic — Mapbox init, layer/source setup, marker creation,
popup binding, heatmap, boundary clipping, fit-to-data, and map-local filters.

## Verdict

**The existing `map/` module cluster + authored prompts 34–39 already cover
~90% of map orchestration. There is NO true ≥150 LOC uncovered block.** A
dedicated supervised "map orchestration session" is **not warranted**. The only
genuine residue is a small map-filters trio (~260–280 LOC total, every function
individually under the 150-line bar) that should be folded into a prompt-35
revision or one micro-prompt.

## Already extracted (off-limits — do not re-target)

| Module | Covers |
|---|---|
| `app/modules/map/map-safe-helpers.js` | defensive map guards |
| `app/modules/map/map-layers.js` | address search, scope label, nearby-crash helpers, `getDistanceMeters` |
| `app/modules/map/map-points-hydrate.js` | point hydration |
| `app/modules/data/supabase-map-bridge.js` | map data bridge |

## Covered by authored-but-unrun prompts (not Phase-4 work)

| Block (approx) | LOC | Covering prompt |
|---|---|---|
| `initMap` | ~260 | prompt 35 |
| `updateMapDisplay` | ~120 | prompt 35 |
| `createMarker` | ~66 | prompt 37 |
| `setMapMode` | ~15 | prompt 37 |
| `bindPopupContent` / popup builders | ~p37 | prompt 37 |
| heatmap helpers | ~p37 | prompt 37 |
| boundary-clip helpers | ~p38 | prompt 38 |

These exist as queued prompts; running them is normal refactor-queue work, not
new Phase-4 authoring.

## Genuine residue (all individually <150 LOC — fold-in, not a session)

| Function | Approx L | LOC | Note |
|---|---|---|---|
| `getFilteredMapPoints` | ~44431 (Survey A) / ~46833–46977 (Survey B) | ~120–145 | **Line-number discrepancy between agents — RE-VERIFY by function-name anchor at authoring time, not by snapshot range** |
| `getActiveMapFilters` | ~map-filter band | ~55 | reads quick-filter / factor-chip state |
| `toggleQuickFilter` | ~map-filter band | ~48 | also flagged in Survey A; map-local — assigned here |
| `fitMapToData` | ~map-filter band | ~29 | bounds fit |

**Total residue: ~260–280 LOC. Genuine ≥150 LOC blocks: 0.**

## Cluster grouping

**Cluster B1 — Map filters (~260–280 LOC, sub-150 each)**
- `getFilteredMapPoints` + `getActiveMapFilters` + `toggleQuickFilter` +
  `fitMapToData`. Recommended disposition: extend prompt 35 to absorb these
  alongside `initMap`/`updateMapDisplay`, OR author one micro-prompt
  `map/map-filters.js`. Either way it is a fold-in, **not** a standalone
  supervised session.
- ⚠️ `getFilteredMapPoints` line numbers differ between the two surveys
  (L44431 vs L46833). INDEX_MAP-style range trust is unsafe here; the authoring
  session MUST re-anchor by the function name in the live file.

## Aggregate

| Metric | Value |
|---|---|
| Genuine ≥150 LOC blocks | 0 |
| Residue (sub-150, fold-in) | ~260–280 LOC across 4 fns |
| Coverage by existing modules + prompts 34–39 | ~90% |
| Original Phase-4 estimate for this lane | ~12,000 LOC |
| **Estimate accuracy** | **Massively overstated; map is essentially already mined** |
| Recommendation | Cancel the dedicated supervised map session; fold residue into prompt 35 / one micro-prompt |
