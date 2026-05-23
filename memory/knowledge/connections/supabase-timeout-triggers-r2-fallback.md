---
title: "Connection: Supabase timeout → R2 fallback → parquet-only policy"
connects:
  - "concepts/supabase-ilike-performance"
  - "concepts/r2-parquet-policy"
  - "concepts/phase4-server-paginated-tables"
sources:
  - "daily/2026-04-23.md"
created: 2026-04-23
updated: 2026-04-23
---

# Connection: Supabase timeout → R2 fallback → parquet-only policy

## The Connection

Two separate bugs found during Phase 4 live testing form a cascade: the Supabase statement timeout causes the R2 fallback to fire, and the R2 fallback was requesting a `.csv` file that doesn't exist in the bucket. The fix for the second bug (drop the CSV fallback, use `.parquet` directly) enshrined the R2 parquet-only policy. Neither bug individually explains the policy; the chain does.

## Key Insight

The R2 parquet-only policy (`_r2LoadCrashes()` drops its CSV fallback) was motivated by an observable failure *chain*, not just by a desire to clean up legacy code. Without the Supabase timeout forcing the R2 path during testing, the stale CSV fallback might have gone unnoticed for months — it only fires when Supabase errors, which is a rare path in production.

This means: **the Supabase timeout is what exposed the R2 bug, and fixing the R2 bug hardened the contract that R2 is `.parquet`-only.** The two bugs are logically independent but causally linked by the error-path code flow.

## Evidence

During the Delaware/Sussex Phase 4 smoke test (2026-04-23):

1. User issued a compound search query (text + multi-severity + pedBike) against Sussex (86 000 rows).
2. Supabase returned `500 — canceling statement due to statement timeout` (ILIKE full-scan, no GIN index).
3. `CrashLensDataClient._r2LoadCrashes()` caught the error and requested the R2 fallback URL: `delaware/sussex/all_roads.csv`.
4. R2 returned HTTP 404 — the bucket only has `all_roads.parquet` (and legacy `all_roads.parquet.gz`); no `.csv` exists.
5. Fix: drop the CSV fallback entirely; request `.parquet` directly and pass bytes to the shared `_parseParquetGz()` parser (which already handles raw parquet via magic-byte sniff).

## Implication for future work

- The Supabase ILIKE timeout is still unresolved ([[concepts/supabase-ilike-performance]]). Until GIN trigram indexes are added, large jurisdictions will continue to fall back to R2 on compound queries.
- The R2 fallback now correctly fetches `.parquet` ([[concepts/r2-parquet-policy]]). The fallback is functionally correct but slower than a Supabase hit (full-file download vs. paginated rows).
- Any future R2 path that branches on file type must default to `.parquet` first — the CSV branch is permanently removed from the error path.

## Related Concepts

- [[concepts/supabase-ilike-performance]] — Root cause of the cascade
- [[concepts/r2-parquet-policy]] — Policy that resulted from fixing the cascade's second failure
- [[concepts/phase4-server-paginated-tables]] — The Phase 4 context in which both bugs surfaced simultaneously
