/**
 * Safety Focus — Detail Panel Charts
 * Extracted from app/index.html (CC 201 Pass B). Verbatim block.
 *
 * Fns: initSfDetailCharts
 *
 * Reads inline globals: safetyState, sfDetailState (mirrored to window.*).
 * Requires Chart.js (loaded earlier via CDN).
 */
(function () {
    'use strict';


function initSfDetailCharts() {
    const data = sfDetailState.aggregatedData;
    if (!data) return;

    // Destroy existing charts
    Object.values(sfDetailState.charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });
    sfDetailState.charts = {};

    if (sfDetailState.viewMode === 'combined') {
        initSfCombinedCharts(data);
    } else {
        initSfCompareCharts(data);
    }
}

    // ===== CC 201 dual-API exposure =====
    window.CL = window.CL || {};
    CL.safety = CL.safety || {};
    CL.safety.charts = CL.safety.charts || {};
    Object.assign(CL.safety.charts, { initSfDetailCharts });
    Object.assign(window, CL.safety.charts);

    CL._registerModule('safety/charts');
})();
