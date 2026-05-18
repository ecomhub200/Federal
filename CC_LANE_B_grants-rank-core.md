# CC Lane B (Parallel Round 1) — `app/modules/grants/grants-rank-core.js`

**Severity:** Refactor (no behavior change). **ONE file per session — do NOT
batch with any other extraction prompt (A/C are separate sessions).**

Read `CLAUDE.md` (repo root) → "Modular Extraction Refactor" + "Extraction
rules — follow EXACTLY" before any edit. Self-contained prompt.

> ⚠️ **INDEX_MAP*.md is stale** (159,387-line snapshot; live ≈136,581). Trust
> the **divider text / name anchors** below, NEVER a snapshot line range.
> Re-derive the live block by brace read in §0.

## Branch

**`claude/lane-b-grants-rank-core`** (from latest `origin/main`). No PR. No
push elsewhere.

```bash
git checkout main && git pull origin main
git checkout -b claude/lane-b-grants-rank-core
```

## §0 Pre-flight verification (run BEFORE editing — ABORT on any failure)

```bash
wc -l app/index.html                                   # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html      # record N_FNS

# 1. Locate the block by NAME ANCHOR (snapshot ~L29676–L30066, feature:
#    GRANT MODULE FUNCTIONS — CSV/program load + state-grant display).
grep -nE '// GRANT MODULE FUNCTIONS|^async function +loadGrantsCSV\b|^function +_renderGrantDeadline\b|^function +renderGrantCard\b' app/index.html
#    Expected ordering:
#      • // ===…  // GRANT MODULE FUNCTIONS  // ===…  banner  → BLK_START = the first banner `// ===` line
#      • async function loadGrantsCSV()
#      • … (getStateGrantPrograms, getAllGrants, initGrantModule,
#            mergeGrantProgramsFromSupabase, searchGrantsGovKeyword,
#            openGrantsGovNewTab, displayStateGrants, const
#            displayVirginiaGrants alias, _renderGrantDeadline,
#            + ANY other decl between the banner and renderGrantCard) …
#      • function renderGrantCard(grant)   ← FIRST decl AFTER the block; do NOT move it
#    Brace-read every declaration from BLK_START up to (but NOT including)
#    `function renderGrantCard` → BLK_END is the blank line immediately
#    before `function renderGrantCard`. Move the ENTIRE contiguous run
#    (every helper between the banner and renderGrantCard), not only the
#    named anchors. Use the LIVE [BLK_START, BLK_END].

# 2. Off-limits cross-check. CLAUDE.md off-limits grants modules are
#    `grants/ranking` (EPDO/scoring math) and `grants/grants-ui`
#    (modals + AI + 4-agent orchestration). The moved block is the
#    CSV/program LOADER + state-grant LIST display — distinct. Prove no
#    moved name is already exported there:
for fn in loadGrantsCSV getStateGrantPrograms getAllGrants initGrantModule mergeGrantProgramsFromSupabase searchGrantsGovKeyword openGrantsGovNewTab displayStateGrants displayVirginiaGrants _renderGrantDeadline; do
  grep -rln "function $fn\b\|\.$fn *=\|$fn *= *function\|$fn *= *async" app/modules/grants/ 2>/dev/null && echo "ABORT: $fn already in a grants module" || true
done
echo "if nothing printed ABORT above → OK"
#    Also re-list the brace-derived decl set and eyeball each against the
#    full CLAUDE.md off-limits list.

# 3. Target must not exist
test -f app/modules/grants/grants-rank-core.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Load anchor present (exactly 1 match)
grep -n '<script src="modules/grants/grants-ui.js"></script>' app/index.html
```
ABORT and report if: block not contiguous, any moved name already lives in an
off-limits module, target exists, or anchor missing. **Do not edit.**

## §1 What to move

The single contiguous `[BLK_START, BLK_END]` from §0 — the
`// GRANT MODULE FUNCTIONS` banner + **every declaration up to (not
including) `renderGrantCard`**, **verbatim, byte-for-byte**. Named anchors
(not exhaustive — move ALL decls in the run):
`loadGrantsCSV`, `getStateGrantPrograms`, `getAllGrants`, `initGrantModule`,
`mergeGrantProgramsFromSupabase`, `searchGrantsGovKeyword`,
`openGrantsGovNewTab`, `displayStateGrants`, `const displayVirginiaGrants =
displayStateGrants` (legacy alias — move with it), `_renderGrantDeadline`.

