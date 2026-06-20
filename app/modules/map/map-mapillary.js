/**
 * CL map.mapillary — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.map.mapillary.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Toggle the Mapillary street-level imagery coverage layer
 * Shows green lines on roads where Mapillary has street-view imagery available
 */
function toggleMapillaryLayer(show) {
    console.log(`[Mapillary] Toggle coverage layer: ${show}`);

    if (show) {
        builtInLayersState.mapillary.enabled = true;
        addMapillaryCoverageLayer();
    } else {
        builtInLayersState.mapillary.enabled = false;
        removeMapillaryCoverageLayer();
    }

    // Save state and update UI
    saveMapillaryVisibility();
    updateMapAssetPanel();
}

/**
 * Add the Mapillary vector tile coverage layer to the map
 */
function addMapillaryCoverageLayer() {
    if (!crashMap) {
        console.warn('[Mapillary] Map not initialized');
        return false;
    }

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) {
        showNotification('Mapillary API token not configured', 'warning');
        builtInLayersState.mapillary.status = 'error';
        builtInLayersState.mapillary.lastError = 'No API token';
        return false;
    }

    // Remove existing layer if any
    removeMapillaryCoverageLayer();

    // Set loading state
    builtInLayersState.mapillary.status = 'loading';
    updateMapAssetPanel();

    try {
        // Mapillary Vector Tiles API endpoint for coverage
        const tileUrl = `https://tiles.mapillary.com/maps/vtp/mly1_computed_public/2/{z}/{x}/{y}?access_token=${token}`;

        // Create vector grid layer with coverage styling
        const mapillaryLayer = L.vectorGrid.protobuf(tileUrl, {
            pane: 'mapillaryPane',
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                // Style the sequence layer (coverage lines)
                sequence: {
                    color: '#4CAF50',
                    weight: 3,
                    opacity: 0.65,
                    lineCap: 'round',
                    lineJoin: 'round'
                },
                // Hide other layers we don't need
                image: [],
                overview: []
            },
            maxZoom: 18,
            minZoom: 6,
            maxNativeZoom: 14,
            interactive: true,
            getFeatureId: function(f) {
                return f.properties.id || f.properties.sequence_id;
            }
        });

        // Handle click on coverage to open Mapillary viewer
        mapillaryLayer.on('click', function(e) {
            if (e.latlng) {
                const lat = e.latlng.lat;
                const lng = e.latlng.lng;

                // Show popup with option to view street imagery
                const popupContent = `
                    <div style="text-align:center;padding:0.5rem;">
                        <div style="font-weight:600;margin-bottom:0.5rem;">📷 Street Imagery Available</div>
                        <button onclick="openMapillaryAtLocation(${lat}, ${lng})"
                                style="padding:0.4rem 0.8rem;background:#4CAF50;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.85rem;">
                            View in Mapillary
                        </button>
                    </div>
                `;

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(popupContent)
                    .openOn(crashMap);
            }
        });

        // Handle tile load errors
        mapillaryLayer.on('tileerror', function(e) {
            console.warn('[Mapillary] Tile load error:', e);
            if (builtInLayersState.mapillary.status !== 'error') {
                // Only show error once, not for every tile
                builtInLayersState.mapillary.status = 'error';
                builtInLayersState.mapillary.lastError = 'Failed to load tiles';
                updateMapAssetPanel();
            }
        });

        // Handle successful tile load
        mapillaryLayer.on('load', function() {
            if (builtInLayersState.mapillary.status === 'loading') {
                builtInLayersState.mapillary.status = 'active';
                updateMapAssetPanel();
                console.log('[Mapillary] Coverage layer loaded successfully');
            }
        });

        // Add layer to map
        mapillaryLayer.addTo(crashMap);
        builtInLayersState.mapillary.layer = mapillaryLayer;
        builtInLayersState.mapillary.status = 'active';

        // Add attribution
        addMapillaryAttribution();

        console.log('[Mapillary] Coverage layer added to map');
        updateMapAssetPanel();
        return true;

    } catch (error) {
        console.error('[Mapillary] Error creating coverage layer:', error);
        builtInLayersState.mapillary.status = 'error';
        builtInLayersState.mapillary.lastError = error.message;
        showNotification('Failed to load Mapillary coverage layer', 'error');
        updateMapAssetPanel();
        return false;
    }
}

/**
 * Remove the Mapillary coverage layer from the map
 */
function removeMapillaryCoverageLayer() {
    if (builtInLayersState.mapillary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.mapillary.layer);
        builtInLayersState.mapillary.layer = null;
        console.log('[Mapillary] Coverage layer removed from map');
    }

    // Remove attribution
    removeMapillaryAttribution();

    // Reset status
    builtInLayersState.mapillary.status = 'ready';
}

/**
 * Add Mapillary attribution to the map
 */
function addMapillaryAttribution() {
    if (crashMap?.attributionControl && !crashMap.attributionControl._mapillaryAdded) {
        crashMap.attributionControl.addAttribution(
            '© <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a>'
        );
        crashMap.attributionControl._mapillaryAdded = true;
    }
}

/**
 * Remove Mapillary attribution from the map
 */
function removeMapillaryAttribution() {
    if (crashMap?.attributionControl && crashMap.attributionControl._mapillaryAdded) {
        crashMap.attributionControl.removeAttribution(
            '© <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a>'
        );
        crashMap.attributionControl._mapillaryAdded = false;
    }
}

/**
 * Get Mapillary viewer URL for given coordinates
 */
function getMapillaryViewUrl(lat, lng, zoom = 17, layer = 'all') {
    return `https://www.mapillary.com/app?lat=${lat}&lng=${lng}&z=${zoom}`;
}

/**
 * Open Mapillary viewer at specific coordinates
 */
function openMapillaryAtLocation(lat, lng) {
    const url = getMapillaryViewUrl(parseFloat(lat), parseFloat(lng), 18, 'all');
    window.open(url, '_blank');
}

/**
 * Save Mapillary visibility state to localStorage
 */
function saveMapillaryVisibility() {
    try {
        localStorage.setItem('mapillaryLayerEnabled', builtInLayersState.mapillary.enabled ? 'true' : 'false');
    } catch (e) {
        console.warn('[Mapillary] Could not save visibility state:', e);
    }
}

/**
 * Load Mapillary visibility state from localStorage
 */
function loadMapillaryVisibility() {
    try {
        const saved = localStorage.getItem('mapillaryLayerEnabled');
        if (saved === 'true') {
            builtInLayersState.mapillary.enabled = true;
        }
    } catch (e) {
        console.warn('[Mapillary] Could not load visibility state:', e);
    }
}

/**
 * Restore Mapillary layer if it was previously enabled
 */
function restoreMapillaryLayer() {
    loadMapillaryVisibility();

    if (builtInLayersState.mapillary.enabled) {
        // Delay slightly to ensure map is fully ready
        setTimeout(() => {
            addMapillaryCoverageLayer();
            updateMapAssetPanel();
        }, 500);
    }

    // Also restore traffic signs and map features layers using Graph API
    loadMapillarySubLayersVisibility();
    if (builtInLayersState.mapillaryTrafficSigns.enabled) {
        setTimeout(() => addMapillaryTrafficSignsViaGraphAPI(), 600);
    }
    if (builtInLayersState.mapillaryMapFeatures.enabled) {
        setTimeout(() => addMapillaryMapFeaturesViaGraphAPI(), 700);
    }
}

// ============================================================
// SECTION 9.7: MAPILLARY TRAFFIC SIGNS LAYER
// ============================================================

/**
 * Get display info for a Mapillary sign based on its object_value
 */
function getMapillarySignInfo(objectValue) {
    if (!objectValue) return { icon: '🪧', color: '#6b7280', label: 'Unknown Sign' };

    // Find matching category by prefix
    for (const [prefix, info] of Object.entries(MAPILLARY_SIGN_CATEGORIES)) {
        if (objectValue.startsWith(prefix)) {
            return info;
        }
    }

    // Default based on sign type
    if (objectValue.startsWith('regulatory')) {
        return { icon: '🔴', color: '#dc2626', label: 'Regulatory Sign' };
    } else if (objectValue.startsWith('warning')) {
        return { icon: '⚠️', color: '#f59e0b', label: 'Warning Sign' };
    } else if (objectValue.startsWith('information')) {
        return { icon: 'ℹ️', color: '#3b82f6', label: 'Information Sign' };
    }

    return { icon: '🪧', color: '#6b7280', label: 'Traffic Sign' };
}

