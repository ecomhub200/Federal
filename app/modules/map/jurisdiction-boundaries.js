/**
 * CL map.boundaries — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.map.boundaries.<fn>.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Toggle the jurisdiction boundary layer on the map
 * Fetches official Census boundary from TIGERweb API
 */
function toggleJurisdictionBoundaryLayer(show) {
    console.log(`[TIGERweb] Toggle jurisdiction boundary: ${show}`);

    if (show) {
        builtInLayersState.jurisdictionBoundary.enabled = true;
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            if (crashMap) {
                addJurisdictionBoundaryLayer(jurisdictionId);
            } else {
                console.log('[TIGERweb] Map not ready yet, boundary will load when map initializes');
                builtInLayersState.jurisdictionBoundary.status = 'ready';
            }
        } else {
            console.log('[TIGERweb] No jurisdiction selected');
            builtInLayersState.jurisdictionBoundary.status = 'ready';
            if (typeof showNotification === 'function') {
                showNotification('Please select a jurisdiction first to display the boundary', 'info');
            }
        }
    } else {
        builtInLayersState.jurisdictionBoundary.enabled = false;
        removeJurisdictionBoundaryLayer();
    }

    // Save state and update UI
    saveJurisdictionBoundaryVisibility();
    updateMapAssetPanel();
}

/**
 * Ensure the jurisdiction boundary is visible on the map.
 * Idempotent — safe to call from any code path (init, tab switch, jurisdiction change).
 * Handles: layer missing, layer in state but not on map, already showing (no-op).
 */
function ensureJurisdictionBoundary() {
    const jb = builtInLayersState?.jurisdictionBoundary;
    if (!jb?.enabled || !crashMap) return;

    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    if (!jurisdictionId || !appConfig?.jurisdictions[jurisdictionId]) return;

    const activeTier = jurisdictionContext?.viewTier;
    if (activeTier && activeTier !== 'county') return;

    // Layer exists — verify it's actually on the map
    if (jb.layer) {
        if (crashMap.hasLayer(jb.layer)) return; // all good
        console.log('[TIGERweb] Boundary layer in state but not on map, re-adding');
        try {
            jb.layer.addTo(crashMap);
            if (crashMap.hasLayer(jb.layer)) {
                jb.status = 'active';
                updateMapAssetPanel();
                return;
            }
        } catch (e) {
            console.warn('[TIGERweb] Failed to re-add detached layer:', e.message);
        }
        // Re-add failed — clear stale layer reference and fall through to fresh load
        jb.layer = null;
        jb.status = 'ready';
    }

    if (jb.status === 'loading') return; // fetch already in flight
    console.log('[TIGERweb] ensureJurisdictionBoundary → loading boundary for:', jurisdictionId);
    addJurisdictionBoundaryLayer(jurisdictionId);
}

/**
 * Add the jurisdiction boundary layer to the map
 * Fetches from TIGERweb Census API and caches the result
 */
