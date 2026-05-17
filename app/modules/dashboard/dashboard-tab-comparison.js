/** CL dashboard.tab (comparison) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/15-v2-dashboard-tab.md + MODULAR_PLAN_PROMPT_15-v2_VERIFY.md.
 *  Verbatim except: _tierComparisonCache qualified to window._tierComparisonCache
 *  (reassigned in 15b, invalidated from 15d — cross-IIFE shared mutable global).
 *  No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L42450-L43002) ───
// ═══════════════════════════════════════════════════════════════════════════
// MULTI-TIER VIEW: Comparison Matrices, Breadcrumb, Drill-Down Navigation
// Phases 1-5 of the Different View Configuration spec
// ═══════════════════════════════════════════════════════════════════════════

/** Tier comparison cache — rebuilt when data changes or tier switches */
window._tierComparisonCache = null;
let _tierComparisonCacheKey = null;

/** Tier navigation history stack for breadcrumb back-navigation */
const _tierNavHistory = [];

/**
 * Build jurisdiction-level comparison data from loaded sampleRows.
 * Single O(n) pass grouping by COL.JURISDICTION. Also groups by year for sparklines (Phase 5).
 * @returns {Object} { byJuris: { name: {total,K,A,B,C,O,ped,bike,speed,ka,epdo,byYear:{}} }, totalRows }
 */
function buildTierComparison() {
    // Guard: skip if sampleRows not loaded yet
    if (!crashState.sampleRows || crashState.sampleRows.length === 0) {
        return { byJuris: {}, totalRows: 0 };
    }

    const cacheKey = `${crashState.totalRows}_${crashState.sampleRows.length}_${jurisdictionContext.viewTier}`;
    if (window._tierComparisonCache && _tierComparisonCacheKey === cacheKey) return window._tierComparisonCache;

    const byJuris = {};
    let totalRows = 0;

    crashState.sampleRows.forEach(row => {
        const juris = (row[COL.JURISDICTION] || '').trim();
        if (!juris) return;
        if (!byJuris[juris]) {
            byJuris[juris] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, nighttime: 0, byYear: {} };
        }
        const entry = byJuris[juris];
        entry.total++;
        totalRows++;
        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        if (entry[sev] !== undefined) entry[sev]++;
        if (row[COL.PED] === 'Yes') entry.ped++;
        if (row[COL.BIKE] === 'Yes') entry.bike++;
        if (row[COL.SPEED] === 'Yes') entry.speed++;
        if (row[COL.NIGHT] === 'Yes') entry.nighttime++;

        // Year breakdown for sparklines (Phase 5)
        const yr = parseInt(row[COL.YEAR]);
        if (yr) {
            if (!entry.byYear[yr]) entry.byYear[yr] = { total: 0, K: 0, A: 0 };
            entry.byYear[yr].total++;
            if (sev === 'K') entry.byYear[yr].K++;
            if (sev === 'A') entry.byYear[yr].A++;
        }
    });

    // Compute derived fields
    Object.values(byJuris).forEach(e => {
        e.ka = e.K + e.A;
        e.epdo = calcEPDO(e);
    });

    window._tierComparisonCache = { byJuris, totalRows };
    _tierComparisonCacheKey = cacheKey;
    return window._tierComparisonCache;
}

/**
 * Aggregate jurisdiction data into region-level summaries using hierarchy.
 * @returns {Array} [{id, name, shortName, stats:{total,K,A,...,ka,epdo}, memberCounties:[], memberCount}]
 */
