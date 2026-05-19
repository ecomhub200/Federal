# BATCH_5_EXEC_PLAN — detailed supervised execution plan

**Prepared:** 2026-05-17 (CC Session H). **Documentation only.** Coordinates
the re-anchored Batch-5 LARGE BLOCK prompts (`*-v2`, see
`modular-prompts/SUPERSEDED.md`) and their non-LARGE prerequisites. Live
baseline: `app/index.html` @ **149,314 lines**. Per-prompt risk detail:
`BATCH_5_PROMPT_<N>_RISK.md`; consolidated verdicts: `BATCH_5_PLAN.md`.

## Headline

**None of the 5 LARGE BLOCK prompts is runnable today** — every one's §0 check
#4 (predecessor `<script src="modules/…">`) returns 0 because its prerequisite
module has not shipped. Verified absent: `analysis/analysis-tab.js`,
`crash-tree/crash-tree-tab.js`, `fatal-speeding/fatal-speeding-tab.js`,
`cmf/cmf-search.js`, `cmf/cmf-ai.js`, `map/map-layers.js`. Prompt **38 is
retired** (anchor already in off-limits `spatial/geo-tier.js`).

The Batch-5 work is therefore: (1) ship the non-LARGE prerequisites
(19/31/32/36 — separate Session-G queue), (2) run the v2 LARGE BLOCKs under
Cowork pause in dependency order.

## Dependency graph

```
19 analysis-tab ─► 20-v2 crash-tree ─► 21-v2 fatal-speeding ─► 22-v2 safety-focus
                     (crashTreeState
                      move-vs-mirror @ §0)

31 cmf-search ─► 32 cmf-ai ─► 33-v2 cmf-deficiency  (re-split 33a → 33b)

36 map-layers ─► [re-confirm 37-v2 anchors] ─► 37-v2 map-render
```
19 / 31 / 32 / 36 are **non-LARGE** prerequisites (Session-G queue items) — not
in this plan's LARGE BLOCK set, but each MUST ship before its dependent v2.

## Run order (safest-first, prerequisites-first)

| # | Item | Type | Gate / pause |
|---|---|---|---|
| 1 | **19** `analysis/analysis-tab.js` | PRE (non-LARGE, Session G) | unblocks 20-v2 |
| 2 | **20-v2** crash-tree-tab | LARGE — Cowork | needs #1; §0 STOP: BLK + `crashTreeState` decision (a move-decl / b window-mirror); pause before §4 |
| 3 | **21-v2** fatal-speeding-tab | LARGE — Cowork | needs #2; cleanest of the six (no module-private global); §0 STOP, pause before §4 |
| 4 | **22-v2** safety-focus | LARGE — Cowork | needs #3; `safetyState` contiguous → moves with block; §0 STOP, pause before §4 |
| 5 | **31** `cmf/cmf-search.js` | PRE (non-LARGE, Session G) | part of 33-v2 double gate |
| 6 | **32** `cmf/cmf-ai.js` | PRE (non-LARGE, Session G) | part of 33-v2 double gate; unblocks 33-v2 |
| 7 | **33-v2a** cmf-deficiency-ai | LARGE+SPLIT — Cowork | needs #5+#6; §0 STOP for the **sub-split decision** (name-anchored, NOT the 9.6k phantom); pause before §4 |
| 8 | **33-v2b** cmf-deficiency | LARGE+SPLIT — Cowork | needs #7; §0 STOP (band must contain zero foreign Analysis/Grants/CMF rows); pause before §4 |
| 9 | **36** `map/map-layers.js` | PRE (non-LARGE, Session G) | unblocks 37-v2 |
| 10 | **[re-confirm 37-v2 anchors]** | DOC pre-work | after #9: re-verify `initMap`/`updateMapDisplay`/`createMarker` lines (drift) + the render-vs-foreign boundary |
| 11 | **37-v2** map-render | LARGE+RE-ANCHOR — Cowork | needs #9+#10; §0 STOP for the **render sub-band decision** (exclude address-search + PDF-map + off-limits); pause before §4 |

