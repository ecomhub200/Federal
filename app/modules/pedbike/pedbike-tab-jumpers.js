/** CL pedbike.jumpers — extracted (name-anchored) 2026-05-23.
 *  see queue/203-passb-pedbike.md. No behavior change.
 *  Reads inline shared crashState (global classic-script env). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Legacy wrapper functions for backward compatibility
function updatePedLocations() { applyPedFilters(); }
function updateBikeLocations() { applyBikeFilters(); }
function clearPedDateFilter() { resetPedFilters(); }
function clearBikeDateFilter() { resetBikeFilters(); }

// Jump to CMF from Ped/Bike tab
function jumpToCMFFromPedBike(location, type) {
    showTab('cmf');
    setTimeout(() => {
        const routeSelect = document.getElementById('cmfRouteSelect');
        if (routeSelect) {
            routeSelect.value = `route:${location}`;
            if (typeof loadCMFLocationData === 'function') loadCMFLocationData();
        }
    }, 200);
}

function zoomToPedBikeLocation(route, type) {
    // Get crashes for this location filtered by ped or bike
    let crashes;
    let icon;
    let label;

    if (type === 'ped') {
        crashes = crashState.sampleRows.filter(c => c[COL.ROUTE] === route && isYes(c[COL.PED]));
        icon = '🚶';
        label = `Pedestrian Crashes - ${route}`;
    } else if (type === 'bike') {
        crashes = crashState.sampleRows.filter(c => c[COL.ROUTE] === route && isYes(c[COL.BIKE]));
        icon = '🚴';
        label = `Bicycle Crashes - ${route}`;
    } else {
        crashes = crashState.sampleRows.filter(c => c[COL.ROUTE] === route);
        icon = '📍';
        label = route;
    }

    if (crashes.length === 0) {
        alert('No crash data found for this location');
        return;
    }

    // Switch to map tab
    showTab('map');

    // Display crashes on map
    setTimeout(() => {
        filterMapForPedBike(crashes, label, type);
    }, 300);
}

function filterMapForPedBike(crashes, label, type) {
    // Check if map exists
    if (typeof crashMap === 'undefined' || !crashMap) {
        console.log('Map not initialized');
        return;
    }

    // Clear existing markers
    if (typeof markerCluster !== 'undefined' && markerCluster) {
        markerCluster.clearLayers();
    }

    // Color based on type
    const baseColor = type === 'ped' ? '#0891b2' : type === 'bike' ? '#059669' : '#1e40af';

    // Add filtered markers
    const bounds = [];
    crashes.forEach(row => {
        const lat = parseFloat(row[COL.Y]);
        const lng = parseFloat(row[COL.X]);

        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const sev = (row[COL.SEVERITY] || '').charAt(0) || 'O';
            // Use severity colors but with type-specific styling
            const color = { K: '#dc2626', A: '#ea580c', B: '#eab308', C: '#22c55e', O: baseColor }[sev] || baseColor;

            const marker = L.circleMarker([lat, lng], {
                radius: sev === 'K' ? 10 : sev === 'A' ? 8 : 6,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });

            marker.bindPopup(`
                <strong>${type === 'ped' ? '🚶 Pedestrian' : type === 'bike' ? '🚴 Bicycle' : ''} Crash</strong><br>
                Route: ${row[COL.ROUTE] || 'Unknown'}<br>
                Date: ${row[COL.DATE] || 'N/A'}<br>
                Severity: <span class="severity-badge severity-${sev}">${sev}</span><br>
                Collision: ${row[COL.COLLISION] || 'N/A'}
            `);

            if (markerCluster) {
                markerCluster.addLayer(marker);
            }
            bounds.push([lat, lng]);
        }
    });

    // Fit map to bounds
    if (bounds.length > 0) {
        safeFitBounds(crashMap, bounds, { padding: [50, 50], maxZoom: 16 });
    }

    // Show filter badge
    showMapFilterBadge(label, crashes.length);
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.jumpers=CL.pedbike.jumpers||{};
  window.updatePedLocations=updatePedLocations; CL.pedbike.jumpers.updatePedLocations=updatePedLocations;
  window.updateBikeLocations=updateBikeLocations; CL.pedbike.jumpers.updateBikeLocations=updateBikeLocations;
  window.clearPedDateFilter=clearPedDateFilter; CL.pedbike.jumpers.clearPedDateFilter=clearPedDateFilter;
  window.clearBikeDateFilter=clearBikeDateFilter; CL.pedbike.jumpers.clearBikeDateFilter=clearBikeDateFilter;
  window.jumpToCMFFromPedBike=jumpToCMFFromPedBike; CL.pedbike.jumpers.jumpToCMFFromPedBike=jumpToCMFFromPedBike;
  window.zoomToPedBikeLocation=zoomToPedBikeLocation; CL.pedbike.jumpers.zoomToPedBikeLocation=zoomToPedBikeLocation;
  window.filterMapForPedBike=filterMapForPedBike; CL.pedbike.jumpers.filterMapForPedBike=filterMapForPedBike;
  CL._registerModule('pedbike/pedbike-tab-jumpers');
})();
