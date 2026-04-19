---
title: "Hotspots Tab"
aliases: [hotspots, by-route, route-ranking]
tags: [tab, ranking, hotspots]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Hotspots Tab

The Hotspots tab surfaces the routes (and commonly the intersections
along them) with the highest severity-weighted crash burden, giving
engineers a quick way to zero in on trouble corridors before opening
the deeper CMF/Warrants/Grants flows.

## Key Points

- **Data source:** `crashState.aggregates.byRoute` — the pre-computed
  per-route rollup; no per-crash iteration at render time.
- **No date filter** is currently applied in this tab (CLAUDE.md's Tab-
  Specific Data Sources table marks it "None"). A date filter could be
  added, but would require a new aggregate or a full `sampleRows` pass.
- **Ranking metric:** EPDO per route; severity breakdown shown for
  context (K/A/B/C/O).
- **Cross-tab handoff:** clicking a route should write to
  `selectionState` and call `updateAIContextIndicator()` exactly like
  the Map tab — see [[connections/state-scope-and-ai-context]].
- **Performance:** the tab is essentially a sort/render pass over a
  pre-built object, so it stays snappy even on large datasets.

## Details

### Aggregate shape

```javascript
crashState.aggregates.byRoute = {
  "Route 29": {
    total: 431,
    severity: { K: 2, A: 9, B: 37, C: 88, O: 295 },
    epdo: 5923,
    byNode: {
      "12345": { total: 67, severity: {...}, epdo: ... },
      // ...
    },
  },
  // ...
};
```

The aggregate is built once when `crashState.sampleRows` is loaded,
then cached. Any feature that invalidates the underlying rows (uploading
new data, re-running the pipeline) must clear the aggregate so it gets
rebuilt.

### Relationship to Grants

Hotspots ranks **by route** using the pre-built aggregate; Grants ranks
intersections and corridors using a fresh pass over `sampleRows`
(optionally date-filtered). Both end up in the same mental space
("ranked candidates") but serve different moments:

- Hotspots = quick visual, always-on, no filter.
- Grants   = grant-application-ready, supports a date filter, more
  detailed columns.

See [[connections/epdo-across-tabs]] for how EPDO is consistent across
both (same weights, same `calcEPDO`).

### Click → jump contract

1. Row click writes `selectionState.location` with the route (+
   optionally the top intersection on that route).
2. `selectionState.crashes` is filled from
   `crashState.sampleRows.filter(r => r[COL.ROUTE] === 'Route 29')`.
3. `selectionState.crashProfile` = `buildLocationCrashProfile(crashes)`
   or `buildDetailedLocationProfile(crashes)` depending on what the
   downstream tab expects.
4. `updateAIContextIndicator()` fires on the same turn.

## Common Pitfalls

- **Iterating `sampleRows` at render time** instead of reading the
  aggregate — needless work; the aggregate is there for a reason.
- **Caching the sorted list instead of the aggregate** — if the user
  re-ranks by a different metric, the cache is invalid.
- **Forgetting to rebuild aggregates after an upload** — Hotspots
  silently shows stale data.

## Related Concepts

- [[concepts/state-management]] — aggregates live on `crashState`
- [[concepts/epdo-weights]] — ranking metric
- [[concepts/grants-ranking]] — related but distinct ranking
- [[concepts/ai-context-awareness]] — cross-tab jump contract
- [[connections/state-scope-and-ai-context]] — click→jump→AI update
  contract
- [[connections/epdo-across-tabs]] — EPDO parity across Hotspots /
  Grants / CMF / Batch B/A

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md "Tab-Specific Data Sources"
