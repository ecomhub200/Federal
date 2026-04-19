---
title: "Dashboard and Analysis Tabs"
aliases: [dashboard, analysis, summary, aggregates-view]
tags: [tab, dashboard, analysis, aggregates]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Dashboard and Analysis Tabs

The Dashboard and Analysis tabs are the **county-wide summary views**
of the currently-loaded dataset. Both read from
`crashState.aggregates` — not `sampleRows` — so they render fast and
stay decoupled from the per-tab filter state used by CMF/Warrants.

## Key Points

- **Data source:** `crashState.aggregates` only. No filters applied
  in these tabs (the filters live on CMF/Warrants/Grants/etc.).
- **Dashboard** is the landing view: headline totals, severity
  breakdown, top hotspots at a glance, recent-crash trend chart.
- **Analysis** is a deeper county-wide report: multi-year trends,
  collision-type distributions, weather/light breakdowns, ped/bike
  totals.
- **No cross-tab selection writes** — these tabs are "read-only" from
  the perspective of `selectionState`.

## Details

### What `crashState.aggregates` contains

```javascript
crashState.aggregates = {
  total: Number,
  severity: { K, A, B, C, O },
  epdo: Number,
  byYear: { "2022": {...}, "2023": {...}, "2024": {...} },
  byRoute: { "Route 29": { total, severity, epdo, byNode: {...} }, ... },
  byCollisionType: [{ label, count }, ...],
  byWeather: [{ label, count }, ...],
  byLight: [{ label, count }, ...],
  pedCount: Number,
  bikeCount: Number,
  dateRange: { from, to },
  // ... other pre-computed rollups
};
```

Built once when a dataset loads; invalidated only when the dataset
itself changes (new upload, reload, state switch).

### Dashboard's role

- **Immediate orientation**: first thing a user sees after a dataset
  loads; must be correct even before anything else is clicked.
- **Glanceable widgets**: headline total, severity chart, EPDO,
  top-5 hotspot corridors, yearly trend.
- **No filters** — if a user wants filtered views, they open CMF or
  Map. Keeping Dashboard filter-free keeps the "big picture" mental
  model clean.

### Analysis's role

- Deeper county-wide exploration that doesn't fit on Dashboard:
  collision-type distributions, weather/lighting splits, ped/bike
  totals, severity-by-year trendlines.
- Still filter-free. The pattern is "if you want to drill in, click
  through to a scoped tab"; Analysis is the last stop in the county-
  wide view.

### Performance expectations

Both tabs must render quickly (under ~200 ms on reasonable hardware)
since they're the first thing the user sees. That performance depends
entirely on `aggregates` being pre-computed — any drift into per-
crash iteration in these tabs is a bug.

### AI priority

County-wide is the **fallback** in the resolver (slot #4). If the
user is on Dashboard or Analysis and asks the AI a question, no
location has been selected anywhere, so the resolver's fallback
produces a county-wide `crashProfile` from `aggregates`. See
[[concepts/ai-context-awareness]].

## Common Pitfalls

- **Iterating `sampleRows`** inside Dashboard/Analysis renders —
  slow, and redundant with what the aggregate already stores.
- **Adding a per-tab filter** — either use CMF/Map/etc. for filtered
  views, or add a new tab; don't erode Dashboard's unfiltered
  contract.
- **Relying on `aggregates.byRoute` to include every route** — some
  crashes may have null/unknown routes and land in a sentinel bucket
  (e.g. `"(unknown)"`). Display code must handle that bucket.
- **Forgetting to rebuild aggregates** after an upload — Dashboard/
  Analysis show stale data.

## Related Concepts

- [[concepts/state-management]] — `aggregates` lives on `crashState`
- [[concepts/epdo-weights]] — headline EPDO metric
- [[concepts/hotspots]] — consumes `aggregates.byRoute`; Dashboard
  shows a summarized version
- [[concepts/ai-context-awareness]] — county-wide is the resolver's
  fallback
- [[concepts/upload-pipeline]] — triggers aggregate rebuild
- [[concepts/crash-profile-shapes]] — `buildCountyWideCrashProfile()`
  is the right helper here
- [[concepts/module-architecture]] — Dashboard + Analysis code
  belongs under their own `CL.*` modules
- [[connections/epdo-across-tabs]] — headline EPDO must match every
  other tab's EPDO for the same scope

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources" (Dashboard + Analysis rows)