/**
 * Get display info for a Mapillary map feature
 */
function getMapillaryFeatureInfo(objectValue) {
    if (!objectValue) return { icon: '📍', color: '#6b7280', label: 'Unknown Feature' };

    // Find matching category
    for (const [key, info] of Object.entries(MAPILLARY_FEATURE_CATEGORIES)) {
        if (objectValue.startsWith(key) || objectValue === key) {
            return info;
        }
    }

    // Default based on feature type
    if (objectValue.startsWith('object--')) {
        return { icon: '📦', color: '#8b5cf6', label: objectValue.replace('object--', '').replace(/-/g, ' ') };
    } else if (objectValue.startsWith('marking--')) {
        return { icon: '〰️', color: '#3b82f6', label: objectValue.replace('marking--', '').replace(/-/g, ' ') };
    }

    return { icon: '📍', color: '#6b7280', label: 'Map Feature' };
}

/**
 * Inline SVG icons for Mapillary features - no external loading required
 * These are data URIs that work instantly without CORS/network issues
 * Styled to match Mapillary's official icon appearance
 */
const MAPILLARY_INLINE_ICONS = {
    // Traffic Signs - Regulatory
    'stop': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="7,2 17,2 22,7 22,17 17,22 7,22 2,17 2,7" fill="#dc2626" stroke="#fff" stroke-width="1.5"/><text x="12" y="15" text-anchor="middle" fill="#fff" font-size="7" font-weight="bold" font-family="Arial">STOP</text></svg>`,
    'yield': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fff" stroke="#dc2626" stroke-width="2"/><text x="12" y="16" text-anchor="middle" fill="#dc2626" font-size="5" font-weight="bold" font-family="Arial">YIELD</text></svg>`,
    'speed': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#000" stroke-width="2"/><text x="12" y="15" text-anchor="middle" fill="#000" font-size="8" font-weight="bold" font-family="Arial">50</text></svg>`,
    'no-entry': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#dc2626" stroke="#fff" stroke-width="1.5"/><rect x="5" y="10" width="14" height="4" fill="#fff"/></svg>`,
    'no-parking': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#dc2626" stroke-width="2"/><text x="12" y="16" text-anchor="middle" fill="#3b82f6" font-size="10" font-weight="bold" font-family="Arial">P</text><line x1="5" y1="19" x2="19" y2="5" stroke="#dc2626" stroke-width="2"/></svg>`,
    'one-way': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="8" width="20" height="8" fill="#000" rx="1"/><polygon points="18,12 14,8 14,10 6,10 6,14 14,14 14,16" fill="#fff"/></svg>`,
    'turn': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="#fff" stroke="#000" stroke-width="2" rx="2"/><path d="M8,16 L8,10 Q8,8 10,8 L16,8" stroke="#000" stroke-width="2.5" fill="none"/><polygon points="16,8 13,5 13,11" fill="#000"/></svg>`,

    // Traffic Signs - Warning
    'warning': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fbbf24" stroke="#000" stroke-width="1.5"/><text x="12" y="17" text-anchor="middle" fill="#000" font-size="12" font-weight="bold" font-family="Arial">!</text></svg>`,
    'curve': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fbbf24" stroke="#000" stroke-width="1.5"/><path d="M9,16 Q9,10 15,10" stroke="#000" stroke-width="2" fill="none"/><polygon points="15,10 12,7 12,13" fill="#000"/></svg>`,
    'pedestrian': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fbbf24" stroke="#000" stroke-width="1.5"/><circle cx="12" cy="7" r="2" fill="#000"/><path d="M12,9 L12,13 M9,11 L15,11 M12,13 L9,18 M12,13 L15,18" stroke="#000" stroke-width="1.5" fill="none"/></svg>`,
    'children': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fbbf24" stroke="#000" stroke-width="1.5"/><circle cx="9" cy="8" r="1.5" fill="#000"/><circle cx="15" cy="8" r="1.5" fill="#000"/><path d="M9,10 L9,14 L7,17 M9,12 L11,12 M15,10 L15,14 L17,17 M15,12 L13,12" stroke="#000" stroke-width="1.2" fill="none"/></svg>`,
    'signal-ahead': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,20 2,20" fill="#fbbf24" stroke="#000" stroke-width="1.5"/><rect x="10" y="6" width="4" height="11" fill="#000" rx="0.5"/><circle cx="12" cy="8" r="1.2" fill="#ef4444"/><circle cx="12" cy="11" r="1.2" fill="#fbbf24"/><circle cx="12" cy="14" r="1.2" fill="#22c55e"/></svg>`,

    // Traffic Signs - Information
    'parking': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="#3b82f6" rx="2"/><text x="12" y="17" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="Arial">P</text></svg>`,
    'hospital': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="#3b82f6" rx="2"/><rect x="10" y="6" width="4" height="12" fill="#fff"/><rect x="6" y="10" width="12" height="4" fill="#fff"/></svg>`,
    'info': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="#3b82f6" rx="2"/><text x="12" y="17" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="serif">i</text></svg>`,

    // Map Features - Objects
    'traffic-light': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="2" width="8" height="18" fill="#374151" rx="1"/><circle cx="12" cy="6" r="2.5" fill="#ef4444"/><circle cx="12" cy="11" r="2.5" fill="#fbbf24"/><circle cx="12" cy="16" r="2.5" fill="#22c55e"/><rect x="10" y="20" width="4" height="2" fill="#374151"/></svg>`,
    'street-light': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="8" width="2" height="14" fill="#6b7280"/><ellipse cx="12" cy="6" rx="4" ry="2" fill="#fbbf24"/><path d="M8,6 L6,10 M16,6 L18,10" stroke="#fbbf24" stroke-width="1" opacity="0.6"/></svg>`,
    'fire-hydrant': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="8" width="8" height="12" fill="#dc2626" rx="1"/><rect x="6" y="12" width="3" height="3" fill="#dc2626" rx="0.5"/><rect x="15" y="12" width="3" height="3" fill="#dc2626" rx="0.5"/><ellipse cx="12" cy="6" rx="3" ry="2" fill="#dc2626"/><rect x="10" y="20" width="4" height="2" fill="#6b7280"/></svg>`,
    'utility-pole': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="11" y="4" width="2" height="18" fill="#78716c"/><rect x="5" y="6" width="14" height="2" fill="#78716c"/><line x1="6" y1="8" x2="6" y2="12" stroke="#374151" stroke-width="1"/><line x1="18" y1="8" x2="18" y2="12" stroke="#374151" stroke-width="1"/></svg>`,
    'bench': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="16" height="3" fill="#78716c" rx="0.5"/><rect x="4" y="14" width="16" height="2" fill="#78716c" rx="0.5"/><rect x="5" y="16" width="2" height="4" fill="#6b7280"/><rect x="17" y="16" width="2" height="4" fill="#6b7280"/></svg>`,
    'trash-can': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="14" fill="#6b7280" rx="1"/><rect x="5" y="4" width="14" height="2" fill="#6b7280" rx="0.5"/><rect x="9" y="2" width="6" height="2" fill="#6b7280"/><line x1="9" y1="9" x2="9" y2="17" stroke="#4b5563" stroke-width="1"/><line x1="12" y1="9" x2="12" y2="17" stroke="#4b5563" stroke-width="1"/><line x1="15" y1="9" x2="15" y2="17" stroke="#4b5563" stroke-width="1"/></svg>`,
    'mailbox': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="12" height="8" fill="#3b82f6" rx="4 4 0 0"/><rect x="4" y="10" width="12" height="4" fill="#3b82f6"/><rect x="9" y="14" width="2" height="6" fill="#6b7280"/><rect x="16" y="8" width="2" height="4" fill="#dc2626"/></svg>`,
    'bollard': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="9" y="4" width="6" height="16" fill="#6b7280" rx="1"/><rect x="8" y="4" width="8" height="3" fill="#fbbf24" rx="0.5"/></svg>`,
    'barrier': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="10" width="20" height="4" fill="#f97316"/><rect x="2" y="10" width="4" height="4" fill="#fff"/><rect x="10" y="10" width="4" height="4" fill="#fff"/><rect x="18" y="10" width="4" height="4" fill="#fff"/><rect x="4" y="14" width="2" height="6" fill="#6b7280"/><rect x="18" y="14" width="2" height="6" fill="#6b7280"/></svg>`,
    'manhole': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#6b7280" stroke="#4b5563" stroke-width="1"/><circle cx="12" cy="12" r="5" fill="none" stroke="#4b5563" stroke-width="1"/><line x1="12" y1="4" x2="12" y2="20" stroke="#4b5563" stroke-width="0.5"/><line x1="4" y1="12" x2="20" y2="12" stroke="#4b5563" stroke-width="0.5"/></svg>`,

    // Markings
    'crosswalk': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" fill="#6b7280"/><rect x="4" y="4" width="2" height="16" fill="#fff"/><rect x="8" y="4" width="2" height="16" fill="#fff"/><rect x="12" y="4" width="2" height="16" fill="#fff"/><rect x="16" y="4" width="2" height="16" fill="#fff"/></svg>`,
    'stop-line': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="10" width="20" height="4" fill="#fff" stroke="#dc2626" stroke-width="1"/></svg>`,
    'arrow': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="20" height="16" fill="#6b7280"/><polygon points="12,6 18,14 14,14 14,18 10,18 10,14 6,14" fill="#fff"/></svg>`,

    // Construction
    'cone': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 18,20 6,20" fill="#f97316"/><rect x="8" y="8" width="8" height="2" fill="#fff"/><rect x="7" y="14" width="10" height="2" fill="#fff"/><rect x="5" y="20" width="14" height="2" fill="#374151"/></svg>`,

    // Default/fallback icons
    'default-sign': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" fill="#6b7280" rx="2" stroke="#fff" stroke-width="1"/><text x="12" y="16" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="Arial">?</text></svg>`,
    'default-object': `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="#8b5cf6" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="12" r="3" fill="#fff"/></svg>`
};

