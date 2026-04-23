---
title: R2 crash data file format — .parquet only
sources:
  - daily/2026-04-23.md
created: 2026-04-23
updated: 2026-04-23
---

# R2 crash data file format — `.parquet` only

## Policy

From **2026-04-23** onward, CrashLens R2 storage serves crash data as
**uncompressed `.parquet` files only**. Specifically:

- **Do:** use `.parquet` file extension for all new R2 crash data paths.
- **Don't:** use `.parquet.gz`, `.csv.gz`, or `.csv` for crash data.

This applies across every tier R2 path (`{state}/_state/`, `{state}/_region/<slug>/`,
`{state}/_mpo/<slug>/`, `{state}/<county>/`, `{state}/_city/<slug>/`, etc.)
and every row-set variant (`all_roads`, `county_roads`, `city_roads`,
`no_interstate`).

## R2 bucket layout (as observed 2026-04-23)

Per inspection of `crash-lens-data/delaware/kent/`:

| File | Size | Notes |
|------|------|-------|
| `all_roads.parquet` | 7.63 MB | **Use this** |
| `all_roads.parquet.gz` | 12.67 MB | Legacy — will be retired |
| `county_roads.parquet` | 796 KB | **Use this** |
| `county_roads.parquet.gz` | 635 KB | Legacy |
| same pattern for `city_roads`, `no_interstate` | | |

The R2 custom domain `data.aicreatesai.com` maps to the `crash-lens-data`
bucket root, so a Delaware/Kent all-roads fetch URL is
`https://data.aicreatesai.com/delaware/kent/all_roads.parquet`.

## Implementation hooks

| Location | Role | State |
|----------|------|-------|
| `assets/js/data-client.js` → `_r2Path()` | Builds R2 path for `CrashLensDataClient` | ✅ returns `.parquet` only |
| `assets/js/data-client.js` → `_r2LoadCrashes()` | Fetches + parses the file | ✅ uses app's `_parseParquetGz` (tolerates raw bytes via gzip magic-byte sniff); no CSV fallback |
| `app/index.html` → `_parseParquetGz()` (line ~31338) | Shared hyparquet parser | Already sniffs `0x1F 0x8B` magic bytes and handles raw parquet |
| `app/index.html` autoload pipeline | Main crash data loader | Still tries `.parquet.gz` → `.csv.gz` → `.csv` (pre-policy; migration pending) |

## Why the parser "just works"

`_parseParquetGz(arrayBuffer)` in `app/index.html:31338` checks the first two
bytes of the buffer: if they are `0x1F 0x8B` (gzip magic) it runs
`pako.ungzip()` first; otherwise it passes the bytes straight to
`hyparquet`. That means the function handles both `.parquet` and `.parquet.gz`
transparently — we don't need a separate raw-parquet loader, just a correct
fetch URL.

## Migration status

- ✅ `CrashLensDataClient._r2LoadCrashes` — migrated 2026-04-23
- 🟡 Main `app/index.html` autoload pipeline — still requests `.parquet.gz`
  first, falls through to `.csv.gz` then `.csv`. Works because R2 still has
  the legacy `.parquet.gz` files. When those are deleted, the main pipeline
  will need to prefer `.parquet` (see `fetchWithMultiFormatFallback`, ~line
  23144).
- 🟡 R2 manifest + availability check (`hasAnyVariant`, ~line 22873) still
  lists `all_roads.parquet.gz`. Add `.parquet` variants when the legacy
  files are retired.

## Background

The issue that triggered this policy: Phase 4's Supabase-to-R2 fallback path
tried a nonexistent `all_roads.csv` URL because `_r2LoadCrashes()` had a
CSV-legacy fallback that predated the pipeline's parquet migration. The R2
bucket has `.parquet` files (not `.csv`), so the fallback 404'd whenever
Supabase errored — which happened when a test query exceeded the Supabase
statement timeout.

See also: [[concepts/phase4-server-paginated-tables]] (TBD).
