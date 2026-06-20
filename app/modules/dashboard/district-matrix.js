/**
 * CL dashboard.district — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.dashboard.district.<fn>; any
 * module-private state stays inside this IIFE (no external refs).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Toggle the magisterial districts layer on the map
 * Fetches official Census County Subdivisions (MCDs) from TIGERweb API
 */
function toggleMagisterialDistrictsLayer(show) {
    console.log(`[Districts] Toggle magisterial districts: ${show}`);

    if (show) {
        builtInLayersState.magisterialDistricts.enabled = true;
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            if (crashMap) {
                loadMagisterialDistricts(jurisdictionId);
            } else {
                // Map not ready - set loading status and flag for deferred load
                console.log('[Districts] Map not ready yet, marking for deferred load');
                builtInLayersState.magisterialDistricts.status = 'loading';
                builtInLayersState.magisterialDistricts._pendingLoad = true;
            }
        } else {
            console.log('[Districts] No jurisdiction selected');
            builtInLayersState.magisterialDistricts.status = 'ready';
            if (typeof showNotification === 'function') {
                showNotification('Please select a jurisdiction first to display districts', 'info');
            }
        }
    } else {
        builtInLayersState.magisterialDistricts.enabled = false;
        builtInLayersState.magisterialDistricts._pendingLoad = false;
        removeMagisterialDistrictsLayer();
    }

    // Save state and update UI
    saveMagisterialDistrictsVisibility();
    updateMapAssetPanel();
}

/**
 * Load magisterial districts (County Subdivisions) from TIGERweb API
 * Automatically called when jurisdiction is selected
 */
