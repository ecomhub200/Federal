/**
 * CL assets.transitTab module
 *
 * Extracted from app/index.html (snapshot L154516-L155490) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/10-assets-transit-tab.md.
 * Responsibility: Transit-stop safety tab (transitTab* / transitLoad* fns).
 *
 * Public API (back-compat dual exposure):
 *   - window.initTransitSafetyTab → CL.assets.initTransitSafetyTab
 *   - window.transitTabLoadStopsFromBTS → CL.assets.transitTabLoadStopsFromBTS
 *   - window.transitLoadStopsForTier → CL.assets.transitLoadStopsForTier
 *   - window.updateTransitTabTable → CL.assets.updateTransitTabTable
 *   - window.transitTabExportKML → CL.assets.transitTabExportKML
 *   - (all 21 moved transit fns are dual-exposed below — many are HTML
 *      onclick=/generated-row bound; exposing only the prompt's 5 would
 *      regress those handlers. transitTabState const + the FINAL-AUTOLOAD
 *      IIFE intentionally remain inline. No behavior change.)
 *
 * Depends on (must load before this file): `assets/school-tab`
 */
'use strict';
// ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Initialize the Transit Safety tab.
 * Auto-loads transit stops from BTS when jurisdiction is available.
 */
function initTransitSafetyTab() {
    if (transitTabState.initialized) {
        transitTabSyncFromContext();
        updateTransitTabUI();

        // Auto-load if no transit stops loaded yet and jurisdiction is available
        const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
        if (!transitAsset && jurisdictionContext.jurisdictionKey) {
            transitTabLoadStopsFromBTS();
        }
        return;
    }

    console.log('[TransitTab] Initializing Transit Safety tab');

    // Sync from jurisdictionContext
    transitTabSyncFromContext();

    transitTabState.initialized = true;
    updateTransitTabUI();

    // Auto-load transit stops from BTS on first init
    if (jurisdictionContext.jurisdictionKey) {
        const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
        if (!transitAsset) {
            transitTabLoadStopsFromBTS();
        }
    }
}

/**
 * Sync Transit Safety sub-tab from jurisdictionContext.
 */
function transitTabSyncFromContext() {
    const ctx = jurisdictionContext;
    const select = document.getElementById('transitTabCounty');

    if (ctx.jurisdictionKey) {
        transitTabState.county = ctx.jurisdictionKey;

        // Sync hidden select if it exists
        if (select) {
            let opt = select.querySelector(`option[value="${ctx.jurisdictionKey}"]`);
            if (!opt) {
                opt = document.createElement('option');
                opt.value = ctx.jurisdictionKey;
                opt.textContent = ctx.jurisdictionName;
                select.appendChild(opt);
            }
            select.value = ctx.jurisdictionKey;
        }
    }

    // Update any jurisdiction display in the transit sub-tab
    const transitTabJurisDisplay = document.getElementById('transitTabJurisdictionDisplay');
    if (transitTabJurisDisplay) {
        transitTabJurisDisplay.textContent = ctx.jurisdictionName
            ? `${ctx.jurisdictionName}, ${ctx.stateCode}`
            : 'No jurisdiction selected';
    }

    // Update tier scope display for transit tab
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

    // Update scope notice
    _updateTransitTierScopeNotice(tier);
}

// Listen for jurisdiction changes in the Transit sub-tab
document.addEventListener('jurisdictionChanged', function() {
    if (transitTabState.initialized) {
        transitTabSyncFromContext();

        // Clear ALL old transit stops when jurisdiction changes
        console.log('[TransitTab] Jurisdiction changed, clearing all transit stops');
        transitTabClearAllStops();
        transitTabState.loaded = false;

        // Auto-reload for new jurisdiction after cleanup completes
        setTimeout(() => transitTabLoadStopsFromBTS(), 500);

        updateTransitTabUI();
    }
});

// Listen for tier changes to update transit and school tabs
document.addEventListener('tierChanged', function(e) {
    const detail = e.detail || {};
    console.log(`[TierEvent] Tier changed to: ${detail.tier}, scope: ${detail.scopeKey}`);
    // Fix 5 — assert the scopeKey aligns with the tier. Catches regressions
    // where a future dispatcher forgets to pass the tier to getTierScopeKey().
    if (detail.tier && detail.scopeKey) {
        const _expectedPrefix = (detail.tier === 'federal') ? 'federal_' : detail.tier + '_';
        if (!String(detail.scopeKey).startsWith(_expectedPrefix)) {
            console.warn('[TierEvent] Scope/tier mismatch — tier=' + detail.tier +
                ', scopeKey=' + detail.scopeKey + ' (expected prefix "' + _expectedPrefix + '")');
        }
    }

    // Update transit tab
    if (transitTabState.initialized) {
        transitTabSyncFromContext();
        // Clear existing transit data when tier scope changes
        transitTabClearAllStops();
        transitTabState.loaded = false;
        updateTransitTabUI();
    }

    // Also sync the transit source display
    if (typeof transitSyncFromContext === 'function') {
        transitSyncFromContext();
    }

    // Update school tab
    if (typeof schoolsSyncFromContext === 'function') {
        schoolsSyncFromContext();
    }
});

