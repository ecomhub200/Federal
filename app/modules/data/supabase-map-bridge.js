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
'use strict';

// ── Config ──────────────────────────────────────────────
var DEBOUNCE_MS = 400;              // ms after last pan/zoom before firing query
var MAX_SYNTH_PER_CLUSTER = 200;    // cap synthetic markers per server-cluster
var _enabled = false;               // set true when Supabase client is available
var _debounceTimer = null;
var _abortController = null;        // abort in-flight fetch on new pan/zoom
var _lastZoom = null;
var _lastBounds = null;
var _totalInViewport = 0;           // total crash count from clusters (for stats overlay)
var _attachRetries = 0;             // Round-4 Patch 5 — retry counter for deferred attach
var _pendingMapReadyHandler = null; // Round 15 §12.11 — wait on crashlens:mapready event

// ── Severity colors (match createMarker) ────────────────
var SEV_COLORS = { K: '#dc2626', A: '#ea580c', B: '#eab308', C: '#22c55e', O: '#64748b' };

// ── Public API ──────────────────────────────────────────

/**
 * Initialize: attach moveend/zoomend listeners to crashMap.
 * Call this ONCE after initMap() creates the Leaflet map.
 */
export function attach() {
    // Round 15 §12.11 — prefer event-driven attachment over polling. If
    // crashMap isn't live yet, listen for the `crashlens:mapready` event
    // (dispatched by initMap after L.map() succeeds) and attach exactly
    // once it fires. Falls back to the original 5×250ms retry loop in
    // case the event was dispatched before this listener was wired (no
    // change to existing behavior in that hot path).
    if (typeof crashMap === 'undefined' || !crashMap) {
        if (!_pendingMapReadyHandler) {
            _pendingMapReadyHandler = function () {
                document.removeEventListener('crashlens:mapready', _pendingMapReadyHandler);
                _pendingMapReadyHandler = null;
                _attachRetries = 0;
                attach();
            };
            document.addEventListener('crashlens:mapready', _pendingMapReadyHandler, { once: true });
        }
        if (_attachRetries < 5) {
            _attachRetries += 1;
            console.log('[MapBridge] crashMap not ready, retrying in 250ms (attempt ' + _attachRetries + ')');
            setTimeout(attach, 250);
            return;
        }
        console.warn('[MapBridge] crashMap not ready after 5 retries; waiting on crashlens:mapready event.');
        _attachRetries = 0;
        return;
    }
    _attachRetries = 0;
    if (_pendingMapReadyHandler) {
        document.removeEventListener('crashlens:mapready', _pendingMapReadyHandler);
        _pendingMapReadyHandler = null;
    }
    if (!window.crashLensClient || typeof window.crashLensClient.getViewportCrashes !== 'function') {
        console.log('[MapBridge] No Supabase client with getViewportCrashes, disabled');
        return;
    }

    // Guard: detach first to prevent duplicate event listeners
    if (_enabled) {
        crashMap.off('moveend', _onMapMove);
        crashMap.off('zoomend', _onMapMove);
    }

    _enabled = true;

    crashMap.on('moveend', _onMapMove);
    crashMap.on('zoomend', _onMapMove);

    console.log('[MapBridge] Attached viewport query listeners');
}

/**
 * Detach: remove listeners and clean up.
 * Call this from resetState() before crashMap.remove().
 */
