/**
 * CL spatial.federalBoundaries module
 *
 * Extracted from app/index.html (snapshot L22685-L22864) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/03-spatial-federal-boundaries.md.
 * Responsibility: Multi-state boundary rendering / color map.
 *
 * Public API (back-compat dual exposure) — public singleton ONLY; the
 * _buildColorMap/getActiveStates/render/remove helpers are private to the
 * arrow-IIFE (not in outer scope) and have 0 bare-global callers — do NOT
 * expose them (would ReferenceError on load; render/remove would also
 * pollute the global namespace):
 *   - window.FederalBoundaries → CL.spatial.FederalBoundaries
 *
 * Depends on (must load before this file): `spatial/boundary-service`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

const FederalBoundaries = (() => {
    'use strict';

    // Stable categorical palette — keeps each active state's tint consistent across reloads.
    const FILL_PALETTE = [
        '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6',
        '#06b6d4', '#ef4444', '#84cc16', '#f97316', '#14b8a6'
    ];
    // 50 US states + District of Columbia (FIPS '11'). Excludes territories
    // (PR '72', VI '78', GU '66', AS '60', MP '69') to keep the federal map
    // focused on the conventional 50-state view.
    const ALL_STATE_FIPS = [
        '01','02','04','05','06','08','09','10','11','12','13','15','16','17','18',
        '19','20','21','22','23','24','25','26','27','28','29','30','31','32','33',
        '34','35','36','37','38','39','40','41','42','44','45','46','47','48','49',
        '50','51','53','54','55','56'
    ];
    // Hard-coded fallback if _national/state_comparison.json is unavailable
    // (Colorado, Delaware, Virginia — currently onboarded states).
    const FALLBACK_ACTIVE_FIPS = ['08', '10', '51'];

    // Neutral styling for states without crash data — visible but de-emphasized
    // so the active (data-having) states stand out.
    const INACTIVE_STYLE = {
        color: '#94a3b8',     // slate-400 stroke
        weight: 1,
        fillColor: '#cbd5e1', // slate-300 fill
        fillOpacity: 0.08,
        opacity: 0.6
    };

    /**
     * Map a FIPS code to a palette color via index in the sorted active set.
     * Guarantees distinct colors for the first FILL_PALETTE.length (10) active
     * states and stable assignment across reloads (sort key = FIPS string).
     */
    function _buildColorMap(fipsArray) {
        const sorted = [...new Set(fipsArray.map(String))].sort();
        const map = {};
        sorted.forEach((fips, i) => {
            map[fips] = FILL_PALETTE[i % FILL_PALETTE.length];
        });
        return map;
    }

    /**
     * Resolve the list of states with onboarded crash data.
     * Tries _national/state_comparison.json first; falls back to a hard-coded
     * list. Returns an array of { fips, name, crashTotal } objects.
     */
    async function getActiveStates() {
        let comparison = null;
        try {
            if (typeof AggregateLoader !== 'undefined' && AggregateLoader.loadNational) {
                comparison = await AggregateLoader.loadNational();
            }
        } catch (e) {
            console.warn('[FederalBoundaries] state_comparison.json unavailable:', e.message);
        }

        const states = [];
        if (comparison?.states && Array.isArray(comparison.states)) {
            comparison.states.forEach(s => {
                const fips = String(s.fips || s.FIPS || '').padStart(2, '0');
                if (!fips || fips === '00') return;
                states.push({
                    fips,
                    name: s.name || s.NAME || '',
                    crashTotal: s.total || s.crashTotal || s.totalCrashes || null
                });
            });
        }

        if (states.length === 0) {
            FALLBACK_ACTIVE_FIPS.forEach(fips => states.push({ fips, name: '', crashTotal: null }));
        }
        return states;
    }

    /**
     * Fetch and render all 50 states + DC on the federal tier, color-coded by
     * which states have onboarded crash data. Idempotent — clears any existing
     * federal layer before redraw.
     */
    async function render() {
        if (typeof crashMap === 'undefined' || !crashMap) return null;
        if (typeof BoundaryService === 'undefined') return null;
        if (typeof L === 'undefined') return null;

        // Clear any prior federal layer first.
        remove();

        const activeStates = await getActiveStates();
        const activeFipsSet = new Set(activeStates.map(s => s.fips));
        const stateMeta = Object.fromEntries(activeStates.map(s => [s.fips, s]));
        const colorMap = _buildColorMap(activeStates.map(s => s.fips));

        let geojson;
        try {
            geojson = await BoundaryService.getMultipleStateOutlines(ALL_STATE_FIPS);
        } catch (e) {
            console.error('[FederalBoundaries] TIGERweb fetch failed:', e);
            return null;
        }
        if (!geojson?.features?.length) {
            console.warn('[FederalBoundaries] TIGERweb returned no features for federal view');
            return null;
        }

        let layer;
        try {
            layer = L.geoJSON(geojson, {
                pane: 'jurisdictionBoundaryPane',
                style: (feature) => {
                    const fips = feature?.properties?.STATE || feature?.properties?.GEOID || '';
                    if (activeFipsSet.has(fips)) {
                        return {
                            color: '#1e40af',
                            weight: 2,
                            fillColor: colorMap[fips] || FILL_PALETTE[0],
                            fillOpacity: 0.18,
                            opacity: 0.95
                        };
                    }
                    return INACTIVE_STYLE;
                },
                onEachFeature: (feature, lyr) => {
                    const props = feature.properties || {};
                    const fips = props.STATE || props.GEOID || '';
                    const name = props.NAME || stateMeta[fips]?.name || 'State';
                    const isActive = activeFipsSet.has(fips);
                    const meta = stateMeta[fips];

                    const statusLine = isActive
                        ? `<div style="font-size:0.75rem;color:#1e40af;font-weight:600;margin-top:0.15rem;">Crash data available</div>`
                        : `<div style="font-size:0.75rem;color:#94a3b8;margin-top:0.15rem;">No crash data</div>`;
                    const crashLine = (isActive && meta && meta.crashTotal != null)
                        ? `<div style="font-size:0.8rem;color:#444;margin-top:0.25rem;">${Number(meta.crashTotal).toLocaleString()} crashes</div>`
                        : '';
                    lyr.bindPopup(`
                        <div style="text-align:center;padding:0.5rem;min-width:160px;">
                            <div style="font-weight:600;font-size:0.95rem;">${name}</div>
                            <div style="font-size:0.75rem;color:#666;">FIPS ${fips}</div>
                            ${statusLine}
                            ${crashLine}
                            <div style="font-size:0.7rem;color:#888;margin-top:0.35rem;">Source: US Census TIGERweb</div>
                        </div>
                    `);
                }
            });
            layer.addTo(crashMap);
            builtInLayersState._federalStatesLayer = layer;
        } catch (e) {
            console.error('[FederalBoundaries] Layer construction failed:', e);
            return null;
        }

        try {
            safeFlyToBounds(crashMap, layer.getBounds(), { padding: [40, 40], duration: 1.2, maxZoom: 5 });
        } catch (e) {
            safeFlyTo(crashMap, [39.5, -98.35], 4, { duration: 1.2 });
        }
        console.log(`[FederalBoundaries] Rendered ${geojson.features.length} state outlines (${activeFipsSet.size} active, ${geojson.features.length - activeFipsSet.size} context)`);
        return layer;
    }

    function remove() {
        if (builtInLayersState._federalStatesLayer && typeof crashMap !== 'undefined' && crashMap) {
            try { crashMap.removeLayer(builtInLayersState._federalStatesLayer); } catch (e) { /* noop */ }
            builtInLayersState._federalStatesLayer = null;
        }
    }

    return { render, remove, getActiveStates };
})();

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.FederalBoundaries = FederalBoundaries; CL.spatial.FederalBoundaries = FederalBoundaries;
  CL._registerModule('spatial/federal-boundaries');
})();
