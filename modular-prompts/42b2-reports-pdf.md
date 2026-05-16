# CC Modular Extraction Prompt 42b2 — `app/modules/reports/reports-pdf.js`

**Severity:** Refactor (no behavior change). **One file per session.**
**Run AFTER 42b1.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4c, `NAVIGATETO_SPLIT_PLAN.md`
§3.

## §0 Pre-flight (band ~L70250–L70715)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (resolveReportPeriod|generateFindings|generateSafetyFocusReport|generateSafetyFocusRecommendations|generateYearlySection|generateTopLocationsTable|generateNodeTable|generateRecommendations|generateSafetyRecommendations|generatePedBikeRecommendations|generatePedBikeYearlySection|generatePedBikeLocationTable|printReport|downloadReportPDF|generateStandardReportPDF|copyReportText)\b" app/index.html
```
Re-derive `[BLK_START,BLK_END]` by brace read (the PDF/print/copy cluster +
its immediate report-data helpers; previous module 42b1 ends just above —
do not overlap; next is the charts cluster `createReportCharts` → 42b3).
Target must not exist; off-limits cross-check (none expected). If brace
count >500, cut at the nearest `function` boundary → `-pdf` + `-pdf2`.

## §1 What to move
The confirmed contiguous block: report period/findings helpers +
`printReport, downloadReportPDF, generateStandardReportPDF, copyReportText`,
verbatim.

## §2 Module — `app/modules/reports/reports-pdf.js`
```js
/**
 * CL reports.pdf — extracted (name-anchored, snapshot ~L70250-L70715).
 * navigateTo-split round, prompt 42b2. Depends: reports/reports-standard-core
 * (via window/CL mirrors), jsPDF/html2canvas globals.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste block>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.pdf=CL.reports.pdf||{};
  // window.<fn>=<fn>; CL.reports.pdf.<fn>=<fn>;
  CL._registerModule('reports/reports-pdf');
})();
```

## §3 Script tag
After `<script src="modules/reports/reports-standard-types.js"></script>`
(LATE):
```html
<script src="modules/reports/reports-pdf.js"></script>
```

## §4 Remove original
Delete `[BLK_START,BLK_END]`; head/tail-verify.

## §5 Post-flight
`wc -l` drop ≈ block; `grep -cE function` drop = moved count;
`node --check app/modules/reports/reports-pdf.js`; one script tag;
`git diff --stat` clean. Console: `[CL] Module loaded: reports/reports-pdf`.

## §6 Smoke test
Deployed app → generate a report, then Download PDF / Print / Copy; verify
the PDF builds and copy works, no new console errors;
`typeof window.downloadReportPDF==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/reports-pdf.js`

## §8 Out of scope
Renames/reformatting; other reports bands; off-limits modules; CLAUDE.md
edits; PR unless asked.
