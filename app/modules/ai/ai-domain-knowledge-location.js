/**
 * CL ai.domainKnowledge (location) — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — location.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L74334-L74709) ───
// Populate location dropdown (similar to CMF tab)
function populateDKLocationDropdown() {
    updateDKLocationDropdown();
}

// Update location dropdown based on location type filter
function updateDKLocationDropdown() {
    const select = document.getElementById('dkLocationSelect');
    if (!select) return;

    const locationType = getSelectedLocationType('dkLocationType');
    const lpType = locationType === 'all' ? null : locationType;

    // Round 13 — Supabase-backed, state-agnostic. Drops the
    // crashState.aggregates gate so the dropdown populates at rolled-up
    // tiers (county/MPO/PD) without needing an R2 hydrate.
    if (window.LocationPicker && window.crashLensClient && window.crashLensClient.preferSupabase) {
        window.LocationPicker.register('dkLocationSelect', {
            placeholder: '-- Select a route or intersection --',
            locationType: lpType,
            useOptgroups: lpType === null,
            showCrashCount: true
        });
        return;
    }

    // Legacy R2-aggregate path
    if (!crashState.aggregates) return;
    select.innerHTML = '<option value="">-- Select a route or intersection --</option>';

    if ((locationType === 'all' || locationType === 'segment') && crashState.aggregates.byRoute) {
        const routes = Object.keys(crashState.aggregates.byRoute).sort();
        if (routes.length > 0) {
            const routeGroup = document.createElement('optgroup');
            routeGroup.label = '🛣️ Road Segments';
            routes.forEach(route => {
                const opt = document.createElement('option');
                opt.value = `route:${route}`;
                const data = crashState.aggregates.byRoute[route];
                opt.textContent = `${route} (${data.total} crashes)`;
                routeGroup.appendChild(opt);
            });
            select.appendChild(routeGroup);
        }
    }

    if ((locationType === 'all' || locationType === 'intersection') && crashState.aggregates.byIntersection) {
        const intersections = Object.keys(crashState.aggregates.byIntersection).sort();
        if (intersections.length > 0) {
            const intGroup = document.createElement('optgroup');
            intGroup.label = '🚦 Intersections';
            intersections.slice(0, 100).forEach(int => {
                const opt = document.createElement('option');
                opt.value = `intersection:${int}`;
                const data = crashState.aggregates.byIntersection[int];
                opt.textContent = `${int} (${data.total} crashes)`;
                intGroup.appendChild(opt);
            });
            select.appendChild(intGroup);
        }
    }
}

// Filter locations based on search input (respects location type filter)
function filterDKLocations(query) {
    const resultsDiv = document.getElementById('dkSearchResults');
    if (!query || query.length < 2) {
        resultsDiv.style.display = 'none';
        return;
    }

    const lowerQuery = query.toLowerCase();
    const locationType = getSelectedLocationType('dkLocationType');
    const matches = [];

    // Search routes (segments) - if showing all or segments
    if ((locationType === 'all' || locationType === 'segment') && crashState.aggregates?.byRoute) {
        Object.keys(crashState.aggregates.byRoute).forEach(route => {
            if (route.toLowerCase().includes(lowerQuery)) {
                matches.push({
                    type: 'route',
                    name: route,
                    data: crashState.aggregates.byRoute[route]
                });
            }
        });
    }

    // Search intersections - if showing all or intersections
    if ((locationType === 'all' || locationType === 'intersection') && crashState.aggregates?.byIntersection) {
        Object.keys(crashState.aggregates.byIntersection).forEach(int => {
            if (int.toLowerCase().includes(lowerQuery)) {
                matches.push({
                    type: 'intersection',
                    name: int,
                    data: crashState.aggregates.byIntersection[int]
                });
            }
        });
    }

    // Display results
    if (matches.length === 0) {
        resultsDiv.innerHTML = '<div style="padding:.5rem;color:#6b7280">No matches found</div>';
    } else {
        resultsDiv.innerHTML = matches.slice(0, 20).map(m => `
            <div class="search-result-item" style="padding:.5rem;cursor:pointer;border-bottom:1px solid #eee"
                 onclick="selectDKSearchResult('${m.type}', '${m.name.replace(/'/g, "\\'")}')">
                <span style="font-weight:500">${m.type === 'route' ? '🛣️' : '🚦'} ${m.name}</span>
                <span style="color:#6b7280;font-size:.8rem;margin-left:.5rem">(${m.data.total} crashes)</span>
            </div>
        `).join('');
    }

    resultsDiv.style.display = 'block';
}

// Handle search keypress
function handleDKSearchKeypress(event) {
    if (event.key === 'Enter') {
        triggerDKSearch();
    }
}

// Trigger search
function triggerDKSearch() {
    const query = document.getElementById('dkRoadSearch').value;
    filterDKLocations(query);
}

// Select search result
function selectDKSearchResult(type, name) {
    document.getElementById('dkSearchResults').style.display = 'none';
    document.getElementById('dkRoadSearch').value = name;

    // Set dropdown value
    const select = document.getElementById('dkLocationSelect');
    select.value = `${type}:${name}`;

    // Load location
    loadDKLocation();
}

// Load selected location
function loadDKLocation() {
    const select = document.getElementById('dkLocationSelect');
    const value = select.value;

    if (!value) {
        document.getElementById('dkCrashProfile').style.display = 'none';
        dkState.selectedLocation = null;
        dkState.locationCrashes = [];
        dkState.filteredCrashes = [];
        dkState.crashProfile = null;
        return;
    }

    const [type, name] = value.split(':');
    dkState.selectedLocation = { type, name, key: value };

    // Get crashes for this location
    loadDKCrashes(type, name);

    // Update UI
    document.getElementById('dkLocationNameDisplay').textContent = name;
    document.getElementById('dkCrashProfile').style.display = 'block';

    // Load street view
    loadDKStreetView();

    console.log('[DK] Location loaded:', name);
}

// Load crashes for location
function loadDKCrashes(type, name) {
    if (!crashState.sampleRows || crashState.sampleRows.length === 0) {
        dkState.locationCrashes = [];
        dkState.filteredCrashes = [];
        return;
    }

    // Filter crashes based on location type
    if (type === 'route') {
        dkState.locationCrashes = crashState.sampleRows.filter(row =>
            row[COL.ROUTE] === name
        );
    } else if (type === 'intersection') {
        dkState.locationCrashes = crashState.sampleRows.filter(row =>
            row[COL.ROUTE] === name || (row[COL.NODE] && row[COL.NODE].toString().includes(name))
        );
    } else {
        dkState.locationCrashes = [];
    }

    // Apply date filter
    applyDKDateFilterInternal();

    // Build crash profile
    buildDKCrashProfile();
}

// Apply date filter
function applyDKDateFilter() {
    const startDate = document.getElementById('dkStartDate').value;
    const endDate = document.getElementById('dkEndDate').value;

    dkState.dateRange.start = startDate || null;
    dkState.dateRange.end = endDate || null;

    applyDKDateFilterInternal();
    buildDKCrashProfile();
    updateDKDateFilterStatus();
}

// Apply date preset (1yr, 3yr, 5yr)
function applyDKDatePreset(years) {
    const maxDate = getMaxCrashDate();
    const endDate = new Date(maxDate);
    endDate.setHours(0, 0, 0, 0);

    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - years);
    startDate.setDate(startDate.getDate() + 1);

    const formatDate = (d) => d.toISOString().split('T')[0];

    document.getElementById('dkStartDate').value = formatDate(startDate);
    document.getElementById('dkEndDate').value = formatDate(endDate);

    dkState.dateRange.start = formatDate(startDate);
    dkState.dateRange.end = formatDate(endDate);
    dkState.dateRange.preset = years + 'yr';

    // Update button states
    document.querySelectorAll('.dk-date-preset').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    applyDKDateFilterInternal();
    buildDKCrashProfile();
    updateDKDateFilterStatus();
}

// Clear date filter for DK tab (show all data)
function clearDKDateFilter() {
    document.getElementById('dkStartDate').value = '';
    document.getElementById('dkEndDate').value = '';

    dkState.dateRange.start = null;
    dkState.dateRange.end = null;
    dkState.dateRange.preset = null;

    // Update button states
    document.querySelectorAll('.dk-date-preset').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    applyDKDateFilterInternal();
    buildDKCrashProfile();
    updateDKDateFilterStatus();
}

// Update date filter status display
function updateDKDateFilterStatus() {
    const statusEl = document.getElementById('dkDateFilterStatus');
    if (!statusEl) return;

    if (dkState.dateRange.start && dkState.dateRange.end) {
        const crashes = dkState.filteredCrashes?.length || 0;
        statusEl.innerHTML = `📊 ${crashes.toLocaleString()} crashes in range`;
    } else {
        const crashes = dkState.locationCrashes?.length || 0;
        statusEl.innerHTML = crashes > 0 ? `📊 ${crashes.toLocaleString()} total crashes` : '';
    }
}

// Internal date filter
function applyDKDateFilterInternal() {
    if (!dkState.dateRange.start && !dkState.dateRange.end) {
        dkState.filteredCrashes = [...dkState.locationCrashes];
        return;
    }

    dkState.filteredCrashes = dkState.locationCrashes.filter(row => {
        const crashDate = row[COL.DATE];
        if (!crashDate) return true;

        const date = new Date(crashDate);
        if (dkState.dateRange.start && date < new Date(dkState.dateRange.start)) return false;
        if (dkState.dateRange.end && date > new Date(dkState.dateRange.end)) return false;
        return true;
    });
}

// Build crash profile for display
function buildDKCrashProfile() {
    const crashes = dkState.filteredCrashes;
    if (!crashes || crashes.length === 0) {
        dkState.crashProfile = null;
        document.getElementById('dkCrashKPIs').innerHTML = '<p style="color:#6b7280">No crashes found</p>';
        document.getElementById('dkCrashTypes').innerHTML = '';
        document.getElementById('dkContribFactors').innerHTML = '';
        return;
    }

    // Calculate statistics
    const total = crashes.length;
    const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    const collisionTypes = {};
    const factors = { ped: 0, bike: 0, night: 0, wet: 0, speed: 0 };

    crashes.forEach(row => {
        const sev = row[COL.SEVERITY] || 'O';
        severity[sev] = (severity[sev] || 0) + 1;

        const collision = row[COL.COLLISION] || 'Unknown';
        collisionTypes[collision] = (collisionTypes[collision] || 0) + 1;

        if (row[COL.PED] === 'Y' || row[COL.PED] === 1) factors.ped++;
        if (row[COL.BIKE] === 'Y' || row[COL.BIKE] === 1) factors.bike++;
        if (row[COL.LIGHT] && row[COL.LIGHT].toLowerCase().includes('dark')) factors.night++;
        if (row[COL.WEATHER] && row[COL.WEATHER].toLowerCase().includes('rain')) factors.wet++;
    });

    // Calculate EPDO
    const epdo = calcEPDO(severity);

    dkState.crashProfile = {
        total,
        severity,
        epdo,
        collisionTypes,
        factors,
        pedPercent: (factors.ped / total * 100).toFixed(1),
        bikePercent: (factors.bike / total * 100).toFixed(1),
        nightPercent: (factors.night / total * 100).toFixed(1)
    };

    // Update KPIs
    document.getElementById('dkCrashKPIs').innerHTML = `
        <div class="kpi-card" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe)">
            <div class="kpi-value" style="color:#1e40af">${total}</div>
            <div class="kpi-label">Total Crashes</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#fee2e2,#fecaca)">
            <div class="kpi-value" style="color:#991b1b">K:${severity.K} A:${severity.A}</div>
            <div class="kpi-label">Serious Injury</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#fef3c7,#fde68a)">
            <div class="kpi-value" style="color:#92400e">B:${severity.B} C:${severity.C}</div>
            <div class="kpi-label">Minor Injury</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#d1fae5,#a7f3d0)">
            <div class="kpi-value" style="color:#065f46">${severity.O}</div>
            <div class="kpi-label">PDO</div>
        </div>
        <div class="kpi-card" style="background:linear-gradient(135deg,#e0e7ff,#c7d2fe)">
            <div class="kpi-value" style="color:#3730a3">${epdo.toLocaleString()}</div>
            <div class="kpi-label">EPDO</div>
        </div>
    `;

    // Update crash types
    const sortedTypes = Object.entries(collisionTypes).sort((a, b) => b[1] - a[1]);
    document.getElementById('dkCrashTypes').innerHTML = sortedTypes.slice(0, 5).map(([type, count]) => {
        const pct = (count / total * 100).toFixed(0);
        return `<span class="badge" style="background:#e0e7ff;color:#3730a3">${type}: ${count} (${pct}%)</span>`;
    }).join('');

    // Update contributing factors
    const factorBadges = [];
    if (factors.ped > 0) factorBadges.push(`<span class="badge" style="background:#fee2e2;color:#991b1b">🚶 Ped: ${factors.ped}</span>`);
    if (factors.bike > 0) factorBadges.push(`<span class="badge" style="background:#dbeafe;color:#1e40af">🚴 Bike: ${factors.bike}</span>`);
    if (factors.night > 0) factorBadges.push(`<span class="badge" style="background:#1f2937;color:#f9fafb">🌙 Night: ${factors.night}</span>`);
    if (factors.wet > 0) factorBadges.push(`<span class="badge" style="background:#dbeafe;color:#1e40af">🌧️ Wet: ${factors.wet}</span>`);
    document.getElementById('dkContribFactors').innerHTML = factorBadges.join('') || '<span style="color:#9ca3af">None significant</span>';
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  window.populateDKLocationDropdown = populateDKLocationDropdown; CL.ai.domainKnowledge.populateDKLocationDropdown = populateDKLocationDropdown;
  window.updateDKLocationDropdown = updateDKLocationDropdown; CL.ai.domainKnowledge.updateDKLocationDropdown = updateDKLocationDropdown;
  window.filterDKLocations = filterDKLocations; CL.ai.domainKnowledge.filterDKLocations = filterDKLocations;
  window.handleDKSearchKeypress = handleDKSearchKeypress; CL.ai.domainKnowledge.handleDKSearchKeypress = handleDKSearchKeypress;
  window.triggerDKSearch = triggerDKSearch; CL.ai.domainKnowledge.triggerDKSearch = triggerDKSearch;
  window.selectDKSearchResult = selectDKSearchResult; CL.ai.domainKnowledge.selectDKSearchResult = selectDKSearchResult;
  window.loadDKLocation = loadDKLocation; CL.ai.domainKnowledge.loadDKLocation = loadDKLocation;
  window.loadDKCrashes = loadDKCrashes; CL.ai.domainKnowledge.loadDKCrashes = loadDKCrashes;
  window.applyDKDateFilter = applyDKDateFilter; CL.ai.domainKnowledge.applyDKDateFilter = applyDKDateFilter;
  window.applyDKDatePreset = applyDKDatePreset; CL.ai.domainKnowledge.applyDKDatePreset = applyDKDatePreset;
  window.clearDKDateFilter = clearDKDateFilter; CL.ai.domainKnowledge.clearDKDateFilter = clearDKDateFilter;
  window.updateDKDateFilterStatus = updateDKDateFilterStatus; CL.ai.domainKnowledge.updateDKDateFilterStatus = updateDKDateFilterStatus;
  window.applyDKDateFilterInternal = applyDKDateFilterInternal; CL.ai.domainKnowledge.applyDKDateFilterInternal = applyDKDateFilterInternal;
  window.buildDKCrashProfile = buildDKCrashProfile; CL.ai.domainKnowledge.buildDKCrashProfile = buildDKCrashProfile;
  CL._registerModule('ai/ai-domain-knowledge-location');
})();