async function addJurisdictionBoundaryLayer(jurisdictionId) {
    if (!crashMap) {
        console.warn('[TIGERweb] Map not initialized');
        return false;
    }

    const tigerwebConfig = appConfig?.apis?.tigerweb;
    if (!tigerwebConfig?.enabled) {
        console.warn('[TIGERweb] TIGERweb API not enabled in config');
        return false;
    }

    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    if (!jurisdiction) {
        console.warn('[TIGERweb] Jurisdiction not found:', jurisdictionId);
        return false;
    }

    // Track request to handle race conditions
    const requestId = Date.now();
    builtInLayersState.jurisdictionBoundary._currentRequestId = requestId;

    // Remove existing layer if showing different jurisdiction
    if (builtInLayersState.jurisdictionBoundary.currentJurisdictionId !== jurisdictionId) {
        removeJurisdictionBoundaryLayer();
    }

    // Check cache first
    if (builtInLayersState.jurisdictionBoundary.geojsonCache[jurisdictionId]) {
        console.log('[TIGERweb] Using cached boundary for:', jurisdiction.name);
        try {
            displayJurisdictionBoundary(
                builtInLayersState.jurisdictionBoundary.geojsonCache[jurisdictionId],
                jurisdictionId
            );
            return true;
        } catch (cacheError) {
            console.error('[TIGERweb] Cached display failed, clearing cache and retrying:', cacheError);
            delete builtInLayersState.jurisdictionBoundary.geojsonCache[jurisdictionId];
            // Fall through to fetch fresh data from TIGERweb
        }
    }

    // Set loading state
    builtInLayersState.jurisdictionBoundary.status = 'loading';
    updateMapAssetPanel();

    try {
        // Build TIGERweb API URL
        // Virginia counties and independent cities both use the county layer (82)
        // Counties have 3-digit FIPS (001-199), independent cities have 3-digit FIPS (510+)
        const stateFips = tigerwebConfig.stateFips || jurisdictionContext?.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08');
        const countyFips = jurisdiction.fips;
        const layerId = tigerwebConfig.layers?.counties || 82;

        // Properly encode the WHERE clause for the API
        const whereClause = `STATE='${stateFips}' AND COUNTY='${countyFips}'`;
        const encodedWhere = encodeURIComponent(whereClause);

        const apiUrl = `${tigerwebConfig.baseUrl}/${layerId}/query?` +
            `where=${encodedWhere}` +
            `&outFields=NAME,COUNTY,STATE,GEOID` +
            `&returnGeometry=true` +
            `&outSR=4326` +
            `&f=geojson`;

        console.log('[TIGERweb] Fetching boundary from:', apiUrl);

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        let response;
        try {
            response = await fetch(apiUrl, { signal: controller.signal });
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timed out after 30 seconds');
            }
            throw fetchError;
        }
        clearTimeout(timeoutId);

        // Check if this request is still the latest (handle race condition)
        if (builtInLayersState.jurisdictionBoundary._currentRequestId !== requestId) {
            console.log('[TIGERweb] Request superseded by newer request, discarding');
            return false;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const geojson = await response.json();

        // Check again after parsing JSON (handle race condition)
        if (builtInLayersState.jurisdictionBoundary._currentRequestId !== requestId) {
            console.log('[TIGERweb] Request superseded by newer request, discarding');
            return false;
        }

        if (!geojson.features || geojson.features.length === 0) {
            throw new Error('No boundary data returned for jurisdiction');
        }

        // Cache the result
        builtInLayersState.jurisdictionBoundary.geojsonCache[jurisdictionId] = geojson;

        // Display if still enabled
        if (builtInLayersState.jurisdictionBoundary.enabled) {
            displayJurisdictionBoundary(geojson, jurisdictionId);
        }

        console.log('[TIGERweb] Boundary loaded for:', jurisdiction.name);
        return true;

    } catch (error) {
        // Only update error state if this is still the current request
        if (builtInLayersState.jurisdictionBoundary._currentRequestId === requestId) {
            console.error('[TIGERweb] Error fetching boundary:', error);
            builtInLayersState.jurisdictionBoundary.status = 'error';
            builtInLayersState.jurisdictionBoundary.lastError = error.message;

            // Show notification if function exists
            if (typeof showNotification === 'function') {
                showNotification(`Failed to load boundary: ${error.message}`, 'warning');
            }

            updateMapAssetPanel();
        }
        return false;
    }
}

/**
 * Display the jurisdiction boundary GeoJSON on the map
 */
