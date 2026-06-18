/**
 * CL reports.cm — countermeasures + intersection/hotspot/dashboard report generators
 * Extracted verbatim from app/index.html (countermeasures band, prompt 42d-a,
 * size-split). NO behavior change. Dual-exposed window.<fn> + CL.reports.cm.<fn>.
 * Depends (resolved at call time via global scope): docx, MEMO_STYLES, COL,
 * crashState, and report helpers that remain inline.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
function generateCountermeasuresReport(crashes, route, title, author) {
    const locationName = route || 'System-Wide';
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();

    // Set report header
    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `${locationName} • ${getJurisdictionStateLabel()}`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // Update footer and report ID with crash count
    updateReportFooter(yearRange, reportId, crashes.length);

    // Show Table of Contents
    showTableOfContents('countermeasures');

    // Show executive summary
    const stats = computeStats(crashes);
    showExecutiveSummary(stats, crashes, 'countermeasures analysis', locationName);
    
    // Calculate crash profile
    const severities = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    const collisionTypes = {};
    const factors = { pedestrian: 0, bicycle: 0, nighttime: 0, speed: 0, wetRoad: 0, alcohol: 0 };
    
    crashes.forEach(row => {
        const sev = row[COL.SEVERITY] || 'O';
        severities[sev] = (severities[sev] || 0) + 1;
        
        const colType = row[COL.COLLISION] || 'Unknown';
        collisionTypes[colType] = (collisionTypes[colType] || 0) + 1;
        
        if (row[COL.PED] === 'Y' || row[COL.PED] === '1') factors.pedestrian++;
        if (row[COL.BIKE] === 'Y' || row[COL.BIKE] === '1') factors.bicycle++;
        if (row[COL.ALCOHOL] === 'Y' || row[COL.ALCOHOL] === '1') factors.alcohol++;
        
        const light = (row[COL.LIGHT] || '').toLowerCase();
        if (light.includes('dark') || light.includes('night')) factors.nighttime++;
        
        const surface = (row[COL.SURFACE] || '').toLowerCase();
        if (surface.includes('wet') || surface.includes('rain') || surface.includes('snow')) factors.wetRoad++;
    });
    
    const total = crashes.length;
    const epdo = calcEPDO(severities);
    
    // KPIs
    document.getElementById('rptKPIs').innerHTML = `
        <div class="kpi-card total"><div class="kpi-value">${total.toLocaleString()}</div><div class="kpi-label">Total Crashes</div></div>
        <div class="kpi-card fatal"><div class="kpi-value">${severities.K}</div><div class="kpi-label">Fatal (K)</div></div>
        <div class="kpi-card serious"><div class="kpi-value">${severities.A}</div><div class="kpi-label">Serious (A)</div></div>
        <div class="kpi-card injury"><div class="kpi-value">${severities.B + severities.C}</div><div class="kpi-label">Injury (B+C)</div></div>
        <div class="kpi-card pdo"><div class="kpi-value">${severities.O}</div><div class="kpi-label">PDO (O)</div></div>
        <div class="kpi-card epdo"><div class="kpi-value">${epdo.toLocaleString()}</div><div class="kpi-label">EPDO Score</div></div>
    `;
    
    // Findings - Crash Profile
    const topTypes = Object.entries(collisionTypes).sort((a, b) => b[1] - a[1]).slice(0, 5);
    document.getElementById('rptFindings').innerHTML = `
        <h3>📊 Crash Profile Analysis</h3>
        <div class="two-col">
            <div>
                <h4>Primary Crash Types</h4>
                <table class="report-table">
                    <thead><tr><th>Collision Type</th><th>Count</th><th>Percentage</th></tr></thead>
                    <tbody>
                        ${topTypes.map(([type, count]) => `
                            <tr><td>${type}</td><td>${count}</td><td>${(count/total*100).toFixed(1)}%</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div>
                <h4>Contributing Factors</h4>
                <table class="report-table">
                    <thead><tr><th>Factor</th><th>Count</th><th>Percentage</th></tr></thead>
                    <tbody>
                        <tr><td>🚶 Pedestrian Involved</td><td>${factors.pedestrian}</td><td>${(factors.pedestrian/total*100).toFixed(1)}%</td></tr>
                        <tr><td>🚴 Bicycle Involved</td><td>${factors.bicycle}</td><td>${(factors.bicycle/total*100).toFixed(1)}%</td></tr>
                        <tr><td>🌙 Nighttime</td><td>${factors.nighttime}</td><td>${(factors.nighttime/total*100).toFixed(1)}%</td></tr>
                        <tr><td>🌧️ Wet Road</td><td>${factors.wetRoad}</td><td>${(factors.wetRoad/total*100).toFixed(1)}%</td></tr>
                        <tr><td>🍺 Alcohol</td><td>${factors.alcohol}</td><td>${(factors.alcohol/total*100).toFixed(1)}%</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // Get countermeasure recommendations
    if (!cmfState.loaded) {
        document.getElementById('rptCountermeasures').innerHTML = `
            <h3>💡 Recommended Countermeasures</h3>
            <p style="color:var(--danger)">CMF database not loaded. Please refresh the page.</p>
        `;
        document.getElementById('rptYearlySection').innerHTML = '';
        document.getElementById('rptChartsSection').innerHTML = '';
        document.getElementById('rptTablesSection').innerHTML = '';
        document.getElementById('rptRecommendations').innerHTML = '';
        return;
    }
    
    // Build crash type tags for matching
    const crashTypeTags = ['all'];
    const collisionMap = {
        'Angle': 'angle', 'Rear End': 'rear_end', 'Rear-end': 'rear_end',
        'Head On': 'head_on', 'Sideswipe': 'sideswipe', 'Fixed Object': 'run_off_road',
        'Left Turn': 'left_turn', 'Right Turn': 'right_turn'
    };
    
    topTypes.forEach(([type]) => {
        for (const [key, tag] of Object.entries(collisionMap)) {
            if (type.toLowerCase().includes(key.toLowerCase())) {
                crashTypeTags.push(tag);
            }
        }
    });
    
    if (factors.pedestrian / total > 0.03) crashTypeTags.push('pedestrian');
    if (factors.bicycle / total > 0.03) crashTypeTags.push('bicycle');
    if (factors.nighttime / total > 0.25) crashTypeTags.push('nighttime');
    if (factors.wetRoad / total > 0.15) crashTypeTags.push('wet_road');
    
    // Find matching countermeasures
    const matchedCMFs = cmfState.database
        .filter(cmf => cmf.rating >= 3)
        .map(cmf => {
            let score = 0;
            const matches = cmf.crashTypes.filter(t => crashTypeTags.includes(t));
            score += matches.length * 20;
            if (matches.some(t => t !== 'all')) score += 30;
            score += cmf.rating * 5;
            if (cmf.isProven) score += 25;
            if (cmf.inHSM) score += 15;
            if (cmf.crfPct > 0) score += cmf.crfPct / 2;
            
            const expectedReduction = Math.round(total * (1 - cmf.cmf) * 10) / 10;
            return { ...cmf, score, expectedReduction };
        })
        .filter(cmf => cmf.score > 30)
        .sort((a, b) => b.score - a.score);
    
    // Remove duplicates
    const seen = new Set();
    const topCMFs = matchedCMFs.filter(cmf => {
        if (seen.has(cmf.name)) return false;
        seen.add(cmf.name);
        return true;
    }).slice(0, 15);
    
    // Count special types
    const provenCount = topCMFs.filter(c => c.isProven).length;
    const hsmCount = topCMFs.filter(c => c.inHSM).length;
    
    document.getElementById('rptCountermeasures').innerHTML = `
        <h3>💡 Recommended Safety Countermeasures</h3>
        <p style="margin-bottom:1rem;color:var(--gray)">
            Based on the crash profile analysis, the following countermeasures are recommended from the 
            <a href="https://www.cmfclearinghouse.org" target="_blank">FHWA CMF Clearinghouse</a>.
            ${provenCount > 0 ? `<span style="color:#059669;font-weight:600"> Includes ${provenCount} FHWA Proven Safety Countermeasures.</span>` : ''}
        </p>
        <table class="report-table">
            <thead>
                <tr>
                    <th style="width:35%">Countermeasure</th>
                    <th style="width:15%">Category</th>
                    <th style="width:10%">CMF</th>
                    <th style="width:12%">Reduction</th>
                    <th style="width:10%">Rating</th>
                    <th style="width:8%">Badges</th>
                    <th style="width:10%">Est. Reduction</th>
                </tr>
            </thead>
            <tbody>
                ${topCMFs.map(cmf => `
                    <tr>
                        <td><strong>${cmf.name}</strong></td>
                        <td>${cmf.category}</td>
                        <td>${cmf.cmf.toFixed(2)}</td>
                        <td style="color:${cmf.crfPct > 0 ? '#059669' : '#dc2626'};font-weight:600">${cmf.crfPct > 0 ? cmf.crfPct.toFixed(0) + '%' : '+' + Math.abs(cmf.crfPct).toFixed(0) + '%'}</td>
                        <td>${'★'.repeat(cmf.rating)}${'☆'.repeat(5-cmf.rating)}</td>
                        <td>
                            ${cmf.isProven ? '<span style="background:#059669;color:white;padding:1px 4px;border-radius:3px;font-size:.65rem">PROVEN</span>' : ''}
                            ${cmf.inHSM ? '<span style="background:#2563eb;color:white;padding:1px 4px;border-radius:3px;font-size:.65rem">HSM</span>' : ''}
                        </td>
                        <td style="color:#059669;font-weight:600">${cmf.expectedReduction > 0 ? '~' + cmf.expectedReduction.toFixed(1) + ' crashes' : '-'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <p style="margin-top:.75rem;font-size:.8rem;color:var(--gray)">
            <strong>Note:</strong> CMF (Crash Modification Factor) values less than 1.0 indicate crash reduction. 
            Expected reduction is calculated as: Current Crashes × (1 - CMF).
        </p>
    `;
    
    // Recommendations section
    document.getElementById('rptRecommendations').innerHTML = `
        <h3>📌 Implementation Recommendations</h3>
        <div style="background:var(--light);padding:1rem;border-radius:var(--radius);margin-bottom:1rem">
            <h4 style="color:var(--primary);margin-bottom:.5rem">Priority Actions</h4>
            <ol style="margin-left:1.5rem;line-height:1.8">
                ${topCMFs.slice(0, 5).map(cmf => `
                    <li><strong>${cmf.name}</strong> - Expected ${cmf.crfPct.toFixed(0)}% reduction in ${cmf.crashTypes.filter(t => t !== 'all').join(', ') || 'all'} crashes
                    ${cmf.isProven ? '(FHWA Proven)' : ''}</li>
                `).join('')}
            </ol>
        </div>
        <div class="two-col">
            <div style="background:#dcfce7;padding:1rem;border-radius:var(--radius)">
                <h4 style="color:#059669;margin-bottom:.5rem">✅ FHWA Proven Countermeasures</h4>
                <p style="font-size:.85rem">These countermeasures have strong evidence of effectiveness and are eligible for HSIP funding:</p>
                <ul style="margin-left:1.5rem;margin-top:.5rem;font-size:.85rem">
                    ${topCMFs.filter(c => c.isProven).slice(0, 5).map(cmf => `<li>${cmf.name}</li>`).join('') || '<li>None in top recommendations</li>'}
                </ul>
            </div>
            <div style="background:#dbeafe;padding:1rem;border-radius:var(--radius)">
                <h4 style="color:#2563eb;margin-bottom:.5rem">📘 Highway Safety Manual CMFs</h4>
                <p style="font-size:.85rem">These CMFs are from the AASHTO Highway Safety Manual:</p>
                <ul style="margin-left:1.5rem;margin-top:.5rem;font-size:.85rem">
                    ${topCMFs.filter(c => c.inHSM).slice(0, 5).map(cmf => `<li>${cmf.name}</li>`).join('') || '<li>None in top recommendations</li>'}
                </ul>
            </div>
        </div>
    `;
    
    // Clear unused sections
    document.getElementById('rptYearlySection').innerHTML = '';
    document.getElementById('rptChartsSection').innerHTML = '';
    document.getElementById('rptTablesSection').innerHTML = '';
}

function generateIntersectionReport(crashes, route, title, author) {
    generateCorridorReport(crashes, route || 'All Intersections', title + ' - Intersection Analysis', author);
}

function generateHotspotReport() {
    document.getElementById('reportType').value = 'hotspot';

    // Include filter info in report title
    let reportTitle = 'High-Crash Location Analysis';
    if (hotspotFilters.startDate || hotspotFilters.endDate) {
        let dateRange = '';
        if (hotspotFilters.startDate) dateRange += hotspotFilters.startDate;
        if (hotspotFilters.startDate && hotspotFilters.endDate) dateRange += ' to ';
        if (hotspotFilters.endDate) dateRange += hotspotFilters.endDate;
        reportTitle += ` (${dateRange})`;
    }
    document.getElementById('reportTitle').value = reportTitle;

    showTab('reports');
    setTimeout(generateReport, 100);
}

// ============================================================
// NEW REPORT GENERATORS (Phase 2)
// ============================================================

/**
 * Executive Dashboard Summary Report
 * Maps to: Dashboard tab | Replaces systemwide report
 */
