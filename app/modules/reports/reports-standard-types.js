/**
 * CL reports.standardTypes — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Per-type report generators + report helpers/TOC/stats.
 * Depends: core/epdo-presets, analysis/crash-profile (via window/CL mirrors).
 * Public API (dual exposure): window.<fn> ↔ CL.reports.standardTypes.<fn>
 * Module-private: reportSequence (only read by generateReportId in this file).
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
function generateCorridorReport(crashes, route, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();

    const rptTitle = document.getElementById('rptTitle');
    if (rptTitle) rptTitle.textContent = `${title}: ${route}`;
    const rptSubtitle = document.getElementById('rptSubtitle');
    if (rptSubtitle) rptSubtitle.textContent = `Corridor Crash Analysis`;
    const rptMeta = document.getElementById('rptMeta');
    if (rptMeta) rptMeta.textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // Update footer and report ID with crash count
    updateReportFooter(yearRange, reportId, stats.total);

    // Show executive summary
    showExecutiveSummary(stats, crashes, 'corridor analysis', route);

    // Show Table of Contents
    showTableOfContents('corridor');
    
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${stats.total.toLocaleString()}</div><div class="label">Total Crashes</div></div>
        <div class="report-kpi"><div class="value">${stats.K + stats.A}</div><div class="label">K+A Crashes</div></div>
        <div class="report-kpi"><div class="value">${calcEPDO(stats).toLocaleString()}</div><div class="label">EPDO Score</div></div>
        <div class="report-kpi"><div class="value">${pct(stats.K + stats.A, stats.total)}%</div><div class="label">K+A Rate</div></div>
        <div class="report-kpi"><div class="value">${stats.ped}</div><div class="label">Pedestrian</div></div>
        <div class="report-kpi"><div class="value">${stats.intersection}</div><div class="label">At Intersection</div></div>
    `;
    
    const findings = generateFindings(stats, crashes);
    document.getElementById('rptFindings').innerHTML = `<h4>Key Findings</h4>${findings.map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')}`;
    document.getElementById('rptYearlySection').innerHTML = generateYearlySection(crashes);
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section"><h4>Collision Types</h4><div style="height:220px"><canvas id="rptChartCollision"></canvas></div></div>
        <div class="report-section"><h4>Time of Day</h4><div style="height:220px"><canvas id="rptChartTime"></canvas></div></div>
    `;
    setTimeout(() => createReportCharts(stats, crashes), 100);

    // Enhanced: Node-by-node breakdown + collision type per segment + weather/light
    const nodeTable = generateNodeTable(crashes);
    const byWeather = {};
    crashes.forEach(r => { const w = r[COL.WEATHER] || 'Unknown'; byWeather[w] = (byWeather[w] || 0) + 1; });
    const byLight = {};
    crashes.forEach(r => { const l = r[COL.LIGHT] || 'Unknown'; byLight[l] = (byLight[l] || 0) + 1; });
    const weatherRows = Object.entries(byWeather).sort((a,b) => b[1]-a[1]).slice(0,6).map(([w,c]) => `<tr><td>${w}</td><td>${c}</td><td>${pct(c, stats.total)}%</td></tr>`).join('');
    const lightRows = Object.entries(byLight).sort((a,b) => b[1]-a[1]).map(([l,c]) => `<tr><td>${l}</td><td>${c}</td><td>${pct(c, stats.total)}%</td></tr>`).join('');

    document.getElementById('rptTablesSection').innerHTML = `
        ${nodeTable}
        <div class="two-col" style="margin-top:1.5rem">
            <div>
                <h4>Weather Conditions</h4>
                <table class="report-table"><thead><tr><th>Weather</th><th>Count</th><th>%</th></tr></thead><tbody>${weatherRows}</tbody></table>
            </div>
            <div>
                <h4>Light Conditions</h4>
                <table class="report-table"><thead><tr><th>Light</th><th>Count</th><th>%</th></tr></thead><tbody>${lightRows}</tbody></table>
            </div>
        </div>
    `;
    document.getElementById('rptRecommendations').innerHTML = generateRecommendations(stats, crashes);
}

function generateSafetyReport(crashes, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const kaRate = stats.total > 0 ? ((stats.K + stats.A) / stats.total * 100).toFixed(2) : 0;
    const reportId = generateReportId();

    const rptTitle = document.getElementById('rptTitle');
    if (rptTitle) rptTitle.textContent = title;
    const rptSubtitle = document.getElementById('rptSubtitle');
    if (rptSubtitle) rptSubtitle.textContent = `Traffic Safety Performance Report`;
    const rptMeta = document.getElementById('rptMeta');
    if (rptMeta) rptMeta.textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // Update footer and report ID with crash count
    updateReportFooter(yearRange, reportId, stats.total);

    // Show executive summary
    showExecutiveSummary(stats, crashes, 'safety performance analysis', getJurisdictionLabel());

    // Show Table of Contents
    showTableOfContents('safety');
    
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${stats.K}</div><div class="label">Fatal Crashes</div></div>
        <div class="report-kpi"><div class="value">${stats.A}</div><div class="label">Serious Injury</div></div>
        <div class="report-kpi"><div class="value">${kaRate}%</div><div class="label">K+A Rate</div></div>
        <div class="report-kpi"><div class="value">${calcEPDO(stats).toLocaleString()}</div><div class="label">EPDO Score</div></div>
        <div class="report-kpi"><div class="value">${stats.ped}</div><div class="label">Ped Crashes</div></div>
        <div class="report-kpi"><div class="value">${stats.bike}</div><div class="label">Bike Crashes</div></div>
    `;
    
    // Focus on severe crashes
    const severeCrashes = crashes.filter(c => ['K','A'].includes((c[COL.SEVERITY]||'').charAt(0)));
    const severeFindings = [];
    
    // Analyze severe crash patterns
    const severeByType = {};
    const severeByLight = {};
    severeCrashes.forEach(c => {
        const type = c[COL.COLLISION] || 'Unknown';
        const light = c[COL.LIGHT] || 'Unknown';
        severeByType[type] = (severeByType[type]||0)+1;
        severeByLight[light] = (severeByLight[light]||0)+1;
    });
    
    const topSevereType = Object.entries(severeByType).sort((a,b) => b[1]-a[1])[0];
    if (topSevereType) severeFindings.push({ type: 'danger', text: `Most common severe crash type: ${topSevereType[0]} (${topSevereType[1]} K+A crashes)` });
    
    const darkCrashes = Object.entries(severeByLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s,e) => s+e[1], 0);
    if (darkCrashes > severeCrashes.length * 0.3) {
        severeFindings.push({ type: 'warning', text: `${pct(darkCrashes, severeCrashes.length)}% of severe crashes occurred in dark conditions - consider lighting improvements` });
    }
    
    document.getElementById('rptFindings').innerHTML = `<h4>Safety Analysis Findings</h4>${severeFindings.concat(generateFindings(stats, crashes)).map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')}`;
    document.getElementById('rptYearlySection').innerHTML = generateYearlySection(crashes);
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section"><h4>K+A by Collision Type</h4><div style="height:220px"><canvas id="rptChartCollision"></canvas></div></div>
        <div class="report-section"><h4>K+A by Light Condition</h4><div style="height:220px"><canvas id="rptChartLight"></canvas></div></div>
    `;
    setTimeout(() => createSafetyCharts(severeCrashes), 100);

    // Enhanced: K+A tables + high-severity locations
    const kaByTypeRows = Object.entries(severeByType).sort((a,b) => b[1]-a[1]).slice(0,10).map(([t,c]) => `<tr><td>${t}</td><td>${c}</td><td>${severeCrashes.length > 0 ? (c/severeCrashes.length*100).toFixed(1) : 0}%</td></tr>`).join('');
    const kaByLightRows = Object.entries(severeByLight).sort((a,b) => b[1]-a[1]).map(([l,c]) => `<tr><td>${l}</td><td>${c}</td><td>${severeCrashes.length > 0 ? (c/severeCrashes.length*100).toFixed(1) : 0}%</td></tr>`).join('');

    document.getElementById('rptTablesSection').innerHTML = `
        <div class="two-col" style="margin-bottom:1.5rem">
            <div>
                <h4>K+A Crashes by Collision Type</h4>
                <table class="report-table"><thead><tr><th>Type</th><th>K+A Count</th><th>%</th></tr></thead><tbody>${kaByTypeRows}</tbody></table>
            </div>
            <div>
                <h4>K+A Crashes by Light Condition</h4>
                <table class="report-table"><thead><tr><th>Light</th><th>K+A Count</th><th>%</th></tr></thead><tbody>${kaByLightRows}</tbody></table>
            </div>
        </div>
        ${generateTopLocationsTable(crashes, true)}
    `;
    document.getElementById('rptRecommendations').innerHTML = generateSafetyRecommendations(stats, severeCrashes);
}

function generatePedBikeReport(crashes, title, author) {
    const pedCrashes = crashes.filter(c => isYes(c[COL.PED]));
    const bikeCrashes = crashes.filter(c => isYes(c[COL.BIKE]));
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();

    const pedStats = computeStats(pedCrashes);
    const bikeStats = computeStats(bikeCrashes);

    const pedEPDO = calcEPDO(pedStats);
    const bikeEPDO = calcEPDO(bikeStats);
    const pedKARate = pedStats.total > 0 ? ((pedStats.K + pedStats.A) / pedStats.total * 100).toFixed(1) : 0;
    const bikeKARate = bikeStats.total > 0 ? ((bikeStats.K + bikeStats.A) / bikeStats.total * 100).toFixed(1) : 0;
    const totalVRU = pedStats.total + bikeStats.total;
    const totalVRUKA = (pedStats.K + pedStats.A) + (bikeStats.K + bikeStats.A);

    const rptTitle = document.getElementById('rptTitle');
    if (rptTitle) rptTitle.textContent = title;
    const rptSubtitle = document.getElementById('rptSubtitle');
    if (rptSubtitle) rptSubtitle.textContent = `Vulnerable Road User Safety Analysis`;
    const rptMeta = document.getElementById('rptMeta');
    if (rptMeta) rptMeta.textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // Update footer and report ID with VRU crash count
    updateReportFooter(yearRange, reportId, totalVRU);

    // Show VRU-specific executive summary
    const vruStats = { total: totalVRU, K: pedStats.K + bikeStats.K, A: pedStats.A + bikeStats.A, B: pedStats.B + bikeStats.B, C: pedStats.C + bikeStats.C, O: pedStats.O + bikeStats.O, ped: pedStats.total, bike: bikeStats.total };
    showExecutiveSummary(vruStats, [...pedCrashes, ...bikeCrashes], 'vulnerable road user analysis', getJurisdictionLabel());

    // Show Table of Contents
    showTableOfContents('pedbike');
    
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi" style="background:#0891b2"><div class="value">${pedStats.total}</div><div class="label">🚶 Ped Crashes</div></div>
        <div class="report-kpi" style="background:#dc2626"><div class="value">${pedStats.K}</div><div class="label">🚶 Ped Fatal</div></div>
        <div class="report-kpi" style="background:#7c3aed"><div class="value">${pedEPDO.toLocaleString()}</div><div class="label">🚶 Ped EPDO</div></div>
        <div class="report-kpi" style="background:#059669"><div class="value">${bikeStats.total}</div><div class="label">🚴 Bike Crashes</div></div>
        <div class="report-kpi" style="background:#dc2626"><div class="value">${bikeStats.K}</div><div class="label">🚴 Bike Fatal</div></div>
        <div class="report-kpi" style="background:#7c3aed"><div class="value">${bikeEPDO.toLocaleString()}</div><div class="label">🚴 Bike EPDO</div></div>
    `;
    
    const findings = [];
    if (pedStats.K > 0) findings.push({ type: 'danger', text: `${pedStats.K} pedestrian fatalities recorded in the analysis period` });
    if (bikeStats.K > 0) findings.push({ type: 'danger', text: `${bikeStats.K} bicycle fatalities recorded in the analysis period` });
    
    if (parseFloat(pedKARate) > 25) findings.push({ type: 'warning', text: `High pedestrian K+A rate: ${pedKARate}% of pedestrian crashes result in fatal or serious injury` });
    if (parseFloat(bikeKARate) > 25) findings.push({ type: 'warning', text: `High bicycle K+A rate: ${bikeKARate}% of bicycle crashes result in fatal or serious injury` });
    
    // Light condition analysis
    const pedDark = pedCrashes.filter(c => (c[COL.LIGHT]||'').toLowerCase().includes('dark')).length;
    const bikeDark = bikeCrashes.filter(c => (c[COL.LIGHT]||'').toLowerCase().includes('dark')).length;
    const pedDarkPct = pedStats.total > 0 ? (pedDark / pedStats.total * 100).toFixed(1) : 0;
    const bikeDarkPct = bikeStats.total > 0 ? (bikeDark / bikeStats.total * 100).toFixed(1) : 0;
    
    if (parseFloat(pedDarkPct) > 30) findings.push({ type: 'warning', text: `${pedDarkPct}% of pedestrian crashes occur in dark conditions - consider enhanced lighting` });
    if (parseFloat(bikeDarkPct) > 30) findings.push({ type: 'warning', text: `${bikeDarkPct}% of bicycle crashes occur in dark conditions - consider enhanced lighting` });
    
    findings.push({ type: '', text: `Total VRU crashes: ${totalVRU} (${(totalVRU / crashes.length * 100).toFixed(2)}% of all crashes)` });
    
    document.getElementById('rptFindings').innerHTML = `<h4>🚨 Vulnerable Road User Findings</h4>${findings.map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')}`;
    
    // Comparison table
    document.getElementById('rptYearlySection').innerHTML = `
        <h4>📊 Pedestrian vs Bicycle Comparison</h4>
        <table class="data-table" style="width:100%;margin-bottom:1.5rem">
            <thead>
                <tr style="background:linear-gradient(135deg,#1e3a5f,#1e40af);color:#fff">
                    <th style="text-align:left;padding:.75rem">Metric</th>
                    <th style="text-align:center;padding:.75rem">🚶 Pedestrian</th>
                    <th style="text-align:center;padding:.75rem">🚴 Bicycle</th>
                    <th style="text-align:center;padding:.75rem">📊 Total VRU</th>
                </tr>
            </thead>
            <tbody>
                <tr><td><strong>Total Crashes</strong></td>
                    <td style="text-align:center;font-weight:600;color:#0891b2">${pedStats.total}</td>
                    <td style="text-align:center;font-weight:600;color:#059669">${bikeStats.total}</td>
                    <td style="text-align:center;font-weight:700">${totalVRU}</td></tr>
                <tr><td><strong>Fatal (K)</strong></td>
                    <td style="text-align:center"><span class="severity-badge severity-K">${pedStats.K}</span></td>
                    <td style="text-align:center"><span class="severity-badge severity-K">${bikeStats.K}</span></td>
                    <td style="text-align:center"><span class="severity-badge severity-K">${pedStats.K + bikeStats.K}</span></td></tr>
                <tr><td><strong>Serious Injury (A)</strong></td>
                    <td style="text-align:center"><span class="severity-badge severity-A">${pedStats.A}</span></td>
                    <td style="text-align:center"><span class="severity-badge severity-A">${bikeStats.A}</span></td>
                    <td style="text-align:center"><span class="severity-badge severity-A">${pedStats.A + bikeStats.A}</span></td></tr>
                <tr><td><strong>K+A Total</strong></td>
                    <td style="text-align:center;font-weight:600">${pedStats.K + pedStats.A}</td>
                    <td style="text-align:center;font-weight:600">${bikeStats.K + bikeStats.A}</td>
                    <td style="text-align:center;font-weight:700">${totalVRUKA}</td></tr>
                <tr><td><strong>K+A Rate</strong></td>
                    <td style="text-align:center;color:${parseFloat(pedKARate) > 25 ? '#dc2626' : '#059669'}">${pedKARate}%</td>
                    <td style="text-align:center;color:${parseFloat(bikeKARate) > 25 ? '#dc2626' : '#059669'}">${bikeKARate}%</td>
                    <td style="text-align:center">${totalVRU > 0 ? (totalVRUKA / totalVRU * 100).toFixed(1) : 0}%</td></tr>
                <tr><td><strong>EPDO Score</strong></td>
                    <td style="text-align:center;font-weight:600">${pedEPDO.toLocaleString()}</td>
                    <td style="text-align:center;font-weight:600">${bikeEPDO.toLocaleString()}</td>
                    <td style="text-align:center;font-weight:700">${(pedEPDO + bikeEPDO).toLocaleString()}</td></tr>
                <tr><td><strong>Dark Condition Crashes</strong></td>
                    <td style="text-align:center">${pedDark} (${pedDarkPct}%)</td>
                    <td style="text-align:center">${bikeDark} (${bikeDarkPct}%)</td>
                    <td style="text-align:center">${pedDark + bikeDark}</td></tr>
            </tbody>
        </table>
        ${generatePedBikeYearlySection(pedCrashes, bikeCrashes)}
    `;
    
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section"><h4>🚶 Pedestrian Crashes by Year</h4><div style="height:220px"><canvas id="rptChartPedYear"></canvas></div></div>
        <div class="report-section"><h4>🚴 Bicycle Crashes by Year</h4><div style="height:220px"><canvas id="rptChartBikeYear"></canvas></div></div>
        <div class="report-section"><h4>💡 Pedestrian by Light Condition</h4><div style="height:220px"><canvas id="rptChartPedLight"></canvas></div></div>
        <div class="report-section"><h4>💡 Bicycle by Light Condition</h4><div style="height:220px"><canvas id="rptChartBikeLight"></canvas></div></div>
    `;
    setTimeout(() => createEnhancedPedBikeCharts(pedCrashes, bikeCrashes), 100);

    // Enhanced: Contributing factors + people injury counts
    const allVRU = [...pedCrashes, ...bikeCrashes];
    const vruSpeed = allVRU.filter(r => isYes(r[COL.SPEED])).length;
    const vruAlcohol = allVRU.filter(r => isYes(r[COL.ALCOHOL])).length;
    const vruDistracted = allVRU.filter(r => isYes(r[COL.DISTRACTED])).length;
    const vruSenior = allVRU.filter(r => isYes(r[COL.SENIOR])).length;
    const vruYoung = allVRU.filter(r => isYes(r[COL.YOUNG])).length;

    // People injury counts from aggregates if available
    const pedKilled = crashState.aggregates?.pedCasualties?.killed || pedStats.K;
    const pedInjured = crashState.aggregates?.pedCasualties?.injured || (pedStats.A + pedStats.B + pedStats.C);

    const factorsTable = `
        <div style="margin-top:1.5rem">
            <h4>Contributing Factors (VRU Crashes)</h4>
            <div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem">
                <div style="padding:.5rem 1rem;background:#fef2f2;border-radius:var(--radius);border:1px solid #fca5a5;text-align:center">
                    <div style="font-weight:700;color:#dc2626">${vruSpeed}</div><div style="font-size:.7rem;color:#991B1B">Speed</div>
                </div>
                <div style="padding:.5rem 1rem;background:#fef3c7;border-radius:var(--radius);border:1px solid #fbbf24;text-align:center">
                    <div style="font-weight:700;color:#92400e">${vruAlcohol}</div><div style="font-size:.7rem;color:#78350f">Alcohol</div>
                </div>
                <div style="padding:.5rem 1rem;background:#eff6ff;border-radius:var(--radius);border:1px solid #93c5fd;text-align:center">
                    <div style="font-weight:700;color:#1e40af">${vruDistracted}</div><div style="font-size:.7rem;color:#1e3a8a">Distracted</div>
                </div>
                <div style="padding:.5rem 1rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0;text-align:center">
                    <div style="font-weight:700;color:#475569">${vruSenior}</div><div style="font-size:.7rem;color:#64748b">Senior</div>
                </div>
                <div style="padding:.5rem 1rem;background:#f8fafc;border-radius:var(--radius);border:1px solid #e2e8f0;text-align:center">
                    <div style="font-weight:700;color:#475569">${vruYoung}</div><div style="font-size:.7rem;color:#64748b">Young</div>
                </div>
            </div>
            <h4>People Injury Summary</h4>
            <table class="report-table">
                <thead><tr><th>Category</th><th>Killed</th><th>Injured</th></tr></thead>
                <tbody>
                    <tr><td>Pedestrians</td><td style="color:#dc2626;font-weight:bold">${pedKilled}</td><td>${pedInjured}</td></tr>
                    <tr><td>Bicyclists</td><td style="color:#dc2626;font-weight:bold">${bikeStats.K}</td><td>${bikeStats.A + bikeStats.B + bikeStats.C}</td></tr>
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('rptTablesSection').innerHTML = generatePedBikeLocationTable(pedCrashes, bikeCrashes) + factorsTable;
    document.getElementById('rptRecommendations').innerHTML = generatePedBikeRecommendations(pedStats, bikeStats, pedDarkPct, bikeDarkPct);
}

function createEnhancedPedBikeCharts(pedCrashes, bikeCrashes) {
    const years = crashState.years;
    
    // Ped by year
    const pedByYear = {};
    pedCrashes.forEach(c => {
        const y = c[COL.YEAR];
        pedByYear[y] = (pedByYear[y] || 0) + 1;
    });
    createChart('rptChartPedYear', 'bar', {
        labels: years,
        datasets: [{ label: 'Pedestrian Crashes', data: years.map(y => pedByYear[y] || 0), backgroundColor: '#0891b2', borderRadius: 4 }]
    }, { plugins: { legend: { display: false } } });
    
    // Bike by year
    const bikeByYear = {};
    bikeCrashes.forEach(c => {
        const y = c[COL.YEAR];
        bikeByYear[y] = (bikeByYear[y] || 0) + 1;
    });
    createChart('rptChartBikeYear', 'bar', {
        labels: years,
        datasets: [{ label: 'Bicycle Crashes', data: years.map(y => bikeByYear[y] || 0), backgroundColor: '#059669', borderRadius: 4 }]
    }, { plugins: { legend: { display: false } } });
    
    // Ped by light
    const pedLight = {};
    pedCrashes.forEach(c => {
        const l = c[COL.LIGHT] || 'Unknown';
        pedLight[l] = (pedLight[l] || 0) + 1;
    });
    const pedLightSorted = Object.entries(pedLight).sort((a,b) => b[1]-a[1]).slice(0,5);
    createChart('rptChartPedLight', 'doughnut', {
        labels: pedLightSorted.map(l => l[0].substring(0,20)),
        datasets: [{ data: pedLightSorted.map(l => l[1]), backgroundColor: ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1'] }]
    }, { cutout: '40%' });
    
    // Bike by light
    const bikeLight = {};
    bikeCrashes.forEach(c => {
        const l = c[COL.LIGHT] || 'Unknown';
        bikeLight[l] = (bikeLight[l] || 0) + 1;
    });
    const bikeLightSorted = Object.entries(bikeLight).sort((a,b) => b[1]-a[1]).slice(0,5);
    createChart('rptChartBikeLight', 'doughnut', {
        labels: bikeLightSorted.map(l => l[0].substring(0,20)),
        datasets: [{ data: bikeLightSorted.map(l => l[1]), backgroundColor: ['#fcd34d','#1e293b','#94a3b8','#f97316','#6366f1'] }]
    }, { cutout: '40%' });
}

function generateTrendReport(crashes, title, author) {
    const stats = computeStats(crashes);
    // Prefer the Reports tab's user-selected timeline (reportStartDate /
    // reportEndDate) so the rendered HTML preview and the Word memo both
    // show the same period the user asked for. Fall back to the crash
    // min/max when no filter is set (legacy behavior).
    const yearRange = (document.getElementById('reportStartDate')?.value || document.getElementById('reportEndDate')?.value)
        ? resolveReportPeriod('reportStartDate', 'reportEndDate')
        : getDateRange(crashes);
    const reportId = generateReportId();

    const rptTitle = document.getElementById('rptTitle');
    if (rptTitle) rptTitle.textContent = title;
    const rptSubtitle = document.getElementById('rptSubtitle');
    if (rptSubtitle) rptSubtitle.textContent = `Multi-Year Trend Analysis`;
    const rptMeta = document.getElementById('rptMeta');
    if (rptMeta) rptMeta.textContent = `Period: ${yearRange} | Prepared by: ${author} | Generated: ${getShortTimestamp()}`;

    // Update footer and report ID with crash count
    updateReportFooter(yearRange, reportId, stats.total);

    // Show executive summary
    showExecutiveSummary(stats, crashes, 'trend analysis', getJurisdictionLabel());

    // Show Table of Contents
    showTableOfContents('trend');

    const byYear = {};
    crashes.forEach(c => {
        const y = parseInt(c[COL.YEAR]) || null;
        if (!y) return;
        if (!byYear[y]) byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        byYear[y].total++;
        const s = (c[COL.SEVERITY]||'').charAt(0);
        if (byYear[y][s] !== undefined) byYear[y][s]++;
    });
    
    const years = Object.keys(byYear).sort();
    let trend = 'stable';
    if (years.length >= 3) {
        const first = byYear[years[0]].total;
        const last = byYear[years[years.length-1]].total;
        const change = (last - first) / first * 100;
        if (change > 10) trend = 'increasing';
        else if (change < -10) trend = 'decreasing';
    }
    
    document.getElementById('rptKPIs').innerHTML = `
        <div class="report-kpi"><div class="value">${stats.total.toLocaleString()}</div><div class="label">Total (${yearRange})</div></div>
        <div class="report-kpi"><div class="value">${years.length}</div><div class="label">Years Analyzed</div></div>
        <div class="report-kpi"><div class="value">${Math.round(stats.total / years.length)}</div><div class="label">Avg per Year</div></div>
        <div class="report-kpi"><div class="value" style="text-transform:capitalize">${trend}</div><div class="label">Overall Trend</div></div>
    `;
    
    const findings = [];
    if (trend === 'increasing') findings.push({ type: 'danger', text: 'Crash numbers show an increasing trend over the analysis period' });
    if (trend === 'decreasing') findings.push({ type: '', text: 'Crash numbers show a decreasing trend - positive safety improvement' });
    
    // Enhanced: Compute trend significance and forecast
    const n = years.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    years.forEach((y, i) => { sumX += i; sumY += byYear[y].total; sumXY += i * byYear[y].total; sumX2 += i * i; });
    const slope = n > 1 ? (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) : 0;
    const intercept = n > 0 ? (sumY - slope * sumX) / n : 0;
    const avgPerYear = n > 0 ? sumY / n : 0;
    const trendPct = avgPerYear > 0 ? (slope / avgPerYear * 100).toFixed(1) : '0';
    const significance = Math.abs(parseFloat(trendPct)) > 5 ? 'Statistically significant' : 'Not significant';

    if (Math.abs(slope) > 1) findings.push({ type: slope > 0 ? 'warning' : '', text: `Average annual change: ${slope > 0 ? '+' : ''}${slope.toFixed(1)} crashes/year (${trendPct}% per year, ${significance.toLowerCase()})` });

    // Forecast
    const forecastYear = parseInt(years[years.length - 1]) + 1;
    const forecast = Math.max(0, Math.round(intercept + slope * n));
    findings.push({ type: '', text: `${forecastYear} forecast: ~${forecast} crashes (based on linear trend extrapolation)` });

    // K+A separate trend
    let kaSlope = 0;
    if (n > 1) {
        let kaSumX = 0, kaSumY = 0, kaSumXY = 0, kaSumX2 = 0;
        years.forEach((y, i) => { const ka = byYear[y].K + byYear[y].A; kaSumX += i; kaSumY += ka; kaSumXY += i * ka; kaSumX2 += i * i; });
        kaSlope = (n * kaSumXY - kaSumX * kaSumY) / (n * kaSumX2 - kaSumX * kaSumX);
    }
    const kaDir = kaSlope > 0.5 ? 'increasing' : kaSlope < -0.5 ? 'decreasing' : 'stable';
    findings.push({ type: kaDir === 'increasing' ? 'danger' : kaDir === 'decreasing' ? '' : '', text: `K+A trend: ${kaDir} (${kaSlope > 0 ? '+' : ''}${kaSlope.toFixed(1)} K+A crashes/year)` });

    document.getElementById('rptFindings').innerHTML = `<h4>Trend Analysis Findings</h4>${findings.map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')}`;
    document.getElementById('rptYearlySection').innerHTML = generateYearlySection(crashes);
    document.getElementById('rptChartsSection').innerHTML = `
        <div class="report-section"><h4>Crash Trend</h4><div style="height:220px"><canvas id="rptChartTrend"></canvas></div></div>
        <div class="report-section"><h4>K+A Trend</h4><div style="height:220px"><canvas id="rptChartKATrend"></canvas></div></div>
    `;
    setTimeout(() => createTrendCharts(byYear), 100);

    // Enhanced: Trend statistics table + forecast
    const trendRows = years.map(y => {
        const d = byYear[y];
        return `<tr><td>${y}</td><td>${d.total}</td><td>${d.K + d.A}</td><td>${calcEPDO(d).toLocaleString()}</td></tr>`;
    }).join('');

    document.getElementById('rptTablesSection').innerHTML = `
        <h4>Yearly Summary with EPDO</h4>
        <table class="report-table">
            <thead><tr><th>Year</th><th>Total</th><th>K+A</th><th>EPDO</th></tr></thead>
            <tbody>${trendRows}
                <tr style="background:#eff6ff;font-weight:bold"><td>${forecastYear} (Forecast)</td><td>${forecast}</td><td>-</td><td>-</td></tr>
            </tbody>
        </table>
        <div style="margin-top:1rem;font-size:.8rem;color:#64748b">
            <p><strong>Trend Slope:</strong> ${slope > 0 ? '+' : ''}${slope.toFixed(2)} crashes/year | <strong>Significance:</strong> ${significance}</p>
        </div>
    `;
    document.getElementById('rptRecommendations').innerHTML = '';
}

// ============================================
// REPORT HELPER FUNCTIONS
// ============================================

/**
 * Generate unique report ID for tracking
 * Format: CLR-YYYY-MMDD-XXX (e.g., CLR-2026-0111-001)
 */
