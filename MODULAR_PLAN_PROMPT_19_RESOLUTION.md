# Prompt 19 (`analysis/analysis-tab.js`) — SKIPPED (Session G)

**Date:** 2026-05-17
**Session:** G — Prerequisites batch
**Outcome:** SKIPPED at §0 (anchor unisolable — prompt identity, snapshot, and
stated responsibility point to three different, incompatible locations).
Batch continues with prompt 36 (skip-then-continue rule).

## Why skipped

Prompt 19's entire identity is the anchor **`updateAnalysis`** (§0 grep, §1
anchor decl, §2 public API `window.updateAnalysis = updateAnalysis`, §5
anchor-gone/anchor-present checks). In the current `app/index.html`
(149,314 lines) the three locators disagree:

| Locator | Resolves to | Problem |
|---|---|---|
| §0/§1/§2/§5 anchor `updateAnalysis` | single fn @ **L56044**, ends ~L56064 (next decl `switchAnalysisSubtab`@56074) | ~20 lines; neighbors are `switchAnalysisSubtab`, traffic-inventory, validator, KML export — NOT "analysis tab sub-tabs/AADT/search". A valid-but-pointless 20-line module that does not match the prompt's responsibility. |
| §0/§1/§2 snapshot `L63345–L64599` | `renderPedBikeLocationsFromMatview`, `updatePeopleAnalysis`, `buildQuickLocationData`, `globalQuickLocationFilter`, … | Ped/Bike + People-analysis + global-search functions — a different feature; not "analysis tab"; overlaps other modules' territory. |
| Stated responsibility "Analysis tab: sub-tabs, AADT coverage, search" | the contiguous `analysis*` cluster **L64193–L64505** (see below) | Coherent and extractable — but it does **not** contain `updateAnalysis`, so the prompt's §2 (`window.updateAnalysis = updateAnalysis`) would throw ReferenceError and §5 anchor-present check would fail. |

No single contiguous block satisfies the prompt's anchor **and** snapshot
**and** responsibility simultaneously. The §0 load anchor
`<script src="modules/pedbike/pedbike-tab.js">` is also absent (no
`app/modules/pedbike/` dir) — Session G approved pragmatic placement, but the
decisive blocker is the unisolable identity anchor, not placement.

Per the approved Session G plan ("If the analysis-tab region is
non-contiguous / anchor unisolable → SKIP + RESOLUTION doc, continue") and
CLAUDE.md ("If a prompt's §0 disagrees with reality (drift), ABORT and ask
before improvising. Never edit `app/index.html` outside the confirmed
block"), extracting would require self-authoring a different module identity
and would fail the prompt's own §5 verification — so it is skipped, not
improvised.

## Findings for a future correctly-anchored prompt 19

A genuine, clean, contiguous **Analysis-tab search** block exists (record
for whoever re-authors this prompt — NOT extracted in Session G):

- **Range:** comment header @ **L64193** (`// ====`) through **L64505**
  (end of `initAnalysisSearch`, immediately before the L64506 comment header
  for the Reports feature `showReportSubTab`@L64510). ~313 lines.
- **Declarations (all contiguous, coherent):** `_analysisReadFilters`@64207,
  `_analysisCanUseSupabase`@64215, `_analysisResolveTier`@64218,
  `analysisQuickLocationFilter`@64227, `analysisSelectLocation`@64274,
  `analysisSelectTopQuickLocation`@64302, `analysisGoToCountermeasures`@64310,
  `analysisSearchCrashes`@64335, `_analysisFetchPage`@64370,
  `analysisClearSearch`@64392, `analysisRenderSearchResults`@64400,
  `analysisRenderSearchPagination`@64432, `analysisGoSearchPage`@64449,
  `analysisExportSearchCSV`@64458, `initAnalysisSearch`@64482.
- **Module identity should be `initAnalysisSearch` / the `analysis*` set**,
  NOT `updateAnalysis`. `updateAnalysis`@56044 is a separate ~20-line fn that
  belongs with `switchAnalysisSubtab`@56074 (a different small cluster) — it
  should NOT be moved by this prompt.
- Check for a module-private search-state global (e.g. `analysisSearchMode`,
  referenced @ L64401) — keep it inline if read by remaining code.
- **Namespace:** `CL.analysis.tab` (CL.analysis root exists in loader.js).
- **Placement:** `pedbike-tab.js` does not exist; place after the nearest
  existing analysis sibling, e.g. `<script src="modules/analysis/baselines.js">`.

### Recommended action before re-attempting
Re-author `modular-prompts/19-analysis-analysis-tab.md` with anchor
`initAnalysisSearch` (+ the `analysis*`/`_analysis*` set), snapshot
~L64193–L64505, §2 public API exposing `initAnalysisSearch`/`analysisSearchCrashes`/etc.
(not `updateAnalysis`), a §5 anchor-gone grep on those real names, and a
present load anchor (`analysis/baselines.js`). Decide separately whether the
tiny `updateAnalysis`@56044 + `switchAnalysisSubtab` pair warrants its own
micro-module.
