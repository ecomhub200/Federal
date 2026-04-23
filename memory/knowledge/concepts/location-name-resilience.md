---
title: Location name resilience — route/node format drift between R2 and Supabase
sources:
  - daily/2026-04-23.md
created: 2026-04-23
updated: 2026-04-23
---

# Location name resilience

## Context

Phase 4's `CrashLensDataClient.getCrashesByLocation()` queries the
Supabase `crashes` table with `rte_name=eq.<value>` or `node=eq.<value>`
to load every crash at a user-selected location (CMF/Warrants tabs need
the complete set for profile/pattern analysis).

The same route can appear in two formats:

| Source | Example |
|---|---|
| R2 parquet `'RTE Name'` column (what browser has in memory) | `DE 18` |
| Supabase `crashes.rte_name` column | varies per state/pipeline |

Delaware's Supabase ingest does NOT store `'DE 18'` as a literal string,
so `rte_name=eq.DE 18` returns zero rows even though the aggregates say
1,364 crashes exist for `DE 18`.

**Blocker:** the ingest pipeline that populates Supabase is not in this
repo — the only crash-data pipeline in the repo (R2 CSV→parquet) does
not touch Supabase. So the fix has to live on the client.

## Strategy

3-stage query in `getCrashesByLocation` (`assets/js/data-client.js`):

1. **Exact match** — `rte_name=eq.<value>`. Fast, uses b-tree index.
   Succeeds for states where the ingest preserved the R2 format.
2. **Fuzzy ILIKE retry** — only if stage 1 returned 0 rows AND the value
   contains a separator (`\s`, `-`, `_`, `.`). Pattern is built by
   replacing any run of separators with `*` so `DE 18` becomes `DE*18`,
   which matches `DE 18`, `DE-18`, `DE18`, `DE 18 ` in Postgres ILIKE
   (case-insensitive, anchored at both ends).
3. **Canonical client-side verification** — the ILIKE result may include
   false positives (`SR 1` pattern matches `SR 11`, `SR 111`, …). Each
   returned row's `rte_name` / `node` is reduced to its canonical form
   (`toUpperCase().replace(/[^A-Z0-9]/g, '')`) and kept only if it
   matches the canonical form of the requested value.

The helper is exposed as `CrashLensDataClient.canonicalLocationName(s)`.

## Known limitation

Canonicalisation by non-alphanumeric stripping does **not** handle
zero-padding: `'DE 18'` canonicalises to `'DE18'`, but `'DE0018'`
canonicalises to `'DE0018'` — they won't match. If a state ingest
zero-pads numeric segments, an extra normaliser will be needed (strip
leading zeros from numeric runs). No state in the current roster does
this, so it's deferred.

## Downstream fallback

`loadLocationForCMF()` and `loadLocationForWarrants()` still contain a
final sampleRows fallback that fires if getCrashesByLocation returns an
empty array AND `aggregateCount > 0` (i.e. the R2 CSV has rows but
Supabase is missing them entirely). This is belt-and-braces — the
fuzzy retry should normally handle format drift — and only triggers if
Supabase is genuinely out of sync.

## Tests

`tests/test_phase4_data_client.js` group **L** exercises:
- Canonicalisation helper edge cases (space/dash/dot/null)
- Exact-hit path fires one request only
- Exact-miss path fires a second ILIKE request
- ILIKE result filtered to drop false positives (`DE 180`, `DE 181`)
  while keeping real matches (`DE 18`, `DE-18`)

See also: [[concepts/r2-parquet-policy]], [[concepts/phase4-server-paginated-tables]] (TBD).
