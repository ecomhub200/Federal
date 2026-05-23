---
title: "Dashboard tier KPI regression — all tier buttons show identical state-wide value"
aliases: [cc-011, dashboard-tier-bug, tier-kpi-bug, dashboard-tier-kpi-v2]
tags: [dashboard, bug, matview, tier, supabase]
sources:
  - "daily/2026-05-22.md"
created: 2026-05-22
updated: 2026-05-22
---

# Dashboard tier KPI regression — all tier buttons show identical state-wide value

## Core Fact

All 7 Dashboard tier buttons (Federal / State / Region / MPO / Planning District / County / City) displayed the same KPI value — 569,829 Delaware-wide crashes — regardless of which tier was selected. The fetch behind `injectFastDashboard` ignored the tier parameter and always returned the state-wide aggregate from the matview.

## Key Points

- The regression affects the Dashboard tab's summary KPI tiles; Map tab's tier switching works correctly and serves as the reference pattern for the fix.
- Root cause traced to `dashboard/dashboard-tab-matview.js` and the underlying `getSummary` / matview query builder — the tier dimension was not passed, so every request returned the unfiltered state total.
- Fix strategy: subscribe the Dashboard KPI fetcher to the same tier-change event consumed by the Map tab, and thread `tier` + `value` through the matview query at every call site.
- Federal tier requires special treatment: the `state=eq.<state>` filter must be omitted so Federal aggregates across all states in the matview, not just the selected state.
- Verification requires a full tier sweep — Federal → State → Region → County → City — with screenshots confirming descending counts at each level.
- Branch: `claude/fix-dashboard-tier-kpi-v2`; push to origin, no PR required.

## Details

### Why only the Dashboard was affected

The Map tab's tier switching was patched in earlier rounds to use an event-driven pattern: a `tierChanged` event is dispatched when the user clicks a tier button, and the Map tab's data loader listens to that event and re-fetches with the new `(tier, value)` pair. The Dashboard KPI loader — living in `dashboard/dashboard-tab-matview.js` and `dashboard/dashboard-tab-kpi.js` — was not wired to that same event. Instead it called `injectFastDashboard()` with a hard-coded or context-ignoring scope, always resolving to the state-wide matview row.

### Federal tier edge case

Most tier fixes are straightforward: pass `{ tier: 'region', value: 'North District' }` to the matview query and PostgREST filters by `dot_district=eq.North+District`. Federal is different — at federal scope there is no single state to filter on. The query must omit `state=eq.X` entirely and aggregate across all rows in `mv_dashboard_summary`. This means the Federal tier KPI fetch is structurally different from the other six and must be handled as a special case in the matview builder.

### CC-011 history

This fix was originally planned as CC-011 but never executed because the prompt was too vague — CC did not attempt it and left no branch on origin. The re-run (Session 2026-05-22 01:16) used a more prescriptive prompt with explicit code locations, the Map tab reference pattern, ABORT conditions, and a mandatory tier-sweep verification step. See [[concepts/index-map-stale-line-ranges]] for the related pitfall of stale line-number anchors in CC prompts.

## Related Concepts

- [[concepts/aggregate-tier-samplerows-empty]] — At aggregate tiers `sampleRows` is empty; Dashboard KPIs are entirely matview-backed, making the tier parameter doubly important
- [[concepts/index-map-stale-line-ranges]] — CC-011's original failure was partly caused by stale INDEX_MAP line ranges that led the prompt astray; re-derived anchors by function name for the v2 attempt
- [[connections/upload-tier-change-cascade]] — Parallel tier-change wiring problem in the Upload tab; same pattern of tier events not being propagated to all listeners

## Sources

- [[daily/2026-05-22.md]] — CC-011 root-cause description; 569,829 identical-value symptom; Map tab as reference pattern; Federal tier omit-state-filter requirement; branch `claude/fix-dashboard-tier-kpi-v2`; tier-sweep verification requirement
