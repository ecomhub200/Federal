# CC Session U — 18-v2 pedbike-tab LARGE BLOCK (SUPERVISED)

🔴 **LARGE BLOCK — Murad will watch live.** This is the largest tab band in the
never-run set: `updatePedBikeTab` → `// PEOPLE INJURY ANALYSIS`, **~3,468 LOC,
7× the 500 ceiling**, highest split-risk. For **every** child:

- Run §0 grep + brace-read derivation, then **PAUSE and surface the §0 output
  (live line numbers, fn enumeration, ≤500 brace decision) for human review
  BEFORE the §4 delete.** Do not auto-run the delete.
- After §5 post-flight, surface the §5 + smoke output and **PAUSE again before
  starting the next child.** One child per pause — never batch two children.
- If §0 disagrees with the advisory snapshot lines by more than the expected
  drift, STOP and report rather than improvising.

**Goal:** Extract 18-v2 pedbike-tab (7 children, ~3,468 LOC) in one supervised
mega-batch, one child per pause.

**Source prompt (authoritative, do NOT edit):**
`modular-prompts/18-v2-pedbike-tab.md` — verified **GREEN 7/7** in
`SESSION_P_AGGREGATE_REPORT.md`.

## Branch

Develop, commit, and push on **`claude/pre-author-extraction-prompts-kObuK`**
(the harness Git Development Branch Requirement). The task's nominal
`claude/session-u-pedbike-supervised` is **overridden** by the harness mandate
— same precedent as `SESSION_P_AGGREGATE_REPORT.md` (its doc branch
`claude/session-p-anchor-verify` was overridden by
`claude/verify-v2-anchors-jpNKN`). No push elsewhere without explicit
permission. No PR.

## Pre-batch

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout claude/pre-author-extraction-prompts-kObuK   # harness-mandated branch
# Anchor re-verification (line numbers WILL have drifted — Session P live was
# 144,245; the R+S+T extraction lane + earlier Day-2 tabs shift lines further).
cat SESSION_P_AGGREGATE_REPORT.md          # 18-v2 GREEN row, live anchor @ ~59228
cat NEVER_RUN_PROMPTS_ANALYSIS.md          # per-child LOC rationale
cat modular-prompts/18-v2-pedbike-tab.md   # §0–§8 source of truth
wc -l app/index.html                       # RECORD BASELINE (this is your ledger anchor)
```

⚠️ **Snapshot line numbers below are advisory only.** Every §0 is
**name-anchored** (grep on `^function …`, divider text). Re-derive every child
boundary by brace read at run-time. Do NOT trust the `@NNNNN` numbers — they
are from the 145,624-line Session-N snapshot and will be off by the cumulative
Day-2 drift.

## 7 children (verbatim from `modular-prompts/18-v2-pedbike-tab.md` §1)

Feature-band split (Ped + Bike are near-symmetric: core / detail / export).
Every shipped child MUST be ≤500 by brace read. Copy bytes **verbatim** — no
reformat, rename, or comment edit.

| Step | Child | Module | ~LOC | Candidate band (advisory) | Anchor set |
|---|---|---|---|---|---|
| U1 | 18a | `pedbike/pedbike-tab-ped-core.js` | ~453 | `updatePedBikeTab`@~59228 → before `_fetchPedBikeDetailAggregates`@~59678 | `updatePedBikeTab`,`togglePedFilter`,`toggleBikeFilter`,`applyPedFilters`,`renderPedLocationTable`,`togglePedSelection`,`toggleAllPedSelection`,`clearPedSelection`,`updatePedSelectionUI` |
| U2 | 18b | `pedbike/pedbike-tab-ped-detail.js` | ≤500 🔴 split | `_fetchPedBikeDetailAggregates`@~59678 → before `applyBikeFilters`@~60400 | `_fetchPedBikeDetailAggregates`,`updatePedDetailPanel`,`initPedDetailCharts`,`renderPedMonthlyHeatmap`,`resetPedFilters`,`updatePedLocationTypeChart` (if >500: split before `initPedDetailCharts`@~60165) |
| U3 | 18c | `pedbike/pedbike-tab-bike-core.js` | ~228 | `applyBikeFilters`@~60400 → before `updateBikeDetailPanel`@~60628 | `applyBikeFilters`,`renderBikeLocationTable`,`toggleBikeSelection` + bike selection helpers |
| U4 | 18d | `pedbike/pedbike-tab-bike-detail.js` | ≤500 🔴 split | `updateBikeDetailPanel`@~60628 → before `setPedViewMode`@~61182 | `updateBikeDetailPanel`,`initBikeDetailCharts`,`renderBikeMonthlyHeatmap` (if >500: split before `renderBikeMonthlyHeatmap`@~61121) |
| U5 | 18e | `pedbike/pedbike-tab-ped-export.js` | ≤500 🔴 split | `setPedViewMode`@~61182 → before `setBikeViewMode`@~61816 | `setPedViewMode`,`exportPedDetail{CSV,PDF,KML}`,`exportPedLocations{CSV,PDF}` (if >500: split before `exportPedLocationsCSV`@~61561) |
| U6 | 18f | `pedbike/pedbike-tab-bike-export.js` | ~459 | `setBikeViewMode`@~61816 → before legacy wrappers @~62475 | `setBikeViewMode`,`exportBikeDetail{CSV,PDF,KML}`,`exportBikeLocations{CSV,PDF}`,`updateBikeLocationTypeChart` |
| U7 | 18g | `pedbike/pedbike-tab-shared.js` | ~217 | legacy wrappers @~62476 → band END (`// PEOPLE INJURY ANALYSIS`@~62696) | `updatePedLocations`,`updateBikeLocations`,`clearPedDateFilter`,`clearBikeDateFilter`,`jumpToCMFFromPedBike`,`zoomToPedBikeLocation`,`filterMapForPedBike`,`showLocationDetail` (if not shared) |