let reportSequence = 0;
function generateReportId() {
    reportSequence++;
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const seq = String(reportSequence).padStart(3, '0');
    return `CLR-${year}-${month}${day}-${seq}`;
}

/**
 * Generate full timestamp with date and time
 * Format: January 11, 2026 at 2:45:32 PM EST
 */
function getFullTimestamp() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    };
    return now.toLocaleString('en-US', options);
}

/**
 * Generate short date format for headers
 */
function getShortTimestamp() {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Build executive summary content for standard reports
 */
function buildExecutiveSummary(stats, crashes, reportType, locationName) {
    const keyPoints = [];
    const epdo = calcEPDO(stats);
    const kaRate = stats.total > 0 ? ((stats.K + stats.A) / stats.total * 100).toFixed(1) : 0;

    // Total crashes summary
    keyPoints.push(`<strong>${stats.total.toLocaleString()}</strong> total crashes analyzed in this ${reportType || 'analysis'}`);

    // Severity highlight (CC 324 BUG C — comma-format integer counts)
    if (stats.K > 0 || stats.A > 0) {
        const sevText = [];
        if (stats.K > 0) sevText.push(`<span style="color:#dc2626;font-weight:600">${stats.K.toLocaleString()} fatal</span>`);
        if (stats.A > 0) sevText.push(`<span style="color:#ea580c;font-weight:600">${stats.A.toLocaleString()} serious injury</span>`);
        keyPoints.push(`Includes ${sevText.join(' and ')} crash${(stats.K + stats.A) > 1 ? 'es' : ''} (${kaRate}% K+A rate)`);
    }

    // EPDO score
    keyPoints.push(`EPDO Score: <strong>${epdo.toLocaleString()}</strong> (weighted severity measure)`);

    // VRU highlight (CC 324 BUG C — comma-format integer counts)
    if (stats.ped > 0 || stats.bike > 0) {
        const vruParts = [];
        if (stats.ped > 0) vruParts.push(`${stats.ped.toLocaleString()} pedestrian`);
        if (stats.bike > 0) vruParts.push(`${stats.bike.toLocaleString()} bicycle`);
        keyPoints.push(`Vulnerable road users: ${vruParts.join(', ')} crashes identified`);
    }

    // Top collision type (CC 324 BUG J — prefer matview byCollision when crashes
    // is a hydrated stub; skip 'Unknown'/empty buckets so a real category wins).
    const byType = {};
    const _M = window._reportMatviewData;
    if (_M && _M.byCollision && Object.keys(_M.byCollision).length > 0) {
        Object.entries(_M.byCollision).forEach(([k, v]) => { byType[k] = (byType[k] || 0) + (Number(v) || 0); });
    } else {
        crashes.forEach(c => { const t = c[COL.COLLISION] || 'Unknown'; byType[t] = (byType[t] || 0) + 1; });
    }
    const topType = Object.entries(byType)
        .filter(([k]) => k && k.toLowerCase() !== 'unknown')
        .sort((a, b) => b[1] - a[1])[0];
    if (topType && topType[1] > 1) {
        const pct = ((topType[1] / stats.total) * 100).toFixed(0);
        keyPoints.push(`Most common crash type: <strong>${topType[0]}</strong> (${pct}% of crashes)`);
    }

    return `
        <div style="display:flex;flex-direction:column;gap:.5rem">
            ${keyPoints.map(p => `<div style="display:flex;align-items:flex-start;gap:.5rem">
                <span style="color:#0ea5e9;font-weight:bold">•</span>
                <span>${p}</span>
            </div>`).join('')}
        </div>
    `;
}

/**
 * Update the standard report footer with dynamic data
 */
function updateReportFooter(yearRange, reportId, crashCount = 0) {
    const footerTimestamp = document.getElementById('rptFooterTimestamp');
    const footerPeriod = document.getElementById('rptFooterPeriod');
    const footerReportId = document.getElementById('rptReportId');
    const footerReportIdBottom = document.getElementById('rptFooterReportId');
    const footerCitation = document.getElementById('rptFooterCitation');
    const footerPage = document.getElementById('rptFooterPage');

    const timestamp = getFullTimestamp();

    if (footerTimestamp) footerTimestamp.textContent = `Generated: ${timestamp}`;
    // CC 324 BUG D — yearRange may be '--' when crashes is a hydrated stub.
    // Derive a meaningful range from matview byYear keys so the footer never
    // renders "Analysis Period: --". State-agnostic.
    let displayYearRange = yearRange;
    if (!displayYearRange || displayYearRange === '--') {
        const M = window._reportMatviewData;
        const ys = (M && M.byYear) ? Object.keys(M.byYear).map(Number).filter(n => n > 1900).sort() : [];
        displayYearRange = ys.length ? `All Years (${ys[0]}–${ys[ys.length - 1]})` : 'All Years';
    }
    if (footerPeriod) footerPeriod.textContent = `Analysis Period: ${displayYearRange}`;
    if (footerReportId) footerReportId.textContent = reportId;
    if (footerReportIdBottom) footerReportIdBottom.textContent = `Report ID: ${reportId}`;
    if (footerCitation) {
        // CC 324 BUG B — state-aware DMV citation. Title-case the runtime state
        // key so the footer reads "Delaware DMV records" / "Virginia DMV records"
        // instead of a hardcoded literal. State-agnostic.
        const stateRaw = (window.crashLensClient && window.crashLensClient.state) || '';
        const stateDisplay = stateRaw
            ? stateRaw.charAt(0).toUpperCase() + stateRaw.slice(1).toLowerCase()
            : 'State';
        const citationText = crashCount > 0
            ? `${crashCount.toLocaleString()} crashes analyzed from ${stateDisplay} DMV records`
            : getDataSourceLabel();
        footerCitation.textContent = citationText;
    }
    if (footerPage) footerPage.textContent = 'Page 1 of 1';
}

/**
 * Generate and display Table of Contents for standard reports
 */
function showTableOfContents(reportType, sections) {
    const tocSection = document.getElementById('rptTableOfContents');
    const tocContent = document.getElementById('rptTOCContent');

    if (!tocSection || !tocContent) return;

    // Define sections based on report type
    const tocSections = sections || getDefaultTOCSections(reportType);

    if (tocSections.length === 0) {
        tocSection.style.display = 'none';
        return;
    }

    // Build TOC HTML
    tocContent.innerHTML = tocSections.map((section, idx) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:.35rem .5rem;background:${idx % 2 === 0 ? '#fff' : '#f1f5f9'};border-radius:4px">
            <span style="color:#334155">${section.icon || ''} ${section.title}</span>
            <span style="color:#94a3b8;font-size:.75rem">${section.page || idx + 1}</span>
        </div>
    `).join('');

    tocSection.style.display = 'block';
}

/**
 * Get default TOC sections based on report type
 */
function getDefaultTOCSections(reportType) {
    const commonSections = [
        { title: 'Executive Summary', icon: '📋', page: 1 },
        { title: 'Key Performance Indicators', icon: '📊', page: 1 },
        { title: 'Key Findings', icon: '🔍', page: 1 }
    ];

    switch(reportType) {
        case 'dashboard':
        case 'systemwide':
            return [
                ...commonSections,
                { title: 'Severity Distribution & EPDO', icon: '⚠️', page: 2 },
                { title: 'Year-Over-Year Comparison', icon: '📅', page: 2 },
                { title: 'Safety Focus Exploration', icon: '🔍', page: 3 },
                { title: 'Quick Facts Panel', icon: '📊', page: 3 },
                { title: 'Top Locations by Category', icon: '📍', page: 3 },
                { title: 'Prioritized Recommendations', icon: '💡', page: 4 }
            ];
        case 'corridor':
        case 'intersection':
            return [
                ...commonSections,
                { title: 'Yearly Breakdown', icon: '📅', page: 2 },
                { title: 'Collision Type Analysis', icon: '💥', page: 2 },
                { title: 'Time of Day Analysis', icon: '🕐', page: 2 },
                { title: 'Node/Location Analysis', icon: '📍', page: 3 },
                { title: 'Weather & Light Conditions', icon: '🌤️', page: 3 },
                { title: 'Recommendations', icon: '💡', page: 3 }
            ];
        case 'safety':
            return [
                ...commonSections,
                { title: 'Yearly Breakdown', icon: '📅', page: 2 },
                { title: 'K+A by Collision Type', icon: '💥', page: 2 },
                { title: 'K+A by Light Condition', icon: '💡', page: 2 },
                { title: 'High-Severity Locations', icon: '📍', page: 3 },
                { title: 'Safety Recommendations', icon: '🛡️', page: 3 }
            ];
        case 'pedbike':
            return [
                ...commonSections,
                { title: 'Pedestrian Crash Analysis', icon: '🚶', page: 2 },
                { title: 'Bicycle Crash Analysis', icon: '🚴', page: 2 },
                { title: 'People Injury Analysis', icon: '🏥', page: 3 },
                { title: 'Contributing Factors', icon: '⚡', page: 3 },
                { title: 'Light Condition Analysis', icon: '💡', page: 3 },
                { title: 'VRU Hotspot Locations', icon: '📍', page: 3 },
                { title: 'VRU Safety Recommendations', icon: '🛡️', page: 4 }
            ];
        case 'trend':
            return [
                ...commonSections,
                { title: 'Yearly Breakdown', icon: '📅', page: 2 },
                { title: 'Crash Trend Analysis', icon: '📈', page: 2 },
                { title: 'K+A Trend Analysis', icon: '⚠️', page: 2 }
            ];
        case 'safetyfocus':
            return [
                ...commonSections,
                { title: 'Safety Category Breakdown', icon: '🛡️', page: 2 },
                { title: 'Category Details', icon: '📋', page: 2 },
                { title: 'Recommendations', icon: '💡', page: 3 }
            ];
        case 'countermeasures':
            return [
                ...commonSections,
                { title: 'Location Overview', icon: '📍', page: 2 },
                { title: 'Crash Profile', icon: '💥', page: 2 },
                { title: 'Recommended Countermeasures', icon: '🔧', page: 3 },
                { title: 'Implementation Priority', icon: '⭐', page: 3 }
            ];
        case 'crashtree':
            return [
                ...commonSections,
                { title: 'Facility Type Breakdown', icon: '🏗️', page: 2 },
                { title: 'Crash Type Hierarchy', icon: '🌳', page: 2 },
                { title: 'Contributing Factors Tree', icon: '⚡', page: 3 },
                { title: 'Cross-Analysis Matrix', icon: '📊', page: 3 },
                { title: 'High-Risk Combinations', icon: '🎯', page: 4 },
                { title: 'FHWA Systemic Recommendations', icon: '💡', page: 4 }
            ];
        case 'fatalspeed':
            return [
                ...commonSections,
                { title: 'Fatal Crash Analysis', icon: '☠️', page: 2 },
                { title: 'Speed-Related Analysis', icon: '🏎️', page: 2 },
                { title: 'Combined Risk Analysis', icon: '⚠️', page: 3 },
                { title: 'High-Risk Corridors', icon: '📍', page: 3 },
                { title: 'Countermeasures & Recommendations', icon: '💡', page: 4 }
            ];
        case 'hotspot':
            return [
                ...commonSections,
                { title: 'Ranking Methodology', icon: '📐', page: 2 },
                { title: 'Top Locations Ranking', icon: '🏆', page: 2 },
                { title: 'Detailed Location Profiles', icon: '📍', page: 3 },
                { title: 'Route-Level Summary', icon: '🛣️', page: 4 },
                { title: 'Prioritized Recommendations', icon: '💡', page: 4 }
            ];
        case 'beforeafter':
            return [
                ...commonSections,
                { title: 'Study Design', icon: '📐', page: 2 },
                { title: 'Before Period Statistics', icon: '📊', page: 2 },
                { title: 'After Period Statistics', icon: '📊', page: 3 },
                { title: 'Statistical Comparison', icon: '📈', page: 3 },
                { title: 'Conclusions & Recommendations', icon: '💡', page: 4 }
            ];
        case 'grantsupport':
            return [
                ...commonSections,
                { title: 'Project Justification', icon: '📋', page: 2 },
                { title: 'Location Rankings', icon: '🏆', page: 2 },
                { title: 'Benefit-Cost Analysis Data', icon: '💰', page: 3 },
                { title: 'Supporting Data Tables', icon: '📊', page: 3 },
                { title: 'Data Source Citations', icon: '📚', page: 4 }
            ];
        default:
            return commonSections;
    }
}

/**
 * Show and populate executive summary section
 */
function showExecutiveSummary(stats, crashes, reportType, locationName) {
    const execSection = document.getElementById('rptExecutiveSummary');
    const execContent = document.getElementById('rptExecContent');

    if (execSection && execContent) {
        execContent.innerHTML = buildExecutiveSummary(stats, crashes, reportType, locationName);
        execSection.style.display = 'block';
    }
}

// Helper functions
function computeStats(crashes) {
    // Round 23 §1.3 — when the report generator was hydrated from matviews
    // (window._reportMatviewData populated by §1.2), prefer the pre-aggregated
    // totals over iterating empty stub crashes. State-agnostic.
    const M = window._reportMatviewData;
    if (M && M.total > 0) {
        return {
            total: M.total,
            K: M.bySeverity?.K || 0,
            A: M.bySeverity?.A || 0,
            B: M.bySeverity?.B || 0,
            C: M.bySeverity?.C || 0,
            O: M.bySeverity?.O || 0,
            ped: M.ped || 0,
            bike: M.bike || 0,
            intersection: 0  // not surfaced by dashboard_summary; left 0
        };
    }
    const stats = { total: crashes.length, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0, intersection: 0 };
    crashes.forEach(c => {
        // Normalize severity to uppercase first character
        const rawSev = (c[COL.SEVERITY] || '').toString().trim().toUpperCase();
        const s = rawSev.charAt(0);
        // Only count valid severity codes
        if (['K', 'A', 'B', 'C', 'O'].includes(s)) {
            stats[s]++;
        } else if (rawSev === '' || rawSev === 'UNKNOWN') {
            // Default unknown severity to 'O' (PDO)
            stats.O++;
        }
        if (isYes(c[COL.PED])) stats.ped++;
        if (isYes(c[COL.BIKE])) stats.bike++;
        if (isIntersection(c)) stats.intersection++;
    });

    // Validate totals
    const severitySum = stats.K + stats.A + stats.B + stats.C + stats.O;
    if (severitySum !== stats.total) {
        console.warn(`[Report Stats] Severity count mismatch: ${severitySum} vs ${stats.total} total. Difference: ${stats.total - severitySum}`);
    }

    return stats;
}

/**
 * Validate crash data for report accuracy
 */
function validateReportData(crashes, stats) {
    const issues = [];

    // Check for empty dataset
    if (!crashes || crashes.length === 0) {
        issues.push('No crash data available for the selected filters');
        return issues;
    }

    // Check severity distribution
    const severitySum = stats.K + stats.A + stats.B + stats.C + stats.O;
    if (severitySum !== stats.total) {
        issues.push(`Severity sum (${severitySum}) doesn't match total (${stats.total})`);
    }

    // Check for unusual patterns
    if (stats.K > stats.total * 0.1) {
        issues.push(`High fatality rate detected: ${stats.K} fatalities out of ${stats.total} crashes`);
    }

    return issues;
}

function getDateRange(crashes) {
    const dates = crashes.map(c => c[COL.DATE] ? new Date(Number(c[COL.DATE])) : null).filter(d => d && !isNaN(d.getTime()));
    if (!dates.length) return '--';
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    return `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
}

/**
 * Shared helper: resolve the "Period:" string for a PDF / Excel / HTML report
 * from a tab's Start Date / End Date input ids. Every tab (Map, Hotspots,
 * Intersection, Segments, Ped, Bike, Safety Focus, Before/After, ...) has its
 * own date filter, and the corresponding export MUST display the same window
 * the user picked in the UI — not the min/max of the crashes that happened
 * to land inside the selection and not the full available data range.
 *
 * Priority:
 *   1. Explicit Start + End inputs (passed in as element ids)
 *   2. Start-only → "MM/DD/YYYY - Present"
 *   3. End-only   → "Up to MM/DD/YYYY"
 *   4. Fall back to the full available data range (`crashState.years`)
 *   5. Last resort: 'N/A'
 *
 * Dates are parsed in LOCAL time to avoid UTC off-by-one from the
 * `YYYY-MM-DD` value that HTML <input type="date"> uses.
 *
 * @param {string} startInputId - element id of the Start Date input (may be null)
 * @param {string} endInputId   - element id of the End Date input (may be null)
 * @returns {string} "MM/DD/YYYY - MM/DD/YYYY" | "YYYY - YYYY" | "N/A"
 */
function resolveReportPeriod(startInputId, endInputId) {
    const fmt = (d) => {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${mm}/${dd}/${d.getFullYear()}`;
    };
    const parseLocal = (str) => {
        if (!str) return null;
        const parts = String(str).split('-').map(Number);
        if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };
    const startRaw = startInputId ? document.getElementById(startInputId)?.value : '';
    const endRaw = endInputId ? document.getElementById(endInputId)?.value : '';
    const startDate = parseLocal(startRaw);
    const endDate = parseLocal(endRaw);

    if (startDate && endDate) return `${fmt(startDate)} - ${fmt(endDate)}`;
    if (startDate) return `${fmt(startDate)} - Present`;
    if (endDate) return `Up to ${fmt(endDate)}`;

    // Full available data range fallback
    try {
        if (typeof crashState !== 'undefined' && Array.isArray(crashState.years) && crashState.years.length > 0) {
            const yrs = crashState.years.slice().sort();
            return `${yrs[0]} - ${yrs[yrs.length - 1]}`;
        }
    } catch (_) { /* crashState not ready yet */ }
    return 'N/A';
}

