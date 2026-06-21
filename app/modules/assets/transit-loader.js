/**
 * CL assets.transitLoader — Transit data-loading (GTFS/GRTC/statewide/VA-open-data
 * fetch, parse, load stops, validate, save-as-asset). Verbatim, 2-segment cut leaving
 * the multi-line `transitState` const inline (read cross-tab by Asset-Deficiency).
 * TRANSIT_CONFIG also inline. NO behavior change. Dual-exposed window.<fn> +
 * CL.assets.transitLoader.<fn> (getCountyBounds generic, window-mirrored).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim, 2 segments) ───
// Initialize transit config from appConfig when available
function initTransitConfig() {
    if (window.appConfig?.transitStops) {
        const tc = window.appConfig.transitStops;
        TRANSIT_CONFIG = {
            serviceUrls: tc.serviceUrls || TRANSIT_CONFIG.serviceUrls,
            serviceUrl: tc.serviceUrl || TRANSIT_CONFIG.serviceUrl,
            countyField: tc.fields?.county || 'COUNTY',
            agencyField: tc.fields?.agency || 'AGENCY',
            stopNameField: tc.fields?.stopName || 'STOP_NAME',
            stopIdField: tc.fields?.stopId || 'STOP_ID',
            latField: tc.fields?.lat || 'LAT',
            lngField: tc.fields?.lng || 'LON',
            alternateFields: tc.alternateFields || TRANSIT_CONFIG.alternateFields,
            enableDemoFallback: tc.enableDemoFallback !== false
        };
        console.log('[Transit] Config loaded from appConfig:', TRANSIT_CONFIG.serviceUrls?.length || 1, 'endpoints configured');
    }
}

// Call init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTransitConfig);
} else {
    setTimeout(initTransitConfig, 100);
}

/**
 * Initialize the transit tab from jurisdictionContext.
 * No dropdown needed - syncs automatically from Upload Data selection.
 */
function transitInitCountyDropdown() {
    // Sync from jurisdictionContext instead of building a dropdown
    transitSyncFromContext();
    transitState.countyDropdownInitialized = true;
    console.log('[Transit] Jurisdiction synced from context:', jurisdictionContext.jurisdictionName);
}

/**
 * Sync the Transit Safety display and hidden select from jurisdictionContext.
 */
function transitSyncFromContext() {
    const ctx = jurisdictionContext;
    const nameEl = document.getElementById('transitJurisdictionName');
    const stateEl = document.getElementById('transitJurisdictionState');
    const hiddenSelect = document.getElementById('transitCountySelect');

    if (nameEl) {
        nameEl.textContent = ctx.jurisdictionName
            ? `${ctx.jurisdictionName}, ${ctx.stateCode}`
            : 'No jurisdiction selected';
    }
    if (stateEl) {
        stateEl.textContent = ctx.stateName
            ? `${ctx.stateName} | FIPS: ${ctx.fullFips}`
            : 'Select a jurisdiction on the Upload Data tab';
    }

    // Sync hidden select and transitState so transitLoadStops() works
    if (ctx.jurisdictionKey) {
        transitState.selectedCounty = ctx.jurisdictionKey;

        if (hiddenSelect) {
            let opt = hiddenSelect.querySelector(`option[value="${ctx.jurisdictionKey}"]`);
            if (!opt) {
                opt = document.createElement('option');
                opt.value = ctx.jurisdictionKey;
                opt.textContent = ctx.jurisdictionName;
                hiddenSelect.appendChild(opt);
            }
            hiddenSelect.value = ctx.jurisdictionKey;
        }
    }

    // Update tier scope display
    const tier = ctx.viewTier;
    const isHigherTier = (tier !== 'county' && tier !== 'city');
    const tierScopeDisplay = document.getElementById('transitTierScopeDisplay');
    const tierScopeNameEl = document.getElementById('transitTierScopeName');
    const tierScopeDetailEl = document.getElementById('transitTierScopeDetail');

    if (tierScopeDisplay) {
        if (isHigherTier) {
            tierScopeDisplay.style.display = 'flex';
            const scopeName = getTierScopeName();
            const countyFips = getCountyFIPSListForTier();
            const countyCount = countyFips?.length || 0;
            const tierLabel = { state: 'Statewide', region: 'Region', mpo: 'MPO' }[tier] || tier;

            if (tierScopeNameEl) tierScopeNameEl.textContent = scopeName;
            if (tierScopeDetailEl) {
                tierScopeDetailEl.textContent = countyCount > 0
                    ? `${tierLabel} view — ${countyCount} counties | Crash data: ${ctx.jurisdictionName || 'loaded county'}`
                    : `${tierLabel} view — select a ${tier} from the Scope Controls`;
            }
        } else {
            tierScopeDisplay.style.display = 'none';
        }
    }

    // Update load button state — enable for higher tiers
    const loadBtn = document.getElementById('transitLoadBtn');
    if (loadBtn) {
        if (isHigherTier) {
            const hasScope = tier === 'state' ? !!ctx.stateFips :
                             tier === 'region' ? !!ctx.tierRegion?.counties?.length :
                             tier === 'mpo' ? !!ctx.tierMpo?.counties?.length :
                             false;
            loadBtn.disabled = !hasScope;
        } else {
            loadBtn.disabled = !ctx.jurisdictionKey;
        }
    }

    // Update scope notice
    _updateTransitTierScopeNotice(tier);
}

/**
 * Handle county selection change (now driven by jurisdictionContext event).
 * Kept for backward compatibility.
 */
function transitOnCountyChange() {
    transitSyncFromContext();
}

/**
 * Quick select a county (kept for backward compatibility, but now rarely used).
 * @param {string} countyKey - Jurisdiction key
 */
