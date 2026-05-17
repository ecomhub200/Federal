# Stage A — Import Graph & Load Order

Under IIFE the load order is the **`<script src>` tag order** in
`app/index.html`. Under ESM the load order is **implied by `import`
statements** — the engine resolves the dependency tree from the single
`app/main.js` entry. This document derives the `import` edges and the
resulting order.

> **Regenerated Session K (2026-05-17)** against the live 61-module tree
> (was 53 / 12 edges in Session C). New static edges: `reports core2→core`,
> `reports types2→types`, `spatial/geo-tier → upload/upload-tier-ui`. The 8
> post-snapshot modules are folded into the topo order and
> `STAGE_A_MAIN_ENTRY_DRAFT.js`. **Re-derive again after the IIFE round
> (Item 1)** — more modules will exist.

## Two kinds of `CL.*` reference — only one becomes an `import`

| Kind | Definition | Stage A treatment |
|---|---|---|
| **Static export** | Member is a function/const declared in a module body (e.g. `CL.core.epdo.weight`, `CL.batchBA.state`, `CL.reports.standardCore.*`) | Replace read with `import { member } from '<rel>/<file>.js'` |
| **Runtime singleton slot / still-inline global** | Slot is `null` in `loader.js` and assigned at init by a side-effecting module/external file, **or** the `CL.x.y` target is a not-yet-extracted inline `index.html` helper | **Keep the `CL.x.y` runtime read.** Do **not** `import`. The value does not exist at module-eval time. |

Singleton slots (from `app/modules/loader.js`) — **never imported**:

- `CL.data.client` — populated by `assets/js/data-client.js` (**outside
  `app/modules/`**, protected file — unchanged by Stage A)
- `CL.data.supabaseBridge` — populated by `data/supabase-bridge.js`
- `CL.data.mapBridge` — populated by `data/supabase-map-bridge.js`
- `CL.data.lazyLoader` — populated by `data/lazy-loader.js`

Still-inline globals — **never imported** (kept as runtime `CL.*` reads
until the IIFE round extracts them):

- `CL.grants.*` helpers read by `grants/grants-ui.js`
  (`updateGrantProgramUI`, `scrollToGrantSearch`, `runGrant*`,
  `populateGrantProgramDropdown`, `getGrantAISystemPrompt`) — IIFE prompts
  27/28/29 never ran; these + `grantState` stay inline/global per
  `CLAUDE.md`.
- `CL.geo.places` read by `spatial/geo-tier.js` — inline geo data, no
  owning module.

Consumers of singleton slots (`app/tab-dispatcher`, `core/tier`,
`map/map-points-hydrate`, `scorecard`, `spatial/geo-tier`,
`reports/reports-standard-core`) keep them as plain `CL.data.*` reads. The
owning modules are still imported by `main.js` for their **side effect**
(they assign the slot on load), exactly as the script tag did before.

## Static-export import edges (the only real `import`s in Stage A)

≈38 of 61 modules are leaves — **zero** `import` lines (besides being
listed in `main.js`). The real edges:

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
| `reports/reports-standard-core2.js` | `reports/reports-standard-core.js` | `CL.reports.standardCore.*` |
| `reports/reports-standard-types2.js` | `reports/reports-standard-types.js` | `CL.reports.standardTypes.*` |
| `spatial/geo-tier.js` | `upload/upload-tier-ui.js` | `CL.upload.tierUI.*` |

Singleton-only / inline-only consumers (`map/map-points-hydrate.js`,
`app/tab-dispatcher.js`, `reports/reports-standard-core.js`,
`grants/grants-ui.js`) have **no** static import edge — they read
`CL.data.*` singletons / `CL.grants.*` inline helpers at runtime,
unchanged.

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

## The `reports/reports-standard-*` mini-clusters

Two acyclic 2-file clusters (no cycle — strictly one-directional):

- `reports-standard-core2.js` → `reports-standard-core.js`
  (`CL.reports.standardCore.*`)
- `reports-standard-types2.js` → `reports-standard-types.js`
  (`CL.reports.standardTypes.*`)

`reports-standard-core.js` additionally reads the
`CL.data.supabaseBridge` singleton at runtime (kept, not imported). Same
top-level-reference caution as batch-ba applies to the `-core2`/`-types2`
import of their base file (use imported bindings only inside function
bodies).

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
    data/chunk-loader  ai/context  ai/ai-mode-toggle
    analysis/crash-profile  analysis/baselines  analysis/hotspots
    grants/ranking  grants/grants-ui  warrants/signal
    warrants/signal-tmc  warrants/signal-thresholds
    spatial/hierarchy-registry  spatial/boundary-service
    spatial/federal-boundaries  spatial/spatial-clip
    spatial/aggregate-loader  spatial/r2-resolve
    map/map-safe-helpers  map/map-layers  upload/api-connector
    upload/road-defaults  upload/upload-tier-ui  core/epdo-presets
    assets/asset-export  assets/school-tab  assets/transit-tab
    reports/reports-standard-core  reports/reports-standard-types
    worker/sample-rows-loader

L2  (one hop)
    core/tier                  → upload/upload-tier-ui
    spatial/geo-tier           → upload/upload-tier-ui
    upload/upload-pipeline     → core/constants
    upload/upload-tab          → core/constants, core/epdo, data/road-type-mapping
    data/supabase-bridge       → core/constants, ui/skeletons, upload/upload-tier-ui
    scorecard/scorecard        → data/prewarm
    reports/reports-standard-core2  → reports/reports-standard-core
    reports/reports-standard-types2 → reports/reports-standard-types
    batch-ba/* (cluster)       → core/epdo + each other (cycle, runtime-safe)

L3  (singleton-slot / inline consumers — no import edge, listed for side effect/order)
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
>
> `grants/grants-ui` and `reports/reports-standard-core` sit in L1/L2 for
> load-order purposes but read still-inline `CL.grants.*` / singleton
> `CL.data.*` at runtime — no static edge, no TDZ risk.

The full ordered `import` list is materialized in
`STAGE_A_MAIN_ENTRY_DRAFT.js` (8 post-snapshot modules added Session K).
The terminal cutover prompt copies it to `app/main.js`.

## Cross-checks for the executing session

- Re-derive edges against the **final post-IIFE tree** (more modules will
  exist after prompts 01–46). The 15-edge set above is the
  61-module-tree floor.
- For every removed non-onclick `window.X`, confirm the new `import { X }`
  exists in every former `window.X`/`CL.area.X` reader (search
  `app/index.html` + all modules). A missed reader = runtime
  `ReferenceError` after cutover.
- Confirm no module references an imported binding at **top level**
  (only inside functions) — otherwise the `batch-ba` / `reports-*2`
  cycles (or any cycle introduced post-01–46) throw a TDZ error on load.
- When Item 1 extracts the `CL.grants.*` / `CL.geo.places` inline helpers
  into modules, promote those runtime reads to real import edges and
  re-run this derivation.
