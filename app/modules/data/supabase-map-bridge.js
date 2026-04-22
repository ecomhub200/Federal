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
    var CLUSTER_BUBBLE_MIN = 16;    // min bubble size (px) for cluster markers
    var CLUSTER_BUBBLE_MAX = 60;    // max bubble size (px)
    var _enabled = false;           // set true when Supabase client is available
    var _debounceTimer = null;
    var _abortController = null;    // abort in-flight fetch on new pan/zoom
    var _clusterLayer = null;       // L.layerGroup for cluster bubbles
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

        // Build filter options from current UI state
        var opts = _buildFilterOpts();

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
        // Clear all existing crash layers
        if (_clusterLayer) _clusterLayer.clearLayers();
        if (typeof markerCluster !== 'undefined' && markerCluster) markerCluster.clearLayers();
        if (typeof markersLayer !== 'undefined' && markersLayer) markersLayer.clearLayers();
        if (typeof heatLayer !== 'undefined' && heatLayer && crashMap) {
            crashMap.removeLayer(heatLayer);
            heatLayer = null;
        }

        var hasClusters = false;
        var hasPoints = false;
        var clusterMarkers = [];
        var pointMarkers = [];

        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (r.is_cluster) {
                hasClusters = true;
                clusterMarkers.push(r);
            } else {
                hasPoints = true;
                pointMarkers.push(r);
            }
        }

        // Render cluster bubbles
        if (hasClusters) {
            var maxN = 1;
            for (var j = 0; j < clusterMarkers.length; j++) {
                if (clusterMarkers[j].n > maxN) maxN = clusterMarkers[j].n;
            }
            for (var k = 0; k < clusterMarkers.length; k++) {
                var c = clusterMarkers[k];
                var marker = _createClusterBubble(c, maxN);
                _clusterLayer.addLayer(marker);
            }
        }

        // Render individual points (use MarkerCluster for density management)
        if (hasPoints) {
            if (typeof currentMapMode !== 'undefined' && currentMapMode === 'heat') {
                var heatData = pointMarkers.map(function(r) {
                    var intensity = r.crash_severity === 'K' ? 1.0 :
                                    r.crash_severity === 'A' ? 0.8 :
                                    r.crash_severity === 'B' ? 0.5 : 0.3;
                    return [r.cy, r.cx, intensity];
                });
                if (typeof L !== 'undefined' && L.heatLayer) {
                    heatLayer = L.heatLayer(heatData, {
                        radius: 20, blur: 15, maxZoom: 17,
                        gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.8: '#ef4444', 1.0: '#dc2626' }
                    }).addTo(crashMap);
                }
            } else {
                for (var m = 0; m < pointMarkers.length; m++) {
                    var pm = pointMarkers[m];
                    var ptMarker = _createPointMarker(pm);
                    markerCluster.addLayer(ptMarker);
                }
                crashMap.addLayer(markerCluster);
            }
        }
    }

    /**
     * Create a proportional circle marker for a cluster cell.
     * Size is proportional to crash count; color is based on KA ratio.
     */
    function _createClusterBubble(cluster, maxN) {
        var ratio = Math.sqrt(cluster.n / maxN);  // sqrt scale for perceptual accuracy
        var size = Math.max(CLUSTER_BUBBLE_MIN, Math.round(ratio * CLUSTER_BUBBLE_MAX));

        // Color: proportion of fatal+serious
        var kaRatio = (cluster.fatals + cluster.serious) / Math.max(cluster.n, 1);
        var color;
        if (kaRatio > 0.15)      color = '#dc2626'; // red — high severity
        else if (kaRatio > 0.08) color = '#ea580c'; // orange
        else if (kaRatio > 0.03) color = '#eab308'; // yellow
        else                     color = '#22c55e'; // green — low severity

        var label = cluster.n >= 1000 ? Math.round(cluster.n / 1000) + 'K' : String(cluster.n);

        var icon = L.divIcon({
            html: '<div style="' +
                'width:' + size + 'px;height:' + size + 'px;' +
                'background:' + color + ';opacity:0.8;' +
                'border-radius:50%;border:2px solid #fff;' +
                'display:flex;align-items:center;justify-content:center;' +
                'color:#fff;font-size:' + Math.max(10, size / 4) + 'px;font-weight:700;' +
                'box-shadow:0 2px 6px rgba(0,0,0,0.3);' +
                'cursor:pointer;' +
                '">' + label + '</div>',
            className: '',
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
        });

        var marker = L.marker([cluster.cy, cluster.cx], { icon: icon });

        // Popup with cluster stats
        var popupHtml =
            '<div style="font-size:12px;min-width:180px">' +
            '<strong style="font-size:14px">' + cluster.n.toLocaleString() + ' Crashes</strong><br>' +
            '<span style="color:#dc2626">Fatal: ' + cluster.fatals + '</span> · ' +
            '<span style="color:#ea580c">Serious: ' + cluster.serious + '</span><br>' +
            '<strong>EPDO:</strong> ' + cluster.epdo.toLocaleString() + '<br>' +
            '<em style="color:#64748b;font-size:11px">Zoom in for individual crashes</em>' +
            '</div>';
        marker.bindPopup(popupHtml);

        // Click-to-zoom: zoom in 2 levels centered on this cluster
        marker.on('click', function(e) {
            if (crashMap.getZoom() < 13) {
                crashMap.setView([cluster.cy, cluster.cx], crashMap.getZoom() + 2);
            }
        });

        return marker;
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
