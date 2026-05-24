/**
 * CrashLens Batch Before/After Evaluation — PDF Report Details Pages
 * Location Summary Table (with colored rows, maturity), Individual Location Cards,
 * How to Read This Report guide, Methodology Appendix, TOC page fill, footers, and save.
 * Called from batch-ba-export-pdf.js via shared context CL.batchBA._pdfCtx.
 */
'use strict';

window.CL = window.CL || {};
CL.batchBA = CL.batchBA || {};

/**
 * Render location table, individual cards, how-to-read, methodology, TOC fill, footers, and save.
 */
CL.batchBA._exportPDFDetails = function() {
    var ctx = CL.batchBA._pdfCtx;
    if (!ctx) return;

    var doc = ctx.doc;
    var m = ctx.m;
    var pw = ctx.pw;
    var ph = ctx.ph;
    var cw = ctx.cw;
    var C = ctx.C;
    var successful = ctx.successful;
    var epdoInfo = ctx.epdoInfo;
    var s = ctx.s;
    var hexToRgb = ctx.hexToRgb;
    var setColor = ctx.setColor;
    var setFill = ctx.setFill;
    var cleanText = ctx.cleanText;
    var ratingColor = ctx.ratingColor;
    var ratingRowBg = ctx.ratingRowBg;

    // ================================================================
    // LOCATION SUMMARY TABLE — sorted by CMF, colored rows, maturity column
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['Location Summary Table'] = ctx.pageNum;
    ctx.addSectionTitle('Location Summary Table');

    // Sort by CMF ascending (best first), null CMFs at end
    var sorted = successful.slice().sort(function(a, b) { return (a.cmf === null ? 999 : a.cmf) - (b.cmf === null ? 999 : b.cmf); });

    var tableBody = sorted.map(function(r) {
        var rating = CL.batchBA.getEffectivenessRating(r.cmf);
        var bMo = Math.round(r.beforeYears * 12);
        var aMo = Math.round(r.afterYears * 12);
        return [
            cleanText(r.locationName).substring(0, 60),
            r.countermeasureType ? r.countermeasureType.substring(0, 15) : '-',
            r.beforeTotal,
            r.afterTotal,
            r.changePct.toFixed(1) + '%',
            Math.round(r.beforeEPDO),
            Math.round(r.afterEPDO),
            bMo,
            aMo,
            rating.label
        ];
    });

    // Build rating lookup for row coloring
    var ratingByRow = sorted.map(function(r) { return CL.batchBA.getEffectivenessRating(r.cmf).label; });

    // Helper: convert hex to [r,g,b] array for jsPDF-AutoTable
    function hexArr(hex) { var c = hexToRgb(hex); return [c.r, c.g, c.b]; }

    doc.autoTable({
        startY: ctx.y,
        head: [['Location', 'Type', 'Before', 'After', 'Change', 'EPDO B', 'EPDO A', 'Before (mo)', 'After (mo)', 'Rating']],
        body: tableBody,
        margin: { left: m, right: m },
        styles: { fontSize: 6.5, cellPadding: 1.5, overflow: 'linebreak', textColor: [55, 65, 81] },
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 6.5, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: {
            0: { cellWidth: 40 }, 1: { cellWidth: 18 },
            2: { halign: 'center', cellWidth: 11 }, 3: { halign: 'center', cellWidth: 11 },
            4: { halign: 'center', cellWidth: 14 },
            5: { halign: 'center', cellWidth: 13 }, 6: { halign: 'center', cellWidth: 13 },
            7: { halign: 'center', cellWidth: 14 }, 8: { halign: 'center', cellWidth: 14 },
            9: { cellWidth: 24 }
        },
        didParseCell: function(data) {
            if (data.section !== 'body') return;
            // Change% coloring — green for reduction, red for increase
            if (data.column.index === 4) {
                var val = parseFloat(data.cell.raw);
                if (val < 0) { data.cell.styles.textColor = hexArr('#047857'); data.cell.styles.fontStyle = 'bold'; }
                else if (val > 0) { data.cell.styles.textColor = hexArr('#b91c1c'); data.cell.styles.fontStyle = 'bold'; }
            }
            // Rating text coloring
            if (data.column.index === 9) {
                data.cell.styles.textColor = hexArr(ratingColor(data.cell.raw));
                data.cell.styles.fontStyle = 'bold';
            }
            // After months warning for short studies
            if (data.column.index === 8 && data.cell.raw < 12) {
                data.cell.styles.textColor = hexArr('#c2410c');
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

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

        ctx.checkPageBreak(70);
        // Location header bar
        setFill(C.lightBg);
        var borderRgb = hexToRgb(C.primary);
        doc.setDrawColor(borderRgb.r, borderRgb.g, borderRgb.b);
        doc.setLineWidth(0.5);
        doc.roundedRect(m, ctx.y, cw, 8, 1, 1, 'FD');
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text((i + 1) + '. ' + cleanText(r.locationName).substring(0, 65), m + 3, ctx.y + 5.5);
        doc.setFont('helvetica', 'normal'); setColor(C.textLight);
        doc.text(r.countermeasureType || '-', pw - m - 3, ctx.y + 5.5, { align: 'right' });
        ctx.y += 11;

        // Study duration (prominent)
        var beforeMo = Math.round(r.beforeYears * 12);
        var afterMo = Math.round(r.afterYears * 12);
        doc.setFontSize(8); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text('Study Period: ' + beforeMo + ' months before + ' + afterMo + ' months after  |  Install: ' + r.installDate.toLocaleDateString(), m + 3, ctx.y);
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

        // Severity breakdown table
        doc.autoTable({
            startY: ctx.y,
            head: [['Period', 'K', 'A', 'B', 'C', 'O', 'Unk', 'Total', 'EPDO', 'Rate/Yr']],
            body: [
                ['Before', r.beforeStats.K, r.beforeStats.A, r.beforeStats.B, r.beforeStats.C, r.beforeStats.O, r.beforeStats.U || 0, r.beforeTotal, Math.round(r.beforeEPDO), (r.beforeTotal / r.beforeYears).toFixed(1)],
                ['After', r.afterStats.K, r.afterStats.A, r.afterStats.B, r.afterStats.C, r.afterStats.O, r.afterStats.U || 0, r.afterTotal, Math.round(r.afterEPDO), (r.afterTotal / r.afterYears).toFixed(1)]
            ],
            margin: { left: m + 3, right: m + 3 },
            styles: { fontSize: 7, cellPadding: 1.5, textColor: [55, 65, 81] },
            headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 7 },
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
            doc.text('Note: After-period is less than 12 months (' + afterMo + 'mo). Results should be interpreted with caution per FHWA guidelines.', m + 3, ctx.y);
            ctx.y += 6;
        }
        ctx.y += 3;
    }

    // ================================================================
    // HOW TO READ THIS REPORT
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['How to Read This Report'] = ctx.pageNum;
    ctx.addSectionTitle('How to Read This Report');

    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); setColor(C.text);
    var guideIntro = 'This guide explains the key metrics used in this report so that readers without a technical background can understand the results.';
    doc.text(doc.splitTextToSize(guideIntro, cw), m, ctx.y);
    ctx.y += 10;

    var guideItems = [
        { title: 'CMF (Crash Modification Factor)', body: 'A score showing whether crashes went up or down after treatment. A CMF below 1.0 means fewer crashes (good). A CMF above 1.0 means more crashes (concerning). Example: A CMF of 0.75 means crashes decreased by about 25%.' },
        { title: 'CRF (Crash Reduction Factor)', body: 'The percentage of crashes prevented by the treatment. A CRF of 25% means about 1 in 4 crashes was prevented. A negative CRF means crashes increased.' },
        { title: 'Safety Score', body: 'Another name for CMF. Lower is better. A safety score of 0.80 means the location had 80% of the crashes it would have had without treatment.' },
        { title: 'EPDO (Equivalent Property Damage Only)', body: 'A way to weight crashes by severity. A fatal crash counts much more than a minor fender-bender. This helps compare the true safety impact, not just the number of crashes.' },
        { title: 'Statistical Significance', body: 'When a result is "significant," it means the change is very unlikely to be due to random chance alone. Non-significant results may still be meaningful but need more data to confirm.' },
        { title: 'Study Maturity', body: '"Full" means at least 12 months of after-period data (FHWA recommended minimum). Shorter studies are flagged because they may not yet show the full effect of the treatment.' }
    ];

    guideItems.forEach(function(item) {
        ctx.checkPageBreak(18);
        doc.setFontSize(9); doc.setFont('helvetica', 'bold'); setColor(C.primary);
        doc.text(item.title, m, ctx.y);
        ctx.y += 5;
        doc.setFont('helvetica', 'normal'); setColor(C.text);
        var lines = doc.splitTextToSize(item.body, cw - 5);
        doc.text(lines, m + 3, ctx.y);
        ctx.y += lines.length * 4.2 + 4;
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
        headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [241, 245, 249] },
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
    ctx.y = doc.lastAutoTable.finalY + 10;

    // ================================================================
    // METHODOLOGY APPENDIX
    // ================================================================
    ctx.newPage();
    ctx.sectionPages['Methodology Notes'] = ctx.pageNum;
    ctx.addSectionTitle('Methodology Notes');

    doc.setFontSize(9); doc.setFont('helvetica', 'normal'); setColor(C.text);

    var methodHeaders = ['Analysis Method', 'Statistical Significance', 'Crash Modification Factor (CMF)',
        'Crash Reduction Factor (CRF)', 'EPDO (Equivalent Property Damage Only)',
        'Effectiveness Ratings', 'Limitations'];

    var methodLines = [
        'Analysis Method',
        'Empirical Bayes (simplified) with Poisson variance approximation. The expected after-period crash count',
        'is estimated by adjusting the before-period count for the ratio of study period lengths.',
        '',
        'Statistical Significance',
        'Two-tailed z-test based on Poisson distribution. Confidence level: ' + (s.confidenceLevel * 100) + '%.',
        'A location is flagged as significant when p-value < ' + (1 - s.confidenceLevel).toFixed(2) + '.',
        '',
        'Crash Modification Factor (CMF)',
        'CMF = Observed After-Period Crashes / Expected After-Period Crashes.',
        'Values less than 1.0 indicate crash reduction. Values greater than 1.0 indicate crash increase.',
        '',
        'Crash Reduction Factor (CRF)',
        'CRF = (1 - CMF) x 100. Positive values = crash reduction percentage.',
        '',
        'EPDO (Equivalent Property Damage Only)',
        'Weights: ' + epdoInfo.name,
        'K = ' + epdoInfo.weights.K + ', A = ' + epdoInfo.weights.A + ', B = ' + epdoInfo.weights.B + ', C = ' + epdoInfo.weights.C + ', O = ' + epdoInfo.weights.O,
        'Source: ' + epdoInfo.source,
        '',
        'Effectiveness Ratings',
        '  Highly Effective:   CMF < 0.70 (greater than 30% crash reduction)',
        '  Effective:          CMF 0.70 - 0.90 (10-30% reduction)',
        '  Marginal:           CMF 0.90 - 1.00 (0-10% reduction)',
        '  Ineffective:        CMF 1.00 - 1.10 (0-10% increase)',
        '  Negative Impact:    CMF > 1.10 (greater than 10% increase)',
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
            doc.text(line, m, ctx.y);
            ctx.y += 5;
            doc.setFont('helvetica', 'normal'); setColor(C.text);
        } else {
            ctx.checkPageBreak(6);
            doc.text(line, m, ctx.y);
            ctx.y += 4.5;
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
            if (pg) {
                doc.text(String(pg), pw - m, entry.yPos, { align: 'right' });
            }
        });
    }

    // ================================================================
    // PDF BOOKMARKS (if jsPDF outline API is available)
    // ================================================================
    try {
        if (doc.outline && typeof doc.outline.add === 'function') {
            var bookmarkSections = ['Executive Summary', 'Visual Analysis', 'Location Summary Table',
                'Individual Location Results', 'How to Read This Report', 'Methodology Notes'];
            bookmarkSections.forEach(function(sec) {
                var pg = ctx.sectionPages[sec];
                if (pg) {
                    doc.outline.add(null, sec, { pageNumber: pg });
                }
            });
        }
    } catch (e) { /* Bookmarks not supported in this jsPDF version — skip silently */ }

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
