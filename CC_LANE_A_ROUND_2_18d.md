# CC Lane A — Round 2 — 18d pedbike-tab-bike-detail (single-lane)

**Goal:** Extract exactly **one** child — 18d `pedbike/pedbike-tab-bike-detail.js`
(bike detail panel + charts + monthly heatmap) — from `app/index.html`. One
extraction, one commit, one push. No PR.

**Cluster:** `app/modules/pedbike/` ONLY. **Conflict awareness:** Round 2 runs
this in parallel with Lane B (`grants/`) and Lane C (`filters/`) — disjoint
clusters, never edit outside `pedbike/` + the single contiguous bike-detail
block in `app/index.html`.

**Source prompt (authoritative, do NOT edit):**
`modular-prompts/18-v2-pedbike-tab.md` (U4 row of `CC_SESSION_U_PEDBIKE_SUPERVISED.md`).

## Branch

Develop, commit, push on the **harness-designated branch** (Git Development
Branch Requirement). The nominal lane branch is `claude/lane-a-r2-18d`; if the
harness mandates a different branch, the harness mandate **wins** (same
precedent as CC_SESSION_U/V). No push elsewhere without explicit permission.
**No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
cat modular-prompts/18-v2-pedbike-tab.md      # §0–§8 source of truth (U4)
wc -l app/index.html                          # RECORD BASELINE
```

⚠️ **All line numbers are advisory.** Re-derive the block by **name anchor +
brace read** at run time. Live `app/index.html` has drifted across snapshots
(136k–153k); never trust a `@NNNNN`.

## §0 Pre-flight — derive boundaries, then ABORT-check

```bash
grep -nE '^(async )?function +updateBikeDetailPanel\b'   app/index.html  # band START
grep -nE '^(async )?function +(initBikeDetailCharts|renderBikeMonthlyHeatmap)\b' app/index.html
grep -nE '^(async )?function +setPedViewMode\b'          app/index.html  # band END = fn BEFORE this
test -f app/modules/pedbike/pedbike-tab-bike-detail.js && echo ABORT-EXISTS || echo OK
grep -n '<script src="modules/pedbike/pedbike-tab-bike-core.js"></script>' app/index.html  # load anchor (0 ⇒ fall back to data/supabase-map-bridge.js, LATE cluster)
```

Brace-read `updateBikeDetailPanel` → last fn before `setPedViewMode`. Record
start/end lines + LOC.

**ABORT if:** target exists · band not contiguous · `updateBikeDetailPanel`
or `setPedViewMode` anchor missing/duplicated · the slice splits a function ·
any moved name maps to an off-limits module (CLAUDE.md §protected list — note
`pedbike-tab-bike-core.js` itself is off-limits; do NOT touch it).

**≤500 rule:** if the block > 500 LOC by brace read, **split before
`renderBikeMonthlyHeatmap`**:
- `pedbike/pedbike-tab-bike-detail.js` — `updateBikeDetailPanel`,
  `initBikeDetailCharts` (~492)
- `pedbike/pedbike-tab-bike-detail-charts.js` — `renderBikeMonthlyHeatmap`
  (+ any contiguous bike-detail export tail the brace read proves in-band)

## §2 Skeleton (per module)

```js
/** CL pedbike.tab — 18d extracted (name-anchored) <run date>.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Reads bikeAnalysisState (declared inline by 18c bike-core; window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  CL._registerModule('pedbike/pedbike-tab-bike-detail');
})();
```

Dual public API: expose **both** `window.<fn>` AND `CL.pedbike.tab.<fn>` for
every moved fn (HTML `onclick=`/hoisting back-compat).

## §3 Script tag (LATE cluster)

Insert after `<script src="modules/pedbike/pedbike-tab-bike-core.js">` if that
tag exists; else after `<script src="modules/data/supabase-map-bridge.js">`
(the pedbike LATE cluster anchor per CC_SESSION_U §3). On a split, the
`-charts.js` tag goes immediately after the `-bike-detail.js` tag.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete the verbatim block from `app/index.html`.

## §5 Post-flight

```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/pedbike/pedbike-tab-bike-detail.js   # + -charts.js if split
grep -nE 'function +(updateBikeDetailPanel|initBikeDetailCharts|renderBikeMonthlyHeatmap)\b' app/index.html  # expect 0
grep -c '<script src="modules/pedbike/pedbike-tab-bike-detail.js"></script>' app/index.html  # 1
git diff --stat   # ONLY app/index.html + the new module(s)
```
`wc -l` must drop ≈ block size. Console: `[CL] Module loaded: pedbike/pedbike-tab-bike-detail`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console          # NO new errors
# Ped/Bike tab → select a location with bike crashes → bike detail panel +
# charts + monthly heatmap render; confirm ALL crashes load (not just sample).
playwright-cli close
```
If deployed Pages is behind this branch, say so explicitly — do not skip.

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/pedbike/pedbike-tab-bike-detail.js  # + -charts.js if split
```

## §8 Out of scope

`pedbike-tab-bike-core.js` + every other off-limits module; `bikeAnalysisState`
(stays inline, window-mirror only); ped-* siblings; PEOPLE INJURY ANALYSIS
band; renames; reformatting; any non-pedbike cluster; PR.

## Commit & push

One commit (`Lane A R2: extract 18d pedbike-tab-bike-detail`), push to the
harness-designated branch with `git push -u origin <branch>` (retry on network
error: backoff 2s/4s/8s/16s, max 4). **No PR.**

## Final report

```
CC Lane A R2 complete (18d pedbike-tab-bike-detail).
- app/index.html: <baseline> → <new> (−<delta>)
- new module(s): pedbike/pedbike-tab-bike-detail[.js / -charts.js] (≤500, node --check clean, registered)
- Smoke: Ped/Bike bike-detail green, playwright-cli console clean
- Branch: <harness branch> (pushed; no PR)
```