⚠️ **`showLocationDetail`@~62586 caveat (U7):** it sits in the contiguous tail
before `// PEOPLE INJURY ANALYSIS`. Re-verify it has **no external
(non-pedbike) callers** by grep before moving. If shared, window-mirror and
**leave it inline** (do not relocate an app-wide shared global).

New `CL.pedbike` root → add ONLY that key to `app/modules/loader.js` if absent
(per CLAUDE.md: loader edited only to add a new top-level `CL.*` key).

## Per-child loop (standard §0–§8, SUPERVISED pause discipline)

Run U1…U7 in order. For each child:

### §0 Pre-flight (per child) — then PAUSE for human review
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^function updatePedBikeTab\b' app/index.html              # band START ~59228
grep -nE '^// PEOPLE INJURY ANALYSIS' app/index.html                # band END = divider above this (~L62696)
grep -nE '^(async )?function +(updatePedBikeTab|applyPedFilters|updatePedDetailPanel|applyBikeFilters|updateBikeDetailPanel|setPedViewMode|setBikeViewMode|jumpToCMFFromPedBike|showLocationDetail)\b' app/index.html
test -f app/modules/pedbike/pedbike-tab-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/data/supabase-map-bridge.js"></script>' app/index.html  # load anchor, expect 1
```
ABORT if band not contiguous / target exists / off-limits / slice splits a fn.
**🔴 PAUSE: surface the §0 output (live start/end lines, fn enumeration in the
child's band, the ≤500 brace-read decision) for Murad to review BEFORE §4.**

### §2 Skeleton (per child)
```js
/** CL pedbike.tab<X> — extracted (name-anchored) <run date>.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  CL._registerModule('pedbike/pedbike-tab-<child>');
})();
```
Dual public API: expose both `window.<fn>` AND `CL.pedbike.tab.<fn>` for every
moved fn (HTML `onclick=`/hoisting back-compat).

### §3 Script tags (LATE, after `data/supabase-map-bridge.js`, 18a→18g order)
```html
<script src="modules/pedbike/pedbike-tab-ped-core.js"></script>
<script src="modules/pedbike/pedbike-tab-ped-detail.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-core.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-detail.js"></script>
<script src="modules/pedbike/pedbike-tab-ped-export.js"></script>
<script src="modules/pedbike/pedbike-tab-bike-export.js"></script>
<script src="modules/pedbike/pedbike-tab-shared.js"></script>
```

### §4 Remove (per child) — only after the §0 human-review PAUSE clears
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

### §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/pedbike/pedbike-tab-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # expect 0
grep -c '<script src="modules/pedbike/pedbike-tab-<child>.js"></script>' app/index.html  # 1
git diff --stat   # ONLY app/index.html + the one new module (+ loader.js on 18a if CL.pedbike added)
```
Console must show `[CL] Module loaded: pedbike/pedbike-tab-<child>`.

### §6 Smoke (PER CHILD — supervised, not just at end)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # must show NO new errors
# Click Ped/Bike tab; verify the moved feature for THIS child:
#   table renders + ped/bike filters apply + detail panel/charts/heatmap +
#   view-mode toggle + CSV/PDF/KML export buttons present + jump-to-CMF.
#   Confirm ALL crashes load (not just the sample).
playwright-cli close
```
**🔴 PAUSE again before the next child.** If the deployed Pages site is not yet
up to date with this branch, say so explicitly rather than skipping the step.

### §7 Rollback (per child)
```bash
git checkout -- app/index.html && rm app/modules/pedbike/pedbike-tab-<child>.js
```

### §8 Out of scope
PEOPLE INJURY ANALYSIS band (separate, ~L62696+); renames; reformatting;
off-limits modules; PR. No behavior changes — app must work identically.

## Per-child commit

One commit per child (clear message, e.g.
`Session U: extract 18a pedbike-tab-ped-core`), pushed to
`claude/pre-author-extraction-prompts-kObuK` with
`git push -u origin claude/pre-author-extraction-prompts-kObuK` (retry on
network error with exponential backoff 2s/4s/8s/16s). After the 7th child,
append the 7 new modules to the CLAUDE.md off-limits list in a final commit.

## Expected end state

- `app/index.html`: `<baseline>` → `<baseline> − ~3,468` lines.
- 7 new modules under `app/modules/pedbike/`:
  `pedbike-tab-{ped-core,ped-detail,bike-core,bike-detail,ped-export,bike-export,shared}.js`,
  each ≤500 lines, each `node --check` clean, each registered.
- `CL.pedbike` namespace populated; new key added to `loader.js`.
- CLAUDE.md off-limits list appended with the 7 pedbike modules.
- Zero behavior change (Ped/Bike tab works identically).

## Final report

```
CC Session U complete (18-v2 pedbike-tab, SUPERVISED).
- app/index.html: <baseline> → <new> (−<delta>, target ~3,468)
- 7 new pedbike/* modules (all ≤500, node --check clean, registered)
- CL.pedbike root added to loader.js
- Smoke: Ped/Bike tab green per child, playwright-cli console clean
- Branch: claude/pre-author-extraction-prompts-kObuK (pushed; no PR)
```
