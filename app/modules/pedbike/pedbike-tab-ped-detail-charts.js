/** CL pedbike.tab18b-2 — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Responsibility: Pedestrian detail-panel Chart.js builders + heatmap +
 *  filter reset + location-type chart. `pedDetailCharts` is module-private.
 *  Reads inline shared pedAnalysisState (global fall-through); calls
 *  applyPedFilters/createChart/isIntersection at runtime.
 *  Depends on (load before): pedbike/pedbike-tab-ped-detail. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Pedestrian detail panel chart instances
const pedDetailCharts = {};

// Initialize Pedestrian Detail Panel Charts
function initPedDetailCharts(data) {
    // Destroy existing charts
    Object.values(pedDetailCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });

    // Yearly trend chart
    const yearCtx = document.getElementById('pedDetailYearChart');
    if (yearCtx) {
        pedDetailCharts.year = new Chart(yearCtx, {
            type: 'bar',
            data: {
                labels: data.years,
                datasets: [
                    { label: 'Total', data: data.years.map(y => data.byYear[y]?.total || 0), backgroundColor: '#0891b2', borderRadius: 4 },
                    { label: 'K+A', data: data.years.map(y => (data.byYear[y]?.K || 0) + (data.byYear[y]?.A || 0)), backgroundColor: '#dc2626', borderRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Time of day chart
    const timeCtx = document.getElementById('pedDetailTimeChart');
    if (timeCtx) {
        const hours = Array.from({length: 24}, (_, i) => i);
        pedDetailCharts.time = new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{ label: 'Crashes', data: hours.map(h => data.byHour[h] || 0), backgroundColor: '#6366f1', borderRadius: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { maxRotation: 45, font: { size: 8 } } } } }
        });
    }

    // Day of week chart
    const dowCtx = document.getElementById('pedDetailDOWChart');
    if (dowCtx) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        pedDetailCharts.dow = new Chart(dowCtx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{ label: 'Crashes', data: days.map((_, i) => data.byDOW[i] || 0), backgroundColor: '#6366f1', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Helper to clean chart labels (strip leading numbers like "1. ", "12. ")
    const cleanLabel = (label, maxLen = 20) => {
        const cleaned = label.replace(/^\d+\.\s*/, '');
        return cleaned.length > maxLen ? cleaned.substring(0, maxLen) + '...' : cleaned;
    };

    // Collision types chart
    const collisionCtx = document.getElementById('pedDetailCollisionChart');
    if (collisionCtx) {
        const collisions = Object.entries(data.byCollision).sort((a, b) => b[1] - a[1]).slice(0, 8);
        pedDetailCharts.collision = new Chart(collisionCtx, {
            type: 'bar',
            data: {
                labels: collisions.map(c => cleanLabel(c[0])),
                datasets: [{ label: 'Crashes', data: collisions.map(c => c[1]), backgroundColor: '#7c3aed', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // Severity chart
    const sevCtx = document.getElementById('pedDetailSeverityChart');
    if (sevCtx) {
        const sevColors = ['#dc2626', '#ea580c', '#eab308', '#22c55e', '#64748b'];
        pedDetailCharts.severity = new Chart(sevCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fatal (K)', 'Serious (A)', 'Minor (B)', 'Possible (C)', 'PDO (O)'],
                datasets: [{ data: [data.severity.K, data.severity.A, data.severity.B, data.severity.C, data.severity.O], backgroundColor: sevColors, borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Weather chart
    const weatherCtx = document.getElementById('pedDetailWeatherChart');
    if (weatherCtx) {
        const weather = Object.entries(data.byWeather).sort((a, b) => b[1] - a[1]).slice(0, 5);
        pedDetailCharts.weather = new Chart(weatherCtx, {
            type: 'doughnut',
            data: {
                labels: weather.map(w => cleanLabel(w[0])),
                datasets: [{ data: weather.map(w => w[1]), backgroundColor: ['#3b82f6', '#64748b', '#f59e0b', '#10b981', '#8b5cf6'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Light conditions chart
    const lightCtx = document.getElementById('pedDetailLightChart');
    if (lightCtx) {
        const light = Object.entries(data.byLight).sort((a, b) => b[1] - a[1]).slice(0, 5);
        pedDetailCharts.light = new Chart(lightCtx, {
            type: 'doughnut',
            data: {
                labels: light.map(l => cleanLabel(l[0])),
                datasets: [{ data: light.map(l => l[1]), backgroundColor: ['#fcd34d', '#1e293b', '#94a3b8', '#f97316', '#6366f1'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Road surface chart
    const surfaceCtx = document.getElementById('pedDetailSurfaceChart');
    if (surfaceCtx) {
        const surface = Object.entries(data.bySurface).sort((a, b) => b[1] - a[1]).slice(0, 5);
        pedDetailCharts.surface = new Chart(surfaceCtx, {
            type: 'doughnut',
            data: {
                labels: surface.map(s => cleanLabel(s[0])),
                datasets: [{ data: surface.map(s => s[1]), backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#64748b', '#ef4444'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Traffic Control chart
    const controlCtx = document.getElementById('pedDetailControlChart');
    if (controlCtx && data.byTrafficControl) {
        const control = Object.entries(data.byTrafficControl).sort((a, b) => b[1] - a[1]).slice(0, 6);
        pedDetailCharts.control = new Chart(controlCtx, {
            type: 'bar',
            data: {
                labels: control.map(c => cleanLabel(c[0])),
                datasets: [{ label: 'Crashes', data: control.map(c => c[1]), backgroundColor: '#0891b2', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // Monthly heatmap
    renderPedMonthlyHeatmap(data.byMonth, data.years);
}

// Render Pedestrian Monthly Heatmap (similar to Hot Spots)
function renderPedMonthlyHeatmap(byMonth, years) {
    const container = document.getElementById('pedDetailMonthlyHeatmap');
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
                ? `rgba(8, 145, 178, ${0.2 + intensity * 0.8})`
                : '#f1f5f9';
            const textColor = intensity > 0.5 ? '#fff' : '#334155';
            html += `<div style="background:${bgColor};color:${textColor};text-align:center;padding:4px;border-radius:2px;font-weight:${count > 0 ? '600' : '400'}" title="${months[m-1]} ${year}: ${count} crashes">${count || ''}</div>`;
        }
    });

    html += '</div>';
    container.innerHTML = html;
}

// Reset Pedestrian filters
function resetPedFilters() {
    document.getElementById('pedStartDate').value = '';
    document.getElementById('pedEndDate').value = '';
    document.getElementById('pedMinCrashes').value = '2';
    document.getElementById('pedSortBy').value = 'epdo';
    document.getElementById('pedGroupBy').value = 'route';
    pedAnalysisState.filters = { fatal: false, ka: false, intersection: false, nighttime: false };
    document.querySelectorAll('#tab-pedestrian .filter-chip').forEach(chip => chip.classList.remove('active'));
    applyPedFilters();
}

// Update Pedestrian Location Type Chart
function updatePedLocationTypeChart(crashes) {
    let intCount = 0, nonIntCount = 0;
    crashes.forEach(c => {
        if (isIntersection(c)) intCount++;
        else nonIntCount++;
    });

    createChart('chartPedLocationType', 'doughnut', {
        labels: ['At Intersection', 'Non-Intersection'],
        datasets: [{ data: [intCount, nonIntCount], backgroundColor: ['#0891b2', '#94a3b8'], borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    const total = crashes.length || 1;
    document.getElementById('pedLocationTypeLegend').innerHTML = `
        <div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:#0891b2;border-radius:2px"></span>
            <span style="flex:1">Intersection</span>
            <span style="font-weight:600">${intCount}</span>
            <span style="color:#64748b">(${(intCount/total*100).toFixed(1)}%)</span>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:#94a3b8;border-radius:2px"></span>
            <span style="flex:1">Non-Intersection</span>
            <span style="font-weight:600">${nonIntCount}</span>
            <span style="color:#64748b">(${(nonIntCount/total*100).toFixed(1)}%)</span>
        </div>
    `;
}
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  window.initPedDetailCharts=initPedDetailCharts; CL.pedbike.tab.initPedDetailCharts=initPedDetailCharts;
  window.renderPedMonthlyHeatmap=renderPedMonthlyHeatmap; CL.pedbike.tab.renderPedMonthlyHeatmap=renderPedMonthlyHeatmap;
  window.resetPedFilters=resetPedFilters; CL.pedbike.tab.resetPedFilters=resetPedFilters;
  window.updatePedLocationTypeChart=updatePedLocationTypeChart; CL.pedbike.tab.updatePedLocationTypeChart=updatePedLocationTypeChart;
  CL._registerModule('pedbike/pedbike-tab-ped-detail-charts');
})();
