---
title: "Map Tab"
aliases: [map, map-view, crash-map]
tags: [tab, map, mapbox, filters]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Map Tab

The Map tab plots crashes geographically for visual pattern-finding
and as a launch pad into every location-scoped tool (CMF, Warrants,
Grants, Batch B/A). It reads `crashState.sampleRows` directly (not
aggregates) and applies **Year / Route / Severity** filters before
rendering.

## Key Points

- **Data source:** `crashState.sampleRows` — per-crash rendering,
  unlike Dashboard/Analysis which use aggregates.
- **Filters applied:** Year (multi-select), Route (multi-select or
  contains), Severity (KABCO). No date-range filter; Year is the
  temporal filter here.
- **Tile provider:** Mapbox (client key in `config/api-keys.json`;
  see [[concepts/coolify-deployment]]).
- **Click on point/cluster** launches the cross-tab handoff: writes
  `selectionState`, computes a detailed profile, calls
  `updateAIContextIndicator()`.
- **Performance**: for large datasets, clustering + viewport-based
  filtering keeps DOM count low; full per-crash detail loads lazily
  when a cluster is expanded.

## Details

### Filters

```javascript
// Applied in order; each narrows the row set.
const rows = crashState.sampleRows
  .filter(r => years.size   === 0 || years.has(r[COL.YEAR]))
  .filter(r => routes.size  === 0 || routes.has(r[COL.ROUTE]))
  .filter(r => severities.size === 0 || severities.has(r[COL.SEVERITY]));
```

Year uses a set of 4-digit year values derived from `COL.DATE`. Route
uses exact matches on the normalized `COL.ROUTE` string. Severity is
KABCO letters.

### Cluster click → jump contract

Clicking a single marker or a collapsed cluster should:

1. Resolve the set of crash rows the marker represents (one row, or
   the cluster's member rows).
2. Infer a location key (route + node if dominant; corridor if
   mixed).
3. Call `buildDetailedLocationProfile(rows)` for the richer
   selection UI, or `buildLocationCrashProfile(rows)` if the user's
   next tab only needs the minimum shape. See
   [[concepts/crash-profile-shapes]].
4. Write `selectionState = { location, crashes: rows, crashProfile,
   fromTab: "map" }`.
5. Call `updateAIContextIndicator()`.

### Coordinate quality

Some states' raw data includes crashes with missing/invalid
lat/lon. The normalizer (see [[concepts/state-onboarding]]) should
leave these as null rather than filling with zeroes; the Map tab
filters out null-coord crashes before rendering and exposes a
counter so users know how many are off-map.

### Relationship to Hotspots

Hotspots and Map both support "find hotspots visually," but:

- **Map** shows every crash point, with filters.
- **Hotspots** is a ranked table built from the aggregate.

Users typically alternate between them — Map for spatial pattern,
Hotspots for severity-weighted totals. See [[concepts/hotspots]].

## Common Pitfalls

- **Using aggregates** on the Map tab — loses per-crash granularity
  and breaks selection handoff.
- **Hardcoding year ranges** — filters should derive from the data
  set's actual `COL.YEAR` distribution.
- **Forgetting to clear `selectionState`** when the user resets the
  filters — leaves a stale selection in the AI resolver.
- **Emitting cluster handoffs without `fromTab: "map"`** — other tabs
  can't tell where a selection originated and may refuse to pick it
  up (e.g. Warrants declining corridor-level selections).

## Related Concepts

- [[concepts/state-management]] — reads `sampleRows`, writes
  `selectionState`
- [[concepts/dot-neutral-naming]] — `COL.ROUTE` is the normalized
  route column
- [[concepts/crash-profile-shapes]] — pick the right `build*` helper
  for the handoff
- [[concepts/ai-context-awareness]] — Map writes `selectionState`,
  priority slot #2
- [[concepts/hotspots]], [[concepts/grants-ranking]],
  [[concepts/cmf-tab]] — common destinations after a Map click
- [[concepts/state-onboarding]] — normalizer leaves null-coord
  crashes as null
- [[concepts/module-architecture]] — Map tab code belongs under
  `CL.map` (or similar)
- [[concepts/coolify-deployment]] — Mapbox key injection path
- [[connections/state-scope-and-ai-context]] — the click→jump→
  indicator contract

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md "Tab-Specific Data Sources" (Map row)
