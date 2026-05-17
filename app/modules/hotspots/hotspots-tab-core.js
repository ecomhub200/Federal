/** CL hotspots.tab (core) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/16-v2-hotspots-tab.md. No behavior change.
 *  Depends on (script order): analysis/hotspots (math). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L54721-L55155) ───
function analyzeHotspots() {
    // mv_hotspots is populated for every tier (federal/state/region/MPO/PD/county/city)
    // after PR #68 fixed the physical_juris_name → county column-alias bug. Route
    // aggregate tiers and the county-rollup case directly into the matview path.
    const _tabTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext.viewTier) || 'county';
    const _isAggregate = new Set(['federal','state','region','mpo','planning_district']).has(_tabTier);
    const _hasSampleRows = !!(crashState.sampleRows && crashState.sampleRows.length > 0);
    const _hasMatview = !!(typeof CL !== 'undefined' && CL.data && CL.data.client && typeof CL.data.client.getHotspots === 'function');
    if (_hasMatview && (_isAggregate || !_hasSampleRows)) {
        _loadHotspotsFromMatview();
        return;
    }

    if (!crashState.loaded) { alert('Load data first'); return; }
    showLoading('Analyzing hot spots...');

    setTimeout(() => {
        const minCrashes = parseInt(document.getElementById('hsMinCrashes').value) || 5;
        const topN = parseInt(document.getElementById('hsTopN').value) || 25;
        const sortBy = document.getElementById('hsSortBy').value;
        const groupBy = document.getElementById('hsGroupBy').value;

        // Get date filters
        const startDateStr = document.getElementById('hsStartDate').value;
        const endDateStr = document.getElementById('hsEndDate').value;
        const startDate = startDateStr ? new Date(startDateStr) : null;
        let endDate = endDateStr ? new Date(endDateStr) : null;
        // Normalize end date to include the entire day
        if (endDate) endDate.setHours(23, 59, 59, 999);

        // Store filter state for reports
        hotspotFilters.startDate = startDateStr || null;
        hotspotFilters.endDate = endDateStr || null;
        hotspotFilters.groupBy = groupBy;

        // Update filter summary display
        updateHotspotFilterSummary(startDateStr, endDateStr);

        // Filter and aggregate data based on date range
        const filteredAggregates = getFilteredHotspotAggregates(startDate, endDate, groupBy);
        const source = filteredAggregates.data;
        const numYears = filteredAggregates.years || 1;

        let hotspots = CL.analysis.hotspots.scoreAndRank(source, minCrashes, sortBy, numYears, calcEPDO);

        // Store ALL hotspots without slicing - pagination will handle display
        crashState.hotspots = hotspots;
        setPaginationData('hotspots', hotspots);
        renderHotspots();
        initSignalWarrantChecker(); // Update Signal Warrant Checker with new hotspots

        // Auto-update detail panel if locations are selected (respects new date filters)
        if (hotspotDetailState.selectedLocations.length > 0) {
            // Validate selected locations still exist in new results
            const validLocations = crashState.hotspots.map(h => h.loc);
            hotspotDetailState.selectedLocations = hotspotDetailState.selectedLocations.filter(loc => validLocations.includes(loc));
            if (hotspotDetailState.selectedLocations.length > 0) {
                updateHotspotDetailPanel();
            } else {
                document.getElementById('hotspotDetailPanel').classList.remove('visible');
            }
        }

        // Auto-select rank #1 if no selections and hotspots exist
        if (hotspotDetailState.selectedLocations.length === 0 && crashState.hotspots.length > 0) {
            autoSelectTopHotspot();
        }

        hideLoading();
    }, 50);
}

/**
 * Round 5 Fix 2 — populate crashState.hotspots from mv_hotspots so the Hot
 * Spots tab works at county-rollup tier where sampleRows is empty.
 * Renders directly via renderHotspots(). State-agnostic.
 */
