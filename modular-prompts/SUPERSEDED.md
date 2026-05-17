# Superseded Extraction Prompts

Append-only ledger of `modular-prompts/*.md` prompts that have been replaced
by a newer prompt. One entry per line-group. Do **not** delete superseded
prompt files — this ledger is the authoritative "do not run" list.

Format:

```
<old prompt>  →  SUPERSEDED BY  <new prompt>  (<session/date>)
  reason: <one-line why>
```

---

`44-data-filter-wiring.md`  →  SUPERSEDED BY  `44-v2-iife-wholesale.md`  (Session I, 2026-05-17)
  reason: the 5 target anchors (`_r18ApplyDashboardYearFilter`,
  `_r18ReloadHotspots`, `_r19LoadSafetyCategoriesWithFilter`,
  `_bindFilterInputs`, `_restoreFilterInputs`) are NOT a standalone block —
  they live inside one shared `(function(){'use strict';…})()` IIFE
  (Session-I snapshot L148182–L148874, 693 lines, 14 inner functions +
  closure-private `_trafficCtrlCache`; re-derive by function-name anchor,
  the line range drifts). Isolated extraction would break closure
  semantics. 44-v2 extracts the entire IIFE verbatim as
  `app/modules/data/dashboard-filter-bindings.js`. After 44-v2 runs and
  verifies green, prompt 44 is COMPLETE — do NOT run
  `44-data-filter-wiring.md`. See
  `MODULAR_PLAN_44_v2_IIFE_WHOLESALE_PLAN.md`.

---

`20-crash-tree-crash-tree-tab.md`  →  SUPERSEDED BY  `20-v2-crash-tree-tab.md`  (Session H, 2026-05-17)
  reason: stale snapshot L105300–L109000; live `initCrashTreeTab` ~L98092;
  module-private `crashTreeState` is non-contiguous (~L22163, ~76k lines
  away) → 20-v2 §0 adds an explicit move-decl-vs-`window`-mirror decision.
  Re-anchored against live `app/index.html` @ 149,314 lines. Risk doc:
  `BATCH_5_PROMPT_20_RISK.md`. Gated by prompt 19 (`analysis/analysis-tab.js`).

---

`21-fatal-speeding-fatal-speeding-tab.md`  →  SUPERSEDED BY  `21-v2-fatal-speeding-tab.md`  (Session H, 2026-05-17)
  reason: stale snapshot L109100–L113700; live `initFatalSpeedingTab`
  ~L101856, `applyFSFilters` ~L102465; cleanest of the six (no
  module-private global). Risk doc: `BATCH_5_PROMPT_21_RISK.md`. Gated by
  prompt 20-v2.

---

`22-safety-safety-focus.md`  →  SUPERSEDED BY  `22-v2-safety-focus.md`  (Session H, 2026-05-17)
  reason: stale snapshot L99600–L105299; live `initSafetyFocus` ~L92403,
  `updateSafetyCards` ~L92871; `safetyState` ~L91522 is contiguous (moves
  with the block). Risk doc: `BATCH_5_PROMPT_22_RISK.md`. Gated by prompt
  21-v2.

---

`33-cmf-cmf-deficiency.md`  →  SUPERSEDED BY  `33-v2-cmf-deficiency-resplit.md`  (Session H, 2026-05-17)
  reason: mis-sized — claimed "~9,601 lines" (next-decl phantom); real
  ~1,000 LOC, 5 anchors L82710–L83388, **interleaved** with
  Analysis/Grants/CMF ownership. 33-v2 **re-splits into 33a
  (`cmf-deficiency-ai.js`) + 33b (`cmf-deficiency.js`)** with a
  name-anchored Cowork sub-split. Risk doc: `BATCH_5_PROMPT_33_RISK.md`.
  Gated by prompts 31 (cmf-search) + 32 (cmf-ai).

---

`37-map-map-render.md`  →  SUPERSEDED BY  `37-v2-map-render-reanchored.md`  (Session H, 2026-05-17)
  reason: had **no usable anchor** (§0 grep was the literal `[Mm]ap`;
  §1/§2 used the placeholder `(map render/cluster fns)`). 37-v2 re-anchors
  on real names `initMap` ~L44122 / `updateMapDisplay` ~L44621 /
  `createMarker` ~L44742; the render sub-band must exclude interleaved
  address-search + PDF-map decls (Cowork sub-band decision). Risk doc:
  `BATCH_5_PROMPT_37_RISK.md`. Gated by prompt 36 (`map/map-layers.js`).

---

`38-map-map-boundary.md`  →  RETIRED — NO REPLACEMENT  (Session H, 2026-05-17)
  reason: primary anchor `ensureTierBoundaryDisplayed` has **0 matches** in
  `app/index.html` — already extracted into the off-limits
  `app/modules/spatial/geo-tier.js` (boundary display + tier-restore +
  `jurisdictionChanged`/`tierChanged` wiring fully absorbed there).
  Re-extraction would collide with an off-limits module. Do **not** run
  `38-map-map-boundary.md`; no v2. Verification/close-out only: confirm
  `geo-tier.js` covers the responsibility and strike 38 from the LARGE
  BLOCK queue. Risk doc: `BATCH_5_PROMPT_38_RISK.md`.

---

> Note: prompts `40-ai-ai-mode.md` and `42-reports-reports-standard.md` are
> also "do not run" but are tracked in `CLAUDE.md` / `MODULAR_PLAN.md`
> (navigateTo split round), not here, because they were redirected to a
> chain of replacements rather than a single 1:1 supersession.
>
> Note: the 42b family (`42b-reports-standard.md` + `42b1`/`42b2`/`42b3`)
> is **NOT superseded** — those prompt files are kept byte-unmodified. Their
> stale band model (order inversion; `resolveReportPeriod`/`generateFindings`
> mis-assignment; oversized indivisible `generateStandardReportPDF`) is
> corrected by the override layer `MODULAR_PLAN_42b_PREFLIGHT.md` (repo
> root), which a runner MUST read alongside each 42b prompt and apply at §0.
> Verdict: SAFE-WITH-PAUSE.
