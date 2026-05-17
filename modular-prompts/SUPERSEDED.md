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

---

`41-ai-ai-domain-knowledge.md`  →  SUPERSEDED BY  `41-v2-ai-domain-knowledge.md`  (Session N, 2026-05-17)
  reason: 3 prompt-authoring defects (NOT drift) — placeholder anchor
  `(domain knowledge fns)`; un-satisfiable `grep 'ai[A-Z]|[Aa]ssistant'` §5
  ("expected 0 matches" impossible); wrong snapshot L86463–L88000 + "rescue"
  satellite anchors that are Asset-Deficiency, a different feature. Perpetually
  SKIPPED in Sessions A/G/J. Real DK block is contiguous L76221–L78015
  (~1,795 LOC, 3.6× ceiling) → 6-child re-split. Root cause + manifest:
  `MODULAR_PLAN_PROMPT_41_FIX.md`. Do NOT run `41-ai-ai-domain-knowledge.md`.

---

`15-dashboard-dashboard-tab.md`  →  SUPERSEDED BY  `15-v2-dashboard-tab.md`  (Session N, 2026-05-17)
  reason: stale snapshot L48699–L51326; live `updateDashboard`@41954, true
  band L41954–~L43824 (~1,871 LOC, 4× ceiling) → 4-child re-split (DASHBOARD
  SEARCH sub-feature excluded). Analysis: `NEVER_RUN_PROMPTS_ANALYSIS.md`.

---

`16-hotspots-hotspots-tab.md`  →  SUPERSEDED BY  `16-v2-hotspots-tab.md`  (Session N, 2026-05-17)
  reason: stale snapshot L61500–L63344; live `analyzeHotspots`@54717, band
  L54717–~L55790 (~1,074 LOC) → 3-child re-split. NOT superseded by off-limits
  `analysis/hotspots.js` (that is the hotspot-math module; this is the tab UI).
  Cleanest of the never-run set.

---

`17-intersection-intersection-tab.md`  →  SUPERSEDED BY  `17-v2-intersection-tab.md`  (Session N, 2026-05-17)
  reason: stale snapshot L64600–L65800; live `updateIntersectionTab`@57641,
  band L57641–~L59222 (~1,582 LOC) → 4–5-child re-split (detail-panel tail
  split by brace read).

---

`18-pedbike-pedbike-tab.md`  →  SUPERSEDED BY  `18-v2-pedbike-tab.md`  (Session N, 2026-05-17)
  reason: stale snapshot L66772–L68500 / "~1729"; live `updatePedBikeTab`@59225,
  true band L59225–~L62692 (~3,468 LOC, ~2× the stale figure, 7× ceiling) →
  7 feature-band children. Highest split risk of the set.

---

`27-grants-grants-rank.md`  →  SUPERSEDED BY  `27-v2-grants-rank.md`  (Session N, 2026-05-17)
  reason: v1 anchor set NON-CONTIGUOUS — `grantState`@22688 /
  `GRANT_SCORING_PROFILES`@22742 sit inside a shared state-decl cluster (with
  `districtState`/`mutcdState`/`selectionState`/`warrantsState`) ~7,200 lines
  from `initGrantModule`@29876; CLAUDE.md mandates `grantState` stays inline.
  v2 scope = contiguous grant engine L29665–L31813 (~2,149 LOC) → 5-child
  re-split, state window-mirrored not moved, dashboard-resize listener tail
  caveat. Not superseded by `grants-ui.js`.

---

`28-grants-grants-ai.md`  →  SUPERSEDED BY  `28-v2-grants-ai.md`  (Session N, 2026-05-17)
  reason: anchor/responsibility mismatch — v1 anchors (`showNotifTab` etc.)
  are email-notification UI (now owned by 29-v2); v1 *responsibility*
  ("Grant AI agents + narrative generation") = the AI-POWERED FULL APPLICATION
  GENERATION band `generateFullApplicationContent`@35591–`exportAppWord`@37035
  (~1,452 LOC), still inline (NOT in off-limits `grants-ui.js`) → 3-child
  re-split.

---

`29-grants-grants-email.md`  →  SUPERSEDED BY  `29-v2-grants-email.md`  (Session N, 2026-05-17)
  reason: anchors valid but mid-block; original snapshot L39673–L41500. True
  band = whole EMAIL NOTIFICATION SYSTEM region L31814–~L35464 (~3,651 LOC,
  7× ceiling); absorbs prompt 28's stray email-UI anchors → 7 sub-header
  children. High split risk; run last in the grants chain (after 27-v2, 28-v2).
