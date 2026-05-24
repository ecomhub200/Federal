/**
 * CL reports.standardCore2 — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Systemwide exploration dashboard + enhanced findings.
 * Depends: core/epdo-presets, analysis/crash-profile (via window/CL mirrors).
 * Public API (dual exposure): window.<fn> ↔ CL.reports.standardCore2.<fn>
 */
'use strict';
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
function getTopLocation(byRoute) {
    const entries = Object.entries(byRoute);
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
        const sorted = Object.entries(byRoute)
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
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.reports = CL.reports || {};
  CL.reports.standardCore2 = CL.reports.standardCore2 || {};
  window.generateExplorationDashboard = generateExplorationDashboard; CL.reports.standardCore2.generateExplorationDashboard = generateExplorationDashboard;
  window.getTopLocation = getTopLocation; CL.reports.standardCore2.getTopLocation = getTopLocation;
  window.truncateRoute = truncateRoute; CL.reports.standardCore2.truncateRoute = truncateRoute;
  window.generateCategoryTopLocations = generateCategoryTopLocations; CL.reports.standardCore2.generateCategoryTopLocations = generateCategoryTopLocations;
  window.generateEnhancedFindings = generateEnhancedFindings; CL.reports.standardCore2.generateEnhancedFindings = generateEnhancedFindings;
  window.generateEnhancedRecommendations = generateEnhancedRecommendations; CL.reports.standardCore2.generateEnhancedRecommendations = generateEnhancedRecommendations;
CL._registerModule('reports/reports-standard-core2');
