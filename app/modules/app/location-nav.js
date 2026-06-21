/**
 * CL app.locationNav — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.app.locationNav.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Jump to CMF tab with selected location
function locationJumpToCMF() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    // Ensure CMF database is loaded first
    if (!cmfState.loaded) {
        loadCMFDatabase();
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length} Locations`;

    // Set up CMF state with location selection
    cmfState.selectedLocation = {
        type: mapSelectionMode,
        name: locationName
    };
    cmfState.locationCrashes = crashes;

    // Update the dropdown to show selected location
    const cmfSelect = document.getElementById('cmfLocationSelect');
    let locationOption = cmfSelect.querySelector(`option[value="${mapSelectionMode}:${locationName}"]`);
    if (!locationOption) {
        locationOption = document.createElement('option');
        locationOption.value = `${mapSelectionMode}:${locationName}`;
        locationOption.textContent = `📍 ${locationName} (${crashes.length} crashes)`;
        cmfSelect.insertBefore(locationOption, cmfSelect.firstChild);
    } else {
        locationOption.textContent = `📍 ${locationName} (${crashes.length} crashes)`;
    }
    cmfSelect.value = `${mapSelectionMode}:${locationName}`;

    // Switch to CMF tab
    showTab('cmf');

    // Build and display crash profile after tab switch
    setTimeout(() => {
        extractRoadProperties();
        buildCMFCrashProfile();
        displayCrashProfile();

        // Automatically find countermeasures
        setTimeout(() => {
            if (typeof findCountermeasures === 'function') {
                findCountermeasures();
            }

            // Show notification
            showToast(`✅ ${crashes.length} crashes loaded for ${locationName}. Countermeasures displayed below.`, 'success', 4000);

            // Auto-load asset deficiency data
            syncADFromCMF(true);
        }, 200);
    }, 150);
}

// Jump to MUTCD tab with selected location
function locationJumpToMUTCD() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length} Locations`;

    // Build crash profile from matched rows
    const profile = buildDetailedLocationProfile(crashes);

    // Get road context
    const roadTypes = {};
    crashes.forEach(row => {
        const roadType = row[COL.ROAD_TYPE] || 'Unknown';
        roadTypes[roadType] = (roadTypes[roadType] || 0) + 1;
    });
    const topRoadType = Object.entries(roadTypes).sort((a, b) => b[1] - a[1])[0];

    // Update selection state
    selectionState.crashProfile = profile;

    // Switch to MUTCD AI tab
    showTab('ai');

    // After tab switch, populate the MUTCD assistant with location context
    setTimeout(() => {
        // Build context for MUTCD AI
        const contextParts = [
            `Location: ${locationName}`,
            `Type: ${mapSelectionMode === 'route' ? 'Corridor/Route' : 'Intersection'}`,
            `Total Crashes: ${crashes.length}`,
            `Fatal (K): ${profile.severityDist.K || 0}`,
            `Serious Injury (A): ${profile.severityDist.A || 0}`,
            `Pedestrian Involved: ${profile.pedInvolved || 0}`,
            `Bicycle Involved: ${profile.bikeInvolved || 0}`,
            topRoadType ? `Primary Road Type: ${topRoadType[0]}` : ''
        ];

        // If there's a location context input, populate it
        const mutcdLocationInput = document.getElementById('mutcdLocation');
        if (mutcdLocationInput) {
            mutcdLocationInput.value = locationName;
        }

        // Show notification with context
        showToast(`📖 MUTCD guidance ready for ${locationName} (${crashes.length} crashes)`, 'info', 4000);
    }, 150);
}

// Jump to Grants tab with selected location
function locationJumpToGrants() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length} Locations`;
    const locationType = mapSelectionMode;

    // Calculate statistics from crashes (similar to polygon selection)
    const stats = { total: crashes.length, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, epdo: 0 };
    crashes.forEach(c => {
        const sev = c.sev || '';
        if (stats[sev] !== undefined) stats[sev]++;
        if (c.isPed) stats.ped++;
        if (c.isBike) stats.bike++;
        stats.epdo += EPDO_WEIGHTS[sev] || 0;
    });

    // Calculate grant-specific metrics
    const vru = stats.ped + stats.bike;
    const score = (stats.K * 100) + (stats.A * 50) + (vru * 30) + (stats.epdo / 100);

    // Get best matching grant program
    const bestMatch = getBestMatchProgram(stats);
    const matchingGrants = getMatchingGrants(stats);

    // Format location name for display
    const displayName = locationType === 'route' ? formatRouteName(locationName) : `Node ${locationName}`;

    // Create a location object matching the polygon selection structure
    const locationData = {
        type: locationType,
        name: displayName,
        crashes: stats.total,
        K: stats.K,
        A: stats.A,
        B: stats.B,
        C: stats.C,
        O: stats.O,
        epdo: stats.epdo,
        ped: stats.ped,
        bike: stats.bike,
        vru: vru,
        score: Math.round(score),
        bestMatch: bestMatch,
        matchingGrants: matchingGrants,
        isMapSelection: true
    };

    // Store the selection in grantState
    grantState.mapSelection = locationData;

    // Switch to Grants tab
    showTab('grants');

    // After tab switch, show the map selection analysis panel
    setTimeout(() => {
        // Initialize grants module if needed
        if (!grantState.loaded) initGrantModule();

        // Show map selection analysis panel (same as polygon selection)
        showMapSelectionAnalysis(locationData);

        // Show notification
        const grantNotice = document.createElement('div');
        grantNotice.style.cssText = `
            position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
            background: linear-gradient(135deg,#059669,#10b981); color: white;
            padding: 12px 24px; border-radius: 8px; font-size: 14px; z-index: 2000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: slideDown 0.3s ease;
        `;
        grantNotice.innerHTML = `💰 <strong>${stats.total}</strong> crashes loaded for grant analysis. Best match: <strong>${bestMatch.toUpperCase()}</strong>`;
        document.body.appendChild(grantNotice);
        setTimeout(() => grantNotice.remove(), 4000);
    }, 150);
}

// Jump to Before/After Study tab with selected location
function locationJumpToBAStudy() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length} Locations`;
    const locationType = mapSelectionMode;

    // Navigate to Reports tab and select Before & After study sub-tab
    showTab('reports');
    showReportSubTab('beforeafter');

    // After tab switch, populate the B/A study dropdown and load location
    setTimeout(() => {
        // Initialize the location dropdown
        initBALocationDropdown();

        // Set the dropdown to the selected route or node
        const dropdownValue = `${locationType}:${locationName}`;
        const baSelect = document.getElementById('baLocationSelect');

        if (baSelect) {
            // Check if the option exists, if not it should be in the dropdown after init
            baSelect.value = dropdownValue;

            // Load the location data
            loadBALocation();

            // Format display name for notification
            const displayName = locationType === 'route' ? formatRouteName(locationName) : `Node ${locationName}`;

            // Update status message
            const statusEl = document.getElementById('baMapSelectionStatus');
            if (statusEl) {
                statusEl.textContent = `✓ ${crashes.length} crashes loaded for ${displayName}`;
            }

            showToast(`📈 Before/After Study ready for ${displayName} (${crashes.length} crashes)`, 'info', 4000);
        }
    }, 100);
}

// Analyze crash patterns for selected location
function locationAnalyze() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length} Locations`;

    // Build comprehensive crash profile
    const profile = buildDetailedLocationProfile(crashes);

    // Build analysis HTML
    const html = `
        <div style="padding:1rem">
            <h4 style="margin-bottom:1rem;color:var(--primary)">📊 Crash Analysis: ${locationName}</h4>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:1.5rem">
                <div class="analysis-card" style="background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;padding:1rem;border-radius:8px;text-align:center">
                    <div style="font-size:2rem;font-weight:700">${crashes.length}</div>
                    <div style="font-size:.85rem;opacity:.9">Total Crashes</div>
                </div>
                <div class="analysis-card" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;padding:1rem;border-radius:8px;text-align:center">
                    <div style="font-size:2rem;font-weight:700">${profile.severityDist.K || 0}</div>
                    <div style="font-size:.85rem;opacity:.9">Fatal (K)</div>
                </div>
                <div class="analysis-card" style="background:linear-gradient(135deg,#ea580c,#f97316);color:white;padding:1rem;border-radius:8px;text-align:center">
                    <div style="font-size:2rem;font-weight:700">${(profile.severityDist.K || 0) + (profile.severityDist.A || 0)}</div>
                    <div style="font-size:.85rem;opacity:.9">K+A Serious</div>
                </div>
                <div class="analysis-card" style="background:linear-gradient(135deg,#7c3aed,#a855f7);color:white;padding:1rem;border-radius:8px;text-align:center">
                    <div style="font-size:2rem;font-weight:700">${profile.epdo || 0}</div>
                    <div style="font-size:.85rem;opacity:.9">EPDO Score</div>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem">
                <div style="background:var(--gray-light);padding:1rem;border-radius:8px">
                    <h5 style="margin-bottom:.75rem;font-size:.9rem">🚗 Collision Types</h5>
                    ${Object.entries(profile.collisionTypes || {}).slice(0, 5).map(([type, count]) =>
                        `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:.25rem 0;border-bottom:1px solid #e5e7eb">
                            <span>${type}</span><strong>${count}</strong>
                        </div>`
                    ).join('') || '<div style="font-size:.85rem;color:var(--gray)">No data</div>'}
                </div>
                <div style="background:var(--gray-light);padding:1rem;border-radius:8px">
                    <h5 style="margin-bottom:.75rem;font-size:.9rem">🧩 Contributing Factors</h5>
                    ${Object.entries(profile.contributingFactors || {}).slice(0, 5).map(([factor, count]) =>
                        `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:.25rem 0;border-bottom:1px solid #e5e7eb">
                            <span>${factor}</span><strong>${count}</strong>
                        </div>`
                    ).join('') || '<div style="font-size:.85rem;color:var(--gray)">No data</div>'}
                </div>
                <div style="background:var(--gray-light);padding:1rem;border-radius:8px">
                    <h5 style="margin-bottom:.75rem;font-size:.9rem">🌤️ Weather Conditions</h5>
                    ${Object.entries(profile.weatherDist || {}).slice(0, 5).map(([weather, count]) =>
                        `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:.25rem 0;border-bottom:1px solid #e5e7eb">
                            <span>${weather}</span><strong>${count}</strong>
                        </div>`
                    ).join('') || '<div style="font-size:.85rem;color:var(--gray)">No data</div>'}
                </div>
                <div style="background:var(--gray-light);padding:1rem;border-radius:8px">
                    <h5 style="margin-bottom:.75rem;font-size:.9rem">💡 Light Conditions</h5>
                    ${Object.entries(profile.lightDist || {}).slice(0, 5).map(([light, count]) =>
                        `<div style="display:flex;justify-content:space-between;font-size:.85rem;padding:.25rem 0;border-bottom:1px solid #e5e7eb">
                            <span>${light}</span><strong>${count}</strong>
                        </div>`
                    ).join('') || '<div style="font-size:.85rem;color:var(--gray)">No data</div>'}
                </div>
            </div>

        </div>
    `;

    // Display in the drawing analysis modal (reuse existing modal)
    document.getElementById('drawingAnalysisBody').innerHTML = html;
    document.getElementById('drawingAnalysisModal').classList.add('visible');
}

// Export PDF report for selected location
// Uses the same PDF format as polygon selection (exportSelectionPDF)
function locationExportPDF() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    // Convert selectionState.crashes (raw rows) to map point format
    // This matches the format of selectedCrashesFromDrawing
    const crashes = selectionState.crashes.map(row => ({
        lat: parseFloat(row[COL.Y]) || 0,
        lng: parseFloat(row[COL.X]) || 0,
        sev: (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0),
        route: row[COL.ROUTE] || 'Unknown',
        node: row[COL.NODE] || '',
        collision: row[COL.COLLISION] || '',
        date: row[COL.DATE],
        time: row[COL.TIME],
        isPed: row[COL.PED] === '1' || row[COL.PED] === 'Y' || row[COL.PED] === 'y' || row[COL.PED] === 'Yes' || row[COL.PED] === 'yes',
        isBike: row[COL.BIKE] === '1' || row[COL.BIKE] === 'Y' || row[COL.BIKE] === 'y' || row[COL.BIKE] === 'Yes' || row[COL.BIKE] === 'yes',
        weather: row[COL.WEATHER] || '',
        light: row[COL.LIGHT] || ''
    })).filter(p => p.lat && p.lng);

    if (crashes.length === 0) {
        showToast('No valid crash data for PDF export', 'warning');
        return;
    }

    // Get PDF data using shared function with location name
    let locationName;
    if (selectedMapLocations.length === 1) {
        locationName = mapSelectionMode === 'route' ? formatRouteName(selectedMapLocations[0]) : `Node ${selectedMapLocations[0]}`;
    } else {
        locationName = `${selectedMapLocations.length} Selected Locations`;
    }
    const data = getSelectionPDFData(crashes, locationName);
    if (!data) {
        showToast('Failed to prepare PDF data', 'error');
        return;
    }

    // Prompt user for location name (same as polygon selection)
    const finalLocationName = prompt(
        'Enter a location name for this report:\n\n' +
        '(Suggested: ' + data.suggestedLocation + ')',
        data.suggestedLocation
    );

    // User cancelled
    if (finalLocationName === null) return;

    // Use entered name or default
    data.locationName = finalLocationName.trim() || locationName;

    // Generate PDF using same format as polygon selection
    generateCrashSelectionPDF(data);
}

// Export crash data for selected location
function locationExport() {
    if (selectedMapLocations.length === 0 || !selectionState.crashes || selectionState.crashes.length === 0) {
        showToast('Please select a location first', 'warning');
        return;
    }

    const crashes = selectionState.crashes;
    const locationName = selectedMapLocations.length === 1
        ? selectedMapLocations[0]
        : `${selectedMapLocations.length}_Locations`;

    // Build CSV content
    const headers = ['Date', 'Time', 'Route', 'Severity', 'Collision Type', 'Weather', 'Light', 'Pedestrian', 'Bicycle', 'Latitude', 'Longitude'];
    const rows = crashes.map(row => [
        row[COL.DATE] || '',
        row[COL.TIME] || '',
        row[COL.ROUTE] || '',
        row[COL.SEVERITY] || '',
        row[COL.COLLISION] || '',
        row[COL.WEATHER] || '',
        row[COL.LIGHT] || '',
        row[COL.PED] || '',
        row[COL.BIKE] || '',
        row[COL.Y] || '',
        row[COL.X] || ''
    ]);

    const csvContent = [headers, ...rows].map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `crashes_${locationName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast(`📥 Exported ${crashes.length} crashes for ${locationName}`, 'success');
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.app = CL.app || {};
  CL.app.locationNav = CL.app.locationNav || {};
  window.locationJumpToCMF = locationJumpToCMF; CL.app.locationNav.locationJumpToCMF = locationJumpToCMF;
  window.locationJumpToMUTCD = locationJumpToMUTCD; CL.app.locationNav.locationJumpToMUTCD = locationJumpToMUTCD;
  window.locationJumpToGrants = locationJumpToGrants; CL.app.locationNav.locationJumpToGrants = locationJumpToGrants;
  window.locationJumpToBAStudy = locationJumpToBAStudy; CL.app.locationNav.locationJumpToBAStudy = locationJumpToBAStudy;
  window.locationAnalyze = locationAnalyze; CL.app.locationNav.locationAnalyze = locationAnalyze;
  window.locationExportPDF = locationExportPDF; CL.app.locationNav.locationExportPDF = locationExportPDF;
  window.locationExport = locationExport; CL.app.locationNav.locationExport = locationExport;
  CL._registerModule('app/location-nav');
})();
