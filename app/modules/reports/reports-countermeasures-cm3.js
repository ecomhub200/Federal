/**
 * CL reports.cm3 — hotspot-ranking / before-after / grant-support report generators
 * Extracted verbatim from app/index.html (countermeasures band, prompt 42d-a,
 * size-split). NO behavior change. Dual-exposed window.<fn> + CL.reports.cm3.<fn>.
 * Depends (resolved at call time via global scope): docx, MEMO_STYLES, COL,
 * crashState, and report helpers that remain inline.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * High-Crash Location (Hotspot) Ranking Report
 * Maps to: Hot Spots tab
 */
function generateHotspotRankingReport(crashes, title, author) {
    // CC 330 — guard against the dispatcher's matview stub-array hydration.
    // Hotspot ranking iterates per-row to build byRoute/byNode aggregations
    // keyed on r[COL.ROUTE] / r[COL.NODE]; stubs are empty objects so every
    // row lands in `byRoute['Unknown']` with 10k counts, then downstream
    // table renders + EPDO math produce garbage and historically hung the
    // overlay watchdog. Render a clear "switch tier" message instead.
    // State-agnostic.
    // CC 333 — at aggregate tiers the dispatcher hands us stub crashes but
    // populates window._reportMatviewData.topHotspots (mv_hotspots, top 100 by
    // total_crashes with per-location k/a/epdo). Build the ranking from that
    // instead of showing a gap-state. Only fall back to the "switch tier"
    // message when neither per-row data nor usable matview rows are available.
    const _M = window._reportMatviewData;
    const _hasMatviewHotspots = _M && Array.isArray(_M.topHotspots) && _M.topHotspots.length > 0;
    const _isStubArray = Array.isArray(crashes) && crashes.length > 0
        && crashes.every(r => !r || Object.keys(r).length === 0);
    if (_isStubArray && !_hasMatviewHotspots) {
        const titleEl = document.getElementById('rptTitle');
        const subEl = document.getElementById('rptSubtitle');
        const metaEl = document.getElementById('rptMeta');
        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = `${getJurisdictionLabel()} Hotspot Ranking — data unavailable at this tier`;
        if (metaEl) metaEl.textContent = '';
        const findEl = document.getElementById('rptFindings');
        if (findEl) {
            findEl.innerHTML =
                '<p style="padding:1rem;color:#6b7280;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:6px;">' +
                'Hotspot ranking requires per-row crash data with Route and Node columns. ' +
                'Please switch to a county, route, or intersection scope to generate this report.' +
                '</p>';
        }
        ['rptKPIs','rptYearlySection','rptChartsSection','rptTablesSection','rptRecommendations','rptCountermeasures'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
        });
        return;
    }
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();
    const epdo = calcEPDO(stats);

    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `${getJurisdictionLabel()} High-Crash Location (Hotspot) Analysis`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, crashes, 'high-crash location analysis', getJurisdictionLabel());
    showTableOfContents('hotspot');

    // Build location rankings. At aggregate tiers use the pre-ranked
    // _M.topHotspots rows (mv_hotspots); intersection rows carry node_id /
    // intersection_name, route rows carry rte_name / location_name. Prefer the
    // matview's own epdo when present, else recompute from K/A/B/C/O.
    const byRoute = {};
    const byNode = {};
    if (_hasMatviewHotspots) {
        _M.topHotspots.forEach(h => {
            if (!h) return;
            const isNode = (h.node_id != null && h.node_id !== '') || !!h.intersection_name;
            const d = {
                total: Number(h.total || h.total_crashes) || 0,
                K: Number(h.k) || 0, A: Number(h.a) || 0,
                B: Number(h.b) || 0, C: Number(h.c) || 0, O: Number(h.o) || 0
            };
            const mvEpdo = Number(h.epdo != null ? h.epdo : h.epdo_score);
            if (mvEpdo > 0) d._mvEpdo = mvEpdo;
            if (isNode) {
                const name = h.intersection_name || h.location_name || `Node ${h.node_id}`;
                byNode[name] = { ...d, route: h.rte_name || '' };
            } else {
                const name = h.rte_name || h.location_name || 'Unknown';
                byRoute[name] = d;
            }
        });
    } else {
        crashes.forEach(r => {
            const route = r[COL.ROUTE] || 'Unknown';
            const node = r[COL.NODE] || '';
            const s = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            // Route aggregation
            if (!byRoute[route]) byRoute[route] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            byRoute[route].total++;
            if (['K','A','B','C','O'].includes(s)) byRoute[route][s]++;
            // Node aggregation
            if (node) {
                if (!byNode[node]) byNode[node] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, route: route };
                byNode[node].total++;
                if (['K','A','B','C','O'].includes(s)) byNode[node][s]++;
            }
        });
    }

    // CC 363 — collapse spelling variants (e.g. "...VETERANS MEM. HIGHWAY" vs
    // "...VETS MEM HIGHWAY") into one summed row before ranking, so the New
    // Castle Hotspot Report no longer lists the same physical road twice.
    const _maybeFuzzy = (arr) => (typeof _fuzzyDedupeHotspots === 'function') ? _fuzzyDedupeHotspots(arr) : arr;
    const routeRanking = _maybeFuzzy(Object.entries(byRoute).map(([name, d]) => ({ name, ...d, epdo: d._mvEpdo || calcEPDO(d), type: 'Route' })).sort((a,b) => b.epdo - a.epdo));
    const nodeRanking = _maybeFuzzy(Object.entries(byNode).map(([name, d]) => ({ name, ...d, epdo: d._mvEpdo || calcEPDO(d), type: 'Intersection' })).sort((a,b) => b.epdo - a.epdo));
    const combined = [...routeRanking, ...nodeRanking].sort((a,b) => b.epdo - a.epdo).slice(0, 25);

    // KPIs
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${Object.keys(byRoute).length}</div><div class="label">Routes Analyzed</div></div>
        <div class="report-kpi"><div class="value">${Object.keys(byNode).length}</div><div class="label">Intersections</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5">
            <div class="value" style="color:#dc2626">${combined.length > 0 ? combined[0].epdo.toLocaleString() : 0}</div><div class="label">Highest EPDO</div></div>
        <div class="report-kpi"><div class="value">${epdo.toLocaleString()}</div><div class="label">Total EPDO</div></div>
    `;

    // Top 25 Combined Ranking
    const rankRows = combined.map((loc, i) => {
        const kaRate = loc.total > 0 ? ((loc.K + loc.A) / loc.total * 100).toFixed(1) : '0';
        return `<tr><td><strong>${i+1}</strong></td><td>${loc.name}</td><td style="font-size:.75rem">${loc.type}</td><td>${loc.total}</td><td style="color:#dc2626">${loc.K}</td><td style="color:#ea580c">${loc.A}</td><td>${loc.B}</td><td>${loc.C}</td><td>${loc.O}</td><td><strong>${loc.epdo.toLocaleString()}</strong></td><td>${kaRate}%</td></tr>`;
    }).join('');

    document.getElementById('rptFindings').innerHTML = `
        <h4>Top ${combined.length} Locations by EPDO Score</h4>
        <table class="report-table" style="font-size:.8rem">
            <thead><tr><th>#</th><th>Location</th><th>Type</th><th>Total</th><th>K</th><th>A</th><th>B</th><th>C</th><th>O</th><th>EPDO</th><th>K+A%</th></tr></thead>
            <tbody>${rankRows}</tbody>
        </table>
    `;

    // Route-Level Summary
    const routeRows = routeRanking.slice(0, 15).map((loc, i) => {
        return `<tr><td>${i+1}</td><td>${loc.name}</td><td>${loc.total}</td><td>${loc.K + loc.A}</td><td><strong>${loc.epdo.toLocaleString()}</strong></td></tr>`;
    }).join('');

    document.getElementById('rptYearlySection').innerHTML = `
        <h4>Route-Level Summary (Top 15)</h4>
        <table class="report-table">
            <thead><tr><th>#</th><th>Route</th><th>Total Crashes</th><th>K+A</th><th>EPDO</th></tr></thead>
            <tbody>${routeRows}</tbody>
        </table>
    `;

    // Intersection vs Segment comparison
    const routeTotal = routeRanking.reduce((s, r) => s + r.total, 0);
    const nodeTotal = nodeRanking.reduce((s, r) => s + r.total, 0);
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4>Intersection vs Segment Comparison</h4>
            <table class="report-table">
                <thead><tr><th>Category</th><th>Locations</th><th>Total Crashes</th><th>Avg Crashes/Location</th></tr></thead>
                <tbody>
                    <tr><td>Routes/Segments</td><td>${Object.keys(byRoute).length}</td><td>${routeTotal}</td><td>${Object.keys(byRoute).length > 0 ? (routeTotal / Object.keys(byRoute).length).toFixed(1) : 0}</td></tr>
                    <tr><td>Intersections</td><td>${Object.keys(byNode).length}</td><td>${nodeTotal}</td><td>${Object.keys(byNode).length > 0 ? (nodeTotal / Object.keys(byNode).length).toFixed(1) : 0}</td></tr>
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('rptTablesSection').innerHTML = '';
    // CC 333 — prefer the matview-mode recommendation builder at aggregate tiers
    // (same siblings the Dashboard report uses) so recommendations reflect real
    // category data instead of empty stub-derived categories.
    const _hotspotCategoryData = (_M && typeof computeSystemwideCategoryDataFromMatviews === 'function')
        ? computeSystemwideCategoryDataFromMatviews(_M)
        : computeSystemwideCategoryData(crashes);
    document.getElementById('rptRecommendations').innerHTML =
        (_M && typeof generateEnhancedRecommendationsFromMatviews === 'function')
            ? generateEnhancedRecommendationsFromMatviews(stats, _M, _hotspotCategoryData)
            : generateEnhancedRecommendations(stats, crashes, _hotspotCategoryData);
    document.getElementById('rptCountermeasures').innerHTML = '';
}


/**
 * Before/After Study Report
 * Maps to: Before/After Study tab
 */
function generateBeforeAfterStudyReport(title, author) {
    // The report header's "Period" must reflect the user-entered Before +
    // After windows from the B/A tab (baBeforeStart → baAfterEnd), NOT the
    // min/max of the crashes that landed in the selection. Falls back to
    // the crash min/max if the user hasn't filled both sides.
    const fmtBA = (d) => {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${mm}/${dd}/${d.getFullYear()}`;
    };
    const parseBALocal = (val) => {
        if (!val) return null;
        // baState.beforePeriod.start / afterPeriod.end store Date objects
        // (set in updateBAPeriodDisplay); the DOM inputs store 'YYYY-MM-DD'
        // strings. Handle both.
        if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
        const [y, m, d] = String(val).split('-').map(Number);
        if (!y || !m || !d) return null;
        return new Date(y, m - 1, d);
    };
    const baBeforeStart = parseBALocal(document.getElementById('baBeforeStart')?.value)
        || parseBALocal(baState.beforePeriod?.start);
    const baAfterEnd = parseBALocal(document.getElementById('baAfterEnd')?.value)
        || parseBALocal(baState.afterPeriod?.end);
    const yearRange = (baBeforeStart && baAfterEnd)
        ? `${fmtBA(baBeforeStart)} - ${fmtBA(baAfterEnd)}`
        : getDateRange(baState.locationCrashes);
    const reportId = generateReportId();
    const allCrashes = baState.locationCrashes;
    const stats = computeStats(allCrashes);

    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `Before/After Safety Study - ${baState.locationName || 'Selected Location'}`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, allCrashes, 'before/after safety study', baState.locationName || 'Selected Location');
    showTableOfContents('beforeafter');

    // Split into before/after periods
    const treatmentDate = baState.treatmentDate ? new Date(baState.treatmentDate) : null;
    let beforeCrashes = allCrashes;
    let afterCrashes = [];
    if (treatmentDate) {
        beforeCrashes = allCrashes.filter(r => {
            const d = r[COL.DATE] ? new Date(Number(r[COL.DATE])) : null;
            return d && d < treatmentDate;
        });
        afterCrashes = allCrashes.filter(r => {
            const d = r[COL.DATE] ? new Date(Number(r[COL.DATE])) : null;
            return d && d >= treatmentDate;
        });
    }

    const beforeStats = computeStats(beforeCrashes);
    const afterStats = computeStats(afterCrashes);
    const beforeEpdo = calcEPDO(beforeStats);
    const afterEpdo = calcEPDO(afterStats);

    // KPIs
    const totalChange = beforeStats.total > 0 ? ((afterStats.total - beforeStats.total) / beforeStats.total * 100).toFixed(1) : 'N/A';
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${beforeStats.total}</div><div class="label">Before Period</div></div>
        <div class="report-kpi"><div class="value">${afterStats.total}</div><div class="label">After Period</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,${totalChange !== 'N/A' && parseFloat(totalChange) < 0 ? '#dcfce7,#bbf7d0' : '#fef2f2,#fee2e2'});border:1px solid ${totalChange !== 'N/A' && parseFloat(totalChange) < 0 ? '#86efac' : '#fca5a5'}">
            <div class="value" style="color:${totalChange !== 'N/A' && parseFloat(totalChange) < 0 ? '#16a34a' : '#dc2626'}">${totalChange}%</div><div class="label">Total Change</div></div>
        <div class="report-kpi"><div class="value">${stats.total}</div><div class="label">All Crashes</div></div>
    `;

    // Study Design
    document.getElementById('rptFindings').innerHTML = `
        <h4>Study Design</h4>
        <table class="report-table">
            <tbody>
                <tr><td><strong>Location</strong></td><td>${baState.locationName || 'Selected Location'}</td></tr>
                <tr><td><strong>Treatment Type</strong></td><td>${baState.treatmentType || 'Not specified'}</td></tr>
                <tr><td><strong>Treatment Date</strong></td><td>${treatmentDate ? treatmentDate.toLocaleDateString() : 'Not specified'}</td></tr>
                <tr><td><strong>Analysis Method</strong></td><td>${(baState.analysisMethod || 'Simple').toUpperCase()}</td></tr>
                <tr><td><strong>Before Period</strong></td><td>${baState.beforePeriod?.start || 'Auto'} to ${baState.beforePeriod?.end || 'Treatment date'}</td></tr>
                <tr><td><strong>After Period</strong></td><td>${baState.afterPeriod?.start || 'Treatment date'} to ${baState.afterPeriod?.end || 'Latest data'}</td></tr>
            </tbody>
        </table>
    `;

    // Before vs After Statistics
    const compRows = ['Total','K','A','B','C','O'].map(s => {
        const bVal = s === 'Total' ? beforeStats.total : beforeStats[s];
        const aVal = s === 'Total' ? afterStats.total : afterStats[s];
        const change = bVal > 0 ? ((aVal - bVal) / bVal * 100).toFixed(1) : (aVal > 0 ? '+100' : '0');
        const color = parseFloat(change) < 0 ? '#16a34a' : parseFloat(change) > 0 ? '#dc2626' : '#6b7280';
        return `<tr><td><strong>${s}</strong></td><td>${bVal}</td><td>${aVal}</td><td style="color:${color};font-weight:bold">${change}%</td></tr>`;
    }).join('');

    document.getElementById('rptYearlySection').innerHTML = `
        <h4>Before vs After Comparison</h4>
        <table class="report-table">
            <thead><tr><th>Metric</th><th>Before Period</th><th>After Period</th><th>% Change</th></tr></thead>
            <tbody>${compRows}
                <tr style="background:#f1f5f9"><td><strong>EPDO</strong></td><td>${beforeEpdo.toLocaleString()}</td><td>${afterEpdo.toLocaleString()}</td>
                <td style="color:${afterEpdo < beforeEpdo ? '#16a34a' : '#dc2626'};font-weight:bold">${beforeEpdo > 0 ? ((afterEpdo - beforeEpdo) / beforeEpdo * 100).toFixed(1) : 'N/A'}%</td></tr>
            </tbody>
        </table>
    `;

    // Observed CMF
    const observedCMF = beforeStats.total > 0 && afterStats.total > 0 ? (afterStats.total / beforeStats.total).toFixed(3) : 'N/A';
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4>Observed Crash Modification Factor</h4>
            <div style="text-align:center;padding:2rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0">
                <div style="font-size:2.5rem;font-weight:700;color:${observedCMF !== 'N/A' && parseFloat(observedCMF) < 1 ? '#16a34a' : '#dc2626'}">${observedCMF}</div>
                <div style="font-size:.9rem;color:#64748b;margin-top:.5rem">Observed CMF ${observedCMF !== 'N/A' && parseFloat(observedCMF) < 1 ? '(Crashes Reduced)' : observedCMF !== 'N/A' ? '(Crashes Increased)' : ''}</div>
                <div style="font-size:.75rem;color:#94a3b8;margin-top:.25rem">CMF &lt; 1.0 indicates crash reduction; CMF &gt; 1.0 indicates crash increase</div>
            </div>
        </div>
    `;

    document.getElementById('rptTablesSection').innerHTML = '';
    document.getElementById('rptRecommendations').innerHTML = `
        <h4>Conclusions & Recommendations</h4>
        <div style="font-size:.85rem">
            ${observedCMF !== 'N/A' && parseFloat(observedCMF) < 1
                ? `<p style="color:#16a34a"><strong>Positive Result:</strong> The treatment appears to have reduced crashes by ${((1 - parseFloat(observedCMF)) * 100).toFixed(1)}%. Consider applying similar treatments at comparable locations.</p>`
                : observedCMF !== 'N/A'
                    ? `<p style="color:#dc2626"><strong>Negative Result:</strong> Crashes appear to have increased after treatment. Further investigation is recommended to identify confounding factors.</p>`
                    : '<p>Insufficient data to draw conclusions. Ensure both before and after periods have adequate crash data.</p>'
            }
            <p style="margin-top:.5rem"><strong>Note:</strong> This is a simple before/after comparison. For more rigorous analysis, consider Empirical Bayes or comparison group methods to account for regression to the mean.</p>
        </div>
    `;
    document.getElementById('rptCountermeasures').innerHTML = '';
}

