/**
 * CL reports.standardTypes2 — extracted (name-anchored). navigateTo-split
 * round, prompt 42b1. Safety-Focus report + yearly/location tables +
 * recommendation helpers.
 * Depends: core/epdo-presets, analysis/crash-profile (via window/CL mirrors).
 * Public API (dual exposure): window.<fn> ↔ CL.reports.standardTypes2.<fn>
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
// Safety Focus Report Generator
function generateSafetyFocusReport(crashes, title, author, startDate, endDate) {
    // Check if there's data from Safety Focus tab
    if (!safetyState || !safetyState.loaded) {
        hideLoading();
        alert('Please load crash data and visit the Safety Focus tab first.');
        return;
    }

    // Check if specific data was selected for report
    let reportData = safetyState.reportData;

    // If no specific selection, generate overall Safety Focus summary
    if (!reportData) {
        reportData = {
            title: 'Safety Focus Summary',
            type: 'summary'
        };
    }

    // Process safety data from filtered crashes if date filter was applied
    // This allows Report tab date filters to take precedence
    let safetyData = safetyState.data;
    if (startDate || endDate) {
        safetyData = processSafetyDataForReport(crashes);
    }

    // Determine date range for display
    let dateRange;
    if (startDate || endDate) {
        const startStr = startDate ? new Date(startDate).toLocaleDateString() : 'Beginning';
        const endStr = endDate ? new Date(endDate).toLocaleDateString() : 'Present';
        dateRange = `${startStr} - ${endStr}`;
    } else if (safetyState.filters.dateStart && safetyState.filters.dateEnd) {
        dateRange = `${new Date(safetyState.filters.dateStart).toLocaleDateString()} - ${new Date(safetyState.filters.dateEnd).toLocaleDateString()}`;
    } else {
        dateRange = getDateRange(crashState.sampleRows);
    }

    document.getElementById('rptTitle').textContent = reportData.type === 'summary' ? 'Safety Focus Analysis Report' : title;
    document.getElementById('rptSubtitle').textContent = reportData.title;
    document.getElementById('rptMeta').textContent = `Period: ${dateRange} | Prepared by: ${author} | Generated: ${new Date().toLocaleDateString()}`;

    // Count total safety crashes for footer
    const categories = ['curves', 'workzone', 'school', 'guardrail', 'senior', 'young'];
    let totalSafetyCrashesForFooter = 0;
    categories.forEach(cat => {
        const catData = safetyData[cat];
        if (catData) totalSafetyCrashesForFooter += catData.crashes.length;
    });

    // Update footer and report ID with crash count
    const reportId = generateReportId();
    updateReportFooter(dateRange, reportId, totalSafetyCrashesForFooter);

    // Show Table of Contents
    showTableOfContents('safetyfocus');

    // Show executive summary for safety focus
    const safetyStats = { total: totalSafetyCrashesForFooter, K: 0, A: 0, B: 0, C: 0, O: 0, ped: 0, bike: 0 };
    categories.forEach(cat => {
        const catData = safetyData[cat];
        if (catData && catData.severity) {
            safetyStats.K += catData.severity.K || 0;
            safetyStats.A += catData.severity.A || 0;
            safetyStats.B += catData.severity.B || 0;
            safetyStats.C += catData.severity.C || 0;
            safetyStats.O += catData.severity.O || 0;
        }
    });
    showExecutiveSummary(safetyStats, crashes, 'safety focus analysis', getJurisdictionLabel());

    // Generate KPIs section
    if (reportData.type === 'summary') {
        // Overall summary of all safety categories
        const categories = ['curves', 'workzone', 'school', 'guardrail', 'senior', 'young'];
        let totalSafetyCrashes = 0;
        let kpiHtml = '';

        categories.forEach(cat => {
            const catData = safetyData[cat];
            if (!catData) return;
            const count = catData.crashes.length;
            totalSafetyCrashes += count;
            const catConfig = safetyCategories[cat];
            kpiHtml += `<div class="report-kpi"><div class="value">${count.toLocaleString()}</div><div class="label">${catConfig.icon} ${catConfig.name}</div></div>`;
        });

        document.getElementById('rptKPIs').innerHTML = kpiHtml;

        // Generate findings
        const findings = [];
        categories.forEach(cat => {
            const catData = safetyData[cat];
            if (!catData) return;
            const catConfig = safetyCategories[cat];
            if (catData.crashes.length > 0) {
                const kaCount = catData.severity.K + catData.severity.A;
                if (catData.severity.K > 0) {
                    findings.push({ type: 'danger', text: `${catConfig.icon} ${catConfig.name}: ${catData.severity.K} fatal crashes recorded` });
                }
                if (kaCount > 10) {
                    findings.push({ type: 'warning', text: `${catConfig.icon} ${catConfig.name}: ${kaCount} K+A injuries - high priority` });
                }
            }
        });

        document.getElementById('rptFindings').innerHTML = findings.length > 0
            ? findings.map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')
            : '<div class="finding-item">No critical safety findings identified</div>';

        // Generate detailed breakdown table
        let detailHtml = `<h3 style="margin-top:1.5rem;margin-bottom:.75rem">📊 Safety Category Breakdown</h3>`;
        detailHtml += `<table class="data-table" style="margin-bottom:1.5rem">
            <thead><tr><th>Category</th><th>Total</th><th>K</th><th>A</th><th>B</th><th>C</th><th>O</th><th>EPDO</th><th>Top Location</th></tr></thead><tbody>`;

        categories.forEach(cat => {
            const catData = safetyData[cat];
            if (!catData) return;
            const catConfig = safetyCategories[cat];
            const epdo = calculateEPDO(catData.severity);
            
            // Get top location
            const topRoute = Object.entries(catData.byRoute)
                .sort((a, b) => b[1].crashes.length - a[1].crashes.length)[0];
            const topLoc = topRoute ? topRoute[0].replace(/^S-VA\d+[A-Z]*\s*/, '') : '-';
            
            detailHtml += `<tr>
                <td><strong>${catConfig.icon} ${catConfig.name}</strong></td>
                <td>${catData.crashes.length}</td>
                <td style="color:#dc2626;font-weight:600">${catData.severity.K}</td>
                <td style="color:#ea580c;font-weight:600">${catData.severity.A}</td>
                <td>${catData.severity.B}</td>
                <td>${catData.severity.C}</td>
                <td>${catData.severity.O}</td>
                <td><strong>${epdo.toLocaleString()}</strong></td>
                <td>${topLoc.substring(0, 20)}</td>
            </tr>`;
        });
        detailHtml += '</tbody></table>';
        
        // Add cross-analysis section
        detailHtml += `<h3 style="margin-bottom:.75rem">🔀 Cross-Analysis Insights</h3>`;
        detailHtml += `<div class="three-col" style="margin-bottom:1rem">`;
        detailHtml += `<div class="stat-box"><div class="value">${document.getElementById('crossCurveGuardrail')?.textContent || '0'}</div><div class="label">Curves + Guardrail</div></div>`;
        detailHtml += `<div class="stat-box"><div class="value" style="color:#dc2626">${document.getElementById('crossCurveNoGuardrail')?.textContent || '0'}</div><div class="label">Curves + No Guardrail (K/A)</div></div>`;
        detailHtml += `<div class="stat-box"><div class="value">${document.getElementById('crossSchoolYoung')?.textContent || '0'}</div><div class="label">School + Young Driver</div></div>`;
        detailHtml += `</div>`;
        
        document.getElementById('rptChartsSection').innerHTML = detailHtml;
        document.getElementById('rptYearlySection').innerHTML = '';
        document.getElementById('rptTablesSection').innerHTML = '';
        document.getElementById('rptRecommendations').innerHTML = generateSafetyFocusRecommendations(categories);
        
    } else {
        // Specific selection report (from cross-analysis or location detail)
        const crashes = reportData.crashes;
        const severity = reportData.severity;
        const epdo = reportData.epdo;
        
        document.getElementById('rptKPIs').innerHTML = `
            <div class="report-kpi"><div class="value">${crashes.length.toLocaleString()}</div><div class="label">Total Crashes</div></div>
            <div class="report-kpi"><div class="value" style="color:#dc2626">${severity.K}</div><div class="label">Fatal (K)</div></div>
            <div class="report-kpi"><div class="value" style="color:#ea580c">${severity.A}</div><div class="label">Serious (A)</div></div>
            <div class="report-kpi"><div class="value">${severity.B + severity.C}</div><div class="label">Other Injury</div></div>
            <div class="report-kpi"><div class="value">${severity.O}</div><div class="label">PDO</div></div>
            <div class="report-kpi"><div class="value">${epdo.toLocaleString()}</div><div class="label">EPDO Score</div></div>
        `;
        
        // Generate findings for specific selection
        const findings = [];
        if (severity.K > 0) findings.push({ type: 'danger', text: `${severity.K} fatal crash(es) at this location - immediate action required` });
        if (severity.A > 0) findings.push({ type: 'warning', text: `${severity.A} serious injury crash(es) - high priority for countermeasures` });
        const kaRate = crashes.length > 0 ? ((severity.K + severity.A) / crashes.length * 100) : 0;
        if (kaRate > 10) findings.push({ type: 'warning', text: `K+A rate of ${kaRate.toFixed(1)}% exceeds typical threshold` });
        
        document.getElementById('rptFindings').innerHTML = findings.length > 0 
            ? findings.map(f => `<div class="finding-item ${f.type}">${f.text}</div>`).join('')
            : '<div class="finding-item">Safety analysis complete - review recommendations</div>';
        
        // Generate crash list
        let detailHtml = `<h3 style="margin-top:1.5rem;margin-bottom:.75rem">📋 Crash Records (${Math.min(crashes.length, 25)} of ${crashes.length})</h3>`;
        detailHtml += `<div class="table-wrapper"><table class="data-table"><thead><tr><th>Doc #</th><th>Date</th><th>Severity</th><th>Collision Type</th><th>Route</th></tr></thead><tbody>`;
        
        crashes.slice(0, 25).forEach(row => {
            const sev = extractSeverity(row);
            detailHtml += `<tr>
                <td>${row[COL.ID] || '-'}</td>
                <td>${row[COL.DATE] || '-'}</td>
                <td><span class="severity-badge severity-${sev}">${sev}</span></td>
                <td>${(row[COL.COLLISION] || '-').replace(/^\d+\.\s*/, '').substring(0, 25)}</td>
                <td>${(row[COL.ROUTE] || '-').replace(/^S-VA\d+[A-Z]*\s*/, '').substring(0, 20)}</td>
            </tr>`;
        });
        detailHtml += '</tbody></table></div>';
        
        if (crashes.length > 25) {
            detailHtml += `<p style="color:var(--gray);font-size:.85rem;margin-top:.5rem">Showing 25 of ${crashes.length} records. Export data for complete list.</p>`;
        }
        
        document.getElementById('rptChartsSection').innerHTML = detailHtml;
        document.getElementById('rptYearlySection').innerHTML = '';
        document.getElementById('rptTablesSection').innerHTML = '';
        document.getElementById('rptRecommendations').innerHTML = generateSafetyFocusRecommendations(null, reportData);
    }
    
    // Clear the report data after generating
    safetyState.reportData = null;
}

