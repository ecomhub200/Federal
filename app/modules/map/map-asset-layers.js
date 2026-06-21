/**
 * CL map.assetLayers — map asset-layer display + visibility (single module).
 * Extracted verbatim from app/index.html. NO behavior change. The shared globals
 * `assetMapLayers` and `mapAssetVisibility` are LEFT INLINE (reassigned + read by
 * other tabs); these fns resolve them via global scope. Dual-exposed
 * window.<fn> + CL.map.assetLayers.<fn>.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim, 2 segments around the inline mapAssetVisibility decl) ───
function assetViewOnMap() {
    console.log('[Asset] View on Map clicked');
    console.log('[Asset] Active asset IDs:', assetState.activeAssetIds);
    console.log('[Asset] Assets:', assetState.assets.length);

    if (assetState.activeAssetIds.length === 0) {
        assetShowNotification('No assets to display. Please upload and enable an asset file first.', 'warning');
        return;
    }

    // Switch to map tab (showTab expects 'map', not 'tab-map')
    showTab('map');

    // Wait for map to initialize if needed
    setTimeout(() => {
        if (!crashMap) {
            console.warn('[Asset] Map not ready yet, retrying...');
            setTimeout(() => {
                assetState.activeAssetIds.forEach(assetId => {
                    assetAddMapLayer(assetId);
                    mapAssetVisibility[assetId] = true;
                });
                saveMapAssetVisibility();
                updateMapAssetPanel();
                assetFitMapToAssets();
            }, 500);
            return;
        }

        // Add layers for all active assets and update visibility state
        assetState.activeAssetIds.forEach(assetId => {
            assetAddMapLayer(assetId);
            mapAssetVisibility[assetId] = true;
        });

        // Save visibility state and update panel
        saveMapAssetVisibility();
        updateMapAssetPanel();

        // Fit bounds to show all asset markers
        assetFitMapToAssets();
    }, 200);
}

function assetAddMapLayer(assetId) {
    if (!crashMap) {
        console.warn('[Asset] Map not initialized');
        return;
    }

    const asset = assetState.assets.find(a => a.id === assetId);
    if (!asset) return;

    // Remove existing layer for this asset
    assetRemoveMapLayer(assetId);

    const iconInfo = getAssetIconInfo(asset);
    const locationCount = asset.locations?.length || 0;

    // Use marker clustering for large datasets (>300 locations, typical at higher tiers)
    const useClustering = locationCount > 300 && typeof L.markerClusterGroup === 'function';
    const layerGroup = useClustering
        ? L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            chunkedLoading: true,
            disableClusteringAtZoom: 16
        })
        : L.layerGroup();

    asset.locations.forEach(loc => {
        const key = `${assetId}_${loc.id}`;
        const stats = assetState.associations.get(key) || { total: 0, epdo: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        const isOutOfScope = stats.outOfCrashScope === true;

        // Use gray color for out-of-scope markers, normal color for in-scope
        const markerColor = isOutOfScope ? '#9ca3af' : iconInfo.color;

        // Create custom icon
        const icon = L.divIcon({
            className: 'asset-marker-wrapper',
            html: `<div class="asset-marker" style="background:${markerColor};${isOutOfScope ? 'opacity:.6' : ''}">${iconInfo.icon}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
        });

        const marker = L.marker([loc.lat, loc.lng], { icon });

        // Create popup — different content for out-of-scope markers
        let popupContent;
        if (isOutOfScope) {
            popupContent = `
                <div class="asset-popup">
                    <div class="asset-popup-header">${iconInfo.icon} ${esc(loc.name)}</div>
                    <div style="padding:.5rem;text-align:center;color:#6b7280;font-size:.85rem">
                        <div style="margin-bottom:.25rem">Outside loaded crash data area</div>
                        <div style="font-size:.75rem">Crash data is loaded for ${jurisdictionContext.jurisdictionName || 'the selected county'} only</div>
                        ${loc.metadata?.county_name ? `<div style="font-size:.75rem;margin-top:.25rem">County: ${loc.metadata.county_name}</div>` : ''}
                    </div>
                </div>
            `;
        } else {
            popupContent = `
                <div class="asset-popup">
                    <div class="asset-popup-header">${iconInfo.icon} ${esc(loc.name)}</div>
                    <div class="asset-popup-stats">
                        <div class="asset-popup-stat">
                            <div class="val">${stats.total}</div>
                            <div class="lbl">Crashes</div>
                        </div>
                        <div class="asset-popup-stat severity-k">
                            <div class="val">${stats.K}</div>
                            <div class="lbl">Fatal</div>
                        </div>
                        <div class="asset-popup-stat severity-a">
                            <div class="val">${stats.A}</div>
                            <div class="lbl">Serious</div>
                        </div>
                    </div>
                    <div style="margin-top:.5rem;text-align:center;font-size:.85rem">
                        <strong>EPDO:</strong> ${stats.epdo.toLocaleString()}
                        <span style="color:var(--gray);font-size:.75rem">(within ${assetState.radiusFeet} ft)</span>
                    </div>
                </div>
            `;
        }

        marker.bindPopup(popupContent);
        layerGroup.addLayer(marker);
    });

    layerGroup.addTo(crashMap);
    assetMapLayers[assetId] = layerGroup;

    console.log(`[Asset] Added map layer: ${asset.name} (${locationCount} markers${useClustering ? ', clustered' : ''})`);
}

function assetRemoveMapLayer(assetId) {
    if (assetMapLayers[assetId] && crashMap) {
        crashMap.removeLayer(assetMapLayers[assetId]);
        delete assetMapLayers[assetId];
    }
}

function assetFitMapToAssets() {
    const allPoints = [];

    assetState.activeAssetIds.forEach(assetId => {
        const asset = assetState.assets.find(a => a.id === assetId);
        if (asset) {
            asset.locations.forEach(loc => {
                allPoints.push([loc.lat, loc.lng]);
            });
        }
    });

    if (allPoints.length > 0 && crashMap) {
        const bounds = L.latLngBounds(allPoints);
        safeFitBounds(crashMap, bounds, { padding: [50, 50] });
    }
}

/**
 * Show a specific asset on the map
 * @param {string} assetId - The ID of the asset to show
 */
