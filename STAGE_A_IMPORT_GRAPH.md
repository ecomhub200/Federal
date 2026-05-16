# Stage A — Import Graph & Load Order

Under IIFE the load order is the **`<script src>` tag order** in
`app/index.html`. Under ESM the load order is **implied by `import`
statements** — the engine resolves the dependency tree from the single
`app/main.js` entry. This document derives the `import` edges and the
resulting order.

## Two kinds of `CL.*` reference — only one becomes an `import`

| Kind | Definition | Stage A treatment |
|---|---|---|
| **Static export** | Member is a function/const declared in a module body (e.g. `CL.core.epdo.weight`, `CL.batchBA.state`) | Replace read with `import { member } from '<rel>/<file>.js'` |
| **Runtime singleton slot** | Slot is `null` in `loader.js` and assigned an instance at init by a side-effecting module (or an external `assets/js/*` file) | **Keep the `CL.x.y` runtime read.** Do **not** `import`. The instance does not exist at module-eval time. |

Singleton slots (from `app/modules/loader.js:15-19`) — **never imported**:

- `CL.data.client` — populated by `assets/js/data-client.js` (**outside
  `app/modules/`**, protected file — unchanged by Stage A)
- `CL.data.supabaseBridge` — populated by `data/supabase-bridge.js`
- `CL.data.mapBridge` — populated by `data/supabase-map-bridge.js`
- `CL.data.lazyLoader` — populated by `data/lazy-loader.js`

Consumers of these (`app/tab-dispatcher`, `core/tier`,
`map/map-points-hydrate`, `scorecard`) keep them as plain `CL.data.*`
reads. The owning modules are still imported by `main.js` for their
**side effect** (they assign the slot on load), exactly as the script tag
did before.

## Static-export import edges (the only real `import`s in Stage A)

41 of 53 modules are leaves — **zero** `import` lines (besides being
listed in `main.js`). The 12 with real edges:

| Module | `import` → | Was |
|---|---|---|
| `core/tier.js` | `upload/upload-tier-ui.js` | `CL.upload.tierUI.*` |
| `data/supabase-bridge.js` | `core/constants.js`, `ui/skeletons.js`, `upload/upload-tier-ui.js` | `CL.core.constants`, `CL.ui.skeletons`, `CL.upload.tierUI` |
| `scorecard/scorecard.js` | `data/prewarm.js` | `CL.data.prewarm.*` |
| `upload/upload-pipeline.js` | `core/constants.js` | `CL.core.constants` |
| `upload/upload-tab.js` | `core/constants.js`, `core/epdo.js`, `data/road-type-mapping.js` | `CL.core.constants`, `CL.core.epdo`, `CL.data.roadTypeMapping` |
| `batch-ba/batch-ba-engine.js` | `core/epdo.js` + batch-ba siblings | `CL.core.epdo`, `CL.batchBA.*` |
| `batch-ba/batch-ba-export-pdf.js` | `core/epdo.js` + batch-ba siblings | `CL.core.epdo`, `CL.batchBA.*` |
| `batch-ba/batch-ba-charts.js` | batch-ba siblings | `CL.batchBA.*` |
| `batch-ba/batch-ba-results.js` | batch-ba siblings | `CL.batchBA.*` |
| `batch-ba/batch-ba-duration.js` | batch-ba siblings | `CL.batchBA.*` |
| `batch-ba/batch-ba-state.js` | batch-ba siblings | `CL.batchBA.*` |
| `batch-ba/batch-ba-upload.js` + `-export-csv` + `-export-kml` + `-export-pdf-details` | batch-ba siblings | `CL.batchBA.*` |

Singleton-only consumers (`map/map-points-hydrate.js`,
`app/tab-dispatcher.js`) have **no** static import edge — they read
`CL.data.supabaseBridge` / `CL.data.client` / `CL.data.lazyLoader` at
runtime, unchanged.

## The `batch-ba/*` cycle

The 10 `batch-ba/*` files form a strongly-connected cluster
(`engine`↔`results`↔`charts`↔`state`↔`upload`↔`duration`↔exporters all
read each other's `CL.batchBA.*` members). ESM **supports import cycles**:
function bindings are live and hoisted, so a cyclic
`import { state } from './batch-ba-state.js'` is safe **as long as the
imported value is only used inside a function body called at runtime**,
never at module top-level evaluation. All `batch-ba` cross-refs are
runtime calls (event handlers, post-upload processing) → cycle is safe.
The per-module prompts must add a §1 note: *do not* reference an imported
sibling binding at top level.

## Topological load order (drives `app/main.js` import sequence)

ESM computes this itself; the order below is what `main.js` should list
for readability and to make the `loader.js`-first invariant explicit.

```
L0  modules/loader.js                 ← side-effect FIRST (creates CL.* keys
                                         the transitional CL.area.X writes need)

L1  (leaves — no module imports; any order)
    core/constants  core/epdo  utils/date-utils  ui/skeletons
    data/road-type-mapping  data/prewarm  data/matview-cache
    data/tab-loaders  data/lazy-loader  data/supabase-map-bridge
    data/chunk-loader  ai/context  analysis/crash-profile
    analysis/baselines  analysis/hotspots  grants/ranking
    warrants/signal  warrants/signal-tmc  warrants/signal-thresholds
    spatial/hierarchy-registry  spatial/boundary-service
    spatial/federal-boundaries  spatial/spatial-clip
    spatial/aggregate-loader  spatial/r2-resolve
    map/map-safe-helpers  upload/api-connector  upload/road-defaults
    upload/upload-tier-ui  core/epdo-presets  assets/asset-export
    assets/school-tab  assets/transit-tab  worker/sample-rows-loader

L2  (one hop)
    core/tier              → upload/upload-tier-ui
    upload/upload-pipeline → core/constants
    upload/upload-tab      → core/constants, core/epdo, data/road-type-mapping
    data/supabase-bridge   → core/constants, ui/skeletons, upload/upload-tier-ui
    scorecard/scorecard    → data/prewarm
    batch-ba/* (cluster)   → core/epdo + each other (cycle, runtime-safe)

L3  (singleton-slot consumers — no import edge, listed for side effect/order)
    app/tab-dispatcher     (reads CL.data.client / .lazyLoader at runtime)
    map/map-points-hydrate (reads CL.data.supabaseBridge at runtime)

WORKER (separate graph, not in main.js)
    worker/csv-worker.js   ← new Worker(url,{type:'module'}) @ index.html:30324
```

> Because `loader.js` only *creates* `CL.*` keys and the transitional
> `CL.area.X = X` writes happen at each module's load, importing
> `loader.js` first in `main.js` is sufficient. Singleton **population**
> order (data-client → supabase-bridge → map-bridge → lazy-loader) is
> unchanged from today — those are runtime inits, not import-time, so the
> existing init sequence in inline `index.html`/bootstrap still governs
> it. Stage A does **not** alter init timing.

## Cross-checks for the executing session

- Re-derive edges against the **final post-IIFE tree** (more modules will
  exist after prompts 01–46). The 12-edge set above is the IIFE-era floor.
- For every removed non-onclick `window.X`, confirm the new `import { X }`
  exists in every former `window.X`/`CL.area.X` reader (search
  `app/index.html` + all modules). A missed reader = runtime
  `ReferenceError` after cutover.
- Confirm no module references an imported binding at **top level**
  (only inside functions) — otherwise the `batch-ba` cycle (or any
  cycle introduced post-01–46) throws a TDZ error on load.
