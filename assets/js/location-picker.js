// ============================================================================
// Round 13 — Universal LocationPicker module.
//
// State-agnostic backing module that drives every "Or Select Location"
// dropdown in the app (Countermeasure, Warrant Analyzer, Domain Knowledge,
// MUTCD AI, Reports, Before/After, Application Builder).
//
// Backed by mv_location_picker via crashLensClient.getLocationPicker.
// Caches at the (state, jurisdiction, road_type, location_type, minCrashes)
// granularity for 5 minutes; cleared when the active tier changes.
// ============================================================================
(function (global) {
    'use strict';

    var CACHE = new Map();
    var TTL_MS = 5 * 60 * 1000;

    function cacheKey(opts) {
        return [
            opts.state, opts.jurisdictionKind, opts.jurisdictionValue,
            opts.roadType, opts.locationType, opts.minCrashes
        ].join('|');
    }

    /**
     * Map the active road-type spec from the Supabase bridge into the single
     * pseudo-string that the get_location_picker RPC understands.
     *
     *   { roadType: 'dot_roads' }       → 'dot_roads'
     *   { roadType: 'county_roads' }    → 'county_roads'
     *   { roadType: 'city_roads' }      → 'city_roads'
     *   { noInterstate: true }          → 'all_no_interstate'
     *   { roadTypes: [a, b] }           → first bucket (multi-select rare here;
     *                                     the picker always has a single tier
     *                                     active, so first wins)
     *   {} (empty)                      → 'all'
     *
     * Falls back to 'all_no_interstate' (the safe county-default) when the
     * bridge isn't loaded yet — matches the pre-existing client behaviour.
     */
    function _currentRoadType() {
        try {
            if (global.CL && global.CL.data && global.CL.data.supabaseBridge &&
                typeof global.CL.data.supabaseBridge.roadTypeSpec === 'function') {
                var spec = global.CL.data.supabaseBridge.roadTypeSpec() || {};
                if (spec.noInterstate) return 'all_no_interstate';
                if (spec.roadType) return spec.roadType;
                if (Array.isArray(spec.roadTypes) && spec.roadTypes.length) return spec.roadTypes[0];
                return 'all';
            }
        } catch (e) { /* fall through */ }
        return 'all_no_interstate';
    }

    /**
     * Resolve the current jurisdiction context from the supabase bridge so
     * callers don't need to thread it manually. Returns {kind, value} where
     * `kind` is one of 'county' | 'mpo' | 'planning_district' | 'dot_district',
     * or {kind: null, value: null} for state/federal tiers (no jurisdiction
     * filter — the picker shows everything for the state).
     */
    function _currentJurisdiction() {
        try {
            var bridge = global.CL && global.CL.data && global.CL.data.supabaseBridge;
            if (!bridge || typeof bridge.resolveTier !== 'function') {
                return { kind: null, value: null };
            }
            var t = bridge.resolveTier();
            if (!t) return { kind: null, value: null };
            // Map tier → matview filter key. region maps to dot_district per
            // mv_location_picker source. state/federal/city → no jurisdiction
            // filter (state still scopes via p_state).
            var map = {
                'county':            'county',
                'mpo':               'mpo',
                'planning_district': 'planning_district',
                'region':            'dot_district'
            };
            if (map[t.tier] && t.value) return { kind: map[t.tier], value: t.value };
            return { kind: null, value: null };
        } catch (e) { return { kind: null, value: null }; }
    }

    function _currentState() {
        try {
            return (global.crashLensClient && global.crashLensClient.state) || null;
        } catch (e) { return null; }
    }

    /**
     * Fetch (and cache) location rows for the currently active tier.
     */
    function fetchLocations(opts) {
        opts = opts || {};
        var j = _currentJurisdiction();
        var params = {
            state:             _currentState(),
            jurisdictionKind:  j.kind,
            jurisdictionValue: j.value,
            roadType:          opts.roadType || _currentRoadType(),
            locationType:      opts.locationType || null,
            minCrashes:        opts.minCrashes || 1,
            limit:             opts.limit || 500
        };
        var key = cacheKey(params);
        var now = Date.now();
        var cached = CACHE.get(key);
        if (!opts.forceRefresh && cached && (now - cached.t) < TTL_MS) {
            return Promise.resolve(cached.rows);
        }
        if (!global.crashLensClient || typeof global.crashLensClient.getLocationPicker !== 'function') {
            return Promise.resolve([]);
        }
        return global.crashLensClient.getLocationPicker(params).then(function (rows) {
            rows = rows || [];
            CACHE.set(key, { rows: rows, t: now });
            return rows;
        }).catch(function (e) {
            console.warn('[LocationPicker] fetch failed:', e && e.message);
            return [];
        });
    }

    function _escapeHtml(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /**
     * Populate a <select> element with the canonical option shape:
     *   <option value="route:US 13">US 13 (98 crashes)</option>
     *   <option value="node:12345">DE 8 & US 13 (Node 12345) - 23 crashes</option>
     */
    function populate(selectId, opts) {
        opts = opts || {};
        var select = document.getElementById(selectId);
        if (!select) return Promise.resolve(null);

        var placeholder = opts.placeholder || '-- Select a route or intersection --';
        select.innerHTML = '<option value="">Loading locations…</option>';
        select.disabled = true;

        return fetchLocations(opts).then(function (rows) {
            if (!rows) {
                select.innerHTML = '<option value="">Failed to load — reload page</option>';
                select.disabled = false;
                return null;
            }
            select.innerHTML = '<option value="">' + _escapeHtml(placeholder) + '</option>';

            var showCount = opts.showCrashCount !== false;
            var segments      = rows.filter(function (r) { return r.location_type === 'segment'; });
            var intersections = rows.filter(function (r) { return r.location_type === 'intersection'; });

            function buildOption(r) {
                var o = document.createElement('option');
                if (r.location_type === 'segment') {
                    o.value = 'route:' + r.location_name;
                    o.textContent = showCount
                        ? r.display_name + ' (' + r.total_crashes + ' crashes)'
                        : r.display_name;
                } else {
                    o.value = 'node:' + r.location_name;
                    var nodeId = r.node_id || r.location_name;
                    var label  = r.display_name + ' (Node ' + nodeId + ')';
                    o.textContent = showCount ? label + ' - ' + r.total_crashes + ' crashes' : label;
                }
                if (r.lat != null) o.dataset.lat = r.lat;
                if (r.lon != null) o.dataset.lon = r.lon;
                if (r.total_crashes != null) o.dataset.total = r.total_crashes;
                return o;
            }

            if (opts.locationType === 'segment') {
                segments.forEach(function (r) { select.appendChild(buildOption(r)); });
            } else if (opts.locationType === 'intersection') {
                intersections.forEach(function (r) { select.appendChild(buildOption(r)); });
            } else if (opts.useOptgroups !== false) {
                if (segments.length) {
                    var sg = document.createElement('optgroup');
                    sg.label = opts.segmentLabel || '🛣️ Road Segments';
                    segments.forEach(function (r) { sg.appendChild(buildOption(r)); });
                    select.appendChild(sg);
                }
                if (intersections.length) {
                    var ig = document.createElement('optgroup');
                    ig.label = opts.intersectionLabel || '🚦 Intersections';
                    intersections.forEach(function (r) { ig.appendChild(buildOption(r)); });
                    select.appendChild(ig);
                }
            } else {
                segments.forEach(function (r) { select.appendChild(buildOption(r)); });
                intersections.forEach(function (r) { select.appendChild(buildOption(r)); });
            }

            select.disabled = false;
            if (typeof opts.onPopulated === 'function') {
                try { opts.onPopulated(rows); } catch (e) { /* non-fatal */ }
            }
            return rows;
        });
    }

    /**
     * Resolve a "node:12345" / "route:US 13" dropdown value to the matching
     * row from any cached fetchLocations result. Returns null if not cached.
     */
    function resolveValue(value) {
        if (!value) return null;
        var i = value.indexOf(':');
        if (i < 0) return null;
        var kind = value.slice(0, i);    // 'node' | 'route'
        var name = value.slice(i + 1);
        var iter = CACHE.values();
        var step = iter.next();
        while (!step.done) {
            var rows = step.value.rows;
            for (var j = 0; j < rows.length; j++) {
                var r = rows[j];
                if (kind === 'node'  && r.location_type === 'intersection' && r.location_name === name) return r;
                if (kind === 'route' && r.location_type === 'segment'      && r.location_name === name) return r;
            }
            step = iter.next();
        }
        return null;
    }

    var _registered = new Map();   // selectId → opts

    function register(selectId, opts) {
        _registered.set(selectId, opts || {});
        return populate(selectId, opts || {});
    }

    function refreshAll() {
        CACHE.clear();
        var iter = _registered.entries();
        var step = iter.next();
        while (!step.done) {
            populate(step.value[0], step.value[1]);
            step = iter.next();
        }
    }

    global.LocationPicker = {
        populate:       populate,
        fetchLocations: fetchLocations,
        resolveValue:   resolveValue,
        register:       register,
        refreshAll:     refreshAll
    };

    // Round 13 — every LocationPicker dropdown re-fetches when tier or
    // road-type changes. Listening at module scope keeps the wiring
    // colocated with the picker rather than scattered through index.html.
    document.addEventListener('tierChanged',         refreshAll);
    document.addEventListener('jurisdictionChanged', refreshAll);
    document.addEventListener('roadTypeChanged',     refreshAll);
})(window);
