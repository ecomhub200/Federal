/**
 * Road-Type Mapping — single source of truth.
 *
 * The radio set under "Road Type" exposes 4 values to the user
 * (countyOnly / cityOnly / countyPlusVDOT / allRoads). Behind those, every
 * tier translates the radio into a different Supabase matview filter spec,
 * a different label string, and a different R2 file suffix. Before this
 * module existed those three mappings lived in three separate files
 * (supabase-bridge.js, data-client.js, app/index.html updateRoadTypeLabels
 * & getActiveRoadTypeSuffix) and silently disagreed — most visibly at
 * MPO/Planning District/County, where the radio labeled "County Roads
 * Only" was actually fetching dot_roads.
 *
 * The table below is consumed by:
 *   - CL.data.supabaseBridge.roadTypeSpec()
 *   - CrashLensDataClient.radioToBucket()
 *   - app/index.html updateRoadTypeLabels()
 *   - app/index.html getActiveRoadTypeSuffix()
 *   - app/modules/upload/upload-tab.js getActiveRoadTypeSuffix()
 *
 * State-agnostic. Adding a new state requires zero changes here — only the
 * state's hierarchy.json needs new dbName entries.
 *
 * Tier semantics:
 *   - federal/state/region : "agency-rollup" tiers — the radios are about
 *                            who owns the road statewide (DOT vs Non-DOT).
 *   - mpo/planning_district/county/city : "place" tiers — the radios are
 *                            about which roads INSIDE this place to show,
 *                            with optional interstate exclusion.
 */
'use strict';

// The 4 radio values shared by every tier. Keep in sync with
// app/index.html input[name=roadTypeFilter] values.
export const RADIO_VALUES = ['countyOnly', 'cityOnly', 'countyPlusVDOT', 'allRoads'];

// ─────────────────────────────────────────────────────────
// Tier × Radio → { spec, label, hint, r2Suffix }
// ─────────────────────────────────────────────────────────
//
//   spec      — Supabase filter object passed to dashboard_summary etc.
//                {} = no filter
//                { roadType: 'dot_roads' }                 — single bucket
//                { roadTypes: ['city_roads','county_roads','other_roads'] } — multi-bucket
//                { noInterstate: true }                    — is_interstate=eq.false
//   label     — bold label rendered next to the radio
//   hint      — secondary description rendered after " - "
//   r2Suffix  — R2 file suffix used by getActiveRoadTypeSuffix() for the
//                R2 fallback / map-points pipeline.

var AGGREGATE_TIER = {  // federal / state / region
    countyOnly:     { spec: { roadType: 'dot_roads' },                                    label: 'DOT Roads Only',  hint: 'State DOT-maintained roads',         r2Suffix: 'dot_roads' },
    cityOnly:       { spec: { roadType: 'city_roads' },                                   label: 'City Roads Only', hint: 'City/town agency roads',             r2Suffix: 'city_roads' },
    countyPlusVDOT: { spec: { roadTypes: ['city_roads', 'county_roads', 'other_roads'] }, label: 'Non-DOT Roads',   hint: 'Local and non-state roads',          r2Suffix: 'non_dot_roads' },
    allRoads:       { spec: {},                                                           label: 'All Roads',       hint: 'DOT + Non-DOT combined',             r2Suffix: 'all_roads' }
};

var PLACE_TIER = {  // mpo / planning_district / county / city
    countyOnly:     { spec: { roadType: 'county_roads' }, label: 'County Roads Only',         hint: 'County-maintained roads',  r2Suffix: 'county_roads' },
    cityOnly:       { spec: { roadType: 'city_roads' },   label: 'City Roads Only',           hint: 'City/town agency roads',   r2Suffix: 'city_roads' },
    countyPlusVDOT: { spec: { noInterstate: true },       label: 'All Roads (No Interstate)', hint: 'Includes state routes',    r2Suffix: 'no_interstate' },
    allRoads:       { spec: {},                            label: 'All Roads',                 hint: 'Including interstates',    r2Suffix: 'all_roads' }
};

// Tier-specific overlay tweaks (label/hint copy only — spec stays
// identical to the parent group). Lets `federal` say "(nationwide)"
// without forking the whole config.
function _hintOverlay(tier, radio, base) {
    if (tier === 'federal' && radio === 'allRoads') {
        return Object.assign({}, base, { hint: 'DOT + Non-DOT combined (nationwide)' });
    }
    if (tier === 'state' && radio === 'allRoads') {
        return Object.assign({}, base, { label: 'Statewide All Roads' });
    }
    return base;
}

export function _isAggregateTier(tier) {
    return tier === 'federal' || tier === 'state' || tier === 'region';
}

/**
 * Resolve a (tier, radio) pair into the full config object
 * { spec, label, hint, r2Suffix }. Falls back to PLACE_TIER for unknown
 * tiers (matches the legacy `_default` behavior).
 */
export function get(tier, radio) {
    var t = tier || 'county';
    var r = (RADIO_VALUES.indexOf(radio) >= 0) ? radio : 'allRoads';
    var table = _isAggregateTier(t) ? AGGREGATE_TIER : PLACE_TIER;
    var base = table[r];
    return _hintOverlay(t, r, base);
}

/**
 * Read the active "Road Type" radio in the DOM (or fall back to the
 * persisted localStorage value, then 'allRoads'). Pure DOM helper —
 * separate from get() so tests can inject a radio value.
 */
export function activeRadioValue() {
    try {
        var el = document.querySelector('input[name="roadTypeFilter"]:checked');
        if (el && el.value) return el.value;
    } catch (e) { /* non-DOM context */ }
    try {
        var stored = (typeof localStorage !== 'undefined') ? localStorage.getItem('selectedFilterProfile') : null;
        if (stored) return stored;
    } catch (e) { /* non-fatal */ }
    return 'allRoads';
}

/**
 * Convenience wrappers used by the three downstream consumers.
 */
export function specFor(tier, radio) { return get(tier, radio).spec; }
export function labelFor(tier, radio) {
    var c = get(tier, radio);
    return '<strong>' + c.label + '</strong> - ' + c.hint;
}
export function suffixFor(tier, radio) { return get(tier, radio).r2Suffix; }

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.data = CL.data || {};
CL.data.roadTypeMapping = {
    RADIO_VALUES: RADIO_VALUES,
    get: get,
    specFor: specFor,
    labelFor: labelFor,
    suffixFor: suffixFor,
    activeRadioValue: activeRadioValue,
    _isAggregateTier: _isAggregateTier
};

if (typeof CL._registerModule === 'function') {
    CL._registerModule('data/road-type-mapping');
}