async function loadMagisterialDistricts(jurisdictionId) {
    if (!crashMap) {
        console.warn('[Districts] Map not initialized');
        return false;
    }

    const tigerwebConfig = appConfig?.apis?.tigerweb;
    if (!tigerwebConfig?.enabled) {
        console.warn('[Districts] TIGERweb API not enabled in config');
        return false;
    }

    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    if (!jurisdiction) {
        console.warn('[Districts] Jurisdiction not found:', jurisdictionId);
        return false;
    }

    // Track request to handle race conditions
    const requestId = Date.now();
    builtInLayersState.magisterialDistricts._currentRequestId = requestId;

    // Remove existing layers if showing different jurisdiction
    if (builtInLayersState.magisterialDistricts.currentJurisdictionId !== jurisdictionId) {
        removeMagisterialDistrictsLayer();
    }

    // Check in-memory cache first (fastest)
    if (builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId]) {
        console.log('[Districts] Using in-memory cached districts for:', jurisdiction.name);
        displayMagisterialDistricts(
            builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId],
            jurisdictionId
        );
        return true;
    }

    // Check IndexedDB cache (persistent across sessions)
    try {
        const cachedRecord = await loadMagisterialFromCache(jurisdictionId);
        if (cachedRecord && cachedRecord.geojson && cachedRecord.geojson.features?.length > 0) {
            console.log('[Districts] Using IndexedDB cached districts for:', jurisdiction.name);
            // Store in memory cache for faster subsequent access
            builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId] = cachedRecord.geojson;
            displayMagisterialDistricts(cachedRecord.geojson, jurisdictionId);

            // Compute crash statistics if data loaded
            if (crashState.loaded && crashState.sampleRows.length > 0) {
                computeDistrictCrashStatistics(cachedRecord.geojson, jurisdictionId);
            }
            return true;
        }
    } catch (cacheError) {
        console.warn('[Districts] IndexedDB cache check failed:', cacheError);
        // Continue to API fetch
    }

    // Set loading state
    builtInLayersState.magisterialDistricts.status = 'loading';
    updateMapAssetPanel();

    try {
        const stateFips = tigerwebConfig.stateFips || jurisdictionContext?.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08');
        const countyFips = jurisdiction.fips;

        // TIGERweb County Subdivisions query
        // Verified working format: STATE='51' AND COUNTY='087' with outFields=*
        const geoidPrefix = `${stateFips}${countyFips}`;  // e.g., '51087' for Henrico

        const endpoints = [
            {
                // PRIMARY: Verified working query format from user
                // URL: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE='51'+AND+COUNTY='087'&outFields=*&f=geojson&returnGeometry=true
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Places_CouSub_Primary',
                whereClause: `STATE='${stateFips}' AND COUNTY='${countyFips}'`,
                outFields: '*'
            },
            {
                // Fallback: GEOID-based query
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Places_CouSub_GEOID',
                whereClause: `GEOID LIKE '${geoidPrefix}%'`,
                outFields: '*'
            },
            {
                // Fallback: Census2020 service
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer',
                layerId: 60,
                name: 'Census2020',
                whereClause: `STATE='${stateFips}' AND COUNTY='${countyFips}'`,
                outFields: '*'
            },
            {
                // Fallback: Generalized ACS service
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2022/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Generalized_ACS2022',
                whereClause: `GEOID LIKE '${geoidPrefix}%'`,
                outFields: '*'
            }
        ];

        const baseQueryParams = {
            returnGeometry: 'true',
            outSR: '4326',
            f: 'geojson'
        };

        // Helper function to fetch a single endpoint with retry
        const fetchEndpoint = async (endpoint, maxRetries = 2, initialDelay = 1000) => {
            const baseUrl = `${endpoint.url}/${endpoint.layerId}/query`;
            const queryParams = {
                where: endpoint.whereClause,
                outFields: endpoint.outFields,
                ...baseQueryParams
            };

            // Custom encoder for ArcGIS REST API - matches working URL format
            // Encodes spaces as + but keeps = and ' unencoded (ArcGIS expects this)
            const encodeArcGIS = (str) => {
                return str
                    .replace(/ /g, '+')           // spaces -> +
                    .replace(/"/g, '%22');        // double quotes -> %22
            };

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                if (builtInLayersState.magisterialDistricts._currentRequestId !== requestId) {
                    throw new Error('Request superseded');
                }

                const cacheBuster = `_ts=${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                try {
                    // Build URL matching the verified working format:
                    // where=STATE='51'+AND+COUNTY='087'&outFields=*&f=geojson&returnGeometry=true
                    const getUrl = `${baseUrl}?` +
                        Object.entries(queryParams)
                            .map(([k, v]) => `${k}=${encodeArcGIS(String(v))}`)
                            .join('&') + `&${cacheBuster}`;

                    console.log(`[Districts] ${endpoint.name} - Attempt ${attempt}/${maxRetries}`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000);

                    const response = await fetch(getUrl, {
                        signal: controller.signal,
                        cache: 'no-store',
                        headers: { 'Accept': 'application/json' }
                    }).catch(err => {
                        clearTimeout(timeoutId);
                        if (err.name === 'AbortError') throw new Error('Request timed out');
                        throw err;
                    });
                    clearTimeout(timeoutId);

                    if (!response.ok) throw new Error(`HTTP ${response.status}`);

                    const geojson = await response.json();

                    if (geojson.error) {
                        throw new Error(geojson.error.message || 'API error');
                    }

                    return geojson;
                } catch (error) {
                    if (error.message === 'Request superseded') throw error;
                    console.warn(`[Districts] ${endpoint.name} attempt ${attempt} failed:`, error.message);

                    if (attempt < maxRetries) {
                        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    } else {
                        throw error;
                    }
                }
            }
        };

        // Try each endpoint until one succeeds
        let geojson = null;
        let lastError = null;
        let successEndpoint = '';

        for (const endpoint of endpoints) {
            try {
                console.log(`[Districts] Trying ${endpoint.name} endpoint...`);
                geojson = await fetchEndpoint(endpoint, 2, 1000);

                if (geojson && geojson.features && geojson.features.length > 0) {
                    console.log(`[Districts] Success from ${endpoint.name}: ${geojson.features.length} districts`);
                    successEndpoint = endpoint.name;
                    // Log sample feature properties for debugging
                    if (geojson.features[0]?.properties) {
                        const props = geojson.features[0].properties;
                        console.log('[Districts] Sample feature properties:', {
                            NAME: props.NAME,
                            NAMELSAD: props.NAMELSAD,
                            FUNCSTAT: props.FUNCSTAT,
                            GEOID: props.GEOID,
                            STATE: props.STATE,
                            COUNTY: props.COUNTY
                        });
                    }
                    break;
                } else {
                    console.log(`[Districts] ${endpoint.name} returned empty results, trying next...`);
                    geojson = null;
                }
            } catch (error) {
                if (error.message === 'Request superseded') {
                    console.log('[Districts] Request superseded');
                    return false;
                }
                console.warn(`[Districts] ${endpoint.name} failed:`, error.message);
                lastError = error;
                geojson = null;
            }
        }

        if (builtInLayersState.magisterialDistricts._currentRequestId !== requestId) {
            console.log('[Districts] Request superseded');
            return false;
        }

        if (!geojson) {
            throw lastError || new Error('All endpoints failed');
        }

        if (!geojson.features || geojson.features.length === 0) {
            console.log('[Districts] No districts found for jurisdiction (may be independent city)');
            builtInLayersState.magisterialDistricts.status = 'ready';
            builtInLayersState.magisterialDistricts.districts = [];
            updateMapAssetPanel();
            return true;
        }

        // Log FUNCSTAT values for debugging
        const funcstatValues = geojson.features.map(f => f.properties.FUNCSTAT || 'undefined');
        const funcstatCounts = funcstatValues.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        console.log('[Districts] FUNCSTAT values found:', funcstatCounts);

        // Keep all districts regardless of FUNCSTAT - we want geographic boundaries for crash assignment
        // FUNCSTAT codes: A=Active, B=Inactive(not yet), C=Inactive(temp), F=Fictitious, I=Inactive(defunct), N=Nonfunctioning, S=Statistical
        // Virginia magisterial districts may have various FUNCSTAT values but are still valid geographic boundaries
        // Only filter out F=Fictitious which are placeholder entities for filling gaps
        const beforeCount = geojson.features.length;
        geojson.features = geojson.features.filter(f =>
            !f.properties.FUNCSTAT || f.properties.FUNCSTAT !== 'F'
        );
        console.log('[Districts] After FUNCSTAT filter:', geojson.features.length, 'of', beforeCount, 'districts retained');

        // Handle case where all features were filtered out
        if (geojson.features.length === 0) {
            console.log('[Districts] All districts filtered out - setting status to active with empty result');
            builtInLayersState.magisterialDistricts.status = 'active';
            builtInLayersState.magisterialDistricts.districts = [];
            updateMapAssetPanel();
            return true;
        }

        // Cache the result in memory
        builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId] = geojson;

        // Cache to IndexedDB for persistent storage
        saveMagisterialToCache(jurisdictionId, geojson, successEndpoint).catch(err => {
            console.warn('[Districts] Failed to save to IndexedDB:', err);
        });

        // Display if enabled
        if (builtInLayersState.magisterialDistricts.enabled) {
            displayMagisterialDistricts(geojson, jurisdictionId);
        }

        // Automatically compute crash statistics
        if (crashState.loaded && crashState.sampleRows.length > 0) {
            computeDistrictCrashStatistics(geojson, jurisdictionId);
        }

        console.log('[Districts] Loaded', geojson.features.length, 'districts for:', jurisdiction.name);
        return true;

    } catch (error) {
        if (builtInLayersState.magisterialDistricts._currentRequestId === requestId) {
            console.error('[Districts] Error fetching districts:', error);
            builtInLayersState.magisterialDistricts.status = 'error';
            builtInLayersState.magisterialDistricts.lastError = error.message;

            if (typeof showNotification === 'function') {
                showNotification(`Failed to load districts: ${error.message}`, 'warning');
            }

            updateMapAssetPanel();
        }
        return false;
    }
}

/**
 * Display the magisterial districts on the map
 */
function displayMagisterialDistricts(geojson, jurisdictionId) {
    // Remove existing layers
    removeMagisterialDistrictsLayer();

    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    const districts = [];
    const layers = [];

    geojson.features.forEach((feature, index) => {
        const props = feature.properties;
        const districtName = props.NAME || props.NAMELSAD || `District ${index + 1}`;
        const color = districtColors[index % districtColors.length];

        // Store district data
        const districtData = {
            name: districtName,
            nameLsad: props.NAMELSAD,
            geoid: props.GEOID,
            statefp: props.STATEFP,
            countyfp: props.COUNTYFP,
            cousubfp: props.COUSUBFP,
            color: color,
            geojson: feature,
            crashCount: 0,
            stats: null
        };
        districts.push(districtData);

        // Create layer for this district
        const districtLayer = L.geoJSON(feature, {
            pane: 'jurisdictionBoundaryPane',
            style: {
                color: color,
                weight: 2,
                fillColor: color,
                fillOpacity: 0.12,
                dashArray: null,
                lineCap: 'round',
                lineJoin: 'round'
            },
            onEachFeature: function(f, layer) {
                const stats = districtState.statistics.byDistrict[districtName];
                const crashInfo = stats ?
                    `<div style="margin-top:0.5rem;font-size:0.8rem;">
                        <strong>Crashes:</strong> ${stats.total} total<br>
                        <span style="color:#dc2626">Fatal (K):</span> ${stats.K} |
                        <span style="color:#f97316">Serious (A):</span> ${stats.A}<br>
                        <span style="color:#eab308">Minor (B):</span> ${stats.B} |
                        <span style="color:#22c55e">Possible (C):</span> ${stats.C}<br>
                        <strong>EPDO:</strong> ${stats.epdo?.toLocaleString() || 0}
                    </div>` :
                    '<div style="margin-top:0.5rem;font-size:0.75rem;color:#888;">Crash data loading...</div>';

                const popupContent = `
                    <div style="text-align:center;padding:0.5rem;min-width:180px;">
                        <div style="font-weight:600;margin-bottom:0.25rem;color:${color};">${districtName}</div>
                        <div style="font-size:0.75rem;color:#666;">
                            Magisterial District
                        </div>
                        ${crashInfo}
                        <div style="font-size:0.7rem;color:#888;margin-top:0.5rem;">
                            GEOID: ${props.GEOID || 'N/A'}
                        </div>
                    </div>
                `;
                layer.bindPopup(popupContent);

                // Hover effect
                layer.on('mouseover', function() {
                    this.setStyle({ fillOpacity: 0.25, weight: 3 });
                });
                layer.on('mouseout', function() {
                    this.setStyle({ fillOpacity: 0.12, weight: 2 });
                });

                // Click handler for drill-down sidebar
                layer.on('click', function(e) {
                    // Close popup and show drill-down sidebar
                    setTimeout(() => {
                        if (crashMap) crashMap.closePopup();
                        showDistrictDrillDown(districtName, color);
                    }, 100);
                });
            }
        });

        districtLayer.addTo(crashMap);
        layers.push(districtLayer);
    });

    // Update state
    builtInLayersState.magisterialDistricts.layers = layers;
    builtInLayersState.magisterialDistricts.districts = districts;
    builtInLayersState.magisterialDistricts.currentJurisdictionId = jurisdictionId;
    builtInLayersState.magisterialDistricts.status = 'active';
    builtInLayersState.magisterialDistricts.lastError = null;

    updateMapAssetPanel();
}

/**
 * Remove all magisterial district layers from the map
 */
function removeMagisterialDistrictsLayer() {
    if (builtInLayersState.magisterialDistricts.layers.length > 0 && crashMap) {
        builtInLayersState.magisterialDistricts.layers.forEach(layer => {
            crashMap.removeLayer(layer);
        });
        builtInLayersState.magisterialDistricts.layers = [];
        console.log('[Districts] District layers removed from map');
    }

    builtInLayersState.magisterialDistricts.status = 'ready';
    builtInLayersState.magisterialDistricts.currentJurisdictionId = null;
}

/**
 * Save magisterial districts visibility state to localStorage
 */
function saveMagisterialDistrictsVisibility() {
    try {
        localStorage.setItem('magisterialDistrictsEnabled',
            builtInLayersState.magisterialDistricts.enabled ? 'true' : 'false');
    } catch (e) {
        console.warn('[Districts] Could not save visibility state:', e);
    }
}

/**
 * Load magisterial districts visibility state from localStorage
 */
function loadMagisterialDistrictsVisibility() {
    try {
        const tigerwebConfig = appConfig?.apis?.tigerweb;
        if (!tigerwebConfig?.enabled) {
            return;
        }

        // Default to disabled (user opt-in)
        const saved = localStorage.getItem('magisterialDistrictsEnabled');
        builtInLayersState.magisterialDistricts.enabled = saved === 'true';

        if (builtInLayersState.magisterialDistricts.enabled) {
            const jurisdictionId = localStorage.getItem('selectedJurisdiction');
            if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
                if (crashMap) {
                    loadMagisterialDistricts(jurisdictionId);
                } else {
                    // Map not ready - set pending status and flag for later loading
                    console.log('[Districts] Map not ready, marking for deferred load');
                    builtInLayersState.magisterialDistricts.status = 'loading';
                    builtInLayersState.magisterialDistricts._pendingLoad = true;
                }
            }
        }
    } catch (e) {
        console.warn('[Districts] Could not load visibility state:', e);
    }
}

/**
 * Load pending districts when map becomes ready
 * Called from initMap after crashMap is initialized
 */
function loadPendingDistrictsOnMapReady() {
    // Check if magisterial districts need to be loaded
    if (builtInLayersState?.magisterialDistricts?.enabled &&
        builtInLayersState.magisterialDistricts._pendingLoad) {

        console.log('[Districts] Map ready - loading pending districts');
        builtInLayersState.magisterialDistricts._pendingLoad = false;

        // Use pending jurisdiction if set, otherwise fall back to localStorage
        const pendingDistrictJurisdiction = builtInLayersState.magisterialDistricts._pendingJurisdiction;
        const jurisdictionId = pendingDistrictJurisdiction || localStorage.getItem('selectedJurisdiction');
        builtInLayersState.magisterialDistricts._pendingJurisdiction = null;

        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            loadMagisterialDistricts(jurisdictionId);
        }
    }

    // Also check jurisdiction boundary — clear stale pending state so ensureJurisdictionBoundary can proceed
    if (builtInLayersState?.jurisdictionBoundary?._pendingLoad) {
        console.log('[TIGERweb] Map ready - clearing pending boundary flags for deferred load');
        builtInLayersState.jurisdictionBoundary._pendingLoad = false;
        builtInLayersState.jurisdictionBoundary._pendingJurisdiction = null;
        // Reset stale 'loading' status since no actual request was in flight
        if (builtInLayersState.jurisdictionBoundary.status === 'loading') {
            builtInLayersState.jurisdictionBoundary.status = 'ready';
        }
    }
    // Actual loading handled by ensureJurisdictionBoundary() at 600ms after initMap

    // Check for pending region/MPO boundary based on active tier
    const activeTier = jurisdictionContext?.viewTier;
    if (activeTier === 'region' && jurisdictionContext.tierRegion && typeof displayRegionBoundary === 'function') {
        console.log('[Boundary] Map ready - loading pending region boundary');
        displayRegionBoundary(jurisdictionContext.tierRegion, jurisdictionContext.tierRegion.id);
    }
    if (activeTier === 'mpo' && jurisdictionContext.tierMpo &&
        !builtInLayersState?.mpoBoundary?.layer &&
        typeof displayMPOBoundary === 'function') {
        const mpo = jurisdictionContext.tierMpo;
        const acronym = mpo.btsAcronym || mpo._resolvedBtsAcronym;
        console.log('[Boundary] Map ready - loading pending MPO boundary');
        (async () => {
            // First check if boundary was cached during handleMPOSelection
            if (mpo._cachedBoundary?.features?.length > 0) {
                console.log('[Boundary] Using cached MPO boundary from selection');
                displayMPOBoundary(mpo._cachedBoundary, mpo.id, mpo.shortName || mpo.name);
                return;
            }
            // Try acronym query first
            if (acronym && typeof BoundaryService !== 'undefined') {
                const boundary = await BoundaryService.getMPOByAcronym(acronym);
                if (boundary?.features?.length > 0) {
                    displayMPOBoundary(boundary, mpo.id, mpo.shortName || mpo.name);
                    return;
                }
            }
            // Spatial query fallback
            if (mpo.center && typeof BoundaryService !== 'undefined') {
                const bbox = { xmin: mpo.center[0] - 1.0, ymin: mpo.center[1] - 1.0, xmax: mpo.center[0] + 1.0, ymax: mpo.center[1] + 1.0 };
                const spatialResult = await BoundaryService.getMPOsBySpatialQuery(bbox);
                if (spatialResult?.features?.length > 0) {
                    const mpoName = (mpo.shortName || mpo.name || '').toLowerCase();
                    const matched = spatialResult.features.find(f => {
                        const p = f.properties || {};
                        const nm = (p.MPO_NAME || p.NAME || p.MPO_name || '').toLowerCase();
                        const ac = (p.ACRONYM || p.acronym || '').toLowerCase();
                        return ac === mpoName || nm.includes(mpoName) || mpoName.includes(nm);
                    });
                    if (matched) {
                        displayMPOBoundary({ type: 'FeatureCollection', features: [matched] }, mpo.id, mpo.shortName || mpo.name);
                        return;
                    }
                }
            }
            // Final fallback: zoom to center
            if (mpo.center && crashMap) {
                safeFlyTo(crashMap, [mpo.center[1], mpo.center[0]], mpo.zoom || 10, { duration: 1.2 });
            }
        })().catch(e => console.warn('[Boundary] Pending MPO boundary load failed:', e.message));
    }
}

/**
 * Update magisterial districts when jurisdiction changes
 * Also pre-loads districts in background for statistics even if layer is disabled
 */
function updateMagisterialDistricts(jurisdictionId) {
    const previousJurisdiction = districtState.lastJurisdictionId;
    const isJurisdictionChange = previousJurisdiction && previousJurisdiction !== jurisdictionId;

    // If jurisdiction is changing, clear all district data first
    if (isJurisdictionChange) {
        console.log('[Districts] Jurisdiction changing from', previousJurisdiction, 'to', jurisdictionId);

        // Clear statistics and cache for old jurisdiction
        clearDistrictStatisticsCache();

        // Clear the district filter selection
        clearDistrictFilter();

        // Show loading state in dashboard widget
        showDistrictMatrixLoading('Loading district boundaries...');
    }

    // Always pre-load districts for statistics (in background)
    if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
        preloadDistrictsForStatistics(jurisdictionId);
    }

    // Only update visible layer if enabled
    if (!builtInLayersState.magisterialDistricts.enabled) {
        return;
    }

    if (!crashMap) {
        console.log('[Districts] Map not ready, districts will load when map initializes');
        // Store pending jurisdiction so it can be loaded when map is ready
        if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
            builtInLayersState.magisterialDistricts._pendingLoad = true;
            builtInLayersState.magisterialDistricts._pendingJurisdiction = jurisdictionId;
        }
        return;
    }

    if (jurisdictionId && appConfig?.jurisdictions[jurisdictionId]) {
        loadMagisterialDistricts(jurisdictionId);
    } else {
        removeMagisterialDistrictsLayer();
    }

    updateMapAssetPanel();
}

/**
 * Clear the district filter selection
 * Called when jurisdiction changes or data is reset
 */
function clearDistrictFilter() {
    // Clear the filter dropdown
    const filterSelect = document.getElementById('filterDistrict');
    if (filterSelect) {
        filterSelect.value = '';
        filterSelect.innerHTML = '<option value="">All Districts</option>';
    }

    // Hide the filter group until new data loads
    const filterGroup = document.getElementById('filterDistrictGroup');
    if (filterGroup) {
        filterGroup.style.display = 'none';
    }

    // Clear the filter state
    currentFilters.district = null;

    console.log('[Districts] Filter cleared');
}

/**
 * Refresh district statistics after crash data is loaded or changed
 * Called from crash data loading functions to ensure districts are up-to-date
 */
function refreshDistrictStatisticsOnDataLoad() {
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

    // Only process for counties (districts only apply to counties)
    if (!jurisdiction || jurisdiction.type !== 'county') {
        // Hide district UI for non-county jurisdictions
        const widget = document.getElementById('districtMatrixWidget');
        if (widget) widget.style.display = 'none';
        const filterGroup = document.getElementById('filterDistrictGroup');
        if (filterGroup) filterGroup.style.display = 'none';
        return;
    }

    console.log('[Districts] Refreshing statistics after data load for', jurisdictionId);

    // Show the widget immediately with loading state
    const widget = document.getElementById('districtMatrixWidget');
    if (widget) widget.style.display = 'block';
    showDistrictMatrixLoading('Computing district statistics...');

    // Clear existing statistics (crash data changed, need to recompute)
    districtState.loaded = false;
    districtState.crashAssignments.clear();
    districtState.statistics = {
        byDistrict: {},
        totalAssigned: 0,
        totalUnassigned: 0
    };

    // Check if we have cached district boundaries
    if (builtInLayersState?.magisterialDistricts?.geojsonCache[jurisdictionId]) {
        // Have boundaries, compute statistics immediately
        const geojson = builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
        computeDistrictCrashStatistics(geojson, jurisdictionId);
    } else {
        // Need to fetch boundaries first
        preloadDistrictsForStatistics(jurisdictionId, true);

        // Set a fallback timeout to prevent infinite loading state
        // This catches cases where the API call hangs or fails silently
        // Extended to 60s to accommodate slow API responses + computation time for large datasets
        setTimeout(() => {
            if (builtInLayersState?.magisterialDistricts?.status === 'loading' && !districtState.loaded && !districtState.isComputing) {
                console.warn('[Districts] Fallback timeout triggered - loading stuck for 60+ seconds');
                districtState.loadingError = 'Loading timed out. The TIGERweb API may be unavailable.';
                builtInLayersState.magisterialDistricts.status = 'error';
                showDistrictMatrixError('Loading timed out. The TIGERweb API may be unavailable.');
            }
        }, 60000);
    }
}

/**
 * Pre-load districts in background for statistics computation
 * Called even when layer is not visible
 * @param {string} jurisdictionId - The jurisdiction to load districts for
 * @param {boolean} forceRecompute - Force recompute statistics even if already loaded
 */
async function preloadDistrictsForStatistics(jurisdictionId, forceRecompute = false) {
    // Skip if already loaded for this jurisdiction (unless forced)
    if (!forceRecompute && districtState.lastJurisdictionId === jurisdictionId && districtState.loaded) {
        console.log('[Districts] Already loaded for jurisdiction, skipping');
        return;
    }

    const tigerwebConfig = appConfig?.apis?.tigerweb;
    if (!tigerwebConfig?.enabled) return;

    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    if (!jurisdiction) return;

    // Only counties have magisterial districts - cities don't
    if (jurisdiction.type !== 'county') {
        console.log('[Districts] Skipping for independent city:', jurisdiction.name);
        // Hide district UI elements for cities
        const widget = document.getElementById('districtMatrixWidget');
        if (widget) widget.style.display = 'none';
        const filterGroup = document.getElementById('filterDistrictGroup');
        if (filterGroup) filterGroup.style.display = 'none';
        return;
    }

    // Check in-memory cache
    if (builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId]) {
        const geojson = builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
        builtInLayersState.magisterialDistricts.status = 'active';
        updateMapAssetPanel();
        if (crashState.loaded) {
            computeDistrictCrashStatistics(geojson, jurisdictionId);
        }
        return;
    }

    // Check IndexedDB cache (persists across page reloads)
    try {
        const cachedRecord = await loadMagisterialFromCache(jurisdictionId);
        if (cachedRecord?.geojson?.features?.length > 0) {
            console.log('[Districts] Found IndexedDB cache for', jurisdictionId, '-', cachedRecord.geojson.features.length, 'districts');
            builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId] = cachedRecord.geojson;
            builtInLayersState.magisterialDistricts.status = 'active';
            updateMapAssetPanel();
            if (crashState.loaded) {
                computeDistrictCrashStatistics(cachedRecord.geojson, jurisdictionId);
            }
            return;
        }
    } catch (e) {
        console.warn('[Districts] IndexedDB cache check failed, continuing with API fetch:', e);
    }

    // Set loading status before starting fetch
    builtInLayersState.magisterialDistricts.status = 'loading';
    districtState.loadingStartTime = Date.now();
    districtState.loadingError = null;
    updateMapAssetPanel();

    // Helper to show error in district stats UI
    const showDistrictLoadError = (errorMsg) => {
        districtState.loadingError = errorMsg;

        // Update status in builtInLayersState for map asset panel
        builtInLayersState.magisterialDistricts.status = 'error';
        builtInLayersState.magisterialDistricts.lastError = errorMsg;
        updateMapAssetPanel();

        // Update the dashboard matrix widget (non-recursive UI update)
        showDistrictMatrixError(errorMsg);

        // Also update the Grants tab container if it exists
        const container = document.getElementById('districtStatisticsContainer');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center;padding:1.5rem;color:var(--gray);">
                    <div style="font-size:1.5rem;margin-bottom:.5rem;">⚠️</div>
                    <div style="font-size:.9rem;font-weight:500;color:#dc2626;">Failed to load district boundaries</div>
                    <div style="font-size:.8rem;margin-top:.5rem;">${errorMsg}</div>
                    <div style="font-size:.75rem;color:var(--gray);margin-top:.75rem;">
                        TIGERweb API may be temporarily unavailable. Try again later.
                    </div>
                    <button onclick="retryLoadDistrictMatrix()"
                            style="margin-top:1rem;padding:0.5rem 1rem;font-size:0.8rem;cursor:pointer;
                                   background:var(--primary);color:white;border:none;border-radius:6px;">
                        Retry
                    </button>
                </div>
            `;
        }
        // The widget will check the error status on next render
    };

    // Fetch in background with timeout and retry logic
    try {
        const stateFips = tigerwebConfig.stateFips || jurisdictionContext?.stateFips || (appConfig?.states?.[appConfig?.defaultState]?.fips || '08');
        const countyFips = jurisdiction.fips;

        // TIGERweb County Subdivisions query
        // Verified working format: STATE='51' AND COUNTY='087' with outFields=*
        const geoidPrefix = `${stateFips}${countyFips}`;  // e.g., '51087' for Henrico

        const endpoints = [
            {
                // PRIMARY: Verified working query format from user
                // URL: https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer/1/query?where=STATE='51'+AND+COUNTY='087'&outFields=*&f=geojson&returnGeometry=true
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Places_CouSub_Primary',
                whereClause: `STATE='${stateFips}' AND COUNTY='${countyFips}'`,
                outFields: '*'
            },
            {
                // Fallback: GEOID-based query
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Places_CouSub_GEOID',
                whereClause: `GEOID LIKE '${geoidPrefix}%'`,
                outFields: '*'
            },
            {
                // Fallback: Census2020 service
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Census2020/MapServer',
                layerId: 60,
                name: 'Census2020',
                whereClause: `STATE='${stateFips}' AND COUNTY='${countyFips}'`,
                outFields: '*'
            },
            {
                // Fallback: Generalized ACS service
                url: 'https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2022/Places_CouSub_ConCity_SubMCD/MapServer',
                layerId: 1,
                name: 'Generalized_ACS2022',
                whereClause: `GEOID LIKE '${geoidPrefix}%'`,
                outFields: '*'
            }
        ];

        // Base query parameters (whereClause and outFields will be set per endpoint)
        const baseQueryParams = {
            returnGeometry: 'true',
            outSR: '4326',
            f: 'geojson'
        };

        // Custom encoder for ArcGIS REST API - matches working URL format
        // Encodes spaces as + but keeps = and ' unencoded (ArcGIS expects this)
        const encodeArcGIS = (str) => {
            return str
                .replace(/ /g, '+')           // spaces -> +
                .replace(/"/g, '%22');        // double quotes -> %22
        };

        // Helper function to fetch with retry and POST fallback
        const fetchWithRetry = async (baseUrl, endpointName, endpointQueryParams, maxRetries = 2, initialDelay = 1000) => {
            let lastError;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                // Add cache-busting timestamp to prevent caching issues
                const cacheBuster = `_ts=${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                try {
                    // Build URL matching the verified working format:
                    // where=STATE='51'+AND+COUNTY='087'&outFields=*&f=geojson&returnGeometry=true
                    const getUrl = `${baseUrl}?` +
                        Object.entries(endpointQueryParams)
                            .map(([k, v]) => `${k}=${encodeArcGIS(String(v))}`)
                            .join('&') +
                        `&${cacheBuster}`;

                    console.log(`[Districts] ${endpointName} - Attempt ${attempt}/${maxRetries}`);
                    console.log(`[Districts] URL: ${getUrl.substring(0, 200)}...`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 30000);

                    let response;
                    try {
                        response = await fetch(getUrl, {
                            signal: controller.signal,
                            cache: 'no-store',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                    } catch (fetchError) {
                        clearTimeout(timeoutId);
                        if (fetchError.name === 'AbortError') {
                            throw new Error('Request timed out after 30 seconds');
                        }
                        throw fetchError;
                    }
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const geojson = await response.json();

                    // Check for ArcGIS error response
                    if (geojson.error) {
                        const errorCode = geojson.error.code || '';
                        const errorMsg = geojson.error.message || 'Unknown API error';
                        console.warn(`[Districts] ArcGIS error on attempt ${attempt}:`, errorMsg);

                        // If GET failed with query error, try POST on next attempt
                        if (attempt < maxRetries) {
                            throw new Error(errorMsg);
                        }

                        // On last attempt, try POST method as fallback
                        console.log('[Districts] Trying POST method as fallback...');
                        const postController = new AbortController();
                        const postTimeoutId = setTimeout(() => postController.abort(), 30000);

                        const formData = new URLSearchParams();
                        Object.entries(endpointQueryParams).forEach(([k, v]) => formData.append(k, v));
                        formData.append('_ts', Date.now().toString());

                        try {
                            const postResponse = await fetch(baseUrl, {
                                method: 'POST',
                                body: formData,
                                signal: postController.signal,
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Accept': 'application/json'
                                }
                            });
                            clearTimeout(postTimeoutId);

                            if (!postResponse.ok) {
                                throw new Error(`POST HTTP ${postResponse.status}: ${postResponse.statusText}`);
                            }

                            const postGeojson = await postResponse.json();
                            if (postGeojson.error) {
                                throw new Error(postGeojson.error.message || 'POST request also failed');
                            }
                            return postGeojson;
                        } catch (postError) {
                            clearTimeout(postTimeoutId);
                            throw new Error(`Both GET and POST failed: ${errorMsg}`);
                        }
                    }

                    return geojson;

                } catch (error) {
                    lastError = error;
                    console.warn(`[Districts] Attempt ${attempt}/${maxRetries} failed:`, error.message);

                    if (attempt < maxRetries) {
                        // Exponential backoff with jitter
                        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 500;
                        console.log(`[Districts] Retrying in ${Math.round(delay)}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }

            throw lastError;
        };

        // Try each endpoint until one succeeds
        let geojson = null;
        let lastEndpointError = null;

        for (const endpoint of endpoints) {
            const baseUrl = `${endpoint.url}/${endpoint.layerId}/query`;
            // Build query params for this specific endpoint
            const endpointQueryParams = {
                where: endpoint.whereClause,
                outFields: endpoint.outFields,
                ...baseQueryParams
            };
            try {
                console.log(`[Districts] Trying ${endpoint.name} endpoint with query: ${endpoint.whereClause}`);
                geojson = await fetchWithRetry(baseUrl, endpoint.name, endpointQueryParams, 2, 1000);
                if (geojson && geojson.features && geojson.features.length > 0) {
                    console.log(`[Districts] Successfully loaded ${geojson.features.length} districts from ${endpoint.name}`);
                    break;
                } else if (geojson && (!geojson.features || geojson.features.length === 0)) {
                    console.log(`[Districts] ${endpoint.name} returned empty results, trying next endpoint...`);
                    geojson = null;
                }
            } catch (endpointError) {
                console.warn(`[Districts] ${endpoint.name} endpoint failed:`, endpointError.message);
                lastEndpointError = endpointError;
                geojson = null;
                // Continue to next endpoint
            }
        }

        // If all endpoints failed
        if (!geojson) {
            throw lastEndpointError || new Error('All endpoints failed');
        }

        // Check for ArcGIS error response (defensive - should be handled in fetchWithRetry)
        if (geojson.error) {
            const errorMsg = geojson.error.message || 'Unknown API error';
            console.error('[Districts] ArcGIS error:', geojson.error);
            showDistrictLoadError(errorMsg);
            return;
        }

        if (!geojson.features || geojson.features.length === 0) {
            console.log('[Districts] No districts found for jurisdiction');
            builtInLayersState.magisterialDistricts.status = 'active';
            builtInLayersState.magisterialDistricts.districts = [];
            updateMapAssetPanel();
            const container = document.getElementById('districtStatisticsContainer');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:1.5rem;color:var(--gray);">
                        <div style="font-size:1.5rem;margin-bottom:.5rem;">🗺️</div>
                        <div style="font-size:.9rem;">No district boundaries found</div>
                        <div style="font-size:.75rem;margin-top:.25rem;">
                            This jurisdiction may not have magisterial districts in the Census database.
                        </div>
                    </div>
                `;
            }
            return;
        }

        // Log FUNCSTAT values for debugging
        const funcstatValues = geojson.features.map(f => f.properties.FUNCSTAT || 'undefined');
        const funcstatCounts = funcstatValues.reduce((acc, v) => { acc[v] = (acc[v] || 0) + 1; return acc; }, {});
        console.log('[Districts/Preload] FUNCSTAT values found:', funcstatCounts);

        // Keep all districts regardless of FUNCSTAT - we want geographic boundaries for crash assignment
        // FUNCSTAT codes: A=Active, B=Inactive(not yet), C=Inactive(temp), F=Fictitious, I=Inactive(defunct), N=Nonfunctioning, S=Statistical
        // Virginia magisterial districts may have various FUNCSTAT values but are still valid geographic boundaries
        // Only filter out F=Fictitious which are placeholder entities for filling gaps
        const beforeCount = geojson.features.length;
        geojson.features = geojson.features.filter(f =>
            !f.properties.FUNCSTAT || f.properties.FUNCSTAT !== 'F'
        );
        console.log('[Districts/Preload] After FUNCSTAT filter:', geojson.features.length, 'of', beforeCount, 'districts retained');

        // Handle case where all features were filtered out
        if (geojson.features.length === 0) {
            console.log('[Districts/Preload] All districts filtered out');
            builtInLayersState.magisterialDistricts.status = 'active';
            builtInLayersState.magisterialDistricts.districts = [];
            updateMapAssetPanel();
            const container = document.getElementById('districtStatisticsContainer');
            if (container) {
                container.innerHTML = `
                    <div style="text-align:center;padding:1rem;color:var(--gray);">
                        <div style="font-size:1.5rem;margin-bottom:.5rem;">🗺️</div>
                        <div style="font-size:.9rem;">No district boundaries found</div>
                        <div style="font-size:.75rem;margin-top:.25rem;">
                            All districts were filtered out - check FUNCSTAT values in console.
                        </div>
                    </div>
                `;
            }
            return;
        }

        // Cache
        builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId] = geojson;

        // Update status to active
        builtInLayersState.magisterialDistricts.status = 'active';
        builtInLayersState.magisterialDistricts.districts = geojson.features.map(f => ({
            name: f.properties.NAME || f.properties.NAMELSAD || 'Unknown',
            geoid: f.properties.GEOID
        }));
        updateMapAssetPanel();

        // Compute stats if crash data is loaded
        if (crashState.loaded && crashState.sampleRows.length > 0) {
            computeDistrictCrashStatistics(geojson, jurisdictionId);
        } else {
            // Districts loaded but no crash data yet - update widget to show waiting state
            console.log('[Districts] District boundaries loaded, waiting for crash data...');
            showDistrictMatrixLoading('District boundaries loaded. Upload crash data to view statistics.');
        }

        console.log('[Districts] Pre-loaded', geojson.features.length, 'districts for statistics');

    } catch (error) {
        console.error('[Districts] Background pre-load failed:', error.message);
        showDistrictLoadError(error.message);
    }
}

/**
 * Point-in-polygon test using ray casting algorithm
 * Returns true if point [lng, lat] is inside polygon coordinates
 */
function pointInPolygon(point, polygon) {
    const x = point[0], y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

/**
 * Compute bounding box for a GeoJSON feature
 * Returns {minLng, minLat, maxLng, maxLat} or null if invalid
 */
function computeFeatureBoundingBox(feature) {
    const geom = feature.geometry;
    if (!geom) return null;

    let minLng = Infinity, minLat = Infinity;
    let maxLng = -Infinity, maxLat = -Infinity;

    const processCoords = (coords) => {
        for (const coord of coords) {
            if (Array.isArray(coord[0])) {
                // Nested array (ring or polygon)
                processCoords(coord);
            } else {
                // Actual coordinate [lng, lat]
                const lng = coord[0], lat = coord[1];
                if (lng < minLng) minLng = lng;
                if (lng > maxLng) maxLng = lng;
                if (lat < minLat) minLat = lat;
                if (lat > maxLat) maxLat = lat;
            }
        }
    };

    processCoords(geom.coordinates);

    if (minLng === Infinity) return null;
    return { minLng, minLat, maxLng, maxLat };
}

/**
 * Quick check if point is within bounding box
 * Much faster than full polygon test - use as pre-filter
 */
function pointInBoundingBox(lng, lat, bbox) {
    if (!bbox) return true; // If no bbox, fall through to polygon test
    return lng >= bbox.minLng && lng <= bbox.maxLng &&
           lat >= bbox.minLat && lat <= bbox.maxLat;
}

/**
 * Check if a point is inside a GeoJSON feature (handles Polygon and MultiPolygon)
 * Optimized with bounding box pre-filter for performance
 */
function pointInFeature(lng, lat, feature) {
    const geom = feature.geometry;
    if (!geom) return false;

    // Quick bounding box check first (cached on feature)
    if (!feature._bbox) {
        feature._bbox = computeFeatureBoundingBox(feature);
    }
    if (!pointInBoundingBox(lng, lat, feature._bbox)) {
        return false; // Outside bounding box, skip expensive polygon test
    }

    const point = [lng, lat];

    if (geom.type === 'Polygon') {
        // Polygon: array of rings, first is outer ring
        return pointInPolygon(point, geom.coordinates[0]);
    } else if (geom.type === 'MultiPolygon') {
        // MultiPolygon: array of polygons
        for (const polygon of geom.coordinates) {
            if (pointInPolygon(point, polygon[0])) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Compute district-level crash statistics
 * Assigns each crash to a district using point-in-polygon
 */
async function computeDistrictCrashStatistics(geojson, jurisdictionId) {
    // Round 20 §X8 (restored in 21.1 §3) — short-circuit when capability flag
    // forbids CCD assignment. The widget is repainted as a BLOCKED-UPSTREAM
    // banner; skip the entire point-in-polygon pass on hidden data.
    if (typeof _hideDistrictWidgetIfUnsupported === 'function'
        && await _hideDistrictWidgetIfUnsupported()) {
        return;
    }
    // Round 21 §11.6 — short-circuit when the widget is hidden by the tier
    // gate. The matrix is only shown for county/city tiers; at higher tiers
    // it's display:none, so the point-in-polygon pass would burn CPU on data
    // that's never rendered. State-agnostic — keys on the widget's visibility.
    try {
        const widget = document.getElementById('districtMatrixWidget');
        if (widget && widget.style.display === 'none') {
            console.log('[Districts] widget hidden — skipping statistics computation');
            return;
        }
    } catch (e) { /* non-fatal */ }

    if (districtState.isComputing) {
        console.log('[Districts] Statistics computation already in progress');
        // Show feedback to user that computation is ongoing
        showDistrictMatrixLoading('Computation in progress, please wait...', null);
        return;
    }

    if (!geojson?.features || geojson.features.length === 0) {
        console.log('[Districts] No districts to compute statistics for');
        districtState.loaded = true;
        districtState.lastJurisdictionId = jurisdictionId;
        // Update widget to show empty state
        renderDistrictMatrixWidget();
        return;
    }

    console.log('[Districts] Computing crash statistics for', geojson.features.length, 'districts...');
    console.log('[Districts] Pre-computing bounding boxes for faster point-in-polygon tests...');

    // Pre-compute bounding boxes for all districts (optimizes point-in-polygon tests)
    geojson.features.forEach(feature => {
        if (!feature._bbox) {
            feature._bbox = computeFeatureBoundingBox(feature);
        }
    });
    console.log('[Districts] Bounding boxes computed for', geojson.features.length, 'districts');

    districtState.isComputing = true;

    // Reset state
    districtState.crashAssignments.clear();
    districtState.statistics = {
        byDistrict: {},
        totalAssigned: 0,
        totalUnassigned: 0
    };

    // Initialize stats for each district
    geojson.features.forEach(feature => {
        const name = feature.properties.NAME || feature.properties.NAMELSAD || 'Unknown';
        districtState.statistics.byDistrict[name] = {
            name: name,
            geoid: feature.properties.GEOID,
            total: 0,
            K: 0, A: 0, B: 0, C: 0, O: 0,
            epdo: 0,
            ped: 0,
            bike: 0,
            nighttime: 0,
            speedRelated: 0,
            wetRoad: 0,
            byYear: {},
            byCollision: {},
            crashes: []  // Store crash IDs for filtering
        };
    });

    // Process crashes in batches to avoid blocking UI
    const crashes = crashState.sampleRows;
    const batchSize = 500;
    let processed = 0;
    const totalCrashes = crashes.length;

    // Show initial progress
    showDistrictMatrixLoading('Computing district statistics...', { current: 0, total: totalCrashes });

    const processBatch = () => {
        const end = Math.min(processed + batchSize, totalCrashes);

        for (let i = processed; i < end; i++) {
            const crash = crashes[i];
            const lat = parseFloat(crash[COL.Y]);
            const lng = parseFloat(crash[COL.X]);

            if (isNaN(lat) || isNaN(lng)) {
                districtState.statistics.totalUnassigned++;
                continue;
            }

            // Find which district contains this crash
            let assigned = false;
            for (const feature of geojson.features) {
                if (pointInFeature(lng, lat, feature)) {
                    const districtName = feature.properties.NAME || feature.properties.NAMELSAD || 'Unknown';
                    const crashId = crash[COL.ID] || i;

                    districtState.crashAssignments.set(crashId, districtName);

                    // Update district statistics
                    const stats = districtState.statistics.byDistrict[districtName];
                    if (stats) {
                        stats.total++;
                        stats.crashes.push(crashId);

                        // Severity - extract first character (K/A/B/C/O) like the rest of the codebase
                        const severity = (crash[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
                        if (severity && stats.hasOwnProperty(severity)) {
                            stats[severity]++;
                        }

                        // EPDO calculation with properly parsed severity (uses global EPDO_WEIGHTS)
                        stats.epdo += EPDO_WEIGHTS[severity] || 1;

                        // Special categories - use isYes() for consistent flag checking
                        if (isYes(crash[COL.PED])) stats.ped++;
                        if (isYes(crash[COL.BIKE])) stats.bike++;
                        if (isYes(crash[COL.SPEED])) stats.speedRelated++;

                        // Light condition (nighttime) - check for dark/night conditions
                        const light = (crash[COL.LIGHT] || '').toLowerCase();
                        if (light.includes('dark') || light.includes('night') || isYes(crash[COL.NIGHT])) {
                            stats.nighttime++;
                        }

                        // Weather (wet road) - check for adverse conditions
                        const weather = (crash[COL.WEATHER] || '').toLowerCase();
                        if (weather.includes('rain') || weather.includes('snow') || weather.includes('wet') ||
                            weather.includes('sleet') || weather.includes('ice')) {
                            stats.wetRoad++;
                        }

                        // By year
                        const year = crash[COL.YEAR];
                        if (year) {
                            stats.byYear[year] = (stats.byYear[year] || 0) + 1;
                        }

                        // By collision type
                        const collision = crash[COL.COLLISION];
                        if (collision) {
                            stats.byCollision[collision] = (stats.byCollision[collision] || 0) + 1;
                        }
                    }

                    districtState.statistics.totalAssigned++;
                    assigned = true;
                    break;
                }
            }

            if (!assigned) {
                districtState.statistics.totalUnassigned++;
            }
        }

        processed = end;

        // Update progress indicator
        showDistrictMatrixLoading('Computing district statistics...', { current: processed, total: totalCrashes });

        if (processed < totalCrashes) {
            // Continue with next batch (use 10ms delay to allow UI to update)
            setTimeout(processBatch, 10);
        } else {
            // Done
            districtState.loaded = true;
            districtState.lastJurisdictionId = jurisdictionId;
            districtState.isComputing = false;

            console.log('[Districts] Statistics computed:', {
                districts: Object.keys(districtState.statistics.byDistrict).length,
                assigned: districtState.statistics.totalAssigned,
                unassigned: districtState.statistics.totalUnassigned
            });

            // Update UI elements that show district statistics
            updateDistrictStatisticsUI();

            // Populate the global district filter dropdown
            populateDistrictFilter();

            // Update the dashboard district matrix (non-recursive render only)
            renderDistrictMatrixWidget();

            // Refresh district popups with crash data
            refreshDistrictPopups();
        }
    };

    // Start processing
    processBatch();
}

/**
 * Refresh district layer popups with updated crash statistics
 */
function refreshDistrictPopups() {
    if (!builtInLayersState.magisterialDistricts.enabled) return;

    const districts = builtInLayersState.magisterialDistricts.districts;
    const layers = builtInLayersState.magisterialDistricts.layers;

    layers.forEach((layer, index) => {
        const district = districts[index];
        if (!district) return;

        const stats = districtState.statistics.byDistrict[district.name];
        district.crashCount = stats?.total || 0;
        district.stats = stats;

        // Update popup content
        layer.eachLayer(sublayer => {
            const crashInfo = stats ?
                `<div style="margin-top:0.5rem;font-size:0.8rem;">
                    <strong>Crashes:</strong> ${stats.total} total<br>
                    <span style="color:#dc2626">Fatal (K):</span> ${stats.K} |
                    <span style="color:#f97316">Serious (A):</span> ${stats.A}<br>
                    <span style="color:#eab308">Minor (B):</span> ${stats.B} |
                    <span style="color:#22c55e">Possible (C):</span> ${stats.C}<br>
                    <strong>EPDO:</strong> ${stats.epdo?.toLocaleString() || 0}
                    ${stats.ped > 0 ? `<br><span style="color:#8b5cf6">Pedestrian:</span> ${stats.ped}` : ''}
                    ${stats.bike > 0 ? `<br><span style="color:#06b6d4">Bicycle:</span> ${stats.bike}` : ''}
                </div>` :
                '<div style="margin-top:0.5rem;font-size:0.75rem;color:#888;">No crash data</div>';

            const popupContent = `
                <div style="text-align:center;padding:0.5rem;min-width:180px;">
                    <div style="font-weight:600;margin-bottom:0.25rem;color:${district.color};">${district.name}</div>
                    <div style="font-size:0.75rem;color:#666;">
                        Magisterial District
                    </div>
                    ${crashInfo}
                    <div style="font-size:0.7rem;color:#888;margin-top:0.5rem;">
                        GEOID: ${district.geoid || 'N/A'}
                    </div>
                    <button onclick="filterCrashesByDistrict('${district.name}')"
                            style="margin-top:0.5rem;padding:0.25rem 0.5rem;font-size:0.75rem;cursor:pointer;
                                   background:${district.color};color:white;border:none;border-radius:4px;">
                        View Crashes
                    </button>
                </div>
            `;
            sublayer.setPopupContent(popupContent);
        });
    });
}

/**
 * Filter/highlight crashes for a specific district
 */
function filterCrashesByDistrict(districtName) {
    const stats = districtState.statistics.byDistrict[districtName];
    if (!stats || stats.crashes.length === 0) {
        showToast(`No crashes found in ${districtName}`, 'info');
        return;
    }

    console.log(`[Districts] Filtering ${stats.total} crashes in ${districtName}`);

    // Store selection for cross-tab use
    selectionState.districtFilter = {
        name: districtName,
        crashIds: stats.crashes,
        stats: stats
    };

    // Show notification
    showToast(`${districtName}: ${stats.total} crashes (${stats.K} fatal, ${stats.A} serious injury)`, 'success');

    // Update map to highlight district crashes
    highlightDistrictCrashes(districtName, stats.crashes);
}

/**
 * Highlight crashes belonging to a specific district on the map
 */
function highlightDistrictCrashes(districtName, crashIds) {
    const crashIdSet = new Set(crashIds);

    // Update marker opacity - highlight district crashes, dim others
    if (typeof updateMarkersByFilter === 'function') {
        // Use existing filter function if available
        updateMarkersByFilter(crash => crashIdSet.has(crash[COL.ID]));
    } else if (crashMap && markerCluster) {
        // Manual approach - update marker styles
        markerCluster.eachLayer(marker => {
            if (marker.crashData) {
                const crashId = marker.crashData[COL.ID];
                const inDistrict = crashIdSet.has(crashId);
                marker.setOpacity(inDistrict ? 1 : 0.2);
            }
        });
    }
}

/**
 * Clear district filter
 */
function clearDistrictFilter() {
    selectionState.districtFilter = null;

    // Reset all marker opacities
    if (crashMap && markerCluster) {
        markerCluster.eachLayer(marker => {
            marker.setOpacity(1);
        });
    }
}

/**
 * Update UI elements that display district statistics
 */
function updateDistrictStatisticsUI() {
    // Update the district statistics section in Grants tab if it exists
    const districtStatsContainer = document.getElementById('districtStatisticsContainer');
    if (districtStatsContainer) {
        renderDistrictStatistics(districtStatsContainer);
    }

    // Update asset panel to show district count
    updateMapAssetPanel();
}

/**
 * Round 17 §3 — Tier-adaptive Jurisdiction Breakdown widget.
 * Replaces the old county-only CCD-card render with a single widget that
 * adapts to whatever tier the user is on:
 *
 *   federal / state / region → "Crashes by County"
 *   mpo                      → "Crashes by County within <MPO>"
 *   planning_district        → "Crashes by County within <PD>"
 *   county                   → "Crashes by Magisterial District" (client-side TIGER fallback when CCD is unwired)
 *   city / town              → "Host Jurisdiction" (single host-county card)
 *
 * Backed by the get_jurisdiction_breakdown RPC. State-agnostic.
 *
 * Renders into #magisterialDistrictContainer if present, otherwise the
 * legacy #districtStatisticsContainer used by the Grants tab.
 */
async function renderMagisterialDistricts() {
    const container = document.getElementById('magisterialDistrictContainer')
                   || document.getElementById('districtStatisticsContainer');
    if (!container) return false;
    if (!window.crashLensClient || !window.CL || !CL.data || !CL.data.supabaseBridge) return false;
    let t;
    try { t = CL.data.supabaseBridge.resolveTier(); } catch (e) { return false; }
    if (!t) return false;

    const titleEl = document.getElementById('magisterialDistrictTitle');
    const TITLES = {
        'state':             'Crashes by County',
        'federal':           'Crashes by County',
        'region':            'Crashes by County',
        'mpo':               t.value ? 'Crashes by County within ' + t.value : 'Crashes by County',
        'planning_district': t.value ? 'Crashes by County within ' + t.value : 'Crashes by County',
        'county':            'Crashes by Magisterial District',
        'city':              'Host Jurisdiction',
        'city_town':         'Host Jurisdiction',
    };
    if (titleEl) titleEl.textContent = TITLES[t.tier] || 'Crashes by Jurisdiction';

    container.innerHTML = '<div style="padding:.75rem;color:var(--gray);font-size:.85rem">Loading breakdown…</div>';

    const esc = (s) => String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let rows;
    try {
        rows = await window.crashLensClient.getJurisdictionBreakdown({ tier: t.tier, value: t.value });
    } catch (e) {
        container.innerHTML = '<div style="padding:.75rem;color:#9a3412;font-size:.85rem">Failed to load: ' + esc(e && e.message) + '</div>';
        return true;
    }

    // BLOCKED-UPSTREAM sentinel: the matview cannot compute a within-county
    // (CCD / magisterial-district) breakdown for this state. Hand off to the
    // client-side TIGERweb renderer (_renderDistrictStatisticsLegacy), which
    // computes the magisterial-district matrix locally — the same path the
    // pre-RPC build always used for this widget. Painting directly here (rather
    // than returning false) makes the fallback caller-independent: the
    // jurisdictionChanged listener below ignores our return value, so a bare
    // `return false` would leave the container stuck on "Loading breakdown…".
    if (Array.isArray(rows) && rows.length === 1 && rows[0].is_blocked_upstream) {
        if (typeof _renderDistrictStatisticsLegacy === 'function') {
            _renderDistrictStatisticsLegacy(container);
            return true;
        }
        return false;
    }

    if (!Array.isArray(rows) || rows.length === 0) {
        container.innerHTML = '<div style="padding:.75rem;color:var(--gray);font-size:.85rem">No data for this filter set.</div>';
        return true;
    }

    const total = rows.reduce((s, r) => s + (Number(r.crash_count) || 0), 0);
    const kindIcon = { 'county': '🏛️', 'ccd': '🗺️', 'host_county': '📍' };

    container.innerHTML = rows.map(r => {
        const pct = total > 0 ? ((r.crash_count / total) * 100).toFixed(1) : '0.0';
        const icon = kindIcon[r.breakdown_kind] || '🏛️';
        const epdoStr = Number(r.epdo || 0).toLocaleString();
        const safeName = esc(r.label || '(unnamed)');
        return '<div class="jurisdiction-card" data-breakdown-kind="' + esc(r.breakdown_kind) + '" '
            +    'style="background:var(--bg-secondary);border-radius:8px;padding:.75rem;margin-bottom:.5rem;border-left:4px solid #7c3aed">'
            +   '<div style="display:flex;justify-content:space-between;align-items:flex-start">'
            +     '<div><div style="font-weight:600;color:#7c3aed">' + icon + ' ' + safeName + '</div>'
            +     '<div style="font-size:.8rem;color:var(--gray);margin-top:.25rem">'
            +       (Number(r.crash_count) || 0).toLocaleString() + ' crashes (' + pct + '%)'
            +     '</div></div>'
            +     '<div style="text-align:right"><div style="font-size:.9rem;font-weight:600">' + epdoStr + '</div>'
            +     '<div style="font-size:.7rem;color:var(--gray)">EPDO</div></div>'
            +   '</div>'
            +   '<div style="display:flex;gap:.5rem;margin-top:.5rem;font-size:.75rem;flex-wrap:wrap">'
            +     '<span style="color:#dc2626">K:' + (r.fatals || 0) + '</span>'
            +     '<span style="color:#f97316">A:' + (r.serious || 0) + '</span>'
            +     '<span style="color:#6366f1">Ped:' + (r.ped_count || 0) + '</span>'
            +     '<span style="color:#0891b2">Bike:' + (r.bike_count || 0) + '</span>'
            +     '<span style="color:#6b7280">KA ' + (Number(r.ka_rate_pct) || 0) + '%</span>'
            +   '</div>'
            + '</div>';
    }).join('');

    // Round 17 §5 — click-to-drill: state/mpo/PD-tier county cards drill into county tier.
    if (t.tier === 'state' || t.tier === 'federal' || t.tier === 'region'
        || t.tier === 'mpo' || t.tier === 'planning_district') {
        attachJurisdictionCardClicks();
    }
    return true;
}

/**
 * Round 17 §5 — clicking a "county" card from a state/MPO/PD rollup
 * drills the active tier down to county. No-op when no drill helper
 * is available on the page.
 */
function attachJurisdictionCardClicks() {
    const container = document.getElementById('magisterialDistrictContainer')
                   || document.getElementById('districtStatisticsContainer');
    if (!container) return;
    container.querySelectorAll('.jurisdiction-card[data-breakdown-kind="county"]').forEach(card => {
        card.style.cursor = 'pointer';
        card.title = 'Click to drill into this county';
        card.addEventListener('click', () => {
            const h5 = card.querySelector('div[style*="font-weight:600"]');
            const label = h5 ? h5.textContent.replace(/^\W+\s*/, '').trim() : '';
            if (!label) return;
            if (typeof setTierAndJurisdiction === 'function') {
                try { setTierAndJurisdiction('county', label); } catch (e) {
                    console.warn('[Magisterial] drill failed:', e && e.message);
                }
            } else {
                console.log('[Magisterial] drill requested:', label, '(no setTierAndJurisdiction available)');
            }
        }, { once: true });
    });
}

// Round 17 §3 — re-render the tier-adaptive widget whenever the active
// tier / jurisdiction changes. Debounced via the event itself; the
// widget shows a loading state immediately, then swaps in real cards.
document.addEventListener('jurisdictionChanged', function () {
    if (!document.getElementById('magisterialDistrictContainer')
        && !document.getElementById('districtStatisticsContainer')) return;
    if (typeof renderMagisterialDistricts !== 'function') return;
    Promise.resolve(renderMagisterialDistricts()).catch(e =>
        console.warn('[Magisterial] re-render failed:', e && e.message));
});

/**
 * Render district statistics into a container
 */
function renderDistrictStatistics(container) {
    // Round 14 §0.4 — try the Supabase-backed renderer first. If it succeeds,
    // it owns the container and we exit early. If it returns false, fall
    // through to the legacy districtState-based render below.
    if (typeof renderMagisterialDistricts === 'function') {
        Promise.resolve(renderMagisterialDistricts())
            .then(ok => {
                if (ok) return;
                _renderDistrictStatisticsLegacy(container);
            })
            .catch(() => _renderDistrictStatisticsLegacy(container));
        return;
    }
    _renderDistrictStatisticsLegacy(container);
}

function _renderDistrictStatisticsLegacy(container) {
    if (!districtState.loaded || Object.keys(districtState.statistics.byDistrict).length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:1rem;color:var(--gray);">
                <div>No district data available</div>
                <div style="font-size:0.75rem;margin-top:0.25rem;">
                    Enable Magisterial Districts layer or select a county jurisdiction
                </div>
            </div>
        `;
        return;
    }

    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);  // Sort by EPDO (highest first)

    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    let html = `
        <div class="district-stats-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
            <h4 style="margin:0;font-size:0.9rem;">Crashes by Magisterial District</h4>
            <span style="font-size:0.75rem;color:var(--gray);">
                ${districtState.statistics.totalAssigned.toLocaleString()} assigned /
                ${(districtState.statistics.totalAssigned + districtState.statistics.totalUnassigned).toLocaleString()} total
            </span>
        </div>
        <div class="district-stats-grid" style="display:grid;gap:0.5rem;">
    `;

    districts.forEach((stats, index) => {
        const color = districtColors[index % districtColors.length];
        const pctOfTotal = districtState.statistics.totalAssigned > 0
            ? ((stats.total / districtState.statistics.totalAssigned) * 100).toFixed(1)
            : 0;

        html += `
            <div class="district-stat-card" style="background:var(--bg-secondary);border-radius:8px;padding:0.75rem;
                        border-left:4px solid ${color};cursor:pointer;"
                 onclick="filterCrashesByDistrict('${stats.name}')">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <div style="font-weight:600;color:${color};">${stats.name}</div>
                        <div style="font-size:0.8rem;color:var(--gray);margin-top:0.25rem;">
                            ${stats.total.toLocaleString()} crashes (${pctOfTotal}%)
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:0.9rem;font-weight:600;">${stats.epdo.toLocaleString()}</div>
                        <div style="font-size:0.7rem;color:var(--gray);">EPDO</div>
                    </div>
                </div>
                <div style="display:flex;gap:0.5rem;margin-top:0.5rem;font-size:0.75rem;">
                    <span style="color:#dc2626;">K:${stats.K}</span>
                    <span style="color:#f97316;">A:${stats.A}</span>
                    <span style="color:#eab308;">B:${stats.B}</span>
                    <span style="color:#22c55e;">C:${stats.C}</span>
                    <span style="color:#6b7280;">O:${stats.O}</span>
                    ${stats.ped > 0 ? `<span style="color:#8b5cf6;">Ped:${stats.ped}</span>` : ''}
                    ${stats.bike > 0 ? `<span style="color:#06b6d4;">Bike:${stats.bike}</span>` : ''}
                </div>
                <div style="margin-top:0.5rem;height:4px;background:var(--border);border-radius:2px;overflow:hidden;">
                    <div style="height:100%;width:${pctOfTotal}%;background:${color};"></div>
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Add export button
    html += `
        <div style="margin-top:1rem;text-align:right;">
            <button onclick="exportDistrictStatistics()"
                    style="padding:0.5rem 1rem;font-size:0.8rem;cursor:pointer;
                           background:var(--primary);color:white;border:none;border-radius:6px;">
                Export District Report
            </button>
        </div>
    `;

    container.innerHTML = html;
}

/**
 * Export district statistics to CSV
 */
function exportDistrictStatistics() {
    if (!districtState.loaded) {
        showToast('District statistics not loaded', 'warning');
        return;
    }

    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);

    // Build CSV
    const headers = [
        'District Name', 'GEOID', 'Total Crashes', 'Fatal (K)', 'Serious Injury (A)',
        'Minor Injury (B)', 'Possible Injury (C)', 'Property Damage (O)', 'EPDO Score',
        'Pedestrian Crashes', 'Bicycle Crashes', 'Nighttime Crashes', 'Speed Related',
        'Wet Road Crashes', 'Percent of Total'
    ];

    const rows = districts.map(stats => {
        const pctOfTotal = districtState.statistics.totalAssigned > 0
            ? ((stats.total / districtState.statistics.totalAssigned) * 100).toFixed(2)
            : 0;
        return [
            stats.name,
            stats.geoid || '',
            stats.total,
            stats.K,
            stats.A,
            stats.B,
            stats.C,
            stats.O,
            stats.epdo,
            stats.ped,
            stats.bike,
            stats.nighttime,
            stats.speedRelated,
            stats.wetRoad,
            pctOfTotal + '%'
        ];
    });

    // Add summary row
    const totals = {
        total: districts.reduce((sum, d) => sum + d.total, 0),
        K: districts.reduce((sum, d) => sum + d.K, 0),
        A: districts.reduce((sum, d) => sum + d.A, 0),
        B: districts.reduce((sum, d) => sum + d.B, 0),
        C: districts.reduce((sum, d) => sum + d.C, 0),
        O: districts.reduce((sum, d) => sum + d.O, 0),
        epdo: districts.reduce((sum, d) => sum + d.epdo, 0),
        ped: districts.reduce((sum, d) => sum + d.ped, 0),
        bike: districts.reduce((sum, d) => sum + d.bike, 0)
    };

    rows.push([
        'TOTAL',
        '',
        totals.total,
        totals.K,
        totals.A,
        totals.B,
        totals.C,
        totals.O,
        totals.epdo,
        totals.ped,
        totals.bike,
        '',
        '',
        '',
        '100%'
    ]);

    // Generate CSV content
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => {
            const str = String(cell);
            return str.includes(',') ? `"${str}"` : str;
        }).join(',') + '\n';
    });

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    const filename = `district_crash_statistics_${jurisdiction?.name?.replace(/\s+/g, '_') || 'report'}_${new Date().toISOString().split('T')[0]}.csv`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported district statistics to ${filename}`, 'success');
}

// ============================================================
// SECTION 9.5.5: DISTRICT MATRIX WIDGET (NON-RECURSIVE)
// ============================================================

let districtMatrixExpanded = false;

/**
 * Show loading state in the district matrix widget
 * Pure UI function - does NOT trigger any data loading
 */
function showDistrictMatrixLoading(message = 'Loading district boundaries...', progress = null) {
    const widget = document.getElementById('districtMatrixWidget');
    const loadingEl = document.getElementById('districtMatrixLoading');
    const errorEl = document.getElementById('districtMatrixError');
    const emptyEl = document.getElementById('districtMatrixEmpty');
    const tableEl = document.getElementById('districtMatrixTable');
    const chartsEl = document.getElementById('districtMatrixCharts');

    // Check if we're a county
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

    if (!jurisdiction || jurisdiction.type !== 'county') {
        if (widget) widget.style.display = 'none';
        return;
    }

    if (widget) widget.style.display = 'block';
    if (loadingEl) {
        // Build progress indicator if provided
        let progressHTML = '';
        if (progress !== null && typeof progress === 'object') {
            const percent = Math.round((progress.current / progress.total) * 100);
            progressHTML = `
                <div style="margin-top:0.5rem;">
                    <div style="width:100%;height:6px;background:#e2e8f0;border-radius:3px;overflow:hidden;">
                        <div style="width:${percent}%;height:100%;background:linear-gradient(90deg,#7c3aed,#a855f7);transition:width 0.3s ease;"></div>
                    </div>
                    <div style="font-size:0.75rem;margin-top:0.25rem;color:var(--gray);">
                        ${progress.current.toLocaleString()} of ${progress.total.toLocaleString()} crashes (${percent}%)
                    </div>
                </div>
            `;
        } else {
            progressHTML = `<div style="font-size:0.75rem;margin-top:0.25rem;color:var(--gray);">Fetching from TIGERweb API</div>`;
        }

        loadingEl.innerHTML = `
            <div class="spinner" style="width:24px;height:24px;border:3px solid #e2e8f0;border-top-color:#7c3aed;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 0.75rem"></div>
            <div>${message}</div>
            ${progressHTML}
        `;
        loadingEl.style.display = 'block';
    }
    if (errorEl) errorEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (tableEl) tableEl.style.display = 'none';
    if (chartsEl) chartsEl.style.display = 'none';
}

/**
 * Show error state in the district matrix widget
 * Pure UI function - does NOT trigger any data loading
 */
function showDistrictMatrixError(errorMessage) {
    const widget = document.getElementById('districtMatrixWidget');
    const loadingEl = document.getElementById('districtMatrixLoading');
    const errorEl = document.getElementById('districtMatrixError');
    const errorMsgEl = document.getElementById('districtMatrixErrorMsg');
    const emptyEl = document.getElementById('districtMatrixEmpty');
    const tableEl = document.getElementById('districtMatrixTable');
    const chartsEl = document.getElementById('districtMatrixCharts');

    // Check if we're a county
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

    if (!jurisdiction || jurisdiction.type !== 'county') {
        if (widget) widget.style.display = 'none';
        return;
    }

    if (widget) widget.style.display = 'block';
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'block';
    if (errorMsgEl) errorMsgEl.textContent = errorMessage;
    if (emptyEl) emptyEl.style.display = 'none';
    if (tableEl) tableEl.style.display = 'none';
    if (chartsEl) chartsEl.style.display = 'none';
}

/**
 * Retry loading district matrix
 * Called from the retry button in error state
 */
function retryLoadDistrictMatrix() {
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    if (!jurisdictionId) return;

    // Clear cache for this jurisdiction
    if (builtInLayersState?.magisterialDistricts?.geojsonCache) {
        delete builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
    }
    builtInLayersState.magisterialDistricts.status = 'ready';
    builtInLayersState.magisterialDistricts.lastError = null;

    // Reset district state
    districtState.loaded = false;
    districtState.loadingError = null;
    districtState.crashAssignments.clear();
    districtState.statistics = { byDistrict: {}, totalAssigned: 0, totalUnassigned: 0 };

    // Show loading state
    showDistrictMatrixLoading('Retrying... Fetching district boundaries...');

    // Trigger fresh load
    preloadDistrictsForStatistics(jurisdictionId, true);
}

/**
 * Refresh magisterial district cache
 * Clears both IndexedDB and in-memory cache, then fetches fresh data
 * Called from the Refresh button in the district matrix widget
 */
async function refreshMagisterialDistrictCache() {
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    if (!jurisdictionId) {
        showNotification('No jurisdiction selected', 'warning');
        return;
    }

    const refreshBtn = document.getElementById('districtMatrixRefreshBtn');
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '⏳ Refreshing...';
    }

    try {
        // Clear IndexedDB cache for this jurisdiction
        await clearMagisterialCache(jurisdictionId);

        // Clear in-memory cache
        if (builtInLayersState?.magisterialDistricts?.geojsonCache) {
            delete builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
        }

        // Reset state
        builtInLayersState.magisterialDistricts.status = 'ready';
        builtInLayersState.magisterialDistricts.lastError = null;
        districtState.loaded = false;
        districtState.loadingError = null;
        districtState.crashAssignments.clear();
        districtState.statistics = { byDistrict: {}, totalAssigned: 0, totalUnassigned: 0 };

        // Show loading state
        showDistrictMatrixLoading('Refreshing district boundaries from server...');

        // Trigger fresh load
        await preloadDistrictsForStatistics(jurisdictionId, true);

        showNotification('District boundaries refreshed successfully', 'success');
    } catch (error) {
        console.error('[Districts] Refresh failed:', error);
        showNotification('Failed to refresh district boundaries', 'error');
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '🔄 Refresh';
        }
    }
}

