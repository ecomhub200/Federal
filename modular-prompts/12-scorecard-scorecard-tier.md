# CC Modular Extraction Prompt 12 — `app/modules/scorecard/scorecard-tier.js`

**Severity:** Refactor (no behavior change). **One file per session — do NOT batch with other extraction prompts.**

Read `CLAUDE.md` (repo root) "Modular Extraction Refactor" section first. This
prompt is self-contained. `INDEX_MAP_part4.md` is the **authoritative
declaration list** for this extraction; the function names below are anchors to
locate the block. Snapshot ranges may have drifted from earlier prompts — always
re-derive the ACTUAL block in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
# Snapshot — needed to prove "no behavior change"
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block. Snapshot range: L158397-L158647 (feature: Scorecard tier inference + tier pills + cache invalidation.)
grep -nE 'function +_inferScorecardTier\b|const +_inferScorecardTier\b|let +_inferScorecardTier\b|window\._inferScorecardTier\b|_inferScorecardTier *= *function|_inferScorecardTier *= *async|_inferScorecardTier *= *\(|function +setScorecardTier\b|const +setScorecardTier\b|let +setScorecardTier\b|window\.setScorecardTier\b|setScorecardTier *= *function|setScorecardTier *= *async|setScorecardTier *= *\(|function +_renderTierPills\b|const +_renderTierPills\b|let +_renderTierPills\b|window\._renderTierPills\b|_renderTierPills *= *function|_renderTierPills *= *async|_renderTierPills *= *\(|function +_invalidateScorecard\b|const +_invalidateScorecard\b|let +_invalidateScorecard\b|window\._invalidateScorecard\b|_invalidateScorecard *= *function|_invalidateScorecard *= *async|_invalidateScorecard *= *\(|function +_earlySkel\b|const +_earlySkel\b|let +_earlySkel\b|window\._earlySkel\b|_earlySkel *= *function|_earlySkel *= *async|_earlySkel *= *\(' app/index.html
#    Read the braces around the matches to find the ACTUAL contiguous
#    block [BLK_START, BLK_END]. Use THOSE, not the snapshot, from here on.

# 2. Authoritative declaration set: every INDEX_MAP_part4.md row whose
#    `Start L` falls in [BLK_START, BLK_END] is a declaration to move
#    (name + Start/End L + type). Snapshot-range preview (if BLK spans a
#    40k boundary, also grep the adjacent INDEX_MAP_part file):
awk -F'|' 'NR>9 && ($2+0)>=158397 && ($2+0)<=158647' INDEX_MAP_part*.md
#    Cross-check: none of those names belong to an off-limits module in CLAUDE.md.

