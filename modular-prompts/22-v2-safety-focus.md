# CC Modular Extraction Prompt 22-v2 — `app/modules/safety/safety-focus.js`

**Supersedes `modular-prompts/22-safety-safety-focus.md`** (stale snapshot
L99600–L105299 — that file is byte-unmodified; see
`modular-prompts/SUPERSEDED.md`). Re-anchored 2026-05-17 (CC Session H) against
live `app/index.html` @ **149,314 lines**. Source risk doc:
`BATCH_5_PROMPT_22_RISK.md`.

**Severity:** Refactor (no behavior change). **One file per session — do NOT
batch.** **Run AFTER prompt 21-v2.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive the ACTUAL block by brace read in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block by NAME. Live anchors:
#      safetyState        ~L91522   (module-private global — head of region)
#      initSafetyFocus    ~L92403   (~881 lines after safetyState)
#      updateSafetyCards  ~L92871
grep -nE 'function +(initSafetyFocus|updateSafetyCards)\b|(const|let|var) +safetyState\b' app/index.html
#    Read the braces. The Safety Focus region is contiguous ≈ L91522–L95360
#    (~1,400 LOC region per BATCH_5_PROMPT_22_RISK.md §1), bounded by the next
#    named decl after updateSafetyCards' cluster. Use brace-derived
#    [BLK_START, BLK_END]; safetyState (~L91522) sits at the HEAD of the same
#    region (NOT stranded in the global cluster — contrast prompt 20's
#    crashTreeState). BLK_START should be at/just before safetyState.

# 2. Confirm safetyState moves with the block (it is contiguous).
grep -n 'safetyState' app/index.html | awk -F: '$1<'"<BLK_START>"' || $1>'"<BLK_END>"''
#    EXPECTED: no inline reader OUTSIDE [BLK_START,BLK_END]. If clean →
#    safetyState moves inside the module verbatim. If any external reader
#    exists → keep it inline + `window.safetyState` mirror (fallback).

# 3. Target module must not exist yet
test -f app/modules/safety/safety-focus.js && echo "ABORT: exists" || echo "OK"

# 4. Confirm load anchor present (PREREQUISITE — prompt 21-v2)
grep -n '<script src="modules/fatal-speeding/fatal-speeding-tab.js"></script>' app/index.html
#    EXPECTED TODAY: 0 → prompt 21-v2 not shipped. Documented gate: ABORT
#    until fatal-speeding/fatal-speeding-tab.js exists + is wired.
```
If any check fails (block not contiguous, target exists, **anchor missing —
21-v2 not shipped**, any name off-limits): **ABORT and report — do not edit.**

> Note: MODULAR_PLAN R5 flagged an old `33↔22` snapshot-edge touch at the
> stale L99600. With the live anchors this is **moot** — 33's cluster is
> ~L82.7k, 22's is ~L91.5–95.4k; **no overlap**.

## §1 What to move

> 🔴 **LARGE BLOCK — Cowork supervised.** **STOP after the §0 grep**: surface
> §0 output (BLK_START/BLK_END, the safetyState contiguity check, moved-fn
> list) for human verification **BEFORE** finalizing §1 and **BEFORE** any §4
> delete.

The **single contiguous block [BLK_START, BLK_END]** from §0. Anchors:
`initSafetyFocus` (~L92403), `updateSafetyCards` (~L92871), plus the Safety
Focus helpers. Module-private global **`safetyState`** (~L91522) is contiguous
at the head of the region and **moves with the block** (verbatim, in place) —
unless §0 step 2 finds an external reader, in which case keep inline + mirror.
Not inside a foreign IIFE (risk doc §1).

Copy bytes **verbatim**. No renames/reformatting. If the block is far from the
~1,400 LOC estimate, STOP — anchor/brace read is wrong.

## §2 Where to put it
Create `app/modules/safety/safety-focus.js`:

```js
/**
 * CL safety.focus module — extracted (name-anchored) on 2026-05-17.
 * Round X modular refactor — see modular-prompts/22-v2-safety-focus.md.
 * Responsibility: Safety Focus tab — category data + cards + monthly heatmap.
 * Public API (dual exposure):
 *   window.initSafetyFocus   → CL.safety.focus.initSafetyFocus
 *   window.updateSafetyCards → CL.safety.focus.updateSafetyCards
 * Module-private state: safetyState (moved with block; not onclick-bound).
 * Depends on: core/constants, fatal-speeding/fatal-speeding-tab (script order).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted contiguous block here (incl. safetyState), unchanged>

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.safety = CL.safety || {}; CL.safety.focus = CL.safety.focus || {};
  window.initSafetyFocus = initSafetyFocus;
  CL.safety.focus.initSafetyFocus = initSafetyFocus;
  window.updateSafetyCards = updateSafetyCards;
  CL.safety.focus.updateSafetyCards = updateSafetyCards;
  CL._registerModule('safety/safety-focus');
})();
```
Path-style registration `'safety/safety-focus'`. Add `CL.safety` to
`loader.js` ONLY if absent.

## §3 Wire the script tag
Immediately AFTER
`<script src="modules/fatal-speeding/fatal-speeding-tab.js"></script>` (LATE):
```html
<script src="modules/safety/safety-focus.js"></script>
```

## §4 Remove the original code from `app/index.html`
**(Cowork pause must have cleared §0/§1 first.)**
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# After head/tail confirm, delete that exact line range (incl. safetyState
# if §0 step 2 was clean).
```

## §5 Post-flight verification
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # − moved-fn count
node --check app/modules/safety/safety-focus.js                     # pass
grep -nE 'function +(initSafetyFocus|updateSafetyCards)\b' app/index.html          # 0
grep -nE 'function +(initSafetyFocus|updateSafetyCards)\b' app/modules/safety/safety-focus.js  # 2
grep -n 'safetyState' app/index.html        # 0 (if moved) — else only the mirror
grep -c '<script src="modules/safety/safety-focus.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the new module
```
Console: `[CL] Module loaded: safety/safety-focus`.

## §6 Functional smoke test
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the Safety Focus tab (category cards populate, heatmap renders).
`typeof window.initSafetyFocus === 'function'`. `playwright-cli close`.

## §7 Rollback
```bash
git checkout -- app/index.html && rm app/modules/safety/safety-focus.js
```

## §8 Out of scope
Renames/reformatting; other modules; off-limits modules; moving app-wide
shared globals (`COL`, `crashState` — window mirror only); CLAUDE.md edits;
PR unless asked.

---
### Prerequisite & ordering
- **Gated by prompt 21-v2** (load anchor =
  `fatal-speeding/fatal-speeding-tab.js`).
- Position 4, last in 19 → 20 → 21 → **22**. `safetyState` is contiguous
  (lower risk than prompt 20's non-contiguous `crashTreeState`).
