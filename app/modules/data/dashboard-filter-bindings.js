/* CL module: data/dashboard-filter-bindings
 * Round 18/19 filter-audit wiring (dashboard year filter, hotspots /
 * intersections reload, safety-category filter, traffic-control dropdown,
 * active-scope card). Verbatim wholesale extraction of the shared
 * end-of-body IIFE (was app/index.html; name-anchored — Session-I snapshot
 * L148182–L148874; Session J live L145184–L145882 incl. ROUND 18 banner).
 * Public API (forward-compat mirrors — nothing external calls these today):
 *   window._r18ApplyDashboardYearFilter        / CL.data._r18ApplyDashboardYearFilter
 *   window._r18ReloadHotspots                  / CL.data._r18ReloadHotspots
 *   window._r19LoadSafetyCategoriesWithFilter  / CL.data._r19LoadSafetyCategoriesWithFilter
 *   window._bindFilterInputs                   / CL.data._bindFilterInputs
 *   window._restoreFilterInputs                / CL.data._restoreFilterInputs
 * Inner-IIFE-private (NO mirror — closure-private): _activeStateKey,
 *   _yearFromIsoDate, populateTrafficControlDropdown, _applyTrafficCtrlOptions,
 *   applyStateAwareCheckboxDefaults, _hasCMFLocationSelected,
 *   _refreshActiveScopeCard, _r18ReloadIntersections, _bindOnce,
 *   const _trafficCtrlCache. (The original verbatim code self-exposes a few
 *   of these on window — preserved as-is; the only edit here is the 5-anchor
 *   mirror block before the original [Round 18] log line.)
 */
