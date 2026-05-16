# CC Modular Prompt 42c — Reports Before/After band (PARENT INDEX, not directly runnable)

**Supersedes the Before/After slice of the old (BLOCKED) prompt 42.**

The Before/After study + monitoring feature is the contiguous band
`app/index.html` ~L77331–L79908 (~2,578 LOC, name-anchored — re-derive in
each child §0). It sits inside the larger countermeasures→BA region
(~L75038–L79908) bounded below by `saveSession()` (~L80038); the
countermeasures/memo portion (~L75038–L77330) is **prompt 42d**. Exceeds the
500-line cap → split into the runnable children below (full manifest:
`NAVIGATETO_SPLIT_PLAN.md` §3). One per session, in order:

| Order | Child | Module(s) | Band | Notes |
|---|---|---|---|---|
| 1 | `42c1-report-ba-engine.md` | `reports/report-ba-setup.js`, `reports/report-ba-run.js` | ~L77331–L78422 | §0 cuts at fn boundary: setup = mode/location/period (`switchBAMode`…`resetBAStudy`); run = `runBeforeAfterAnalysis`,`filterCrashesByPeriod`,`normalCDF`,`displayBA*`,`displayBAConclusions` |
| 2 | `42c3-report-ba-export.md` | `reports/report-ba-export.js` | ~L78423–L78867 | `printBAReport,downloadBAPDF,exportBAData,copyBAReport` |
| 3 | `42c2-report-ba-monitoring.md` | `reports/report-ba-email.js`, `reports/report-ba-monitor.js` | ~L78868–L79908 | §0 cuts at fn boundary: email = `openBAEmailSchedule,generateBAPDFForEmail,updateBA*UI,calculateBANextDelivery`; monitor = `initBAMonitoringPanel`…`refreshBAMonitorSubscriberChips` |

Run 42c1 → 42c3 → 42c2 (export before monitoring keeps email/monitor, which
calls export helpers, loading after their dependency). Each child follows
the standard §0–§8 template (name-anchored locate, INDEX_MAP/off-limits
cross-check, IIFE + dual `window.`+`CL.` exposure + `CL._registerModule`,
LATE script tag after the prior reports module, verbatim delete, post-flight
counts, Playwright smoke on the deployed app, rollback). If a child band
still exceeds 500 LOC, §0 STOPs and cuts at the nearest `function` boundary
into the named sub-files. Do not combine children.
