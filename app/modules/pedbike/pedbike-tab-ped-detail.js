/** CL pedbike.tab18b-1 — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/18-v2-pedbike-tab.md. No behavior change.
 *  Responsibility: Pedestrian detail-panel data + render.
 *  Reads inline shared pedAnalysisState/crashState/COL (global fall-through);
 *  calls initPedDetailCharts (pedbike/pedbike-tab-ped-detail-charts) at runtime.
 *  Depends on (load before): pedbike/pedbike-tab-ped-core. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Update Pedestrian Detail Panel (Enriched - Hot Spots style)
// Round 23 §2 — Supabase matview fallback for Ped/Bike detail panels.
// When the selected locations have no in-memory crashes (matview-only
// aggregate tier — e.g. planning_district rollup), pull pre-aggregated
// severity + per-dimension breakdowns from mv_safety_focus_locations
// (category=pedestrian|bicycle) and mv_pedbike_breakdowns (mode=ped|bike).
// State-agnostic: keys on resolved tier + stateKey.
async function _fetchPedBikeDetailAggregates(mode, selectedNames) {
    if (!window.crashLensClient || !window.CL || !CL.data || !CL.data.supabaseBridge) return null;
    const dc = window.crashLensClient;
    if (typeof CL.data.supabaseBridge.resolveTier !== 'function') return null;
    const t = CL.data.supabaseBridge.resolveTier();
    if (!t || !t.tier) return null;
    const tierColMap = {
        state: null, region: 'dot_district', mpo: 'mpo_name',
        planning_district: 'planning_district', county: 'planning_district',
        city: 'physical_juris_name', city_town: 'physical_juris_name'
    };
    const tierCol = tierColMap[t.tier];
    const headers = { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey };
    const stateKey = String(dc.state || '').toLowerCase();
    // mv_safety_focus_locations.category uses full words; mv_pedbike_breakdowns.mode also uses full words.
    // The caller passes the short form ('ped' / 'bike') — translate both before querying.
    const category = mode === 'ped' ? 'pedestrian' : 'bicycle';
    const mvMode   = mode === 'ped' ? 'pedestrian' : 'bicycle';

    const sflParams = new URLSearchParams({
        state: 'eq.' + stateKey,
        category: 'eq.' + category,
        select: 'location_name,total,k,a,b,c,o,first_year,last_year'
    });
    if (tierCol && t.value) sflParams.set(tierCol, 'eq.' + t.value);

    const pbbParams = new URLSearchParams({
        state: 'eq.' + stateKey,
        mode: 'eq.' + mvMode,
        select: 'dimension,dim_value,total,k,a,o'
    });
    if (tierCol && t.value) pbbParams.set(tierCol, 'eq.' + t.value);

    // Round 24 §2 — also fetch raw crashes for the same tier+mode scope. The
    // matview gives us authoritative aggregates for severity + per-year + light
    // dim, but the per-row widgets (collision/weather/surface/trafficcontrol/
    // monthly heatmap/time-of-day/contributing factors/demographics) need the
    // actual rows. Cap at 5000 to keep the payload bounded — at PD tier the
    // typical scope is < 1500 rows.
    const rawParams = new URLSearchParams({
        state: 'eq.' + stateKey,
        select: 'crash_severity,crash_year,crash_date,crash_military_time,collision_type,weather_condition,light_condition,roadway_surface_cond,traffic_control_type,intersection_type,roadway_alignment,alcohol,speed,distracted,unrestrained,motorcycle,animal_related,work_zone_related,school_zone,guardrail_related,drug_related,hitrun,drowsy,senior,young,night,rte_name,document_nbr',
        limit: '5000'
    });
    if (tierCol && t.value) rawParams.set(tierCol, 'eq.' + t.value);
    // mode flag — pedestrian or bike
    if (mode === 'ped')  rawParams.set('pedestrian', 'eq.Yes');
    if (mode === 'bike') rawParams.set('bike', 'eq.Yes');

    try {
        const [sflResp, pbbResp, rawResp] = await Promise.all([
            fetch(`${dc.supabaseUrl}/mv_safety_focus_locations?${sflParams}`, { headers }),
            fetch(`${dc.supabaseUrl}/mv_pedbike_breakdowns?${pbbParams}`, { headers }),
            fetch(`${dc.supabaseUrl}/crashes?${rawParams}`, { headers })
        ]);
        const sflRows = sflResp.ok ? await sflResp.json() : [];
        const pbbRows = pbbResp.ok ? await pbbResp.json() : [];
        const rawRowsPg = rawResp.ok ? await rawResp.json() : [];
        // Convert snake_case → Title-Case so the per-row aggregator (which keys
        // on COL.SEVERITY = 'Crash Severity' etc.) finds the columns.
        const rawRows = (typeof dc._pgToFrontend === 'function')
            ? rawRowsPg.map(r => dc._pgToFrontend(r))
            : rawRowsPg;

        const selectedSet = new Set((selectedNames || []).map(n => String(n).trim()));
        const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
        let total = 0;
        const byYear = {};
        sflRows.forEach(r => {
            const name = String(r.location_name || '').trim();
            if (selectedSet.size && !selectedSet.has(name)) return;
            const rowTotal = Number(r.total) || 0;
            total += rowTotal;
            severity.K += Number(r.k) || 0;
            severity.A += Number(r.a) || 0;
            severity.B += Number(r.b) || 0;
            severity.C += Number(r.c) || 0;
            severity.O += Number(r.o) || 0;
            if (r.first_year && r.last_year) {
                const span = Math.max(1, r.last_year - r.first_year + 1);
                const perYear = Math.round(rowTotal / span);
                for (let y = r.first_year; y <= r.last_year; y++) {
                    if (!byYear[y]) byYear[y] = { total: 0, K: 0, A: 0 };
                    byYear[y].total += perYear;
                }
            }
        });

        // mv_pedbike_breakdowns currently exposes 3 dimensions: 'light', 'location', 'year'.
        // The 'collision' / 'weather' / 'roadsurface' / 'trafficcontrol' dims do NOT exist in
        // the matview yet — see Cowork backend follow-up. Until they're added, those four
        // breakdowns simply stay empty in matview-fallback mode (the per-row code path at
        // tier=county/city still populates them from raw crashes, which is unaffected).
        const byCollision = {}, byLight = {}, byWeather = {}, bySurface = {}, byTrafficControl = {};
        const dimMap = {
            light: byLight,
            // collision/weather/roadsurface/trafficcontrol intentionally absent until matview extension
        };
        // Light dim is the only breakdown the matview supports today; merge it in.
        pbbRows.forEach(r => {
            const target = dimMap[r.dimension];
            if (!target || !r.dim_value) return;
            target[r.dim_value] = (target[r.dim_value] || 0) + (Number(r.total) || 0);
        });
        // The matview also has dimension='year' with dim_value=YYYY — feed byYear so the
        // per-year trend chart renders accurately (replaces the SFL first/last span estimate).
        const byYearFromPbb = {};
        pbbRows.forEach(r => {
            if (r.dimension !== 'year' || !r.dim_value) return;
            const y = String(r.dim_value);
            if (!byYearFromPbb[y]) byYearFromPbb[y] = { total: 0, K: 0, A: 0 };
            byYearFromPbb[y].total += Number(r.total) || 0;
            byYearFromPbb[y].K     += Number(r.k) || 0;
            byYearFromPbb[y].A     += Number(r.a) || 0;
        });
        // Prefer pbb byYear when it has data; fall back to the SFL span estimate already in `byYear`.
        if (Object.keys(byYearFromPbb).length > 0) {
            for (const y of Object.keys(byYearFromPbb)) byYear[y] = byYearFromPbb[y];
        }
        if (window.console && console.debug) {
            console.debug('[PedBikeDetail] matview agg:', {
                mode: mvMode, total, sflRows: sflRows.length, pbbRows: pbbRows.length,
                light_keys: Object.keys(byLight).length, year_keys: Object.keys(byYear).length
            });
        }

        return { total, severity, byYear, byCollision, byLight, byWeather, bySurface, byTrafficControl, rawCrashes: rawRows };
    } catch (e) {
        console.warn('[PedBikeDetail] matview fallback failed:', e && e.message);
        return null;
    }
}

async function updatePedDetailPanel() {
    const selected = pedAnalysisState.selectedLocations;
    if (selected.length === 0) return;

    document.getElementById('pedDetailPanel').style.display = 'block';
    document.getElementById('pedDetailTitle').textContent = `Analysis: ${selected.map(s => s.isNode ? formatNodeId(s.location) : s.location.substring(0,20)).join(', ')}`;

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

    // Round 23 §2 — matview fallback. When per-row crashes are empty (the
    // selected location came from a matview-only loader), hydrate aggregates
    // from mv_safety_focus_locations + mv_pedbike_breakdowns instead of
    // rendering all-zero panels. Mirrors Round 21.1 §4 Safety Focus pattern.
    let _useMatview = false;
    if (allCrashes.length === 0) {
        const agg = await _fetchPedBikeDetailAggregates('ped', selected.map(s => s.location));
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
            console.log('[PedDetail] matview fallback hydrated total=' + totalCrashes + ' for ' + selected.length + ' location(s)');
            // Round 24 §2 — populate the per-dim widgets the matview can't
            // (collision/weather/surface/trafficcontrol/demographics/monthly
            // heatmap/time-of-day/contributing-factors) by running the existing
            // per-row aggregator over the raw crashes we fetched alongside the
            // matview. The matview-derived totals/severity/year/light stay as
            // the authoritative numbers — raw rows ONLY supplement the empty
            // widgets, not the headline KPIs.
            if (Array.isArray(agg.rawCrashes) && agg.rawCrashes.length > 0) {
                _useMatview = false;             // flip the flag so the per-row aggregator below runs
                allCrashes.push(...agg.rawCrashes);
                // Reset ALL per-dim accumulators we hydrated from the matview —
                // the per-row aggregator increments them from zero, so leaving
                // matview values in place would double-count. The headline
                // KPI (totalCrashes = agg.total) is preserved separately.
                ['K','A','B','C','O'].forEach(k => { severity[k] = 0; });
                Object.keys(byCollision).forEach(k => delete byCollision[k]);
                Object.keys(byLight).forEach(k => delete byLight[k]);
                Object.keys(byWeather).forEach(k => delete byWeather[k]);
                Object.keys(bySurface).forEach(k => delete bySurface[k]);
                Object.keys(byTrafficControl).forEach(k => delete byTrafficControl[k]);
                Object.keys(byYear).forEach(k => delete byYear[k]);
                console.log('[PedDetail] raw rows used: ' + agg.rawCrashes.length);
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
    const renderPedFactorRow = (icon, label, count, benchmark, color) => {
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
                <div class="hotspot-kpi-icon">🚶</div>
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
                    <div class="hotspot-chart-container"><canvas id="pedDetailYearChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Monthly Heatmap</div>
                    <div id="pedDetailMonthlyHeatmap" style="padding:.5rem"></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Time of Day</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailTimeChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Day of Week</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailDOWChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Crash Characteristics Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">💥 Crash Characteristics</div>
            <div class="hotspot-charts-grid">
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Collision Types</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailCollisionChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Severity Breakdown</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailSeverityChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Traffic Control</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailControlChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Environmental Conditions Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">🌤️ Environmental Conditions</div>
            <div class="hotspot-charts-grid">
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Weather Conditions</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailWeatherChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Light Conditions</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailLightChart"></canvas></div>
                </div>
                <div class="hotspot-chart-card">
                    <div class="hotspot-chart-title">Road Surface</div>
                    <div class="hotspot-chart-container"><canvas id="pedDetailSurfaceChart"></canvas></div>
                </div>
            </div>
        </div>

        <!-- Contributing Factors Section -->
        <div class="hotspot-section">
            <div class="hotspot-section-title">🔍 Contributing Factors (vs County Average)</div>
            <div class="hotspot-factors-grid">
                ${renderPedFactorRow('🍺', 'Alcohol-Related', alcoholCount, countyAlcohol, '#ef4444')}
                ${renderPedFactorRow('🚗', 'Speed-Related', speedCount, countySpeed, '#f59e0b')}
                ${renderPedFactorRow('📱', 'Distracted Driving', distractedCount, countyDistracted, '#3b82f6')}
                ${renderPedFactorRow('😴', 'Drowsy Driving', drowsyCount, countyDrowsy, '#8b5cf6')}
                ${renderPedFactorRow('💊', 'Drug-Related', drugCount, countyDrug, '#ec4899')}
                ${renderPedFactorRow('🏃', 'Hit-and-Run', hitrunCount, countyHitrun, '#64748b')}
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
        <div style="margin-top:1rem;padding:.75rem;background:#ecfdf5;border-radius:var(--radius);border:1px solid #10b981">
            <strong style="color:#059669">💡 Recommended Countermeasures:</strong>
            <div style="margin-top:.5rem;font-size:.85rem;color:#047857">
                ${nightCount/totalCrashes > 0.3 ? '• Enhanced street lighting and pedestrian-scale lighting<br>' : ''}
                ${intCount/totalCrashes > 0.5 ? '• High-visibility crosswalks and pedestrian signals<br>' : ''}
                ${severity.K + severity.A > 0 ? '• Leading pedestrian intervals (LPI) at signals<br>' : ''}
                ${speedCount > 0 ? '• Traffic calming measures and speed reduction strategies<br>' : ''}
                • Rectangular Rapid Flashing Beacons (RRFB)<br>
                • Pedestrian refuge islands for wide crossings
            </div>
        </div>
    `;

    document.getElementById('pedDetailBody').innerHTML = html;

    // Initialize charts after DOM update
    initPedDetailCharts({ severity, byCollision, byLight, byWeather, bySurface, byTrafficControl, byMonth, byYear, byDOW, byHour, years });
}
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.tab=CL.pedbike.tab||{};
  window._fetchPedBikeDetailAggregates=_fetchPedBikeDetailAggregates; CL.pedbike.tab._fetchPedBikeDetailAggregates=_fetchPedBikeDetailAggregates;
  window.updatePedDetailPanel=updatePedDetailPanel; CL.pedbike.tab.updatePedDetailPanel=updatePedDetailPanel;
  CL._registerModule('pedbike/pedbike-tab-ped-detail');
})();
