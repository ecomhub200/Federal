/**
 * CL crashTree.export module
 *
 * Extracted from app/index.html (name-anchored, live L86250-L87751)
 * on 2026-05-23. Round X modular refactor — CC 200 Pass B.
 * Responsibility: PNG image export of the tree visualization; HSIP-ready
 * PDF / printable report generation with cover page, exec summary, KPI
 * grid, severity bar, breakdown tables, risk-factor table, methodology
 * callout, recommended next steps.
 *
 * Moved fns (3): exportCrashTreeImage, generateCrashTreeReport,
 *   generateProfessionalTableRows.
 *
 * Size: ~1502 LOC verbatim — documented size exception:
 *   generateCrashTreeReport is a single indivisible ~1,433-LOC fn
 *   (cover-page HTML + 1100+ lines of inline CSS for printable layout).
 *   Same precedent as reports/reports-pdf.js (982-LOC single fn),
 *   assets/transit-tab.js (975 LOC), reports/reports-standard-core.js.
 *   Sub-splitting requires non-verbatim rewrite, prohibited by Round X.
 *
 * Shared globals (crashTreeState, crashState, COL, showToast, html2canvas,
 * appConfig, _resolveActiveState, window.crashLensClient, window.CL.data.*,
 * buildFacilityTree/buildCrashTypeTree/buildContributingFactorsTree from
 * crash-tree-build.js, findNodeById/getTreeTypeLabel from
 * crash-tree-render.js, getCrashTreeFilteredCrashes/
 * getCrashTreeDateOnlyFilteredCrashes from crash-tree-loader.js) resolve
 * via window.* mirrors + the shared classic-script global lexical
 * environment.
 *
 * Public API (back-compat dual exposure): window.<fn> + CL.crashTree.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L86250-L87751) ───
// Export tree as image
function exportCrashTreeImage() {
    const container = document.getElementById('crashTreeViz');
    if (!container || !crashTreeState.treeData) {
        showToast('No tree to export', 'warning');
        return;
    }

    if (typeof html2canvas === 'function') {
        html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'crash_tree_diagram.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast('Tree image exported', 'success');
        }).catch(err => {
            console.error('Export failed:', err);
            showToast('Export failed', 'error');
        });
    } else {
        showToast('Export not available', 'warning');
    }
}

// Generate crash tree report - Professional HSIP-ready PDF
async function generateCrashTreeReport() {
    if (!crashTreeState.treeData) {
        showToast('No data to generate report', 'warning');
        return;
    }

    // Capture crash tree diagram as image
    let crashTreeImageData = null;
    const treeContainer = document.getElementById('crashTreeViz');
    if (treeContainer && typeof html2canvas === 'function') {
        try {
            showToast('Capturing crash tree diagram...', 'info');
            const canvas = await html2canvas(treeContainer, {
                backgroundColor: '#ffffff',
                scale: 1.5,
                logging: false
            });
            crashTreeImageData = canvas.toDataURL('image/png');
        } catch (err) {
            console.error('Failed to capture crash tree:', err);
        }
    }

    const tree = crashTreeState.treeData;
    const kaTotal = (tree.K || 0) + (tree.A || 0);
    const kaRate = tree.total > 0 ? (kaTotal / tree.total * 100).toFixed(1) : 0;
    const focusPath = crashTreeState.dominantPath.slice(1).map(id => {
        const node = findNodeById(tree, id);
        return node ? node.name : id;
    }).join(' > ');

    // Get the focus node for key findings
    const focusNode = crashTreeState.dominantPath.length > 1
        ? findNodeById(tree, crashTreeState.dominantPath[crashTreeState.dominantPath.length - 1])
        : null;
    const focusPct = focusNode ? focusNode.pct.toFixed(1) : '0';
    const focusStateAvg = focusNode && focusNode.stateAvg !== undefined ? focusNode.stateAvg : null;

    // Calculate date range from data
    const dateRange = crashState.sampleRows.length > 0 ? (() => {
        const dates = crashState.sampleRows.map(r => r[COL.DATE]).filter(d => d);
        if (dates.length === 0) return 'All available data';
        const sorted = dates.sort();
        const startDate = new Date(sorted[0]);
        const endDate = new Date(sorted[sorted.length - 1]);
        return `${startDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})} - ${endDate.toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`;
    })() : 'All available data';

    // Round 7 (2026-05-09): in Supabase-only mode analyzeRiskFactors() runs
    // against an empty rows[] and produces analyzed[] with every row's
    // observed % stuck at 0.0% (numerator + denominator both 0). Hydrate
    // from mv_safety_categories so the FHWA overrepresentation table shows
    // real numbers. Total crash count comes from dashboard_summary;
    // category counts come from mv_safety_categories.
    try {
        const _treeRows = (typeof getCrashTreeDateOnlyFilteredCrashes === 'function')
            ? getCrashTreeDateOnlyFilteredCrashes() : [];
        const _allObservedZero = Array.isArray(crashTreeState.riskFactors?.analyzed)
            && crashTreeState.riskFactors.analyzed.length > 0
            && crashTreeState.riskFactors.analyzed.every(r => parseFloat(r.allPct) === 0);
        if (!_treeRows.length && _allObservedZero
            && window.crashLensClient
            && window.CL?.data?.supabaseBridge?.resolveTier) {
            const t = window.CL.data.supabaseBridge.resolveTier();
            const [_sumRows, _cats] = await Promise.all([
                CL.data.cachedMatview('dashboard_summary', t.tier, t.value,
                    () => window.crashLensClient.getSummary(t.tier, t.value, {})),
                CL.data.cachedMatview('mv_safety_categories', t.tier, t.value,
                    () => window.crashLensClient.getSafetyCategories(t.tier, t.value, {})),
            ]);
            let _scopeTotal = 0, _scopeKA = 0;
            (_sumRows || []).forEach(r => {
                _scopeTotal += r.crash_count || 0;
                _scopeKA    += (r.fatals || 0) + (r.serious_injuries || 0);
            });
            if (_cats && _scopeTotal > 0) {
                // Map matview category keys → display name + baseline. Baselines
                // mirror analyzeRiskFactors() above so the FHWA ratio is
                // computed against the same expected values.
                const catMap = [
                    { key: 'nighttime',    name: 'Nighttime',    icon: '🌙', baseline: 25 },
                    { key: 'speed',        name: 'Speed-Related',icon: '⚡', baseline: 15 },
                    { key: 'intersection', name: 'Intersection', icon: '🚦', baseline: 42 },
                    { key: 'weather',      name: 'Weather',      icon: '🌧', baseline: 18 },
                    { key: 'pedestrian',   name: 'Pedestrian',   icon: '🚶', baseline: 3  },
                    { key: 'bicycle',      name: 'Bicycle',      icon: '🚴', baseline: 1  },
                    { key: 'motorcycle',   name: 'Motorcycle',   icon: '🏍', baseline: 4  },
                    { key: 'impaired',     name: 'Alcohol/Impaired', icon: '🍺', baseline: 6 },
                ];
                const hydrated = catMap.map(c => {
                    const cat = _cats[c.key] || { total: 0, K: 0, A: 0 };
                    const allCount = cat.total || 0;
                    const kaCount  = (cat.K || 0) + (cat.A || 0);
                    const allPct   = (allCount / _scopeTotal * 100);
                    const kaPct    = _scopeKA > 0 ? (kaCount / _scopeKA * 100) : 0;
                    const ratio    = allPct > 0 ? (kaPct / allPct) : 0;
                    return {
                        name: c.name, icon: c.icon,
                        allCount, kaCount,
                        allPct: allPct.toFixed(1),
                        kaPct: kaPct.toFixed(1),
                        ratio: ratio.toFixed(2),
                        overrep: ratio > 1.2,
                        severity: ratio > 1.5 ? 'high' : ratio > 1.2 ? 'medium' : 'low',
                        baseline: c.baseline,
                    };
                }).filter(r => r.allCount > 0);
                if (hydrated.length > 0) {
                    crashTreeState.riskFactors.analyzed = hydrated;
                    console.log('[CrashTree Report] Risk factors hydrated from mv_safety_categories ('
                        + hydrated.length + ' factors).');
                }
            }
        }
    } catch (e) {
        console.warn('[CrashTree Report] risk factor matview hydration failed:', e && e.message);
    }

    // Build risk factor HTML with FIXED property mapping (was using undefined properties)
    const riskFactorHtml = crashTreeState.riskFactors.analyzed.length > 0 ? `
        <div class="section page-break">
            <h2><span class="section-icon">&#9888;</span> Risk Factor Analysis</h2>
            <p class="section-intro">FHWA overrepresentation analysis identifies factors that contribute disproportionately to severe crashes.</p>
            <table class="data-table risk-table">
                <thead>
                    <tr>
                        <th style="width:25%;">Risk Factor</th>
                        <th style="width:15%;text-align:right;">Observed %</th>
                        <th style="width:15%;text-align:right;">State Avg %</th>
                        <th style="width:15%;text-align:right;">Difference</th>
                        <th style="width:12%;text-align:center;">Ratio</th>
                        <th style="width:18%;text-align:center;">Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${crashTreeState.riskFactors.analyzed.map(r => {
                        const observed = parseFloat(r.allPct);
                        const expected = r.baseline;
                        const diff = (observed - expected).toFixed(1);
                        const diffNum = parseFloat(diff);
                        return `
                        <tr class="${r.overrep ? 'row-warning' : ''}">
                            <td><span class="risk-icon">${r.icon}</span> ${r.name}</td>
                            <td style="text-align:right;font-family:monospace;">${r.allPct}%</td>
                            <td style="text-align:right;font-family:monospace;color:#64748b;">${expected}%</td>
                            <td style="text-align:right;font-family:monospace;">
                                <span class="diff-indicator ${diffNum > 0 ? 'diff-up' : 'diff-down'}">${diffNum > 0 ? '+' : ''}${diff}%</span>
                            </td>
                            <td style="text-align:center;">
                                <span class="ratio-badge ${r.severity === 'high' ? 'ratio-high' : r.severity === 'medium' ? 'ratio-medium' : 'ratio-normal'}">${r.ratio}x</span>
                            </td>
                            <td style="text-align:center;">
                                <span class="status-badge ${r.overrep ? 'status-overrep' : 'status-normal'}">${r.overrep ? 'Overrepresented' : 'Normal'}</span>
                            </td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
            <div class="table-legend">
                <span><strong>Ratio Interpretation:</strong></span>
                <span class="legend-item"><span class="ratio-badge ratio-high">High</span> &gt;1.5x (Critical)</span>
                <span class="legend-item"><span class="ratio-badge ratio-medium">Med</span> 1.2-1.5x (Elevated)</span>
                <span class="legend-item"><span class="ratio-badge ratio-normal">Low</span> &lt;1.2x (Normal)</span>
            </div>
        </div>
    ` : '';

    // Build severity stacked bar chart
    const severityTotal = tree.total || 1;
    const sevWidths = {
        K: ((tree.K || 0) / severityTotal * 100).toFixed(1),
        A: ((tree.A || 0) / severityTotal * 100).toFixed(1),
        B: ((tree.B || 0) / severityTotal * 100).toFixed(1),
        C: ((tree.C || 0) / severityTotal * 100).toFixed(1),
        O: ((tree.O || 0) / severityTotal * 100).toFixed(1)
    };

    const severityBarChart = `
        <div class="severity-bar-container">
            <div class="severity-bar">
                ${parseFloat(sevWidths.K) > 0 ? `<div class="sev-segment sev-seg-k" style="width:${sevWidths.K}%;" title="Fatal: ${tree.K || 0} (${sevWidths.K}%)"></div>` : ''}
                ${parseFloat(sevWidths.A) > 0 ? `<div class="sev-segment sev-seg-a" style="width:${sevWidths.A}%;" title="Serious: ${tree.A || 0} (${sevWidths.A}%)"></div>` : ''}
                ${parseFloat(sevWidths.B) > 0 ? `<div class="sev-segment sev-seg-b" style="width:${sevWidths.B}%;" title="Minor: ${tree.B || 0} (${sevWidths.B}%)"></div>` : ''}
                ${parseFloat(sevWidths.C) > 0 ? `<div class="sev-segment sev-seg-c" style="width:${sevWidths.C}%;" title="Possible: ${tree.C || 0} (${sevWidths.C}%)"></div>` : ''}
                ${parseFloat(sevWidths.O) > 0 ? `<div class="sev-segment sev-seg-o" style="width:${sevWidths.O}%;" title="PDO: ${tree.O || 0} (${sevWidths.O}%)"></div>` : ''}
            </div>
            <div class="severity-legend">
                <span class="sev-legend-item"><span class="sev-dot sev-dot-k"></span>Fatal (${tree.K || 0})</span>
                <span class="sev-legend-item"><span class="sev-dot sev-dot-a"></span>Serious (${tree.A || 0})</span>
                <span class="sev-legend-item"><span class="sev-dot sev-dot-b"></span>Minor (${tree.B || 0})</span>
                <span class="sev-legend-item"><span class="sev-dot sev-dot-c"></span>Possible (${tree.C || 0})</span>
                <span class="sev-legend-item"><span class="sev-dot sev-dot-o"></span>PDO (${tree.O || 0})</span>
            </div>
        </div>
    `;

    // Build key finding sentence
    const keyFindingSentence = focusNode && focusStateAvg !== null
        ? `<strong>${focusNode.name}</strong> represents <strong>${focusPct}%</strong> of ${getTreeTypeLabel('description')}, ${parseFloat(focusPct) > focusStateAvg ? `<span class="highlight-warning">exceeding</span> the state average of ${focusStateAvg}%` : `within the state average of ${focusStateAvg}%`}.`
        : focusNode
            ? `<strong>${focusNode.name}</strong> represents <strong>${focusPct}%</strong> of analyzed crashes and should be prioritized for safety improvements.`
            : 'Analysis identifies priority crash types and facilities for systemic safety improvements.';

    // Build all three tree types for comprehensive report.
    // Round 7 (2026-05-09): in Supabase-only mode filteredCrashes is empty,
    // so all three buildXxxTree calls return null and the breakdown tables
    // disappear from the report. Fall back to crashTreeState.treeData (the
    // matview-loaded tree the user is currently viewing) for the active
    // tree type, then leave the other two empty rather than render zeros.
    const filteredCrashes = getCrashTreeFilteredCrashes();
    const _treeMatviewMode = !filteredCrashes.length && crashTreeState.treeData
        && crashTreeState.source === 'supabase';
    const facilityTree = _treeMatviewMode && crashTreeState.treeType === 'facility'
        ? crashTreeState.treeData
        : buildFacilityTree(filteredCrashes);
    const crashTypeTree = _treeMatviewMode && crashTreeState.treeType === 'crashtype'
        ? crashTreeState.treeData
        : buildCrashTypeTree(filteredCrashes);
    const contributingFactorsTree = _treeMatviewMode && crashTreeState.treeType === 'contributingfactors'
        ? crashTreeState.treeData
        : buildContributingFactorsTree(filteredCrashes);

    // Helper function to build tree breakdown HTML
    const buildTreeBreakdownHtml = (treeData, treeName, treeIcon) => {
        if (!treeData || !treeData.children || treeData.children.length === 0) return '';

        const rows = treeData.children.map(child => {
            const ka = (child.K || 0) + (child.A || 0);
            const subRows = child.children ? child.children.map(sub => {
                const subKa = (sub.K || 0) + (sub.A || 0);
                return `<tr class="sub-row">
                    <td style="padding-left:30px;color:#64748b;">↳ ${sub.name}</td>
                    <td style="text-align:right;font-family:monospace;">${sub.total.toLocaleString()}</td>
                    <td style="text-align:right;font-family:monospace;">${subKa}</td>
                    <td style="text-align:right;font-family:monospace;">${sub.pct.toFixed(1)}%</td>
                </tr>`;
            }).join('') : '';
            return `<tr class="main-row">
                <td style="font-weight:600;">${child.name}</td>
                <td style="text-align:right;font-family:monospace;font-weight:600;">${child.total.toLocaleString()}</td>
                <td style="text-align:right;font-family:monospace;font-weight:600;">${ka}</td>
                <td style="text-align:right;font-family:monospace;font-weight:600;">${child.pct.toFixed(1)}%</td>
            </tr>${subRows}`;
        }).join('');

        return `
            <div class="tree-breakdown-section avoid-break">
                <h3 style="font-size:12pt;color:#1e293b;margin-bottom:12px;display:flex;align-items:center;gap:8px;">
                    <span style="font-size:16pt;">${treeIcon}</span> ${treeName} Breakdown
                </h3>
                <table class="data-table mini-table">
                    <thead>
                        <tr>
                            <th style="width:45%;">Category</th>
                            <th style="width:18%;text-align:right;">Total</th>
                            <th style="width:18%;text-align:right;">KA</th>
                            <th style="width:19%;text-align:right;">% of Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    };

    // Build the three breakdown sections
    const facilityBreakdownHtml = buildTreeBreakdownHtml(facilityTree, 'Facility Type', '&#127959;');
    const crashTypeBreakdownHtml = buildTreeBreakdownHtml(crashTypeTree, 'Crash Type', '&#128165;');
    const contributingFactorsBreakdownHtml = buildTreeBreakdownHtml(contributingFactorsTree, 'Contributing Factors', '&#9888;');

    // Combined analysis overview section
    const analysisOverviewHtml = (facilityTree || crashTypeTree || contributingFactorsTree) ? `
        <div class="section page-break">
            <h2><span class="section-icon">&#128202;</span> Comprehensive Analysis Overview</h2>
            <p class="section-intro">Complete breakdown by facility type, crash type, and contributing factors for systemic safety analysis.</p>
            <div class="analysis-grid">
                ${facilityBreakdownHtml}
                ${crashTypeBreakdownHtml}
                ${contributingFactorsBreakdownHtml}
            </div>
        </div>
    ` : '';

    // Crash Analysis Tool logo SVG (inline)
    // Round 7 (2026-05-09): "VIRGINIA" was hardcoded — pull the active state
    // name from appConfig.states so Delaware / Colorado / etc. don't all
    // render as "VIRGINIA" in the report header.
    const _activeStateKey = (typeof _resolveActiveState === 'function') ? _resolveActiveState() : null;
    const _activeStateName = (_activeStateKey
        && typeof appConfig !== 'undefined'
        && appConfig.states
        && appConfig.states[_activeStateKey]
        && appConfig.states[_activeStateKey].name)
        ? appConfig.states[_activeStateKey].name.toUpperCase()
        : 'STATE';
    const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 60" style="width:180px;height:60px;">
        <defs>
            <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1e3a5f"/>
                <stop offset="100%" style="stop-color:#0f172a"/>
            </linearGradient>
        </defs>
        <rect width="180" height="60" rx="8" fill="url(#logoBg)"/>
        <!-- Car icon -->
        <g transform="translate(10, 10)">
            <path d="M5 28 L8 20 Q9 17 14 17 L26 17 Q31 17 32 20 L35 28" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 17 L15 12 Q16 10 20 10 Q24 10 25 12 L28 17" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/>
            <rect x="4" y="26" width="32" height="6" rx="2" fill="#f97316"/>
            <circle cx="12" cy="32" r="4" fill="#0f172a" stroke="#f97316" stroke-width="1.5"/>
            <circle cx="28" cy="32" r="4" fill="#0f172a" stroke="#f97316" stroke-width="1.5"/>
        </g>
        <!-- Text -->
        <text x="52" y="24" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="#ffffff">${_activeStateName}</text>
        <text x="52" y="38" font-family="system-ui, sans-serif" font-size="9" font-weight="500" fill="#94a3b8">Crash Analysis Tool</text>
        <text x="52" y="50" font-family="system-ui, sans-serif" font-size="7" font-weight="400" fill="#64748b">Traffic Safety Division</text>
    </svg>`;

    const reportHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crash Tree Analysis Report - ${getTreeTypeLabel('analysis')}</title>
    <meta name="author" content="Crash Analysis Tool">
    <meta name="subject" content="HSIP Systemic Safety Analysis">
    <meta name="keywords" content="crash analysis, HSIP, traffic safety, systemic safety, FHWA">
    <style>
        /* Reset and base styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }

        @page {
            size: letter;
            margin: 1in 1in 0.75in 1in;
        }

        @page :first {
            margin-top: 0;
        }

        body {
            font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            font-size: 10.5pt;
            line-height: 1.55;
            color: #1e293b;
            background: #fff;
            padding: 0;
            margin: 0;
        }

        /* Print-specific styles */
        @media print {
            body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            .avoid-break { page-break-inside: avoid; }
            .cover-page { page-break-after: always; }
        }

        /* Typography */
        h1, h2, h3 { font-family: system-ui, -apple-system, 'Segoe UI', sans-serif; }

        /* ============================================
           COVER PAGE
           ============================================ */
        .cover-page {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            padding: 60px 50px;
            background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
        }

        .cover-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 60px;
        }

        .cover-logo {
            width: 180px;
            height: 60px;
            border-radius: 8px;
            overflow: hidden;
        }

        .cover-logo svg {
            width: 100%;
            height: 100%;
        }

        .cover-date {
            text-align: right;
            color: #64748b;
            font-size: 10pt;
        }

        .cover-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .cover-title {
            font-size: 32pt;
            font-weight: 800;
            color: #065f46;
            line-height: 1.15;
            margin-bottom: 12px;
            letter-spacing: -0.5px;
        }

        .cover-subtitle {
            font-size: 16pt;
            font-weight: 400;
            color: #64748b;
            margin-bottom: 50px;
        }

        .cover-params {
            background: #f1f5f9;
            border-radius: 12px;
            padding: 25px 30px;
            margin-bottom: 40px;
        }

        .cover-params-title {
            font-size: 11pt;
            font-weight: 600;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 15px;
        }

        .cover-params-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
        }

        .cover-param {
            text-align: center;
        }

        .cover-param-label {
            font-size: 9pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }

        .cover-param-value {
            font-size: 11pt;
            font-weight: 600;
            color: #1e293b;
        }

        .cover-findings {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #10b981;
            border-radius: 12px;
            padding: 25px 30px;
        }

        .cover-findings-title {
            font-size: 11pt;
            font-weight: 700;
            color: #065f46;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .cover-findings-title::before {
            content: '\\2605';
            color: #059669;
        }

        .cover-findings-text {
            font-size: 12pt;
            color: #047857;
            line-height: 1.6;
        }

        .highlight-warning {
            color: #dc2626;
            font-weight: 700;
        }

        .cover-footer {
            margin-top: auto;
            padding-top: 30px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .cover-footer-left {
            font-size: 9pt;
            color: #64748b;
        }

        .cover-footer-right {
            font-size: 9pt;
            color: #64748b;
            text-align: right;
        }

        /* ============================================
           MAIN REPORT STYLES
           ============================================ */

        .report-content {
            padding: 0 10px;
        }

        /* Page Header (repeating) */
        .page-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            border-bottom: 2px solid #065f46;
            margin-bottom: 25px;
        }

        .page-header-title {
            font-size: 11pt;
            font-weight: 600;
            color: #065f46;
        }

        .page-header-type {
            font-size: 9pt;
            color: #64748b;
            background: #f1f5f9;
            padding: 4px 12px;
            border-radius: 20px;
        }

        /* Executive Summary */
        .executive-summary {
            margin-bottom: 30px;
        }

        .exec-title {
            font-size: 18pt;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #059669;
        }

        /* KPI Cards */
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 25px;
        }

        .kpi-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            position: relative;
        }

        .kpi-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: #059669;
            border-radius: 10px 10px 0 0;
        }

        .kpi-card.kpi-danger::before {
            background: #dc2626;
        }

        .kpi-card.kpi-warning::before {
            background: #f59e0b;
        }

        .kpi-icon {
            font-size: 24pt;
            margin-bottom: 8px;
        }

        .kpi-value {
            font-size: 32pt;
            font-weight: 800;
            color: #1e293b;
            line-height: 1.1;
            font-family: system-ui, sans-serif;
            font-variant-numeric: tabular-nums;
        }

        .kpi-card.kpi-danger .kpi-value {
            color: #dc2626;
        }

        .kpi-label {
            font-size: 9pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 8px;
            font-weight: 500;
        }

        /* Severity Stacked Bar */
        .severity-bar-container {
            margin: 20px 0;
        }

        .severity-bar {
            display: flex;
            height: 28px;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
        }

        .sev-segment {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 8pt;
            font-weight: 600;
            color: #fff;
            min-width: 1px;
        }

        .sev-seg-k { background: #991b1b; }
        .sev-seg-a { background: #c2410c; }
        .sev-seg-b { background: #ca8a04; }
        .sev-seg-c { background: #16a34a; }
        .sev-seg-o { background: #6b7280; }

        .severity-legend {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 12px;
            flex-wrap: wrap;
        }

        .sev-legend-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 9pt;
            color: #475569;
        }

        .sev-dot {
            width: 12px;
            height: 12px;
            border-radius: 3px;
        }

        .sev-dot-k { background: #991b1b; }
        .sev-dot-a { background: #c2410c; }
        .sev-dot-b { background: #ca8a04; }
        .sev-dot-c { background: #16a34a; }
        .sev-dot-o { background: #6b7280; }

        /* Key Finding Box */
        .key-finding {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 10px;
            padding: 18px 22px;
            margin: 20px 0;
            font-size: 11pt;
            line-height: 1.6;
        }

        .key-finding-label {
            font-size: 9pt;
            font-weight: 700;
            color: #92400e;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 6px;
        }

        /* Focus Box */
        .focus-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border: 2px solid #059669;
            border-radius: 10px;
            padding: 22px;
            margin: 25px 0;
        }

        .focus-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .focus-icon {
            width: 28px;
            height: 28px;
            background: #059669;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14pt;
            font-weight: bold;
        }

        .focus-title {
            font-size: 12pt;
            font-weight: 700;
            color: #065f46;
        }

        .focus-path {
            font-size: 16pt;
            font-weight: 800;
            color: #047857;
            margin-bottom: 10px;
            padding: 10px 15px;
            background: rgba(255,255,255,0.6);
            border-radius: 6px;
            display: inline-block;
        }

        .focus-desc {
            font-size: 10.5pt;
            color: #065f46;
            line-height: 1.5;
        }

        /* Sections */
        .section {
            margin: 30px 0;
        }

        .section h2 {
            font-size: 14pt;
            font-weight: 700;
            color: #1e293b;
            padding-bottom: 10px;
            margin-bottom: 18px;
            border-left: 4px solid #059669;
            padding-left: 15px;
            background: linear-gradient(90deg, #f0fdf4 0%, transparent 100%);
            margin-left: -15px;
            padding-top: 8px;
            padding-bottom: 8px;
        }

        .section-icon {
            margin-right: 8px;
        }

        .section-intro {
            font-size: 10pt;
            color: #64748b;
            margin-bottom: 15px;
            font-style: italic;
        }

        /* Enhanced Data Table */
        /* Analysis Grid for three-way breakdown */
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 25px;
            margin-top: 20px;
        }

        .tree-breakdown-section {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 18px;
        }

        .mini-table {
            font-size: 9pt;
        }

        .mini-table th {
            background: linear-gradient(180deg, #475569 0%, #64748b 100%);
            color: #fff;
            font-weight: 600;
            padding: 8px 10px;
            font-size: 8pt;
            text-transform: uppercase;
        }

        .mini-table td {
            padding: 6px 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .mini-table .main-row {
            background: #fff;
        }

        .mini-table .sub-row {
            background: #f8fafc;
        }

        .mini-table .sub-row td {
            font-size: 8.5pt;
        }

        .data-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 9.5pt;
            margin: 15px 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.08);
            border-radius: 8px;
            overflow: hidden;
        }

        .data-table th {
            background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
            color: #fff;
            font-weight: 600;
            text-align: left;
            padding: 12px 14px;
            font-size: 9pt;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .data-table td {
            padding: 10px 14px;
            border-bottom: 1px solid #e2e8f0;
            vertical-align: middle;
        }

        .data-table tbody tr:nth-child(even) {
            background: #f8fafc;
        }

        .data-table tbody tr:hover {
            background: #f1f5f9;
        }

        .data-table tr:last-child td {
            border-bottom: none;
        }

        /* Hierarchy level indicators */
        .data-table .level-0 {
            font-weight: 700;
            background: #f1f5f9 !important;
        }
        .data-table .level-1 {
            padding-left: 30px;
            border-left: 3px solid #059669;
        }
        .data-table .level-2 {
            padding-left: 50px;
            border-left: 3px solid #10b981;
        }

        .data-table .row-highlight {
            background: linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%) !important;
            font-weight: 600;
        }

        .data-table .row-highlight td:first-child::after {
            content: ' *';
            color: #059669;
            font-weight: 700;
        }

        /* Comparison arrows */
        .compare-up { color: #dc2626; }
        .compare-up::before { content: '\\2191 '; }
        .compare-down { color: #059669; }
        .compare-down::before { content: '\\2193 '; }
        .compare-equal { color: #64748b; }

        /* Risk Factor Table Enhancements */
        .risk-table .row-warning {
            background: #fef2f2 !important;
        }

        .risk-icon {
            margin-right: 6px;
        }

        .diff-indicator {
            font-weight: 600;
            padding: 2px 8px;
            border-radius: 4px;
        }

        .diff-up {
            color: #dc2626;
            background: #fef2f2;
        }

        .diff-down {
            color: #059669;
            background: #ecfdf5;
        }

        .ratio-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 8.5pt;
            font-weight: 700;
        }

        .ratio-high {
            background: #dc2626;
            color: #fff;
        }

        .ratio-medium {
            background: #f59e0b;
            color: #fff;
        }

        .ratio-normal {
            background: #e2e8f0;
            color: #475569;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 8.5pt;
            font-weight: 600;
        }

        .status-overrep {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fca5a5;
        }

        .status-normal {
            background: #ecfdf5;
            color: #059669;
            border: 1px solid #86efac;
        }

        .table-legend {
            display: flex;
            gap: 15px;
            margin-top: 12px;
            padding: 10px 15px;
            background: #f8fafc;
            border-radius: 6px;
            font-size: 8.5pt;
            color: #64748b;
            flex-wrap: wrap;
            align-items: center;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }

        /* Tree legend */
        .tree-legend {
            margin-top: 15px;
            padding: 12px 15px;
            background: #f8fafc;
            border-radius: 6px;
            font-size: 9pt;
            color: #64748b;
            border: 1px solid #e2e8f0;
        }

        .tree-legend strong {
            color: #1e293b;
        }

        /* Methodology Callout Box */
        .methodology-box {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-left: 4px solid #0ea5e9;
            border-radius: 8px;
            padding: 22px;
            margin: 30px 0;
            position: relative;
        }

        .methodology-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
        }

        .methodology-icon {
            width: 32px;
            height: 32px;
            background: #0ea5e9;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 16pt;
        }

        .methodology-box h3 {
            font-size: 12pt;
            font-weight: 700;
            color: #0c4a6e;
            margin: 0;
        }

        .methodology-box p {
            font-size: 10pt;
            color: #0369a1;
            margin-bottom: 10px;
            line-height: 1.6;
        }

        .methodology-box p:last-child {
            margin-bottom: 0;
        }

        .methodology-citation {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #bae6fd;
            font-size: 9pt;
            color: #0369a1;
            font-style: italic;
        }

        /* Next Steps Checklist */
        .next-steps-box {
            margin: 30px 0;
        }

        .next-steps-list {
            list-style: none;
            margin: 0;
            padding: 0;
        }

        .next-step-item {
            display: flex;
            gap: 15px;
            padding: 15px;
            margin-bottom: 10px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            transition: background 0.2s;
        }

        .next-step-item:hover {
            background: #f1f5f9;
        }

        .next-step-number {
            width: 28px;
            height: 28px;
            background: #059669;
            color: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 11pt;
            flex-shrink: 0;
        }

        .next-step-content {
            flex: 1;
        }

        .next-step-title {
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 4px;
            font-size: 10.5pt;
        }

        .next-step-desc {
            font-size: 9.5pt;
            color: #64748b;
            line-height: 1.5;
        }

        .next-step-tip {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 1px solid #f59e0b;
        }

        .next-step-tip .next-step-number {
            background: #f59e0b;
        }

        /* Footer */
        .report-footer {
            margin-top: 40px;
            padding: 20px 0;
            border-top: 2px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 9pt;
            color: #64748b;
        }

        .footer-left {
            line-height: 1.6;
        }

        .footer-brand {
            font-weight: 700;
            color: #1e293b;
        }

        .footer-right {
            text-align: right;
        }

        .footer-reference {
            font-style: italic;
            margin-bottom: 3px;
        }

        .footer-page {
            font-weight: 600;
            color: #1e293b;
        }

        /* Print Controls */
        .print-controls {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }

        .print-btn {
            padding: 12px 24px;
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            color: #fff;
            border: none;
            border-radius: 8px;
            font-size: 11pt;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(5,150,105,0.3);
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .print-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(5,150,105,0.4);
        }

        .print-btn.secondary {
            background: linear-gradient(135deg, #64748b 0%, #475569 100%);
            box-shadow: 0 4px 12px rgba(100,116,139,0.3);
        }

        .print-btn.secondary:hover {
            box-shadow: 0 6px 16px rgba(100,116,139,0.4);
        }
    </style>
</head>
<body>
    <!-- Print Controls -->
    <div class="print-controls no-print">
        <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        <button class="print-btn secondary" onclick="window.close()">Close</button>
    </div>

    <!-- ==================== COVER PAGE ==================== -->
    <div class="cover-page">
        <div class="cover-header">
            <div class="cover-logo">${logoSvg}</div>
            <div class="cover-date">
                <div>${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div>${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
        </div>

        <div class="cover-main">
            <div class="cover-title">Crash Tree Analysis Report</div>
            <div class="cover-subtitle">Systemic Safety Project Selection Tool</div>

            <div class="cover-params">
                <div class="cover-params-title">Analysis Parameters</div>
                <div class="cover-params-grid">
                    <div class="cover-param">
                        <div class="cover-param-label">Analysis Type</div>
                        <div class="cover-param-value">${getTreeTypeLabel('full')}</div>
                    </div>
                    <div class="cover-param">
                        <div class="cover-param-label">Severity Filter</div>
                        <div class="cover-param-value">${crashTreeState.severityFilter.map(s => {
                            const labels = {K: 'Fatal', A: 'Serious', B: 'Minor', C: 'Possible', O: 'PDO'};
                            return labels[s] || s;
                        }).join(', ')}</div>
                    </div>
                    <div class="cover-param">
                        <div class="cover-param-label">Date Range</div>
                        <div class="cover-param-value">${dateRange}</div>
                    </div>
                </div>
            </div>

            <div class="cover-findings">
                <div class="cover-findings-title">Key Finding</div>
                <div class="cover-findings-text">${keyFindingSentence}</div>
            </div>
        </div>

        <div class="cover-footer">
            <div class="cover-footer-left">
                <strong>Crash Analysis Tool</strong><br>
                Systemic Safety Analysis Module
            </div>
            <div class="cover-footer-right">
                Reference: FHWA-SA-13-019<br>
                Systemic Safety Project Selection Tool
            </div>
        </div>
    </div>

    <!-- ==================== EXECUTIVE SUMMARY ==================== -->
    <div class="report-content">
        <div class="page-header">
            <div class="page-header-title">Crash Tree Analysis Report</div>
            <div class="page-header-type">${getTreeTypeLabel('analysis')}</div>
        </div>

        <div class="executive-summary avoid-break">
            <h1 class="exec-title">Executive Summary</h1>

            <!-- KPI Cards -->
            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-icon">&#128202;</div>
                    <div class="kpi-value">${tree.total.toLocaleString()}</div>
                    <div class="kpi-label">Total Crashes Analyzed</div>
                </div>
                <div class="kpi-card kpi-danger">
                    <div class="kpi-icon">&#9888;</div>
                    <div class="kpi-value">${kaTotal.toLocaleString()}</div>
                    <div class="kpi-label">Fatal + Serious Injury (KA)</div>
                </div>
                <div class="kpi-card kpi-warning">
                    <div class="kpi-icon">&#128200;</div>
                    <div class="kpi-value">${kaRate}%</div>
                    <div class="kpi-label">KA Crash Rate</div>
                </div>
            </div>

            <!-- Severity Bar Chart -->
            ${severityBarChart}

            <!-- Key Finding -->
            <div class="key-finding avoid-break">
                <div class="key-finding-label">Key Finding</div>
                ${keyFindingSentence}
            </div>
        </div>

        ${focusPath ? `
        <!-- Identified Focus -->
        <div class="focus-box avoid-break">
            <div class="focus-header">
                <span class="focus-icon">&#10003;</span>
                <span class="focus-title">Identified Focus ${getTreeTypeLabel('short')}</span>
            </div>
            <div class="focus-path">${focusPath}</div>
            <div class="focus-desc">
                This ${getTreeTypeLabel('short').toLowerCase()} represents the highest proportion of ${crashTreeState.severityFilter.includes('K') || crashTreeState.severityFilter.includes('A') ? 'severe ' : ''}crashes in the analyzed data and should be prioritized for systemic safety improvements.
            </div>
        </div>
        ` : ''}

        <!-- Crash Tree Diagram -->
        ${crashTreeImageData ? `
        <div class="section page-break">
            <h2><span class="section-icon">&#127795;</span> Crash Tree Diagram</h2>
            <p class="section-intro">Visual hierarchical breakdown of crashes by ${getTreeTypeLabel('short').toLowerCase()}. The dominant path (focus area) is highlighted.</p>
            <div class="crash-tree-image-container" style="text-align:center;margin:20px 0;padding:15px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                <img src="${crashTreeImageData}" alt="Crash Tree Diagram" style="max-width:100%;height:auto;border-radius:4px;" />
            </div>
        </div>
        ` : ''}

        <!-- Crash Breakdown Table -->
        <div class="section avoid-break">
            <h2><span class="section-icon">&#128202;</span> Hierarchical Crash Breakdown</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th style="width:32%;">Category</th>
                        <th style="width:11%;text-align:right;">Total</th>
                        <th style="width:9%;text-align:right;">Fatal</th>
                        <th style="width:9%;text-align:right;">Serious</th>
                        <th style="width:10%;text-align:right;">KA</th>
                        <th style="width:11%;text-align:right;">% of Total</th>
                        <th style="width:10%;text-align:right;">State Avg</th>
                        <th style="width:8%;text-align:center;">vs Avg</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateProfessionalTableRows(tree)}
                </tbody>
            </table>
            <div class="tree-legend">
                <strong>Legend:</strong> Rows marked with <strong style="color:#059669;">*</strong> indicate the dominant crash path (focus for systemic improvements).
                <strong style="color:#dc2626;">&#8593;</strong> = Above state average | <strong style="color:#059669;">&#8595;</strong> = Below state average
            </div>
        </div>

        ${analysisOverviewHtml}

        ${riskFactorHtml}

        <!-- Methodology Callout -->
        <div class="methodology-box avoid-break">
            <div class="methodology-header">
                <span class="methodology-icon">&#8505;</span>
                <h3>About This Analysis</h3>
            </div>
            <p>This report follows the <strong>FHWA Systemic Safety Project Selection Tool</strong> methodology. The systemic approach identifies roadway features correlated with specific crash types, enabling proactive safety improvements across similar locations rather than only addressing sites with documented crash history.</p>
            <p>The crash tree provides a hierarchical breakdown to identify <strong>focus crash types</strong> (what type of crashes to address) and <strong>focus facilities</strong> (where to implement improvements). Categories with percentages significantly higher than statewide averages indicate overrepresentation and priority for intervention.</p>
            <div class="methodology-citation">
                <strong>Reference:</strong> FHWA-SA-13-019, Systemic Safety Project Selection Tool (Federal Highway Administration)
            </div>
        </div>

        <!-- Next Steps -->
        <div class="section next-steps-box page-break">
            <h2><span class="section-icon">&#9745;</span> Recommended Next Steps</h2>
            <ol class="next-steps-list">
                <li class="next-step-item next-step-tip">
                    <span class="next-step-number">1</span>
                    <div class="next-step-content">
                        <div class="next-step-title">Apply Focus to CMF Database</div>
                        <div class="next-step-desc">Use the identified focus facility/crash type to filter the Crash Modification Factors (CMF) database. This will surface countermeasures specifically proven effective for your target crash profile.</div>
                    </div>
                </li>
                <li class="next-step-item">
                    <span class="next-step-number">2</span>
                    <div class="next-step-content">
                        <div class="next-step-title">Screen Network Locations</div>
                        <div class="next-step-desc">Identify all locations in the roadway network sharing characteristics of the focus facility type. This creates your candidate list for systemic improvements.</div>
                    </div>
                </li>
                <li class="next-step-item">
                    <span class="next-step-number">3</span>
                    <div class="next-step-content">
                        <div class="next-step-title">Analyze Risk Factors</div>
                        <div class="next-step-desc">Examine common roadway features at crash locations to develop screening criteria. Look for geometric, operational, or environmental factors correlated with crashes.</div>
                    </div>
                </li>
                <li class="next-step-item">
                    <span class="next-step-number">4</span>
                    <div class="next-step-content">
                        <div class="next-step-title">Prioritize and Rank Projects</div>
                        <div class="next-step-desc">Rank candidate locations using benefit-cost analysis and available funding. Consider EPDO weights, countermeasure costs, and expected crash reduction factors.</div>
                    </div>
                </li>
                <li class="next-step-item">
                    <span class="next-step-number">5</span>
                    <div class="next-step-content">
                        <div class="next-step-title">Document for HSIP Funding</div>
                        <div class="next-step-desc">Use this analysis to support Highway Safety Improvement Program (HSIP) funding applications. The systemic approach is strongly supported by FHWA for federal safety funding.</div>
                    </div>
                </li>
            </ol>
        </div>

        <!-- Footer -->
        <div class="report-footer">
            <div class="footer-left">
                <div class="footer-brand">Crash Analysis Tool</div>
                <div>Systemic Safety Analysis Module</div>
            </div>
            <div class="footer-right">
                <div class="footer-reference">Reference: FHWA-SA-13-019</div>
                <div class="footer-page">Generated ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    // Open in new window
    const printWindow = window.open('', '_blank', 'width=900,height=700');
    if (printWindow) {
        printWindow.document.write(reportHtml);
        printWindow.document.close();
        showToast('Report generated - click Print button to save as PDF', 'success');
    } else {
        showToast('Pop-up blocked - please allow pop-ups for this site', 'error');
    }
}

// Generate professional table rows with proper formatting and comparison arrows
function generateProfessionalTableRows(node, indent = 0) {
    if (!node) return '';
    const ka = node.unfilteredKA !== undefined ? node.unfilteredKA : ((node.K || 0) + (node.A || 0));
    const isDominant = crashTreeState.dominantPath.includes(node.id);
    const levelClass = `level-${Math.min(indent, 2)}`;
    const highlightClass = isDominant && indent > 0 ? 'row-highlight' : '';

    // Calculate comparison to state average
    let comparisonHtml = '-';
    if (node.stateAvg !== undefined && indent > 0) {
        const diff = node.pct - node.stateAvg;
        if (Math.abs(diff) < 2) {
            comparisonHtml = '<span class="compare-equal">&#8776;</span>';
        } else if (diff > 0) {
            comparisonHtml = '<span class="compare-up">&#8593;</span>';
        } else {
            comparisonHtml = '<span class="compare-down">&#8595;</span>';
        }
    }

    let rows = `
        <tr class="${highlightClass} ${indent === 0 ? 'level-0' : ''}">
            <td class="${levelClass}">${indent > 0 ? '&#8627; ' : ''}${node.name}</td>
            <td style="text-align:right;font-family:monospace;">${node.total.toLocaleString()}</td>
            <td style="text-align:right;font-family:monospace;color:#991b1b;">${node.K || 0}</td>
            <td style="text-align:right;font-family:monospace;color:#c2410c;">${node.A || 0}</td>
            <td style="text-align:right;font-weight:700;font-family:monospace;">${ka}</td>
            <td style="text-align:right;font-family:monospace;">${node.pct.toFixed(1)}%</td>
            <td style="text-align:right;font-family:monospace;color:#64748b;">${node.stateAvg !== undefined ? node.stateAvg + '%' : '-'}</td>
            <td style="text-align:center;">${comparisonHtml}</td>
        </tr>
    `;

    if (node.children && node.children.length > 0) {
        rows += node.children.map(c => generateProfessionalTableRows(c, indent + 1)).join('');
    }
    return rows;
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.crashTree = CL.crashTree || {};
  window.exportCrashTreeImage = exportCrashTreeImage; CL.crashTree.exportCrashTreeImage = exportCrashTreeImage;
  window.generateCrashTreeReport = generateCrashTreeReport; CL.crashTree.generateCrashTreeReport = generateCrashTreeReport;
  window.generateProfessionalTableRows = generateProfessionalTableRows; CL.crashTree.generateProfessionalTableRows = generateProfessionalTableRows;
  CL._registerModule('crash-tree/export');
})();