Rule for every LARGE item: **STOP after §0 grep**, surface §0 output
(BLK_START/BLK_END, anchor lines, moved-fn list, any split/state decision) for
human verification, then proceed to §4 delete only on Cowork approval. Each is
one-file-per-session — never batched. Standard §6 Playwright smoke test on
`https://ecomhub200.github.io/Federal/app/` after each ship.

## Cowork pause points (summary)

| Prompt | Pause decision required |
|---|---|
| 20-v2 | `crashTreeState`: move declaration into module (preferred) vs. keep inline + `window` mirror — based on the §0 reader-grep |
| 21-v2 | Confirm BLK boundary only (no state decision) — lowest risk |
| 22-v2 | Confirm `safetyState` has no external reader → moves with block |
| 33-v2 | **Sub-split**: exact name-anchored 33a/33b boundary; confirm each band has zero foreign-tagged rows (Analysis/Grants/CMF) |
| 37-v2 | **Render sub-band**: which Map decls are render/cluster/heat/popup vs. address-search / PDF-map / off-limits — single contiguous cut may not hold |

## Expected LOC reduction

| Prompt | True size (regen brace-matched) |
|---|---|
| 20-v2 | ~300 LOC |
| 21-v2 | ~640 LOC |
| 22-v2 | ~1,400 LOC (region) |
| 33-v2 (a+b) | ~1,000 LOC combined |
| 37-v2 | unknown until the render sub-band is fixed at §0 |
| **Subtotal (20+21+22+33)** | **~3,340 LOC** |

**Expected `app/index.html` after Batch 5 ≈ 149,314 − ~3,340 ≈ ~146,000
lines** (37-v2 unquantified — the estimate is a floor; revise once 37's sub-band
is chosen). All five LARGE BLOCKs remain well above the 30,000-line "done"
target — Batch 5 is one increment in the larger refactor, not its completion.

## Rollback strategy

Each prompt is independently revertible (one-file-per-session, no cross-prompt
coupling beyond load order):
```bash
git checkout -- app/index.html && rm app/modules/<area>/<module>.js
```
- A failed LARGE extraction reverts ONLY its own session's two-file diff
  (`git diff --stat` must show exactly `app/index.html` + the new module).
- Because each v2's §0 check #4 hard-gates on the predecessor's `<script src>`,
  a reverted predecessor automatically re-blocks its dependents (they ABORT at
  §0) — no silent half-applied chain.
- 33-v2 a/b: revert b before a if both shipped and b fails (a is b's load
  anchor). 37-v2: if the render sub-band proves non-contiguous at §0, ABORT
  (no edit) and escalate to Cowork for a multi-module re-scope — do not force a
  mixed-ownership cut.

## Cross-cutting notes (from BATCH_5_PLAN.md, re-verified live)

- **No R1/R3 off-limits-name collision** for any Batch-5 block:
  `buildProgrammaticCrashAnalysis` / `buildCountyWideCrashProfile` /
  `buildLocationCrashProfile` live in the L79.3k–L80.5k cluster, outside every
  v2 band (20:~L98k, 21:~L102k, 22:~L92–95k, 33:~L82.7–86k, 37:~L44k).
- App-wide shared globals (`crashState`, `jurisdictionContext`, `COL`, map
  instance globals) stay inline with `window` mirrors; only module-private
  state moves (`crashTreeState` non-contiguous → per-§0 decision; `safetyState`
  contiguous → moves cleanly).
- **Always re-derive at §0 by NAME, never by snapshot range** — drift between
  Session F (151,729) and Session H (149,314) is ~−2,400 lines and will
  continue as prerequisites ship.
- No Playwright smoke test for the planning sessions (documentation only); the
  §6 smoke test applies to each extraction session.