/**
 * Grant Application Support Package Report
 * Maps to: Grants tab
 */
function generateGrantSupportReport(crashes, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();
    const epdo = calcEPDO(stats);

    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `${getJurisdictionLabel()} Safety Improvement Grant Support Data`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, crashes, 'grant application support', getJurisdictionLabel());
    showTableOfContents('grantsupport');

    // Use grant-ranked locations if available
    const rankedLocs = grantState.allRankedLocations || [];

    // KPIs
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${stats.total.toLocaleString()}</div><div class="label">Total Crashes</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5">
            <div class="value" style="color:#dc2626">${stats.K + stats.A}</div><div class="label">K+A Crashes</div></div>
        <div class="report-kpi"><div class="value">${epdo.toLocaleString()}</div><div class="label">EPDO Score</div></div>
        <div class="report-kpi"><div class="value">${rankedLocs.length}</div><div class="label">Ranked Locations</div></div>
    `;

    // Project Justification
    const kaRate = stats.total > 0 ? ((stats.K + stats.A) / stats.total * 100).toFixed(1) : '0';
    document.getElementById('rptFindings').innerHTML = `
        <h4>Project Justification</h4>
        <div style="background:#fef2f2;padding:1rem;border-radius:var(--radius);border:1px solid #fca5a5;margin-bottom:1rem">
            <p style="font-size:.9rem"><strong>Safety Need:</strong> During the analysis period (${yearRange}), ${getJurisdictionLabel()} experienced <strong>${stats.total.toLocaleString()} total crashes</strong>, including <strong>${stats.K} fatal</strong> and <strong>${stats.A} serious injury</strong> crashes, representing a <strong>${kaRate}% K+A rate</strong>.</p>
            <p style="font-size:.9rem;margin-top:.5rem">The total EPDO score of <strong>${epdo.toLocaleString()}</strong> indicates significant societal cost from these crashes.</p>
        </div>
        <h5>Crash Severity Summary</h5>
        <table class="report-table">
            <thead><tr><th>Severity</th><th>Count</th><th>Percentage</th><th>EPDO Contribution</th></tr></thead>
            <tbody>
                ${['K','A','B','C','O'].map(s => {
                    const cnt = stats[s];
                    const epdoVal = cnt * EPDO_WEIGHTS[s];
                    return `<tr><td>${s}</td><td>${cnt}</td><td>${stats.total > 0 ? (cnt/stats.total*100).toFixed(1) : 0}%</td><td>${epdoVal.toLocaleString()}</td></tr>`;
                }).join('')}
            </tbody>
        </table>
    `;

    // Location Rankings
    if (rankedLocs.length > 0) {
        const locRows = rankedLocs.slice(0, 20).map((loc, i) => {
            const locEpdo = loc.epdo || calcEPDO(loc);
            return `<tr><td>${i+1}</td><td>${loc.name || loc.location || 'Location ' + (i+1)}</td><td>${loc.total || loc.crashes || '-'}</td><td>${loc.K || 0}</td><td>${loc.A || 0}</td><td><strong>${typeof locEpdo === 'number' ? locEpdo.toLocaleString() : locEpdo}</strong></td></tr>`;
        }).join('');
        document.getElementById('rptYearlySection').innerHTML = `
            <h4>EPDO-Ranked Priority Locations (Top 20)</h4>
            <table class="report-table">
                <thead><tr><th>#</th><th>Location</th><th>Total</th><th>K</th><th>A</th><th>EPDO</th></tr></thead>
                <tbody>${locRows}</tbody>
            </table>
        `;
    } else {
        document.getElementById('rptYearlySection').innerHTML = `
            <h4>Location Rankings</h4>
            <p style="color:#92400e">No ranked locations available. Please run the location ranking in the Grants tab first.</p>
        `;
    }

    // Benefit-Cost Data
    const costs = grantState.crashCosts || { K: 12800000, A: 655000, B: 198000, C: 125000, O: 12400 };
    const totalCost = stats.K * costs.K + stats.A * costs.A + stats.B * costs.B + stats.C * costs.C + stats.O * costs.O;
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4>Benefit-Cost Analysis Data</h4>
            <table class="report-table">
                <thead><tr><th>Severity</th><th>Count</th><th>Unit Cost</th><th>Total Cost</th></tr></thead>
                <tbody>
                    ${['K','A','B','C','O'].map(s => `<tr><td>${s}</td><td>${stats[s]}</td><td>$${costs[s].toLocaleString()}</td><td>$${(stats[s] * costs[s]).toLocaleString()}</td></tr>`).join('')}
                    <tr style="font-weight:bold;background:#f1f5f9"><td>Total</td><td>${stats.total}</td><td>-</td><td>$${totalCost.toLocaleString()}</td></tr>
                </tbody>
            </table>
            <p style="font-size:.75rem;color:#64748b;margin-top:.5rem">Crash costs based on FHWA comprehensive crash cost estimates. Actual costs may vary by jurisdiction.</p>
        </div>
    `;

    document.getElementById('rptTablesSection').innerHTML = '';
    document.getElementById('rptRecommendations').innerHTML = `
        <h4>Data Source Citations</h4>
        <div style="font-size:.85rem">
            <ul>
                <li>Crash data: State crash records database, analysis period: ${yearRange}</li>
                <li>EPDO weights: ${EPDO_WEIGHTS.K === 462 ? 'AASHTO Highway Safety Manual (HSM 2010)' : 'Custom jurisdiction weights'}</li>
                <li>Crash costs: FHWA comprehensive crash cost estimates</li>
                <li>Analysis methodology: EPDO-based location ranking per HSIP guidelines</li>
            </ul>
        </div>
    `;
    document.getElementById('rptCountermeasures').innerHTML = '';
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.cm3 = CL.reports.cm3 || {};
  window.generateHotspotRankingReport = generateHotspotRankingReport; CL.reports.cm3.generateHotspotRankingReport = generateHotspotRankingReport;
  window.generateBeforeAfterStudyReport = generateBeforeAfterStudyReport; CL.reports.cm3.generateBeforeAfterStudyReport = generateBeforeAfterStudyReport;
  window.generateGrantSupportReport = generateGrantSupportReport; CL.reports.cm3.generateGrantSupportReport = generateGrantSupportReport;
  CL._registerModule('reports/reports-countermeasures-cm3');
})();
