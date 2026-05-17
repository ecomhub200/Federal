# Remaining-Work Inventory — Modular Extraction Refactor

> **Status snapshot — 2026-05-17 (CC Session L).**
> All anchors / line numbers below were **Cowork-verified this session**
> with live `grep` against `app/index.html` @ **146,633 lines**,
> `find app/modules`, and `ls modular-prompts/`. They are **not** taken
> from `INDEX_MAP*.md` (stale — built from the 159,387-line snapshot).
> Line numbers drift after every extraction — **re-derive every anchor
> by function name at run time**, never trust a recorded line.

This document is **documentation only**. No code was extracted; neither
`app/index.html` nor any module nor any prompt was modified.

---

## 0. Headline numbers

| Metric | Value |
|---|---|
| `app/index.html` (current) | **146,633 lines** |
| `app/modules/` | **61 `.js` files, 24,597 LOC** |
| IIFE-round prompt files | 67 (`01–46` + 5×`-v2` + `40a/40b/40c*` + `42b/42b1-3/42c*/42d` + `44-v2`) |
| Stage-A prompt files | 54 (`STAGE_A_01–54`, deferred phase) |
| End-state target | `app/index.html` < 30,000 lines |

### Cross-batch line-count accounting

```
Original app/index.html ................. 159,387
After spatial batch (geo-tier etc.) ..... 153,085
After geo-tier (prompt 25) .............. 151,729   (−1,356)
Session H baseline (re-anchor round) .... 149,314
Current (verified Session L) ............ 146,633
Net reduction so far ....................  12,754   (≈8.0% of original)
Remaining to target ..................... ~116,633 lines to relocate
```

---

## 1. Per-prompt status table

Status legend: **DONE** (extracted & wired) · **SUPERSEDED** (replaced,
do not run) · **RETIRED** (no replacement, already covered) ·
**SKIPPED** (defective prompt — needs a resolution doc) · **READY**
(Session-M candidate — anchors live-verified) · **BLOCKED** (gated /
non-isolable) · **INLINE** (not yet started) · **N/A** (parent
index / advisory, not executable).