function transitQuickSelect(countyKey) {
    transitState.selectedCounty = countyKey;
    const loadBtn = document.getElementById('transitLoadBtn');
    if (loadBtn) loadBtn.disabled = false;
    console.log(`[Transit] Quick selected: ${countyKey}`);
}

// Listen for jurisdiction changes and update Grants tab
document.addEventListener('jurisdictionChanged', function(e) {
    const newFips = e.detail?.stateFips;
    // Only refresh grants if the STATE actually changed (not just county)
    if (newFips && newFips !== grantState._lastStateFips) {
        grantState._lastStateFips = newFips;
        console.log('[Grants] State changed to:', e.detail?.stateName, '- refreshing grants tab');
        updateGrantsTabForState();
    }
});

// Listen for jurisdiction changes and update Transit Safety display
document.addEventListener('jurisdictionChanged', function(e) {
    transitSyncFromContext();
    // Reset the dropdown initialized flag so it re-syncs when tab is opened
    transitState.countyDropdownInitialized = false;

    // Clear old transit stops when jurisdiction changes
    const hasTransitAssets = assetState?.assets?.some(a =>
        a.type === 'bus_stop' || a.id?.startsWith('transit_')
    );
    if (hasTransitAssets) {
        console.log('[Transit] Jurisdiction changed, clearing old transit stops');
        transitClearStops();
    }

    console.log('[Transit] Jurisdiction context changed:', e.detail?.jurisdictionName);
});

/**
 * Clear all transit stops from assets
 */
function transitClearStops() {
    // Find and remove transit assets
    const transitAssetIds = assetState.assets
        .filter(a => a.type === 'bus_stop' || a.source === 'Virginia DRPT' || a.id?.startsWith('transit_'))
        .map(a => a.id);

    if (transitAssetIds.length === 0) {
        assetShowNotification('No transit stops to clear', 'info');
        return;
    }

    // Remove each transit asset
    transitAssetIds.forEach(id => {
        // Remove map layer and visibility state
        assetRemoveMapLayer(id);
        delete mapAssetVisibility[id];

        const idx = assetState.assets.findIndex(a => a.id === id);
        if (idx !== -1) {
            assetState.assets.splice(idx, 1);
        }
        const activeIdx = assetState.activeAssetIds.indexOf(id);
        if (activeIdx !== -1) {
            assetState.activeAssetIds.splice(activeIdx, 1);
        }
        // Remove from IndexedDB
        assetDbDelete(id);
    });

    // Persist visibility state
    saveMapAssetVisibility();

    // Clear associations
    assetState.associations.clear();

    // Save and update UI
    assetSaveSettings();
    assetRenderList();
    assetRenderResults();
    updateMapAssetPanel();

    assetShowNotification(`Cleared ${transitAssetIds.length} transit stop asset(s)`, 'success');
    console.log(`[Transit] Cleared ${transitAssetIds.length} transit assets`);
}

/**
 * Show status in transit panel
 */
function transitShowStatus(message, type = 'loading') {
    const statusEl = document.getElementById('transitStatus');
    if (!statusEl) return;

    statusEl.style.display = 'flex';
    statusEl.className = `arcgis-status ${type}`;

    if (type === 'loading') {
        statusEl.innerHTML = `<div class="arcgis-spinner"></div><span>${message}</span>`;
    } else {
        const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
        statusEl.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    }
}

/**
 * Hide transit status
 */
function transitHideStatus() {
    const statusEl = document.getElementById('transitStatus');
    if (statusEl) statusEl.style.display = 'none';
}

/**
 * Helper to get field value with fallback to alternate field names
 */
function transitGetFieldValue(attrs, fieldType) {
    const alternates = TRANSIT_CONFIG.alternateFields?.[fieldType] || [];
    const primaryField = TRANSIT_CONFIG[fieldType + 'Field'];

    // Try primary field first
    if (attrs[primaryField] !== undefined) return attrs[primaryField];

    // Try alternate fields
    for (const alt of alternates) {
        if (attrs[alt] !== undefined) return attrs[alt];
    }
    return null;
}

/**
 * Try to fetch GeoJSON data directly
 */
