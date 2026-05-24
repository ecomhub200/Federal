// =============================================================================
// Stage A — app/main.js (ESM entry point, BUILT INCREMENTALLY)
// =============================================================================
// This file is the future single <script type="module"> entry for the app.
// It is being assembled one STAGE_A_NN prompt at a time. Stage A is a SINGLE
// coordinated cutover: the app does NOT load via this file until
// STAGE_A_62-cutover swaps the <script src> tags in app/index.html for:
//
//     <script type="module" src="main.js"></script>
//
// Until then this file is import-safe (node --check) but unwired — the live
// app continues to boot from classic <script src> tags in app/index.html.
//
// Topo order and the full final shape live in STAGE_A_MAIN_ENTRY_DRAFT.js.
// =============================================================================

'use strict';

// --- L0: namespace root (side effect — MUST be first) -----------------------
// Creates window.CL + all CL.* keys + CL._registerModule. Remaining inline
// index.html code still reads CL.*, so window.CL stays.
import './modules/loader.js';

// --- L1: leaf modules (no cross-module imports) ----------------------------
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
import './modules/analysis/crash-profile.js';
import './modules/analysis/baselines.js';
import './modules/analysis/hotspots.js';
import './modules/grants/ranking.js';
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
import './modules/upload/api-connector.js';
import './modules/upload/road-defaults.js';
import './modules/upload/upload-tier-ui.js';
import './modules/core/epdo-presets.js';
import './modules/assets/asset-export.js';
import './modules/assets/school-tab.js';
import './modules/assets/transit-tab.js';
import './modules/worker/sample-rows-loader.js';

// --- L2: one-hop dependents -------------------------------------------------
import './modules/core/tier.js';
import './modules/upload/upload-pipeline.js';
import './modules/upload/upload-tab.js';
