# CC Modular Extraction Prompt 21-v2 — `app/modules/fatal-speeding/fatal-speeding-tab.js`

**Supersedes `modular-prompts/21-fatal-speeding-fatal-speeding-tab.md`** (stale
snapshot L109100–L113700 — that file is byte-unmodified; see
`modular-prompts/SUPERSEDED.md`). Re-anchored 2026-05-17 (CC Session H) against
live `app/index.html` @ **149,314 lines**. Source risk doc:
`BATCH_5_PROMPT_21_RISK.md`.

**Severity:** Refactor (no behavior change). **One file per session — do NOT
batch.** **Run AFTER prompt 20-v2.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive the ACTUAL block by brace read in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block by NAME. Live anchors:
#      initFatalSpeedingTab  ~L101856
#      applyFSFilters        ~L102465   (~609 lines after init)
grep -nE 'function +(initFatalSpeedingTab|applyFSFilters)\b|(initFatalSpeedingTab|applyFSFilters) *= *(async +)?(function|\()' app/index.html
#    Read the braces. The Fatal & Speeding region is one contiguous band
#    (~640 LOC per BATCH_5_PROMPT_21_RISK.md §1) bounded by the next named
#    decl after applyFSFilters' cluster. Use the brace-derived
#    [BLK_START, BLK_END], NOT any snapshot.

# 2. No module-private global for this module (risk doc §2 — none). Confirm:
#    body reads only COL / crashState / jurisdictionContext (app-wide shared —
#    leave inline, window mirror, do NOT relocate). No non-contiguous state.

# 3. Target module must not exist yet
test -f app/modules/fatal-speeding/fatal-speeding-tab.js && echo "ABORT: exists" || echo "OK"

# 4. Confirm load anchor present (PREREQUISITE — prompt 20-v2)
grep -n '<script src="modules/crash-tree/crash-tree-tab.js"></script>' app/index.html
#    EXPECTED TODAY: 0 → prompt 20-v2 not shipped. Documented gate: ABORT
#    until crash-tree/crash-tree-tab.js exists + is wired.
```
If any check fails (block not contiguous, target exists, **anchor missing —
20-v2 not shipped**, any name off-limits): **ABORT and report — do not edit.**

## §1 What to move

> 🔴 **LARGE BLOCK — Cowork supervised.** **STOP after the §0 grep**: surface
> §0 output (BLK_START/BLK_END, the two anchor lines, moved-fn list) for human
> verification **BEFORE** finalizing §1 and **BEFORE** any §4 delete.

The **single contiguous block [BLK_START, BLK_END]** from §0. Anchors:
`initFatalSpeedingTab` (~L101856), `applyFSFilters` (~L102465), plus the Fatal
& Speeding helpers between/around them. Per `BATCH_5_PROMPT_21_RISK.md` this is
the **cleanest of the six** — two well-isolated anchors, **no module-private
global**, no off-limits collision, contiguous, not inside a foreign IIFE.

Copy bytes **verbatim**. No renames/reformatting. If >~500 lines beyond the
expected ~640, STOP — anchor/brace read is wrong.

## §2 Where to put it
Create `app/modules/fatal-speeding/fatal-speeding-tab.js`:

```js
/**
 * CL fatalSpeeding.tab module — extracted (name-anchored) on 2026-05-17.
 * Round X modular refactor — see modular-prompts/21-v2-fatal-speeding-tab.md.
 * Responsibility: Fatal & Speeding tab — filters + analysis.
 * Public API (dual exposure):
 *   window.initFatalSpeedingTab → CL.fatalSpeeding.tab.initFatalSpeedingTab
 *   window.applyFSFilters       → CL.fatalSpeeding.tab.applyFSFilters
 * Depends on: core/constants, crash-tree/crash-tree-tab (script-tag order).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted contiguous block here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.fatalSpeeding = CL.fatalSpeeding || {};
  CL.fatalSpeeding.tab = CL.fatalSpeeding.tab || {};
  window.initFatalSpeedingTab = initFatalSpeedingTab;
  CL.fatalSpeeding.tab.initFatalSpeedingTab = initFatalSpeedingTab;
  window.applyFSFilters = applyFSFilters;
  CL.fatalSpeeding.tab.applyFSFilters = applyFSFilters;
  CL._registerModule('fatal-speeding/fatal-speeding-tab');
})();
```
Path-style registration `'fatal-speeding/fatal-speeding-tab'`. Add
`CL.fatalSpeeding` to `loader.js` ONLY if absent.

## §3 Wire the script tag
Immediately AFTER `<script src="modules/crash-tree/crash-tree-tab.js"></script>`
(LATE cluster):
```html
<script src="modules/fatal-speeding/fatal-speeding-tab.js"></script>
```

## §4 Remove the original code from `app/index.html`
**(Cowork pause must have cleared §0/§1 first.)**
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# After head/tail confirm, delete that exact line range.
```

## §5 Post-flight verification
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # − moved-fn count
node --check app/modules/fatal-speeding/fatal-speeding-tab.js        # pass
grep -nE 'function +(initFatalSpeedingTab|applyFSFilters)\b' app/index.html        # 0
grep -nE 'function +(initFatalSpeedingTab|applyFSFilters)\b' app/modules/fatal-speeding/fatal-speeding-tab.js  # 2
grep -c '<script src="modules/fatal-speeding/fatal-speeding-tab.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the new module
```
Console: `[CL] Module loaded: fatal-speeding/fatal-speeding-tab`.

## §6 Functional smoke test
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the Fatal & Speeding tab; apply its filters (`applyFSFilters`).
`typeof window.initFatalSpeedingTab === 'function'`. `playwright-cli close`.

## §7 Rollback
```bash
git checkout -- app/index.html && rm app/modules/fatal-speeding/fatal-speeding-tab.js
```

## §8 Out of scope
Renames/reformatting; other modules; off-limits modules; moving app-wide
globals (window mirror only); CLAUDE.md edits; PR unless asked.

---
### Prerequisite & ordering
- **Gated by prompt 20-v2** (load anchor = `crash-tree/crash-tree-tab.js`).
- Position 3 in 19 → 20 → **21** → 22. Lowest-risk LARGE BLOCK once unblocked —
  good confidence-builder. Unblocks 22-v2 (load anchor =
  `fatal-speeding/fatal-speeding-tab.js`).
