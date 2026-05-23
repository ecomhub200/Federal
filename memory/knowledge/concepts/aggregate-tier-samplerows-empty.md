---
title: "Aggregate tier — crashState.sampleRows is always empty"
aliases: [supabase-only-mode, aggregate-tier-empty-rows, samplerows-empty]
tags: [architecture, supabase, matview, reports, tiers]
sources:
  - "daily/2026-05-09.md"
created: 2026-05-09
updated: 2026-05-09
---

# Aggregate tier — `crashState.sampleRows` is always empty

## Core Fact

At every **aggregate tier** — federal, state, region, MPO, planning district, and county-rollup — `crashState.sampleRows = []`. No R2 parquet file is loaded in these modes; all data comes from Supabase matviews. Code that iterates `sampleRows` for charts, tables, or distributions silently produces zeroes or impossible values.

## Key Points

- `sampleRows` is only populated at **county-leaf** tiers where an R2 `.parquet` file is fetched and parsed client-side.
- Matview-backed tabs (Dashboard, Ped-Bike, Hot-Spots, Intersections) were patched in Rounds 3-7 to render from matviews and therefore work correctly at aggregate tiers.
- The **Reports tab** (`generateReport()`, `exportFSToPDF()`, `exportIntersectionPDF()`) still iterated `sampleRows` before Round 8, producing blank/zero PDFs at any non-county-leaf tier.
- `cmfState` and `baState` are already matview-backed (CMF and Before/After tabs read from their own Supabase queries), so those two report types were unaffected.
- Detection pattern: `if (crashState.sampleRows.length === 0 && crashLensClient && supabaseBridge.resolveTier)` — both client and bridge must be present for the hydration path to be safe.

## Details

### Tier hierarchy

CrashLens supports a multi-level geographic hierarchy: federal → state → region → MPO → planning district → county → city. At the county-leaf and city levels the app fetches the jurisdiction's full parquet from R2 and stores every row in `crashState.sampleRows`. At every higher tier no single parquet covers the jurisdiction; the app exclusively uses pre-aggregated Supabase matviews (`mv_dashboard_summary`, `mv_hotspots`, `mv_safety_categories`, etc.).

The supabase-map-bridge's `resolveTier()` function determines which column name to use when querying matviews (e.g., `dot_district` for regions, `mpo_name` for MPOs). This same logic gates the Supabase hydration in Round 8's report fix.

### History of patching

Rounds 3-7 progressively converted individual tabs to matview-only rendering:
- Dashboard KPI tiles and comparison panels → `mv_dashboard_summary`
- Ped-Bike KPI tiles → `mv_safety_categories`
- Hot-Spots table → `mv_hotspots`
- Intersections table → `mv_intersections` (or equivalent)

After those rounds, the Reports tab remained the last major UI surface that assumed `sampleRows` was populated.

### Round 8 fix scope

Round 8 addressed three functions:
- `generateReport()` — universal Supabase hydration covering 15 of 17 report types
- `exportFSToPDF()` — on-demand row fetch for Fatal/Speed distributions
- `exportIntersectionPDF()` — cascading fallbacks for metadata and chart initialization

See [[concepts/report-generator-supabase-hydration]] for the hydration pattern, [[concepts/speed-cofactor-denominator-bug]] for the percentage calculation fix, and [[concepts/intersection-pdf-export-patches]] for the three Intersection PDF fixes.

## Related Concepts

- [[concepts/report-generator-supabase-hydration]] — The solution: fetch up to 200 000 rows from Supabase when `sampleRows` is empty
- [[concepts/phase4-server-paginated-tables]] — Phase 4 introduced server-side queries; the same `getCrashes()` client is reused by Round 8 hydration
- [[concepts/speed-cofactor-denominator-bug]] — Downstream bug caused by `sampleRows` being empty: wrong denominator in the co-factor percentage table
- [[concepts/intersection-pdf-export-patches]] — Three intersection PDF fixes that also stem from `sampleRows` being empty at aggregate tiers

## Sources

- [[daily/2026-05-09.md]] — Round 8 root-cause analysis; identified that Rounds 3-7 fixed tabs but left Reports iterating `sampleRows`; fix description for all three functions
