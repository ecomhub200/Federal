---
title: "Phase 4 — Server-Paginated Tables (Supabase-backed)"
aliases: [phase4, supabase-paginated-search, phase4-server-paginated]
tags: [architecture, supabase, data-client, search, phase4]
sources:
  - "daily/2026-04-23.md"
created: 2026-04-23
updated: 2026-04-23
---

# Phase 4 — Server-Paginated Tables (Supabase-backed)

Phase 4 replaces the client-side in-memory search on the Dashboard and Analysis tabs with server-side Supabase queries, and adds Supabase-backed data loading for the CMF and Warrants tabs. The implementation lives in `assets/js/data-client.js` under the `CrashLensDataClient` class.

## Key Points

- **Branch:** shipped on `claude/read-phase4-docs-I44zm`; first live-tested against Delaware/Sussex
- **Dashboard/Analysis tabs:** search is now server-paginated via Supabase `crashes` table — text, severity, ped/bike filters all resolved server-side
- **CMF/Warrants tabs:** location crash lists fetched from Supabase via `CrashLensDataClient.getCrashesByLocation()` (see [[concepts/location-name-resilience]])
- **Test suite:** `tests/test_phase4_data_client.js` — 55 assertions; all passing at launch
- **R2 fallback:** when Supabase errors (e.g. statement timeout), `_r2LoadCrashes()` fetches the jurisdiction's `.parquet` file from R2 as a fallback (see [[concepts/r2-parquet-policy]])

## Details

### Architecture overview

Phase 4 introduces a two-tier data path. The primary path queries Supabase directly, taking advantage of indexed columns and server-side filtering to keep response payloads small. The secondary path (R2 fallback) fetches the full jurisdiction parquet and filters client-side — identical to the pre-Phase-4 behaviour.

`CrashLensDataClient` in `assets/js/data-client.js` owns both paths. The Dashboard and Analysis search bars pass their filter state to the client, which builds a PostgREST query and paginates results. CMF and Warrants use `getCrashesByLocation()`, which adds a 3-stage exact→fuzzy-ILIKE→canonical resolution layer to handle format drift between R2 route names and Supabase `rte_name` column values.

### Bugs uncovered during initial live testing (Delaware/Sussex)

Two issues surfaced during the first real-data test:

1. **Supabase statement timeout** — A compound query (free-text + multi-severity + pedBike filter) triggered a full ILIKE scan across five columns on 86 000 Sussex rows and hit the Supabase statement timeout, returning `500 Internal Server Error — canceling statement due to statement timeout`. This is a server-side indexing gap, not a client bug. See [[concepts/supabase-ilike-performance]].

2. **R2 CSV fallback 404** — When Supabase errored in the above scenario, the R2 fallback in `_r2LoadCrashes()` requested `delaware/sussex/all_roads.csv`, which does not exist in R2 (the bucket has `.parquet` only). The CSV fallback was a pre-Phase-4 relic. Fixed by dropping the CSV fallback and fetching `.parquet` directly. See [[concepts/r2-parquet-policy]].

### Open follow-ups at launch

- Patch the main `app/index.html` autoload pipeline (`fetchWithMultiFormatFallback`, ~line 23144) and R2 manifest availability check (`hasAnyVariant`, ~line 22873) to prefer `.parquet` when legacy `.parquet.gz` files are retired from R2.
- Add GIN trigram indexes on `rte_name`, `collision_type`, `document_nbr`, `intersection_name`, `weather_condition` for large jurisdictions.
- Fix pre-existing bug `updateWarrantAPIKeyStatus is not defined` that blocks `initWarrantsTab` — a prerequisite for live-testing the Phase 4 Warrants path.

## Related Concepts

- [[concepts/supabase-ilike-performance]] — Statement timeout hit during Phase 4 testing; GIN trigram indexes are the recommended fix
- [[concepts/r2-parquet-policy]] — R2 fallback must use `.parquet`; CSV fallback was dropped as part of Phase 4 fix
- [[concepts/location-name-resilience]] — 3-stage exact/fuzzy/canonical query used by `getCrashesByLocation()` in Phase 4

## Sources

- [[daily/2026-04-23.md]] — Phase 4 shipped; Delaware/Sussex live test; two bugs found and one fixed; 55 test assertions passing
