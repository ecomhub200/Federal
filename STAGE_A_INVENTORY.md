# Stage A — Module Inventory Ledger

**Lane-5-owned, DOC-ONLY.** This ledger is the per-wave snapshot of the
`app/modules/**` tree maintained by the Day 2 housekeeping lane. It records
verifiable counts (module count, total module LOC, `app/index.html` remaining
LOC, reduction vs the 159,387-line R1 baseline) so other lanes/sessions can
see refactor progress at a glance without re-counting.

> Generated read-only from `find app/modules -name '*.js' -type f` +
> `wc -l app/index.html`. No code is changed by this document. Other lanes
> MUST NOT edit this file (Lane 5 conflict guard).

R1 baseline: `app/index.html` = **159,387** LOC, 0 modules.

## Wave snapshots (Day 2)

| Snapshot | Commit | Modules | Module LOC | `app/index.html` LOC | Reduction vs 159,387 |
|---|---|---|---|---|---|
| Day 2 start | `9be31e5` | 70 | 28,687 | 142,804 | −16,583 (−10.4%) |
| Day 2 mid (R landed) | `32fa9d0` | 84 | 33,863 | 137,945 | −21,442 (−13.4%) |

> **Note:** Session R, S and T merged to `origin/main` as a single batch
> commit (`32fa9d0`), so the "mid" (R) and "end" (S+T) snapshots coincide on
> the same tree. R contributed the 5 new `ai/ai-domain-knowledge-*` modules
> (41b–41f); S+T contributed the 4 `dashboard/*` + 5 `intersection/*` modules.
> The full 84-module list is regenerated in the Wave 3 (Day 2 end) refresh
> below.

## Current module list (Day 2 start — 70 files)

Sorted by path; `loader.js` is the namespace-root registrar.

| Module | LOC |
|---|---|
| `ai/ai-domain-knowledge-core.js` | 398 |
| `ai/ai-mode-toggle.js` | 259 |
| `ai/context.js` | 39 |
| `analysis/analysis-tab.js` | 351 |
| `analysis/baselines.js` | 262 |
| `analysis/crash-profile.js` | 378 |
| `analysis/hotspots.js` | 59 |
| `app/tab-dispatcher.js` | 384 |
| `assets/asset-export.js` | 459 |
| `assets/school-tab.js` | 509 |
| `assets/transit-tab.js` | 1028 |
| `batch-ba/batch-ba-charts.js` | 493 |
| `batch-ba/batch-ba-duration.js` | 545 |
| `batch-ba/batch-ba-engine.js` | 477 |
| `batch-ba/batch-ba-export-csv.js` | 82 |
| `batch-ba/batch-ba-export-kml.js` | 160 |
| `batch-ba/batch-ba-export-pdf-details.js` | 352 |
| `batch-ba/batch-ba-export-pdf.js` | 500 |
| `batch-ba/batch-ba-results.js` | 286 |
| `batch-ba/batch-ba-state.js` | 226 |
| `batch-ba/batch-ba-upload.js` | 380 |
| `cmf/cmf-search.js` | 281 |
| `core/constants.js` | 149 |
| `core/epdo-presets.js` | 267 |
| `core/epdo.js` | 32 |
| `core/tier.js` | 390 |
| `data/chunk-loader.js` | 123 |
| `data/dashboard-filter-bindings.js` | 746 |
| `data/lazy-loader.js` | 227 |
| `data/matview-cache.js` | 121 |
| `data/prewarm.js` | 307 |
| `data/road-type-mapping.js` | 139 |
| `data/supabase-bridge.js` | 1104 |
| `data/supabase-map-bridge.js` | 485 |
| `data/tab-loaders.js` | 189 |
| `grants/grants-ui.js` | 2267 |
| `grants/ranking.js` | 147 |
| `hotspots/hotspots-tab-core.js` | 451 |
| `hotspots/hotspots-tab-modal.js` | 341 |
| `hotspots/hotspots-tab-render.js` | 329 |
| `loader.js` | 36 |
| `map/map-layers.js` | 304 |
| `map/map-points-hydrate.js` | 154 |
| `map/map-safe-helpers.js` | 95 |
| `reports/reports-charts.js` | 92 |
| `reports/reports-pdf.js` | 1100 |
| `reports/reports-standard-core.js` | 804 |
| `reports/reports-standard-core2.js` | 339 |
| `reports/reports-standard-types.js` | 948 |
| `reports/reports-standard-types2.js` | 437 |
| `scorecard/scorecard.js` | 973 |
| `spatial/aggregate-loader.js` | 207 |
| `spatial/boundary-service.js` | 479 |
| `spatial/federal-boundaries.js` | 204 |
| `spatial/geo-tier.js` | 1424 |
| `spatial/hierarchy-registry.js` | 130 |
| `spatial/r2-resolve.js` | 541 |
| `spatial/spatial-clip.js` | 115 |
| `ui/skeletons.js` | 86 |
| `upload/api-connector.js` | 333 |
| `upload/road-defaults.js` | 266 |
| `upload/upload-pipeline.js` | 773 |
| `upload/upload-tab.js` | 799 |
| `upload/upload-tier-ui.js` | 599 |
| `utils/date-utils.js` | 34 |
| `warrants/signal-thresholds.js` | 105 |
| `warrants/signal-tmc.js` | 902 |
| `warrants/signal.js` | 85 |
| `worker/csv-worker.js` | 403 |
| `worker/sample-rows-loader.js` | 198 |

**Totals:** 70 modules · 28,687 module LOC · `app/index.html` 142,804 LOC
(−16,583 / −10.4% vs the 159,387 R1 baseline).