/**
 * Render the district matrix widget with current data
 * Pure render function - does NOT trigger any data loading
 */
async function renderDistrictMatrixWidget() {
    // Round 20 §X8 (restored in 21.1 §3) — short-circuit when the state's
    // capability flag forbids CCD assignment. The helper paints a
    // BLOCKED-UPSTREAM banner inline; nothing else should run on this widget.
    if (typeof _hideDistrictWidgetIfUnsupported === 'function'
        && await _hideDistrictWidgetIfUnsupported()) {
        return;
    }
    const widget = document.getElementById('districtMatrixWidget');
    const loadingEl = document.getElementById('districtMatrixLoading');
    const errorEl = document.getElementById('districtMatrixError');
    const emptyEl = document.getElementById('districtMatrixEmpty');
    const tableEl = document.getElementById('districtMatrixTable');
    const chartsEl = document.getElementById('districtMatrixCharts');
    const bodyEl = document.getElementById('districtMatrixBody');
    const footerEl = document.getElementById('districtMatrixFooter');
    const summaryEl = document.getElementById('districtMatrixSummary');
    const statusEl = document.getElementById('districtMatrixStatus');

    if (!widget) return;

    // Check if we're a county (districts only apply to counties)
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

    if (!jurisdiction || jurisdiction.type !== 'county') {
        widget.style.display = 'none';
        return;
    }

    // Show widget for counties
    widget.style.display = 'block';

    // Check for error state - but allow recovery if crash data is loaded
    if (builtInLayersState?.magisterialDistricts?.status === 'error') {
        if (crashState.loaded && !districtState.isComputing) {
            // Fall through to recovery logic in Case 4.5 below
            console.log('[Districts] Error state detected with crash data loaded - attempting recovery');
        } else {
            const errorMsg = districtState.loadingError || builtInLayersState.magisterialDistricts.lastError || 'Unknown error';
            showDistrictMatrixError(errorMsg);
            return;
        }
    }

    // Check if loading districts
    if (builtInLayersState?.magisterialDistricts?.status === 'loading') {
        showDistrictMatrixLoading('Fetching district boundaries from Census API...');
        return;
    }

    // Check various states when data isn't fully loaded
    if (!districtState.loaded || Object.keys(districtState.statistics.byDistrict).length === 0) {
        const hasDistrictCache = builtInLayersState?.magisterialDistricts?.geojsonCache[jurisdictionId];
        const districtStatus = builtInLayersState?.magisterialDistricts?.status;

        // Case 1: Districts are cached/active but crash data not loaded yet
        if ((hasDistrictCache || districtStatus === 'active') && !crashState.loaded) {
            showDistrictMatrixLoading('District boundaries ready. Upload crash data to view statistics.');
            return;
        }

        // Case 2: Districts cached and crash data loaded, but stats computation in progress
        if (hasDistrictCache && crashState.loaded && districtState.isComputing) {
            // Progress is updated by computeDistrictCrashStatistics directly
            return;
        }

        // Case 3: Districts cached and crash data loaded, but stats not computed yet - trigger computation
        if (hasDistrictCache && crashState.loaded && !districtState.loaded) {
            showDistrictMatrixLoading('Computing district statistics...');
            // Trigger computation
            const geojson = builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
            if (geojson && !districtState.isComputing) {
                computeDistrictCrashStatistics(geojson, jurisdictionId);
            }
            return;
        }

        // Case 4: No districts loaded yet, status is 'ready' - trigger loading
        if (districtStatus === 'ready' && crashState.loaded) {
            showDistrictMatrixLoading('Loading district boundaries...');
            preloadDistrictsForStatistics(jurisdictionId, false);
            return;
        }

        // Case 4.5: Status is 'error' or 'active' but stats never loaded - attempt recovery
        if (crashState.loaded && !districtState.isComputing && (districtStatus === 'error' || districtStatus === 'active')) {
            console.log('[Districts] Recovery attempt - status:', districtStatus, 'loaded:', districtState.loaded);
            builtInLayersState.magisterialDistricts.status = 'ready';
            districtState.loadingError = null;
            showDistrictMatrixLoading('Loading district boundaries...');
            preloadDistrictsForStatistics(jurisdictionId, false);
            return;
        }

        // Case 5: Truly empty - no districts available or no crash data
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        if (tableEl) tableEl.style.display = 'none';
        if (chartsEl) chartsEl.style.display = 'none';
        return;
    }

    // Hide loading/error/empty, show table
    if (loadingEl) loadingEl.style.display = 'none';
    if (errorEl) errorEl.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'none';
    if (tableEl) tableEl.style.display = 'block';

    // Get districts sorted by EPDO
    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);

    if (districts.length === 0) {
        if (tableEl) tableEl.style.display = 'none';
        if (emptyEl) emptyEl.style.display = 'block';
        if (chartsEl) chartsEl.style.display = 'none';
        return;
    }

    // Get district colors from config - extended palette for many districts
    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
        '#14b8a6', '#a855f7', '#f43f5e', '#84cc16',
        '#0ea5e9', '#d946ef', '#fb923c', '#2dd4bf',
        '#6366f1', '#e11d48', '#65a30d', '#0891b2',
        '#9333ea', '#ea580c', '#059669', '#4f46e5',
        '#be185d', '#ca8a04', '#0d9488', '#7c3aed',
        '#dc2626', '#16a34a', '#2563eb', '#c026d3',
        '#d97706', '#0284c7', '#9f1239', '#4d7c0f'
    ];

    // Show all districts - no limit
    const displayDistricts = districts;

    // Render table body
    let bodyHTML = '';
    displayDistricts.forEach((stats, index) => {
        const color = districtColors[index % districtColors.length];
        const ka = stats.K + stats.A;

        bodyHTML += `
            <tr style="cursor:pointer;" onclick="filterCrashesByDistrict('${stats.name}')"
                onmouseover="this.style.background='var(--bg-secondary)'"
                onmouseout="this.style.background='transparent'">
                <td style="white-space:nowrap;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${color};margin-right:6px;"></span>
                    ${stats.name}
                </td>
                <td style="font-weight:600;">${stats.total.toLocaleString()}</td>
                <td style="color:#dc2626;font-weight:${stats.K > 0 ? '700' : '400'};">${stats.K}</td>
                <td style="color:#f97316;font-weight:${stats.A > 0 ? '700' : '400'};">${stats.A}</td>
                <td style="background:#fef2f2;color:#dc2626;font-weight:700;">${ka}</td>
                <td style="color:#8b5cf6;">${stats.ped || 0}</td>
                <td style="color:#06b6d4;">${stats.bike || 0}</td>
                <td style="font-weight:600;">${stats.epdo.toLocaleString()}</td>
            </tr>
        `;
    });

    if (bodyEl) bodyEl.innerHTML = bodyHTML;

    // Render footer totals
    const totals = {
        total: 0, K: 0, A: 0, ped: 0, bike: 0, epdo: 0
    };
    districts.forEach(d => {
        totals.total += d.total;
        totals.K += d.K;
        totals.A += d.A;
        totals.ped += d.ped || 0;
        totals.bike += d.bike || 0;
        totals.epdo += d.epdo;
    });

    if (footerEl) {
        footerEl.innerHTML = `
            <tr style="font-weight:700;background:var(--bg-secondary);border-top:2px solid var(--border);">
                <td>TOTAL (${districts.length} districts)</td>
                <td>${totals.total.toLocaleString()}</td>
                <td style="color:#dc2626;">${totals.K}</td>
                <td style="color:#f97316;">${totals.A}</td>
                <td style="background:#fef2f2;color:#dc2626;">${totals.K + totals.A}</td>
                <td style="color:#8b5cf6;">${totals.ped}</td>
                <td style="color:#06b6d4;">${totals.bike}</td>
                <td>${totals.epdo.toLocaleString()}</td>
            </tr>
        `;
    }

    // Update summary
    if (summaryEl) {
        summaryEl.textContent = `${districtState.statistics.totalAssigned.toLocaleString()} crashes assigned to ${districts.length} districts`;
    }

    // Update status
    if (statusEl) {
        statusEl.textContent = `${districts.length} districts`;
    }

    // Update expand button visibility - show when districts overflow the compact view
    const expandBtn = document.getElementById('districtMatrixExpandBtn');
    if (expandBtn) {
        expandBtn.style.display = districts.length > 10 ? 'inline-flex' : 'none';
    }
    updateDistrictMatrixExpandButton();

    // Update wrapper height based on expand state and district count
    const wrapper = document.getElementById('districtMatrixTableWrapper');
    if (wrapper) {
        if (districtMatrixExpanded) {
            wrapper.style.maxHeight = 'none';
        } else {
            wrapper.style.maxHeight = districts.length <= 10 ? 'none' : '400px';
        }
    }

    // Render district charts
    renderDistrictMatrixCharts();
}

