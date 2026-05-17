# CC Modular Extraction Prompt 18-v2 — `app/modules/pedbike/pedbike-tab*.js` (7-CHILD RE-SPLIT)

**Supersedes `modular-prompts/18-pedbike-pedbike-tab.md`** (stale snapshot
L66772–L68500 / "~1729 lines"; live `updatePedBikeTab`@59225, true band
**~3,468 LOC**). Byte-unmodified — see `modular-prompts/SUPERSEDED.md`.
Re-anchored 2026-05-17 (CC Session N) @ live **145,624 lines**. Analysis:
`NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor. **One CHILD per session.** **SEVEN-MODULE re-split**
(largest of the never-run set — 7× the 500 ceiling). Highest split-risk;
re-derive every child boundary by brace read.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^function updatePedBikeTab\b' app/index.html              # band START ~59225
grep -nE '^// PEOPLE INJURY ANALYSIS' app/index.html                # band END = divider above this (~L62693)
grep -nE '^(async )?function +(updatePedBikeTab|applyPedFilters|updatePedDetailPanel|applyBikeFilters|updateBikeDetailPanel|setPedViewMode|setBikeViewMode|jumpToCMFFromPedBike|showLocationDetail)\b' app/index.html
test -f app/modules/pedbike/pedbike-tab-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/data/supabase-map-bridge.js"></script>' app/index.html  # load anchor, expect 1
```
⚠️ `showLocationDetail`@~62586 is in the contiguous tail before
`// PEOPLE INJURY ANALYSIS`@~62693 — re-verify it has no external (non-pedbike)
callers by grep before moving (if shared, window-mirror, leave inline).
ABORT if band not contiguous / target exists / off-limits / slice splits a fn.

## §1 What to move — 7 children (feature-band; re-derive ≤500 by brace read)
| Order | Child | Candidate band | ~LOC | Anchor set |
|---|---|---|---|---|
| 18a | `pedbike/pedbike-tab-ped-core.js` | `updatePedBikeTab`@59225 → before `_fetchPedBikeDetailAggregates`@59678 | ~453 | `updatePedBikeTab`,`togglePedFilter`,`toggleBikeFilter`,`applyPedFilters`,`renderPedLocationTable`,`togglePedSelection`,`toggleAllPedSelection`,`clearPedSelection`,`updatePedSelectionUI` |
| 18b | `pedbike/pedbike-tab-ped-detail.js` | `_fetchPedBikeDetailAggregates`@59678 → before `applyBikeFilters`@60400 | split → ≤500 | `_fetchPedBikeDetailAggregates`,`updatePedDetailPanel`,`initPedDetailCharts`,`renderPedMonthlyHeatmap`,`resetPedFilters`,`updatePedLocationTypeChart` (if >500: split before `initPedDetailCharts`@60165) |
| 18c | `pedbike/pedbike-tab-bike-core.js` | `applyBikeFilters`@60400 → before `updateBikeDetailPanel`@~60628 | ~228 | `applyBikeFilters`,`renderBikeLocationTable`,`toggleBikeSelection` + bike selection helpers |
| 18d | `pedbike/pedbike-tab-bike-detail.js` | `updateBikeDetailPanel`@~60628 → before `setPedViewMode`@61182 | split → ≤500 | `updateBikeDetailPanel`,`initBikeDetailCharts`,`renderBikeMonthlyHeatmap` (if >500: split before `renderBikeMonthlyHeatmap`@61121) |
| 18e | `pedbike/pedbike-tab-ped-export.js` | `setPedViewMode`@61182 → before `setBikeViewMode`@61816 | split → ≤500 | `setPedViewMode`,`exportPedDetail{CSV,PDF,KML}`,`exportPedLocations{CSV,PDF}` (if >500: split before `exportPedLocationsCSV`@61561) |
| 18f | `pedbike/pedbike-tab-bike-export.js` | `setBikeViewMode`@61816 → before legacy wrappers @~62475 | ~459 | `setBikeViewMode`,`exportBikeDetail{CSV,PDF,KML}`,`exportBikeLocations{CSV,PDF}`,`updateBikeLocationTypeChart` |
| 18g | `pedbike/pedbike-tab-shared.js` | legacy wrappers @~62476 → band END (~L62692) | ~217 | `updatePedLocations`,`updateBikeLocations`,`clearPedDateFilter`,`clearBikeDateFilter`,`jumpToCMFFromPedBike`,`zoomToPedBikeLocation`,`filterMapForPedBike`,`showLocationDetail`(if not shared) |

Every shipped child MUST be ≤500 by brace read. Copy bytes **verbatim**.
New `CL.pedbike` root → add ONLY that key to `loader.js` if absent.

## §2 Skeleton (per child)
```js
/** CL pedbike.tab<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  CL._registerModule('pedbike/pedbike-tab-<child>');
})();
```

## §3 Script tags (LATE, after `data/supabase-map-bridge.js`, 18a→18g order)
```html
<script src="modules/pedbike/pedbike-tab-ped-core.js"></script>
<script src="modules/pedbike/pedbike-tab-ped-detail.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-core.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-detail.js"></script>
<script src="modules/pedbike/pedbike-tab-ped-export.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-export.js"></script>
<script src="modules/pedbike/pedbike-tab-shared.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/pedbike/pedbike-tab-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -c '<script src="modules/pedbike/pedbike-tab-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: pedbike/pedbike-tab-<child>`.

## §6 Smoke (after last child)
Open deployed app → Ped/Bike tab: ped + bike filters apply, location tables
render, detail panels + charts + heatmaps render, view-mode toggles, all
CSV/PDF/KML exports, jump-to-CMF. No new console errors. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/pedbike/pedbike-tab-<child>.js`

## §8 Out of scope
PEOPLE INJURY ANALYSIS band (separate, ~L62693+); renames; off-limits; PR.

---
### Ordering
18a→…→18g. No external gate. **Session O slot: 7th (highest split risk —
run after the cleaner tabs).**
