# `navigateTo` Structure Survey — Forensic Record

**Session:** CC Session B (navigateTo split planning)
**Date:** 2026-05-16
**Subject:** `app/index.html` (current: **153,085 lines**)
**Verdict:** The "`navigateTo` mega-function" **does not exist**. The premise
behind blocked prompts 40 & 42 is a stale-snapshot heuristic artifact.

---

## 1. Finding — `navigateTo` is a 12-line stub

`app/index.html` L121–L132, verbatim:

```javascript
    // Navigation function placeholder - will be fully defined in main script
    if (typeof navigateTo === 'undefined') {
        window.navigateTo = function(tabId) {
            console.log('[navigateTo] Early call to navigate to:', tabId);
            // Defer to main navigateTo when ready
            setTimeout(function() {
                if (typeof window._mainNavigateTo === 'function') {
                    window._mainNavigateTo(tabId);
                } else {
                    console.warn('[navigateTo] Main navigation not ready, storing request');
                    window._pendingNavigation = tabId;
                }
            }, 100);
        };
    }
```

This is an **early-boot placeholder** inside the `<script>` block L84–L134.
It does no dispatch — it `setTimeout`-defers to `window._mainNavigateTo` and
queues `window._pendingNavigation` if the real implementation is not ready.

The **real** tab dispatcher was **already extracted** to
`app/modules/app/tab-dispatcher.js` (prompt 45, executed):

- `tab-dispatcher.js` defines `showTab(tabId)` (the ~330-line real switch),
  `navigateTo(tabId)` (thin wrapper), sets `window._mainNavigateTo = navigateTo`,
  drains `window._pendingNavigation`, and dual-exposes
  `window.showTab`/`window.navigateTo` + CL mirrors; calls
  `CL._registerModule('app/tab-dispatcher')`.
- Wired in `app/index.html` at **L4477**:
  `<script src="modules/app/tab-dispatcher.js"></script>`.

There is **no mega-function**, and the dispatcher is **already modularized**.
Nothing to split.

---

## 2. Root cause — INDEX_MAP heuristic artifact on a stale snapshot

`INDEX_MAP_part1.md` header:

```
Snapshot: 2026-05-15 · source `app/index.html` (159387 lines)
> End L is a heuristic (next declaration start − 1).
```

`INDEX_MAP_part1.md` L13:

```
| 121 | 16561 | 16441 | `navigateTo` | window fn | — | refs:34 | Tab Dispatcher | app/modules/app/tab-dispatcher.js |
```

Two compounding defects:

1. **Stale source.** The inventory was built from a **159,387-line**
   snapshot. The live file is **153,085 lines** (≈6,300 lines already
   extracted by later rounds). Every absolute line number in `INDEX_MAP*.md`
   is therefore off.
2. **"End L = next declaration − 1" swallowed non-JS.** The parser saw
   `window.navigateTo = function` at L121, then found **no recognized
   top-level declaration** until L16561 — because everything between is
   **not JS declarations**: the `<style>` CSS block (L143–L4438), CDN/module
   `<script src>` tags, and inline-`onclick=` HTML body markup. The heuristic
   attributed all 16,441 of those lines to the 12-line stub.

The `navigateTo @ L121–L16561 / 16,441 LOC` row is a **phantom**. There was
never any extractable AI-mode or reports JS "inside `navigateTo`."

---

## 3. Current `app/index.html` block map

Where JS actually lives (inline `<script>` blocks, verified by grep):

| Region | Lines | Contents |
|---|---|---|
| Boot stubs | L76–L81, L84–L134 | early `navigateTo` stub @ L121–L132 |
| CSS | L143–L4438 | `<style>` block (~4,295 lines) |
| Vendor + module `<script src>` cluster | L4440–~L4478+ | firebase/supabase/auth + `modules/*.js` incl. `app/tab-dispatcher.js` @ L4477 |
| Inline JS block 1 | **L19113–L45018** | AI-mode toggle, large feature set |
| Inline JS block 2 | L45019–L47796 | |
| Inline JS block 3 | L47797–L55378 | |
| Inline JS block 4 | L55379–L63241 | |
| Inline JS block 5 | L63242–L68275 | |
| Inline JS block 6 | **L68276–L131917** | reports, AI analyst, BA, most features |
| Inline JS block 7 | L132022–L152646 | Round-18 wrappers, autoload |
| Small tails | L152998–153082 | |

---

## 4. Real code inventories (what prompts 40 & 42 actually target)

### 4a. AI Mode toggle + header API key — `L28041–L28273` (~232 LOC, contiguous)

Inside inline block 1. Module-private const + 9 functions:

| Line | Decl |
|---|---|
| L28041 | `const AI_MODE_STORAGE_KEY = 'crashLens_aiModeEnabled';` |
| L28043 | `function toggleAIMode()` |
| L28065 | `function handleAIToggleKeydown(event)` |
| L28072 | `function initAIModeToggle()` |
| L28103 | `function saveHeaderApiKey()` |
| L28139 | `function clearHeaderApiKey()` |
| L28152 | `function updateHeaderKeyStatus(hasKey)` |
| L28176 | `function updateAllAIStatusIndicators(hasKey)` |
| L28203 | `function updateHeaderProviderLink()` |
| L28237 | `function initHeaderApiKey()` |