/**
 * Toggle district matrix expand/collapse
 */
function toggleDistrictMatrixExpand() {
    districtMatrixExpanded = !districtMatrixExpanded;

    // Update table wrapper height - expanded shows all, collapsed caps at 400px
    const wrapper = document.getElementById('districtMatrixTableWrapper');
    if (wrapper) {
        wrapper.style.maxHeight = districtMatrixExpanded ? 'none' : '400px';
    }

    updateDistrictMatrixExpandButton();
}

/**
 * Update the expand button text and icon for district matrix
 */
function updateDistrictMatrixExpandButton() {
    const iconEl = document.getElementById('districtMatrixExpandIcon');
    const btnEl = document.getElementById('districtMatrixExpandBtn');

    if (iconEl) iconEl.textContent = districtMatrixExpanded ? '▲' : '▼';
    if (btnEl) {
        const textSpan = btnEl.querySelector('span:last-child') || btnEl;
        if (textSpan !== btnEl) {
            // Has icon span, update just the text after it
        }
        btnEl.innerHTML = `<span id="districtMatrixExpandIcon">${districtMatrixExpanded ? '▲' : '▼'}</span> ${districtMatrixExpanded ? 'Collapse' : 'Expand'}`;
    }
}

/**
 * Render charts for the Magisterial District module
 * Creates 4 visualizations: total crashes bar, severity stacked bar, distribution doughnut, EPDO bar
 */