async function transitTryGeoJSON(url, bounds) {
    try {
        console.log(`[Transit] Trying GeoJSON: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            return { stops: [], error: `HTTP ${response.status}` };
        }

        const data = await response.json();

        // Handle GeoJSON FeatureCollection
        if (data.type === 'FeatureCollection' && data.features) {
            // Filter by bounds if provided
            let features = data.features;
            if (bounds) {
                features = features.filter(f => {
                    const coords = f.geometry?.coordinates;
                    if (!coords) return false;
                    const lng = coords[0], lat = coords[1];
                    return lat >= bounds.south && lat <= bounds.north &&
                           lng >= bounds.west && lng <= bounds.east;
                });
            }
            console.log(`[Transit] GeoJSON: ${features.length} features in bounds (${data.features.length} total)`);
            return { stops: features, error: null, source: 'geojson' };
        }

        return { stops: [], error: 'Invalid GeoJSON format' };
    } catch (e) {
        return { stops: [], error: e.message };
    }
}

/**
 * Try GRTC API for Richmond/Henrico area
 */
async function transitTryGRTC(bounds) {
    const grtcUrl = window.appConfig?.transitStops?.grtcApiUrl ||
                    'https://data.richmondgov.com/resource/dt8y-2apj.json';

    try {
        console.log(`[Transit] Trying GRTC API: ${grtcUrl}`);

        // Query with bounding box (require bounds - no hardcoded fallbacks)
        if (!bounds || !bounds.south || !bounds.north || !bounds.west || !bounds.east) {
            return { stops: [], error: 'No bounding box provided for GRTC query' };
        }
        const params = new URLSearchParams({
            '$limit': '5000',
            '$where': `latitude between ${bounds.south} and ${bounds.north} AND longitude between ${bounds.west} and ${bounds.east}`
        });

        const response = await fetch(`${grtcUrl}?${params}`);

        if (!response.ok) {
            return { stops: [], error: `HTTP ${response.status}` };
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            // Convert to standard format
            const features = data.map((item, idx) => ({
                attributes: {
                    STOP_NAME: item.stop_name || item.name || `GRTC Stop ${idx}`,
                    STOP_ID: item.stop_id || item.id || `GRTC-${idx}`,
                    AGENCY: 'GRTC Transit',
                    ROUTES: item.routes || ''
                },
                geometry: {
                    x: parseFloat(item.longitude || item.lng || item.lon),
                    y: parseFloat(item.latitude || item.lat)
                }
            })).filter(f => f.geometry.x && f.geometry.y);

            console.log(`[Transit] GRTC API: ${features.length} stops`);
            return { stops: features, error: null, source: 'grtc_api' };
        }

        return { stops: [], error: 'No data' };
    } catch (e) {
        return { stops: [], error: e.message };
    }
}

/**
 * Try Virginia Statewide Transit Stops (DRPT)
 * Source: https://data.virginia.gov/dataset/virginia-transit-routes-stops-gtfs-transit-services
 * Contains stops from ALL Virginia transit agencies (~40 providers)
 * Including: GRTC, HRT, NVTC agencies (Fairfax Connector, VRE, ART), Virginia Breeze, etc.
 */
async function transitTryStatewideData(bounds) {
    // BTS National Transit Map - Federal dataset with all US transit stops
    // This is maintained by Bureau of Transportation Statistics and is very reliable
    const nationalTransitUrl = 'https://services.arcgis.com/xOi1kZaI0eWDREZv/ArcGIS/rest/services/NTAD_National_Transit_Map_Stops/FeatureServer/0';

    try {
        console.log(`[Transit] Trying BTS National Transit Map: ${nationalTransitUrl}`);
        transitShowStatus('Trying National Transit Map Data...', 'loading');

        // Use spatial query to get stops within bounding box
        const queryParams = new URLSearchParams({
            where: '1=1',
            geometry: JSON.stringify({
                xmin: bounds.west,
                ymin: bounds.south,
                xmax: bounds.east,
                ymax: bounds.north,
                spatialReference: { wkid: 4326 }
            }),
            geometryType: 'esriGeometryEnvelope',
            spatialRel: 'esriSpatialRelIntersects',
            outFields: '*',
            outSR: '4326',
            f: 'json',
            resultRecordCount: 5000
        });

        const queryUrl = `${nationalTransitUrl}/query?${queryParams}`;
        console.log(`[Transit] Query URL: ${queryUrl}`);

        const response = await fetch(queryUrl);
        if (!response.ok) {
            console.log(`[Transit] National Transit Map HTTP ${response.status}`);
            return { stops: [], error: `HTTP ${response.status}` };
        }

        const data = await response.json();

        if (data.error) {
            console.log(`[Transit] National Transit Map API error:`, data.error);
            return { stops: [], error: data.error.message || 'API error' };
        }

        if (data.features && data.features.length > 0) {
            console.log(`[Transit] National Transit Map: ${data.features.length} stops found`);
            return { stops: data.features, error: null, source: 'bts_national_transit_map' };
        }

        return { stops: [], error: 'No stops found in area' };
    } catch (e) {
        console.log(`[Transit] National Transit Map error: ${e.message}`);
        return { stops: [], error: e.message };
    }
}

/**
 * Try Virginia Open Data Portal for GRTC GTFS stops (Richmond metro specific)
 * Source: https://data.virginia.gov/dataset/stops-grtc-gtfs
 * This is official GRTC transit data in standard GTFS format
 */
async function transitTryVirginiaOpenData(bounds) {
    // Virginia Open Data Portal GRTC GTFS stops endpoints
    // Try multiple potential URLs for the GTFS stops data
    const gtfsUrls = [
        // Direct CKAN resource downloads (most recent first)
        'https://data.virginia.gov/api/views/p59p-6zqm/rows.csv?accessType=DOWNLOAD',
        'https://data.virginia.gov/dataset/e0a5e880-0f30-4ab7-adc9-ebcc69362fd0/resource/p59p-6zqm/download/stops_jun2024.csv',
        // Alternative CKAN API format
        'https://data.virginia.gov/resource/p59p-6zqm.csv?$limit=10000'
    ];

    for (const gtfsUrl of gtfsUrls) {
        try {
            console.log(`[Transit] Trying Virginia Open Data (GRTC): ${gtfsUrl}`);
            transitShowStatus('Trying Virginia Open Data Portal...', 'loading');

            const response = await fetch(gtfsUrl, {
                headers: {
                    'Accept': 'text/csv, application/csv, */*'
                }
            });

            if (!response.ok) {
                console.log(`[Transit] Virginia Open Data HTTP ${response.status}`);
                continue;
            }

            const csvText = await response.text();

            // Parse GTFS CSV format
            const stops = transitParseGTFSCsv(csvText, bounds);

            if (stops.length > 0) {
                console.log(`[Transit] Virginia Open Data (GRTC): ${stops.length} stops loaded`);
                return { stops, error: null, source: 'virginia_open_data' };
            }
        } catch (e) {
            console.log(`[Transit] Virginia Open Data error: ${e.message}`);
        }
    }

    return { stops: [], error: 'All Virginia Open Data endpoints failed' };
}

/**
 * Parse GTFS CSV format for transit stops
 * Expected columns: stop_id, stop_code, stop_name, stop_desc, stop_lat, stop_lon, zone_id, stop_url, location_type, parent_station
 */
function transitParseGTFSCsv(csvText, bounds) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    // Parse header to get column indices
    const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    const colIndex = {
        stop_id: header.indexOf('stop_id'),
        stop_code: header.indexOf('stop_code'),
        stop_name: header.indexOf('stop_name'),
        stop_desc: header.indexOf('stop_desc'),
        stop_lat: header.indexOf('stop_lat'),
        stop_lon: header.indexOf('stop_lon'),
        zone_id: header.indexOf('zone_id')
    };

    // Verify required columns exist
    if (colIndex.stop_lat === -1 || colIndex.stop_lon === -1) {
        console.warn('[Transit] GTFS CSV missing required lat/lon columns');
        return [];
    }

    const stops = [];
    let skippedOutOfBounds = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Parse CSV line (handle quoted fields with commas)
        const values = transitParseCsvLine(line);

        const lat = parseFloat(values[colIndex.stop_lat]);
        const lon = parseFloat(values[colIndex.stop_lon]);

        // Validate coordinates
        if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) continue;

        // Filter by bounds if provided
        if (bounds) {
            if (lat < bounds.south || lat > bounds.north ||
                lon < bounds.west || lon > bounds.east) {
                skippedOutOfBounds++;
                continue;
            }
        }

        const stopName = values[colIndex.stop_name]?.replace(/"/g, '') || `Stop ${i}`;
        const stopId = values[colIndex.stop_id]?.replace(/"/g, '') || `GTFS-${i}`;
        const stopCode = values[colIndex.stop_code]?.replace(/"/g, '') || '';

        stops.push({
            attributes: {
                STOP_NAME: stopName,
                STOP_ID: stopId,
                STOP_CODE: stopCode,
                AGENCY: 'GRTC Transit',
                ROUTES: '',
                DATA_SOURCE: 'Virginia Open Data Portal (GTFS)'
            },
            geometry: {
                x: lon,
                y: lat
            }
        });
    }

    if (skippedOutOfBounds > 0) {
        console.log(`[Transit] GTFS: ${skippedOutOfBounds} stops outside bounds filtered`);
    }

    console.log(`[Transit] GTFS CSV parsed: ${stops.length} stops within bounds`);
    return stops;
}

/**
 * Parse a CSV line handling quoted fields that may contain commas
 */
function transitParseCsvLine(line) {
    const values = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    values.push(current.trim());

    return values;
}

/**
 * Try to query a single service endpoint
 */
async function transitTryEndpoint(serviceUrl, countyName, bounds) {
    const errors = [];
    let stops = [];

    // Check if this is a GeoJSON URL (various formats)
    if (serviceUrl.includes('.geojson') || serviceUrl.includes('format=geojson') || serviceUrl.includes('/geojson?')) {
        const result = await transitTryGeoJSON(serviceUrl, bounds);
        if (result.stops.length > 0) {
            transitState.serviceStatus[serviceUrl] = { status: 'ok', count: result.stops.length };
            return { stops: result.stops, errors: [], source: result.source };
        }
        if (result.error) {
            errors.push(`GeoJSON error: ${result.error}`);
            transitState.serviceStatus[serviceUrl] = { status: 'error', error: result.error };
        }
        return { stops: [], errors, source: null };
    }

    // First attempt: Spatial query with bounding box (most reliable - works for all jurisdictions)
    if (bounds) {
        try {
            const spatialUrl = `${serviceUrl}/query?` + new URLSearchParams({
                geometry: JSON.stringify({
                    xmin: bounds.west,
                    ymin: bounds.south,
                    xmax: bounds.east,
                    ymax: bounds.north,
                    spatialReference: { wkid: 4326 }
                }),
                geometryType: 'esriGeometryEnvelope',
                spatialRel: 'esriSpatialRelIntersects',
                outFields: '*',
                outSR: '4326',
                f: 'json'
            });

            console.log(`[Transit] Trying spatial query: ${serviceUrl}`);
            const response = await fetch(spatialUrl);

            if (response.ok) {
                const data = await response.json();
                if (!data.error && data.features && data.features.length > 0) {
                    stops = data.features;
                    transitState.serviceStatus[serviceUrl] = { status: 'ok', count: stops.length };
                    console.log(`[Transit] Found ${stops.length} stops by spatial query from ${serviceUrl}`);
                    return { stops, errors: [], source: 'spatial_query' };
                }
                if (data.error) {
                    errors.push(`Spatial query error: ${data.error.message || JSON.stringify(data.error)}`);
                }
            } else {
                errors.push(`Spatial query failed: HTTP ${response.status}`);
            }
        } catch (e) {
            errors.push(`Spatial query exception: ${e.message}`);
        }
    }

    // Second attempt: Query by county name (fallback - may not work on all endpoints)
    try {
        const queryUrl = `${serviceUrl}/query?` + new URLSearchParams({
            where: `UPPER(${TRANSIT_CONFIG.countyField}) LIKE '%${countyName}%'`,
            outFields: '*',
            outSR: '4326',
            f: 'json'
        });

        console.log(`[Transit] Trying county name query: ${serviceUrl}`);
        const response = await fetch(queryUrl);

        if (!response.ok) {
            errors.push(`County query failed: HTTP ${response.status}`);
            transitState.serviceStatus[serviceUrl] = { status: response.status, error: 'HTTP Error' };
        } else {
            const data = await response.json();
            if (data.error) {
                errors.push(`County query error: ${data.error.message || JSON.stringify(data.error)}`);
                transitState.serviceStatus[serviceUrl] = { status: 'error', error: data.error.message };
            } else if (data.features && data.features.length > 0) {
                stops = data.features;
                transitState.serviceStatus[serviceUrl] = { status: 'ok', count: stops.length };
                console.log(`[Transit] Found ${stops.length} stops by county name from ${serviceUrl}`);
                return { stops, errors: [], source: 'county_query' };
            }
        }
    } catch (e) {
        errors.push(`County query exception: ${e.message}`);
        transitState.serviceStatus[serviceUrl] = { status: 'error', error: e.message };
    }

    return { stops: [], errors, source: null };
}

/**
 * Load transit stops for selected county
 */
async function transitLoadStops() {
    if (!transitState.selectedCounty) {
        assetShowNotification('Please select a county first', 'warning');
        return;
    }

    const jurisdictions = window.appConfig?.jurisdictions || {};
    const jurisdiction = jurisdictions[transitState.selectedCounty];
    if (!jurisdiction) {
        assetShowNotification('Invalid jurisdiction selected', 'error');
        return;
    }

    const countyName = jurisdiction.name.replace(' County', '').replace(' City', '').toUpperCase();

    // Check if transit stops for this county are already loaded
    const existingTransitAsset = assetState?.assets?.find(a =>
        (a.type === 'bus_stop' || a.id?.startsWith('transit_')) &&
        a.name?.toUpperCase().includes(countyName)
    );
    if (existingTransitAsset) {
        assetShowNotification(`Transit stops for ${jurisdiction.name} already loaded (${existingTransitAsset.locationCount} stops)`, 'info');
        console.log(`[Transit] Skipping load - transit stops already exist for ${countyName}`);
        return;
    }
    const loadBtn = document.getElementById('transitLoadBtn');

    transitState.loading = true;
    transitState.lastError = null;
    transitState.serviceStatus = {};

    if (loadBtn) {
        loadBtn.disabled = true;
        loadBtn.innerHTML = '<div class="arcgis-spinner" style="display:inline-block;width:16px;height:16px;margin-right:8px"></div> Loading...';
    }

    transitShowStatus(`Querying transit stops for ${jurisdiction.name}...`, 'loading');
    console.log(`[Transit] Starting load for ${jurisdiction.name} (${countyName})`);

    try {
        const bounds = getCountyBounds(jurisdiction);
        let stops = [];
        let dataSource = null;
        const allErrors = [];

        // Get all service URLs to try
        const serviceUrls = TRANSIT_CONFIG.serviceUrls || [TRANSIT_CONFIG.serviceUrl];

        // Try each endpoint in order
        for (const serviceUrl of serviceUrls) {
            transitShowStatus(`Trying service: ${new URL(serviceUrl).hostname}...`, 'loading');

            const result = await transitTryEndpoint(serviceUrl, countyName, bounds);

            if (result.stops.length > 0) {
                stops = result.stops;
                dataSource = serviceUrl;
                console.log(`[Transit] SUCCESS: Got ${stops.length} stops from ${serviceUrl}`);
                break;
            }

            allErrors.push(...result.errors.map(e => `${new URL(serviceUrl).hostname}: ${e}`));
        }

        // If all endpoints failed, try alternative data sources
        if (stops.length === 0) {
            console.warn('[Transit] All service endpoints failed:', allErrors);
            console.log('[Transit] Service status:', transitState.serviceStatus);
            transitState.lastError = allErrors.join('; ');

            // Try statewide DRPT data with simpler query (works for ALL Virginia counties)
            transitShowStatus('Trying Virginia Statewide Transit Data...', 'loading');
            const statewideResult = await transitTryStatewideData(bounds);
            if (statewideResult.stops.length > 0) {
                stops = statewideResult.stops;
                dataSource = 'drpt_statewide';
                console.log(`[Transit] SUCCESS: Got ${stops.length} stops from DRPT Statewide Data`);
            } else {
                console.warn('[Transit] Statewide data failed:', statewideResult.error);

                // Richmond metro area counties - try GRTC API as fallback
                const richmondAreaCounties = ['henrico', 'chesterfield', 'hanover', 'richmond_city', 'goochland', 'powhatan'];

                if (richmondAreaCounties.includes(transitState.selectedCounty)) {
                    transitShowStatus('Trying GRTC transit data...', 'loading');
                    const grtcResult = await transitTryGRTC(bounds);
                    if (grtcResult.stops.length > 0) {
                        stops = grtcResult.stops;
                        dataSource = 'grtc_api';
                        console.log(`[Transit] SUCCESS: Got ${stops.length} stops from GRTC API`);
                    } else if (grtcResult.error) {
                        console.warn('[Transit] GRTC API failed:', grtcResult.error);
                    }
                }
            }

            // Try demo data fallback if still no data
            if (stops.length === 0 && TRANSIT_CONFIG.enableDemoFallback) {
                console.log('[Transit] Falling back to demo data');
                transitShowStatus('API unavailable - loading demo data...', 'warning');
                stops = transitGenerateDemoStops(jurisdiction);
                dataSource = 'demo';
            }
        }

        if (stops.length === 0) {
            const errorMsg = `No transit stops found. API may be unavailable. Check console for details.`;
            transitShowStatus(errorMsg, 'error');
            transitState.loading = false;
            if (loadBtn) {
                loadBtn.disabled = false;
                loadBtn.innerHTML = '🚌 Load Transit Stops';
            }
            assetShowNotification('Transit API unavailable. Try again later or check DRPT website.', 'warning');
            return;
        }

        // Convert to asset locations with flexible field mapping and boundary validation
        transitShowStatus('Validating stop locations against jurisdiction boundary...', 'loading');

        // Load the precise jurisdiction boundary polygon for point-in-polygon testing
        // Works dynamically for any state/county — resolves FIPS at runtime
        const jurisdictionId = transitState.selectedCounty;
        const boundaryFeature = await ensureJurisdictionBoundaryLoaded(jurisdictionId);
        const usePreciseBoundary = !!boundaryFeature;

        if (usePreciseBoundary) {
            console.log(`[Transit] Using precise jurisdiction boundary polygon for filtering`);
        } else {
            console.log(`[Transit] Jurisdiction boundary unavailable — falling back to bbox + distance filter`);
        }

        let totalProcessed = 0;
        let outsideBoundary = 0;

        const locations = stops.map((f, idx) => {
            const attrs = f.attributes || f.properties || f;
            const geom = f.geometry || {};

            // Handle different geometry formats
            let lat = geom.y;
            let lng = geom.x;

            // GeoJSON format
            if (geom.coordinates) {
                lng = geom.coordinates[0];
                lat = geom.coordinates[1];
            }

            // Fallback to attribute fields
            if (!lat || !lng) {
                lat = transitGetFieldValue(attrs, 'lat') || attrs.lat || attrs.LAT;
                lng = transitGetFieldValue(attrs, 'lng') || attrs.lon || attrs.LON || attrs.lng;
            }

            lat = parseFloat(lat);
            lng = parseFloat(lng);

            // Skip invalid coordinates
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                return null;
            }

            totalProcessed++;

            // Use precise point-in-polygon test against jurisdiction boundary
            if (usePreciseBoundary) {
                if (!pointInFeature(lng, lat, boundaryFeature)) {
                    outsideBoundary++;
                    return null;
                }
            } else {
                // Fallback: bbox + distance validation when boundary polygon unavailable
                const validation = transitValidateLocation(lat, lng, jurisdiction, bounds);
                if (!validation.valid) {
                    outsideBoundary++;
                    return null;
                }
            }

            return {
                id: `transit_${idx}`,
                name: transitGetFieldValue(attrs, 'stopName') || `Stop ${idx + 1}`,
                lat: lat,
                lng: lng,
                inBounds: true,
                metadata: {
                    stopId: transitGetFieldValue(attrs, 'stopId') || `S${idx}`,
                    agency: transitGetFieldValue(attrs, 'agency') || 'Transit Agency',
                    routes: attrs.routes || attrs.ROUTES || '',
                    dataSource: dataSource,
                    ...attrs
                },
                sourceType: 'transit'
            };
        }).filter(loc => loc !== null);

        // Log validation summary
        const filtered = outsideBoundary;
        console.log(`[Transit] Boundary validation: ${locations.length} inside, ${filtered} outside jurisdiction`);

        if (filtered > 0) {
            console.log(`[Transit] Filtering method: ${usePreciseBoundary ? 'precise polygon' : 'bbox + distance'}`);
        }

        if (locations.length === 0) {
            transitShowStatus('No valid stop locations found in data', 'error');
            transitState.loading = false;
            if (loadBtn) {
                loadBtn.disabled = false;
                loadBtn.innerHTML = '🚌 Load Transit Stops';
            }
            return;
        }

        // Save as asset (include demo flag and data source)
        await transitSaveAsAsset(locations, jurisdiction.name, dataSource === 'demo', dataSource);

        // Build status message with data source label
        const sourceLabels = {
            'demo': ' (demo data)',
            'drpt_statewide': ' (VA Statewide - All Agencies)',
            'virginia_open_data': ' (VA Open Data Portal)',
            'grtc_api': ' (GRTC API)'
        };
        const sourceLabel = sourceLabels[dataSource] || '';
        let statusMsg = `Loaded ${locations.length} transit stops${sourceLabel}`;
        if (filtered > 0) {
            statusMsg += ` (${filtered} outside jurisdiction boundary filtered)`;
        }
        transitShowStatus(statusMsg, 'success');

        // Show notification if many were filtered
        if (filtered > 0) {
            assetShowNotification(`${filtered} stops outside ${jurisdiction.name} boundary were filtered out`, 'info');
        }

        setTimeout(transitHideStatus, 4000);

    } catch (error) {
        console.error('[Transit] Load error:', error);
        transitShowStatus('Error loading transit stops: ' + error.message, 'error');
    } finally {
        transitState.loading = false;
        if (loadBtn) {
            loadBtn.disabled = false;
            loadBtn.innerHTML = '🚌 Load Transit Stops';
        }
    }
}

/**
 * Get bounding box for a jurisdiction with more accurate sizing
 */
function getCountyBounds(jurisdiction) {
    // Prefer explicit bbox from config (most accurate)
    if (jurisdiction.bbox && jurisdiction.bbox.length === 4) {
        const [minLng, minLat, maxLng, maxLat] = jurisdiction.bbox;
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        return {
            north: maxLat,
            south: minLat,
            east: maxLng,
            west: minLng,
            center: { lat: centerLat, lng: centerLng }
        };
    }

    // Fallback: estimate from mapCenter and zoom
    if (!jurisdiction.mapCenter) return null;

    const [lat, lng] = jurisdiction.mapCenter;
    const zoom = jurisdiction.mapZoom || 10;

    let latSpan, lngSpan;

    if (zoom >= 12) {
        latSpan = 0.12;
        lngSpan = 0.15;
    } else if (zoom >= 11) {
        latSpan = 0.2;
        lngSpan = 0.25;
    } else {
        latSpan = 0.3;
        lngSpan = 0.4;
    }

    return {
        north: lat + latSpan,
        south: lat - latSpan,
        east: lng + lngSpan,
        west: lng - lngSpan,
        center: { lat, lng }
    };
}

/**
 * Check if a point is within county bounds
 */
function transitIsInBounds(lat, lng, bounds) {
    if (!bounds) return true; // If no bounds, assume in bounds

    return lat >= bounds.south &&
           lat <= bounds.north &&
           lng >= bounds.west &&
           lng <= bounds.east;
}

/**
 * Calculate distance between two points in miles (Haversine formula)
 */
function transitDistanceMiles(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Validate transit stop is within reasonable distance of county center
 */
function transitValidateLocation(lat, lng, jurisdiction, bounds) {
    if (!jurisdiction.mapCenter) return { valid: true, reason: 'no_center' };

    const [centerLat, centerLng] = jurisdiction.mapCenter;
    const distance = transitDistanceMiles(lat, lng, centerLat, centerLng);

    // Maximum reasonable distance based on zoom level (proxy for county size)
    const zoom = jurisdiction.mapZoom || 10;
    let maxDistance;

    if (zoom >= 12) {
        maxDistance = 8;  // Cities: ~8 miles from center
    } else if (zoom >= 11) {
        maxDistance = 15; // Small counties: ~15 miles
    } else {
        maxDistance = 25; // Large counties: ~25 miles
    }

    const inBounds = transitIsInBounds(lat, lng, bounds);
    const withinDistance = distance <= maxDistance;

    return {
        valid: inBounds && withinDistance,
        inBounds,
        withinDistance,
        distance: distance.toFixed(1),
        maxDistance,
        reason: !inBounds ? 'outside_bounds' : (!withinDistance ? 'too_far' : 'ok')
    };
}

/**
 * Generate demo transit stops for testing - within county bounds
 * NOTE: These are SAMPLE locations with randomly generated coordinates.
 * They do NOT represent real bus stop locations.
 */
function transitGenerateDemoStops(jurisdiction) {
    if (!jurisdiction.mapCenter) {
        console.warn('[Transit] No mapCenter for jurisdiction, cannot generate demo stops');
        return [];
    }
    const [centerLat, centerLng] = jurisdiction.mapCenter;
    const zoom = jurisdiction.mapZoom || 10;
    const stops = [];

    // Generate sample stops around the center - use tighter spread for smaller areas
    const agencies = ['Demo Transit Agency'];

    // Adjust spread based on county size (zoom level)
    let spread;
    if (zoom >= 12) {
        spread = 0.06; // City: ~4 mile radius
    } else if (zoom >= 11) {
        spread = 0.1;  // Small county: ~7 mile radius
    } else {
        spread = 0.15; // Large county: ~10 mile radius
    }

    const numStops = Math.floor(Math.random() * 15) + 15; // 15-30 stops

    for (let i = 0; i < numStops; i++) {
        const latOffset = (Math.random() - 0.5) * spread * 2;
        const lngOffset = (Math.random() - 0.5) * spread * 2;

        stops.push({
            attributes: {
                STOP_NAME: `DEMO Stop #${i + 1}`,
                STOP_ID: `DEMO-${1000 + i}`,
                AGENCY: agencies[0],
                ROUTES: 'N/A',
                IS_DEMO: true
            },
            geometry: {
                x: centerLng + lngOffset,
                y: centerLat + latOffset
            }
        });
    }

    console.log(`[Transit] Generated ${stops.length} DEMO stops for ${jurisdiction.name} (not real locations)`);
    return stops;
}

