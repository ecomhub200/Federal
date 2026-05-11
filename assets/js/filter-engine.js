// assets/js/filter-engine.js
// Round 18 — global FilterEngine. Single source of truth for filters
// shared across tabs. State-agnostic: every change keys on the filter
// spec, never on jurisdiction literals.
(function (global) {
    'use strict';

    // Filter spec: shared across all tabs
    const FILTER_SPEC = {
        date_start:        null,        // ISO date string OR null
        date_end:          null,
        year_start:        null,        // int (overrides date_* when set)
        year_end:          null,
        severity:          new Set(['K','A','B','C','O']),  // active severities
        road_type:         'all',       // 'all' | 'all_no_interstate' | 'dot_roads' | 'city_roads' | 'county_roads'
        is_interstate:     null,        // null | true | false (computed from road_type)
        location_type:     null,        // 'intersection' | 'segment' | null
        min_crashes:       null,        // int OR null
        group_by:          'route',     // 'route' | 'node'
        traffic_control:   null,        // raw value from mv_intersection_summary OR null
        people_injury_type:null         // 'K' | 'A' | 'B' | 'C' | 'O' | null
    };

    const _subscribers = new Map();   // key: tabName → callback(spec, changedKeys)
    const _previousSpec = { ...FILTER_SPEC };

    // Round 19 §4 — persist filter spec to localStorage so a page reload keeps
    // the user's date range / road type / severity selection. State-agnostic:
    // storage key has no jurisdiction literals; severity Set is serialized to
    // an array for JSON safety.
    const STORAGE_KEY = 'crashlens_filter_spec_v1';

    (function _loadFromStorage() {
        try {
            const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEY) : null;
            if (!raw) return;
            const saved = JSON.parse(raw);
            for (const k of Object.keys(saved)) {
                if (!(k in FILTER_SPEC)) continue;
                if (k === 'severity' && Array.isArray(saved[k])) {
                    FILTER_SPEC[k] = new Set(saved[k]);
                } else {
                    FILTER_SPEC[k] = saved[k];
                }
            }
            console.log('[FilterEngine] restored from storage');
        } catch (e) { /* ignore corrupted state */ }
    })();

    function _persist() {
        try {
            if (typeof localStorage === 'undefined') return;
            const serializable = {
                ...FILTER_SPEC,
                severity: [...FILTER_SPEC.severity]
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
        } catch (e) { /* ignore quota errors */ }
    }

    /** Update one or more fields, fire all subscribers with the changed keys. */
    function setFilter(updates) {
        const changedKeys = [];
        for (const k of Object.keys(updates)) {
            if (!(k in FILTER_SPEC)) {
                console.warn('[FilterEngine] unknown key:', k);
                continue;
            }
            FILTER_SPEC[k] = updates[k];
            changedKeys.push(k);
        }
        if (changedKeys.length === 0) return;
        console.log('[FilterEngine] changed:', changedKeys.join(','));
        const spec = getSpec();
        _subscribers.forEach((cb, tab) => {
            try { cb(spec, changedKeys); }
            catch (e) { console.warn('[FilterEngine] subscriber "' + tab + '" failed:', e && e.message); }
        });
        Object.assign(_previousSpec, FILTER_SPEC);
        _persist();
    }

    /** Read the current spec (shallow copy of all values). */
    function getSpec() {
        return {
            date_start:  FILTER_SPEC.date_start,
            date_end:    FILTER_SPEC.date_end,
            year_start:  FILTER_SPEC.year_start,
            year_end:    FILTER_SPEC.year_end,
            severity:    new Set(FILTER_SPEC.severity),
            road_type:   FILTER_SPEC.road_type,
            is_interstate: FILTER_SPEC.is_interstate,
            location_type: FILTER_SPEC.location_type,
            min_crashes: FILTER_SPEC.min_crashes,
            group_by:    FILTER_SPEC.group_by,
            traffic_control: FILTER_SPEC.traffic_control,
            people_injury_type: FILTER_SPEC.people_injury_type
        };
    }

    /** Subscribe a tab to filter changes. Callback fires on every setFilter. */
    function subscribe(tabName, callback) { _subscribers.set(tabName, callback); }
    function unsubscribe(tabName) { _subscribers.delete(tabName); }

    /** Reset all filters to defaults. */
    function reset() {
        setFilter({
            date_start: null, date_end: null, year_start: null, year_end: null,
            severity: new Set(['K','A','B','C','O']),
            road_type: 'all', is_interstate: null,
            location_type: null, min_crashes: null,
            group_by: 'route', traffic_control: null, people_injury_type: null
        });
        // Round 19 §4 — also wipe persisted storage so the next page load
        // genuinely starts fresh (not just the in-memory spec).
        try {
            if (typeof localStorage !== 'undefined') localStorage.removeItem(STORAGE_KEY);
        } catch (e) { /* ignore */ }
    }

    /** Helper: filter a row array by the active spec, client-side. */
    function applyClientSideFilter(rows, options) {
        options = options || {};
        const spec = getSpec();
        return (rows || []).filter(r => {
            if (spec.year_start != null && r.crash_year != null && r.crash_year < spec.year_start) return false;
            if (spec.year_end   != null && r.crash_year != null && r.crash_year > spec.year_end)   return false;
            if (spec.severity && r.crash_severity && !spec.severity.has(r.crash_severity)) return false;
            if (spec.location_type && r.location_type && r.location_type !== spec.location_type) return false;
            if (spec.min_crashes != null && r.total_crashes != null && r.total_crashes < spec.min_crashes) return false;
            if (spec.traffic_control && r.traffic_control_type && r.traffic_control_type !== spec.traffic_control) return false;
            return true;
        });
    }

    global.FilterEngine = { setFilter, getSpec, subscribe, unsubscribe, reset, applyClientSideFilter };
})(window);
