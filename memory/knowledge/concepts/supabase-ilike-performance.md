---
title: "Supabase ILIKE performance — statement timeout on compound crash queries"
aliases: [supabase-timeout, ilike-fullscan, gin-trigram-indexes]
tags: [supabase, performance, search, indexes, sql]
sources:
  - "daily/2026-04-23.md"
created: 2026-04-23
updated: 2026-04-23
---

# Supabase ILIKE performance — statement timeout on compound crash queries

Compound search queries that combine free-text filters with multi-severity and ped/bike flags trigger full ILIKE scans across multiple columns in the Supabase `crashes` table. On jurisdictions with ≥ 86 000 rows this causes Supabase to cancel the query with a statement timeout (HTTP 500).

## Key Points

- **Trigger:** compound query = free-text ILIKE + multi-severity array + `ped_bike` filter hitting Delaware/Sussex (86 000 rows)
- **Error:** `500 Internal Server Error — canceling statement due to statement timeout`
- **Root cause:** ILIKE full-scans across five unindexed text columns; no GIN/trigram index support
- **Fix (not yet applied):** add GIN trigram indexes on the five searched columns; alternatively simplify the query plan to reduce scan width
- **Client behaviour:** timeout is not a client bug — when Supabase errors the R2 fallback fires (see [[concepts/r2-parquet-policy]])

## Details

### What triggers the timeout

The Phase 4 Dashboard/Analysis search builds a PostgREST query against the Supabase `crashes` table. When the user combines:
- A free-text term (ILIKE `%term%` across multiple columns)
- Two or more severity levels (`severity=in.(K,A,B,C,O)` style)
- A ped/bike filter (`pedestrian=eq.true` or `bicycle=eq.true`)

…Postgres must evaluate the ILIKE pattern on every row for each of the five text columns (`rte_name`, `collision_type`, `document_nbr`, `intersection_name`, `weather_condition`) before applying the other filters. On a 86 000-row Sussex dataset this sequential scan exceeds Supabase's statement timeout threshold.

Single-filter queries (text only, or severity only) complete within the timeout because the scan terminates early or the result set is small.

### Recommended fix: GIN trigram indexes

PostgreSQL's `pg_trgm` extension enables trigram-based ILIKE acceleration. Adding a GIN index on each of the five searched columns allows the query planner to use an index scan instead of a sequential scan:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX crashes_rte_name_trgm          ON crashes USING GIN (rte_name gin_trgm_ops);
CREATE INDEX crashes_collision_type_trgm    ON crashes USING GIN (collision_type gin_trgm_ops);
CREATE INDEX crashes_document_nbr_trgm      ON crashes USING GIN (document_nbr gin_trgm_ops);
CREATE INDEX crashes_intersection_name_trgm ON crashes USING GIN (intersection_name gin_trgm_ops);
CREATE INDEX crashes_weather_condition_trgm ON crashes USING GIN (weather_condition gin_trgm_ops);
```

These indexes dramatically reduce query time for the `%term%` pattern at the cost of increased storage and slightly slower writes.

### Alternative: query simplification

If GIN indexes are not feasible (e.g. Supabase plan limits), the client can reduce scan width by searching only the most selective column when a free-text term is present, or by requiring a minimum term length before issuing a text filter.

### Current state

As of Phase 4 launch (2026-04-23), the GIN indexes have NOT been applied. Large jurisdictions that trigger the timeout fall back to the R2 parquet path automatically. The `updateWarrantAPIKeyStatus is not defined` bug also blocks end-to-end testing of the Warrants Phase 4 path.

## Related Concepts

- [[concepts/phase4-server-paginated-tables]] — Phase 4 is where this timeout was first observed; the compound query is the standard Dashboard/Analysis search pattern
- [[concepts/r2-parquet-policy]] — When Supabase times out, `_r2LoadCrashes()` falls back to R2 `.parquet`; the fallback must fetch `.parquet` not `.csv`
- [[concepts/location-name-resilience]] — `getCrashesByLocation()` uses ILIKE for its fuzzy-retry stage and faces the same index gap; less likely to timeout because it targets a single location

## Sources

- [[daily/2026-04-23.md]] — Delaware/Sussex Phase 4 live test hit the timeout; identified as ILIKE full-scan on 86K rows; GIN trigram indexes listed as the recommended remediation
