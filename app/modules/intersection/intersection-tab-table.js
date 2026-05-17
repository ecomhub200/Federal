/** CL intersection.tab (table) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md + MODULAR_PLAN_PROMPT_17-v2_VERIFY.md.
 *  Verbatim. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L54708-L54969) ───
function updateIntersectionTab() {
    // mv_intersection_summary doesn't exist yet (backend ticket A1), so derive
    // the 4 KPIs from the intersection subset of mv_hotspots for any tier where
    // we don't have row-level sampleRows (every aggregate tier + county-rollup).
    // Chart cards stay empty until the dedicated matview ships.
    const _tabTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) || 'county';
    const _isAggregate = new Set(['federal','state','region','mpo','planning_district']).has(_tabTier);
    const _hasSampleRows = !!(crashState.sampleRows && crashState.sampleRows.length > 0);
    const _hasMatview = !!(typeof CL !== 'undefined' && CL.data && CL.data.client && typeof CL.data.client.getHotspots === 'function');
    if (_hasMatview && (_isAggregate || !_hasSampleRows)) {
        _loadIntersectionsFromHotspots();
        return;
    }

    const data = getFilteredIntersectionData();
    const int = data.intersection;
    const total = data.totalRows;
    
    document.getElementById('intTotal').textContent = int.total.toLocaleString();
    document.getElementById('intFatal').textContent = int.K;
    document.getElementById('intSerious').textContent = int.A;
    document.getElementById('intPct').textContent = pct(int.total, total) + '%';

    // Intersection type chart - exclude "Not at Intersection" items
    const intTypes = Object.entries(data.byIntType)
        .filter(([name]) => !name.toLowerCase().includes('not at intersection'))
        .sort((a,b) => b[1].total - a[1].total).slice(0,8);
    createChart('chartIntType', 'bar', {
        labels: intTypes.map(t => t[0].substring(0,20)),
        datasets: [{ label: 'Crashes', data: intTypes.map(t => t[1].total), backgroundColor: '#1e40af' }]
    }, { indexAxis: 'y' });

    // Traffic control chart with custom legend
    const tcSorted = Object.entries(data.byTrafficCtrl).sort((a,b) => b[1] - a[1]).slice(0,8);
    const tcLabels = tcSorted.map(t => t[0].substring(0,20));
    const tcData = tcSorted.map(t => t[1]);
    const tcColors = ['#dc2626','#f59e0b','#22c55e','#3b82f6','#8b5cf6','#ec4899','#64748b','#0ea5e9'];
    const tcTotal = tcData.reduce((a,b) => a+b, 0);

    createChart('chartTrafficControl', 'doughnut', {
        labels: tcLabels,
        datasets: [{ data: tcData, backgroundColor: tcColors, borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    buildCustomLegend('legendTrafficControl', tcLabels, tcData, tcColors, tcTotal);

    // Intersection collision types - filter sample rows
    const intCrashes = data.sampleRows.filter(r => isIntersection(r));
    const intCollisions = {};
    intCrashes.forEach(r => { const c = r[COL.COLLISION] || 'Unknown'; intCollisions[c] = (intCollisions[c]||0)+1; });
    const icSorted = Object.entries(intCollisions).sort((a,b) => b[1]-a[1]).slice(0,8);
    createChart('chartIntCollision', 'bar', {
        labels: icSorted.map(c => c[0].substring(0,20)),
        datasets: [{ label: 'Crashes', data: icSorted.map(c => c[1]), backgroundColor: '#7c3aed' }]
    }, { indexAxis: 'y' });

    // Year Over Year Crash Trend for intersection crashes
    const intCrashYears = {};
    intCrashes.forEach(r => {
        const year = r[COL.YEAR];
        if (year) {
            intCrashYears[year] = (intCrashYears[year] || 0) + 1;
        }
    });
    const yearsSorted = Object.keys(intCrashYears).sort();
    createChart('chartIntYearTrend', 'bar', {
        labels: yearsSorted,
        datasets: [{ label: 'Intersection Crashes', data: yearsSorted.map(y => intCrashYears[y]), backgroundColor: '#0ea5e9', borderColor: '#0284c7', borderWidth: 1 }]
    }, { plugins: { legend: { display: false } } });
    
    // Phase 3: Add jurisdiction data to byNode for multi-county tiers
    if (isMultiCountyTier()) {
        const nodeJuris = {};
        data.sampleRows.forEach(row => {
            const node = row[COL.NODE] || '';
            const juris = (row[COL.JURISDICTION] || '').trim();
            if (node && juris && data.byNode[node]) {
                if (!nodeJuris[node]) nodeJuris[node] = {};
                nodeJuris[node][juris] = (nodeJuris[node][juris] || 0) + 1;
            }
        });
        Object.entries(nodeJuris).forEach(([node, counts]) => {
            const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
            if (top && data.byNode[node]) data.byNode[node].jurisdiction = top[0];
        });
    }

    // All intersection nodes - ranked by total crashes
    const nodeSorted = Object.entries(data.byNode).sort((a,b) => b[1].total - a[1].total);

    // Store all intersection data for pagination
    setPaginationData('intersection', nodeSorted);

    // Phase 3: Update thead for county column
    _updateIntersectionThead();

    // Render intersection rows
    _renderIntersectionRows();

    // Auto-select rank #1 if no selections and intersections exist (only on page 1)
    const state = paginationState.intersection;
    if (intDetailState.selectedLocations.length === 0 && nodeSorted.length > 0 && state.page === 1) {
        autoSelectTopIntersection(nodeSorted);
    }
}

/** Phase 3: Update intersection table thead for county column */
function _updateIntersectionThead() {
    const showCounty = isMultiCountyTier();
    const thead = document.querySelector('#intTable thead tr');
    if (!thead) return;
    const hasCountyCol = thead.querySelector('.tier-county-col');
    if (showCounty && !hasCountyCol) {
        const th = document.createElement('th');
        th.className = 'tier-county-col';
        th.textContent = 'County';
        th.style.cssText = 'font-size:0.8rem;';
        // Insert after Route column (4th th, index 3)
        const routeTh = thead.children[3];
        if (routeTh && routeTh.nextSibling) {
            thead.insertBefore(th, routeTh.nextSibling);
        }
    } else if (!showCounty && hasCountyCol) {
        hasCountyCol.remove();
    }
}