function generateFindings(stats, crashes) {
    const findings = [];
    const kaRate = stats.total > 0 ? (stats.K + stats.A) / stats.total * 100 : 0;
    
    if (stats.K > 0) findings.push({ type: 'danger', text: `${stats.K} fatal crash(es) recorded - highest priority for safety countermeasures` });
    if (kaRate > 5) findings.push({ type: 'warning', text: `K+A rate of ${kaRate.toFixed(1)}% indicates elevated severe crash frequency` });
    if (stats.ped > 5) findings.push({ type: 'warning', text: `${stats.ped} pedestrian-involved crashes - consider pedestrian safety improvements` });
    if (stats.bike > 3) findings.push({ type: '', text: `${stats.bike} bicycle-involved crashes recorded` });
    
    // Collision type analysis
    const byType = {};
    crashes.forEach(c => { const t = c[COL.COLLISION]||'Unknown'; byType[t]=(byType[t]||0)+1; });
    const topType = Object.entries(byType).sort((a,b) => b[1]-a[1])[0];
    if (topType && topType[1] > stats.total * 0.2) {
        findings.push({ type: '', text: `Predominant crash type: ${topType[0]} (${pct(topType[1], stats.total)}% of crashes)` });
    }
    
    return findings;
}
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.reports = CL.reports || {};
  CL.reports.standardTypes = CL.reports.standardTypes || {};
  window.generateCorridorReport = generateCorridorReport; CL.reports.standardTypes.generateCorridorReport = generateCorridorReport;
  window.generateSafetyReport = generateSafetyReport; CL.reports.standardTypes.generateSafetyReport = generateSafetyReport;
  window.generatePedBikeReport = generatePedBikeReport; CL.reports.standardTypes.generatePedBikeReport = generatePedBikeReport;
  window.createEnhancedPedBikeCharts = createEnhancedPedBikeCharts; CL.reports.standardTypes.createEnhancedPedBikeCharts = createEnhancedPedBikeCharts;
  window.generateTrendReport = generateTrendReport; CL.reports.standardTypes.generateTrendReport = generateTrendReport;
  window.generateReportId = generateReportId; CL.reports.standardTypes.generateReportId = generateReportId;
  window.getFullTimestamp = getFullTimestamp; CL.reports.standardTypes.getFullTimestamp = getFullTimestamp;
  window.getShortTimestamp = getShortTimestamp; CL.reports.standardTypes.getShortTimestamp = getShortTimestamp;
  window.buildExecutiveSummary = buildExecutiveSummary; CL.reports.standardTypes.buildExecutiveSummary = buildExecutiveSummary;
  window.updateReportFooter = updateReportFooter; CL.reports.standardTypes.updateReportFooter = updateReportFooter;
  window.showTableOfContents = showTableOfContents; CL.reports.standardTypes.showTableOfContents = showTableOfContents;
  window.getDefaultTOCSections = getDefaultTOCSections; CL.reports.standardTypes.getDefaultTOCSections = getDefaultTOCSections;
  window.showExecutiveSummary = showExecutiveSummary; CL.reports.standardTypes.showExecutiveSummary = showExecutiveSummary;
  window.computeStats = computeStats; CL.reports.standardTypes.computeStats = computeStats;
  window.validateReportData = validateReportData; CL.reports.standardTypes.validateReportData = validateReportData;
  window.getDateRange = getDateRange; CL.reports.standardTypes.getDateRange = getDateRange;
  window.resolveReportPeriod = resolveReportPeriod; CL.reports.standardTypes.resolveReportPeriod = resolveReportPeriod;
  window.generateFindings = generateFindings; CL.reports.standardTypes.generateFindings = generateFindings;
  CL._registerModule('reports/reports-standard-types');
})();
