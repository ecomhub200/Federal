/**
 * Supabase Bridge — Phase 2
 *
 * Instantly paints Dashboard KPI cards from the dashboard_summary matview
 * via window.crashLensClient (Phase 1), so the user sees real numbers
 * within ~1 second while the full R2 parquet pipeline continues loading
 * in the background. When R2 finishes, the existing updateDashboard()
 * naturally overwrites everything — this bridge never touches state.
 *
 * Rules this module follows:
 *   - Writes ONLY to HTML element IDs via textContent / innerHTML / style.
 *   - Never mutates crashState aggregates or any state object beyond the
 *     loaded flag.
 *   - Sets crashState.loaded = true after a successful dashboard paint so
 *     detail tabs (which all gate on this flag) don't bail before their
 *     matview path runs.
 *   - All failures are swallowed (non-fatal try/catch).
 *   - Skips entirely if crashState.loaded is already true.
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

CL.data.supabaseBridge = (function () {
    'use strict';

    var _injected = false;
    var _refreshTimer = null;

    function _activeStateKey() {
        return (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : null;
    }

    function getEpdoWeights() {
        if (typeof EPDO_WEIGHTS !== 'undefined' && EPDO_WEIGHTS) return EPDO_WEIGHTS;
        if (CL.core && CL.core.constants && CL.core.constants.EPDO_WEIGHTS_DEFAULT) {
            return CL.core.constants.EPDO_WEIGHTS_DEFAULT;
        }
        return { K: 883, A: 94, B: 21, C: 11, O: 1 };
    }

    // Map a jurisdictionContext key (e.g. 'de_kent') to the database-matching
    // short name (e.g. 'Kent'). Reads `appConfig.jurisdictions[key].namePatterns[0]`
    // — by convention the first pattern is the form that matches the
    // `physical_juris_name` column in the matviews. Returns null if the
    // config can't resolve the key.
    function jurisdictionDbName(key) {
        if (!key) return null;
        try {
            if (typeof appConfig !== 'undefined' && appConfig && appConfig.jurisdictions) {
                var jur = appConfig.jurisdictions[key];
                if (jur && Array.isArray(jur.namePatterns) && jur.namePatterns.length > 0) {
                    return jur.namePatterns[0];
                }
            }
        } catch (e) { /* fall through */ }
        return null;
    }

    function resolveTier() {
        var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
        if (!ctx) return { tier: 'state', value: null };
        var t = ctx.viewTier || 'county';
        if (t === 'federal') return { tier: 'federal', value: null };
        if (t === 'state')   return { tier: 'state', value: null };
        if (t === 'region') {
            // Prefer dbName (exact DB match) → name (hierarchy display name).
            // No selection → fall back to state instead of letting an undefined
            // value silently strip the dot_district filter.
            var regionObj = ctx.tierRegion;
            if (!regionObj) {
                console.log('[resolveTier] No region selected, falling back to state tier');
                return { tier: 'state', value: null };
            }
            return { tier: 'region', value: regionObj.dbName || regionObj.name };
        }
        if (t === 'mpo') {
            // Hierarchy stores long display names (e.g. "WILMAPCO (Wilmington
            // Area Planning Council)") but mpo_name in the matviews stores
            // shorter values. Prefer dbName → shortName → name.
            var mpoObj = ctx.tierMpo;
            if (!mpoObj) {
                console.log('[resolveTier] No MPO selected, falling back to state tier');
                return { tier: 'state', value: null };
            }
            return { tier: 'mpo', value: mpoObj.dbName || mpoObj.shortName || mpoObj.name };
        }
        if (t === 'planning_district') {
            var pdObj = ctx.tierPlanningDistrict;
            if (!pdObj) {
                console.log('[resolveTier] No planning district selected, falling back to state tier');
                return { tier: 'state', value: null };
            }
            return { tier: 'planning_district', value: pdObj.dbName || pdObj.name };
        }
        if (t === 'city') {
            // Primary: city dropdown name (matches DB for cities/CDPs).
            // Fallback chain: physicalJurisName (DB-matching short form from
            // namePatterns[0], 50-state safe) → jurisdictionDbName lookup →
            // suffix-stripped display name as final defense.
            var cityVal = (ctx.tierCity && ctx.tierCity.name) || null;
            if (!cityVal) cityVal = ctx.physicalJurisName || jurisdictionDbName(ctx.jurisdictionKey) || null;
            if (!cityVal) {
                var rawCity = ctx.jurisdictionName || '';
                cityVal = rawCity.replace(/\s+County$/i, '') || null;
            }
            return { tier: 'county', value: cityVal };
        }
        if (t === 'county') {
            // physicalJurisName is the DB-matching short form stored at selection time
            // (e.g. "New Castle" not "New Castle County"). 50-state safe — sourced from
            // config.json namePatterns[0]. Falls back to config lookup, then a
            // suffix-stripped display name to match the matview format.
            var countyVal = ctx.physicalJurisName || jurisdictionDbName(ctx.jurisdictionKey) || null;
            if (!countyVal) {
                var rawCounty = ctx.jurisdictionName || '';
                countyVal = rawCounty.replace(/\s+County$/i, '') || null;
            }
            return { tier: 'county', value: countyVal };
        }
        return { tier: 'state', value: null };
    }

    /**
     * Tier-aware spec for the active "Road Type" radio button. Returns
     *   { bucket, in, noInterstate }
     * where `bucket` is a single road_type to filter on (eq.X), `in` is an
     * array of road_type values for in.(...), and `noInterstate` is the
     * is_interstate=eq.false flag. The matrix lives in
     * CrashLensDataClient.radioToBucket — see assets/js/data-client.js.
     *
     * Every Crash Lens matview now derives road_type from crashes.ownership
     * (4 buckets: dot_roads / county_roads / city_roads / other_roads). The
     * Federal "Non-DOT Roads" radio resolves to a 3-bucket `in.(...)` filter
     * because there is no single "non-DOT" bucket in the schema.
     */
    function activeRoadTypeSpecForSupabase() {
        var tier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) || 'county';
        if (typeof CrashLensDataClient === 'undefined' || !CrashLensDataClient.activeRoadType) {
            return { bucket: null, in: null, noInterstate: false };
        }
        return CrashLensDataClient.activeRoadType(tier);
    }

    // Web Worker wrapper around aggregate() — keeps the main thread responsive
    // when matview rows balloon (state-tier returns 50K rows × 12 fields). The
    // worker is created lazily on first use and reused thereafter. Falls back
    // to in-thread aggregate() if the worker can't be created (e.g. file://
    // origin without a registered Worker source).
    var _aggWorker = null;
    var _aggWorkerFailed = false;

    function aggregateAsync(rows) {
        if (_aggWorkerFailed || typeof Worker === 'undefined') {
            return Promise.resolve(aggregate(rows));
        }
        try {
            if (!_aggWorker) {
                _aggWorker = new Worker('../assets/js/agg-worker.js');
            }
        } catch (e) {
            _aggWorkerFailed = true;
            return Promise.resolve(aggregate(rows));
        }
        return new Promise(function (resolve) {
            var onMessage = function (ev) {
                _aggWorker.removeEventListener('message', onMessage);
                _aggWorker.removeEventListener('error', onError);
                resolve(ev.data);
            };
            var onError = function () {
                _aggWorker.removeEventListener('message', onMessage);
                _aggWorker.removeEventListener('error', onError);
                _aggWorkerFailed = true;
                try { _aggWorker.terminate(); } catch (e) { /* ignore */ }
                _aggWorker = null;
                resolve(aggregate(rows));
            };
            _aggWorker.addEventListener('message', onMessage);
            _aggWorker.addEventListener('error', onError);
            _aggWorker.postMessage({ rows: rows });
        });
    }

    function aggregate(rows) {
        var agg = {
            total: 0,
            bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
            byYear: {},
            byFuncClass: {},
            byCollision: {},
            safety: {
                ped: 0, bike: 0, speed: 0, alcohol: 0, night: 0, animal: 0,
                fatals: 0, seriousInjured: 0, totalInjured: 0
            }
        };
        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            var c = parseInt(r.crash_count, 10) || 0;
            var s = ((r.crash_severity || '').toUpperCase()).charAt(0);
            var y = parseInt(r.crash_year, 10) || 0;
            var fc = r.functional_class || '';
            var coll = r.collision_type || '';

            agg.total += c;
            if (agg.bySeverity.hasOwnProperty(s)) agg.bySeverity[s] += c;

            if (y) {
                if (!agg.byYear[y]) agg.byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, night: 0 };
                var yd = agg.byYear[y];
                yd.total += c;
                if (yd.hasOwnProperty(s)) yd[s] += c;
                yd.ped   += parseInt(r.ped_crashes,   10) || 0;
                yd.bike  += parseInt(r.bike_crashes,  10) || 0;
                yd.speed += parseInt(r.speed_crashes, 10) || 0;
                yd.night += parseInt(r.night_crashes, 10) || 0;
            }

            if (fc) {
                if (!agg.byFuncClass[fc]) agg.byFuncClass[fc] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                var fd = agg.byFuncClass[fc];
                fd.total += c;
                if (fd.hasOwnProperty(s)) fd[s] += c;
            }

            if (coll) agg.byCollision[coll] = (agg.byCollision[coll] || 0) + c;

            agg.safety.ped            += parseInt(r.ped_crashes,      10) || 0;
            agg.safety.bike           += parseInt(r.bike_crashes,     10) || 0;
            agg.safety.speed          += parseInt(r.speed_crashes,    10) || 0;
            agg.safety.alcohol        += parseInt(r.alcohol_crashes,  10) || 0;
            agg.safety.night          += parseInt(r.night_crashes,    10) || 0;
            agg.safety.animal         += parseInt(r.animal_crashes,   10) || 0;
            agg.safety.fatals         += parseInt(r.fatals,           10) || 0;
            agg.safety.seriousInjured += parseInt(r.serious_injuries, 10) || 0;
            agg.safety.totalInjured   += parseInt(r.total_injured,    10) || 0;
        }
        return agg;
    }

    function pct(n, d) { return (d > 0) ? ((n / d) * 100).toFixed(1) : '0.0'; }

    function setText(id, val) {
        var el = document.getElementById(id);
        if (el) el.textContent = val;
    }
    function setHtml(id, val) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = val;
    }
    function setWidth(id, w) {
        var el = document.getElementById(id);
        if (el) el.style.width = w;
    }

    function trendHtml(current, previous) {
        if (!previous || previous === 0) {
            return current > 0 ? '<span class="trend-indicator trend-up">New</span>' : '';
        }
        var change = ((current - previous) / previous) * 100;
        var n = parseFloat(change.toFixed(0));
        if (n > 0) {
            if (n >= 200) {
                var mult = (current / previous).toFixed(1);
                return '<span class="trend-indicator trend-up">▲' + mult + '×</span>';
            }
            return '<span class="trend-indicator trend-up">▲' + n + '%</span>';
        }
        if (n < 0) {
            return '<span class="trend-indicator trend-down">▼' + Math.abs(n) + '%</span>';
        }
        return '<span class="trend-indicator trend-neutral">→0%</span>';
    }

    function escHtml(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
        });
    }

    function paintKPIs(agg) {
        var W = getEpdoWeights();
        var sev = agg.bySeverity;
        var total = agg.total;
        var epdo = sev.K * W.K + sev.A * W.A + sev.B * W.B + sev.C * W.C + sev.O * W.O;
        var ka = sev.K + sev.A;
        var vru = agg.safety.ped + agg.safety.bike;
        var years = Object.keys(agg.byYear).map(Number).sort(function (a, b) { return a - b; });
        var numYears = years.length || 1;
        var yearRange = years.length ? (years[0] + '-' + years[years.length - 1]) : '';

        setText('kpiTotal',     total.toLocaleString());
        setText('kpiFatal',     sev.K.toLocaleString());
        setText('kpiInjuryA',   sev.A.toLocaleString());
        setText('kpiInjuryBC', (sev.B + sev.C).toLocaleString());
        setText('kpiPDO',       sev.O.toLocaleString());
        setText('kpiEPDO',      epdo.toLocaleString());
        setText('kpiKA',        ka.toLocaleString());
        setText('kpiVRU',       vru.toLocaleString());
        setText('kpiSpeed',     agg.safety.speed.toLocaleString());
        setText('kpiNighttime', agg.safety.night.toLocaleString());

        setText('kpiYearRange',      yearRange);
        setText('kpiFatalPct',       pct(sev.K, total) + '%');
        setText('kpiAPct',           pct(sev.A, total) + '%');
        setText('kpiKAPct',          pct(ka, total) + '%');
        setText('kpiVRUPct',         pct(vru, total) + '%');
        setText('kpiSpeedPct',       pct(agg.safety.speed, total) + '%');
        setText('kpiNighttimePct',   pct(agg.safety.night, total) + '%');

        setHtml('kpiEPDOAvg', 'Avg/Year: ' + Math.round(epdo / numYears).toLocaleString());
        setText('epdoAnnual', Math.round(epdo / numYears).toLocaleString());
        setText('epdoPer100', total > 0 ? (epdo / total * 100).toFixed(1) : '0.0');

        var parts = {
            K: sev.K * W.K, A: sev.A * W.A, B: sev.B * W.B, C: sev.C * W.C, O: sev.O * W.O
        };
        var keys = ['K', 'A', 'B', 'C', 'O'];
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            setText('epdo' + k,         parts[k].toLocaleString());
            setText('epdo' + k + 'Pct', pct(parts[k], epdo) + '%');
            setWidth('epdo' + k + 'Bar', (epdo ? (parts[k] / epdo * 100) : 0) + '%');
        }

        if (years.length >= 2) {
            var last = years[years.length - 1];
            var prev = years[years.length - 2];
            var L = agg.byYear[last];
            var P = agg.byYear[prev];
            setHtml('kpiTotalTrend',     trendHtml(L.total, P.total));
            setHtml('kpiFatalTrend',     trendHtml(L.K,     P.K));
            setHtml('kpiATrend',         trendHtml(L.A,     P.A));
            setHtml('kpiKATrend',        trendHtml(L.K + L.A, P.K + P.A));
            setHtml('kpiVRUTrend',       trendHtml(L.ped + L.bike, P.ped + P.bike));
            setHtml('kpiSpeedTrend',     trendHtml(L.speed, P.speed));
            setHtml('kpiNighttimeTrend', trendHtml(L.night, P.night));
        }
    }

    function paintYearlyTable(agg) {
        var tbody = document.getElementById('dashYearlyBody');
        if (!tbody) return;
        var W = getEpdoWeights();
        var years = Object.keys(agg.byYear).map(Number).sort(function (a, b) { return a - b; });
        var html = '';
        for (var i = 0; i < years.length; i++) {
            var y = years[i];
            var d = agg.byYear[y];
            var yepdo = d.K * W.K + d.A * W.A + d.B * W.B + d.C * W.C + d.O * W.O;
            var yoy = '';
            if (i > 0) {
                var prevTotal = agg.byYear[years[i - 1]].total;
                if (prevTotal > 0) {
                    var chg = ((d.total - prevTotal) / prevTotal * 100).toFixed(1);
                    yoy = (parseFloat(chg) >= 0 ? '+' : '') + chg + '%';
                }
            }
            var kaRate = d.total > 0 ? ((d.K + d.A) / d.total * 100).toFixed(1) + '%' : '0%';
            html += '<tr>' +
                '<td><strong>' + y + '</strong></td>' +
                '<td>' + d.total.toLocaleString() + '</td>' +
                '<td><span class="severity-badge severity-K">' + d.K + '</span></td>' +
                '<td><span class="severity-badge severity-A">' + d.A + '</span></td>' +
                '<td><span class="severity-badge severity-B">' + d.B + '</span></td>' +
                '<td><span class="severity-badge severity-C">' + d.C + '</span></td>' +
                '<td><span class="severity-badge severity-O">' + d.O + '</span></td>' +
                '<td><strong>' + yepdo.toLocaleString() + '</strong></td>' +
                '<td>' + kaRate + '</td>' +
                '<td>' + (d.ped || 0) + '</td>' +
                '<td>' + (d.bike || 0) + '</td>' +
                '<td>' + yoy + '</td>' +
            '</tr>';
        }
        tbody.innerHTML = html;
    }

    function paintFuncClassTable(agg) {
        var tbody = document.getElementById('funcClassBody');
        if (!tbody) return;
        var W = getEpdoWeights();
        var entries = [];
        for (var k in agg.byFuncClass) {
            if (agg.byFuncClass.hasOwnProperty(k)) entries.push([k, agg.byFuncClass[k]]);
        }
        entries.sort(function (a, b) { return b[1].total - a[1].total; });
        var html = '';
        for (var i = 0; i < entries.length; i++) {
            var fc = entries[i][0];
            var d = entries[i][1];
            var e = d.K * W.K + d.A * W.A + d.B * W.B + d.C * W.C + d.O * W.O;
            html += '<tr>' +
                '<td>' + escHtml(fc) + '</td>' +
                '<td>' + d.total.toLocaleString() + '</td>' +
                '<td>' + d.K + '</td>' +
                '<td>' + d.A + '</td>' +
                '<td>' + e.toLocaleString() + '</td>' +
                '<td>' + pct(d.total, agg.total) + '%</td>' +
            '</tr>';
        }
        tbody.innerHTML = html;
    }

    function showBanner() {
        if (document.getElementById('supabaseBridgeIndicator')) return;
        var banner = document.createElement('div');
        banner.id = 'supabaseBridgeIndicator';
        banner.style.cssText = 'padding:8px 14px;margin:0 0 10px 0;background:#1e3a8a;color:#e0e7ff;border-radius:6px;font-size:13px;border-left:3px solid #60a5fa;';
        banner.textContent = '⚡ Summary loaded from database — detailed charts & filters loading...';
        var kpi = document.getElementById('dashboardKPIs');
        if (kpi && kpi.parentNode) kpi.parentNode.insertBefore(banner, kpi);
    }

    function removeBanner() {
        var el = document.getElementById('supabaseBridgeIndicator');
        if (el) el.remove();
    }

    async function injectFastDashboard(opts) {
        var force = !!(opts && opts.force);

        // Ensure Supabase client uses the currently active state.
        // _getActiveStateKey() can return a stale value during boot (e.g.
        // 'colorado' from appConfig.defaultState) before the state dropdown
        // has been observed. Cross-check against the dropdown directly so
        // we never query Supabase with the wrong state.
        try {
            if (window.crashLensClient) {
                var stateKey = null;

                if (typeof _getActiveStateKey === 'function') {
                    stateKey = _getActiveStateKey();
                }

                var bootDefault = (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || null;
                if (!stateKey || stateKey === bootDefault) {
                    try {
                        var stateSelect = document.getElementById('stateSelect');
                        if (stateSelect && stateSelect.value && typeof _fipsToStateKey === 'function') {
                            var fromFips = _fipsToStateKey(stateSelect.value);
                            if (fromFips) stateKey = fromFips;
                        }
                    } catch (e2) { /* non-fatal */ }
                }

                if (stateKey) {
                    window.crashLensClient.state = stateKey;
                }
            }
        } catch (e) { /* non-fatal */ }

        // Final defense: derive state from jurisdictionContext which is ALWAYS correct
        // after buildJurisdictionContextFromSelection(). The _getActiveStateKey() path
        // above can return the boot default ('colorado') during initial load or rapid
        // state switch because the dropdown/StateAdapter haven't propagated yet.
        try {
            var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
            if (ctx && window.crashLensClient) {
                // Prefer stateKey (exact match for matview 'state' column).
                // Fallback: derive from stateName (e.g. "New York" → "new_york").
                var ctxState = ctx.stateKey || (ctx.stateName ? ctx.stateName.toLowerCase().replace(/\s+/g, '_') : null);
                if (ctxState && ctxState !== window.crashLensClient.state) {
                    console.log('[Phase2] State corrected from jurisdictionContext: ' + window.crashLensClient.state + ' → ' + ctxState);
                    window.crashLensClient.state = ctxState;
                }
            }
        } catch (e) { /* non-fatal */ }

        try {
            if (!force && typeof crashState !== 'undefined' && crashState && crashState.loaded) {
                console.log('[Phase2] R2 already loaded before bridge started, skipping');
                return;
            }
            if (!window.crashLensClient || typeof window.crashLensClient.getSummary !== 'function') {
                console.log('[Phase2] No Supabase client available, skipping');
                return;
            }

            var t = resolveTier();
            var spec = activeRoadTypeSpecForSupabase();
            console.log('[Phase2] Fetching summary from Supabase...', { tier: t.tier, value: t.value, spec: spec });
            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.updateTierSwitchProgress) {
                    CL.upload.tierUI.updateTierSwitchProgress(15, 'Fetching dashboard summary…');
                }
            } catch (e) { /* non-fatal */ }
            var startTime = Date.now();
            var summaryFilters = {};
            if (spec.bucket)       summaryFilters.roadType     = spec.bucket;
            if (spec.in)           summaryFilters.roadTypes    = spec.in;
            if (spec.noInterstate) summaryFilters.noInterstate = true;
            var rows = await window.crashLensClient.getSummary(t.tier, t.value, summaryFilters);
            var fetchMs = Date.now() - startTime;

            if (!force && typeof crashState !== 'undefined' && crashState && crashState.loaded) {
                console.log('[Phase2] R2 won the race (' + fetchMs + 'ms fetch, but R2 finished first), discarding');
                return;
            }
            if (!Array.isArray(rows) || rows.length === 0) return false;

            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.updateTierSwitchProgress) {
                    CL.upload.tierUI.updateTierSwitchProgress(50, 'Processing ' + rows.length.toLocaleString() + ' summary rows…');
                }
            } catch (e) { /* non-fatal */ }

            var agg = await aggregateAsync(rows);
            paintKPIs(agg);

            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.updateTierSwitchProgress) {
                    CL.upload.tierUI.updateTierSwitchProgress(85, 'Painting dashboard…');
                }
            } catch (e) { /* non-fatal */ }

            paintYearlyTable(agg);
            paintFuncClassTable(agg);
            showBanner();
            _injected = true;

            console.log('[Phase2] Supabase bridge injected', {
                tier: t.tier, value: t.value, rows: rows.length, total: agg.total
            });

            // Bug G: ensure crashState.loaded = true so detail tabs (which all
            // gate on this flag) don't bail before their matview path runs.
            try {
                if (typeof crashState !== 'undefined' && crashState && !crashState.loaded) {
                    crashState.loaded = true;
                    if (!Array.isArray(crashState.sampleRows)) crashState.sampleRows = [];
                }
            } catch (gErr) { /* non-fatal */ }

            // Notify the Dashboard / loading banner that real KPI values are now
            // painted to the DOM. The 'supabase' source tells the listener NOT
            // to call updateDashboard() (which would overwrite our values with
            // zeros, since crashState.aggregates is empty in lazy mode).
            try {
                document.dispatchEvent(new CustomEvent('crashDataLoaded', {
                    detail: { source: 'supabase', total: agg.total, rows: rows.length }
                }));
            } catch (evtErr) { /* non-fatal */ }

            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.updateTierSwitchProgress) {
                    CL.upload.tierUI.updateTierSwitchProgress(100, 'Ready');
                }
                setTimeout(function () {
                    if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.removeTierSwitchProgress) {
                        CL.upload.tierUI.removeTierSwitchProgress();
                    }
                }, 500);
            } catch (e) { /* non-fatal */ }

            return true;
        } catch (e) {
            console.warn('[Phase2] Supabase bridge failed (non-fatal):', e && e.message);
            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.removeTierSwitchProgress) {
                    CL.upload.tierUI.removeTierSwitchProgress();
                }
            } catch (e2) { /* non-fatal */ }
        }
        return false;
    }

    function onR2LoadComplete() {
        removeBanner();
        // Phase 6: notify the lazy loader that full R2 data is available,
        // so subsequent tab switches skip the lazy-load gate.
        try {
            if (CL.data && CL.data.lazyLoader && CL.data.lazyLoader.markR2Loaded) {
                CL.data.lazyLoader.markR2Loaded();
            }
        } catch (e) { /* non-fatal */ }
        // Hand the map back to the R2-fed updateMapDisplay() — mapBridge would
        // otherwise clobber R2 markers on every pan/zoom by clearing layers.
        try {
            if (CL.data && CL.data.mapBridge && CL.data.mapBridge.detach
                && CL.data.mapBridge.isActive && CL.data.mapBridge.isActive()) {
                CL.data.mapBridge.detach();
            }
        } catch (e) { /* non-fatal */ }
    }

    function refresh() {
        if (_refreshTimer) clearTimeout(_refreshTimer);
        _refreshTimer = setTimeout(function () {
            _refreshTimer = null;
            try {
                if (window.crashLensClient) {
                    var key = _activeStateKey();
                    var bootDefault = (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || null;
                    if (!key || key === bootDefault) {
                        try {
                            var sel = document.getElementById('stateSelect');
                            if (sel && sel.value && typeof _fipsToStateKey === 'function') {
                                var fromFips = _fipsToStateKey(sel.value);
                                if (fromFips) key = fromFips;
                            }
                        } catch (e2) { /* non-fatal */ }
                    }
                    if (key) window.crashLensClient.state = key;
                }
                _injected = false;
                removeBanner();
                injectFastDashboard({ force: true });
            } catch (e) {
                console.warn('[Phase2] refresh failed (non-fatal):', e && e.message);
            }
        }, 150);
    }

    // Re-paint the dashboard + the map whenever the road-type radio
    // changes. Delegated listener so it survives the radios being
    // re-rendered by updateRoadTypeLabels(). Both bridges read the radio
    // through CrashLensDataClient.activeRoadType(...) so they see the
    // same value.
    if (typeof document !== 'undefined') {
        document.addEventListener('change', function (e) {
            if (e && e.target && e.target.name === 'roadTypeFilter') {
                try { _injected = false; injectFastDashboard({ force: true }); } catch (err) { /* non-fatal */ }
                try {
                    if (CL.data && CL.data.mapBridge && CL.data.mapBridge.refresh) {
                        CL.data.mapBridge.refresh();
                    }
                } catch (err) { /* non-fatal */ }
            }
        });
    }

    return {
        injectFastDashboard: injectFastDashboard,
        onR2LoadComplete: onR2LoadComplete,
        refresh: refresh,
        resolveTier: resolveTier,
        activeRoadTypeSpec: activeRoadTypeSpecForSupabase,
        get injected() { return _injected; }
    };
})();

CL._registerModule('data/supabase-bridge');
