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
    var _worker = null;
    var _workerSeq = 0;
    var _workerWaiting = {};   // id → {resolve, reject}

    /**
     * Lazily spin up the agg-worker. Returns null if Workers aren't supported
     * or the script can't be reached — callers fall back to main-thread
     * aggregate().
     */
    function _getWorker() {
        if (_worker !== null) return _worker;          // already booted (or null = failed)
        if (typeof Worker !== 'function') { _worker = false; return null; }
        try {
            // Path is relative to app/index.html (where this module is served from).
            _worker = new Worker('../assets/js/agg-worker.js');
            _worker.onmessage = function (e) {
                var msg = e.data || {};
                var w = _workerWaiting[msg.id];
                if (!w) return;
                delete _workerWaiting[msg.id];
                if (msg.error) w.reject(new Error(msg.error));
                else w.resolve(msg.agg);
            };
            _worker.onerror = function (err) {
                console.warn('[Phase2] agg-worker error, future calls fall back to main thread:', err && err.message);
                _worker = false;
            };
            return _worker;
        } catch (e) {
            console.warn('[Phase2] agg-worker init failed (non-fatal):', e && e.message);
            _worker = false;
            return null;
        }
    }

    /**
     * Run aggregate(rows) — preferring the off-main-thread worker when
     * available, falling back to the synchronous in-module implementation
     * when Workers are unavailable, blocked by CSP, or the worker errored
     * earlier in this session.
     */
    function aggregateAsync(rows) {
        var w = _getWorker();
        if (!w) {
            return Promise.resolve(aggregate(rows));
        }
        return new Promise(function (resolve, reject) {
            var id = ++_workerSeq;
            _workerWaiting[id] = { resolve: resolve, reject: reject };
            try {
                w.postMessage({ id: id, rows: rows });
            } catch (e) {
                delete _workerWaiting[id];
                // Couldn't post — degrade to main-thread aggregate
                resolve(aggregate(rows));
            }
        });
    }

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
                    // Bug 15 — matview columns store Title-case ("Sussex") but legacy
                    // entries in us_counties_db.js list ALL-CAPS as namePatterns[0].
                    // Prefer the first pattern containing a lowercase letter so the
                    // eq-filter matches; fall back to [0] if all are uppercase.
                    for (var i = 0; i < jur.namePatterns.length; i++) {
                        var p = jur.namePatterns[i];
                        if (p && /[a-z]/.test(p)) return p;
                    }
                    return jur.namePatterns[0];
                }
            }
        } catch (e) { /* fall through */ }
        return null;
    }

    /**
     * Look up a county-level rollup target in the active hierarchy.json.
     * Returns the planning_district or dot_district that maps 1:1 to the
     * given county FIPS, or null if no 1:1 mapping is present (multi-county
     * regions disqualify the rollup — falling back to physical_juris_name
     * keeps the answer state-agnostic instead of silently misreporting).
     *
     * Used by Bug 3 fix: until the matview gains a `parent_county_name`
     * column, `physical_juris_name=eq.Sussex` returns ONLY the unincorporated
     * remainder. Where a planning_district covers exactly one county we can
     * substitute `planning_district=eq.<dbName>` and pick up the cities too.
     */
    function _countyRollupTarget(ctx) {
        try {
            if (typeof HierarchyRegistry === 'undefined') return null;
            var hier = HierarchyRegistry.getData();
            if (!hier) return null;
            var fips3 = (ctx && ctx.fullFips) ? String(ctx.fullFips).slice(-3) : null;
            if (!fips3) return null;

            // Prefer planning_district (most stable across states); fall back
            // to dot_district. If multiple PDs/regions cover the same county,
            // 1:1 doesn't hold — bail.
            function find1to1(map) {
                if (!map) return null;
                var hit = null;
                var keys = Object.keys(map);
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i];
                    if (k && k.charAt(0) === '_') continue;
                    var entry = map[k];
                    if (!entry || !Array.isArray(entry.counties)) continue;
                    if (entry.counties.length === 1 && entry.counties[0] === fips3) {
                        if (hit) return null;       // ambiguous
                        hit = { id: k, dbName: entry.dbName || null, name: entry.name || null };
                    }
                }
                return hit;
            }

            var pd = find1to1(hier.planningDistricts);
            if (pd && pd.dbName) return { column: 'planning_district', value: pd.dbName, source: 'planningDistricts', id: pd.id };

            var region = find1to1(hier.regions);
            if (region && region.dbName) return { column: 'dot_district', value: region.dbName, source: 'regions', id: region.id };

            return null;
        } catch (e) {
            return null;
        }
    }

    function _logMissingDbName(scope, id, fallback) {
        // CONFIG bugs of this shape silently produce "0 rows" results — surface
        // loudly so they're caught in DevTools immediately instead of looking
        // like a Supabase outage. State-agnostic; works for any state's hierarchy.
        try {
            console.error('[CONFIG] Missing dbName for tier=' + scope + ' id=' + id +
                ' — falling back to "' + fallback + '" (verify hierarchy.json against dashboard_summary).');
        } catch (e) { /* non-fatal */ }
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
            if (!regionObj.dbName) _logMissingDbName('region', regionObj.id || regionObj.name, regionObj.name);
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
            if (!mpoObj.dbName) _logMissingDbName('mpo', mpoObj.id || mpoObj.name, mpoObj.shortName || mpoObj.name);
            return { tier: 'mpo', value: mpoObj.dbName || mpoObj.shortName || mpoObj.name };
        }
        if (t === 'planning_district') {
            var pdObj = ctx.tierPlanningDistrict;
            if (!pdObj) {
                console.log('[resolveTier] No planning district selected, falling back to state tier');
                return { tier: 'state', value: null };
            }
            if (!pdObj.dbName) _logMissingDbName('planning_district', pdObj.id || pdObj.name, pdObj.name);
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
            // Strip place-type suffix to match the matview's stored format.
            // Dropdown shows "Bellefonte town" / "Dover city" / etc.;
            // physical_juris_name in dashboard_summary stores "Bellefonte" / "Dover".
            // Without this, eq.Bellefonte%20town returns 0 rows and we fall
            // through to the wrong-county R2 parquet.
            if (cityVal) {
                cityVal = cityVal.replace(/\s+(town|city|village|borough|township|CDP|hamlet|municipality)$/i, '').trim();
            }
            return { tier: 'county', value: cityVal };
        }
        if (t === 'county') {
            // Bug 3 — `physical_juris_name` stores the most-specific juris,
            // so a county query at that column returns ONLY the unincorporated
            // remainder (e.g. Sussex=87,073 instead of ~134,159). When the
            // hierarchy has a planning_district / dot_district that maps 1:1
            // to this county, query at THAT column to roll up cities + the
            // unincorporated remainder. Otherwise fall back to
            // physical_juris_name with a UI disclaimer.
            var rollup = _countyRollupTarget(ctx);
            if (rollup) {
                var rollupTier = (rollup.column === 'planning_district') ? 'planning_district' : 'region';
                console.log('[resolveTier] County rollup via ' + rollup.column + '=' +
                    rollup.value + ' (1:1 mapping from ' + rollup.source + '/' + rollup.id + ')');
                // Fix 3 — surface the rollup *column* (planning_district vs
                // dot_district) so the banner copy can be specific instead
                // of generically saying "rolled up".
                return {
                    tier: rollupTier,
                    value: rollup.value,
                    rolledUpFrom: 'county',
                    rollupSource: rollup.source,
                    rollupColumn: rollup.column
                };
            }

            // physicalJurisName is the DB-matching short form stored at selection time
            // (e.g. "New Castle" not "New Castle County"). 50-state safe — sourced from
            // config.json namePatterns[0]. Falls back to config lookup, then a
            // suffix-stripped display name to match the matview format.
            var countyVal = ctx.physicalJurisName || jurisdictionDbName(ctx.jurisdictionKey) || null;
            if (!countyVal) {
                var rawCounty = ctx.jurisdictionName || '';
                countyVal = rawCounty.replace(/\s+County$/i, '') || null;
            }
            return { tier: 'county', value: countyVal, unincorporatedOnly: true };
        }
        return { tier: 'state', value: null };
    }

    /**
     * Resolve the active "Road Type" radio into a tier-aware bucket spec for
     * the matviews. Returns one of:
     *   - {} ............................ all roads (no filter)
     *   - { roadType: 'dot_roads' } ...... single bucket
     *   - { roadType: 'city_roads' } ..... new (2026-04-30) bucket from ownership
     *   - { roadTypes: [...] } ........... Federal "Non-DOT" — array of buckets
     *   - { noInterstate: true } ......... County "All Roads (No Interstate)"
     *
     * Matview semantics (post-2026-04-30):
     *   road_type ∈ {dot_roads, county_roads, city_roads, other_roads}
     *   is_interstate ∈ {true, false}
     *   road_type buckets are derived from crashes.ownership (NOT crashes.system).
     *
     * The tier × radio table lives in CL.data.roadTypeMapping — single source
     * of truth shared with CrashLensDataClient.radioToBucket(),
     * updateRoadTypeLabels(), and getActiveRoadTypeSuffix(). MPO / planning
     * district are PLACE tiers (countyOnly → county_roads, countyPlusVDOT →
     * noInterstate); only federal / state / region are AGGREGATE tiers.
     */
    function roadTypeSpec() {
        var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
        var tier = (ctx && ctx.viewTier) || 'county';
        var radioVal = (CL.data.roadTypeMapping)
            ? CL.data.roadTypeMapping.activeRadioValue()
            : ((document.querySelector('input[name="roadTypeFilter"]:checked') || {}).value
                || (typeof localStorage !== 'undefined' && localStorage.getItem('selectedFilterProfile'))
                || 'allRoads');
        if (CL.data.roadTypeMapping) {
            // Defensive copy so callers can't mutate the shared spec.
            var src = CL.data.roadTypeMapping.specFor(tier, radioVal) || {};
            var out = {};
            if (src.roadType) out.roadType = src.roadType;
            if (Array.isArray(src.roadTypes)) out.roadTypes = src.roadTypes.slice();
            if (src.noInterstate) out.noInterstate = true;
            return out;
        }
        // Defensive fallback (shouldn't happen — module loads before bridge).
        return {};
    }

    /**
     * Render skeleton placeholders in the KPI cards so the user gets visual
     * feedback that a Supabase fetch is in flight after a tier or road-type
     * change. Cleared as soon as paintKPIs() runs.
     */
    function showSkeletonKPIs() {
        var ids = [
            'kpiTotal','kpiFatal','kpiInjuryA','kpiInjuryBC','kpiPDO',
            'kpiEPDO','kpiKA','kpiVRU','kpiSpeed','kpiNighttime'
        ];
        for (var i = 0; i < ids.length; i++) {
            var el = document.getElementById(ids[i]);
            if (el) el.textContent = '…';
        }
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

    function showBanner(opts) {
        var existing = document.getElementById('supabaseBridgeIndicator');
        var msg = '⚡ Summary loaded from database — detailed charts & filters loading...';
        var bg = '#1e3a8a', border = '#60a5fa', fg = '#e0e7ff';
        if (opts && opts.zeroRows) {
            // Fix 2c: amber banner when the matview legitimately returned 0 rows
            // for this jurisdiction × road-type combination. Tells the user
            // "we asked, the answer was zero" — distinct from a load failure.
            msg = '⚠ No matching crashes for this jurisdiction × road-type combination.';
            bg = '#78350f'; border = '#fbbf24'; fg = '#fef3c7';
        } else if (opts && opts.unincorporatedOnly) {
            // Bug 3 disclaimer — visible to the user when we couldn't roll up
            // the county to planning_district / dot_district and physical_juris_name
            // is returning unincorporated rows only.
            msg += ' · Incorporated cities reported separately.';
        } else if (opts && opts.rolledUp) {
            // Fix 3: confirms to the user that the headline number includes
            // the county's incorporated cities (rolled up via the named column).
            msg += ' · Includes incorporated cities (rolled up via ' + (opts.rollupColumn || 'planning_district') + ').';
        }
        if (existing) {
            existing.style.background = bg;
            existing.style.borderLeftColor = border;
            existing.style.color = fg;
            existing.textContent = msg;
            return;
        }
        var banner = document.createElement('div');
        banner.id = 'supabaseBridgeIndicator';
        banner.style.cssText = 'padding:8px 14px;margin:0 0 10px 0;background:' + bg + ';color:' + fg + ';border-radius:6px;font-size:13px;border-left:3px solid ' + border + ';';
        banner.textContent = msg;
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
                var dropdownStateA = null;

                if (typeof _getActiveStateKey === 'function') {
                    stateKey = _getActiveStateKey();
                }

                var bootDefault = (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || null;
                try {
                    var stateSelectA = document.getElementById('stateSelect');
                    if (stateSelectA && stateSelectA.value && typeof _fipsToStateKey === 'function') {
                        dropdownStateA = _fipsToStateKey(stateSelectA.value);
                    }
                } catch (e2) { /* non-fatal */ }

                // Fix A3 — if _getActiveStateKey fell through to Priority 5
                // (bootDefault), prefer the live dropdown when it has a more-
                // specific value. Same intent as the Fix A second-defense
                // block below, but applied here so the FIRST defense doesn't
                // pin state to 'colorado' before the second defense even runs.
                if (!stateKey || stateKey === bootDefault) {
                    if (dropdownStateA) {
                        stateKey = dropdownStateA;
                    }
                }

                // Fix A3 guard: never overwrite an already-specific
                // crashLensClient.state with the boot default when the only
                // signal we have IS the boot default. This is what was
                // letting the boot race repeatedly pin state to 'colorado'
                // and produce 0-row matview queries for Delaware.
                if (
                    stateKey &&
                    stateKey !== window.crashLensClient.state &&
                    !(stateKey === bootDefault && !dropdownStateA && window.crashLensClient.state && window.crashLensClient.state !== bootDefault)
                ) {
                    window.crashLensClient.state = stateKey;
                }
            }
        } catch (e) { /* non-fatal */ }

        // Final defense: prefer the live state dropdown over jurisdictionContext.
        // ctx.stateKey is set by buildJurisdictionContextFromSelection() but during
        // boot or rapid state switch it can lag the dropdown (it's whatever
        // _getActiveStateKey returned at the time of the last jurisdiction pick).
        // Always trust the dropdown when its value resolves to a state key.
        // Final defense: prefer the live state dropdown over jurisdictionContext.
        // Boot race fix: ctx.stateName can be a stale appConfig.defaultState
        // (e.g. 'Colorado' before the user's Delaware selection propagates), so
        // falling back to ctxState during boot can correct the state BACKWARDS
        // (delaware → colorado), poisoning the very first matview query. Only
        // trust ctx.stateKey (set explicitly by buildJurisdictionContextFromSelection)
        // — never fall back to ctx.stateName-derived state. And never overwrite a
        // non-default crashLensClient.state with the appConfig boot default.
        try {
            var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
            if (window.crashLensClient) {
                var dropdownState = null;
                try {
                    var stateSelectFinal = document.getElementById('stateSelect');
                    if (stateSelectFinal && stateSelectFinal.value && typeof _fipsToStateKey === 'function') {
                        dropdownState = _fipsToStateKey(stateSelectFinal.value);
                    }
                } catch (e2) { /* non-fatal */ }
                // Only ctx.stateKey is trustworthy at boot. ctx.stateName-derived
                // values can leak the appConfig default and cause backwards correction.
                var ctxState = ctx && ctx.stateKey ? ctx.stateKey : null;
                var targetState = dropdownState || ctxState;
                var bootDefault = (typeof appConfig !== 'undefined' && appConfig && appConfig.defaultState) || null;

                if (
                    targetState &&
                    targetState !== window.crashLensClient.state &&
                    // Don't overwrite a more-specific state with the boot default
                    // when the only signal we have is the boot default itself.
                    !(targetState === bootDefault && !dropdownState)
                ) {
                    console.log('[Phase2] State corrected: ' +
                        window.crashLensClient.state + ' → ' + targetState +
                        ' (dropdown=' + dropdownState + ', ctx.stateKey=' + (ctx && ctx.stateKey) + ')');
                    window.crashLensClient.state = targetState;
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
            var spec = roadTypeSpec();
            console.log('[Phase2] Fetching summary from Supabase...', { tier: t.tier, value: t.value, spec: spec });
            try {
                if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.updateTierSwitchProgress) {
                    CL.upload.tierUI.updateTierSwitchProgress(15, 'Fetching dashboard summary…');
                }
            } catch (e) { /* non-fatal */ }
            var startTime = Date.now();
            var summaryFilters = {};
            if (spec.roadType) summaryFilters.roadType = spec.roadType;
            if (spec.roadTypes) summaryFilters.roadTypes = spec.roadTypes;
            if (spec.noInterstate) summaryFilters.noInterstate = true;
            var rows = await window.crashLensClient.getSummary(t.tier, t.value, summaryFilters);
            var fetchMs = Date.now() - startTime;

            // Fix 1 — when the matview returns 0 rows AND the tier is one
            // where data is expected to exist (rolled-up county OR any
            // aggregate tier with a non-null value), re-sync state from the
            // dropdown and retry once. This catches the boot-time race where
            // crashLensClient.state was the previous state when the first
            // fetch fired but corrected to the new state right after.
            // State-agnostic — works for any state.
            var _expectsData = !!(t.rolledUpFrom === 'county' ||
                (t.tier !== 'county' && t.tier !== 'city' && t.value));
            if ((!Array.isArray(rows) || rows.length === 0) && _expectsData) {
                try {
                    var _stateSelectRetry = document.getElementById('stateSelect');
                    var _retryStateKey = (_stateSelectRetry && _stateSelectRetry.value && typeof _fipsToStateKey === 'function')
                        ? _fipsToStateKey(_stateSelectRetry.value)
                        : null;
                    if (_retryStateKey && window.crashLensClient.state !== _retryStateKey) {
                        console.log('[Phase2] Retry — state was ' + window.crashLensClient.state + ', dropdown says ' + _retryStateKey + ' — re-querying.');
                        window.crashLensClient.state = _retryStateKey;
                    }
                    // Brief wait for any in-flight DOM/state propagation, then retry.
                    await new Promise(function (r) { setTimeout(r, 250); });
                    var _retryStart = Date.now();
                    var rowsRetry = await window.crashLensClient.getSummary(t.tier, t.value, summaryFilters);
                    var retryMs = Date.now() - _retryStart;
                    if (Array.isArray(rowsRetry) && rowsRetry.length > 0) {
                        console.log('[Phase2] Retry succeeded — ' + rowsRetry.length + ' rows in ' + retryMs + 'ms (was 0 in ' + fetchMs + 'ms).');
                        rows = rowsRetry;
                        fetchMs += retryMs;
                    }
                } catch (retryErr) {
                    console.warn('[Phase2] Retry failed (non-fatal):', retryErr && retryErr.message);
                }
            }

            if (!force && typeof crashState !== 'undefined' && crashState && crashState.loaded) {
                console.log('[Phase2] R2 won the race (' + fetchMs + 'ms fetch, but R2 finished first), discarding');
                return;
            }
            // Fix 2c — when the matview legitimately returns 0 rows (a real
            // jurisdiction × road-type combination with no crashes, e.g. a
            // tiny city + countyOnly filter), the previous behavior was to
            // bail with `return false`, leaving stale KPIs on screen and
            // inviting downstream R2 fallbacks to fill in wrong numbers.
            // Now: paint zeros + amber banner + dispatch crashDataLoaded so
            // the rest of the app converges on "0 crashes" deliberately.
            if (!Array.isArray(rows) || rows.length === 0) {
                var hasFilter = !!(spec && (spec.roadType || (Array.isArray(spec.roadTypes) && spec.roadTypes.length) || spec.noInterstate));
                if (t.tier === 'county' && t.value && hasFilter) {
                    paintKPIs({
                        total: 0, bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
                        byYear: {}, byFuncClass: {}, byCollision: {},
                        safety: { ped: 0, bike: 0, speed: 0, alcohol: 0, night: 0, animal: 0, fatals: 0, seriousInjured: 0, totalInjured: 0 }
                    });
                    showBanner({ zeroRows: true });
                    if (typeof crashState !== 'undefined' && crashState && !crashState.loaded) {
                        crashState.loaded = true;
                        crashState.sampleRows = [];
                    }
                    try {
                        document.dispatchEvent(new CustomEvent('crashDataLoaded', {
                            detail: { source: 'supabase', total: 0, rows: 0, zeroRows: true }
                        }));
                    } catch (evtErr) { /* non-fatal */ }
                    return true;
                }
                return false;
            }

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
            // Fix 3 — surface the rollup column ('planning_district' or
            // 'dot_district') in the banner copy so the user reads
            // "Includes incorporated cities (rolled up via planning_district)"
            // instead of just the bare "Summary loaded" message.
            showBanner({
                unincorporatedOnly: !!t.unincorporatedOnly,
                rolledUp: !!t.rolledUpFrom,
                rollupColumn: t.rollupColumn || null
            });
            _injected = true;

            console.log('[Phase2] Supabase bridge injected', {
                tier: t.tier, value: t.value, rows: rows.length, total: agg.total
            });

            // Bug G: ensure crashState.loaded = true so detail tabs (which all
            // gate on this flag) don't bail before their matview path runs.
            // Fix 4 — also refresh crashState.totalRows from the bridge agg
            // so the loaded log + downstream consumers don't show a stale
            // crashState.totalRows from the previous tier's R2 load
            // (e.g. federal tier showing 'rows: 2047' from prior Kent load).
            try {
                if (typeof crashState !== 'undefined' && crashState) {
                    if (!crashState.loaded) {
                        crashState.loaded = true;
                        if (!Array.isArray(crashState.sampleRows)) crashState.sampleRows = [];
                    }
                    crashState.totalRows = (agg && typeof agg.total === 'number') ? agg.total : 0;
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

    /**
     * Attach a delegated change listener on the document that fires the bridge
     * refresh whenever the user picks a different "Road Type" radio. Idempotent —
     * safe to call multiple times. Painted skeletons clear when the new fetch
     * completes via paintKPIs().
     */
    var _roadTypeListenerAttached = false;
    function attachRoadTypeListener() {
        if (_roadTypeListenerAttached) return;
        _roadTypeListenerAttached = true;
        try {
            document.addEventListener('change', function (e) {
                var t = e && e.target;
                if (!t || t.name !== 'roadTypeFilter') return;
                showSkeletonKPIs();
                refresh();
            }, false);
        } catch (e) { /* non-fatal */ }
    }

    function refresh() {
        // 250ms debounce — collapses the "input + change + click + tier-handler"
        // burst that fires on a single radio click into one Supabase query.
        // Pre-fix the console showed [Phase2] Fetching summary from Supabase...
        // 2–8 times per click; one is enough.
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
        }, 250);
    }

    return {
        injectFastDashboard: injectFastDashboard,
        onR2LoadComplete: onR2LoadComplete,
        refresh: refresh,
        resolveTier: resolveTier,
        roadTypeSpec: roadTypeSpec,
        showSkeletonKPIs: showSkeletonKPIs,
        attachRoadTypeListener: attachRoadTypeListener,
        get injected() { return _injected; }
    };
})();

CL._registerModule('data/supabase-bridge');
