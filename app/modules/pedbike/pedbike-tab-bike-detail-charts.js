/** CL pedbike.tab — 18d extracted (name-anchored) 2026-05-19.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Reads bikeAnalysisState (declared inline by 18c bike-core; window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Render Bicycle Monthly Heatmap (similar to Hot Spots)
function renderBikeMonthlyHeatmap(byMonth, years) {
    const container = document.getElementById('bikeDetailMonthlyHeatmap');
    if (!container || !byMonth) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const sortedYears = (years || []).filter(y => y !== 'Unknown').sort();

    if (sortedYears.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#64748b;font-size:.8rem">No data available</div>';
        return;
    }

    // Find max value for color scaling
    const values = Object.values(byMonth);
    const maxVal = Math.max(...values, 1);

    // Build heatmap HTML
    let html = '<div style="display:grid;grid-template-columns:auto repeat(12, 1fr);gap:2px;font-size:.7rem">';

    // Header row
    html += '<div></div>';
    months.forEach(m => {
        html += `<div style="text-align:center;color:#64748b;padding:2px">${m}</div>`;
    });

    // Data rows
    sortedYears.forEach(year => {
        html += `<div style="text-align:right;padding-right:4px;color:#64748b">${year}</div>`;
        for (let m = 1; m <= 12; m++) {
            const key = `${year}-${String(m).padStart(2, '0')}`;
            const count = byMonth[key] || 0;
            const intensity = count > 0 ? Math.min(count / maxVal, 1) : 0;
            const bgColor = count > 0
                ? `rgba(5, 150, 105, ${0.2 + intensity * 0.8})`  // Green for bicycle
                : '#f1f5f9';
            const textColor = intensity > 0.5 ? '#fff' : '#334155';
            html += `<div style="background:${bgColor};color:${textColor};text-align:center;padding:4px;border-radius:2px;font-weight:${count > 0 ? '600' : '400'}" title="${months[m-1]} ${year}: ${count} crashes">${count || ''}</div>`;
        }
    });

    html += '</div>';
    container.innerHTML = html;
}

function resetBikeFilters() {
    document.getElementById('bikeStartDate').value = '';
    document.getElementById('bikeEndDate').value = '';
    document.getElementById('bikeMinCrashes').value = '2';
    document.getElementById('bikeSortBy').value = 'epdo';
    document.getElementById('bikeGroupBy').value = 'route';
    bikeAnalysisState.filters = { fatal: false, ka: false, intersection: false, nighttime: false };
    // Reset bicycle filter chips by targeting chips with toggleBikeFilter onclick
    document.querySelectorAll('[onclick*="toggleBikeFilter"]').forEach(chip => chip.classList.remove('active'));
    applyBikeFilters();
}
  // ─── EXTRACTED CODE END ───
  window.renderBikeMonthlyHeatmap = renderBikeMonthlyHeatmap;
  window.resetBikeFilters = resetBikeFilters;
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  CL.pedbike.tab.renderBikeMonthlyHeatmap = renderBikeMonthlyHeatmap;
  CL.pedbike.tab.resetBikeFilters = resetBikeFilters;
  CL._registerModule('pedbike/pedbike-tab-bike-detail-charts');
})();