function buildRegionComparison() {
    const { byJuris } = buildTierComparison();
    const regions = HierarchyRegistry.getRegions();
    if (!regions.length) return [];

    return regions.map(region => {
        const stats = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, nighttime: 0, byYear: {} };
        const memberCounties = [];

        // Match counties by name from hierarchy countyNames
        const countyNameSet = new Set();
        if (region.countyNames) {
            Object.values(region.countyNames).forEach(name => countyNameSet.add(name.toLowerCase()));
        }

        Object.entries(byJuris).forEach(([jurisName, jurisStats]) => {
            // Match by checking if jurisdiction name matches any county name in this region
            const normalizedJuris = jurisName.toLowerCase().replace(/\s*(county|city|borough|parish|census area)\s*$/i, '').trim();
            const isMatch = countyNameSet.has(normalizedJuris) ||
                            countyNameSet.has(jurisName.toLowerCase()) ||
                            // Also check with "County" suffix
                            countyNameSet.has(normalizedJuris.replace(/\s+/g, ' '));

            if (isMatch) {
                memberCounties.push(jurisName);
                stats.total += jurisStats.total;
                stats.K += jurisStats.K;
                stats.A += jurisStats.A;
                stats.B += jurisStats.B;
                stats.C += jurisStats.C;
                stats.O += jurisStats.O;
                stats.ped += jurisStats.ped;
                stats.bike += jurisStats.bike;
                stats.speed += jurisStats.speed;
                stats.nighttime += jurisStats.nighttime;
                // Merge year data
                Object.entries(jurisStats.byYear).forEach(([yr, ys]) => {
                    if (!stats.byYear[yr]) stats.byYear[yr] = { total: 0, K: 0, A: 0 };
                    stats.byYear[yr].total += ys.total;
                    stats.byYear[yr].K += ys.K;
                    stats.byYear[yr].A += ys.A;
                });
            }
        });

        stats.ka = stats.K + stats.A;
        stats.epdo = calcEPDO(stats);

        return {
            id: region.id, name: region.name, shortName: region.shortName || region.name,
            stats, memberCounties, memberCount: region.counties?.length || 0
        };
    }).filter(r => r.stats.total > 0);
}

/**
 * Aggregate jurisdiction data into MPO-level summaries using hierarchy.
 * @returns {Array} [{id, name, shortName, stats:{...}, memberCounties:[], memberCount}]
 */
function buildMPOComparison() {
    const { byJuris } = buildTierComparison();
    const mpos = HierarchyRegistry.getMPOs();
    if (!mpos.length) return [];

    return mpos.map(mpo => {
        const stats = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, speed: 0, nighttime: 0, byYear: {} };
        const memberCounties = [];

        const countyNameSet = new Set();
        if (mpo.countyNames) {
            Object.values(mpo.countyNames).forEach(name => countyNameSet.add(name.toLowerCase()));
        }

        Object.entries(byJuris).forEach(([jurisName, jurisStats]) => {
            const normalizedJuris = jurisName.toLowerCase().replace(/\s*(county|city|borough|parish|census area)\s*$/i, '').trim();
            const isMatch = countyNameSet.has(normalizedJuris) ||
                            countyNameSet.has(jurisName.toLowerCase()) ||
                            countyNameSet.has(normalizedJuris.replace(/\s+/g, ' '));

            if (isMatch) {
                memberCounties.push(jurisName);
                stats.total += jurisStats.total;
                stats.K += jurisStats.K;
                stats.A += jurisStats.A;
                stats.B += jurisStats.B;
                stats.C += jurisStats.C;
                stats.O += jurisStats.O;
                stats.ped += jurisStats.ped;
                stats.bike += jurisStats.bike;
                stats.speed += jurisStats.speed;
                stats.nighttime += jurisStats.nighttime;
                Object.entries(jurisStats.byYear).forEach(([yr, ys]) => {
                    if (!stats.byYear[yr]) stats.byYear[yr] = { total: 0, K: 0, A: 0 };
                    stats.byYear[yr].total += ys.total;
                    stats.byYear[yr].K += ys.K;
                    stats.byYear[yr].A += ys.A;
                });
            }
        });

        stats.ka = stats.K + stats.A;
        stats.epdo = calcEPDO(stats);

        return {
            id: mpo.id, name: mpo.name, shortName: mpo.shortName || mpo.name,
            stats, memberCounties, memberCount: mpo.counties?.length || 0
        };
    }).filter(m => m.stats.total > 0);
}

/**
 * Get a severity-weighted background color for table rows.
 * @param {number} epdo - EPDO value for this row
 * @param {number} maxEpdo - Maximum EPDO across all rows
 * @returns {string} CSS background color
 */
function getComparisonRowColor(epdo, maxEpdo) {
    if (!maxEpdo || maxEpdo === 0) return '';
    const intensity = Math.min(epdo / maxEpdo, 1);
    const r = Math.round(254 + (220 - 254) * intensity);
    const g = Math.round(252 + (38 - 252) * intensity * 0.15);
    const b = Math.round(252 + (38 - 252) * intensity * 0.05);
    const a = 0.08 + intensity * 0.12;
    return `rgba(${r < 220 ? 220 : r},${g < 200 ? 200 : g},${b < 230 ? 230 : b},${a})`;
}

