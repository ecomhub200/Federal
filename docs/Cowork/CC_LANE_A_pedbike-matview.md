# CC Lane A (Parallel Round 1) — `app/modules/pedbike/pedbike-tab-locations.js`

**Severity:** Refactor (no behavior change). **ONE file per session — do NOT
batch with any other extraction prompt (B/C are separate sessions).**

Read `CLAUDE.md` (repo root) → "Modular Extraction Refactor (Round X+)" +
"Extraction rules — follow EXACTLY" before any edit. This prompt is
self-contained.

> ⚠️ **Stale-orchestration note.** The original "Lane A = 18c (pedbike
> bike-core)" is **already merged** (commit `a0d05c9`, PR #158). This lane is
> re-targeted to the pedbike **matview-locations** cluster, which is still
> inline. Do NOT look for 18c work.
>
> ⚠️ **INDEX_MAP*.md is stale** (built from a 159,387-line snapshot; live file
> ≈136,581). Trust the **name anchors / divider text** below, NEVER a snapshot
> line range. Re-derive the live block by brace read in §0.

## Branch

Develop, commit, push on **`claude/lane-a-pedbike-matview`** (create from
latest `origin/main`). No PR (the orchestrator opens/merges lane PRs). No push
elsewhere.

```bash
git checkout main && git pull origin main
git checkout -b claude/lane-a-pedbike-matview
```

## §0 Pre-flight verification (run BEFORE editing — ABORT on any failure)

```bash
# Baseline ledger (proves "no behavior change" by line/fn delta)
wc -l app/index.html                                   # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html      # record N_FNS

# 1. Locate the block by NAME ANCHOR (snapshot ~L57293–L57476, feature:
#    Round 12 Ped/Bike High-Crash Locations + Comparison from matview).
grep -nE 'Round 12 — Ped/Bike High-Crash Locations|function +renderPedBikeLocationsFromMatview\b|function +renderPedBikeComparisonTableFromCats\b|^(async )?function +updatePeopleAnalysis\b' app/index.html
#    Expected ordering:
#      • banner comment line  (// ──── Round 12 — Ped/Bike High-Crash Locations…)  → BLK_START (the FIRST banner line)
#      • async function renderPedBikeLocationsFromMatview(dc, tierResolved)
#      • function renderPedBikeComparisonTableFromCats(categories)
#      • function updatePeopleAnalysis()   ← FIRST line AFTER the block; do NOT move it
#    Brace-read from BLK_START to the closing `}` of
#    renderPedBikeComparisonTableFromCats → that `}` is BLK_END (the blank
#    line before `function updatePeopleAnalysis` is the boundary). Use the
#    LIVE [BLK_START, BLK_END]; ignore the snapshot numbers from here on.

# 2. Off-limits cross-check. The ONLY moved declarations are
#    renderPedBikeLocationsFromMatview + renderPedBikeComparisonTableFromCats
#    (+ the banner comment). Confirm neither name appears as an already-
#    extracted export in any app/modules/pedbike/*.js:
grep -rn 'renderPedBikeLocationsFromMatview\|renderPedBikeComparisonTableFromCats' app/modules/pedbike/ || echo "OK: not yet extracted"
#    (Off-limits pedbike modules: pedbike-tab-ped-core, -ped-detail,
#    -ped-detail-charts, -bike-core. None define these two fns.)

# 3. Target module must not exist
test -f app/modules/pedbike/pedbike-tab-locations.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Confirm load anchor present (exactly 1 match)
grep -n '<script src="modules/pedbike/pedbike-tab-bike-core.js"></script>' app/index.html
```
If the block is not contiguous, a name maps to an already-extracted module,
the target exists, or the anchor is missing: **ABORT and report — do not edit.**

## §1 What to move

The single contiguous block `[BLK_START, BLK_END]` confirmed in §0 — the Round
12 banner comment + **exactly two** functions, **verbatim, byte-for-byte**
(preserve every blank line, comment, indent):

- `async function renderPedBikeLocationsFromMatview(dc, tierResolved)`
- `function renderPedBikeComparisonTableFromCats(categories)`

**No app-wide global is moved** (these are self-contained renderers; they only
*call* `calcEPDO`, `createChart`, `clearChartPlaceholder`, `crashState`, etc.,
which stay where they are). `updatePeopleAnalysis` (the caller, first decl
after BLK_END) **stays inline**. No renames, no reformatting, no "improvements".
If the confirmed block exceeds ~500 lines, STOP and report.

## §2 Where to put it — create `app/modules/pedbike/pedbike-tab-locations.js`

```js
/**
 * CL pedbike.locations module — Round 12 Ped/Bike High-Crash Locations +
 * Comparison table painted from mv_pedbike_locations / safety_categories.
 * Extracted verbatim from app/index.html (Parallel Round 1, Lane A).
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.pedbike = CL.pedbike || {};

  // <<< PASTE THE VERBATIM BLOCK HERE (banner comment + both functions) >>>

  // Dual public API (HTML/hoisting back-compat + namespaced)
  window.renderPedBikeLocationsFromMatview = renderPedBikeLocationsFromMatview;
  window.renderPedBikeComparisonTableFromCats = renderPedBikeComparisonTableFromCats;
  CL.pedbike.renderPedBikeLocationsFromMatview = renderPedBikeLocationsFromMatview;
  CL.pedbike.renderPedBikeComparisonTableFromCats = renderPedBikeComparisonTableFromCats;

  CL._registerModule('pedbike/pedbike-tab-locations');
})();
```

No ES module syntax (`import`/`export`) — raw `<script src>` + IIFE only.

## §3 Wiring — add the script tag

Immediately AFTER the `pedbike-tab-bike-core.js` line confirmed in §0.4:

```html
<script src="modules/pedbike/pedbike-tab-bike-core.js"></script>
<script src="modules/pedbike/pedbike-tab-locations.js"></script>
```

## §4 Delete from `app/index.html`

Remove **exactly** `[BLK_START, BLK_END]` (the banner + both functions).
Nothing else. The `}` / blank line before `function updatePeopleAnalysis`
remains; that function and everything else is untouched.

## §5 Post-flight (all must pass)

```bash
wc -l app/index.html                                   # ≈ N_LINES − blocksize
grep -cE '^\s*(async\s+)?function ' app/index.html      # = N_FNS − 2
node --check app/modules/pedbike/pedbike-tab-locations.js
git diff --stat                                        # ONLY app/index.html + the new module
```
Open the app; console must show `[CL] Module loaded: pedbike/pedbike-tab-locations`.

## §6 Playwright smoke (per CLAUDE.md) on the deployed page

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # confirm NO new errors
# drive the Ped/Bike (People Analysis) tab so the matview renderers fire
playwright-cli screenshot --filename=lane-a-pedbike-after.png
playwright-cli close
```
> If the deployed GitHub Pages site is not yet up to date with this branch,
> say so explicitly rather than skipping — drive the affected tab anyway and
> confirm the two functions are still reachable via `window.*`/`CL.pedbike.*`.

## §7 Commit + push (no PR)

```bash
git add app/index.html app/modules/pedbike/pedbike-tab-locations.js
git commit -m "Lane A: extract pedbike-tab-locations (matview renderers)"
git push -u origin claude/lane-a-pedbike-matview   # retry x4 backoff 2/4/8/16s on network error
```

**Conflict guard:** Lanes A/B/C touch `app/index.html` ~28K lines apart
(L57K vs L41K vs L29K) → near-zero textual conflict. If you are last to merge
and a conflict occurs: `git pull origin main && git rebase main`, resolve the
trivial hunk (your deletion is far from theirs), re-run §5.