/**
 * Get inline SVG for a Mapillary object_value
 * Returns a data URI that can be used directly as img src
 */
function getMapillaryInlineSvg(objectValue) {
    if (!objectValue) return MAPILLARY_INLINE_ICONS['default-object'];

    const value = objectValue.toLowerCase();

    // Traffic Signs - Regulatory
    if (value.includes('stop') && !value.includes('line')) return MAPILLARY_INLINE_ICONS['stop'];
    if (value.includes('yield') || value.includes('give-way')) return MAPILLARY_INLINE_ICONS['yield'];
    if (value.includes('speed-limit') || value.includes('maximum-speed')) {
        // Extract the actual speed value from the object_value (e.g., "regulatory--maximum-speed-limit-45--g3")
        const speedMatch = value.match(/speed-limit-?(\d+)/i) || value.match(/maximum-speed-?(\d+)/i);
        const speedValue = speedMatch ? speedMatch[1] : '?';
        // Generate dynamic SVG with actual speed value
        return `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#fff" stroke="#000" stroke-width="2"/><text x="12" y="15" text-anchor="middle" fill="#000" font-size="${speedValue.length > 2 ? '6' : '8'}" font-weight="bold" font-family="Arial">${speedValue}</text></svg>`;
    }
    if (value.includes('no-entry') || value.includes('do-not-enter')) return MAPILLARY_INLINE_ICONS['no-entry'];
    if (value.includes('no-parking')) return MAPILLARY_INLINE_ICONS['no-parking'];
    if (value.includes('one-way')) return MAPILLARY_INLINE_ICONS['one-way'];
    if (value.includes('turn') || value.includes('keep-right') || value.includes('keep-left')) return MAPILLARY_INLINE_ICONS['turn'];

    // Traffic Signs - Warning
    if (value.includes('curve') || value.includes('bend')) return MAPILLARY_INLINE_ICONS['curve'];
    if (value.includes('pedestrian')) return MAPILLARY_INLINE_ICONS['pedestrian'];
    if (value.includes('children') || value.includes('school')) return MAPILLARY_INLINE_ICONS['children'];
    if (value.includes('signal') && value.includes('ahead')) return MAPILLARY_INLINE_ICONS['signal-ahead'];
    if (value.startsWith('warning')) return MAPILLARY_INLINE_ICONS['warning'];

    // Traffic Signs - Information
    if (value.includes('parking') && !value.includes('no-parking')) return MAPILLARY_INLINE_ICONS['parking'];
    if (value.includes('hospital')) return MAPILLARY_INLINE_ICONS['hospital'];
    if (value.startsWith('information')) return MAPILLARY_INLINE_ICONS['info'];

    // Map Features - Objects
    if (value.includes('traffic-light') || value.includes('traffic_light') || value.includes('signal')) return MAPILLARY_INLINE_ICONS['traffic-light'];
    if (value.includes('street-light') || value.includes('street_light') || value.includes('lamp')) return MAPILLARY_INLINE_ICONS['street-light'];
    if (value.includes('fire-hydrant') || value.includes('fire_hydrant') || value.includes('hydrant')) return MAPILLARY_INLINE_ICONS['fire-hydrant'];
    if (value.includes('utility-pole') || value.includes('utility_pole') || value.includes('pole')) return MAPILLARY_INLINE_ICONS['utility-pole'];
    if (value.includes('bench')) return MAPILLARY_INLINE_ICONS['bench'];
    if (value.includes('trash') || value.includes('bin') || value.includes('waste')) return MAPILLARY_INLINE_ICONS['trash-can'];
    if (value.includes('mailbox') || value.includes('post-box')) return MAPILLARY_INLINE_ICONS['mailbox'];
    if (value.includes('bollard')) return MAPILLARY_INLINE_ICONS['bollard'];
    if (value.includes('barrier')) return MAPILLARY_INLINE_ICONS['barrier'];
    if (value.includes('manhole')) return MAPILLARY_INLINE_ICONS['manhole'];

    // Markings
    if (value.includes('crosswalk') || value.includes('zebra')) return MAPILLARY_INLINE_ICONS['crosswalk'];
    if (value.includes('stop-line') || value.includes('stop_line')) return MAPILLARY_INLINE_ICONS['stop-line'];
    if (value.includes('arrow')) return MAPILLARY_INLINE_ICONS['arrow'];

    // Construction
    if (value.includes('cone') || value.includes('construction')) return MAPILLARY_INLINE_ICONS['cone'];

    // Default fallbacks based on category
    if (value.startsWith('regulatory') || value.startsWith('warning') ||
        value.startsWith('information') || value.startsWith('complementary')) {
        return MAPILLARY_INLINE_ICONS['default-sign'];
    }

    return MAPILLARY_INLINE_ICONS['default-object'];
}

/**
 * Convert SVG string to data URI for use in img src
 */
function svgToDataUri(svgString) {
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
}

/**
 * Create a Leaflet icon using inline SVG - no external loading required
 * This approach is instant and works reliably without CORS/network issues
 */
function createMapillaryIcon(objectValue, fallbackEmoji, isSign = false) {
    const size = isSign ? 28 : 24;
    const svgString = getMapillaryInlineSvg(objectValue);
    const dataUri = svgToDataUri(svgString);

    return L.divIcon({
        html: `<img src="${dataUri}" style="width:${size}px;height:${size}px;filter:drop-shadow(1px 1px 2px rgba(0,0,0,0.4))"/>`,
        className: 'mapillary-svg-icon',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -size/2]
    });
}

/**
 * Toggle the Mapillary traffic signs layer
 * Uses Graph API for reliable data fetching
 */