// Generate recommendations for Safety Focus reports
function generateSafetyFocusRecommendations(categories, reportData) {
    const recs = [];
    
    if (categories) {
        // Summary report recommendations based on all categories
        categories.forEach(cat => {
            const catData = safetyState.data[cat];
            const catConfig = safetyCategories[cat];
            
            if (catData.severity.K > 0) {
                recs.push(`🚨 <strong>${catConfig.name}:</strong> Review all ${catData.severity.K} fatal crash locations for immediate countermeasures`);
            }
            if (catData.severity.K + catData.severity.A > 5) {
                recs.push(`⚠️ <strong>${catConfig.name}:</strong> Prioritize K+A locations for safety improvements`);
            }
        });
        
        // Category-specific recommendations
        if (safetyState.data['curves']?.crashes.length > 20) {
            recs.push('🛣️ Consider systemic curve warning sign and delineation improvements');
        }
        if (safetyState.data['guardrail']?.severity.K > 0) {
            recs.push('🛡️ Review guardrail end treatments and transition points at fatal crash locations');
        }
        if (safetyState.data['workzone']?.crashes.length > 10) {
            recs.push('🚧 Enhance work zone traffic control plans and temporary traffic management');
        }
        if (safetyState.data['school']?.crashes.length > 0) {
            recs.push('🏫 Coordinate with schools on student safety and crossing programs');
        }
        if (safetyState.data['senior']?.crashes.length > 50) {
            recs.push('👴 Consider larger signage and improved intersection visibility for senior drivers');
        }
        if (safetyState.data['young']?.crashes.length > 50) {
            recs.push('🧑 Partner with DMV/schools on young driver education programs');
        }
        
    } else if (reportData) {
        // Specific selection recommendations
        if (reportData.severity.K > 0) {
            recs.push('🚨 Immediate investigation required for fatal crash locations');
        }
        if (reportData.severity.A > 0) {
            recs.push('⚠️ High priority: Review serious injury crash contributing factors');
        }
        if (reportData.category === 'curves' || reportData.type === 'cross') {
            recs.push('Consider enhanced curve warning signs, chevrons, and delineation');
            recs.push('Evaluate speed management countermeasures');
        }
        if (reportData.category === 'guardrail' || reportData.type === 'cross') {
            recs.push('Review guardrail condition and upgrade to MASH-compliant terminals');
            recs.push('Evaluate clear zone improvements where guardrail is not warranted');
        }
    }
    
    // General recommendations
    recs.push('Conduct before/after studies for implemented countermeasures');
    recs.push('Consider HSIP funding opportunities for systemic improvements');
    
    return `<h4>📋 Safety Recommendations</h4>
        <div style="background:#f8fafc;border-radius:8px;padding:1rem;border-left:4px solid #1e40af">
            <ul style="margin-left:1rem;line-height:2">${recs.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>`;
}

