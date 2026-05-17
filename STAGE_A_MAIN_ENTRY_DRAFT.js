// =============================================================================
// STAGE A — DRAFT of app/main.js  (ESM entry point)
// =============================================================================
// THIS IS A PLANNING ARTIFACT, NOT THE LIVE ENTRY POINT.
// It shows what app/main.js will look like AFTER all 61 modules are converted
// (IIFE -> ESM) and the 60 <script src> tags in app/index.html are replaced
// with a single:
//
//     <script type="module" src="main.js"></script>
//
// Do NOT wire this in until the single coordinated Stage A cutover
// (STAGE_A_62-cutover). A half-migrated state is broken: a file containing
// `export` cannot be loaded by a classic <script src> (Unexpected token).
//
// Path note: app/index.html lives at app/, so src="main.js" => app/main.js,
// and all imports below are relative to app/main.js (i.e. './modules/...').
// On GitHub Pages the base is /Federal/app/ — relative specifiers resolve
// correctly; do NOT hard-code /Federal/.
// =============================================================================

'use strict';

// --- L0: namespace root (side effect — MUST be first) -----------------------
// Creates window.CL + all CL.* keys + CL._registerModule. Remaining inline
// index.html code still reads CL.*, so window.CL stays.
import './modules/loader.js';

// --- L1: leaf modules (no cross-module imports) -----------------------------
// Imported for their side effect (each still writes its transitional
// CL.area.* and, where applicable, its onclick window.* — see
// STAGE_A_ONCLICK_API.md). Named imports are added by main.js only where it
// itself needs to re-expose a global for legacy HTML (see bottom block).
import './modules/core/constants.js';
import './modules/core/epdo.js';
import './modules/utils/date-utils.js';
import './modules/ui/skeletons.js';
import './modules/data/road-type-mapping.js';
import './modules/data/prewarm.js';
import './modules/data/matview-cache.js';
import './modules/data/tab-loaders.js';
import './modules/data/lazy-loader.js';
import './modules/data/supabase-map-bridge.js';
import './modules/data/chunk-loader.js';
import './modules/ai/context.js';
import './modules/ai/ai-mode-toggle.js';
import './modules/analysis/crash-profile.js';
import './modules/analysis/baselines.js';
import './modules/analysis/hotspots.js';
import './modules/grants/ranking.js';
import './modules/grants/grants-ui.js';
import './modules/warrants/signal.js';
import './modules/warrants/signal-tmc.js';
import './modules/warrants/signal-thresholds.js';
import './modules/spatial/hierarchy-registry.js';
import './modules/spatial/boundary-service.js';
import './modules/spatial/federal-boundaries.js';
import './modules/spatial/spatial-clip.js';
import './modules/spatial/aggregate-loader.js';
import './modules/spatial/r2-resolve.js';
import './modules/map/map-safe-helpers.js';
import './modules/map/map-layers.js';
import './modules/upload/api-connector.js';
import './modules/upload/road-defaults.js';
import './modules/upload/upload-tier-ui.js';
import './modules/core/epdo-presets.js';
import './modules/assets/asset-export.js';
import './modules/assets/school-tab.js';
import './modules/assets/transit-tab.js';
import './modules/reports/reports-standard-core.js';
import './modules/reports/reports-standard-types.js';
import './modules/worker/sample-rows-loader.js';

// --- L2: one-hop dependents (their own import lines pull L1 deps) -----------
import './modules/core/tier.js';
import './modules/spatial/geo-tier.js';
import './modules/upload/upload-pipeline.js';
import './modules/upload/upload-tab.js';
import './modules/data/supabase-bridge.js';
import './modules/scorecard/scorecard.js';
import './modules/reports/reports-standard-core2.js';
import './modules/reports/reports-standard-types2.js';

// batch-ba cluster (cyclic — runtime-safe; see STAGE_A_IMPORT_GRAPH.md).
// Importing any one pulls the rest via their cross-imports; listed in full
// for the load tracker + readability.
import './modules/batch-ba/batch-ba-state.js';
import './modules/batch-ba/batch-ba-engine.js';
import './modules/batch-ba/batch-ba-upload.js';
import './modules/batch-ba/batch-ba-results.js';
import './modules/batch-ba/batch-ba-charts.js';
import './modules/batch-ba/batch-ba-duration.js';
import './modules/batch-ba/batch-ba-export-csv.js';
import './modules/batch-ba/batch-ba-export-kml.js';
import './modules/batch-ba/batch-ba-export-pdf.js';
import './modules/batch-ba/batch-ba-export-pdf-details.js';

// --- L3: singleton-slot consumers (no static edge; order for clarity) ------
import './modules/app/tab-dispatcher.js';
import './modules/map/map-points-hydrate.js';

// NOTE: worker/csv-worker.js is NOT imported here. It is a Worker entry,
// instantiated separately. Stage A edits ONLY its instantiation site:
//   app/index.html:30324
//   const worker = new Worker('modules/worker/csv-worker.js', { type: 'module' });

// =============================================================================
// Legacy global re-exposure for HTML onclick= handlers
// =============================================================================
// Each owning module already keeps its own `window.<fn> = <fn>` for the 72
// onclick survivors (STAGE_A_ONCLICK_API.md), so in the common case main.js
// needs NOTHING here. This block is a SAFETY NET / single source of truth: if
// a module's self-exposure is ever dropped, re-add it here by importing the
// named export and assigning it. Example shape (commented — enable only if a
// module stops self-exposing):
//
// import { showTab, navigateTo } from './modules/app/tab-dispatcher.js';
// window.showTab = showTab;
// window.navigateTo = navigateTo;
//
// (Full survivor list: STAGE_A_ONCLICK_API.md §"Survivor set".)

// =============================================================================
// Bootstrap (LAST)
// =============================================================================
// If/when the inline index.html bootstrap is extracted (IIFE prompt 46
// `app/bootstrap`), import it here LAST so the full module graph + CL.* +
// window.* are in place before app init runs:
//
// import './modules/app/bootstrap.js';
//
// Until bootstrap is modularized, the existing inline bootstrap in
// app/index.html still runs (module scripts are deferred, so it runs AFTER
// this graph — verify ordering assumptions in the cutover Playwright smoke).
