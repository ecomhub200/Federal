# CC Modular Extraction Prompt 42b1 — Reports Standard core + types

**Severity:** Refactor (no behavior change). **Two modules; one session each.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4c, `NAVIGATETO_SPLIT_PLAN.md`
§3.

## §0 Pre-flight (band ~L68281–L70249)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html

grep -nE "^function (showReportSubTab|updateReportOptions|buildAIContext|_safeAgg|generateReport|generateSystemwideReport|_legacySystemwideReport|computeSystemwideCategoryData|generateExplorationDashboard|getTopLocation|truncateRoute|generateCategoryTopLocations|generateEnhancedFindings|generateEnhancedRecommendations|generateCorridorReport|generateSafetyReport|generatePedBikeReport|createEnhancedPedBikeCharts|generateTrendReport|generateReportId|getFullTimestamp|getShortTimestamp|buildExecutiveSummary|updateReportFooter|showTableOfContents|getDefaultTOCSections|showExecutiveSummary|computeStats|validateReportData|getDateRange|resolveReportPeriod|generateFindings|generateSafetyFocusReport|generateSafetyFocusRecommendations|generateYearlySection|generateTopLocationsTable|generateNodeTable|generateRecommendations|generateSafetyRecommendations|generatePedBikeRecommendations|generatePedBikeYearlySection|generatePedBikeLocationTable)\b" app/index.html
# Preceding decl: initAnalysisSearch(). Cross-check none map to an
# off-limits module (CLAUDE.md). buildAIContext is reports-local (distinct
# from ai/context module — verify by brace, it's the report AI-context
# helper, not getAIAnalysisContext).
```

## §1 Two modules
**(a) `reports/reports-standard-core.js`** — dispatcher + systemwide:
`showReportSubTab, updateReportOptions, buildAIContext, _safeAgg,
generateReport, generateSystemwideReport, _legacySystemwideReport,
computeSystemwideCategoryData, generateExplorationDashboard, getTopLocation,
truncateRoute, generateCategoryTopLocations, generateEnhancedFindings,
generateEnhancedRecommendations` (~L68281–~L69383). ≤500? if >500, cut at
`generateExplorationDashboard` boundary → `-core` + `-core2`.

**(b) `reports/reports-standard-types.js`** — per-type generators +
helpers: `generateCorridorReport … generatePedBikeLocationTable`
(~L69384–~L70249). If >500, cut at `generateSafetyFocusReport` boundary →
`-types` + `-types2`.

Per file: §0 re-derive exact `[start,end]` by brace read; target must not
exist; off-limits cross-check.

## §2 Skeleton (per file)
```js
/**
 * CL reports.standard<X> — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Depends: core/epdo-presets, analysis/crash-profile
 * (via window/CL mirrors).
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste segment>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.standard<X>=CL.reports.standard<X>||{};
  // window.<fn>=<fn>; CL.reports.standard<X>.<fn>=<fn>;
  CL._registerModule('reports/reports-standard-<x>');
})();
```

## §3 Script tags
LATE cluster, after `modules/app/tab-dispatcher.js` (or the last reports
tag), in order: core then types.

## §4 Remove originals
Per module delete its confirmed segment; head/tail-verify.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment; `grep -cE function` drop = moved count;
`node --check` ok; one script tag; `git diff --stat` = index.html + module.
Console: `[CL] Module loaded: reports/reports-standard-<x>`.

## §6 Smoke test
Deployed app → Reports tab → generate a Systemwide report and a Corridor
report; verify output renders, TOC + exec summary present, no new console
errors; `typeof window.generateReport==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/reports-standard-<x>.js`

## §8 Out of scope
Renames/reformatting; PDF/charts/BA bands; off-limits modules; CLAUDE.md
edits; PR unless asked.
