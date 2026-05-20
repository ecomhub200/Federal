/**
 * CL reports.baExport — extracted from app/index.html (name-anchored,
 * post-shift live L61485-L61924). navigateTo-split round, prompt 42c3.
 * Responsibility: Before/After report export — print, native PDF download,
 * CSV data export, clipboard copy.
 *
 * Reads shared inline globals via classic-script global lexical env
 * (NOT mirrored): baState, calcEPDO, COL, etc.
 *
 * Public API mirrors (all 4 fns — HTML onclick L10832-L10835):
 *   printBAReport, downloadBAPDF, exportBAData, copyBAReport
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.reports = CL.reports || {};

  // ─── EXTRACTED CODE START (verbatim from index.html L61485-L61924) ───
function printBAReport() {
    window.print();
}

// Download BA Report as PDF - Professional native PDF generation
function downloadBAPDF() {
    if (!baState.results) {
        alert('No results to download. Please run the analysis first.');
        return;
    }

    const r = baState.results;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // Color palette
    const colors = {
        primary: [30, 64, 175],      // Blue
        secondary: [124, 58, 237],   // Purple
        success: [22, 163, 74],      // Green
        danger: [220, 38, 38],       // Red
        warning: [234, 88, 12],      // Orange
        fatal: [220, 38, 38],
        serious: [234, 88, 12],
        moderate: [249, 115, 22],
        minor: [250, 204, 21],
        pdo: [156, 163, 175],
        gray: [100, 116, 139],
        lightGray: [248, 250, 252],
        white: [255, 255, 255],
        text: [51, 51, 51]
    };

    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateStamp = new Date().toISOString().split('T')[0];
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect?.options[treatmentSelect.selectedIndex]?.text || 'Treatment';
    const methodName = baState.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive Before/After';

    // === PAGE HEADER ===
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(...colors.secondary);
    doc.rect(0, 32, pageWidth, 8, 'F');

    // Title
    doc.setTextColor(...colors.white);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('CRASH LENS', margin, 15);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Before & After Safety Study', margin, 24);

    // Info box
    doc.setFillColor(...colors.white);
    doc.roundedRect(pageWidth - margin - 60, 6, 55, 28, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setTextColor(...colors.text);
    doc.text(`Method: ${baState.analysisMethod === 'eb' ? 'EB' : 'Naive'}`, pageWidth - margin - 55, 13);
    doc.text(`CMF: ${r.cmf.toFixed(3)}`, pageWidth - margin - 55, 20);
    doc.text(`Generated: ${generatedDate}`, pageWidth - margin - 55, 27);

    let y = 50;

    // === LOCATION & TREATMENT INFO ===
    doc.setFillColor(...colors.lightGray);
    doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Study Location:', margin + 5, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    doc.text((baState.locationName || 'N/A').substring(0, 55), margin + 40, y + 7);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.secondary);
    doc.text('Treatment:', margin + 5, y + 15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);
    doc.text(treatmentName.substring(0, 55), margin + 35, y + 15);

    y += 30;

    // === KPI CARDS - CMF & CRF Results ===
    const kpiWidth = (contentWidth - 15) / 4;

    function drawKPI(x, yPos, width, label, value, color, subtext = null) {
        doc.setFillColor(...colors.white);
        doc.roundedRect(x, yPos, width, subtext ? 28 : 24, 2, 2, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, yPos, width, subtext ? 28 : 24, 2, 2, 'S');
        doc.setFillColor(...color);
        doc.rect(x, yPos, width, 3, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...color);
        doc.text(String(value), x + width / 2, yPos + 12, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...colors.gray);
        doc.text(label, x + width / 2, yPos + 18, { align: 'center' });

        if (subtext) {
            doc.setFontSize(6);
            doc.text(subtext, x + width / 2, yPos + 24, { align: 'center' });
        }
    }

    // Determine color for CMF/CRF based on effectiveness
    const effectivenessColor = r.crf > 0 ? colors.success : (r.crf < 0 ? colors.danger : colors.gray);
    const significanceColor = r.isSignificant ? colors.success : colors.warning;

    drawKPI(margin, y, kpiWidth, 'CMF', r.cmf.toFixed(3), effectivenessColor, r.cmf < 1 ? 'Effective' : 'Not Effective');
    drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'CRF', `${r.crf > 0 ? '+' : ''}${r.crf.toFixed(1)}%`, effectivenessColor, 'Crash Reduction');
    drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'P-VALUE', r.pValue.toFixed(4), significanceColor, r.isSignificant ? 'Significant' : 'Not Significant');
    drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'CONFIDENCE', `${(r.confidenceLevel * 100).toFixed(0)}%`, colors.primary, 'Level');

    y += 36;

    // === BEFORE vs AFTER COMPARISON ===
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Before vs After Comparison', margin, y);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, margin + contentWidth, y + 3);
    y += 10;

    // Comparison table
    const beforeStats = r.before.stats;
    const afterStats = r.after.stats;

    const comparisonData = [
        ['Total Crashes', beforeStats.total, afterStats.total, afterStats.total - beforeStats.total],
        ['Fatal (K)', beforeStats.K || 0, afterStats.K || 0, (afterStats.K || 0) - (beforeStats.K || 0)],
        ['Serious (A)', beforeStats.A || 0, afterStats.A || 0, (afterStats.A || 0) - (beforeStats.A || 0)],
        ['Moderate (B)', beforeStats.B || 0, afterStats.B || 0, (afterStats.B || 0) - (beforeStats.B || 0)],
        ['Minor (C)', beforeStats.C || 0, afterStats.C || 0, (afterStats.C || 0) - (beforeStats.C || 0)],
        ['PDO (O)', beforeStats.O || 0, afterStats.O || 0, (afterStats.O || 0) - (beforeStats.O || 0)],
        ['EPDO Score', calcEPDO(beforeStats), calcEPDO(afterStats), calcEPDO(afterStats) - calcEPDO(beforeStats)],
        ['Study Years', r.before.years.toFixed(2), r.after.years.toFixed(2), '-'],
        ['Crash Rate/Year', r.before.rate.toFixed(2), r.after.rate.toFixed(2), (r.after.rate - r.before.rate).toFixed(2)]
    ];

    doc.autoTable({
        startY: y,
        head: [['Metric', 'Before', 'After', 'Change']],
        body: comparisonData,
        margin: { left: margin, right: margin },
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: colors.primary, textColor: 255 },
        alternateRowStyles: { fillColor: colors.lightGray },
        columnStyles: {
            0: { cellWidth: 45 },
            1: { cellWidth: 30, halign: 'center' },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'center' }
        },
        didParseCell: function(data) {
            // Color the Change column based on direction
            if (data.column.index === 3 && data.section === 'body' && data.cell.raw !== '-') {
                const val = parseFloat(data.cell.raw);
                if (val < 0) {
                    data.cell.styles.textColor = colors.success;
                    data.cell.styles.fontStyle = 'bold';
                } else if (val > 0) {
                    data.cell.styles.textColor = colors.danger;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        }
    });

    y = doc.lastAutoTable.finalY + 12;

    // === SEVERITY DISTRIBUTION COMPARISON ===
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Severity Distribution Comparison', margin, y);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, margin + contentWidth, y + 3);
    y += 10;

    // Draw Before bar
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.text);
    doc.text('BEFORE', margin, y + 3);

    const barStartX = margin + 25;
    const barWidth = contentWidth - 30;
    const barHeight = 10;

    // Before severity bar
    let beforeTotal = beforeStats.total || 1;
    let barX = barStartX;
    const segments = [
        { key: 'K', color: colors.fatal },
        { key: 'A', color: colors.serious },
        { key: 'B', color: colors.moderate },
        { key: 'C', color: colors.minor },
        { key: 'O', color: colors.pdo }
    ];

    segments.forEach(seg => {
        const count = beforeStats[seg.key] || 0;
        if (count > 0) {
            const segWidth = (count / beforeTotal) * barWidth;
            doc.setFillColor(...seg.color);
            doc.rect(barX, y, segWidth, barHeight, 'F');
            barX += segWidth;
        }
    });
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(barStartX, y, barWidth, barHeight, 'S');

    y += barHeight + 5;

    // After severity bar
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('AFTER', margin, y + 3);

    let afterTotal = afterStats.total || 1;
    barX = barStartX;
    segments.forEach(seg => {
        const count = afterStats[seg.key] || 0;
        if (count > 0) {
            const segWidth = (count / afterTotal) * barWidth;
            doc.setFillColor(...seg.color);
            doc.rect(barX, y, segWidth, barHeight, 'F');
            barX += segWidth;
        }
    });
    doc.rect(barStartX, y, barWidth, barHeight, 'S');

    y += barHeight + 5;

    // Legend
    let legendX = barStartX;
    doc.setFontSize(7);
    const legendLabels = ['Fatal', 'Serious', 'Moderate', 'Minor', 'PDO'];
    segments.forEach((seg, i) => {
        doc.setFillColor(...seg.color);
        doc.rect(legendX, y, 5, 3, 'F');
        doc.setTextColor(...colors.text);
        doc.text(legendLabels[i], legendX + 7, y + 2.5);
        legendX += 28;
    });

    y += 15;

    // === STATISTICAL INTERPRETATION ===
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Statistical Interpretation', margin, y);

    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 3, margin + contentWidth, y + 3);
    y += 10;

    // Interpretation box
    const interpColor = r.isSignificant && r.crf > 0 ? [240, 253, 244] : (r.crf < 0 ? [254, 242, 242] : [248, 250, 252]);
    const interpBorder = r.isSignificant && r.crf > 0 ? colors.success : (r.crf < 0 ? colors.danger : colors.gray);

    doc.setFillColor(...interpColor);
    doc.setDrawColor(...interpBorder);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 35, 2, 2, 'FD');

    y += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...interpBorder);

    let interpretation = '';
    if (r.isSignificant && r.crf > 0) {
        interpretation = 'EFFECTIVE: Treatment shows statistically significant crash reduction';
        doc.text(interpretation, margin + 5, y);
    } else if (r.crf > 0 && !r.isSignificant) {
        interpretation = 'POTENTIALLY EFFECTIVE: Crash reduction observed but not statistically significant';
        doc.text(interpretation, margin + 5, y);
    } else if (r.crf < 0) {
        interpretation = 'NOT EFFECTIVE: Crashes increased after treatment';
        doc.text(interpretation, margin + 5, y);
    } else {
        interpretation = 'INCONCLUSIVE: No significant change observed';
        doc.text(interpretation, margin + 5, y);
    }

    y += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.text);

    const interpText1 = `The CMF of ${r.cmf.toFixed(3)} indicates that crashes ${r.cmf < 1 ? 'decreased' : 'increased'} by ${Math.abs(r.crf).toFixed(1)}% after implementation.`;
    const interpText2 = `With a p-value of ${r.pValue.toFixed(4)}, this result is ${r.isSignificant ? '' : 'NOT '}statistically significant at the ${(r.confidenceLevel * 100).toFixed(0)}% confidence level.`;

    doc.text(interpText1, margin + 5, y);
    y += 5;
    doc.text(interpText2, margin + 5, y);

    y += 20;

    // === METHODOLOGY NOTE ===
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.gray);
    doc.text('Methodology:', margin, y);

    doc.setFont('helvetica', 'normal');
    doc.text(methodName, margin + 28, y);

    if (baState.analysisMethod !== 'eb') {
        y += 5;
        doc.setFontSize(8);
        doc.setTextColor(...colors.warning);
        doc.text('Note: Naive method does not account for regression-to-mean. Results should be interpreted with caution.', margin, y);
    }

    // === ADD FOOTER TO ALL PAGES ===
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        doc.setFontSize(7);
        doc.setTextColor(...colors.gray);
        doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    }

    // Save PDF
    const cleanLocation = (baState.locationName || 'Location').replace(/[^a-zA-Z0-9]/g, '_').substring(0, 25);
    const filename = `BA_Study_${cleanLocation}_${dateStamp}.pdf`;
    doc.save(filename);
}

// Export BA data
function exportBAData() {
    if (!baState.results) {
        alert('No results to export. Please run the analysis first.');
        return;
    }

    const r = baState.results;
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect.options[treatmentSelect.selectedIndex].text;

    const csvContent = [
        'Before & After Study Export',
        `Location,${baState.locationName}`,
        `Treatment,${treatmentName}`,
        `Analysis Method,${baState.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive'}`,
        '',
        'Summary Results',
        `CMF,${r.cmf.toFixed(4)}`,
        `CRF,${r.crf.toFixed(2)}%`,
        `p-value,${r.pValue.toFixed(6)}`,
        `Statistically Significant,${r.isSignificant ? 'Yes' : 'No'}`,
        '',
        'Period Details',
        'Metric,Before,After,Change,% Change',
        `Study Years,${r.before.years.toFixed(2)},${r.after.years.toFixed(2)},-,-`,
        `Total Crashes,${r.before.stats.total},${r.after.stats.total},${r.after.stats.total - r.before.stats.total},${r.before.stats.total > 0 ? ((r.after.stats.total - r.before.stats.total) / r.before.stats.total * 100).toFixed(1) + '%' : 'N/A'}`,
        `Fatal (K),${r.before.stats.K},${r.after.stats.K},${r.after.stats.K - r.before.stats.K},${r.before.stats.K > 0 ? ((r.after.stats.K - r.before.stats.K) / r.before.stats.K * 100).toFixed(1) + '%' : 'N/A'}`,
        `Serious Injury (A),${r.before.stats.A},${r.after.stats.A},${r.after.stats.A - r.before.stats.A},${r.before.stats.A > 0 ? ((r.after.stats.A - r.before.stats.A) / r.before.stats.A * 100).toFixed(1) + '%' : 'N/A'}`,
        `PDO,${r.before.stats.O},${r.after.stats.O},${r.after.stats.O - r.before.stats.O},${r.before.stats.O > 0 ? ((r.after.stats.O - r.before.stats.O) / r.before.stats.O * 100).toFixed(1) + '%' : 'N/A'}`,
        `EPDO,${calcEPDO(r.before.stats)},${calcEPDO(r.after.stats)},${calcEPDO(r.after.stats) - calcEPDO(r.before.stats)},${calcEPDO(r.before.stats) > 0 ? ((calcEPDO(r.after.stats) - calcEPDO(r.before.stats)) / calcEPDO(r.before.stats) * 100).toFixed(1) + '%' : 'N/A'}`
    ].join('\n');

    downloadFile(csvContent, `BA_Study_${baState.locationName.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
}

// Copy BA Report to clipboard
function copyBAReport() {
    if (!baState.results) {
        alert('No results to copy. Please run the analysis first.');
        return;
    }

    const r = baState.results;
    const treatmentSelect = document.getElementById('baTreatmentType');
    const treatmentName = treatmentSelect.options[treatmentSelect.selectedIndex].text;

    const text = `
BEFORE & AFTER SAFETY STUDY REPORT
===================================
Location: ${baState.locationName}
Treatment: ${treatmentName}
Method: ${baState.analysisMethod === 'eb' ? 'Empirical Bayes' : 'Naive'}

SUMMARY RESULTS
---------------
CMF: ${r.cmf.toFixed(3)}
CRF: ${r.crf.toFixed(1)}%
p-value: ${r.pValue.toFixed(4)}
Statistically Significant: ${r.isSignificant ? 'Yes' : 'No'}

CRASH COMPARISON
----------------
                    BEFORE      AFTER       CHANGE
Total Crashes:      ${r.before.stats.total.toString().padStart(6)}      ${r.after.stats.total.toString().padStart(6)}      ${(r.after.stats.total - r.before.stats.total).toString().padStart(6)}
Fatal (K):          ${r.before.stats.K.toString().padStart(6)}      ${r.after.stats.K.toString().padStart(6)}      ${(r.after.stats.K - r.before.stats.K).toString().padStart(6)}
Serious (A):        ${r.before.stats.A.toString().padStart(6)}      ${r.after.stats.A.toString().padStart(6)}      ${(r.after.stats.A - r.before.stats.A).toString().padStart(6)}
EPDO Score:         ${calcEPDO(r.before.stats).toString().padStart(6)}      ${calcEPDO(r.after.stats).toString().padStart(6)}      ${(calcEPDO(r.after.stats) - calcEPDO(r.before.stats)).toString().padStart(6)}

Generated: ${new Date().toLocaleDateString()}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
        alert('Report copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy. Please try again.');
    });
}

  // ─── EXTRACTED CODE END ───

  window.printBAReport = printBAReport;    CL.reports.printBAReport = printBAReport;
  window.downloadBAPDF = downloadBAPDF;    CL.reports.downloadBAPDF = downloadBAPDF;
  window.exportBAData = exportBAData;      CL.reports.exportBAData = exportBAData;
  window.copyBAReport = copyBAReport;      CL.reports.copyBAReport = copyBAReport;

  CL._registerModule('reports/report-ba-export');
})();