function toggleMapillaryTrafficSignsLayer(show) {
    console.log(`[Mapillary] Toggle traffic signs layer: ${show}`);

    if (show) {
        builtInLayersState.mapillaryTrafficSigns.enabled = true;
        // Use Graph API implementation (more reliable than vector tiles)
        addMapillaryTrafficSignsViaGraphAPI();
    } else {
        builtInLayersState.mapillaryTrafficSigns.enabled = false;
        // Remove both Graph API and vector tile layers
        removeMapillaryTrafficSignsGraphAPI();
        removeMapillaryTrafficSignsLayer();
    }

    saveMapillarySubLayersVisibility();
    updateMapAssetPanel();
}

// ============================================================
// SECTION 9.7b: SIGN TYPE FILTERS
// ============================================================

/**
 * Render the sign filter checkbox items for the Asset Layers panel
 */
function renderSignFilterItems() {
    const filters = builtInLayersState.mapillaryTrafficSigns.signFilters;
    const counts = builtInLayersState.mapillaryTrafficSigns.signCounts || {};

    return Object.entries(SIGN_FILTER_CATEGORIES).map(([key, config]) => {
        const isChecked = filters[key];
        const count = counts[key] || 0;
        const countDisplay = count > 0 ? `<span class="sign-filter-count">${count}</span>` : '';

        return `
            <div class="sign-filter-item ${isChecked ? 'active' : ''}">
                <input type="checkbox"
                    id="signFilter_${key}"
                    ${isChecked ? 'checked' : ''}
                    onchange="toggleSignFilter('${key}', this.checked)">
                <label for="signFilter_${key}">
                    <span class="sign-filter-icon">${config.icon}</span>
                    <span>${config.label}</span>
                    ${countDisplay}
                </label>
            </div>
        `;
    }).join('');
}

/**
 * Toggle the sign filters panel visibility
 */
function toggleSignFiltersPanel(event) {
    event.stopPropagation();
    const container = document.getElementById('signFiltersContainer');
    const btn = event.currentTarget;

    if (container) {
        container.classList.toggle('expanded');
        btn.classList.toggle('expanded');
    }
}

/**
 * Toggle a specific sign filter
 */
function toggleSignFilter(filterKey, enabled) {
    console.log(`[Sign Filter] Toggle ${filterKey}: ${enabled}`);

    const filters = builtInLayersState.mapillaryTrafficSigns.signFilters;

    if (filterKey === 'all') {
        // If "All Signs" is checked, uncheck all others
        if (enabled) {
            Object.keys(filters).forEach(key => {
                filters[key] = key === 'all';
            });
        } else {
            filters.all = false;
        }
    } else {
        // If a specific filter is checked, uncheck "All Signs"
        filters[filterKey] = enabled;
        if (enabled) {
            filters.all = false;
        }

        // If no specific filters are checked, re-enable "All Signs"
        const anySpecificEnabled = Object.entries(filters)
            .filter(([key]) => key !== 'all')
            .some(([, value]) => value);

        if (!anySpecificEnabled) {
            filters.all = true;
        }
    }

    // Refresh the map to apply filters
    if (builtInLayersState.mapillaryTrafficSigns.enabled) {
        // Force refresh by clearing last bbox
        mapillaryGraphAPIState.lastBbox = null;
        refreshTrafficSignsFromGraphAPI();
    }

    // Update UI
    updateMapAssetPanel();
}

/**
 * Check if a sign should be shown based on current filters
 */
function shouldShowSign(objectValue) {
    const filters = builtInLayersState.mapillaryTrafficSigns.signFilters;

    // If "All Signs" is enabled, show everything
    if (filters.all) return true;

    // Check each enabled filter
    for (const [filterKey, enabled] of Object.entries(filters)) {
        if (!enabled || filterKey === 'all') continue;

        const category = SIGN_FILTER_CATEGORIES[filterKey];
        if (!category) continue;

        // Check if the object_value matches any prefix for this filter
        for (const prefix of category.prefixes) {
            if (objectValue.startsWith(prefix)) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Get the filter category key for a given object_value
 */
function getSignFilterCategory(objectValue) {
    for (const [filterKey, category] of Object.entries(SIGN_FILTER_CATEGORIES)) {
        if (filterKey === 'all') continue;

        for (const prefix of category.prefixes) {
            if (objectValue.startsWith(prefix)) {
                return filterKey;
            }
        }
    }
    return null;
}

/**
 * Toggle the Mapillary map features layer
 * Uses Graph API for reliable data fetching
 */
function toggleMapillaryMapFeaturesLayer(show) {
    console.log(`[Mapillary] Toggle map features layer: ${show}`);

    if (show) {
        builtInLayersState.mapillaryMapFeatures.enabled = true;
        // Use Graph API implementation (more reliable than vector tiles)
        addMapillaryMapFeaturesViaGraphAPI();
    } else {
        builtInLayersState.mapillaryMapFeatures.enabled = false;
        // Remove both Graph API and vector tile layers
        removeMapillaryMapFeaturesGraphAPI();
        removeMapillaryMapFeaturesLayer();
    }

    saveMapillarySubLayersVisibility();
    updateMapAssetPanel();
}

/**
 * Add Mapillary traffic signs layer to the map
 * Uses vector tiles from mly_map_feature layer filtered to traffic signs
 */
function addMapillaryTrafficSignsLayer() {
    if (!crashMap) {
        console.warn('[Mapillary] Map not initialized');
        return false;
    }

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) {
        showNotification('Mapillary API token not configured', 'warning');
        builtInLayersState.mapillaryTrafficSigns.status = 'error';
        return false;
    }

    // Remove existing layer
    removeMapillaryTrafficSignsLayer();

    builtInLayersState.mapillaryTrafficSigns.status = 'loading';
    updateMapAssetPanel();

    try {
        // Mapillary Traffic Signs vector tiles endpoint (separate from map features points)
        // Reference: https://www.mapillary.com/developer/api-documentation
        const tileUrl = `https://tiles.mapillary.com/maps/vtp/mly_map_feature_traffic_sign/2/{z}/{x}/{y}?access_token=${token}`;

        console.log('[Mapillary] Loading traffic signs from:', tileUrl.replace(token, 'TOKEN_HIDDEN'));

        const signsLayer = L.vectorGrid.protobuf(tileUrl, {
            pane: 'mapillarySignsPane',
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                // Layer name in mly_map_feature_traffic_sign tiles is 'traffic_sign'
                traffic_sign: function(properties) {
                    // Debug: log first few features to verify data is loading
                    if (!window._mapillarySignDebugLogged) {
                        console.log('[Mapillary] Traffic sign tile feature sample:', properties);
                        window._mapillarySignDebugLogged = true;
                    }

                    // Mapillary uses 'value' property for the sign type
                    const objValue = properties.value || '';

                    // All features in this layer are traffic signs, but filter for common types
                    // Regulatory (stop, yield, speed limit), Warning (curve, pedestrian), Information
                    if (!objValue.startsWith('regulatory') &&
                        !objValue.startsWith('warning') &&
                        !objValue.startsWith('information') &&
                        !objValue.startsWith('complementary')) {
                        // Still show unknown sign types with default style
                        if (objValue) {
                            return {
                                radius: 6,
                                fillColor: '#6b7280',
                                fillOpacity: 0.7,
                                color: '#ffffff',
                                weight: 1,
                                opacity: 0.8
                            };
                        }
                        return []; // Hide empty features
                    }

                    const signInfo = getMapillarySignInfo(objValue);

                    return {
                        radius: 8,
                        fillColor: signInfo.color,
                        fillOpacity: 0.9,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1
                    };
                },
                // Also try 'point' layer name as fallback (some tiles may use this)
                point: function(properties) {
                    const objValue = properties.value || '';
                    if (!objValue) return [];

                    // Only show traffic signs
                    if (!objValue.startsWith('regulatory') &&
                        !objValue.startsWith('warning') &&
                        !objValue.startsWith('information') &&
                        !objValue.startsWith('complementary')) {
                        return [];
                    }

                    const signInfo = getMapillarySignInfo(objValue);
                    return {
                        radius: 8,
                        fillColor: signInfo.color,
                        fillOpacity: 0.9,
                        color: '#ffffff',
                        weight: 2,
                        opacity: 1
                    };
                }
            },
            maxZoom: 18,
            minZoom: 14,  // Only show at higher zoom levels for performance
            maxNativeZoom: 14,
            interactive: true,
            getFeatureId: function(f) {
                return f.properties.id;
            }
        });

        // Handle click on traffic sign
        signsLayer.on('click', function(e) {
            if (e.layer && e.layer.properties) {
                const props = e.layer.properties;
                const objValue = props.value || 'unknown';
                const signInfo = getMapillarySignInfo(objValue);

                // Format the object value for display
                const formattedValue = objValue.replace(/--/g, ' → ').replace(/-/g, ' ');

                const popupContent = `
                    <div class="mapillary-feature-popup">
                        <div class="mapillary-popup-header" style="border-left-color: ${signInfo.color}">
                            <span class="mapillary-popup-icon">${signInfo.icon}</span>
                            <span class="mapillary-popup-title">${signInfo.label}</span>
                        </div>
                        <div class="mapillary-popup-body">
                            <div class="mapillary-popup-row">
                                <span class="mapillary-popup-label">Type:</span>
                                <span class="mapillary-popup-value">${formattedValue}</span>
                            </div>
                            ${props.id ? `
                            <div class="mapillary-popup-row">
                                <span class="mapillary-popup-label">ID:</span>
                                <span class="mapillary-popup-value" style="font-family:monospace;font-size:0.7rem">${props.id}</span>
                            </div>` : ''}
                        </div>
                        <div class="mapillary-popup-actions">
                            <button onclick="openMapillaryAtLocation(${e.latlng.lat}, ${e.latlng.lng})"
                                    class="mapillary-popup-btn">
                                📷 View in Mapillary
                            </button>
                        </div>
                    </div>
                `;

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(popupContent)
                    .openOn(crashMap);
            }
        });

        // Handle tile errors
        signsLayer.on('tileerror', function(e) {
            console.warn('[Mapillary] Traffic signs tile error:', e);
            if (builtInLayersState.mapillaryTrafficSigns.status !== 'error') {
                builtInLayersState.mapillaryTrafficSigns.status = 'error';
                updateMapAssetPanel();
            }
        });

        // Handle load complete
        signsLayer.on('load', function() {
            if (builtInLayersState.mapillaryTrafficSigns.status === 'loading') {
                builtInLayersState.mapillaryTrafficSigns.status = 'active';
                updateMapAssetPanel();
                console.log('[Mapillary] Traffic signs layer loaded');
            }
        });

        signsLayer.addTo(crashMap);
        builtInLayersState.mapillaryTrafficSigns.layer = signsLayer;
        builtInLayersState.mapillaryTrafficSigns.status = 'active';

        console.log('[Mapillary] Traffic signs layer added');
        updateMapAssetPanel();
        return true;

    } catch (error) {
        console.error('[Mapillary] Error creating traffic signs layer:', error);
        builtInLayersState.mapillaryTrafficSigns.status = 'error';
        showNotification('Failed to load traffic signs layer', 'error');
        updateMapAssetPanel();
        return false;
    }
}

/**
 * Remove the Mapillary traffic signs layer
 */
function removeMapillaryTrafficSignsLayer() {
    if (builtInLayersState.mapillaryTrafficSigns.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.mapillaryTrafficSigns.layer);
        builtInLayersState.mapillaryTrafficSigns.layer = null;
        console.log('[Mapillary] Traffic signs layer removed');
    }
    builtInLayersState.mapillaryTrafficSigns.status = 'ready';
}