| Prompt | Title | Status | Where / Note |
|---|---|---|---|
| 01 | spatial-hierarchy-registry | DONE | `spatial/hierarchy-registry.js` (Batch 1) |
| 02 | spatial-boundary-service | DONE | `spatial/boundary-service.js` (Batch 1) |
| 03 | spatial-federal-boundaries | DONE | `spatial/federal-boundaries.js` (Batch 1) |
| 04 | spatial-spatial-clip | DONE | `spatial/spatial-clip.js` (Batch 1) |
| 05 | spatial-aggregate-loader | DONE | `spatial/aggregate-loader.js` (Batch 1) |
| 06 | warrants-signal-tmc | DONE | `warrants/signal-tmc.js` (Batch 6) |
| 07 | warrants-signal-thresholds | DONE | `warrants/signal-thresholds.js` (Batch 6) |
| 08 | safety-sign-deficiency | DONE | `warrants/signal.js` (Batch 6) |
| 09 | assets-school-tab | DONE | `assets/school-tab.js` (Batch 6) |
| 10 | assets-transit-tab | DONE | `assets/transit-tab.js` (Batch 6) |
| 11 | assets-asset-export | DONE | `assets/asset-export.js` (Batch 6) |
| 12 | scorecard-scorecard-tier | DONE | `scorecard/scorecard.js` (coord. 12+13+14) |
| 13 | scorecard-scorecard-render | DONE | `scorecard/scorecard.js` (coordinated) |
| 14 | scorecard-scorecard-choropleth | DONE | `scorecard/scorecard.js` (coordinated) |
| 15 | dashboard-dashboard-tab | INLINE | target `app/dashboard-tab.js` absent |
| 16 | hotspots-hotspots-tab | INLINE | target `app/hotspots-tab.js` absent |
| 17 | intersection-intersection-tab | INLINE | target absent |
| 18 | pedbike-pedbike-tab | INLINE | target absent |
| 19 | analysis-analysis-tab | SKIPPED | anchor unisolable — `MODULAR_PLAN_PROMPT_19_RESOLUTION.md` (real block `initAnalysisSearch` ~L64193) |
| 20 | crash-tree-crash-tree-tab | SUPERSEDED | → `20-v2` |
| 20-v2 | crash-tree-tab (re-anchored) | BLOCKED | gate = prompt 19 (`analysis-tab.js` script tag = 0). `initCrashTreeTab` @ L95411 |
| 21 | fatal-speeding-tab | SUPERSEDED | → `21-v2` |
| 21-v2 | fatal-speeding-tab (re-anchored) | BLOCKED | chain → 20-v2 → 19. `initFatalSpeedingTab` @ L99175 (cleanest of six) |
| 22 | safety-safety-focus | SUPERSEDED | → `22-v2` |
| 22-v2 | safety-focus (re-anchored) | BLOCKED | chain → 21-v2. `initSafetyFocus` @ L89722, `safetyState` @ L88841 (contiguous) |
| 23 | core-epdo-presets | DONE | `core/epdo-presets.js` |
| 24 | core-tier | DONE | `core/tier.js` |
| 25 | spatial-geo-tier | DONE | `spatial/geo-tier.js` (1,357 LOC, Session A B4) |
| 26 | spatial-r2-resolve | DONE | `spatial/r2-resolve.js` |
| 27 | grants-grants-rank | INLINE | never ran (per CLAUDE.md) — `grants/ranking.js` is the off-limits pre-extraction, not this |
| 28 | grants-grants-ai | INLINE | never ran |
| 29 | grants-grants-email | INLINE | never ran |
| 30 | grants-grants-ui | DONE | `grants/grants-ui.js` (Session D, 2,185 LOC) |
| 31 | cmf-cmf-search | **READY** | `loadCMFDatabase` @ L81808; prereq `grants-ui.js` @ L4466 ✓. SUPERVISED — `cmfState` @ L76502 non-contiguous; likely >500 LOC sub-split |
| 32 | cmf-cmf-ai | **READY** (gated → 31) | `initCMFAI` @ L41049 (~354 LOC). Queue after 31 wires its tag |
| 33 | cmf-cmf-deficiency | SUPERSEDED | → `33-v2` |
| 33-v2 | cmf-deficiency-resplit | BLOCKED | gated behind 31+32; re-split 33a+33b |
| 34 | map-map-safe-helpers | DONE | `map/map-safe-helpers.js` |
| 35 | map-map-init | INLINE | target `map/map-init.js` absent |
| 36 | map-map-layers | DONE | `map/map-layers.js` (Session G) |
| 37 | map-map-render | SUPERSEDED | → `37-v2` |
| 37-v2 | map-render (re-anchored) | INLINE | prereq 36 ✓ — needs §0 re-verify before queuing |
| 38 | map-map-boundary | RETIRED | `ensureTierBoundaryDisplayed` 0 matches — already in off-limits `spatial/geo-tier.js` |
| 39 | map-map-points-hydrate | DONE | `map/map-points-hydrate.js` |
| 40 | ai-ai-mode | SUPERSEDED | navigateTo split → 40a/40b/40c* |
| 40a | navigateTo-shell | N/A | INDEX_MAP-regen advisory, not an extraction |
| 40b | ai-mode-toggle | DONE | `ai/ai-mode-toggle.js` (Session D) |
| 40c | ai-analyst | N/A | parent index → 40c1/40c2/40c3 |
| 40c1 | ai-analyst-chat | INLINE | owns `aiState`; runs first in AI-analyst chain |
| 40c2 | ai-analyst-mutcd | INLINE | — |
| 40c3 | ai-analyst-context | INLINE | — |
| 41 | ai-ai-domain-knowledge | SKIPPED | anchor unisolable — `MODULAR_PLAN_PROMPT_41_RESOLUTION.md` (real DK block ~L79162) |
| 42 | reports-reports-standard | SUPERSEDED | navigateTo split → 42b*/42c*/42d |
| 42b | reports-standard | N/A | parent index (override: `MODULAR_PLAN_42b_PREFLIGHT.md`) |
| 42b1 | reports-standard-core | DONE | `reports/reports-standard-core.js`+`-core2`+`-types`+`-types2` (Session D) |
| 42b2 | reports-pdf | **READY** | `printReport`@L64332 `downloadReportPDF`@L64359 `generateStandardReportPDF`@L64415 `copyReportText`@L65398; prereq `reports-standard-types.js`@L4484 ✓ |
| 42b3 | reports-charts | **READY** (gated → 42b2) | `createReportCharts`@L64264 …`createTrendCharts`@L64317 (~66 LOC). Queue after 42b2 |
| 42c | reports-before-after | N/A | parent index |
| 42c1 | report-ba-engine | INLINE | — |
| 42c2 | report-ba-monitoring | INLINE | — |
| 42c3 | report-ba-export | INLINE | — |
| 42d | reports-countermeasures | INLINE | parent + 3 sub-modules, not yet split |
| 43 | reports-reports-custom | BLOCKED | no usable anchor (placeholder `[Rr]eport`) — needs re-author resolution doc |
| 44 | data-filter-wiring | SUPERSEDED | → `44-v2` |
| 44-v2 | iife-wholesale | **READY** | IIFE @ L145501, close-log `[Round 18]` @ L146191; self-contained ~691 LOC; no gate |
| 45 | app-tab-dispatcher | DONE | `app/tab-dispatcher.js` (Batch 3) |
| 46 | app-bootstrap | BLOCKED | anchors non-contiguous (`autoLoadCrashData`@L28075 vs `attemptAutoload`@L144079); `_supabaseTabReady` 0 matches — needs re-anchor resolution |
| STAGE_A_01–54 | ESM migration | DEFERRED | runs only after the entire IIFE round; one coordinated cutover (`STAGE_A_54`) |