function assetShowOnMap(assetId) {
    const asset = assetState?.assets?.find(a => a.id === assetId);
    if (!asset) {
        console.warn('[Asset] Asset not found:', assetId);
        return;
    }

    console.log('[Asset] Showing asset on map:', asset.name);

    // Enable visibility for this asset
    mapAssetVisibility[assetId] = true;

    // Add the layer to the map
    assetAddMapLayer(assetId);

    // Save visibility state
    saveMapAssetVisibility();

    // Update the asset panel
    updateMapAssetPanel();

    // Fit map to show this asset's locations
    if (asset.locations?.length > 0 && crashMap) {
        const points = asset.locations.map(loc => [loc.lat, loc.lng]);
        const bounds = L.latLngBounds(points);
        safeFitBounds(crashMap, bounds, { padding: [50, 50] });
    }
}

// ============================================================
// SECTION 9.5: MAP ASSET PANEL CONTROLS
// ============================================================

function updateMapAssetPanel() {
    const panel = document.getElementById('mapAssetPanel');
    const body = document.getElementById('mapAssetPanelBody');

    if (!panel || !body) return;

    // Preserve expanded state of sign filters before re-rendering
    const signFiltersContainer = document.getElementById('signFiltersContainer');
    const signFiltersWasExpanded = signFiltersContainer?.classList.contains('expanded');
    const expandBtn = document.querySelector('.sign-filter-expand-btn');
    const expandBtnWasExpanded = expandBtn?.classList.contains('expanded');

    // Check if Mapillary is configured
    const mapillaryConfigured = appConfig?.apis?.mapillary?.accessToken &&
                                appConfig?.apis?.mapillary?.enabled !== false;

    // Check if TIGERweb is configured
    const tigerwebConfigured = appConfig?.apis?.tigerweb?.enabled !== false;

    // Show panel if there are assets uploaded OR if built-in layers are available
    // BTS layers are always available (public federal data)
    const btsAvailable = typeof BTS_ENDPOINTS !== 'undefined';
    if (assetState.assets.length === 0 && !mapillaryConfigured && !tigerwebConfigured && !btsAvailable) {
        panel.classList.remove('visible');
        return;
    }

    // Show the panel
    panel.classList.add('visible');

    // Apply collapsed state if this is first time showing
    loadAssetPanelState();

    let html = '';

    // Traffic Inventory Section - First
    html += buildTIAssetPanelHTML();

    // Built-in Layers Section (Mapillary) - Second
    if (mapillaryConfigured) {
        const mapillaryEnabled = builtInLayersState.mapillary.enabled;
        const mapillaryStatus = builtInLayersState.mapillary.status;
        const signsEnabled = builtInLayersState.mapillaryTrafficSigns.enabled;
        const signsStatus = builtInLayersState.mapillaryTrafficSigns.status;
        const featuresEnabled = builtInLayersState.mapillaryMapFeatures.enabled;
        const featuresStatus = builtInLayersState.mapillaryMapFeatures.status;

        // Get current zoom level for visibility checks
        const currentZoom = crashMap ? crashMap.getZoom() : 10;

        // Helper function to generate status badge with zoom awareness
        const getStatusBadge = (enabled, status, minZoom = 0) => {
            if (!enabled) return '';
            if (status === 'loading') return '<span class="mapillary-status-badge loading">Loading...</span>';
            if (status === 'error') return '<span class="mapillary-status-badge error">Error</span>';
            if (minZoom > 0 && currentZoom < minZoom) {
                return `<span class="mapillary-status-badge zoom-warning" title="Zoom in to level ${minZoom}+ to see features">Zoom in (${minZoom}+)</span>`;
            }
            return '<span class="mapillary-status-badge active">Active</span>';
        };

        html += `
            <div class="map-asset-builtin-section">
                <div class="map-asset-builtin-header">Mapillary Layers</div>

                <!-- Coverage Layer (green lines) -->
                <div class="map-asset-layer-item builtin">
                    <input type="checkbox"
                        id="mapAsset_mapillary"
                        ${mapillaryEnabled ? 'checked' : ''}
                        onchange="toggleMapillaryLayer(this.checked)">
                    <label for="mapAsset_mapillary">
                        <span class="mapillary-layer-icon" style="background:#4CAF50">📷</span>
                        <span style="flex:1;" title="Shows green lines where Mapillary street-level imagery is available">Street Imagery</span>
                        ${getStatusBadge(mapillaryEnabled, mapillaryStatus)}
                    </label>
                </div>

                <!-- Traffic Signs Layer -->
                <div class="map-asset-layer-item builtin mapillary-sublayer">
                    <input type="checkbox"
                        id="mapAsset_mapillarySigns"
                        ${signsEnabled ? 'checked' : ''}
                        onchange="toggleMapillaryTrafficSignsLayer(this.checked)">
                    <label for="mapAsset_mapillarySigns">
                        <span class="mapillary-layer-icon" style="background:#dc2626">🚦</span>
                        <span style="flex:1;" title="Detected traffic signs (stop, yield, speed limit, warnings, etc.) - visible at zoom 14+">Traffic Signs</span>
                        ${getStatusBadge(signsEnabled, signsStatus, 14)}
                    </label>
                    <button class="sign-filter-expand-btn ${signsEnabled ? '' : 'disabled'}"
                            onclick="toggleSignFiltersPanel(event)"
                            title="Filter by sign type"
                            ${signsEnabled ? '' : 'disabled'}>
                        <span class="expand-arrow">▶</span>
                    </button>
                </div>

                <!-- Sign Type Filters (sub-items under Traffic Signs) -->
                <div id="signFiltersContainer" class="sign-filters-container">
                    ${renderSignFilterItems()}
                </div>

                <!-- Map Features Layer -->
                <div class="map-asset-layer-item builtin mapillary-sublayer">
                    <input type="checkbox"
                        id="mapAsset_mapillaryFeatures"
                        ${featuresEnabled ? 'checked' : ''}
                        onchange="toggleMapillaryMapFeaturesLayer(this.checked)">
                    <label for="mapAsset_mapillaryFeatures">
                        <span class="mapillary-layer-icon" style="background:#8b5cf6">🛤️</span>
                        <span style="flex:1;" title="Detected infrastructure (street lights, poles, crosswalks, etc.) - visible at zoom 15+">Map Features</span>
                        ${getStatusBadge(featuresEnabled, featuresStatus, 15)}
                    </label>
                </div>
            </div>
        `;
    }

    // User-uploaded Assets Section - Third
    if (assetState.assets.length > 0) {
        const assetsHtml = assetState.assets.map(asset => {
            const iconInfo = getAssetIconInfo(asset);
            const isVisible = mapAssetVisibility[asset.id] === true;
            const count = asset.locations?.length || 0;

            return `
                <div class="map-asset-layer-item">
                    <input type="checkbox"
                        id="mapAsset_${asset.id}"
                        ${isVisible ? 'checked' : ''}
                        onchange="toggleMapAssetLayer('${asset.id}', this.checked)">
                    <label for="mapAsset_${asset.id}">
                        <span class="asset-layer-icon" style="background:${iconInfo.color}">${iconInfo.icon}</span>
                        <span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${asset.name}">${asset.name}</span>
                        <span class="asset-count">${count}</span>
                    </label>
                </div>
            `;
        }).join('');

        html += assetsHtml;
    } else if (!mapillaryConfigured && !tigerwebConfigured) {
        html += '<div style="padding:.5rem;color:var(--gray);font-size:.75rem;text-align:center">No assets uploaded</div>';
    }

    // BTS Federal Data Layers Section
    {
        const currentZoom = crashMap ? crashMap.getZoom() : 10;

        const getBTSStatusBadge = (state, minZoom) => {
            if (!state.enabled) return '';
            if (state.status === 'loading') return '<span class="mapillary-status-badge loading">Loading...</span>';
            if (state.status === 'error') return `<span class="mapillary-status-badge error" title="${state.lastError || 'Error'}">Error</span>`;
            if (minZoom > 0 && currentZoom < minZoom) {
                return `<span class="mapillary-status-badge zoom-warning" title="Zoom in to level ${minZoom}+ to see features">Zoom ${minZoom}+</span>`;
            }
            if (state.status === 'active') return `<span class="mapillary-status-badge active">${state.featureCount.toLocaleString()}</span>`;
            return '';
        };

        html += `
            <div class="map-asset-builtin-section">
                <div class="map-asset-builtin-header">Federal Data Layers (BTS)</div>
        `;

        Object.keys(BTS_ENDPOINTS).forEach(key => {
            const ep = BTS_ENDPOINTS[key];
            const state = builtInLayersState[ep.id];
            html += `
                <div class="map-asset-layer-item builtin">
                    <input type="checkbox"
                        id="mapAsset_${ep.id}"
                        ${state.enabled ? 'checked' : ''}
                        onchange="toggleBTSLayer('${key}', this.checked)">
                    <label for="mapAsset_${ep.id}">
                        <span class="mapillary-layer-icon" style="background:${ep.color}">${ep.icon}</span>
                        <span style="flex:1;" title="${ep.desc}${ep.minZoom > 0 ? ` — visible at zoom ${ep.minZoom}+` : ''}">${ep.name}</span>
                        ${getBTSStatusBadge(state, ep.minZoom)}
                    </label>
                </div>
            `;
        });

        html += `</div>`;
    }

    // TIGERweb Jurisdiction Boundary Section - Last (at bottom)
    if (tigerwebConfigured) {
        const boundaryEnabled = builtInLayersState.jurisdictionBoundary.enabled;
        const boundaryStatus = builtInLayersState.jurisdictionBoundary.status;
        const districtsEnabled = builtInLayersState.magisterialDistricts.enabled;
        const districtsStatus = builtInLayersState.magisterialDistricts.status;
        const districtsCount = builtInLayersState.magisterialDistricts.districts?.length || 0;
        const currentJurisdictionId = localStorage.getItem('selectedJurisdiction');
        const currentJurisdiction = currentJurisdictionId ? appConfig?.jurisdictions[currentJurisdictionId] : null;
        const jurisdictionName = currentJurisdiction?.name || 'No jurisdiction selected';
        const isCounty = currentJurisdiction?.type === 'county';

        // Helper function to generate status badge
        const getBoundaryStatusBadge = (enabled, status, hasJurisdiction) => {
            if (!enabled) return '';
            if (status === 'loading') return '<span class="mapillary-status-badge loading">Loading...</span>';
            if (status === 'error') return '<span class="mapillary-status-badge error" title="' + (builtInLayersState.jurisdictionBoundary.lastError || 'Unknown error') + '">Error</span>';
            if (status === 'active') return '<span class="mapillary-status-badge active">Active</span>';
            if (!hasJurisdiction) return '<span class="mapillary-status-badge zoom-warning">No jurisdiction</span>';
            return '<span class="mapillary-status-badge loading">Pending...</span>';
        };

        const getDistrictsStatusBadge = (enabled, status, count) => {
            if (!enabled) return '';
            if (status === 'loading') return '<span class="mapillary-status-badge loading">Loading...</span>';
            if (status === 'error') return '<span class="mapillary-status-badge error" title="' + (builtInLayersState.magisterialDistricts.lastError || 'Unknown error') + '">Error</span>';
            if (status === 'active' && count > 0) return `<span class="mapillary-status-badge active">${count} districts</span>`;
            if (status === 'active' && count === 0) return '<span class="mapillary-status-badge zoom-warning">None found</span>';
            return '<span class="mapillary-status-badge loading">Pending...</span>';
        };

        html += `
            <div class="map-asset-builtin-section">
                <div class="map-asset-builtin-header">Jurisdiction Boundaries</div>

                <!-- Jurisdiction Boundary Layer -->
                <div class="map-asset-layer-item builtin">
                    <input type="checkbox"
                        id="mapAsset_jurisdictionBoundary"
                        ${boundaryEnabled ? 'checked' : ''}
                        onchange="toggleJurisdictionBoundaryLayer(this.checked)">
                    <label for="mapAsset_jurisdictionBoundary">
                        <span class="mapillary-layer-icon" style="background:#1e3a8a">📍</span>
                        <span style="flex:1;" title="Shows official Census boundary for ${jurisdictionName}">County/City Boundary</span>
                        ${getBoundaryStatusBadge(boundaryEnabled, boundaryStatus, !!currentJurisdiction)}
                    </label>
                </div>

                <!-- Magisterial Districts Layer (only for counties) -->
                <div class="map-asset-layer-item builtin mapillary-sublayer">
                    <input type="checkbox"
                        id="mapAsset_magisterialDistricts"
                        ${districtsEnabled ? 'checked' : ''}
                        onchange="toggleMagisterialDistrictsLayer(this.checked)"
                        ${!isCounty ? 'disabled title="Only available for counties"' : ''}>
                    <label for="mapAsset_magisterialDistricts" ${!isCounty ? 'style="opacity:0.5"' : ''}>
                        <span class="mapillary-layer-icon" style="background:#7c3aed">🗺️</span>
                        <span style="flex:1;" title="Shows magisterial/supervisor districts within the county">Magisterial Districts</span>
                        ${isCounty ? getDistrictsStatusBadge(districtsEnabled, districtsStatus, districtsCount) : '<span class="mapillary-status-badge zoom-warning">Counties only</span>'}
                    </label>
                </div>

                ${boundaryEnabled && currentJurisdiction ? `
                <div class="jurisdiction-boundary-info" style="padding:0.25rem 0.5rem 0.5rem 2rem;font-size:0.7rem;color:var(--gray);">
                    ${jurisdictionName}
                    <span style="opacity:0.7;margin-left:0.25rem;">(FIPS: ${currentJurisdiction.stateCountyFips || ((appConfig?.apis?.tigerweb?.stateFips || '') + '-' + currentJurisdiction.fips)})</span>
                </div>
                ` : ''}

                ${districtsEnabled && districtState.loaded && Object.keys(districtState.statistics.byDistrict).length > 0 ? `
                <div class="district-stats-mini" style="padding:0.25rem 0.5rem 0.5rem 2rem;font-size:0.7rem;">
                    <a href="#" onclick="event.preventDefault();navigateTo('dashboard');setTimeout(()=>document.getElementById('districtMatrixWidget')?.scrollIntoView({behavior:'smooth'}),100);"
                       style="color:var(--primary);text-decoration:none;">
                        View District Statistics →
                    </a>
                </div>
                ` : ''}
            </div>
        `;
    }

    body.innerHTML = html;

    // Set indeterminate state on TI parent checkboxes (can't be set via HTML attribute)
    updateTIParentCheckboxes();

    // Update TI map legend
    updateTIMapLegend();

    // Restore expanded state of sign filters after re-rendering
    if (signFiltersWasExpanded) {
        const newContainer = document.getElementById('signFiltersContainer');
        const newExpandBtn = document.querySelector('.sign-filter-expand-btn');
        if (newContainer) newContainer.classList.add('expanded');
        if (newExpandBtn) newExpandBtn.classList.add('expanded');
    }
}