function displayJurisdictionBoundary(geojson, jurisdictionId) {
    // Remove existing layer
    removeJurisdictionBoundaryLayer();

    const styleConfig = appConfig?.apis?.tigerweb?.boundaryStyle || {
        color: '#1e3a8a',
        weight: 3,
        fillColor: '#1e3a8a',
        fillOpacity: 0.05,
        dashArray: '8, 4'
    };

    // Create GeoJSON layer with styling
    const boundaryLayer = L.geoJSON(geojson, {
        pane: 'jurisdictionBoundaryPane',
        style: {
            color: styleConfig.color,
            weight: styleConfig.weight,
            fillColor: styleConfig.fillColor,
            fillOpacity: styleConfig.fillOpacity,
            dashArray: styleConfig.dashArray,
            lineCap: 'round',
            lineJoin: 'round'
        },
        onEachFeature: function(feature, layer) {
            // Add popup with jurisdiction info
            const props = feature.properties;
            const popupContent = `
                <div style="text-align:center;padding:0.5rem;">
                    <div style="font-weight:600;margin-bottom:0.25rem;">${props.NAME || 'Jurisdiction Boundary'}</div>
                    <div style="font-size:0.8rem;color:#666;">
                        FIPS: ${props.STATE || jurisdictionContext?.stateFips || '08'}-${props.COUNTY || ''}
                    </div>
                    <div style="font-size:0.75rem;color:#888;margin-top:0.25rem;">
                        Source: US Census Bureau TIGERweb
                    </div>
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    });

    // Add to map
    boundaryLayer.addTo(crashMap);

    // Verify the layer was actually added to the map
    if (!crashMap.hasLayer(boundaryLayer)) {
        console.error('[TIGERweb] Layer addTo succeeded but hasLayer returns false');
        builtInLayersState.jurisdictionBoundary.status = 'error';
        builtInLayersState.jurisdictionBoundary.lastError = 'Layer failed to render on map';
        updateMapAssetPanel();
        return;
    }

    // Update state
    builtInLayersState.jurisdictionBoundary.layer = boundaryLayer;
    builtInLayersState.jurisdictionBoundary.currentJurisdictionId = jurisdictionId;
    builtInLayersState.jurisdictionBoundary.status = 'active';
    builtInLayersState.jurisdictionBoundary.lastError = null;

    // Add TIGERweb attribution
    addTigerwebAttribution();

    updateMapAssetPanel();
}

/**
 * Remove the jurisdiction boundary layer from the map
 */
function removeJurisdictionBoundaryLayer() {
    if (builtInLayersState.jurisdictionBoundary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.jurisdictionBoundary.layer);
        builtInLayersState.jurisdictionBoundary.layer = null;
        console.log('[TIGERweb] Boundary layer removed from map');
    }

    // Remove attribution
    removeTigerwebAttribution();

    // Reset status but keep cache
    builtInLayersState.jurisdictionBoundary.status = 'ready';
    builtInLayersState.jurisdictionBoundary.currentJurisdictionId = null;
}

/**
 * Add TIGERweb attribution to the map
 */
function addTigerwebAttribution() {
    if (crashMap?.attributionControl && !crashMap.attributionControl._tigerwebAdded) {
        crashMap.attributionControl.addAttribution(
            '© <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html" target="_blank" rel="noopener">US Census Bureau</a>'
        );
        crashMap.attributionControl._tigerwebAdded = true;
    }
}

/**
 * Remove TIGERweb attribution from the map
 */
function removeTigerwebAttribution() {
    if (crashMap?.attributionControl && crashMap.attributionControl._tigerwebAdded) {
        crashMap.attributionControl.removeAttribution(
            '© <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html" target="_blank" rel="noopener">US Census Bureau</a>'
        );
        crashMap.attributionControl._tigerwebAdded = false;
    }
}

// ============================================================
// MPO BOUNDARY DISPLAY — Renders BTS NTAD MPO boundaries on map
// ============================================================

/**
 * Display an MPO boundary on the map from BTS NTAD GeoJSON data.
 * @param {Object} geojson - GeoJSON FeatureCollection from BTS API
 * @param {string} mpoId - Internal MPO ID from hierarchy
 * @param {string} mpoName - Display name of the MPO
 */
function displayMPOBoundary(geojson, mpoId, mpoName) {
    // Remove existing MPO boundary
    removeMPOBoundaryLayer();

    // Also ensure county jurisdiction boundary is cleared — MPO boundary takes precedence
    if (typeof removeJurisdictionBoundaryLayer === 'function') {
        removeJurisdictionBoundaryLayer();
        builtInLayersState.jurisdictionBoundary.enabled = false;
    }

    if (!geojson?.features?.length || !crashMap) return;

    const mpoStyle = {
        color: '#7c3aed',
        weight: 2.5,
        fillColor: '#8b5cf6',
        fillOpacity: 0.08,
        dashArray: '6, 4',
        lineCap: 'round',
        lineJoin: 'round'
    };

    const boundaryLayer = L.geoJSON(geojson, {
        pane: 'jurisdictionBoundaryPane',
        style: mpoStyle,
        onEachFeature: function(feature, layer) {
            const props = feature.properties || {};
            // Handle varying BTS API field names (same approach as BTS GeoData Validator)
            const displayName = props.MPO_NAME || props.NAME || props.MPO_name || mpoName || 'MPO Boundary';
            const acronym = props.ACRONYM || props.acronym || '';
            const pop = props.POP || props.POPULATION || props.pop || '';
            const state = props.STATE || props.STATES || props.state || '';
            const website = props.MPO_URL || props.WEBSITE || props.website || '';
            const mpoIdField = props.MPO_ID || props.mpo_id || '';
            const popFormatted = pop ? Number(pop).toLocaleString() : '';
            const popupContent = `
                <div style="text-align:center;padding:0.5rem;">
                    <div style="font-weight:600;margin-bottom:0.25rem;">${displayName}</div>
                    <div style="font-size:0.8rem;color:#666;">
                        ${acronym ? 'Acronym: ' + acronym : ''}
                        ${popFormatted ? ' | Pop: ' + popFormatted : ''}
                        ${state ? ' | State: ' + state : ''}
                    </div>
                    ${mpoIdField ? '<div style="font-size:0.75rem;color:#888;">MPO ID: ' + mpoIdField + '</div>' : ''}
                    <div style="font-size:0.75rem;color:#888;margin-top:0.25rem;">
                        Source: BTS NTAD Metropolitan Planning Organizations
                    </div>
                    ${website ? '<a href="' + website + '" target="_blank" rel="noopener" style="font-size:0.75rem;">MPO Website</a>' : ''}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    });

    boundaryLayer.addTo(crashMap);

    // Fit map to MPO boundary
    try {
        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) {
            safeFlyToBounds(crashMap, bounds, { padding: [50, 50], duration: 1.2, maxZoom: 13 });
        }
    } catch (e) {
        console.warn('[MPOBoundary] Could not fit to bounds:', e.message);
    }

    builtInLayersState.mpoBoundary.layer = boundaryLayer;
    builtInLayersState.mpoBoundary.currentMpoId = mpoId;
    builtInLayersState.mpoBoundary.status = 'active';
    builtInLayersState.mpoBoundary.enabled = true;
    builtInLayersState.mpoBoundary.lastError = null;

    // Add BTS attribution
    addBTSMPOAttribution();
    updateMapAssetPanel();

    console.log(`[MPOBoundary] Displayed boundary for ${mpoName || mpoId}`);
}

