# CC Lane B — Round 2 — V1b grants-rank-scoring (single-lane)

**Goal:** Extract exactly **one** child — the **27c scoring block** →
`grants/grants-rank-score.js` (crash-pattern analysis + enhanced-grant-score
helpers). One extraction, one commit, one push. No PR.

> **Naming note:** the task labels this lane "V1b"; per
> `CC_SESSION_V_GRANTS_FAMILY.md` the scoring child is also called **27c /
> V1c**. They are the same block — `// ENHANCED GRANT MATCHING` → before the
> main ranking fn. The user explicitly selected the **27c scoring block** as
> this lane's target. Module name is `grants/grants-rank-score.js` regardless
> of the V1b/V1c label.

**Cluster:** `app/modules/grants/` ONLY. **Conflict awareness:** Round 2 runs
this in parallel with Lane A (`pedbike/`) and Lane C (`filters/`) — disjoint
clusters, never edit outside `grants/` + the single contiguous scoring block
in `app/index.html`.

**Source prompt (authoritative, do NOT edit):**
`modular-prompts/27-v2-grants-rank.md` (V1c row of `CC_SESSION_V_GRANTS_FAMILY.md`).

## Branch

Develop, commit, push on the **harness-designated branch**. Nominal lane
branch `claude/lane-b-r2-grants-rank-scoring`; harness mandate wins if it
differs (CC_SESSION_V precedent). No push elsewhere without permission.
**No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
cat modular-prompts/27-v2-grants-rank.md      # §0–§8 source of truth (V1c)
wc -l app/index.html                          # RECORD BASELINE
```

⚠️ **All line numbers advisory.** Re-derive by **name/divider anchor + brace
read** at run time. Never trust a `@NNNNN`.

## §0 Pre-flight — derive boundaries, then ABORT-check

```bash
grep -nE '^// ENHANCED GRANT MATCHING' app/index.html                   # band START divider
grep -nE '^// Calculate enhanced grant score' app/index.html            # in-band marker
grep -nE '^(async )?function +(calculateEnhancedGrantScore|calculateGrantFitScores|calculateImprovedGrantScore)\b' app/index.html
grep -nE '^// Main ranking function' app/index.html                     # band END = code BEFORE this divider/fn (27d engine, NOT moved)
test -f app/modules/grants/grants-rank-score.js && echo ABORT-EXISTS || echo OK
grep -n '<script src="modules/grants/ranking.js"></script>' app/index.html   # load anchor, expect 1
grep -nE '^const +grantState\b' app/index.html                          # MUST stay inline (do not move)
```

Brace-read the `// ENHANCED GRANT MATCHING` band → last fn before the main
ranking function. Record start/end + LOC (expect ~470, ≤500 ⇒ single module,
no split).

**ABORT if:** target exists · band not contiguous · the `// ENHANCED GRANT
MATCHING` or main-ranking-fn anchor missing/ambiguous · the slice splits a
function or swallows the 27d main ranking fn · any moved name maps to an
off-limits module (`grants/ranking.js`, `grants/grants-ui.js` are off-limits).

## §2 Skeleton

```js
/** CL grants.rank — 27c scoring extracted (name-anchored) <run date>.
 *  see modular-prompts/27-v2-grants-rank.md. No behavior change.
 *  Reads inline shared grantState / GRANT_SCORING_PROFILES (window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.rank=CL.grants.rank||{};
  CL._registerModule('grants/grants-rank-score');
})();
```

Dual public API: expose **both** `window.<fn>` AND `CL.grants.rank.<fn>` for
every moved fn.

## §3 Script tag (LATE cluster)

Insert after `<script src="modules/grants/ranking.js">` (the V1 grants-rank
anchor per CC_SESSION_V §3). If sibling 27a–27e tags already exist, place in
27a→27e order (27c after 27b, before 27d).

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete the verbatim block. **Do NOT** delete past the `// Main ranking
function` divider (27d stays inline this lane).

## §5 Post-flight

```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/grants/grants-rank-score.js
grep -nE 'function +(calculateEnhancedGrantScore|calculateGrantFitScores|calculateImprovedGrantScore)\b' app/index.html  # expect 0
grep -nE '^const +grantState\b' app/index.html                          # STILL 1 (not moved)
grep -c '<script src="modules/grants/grants-rank-score.js"></script>' app/index.html  # 1
git diff --stat   # ONLY app/index.html + the one new module
```
Console: `[CL] Module loaded: grants/grants-rank-score`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console          # NO new errors
# Grants tab → run grant matching for a jurisdiction → ranked list with
# scores renders (enhanced-score path exercised). Confirm ALL crashes load.
playwright-cli close
```
If deployed Pages is behind this branch, say so explicitly — do not skip.

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/grants/grants-rank-score.js
```

## §8 Out of scope

`grantState` / `GRANT_SCORING_PROFILES` (stay inline, window-mirror only);
27a/27b/27d/27e bands; `grants/ranking.js` + `grants/grants-ui.js`
(off-limits); any non-grants cluster; renames; reformatting; PR.

## Commit & push

One commit (`Lane B R2: extract 27c grants-rank-score`), push to the
harness-designated branch with `git push -u origin <branch>` (retry on network
error: backoff 2s/4s/8s/16s, max 4). **No PR.**

## Final report

```
CC Lane B R2 complete (27c grants-rank-score).
- app/index.html: <baseline> → <new> (−<delta>, target ~470)
- new module: grants/grants-rank-score.js (≤500, node --check clean, registered)
- grantState / GRANT_SCORING_PROFILES untouched (window-mirror only)
- Smoke: Grants ranking green, playwright-cli console clean
- Branch: <harness branch> (pushed; no PR)
```
