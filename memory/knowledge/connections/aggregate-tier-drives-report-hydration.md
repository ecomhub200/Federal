---
title: "Connection: aggregate-tier sampleRows empty → on-demand Supabase hydration in report generators"
connects:
  - "concepts/aggregate-tier-samplerows-empty"
  - "concepts/report-generator-supabase-hydration"
  - "concepts/phase4-server-paginated-tables"
sources:
  - "daily/2026-05-09.md"
created: 2026-05-09
updated: 2026-05-09
---

# Connection: Aggregate-tier `sampleRows` empty → report hydration

## The Connection

The architectural decision to load only Supabase matviews at aggregate tiers (leaving `crashState.sampleRows = []`) was the right call for performance — parquet files for state/federal jurisdictions would be hundreds of megabytes. But every piece of code written when CrashLens was a single-county tool assumed `sampleRows` was always populated. The progressive matview-patching rounds (3-7 for tabs, 8 for reports) are a systematic consequence of that original architectural constraint meeting legacy row-iteration code.

## Key Insight

The **on-demand Supabase hydration** pattern introduced in Round 8 (`generateReport()` fetching up to 200k rows before dispatching) is not a hack — it is the sustainable solution for features that genuinely require row-level data (per-hour distributions, per-route cross-tabs, PDF chart generation). It reuses the same `CrashLensDataClient.getCrashes()` that Phase 4 introduced for server-paginated search, closing the loop between the Phase 4 server-side data layer and the report generation layer.

The alternative — pre-computing every possible row-level aggregation as a matview — is impractical for the long tail of report statistics (hourly per-severity, factor co-occurrence, corridor-specific distributions). On-demand fetch bounded at 200k rows is the pragmatic middle ground.

## Architectural pattern

```
Aggregate tier selected
    │
    ├── Tab rendering: read matview via CL.data.cachedMatview()  [Rounds 3-7]
    │
    └── Report / PDF generation:
            ├── sampleRows.length > 0?  → dispatch directly (county-leaf fast path)
            └── sampleRows empty?       → await getCrashes({all:true, maxRows:200000})
                                           → populate temporary sampleRows
                                           → dispatch to per-type generator  [Round 8]
```

Both paths converge at the same per-type generator functions, which remain unmodified — preserving backward compatibility with county-leaf mode.

## Evidence

Round 8 (branch `claude/fix-ped-bike-reports-data-cgfCp`, 2026-05-09):
- Three functions patched in `app/index.html`: `generateReport()`, `exportFSToPDF()`, `exportIntersectionPDF()`.
- `generateReport()` hydration fixes 15 of 17 report types with a single guard block.
- `exportFSToPDF()` hydration additionally fixes the speed co-factor percentage denominator bug (see [[concepts/speed-cofactor-denominator-bug]]).
- `exportIntersectionPDF()` additionally fixes year-range metadata and chart initialization (see [[concepts/intersection-pdf-export-patches]]).
- `countermeasures` and `before-after` report types are unaffected because they read `cmfState`/`baState` which have their own Supabase queries.

## Implication for future work

Any new report type or PDF exporter added to CrashLens must either:
1. Be matview-backed from the start (derive all statistics from `mv_*` tables), OR
2. Include the hydration guard at entry so it works at aggregate tiers.

The 200k row cap means some federal-scale statistics will be approximate. Backend matviews for per-severity hour/year cross-tabs (`mv_analysis_summary.by_hour_fatal`) and factor co-occurrence (`mv_factor_pairs`) would eliminate the cap dependency for those specific aggregations.

## Related Concepts

- [[concepts/aggregate-tier-samplerows-empty]] — The precondition: matview-only mode at aggregate tiers
- [[concepts/report-generator-supabase-hydration]] — The on-demand hydration solution
- [[concepts/phase4-server-paginated-tables]] — Phase 4 established `getCrashes()` as the server-side data retrieval primitive; Round 8 repurposes it for report hydration
- [[concepts/speed-cofactor-denominator-bug]] — Downstream consequence of `sampleRows` being empty: wrong denominator in co-factor table
- [[concepts/intersection-pdf-export-patches]] — Three additional fixes in `exportIntersectionPDF()` beyond hydration

## Sources

- [[daily/2026-05-09.md]] — Round 8 full description; hydration pattern; connection between aggregate-tier architecture and report generation failures
