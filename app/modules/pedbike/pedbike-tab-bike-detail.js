/** CL pedbike.tab — 18d extracted (name-anchored) 2026-05-19.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Reads bikeAnalysisState (declared inline by 18c bike-core; window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Bicycle detail panel chart instances
const bikeDetailCharts = {};

// Update Bicycle Detail Panel (Enriched - Hot Spots style)
async function updateBikeDetailPanel() {
    const selected = bikeAnalysisState.selectedLocations;
    if (selected.length === 0) return;

    document.getElementById('bikeDetailPanel').style.display = 'block';
    document.getElementById('bikeDetailTitle').textContent = `Analysis: ${selected.map(s => s.isNode ? formatNodeId(s.location) : s.location.substring(0,20)).join(', ')}`;

    // Aggregate data from selected locations
    const allCrashes = selected.flatMap(s => s.crashes);
    let totalCrashes = allCrashes.length;
    const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    const byCollision = {};
    const byLight = {};
    const byWeather = {};
    const bySurface = {};
    const byTrafficControl = {};
    const byMonth = {};  // For monthly heatmap: { '2023-01': count, ... }
    const byYear = {};
    const byDOW = [0,0,0,0,0,0,0];
    const byHour = {};
    let intCount = 0, nightCount = 0, alcoholCount = 0, speedCount = 0;
    let distractedCount = 0, drowsyCount = 0, drugCount = 0, hitrunCount = 0;
    let seniorCount = 0, youngCount = 0;
    let workZoneCount = 0, schoolZoneCount = 0;

    // Round 23 §2 — matview fallback (mirrors ped panel).
    let _useMatview = false;
    if (allCrashes.length === 0) {
        const agg = await _fetchPedBikeDetailAggregates('bike', selected.map(s => s.location));
        if (agg && agg.total > 0) {
            _useMatview = true;
            totalCrashes = agg.total;
            Object.assign(severity, agg.severity);
            Object.assign(byCollision, agg.byCollision);
            Object.assign(byLight, agg.byLight);
            Object.assign(byWeather, agg.byWeather);
            Object.assign(bySurface, agg.bySurface);
            Object.assign(byTrafficControl, agg.byTrafficControl);
            Object.assign(byYear, agg.byYear);
            console.log('[BikeDetail] matview fallback hydrated total=' + totalCrashes + ' for ' + selected.length + ' location(s)');
            // Round 24 §2 — populate the per-dim widgets the matview can't
            // (collision/weather/surface/trafficcontrol/demographics/monthly
            // heatmap/time-of-day/contributing-factors) by running the existing
            // per-row aggregator over the raw crashes we fetched alongside the
            // matview. Headline KPI (totalCrashes = agg.total) is preserved.
            if (Array.isArray(agg.rawCrashes) && agg.rawCrashes.length > 0) {
                _useMatview = false;             // flip the flag so the per-row aggregator below runs
                allCrashes.push(...agg.rawCrashes);
                // Reset ALL per-dim accumulators we hydrated from the matview —
                // the per-row aggregator increments them from zero, so leaving
                // matview values in place would double-count.
                ['K','A','B','C','O'].forEach(k => { severity[k] = 0; });
                Object.keys(byCollision).forEach(k => delete byCollision[k]);
                Object.keys(byLight).forEach(k => delete byLight[k]);
                Object.keys(byWeather).forEach(k => delete byWeather[k]);
                Object.keys(bySurface).forEach(k => delete bySurface[k]);
                Object.keys(byTrafficControl).forEach(k => delete byTrafficControl[k]);
                Object.keys(byYear).forEach(k => delete byYear[k]);
                console.log('[BikeDetail] raw rows used: ' + agg.rawCrashes.length);
            }
        }
    }

    if (!_useMatview) allCrashes.forEach(c => {
        const sev = (c[COL.SEVERITY]||'').charAt(0);
        if (severity[sev] !== undefined) severity[sev]++;

        const collision = c[COL.COLLISION] || 'Unknown';
        byCollision[collision] = (byCollision[collision] || 0) + 1;

        const light = c[COL.LIGHT] || 'Unknown';
        byLight[light] = (byLight[light] || 0) + 1;

        const weather = (c[COL.WEATHER] || '').trim() || 'Unknown';
        byWeather[weather] = (byWeather[weather] || 0) + 1;

        const surface = (c[COL.SURFACE] || '').trim() || 'Unknown';
        bySurface[surface] = (bySurface[surface] || 0) + 1;

        // Traffic Control
        const trafficCtrl = c[COL.TRAFFIC_CTRL] || 'Unknown';
        byTrafficControl[trafficCtrl] = (byTrafficControl[trafficCtrl] || 0) + 1;

        // Year
        const year = c[COL.YEAR] || 'Unknown';
        if (!byYear[year]) byYear[year] = { total: 0, K: 0, A: 0 };
        byYear[year].total++;
        if (sev === 'K') byYear[year].K++;
        if (sev === 'A') byYear[year].A++;

        // Day of week and Month - try multiple date parsing approaches
        const dateVal = c[COL.DATE];
        if (dateVal) {
            let d = new Date(Number(dateVal));
            // If timestamp parsing fails, try string date parsing
            if (isNaN(d.getTime())) {
                d = new Date(dateVal);
            }
            if (!isNaN(d.getTime())) {
                byDOW[d.getDay()]++;
                // Monthly heatmap data
                const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
            }
        }

        // Hour
        const timeStr = c[COL.TIME] || '';
        if (timeStr.length >= 2) {
            const hour = parseInt(timeStr.substring(0, 2));
            if (!isNaN(hour)) byHour[hour] = (byHour[hour] || 0) + 1;
        }

        if (isIntersection(c)) intCount++;
        if (isYes(c[COL.NIGHT])) nightCount++;
        if (isYes(c[COL.ALCOHOL])) alcoholCount++;
        if (isYes(c[COL.SPEED])) speedCount++;
        if (isYes(c[COL.DISTRACTED])) distractedCount++;
        if (isYes(c[COL.DROWSY])) drowsyCount++;
        if (isYes(c[COL.DRUG])) drugCount++;
        if (isYes(c[COL.HITRUN])) hitrunCount++;
        if (isYes(c[COL.SENIOR])) seniorCount++;
        if (isYes(c[COL.YOUNG])) youngCount++;
        if (isYes(c[COL.WORKZONE])) workZoneCount++;
        if (isYes(c[COL.SCHOOL])) schoolZoneCount++;
    });

    const epdo = calcEPDO(severity);
    const kaRate = totalCrashes > 0 ? ((severity.K + severity.A) / totalCrashes * 100) : 0;

    // Calculate YoY trend
    const years = Object.keys(byYear).filter(y => y !== 'Unknown').sort();
    let yoyTrend = 0, trendDirection = 'neutral';
    if (years.length >= 2) {
        const lastYear = byYear[years[years.length - 1]]?.total || 0;
        const prevYear = byYear[years[years.length - 2]]?.total || 0;
        if (prevYear > 0) {
            yoyTrend = ((lastYear - prevYear) / prevYear * 100);
            trendDirection = yoyTrend < -5 ? 'below' : yoyTrend > 5 ? 'above' : 'neutral';
        }
    }

    // Get county benchmarks for comparison
    const sampleTotal = crashState.sampleRows.length || 1;
    const countyAlcohol = crashState.sampleRows.filter(r => isYes(r[COL.ALCOHOL])).length / sampleTotal * 100;
    const countySpeed = crashState.sampleRows.filter(r => isYes(r[COL.SPEED])).length / sampleTotal * 100;
    const countyDistracted = crashState.sampleRows.filter(r => isYes(r[COL.DISTRACTED])).length / sampleTotal * 100;
    const countyDrowsy = crashState.sampleRows.filter(r => isYes(r[COL.DROWSY])).length / sampleTotal * 100;
    const countyDrug = crashState.sampleRows.filter(r => isYes(r[COL.DRUG])).length / sampleTotal * 100;
    const countyHitrun = crashState.sampleRows.filter(r => isYes(r[COL.HITRUN])).length / sampleTotal * 100;

    // Helper to render factor comparison row
    const renderBikeFactorRow = (icon, label, count, benchmark, color) => {
        const pct = totalCrashes > 0 ? (count / totalCrashes * 100) : 0;
        const diff = pct - benchmark;
        const benchmarkClass = diff > 1 ? 'above' : diff < -1 ? 'below' : 'neutral';
        const maxPct = Math.max(pct, benchmark, 1) * 1.2;
        return `<div class="hotspot-factor-row">
            <div class="hotspot-factor-icon">${icon}</div>
            <div class="hotspot-factor-label">${label}</div>
            <div class="hotspot-factor-bar"><div class="hotspot-factor-fill" style="width:${(pct / maxPct * 100).toFixed(1)}%;background:${color}"></div></div>
            <div class="hotspot-factor-value" style="color:${color}">${pct.toFixed(1)}%</div>
            <div class="hotspot-factor-benchmark">
                <span class="hotspot-kpi-benchmark ${benchmarkClass}" style="position:static">${diff > 0 ? '↑' : diff < 0 ? '↓' : '→'}</span>
                <span style="color:#64748b">${benchmark.toFixed(1)}% avg</span>
            </div>
        </div>`;
    };

    // Dark and adverse weather counts for special zones
    const darkCount = Object.entries(byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s, [,v]) => s + v, 0);
    const adverseWeatherCount = Object.entries(byWeather).filter(([k]) => !k.toLowerCase().includes('clear') && k !== 'Unknown').reduce((s, [,v]) => s + v, 0);

    // Build enriched detail panel HTML
    const html = `
        <!-- KPI Summary Row -->
        <div class="hotspot-kpi-row">
            <div class="hotspot-kpi">
                <div class="hotspot-kpi-icon">🚴</div>
                <div class="hotspot-kpi-value">${totalCrashes.toLocaleString()}</div>
                <div class="hotspot-kpi-label">Total Crashes</div>
                <div class="hotspot-kpi-sublabel">${selected.length} location(s)</div>
            </div>
            <div class="hotspot-kpi">
                <div class="hotspot-kpi-icon">⚠️</div>
                <div class="hotspot-kpi-value">${kaRate.toFixed(1)}%</div>
                <div class="hotspot-kpi-label">KA Rate</div>
                <div class="hotspot-kpi-sublabel">${severity.K + severity.A} fatal/serious</div>
            </div>
            <div class="hotspot-kpi">
                <div class="hotspot-kpi-icon">📈</div>
                <div class="hotspot-kpi-value">${epdo.toLocaleString()}</div>
                <div class="hotspot-kpi-label">EPDO Score</div>
                <div class="hotspot-kpi-sublabel">Severity-weighted</div>
            </div>
            <div class="hotspot-kpi">
                <div class="hotspot-kpi-icon">🚦</div>
                <div class="hotspot-kpi-value">${totalCrashes > 0 ? ((intCount/totalCrashes)*100).toFixed(0) : 0}%</div>
                <div class="hotspot-kpi-label">At Intersections</div>
                <div class="hotspot-kpi-sublabel">${intCount} crashes</div>
            </div>
            <div class="hotspot-kpi">
                <span class="hotspot-kpi-benchmark ${trendDirection}">${yoyTrend > 0 ? '↑' : yoyTrend < 0 ? '↓' : '→'}</span>
                <div class="hotspot-kpi-icon">📉</div>
                <div class="hotspot-kpi-value">${yoyTrend > 0 ? '+' : ''}${yoyTrend.toFixed(1)}%</div>
                <div class="hotspot-kpi-label">YoY Trend</div>
                <div class="hotspot-kpi-sublabel">${trendDirection === 'below' ? 'Improving' : trendDirection === 'above' ? 'Worsening' : 'Stable'}</div>
            </div>
        </div>

        <!-- Temporal Analysis Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">📅 Temporal Analysis</div>
            <div class="hotspot-charts-grid">
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Yearly Trend</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailYearChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Monthly Heatmap</div>
                    <div id="bikeDetailMonthlyHeatmap" style="padding:.5rem"></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Time of Day</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailTimeChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Day of Week</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailDOWChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Crash Characteristics Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">💥 Crash Characteristics</div>
            <div class="hotspot-charts-grid">
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Collision Types</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailCollisionChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Severity Breakdown</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailSeverityChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Traffic Control</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailControlChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Environmental Conditions Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">🌤️ Environmental Conditions</div>
            <div class="hotspot-charts-grid">
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Weather Conditions</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailWeatherChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Light Conditions</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailLightChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Road Surface</div>
                    <div class="hotspot-chart-container"><canvas id="bikeDetailSurfaceChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Contributing Factors Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">🔍 Contributing Factors (vs County Average)</div>
            <div class="hotspot-factors-grid">
                ${renderBikeFactorRow('🍺', 'Alcohol-Related', alcoholCount, countyAlcohol, '#ef4444')}
                ${renderBikeFactorRow('🚗', 'Speed-Related', speedCount, countySpeed, '#f59e0b')}
                ${renderBikeFactorRow('📱', 'Distracted Driving', distractedCount, countyDistracted, '#3b82f6')}
                ${renderBikeFactorRow('😴', 'Drowsy Driving', drowsyCount, countyDrowsy, '#8b5cf6')}
                ${renderBikeFactorRow('💊', 'Drug-Related', drugCount, countyDrug, '#ec4899')}
                ${renderBikeFactorRow('🏃', 'Hit-and-Run', hitrunCount, countyHitrun, '#64748b')}
            </div>
        </div>

        <!-- Demographics Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">👥 Demographics & Special Zones</div>
            <div class="hotspot-vru-grid">
                <div class="hotspot-vru-card senior">
                    <div class="hotspot-vru-icon">👴</div>
                    <div class="hotspot-vru-value">${seniorCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (seniorCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">Senior (65+)</div>
                </div>
                <div class="hotspot-vru-card young">
                    <div class="hotspot-vru-icon">👶</div>
                    <div class="hotspot-vru-value">${youngCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (youngCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">Young (&lt;25)</div>
                </div>
                <div class="hotspot-vru-card">
                    <div class="hotspot-vru-icon">🚧</div>
                    <div class="hotspot-vru-value">${workZoneCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (workZoneCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">Work Zone</div>
                </div>
                <div class="hotspot-vru-card">
                    <div class="hotspot-vru-icon">🏫</div>
                    <div class="hotspot-vru-value">${schoolZoneCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (schoolZoneCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">School Zone</div>
                </div>
                <div class="hotspot-vru-card">
                    <div class="hotspot-vru-icon">🌙</div>
                    <div class="hotspot-vru-value">${darkCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (darkCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">Dark Conditions</div>
                </div>
                <div class="hotspot-vru-card">
                    <div class="hotspot-vru-icon">🌧️</div>
                    <div class="hotspot-vru-value">${adverseWeatherCount}</div>
                    <div class="hotspot-vru-pct">${totalCrashes > 0 ? (adverseWeatherCount / totalCrashes * 100).toFixed(1) : 0}%</div>
                    <div class="hotspot-vru-label">Adverse Weather</div>
                </div>
            </div>
        </div>

        <!-- Recommended Countermeasures -->
        <div style="margin-top:1rem;padding:.75rem;background:#f0fdf4;border-radius:var(--radius);border:1px solid #10b981">
            <strong style="color:#059669">💡 Recommended Countermeasures:</strong>
            <div style="margin-top:.5rem;font-size:.85rem;color:#047857">
                ${intCount/totalCrashes > 0.5 ? '• Bike boxes and advanced stop lines at intersections<br>' : ''}
                ${nightCount/totalCrashes > 0.3 ? '• Enhanced lighting along bicycle corridors<br>' : ''}
                ${speedCount > 0 ? '• Traffic calming measures and speed reduction strategies<br>' : ''}
                • Protected bike lanes separated from traffic<br>
                • Intersection improvements (bike signals, conflict markings)<br>
                • Raised crossings at conflict points
            </div>
        </div>
    `;

    document.getElementById('bikeDetailBody').innerHTML = html;

    // Initialize charts after DOM update
    initBikeDetailCharts({ severity, byCollision, byLight, byWeather, bySurface, byTrafficControl, byMonth, byYear, byDOW, byHour, years });
}

// Initialize Bicycle Detail Panel Charts
function initBikeDetailCharts(data) {
    // Destroy existing charts
    Object.values(bikeDetailCharts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') chart.destroy();
    });

    // Helper to clean chart labels (strip leading numbers like "1. ", "12. ")
    const cleanLabel = (label, maxLen = 20) => {
        const cleaned = label.replace(/^\d+\.\s*/, '');
        return cleaned.length > maxLen ? cleaned.substring(0, maxLen) + '...' : cleaned;
    };

    // Yearly trend chart
    const yearCtx = document.getElementById('bikeDetailYearChart');
    if (yearCtx) {
        bikeDetailCharts.year = new Chart(yearCtx, {
            type: 'bar',
            data: {
                labels: data.years,
                datasets: [
                    { label: 'Total', data: data.years.map(y => data.byYear[y]?.total || 0), backgroundColor: '#059669', borderRadius: 4 },
                    { label: 'K+A', data: data.years.map(y => (data.byYear[y]?.K || 0) + (data.byYear[y]?.A || 0)), backgroundColor: '#dc2626', borderRadius: 4 }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Time of day chart
    const timeCtx = document.getElementById('bikeDetailTimeChart');
    if (timeCtx) {
        const hours = Array.from({length: 24}, (_, i) => i);
        bikeDetailCharts.time = new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: hours.map(h => `${h}:00`),
                datasets: [{ label: 'Crashes', data: hours.map(h => data.byHour[h] || 0), backgroundColor: '#10b981', borderRadius: 2 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true }, x: { ticks: { maxRotation: 45, font: { size: 8 } } } } }
        });
    }

    // Day of week chart
    const dowCtx = document.getElementById('bikeDetailDOWChart');
    if (dowCtx) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        bikeDetailCharts.dow = new Chart(dowCtx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{ label: 'Crashes', data: days.map((_, i) => data.byDOW[i] || 0), backgroundColor: '#10b981', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        });
    }

    // Collision types chart (with cleaned labels)
    const collisionCtx = document.getElementById('bikeDetailCollisionChart');
    if (collisionCtx) {
        const collisions = Object.entries(data.byCollision).sort((a, b) => b[1] - a[1]).slice(0, 8);
        bikeDetailCharts.collision = new Chart(collisionCtx, {
            type: 'bar',
            data: {
                labels: collisions.map(c => cleanLabel(c[0])),
                datasets: [{ label: 'Crashes', data: collisions.map(c => c[1]), backgroundColor: '#059669', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // Severity chart
    const sevCtx = document.getElementById('bikeDetailSeverityChart');
    if (sevCtx) {
        const sevColors = ['#dc2626', '#ea580c', '#eab308', '#22c55e', '#64748b'];
        bikeDetailCharts.severity = new Chart(sevCtx, {
            type: 'doughnut',
            data: {
                labels: ['Fatal (K)', 'Serious (A)', 'Minor (B)', 'Possible (C)', 'PDO (O)'],
                datasets: [{ data: [data.severity.K, data.severity.A, data.severity.B, data.severity.C, data.severity.O], backgroundColor: sevColors, borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Traffic Control chart
    const controlCtx = document.getElementById('bikeDetailControlChart');
    if (controlCtx && data.byTrafficControl) {
        const control = Object.entries(data.byTrafficControl).sort((a, b) => b[1] - a[1]).slice(0, 6);
        bikeDetailCharts.control = new Chart(controlCtx, {
            type: 'bar',
            data: {
                labels: control.map(c => cleanLabel(c[0])),
                datasets: [{ label: 'Crashes', data: control.map(c => c[1]), backgroundColor: '#059669', borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }
        });
    }

    // Weather chart
    const weatherCtx = document.getElementById('bikeDetailWeatherChart');
    if (weatherCtx) {
        const weather = Object.entries(data.byWeather).sort((a, b) => b[1] - a[1]).slice(0, 5);
        bikeDetailCharts.weather = new Chart(weatherCtx, {
            type: 'doughnut',
            data: {
                labels: weather.map(w => cleanLabel(w[0])),
                datasets: [{ data: weather.map(w => w[1]), backgroundColor: ['#3b82f6', '#64748b', '#f59e0b', '#10b981', '#8b5cf6'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Light conditions chart
    const lightCtx = document.getElementById('bikeDetailLightChart');
    if (lightCtx) {
        const light = Object.entries(data.byLight).sort((a, b) => b[1] - a[1]).slice(0, 5);
        bikeDetailCharts.light = new Chart(lightCtx, {
            type: 'doughnut',
            data: {
                labels: light.map(l => cleanLabel(l[0])),
                datasets: [{ data: light.map(l => l[1]), backgroundColor: ['#fcd34d', '#1e293b', '#94a3b8', '#f97316', '#6366f1'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Road surface chart
    const surfaceCtx = document.getElementById('bikeDetailSurfaceChart');
    if (surfaceCtx) {
        const surface = Object.entries(data.bySurface).sort((a, b) => b[1] - a[1]).slice(0, 5);
        bikeDetailCharts.surface = new Chart(surfaceCtx, {
            type: 'doughnut',
            data: {
                labels: surface.map(s => cleanLabel(s[0])),
                datasets: [{ data: surface.map(s => s[1]), backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b', '#64748b', '#ef4444'], borderWidth: 2, borderColor: '#fff' }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } }
        });
    }

    // Monthly heatmap
    renderBikeMonthlyHeatmap(data.byMonth, data.years);
}
  // ─── EXTRACTED CODE END ───
  window.updateBikeDetailPanel = updateBikeDetailPanel;
  window.initBikeDetailCharts = initBikeDetailCharts;
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  CL.pedbike.tab.updateBikeDetailPanel = updateBikeDetailPanel;
  CL.pedbike.tab.initBikeDetailCharts = initBikeDetailCharts;
  CL._registerModule('pedbike/pedbike-tab-bike-detail');
})();
