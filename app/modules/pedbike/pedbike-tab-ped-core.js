/** CL pedbike.tab18a — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Reads inline shared pedAnalysisState / bikeAnalysisState (window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
function updatePedBikeTab() {
    // Supabase-first: if aggregates are empty (no R2 data), delegate to the
    // matview-based People Analysis path which renders the visible sections
    // with real numbers. Skips the sampleRows-based KPI cards entirely.
    var _dcPB = (window.CL && CL.data) ? CL.data.client : null;
    if (_dcPB && typeof _dcPB.getSafetyCategories === 'function'
        && crashState.aggregates && crashState.aggregates.ped
        && crashState.aggregates.ped.total === 0) {
        updatePeopleAnalysis();
        return;
    }

    const ped = crashState.aggregates.ped;
    const bike = crashState.aggregates.bike;
    const years = crashState.years;

    // Pedestrian KPIs
    const pedEPDO = calcEPDO(ped);
    const pedKARate = ped.total > 0 ? ((ped.K + ped.A) / ped.total * 100).toFixed(1) : 0;
    document.getElementById('pedTotal').textContent = ped.total.toLocaleString();
    document.getElementById('pedFatal').textContent = ped.K;
    document.getElementById('pedKA').textContent = ped.K + ped.A;
    document.getElementById('pedEPDO').textContent = pedEPDO.toLocaleString();
    document.getElementById('pedKARate').textContent = pedKARate + '%';

    // Pedestrian people killed/injured (from dedicated columns, show only if data available)
    const pedCas = crashState.aggregates.pedCasualties;
    if (pedCas && (pedCas.killed > 0 || pedCas.injured > 0)) {
        const killedCard = document.getElementById('pedPeopleKilledCard');
        const injuredCard = document.getElementById('pedPeopleInjuredCard');
        if (killedCard) {
            killedCard.style.display = '';
            document.getElementById('pedPeopleKilled').textContent = pedCas.killed.toLocaleString();
        }
        if (injuredCard) {
            injuredCard.style.display = '';
            document.getElementById('pedPeopleInjured').textContent = pedCas.injured.toLocaleString();
        }
    }

    // Bicycle KPIs
    const bikeEPDO = calcEPDO(bike);
    const bikeKARate = bike.total > 0 ? ((bike.K + bike.A) / bike.total * 100).toFixed(1) : 0;
    document.getElementById('bikeTotal').textContent = bike.total.toLocaleString();
    document.getElementById('bikeFatal').textContent = bike.K;
    document.getElementById('bikeKA').textContent = bike.K + bike.A;
    document.getElementById('bikeEPDO').textContent = bikeEPDO.toLocaleString();
    document.getElementById('bikeKARate').textContent = bikeKARate + '%';

    // Pedestrian Year Chart - Bar style for clearer visualization
    createChart('chartPedYear', 'bar', {
        labels: years,
        datasets: [{
            label: 'Pedestrian Crashes',
            data: years.map(y => ped.byYear[y] || 0),
            backgroundColor: '#0891b2',
            borderRadius: 4
        }]
    }, { plugins: { legend: { display: false } } });

    // Pedestrian Light Condition with custom legend
    const pedLight = Object.entries(ped.byLight).sort((a,b) => b[1]-a[1]).slice(0,6);
    const lightColors = ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1','#22c55e'];

    createChart('chartPedLight', 'doughnut', {
        labels: pedLight.map(l => l[0]),
        datasets: [{ data: pedLight.map(l => l[1]), backgroundColor: lightColors, borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    // Build ped light legend with numbers
    let pedLightLegendHtml = '';
    pedLight.forEach((l, i) => {
        const pctVal = ped.total > 0 ? (l[1] / ped.total * 100).toFixed(1) : 0;
        pedLightLegendHtml += `<div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:${lightColors[i]};border-radius:2px"></span>
            <span style="flex:1">${l[0].substring(0,20)}</span>
            <span style="font-weight:600">${l[1]}</span>
            <span style="color:#64748b">(${pctVal}%)</span>
        </div>`;
    });
    document.getElementById('pedLightLegend').innerHTML = pedLightLegendHtml;

    // Bicycle Year Chart
    createChart('chartBikeYear', 'bar', {
        labels: years,
        datasets: [{
            label: 'Bicycle Crashes',
            data: years.map(y => bike.byYear[y] || 0),
            backgroundColor: '#059669',
            borderRadius: 4
        }]
    }, { plugins: { legend: { display: false } } });

    // Bicycle Light Condition with custom legend
    const bikeLight = Object.entries(bike.byLight).sort((a,b) => b[1]-a[1]).slice(0,6);

    createChart('chartBikeLight', 'doughnut', {
        labels: bikeLight.map(l => l[0]),
        datasets: [{ data: bikeLight.map(l => l[1]), backgroundColor: lightColors, borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    // Build bike light legend with numbers
    let bikeLightLegendHtml = '';
    bikeLight.forEach((l, i) => {
        const pctVal = bike.total > 0 ? (l[1] / bike.total * 100).toFixed(1) : 0;
        bikeLightLegendHtml += `<div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:${lightColors[i]};border-radius:2px"></span>
            <span style="flex:1">${l[0].substring(0,20)}</span>
            <span style="font-weight:600">${l[1]}</span>
            <span style="color:#64748b">(${pctVal}%)</span>
        </div>`;
    });
    document.getElementById('bikeLightLegend').innerHTML = bikeLightLegendHtml;

    // Update location tables
    updatePedLocations();
    updateBikeLocations();

    // Comparison table
    const totalVRU = ped.total + bike.total;
    const totalVRUK = ped.K + bike.K;
    const totalVRUKA = (ped.K + ped.A) + (bike.K + bike.A);
    const totalVRUEPDO = pedEPDO + bikeEPDO;

    document.getElementById('pedBikeCompareBody').innerHTML = `
        <tr><td><strong>Total Crashes</strong></td>
            <td style="text-align:center;font-size:1.1rem;font-weight:600;color:#0891b2">${ped.total.toLocaleString()}</td>
            <td style="text-align:center;font-size:1.1rem;font-weight:600;color:#059669">${bike.total.toLocaleString()}</td>
            <td style="text-align:center;font-size:1.1rem;font-weight:700">${totalVRU.toLocaleString()}</td></tr>
        <tr><td><strong>Fatal (K)</strong></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${ped.K}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${bike.K}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${totalVRUK}</span></td></tr>
        <tr><td><strong>Serious Injury (K+A)</strong></td>
            <td style="text-align:center"><span class="severity-badge severity-A">${ped.K + ped.A}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-A">${bike.K + bike.A}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-A">${totalVRUKA}</span></td></tr>
        <tr><td><strong>EPDO Score</strong></td>
            <td style="text-align:center;font-weight:600">${pedEPDO.toLocaleString()}</td>
            <td style="text-align:center;font-weight:600">${bikeEPDO.toLocaleString()}</td>
            <td style="text-align:center;font-weight:700">${totalVRUEPDO.toLocaleString()}</td></tr>
        <tr><td><strong>K+A Rate</strong></td>
            <td style="text-align:center;color:${parseFloat(pedKARate) > 25 ? '#dc2626' : '#059669'}">${pedKARate}%</td>
            <td style="text-align:center;color:${parseFloat(bikeKARate) > 25 ? '#dc2626' : '#059669'}">${bikeKARate}%</td>
            <td style="text-align:center">${totalVRU > 0 ? (totalVRUKA / totalVRU * 100).toFixed(1) : 0}%</td></tr>
        <tr><td><strong>% of All Crashes</strong></td>
            <td style="text-align:center">${(ped.total / crashState.totalRows * 100).toFixed(2)}%</td>
            <td style="text-align:center">${(bike.total / crashState.totalRows * 100).toFixed(2)}%</td>
            <td style="text-align:center">${(totalVRU / crashState.totalRows * 100).toFixed(2)}%</td></tr>
    `;

    // Comparison line chart
    createChart('chartPedBikeCompare', 'line', {
        labels: years,
        datasets: [
            { label: '🚶 Pedestrian', data: years.map(y => ped.byYear[y] || 0), borderColor: '#0891b2', backgroundColor: 'rgba(8,145,178,.1)', fill: true, tension: 0.3 },
            { label: '🚴 Bicycle', data: years.map(y => bike.byYear[y] || 0), borderColor: '#059669', backgroundColor: 'rgba(5,150,105,.1)', fill: true, tension: 0.3 }
        ]
    }, {
        plugins: { legend: { position: 'top' } },
        scales: { y: { beginAtZero: true } }
    });

    // Update People Analysis
    updatePeopleAnalysis();
}

// Toggle quick filters for Pedestrian
function togglePedFilter(el) {
    const filter = el.dataset.filter;
    pedAnalysisState.filters[filter] = !pedAnalysisState.filters[filter];
    el.classList.toggle('active', pedAnalysisState.filters[filter]);
    applyPedFilters();
}

// Toggle quick filters for Bicycle
function toggleBikeFilter(el) {
    const filter = el.dataset.filter;
    bikeAnalysisState.filters[filter] = !bikeAnalysisState.filters[filter];
    el.classList.toggle('active', bikeAnalysisState.filters[filter]);
    applyBikeFilters();
}

// Apply Pedestrian filters and update table
function applyPedFilters() {
    const startDateStr = document.getElementById('pedStartDate')?.value || '';
    const endDateStr = document.getElementById('pedEndDate')?.value || '';
    const minCrashes = parseInt(document.getElementById('pedMinCrashes')?.value || '2');
    const sortBy = document.getElementById('pedSortBy')?.value || 'epdo';
    const groupBy = document.getElementById('pedGroupBy')?.value || 'route';
    const qf = pedAnalysisState.filters;

    // Supabase-first: tab-loaders preloads ped/bike crashes. Falls back to
    // crashState.sampleRows when Supabase isn't available. The .filter() below
    // narrows to PED only — bike rows in the cache are dropped here and
    // picked up by applyBikeFilters() further down.
    const tabRows = (CL.data && CL.data.tabLoaders)
        ? CL.data.tabLoaders.getTabRows('pedestrian')
        : (crashState.sampleRows || []);
    let crashes = tabRows.filter(c => isYes(c[COL.PED]));

    // Apply date filter
    if (startDateStr || endDateStr) {
        crashes = crashes.filter(c => {
            const crashDateStr = c[COL.DATE];
            if (!crashDateStr) return false;
            const crashDate = new Date(Number(crashDateStr));
            if (isNaN(crashDate.getTime())) return false;
            crashDate.setHours(0, 0, 0, 0);
            if (startDateStr) {
                const start = new Date(startDateStr);
                start.setHours(0, 0, 0, 0);
                if (crashDate < start) return false;
            }
            if (endDateStr) {
                const end = new Date(endDateStr);
                end.setHours(23, 59, 59, 999);
                if (crashDate > end) return false;
            }
            return true;
        });
    }

    // Apply quick filters (AND logic)
    if (qf.fatal) crashes = crashes.filter(c => (c[COL.SEVERITY]||'').charAt(0) === 'K');
    if (qf.ka) crashes = crashes.filter(c => ['K','A'].includes((c[COL.SEVERITY]||'').charAt(0)));
    if (qf.intersection) crashes = crashes.filter(c => isIntersection(c));
    if (qf.nighttime) crashes = crashes.filter(c => isYes(c[COL.NIGHT]));

    pedAnalysisState.filteredCrashes = crashes;

    // Update active filter indicator
    const activeFilters = [];
    if (qf.fatal) activeFilters.push('Fatal');
    if (qf.ka) activeFilters.push('K+A');
    if (qf.intersection) activeFilters.push('Intersection');
    if (qf.nighttime) activeFilters.push('Nighttime');
    if (startDateStr || endDateStr) activeFilters.push(`Date: ${startDateStr || 'Start'} to ${endDateStr || 'End'}`);

    const filterIndicator = document.getElementById('pedActiveFilters');
    if (activeFilters.length > 0) {
        document.getElementById('pedFilterSummary').textContent = activeFilters.join(' + ');
        filterIndicator.style.display = 'block';
    } else {
        filterIndicator.style.display = 'none';
    }

    // Group by route or node
    const grouped = {};
    crashes.forEach(c => {
        const key = groupBy === 'node' ? (c[COL.NODE] || 'Unknown') : (c[COL.ROUTE] || 'Unknown');
        if (!grouped[key]) grouped[key] = { crashes: [], K: 0, A: 0, B: 0, C: 0, O: 0, intCount: 0, nightCount: 0 };
        grouped[key].crashes.push(c);
        const sev = (c[COL.SEVERITY]||'').charAt(0);
        if (grouped[key][sev] !== undefined) grouped[key][sev]++;
        if (isIntersection(c)) grouped[key].intCount++;
        if (isYes(c[COL.NIGHT])) grouped[key].nightCount++;
    });

    // Convert to array and filter by min crashes
    let locations = Object.entries(grouped)
        .map(([loc, d]) => ({
            location: loc,
            total: d.crashes.length,
            K: d.K, A: d.A, B: d.B, C: d.C, O: d.O,
            epdo: calcEPDO(d),
            crashes: d.crashes,
            intPct: d.crashes.length > 0 ? Math.round(d.intCount / d.crashes.length * 100) : 0,
            nightPct: d.crashes.length > 0 ? Math.round(d.nightCount / d.crashes.length * 100) : 0,
            isNode: groupBy === 'node'
        }))
        .filter(d => d.total >= minCrashes);

    // Sort
    if (sortBy === 'epdo') locations.sort((a,b) => b.epdo - a.epdo);
    else if (sortBy === 'total') locations.sort((a,b) => b.total - a.total);
    else if (sortBy === 'ka') locations.sort((a,b) => (b.K + b.A) - (a.K + a.A));
    else if (sortBy === 'fatal') locations.sort((a,b) => b.K - a.K);

    pedAnalysisState.allLocations = locations;
    renderPedLocationTable(locations, groupBy);
    updatePedLocationTypeChart(crashes);

    // Auto-select first segment if no selection exists and locations are available
    if (pedAnalysisState.selectedLocations.length === 0 && locations.length > 0) {
        pedAnalysisState.selectedLocations = [locations[0]];
        updatePedSelectionUI();
        updatePedDetailPanel();
    }
}

// Render Pedestrian location table
function renderPedLocationTable(locations, groupBy) {
    const tbody = document.getElementById('pedRouteBody');

    // Identify selected locations not in current filtered results (pinned)
    const filteredLocationNames = new Set(locations.map(l => l.location));
    const pinnedLocations = pedAnalysisState.selectedLocations.filter(s => !filteredLocationNames.has(s.location));

    // Build table rows: pinned first, then filtered results
    let html = '';

    // Render pinned (selected but filtered out) locations first
    pinnedLocations.forEach((d, idx) => {
        const locDisplay = d.isNode ? formatNodeId(d.location) : d.location.substring(0, 25);
        const escLoc = escJs(d.location);
        html += `<tr class="hotspot-row-selected hotspot-row-pinned" style="background:linear-gradient(135deg,#f0fdfa,#e0f7fa)">
            <td><input type="checkbox" class="ped-checkbox" data-location="${esc(d.location)}" data-isnode="${d.isNode}"
                onchange="togglePedSelection(this)" checked></td>
            <td style="font-weight:600;text-align:center;color:#0891b2" title="Pinned - not in current filter results">📌</td>
            <td style="font-size:.8rem" title="${esc(d.location)} (Pinned)">${d.isNode ? '🚦 ' : ''}${esc(locDisplay)}</td>
            <td><strong>${d.total}</strong></td>
            <td><span class="severity-badge severity-K">${d.K}</span></td>
            <td><span class="severity-badge severity-A">${d.A}</span></td>
            <td style="font-weight:600;color:#7c3aed">${d.epdo.toLocaleString()}</td>
            <td>${d.intPct > 50 ? '✓' : ''}</td>
            <td>${d.nightPct}%</td>
            <td>
                <button class="btn-soft btn-soft-primary btn-soft-sm" onclick="zoomToPedBikeLocation('${escLoc}', 'ped')" title="View on Map">🗺️</button>
                <button class="btn-soft btn-soft-success btn-soft-sm" onclick="jumpToCMFFromPedBike('${escLoc}', 'ped')" title="View Countermeasures">💡</button>
                <button class="btn-soft btn-soft-info btn-soft-sm" onclick="openStreetViewForCrashType('${escLoc}', 'ped')" title="Street View">🛣️</button>
            </td>
        </tr>`;
    });

    // Render filtered locations
    html += locations.map((d, idx) => {
        const isSelected = pedAnalysisState.selectedLocations.some(s => s.location === d.location);
        const checkboxDisabled = !isSelected && pedAnalysisState.selectedLocations.length >= pedAnalysisState.maxSelections;
        const locDisplay = d.isNode ? formatNodeId(d.location) : d.location.substring(0, 25);
        const escLoc = escJs(d.location);

        return `<tr class="${isSelected ? 'hotspot-row-selected' : ''}">
            <td><input type="checkbox" class="ped-checkbox" data-location="${esc(d.location)}" data-isnode="${d.isNode}"
                onchange="togglePedSelection(this)" ${isSelected ? 'checked' : ''} ${checkboxDisabled ? 'disabled' : ''}></td>
            <td style="font-weight:600;text-align:center">${idx + 1}</td>
            <td style="font-size:.8rem" title="${esc(d.location)}">${d.isNode ? '🚦 ' : ''}${esc(locDisplay)}</td>
            <td><strong>${d.total}</strong></td>
            <td><span class="severity-badge severity-K">${d.K}</span></td>
            <td><span class="severity-badge severity-A">${d.A}</span></td>
            <td style="font-weight:600;color:#7c3aed">${d.epdo.toLocaleString()}</td>
            <td>${d.intPct > 50 ? '✓' : ''}</td>
            <td>${d.nightPct}%</td>
            <td>
                <button class="btn-soft btn-soft-primary btn-soft-sm" onclick="zoomToPedBikeLocation('${escLoc}', 'ped')" title="View on Map">🗺️</button>
                <button class="btn-soft btn-soft-success btn-soft-sm" onclick="jumpToCMFFromPedBike('${escLoc}', 'ped')" title="View Countermeasures">💡</button>
                <button class="btn-soft btn-soft-info btn-soft-sm" onclick="openStreetViewForCrashType('${escLoc}', 'ped')" title="Street View">🛣️</button>
            </td>
        </tr>`;
    }).join('');

    tbody.innerHTML = html;

    // Update selection count with pinned indicator
    const pinnedCount = pinnedLocations.length;
    const countText = pinnedCount > 0
        ? `${pedAnalysisState.selectedLocations.length} of ${pedAnalysisState.maxSelections} selected (${pinnedCount} pinned)`
        : `${pedAnalysisState.selectedLocations.length} of ${pedAnalysisState.maxSelections} selected`;
    document.getElementById('pedSelectCount').textContent = countText;
}

// Toggle individual Pedestrian location selection
function togglePedSelection(checkbox) {
    const location = checkbox.dataset.location;
    const isNode = checkbox.dataset.isnode === 'true';
    const isChecked = checkbox.checked;

    if (isChecked) {
        if (pedAnalysisState.selectedLocations.length < pedAnalysisState.maxSelections) {
            const locData = pedAnalysisState.allLocations.find(l => l.location === location);
            if (locData) pedAnalysisState.selectedLocations.push(locData);
        }
    } else {
        pedAnalysisState.selectedLocations = pedAnalysisState.selectedLocations.filter(s => s.location !== location);
    }

    updatePedSelectionUI();
    if (pedAnalysisState.selectedLocations.length > 0) {
        updatePedDetailPanel();
    } else {
        document.getElementById('pedDetailPanel').style.display = 'none';
    }
}

// Toggle all Pedestrian selections
function toggleAllPedSelection(checked) {
    if (checked) {
        pedAnalysisState.selectedLocations = pedAnalysisState.allLocations.slice(0, pedAnalysisState.maxSelections);
    } else {
        pedAnalysisState.selectedLocations = [];
    }
    updatePedSelectionUI();
    if (pedAnalysisState.selectedLocations.length > 0) {
        updatePedDetailPanel();
    } else {
        document.getElementById('pedDetailPanel').style.display = 'none';
    }
}

// Clear Pedestrian selection
function clearPedSelection() {
    pedAnalysisState.selectedLocations = [];
    updatePedSelectionUI();
    document.getElementById('pedDetailPanel').style.display = 'none';
}

// Update Pedestrian selection UI
function updatePedSelectionUI() {
    document.querySelectorAll('.ped-checkbox').forEach(cb => {
        const loc = cb.dataset.location;
        const isSelected = pedAnalysisState.selectedLocations.some(s => s.location === loc);
        cb.checked = isSelected;
        cb.disabled = !isSelected && pedAnalysisState.selectedLocations.length >= pedAnalysisState.maxSelections;
        cb.closest('tr')?.classList.toggle('hotspot-row-selected', isSelected);
    });
    document.getElementById('pedSelectCount').textContent = `${pedAnalysisState.selectedLocations.length} of ${pedAnalysisState.maxSelections} selected`;
    document.getElementById('pedSelectAll').checked = pedAnalysisState.selectedLocations.length === pedAnalysisState.maxSelections;
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  window.updatePedBikeTab=updatePedBikeTab; CL.pedbike.tab.updatePedBikeTab=updatePedBikeTab;
  window.togglePedFilter=togglePedFilter; CL.pedbike.tab.togglePedFilter=togglePedFilter;
  window.toggleBikeFilter=toggleBikeFilter; CL.pedbike.tab.toggleBikeFilter=toggleBikeFilter;
  window.applyPedFilters=applyPedFilters; CL.pedbike.tab.applyPedFilters=applyPedFilters;
  window.renderPedLocationTable=renderPedLocationTable; CL.pedbike.tab.renderPedLocationTable=renderPedLocationTable;
  window.togglePedSelection=togglePedSelection; CL.pedbike.tab.togglePedSelection=togglePedSelection;
  window.toggleAllPedSelection=toggleAllPedSelection; CL.pedbike.tab.toggleAllPedSelection=toggleAllPedSelection;
  window.clearPedSelection=clearPedSelection; CL.pedbike.tab.clearPedSelection=clearPedSelection;
  window.updatePedSelectionUI=updatePedSelectionUI; CL.pedbike.tab.updatePedSelectionUI=updatePedSelectionUI;
  CL._registerModule('pedbike/pedbike-tab-ped-core');
})();
