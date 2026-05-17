# CC Modular Extraction Prompt 17-v2 — `app/modules/intersection/intersection-tab*.js` (4–5-CHILD RE-SPLIT)

**Supersedes `modular-prompts/17-intersection-intersection-tab.md`** (stale
snapshot L64600–L65800; live `updateIntersectionTab`@57641). Byte-unmodified —
see `modular-prompts/SUPERSEDED.md`. Re-anchored 2026-05-17 (CC Session N) @
live **145,624 lines**. Analysis: `NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor. **One CHILD per session.** **4–5-MODULE re-split** —
the detail-panel tail (~743 LOC) is split into 2 by brace read in §0.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^function updateIntersectionTab\b' app/index.html             # band START ~57641
grep -nE '^// PEDESTRIAN / BICYCLE TAB' app/index.html                  # band END = divider above this (~L59223)
grep -nE '^(async )?function +(updateIntersectionTab|exportIntersectionPDF|toggleIntSelection|aggregateIntDetailData|updateIntDetailPanel)\b' app/index.html
# Detail-panel region (~L58480–L59222) has comment-only sub-headers
# (county benchmarks / render combined / Initialize charts@~58812 / export
# @~58924). Enumerate its fns by brace read and split at the "Initialize
# charts" boundary so 17d + 17e are each ≤500.
test -f app/modules/intersection/intersection-tab-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/data/supabase-map-bridge.js"></script>' app/index.html  # load anchor, expect 1
```
ABORT if band not contiguous / target exists / anchor missing / off-limits /
slice splits a function. Band ends cleanly at `// PEDESTRIAN / BICYCLE TAB`
(~L59223) — that is prompt 18-v2's territory; do NOT cross it.

## §1 What to move — 4–5 children (re-derive ≤500 by brace read)
| Order | Child | Candidate band | ~LOC | Anchor set |
|---|---|---|---|---|
| 17a | `intersection/intersection-tab-table.js` | `updateIntersectionTab`@57641 → before `exportIntersectionPDF`@57904 | ~263 | `updateIntersectionTab`,`_updateIntersectionThead`,`_renderIntersectionRows`,`goToIntersectionPage`,`autoSelectTopIntersection`,`showIntInfoBanner`,`askMUTCDForIntersection`,`exportIntersectionCSV` |
| 17b | `intersection/intersection-tab-export.js` | `exportIntersectionPDF`@57904 → before `toggleIntSelection`@58312 | ~408 | `exportIntersectionPDF` (+ the `// INTERSECTION DETAILED ANALYSIS PANEL` header that follows) |
| 17c | `intersection/intersection-tab-selection.js` | `toggleIntSelection`@58312 → before `aggregateIntDetailData`@58480 | ~168 | `toggleIntSelection`,`toggleAllIntSelection`,`clearIntSelection`,`updateIntSelectionCount`,`setIntViewMode`,`resetIntPeakDefaults`,`getIntPeakHours`,`isInIntPeakPeriod`,`updateIntDetailPanel` |
| 17d | `intersection/intersection-tab-detail.js` | `aggregateIntDetailData`@58480 → before the `// Initialize charts` block (~L58812) | ~330 | `aggregateIntDetailData` + benchmark/classification/render-panel helpers |
| 17e | `intersection/intersection-tab-charts.js` | `// Initialize charts`(~L58812) → band END (~L59222) | ~410 | chart-init + export + the filter-change auto-update hook |

(If 17c+17d brace-read ≤500 combined, merge → 4 children. If 17b+17c small,
the runner may merge — keep every shipped child ≤500.)

Copy bytes **verbatim**. New `CL.intersection` root → add ONLY that key to
`loader.js` if absent.

## §2 Skeleton (per child)
```js
/** CL intersection.tab<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  CL._registerModule('intersection/intersection-tab-<child>');
})();
```

## §3 Script tags (LATE, after `data/supabase-map-bridge.js`, in order)
```html
<script src="modules/intersection/intersection-tab-table.js"></script>
<script src="modules/intersection/intersection-tab-export.js"></script>
<script src="modules/intersection/intersection-tab-selection.js"></script>
<script src="modules/intersection/intersection-tab-detail.js"></script>
<script src="modules/intersection/intersection-tab-charts.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/intersection/intersection-tab-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -c '<script src="modules/intersection/intersection-tab-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: intersection/intersection-tab-<child>`.

## §6 Smoke (after last child)
Open deployed app → Intersections tab: table renders (matview), select rows,
detail panel + charts render, peak-period toggle, CSV/PDF export. No new
console errors. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/intersection/intersection-tab-<child>.js`

## §8 Out of scope
PEDESTRIAN/BICYCLE TAB band (18-v2); renames; off-limits modules; PR.

---
### Ordering
17a→…→17e. No gate. **Session O slot: 2nd.**
