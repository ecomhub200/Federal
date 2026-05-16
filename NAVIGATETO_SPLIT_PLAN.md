# `navigateTo` Split Plan

**Session:** CC Session B · **Date:** 2026-05-16
**Companion:** `NAVIGATETO_STRUCTURE_SURVEY.md` (forensic evidence)

---

## §1 — Decision: Approach C (no `navigateTo` split)

The original task offered two approaches:

- **A.** Extract `navigateTo` sub-modules first, then run 40+42.
- **B.** Inline-split `navigateTo` first, then extract 40+42.

**Both are moot.** There is no `navigateTo` mega-function — only a 12-line
boot stub (`app/index.html` L121–L132), and the real `showTab`/`navigateTo`
dispatcher is **already extracted** to `app/modules/app/tab-dispatcher.js`
(prompt 45, done). The "16,441 LOC" figure is a stale-INDEX_MAP heuristic
artifact (see survey §2).

**Chosen — Approach C: re-anchor 40 & 42 onto the real declarations and
flag the stale INDEX_MAP.** No splitting, no shell extraction. The blocked
prompts become runnable immediately by pointing them at the real code
locations (survey §4). Because each real block exceeds the 500-line module
cap, they are broken into ≤500-line sub-modules (§3).

Rationale: zero risk to `app/index.html` from a non-existent refactor;
the only real defect is documentation drift (stale INDEX_MAP) plus two
prompts anchored on phantom ranges.

---

## §2 — INDEX_MAP staleness (prerequisite hygiene)

`INDEX_MAP*.md` was built from a **159,387-line** snapshot; the live file is
**153,085 lines**. Its absolute line numbers and its "End L = next
declaration − 1" heuristic produced at least one phantom 16k-LOC entry
(`navigateTo`). **Recommendation:**

1. Regenerate `INDEX_MAP.md` + `INDEX_MAP_part1..4.md` against the live
   `app/index.html` before trusting any further range-based prompt.
2. Treat every existing "⛔ BLOCKED — inside `navigateTo` mega-fn" note as
   **suspect**: re-derive the real block by **function-name anchor**, never
   by snapshot line range. Self-check #2 in MODULAR_PLAN.md flagged
   42↔40 / 40↔43 overlaps — those overlaps are also artifacts of the same
   phantom range and dissolve once anchored by name.
3. Procedure is detailed in `modular-prompts/40a-navigateTo-shell.md`
   (reframed as the INDEX_MAP-regeneration + re-validation task).

This step is advisory, not blocking: the §3 prompts each re-derive their
block by name anchor in §0, so they are safe to run even before regen.

---

## §3 — Sub-module manifest (full ≤500-line split)

All spans are **approximate** (stale-snapshot-independent: each prompt's §0
re-derives the exact `[BLK_START,BLK_END]` by function-name anchor in the
live file). `LATE` cluster = script tag after the last existing
`modules/*.js` tag, ordered by dependency.

### AI Mode (supersedes prompt 40)

