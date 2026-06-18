/**
 * CL reports.cm2 — systemic safety (crash-tree) report generator
 * Extracted verbatim from app/index.html (countermeasures band, prompt 42d-a,
 * size-split). NO behavior change. Dual-exposed window.<fn> + CL.reports.cm2.<fn>.
 * Depends (resolved at call time via global scope): docx, MEMO_STYLES, COL,
 * crashState, and report helpers that remain inline.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
/**
 * Systemic Safety Analysis (Crash Tree) Report
 * Maps to: Crash Tree tab
 */
function generateCrashTreeSystemicReport(crashes, title, author) {
    // CC 333 — the systemic crash-tree fundamentally needs per-row cross-tabs
    // (Crash Type × Facility Type matrix, high-risk combinations) that no
    // matview exposes. At aggregate tiers the dispatcher hands a blank stub
    // array, so render a clear gap-state instead of empty/garbage tables.
    // State-agnostic.
    const _isStubArray = Array.isArray(crashes) && crashes.length > 0
        && crashes.every(r => !r || Object.keys(r).length === 0);
    if (_isStubArray) {
        const titleEl = document.getElementById('rptTitle');
        const subEl = document.getElementById('rptSubtitle');
        const metaEl = document.getElementById('rptMeta');
        if (titleEl) titleEl.textContent = title;
        if (subEl) subEl.textContent = `${getJurisdictionLabel()} Systemic Safety Analysis — per-row data required`;
        if (metaEl) metaEl.textContent = '';
        const findEl = document.getElementById('rptFindings');
        if (findEl) {
            findEl.innerHTML =
                '<div style="padding:1.5rem;color:#78350f;background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;max-width:700px;margin:1rem auto;">' +
                '<p style="margin:0 0 .5rem;font-weight:600;color:#92400e;">Systemic Crash-Tree Report requires per-row crash data</p>' +
                '<p style="margin:0;">The crash-tree builds a Crash&nbsp;Type&nbsp;&times;&nbsp;Facility&nbsp;Type cross-analysis matrix and ranks high-risk combinations, which need individual crash records (collision type, facility/road type, severity). Only aggregate matview data is loaded at this tier.</p>' +
                '<p style="margin:.75rem 0 0;"><strong>To generate this report:</strong> drill down to <strong>City/Town tier</strong> on the Upload tab to load the row-level dataset, then return and click Generate Report again.</p>' +
                '</div>';
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
    document.getElementById('rptSubtitle').textContent = `${getJurisdictionLabel()} FHWA Systemic Safety Analysis`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, crashes, 'systemic safety analysis', getJurisdictionLabel());
    showTableOfContents('crashtree');

    // KPIs
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${stats.total.toLocaleString()}</div><div class="label">Total Crashes</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5">
            <div class="value" style="color:#dc2626">${stats.K}</div><div class="label">Fatal (K)</div></div>
        <div class="report-kpi"><div class="value">${stats.K + stats.A}</div><div class="label">K+A Crashes</div></div>
        <div class="report-kpi"><div class="value">${epdo.toLocaleString()}</div><div class="label">EPDO Score</div></div>
    `;

    // Facility Type Breakdown
    const byFacility = {};
    crashes.forEach(r => {
        const ft = r[COL.FACILITY_TYPE] || r[COL.ROAD_DESC] || 'Unknown';
        if (!byFacility[ft]) byFacility[ft] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        byFacility[ft].total++;
        const s = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (['K','A','B','C','O'].includes(s)) byFacility[ft][s]++;
    });
    const facilityRows = Object.entries(byFacility).sort((a,b) => calcEPDO(b[1]) - calcEPDO(a[1])).map(([ft, d]) => {
        const ftEpdo = calcEPDO(d);
        return `<tr><td>${ft}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td><td>${d.B}</td><td>${d.C}</td><td>${d.O}</td><td><strong>${ftEpdo.toLocaleString()}</strong></td><td>${stats.total > 0 ? (d.total/stats.total*100).toFixed(1) : 0}%</td></tr>`;
    }).join('');

    document.getElementById('rptFindings').innerHTML = `
        <h4>Facility Type Breakdown</h4>
        <table class="report-table">
            <thead><tr><th>Facility Type</th><th>Total</th><th>K</th><th>A</th><th>B</th><th>C</th><th>O</th><th>EPDO</th><th>% of Total</th></tr></thead>
            <tbody>${facilityRows}</tbody>
        </table>
    `;

    // Crash Type Hierarchy
    const byCollision = {};
    crashes.forEach(r => {
        const ct = r[COL.COLLISION] || 'Unknown';
        if (!byCollision[ct]) byCollision[ct] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        byCollision[ct].total++;
        const s = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (['K','A','B','C','O'].includes(s)) byCollision[ct][s]++;
    });
    const collisionRows = Object.entries(byCollision).sort((a,b) => calcEPDO(b[1]) - calcEPDO(a[1])).slice(0, 15).map(([ct, d]) => {
        const ctEpdo = calcEPDO(d);
        return `<tr><td>${ct}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td><td>${d.K + d.A}</td><td><strong>${ctEpdo.toLocaleString()}</strong></td></tr>`;
    }).join('');

    document.getElementById('rptYearlySection').innerHTML = `
        <h4>Crash Type Hierarchy (by EPDO)</h4>
        <table class="report-table">
            <thead><tr><th>Collision Type</th><th>Total</th><th>K</th><th>A</th><th>K+A</th><th>EPDO</th></tr></thead>
            <tbody>${collisionRows}</tbody>
        </table>
    `;

    // Cross-Analysis Matrix: Crash Type x Facility Type
    const topFacilities = Object.entries(byFacility).sort((a,b) => b[1].total - a[1].total).slice(0, 5).map(e => e[0]);
    const topCollisions = Object.entries(byCollision).sort((a,b) => b[1].total - a[1].total).slice(0, 8).map(e => e[0]);
    const matrix = {};
    crashes.forEach(r => {
        const ft = r[COL.FACILITY_TYPE] || r[COL.ROAD_DESC] || 'Unknown';
        const ct = r[COL.COLLISION] || 'Unknown';
        if (topFacilities.includes(ft) && topCollisions.includes(ct)) {
            const key = `${ct}|||${ft}`;
            matrix[key] = (matrix[key] || 0) + 1;
        }
    });
    const matrixHeader = `<tr><th>Crash Type \\ Facility</th>${topFacilities.map(f => `<th style="font-size:.75rem">${f}</th>`).join('')}</tr>`;
    const matrixRows = topCollisions.map(ct => {
        const cells = topFacilities.map(ft => {
            const val = matrix[`${ct}|||${ft}`] || 0;
            const bg = val > 10 ? 'background:#fef2f2' : val > 5 ? 'background:#fff7ed' : '';
            return `<td style="${bg}">${val || '-'}</td>`;
        }).join('');
        return `<tr><td>${ct}</td>${cells}</tr>`;
    }).join('');

    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4>Cross-Analysis Matrix: Crash Type x Facility Type</h4>
            <table class="report-table"><thead>${matrixHeader}</thead><tbody>${matrixRows}</tbody></table>
        </div>
    `;

    // High-Risk Combinations
    const combos = {};
    crashes.forEach(r => {
        const ft = r[COL.FACILITY_TYPE] || r[COL.ROAD_DESC] || 'Unknown';
        const ct = r[COL.COLLISION] || 'Unknown';
        const key = `${ct} on ${ft}`;
        if (!combos[key]) combos[key] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        combos[key].total++;
        const s = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (['K','A','B','C','O'].includes(s)) combos[key][s]++;
    });
    const topCombos = Object.entries(combos).sort((a,b) => calcEPDO(b[1]) - calcEPDO(a[1])).slice(0, 10);
    const comboRows = topCombos.map(([name, d], i) => {
        return `<tr><td>${i+1}</td><td>${name}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td><td><strong>${calcEPDO(d).toLocaleString()}</strong></td></tr>`;
    }).join('');

    document.getElementById('rptTablesSection').innerHTML = `
        <h4>Top 10 High-Risk Combinations (by EPDO)</h4>
        <table class="report-table">
            <thead><tr><th>#</th><th>Combination</th><th>Total</th><th>K</th><th>A</th><th>EPDO</th></tr></thead>
            <tbody>${comboRows}</tbody>
        </table>
    `;

    // Recommendations
    document.getElementById('rptRecommendations').innerHTML = `
        <h4>FHWA Systemic Safety Recommendations</h4>
        <div style="background:#f0f9ff;padding:1rem;border-radius:var(--radius);border:1px solid #0ea5e9;margin-bottom:1rem">
            <p style="font-size:.85rem;margin-bottom:.5rem"><strong>Systemic Approach:</strong> The FHWA systemic safety approach focuses on widespread, low-cost improvements across a road network to address common risk factors rather than focusing on individual high-crash locations.</p>
        </div>
        ${generateEnhancedRecommendations(stats, crashes, computeSystemwideCategoryData(crashes))}
    `;
    document.getElementById('rptCountermeasures').innerHTML = '';
}

/**
 * Fatal & Speed-Related Analysis Report
 * Maps to: Fatal & Speeding tab
 */
async function generateFatalSpeedReport(crashes, title, author) {
    // CC 333 — at aggregate tiers the dispatcher hands a length-N stub array of
    // blank objects; treat it as empty so the _supaMode matview path below
    // engages (KPIs + top-fatal locations from matviews, per-row sub-sections
    // show "unavailable in aggregate view" placeholders). Mirrors
    // generateInfographic's stub handling. State-agnostic.
    if (Array.isArray(crashes) && crashes.length > 0 && crashes.every(r => !r || Object.keys(r).length === 0)) {
        crashes = [];
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

    const fatalCrashes = crashes.filter(r => (r[COL.SEVERITY] || '').charAt(0).toUpperCase() === 'K');
    const speedCrashes = crashes.filter(r => isYes(r[COL.SPEED]));
    const fatalSpeed = crashes.filter(r => (r[COL.SEVERITY] || '').charAt(0).toUpperCase() === 'K' && isYes(r[COL.SPEED]));

    // Round 7 (2026-05-09): in Supabase-only mode crashes is empty so
    // stats.total / fatalCrashes / speedCrashes are all 0 (the report
    // historically rendered "Total Crashes in Dataset: 0" and percentages
    // overflowed past 100% because the divisor was 0). Hydrate the KPI
    // counts from matviews. Tabular sub-sections (Fatal Hotspots, Speed by
    // Year, Co-Factor cross-tab) need additional matview support that is
    // partially landed; populate where data exists, leave a "—" placeholder
    // where it doesn't.
    const _supaMode = !crashes.length && window.crashLensClient
        && window.CL?.data?.supabaseBridge?.resolveTier;
    let _supaTotal = 0, _supaFatal = 0, _supaSpeed = 0;
    let _supaFatalHotspots = [], _supaSpeedHotspots = [];
    if (_supaMode) {
        try {
            const t = window.CL.data.supabaseBridge.resolveTier();
            const [sumRows, cats, fatalHs, speedHs] = await Promise.all([
                CL.data.cachedMatview('dashboard_summary', t.tier, t.value,
                    () => window.crashLensClient.getSummary(t.tier, t.value, {})),
                CL.data.cachedMatview('mv_safety_categories', t.tier, t.value,
                    () => window.crashLensClient.getSafetyCategories(t.tier, t.value, {})),
                CL.data.cachedMatview('mv_hotspots', t.tier, t.value,
                    () => window.crashLensClient.getHotspots(t.tier, t.value, { limit: 100, sortBy: 'k' }),
                    { limit: 100, sortBy: 'k' })
                    .catch(() => null),
                CL.data.cachedMatview('mv_hotspots', t.tier, t.value,
                    () => window.crashLensClient.getHotspots(t.tier, t.value, { limit: 100 }),
                    { limit: 100 })
                    .catch(() => null),
            ]);
            (sumRows || []).forEach(r => {
                _supaTotal += r.crash_count || 0;
                _supaFatal += r.fatals      || 0;
                _supaSpeed += r.speed_crashes || 0;
            });
            // Fatal hotspots — locations with K > 0, ranked by K then EPDO.
            if (fatalHs) {
                const merged = [...(fatalHs.intersections || []), ...(fatalHs.segments || [])];
                _supaFatalHotspots = merged
                    .filter(r => (r.k || 0) > 0)
                    .map(r => {
                        const intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
                        const rteName = String(r['RTE Name'] || r.rte_name || '').trim();
                        const nodeId  = String(r.location_name || '').trim();
                        let name = (rteName && intName) ? rteName + ' / ' + intName
                                 : intName || rteName || nodeId || 'Unknown';
                        return { name, K: r.k || 0, A: r.a || 0,
                                 total: r.total_crashes || 0, epdo: r.epdo || 0 };
                    })
                    .sort((a, b) => (b.K - a.K) || (b.epdo - a.epdo))
                    .slice(0, 25);
            }
            // Speed hotspots — same ranking on EPDO. There's no per-location
            // speed-flag count in mv_hotspots; until B7b lands these are
            // EPDO-ranked overall hotspots (a reasonable proxy).
            if (speedHs) {
                const merged = [...(speedHs.intersections || []), ...(speedHs.segments || [])];
                _supaSpeedHotspots = merged
                    .map(r => {
                        const intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
                        const rteName = String(r['RTE Name'] || r.rte_name || '').trim();
                        const nodeId  = String(r.location_name || '').trim();
                        let name = (rteName && intName) ? rteName + ' / ' + intName
                                 : intName || rteName || nodeId || 'Unknown';
                        return { name, total: r.total_crashes || 0, epdo: r.epdo || 0 };
                    })
                    .sort((a, b) => b.epdo - a.epdo)
                    .slice(0, 25);
            }
            console.log('[F&S Report] matview hydration: total=' + _supaTotal +
                ', fatal=' + _supaFatal + ', speed=' + _supaSpeed);
            // Override stats.total so downstream % computations use the
            // matview total as divisor (fixes "%>100%" + "Total Crashes in
            // Dataset: 0").
            if (_supaTotal > 0) {
                stats.total = _supaTotal;
                stats.K     = _supaFatal;
            }
        } catch (e) {
            console.warn('[F&S Report] matview hydration failed:', e && e.message);
        }
    }

    document.getElementById('rptTitle').textContent = title;
    document.getElementById('rptSubtitle').textContent = `${getJurisdictionLabel()} Fatal & Speed-Related Crash Analysis`;
    document.getElementById('rptMeta').textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;
    updateReportFooter(yearRange, reportId, stats.total);
    showExecutiveSummary(stats, crashes, 'fatal and speed-related analysis', getJurisdictionLabel());
    showTableOfContents('fatalspeed');

    // Round 7 (2026-05-09): when sampleRows is empty (Supabase-only mode),
    // pull KPI counts from the matview totals instead of empty filters.
    // Fatal+Speed cross-tab requires backend B7b — until then approximate
    // via min(K, speed) which matches expected magnitude in most states.
    const _fatalCount   = _supaMode && _supaTotal > 0 ? _supaFatal : fatalCrashes.length;
    const _speedCount   = _supaMode && _supaTotal > 0 ? _supaSpeed : speedCrashes.length;
    const _totalForPct  = _supaMode && _supaTotal > 0 ? _supaTotal : stats.total;
    const _fatalSpeedCt = _supaMode && _supaTotal > 0
        ? Math.min(_supaFatal, _supaSpeed)  // upper-bound proxy until B7b
        : fatalSpeed.length;

    // KPIs
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi" style="background:linear-gradient(135deg,#fef2f2,#fee2e2);border:1px solid #fca5a5">
            <div class="value" style="color:#dc2626">${_fatalCount}</div><div class="label">Fatal Crashes</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#fff7ed,#ffedd5);border:1px solid #fdba74">
            <div class="value" style="color:#ea580c">${_speedCount}</div><div class="label">Speed-Related</div></div>
        <div class="report-kpi">
            <div class="value">${_totalForPct > 0 ? (_speedCount/_totalForPct*100).toFixed(1) : 0}%</div><div class="label">Speed % of All</div></div>
        <div class="report-kpi" style="background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1px solid #c4b5fd">
            <div class="value" style="color:#7c3aed">${_fatalSpeedCt}</div><div class="label">Fatal + Speed</div></div>
    `;

    // Fatal Crash Analysis
    const fatalByYear = {};
    fatalCrashes.forEach(r => { const y = r[COL.YEAR] || 'Unk'; fatalByYear[y] = (fatalByYear[y] || 0) + 1; });
    const fatalByCollision = {};
    fatalCrashes.forEach(r => { const c = r[COL.COLLISION] || 'Unknown'; fatalByCollision[c] = (fatalByCollision[c] || 0) + 1; });
    const fatalByLight = {};
    fatalCrashes.forEach(r => { const l = r[COL.LIGHT] || 'Unknown'; fatalByLight[l] = (fatalByLight[l] || 0) + 1; });
    const fatalByRoute = {};
    fatalCrashes.forEach(r => { const rt = r[COL.ROUTE] || 'Unknown'; fatalByRoute[rt] = (fatalByRoute[rt] || 0) + 1; });
    const topFatalRoutes = Object.entries(fatalByRoute).sort((a,b) => b[1] - a[1]).slice(0, 10);

    // Round 7 (2026-05-09): Top Fatal Locations falls back to mv_hotspots
    // ranked by K when sampleRows is empty.
    const _topFatalRows = (_supaMode && _supaFatalHotspots.length)
        ? _supaFatalHotspots.slice(0, 10)
            .map(h => `<tr><td>${h.name}</td><td>${h.K}</td></tr>`).join('')
        : topFatalRoutes.map(([r,c]) => `<tr><td>${r}</td><td>${c}</td></tr>`).join('');

    document.getElementById('rptFindings').innerHTML = `
        <h4 style="color:#991B1B">Fatal Crash Analysis (${_fatalCount} crashes)</h4>
        <div class="two-col">
            <div>
                <h5>Fatal Crashes by Year</h5>
                <table class="report-table"><thead><tr><th>Year</th><th>Fatal Crashes</th></tr></thead>
                <tbody>${Object.keys(fatalByYear).length ? Object.entries(fatalByYear).sort().map(([y,c]) => `<tr><td>${y}</td><td>${c}</td></tr>`).join('') : '<tr><td colspan="2" style="text-align:center;color:#94a3b8">Per-year breakdown unavailable in aggregate view (B7b backlog)</td></tr>'}</tbody></table>
            </div>
            <div>
                <h5>Fatal Crashes by Collision Type</h5>
                <table class="report-table"><thead><tr><th>Collision Type</th><th>Count</th></tr></thead>
                <tbody>${Object.keys(fatalByCollision).length ? Object.entries(fatalByCollision).sort((a,b) => b[1]-a[1]).slice(0,8).map(([t,c]) => `<tr><td>${t}</td><td>${c}</td></tr>`).join('') : '<tr><td colspan="2" style="text-align:center;color:#94a3b8">Per-collision breakdown unavailable in aggregate view</td></tr>'}</tbody></table>
            </div>
        </div>
        <div class="two-col" style="margin-top:1rem">
            <div>
                <h5>Fatal by Light Condition</h5>
                <table class="report-table"><thead><tr><th>Light Condition</th><th>Count</th></tr></thead>
                <tbody>${Object.keys(fatalByLight).length ? Object.entries(fatalByLight).sort((a,b) => b[1]-a[1]).map(([l,c]) => `<tr><td>${l}</td><td>${c}</td></tr>`).join('') : '<tr><td colspan="2" style="text-align:center;color:#94a3b8">Per-light breakdown unavailable in aggregate view</td></tr>'}</tbody></table>
            </div>
            <div>
                <h5>Top 10 Fatal Crash Locations</h5>
                <table class="report-table"><thead><tr><th>Location</th><th>Fatal Crashes</th></tr></thead>
                <tbody>${_topFatalRows || '<tr><td colspan="2" style="text-align:center;color:#94a3b8">No fatal-crash locations in current scope</td></tr>'}</tbody></table>
            </div>
        </div>
    `;

    // Speed-Related Analysis
    const speedStats = computeStats(speedCrashes);
    const speedByCollision = {};
    speedCrashes.forEach(r => { const c = r[COL.COLLISION] || 'Unknown'; speedByCollision[c] = (speedByCollision[c] || 0) + 1; });
    const speedByRoadDesc = {};
    speedCrashes.forEach(r => { const rd = r[COL.ROAD_DESC] || r[COL.FACILITY_TYPE] || 'Unknown'; speedByRoadDesc[rd] = (speedByRoadDesc[rd] || 0) + 1; });

    document.getElementById('rptYearlySection').innerHTML = `
        <h4 style="color:#92400e">Speed-Related Analysis (${speedCrashes.length} crashes)</h4>
        <div class="two-col">
            <div>
                <h5>Speed Crashes by Severity</h5>
                <table class="report-table"><thead><tr><th>Severity</th><th>Count</th><th>%</th></tr></thead>
                <tbody>
                    ${['K','A','B','C','O'].map(s => `<tr><td>${s}</td><td>${speedStats[s]}</td><td>${speedStats.total > 0 ? (speedStats[s]/speedStats.total*100).toFixed(1) : 0}%</td></tr>`).join('')}
                </tbody></table>
            </div>
            <div>
                <h5>Speed Crashes by Road Type</h5>
                <table class="report-table"><thead><tr><th>Road Type</th><th>Count</th></tr></thead>
                <tbody>${Object.entries(speedByRoadDesc).sort((a,b) => b[1]-a[1]).slice(0,8).map(([t,c]) => `<tr><td>${t}</td><td>${c}</td></tr>`).join('')}</tbody></table>
            </div>
        </div>
    `;

    // Combined Risk Analysis
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section" style="grid-column:1/-1">
            <h4 style="color:#4c1d95">Combined Fatal + Speed Risk Analysis</h4>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1rem">
                <div style="text-align:center;padding:1rem;background:#fef2f2;border-radius:var(--radius);border:1px solid #fca5a5">
                    <div style="font-size:1.5rem;font-weight:700;color:#dc2626">${_fatalCount}</div>
                    <div style="font-size:.8rem;color:#991B1B">Fatal Only</div>
                </div>
                <div style="text-align:center;padding:1rem;background:#fffbeb;border-radius:var(--radius);border:1px solid #fbbf24">
                    <div style="font-size:1.5rem;font-weight:700;color:#d97706">${_speedCount}</div>
                    <div style="font-size:.8rem;color:#92400e">Speed Only</div>
                </div>
                <div style="text-align:center;padding:1rem;background:#f5f3ff;border-radius:var(--radius);border:1px solid #c4b5fd">
                    <div style="font-size:1.5rem;font-weight:700;color:#7c3aed">${_fatalSpeedCt}</div>
                    <div style="font-size:.8rem;color:#4c1d95">Fatal + Speed Overlap${_supaMode ? ' (estimated)' : ''}</div>
                </div>
            </div>
            <p style="font-size:.85rem;color:#475569">${_fatalCount > 0 ? ((_fatalSpeedCt / _fatalCount * 100).toFixed(1) + '% of fatal crashes were speed-related.') : 'No fatal crashes in dataset.'} ${_speedCount > 0 ? ((_fatalSpeedCt / _speedCount * 100).toFixed(1) + '% of speed-related crashes were fatal.') : ''}</p>
        </div>
    `;

    document.getElementById('rptTablesSection').innerHTML = '';

    // Recommendations
    document.getElementById('rptRecommendations').innerHTML = `
        <h4>Speed Management & Fatal Crash Countermeasures</h4>
        <div class="two-col">
            <div style="background:#fef2f2;padding:1rem;border-radius:var(--radius)">
                <h5 style="color:#991B1B">Engineering Countermeasures</h5>
                <ul style="font-size:.85rem;margin-left:1rem">
                    <li>Speed feedback signs and dynamic speed displays</li>
                    <li>Road diet / lane reconfiguration on high-speed corridors</li>
                    <li>Roundabouts at intersections with fatal angle crashes</li>
                    <li>Enhanced lighting at nighttime fatal crash locations</li>
                    <li>Median barriers on divided highways</li>
                    <li>Curve delineation and advisory speed signing</li>
                </ul>
            </div>
            <div style="background:#eff6ff;padding:1rem;border-radius:var(--radius)">
                <h5 style="color:#1e40af">Enforcement & Education</h5>
                <ul style="font-size:.85rem;margin-left:1rem">
                    <li>Automated speed enforcement (where legal)</li>
                    <li>High-visibility enforcement campaigns on top corridors</li>
                    <li>Speed safety camera programs</li>
                    <li>Community speed awareness programs</li>
                    <li>Safe System approach implementation</li>
                </ul>
            </div>
        </div>
    `;
    document.getElementById('rptCountermeasures').innerHTML = '';
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.cm2 = CL.reports.cm2 || {};
  window.generateCrashTreeSystemicReport = generateCrashTreeSystemicReport; CL.reports.cm2.generateCrashTreeSystemicReport = generateCrashTreeSystemicReport;
  CL._registerModule('reports/reports-countermeasures-cm2');
})();