/**
 * Remove the MPO boundary layer from the map.
 */
function removeMPOBoundaryLayer() {
    if (builtInLayersState.mpoBoundary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.mpoBoundary.layer);
        builtInLayersState.mpoBoundary.layer = null;
        console.log('[MPOBoundary] Layer removed from map');
    }
    builtInLayersState.mpoBoundary.status = 'ready';
    builtInLayersState.mpoBoundary.currentMpoId = null;
    builtInLayersState.mpoBoundary.enabled = false;
    removeBTSMPOAttribution();
}

/**
 * Display a DOT district/region boundary rectangle on the map using mapBounds.
 * @param {Object} region - Region object from hierarchy with mapBounds
 * @param {string} regionId - Internal region ID
 */
function displayRegionBoundary(region, regionId) {
    removeRegionBoundaryLayer();

    // Also ensure county jurisdiction boundary is cleared — region boundary takes precedence
    if (typeof removeJurisdictionBoundaryLayer === 'function') {
        removeJurisdictionBoundaryLayer();
        builtInLayersState.jurisdictionBoundary.enabled = false;
    }

    if (!region?.mapBounds || !crashMap) {
        // Fallback: fly to center/zoom if no bounds. Guard against null
        // crashMap — without this guard the "no bounds + no map" branch
        // throws TypeError: Cannot read properties of null (reading 'flyTo')
        // and aborts the calling tier handler before it reaches the
        // Supabase bridge fetch.
        if (region?.center && crashMap && typeof crashMap.flyTo === 'function') {
            safeFlyTo(crashMap, [region.center[1], region.center[0]], region.zoom || 8, { duration: 1.2 });
        }
        return;
    }

    const bounds = L.latLngBounds(
        L.latLng(region.mapBounds.sw[0], region.mapBounds.sw[1]),
        L.latLng(region.mapBounds.ne[0], region.mapBounds.ne[1])
    );

    const regionStyle = {
        color: '#2563eb',
        weight: 2,
        fillColor: '#3b82f6',
        fillOpacity: 0.06,
        dashArray: '8, 4'
    };

    const boundaryLayer = L.rectangle(bounds, regionStyle);
    boundaryLayer.bindPopup(`
        <div style="text-align:center;padding:0.5rem;">
            <div style="font-weight:600;margin-bottom:0.25rem;">${region.name || 'DOT District'}</div>
            <div style="font-size:0.8rem;color:#666;">
                ${region.counties?.length || 0} counties
                ${region.hq ? ' | HQ: ' + region.hq : ''}
            </div>
        </div>
    `);
    boundaryLayer.addTo(crashMap);

    safeFlyToBounds(crashMap, bounds, { padding: [50, 50], duration: 1.2, maxZoom: region.zoom || 10 });

    builtInLayersState.regionBoundary.layer = boundaryLayer;
    builtInLayersState.regionBoundary.currentRegionId = regionId;
    builtInLayersState.regionBoundary.status = 'active';
    builtInLayersState.regionBoundary.enabled = true;

    updateMapAssetPanel();
    console.log(`[RegionBoundary] Displayed boundary for ${region.name || regionId}`);
}