/**
 * Diagnostic function to test transit API connectivity
 * Call from browser console: transitDiagnostics()
 */
async function transitDiagnostics() {
    console.log('=== Transit Stops Diagnostics ===');
    console.log('Config:', TRANSIT_CONFIG);
    console.log('State:', transitState);

    const results = { endpoints: [], summary: {} };

    const serviceUrls = TRANSIT_CONFIG.serviceUrls || [TRANSIT_CONFIG.serviceUrl];

    for (const url of serviceUrls) {
        console.log(`\nTesting: ${url}`);
        const result = { url, status: null, error: null, sampleData: null };

        try {
            // Test basic connectivity
            const infoUrl = url.replace('/query', '') + '?f=json';
            console.log(`  Info URL: ${infoUrl}`);

            const infoResponse = await fetch(infoUrl);
            result.status = infoResponse.status;

            if (infoResponse.ok) {
                const info = await infoResponse.json();
                if (info.error) {
                    result.error = info.error.message;
                    console.log(`  ERROR: ${info.error.message}`);
                } else {
                    result.serviceName = info.name || info.serviceDescription;
                    result.fields = info.fields?.map(f => f.name) || [];
                    console.log(`  Service: ${result.serviceName}`);
                    console.log(`  Fields: ${result.fields.slice(0, 10).join(', ')}...`);

                    // Try a sample query
                    const sampleUrl = `${url}/query?where=1=1&outFields=*&resultRecordCount=1&f=json`;
                    const sampleResponse = await fetch(sampleUrl);
                    if (sampleResponse.ok) {
                        const sampleData = await sampleResponse.json();
                        if (sampleData.features?.length > 0) {
                            result.sampleData = sampleData.features[0];
                            console.log(`  Sample record:`, sampleData.features[0].attributes);
                        }
                    }
                }
            } else {
                result.error = `HTTP ${infoResponse.status}`;
                console.log(`  HTTP Error: ${infoResponse.status}`);
            }
        } catch (e) {
            result.error = e.message;
            console.log(`  Exception: ${e.message}`);
        }

        results.endpoints.push(result);
    }

    results.summary = {
        totalEndpoints: serviceUrls.length,
        working: results.endpoints.filter(e => e.status === 200 && !e.error).length,
        failed: results.endpoints.filter(e => e.status !== 200 || e.error).length
    };

    console.log('\n=== Summary ===');
    console.log(`Working endpoints: ${results.summary.working}/${results.summary.totalEndpoints}`);
    console.log('Full results:', results);

    return results;
}