/**
 * Handle county change (now driven by jurisdictionContext).
 */
function transitTabCountyChange() {
    transitTabSyncFromContext();
}

/**
 * Quick select counties (kept for backward compatibility).
 */
function transitTabQuickSelect(county) {
    transitTabState.county = county;
    console.log('[TransitTab] Quick selected:', county);
}

/**
 * Load transit stops — now uses BTS National Transit Map directly.
 * Falls back to the legacy transitLoadStops() if BTS fails.
 */
async function transitTabLoadStops() {
    // Prefer the BTS-direct method
    await transitTabLoadStopsFromBTS();
}

/**
 * Load transit stops directly from BTS National Transit Map Stops API.
 * Uses the same bbox-based spatial query as other BTS Federal Data Layers.
 * Also enables the BTS Transit Stops map layer for visual consistency.
 */
async function transitTabLoadStopsFromBTS() {
    const statusEl = document.getElementById('transitTabStatus');
    const statusBanner = document.getElementById('transitTabLayerStatus');
    const county = transitTabState.county || jurisdictionContext.jurisdictionKey;

    if (!county) {
        if (statusBanner) {
            statusBanner.style.background = 'linear-gradient(135deg,#fef2f2,#fecaca)';
            statusBanner.style.borderColor = '#dc2626';
            statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">⚠️</span><span style="color:#dc2626;font-weight:500">Please select a jurisdiction on the Upload Data tab first.</span></div>`;
        }
        return;
    }

    // Check if transit stops already loaded for this jurisdiction
    const jurisdictions = window.appConfig?.jurisdictions || {};
    const jurisdiction = jurisdictions[county];
    if (!jurisdiction) {
        console.warn('[TransitTab] No jurisdiction config for:', county);
        return;
    }

    const countyName = jurisdiction.name;
    const existingTransitAsset = assetState?.assets?.find(a =>
        (a.type === 'bus_stop' || a.id?.startsWith('transit_')) &&
        a.name?.includes(countyName)
    );
    if (existingTransitAsset) {
        console.log(`[TransitTab] Transit stops already loaded for ${countyName}`);
        updateTransitTabUI();
        updateTransitTabMetrics();
        return;
    }

    // Show loading status
    if (statusBanner) {
        statusBanner.style.background = 'linear-gradient(135deg,#eff6ff,#dbeafe)';
        statusBanner.style.borderColor = '#60a5fa';
        statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">⏳</span><span style="color:#1e40af;font-weight:500">Loading transit stops from BTS National Transit Map...</span></div>`;
    }

    try {
        // Get jurisdiction bounds
        const bounds = getCountyBounds(jurisdiction);
        if (!bounds) {
            throw new Error('No jurisdiction bounds available');
        }

        // Use the BTS Transit Stops endpoint directly
        const btsEndpoint = BTS_ENDPOINTS.transitStops;
        console.log(`[TransitTab] Fetching transit stops from BTS for ${countyName}...`);

        const geojson = await btsFetchLayerData(btsEndpoint, bounds);
        const features = geojson?.features || [];
        console.log(`[TransitTab] BTS returned ${features.length} transit stops for ${countyName}`);

        if (features.length === 0) {
            // Fallback to legacy loader
            console.log('[TransitTab] No BTS stops found, trying legacy loader...');
            transitState.selectedCounty = county;
            await transitLoadStops();
            setTimeout(() => { updateTransitTabUI(); updateTransitTabMetrics(); }, 500);
            return;
        }

        // Convert BTS GeoJSON features to asset locations
        const locations = features.map((f, idx) => {
            const p = f.properties || {};
            const coords = f.geometry?.coordinates;
            if (!coords || coords.length < 2) return null;

            const lng = coords[0];
            const lat = coords[1];
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

            return {
                id: `transit_${idx}`,
                name: p.stop_name || p.STOP_NAME || `Stop ${idx + 1}`,
                lat: lat,
                lng: lng,
                inBounds: true,
                metadata: {
                    stopId: p.stop_id || p.STOP_ID || `BTS-${idx}`,
                    agency: p.agency_name || p.AGENCY || 'Transit Agency',
                    routes: p.routes || p.ROUTES || '',
                    dataSource: 'bts_national_transit_map',
                    mode: p.route_type_text || '',
                    ...p
                },
                sourceType: 'transit'
            };
        }).filter(loc => loc !== null);

        if (locations.length === 0) {
            throw new Error('No valid stop locations after processing');
        }

        // Save as asset
        const crashFilter = document.querySelector('input[name="transitTabCrashFilter"]:checked')?.value || 'ped_bike';
        if (typeof assetState !== 'undefined') {
            assetState.radiusFeet = transitTabState.radius;
        }

        await transitSaveAsAsset(locations, countyName, false, 'bts_national_transit_map');

        // Also enable the BTS Transit Stops map layer for visual consistency
        const btsState = builtInLayersState.btsTransitStops;
        if (btsState && !btsState.enabled) {
            btsState.enabled = true;
            const jurisdictionId = localStorage.getItem('selectedJurisdiction');
            btsState.geojsonCache[jurisdictionId] = geojson;
            btsState.featureCount = features.length;
            displayBTSLayer('transitStops', geojson);
            saveBTSLayerVisibility();
        }

        // Also enable Transit Routes for complete transit picture
        const routesState = builtInLayersState.btsTransitRoutes;
        if (routesState && !routesState.enabled) {
            routesState.enabled = true;
            addBTSLayer('transitRoutes');
            saveBTSLayerVisibility();
        }

        console.log(`[TransitTab] Loaded ${locations.length} transit stops as asset for ${countyName}`);

        // Update tab UI
        setTimeout(() => {
            updateTransitTabUI();
            updateTransitTabMetrics();
            updateMapAssetPanel();
        }, 500);

    } catch (error) {
        console.error('[TransitTab] BTS load error:', error);
        // Fallback to legacy loader
        console.log('[TransitTab] Falling back to legacy transit loader...');
        try {
            transitState.selectedCounty = county;
            await transitLoadStops();
            setTimeout(() => { updateTransitTabUI(); updateTransitTabMetrics(); }, 500);
        } catch (fallbackError) {
            console.error('[TransitTab] Legacy fallback also failed:', fallbackError);
            if (statusBanner) {
                statusBanner.style.background = 'linear-gradient(135deg,#fef2f2,#fecaca)';
                statusBanner.style.borderColor = '#dc2626';
                statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">❌</span><span style="color:#dc2626;font-weight:500">Error loading transit stops: ${error.message}</span></div>`;
            }
        }
    }
}