/**
 * Remove the region boundary layer from the map.
 */
function removeRegionBoundaryLayer() {
    if (builtInLayersState.regionBoundary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.regionBoundary.layer);
        builtInLayersState.regionBoundary.layer = null;
    }
    builtInLayersState.regionBoundary.status = 'ready';
    builtInLayersState.regionBoundary.currentRegionId = null;
    builtInLayersState.regionBoundary.enabled = false;
}

// ============================================================
// PLANNING DISTRICT BOUNDARY — hierarchy mapBounds rectangle (mirrors region)
// ============================================================

/**
 * Display a planning district boundary on the map. Prefers hierarchy mapBounds
 * (same approach as region), falls back to center+zoom if only a center is known.
 * Uses a distinct teal color scheme to visually differentiate from region (blue) and MPO (purple).
 */
function displayPlanningDistrictBoundary(pd, pdId) {
    removePlanningDistrictBoundaryLayer();

    // Clear competing boundaries — PD takes precedence while selected
    if (typeof removeJurisdictionBoundaryLayer === 'function') {
        removeJurisdictionBoundaryLayer();
        builtInLayersState.jurisdictionBoundary.enabled = false;
    }

    if (!crashMap) return;

    if (!pd?.mapBounds) {
        if (pd?.center) {
            safeFlyTo(crashMap, [pd.center[1], pd.center[0]], pd.zoom || 9, { duration: 1.2 });
        }
        return;
    }

    const bounds = L.latLngBounds(
        L.latLng(pd.mapBounds.sw[0], pd.mapBounds.sw[1]),
        L.latLng(pd.mapBounds.ne[0], pd.mapBounds.ne[1])
    );

    const pdStyle = {
        color: '#0e7490',
        weight: 2,
        fillColor: '#14b8a6',
        fillOpacity: 0.06,
        dashArray: '4 4'
    };

    const boundaryLayer = L.rectangle(bounds, pdStyle);
    boundaryLayer.bindPopup(`
        <div style="text-align:center;padding:0.5rem;">
            <div style="font-weight:600;margin-bottom:0.25rem;">${pd.name || 'Planning District'}</div>
            <div style="font-size:0.8rem;color:#666;">
                ${pd.counties?.length ? pd.counties.length + ' counties' : ''}
            </div>
        </div>
    `);
    boundaryLayer.addTo(crashMap);

    safeFlyToBounds(crashMap, bounds, { padding: [40, 40], duration: 1.2, maxZoom: pd.zoom || 10 });

    builtInLayersState.planningDistrictBoundary.layer = boundaryLayer;
    builtInLayersState.planningDistrictBoundary.currentPdId = pdId;
    builtInLayersState.planningDistrictBoundary.status = 'active';
    builtInLayersState.planningDistrictBoundary.enabled = true;

    if (typeof updateMapAssetPanel === 'function') updateMapAssetPanel();
    console.log(`[PDBoundary] Displayed boundary for ${pd.name || pdId}`);
}

function removePlanningDistrictBoundaryLayer() {
    if (builtInLayersState.planningDistrictBoundary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.planningDistrictBoundary.layer);
        builtInLayersState.planningDistrictBoundary.layer = null;
    }
    builtInLayersState.planningDistrictBoundary.status = 'ready';
    builtInLayersState.planningDistrictBoundary.currentPdId = null;
    builtInLayersState.planningDistrictBoundary.enabled = false;
}

// ============================================================
// CITY / TOWN BOUNDARY — TIGERweb Places + County Subdivisions
// ============================================================

/**
 * Display a city / town / township boundary from TIGERweb. Incorporated places
 * and CDPs come from BoundaryService.getPlaceByNameAndState (layers 28/30);
 * townships fall through to getCountySubdivisions (layer 22). Boundary fetches
 * are cached per state via the existing BoundaryService cache.
 *
 * displayName is used to strip the LSAD suffix ("city", "town", "village",
 * "CDP", "borough", "township") before querying TIGERweb by NAME.
 */
