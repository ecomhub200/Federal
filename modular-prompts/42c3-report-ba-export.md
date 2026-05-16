# CC Modular Extraction Prompt 42c3 — `app/modules/reports/report-ba-export.js`

**Severity:** Refactor (no behavior change). **One file per session.**
**Run AFTER 42c1, BEFORE 42c2.** (~445 LOC.)

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4d.

## §0 Pre-flight (band ~L78423–L78867)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (printBAReport|downloadBAPDF|exportBAData|copyBAReport)\b" app/index.html
# Block = these 4 contiguous fns. Preceding: displayBAConclusions (42c1).
# Next: openBAEmailSchedule (42c2). Confirm braces; off-limits cross-check
# (none — batch-ba/* is separate).
test -f app/modules/reports/report-ba-export.js && echo "ABORT: exists" || echo OK
```
If brace count >500, cut at `downloadBAPDF` boundary → `-export` +
`-export2`.

## §1 What to move
The contiguous block: `printBAReport, downloadBAPDF, exportBAData,
copyBAReport`, verbatim.

## §2 Module — `app/modules/reports/report-ba-export.js`
```js
/**
 * CL reports.baExport — extracted (name-anchored, snapshot ~L78423-L78867).
 * navigateTo-split round, prompt 42c3. Depends: reports/report-ba-run (via
 * window/CL mirrors), jsPDF/html2canvas globals.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste block>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.reports=CL.reports||{};
  CL.reports.baExport=CL.reports.baExport||{};
  // window.<fn>=<fn>; CL.reports.baExport.<fn>=<fn>;  (4 fns)
  CL._registerModule('reports/report-ba-export');
})();
```

## §3 Script tag
After `<script src="modules/reports/report-ba-run.js"></script>` (LATE):
```html
<script src="modules/reports/report-ba-export.js"></script>
```

## §4 Remove original
Delete the confirmed block; head/tail-verify.

## §5 Post-flight
`wc -l` drop ≈ block; `grep -cE function` −4; `node --check`; one script
tag; `git diff --stat` clean. Console:
`[CL] Module loaded: reports/report-ba-export`.

## §6 Smoke test
Deployed app → run a Before/After study, then Print / Download PDF / Export
data / Copy; verify each produces output, no new console errors;
`typeof window.downloadBAPDF==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/report-ba-export.js`

## §8 Out of scope
Off-limits `batch-ba/*`; renames/reformatting; BA engine/monitoring;
CLAUDE.md edits; PR unless asked.