async function _loadHotspotsFromMatview() {
    try {
        if (!window.crashLensClient || !CL.data || !CL.data.supabaseBridge) return false;
        const stateKey = (typeof _resolveActiveState === 'function') ? _resolveActiveState() : null;
        if (!stateKey) return false;
        const t = CL.data.supabaseBridge.resolveTier();
        window.crashLensClient.state = stateKey;

        const minCrashesEl = document.getElementById('hsMinCrashes');
        const topNEl = document.getElementById('hsTopN');
        const groupByEl = document.getElementById('hsGroupBy');
        const minCrashes = parseInt(minCrashesEl && minCrashesEl.value, 10) || 5;
        const topN = parseInt(topNEl && topNEl.value, 10) || 25;
        const groupBy = (groupByEl && groupByEl.value) || 'route';

        showLoading('Analyzing hot spots…');
        // Round 3 follow-up (2026-05-09): mv_hotspots_topcoll provides the
        // top collision_type per location. Fetch in parallel with hotspots so
        // the render shows real types instead of the muted '—' placeholder.
        // Falls through to 'N/A' if the matview is unavailable.
        // Round 7 (2026-05-09): also fetch mv_hotspots_factors in parallel so
        // each hotspot row carries impaired/speed/distracted/etc. counts. PDF
        // exports read these without a second roundtrip.
        // Round 15 §3 — fetch AADT-rate matview in parallel. Used to enrich
        // each row with crash_rate_mvmt + AADT for the new rate columns.
        const _ratesPromise = (typeof window.crashLensClient.getHotspotsWithRates === 'function')
            ? CL.data.cachedMatview('mv_hotspots_with_rates', t.tier, t.value,
                () => window.crashLensClient.getHotspotsWithRates({
                    county: t.tier === 'county' ? t.value : undefined,
                    limit: Math.max(200, topN * 4)
                }),
                { county: t.tier === 'county' ? t.value : null, limit: Math.max(200, topN * 4) })
            : Promise.resolve(null);
        const [data, topCollMap, factorsMap, ratesRows] = await Promise.all([
            CL.data.cachedMatview('mv_hotspots', t.tier, t.value,
                () => window.crashLensClient.getHotspots(t.tier, t.value, { limit: topN }),
                { limit: topN }),
            (typeof window.crashLensClient.getHotspotsTopCollision === 'function'
                ? CL.data.cachedMatview('mv_hotspots_topcoll', 'state', stateKey,
                    () => window.crashLensClient.getHotspotsTopCollision(stateKey))
                : Promise.resolve(null)),
            (typeof window.crashLensClient.getHotspotsFactors === 'function'
                ? CL.data.cachedMatview('mv_hotspots_factors', 'state', stateKey,
                    () => window.crashLensClient.getHotspotsFactors(stateKey))
                : Promise.resolve(null)),
            _ratesPromise
        ]);
        const ratesMap = new Map();
        if (Array.isArray(ratesRows)) {
            ratesRows.forEach(r => {
                const k = (r.location_type || '') + '|' + (r.location_name || '');
                ratesMap.set(k, r);
            });
        }
        if (!data || (!data.intersections.length && !data.segments.length)) {
            crashState.hotspots = [];
            setPaginationData('hotspots', []);
            renderHotspots();
            hideLoading();
            console.log('[Hot Spots] mv_hotspots returned no rows for ' + t.tier + '=' + t.value);
            return false;
        }

        // Pick intersections vs segments based on the Group By UI control.
        // 'node' / 'intersection' → intersections; everything else → segments.
        // Bug 11 fix — mv_hotspots currently emits 0 segment rows for every state
        // (Delaware data has no crashes with null node + non-null rte_name; this
        // is data shape, not a matview bug). When the user-selected bucket is
        // empty, auto-fallback to the non-empty one. Jurisdiction-agnostic.
        const useIntersections = (groupBy === 'node' || groupBy === 'intersection');
        let rows = useIntersections ? data.intersections : data.segments;
        if (!rows || rows.length === 0) {
            const fallback = useIntersections ? data.segments : data.intersections;
            if (fallback && fallback.length > 0) {
                console.log('[Hot Spots] Group By="' + groupBy + '" returned 0 rows; auto-falling back to ' +
                    (useIntersections ? 'segments' : 'intersections') + ' (' + fallback.length + ' rows)');
                rows = fallback;
            } else {
                rows = [];
            }
        }

        // Map matview row → renderHotspots() shape. perYear computed from
        // first_year/last_year. topType isn't in the matview — leave 'N/A'.
        const filtered = rows
            .filter(r => {
                if ((r.total_crashes || 0) < minCrashes) return false;
                // Bug 13a fix — defensive: drop placeholder "0" rows the
                // data-client filter may have missed.
                const ln = String(r.location_name || '').trim();
                if ((!ln || ln === '0' || ln === '0.0')
                    && !(r.rte_name && String(r.rte_name).trim())) {
                    return false;
                }
                return true;
            })
            .map(r => {
                const total = r.total_crashes || 0;
                const span = Math.max(1, ((r.last_year || 0) - (r.first_year || 0)) + 1);
                const epdo = r.epdo || 0;
                const K = r.k || 0, A = r.a || 0, B = r.b || 0, C = r.c || 0, O = r.o || 0;
                // Bug 14a v2 — assets/js/data-client.js _pgToFrontend converts
                // these specific columns to Title-Case-with-space keys via the
                // COL_MAP reverse lookup. Read bracket-form first, fall back to
                // snake_case for safety. Then prefer human-readable street
                // names over location_name (which frequently holds a numeric
                // node ID like "12345" or a "0" placeholder). For intersection
                // rows, combine rte_name with the cross-street name when both
                // are present. For segment rows, rte_name is the most readable.
                const _intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
                const _rteName = String(r['RTE Name'] || r.rte_name || '').trim();
                const _nodeId  = String(r.location_name || '').trim();
                const _isNumericNode = /^\d+(\.\d+)?$/.test(_nodeId);
                const _isPlaceholder = !_nodeId || _nodeId === '0' || _nodeId === '0.0' || _isNumericNode;
                let locName;
                if (r.location_type === 'intersection') {
                    if (_rteName && _intName)      locName = _rteName + ' / ' + _intName;
                    else if (_intName)             locName = _intName;
                    else if (_rteName)             locName = _rteName;
                    else                            locName = _isPlaceholder ? '' : _nodeId;
                } else {
                    locName = _rteName || (_isPlaceholder ? '' : _nodeId) || _intName || '';
                }
                if (!locName) locName = _nodeId; // last-resort, preserves filter behavior
                // Round 3 follow-up (2026-05-09): look up top_collision_type
                // by (location_type, location_name) — the mv_hotspots_topcoll
                // matview key. Use _nodeId here since the matview was built
                // against the raw location_name (numeric or street-style),
                // not our human-friendly locName composite.
                let _topType = 'N/A';
                if (topCollMap && _nodeId) {
                    const k1 = (r.location_type || '') + '|' + _nodeId;
                    if (topCollMap.has(k1)) _topType = topCollMap.get(k1);
                }
                // Round 7 (2026-05-09): per-location factor counts from
                // mv_hotspots_factors so PDF exports + detail panels can
                // render real Contributing Factors / VRU bands.
                let _factors = null;
                if (factorsMap && _nodeId) {
                    const fk = (r.location_type || '') + '|' + _nodeId;
                    if (factorsMap.has(fk)) _factors = factorsMap.get(fk);
                }
                // Round 15 §3 — AADT-rate enrichment (mv_hotspots_with_rates).
                // Locations without AADT seed pass through with null rate fields.
                let _aadt = null, _aadtYear = null, _crashRate = null, _epdoRate = null;
                if (ratesMap && _nodeId) {
                    const rk = (r.location_type || '') + '|' + _nodeId;
                    const rr = ratesMap.get(rk);
                    if (rr) {
                        _aadt      = (rr.aadt != null) ? rr.aadt : null;
                        _aadtYear  = rr.aadt_year != null ? rr.aadt_year : null;
                        _crashRate = rr.crash_rate_mvmt != null ? rr.crash_rate_mvmt : null;
                        _epdoRate  = rr.epdo_rate_mvmt != null ? rr.epdo_rate_mvmt : null;
                    }
                }
                return {
                    loc: locName,
                    nodeId: _nodeId,
                    total: total,
                    K: K, A: A, B: B, C: C, O: O,
                    epdo: epdo,
                    ka: K + A,
                    perYear: (total / span).toFixed(1),
                    topType: _topType,
                    route: _rteName,
                    county: r.county || '',
                    lat: r.lat_centroid,
                    lon: r.lon_centroid,
                    aadt: _aadt,
                    aadtYear: _aadtYear,
                    crashRateMvmt: _crashRate,
                    epdoRateMvmt: _epdoRate,
                    impaired_count: _factors ? _factors.impaired : 0,
                    speed_count: _factors ? _factors.speed : 0,
                    distracted_count: _factors ? _factors.distracted : 0,
                    unrestrained_count: _factors ? _factors.unrestrained : 0,
                    motorcycle_count: _factors ? _factors.motorcycle : 0,
                    night_count: _factors ? _factors.night : 0,
                    top_collision_type: _topType
                };
            })
            .sort((a, b) => (b.epdo || 0) - (a.epdo || 0));

        crashState.hotspots = filtered;
        setPaginationData('hotspots', filtered);
        renderHotspots();
        try { initSignalWarrantChecker(); } catch (e) { /* non-fatal */ }
        hideLoading();
        console.log('[Hot Spots] Loaded ' + filtered.length + ' locations from mv_hotspots');

        // CC Round 25 §1 — When mv_hotspots returns 0 rows at aggregate tier
        // (PD/region/MPO/state), try the richer mv_hotspots_with_rates matview
        // as a fallback. State-agnostic; keys on resolved tier columns.
        if (filtered.length === 0) {
            const _isAgg = t && ['planning_district','dot_district','region','mpo','state','federal'].includes(t.tier);
            if (_isAgg) {
                const rateRows = await _hotspots_fetchMatview();
                if (Array.isArray(rateRows) && rateRows.length > 0) {
                    _renderHotspotsTableFromMatview(rateRows);
                    console.log('[Hot Spots] Fallback painted ' + rateRows.length + ' rows from mv_hotspots_with_rates');
                }
            }
        }
        return true;
    } catch (e) {
        console.warn('[Hot Spots] Matview path failed:', e && e.message);
        hideLoading();
        return false;
    }
}

