/**
 * CrashLens Module Namespace
 * All extracted modules attach to window.CL
 * This file initializes the namespace structure.
 */
window.CL = window.CL || {};
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
CL.spatial = CL.spatial || {};
CL.upload = CL.upload || {};
CL.utils = CL.utils || {};
CL.batchBA = CL.batchBA || {};

// Module loading tracker (for debugging)
CL._loaded = [];
CL._registerModule = function(name) {
    CL._loaded.push({ name: name, time: new Date().toISOString() });
    console.log('[CL] Module loaded:', name);
};