function renderDistrictMatrixCharts() {
    const chartsContainer = document.getElementById('districtMatrixCharts');
    if (!chartsContainer) return;

    // Check if we have district data
    if (!districtState.loaded || Object.keys(districtState.statistics.byDistrict).length === 0) {
        chartsContainer.style.display = 'none';
        return;
    }

    // Show charts container
    chartsContainer.style.display = 'block';

    // Get district colors from config - extended palette for many districts
    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
        '#14b8a6', '#a855f7', '#f43f5e', '#84cc16',
        '#0ea5e9', '#d946ef', '#fb923c', '#2dd4bf',
        '#6366f1', '#e11d48', '#65a30d', '#0891b2',
        '#9333ea', '#ea580c', '#059669', '#4f46e5',
        '#be185d', '#ca8a04', '#0d9488', '#7c3aed',
        '#dc2626', '#16a34a', '#2563eb', '#c026d3',
        '#d97706', '#0284c7', '#9f1239', '#4d7c0f'
    ];

    // Get districts sorted by EPDO (consistent with table)
    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);

    const labels = districts.map(d => d.name.replace(' district', '').replace(' District', ''));
    const colors = districts.map((_, i) => districtColors[i % districtColors.length]);

    // Dynamically size horizontal bar chart heights based on district count
    const barChartHeight = Math.max(220, districts.length * 24);
    ['chartDistrictTotal', 'chartDistrictSeverity', 'chartDistrictEPDO'].forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas && canvas.parentElement) {
            canvas.parentElement.style.height = barChartHeight + 'px';
        }
    });

    // ---- Chart 1: Total Crashes by District (Horizontal Bar) ----
    const totalData = districts.map(d => d.total);
    // Round 15 §12.5 — wrap with paintWhenVisible. The District section is
    // hidden until expanded; instantiating a Chart against a 0×0 canvas
    // produced the four blank canvases reported by the QA sweep.
    paintWhenVisible('chartDistrictTotal', () => createChart('chartDistrictTotal', 'bar', {
        labels: labels,
        datasets: [{
            label: 'Total Crashes',
            data: totalData,
            backgroundColor: colors,
            borderColor: colors.map(c => c),
            borderWidth: 1
        }]
    }, {
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => `${ctx.parsed.x.toLocaleString()} crashes`
                }
            }
        },
        scales: {
            x: { beginAtZero: true, ticks: { font: { size: 9 } } },
            y: { ticks: { font: { size: 9 } } }
        }
    }));

    // ---- Chart 2: Severity Breakdown by District (Stacked Horizontal Bar) ----
    const severityColors = {
        K: '#dc2626',  // Fatal - red
        A: '#f97316',  // Serious - orange
        BC: '#facc15', // B+C combined - yellow
        O: '#94a3b8'   // PDO - gray
    };

    paintWhenVisible('chartDistrictSeverity', () => createChart('chartDistrictSeverity', 'bar', {
        labels: labels,
        datasets: [
            {
                label: 'Fatal (K)',
                data: districts.map(d => d.K),
                backgroundColor: severityColors.K,
                borderWidth: 0
            },
            {
                label: 'Serious (A)',
                data: districts.map(d => d.A),
                backgroundColor: severityColors.A,
                borderWidth: 0
            },
            {
                label: 'Injury (B+C)',
                data: districts.map(d => (d.B || 0) + (d.C || 0)),
                backgroundColor: severityColors.BC,
                borderWidth: 0
            },
            {
                label: 'PDO (O)',
                data: districts.map(d => d.O),
                backgroundColor: severityColors.O,
                borderWidth: 0
            }
        ]
    }, {
        indexAxis: 'y',
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: { font: { size: 8 }, boxWidth: 12, padding: 4 }
            },
            tooltip: {
                mode: 'index',
                callbacks: {
                    label: ctx => `${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                beginAtZero: true,
                ticks: { font: { size: 9 } }
            },
            y: {
                stacked: true,
                ticks: { font: { size: 9 } }
            }
        }
    }));

    // ---- Chart 3: Crash Distribution (Doughnut) ----
    paintWhenVisible('chartDistrictDoughnut', () => createChart('chartDistrictDoughnut', 'doughnut', {
        labels: labels,
        datasets: [{
            data: totalData,
            backgroundColor: colors,
            borderColor: '#fff',
            borderWidth: 2
        }]
    }, {
        cutout: '55%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => {
                        const total = totalData.reduce((a, b) => a + b, 0);
                        const pct = ((ctx.parsed / total) * 100).toFixed(1);
                        return `${ctx.label}: ${ctx.parsed.toLocaleString()} (${pct}%)`;
                    }
                }
            }
        }
    }));

    // Build custom legend for doughnut
    const legendEl = document.getElementById('legendDistrictDoughnut');
    if (legendEl) {
        const total = totalData.reduce((a, b) => a + b, 0);
        let legendHTML = '';
        districts.forEach((d, i) => {
            const pct = ((d.total / total) * 100).toFixed(1);
            const shortName = d.name.replace(' district', '').replace(' District', '');
            legendHTML += `
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                    <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${colors[i]};flex-shrink:0;"></span>
                    <span style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${shortName}">${shortName}</span>
                    <span style="font-weight:600;color:var(--dark);">${pct}%</span>
                </div>`;
        });
        legendEl.innerHTML = legendHTML;
    }

    // ---- Chart 4: EPDO by District (Vertical Bar) ----
    const epdoData = districts.map(d => d.epdo);
    paintWhenVisible('chartDistrictEPDO', () => createChart('chartDistrictEPDO', 'bar', {
        labels: labels,
        datasets: [{
            label: 'EPDO Score',
            data: epdoData,
            backgroundColor: colors.map(c => c + 'CC'), // Add transparency
            borderColor: colors,
            borderWidth: 2
        }]
    }, {
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => `EPDO: ${ctx.parsed.y.toLocaleString()}`
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    font: { size: 8 },
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                beginAtZero: true,
                ticks: { font: { size: 9 } }
            }
        }
    }));
}

/**
 * Export district matrix to CSV
 */
function exportDistrictMatrixCSV() {
    if (!districtState.loaded || Object.keys(districtState.statistics.byDistrict).length === 0) {
        showToast('No district data to export', 'warning');
        return;
    }

    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);

    // Build CSV content
    const headers = ['District', 'Total Crashes', 'Fatal (K)', 'Serious Injury (A)', 'K+A Combined', 'Pedestrian', 'Bicycle', 'EPDO'];
    let csv = headers.join(',') + '\n';

    districts.forEach(d => {
        const row = [
            `"${d.name}"`,
            d.total,
            d.K,
            d.A,
            d.K + d.A,
            d.ped || 0,
            d.bike || 0,
            d.epdo
        ];
        csv += row.join(',') + '\n';
    });

    // Add totals row
    const totals = districts.reduce((acc, d) => ({
        total: acc.total + d.total,
        K: acc.K + d.K,
        A: acc.A + d.A,
        ped: acc.ped + (d.ped || 0),
        bike: acc.bike + (d.bike || 0),
        epdo: acc.epdo + d.epdo
    }), { total: 0, K: 0, A: 0, ped: 0, bike: 0, epdo: 0 });

    csv += `"TOTAL",${totals.total},${totals.K},${totals.A},${totals.K + totals.A},${totals.ped},${totals.bike},${totals.epdo}\n`;

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    const filename = `district_crash_matrix_${jurisdiction?.name?.replace(/\s+/g, '_') || 'report'}_${new Date().toISOString().split('T')[0]}.csv`;

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported to ${filename}`, 'success');
}

// ============================================================
// END NEW DISTRICT MATRIX WIDGET FUNCTIONS
// ============================================================

/**
 * Populate the global district filter dropdown
 * Shows/hides the filter based on whether districts are loaded
 */
function populateDistrictFilter() {
    const filterGroup = document.getElementById('filterDistrictGroup');
    const filterSelect = document.getElementById('filterDistrict');

    if (!filterGroup || !filterSelect) return;

    // Check if we're a county and districts are loaded
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

    if (!jurisdiction || jurisdiction.type !== 'county' || !districtState.loaded) {
        filterGroup.style.display = 'none';
        return;
    }

    // Show the filter group
    filterGroup.style.display = '';

    // Get districts sorted by EPDO (most severe first)
    const districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);

    if (districts.length === 0) {
        filterGroup.style.display = 'none';
        return;
    }

    // Preserve current selection if any
    const currentSelection = filterSelect.value;

    // Build options
    filterSelect.innerHTML = '<option value="">All Districts</option>' +
        districts.map(d => {
            const kaCount = d.K + d.A;
            return `<option value="${esc(d.name)}" title="${d.total} crashes, ${d.epdo} EPDO">${esc(d.name)} (${d.total})</option>`;
        }).join('');

    // Restore selection if it still exists
    if (currentSelection && districts.some(d => d.name === currentSelection)) {
        filterSelect.value = currentSelection;
    }

    console.log('[Filters] District filter populated with', districts.length, 'districts');
}

/**
 * Get district statistics for a specific district
 */
function getDistrictStatistics(districtName) {
    return districtState.statistics.byDistrict[districtName] || null;
}

/**
 * Get all district statistics sorted by a field
 */
function getAllDistrictStatistics(sortBy = 'epdo', descending = true) {
    const districts = Object.values(districtState.statistics.byDistrict);
    return districts.sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        return descending ? bVal - aVal : aVal - bVal;
    });
}

