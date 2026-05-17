/** CL dashboard.tab (drill) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/15-v2-dashboard-tab.md + MODULAR_PLAN_PROMPT_15-v2_VERIFY.md.
 *  Verbatim except: _tierComparisonCache qualified to window._tierComparisonCache
 *  (reassigned in 15b, invalidated from 15d — cross-IIFE shared mutable global).
 *  No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L43003-L43357) ───
/**
 * Round 15 §12.3 — Hydrate the Dashboard region/MPO/county comparison tables
 * from mv_dashboard_comparisons. Used at aggregate tiers (state/federal/region/
 * MPO) where sampleRows is empty in Supabase-only mode and the legacy
 * buildRegionComparison/etc. return [].
 *
 * State-agnostic — keys on (state, scope, jurisdiction_name) from the matview.
 */
async function hydrateComparisonsFromMatview(tier) {
    if (!window.crashLensClient || typeof window.crashLensClient.getDashboardComparisons !== 'function') {
        return;
    }
    const c = window.crashLensClient;
    // Only paint scopes that are visible at the active tier:
    //   state/federal: all three (region/MPO/county)
    //   region/MPO:    only county breakdown
    const scopes = (tier === 'region' || tier === 'mpo') ? ['county'] : ['planning_district', 'mpo', 'county'];
    const results = await Promise.all(scopes.map(scope =>
        c.getDashboardComparisons({ scope }).catch(e => {
            console.warn('[Comparisons] mv_dashboard_comparisons scope=' + scope + ' failed:', e && e.message);
            return null;
        })
    ));
    const map = Object.fromEntries(scopes.map((s, i) => [s, results[i]]));
    const _toItem = (r) => {
        const ka = (Number(r.fatals) || 0) + (Number(r.serious) || 0);
        // Fabricate a single-year byYear so existing helpers (sparkline, trend)
        // don't crash. They tolerate length-1 by returning ''.
        const fakeYear = String(r.last_year || r.crash_year || new Date().getFullYear());
        return {
            id: r.jurisdiction_name,
            name: r.jurisdiction_name,
            shortName: r.jurisdiction_name,
            stats: {
                total: Number(r.crash_count) || 0,
                K:     Number(r.fatals) || 0,
                A:     Number(r.serious) || 0,
                ka:    ka,
                epdo:  Number(r.epdo) || 0,
                ped:   Number(r.ped_count) || 0,
                bike:  Number(r.bike_count) || 0,
                byYear: { [fakeYear]: { total: Number(r.crash_count) || 0 } }
            }
        };
    };
    const counties = Array.isArray(map.county) ? map.county.map(_toItem) : [];
    const mpos     = Array.isArray(map.mpo)    ? map.mpo.map(_toItem)    : [];
    const pds      = Array.isArray(map.planning_district)
                        ? map.planning_district.map(_toItem) : [];

    // Stash for sort/expand handlers and re-render.
    if (counties.length) {
        _lastComparisonItems['countyComparisonBody'] = counties;
        const container = document.getElementById('countyComparisonContainer');
        if (container) container.style.display = '';
        const maxDisplay = (tier === 'state' || tier === 'federal') ? 20 : 0;
        renderComparisonRows('countyComparisonBody', counties, 'county', maxDisplay);
        renderComparisonFooter('countyComparisonFooter', counties);
        const summary = document.getElementById('countyComparisonSummary');
        if (summary) summary.textContent = counties.length + ' jurisdictions with crash data. Click a row to drill into that jurisdiction.';
    }
    if (mpos.length) {
        _lastComparisonItems['mpoComparisonBody'] = mpos;
        const container = document.getElementById('mpoComparisonContainer');
        if (container) container.style.display = '';
        renderComparisonRows('mpoComparisonBody', mpos, 'mpo', 0);
        renderComparisonFooter('mpoComparisonFooter', mpos);
    }
    if (pds.length) {
        _lastComparisonItems['regionComparisonBody'] = pds;
        const container = document.getElementById('regionComparisonContainer');
        if (container) container.style.display = '';
        renderComparisonRows('regionComparisonBody', pds, 'region', 0);
        renderComparisonFooter('regionComparisonFooter', pds);
    }
    console.log('[Comparisons] mv_dashboard_comparisons:', counties.length, 'counties /',
                mpos.length, 'MPOs /', pds.length, 'PDs');
}

