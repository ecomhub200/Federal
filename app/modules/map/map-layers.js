/**
 * CL map.layers module
 *
 * Extracted from app/index.html on 2026-05-17.
 * Round X modular refactor — see modular-prompts/36-map-map-layers.md.
 * Responsibility: Map address search + scope label + nearby-crash geometry
 * (Mapbox geocoding, address marker, Haversine distance).
 *
 * Public API (back-compat dual exposure):
 *   - window.updateMapScopeLabel        → CL.map.updateMapScopeLabel
 *   - window.searchMapboxAddresses      → CL.map.searchMapboxAddresses
 *   - window.selectAddressResult        → CL.map.selectAddressResult
 *   - window.clearMapAddressSearch      → CL.map.clearMapAddressSearch
 *   - window.updateMapSearchClearButton → CL.map.updateMapSearchClearButton
 *   - window.findCrashesNearPoint       → CL.map.findCrashesNearPoint
 *   - window.getDistanceMeters          → CL.map.getDistanceMeters
 *   - window.calculateNearbyCrashSeverity → CL.map.calculateNearbyCrashSeverity
 *
 * NOTE: the prompt's §2 listed only the 5 named anchors, but
 * updateMapSearchClearButton (callers @ index.html L46148/L47089) and
 * getDistanceMeters (callers @ L81726/L81957/L82016/L82188/L132342/L132357)
 * have inline callers OUTSIDE the moved block — they MUST be window-exposed
 * to preserve behavior. calculateNearbyCrashSeverity is moved as a contiguous
 * helper and exposed for consistency. No behavior change.
 *
 * Depends on (resolved at runtime, not load order): crashMap, MAP_CENTER,
 * appConfig, crashState, clearMapSelection, updateMapDisplay,
 * getJurisdictionLabel, jurisdictionContext.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Update the Stats overlay scope label so users see the active jurisdiction
 * (e.g. "Bridgeville town" at city tier, "Capital Region" at region tier,
 * "Delaware" at state tier) without having to look at the upload tab.
 * Reads from getJurisdictionLabel() so the label tracks tier changes.
 */
function updateMapScopeLabel() {
    const label = (typeof getJurisdictionLabel === 'function')
        ? getJurisdictionLabel()
        : (jurisdictionContext?.jurisdictionName || '');
    const headerEl = document.getElementById('mapScopeLabel');
    const bodyEl = document.getElementById('mapScope');
    if (headerEl) headerEl.textContent = label ? `· ${label}` : '';
    if (bodyEl) bodyEl.textContent = label || '—';
}