// ============================================================
// SECTION 9.5.6: DISTRICT DRILL-DOWN SIDEBAR
// ============================================================

/**
 * Show the district drill-down sidebar with detailed crash analysis
 * Called when user clicks on a district polygon on the map
 */
function showDistrictDrillDown(districtName, color) {
    const stats = districtState.statistics.byDistrict[districtName];
    if (!stats) {
        showToast(`No crash data available for ${districtName}`, 'warning');
        return;
    }

    // Close any existing drill-down
    closeDistrictDrillDown();

    // Get all districts for comparison
    const allDistricts = Object.values(districtState.statistics.byDistrict).sort((a, b) => b.epdo - a.epdo);
    const rank = allDistricts.findIndex(d => d.name === districtName) + 1;
    const countyAvg = districtState.statistics.totalAssigned / allDistricts.length;
    const vsAvg = stats.total > 0 ? ((stats.total / countyAvg - 1) * 100).toFixed(0) : 0;

    // Find top hotspots in this district
    const districtCrashIds = new Set(stats.crashes || []);
    const hotspots = findDistrictHotspots(districtCrashIds, 5);

    // Calculate trends if we have year data
    const yearTrend = calculateDistrictYearTrend(stats);

    // Build the sidebar HTML
    const sidebarHtml = `
        <div id="districtDrillDownSidebar" class="district-drilldown-sidebar" style="
            position: fixed;
            top: 0;
            right: 0;
            width: 400px;
            height: 100vh;
            background: var(--bg);
            box-shadow: -4px 0 20px rgba(0,0,0,0.15);
            z-index: 2000;
            overflow-y: auto;
            animation: slideInRight 0.3s ease;
        ">
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .district-drilldown-sidebar .stat-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid var(--border);
                }
                .district-drilldown-sidebar .hotspot-item {
                    padding: 0.75rem;
                    background: var(--bg-secondary);
                    border-radius: 8px;
                    margin-bottom: 0.5rem;
                    cursor: pointer;
                    transition: transform 0.15s;
                }
                .district-drilldown-sidebar .hotspot-item:hover {
                    transform: translateX(4px);
                }
            </style>

            <!-- Header -->
            <div style="background:${color};color:white;padding:1.25rem;position:sticky;top:0;z-index:10;">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                    <div>
                        <div style="font-size:1.35rem;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,0.25);">${esc(districtName)}</div>
                        <div style="font-size:0.9rem;text-shadow:0 1px 2px rgba(0,0,0,0.2);">Magisterial District</div>
                    </div>
                    <button onclick="closeDistrictDrillDown()" style="
                        background:rgba(255,255,255,0.2);
                        border:none;
                        color:white;
                        width:32px;
                        height:32px;
                        border-radius:50%;
                        cursor:pointer;
                        font-size:1.2rem;
                    ">×</button>
                </div>
                <div style="display:flex;gap:1rem;margin-top:1rem;">
                    <div style="text-align:center;flex:1;background:rgba(255,255,255,0.25);padding:0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.3);">
                        <div style="font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${stats.total.toLocaleString()}</div>
                        <div style="font-size:0.85rem;text-shadow:0 1px 1px rgba(0,0,0,0.15);">Total Crashes</div>
                    </div>
                    <div style="text-align:center;flex:1;background:rgba(255,255,255,0.25);padding:0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.3);">
                        <div style="font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.2);">${stats.epdo.toLocaleString()}</div>
                        <div style="font-size:0.85rem;text-shadow:0 1px 1px rgba(0,0,0,0.15);">EPDO Score</div>
                    </div>
                    <div style="text-align:center;flex:1;background:rgba(255,255,255,0.25);padding:0.75rem;border-radius:8px;border:1px solid rgba(255,255,255,0.3);">
                        <div style="font-size:1.5rem;font-weight:700;text-shadow:0 1px 2px rgba(0,0,0,0.2);">#${rank}</div>
                        <div style="font-size:0.85rem;text-shadow:0 1px 1px rgba(0,0,0,0.15);">Rank by EPDO</div>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div style="padding:1.25rem;">

                <!-- Comparison to Average -->
                <div style="background:${parseInt(vsAvg) > 0 ? '#fef2f2' : '#f0fdf4'};border-radius:8px;padding:1rem;margin-bottom:1.25rem;">
                    <div style="font-size:0.85rem;color:${parseInt(vsAvg) > 0 ? '#dc2626' : '#16a34a'};">
                        <strong>${parseInt(vsAvg) > 0 ? '↑' : '↓'} ${Math.abs(vsAvg)}%</strong> vs county average
                    </div>
                    <div style="font-size:0.75rem;color:var(--gray);margin-top:0.25rem;">
                        County avg: ${Math.round(countyAvg).toLocaleString()} crashes per district
                    </div>
                </div>

                <!-- Severity Breakdown -->
                <div style="margin-bottom:1.5rem;">
                    <div style="font-weight:600;margin-bottom:0.75rem;">📊 Severity Breakdown</div>
                    <div class="stat-row">
                        <span><span class="severity-badge severity-K">K</span> Fatal</span>
                        <span><strong>${stats.K}</strong> <span style="color:var(--gray);font-size:0.8rem;">(${((stats.K/stats.total)*100 || 0).toFixed(1)}%)</span></span>
                    </div>
                    <div class="stat-row">
                        <span><span class="severity-badge severity-A">A</span> Serious Injury</span>
                        <span><strong>${stats.A}</strong> <span style="color:var(--gray);font-size:0.8rem;">(${((stats.A/stats.total)*100 || 0).toFixed(1)}%)</span></span>
                    </div>
                    <div class="stat-row">
                        <span><span class="severity-badge severity-B">B</span> Minor Injury</span>
                        <span><strong>${stats.B}</strong></span>
                    </div>
                    <div class="stat-row">
                        <span><span class="severity-badge severity-C">C</span> Possible Injury</span>
                        <span><strong>${stats.C}</strong></span>
                    </div>
                    <div class="stat-row" style="border-bottom:none;">
                        <span><span class="severity-badge severity-O">O</span> Property Damage Only</span>
                        <span><strong>${stats.O}</strong></span>
                    </div>
                </div>

                <!-- Special Categories -->
                <div style="margin-bottom:1.5rem;">
                    <div style="font-weight:600;margin-bottom:0.75rem;">🎯 Special Categories</div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;">
                        <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;">🚶</div>
                            <div style="font-size:1.1rem;font-weight:600;">${stats.ped || 0}</div>
                            <div style="font-size:0.7rem;color:var(--gray);">Pedestrian</div>
                        </div>
                        <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;">🚴</div>
                            <div style="font-size:1.1rem;font-weight:600;">${stats.bike || 0}</div>
                            <div style="font-size:0.7rem;color:var(--gray);">Bicycle</div>
                        </div>
                        <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;">🌙</div>
                            <div style="font-size:1.1rem;font-weight:600;">${stats.nighttime || 0}</div>
                            <div style="font-size:0.7rem;color:var(--gray);">Nighttime</div>
                        </div>
                        <div style="background:var(--bg-secondary);padding:0.75rem;border-radius:8px;text-align:center;">
                            <div style="font-size:1.25rem;">⚡</div>
                            <div style="font-size:1.1rem;font-weight:600;">${stats.speedRelated || 0}</div>
                            <div style="font-size:0.7rem;color:var(--gray);">Speed-Related</div>
                        </div>
                    </div>
                </div>

                <!-- Yearly Trend -->
                ${yearTrend ? `
                <div style="margin-bottom:1.5rem;">
                    <div style="font-weight:600;margin-bottom:0.75rem;">📈 Yearly Trend</div>
                    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                        ${Object.entries(stats.byYear || {}).sort((a,b) => a[0] - b[0]).map(([year, count]) => `
                            <div style="background:var(--bg-secondary);padding:0.5rem 0.75rem;border-radius:6px;text-align:center;">
                                <div style="font-size:0.7rem;color:var(--gray);">${year}</div>
                                <div style="font-weight:600;">${count}</div>
                            </div>
                        `).join('')}
                    </div>
                    <div style="font-size:0.8rem;color:${yearTrend.direction === 'up' ? '#dc2626' : '#16a34a'};margin-top:0.5rem;">
                        ${yearTrend.direction === 'up' ? '↑' : '↓'} ${yearTrend.pct}% ${yearTrend.direction === 'up' ? 'increase' : 'decrease'} (latest vs prior year)
                    </div>
                </div>
                ` : ''}

                <!-- Top Hotspots -->
                ${hotspots.length > 0 ? `
                <div style="margin-bottom:1.5rem;">
                    <div style="font-weight:600;margin-bottom:0.75rem;">🔥 Top Crash Locations in District</div>
                    ${hotspots.map((hs, i) => `
                        <div class="hotspot-item" onclick="jumpToLocationFromDrillDown('${escJs(hs.route)}', '${escJs(hs.node || '')}')">
                            <div style="display:flex;justify-content:space-between;align-items:center;">
                                <div>
                                    <div style="font-weight:600;font-size:0.9rem;">#${i + 1} ${esc(hs.route)}</div>
                                    <div style="font-size:0.75rem;color:var(--gray);">${hs.crashes} crashes | EPDO: ${hs.epdo}</div>
                                </div>
                                <div style="color:var(--primary);">→</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ` : ''}

                <!-- Actions -->
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-top:1.5rem;">
                    <button onclick="filterByDistrictFromDrillDown('${escJs(districtName)}')" class="btn-soft btn-soft-primary" style="padding:0.75rem;">
                        🔍 Filter to District
                    </button>
                    <button onclick="generateDistrictReport('${escJs(districtName)}')" class="btn-soft btn-soft-secondary" style="padding:0.75rem;">
                        📄 Generate Report
                    </button>
                </div>

            </div>
        </div>
        <div id="districtDrillDownOverlay" onclick="closeDistrictDrillDown()" style="
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.3);
            z-index: 1999;
        "></div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', sidebarHtml);

    console.log('[Districts] Drill-down opened for', districtName);
}

/**
 * Close the district drill-down sidebar
 */
function closeDistrictDrillDown() {
    const sidebar = document.getElementById('districtDrillDownSidebar');
    const overlay = document.getElementById('districtDrillDownOverlay');
    if (sidebar) sidebar.remove();
    if (overlay) overlay.remove();
}

/**
 * Find top crash hotspots within a district
 */
function findDistrictHotspots(crashIds, limit = 5) {
    if (!crashIds || crashIds.size === 0) return [];

    // Group crashes by route
    const routeCounts = new Map();

    crashState.sampleRows.forEach(row => {
        const crashId = row[COL.ID];
        if (!crashIds.has(crashId)) return;

        const route = row[COL.ROUTE];
        const node = row[COL.NODE];
        const sev = row[COL.SEVERITY];

        if (!route) return;

        const key = route;
        if (!routeCounts.has(key)) {
            routeCounts.set(key, {
                route: route,
                node: node,
                crashes: 0,
                K: 0, A: 0, B: 0, C: 0, O: 0,
                epdo: 0
            });
        }

        const data = routeCounts.get(key);
        data.crashes++;
        if (data[sev] !== undefined) data[sev]++;
        data.epdo = calcEPDO(data);
    });

    // Sort by EPDO and return top N
    return Array.from(routeCounts.values())
        .sort((a, b) => b.epdo - a.epdo)
        .slice(0, limit);
}

/**
 * Calculate year-over-year trend for a district
 */
function calculateDistrictYearTrend(stats) {
    if (!stats.byYear || Object.keys(stats.byYear).length < 2) return null;

    const years = Object.keys(stats.byYear).sort();
    const lastYear = years[years.length - 1];
    const prevYear = years[years.length - 2];
    const lastCount = stats.byYear[lastYear] || 0;
    const prevCount = stats.byYear[prevYear] || 0;

    if (prevCount === 0) return null;

    const pctChange = ((lastCount - prevCount) / prevCount * 100).toFixed(0);
    return {
        lastYear,
        prevYear,
        lastCount,
        prevCount,
        pct: Math.abs(pctChange),
        direction: parseInt(pctChange) >= 0 ? 'up' : 'down'
    };
}

/**
 * Filter crashes by district from the drill-down sidebar
 */
function filterByDistrictFromDrillDown(districtName) {
    closeDistrictDrillDown();

    // Set the filter
    const filterSelect = document.getElementById('filterDistrict');
    if (filterSelect) {
        filterSelect.value = districtName;
    }
    currentFilters.district = districtName;

    // Navigate to dashboard and apply filters
    navigateTo('dashboard');
    applyFilters();

    showToast(`Filtered to ${districtName}`, 'success');
}

/**
 * Jump to a location from the drill-down hotspot list
 */
function jumpToLocationFromDrillDown(route, node) {
    closeDistrictDrillDown();

    // Find the location in crash data and navigate to map
    const crashes = crashState.sampleRows.filter(row => row[COL.ROUTE] === route);
    if (crashes.length > 0) {
        const lat = parseFloat(crashes[0][COL.Y]);
        const lng = parseFloat(crashes[0][COL.X]);

        if (!isNaN(lat) && !isNaN(lng)) {
            navigateTo('map');
            setTimeout(() => {
                if (crashMap) {
                    crashMap.setView([lat, lng], 16);
                }
            }, 100);
        }
    }

    showToast(`Showing ${route}`, 'info');
}

// ============================================================
// SECTION 9.5.7: DISTRICT SAFETY REPORT GENERATOR
// ============================================================

/**
 * Generate a comprehensive PDF safety report for a magisterial district
 * Suitable for Board of Supervisors presentations
 */