/**
 * Load transit stops for the current view tier (state, region, MPO, or county).
 * For county tier, delegates to the existing transitTabLoadStopsFromBTS().
 * For higher tiers, uses a larger bounding box from getBoundsForTier().
 */
async function transitLoadStopsForTier() {
    const tier = jurisdictionContext.viewTier;

    // County/city tier: use existing single-county loader
    if (tier === 'county' || tier === 'city') {
        return transitTabLoadStopsFromBTS();
    }

    // Federal tier: not supported
    if (tier === 'federal') {
        const statusBanner = document.getElementById('transitTabLayerStatus');
        if (statusBanner) {
            statusBanner.style.background = 'linear-gradient(135deg,#fef2f2,#fecaca)';
            statusBanner.style.borderColor = '#dc2626';
            statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">⚠️</span><span style="color:#dc2626;font-weight:500">Transit loading not available at federal level. Select state, region, MPO, or county.</span></div>`;
        }
        return;
    }

    const scopeKey = getTierScopeKey();
    const scopeName = getTierScopeName();

    // Check if transit stops for this tier scope are already loaded
    const existingAsset = assetState?.assets?.find(a =>
        (a.type === 'bus_stop' || a.id?.startsWith('transit_')) &&
        a.tierScopeKey === scopeKey
    );
    if (existingAsset) {
        console.log(`[TransitTab] Transit stops already loaded for scope ${scopeKey}`);
        updateTransitTabUI();
        updateTransitTabMetrics();
        return;
    }

    const statusBanner = document.getElementById('transitTabLayerStatus');
    if (statusBanner) {
        statusBanner.style.background = 'linear-gradient(135deg,#eff6ff,#dbeafe)';
        statusBanner.style.borderColor = '#60a5fa';
        statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">⏳</span><span style="color:#1e40af;font-weight:500">Loading transit stops for ${scopeName} from BTS National Transit Map...</span></div>`;
    }

    try {
        const bounds = getBoundsForTier();
        if (!bounds) {
            throw new Error(`No bounds available for tier "${tier}". Please select a ${tier}.`);
        }

        const btsEndpoint = BTS_ENDPOINTS.transitStops;
        console.log(`[TransitTab] Fetching transit stops from BTS for ${scopeName}...`);

        const geojson = await btsFetchLayerData(btsEndpoint, bounds);
        const features = geojson?.features || [];
        console.log(`[TransitTab] BTS returned ${features.length} transit stops for ${scopeName}`);

        if (features.length === 0) {
            throw new Error(`No transit stops found in the BTS data for ${scopeName}`);
        }

        // Convert BTS GeoJSON features to asset locations
        const locations = features.map((f, idx) => {
            const p = f.properties || {};
            const coords = f.geometry?.coordinates;
            if (!coords || coords.length < 2) return null;
            const lng = coords[0];
            const lat = coords[1];
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

            return {
                id: `transit_${idx}`,
                name: p.stop_name || p.STOP_NAME || `Stop ${idx + 1}`,
                lat, lng,
                inBounds: true,
                metadata: {
                    stopId: p.stop_id || p.STOP_ID || `BTS-${idx}`,
                    agency: p.agency_name || p.AGENCY || 'Transit Agency',
                    routes: p.routes || p.ROUTES || '',
                    dataSource: 'bts_national_transit_map',
                    mode: p.route_type_text || '',
                    ...p
                },
                sourceType: 'transit'
            };
        }).filter(loc => loc !== null);

        if (locations.length === 0) {
            throw new Error('No valid transit stop locations after processing');
        }

        // Set radius before saving
        if (typeof assetState !== 'undefined') {
            assetState.radiusFeet = transitTabState.radius;
        }

        // Remove existing transit assets and save new one with tier metadata
        const existingTransitAssets = assetState.assets.filter(a =>
            a.type === 'bus_stop' || a.id?.startsWith('transit_') || a.name?.toLowerCase().includes('transit')
        );
        if (existingTransitAssets.length > 0) {
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

        const assetId = 'transit_' + Date.now();
        const asset = {
            id: assetId,
            name: `Transit Stops - ${scopeName}`,
            type: 'bus_stop',
            source: 'BTS National Transit Map',
            uploadDate: new Date().toISOString(),
            locations: locations,
            locationCount: locations.length,
            dataSource: 'bts_national_transit_map',
            tierScopeKey: scopeKey,
            tierViewLevel: tier,
            tierScopeName: scopeName,
            countyCount: getCountyFIPSListForTier()?.length || 0
        };

        await assetDbSave(asset);
        assetState.assets.push(asset);
        assetState.activeAssetIds.push(assetId);
        await assetSaveSettings();

        assetRenderList();
        updateMapAssetPanel();
        await assetRunAnalysis();

        // Update crash scope notice
        _updateTransitTierScopeNotice(tier);

        // Ensure boundary overlay is displayed for this tier
        await ensureTierBoundaryDisplayed();

        console.log(`[TransitTab] Loaded ${locations.length} transit stops for ${scopeName}`);

        setTimeout(() => {
            updateTransitTabUI();
            updateTransitTabMetrics();
            updateMapAssetPanel();
        }, 500);

    } catch (error) {
        console.error('[TransitTab] Tier load error:', error);
        if (statusBanner) {
            statusBanner.style.background = 'linear-gradient(135deg,#fef2f2,#fecaca)';
            statusBanner.style.borderColor = '#dc2626';
            statusBanner.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem"><span style="font-size:1.25rem">❌</span><span style="color:#dc2626;font-weight:500">Error: ${error.message}</span></div>`;
        }
    }
}

/**
 * Update the transit tab crash scope notice for non-county tiers.
 */
function _updateTransitTierScopeNotice(tier) {
    const noticeEl = document.getElementById('transitCrashScopeNotice');
    if (!noticeEl) return;

    if (tier === 'county' || tier === 'city') {
        noticeEl.style.display = 'none';
    } else {
        const loadedCounty = jurisdictionContext.jurisdictionName || 'the loaded county';
        noticeEl.style.display = '';
        noticeEl.innerHTML = `<div style="display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;background:linear-gradient(135deg,#fffbeb,#fef3c7);border:1px solid #f59e0b;border-radius:8px;margin-bottom:.75rem">
            <span style="font-size:1.1rem">ℹ️</span>
            <span style="color:#92400e;font-size:.82rem"><strong>Note:</strong> Crash associations are computed using <strong>${loadedCounty}</strong> crash data only. Transit stops in other counties are shown on the map without crash data.</span>
        </div>`;
    }
}

/**
 * Update the transit tab UI based on current state
 */
function updateTransitTabUI() {
    const statusBanner = document.getElementById('transitTabLayerStatus');
    const metricsPanel = document.getElementById('transitTabMetrics');
    const resultsPanel = document.getElementById('transitTabResults');
    const countermeasuresPanel = document.getElementById('transitTabCountermeasures');
    const resourcesPanel = document.getElementById('transitTabResources');

    // Check if transit stops are loaded
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));

    if (transitAsset) {
        // Transit stops are loaded - update status banner
        if (statusBanner) {
            const count = transitAsset.locations?.length || 0;
            statusBanner.style.background = 'linear-gradient(135deg,#eff6ff,#dbeafe)';
            statusBanner.style.borderColor = '#60a5fa';
            statusBanner.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
                    <div style="display:flex;align-items:center;gap:.5rem">
                        <span style="font-size:1.25rem">✅</span>
                        <span style="color:#1e40af;font-weight:500">${count} transit stops loaded - ${transitAsset.name || 'Transit Stops'}</span>
                    </div>
                    <button class="btn btn-sm btn-secondary" onclick="transitTabClearStops()">Clear Stops</button>
                </div>
            `;
        }

        // Show panels
        if (metricsPanel) metricsPanel.style.display = 'block';
        if (resultsPanel) resultsPanel.style.display = 'block';
        if (countermeasuresPanel) countermeasuresPanel.style.display = 'block';
        if (resourcesPanel) resourcesPanel.style.display = 'block';

        transitTabState.loaded = true;
    } else {
        // No transit stops loaded
        if (statusBanner) {
            statusBanner.style.background = 'linear-gradient(135deg,#fef3c7,#fde68a)';
            statusBanner.style.borderColor = '#f59e0b';
            statusBanner.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
                    <div style="display:flex;align-items:center;gap:.5rem">
                        <span style="font-size:1.25rem">⚠️</span>
                        <span style="color:#92400e;font-weight:500">No transit stops loaded yet</span>
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="transitTabLoadStops()">🚌 Load Transit Stops</button>
                </div>
            `;
        }

        // Hide panels
        if (metricsPanel) metricsPanel.style.display = 'none';
        if (resultsPanel) resultsPanel.style.display = 'none';
        if (countermeasuresPanel) countermeasuresPanel.style.display = 'none';
        if (resourcesPanel) resourcesPanel.style.display = 'none';

        transitTabState.loaded = false;
    }
}

