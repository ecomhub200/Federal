/**
 * CrashLens Batch Before/After Evaluation — PDF Report Details Pages
 * How to Read guide, Location Summary Table (colored rows, maturity badges, trend indicators),
 * Excluded Locations, Individual Location Cards, Methodology Appendix, TOC fill, footers, save.
 * Called from batch-ba-export-pdf.js via shared context CL.batchBA._pdfCtx.
 */
window.CL = window.CL || {};
CL.batchBA = CL.batchBA || {};

CL.batchBA._exportPDFDetails = function() {
    var ctx = CL.batchBA._pdfCtx;
    if (!ctx) return;
    var doc = ctx.doc, m = ctx.m, pw = ctx.pw, ph = ctx.ph, cw = ctx.cw, C = ctx.C;
    var successful = ctx.successful, epdoInfo = ctx.epdoInfo, s = ctx.s, sum = ctx.sum;
    var hexToRgb = ctx.hexToRgb, setColor = ctx.setColor, setFill = ctx.setFill;
    var cleanText = ctx.cleanText, ratingColor = ctx.ratingColor;

    // ================================================================
    // HOW TO READ THIS REPORT (moved before data sections)
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['How to Read This Report'] = ctx.pageNum;
    ctx.addSectionTitle('How to Read This Report');

    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); setColor(C.text);
    var guideIntro = 'This guide explains the key metrics used in this report so that readers without a technical background can understand the results.';
    doc.text(doc.splitTextToSize(guideIntro, cw), m, ctx.y); ctx.y += 10;

    var guideItems = [
        { title: 'CMF (Crash Modification Factor)', body: 'A score showing whether crashes went up or down after treatment. Below 1.0 = fewer crashes (good). Above 1.0 = more crashes (concerning). Example: CMF of 0.75 means crashes decreased by about 25%.' },
        { title: 'CRF (Crash Reduction Factor)', body: 'The percentage of crashes prevented. CRF of 25% means about 1 in 4 crashes was prevented. A negative CRF means crashes increased.' },
        { title: 'Net Change', body: 'The raw difference in crash count (After minus Before). A negative number means fewer crashes occurred. Shown with trend arrows in the summary table.' },
        { title: 'EPDO (Equivalent Property Damage Only)', body: 'A way to weight crashes by severity. A fatal crash counts much more than a fender-bender. This helps compare true safety impact, not just crash counts.' },
        { title: 'Statistical Significance', body: 'When a result is "significant," the change is very unlikely due to random chance alone. Non-significant results may still be meaningful but need more data.' },
        { title: 'Study Maturity', body: '"Full" = at least 12 months of after-period data (FHWA recommended minimum). "Limited" = 6-11 months. "Early" = 3-5 months. Shorter studies may not yet show the full treatment effect.' }
    ];
    guideItems.forEach(function(item) {
        ctx.checkPageBreak(18);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text(item.title, m, ctx.y); ctx.y += 5;
        doc.setFont('helvetica', 'normal'); setColor(C.text);
        var lines = doc.splitTextToSize(item.body, cw - 5);
        doc.text(lines, m + 3, ctx.y); ctx.y += lines.length * 4.2 + 4;
    });

    // Rating categories mini-table
    ctx.checkPageBreak(45);
    ctx.addSubsectionTitle('Rating Categories');
    doc.autoTable({
        startY: ctx.y,
        head: [['Rating', 'CMF Range', 'What It Means']],
        body: [
            ['Highly Effective', '< 0.70', 'More than 30% crash reduction - strong evidence of improvement'],
            ['Effective', '0.70 - 0.90', '10-30% crash reduction - clear positive impact'],
            ['Marginal', '0.90 - 1.00', '0-10% reduction - modest improvement, may need more time'],
            ['Ineffective', '1.00 - 1.10', '0-10% increase - no clear benefit observed'],
            ['Negative Impact', '> 1.10', 'More than 10% increase - further review recommended']
        ],
        margin: { left: m, right: m },
        styles: { fontSize: 8, cellPadding: 2.5 },
        headStyles: { fillColor: hexToRgb(C.primary), textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: hexToRgb(C.lightBg) },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 35 }, 1: { halign: 'center', cellWidth: 25 } },
        didDrawCell: function(data) {
            if (data.column.index === 0 && data.section === 'body') {
                var rColors = [C.successLight, '#65a30d', '#ca8a04', C.warning, C.danger];
                if (data.row.index < rColors.length) {
                    var rgb = hexToRgb(rColors[data.row.index]);
                    doc.setFillColor(rgb.r, rgb.g, rgb.b);
                    doc.rect(data.cell.x, data.cell.y, 2, data.cell.height, 'F');
                }
            }
        }
    });
    ctx.y = doc.lastAutoTable.finalY + 6;

    // ================================================================
    // LOCATION SUMMARY TABLE
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['Location Summary Table'] = ctx.pageNum;
    ctx.addSectionTitle('Location Summary Table');

    // Sort: rated by CMF ascending (best first), N/A at end
    var rated = successful.filter(function(r) { return r.cmf !== null; }).sort(function(a, b) { return a.cmf - b.cmf; });
    var unrated = successful.filter(function(r) { return r.cmf === null; });
    var sorted = rated.concat(unrated);
    var separatorIdx = rated.length;

    function maturityBadge(r) {
        var aMo = Math.round(r.afterYears * 12);
        if (aMo >= 12) return 'Full';
        if (aMo >= 6) return 'Limited';
        return 'Early';
    }
    function trendChar(r) {
        var net = r.afterTotal - r.beforeTotal;
        if (net < 0) return String.fromCharCode(0x25BC);
        if (net > 0) return String.fromCharCode(0x25B2);
        return String.fromCharCode(0x2014);
    }

    var tableBody = [];
    for (var ti = 0; ti < sorted.length; ti++) {
        if (ti === separatorIdx && unrated.length > 0) {
            tableBody.push([{content: 'Locations Without Sufficient Before-Period Data (N/A)', colSpan: 13,
                styles: {fillColor: hexToRgb('#e2e8f0'), fontStyle: 'bolditalic', fontSize: 6, halign: 'center', textColor: hexToRgb('#475569')}}]);
        }
        var r = sorted[ti];
        var netChange = r.afterTotal - r.beforeTotal;
        var netStr = (netChange > 0 ? '+' : '') + netChange;
        tableBody.push([
            cleanText(r.locationName),
            r.countermeasureType ? r.countermeasureType.substring(0, 14) : '-',
            r.beforeTotal, r.afterTotal, netStr, trendChar(r),
            r.changePct.toFixed(1) + '%',
            r.cmf !== null ? r.cmf.toFixed(3) : 'N/A',
            Math.round(r.beforeEPDO), Math.round(r.afterEPDO),
            Math.round(r.beforeYears * 12), Math.round(r.afterYears * 12),
            maturityBadge(r)
        ]);
    }

    // Rating lookup for row coloring (with separator offset)
    var ratingByRow = [], rowToData = [];
    for (var ri = 0; ri < sorted.length; ri++) {
        if (ri === separatorIdx && unrated.length > 0) { ratingByRow.push('__sep__'); rowToData.push(null); }
        ratingByRow.push(CL.batchBA.getEffectivenessRating(sorted[ri].cmf).label);
        rowToData.push(sorted[ri]);
    }
    var rowBgColors = {
        'Highly Effective': '#E8F5E9', 'Effective': '#F1F8E9', 'Marginal': '#FFF8E1',
        'Ineffective': '#FFEBEE', 'Negative Impact': '#FFEBEE', 'N/A': '#F5F5F5'
    };

    doc.autoTable({
        startY: ctx.y,
        head: [['Location', 'Type', 'Before', 'After', 'Net', '', 'Change%', 'CMF', 'EPDO B', 'EPDO A', 'B(mo)', 'A(mo)', 'Maturity']],
        body: tableBody,
        margin: { left: m, right: m },
        styles: { fontSize: 6, cellPadding: 1.2, overflow: 'linebreak', minCellHeight: 5 },
        headStyles: { fillColor: hexToRgb(C.primary), textColor: [255, 255, 255], fontSize: 6 },
        columnStyles: {
            0: { cellWidth: 36 }, 1: { cellWidth: 14 },
            2: { halign: 'center', cellWidth: 9 }, 3: { halign: 'center', cellWidth: 9 },
            4: { halign: 'center', cellWidth: 9 }, 5: { halign: 'center', cellWidth: 6 },
            6: { halign: 'center', cellWidth: 13 }, 7: { halign: 'center', cellWidth: 12 },
            8: { halign: 'center', cellWidth: 12 }, 9: { halign: 'center', cellWidth: 12 },
            10: { halign: 'center', cellWidth: 9 }, 11: { halign: 'center', cellWidth: 9 },
            12: { halign: 'center', cellWidth: 14 }
        },
        didParseCell: function(data) {
            if (data.section !== 'body') return;
            var rowRating = ratingByRow[data.row.index];
            if (rowRating === '__sep__') return;
            data.cell.styles.fillColor = hexToRgb(rowBgColors[rowRating] || '#F5F5F5');
            // Trend indicator coloring (col 5)
            if (data.column.index === 5) {
                var rd = rowToData[data.row.index];
                if (rd) {
                    var n = rd.afterTotal - rd.beforeTotal;
                    if (n < 0) { data.cell.styles.textColor = hexToRgb(C.successLight); data.cell.styles.fontStyle = 'bold'; }
                    else if (n > 0) { data.cell.styles.textColor = hexToRgb(C.danger); data.cell.styles.fontStyle = 'bold'; }
                }
            }
            // Change% coloring (col 6)
            if (data.column.index === 6) {
                var val = parseFloat(data.cell.raw);
                if (val < 0) { data.cell.styles.textColor = hexToRgb(C.successLight); data.cell.styles.fontStyle = 'bold'; }
                else if (val > 0) { data.cell.styles.textColor = hexToRgb(C.danger); data.cell.styles.fontStyle = 'bold'; }
            }
            // CMF coloring (col 7)
            if (data.column.index === 7 && data.cell.raw !== 'N/A') {
                var cmfVal = parseFloat(data.cell.raw);
                if (cmfVal < 1.0) data.cell.styles.textColor = hexToRgb(C.successLight);
                else if (cmfVal > 1.0) data.cell.styles.textColor = hexToRgb(C.danger);
            }
            // Maturity badge coloring (col 12)
            if (data.column.index === 12) {
                var badge = data.cell.raw;
                if (badge === 'Full') data.cell.styles.textColor = hexToRgb(C.successLight);
                else if (badge === 'Limited') data.cell.styles.textColor = hexToRgb('#ca8a04');
                else data.cell.styles.textColor = hexToRgb(C.danger);
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });
    ctx.y = doc.lastAutoTable.finalY + 4;

    // ================================================================
    // EXCLUDED LOCATIONS (auto-excluded due to invalid dates or <3mo data)
    // ================================================================
    var excluded = (sum && sum.excluded) ? sum.excluded : [];
    if (excluded.length > 0) {
        ctx.checkPageBreak(20 + excluded.length * 6);
        ctx.addSubsectionTitle('Excluded Locations - Insufficient Data');
        doc.setFontSize(7); doc.setFont('helvetica', 'italic'); setColor(C.textLight);
        doc.text('The following locations were auto-excluded because they did not meet the 3-month minimum data requirement on each side.', m, ctx.y);
        ctx.y += 5;
        var exclBody = excluded.map(function(ex) {
            return [cleanText(ex.locationName), ex.countermeasureType || '-',
                ex.installDate ? ex.installDate.toLocaleDateString() : '-', ex.excludeReason || 'Insufficient data'];
        });
        doc.autoTable({
            startY: ctx.y,
            head: [['Location', 'Type', 'Install Date', 'Reason']],
            body: exclBody,
            margin: { left: m, right: m },
            styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak' },
            headStyles: { fillColor: hexToRgb('#94a3b8'), textColor: [255, 255, 255], fontSize: 6.5 },
            alternateRowStyles: { fillColor: hexToRgb('#f8fafc') },
            columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 25 }, 2: { cellWidth: 25 } }
        });
        ctx.y = doc.lastAutoTable.finalY + 6;
    }

    // ================================================================
    // INDIVIDUAL LOCATION DETAIL PAGES
    // ================================================================
    for (var i = 0; i < sorted.length; i++) {
        var r = sorted[i];
        var rating = CL.batchBA.getEffectivenessRating(r.cmf);

        if (i === 0 || ctx.y > ctx.safeBottom - 70) {
            ctx.newPage();
            if (i === 0) ctx.sectionPages['Individual Location Results'] = ctx.pageNum;
            ctx.addSectionTitle('Individual Location Results');
        }

        // Keep entire location card together (header + severity table + metrics ~70mm)
        ctx.checkPageBreak(70);
        // Location header bar
        setFill(C.lightBg);
        var borderRgb = hexToRgb(C.primary);
        doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
        doc.setLineWidth(0.5);
        doc.roundedRect(m, ctx.y, cw, 8, 1, 1, 'FD');
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text((i + 1) + '. ' + cleanText(r.locationName), m + 3, ctx.y + 5.5);
        doc.setFont('helvetica', 'normal'); setColor(C.textLight);
        doc.text(r.countermeasureType || '-', pw - m - 3, ctx.y + 5.5, { align: 'right' });
        ctx.y += 11;

        // Study duration
        var bMo = Math.round(r.beforeYears * 12), aMo = Math.round(r.afterYears * 12);
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text('Study Period: ' + bMo + 'mo before + ' + aMo + 'mo after  |  Install: ' + r.installDate.toLocaleDateString(), m + 3, ctx.y);
        ctx.y += 4;
        doc.setFont('helvetica', 'normal'); setColor(C.text);
        doc.text('Before: ' + r.beforeStart.toLocaleDateString() + ' - ' + r.beforeEnd.toLocaleDateString() + '  |  After: ' + r.afterStart.toLocaleDateString() + ' - ' + r.afterEnd.toLocaleDateString() + '  |  Radius: ' + r.radiusFt + ' ft', m + 3, ctx.y);
        ctx.y += 5;

        // Rating badge
        var badgeColor = ratingColor(rating.label);
        setFill(badgeColor);
        doc.roundedRect(pw - m - 40, ctx.y - 7, 37, 6, 1, 1, 'F');
        doc.setFontSize(7); doc.setFont('helvetica', 'bold'); doc.setTextColor(255, 255, 255);
        doc.text(rating.label, pw - m - 21.5, ctx.y - 3, { align: 'center' });

        // Severity breakdown table — keep together with metrics
        doc.autoTable({
            startY: ctx.y,
            head: [['Period', 'K', 'A', 'B', 'C', 'O', 'Unk', 'Total', 'EPDO', 'Rate/Yr']],
            body: [
                ['Before', r.beforeStats.K, r.beforeStats.A, r.beforeStats.B, r.beforeStats.C, r.beforeStats.O, r.beforeStats.U || 0, r.beforeTotal, Math.round(r.beforeEPDO), (r.beforeTotal / r.beforeYears).toFixed(1)],
                ['After', r.afterStats.K, r.afterStats.A, r.afterStats.B, r.afterStats.C, r.afterStats.O, r.afterStats.U || 0, r.afterTotal, Math.round(r.afterEPDO), (r.afterTotal / r.afterYears).toFixed(1)]
            ],
            margin: { left: m + 3, right: m + 3 },
            styles: { fontSize: 7, cellPadding: 1.5 },
            headStyles: { fillColor: hexToRgb(C.primary), textColor: [255, 255, 255], fontSize: 7 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 16 },
                1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' },
                4: { halign: 'center' }, 5: { halign: 'center' }, 6: { halign: 'center' },
                7: { halign: 'center', fontStyle: 'bold' }, 8: { halign: 'center' }, 9: { halign: 'center' }
            }
        });
        ctx.y = doc.lastAutoTable.finalY + 2;

        // Metrics line
        doc.setFontSize(8); doc.setFont('helvetica', 'normal'); setColor(C.text);
        var cmfStr = r.cmf !== null ? r.cmf.toFixed(3) : 'N/A';
        var crfStr = r.crf !== null ? ((r.crf > 0 ? '+' : '') + r.crf.toFixed(1) + '%') : 'N/A';
        doc.text('CMF: ' + cmfStr + '  |  CRF: ' + crfStr + '  |  p-value: ' + r.pValue.toFixed(4) + '  |  ' + (r.isSignificant ? 'Statistically Significant' : 'Not Significant'), m + 3, ctx.y + 3);
        ctx.y += 7;

        // Confidence note for short after-periods
        if (r.afterYears < 1.0) {
            doc.setFontSize(7); doc.setFont('helvetica', 'italic'); setColor(C.warning);
            doc.text('Note: After-period is less than 12 months (' + aMo + 'mo). Results should be interpreted with caution per FHWA guidelines.', m + 3, ctx.y);
            ctx.y += 6;
        }
        ctx.y += 3;
    }

    // ================================================================
    // METHODOLOGY APPENDIX
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['Methodology Notes'] = ctx.pageNum;
    ctx.addSectionTitle('Methodology Notes');
    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); setColor(C.text);

    var bufferMo = s.constructionBuffer || 0;
    var methodHeaders = ['Analysis Method', 'Construction Buffer', 'Minimum Study Period',
        'Net Crashes Prevented', 'Statistical Significance', 'Crash Modification Factor (CMF)',
        'Crash Reduction Factor (CRF)', 'EPDO (Equivalent Property Damage Only)',
        'Effectiveness Ratings', 'Limitations'];
    var methodLines = [
        'Analysis Method',
        'Empirical Bayes (simplified) with Poisson variance approximation. The expected after-period crash',
        'count is estimated by adjusting the before-period count for the ratio of study period lengths.',
        '',
        'Construction Buffer',
        bufferMo > 0 ? (bufferMo + ' month(s) excluded on each side of the install date to account for construction activity.')
            : 'No construction buffer applied. Crashes immediately before/after install date are included.',
        '',
        'Minimum Study Period',
        'Locations with less than 3 months of data on either side are automatically excluded from analysis',
        'and listed separately as "Excluded - Insufficient Data." FHWA recommends 12+ months for reliable results.',
        '',
        'Net Crashes Prevented',
        'Calculated as the sum of (Expected - Observed) for each evaluable location, where Expected is the',
        'EB-adjusted count (before crashes scaled by period length ratio). This accounts for different study durations.',
        '',
        'Statistical Significance',
        'Two-tailed z-test based on Poisson distribution. Confidence level: ' + (s.confidenceLevel * 100) + '%.',
        'A location is flagged as significant when p-value < ' + (1 - s.confidenceLevel).toFixed(2) + '.',
        '',
        'Crash Modification Factor (CMF)',
        'CMF = Observed After-Period Crashes / Expected After-Period Crashes.',
        'Values < 1.0 indicate crash reduction. Values > 1.0 indicate crash increase.',
        '',
        'Crash Reduction Factor (CRF)',
        'CRF = (1 - CMF) x 100. Positive values = crash reduction percentage.',
        '',
        'EPDO (Equivalent Property Damage Only)',
        'Weights: ' + epdoInfo.name,
        'K=' + epdoInfo.weights.K + ', A=' + epdoInfo.weights.A + ', B=' + epdoInfo.weights.B + ', C=' + epdoInfo.weights.C + ', O=' + epdoInfo.weights.O + '  |  Source: ' + epdoInfo.source,
        '',
        'Effectiveness Ratings',
        '  Highly Effective: CMF < 0.70 (>30% reduction)  |  Effective: 0.70-0.90 (10-30%)',
        '  Marginal: 0.90-1.00 (0-10%)  |  Ineffective: 1.00-1.10 (0-10% increase)',
        '  Negative Impact: CMF > 1.10 (>10% increase)',
        '',
        'Limitations',
        'This analysis uses a simplified EB method that adjusts for period length but does not incorporate',
        'Safety Performance Functions (SPFs) or reference group data. For HSIP-grade documentation,',
        'use the full single-location Before/After Study tab with complete EB methodology.'
    ];
    methodLines.forEach(function(line) {
        if (line === '') { ctx.y += 3; return; }
        if (methodHeaders.indexOf(line) !== -1) {
            ctx.checkPageBreak(12);
            doc.setFont('helvetica', 'bold'); setColor(C.primary);
            doc.text(line, m, ctx.y); ctx.y += 5;
            doc.setFont('helvetica', 'normal'); setColor(C.text);
        } else {
            ctx.checkPageBreak(6);
            doc.text(line, m, ctx.y); ctx.y += 4.5;
        }
    });

    // ================================================================
    // FILL TABLE OF CONTENTS PAGE NUMBERS
    // ================================================================
    if (ctx.tocPageNum && ctx.tocYPositions) {
        doc.setPage(ctx.tocPageNum);
        doc.setFontSize(11); doc.setFont('helvetica', 'bold');
        var tocRgb = hexToRgb(C.primary);
        doc.setTextColor(tocRgb.r, tocRgb.g, tocRgb.b);
        ctx.tocYPositions.forEach(function(entry) {
            var pg = ctx.sectionPages[entry.section];
            if (pg) doc.text(String(pg), pw - m, entry.yPos, { align: 'right' });
        });
    }

    // ================================================================
    // PDF BOOKMARKS
    // ================================================================
    try {
        if (doc.outline && typeof doc.outline.add === 'function') {
            ['Executive Summary', 'Visual Analysis', 'How to Read This Report',
             'Location Summary Table', 'Individual Location Results', 'Methodology Notes'].forEach(function(sec) {
                var pg = ctx.sectionPages[sec];
                if (pg) doc.outline.add(null, sec, { pageNumber: pg });
            });
        }
    } catch (e) { /* skip */ }

    // ================================================================
    // ADD FOOTERS TO ALL PAGES & SAVE
    // ================================================================
    var totalPages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= totalPages; p++) {
        doc.setPage(p);
        ctx.drawPageFooter(p, totalPages);
    }
    doc.save('Batch_BA_Report_' + ctx.dateStamp + '.pdf');
};

CL._registerModule('batch-ba/export-pdf-details');