/**
 * Build a sparkline SVG string for a row's year-over-year trend.
 * @param {Object} byYear - { year: {total} }
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @returns {string} Inline SVG HTML
 */
function buildComparisonSparkline(byYear, width = 60, height = 20) {
    const years = Object.keys(byYear).map(Number).sort();
    if (years.length < 2) return '<span style="color:#94a3b8;font-size:0.7rem;">--</span>';
    const values = years.map(y => byYear[y].total);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const points = values.map((v, i) => {
        const x = (i / (values.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    // Trend color: green if decreasing, red if increasing
    const trend = values[values.length - 1] - values[0];
    const color = trend > 0 ? '#dc2626' : trend < 0 ? '#059669' : '#94a3b8';

    return `<svg width="${width}" height="${height}" style="vertical-align:middle;">
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="${(width).toFixed(1)}" cy="${(height - ((values[values.length - 1] - min) / range) * (height - 4) - 2).toFixed(1)}" r="2" fill="${color}"/>
    </svg>`;
}

/**
 * Build a trend indicator string (e.g., "↑ 3.2%") comparing last 2 years.
 * @param {Object} byYear - { year: {total} }
 * @returns {string} HTML trend indicator
 */
function buildComparisonTrend(byYear) {
    const years = Object.keys(byYear).map(Number).sort();
    if (years.length < 2) return '';
    const last = byYear[years[years.length - 1]].total;
    const prev = byYear[years[years.length - 2]].total;
    if (prev === 0) return '';
    const pctChangeNum = (last - prev) / prev * 100;
    const pctChangeStr = pctChangeNum.toFixed(1);
    const arrow = pctChangeNum > 0 ? '↑' : pctChangeNum < 0 ? '↓' : '→';
    const color = pctChangeNum > 0 ? '#dc2626' : pctChangeNum < 0 ? '#059669' : '#94a3b8';
    return `<span style="color:${color};font-size:0.75rem;font-weight:600;">${arrow} ${Math.abs(pctChangeStr)}%</span>`;
}

/**
 * Render comparison table rows into a table body.
 * @param {string} bodyId - tbody element ID
 * @param {Array} items - [{name, shortName, id, stats:{total,K,A,ka,epdo,ped,bike,byYear}}]
 * @param {string} drillType - 'region'|'mpo'|'county' — what drill-down triggers
 * @param {number} maxDisplay - Max rows to show initially (0 = all)
 */
function renderComparisonRows(bodyId, items, drillType, maxDisplay = 0) {
    const tbody = document.getElementById(bodyId);
    if (!tbody) return;

    if (!items.length) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--gray);padding:1.5rem;">No data available</td></tr>`;
        return;
    }

    const maxEpdo = Math.max(...items.map(i => i.stats.epdo));

    // Outlier detection (Phase 5): mean + 1.5 SD
    const epdoValues = items.map(i => i.stats.epdo);
    const mean = epdoValues.reduce((a, b) => a + b, 0) / epdoValues.length;
    const sd = Math.sqrt(epdoValues.reduce((s, v) => s + (v - mean) ** 2, 0) / epdoValues.length);
    const outlierThreshold = mean + 1.5 * sd;

    const displayItems = maxDisplay > 0 ? items.slice(0, maxDisplay) : items;
    let html = '';

    displayItems.forEach((item, idx) => {
        const s = item.stats;
        const bgColor = getComparisonRowColor(s.epdo, maxEpdo);
        const isOutlier = s.epdo > outlierThreshold && items.length > 3;
        const outlierMultiplier = mean > 0 ? (s.epdo / mean).toFixed(1) : '0';
        const outlierBadge = isOutlier ? `<span title="EPDO is ${outlierMultiplier}x the average" style="color:#dc2626;font-size:0.7rem;margin-left:0.25rem;">&#9888;</span>` : '';
        const sparkline = buildComparisonSparkline(s.byYear);
        const trend = buildComparisonTrend(s.byYear);
        const displayName = esc(item.shortName || item.name);

        html += `<tr style="cursor:pointer;background:${bgColor};${isOutlier ? 'border-left:3px solid #dc2626;' : ''}"
                     onclick="handleComparisonDrillDown('${drillType}', '${escJs(item.id || item.name)}', '${escJs(item.name || '')}')"
                     title="Click to drill into ${displayName}">
            <td style="font-weight:500;">
                <span>${displayName}</span>${outlierBadge}
                <div style="margin-top:2px;">${sparkline} ${trend}</div>
            </td>
            <td style="font-weight:600;">${s.total.toLocaleString()}</td>
            <td style="color:#dc2626;font-weight:600;">${s.K}</td>
            <td style="color:#f97316;font-weight:600;">${s.A}</td>
            <td style="background:#fef2f2;color:#dc2626;font-weight:700;">${s.ka}</td>
            <td style="font-weight:600;">${s.epdo.toLocaleString()}</td>
            <td style="color:#8b5cf6;">${s.ped}</td>
            <td style="color:#06b6d4;">${s.bike}</td>
            <td><span style="color:#3b82f6;font-size:1rem;" title="Drill down">&#8594;</span></td>
        </tr>`;
    });

    tbody.innerHTML = html;

    // Show expand button if truncated
    if (maxDisplay > 0 && items.length > maxDisplay) {
        const remaining = items.length - maxDisplay;
        tbody.innerHTML += `<tr id="${bodyId}_expandRow">
            <td colspan="9" style="text-align:center;padding:0.5rem;">
                <button class="btn-soft btn-soft-secondary btn-soft-sm" onclick="renderComparisonRows('${bodyId}', _lastComparisonItems['${bodyId}'], '${drillType}', 0); this.closest('tr').remove();">
                    Show ${remaining} more...
                </button>
            </td>
        </tr>`;
    }
}

/** Cache for expand/collapse of comparison table items */
const _lastComparisonItems = {};

/** Current sort state per comparison table */
const _comparisonSortState = {
    region: { key: 'epdo', asc: false },
    mpo: { key: 'epdo', asc: false },
    county: { key: 'epdo', asc: false }
};

/**
 * Sort and re-render a comparison table.
 * @param {string} tableType - 'region'|'mpo'|'county'
 * @param {string} sortKey - 'total'|'ka'|'epdo'|'ped'|'bike'
 */
function sortComparisonTable(tableType, sortKey) {
    const state = _comparisonSortState[tableType];
    if (state.key === sortKey) {
        state.asc = !state.asc;
    } else {
        state.key = sortKey;
        state.asc = false; // Default descending for numeric
    }

    const bodyId = `${tableType}ComparisonBody`;
    const items = _lastComparisonItems[bodyId];
    if (!items) return;

    items.sort((a, b) => {
        const va = a.stats[sortKey] || 0;
        const vb = b.stats[sortKey] || 0;
        return state.asc ? va - vb : vb - va;
    });

    const drillType = tableType === 'region' ? 'region' : tableType === 'mpo' ? 'mpo' : 'county';
    renderComparisonRows(bodyId, items, drillType, tableType === 'county' ? 20 : 0);
}

/**
 * Render footer totals for a comparison table.
 * @param {string} footerId - tfoot element ID
 * @param {Array} items - comparison items with stats
 */
function renderComparisonFooter(footerId, items) {
    const footer = document.getElementById(footerId);
    if (!footer || !items.length) return;

    const totals = { total: 0, K: 0, A: 0, ka: 0, epdo: 0, ped: 0, bike: 0 };
    items.forEach(item => {
        totals.total += item.stats.total;
        totals.K += item.stats.K;
        totals.A += item.stats.A;
        totals.ka += item.stats.ka;
        totals.epdo += item.stats.epdo;
        totals.ped += item.stats.ped;
        totals.bike += item.stats.bike;
    });

    footer.innerHTML = `<tr style="font-weight:700;background:#f8fafc;border-top:2px solid #e2e8f0;">
        <td>Total (${items.length})</td>
        <td>${totals.total.toLocaleString()}</td>
        <td style="color:#dc2626;">${totals.K}</td>
        <td style="color:#f97316;">${totals.A}</td>
        <td style="background:#fef2f2;color:#dc2626;">${totals.ka}</td>
        <td>${totals.epdo.toLocaleString()}</td>
        <td style="color:#8b5cf6;">${totals.ped}</td>
        <td style="color:#06b6d4;">${totals.bike}</td>
        <td></td>
    </tr>`;
}

/**
 * Render the Region Comparison Matrix (state tier only).
 */
function renderRegionComparisonTable() {
    const container = document.getElementById('regionComparisonContainer');
    if (!container) return;

    const tier = jurisdictionContext.viewTier;
    if (tier !== 'state' && tier !== 'federal') {
        container.style.display = 'none';
        return;
    }

    const regions = buildRegionComparison();
    if (!regions.length) {
        container.style.display = 'none';
        return;
    }

    container.style.display = '';

    // Set header using hierarchy labels
    const regionLabel = HierarchyRegistry.getRegionTypeLabel(true);
    const titleEl = document.getElementById('regionComparisonTitle');
    if (titleEl) titleEl.textContent = `${regionLabel} Comparison`;
    const colHeader = document.getElementById('regionComparisonColHeader');
    if (colHeader) colHeader.textContent = HierarchyRegistry.getRegionTypeLabel(false);

    // Sort by current sort state
    const sortState = _comparisonSortState.region;
    regions.sort((a, b) => {
        const va = a.stats[sortState.key] || 0;
        const vb = b.stats[sortState.key] || 0;
        return sortState.asc ? va - vb : vb - va;
    });

    _lastComparisonItems['regionComparisonBody'] = regions;
    renderComparisonRows('regionComparisonBody', regions, 'region');
    renderComparisonFooter('regionComparisonFooter', regions);

    const summary = document.getElementById('regionComparisonSummary');
    if (summary) summary.textContent = `${regions.length} ${regionLabel.toLowerCase()} with crash data. Click a row to drill into that ${HierarchyRegistry.getRegionTypeLabel(false).toLowerCase()}.`;
}

/**
 * Render the MPO Comparison Matrix (state tier only).
 */
function renderMPOComparisonTable() {
    const container = document.getElementById('mpoComparisonContainer');
    if (!container) return;

    const tier = jurisdictionContext.viewTier;
    if (tier !== 'state' && tier !== 'federal') {
        container.style.display = 'none';
        return;
    }

    const mpos = buildMPOComparison();
    if (!mpos.length) {
        container.style.display = 'none';
        return;
    }

    container.style.display = '';

    const tprLabel = HierarchyRegistry.getTPRTypeLabel(true);
    const titleEl = document.getElementById('mpoComparisonTitle');
    if (titleEl) titleEl.textContent = `${tprLabel} Comparison`;
    const colHeader = document.getElementById('mpoComparisonColHeader');
    if (colHeader) colHeader.textContent = HierarchyRegistry.getTPRTypeLabel(false);

    const sortState = _comparisonSortState.mpo;
    mpos.sort((a, b) => {
        const va = a.stats[sortState.key] || 0;
        const vb = b.stats[sortState.key] || 0;
        return sortState.asc ? va - vb : vb - va;
    });

    _lastComparisonItems['mpoComparisonBody'] = mpos;
    renderComparisonRows('mpoComparisonBody', mpos, 'mpo');
    renderComparisonFooter('mpoComparisonFooter', mpos);

    const summary = document.getElementById('mpoComparisonSummary');
    if (summary) summary.textContent = `${mpos.length} ${tprLabel.toLowerCase()} with crash data. Click a row to drill into that ${HierarchyRegistry.getTPRTypeLabel(false).toLowerCase()}.`;
}

/**
 * Render the County Comparison Table (state/region/MPO tiers).
 */
function renderCountyComparisonTable() {
    const container = document.getElementById('countyComparisonContainer');
    if (!container) return;

    const tier = jurisdictionContext.viewTier;
    if (tier === 'county' || tier === 'city') {
        container.style.display = 'none';
        return;
    }

    const { byJuris } = buildTierComparison();
    if (!Object.keys(byJuris).length) {
        container.style.display = 'none';
        return;
    }

    container.style.display = '';

    // Determine which counties to show based on tier
    let counties = Object.entries(byJuris).map(([name, stats]) => ({
        id: name, name, shortName: name, stats
    }));

    // For region tier, filter to member counties
    if (tier === 'region' && jurisdictionContext.tierRegion?.id) {
        const regionCounties = HierarchyRegistry.getCountiesInRegion(jurisdictionContext.tierRegion.id);
        if (regionCounties.length) {
            const memberNames = new Set(regionCounties.map(c => c.name.toLowerCase()));
            counties = counties.filter(c => {
                const normalized = c.name.toLowerCase().replace(/\s*(county|city|borough|parish|census area)\s*$/i, '').trim();
                return memberNames.has(normalized) || memberNames.has(c.name.toLowerCase());
            });
        }
    }

    // For MPO tier, filter to member jurisdictions
    if (tier === 'mpo' && jurisdictionContext.tierMpo?.id) {
        const mpoCounties = HierarchyRegistry.getCountiesInTPR(jurisdictionContext.tierMpo.id);
        if (mpoCounties.length) {
            const memberNames = new Set(mpoCounties.map(c => c.name.toLowerCase()));
            counties = counties.filter(c => {
                const normalized = c.name.toLowerCase().replace(/\s*(county|city|borough|parish|census area)\s*$/i, '').trim();
                return memberNames.has(normalized) || memberNames.has(c.name.toLowerCase());
            });
        }
    }

    // Set title based on tier
    const titleEl = document.getElementById('countyComparisonTitle');
    if (titleEl) {
        if (tier === 'state' || tier === 'federal') {
            titleEl.textContent = 'County/Jurisdiction Comparison';
        } else if (tier === 'region') {
            const regionName = jurisdictionContext.tierRegion?.shortName || jurisdictionContext.tierRegion?.name || 'Region';
            titleEl.textContent = `Counties in ${regionName}`;
        } else if (tier === 'mpo') {
            const mpoName = jurisdictionContext.tierMpo?.shortName || jurisdictionContext.tierMpo?.name || 'MPO';
            titleEl.textContent = `Member Jurisdictions — ${mpoName}`;
        }
    }

    // Sort
    const sortState = _comparisonSortState.county;
    counties.sort((a, b) => {
        const va = a.stats[sortState.key] || 0;
        const vb = b.stats[sortState.key] || 0;
        return sortState.asc ? va - vb : vb - va;
    });

    _lastComparisonItems['countyComparisonBody'] = counties;
    // State tier: show top 20 initially (may have 100+ counties). Other tiers: show all.
    const maxDisplay = (tier === 'state' || tier === 'federal') ? 20 : 0;
    renderComparisonRows('countyComparisonBody', counties, 'county', maxDisplay);
    renderComparisonFooter('countyComparisonFooter', counties);

    const summary = document.getElementById('countyComparisonSummary');
    if (summary) summary.textContent = `${counties.length} jurisdictions with crash data. Click a row to drill into that jurisdiction.`;
}

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.dashboard=CL.dashboard||{};
  CL.dashboard.tab=CL.dashboard.tab||{};
  window.buildTierComparison=buildTierComparison; CL.dashboard.tab.buildTierComparison=buildTierComparison;
  window.buildRegionComparison=buildRegionComparison; CL.dashboard.tab.buildRegionComparison=buildRegionComparison;
  window.buildMPOComparison=buildMPOComparison; CL.dashboard.tab.buildMPOComparison=buildMPOComparison;
  window.getComparisonRowColor=getComparisonRowColor; CL.dashboard.tab.getComparisonRowColor=getComparisonRowColor;
  window.buildComparisonSparkline=buildComparisonSparkline; CL.dashboard.tab.buildComparisonSparkline=buildComparisonSparkline;
  window.buildComparisonTrend=buildComparisonTrend; CL.dashboard.tab.buildComparisonTrend=buildComparisonTrend;
  window.renderComparisonRows=renderComparisonRows; CL.dashboard.tab.renderComparisonRows=renderComparisonRows;
  window.sortComparisonTable=sortComparisonTable; CL.dashboard.tab.sortComparisonTable=sortComparisonTable;
  window.renderComparisonFooter=renderComparisonFooter; CL.dashboard.tab.renderComparisonFooter=renderComparisonFooter;
  window.renderRegionComparisonTable=renderRegionComparisonTable; CL.dashboard.tab.renderRegionComparisonTable=renderRegionComparisonTable;
  window.renderMPOComparisonTable=renderMPOComparisonTable; CL.dashboard.tab.renderMPOComparisonTable=renderMPOComparisonTable;
  window.renderCountyComparisonTable=renderCountyComparisonTable; CL.dashboard.tab.renderCountyComparisonTable=renderCountyComparisonTable;
  window._tierNavHistory=_tierNavHistory; CL.dashboard.tab._tierNavHistory=_tierNavHistory;
  window._lastComparisonItems=_lastComparisonItems; CL.dashboard.tab._lastComparisonItems=_lastComparisonItems;
  CL._registerModule('dashboard/dashboard-tab-comparison');
})();
