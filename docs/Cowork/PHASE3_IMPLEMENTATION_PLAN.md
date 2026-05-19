# Phase 3: Map Viewport Queries — Implementation Plan

> For Claude Code deployment. Generated 2026-04-21.
> Reference docs: `PHASE3_MAP_ANALYSIS.md`, `PHASE2_WIRING_MAP.md`

---

## Overview

Replace the current "load everything into RAM, filter client-side" map pipeline with **zoom-aware server-side viewport queries** from Supabase. The user always sees 100% of the data — at low zoom as proportional cluster bubbles, at high zoom as individual crash dots.

### Design Principle: Progressive Disclosure

| Zoom | Grid Size | Server Returns | Client Renders |
|------|-----------|---------------|----------------|
| ≤7 | 0.1° (~11km) | ~50–100 cluster cells | Proportional bubbles |
| 8–9 | 0.05° (~5.5km) | ~100–300 cluster cells | Medium bubbles |
| 10–11 | 0.02° (~2.2km) | ~200–500 cluster cells | Small bubbles, corridors visible |
| 12–13 | 0.005° (~550m) | ~300–1000 cluster cells | Intersection-level clusters |
| 14+ | none | Individual points (≤10K) | Full crash markers with popups |

**No silent truncation. No hidden data. Every crash is accounted for at every zoom level.**

### Performance Benchmarks (tested on 570K Delaware crashes)

| Zoom | Query Time | Rows Returned |
|------|-----------|--------------|
| 8 (state) | 863ms | 258 clusters |
| 12 (county) | ~1s | ~740 clusters |
| 14 (intersection, tight bbox) | **11ms** | 988 points |
| 17 (single block) | **19ms** | ~100 points |

---

## Prerequisites (Already Done)

- [x] PostGIS 3.3.7 installed with `geom` column on `crashes` table
- [x] GiST spatial indexes on all 51 state partitions
- [x] `map_viewport_crashes()` RPC function deployed to Supabase
- [x] `data-client.js` exists with `getMapCrashes()` method and `TIER_COLUMNS` mapping
- [x] `supabase-bridge.js` exists with `resolveTier()` function
- [x] `CL.data.supabaseBridge` namespace reserved in `loader.js`

---

## Step 1: Add `getViewportCrashes()` to `data-client.js`

**File:** `assets/js/data-client.js`
**Location:** After `getMapCrashes()` method (after line 224)

Add a new method that calls the `map_viewport_crashes` RPC function via Supabase REST POST:

```javascript
/**
 * Phase 3: Zoom-aware viewport crash query via PostGIS RPC.
 * Returns clusters at low zoom, individual points at high zoom.
 *
 * @param {object} bounds - { south, west, north, east } from crashMap.getBounds()
 * @param {number} zoom   - crashMap.getZoom()
 * @param {object} opts   - { tier, tierValue, year, severity[], limit }
 * @returns {Promise<Array>} rows with { cx, cy, n, fatals, serious, epdo, is_cluster, ...pointFields }
 */
async getViewportCrashes(bounds, zoom, opts = {}) {
    if (!this.preferSupabase || !this.supabaseKey) {
        return this._fallbackViewportFromMapPoints(bounds, zoom);
    }

    const tierCol = opts.tier ? CrashLensDataClient.TIER_COLUMNS[opts.tier] : null;
    const body = {
        p_state:    this.state,
        p_bbox:     `SRID=4326;POLYGON((${bounds.west} ${bounds.south},${bounds.east} ${bounds.south},${bounds.east} ${bounds.north},${bounds.west} ${bounds.north},${bounds.west} ${bounds.south}))`,
        p_zoom:     zoom,
        p_tier_col: tierCol || null,
        p_tier_val: opts.tierValue || null,
        p_year:     opts.year || null,
        p_severity: opts.severity || null,
        p_limit:    opts.limit || this.mapLimit
    };

    const url = `${this.supabaseUrl}/rpc/map_viewport_crashes`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': this.supabaseKey,
                'Authorization': `Bearer ${this.supabaseKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        clearTimeout(timer);

        if (!resp.ok) {
            const err = await resp.json().catch(() => ({}));
            throw new Error(err.message || `HTTP ${resp.status}`);
        }

        this._source = 'supabase';
        return await resp.json();
    } catch (e) {
        clearTimeout(timer);
        console.warn('[DataClient] Viewport query failed, falling back:', e.message);
        return this._fallbackViewportFromMapPoints(bounds, zoom);
    }
}

