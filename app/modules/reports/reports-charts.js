/**
 * CL reports.charts — extracted from app/index.html (name-anchored,
 * live L63954-L64021) on 2026-05-17. navigateTo-split round, prompt 42b3.
 *
 * Moved fns: createReportCharts, createSafetyCharts, createPedBikeCharts,
 *            createTrendCharts.
 * Depends (must load earlier): Chart.js global, reports/reports-standard-core
 *   (createChart helper) via the shared classic-script global lexical scope.
 * Public API (back-compat dual exposure): window.<fn> + CL.reports.charts.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L63954-L64021;
  //     CC 365 added the _rdsColor/_rdsSeverityPalette token helpers + swapped
  //     hard-coded severity hexes for design-token lookups — colors only) ───
// CC 365 — resolve a chart color from the report design-system CSS tokens,
// with a hard-coded hex fallback so charts still render if the custom
// property fails to resolve. Visual only — no chart-data changes.
function _rdsColor(name, fallback) {
    try {
        var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
        return v || fallback;
    } catch (e) { return fallback; }
}
// KABCO severity palette (K, A, B, C, O) sourced from the design tokens.
function _rdsSeverityPalette() {
    return [
        _rdsColor('--rds-fatal', '#b91c1c'),
        _rdsColor('--rds-serious', '#c2410c'),
        _rdsColor('--rds-moderate', '#b45309'),
        _rdsColor('--rds-minor', '#1d4ed8'),
        _rdsColor('--rds-pdo', '#475569')
    ];
}
// Report chart creation functions
function createReportCharts(stats, crashes) {
    const byType = {};
    crashes.forEach(c => { const t = c[COL.COLLISION]||'Unknown'; byType[t]=(byType[t]||0)+1; });
    const typeSorted = Object.entries(byType).sort((a,b) => b[1]-a[1]).slice(0,8);
    createChart('rptChartCollision', 'bar', {
        labels: typeSorted.map(t => t[0].substring(0,18)),
        datasets: [{ label: 'Crashes', data: typeSorted.map(t => t[1]), backgroundColor: _rdsColor('--rds-primary-2', '#1e40af') }]
    }, { indexAxis: 'y' });

    createChart('rptChartSeverity', 'doughnut', {
        labels: ['K','A','B','C','O'],
        datasets: [{ data: [stats.K, stats.A, stats.B, stats.C, stats.O], backgroundColor: _rdsSeverityPalette() }]
    });
}

function createSafetyCharts(severeCrashes) {
    const byType = {}, byLight = {};
    severeCrashes.forEach(c => {
        const t = c[COL.COLLISION]||'Unknown';
        const l = c[COL.LIGHT]||'Unknown';
        byType[t]=(byType[t]||0)+1;
        byLight[l]=(byLight[l]||0)+1;
    });
    
    const typeSorted = Object.entries(byType).sort((a,b) => b[1]-a[1]).slice(0,8);
    createChart('rptChartCollision', 'bar', {
        labels: typeSorted.map(t => t[0].substring(0,18)),
        datasets: [{ label: 'K+A Crashes', data: typeSorted.map(t => t[1]), backgroundColor: _rdsColor('--rds-fatal', '#b91c1c') }]
    }, { indexAxis: 'y' });
    
    const lightSorted = Object.entries(byLight).sort((a,b) => b[1]-a[1]).slice(0,6);
    createChart('rptChartLight', 'doughnut', {
        labels: lightSorted.map(l => l[0].substring(0,18)),
        datasets: [{ data: lightSorted.map(l => l[1]), backgroundColor: ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1','#14b8a6'] }]
    });
}

function createPedBikeCharts(pedCrashes, bikeCrashes) {
    const pedByHour = {}, bikeByHour = {};
    pedCrashes.forEach(c => { const h = getHour(c[COL.TIME]); if(h!==null) pedByHour[h]=(pedByHour[h]||0)+1; });
    bikeCrashes.forEach(c => { const h = getHour(c[COL.TIME]); if(h!==null) bikeByHour[h]=(bikeByHour[h]||0)+1; });
    
    const hours = Array.from({length:24}, (_,i) => i);
    createChart('rptChartPedTime', 'bar', {
        labels: hours.map(h => h.toString().padStart(2,'0')),
        datasets: [{ label: 'Ped', data: hours.map(h => pedByHour[h]||0), backgroundColor: _rdsColor('--rds-minor', '#0891b2') }]
    });
    createChart('rptChartBikeTime', 'bar', {
        labels: hours.map(h => h.toString().padStart(2,'0')),
        datasets: [{ label: 'Bike', data: hours.map(h => bikeByHour[h]||0), backgroundColor: _rdsColor('--rds-positive', '#059669') }]
    });
}

function createTrendCharts(byYear) {
    const years = Object.keys(byYear).sort();
    createChart('rptChartTrend', 'line', {
        labels: years,
        datasets: [{ label: 'Total Crashes', data: years.map(y => byYear[y].total), borderColor: _rdsColor('--rds-primary-2', '#1e40af'), backgroundColor: 'rgba(30,64,175,.1)', fill: true, tension: 0.3 }]
    });
    createChart('rptChartKATrend', 'line', {
        labels: years,
        datasets: [
            { label: 'Fatal', data: years.map(y => byYear[y].K), borderColor: _rdsColor('--rds-fatal', '#dc2626'), tension: 0.3 },
            { label: 'Serious', data: years.map(y => byYear[y].A), borderColor: _rdsColor('--rds-serious', '#ea580c'), tension: 0.3 }
        ]
    });
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.charts = CL.reports.charts || {};
  window.createReportCharts = createReportCharts; CL.reports.charts.createReportCharts = createReportCharts;
  window.createSafetyCharts = createSafetyCharts; CL.reports.charts.createSafetyCharts = createSafetyCharts;
  window.createPedBikeCharts = createPedBikeCharts; CL.reports.charts.createPedBikeCharts = createPedBikeCharts;
  window.createTrendCharts = createTrendCharts; CL.reports.charts.createTrendCharts = createTrendCharts;
  CL._registerModule('reports/reports-charts');
})();
