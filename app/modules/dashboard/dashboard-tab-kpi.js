/** CL dashboard.tab (kpi) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/15-v2-dashboard-tab.md + MODULAR_PLAN_PROMPT_15-v2_VERIFY.md.
 *  Verbatim except: _tierComparisonCache qualified to window._tierComparisonCache
 *  (reassigned in 15b, invalidated from 15d — cross-IIFE shared mutable global).
 *  No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L41966-L42449) ───
function updateDashboard() {
    if (!crashState.loaded) return;
    console.log('[CrashLens] Rendering dashboard, rows available:',
                crashState.totalRows || (crashState.sampleRows && crashState.sampleRows.length) || 0);
    setDashboardLoadingState(false);

    // Phase 1B: Update tier-specific sections (comparison matrices, breadcrumb, scope header)
    if (typeof updateDashboardTierSections === 'function') {
        updateDashboardTierSections();
    }

    // At aggregate tiers (state/federal/region/mpo/planning_district) AND at
    // county tier when rolled up to a planning_district/region, the dashboard
    // KPIs are painted by supabase-bridge.js from the Supabase matview. Do NOT
    // overwrite them with stale county-level crashState.aggregates (which is
    // empty in Supabase-only mode and produces 0s everywhere).
    // Tier sections (breadcrumb, comparison tables) are still updated above.
    var _currentTier = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext.viewTier : 'county';
    var _resolvedTier = null;
    try {
        var _r = (typeof CL !== 'undefined') && CL && CL.data && CL.data.supabaseBridge
            && typeof CL.data.supabaseBridge.resolveTier === 'function'
            && CL.data.supabaseBridge.resolveTier();
        _resolvedTier = _r && _r.tier;
    } catch (e) { /* non-fatal */ }
    var _aggregateSet = { state:1, federal:1, region:1, mpo:1, planning_district:1 };
    var _supabaseMode = !(crashState.sampleRows && crashState.sampleRows.length > 0);
    if (_aggregateSet[_currentTier] || _aggregateSet[_resolvedTier] || _supabaseMode) {
        // Bug fix (round 3, 2026-05-08): supabase-bridge owns the dashboard
        // KPI text when sampleRows is empty.
        // Bug fix (round 6, 2026-05-09): the early return ALSO skipped chart
        // painting — leaving 12 dashboard canvases blank. Paint them from
        // mv_analysis_summary before returning. Tables are already wired by
        // updateDashboardTierSections() above.
        if (typeof paintDashboardChartsFromMatview === 'function') {
            paintDashboardChartsFromMatview().catch(function (e) {
                console.warn('[Dashboard] Chart paint from matview failed:', e && e.message);
            });
        }
        return;
    }

    const filtered = getFilteredStats();
    const agg = filtered.agg;
    const sev = filtered.stats;
    const total = filtered.total;
    const pedTotal = agg.ped?.total ?? 0;
    const bikeTotal = agg.bike?.total ?? 0;

    // Get years from filtered data
    const filteredYears = Object.keys(agg.byYear || {}).map(Number).sort((a, b) => a - b);
    const numYears = filteredYears.length || 1;

    document.getElementById('kpiTotal').textContent = total.toLocaleString();
    document.getElementById('kpiFatal').textContent = sev.K;
    document.getElementById('kpiFatalPct').textContent = pct(sev.K, total) + '%';
    document.getElementById('kpiInjuryA').textContent = sev.A;
    document.getElementById('kpiAPct').textContent = pct(sev.A, total) + '%';
    document.getElementById('kpiInjuryBC').textContent = (sev.B + sev.C).toLocaleString();
    document.getElementById('kpiPDO').textContent = sev.O.toLocaleString();
    // Round 16 §4 — BLOCKED-UPSTREAM gate: states without B/C in source data
    // (e.g. Delaware) show "—" instead of a misleading 0.
    if (typeof applyInjuryBCCapabilityGate === 'function') {
        applyInjuryBCCapabilityGate().catch(() => {});
    }

    // EPDO with breakdown
    const epdo = calcEPDO(sev);
    const epdoK = sev.K * EPDO_WEIGHTS.K;
    const epdoA = sev.A * EPDO_WEIGHTS.A;
    const epdoB = sev.B * EPDO_WEIGHTS.B;
    const epdoC = sev.C * EPDO_WEIGHTS.C;
    const epdoO = sev.O * EPDO_WEIGHTS.O;

    document.getElementById('kpiEPDO').textContent = epdo.toLocaleString();
    document.getElementById('kpiYearRange').textContent = filteredYears.length > 0 ? `${filteredYears[0]}-${filteredYears[filteredYears.length - 1]}` : '';
    document.getElementById('kpiEPDOAvg').innerHTML = `Avg/Year: ${Math.round(epdo / numYears).toLocaleString()}`;

    // EPDO breakdown
    document.getElementById('epdoK').textContent = epdoK.toLocaleString();
    document.getElementById('epdoA').textContent = epdoA.toLocaleString();
    document.getElementById('epdoB').textContent = epdoB.toLocaleString();
    document.getElementById('epdoC').textContent = epdoC.toLocaleString();
    document.getElementById('epdoO').textContent = epdoO.toLocaleString();

    document.getElementById('epdoKPct').textContent = pct(epdoK, epdo) + '%';
    document.getElementById('epdoAPct').textContent = pct(epdoA, epdo) + '%';
    document.getElementById('epdoBPct').textContent = pct(epdoB, epdo) + '%';
    document.getElementById('epdoCPct').textContent = pct(epdoC, epdo) + '%';
    document.getElementById('epdoOPct').textContent = pct(epdoO, epdo) + '%';

    document.getElementById('epdoKBar').style.width = pct(epdoK, epdo) + '%';
    document.getElementById('epdoABar').style.width = pct(epdoA, epdo) + '%';
    document.getElementById('epdoBBar').style.width = pct(epdoB, epdo) + '%';
    document.getElementById('epdoCBar').style.width = pct(epdoC, epdo) + '%';
    document.getElementById('epdoOBar').style.width = pct(epdoO, epdo) + '%';

    document.getElementById('epdoAnnual').textContent = Math.round(epdo / numYears).toLocaleString();
    document.getElementById('epdoPer100').textContent = total > 0 ? (epdo / total * 100).toFixed(1) : '0';

    // K+A Combined with trend
    const kaTotal = sev.K + sev.A;
    document.getElementById('kpiKA').textContent = kaTotal.toLocaleString();
    document.getElementById('kpiKAPct').textContent = pct(kaTotal, total) + '%';

    // VRU (Ped+Bike) Combined with trend
    const vruTotal = pedTotal + bikeTotal;
    document.getElementById('kpiVRU').textContent = vruTotal.toLocaleString();
    document.getElementById('kpiVRUPct').textContent = pct(vruTotal, total) + '%';

    // Speed-Related with trend
    const speedTotal = agg.speed?.total ?? 0;
    document.getElementById('kpiSpeed').textContent = speedTotal.toLocaleString();
    document.getElementById('kpiSpeedPct').textContent = pct(speedTotal, total) + '%';

    // Nighttime with trend
    const nighttimeTotal = agg.nighttime?.total ?? 0;
    document.getElementById('kpiNighttime').textContent = nighttimeTotal.toLocaleString();
    document.getElementById('kpiNighttimePct').textContent = pct(nighttimeTotal, total) + '%';

    // CC-207 D1 — In CSV mode, agg.personsInjured counts all-severity injured
    // persons (superset of A). The relabeled "Serious Injuries (A)" card is
    // matview-only until the CSV worker exposes a serious-injured aggregate
    // separately. Hide here so the two paths never report different numbers
    // under the same label.
    const piCard = document.getElementById('kpiPersonsInjuredCard');
    if (piCard) piCard.style.display = 'none';

    // CC-207 D2 — Avg Vehicles/Crash: render normal value if the CSV worker
    // populated vehicle_count; otherwise fall through to the "Source-data gap"
    // placeholder (em-dash + badge) maintained by applyAvgVehiclesCapabilityGate.
    if (agg.vehicleCount?.total > 0) {
        const vcCard = document.getElementById('kpiVehicleCountCard');
        if (vcCard) {
            vcCard.style.display = '';
            const avgVehicles = (agg.vehicleCount.sum / agg.vehicleCount.total).toFixed(1);
            document.getElementById('kpiAvgVehicles').textContent = avgVehicles;
            document.getElementById('kpiVehicleCountSub').textContent = `Total vehicles: ${agg.vehicleCount.sum.toLocaleString()}`;
        }
    } else if (typeof applyAvgVehiclesCapabilityGate === 'function') {
        applyAvgVehiclesCapabilityGate();
    }

    // Calculate YoY trends with PERIOD-MATCHED comparison
    // This compares the same time period across years (e.g., Jan-Jul 2025 vs Jan-Jul 2024)
    const sortedYears = filteredYears.slice().sort((a, b) => a - b);
    if (sortedYears.length >= 2) {
        const lastYear = sortedYears[sortedYears.length - 1];
        const prevYear = sortedYears[sortedYears.length - 2];

        // Find the latest date in the most recent year to determine the comparison cutoff
        let maxDateInLastYear = null;
        crashState.sampleRows.forEach(row => {
            const year = parseInt(row[COL.YEAR]);
            if (year !== lastYear) return;
            const dateVal = row[COL.DATE];
            if (dateVal) {
                const ts = Number(dateVal);
                if (!maxDateInLastYear || ts > maxDateInLastYear) {
                    maxDateInLastYear = ts;
                }
            }
        });

        // Get month and day from the max date to use as cutoff for previous year
        let cutoffMonth = 11; // December (0-indexed)
        let cutoffDay = 31;
        let isPartialYear = false;

        if (maxDateInLastYear) {
            const maxDate = new Date(maxDateInLastYear);
            cutoffMonth = maxDate.getMonth();
            cutoffDay = maxDate.getDate();
            // Consider it a partial year if not in December or if before Dec 15
            isPartialYear = cutoffMonth < 11 || (cutoffMonth === 11 && cutoffDay < 15);
        }

        // Calculate period-matched statistics for both years
        const calcPeriodMatchedStats = (targetYear) => {
            const stats = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, nighttime: 0 };

            crashState.sampleRows.forEach(row => {
                const year = parseInt(row[COL.YEAR]);
                if (year !== targetYear) return;

                // Apply current dashboard filters (severity, route, etc.)
                const f = currentFilters;
                const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);

                // Check date filter from dashboard
                if (f.startDate || f.endDate) {
                    const crashDateStr = row[COL.DATE];
                    if (!crashDateStr) return;
                    const crashDate = new Date(Number(crashDateStr));
                    if (isNaN(crashDate.getTime())) return;
                    crashDate.setHours(0, 0, 0, 0);

                    if (f.startDate) {
                        const start = new Date(f.startDate);
                        start.setHours(0, 0, 0, 0);
                        if (crashDate < start) return;
                    }
                    if (f.endDate) {
                        const end = new Date(f.endDate);
                        end.setHours(23, 59, 59, 999);
                        if (crashDate > end) return;
                    }
                }

                // Location filter
                if (f.route) {
                    if (f.route.startsWith('route:')) {
                        if (row[COL.ROUTE] !== f.route.substring(6)) return;
                    } else if (f.route.startsWith('node:')) {
                        if (String(row[COL.NODE]) !== f.route.substring(5)) return;
                    } else {
                        if (row[COL.ROUTE] !== f.route) return;
                    }
                }

                // Intersection type filter
                if (f.intersection && row[COL.INT_TYPE] !== f.intersection) return;

                // Severity filter
                if (!f.severity.includes(sev)) return;

                // For the PREVIOUS year, apply the period cutoff
                // (only count crashes up to the same month/day as the last crash in current year)
                if (targetYear === prevYear && isPartialYear) {
                    const dateVal = row[COL.DATE];
                    if (dateVal) {
                        const crashDate = new Date(Number(dateVal));
                        const crashMonth = crashDate.getMonth();
                        const crashDay = crashDate.getDate();
                        // Skip if this crash is after the cutoff date
                        if (crashMonth > cutoffMonth || (crashMonth === cutoffMonth && crashDay > cutoffDay)) {
                            return;
                        }
                    }
                }

                // Count the crash
                stats.total++;
                if (stats[sev] !== undefined) stats[sev]++;

                // Special categories
                const isYes = v => v && (v === 'Y' || v === 'Yes' || v === '1' || v === 1 || v === true);
                if (isYes(row[COL.PED])) stats.ped++;
                if (isYes(row[COL.BIKE])) stats.bike++;
                if (isYes(row[COL.SPEED])) stats.speed++;

                // Nighttime check - use COL.NIGHT for consistency with main aggregation
                if (isYes(row[COL.NIGHT])) stats.nighttime++;
            });

            return stats;
        };

        const lastData = calcPeriodMatchedStats(lastYear);
        const prevData = calcPeriodMatchedStats(prevYear);

        // Helper to create trend indicator HTML with comparison period info
        const getTrendHtml = (current, previous, label = '') => {
            if (!previous || previous === 0) {
                if (current > 0) return `<span class="trend-indicator trend-up" title="No ${label} crashes in comparison period">New</span>`;
                return '';
            }
            const change = ((current - previous) / previous * 100).toFixed(0);
            const numChange = parseFloat(change);

            // Build tooltip showing the comparison
            const periodInfo = isPartialYear
                ? `Comparing Jan 1 - ${new Date(2000, cutoffMonth, cutoffDay).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})}: ${lastYear} (${current}) vs ${prevYear} (${previous})`
                : `Comparing full year: ${lastYear} (${current}) vs ${prevYear} (${previous})`;

            // For very large changes, show multiplier notation to avoid confusion with percentages
            // E.g., "▲10×" instead of "▲1063%" which looks like an absolute percentage
            if (numChange > 0) {
                if (numChange >= 200) {
                    // Show multiplier format for changes >= 200% (i.e., 3x or more)
                    const multiplier = ((current / previous)).toFixed(1);
                    return `<span class="trend-indicator trend-up" title="${periodInfo}\nChange: +${change}%">▲${multiplier}×</span>`;
                }
                return `<span class="trend-indicator trend-up" title="${periodInfo}">▲${change}%</span>`;
            }
            if (numChange < 0) return `<span class="trend-indicator trend-down" title="${periodInfo}">▼${Math.abs(numChange)}%</span>`;
            return `<span class="trend-indicator trend-neutral" title="${periodInfo}">→0%</span>`;
        };

        // Total crashes trend
        document.getElementById('kpiTotalTrend').innerHTML = getTrendHtml(lastData.total || 0, prevData.total || 0, 'total');

        // Fatal trend
        document.getElementById('kpiFatalTrend').innerHTML = getTrendHtml(lastData.K || 0, prevData.K || 0, 'fatal');

        // Serious Injury (A) trend
        document.getElementById('kpiATrend').innerHTML = getTrendHtml(lastData.A || 0, prevData.A || 0, 'serious injury');

        // K+A trend
        const lastKA = (lastData.K || 0) + (lastData.A || 0);
        const prevKA = (prevData.K || 0) + (prevData.A || 0);
        document.getElementById('kpiKATrend').innerHTML = getTrendHtml(lastKA, prevKA, 'K+A');

        // VRU trend
        const lastVRU = (lastData.ped || 0) + (lastData.bike || 0);
        const prevVRU = (prevData.ped || 0) + (prevData.bike || 0);
        document.getElementById('kpiVRUTrend').innerHTML = getTrendHtml(lastVRU, prevVRU, 'VRU');

        // Speed trend
        const lastSpeed = lastData.speed || 0;
        const prevSpeed = prevData.speed || 0;
        document.getElementById('kpiSpeedTrend').innerHTML = getTrendHtml(lastSpeed, prevSpeed, 'speed-related');

        // Nighttime trend
        const lastNight = lastData.nighttime || 0;
        const prevNight = prevData.nighttime || 0;
        document.getElementById('kpiNighttimeTrend').innerHTML = getTrendHtml(lastNight, prevNight, 'nighttime');

        // Log for debugging
        console.log('[YoY Trend] Period-matched comparison:', {
            lastYear, prevYear,
            isPartialYear,
            cutoffDate: isPartialYear ? `${cutoffMonth + 1}/${cutoffDay}` : 'Full year',
            lastYearStats: lastData,
            prevYearStats: prevData
        });
    } else {
        // Clear trends if not enough years
        document.getElementById('kpiTotalTrend').innerHTML = '';
        document.getElementById('kpiFatalTrend').innerHTML = '';
        document.getElementById('kpiATrend').innerHTML = '';
        document.getElementById('kpiKATrend').innerHTML = '';
        document.getElementById('kpiVRUTrend').innerHTML = '';
        document.getElementById('kpiSpeedTrend').innerHTML = '';
        document.getElementById('kpiNighttimeTrend').innerHTML = '';
    }

    // Yearly Summary Table
    const years = Object.keys(agg.byYear).sort();
    let prevTotal = null;
    const yearlyBody = document.getElementById('dashYearlyBody');
    if (yearlyBody) {
        yearlyBody.innerHTML = years.map(y => {
            const d = agg.byYear[y];
            const yearEpdo = calcEPDO(d);
            const kaRate = pct(d.K + d.A, d.total);
            let change = '--';
            if (prevTotal !== null) {
                const pctChg = ((d.total - prevTotal) / prevTotal * 100).toFixed(1);
                change = `<span style="color:${pctChg > 0 ? 'var(--danger)' : 'var(--success)'}">${pctChg > 0 ? '+' : ''}${pctChg}%</span>`;
            }
            prevTotal = d.total;
            return `<tr><td><strong>${y}</strong></td><td>${d.total.toLocaleString()}</td>
                <td><span class="severity-badge severity-K">${d.K}</span></td>
                <td><span class="severity-badge severity-A">${d.A}</span></td>
                <td><span class="severity-badge severity-B">${d.B}</span></td>
                <td><span class="severity-badge severity-C">${d.C}</span></td>
                <td><span class="severity-badge severity-O">${d.O}</span></td>
                <td><strong>${yearEpdo.toLocaleString()}</strong></td><td>${kaRate}%</td>
                <td>${d.ped || 0}</td><td>${d.bike || 0}</td><td>${change}</td></tr>`;
        }).join('');
    }

    // Functional Class Table
    const fcSorted = Object.entries(agg.byFuncClass).sort((a,b) => b[1].total - a[1].total);
    const funcClassBody = document.getElementById('funcClassBody');
    if (funcClassBody) {
        funcClassBody.innerHTML = fcSorted.map(([fc, d]) =>
            `<tr><td>${esc(fc)}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td><td>${calcEPDO(d)}</td><td>${pct(d.total, total)}%</td></tr>`
        ).join('');
    }

    // Pass filtered aggregates to charts
    updateCharts(agg, total);

    // Update district dashboard widget
    renderDistrictMatrixWidget();

    // Initialize dashboard search if not already done
    initDashboardSearch();
}