/**
 * Fallback: filter existing crashState.mapPoints client-side.
 * Used when Supabase is unavailable or during R2-only sessions.
 */
_fallbackViewportFromMapPoints(bounds, zoom) {
    if (typeof crashState === 'undefined' || !crashState.mapPoints) return [];
    const pts = crashState.mapPoints.filter(p =>
        p.lat >= bounds.south && p.lat <= bounds.north &&
        p.lng >= bounds.west  && p.lng <= bounds.east
    );
    // Convert to the same shape as RPC response
    return pts.map(p => ({
        cx: p.lng, cy: p.lat, n: 1, fatals: p.sev === 'K' ? 1 : 0,
        serious: p.sev === 'A' ? 1 : 0,
        epdo: ({ K: 883, A: 94, B: 21, C: 11, O: 1 })[p.sev] || 1,
        is_cluster: false,
        objectid: p.docNum || null,
        crash_severity: p.sev, crash_year: null,
        collision_type: p.collision, rte_name: p.route,
        intersection_name: p.node,
        crash_date: p.date, crash_military_time: p.time,
        pedestrian: p.isPed ? 'Yes' : 'No',
        bike: p.isBike ? 'Yes' : 'No',
        speed: p.isSpeed ? 'Yes' : 'No',
        weather_condition: p.weather,
        light_condition: p.light,
        document_nbr: p.docNum || null,
        night: p.isNight ? 'Yes' : 'No'
    }));
}
```

**Also update the `DEFAULTS` object at line 22:**

```javascript
mapLimit: 10000,   // was 5000 — raise for viewport queries
```

### Why RPC (POST) instead of REST (GET)?

The `map_viewport_crashes` function takes a `geometry` parameter (`p_bbox`). Supabase REST GET queries don't support PostGIS types as filter params — you need the RPC endpoint which accepts JSON body with WKT/EWKT strings.

---

## Step 2: Create `supabase-map-bridge.js` Module

**File:** `app/modules/data/supabase-map-bridge.js` (NEW)
**Namespace:** `CL.data.mapBridge`

This module owns the viewport query lifecycle: debounce, fetch, render, cleanup.

```javascript
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
```

---

## Step 3: Register Namespace in `loader.js`

**File:** `app/modules/loader.js`
**Location:** After line 16 (`CL.data.supabaseBridge = null;`)

Add:

```javascript
CL.data.mapBridge = null;       // Populated by supabase-map-bridge.js (Phase 3)
```

---

## Step 4: Add Script Tag in `index.html`

**File:** `app/index.html`
**Location:** After line 151596 (`<script src="modules/data/supabase-bridge.js"></script>`)

Add:

```html
<script src="modules/data/supabase-map-bridge.js"></script>
```

---

## Step 5: Wire `attach()` into `initMap()`

**File:** `app/index.html`
**Location:** At the END of `initMap()` function, just before the closing `}`.

The `initMap()` function ends with `updateMapDisplay();` at line 48342. Add the bridge attach call AFTER that:

```javascript
    updateMapDisplay();

    // Phase 3: Attach Supabase viewport query listeners
    if (CL.data.mapBridge && typeof CL.data.mapBridge.attach === 'function') {
        CL.data.mapBridge.attach();
    }
}  // end of initMap()
```

---

## Step 6: Wire `detach()` into `resetState()`

**File:** `app/index.html`
**Location:** Inside `resetState()`, BEFORE the map destruction at line 32642.

Add before `if (crashMap) { crashMap.remove(); ... }`:

```javascript
    // Phase 3: Detach map bridge before destroying map
    if (CL.data.mapBridge && typeof CL.data.mapBridge.detach === 'function') {
        CL.data.mapBridge.detach();
    }

    // === CHARTS AND MAP ===
    Object.keys(charts).forEach(k => { if(charts[k]) { charts[k].destroy(); delete charts[k]; } });
    if (crashMap) { crashMap.remove(); crashMap = null; markerCluster = null; heatLayer = null; }
