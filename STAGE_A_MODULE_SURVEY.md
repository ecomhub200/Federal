# Stage A — Module Survey

Inventory of every `*.js` under `app/modules/` as of the IIFE-extraction
era, used to drive the IIFE → ESM conversion. **Planning artifact only —
no code is changed by this document.**

Generated read-only from `app/modules/**` + `app/index.html`. **Regenerated
Session K (2026-05-17)** against the live 61-module tree (was 53 in Session
C's frozen snapshot). Counts will still grow as remaining IIFE extraction
prompts (01–46, Item 1) land — re-run the survey loop again after that round
closes and before scheduling the cutover.

## Summary

| Metric | Value |
|---|---|
| Module files | **61** (Session C: 53 → **+8 drift**) |
| `<script src="modules/…">` tags in `app/index.html` | 60 (incl. `loader.js`; EARLY + LATE clusters) |
| Web Worker (loaded via `new Worker()`, no script tag) | `worker/csv-worker.js` @ `app/index.html:30324` |
| `window.*` assignments across modules (incl. `window.CL` guard) | ~327 |
| Unique `window.*` names across modules (incl. `CL`) | 263 |
| Modules exposing ≥1 `window.*` | 59 (only `upload/road-defaults`, `worker/csv-worker` expose none) |
| Modules whose `window.*` is hit by an `on*=` handler | **14** |
| Distinct module-owned `window.*` fns in on\* handlers | **72** (floor — see `STAGE_A_ONCLICK_API.md`) |
| Modules with real static-export `import` edges | **15** clusters (12 original + reports core2→core, types2→types, geo-tier→tier-ui; batch-ba is a 10-file cycle) |
| Pure leaf modules (no static cross-module `CL.*`) | ≈38 |

> `on*=` = `onclick` + `onchange` + `oninput` + `onsubmit`, scanned across
> `app/index.html` **and** module-injected HTML strings. `onsubmit` yielded
> zero module-owned hits.

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
| `CL.app` | `app/` | `CL.reports` | `reports/` |
| — | `worker/` (no CL key) | — | — |

> Sub-namespaces of note (post-snapshot): `CL.ai.modeToggle`
> (`ai/ai-mode-toggle.js`), `CL.grants.ui` (`grants/grants-ui.js`),
> `CL.spatial.geoTier` (`spatial/geo-tier.js`), `CL.reports.standardCore` /
> `CL.reports.standardTypes` (the 4 `reports/reports-standard-*` files).

## Full module table

`win#` = distinct `window.*` names assigned (incl. the `window.CL` guard,
matching Session C convention). `oc` = on\* refs to this module's `window.*`
(index.html + JS-built HTML). `xdeps` = cross-module `CL.*` reads;
**bold-flagged** ones become real `import`s after conversion, the rest are
runtime singleton-slot / still-inline reads kept as-is.

| # | Module | Lines | CL namespace | win# | oc | xdeps |
|---|---|---|---|---|---|---|
| 1 | ai/ai-mode-toggle.js | 259 | ai/ai-mode-toggle | 10 | 4 | — |
| 2 | ai/context.js | 39 | ai/context | 1 | 0 | — |
| 3 | analysis/baselines.js | 262 | analysis/baselines | 1 | 0 | — |
| 4 | analysis/crash-profile.js | 378 | analysis/crash-profile | 1 | 0 | — |
| 5 | analysis/hotspots.js | 59 | analysis/hotspots | 1 | 0 | — |
| 6 | app/tab-dispatcher.js | 384 | app/tab-dispatcher | 5 | **22** | `CL.data`, `CL.data.client`, `CL.data.lazyLoader` (singleton — runtime) |
| 7 | assets/asset-export.js | 459 | assets/asset-export | 7 | 3 | — |
| 8 | assets/school-tab.js | 509 | assets/school-tab | 13 | 2 | — |
| 9 | assets/transit-tab.js | 1028 | assets/transit-tab | 22 | 4 | — |
| 10 | batch-ba/batch-ba-charts.js | 493 | batch-ba/charts | 1 | 0 | `CL.batchBA.*` (siblings) |
| 11 | batch-ba/batch-ba-duration.js | 545 | batch-ba/duration | 1 | 0 | `CL.batchBA.*` (siblings) |
| 12 | batch-ba/batch-ba-engine.js | 477 | batch-ba/engine | 1 | 0 | `CL.batchBA.*`, `CL.core.epdo` |
| 13 | batch-ba/batch-ba-export-csv.js | 82 | batch-ba/export-csv | 1 | 0 | `CL.batchBA.*` (siblings) |
| 14 | batch-ba/batch-ba-export-kml.js | 160 | batch-ba/export-kml | 1 | 0 | `CL.batchBA.*` (siblings) |
| 15 | batch-ba/batch-ba-export-pdf-details.js | 352 | batch-ba/export-pdf-details | 1 | 0 | `CL.batchBA.*` (siblings) |
| 16 | batch-ba/batch-ba-export-pdf.js | 500 | batch-ba/export-pdf | 1 | 0 | `CL.batchBA.*`, `CL.core.epdo` |
| 17 | batch-ba/batch-ba-results.js | 286 | batch-ba/results | 1 | 0 | `CL.batchBA.*` (siblings) |
| 18 | batch-ba/batch-ba-state.js | 226 | batch-ba/state | 1 | 0 | `CL.batchBA.*` (siblings) |
| 19 | batch-ba/batch-ba-upload.js | 380 | batch-ba/upload | 1 | 0 | `CL.batchBA.*` (siblings) |
| 20 | core/constants.js | 149 | core/constants | 1 | 0 | — |
| 21 | core/epdo-presets.js | 267 | core/epdo-presets | 12 | 11 | — |
| 22 | core/epdo.js | 32 | core/epdo | 1 | 0 | — |
| 23 | core/tier.js | 390 | core/tier | 5 | 7 | **`CL.upload.tierUI`**; `CL.data.mapBridge`, `CL.data.supabaseBridge` (singleton — runtime) |
| 24 | data/chunk-loader.js | 123 | data/chunk-loader | 2 | 4 | — (mirrors `showTab` — see ONCLICK_API note) |
| 25 | data/lazy-loader.js | 227 | data/lazyLoader | 1 | 0 | — |
| 26 | data/matview-cache.js | 121 | data/matview-cache | 1 | 0 | — |
| 27 | data/prewarm.js | 307 | data/prewarm | 2 | 0 | — |
| 28 | data/road-type-mapping.js | 139 | data/road-type-mapping | 1 | 0 | — |
| 29 | data/supabase-bridge.js | 1104 | data/supabase-bridge | 1 | 0 | **`CL.core.constants`, `CL.ui.skeletons`, `CL.upload.tierUI`** |
| 30 | data/supabase-map-bridge.js | 485 | data/mapBridge | 1 | 0 | — |
| 31 | data/tab-loaders.js | 189 | data/tabLoaders | 1 | 0 | — |
| 32 | grants/grants-ui.js | 2267 | grants/grants-ui | 37 | **78** | `CL.grants.*` (still-inline helpers — runtime, NOT an import edge) |
| 33 | grants/ranking.js | 147 | grants/ranking | 1 | 0 | — |
| 34 | loader.js | 35 | (namespace root) | 1 | 0 | builds all `CL.*` keys — **side-effect root** |
| 35 | map/map-layers.js | 304 | map/map-layers | 9 | 2 | — |
| 36 | map/map-points-hydrate.js | 154 | map/map-points-hydrate | 2 | 0 | `CL.data.supabaseBridge` (singleton — runtime) |
| 37 | map/map-safe-helpers.js | 95 | map/map-safe-helpers | 4 | 0 | — |
| 38 | reports/reports-standard-core.js | 804 | reports/reports-standard-core | 13 | 4 | `CL.data.supabaseBridge` (singleton — runtime) |
| 39 | reports/reports-standard-core2.js | 339 | reports/reports-standard-core2 | 7 | 0 | **`CL.reports.standardCore`** (→ reports-standard-core.js) |
| 40 | reports/reports-standard-types.js | 948 | reports/reports-standard-types | 19 | 0 | — |
| 41 | reports/reports-standard-types2.js | 437 | reports/reports-standard-types2 | 11 | 0 | **`CL.reports.standardTypes`** (→ reports-standard-types.js) |
| 42 | scorecard/scorecard.js | 973 | scorecard/scorecard | 27 | 9 | **`CL.data.prewarm`**; `CL.data.supabaseBridge` (singleton — runtime) |
| 43 | spatial/aggregate-loader.js | 207 | spatial/aggregate-loader | 2 | 0 | — |
| 44 | spatial/boundary-service.js | 479 | spatial/boundary-service | 2 | 0 | — |
| 45 | spatial/federal-boundaries.js | 204 | spatial/federal-boundaries | 2 | 0 | — |
| 46 | spatial/geo-tier.js | 1424 | spatial/geo-tier | 25 | 5 | **`CL.upload.tierUI`**; `CL.data.{supabaseBridge,mapBridge,lazyLoader}` (singleton — runtime); `CL.geo.places` (inline — runtime) |
| 47 | spatial/hierarchy-registry.js | 130 | spatial/hierarchy-registry | 2 | 0 | — |
| 48 | spatial/r2-resolve.js | 541 | spatial/r2-resolve | 12 | 0 | — |
| 49 | spatial/spatial-clip.js | 115 | spatial/spatial-clip | 2 | 0 | — |
| 50 | ui/skeletons.js | 86 | ui/skeletons | 1 | 0 | — |
| 51 | upload/api-connector.js | 333 | upload/api-connector | 1 | 0 | — |
| 52 | upload/road-defaults.js | 266 | upload/road-defaults | 0 | 0 | — |
| 53 | upload/upload-pipeline.js | 773 | upload/upload-pipeline | 1 | 0 | **`CL.core.constants`** |
| 54 | upload/upload-tab.js | 799 | upload/upload-tab | 1 | 0 | **`CL.core.constants`, `CL.core.epdo`, `CL.data.roadTypeMapping`** |
| 55 | upload/upload-tier-ui.js | 599 | upload/upload-tier-ui | 1 | 0 | — |
| 56 | utils/date-utils.js | 34 | utils/date-utils | 1 | 0 | — |
| 57 | warrants/signal-thresholds.js | 105 | warrants/signal-thresholds | 6 | 0 | — |
| 58 | warrants/signal-tmc.js | 902 | warrants/signal-tmc | 30 | **24** | — |
| 59 | warrants/signal.js | 85 | warrants/signal | 1 | 0 | — |
| 60 | worker/csv-worker.js | 403 | (worker — no CL key) | 0 | 0 | **Web Worker — special case** |
| 61 | worker/sample-rows-loader.js | 198 | worker/sample-rows-loader | 1 | 0 | instantiates `csv-worker.js` |

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
  `batch-ba/` directory after conversion (a runtime-safe cycle — see
  `STAGE_A_IMPORT_GRAPH.md`).
- **`reports/reports-standard-*` (4 files, post-snapshot)** — share the
  `CL.reports` root with two sub-namespaces: `*-core`/`*-core2` →
  `CL.reports.standardCore`, `*-types`/`*-types2` →
  `CL.reports.standardTypes`. `core2` reads `core`, `types2` reads `types`
  (two small intra-feature import edges, batch-ba-style). `*-core` also
  reads the `CL.data.supabaseBridge` singleton at runtime (kept, not an
  import). `-core`/`-types` are documented oversized exceptions
  (804 / 948 lines) like `assets/transit-tab`.
- **`grants/grants-ui.js` (2,267 lines, post-snapshot)** — documented
  oversized exception. Reads several `CL.grants.*` helpers
  (`updateGrantProgramUI`, `scrollToGrantSearch`, `runGrant*`,
  `populateGrantProgramDropdown`, `getGrantAISystemPrompt`) that are **not**
  extracted modules (IIFE prompts 27/28/29 never ran — those helpers +
  `grantState` stay inline/global per `CLAUDE.md`). These are runtime reads
  of still-inline globals, **not** static import edges. Owns the largest
  on\*-survivor surface (78 refs / 19 distinct fns).
- **`spatial/geo-tier.js` (1,424 lines, post-snapshot)** — documented
  oversized exception. One real import edge (`CL.upload.tierUI` →
  `upload/upload-tier-ui.js`); the rest of its `CL.data.*` reads are
  singleton-slot runtime reads and `CL.geo.places` is an inline-global read
  (kept, not imported).
- **`scorecard/scorecard.js` (27 win), `warrants/signal-tmc.js` (30 win),
  `grants/grants-ui.js` (37 win), `spatial/geo-tier.js` (25 win)** —
  largest legacy `window.*` surfaces; only the on\* subset survives
  (see `STAGE_A_ONCLICK_API.md`), the rest become module-private + `CL.*`.