function toggleAssetPanelCollapse() {
    const panel = document.getElementById('mapAssetPanel');
    if (panel) {
        // Clear any inline resize styles so CSS defaults apply
        panel.style.width = '';
        panel.style.height = '';
        panel.style.maxHeight = '';
        localStorage.removeItem('mapAssetPanel_resizeW');
        localStorage.removeItem('mapAssetPanel_resizeH');
        const assetBody = panel.querySelector('.map-asset-panel-body');
        if (assetBody) assetBody.classList.remove('resizable-body');
        panel.classList.toggle('collapsed');
        // Save state to localStorage
        const isCollapsed = panel.classList.contains('collapsed');
        localStorage.setItem('mapAssetPanelCollapsed', isCollapsed);
    }
}

// Load asset panel state (collapsed by default)
function loadAssetPanelState() {
    const panel = document.getElementById('mapAssetPanel');
    // Default to collapsed unless explicitly set to expanded
    const savedState = localStorage.getItem('mapAssetPanelCollapsed');
    const isCollapsed = savedState === null || savedState === 'true';
    if (panel && isCollapsed) {
        panel.classList.add('collapsed');
        // Clear any stale resize styles so collapsed state is compact
        panel.style.width = '';
        panel.style.height = '';
        panel.style.maxHeight = '';
        localStorage.removeItem('mapAssetPanel_resizeW');
        localStorage.removeItem('mapAssetPanel_resizeH');
        const assetBody = panel.querySelector('.map-asset-panel-body');
        if (assetBody) assetBody.classList.remove('resizable-body');
    }
}

