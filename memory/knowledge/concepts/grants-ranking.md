---
title: "Grants Ranking Tab"
aliases: [grants, hsip-ranking, location-ranking]
tags: [tab, ranking, hsip, grants]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Grants Ranking Tab

The Grants tab surfaces the highest-value HSIP-style candidate locations
across the loaded dataset, ranked by severity-weighted crash experience
so that engineers can prioritize which intersections/corridors to include
in a safety grant application. The ranking pipeline lives under
`CL.grants` in `app/modules/grants/ranking.js`.

## Key Points

- **Data source:** `grantState.allRankedLocations[]` — produced once the
  primary dataset is loaded; not rebuilt on every filter change.
- **Ranking metric:** EPDO per location (see [[concepts/epdo-weights]]),
  optionally with a date filter that scopes the underlying crashes
  *before* ranking.
- **Location granularity:** intersection (node) and corridor (route
  segment) rows are produced separately so grant workflows targeting
  different program types can pull the right list.
- **Output is an array of candidate rows**, each carrying severity
  counts, EPDO, date range, and enough metadata for the Grants UI to
  render the table, export, and jump back to the Map tab via
  `selectionState`.

## Details

### State shape

```javascript
grantState = {
  allRankedLocations: [
    {
      key: "Route 29 / Node 12345",
      route: "Route 29",
      node: "12345",
      kind: "intersection" | "corridor",
      severity: { K, A, B, C, O },
      epdo: 12345,
      crashCount: 87,
      dateRange: { from: "2022-01-01", to: "2024-12-31" },
      // ... display metadata
    },
    // ...
  ],
  loaded: true,
};
```

### Optional date filter

Grants is the one ranking tab where a date filter is **optional** and
pre-rank: if a date range is applied, the pipeline filters
`crashState.sampleRows` before aggregating by location. This differs
from CMF/Warrants, where the date filter is applied post-selection.

### Cross-tab jumps

Clicking a row should:

1. Populate `selectionState.location` with the row's key + metadata.
2. Populate `selectionState.crashes` with the location's filtered crash
   list.
3. Compute `selectionState.crashProfile` via
   `buildLocationCrashProfile(crashes)`.
4. Call `updateAIContextIndicator()` so the AI tab notices the scope
   change (see [[concepts/ai-context-awareness]]).

This is the cross-tab channel described in
[[connections/state-scope-and-ai-context]].

### Performance notes

- Ranking all locations over a multi-year dataset is an O(n) pass over
  `crashState.sampleRows`; do it once at load, not on every re-render.
- If the UI needs a re-rank (e.g. user changed the date filter), rebuild
  the whole `grantState.allRankedLocations` — do not attempt incremental
  updates; the sort order can shift under any filter change.

## Common Pitfalls

- **Mixing aggregate scope**: using `crashState.aggregates.byRoute` as
  the ranking source skips intersection-level granularity and breaks
  grants for intersection-focused HSIP programs.
- **Ranking after tab-specific filters**: Grants must rank against the
  raw (optionally date-filtered) rows, not against another tab's
  `filteredCrashes`.
- **Forgetting `updateAIContextIndicator()`** on row click — AI will
  answer the wrong scope.

## Related Concepts

- [[concepts/state-management]] — where `grantState` lives
- [[concepts/epdo-weights]] — ranking metric
- [[concepts/ai-context-awareness]] — cross-tab jump contract
- [[concepts/module-architecture]] — `CL.grants` in
  `app/modules/grants/ranking.js`
- [[concepts/crash-profile-shapes]] — `buildLocationCrashProfile()` is
  the one used for grant row selections
- [[concepts/hotspots]] — neighboring ranking tab at a different
  granularity (route aggregate vs intersection-level)
- [[concepts/map-tab]] — alternative visual entry point to the same
  location set
- [[concepts/date-filters]] — pre-rank date filter semantics
- [[concepts/cmf-tab]] — common next step after picking a grant row
- [[concepts/proven-safety-countermeasures]] — grant narratives cite
  PSC-designated countermeasures
- [[connections/state-scope-and-ai-context]] — the cross-tab handoff
  contract used when a grant row is clicked
- [[connections/epdo-across-tabs]] — EPDO parity with Hotspots / CMF /
  Batch B/A

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources" + verified against
  `app/modules/grants/ranking.js`
