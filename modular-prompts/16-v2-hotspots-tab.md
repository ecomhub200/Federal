# CC Modular Extraction Prompt 16-v2 — `app/modules/hotspots/hotspots-tab*.js` (3-CHILD RE-SPLIT)

**Supersedes `modular-prompts/16-hotspots-hotspots-tab.md`** (stale snapshot
L61500–L63344; live `analyzeHotspots`@54717). Byte-unmodified — see
`modular-prompts/SUPERSEDED.md`. Re-anchored 2026-05-17 (CC Session N) @ live
**145,624 lines**. Analysis: `NEVER_RUN_PROMPTS_ANALYSIS.md`.

> ⚠️ NOT superseded by the off-limits `analysis/hotspots.js` — that is the
> **pure hotspot-math** module (`CL.analysis`). This prompt is the **Hot Spots
> TAB UI** (`analyzeHotspots`/`renderHotspots`/export). Different feature.

**Severity:** Refactor. **One CHILD per session.** **THREE-MODULE re-split**
(16a→16b→16c). Cleanest of the never-run set (clean boundary both ends).

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^function analyzeHotspots\b' app/index.html               # band START ~54717
grep -nE '^// ============' app/index.html | awk -F: '$1>55780 && $1<55800'  # band END divider above // ANALYSIS TAB (~L55791)
grep -nE '^(async )?function +(analyzeHotspots|getFilteredHotspotAggregates|renderHotspots|showLocationModal|exportHotspotsCSV|exportHotspotsPDF)\b' app/index.html
test -f app/modules/hotspots/hotspots-tab-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/analysis/hotspots.js"></script>' app/index.html  # load-after anchor, expect 1
```
ABORT if band not contiguous / target exists / anchor missing / any name
off-limits / slice splits a function. NOTE the band ends cleanly at the
`// ANALYSIS TAB` divider (~L55791); `updateAnalysis`@55794 is a SEPARATE fn
left inline (CLAUDE.md) — do NOT cross it.

## §1 What to move — 3 children (~358 each; re-derive ≤500 by brace read)
| Order | Child | Candidate band | ~LOC | Anchor set |
|---|---|---|---|---|
| 16a | `hotspots/hotspots-tab-core.js` | `analyzeHotspots`@54717 → before `getFilteredHotspotAggregates`@55153 | ~436 | `analyzeHotspots`,`_loadHotspotsFromMatview`,`_hotspots_fetchMatview`,`_renderHotspotsTableFromMatview`,`autoSelectTopHotspot`,`showHotspotInfoBanner` |
| 16b | `hotspots/hotspots-tab-render.js` | `getFilteredHotspotAggregates`@55153 → before `showLocationModal`@55465 | ~312 | `getFilteredHotspotAggregates`,`updateHotspotFilterSummary`,`renderHotspots`,`goToHotspotPage`,`askMUTCDForHotspot`,`openHotspotStreetView` |
| 16c | `hotspots/hotspots-tab-modal.js` | `showLocationModal`@55465 → band END (~L55790) | ~326 | `showLocationModal`,`zoomToLocation`,`filterMapForLocation`,`exportHotspotsCSV`,`exportHotspotsPDF` |

Copy bytes **verbatim**. New `CL.hotspots` root → add ONLY that key to
`loader.js` if absent.

## §2 Skeleton (per child)
```js
/** CL hotspots.tab<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/16-v2-hotspots-tab.md. No behavior change.
 *  Depends on (script order): analysis/hotspots (math). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.hotspots=CL.hotspots||{};
  CL.hotspots.tab=CL.hotspots.tab||{};
  CL._registerModule('hotspots/hotspots-tab-<child>');
})();
```

## §3 Script tags (after `<script src="modules/analysis/hotspots.js">`, in order)
```html
<script src="modules/hotspots/hotspots-tab-core.js"></script>
<script src="modules/hotspots/hotspots-tab-render.js"></script>
<script src="modules/hotspots/hotspots-tab-modal.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/hotspots/hotspots-tab-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -c '<script src="modules/hotspots/hotspots-tab-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: hotspots/hotspots-tab-<child>`.

## §6 Smoke (after last child)
Open deployed app → Hot Spots tab: list renders (matview + fallback), top
hotspot auto-selects, filter summary updates, location modal opens, CSV/PDF
export. No new console errors. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/hotspots/hotspots-tab-<child>.js`

## §8 Out of scope
`updateAnalysis`@55794 / ANALYSIS TAB; `analysis/hotspots.js` (off-limits);
renames; PR.

---
### Ordering
16a→16b→16c. No gate. **Session O slot: 1st (cleanest, lowest split risk).**
