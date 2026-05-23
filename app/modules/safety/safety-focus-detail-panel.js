/**
 * Safety Focus — Detail Panel
 * Extracted from app/index.html (CC 201 Pass B). Verbatim block.
 *
 * Fns: updateSfDetailPanel, aggregateSfDetailData, renderSfDetailContent,
 *      renderSfMonthlyHeatmap
 *
 * Reads inline globals: safetyState, sfDetailState (mirrored to window.*).
 */
(function () {
    'use strict';


async function updateSfDetailPanel(skipScroll) {
    if (sfDetailState.selectedLocations.length === 0) {
        const panel = document.getElementById('sfDetailPanel');
        if (panel) panel.classList.remove('visible');
        return;
    }

    // Validate selections still exist in current data
    const category = safetyState.activeCategory;
    if (!category || !safetyState.data[category]) return;
    const catData = safetyState.data[category];
    sfDetailState.selectedLocations = sfDetailState.selectedLocations.filter(r => catData.byRoute[r]);
    if (sfDetailState.selectedLocations.length === 0) {
        clearSfSelection();
        return;
    }

    // Show panel
    const panel = document.getElementById('sfDetailPanel');
    if (panel) panel.classList.add('visible');

    // Update title
    const catConfig = safetyCategories[category];
    const titleEl = document.getElementById('sfDetailTitle');
    if (titleEl) titleEl.textContent = `Detailed Analysis: ${sfDetailState.selectedLocations.length} Location(s) - ${catConfig?.name || category}`;

    // Round 21.1 §4 — aggregateSfDetailData() is now async (matview fallback
    // fires when sampleRows is empty). Await it so renderSfDetailContent()
    // sees the hydrated state.
    await aggregateSfDetailData();
    calculateSfCategoryBenchmarks();
    renderSfDetailContent();

    if (!skipScroll) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

async function aggregateSfDetailData() {
    const category = safetyState.activeCategory;
    const catData = safetyState.data[category];
    if (!catData) return;

    const data = {
        total: 0,
        severity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
        epdo: 0,
        byYear: {},
        byMonth: {},
        byDOW: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
        byHour: {},
        byPeakPeriod: { amPeak: 0, midday: 0, pmPeak: 0, night: 0 },
        byCollision: {},
        byWeather: {},
        byLight: {},
        bySurface: {},
        byTrafficControl: {},
        byIntType: {},
        factors: { alcohol: 0, speed: 0, distracted: 0, drowsy: 0, drug: 0, hitrun: 0 },
        vru: {
            pedestrian: { total: 0, K: 0, A: 0 },
            bicycle: { total: 0, K: 0, A: 0 },
            motorcycle: { total: 0, K: 0, A: 0 }
        },
        demographics: { senior: 0, young: 0, unrestrained: 0 },
        specialZones: { workZone: 0, schoolZone: 0 },
        crashes: [],
        byLocation: {}
    };

    // Initialize per-location data
    sfDetailState.selectedLocations.forEach(route => {
        data.byLocation[route] = {
            total: 0, severity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
            byYear: {}, byCollision: {},
            factors: { alcohol: 0, speed: 0, distracted: 0, drowsy: 0 },
            vru: { pedestrian: 0, bicycle: 0 }
        };
    });

    // Round 21.1 §4 — when per-row crashes are unavailable (matview-only
    // aggregate tier with empty sampleRows), hydrate severity / EPDO / byYear
    // totals from mv_safety_focus_locations so the detail panel doesn't
    // render KA Rate=0 / EPDO=Total / sub-charts blank. State-agnostic —
    // keys on the resolved tier + crashLensClient.state.
    const _hasPerRow = sfDetailState.selectedLocations.some(route => {
        const rd = catData.byRoute && catData.byRoute[route];
        return rd && Array.isArray(rd.crashes) && rd.crashes.length > 0;
    });
    if (!_hasPerRow && window.crashLensClient && window.CL && CL.data
        && CL.data.supabaseBridge
        && typeof CL.data.supabaseBridge.resolveTier === 'function') {
        const dc = window.crashLensClient;
        const t = CL.data.supabaseBridge.resolveTier();
        if (t && t.tier && t.value) {
            // Mirrors data-client.js TIER_COLUMNS_BY_MATVIEW.default so the
            // aggregate query matches the same rows that _hydrateSafetyLocations-
            // FromMatview pulled. county was previously mapped to
            // planning_district, which caused zero matches at county tier.
            const tierColMap = {
                federal: null, state: null, region: 'dot_district', mpo: 'mpo_name',
                planning_district: 'planning_district', county: 'physical_juris_name',
                city: 'physical_juris_name', city_town: 'physical_juris_name'
            };
            const tierCol = tierColMap[t.tier];
            const params = new URLSearchParams({
                state: 'eq.' + String(dc.state || '').toLowerCase(),
                category: 'eq.' + category,
                select: 'location_name,physical_juris_name,total,k,a,b,c,o,first_year,last_year,at_intersection,night_count'
            });
            if (tierCol && t.value) params.set(tierCol, 'eq.' + t.value);
            try {
                const resp = await fetch(`${dc.supabaseUrl}/mv_safety_focus_locations?${params.toString()}`, {
                    headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
                });
                if (resp.ok) {
                    const rows = await resp.json();
                    const selected = new Set(sfDetailState.selectedLocations.map(r => String(r).trim()));
                    rows.forEach(r => {
                        const name = String(r.location_name || '').trim();
                        if (!selected.has(name)) return;
                        const rowTotal = Number(r.total) || 0;
                        data.total += rowTotal;
                        ['k','a','b','c','o'].forEach(s => {
                            const v = Number(r[s]) || 0;
                            data.severity[s.toUpperCase()] += v;
                        });
                        if (data.byLocation[name]) {
                            data.byLocation[name].total += rowTotal;
                            ['k','a','b','c','o'].forEach(s => {
                                data.byLocation[name].severity[s.toUpperCase()] += Number(r[s]) || 0;
                            });
                        }
                        // Synthesize byYear from first_year..last_year (distributes evenly).
                        // This is a rough approximation — mv_safety_focus_locations doesn't
                        // carry per-year breakdowns — but it lets the Yearly Trend chart
                        // render rather than showing "No data available".
                        if (r.first_year && r.last_year) {
                            const span = Math.max(1, r.last_year - r.first_year + 1);
                            const perYear = Math.round(rowTotal / span);
                            for (let y = r.first_year; y <= r.last_year; y++) {
                                data.byYear[y] = data.byYear[y] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                                data.byYear[y].total += perYear;
                            }
                        }
                        // The matview exposes two crosstab counts per location:
                        // night_count (Dark Condition Crashes card) and
                        // at_intersection (Intersection-type breakdown chart).
                        // Other co-factor cards (alcohol/speed/distracted/...)
                        // require per-row data and stay at zero in matview mode.
                        const nightVal = Number(r.night_count) || 0;
                        const intxnVal = Number(r.at_intersection) || 0;
                        if (nightVal) data.byLight['Dark'] = (data.byLight['Dark'] || 0) + nightVal;
                        if (intxnVal) data.byIntType['At Intersection'] = (data.byIntType['At Intersection'] || 0) + intxnVal;
                    });
                    data.epdo = (typeof calcEPDO === 'function')
                        ? calcEPDO(data.severity)
                        : (data.severity.K * 462 + data.severity.A * 62
                            + data.severity.B * 12 + data.severity.C * 5 + data.severity.O);
                    if (data.total === 0) {
                        console.warn('[SafetyDetail] matview fallback matched 0 of',
                            sfDetailState.selectedLocations.length,
                            'selected locations — hydrate/aggregate tier-column mismatch?',
                            sfDetailState.selectedLocations);
                    }
                    console.log('[SafetyDetail] matview fallback hydrated', rows.length,
                        'rows for', category, '→ total:', data.total,
                        'K:', data.severity.K, 'A:', data.severity.A, 'EPDO:', data.epdo);
                    sfDetailState.aggregatedData = data;
                    return;   // skip the per-row loop below
                }
            } catch (e) {
                console.warn('[SafetyDetail] matview fallback failed:', e && e.message);
            }
        }
    }

    // Iterate selected locations from the category's byRoute data
    sfDetailState.selectedLocations.forEach(route => {
        const routeData = catData.byRoute[route];
        if (!routeData) return;

        routeData.crashes.forEach(row => {
            data.crashes.push(row);
            data.total++;

            const sev = extractSeverity(row);
            if (['K','A','B','C','O'].includes(sev)) {
                data.severity[sev]++;
                data.byLocation[route].severity[sev]++;
            }
            data.byLocation[route].total++;

            // Year
            const year = row[COL.YEAR];
            if (year) {
                data.byYear[year] = data.byYear[year] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                data.byYear[year].total++;
                if (['K','A','B','C','O'].includes(sev)) data.byYear[year][sev]++;
                data.byLocation[route].byYear[year] = (data.byLocation[route].byYear[year] || 0) + 1;
            }

            // Month / DOW
            const dateStr = row[COL.DATE];
            if (dateStr) {
                const d = new Date(Number(dateStr));
                if (!isNaN(d.getTime())) {
                    const month = d.getMonth();
                    const monthYear = `${d.getFullYear()}-${String(month + 1).padStart(2, '0')}`;
                    data.byMonth[monthYear] = (data.byMonth[monthYear] || 0) + 1;
                    data.byDOW[d.getDay()]++;
                }
            }

            // Hour and Peak Period
            const time = row[COL.TIME];
            if (time) {
                const hour = getHour(time) || 0;
                data.byHour[hour] = (data.byHour[hour] || 0) + 1;
                if (hour >= 6 && hour < 9) data.byPeakPeriod.amPeak++;
                else if (hour >= 9 && hour < 15) data.byPeakPeriod.midday++;
                else if (hour >= 15 && hour < 19) data.byPeakPeriod.pmPeak++;
                else data.byPeakPeriod.night++;
            }

            // Collision type
            const collision = (row[COL.COLLISION] || '').trim() || 'Unknown';
            data.byCollision[collision] = (data.byCollision[collision] || 0) + 1;
            data.byLocation[route].byCollision[collision] = (data.byLocation[route].byCollision[collision] || 0) + 1;

            // Weather
            const weather = (row[COL.WEATHER] || '').trim() || 'Unknown';
            data.byWeather[weather] = (data.byWeather[weather] || 0) + 1;

            // Light
            const light = (row[COL.LIGHT] || '').trim() || 'Unknown';
            data.byLight[light] = (data.byLight[light] || 0) + 1;

            // Surface
            const surface = (row[COL.SURFACE] || '').trim() || 'Unknown';
            data.bySurface[surface] = (data.bySurface[surface] || 0) + 1;

            // Traffic Control
            const trafficCtrl = row[COL.TRAFFIC_CTRL] || 'Unknown';
            data.byTrafficControl[trafficCtrl] = (data.byTrafficControl[trafficCtrl] || 0) + 1;

            // Intersection Type
            const intType = row[COL.INT_TYPE] || '';
            if (intType) data.byIntType[intType] = (data.byIntType[intType] || 0) + 1;

            // Contributing factors
            if (isYes(row[COL.ALCOHOL])) { data.factors.alcohol++; data.byLocation[route].factors.alcohol++; }
            if (isYes(row[COL.SPEED])) { data.factors.speed++; data.byLocation[route].factors.speed++; }
            if (isYes(row[COL.DISTRACTED])) { data.factors.distracted++; data.byLocation[route].factors.distracted++; }
            if (isYes(row[COL.DROWSY])) { data.factors.drowsy++; data.byLocation[route].factors.drowsy++; }
            if (isYes(row[COL.DRUG])) data.factors.drug++;
            if (isYes(row[COL.HITRUN])) data.factors.hitrun++;

            // VRU
            if (isYes(row[COL.PED])) {
                data.vru.pedestrian.total++;
                data.byLocation[route].vru.pedestrian++;
                if (sev === 'K') data.vru.pedestrian.K++;
                if (sev === 'A') data.vru.pedestrian.A++;
            }
            if (isYes(row[COL.BIKE])) {
                data.vru.bicycle.total++;
                data.byLocation[route].vru.bicycle++;
                if (sev === 'K') data.vru.bicycle.K++;
                if (sev === 'A') data.vru.bicycle.A++;
            }
            if (isYes(row[COL.MOTORCYCLE])) {
                data.vru.motorcycle.total++;
                if (sev === 'K') data.vru.motorcycle.K++;
                if (sev === 'A') data.vru.motorcycle.A++;
            }

            // Demographics
            if (isYes(row[COL.SENIOR])) data.demographics.senior++;
            if (isYes(row[COL.YOUNG])) data.demographics.young++;
            if (row[COL.UNRESTRAINED] === 'Unbelted' || isYes(row[COL.UNRESTRAINED])) data.demographics.unrestrained++;

            // Special zones
            if (isYes(row[COL.WORKZONE])) data.specialZones.workZone++;
            if (isYes(row[COL.SCHOOL])) data.specialZones.schoolZone++;
        });
    });

    data.epdo = calcEPDO(data.severity);
    sfDetailState.aggregatedData = data;
}

function renderSfDetailContent() {
    const data = sfDetailState.aggregatedData;
    if (!data) return;

    const body = document.getElementById('sfDetailBody');
    if (!body) return;

    if (sfDetailState.viewMode === 'combined') {
        body.innerHTML = renderSfCombinedView(data);
    } else {
        body.innerHTML = renderSfCompareView(data);
    }

    setTimeout(() => initSfDetailCharts(), 50);
}

function renderSfMonthlyHeatmap(data) {
    const container = document.getElementById('sfDetailMonthlyHeatmap');
    if (!container) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = [...new Set(Object.keys(data.byMonth).map(k => k.split('-')[0]))].sort();

    if (years.length === 0) {
        container.innerHTML = '<div style="text-align:center;color:#64748b;font-size:.8rem">Monthly breakdown unavailable in matview mode — load location detail for per-row data</div>';
        return;
    }

    const maxCount = Math.max(...Object.values(data.byMonth), 1);

    const getHeatmapColor = (intensity) => {
        if (intensity === 0) return { bg: '#f1f5f9', text: '#64748b' };
        if (intensity <= 0.25) return { bg: '#ede9fe', text: '#5b21b6' };
        if (intensity <= 0.5) return { bg: '#c4b5fd', text: '#4c1d95' };
        if (intensity <= 0.75) return { bg: '#a78bfa', text: '#fff' };
        return { bg: '#7c3aed', text: '#fff' };
    };

    let html = '<div class="sf-heatmap-labels">' + months.map(m => `<div class="sf-heatmap-label">${m}</div>`).join('') + '</div>';

    years.forEach(year => {
        html += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px">
            <div style="width:35px;font-size:.65rem;color:#64748b;text-align:right">${year}</div>
            <div class="sf-monthly-heatmap" style="flex:1">`;

        for (let m = 0; m < 12; m++) {
            const key = `${year}-${String(m + 1).padStart(2, '0')}`;
            const count = data.byMonth[key] || 0;
            const intensity = count / maxCount;
            const clrs = getHeatmapColor(intensity);
            html += `<div class="sf-heatmap-cell" style="background:${clrs.bg};color:${clrs.text}" title="${months[m]} ${year}: ${count} crashes">${count}</div>`;
        }

        html += '</div></div>';
    });

    container.innerHTML = html;
}

    // ===== CC 201 dual-API exposure =====
    window.CL = window.CL || {};
    CL.safety = CL.safety || {};
    CL.safety.detailPanel = CL.safety.detailPanel || {};
    Object.assign(CL.safety.detailPanel, {
        updateSfDetailPanel,
        aggregateSfDetailData,
        renderSfDetailContent,
        renderSfMonthlyHeatmap
    });
    Object.assign(window, CL.safety.detailPanel);

    CL._registerModule('safety/detail-panel');
})();