/** Shared intersection row rendering for both initial render and pagination */
function _renderIntersectionRows() {
    const showCounty = isMultiCountyTier();
    const pageData = getPaginatedData('intersection');
    const state = paginationState.intersection;
    const startIndex = (state.page - 1) * state.pageSize;

    document.getElementById('intBody').innerHTML = pageData.map(([node, d], pageIndex) => {
        const globalIndex = startIndex + pageIndex;
        const isSelected = intDetailState.selectedLocations.some(loc => loc.node === node);
        const checkboxDisabled = !isSelected && intDetailState.selectedLocations.length >= intDetailState.maxSelections;
        const countyCell = showCounty ? `<td style="font-size:.75rem" class="tier-county-col">${esc(d.jurisdiction || '')}</td>` : '';
        // Bug 14a v2 — when populated from mv_hotspots, d.displayName carries the
        // readable cross-street/route name (e.g. "DE 24 / Chrisandrea Drive").
        // Sampler-rows path leaves displayName undefined, so fall back to the
        // legacy node-id formatting which preserves city-tier behavior.
        const nodeLabel = d.displayName ? d.displayName : formatNodeId(node);
        return `<tr class="${isSelected ? 'int-row-selected' : ''}">
        <td><input type="checkbox" class="int-checkbox" data-node="${esc(node)}" data-routes="${esc(d.routes ? [...d.routes].join(', ') : '')}" data-total="${d.total}" data-k="${d.K||0}" data-a="${d.A||0}" data-epdo="${calcEPDO(d)}" data-ctrl="${esc((d.ctrl||'').substring(0,20))}" onchange="toggleIntSelection(this)" ${isSelected ? 'checked' : ''} ${checkboxDisabled ? 'disabled' : ''}></td>
        <td style="font-weight:600;text-align:center">${globalIndex + 1}</td><td>${esc(nodeLabel)}</td><td style="font-size:.75rem">${esc(d.routes ? [...d.routes].join(', ') : '')}</td>${countyCell}<td>${d.total}</td>
        <td><span class="severity-badge severity-K">${d.K||0}</span></td>
        <td><span class="severity-badge severity-A">${d.A||0}</span></td>
        <td>${calcEPDO(d)}</td><td style="font-size:.75rem">${esc((d.ctrl||'').substring(0,20))}</td>
        <td><button class="btn-details" onclick="showLocationDetail('${esc(node)}', 'intersection')">📍 Details</button> <button class="btn-map" onclick="zoomToLocation('${esc(node)}', 'node')">🗺️ Map</button> <button class="btn-mutcd" onclick="askMUTCDForIntersection('${esc(node)}')" title="Get MUTCD guidance">📖 MUTCD</button> <button class="btn-street" onclick="openStreetViewForLocation('${esc(node)}', 'node')" title="View in Street View" style="background:#0ea5e9;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:.7rem">🛣️</button></td></tr>`;
    }).join('');

    // Render pagination controls
    renderPaginationControls('intersection', 'intersectionPagination', 'goToIntersectionPage');

    // Update selection count display
    updateIntSelectionCount();
}