// Panel Resize Drag Logic
(function initPanelResize() {
    let resizing = null; // { panel, direction, startX, startY, startW, startH, startLeft, startRight }

    document.addEventListener('mousedown', function(e) {
        const handle = e.target.closest('.panel-resize-handle');
        if (!handle) return;
        e.preventDefault();
        e.stopPropagation();

        const panelId = handle.dataset.panel;
        const direction = handle.dataset.resize;
        const panel = document.getElementById(panelId);
        if (!panel) return;

        const rect = panel.getBoundingClientRect();
        const containerRect = panel.parentElement.getBoundingClientRect();

        panel.classList.add('resizing');
        // Remove max-height constraint during resize for asset panel body
        const assetBody = panel.querySelector('.map-asset-panel-body');
        if (assetBody) assetBody.classList.add('resizable-body');

        resizing = {
            panel: panel,
            panelId: panelId,
            direction: direction,
            startX: e.clientX,
            startY: e.clientY,
            startW: rect.width,
            startH: rect.height,
            startLeft: rect.left - containerRect.left,
            startTop: rect.top - containerRect.top,
            containerW: containerRect.width,
            containerH: containerRect.height
        };

        document.body.style.cursor = handle.style.cursor || 'nwse-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', function(e) {
        if (!resizing) return;
        e.preventDefault();

        const dx = e.clientX - resizing.startX;
        const dy = e.clientY - resizing.startY;
        const dir = resizing.direction;
        const panel = resizing.panel;

        let newW = resizing.startW;
        let newH = resizing.startH;
        let newLeft = null;

        // Vertical resize (south)
        if (dir.includes('s')) {
            newH = Math.max(80, Math.min(resizing.startH + dy, resizing.containerH - resizing.startTop - 10));
        }

        // Horizontal resize (east - for left panel)
        if (dir.includes('e')) {
            newW = Math.max(220, Math.min(resizing.startW + dx, resizing.containerW - resizing.startLeft - 10));
        }

        // Horizontal resize (west - for right panel)
        if (dir.includes('w')) {
            newW = Math.max(180, Math.min(resizing.startW - dx, resizing.containerW * 0.6));
        }

        panel.style.width = newW + 'px';
        if (dir.includes('s')) {
            panel.style.maxHeight = newH + 'px';
            panel.style.height = newH + 'px';
            localStorage.setItem(resizing.panelId + '_resizeH', newH);
        }

        // Save width to localStorage
        localStorage.setItem(resizing.panelId + '_resizeW', newW);
    });

    document.addEventListener('mouseup', function() {
        if (!resizing) return;
        resizing.panel.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        resizing = null;
    });

    // Touch support for mobile
    document.addEventListener('touchstart', function(e) {
        const handle = e.target.closest('.panel-resize-handle');
        if (!handle) return;
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX, clientY: touch.clientY, bubbles: true
        });
        handle.dispatchEvent(mouseEvent);
    }, { passive: false });

    document.addEventListener('touchmove', function(e) {
        if (!resizing) return;
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX, clientY: touch.clientY, bubbles: true
        });
        document.dispatchEvent(mouseEvent);
    }, { passive: false });

    document.addEventListener('touchend', function() {
        if (!resizing) return;
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });

    // Restore saved sizes
    function restorePanelSize(panelId) {
        const panel = document.getElementById(panelId);
        if (!panel) return;
        const savedW = localStorage.getItem(panelId + '_resizeW');
        const savedH = localStorage.getItem(panelId + '_resizeH');
        if (savedW) panel.style.width = savedW + 'px';
        if (savedH) {
            panel.style.maxHeight = savedH + 'px';
            panel.style.height = savedH + 'px';
            const assetBody = panel.querySelector('.map-asset-panel-body');
            if (assetBody) assetBody.classList.add('resizable-body');
        }
    }

    // Restore on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            restorePanelSize('mapSelectionPanel');
            restorePanelSize('mapAssetPanel');
        });
    } else {
        restorePanelSize('mapSelectionPanel');
        restorePanelSize('mapAssetPanel');
    }
})();

