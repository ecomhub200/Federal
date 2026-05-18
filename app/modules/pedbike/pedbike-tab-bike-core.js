/** CL pedbike.tab18c — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Bicycle-side core (filters/location table/selection) — mirror of 18a ped-core.
 *  Reads inline shared bikeAnalysisState (window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// ============================================================
// BICYCLE LOCATION ANALYSIS (Similar to Pedestrian)
// ============================================================

function applyBikeFilters() {
    const startDateStr = document.getElementById('bikeStartDate')?.value || '';
    const endDateStr = document.getElementById('bikeEndDate')?.value || '';
    const minCrashes = parseInt(document.getElementById('bikeMinCrashes')?.value || '2');
    const sortBy = document.getElementById('bikeSortBy')?.value || 'epdo';
    const groupBy = document.getElementById('bikeGroupBy')?.value || 'route';
    const qf = bikeAnalysisState.filters;

    // Supabase-first: shares the 'pedestrian' tab cache (preloader fetches
    // ped + bike with `pedBike: 'either'`). Falls back to crashState.sampleRows.
    const tabRows = (CL.data && CL.data.tabLoaders)
        ? CL.data.tabLoaders.getTabRows('pedestrian')
        : (crashState.sampleRows || []);
    let crashes = tabRows.filter(c => isYes(c[COL.BIKE]));

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

    bikeAnalysisState.filteredCrashes = crashes;

    // Update active filter indicator
    const activeFilters = [];
    if (qf.fatal) activeFilters.push('Fatal');
    if (qf.ka) activeFilters.push('K+A');
    if (qf.intersection) activeFilters.push('Intersection');
    if (qf.nighttime) activeFilters.push('Nighttime');
    if (startDateStr || endDateStr) activeFilters.push(`Date: ${startDateStr || 'Start'} to ${endDateStr || 'End'}`);

    const filterIndicator = document.getElementById('bikeActiveFilters');
    if (activeFilters.length > 0) {
        document.getElementById('bikeFilterSummary').textContent = activeFilters.join(' + ');
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

    if (sortBy === 'epdo') locations.sort((a,b) => b.epdo - a.epdo);
    else if (sortBy === 'total') locations.sort((a,b) => b.total - a.total);
    else if (sortBy === 'ka') locations.sort((a,b) => (b.K + b.A) - (a.K + a.A));
    else if (sortBy === 'fatal') locations.sort((a,b) => b.K - a.K);

    bikeAnalysisState.allLocations = locations;
    renderBikeLocationTable(locations, groupBy);
    updateBikeLocationTypeChart(crashes);

    // Auto-select first segment if no selection exists and locations are available
    if (bikeAnalysisState.selectedLocations.length === 0 && locations.length > 0) {
        bikeAnalysisState.selectedLocations = [locations[0]];
        updateBikeSelectionUI();
        updateBikeDetailPanel();
    }
}

function renderBikeLocationTable(locations, groupBy) {
    const tbody = document.getElementById('bikeRouteBody');

    // Identify selected locations not in current filtered results (pinned)
    const filteredLocationNames = new Set(locations.map(l => l.location));
    const pinnedLocations = bikeAnalysisState.selectedLocations.filter(s => !filteredLocationNames.has(s.location));

    // Build table rows: pinned first, then filtered results
    let html = '';

    // Render pinned (selected but filtered out) locations first
    pinnedLocations.forEach((d, idx) => {
        const locDisplay = d.isNode ? formatNodeId(d.location) : d.location.substring(0, 25);
        const escLoc = escJs(d.location);
        html += `<tr class="hotspot-row-selected hotspot-row-pinned" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7)">
            <td><input type="checkbox" class="bike-checkbox" data-location="${esc(d.location)}" data-isnode="${d.isNode}"
                onchange="toggleBikeSelection(this)" checked></td>
            <td style="font-weight:600;text-align:center;color:#059669" title="Pinned - not in current filter results">📌</td>
            <td style="font-size:.8rem" title="${esc(d.location)} (Pinned)">${d.isNode ? '🚦 ' : ''}${esc(locDisplay)}</td>
            <td><strong>${d.total}</strong></td>
            <td><span class="severity-badge severity-K">${d.K}</span></td>
            <td><span class="severity-badge severity-A">${d.A}</span></td>
            <td style="font-weight:600;color:#7c3aed">${d.epdo.toLocaleString()}</td>
            <td>${d.intPct > 50 ? '✓' : ''}</td>
            <td>${d.nightPct}%</td>
            <td>
                <button class="btn-soft btn-soft-primary btn-soft-sm" onclick="zoomToPedBikeLocation('${escLoc}', 'bike')" title="View on Map">🗺️</button>
                <button class="btn-soft btn-soft-success btn-soft-sm" onclick="jumpToCMFFromPedBike('${escLoc}', 'bike')" title="View Countermeasures">💡</button>
                <button class="btn-soft btn-soft-info btn-soft-sm" onclick="openStreetViewForCrashType('${escLoc}', 'bike')" title="Street View">🛣️</button>
            </td>
        </tr>`;
    });

    // Render filtered locations
    html += locations.map((d, idx) => {
        const isSelected = bikeAnalysisState.selectedLocations.some(s => s.location === d.location);
        const checkboxDisabled = !isSelected && bikeAnalysisState.selectedLocations.length >= bikeAnalysisState.maxSelections;
        const locDisplay = d.isNode ? formatNodeId(d.location) : d.location.substring(0, 25);
        const escLoc = escJs(d.location);

        return `<tr class="${isSelected ? 'hotspot-row-selected' : ''}">
            <td><input type="checkbox" class="bike-checkbox" data-location="${esc(d.location)}" data-isnode="${d.isNode}"
                onchange="toggleBikeSelection(this)" ${isSelected ? 'checked' : ''} ${checkboxDisabled ? 'disabled' : ''}></td>
            <td style="font-weight:600;text-align:center">${idx + 1}</td>
            <td style="font-size:.8rem" title="${esc(d.location)}">${d.isNode ? '🚦 ' : ''}${esc(locDisplay)}</td>
            <td><strong>${d.total}</strong></td>
            <td><span class="severity-badge severity-K">${d.K}</span></td>
            <td><span class="severity-badge severity-A">${d.A}</span></td>
            <td style="font-weight:600;color:#7c3aed">${d.epdo.toLocaleString()}</td>
            <td>${d.intPct > 50 ? '✓' : ''}</td>
            <td>${d.nightPct}%</td>
            <td>
                <button class="btn-soft btn-soft-primary btn-soft-sm" onclick="zoomToPedBikeLocation('${escLoc}', 'bike')" title="View on Map">🗺️</button>
                <button class="btn-soft btn-soft-success btn-soft-sm" onclick="jumpToCMFFromPedBike('${escLoc}', 'bike')" title="View Countermeasures">💡</button>
                <button class="btn-soft btn-soft-info btn-soft-sm" onclick="openStreetViewForCrashType('${escLoc}', 'bike')" title="Street View">🛣️</button>
            </td>
        </tr>`;
    }).join('');

    tbody.innerHTML = html;

    // Update selection count with pinned indicator
    const pinnedCount = pinnedLocations.length;
    const countText = pinnedCount > 0
        ? `${bikeAnalysisState.selectedLocations.length} of ${bikeAnalysisState.maxSelections} selected (${pinnedCount} pinned)`
        : `${bikeAnalysisState.selectedLocations.length} of ${bikeAnalysisState.maxSelections} selected`;
    document.getElementById('bikeSelectCount').textContent = countText;
}

function toggleBikeSelection(checkbox) {
    const location = checkbox.dataset.location;
    const isChecked = checkbox.checked;

    if (isChecked) {
        if (bikeAnalysisState.selectedLocations.length < bikeAnalysisState.maxSelections) {
            const locData = bikeAnalysisState.allLocations.find(l => l.location === location);
            if (locData) bikeAnalysisState.selectedLocations.push(locData);
        }
    } else {
        bikeAnalysisState.selectedLocations = bikeAnalysisState.selectedLocations.filter(s => s.location !== location);
    }

    updateBikeSelectionUI();
    if (bikeAnalysisState.selectedLocations.length > 0) {
        updateBikeDetailPanel();
    } else {
        document.getElementById('bikeDetailPanel').style.display = 'none';
    }
}

function toggleAllBikeSelection(checked) {
    if (checked) {
        bikeAnalysisState.selectedLocations = bikeAnalysisState.allLocations.slice(0, bikeAnalysisState.maxSelections);
    } else {
        bikeAnalysisState.selectedLocations = [];
    }
    updateBikeSelectionUI();
    if (bikeAnalysisState.selectedLocations.length > 0) {
        updateBikeDetailPanel();
    } else {
        document.getElementById('bikeDetailPanel').style.display = 'none';
    }
}

function clearBikeSelection() {
    bikeAnalysisState.selectedLocations = [];
    updateBikeSelectionUI();
    document.getElementById('bikeDetailPanel').style.display = 'none';
}

function updateBikeSelectionUI() {
    document.querySelectorAll('.bike-checkbox').forEach(cb => {
        const loc = cb.dataset.location;
        const isSelected = bikeAnalysisState.selectedLocations.some(s => s.location === loc);
        cb.checked = isSelected;
        cb.disabled = !isSelected && bikeAnalysisState.selectedLocations.length >= bikeAnalysisState.maxSelections;
        cb.closest('tr')?.classList.toggle('hotspot-row-selected', isSelected);
    });
    document.getElementById('bikeSelectCount').textContent = `${bikeAnalysisState.selectedLocations.length} of ${bikeAnalysisState.maxSelections} selected`;
    document.getElementById('bikeSelectAll').checked = bikeAnalysisState.selectedLocations.length === bikeAnalysisState.maxSelections;
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  window.applyBikeFilters=applyBikeFilters; CL.pedbike.tab.applyBikeFilters=applyBikeFilters;
  window.renderBikeLocationTable=renderBikeLocationTable; CL.pedbike.tab.renderBikeLocationTable=renderBikeLocationTable;
  window.toggleBikeSelection=toggleBikeSelection; CL.pedbike.tab.toggleBikeSelection=toggleBikeSelection;
  window.toggleAllBikeSelection=toggleAllBikeSelection; CL.pedbike.tab.toggleAllBikeSelection=toggleAllBikeSelection;
  window.clearBikeSelection=clearBikeSelection; CL.pedbike.tab.clearBikeSelection=clearBikeSelection;
  window.updateBikeSelectionUI=updateBikeSelectionUI; CL.pedbike.tab.updateBikeSelectionUI=updateBikeSelectionUI;
  CL._registerModule('pedbike/pedbike-tab-bike-core');
})();