(function () {
    'use strict';

    // ROUND 18 — Filter-audit wiring (§2, §4, §5, §7, §8, §9, §10)
    // Hooks the FilterEngine subscribers, populates Supabase-backed
    // filter dropdowns, and ties the audit-found UX gaps together.
    // All event handlers are idempotent — safe to re-run on tab change.
    // State-agnostic: keys on FilterEngine spec + crashLensClient.state,
    // never on hard-coded jurisdiction names.
    // ============================================================
    /* ===== BEGIN verbatim original IIFE (do not modify) ===== */
(function () {
    'use strict';

    function _activeStateKey() {
        try {
            return ((window.crashLensClient && window.crashLensClient.state) || '').toLowerCase();
        } catch (e) { return ''; }
    }
    function _yearFromIsoDate(iso) {
        if (!iso) return null;
        const m = String(iso).match(/^(\d{4})/);
        return m ? parseInt(m[1], 10) : null;
    }

    // ---------------------------------------------------------------
    // §4 — Traffic Control dropdown populator
    // Populates the Intersections tab Traffic Control filter from
    // get_traffic_control_types RPC. Runs the first time the user
    // opens the Intersections tab, then caches per-state.
    // ---------------------------------------------------------------
    const _trafficCtrlCache = new Map();
    async function populateTrafficControlDropdown() {
        const sel = document.getElementById('intFilterTrafficCtrl');
        if (!sel) return;
        const stateKey = _activeStateKey();
        if (!stateKey) return;
        if (_trafficCtrlCache.has(stateKey)) {
            _applyTrafficCtrlOptions(sel, _trafficCtrlCache.get(stateKey));
            return;
        }
        try {
            const client = window.crashLensClient;
            if (!client || typeof client.getTrafficControlTypes !== 'function') return;
            const rows = await client.getTrafficControlTypes(stateKey);
            if (!Array.isArray(rows) || rows.length === 0) return;
            _trafficCtrlCache.set(stateKey, rows);
            _applyTrafficCtrlOptions(sel, rows);
            console.log('[Round 18 §4] Traffic Control dropdown populated:', rows.length, 'types');
        } catch (e) {
            console.warn('[Round 18 §4] Traffic Control populate failed:', e && e.message);
        }
    }
    function _applyTrafficCtrlOptions(sel, rows) {
        // Preserve any existing selection if it's still valid
        const prev = sel.value;
        const opts = ['<option value="">All Traffic Controls</option>'];
        for (const r of rows) {
            const v = String(r.raw_value || '').replace(/"/g, '&quot;');
            const lbl = String(r.label || r.raw_value || '');
            const cnt = (typeof r.crash_count === 'number') ? r.crash_count.toLocaleString() : '';
            opts.push('<option value="' + v + '">' + lbl + (cnt ? ' (' + cnt + ')' : '') + '</option>');
        }
        sel.innerHTML = opts.join('');
        if (prev && [...sel.options].some(o => o.value === prev)) sel.value = prev;
    }
    window.populateTrafficControlDropdown = populateTrafficControlDropdown;

    // Re-populate when the user enters the Intersections tab or switches state.
    document.addEventListener('crashDataLoaded', () => { populateTrafficControlDropdown(); });
    // Also hook into showTab — wrap once
    if (typeof showTab === 'function' && !showTab.__round18Wrapped) {
        const _origShowTab = showTab;
        const _wrapped = function (tabId) {
            const r = _origShowTab.apply(this, arguments);
            try {
                if (tabId === 'intersection') populateTrafficControlDropdown();
                if (tabId === 'dashboard') applyStateAwareCheckboxDefaults();
            } catch (e) { /* non-fatal */ }
            return r;
        };
        _wrapped.__round18Wrapped = true;
        window.showTab = _wrapped;
    }

    // ---------------------------------------------------------------
    // §8 — State-aware checkbox defaults
    // ---------------------------------------------------------------
    function applyStateAwareCheckboxDefaults() {
        const stateKey = _activeStateKey();
        if (!stateKey) return;
        const vfirst = document.getElementById('cmfVirginiaFirst');
        if (vfirst && !vfirst.dataset.userTouched) {
            vfirst.checked = (stateKey === 'virginia');
        }
        // Round 21 §8 — label clarifies why the checkbox is off outside VA.
        const vfirstLabel = document.getElementById('cmfVirginiaFirstLabel');
        if (vfirstLabel) {
            vfirstLabel.textContent = (stateKey === 'virginia')
                ? '🗺️ Virginia First (matches your state)'
                : `🗺️ Virginia First (off — your state is ${stateKey})`;
        }
        const proven = document.getElementById('cmfProvenOnly');
        if (proven && !proven.dataset.userTouched) {
            // Default FHWA Proven Only when the state is NOT Virginia
            proven.checked = (stateKey !== 'virginia');
        }
    }
    // Mark inputs as user-touched once the user interacts, so we don't
    // overwrite their choice on subsequent state changes.
    document.addEventListener('change', (e) => {
        if (!e.target) return;
        if (e.target.id === 'cmfVirginiaFirst' || e.target.id === 'cmfProvenOnly') {
            e.target.dataset.userTouched = '1';
        }
    });
    window.applyStateAwareCheckboxDefaults = applyStateAwareCheckboxDefaults;
    // Round 22 §5a — alias under the Round 21 §8 spec name so audit health-checks
    // pass. Both names point to the same function.
    window._syncVirginiaFirstDefault = applyStateAwareCheckboxDefaults;

    // ---------------------------------------------------------------
    // §9 — Find Countermeasures validation
    // Wrap setCMFMode + findCountermeasures so the "algo" toggle no
    // longer silently fails when no location is selected.
    // ---------------------------------------------------------------
    function _hasCMFLocationSelected() {
        try {
            if (typeof cmfState !== 'undefined' && cmfState && cmfState.selectedLocation) return true;
        } catch (e) { /* ignore */ }
        const sel = document.getElementById('cmfLocationSelect');
        if (sel && sel.value && sel.value !== '') return true;
        const search = document.getElementById('cmfRoadSearch');
        if (search && search.value && String(search.value).trim().length > 0) return true;
        return false;
    }
    if (typeof setCMFMode === 'function' && !setCMFMode.__round18Wrapped) {
        const _origSetCMFMode = setCMFMode;
        const _wrappedSet = function (mode, forceRefresh) {
            if (mode === 'algo' && !_hasCMFLocationSelected()) {
                if (typeof showToast === 'function') {
                    showToast('Please select a road name or location to find countermeasures.', 'warning');
                }
                const search = document.getElementById('cmfRoadSearch');
                if (search) try { search.focus(); } catch (e) { /* ignore */ }
                return;
            }
            return _origSetCMFMode.apply(this, arguments);
        };
        _wrappedSet.__round18Wrapped = true;
        window.setCMFMode = _wrappedSet;
    }

    // ---------------------------------------------------------------
    // §7 — Active Scope label sync
    // Re-render the upload-tab tier scope card whenever the user
    // changes the MPO / Region / Planning District select, so the
    // label updates immediately (audit F003).
    // ---------------------------------------------------------------
    function _refreshActiveScopeCard() {
        try {
            const tier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) || 'county';
            if (CL && CL.upload && CL.upload.tierUI && typeof CL.upload.tierUI.applyUploadTierUI === 'function') {
                CL.upload.tierUI.applyUploadTierUI(tier);
            }
        } catch (e) { /* non-fatal */ }
    }
    ['tierMPOSelect','tierRegionSelect','tierPlanningDistrictSelect','jurisdictionSelect','tierCountySelect','stateSelect']
        .forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.dataset.r18ScopeBound) {
                el.addEventListener('change', _refreshActiveScopeCard);
                el.dataset.r18ScopeBound = '1';
            }
        });

    // ---------------------------------------------------------------
    // §10 — Loading spinner sync
    // Update the loading text BEFORE any async fetch so the user sees
    // an accurate label during tier switches (audit F004, L001).
    // ---------------------------------------------------------------
    if (typeof handleTierChange === 'function' && !handleTierChange.__round18Wrapped) {
        const _origHandleTierChange = handleTierChange;
        const TIER_LOAD_LABELS = {
            state: 'Statewide', region: 'Regional', mpo: 'MPO',
            planning_district: 'Planning District', county: 'County',
            city: 'City / Town', federal: 'Federal'
        };
        const _wrappedTier = async function (tier) {
            try {
                if (typeof showLoading === 'function') {
                    const label = TIER_LOAD_LABELS[tier] || tier;
                    showLoading('Switching to ' + label + ' view…');
                }
            } catch (e) { /* non-fatal */ }
            try {
                return await _origHandleTierChange.apply(this, arguments);
            } finally {
                try { if (typeof hideLoading === 'function') hideLoading(); } catch (e) { /* ignore */ }
            }
        };
        _wrappedTier.__round18Wrapped = true;
        window.handleTierChange = _wrappedTier;
    }

    // ---------------------------------------------------------------
    // §5 — EPDO preset recompute cascade
    // The existing recalculateAllEPDO() runs updateDashboard / hotspots
    // / grants / cmf / safety. At aggregate tiers (where crashState
    // has no sampleRows), updateDashboard early-returns and the KPI
    // card never refreshes. Patch the cascade so it also re-fires
    // the Supabase dashboard injection.
    // ---------------------------------------------------------------
    if (typeof recalculateAllEPDO === 'function' && !recalculateAllEPDO.__round18Wrapped) {
        const _origRecalc = recalculateAllEPDO;
        const _wrappedRecalc = function () {
            const r = _origRecalc.apply(this, arguments);
            try {
                if (CL && CL.data && CL.data.supabaseBridge &&
                    typeof CL.data.supabaseBridge.injectFastDashboard === 'function') {
                    CL.data.supabaseBridge.injectFastDashboard({ force: true });
                }
            } catch (e) { /* non-fatal */ }
            return r;
        };
        _wrappedRecalc.__round18Wrapped = true;
        window.recalculateAllEPDO = _wrappedRecalc;
    }

    // ---------------------------------------------------------------
    // §2 — Global FilterEngine subscribers
    // ---------------------------------------------------------------
    if (!window.FilterEngine) {
        console.warn('[Round 18 §2] FilterEngine not loaded; subscribers skipped.');
        return;
    }

    // §2.1 Dashboard subscriber
    FilterEngine.subscribe('dashboard', async (spec, changedKeys) => {
        if (!changedKeys.some(k => ['year_start','year_end','severity','road_type','date_start','date_end'].includes(k))) return;
        try {
            // Mirror to legacy currentFilters so getFilteredStats() path stays
            // consistent for the R2-loaded case.
            if (typeof currentFilters !== 'undefined') {
                currentFilters.startDate = spec.date_start;
                currentFilters.endDate = spec.date_end;
                currentFilters.severity = Array.from(spec.severity || []);
            }
            // R2-loaded path: re-render the dashboard locally.
            if (typeof crashState !== 'undefined' && crashState && crashState.sampleRows && crashState.sampleRows.length > 0 &&
                typeof updateDashboard === 'function') {
                updateDashboard();
                if (typeof updateMapDisplay === 'function' && typeof crashMap !== 'undefined' && crashMap) updateMapDisplay();
                return;
            }
            // Supabase-only path: do a direct dashboard_summary fetch with
            // year filter and paint the year-range KPI subtext + total. Heavy
            // chart repainting still flows through paintDashboardChartsFromMatview.
            await _r18ApplyDashboardYearFilter(spec);
        } catch (e) {
            console.warn('[Round 18 §2.1] dashboard subscriber failed:', e && e.message);
        }
    });

    async function _r18ApplyDashboardYearFilter(spec) {
        const client = window.crashLensClient;
        if (!client || !client.supabaseUrl || !client.supabaseKey) return;
        const stateKey = _activeStateKey();
        if (!stateKey) return;
        const params = new URLSearchParams({
            state: 'eq.' + stateKey,
            select: 'crash_year,crash_count,fatals,serious_injuries,ped_crashes,bike_crashes,speed_crashes,night_crashes',
            limit: '2000'
        });
        if (spec.year_start != null) params.append('crash_year', 'gte.' + spec.year_start);
        if (spec.year_end   != null) params.append('crash_year', 'lte.' + spec.year_end);
        if (spec.road_type === 'all_no_interstate') params.set('is_interstate', 'eq.false');
        else if (spec.road_type && spec.road_type !== 'all') params.set('road_type', 'eq.' + spec.road_type);
        const url = client.supabaseUrl + '/dashboard_summary?' + params.toString();
        try {
            const resp = await fetch(url, {
                headers: { 'apikey': client.supabaseKey, 'Authorization': 'Bearer ' + client.supabaseKey }
            });
            if (!resp.ok) {
                console.warn('[Round 18 §2.1] dashboard_summary fetch HTTP ' + resp.status);
                return;
            }
            const rows = await resp.json();
            if (!Array.isArray(rows)) return;
            // Aggregate
            let total = 0, K = 0, A = 0, ped = 0, bike = 0;
            const yearsSeen = new Set();
            for (const r of rows) {
                const c = parseInt(r.crash_count, 10) || 0;
                total += c;
                K   += parseInt(r.fatals, 10) || 0;
                A   += parseInt(r.serious_injuries, 10) || 0;
                ped += parseInt(r.ped_crashes, 10) || 0;
                bike+= parseInt(r.bike_crashes, 10) || 0;
                if (r.crash_year) yearsSeen.add(parseInt(r.crash_year, 10));
            }
            const ys = [...yearsSeen].sort();
            const yRange = ys.length ? (ys[0] + (ys.length > 1 ? ('–' + ys[ys.length - 1]) : '')) : '';
            const _set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            _set('kpiTotal', total.toLocaleString());
            _set('kpiYearRange', yRange);
            _set('kpiFatal', K.toLocaleString());
            _set('kpiPed', ped.toLocaleString());
            _set('kpiBike', bike.toLocaleString());
            console.log('[Round 18 §2.1] Dashboard refreshed with year filter:', spec.year_start, '–', spec.year_end, 'total=', total);
        } catch (e) {
            console.warn('[Round 18 §2.1] dashboard fetch failed:', e && e.message);
        }
    }

    // §2.2 Hot Spots subscriber
    FilterEngine.subscribe('hotspots', async (spec, changedKeys) => {
        if (!changedKeys.some(k => ['year_start','year_end','min_crashes','group_by','location_type','road_type'].includes(k))) return;
        try {
            await _r18ReloadHotspots(spec);
        } catch (e) {
            console.warn('[Round 18 §2.2] hotspots subscriber failed:', e && e.message);
        }
    });

    async function _r18ReloadHotspots(spec) {
        const client = window.crashLensClient;
        if (!client || typeof client.getHotspotsYearly !== 'function') {
            // Fallback: just re-run the existing analyzer with whatever inputs
            // it can read from the DOM. min_crashes/group_by are already wired
            // through document.getElementById() in analyzeHotspots().
            if (typeof analyzeHotspots === 'function') analyzeHotspots();
            return;
        }
        const tier = (CL && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier)
            ? CL.data.supabaseBridge.resolveTier() : { tier: 'state', value: null };
        const opts = {
            yearStart: spec.year_start,
            yearEnd:   spec.year_end,
            locationType: spec.location_type || null,
            limit: 500,
        };
        if (tier.tier === 'county') opts.county = tier.value;
        if (tier.tier === 'mpo')    opts.mpo = tier.value;
        if (tier.tier === 'region') opts.region = tier.value;
        const raw = await client.getHotspotsYearly(opts);
        if (!Array.isArray(raw)) {
            if (typeof analyzeHotspots === 'function') analyzeHotspots();
            return;
        }
        // Roll up (location_type, location_name) across the filtered year window
        const agg = new Map();
        for (const r of raw) {
            const key = (r.location_type || '') + '|' + (r.location_name || '');
            if (!agg.has(key)) {
                agg.set(key, {
                    location_type: r.location_type, location_name: r.location_name,
                    total_crashes: 0, k: 0, a: 0, b: 0, c: 0, o: 0, epdo: 0,
                    ped_count: 0, bike_count: 0,
                    lat: r.lat, lon: r.lon
                });
            }
            const acc = agg.get(key);
            acc.total_crashes += parseInt(r.total_crashes, 10) || 0;
            acc.k += parseInt(r.k, 10) || 0;
            acc.a += parseInt(r.a, 10) || 0;
            acc.b += parseInt(r.b, 10) || 0;
            acc.c += parseInt(r.c, 10) || 0;
            acc.o += parseInt(r.o, 10) || 0;
            acc.epdo += parseFloat(r.epdo) || 0;
            acc.ped_count += parseInt(r.ped_count, 10) || 0;
            acc.bike_count += parseInt(r.bike_count, 10) || 0;
        }
        let rolled = [...agg.values()];
        if (spec.min_crashes != null) rolled = rolled.filter(r => r.total_crashes >= spec.min_crashes);
        rolled.sort((a, b) => b.epdo - a.epdo);
        console.log('[Round 18 §2.2] hotspots rolled:', rolled.length, 'rows after year/min_crashes filter');

        // Hand the data back to the existing renderer if a hook exists.
        // The current renderer reads from crashState.hotspots, so write
        // there in the renderHotspots shape (best-effort) and call it.
        try {
            if (typeof crashState !== 'undefined' && crashState) {
                crashState.hotspots = rolled.map((r, idx) => ({
                    rank: idx + 1,
                    loc: r.location_name,
                    type: r.location_type,
                    total: r.total_crashes,
                    K: r.k, A: r.a, B: r.b, C: r.c, O: r.o,
                    epdo: r.epdo,
                    perYear: 0,
                    topType: 'N/A',
                    pedCount: r.ped_count,
                    bikeCount: r.bike_count,
                    severity: { K: r.k, A: r.a, B: r.b, C: r.c, O: r.o }
                }));
                if (typeof setPaginationData === 'function') setPaginationData('hotspots', crashState.hotspots);
                if (typeof renderHotspots === 'function') renderHotspots();
            }
        } catch (e) { console.warn('[Round 18 §2.2] hotspots render failed:', e && e.message); }
    }

    // §2.3 Intersections subscriber
    FilterEngine.subscribe('intersections', (spec, changedKeys) => {
        if (!changedKeys.some(k => ['year_start','year_end','traffic_control','road_type'].includes(k))) return;
        try { _r18ReloadIntersections(spec); }
        catch (e) { console.warn('[Round 18 §2.3] intersections subscriber failed:', e && e.message); }
    });

    async function _r18ReloadIntersections(spec) {
        // Re-fire the existing tab-load pipeline. The mv_intersection_summary
        // path used by tab-loaders honors crash_year predicates added as URL
        // params via FilterEngine — but if not, we still want the visible UI
        // to acknowledge the change.
        if (typeof updateIntersectionTab === 'function') updateIntersectionTab();
        // Also surface the active TC filter visibly so the user knows it took.
        const sel = document.getElementById('intFilterTrafficCtrl');
        if (sel) {
            // FilterEngine traffic_control is the raw value; only set if it
            // exists in the dropdown.
            if (spec.traffic_control && [...sel.options].some(o => o.value === spec.traffic_control)) {
                sel.value = spec.traffic_control;
            }
        }
    }

    // §2.4 Fatal & Speeding subscriber
    FilterEngine.subscribe('fatalspeeding', (spec, changedKeys) => {
        if (!changedKeys.some(k => ['year_start','year_end','severity'].includes(k))) return;
        try {
            if (typeof fatalSpeedingState !== 'undefined' && fatalSpeedingState) {
                fatalSpeedingState.loaded = false;
            }
            if (typeof updateFatalSpeedingTab === 'function') updateFatalSpeedingTab();
            else if (typeof showTab === 'function') showTab('fatalspeeding');
        } catch (e) {
            console.warn('[Round 18 §2.4] fatalspeeding subscriber failed:', e && e.message);
        }
    });

    // §2.5 Ped/Bike subscriber
    FilterEngine.subscribe('pedbike', (spec, changedKeys) => {
        if (!changedKeys.some(k => ['people_injury_type','year_start','year_end'].includes(k))) return;
        try {
            if (typeof updatePedBikeTab === 'function') updatePedBikeTab();
        } catch (e) {
            console.warn('[Round 18 §2.5] pedbike subscriber failed:', e && e.message);
        }
    });

    // §2.6 Round 19 §8 — Safety Focus subscriber. mv_safety_categories ignores
    // the date filter; the new per-year companion mv_safety_categories_yearly
    // lets us narrow on a year window. State-agnostic: tier+state come from
    // the supabaseBridge / FilterEngine, never a state literal.
    async function _r19LoadSafetyCategoriesWithFilter(spec) {
        const client = window.crashLensClient;
        if (!client || !client.supabaseUrl || !client.supabaseKey) return null;
        const stateKey = (typeof _activeStateKey === 'function')
            ? _activeStateKey()
            : (client.state || '').toLowerCase();
        if (!stateKey) return null;
        const t = (CL && CL.data && CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function')
            ? CL.data.supabaseBridge.resolveTier()
            : { tier: 'state', value: null };
        const yearActive = (spec.year_start != null || spec.year_end != null);
        if (!yearActive) {
            // No date filter — use the original RPC path (which is cached).
            try {
                if (typeof client.getSafetyCategories === 'function') {
                    return await client.getSafetyCategories(t.tier, t.value, {});
                }
            } catch (e) { /* fall through */ }
            return null;
        }
        // Date filter active — query the yearly companion directly.
        const params = new URLSearchParams({
            state: 'eq.' + stateKey,
            select: '*',
            limit: '5000'
        });
        if (spec.year_start != null) params.append('crash_year', 'gte.' + spec.year_start);
        if (spec.year_end   != null) params.append('crash_year', 'lte.' + spec.year_end);
        if (t.tier === 'county' && t.value) {
            const canonical = String(t.value).endsWith(' County') ? t.value : t.value + ' County';
            params.set('jurisdiction_county', 'eq.' + canonical);
        } else if (t.tier === 'mpo' && t.value) {
            params.set('jurisdiction_mpo', 'eq.' + t.value);
        } else if (t.tier === 'planning_district' && t.value) {
            params.set('jurisdiction_pd', 'eq.' + t.value);
        } else if (t.tier === 'region' && t.value) {
            params.set('dot_district', 'eq.' + t.value);
        }
        const url = client.supabaseUrl + '/mv_safety_categories_yearly?' + params.toString();
        try {
            const resp = await fetch(url, {
                headers: { 'apikey': client.supabaseKey, 'Authorization': 'Bearer ' + client.supabaseKey }
            });
            if (!resp.ok) {
                console.warn('[Round 19 §8] mv_safety_categories_yearly HTTP ' + resp.status);
                return null;
            }
            const rows = await resp.json();
            if (!Array.isArray(rows)) return null;
            // Fold (category × all_years_in_window) → per-category aggregate
            // shape that matches getSafetyCategories return value.
            const byCategory = {};
            for (const r of rows) {
                const c = r.category;
                if (!c) continue;
                if (!byCategory[c]) {
                    byCategory[c] = { category: c, total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, crash_count: 0, k: 0, a: 0, b: 0, c: 0, o: 0, epdo: 0 };
                }
                const acc = byCategory[c];
                const total = Number(r.total ?? r.crash_count ?? 0);
                acc.total += total;
                acc.crash_count += total;
                acc.K += Number(r.K ?? r.k ?? 0);
                acc.A += Number(r.A ?? r.a ?? 0);
                acc.B += Number(r.B ?? r.b ?? 0);
                acc.C += Number(r.C ?? r.c ?? 0);
                acc.O += Number(r.O ?? r.o ?? 0);
                acc.k += Number(r.k ?? r.K ?? 0);
                acc.a += Number(r.a ?? r.A ?? 0);
                acc.b += Number(r.b ?? r.B ?? 0);
                acc.c += Number(r.c ?? r.C ?? 0);
                acc.o += Number(r.o ?? r.O ?? 0);
                acc.epdo += Number(r.epdo ?? 0);
            }
            return byCategory;
        } catch (e) {
            console.warn('[Round 19 §8] mv_safety_categories_yearly failed:', e && e.message);
            return null;
        }
    }

    FilterEngine.subscribe('safety-focus', async (spec, changedKeys) => {
        if (!changedKeys.some(k => ['year_start','year_end','date_start','date_end'].includes(k))) return;
        try {
            const cats = await _r19LoadSafetyCategoriesWithFilter(spec);
            if (!cats) return;
            // Re-paint Safety Focus cards using the existing renderer.
            // Map matview shape → safetyState.data shape, mirroring
            // _loadSafetyFromMatview() in app/index.html.
            if (typeof safetyState === 'undefined' || !safetyState || !safetyState.data) return;
            Object.keys(safetyState.data).forEach(cat => {
                safetyState.data[cat] = {
                    crashes: [], byRoute: {},
                    severity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
                    bySubcategory: {},
                    total: 0
                };
            });
            const SAFETY_CARD_MAP = {
                'curves':'curves','school':'school','guardrail':'guardrail',
                'roaddeparture':'roaddeparture','pedestrian':'pedestrian','bicycle':'bicycle',
                'speed':'speed','impaired':'impaired','alcohol':'alcoholonly','drug':'drug',
                'intersection':'intersection','nighttime':'nighttime','distracted':'distracted',
                'motorcycle':'motorcycle','weather':'weather','animal':'animal','unrestrained':'unrestrained'
            };
            Object.keys(cats).forEach(matviewCat => {
                const uiKey = SAFETY_CARD_MAP[matviewCat] || matviewCat;
                if (safetyState.data[uiKey]) {
                    const m = cats[matviewCat] || {};
                    safetyState.data[uiKey].total = m.total || m.crash_count || 0;
                    safetyState.data[uiKey].severity = {
                        K: m.K || m.k || 0, A: m.A || m.a || 0,
                        B: m.B || m.b || 0, C: m.C || m.c || 0, O: m.O || m.o || 0
                    };
                }
            });
            if (typeof updateSafetyCards === 'function') updateSafetyCards();
            else if (typeof showTab === 'function') showTab('safety');
            console.log('[Round 19 §8] Safety Focus re-rendered for', spec.year_start, '→', spec.year_end);
        } catch (e) {
            console.warn('[Round 19 §8] safety-focus subscriber failed:', e && e.message);
        }
    });

    // ---------------------------------------------------------------
    // §2 — Filter input event handlers (push DOM changes → FilterEngine)
    // Idempotent: each input is bound at most once via dataset flag.
    // ---------------------------------------------------------------
    function _bindOnce(el, ev, handler) {
        if (!el) return;
        const key = 'r18Bound_' + ev;
        if (el.dataset[key]) return;
        el.addEventListener(ev, handler);
        el.dataset[key] = '1';
    }

    function _bindFilterInputs() {
        // Dashboard date inputs
        _bindOnce(document.getElementById('filterStartDate'), 'change', (e) => {
            const v = e.target.value || null;
            FilterEngine.setFilter({ date_start: v, year_start: _yearFromIsoDate(v) });
        });
        _bindOnce(document.getElementById('filterEndDate'), 'change', (e) => {
            const v = e.target.value || null;
            FilterEngine.setFilter({ date_end: v, year_end: _yearFromIsoDate(v) });
        });
        // Severity checkboxes
        ['K','A','B','C','O'].forEach(sev => {
            _bindOnce(document.getElementById('sev' + sev), 'change', () => {
                const active = new Set();
                ['K','A','B','C','O'].forEach(s => {
                    const cb = document.getElementById('sev' + s);
                    if (cb && cb.checked) active.add(s);
                });
                FilterEngine.setFilter({ severity: active });
            });
        });

        // Hot Spots — date + min crashes + group by, Apply button is the
        // existing analyzeHotspots() — wrap it so it also pushes to engine.
        _bindOnce(document.getElementById('hsStartDate'), 'change', (e) => {
            FilterEngine.setFilter({ year_start: _yearFromIsoDate(e.target.value) });
        });
        _bindOnce(document.getElementById('hsEndDate'), 'change', (e) => {
            FilterEngine.setFilter({ year_end: _yearFromIsoDate(e.target.value) });
        });
        _bindOnce(document.getElementById('hsMinCrashes'), 'change', (e) => {
            const n = parseInt(e.target.value, 10);
            FilterEngine.setFilter({ min_crashes: Number.isFinite(n) ? n : null });
        });
        _bindOnce(document.getElementById('hsGroupBy'), 'change', (e) => {
            FilterEngine.setFilter({ group_by: e.target.value || 'route' });
        });

        // Intersections
        _bindOnce(document.getElementById('intFilterStartDate'), 'change', (e) => {
            FilterEngine.setFilter({ year_start: _yearFromIsoDate(e.target.value) });
        });
        _bindOnce(document.getElementById('intFilterEndDate'), 'change', (e) => {
            FilterEngine.setFilter({ year_end: _yearFromIsoDate(e.target.value) });
        });
        _bindOnce(document.getElementById('intFilterTrafficCtrl'), 'change', (e) => {
            FilterEngine.setFilter({ traffic_control: e.target.value || null });
        });

        // Fatal & Speeding 1Y/3Y/5Y quick buttons — match by data-fs-period
        document.querySelectorAll('button[data-fs-period]').forEach(btn => {
            _bindOnce(btn, 'click', () => {
                const years = parseInt(btn.dataset.fsPeriod, 10);
                if (!Number.isFinite(years)) return;
                const endYear = new Date().getFullYear();
                FilterEngine.setFilter({ year_start: endYear - years + 1, year_end: endYear });
            });
        });

        // Ped/Bike injury-type dropdown
        _bindOnce(document.getElementById('pedBikeInjuryType'), 'change', (e) => {
            const v = e.target.value;
            FilterEngine.setFilter({ people_injury_type: (!v || v === 'all') ? null : v });
        });
    }

    // Round 19 §4 — replay the persisted FilterEngine spec onto the DOM
    // inputs so a reload visually matches what's still in effect. Runs
    // after _bindFilterInputs so the change handlers don't fire and
    // re-write a fresh spec back over the restored one.
    function _restoreFilterInputs() {
        try {
            if (!window.FilterEngine) return;
            const spec = window.FilterEngine.getSpec();
            const startEl = document.getElementById('filterStartDate');
            const endEl = document.getElementById('filterEndDate');
            if (startEl && spec.date_start) startEl.value = spec.date_start;
            if (endEl && spec.date_end) endEl.value = spec.date_end;
            if (spec.severity instanceof Set) {
                ['K','A','B','C','O'].forEach(s => {
                    const el = document.getElementById('sev' + s);
                    if (el) el.checked = spec.severity.has(s);
                });
            }
            const hsStart = document.getElementById('hsStartDate');
            const hsEnd = document.getElementById('hsEndDate');
            if (hsStart && spec.date_start) hsStart.value = spec.date_start;
            if (hsEnd && spec.date_end) hsEnd.value = spec.date_end;
            const tcEl = document.getElementById('intFilterTrafficCtrl');
            if (tcEl && spec.traffic_control) tcEl.value = spec.traffic_control;
        } catch (e) { /* ignore */ }
    }

    // Bind on DOMContentLoaded + re-bind on tab change (new inputs may
    // appear after lazy module loads).
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { _bindFilterInputs(); _restoreFilterInputs(); });
    } else {
        _bindFilterInputs();
        _restoreFilterInputs();
    }
    document.addEventListener('crashDataLoaded', () => { _bindFilterInputs(); _restoreFilterInputs(); });

    // First-run housekeeping: apply state-aware defaults once the client
    // is ready (covers the boot path where state is set by URL/localStorage).
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyStateAwareCheckboxDefaults);
    } else {
        applyStateAwareCheckboxDefaults();
    }

    // --- 44-v2 forward-compat mirrors (5 prompt-44 anchors only) ---
    // Inserted INSIDE the inner IIFE, just before its close log, where
    // these names are in scope. _r18ReloadIntersections / _bindOnce /
    // the 7 helpers stay closure-private (no mirror).
    window._r18ApplyDashboardYearFilter        = _r18ApplyDashboardYearFilter;
    window._r18ReloadHotspots                  = _r18ReloadHotspots;
    window._r19LoadSafetyCategoriesWithFilter  = _r19LoadSafetyCategoriesWithFilter;
    window._bindFilterInputs                   = _bindFilterInputs;
    window._restoreFilterInputs                = _restoreFilterInputs;
    if (window.CL && CL.data) {
        CL.data._r18ApplyDashboardYearFilter       = _r18ApplyDashboardYearFilter;
        CL.data._r18ReloadHotspots                 = _r18ReloadHotspots;
        CL.data._r19LoadSafetyCategoriesWithFilter = _r19LoadSafetyCategoriesWithFilter;
        CL.data._bindFilterInputs                  = _bindFilterInputs;
        CL.data._restoreFilterInputs               = _restoreFilterInputs;
    }

    console.log('[Round 18] Filter-audit wiring loaded.');
})();
    /* ===== END verbatim original IIFE ===== */

    if (window.CL && CL._registerModule) {
        CL._registerModule('data/dashboard-filter-bindings');
    }
})();