function toggleMapAssetLayer(assetId, show) {
    console.log(`[Asset] Toggle map layer: ${assetId}, show: ${show}`);

    if (show) {
        mapAssetVisibility[assetId] = true;
        assetAddMapLayer(assetId);
    } else {
        mapAssetVisibility[assetId] = false;
        assetRemoveMapLayer(assetId);
    }

    // Save visibility state
    saveMapAssetVisibility();
}

function mapShowAllAssets() {
    console.log('[Asset] Show all assets on map');

    // Show user-uploaded assets
    assetState.assets.forEach(asset => {
        mapAssetVisibility[asset.id] = true;
        assetAddMapLayer(asset.id);
    });

    // Show jurisdiction boundary layer if configured
    const tigerwebConfigured = appConfig?.apis?.tigerweb?.enabled !== false;
    if (tigerwebConfigured && !builtInLayersState.jurisdictionBoundary.enabled) {
        builtInLayersState.jurisdictionBoundary.enabled = true;
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            addJurisdictionBoundaryLayer(jurisdictionId);
        }
        saveJurisdictionBoundaryVisibility();
    }

    // Show Mapillary layers if configured
    const mapillaryConfigured = appConfig?.apis?.mapillary?.accessToken &&
                                appConfig?.apis?.mapillary?.enabled !== false;
    if (mapillaryConfigured) {
        // Show coverage layer
        if (!builtInLayersState.mapillary.enabled) {
            builtInLayersState.mapillary.enabled = true;
            addMapillaryCoverageLayer();
            saveMapillaryVisibility();
        }
        // Show traffic signs layer using Graph API
        if (!builtInLayersState.mapillaryTrafficSigns.enabled) {
            builtInLayersState.mapillaryTrafficSigns.enabled = true;
            addMapillaryTrafficSignsViaGraphAPI();
        }
        // Show map features layer using Graph API
        if (!builtInLayersState.mapillaryMapFeatures.enabled) {
            builtInLayersState.mapillaryMapFeatures.enabled = true;
            addMapillaryMapFeaturesViaGraphAPI();
        }
        saveMapillarySubLayersVisibility();
    }

    // Show BTS Federal Data Layers
    if (typeof BTS_ENDPOINTS !== 'undefined') {
        Object.keys(BTS_ENDPOINTS).forEach(key => {
            const stateKey = BTS_ENDPOINTS[key].id;
            if (!builtInLayersState[stateKey]?.enabled) {
                builtInLayersState[stateKey].enabled = true;
                addBTSLayer(key);
            }
        });
        saveBTSLayerVisibility();
    }

    // Show Traffic Inventory layers
    showAllTILayers();

    saveMapAssetVisibility();
    updateMapAssetPanel();

    // Fit map to show all assets
    assetFitMapToAssets();
}

