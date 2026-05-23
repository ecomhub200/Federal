---
title: "Report generator Supabase hydration — on-demand row fetch in generateReport()"
aliases: [report-hydration, generateReport-supabase, reports-supabase-fix]
tags: [reports, supabase, data-client, architecture, round8]
sources:
  - "daily/2026-05-09.md"
created: 2026-05-09
updated: 2026-05-09
---

# Report generator Supabase hydration

## Context

Before Round 8, `generateReport()` in `app/index.html` dispatched immediately to per-type PDF generators that assumed `crashState.sampleRows` was populated. At aggregate tiers (federal/state/region/MPO/planning-district/county-rollup) `sampleRows` is always empty, so all 15 affected report types rendered with zeroes or impossible values.

## Key Points

- Added a **universal Supabase hydration block** at the top of `generateReport()` that fires before dispatching to any per-type generator.
- Fetches up to **200,000 rows** via `crashLensClient.getCrashes(tier, value, {all: true, dateFrom, dateTo, route, maxRows: 200000})`.
- The post-hydration path **skips the legacy date post-filter** (Number(date) coercion only matched epoch timestamps, not Supabase ISO date strings); server-side filtering already applied those constraints.
- Bails with a clear "no data" alert if hydration returns 0 rows, rather than silently generating a blank PDF.
- Fixes **15 of 17 report types** in one change: `dashboard`, `corridor`, `safety`, `safetyfocus`, `pedbike`, `trend`, `intersection`, `crashtree`, `fatalspeed`, `hotspot`, `prediction`, `deepdive`, `grantsupport`, `infographic`, `comprehensive`. The remaining two (`countermeasures` and `before-after`) already read from `cmfState` / `baState` which are matview-backed.

## Details

### Hydration guard condition

```javascript
if (
  crashState.sampleRows.length === 0 &&
  crashLensClient &&
  supabaseBridge && supabaseBridge.resolveTier
) {
  const rows = await crashLensClient.getCrashes(tier, value, {
    all: true, dateFrom, dateTo, route, maxRows: 200000
  });
  if (!rows || rows.length === 0) {
    alert('No crash data available for the selected filters.');
    return;
  }
  crashState.sampleRows = rows; // temporary population for generator
}
```

The guard requires both the data client and the tier-resolver to be present — if either is unavailable the function falls through to the existing (possibly zero-producing) path rather than throwing.

### Why 200,000 row cap

The cap is a practical limit for client-side heap allocation. A county-level R2 parquet for large jurisdictions (e.g., Delaware/Sussex at 86,000 rows) fits comfortably. State and federal tiers may have millions of rows; at those scales the cap means distributions are computed on a sample. Backend matview work (`mv_analysis_summary.by_hour_fatal`, `mv_factor_pairs`) would remove the cap dependency entirely — tracked as future work.

### Legacy post-filter skip

Pre-Round-8, `generateReport()` applied a date filter as:
```javascript
rows = rows.filter(r => Number(r[COL.DATE]) >= Number(dateFrom));
```
The `Number()` coercion was designed for epoch-millisecond timestamps stored in the R2 parquet. Supabase ISO date strings (`"2023-04-15"`) coerce to `NaN`, making the comparison always false and silently dropping all rows. When hydration succeeds the server already applied `dateFrom`/`dateTo` via PostgREST query parameters, so the post-filter is now skipped.

### Remaining gap

True per-severity hour/year cross-tab counts at aggregate tiers require a backend `mv_analysis_summary.by_hour_fatal` matview (and a `mv_factor_pairs` for speed×other-factor cross-tab). Round 8 hydrates these client-side from the row table capped at 200k rows — sufficient for county/state tiers, potentially insufficient at federal scale. Backend matview work is tracked separately.

## Related Concepts

- [[concepts/aggregate-tier-samplerows-empty]] — The architectural precondition: `sampleRows` is empty at every aggregate tier
- [[concepts/phase4-server-paginated-tables]] — `getCrashes()` in `CrashLensDataClient` is the same client reused for hydration; Phase 4 introduced server-side filtering that makes the hydration approach viable
- [[concepts/speed-cofactor-denominator-bug]] — `exportFSToPDF()` has its own hydration variant with an additional denominator fix
- [[concepts/intersection-pdf-export-patches]] — `exportIntersectionPDF()` uses a similar hydration approach plus three additional patches

## Sources

- [[daily/2026-05-09.md]] — Round 8 description; `generateReport()` hydration implementation; 15-of-17 scope; legacy post-filter skip rationale; 200k cap explanation