/**
 * Add Mapillary map features layer (street lights, poles, crosswalks, etc.)
 */
function addMapillaryMapFeaturesLayer() {
    if (!crashMap) {
        console.warn('[Mapillary] Map not initialized');
        return false;
    }

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) {
        showNotification('Mapillary API token not configured', 'warning');
        builtInLayersState.mapillaryMapFeatures.status = 'error';
        return false;
    }

    // Remove existing layer
    removeMapillaryMapFeaturesLayer();

    builtInLayersState.mapillaryMapFeatures.status = 'loading';
    updateMapAssetPanel();

    try {
        // Mapillary Map Features (Points) vector tiles endpoint - for infrastructure, NOT signs
        // Reference: https://www.mapillary.com/developer/api-documentation
        const tileUrl = `https://tiles.mapillary.com/maps/vtp/mly_map_feature_point/2/{z}/{x}/{y}?access_token=${token}`;

        console.log('[Mapillary] Loading map features from:', tileUrl.replace(token, 'TOKEN_HIDDEN'));

        const featuresLayer = L.vectorGrid.protobuf(tileUrl, {
            pane: 'mapillaryFeaturesPane',
            rendererFactory: L.canvas.tile,
            vectorTileLayerStyles: {
                // Layer name in mly_map_feature_point tiles is 'point'
                point: function(properties) {
                    // Debug: log first few features to verify data is loading
                    if (!window._mapillaryFeatureDebugLogged) {
                        console.log('[Mapillary] Map feature tile sample:', properties);
                        window._mapillaryFeatureDebugLogged = true;
                    }

                    const objValue = properties.value || '';

                    // This endpoint should only contain non-sign features,
                    // but filter just in case to avoid duplicates with signs layer
                    if (objValue.startsWith('regulatory') ||
                        objValue.startsWith('warning') ||
                        objValue.startsWith('information') ||
                        objValue.startsWith('complementary')) {
                        return []; // Signs handled by traffic signs layer
                    }

                    // Show objects (street lights, poles, etc.) and markings
                    if (!objValue.startsWith('object') && !objValue.startsWith('marking')) {
                        // Still show other feature types with default style
                        if (objValue) {
                            return {
                                radius: 5,
                                fillColor: '#6b7280',
                                fillOpacity: 0.6,
                                color: '#ffffff',
                                weight: 1,
                                opacity: 0.7
                            };
                        }
                        return [];
                    }

                    const featureInfo = getMapillaryFeatureInfo(objValue);

                    return {
                        radius: 6,
                        fillColor: featureInfo.color,
                        fillOpacity: 0.8,
                        color: '#ffffff',
                        weight: 1.5,
                        opacity: 1
                    };
                },
                // Style line features (markings like crosswalks)
                line: function(properties) {
                    const objValue = properties.value || '';

                    if (!objValue.startsWith('marking')) {
                        return [];
                    }

                    return {
                        color: '#3b82f6',
                        weight: 3,
                        opacity: 0.7,
                        dashArray: '5, 5'
                    };
                }
            },
            maxZoom: 18,
            minZoom: 15,  // Higher zoom threshold for features (more dense)
            maxNativeZoom: 14,
            interactive: true,
            getFeatureId: function(f) {
                return f.properties.id;
            }
        });

        // Handle click on map feature
        featuresLayer.on('click', function(e) {
            if (e.layer && e.layer.properties) {
                const props = e.layer.properties;
                const objValue = props.value || 'unknown';
                const featureInfo = getMapillaryFeatureInfo(objValue);

                const formattedValue = objValue.replace(/--/g, ' → ').replace(/-/g, ' ');

                const popupContent = `
                    <div class="mapillary-feature-popup">
                        <div class="mapillary-popup-header" style="border-left-color: ${featureInfo.color}">
                            <span class="mapillary-popup-icon">${featureInfo.icon}</span>
                            <span class="mapillary-popup-title">${featureInfo.label}</span>
                        </div>
                        <div class="mapillary-popup-body">
                            <div class="mapillary-popup-row">
                                <span class="mapillary-popup-label">Type:</span>
                                <span class="mapillary-popup-value">${formattedValue}</span>
                            </div>
                            ${props.id ? `
                            <div class="mapillary-popup-row">
                                <span class="mapillary-popup-label">ID:</span>
                                <span class="mapillary-popup-value" style="font-family:monospace;font-size:0.7rem">${props.id}</span>
                            </div>` : ''}
                        </div>
                        <div class="mapillary-popup-actions">
                            <button onclick="openMapillaryAtLocation(${e.latlng.lat}, ${e.latlng.lng})"
                                    class="mapillary-popup-btn">
                                📷 View in Mapillary
                            </button>
                        </div>
                    </div>
                `;

                L.popup()
                    .setLatLng(e.latlng)
                    .setContent(popupContent)
                    .openOn(crashMap);
            }
        });

        // Handle tile errors
        featuresLayer.on('tileerror', function(e) {
            console.warn('[Mapillary] Map features tile error:', e);
            if (builtInLayersState.mapillaryMapFeatures.status !== 'error') {
                builtInLayersState.mapillaryMapFeatures.status = 'error';
                updateMapAssetPanel();
            }
        });

        // Handle load complete
        featuresLayer.on('load', function() {
            if (builtInLayersState.mapillaryMapFeatures.status === 'loading') {
                builtInLayersState.mapillaryMapFeatures.status = 'active';
                updateMapAssetPanel();
                console.log('[Mapillary] Map features layer loaded');
            }
        });

        featuresLayer.addTo(crashMap);
        builtInLayersState.mapillaryMapFeatures.layer = featuresLayer;
        builtInLayersState.mapillaryMapFeatures.status = 'active';

        console.log('[Mapillary] Map features layer added');
        updateMapAssetPanel();
        return true;

    } catch (error) {
        console.error('[Mapillary] Error creating map features layer:', error);
        builtInLayersState.mapillaryMapFeatures.status = 'error';
        showNotification('Failed to load map features layer', 'error');
        updateMapAssetPanel();
        return false;
    }
}