function mapHideAllAssets() {
    console.log('[Asset] Hide all assets from map');

    // Hide user-uploaded assets
    assetState.assets.forEach(asset => {
        mapAssetVisibility[asset.id] = false;
        assetRemoveMapLayer(asset.id);
    });

    // Hide jurisdiction boundary layer
    if (builtInLayersState.jurisdictionBoundary.enabled) {
        builtInLayersState.jurisdictionBoundary.enabled = false;
        removeJurisdictionBoundaryLayer();
        saveJurisdictionBoundaryVisibility();
    }

    // Hide all Mapillary layers
    if (builtInLayersState.mapillary.enabled) {
        builtInLayersState.mapillary.enabled = false;
        removeMapillaryCoverageLayer();
        saveMapillaryVisibility();
    }
    if (builtInLayersState.mapillaryTrafficSigns.enabled) {
        builtInLayersState.mapillaryTrafficSigns.enabled = false;
        removeMapillaryTrafficSignsGraphAPI();
        removeMapillaryTrafficSignsLayer();
    }
    if (builtInLayersState.mapillaryMapFeatures.enabled) {
        builtInLayersState.mapillaryMapFeatures.enabled = false;
        removeMapillaryMapFeaturesGraphAPI();
        removeMapillaryMapFeaturesLayer();
    }
    saveMapillarySubLayersVisibility();

    // Hide BTS Federal Data Layers
    if (typeof BTS_ENDPOINTS !== 'undefined') {
        Object.keys(BTS_ENDPOINTS).forEach(key => {
            const stateKey = BTS_ENDPOINTS[key].id;
            if (builtInLayersState[stateKey]?.enabled) {
                builtInLayersState[stateKey].enabled = false;
                removeBTSLayer(key);
            }
        });
        saveBTSLayerVisibility();
    }

    // Hide Traffic Inventory layers
    hideAllTILayers();

    saveMapAssetVisibility();
    updateMapAssetPanel();
}

