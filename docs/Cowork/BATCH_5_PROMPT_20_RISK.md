# Batch 5 risk analysis — Prompt 20 `crash-tree/crash-tree-tab.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor | Snapshot (stale) | **Live decl** | True LOC | Callsites | onclick |
|---|---|---|---|---|---|
| `initCrashTreeTab` | L105300–L109000 | **L100507** | 49 | 1 | 1 |

- Anchor exists, **exactly 1 match** — locatable.
- Drift: snapshot start L105300 → live L100507 (**−4,793**). The "~3,701-line"
  block size in §1 is a stale next-decl heuristic.
- Contiguity (regenerated INDEX_MAP_part3): L100507 (`Crash Tree`, 49) →
  L100559 (`Crash Tree`, 178) → L100739 (`Crash Tree`, 61), with small
  `Unassigned` nested-arrow rows interleaved (those are *inside* the
  crash-tree fn bodies, not foreign features). The feature block is cohesive
  ≈ L100507–L100800.
- **Not inside a shared foreign IIFE** (the prompt-44 hazard) — it is its own
  Crash Tree cluster.

## §2 Shared-global usage

`initCrashTreeTab` body reads: `crashState`, `jurisdictionContext`
(app-wide shared — **leave inline, expose `window` mirror**, do NOT relocate),
and `crashTreeState` (module-private per the prompt).

⚠ **`crashTreeState` is NOT contiguous with the block** — it is declared at
**L22161**, ~78k lines away in the top-level globals cluster. The prompt's §1
says "move `crashTreeState` with the code", but it is physically separated.
Resolution required before extraction: either (a) move only `crashTreeState`'s
declaration into the module and confirm no remaining inline reader, or
(b) keep it inline with a `window.crashTreeState` mirror. Per regenerated
INDEX_MAP it is tagged module-private, so (a) is preferred but must be
verified by a reader-grep.

No R1/R3 off-limits-name collision: `buildCountyWideCrashProfile` (L80467),
`buildLocationCrashProfile` (L80522), `buildProgrammaticCrashAnalysis`
(L79383) are all far outside this block.

## §3 Onclick consumers

`initCrashTreeTab` — 1 HTML `onclick=`/call reference. Back-compat surface:
`window.initCrashTreeTab` (the prompt's dual-export already covers this).

## §4 Extraction safety verdict

**NEEDS-PRE-WORK** (then SAFE-WITH-PAUSE).

- §0 check #4 (`grep '<script src="modules/analysis/analysis-tab.js">'`)
  returns **0** — the load anchor module (prompt 19, `analysis/analysis-tab.js`)
  has **not** been extracted yet (file absent, no script tag). Running prompt
  20 now triggers the mandatory §0 ABORT.
- The crash-tree block itself is small and cohesive (low intrinsic risk); the
  only structural caveat is the non-contiguous `crashTreeState` global (§2).
- After prompt 19 ships: downgrade to **SAFE-WITH-PAUSE** (LARGE BLOCK
  callout) with the `crashTreeState` mirror/move decision made explicit in §0.

## §5 Contribution to Batch 5 order

Gated by **prompt 19 (`analysis/analysis-tab.js`)**. First LARGE BLOCK in the
19→20→21→22 LATE-cluster chain (each prompt's load anchor is the previous
module). Schedule immediately after 19; it unblocks 21.