/**
 * Remove the Mapillary map features layer
 */
function removeMapillaryMapFeaturesLayer() {
    if (builtInLayersState.mapillaryMapFeatures.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.mapillaryMapFeatures.layer);
        builtInLayersState.mapillaryMapFeatures.layer = null;
        console.log('[Mapillary] Map features layer removed');
    }
    builtInLayersState.mapillaryMapFeatures.status = 'ready';
}

/**
 * Save Mapillary sub-layers visibility state
 */
function saveMapillarySubLayersVisibility() {
    try {
        localStorage.setItem('mapillaryTrafficSignsEnabled',
            builtInLayersState.mapillaryTrafficSigns.enabled ? 'true' : 'false');
        localStorage.setItem('mapillaryMapFeaturesEnabled',
            builtInLayersState.mapillaryMapFeatures.enabled ? 'true' : 'false');
    } catch (e) {
        console.warn('[Mapillary] Could not save sub-layers visibility:', e);
    }
}

/**
 * Load Mapillary sub-layers visibility state
 */
function loadMapillarySubLayersVisibility() {
    try {
        const signsEnabled = localStorage.getItem('mapillaryTrafficSignsEnabled');
        const featuresEnabled = localStorage.getItem('mapillaryMapFeaturesEnabled');

        if (signsEnabled === 'true') {
            builtInLayersState.mapillaryTrafficSigns.enabled = true;
        }
        if (featuresEnabled === 'true') {
            builtInLayersState.mapillaryMapFeatures.enabled = true;
        }
    } catch (e) {
        console.warn('[Mapillary] Could not load sub-layers visibility:', e);
    }
}

// ============================================================
// SECTION 9.8: MAPILLARY GRAPH API LAYERS (Fallback/Alternative)
// ============================================================

// State for Graph API-based layers
const mapillaryGraphAPIState = {
    trafficSignsGroup: null,      // L.layerGroup for traffic signs
    mapFeaturesGroup: null,       // L.layerGroup for map features
    refreshDebounceTimer: null,   // Debounce timer for map movement
    lastBbox: null,               // Last queried bbox to avoid duplicate queries
    isLoadingSigns: false,
    isLoadingFeatures: false
};

/**
 * Add traffic signs layer using Graph API
 * Uses L.layerGroup with circle markers, refreshes on map movement
 */
async function addMapillaryTrafficSignsViaGraphAPI() {
    if (!crashMap) {
        console.warn('[Mapillary Graph] Map not initialized');
        return false;
    }

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) {
        showNotification('Mapillary API token not configured', 'warning');
        builtInLayersState.mapillaryTrafficSigns.status = 'error';
        return false;
    }

    // Remove existing layer
    removeMapillaryTrafficSignsGraphAPI();

    builtInLayersState.mapillaryTrafficSigns.status = 'loading';
    updateMapAssetPanel();

    try {
        // Create marker cluster group for better performance with icons
        mapillaryGraphAPIState.trafficSignsGroup = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 18
        });
        mapillaryGraphAPIState.trafficSignsGroup.addTo(crashMap);

        // Add to builtInLayersState for tracking
        builtInLayersState.mapillaryTrafficSigns.layer = mapillaryGraphAPIState.trafficSignsGroup;

        // Initial load
        await refreshTrafficSignsFromGraphAPI();

        // Setup map movement listener with debounce
        crashMap.on('moveend', debounceTrafficSignsRefresh);

        console.log('[Mapillary Graph] Traffic signs layer added');
        return true;

    } catch (error) {
        console.error('[Mapillary Graph] Error creating traffic signs layer:', error);
        builtInLayersState.mapillaryTrafficSigns.status = 'error';
        showNotification('Failed to load traffic signs', 'error');
        updateMapAssetPanel();
        return false;
    }
}

/**
 * Debounced refresh for traffic signs on map movement
 */
function debounceTrafficSignsRefresh() {
    if (mapillaryGraphAPIState.refreshDebounceTimer) {
        clearTimeout(mapillaryGraphAPIState.refreshDebounceTimer);
    }
    mapillaryGraphAPIState.refreshDebounceTimer = setTimeout(() => {
        if (builtInLayersState.mapillaryTrafficSigns.enabled) {
            refreshTrafficSignsFromGraphAPI();
        }
        if (builtInLayersState.mapillaryMapFeatures.enabled) {
            refreshMapFeaturesFromGraphAPI();
        }
    }, 500);
}

/**
 * Refresh traffic signs from Graph API for current map bounds
 */