function updateCharts(filteredAgg, filteredTotal) {
    const agg = filteredAgg || crashState.aggregates;
    const sev = agg.bySeverity;
    const totalCrashes = filteredTotal || crashState.totalRows;
    const years = Object.keys(agg.byYear).sort();

    // Year-over-Year Change chart
    if (years.length > 1) {
        const changes = [];
        for (let i = 1; i < years.length; i++) {
            const prev = agg.byYear[years[i-1]].total;
            const curr = agg.byYear[years[i]].total;
            changes.push({ year: years[i], pct: prev > 0 ? ((curr - prev) / prev * 100) : 0 });
        }
        createChart('chartYoY', 'bar', {
            labels: changes.map(c => c.year),
            datasets: [{ label: '% Change', data: changes.map(c => c.pct.toFixed(1)), backgroundColor: changes.map(c => c.pct > 0 ? '#dc2626' : '#059669') }]
        });
    }

    // K+A Crashes by Year chart
    createChart('chartKAYear', 'line', {
        labels: years,
        datasets: [
            { label: 'Fatal (K)', data: years.map(y => agg.byYear[y].K), borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,.1)', fill: true },
            { label: 'Serious (A)', data: years.map(y => agg.byYear[y].A), borderColor: '#ea580c', backgroundColor: 'rgba(234,88,12,.1)', fill: true }
        ]
    });

    // Day of Week chart
    const dowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    createChart('chartDOW', 'bar', {
        labels: dowLabels,
        datasets: [{ label: 'Crashes', data: dowLabels.map((_,i) => agg.byDOW[i] || 0), backgroundColor: '#1e40af' }]
    });

    // Monthly Distribution chart
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    createChart('chartMonth', 'bar', {
        labels: monthLabels,
        datasets: [{ label: 'Crashes', data: monthLabels.map((_,i) => agg.byMonth[i] || 0), backgroundColor: '#7c3aed' }]
    });

    // Functional Class chart
    const fcSorted = Object.entries(agg.byFuncClass).sort((a,b) => b[1].total - a[1].total);
    createChart('chartFuncClass', 'bar', {
        labels: fcSorted.slice(0,8).map(f => f[0].substring(0,20)),
        datasets: [{ label: 'Crashes', data: fcSorted.slice(0,8).map(f => f[1].total), backgroundColor: '#059669' }]
    }, { indexAxis: 'y' });

    // Collision Types chart (Top 10)
    const collisions = Object.entries(agg.byCollision).sort((a,b) => b[1]-a[1]).slice(0,10);
    createChart('chartCollision', 'bar', {
        labels: collisions.map(c => c[0].substring(0,25)),
        datasets: [{ label: 'Crashes', data: collisions.map(c => c[1]), backgroundColor: '#7c3aed' }]
    }, { indexAxis: 'y' });

    // Weather chart with custom legend
    const weather = Object.entries(agg.byWeather).sort((a,b) => b[1]-a[1]).slice(0,6);
    const weatherLabels = weather.map(w => w[0].substring(0,20));
    const weatherData = weather.map(w => w[1]);
    const weatherColors = ['#0ea5e9','#64748b','#f59e0b','#10b981','#8b5cf6','#ec4899'];

    createChart('chartWeather', 'doughnut', {
        labels: weatherLabels,
        datasets: [{ data: weatherData, backgroundColor: weatherColors, borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    buildCustomLegend('legendWeather', weatherLabels, weatherData, weatherColors, totalCrashes);

    // Light chart with custom legend
    const light = Object.entries(agg.byLight).sort((a,b) => b[1]-a[1]).slice(0,6);
    const lightLabels = light.map(l => l[0].substring(0,20));
    const lightData = light.map(l => l[1]);
    const lightColors = ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1','#14b8a6'];

    createChart('chartLight', 'doughnut', {
        labels: lightLabels,
        datasets: [{ data: lightData, backgroundColor: lightColors, borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    buildCustomLegend('legendLight', lightLabels, lightData, lightColors, totalCrashes);
}

// Helper function to build custom legends with numbers and percentages
function buildCustomLegend(containerId, labels, data, colors, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let html = '';
    labels.forEach((label, i) => {
        const val = data[i] || 0;
        const pct = total > 0 ? (val / total * 100).toFixed(1) : 0;
        html += `<div style="display:flex;align-items:center;gap:.4rem;margin-bottom:.2rem;white-space:nowrap">
            <span style="width:10px;height:10px;background:${colors[i]};border-radius:2px;flex-shrink:0"></span>
            <span style="max-width:120px;overflow:hidden;text-overflow:ellipsis">${label}</span>
            <span style="font-weight:600;margin-left:auto">${val.toLocaleString()}</span>
            <span style="color:#64748b">(${pct}%)</span>
        </div>`;
    });
    container.innerHTML = html;
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.dashboard=CL.dashboard||{};
  CL.dashboard.tab=CL.dashboard.tab||{};
  window.updateDashboard=updateDashboard; CL.dashboard.tab.updateDashboard=updateDashboard;
  window.updateCharts=updateCharts; CL.dashboard.tab.updateCharts=updateCharts;
  window.buildCustomLegend=buildCustomLegend; CL.dashboard.tab.buildCustomLegend=buildCustomLegend;
  CL._registerModule('dashboard/dashboard-tab-kpi');
})();