/**
 * CC Round 25 §1 — direct fetch of mv_hotspots_with_rates with tier filters
 * (planning_district / dot_district / mpo_name / physical_juris_name). Used
 * as a fallback when mv_hotspots returns 0 rows at aggregate tiers. The
 * matview ships state-agnostic columns; if a column is missing on the
 * backend, PostgREST returns 400 and we silently degrade.
 */
async function _hotspots_fetchMatview() {
    try {
        const dc = window.crashLensClient;
        if (!dc || !CL?.data?.supabaseBridge) return [];
        const t = CL.data.supabaseBridge.resolveTier?.();
        if (!t || !t.tier) return [];
        const params = new URLSearchParams({
            state: 'eq.' + String(dc.state || '').toLowerCase(),
            select: '*',
            order: 'epdo.desc.nullslast',
            limit: '500'
        });
        // Round 25 P2.1 — mv_hotspots_with_rates uses jurisdiction_pd /
        // jurisdiction_mpo / jurisdiction_county / jurisdiction_physical_juris
        // (NOT planning_district / mpo_name / physical_juris_name). It also
        // lacks any dot_district column — region tier intentionally falls
        // through to the state-wide rank.
        if (t.tier === 'planning_district') params.set('jurisdiction_pd',             'eq.' + t.value);
        else if (t.tier === 'mpo')          params.set('jurisdiction_mpo',            'eq.' + t.value);
        else if (t.tier === 'county') {
            // Round 25 P2.2 — jurisdiction_county stores canonical
            // 'Kent County' / 'Sussex County' / etc. Suffix if missing.
            const canonical = String(t.value).endsWith(' County') ? t.value : t.value + ' County';
            params.set('jurisdiction_county', 'eq.' + canonical);
        }
        else if (t.tier === 'city')         params.set('jurisdiction_physical_juris', 'eq.' + t.value);
        // dot_district / region tier: no filter — matview has no such column.
        const url = `${dc.supabaseUrl}/mv_hotspots_with_rates?${params.toString()}`;
        const resp = await fetch(url, {
            headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
        });
        if (!resp.ok) {
            console.warn('[Hot Spots] mv_hotspots_with_rates fallback HTTP', resp.status);
            return [];
        }
        const rows = await resp.json();
        return Array.isArray(rows) ? rows : [];
    } catch (e) {
        console.warn('[Hot Spots] _hotspots_fetchMatview failed:', e && e.message);
        return [];
    }
}

