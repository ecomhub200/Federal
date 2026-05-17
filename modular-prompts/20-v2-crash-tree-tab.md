# CC Modular Extraction Prompt 20-v2 — `app/modules/crash-tree/crash-tree-tab.js`

**Supersedes `modular-prompts/20-crash-tree-crash-tree-tab.md`** (stale snapshot
range L105300–L109000 — that file is byte-unmodified; see
`modular-prompts/SUPERSEDED.md`). Re-anchored 2026-05-17 (CC Session H) against
live `app/index.html` @ **149,314 lines**. Source risk doc:
`BATCH_5_PROMPT_20_RISK.md`.

**Severity:** Refactor (no behavior change). **One file per session — do NOT
batch with other extraction prompts.**

Read `CLAUDE.md` (repo root) "Modular Extraction Refactor" section first. This
prompt is self-contained. The function names below are anchors to **locate**
the block; line numbers are *live as of 2026-05-17* and **will drift** — always
re-derive the ACTUAL block by brace read in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
# Snapshot — needed to prove "no behavior change"
wc -l app/index.html                                  # record N_LINES (~149,314)
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block by NAME (live anchor: initCrashTreeTab ~L98092).
grep -nE 'function +initCrashTreeTab\b|initCrashTreeTab *= *(async +)?(function|\()' app/index.html
#    Read the braces around the match to find the ACTUAL contiguous block
#    [BLK_START, BLK_END]. The crash-tree feature cluster is cohesive and
#    small (~300 LOC per BATCH_5_PROMPT_20_RISK.md §1); the next named decl
#    after the cluster bounds BLK_END. Use THOSE, not any snapshot.

# 2. Resolve the module-private global crashTreeState (NON-CONTIGUOUS).
grep -nE '(const|let|var) +crashTreeState\b' app/index.html   # live ~L22163
grep -n 'crashTreeState' app/index.html | grep -vE '^\s*(22163|<BLK_START>..<BLK_END>)'
#    crashTreeState is declared ~L22163 — ~76k lines ABOVE the block, in the
#    top-level globals cluster, NOT contiguous with it (BATCH_5_PROMPT_20_RISK
#    §2). Decide here:
#      (a) PREFERRED: move ONLY the `const/let crashTreeState = …` declaration
#          into the new module AND confirm via the reader-grep above that NO
#          inline code outside [BLK_START,BLK_END] still reads crashTreeState.
#      (b) FALLBACK: if any inline reader survives, KEEP the declaration inline
#          and add `window.crashTreeState = crashTreeState;` mirror — do NOT
#          relocate it.
#    Record the decision (a or b) before proceeding.

# 3. Target module must not exist yet
test -f app/modules/crash-tree/crash-tree-tab.js && echo "ABORT: target exists" || echo "OK"

