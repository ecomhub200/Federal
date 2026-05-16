# CC Modular Extraction Prompt 42c1 — Before/After setup + run

**Severity:** Refactor (no behavior change). **Two modules; one session each.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4d, `NAVIGATETO_SPLIT_PLAN.md`
§3. **`runBeforeAfterAnalysis` is the BA anchor (~L77895).** Do NOT touch
already-extracted `batch-ba/*` modules (off-limits).

## §0 Pre-flight (band ~L77331–L78422)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (switchBAMode|setBatchBAAnalysisType|initBALocationDropdown|updateBALocationDropdown|filterBALocations|handleBASearchKeypress|triggerBASearch|selectBASearchResult|loadBALocation|getMatchedCrashesFromMapSelection|computeStatsFromMapPoints|updateBALocationSummary|selectBALocationFromMap|closeBAMapModal|goToMapForBASelection|useMapSelectionForBAStudy|setBAStudyPeriod|calculateBAPeriods|updateBAPeriodDisplay|updateBAMethodInfo|resetBAStudy|runBeforeAfterAnalysis|filterCrashesByPeriod|normalCDF|displayBAResults|displayBAKPIComparison|displayBAStatisticalResults|createBACharts|calculateMonthlyTrend|displayBADetailedTable|displayBAFindings|displayBAConclusions)\b" app/index.html
# Cross-check none of these map to off-limits batch-ba/* (CLAUDE.md). These
# are the report-tab BA functions (distinct from CL.batchBA engine).
```

## §1 Two modules
**(a) `reports/report-ba-setup.js`** — ~L77331–L77894:
`switchBAMode … resetBAStudy` (mode/location-dropdown/map-selection/period).
If brace count >500, cut at `selectBALocationFromMap` boundary → `-setup` +
`-setup2`.

**(b) `reports/report-ba-run.js`** — ~L77895–L78422:
`runBeforeAfterAnalysis, filterCrashesByPeriod, normalCDF, displayBAResults,
displayBAKPIComparison, displayBAStatisticalResults, createBACharts,
calculateMonthlyTrend, displayBADetailedTable, displayBAFindings,
displayBAConclusions`. If >500, cut at `createBACharts` boundary.

Per file: §0 re-derive exact `[start,end]` by brace read; target must not
exist; off-limits cross-check.

## §2 Skeleton (per file)
```js
/**
 * CL reports.ba<X> — extracted (name-anchored). navigateTo-split round,
 * prompt 42c1. Depends: analysis/crash-profile, core/epdo-presets (via
 * window/CL mirrors). NOT the batch-ba/* engine (off-limits) — these are
 * the Reports-tab Before/After functions.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste segment>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.ba<X>=CL.reports.ba<X>||{};
  // window.<fn>=<fn>; CL.reports.ba<X>.<fn>=<fn>;
  CL._registerModule('reports/report-ba-<x>');
})();
```

## §3 Script tags
LATE cluster, after the last reports tag, in order: `report-ba-setup.js`
then `report-ba-run.js`.

## §4 Remove originals
Per module delete its confirmed segment; head/tail-verify.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment; `grep -cE function` drop = moved count;
`node --check` ok; one script tag; `git diff --stat` clean. Console:
`[CL] Module loaded: reports/report-ba-<x>`.

## §6 Smoke test
Deployed app → Reports → Before/After: pick a location, set periods, run
the analysis; verify KPI/stat results + charts render, no new console
errors; `typeof window.runBeforeAfterAnalysis==='function'`.
`playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/report-ba-<x>.js`

## §8 Out of scope
Touching off-limits `batch-ba/*`; renames/reformatting; BA export/monitoring
(42c3/42c2); CLAUDE.md edits; PR unless asked.
