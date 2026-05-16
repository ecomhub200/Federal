# CC Modular Prompt 42b — Reports Standard band (PARENT INDEX, not directly runnable)

**Supersedes the standard-reports slice of the old (BLOCKED) prompt 42.**
(Prompt 43 = custom reports — untouched. Before/After = prompt 42c.
Countermeasures/memo = prompt 42d.)

The standard report feature is the contiguous band `app/index.html`
~L68281–L70781 (~2,500 LOC, name-anchored — re-derive in each child §0),
bounded above by `initAnalysisSearch()` (~L68253). Exceeds the 500-line cap
→ split into the runnable children below (full manifest:
`NAVIGATETO_SPLIT_PLAN.md` §3; risks §5). One per session, in order:

| Order | Child | Module(s) | Band | Notes |
|---|---|---|---|---|
| 1 | `42b1-reports-standard-core.md` | `reports/reports-standard-core.js`, `reports/reports-standard-types.js` | ~L68281–L70249 | §0 cuts at fn boundary: core = `showReportSubTab,updateReportOptions,buildAIContext,_safeAgg,generateReport` dispatcher + `generateSystemwideReport`; types = `generateCorridorReport/SafetyReport/PedBikeReport/TrendReport/SafetyFocusReport` + exec-summary/TOC/stats helpers |
| 2 | `42b2-reports-pdf.md` | `reports/reports-pdf.js` | ~L70250–L70715 | period/findings helpers + `printReport,downloadReportPDF,generateStandardReportPDF,copyReportText` |
| 3 | `42b3-reports-charts.md` | `reports/reports-charts.js` | ~L70716–L70781 | `createReportCharts,createSafetyCharts,createPedBikeCharts,createTrendCharts` |

Each child follows the standard §0–§8 template (name-anchored locate,
INDEX_MAP/off-limits cross-check, IIFE + dual `window.`+`CL.` exposure +
`CL._registerModule`, LATE script tag after the prior reports module,
verbatim delete, post-flight counts, Playwright smoke on the deployed app,
rollback). If a child band still exceeds 500 LOC, §0 STOPs and cuts at the
nearest `function` boundary into the named sub-files. Do not combine.
