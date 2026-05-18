# CC Lane E — Round 2 — Author Round 3 prompts (DOC-ONLY, self-replicating)

**Goal:** Author the **5 Round 3** lane prompt files so the parallel
extraction pipeline never stalls. **DOC-ONLY — writes only the 5 new
`CC_LANE_*_ROUND_3_*.md` files, zero code, no PR.** This is the meta-prompt
that perpetuates the cycle: *Round N+1's prompts are authored by Round N's
Lane E.*

**Touches:** prompt files only (`CC_LANE_*_ROUND_3_*.md`).

## Branch

Harness-designated branch. Nominal `claude/lane-e-author-round-3`; harness
mandate wins. **No PR.**

## Inputs (read first)

- `LANE_D_ROUND_2_AGGREGATE.md` — fresh Round 3 anchors (if Lane D R2 landed;
  if absent, re-derive anchors yourself via the §0 greps in
  `CC_LANE_D_ROUND_2_VERIFY.md`).
- `CC_SESSION_U_PEDBIKE_SUPERVISED.md`, `CC_SESSION_V_GRANTS_FAMILY.md`,
  `modular-prompts/{18,27}-v2-*.md`, `modular-prompts/44-data-filter-wiring.md`
  — authoritative per-child designs + §0–§8 conventions.
- The Round 2 prompts (`CC_LANE_A_ROUND_2_18d.md`,
  `CC_LANE_B_ROUND_2_V1b.md`, `CC_LANE_C_ROUND_2_W2.md`,
  `CC_LANE_D_ROUND_2_VERIFY.md`, this file) — exact structural template.

## The 5 files to author (Round 3)

| File | Lane | Scope | Cluster |
|---|---|---|---|
| `CC_LANE_A_ROUND_3_18e.md` | A | 18e `pedbike/pedbike-tab-ped-export.js` | `pedbike/` |
| `CC_LANE_B_ROUND_3_V1c.md` | B | 27d `grants/grants-rank-engine.js` | `grants/` |
| `CC_LANE_C_ROUND_3_W3.md` | C | filters W3 (§0 ABORT-gated until a real candidate exists) | `filters/` |
| `CC_LANE_D_ROUND_3_VERIFY.md` | D | verify **Round 4** anchors (18f / 27e / W4) → `LANE_D_ROUND_3_AGGREGATE.md` | DOC |
| `CC_LANE_E_ROUND_3_AUTHOR.md` | E | author Round 4 prompts (this same cycle) | DOC |

Use the Round 2 files as the byte-for-byte structural template (Goal · Branch
· Pre-flight · §0–§8 · Commit&push · Final report for A/B/C; the lighter
Goal/Inputs/Steps/Output/Hard-constraints shape for D/E).

## Hard rules baked into every authored prompt

1. **Conflict guard:** the 3 extraction lanes are cluster-disjoint —
   A=`pedbike/`, B=`grants/`, C=`filters/`. **Never author two extraction
   prompts touching the same cluster in the same round.** Each prompt's
   "Conflict awareness" line states this.
2. **Name-anchored, never line-anchored:** every §0 derives boundaries by
   `grep` on function/divider names + brace read at run time. `@NNNNN`
   numbers are advisory only (live `app/index.html` drifts every round).
3. **§0 ABORT discipline:** target-exists, non-contiguous, missing/ambiguous
   anchor, >500-without-prescribed-split, or off-limits-name collision ⇒
   ABORT (CLAUDE.md drift rule). Lane C keeps the explicit no-candidate
   ABORT gate until Lane D confirms a real filters block.
4. **Verbatim extraction, dual API, no behavior change:** IIFE skeleton,
   `window.<fn>` + `CL.<area>.<fn>`, `CL._registerModule()`, no
   rename/reformat; shared globals stay inline + window-mirrored.
5. **Harness branch override note** in every prompt's Branch section.
6. **One extraction per prompt, one commit, one push, NO PR.**
7. **loader.js** edited only to add a new `CL.*` root key, never otherwise.
8. **Off-limits respect:** cross-check CLAUDE.md §protected list before
   naming any module/anchor.

## Steps

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
cat LANE_D_ROUND_2_AGGREGATE.md 2>/dev/null || echo "no aggregate — re-derive anchors via Lane D R2 §0 greps"
# write the 5 CC_LANE_*_ROUND_3_*.md files (above), ~80–120 lines each,
# mirroring the Round 2 templates with Round 3 anchors/modules.
```

Sanity-scan each authored file: correct lane label, correct cluster, conflict
line, grep-based §0, ABORT conditions, no-PR, single commit/push, harness
branch note.

## Hard constraints

DOC-ONLY: no edits to `app/index.html`, modules, `modular-prompts/*`,
`MODULAR_PLAN*`, `INDEX_MAP*`, `CC_SESSION_*`, or Round 1/2 prompts. Only the
5 new Round 3 files. One commit (`Lane E R2: author Round 3 prompts (5
lanes)`), push to the harness-designated branch (retry backoff
2s/4s/8s/16s, max 4). **No PR.**

## Final report

```
CC Lane E R2 complete (authored Round 3).
- 5 files: CC_LANE_{A_18e,B_V1c,C_W3,D_VERIFY,E_AUTHOR}_ROUND_3*.md
- cluster-disjoint (A pedbike / B grants / C filters), name-anchored §0,
  ABORT gates, no-PR, harness-branch note — all present
- Branch: <harness branch> (pushed; no PR)
- Cycle intact: Round 4 will be authored by CC_LANE_E_ROUND_3_AUTHOR.md
```
