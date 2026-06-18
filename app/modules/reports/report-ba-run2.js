/**
 * CL reports.ba — BA charts + detailed table + findings/conclusions
 * Extracted verbatim from app/index.html (Before/After report band, prompt
 * 42c, size-split). NO behavior change. baState stays INLINE (read via global
 * scope); all fns dual-exposed window.<fn> + CL.reports.ba.<fn> (onclick + cross-file).
 * Depends at call time: baState, COL, crashState, docx, jsPDF, html2canvas, Chart.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───
// Create BA charts
function createBACharts(r) {
    // Destroy existing charts
    const compChart = Chart.getChart('baComparisonChart');
    const trendChart = Chart.getChart('baTrendChart');
    if (compChart) compChart.destroy();
    if (trendChart) trendChart.destroy();

    // Comparison Chart
    new Chart(document.getElementById('baComparisonChart'), {
        type: 'bar',
        data: {
            labels: ['Total', 'Fatal', 'Serious (A)', 'Other Injury', 'PDO'],
            datasets: [
                {
                    label: 'Before',
                    data: [r.before.stats.total, r.before.stats.K, r.before.stats.A, r.before.stats.B + r.before.stats.C, r.before.stats.O],
                    backgroundColor: 'rgba(220, 38, 38, 0.7)',
                    borderColor: '#dc2626',
                    borderWidth: 1
                },
                {
                    label: 'After',
                    data: [r.after.stats.total, r.after.stats.K, r.after.stats.A, r.after.stats.B + r.after.stats.C, r.after.stats.O],
                    backgroundColor: 'rgba(22, 163, 74, 0.7)',
                    borderColor: '#16a34a',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
        }
    });

    // Trend Chart - Monthly crashes over time
    const monthlyData = calculateMonthlyTrend(r);
    new Chart(document.getElementById('baTrendChart'), {
        type: 'line',
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: 'Monthly Crashes',
                data: monthlyData.data,
                borderColor: '#1e40af',
                backgroundColor: 'rgba(30, 64, 175, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                annotation: {
                    annotations: {
                        treatmentLine: {
                            type: 'line',
                            xMin: monthlyData.treatmentIndex,
                            xMax: monthlyData.treatmentIndex,
                            borderColor: '#dc2626',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                content: 'Treatment',
                                enabled: true,
                                position: 'start'
                            }
                        }
                    }
                }
            },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Calculate monthly trend data
function calculateMonthlyTrend(r) {
    const allCrashes = [...r.before.crashes, ...r.after.crashes];
    const monthCounts = {};

    allCrashes.forEach(row => {
        const date = new Date(Number(row[COL.DATE]));
        if (!isNaN(date)) {
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            monthCounts[key] = (monthCounts[key] || 0) + 1;
        }
    });

    const sortedMonths = Object.keys(monthCounts).sort();
    const treatmentDate = baState.treatmentDate;
    const treatmentMonth = treatmentDate ?
        `${treatmentDate.getFullYear()}-${String(treatmentDate.getMonth() + 1).padStart(2, '0')}` : null;

    return {
        labels: sortedMonths.map(m => {
            const [y, mo] = m.split('-');
            return `${mo}/${y.slice(2)}`;
        }),
        data: sortedMonths.map(m => monthCounts[m]),
        treatmentIndex: treatmentMonth ? sortedMonths.indexOf(treatmentMonth) : -1
    };
}

// Display detailed comparison table
function displayBADetailedTable(r) {
    const container = document.getElementById('baDetailedTable');

    // Calculate rates per year
    const beforeRate = r.before.stats.total / r.before.years;
    const afterRate = r.after.stats.total / r.after.years;

    container.innerHTML = `
        <table class="data-table" style="width:100%">
            <thead>
                <tr>
                    <th style="text-align:left">Metric</th>
                    <th style="text-align:right;background:#fee2e2;color:#dc2626">BEFORE Period</th>
                    <th style="text-align:right;background:#dcfce7;color:#16a34a">AFTER Period</th>
                    <th style="text-align:right">Change</th>
                    <th style="text-align:right">% Change</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Study Period</td>
                    <td style="text-align:right">${r.before.years.toFixed(2)} years</td>
                    <td style="text-align:right">${r.after.years.toFixed(2)} years</td>
                    <td colspan="2" style="text-align:center;color:var(--gray)">-</td>
                </tr>
                <tr style="font-weight:600">
                    <td>Total Crashes</td>
                    <td style="text-align:right">${r.before.stats.total}</td>
                    <td style="text-align:right">${r.after.stats.total}</td>
                    <td style="text-align:right;color:${r.after.stats.total < r.before.stats.total ? '#16a34a' : '#dc2626'}">${r.after.stats.total - r.before.stats.total}</td>
                    <td style="text-align:right;color:${r.after.stats.total < r.before.stats.total ? '#16a34a' : '#dc2626'}">${r.before.stats.total > 0 ? ((r.after.stats.total - r.before.stats.total) / r.before.stats.total * 100).toFixed(1) : 'N/A'}%</td>
                </tr>
                <tr>
                    <td>Annual Crash Rate</td>
                    <td style="text-align:right">${beforeRate.toFixed(2)}</td>
                    <td style="text-align:right">${afterRate.toFixed(2)}</td>
                    <td style="text-align:right;color:${afterRate < beforeRate ? '#16a34a' : '#dc2626'}">${(afterRate - beforeRate).toFixed(2)}</td>
                    <td style="text-align:right;color:${afterRate < beforeRate ? '#16a34a' : '#dc2626'}">${beforeRate > 0 ? ((afterRate - beforeRate) / beforeRate * 100).toFixed(1) : 'N/A'}%</td>
                </tr>
                <tr>
                    <td>Fatal Crashes (K)</td>
                    <td style="text-align:right">${r.before.stats.K}</td>
                    <td style="text-align:right">${r.after.stats.K}</td>
                    <td style="text-align:right;color:${r.after.stats.K < r.before.stats.K ? '#16a34a' : (r.after.stats.K > r.before.stats.K ? '#dc2626' : 'inherit')}">${r.after.stats.K - r.before.stats.K}</td>
                    <td style="text-align:right">${r.before.stats.K > 0 ? ((r.after.stats.K - r.before.stats.K) / r.before.stats.K * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td>Serious Injury (A)</td>
                    <td style="text-align:right">${r.before.stats.A}</td>
                    <td style="text-align:right">${r.after.stats.A}</td>
                    <td style="text-align:right;color:${r.after.stats.A < r.before.stats.A ? '#16a34a' : (r.after.stats.A > r.before.stats.A ? '#dc2626' : 'inherit')}">${r.after.stats.A - r.before.stats.A}</td>
                    <td style="text-align:right">${r.before.stats.A > 0 ? ((r.after.stats.A - r.before.stats.A) / r.before.stats.A * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td>K+A Combined</td>
                    <td style="text-align:right">${r.before.stats.K + r.before.stats.A}</td>
                    <td style="text-align:right">${r.after.stats.K + r.after.stats.A}</td>
                    <td style="text-align:right;color:${(r.after.stats.K + r.after.stats.A) < (r.before.stats.K + r.before.stats.A) ? '#16a34a' : '#dc2626'}">${(r.after.stats.K + r.after.stats.A) - (r.before.stats.K + r.before.stats.A)}</td>
                    <td style="text-align:right">${(r.before.stats.K + r.before.stats.A) > 0 ? (((r.after.stats.K + r.after.stats.A) - (r.before.stats.K + r.before.stats.A)) / (r.before.stats.K + r.before.stats.A) * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td>EPDO Score</td>
                    <td style="text-align:right">${calcEPDO(r.before.stats)}</td>
                    <td style="text-align:right">${calcEPDO(r.after.stats)}</td>
                    <td style="text-align:right;color:${calcEPDO(r.after.stats) < calcEPDO(r.before.stats) ? '#16a34a' : '#dc2626'}">${calcEPDO(r.after.stats) - calcEPDO(r.before.stats)}</td>
                    <td style="text-align:right">${calcEPDO(r.before.stats) > 0 ? ((calcEPDO(r.after.stats) - calcEPDO(r.before.stats)) / calcEPDO(r.before.stats) * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td>Pedestrian Crashes</td>
                    <td style="text-align:right">${r.before.stats.ped}</td>
                    <td style="text-align:right">${r.after.stats.ped}</td>
                    <td style="text-align:right">${r.after.stats.ped - r.before.stats.ped}</td>
                    <td style="text-align:right">${r.before.stats.ped > 0 ? ((r.after.stats.ped - r.before.stats.ped) / r.before.stats.ped * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
                <tr>
                    <td>Bicycle Crashes</td>
                    <td style="text-align:right">${r.before.stats.bike}</td>
                    <td style="text-align:right">${r.after.stats.bike}</td>
                    <td style="text-align:right">${r.after.stats.bike - r.before.stats.bike}</td>
                    <td style="text-align:right">${r.before.stats.bike > 0 ? ((r.after.stats.bike - r.before.stats.bike) / r.before.stats.bike * 100).toFixed(1) + '%' : 'N/A'}</td>
                </tr>
            </tbody>
        </table>
    `;
}

// Display key findings
function displayBAFindings(r) {
    const container = document.getElementById('baKeyFindings');
    const findings = [];

    // Total crash change
    const totalChange = r.after.stats.total - r.before.stats.total;
    const totalPctChange = r.before.stats.total > 0 ? (totalChange / r.before.stats.total * 100) : 0;
    if (totalChange < 0) {
        findings.push({ type: 'success', text: `Total crashes reduced by ${Math.abs(totalPctChange).toFixed(1)}% (${r.before.stats.total} → ${r.after.stats.total})` });
    } else if (totalChange > 0) {
        findings.push({ type: 'danger', text: `Total crashes increased by ${totalPctChange.toFixed(1)}% (${r.before.stats.total} → ${r.after.stats.total})` });
    } else {
        findings.push({ type: 'neutral', text: `Total crashes unchanged (${r.before.stats.total})` });
    }

    // Fatal crashes
    if (r.before.stats.K > 0 && r.after.stats.K === 0) {
        findings.push({ type: 'success', text: `Fatal crashes eliminated (${r.before.stats.K} → 0)` });
    } else if (r.after.stats.K < r.before.stats.K) {
        findings.push({ type: 'success', text: `Fatal crashes reduced (${r.before.stats.K} → ${r.after.stats.K})` });
    } else if (r.after.stats.K > r.before.stats.K) {
        findings.push({ type: 'danger', text: `Fatal crashes increased (${r.before.stats.K} → ${r.after.stats.K})` });
    }

    // Statistical significance
    if (r.isSignificant) {
        findings.push({ type: 'success', text: `Statistical analysis confirms treatment effectiveness (p = ${r.pValue.toFixed(4)})` });
    } else {
        findings.push({ type: 'warning', text: `Results not statistically significant (p = ${r.pValue.toFixed(4)}) - may be due to random variation` });
    }

    // CMF interpretation
    if (r.cmf < 0.8) {
        findings.push({ type: 'success', text: `Strong crash reduction effect (CMF = ${r.cmf.toFixed(3)}, ${r.crf.toFixed(1)}% reduction)` });
    } else if (r.cmf < 1.0) {
        findings.push({ type: 'info', text: `Moderate crash reduction effect (CMF = ${r.cmf.toFixed(3)}, ${r.crf.toFixed(1)}% reduction)` });
    } else {
        findings.push({ type: 'warning', text: `No crash reduction observed (CMF = ${r.cmf.toFixed(3)})` });
    }

    container.innerHTML = findings.map(f => `
        <div class="finding-item ${f.type}" style="padding:.75rem;margin-bottom:.5rem;border-radius:var(--radius);background:${f.type === 'success' ? '#dcfce7' : (f.type === 'danger' ? '#fee2e2' : (f.type === 'warning' ? '#fef3c7' : '#f3f4f6'))};border-left:4px solid ${f.type === 'success' ? '#16a34a' : (f.type === 'danger' ? '#dc2626' : (f.type === 'warning' ? '#f59e0b' : '#6b7280'))}">
            <span style="margin-right:.5rem">${f.type === 'success' ? '✅' : (f.type === 'danger' ? '❌' : (f.type === 'warning' ? '⚠️' : 'ℹ️'))}</span>
            ${f.text}
        </div>
    `).join('');
}

// Display conclusions and recommendations
function displayBAConclusions(r, treatmentName) {
    const container = document.getElementById('baConclusions');
    const conclusions = [];

    if (r.isSignificant && r.crf > 0) {
        conclusions.push(`The ${treatmentName} installation at ${baState.locationName} demonstrates statistically significant crash reduction.`);
        conclusions.push(`This treatment is recommended for HSIP documentation and future project justification.`);
        if (r.crf > 20) {
            conclusions.push(`The observed ${r.crf.toFixed(1)}% reduction exceeds typical expectations, suggesting high treatment effectiveness at this location.`);
        }
    } else if (r.crf > 0 && !r.isSignificant) {
        conclusions.push(`While crash reduction is observed, the results are not statistically significant.`);
        conclusions.push(`Consider extending the study period to accumulate more data for conclusive results.`);
        conclusions.push(`Additional factors such as traffic volume changes or nearby development should be investigated.`);
    } else {
        conclusions.push(`The treatment has not demonstrated measurable crash reduction at this location.`);
        conclusions.push(`Review implementation details and consider whether the treatment was appropriate for the crash patterns at this site.`);
        conclusions.push(`Consult with traffic safety specialists to identify alternative countermeasures.`);
    }

    // Method-specific note
    if (baState.analysisMethod === 'naive') {
        conclusions.push(`Note: This analysis used the Naive method which does not account for regression-to-mean. Results should be interpreted with caution.`);
    }

    container.innerHTML = conclusions.map(c => `
        <p style="margin-bottom:.75rem;padding-left:1rem;border-left:3px solid #7c3aed;color:var(--dark)">${c}</p>
    `).join('');
}

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.ba = CL.reports.ba || {};
  window.createBACharts = createBACharts; CL.reports.ba.createBACharts = createBACharts;
  window.calculateMonthlyTrend = calculateMonthlyTrend; CL.reports.ba.calculateMonthlyTrend = calculateMonthlyTrend;
  window.displayBADetailedTable = displayBADetailedTable; CL.reports.ba.displayBADetailedTable = displayBADetailedTable;
  window.displayBAFindings = displayBAFindings; CL.reports.ba.displayBAFindings = displayBAFindings;
  window.displayBAConclusions = displayBAConclusions; CL.reports.ba.displayBAConclusions = displayBAConclusions;
  CL._registerModule('reports/report-ba-run2');
})();
