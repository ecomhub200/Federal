# CC Modular Extraction Prompt 42c2 — Before/After email + monitoring

**Severity:** Refactor (no behavior change). **Two modules; one session each.**
**Run LAST in the 42c chain (after 42c1 + 42c3).**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4d.

## §0 Pre-flight (band ~L78868–L79908)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE "^function (openBAEmailSchedule|generateBAPDFForEmail|updateBADeliveryModeUI|updateBAFrequencyUI|calculateBANextDelivery|initBAMonitoringPanel|toggleBAMonitoringEnabled|updateBAMonitoringLocationDisplay|updateBAAlertRowStyle|toggleBAMonitorScheduleUI|updateBAMonitorFreqUI|saveBAMonitoringSettings|evaluateBAAlertConditions|buildBAAlertEmailHtml|renderBAMonitoringStatus|checkBAMonitoringOnDataLoad|addBAMonitorSubscriber|removeBAMonitorSubscriber|refreshBAMonitorSubscriberChips)\b" app/index.html
# Preceding: copyBAReport (42c3). Next decl after the band: saveSession()
# (~L80038) — stop before it. Cross-check none map to off-limits batch-ba/*.
```

## §1 Two modules
**(a) `reports/report-ba-email.js`** — ~L78868–L79294:
`openBAEmailSchedule, generateBAPDFForEmail, updateBADeliveryModeUI,
updateBAFrequencyUI, calculateBANextDelivery`. ≤500? if >500 cut at
`generateBAPDFForEmail` boundary.

**(b) `reports/report-ba-monitor.js`** — ~L79295–L79908:
`initBAMonitoringPanel … refreshBAMonitorSubscriberChips` (panel, alert
evaluation, alert-email HTML, subscriber chips). If >500, cut at
`evaluateBAAlertConditions` boundary → `-monitor` + `-monitor2`. Move the
`checkBAMonitoringOnDataLoad` hook with this module (do not duplicate any
data-load listener).

Per file: §0 re-derive exact `[start,end]`; target must not exist;
off-limits cross-check.

## §2 Skeleton (per file)
```js
/**
 * CL reports.ba<X> — extracted (name-anchored). navigateTo-split round,
 * prompt 42c2. Depends: reports/report-ba-export (via window/CL mirrors),
 * server email endpoint. NOT off-limits batch-ba/*.
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
LATE cluster, after `report-ba-export.js`, in order: `report-ba-email.js`
then `report-ba-monitor.js`.

## §4 Remove originals
Per module delete its confirmed segment; head/tail-verify.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment; `grep -cE function` drop = moved count;
`node --check` ok; one script tag; `git diff --stat` clean. Console:
`[CL] Module loaded: reports/report-ba-<x>`. This is the last 42c module —
confirm the band is fully gone (`saveSession()` now immediately follows the
prior decl).

## §6 Smoke test
Deployed app → Before/After → open email schedule, enable monitoring, add a
subscriber, save settings; verify UI updates + no new console errors;
`typeof window.initBAMonitoringPanel==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/reports/report-ba-<x>.js`

## §8 Out of scope
Off-limits `batch-ba/*`; renames/reformatting; CLAUDE.md edits; PR unless
asked.
