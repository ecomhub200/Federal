# Batch 5 plan — 6 LARGE BLOCK prompts (risk-consolidated)

Prepared 2026-05-16 (CC Session F). Source of truth: the **regenerated**
`INDEX_MAP*.md` (151,729-line snapshot) — the prior 159,387-line snapshot and
every prompt's "Snapshot range" are stale. Per-prompt detail in
`BATCH_5_PROMPT_<N>_RISK.md`. **Documentation only** — nothing was extracted.

## Headline finding

**None of the 6 LARGE BLOCK prompts is runnable today.** Every one fails its
own §0 pre-flight:

- 20/21/22/33/37 — §0 check #4 (load-anchor `<script src="modules/…">`)
  returns **0**: the predecessor module does not exist yet. Only
  `spatial/federal-boundaries.js` of the referenced anchors is present.
- 38 — §0 step 1 returns **0**: its primary anchor `ensureTierBoundaryDisplayed`
  is **already extracted** into the off-limits `spatial/geo-tier.js`.
- 33 & 37 additionally carry stale/phantom snapshot ranges (33's "9,601 lines"
  is a next-decl heuristic artifact; the real anchor cluster is ~680 lines)
  and structural problems (33 interleaved ownership; 37 has no usable anchor).

The 6 are gated behind a chain of **non-LARGE prerequisite prompts**
(19 analysis-tab, 31 cmf-search, 32 cmf-ai, 36 map-layers) that must ship
first. The "Batch 5" work is therefore: (1) trust the regenerated INDEX_MAP,
(2) run the prerequisites, (3) re-anchor the broken prompts, (4) extract the
LARGE BLOCKs under Cowork pause in dependency order.

## Consolidated verdict table

| # | Module | Live anchor(s) | True size | Anchor health | Verdict |
|---|---|---|---|---|---|
| 20 | `crash-tree/crash-tree-tab.js` | `initCrashTreeTab` @ **L100507** | ~300 LOC feature blk | 1/1 found; `crashTreeState` non-contiguous (L22161) | **NEEDS-PRE-WORK** → SAFE-WITH-PAUSE |
| 21 | `fatal-speeding/fatal-speeding-tab.js` | `initFatalSpeedingTab` @ **L104271**, `applyFSFilters` @ **L104880** | ~640 LOC | 2/2 found; clean, no priv global | **NEEDS-PRE-WORK** → SAFE-WITH-PAUSE (lowest risk) |
| 22 | `safety/safety-focus.js` | `initSafetyFocus` @ **L94818**, `updateSafetyCards` @ **L95286** | ~1,400 LOC region | 2/2 found; `safetyState` contiguous (L93937) | **NEEDS-PRE-WORK** → SAFE-WITH-PAUSE |
| 33 | `cmf/cmf-deficiency.js` | 5 anchors **L85125–L85802** | ~1,000 LOC (NOT 9,601) | 5/5 found but **interleaved** Analysis/Grants/CMF | **NEEDS-SPLIT + NEEDS-PRE-WORK** (highest risk) |
| 37 | `map/map-render.js` | none — `[Mm]ap` placeholder | unknown | ❌ no usable anchor | **NEEDS-PRE-WORK** (re-anchor + dep) |
| 38 | `map/map-boundary.js` | `ensureTierBoundaryDisplayed` — **0 in index.html** | n/a | already in off-limits `geo-tier.js` | **SUPERSEDED / retire** |

(Drift for the 80–100k-region prompts is consistently ≈ −4.8k lines, matching
the global −7,658 file shrink; "True size" is from regenerated brace-matched
`True LOC`, not the phantom snapshot spans.)

## Dependency / prerequisite graph

```
19 analysis-tab ──► 20 crash-tree ──► 21 fatal-speeding ──► 22 safety-focus
                       (crashTreeState
                        mirror/move TBD)

31 cmf-search ──► 32 cmf-ai ──► 33 cmf-deficiency  (+ sub-split decision)

36 map-layers ──► 37 map-render ──► 38 map-boundary
                  (re-anchor first)   (RETIRE — already in geo-tier.js)
```

Prereqs 19/31/32/36 are **not** LARGE BLOCK prompts (separate queue items);
they must complete before any Batch 5 LARGE BLOCK in their chain.

## Recommended execution order (safest-first, prerequisites-first)

1. **PRE** — prompt 19 `analysis/analysis-tab.js` (unblocks 20)
2. **20** crash-tree — SAFE-WITH-PAUSE; resolve `crashTreeState` (move vs.
   `window` mirror) in §0
3. **21** fatal-speeding — SAFE-WITH-PAUSE; cleanest, good confidence-builder
4. **22** safety-focus — SAFE-WITH-PAUSE; `safetyState` moves with block
5. **PRE** — prompt 31 `cmf/cmf-search`, then prompt 32 `cmf/cmf-ai`
6. **33** cmf-deficiency — only after a Cowork sub-split decision on the
   regenerated INDEX_MAP (do not cut by the 9.6k snapshot)
7. **PRE** — prompt 36 `map/map-layers`; then **re-anchor prompt 37**
   (documentation) from regenerated INDEX_MAP_part2
8. **37** map-render — LARGE BLOCK under Cowork pause, post-re-anchor
9. **38** — **no extraction**: verify `geo-tier.js` covers the responsibility
   and strike 38 from the LARGE BLOCK list (orchestrator note)

## Buckets

- **Auto-runnable (SAFE-AUTO):** none. All six are gated.
- **Cowork-paused (SAFE-WITH-PAUSE, after their prereq):** 20, 21, 22.
- **Needs-pre-work:** 20 (←19), 21 (←20), 22 (←21), 33 (←31,32 + split),
  37 (←36 + re-anchor).
- **Needs-split:** 33.
- **Superseded / retire:** 38.

## Cross-cutting notes

- **Off-limits name collisions (R1/R3):** `buildCountyWideCrashProfile`
  (L80467), `buildLocationCrashProfile` (L80522),
  `buildProgrammaticCrashAnalysis` (L79383) — none intersect the live blocks
  of 20/21/22/33 (or the 50–60k map region of 37/38). No R1/R3 risk for
  Batch 5.
- **Shared globals** (`crashState`, `jurisdictionContext`, `COL`, …) read by
  every block stay inline with `window` mirrors; only module-private state
  moves (`crashTreeState` — non-contiguous, decide per §0; `safetyState` —
  contiguous, moves cleanly).
- **Always re-derive at §0 by NAME**, never by snapshot range — the regen
  proves the ranges drift ~5k lines and the heuristic spans (33, 37, the
  navigateTo phantom) are not trustworthy.
- No Playwright smoke test applies to this session (documentation only; no
  GitHub Pages UI surface changed).
