/** CL intersection.tab (detail) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md + MODULAR_PLAN_PROMPT_17-v2_VERIFY.md.
 *  Verbatim. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L55546-L55878) ───
// Aggregate crash data for selected intersections
function aggregateIntDetailData() {
    const startDate = intFilters.startDate ? new Date(intFilters.startDate) : null;
    let endDate = intFilters.endDate ? new Date(intFilters.endDate) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);
    const peakHours = intDetailState.peakHours;

    const data = {
        total: 0, severity: { K: 0, A: 0, B: 0, C: 0, O: 0 }, epdo: 0,
        byYear: {}, byMonth: {}, byDOW: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        byHour: {}, byPeakPeriod: { am: 0, midday: 0, pm: 0, night: 0 },
        byCollision: {}, byWeather: {}, byLight: {}, bySurface: {},
        byTrafficControl: {}, byCtrlStatus: {}, byIntType: {}, byFirstHarmful: {},
        factors: { alcohol: 0, speed: 0, distracted: 0, drowsy: 0, drug: 0, hitrun: 0 },
        vru: { pedestrian: { total: 0, K: 0, A: 0 }, bicycle: { total: 0, K: 0, A: 0 }, motorcycle: { total: 0, K: 0, A: 0 } },
        demographics: { senior: 0, young: 0, unrestrained: 0 },
        specialZones: { workZone: 0, schoolZone: 0 },
        crashes: [], byLocation: {}
    };

    const selectedNodes = intDetailState.selectedLocations.map(loc => String(loc.node));
    intDetailState.selectedLocations.forEach(loc => {
        data.byLocation[loc.node] = {
            total: 0, severity: { K: 0, A: 0, B: 0, C: 0, O: 0 }, routes: loc.routes,
            byYear: {}, byCollision: {}, byFirstHarmful: {},
            factors: { alcohol: 0, speed: 0, distracted: 0, drowsy: 0 },
            vru: { pedestrian: 0, bicycle: 0 }, trafficCtrl: '', intType: ''
        };
    });

    crashState.sampleRows.forEach(row => {
        const node = String(row[COL.NODE] || '');
        if (!selectedNodes.includes(node)) return;

        if (startDate || endDate) {
            const dateStr = row[COL.DATE];
            if (!dateStr) return;
            const crashDate = new Date(Number(dateStr));
            if (isNaN(crashDate.getTime())) return;
            if (startDate && crashDate < startDate) return;
            if (endDate && crashDate > endDate) return;
        }

        data.crashes.push(row);
        data.total++;

        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        if (['K','A','B','C','O'].includes(sev)) {
            data.severity[sev]++;
            data.byLocation[node].severity[sev]++;
        }
        data.byLocation[node].total++;

        const year = row[COL.YEAR];
        if (year) {
            data.byYear[year] = data.byYear[year] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            data.byYear[year].total++;
            if (['K','A','B','C','O'].includes(sev)) data.byYear[year][sev]++;
            data.byLocation[node].byYear[year] = (data.byLocation[node].byYear[year] || 0) + 1;
        }

        const dateStr = row[COL.DATE];
        if (dateStr) {
            const d = new Date(Number(dateStr));
            if (!isNaN(d.getTime())) {
                const monthYear = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                data.byMonth[monthYear] = (data.byMonth[monthYear] || 0) + 1;
                data.byDOW[d.getDay()]++;
            }
        }

        const time = row[COL.TIME];
        if (time) {
            const hour = getHour(time) || 0;
            data.byHour[hour] = (data.byHour[hour] || 0) + 1;
            if (isInIntPeakPeriod(time, peakHours.am.start, peakHours.am.end)) data.byPeakPeriod.am++;
            else if (isInIntPeakPeriod(time, peakHours.midday.start, peakHours.midday.end)) data.byPeakPeriod.midday++;
            else if (isInIntPeakPeriod(time, peakHours.pm.start, peakHours.pm.end)) data.byPeakPeriod.pm++;
            else data.byPeakPeriod.night++;
        }

        const collision = (row[COL.COLLISION] || '').trim() || 'Unknown';
        data.byCollision[collision] = (data.byCollision[collision] || 0) + 1;
        data.byLocation[node].byCollision[collision] = (data.byLocation[node].byCollision[collision] || 0) + 1;

        const firstHarmful = (row[COL.FIRST_HARMFUL] || '').trim() || 'Unknown';
        data.byFirstHarmful[firstHarmful] = (data.byFirstHarmful[firstHarmful] || 0) + 1;
        data.byLocation[node].byFirstHarmful[firstHarmful] = (data.byLocation[node].byFirstHarmful[firstHarmful] || 0) + 1;

        const weather = (row[COL.WEATHER] || '').trim() || 'Unknown';
        data.byWeather[weather] = (data.byWeather[weather] || 0) + 1;
        const light = (row[COL.LIGHT] || '').trim() || 'Unknown';
        data.byLight[light] = (data.byLight[light] || 0) + 1;
        const surface = (row[COL.SURFACE] || '').trim() || 'Unknown';
        data.bySurface[surface] = (data.bySurface[surface] || 0) + 1;

        const trafficCtrl = row[COL.TRAFFIC_CTRL] || 'Unknown';
        data.byTrafficControl[trafficCtrl] = (data.byTrafficControl[trafficCtrl] || 0) + 1;
        if (!data.byLocation[node].trafficCtrl) data.byLocation[node].trafficCtrl = trafficCtrl;

        const ctrlStatus = row[COL.CTRL_STATUS] || 'Unknown';
        data.byCtrlStatus[ctrlStatus] = (data.byCtrlStatus[ctrlStatus] || 0) + 1;

        const intType = row[COL.INT_TYPE] || '';
        if (intType) {
            data.byIntType[intType] = (data.byIntType[intType] || 0) + 1;
            if (!data.byLocation[node].intType) data.byLocation[node].intType = intType;
        }

        if (isYes(row[COL.ALCOHOL])) { data.factors.alcohol++; data.byLocation[node].factors.alcohol++; }
        if (isYes(row[COL.SPEED])) { data.factors.speed++; data.byLocation[node].factors.speed++; }
        if (isYes(row[COL.DISTRACTED])) { data.factors.distracted++; data.byLocation[node].factors.distracted++; }
        if (isYes(row[COL.DROWSY])) { data.factors.drowsy++; data.byLocation[node].factors.drowsy++; }
        if (isYes(row[COL.DRUG])) data.factors.drug++;
        if (isYes(row[COL.HITRUN])) data.factors.hitrun++;

        if (isYes(row[COL.PED])) {
            data.vru.pedestrian.total++;
            data.byLocation[node].vru.pedestrian++;
            if (sev === 'K') data.vru.pedestrian.K++;
            if (sev === 'A') data.vru.pedestrian.A++;
        }
        if (isYes(row[COL.BIKE])) {
            data.vru.bicycle.total++;
            data.byLocation[node].vru.bicycle++;
            if (sev === 'K') data.vru.bicycle.K++;
            if (sev === 'A') data.vru.bicycle.A++;
        }
        if (isYes(row[COL.MOTORCYCLE])) {
            data.vru.motorcycle.total++;
            if (sev === 'K') data.vru.motorcycle.K++;
            if (sev === 'A') data.vru.motorcycle.A++;
        }

        if (isYes(row[COL.SENIOR])) data.demographics.senior++;
        if (isYes(row[COL.YOUNG])) data.demographics.young++;
        if (row[COL.UNRESTRAINED] === 'Unbelted' || isYes(row[COL.UNRESTRAINED])) data.demographics.unrestrained++;
        if (isYes(row[COL.WORKZONE])) data.specialZones.workZone++;
        if (isYes(row[COL.SCHOOL])) data.specialZones.schoolZone++;
    });

    data.epdo = calcEPDO(data.severity);
    intDetailState.aggregatedData = data;
}

// Calculate county-wide benchmarks for intersections
function calculateIntCountyBenchmarks() {
    const intCrashes = crashState.sampleRows.filter(r => isIntersection(r));
    const total = intCrashes.length || 1;
    let alcoholCount = 0, speedCount = 0, distractedCount = 0, drowsyCount = 0, drugCount = 0, hitrunCount = 0;
    let pedCount = 0, bikeCount = 0, motorCount = 0, seniorCount = 0, youngCount = 0, kaCount = 0;

    intCrashes.forEach(row => {
        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        if (sev === 'K' || sev === 'A') kaCount++;
        if (isYes(row[COL.ALCOHOL])) alcoholCount++;
        if (isYes(row[COL.SPEED])) speedCount++;
        if (isYes(row[COL.DISTRACTED])) distractedCount++;
        if (isYes(row[COL.DROWSY])) drowsyCount++;
        if (isYes(row[COL.DRUG])) drugCount++;
        if (isYes(row[COL.HITRUN])) hitrunCount++;
        if (isYes(row[COL.PED])) pedCount++;
        if (isYes(row[COL.BIKE])) bikeCount++;
        if (isYes(row[COL.MOTORCYCLE])) motorCount++;
        if (isYes(row[COL.SENIOR])) seniorCount++;
        if (isYes(row[COL.YOUNG])) youngCount++;
    });

    intDetailState.countyBenchmarks = {
        kaRate: (kaCount / total * 100), alcohol: (alcoholCount / total * 100), speed: (speedCount / total * 100),
        distracted: (distractedCount / total * 100), drowsy: (drowsyCount / total * 100), drug: (drugCount / total * 100),
        hitrun: (hitrunCount / total * 100), pedestrian: (pedCount / total * 100), bicycle: (bikeCount / total * 100),
        motorcycle: (motorCount / total * 100), senior: (seniorCount / total * 100), young: (youngCount / total * 100)
    };
}

// Get collision type problem classification
function getIntCollisionProblemClass(collisionType, count, total) {
    const pct = total > 0 ? (count / total * 100) : 0;
    const type = (collisionType || '').toLowerCase();
    const problemTypes = ['angle', 'left turn', 'right turn', 'rear end'];
    const cautionTypes = ['sideswipe', 'head on', 'pedestrian', 'bicycle'];
    if (problemTypes.some(p => type.includes(p)) && pct >= 20) return 'problem';
    if (cautionTypes.some(c => type.includes(c)) && pct >= 10) return 'caution';
    if (pct >= 30) return 'problem';
    if (pct >= 15) return 'caution';
    return 'normal';
}

// Render the detail panel content
function renderIntDetailContent() {
    const data = intDetailState.aggregatedData;
    if (!data) return;
    const body = document.getElementById('intDetailBody');
    if (intDetailState.viewMode === 'combined') {
        body.innerHTML = renderIntCombinedView(data);
    } else {
        body.innerHTML = renderIntCompareView(data);
    }
    setTimeout(() => initIntDetailCharts(), 50);
}

// Render combined view
function renderIntCombinedView(data) {
    const benchmarks = intDetailState.countyBenchmarks;
    const total = data.total || 1;
    const kaRate = ((data.severity.K + data.severity.A) / total * 100);
    const vruTotal = data.vru.pedestrian.total + data.vru.bicycle.total + data.vru.motorcycle.total;
    const vruPct = (vruTotal / total * 100);
    const peakHours = intDetailState.peakHours;

    const years = Object.keys(data.byYear).sort();
    let yoyTrend = 0, trendDirection = 'neutral';
    if (years.length >= 2) {
        const lastYear = data.byYear[years[years.length - 1]]?.total || 0;
        const prevYear = data.byYear[years[years.length - 2]]?.total || 0;
        if (prevYear > 0) {
            yoyTrend = ((lastYear - prevYear) / prevYear * 100);
            trendDirection = yoyTrend < 0 ? 'below' : yoyTrend > 0 ? 'above' : 'neutral';
        }
    }

    const kaBenchmarkClass = kaRate > benchmarks.kaRate ? 'above' : kaRate < benchmarks.kaRate ? 'below' : 'neutral';
    const topCollisions = Object.entries(data.byCollision).sort((a, b) => b[1] - a[1]).slice(0, 6);

    return `
        <div class="int-kpi-row">
            <div class="int-kpi"><div class="int-kpi-icon">🚗</div><div class="int-kpi-value">${data.total.toLocaleString()}</div><div class="int-kpi-label">Total Crashes</div><div class="int-kpi-sublabel">${intDetailState.selectedLocations.length} intersection(s)</div></div>
            <div class="int-kpi"><span class="int-kpi-benchmark ${kaBenchmarkClass}">${kaRate > benchmarks.kaRate ? '↑' : '↓'} vs ${benchmarks.kaRate.toFixed(1)}%</span><div class="int-kpi-icon">⚠️</div><div class="int-kpi-value">${kaRate.toFixed(1)}%</div><div class="int-kpi-label">KA Rate</div><div class="int-kpi-sublabel">${data.severity.K + data.severity.A} fatal/serious</div></div>
            <div class="int-kpi"><div class="int-kpi-icon">📈</div><div class="int-kpi-value">${data.epdo.toLocaleString()}</div><div class="int-kpi-label">EPDO Score</div><div class="int-kpi-sublabel">Severity-weighted</div></div>
            <div class="int-kpi"><div class="int-kpi-icon">🚶</div><div class="int-kpi-value">${vruPct.toFixed(1)}%</div><div class="int-kpi-label">VRU Crashes</div><div class="int-kpi-sublabel">${vruTotal} ped/bike/moto</div></div>
            <div class="int-kpi"><span class="int-kpi-benchmark ${trendDirection}">${yoyTrend > 0 ? '↑' : yoyTrend < 0 ? '↓' : '→'}</span><div class="int-kpi-icon">📉</div><div class="int-kpi-value">${yoyTrend > 0 ? '+' : ''}${yoyTrend.toFixed(1)}%</div><div class="int-kpi-label">YoY Trend</div><div class="int-kpi-sublabel">${trendDirection === 'below' ? 'Improving' : trendDirection === 'above' ? 'Worsening' : 'Stable'}</div></div>
        </div>

        <div class="int-section"><div class="int-section-title">💥 Collision Type Analysis (Problem Identification)</div>
            <div class="int-collision-grid">${topCollisions.map(([type, count]) => {
                const pct = (count / total * 100).toFixed(1);
                const problemClass = getIntCollisionProblemClass(type, count, total);
                const icon = problemClass === 'problem' ? '🔴' : problemClass === 'caution' ? '🟡' : '🟢';
                return `<div class="int-collision-card ${problemClass}"><div class="int-collision-type">${icon} ${esc(type.substring(0, 25))}</div><div class="int-collision-count">${count}</div><div class="int-collision-pct">${pct}%</div><div class="int-collision-status">${problemClass === 'problem' ? 'Needs Attention' : problemClass === 'caution' ? 'Monitor' : 'Normal'}</div></div>`;
            }).join('')}</div>
        </div>

        <div class="int-section"><div class="int-section-title">📅 Temporal Analysis</div>
            <div class="int-charts-grid">
                <div class="int-chart-card"><div class="int-chart-title">Yearly Trend</div><div class="int-chart-container"><canvas id="intDetailYearChart"></canvas></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Monthly Heatmap</div><div id="intDetailMonthlyHeatmap" style="padding:.5rem"></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Peak Period Analysis</div><div class="int-chart-container"><canvas id="intDetailPeakChart"></canvas></div><div style="font-size:.65rem;color:#64748b;text-align:center;margin-top:.25rem">AM: ${peakHours.am.start}-${peakHours.am.end} | Mid: ${peakHours.midday.start}-${peakHours.midday.end} | PM: ${peakHours.pm.start}-${peakHours.pm.end}</div></div>
                <div class="int-chart-card"><div class="int-chart-title">Day of Week</div><div class="int-chart-container"><canvas id="intDetailDOWChart"></canvas></div></div>
            </div>
        </div>

        <div class="int-section"><div class="int-section-title">🎯 First Harmful Event Analysis</div>
            <div class="int-charts-grid" style="grid-template-columns:1fr 1fr">
                <div class="int-chart-card"><div class="int-chart-title">First Harmful Events</div><div class="int-chart-container"><canvas id="intDetailFirstHarmfulChart"></canvas></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Severity Distribution</div><div class="int-chart-container"><canvas id="intDetailSeverityChart"></canvas></div></div>
            </div>
        </div>

        <div class="int-section"><div class="int-section-title">🌤️ Environmental Conditions</div>
            <div class="int-charts-grid">
                <div class="int-chart-card"><div class="int-chart-title">Weather Conditions</div><div class="int-chart-container"><canvas id="intDetailWeatherChart"></canvas></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Light Conditions</div><div class="int-chart-container"><canvas id="intDetailLightChart"></canvas></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Road Surface</div><div class="int-chart-container"><canvas id="intDetailSurfaceChart"></canvas></div></div>
                <div class="int-chart-card"><div class="int-chart-title">Traffic Control Status</div><div class="int-chart-container"><canvas id="intDetailCtrlStatusChart"></canvas></div></div>
            </div>
        </div>

        <div class="int-section"><div class="int-section-title">🔍 Contributing Factors (vs County Intersection Average)</div>
            <div class="int-factors-grid">
                ${renderIntFactorRow('🍺', 'Alcohol-Related', data.factors.alcohol, total, benchmarks.alcohol, '#ef4444')}
                ${renderIntFactorRow('🚗', 'Speed-Related', data.factors.speed, total, benchmarks.speed, '#f59e0b')}
                ${renderIntFactorRow('📱', 'Distracted Driving', data.factors.distracted, total, benchmarks.distracted, '#3b82f6')}
                ${renderIntFactorRow('😴', 'Drowsy Driving', data.factors.drowsy, total, benchmarks.drowsy, '#8b5cf6')}
                ${renderIntFactorRow('💊', 'Drug-Related', data.factors.drug, total, benchmarks.drug, '#ec4899')}
                ${renderIntFactorRow('🏃', 'Hit-and-Run', data.factors.hitrun, total, benchmarks.hitrun, '#64748b')}
            </div>
        </div>

        <div class="int-section"><div class="int-section-title">🚶 Vulnerable Road Users & Demographics</div>
            <div class="int-vru-grid">
                <div class="int-vru-card pedestrian"><div class="int-vru-icon">🚶</div><div class="int-vru-value">${data.vru.pedestrian.total}</div><div class="int-vru-pct">${(data.vru.pedestrian.total / total * 100).toFixed(1)}%</div><div class="int-vru-label">Pedestrian</div>${data.vru.pedestrian.K + data.vru.pedestrian.A > 0 ? `<div class="int-vru-ka">KA: ${data.vru.pedestrian.K + data.vru.pedestrian.A}</div>` : ''}</div>
                <div class="int-vru-card bicycle"><div class="int-vru-icon">🚴</div><div class="int-vru-value">${data.vru.bicycle.total}</div><div class="int-vru-pct">${(data.vru.bicycle.total / total * 100).toFixed(1)}%</div><div class="int-vru-label">Bicycle</div>${data.vru.bicycle.K + data.vru.bicycle.A > 0 ? `<div class="int-vru-ka">KA: ${data.vru.bicycle.K + data.vru.bicycle.A}</div>` : ''}</div>
                <div class="int-vru-card motorcycle"><div class="int-vru-icon">🏍️</div><div class="int-vru-value">${data.vru.motorcycle.total}</div><div class="int-vru-pct">${(data.vru.motorcycle.total / total * 100).toFixed(1)}%</div><div class="int-vru-label">Motorcycle</div>${data.vru.motorcycle.K + data.vru.motorcycle.A > 0 ? `<div class="int-vru-ka">KA: ${data.vru.motorcycle.K + data.vru.motorcycle.A}</div>` : ''}</div>
                <div class="int-vru-card senior"><div class="int-vru-icon">👴</div><div class="int-vru-value">${data.demographics.senior}</div><div class="int-vru-pct">${(data.demographics.senior / total * 100).toFixed(1)}%</div><div class="int-vru-label">Senior (65+)</div></div>
                <div class="int-vru-card young"><div class="int-vru-icon">👶</div><div class="int-vru-value">${data.demographics.young}</div><div class="int-vru-pct">${(data.demographics.young / total * 100).toFixed(1)}%</div><div class="int-vru-label">Young (&lt;25)</div></div>
                <div class="int-vru-card unrestrained"><div class="int-vru-icon">🔓</div><div class="int-vru-value">${data.demographics.unrestrained}</div><div class="int-vru-pct">${(data.demographics.unrestrained / total * 100).toFixed(1)}%</div><div class="int-vru-label">Unrestrained</div></div>
            </div>
        </div>

        <div class="int-section"><div class="int-section-title">🚧 Special Zones & Infrastructure</div>
            <div class="int-special-zones">
                <div class="int-zone-card"><div class="int-zone-icon">🚧</div><div class="int-zone-value">${data.specialZones.workZone}</div><div class="int-zone-label">Work Zone Crashes</div></div>
                <div class="int-zone-card"><div class="int-zone-icon">🏫</div><div class="int-zone-value">${data.specialZones.schoolZone}</div><div class="int-zone-label">School Zone Crashes</div></div>
                <div class="int-zone-card"><div class="int-zone-icon">🌙</div><div class="int-zone-value">${Object.entries(data.byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s, [,v]) => s + v, 0)}</div><div class="int-zone-label">Dark Condition Crashes</div></div>
                <div class="int-zone-card"><div class="int-zone-icon">🌧️</div><div class="int-zone-value">${Object.entries(data.byWeather).filter(([k]) => !k.toLowerCase().includes('clear') && k !== 'Unknown').reduce((s, [,v]) => s + v, 0)}</div><div class="int-zone-label">Adverse Weather Crashes</div></div>
            </div>
        </div>
    `;
}

// Render factor row
function renderIntFactorRow(icon, label, count, total, benchmark, color) {
    const pct = total > 0 ? (count / total * 100) : 0;
    const diff = pct - benchmark;
    const benchmarkClass = diff > 1 ? 'above' : diff < -1 ? 'below' : 'neutral';
    const maxPct = Math.max(pct, benchmark, 1) * 1.2;
    return `<div class="int-factor-row"><div class="int-factor-icon">${icon}</div><div class="int-factor-label">${label}</div><div class="int-factor-bar"><div class="int-factor-fill" style="width:${(pct / maxPct * 100).toFixed(1)}%;background:${color}"></div></div><div class="int-factor-value" style="color:${color}">${pct.toFixed(1)}%</div><div class="int-factor-benchmark"><span class="int-kpi-benchmark ${benchmarkClass}" style="position:static">${diff > 0 ? '↑' : diff < 0 ? '↓' : '→'}</span><span style="color:#64748b">${benchmark.toFixed(1)}% avg</span></div></div>`;
}

// Render compare view
function renderIntCompareView(data) {
    const colors = ['#0891b2', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const nodeData = getFilteredIntersectionData();
    const nodeSorted = Object.entries(nodeData.byNode).sort((a,b) => b[1].total - a[1].total);

    let html = '<div class="int-compare-container">';
    intDetailState.selectedLocations.forEach((loc, idx) => {
        const locData = data.byLocation[loc.node];
        const locTotal = locData.total || 1;
        const kaRate = ((locData.severity.K + locData.severity.A) / locTotal * 100);
        const epdo = calcEPDO(locData.severity);
        const topCollision = Object.entries(locData.byCollision).sort((a, b) => b[1] - a[1])[0];
        const rank = nodeSorted.findIndex(([n]) => n === loc.node) + 1;

        html += `<div class="int-compare-location" style="border-left-color:${colors[idx % 5]}"><div class="int-compare-title"><span class="int-compare-rank" style="background:${colors[idx % 5]}">${rank || '-'}</span><span>${esc(formatNodeId(loc.node))}</span></div><div class="int-compare-routes">${esc(locData.routes || loc.routes || 'N/A')}</div><div class="int-compare-meta"><span>🚦 ${esc(locData.trafficCtrl || 'Unknown')}</span><span>🔀 ${esc(locData.intType || 'Unknown')}</span></div><div class="int-kpi-row" style="margin-bottom:0"><div class="int-kpi" style="padding:.5rem"><div class="int-kpi-value" style="font-size:1.2rem">${locData.total}</div><div class="int-kpi-label">Crashes</div></div><div class="int-kpi" style="padding:.5rem"><div class="int-kpi-value" style="font-size:1.2rem">${kaRate.toFixed(1)}%</div><div class="int-kpi-label">KA Rate</div></div><div class="int-kpi" style="padding:.5rem"><div class="int-kpi-value" style="font-size:1.2rem">${epdo.toLocaleString()}</div><div class="int-kpi-label">EPDO</div></div><div class="int-kpi" style="padding:.5rem"><div class="int-kpi-value" style="font-size:1rem">${topCollision ? topCollision[0].substring(0, 12) : 'N/A'}</div><div class="int-kpi-label">Top Type</div></div><div class="int-kpi" style="padding:.5rem"><div class="int-kpi-value" style="font-size:1.2rem">${locData.vru.pedestrian + locData.vru.bicycle}</div><div class="int-kpi-label">Ped/Bike</div></div></div></div>`;
    });
    html += '</div>';

    html += `<div class="int-section" style="margin-top:1.5rem"><div class="int-section-title">📊 Intersection Comparison Charts</div><div class="int-charts-grid" style="grid-template-columns:1fr 1fr"><div class="int-chart-card"><div class="int-chart-title">Crashes by Intersection</div><div class="int-chart-container"><canvas id="intCompareLocationChart"></canvas></div></div><div class="int-chart-card"><div class="int-chart-title">Severity Distribution</div><div class="int-chart-container"><canvas id="intCompareSeverityChart"></canvas></div></div></div></div>`;
    return html;
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  window.aggregateIntDetailData=aggregateIntDetailData; CL.intersection.tab.aggregateIntDetailData=aggregateIntDetailData;
  window.calculateIntCountyBenchmarks=calculateIntCountyBenchmarks; CL.intersection.tab.calculateIntCountyBenchmarks=calculateIntCountyBenchmarks;
  window.getIntCollisionProblemClass=getIntCollisionProblemClass; CL.intersection.tab.getIntCollisionProblemClass=getIntCollisionProblemClass;
  window.renderIntDetailContent=renderIntDetailContent; CL.intersection.tab.renderIntDetailContent=renderIntDetailContent;
  window.renderIntCombinedView=renderIntCombinedView; CL.intersection.tab.renderIntCombinedView=renderIntCombinedView;
  window.renderIntFactorRow=renderIntFactorRow; CL.intersection.tab.renderIntFactorRow=renderIntFactorRow;
  window.renderIntCompareView=renderIntCompareView; CL.intersection.tab.renderIntCompareView=renderIntCompareView;
  CL._registerModule('intersection/intersection-tab-detail');
})();
