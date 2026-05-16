# Stage A — Module Survey

Inventory of every `*.js` under `app/modules/` as of the IIFE-extraction
era, used to drive the IIFE → ESM conversion. **Planning artifact only —
no code is changed by this document.**

Generated read-only from `app/modules/**` + `app/index.html`
(`/tmp/survey.tsv`, `/tmp/onclick_api.tsv`). Re-run the survey loop against
the final post-IIFE tree before executing Stage A — counts will grow as the
remaining extraction prompts (01–46) land.

## Summary

| Metric | Value |
|---|---|
| Module files | **53** |
| `<script src="modules/…">` tags in `app/index.html` | 52 (EARLY ~L4450–4500, LATE ~L152997–153045) |
| Web Worker (loaded via `new Worker()`, no script tag) | `worker/csv-worker.js` @ `app/index.html:30324` |
| Unique `window.*` names exported by modules | 140 (~191 assignments) |
| Modules exposing ≥1 `window.*` | 9 |
| Modules whose `window.*` is hit by an `onclick=` | 9 |
| Distinct module-owned `window.*` fns in onclick handlers | **25** (floor — see `STAGE_A_ONCLICK_API.md`) |
| Modules with cross-module `CL.*` reads (need real `import`) | 12 |
| Pure leaf modules (no cross-module `CL.*`) | 41 |

## Namespace → directory map

The `CL.*` root key does not always equal the directory name. Stage A
`import` paths use the **directory**, exposure uses the **CL key**.

| CL root | Directory | CL root | Directory |
|---|---|---|---|
| `CL.core` | `core/` | `CL.batchBA` | `batch-ba/` |
| `CL.analysis` | `analysis/` | `CL.data` | `data/` |
| `CL.warrants` | `warrants/` | `CL.spatial` | `spatial/` |
| `CL.grants` | `grants/` | `CL.assets` | `assets/` |
| `CL.ai` | `ai/` | `CL.scorecard` | `scorecard/` |
| `CL.map` | `map/` | `CL.upload` | `upload/` |
| `CL.utils` | `utils/` | `CL.ui` | `ui/` |
| `CL.app` | `app/` | — | `worker/` (no CL key) |

## Full module table

`win#` = distinct `window.*` names assigned. `oc` = onclick refs to this
module's `window.*` (index.html + JS-built HTML). `xdeps` = cross-module
`CL.*` reads requiring an `import` after conversion.