# 3. Target module must not exist yet
test -f app/modules/scorecard/scorecard-tier.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Confirm load anchor still present
grep -n '<script src="modules/assets/asset-export.js"></script>' app/index.html   # expected: 1 match
```
If any check fails (block not found/contiguous, target exists, anchor missing,
any name maps to an off-limits module): **ABORT and report — do not edit.**

## §1 What to move
From `app/index.html`, extract the **single contiguous block [BLK_START,
BLK_END]** confirmed in §0 (snapshot L158397–L158647, ~251 lines). The exact
declarations are the `INDEX_MAP_part4.md` rows inside that range. Anchor
declarations (use to find the block):
- `_inferScorecardTier` (and the helpers between it and the next named decl)
- `setScorecardTier` (and the helpers between it and the next named decl)
- `_renderTierPills` (and the helpers between it and the next named decl)
- `_invalidateScorecard` (and the helpers between it and the next named decl)
- `_earlySkel` (and the helpers between it and the next named decl)

Globals (module-private — move with the code):
- `_statePopulation`
Copy bytes **verbatim** — preserve every blank line, comment, and leading space.
The diff between the original lines and the new module body must be byte-for-byte
identical modulo the IIFE wrapper. **No renames, no reformatting, no "improvements".**
If the confirmed block exceeds ~500 lines, STOP and report — it likely needs the
sub-split noted in `MODULAR_PLAN.md` §2 for this module rather than one file.

## §2 Where to put it
Create `app/modules/scorecard/scorecard-tier.js`:

```js
/**
 * CL scorecard.tier module
 *
 * Extracted from app/index.html (snapshot L158397-L158647) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/12-scorecard-scorecard-tier.md.
 * Responsibility: Scorecard tier inference + tier pills + cache invalidation.
 *
 * Public API (back-compat dual exposure):
 *   - window._inferScorecardTier → CL.scorecard.tier._inferScorecardTier
 *   - window.setScorecardTier → CL.scorecard.tier.setScorecardTier
 *   - window._renderTierPills → CL.scorecard.tier._renderTierPills
 *   - window._invalidateScorecard → CL.scorecard.tier._invalidateScorecard
 *   - window._earlySkel → CL.scorecard.tier._earlySkel
 *
 * Depends on (must load before this file): `core/tier`, `ui/skeletons`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted lines here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.scorecard = CL.scorecard || {};
  window._inferScorecardTier = _inferScorecardTier; CL.scorecard._inferScorecardTier = _inferScorecardTier;
  window.setScorecardTier = setScorecardTier; CL.scorecard.setScorecardTier = setScorecardTier;
  window._renderTierPills = _renderTierPills; CL.scorecard._renderTierPills = _renderTierPills;
  window._invalidateScorecard = _invalidateScorecard; CL.scorecard._invalidateScorecard = _invalidateScorecard;
  window._earlySkel = _earlySkel; CL.scorecard._earlySkel = _earlySkel;
  CL._registerModule('scorecard/scorecard-tier');
})();
```
Registration string is **path-style** `'scorecard/scorecard-tier'` (matches `loader.js`
convention — logs `[CL] Module loaded: scorecard/scorecard-tier`). If `CL.scorecard.tier` needs a new
top-level `CL.` key not in `loader.js`, add ONLY that key to `loader.js`.

## §3 Wire the script tag
Add this line in `app/index.html` immediately AFTER the existing
`<script src="modules/assets/asset-export.js"></script>` (this places it in the **LATE** cluster
with correct load order vs. its dependencies):

```html
<script src="modules/scorecard/scorecard-tier.js"></script>
```

## §4 Remove the original code from `app/index.html`
Delete exactly the contiguous block you confirmed in §0 (the actual start/end,
not the snapshot if it drifted):

```bash
# Verify the block you are about to delete (use ACTUAL start,end from §0)
sed -n '<start>,<end>p' app/index.html | head -5
sed -n '<start>,<end>p' app/index.html | tail -5
# Only after head/tail confirm this is the right block, delete that line range.
```

## §5 Post-flight verification (run AFTER editing)
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # decreased by the named-fn count moved
wc -l app/modules/scorecard/scorecard-tier.js                      # ≈ extracted + ~25 wrapper
grep -nE 'function +_inferScorecardTier\b|const +_inferScorecardTier\b|let +_inferScorecardTier\b|window\._inferScorecardTier\b|_inferScorecardTier *= *function|_inferScorecardTier *= *async|_inferScorecardTier *= *\(|function +setScorecardTier\b|const +setScorecardTier\b|let +setScorecardTier\b|window\.setScorecardTier\b|setScorecardTier *= *function|setScorecardTier *= *async|setScorecardTier *= *\(|function +_renderTierPills\b|const +_renderTierPills\b|let +_renderTierPills\b|window\._renderTierPills\b|_renderTierPills *= *function|_renderTierPills *= *async|_renderTierPills *= *\(|function +_invalidateScorecard\b|const +_invalidateScorecard\b|let +_invalidateScorecard\b|window\._invalidateScorecard\b|_invalidateScorecard *= *function|_invalidateScorecard *= *async|_invalidateScorecard *= *\(|function +_earlySkel\b|const +_earlySkel\b|let +_earlySkel\b|window\._earlySkel\b|_earlySkel *= *function|_earlySkel *= *async|_earlySkel *= *\(' app/index.html                     # expected: 0 matches (anchors gone)
grep -nE 'function +_inferScorecardTier\b|const +_inferScorecardTier\b|let +_inferScorecardTier\b|window\._inferScorecardTier\b|_inferScorecardTier *= *function|_inferScorecardTier *= *async|_inferScorecardTier *= *\(|function +setScorecardTier\b|const +setScorecardTier\b|let +setScorecardTier\b|window\.setScorecardTier\b|setScorecardTier *= *function|setScorecardTier *= *async|setScorecardTier *= *\(|function +_renderTierPills\b|const +_renderTierPills\b|let +_renderTierPills\b|window\._renderTierPills\b|_renderTierPills *= *function|_renderTierPills *= *async|_renderTierPills *= *\(|function +_invalidateScorecard\b|const +_invalidateScorecard\b|let +_invalidateScorecard\b|window\._invalidateScorecard\b|_invalidateScorecard *= *function|_invalidateScorecard *= *async|_invalidateScorecard *= *\(|function +_earlySkel\b|const +_earlySkel\b|let +_earlySkel\b|window\._earlySkel\b|_earlySkel *= *function|_earlySkel *= *async|_earlySkel *= *\(' app/modules/scorecard/scorecard-tier.js       # expected: the anchors present
grep -c '<script src="modules/scorecard/scorecard-tier.js"></script>' app/index.html  # 1
node --check app/modules/scorecard/scorecard-tier.js               # must pass
git diff --stat                 # ONLY app/index.html + the new module file
```
On app load the console must show: `[CL] Module loaded: scorecard/scorecard-tier`.

## §6 Functional smoke test (deployed GitHub Pages — per CLAUDE.md)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console      # expected: NO new errors; [CL] Module loaded line present
```
- Exercise the feature these functions drive: Scorecard tier inference + tier pills + cache invalidation.
- In DevTools confirm `typeof window._inferScorecardTier` → `'function'` and
  `typeof CL.scorecard.tier` is defined.
- Verify the feature behaves identically to before extraction.
- `playwright-cli close` when done. Capture a screenshot for the PR if UI-visible.

## §7 Rollback
```bash
git diff --stat   # must show only app/index.html and app/modules/scorecard/scorecard-tier.js
git checkout -- app/index.html
rm app/modules/scorecard/scorecard-tier.js
```

## §8 Out of scope (do NOT do these here)
- Refactoring/renaming/reformatting the extracted code.
- Extracting any other functions or any of the off-limits modules in `CLAUDE.md`.
- Moving app-wide shared globals still read by remaining inline code (window mirror only).
- Updating `CLAUDE.md` (the orchestrator appends this module to the protected list after this prompt verifies green).
- Creating a PR unless explicitly asked.
