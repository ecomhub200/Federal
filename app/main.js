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
