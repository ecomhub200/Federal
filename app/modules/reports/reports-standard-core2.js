/**
 * CL reports.standardCore2 — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Systemwide exploration dashboard + enhanced findings.
 * Depends: core/epdo-presets, analysis/crash-profile (via window/CL mirrors).
 * Public API (dual exposure): window.<fn> ↔ CL.reports.standardCore2.<fn>
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Generate exploration dashboard with visual tiles for key safety categories
 */
function generateExplorationDashboard(crashes, categoryData) {
    const total = crashes.length;

    const tiles = [
        {
            icon: '💀', label: 'Fatal Crashes',
            value: categoryData.fatal.total,
            color: '#dc2626', bg: '#fef2f2', border: '#fca5a5',
            topLocation: getTopLocation(categoryData.fatal.byRoute)
        },
        {
            icon: '🚦', label: 'Intersection',
            value: categoryData.intersection.total,
            pct: pct(categoryData.intersection.total, total),
            ka: categoryData.intersection.K + categoryData.intersection.A,
            color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd',
            topLocation: getTopLocation(categoryData.intersection.byRoute)
        },
        {
            icon: '🚶', label: 'Pedestrian',
            value: categoryData.pedestrian.total,
            ka: categoryData.pedestrian.K + categoryData.pedestrian.A,
            color: '#2563eb', bg: '#eff6ff', border: '#93c5fd',
            topLocation: getTopLocation(categoryData.pedestrian.byRoute)
        },
        {
            icon: '🚴', label: 'Bicycle',
            value: categoryData.bicycle.total,
            ka: categoryData.bicycle.K + categoryData.bicycle.A,
            color: '#16a34a', bg: '#f0fdf4', border: '#86efac',
            topLocation: getTopLocation(categoryData.bicycle.byRoute)
        },
        {
            icon: '⚡', label: 'Speed-Related',
            value: categoryData.speed.total,
            pct: pct(categoryData.speed.total, total),
            ka: categoryData.speed.K + categoryData.speed.A,
            color: '#ea580c', bg: '#fff7ed', border: '#fdba74',
            topLocation: getTopLocation(categoryData.speed.byRoute)
        },
        {
            icon: '🌙', label: 'Nighttime',
            value: categoryData.nighttime.total,
            pct: pct(categoryData.nighttime.total, total),
            ka: categoryData.nighttime.K + categoryData.nighttime.A,
            color: '#4338ca', bg: '#eef2ff', border: '#a5b4fc',
            topLocation: getTopLocation(categoryData.nighttime.byRoute)
        },
        {
            icon: '🍺', label: 'Impaired',
            value: categoryData.impaired.total,
            ka: categoryData.impaired.K + categoryData.impaired.A,
            color: '#be185d', bg: '#fdf2f8', border: '#f9a8d4',
            topLocation: getTopLocation(categoryData.impaired.byRoute)
        }
    ];

    return `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:.75rem;margin-top:.75rem">
            ${tiles.map(t => `
                <div style="background:${t.bg};border:1px solid ${t.border};border-radius:8px;padding:.75rem;text-align:center">
                    <div style="font-size:1.5rem;margin-bottom:.25rem">${t.icon}</div>
                    <div style="font-size:1.4rem;font-weight:700;color:${t.color}">${t.value.toLocaleString()}</div>
                    <div style="font-size:.7rem;color:#64748b;font-weight:500">${t.label}</div>
                    ${t.pct ? `<div style="font-size:.65rem;color:#94a3b8">${t.pct}% of total</div>` : ''}
                    ${t.ka !== undefined && t.ka > 0 ? `<div style="font-size:.65rem;color:#dc2626;font-weight:500">${t.ka} K+A</div>` : ''}
                    ${t.topLocation ? `<div style="font-size:.6rem;color:#64748b;margin-top:.25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${esc(t.topLocation.name)}">Top: ${esc(truncateRoute(t.topLocation.name, 15))}</div>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Get top location from byRoute object
 */
// CC 328 BUG G — filter out blank/'Unknown'/'0' route names so the top-N
// renderers don't surface "Top: Unknown (4305)" when the leading bucket is
// an unmapped catch-all. State-agnostic.
function _isKnownLocationName(n) {
    if (!n) return false;
    const s = String(n).trim();
    return s !== '' && s !== '0' && s.toLowerCase() !== 'unknown';
}
function getTopLocation(byRoute) {
    const entries = Object.entries(byRoute).filter(([k]) => _isKnownLocationName(k));
    if (entries.length === 0) return null;
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    return { name: sorted[0][0], count: sorted[0][1] };
}

/**
 * Truncate route name for display
 */
function truncateRoute(name, maxLen) {
    if (!name) return '';
    // Remove S-VA prefix for cleaner display
    const clean = name.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || name;
    return clean.length > maxLen ? clean.substring(0, maxLen) + '...' : clean;
}

/**
 * Generate top locations by category for systemwide report
 */
function generateCategoryTopLocations(crashes, categoryData) {
    const topN = 5;

    // Helper to build top locations table for a category
    const buildTopTable = (title, icon, byRoute, color) => {
        // CC 328 BUG G — filter blank/'Unknown'/'0' route names from top-N.
        const sorted = Object.entries(byRoute)
            .filter(([k]) => _isKnownLocationName(k))
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN);

        if (sorted.length === 0) return '';

        return `
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.75rem">
                <h5 style="margin:0 0 .5rem 0;font-size:.85rem;color:${color};display:flex;align-items:center;gap:.35rem">
                    <span>${icon}</span> Top ${title} Locations
                </h5>
                <table style="width:100%;font-size:.75rem;border-collapse:collapse">
                    <thead>
                        <tr style="border-bottom:1px solid #e2e8f0">
                            <th style="text-align:left;padding:.25rem .35rem;color:#64748b">Location</th>
                            <th style="text-align:right;padding:.25rem .35rem;color:#64748b">Crashes</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${sorted.map(([route, count], idx) => `
                            <tr style="background:${idx % 2 === 0 ? '#fff' : '#f8fafc'}">
                                <td style="padding:.3rem .35rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:120px" title="${esc(route)}">${esc(truncateRoute(route, 25))}</td>
                                <td style="text-align:right;padding:.3rem .35rem;font-weight:600;color:${color}">${count}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    };

    return `
        <h4 style="display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem">
            <svg style="width:18px;height:18px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
            Top Crash Locations by Category
        </h4>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:.75rem">
            ${buildTopTable('Fatal', '💀', categoryData.fatal.byRoute, '#dc2626')}
            ${buildTopTable('Pedestrian', '🚶', categoryData.pedestrian.byRoute, '#2563eb')}
            ${buildTopTable('Bicycle', '🚴', categoryData.bicycle.byRoute, '#16a34a')}
            ${buildTopTable('Speed', '⚡', categoryData.speed.byRoute, '#ea580c')}
            ${buildTopTable('Intersection', '🚦', categoryData.intersection.byRoute, '#7c3aed')}
            ${buildTopTable('Nighttime', '🌙', categoryData.nighttime.byRoute, '#4338ca')}
        </div>
    `;
}

/**
 * Generate enhanced findings based on category analysis
 */
function generateEnhancedFindings(stats, crashes, categoryData) {
    const findings = [];
    const total = crashes.length;

    // Fatal crash finding
    if (categoryData.fatal.total > 0) {
        const topFatal = getTopLocation(categoryData.fatal.byRoute);
        findings.push({
            type: 'danger',
            text: `<strong>${categoryData.fatal.total} fatal crashes</strong> recorded. ${topFatal ? `Highest concentration: ${esc(truncateRoute(topFatal.name, 30))} (${topFatal.count} fatalities)` : ''}`
        });
    }

    // Pedestrian finding
    if (categoryData.pedestrian.total > 0) {
        const pedKARate = categoryData.pedestrian.total > 0
            ? ((categoryData.pedestrian.K + categoryData.pedestrian.A) / categoryData.pedestrian.total * 100).toFixed(1)
            : 0;
        findings.push({
            type: categoryData.pedestrian.K > 0 ? 'danger' : 'warning',
            text: `<strong>${categoryData.pedestrian.total} pedestrian crashes</strong> with ${pedKARate}% K+A rate (${categoryData.pedestrian.K} fatal, ${categoryData.pedestrian.A} serious injury)`
        });
    }

    // Bicycle finding
    if (categoryData.bicycle.total > 0) {
        findings.push({
            type: categoryData.bicycle.K > 0 ? 'danger' : 'info',
            text: `<strong>${categoryData.bicycle.total} bicycle crashes</strong> recorded${categoryData.bicycle.K > 0 ? ` including ${categoryData.bicycle.K} fatal` : ''}`
        });
    }

    // Speed finding
    if (categoryData.speed.total > 0) {
        const speedPct = pct(categoryData.speed.total, total);
        findings.push({
            type: speedPct > 15 ? 'warning' : 'info',
            text: `<strong>${categoryData.speed.total} speed-related crashes</strong> (${speedPct}% of total) with ${categoryData.speed.K + categoryData.speed.A} severe injuries`
        });
    }

    // Intersection finding
    if (categoryData.intersection.total > 0) {
        const intPct = pct(categoryData.intersection.total, total);
        findings.push({
            type: intPct > 40 ? 'warning' : 'info',
            text: `<strong>${categoryData.intersection.total} intersection crashes</strong> (${intPct}% of total) - primary focus area for signal and geometric improvements`
        });
    }

    // Nighttime finding
    if (categoryData.nighttime.total > 0) {
        const nightPct = pct(categoryData.nighttime.total, total);
        const nightKAPct = categoryData.nighttime.total > 0
            ? ((categoryData.nighttime.K + categoryData.nighttime.A) / categoryData.nighttime.total * 100).toFixed(1)
            : 0;
        if (nightPct > 25) {
            findings.push({
                type: 'warning',
                text: `<strong>${categoryData.nighttime.total} nighttime crashes</strong> (${nightPct}% of total) with ${nightKAPct}% K+A rate - consider lighting improvements`
            });
        }
    }

    // Impaired finding
    if (categoryData.impaired.total > 0 && categoryData.impaired.K > 0) {
        findings.push({
            type: 'danger',
            text: `<strong>${categoryData.impaired.total} impaired driving crashes</strong> including ${categoryData.impaired.K} fatalities - enforcement focus needed`
        });
    }

    return findings;
}

/**
 * Generate enhanced recommendations based on category analysis
 */
function generateEnhancedRecommendations(stats, crashes, categoryData) {
    const recs = [];

    // Fatal crash recommendations
    if (categoryData.fatal.total > 0) {
        recs.push({
            priority: 'high',
            icon: '💀',
            text: 'Conduct detailed fatal crash reviews at top locations to identify systemic issues and immediate countermeasures'
        });
    }

    // Pedestrian recommendations
    if (categoryData.pedestrian.total >= 5) {
        const topPed = getTopLocation(categoryData.pedestrian.byRoute);
        recs.push({
            priority: 'high',
            icon: '🚶',
            text: `Evaluate pedestrian facilities at high-crash corridors${topPed ? ` especially ${truncateRoute(topPed.name, 25)}` : ''} - consider RRFB, PHB, refuge islands, or enhanced crossings`
        });
    }

    // Bicycle recommendations
    if (categoryData.bicycle.total >= 3) {
        recs.push({
            priority: 'medium',
            icon: '🚴',
            text: 'Review bicycle infrastructure and consider protected bike lanes, bike boxes, or separated facilities at high-crash locations'
        });
    }

    // Speed recommendations
    if (categoryData.speed.total >= 10) {
        recs.push({
            priority: 'medium',
            icon: '⚡',
            text: 'Implement speed management strategies including traffic calming, speed feedback signs, or appropriate speed limit reviews'
        });
    }

    // Intersection recommendations
    if (categoryData.intersection.total > crashes.length * 0.4) {
        recs.push({
            priority: 'high',
            icon: '🚦',
            text: 'Focus intersection safety improvements including signal timing optimization, left-turn treatments, and geometric modifications'
        });
    }

    // Nighttime recommendations
    if (categoryData.nighttime.K + categoryData.nighttime.A > 5) {
        recs.push({
            priority: 'medium',
            icon: '🌙',
            text: 'Consider lighting improvements and enhanced delineation at locations with high nighttime crash severity'
        });
    }

    // Impaired driving recommendations
    if (categoryData.impaired.K > 0) {
        recs.push({
            priority: 'high',
            icon: '🍺',
            text: 'Coordinate with law enforcement for targeted impaired driving enforcement at high-crash corridors'
        });
    }

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return `
        <h4 style="display:flex;align-items:center;gap:.5rem">
            <svg style="width:18px;height:18px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            Recommended Actions
        </h4>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem">
            ${recs.map(r => `
                <div style="display:flex;align-items:flex-start;gap:.5rem;padding:.5rem .75rem;background:${r.priority === 'high' ? '#fef2f2' : r.priority === 'medium' ? '#fff7ed' : '#f8fafc'};border:1px solid ${r.priority === 'high' ? '#fca5a5' : r.priority === 'medium' ? '#fdba74' : '#e2e8f0'};border-radius:6px">
                    <span style="font-size:1.1rem">${r.icon}</span>
                    <div style="flex:1">
                        <span style="font-size:.65rem;font-weight:600;color:${r.priority === 'high' ? '#dc2626' : r.priority === 'medium' ? '#ea580c' : '#64748b'};text-transform:uppercase">${r.priority} Priority</span>
                        <div style="font-size:.8rem;color:#334155;margin-top:.15rem">${r.text}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ============================================================
// CC 324 BUGs G/H/I — matview-mode siblings
// ============================================================
// At aggregate tiers (county-rollup, region, MPO, PD, state, federal) the
// dashboard report runs with crashes = [] stub array. The row-iterating
// builders above return zeros. These siblings read window._reportMatviewData
// (populated by hydrateReportFromMatviews) so the same dashboard sections
// render real numbers without a 100K-row pull. State-agnostic.

/**
 * BUG G — Build the same shape as computeSystemwideCategoryData but from
 * already-fetched matviews. _M.safetyCategories carries one row per category
 * (mv_safety_categories); _M.safetyFocusLocations carries rows per (category,
 * location); _M.intersectionSummary carries rows per (intersection_type, ...).
 */
function computeSystemwideCategoryDataFromMatviews(_M) {
    const cats = {
        fatal:        { total: 0, byRoute: {}, K: 0, A: 0 },
        pedestrian:   { total: 0, byRoute: {}, K: 0, A: 0 },
        bicycle:      { total: 0, byRoute: {}, K: 0, A: 0 },
        speed:        { total: 0, byRoute: {}, K: 0, A: 0 },
        intersection: { total: 0, byRoute: {}, K: 0, A: 0 },
        nighttime:    { total: 0, byRoute: {}, K: 0, A: 0 },
        impaired:     { total: 0, byRoute: {}, K: 0, A: 0 }
    };

    // Top-level totals from the dashboard_summary roll-up (always present).
    cats.fatal.total      = (_M.bySeverity && _M.bySeverity.K) || 0;
    cats.fatal.K          = cats.fatal.total;
    cats.pedestrian.total = _M.ped || 0;
    cats.bicycle.total    = _M.bike || 0;
    cats.speed.total      = _M.speed || 0;
    cats.nighttime.total  = _M.night || 0;
    cats.impaired.total   = _M.alcohol || 0;

    // K/A per category from mv_safety_categories rows. Map matview category
    // label (lowercase) to our category key — defensive against label drift.
    const aliasMap = {
        pedestrian: 'pedestrian', ped: 'pedestrian',
        bicycle: 'bicycle', bike: 'bicycle',
        speed: 'speed', 'speed-related': 'speed', speeding: 'speed',
        nighttime: 'nighttime', night: 'nighttime',
        impaired: 'impaired', alcohol: 'impaired', dui: 'impaired',
        intersection: 'intersection',
        fatal: 'fatal'
    };
    // CC 329 — defensive Array.isArray guard. The `(_M.X || []).forEach`
    // pattern only saves us when `_M.X` is null/undefined; if some upstream
    // path stores a non-array truthy value (object wrapper, error payload),
    // `.forEach` throws and the entire report generation aborts. Hard-guard.
    (Array.isArray(_M.safetyCategories) ? _M.safetyCategories : []).forEach(row => {
        const label = String(row.category || row.category_name || '').toLowerCase().trim();
        const key = aliasMap[label];
        if (!key || !cats[key]) return;
        cats[key].K = Number(row.k || row.K || 0) || cats[key].K;
        cats[key].A = Number(row.a || row.A || 0) || cats[key].A;
        // Trust the matview total over the dashboard_summary roll-up when
        // present (more granular). Falls back to the existing top-level total.
        const matTotal = Number(row.total || row.total_crashes || 0);
        if (matTotal > 0) cats[key].total = matTotal;
    });

    // Intersection total — sum mv_intersection_summary rows excluding the
    // "Not at Intersection" sentinel. Matches Intersections-tab math.
    const _intRows = Array.isArray(_M.intersectionSummary) ? _M.intersectionSummary : [];
    let intTotal = 0, intK = 0, intA = 0;
    const intByRoute = {};
    _intRows.forEach(r => {
        const itype = String(r.intersection_type || '').toLowerCase();
        if (!itype || itype.includes('not at intersection') || itype.startsWith('0.')) return;
        intTotal += Number(r.total) || 0;
        intK += Number(r.k) || 0;
        intA += Number(r.a) || 0;
    });
    cats.intersection.total = intTotal;
    cats.intersection.K = intK;
    cats.intersection.A = intA;

    // Top locations per category from mv_safety_focus_locations rows. Used by
    // generateExplorationDashboard's `Top: …` footer on each tile, and reused
    // by generateCategoryTopLocationsFromMatviews below.
    (Array.isArray(_M.safetyFocusLocations) ? _M.safetyFocusLocations : []).forEach(row => {
        const label = String(row.category || row.category_name || '').toLowerCase().trim();
        const key = aliasMap[label];
        if (!key || !cats[key]) return;
        const name = row.location_name || row.rte_name || row.intersection_name || '';
        if (!name) return;
        const cnt = Number(row.total || row.total_crashes || 0) || 0;
        cats[key].byRoute[name] = (cats[key].byRoute[name] || 0) + cnt;
    });
    // Intersection top-locations: mv_intersection_summary doesn't carry
    // location names, but mv_safety_focus_locations may have an "intersection"
    // category. If empty, top-N falls back to topHotspots filtered by node.
    if (Object.keys(cats.intersection.byRoute).length === 0 && Array.isArray(_M.topHotspots)) {
        _M.topHotspots
            .filter(h => h && (h.node_id || h.intersection_name))
            .slice(0, 25)
            .forEach(h => {
                const name = h.intersection_name || (`Node ${h.node_id}`);
                const cnt = Number(h.total_crashes || 0) || 0;
                cats.intersection.byRoute[name] = (cats.intersection.byRoute[name] || 0) + cnt;
            });
    }

    return cats;
}

/**
 * BUG H — Top Crash Locations by Category in matview mode. Same HTML shape as
 * generateCategoryTopLocations, but the byRoute objects come pre-populated on
 * categoryData (built by computeSystemwideCategoryDataFromMatviews above).
 */
function generateCategoryTopLocationsFromMatviews(_M, categoryData) {
    // Delegate to the row-mode renderer — it only reads categoryData.{cat}.byRoute,
    // which is already populated from mv_safety_focus_locations. Keeps one HTML
    // template; the matview siblings just guarantee the data is there.
    return generateCategoryTopLocations([], categoryData);
}

/**
 * BUG I — Recommended Actions in matview mode. Uses _M.total instead of
 * crashes.length for the intersection-share threshold, otherwise identical to
 * the row-mode generator. Falls back to a clear gap-state if no recs trigger.
 */
function generateEnhancedRecommendationsFromMatviews(stats, _M, categoryData) {
    const recs = [];
    const totalCrashes = (_M && _M.total) || (stats && stats.total) || 0;

    if (categoryData.fatal.total > 0) {
        recs.push({ priority: 'high', icon: '💀',
            text: 'Conduct detailed fatal crash reviews at top locations to identify systemic issues and immediate countermeasures' });
    }
    if (categoryData.pedestrian.total >= 5) {
        const topPed = getTopLocation(categoryData.pedestrian.byRoute);
        recs.push({ priority: 'high', icon: '🚶',
            text: `Evaluate pedestrian facilities at high-crash corridors${topPed ? ` especially ${truncateRoute(topPed.name, 25)}` : ''} - consider RRFB, PHB, refuge islands, or enhanced crossings` });
    }
    if (categoryData.bicycle.total >= 3) {
        recs.push({ priority: 'medium', icon: '🚴',
            text: 'Review bicycle infrastructure and consider protected bike lanes, bike boxes, or separated facilities at high-crash locations' });
    }
    if (categoryData.speed.total >= 10) {
        recs.push({ priority: 'medium', icon: '⚡',
            text: 'Implement speed management strategies including traffic calming, speed feedback signs, or appropriate speed limit reviews' });
    }
    if (totalCrashes > 0 && categoryData.intersection.total > totalCrashes * 0.4) {
        recs.push({ priority: 'high', icon: '🚦',
            text: 'Focus intersection safety improvements including signal timing optimization, left-turn treatments, and geometric modifications' });
    }
    if (categoryData.nighttime.K + categoryData.nighttime.A > 5) {
        recs.push({ priority: 'medium', icon: '🌙',
            text: 'Consider lighting improvements and enhanced delineation at locations with high nighttime crash severity' });
    }
    if (categoryData.impaired.K > 0) {
        recs.push({ priority: 'high', icon: '🍺',
            text: 'Coordinate with law enforcement for targeted impaired driving enforcement at high-crash corridors' });
    }

    // Gap-state when nothing triggered (vanishingly rare at any populated tier).
    if (recs.length === 0) {
        return `
            <h4 style="display:flex;align-items:center;gap:.5rem">
                <svg style="width:18px;height:18px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
                Recommended Actions
            </h4>
            <p style="font-size:.85rem;color:#64748b;margin-top:.5rem">
                No deterministic recommendations triggered for this dataset. Detailed AI-generated recommendations available via AI Mode (enable in the header).
            </p>
        `;
    }

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    recs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return `
        <h4 style="display:flex;align-items:center;gap:.5rem">
            <svg style="width:18px;height:18px" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>
            Recommended Actions
        </h4>
        <div style="display:flex;flex-direction:column;gap:.5rem;margin-top:.5rem">
            ${recs.map(r => `
                <div style="display:flex;align-items:flex-start;gap:.5rem;padding:.5rem .75rem;background:${r.priority === 'high' ? '#fef2f2' : r.priority === 'medium' ? '#fff7ed' : '#f8fafc'};border:1px solid ${r.priority === 'high' ? '#fca5a5' : r.priority === 'medium' ? '#fdba74' : '#e2e8f0'};border-radius:6px">
                    <span style="font-size:1.1rem">${r.icon}</span>
                    <div style="flex:1">
                        <span style="font-size:.65rem;font-weight:600;color:${r.priority === 'high' ? '#dc2626' : r.priority === 'medium' ? '#ea580c' : '#64748b'};text-transform:uppercase">${r.priority} Priority</span>
                        <div style="font-size:.8rem;color:#334155;margin-top:.15rem">${r.text}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ─── CC 330 — generateComprehensiveReport extracted from app/index.html ───
// Per CLAUDE.md extract-on-touch policy (>100 LOC + material edits during
// the CC 330 hang fix). Three surgical changes vs the original L55349-55515:
//   1. Stub-array early-return — when the dispatcher hydrated empty {}
//      crashes from a matview, the per-row compute helpers spin on undefined
//      fields and Chart.js renders NaN. Surface a clear "switch tier" msg.
//   2. computeLocationDetails wrapped in Promise.race vs 6s — it issues a
//      network call per location and can stall on a slow upstream.
//   3. Each generateAISectionInsight wrapped in Promise.race vs 8s — the AI
//      API can hang past the 30s overlay watchdog; skip a section
//      gracefully instead of failing the whole report.
// State-agnostic.
async function generateComprehensiveReport(allCrashes, title, agency, department, author, startDate, endDate) {
    // Show progress UI
    document.getElementById('reportOutput').style.display = 'none';
    document.getElementById('infographicOutput').style.display = 'none';
    document.getElementById('comprehensiveReportOutput').style.display = 'block';
    document.getElementById('comprehensiveProgress').style.display = 'block';
    document.getElementById('comprehensivePreview').style.display = 'none';
    document.getElementById('comprehensiveTOC').style.display = 'none';
    document.getElementById('btnComprehensivePDF').disabled = true;
    document.getElementById('btnComprehensiveWord').disabled = true;
    document.getElementById('btnComprehensivePrint').disabled = true;

    const updateProgress = (percent, status) => {
        document.getElementById('comprehensiveProgressBar').style.width = `${percent}%`;
        document.getElementById('comprehensiveProgressStatus').textContent = status;
    };

    // CC 330 Fix 1 — stub-array detection. When the dispatcher hydrated
    // crashes from a matview, every row is an empty {} and the per-row
    // compute helpers below all silently return zeros, then renderer
    // hangs on NaN axes. The comprehensive report fundamentally needs
    // per-row data — render a clear graceful-degradation message.
    const _isStubArray = Array.isArray(allCrashes) && allCrashes.length > 0
        && allCrashes.every(r => !r || Object.keys(r).length === 0);
    if (_isStubArray) {
        updateProgress(100, 'Aggregate-tier data not available for the comprehensive report.');
        const prog = document.getElementById('comprehensiveProgress');
        if (prog) prog.style.display = 'none';
        const prev = document.getElementById('comprehensivePreview');
        if (prev) {
            prev.innerHTML =
                '<div style="padding:2rem;color:#6b7280;text-align:center;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;margin:1rem 0;">' +
                '<h3 style="color:#92400e;margin:0 0 .5rem 0;">Per-Row Data Required</h3>' +
                '<p>The Comprehensive Quarterly Report needs per-crash detail (collision type, weather, light conditions, day/hour, vulnerable-user flags). ' +
                'It cannot be generated at aggregate tiers (state, region, MPO, planning district).</p>' +
                '<p style="margin-top:.75rem;"><strong>Please switch to a county, route, or intersection scope to generate this report.</strong></p>' +
                '</div>';
            prev.style.display = 'block';
        }
        return;
    }

    try {
        updateProgress(5, 'Filtering crash data by date range...');

        // Filter crashes by date if specified
        let crashes = allCrashes.slice();
        if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
        if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));

        updateProgress(10, 'Computing crash statistics...');

        // Compute comprehensive statistics
        const stats = computeStats(crashes);
        const quarter = getQuarterLabel(startDate, endDate);
        const peakPatterns = computePeakPatterns(crashes);
        const factors = computeContributingFactors(crashes);
        const topLocations = computeTopLocations(crashes, 10);
        const trendData = computeTrendComparison(allCrashes, startDate, endDate);
        const focusTopic = determineFocusTopic(crashes, stats);

        updateProgress(20, 'Analyzing collision types...');

        // Compute detailed breakdowns
        const collisionBreakdown = computeCollisionBreakdown(crashes);
        const monthlyTrends = computeMonthlyTrends(crashes);
        const dayOfWeekAnalysis = computeDayOfWeekAnalysis(crashes);
        const hourlyDistribution = computeHourlyDistribution(crashes);
        const weatherImpact = computeWeatherImpact(crashes);
        const lightConditions = computeLightConditions(crashes);
        const vulnerableUsers = computeVulnerableUserAnalysis(crashes);

        updateProgress(25, 'Computing temporal patterns...');

        // NEW: Compute Day×Hour heat matrix for visualization
        const dayHourMatrix = computeDayHourMatrix(crashes);

        // NEW: Compute Quarter-over-Quarter comparison and historical totals
        const yoyComparison = computeYoYComparison(allCrashes, startDate, endDate);

        // NEW: Generate data-driven insights
        const dataInsights = generateDataInsight(crashes, collisionBreakdown, dayHourMatrix, lightConditions);

        updateProgress(35, 'Identifying high-priority locations...');

        // CC 330 Fix 2 — bound computeLocationDetails to 6s. It issues a
        // network call per location and can stall the entire report when
        // an upstream geocoder is slow. Fallback to empty details.
        const locationDetails = await Promise.race([
            computeLocationDetails(crashes, topLocations),
            new Promise(resolve => setTimeout(() => {
                console.warn('[Comprehensive Report] computeLocationDetails timed out at 6s — using empty details.');
                resolve([]);
            }, 6000))
        ]);

        updateProgress(50, 'Generating AI insights for executive summary...');

        // Generate AI insights for each section
        const apiKey = getGrantApiKey();
        let aiInsights = {};

        if (apiKey) {
            // CC 330 Fix 3 — wrap each AI call in Promise.race vs 8s.
            // generateAISectionInsight can hang on a slow LLM response; the
            // outer try/catch only catches sync throws, not stuck promises.
            // Skip a section gracefully instead of stalling the whole report.
            const aiCall = (section, ctx) => Promise.race([
                generateAISectionInsight(section, ctx),
                new Promise((_, reject) => setTimeout(
                    () => reject(new Error(`AI ${section} timed out at 8s`)), 8000))
            ]).catch(e => {
                console.warn(`[Comprehensive Report] AI ${section} skipped:`, e && e.message);
                return null;
            });

            aiInsights.executive = await aiCall('executive', {
                total: stats.total, K: stats.K, A: stats.A, B: stats.B, C: stats.C, O: stats.O,
                ped: stats.ped, bike: stats.bike, epdo: calcEPDO(stats),
                trend: trendData, quarter, agency
            });
            updateProgress(55, 'Generating AI insights for severity analysis...');

            aiInsights.severity = await aiCall('severity', {
                K: stats.K, A: stats.A, B: stats.B, C: stats.C, O: stats.O,
                total: stats.total, trend: trendData
            });
            updateProgress(60, 'Generating AI insights for location hotspots...');

            aiInsights.locations = await aiCall('locations', {
                topLocations: topLocations.slice(0, 5), total: stats.total
            });
            updateProgress(65, 'Generating AI insights for temporal patterns...');

            aiInsights.temporal = await aiCall('temporal', {
                peakPatterns, monthlyTrends, hourlyDistribution
            });
            updateProgress(70, 'Generating AI insights for safety focus...');

            aiInsights.focus = await aiCall('focus', {
                focusTopic, vulnerableUsers, factors
            });
            updateProgress(75, 'Finalizing AI analysis...');

            // NOTE: Countermeasures section removed per design requirements
        }

        updateProgress(85, 'Building report sections...');

        // Build report data structure - REDESIGNED for visual storytelling
        // Reduced from 20 pages to 14 pages with enhanced visualizations
        comprehensiveReportData = {
            metadata: {
                title, agency, department, author, quarter,
                startDate, endDate,
                generatedAt: new Date().toISOString(),
                crashCount: crashes.length,
                totalPages: 14
            },
            sections: [
                { page: 1, type: 'dashboard', title: 'Executive Dashboard', data: { stats, trendData, yoyComparison, dataInsights, topLocations: topLocations.slice(0, 3) } },
                { page: 2, type: 'toc', title: 'Table of Contents' },
                { page: 3, type: 'executive', title: 'Executive Summary', data: { stats, trendData, yoyComparison, aiInsight: aiInsights.executive } },
                { page: 4, type: 'temporal', title: 'Temporal Analysis', data: { peakPatterns, dayOfWeekAnalysis, hourlyDistribution, dayHourMatrix, aiInsight: aiInsights.temporal } },
                { page: 5, type: 'locations', title: 'High-Priority Locations', data: { locations: topLocations, collisionBreakdown, aiInsight: aiInsights.locations } },
                { page: 6, type: 'locationmap', title: 'Crash Concentration Map', data: { topLocations, crashes } },
                { page: 7, type: 'collision', title: 'Collision Analysis', data: { collisionBreakdown, stats } },
                { page: 8, type: 'severity', title: 'Severity Distribution', data: { stats, trendData, yoyComparison, aiInsight: aiInsights.severity } },
                { page: 9, type: 'factors', title: 'Contributing Factors', data: { factors, weatherImpact, lightConditions, stats } },
                { page: 10, type: 'vulnerable', title: 'Vulnerable Road Users', data: { vulnerableUsers, aiInsight: aiInsights.focus } },
                { page: 11, type: 'trends', title: 'Trends & Comparison', data: { monthlyTrends, trendData, yoyComparison } },
                { page: 12, type: 'priorities', title: 'Safety Priorities', data: { topLocations, stats, collisionBreakdown } },
                { page: 13, type: 'funding', title: 'Funding Opportunities', data: { stats, topLocations, vulnerableUsers } },
                { page: 14, type: 'appendix', title: 'Data & Methodology', data: { crashCount: crashes.length, startDate, endDate, stats } }
            ],
            rawData: { stats, trendData, peakPatterns, factors, topLocations, monthlyTrends,
                       dayOfWeekAnalysis, hourlyDistribution, weatherImpact, lightConditions,
                       vulnerableUsers, collisionBreakdown, focusTopic, dayHourMatrix, yoyComparison, dataInsights,
                       locationCoverage: calculateLocationCoverage(crashes) },
            aiInsights
        };

        updateProgress(95, 'Rendering preview...');

        // Render preview
        renderComprehensivePreview(comprehensiveReportData);
        renderComprehensiveTOC(comprehensiveReportData);

        updateProgress(100, 'Report ready!');

        // Show results
        setTimeout(() => {
            document.getElementById('comprehensiveProgress').style.display = 'none';
            document.getElementById('comprehensivePreview').style.display = 'block';
            document.getElementById('comprehensiveTOC').style.display = 'block';
            document.getElementById('btnComprehensivePDF').disabled = false;
            document.getElementById('btnComprehensiveWord').disabled = false;
            document.getElementById('btnComprehensivePrint').disabled = false;
        }, 500);

    } catch (e) {
        console.error('[Comprehensive Report] Error:', e);
        updateProgress(0, 'Error generating report: ' + e.message);
        document.getElementById('comprehensiveProgressTitle').textContent = 'Error';
        document.getElementById('comprehensiveProgressTitle').style.color = '#dc2626';
    }

    hideLoading();
}
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.reports = CL.reports || {};
  CL.reports.standardCore2 = CL.reports.standardCore2 || {};
  window.generateComprehensiveReport = generateComprehensiveReport; CL.reports.standardCore2.generateComprehensiveReport = generateComprehensiveReport;
  window.generateExplorationDashboard = generateExplorationDashboard; CL.reports.standardCore2.generateExplorationDashboard = generateExplorationDashboard;
  window.getTopLocation = getTopLocation; CL.reports.standardCore2.getTopLocation = getTopLocation;
  window.truncateRoute = truncateRoute; CL.reports.standardCore2.truncateRoute = truncateRoute;
  window.generateCategoryTopLocations = generateCategoryTopLocations; CL.reports.standardCore2.generateCategoryTopLocations = generateCategoryTopLocations;
  window.generateEnhancedFindings = generateEnhancedFindings; CL.reports.standardCore2.generateEnhancedFindings = generateEnhancedFindings;
  window.generateEnhancedRecommendations = generateEnhancedRecommendations; CL.reports.standardCore2.generateEnhancedRecommendations = generateEnhancedRecommendations;
  // CC 324 BUGs G/H/I — matview-mode siblings
  window.computeSystemwideCategoryDataFromMatviews = computeSystemwideCategoryDataFromMatviews; CL.reports.standardCore2.computeSystemwideCategoryDataFromMatviews = computeSystemwideCategoryDataFromMatviews;
  window.generateCategoryTopLocationsFromMatviews = generateCategoryTopLocationsFromMatviews; CL.reports.standardCore2.generateCategoryTopLocationsFromMatviews = generateCategoryTopLocationsFromMatviews;
  window.generateEnhancedRecommendationsFromMatviews = generateEnhancedRecommendationsFromMatviews; CL.reports.standardCore2.generateEnhancedRecommendationsFromMatviews = generateEnhancedRecommendationsFromMatviews;
  CL._registerModule('reports/reports-standard-core2');
})();