async function displayCityBoundary(citySlug, displayName, placeType) {
    removeCityBoundaryLayer();

    if (typeof removeJurisdictionBoundaryLayer === 'function') {
        removeJurisdictionBoundaryLayer();
        builtInLayersState.jurisdictionBoundary.enabled = false;
    }

    if (!crashMap) return;

    let stateFips = null;
    if (typeof _getCurrentStateFips === 'function') {
        stateFips = _getCurrentStateFips();
    } else if (typeof HierarchyRegistry !== 'undefined') {
        stateFips = HierarchyRegistry.getData()?.state?.fips || null;
    }
    if (!stateFips) {
        console.warn('[CityBoundary] Could not determine state FIPS; aborting');
        return;
    }

    const placeName = String(displayName || '')
        .replace(/\s+(city|town|village|CDP|borough|township|municipality)$/i, '')
        .trim();
    if (!placeName) return;

    let geo = null;
    try {
        if (placeType === 'township') {
            const fc = await BoundaryService.getCountySubdivisions(stateFips);
            const matches = (fc?.features || []).filter(f =>
                String(f.properties?.NAME || '').toLowerCase() === placeName.toLowerCase()
            );
            if (matches.length) geo = { type: 'FeatureCollection', features: matches };
        } else {
            geo = await BoundaryService.getPlaceByNameAndState(stateFips, placeName);
        }
    } catch (e) {
        console.warn('[CityBoundary] TIGERweb query failed:', e.message);
    }

    if (!geo?.features?.length) {
        console.log(`[CityBoundary] No features for "${placeName}" in state ${stateFips}`);
        return;
    }

    const cityStyle = {
        color: '#b45309',
        weight: 2,
        fillColor: '#f59e0b',
        fillOpacity: 0.08,
        dashArray: '3 3'
    };

    const boundaryLayer = L.geoJSON(geo, {
        style: cityStyle,
        onEachFeature: function(feature, layer) {
            const p = feature.properties || {};
            const name = p.NAME || displayName || 'Place';
            const geoid = p.GEOID || p.PLACEFP || p.COUSUB || '';
            layer.bindPopup(`
                <div style="text-align:center;padding:0.5rem;">
                    <div style="font-weight:600;margin-bottom:0.25rem;">${name}</div>
                    <div style="font-size:0.75rem;color:#666;">Type: ${placeType || 'place'}${geoid ? ' | GEOID: ' + geoid : ''}</div>
                    <div style="font-size:0.7rem;color:#888;margin-top:0.25rem;">Source: TIGERweb Census</div>
                </div>
            `);
        }
    });
    boundaryLayer.addTo(crashMap);

    try {
        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) {
            safeFlyToBounds(crashMap, bounds, { padding: [40, 40], duration: 1.2, maxZoom: 14 });
        }
    } catch (e) {
        console.warn('[CityBoundary] Could not fit to bounds:', e.message);
    }

    builtInLayersState.cityBoundary.layer = boundaryLayer;
    builtInLayersState.cityBoundary.currentCitySlug = citySlug;
    builtInLayersState.cityBoundary.status = 'active';
    builtInLayersState.cityBoundary.enabled = true;

    if (typeof updateMapAssetPanel === 'function') updateMapAssetPanel();

    // Re-render map markers with the new boundary so the dots are clipped
    // to the city scope (getFilteredMapPoints reads cityBoundary.layer).
    try {
        if (typeof updateMapDisplay === 'function') updateMapDisplay();
    } catch (_e) { /* non-fatal */ }

    console.log(`[CityBoundary] Displayed boundary for ${displayName || citySlug}`);
}

function removeCityBoundaryLayer() {
    if (builtInLayersState.cityBoundary.layer && crashMap) {
        crashMap.removeLayer(builtInLayersState.cityBoundary.layer);
        builtInLayersState.cityBoundary.layer = null;
    }
    builtInLayersState.cityBoundary.status = 'ready';
    builtInLayersState.cityBoundary.currentCitySlug = null;
    builtInLayersState.cityBoundary.enabled = false;

    // Re-render so any stale city-clipped markers expand back out.
    try {
        if (typeof updateMapDisplay === 'function' && typeof crashMap !== 'undefined' && crashMap) {
            updateMapDisplay();
        }
    } catch (_e) { /* non-fatal */ }
}

