# SUPERSEDED — modular-prompts replacement map

**Maintained by CC Session H (2026-05-17) onward.** This file records which old
prompt files have been replaced by re-anchored `v2` (or sub-split) prompts. The
**original prompt files are byte-unmodified** (hard refactor constraint) — this
table is the override layer: a runner MUST consult this file first and, if a
prompt appears in the "Old prompt" column, run the "Replacement" instead.

## Batch 5 LARGE BLOCK re-anchor round (CC Session H)

Reason class: every old Batch-5 LARGE BLOCK prompt carries a stale snapshot
range (built from a 159,387→151,729-line snapshot; live file is **149,314**)
and/or a structural defect. Re-anchored against live `app/index.html` per the
`BATCH_5_PROMPT_<N>_RISK.md` docs (CC Session F) + Session-H live verification.

| Old prompt | Replacement | Reason | Risk doc |
|---|---|---|---|
| `20-crash-tree-crash-tree-tab.md` | `20-v2-crash-tree-tab.md` | Stale snapshot L105300–L109000; live `initCrashTreeTab` ~L98092; non-contiguous `crashTreeState` (~L22163) needs an explicit move-vs-mirror decision | `BATCH_5_PROMPT_20_RISK.md` |
| `21-fatal-speeding-fatal-speeding-tab.md` | `21-v2-fatal-speeding-tab.md` | Stale snapshot L109100–L113700; live `initFatalSpeedingTab` ~L101856, `applyFSFilters` ~L102465 | `BATCH_5_PROMPT_21_RISK.md` |
| `22-safety-safety-focus.md` | `22-v2-safety-focus.md` | Stale snapshot L99600–L105299; live `initSafetyFocus` ~L92403, `updateSafetyCards` ~L92871, `safetyState` ~L91522 (contiguous, moves with block) | `BATCH_5_PROMPT_22_RISK.md` |
| `33-cmf-cmf-deficiency.md` | `33-v2-cmf-deficiency-resplit.md` | Mis-sized: claimed "~9,601 lines" (next-decl phantom); real ~1,000 LOC, anchors L82710–L83388, **interleaved** with Analysis/Grants/CMF → **re-split into 33a + 33b** | `BATCH_5_PROMPT_33_RISK.md` |
| `37-map-map-render.md` | `37-v2-map-render-reanchored.md` | **No usable anchor** (`[Mm]ap` literal grep; `(map render/cluster fns)` placeholder). Re-anchored on real names `initMap`/`updateMapDisplay`/`createMarker`; render sub-band must exclude interleaved address-search + PDF-map decls | `BATCH_5_PROMPT_37_RISK.md` |
| `38-map-map-boundary.md` | **RETIRED — no replacement** | Primary anchor `ensureTierBoundaryDisplayed` has **0 matches** in `app/index.html`; already extracted into the off-limits `app/modules/spatial/geo-tier.js`. Responsibility (boundary display + tier-restore + `jurisdictionChanged`/`tierChanged` wiring) is fully absorbed there. Re-extraction would collide with an off-limits module. | `BATCH_5_PROMPT_38_RISK.md` |

### Notes
- **38 is not replaced.** Treat as a verification/close-out item only: confirm
  `spatial/geo-tier.js` covers the boundary-restore responsibility and strike
  38 from the LARGE BLOCK queue (orchestrator action — not done here).
- All v2 prompts: §0 line numbers are *live as of 2026-05-17* and **will drift
  again** — every v2 §0 still mandates re-derive-by-brace by NAME.
- Every v2 LARGE BLOCK prompt carries a `🔴 LARGE BLOCK — Cowork supervised`
  callout + a "STOP after §0 grep" pause before §4 delete.

## 42b family (Reports Standard) — NOT superseded, override-documented

`42b-reports-standard.md` (parent index) + `42b1-reports-standard-core.md` +
`42b2-reports-pdf.md` + `42b3-reports-charts.md` are **kept as-is** (byte
unmodified). Their band model is stale (band-order inversion;
`resolveReportPeriod`/`generateFindings` mis-assigned; `generateStandardReportPDF`
oversized indivisible fn). The correction layer is
**`MODULAR_PLAN_42b_PREFLIGHT.md`** (repo root) — a runner MUST read it
alongside each 42b prompt and apply its §3 overrides at §0. No 42b `v2` files
were created (the splits the prompts already describe are correct once
re-anchored — verdict SAFE-WITH-PAUSE).