/**
 * CC Round 25 §1 — paint mv_hotspots_with_rates rows into the existing
 * Hot Spots table by mapping them to the crashState.hotspots[] shape that
 * renderHotspots() expects. Preserves AADT + crash_rate_mvmt columns the
 * standard table renderer already supports.
 */
function _renderHotspotsTableFromMatview(rows) {
    const mapped = (rows || []).map(r => {
        // Round 25 P2.1 — schema is total_crashes, k, a, b, c, o, epdo
        // (NOT total_epdo / fatal_crashes / serious_injury_crashes).
        const total = Number(r.total_crashes) || 0;
        const K = Number(r.k) || 0;
        const A = Number(r.a) || 0;
        const B = Number(r.b) || 0, C = Number(r.c) || 0, O = Number(r.o) || 0;
        const epdo = Number(r.epdo) || 0;
        const first = Number(r.first_year) || 0;
        const last  = Number(r.last_year)  || 0;
        const span  = Math.max(1, (last && first) ? (last - first + 1) : 1);
        const rteName = String(r['RTE Name'] || r.rte_name || '').trim();
        const intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
        const nodeId  = String(r.location_name || '').trim();
        let locName;
        if (r.location_type === 'intersection') {
            locName = (rteName && intName) ? (rteName + ' / ' + intName) : (intName || rteName || nodeId);
        } else {
            locName = rteName || nodeId || intName;
        }
        if (!locName) locName = nodeId || '(unnamed)';
        return {
            loc: locName,
            nodeId: nodeId,
            total: total,
            K: K, A: A, B: B, C: C, O: O,
            epdo: epdo,
            ka: K + A,
            perYear: (total / span).toFixed(1),
            topType: 'N/A',
            route: rteName,
            county: r.jurisdiction_county || r.physical_juris_name || r.county || '',
            lat: r.lat_centroid,
            lon: r.lon_centroid,
            aadt:         (r.aadt != null) ? Number(r.aadt) : null,
            aadtYear:     (r.aadt_year != null) ? r.aadt_year : null,
            crashRateMvmt:(r.crash_rate_mvmt != null) ? Number(r.crash_rate_mvmt) : null,
            epdoRateMvmt: (r.epdo_rate_mvmt != null) ? Number(r.epdo_rate_mvmt) : null,
            impaired_count: 0, speed_count: 0, distracted_count: 0,
            unrestrained_count: 0, motorcycle_count: 0, night_count: 0,
            top_collision_type: 'N/A'
        };
    }).filter(h => h.loc && h.loc !== '(unnamed)')
      .sort((a, b) => (b.epdo || 0) - (a.epdo || 0));
    crashState.hotspots = mapped;
    setPaginationData('hotspots', mapped);
    renderHotspots();
    try { initSignalWarrantChecker(); } catch (e) { /* non-fatal */ }
}