Listener: `document.addEventListener('DOMContentLoaded', initAIModeToggle)`
(~L28098, inside block — moves with the code). Boundary: const at L28041
follows the key-session helper cluster; block ends before the
`STATE_HSO_REGISTRY` const banner at L28274. Single ≤500 module ✓.

### 4b. AI Analyst / MUTCD / chat — `L80084–L82947` (~2,863 LOC, contiguous)

Inside inline block 6. `const aiState = {...}` @ L80084; ~46 functions.
Bounded by `downloadFile()` (L80072) above and the CMF module banner
(L82948 `// CMF COUNTERMEASURES MODULE`) below. Exceeds the 500-line cap →
**must sub-split** (see `NAVIGATETO_SPLIT_PLAN.md` §3). Notable:

- `buildMUTCDContext` (L80422, ~213 LOC) and
  `buildProgrammaticCrashAnalysis` (L80739, **~646 LOC single fn**) are
  individually large.
- **⚠ Name collisions with off-limits modules:** `buildCountyWideCrashProfile`
  (L81823) and `buildLocationCrashProfile` (L81878) are **inline legacy
  duplicates** of methods already owned by the off-limits
  `app/modules/analysis/crash-profile.js`. They must **NOT** be relocated by
  an AI extraction (treat as holes; flag for separate dedup). `getAIAnalysisContext`
  (L82245) is inline-only — NOT owned by off-limits `ai/context` (verified) —
  safe to move.

Function list (abbrev): `loadSavedKey, handleAIFileSelect, renderAttachments,
removeAttachment, askSuggestion, clearAIChat, clearApiKey, addMessage,
addTypingIndicator, removeTypingIndicator, buildCrashDataContext` (chat core,
L80090–L80369); `initMUTCDLocationDropdown, loadMUTCDLocation,
clearMUTCDLocation, buildMUTCDContext, buildPineconeRAGContext` (MUTCD,
L80370–L80738); `buildProgrammaticCrashAnalysis, buildRAGQueries,
buildNewAgent1Input, buildNewAgent2Input, formatMUTCDAnalysisForChat` (engine,
L80739–L81822); `askMUTCDGuidance, askMUTCDForSafetyCategory,
initSignalWarrantChecker, toggleWarrantChecker, toggleCrossingEvalSection,
openCrossingEvalModal, closeCrossingEvalModal, analyzeSignalWarrant,
askAboutWarrant7` (warrant, L81829–L82143, **skipping** the two off-limits
crash-profile dups); `buildSystemPrompt, getAIAnalysisContext,
buildLocationCrashContext, updateAIContextIndicator` (prompt/context,
L82144–L82431); `updateMUTCDAILocationBar, copyMessageContent,
updateMUTCDRefCounters, askAboutMUTCDSection, formatAIResponse,
convertMUTCDReferencesToCards, renderMUTCDCitationCard, copyMUTCDCitation`
(UI, L82432–L82947).

### 4c. Reports — Standard — `L68281–L70781` (~2,500 LOC, contiguous)

Inside inline block 6. Bounded by `initAnalysisSearch()` (L68253) above.
~52 functions: `showReportSubTab` (L68281), `updateReportOptions`,
`buildAIContext`, `generateReport` (L68641 dispatcher),
`generateSystemwideReport`, `generateCorridorReport`, `generateSafetyReport`,
`generatePedBikeReport`, `generateTrendReport`, `generateSafetyFocusReport`,
exec-summary/TOC/stats helpers, and chart builders `createReportCharts`
(L70716), `createSafetyCharts`, `createPedBikeCharts`, `createTrendCharts`
(L70769). Exceeds cap → sub-split.

### 4d. Reports — Countermeasures + Before/After + monitoring — `L75038–L79908` (~4,870 LOC, contiguous)

Inside inline block 6. Bounded above by the standard-report chart tail and
below by `saveSession()` (L80038). Three logical bands:

- **Countermeasures/memo (L75038–L77330):** `generateCountermeasuresReport`,
  `generateIntersectionReport`, `generateHotspotReport`,
  `generateDashboardReport`, `generateCrashTreeSystemicReport`,
  `generateHotspotRankingReport`, `generateGrantSupportReport`, memo builders,
  `createWordDocumentWithHeaderFooter`, recommendation generators.
- **BA engine (L77331–L78422):** `switchBAMode` … `runBeforeAfterAnalysis`
  (L77895) … `displayBA*` … `displayBAConclusions`.
- **BA export + monitoring (L78423–L79908):** `printBAReport`, `downloadBAPDF`,
  `exportBAData`, `copyBAReport`, `openBAEmailSchedule`,
  `generateBAPDFForEmail`, the `initBAMonitoringPanel` …
  `refreshBAMonitorSubscriberChips` monitoring suite.

Exceeds cap → sub-split.

---

## 5. Implications

1. Prompts 40 & 42 were never blocked by a mega-function. Their stale
   ranges (L12100–L16557, L9500–L14000) point at CSS/HTML markup.
2. The real AI-mode/reports code is ordinary top-level `function`
   declarations, **independently extractable today**.
3. `INDEX_MAP*.md` is stale and its "BLOCKED inside navigateTo" /
   range-based claims must be **re-validated, not trusted**, until
   regenerated against the live 153,085-line file.
4. Every affected block exceeds the 500-line module cap → planned sub-split
   in `NAVIGATETO_SPLIT_PLAN.md`.
