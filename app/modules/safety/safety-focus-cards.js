/**
 * Safety Focus — Cards & Category Selection
 * Extracted from app/index.html (CC 201 Pass B). Verbatim block.
 *
 * Fns: applySafetyFocusCapabilityGates, initSafetyFocus, applySafetyFilters,
 *      clearSafetyDateFilter, processSafetyDataForReport, selectSafetyCategory,
 *      _safetyFocusHasCofactors, updateSafetyLocationTable,
 *      renderSafetyLocationRows, goToSafetyPage
 *
 * Reads inline globals: safetyState, sfDetailState (mirrored to window.*).
 */
(function () {
    'use strict';


async function applySafetyFocusCapabilityGates() {
    const caps = await getActiveStateCapabilities();
    if (!caps) return;
    for (const [category, capKey] of Object.entries(_SAFETY_CARD_CAPABILITY_MAP)) {
        if (caps[capKey] !== false) continue;
        const card = document.querySelector('.safety-card.' + category);
        if (!card) continue;
        const valueEl = card.querySelector('.safety-card-value');
        const pctEl = card.querySelector('.safety-card-pct');
        if (valueEl) valueEl.textContent = '—';
        if (pctEl) pctEl.textContent = '';
        if (!card.querySelector('.blocked-upstream')) {
            const badge = _buildBlockedBadgeEl();
            badge.style.marginTop = '.25rem';
            card.appendChild(badge);
        }
        card.classList.add('safety-card-blocked');
        card.style.opacity = '0.65';
        card.style.cursor = 'not-allowed';
    }
}

function initSafetyFocus() {
    // mv_safety_categories is populated at every tier (federal/state/region/
    // MPO/PD/county/city). Try the matview path whenever sampleRows are absent
    // — the legacy processSafetyData() path is reserved for the county/city
    // case where R2 sampleRows actually loaded. Doesn't require crashState.loaded
    // (false at aggregate tiers because R2 is skipped — see PR #64).
    const _hasSampleRows = !!(crashState.sampleRows && crashState.sampleRows.length > 0);
    const _matviewReady = !!(typeof CL !== 'undefined' && CL.data && CL.data.client && typeof CL.data.client.getSafetyCategories === 'function');
    if (_matviewReady && !_hasSampleRows) {
        _loadSafetyFromMatview().then(async function (ok) {
            if (!ok) {
                const _container = document.getElementById('tab-safety');
                if (_container) {
                    _container.innerHTML = '<div style="padding:2rem;text-align:center;color:#475569">' +
                        '<div style="font-size:2rem;margin-bottom:.5rem">📊</div>' +
                        '<div style="font-weight:600;margin-bottom:.25rem">No safety category data available</div>' +
                        '<div style="font-size:.85rem;color:#94a3b8">The mv_safety_categories matview returned no rows for this jurisdiction.</div>' +
                        '</div>';
                }
                return;
            }
            // CC 213 SF3: pull per-category co-factor crosstab so the
            // sub-KPI panel (speed/senior/young/nighttime/impaired/
            // distracted) doesn't render zeros at aggregate tiers. Awaited
            // before updateSafetyCards so the first paint already shows
            // real counts.
            try { await _hydrateSafetyCoFactors(); } catch (_) { /* non-fatal */ }
            updateSafetyCards();
            try { selectSafetyCategory('curves'); } catch (e) { /* non-fatal */ }
            safetyState.loaded = true;
        }).catch(function (e) {
            console.warn('[Safety Focus] Matview path failed:', e && e.message);
        });
        return;
    }

    if (!crashState.loaded || !crashState.sampleRows || crashState.sampleRows.length === 0) {
        console.log('[Safety Focus] Waiting for data...');
        return;
    }

    // Prevent double initialization
    if (safetyState.loaded) {
        console.log('[Safety Focus] Already initialized, skipping');
        return;
    }

    // Ensure the container is visible and empty state is hidden
    const safetyContainer = document.querySelector('.safety-focus-container');
    const safetyEmptyState = document.getElementById('safetyEmptyState');
    if (safetyContainer) safetyContainer.style.display = '';
    if (safetyEmptyState) safetyEmptyState.style.display = 'none';

    console.log('[Safety Focus] Initializing with', crashState.sampleRows.length, 'records');

    // Debug: Log sample row structure to verify column access
    if (crashState.sampleRows.length > 0) {
        const sample = crashState.sampleRows[0];
        console.log('[Safety Focus] Sample row keys:', Object.keys(sample).slice(0, 20));
        console.log('[Safety Focus] Sample date value:', sample[COL.DATE], 'type:', typeof sample[COL.DATE]);
    }

    // Enrich missing fields from available Colorado data columns
    enrichMissingCrashFields(crashState.sampleRows);

    try {
        // Process data for each category
        processSafetyData();

        // Update UI
        updateSafetyCards();

        // Select Curve Crashes by default to show details
        selectSafetyCategory('curves');

        safetyState.loaded = true;
        console.log('[Safety Focus] Initialization complete');
    } catch (err) {
        console.error('[Safety Focus] Initialization error:', err);
        safetyState.loaded = false;
    }
}

function applySafetyFilters() {
    // Get severity filters
    safetyState.filters.severity = [];
    if (document.getElementById('safetyFilterK')?.checked) safetyState.filters.severity.push('K');
    if (document.getElementById('safetyFilterA')?.checked) safetyState.filters.severity.push('A');
    if (document.getElementById('safetyFilterB')?.checked) safetyState.filters.severity.push('B');
    if (document.getElementById('safetyFilterC')?.checked) safetyState.filters.severity.push('C');
    if (document.getElementById('safetyFilterO')?.checked) safetyState.filters.severity.push('O');

    // Get date filters
    const startDateVal = document.getElementById('safetyStartDate')?.value;
    const endDateVal = document.getElementById('safetyEndDate')?.value;
    safetyState.filters.dateStart = startDateVal ? new Date(startDateVal).getTime() : null;
    safetyState.filters.dateEnd = endDateVal ? new Date(endDateVal + 'T23:59:59').getTime() : null;

    console.log('[Safety Filter] Start date value:', startDateVal);
    console.log('[Safety Filter] End date value:', endDateVal);
    console.log('[Safety Filter] Severity filters:', safetyState.filters.severity);
    console.log('[Safety Filter] Total crashes available:', crashState.sampleRows?.length);

    // Reprocess and update
    processSafetyData();
    updateSafetyCards();

    if (safetyState.activeCategory) {
        selectSafetyCategory(safetyState.activeCategory);
    }
}

function clearSafetyDateFilter() {
    document.getElementById('safetyStartDate').value = '';
    document.getElementById('safetyEndDate').value = '';
    safetyState.filters.dateStart = null;
    safetyState.filters.dateEnd = null;
    applySafetyFilters();
}

function processSafetyDataForReport(crashes) {
    const result = {};

    // Initialize all category data structures
    Object.keys(safetyCategories).forEach(catKey => {
        result[catKey] = {
            crashes: [],
            byRoute: {},
            severity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
            bySubcategory: {}
        };
    });

    // Process each crash row
    crashes.forEach(row => {
        const sev = extractSeverity(row);

        // Check each category
        Object.keys(safetyCategories).forEach(catKey => {
            const catConfig = safetyCategories[catKey];

            if (catConfig.filter(row)) {
                const catData = result[catKey];
                catData.crashes.push(row);
                catData.severity[sev]++;

                // Group by route
                const route = row[COL.ROUTE] || 'Unknown';
                if (!catData.byRoute[route]) {
                    catData.byRoute[route] = { crashes: [], severity: { K: 0, A: 0, B: 0, C: 0, O: 0 } };
                }
                catData.byRoute[route].crashes.push(row);
                catData.byRoute[route].severity[sev]++;

                // Group by subcategory
                const subcat = row[catConfig.subcategoryField] || 'Unknown';
                if (!catData.bySubcategory[subcat]) {
                    catData.bySubcategory[subcat] = 0;
                }
                catData.bySubcategory[subcat]++;
            }
        });
    });

    return result;
}

function selectSafetyCategory(category) {
    // Handle cross analysis separately
    if (category === 'cross') {
        document.querySelectorAll('.safety-card').forEach(c => c.classList.remove('active'));
        document.querySelector('.safety-card.cross')?.classList.add('active');
        document.getElementById('safetyDetailPanel').style.display = 'none';
        document.getElementById('safetyCrossPanel').style.display = 'block';
        document.getElementById('safetyCustomMatrixPanel').style.display = 'none';
        safetyState.activeCategory = 'cross';
        return;
    }

    // Handle custom matrix builder separately
    if (category === 'custommatrix') {
        document.querySelectorAll('.safety-card').forEach(c => c.classList.remove('active'));
        document.querySelector('.safety-card.custommatrix')?.classList.add('active');
        document.getElementById('safetyDetailPanel').style.display = 'none';
        document.getElementById('safetyCrossPanel').style.display = 'none';
        document.getElementById('safetyCustomMatrixPanel').style.display = 'block';
        safetyState.activeCategory = 'custommatrix';
        populateCustomMatrixDropdowns();
        return;
    }

    // Hide cross panel and custom matrix panel, show detail panel
    document.getElementById('safetyCrossPanel').style.display = 'none';
    document.getElementById('safetyCustomMatrixPanel').style.display = 'none';
    
    safetyState.activeCategory = category;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    // Update active card
    document.querySelectorAll('.safety-card').forEach(c => c.classList.remove('active'));
    document.querySelector(`.safety-card.${category}`)?.classList.add('active');
    
    // Show detail panel - clear any inline style that might override the class
    const panel = document.getElementById('safetyDetailPanel');
    panel.style.display = 'block';
    panel.classList.add('visible');
    
    // Update header
    document.getElementById('safetyDetailIcon').textContent = catConfig.icon;
    document.getElementById('safetyDetailName').textContent = catConfig.name;
    
    // Calculate EPDO
    const epdo = calculateEPDO(catData.severity);
    document.getElementById('safetyDetailEPDO').textContent = `EPDO: ${epdo.toLocaleString()}`;
    
    // Update severity bar
    // Matview mode (aggregate tiers) leaves crashes[] empty; fall back to
    // the matview-supplied total so the Total stat reflects real data.
    const total = (catData.crashes && catData.crashes.length)
                || catData.total
                || 0;
    const { K, A, B, C, O } = catData.severity;
    
    document.getElementById('safetyBarK').style.flex = K;
    document.getElementById('safetyBarK').textContent = K > 0 ? `K:${K}` : '';
    document.getElementById('safetyBarA').style.flex = A;
    document.getElementById('safetyBarA').textContent = A > 0 ? `A:${A}` : '';
    document.getElementById('safetyBarB').style.flex = B;
    document.getElementById('safetyBarB').textContent = B > 0 ? `B:${B}` : '';
    document.getElementById('safetyBarC').style.flex = C;
    document.getElementById('safetyBarC').textContent = C > 0 ? `C:${C}` : '';
    document.getElementById('safetyBarO').style.flex = O;
    document.getElementById('safetyBarO').textContent = O > 0 ? `O:${O}` : '';
    
    // Update stats
    document.getElementById('safetyStatTotal').textContent = total.toLocaleString();
    document.getElementById('safetyStatKA').textContent = (K + A).toLocaleString();
    document.getElementById('safetyStatEPDO').textContent = epdo.toLocaleString();
    document.getElementById('safetyStatLocations').textContent = Object.keys(catData.byRoute).length.toLocaleString();
    
    // Update breakdown chart
    document.getElementById('safetyBreakdownTitle').textContent = catConfig.subcategoryField + ' Breakdown';
    updateSafetyBreakdownChart(catData.bySubcategory);

    // Update collision chart
    updateSafetyCollisionChart(catData.crashes);

    // Update new charts
    updateSafetyRoadwayChart(catData.crashes);
    updateSafetyHarmfulEventChart(catData.crashes);
    updateSafetyYearChart(catData.crashes);
    updateSafetyFactorBadges(catData.crashes);

    // Update location table.
    // Round 12: when running in matview mode (no sampleRows), hydrate the
    // table from mv_safety_focus_locations so the "Top Locations" table
    // is no longer empty at aggregate tiers.
    if (safetyState.matviewMode && (!catData.byRoute || Object.keys(catData.byRoute).length === 0)) {
        _hydrateSafetyLocationsFromMatview(category).then((byRoute) => {
            if (byRoute && Object.keys(byRoute).length > 0) {
                catData.byRoute = byRoute;
                updateSafetyLocationTable(byRoute, category);
                // Re-render the Locations stat so the panel KPI matches.
                const locEl = document.getElementById('safetyStatLocations');
                if (locEl) locEl.textContent = Object.keys(byRoute).length.toLocaleString();
            } else {
                updateSafetyLocationTable({}, category);
            }
        }).catch((e) => {
            console.warn('[Safety Focus] mv_safety_focus_locations hydrate failed:', e && e.message);
            updateSafetyLocationTable(catData.byRoute || {}, category);
        });
    } else {
        updateSafetyLocationTable(catData.byRoute, category);
    }

    // Render typical countermeasures for this category
    renderSafetyCountermeasures(category);

    // Show/hide crossing evaluation button for pedestrian category
    const crossingBtn = document.getElementById('crossingEvalBtn');
    if (crossingBtn) {
        crossingBtn.style.display = category === 'pedestrian' ? 'inline-block' : 'none';
    }

    // CC 213 SF4: in matview mode the Yearly Trend chart was rendered
    // above from catData.crashes (empty) and is blank. Hydrate from
    // mv_safety_categories_yearly and update the chart in place. Also
    // populates safetyState.data[cat].byYear for downstream consumers
    // (detail panel + verification harness).
    if (safetyState.matviewMode) {
        _hydrateSafetyCategoryYearly(category);
    }
}

async function _safetyFocusHasCofactors() {
    if (typeof _safetyFocusHasCofactors._cache !== 'undefined') return _safetyFocusHasCofactors._cache;
    try {
        const dc = window.crashLensClient;
        if (!dc) return (_safetyFocusHasCofactors._cache = false);
        // HEAD request avoids logging a red 404 ERROR in console when the matview
        // is intentionally absent (the fallback note renders gracefully below).
        const resp = await fetch(`${dc.supabaseUrl}/mv_safety_co_factors?limit=1`, {
            method: 'HEAD',
            headers: { apikey: dc.supabaseKey, Authorization: 'Bearer ' + dc.supabaseKey }
        });
        return (_safetyFocusHasCofactors._cache = resp.status === 200);
    } catch (_) {
        return (_safetyFocusHasCofactors._cache = false);
    }
}

// CC 213 SF3 — Merge mv_safety_co_factors crosstab counts onto
// safetyState.data[cat] so the detail-panel sub-KPI cards
// (speed/senior/young/nighttime/impaired/distracted) render real
// numbers at aggregate tiers. Categories the matview doesn't ship are
// silently left without crosstab fields (the renderer's `?? 0`
// already handles that).
async function _hydrateSafetyCoFactors() {
    const dc = (typeof CL !== 'undefined' && CL.data && CL.data.client) || window.crashLensClient;
    if (!dc || typeof dc.getSafetyCoFactors !== 'function') return;
    if (!CL.data || !CL.data.supabaseBridge || typeof CL.data.supabaseBridge.resolveTier !== 'function') return;
    const t = CL.data.supabaseBridge.resolveTier();
    if (!t || !t.tier) return;
    const stateKey = (typeof _resolveActiveState === 'function') ? _resolveActiveState() : dc.state;
    if (stateKey && dc.state !== stateKey) dc.state = stateKey;
    let coFactors = {};
    try {
        coFactors = await CL.data.cachedMatview(
            'mv_safety_co_factors', t.tier, t.value,
            () => dc.getSafetyCoFactors(t.tier, t.value, {})
        );
    } catch (e) {
        console.warn('[Safety Focus] getSafetyCoFactors failed:', e && e.message);
        return;
    }
    if (!coFactors || typeof coFactors !== 'object') return;
    // Matview category key → UI safety-card key.  Mirrors SAFETY_CARD_MAP
    // in _loadSafetyFromMatview() — `alcohol` lights up the alcoholonly
    // card; every other key matches by default.
    const COF_TO_UI = { alcohol: 'alcoholonly' };
    let merged = 0;
    Object.keys(coFactors).forEach(matKey => {
        const uiKey = COF_TO_UI[matKey] || matKey;
        if (!safetyState.data[uiKey]) return;
        const c = coFactors[matKey] || {};
        safetyState.data[uiKey].speed_count      = c.speed_count      || 0;
        safetyState.data[uiKey].senior_count     = c.senior_count     || 0;
        safetyState.data[uiKey].young_count      = c.young_count      || 0;
        safetyState.data[uiKey].nighttime_count  = c.nighttime_count  || 0;
        safetyState.data[uiKey].impaired_count   = c.impaired_count   || 0;
        safetyState.data[uiKey].distracted_count = c.distracted_count || 0;
        merged++;
    });
    console.log('[Safety Focus] Co-factor crosstab merged for ' + merged + ' categories');
}

// CC 213 SF4 — Per-category Yearly Trend hydration from
// mv_safety_categories_yearly. Populates safetyState.data[cat].byYear
// and re-renders the year chart in place via the cached chart instance
// (avoids a chart rebuild when the matview returns).
async function _hydrateSafetyCategoryYearly(category) {
    if (!category) return;
    const dc = (typeof CL !== 'undefined' && CL.data && CL.data.client) || window.crashLensClient;
    if (!dc || typeof dc.getSafetyCategoryYearly !== 'function') return;
    if (!CL.data || !CL.data.supabaseBridge || typeof CL.data.supabaseBridge.resolveTier !== 'function') return;
    const t = CL.data.supabaseBridge.resolveTier();
    if (!t || !t.tier) return;
    // Matview UI category mapping (alcoholonly → alcohol).
    const UI_TO_MAT = { alcoholonly: 'alcohol' };
    const matCat = UI_TO_MAT[category] || category;
    let rows = [];
    try {
        rows = await CL.data.cachedMatview(
            'mv_safety_categories_yearly:' + matCat,
            t.tier, t.value,
            () => dc.getSafetyCategoryYearly(t.tier, t.value, matCat, {}),
            { category: matCat }
        );
    } catch (e) {
        console.warn('[Safety Focus] getSafetyCategoryYearly failed:', e && e.message);
        return;
    }
    if (!Array.isArray(rows) || rows.length === 0) return;
    const byYear = {};
    rows.forEach(r => {
        const y = Number(r && r.crash_year);
        if (!Number.isFinite(y)) return;
        byYear[y] = Number(r.crash_count) || 0;
    });
    if (!safetyState.data[category]) return;
    safetyState.data[category].byYear = byYear;
    // Live-update the year chart if Chart.js still has the previous
    // (empty / crashes[]-derived) instance on screen.
    const chart = safetyState.charts && safetyState.charts.yearTrend;
    if (chart && chart.data && chart.data.datasets && chart.data.datasets[0]) {
        const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
        chart.data.labels = years;
        chart.data.datasets[0].data = years.map(y => byYear[y]);
        try { chart.update(); } catch (_) { /* non-fatal */ }
    }
    console.log('[Safety Focus] byYear hydrated for ' + category + ' (' + Object.keys(byYear).length + ' years)');
}

function updateSafetyLocationTable(byRoute, category) {
    const tbody = document.getElementById('safetyLocationBody');
    if (!tbody) return;
    const showCounty = isMultiCountyTier();

    // Clear selections when category changes
    safetyState.selectedLocations = new Set();
    sfDetailState.selectedLocations = [];
    sfDetailState.aggregatedData = null;
    sfDetailState.categoryBenchmarks = null;
    Object.values(sfDetailState.charts).forEach(c => { if (c && typeof c.destroy === 'function') c.destroy(); });
    sfDetailState.charts = {};
    const panel = document.getElementById('sfDetailPanel');
    if (panel) panel.classList.remove('visible');
    updateSafetySelectionUI();

    // Phase 3: Update thead for county column
    const thead = document.querySelector('#safetyLocationTable thead tr');
    if (thead) {
        const hasCountyCol = thead.querySelector('.tier-county-col');
        if (showCounty && !hasCountyCol) {
            const th = document.createElement('th');
            th.className = 'tier-county-col';
            th.textContent = 'County';
            // Insert after checkbox column and Route column
            const routeTh = thead.children[1]; // children[0] is checkbox, children[1] is Route
            if (routeTh && routeTh.nextSibling) thead.insertBefore(th, routeTh.nextSibling);
        } else if (!showCounty && hasCountyCol) {
            hasCountyCol.remove();
        }
    }

    // Convert to array and sort by crash count
    const routes = Object.entries(byRoute)
        .map(([route, data]) => {
            // Phase 3: Resolve most common jurisdiction from crashes
            let county = '';
            if (showCounty && data.crashes?.length) {
                const jurisCounts = {};
                data.crashes.forEach(r => {
                    const j = (r[COL.JURISDICTION] || '').trim();
                    if (j) jurisCounts[j] = (jurisCounts[j] || 0) + 1;
                });
                const top = Object.entries(jurisCounts).sort((a, b) => b[1] - a[1])[0];
                county = top ? top[0] : '';
            }
            return {
                route: route,
                count: data.crashes.length,
                ka: data.severity.K + data.severity.A,
                epdo: calculateEPDO(data.severity),
                crashes: data.crashes,
                category: category,
                county
            };
        })
        .sort((a, b) => b.epdo - a.epdo);

    document.getElementById('safetyTableCount').textContent = `(${routes.length} locations)`;

    if (routes.length === 0) {
        const colspan = showCounty ? 7 : 6;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center;color:var(--gray);padding:2rem">No data for selected filters</td></tr>`;
        document.getElementById('safetyPagination').innerHTML = '';
        return;
    }

    // Store all routes for pagination
    setPaginationData('safety', routes);

    // Render rows with checkboxes
    renderSafetyLocationRows();

    // Render pagination controls
    renderPaginationControls('safety', 'safetyPagination', 'goToSafetyPage');

    // Auto-select the #1 top location so users immediately see the detail panel UI
    if (routes.length > 0) {
        const topRoute = routes[0].route;
        sfDetailState.selectedLocations = [topRoute];
        syncSfCheckboxStates();
        updateSfSelectionCount();
        syncSafetySelectedLocations();
        updateSfDetailPanel();
    }
}

function renderSafetyLocationRows() {
    const tbody = document.getElementById('safetyLocationBody');
    if (!tbody) return;
    const showCounty = isMultiCountyTier();
    const pageData = getPaginatedData('safety');
    const state = paginationState.safety;
    const startIndex = (state.page - 1) * state.pageSize;

    tbody.innerHTML = pageData.map((r, pageIndex) => {
        const globalIndex = startIndex + pageIndex;
        const routeClean = r.route.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || r.route;
        const countyCell = showCounty ? `<td style="font-size:.75rem" class="tier-county-col">${esc(r.county || '')}</td>` : '';
        const isSelected = sfDetailState.selectedLocations.includes(r.route);
        const isDisabled = !isSelected && sfDetailState.selectedLocations.length >= sfDetailState.maxSelections;
        return `
            <tr>
                <td><input type="checkbox" class="sf-checkbox safety-loc-checkbox" value="${esc(r.route)}" data-route="${esc(r.route)}" data-category="${r.category}" onchange="toggleSfSelection(this)" ${isSelected ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}></td>
                <td><strong>${routeClean}</strong></td>
                ${countyCell}
                <td>${r.count}</td>
                <td style="color:${r.ka > 0 ? '#dc2626' : 'inherit'};font-weight:${r.ka > 0 ? '600' : '400'}">${r.ka}</td>
                <td><span class="safety-epdo-badge">${r.epdo}</span></td>
                <td>
                    <button class="safety-action-btn map" onclick="viewSafetyLocationOnMap('${esc(r.route)}', '${r.category}')">🗺️</button>
                    <button class="safety-action-btn cmf" onclick="getSafetyLocationCMF('${esc(r.route)}', '${r.category}')">CMF</button>
                    <button class="safety-action-btn details" onclick="showSafetyLocationDetails('${esc(r.route)}', '${r.category}')">Details</button>
                </td>
            </tr>
        `;
    }).join('');
}

function goToSafetyPage(tableKey, page) {
    goToPage(tableKey, page);
    renderSafetyLocationRows();
    renderPaginationControls('safety', 'safetyPagination', 'goToSafetyPage');
}

    // ===== CC 201 dual-API exposure =====
    window.CL = window.CL || {};
    CL.safety = CL.safety || {};
    CL.safety.cards = CL.safety.cards || {};
    Object.assign(CL.safety.cards, {
        applySafetyFocusCapabilityGates,
        initSafetyFocus,
        applySafetyFilters,
        clearSafetyDateFilter,
        processSafetyDataForReport,
        selectSafetyCategory,
        _safetyFocusHasCofactors,
        updateSafetyLocationTable,
        renderSafetyLocationRows,
        goToSafetyPage
    });
    Object.assign(window, CL.safety.cards);

    CL._registerModule('safety/cards');
})();
