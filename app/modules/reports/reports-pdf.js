/**
 * CL reports.pdf — extracted from app/index.html (name-anchored,
 * live L64022-L65091) on 2026-05-17. navigateTo-split round, prompt 42b2.
 *
 * INTENTIONAL OVERSIZED SIZE-EXCEPTION (~1,070 lines): the block is
 * dominated by one indivisible ~982-line function (generateStandardReportPDF)
 * that cannot be sub-split without a behavior change. Precedent:
 * assets/transit-tab, reports/reports-standard-core/types. Approved Session M.
 *
 * Moved fns: printReport, downloadReportPDF, generateStandardReportPDF,
 *            copyReportText.
 * Depends (must load earlier): reports/reports-standard-core, core/constants;
 *   jsPDF / html2canvas globals; shared inline globals resolved via the
 *   shared classic-script global lexical environment.
 * Public API (back-compat dual exposure): window.<fn> + CL.reports.pdf.<fn>
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L64022-L65091) ───
function printReport() { window.print(); }

// Store current report data for PDF export
let currentStandardReportData = null;

/**
 * Store report data when generated for professional PDF export
 */
function storeReportData(type, crashes, stats, title, author, route, categoryData) {
    currentStandardReportData = {
        type,
        crashes,
        stats,
        title,
        author,
        route,
        categoryData,
        yearRange: getDateRange(crashes),
        reportId: generateReportId(),
        generatedAt: new Date()
    };
}

/**
 * Professional text-based PDF export for standard reports
 * Similar to Fatal & Speed PDF export with clean formatting
 */
function downloadReportPDF() {
    showLoading('Generating professional PDF report...');

    try {
        // Get current report settings
        let type = document.getElementById('reportType').value;
        // Backward compatibility: map systemwide to dashboard
        if (type === 'systemwide') type = 'dashboard';
        const title = document.getElementById('reportTitle').value || 'Crash Analysis Report';
        const author = document.getElementById('reportAuthor').value || 'Traffic Engineering Division';
        const route = document.getElementById('reportRoute')?.value || '';
        const startDate = document.getElementById('reportStartDate')?.value;
        const endDate = document.getElementById('reportEndDate')?.value;

        // Filter crashes based on current settings
        let crashes = crashState.sampleRows || [];
        if (route) crashes = crashes.filter(r => r[COL.ROUTE] === route);
        if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
        if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));

        // For countermeasures report, use CMF tab data
        if (type === 'countermeasures' && cmfState.locationCrashes.length > 0) {
            crashes = cmfState.locationCrashes;
            if (startDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) >= new Date(startDate));
            if (endDate) crashes = crashes.filter(r => r[COL.DATE] && new Date(Number(r[COL.DATE])) <= new Date(endDate));
        }

        // For before/after report, use BA tab data
        if (type === 'beforeafter' && baState.locationCrashes.length > 0) {
            crashes = baState.locationCrashes;
        }

        // For grant support report, use grant state ranked locations data
        if (type === 'grantsupport') {
            crashes = crashState.sampleRows || [];
        }

        if (crashes.length === 0) {
            hideLoading();
            alert('No crash data available for the current report. Please generate the report first.');
            return;
        }

        // Generate professional PDF
        generateStandardReportPDF(type, crashes, title, author, route, startDate, endDate);
        hideLoading();
    } catch (e) {
        hideLoading();
        console.error('[PDF Export Error]', e);
        alert('Error generating PDF: ' + e.message);
    }
}

/**
 * Generate professional text-based PDF for standard reports
 */