function addBTSMPOAttribution() {
    if (crashMap?.attributionControl && !crashMap.attributionControl._btsMpoAdded) {
        crashMap.attributionControl.addAttribution(
            '© <a href="https://data-usdot.opendata.arcgis.com/" target="_blank" rel="noopener">BTS NTAD</a>'
        );
        crashMap.attributionControl._btsMpoAdded = true;
    }
}

function removeBTSMPOAttribution() {
    if (crashMap?.attributionControl && crashMap.attributionControl._btsMpoAdded) {
        crashMap.attributionControl.removeAttribution(
            '© <a href="https://data-usdot.opendata.arcgis.com/" target="_blank" rel="noopener">BTS NTAD</a>'
        );
        crashMap.attributionControl._btsMpoAdded = false;
    }
}

/**
 * Save jurisdiction boundary visibility state to localStorage
 */
function saveJurisdictionBoundaryVisibility() {
    try {
        localStorage.setItem('jurisdictionBoundaryEnabled', builtInLayersState.jurisdictionBoundary.enabled ? 'true' : 'false');
    } catch (e) {
        console.warn('[TIGERweb] Could not save visibility state:', e);
    }
}

/**
 * Load jurisdiction boundary visibility state from localStorage
 */
function loadJurisdictionBoundaryVisibility() {
    try {
        const tigerwebConfig = appConfig?.apis?.tigerweb;

        // Check if TIGERweb is enabled in config
        if (!tigerwebConfig?.enabled) {
            console.log('[TIGERweb] TIGERweb API not enabled in config');
            return;
        }

        // Always enable boundary layer by default on load
        // Users can still disable during session, but it will re-enable on next load
        builtInLayersState.jurisdictionBoundary.enabled = true;
        console.log('[TIGERweb] Boundary layer enabled by default');

        // Load the boundary for selected jurisdiction
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            if (crashMap) {
                console.log('[TIGERweb] Loading boundary for:', jurisdictionId);
                addJurisdictionBoundaryLayer(jurisdictionId);
            } else {
                // Map not ready - mark for deferred load (don't set status to 'loading' since no request is in flight)
                console.log('[TIGERweb] Map not ready, marking boundary for deferred load');
                builtInLayersState.jurisdictionBoundary._pendingLoad = true;
            }
        } else {
            console.log('[TIGERweb] No jurisdiction selected, boundary will load when jurisdiction is selected');
        }

        // Update panel to show initial state
        if (typeof updateMapAssetPanel === 'function') {
            updateMapAssetPanel();
        }
    } catch (e) {
        console.warn('[TIGERweb] Could not load visibility state:', e);
    }
}

/**
 * Update jurisdiction boundary when jurisdiction selection changes
 * Called from applyJurisdictionSelection()
 * Auto-enables the boundary layer when a valid jurisdiction is selected
 */
function updateJurisdictionBoundary(jurisdictionId) {
    // Don't update if map is not initialized yet
    if (!crashMap) {
        console.log('[TIGERweb] Map not ready, boundary will load when map initializes');
        // Mark for deferred load if we have a valid jurisdiction
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            builtInLayersState.jurisdictionBoundary.enabled = true;
            builtInLayersState.jurisdictionBoundary._pendingLoad = true;
            builtInLayersState.jurisdictionBoundary._pendingJurisdiction = jurisdictionId;
        }
        return;
    }

    // Check if TIGERweb is enabled in config
    const tigerwebConfig = appConfig?.apis?.tigerweb;
    if (!tigerwebConfig?.enabled) {
        console.log('[TIGERweb] TIGERweb API not enabled in config');
        return;
    }

    if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
        // Skip auto-enabling county boundary if a non-county tier (state/region/mpo/federal) is active
        const activeTier = jurisdictionContext?.viewTier;
        if (activeTier && activeTier !== 'county') {
            console.log('[TIGERweb] Skipping county boundary — active tier is:', activeTier);
            return;
        }

        // Auto-enable the boundary layer when a jurisdiction is selected
        if (!builtInLayersState.jurisdictionBoundary.enabled) {
            console.log('[TIGERweb] Auto-enabling boundary layer for jurisdiction:', jurisdictionId);
            builtInLayersState.jurisdictionBoundary.enabled = true;
            saveJurisdictionBoundaryVisibility();

            // Update the checkbox in the Map Assets panel
            const checkbox = document.getElementById('mapAsset_jurisdictionBoundary');
            if (checkbox) {
                checkbox.checked = true;
            }
        }

        addJurisdictionBoundaryLayer(jurisdictionId);
    } else {
        removeJurisdictionBoundaryLayer();
    }

    // Update asset panel to show new jurisdiction name
    updateMapAssetPanel();
}