---

## 2. Feature-area summary

| Area | Done / Prompts | Remaining (priority order) |
|---|---|---|
| spatial | 7 / 7 | — complete |
| warrants | 3 / 3 | — complete |
| assets | 3 / 3 | — complete |
| scorecard | 3 / 3 | — complete (1 coordinated module) |
| core | 2 / 2 | — complete (constants/epdo pre-extracted) |
| app/tabs | 1 / 6 | 15, 16, 17, 18 (inline); 46 (blocked—needs re-anchor) |
| analysis | 0 / 1 | 19 (skipped — needs resolution doc) |
| crash-tree | 0 / 1 | 20-v2 (blocked on 19) |
| fatal-speeding | 0 / 1 | 21-v2 (blocked on 20-v2) |
| safety | 0 / 1 | 22-v2 (blocked on 21-v2) |
| grants | 1 / 4 | 27, 28, 29 (never ran — inline) |
| cmf | 0 / 3 | **31 (READY)** → **32 (READY)** → 33-v2 (gated) |
| map | 3 / 6 | 35 (inline); 37-v2 (re-verify §0); 38 retired |
| ai | 1 / 5 | 40c1 → 40c2 → 40c3; 41 (skipped — needs resolution) |
| reports | 1 / 8 | **42b2 (READY)** → **42b3 (READY)**; 42c1-3, 42d, 43 (43 blocked) |
| data | 0 / 1 | **44-v2 (READY)** |

**Net immediately-runnable work (Session M):** 44-v2, 42b2, 42b3, 31,
32 — see `MODULAR_PLAN_SESSION_M_QUEUE.md`.

---

## 3. Blocked/skipped — what each needs before it can queue

| Item | Blocker | Unblock action |
|---|---|---|
| 19 | anchor unisolable | re-author with real anchor `initAnalysisSearch` (~L64193) per its resolution doc |
| 20-v2 → 21-v2 → 22-v2 | chain gated on 19 | ship 19 first; then sequential |
| 41 | anchor unisolable | re-author with `initDomainKnowledge` (~L79162) per its resolution doc |
| 43 | placeholder anchor `[Rr]eport` | author a resolution doc with the real custom-report-builder anchor set |
| 46 | anchors non-contiguous + `_supabaseTabReady` absent | author a re-anchor resolution doc (pattern of 19/41) |
| 33-v2 | gated behind cmf 31+32 | runs after Session M ships 31 & 32 |

Each defective prompt should get a `MODULAR_PLAN_PROMPT_<n>_RESOLUTION.md`
(same pattern as the existing 19/41/44 resolution docs) before it is
queued. Treat as **Session N backlog**.

---

## 4. Methodology / caveats

- Verified via live `grep`/`find` on 2026-05-17 against the 146,633-line
  `app/index.html`. Sub-agent prose was cross-checked, not trusted
  blindly (two agents disagreed on prompt filenames — the `ls` output
  here is authoritative).
- `INDEX_MAP*.md` is **stale** (159,387-line snapshot). Every prompt's
  §0 must re-derive its block by **function-name anchor + brace read**,
  never by recorded line range.
- Off-limits pre-extractions (`core/*`, `utils/date-utils`,
  `ai/context`, `grants/ranking`, `ui/skeletons`, `data/*`,
  `batch-ba/*`, `upload/*`, `worker/*`, `loader.js`) are counted in the
  61-file total but are **not** credited to any numbered prompt.
