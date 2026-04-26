/**
 * Supabase Map Bridge — Phase 3
 *
 * Manages zoom-aware viewport queries from Supabase for the Leaflet map.
 * Renders clusters at low zoom, individual points at high zoom.
 *
 * Rules:
 *   - Writes ONLY to Leaflet layers (markerCluster, markersLayer, heatLayer).
 *   - Never mutates crashState.mapPoints or crashState.aggregates.
 *   - Falls back to existing getFilteredMapPoints() if Supabase unavailable.
 *   - All failures are swallowed (non-fatal try/catch).
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

CL.data.mapBridge = (function () {
    'use strict';

    // ── Config ──────────────────────────────────────────────
    var DEBOUNCE_MS = 400;          // ms after last pan/zoom before firing query
    var _enabled = false;           // set true when Supabase client is available
    var _debounceTimer = null;
    var _abortController = null;    // abort in-flight fetch on new pan/zoom
    var _clusterLayer = null;       // legacy layerGroup, kept for backwards-compat clearLayers()
    var _lastZoom = null;
    var _lastBounds = null;
    var _totalInViewport = 0;       // total crash count from clusters (for stats overlay)

    // ── Severity colors (match createMarker) ────────────────
    var SEV_COLORS = { K: '#dc2626', A: '#ea580c', B: '#eab308', C: '#22c55e', O: '#64748b' };

    // ── Public API ──────────────────────────────────────────

    /**
     * Initialize: attach moveend/zoomend listeners to crashMap.
     * Call this ONCE after initMap() creates the Leaflet map.
     */
    function attach() {
        if (typeof crashMap === 'undefined' || !crashMap) {
            console.warn('[MapBridge] crashMap not ready, skipping attach');
            return;
        }
        if (!window.crashLensClient || typeof window.crashLensClient.getViewportCrashes !== 'function') {
            console.log('[MapBridge] No Supabase client with getViewportCrashes, disabled');
            return;
        }

        _enabled = true;
        _clusterLayer = L.layerGroup().addTo(crashMap);

        crashMap.on('moveend', _onMapMove);
        crashMap.on('zoomend', _onMapMove);

        console.log('[MapBridge] Attached viewport query listeners');
    }

    /**
     * Detach: remove listeners and clean up.
     * Call this from resetState() before crashMap.remove().
     */
    function detach() {
        if (typeof crashMap !== 'undefined' && crashMap) {
            crashMap.off('moveend', _onMapMove);
            crashMap.off('zoomend', _onMapMove);
        }
        if (_debounceTimer) clearTimeout(_debounceTimer);
        if (_abortController) _abortController.abort();
        if (_clusterLayer) { _clusterLayer.clearLayers(); _clusterLayer = null; }
        _enabled = false;
        _lastZoom = null;
        _lastBounds = null;
        _totalInViewport = 0;
        console.log('[MapBridge] Detached');
    }

    /**
     * Force a refresh (e.g., after filter change).
     * Resets debounce and fires immediately.
     */
    function refresh() {
        if (!_enabled) return;
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _fetchViewport();
    }

    /**
     * Check if map bridge is active and handling rendering.
     * When true, the legacy updateMapDisplay() should skip its own rendering
     * but still update the stats overlay.
     */
    function isActive() {
        return _enabled;
    }

    /**
     * Get the total crash count visible in the current viewport.
     * Used by the stats overlay.
     */
    function getViewportTotal() {
        return _totalInViewport;
    }

    // ── Internal ────────────────────────────────────────────

    function _onMapMove() {
        if (!_enabled) return;
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _debounceTimer = setTimeout(_fetchViewport, DEBOUNCE_MS);
    }

    async function _fetchViewport() {
        if (!crashMap || !_enabled) return;

        // Abort any in-flight request
        if (_abortController) _abortController.abort();
        _abortController = new AbortController();

        var zoom = crashMap.getZoom();
        var b = crashMap.getBounds();
        var bounds = {
            south: b.getSouth(),
            west:  b.getWest(),
            north: b.getNorth(),
            east:  b.getEast()
        };

        // Build filter options from current UI state and attach abort signal
        var opts = _buildFilterOpts();
        opts.signal = _abortController.signal;

        try {
            var rows = await window.crashLensClient.getViewportCrashes(bounds, zoom, opts);
            if (!Array.isArray(rows)) return;

            _renderResults(rows, zoom);
            _updateStatsOverlay(rows);

            _lastZoom = zoom;
            _lastBounds = bounds;

            // Keep drawing selection in sync
            if (typeof refreshDrawingSelectionIfActive === 'function') {
                refreshDrawingSelectionIfActive();
            }
        } catch (e) {
            if (e.name === 'AbortError') return; // Superseded by newer request
            console.warn('[MapBridge] Viewport fetch failed:', e.message);
        }
    }

    function _buildFilterOpts() {
        // Resolve tier from jurisdictionContext
        var tier = null, tierValue = null;
        if (CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function') {
            var t = CL.data.supabaseBridge.resolveTier();
            tier = t.tier;
            tierValue = t.value;
        } else if (typeof jurisdictionContext !== 'undefined' && jurisdictionContext) {
            var ctx = jurisdictionContext;
            var vt = ctx.viewTier || 'county';
            if (vt === 'state' || vt === 'federal') { tier = 'state'; tierValue = null; }
            else if (vt === 'region') { tier = 'region'; tierValue = ctx.tierRegion && ctx.tierRegion.name; }
            else if (vt === 'mpo') { tier = 'mpo'; tierValue = ctx.tierMpo && ctx.tierMpo.name; }
            else if (vt === 'planning_district') { tier = 'planning_district'; tierValue = ctx.tierPlanningDistrict && ctx.tierPlanningDistrict.name; }
            else { tier = 'county'; tierValue = ctx.jurisdictionName || null; }
        }

        // Read map filter UI
        var yearEl = document.getElementById('mapYearFilter');
        var year = (yearEl && yearEl.value) ? parseInt(yearEl.value, 10) : null;

        var severity = null;
        if (typeof currentFilters !== 'undefined' && currentFilters.severity) {
            // Only send severity filter if not all severities selected
            if (currentFilters.severity.length < 5) {
                severity = currentFilters.severity;
            }
        }

        return { tier: tier, tierValue: tierValue, year: year, severity: severity };
    }

    // ── Rendering ───────────────────────────────────────────

    function _renderResults(rows, zoom) {
        // Clear all existing crash layers (own layer + shared globals)
        if (_clusterLayer) _clusterLayer.clearLayers();
        if (typeof markerCluster !== 'undefined' && markerCluster) markerCluster.clearLayers();
        if (typeof markersLayer !== 'undefined' && markersLayer) markersLayer.clearLayers();
        if (typeof heatLayer !== 'undefined' && heatLayer && crashMap) {
            crashMap.removeLayer(heatLayer);
            heatLayer = null;
        }

        var isHeatMode = (typeof currentMapMode !== 'undefined' && currentMapMode === 'heat');

        // ── HEAT MODE ──
        if (isHeatMode) {
            var heatData = [];
            for (var i = 0; i < rows.length; i++) {
                var hr = rows[i];
                if (hr.is_cluster) {
                    // Weight cluster center by sqrt(count); blend KA ratio for intensity
                    var kaRatio = (hr.fatals + hr.serious) / Math.max(hr.n, 1);
                    var intensity = Math.min(1.0, 0.3 + kaRatio * 0.7);
                    heatData.push([hr.cy, hr.cx, intensity * Math.sqrt(hr.n)]);
                } else {
                    var ptI = hr.crash_severity === 'K' ? 1.0 :
                              hr.crash_severity === 'A' ? 0.8 :
                              hr.crash_severity === 'B' ? 0.5 : 0.3;
                    heatData.push([hr.cy, hr.cx, ptI]);
                }
            }
            if (typeof L !== 'undefined' && L.heatLayer && heatData.length) {
                heatLayer = L.heatLayer(heatData, {
                    radius: 20, blur: 15, maxZoom: 17,
                    gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.8: '#ef4444', 1.0: '#dc2626' }
                }).addTo(crashMap);
            }
            return;
        }

        // ── CLUSTER MODE — feed everything into the shared L.markerClusterGroup
        // (`markerCluster`) so aggregate-tier clusters look identical to county
        // tier (same green/yellow/red bubbles with count labels). For server-
        // side cluster cells, expand into synthetic markers with jitter so the
        // client-side cluster plugin re-clusters them at appropriate zooms.
        if (typeof markerCluster === 'undefined' || !markerCluster) return;

        // Cap synthetic markers per server cluster for performance.
        // 200 × ~50 grid cells ≈ 10K markers — well within markerCluster limits.
        var SYN_CAP = 200;

        for (var j = 0; j < rows.length; j++) {
            var row = rows[j];
            if (row.is_cluster) {
                var n = Math.max(row.n, 1);
                var cap = Math.min(n, SYN_CAP);
                var fatalFrac = row.fatals / n;
                var seriousFrac = (row.fatals + row.serious) / n;
                for (var k = 0; k < cap; k++) {
                    var jLat = row.cy + (Math.random() - 0.5) * 0.005;
                    var jLng = row.cx + (Math.random() - 0.5) * 0.005;
                    var frac = k / cap;
                    var sev = (frac < fatalFrac) ? 'K'
                            : (frac < seriousFrac) ? 'A'
                            : 'O';
                    markerCluster.addLayer(_createSyntheticMarker(jLat, jLng, sev));
                }
            } else {
                markerCluster.addLayer(_createPointMarker(row));
            }
        }

        if (markerCluster.getLayers().length > 0) {
            crashMap.addLayer(markerCluster);
        }
    }

    /**
     * Minimal marker for synthetic expansion of a server-side cluster cell.
     * Visual matches createMarker() in app/index.html so both rendering paths
     * produce identical-looking individual crash dots.
     */
    function _createSyntheticMarker(lat, lng, sev) {
        var color = SEV_COLORS[sev] || SEV_COLORS.O;
        var size = sev === 'K' ? 14 : sev === 'A' ? 12 : 10;
        var icon = L.divIcon({
            html: '<div style="background:' + color + ';width:' + size +
                  'px;height:' + size + 'px;border-radius:50%;border:2px solid #fff;' +
                  'box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>',
            className: '',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });
        return L.marker([lat, lng], { icon: icon });
    }

    /**
     * Create an individual crash marker from a Supabase point row.
     * Matches the existing createMarker(p) visual style.
     */
    function _createPointMarker(row) {
        var sev = (row.crash_severity || 'O').charAt(0).toUpperCase();
        var color = SEV_COLORS[sev] || SEV_COLORS.O;
        var size = sev === 'K' ? 14 : sev === 'A' ? 12 : 10;
        var isPed = row.pedestrian === 'Yes';
        var isBike = row.bike === 'Yes';

        var borderColor = isPed ? '#0891b2' : isBike ? '#059669' : '#fff';

        var iconHtml = '<div style="background:' + color + ';width:' + size + 'px;height:' + size +
            'px;border-radius:50%;border:2px solid ' + borderColor +
            ';box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>';

        var icon = L.divIcon({
            html: iconHtml, className: '',
            iconSize: [size, size], iconAnchor: [size / 2, size / 2]
        });

        var marker = L.marker([row.cy, row.cx], { icon: icon });

        // Set crashData for district filter compatibility (fixes pre-existing bug)
        marker.crashData = row;

        // Build popup (matches existing createMarker template)
        var routeDisplay = row.rte_name || 'Unknown Route';
        if (typeof formatRouteName === 'function') routeDisplay = formatRouteName(routeDisplay);
        var nodeDisplay = row.intersection_name || '';
        if (typeof formatNodeId === 'function' && nodeDisplay) nodeDisplay = formatNodeId(nodeDisplay);
        var timeDisplay = row.crash_military_time || '--';
        if (typeof fmtTime === 'function') timeDisplay = fmtTime(row.crash_military_time);
        var escFn = (typeof esc === 'function') ? esc : function(s) { return s || ''; };

        var popupHtml =
            '<div style="font-size:12px;min-width:220px">' +
            '<strong style="font-size:13px;color:#1e40af">' + escFn(routeDisplay) + '</strong><br>' +
            '<span style="color:#94a3b8;font-size:10px">' + escFn(row.rte_name || '') + '</span><br>' +
            (nodeDisplay ? '<span style="color:#64748b">Node: ' + escFn(nodeDisplay) + '</span><br>' : '') +
            '<span class="severity-badge severity-' + sev + '" style="margin:4px 0;display:inline-block">' + sev + '</span>' +
            (isPed ? '<span style="margin-left:4px">🚶</span>' : '') +
            (isBike ? '<span style="margin-left:4px">🚴</span>' : '') + '<br>' +
            (row.document_nbr ? '<strong>Doc #:</strong> ' + escFn(row.document_nbr) + '<br>' : '') +
            '<strong>Date:</strong> ' + escFn(row.crash_date || '--') + '<br>' +
            '<strong>Time:</strong> ' + escFn(timeDisplay) + '<br>' +
            '<strong>Type:</strong> ' + escFn((row.collision_type || '').substring(0, 35)) + '<br>' +
            '<strong>Weather:</strong> ' + escFn((row.weather_condition || '').substring(0, 25)) + '<br>' +
            '<strong>Light:</strong> ' + escFn((row.light_condition || '').substring(0, 25)) + '<br>' +
            '<button class="btn-soft btn-soft-success" onclick="viewLocationCMF(\'' + escFn(row.rte_name || '') + '\')"' +
            '    style="margin-top:8px;width:100%;padding:6px 12px;font-size:11px;font-weight:500">' +
            '💡 CMF</button>' +
            '<button class="btn-soft btn-soft-info" onclick="openStreetView(' + row.cy + ', ' + row.cx + ')"' +
            '    style="margin-top:4px;width:100%;padding:6px 12px;font-size:11px;font-weight:500">' +
            '🛣️ Street View</button>' +
            (isPed ? '<button class="btn-soft btn-soft-purple" onclick="openCrossingEvalModal()"' +
            '    style="margin-top:4px;width:100%;padding:6px 12px;font-size:11px;font-weight:500">' +
            '📋 Crossing Eval</button>' : '') +
            '</div>';

        marker.bindPopup(popupHtml);
        return marker;
    }

    /**
     * Update the map stats overlay with data from viewport results.
     */
    function _updateStatsOverlay(rows) {
        var stats = { total: 0, fatal: 0, serious: 0, epdo: 0 };
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            stats.total  += r.n || 0;
            stats.fatal  += r.fatals || 0;
            stats.serious += r.serious || 0;
            stats.epdo   += r.epdo || 0;
        }
        _totalInViewport = stats.total;

        var el;
        el = document.getElementById('mapCount');   if (el) el.textContent = stats.total.toLocaleString();
        el = document.getElementById('mapFatal');   if (el) el.textContent = stats.fatal;
        el = document.getElementById('mapSerious'); if (el) el.textContent = stats.serious;
        el = document.getElementById('mapEPDO');    if (el) el.textContent = stats.epdo.toLocaleString();

        // Show "viewport" label instead of "of Y" since we're showing viewport data
        el = document.getElementById('mapOfTotal'); if (el) el.textContent = '(viewport)';
        el = document.getElementById('mapMissingRow'); if (el) el.style.display = 'none';
    }

    // ── Public interface ────────────────────────────────────
    return {
        attach:             attach,
        detach:             detach,
        refresh:            refresh,
        isActive:           isActive,
        getViewportTotal:   getViewportTotal,

        // Expose resolveTier for reuse (delegates to Phase 2 bridge)
        _buildFilterOpts:   _buildFilterOpts
    };

})();

CL._registerModule('data/mapBridge');
