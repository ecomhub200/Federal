/**
 * CL reports.ba — BA mode/location-dropdown/map-selection setup
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
// Switch between Single Location and Batch Evaluation modes
function switchBAMode(mode) {
    var singleSection = document.getElementById('baSingleSection');
    var batchSection = document.getElementById('baBatchSection');
    var btnSingle = document.getElementById('baModeBtn-single');
    var btnBatch = document.getElementById('baModeBtn-batch');

    if (mode === 'batch') {
        if (singleSection) singleSection.style.display = 'none';
        if (batchSection) batchSection.style.display = 'block';
        if (btnSingle) { btnSingle.classList.remove('active', 'algo'); }
        if (btnBatch) { btnBatch.classList.add('active', 'algo'); }
        if (CL.batchBA) CL.batchBA.state.mode = 'batch';
    } else {
        if (singleSection) singleSection.style.display = 'block';
        if (batchSection) batchSection.style.display = 'none';
        if (btnSingle) { btnSingle.classList.add('active', 'algo'); }
        if (btnBatch) { btnBatch.classList.remove('active', 'algo'); }
        if (CL.batchBA) CL.batchBA.state.mode = 'single';
    }
}

// Set the batch BA subcategory: 'all' = every crash, 'streetlight' = dark-only
function setBatchBAAnalysisType(type) {
    if (CL.batchBA && CL.batchBA.setAnalysisType) {
        CL.batchBA.setAnalysisType(type);
    }
}

// Initialize BA location dropdown using universal location format
function initBALocationDropdown() {
    // Initialize location type selector if not already done
    const typeSelector = document.getElementById('baLocationTypeSelector');
    if (typeSelector && !typeSelector.hasChildNodes()) {
        createLocationTypeSelector('baLocationTypeSelector', 'baLocationType', 'updateBALocationDropdown()', 'all');
    }

    updateBALocationDropdown();
}

// Update BA location dropdown based on selected type
function updateBALocationDropdown() {
    const select = document.getElementById('baLocationSelect');
    if (!select) return;

    const locationType = getSelectedLocationType('baLocationType');
    const lpType = locationType === 'all' ? null : locationType;

    // Round 13 — Supabase-backed picker. Map-selection option is appended in
    // the onPopulated callback so the LocationPicker's repaint doesn't wipe it.
    if (window.LocationPicker && window.crashLensClient && window.crashLensClient.preferSupabase) {
        window.LocationPicker.register('baLocationSelect', {
            placeholder: '-- Select a route or intersection --',
            locationType: lpType,
            useOptgroups: lpType === null,
            showCrashCount: true,
            segmentLabel: '🛣️ Road Segments (sorted by crashes)',
            intersectionLabel: '🚦 Intersections (sorted by crashes)',
            onPopulated: function () {
                if (typeof selectedCrashesFromDrawing !== 'undefined' &&
                    selectedCrashesFromDrawing && selectedCrashesFromDrawing.length > 0) {
                    var mapOpt = document.createElement('option');
                    mapOpt.value = 'map:selection';
                    mapOpt.textContent = '🗺️ Map Selection (' + selectedCrashesFromDrawing.length + ' crashes)';
                    select.appendChild(mapOpt);
                }
            }
        });
        return;
    }

    populateLocationDropdown('baLocationSelect', {
        placeholder: '-- Select a route or intersection --',
        locationType: locationType,
        useOptgroups: locationType === 'all',
        showCrashCount: true,
        segmentLabel: '🛣️ Road Segments (sorted by crashes)',
        intersectionLabel: '🚦 Intersections (sorted by crashes)'
    });

    if (selectedCrashesFromDrawing && selectedCrashesFromDrawing.length > 0) {
        const mapOpt = document.createElement('option');
        mapOpt.value = 'map:selection';
        mapOpt.textContent = `🗺️ Map Selection (${selectedCrashesFromDrawing.length} crashes)`;
        select.appendChild(mapOpt);
    }
}


// Filter BA locations based on search text (similar to CMF search)
function filterBALocations(searchText) {
    const resultsDiv = document.getElementById('baSearchResults');

    if (!searchText || searchText.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const search = searchText.toLowerCase();
    let results = [];

    // Search routes
    if (cmfState.routeData) {
        cmfState.routeData.forEach(route => {
            if (route.name.toLowerCase().includes(search)) {
                results.push({
                    type: 'route',
                    value: route.name,
                    display: formatRouteName(route.name),
                    crashes: route.crashes,
                    details: `${route.funcClass || ''} • ${route.areaType || ''}`
                });
            }
        });
    }

    // Search nodes (by route names they contain)
    if (cmfState.nodeData) {
        cmfState.nodeData.forEach(node => {
            const routeNames = Array.from(node.routes).join(' ');
            if (routeNames.toLowerCase().includes(search)) {
                results.push({
                    type: 'node',
                    value: node.id,
                    display: `Node ${formatNodeId(node.id)}`,
                    crashes: node.crashes,
                    details: Array.from(node.routes).slice(0, 2).map(r => formatRouteName(r)).join(' & ')
                });
            }
        });
    }

    // Sort by crashes and limit
    results = results.sort((a, b) => b.crashes - a.crashes).slice(0, 15);

    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:.75rem;color:var(--gray);font-size:.85rem">No matching locations found</div>';
    } else {
        resultsDiv.innerHTML = results.map(r => `
            <div style="padding:.6rem .75rem;border-bottom:1px solid var(--gray-light);cursor:pointer;transition:background .2s"
                 onmouseover="this.style.background='var(--light)'"
                 onmouseout="this.style.background='white'"
                 onclick="selectBASearchResult('${r.type}', '${r.value}')">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span style="font-weight:600;color:var(--primary)">${r.display}</span>
                    <span style="font-size:.75rem;color:var(--gray)">${r.crashes} crashes</span>
                </div>
                <div style="font-size:.75rem;color:var(--gray)">${r.details}</div>
            </div>
        `).join('');
    }

    resultsDiv.style.display = 'block';
}

// Handle keypress in BA search box
function handleBASearchKeypress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        triggerBASearch();
    }
}

// Trigger BA search - auto-select top result
function triggerBASearch() {
    const searchInput = document.getElementById('baRoadSearch');
    const searchText = searchInput.value.trim();

    if (!searchText) {
        if (baState.selectedLocation) {
            return; // Location already selected
        }
        showToast('Please enter a road name to search', 'warning');
        return;
    }

    // Find the top matching result
    const search = searchText.toLowerCase();
    let topResult = null;

    // Search routes first
    if (cmfState.routeData) {
        const matchingRoute = cmfState.routeData.find(r => r.name.toLowerCase().includes(search));
        if (matchingRoute) {
            topResult = { type: 'route', value: matchingRoute.name };
        }
    }

    // If no route found, search nodes
    if (!topResult && cmfState.nodeData) {
        const matchingNode = cmfState.nodeData.find(n =>
            Array.from(n.routes).join(' ').toLowerCase().includes(search)
        );
        if (matchingNode) {
            topResult = { type: 'node', value: matchingNode.id };
        }
    }

    if (topResult) {
        selectBASearchResult(topResult.type, topResult.value);
        document.getElementById('baSearchResults').style.display = 'none';
    } else {
        showToast('No matching location found', 'warning');
    }
}

// Select a BA search result
function selectBASearchResult(type, value) {
    // Update the dropdown to match selection
    const select = document.getElementById('baLocationSelect');
    const optionValue = `${type}:${value}`;

    // Check if option exists
    let optionExists = false;
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value === optionValue) {
            select.value = optionValue;
            optionExists = true;
            break;
        }
    }

    if (!optionExists) {
        // Add the option if it doesn't exist
        const displayName = type === 'route' ? formatRouteName(value) : `Node ${value}`;
        const option = new Option(displayName, optionValue);
        select.add(option);
        select.value = optionValue;
    }

    // Clear search and hide results
    document.getElementById('baRoadSearch').value = '';
    document.getElementById('baSearchResults').style.display = 'none';

    // Load the location
    loadBALocation();
}

// Load location for BA study
function loadBALocation() {
    const selectValue = document.getElementById('baLocationSelect').value;
    if (!selectValue) {
        document.getElementById('baLocationSummary').style.display = 'none';
        baState.selectedLocation = null;
        baState.locationCrashes = [];
        baState.locationStats = null;
        return;
    }

    const [type, value] = selectValue.split(':');
    let crashes = [];
    let locationName = '';
    let stats = null;

    if (type === 'node') {
        // Use aggregates for accurate stats
        stats = crashState.aggregates.byNode[value] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        // Use mapPoints for crash data (NOTE: only contains crashes with valid coordinates)
        crashes = crashState.mapPoints.filter(p => p.node === value);
        locationName = `Node ${value}`;
        baState.selectedLocation = { type: 'node', value };
    } else if (type === 'route') {
        // Use aggregates for accurate stats
        stats = crashState.aggregates.byRoute[value] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        // Use mapPoints for crash data (NOTE: only contains crashes with valid coordinates)
        crashes = crashState.mapPoints.filter(p => p.route === value);
        locationName = formatRouteName(value);
        baState.selectedLocation = { type: 'route', value };
    } else if (type === 'map') {
        crashes = getMatchedCrashesFromMapSelection();
        stats = computeStatsFromMapPoints(crashes);
        locationName = `Map Selection`;
        baState.selectedLocation = { type: 'map', value: 'selection' };
    }

    baState.locationCrashes = crashes;
    baState.locationName = locationName;
    baState.locationStats = stats;

    // Update summary display with accurate stats
    updateBALocationSummary(stats, crashes.length, locationName);

    // Sync monitoring panel location display
    updateBAMonitoringLocationDisplay();
}

// Get matched crashes from map selection (uses mapPoints for accuracy)
function getMatchedCrashesFromMapSelection() {
    if (!selectedCrashesFromDrawing || selectedCrashesFromDrawing.length === 0) return [];
    // selectedCrashesFromDrawing already contains mapPoints data from polygon/circle selection
    return selectedCrashesFromDrawing;
}

// Compute stats from mapPoints array
function computeStatsFromMapPoints(crashes) {
    const stats = { total: crashes.length, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
    crashes.forEach(c => {
        const s = (c.sev || '').charAt(0).toUpperCase();
        if (stats[s] !== undefined) stats[s]++;
        if (c.isPed) stats.ped++;
        if (c.isBike) stats.bike++;
    });
    return stats;
}

// Update BA location summary display (uses pre-computed stats from aggregates for accuracy)
function updateBALocationSummary(stats, crashCount, locationName) {
    const summary = document.getElementById('baLocationSummary');

    // Use stats from aggregates (accurate) with crashCount from mapPoints
    const total = stats.total || crashCount || 0;
    const K = stats.K || 0;
    const A = stats.A || 0;
    const B = stats.B || 0;
    const C = stats.C || 0;
    const O = stats.O || 0;

    document.getElementById('baLocationName').textContent = locationName;
    document.getElementById('baLocationCrashCount').textContent = `${total} crashes available`;

    document.getElementById('baLocationKPIs').innerHTML = `
        <div class="kpi-card" style="background:linear-gradient(135deg,#1e40af,#3b82f6);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${total}</div>
            <div style="font-size:.65rem">Total</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#dc2626,#ef4444);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${K}</div>
            <div style="font-size:.65rem">Fatal</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#ea580c,#f97316);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${A}</div>
            <div style="font-size:.65rem">Injury-A</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#ca8a04,#eab308);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${B + C}</div>
            <div style="font-size:.65rem">Injury-BC</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#4b5563,#6b7280);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${O}</div>
            <div style="font-size:.65rem">PDO</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#7c3aed,#8b5cf6);color:white;padding:.5rem;border-radius:var(--radius);text-align:center">
            <div style="font-size:1.1rem;font-weight:700">${calcEPDO({K, A, B, C, O})}</div>
            <div style="font-size:.65rem">EPDO</div>
        </div>
    `;

    summary.style.display = 'block';
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.switchBAMode = switchBAMode; CL.reports.ba.switchBAMode = switchBAMode;
  window.setBatchBAAnalysisType = setBatchBAAnalysisType; CL.reports.ba.setBatchBAAnalysisType = setBatchBAAnalysisType;
  window.initBALocationDropdown = initBALocationDropdown; CL.reports.ba.initBALocationDropdown = initBALocationDropdown;
  window.updateBALocationDropdown = updateBALocationDropdown; CL.reports.ba.updateBALocationDropdown = updateBALocationDropdown;
  window.filterBALocations = filterBALocations; CL.reports.ba.filterBALocations = filterBALocations;
  window.handleBASearchKeypress = handleBASearchKeypress; CL.reports.ba.handleBASearchKeypress = handleBASearchKeypress;
  window.triggerBASearch = triggerBASearch; CL.reports.ba.triggerBASearch = triggerBASearch;
  window.selectBASearchResult = selectBASearchResult; CL.reports.ba.selectBASearchResult = selectBASearchResult;
  window.loadBALocation = loadBALocation; CL.reports.ba.loadBALocation = loadBALocation;
  window.getMatchedCrashesFromMapSelection = getMatchedCrashesFromMapSelection; CL.reports.ba.getMatchedCrashesFromMapSelection = getMatchedCrashesFromMapSelection;
  window.computeStatsFromMapPoints = computeStatsFromMapPoints; CL.reports.ba.computeStatsFromMapPoints = computeStatsFromMapPoints;
  window.updateBALocationSummary = updateBALocationSummary; CL.reports.ba.updateBALocationSummary = updateBALocationSummary;
  CL._registerModule('reports/report-ba-setup');
})();
