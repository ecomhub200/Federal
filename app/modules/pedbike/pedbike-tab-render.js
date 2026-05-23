/** CL pedbike.render — extracted (name-anchored) 2026-05-23.
 *  see queue/203-passb-pedbike.md. No behavior change.
 *  Reads inline shared pedAnalysisState / bikeAnalysisState (window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// ────────────────────────────────────────────────────────────────────────
// Round 12 — Ped/Bike High-Crash Locations from mv_pedbike_locations.
// At aggregate tiers the legacy applyPedFilters / applyBikeFilters path
// operates on sampleRows which are usually empty, leaving the tables
// blank. The matview supplies per-location K/A/total/at_intersection/
// night_count direct, so we hydrate the tables and pies from it.
// ────────────────────────────────────────────────────────────────────────
async function renderPedBikeLocationsFromMatview(dc, tierResolved) {
    if (!dc || typeof dc.getPedBikeLocations !== 'function') return;
    if (!tierResolved || !tierResolved.tier) return;

    const _calcEpdo = (sev) => (typeof calcEPDO === 'function')
        ? calcEPDO(sev)
        : ((sev?.K || 0) * 883 + (sev?.A || 0) * 94 + (sev?.B || 0) * 21 + (sev?.C || 0) * 11 + (sev?.O || 0));

    const _hydrate = (rows) => {
        // mv_pedbike_locations columns: location_type, location_name, total,
        // k, a, at_intersection, night_count, first_year, last_year.
        // Map to the same shape pedAnalysisState.allLocations expects.
        return (rows || []).map(r => {
            const sev = { K: r.k || 0, A: r.a || 0, B: 0, C: 0, O: 0 };
            const total = r.total || 0;
            const intCount = r.at_intersection || (r.location_type === 'intersection' ? total : 0);
            const nightCount = r.night_count || 0;
            return {
                location: r.location_name || 'Unknown',
                total: total,
                K: r.k || 0,
                A: r.a || 0,
                B: 0, C: 0, O: 0,
                epdo: _calcEpdo(sev),
                crashes: [],   // matview path has no row-level access
                intPct: total > 0 ? Math.round(intCount / total * 100) : 0,
                nightPct: total > 0 ? Math.round(nightCount / total * 100) : 0,
                isNode: r.location_type === 'intersection',
                _location_type: r.location_type
            };
        });
    };

    const _paintLocTypePie = (rows, mode) => {
        if (typeof createChart !== 'function') return;
        let intCount = 0, segCount = 0;
        (rows || []).forEach(r => {
            const t = r.total || 0;
            if (r.location_type === 'intersection') intCount += t;
            else segCount += t;
        });
        const canvasId = mode === 'pedestrian' ? 'chartPedLocationType' : 'chartBikeLocationType';
        const legendId = mode === 'pedestrian' ? 'pedLocationTypeLegend' : 'bikeLocationTypeLegend';
        const accentColor = mode === 'pedestrian' ? '#0891b2' : '#059669';
        if (intCount + segCount === 0) {
            if (typeof showChartPlaceholder === 'function') {
                showChartPlaceholder(canvasId, 'No location-type data for this scope');
            }
            return;
        }
        if (typeof clearChartPlaceholder === 'function') clearChartPlaceholder(canvasId);
        createChart(canvasId, 'doughnut', {
            labels: ['At Intersection', 'Non-Intersection'],
            datasets: [{
                data: [intCount, segCount],
                backgroundColor: [accentColor, '#94a3b8'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        }, { cutout: '50%', plugins: { legend: { display: false } } });
        const total = (intCount + segCount) || 1;
        const legendEl = document.getElementById(legendId);
        if (legendEl) {
            legendEl.innerHTML =
                '<div style="display:flex;align-items:center;gap:.5rem">'
              +   '<span style="width:12px;height:12px;background:' + accentColor + ';border-radius:2px"></span>'
              +   '<span style="flex:1">Intersection</span>'
              +   '<span style="font-weight:600">' + intCount + '</span>'
              +   '<span style="color:#64748b">(' + (intCount / total * 100).toFixed(1) + '%)</span>'
              + '</div>'
              + '<div style="display:flex;align-items:center;gap:.5rem">'
              +   '<span style="width:12px;height:12px;background:#94a3b8;border-radius:2px"></span>'
              +   '<span style="flex:1">Non-Intersection</span>'
              +   '<span style="font-weight:600">' + segCount + '</span>'
              +   '<span style="color:#64748b">(' + (segCount / total * 100).toFixed(1) + '%)</span>'
              + '</div>';
        }
    };

    // Fire the two fetches in parallel.
    const [pedRows, bikeRows] = await Promise.all([
        CL.data.cachedMatview('mv_pedbike_locations:pedestrian', tierResolved.tier, tierResolved.value,
            () => dc.getPedBikeLocations(tierResolved.tier, tierResolved.value, 'pedestrian', { limit: 50 }),
            { mode: 'pedestrian' }),
        CL.data.cachedMatview('mv_pedbike_locations:bicycle', tierResolved.tier, tierResolved.value,
            () => dc.getPedBikeLocations(tierResolved.tier, tierResolved.value, 'bicycle', { limit: 50 }),
            { mode: 'bicycle' })
    ]);

    // Pedestrian locations + pie
    if (Array.isArray(pedRows)) {
        const pedLocations = _hydrate(pedRows);
        if (pedLocations.length > 0) {
            pedAnalysisState.allLocations = pedLocations;
            renderPedLocationTable(pedLocations, 'route');
            // Auto-select first row if nothing chosen yet.
            if (pedAnalysisState.selectedLocations.length === 0) {
                pedAnalysisState.selectedLocations = [pedLocations[0]];
                if (typeof updatePedSelectionUI === 'function') updatePedSelectionUI();
                if (typeof updatePedDetailPanel === 'function') updatePedDetailPanel();
            }
        }
        _paintLocTypePie(pedRows, 'pedestrian');
    }

    // Bicycle locations + pie
    if (Array.isArray(bikeRows)) {
        const bikeLocations = _hydrate(bikeRows);
        if (bikeLocations.length > 0) {
            bikeAnalysisState.allLocations = bikeLocations;
            renderBikeLocationTable(bikeLocations, 'route');
            if (bikeAnalysisState.selectedLocations.length === 0) {
                bikeAnalysisState.selectedLocations = [bikeLocations[0]];
                if (typeof updateBikeSelectionUI === 'function') updateBikeSelectionUI();
                if (typeof updateBikeDetailPanel === 'function') updateBikeDetailPanel();
            }
        }
        _paintLocTypePie(bikeRows, 'bicycle');
    }
}

// ────────────────────────────────────────────────────────────────────────
// Round 12 — Pedestrian vs Bicycle Comparison table from matview categories.
// The legacy path computes byYear from sampleRows; at aggregate tiers we
// only have category-level totals, so render the metric rows that don't
// need year breakdowns.
// ────────────────────────────────────────────────────────────────────────
function renderPedBikeComparisonTableFromCats(categories) {
    const tbody = document.getElementById('pedBikeCompareBody');
    if (!tbody) return;
    const empty = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
    const ped = (categories && categories.pedestrian) || empty;
    const bike = (categories && categories.bicycle) || empty;
    const _calcEpdo = (sev) => (typeof calcEPDO === 'function')
        ? calcEPDO(sev)
        : ((sev?.K || 0) * 883 + (sev?.A || 0) * 94 + (sev?.B || 0) * 21 + (sev?.C || 0) * 11 + (sev?.O || 0));
    const pedEPDO = _calcEpdo(ped);
    const bikeEPDO = _calcEpdo(bike);
    const totalVRU = (ped.total || 0) + (bike.total || 0);
    const totalVRUK = (ped.K || 0) + (bike.K || 0);
    const totalVRUKA = ((ped.K || 0) + (ped.A || 0)) + ((bike.K || 0) + (bike.A || 0));
    const totalVRUEPDO = pedEPDO + bikeEPDO;
    const pedKARate = ped.total ? (((ped.K + ped.A) / ped.total) * 100).toFixed(1) : '0.0';
    const bikeKARate = bike.total ? (((bike.K + bike.A) / bike.total) * 100).toFixed(1) : '0.0';
    const allTotal = (typeof crashState !== 'undefined' && crashState && crashState.totalRows) || 0;
    const pedPct = allTotal > 0 ? (ped.total / allTotal * 100).toFixed(2) : '—';
    const bikePct = allTotal > 0 ? (bike.total / allTotal * 100).toFixed(2) : '—';
    const totalPct = allTotal > 0 ? (totalVRU / allTotal * 100).toFixed(2) : '—';

    tbody.innerHTML = `
        <tr><td><strong>Total Crashes</strong></td>
            <td style="text-align:center;font-size:1.1rem;font-weight:600;color:#0891b2">${(ped.total || 0).toLocaleString()}</td>
            <td style="text-align:center;font-size:1.1rem;font-weight:600;color:#059669">${(bike.total || 0).toLocaleString()}</td>
            <td style="text-align:center;font-size:1.1rem;font-weight:700">${totalVRU.toLocaleString()}</td></tr>
        <tr><td><strong>Fatal (K)</strong></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${ped.K || 0}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${bike.K || 0}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-K">${totalVRUK}</span></td></tr>
        <tr><td><strong>Serious Injury (K+A)</strong></td>
            <td style="text-align:center"><span class="severity-badge severity-A">${(ped.K || 0) + (ped.A || 0)}</span></td>
            <td style="text-align:center"><span class="severity-badge severity-A">${(bike.K || 0) + (bike.A || 0)}</span></td>
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
            <td style="text-align:center">${pedPct}%</td>
            <td style="text-align:center">${bikePct}%</td>
            <td style="text-align:center">${totalPct}%</td></tr>
    `;
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.render=CL.pedbike.render||{};
  window.renderPedBikeLocationsFromMatview=renderPedBikeLocationsFromMatview; CL.pedbike.render.renderPedBikeLocationsFromMatview=renderPedBikeLocationsFromMatview;
  window.renderPedBikeComparisonTableFromCats=renderPedBikeComparisonTableFromCats; CL.pedbike.render.renderPedBikeComparisonTableFromCats=renderPedBikeComparisonTableFromCats;
  CL._registerModule('pedbike/pedbike-tab-render');
})();
