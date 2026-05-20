/**
 * CrashLens Module Namespace
 * All extracted modules attach to window.CL
 * This file initializes the namespace structure.
 */
window.CL = window.CL || {};
CL.app = CL.app || {};
CL.core = CL.core || {};
CL.analysis = CL.analysis || {};
CL.warrants = CL.warrants || {};
CL.grants = CL.grants || {};
CL.cmf = CL.cmf || {};
CL.safety = CL.safety || {};
CL.ai = CL.ai || {};
CL.data = CL.data || {};
CL.data.client = null; // Populated by data-client.js init (Phase 1)
CL.data.supabaseBridge = null; // Populated by supabase-bridge.js (Phase 2)
CL.data.mapBridge = null;       // Populated by supabase-map-bridge.js (Phase 3)
CL.data.lazyLoader = null;      // Populated by lazy-loader.js (Phase 6)
CL.spatial = CL.spatial || {};
CL.assets = CL.assets || {};
CL.scorecard = CL.scorecard || {};
CL.map = CL.map || {};
CL.upload = CL.upload || {};
CL.utils = CL.utils || {};
CL.batchBA = CL.batchBA || {};
CL.reports = CL.reports || {};
CL.hotspots = CL.hotspots || {};
CL.ui = CL.ui || {};
CL.dashboard = CL.dashboard || {};
CL.intersection = CL.intersection || {};
CL.pedbike = CL.pedbike || {};
CL.notifications = CL.notifications || {};

// Module loading tracker (for debugging)
CL._loaded = [];
CL._registerModule = function(name) {
    CL._loaded.push({ name: name, time: new Date().toISOString() });
    console.log('[CL] Module loaded:', name);
};