| # | Module | Lines | CL namespace | win# | oc | xdeps |
|---|---|---|---|---|---|---|
| 1 | ai/context.js | 39 | ai/context | 1 | 0 | — |
| 2 | analysis/baselines.js | 262 | analysis/baselines | 1 | 0 | — |
| 3 | analysis/crash-profile.js | 378 | analysis/crash-profile | 1 | 0 | — |
| 4 | analysis/hotspots.js | 59 | analysis/hotspots | 1 | 0 | — |
| 5 | app/tab-dispatcher.js | 384 | app/tab-dispatcher | 5 | **22** | `CL.data`, `CL.data.client`, `CL.data.lazyLoader` |
| 6 | assets/asset-export.js | 459 | assets/asset-export | 7 | 3 | — |
| 7 | assets/school-tab.js | 509 | assets/school-tab | 13 | 2 | — |
| 8 | assets/transit-tab.js | 1028 | assets/transit-tab | 22 | 4 | — |
| 9 | batch-ba/batch-ba-charts.js | 493 | batch-ba/charts | 1 | 0 | `CL.batchBA.*` (siblings) |
| 10 | batch-ba/batch-ba-duration.js | 545 | batch-ba/duration | 1 | 0 | `CL.batchBA.*` (siblings) |
| 11 | batch-ba/batch-ba-engine.js | 477 | batch-ba/engine | 1 | 0 | `CL.batchBA.*`, `CL.core.epdo` |
| 12 | batch-ba/batch-ba-export-csv.js | 82 | batch-ba/export-csv | 1 | 0 | `CL.batchBA.*` (siblings) |
| 13 | batch-ba/batch-ba-export-kml.js | 160 | batch-ba/export-kml | 1 | 0 | `CL.batchBA.*` (siblings) |
| 14 | batch-ba/batch-ba-export-pdf-details.js | 352 | batch-ba/export-pdf-details | 1 | 0 | `CL.batchBA.*` (siblings) |
| 15 | batch-ba/batch-ba-export-pdf.js | 500 | batch-ba/export-pdf | 1 | 0 | `CL.batchBA.*`, `CL.core.epdo` |
| 16 | batch-ba/batch-ba-results.js | 286 | batch-ba/results | 1 | 0 | `CL.batchBA.*` (siblings) |
| 17 | batch-ba/batch-ba-state.js | 226 | batch-ba/state | 1 | 0 | `CL.batchBA.*` (siblings) |
| 18 | batch-ba/batch-ba-upload.js | 380 | batch-ba/upload | 1 | 0 | `CL.batchBA.*` (siblings) |
| 19 | core/constants.js | 149 | core/constants | 1 | 0 | — |
| 20 | core/epdo-presets.js | 267 | core/epdo-presets | 12 | 1 | — |
| 21 | core/epdo.js | 32 | core/epdo | 1 | 0 | — |
| 22 | core/tier.js | 390 | core/tier | 5 | 7 | `CL.data.mapBridge`, `CL.data.supabaseBridge`, `CL.upload.tierUI` |
| 23 | data/chunk-loader.js | 123 | data/chunk-loader | 2 | 4 | — |
| 24 | data/lazy-loader.js | 227 | data/lazyLoader | 1 | 0 | — |
| 25 | data/matview-cache.js | 121 | data/matview-cache | 1 | 0 | — |
| 26 | data/prewarm.js | 307 | data/prewarm | 2 | 0 | — |
| 27 | data/road-type-mapping.js | 139 | data/road-type-mapping | 1 | 0 | — |
| 28 | data/supabase-bridge.js | 1104 | data/supabase-bridge | 1 | 0 | `CL.core.constants`, `CL.ui.skeletons`, `CL.upload.tierUI` |
| 29 | data/supabase-map-bridge.js | 485 | data/mapBridge | 1 | 0 | — |
| 30 | data/tab-loaders.js | 189 | data/tabLoaders | 1 | 0 | — |
| 31 | grants/ranking.js | 147 | grants/ranking | 1 | 0 | — |
| 32 | loader.js | 34 | (namespace root) | 1 | 0 | builds all `CL.*` keys — **side-effect root** |
| 33 | map/map-points-hydrate.js | 154 | map/map-points-hydrate | 2 | 0 | `CL.data.supabaseBridge` |
| 34 | map/map-safe-helpers.js | 95 | map/map-safe-helpers | 4 | 0 | — |
| 35 | scorecard/scorecard.js | 973 | scorecard/scorecard | 27 | 2 | `CL.data.prewarm`, `CL.data.supabaseBridge` |
| 36 | spatial/aggregate-loader.js | 207 | spatial/aggregate-loader | 2 | 0 | — |
| 37 | spatial/boundary-service.js | 479 | spatial/boundary-service | 2 | 0 | — |
| 38 | spatial/federal-boundaries.js | 204 | spatial/federal-boundaries | 2 | 0 | — |
| 39 | spatial/hierarchy-registry.js | 130 | spatial/hierarchy-registry | 2 | 0 | — |
| 40 | spatial/r2-resolve.js | 541 | spatial/r2-resolve | 12 | 0 | — |
| 41 | spatial/spatial-clip.js | 115 | spatial/spatial-clip | 2 | 0 | — |
| 42 | ui/skeletons.js | 86 | ui/skeletons | 1 | 0 | — |
| 43 | upload/api-connector.js | 333 | upload/api-connector | 1 | 0 | — |
| 44 | upload/road-defaults.js | 266 | upload/road-defaults | 0 | 0 | — |
| 45 | upload/upload-pipeline.js | 773 | upload/upload-pipeline | 1 | 0 | `CL.core.constants` |
| 46 | upload/upload-tab.js | 799 | upload/upload-tab | 1 | 0 | `CL.core.constants`, `CL.core.epdo`, `CL.data.roadTypeMapping` |
| 47 | upload/upload-tier-ui.js | 599 | upload/upload-tier-ui | 1 | 0 | — |
| 48 | utils/date-utils.js | 34 | utils/date-utils | 1 | 0 | — |
| 49 | warrants/signal-thresholds.js | 105 | warrants/signal-thresholds | 6 | 0 | — |
| 50 | warrants/signal-tmc.js | 902 | warrants/signal-tmc | 30 | **15** | — |
| 51 | warrants/signal.js | 85 | warrants/signal | 1 | 0 | — |
| 52 | worker/csv-worker.js | 403 | (worker — no CL key) | 0 | 0 | **Web Worker — special case** |
| 53 | worker/sample-rows-loader.js | 198 | worker/sample-rows-loader | 1 | 0 | instantiates `csv-worker.js` |

## Special cases

- **`loader.js`** — not an IIFE; defines `window.CL` + all namespace keys
  + `CL._registerModule`. Remaining inline `index.html` code still reads
  `CL.*`, so `window.CL` must stay. Converted to a side-effect ESM module
  imported **first** by `app/main.js`.
- **`worker/csv-worker.js`** — runs in a `Worker` thread, not the page.
  Instantiated at `app/index.html:30324`
  (`new Worker('modules/worker/csv-worker.js')`). ESM requires
  `new Worker(url, { type: 'module' })`; the worker file itself uses
  `self.onmessage` + (after conversion) `import` for any deps. This is the
  one `index.html` edit allowed outside the script-tag swap.
- **`batch-ba/*`** — 10 files sharing the `CL.batchBA` root. Heavy
  intra-feature `CL.batchBA.*` reads → real cross-file `import`s within the
  `batch-ba/` directory after conversion.
- **`scorecard/scorecard.js` (27 win), `warrants/signal-tmc.js` (30 win)** —
  largest legacy `window.*` surfaces; only the onclick subset survives
  (see `STAGE_A_ONCLICK_API.md`), the rest become module-private + `CL.*`.
