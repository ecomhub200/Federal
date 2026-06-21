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
        // SF2 — matview-hydrated entries push empty {} stubs into crashes[]
        // to preserve the Top Locations count column; skip them here so the
        // matview-fallback path below hydrates real severity/EPDO/byYear.
        if (rd && rd.__matviewStub) return false;
        return rd && Array.isArray(rd.crashes) && rd.crashes.length > 0;
    });
    if (!_hasPerRow && window.crashLensClient && window.CL && CL.data
        && CL.data.supabaseBridge
        && typeof CL.data.supabaseBridge.resolveTier === 'function') {
        const dc = window.crashLensClient;
        const t = CL.data.supabaseBridge.resolveTier();
        // SF2 hotfix — at state/federal tier `t.value === null` (no slice
        // value). The inner query at L128 already handles that (tier filter
        // is gated by `tierCol && t.value`), so dropping `&& t.value` here
        // lets the matview-fallback run at state/federal and return real
        // severity-weighted EPDO instead of falling through to the per-row
        // loop that iterates __matviewStub empty {} stubs.
        if (t && t.tier) {
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
                        // (Yearly Trend is fetched once below from
                        // mv_safety_categories_yearly with REAL year-over-year
                        // counts. We no longer synthesize a flat even-distribution
                        // here — that rendered identical bars for every year.)
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
                    // CC 213 SF3 — surface speed/senior/young/impaired/
                    // distracted co-factor counts from
                    // mv_safety_co_factors (merged onto
                    // safetyState.data[cat] at init time by
                    // _hydrateSafetyCoFactors) so the Contributing
                    // Factors and Demographics cards render real numbers
                    // instead of zeros. Scaling: the matview counts are
                    // jurisdiction-wide for the category; multi-location
                    // selection in the detail panel can't slice them, so
                    // they're shown as the category-wide totals
                    // (consistent with the existing matview-mode
                    // category-total UX).
                    if (catData) {
                        data.factors.speed       = catData.speed_count      || 0;
                        data.factors.distracted  = catData.distracted_count || 0;
                        data.factors.alcohol     = catData.impaired_count   || 0;
                        data.demographics.senior = catData.senior_count     || 0;
                        data.demographics.young  = catData.young_count      || 0;
                    }
                    // Real per-year Yearly Trend from mv_safety_categories_yearly
                    // (category-specific). Replaces the old flat even-distribution
                    // so the chart shows real year-over-year variation. This is
                    // jurisdiction-wide for the category (not per-selected-location);
                    // a true per-location/per-year breakdown needs per-row data
                    // (county/city tier) — documented as a follow-up.
                    try {
                        const _yrCol = { region: 'planning_district', mpo: 'mpo_name',
                            planning_district: 'planning_district', county: 'physical_juris_name',
                            city: 'physical_juris_name', city_town: 'physical_juris_name' }[t.tier] || null;
                        const _matCat = ({ alcoholonly: 'alcohol', impaired: 'alcohol', workzone: 'work_zone', school: 'school_zone' })[category] || category;
                        const _yp = new URLSearchParams({
                            state: 'eq.' + String(dc.state || '').toLowerCase(),
                            category: 'eq.' + _matCat,
                            select: 'crash_year,crash_count,k,a'
                        });
                        if (_yrCol && t.value) _yp.set(_yrCol, 'eq.' + t.value);
                        const _yresp = await fetch(`${dc.supabaseUrl}/mv_safety_categories_yearly?${_yp.toString()}`, {
                            headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
                        });
                        if (_yresp.ok) {
                            const _yrows = await _yresp.json();
                            if (Array.isArray(_yrows) && _yrows.length) {
                                const _by = {};
                                _yrows.forEach(yr => {
                                    const y = Number(yr.crash_year);
                                    if (!Number.isFinite(y) || y === 0) return;
                                    _by[y] = _by[y] || { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                                    _by[y].total += Number(yr.crash_count) || 0;
                                    _by[y].K += Number(yr.k) || 0;
                                    _by[y].A += Number(yr.a) || 0;
                                });
                                if (Object.keys(_by).length) data.byYear = _by;
                            }
                        }
                    } catch (_yerr) {
                        // Fall back to category yearly hydrated elsewhere, if any;
                        // otherwise leave byYear empty (honest 'no data', not fake).
                        if (catData && catData.byYear && Object.keys(catData.byYear).length > 0) {
                            data.byYear = {};
                            Object.keys(catData.byYear).forEach(y => {
                                data.byYear[y] = { total: catData.byYear[y] || 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                            });
                        }
                    }
                    // CC 217 — REAL per-location dimensional breakdowns from
                    // mv_safety_focus_detail (category x location JSONB:
                    // by_year/by_dow/by_hour/by_collision/by_weather/by_light/
                    // by_roadsurface/by_trafficctrl + factor/VRU/demographic
                    // counts). Keyed identically to mv_safety_focus_locations so
                    // it reconciles with the totals above. Fills the charts that
                    // were blank at aggregate tiers; overrides the category-wide
                    // co-factor approximations only when it matches.
                    try {
                        const _dp = new URLSearchParams({
                            state: 'eq.' + String(dc.state || '').toLowerCase(),
                            category: 'eq.' + category,
                            select: 'location_name,location_type,total,alcohol_count,speed_count,distracted_count,drowsy_count,drug_count,hitrun_count,ped_count,bike_count,moto_count,senior_count,young_count,unrestrained_count,by_year,by_dow,by_hour,by_collision,by_weather,by_light,by_roadsurface,by_trafficctrl'
                        });
                        if (tierCol && t.value) _dp.set(tierCol, 'eq.' + t.value);
                        const _dresp = await fetch(`${dc.supabaseUrl}/mv_safety_focus_detail?${_dp.toString()}`, {
                            headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
                        });
                        if (_dresp.ok) {
                            const _drows = await _dresp.json();
                            const _sel = new Set(sfDetailState.selectedLocations.map(r => String(r).trim()));
                            const _merge = (tgt, src) => { if (src) for (const k in src) { const v = src[k]; if (typeof v === 'number') tgt[k] = (tgt[k] || 0) + v; } };
                            const T = { fac:{alcohol:0,speed:0,distracted:0,drowsy:0,drug:0,hitrun:0}, demo:{senior:0,young:0,unrestrained:0}, vru:{ped:0,bike:0,moto:0}, coll:{}, weat:{}, lite:{}, surf:{}, traf:{}, year:{}, dow:{}, hour:{}, intx:{} };
                            let _matched = 0;
                            (Array.isArray(_drows) ? _drows : []).forEach(r => {
                                if (!_sel.has(String(r.location_name || '').trim())) return;
                                _matched++;
                                T.fac.alcohol+=+r.alcohol_count||0; T.fac.speed+=+r.speed_count||0; T.fac.distracted+=+r.distracted_count||0;
                                T.fac.drowsy+=+r.drowsy_count||0; T.fac.drug+=+r.drug_count||0; T.fac.hitrun+=+r.hitrun_count||0;
                                T.demo.senior+=+r.senior_count||0; T.demo.young+=+r.young_count||0; T.demo.unrestrained+=+r.unrestrained_count||0;
                                T.vru.ped+=+r.ped_count||0; T.vru.bike+=+r.bike_count||0; T.vru.moto+=+r.moto_count||0;
                                _merge(T.coll,r.by_collision); _merge(T.weat,r.by_weather); _merge(T.lite,r.by_light);
                                _merge(T.surf,r.by_roadsurface); _merge(T.traf,r.by_trafficctrl); _merge(T.dow,r.by_dow); _merge(T.hour,r.by_hour);
                                const _it = r.location_type === 'intersection' ? 'At Intersection' : 'Segment';
                                T.intx[_it] = (T.intx[_it]||0) + (+r.total||0);
                                if (r.by_year) for (const y in r.by_year) { const o=r.by_year[y]||{}; T.year[y]=T.year[y]||{total:0,K:0,A:0,B:0,C:0,O:0}; T.year[y].total+=o.total||0; T.year[y].K+=o.K||0; T.year[y].A+=o.A||0; T.year[y].B+=o.B||0; T.year[y].C+=o.C||0; T.year[y].O+=o.O||0; }
                            });
                            if (_matched > 0) {
                                data.factors.alcohol=T.fac.alcohol; data.factors.speed=T.fac.speed; data.factors.distracted=T.fac.distracted;
                                data.factors.drowsy=T.fac.drowsy; data.factors.drug=T.fac.drug; data.factors.hitrun=T.fac.hitrun;
                                data.demographics.senior=T.demo.senior; data.demographics.young=T.demo.young; data.demographics.unrestrained=T.demo.unrestrained;
                                data.vru.pedestrian.total=T.vru.ped; data.vru.bicycle.total=T.vru.bike; data.vru.motorcycle.total=T.vru.moto;
                                data.byCollision=T.coll; data.byWeather=T.weat; data.byLight=T.lite; data.bySurface=T.surf; data.byTrafficControl=T.traf; data.byIntType=T.intx;
                                if (Object.keys(T.year).length) data.byYear=T.year;
                                data.byDOW={0:0,1:0,2:0,3:0,4:0,5:0,6:0}; Object.keys(T.dow).forEach(k=>{const n=Number(k); if(Number.isFinite(n)) data.byDOW[n]=T.dow[k];});
                                data.byHour={}; data.byPeakPeriod={amPeak:0,midday:0,pmPeak:0,night:0};
                                Object.keys(T.hour).forEach(k=>{const h=Number(k); if(!Number.isFinite(h))return; data.byHour[h]=T.hour[k]; const cc=T.hour[k]; if(h>=6&&h<9)data.byPeakPeriod.amPeak+=cc; else if(h>=9&&h<15)data.byPeakPeriod.midday+=cc; else if(h>=15&&h<19)data.byPeakPeriod.pmPeak+=cc; else data.byPeakPeriod.night+=cc;});
                                console.log('[SafetyDetail] mv_safety_focus_detail: dimensional charts populated ('+_matched+' rows)');
                            }
                        }
                    } catch (_derr) { console.warn('[SafetyDetail] mv_safety_focus_detail failed:', _derr && _derr.message); }
                    // CC 208 — flag matview-only aggregates so renderers can
                    // surface gap state on sub-KPIs that the matview cannot
                    // populate (factors.drowsy/drug/hitrun,
                    // demographics.unrestrained, byMonth, byDOW, byHour,
                    // byCollision, byWeather, bySurface, byTrafficControl).
                    // Nighttime + intersection breakdowns are populated via
                    // byLight['Dark'] and byIntType['At Intersection'].
                    data._matviewMode = true;
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