async function generateDistrictReport(districtName) {
    const stats = districtState.statistics.byDistrict[districtName];
    if (!stats) {
        showToast(`No data available for ${districtName}`, 'error');
        return;
    }

    showToast(`Generating report for ${districtName}...`, 'info');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');

        // Get jurisdiction info
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
        const jurisdictionName = jurisdiction?.name || 'Virginia';

        // Get all districts for comparison
        const allDistricts = Object.values(districtState.statistics.byDistrict).sort((a, b) => b.epdo - a.epdo);
        const rank = allDistricts.findIndex(d => d.name === districtName) + 1;
        const countyTotal = districtState.statistics.totalAssigned;
        const countyAvg = countyTotal / allDistricts.length;
        const vsAvgPct = ((stats.total / countyAvg - 1) * 100).toFixed(0);

        // Get hotspots
        const districtCrashIds = new Set(stats.crashes || []);
        const hotspots = findDistrictHotspots(districtCrashIds, 10);

        // Colors
        const primaryBlue = [30, 64, 175]; // #1e40af
        const darkGray = [51, 65, 85];
        const red = [220, 38, 38];
        const orange = [234, 88, 12];
        const green = [22, 163, 74];

        let y = 0;

        // ========== PAGE 1: Cover & Summary ==========

        // Header banner
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 0, 220, 45, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('District Safety Report', 15, 20);

        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal');
        doc.text(districtName, 15, 32);

        doc.setFontSize(10);
        doc.text(`${jurisdictionName} | Generated ${new Date().toLocaleDateString()}`, 15, 40);

        // Executive Summary box
        y = 55;
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(15, y, 180, 50, 3, 3, 'F');

        doc.setTextColor(...darkGray);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Executive Summary', 20, y + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const summaryText = `${districtName} recorded ${stats.total.toLocaleString()} crashes during the analysis period, ` +
            `ranking #${rank} of ${allDistricts.length} districts by severity (EPDO score: ${stats.epdo.toLocaleString()}). ` +
            `This is ${parseInt(vsAvgPct) > 0 ? vsAvgPct + '% above' : Math.abs(vsAvgPct) + '% below'} the county average of ` +
            `${Math.round(countyAvg).toLocaleString()} crashes per district.`;

        const summaryLines = doc.splitTextToSize(summaryText, 170);
        doc.text(summaryLines, 20, y + 20);

        // Key metrics boxes
        y = 115;
        const boxWidth = 42;
        const metrics = [
            { label: 'Total Crashes', value: stats.total.toLocaleString(), color: primaryBlue },
            { label: 'EPDO Score', value: stats.epdo.toLocaleString(), color: primaryBlue },
            { label: 'Fatal (K)', value: stats.K.toString(), color: red },
            { label: 'Serious (A)', value: stats.A.toString(), color: orange }
        ];

        metrics.forEach((m, i) => {
            const x = 15 + (i * (boxWidth + 5));
            doc.setFillColor(...m.color);
            doc.roundedRect(x, y, boxWidth, 30, 2, 2, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text(m.value, x + boxWidth/2, y + 15, { align: 'center' });

            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.text(m.label, x + boxWidth/2, y + 24, { align: 'center' });
        });

        // Severity breakdown table
        y = 155;
        doc.setTextColor(...darkGray);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Severity Distribution', 15, y);

        y += 8;
        const severityData = [
            ['Severity', 'Count', 'Percentage', 'EPDO Contribution'],
            ['K - Fatal', stats.K.toString(), ((stats.K/stats.total)*100).toFixed(1) + '%', (stats.K * EPDO_WEIGHTS.K).toLocaleString()],
            ['A - Serious Injury', stats.A.toString(), ((stats.A/stats.total)*100).toFixed(1) + '%', (stats.A * EPDO_WEIGHTS.A).toLocaleString()],
            ['B - Minor Injury', stats.B.toString(), ((stats.B/stats.total)*100).toFixed(1) + '%', (stats.B * EPDO_WEIGHTS.B).toLocaleString()],
            ['C - Possible Injury', stats.C.toString(), ((stats.C/stats.total)*100).toFixed(1) + '%', (stats.C * EPDO_WEIGHTS.C).toLocaleString()],
            ['O - Property Damage', stats.O.toString(), ((stats.O/stats.total)*100).toFixed(1) + '%', (stats.O * EPDO_WEIGHTS.O).toLocaleString()]
        ];

        doc.autoTable({
            startY: y,
            head: [severityData[0]],
            body: severityData.slice(1),
            margin: { left: 15, right: 15 },
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: primaryBlue, textColor: 255 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        // Special categories
        y = doc.lastAutoTable.finalY + 15;
        doc.setTextColor(...darkGray);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Special Categories', 15, y);

        y += 8;
        const specialData = [
            ['Category', 'Count', 'Percentage of Total'],
            ['Pedestrian Involved', (stats.ped || 0).toString(), ((stats.ped/stats.total)*100 || 0).toFixed(1) + '%'],
            ['Bicycle Involved', (stats.bike || 0).toString(), ((stats.bike/stats.total)*100 || 0).toFixed(1) + '%'],
            ['Nighttime Crashes', (stats.nighttime || 0).toString(), ((stats.nighttime/stats.total)*100 || 0).toFixed(1) + '%'],
            ['Speed-Related', (stats.speedRelated || 0).toString(), ((stats.speedRelated/stats.total)*100 || 0).toFixed(1) + '%'],
            ['Wet Road Conditions', (stats.wetRoad || 0).toString(), ((stats.wetRoad/stats.total)*100 || 0).toFixed(1) + '%']
        ];

        doc.autoTable({
            startY: y,
            head: [specialData[0]],
            body: specialData.slice(1),
            margin: { left: 15, right: 15 },
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: primaryBlue, textColor: 255 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        // ========== PAGE 2: Top Crash Locations ==========
        doc.addPage();

        // Header
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 0, 220, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`Top Crash Locations - ${districtName}`, 15, 16);

        y = 35;
        doc.setTextColor(...darkGray);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('The following locations have the highest crash severity within this district:', 15, y);

        y += 10;
        if (hotspots.length > 0) {
            const hotspotData = [
                ['Rank', 'Location', 'Total Crashes', 'Fatal (K)', 'Serious (A)', 'EPDO Score']
            ];

            hotspots.forEach((hs, i) => {
                hotspotData.push([
                    `#${i + 1}`,
                    hs.route,
                    hs.crashes.toString(),
                    hs.K.toString(),
                    hs.A.toString(),
                    hs.epdo.toLocaleString()
                ]);
            });

            doc.autoTable({
                startY: y,
                head: [hotspotData[0]],
                body: hotspotData.slice(1),
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9, cellPadding: 4 },
                headStyles: { fillColor: primaryBlue, textColor: 255 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                columnStyles: {
                    0: { cellWidth: 15 },
                    1: { cellWidth: 70 },
                    2: { cellWidth: 25, halign: 'center' },
                    3: { cellWidth: 20, halign: 'center' },
                    4: { cellWidth: 25, halign: 'center' },
                    5: { cellWidth: 25, halign: 'center' }
                }
            });
        } else {
            doc.text('No specific hotspot locations identified.', 15, y);
        }

        // Yearly trend if available
        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 20;

        if (stats.byYear && Object.keys(stats.byYear).length > 0) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('Yearly Crash Trend', 15, y);

            y += 8;
            const years = Object.keys(stats.byYear).sort();
            const yearData = [['Year', 'Crashes', 'Change']];

            let prevCount = null;
            years.forEach(year => {
                const count = stats.byYear[year];
                let change = '-';
                if (prevCount !== null) {
                    const pctChange = ((count - prevCount) / prevCount * 100).toFixed(0);
                    change = `${pctChange > 0 ? '+' : ''}${pctChange}%`;
                }
                yearData.push([year, count.toString(), change]);
                prevCount = count;
            });

            doc.autoTable({
                startY: y,
                head: [yearData[0]],
                body: yearData.slice(1),
                margin: { left: 15, right: 15 },
                styles: { fontSize: 9, cellPadding: 3 },
                headStyles: { fillColor: primaryBlue, textColor: 255 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                tableWidth: 80
            });
        }

        // Recommendations section
        y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : y + 20;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Recommended Focus Areas', 15, y);

        y += 8;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        const recommendations = generateDistrictRecommendations(stats, hotspots);
        recommendations.forEach((rec, i) => {
            const lines = doc.splitTextToSize(`${i + 1}. ${rec}`, 175);
            doc.text(lines, 20, y);
            y += lines.length * 5 + 3;
        });

        // Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(`Page ${i} of ${pageCount}`, 105, 275, { align: 'center' });
            doc.text('Crash Analysis Tool - District Safety Report', 105, 280, { align: 'center' });
        }

        // Save
        const filename = `District_Safety_Report_${districtName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showToast(`Report saved: ${filename}`, 'success');
        console.log('[Report] Generated district safety report for', districtName);

    } catch (error) {
        console.error('[Report] Failed to generate district report:', error);
        showToast('Failed to generate report: ' + error.message, 'error');
    }
}

/**
 * Generate recommendations based on district crash patterns
 */
function generateDistrictRecommendations(stats, hotspots) {
    const recommendations = [];

    // High K+A rate
    const kaRate = ((stats.K + stats.A) / stats.total * 100);
    if (kaRate > 5) {
        recommendations.push(`High severity rate (${kaRate.toFixed(1)}% K+A): Consider systemic safety improvements at top crash locations and enhanced enforcement strategies.`);
    }

    // Pedestrian issues
    if (stats.ped > 0 && (stats.ped / stats.total) > 0.02) {
        recommendations.push(`Pedestrian safety concern (${stats.ped} crashes): Evaluate pedestrian infrastructure at high-crash corridors, consider crosswalk improvements, and review sight distance.`);
    }

    // Bicycle issues
    if (stats.bike > 0 && (stats.bike / stats.total) > 0.01) {
        recommendations.push(`Bicycle safety concern (${stats.bike} crashes): Review bicycle facilities, consider protected bike lanes, and evaluate intersection treatments.`);
    }

    // Nighttime crashes
    if (stats.nighttime > 0 && (stats.nighttime / stats.total) > 0.25) {
        recommendations.push(`High nighttime crash proportion (${((stats.nighttime/stats.total)*100).toFixed(0)}%): Evaluate street lighting adequacy, consider reflective sign upgrades, and review horizontal curve delineation.`);
    }

    // Speed-related
    if (stats.speedRelated > 0 && (stats.speedRelated / stats.total) > 0.1) {
        recommendations.push(`Speed-related concerns (${stats.speedRelated} crashes): Consider traffic calming measures, speed limit review, and automated speed enforcement at high-crash locations.`);
    }

    // Hotspot concentration
    if (hotspots.length > 0) {
        const topHotspot = hotspots[0];
        recommendations.push(`Priority location: ${topHotspot.route} with ${topHotspot.crashes} crashes (EPDO: ${topHotspot.epdo}). Conduct detailed safety study and identify applicable countermeasures.`);
    }

    // Default if no specific issues
    if (recommendations.length === 0) {
        recommendations.push('Continue monitoring crash trends and maintain current safety programs.');
        recommendations.push('Consider proactive safety reviews at aging infrastructure locations.');
    }

    return recommendations;
}

// ============================================================
// SECTION 9.5.8: BOARD PRESENTATION MODE
// ============================================================

/**
 * Presentation mode state
 */
let presentationState = {
    active: false,
    currentIndex: 0,
    districts: [],
    autoPlay: false,
    autoPlayInterval: null,
    autoPlayDelay: 10000 // 10 seconds per slide
};

/**
 * Open the Board Presentation Mode
 * Shows district data in a fullscreen, projection-friendly format
 */
function openDistrictPresentationMode() {
    if (!districtState.loaded || Object.keys(districtState.statistics.byDistrict).length === 0) {
        showToast('District data not available. Please wait for data to load.', 'warning');
        return;
    }

    // Get districts sorted by EPDO
    presentationState.districts = Object.values(districtState.statistics.byDistrict)
        .sort((a, b) => b.epdo - a.epdo);
    presentationState.currentIndex = 0;
    presentationState.active = true;

    // Get jurisdiction info
    const jurisdictionId = localStorage.getItem('selectedJurisdiction');
    const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
    const jurisdictionName = jurisdiction?.name || 'Virginia';

    // Create presentation container
    const presentationHtml = `
        <div id="districtPresentationMode" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(135deg, #1e3a8a 0%, #312e81 100%);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
        ">
            <style>
                #districtPresentationMode * {
                    box-sizing: border-box;
                }
                .pres-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 2rem;
                    background: rgba(0,0,0,0.2);
                }
                .pres-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 2rem 4rem;
                    overflow: hidden;
                }
                .pres-footer {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1rem;
                    padding: 1.5rem;
                    background: rgba(0,0,0,0.2);
                }
                .pres-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background 0.2s;
                }
                .pres-btn:hover {
                    background: rgba(255,255,255,0.3);
                }
                .pres-btn.active {
                    background: rgba(255,255,255,0.4);
                }
                .pres-nav-btn {
                    background: rgba(255,255,255,0.15);
                    border: none;
                    color: white;
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.5rem;
                    transition: background 0.2s, transform 0.2s;
                }
                .pres-nav-btn:hover {
                    background: rgba(255,255,255,0.25);
                    transform: scale(1.1);
                }
                .pres-stat-box {
                    background: rgba(255,255,255,0.1);
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    backdrop-filter: blur(10px);
                }
                .pres-stat-value {
                    font-size: 4rem;
                    font-weight: 700;
                    line-height: 1;
                }
                .pres-stat-label {
                    font-size: 1.1rem;
                    opacity: 0.9;
                    margin-top: 0.5rem;
                }
                .pres-sev-badge {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 1.5rem;
                    margin: 0 0.25rem;
                }
                .pres-progress-bar {
                    height: 4px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 2px;
                    overflow: hidden;
                    margin-top: 1rem;
                }
                .pres-progress-fill {
                    height: 100%;
                    background: white;
                    transition: width 0.5s ease;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .pres-animate {
                    animation: slideIn 0.5s ease forwards;
                }
            </style>

            <!-- Header -->
            <div class="pres-header">
                <div>
                    <div style="font-size: 1.25rem; font-weight: 600;">${jurisdictionName}</div>
                    <div style="opacity: 0.8; font-size: 0.9rem;">District Safety Overview</div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span id="presSlideCounter" style="font-size: 0.9rem; opacity: 0.8;">1 / ${presentationState.districts.length}</span>
                    <button class="pres-btn" onclick="closeDistrictPresentationMode()" title="Exit presentation (Esc)">
                        ✕ Exit
                    </button>
                </div>
            </div>

            <!-- Content Area -->
            <div class="pres-content">
                <div id="presSlideContent">
                    <!-- Slide content will be rendered here -->
                </div>
            </div>

            <!-- Footer Controls -->
            <div class="pres-footer">
                <button class="pres-nav-btn" onclick="presPrevSlide()" title="Previous (←)">←</button>

                <button class="pres-btn" id="presOverviewBtn" onclick="presShowOverview()">
                    📊 Overview
                </button>

                <button class="pres-btn" id="presAutoPlayBtn" onclick="presToggleAutoPlay()">
                    ▶ Auto-Play
                </button>

                <button class="pres-btn" onclick="generateAllDistrictsReport()">
                    📄 Export All
                </button>

                <button class="pres-nav-btn" onclick="presNextSlide()" title="Next (→)">→</button>
            </div>

            <!-- Progress bar -->
            <div class="pres-progress-bar">
                <div class="pres-progress-fill" id="presProgressFill" style="width: ${100 / presentationState.districts.length}%"></div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', presentationHtml);

    // Render first slide
    presRenderSlide(0);

    // Add keyboard navigation
    document.addEventListener('keydown', presHandleKeydown);

    console.log('[Presentation] Mode opened with', presentationState.districts.length, 'districts');
}

/**
 * Close presentation mode
 */
function closeDistrictPresentationMode() {
    const container = document.getElementById('districtPresentationMode');
    if (container) container.remove();

    // Stop auto-play
    if (presentationState.autoPlayInterval) {
        clearInterval(presentationState.autoPlayInterval);
        presentationState.autoPlayInterval = null;
    }

    presentationState.active = false;
    document.removeEventListener('keydown', presHandleKeydown);

    console.log('[Presentation] Mode closed');
}

/**
 * Handle keyboard navigation in presentation mode
 */
function presHandleKeydown(e) {
    if (!presentationState.active) return;

    switch (e.key) {
        case 'ArrowRight':
        case ' ':
            presNextSlide();
            break;
        case 'ArrowLeft':
            presPrevSlide();
            break;
        case 'Escape':
            closeDistrictPresentationMode();
            break;
        case 'Home':
            presRenderSlide(0);
            break;
        case 'End':
            presRenderSlide(presentationState.districts.length - 1);
            break;
    }
}

/**
 * Render a slide for a specific district
 */
function presRenderSlide(index) {
    if (index < 0) index = presentationState.districts.length - 1;
    if (index >= presentationState.districts.length) index = 0;

    presentationState.currentIndex = index;
    const stats = presentationState.districts[index];

    // Update counter
    const counter = document.getElementById('presSlideCounter');
    if (counter) counter.textContent = `${index + 1} / ${presentationState.districts.length}`;

    // Update progress bar
    const progress = document.getElementById('presProgressFill');
    if (progress) progress.style.width = `${((index + 1) / presentationState.districts.length) * 100}%`;

    // Get comparison data
    const countyTotal = districtState.statistics.totalAssigned;
    const countyAvg = countyTotal / presentationState.districts.length;
    const vsAvgPct = ((stats.total / countyAvg - 1) * 100).toFixed(0);
    const rank = index + 1;

    // Get district color
    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];
    const color = districtColors[index % districtColors.length];

    const content = document.getElementById('presSlideContent');
    if (!content) return;

    content.innerHTML = `
        <div class="pres-animate" style="text-align: center;">
            <!-- District Name & Rank -->
            <div style="margin-bottom: 2rem;">
                <div style="font-size: 3rem; font-weight: 700; margin-bottom: 0.5rem; color: ${color};">
                    ${esc(stats.name)}
                </div>
                <div style="font-size: 1.25rem; opacity: 0.8;">
                    Ranked #${rank} of ${presentationState.districts.length} by Severity (EPDO)
                </div>
            </div>

            <!-- Main Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; max-width: 1200px; margin: 0 auto 2rem;">
                <div class="pres-stat-box">
                    <div class="pres-stat-value">${stats.total.toLocaleString()}</div>
                    <div class="pres-stat-label">Total Crashes</div>
                </div>
                <div class="pres-stat-box">
                    <div class="pres-stat-value">${stats.epdo.toLocaleString()}</div>
                    <div class="pres-stat-label">EPDO Score</div>
                </div>
                <div class="pres-stat-box">
                    <div class="pres-stat-value" style="color: ${parseInt(vsAvgPct) > 0 ? '#fca5a5' : '#86efac'};">
                        ${parseInt(vsAvgPct) > 0 ? '+' : ''}${vsAvgPct}%
                    </div>
                    <div class="pres-stat-label">vs County Avg</div>
                </div>
                <div class="pres-stat-box">
                    <div class="pres-stat-value">${stats.K + stats.A}</div>
                    <div class="pres-stat-label">K+A (Severe)</div>
                </div>
            </div>

            <!-- Severity Breakdown -->
            <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
                <span class="pres-sev-badge" style="background: #dc2626;">K: ${stats.K}</span>
                <span class="pres-sev-badge" style="background: #ea580c;">A: ${stats.A}</span>
                <span class="pres-sev-badge" style="background: #ca8a04;">B: ${stats.B}</span>
                <span class="pres-sev-badge" style="background: #16a34a;">C: ${stats.C}</span>
                <span class="pres-sev-badge" style="background: #64748b;">O: ${stats.O}</span>
            </div>

            <!-- Special Categories -->
            <div style="display: flex; justify-content: center; gap: 2rem; opacity: 0.9;">
                ${stats.ped > 0 ? `<div>🚶 ${stats.ped} Pedestrian</div>` : ''}
                ${stats.bike > 0 ? `<div>🚴 ${stats.bike} Bicycle</div>` : ''}
                ${stats.nighttime > 0 ? `<div>🌙 ${stats.nighttime} Nighttime</div>` : ''}
                ${stats.speedRelated > 0 ? `<div>⚡ ${stats.speedRelated} Speed</div>` : ''}
            </div>
        </div>
    `;
}

/**
 * Show overview slide with all districts
 */