export function detach() {
    if (typeof crashMap !== 'undefined' && crashMap) {
        crashMap.off('moveend', _onMapMove);
        crashMap.off('zoomend', _onMapMove);
    }
    if (_debounceTimer) clearTimeout(_debounceTimer);
    if (_abortController) _abortController.abort();
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
export function refresh() {
    if (!_enabled) return;
    if (_debounceTimer) clearTimeout(_debounceTimer);
    _fetchViewport();
}

/**
 * Check if map bridge is active and handling rendering.
 * When true, the legacy updateMapDisplay() should skip its own rendering
 * but still update the stats overlay.
 */
export function isActive() {
    return _enabled;
}

/**
 * Get the total crash count visible in the current viewport.
 * Used by the stats overlay.
 */
export function getViewportTotal() {
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

export function _buildFilterOpts() {
    // Resolve tier from jurisdictionContext
    var tier = null, tierValue = null;
    if (CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function') {
        var t = CL.data.supabaseBridge.resolveTier();
        tier = t.tier;
        tierValue = t.value;
    } else if (typeof window.jurisdictionContext !== 'undefined' && window.jurisdictionContext) {
        var ctx = window.jurisdictionContext;
        var vt = ctx.viewTier || 'county';
        if (vt === 'federal') { tier = 'federal'; tierValue = null; }
        else if (vt === 'state') { tier = 'state'; tierValue = null; }
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

    // Road-type spec — pull from the Phase 2 bridge so the map honors the
    // same DOT/City/County/All radio the dashboard reads.  Falls back to
    // CrashLensDataClient.activeRoadType() when the bridge isn't ready
    // yet (e.g. during very early boot before supabase-bridge has loaded).
    var spec = {};
    try {
        if (CL.data && CL.data.supabaseBridge && typeof CL.data.supabaseBridge.roadTypeSpec === 'function') {
            spec = CL.data.supabaseBridge.roadTypeSpec() || {};
        } else if (typeof CrashLensDataClient !== 'undefined' && CrashLensDataClient.activeRoadType) {
            spec = CrashLensDataClient.activeRoadType(tier) || {};
        }
    } catch (e) { /* non-fatal */ }

    return {
        tier: tier,
        tierValue: tierValue,
        year: year,
        severity: severity,
        roadType: spec.roadType || null,
        roadTypes: spec.roadTypes || null,
        noInterstate: !!spec.noInterstate
    };
}

// ── Rendering ───────────────────────────────────────────

/**
 * Seeded pseudo-random for deterministic jitter (same cluster always
 * produces the same marker spread so the map doesn't flicker on pan).
 */
function _seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

/**
 * For a server-side cluster, create N synthetic lightweight markers
 * spread around the cluster center with small random jitter.
 * These get fed into the standard L.markerClusterGroup so the user
 * sees the familiar green/yellow/red Leaflet cluster bubbles —
 * identical to city/town tier map display.
 *
 * N is capped at MAX_SYNTH_PER_CLUSTER (200) to keep the DOM light.
 * The markerCluster's iconCreateFunction counts children and picks
 * small/medium/large automatically, so we just supply the points.
 */
function _synthMarkersForCluster(cluster) {
    var n = Math.min(cluster.n || 1, MAX_SYNTH_PER_CLUSTER);
    var markers = [];
    // Jitter radius scales with zoom — wider spread at low zoom so
    // markerCluster doesn't collapse everything into one mega-bubble
    var jitterDeg = 0.008;
    if (typeof crashMap !== 'undefined' && crashMap) {
        var z = crashMap.getZoom();
        if (z >= 12) jitterDeg = 0.001;
        else if (z >= 9) jitterDeg = 0.004;
    }

    // Distribute severity proportionally so cluster color reflects KA ratio
    var sevPool = [];
    var fatals = cluster.fatals || 0;
    var serious = cluster.serious || 0;
    var rest = n - fatals - serious;
    if (rest < 0) { fatals = Math.round(n * 0.5); serious = n - fatals; rest = 0; }
    for (var f = 0; f < fatals; f++) sevPool.push('K');
    for (var a = 0; a < serious; a++) sevPool.push('A');
    for (var r = 0; r < rest; r++) sevPool.push('O');

    for (var i = 0; i < n; i++) {
        var seed = cluster.cy * 1000 + cluster.cx * 1000 + i;
        var dLat = ((_seededRandom(seed) - 0.5) * 2) * jitterDeg;
        var dLng = ((_seededRandom(seed + 999) - 0.5) * 2) * jitterDeg;
        var lat = cluster.cy + dLat;
        var lng = cluster.cx + dLng;
        var sev = sevPool[i] || 'O';
        var color = SEV_COLORS[sev] || SEV_COLORS.O;
        var sz = sev === 'K' ? 14 : sev === 'A' ? 12 : 10;

        var icon = L.divIcon({
            html: '<div style="background:' + color + ';width:' + sz + 'px;height:' + sz +
                'px;border-radius:50%;border:2px solid #fff;' +
                'box-shadow:0 1px 3px rgba(0,0,0,.4)"></div>',
            className: '',
            iconSize: [sz, sz],
            iconAnchor: [sz / 2, sz / 2]
        });

        var m = L.marker([lat, lng], { icon: icon });
        m.crashData = { crash_severity: sev, cy: lat, cx: lng };
        markers.push(m);
    }
    return markers;
}

function _renderResults(rows, zoom) {
    // Clear all existing crash layers — we'll repopulate markerCluster
    if (typeof markerCluster !== 'undefined' && markerCluster) markerCluster.clearLayers();
    if (typeof markersLayer !== 'undefined' && markersLayer) markersLayer.clearLayers();
    if (typeof heatLayer !== 'undefined' && heatLayer && crashMap) {
        crashMap.removeLayer(heatLayer);
        heatLayer = null;
    }

    var allMarkers = [];
    var heatData = [];
    var isHeat = (typeof currentMapMode !== 'undefined' && currentMapMode === 'heat');

    // For Heatmap mode, normalize cluster intensity by max cluster size so
    // dense areas register visibly even when the K+A ratio is small.
    var maxClusterCount = 1;
    if (isHeat) {
        for (var mi = 0; mi < rows.length; mi++) {
            if (rows[mi].is_cluster && rows[mi].n > maxClusterCount) {
                maxClusterCount = rows[mi].n;
            }
        }
    }

    for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        if (r.is_cluster) {
            if (isHeat) {
                // Weight by cluster size (n / maxN) so density is visible
                var sizeWeight = Math.min(1.0, r.n / maxClusterCount);
                var sevWeight = ((r.fatals || 0) + (r.serious || 0)) / Math.max(r.n, 1);
                var intensity = Math.max(sizeWeight, sevWeight, 0.3);
                heatData.push([r.cy, r.cx, intensity]);
            } else {
                var synth = _synthMarkersForCluster(r);
                for (var s = 0; s < synth.length; s++) allMarkers.push(synth[s]);
            }
        } else {
            if (isHeat) {
                var ptIntensity = r.crash_severity === 'K' ? 1.0 :
                                  r.crash_severity === 'A' ? 0.8 :
                                  r.crash_severity === 'B' ? 0.5 : 0.3;
                heatData.push([r.cy, r.cx, ptIntensity]);
            } else {
                allMarkers.push(_createPointMarker(r));
            }
        }
    }

    if (isHeat && heatData.length > 0) {
        if (typeof L !== 'undefined' && L.heatLayer) {
            heatLayer = L.heatLayer(heatData, {
                radius: 25, blur: 18, maxZoom: 17, minOpacity: 0.4,
                gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.8: '#ef4444', 1.0: '#dc2626' }
            }).addTo(crashMap);
        }
    } else if (allMarkers.length > 0 && typeof markerCluster !== 'undefined' && markerCluster) {
        // Feed everything into the STANDARD L.markerClusterGroup.
        // Its iconCreateFunction (defined in index.html initMap) picks
        // small/medium/large CSS classes → green/yellow/red bubbles
        // identical to city/town tier.
        markerCluster.addLayers(allMarkers);
        if (!crashMap.hasLayer(markerCluster)) {
            crashMap.addLayer(markerCluster);
        }
    }
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
    // Bug fix (round 3, 2026-05-08): K+A Combined + KA Rate added to Stats
    // panel (matches Dashboard naming). Computed from fatal + serious.
    var _ka = (stats.fatal || 0) + (stats.serious || 0);
    el = document.getElementById('mapKA');     if (el) el.textContent = _ka.toLocaleString();
    el = document.getElementById('mapKARate'); if (el) el.textContent = (stats.total > 0 ? ((_ka / stats.total) * 100).toFixed(1) : '0.0') + '%';

    // Show "viewport" label instead of "of Y" since we're showing viewport data
    el = document.getElementById('mapOfTotal'); if (el) el.textContent = '(viewport)';
    el = document.getElementById('mapMissingRow'); if (el) el.style.display = 'none';
}

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.data = CL.data || {};
CL.data.mapBridge = {
    attach:             attach,
    detach:             detach,
    refresh:            refresh,
    isActive:           isActive,
    getViewportTotal:   getViewportTotal,

    // Expose resolveTier for reuse (delegates to Phase 2 bridge)
    _buildFilterOpts:   _buildFilterOpts
};

CL._registerModule('data/mapBridge');
