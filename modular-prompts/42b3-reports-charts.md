# CC Modular Extraction Prompt 42b3 — `app/modules/reports/reports-charts.js`

**Severity:** Refactor (no behavior change). **One file per session.**
**Run AFTER 42b2.** Smallest reports module (~66 LOC).

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4c.

## §0 Pre-flight (band ~L70716–L70781)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (createReportCharts|createSafetyCharts|createPedBikeCharts|createTrendCharts)\b" app/index.html
# Block = the 4 chart builders, contiguous. Next decl after the block
# belongs to the countermeasures band (prompt 42d) — stop before it.
test -f app/modules/reports/reports-charts.js && echo "ABORT: exists" || echo OK
```
Off-limits cross-check (none expected — Chart.js builders).

## §1 What to move
The contiguous block: `createReportCharts, createSafetyCharts,
createPedBikeCharts, createTrendCharts`, verbatim.

## §2 Module — `app/modules/reports/reports-charts.js`
```js
/**
 * CL reports.charts — extracted (name-anchored, snapshot ~L70716-L70781).
 * navigateTo-split round, prompt 42b3. Depends: Chart.js global,
 * reports/reports-standard-core (via window/CL mirrors).
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste block>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.charts=CL.reports.charts||{};
  // window.<fn>=<fn>; CL.reports.charts.<fn>=<fn>;  (4 fns)
  CL._registerModule('reports/reports-charts');
})();
```

## §3 Script tag
After `<script src="modules/reports/reports-pdf.js"></script>` (LATE):
```html
<script src="modules/reports/reports-charts.js"></script>
```

## §4 Remove original
Delete the confirmed block; head/tail-verify.

## §5 Post-flight
`wc -l` drop ≈ block; `grep -cE function` −4; `node --check`; one script
tag; `git diff --stat` clean. Console:
`[CL] Module loaded: reports/reports-charts`.

## §6 Smoke test
Deployed app → generate a report containing charts (Safety / Ped-Bike /
Trend); verify charts render, no new console errors;
`typeof window.createReportCharts==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/reports-charts.js`

## §8 Out of scope
Renames/reformatting; other bands; off-limits modules; CLAUDE.md edits; PR
unless asked.
