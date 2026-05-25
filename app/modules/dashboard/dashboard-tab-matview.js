/** CL dashboard.tab (matview) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/15-v2-dashboard-tab.md + MODULAR_PLAN_PROMPT_15-v2_VERIFY.md.
 *  Verbatim except: _tierComparisonCache qualified to window._tierComparisonCache
 *  (reassigned in 15b, invalidated from 15d — cross-IIFE shared mutable global).
 *  No behavior change.
 *
 *  CC 312 Phase 2 note: this module reads mv_analysis_summary
 *  (getAnalysisBreakdown) for chart breakdowns — NOT dashboard_summary.
 *  KPI-card aggregates (total/K/A/ped/bike/speed/night/EPDO) now come
 *  from mv_dashboard_tier_kpi via crashLensClient.getDashboardTierKpi(),
 *  invoked from app/modules/data/supabase-bridge.js. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L43358-L43836) ───
async function paintDashboardChartsFromMatview() {
    const dc = (window.CL && CL.data) ? CL.data.client : null;
    if (!dc || typeof dc.getAnalysisBreakdown !== 'function') {
        console.log('[Dashboard] No data client available — chart painting skipped');
        return;
    }

    let tierResolved = { tier: 'state', value: null };
    try {
        if (CL.data.supabaseBridge && typeof CL.data.supabaseBridge.resolveTier === 'function') {
            tierResolved = CL.data.supabaseBridge.resolveTier();
        }
    } catch (e) { /* non-fatal */ }

    // Round-9 Fix 7 — share the matview cache so other tabs hitting the same
    // analysis_summary key don't re-fetch.
    // Perf Phase 4 (CC 314) — opt in to IDB persistence (24h, state-scoped).
    const D = await CL.data.cachedMatview('mv_analysis_summary', tierResolved.tier, tierResolved.value,
        () => dc.getAnalysisBreakdown(tierResolved.tier, tierResolved.value),
        undefined,
        { persist: true, persistTtlMs: 24 * 60 * 60 * 1000,
          state: (window.crashLensClient && window.crashLensClient.state) });
    if (!D) return;

    const sortedYears = Object.keys(D.byYear || {}).map(Number).filter(y => y >= 2000).sort((a, b) => a - b);

    // chartYoY — Year-over-Year % change
    if (sortedYears.length > 1 && typeof createChart === 'function') {
        paintWhenVisible('chartYoY', () => {
            const yoy = sortedYears.slice(1).map((y, i) => {
                const prev = D.byYear[sortedYears[i]]?.total || 0;
                const curr = D.byYear[y]?.total || 0;
                return prev > 0 ? ((curr - prev) / prev * 100) : 0;
            });
            createChart('chartYoY', 'bar', {
                labels: sortedYears.slice(1).map(String),
                datasets: [{
                    label: '% Change',
                    data: yoy.map(v => v.toFixed(1)),
                    backgroundColor: yoy.map(v => v > 0 ? '#dc2626' : '#059669')
                }]
            });
        });
    }

    // chartKAYear — K and A by year
    if (sortedYears.length > 0) {
        paintWhenVisible('chartKAYear', () => {
            createChart('chartKAYear', 'line', {
                labels: sortedYears.map(String),
                datasets: [
                    { label: 'Fatal (K)',   data: sortedYears.map(y => D.byYear[y]?.K || 0), borderColor: '#dc2626', backgroundColor: 'rgba(220,38,38,.1)', fill: true, tension: 0.3 },
                    { label: 'Serious (A)', data: sortedYears.map(y => D.byYear[y]?.A || 0), borderColor: '#ea580c', backgroundColor: 'rgba(234,88,12,.1)', fill: true, tension: 0.3 }
                ]
            });
        });
    }

    // chartMonth — Monthly distribution
    if (D.byMonth && Object.keys(D.byMonth).length > 0) {
        paintWhenVisible('chartMonth', () => {
            const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            createChart('chartMonth', 'bar', {
                labels: monthLabels,
                datasets: [{
                    label: 'Crashes',
                    data: monthLabels.map((_, i) => D.byMonth[i + 1]?.total || 0),
                    backgroundColor: '#7c3aed'
                }]
            });
        });
    }

    // chartFuncClass — Functional Class distribution (top 8)
    // Round 22 §1a — paint immediately (was wrapped in paintWhenVisible which raced
    // with PDF capture + matrix-audit. Data already loaded into D.byFuncClass).
    if (D.byFuncClass && Object.keys(D.byFuncClass).length > 0) {
        const fc = Object.entries(D.byFuncClass)
            .filter(([_, v]) => v && v.total > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 8);
        if (fc.length > 0) {
            createChart('chartFuncClass', 'bar', {
                labels: fc.map(([k]) => String(k).substring(0, 20)),
                datasets: [{ label: 'Crashes', data: fc.map(([_, v]) => v.total), backgroundColor: '#059669' }]
            }, { indexAxis: 'y' });
        }
    }

    // chartCollision — Top 10 collision types. byCollision is { name: total }.
    if (D.byCollision && Object.keys(D.byCollision).length > 0) {
        paintWhenVisible('chartCollision', () => {
            const cols = Object.entries(D.byCollision)
                .filter(([_, v]) => v > 0)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);
            if (cols.length > 0) {
                createChart('chartCollision', 'bar', {
                    labels: cols.map(([k]) => String(k).substring(0, 25)),
                    datasets: [{ label: 'Crashes', data: cols.map(([_, v]) => v), backgroundColor: '#7c3aed' }]
                }, { indexAxis: 'y' });
            }
        });
    }

    // chartWeather — Top 6 weather conditions doughnut
    // Round 22 §1b — paint immediately (drop paintWhenVisible).
    if (D.byWeather && Object.keys(D.byWeather).length > 0) {
        const wx = Object.entries(D.byWeather)
            .filter(([_, v]) => v && v.total > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 6);
        if (wx.length > 0) {
            const wxLabels = wx.map(([k]) => String(k).substring(0, 20));
            const wxData = wx.map(([_, v]) => v.total);
            const wxColors = ['#0ea5e9','#64748b','#f59e0b','#10b981','#8b5cf6','#ec4899'];
            createChart('chartWeather', 'doughnut', {
                labels: wxLabels,
                datasets: [{ data: wxData, backgroundColor: wxColors, borderWidth: 2, borderColor: '#fff' }]
            }, { cutout: '50%', plugins: { legend: { display: false } } });
            const total = wxData.reduce((s, n) => s + n, 0);
            if (typeof buildCustomLegend === 'function') {
                buildCustomLegend('legendWeather', wxLabels, wxData, wxColors, total);
            }
        }
    }

    // chartLight — Top 6 light conditions doughnut
    // Round 22 §1c — paint immediately (drop paintWhenVisible).
    if (D.byLight && Object.keys(D.byLight).length > 0) {
        const lt = Object.entries(D.byLight)
            .filter(([_, v]) => v && v.total > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 6);
        if (lt.length > 0) {
            const ltLabels = lt.map(([k]) => String(k).substring(0, 20));
            const ltData = lt.map(([_, v]) => v.total);
            const ltColors = ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1','#14b8a6'];
            createChart('chartLight', 'doughnut', {
                labels: ltLabels,
                datasets: [{ data: ltData, backgroundColor: ltColors, borderWidth: 2, borderColor: '#fff' }]
            }, { cutout: '50%', plugins: { legend: { display: false } } });
            const total = ltData.reduce((s, n) => s + n, 0);
            if (typeof buildCustomLegend === 'function') {
                buildCustomLegend('legendLight', ltLabels, ltData, ltColors, total);
            }
        }
    }

    // chartDOW — Round 12: getAnalysisBreakdown now unions mv_analysis_extra
    // (dow / roadsurface / trafficcontrol / firstevent dimensions) into the
    // same envelope, so D.byDow is populated automatically.
    if (D.byDow && Object.keys(D.byDow).length > 0) {
        paintWhenVisible('chartDOW', () => {
            const dowLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            createChart('chartDOW', 'bar', {
                labels: dowLabels,
                datasets: [{
                    label: 'Crashes',
                    data: dowLabels.map((_, i) => D.byDow[i]?.total || 0),
                    backgroundColor: '#06b6d4'
                }]
            });
        });
    } else if (typeof showChartPlaceholder === 'function') {
        showChartPlaceholder('chartDOW', 'No day-of-week data available for this jurisdiction.');
    }
}