function presShowOverview() {
    const content = document.getElementById('presSlideContent');
    if (!content) return;

    // Update counter to show overview
    const counter = document.getElementById('presSlideCounter');
    if (counter) counter.textContent = 'Overview';

    const districts = presentationState.districts;
    const totalCrashes = districtState.statistics.totalAssigned;

    // Get district colors
    const tigerwebConfig = appConfig?.apis?.tigerweb;
    const districtColors = tigerwebConfig?.districtColors || [
        '#ef4444', '#f97316', '#eab308', '#22c55e',
        '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ];

    content.innerHTML = `
        <div class="pres-animate">
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="font-size: 2.5rem; font-weight: 700;">District Comparison</div>
                <div style="opacity: 0.8;">${districts.length} Districts | ${totalCrashes.toLocaleString()} Total Crashes</div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; max-width: 1400px; margin: 0 auto;">
                ${districts.map((d, i) => {
                    const color = districtColors[i % districtColors.length];
                    const pct = ((d.total / totalCrashes) * 100).toFixed(1);
                    return `
                        <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 1rem; border-left: 4px solid ${color}; cursor: pointer;"
                             onclick="presRenderSlide(${i})">
                            <div style="font-weight: 600; color: ${color}; margin-bottom: 0.5rem;">#${i+1} ${esc(d.name)}</div>
                            <div style="font-size: 1.5rem; font-weight: 700;">${d.total.toLocaleString()}</div>
                            <div style="font-size: 0.8rem; opacity: 0.7;">EPDO: ${d.epdo.toLocaleString()} | ${pct}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

/**
 * Navigate to next slide
 */
function presNextSlide() {
    presRenderSlide(presentationState.currentIndex + 1);
}

/**
 * Navigate to previous slide
 */
function presPrevSlide() {
    presRenderSlide(presentationState.currentIndex - 1);
}

/**
 * Toggle auto-play mode
 */
function presToggleAutoPlay() {
    const btn = document.getElementById('presAutoPlayBtn');

    if (presentationState.autoPlayInterval) {
        // Stop auto-play
        clearInterval(presentationState.autoPlayInterval);
        presentationState.autoPlayInterval = null;
        if (btn) {
            btn.textContent = '▶ Auto-Play';
            btn.classList.remove('active');
        }
    } else {
        // Start auto-play
        presentationState.autoPlayInterval = setInterval(() => {
            presNextSlide();
        }, presentationState.autoPlayDelay);
        if (btn) {
            btn.textContent = '⏸ Pause';
            btn.classList.add('active');
        }
    }
}

/**
 * Generate a combined report for all districts
 */
async function generateAllDistrictsReport() {
    showToast('Generating comprehensive district report...', 'info');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'letter'); // Landscape for comparison table

        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
        const jurisdictionName = jurisdiction?.name || 'Virginia';

        const districts = presentationState.districts;
        const totalCrashes = districtState.statistics.totalAssigned;

        // Colors
        const primaryBlue = [30, 64, 175];

        // Header
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 0, 280, 30, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`${jurisdictionName} - District Safety Comparison`, 15, 18);
        doc.setFontSize(10);
        doc.text(`Generated ${new Date().toLocaleDateString()} | ${totalCrashes.toLocaleString()} Total Crashes`, 15, 26);

        // Summary table
        let y = 40;
        doc.setTextColor(51, 65, 85);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('District Crash Summary (Ranked by EPDO)', 15, y);

        y += 8;
        const tableData = [
            ['Rank', 'District', 'Total', 'K', 'A', 'B', 'C', 'O', 'EPDO', 'Ped', 'Bike', 'Night', '% of Total']
        ];

        districts.forEach((d, i) => {
            tableData.push([
                `#${i + 1}`,
                d.name,
                d.total.toLocaleString(),
                d.K.toString(),
                d.A.toString(),
                d.B.toString(),
                d.C.toString(),
                d.O.toString(),
                d.epdo.toLocaleString(),
                (d.ped || 0).toString(),
                (d.bike || 0).toString(),
                (d.nighttime || 0).toString(),
                ((d.total / totalCrashes) * 100).toFixed(1) + '%'
            ]);
        });

        doc.autoTable({
            startY: y,
            head: [tableData[0]],
            body: tableData.slice(1),
            margin: { left: 15, right: 15 },
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: primaryBlue, textColor: 255 },
            alternateRowStyles: { fillColor: [248, 250, 252] }
        });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Crash Analysis Tool - All Districts Report', 140, 200, { align: 'center' });

        const filename = `All_Districts_Report_${jurisdictionName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        showToast(`Report saved: ${filename}`, 'success');

    } catch (error) {
        console.error('[Report] Failed to generate all districts report:', error);
        showToast('Failed to generate report: ' + error.message, 'error');
    }
}

/**
 * Clear district statistics cache
 */
function clearDistrictStatisticsCache() {
    builtInLayersState.magisterialDistricts.geojsonCache = {};
    districtState.loaded = false;
    districtState.lastJurisdictionId = null;
    districtState.districts = [];
    districtState.crashAssignments.clear();
    districtState.statistics = {
        byDistrict: {},
        totalAssigned: 0,
        totalUnassigned: 0
    };
    console.log('[Districts] Statistics cache cleared');
}

/**
 * Toggle district statistics panel expanded/collapsed state
 */
function toggleDistrictStatsExpanded() {
    const container = document.getElementById('districtStatisticsContainer');
    const toggleIcon = document.getElementById('districtStatsToggleIcon');
    const toggleText = document.getElementById('districtStatsToggleText');
    const note = document.getElementById('districtStatsNote');

    if (!container) return;

    const isExpanded = container.style.maxHeight !== '150px';

    if (isExpanded) {
        // Collapse
        container.style.maxHeight = '150px';
        container.style.overflow = 'hidden';
        if (toggleIcon) toggleIcon.textContent = '▼';
        if (toggleText) toggleText.textContent = 'Expand';
    } else {
        // Expand
        container.style.maxHeight = 'none';
        container.style.overflow = 'visible';
        if (toggleIcon) toggleIcon.textContent = '▲';
        if (toggleText) toggleText.textContent = 'Collapse';
    }

    // Show/hide note
    if (note) {
        note.style.display = isExpanded ? 'none' : 'block';
    }
}

/**
 * Initialize district statistics when grants tab is shown
 */
function initDistrictStatisticsOnGrantsTab() {
    const container = document.getElementById('districtStatisticsContainer');
    if (!container) return;

    // Round 15 §12.7 — in Supabase-only mode (no sampleRows) the legacy
    // districtState path never runs, so renderDistrictStatistics was never
    // called and the container kept showing the 7 hardcoded zero-cards.
    // Try the Supabase-backed renderer first; it owns the container when it
    // succeeds, returns false (and we fall through to the legacy paths) if
    // Supabase isn't available or the active tier isn't county.
    if (typeof renderMagisterialDistricts === 'function'
        && window.crashLensClient
        && window.CL && CL.data && CL.data.supabaseBridge) {
        Promise.resolve(renderMagisterialDistricts())
            .then(ok => { /* ok=true means container is owned; otherwise legacy below ran */ })
            .catch(e => console.warn('[Grants] renderMagisterialDistricts failed (non-fatal):', e && e.message));
        // Don't return early — let the legacy districtState branch also run as a
        // backup if it has data; renderMagisterialDistricts replaces the
        // container's innerHTML when it succeeds, so the visible state is the
        // Supabase render.
    }

    // Check if districts are loaded
    if (districtState.loaded && Object.keys(districtState.statistics.byDistrict).length > 0) {
        renderDistrictStatistics(container);
        return;
    }

    // Check if crash data is loaded but districts aren't
    if (crashState.loaded && crashState.sampleRows.length > 0) {
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        const jurisdiction = appConfig?.jurisdictions[jurisdictionId];

        if (jurisdictionId && jurisdiction) {
            if (jurisdiction.type !== 'county') {
                // Independent city - no magisterial districts
                container.innerHTML = `
                    <div style="text-align:center;padding:1.5rem;color:var(--gray);">
                        <div style="font-size:1.5rem;margin-bottom:.5rem;">🏙️</div>
                        <div style="font-size:.9rem;font-weight:500;">${jurisdiction.name}</div>
                        <div style="font-size:.8rem;margin-top:.25rem;">
                            Independent cities do not have magisterial districts.
                        </div>
                        <div style="font-size:.75rem;color:var(--gray);margin-top:.5rem;">
                            Magisterial districts are administrative subdivisions unique to Virginia counties.
                        </div>
                    </div>
                `;
                return;
            }

            // Check if districts are in cache
            if (builtInLayersState?.magisterialDistricts?.geojsonCache[jurisdictionId]) {
                const geojson = builtInLayersState.magisterialDistricts.geojsonCache[jurisdictionId];
                computeDistrictCrashStatistics(geojson, jurisdictionId);
            } else {
                // Show loading state and fetch districts
                container.innerHTML = `
                    <div style="text-align:center;padding:1.5rem;">
                        <div class="spinner" style="width:24px;height:24px;border:3px solid #e2e8f0;border-top-color:#7c3aed;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto .75rem"></div>
                        <div style="font-size:.9rem;color:var(--gray);">Loading district boundaries...</div>
                    </div>
                `;
                preloadDistrictsForStatistics(jurisdictionId);
            }
        } else {
            // No jurisdiction selected
            container.innerHTML = `
                <div style="text-align:center;padding:1.5rem;color:var(--gray);">
                    <div style="font-size:1.5rem;margin-bottom:.5rem;">🗺️</div>
                    <div style="font-size:.9rem;">No jurisdiction selected</div>
                    <div style="font-size:.75rem;margin-top:.25rem;">
                        Select a county from Settings to view district statistics
                    </div>
                </div>
            `;
        }
    } else {
        // No crash data loaded
        container.innerHTML = `
            <div style="text-align:center;padding:1.5rem;color:var(--gray);">
                <div style="font-size:1.5rem;margin-bottom:.5rem;">📊</div>
                <div style="font-size:.9rem;">No crash data loaded</div>
                <div style="font-size:.75rem;margin-top:.25rem;">
                    Upload or auto-load crash data to view district statistics
                </div>
            </div>
        `;
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.dashboard = CL.dashboard || {};
  CL.dashboard.district = CL.dashboard.district || {};
  window.toggleMagisterialDistrictsLayer = toggleMagisterialDistrictsLayer; CL.dashboard.district.toggleMagisterialDistrictsLayer = toggleMagisterialDistrictsLayer;
  window.loadMagisterialDistricts = loadMagisterialDistricts; CL.dashboard.district.loadMagisterialDistricts = loadMagisterialDistricts;
  window.displayMagisterialDistricts = displayMagisterialDistricts; CL.dashboard.district.displayMagisterialDistricts = displayMagisterialDistricts;
  window.removeMagisterialDistrictsLayer = removeMagisterialDistrictsLayer; CL.dashboard.district.removeMagisterialDistrictsLayer = removeMagisterialDistrictsLayer;
  window.saveMagisterialDistrictsVisibility = saveMagisterialDistrictsVisibility; CL.dashboard.district.saveMagisterialDistrictsVisibility = saveMagisterialDistrictsVisibility;
  window.loadMagisterialDistrictsVisibility = loadMagisterialDistrictsVisibility; CL.dashboard.district.loadMagisterialDistrictsVisibility = loadMagisterialDistrictsVisibility;
  window.loadPendingDistrictsOnMapReady = loadPendingDistrictsOnMapReady; CL.dashboard.district.loadPendingDistrictsOnMapReady = loadPendingDistrictsOnMapReady;
  window.updateMagisterialDistricts = updateMagisterialDistricts; CL.dashboard.district.updateMagisterialDistricts = updateMagisterialDistricts;
  window.clearDistrictFilter = clearDistrictFilter; CL.dashboard.district.clearDistrictFilter = clearDistrictFilter;
  window.refreshDistrictStatisticsOnDataLoad = refreshDistrictStatisticsOnDataLoad; CL.dashboard.district.refreshDistrictStatisticsOnDataLoad = refreshDistrictStatisticsOnDataLoad;
  window.preloadDistrictsForStatistics = preloadDistrictsForStatistics; CL.dashboard.district.preloadDistrictsForStatistics = preloadDistrictsForStatistics;
  window.pointInPolygon = pointInPolygon; CL.dashboard.district.pointInPolygon = pointInPolygon;
  window.computeFeatureBoundingBox = computeFeatureBoundingBox; CL.dashboard.district.computeFeatureBoundingBox = computeFeatureBoundingBox;
  window.pointInBoundingBox = pointInBoundingBox; CL.dashboard.district.pointInBoundingBox = pointInBoundingBox;
  window.pointInFeature = pointInFeature; CL.dashboard.district.pointInFeature = pointInFeature;
  window.computeDistrictCrashStatistics = computeDistrictCrashStatistics; CL.dashboard.district.computeDistrictCrashStatistics = computeDistrictCrashStatistics;
  window.refreshDistrictPopups = refreshDistrictPopups; CL.dashboard.district.refreshDistrictPopups = refreshDistrictPopups;
  window.filterCrashesByDistrict = filterCrashesByDistrict; CL.dashboard.district.filterCrashesByDistrict = filterCrashesByDistrict;
  window.highlightDistrictCrashes = highlightDistrictCrashes; CL.dashboard.district.highlightDistrictCrashes = highlightDistrictCrashes;
  window.clearDistrictFilter = clearDistrictFilter; CL.dashboard.district.clearDistrictFilter = clearDistrictFilter;
  window.updateDistrictStatisticsUI = updateDistrictStatisticsUI; CL.dashboard.district.updateDistrictStatisticsUI = updateDistrictStatisticsUI;
  window.renderMagisterialDistricts = renderMagisterialDistricts; CL.dashboard.district.renderMagisterialDistricts = renderMagisterialDistricts;
  window.attachJurisdictionCardClicks = attachJurisdictionCardClicks; CL.dashboard.district.attachJurisdictionCardClicks = attachJurisdictionCardClicks;
  window.renderDistrictStatistics = renderDistrictStatistics; CL.dashboard.district.renderDistrictStatistics = renderDistrictStatistics;
  window._renderDistrictStatisticsLegacy = _renderDistrictStatisticsLegacy; CL.dashboard.district._renderDistrictStatisticsLegacy = _renderDistrictStatisticsLegacy;
  window.exportDistrictStatistics = exportDistrictStatistics; CL.dashboard.district.exportDistrictStatistics = exportDistrictStatistics;
  window.showDistrictMatrixLoading = showDistrictMatrixLoading; CL.dashboard.district.showDistrictMatrixLoading = showDistrictMatrixLoading;
  window.showDistrictMatrixError = showDistrictMatrixError; CL.dashboard.district.showDistrictMatrixError = showDistrictMatrixError;
  window.retryLoadDistrictMatrix = retryLoadDistrictMatrix; CL.dashboard.district.retryLoadDistrictMatrix = retryLoadDistrictMatrix;
  window.refreshMagisterialDistrictCache = refreshMagisterialDistrictCache; CL.dashboard.district.refreshMagisterialDistrictCache = refreshMagisterialDistrictCache;
  window.renderDistrictMatrixWidget = renderDistrictMatrixWidget; CL.dashboard.district.renderDistrictMatrixWidget = renderDistrictMatrixWidget;
  window.toggleDistrictMatrixExpand = toggleDistrictMatrixExpand; CL.dashboard.district.toggleDistrictMatrixExpand = toggleDistrictMatrixExpand;
  window.updateDistrictMatrixExpandButton = updateDistrictMatrixExpandButton; CL.dashboard.district.updateDistrictMatrixExpandButton = updateDistrictMatrixExpandButton;
  window.renderDistrictMatrixCharts = renderDistrictMatrixCharts; CL.dashboard.district.renderDistrictMatrixCharts = renderDistrictMatrixCharts;
  window.exportDistrictMatrixCSV = exportDistrictMatrixCSV; CL.dashboard.district.exportDistrictMatrixCSV = exportDistrictMatrixCSV;
  window.populateDistrictFilter = populateDistrictFilter; CL.dashboard.district.populateDistrictFilter = populateDistrictFilter;
  window.getDistrictStatistics = getDistrictStatistics; CL.dashboard.district.getDistrictStatistics = getDistrictStatistics;
  window.getAllDistrictStatistics = getAllDistrictStatistics; CL.dashboard.district.getAllDistrictStatistics = getAllDistrictStatistics;
  window.showDistrictDrillDown = showDistrictDrillDown; CL.dashboard.district.showDistrictDrillDown = showDistrictDrillDown;
  window.closeDistrictDrillDown = closeDistrictDrillDown; CL.dashboard.district.closeDistrictDrillDown = closeDistrictDrillDown;
  window.findDistrictHotspots = findDistrictHotspots; CL.dashboard.district.findDistrictHotspots = findDistrictHotspots;
  window.calculateDistrictYearTrend = calculateDistrictYearTrend; CL.dashboard.district.calculateDistrictYearTrend = calculateDistrictYearTrend;
  window.filterByDistrictFromDrillDown = filterByDistrictFromDrillDown; CL.dashboard.district.filterByDistrictFromDrillDown = filterByDistrictFromDrillDown;
  window.jumpToLocationFromDrillDown = jumpToLocationFromDrillDown; CL.dashboard.district.jumpToLocationFromDrillDown = jumpToLocationFromDrillDown;
  window.generateDistrictReport = generateDistrictReport; CL.dashboard.district.generateDistrictReport = generateDistrictReport;
  window.generateDistrictRecommendations = generateDistrictRecommendations; CL.dashboard.district.generateDistrictRecommendations = generateDistrictRecommendations;
  window.openDistrictPresentationMode = openDistrictPresentationMode; CL.dashboard.district.openDistrictPresentationMode = openDistrictPresentationMode;
  window.closeDistrictPresentationMode = closeDistrictPresentationMode; CL.dashboard.district.closeDistrictPresentationMode = closeDistrictPresentationMode;
  window.presHandleKeydown = presHandleKeydown; CL.dashboard.district.presHandleKeydown = presHandleKeydown;
  window.presRenderSlide = presRenderSlide; CL.dashboard.district.presRenderSlide = presRenderSlide;
  window.presShowOverview = presShowOverview; CL.dashboard.district.presShowOverview = presShowOverview;
  window.presNextSlide = presNextSlide; CL.dashboard.district.presNextSlide = presNextSlide;
  window.presPrevSlide = presPrevSlide; CL.dashboard.district.presPrevSlide = presPrevSlide;
  window.presToggleAutoPlay = presToggleAutoPlay; CL.dashboard.district.presToggleAutoPlay = presToggleAutoPlay;
  window.generateAllDistrictsReport = generateAllDistrictsReport; CL.dashboard.district.generateAllDistrictsReport = generateAllDistrictsReport;
  window.clearDistrictStatisticsCache = clearDistrictStatisticsCache; CL.dashboard.district.clearDistrictStatisticsCache = clearDistrictStatisticsCache;
  window.toggleDistrictStatsExpanded = toggleDistrictStatsExpanded; CL.dashboard.district.toggleDistrictStatsExpanded = toggleDistrictStatsExpanded;
  window.initDistrictStatisticsOnGrantsTab = initDistrictStatisticsOnGrantsTab; CL.dashboard.district.initDistrictStatisticsOnGrantsTab = initDistrictStatisticsOnGrantsTab;
  CL._registerModule('dashboard/district-matrix');
})();