/**
 * Clear the jurisdiction boundary cache
 * Useful if boundaries need to be refreshed
 */
function clearJurisdictionBoundaryCache() {
    builtInLayersState.jurisdictionBoundary.geojsonCache = {};
    console.log('[TIGERweb] Boundary cache cleared');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.map = CL.map || {};
  CL.map.boundaries = CL.map.boundaries || {};
  window.toggleJurisdictionBoundaryLayer = toggleJurisdictionBoundaryLayer; CL.map.boundaries.toggleJurisdictionBoundaryLayer = toggleJurisdictionBoundaryLayer;
  window.ensureJurisdictionBoundary = ensureJurisdictionBoundary; CL.map.boundaries.ensureJurisdictionBoundary = ensureJurisdictionBoundary;
  window.addJurisdictionBoundaryLayer = addJurisdictionBoundaryLayer; CL.map.boundaries.addJurisdictionBoundaryLayer = addJurisdictionBoundaryLayer;
  window.displayJurisdictionBoundary = displayJurisdictionBoundary; CL.map.boundaries.displayJurisdictionBoundary = displayJurisdictionBoundary;
  window.removeJurisdictionBoundaryLayer = removeJurisdictionBoundaryLayer; CL.map.boundaries.removeJurisdictionBoundaryLayer = removeJurisdictionBoundaryLayer;
  window.addTigerwebAttribution = addTigerwebAttribution; CL.map.boundaries.addTigerwebAttribution = addTigerwebAttribution;
  window.removeTigerwebAttribution = removeTigerwebAttribution; CL.map.boundaries.removeTigerwebAttribution = removeTigerwebAttribution;
  window.displayMPOBoundary = displayMPOBoundary; CL.map.boundaries.displayMPOBoundary = displayMPOBoundary;
  window.removeMPOBoundaryLayer = removeMPOBoundaryLayer; CL.map.boundaries.removeMPOBoundaryLayer = removeMPOBoundaryLayer;
  window.displayRegionBoundary = displayRegionBoundary; CL.map.boundaries.displayRegionBoundary = displayRegionBoundary;
  window.removeRegionBoundaryLayer = removeRegionBoundaryLayer; CL.map.boundaries.removeRegionBoundaryLayer = removeRegionBoundaryLayer;
  window.displayPlanningDistrictBoundary = displayPlanningDistrictBoundary; CL.map.boundaries.displayPlanningDistrictBoundary = displayPlanningDistrictBoundary;
  window.removePlanningDistrictBoundaryLayer = removePlanningDistrictBoundaryLayer; CL.map.boundaries.removePlanningDistrictBoundaryLayer = removePlanningDistrictBoundaryLayer;
  window.displayCityBoundary = displayCityBoundary; CL.map.boundaries.displayCityBoundary = displayCityBoundary;
  window.removeCityBoundaryLayer = removeCityBoundaryLayer; CL.map.boundaries.removeCityBoundaryLayer = removeCityBoundaryLayer;
  window.addBTSMPOAttribution = addBTSMPOAttribution; CL.map.boundaries.addBTSMPOAttribution = addBTSMPOAttribution;
  window.removeBTSMPOAttribution = removeBTSMPOAttribution; CL.map.boundaries.removeBTSMPOAttribution = removeBTSMPOAttribution;
  window.saveJurisdictionBoundaryVisibility = saveJurisdictionBoundaryVisibility; CL.map.boundaries.saveJurisdictionBoundaryVisibility = saveJurisdictionBoundaryVisibility;
  window.loadJurisdictionBoundaryVisibility = loadJurisdictionBoundaryVisibility; CL.map.boundaries.loadJurisdictionBoundaryVisibility = loadJurisdictionBoundaryVisibility;
  window.updateJurisdictionBoundary = updateJurisdictionBoundary; CL.map.boundaries.updateJurisdictionBoundary = updateJurisdictionBoundary;
  window.clearJurisdictionBoundaryCache = clearJurisdictionBoundaryCache; CL.map.boundaries.clearJurisdictionBoundaryCache = clearJurisdictionBoundaryCache;
  CL._registerModule('map/jurisdiction-boundaries');
})();