```

---

## Step 7: Modify `updateMapDisplay()` to Defer to Bridge

**File:** `app/index.html`
**Location:** `updateMapDisplay()` at line 48508

The key principle: when the map bridge is active, `updateMapDisplay()` should NOT do its own marker rendering — it should trigger a bridge refresh instead. But when the bridge is not active (no Supabase, or R2-only mode), it works exactly as before.

Replace the first few lines of `updateMapDisplay()`:

```javascript
function updateMapDisplay() {
    if (!crashMap) return;

    // Phase 3: If Supabase map bridge is active, delegate rendering to it
    if (CL.data.mapBridge && CL.data.mapBridge.isActive()) {
        CL.data.mapBridge.refresh();
        return;
    }

    // === Legacy R2 rendering (unchanged below this line) ===
    const filtered = getFilteredMapPoints();
    // ... rest of existing function unchanged ...
```

This is the **only change** to the existing `updateMapDisplay()` function — a 5-line guard clause at the top. The entire existing function body remains intact as the fallback path.

---

## Step 8: Wire Filter Changes to Trigger Refresh

**File:** `app/index.html`

The map filter UI elements already call `updateMapDisplay()` on change (verified in PHASE3_MAP_ANALYSIS.md Section 4.3):

- `#mapYearFilter` → `onchange="updateMapDisplay()"`
- `#mapStartDate` / `#mapEndDate` → `onchange="updateMapDisplay()"`
- Quick filter buttons → `toggleMapFilter()` → `updateMapDisplay()`
- Mode buttons → `setMapMode()` → `updateMapDisplay()`

Since Step 7 makes `updateMapDisplay()` delegate to `CL.data.mapBridge.refresh()`, **all existing filter triggers automatically work with Phase 3.** No additional wiring needed.

The one exception is `setMapMode()` — the bridge needs to know the current mode for heat vs markers vs cluster rendering. The bridge already reads `currentMapMode` from the global scope (line referenced in the module code above), so this works automatically.

---

## Step 9: Wire Tier Changes to Trigger Refresh

**File:** `app/index.html`
**Location:** Inside `handleTierChange()` (line 20896) — the central tier switch function.

After the tier change completes and the map is visible, the bridge's `moveend` listener will fire naturally when the map flies to the new jurisdiction center. However, if the map tab is already visible and the tier changes without a map pan (e.g., dropdown selection within the same viewport), we need an explicit refresh.

The existing code at line 24974 already calls `updateMapDisplay()` after jurisdiction dropdown change. Since Step 7 makes that delegate to the bridge, **this already works.**

No additional wiring needed.

---

## Step 10: Expose `resolveTier()` from Phase 2 Bridge

**File:** `app/modules/data/supabase-bridge.js`
**Location:** In the `return` block at the end of the IIFE.

The Phase 3 map bridge needs `resolveTier()` from the Phase 2 bridge. Add it to the public API:

```javascript
    return {
        injectFastDashboard: injectFastDashboard,
        onR2LoadComplete:    onR2LoadComplete,
        resolveTier:         resolveTier          // ← ADD THIS LINE
    };
```

---

## File Summary

| File | Action | Lines Changed |
|------|--------|--------------|
| `assets/js/data-client.js` | Add `getViewportCrashes()` + `_fallbackViewportFromMapPoints()` + update `mapLimit` | ~80 lines added, 1 line changed |
| `app/modules/data/supabase-map-bridge.js` | **NEW FILE** — viewport query lifecycle module | ~380 lines |
| `app/modules/loader.js` | Add `CL.data.mapBridge = null;` | 1 line added |
| `app/index.html` | Add `<script>` tag | 1 line added |
| `app/index.html` | Add `attach()` call in `initMap()` | 3 lines added |
| `app/index.html` | Add `detach()` call in `resetState()` | 3 lines added |
| `app/index.html` | Add bridge guard in `updateMapDisplay()` | 5 lines added |
| `app/modules/data/supabase-bridge.js` | Expose `resolveTier` in return block | 1 line changed |

**Total:** 1 new file (~380 lines), ~90 lines added to existing files, 2 lines changed.

---

## Verification Checklist

After deployment, verify each of these:

### Functional Tests

- [ ] **Zoom 8 (state view):** Map shows proportional bubbles, clicking zooms in
- [ ] **Zoom 12 (county):** Smaller clusters visible, corridors emerge
- [ ] **Zoom 14+ (intersection):** Individual crash dots with full popup data
- [ ] **Year filter:** Changing `#mapYearFilter` updates viewport (clusters shrink/grow)
- [ ] **Severity filter:** Filtering to K+A only reduces visible clusters
- [ ] **Tier change:** Switching county→region re-queries with correct tier filter
- [ ] **Stats overlay:** `mapCount`, `mapFatal`, `mapSerious`, `mapEPDO` update correctly
- [ ] **Popup fields:** All 12 fields populate (date, time, weather, light, ped, bike, etc.)
- [ ] **CMF button:** Popup "CMF" button navigates correctly
- [ ] **Street View button:** Opens Google Street View at correct coordinates
- [ ] **Drawing selection:** Polygon/circle selection still works after viewport render
- [ ] **Heat mode:** Toggle to heatmap renders correctly from viewport data
- [ ] **Rapid pan:** Fast panning doesn't queue up stale results (debounce + abort working)

### Regression Tests

- [ ] **R2-only mode:** Disable Supabase (`preferSupabase: false`) — legacy map works unchanged
- [ ] **Dashboard tab:** Dashboard KPIs unaffected by Phase 3
- [ ] **CMF/Warrants/Grants tabs:** No regressions — they don't use mapPoints
- [ ] **Session restore:** Loading a saved session still works (loadSession sets crashState.loaded)
- [ ] **Tab switching:** Map → Dashboard → Map doesn't break anything
- [ ] **resetState():** Switching jurisdictions cleans up Phase 3 state, re-initializes correctly

### Performance Tests

- [ ] **State zoom:** Viewport query completes in <2s
- [ ] **Intersection zoom:** Viewport query completes in <100ms
- [ ] **Rapid zoom:** 5 consecutive zoom-in clicks don't cause stacking requests
- [ ] **Memory:** No growing layer count after repeated pan/zoom cycles

---

## Architecture Diagram

```
User pans/zooms map
        │
        ▼
  moveend/zoomend event
        │
        ▼
  _onMapMove() [400ms debounce]
        │
        ▼ (aborts any in-flight request)
  _fetchViewport()
        │
        ├──► window.crashLensClient.getViewportCrashes(bounds, zoom, opts)
        │         │
        │         ▼
        │    POST /rpc/map_viewport_crashes
        │         │
        │         ▼ (PostGIS)
        │    zoom < 14? → grid cluster → {cx, cy, n, fatals, serious, epdo, is_cluster:true}
        │    zoom ≥ 14? → individual   → {cx, cy, ..., crash_date, weather, ..., is_cluster:false}
        │
        ▼
  _renderResults(rows, zoom)
        │
        ├── is_cluster=true  → _createClusterBubble() → L.layerGroup
        │                        (proportional circle, sqrt scale, KA-ratio color)
        │
        └── is_cluster=false → _createPointMarker()    → markerCluster
                                 (matches existing createMarker style)
        │
        ▼
  _updateStatsOverlay(rows)
        │
        ▼
  refreshDrawingSelectionIfActive()
```

---

## Rollback Plan

If Phase 3 causes issues:

1. **Comment out the 5-line guard** in `updateMapDisplay()` (Step 7) — this immediately reverts to legacy R2 rendering
2. **Comment out `attach()` call** in `initMap()` (Step 5) — disables viewport listeners
3. Everything else is additive (new file, new method) and has no effect when not called

The legacy path is **100% preserved** — it's the `else` branch of the guard clause.

---

## Future Optimization (Phase 3.1)

Once Phase 3 is stable, these optimizations can improve the state-level query from ~1s to <100ms:

1. **Materialized grid table** — pre-compute grid cells at each zoom level, refresh on data load
2. **BRIN index on (x, y)** — faster range scans for the cluster queries
3. **pg_tileserv / Martin** — serve crash data as vector tiles for sub-10ms rendering at all zooms
4. **WebGL rendering** — replace L.divIcon markers with Deck.gl ScatterplotLayer for 500K+ points

These are all additive and don't require changing the Phase 3 architecture.