// Auto-select top ranked hotspot and show info banner
function autoSelectTopHotspot() {
    const topHotspot = crashState.hotspots[0];
    if (!topHotspot) return;

    // Select the top hotspot
    hotspotDetailState.selectedLocations = [topHotspot.loc];

    // Update checkbox in table
    const checkbox = document.querySelector(`#hotspotBody .hotspot-checkbox[data-location="${CSS.escape(topHotspot.loc)}"]`);
    if (checkbox) checkbox.checked = true;

    // Update selection count
    updateHotspotSelectionCount();

    // Show detail panel with info banner (skip scroll on auto-select)
    updateHotspotDetailPanel(true);

    // Show info banner if first time
    if (!hotspotDetailState.bannerShown) {
        showHotspotInfoBanner();
        hotspotDetailState.bannerShown = true;
    }
}

// Show info banner for hotspot detail panel
function showHotspotInfoBanner() {
    const body = document.getElementById('hotspotDetailBody');
    if (!body) return;

    const banner = document.createElement('div');
    banner.className = 'detail-info-banner';
    banner.innerHTML = `
        <span class="detail-info-icon">💡</span>
        <span class="detail-info-text">Showing top-ranked location. Select up to 5 for comparison.</span>
        <button class="detail-info-close" onclick="this.parentElement.remove()">✕</button>
    `;
    body.insertBefore(banner, body.firstChild);
}
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.hotspots=CL.hotspots||{};
  CL.hotspots.tab=CL.hotspots.tab||{};
  window.analyzeHotspots = analyzeHotspots; CL.hotspots.analyzeHotspots = analyzeHotspots; CL.hotspots.tab.analyzeHotspots = analyzeHotspots;
  window._loadHotspotsFromMatview = _loadHotspotsFromMatview; CL.hotspots._loadHotspotsFromMatview = _loadHotspotsFromMatview; CL.hotspots.tab._loadHotspotsFromMatview = _loadHotspotsFromMatview;
  window._hotspots_fetchMatview = _hotspots_fetchMatview; CL.hotspots._hotspots_fetchMatview = _hotspots_fetchMatview; CL.hotspots.tab._hotspots_fetchMatview = _hotspots_fetchMatview;
  window._renderHotspotsTableFromMatview = _renderHotspotsTableFromMatview; CL.hotspots._renderHotspotsTableFromMatview = _renderHotspotsTableFromMatview; CL.hotspots.tab._renderHotspotsTableFromMatview = _renderHotspotsTableFromMatview;
  window.autoSelectTopHotspot = autoSelectTopHotspot; CL.hotspots.autoSelectTopHotspot = autoSelectTopHotspot; CL.hotspots.tab.autoSelectTopHotspot = autoSelectTopHotspot;
  window.showHotspotInfoBanner = showHotspotInfoBanner; CL.hotspots.showHotspotInfoBanner = showHotspotInfoBanner; CL.hotspots.tab.showHotspotInfoBanner = showHotspotInfoBanner;
  CL._registerModule('hotspots/hotspots-tab-core');
})();