// Mapbox Geocoding API call - state/jurisdiction-aware search
async function searchMapboxAddresses(query) {
    // Check if Mapbox token is configured
    const token = appConfig?.apis?.mapbox?.accessToken;
    if (!token || token === 'YOUR_MAPBOX_ACCESS_TOKEN_HERE') {
        console.warn('[Map Search] Mapbox access token not configured');
        return [];
    }

    const endpoint = appConfig?.apis?.mapbox?.geocodingEndpoint || 'https://api.mapbox.com/geocoding/v5/mapbox.places';

    // Use current map bounds as bounding box for geocoding (dynamically adapts to any state)
    let searchBbox = '-83.675,36.54,-75.24,39.47'; // Default fallback (Virginia)
    const mapInstance = (typeof crashMap !== 'undefined' && crashMap) ? crashMap : null;
    if (mapInstance && typeof mapInstance.getBounds === 'function') {
        try {
            const bounds = mapInstance.getBounds();
            const sw = bounds.getSouthWest();
            const ne = bounds.getNorthEast();
            searchBbox = `${sw.lng},${sw.lat},${ne.lng},${ne.lat}`;
        } catch(e) { /* use default */ }
    }

    // Use current MAP_CENTER as proximity for better local results
    let proximityCenter = '-77.5,37.55'; // Default fallback
    if (typeof MAP_CENTER !== 'undefined' && MAP_CENTER) {
        proximityCenter = `${MAP_CENTER[1]},${MAP_CENTER[0]}`; // MAP_CENTER is [lat, lng], proximity needs lng,lat
    }

    // Automatically add state context if not already present in the query
    const stateName = appConfig?.stateName || 'Virginia';
    let searchQuery = query.trim();
    const lowerQuery = searchQuery.toLowerCase();
    const lowerStateName = stateName.toLowerCase();
    if (!lowerQuery.includes(lowerStateName)) {
        // Also check for common abbreviation patterns (e.g. ", CO", ", VA")
        const stateSelect = document.getElementById('stateSelect');
        const stateOption = stateSelect?.selectedOptions?.[0]?.textContent || '';
        const abbrMatch = stateOption.match(/\(([A-Z]{2})\)/);
        const stateAbbr = abbrMatch ? abbrMatch[1].toLowerCase() : '';
        if (!stateAbbr || (!lowerQuery.includes(`, ${stateAbbr}`) && !lowerQuery.endsWith(` ${stateAbbr}`))) {
            searchQuery += `, ${stateName}`;
        }
    }

    // Build the API URL with state/jurisdiction-aware parameters
    const params = new URLSearchParams({
        access_token: token,
        autocomplete: 'true',
        limit: '5',
        types: 'address,poi,place,locality,neighborhood',
        country: 'US',
        bbox: searchBbox,
        proximity: proximityCenter
    });

    const url = `${endpoint}/${encodeURIComponent(searchQuery)}.json?${params}`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform Mapbox results to our format with cleaner display names
    // Get state abbreviation for compact display
    const stateSelectEl = document.getElementById('stateSelect');
    const selectedStateOption = stateSelectEl?.selectedOptions?.[0]?.textContent || '';
    const abbrExtract = selectedStateOption.match(/\(([A-Z]{2})\)/);
    const displayAbbr = abbrExtract ? abbrExtract[1] : '';

    return (data.features || []).map(feature => {
        // Clean up display name - remove redundant state/country suffix
        let displayName = feature.place_name;
        if (stateName) {
            displayName = displayName.replace(new RegExp(`, ${stateName}, United States$`, 'i'), displayAbbr ? `, ${displayAbbr}` : '');
        }
        if (displayAbbr) {
            displayName = displayName.replace(new RegExp(`, ${displayAbbr}, United States$`, 'i'), `, ${displayAbbr}`);
        }
        displayName = displayName.replace(/, United States$/i, '');

        // Extract locality/city for context
        const contextParts = feature.context || [];
        const locality = contextParts.find(c => c.id?.startsWith('place.'))?.text ||
                        contextParts.find(c => c.id?.startsWith('locality.'))?.text || '';
        const placeType = feature.place_type?.[0] || 'location';
        const contextLabel = locality ? `${placeType} in ${locality}` : placeType;

        return {
            name: displayName,
            lat: feature.center[1],
            lng: feature.center[0],
            context: contextLabel,
            fullAddress: feature.place_name
        };
    });
}