function generateStandardReportPDF(type, crashes, title, author, route, startDate, endDate, options = {}) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageWidth = 215.9;
    const pageHeight = 279.4;
    const margin = 18;
    const footerHeight = 20;
    const headerHeight = 12;
    const contentWidth = pageWidth - (margin * 2);
    const safeContentBottom = pageHeight - footerHeight - 5;

    // Professional color palette (matching Fatal & Speed PDF)
    const COLORS = {
        primary: '#1E3A5F',
        primaryLight: '#2563eb',
        text: '#374151',
        textLight: '#6b7280',
        fatal: '#991B1B',
        fatalLight: '#dc2626',
        serious: '#C2410C',
        moderate: '#f97316',
        minor: '#facc15',
        pdo: '#9CA3AF',
        success: '#065f46',
        white: '#ffffff',
        gray: '#9CA3AF',
        border: '#e5e7eb',
        pedestrian: '#0891b2',
        bicycle: '#059669',
        speed: '#92400e',
        intersection: '#7c3aed',
        nighttime: '#4338ca',
        impaired: '#be185d'
    };

    // Convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    // Clean text - remove emojis and non-ASCII characters
    const cleanText = (text) => {
        if (!text) return '';
        return String(text)
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, '-')
            .replace(/[\u2026]/g, '...')
            .replace(/[\u00A0]/g, ' ')
            // CC 345 - translate common glyph characters BEFORE the non-ASCII
            // strip so they render as readable ASCII instead of vanishing.
            .replace(/\u2713/g, '*')    // checkmark        -> *
            .replace(/\u2714/g, '*')    // heavy checkmark
            .replace(/\u2717/g, 'x')    // ballot x
            .replace(/\u2718/g, 'x')    // heavy ballot x
            .replace(/\u2022/g, '*')    // bullet           -> *
            .replace(/\u25CF/g, '*')    // black circle
            .replace(/\u25E6/g, 'o')    // white bullet
            .replace(/\u26A0/g, '!')    // warning sign     -> !
            .replace(/\u2192/g, '->')   // rightwards arrow -> ->
            .replace(/\u2190/g, '<-')   // leftwards arrow
            .replace(/\u2191/g, '^')    // upwards arrow
            .replace(/\u2193/g, 'v')    // downwards arrow
            .replace(/\u00B7/g, '*')    // middle dot
            .replace(/\u00B0/g, ' deg') // degree
            .replace(/\u00B1/g, '+/-')  // plus-minus
            .replace(/\u00D7/g, 'x')    // multiplication
            .replace(/\u00F7/g, '/')    // division
            .replace(/[^\x00-\x7F]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    // Compute statistics
    const stats = computeStats(crashes);
    // Period must reflect the Report tab's user-selected range
    // (reportStartDate / reportEndDate / the startDate/endDate args passed in
    // from downloadReportPDF), not the min/max of the crashes that happen to
    // fall in the filter. Falls back to crash min/max if nothing is set.
    const fmtRptDate = (d) => {
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${mm}/${dd}/${d.getFullYear()}`;
    };
    const parseRptLocal = (str) => {
        if (!str) return null;
        const parts = String(str).split('-').map(Number);
        if (parts.length !== 3 || !parts[0] || !parts[1] || !parts[2]) return null;
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };
    const rptStart = parseRptLocal(startDate);
    const rptEnd = parseRptLocal(endDate);
    let yearRange;
    if (rptStart && rptEnd) {
        yearRange = `${fmtRptDate(rptStart)} - ${fmtRptDate(rptEnd)}`;
    } else if (rptStart) {
        yearRange = `${fmtRptDate(rptStart)} - Present`;
    } else if (rptEnd) {
        yearRange = `Up to ${fmtRptDate(rptEnd)}`;
    } else {
        yearRange = getDateRange(crashes);
    }
    const reportId = generateReportId();
    const epdo = calcEPDO(stats);
    const kaRate = stats.total > 0 ? ((stats.K + stats.A) / stats.total * 100).toFixed(1) : '0';

    // Calculate total pages based on report type
    let totalPages = 4;
    if (type === 'systemwide' || type === 'dashboard') totalPages = 6;
    else if (type === 'pedbike') totalPages = 5;
    else if (type === 'countermeasures') totalPages = 5;
    else if (type === 'crashtree') totalPages = 6;
    else if (type === 'fatalspeed') totalPages = 7;
    else if (type === 'hotspot') totalPages = 8;
    else if (type === 'beforeafter') totalPages = 5;
    else if (type === 'grantsupport') totalPages = 5;

    let pageNum = 0;
    let yPos = margin + headerHeight;

    // Draw page header
    const drawHeader = (reportType) => {
        const rgb = hexToRgb(COLORS.primary);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(0, 0, pageWidth, headerHeight, 'F');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('CRASH LENS', margin, 8);

        doc.setFont('helvetica', 'normal');
        const reportTypeName = {
            'systemwide': 'System-Wide Analysis Report',
            'dashboard': 'Executive Dashboard Summary',
            'corridor': 'Corridor Analysis Report',
            'safety': 'Safety Performance Report',
            'pedbike': 'Vulnerable Road User Report',
            'trend': 'Trend Analysis Report',
            'countermeasures': 'Countermeasures Report',
            'intersection': 'Intersection Analysis Report',
            'crashtree': 'Systemic Safety Analysis',
            'fatalspeed': 'Fatal & Speed-Related Analysis',
            'hotspot': 'High-Crash Location Report',
            'beforeafter': 'Before/After Study Report',
            'grantsupport': 'Grant Application Support',
            'safetyfocus': 'Safety Focus Category Report'
        }[reportType] || 'Crash Analysis Report';
        doc.text(reportTypeName, pageWidth - margin, 8, { align: 'right' });
    };

    // Draw page footer
    const drawFooter = () => {
        const footerY = pageHeight - footerHeight + 5;

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);

        doc.text('Crash Lens - Crash Analysis Tool', margin, footerY + 8);

        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        doc.text(dateStr, pageWidth / 2, footerY + 8, { align: 'center' });

        doc.text('Page ' + pageNum + ' of ' + totalPages, pageWidth - margin, footerY + 8, { align: 'right' });
    };

    // Add new page
    const newPage = () => {
        if (pageNum > 0) {
            drawFooter();
            doc.addPage();
        }
        pageNum++;
        drawHeader(type);
        yPos = margin + headerHeight + 8;
    };

    // Check if page break needed
    const checkPageBreak = (neededSpace = 20) => {
        if (yPos + neededSpace > safeContentBottom) {
            newPage();
            return true;
        }
        return false;
    };

    // Add text with wrapping
    const addText = (text, size, style = 'normal', color = COLORS.text, indent = 0) => {
        const cleanedText = cleanText(text);
        if (!cleanedText) return;

        doc.setFontSize(size);
        doc.setFont('helvetica', style);
        if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);  // CC 345 - defeat inherited spacing
        // CC 345 - one-shot dev-mode glyph assertion (logs once if a non-ASCII glyph leaked).
        if (!window._cc345WarnedGlyph && /[^\x00-\x7F]/.test(cleanedText)) {
            console.warn('[reports-pdf:CC345] non-ASCII glyph survived cleanText:', JSON.stringify(cleanedText.slice(0,80)));
            window._cc345WarnedGlyph = true;
        }
        const rgb = hexToRgb(color);
        doc.setTextColor(rgb.r, rgb.g, rgb.b);

        const effectiveWidth = contentWidth - indent;
        const lines = doc.splitTextToSize(cleanedText, effectiveWidth);

        lines.forEach(line => {
            checkPageBreak(size * 0.5);
            doc.text(line, margin + indent, yPos);
            yPos += size * 0.45;
        });
        yPos += 1;
    };

    // Add section title
    const addSectionTitle = (sectionTitle, color = COLORS.primary) => {
        checkPageBreak(15);
        const rgb = hexToRgb(color);

        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.rect(margin, yPos - 4, 3, 10, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);  // CC 345
        doc.setTextColor(rgb.r, rgb.g, rgb.b);
        doc.text(cleanText(sectionTitle), margin + 6, yPos + 3);
        yPos += 12;
    };

    // Add subsection title
    const addSubsectionTitle = (subTitle, color = COLORS.text) => {
        checkPageBreak(12);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        if (typeof doc.setCharSpace === 'function') doc.setCharSpace(0);  // CC 345
        const rgb = hexToRgb(color);
        doc.setTextColor(rgb.r, rgb.g, rgb.b);
        doc.text(cleanText(subTitle), margin, yPos);
        yPos += 7;
    };

    // Draw severity bar
    const drawSeverityBar = (severity, maxWidth = 120) => {
        checkPageBreak(18);
        const total = (severity.K || 0) + (severity.A || 0) + (severity.B || 0) + (severity.C || 0) + (severity.O || 0);
        if (total === 0) return;

        const barHeight = 8;
        const startX = margin;
        let currentX = startX;

        const segments = [
            { key: 'K', color: COLORS.fatal, label: 'Fatal' },
            { key: 'A', color: COLORS.fatalLight, label: 'Serious' },
            { key: 'B', color: COLORS.moderate, label: 'Moderate' },
            { key: 'C', color: COLORS.minor, label: 'Minor' },
            { key: 'O', color: COLORS.pdo, label: 'PDO' }
        ];

        segments.forEach(seg => {
            const count = severity[seg.key] || 0;
            if (count > 0) {
                const width = (count / total) * maxWidth;
                const rgb = hexToRgb(seg.color);
                doc.setFillColor(rgb.r, rgb.g, rgb.b);
                doc.rect(currentX, yPos, width, barHeight, 'F');
                currentX += width;
            }
        });

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.rect(startX, yPos, maxWidth, barHeight, 'S');

        yPos += barHeight + 3;

        doc.setFontSize(7);
        let legendX = startX;
        segments.forEach(seg => {
            const count = severity[seg.key] || 0;
            if (count > 0) {
                const rgb = hexToRgb(seg.color);
                doc.setFillColor(rgb.r, rgb.g, rgb.b);
                doc.rect(legendX, yPos, 6, 4, 'F');
                doc.setTextColor(55, 65, 81);
                doc.text(seg.label + ': ' + count, legendX + 8, yPos + 3);
                legendX += 35;
            }
        });
        yPos += 10;
    };

    // Draw KPI card
    const drawKPICard = (x, y, width, height, value, label, color) => {
        const rgb = hexToRgb(color);
        doc.setFillColor(rgb.r, rgb.g, rgb.b);
        doc.roundedRect(x, y, width, height, 2, 2, 'F');

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(String(value), x + width / 2, y + height / 2 - 2, { align: 'center' });

        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        const labelLines = doc.splitTextToSize(cleanText(label), width - 4);
        doc.text(labelLines, x + width / 2, y + height / 2 + 8, { align: 'center' });
    };

    // Add spacer
    const addSpacer = (h) => { yPos += h; };

    // ================================================================
    // PAGE 1: COVER PAGE
    // ================================================================
    newPage();

    yPos = 55;
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    let rgb = hexToRgb(COLORS.primary);
    doc.setTextColor(rgb.r, rgb.g, rgb.b);
    doc.text(cleanText(title.toUpperCase()), pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const subtitleMap = {
        'systemwide': 'System-Wide Safety Analysis',
        'dashboard': 'Executive Dashboard Summary',
        'corridor': 'Corridor Crash Analysis - ' + (route || 'All Routes'),
        'safety': 'Traffic Safety Performance Report',
        'pedbike': 'Vulnerable Road User Safety Analysis',
        'trend': 'Multi-Year Trend Analysis',
        'countermeasures': 'Countermeasures Recommendation Report',
        'intersection': 'Intersection Safety Analysis',
        'crashtree': 'FHWA Systemic Safety Analysis',
        'fatalspeed': 'Fatal & Speed-Related Crash Analysis',
        'hotspot': 'High-Crash Location (Hotspot) Analysis',
        'beforeafter': 'Before/After Safety Study',
        'grantsupport': 'Safety Improvement Grant Support Data',
        'safetyfocus': 'Safety Focus Category Analysis'
    };
    doc.text(subtitleMap[type] || 'Crash Analysis Report', pageWidth / 2, yPos, { align: 'center' });

    // KPI Cards Row
    yPos += 25;
    const cardWidth = 35;
    const cardHeight = 26;
    const cardSpacing = 5;
    const totalCardsWidth = (cardWidth * 5) + (cardSpacing * 4);
    let cardX = (pageWidth - totalCardsWidth) / 2;

    drawKPICard(cardX, yPos, cardWidth, cardHeight, stats.total.toLocaleString(), 'Total Crashes', COLORS.primary);
    cardX += cardWidth + cardSpacing;
    drawKPICard(cardX, yPos, cardWidth, cardHeight, stats.K, 'Fatal (K)', COLORS.fatal);
    cardX += cardWidth + cardSpacing;
    drawKPICard(cardX, yPos, cardWidth, cardHeight, stats.A, 'Serious (A)', COLORS.serious);
    cardX += cardWidth + cardSpacing;
    drawKPICard(cardX, yPos, cardWidth, cardHeight, kaRate + '%', 'K+A Rate', COLORS.primaryLight);
    cardX += cardWidth + cardSpacing;
    drawKPICard(cardX, yPos, cardWidth, cardHeight, epdo.toLocaleString(), 'EPDO Score', COLORS.success);

    yPos += cardHeight + 25;

    // Report details box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin + 20, yPos, contentWidth - 40, 50, 3, 3, 'FD');

    yPos += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text('Report Details', pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Analysis Period: ' + yearRange, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Prepared by: ' + cleanText(author), pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Report ID: ' + reportId, pageWidth / 2, yPos, { align: 'center' });
    yPos += 6;
    doc.text('Generated: ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth / 2, yPos, { align: 'center' });

    // ================================================================
    // PAGE 2: EXECUTIVE SUMMARY
    // ================================================================
    newPage();

    addSectionTitle('EXECUTIVE SUMMARY', COLORS.primary);
    addSpacer(3);

    // Overview
    const crashPct = ((stats.K + stats.A) / stats.total * 100).toFixed(1);
    addText('This analysis examines ' + stats.total.toLocaleString() + ' crashes recorded during the analysis period. ' +
        'Of these, ' + stats.K + ' were fatal crashes and ' + stats.A + ' resulted in serious injuries, representing a ' +
        crashPct + '% severe crash rate.', 10, 'normal', COLORS.text);
    addSpacer(3);

    // Severity Distribution
    addSubsectionTitle('Severity Distribution', COLORS.primary);
    drawSeverityBar(stats);
    addSpacer(5);

    // Key Metrics Table
    addSubsectionTitle('Key Safety Metrics', COLORS.primary);

    const metricsData = [
        ['Total Crashes', stats.total.toLocaleString()],
        ['Fatal Crashes (K)', stats.K.toString()],
        ['Serious Injury (A)', stats.A.toString()],
        ['Moderate Injury (B)', stats.B.toString()],
        ['Minor Injury (C)', stats.C.toString()],
        ['Property Damage Only (O)', stats.O.toString()],
        ['K+A Rate', kaRate + '%'],
        ['EPDO Score', epdo.toLocaleString()],
        ['Pedestrian Crashes', stats.ped.toString()],
        ['Bicycle Crashes', stats.bike.toString()],
        ['Intersection Crashes', stats.intersection.toString()]
    ];

    doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: metricsData,
        headStyles: {
            fillColor: [30, 58, 95],
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold'
        },
        bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        margin: { left: margin, right: margin, bottom: footerHeight + 5 },
        columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 40, halign: 'center', fontStyle: 'bold' }
        }
    });
    yPos = doc.lastAutoTable.finalY + 10;

    // ================================================================
    // PAGE 3: COLLISION TYPE ANALYSIS
    // ================================================================
    newPage();

    addSectionTitle('COLLISION TYPE ANALYSIS', COLORS.primary);
    addSpacer(3);

    // Compute collision types
    const collisionTypes = {};
    crashes.forEach(c => {
        const colType = c[COL.COLLISION] || 'Unknown';
        if (!collisionTypes[colType]) {
            collisionTypes[colType] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        }
        collisionTypes[colType].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (['K', 'A', 'B', 'C', 'O'].includes(sev)) {
            collisionTypes[colType][sev]++;
        }
    });

    const collisionRows = Object.entries(collisionTypes)
        .sort((a, b) => b[1].count - a[1].count)
        .slice(0, 12)
        .map(([typeName, data]) => {
            const pct = stats.total > 0 ? ((data.count / stats.total) * 100).toFixed(1) : '0';
            const typeEpdo = calcEPDO(data);
            // Clean collision type name - remove leading numbers like "2. "
            const cleanName = cleanText(typeName.replace(/^\d+[\.\-\s]+\s*/, ''));
            return [cleanName.substring(0, 30), data.count, pct + '%', data.K, data.A, typeEpdo.toLocaleString()];
        });

    if (collisionRows.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Collision Type', 'Count', '%', 'K', 'A', 'EPDO']],
            body: collisionRows,
            headStyles: {
                fillColor: [30, 58, 95],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 },
            columnStyles: {
                0: { cellWidth: 60 },
                1: { cellWidth: 20, halign: 'center' },
                2: { cellWidth: 20, halign: 'center' },
                3: { cellWidth: 15, halign: 'center' },
                4: { cellWidth: 15, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' }
            }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }

    // ================================================================
    // PAGE 4: TOP LOCATIONS
    // ================================================================
    newPage();

    addSectionTitle('HIGH-PRIORITY LOCATIONS', COLORS.fatal);
    addText('Top locations ranked by EPDO (Equivalent Property Damage Only) score', 9, 'italic', COLORS.textLight);
    addSpacer(5);

    // Compute top locations
    const locationData = {};
    crashes.forEach(c => {
        const loc = c[COL.ROUTE] || 'Unknown';
        if (!locationData[loc]) {
            locationData[loc] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
        }
        locationData[loc].count++;
        const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
        if (['K', 'A', 'B', 'C', 'O'].includes(sev)) {
            locationData[loc][sev]++;
        }
    });

    const locationRows = Object.entries(locationData)
        .map(([locName, data]) => {
            const locEpdo = calcEPDO(data);
            // Clean route name
            const cleanLoc = cleanText(locName.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || locName);
            return { name: cleanLoc, ...data, epdo: locEpdo };
        })
        .filter(loc => loc.name && loc.name !== 'Unknown' && loc.count > 0)
        .sort((a, b) => b.epdo - a.epdo)
        .slice(0, 15);

    if (locationRows.length > 0) {
        doc.autoTable({
            startY: yPos,
            head: [['Location', 'Crashes', 'K', 'A', 'B+C', 'EPDO']],
            body: locationRows.map(loc => [
                loc.name.substring(0, 35) + (loc.name.length > 35 ? '...' : ''),
                loc.count,
                loc.K,
                loc.A,
                loc.B + loc.C,
                loc.epdo.toLocaleString()
            ]),
            headStyles: {
                fillColor: [153, 27, 27],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: { fontSize: 8, textColor: [55, 65, 81] },
            alternateRowStyles: { fillColor: [254, 242, 242] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 },
            columnStyles: {
                0: { cellWidth: 70 },
                1: { cellWidth: 22, halign: 'center' },
                2: { cellWidth: 18, halign: 'center' },
                3: { cellWidth: 18, halign: 'center' },
                4: { cellWidth: 20, halign: 'center' },
                5: { cellWidth: 25, halign: 'center' }
            }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }

    // ================================================================
    // ADDITIONAL PAGES BASED ON REPORT TYPE
    // ================================================================

    // For Dashboard/System-Wide Report: Add category breakdown
    if (type === 'systemwide' || type === 'dashboard') {
        newPage();
        addSectionTitle('SAFETY CATEGORY ANALYSIS', COLORS.primary);
        addSpacer(3);

        // Compute category data
        const categories = {
            pedestrian: { total: 0, K: 0, A: 0 },
            bicycle: { total: 0, K: 0, A: 0 },
            nighttime: { total: 0, K: 0, A: 0 },
            intersection: { total: 0, K: 0, A: 0 }
        };

        crashes.forEach(row => {
            const sev = (row[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if ((row[COL.PED] || '').toLowerCase() === 'yes') {
                categories.pedestrian.total++;
                if (sev === 'K') categories.pedestrian.K++;
                if (sev === 'A') categories.pedestrian.A++;
            }
            if ((row[COL.BIKE] || '').toLowerCase() === 'yes') {
                categories.bicycle.total++;
                if (sev === 'K') categories.bicycle.K++;
                if (sev === 'A') categories.bicycle.A++;
            }
            if ((row[COL.NIGHT] || row['Night?'] || '').toLowerCase() === 'yes') {
                categories.nighttime.total++;
                if (sev === 'K') categories.nighttime.K++;
                if (sev === 'A') categories.nighttime.A++;
            }
            if (isIntersection(row)) {
                categories.intersection.total++;
                if (sev === 'K') categories.intersection.K++;
                if (sev === 'A') categories.intersection.A++;
            }
        });

        const categoryRows = [
            ['Pedestrian Crashes', categories.pedestrian.total, categories.pedestrian.K, categories.pedestrian.A, ((categories.pedestrian.total / stats.total) * 100).toFixed(1) + '%'],
            ['Bicycle Crashes', categories.bicycle.total, categories.bicycle.K, categories.bicycle.A, ((categories.bicycle.total / stats.total) * 100).toFixed(1) + '%'],
            ['Nighttime Crashes', categories.nighttime.total, categories.nighttime.K, categories.nighttime.A, ((categories.nighttime.total / stats.total) * 100).toFixed(1) + '%'],
            ['Intersection Crashes', categories.intersection.total, categories.intersection.K, categories.intersection.A, ((categories.intersection.total / stats.total) * 100).toFixed(1) + '%']
        ];

        doc.autoTable({
            startY: yPos,
            head: [['Category', 'Total', 'K', 'A', '% of Total']],
            body: categoryRows,
            headStyles: {
                fillColor: [30, 58, 95],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Add recommendations page
        newPage();
        addSectionTitle('RECOMMENDATIONS', COLORS.success);
        addSpacer(3);

        const recommendations = [];
        if (stats.K > 0) recommendations.push('Conduct detailed fatal crash reviews at high-fatality locations to identify systemic issues');
        if (categories.pedestrian.total > 5) recommendations.push('Evaluate pedestrian facilities at high-crash corridors - consider RRFB, PHB, or enhanced crossings');
        if (categories.bicycle.total > 3) recommendations.push('Review bicycle infrastructure and consider protected bike lanes or separated facilities');
        if (categories.intersection.total > stats.total * 0.4) recommendations.push('Focus intersection safety improvements including signal timing optimization and geometric modifications');
        if (categories.nighttime.K + categories.nighttime.A > 5) recommendations.push('Consider lighting improvements and enhanced delineation at locations with high nighttime crash severity');

        if (recommendations.length === 0) {
            recommendations.push('Continue monitoring crash patterns and trends');
            recommendations.push('Consider proactive safety improvements at emerging hot spots');
        }

        recommendations.forEach((rec, i) => {
            addText((i + 1) + '. ' + rec, 10, 'normal', COLORS.text, 3);
            addSpacer(2);
        });
    }

    // For Ped/Bike Report: Add detailed VRU analysis
    if (type === 'pedbike') {
        newPage();
        addSectionTitle('VULNERABLE ROAD USER ANALYSIS', COLORS.pedestrian);
        addSpacer(3);

        const pedCrashes = crashes.filter(c => (c[COL.PED] || '').toLowerCase() === 'yes');
        const bikeCrashes = crashes.filter(c => (c[COL.BIKE] || '').toLowerCase() === 'yes');
        const pedStats = computeStats(pedCrashes);
        const bikeStats = computeStats(bikeCrashes);

        const vruRows = [
            ['Metric', 'Pedestrian', 'Bicycle', 'Total VRU'],
            ['Total Crashes', pedStats.total, bikeStats.total, pedStats.total + bikeStats.total],
            ['Fatal (K)', pedStats.K, bikeStats.K, pedStats.K + bikeStats.K],
            ['Serious (A)', pedStats.A, bikeStats.A, pedStats.A + bikeStats.A],
            ['K+A Rate', pedStats.total > 0 ? ((pedStats.K + pedStats.A) / pedStats.total * 100).toFixed(1) + '%' : '0%',
                bikeStats.total > 0 ? ((bikeStats.K + bikeStats.A) / bikeStats.total * 100).toFixed(1) + '%' : '0%',
                (pedStats.total + bikeStats.total) > 0 ? (((pedStats.K + pedStats.A + bikeStats.K + bikeStats.A) / (pedStats.total + bikeStats.total)) * 100).toFixed(1) + '%' : '0%'],
            ['EPDO Score', calcEPDO(pedStats).toLocaleString(), calcEPDO(bikeStats).toLocaleString(), (calcEPDO(pedStats) + calcEPDO(bikeStats)).toLocaleString()]
        ];

        doc.autoTable({
            startY: yPos,
            body: vruRows,
            headStyles: {
                fillColor: [8, 145, 178],
                textColor: 255,
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: { fontSize: 9, textColor: [55, 65, 81] },
            alternateRowStyles: { fillColor: [240, 253, 250] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 },
            didParseCell: function(data) {
                if (data.row.index === 0) {
                    data.cell.styles.fillColor = [8, 145, 178];
                    data.cell.styles.textColor = 255;
                    data.cell.styles.fontStyle = 'bold';
                }
            }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }

    // For Crash Tree Report: Add facility type and cross-analysis
    if (type === 'crashtree') {
        newPage();
        addSectionTitle('FACILITY TYPE ANALYSIS', COLORS.primary);
        addSpacer(3);

        const byFacility = {};
        crashes.forEach(r => {
            const ft = r[COL.FACILITY_TYPE] || r[COL.ROAD_DESC] || 'Unknown';
            if (!byFacility[ft]) byFacility[ft] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            byFacility[ft].count++;
            const sev = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (['K','A','B','C','O'].includes(sev)) byFacility[ft][sev]++;
        });
        const facilityRows = Object.entries(byFacility).sort((a,b) => calcEPDO(b[1]) - calcEPDO(a[1])).slice(0, 12).map(([ft, d]) => [cleanText(ft).substring(0,30), d.count, d.K, d.A, d.B + d.C, calcEPDO(d).toLocaleString()]);

        doc.autoTable({
            startY: yPos, head: [['Facility Type', 'Total', 'K', 'A', 'B+C', 'EPDO']], body: facilityRows,
            headStyles: { fillColor: [30,58,95], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [248,250,252] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // High-risk combinations
        newPage();
        addSectionTitle('HIGH-RISK CRASH COMBINATIONS', COLORS.fatal);
        addSpacer(3);
        addText('Top combinations of crash type and facility type ranked by EPDO score.', 9, 'italic', COLORS.textLight);
        addSpacer(3);

        const combos = {};
        crashes.forEach(r => {
            const ft = r[COL.FACILITY_TYPE] || r[COL.ROAD_DESC] || 'Unknown';
            const ct = r[COL.COLLISION] || 'Unknown';
            const key = cleanText(ct) + ' on ' + cleanText(ft);
            if (!combos[key]) combos[key] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            combos[key].count++;
            const sev = (r[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (['K','A','B','C','O'].includes(sev)) combos[key][sev]++;
        });
        const comboRows = Object.entries(combos).sort((a,b) => calcEPDO(b[1]) - calcEPDO(a[1])).slice(0, 10).map(([name, d], i) => [(i+1).toString(), name.substring(0,45), d.count, d.K, d.A, calcEPDO(d).toLocaleString()]);

        doc.autoTable({
            startY: yPos, head: [['#', 'Combination', 'Total', 'K', 'A', 'EPDO']], body: comboRows,
            headStyles: { fillColor: [153,27,27], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [254,242,242] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 },
            columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 75 } }
        });
        yPos = doc.lastAutoTable.finalY + 10;
    }

    // For Fatal & Speed Report: Add detailed analysis
    if (type === 'fatalspeed') {
        newPage();
        addSectionTitle('FATAL CRASH ANALYSIS', COLORS.fatal);
        addSpacer(3);

        const fatalCrashes = crashes.filter(r => (r[COL.SEVERITY] || '').charAt(0).toUpperCase() === 'K');
        const fatalByCollision = {};
        fatalCrashes.forEach(r => { const c = r[COL.COLLISION] || 'Unknown'; fatalByCollision[c] = (fatalByCollision[c] || 0) + 1; });
        const fatalCollRows = Object.entries(fatalByCollision).sort((a,b) => b[1]-a[1]).slice(0,10).map(([t,c]) => [cleanText(t), c, (fatalCrashes.length > 0 ? (c/fatalCrashes.length*100).toFixed(1) : '0') + '%']);

        addText('Total fatal crashes: ' + fatalCrashes.length, 10, 'bold', COLORS.fatal);
        addSpacer(3);
        if (fatalCollRows.length > 0) {
            doc.autoTable({
                startY: yPos, head: [['Collision Type', 'Fatal Count', '% of Fatal']], body: fatalCollRows,
                headStyles: { fillColor: [153,27,27], textColor: 255, fontSize: 9, fontStyle: 'bold' },
                bodyStyles: { fontSize: 9, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [254,242,242] },
                margin: { left: margin, right: margin, bottom: footerHeight + 5 }
            });
            yPos = doc.lastAutoTable.finalY + 10;
        }

        newPage();
        addSectionTitle('SPEED-RELATED CRASH ANALYSIS', COLORS.speed);
        addSpacer(3);

        const speedCrashes = crashes.filter(r => isYes(r[COL.SPEED]));
        const speedStats = computeStats(speedCrashes);
        addText('Total speed-related crashes: ' + speedCrashes.length + ' (' + (stats.total > 0 ? (speedCrashes.length/stats.total*100).toFixed(1) : '0') + '% of all crashes)', 10, 'bold', COLORS.speed);
        addSpacer(3);

        const speedSevRows = ['K','A','B','C','O'].map(s => [s, speedStats[s].toString(), (speedStats.total > 0 ? (speedStats[s]/speedStats.total*100).toFixed(1) : '0') + '%']);
        doc.autoTable({
            startY: yPos, head: [['Severity', 'Count', '% of Speed']], body: speedSevRows,
            headStyles: { fillColor: [146,64,14], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [255,251,235] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        // Combined overlap
        const fatalSpeed = crashes.filter(r => (r[COL.SEVERITY] || '').charAt(0).toUpperCase() === 'K' && isYes(r[COL.SPEED]));
        addSpacer(5);
        addSubsectionTitle('Fatal + Speed Overlap', COLORS.intersection);
        addText('Fatal crashes that were also speed-related: ' + fatalSpeed.length + (fatalCrashes.length > 0 ? ' (' + (fatalSpeed.length/fatalCrashes.length*100).toFixed(1) + '% of fatal crashes)' : ''), 10, 'normal', COLORS.text);

        // Recommendations page
        newPage();
        addSectionTitle('COUNTERMEASURES & RECOMMENDATIONS', COLORS.success);
        addSpacer(3);
        const speedRecs = [
            'Deploy speed feedback signs at high-speed crash corridors',
            'Consider road diets and lane reconfiguration to reduce speeds',
            'Install roundabouts at intersections with fatal angle crashes',
            'Enhance roadway lighting at nighttime fatal crash locations',
            'Implement automated speed enforcement where legally permissible',
            'Conduct speed safety audits on corridors with highest fatal + speed crash overlap'
        ];
        speedRecs.forEach((rec, i) => { addText((i+1) + '. ' + rec, 10, 'normal', COLORS.text, 3); addSpacer(2); });
    }

    // For Hotspot Report: Add detailed location profiles
    if (type === 'hotspot') {
        newPage();
        addSectionTitle('DETAILED LOCATION PROFILES', COLORS.fatal);
        addSpacer(3);
        addText('Top 5 locations by EPDO with detailed severity breakdown.', 9, 'italic', COLORS.textLight);
        addSpacer(3);

        // Reuse location data from page 4
        const locDataHotspot = {};
        crashes.forEach(c => {
            const loc = c[COL.ROUTE] || 'Unknown';
            if (!locDataHotspot[loc]) locDataHotspot[loc] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0, collisions: {} };
            locDataHotspot[loc].count++;
            const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (['K','A','B','C','O'].includes(sev)) locDataHotspot[loc][sev]++;
            const ct = c[COL.COLLISION] || 'Unknown';
            locDataHotspot[loc].collisions[ct] = (locDataHotspot[loc].collisions[ct] || 0) + 1;
        });
        // CC 329 — filter blank / 'Unknown' / '0' route names before slicing
        // top-N so PDF hotspot ranking doesn't display "Unknown (200)" rows.
        // Mirrors the same filter already at reports-pdf.js:620 and the
        // _isKnownLocationName helper in reports-standard-core2.js:88.
        const topLocs = Object.entries(locDataHotspot)
            .filter(([n]) => { const s = String(n || '').trim(); return s !== '' && s !== '0' && s.toLowerCase() !== 'unknown'; })
            .map(([n, d]) => ({ name: n, ...d, epdo: calcEPDO(d) }))
            .sort((a,b) => b.epdo - a.epdo)
            .slice(0, 5);

        topLocs.forEach((loc, i) => {
            if (i > 0) checkPageBreak(40);
            addSubsectionTitle((i+1) + '. ' + cleanText(loc.name), COLORS.primary);
            const topCol = Object.entries(loc.collisions).sort((a,b) => b[1]-a[1]).slice(0,3).map(([t,c]) => cleanText(t) + ': ' + c).join(', ');
            addText('Crashes: ' + loc.count + ' | K: ' + loc.K + ' | A: ' + loc.A + ' | EPDO: ' + loc.epdo.toLocaleString(), 9, 'normal', COLORS.text);
            addText('Top collision types: ' + topCol, 9, 'normal', COLORS.textLight);
            addSpacer(5);
        });

        // Node-level analysis
        newPage();
        addSectionTitle('INTERSECTION HOTSPOT RANKING', COLORS.intersection);
        addSpacer(3);

        const nodeData = {};
        crashes.forEach(c => {
            const node = c[COL.NODE] || '';
            if (!node) return;
            if (!nodeData[node]) nodeData[node] = { count: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            nodeData[node].count++;
            const sev = (c[COL.SEVERITY] || 'O').charAt(0).toUpperCase();
            if (['K','A','B','C','O'].includes(sev)) nodeData[node][sev]++;
        });
        // CC 329 — filter blank / 'Unknown' / '0' node IDs before slicing
        // top-N intersection ranking. Same justification as topLocs above.
        const nodeRows = Object.entries(nodeData)
            .filter(([n]) => { const s = String(n || '').trim(); return s !== '' && s !== '0' && s.toLowerCase() !== 'unknown'; })
            .map(([n, d]) => ({ name: n, ...d, epdo: calcEPDO(d) }))
            .sort((a,b) => b.epdo - a.epdo)
            .slice(0, 15)
            .map((n, i) => [(i+1).toString(), cleanText(n.name).substring(0,35), n.count, n.K, n.A, n.epdo.toLocaleString()]);

        if (nodeRows.length > 0) {
            doc.autoTable({
                startY: yPos, head: [['#', 'Intersection', 'Total', 'K', 'A', 'EPDO']], body: nodeRows,
                headStyles: { fillColor: [124,58,237], textColor: 255, fontSize: 9, fontStyle: 'bold' },
                bodyStyles: { fontSize: 8, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [245,243,255] },
                margin: { left: margin, right: margin, bottom: footerHeight + 5 },
                columnStyles: { 0: { cellWidth: 10, halign: 'center' }, 1: { cellWidth: 70 } }
            });
            yPos = doc.lastAutoTable.finalY + 10;
        } else {
            addText('No intersection-level data available.', 10, 'normal', COLORS.textLight);
        }
    }

    // For Before/After Report: Add comparison tables
    if (type === 'beforeafter') {
        newPage();
        addSectionTitle('BEFORE/AFTER COMPARISON', COLORS.primary);
        addSpacer(3);

        const treatmentDate = baState.treatmentDate ? new Date(baState.treatmentDate) : null;
        let beforeCrashes = crashes;
        let afterCrashes = [];
        if (treatmentDate) {
            beforeCrashes = crashes.filter(r => { const d = r[COL.DATE] ? new Date(Number(r[COL.DATE])) : null; return d && d < treatmentDate; });
            afterCrashes = crashes.filter(r => { const d = r[COL.DATE] ? new Date(Number(r[COL.DATE])) : null; return d && d >= treatmentDate; });
        }
        const bStats = computeStats(beforeCrashes);
        const aStats = computeStats(afterCrashes);

        const compRows = ['Total','K','A','B','C','O'].map(s => {
            const bVal = s === 'Total' ? bStats.total : bStats[s];
            const aVal = s === 'Total' ? aStats.total : aStats[s];
            const change = bVal > 0 ? ((aVal - bVal) / bVal * 100).toFixed(1) + '%' : (aVal > 0 ? '+100%' : '0%');
            return [s, bVal, aVal, change];
        });
        compRows.push(['EPDO', calcEPDO(bStats).toLocaleString(), calcEPDO(aStats).toLocaleString(),
            calcEPDO(bStats) > 0 ? ((calcEPDO(aStats) - calcEPDO(bStats)) / calcEPDO(bStats) * 100).toFixed(1) + '%' : 'N/A']);

        addText('Location: ' + (baState.locationName || 'Selected Location'), 10, 'bold', COLORS.primary);
        addText('Treatment: ' + (baState.treatmentType || 'Not specified') + (treatmentDate ? ' (Date: ' + treatmentDate.toLocaleDateString() + ')' : ''), 9, 'normal', COLORS.text);
        addSpacer(5);

        doc.autoTable({
            startY: yPos, head: [['Metric', 'Before', 'After', '% Change']], body: compRows,
            headStyles: { fillColor: [30,58,95], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [248,250,252] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        const observedCMF = bStats.total > 0 && aStats.total > 0 ? (aStats.total / bStats.total).toFixed(3) : 'N/A';
        addSpacer(5);
        addSubsectionTitle('Observed Crash Modification Factor: ' + observedCMF, observedCMF !== 'N/A' && parseFloat(observedCMF) < 1 ? COLORS.success : COLORS.fatal);
        addText(observedCMF !== 'N/A' && parseFloat(observedCMF) < 1 ? 'The treatment reduced crashes by ' + ((1 - parseFloat(observedCMF)) * 100).toFixed(1) + '%.' : observedCMF !== 'N/A' ? 'Crashes increased after treatment. Further investigation recommended.' : 'Insufficient data for CMF calculation.', 10, 'normal', COLORS.text);
    }

    // For Grant Support Report: Add benefit-cost analysis
    if (type === 'grantsupport') {
        newPage();
        addSectionTitle('BENEFIT-COST ANALYSIS DATA', COLORS.primary);
        addSpacer(3);

        const costs = grantState.crashCosts || { K: 12800000, A: 655000, B: 198000, C: 125000, O: 12400 };
        const costRows = ['K','A','B','C','O'].map(s => [s, stats[s], '$' + costs[s].toLocaleString(), '$' + (stats[s] * costs[s]).toLocaleString()]);
        const totalCost = stats.K * costs.K + stats.A * costs.A + stats.B * costs.B + stats.C * costs.C + stats.O * costs.O;
        costRows.push(['Total', stats.total, '-', '$' + totalCost.toLocaleString()]);

        doc.autoTable({
            startY: yPos, head: [['Severity', 'Count', 'Unit Cost', 'Total Cost']], body: costRows,
            headStyles: { fillColor: [30,58,95], textColor: 255, fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 9, textColor: [55,65,81] }, alternateRowStyles: { fillColor: [248,250,252] },
            margin: { left: margin, right: margin, bottom: footerHeight + 5 }
        });
        yPos = doc.lastAutoTable.finalY + 10;

        addSpacer(5);
        addSubsectionTitle('Data Source Citations', COLORS.primary);
        addText('Crash data: State crash records database', 9, 'normal', COLORS.text);
        addText('EPDO weights: ' + (EPDO_WEIGHTS.K === 462 ? 'AASHTO Highway Safety Manual (HSM 2010)' : 'Custom jurisdiction weights'), 9, 'normal', COLORS.text);
        addText('Crash costs: FHWA comprehensive crash cost estimates', 9, 'normal', COLORS.text);
    }

    // For Countermeasures Report: Add CMF details
    if (type === 'countermeasures') {
        newPage();
        addSectionTitle('COUNTERMEASURE RECOMMENDATIONS', COLORS.success);
        addSpacer(3);
        addText('Countermeasure recommendations based on crash pattern analysis at the selected location.', 9, 'normal', COLORS.textLight);
        addSpacer(3);

        const recs = [
            'Review intersection geometry and sight distance',
            'Evaluate signal timing and phasing',
            'Consider proven safety countermeasures (PSC) from FHWA',
            'Conduct Road Safety Audit at high-crash locations',
            'Evaluate lighting improvements for nighttime crashes'
        ];
        recs.forEach((rec, i) => { addText((i+1) + '. ' + rec, 10, 'normal', COLORS.text, 3); addSpacer(2); });
    }

    // ================================================================
    // FINAL PAGE: CITATION
    // ================================================================
    checkPageBreak(30);
    addSpacer(10);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(229, 231, 235);
    doc.roundedRect(margin, yPos, contentWidth, 22, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text('This report was generated using the Crash Lens Analysis Tool.', margin + 5, yPos + 7);
    doc.text('Data Source: ' + getDataSourceLabel() + '. For detailed analysis and interactive maps,', margin + 5, yPos + 12);
    doc.text('please visit the Crash Lens web application.', margin + 5, yPos + 17);

    // Final footer
    drawFooter();

    // Update total pages now that we know the actual count
    totalPages = pageNum;

    // Return doc object if requested (for email attachment)
    if (options.returnDoc) {
        return doc;
    }

    // Save PDF
    const filename = 'crash_analysis_' + type + '_' + new Date().toISOString().split('T')[0] + '.pdf';
    doc.save(filename);
    showToast('Professional PDF report downloaded: ' + filename, 'success');
}

function copyReportText() {
    const text = document.getElementById('reportContainer').innerText;
    navigator.clipboard.writeText(text).then(() => alert('Report text copied to clipboard'));
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.reports = CL.reports || {};
  CL.reports.pdf = CL.reports.pdf || {};
  window.printReport = printReport; CL.reports.pdf.printReport = printReport;
  window.downloadReportPDF = downloadReportPDF; CL.reports.pdf.downloadReportPDF = downloadReportPDF;
  window.generateStandardReportPDF = generateStandardReportPDF; CL.reports.pdf.generateStandardReportPDF = generateStandardReportPDF;
  window.copyReportText = copyReportText; CL.reports.pdf.copyReportText = copyReportText;
  CL._registerModule('reports/reports-pdf');
})();
