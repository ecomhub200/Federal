# Batch 5 risk analysis — Prompt 22 `safety/safety-focus.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor | Snapshot (stale) | **Live decl** | True LOC | Callsites | onclick |
|---|---|---|---|---|---|
| `initSafetyFocus` | L99600–L105299 | **L94818** | 76 | 4 | 4 |
| `updateSafetyCards` | (same range) | **L95286** | 30 | 5 | 5 |

- Both anchors exist, **exactly 1 decl match each** — locatable.
- Drift: snapshot start L99600 → live L94818 (**−4,782**). "~5,700-line" size
  is a stale heuristic.
- Anchors ~468 lines apart (L94818 → L95286); the Safety Focus region is
  contiguous ≈ L93937–L95360 per regenerated INDEX_MAP_part3.
- **Not inside a shared foreign IIFE.**
- Note the MODULAR_PLAN R5 off-by-one: `33↔22` snapshot edges touched at the
  old L99600; with the regen this is moot (33's live cluster is ~L85k, far
  from 22's ~L94.8k) — **no real overlap**.

## §2 Shared-global usage

`initSafetyFocus` body reads: `COL`, `crashState` (app-wide shared — leave
inline + `window` mirror) and `safetyState` (module-private per the prompt).

✅ **`safetyState` IS effectively contiguous**: declared at **L93937**, ~881
lines before `initSafetyFocus` (L94818) — at the head of the same Safety Focus
region, not stranded in the global cluster (contrast prompt 20's
`crashTreeState`). It can move with the block. Still verify at §0 that no
inline reader outside the block references it (window mirror only if so).

No R1/R3 off-limits-name collision in this band.

## §3 Onclick consumers

| fn | onclick / call refs | Back-compat surface |
|---|---|---|
| `initSafetyFocus` | 4 | `window.initSafetyFocus` |
| `updateSafetyCards` | 5 | `window.updateSafetyCards` |

Covered by the prompt's dual-export block. (`safetyState` is not onclick-bound.)

## §4 Extraction safety verdict

**NEEDS-PRE-WORK** (then SAFE-WITH-PAUSE).

- §0 check #4 (`grep '<script src="modules/fatal-speeding/fatal-speeding-tab.js">'`)
  returns **0** — load anchor is the module from **prompt 21**, not yet run.
  Running 22 now triggers the §0 ABORT.
- Block is cohesive; `safetyState` is contiguous (lower risk than prompt 20).
  After prompt 21 ships: **SAFE-WITH-PAUSE** (LARGE BLOCK callout).

## §5 Contribution to Batch 5 order

Gated by **prompt 21** (load anchor = `fatal-speeding/fatal-speeding-tab.js`).
Position 4, last in the 19→20→21→22 LATE-cluster chain. Run after 21.