function generateDashboardReport(crashes, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const _M = window._reportMatviewData;
    let yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    // CC 324 BUG D — getDateRange() returns '--' when crashes is a hydrated
    // stub array (every row blank). Derive a meaningful range from matview
    // byYear keys so the header/footer never renders "Period: --".
    if (yearRange === '--' || yearRange === '' || yearRange == null) {
        const ys = (_M && _M.byYear) ? Object.keys(_M.byYear).map(Number).filter(n => n > 1900).sort() : [];
        yearRange = ys.length ? `All Years (${ys[0]}–${ys[ys.length - 1]})` : 'All Years';
    }
    const reportId = generateReportId();
    const epdo = calcEPDO(stats);
    const kaRate = stats.total > 0 ? ((stats.K + stats.A) / stats.total * 100).toFixed(1) : '0.0';

    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `${getJurisdictionLabel()} Executive Dashboard Summary`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, crashes, 'executive dashboard summary', getJurisdictionLabel());
    showTableOfContents('dashboard');

    // CC 324 BUG G — when matview-hydrated, build category data from the
    // already-fetched matviews instead of iterating empty stub rows. The
    // sibling reads _M.safetyCategories + _M.intersectionSummary so Safety
    // Focus Exploration tiles, Top Locations, and Recommendations all render
    // real numbers at aggregate tiers.
    const categoryData = (_M && typeof computeSystemwideCategoryDataFromMatviews === 'function')
        ? computeSystemwideCategoryDataFromMatviews(_M)
        : computeSystemwideCategoryData(crashes);

    // KPIs - 8 key metrics
    // Round 23 §1.3 — prefer matview totals when generator was hydrated from
    // matviews. Falls back to per-row iteration for the legacy row-pull path.
    const nightCount = (_M && _M.night != null) ? _M.night : crashes.filter(r => isYes(r[COL.NIGHT])).length;
    const speedCount = (_M && _M.speed != null) ? _M.speed : crashes.filter(r => isYes(r[COL.SPEED])).length;
    // CC 324 BUG C — wrap all integer KPI values in .toLocaleString() so the
    // strip matches the comma-formatted Total Crashes / EPDO siblings.
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5">
            <div class="value" style="color:#dc2626">${stats.K.toLocaleString()}</div><div class="label">Fatal (K)</div>
        </div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fdba74">
            <div class="value" style="color:#ea580c">${stats.A.toLocaleString()}</div><div class="label">Serious Injury (A)</div>
        </div>
        <div class="report-kpi">
            <div class="value">${stats.total.toLocaleString()}</div><div class="label">Total Crashes</div>
        </div>
        <div class="report-kpi">
            <div class="value">${kaRate}%</div><div class="label">K+A Rate</div>
        </div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #c4b5fd">
            <div class="value" style="color:#7c3aed">${epdo.toLocaleString()}</div><div class="label">EPDO Score</div>
        </div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #93c5fd">
            <div class="value" style="color:#2563eb">${(stats.ped + stats.bike).toLocaleString()}</div><div class="label">VRU Crashes</div>
        </div>
        <div class="report-kpi">
            <div class="value">${speedCount.toLocaleString()}</div><div class="label">Speed-Related</div>
        </div>
        <div class="report-kpi">
            <div class="value">${nightCount.toLocaleString()}</div><div class="label">Nighttime</div>
        </div>
    `;

    // Severity Distribution & EPDO Breakdown
    const sevRows = ['K','A','B','C','O'].map(s => {
        const cnt = stats[s];
        const pctVal = stats.total > 0 ? (cnt / stats.total * 100).toFixed(1) : '0.0';
        const epdoVal = cnt * EPDO_WEIGHTS[s];
        const epdoPct = epdo > 0 ? (epdoVal / epdo * 100).toFixed(1) : '0.0';
        return `<tr><td><strong>${s}</strong></td><td>${cnt.toLocaleString()}</td><td>${pctVal}%</td><td>${EPDO_WEIGHTS[s]}</td><td>${epdoVal.toLocaleString()}</td><td>${epdoPct}%</td></tr>`;
    }).join('');

    document.getElementById('rptFindings').innerHTML = `
        <h4>Severity Distribution & EPDO Breakdown</h4>
        <table class="report-table">
            <thead><tr><th>Severity</th><th>Count</th><th>% of Total</th><th>EPDO Weight</th><th>EPDO Value</th><th>% of EPDO</th></tr></thead>
            <tbody>${sevRows}
                <tr style="font-weight:bold;background:#f1f5f9"><td>Total</td><td>${stats.total.toLocaleString()}</td><td>100%</td><td>-</td><td>${epdo.toLocaleString()}</td><td>100%</td></tr>
            </tbody>
        </table>
    `;

    // Year-Over-Year Comparison
    // CC 324 BUG E — extended hydrateReportFromMatviews() now produces
    // _M.byYearDetail with per-year K/A/B/C/O + ped + bike (rolled up from
    // dashboard_summary tuples). Prefer that over the year-only _M.byYear so
    // the YoY table shows non-zero severity/VRU columns at aggregate tiers.
    const byYear = {};
    if (_M && _M.byYearDetail && Object.keys(_M.byYearDetail).length > 0) {
        Object.entries(_M.byYearDetail).forEach(([y, d]) => { byYear[y] = d; });
    } else if (_M && _M.byYear && Object.keys(_M.byYear).length > 0) {
        // Backwards-compatible fallback if a stale hydrator skipped byYearDetail.
        Object.entries(_M.byYear).forEach(([y, total]) => {
            byYear[y] = { total: Number(total) || 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
        });
    } else {
        crashes.forEach(r => {
            const y = r[COL.YEAR] || 'Unknown';
            if (!byYear[y]) byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
            byYear[y].total++;
            const s = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (['K','A','B','C','O'].includes(s)) byYear[y][s]++;
            if (isYes(r[COL.PED])) byYear[y].ped++;
            if (isYes(r[COL.BIKE])) byYear[y].bike++;
        });
    }
    const years = Object.keys(byYear).filter(y => y !== 'Unknown').sort();
    const yearRows = years.map((y, i) => {
        const d = byYear[y];
        const prevTotal = i > 0 ? byYear[years[i-1]].total : null;
        const trend = prevTotal ? (d.total > prevTotal ? '<span style="color:#dc2626">↑</span>' : d.total < prevTotal ? '<span style="color:#16a34a">↓</span>' : '<span style="color:#6b7280">→</span>') : '-';
        const yEpdo = calcEPDO(d);
        return `<tr><td><strong>${y}</strong></td><td>${d.total.toLocaleString()}</td><td>${(d.K||0).toLocaleString()}</td><td>${(d.A||0).toLocaleString()}</td><td>${((d.K||0) + (d.A||0)).toLocaleString()}</td><td>${yEpdo.toLocaleString()}</td><td>${(d.ped||0).toLocaleString()}</td><td>${(d.bike||0).toLocaleString()}</td><td>${trend}</td></tr>`;
    }).join('');

    document.getElementById('rptYearlySection').innerHTML = `
        <h4>Year-Over-Year Comparison</h4>
        <table class="report-table">
            <thead><tr><th>Year</th><th>Total</th><th>K</th><th>A</th><th>K+A</th><th>EPDO</th><th>Ped</th><th>Bike</th><th>Trend</th></tr></thead>
            <tbody>${yearRows}</tbody>
        </table>
    `;

    // Quick Facts Panel + Safety Focus Exploration
    // CC 324 BUG F — derive intersection count in matview mode from
    // _M.intersectionSummary (rows from mv_intersection_summary, each row =
    // {intersection_type, total, ...}). Sum totals where intersection_type
    // isn't the "Not at Intersection" sentinel. State-agnostic — matches the
    // Intersections tab's ~57.9% share at Sussex.
    let intCount;
    if (_M) {
        const _intRows = Array.isArray(_M.intersectionSummary) ? _M.intersectionSummary : [];
        intCount = _intRows.reduce((sum, r) => {
            const itype = String(r.intersection_type || '').toLowerCase();
            if (!itype || itype.includes('not at intersection') || itype.startsWith('0.')) return sum;
            return sum + (Number(r.total) || 0);
        }, 0);
    } else {
        intCount = crashes.filter(r => isIntersection(r)).length;
    }
    const explorationHtml = generateExplorationDashboard(crashes, categoryData);
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4>Quick Facts Panel</h4>
            <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:.75rem;margin-bottom:1.5rem">
                <div style="text-align:center;padding:.75rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                    <div style="font-size:1.2rem;font-weight:700;color:#0891b2">${stats.total > 0 ? (stats.ped/stats.total*100).toFixed(1) : 0}%</div>
                    <div style="font-size:.75rem;color:#64748b">Pedestrian</div>
                </div>
                <div style="text-align:center;padding:.75rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                    <div style="font-size:1.2rem;font-weight:700;color:#059669">${stats.total > 0 ? (stats.bike/stats.total*100).toFixed(1) : 0}%</div>
                    <div style="font-size:.75rem;color:#64748b">Bicycle</div>
                </div>
                <div style="text-align:center;padding:.75rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                    <div style="font-size:1.2rem;font-weight:700;color:#7c3aed">${stats.total > 0 ? (intCount/stats.total*100).toFixed(1) : 0}%</div>
                    <div style="font-size:.75rem;color:#64748b">Intersection</div>
                </div>
                <div style="text-align:center;padding:.75rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                    <div style="font-size:1.2rem;font-weight:700;color:#4338ca">${stats.total > 0 ? (nightCount/stats.total*100).toFixed(1) : 0}%</div>
                    <div style="font-size:.75rem;color:#64748b">Nighttime</div>
                </div>
                <div style="text-align:center;padding:.75rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                    <div style="font-size:1.2rem;font-weight:700;color:#92400e">${stats.total > 0 ? (speedCount/stats.total*100).toFixed(1) : 0}%</div>
                    <div style="font-size:.75rem;color:#64748b">Speed-Related</div>
                </div>
            </div>
        </div>
        <div class="report-section" style="grid-column:1/-1">
            <h4>Safety Focus Exploration</h4>
            ${explorationHtml}
        </div>
    `;

    // Top Locations
    // CC 324 BUG H/I — at aggregate tiers the row-iterating builders produce
    // empty sections; prefer matview-mode siblings when _M is present so the
    // sections always render real numbers.
    document.getElementById('rptTablesSection').innerHTML =
        (_M && typeof generateCategoryTopLocationsFromMatviews === 'function')
            ? generateCategoryTopLocationsFromMatviews(_M, categoryData)
            : generateCategoryTopLocations(crashes, categoryData);

    // Recommendations
    document.getElementById('rptRecommendations').innerHTML =
        (_M && typeof generateEnhancedRecommendationsFromMatviews === 'function')
            ? generateEnhancedRecommendationsFromMatviews(stats, _M, categoryData)
            : generateEnhancedRecommendations(stats, crashes, categoryData);
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.cm = CL.reports.cm || {};
  window.generateCountermeasuresReport = generateCountermeasuresReport; CL.reports.cm.generateCountermeasuresReport = generateCountermeasuresReport;
  window.generateIntersectionReport = generateIntersectionReport; CL.reports.cm.generateIntersectionReport = generateIntersectionReport;
  window.generateHotspotReport = generateHotspotReport; CL.reports.cm.generateHotspotReport = generateHotspotReport;
  window.generateDashboardReport = generateDashboardReport; CL.reports.cm.generateDashboardReport = generateDashboardReport;
  CL._registerModule('reports/reports-countermeasures-cm');
})();