async function refreshTrafficSignsFromGraphAPI() {
    if (!crashMap || !mapillaryGraphAPIState.trafficSignsGroup) return;
    if (mapillaryGraphAPIState.isLoadingSigns) return;

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) return;

    // Check zoom level - only load at zoom 14+
    const zoom = crashMap.getZoom();
    if (zoom < 14) {
        console.log('[Mapillary Graph] Zoom level too low for traffic signs:', zoom);
        builtInLayersState.mapillaryTrafficSigns.status = 'active';
        updateMapAssetPanel();
        return;
    }

    const bounds = crashMap.getBounds();
    // Round to 6 decimal places to avoid floating point precision issues in URLs
    const bbox = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;

    // Skip if same bbox
    if (bbox === mapillaryGraphAPIState.lastBbox) return;

    mapillaryGraphAPIState.isLoadingSigns = true;
    builtInLayersState.mapillaryTrafficSigns.status = 'loading';
    updateMapAssetPanel();

    try {
        // Use Authorization header (recommended for metadata endpoints) to avoid URL encoding issues
        const url = `https://graph.mapillary.com/map_features?fields=id,geometry,object_value,object_type&bbox=${bbox}&layers=trafficsigns&limit=500`;

        console.log('[Mapillary Graph] Fetching traffic signs for bbox:', bbox);

        const response = await fetch(url, {
            headers: { 'Authorization': `OAuth ${token}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const features = data.data || [];

        console.log('[Mapillary Graph] Traffic signs found:', features.length);

        // Log sample object_values for debugging (first 5)
        if (features.length > 0) {
            const sampleValues = features.slice(0, 5).map(f => f.object_value);
            console.log('[Mapillary Graph] Sample object_values:', sampleValues);
        }

        // Clear existing markers
        mapillaryGraphAPIState.trafficSignsGroup.clearLayers();

        // Initialize sign counts by category
        const signCounts = { all: 0 };
        Object.keys(SIGN_FILTER_CATEGORIES).forEach(key => {
            if (key !== 'all') signCounts[key] = 0;
        });

        // Count all signs by category first (for badges)
        features.forEach(feature => {
            const objValue = feature.object_value || '';
            const category = getSignFilterCategory(objValue);
            if (category) {
                signCounts[category]++;
            }
            signCounts.all++;
        });

        // Store counts for UI display
        builtInLayersState.mapillaryTrafficSigns.signCounts = signCounts;

        // Filter and add markers
        let filteredCount = 0;
        features.forEach(feature => {
            if (!feature.geometry?.coordinates) return;

            const [lng, lat] = feature.geometry.coordinates;
            const objValue = feature.object_value || '';

            // Check if this sign should be shown based on filters
            if (!shouldShowSign(objValue)) return;

            filteredCount++;
            const signInfo = getMapillarySignInfo(objValue);

            // Create Mapillary SVG icon with emoji fallback
            const icon = createMapillaryIcon(objValue, signInfo.icon, true);

            const marker = L.marker([lat, lng], { icon });

            // Add popup
            const formattedValue = objValue.replace(/--/g, ' → ').replace(/-/g, ' ');
            marker.bindPopup(`
                <div class="mapillary-feature-popup">
                    <div class="mapillary-popup-header" style="border-left-color: ${signInfo.color}">
                        <span class="mapillary-popup-icon">${signInfo.icon}</span>
                        <span class="mapillary-popup-title">${signInfo.label}</span>
                    </div>
                    <div class="mapillary-popup-body">
                        <div class="mapillary-popup-row">
                            <span class="mapillary-popup-label">Type:</span>
                            <span class="mapillary-popup-value">${formattedValue}</span>
                        </div>
                        ${feature.id ? `
                        <div class="mapillary-popup-row">
                            <span class="mapillary-popup-label">ID:</span>
                            <span class="mapillary-popup-value" style="font-family:monospace;font-size:0.7rem">${feature.id}</span>
                        </div>` : ''}
                    </div>
                    <div class="mapillary-popup-actions">
                        <button onclick="openMapillaryAtLocation(${lat}, ${lng})" class="mapillary-popup-btn">
                            📷 View in Mapillary
                        </button>
                    </div>
                </div>
            `);

            marker.addTo(mapillaryGraphAPIState.trafficSignsGroup);
        });

        console.log(`[Mapillary Graph] Showing ${filteredCount} of ${features.length} signs (filtered)`);
        builtInLayersState.mapillaryTrafficSigns.featureCount = filteredCount;
        builtInLayersState.mapillaryTrafficSigns.status = 'active';
        mapillaryGraphAPIState.lastBbox = bbox;
        updateMapAssetPanel();

    } catch (error) {
        console.error('[Mapillary Graph] Traffic signs fetch error:', error);
        builtInLayersState.mapillaryTrafficSigns.status = 'error';
        updateMapAssetPanel();
    } finally {
        mapillaryGraphAPIState.isLoadingSigns = false;
    }
}

/**
 * Remove traffic signs Graph API layer
 */
function removeMapillaryTrafficSignsGraphAPI() {
    if (mapillaryGraphAPIState.trafficSignsGroup && crashMap) {
        crashMap.removeLayer(mapillaryGraphAPIState.trafficSignsGroup);
        mapillaryGraphAPIState.trafficSignsGroup = null;
    }
    // Remove event listener
    if (crashMap) {
        crashMap.off('moveend', debounceTrafficSignsRefresh);
    }
    builtInLayersState.mapillaryTrafficSigns.status = 'ready';
    builtInLayersState.mapillaryTrafficSigns.layer = null;
}

/**
 * Add map features layer using Graph API
 */
async function addMapillaryMapFeaturesViaGraphAPI() {
    if (!crashMap) {
        console.warn('[Mapillary Graph] Map not initialized');
        return false;
    }

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) {
        showNotification('Mapillary API token not configured', 'warning');
        builtInLayersState.mapillaryMapFeatures.status = 'error';
        return false;
    }

    // Remove existing layer
    removeMapillaryMapFeaturesGraphAPI();

    builtInLayersState.mapillaryMapFeatures.status = 'loading';
    updateMapAssetPanel();

    try {
        // Create marker cluster group for better performance with icons
        mapillaryGraphAPIState.mapFeaturesGroup = L.markerClusterGroup({
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            disableClusteringAtZoom: 18
        });
        mapillaryGraphAPIState.mapFeaturesGroup.addTo(crashMap);

        // Add to builtInLayersState for tracking
        builtInLayersState.mapillaryMapFeatures.layer = mapillaryGraphAPIState.mapFeaturesGroup;

        // Initial load
        await refreshMapFeaturesFromGraphAPI();

        // Setup map movement listener with debounce (shared with traffic signs)
        crashMap.on('moveend', debounceTrafficSignsRefresh);

        console.log('[Mapillary Graph] Map features layer added');
        return true;

    } catch (error) {
        console.error('[Mapillary Graph] Error creating map features layer:', error);
        builtInLayersState.mapillaryMapFeatures.status = 'error';
        showNotification('Failed to load map features', 'error');
        updateMapAssetPanel();
        return false;
    }
}

/**
 * Refresh map features from Graph API for current map bounds
 */
async function refreshMapFeaturesFromGraphAPI() {
    if (!crashMap || !mapillaryGraphAPIState.mapFeaturesGroup) return;
    if (mapillaryGraphAPIState.isLoadingFeatures) return;

    const token = appConfig?.apis?.mapillary?.accessToken;
    if (!token) return;

    // Check zoom level - only load at zoom 15+
    const zoom = crashMap.getZoom();
    if (zoom < 15) {
        console.log('[Mapillary Graph] Zoom level too low for map features:', zoom);
        builtInLayersState.mapillaryMapFeatures.status = 'active';
        updateMapAssetPanel();
        return;
    }

    const bounds = crashMap.getBounds();
    // Round to 6 decimal places to avoid floating point precision issues in URLs
    const bbox = `${bounds.getWest().toFixed(6)},${bounds.getSouth().toFixed(6)},${bounds.getEast().toFixed(6)},${bounds.getNorth().toFixed(6)}`;

    mapillaryGraphAPIState.isLoadingFeatures = true;
    builtInLayersState.mapillaryMapFeatures.status = 'loading';
    updateMapAssetPanel();

    try {
        // Use Authorization header (recommended for metadata endpoints) to avoid URL encoding issues
        const url = `https://graph.mapillary.com/map_features?fields=id,geometry,object_value,object_type&bbox=${bbox}&layers=points&limit=500`;

        console.log('[Mapillary Graph] Fetching map features for bbox');

        const response = await fetch(url, {
            headers: { 'Authorization': `OAuth ${token}` }
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        const features = data.data || [];

        console.log('[Mapillary Graph] Map features found:', features.length);

        // Log sample object_values for debugging (first 5 non-traffic-sign features)
        if (features.length > 0) {
            const sampleValues = features
                .filter(f => f.object_value && f.object_value.startsWith('object--'))
                .slice(0, 5)
                .map(f => f.object_value);
            console.log('[Mapillary Graph] Sample map feature object_values:', sampleValues);
        }

        // Clear existing markers
        mapillaryGraphAPIState.mapFeaturesGroup.clearLayers();

        // Add new markers
        features.forEach(feature => {
            if (!feature.geometry?.coordinates) return;

            const [lng, lat] = feature.geometry.coordinates;
            const objValue = feature.object_value || '';

            // Skip traffic signs (they're in the other layer)
            if (objValue.startsWith('regulatory') ||
                objValue.startsWith('warning') ||
                objValue.startsWith('information') ||
                objValue.startsWith('complementary')) {
                return;
            }

            const featureInfo = getMapillaryFeatureInfo(objValue);

            // Create Mapillary SVG icon with emoji fallback
            const icon = createMapillaryIcon(objValue, featureInfo.icon, false);

            const marker = L.marker([lat, lng], { icon });

            // Add popup
            const formattedValue = objValue.replace(/--/g, ' → ').replace(/-/g, ' ');
            marker.bindPopup(`
                <div class="mapillary-feature-popup">
                    <div class="mapillary-popup-header" style="border-left-color: ${featureInfo.color}">
                        <span class="mapillary-popup-icon">${featureInfo.icon}</span>
                        <span class="mapillary-popup-title">${featureInfo.label}</span>
                    </div>
                    <div class="mapillary-popup-body">
                        <div class="mapillary-popup-row">
                            <span class="mapillary-popup-label">Type:</span>
                            <span class="mapillary-popup-value">${formattedValue}</span>
                        </div>
                        ${feature.id ? `
                        <div class="mapillary-popup-row">
                            <span class="mapillary-popup-label">ID:</span>
                            <span class="mapillary-popup-value" style="font-family:monospace;font-size:0.7rem">${feature.id}</span>
                        </div>` : ''}
                    </div>
                    <div class="mapillary-popup-actions">
                        <button onclick="openMapillaryAtLocation(${lat}, ${lng})" class="mapillary-popup-btn">
                            📷 View in Mapillary
                        </button>
                    </div>
                </div>
            `);

            marker.addTo(mapillaryGraphAPIState.mapFeaturesGroup);
        });

        builtInLayersState.mapillaryMapFeatures.featureCount = features.length;
        builtInLayersState.mapillaryMapFeatures.status = 'active';
        updateMapAssetPanel();

    } catch (error) {
        console.error('[Mapillary Graph] Map features fetch error:', error);
        builtInLayersState.mapillaryMapFeatures.status = 'error';
        updateMapAssetPanel();
    } finally {
        mapillaryGraphAPIState.isLoadingFeatures = false;
    }
}

/**
 * Remove map features Graph API layer
 */
function removeMapillaryMapFeaturesGraphAPI() {
    if (mapillaryGraphAPIState.mapFeaturesGroup && crashMap) {
        crashMap.removeLayer(mapillaryGraphAPIState.mapFeaturesGroup);
        mapillaryGraphAPIState.mapFeaturesGroup = null;
    }
    builtInLayersState.mapillaryMapFeatures.status = 'ready';
    builtInLayersState.mapillaryMapFeatures.layer = null;
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.map = CL.map || {};
  CL.map.mapillary = CL.map.mapillary || {};
  window.toggleMapillaryLayer = toggleMapillaryLayer; CL.map.mapillary.toggleMapillaryLayer = toggleMapillaryLayer;
  window.addMapillaryCoverageLayer = addMapillaryCoverageLayer; CL.map.mapillary.addMapillaryCoverageLayer = addMapillaryCoverageLayer;
  window.removeMapillaryCoverageLayer = removeMapillaryCoverageLayer; CL.map.mapillary.removeMapillaryCoverageLayer = removeMapillaryCoverageLayer;
  window.addMapillaryAttribution = addMapillaryAttribution; CL.map.mapillary.addMapillaryAttribution = addMapillaryAttribution;
  window.removeMapillaryAttribution = removeMapillaryAttribution; CL.map.mapillary.removeMapillaryAttribution = removeMapillaryAttribution;
  window.getMapillaryViewUrl = getMapillaryViewUrl; CL.map.mapillary.getMapillaryViewUrl = getMapillaryViewUrl;
  window.openMapillaryAtLocation = openMapillaryAtLocation; CL.map.mapillary.openMapillaryAtLocation = openMapillaryAtLocation;
  window.saveMapillaryVisibility = saveMapillaryVisibility; CL.map.mapillary.saveMapillaryVisibility = saveMapillaryVisibility;
  window.loadMapillaryVisibility = loadMapillaryVisibility; CL.map.mapillary.loadMapillaryVisibility = loadMapillaryVisibility;
  window.restoreMapillaryLayer = restoreMapillaryLayer; CL.map.mapillary.restoreMapillaryLayer = restoreMapillaryLayer;
  window.getMapillarySignInfo = getMapillarySignInfo; CL.map.mapillary.getMapillarySignInfo = getMapillarySignInfo;
  window.getMapillaryFeatureInfo = getMapillaryFeatureInfo; CL.map.mapillary.getMapillaryFeatureInfo = getMapillaryFeatureInfo;
  window.getMapillaryInlineSvg = getMapillaryInlineSvg; CL.map.mapillary.getMapillaryInlineSvg = getMapillaryInlineSvg;
  window.svgToDataUri = svgToDataUri; CL.map.mapillary.svgToDataUri = svgToDataUri;
  window.createMapillaryIcon = createMapillaryIcon; CL.map.mapillary.createMapillaryIcon = createMapillaryIcon;
  window.toggleMapillaryTrafficSignsLayer = toggleMapillaryTrafficSignsLayer; CL.map.mapillary.toggleMapillaryTrafficSignsLayer = toggleMapillaryTrafficSignsLayer;
  window.renderSignFilterItems = renderSignFilterItems; CL.map.mapillary.renderSignFilterItems = renderSignFilterItems;
  window.toggleSignFiltersPanel = toggleSignFiltersPanel; CL.map.mapillary.toggleSignFiltersPanel = toggleSignFiltersPanel;
  window.toggleSignFilter = toggleSignFilter; CL.map.mapillary.toggleSignFilter = toggleSignFilter;
  window.shouldShowSign = shouldShowSign; CL.map.mapillary.shouldShowSign = shouldShowSign;
  window.getSignFilterCategory = getSignFilterCategory; CL.map.mapillary.getSignFilterCategory = getSignFilterCategory;
  window.toggleMapillaryMapFeaturesLayer = toggleMapillaryMapFeaturesLayer; CL.map.mapillary.toggleMapillaryMapFeaturesLayer = toggleMapillaryMapFeaturesLayer;
  window.addMapillaryTrafficSignsLayer = addMapillaryTrafficSignsLayer; CL.map.mapillary.addMapillaryTrafficSignsLayer = addMapillaryTrafficSignsLayer;
  window.removeMapillaryTrafficSignsLayer = removeMapillaryTrafficSignsLayer; CL.map.mapillary.removeMapillaryTrafficSignsLayer = removeMapillaryTrafficSignsLayer;
  window.addMapillaryMapFeaturesLayer = addMapillaryMapFeaturesLayer; CL.map.mapillary.addMapillaryMapFeaturesLayer = addMapillaryMapFeaturesLayer;
  window.removeMapillaryMapFeaturesLayer = removeMapillaryMapFeaturesLayer; CL.map.mapillary.removeMapillaryMapFeaturesLayer = removeMapillaryMapFeaturesLayer;
  window.saveMapillarySubLayersVisibility = saveMapillarySubLayersVisibility; CL.map.mapillary.saveMapillarySubLayersVisibility = saveMapillarySubLayersVisibility;
  window.loadMapillarySubLayersVisibility = loadMapillarySubLayersVisibility; CL.map.mapillary.loadMapillarySubLayersVisibility = loadMapillarySubLayersVisibility;
  window.addMapillaryTrafficSignsViaGraphAPI = addMapillaryTrafficSignsViaGraphAPI; CL.map.mapillary.addMapillaryTrafficSignsViaGraphAPI = addMapillaryTrafficSignsViaGraphAPI;
  window.debounceTrafficSignsRefresh = debounceTrafficSignsRefresh; CL.map.mapillary.debounceTrafficSignsRefresh = debounceTrafficSignsRefresh;
  window.refreshTrafficSignsFromGraphAPI = refreshTrafficSignsFromGraphAPI; CL.map.mapillary.refreshTrafficSignsFromGraphAPI = refreshTrafficSignsFromGraphAPI;
  window.removeMapillaryTrafficSignsGraphAPI = removeMapillaryTrafficSignsGraphAPI; CL.map.mapillary.removeMapillaryTrafficSignsGraphAPI = removeMapillaryTrafficSignsGraphAPI;
  window.addMapillaryMapFeaturesViaGraphAPI = addMapillaryMapFeaturesViaGraphAPI; CL.map.mapillary.addMapillaryMapFeaturesViaGraphAPI = addMapillaryMapFeaturesViaGraphAPI;
  window.refreshMapFeaturesFromGraphAPI = refreshMapFeaturesFromGraphAPI; CL.map.mapillary.refreshMapFeaturesFromGraphAPI = refreshMapFeaturesFromGraphAPI;
  window.removeMapillaryMapFeaturesGraphAPI = removeMapillaryMapFeaturesGraphAPI; CL.map.mapillary.removeMapillaryMapFeaturesGraphAPI = removeMapillaryMapFeaturesGraphAPI;
  CL._registerModule('map/map-mapillary');
})();