// Expose diagnostic function globally
window.transitDiagnostics = transitDiagnostics;

/**
 * Save transit stops as asset
 * @param {Array} locations - Array of stop locations
 * @param {string} countyName - Name of the county
 * @param {boolean} isDemo - Whether this is demo/sample data
 * @param {string} dataSource - The data source identifier
 */
async function transitSaveAsAsset(locations, countyName, isDemo = false, dataSource = '') {
    const assetId = 'transit_' + Date.now();
    const crashFilter = document.querySelector('input[name="transitCrashFilter"]:checked')?.value || 'ped_bike';

    // Determine source label based on data source
    const sourceLabels = {
        'demo': 'Demo Data (API Unavailable)',
        'bts_national_transit_map': 'BTS National Transit Map',
        'drpt_statewide': 'Statewide Transit Data (All Agencies)',
        'virginia_open_data': 'Open Data Portal (GTFS)',
        'grtc_api': 'GRTC Transit API'
    };
    const sourceLabel = sourceLabels[dataSource] || 'BTS National Transit Map';

    const asset = {
        id: assetId,
        name: isDemo ? `Transit Stops - ${countyName} (DEMO)` : `Transit Stops - ${countyName}`,
        type: 'bus_stop',
        source: sourceLabel,
        crashFilter: crashFilter,
        uploadDate: new Date().toISOString(),
        locations: locations,
        locationCount: locations.length,
        isDemo: isDemo,
        dataSource: dataSource
    };

    // Remove any existing transit stop assets to prevent accumulation
    const existingTransitAssets = assetState.assets.filter(a =>
        a.type === 'bus_stop' || a.id?.startsWith('transit_') || a.name?.toLowerCase().includes('transit')
    );
    if (existingTransitAssets.length > 0) {
        console.log(`[Transit] Removing ${existingTransitAssets.length} existing transit asset(s) before saving new one`);
        for (const oldAsset of existingTransitAssets) {
            assetRemoveMapLayer(oldAsset.id);
            delete mapAssetVisibility[oldAsset.id];
            await assetDbDelete(oldAsset.id);
        }
        assetState.assets = assetState.assets.filter(a =>
            !(a.type === 'bus_stop' || a.id?.startsWith('transit_') || a.name?.toLowerCase().includes('transit'))
        );
        assetState.activeAssetIds = assetState.activeAssetIds.filter(id =>
            !existingTransitAssets.some(a => a.id === id)
        );
        saveMapAssetVisibility();
    }

    // Save to IndexedDB
    await assetDbSave(asset);

    // Add to state
    assetState.assets.push(asset);
    assetState.activeAssetIds.push(assetId);

    // Save settings
    await assetSaveSettings();

    // Update UI
    assetRenderList();
    updateMapAssetPanel();

    // Run analysis
    await assetRunAnalysis();

    console.log(`[Transit] Saved ${locations.length} stops as asset ${assetId}`);
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  CL.assets.transitLoader = CL.assets.transitLoader || {};
  window.initTransitConfig = initTransitConfig; CL.assets.transitLoader.initTransitConfig = initTransitConfig;
  window.transitInitCountyDropdown = transitInitCountyDropdown; CL.assets.transitLoader.transitInitCountyDropdown = transitInitCountyDropdown;
  window.transitSyncFromContext = transitSyncFromContext; CL.assets.transitLoader.transitSyncFromContext = transitSyncFromContext;
  window.transitOnCountyChange = transitOnCountyChange; CL.assets.transitLoader.transitOnCountyChange = transitOnCountyChange;
  window.transitQuickSelect = transitQuickSelect; CL.assets.transitLoader.transitQuickSelect = transitQuickSelect;
  window.transitClearStops = transitClearStops; CL.assets.transitLoader.transitClearStops = transitClearStops;
  window.transitShowStatus = transitShowStatus; CL.assets.transitLoader.transitShowStatus = transitShowStatus;
  window.transitHideStatus = transitHideStatus; CL.assets.transitLoader.transitHideStatus = transitHideStatus;
  window.transitGetFieldValue = transitGetFieldValue; CL.assets.transitLoader.transitGetFieldValue = transitGetFieldValue;
  window.transitTryGeoJSON = transitTryGeoJSON; CL.assets.transitLoader.transitTryGeoJSON = transitTryGeoJSON;
  window.transitTryGRTC = transitTryGRTC; CL.assets.transitLoader.transitTryGRTC = transitTryGRTC;
  window.transitTryStatewideData = transitTryStatewideData; CL.assets.transitLoader.transitTryStatewideData = transitTryStatewideData;
  window.transitTryVirginiaOpenData = transitTryVirginiaOpenData; CL.assets.transitLoader.transitTryVirginiaOpenData = transitTryVirginiaOpenData;
  window.transitParseGTFSCsv = transitParseGTFSCsv; CL.assets.transitLoader.transitParseGTFSCsv = transitParseGTFSCsv;
  window.transitParseCsvLine = transitParseCsvLine; CL.assets.transitLoader.transitParseCsvLine = transitParseCsvLine;
  window.transitTryEndpoint = transitTryEndpoint; CL.assets.transitLoader.transitTryEndpoint = transitTryEndpoint;
  window.transitLoadStops = transitLoadStops; CL.assets.transitLoader.transitLoadStops = transitLoadStops;
  window.getCountyBounds = getCountyBounds; CL.assets.transitLoader.getCountyBounds = getCountyBounds;
  window.transitIsInBounds = transitIsInBounds; CL.assets.transitLoader.transitIsInBounds = transitIsInBounds;
  window.transitDistanceMiles = transitDistanceMiles; CL.assets.transitLoader.transitDistanceMiles = transitDistanceMiles;
  window.transitValidateLocation = transitValidateLocation; CL.assets.transitLoader.transitValidateLocation = transitValidateLocation;
  window.transitGenerateDemoStops = transitGenerateDemoStops; CL.assets.transitLoader.transitGenerateDemoStops = transitGenerateDemoStops;
  window.transitDiagnostics = transitDiagnostics; CL.assets.transitLoader.transitDiagnostics = transitDiagnostics;
  window.transitSaveAsAsset = transitSaveAsAsset; CL.assets.transitLoader.transitSaveAsAsset = transitSaveAsAsset;
  CL._registerModule('assets/transit-loader');
})();