function generateYearlySection(crashes) {
    const byYear = {};
    crashes.forEach(c => {
        const y = parseInt(c[COL.YEAR]);
        if (!y) return;
        if (!byYear[y]) byYear[y] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        byYear[y].total++;
        const s = (c[COL.SEVERITY]||'').charAt(0);
        if (byYear[y][s] !== undefined) byYear[y][s]++;
    });
    
    const years = Object.keys(byYear).sort();
    return `<h4>Yearly Summary</h4>
        <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Year</th><th>Total</th><th>K</th><th>A</th><th>B</th><th>C</th><th>O</th><th>EPDO</th></tr></thead>
        <tbody>${years.map(y => {
            const d = byYear[y];
            return `<tr><td>${y}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td><td>${d.B}</td><td>${d.C}</td><td>${d.O}</td><td>${calcEPDO(d)}</td></tr>`;
        }).join('')}</tbody></table></div>`;
}

function generateTopLocationsTable(crashes, kaOnly = false) {
    const byRoute = {};
    crashes.forEach(c => {
        if (kaOnly && !['K','A'].includes((c[COL.SEVERITY]||'').charAt(0))) return;
        const r = c[COL.ROUTE] || 'Unknown';
        if (!byRoute[r]) byRoute[r] = { total: 0, K: 0, A: 0 };
        byRoute[r].total++;
        const s = (c[COL.SEVERITY]||'').charAt(0);
        if (s === 'K') byRoute[r].K++;
        if (s === 'A') byRoute[r].A++;
    });
    
    const sorted = Object.entries(byRoute).sort((a,b) => b[1].total - a[1].total);
    return `<h4>${kaOnly ? 'K+A' : ''} Crash Locations</h4>
        <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Route</th><th>Total</th><th>K</th><th>A</th></tr></thead>
        <tbody>${sorted.map(([r, d]) => `<tr><td>${esc(r)}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td></tr>`).join('')}</tbody></table></div>`;
}

