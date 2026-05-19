# CC Lane D — Round 2 — Verify Round 3 anchors (DOC-ONLY)

**Goal:** Grep-verify the live anchors for the **Round 3** extraction
candidates so Round 3's Lane A/B/C prompts can be authored against fresh,
correct line data. Produce one aggregate report. **DOC-ONLY — zero code,
zero `app/index.html` edits, no PR.**

**Touches:** writes only `LANE_D_ROUND_2_AGGREGATE.md` (and may read any file).

## Branch

Harness-designated branch. Nominal `claude/lane-d-r2-verify`; harness mandate
wins (CC_SESSION precedent). **No PR.**

## Round 3 candidates to verify (next-undone in each cluster)

| Lane | Candidate | Module (planned) | Start anchor | End anchor |
|---|---|---|---|---|
| A (pedbike) | **18e** ped-export | `pedbike/pedbike-tab-ped-export.js` | `setPedViewMode` | before `setBikeViewMode` |
| B (grants) | **V1c = 27d engine** | `grants/grants-rank-engine.js` | `// Main ranking function` | before `// UI Control Handlers` |
| C (filters) | **W3** | `filters/*` or 44-data-filter-wiring | re-check chip-render / `_r18*` viability | n/a |

(Authoritative per-child detail: `CC_SESSION_U_PEDBIKE_SUPERVISED.md` U5,
`CC_SESSION_V_GRANTS_FAMILY.md` V1d, `modular-prompts/{18,27}-v2-*.md`,
`modular-prompts/44-data-filter-wiring.md`.)

## Steps

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html                                   # live baseline (record)

# Lane A R3 — 18e ped-export
grep -nE '^(async )?function +setPedViewMode\b'  app/index.html   # 18e START
grep -nE '^(async )?function +setBikeViewMode\b' app/index.html   # 18e END = fn before this
grep -nE '^(async )?function +(exportPedDetailCSV|exportPedDetailPDF|exportPedDetailKML|exportPedLocationsCSV|exportPedLocationsPDF)\b' app/index.html
test -f app/modules/pedbike/pedbike-tab-ped-export.js && echo TGT-EXISTS || echo TGT-FREE

# Lane B R3 — 27d grants-rank-engine
grep -nE '^// Main ranking function'    app/index.html   # 27d START divider
grep -nE '^// UI Control Handlers'      app/index.html   # 27d END = code before this
test -f app/modules/grants/grants-rank-engine.js && echo TGT-EXISTS || echo TGT-FREE

# Lane C R3 — filters W3 viability
grep -nE '^(async )?function +(renderFilterChips?|buildFilterChips|updateFilterChips|_r18ApplyDashboardYearFilter|_bindFilterInputs)\b' app/index.html
```

For each candidate record: **live start line, live end line, LOC by brace
read, contiguous? (Y/N), >500? (split point if so), recommended load anchor,
target-file free? (Y/N), any off-limits name collision** (cross-check
CLAUDE.md §protected list).

## Output — `LANE_D_ROUND_2_AGGREGATE.md`

Write a doc with:
1. **Header** — live `wc -l app/index.html` baseline + UTC timestamp +
   the drift warning ("line numbers age fast; Round 3 §0 must re-derive").
2. **Done-vs-remaining table** — which pedbike/grants/filters children are
   extracted vs pending (scan `app/modules/` + CLAUDE.md off-limits list).
3. **Per-candidate anchor record** (the 6 fields above) for 18e, 27d, W3.
4. **Recommended Round 3 module names + load anchors** ready to paste into
   Round 3's Lane A/B/C prompts.
5. **Risk notes** — any contiguity break, >500 split, off-limits collision,
   or "W3 still no candidate — keep §0 ABORT gate".

## Hard constraints

DOC-ONLY: no edits to `app/index.html`, modules, `modular-prompts/*`,
`MODULAR_PLAN*`, `INDEX_MAP*`, or any code. No PR. One commit
(`Lane D R2: verify Round 3 anchors`), push to the harness-designated branch
(retry backoff 2s/4s/8s/16s, max 4).

## Final report

```
CC Lane D R2 complete (Round 3 anchor verify).
- LANE_D_ROUND_2_AGGREGATE.md written (baseline <N>, 3 candidates verified)
- 18e / 27d / W3: <contiguous? LOC? split? target-free? off-limits?>
- Branch: <harness branch> (pushed; no PR)
```
