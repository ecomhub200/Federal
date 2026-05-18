# CC Lane C (Parallel Round 1) — `app/modules/data/filter-wiring-core.js`

**Severity:** Refactor (no behavior change). **ONE file per session — do NOT
batch with any other extraction prompt (A/B are separate sessions).**
**Highest-risk lane of Round 1** — read §1 globals note twice.

Read `CLAUDE.md` (repo root) → "Modular Extraction Refactor" + "Extraction
rules — follow EXACTLY" before any edit. Self-contained prompt.

> ⚠️ **INDEX_MAP*.md is stale** (159,387-line snapshot; live ≈136,581). Trust
> the **name anchors** below, NEVER a snapshot line range. Re-derive the live
> block by brace read in §0.
>
> ⚠️ This block is **distinct** from the off-limits
> `app/modules/data/dashboard-filter-bindings.js` (the Round-18/19
> filter-audit IIFE). That module is already extracted; do NOT touch it and do
> NOT move anything it owns.

## Branch

**`claude/lane-c-filter-wiring-core`** (from latest `origin/main`). No PR. No
push elsewhere.

```bash
git checkout main && git pull origin main
git checkout -b claude/lane-c-filter-wiring-core
```

## §0 Pre-flight verification (run BEFORE editing — ABORT on any failure)

```bash
wc -l app/index.html                                   # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html      # record N_FNS

# 1. Locate by NAME ANCHOR (snapshot ~L41667–L41941, feature: core dashboard
#    filter apply/reset/UI-reset/filtered-stats).
grep -nE 'window\._refetchFSMatviewsWithDate *=|^function +applyFilters\b|^function +resetFilters\b|^function +resetFilterUI\b|^function +getFilteredStats\b|^function +setDashboardLoadingState\b' app/index.html
#    Expected ordering:
#      • window._refetchFSMatviewsWithDate = …;   ← LAST line BEFORE the block (a
#                                                    DIFFERENT feature — do NOT move it)
#      • function applyFilters()        ← BLK_START
#      • function resetFilters()
#      • function resetFilterUI()
#      • function getFilteredStats()
#      • function setDashboardLoadingState(…)  ← FIRST decl AFTER the block; do NOT move it
#    Brace-read applyFilters → … → the closing `}` of getFilteredStats.
#    BLK_END = that `}` (blank line before `function
#    setDashboardLoadingState`). Move the ENTIRE contiguous run between
#    BLK_START and BLK_END (any helper decl found in between included).
#    Use the LIVE [BLK_START, BLK_END].

# 2. Off-limits cross-check — confirm none of the moved names are owned by
#    data/dashboard-filter-bindings or any other extracted data/* module:
for fn in applyFilters resetFilters resetFilterUI getFilteredStats; do
  grep -rln "function $fn\b\|\.$fn *=\|$fn *= *function" app/modules/data/ 2>/dev/null && echo "ABORT: $fn already in a data module" || true
done
echo "if nothing ABORTed above → OK"
#    Eyeball the brace-derived decl set vs the full CLAUDE.md off-limits list.