function generateNodeTable(crashes) {
    const byNode = {};
    crashes.forEach(c => {
        const n = c[COL.NODE];
        if (!n) return;
        if (!byNode[n]) byNode[n] = { total: 0, K: 0, A: 0 };
        byNode[n].total++;
        const s = (c[COL.SEVERITY]||'').charAt(0);
        if (s === 'K') byNode[n].K++;
        if (s === 'A') byNode[n].A++;
    });
    
    const sorted = Object.entries(byNode).sort((a,b) => b[1].total - a[1].total);
    return `<h4>Crash Frequency by Node/Intersection</h4>
        <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Node</th><th>Total</th><th>K</th><th>A</th></tr></thead>
        <tbody>${sorted.map(([n, d]) => `<tr><td>${esc(n)}</td><td>${d.total}</td><td>${d.K}</td><td>${d.A}</td></tr>`).join('')}</tbody></table></div>`;
}

function generateRecommendations(stats, crashes) {
    const recs = [];
    if (stats.K > 0) recs.push('Conduct detailed fatal crash reviews to identify systemic issues');
    if (stats.ped > 5) recs.push('Evaluate pedestrian crossing facilities and consider enhanced crossings, signals, or lighting');
    if (stats.intersection > stats.total * 0.5) recs.push('Focus on intersection safety improvements including signal timing, turn restrictions, or geometric changes');
    
    return `<h4>Recommended Actions</h4><ul style="margin-left:1.5rem;line-height:1.8">${recs.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

function generateSafetyRecommendations(stats, severeCrashes) {
    const recs = ['Prioritize systemic safety improvements at high-K+A locations'];
    const byLight = {};
    severeCrashes.forEach(c => { const l = c[COL.LIGHT]||'Unknown'; byLight[l]=(byLight[l]||0)+1; });
    const darkPct = Object.entries(byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s,e) => s+e[1], 0) / severeCrashes.length;
    if (darkPct > 0.3) recs.push('Consider roadway lighting improvements - significant portion of severe crashes occur in dark conditions');
    
    return `<h4>Safety Recommendations</h4><ul style="margin-left:1.5rem;line-height:1.8">${recs.map(r => `<li>${r}</li>`).join('')}</ul>`;
}

function generatePedBikeRecommendations(pedStats, bikeStats, pedDarkPct, bikeDarkPct) {
    const recs = [];
    
    // Fatal crash recommendations
    if (pedStats.K > 0) recs.push('🚨 <strong>Priority:</strong> Conduct detailed review of all pedestrian fatality locations');
    if (bikeStats.K > 0) recs.push('🚨 <strong>Priority:</strong> Conduct detailed review of all bicycle fatality locations');
    
    // K+A rate recommendations
    const pedKARate = pedStats.total > 0 ? ((pedStats.K + pedStats.A) / pedStats.total * 100) : 0;
    const bikeKARate = bikeStats.total > 0 ? ((bikeStats.K + bikeStats.A) / bikeStats.total * 100) : 0;
    
    if (pedKARate > 25) recs.push('Evaluate pedestrian crossing locations for enhanced treatments (RRFB, PHB, or signals)');
    if (bikeKARate > 25) recs.push('Consider protected bicycle facilities on high-crash corridors');
    
    // Lighting recommendations
    if (parseFloat(pedDarkPct) > 30) recs.push('🔦 Install/upgrade pedestrian-scale lighting at high-pedestrian crash locations');
    if (parseFloat(bikeDarkPct) > 30) recs.push('🔦 Improve roadway lighting and consider reflective treatments on bicycle routes');
    
    // General recommendations
    recs.push('Conduct speed studies on corridors with pedestrian/bicycle crashes');
    recs.push('Review sight distance and visibility at pedestrian crossing locations');
    if (bikeStats.total > 10) recs.push('Perform bicycle network gap analysis to identify missing connections');
    recs.push('Consider systemic safety improvements at similar locations countywide');
    recs.push('Coordinate with local schools and community groups on pedestrian/bicycle safety education');
    
    return `<h4>📋 Recommendations</h4>
        <div style="background:#f8fafc;border-radius:8px;padding:1rem;border-left:4px solid #1e40af">
            <ul style="margin-left:1rem;line-height:2">${recs.map(r => `<li>${r}</li>`).join('')}</ul>
        </div>`;
}

function generatePedBikeYearlySection(pedCrashes, bikeCrashes) {
    const pedByYear = {}, bikeByYear = {};
    pedCrashes.forEach(c => { const y = parseInt(c[COL.YEAR]); if(y) pedByYear[y]=(pedByYear[y]||0)+1; });
    bikeCrashes.forEach(c => { const y = parseInt(c[COL.YEAR]); if(y) bikeByYear[y]=(bikeByYear[y]||0)+1; });
    const years = [...new Set([...Object.keys(pedByYear), ...Object.keys(bikeByYear)])].sort();
    
    return `<h4>Yearly Summary</h4>
        <div class="table-wrapper"><table class="data-table">
        <thead><tr><th>Year</th><th>Pedestrian</th><th>Bicycle</th><th>Total</th></tr></thead>
        <tbody>${years.map(y => `<tr><td>${y}</td><td>${pedByYear[y]||0}</td><td>${bikeByYear[y]||0}</td><td>${(pedByYear[y]||0)+(bikeByYear[y]||0)}</td></tr>`).join('')}</tbody></table></div>`;
}

function generatePedBikeLocationTable(pedCrashes, bikeCrashes) {
    const pedByRoute = {}, bikeByRoute = {};
    pedCrashes.forEach(c => { const r = c[COL.ROUTE]; if(r) pedByRoute[r]=(pedByRoute[r]||0)+1; });
    bikeCrashes.forEach(c => { const r = c[COL.ROUTE]; if(r) bikeByRoute[r]=(bikeByRoute[r]||0)+1; });

    // Show all locations without limit - removed hardcoded slice(0,8)
    const pedTop = Object.entries(pedByRoute).sort((a,b) => b[1]-a[1]);
    const bikeTop = Object.entries(bikeByRoute).sort((a,b) => b[1]-a[1]);

    return `<div class="two-col">
        <div><h4>Pedestrian Crash Locations (${pedTop.length})</h4><div class="table-wrapper"><table class="data-table"><thead><tr><th>Route</th><th>Crashes</th></tr></thead>
        <tbody>${pedTop.map(([r,c]) => `<tr><td>${esc(r)}</td><td>${c}</td></tr>`).join('')}</tbody></table></div></div>
        <div><h4>Bicycle Crash Locations (${bikeTop.length})</h4><div class="table-wrapper"><table class="data-table"><thead><tr><th>Route</th><th>Crashes</th></tr></thead>
        <tbody>${bikeTop.map(([r,c]) => `<tr><td>${esc(r)}</td><td>${c}</td></tr>`).join('')}</tbody></table></div></div>
    </div>`;
}
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.reports = CL.reports || {};
  CL.reports.standardTypes2 = CL.reports.standardTypes2 || {};
  window.generateSafetyFocusReport = generateSafetyFocusReport; CL.reports.standardTypes2.generateSafetyFocusReport = generateSafetyFocusReport;
  window.generateSafetyFocusRecommendations = generateSafetyFocusRecommendations; CL.reports.standardTypes2.generateSafetyFocusRecommendations = generateSafetyFocusRecommendations;
  window.generateYearlySection = generateYearlySection; CL.reports.standardTypes2.generateYearlySection = generateYearlySection;
  window.generateTopLocationsTable = generateTopLocationsTable; CL.reports.standardTypes2.generateTopLocationsTable = generateTopLocationsTable;
  window.generateNodeTable = generateNodeTable; CL.reports.standardTypes2.generateNodeTable = generateNodeTable;
  window.generateRecommendations = generateRecommendations; CL.reports.standardTypes2.generateRecommendations = generateRecommendations;
  window.generateSafetyRecommendations = generateSafetyRecommendations; CL.reports.standardTypes2.generateSafetyRecommendations = generateSafetyRecommendations;
  window.generatePedBikeRecommendations = generatePedBikeRecommendations; CL.reports.standardTypes2.generatePedBikeRecommendations = generatePedBikeRecommendations;
  window.generatePedBikeYearlySection = generatePedBikeYearlySection; CL.reports.standardTypes2.generatePedBikeYearlySection = generatePedBikeYearlySection;
  window.generatePedBikeLocationTable = generatePedBikeLocationTable; CL.reports.standardTypes2.generatePedBikeLocationTable = generatePedBikeLocationTable;
  CL._registerModule('reports/reports-standard-types2');
})();