// Page navigation for intersection table
function goToIntersectionPage(tableKey, page) {
    goToPage(tableKey, page);
    // Re-render using shared helper (Phase 3: supports county column)
    _renderIntersectionRows();
}

// Auto-select top ranked intersection and show info banner
function autoSelectTopIntersection(nodeSorted) {
    if (!nodeSorted || nodeSorted.length === 0) return;

    const [topNode, topData] = nodeSorted[0];
    if (!topNode) return;

    // Select the top intersection
    intDetailState.selectedLocations = [{
        node: topNode,
        routes: topData.routes ? [...topData.routes].join(', ') : ''
    }];

    // Update checkbox in table
    const checkbox = document.querySelector(`#intBody .int-checkbox[data-node="${CSS.escape(topNode)}"]`);
    if (checkbox) checkbox.checked = true;

    // Update selection count
    updateIntSelectionCount();

    // Show detail panel with info banner (skip scroll on auto-select)
    updateIntDetailPanel(true);

    // Show info banner if first time
    if (!intDetailState.bannerShown) {
        showIntInfoBanner();
        intDetailState.bannerShown = true;
    }
}

// Show info banner for intersection detail panel
function showIntInfoBanner() {
    const body = document.getElementById('intDetailBody');
    if (!body) return;

    const banner = document.createElement('div');
    banner.className = 'detail-info-banner';
    banner.innerHTML = `
        <span class="detail-info-icon">💡</span>
        <span class="detail-info-text">Showing top-ranked intersection. Select up to 5 for comparison.</span>
        <button class="detail-info-close" onclick="this.parentElement.remove()">✕</button>
    `;
    body.insertBefore(banner, body.firstChild);
}

// Get MUTCD guidance for an intersection
function askMUTCDForIntersection(node) {
    const nodeStr = String(node);
    const crashes = crashState.sampleRows.filter(r => String(r[COL.NODE]) === nodeStr);
    askMUTCDGuidance(node, 'intersection', crashes);
}

// Export intersection data to CSV
function exportIntersectionCSV() {
    const data = getFilteredIntersectionData();
    const intCrashes = data.sampleRows.filter(r => isIntersection(r));

    if (intCrashes.length === 0) {
        alert('No intersection crash data to export.');
        return;
    }

    // Define columns to export
    const columns = [COL.ID, COL.YEAR, COL.DATE, COL.SEVERITY, COL.COLLISION, COL.INT_TYPE,
                     COL.TRAFFIC_CTRL, COL.NODE, COL.ROUTE, COL.WEATHER, COL.LIGHT, COL.X, COL.Y];

    // Build CSV
    let csv = columns.join(',') + '\n';
    intCrashes.forEach(row => {
        csv += columns.map(col => {
            let val = row[col] || '';
            // Convert date timestamp to readable format
            if (col === COL.DATE && val) {
                const d = new Date(Number(val));
                if (!isNaN(d.getTime())) val = d.toLocaleDateString();
            }
            // Escape quotes and wrap in quotes if needed
            if (String(val).includes(',') || String(val).includes('"') || String(val).includes('\n')) {
                val = '"' + String(val).replace(/"/g, '""') + '"';
            }
            return val;
        }).join(',') + '\n';
    });

    // Create download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `intersection_crashes_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  window.updateIntersectionTab=updateIntersectionTab; CL.intersection.tab.updateIntersectionTab=updateIntersectionTab;
  window._updateIntersectionThead=_updateIntersectionThead; CL.intersection.tab._updateIntersectionThead=_updateIntersectionThead;
  window._renderIntersectionRows=_renderIntersectionRows; CL.intersection.tab._renderIntersectionRows=_renderIntersectionRows;
  window.goToIntersectionPage=goToIntersectionPage; CL.intersection.tab.goToIntersectionPage=goToIntersectionPage;
  window.autoSelectTopIntersection=autoSelectTopIntersection; CL.intersection.tab.autoSelectTopIntersection=autoSelectTopIntersection;
  window.showIntInfoBanner=showIntInfoBanner; CL.intersection.tab.showIntInfoBanner=showIntInfoBanner;
  window.askMUTCDForIntersection=askMUTCDForIntersection; CL.intersection.tab.askMUTCDForIntersection=askMUTCDForIntersection;
  window.exportIntersectionCSV=exportIntersectionCSV; CL.intersection.tab.exportIntersectionCSV=exportIntersectionCSV;
  CL._registerModule('intersection/intersection-tab-table');
})();
