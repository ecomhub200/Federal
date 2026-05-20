/**
 * CL reports.baRun — extracted from app/index.html (name-anchored,
 * live L61480-L61731). navigateTo-split round, prompt 42c1(b) Part 1.
 * Responsibility: Before/After analysis engine — run the analysis, filter
 * crashes by period, normalCDF, render KPI/statistical results sections.
 * Charts/findings/conclusions tail stays inline (Part 2 deferred — would
 * push file over 500 LOC).
 *
 * Reads shared inline globals via classic-script global lexical env
 * (NOT mirrored): `baState`, `COL`, `calcEPDO`, `computeStatsFromMapPoints`,
 * `showLoading`, `hideLoading`, `checkBAMonitoringOnDataLoad`,
 * `createBACharts`, `displayBADetailedTable`, `displayBAFindings`,
 * `displayBAConclusions` (last 4 stay inline — Part 2 deferred).
 *
 * Public API mirrors:
 *   - window.runBeforeAfterAnalysis (HTML onclick L10597)
 *   - window.filterCrashesByPeriod (called by Part 2 fns; future-proofing)
 *   - window.normalCDF (math util; future-proofing)
 *   - window.displayBAResults (called from this module; future-proofing)
 *   - window.displayBAKPIComparison (sub-renderer)
 *   - window.displayBAStatisticalResults (sub-renderer)
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.reports = CL.reports || {};

  // ─── EXTRACTED CODE START (verbatim from index.html L61480-L61731) ───
// Run Before & After Analysis
function runBeforeAfterAnalysis() {
    // Validate inputs
    if (!baState.selectedLocation && baState.locationCrashes.length === 0) {
        alert('Please select a location for the study.');
        return;
    }

    const treatmentType = document.getElementById('baTreatmentType').value;
    if (!treatmentType) {
        alert('Please select a treatment type.');
        return;
    }

    const treatmentDate = document.getElementById('baTreatmentDate').value;
    if (!treatmentDate) {
        alert('Please enter the treatment installation date.');
        return;
    }

    const beforeStart = new Date(document.getElementById('baBeforeStart').value);
    const beforeEnd = new Date(document.getElementById('baBeforeEnd').value);
    const afterStart = new Date(document.getElementById('baAfterStart').value);
    const afterEnd = new Date(document.getElementById('baAfterEnd').value);

    if (isNaN(beforeStart) || isNaN(beforeEnd) || isNaN(afterStart) || isNaN(afterEnd)) {
        alert('Please ensure all study period dates are properly set.');
        return;
    }

    showLoading('Running Before & After Analysis...');

    setTimeout(() => {
        try {
            // Filter crashes for before and after periods
            const beforeCrashes = filterCrashesByPeriod(baState.locationCrashes, beforeStart, beforeEnd);
            const afterCrashes = filterCrashesByPeriod(baState.locationCrashes, afterStart, afterEnd);

            // Calculate statistics (use mapPoints-compatible function)
            const beforeStats = computeStatsFromMapPoints(beforeCrashes);
            const afterStats = computeStatsFromMapPoints(afterCrashes);

            // Calculate period lengths in years
            const beforeYears = (beforeEnd - beforeStart) / (1000 * 60 * 60 * 24 * 365);
            const afterYears = (afterEnd - afterStart) / (1000 * 60 * 60 * 24 * 365);

            // Calculate annualized rates
            const beforeRate = beforeStats.total / beforeYears;
            const afterRate = afterStats.total / afterYears;

            // Calculate CMF and CRF
            let cmf, crf, expectedAfter, variance, stdError, pValue, isSignificant;

            if (baState.analysisMethod === 'eb') {
                // Empirical Bayes calculation (simplified)
                const adjustmentFactor = afterYears / beforeYears;
                expectedAfter = beforeStats.total * adjustmentFactor;
                cmf = afterStats.total / expectedAfter;
                crf = (1 - cmf) * 100;

                // Calculate statistical significance
                variance = expectedAfter; // Poisson variance approximation
                stdError = Math.sqrt(variance);
                const zScore = (expectedAfter - afterStats.total) / stdError;
                pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
                isSignificant = pValue < (1 - parseFloat(document.getElementById('baConfidenceLevel').value));
            } else {
                // Naive calculation
                cmf = afterRate / beforeRate;
                crf = (1 - cmf) * 100;
                expectedAfter = beforeRate * afterYears;
                variance = afterStats.total;
                stdError = Math.sqrt(variance);
                pValue = 0.5; // Naive method doesn't provide reliable p-value
                isSignificant = false;
            }

            // Store results
            baState.results = {
                before: { crashes: beforeCrashes, stats: beforeStats, years: beforeYears, rate: beforeRate },
                after: { crashes: afterCrashes, stats: afterStats, years: afterYears, rate: afterRate },
                cmf: cmf,
                crf: crf,
                expectedAfter: expectedAfter,
                pValue: pValue,
                isSignificant: isSignificant,
                confidenceLevel: parseFloat(document.getElementById('baConfidenceLevel').value)
            };

            // Display results
            displayBAResults();

            hideLoading();
            document.getElementById('beforeAfterResults').style.display = 'block';
            document.getElementById('beforeAfterResults').scrollIntoView({ behavior: 'smooth' });

            // Evaluate monitoring alert conditions after analysis completes
            checkBAMonitoringOnDataLoad();
        } catch (err) {
            hideLoading();
            console.error('BA Analysis Error:', err);
            alert('Error running analysis: ' + err.message);
        }
    }, 100);
}

// Filter crashes by date period
function filterCrashesByPeriod(crashes, startDate, endDate) {
    return crashes.filter(crash => {
        // Support both mapPoints format (crash.date) and row format (crash[COL.DATE])
        const dateVal = crash.date !== undefined ? crash.date : crash[COL.DATE];
        const crashDate = new Date(Number(dateVal));
        return crashDate >= startDate && crashDate <= endDate;
    });
}

// Normal CDF approximation for p-value calculation
function normalCDF(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return 0.5 * (1.0 + sign * y);
}

// Display BA results
function displayBAResults() {
    const r = baState.results;
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect.options[treatmentSelect.selectedIndex].text;

    // Update header
    document.getElementById('baReportTitle').textContent = 'Before & After Safety Study Report';
    document.getElementById('baReportSubtitle').textContent = `${baState.locationName} | ${treatmentName}`;
    document.getElementById('baReportMeta').textContent =
        `Study Period: ${document.getElementById('baBeforeStart').value} to ${document.getElementById('baAfterEnd').value} | ` +
        `Generated: ${new Date().toLocaleDateString()} | Method: ${baState.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive'}`;

    // KPI Comparison
    displayBAKPIComparison(r);

    // Statistical Results
    displayBAStatisticalResults(r);

    // Charts
    setTimeout(() => {
        createBACharts(r);
    }, 100);

    // Detailed Table
    displayBADetailedTable(r);

    // Findings and Conclusions
    displayBAFindings(r);
    displayBAConclusions(r, treatmentName);
}

// Display KPI comparison section
function displayBAKPIComparison(r) {
    const container = document.getElementById('baKPIComparison');

    const metrics = [
        { label: 'Total Crashes', before: r.before.stats.total, after: r.after.stats.total, color: '#1e40af' },
        { label: 'Fatal (K)', before: r.before.stats.K, after: r.after.stats.K, color: '#dc2626' },
        { label: 'Serious Injury (A)', before: r.before.stats.A, after: r.after.stats.A, color: '#ea580c' },
        { label: 'Other Injury (BC)', before: r.before.stats.B + r.before.stats.C, after: r.after.stats.B + r.after.stats.C, color: '#ca8a04' },
        { label: 'PDO', before: r.before.stats.O, after: r.after.stats.O, color: '#6b7280' },
        { label: 'EPDO Score', before: calcEPDO(r.before.stats), after: calcEPDO(r.after.stats), color: '#7c3aed' }
    ];

    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem">
            ${metrics.map(m => {
                const change = m.before > 0 ? ((m.after - m.before) / m.before * 100) : 0;
                const changeClass = change < 0 ? 'decrease' : (change > 0 ? 'increase' : 'neutral');
                const changeIcon = change < 0 ? '↓' : (change > 0 ? '↑' : '→');
                return `
                    <div class="ba-kpi-card" style="background:white;border-radius:var(--radius);padding:1rem;border-left:4px solid ${m.color};box-shadow:0 1px 3px rgba(0,0,0,.1)">
                        <div style="font-size:.75rem;color:var(--gray);margin-bottom:.5rem;font-weight:600">${m.label}</div>
                        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:.5rem">
                            <div>
                                <div style="font-size:.65rem;color:#dc2626">BEFORE</div>
                                <div style="font-size:1.25rem;font-weight:700;color:#dc2626">${m.before.toLocaleString()}</div>
                            </div>
                            <div style="font-size:1.25rem;color:var(--gray)">→</div>
                            <div>
                                <div style="font-size:.65rem;color:#16a34a">AFTER</div>
                                <div style="font-size:1.25rem;font-weight:700;color:#16a34a">${m.after.toLocaleString()}</div>
                            </div>
                        </div>
                        <div style="text-align:center;padding:.25rem;border-radius:var(--radius);background:${change < 0 ? '#dcfce7' : (change > 0 ? '#fee2e2' : '#f3f4f6')};color:${change < 0 ? '#16a34a' : (change > 0 ? '#dc2626' : '#6b7280')};font-weight:600;font-size:.85rem">
                            ${changeIcon} ${Math.abs(change).toFixed(1)}%
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Display statistical results
function displayBAStatisticalResults(r) {
    const container = document.getElementById('baStatisticalResults');
    const confidencePercent = (r.confidenceLevel * 100).toFixed(0);

    container.innerHTML = `
        <table class="data-table" style="width:100%">
            <thead>
                <tr>
                    <th style="text-align:left">Metric</th>
                    <th style="text-align:right">Value</th>
                    <th style="text-align:left">Interpretation</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Crash Modification Factor (CMF)</strong></td>
                    <td style="text-align:right;font-weight:600;color:${r.cmf < 1 ? '#16a34a' : '#dc2626'}">${r.cmf.toFixed(3)}</td>
                    <td>${r.cmf < 1 ? `${((1 - r.cmf) * 100).toFixed(1)}% crash reduction` : `${((r.cmf - 1) * 100).toFixed(1)}% crash increase`}</td>
                </tr>
                <tr>
                    <td><strong>Crash Reduction Factor (CRF)</strong></td>
                    <td style="text-align:right;font-weight:600;color:${r.crf > 0 ? '#16a34a' : '#dc2626'}">${r.crf.toFixed(1)}%</td>
                    <td>${r.crf > 0 ? 'Positive safety effect' : 'Negative safety effect'}</td>
                </tr>
                <tr>
                    <td><strong>Expected Crashes (After)</strong></td>
                    <td style="text-align:right">${r.expectedAfter.toFixed(1)}</td>
                    <td>Without treatment, based on before period</td>
                </tr>
                <tr>
                    <td><strong>Actual Crashes (After)</strong></td>
                    <td style="text-align:right">${r.after.stats.total}</td>
                    <td>${r.after.stats.total < r.expectedAfter ? `${(r.expectedAfter - r.after.stats.total).toFixed(1)} fewer than expected` : `${(r.after.stats.total - r.expectedAfter).toFixed(1)} more than expected`}</td>
                </tr>
                <tr>
                    <td><strong>p-value</strong></td>
                    <td style="text-align:right">${r.pValue.toFixed(4)}</td>
                    <td>${r.pValue < 0.05 ? '< 0.05 threshold (significant)' : '>= 0.05 threshold (not significant)'}</td>
                </tr>
                <tr style="background:${r.isSignificant ? '#dcfce7' : '#fef3c7'}">
                    <td><strong>Statistical Significance (${confidencePercent}%)</strong></td>
                    <td style="text-align:right;font-weight:600">${r.isSignificant ? '✅ Yes' : '⚠️ No'}</td>
                    <td>${r.isSignificant ? 'Treatment effect is statistically significant' : 'Results may be due to random variation'}</td>
                </tr>
            </tbody>
        </table>
    `;
}
  // ─── EXTRACTED CODE END ───

  // Public API — dual exposure
  window.runBeforeAfterAnalysis = runBeforeAfterAnalysis;          CL.reports.runBeforeAfterAnalysis = runBeforeAfterAnalysis;
  window.filterCrashesByPeriod = filterCrashesByPeriod;            CL.reports.filterCrashesByPeriod = filterCrashesByPeriod;
  window.normalCDF = normalCDF;                                    CL.reports.normalCDF = normalCDF;
  window.displayBAResults = displayBAResults;                      CL.reports.displayBAResults = displayBAResults;
  window.displayBAKPIComparison = displayBAKPIComparison;          CL.reports.displayBAKPIComparison = displayBAKPIComparison;
  window.displayBAStatisticalResults = displayBAStatisticalResults;CL.reports.displayBAStatisticalResults = displayBAStatisticalResults;

  CL._registerModule('reports/report-ba-run');
})();