**`grantState` is an app-wide shared global** read by remaining inline code
(and the off-limits `grants-ui`/`ranking` modules). It is **NOT** declared in
this block — do NOT move or re-declare it. The moved functions reference bare
`grantState`, `VIRGINIA_GRANTS`, `jurisdictionContext`,
`applyGrantFiltersToList`, `updateGrantFilterInfo`, `displayFavorites`, etc.;
these resolve via the shared classic-script global lexical environment exactly
as today (same precedent as `cmf/cmf-search.js` leaving `cmfState` inline). No
window-mirror of `grantState` is needed and adding one would be an
out-of-block edit — do not.

No renames/reformatting. If the block exceeds ~500 lines, STOP and report
(it would need the further sub-split noted for grants in `MODULAR_PLAN.md`).

## §2 Where to put it — create `app/modules/grants/grants-rank-core.js`

```js
/**
 * CL grants.rankCore module — grant CSV/program loaders + state-grant
 * list display. Extracted verbatim from app/index.html (Parallel Round 1,
 * Lane B). Shared global `grantState` stays inline (global lexical env).
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.grants = CL.grants || {};

  // <<< PASTE THE VERBATIM BLOCK HERE (banner + all decls up to renderGrantCard) >>>

  // Dual public API — one pair per MOVED function (use the actual
  // brace-derived set; the list below is the expected anchor set):
  window.loadGrantsCSV = loadGrantsCSV;
  window.getStateGrantPrograms = getStateGrantPrograms;
  window.getAllGrants = getAllGrants;
  window.initGrantModule = initGrantModule;
  window.mergeGrantProgramsFromSupabase = mergeGrantProgramsFromSupabase;
  window.searchGrantsGovKeyword = searchGrantsGovKeyword;
  window.openGrantsGovNewTab = openGrantsGovNewTab;
  window.displayStateGrants = displayStateGrants;
  window.displayVirginiaGrants = displayVirginiaGrants;
  window._renderGrantDeadline = _renderGrantDeadline;
  CL.grants.loadGrantsCSV = loadGrantsCSV;
  CL.grants.getStateGrantPrograms = getStateGrantPrograms;
  CL.grants.getAllGrants = getAllGrants;
  CL.grants.initGrantModule = initGrantModule;
  CL.grants.mergeGrantProgramsFromSupabase = mergeGrantProgramsFromSupabase;
  CL.grants.searchGrantsGovKeyword = searchGrantsGovKeyword;
  CL.grants.openGrantsGovNewTab = openGrantsGovNewTab;
  CL.grants.displayStateGrants = displayStateGrants;
  CL.grants.displayVirginiaGrants = displayVirginiaGrants;
  CL.grants._renderGrantDeadline = _renderGrantDeadline;
  // If §0's brace read found ADDITIONAL decls in the run, add a
  // window.<fn> + CL.grants.<fn> pair for each (every moved fn gets both).

  CL._registerModule('grants/grants-rank-core');
})();
```

No ES module syntax — raw `<script src>` + IIFE only.

## §3 Wiring — add the script tag

Immediately AFTER the `grants-ui.js` line from §0.4 (EARLY cluster):

```html
<script src="modules/grants/grants-ui.js"></script>
<script src="modules/grants/grants-rank-core.js"></script>
```
> `grants-ui` only *calls* these loaders at runtime (not at module top
> level), so placing this immediately after it is load-order safe.

## §4 Delete from `app/index.html`

Remove **exactly** `[BLK_START, BLK_END]`. `function renderGrantCard` and
everything after stays.

## §5 Post-flight (all must pass)

```bash
wc -l app/index.html                                   # ≈ N_LINES − blocksize (~385)
grep -cE '^\s*(async\s+)?function ' app/index.html      # = N_FNS − (#moved function decls)
node --check app/modules/grants/grants-rank-core.js
git diff --stat                                        # ONLY app/index.html + the new module
```
Console must show `[CL] Module loaded: grants/grants-rank-core`.

## §6 Playwright smoke on the deployed page

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # NO new errors
# open the Grants tab → confirm state-grant cards still render (loadGrantsCSV +
# displayStateGrants path) and grants.gov search buttons work
playwright-cli screenshot --filename=lane-b-grants-after.png
playwright-cli close
```
> If GitHub Pages lags this branch, say so; still confirm every moved fn is
> reachable via `window.*` and `CL.grants.*` and the Grants tab renders.

## §7 Commit + push (no PR)

```bash
git add app/index.html app/modules/grants/grants-rank-core.js
git commit -m "Lane B: extract grants-rank-core (CSV/program loaders + state-grant display)"
git push -u origin claude/lane-b-grants-rank-core   # retry x4 backoff on network error
```

**Conflict guard:** A/B/C edit `app/index.html` ~12K+ lines apart (B @ L29K).
If last to merge and conflict: `git pull origin main && git rebase main`,
resolve the trivial far-apart hunk, re-run §5.
