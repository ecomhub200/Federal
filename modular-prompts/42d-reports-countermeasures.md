# CC Modular Extraction Prompt 42d — Reports Countermeasures + memo

**Severity:** Refactor (no behavior change). **Band yields multiple modules;
one session each.** **Supersedes the countermeasures/memo slice of old prompt 42.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4d, `NAVIGATETO_SPLIT_PLAN.md`
§3.

## §0 Pre-flight (band ~L75038–L77330)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (generateCountermeasuresReport|generateIntersectionReport|generateHotspotReport|generateDashboardReport|generateCrashTreeSystemicReport|generateHotspotRankingReport|generateBeforeAfterStudyReport|generateGrantSupportReport|buildMemoHeader|buildMemoStatsTable|buildMemoFindings|buildMemoLocationsTable|buildMemoFooter|createWordDocumentWithHeaderFooter|buildCollisionTypeBreakdown|buildSevereCrashPatterns|generateMemoRecommendations|generateSafetyMemoRecommendations|generateVRURecommendations|generateTrendAnalysis)\b" app/index.html
# Preceding decl: the standard-report charts cluster (42b3 — ensure run
# first so the boundary is clean). Next: switchBAMode() (42c). NOTE
# generateBeforeAfterStudyReport (~L75965) is the BA *report* generator and
# belongs HERE (countermeasures/memo family), distinct from the BA *engine*
# in 42c. Off-limits cross-check (none — distinct from batch-ba/*).
```

## §1 Modules (cut at fn boundaries so each ≤500; one session each)
**(a) `reports/reports-countermeasures.js`** — ~L75038–L76274:
`generateCountermeasuresReport, generateIntersectionReport,
generateHotspotReport, generateDashboardReport,
generateCrashTreeSystemicReport, generateHotspotRankingReport,
generateBeforeAfterStudyReport, generateGrantSupportReport`. If brace count
>500, cut at `generateCrashTreeSystemicReport` boundary → `-cm` + `-cm2`.

**(b) `reports/reports-memo.js`** — ~L76275–L77058:
`buildMemoHeader, buildMemoStatsTable, buildMemoFindings,
buildMemoLocationsTable, buildMemoFooter, createWordDocumentWithHeaderFooter`.
If >500, cut at `createWordDocumentWithHeaderFooter` boundary.

**(c) `reports/reports-recommend.js`** — ~L77059–L77330:
`buildCollisionTypeBreakdown, buildSevereCrashPatterns,
generateMemoRecommendations, generateSafetyMemoRecommendations,
generateVRURecommendations, generateTrendAnalysis`. ≤500 ✓.

Per file: §0 re-derive exact `[start,end]` by brace read; target must not
exist; off-limits cross-check.

## §2 Skeleton (per file)
```js
/**
 * CL reports.<X> — extracted (name-anchored). navigateTo-split round,
 * prompt 42d. Depends: reports/reports-standard-core, analysis/crash-profile
 * (via window/CL mirrors), docx global.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste segment>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.<X>=CL.reports.<X>||{};
  // window.<fn>=<fn>; CL.reports.<X>.<fn>=<fn>;
  CL._registerModule('reports/reports-<x>');
})();
```

## §3 Script tags
LATE cluster, after `modules/reports/reports-charts.js`, in order:
`reports-countermeasures.js`, `reports-memo.js`, `reports-recommend.js`.

## §4 Remove originals
Per module delete its confirmed segment; head/tail-verify.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment; `grep -cE function` drop = moved count;
`node --check` ok; one script tag; `git diff --stat` clean. Console:
`[CL] Module loaded: reports/reports-<x>`.

## §6 Smoke test
Deployed app → generate a Countermeasures report and a Word/memo export;
verify the document builds + recommendations populate, no new console
errors; `typeof window.generateCountermeasuresReport==='function'`.
`playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/reports-<x>.js`

## §8 Out of scope
BA engine/export/monitoring (42c); off-limits `batch-ba/*`;
renames/reformatting; CLAUDE.md edits; PR unless asked.