| Module | Source band | Anchors | ~LOC | Notes |
|---|---|---|---|---|
| `ai/ai-mode-toggle.js` | L28041–L28273 | `AI_MODE_STORAGE_KEY`, `toggleAIMode`, `initAIModeToggle`, `initHeaderApiKey` | ~232 | single file ✓; moves `DOMContentLoaded` listener |
| `ai/ai-analyst-chat.js` | L80084–L80369 | `aiState`, `loadSavedKey`, `addMessage`, `clearAIChat`, `buildCrashDataContext` | ~286 | owns `aiState` const |
| `ai/ai-analyst-mutcd.js` | L80370–L80738 | `initMUTCDLocationDropdown`, `buildMUTCDContext`, `buildPineconeRAGContext` | ~369 | `buildMUTCDContext` ~213 LOC |
| `ai/ai-analyst-engine.js` | L80739–L81822 | `buildProgrammaticCrashAnalysis`, `buildRAGQueries`, `buildNewAgent1Input`, `buildNewAgent2Input`, `formatMUTCDAnalysisForChat` | ~1,084 | **OVERSIZED EXCEPTION**: `buildProgrammaticCrashAnalysis` ~646 LOC single indivisible fn — module legitimately >500 (precedent: `assets/transit-tab` 975 LOC, CLAUDE.md). Header note required. |
| `ai/ai-analyst-warrant.js` | L81829–L82143 | `askMUTCDGuidance`, `analyzeSignalWarrant`, `askAboutWarrant7`, signal-warrant UI fns | ~315 | **SKIP** L81823 `buildCountyWideCrashProfile` & L81878 `buildLocationCrashProfile` — off-limits dups (see §5) |
| `ai/ai-analyst-context.js` | L82144–L82431 | `buildSystemPrompt`, `getAIAnalysisContext`, `buildLocationCrashContext`, `updateAIContextIndicator` | ~288 | `getAIAnalysisContext` verified NOT owned by off-limits `ai/context` |
| `ai/ai-analyst-ui.js` | L82432–L82947 | `updateMUTCDAILocationBar`, `formatAIResponse`, `convertMUTCDReferencesToCards`, `renderMUTCDCitationCard`, `copyMUTCDCitation` | ~515 | trim at fn boundary to land ≤500 in §0 |

### Reports (supersedes prompt 42; prompt 43 = custom reports, untouched)

| Module | Source band | Anchors | ~LOC | Notes |
|---|---|---|---|---|
| `reports/reports-standard.js` | L68281–L70250 | `showReportSubTab`, `updateReportOptions`, `generateReport`, `generate*Report` family | ~1,970 | **sub-split in §0** at fn boundaries into ≤500 pieces: `reports-standard-core` (dispatcher+systemwide), `reports-standard-types` (corridor/safety/pedbike/trend/safetyfocus) |
| `reports/reports-pdf.js` | L70250–L70715 | `resolveReportPeriod`, `generateFindings`, exec-summary/TOC/stats helpers, `printReport`/`downloadReportPDF`/`generateStandardReportPDF`/`copyReportText` | ~465 | PDF/print/copy + report-data helpers |
| `reports/reports-charts.js` | L70716–L70781 | `createReportCharts`, `createSafetyCharts`, `createPedBikeCharts`, `createTrendCharts` | ~66 | tiny; chart builders |
| `reports/reports-countermeasures.js` | L75038–L77330 | `generateCountermeasuresReport`, `generateIntersectionReport`, `generateDashboardReport`, `generateCrashTreeSystemicReport`, `generateHotspotRankingReport`, `generateGrantSupportReport`, memo builders, `createWordDocumentWithHeaderFooter`, recommendation generators | ~2,293 | **sub-split in §0** into ≤500 pieces by fn boundary: `-reports`, `-memo`, `-recommend` |
| `reports/report-ba-engine.js` | L77331–L78422 | `switchBAMode`, `loadBALocation`, `runBeforeAfterAnalysis`, `displayBA*`, `displayBAConclusions` | ~1,092 | **sub-split in §0**: `-ba-setup` (mode/location/period), `-ba-run` (analysis+display) |
| `reports/report-ba-export.js` | L78423–L78867 | `printBAReport`, `downloadBAPDF`, `exportBAData`, `copyBAReport` | ~445 | ✓ |
| `reports/report-ba-monitoring.js` | L78868–L79908 | `openBAEmailSchedule`, `generateBAPDFForEmail`, `initBAMonitoringPanel` … `refreshBAMonitorSubscriberChips` | ~1,041 | **sub-split in §0**: `-ba-email` (schedule/pdf), `-ba-monitor` (panel/alerts/subscribers) |