function saveMapAssetVisibility() {
    try {
        localStorage.setItem('mapAssetVisibility', JSON.stringify(mapAssetVisibility));
    } catch (e) {
        console.warn('[Asset] Could not save visibility state:', e);
    }
}

function loadMapAssetVisibility() {
    try {
        const saved = localStorage.getItem('mapAssetVisibility');
        if (saved) {
            mapAssetVisibility = JSON.parse(saved);
        }
    } catch (e) {
        console.warn('[Asset] Could not load visibility state:', e);
        mapAssetVisibility = {};
    }
}

function restoreMapAssetLayers() {
    // Restore visible layers after map is ready
    Object.keys(mapAssetVisibility).forEach(assetId => {
        if (mapAssetVisibility[assetId] && assetState.assets.find(a => a.id === assetId)) {
            assetAddMapLayer(assetId);
        }
    });

    // Restore Mapillary layer if it was enabled
    restoreMapillaryLayer();

    // Restore BTS layers if any were enabled
    if (typeof restoreBTSLayers === 'function') {
        restoreBTSLayers();
    }

    // Restore Overture Maps layers if any were enabled
    if (typeof restoreOvertureLayers === 'function') {
        restoreOvertureLayers();
    }

    // Restore Jurisdiction Boundary layer if it was enabled
    loadJurisdictionBoundaryVisibility();

    // Restore Magisterial Districts layer if it was enabled
    loadMagisterialDistrictsVisibility();

    // Restore Traffic Inventory layers if any were enabled
    loadTILayerVisibility();
    if (typeof restoreTILayers === 'function') {
        restoreTILayers();
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.map = CL.map || {};
  CL.map.assetLayers = CL.map.assetLayers || {};
  window.assetViewOnMap = assetViewOnMap; CL.map.assetLayers.assetViewOnMap = assetViewOnMap;
  window.assetAddMapLayer = assetAddMapLayer; CL.map.assetLayers.assetAddMapLayer = assetAddMapLayer;
  window.assetRemoveMapLayer = assetRemoveMapLayer; CL.map.assetLayers.assetRemoveMapLayer = assetRemoveMapLayer;
  window.assetFitMapToAssets = assetFitMapToAssets; CL.map.assetLayers.assetFitMapToAssets = assetFitMapToAssets;
  window.assetShowOnMap = assetShowOnMap; CL.map.assetLayers.assetShowOnMap = assetShowOnMap;
  window.updateMapAssetPanel = updateMapAssetPanel; CL.map.assetLayers.updateMapAssetPanel = updateMapAssetPanel;
  window.toggleAssetPanelCollapse = toggleAssetPanelCollapse; CL.map.assetLayers.toggleAssetPanelCollapse = toggleAssetPanelCollapse;
  window.loadAssetPanelState = loadAssetPanelState; CL.map.assetLayers.loadAssetPanelState = loadAssetPanelState;
  window.toggleMapAssetLayer = toggleMapAssetLayer; CL.map.assetLayers.toggleMapAssetLayer = toggleMapAssetLayer;
  window.mapShowAllAssets = mapShowAllAssets; CL.map.assetLayers.mapShowAllAssets = mapShowAllAssets;
  window.mapHideAllAssets = mapHideAllAssets; CL.map.assetLayers.mapHideAllAssets = mapHideAllAssets;
  window.saveMapAssetVisibility = saveMapAssetVisibility; CL.map.assetLayers.saveMapAssetVisibility = saveMapAssetVisibility;
  window.loadMapAssetVisibility = loadMapAssetVisibility; CL.map.assetLayers.loadMapAssetVisibility = loadMapAssetVisibility;
  window.restoreMapAssetLayers = restoreMapAssetLayers; CL.map.assetLayers.restoreMapAssetLayers = restoreMapAssetLayers;
  CL._registerModule('map/map-asset-layers');
})();
