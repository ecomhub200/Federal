# CC Modular Extraction Prompt 27-v2 — `app/modules/grants/grants-rank*.js` (5-CHILD RE-SPLIT)

**Supersedes `modular-prompts/27-grants-grants-rank.md`** — original anchor set
is **non-contiguous**: `grantState`@22688 / `GRANT_SCORING_PROFILES`@22742 live
inside a *shared state-declaration cluster* (interleaved with
`districtState`@22725, `mutcdState`@22856, `selectionState`@22867,
`warrantsState`@22888 — all OTHER features), ~7,200 lines from
`initGrantModule`@29876. CLAUDE.md mandates `grantState` **stays inline**.
The original snapshot L34986–L37500 matches neither anchor. Byte-unmodified —
see `modular-prompts/SUPERSEDED.md`. Re-anchored 2026-05-17 (CC Session N) @
live **145,624 lines**. Analysis: `NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor. **One CHILD per session.** **FIVE-MODULE re-split** of
the contiguous **grant engine** block only (`initGrantModule`@29876 →
`loadAadtCoverageBanner`@31763, ~2,149 LOC). `grantState` /
`GRANT_SCORING_PROFILES` are **NOT moved** — keep inline, add `window.*`
mirror only.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^// GRANT MODULE FUNCTIONS' app/index.html               # band START divider ~L29665
grep -nE '^(async )?function +(initGrantModule|loadAadtCoverageBanner)\b' app/index.html
grep -nE '^// EMAIL NOTIFICATION SYSTEM' app/index.html            # past band end (~L31814)
# 🔴 TAIL INTERLEAVE: between loadAadtCoverageBanner@~31763 and the EMAIL
#   NOTIFICATION divider there are 3 event-listeners:
#     ~L31793  window.addEventListener('crashtab:hotspots:shown', loadAadtCoverageBanner)   ← GRANT, move
#     ~L31794–L31808  window.addEventListener('crashtab:dashboard:shown', …resize charts…)  ← DASHBOARD, LEAVE INLINE
#     ~L31810–L31812  document.addEventListener('jurisdictionChanged', …loadAadtCoverageBanner…) ← GRANT, move
#   The last child (27e) MUST move only the 2 grant listeners and leave the
#   dashboard-resize listener inline (window-mirror unaffected). Confirm by
#   reading L31790–L31814 before any delete.
grep -nE '^const +(grantState|GRANT_SCORING_PROFILES)\b' app/index.html   # ~22688/22742 — DO NOT MOVE
test -f app/modules/grants/grants-rank-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/grants/ranking.js"></script>' app/index.html  # load-after anchor
```
ABORT if: the engine block is not contiguous, target exists, any name
off-limits, or the tail interleave can't be cleanly separated.

## §1 What to move — 5 children (engine block only; ≤500 by brace read)
| Order | Child | Candidate band | ~LOC | Anchor set |
|---|---|---|---|---|
| 27a | `grants/grants-rank-init.js` | `initGrantModule`@29876 → before `displayStateGrants`@30011 | ~135 | `initGrantModule`,`mergeGrantProgramsFromSupabase`,`initYearRangeFilter`,`applyGrantDateFilter`,`resetGrantDateFilter`,`applyYearRangeFilter`,`resetYearRange`,`showGrantTab`,`searchGrantsGovKeyword`,`openGrantsGovNewTab` |
| 27b | `grants/grants-rank-display.js` | `displayStateGrants`@30011 → before `// ENHANCED GRANT MATCHING`@30230 | ~219 | `displayStateGrants`,`_renderGrantDeadline`,`renderGrantCard`,`applyGrantFilters`,`applyGrantFiltersToList`,`updateGrantFilterInfo`,`toggleFavorite`,`updateFavoritesCount`,`displayFavorites`,`updateGrantEPDOIndicator`,`updateGrantsTabForState`,`updateGrantAgencyFilter`,`updateGrantQuickLinks` |
| 27c | `grants/grants-rank-score.js` | `// ENHANCED GRANT MATCHING`@30230 → before the main ranking fn @~31024 | ~470 | crash-pattern analysis + enhanced-score helpers (`// Calculate enhanced grant score`@30354 …) |
| 27d | `grants/grants-rank-engine.js` | main ranking fn @~31024 → before `// UI Control Handlers`@31497 | ~473 | `// Main ranking function - async chunked` + progress-indicator helpers |
| 27e | `grants/grants-rank-controls.js` | `// UI Control Handlers`@31497 → `loadAadtCoverageBanner`@31763 end + the **2 grant listeners only** (~L31793, ~L31810–L31812) | ~330 | `changeGrantMinCrashes`,`showScoringProfileHelp`,`openADTInputModal`,`saveADTData`,`openAadtImportModal`,`_parseAadtCsv`,`submitAadtImport`,`loadAadtCoverageBanner` + 2 grant event-listeners (NOT the dashboard-resize listener) |

`grantState`/`GRANT_SCORING_PROFILES` remain inline; in 27a add
`window.grantState = grantState; window.GRANT_SCORING_PROFILES = GRANT_SCORING_PROFILES;`
adjacent to their inline declarations only if not already mirrored (do NOT
relocate them). Copy moved code **verbatim**.

## §2 Skeleton (per child)
```js
/** CL grants.rank<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/27-v2-grants-rank.md. No behavior change.
 *  Reads inline shared globals grantState / GRANT_SCORING_PROFILES (window). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.rank=CL.grants.rank||{};
  CL._registerModule('grants/grants-rank-<child>');
})();
```

## §3 Script tags (LATE, after `<script src="modules/grants/ranking.js">`, 27a→27e)
```html
<script src="modules/grants/grants-rank-init.js"></script>
<script src="modules/grants/grants-rank-display.js"></script>
<script src="modules/grants/grants-rank-score.js"></script>
<script src="modules/grants/grants-rank-engine.js"></script>
<script src="modules/grants/grants-rank-controls.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
# 27e ONLY: also confirm the dashboard-resize listener L31794–L31808 is NOT in
# the deleted range (it stays inline). Re-read L31790–L31814 first.
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/grants/grants-rank-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -nE '^const +grantState\b' app/index.html                       # STILL 1 (not moved)
grep -c '<script src="modules/grants/grants-rank-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: grants/grants-rank-<child>`.

## §6 Smoke (after last child)
Open deployed app → Grants tab: programs load (Supabase merge), state grants
list + cards render, favorites toggle, scoring profile select, **run ranking**
(progress indicator → ranked locations), AADT import modal, coverage banner.
No new console errors; `typeof window.initGrantModule === 'function'`.
`playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/grants/grants-rank-<child>.js`

## §8 Out of scope
Moving `grantState`/`GRANT_SCORING_PROFILES` (inline, window-mirror only);
the dashboard-resize listener; EMAIL NOTIFICATION band (29-v2); the AI-app-gen
band (28-v2); `grants/ranking.js`/`grants/grants-ui.js` (off-limits); PR.

---
### Ordering
27a→…→27e. **Run AFTER 41-v2** (no hard gate, but `grants-ui.js` calls these
at runtime — load order is already safe per CLAUDE.md). **Session O slot: 5th.**