/**
 * Update transit tab metrics from asset associations
 */
function updateTransitTabMetrics() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (!transitAsset) return;

    const results = Array.from(assetState?.associations?.values() || [])
        .filter(r => r.asset?.id === transitAsset.id || r.asset?.type === 'bus_stop');

    if (results.length === 0) return;

    // Calculate totals
    let totalCrashes = 0, totalK = 0, totalA = 0, totalB = 0, totalC = 0, totalO = 0, totalEPDO = 0;
    let pedCount = 0, bikeCount = 0, nightCount = 0, intersectionCount = 0, weatherCount = 0;

    results.forEach(r => {
        totalCrashes += r.total || 0;
        totalK += r.K || 0;
        totalA += r.A || 0;
        totalB += r.B || 0;
        totalC += r.C || 0;
        totalO += r.O || 0;
        totalEPDO += r.epdo || 0;

        // Count crash factors from raw crashes
        if (r.crashes) {
            r.crashes.forEach(crash => {
                if (crash[COL.PED] === 'Y') pedCount++;
                if (crash[COL.BIKE] === 'Y') bikeCount++;

                const light = crash[COL.LIGHT];
                if (light && (light.includes('DARK') || light.includes('NIGHT'))) nightCount++;

                const relation = crash[COL.RELATION];
                if (relation && relation.includes('INTERSECTION')) intersectionCount++;

                const weather = crash[COL.WEATHER];
                if (weather && !weather.includes('CLEAR') && weather !== 'NO ADVERSE') weatherCount++;
            });
        }
    });

    // Update UI elements
    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = typeof val === 'number' ? val.toLocaleString() : val;
    };

    setVal('transitTabStopCount', transitAsset.locations?.length || results.length);
    setVal('transitTabCrashTotal', totalCrashes);
    setVal('transitTabKA', totalK + totalA);
    setVal('transitTabEPDO', totalEPDO);
    setVal('transitTabPedBike', pedCount + bikeCount);
    setVal('transitTabPed', pedCount);
    setVal('transitTabBike', bikeCount);
    setVal('transitTabNight', nightCount);
    setVal('transitTabIntersection', intersectionCount);
    setVal('transitTabWeather', weatherCount);

    // Update severity bar
    const total = totalCrashes || 1;
    const sevBar = (id, count, label) => {
        const el = document.getElementById(id);
        if (el) {
            const pct = (count / total * 100);
            el.style.width = pct > 0 ? `${Math.max(pct, 5)}%` : '0';
            el.textContent = count > 0 ? `${label}: ${count}` : '';
        }
    };

    sevBar('transitTabSevK', totalK, 'K');
    sevBar('transitTabSevA', totalA, 'A');
    sevBar('transitTabSevB', totalB, 'B');
    sevBar('transitTabSevC', totalC, 'C');
    sevBar('transitTabSevO', totalO, 'O');

    // Update results table
    updateTransitTabTable(results);
}

