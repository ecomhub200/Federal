# Knowledge Base Index

| Article | Summary | Compiled From | Updated |
|---------|---------|---------------|---------|
| [[concepts/r2-parquet-policy]] | R2 crash data is `.parquet` only — no `.parquet.gz`, no `.csv`. Applies from 2026-04-23 onward. | `daily/2026-04-23.md` | 2026-04-23 |
| [[concepts/location-name-resilience]] | `getCrashesByLocation` uses exact→fuzzy-ILIKE→canonical-filter to survive rte_name/node format drift between R2 CSV and Supabase across all states. | `daily/2026-04-23.md` | 2026-04-23 |
| [[concepts/phase4-server-paginated-tables]] | Phase 4 replaces client-side in-memory search with Supabase-paginated queries for Dashboard/Analysis tabs and adds Supabase-backed CMF/Warrants loading. | `daily/2026-04-23.md` | 2026-04-23 |
| [[concepts/supabase-ilike-performance]] | Compound ILIKE queries on ≥86K-row jurisdictions hit Supabase statement timeout; GIN trigram indexes on 5 columns are the fix. | `daily/2026-04-23.md` | 2026-04-23 |
| [[connections/supabase-timeout-triggers-r2-fallback]] | Supabase timeout → R2 fallback → CSV 404 is the failure chain that motivated the parquet-only policy; the two bugs are causally linked by the error path. | `daily/2026-04-23.md` | 2026-04-23 |
| [[concepts/aggregate-tier-samplerows-empty]] | At federal/state/region/MPO/planning-district/county-rollup tiers, `crashState.sampleRows = []`; all data comes from Supabase matviews. Code iterating `sampleRows` silently produces zeroes at these tiers. | `daily/2026-05-09.md` | 2026-05-09 |
| [[concepts/report-generator-supabase-hydration]] | `generateReport()` now fetches up to 200k rows from Supabase when `sampleRows` is empty, fixing 15 of 17 report types at aggregate tiers in one guard block (Round 8). | `daily/2026-05-09.md` | 2026-05-09 |
| [[concepts/speed-cofactor-denominator-bug]] | Speed Co-Factor table used jurisdiction-wide matview counts ÷ route-level crash total → impossible 10,000%+ percentages. Fix: use all-crashes-in-dataset as denominator, clamp ≤100%, rename column to "% of All". | `daily/2026-05-09.md` | 2026-05-09 |
| [[concepts/intersection-pdf-export-patches]] | Three Round 8 fixes to `exportIntersectionPDF()`: year-range cascading fallback (stops "Period: N/A"), K-segment minimum 4mm width + callout, and chart force-paint before canvas capture. | `daily/2026-05-09.md` | 2026-05-09 |
| [[connections/aggregate-tier-drives-report-hydration]] | The architectural decision to use matview-only mode at aggregate tiers cascades into every row-iterating report generator; on-demand Supabase hydration (Round 8) is the systematic fix using the same `getCrashes()` client from Phase 4. | `daily/2026-05-09.md` | 2026-05-09 |
