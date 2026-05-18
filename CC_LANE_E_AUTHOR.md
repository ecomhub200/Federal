# CC Lane E (Parallel Round 1) — Author Round-2 lane prompts (DOC-ONLY)

**Severity:** Documentation only. **Touch ZERO code.** No `app/index.html`
edit, no `app/modules/**` edit, no extraction. Output is 5 new prompt files.

Read `CLAUDE.md` → "Modular Extraction Refactor" + "Extraction rules — follow
EXACTLY". This lane produces the **Round 2** parallel lane prompts so the next
round can launch immediately after Round 1 merges.

## Branch

**`claude/lane-e-author-round-2`** (from latest `origin/main`). No PR.

```bash
git checkout main && git pull origin main
git checkout -b claude/lane-e-author-round-2
```

## Inputs

1. **Preferred:** `LANE_ROUND2_ANCHORS.md` (produced by Lane D). If it exists
   on `origin` (Lane D merged) or you can fetch its branch, use its verified
   live blocks.
2. **Fallback:** if `LANE_ROUND2_ANCHORS.md` is absent, re-derive the 3
   Round-2 blocks yourself with the exact grep recipes in `CC_LANE_D_VERIFY.md`
   (A2 pedbike-nav, B2 grants-rank-scoring, C2 dashboard-search) by
   name-anchor + brace read. INDEX_MAP*.md is stale — never trust a snapshot
   range.

## Task — author 5 Round-2 prompt files at repo root

Model them **exactly** on the Round-1 lane files
(`CC_LANE_A_pedbike-matview.md`, `CC_LANE_B_grants-rank-core.md`,
`CC_LANE_C_filter-wiring-core.md`, `CC_LANE_D_VERIFY.md`,
`CC_LANE_E_AUTHOR.md`) — same §0–§7 single-child structure, same
stale-INDEX_MAP / off-limits / window-mirror / one-module-per-session /
no-ES-module / no-PR / conflict-guard discipline.

| File | Target module | Branch | Notes |
|---|---|---|---|
| `CC_LANE_A2_pedbike-nav.md` | `app/modules/pedbike/pedbike-tab-nav.js` | `claude/lane-a2-pedbike-nav` | wrappers + jump/zoom/filter map fns; no global moved |
| `CC_LANE_B2_grants-rank-scoring.md` | `app/modules/grants/grants-rank-scoring.js` (sub-split if >500: -scoring + -cards) | `claude/lane-b2-grants-rank-scoring` | starts exactly at `renderGrantCard` (= Lane B's BLK_END+1); `grantState` inline, not mirrored |
| `CC_LANE_C2_dashboard-search.md` | `app/modules/data/dashboard-search.js` (confirm non-colliding name) | `claude/lane-c2-dashboard-search` | starts at `setDashboardLoadingState` (= Lane C's BLK_END+1); window-mirror any app-wide global, don't move it |
| `CC_LANE_D2_VERIFY.md` | `LANE_ROUND3_ANCHORS.md` | `claude/lane-d2-verify-next` | same doc-only shape as `CC_LANE_D_VERIFY.md`, retargeted to Round-3 candidate blocks |
| `CC_LANE_E2_AUTHOR.md` | Round-3 prompt files | `claude/lane-e2-author-round-3` | same self-replicating doc-only shape as this file |

Each A2/B2/C2 prompt MUST include, with **live** (Lane-D-verified or
self-derived) line numbers as advisory anchors:
- §0 name-anchored grep + brace-read re-derivation (ABORT gates) + off-limits
  cross-check (incl. vs the Round-1 modules `pedbike-tab-locations`,
  `grants-rank-core`, `filter-wiring-core` once merged) + target-not-exist +
  load-anchor check.
- §1 verbatim move + explicit shared-global rule (inline-vs-window-mirror).
- §2 module skeleton (IIFE, `CL.<area>`, dual `window.<fn>`+`CL.<area>.<fn>`
  for every moved fn, `CL._registerModule`).
- §3 script-tag cluster placement (name the preceding anchor tag).
- §4 delete exactly the block.
- §5 post-flight (wc/fn-count delta, `node --check`, `git diff --stat` = 2
  files) + console load line.
- §6 Playwright smoke on `https://ecomhub200.github.io/Federal/app/` driving
  the affected feature.
- §7 commit + push to the lane branch, retry x4 backoff, **no PR** + the
  conflict-guard paragraph (A2/B2/C2 disjoint — confirm the new ranges are
  still far apart after Round-1 deletions shift line numbers).

Disjointness check: after Round 1, the 3 Round-2 blocks are still in distinct
areas (pedbike ~L56K, grants ~L30K, dashboard-search ~L41K). State the
post-Round-1 expected ranges in each prompt's conflict-guard note.

## Deliverable

5 files at repo root (`CC_LANE_A2_*.md` … `CC_LANE_E2_*.md`), each
self-contained and runnable in an independent session.

## Commit + push (no PR)

```bash
git add CC_LANE_A2_pedbike-nav.md CC_LANE_B2_grants-rank-scoring.md CC_LANE_C2_dashboard-search.md CC_LANE_D2_VERIFY.md CC_LANE_E2_AUTHOR.md
git commit -m "Lane E: author Round-2 parallel lane prompts (A2/B2/C2/D2/E2)"
git push -u origin claude/lane-e-author-round-2   # retry x4 backoff on network error
```
Doc-only → never conflicts with A/B/C; merge after the code lanes.
