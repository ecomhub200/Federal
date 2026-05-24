/**
 * CrashLens Date Utilities
 * Extracted from app/index.html — pure date helper functions
 *
 * Stage A v3 Phase 2.1 — converted from CL-namespace assignment to ESM:
 *   - Module body is now a top-level `const dateUtils = {...}` binding
 *   - Named export `dateUtils` (unused by other modules in Phase 2; future-phase only)
 *   - Back-compat dual exposure preserves `window.CL.utils.dateUtils` for every
 *     classic-loaded caller (the inline app/index.html scripts + every other
 *     still-classic module) — call-time reads stay timing-tolerant.
 *   - No ESM imports — cross-module dependencies stay routed through window.CL.X.
 */
'use strict';

const dateUtils = {
    parseCrashDateToTimestamp: function(dateStr) {
        if (!dateStr) return null;

        // If it's already a number (timestamp), return it
        var numVal = Number(dateStr);
        if (!isNaN(numVal) && numVal > 946684800000) { // After year 2000 in ms
            return numVal;
        }

        // Try parsing date string formats
        // Common formats: "11/4/2017 4:00:00 AM", "2017-11-04", etc.
        var d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
            return d.getTime();
        }

        return null;
    },

    formatDateForDisplay: function(date) {
        var options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
};

export { dateUtils };

// === Back-compat dual exposure (classic-loaded callers still read CL.utils.dateUtils) ===
if (typeof window !== 'undefined') {
  window.CL = window.CL || {};
  window.CL.utils = window.CL.utils || {};
  window.CL.utils.dateUtils = dateUtils;
}

// === Module registration (load tracker) — routed via window.CL in ESM scope ===
if (typeof window !== 'undefined' && window.CL && window.CL._registerModule) {
  window.CL._registerModule('utils/date-utils');
}
