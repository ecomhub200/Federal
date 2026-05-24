/**
 * CL map.safe module
 *
 * Extracted from app/index.html (snapshot L19966-L20032) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/34-map-map-safe-helpers.md.
 * Responsibility: Safe Leaflet fly/fit wrappers.
 *
 * Public API (back-compat dual exposure):
 *   - window.safeFlyTo → CL.map.safeFlyTo
 *   - window.safeFitBounds → CL.map.safeFitBounds
 *   - window.safeFlyToBounds → CL.map.safeFlyToBounds
 *
 * Depends on (must load before this file): `core/constants`
 */
'use strict';
// ─── EXTRACTED CODE START (verbatim from index.html) ───

// ============================================================
// ROUND 18 §3 — Safe map navigation helpers
// Leaflet flyTo(NaN,NaN) / fitBounds(invalid) silently throw and leave
// the loading spinner stuck (audit F002 + F005). Centralize the guard
// here so every callsite gets the same treatment.
// ============================================================
function safeFlyTo(map, center, zoom, options) {
    if (!map || typeof map.flyTo !== 'function') return false;
    if (!Array.isArray(center) || center.length < 2) {
        console.warn('[Map] safeFlyTo guarded non-array center; aborting');
        return false;
    }
    const lat = Number(center[0]);
    const lng = Number(center[1]);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        console.warn('[Map] safeFlyTo guarded NaN coords; aborting');
        return false;
    }
    try {
        map.flyTo([lat, lng], zoom, options);
        return true;
    } catch (e) {
        console.warn('[Map] safeFlyTo threw:', e && e.message);
        return false;
    }
}

function safeFitBounds(map, bounds, options) {
    if (!map || typeof map.fitBounds !== 'function') return false;
    if (!bounds) {
        console.warn('[Map] safeFitBounds guarded null bounds; aborting');
        return false;
    }
    try {
        if (typeof bounds.isValid === 'function' && !bounds.isValid()) {
            console.warn('[Map] safeFitBounds guarded invalid bounds; aborting');
            return false;
        }
        map.fitBounds(bounds, options);
        return true;
    } catch (e) {
        console.warn('[Map] safeFitBounds threw:', e && e.message);
        return false;
    }
}

function safeFlyToBounds(map, bounds, options) {
    if (!map || typeof map.flyToBounds !== 'function') {
        return safeFitBounds(map, bounds, options);
    }
    if (!bounds) {
        console.warn('[Map] safeFlyToBounds guarded null bounds; aborting');
        return false;
    }
    try {
        if (typeof bounds.isValid === 'function' && !bounds.isValid()) {
            console.warn('[Map] safeFlyToBounds guarded invalid bounds; aborting');
            return false;
        }
        map.flyToBounds(bounds, options);
        return true;
    } catch (e) {
        console.warn('[Map] safeFlyToBounds threw:', e && e.message);
        return false;
    }
}

// ─── EXTRACTED CODE END ───

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.map = CL.map || {};
CL.map.safeFlyTo = safeFlyTo;
CL.map.safeFitBounds = safeFitBounds;
CL.map.safeFlyToBounds = safeFlyToBounds;

export { safeFlyTo, safeFitBounds, safeFlyToBounds };

CL._registerModule('map/map-safe-helpers');