Where a band still exceeds 500 LOC and is **not** a single indivisible
function, the runnable prompt instructs the executor to cut at the nearest
`function` boundary into the named ≤500 sub-files during §0 (the existing
template already mandates "If the confirmed block exceeds ~500 lines, STOP
and report — needs the sub-split noted in MODULAR_PLAN.md"). The parent
index prompts (`40c`, `42b`, `42c`) enumerate the exact child files.

---

## §4 — Order of operations

1. **(Advisory) INDEX_MAP regen** — `40a-navigateTo-shell.md`. Not blocking.
2. **`40b-ai-mode-toggle.md`** — smallest, fully isolated, zero off-limits
   collisions. Lowest risk; do first to validate the re-anchor approach.
3. **AI Analyst chain** — `40c1` (chat, owns `aiState`) → `40c2` (mutcd) →
   `40c3` (engine, oversized-exception) → `40c4` (warrant) → `40c5`
   (context) → `40c6` (ui). Order matters: `aiState` const must extract
   first (others reference it via `window`/`CL` mirror).
4. **Reports Standard** — `42b1` (core) → `42b2` (types) → `42b3` (pdf) →
   `42b4` (charts).
5. **Reports Countermeasures** — `42d1` (reports) → `42d2` (memo) →
   `42d3` (recommend).
6. **Before/After** — `42c1` (setup) → `42c2` (run) → `42c3` (export) →
   `42c4` (email) → `42c5` (monitor).
7. One module per session (existing refactor rule). Re-run §0 each time —
   line numbers shift after every prior extraction.

---

## §5 — Risk register (navigateTo-band specific)

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Off-limits name collisions.** `buildCountyWideCrashProfile` (L81823) & `buildLocationCrashProfile` (L81878) are inline legacy dups already owned by off-limits `analysis/crash-profile.js`. | AI-analyst-warrant prompt **excludes** these two lines (block is a "Swiss-cheese" range — extract around the holes). Do NOT move/duplicate them. Flag for a separate dedup cleanup (out of scope here). |
| R2 | **Shared module-private globals.** `aiState` (L80084) read across all AI-analyst sub-modules. | Extract `aiState` with `ai-analyst-chat.js` (first in chain) and expose `window.aiState`/`CL.ai.aiState` mirror; later sub-modules read the mirror, do not redeclare. |
| R3 | **Oversized indivisible function.** `buildProgrammaticCrashAnalysis` ~646 LOC; `buildMUTCDContext` ~213 LOC — cannot be split without splitting a function (forbidden). | `ai/ai-analyst-engine.js` documented as an explicit 500-cap exception in its module header (precedent: `assets/transit-tab` 975 LOC). |
| R4 | **HTML `onclick=` back-compat.** Many of these fns are bound via inline `onclick=`/generated rows (`toggleAIMode`, `askMUTCDGuidance`, `printBAReport`, `generateReport`, …). | MANDATORY dual exposure: `window.<fn>=<fn>` AND `CL.<area>.<fn>=<fn>`. §6 verifies `typeof window.<fn>==='function'`. |
| R5 | **Stale snapshot ranges.** Every line number drifts after each prior extraction. | Each prompt §0 re-derives `[BLK_START,BLK_END]` by **function-name anchor**, never snapshot range. INDEX_MAP cross-check uses name, not line. |
| R6 | **DOMContentLoaded listeners.** `initAIModeToggle` listener @ ~L28098; AI-analyst key/index listener @ ~L82931. | Move the listener with its code block; never duplicate. Post-flight greps confirm 0 residual + 1 in module. |
| R7 | **Cross-band references.** AI-analyst UI/context fns call engine fns and vice versa. | Dual `window.`/`CL.` exposure makes call order irrelevant at runtime (hoisted bare-global pattern); load order in §4 is defensive only. |
| R8 | **Reports ↔ AI-analyst adjacency.** Both live in inline block 6; bands abut. | Name-anchored §0 + explicit boundary fns (`initAnalysisSearch`@68253, `saveSession`@80038, `downloadFile`@80072, CMF banner @82948) prevent over/under-capture. |

---

## §6 — Update to MODULAR_PLAN.md

A new section `§ navigateTo split round (RESOLVED — non-issue)` is appended
to `MODULAR_PLAN.md` (append-only) recording this finding, superseding the
40/42 BLOCKED notes, and listing the §3 manifest + §4 order. The original
40/42 entries are left intact with a single appended pointer line.
`CLAUDE.md` gets an append-only note that 40 & 42 are SUPERSEDED and the
INDEX_MAP is stale.