/**
 * Update transit results table
 */
function updateTransitTabTable(results) {
    const tbody = document.getElementById('transitTabBody');
    if (!tbody) return;

    // Sort by EPDO
    results.sort((a, b) => (b.epdo || 0) - (a.epdo || 0));

    tbody.innerHTML = results.slice(0, 50).map((r, i) => {
        const name = r.asset?.name || r.name || `Stop ${i + 1}`;
        const route = r.asset?.metadata?.route || '-';
        const ka = (r.K || 0) + (r.A || 0);
        const pedBike = (r.crashes || []).filter(c => c[COL.PED] === 'Y' || c[COL.BIKE] === 'Y').length;

        return `
            <tr>
                <td>${i + 1}</td>
                <td style="font-weight:500">${name}</td>
                <td>${route}</td>
                <td>${r.total || 0}</td>
                <td>${pedBike}</td>
                <td style="color:${ka > 0 ? '#dc2626' : 'inherit'};font-weight:${ka > 0 ? '600' : 'normal'}">${ka}</td>
                <td style="font-weight:600">${r.epdo || 0}</td>
                <td>
                    <button class="btn-soft btn-soft-sm btn-soft-primary" onclick="transitTabViewOnMapSingle(${r.lat || 0}, ${r.lng || 0})" title="View on map">🗺️</button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Clear transit stops
 */
function transitTabClearStops() {
    transitTabClearAllStops();
}

/**
 * Clear ALL transit stop assets (handles duplicates)
 * Used when leaving transit tab to ensure clean state
 */
function transitTabClearAllStops() {
    const transitAssets = assetState?.assets?.filter(a =>
        a.type === 'bus_stop' || a.id?.startsWith('transit_') || a.name?.toLowerCase().includes('transit')
    ) || [];
    if (transitAssets.length === 0) return;

    console.log(`[Transit] Clearing ${transitAssets.length} transit asset(s)`);

    // Remove each transit asset
    transitAssets.forEach(asset => {
        // Remove map layer and visibility state
        assetRemoveMapLayer(asset.id);
        delete mapAssetVisibility[asset.id];

        const idx = assetState.assets.findIndex(a => a.id === asset.id);
        if (idx !== -1) {
            assetState.assets.splice(idx, 1);
        }
        const activeIdx = assetState.activeAssetIds.indexOf(asset.id);
        if (activeIdx !== -1) {
            assetState.activeAssetIds.splice(activeIdx, 1);
        }
        // Remove from IndexedDB
        assetDbDelete(asset.id);
    });

    // Persist visibility state
    saveMapAssetVisibility();

    // Save and update UI
    assetSaveSettings();
    assetRenderList();
    updateMapAssetPanel();
    setTimeout(updateTransitTabUI, 300);
}

/**
 * Radius change handlers
 */
function transitTabRadiusChange(value) {
    transitTabState.radius = parseInt(value);
    const el = document.getElementById('transitTabRadiusValue');
    if (el) el.textContent = `${value} ft`;
}

function transitTabSetRadius(value) {
    transitTabState.radius = value;
    const slider = document.getElementById('transitTabRadius');
    const el = document.getElementById('transitTabRadiusValue');
    if (slider) slider.value = value;
    if (el) el.textContent = `${value} ft`;

    // Update global radius if transit loaded
    if (typeof assetState !== 'undefined' && transitTabState.loaded) {
        assetState.radiusFeet = value;
        assetRunAnalysis().then(() => updateTransitTabMetrics());
    }
}

/**
 * View transit stops on map
 */
function transitTabViewOnMap() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (transitAsset) {
        // Enable transit layer visibility
        mapAssetVisibility[transitAsset.id] = true;
        saveMapAssetVisibility();
        assetShowOnMap(transitAsset.id);
        showTab('map');
    } else {
        alert('Please load transit stops first.');
    }
}

function transitTabViewOnMapSingle(lat, lng) {
    if (lat && lng && crashMap) {
        showTab('map');
        setTimeout(() => {
            crashMap.setView([lat, lng], 17);
        }, 100);
    }
}

/**
 * Focus View - show only transit layer
 */
function transitTabFocusView() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (!transitAsset) {
        alert('Please load transit stops first.');
        return;
    }

    // Disable all other asset layers, enable only transit
    assetState.assets.forEach(asset => {
        mapAssetVisibility[asset.id] = (asset.type === 'bus_stop' || asset.name?.toLowerCase().includes('transit'));
    });
    saveMapAssetVisibility();

    // Refresh map panel
    if (typeof updateMapAssetPanel === 'function') {
        updateMapAssetPanel();
    }

    // Show transit layer on map
    assetShowOnMap(transitAsset.id);
    showTab('map');
}

/**
 * Export transit data
 */
function transitTabExportData() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (!transitAsset) {
        alert('No transit data to export.');
        return;
    }

    const results = Array.from(assetState?.associations?.values() || [])
        .filter(r => r.asset?.id === transitAsset.id || r.asset?.type === 'bus_stop');

    if (results.length === 0) {
        alert('No transit crash data to export.');
        return;
    }

    // Create CSV
    const headers = ['Rank', 'Stop Name/ID', 'Route', 'Total Crashes', 'Ped/Bike', 'Fatal (K)', 'Serious (A)', 'Minor (B)', 'Possible (C)', 'PDO (O)', 'EPDO', 'Latitude', 'Longitude'];
    const rows = results.sort((a, b) => (b.epdo || 0) - (a.epdo || 0)).map((r, i) => {
        const pedBike = (r.crashes || []).filter(c => c[COL.PED] === 'Y' || c[COL.BIKE] === 'Y').length;
        return [
            i + 1,
            r.asset?.name || r.name || `Stop ${i + 1}`,
            r.asset?.metadata?.route || '',
            r.total || 0,
            pedBike,
            r.K || 0,
            r.A || 0,
            r.B || 0,
            r.C || 0,
            r.O || 0,
            r.epdo || 0,
            r.lat || '',
            r.lng || ''
        ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transit_safety_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Export transit data as KML for Google Earth / GIS
 */
function transitTabExportKML() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (!transitAsset) {
        alert('No transit data to export.');
        return;
    }

    const results = Array.from(assetState?.associations?.values() || [])
        .filter(r => r.asset?.id === transitAsset.id || r.asset?.type === 'bus_stop');

    if (results.length === 0) {
        alert('No transit crash data to export.');
        return;
    }

    // Sort by EPDO for ranking
    const sortedResults = results.sort((a, b) => (b.epdo || 0) - (a.epdo || 0));

    // Build KML content
    let placemarks = sortedResults.map((r, i) => {
        const name = r.asset?.name || r.name || `Stop ${i + 1}`;
        const lat = r.lat || r.asset?.lat || 0;
        const lng = r.lng || r.asset?.lng || 0;
        const route = r.asset?.metadata?.route || 'N/A';
        const crashes = r.total || 0;
        const epdo = r.epdo || 0;
        const ka = (r.K || 0) + (r.A || 0);
        const pedBike = (r.crashes || []).filter(c => c[COL.PED] === 'Y' || c[COL.BIKE] === 'Y').length;

        // Color based on risk (red = high, yellow = medium, green = low)
        let styleId = 'lowRisk';
        if (epdo > 100 || ka > 0) styleId = 'highRisk';
        else if (epdo > 50 || crashes > 3 || pedBike > 0) styleId = 'medRisk';

        const description = `<![CDATA[
<b>Rank:</b> ${i + 1}<br/>
<b>Route:</b> ${route}<br/>
<hr/>
<b>Total Crashes:</b> ${crashes}<br/>
<b>Pedestrian/Bicycle:</b> ${pedBike}<br/>
<b>Fatal + Serious (K+A):</b> ${ka}<br/>
<b>EPDO Score:</b> ${epdo.toLocaleString()}<br/>
]]>`;

        return `
    <Placemark>
      <name>${escapeXML(name)}</name>
      <description>${description}</description>
      <styleUrl>#${styleId}</styleUrl>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>`;
    }).join('');

    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>Transit Safety Analysis - ${new Date().toLocaleDateString()}</name>
  <description>Transit stops ranked by crash risk (EPDO). Generated by ${getReportAttribution()}.</description>

  <Style id="highRisk">
    <IconStyle>
      <color>ff0000ff</color>
      <scale>1.2</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon>
    </IconStyle>
  </Style>
  <Style id="medRisk">
    <IconStyle>
      <color>ff00aaff</color>
      <scale>1.0</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href></Icon>
    </IconStyle>
  </Style>
  <Style id="lowRisk">
    <IconStyle>
      <color>ff00ff00</color>
      <scale>0.8</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>
    </IconStyle>
  </Style>

  <Folder>
    <name>Transit Stops (${sortedResults.length})</name>
    ${placemarks}
  </Folder>
</Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transit_safety_analysis_${new Date().toISOString().split('T')[0]}.kml`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Soft activate transit layer (without deactivating others)
 */
function softActivateTransitLayer() {
    const transitAsset = assetState?.assets?.find(a => a.type === 'bus_stop' || a.name?.toLowerCase().includes('transit'));
    if (transitAsset && !mapAssetVisibility[transitAsset.id]) {
        mapAssetVisibility[transitAsset.id] = true;
        saveMapAssetVisibility();
        if (typeof updateMapAssetPanel === 'function') {
            updateMapAssetPanel();
        }
        console.log('[TransitTab] Soft-activated transit layer');
    }
}

// ─── EXTRACTED CODE END ───

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.assets = CL.assets || {};
CL.assets.initTransitSafetyTab = initTransitSafetyTab;
CL.assets.transitTabSyncFromContext = transitTabSyncFromContext;
CL.assets.transitTabCountyChange = transitTabCountyChange;
CL.assets.transitTabQuickSelect = transitTabQuickSelect;
CL.assets.transitTabLoadStops = transitTabLoadStops;
CL.assets.transitTabLoadStopsFromBTS = transitTabLoadStopsFromBTS;
CL.assets.transitLoadStopsForTier = transitLoadStopsForTier;
CL.assets._updateTransitTierScopeNotice = _updateTransitTierScopeNotice;
CL.assets.updateTransitTabUI = updateTransitTabUI;
CL.assets.updateTransitTabMetrics = updateTransitTabMetrics;
CL.assets.updateTransitTabTable = updateTransitTabTable;
CL.assets.transitTabClearStops = transitTabClearStops;
CL.assets.transitTabClearAllStops = transitTabClearAllStops;
CL.assets.transitTabRadiusChange = transitTabRadiusChange;
CL.assets.transitTabSetRadius = transitTabSetRadius;
CL.assets.transitTabViewOnMap = transitTabViewOnMap;
CL.assets.transitTabViewOnMapSingle = transitTabViewOnMapSingle;
CL.assets.transitTabFocusView = transitTabFocusView;
CL.assets.transitTabExportData = transitTabExportData;
CL.assets.transitTabExportKML = transitTabExportKML;
CL.assets.softActivateTransitLayer = softActivateTransitLayer;

// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
// All 21 retained per the module's own pre-Stage-A docstring (HTML onclick=
// + dynamically-generated row handlers). Extends the survivor floor (which
// only captured transitLoadStopsForTier, transitTabClearStops,
// transitTabLoadStops, transitTabViewOnMapSingle).
window.initTransitSafetyTab = initTransitSafetyTab;
window.transitTabSyncFromContext = transitTabSyncFromContext;
window.transitTabCountyChange = transitTabCountyChange;
window.transitTabQuickSelect = transitTabQuickSelect;
window.transitTabLoadStops = transitTabLoadStops;
window.transitTabLoadStopsFromBTS = transitTabLoadStopsFromBTS;
window.transitLoadStopsForTier = transitLoadStopsForTier;
window._updateTransitTierScopeNotice = _updateTransitTierScopeNotice;
window.updateTransitTabUI = updateTransitTabUI;
window.updateTransitTabMetrics = updateTransitTabMetrics;
window.updateTransitTabTable = updateTransitTabTable;
window.transitTabClearStops = transitTabClearStops;
window.transitTabClearAllStops = transitTabClearAllStops;
window.transitTabRadiusChange = transitTabRadiusChange;
window.transitTabSetRadius = transitTabSetRadius;
window.transitTabViewOnMap = transitTabViewOnMap;
window.transitTabViewOnMapSingle = transitTabViewOnMapSingle;
window.transitTabFocusView = transitTabFocusView;
window.transitTabExportData = transitTabExportData;
window.transitTabExportKML = transitTabExportKML;
window.softActivateTransitLayer = softActivateTransitLayer;

export {
    initTransitSafetyTab,
    transitTabSyncFromContext,
    transitTabCountyChange,
    transitTabQuickSelect,
    transitTabLoadStops,
    transitTabLoadStopsFromBTS,
    transitLoadStopsForTier,
    _updateTransitTierScopeNotice,
    updateTransitTabUI,
    updateTransitTabMetrics,
    updateTransitTabTable,
    transitTabClearStops,
    transitTabClearAllStops,
    transitTabRadiusChange,
    transitTabSetRadius,
    transitTabViewOnMap,
    transitTabViewOnMapSingle,
    transitTabFocusView,
    transitTabExportData,
    transitTabExportKML,
    softActivateTransitLayer
};

CL._registerModule('assets/transit-tab');