/**
 * Export comparison table data to CSV.
 * @param {string} tableType - 'region'|'mpo'|'county'
 */
function exportComparisonCSV(tableType) {
    const bodyId = `${tableType}ComparisonBody`;
    const items = _lastComparisonItems[bodyId];
    if (!items || !items.length) return;

    const headers = ['Name', 'Total', 'K', 'A', 'K+A', 'EPDO', 'Ped', 'Bike', 'Speed', 'Nighttime'];
    const rows = items.map(item => {
        const s = item.stats;
        const safeName = '"' + (item.name || '').replace(/"/g, '""') + '"';
        return [safeName, s.total, s.K, s.A, s.ka, s.epdo, s.ped, s.bike, s.speed, s.nighttime].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tableType}_comparison_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Handle drill-down from a comparison table row.
 * Switches to the target tier and auto-selects the appropriate geography.
 * @param {string} drillType - 'region'|'mpo'|'county'
 * @param {string} id - Identifier (region ID, MPO ID, or jurisdiction name)
 * @param {string} name - Display name
 */
async function handleComparisonDrillDown(drillType, id, name) {
    console.log(`[Tier] Drill-down: ${drillType} → ${id} (${name})`);

    // Push current state to navigation history
    _tierNavHistory.push({
        tier: jurisdictionContext.viewTier,
        regionId: jurisdictionContext.tierRegion?.id,
        mpoId: jurisdictionContext.tierMpo?.id,
        countyName: null
    });

    if (drillType === 'region') {
        // Switch to region tier and auto-select this region
        const regionDropdown = document.getElementById('tierRegionSelect');
        if (regionDropdown) {
            regionDropdown.value = id;
        }
        await handleTierChange('region');
        // Trigger region selection
        if (typeof handleRegionSelection === 'function') {
            await handleRegionSelection();
        }
    } else if (drillType === 'mpo') {
        // Switch to MPO tier and auto-select this MPO
        const mpoDropdown = document.getElementById('tierMPOSelect');
        if (mpoDropdown) {
            mpoDropdown.value = id;
        }
        await handleTierChange('mpo');
        if (typeof handleMPOSelection === 'function') {
            await handleMPOSelection();
        }
    } else if (drillType === 'county') {
        // Try to find this county in the jurisdiction dropdown
        const jurisSelect = document.getElementById('jurisdictionSelect');
        if (jurisSelect) {
            // Try exact match first, then fuzzy match
            const normalizedTarget = name.toLowerCase().replace(/\s*(county|city)\s*$/i, '').trim();
            let matched = false;
            for (const opt of jurisSelect.options) {
                const optNorm = opt.text.toLowerCase().replace(/\s*(county|city)\s*$/i, '').trim();
                if (optNorm === normalizedTarget || opt.text.toLowerCase() === name.toLowerCase()) {
                    jurisSelect.value = opt.value;
                    matched = true;
                    break;
                }
            }
            if (matched) {
                await handleTierChange('county');
                // Trigger jurisdiction change
                if (typeof handleJurisdictionChange === 'function') {
                    handleJurisdictionChange();
                } else {
                    jurisSelect.dispatchEvent(new Event('change'));
                }
            } else {
                console.warn(`[Tier] Could not match jurisdiction "${name}" in dropdown`);
                // Show user feedback for unmatched drill-down
                const toast = document.createElement('div');
                toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#f97316;color:white;padding:0.75rem 1.5rem;border-radius:8px;font-size:0.85rem;z-index:9999;box-shadow:0 4px 12px rgba(0,0,0,0.2);';
                toast.textContent = `Could not navigate to "${name}" — jurisdiction not found in dropdown.`;
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 4000);
                // Remove the navigation history entry we just pushed
                _tierNavHistory.pop();
            }
        }
    }
}

/**
 * Navigate back via breadcrumb — return to a previous tier level.
 * @param {string} tier - Target tier to return to
 */
async function navigateBreadcrumbTier(tier) {
    console.log(`[Tier] Breadcrumb navigation to: ${tier}`);

    // Pop navigation history back to target tier
    while (_tierNavHistory.length > 0) {
        const last = _tierNavHistory[_tierNavHistory.length - 1];
        if (last.tier === tier) {
            _tierNavHistory.pop();
            // Restore region/MPO selection if returning to that tier
            if (tier === 'region' && last.regionId) {
                const regionDropdown = document.getElementById('tierRegionSelect');
                if (regionDropdown) regionDropdown.value = last.regionId;
            }
            if (tier === 'mpo' && last.mpoId) {
                const mpoDropdown = document.getElementById('tierMPOSelect');
                if (mpoDropdown) mpoDropdown.value = last.mpoId;
            }
            break;
        }
        _tierNavHistory.pop();
    }

    await handleTierChange(tier);

    // Trigger appropriate data reload
    if (tier === 'region' && typeof handleRegionSelection === 'function') {
        await handleRegionSelection();
    } else if (tier === 'mpo' && typeof handleMPOSelection === 'function') {
        await handleMPOSelection();
    }
}

/**
 * Update the tier breadcrumb navigation bar.
 */
function updateTierBreadcrumb() {
    const breadcrumb = document.getElementById('tierBreadcrumb');
    if (!breadcrumb) return;

    const tier = jurisdictionContext.viewTier;

    // Hide at county tier (no breadcrumb needed — it's the default view)
    if (tier === 'county' || tier === 'city') {
        breadcrumb.style.display = 'none';
        return;
    }

    breadcrumb.style.display = '';
    const segments = [];

    // State name — always the root for non-county tiers
    const hierarchy = HierarchyRegistry.getData();
    const stateName = esc(hierarchy?.state?.name || appConfig?.defaultState || 'State');

    if (tier === 'state' || tier === 'federal') {
        segments.push(`<span style="font-weight:600;">${stateName}</span> <span style="color:#64748b;font-size:0.75rem;">(Statewide)</span>`);
    } else {
        // State is clickable to go back
        segments.push(`<a href="javascript:void(0)" onclick="navigateBreadcrumbTier('state')" style="color:#1e40af;text-decoration:none;font-weight:500;" title="Return to statewide view">${stateName}</a>`);

        if (tier === 'region') {
            const regionName = esc(jurisdictionContext.tierRegion?.shortName || jurisdictionContext.tierRegion?.name || 'Region');
            segments.push(`<span style="font-weight:600;">${regionName}</span>`);
        } else if (tier === 'mpo') {
            const mpoName = esc(jurisdictionContext.tierMpo?.shortName || jurisdictionContext.tierMpo?.name || 'MPO');
            segments.push(`<span style="font-weight:600;">${mpoName}</span>`);
        }
    }

    breadcrumb.innerHTML = segments.join(' <span style="color:#94a3b8;margin:0 0.35rem;">&#8250;</span> ');
}

/**
 * Update the tier scope header with current scope info.
 */
function updateTierScopeHeader() {
    const header = document.getElementById('tierScopeHeader');
    if (!header) return;

    const tier = jurisdictionContext.viewTier;

    // Hide at county tier — existing header handles county name
    if (tier === 'county' || tier === 'city') {
        header.style.display = 'none';
        return;
    }

    header.style.display = '';
    const titleEl = document.getElementById('tierScopeTitle');
    const subtitleEl = document.getElementById('tierScopeSubtitle');
    const badgeEl = document.getElementById('tierScopeBadge');

    const hierarchy = HierarchyRegistry.getData();
    const stateName = hierarchy?.state?.name || appConfig?.defaultState || 'State';

    if (tier === 'state' || tier === 'federal') {
        if (titleEl) titleEl.textContent = stateName;
        if (subtitleEl) subtitleEl.textContent = 'Statewide Crash Analysis';
        if (badgeEl) badgeEl.textContent = 'State View';
    } else if (tier === 'region') {
        const regionName = jurisdictionContext.tierRegion?.name || jurisdictionContext.tierRegion?.shortName || 'Region';
        const regionLabel = HierarchyRegistry.getRegionTypeLabel(false);
        if (titleEl) titleEl.textContent = regionName;
        if (subtitleEl) subtitleEl.textContent = `${stateName} — ${regionLabel}`;
        if (badgeEl) badgeEl.textContent = regionLabel;
    } else if (tier === 'mpo') {
        const mpoName = jurisdictionContext.tierMpo?.name || jurisdictionContext.tierMpo?.shortName || 'MPO';
        const tprLabel = HierarchyRegistry.getTPRTypeLabel(false);
        if (titleEl) {
            titleEl.textContent = mpoName;
            // Round 22 §5d — explain why MPO totals may not match PD totals.
            titleEl.title = 'MPO boundaries differ from Planning District boundaries — ' +
                            'crash counts may not match the Planning District total.';
        }
        if (subtitleEl) subtitleEl.textContent = `${stateName} — ${tprLabel}`;
        if (badgeEl) badgeEl.textContent = tprLabel;
    }
    // Round 22 §2 — planning_district branch was missing → tier label persisted
    // from previous MPO/region selection. Verified: Chrome Claude saw "Dover/Kent
    // County MPO" header on Central District PD selection. State-agnostic.
    else if (tier === 'planning_district') {
        const pdName = jurisdictionContext.tierPlanningDistrict?.name
                    || jurisdictionContext.tierPlanningDistrict?.shortName
                    || 'Planning District';
        if (titleEl) titleEl.textContent = pdName;
        if (subtitleEl) subtitleEl.textContent = `${stateName} — Planning District`;
        if (badgeEl) badgeEl.textContent = 'Planning District';
    }
}

/**
 * Round 6 (2026-05-09): paint Dashboard's main chart canvases from
 * mv_analysis_summary. Replaces the row-iteration block in updateDashboard()
 * (chartYoY, chartKAYear, chartMonth, chartFuncClass, chartCollision,
 * chartWeather, chartLight) when crashState.sampleRows is empty
 * (Supabase-only mode). chartDOW is held back as a placeholder until backend
 * adds a 'dow' dimension to the matview. The 4 chartDistrict* canvases come
 * from a separate dashboard_summary group-by handled elsewhere.
 */
// Round-9 Fix 5 — paint a chart only when its canvas is scrolled into view
// (or about to be — 200px rootMargin pre-fetches just before reveal). Cuts
// initial dashboard paint from ~700ms (7 charts) to ~120ms (1–2 charts).
// Falls back to immediate paint if IntersectionObserver isn't supported or
// the canvas is missing entirely.
window.__clChartObservers = window.__clChartObservers || new Map();
function paintWhenVisible(canvasId, paintFn) {
    try {
        const el = document.getElementById(canvasId);
        if (!el) { paintFn(); return; }
        if (typeof IntersectionObserver !== 'function') { paintFn(); return; }
        // If we already scheduled an observer for this canvas, replace it
        // (newer paintFn closes over fresher data).
        const prior = window.__clChartObservers.get(canvasId);
        if (prior) { try { prior.disconnect(); } catch (e) {} window.__clChartObservers.delete(canvasId); }
        const obs = new IntersectionObserver(function (entries, observer) {
            if (entries[0] && entries[0].isIntersecting) {
                try { paintFn(); } catch (e) { console.warn('[paintWhenVisible]', canvasId, e && e.message); }
                observer.disconnect();
                window.__clChartObservers.delete(canvasId);
            }
        }, { rootMargin: '200px' });
        obs.observe(el);
        window.__clChartObservers.set(canvasId, obs);
    } catch (e) {
        // If anything goes wrong, just paint synchronously.
        try { paintFn(); } catch (e2) { /* swallow */ }
    }
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.dashboard=CL.dashboard||{};
  CL.dashboard.tab=CL.dashboard.tab||{};
  window.hydrateComparisonsFromMatview=hydrateComparisonsFromMatview; CL.dashboard.tab.hydrateComparisonsFromMatview=hydrateComparisonsFromMatview;
  window.exportComparisonCSV=exportComparisonCSV; CL.dashboard.tab.exportComparisonCSV=exportComparisonCSV;
  window.handleComparisonDrillDown=handleComparisonDrillDown; CL.dashboard.tab.handleComparisonDrillDown=handleComparisonDrillDown;
  window.navigateBreadcrumbTier=navigateBreadcrumbTier; CL.dashboard.tab.navigateBreadcrumbTier=navigateBreadcrumbTier;
  window.updateTierBreadcrumb=updateTierBreadcrumb; CL.dashboard.tab.updateTierBreadcrumb=updateTierBreadcrumb;
  window.updateTierScopeHeader=updateTierScopeHeader; CL.dashboard.tab.updateTierScopeHeader=updateTierScopeHeader;
  window.paintWhenVisible=paintWhenVisible; CL.dashboard.tab.paintWhenVisible=paintWhenVisible;
  CL._registerModule('dashboard/dashboard-tab-drill');
})();
