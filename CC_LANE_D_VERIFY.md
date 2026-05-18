# CC Lane D (Parallel Round 1) — Verify Round-2 anchors (DOC-ONLY)

**Severity:** Documentation only. **Touch ZERO code.** No `app/index.html`
edit, no `app/modules/**` edit, no extraction. Output is one new doc file.

Read `CLAUDE.md` → "Modular Extraction Refactor" for context. This lane
de-risks Round 2 by re-deriving the next disjoint candidate blocks from the
**live** file (INDEX_MAP*.md is stale — 159,387-line snapshot vs live
≈136,581; never trust a snapshot range).

## Branch

**`claude/lane-d-verify-next`** (from latest `origin/main`). No PR.

```bash
git checkout main && git pull origin main
git checkout -b claude/lane-d-verify-next
```

## Task — produce `LANE_ROUND2_ANCHORS.md` at repo root

For **each** of the 3 Round-2 candidate areas below, re-derive the LIVE block
by name-anchor grep + brace read and record: live `[BLK_START, BLK_END]`,
exact moved-decl enumeration (name + start line + async/fn/const), measured LOC
(≤500 single-child decision — flag if a sub-split is needed), the preceding
`<script src>` load anchor, and an off-limits cross-check against the full
CLAUDE.md off-limits list. **Do not edit any code; only read + write the doc.**

> Round-1 lanes A/B/C will land between when this runs and when Round 2
> executes. Note that explicitly: every line number you record is "as of this
> verification" and the Round-2 executing session MUST re-run its own §0
> name-anchored brace read (these numbers are advisory, never authoritative).

### A2 — next pedbike sub-block (pedbike NAV cluster)

```bash
grep -nE 'Legacy wrapper functions for backward compatibility|^function +updatePedLocations\b|^function +updateBikeLocations\b|^function +clearPedDateFilter\b|^function +clearBikeDateFilter\b|^function +jumpToCMFFromPedBike\b|^function +zoomToPedBikeLocation\b|^function +filterMapForPedBike\b' app/index.html
```
Cluster: the `// Legacy wrapper functions…` comment + `updatePedLocations`,
`updateBikeLocations`, `clearPedDateFilter`, `clearBikeDateFilter`,
`jumpToCMFFromPedBike`, `zoomToPedBikeLocation`, `filterMapForPedBike`
(snapshot ~L56595 → end of `filterMapForPedBike`). Brace-read the true end.
Note: these call `applyPedFilters`/`applyBikeFilters`/`loadCMFLocationData`/
`crashMap`/`COL`/`crashState` — all stay inline (global lexical env), none
moved. Confirm none already exported under `app/modules/pedbike/`. Target
name suggestion: `app/modules/pedbike/pedbike-tab-nav.js`.

### B2 — grants-rank-scoring

```bash
grep -nE '^function +renderGrantCard\b|^function +getMatchingGrants\b|^function +calculateGrantFitScores\b' app/index.html
```
Region: `renderGrantCard` (snapshot ~L30067) → `getMatchingGrants`
(~L30536) → `calculateGrantFitScores` (~L30751) and the helpers between/after.
**This is > 500 LOC as one block** — brace-read it and report the natural
single-child sub-cut (e.g. renderGrantCard + card helpers as B2a; matching/
scoring as B2b). Off-limits check vs `grants/ranking` + `grants/grants-ui` +
the Round-1 `grants/grants-rank-core` (Lane B) — confirm zero overlap with
whatever Lane B's block ended at (`renderGrantCard` is the first decl AFTER
Lane B's BLK_END, so B2 starts exactly where B stopped). `grantState` stays
inline. Target name suggestion: `app/modules/grants/grants-rank-scoring.js`.

### C2 — next filter sub-block

```bash
grep -nE '^function +setDashboardLoadingState\b|^function +_dashResolveTier\b|^function +_dashReadFilters\b|^function +initDashboardSearch\b|^async function +dashSearchCrashes\b|^function +dashClearSearch\b' app/index.html
```
Region begins at `setDashboardLoadingState` (the first decl AFTER Lane C's
BLK_END, snapshot ~L41942) through the `_dash*` / dashboard-search cluster.
Brace-read; report the contiguous ≤500 single-child block + its end anchor.
Off-limits check vs `data/dashboard-filter-bindings` and the Round-1
`data/filter-wiring-core` (Lane C) — confirm C2 starts exactly where C
stopped, zero overlap. Note any app-wide globals (window-mirror, don't move).
Target name suggestion: `app/modules/data/dashboard-search.js` (confirm a
non-colliding name vs existing `app/modules/data/*`).

## Deliverable shape (`LANE_ROUND2_ANCHORS.md`)

A table per area: `area | live BLK_START | live BLK_END | moved decls (name@line,
kind) | LOC | ≤500? (or sub-split) | preceding <script src> anchor | off-limits
cross-check result | shared globals (mirror/inline) | suggested target+branch`.
End with a one-paragraph "drift note" (baseline `wc -l app/index.html` at
verification time + reminder that Round-2 §0 must re-derive).

## Commit + push (no PR)

```bash
git add LANE_ROUND2_ANCHORS.md
git commit -m "Lane D: verify Round-2 anchors (A2 pedbike-nav, B2 grants-rank-scoring, C2 dashboard-search)"
git push -u origin claude/lane-d-verify-next   # retry x4 backoff on network error
```
Doc-only → never conflicts with A/B/C; merge after the code lanes.