/**
 * Show/hide comparison matrices and district matrix based on current tier.
 * Called from updateDashboard().
 */
/** Phase 4: Debounce timer for rapid tier/filter changes */
let _tierSectionDebounceTimer = null;

function updateDashboardTierSections() {
    const tier = jurisdictionContext.viewTier;

    // District matrix: only visible at county/city tier
    const districtWidget = document.getElementById('districtMatrixWidget');
    if (districtWidget) {
        districtWidget.style.display = (tier === 'county' || tier === 'city') ? '' : 'none';
    }

    // Breadcrumb and scope header — lightweight, render immediately
    updateTierBreadcrumb();
    updateTierScopeHeader();

    // Comparison matrices — potentially heavy computation for large datasets
    // Phase 4: Debounce to prevent multiple rapid computations
    if (_tierSectionDebounceTimer) clearTimeout(_tierSectionDebounceTimer);

    if (tier === 'county' || tier === 'city') {
        // County tier: hide all comparison containers immediately (no debounce needed)
        ['regionComparisonContainer', 'mpoComparisonContainer', 'countyComparisonContainer'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    } else {
        // Phase 4: Use requestAnimationFrame + small delay for non-blocking rendering
        _tierSectionDebounceTimer = setTimeout(() => {
            const startTime = performance.now();

            if (tier === 'state' || tier === 'federal') {
                renderRegionComparisonTable();
                renderMPOComparisonTable();
                renderCountyComparisonTable();
            } else if (tier === 'region' || tier === 'mpo') {
                const regionContainer = document.getElementById('regionComparisonContainer');
                const mpoContainer = document.getElementById('mpoComparisonContainer');
                if (regionContainer) regionContainer.style.display = 'none';
                if (mpoContainer) mpoContainer.style.display = 'none';
                renderCountyComparisonTable();
            }
            // Round 15 §12.3 — also hydrate from mv_dashboard_comparisons so the
            // tables paint at aggregate tiers when sampleRows is empty (Supabase
            // mode). Async + non-blocking — overrides the legacy renders if data
            // is available.
            if (typeof hydrateComparisonsFromMatview === 'function'
                && (tier === 'state' || tier === 'federal' || tier === 'region' || tier === 'mpo')) {
                hydrateComparisonsFromMatview(tier).catch(e =>
                    console.warn('[Comparisons] matview hydration failed (non-fatal):', e && e.message)
                );
            }

            const elapsed = (performance.now() - startTime).toFixed(1);
            const _sampleLen = (crashState && Array.isArray(crashState.sampleRows)) ? crashState.sampleRows.length : 0;
            console.log(`[Tier] Comparison tables rendered in ${elapsed}ms (${_sampleLen.toLocaleString()} rows)`);
            // Bug 9: at aggregate tiers, sampleRows carries the previously-viewed
            // county's rows (e.g. 87,073 from Sussex). The comparison tables read
            // it directly, so the figures look right but are scoped wrong. Until
            // the renders are routed through dashboard_summary / mv_hotspots,
            // surface the stale-source mismatch so QA flags it.
            if (_sampleLen > 0 && (tier === 'state' || tier === 'federal' || tier === 'region' || tier === 'mpo' || tier === 'planning_district')) {
                console.warn('[Tier] Comparison tables using stale sampleRows at aggregate tier — re-fetch from Supabase');
            }
        }, 50); // 50ms debounce — prevents stacking during rapid tier switches
    }

    // Invalidate comparison cache when tier changes
    window._tierComparisonCache = null;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: Tab-Specific Tier Adaptations — County Column + Filtering
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Check if the current tier requires county column additions in Explore tabs.
 * @returns {boolean} true if at a multi-county tier (state, region, mpo, federal)
 */
function isMultiCountyTier() {
    const tier = jurisdictionContext.viewTier;
    return tier === 'state' || tier === 'region' || tier === 'mpo' || tier === 'federal';
}

/**
 * Build a county filter dropdown for use in various tabs at multi-county tiers.
 * @param {string} containerId - Element ID to render the filter into
 * @param {Function} onFilterChange - Callback(selectedCounty) when filter changes. null = all.
 * @returns {HTMLSelectElement|null} The created select element, or null if not multi-county
 */
function buildCountyFilterDropdown(containerId, onFilterChange) {
    const container = document.getElementById(containerId);
    if (!container) return null;

    if (!isMultiCountyTier()) {
        container.style.display = 'none';
        container.innerHTML = '';
        return null;
    }

    container.style.display = '';

    const { byJuris } = buildTierComparison();
    const counties = Object.keys(byJuris).sort();

    const select = document.createElement('select');
    select.style.cssText = 'font-size:0.8rem;padding:0.3rem 0.5rem;border:1px solid #e2e8f0;border-radius:6px;background:white;cursor:pointer;';
    select.innerHTML = `<option value="">All Jurisdictions (${counties.length})</option>` +
        counties.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');

    select.addEventListener('change', () => {
        onFilterChange(select.value || null);
    });

    container.innerHTML = '<span style="font-size:0.8rem;font-weight:500;color:var(--gray);margin-right:0.4rem;">Filter by County:</span>';
    container.appendChild(select);

    return select;
}

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5: Comparison Heatmap Component
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Render a comparison heatmap grid for cross-county analysis.
 * @param {string} containerId - Container element ID
 * @param {string} scope - 'state'|'region'|'mpo' — determines what data to show
 */
function renderComparisonHeatmap(containerId, scope) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const { byJuris } = buildTierComparison();
    const counties = Object.entries(byJuris)
        .sort((a, b) => b[1].epdo - a[1].epdo);

    if (!counties.length) {
        container.innerHTML = '<div style="text-align:center;color:var(--gray);padding:1rem;">No data for heatmap</div>';
        return;
    }

    const categories = [
        { key: 'total', label: 'Total', color: '#1e40af' },
        { key: 'K', label: 'Fatal', color: '#dc2626' },
        { key: 'A', label: 'Serious', color: '#f97316' },
        { key: 'ka', label: 'K+A', color: '#b91c1c' },
        { key: 'epdo', label: 'EPDO', color: '#7c3aed' },
        { key: 'ped', label: 'Ped', color: '#8b5cf6' },
        { key: 'bike', label: 'Bike', color: '#06b6d4' },
        { key: 'speed', label: 'Speed', color: '#ea580c' }
    ];

    // Find max per category for normalization
    const maxVals = {};
    categories.forEach(cat => {
        maxVals[cat.key] = Math.max(...counties.map(([, s]) => s[cat.key] || 0));
    });

    let html = `<div style="overflow-x:auto;">
    <table style="border-collapse:collapse;font-size:0.75rem;width:100%;">
    <thead><tr>
        <th style="padding:0.4rem;text-align:left;border-bottom:2px solid #e2e8f0;position:sticky;left:0;background:white;z-index:1;">Jurisdiction</th>
        ${categories.map(c => `<th style="padding:0.4rem;text-align:center;border-bottom:2px solid #e2e8f0;min-width:55px;">${c.label}</th>`).join('')}
    </tr></thead><tbody>`;

    counties.forEach(([name, stats]) => {
        const safeName = esc(name);
        html += `<tr>
            <td style="padding:0.3rem 0.4rem;border-bottom:1px solid #f1f5f9;font-weight:500;position:sticky;left:0;background:white;z-index:1;white-space:nowrap;">${safeName}</td>`;
        categories.forEach(cat => {
            const val = stats[cat.key] || 0;
            const max = maxVals[cat.key] || 1;
            const intensity = Math.min(val / max, 1);
            // Color scale: white → category color
            const opacity = 0.05 + intensity * 0.55;
            html += `<td style="padding:0.3rem 0.4rem;text-align:center;border-bottom:1px solid #f1f5f9;background:rgba(${_compHexToRgb(cat.color)},${opacity.toFixed(2)});" title="${safeName}: ${cat.label} = ${val.toLocaleString()}">${val.toLocaleString()}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/** Helper to convert hex color to r,g,b string (comparison heatmap) */
function _compHexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

/** Phase 5: Toggle between table and heatmap view for county comparison */
let _countyHeatmapActive = false;
function toggleCountyHeatmap() {
    _countyHeatmapActive = !_countyHeatmapActive;
    const tableView = document.getElementById('countyComparisonTableView');
    const heatmapView = document.getElementById('countyComparisonHeatmapView');
    const toggleBtn = document.getElementById('countyHeatmapToggle');

    if (_countyHeatmapActive) {
        if (tableView) tableView.style.display = 'none';
        if (heatmapView) {
            heatmapView.style.display = '';
            renderComparisonHeatmap('countyComparisonHeatmapView', jurisdictionContext.viewTier);
        }
        if (toggleBtn) {
            toggleBtn.textContent = 'Table';
            toggleBtn.classList.remove('btn-soft-secondary');
            toggleBtn.classList.add('btn-soft-primary');
        }
    } else {
        if (tableView) tableView.style.display = '';
        if (heatmapView) heatmapView.style.display = 'none';
        if (toggleBtn) {
            toggleBtn.textContent = 'Heatmap';
            toggleBtn.classList.remove('btn-soft-primary');
            toggleBtn.classList.add('btn-soft-secondary');
        }
    }
}

// Round 20 §8 — dashboard chart paint counter. The loading banner lingered
// because we never knew when the last chart finished rendering. Track the six
// dashboard canvases and hide the banner once they've all painted.
const _DASHBOARD_CHART_IDS = new Set([
    'dashboardYoYChart', 'dashboardKaYearChart', 'dashboardDowChart',
    'dashboardMonthlyChart', 'dashboardCollisionChart', 'dashboardWeatherChart'
]);
let _dashboardChartsPainted = new Set();
function _markDashboardChartPainted(canvasId) {
    if (!_DASHBOARD_CHART_IDS.has(canvasId)) return;
    _dashboardChartsPainted.add(canvasId);
    if (_dashboardChartsPainted.size >= _DASHBOARD_CHART_IDS.size) {
        const banner = document.getElementById('dashboardLoadingBanner');
        if (banner) banner.style.display = 'none';
        const grid = document.getElementById('dashboardKPIs');
        if (grid) grid.style.opacity = '1';
    }
}
// Reset on jurisdiction change so the count is fresh for each tier.
document.addEventListener('jurisdictionChanged', () => { _dashboardChartsPainted = new Set(); });

function createChart(id, type, data, opts = {}) {
    const ctx = document.getElementById(id);
    if (!ctx) return;
    // Round-4 Patch 3 — defensively destroy ANY existing Chart on this canvas,
    // not just one we tracked in `charts[id]`. The legacy row-pipe path
    // created Chart instances directly on F&S / Ped-Bike / Intersection
    // canvases without registering them in `charts[]`; the round-3 paint
    // helpers then tripped Chart.js "Canvas is already in use" warnings on
    // every tier change. Chart.getChart(canvas) returns the live instance
    // attached to that canvas regardless of who created it.
    if (charts[id]) {
        try { charts[id].destroy(); } catch (e) { /* non-fatal */ }
        delete charts[id];
    }
    try {
        const stray = (typeof Chart !== 'undefined' && Chart.getChart) ? Chart.getChart(ctx) : null;
        if (stray) stray.destroy();
    } catch (e) { /* non-fatal */ }

    const defaults = {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: type === 'doughnut' ? 'right' : 'top', labels: { font: { size: 10 } } } }
    };
    if (type === 'bar' && !opts.indexAxis) {
        defaults.scales = { x: { ticks: { font: { size: 9 } } }, y: { beginAtZero: true, ticks: { font: { size: 9 } } } };
    }
    if (opts.indexAxis === 'y') {
        defaults.scales = { x: { beginAtZero: true, ticks: { font: { size: 9 } } }, y: { ticks: { font: { size: 9 } } } };
    }

    charts[id] = new Chart(ctx, { type, data, options: { ...defaults, ...opts } });
    if (_DASHBOARD_CHART_IDS.has(id)) {
        // Defer one tick so the canvas has been laid out before we mark it painted.
        setTimeout(() => _markDashboardChartPainted(id), 0);
    }
}

// Bug fix (round 3, 2026-05-08): when a backend matview doesn't yet support
// a breakdown, replace the empty Chart.js canvas with an inline placeholder
// so users see why instead of a blank rectangle. Idempotent — calling twice
// for the same canvas does nothing.
function showChartPlaceholder(canvasId, message) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const parent = c.parentElement;
    if (!parent) return;
    if (parent.querySelector('.chart-placeholder')) return;
    if (charts[canvasId]) { try { charts[canvasId].destroy(); } catch (_) {} delete charts[canvasId]; }
    c.style.display = 'none';
    const ph = document.createElement('div');
    ph.className = 'chart-placeholder';
    ph.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem;color:#94a3b8;text-align:center;font-size:.85rem;background:#f8fafc;border:1px dashed #cbd5e1;border-radius:8px;min-height:150px';
    ph.innerHTML = '<div style="font-size:1.5rem">📊</div><div style="margin-top:.5rem">' + message + '</div>';
    parent.appendChild(ph);
}

function clearChartPlaceholder(canvasId) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const parent = c.parentElement;
    if (!parent) return;
    const ph = parent.querySelector('.chart-placeholder');
    if (ph) ph.remove();
    c.style.display = '';
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.dashboard=CL.dashboard||{};
  CL.dashboard.tab=CL.dashboard.tab||{};
  window.paintDashboardChartsFromMatview=paintDashboardChartsFromMatview; CL.dashboard.tab.paintDashboardChartsFromMatview=paintDashboardChartsFromMatview;
  window.updateDashboardTierSections=updateDashboardTierSections; CL.dashboard.tab.updateDashboardTierSections=updateDashboardTierSections;
  window.isMultiCountyTier=isMultiCountyTier; CL.dashboard.tab.isMultiCountyTier=isMultiCountyTier;
  window.buildCountyFilterDropdown=buildCountyFilterDropdown; CL.dashboard.tab.buildCountyFilterDropdown=buildCountyFilterDropdown;
  window.renderComparisonHeatmap=renderComparisonHeatmap; CL.dashboard.tab.renderComparisonHeatmap=renderComparisonHeatmap;
  window._compHexToRgb=_compHexToRgb; CL.dashboard.tab._compHexToRgb=_compHexToRgb;
  window.toggleCountyHeatmap=toggleCountyHeatmap; CL.dashboard.tab.toggleCountyHeatmap=toggleCountyHeatmap;
  window._markDashboardChartPainted=_markDashboardChartPainted; CL.dashboard.tab._markDashboardChartPainted=_markDashboardChartPainted;
  window.createChart=createChart; CL.dashboard.tab.createChart=createChart;
  window.showChartPlaceholder=showChartPlaceholder; CL.dashboard.tab.showChartPlaceholder=showChartPlaceholder;
  window.clearChartPlaceholder=clearChartPlaceholder; CL.dashboard.tab.clearChartPlaceholder=clearChartPlaceholder;
  CL._registerModule('dashboard/dashboard-tab-matview');
})();