# 4. Confirm load anchor present (PREREQUISITE — prompt 19)
grep -n '<script src="modules/analysis/analysis-tab.js"></script>' app/index.html
#    EXPECTED TODAY: 0 matches → prompt 19 (analysis/analysis-tab.js) has not
#    shipped. This is the documented gate: ABORT until prompt 19 is deployed.
```
If any check fails (block not contiguous, target exists, **anchor missing —
prompt 19 not yet shipped**, any name maps to an off-limits module): **ABORT
and report — do not edit.**

## §1 What to move

> 🔴 **LARGE BLOCK — Cowork supervised.** **STOP after the §0 grep**: surface
> the §0 output (BLK_START/BLK_END, the crashTreeState decision a/b, the
> moved-decl list) for human verification **BEFORE** the §1 brace-read
> finalization and **BEFORE** any §4 delete. Do not auto-run through to
> deletion.

From `app/index.html`, extract the **single contiguous block [BLK_START,
BLK_END]** confirmed in §0. Live anchor: `initCrashTreeTab` (~L98092) plus the
crash-tree helpers between it and the next named decl. Per
`BATCH_5_PROMPT_20_RISK.md` the cluster is cohesive (~300 LOC) and **not** inside
a shared foreign IIFE.

Module-private global: **`crashTreeState`** — handle per the §0 (a)/(b)
decision. If (a), its single `const/let` line moves into the module body
(verbatim, at the top, before the extracted block) and no inline reader remains.
If (b), it stays inline with a `window.crashTreeState` mirror and is NOT moved.

Copy bytes **verbatim** — preserve every blank line, comment, leading space. No
renames, no reformatting, no "improvements". If the confirmed block exceeds
~500 lines, STOP and report (it should be ~300 — a large delta means the anchor
or brace read is wrong).

## §2 Where to put it
Create `app/modules/crash-tree/crash-tree-tab.js`:

```js
/**
 * CL crashTree.tab module — extracted (name-anchored) on 2026-05-17.
 * Round X modular refactor — see modular-prompts/20-v2-crash-tree-tab.md.
 * Responsibility: Crash Tree tab — tree construction + risk-factor analysis.
 * Public API (dual exposure): window.initCrashTreeTab → CL.crashTree.tab.initCrashTreeTab
 * Depends on: core/constants, analysis/analysis-tab (load order via script tag).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <if §0 decision (a): the moved `crashTreeState` declaration goes here>
  // <paste the extracted contiguous block here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {}; CL.crashTree.tab = CL.crashTree.tab || {};
  window.initCrashTreeTab = initCrashTreeTab;
  CL.crashTree.tab.initCrashTreeTab = initCrashTreeTab;
  CL._registerModule('crash-tree/crash-tree-tab');
})();
```
Registration string is path-style `'crash-tree/crash-tree-tab'`. If `CL.crashTree`
is not in `loader.js`, add ONLY that top-level key to `loader.js`.

## §3 Wire the script tag
Add immediately AFTER the existing
`<script src="modules/analysis/analysis-tab.js"></script>` (LATE cluster):
```html
<script src="modules/crash-tree/crash-tree-tab.js"></script>
```

## §4 Remove the original code from `app/index.html`
**(Cowork pause must have cleared §0/§1 first.)**
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# Only after head/tail confirm, delete that line range.
# If §0 decision (a): also delete the original crashTreeState declaration line.
```

## §5 Post-flight verification
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1) [− 1 if (a)]
grep -cE '^\s*(async\s+)?function ' app/index.html   # − moved-fn count
node --check app/modules/crash-tree/crash-tree-tab.js               # must pass
grep -nE 'function +initCrashTreeTab\b' app/index.html              # 0
grep -nE 'function +initCrashTreeTab\b' app/modules/crash-tree/crash-tree-tab.js  # 1
grep -c '<script src="modules/crash-tree/crash-tree-tab.js"></script>' app/index.html  # 1
# If §0 decision (a): grep -n 'crashTreeState' app/index.html  → 0 inline readers
git diff --stat                 # ONLY app/index.html + the new module
```
Console on load: `[CL] Module loaded: crash-tree/crash-tree-tab`.

## §6 Functional smoke test (deployed GitHub Pages — per CLAUDE.md)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the Crash Tree tab (tree builds, risk-factor analysis renders).
Confirm `typeof window.initCrashTreeTab === 'function'`. `playwright-cli close`.

## §7 Rollback
```bash
git checkout -- app/index.html && rm app/modules/crash-tree/crash-tree-tab.js
```

## §8 Out of scope
Renames/reformatting; any other module; off-limits modules; moving app-wide
shared globals (`crashState`, `jurisdictionContext` — window mirror only);
CLAUDE.md edits; PR unless asked.

---
### Prerequisite & ordering
- **Gated by prompt 19** (`analysis/analysis-tab.js` — §0 check #4). Not
  runnable until 19 ships.
- First LARGE BLOCK in the 19 → **20** → 21 → 22 LATE-cluster chain; unblocks
  21-v2 (whose load anchor is `crash-tree/crash-tree-tab.js`).