# 3. Target must not exist
test -f app/modules/data/filter-wiring-core.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Load anchor present (exactly 1 match)
grep -n '<script src="modules/data/supabase-map-bridge.js"></script>' app/index.html
```
ABORT and report if: block not contiguous, a moved name lives in an off-limits
module, target exists, or anchor missing. **Do not edit.**

## §1 What to move + ⚠️ GLOBALS RULE

The single contiguous `[BLK_START, BLK_END]` from §0 — **verbatim,
byte-for-byte**. Named anchors (move ALL decls in the run):
`applyFilters`, `resetFilters`, `resetFilterUI`, `getFilteredStats`.

**`currentFilters` is an app-wide shared mutable global** read AND written by
large amounts of remaining inline code and other modules. It is **NOT**
declared inside this block.

- **Do NOT move, re-declare, or `const`/`let` it in the module.**
- The moved functions reference bare `currentFilters`, `crashState`,
  `updateDashboard`, `updateMapDisplay`, `crashMap`, `updateDashboardFromMatview`,
  `window._readGlobalFilterSpec`, `window.FilterEngine`, etc. These resolve via
  the shared classic-script global lexical environment / `window` exactly as
  today (same precedent as `cmf/cmf-search.js` `cmfState`). Adding a
  `currentFilters` window-mirror would be an out-of-block edit AND is
  unnecessary (it is already a top-level `var`/global) — **do not add one.**
- `window._refetchFSMatviewsWithDate = …` on the line *before* `applyFilters`
  is a **different feature** — it is the boundary marker, NOT part of the
  block. Do not move it.

No renames/reformatting. If the block exceeds ~500 lines, STOP and report.

## §2 Where to put it — create `app/modules/data/filter-wiring-core.js`

```js
/**
 * CL data.filterWiringCore module — core dashboard filter apply/reset/
 * UI-reset/filtered-stats. Extracted verbatim from app/index.html
 * (Parallel Round 1, Lane C). Shared global `currentFilters` stays inline
 * (global lexical env) — intentionally NOT mirrored.
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.data = CL.data || {};

  // <<< PASTE THE VERBATIM BLOCK HERE (applyFilters … getFilteredStats) >>>

  // Dual public API — one pair per MOVED function (HTML onclick= calls
  // applyFilters()/resetFilters() so the window.* mirror is mandatory):
  window.applyFilters = applyFilters;
  window.resetFilters = resetFilters;
  window.resetFilterUI = resetFilterUI;
  window.getFilteredStats = getFilteredStats;
  CL.data.applyFilters = applyFilters;
  CL.data.resetFilters = resetFilters;
  CL.data.resetFilterUI = resetFilterUI;
  CL.data.getFilteredStats = getFilteredStats;
  // Add a window.<fn> + CL.data.<fn> pair for ANY additional decl §0's
  // brace read found inside the run.

  CL._registerModule('data/filter-wiring-core');
})();
```

No ES module syntax — raw `<script src>` + IIFE only.

## §3 Wiring — add the script tag

Immediately AFTER the `supabase-map-bridge.js` line from §0.4 (LATE cluster).
`currentFilters` and all callees are global, so LATE placement is safe (these
fns are only invoked on user interaction / after load):

```html
<script src="modules/data/supabase-map-bridge.js"></script>
<script src="modules/data/filter-wiring-core.js"></script>
```
> Re-confirm in §0.4 that `supabase-map-bridge.js` is the last data/* tag
> before the dashboard-filter-bindings tag; if the cluster differs, place
> immediately after `supabase-map-bridge.js` and note the deviation.

## §4 Delete from `app/index.html`

Remove **exactly** `[BLK_START, BLK_END]`. The
`window._refetchFSMatviewsWithDate = …` line before it and
`function setDashboardLoadingState` after it both stay.

## §5 Post-flight (all must pass)

```bash
wc -l app/index.html                                   # ≈ N_LINES − blocksize (~275)
grep -cE '^\s*(async\s+)?function ' app/index.html      # = N_FNS − (#moved function decls)
node --check app/modules/data/filter-wiring-core.js
git diff --stat                                        # ONLY app/index.html + the new module
```
Console must show `[CL] Module loaded: data/filter-wiring-core`.

## §6 Playwright smoke on the deployed page

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # NO new errors
# Dashboard tab: set a date/severity filter → click Apply → KPIs update;
# click Reset → KPIs return to baseline. (applyFilters/resetFilters path)
playwright-cli screenshot --filename=lane-c-filter-after.png
playwright-cli close
```
> If GitHub Pages lags this branch, say so; still confirm `window.applyFilters`
> / `window.resetFilters` are defined and the Apply/Reset buttons fire.

## §7 Commit + push (no PR)

```bash
git add app/index.html app/modules/data/filter-wiring-core.js
git commit -m "Lane C: extract filter-wiring-core (applyFilters/resetFilters/resetFilterUI/getFilteredStats)"
git push -u origin claude/lane-c-filter-wiring-core   # retry x4 backoff on network error
```

**Conflict guard:** A/B/C edit `app/index.html` ~12K+ lines apart (C @ L41K,
between B @ L29K and A @ L57K). If last to merge and conflict:
`git pull origin main && git rebase main`, resolve the trivial far-apart hunk,
re-run §5. **Because this is the highest-risk lane, also re-run §6 after any
rebase.**