// Handle address result selection
function selectAddressResult(lat, lng, name) {
    // Hide search results
    document.getElementById('mapSearchResults').classList.remove('visible');
    document.getElementById('mapGlobalSearch').value = name;

    // Remove existing address marker if any
    if (currentAddressMarker && crashMap) {
        crashMap.removeLayer(currentAddressMarker);
    }

    // Find nearby crashes within 500ft (~152 meters)
    const nearbyRadius = 152; // meters (approximately 500ft)
    const nearbyCrashes = findCrashesNearPoint(lat, lng, nearbyRadius);

    // Create popup content
    let popupContent = `<div class="address-marker-popup">
        <h4>📍 ${name.length > 50 ? name.substring(0, 50) + '...' : name}</h4>
        <div class="nearby-info">`;

    if (nearbyCrashes.length === 0) {
        popupContent += `<span class="no-crashes">No crashes within 500ft of this location</span>`;
    } else {
        const severity = calculateNearbyCrashSeverity(nearbyCrashes);
        popupContent += `<span class="has-crashes"><strong>${nearbyCrashes.length}</strong> crashes within 500ft</span>`;
        if (severity.fatal > 0 || severity.serious > 0) {
            popupContent += `<br><small>${severity.fatal} fatal, ${severity.serious} serious injury</small>`;
        }
    }

    popupContent += `</div></div>`;

    // Create custom icon for address marker
    const addressIcon = L.divIcon({
        className: 'address-pin-icon',
        html: '<div style="background:#16a34a;color:white;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid white"><span style="transform:rotate(45deg);font-size:14px">📍</span></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    // Add marker to map
    currentAddressMarker = L.marker([lat, lng], { icon: addressIcon })
        .addTo(crashMap)
        .bindPopup(popupContent)
        .openPopup();

    // Zoom to location
    crashMap.setView([lat, lng], 17);

    // Log for debugging
    console.log(`[Map Search] Address selected: ${name} at [${lat}, ${lng}], ${nearbyCrashes.length} crashes nearby`);

    // Show clear button
    updateMapSearchClearButton();
}

// Clear the map address search input and reset
function clearMapAddressSearch() {
    // Clear the search input
    const searchInput = document.getElementById('mapGlobalSearch');
    if (searchInput) {
        searchInput.value = '';
    }

    // Hide search results
    const resultsDiv = document.getElementById('mapSearchResults');
    if (resultsDiv) {
        resultsDiv.innerHTML = '';
        resultsDiv.classList.remove('visible');
    }

    // Remove address marker if any
    if (currentAddressMarker && crashMap) {
        crashMap.removeLayer(currentAddressMarker);
        currentAddressMarker = null;
    }

    // Clear route/location selection
    clearMapSelection();

    // Hide clear button
    updateMapSearchClearButton();

    // Reset map view to default bounds if crash data is loaded
    if (crashState.mapPoints && crashState.mapPoints.length > 0) {
        updateMapDisplay();
    }

    console.log('[Map Search] Address search cleared');
}

// Update visibility of the map search clear button
function updateMapSearchClearButton() {
    const searchInput = document.getElementById('mapGlobalSearch');
    const clearBtn = document.getElementById('mapSearchClearBtn');

    if (searchInput && clearBtn) {
        if (searchInput.value.trim().length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }
    }
}

// Find crashes near a point (within radius in meters)
function findCrashesNearPoint(lat, lng, radiusMeters) {
    if (!crashState.mapPoints || crashState.mapPoints.length === 0) {
        return [];
    }

    return crashState.mapPoints.filter(point => {
        const distance = getDistanceMeters(lat, lng, point.lat, point.lng);
        return distance <= radiusMeters;
    });
}

// Calculate distance between two points in meters (Haversine formula)
function getDistanceMeters(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Calculate severity breakdown for nearby crashes
function calculateNearbyCrashSeverity(crashes) {
    let fatal = 0, serious = 0;
    crashes.forEach(c => {
        if (c.sev === 'K') fatal++;
        if (c.sev === 'A') serious++;
    });
    return { fatal, serious, total: crashes.length };
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.map = CL.map || {};
  window.updateMapScopeLabel = updateMapScopeLabel; CL.map.updateMapScopeLabel = updateMapScopeLabel;
  window.searchMapboxAddresses = searchMapboxAddresses; CL.map.searchMapboxAddresses = searchMapboxAddresses;
  window.selectAddressResult = selectAddressResult; CL.map.selectAddressResult = selectAddressResult;
  window.clearMapAddressSearch = clearMapAddressSearch; CL.map.clearMapAddressSearch = clearMapAddressSearch;
  window.updateMapSearchClearButton = updateMapSearchClearButton; CL.map.updateMapSearchClearButton = updateMapSearchClearButton;
  window.findCrashesNearPoint = findCrashesNearPoint; CL.map.findCrashesNearPoint = findCrashesNearPoint;
  window.getDistanceMeters = getDistanceMeters; CL.map.getDistanceMeters = getDistanceMeters;
  window.calculateNearbyCrashSeverity = calculateNearbyCrashSeverity; CL.map.calculateNearbyCrashSeverity = calculateNearbyCrashSeverity;
  CL._registerModule('map/map-layers');
})();
