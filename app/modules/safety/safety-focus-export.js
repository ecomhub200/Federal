/**
 * Safety Focus — Exports, CMF lookup, Map views, Reports
 * Extracted from app/index.html (CC 201 Pass B). Verbatim block.
 *
 * Fns: askMUTCDForSafetyCategory, queryCMFForSafetyCategory,
 *      exportSfDetailCSV, exportSfDetailPDF, exportSfDetailKML (×2 dup),
 *      exportSafetyData (×3 dup), exportSafetyLocationData (×3 dup),
 *      exportSafetyCategoryPDF, viewSafetyOnMap, viewSafetyLocationOnMap,
 *      getSafetyCMF, getCurrentDetailCMF, exportCurrentDetailToKML,
 *      addCurrentDetailToReport, exportSafetyToKML,
 *      generateSafetyCategoryReport
 *
 * Reads inline globals: safetyState, sfDetailState (mirrored to window.*),
 *      safetyCategories, cmfState, crashState, COL, getSafetyLocationCMF,
 *      exportCrashesToCSV, generateKML, downloadKML, showToast, showTab,
 *      generateReport, getJurisdictionStateLabel, calculateEPDO.
 *
 * Duplicate fn defs (exportSfDetailKML / exportSafetyData /
 * exportSafetyLocationData) preserved in source order so hoisting parity
 * matches the original inline behavior (last def wins). Dedupe is a
 * follow-up PR.
 */
(function () {
    'use strict';


function askMUTCDForSafetyCategory(category) {
    const catData = safetyState.data?.[category];
    const catConfig = safetyCategories?.[category];

    if (!catData || !catData.crashes) {
        alert('No crash data available for this category');
        return;
    }

    selectionState.safetyCategory = catConfig?.name || category;
    askMUTCDGuidance(catConfig?.name || category, 'safety', catData.crashes);
}

function queryCMFForSafetyCategory(category) {
    if (!cmfState.database || cmfState.database.length === 0) {
        console.log('[Safety CMF] Database not loaded');
        return [];
    }

    const query = safetyCategoryToCMFQuery[category];
    if (!query) {
        console.log('[Safety CMF] No query mapping for category:', category);
        return [];
    }

    const { crashTypes = [], keywords = '', locationType = 'both', minRating = 3 } = query;
    const keywordList = keywords.toLowerCase().split(/\s+/).filter(k => k.length > 0);

    // Filter CMF database
    let results = cmfState.database.filter(cmf => {
        // Minimum rating filter
        if (cmf.rating < minRating) return false;

        // Location type filter
        if (locationType !== 'both' && cmf.locationType !== 'both' && cmf.locationType !== locationType) return false;

        // Keywords filter - at least one keyword must match
        if (keywordList.length > 0) {
            const searchText = (cmf.name + ' ' + (cmf.desc || '') + ' ' + (cmf.category || '')).toLowerCase();
            if (!keywordList.some(kw => searchText.includes(kw))) return false;
        }

        return true;
    });

    // Score results by relevance
    results = results.map(cmf => {
        let score = cmf.rating * 10;

        // Crash type matching
        if (crashTypes.length > 0 && cmf.crashTypes) {
            const matches = cmf.crashTypes.filter(t => crashTypes.includes(t) || t === 'all');
            score += matches.length * 20;
            if (matches.some(t => t !== 'all')) score += 30;
        }

        // Bonus for FHWA Proven
        if (cmf.isProven) score += 25;

        // Bonus for HSM
        if (cmf.inHSM) score += 15;

        // Bonus for higher crash reduction
        if (cmf.crfPct > 0) score += cmf.crfPct / 3;

        // Keyword match count bonus
        const searchText = (cmf.name + ' ' + (cmf.desc || '')).toLowerCase();
        const matchCount = keywordList.filter(kw => searchText.includes(kw)).length;
        score += matchCount * 10;

        return { ...cmf, relevanceScore: score };
    });

    // Sort by relevance score descending
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Remove duplicates by name
    const seen = new Set();
    results = results.filter(cmf => {
        if (seen.has(cmf.name)) return false;
        seen.add(cmf.name);
        return true;
    });

    // Return top 4 results
    return results.slice(0, 4);
}

function exportSfDetailCSV() {
    const data = sfDetailState.aggregatedData;
    if (!data) { alert('No data to export'); return; }

    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catName = catConfig?.name || category;

    const rows = [
        ['Safety Focus Detailed Analysis Export'],
        ['Category', catName],
        ['Generated', new Date().toLocaleString()],
        ['Locations', sfDetailState.selectedLocations.join('; ')],
        [],
        ['SUMMARY METRICS'],
        ['Total Crashes', data.total],
        ['Fatal (K)', data.severity.K],
        ['Serious Injury (A)', data.severity.A],
        ['Minor Injury (B)', data.severity.B],
        ['Possible Injury (C)', data.severity.C],
        ['PDO (O)', data.severity.O],
        ['EPDO Score', data.epdo],
        ['KA Rate', ((data.severity.K + data.severity.A) / (data.total || 1) * 100).toFixed(2) + '%'],
        [],
        ['CONTRIBUTING FACTORS'],
        ['Factor', 'Count', 'Percentage'],
        ['Alcohol-Related', data.factors.alcohol, (data.factors.alcohol / (data.total || 1) * 100).toFixed(2) + '%'],
        ['Speed-Related', data.factors.speed, (data.factors.speed / (data.total || 1) * 100).toFixed(2) + '%'],
        ['Distracted', data.factors.distracted, (data.factors.distracted / (data.total || 1) * 100).toFixed(2) + '%'],
        ['Drowsy', data.factors.drowsy, (data.factors.drowsy / (data.total || 1) * 100).toFixed(2) + '%'],
        ['Drug-Related', data.factors.drug, (data.factors.drug / (data.total || 1) * 100).toFixed(2) + '%'],
        ['Hit-and-Run', data.factors.hitrun, (data.factors.hitrun / (data.total || 1) * 100).toFixed(2) + '%'],
        [],
        ['VULNERABLE ROAD USERS'],
        ['Type', 'Count', 'KA Count'],
        ['Pedestrian', data.vru.pedestrian.total, data.vru.pedestrian.K + data.vru.pedestrian.A],
        ['Bicycle', data.vru.bicycle.total, data.vru.bicycle.K + data.vru.bicycle.A],
        ['Motorcycle', data.vru.motorcycle.total, data.vru.motorcycle.K + data.vru.motorcycle.A],
        [],
        ['YEARLY BREAKDOWN'],
        ['Year', 'Total', 'K', 'A', 'B', 'C', 'O'],
        ...Object.entries(data.byYear).sort((a, b) => a[0] - b[0]).map(([year, d]) => [year, d.total, d.K, d.A, d.B, d.C, d.O]),
        [],
        ['COLLISION TYPES'],
        ['Type', 'Count'],
        ...Object.entries(data.byCollision).sort((a, b) => b[1] - a[1]).map(([type, count]) => [type, count])
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const catSlug = category.replace(/[^a-z0-9]/gi, '_');
    downloadFile(csv, `safety_focus_detail_${catSlug}_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
    showToast('Exported ' + data.total + ' crashes to CSV', 'success');
}

function exportSfDetailPDF() {
    const data = sfDetailState.aggregatedData;
    if (!data) { alert('No data to export'); return; }

    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catName = catConfig?.name || category;

    showLoading('Generating Detailed Analysis PDF Report...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        const colors = SELECTION_PDF_STYLES.colors;
        const sevColors = SELECTION_PDF_STYLES.severityColors;

        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateStamp = new Date().toISOString().split('T')[0];
        // Period must reflect the Safety Focus tab's own date filter
        // (safetyStartDate / safetyEndDate), not the full data range.
        const yearRange = resolveReportPeriod('safetyStartDate', 'safetyEndDate');
        const total = data.total || 1;
        const kaCount = data.severity.K + data.severity.A;
        const kaRate = (kaCount / total * 100);
        const epdo = data.epdo;
        const vruTotal = data.vru.pedestrian.total + data.vru.bicycle.total + data.vru.motorcycle.total;
        const vruPct = (vruTotal / total * 100);
        const locCount = sfDetailState.selectedLocations.length;

        // Year-over-year trend
        const years = Object.keys(data.byYear).sort();
        let yoyTrend = 0;
        if (years.length >= 2) {
            const lastYear = data.byYear[years[years.length - 1]]?.total || 0;
            const prevYear = data.byYear[years[years.length - 2]]?.total || 0;
            if (prevYear > 0) yoyTrend = ((lastYear - prevYear) / prevYear * 100);
        }

        let currentPage = 1;
        let totalPages = 1;
        const footerMargin = 22;

        // ---- Helper Functions ----
        function addFooter() {
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 12);
            doc.text(generatedDate, pageWidth / 2, pageHeight - 12, { align: 'center' });
            doc.text('Page ' + currentPage + ' of ' + totalPages, pageWidth - margin, pageHeight - 12, { align: 'right' });
            doc.setTextColor(0, 0, 0);
        }

        function drawMiniHeader(pageTitle) {
            doc.setFillColor(...colors.primary);
            doc.rect(0, 0, pageWidth, 12, 'F');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFont(undefined, 'bold');
            doc.text('CRASH LENS', margin, 8);
            doc.setFont(undefined, 'normal');
            doc.text(pageTitle, pageWidth - margin, 8, { align: 'right' });
            doc.setTextColor(0, 0, 0);
        }

        function drawSectionHeader(y, title) {
            doc.setFontSize(13);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, y + 5);
            doc.setFont(undefined, 'normal');
            doc.setDrawColor(...colors.secondary);
            doc.setLineWidth(0.7);
            doc.line(margin, y + 8, margin + contentWidth, y + 8);
            doc.setTextColor(0, 0, 0);
            return y + 14;
        }

        function drawKPI(x, y, width, label, value, color) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, y, width, 26, 2, 2, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(x, y, width, 26, 2, 2, 'S');
            doc.setFillColor(...color);
            doc.rect(x, y, width, 3, 'F');
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...color);
            doc.text(String(value), x + width / 2, y + 14, { align: 'center' });
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.text(label, x + width / 2, y + 22, { align: 'center' });
            doc.setTextColor(0, 0, 0);
        }

        function addNewPage(pageTitle) {
            addFooter();
            doc.addPage();
            totalPages++;
            currentPage++;
            drawMiniHeader(pageTitle);
        }

        function fitImageInBox(chart, maxW, maxH) {
            if (!chart || !chart.canvas) return { w: maxW, h: maxH, offX: 0, offY: 0 };
            const cw = chart.canvas.width || 1;
            const ch = chart.canvas.height || 1;
            const ar = cw / ch;
            let w = maxW, h = maxW / ar;
            if (h > maxH) { h = maxH; w = maxH * ar; }
            return { w, h, offX: (maxW - w) / 2, offY: (maxH - h) / 2 };
        }

        // ---- Capture Chart Images ----
        const chartImages = {};
        const charts = sfDetailState.charts;
        if (charts.year) chartImages.year = charts.year.toBase64Image();
        if (charts.yearSeverity) chartImages.yearSeverity = charts.yearSeverity.toBase64Image();
        if (charts.time) chartImages.time = charts.time.toBase64Image();
        if (charts.dow) chartImages.dow = charts.dow.toBase64Image();
        if (charts.collision) chartImages.collision = charts.collision.toBase64Image();
        if (charts.severity) chartImages.severity = charts.severity.toBase64Image();
        if (charts.weather) chartImages.weather = charts.weather.toBase64Image();
        if (charts.light) chartImages.light = charts.light.toBase64Image();
        if (charts.surface) chartImages.surface = charts.surface.toBase64Image();
        if (charts.control) chartImages.control = charts.control.toBase64Image();

        // ================================================================
        // PAGE 1: Cover + KPI Summary + Severity
        // ================================================================

        // Header gradient
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 42, 'F');
        doc.setFillColor(...colors.secondary);
        doc.rect(0, 34, pageWidth, 8, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('CRASH LENS', margin, 16);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Safety Focus: Detailed Analysis Report', margin, 26);
        doc.setFontSize(11);
        doc.text(catName + (locCount > 1 ? ' - ' + locCount + ' Combined Locations' : ''), margin, 37);

        // Info box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 51, 51);
        doc.text('Category: ' + catName.substring(0, 22), pageWidth - margin - 62, 13);
        doc.text('Period: ' + yearRange, pageWidth - margin - 62, 20);
        doc.text('Locations: ' + locCount, pageWidth - margin - 62, 27);
        doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

        let y = 52;

        // KPI Cards - Row 1 (5 KPIs)
        const kpiWidth = (contentWidth - 20) / 5;
        drawKPI(margin, y, kpiWidth, 'TOTAL CRASHES', data.total.toLocaleString(), colors.primary);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'KA RATE', kaRate.toFixed(1) + '%', colors.fatal);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'EPDO SCORE', epdo.toLocaleString(), [124, 58, 237]);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'VRU CRASHES', vruPct.toFixed(1) + '%', [16, 185, 129]);
        drawKPI(margin + (kpiWidth + 5) * 4, y, kpiWidth, 'YOY TREND', (yoyTrend > 0 ? '+' : '') + yoyTrend.toFixed(1) + '%', yoyTrend < 0 ? [22, 163, 74] : [220, 38, 38]);

        y += 34;

        // Selected Locations List
        y = drawSectionHeader(y, 'Selected Locations');
        const locTableData = [];
        sfDetailState.selectedLocations.forEach(loc => {
            const locData = data.byLocation[loc];
            if (!locData) return;
            const clean = loc.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || loc;
            const locEpdo = calcEPDO(locData.severity || {K:0,A:0,B:0,C:0,O:0});
            const locKaRate = locData.total > 0 ? ((locData.severity.K + locData.severity.A) / locData.total * 100).toFixed(1) + '%' : '0%';
            locTableData.push([clean.substring(0, 40), locData.total.toString(), locData.severity.K.toString(), locData.severity.A.toString(), (locData.severity.K + locData.severity.A).toString(), locEpdo.toLocaleString(), locKaRate]);
        });

        if (locTableData.length > 0) {
            doc.autoTable({
                startY: y,
                head: [['Location', 'Crashes', 'K', 'A', 'K+A', 'EPDO', 'KA Rate']],
                body: locTableData,
                margin: { left: margin, right: margin },
                headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
                bodyStyles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { cellPadding: 2.5 },
                columnStyles: {
                    0: { cellWidth: 55 },
                    1: { halign: 'center', cellWidth: 18 },
                    2: { halign: 'center', cellWidth: 12 },
                    3: { halign: 'center', cellWidth: 12 },
                    4: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
                    5: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
                    6: { halign: 'center', cellWidth: 18 }
                },
                didParseCell: function(cellData) {
                    if (cellData.section === 'body' && cellData.column.index === 4) {
                        const val = parseInt(cellData.cell.raw);
                        if (val > 0) cellData.cell.styles.textColor = [220, 53, 69];
                    }
                }
            });
            y = doc.lastAutoTable.finalY + 8;
        }

        // Severity Distribution Section
        y = drawSectionHeader(y, 'Severity Distribution');

        // Colored severity bar
        const barHeight = 8;
        const barY = y;
        const sevOrder = [
            { code: 'K', count: data.severity.K, color: sevColors.K, label: 'Fatal' },
            { code: 'A', count: data.severity.A, color: sevColors.A, label: 'Serious' },
            { code: 'B', count: data.severity.B, color: sevColors.B, label: 'Minor' },
            { code: 'C', count: data.severity.C, color: sevColors.C, label: 'Possible' },
            { code: 'O', count: data.severity.O, color: sevColors.O, label: 'PDO' }
        ];
        let barX = margin;
        sevOrder.forEach(s => {
            if (s.count > 0) {
                const segWidth = (s.count / total) * contentWidth;
                doc.setFillColor(...s.color);
                doc.rect(barX, barY, Math.max(segWidth, 2), barHeight, 'F');
                if (segWidth > 12) {
                    doc.setFontSize(6.5);
                    doc.setTextColor(255, 255, 255);
                    doc.setFont(undefined, 'bold');
                    doc.text(s.code + ':' + s.count, barX + segWidth / 2, barY + 5.5, { align: 'center' });
                }
                barX += segWidth;
            }
        });
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);
        y += barHeight + 4;

        // Severity table
        const sevTableData = sevOrder.map(s => {
            const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) + '%' : '0%';
            const epdoContrib = s.code === 'K' ? s.count * 462 : s.code === 'A' ? s.count * 62 : s.code === 'B' ? s.count * 12 : s.code === 'C' ? s.count * 5 : s.count;
            return [s.label + ' (' + s.code + ')', s.count.toString(), pct, epdoContrib.toLocaleString()];
        });
        sevTableData.push(['Total', data.total.toString(), '100%', epdo.toLocaleString()]);

        doc.autoTable({
            startY: y,
            head: [['Severity Level', 'Count', 'Percentage', 'EPDO Contribution']],
            body: sevTableData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' }
            }
        });

        // ================================================================
        // PAGE 2: Temporal Analysis
        // ================================================================
        addNewPage('Temporal Analysis - ' + catName);
        y = 18;

        y = drawSectionHeader(y, 'Temporal Analysis');

        const chartW = (contentWidth - 6) / 2;
        const chartH = 55;

        // Row 1: Yearly Trend + Severity by Year
        if (chartImages.year) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Yearly Crash Trend', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.year, chartW, chartH);
                doc.addImage(chartImages.year, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] year chart error:', e); }
        }

        if (chartImages.yearSeverity) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Severity Distribution by Year', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.yearSeverity, chartW, chartH);
                doc.addImage(chartImages.yearSeverity, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] yearSeverity chart error:', e); }
        }

        y += chartH + 14;

        // Row 2: Time of Day + Day of Week
        if (chartImages.time) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Time of Day Distribution', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.time, chartW, chartH);
                doc.addImage(chartImages.time, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] time chart error:', e); }
        }

        if (chartImages.dow) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Day of Week Distribution', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.dow, chartW, chartH);
                doc.addImage(chartImages.dow, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] dow chart error:', e); }
        }

        y += chartH + 14;

        // Year-over-Year Breakdown Table
        if (years.length > 0) {
            doc.setFontSize(10);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Year-over-Year Breakdown', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            y += 8;

            const yearTableData = years.map((yr, idx) => {
                const d = data.byYear[yr] || {};
                const yrEpdo = (d.K||0)*462 + (d.A||0)*62 + (d.B||0)*12 + (d.C||0)*5 + (d.O||0);
                let pctChange = '-';
                if (idx > 0) {
                    const prev = data.byYear[years[idx-1]]?.total || 0;
                    if (prev > 0) pctChange = (((d.total||0) - prev) / prev * 100).toFixed(1) + '%';
                }
                return [yr, (d.total||0).toString(), (d.K||0).toString(), (d.A||0).toString(), (d.B||0).toString(), (d.C||0).toString(), (d.O||0).toString(), yrEpdo.toLocaleString(), pctChange];
            });

            doc.autoTable({
                startY: y,
                head: [['Year', 'Total', 'K', 'A', 'B', 'C', 'O', 'EPDO', '% Change']],
                body: yearTableData,
                margin: { left: margin, right: margin },
                headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8 },
                bodyStyles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 18 },
                    1: { halign: 'center', cellWidth: 16 },
                    2: { halign: 'center', cellWidth: 12 },
                    3: { halign: 'center', cellWidth: 12 },
                    4: { halign: 'center', cellWidth: 12 },
                    5: { halign: 'center', cellWidth: 12 },
                    6: { halign: 'center', cellWidth: 12 },
                    7: { halign: 'center', cellWidth: 22, fontStyle: 'bold' },
                    8: { halign: 'center', cellWidth: 20 }
                },
                didParseCell: function(cellData) {
                    if (cellData.section === 'body' && cellData.column.index === 8) {
                        const val = parseFloat(cellData.cell.raw);
                        if (!isNaN(val)) {
                            cellData.cell.styles.textColor = val < 0 ? [22, 163, 74] : val > 0 ? [220, 53, 69] : [100, 100, 100];
                        }
                    }
                }
            });
        }

        // ================================================================
        // PAGE 3: Crash Characteristics + Environmental Conditions
        // ================================================================
        addNewPage('Crash Analysis - ' + catName);
        y = 18;

        y = drawSectionHeader(y, 'Crash Characteristics');

        // Row 1: Collision Types + Severity
        if (chartImages.collision) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Collision Type Distribution', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.collision, chartW, chartH);
                doc.addImage(chartImages.collision, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] collision chart error:', e); }
        }

        if (chartImages.severity) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Severity Breakdown', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.severity, chartW, chartH);
                doc.addImage(chartImages.severity, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] severity chart error:', e); }
        }

        y += chartH + 14;

        y = drawSectionHeader(y, 'Environmental Conditions');

        // Row 2: Weather + Light
        if (chartImages.weather) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Weather Conditions', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.weather, chartW, chartH);
                doc.addImage(chartImages.weather, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] weather chart error:', e); }
        }

        if (chartImages.light) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Light Conditions', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.light, chartW, chartH);
                doc.addImage(chartImages.light, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] light chart error:', e); }
        }

        y += chartH + 14;

        // Row 3: Road Surface + Traffic Control
        if (chartImages.surface) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Road Surface Conditions', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.surface, chartW, chartH);
                doc.addImage(chartImages.surface, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] surface chart error:', e); }
        }

        if (chartImages.control) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Traffic Control', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(charts.control, chartW, chartH);
                doc.addImage(chartImages.control, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[SF PDF] control chart error:', e); }
        }

        // ================================================================
        // PAGE 4: Contributing Factors + VRU & Demographics
        // ================================================================
        addNewPage('Contributing Factors - ' + catName);
        y = 18;

        y = drawSectionHeader(y, 'Contributing Factors (vs Category Average)');

        const benchmarks = sfDetailState.categoryBenchmarks || {};
        const factorsData = [
            { name: 'Alcohol-Related', count: data.factors.alcohol, benchmark: benchmarks.alcohol || 0, color: [239, 68, 68] },
            { name: 'Speed-Related', count: data.factors.speed, benchmark: benchmarks.speed || 0, color: [245, 158, 11] },
            { name: 'Distracted Driving', count: data.factors.distracted, benchmark: benchmarks.distracted || 0, color: [59, 130, 246] },
            { name: 'Drowsy Driving', count: data.factors.drowsy, benchmark: benchmarks.drowsy || 0, color: [139, 92, 246] },
            { name: 'Drug-Related', count: data.factors.drug, benchmark: benchmarks.drug || 0, color: [236, 72, 153] },
            { name: 'Hit-and-Run', count: data.factors.hitrun, benchmark: benchmarks.hitrun || 0, color: [100, 116, 139] }
        ];

        // Factor cards in 3x2 grid
        const factorCardW = (contentWidth - 10) / 3;
        const factorCardH = 24;
        factorsData.forEach((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const fx = margin + col * (factorCardW + 5);
            const fy = y + row * (factorCardH + 4);
            const pct = total > 0 ? (f.count / total * 100) : 0;
            const diff = pct - f.benchmark;

            doc.setFillColor(255, 255, 255);
            doc.roundedRect(fx, fy, factorCardW, factorCardH, 1.5, 1.5, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(fx, fy, factorCardW, factorCardH, 1.5, 1.5, 'S');
            doc.setFillColor(...f.color);
            doc.rect(fx, fy, 3, factorCardH, 'F');

            doc.setFontSize(8);
            doc.setTextColor(51, 51, 51);
            doc.setFont(undefined, 'bold');
            doc.text(f.name, fx + 6, fy + 8);
            doc.setFont(undefined, 'normal');

            doc.setFontSize(12);
            doc.setTextColor(...f.color);
            doc.setFont(undefined, 'bold');
            doc.text(f.count.toLocaleString(), fx + 6, fy + 17);
            doc.setFont(undefined, 'normal');

            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            const offsetX = fx + 6 + doc.getTextWidth(f.count.toLocaleString() + ' ');
            doc.text('(' + pct.toFixed(1) + '%)', offsetX, fy + 17);

            // Benchmark comparison
            doc.setFontSize(6.5);
            const benchColor = diff > 1 ? [220, 53, 69] : diff < -1 ? [22, 163, 74] : [100, 100, 100];
            doc.setTextColor(...benchColor);
            doc.text((diff > 0 ? '+' : '') + diff.toFixed(1) + '% vs avg', fx + factorCardW - 3, fy + 8, { align: 'right' });

            doc.setTextColor(0, 0, 0);
        });

        y += (factorCardH + 4) * 2 + 8;

        // Contributing factors table
        const factorTableData = factorsData.map(f => {
            const pct = total > 0 ? (f.count / total * 100).toFixed(1) + '%' : '0%';
            const diff = total > 0 ? (f.count / total * 100) - f.benchmark : 0;
            return [f.name, f.count.toString(), pct, f.benchmark.toFixed(1) + '%', (diff > 0 ? '+' : '') + diff.toFixed(1) + '%'];
        });

        doc.autoTable({
            startY: y,
            head: [['Factor', 'Count', 'Rate', 'Category Avg', 'vs Average']],
            body: factorTableData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { halign: 'center', cellWidth: 18 },
                2: { halign: 'center', cellWidth: 18 },
                3: { halign: 'center', cellWidth: 25 },
                4: { halign: 'center', cellWidth: 22 }
            },
            didParseCell: function(cellData) {
                if (cellData.section === 'body' && cellData.column.index === 4) {
                    const val = parseFloat(cellData.cell.raw);
                    if (!isNaN(val)) {
                        cellData.cell.styles.textColor = val > 1 ? [220, 53, 69] : val < -1 ? [22, 163, 74] : [100, 100, 100];
                    }
                }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // VRU & Demographics Section
        y = drawSectionHeader(y, 'Vulnerable Road Users & Demographics');

        const vruTableData = [
            ['Pedestrian', data.vru.pedestrian.total.toString(), (data.vru.pedestrian.total / total * 100).toFixed(1) + '%', (data.vru.pedestrian.K + data.vru.pedestrian.A).toString()],
            ['Bicycle', data.vru.bicycle.total.toString(), (data.vru.bicycle.total / total * 100).toFixed(1) + '%', (data.vru.bicycle.K + data.vru.bicycle.A).toString()],
            ['Motorcycle', data.vru.motorcycle.total.toString(), (data.vru.motorcycle.total / total * 100).toFixed(1) + '%', (data.vru.motorcycle.K + data.vru.motorcycle.A).toString()],
            ['Senior (65+)', data.demographics.senior.toString(), (data.demographics.senior / total * 100).toFixed(1) + '%', '-'],
            ['Young (<25)', data.demographics.young.toString(), (data.demographics.young / total * 100).toFixed(1) + '%', '-'],
            ['Unrestrained', data.demographics.unrestrained.toString(), (data.demographics.unrestrained / total * 100).toFixed(1) + '%', '-']
        ];

        doc.autoTable({
            startY: y,
            head: [['Category', 'Count', 'Percentage', 'K+A Count']],
            body: vruTableData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 40 },
                1: { halign: 'center', cellWidth: 20 },
                2: { halign: 'center', cellWidth: 25 },
                3: { halign: 'center', cellWidth: 22 }
            }
        });

        y = doc.lastAutoTable.finalY + 10;

        // Special Zones Section
        y = drawSectionHeader(y, 'Special Zones & Infrastructure');

        const darkCount = Object.entries(data.byLight).filter(([k]) => k.toLowerCase().includes('dark')).reduce((s, [,v]) => s + v, 0);
        const adverseWeather = Object.entries(data.byWeather).filter(([k]) => !k.toLowerCase().includes('clear') && k !== 'Unknown' && k.trim() !== '').reduce((s, [,v]) => s + v, 0);

        const zoneTableData = [
            ['Work Zone Crashes', data.specialZones.workZone.toString(), (data.specialZones.workZone / total * 100).toFixed(1) + '%'],
            ['School Zone Crashes', data.specialZones.schoolZone.toString(), (data.specialZones.schoolZone / total * 100).toFixed(1) + '%'],
            ['Dark Condition Crashes', darkCount.toString(), (darkCount / total * 100).toFixed(1) + '%'],
            ['Adverse Weather Crashes', adverseWeather.toString(), (adverseWeather / total * 100).toFixed(1) + '%']
        ];

        doc.autoTable({
            startY: y,
            head: [['Zone/Condition', 'Count', 'Percentage']],
            body: zoneTableData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { halign: 'center', cellWidth: 20 },
                2: { halign: 'center', cellWidth: 25 }
            }
        });

        // ================================================================
        // PAGE 5: Location Comparison (for combined segments)
        // ================================================================
        if (locCount >= 2) {
            addNewPage('Location Comparison - ' + catName);
            y = 18;

            y = drawSectionHeader(y, 'Combined Segment Analysis (' + locCount + ' Locations)');

            // Comparison table
            const compTableData = [];
            sfDetailState.selectedLocations.forEach(loc => {
                const locData = data.byLocation[loc];
                if (!locData) return;
                const clean = loc.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || loc;
                const locEpdo = calcEPDO(locData.severity || {K:0,A:0,B:0,C:0,O:0});
                const locKaRate = locData.total > 0 ? ((locData.severity.K + locData.severity.A) / locData.total * 100).toFixed(1) + '%' : '0%';
                const contribution = data.total > 0 ? (locData.total / data.total * 100).toFixed(1) + '%' : '0%';
                const topCollision = Object.entries(locData.byCollision || {}).sort((a, b) => b[1] - a[1])[0];
                compTableData.push([
                    clean.substring(0, 30),
                    locData.total.toString(),
                    locData.severity.K.toString(),
                    locData.severity.A.toString(),
                    locData.severity.B.toString(),
                    locData.severity.C.toString(),
                    locData.severity.O.toString(),
                    locEpdo.toLocaleString(),
                    locKaRate,
                    contribution,
                    topCollision ? topCollision[0].substring(0, 18) : '-'
                ]);
            });

            // Grand total row
            const topOverall = Object.entries(data.byCollision || {}).sort((a, b) => b[1] - a[1])[0];
            compTableData.push([
                'TOTAL',
                data.total.toString(),
                data.severity.K.toString(),
                data.severity.A.toString(),
                data.severity.B.toString(),
                data.severity.C.toString(),
                data.severity.O.toString(),
                epdo.toLocaleString(),
                kaRate.toFixed(1) + '%',
                '100%',
                topOverall ? topOverall[0].substring(0, 18) : '-'
            ]);

            doc.autoTable({
                startY: y,
                head: [['Location', 'Total', 'K', 'A', 'B', 'C', 'O', 'EPDO', 'KA%', 'Contrib%', 'Top Collision']],
                body: compTableData,
                margin: { left: margin, right: margin },
                headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 7 },
                bodyStyles: { fontSize: 7 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { cellPadding: 1.8 },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { halign: 'center', cellWidth: 13 },
                    2: { halign: 'center', cellWidth: 10 },
                    3: { halign: 'center', cellWidth: 10 },
                    4: { halign: 'center', cellWidth: 10 },
                    5: { halign: 'center', cellWidth: 10 },
                    6: { halign: 'center', cellWidth: 10 },
                    7: { halign: 'center', cellWidth: 18, fontStyle: 'bold' },
                    8: { halign: 'center', cellWidth: 13 },
                    9: { halign: 'center', cellWidth: 15 },
                    10: { cellWidth: 30 }
                },
                didParseCell: function(cellData) {
                    if (cellData.section === 'body' && cellData.row.index === compTableData.length - 1) {
                        cellData.cell.styles.fontStyle = 'bold';
                        cellData.cell.styles.fillColor = [226, 232, 240];
                    }
                    if (cellData.section === 'body' && (cellData.column.index === 2 || cellData.column.index === 3)) {
                        const val = parseInt(cellData.cell.raw);
                        if (val > 0) cellData.cell.styles.textColor = [220, 53, 69];
                    }
                }
            });

            y = doc.lastAutoTable.finalY + 10;

            // Per-location contributing factors comparison
            y = drawSectionHeader(y, 'Contributing Factors Comparison');

            const factorCompData = [];
            sfDetailState.selectedLocations.forEach(loc => {
                const locData = data.byLocation[loc];
                if (!locData) return;
                const clean = loc.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || loc;
                const lt = locData.total || 1;
                factorCompData.push([
                    clean.substring(0, 25),
                    lt.toString(),
                    locData.factors?.speed || 0,
                    locData.factors?.alcohol || 0,
                    locData.factors?.distracted || 0,
                    locData.factors?.hitrun || 0,
                    (locData.vru?.pedestrian || 0) + (locData.vru?.bicycle || 0)
                ]);
            });

            if (factorCompData.length > 0) {
                doc.autoTable({
                    startY: y,
                    head: [['Location', 'Crashes', 'Speed', 'Impaired', 'Distracted', 'Hit-Run', 'Ped/Bike']],
                    body: factorCompData.map(row => row.map(String)),
                    margin: { left: margin, right: margin },
                    headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8 },
                    bodyStyles: { fontSize: 8 },
                    alternateRowStyles: { fillColor: [248, 250, 252] },
                    styles: { cellPadding: 2 },
                    columnStyles: {
                        0: { cellWidth: 40 },
                        1: { halign: 'center', cellWidth: 18 },
                        2: { halign: 'center', cellWidth: 16 },
                        3: { halign: 'center', cellWidth: 18 },
                        4: { halign: 'center', cellWidth: 20 },
                        5: { halign: 'center', cellWidth: 16 },
                        6: { halign: 'center', cellWidth: 18 }
                    }
                });
            }
        }

        // ---- Finalize: Add footer to last page ----
        addFooter();

        // Update total pages on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - margin - 30, pageHeight - 16, 30, 8, 'F');
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text('Page ' + i + ' of ' + pageCount, pageWidth - margin, pageHeight - 12, { align: 'right' });
        }

        // Save
        const catSlug = category.replace(/[^a-z0-9]/gi, '_');
        doc.save('Safety_Focus_Detail_' + catSlug + '_' + dateStamp + '.pdf');

        hideLoading();
        showToast('Professional PDF report generated! (' + pageCount + ' pages)', 'success');

    } catch (err) {
        hideLoading();
        console.error('[SF Detail PDF] Error generating report:', err);
        showToast('Error generating PDF: ' + err.message, 'error');
    }
}

function exportSfDetailKML() {
    const data = sfDetailState.aggregatedData;
    if (!data || !data.crashes || data.crashes.length === 0) {
        alert('No data to export');
        return;
    }

    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catName = catConfig?.name || category;
    const locCount = sfDetailState.selectedLocations.length;

    const title = 'Safety Focus: ' + catName + ' - ' + locCount + ' Location(s)';
    const kml = generateKML(data.crashes, { title });
    const catSlug = category.replace(/[^a-z0-9]/gi, '_');
    downloadKML(kml, 'safety_focus_detail_' + catSlug + '_' + new Date().toISOString().split('T')[0]);
    showToast('Exported ' + data.crashes.length + ' crashes to KML', 'success');
}

function exportSafetyData() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    exportCrashesToCSV(catData.crashes, `Safety_${catConfig.name.replace(/\s+/g, '_')}`);
}

function exportSafetyLocationData(route, category) {
    const catData = safetyState.data[category];
    const routeData = catData.byRoute[route];
    
    if (!routeData) return;
    
    const routeClean = route.replace(/[^a-z0-9]/gi, '_');
    exportCrashesToCSV(routeData.crashes, `Safety_${routeClean}`);
}

function exportSfDetailKML() {
    const data = sfDetailState.aggregatedData;
    if (!data || !data.crashes || data.crashes.length === 0) {
        alert('No data to export');
        return;
    }

    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catName = catConfig?.name || category;
    const locCount = sfDetailState.selectedLocations.length;

    const title = 'Safety Focus: ' + catName + ' - ' + locCount + ' Location(s)';
    const kml = generateKML(data.crashes, { title });
    const catSlug = category.replace(/[^a-z0-9]/gi, '_');
    downloadKML(kml, 'safety_focus_detail_' + catSlug + '_' + new Date().toISOString().split('T')[0]);
    showToast('Exported ' + data.crashes.length + ' crashes to KML', 'success');
}

function exportSafetyData() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    exportCrashesToCSV(catData.crashes, `Safety_${catConfig.name.replace(/\s+/g, '_')}`);
}

function exportSafetyLocationData(route, category) {
    const catData = safetyState.data[category];
    const routeData = catData.byRoute[route];
    
    if (!routeData) return;
    
    const routeClean = route.replace(/[^a-z0-9]/gi, '_');
    exportCrashesToCSV(routeData.crashes, `Safety_${routeClean}`);
}

function exportSafetyCategoryPDF() {
    const category = safetyState.activeCategory;
    if (!category || category === 'cross' || category === 'custommatrix') {
        showToast('Please select a safety category first', 'warning');
        return;
    }

    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    if (!catData || !catData.crashes || catData.crashes.length === 0) {
        showToast('No data available for this category', 'warning');
        return;
    }

    showLoading('Generating Safety Category PDF Report...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);
        const colors = SELECTION_PDF_STYLES.colors;
        const sevColors = SELECTION_PDF_STYLES.severityColors;

        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateStamp = new Date().toISOString().split('T')[0];
        // Period must reflect the Safety Focus tab's own date filter
        // (safetyStartDate / safetyEndDate), not the full data range.
        const yearRange = resolveReportPeriod('safetyStartDate', 'safetyEndDate');

        const severity = catData.severity;
        const total = catData.crashes.length;
        const epdo = calculateEPDO(severity);
        const locationCount = Object.keys(catData.byRoute).length;
        const kaCount = severity.K + severity.A;

        let currentPage = 1;
        let totalPages = 1;
        const footerMargin = 22;

        // ---- Helper Functions ----

        function addFooter() {
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 12);
            doc.text(generatedDate, pageWidth / 2, pageHeight - 12, { align: 'center' });
            doc.text('Page ' + currentPage + ' of ' + totalPages, pageWidth - margin, pageHeight - 12, { align: 'right' });
            doc.setTextColor(0, 0, 0);
        }

        function drawMiniHeader(pageTitle) {
            doc.setFillColor(...colors.primary);
            doc.rect(0, 0, pageWidth, 12, 'F');
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            doc.setFont(undefined, 'bold');
            doc.text('CRASH LENS', margin, 8);
            doc.setFont(undefined, 'normal');
            doc.text(pageTitle, pageWidth - margin, 8, { align: 'right' });
            doc.setTextColor(0, 0, 0);
        }

        function drawSectionHeader(y, title) {
            doc.setFontSize(13);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, y + 5);
            doc.setFont(undefined, 'normal');
            doc.setDrawColor(...colors.secondary);
            doc.setLineWidth(0.7);
            doc.line(margin, y + 8, margin + contentWidth, y + 8);
            doc.setTextColor(0, 0, 0);
            return y + 14;
        }

        function drawKPI(x, y, width, label, value, color) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, y, width, 26, 2, 2, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(x, y, width, 26, 2, 2, 'S');
            doc.setFillColor(...color);
            doc.rect(x, y, width, 3, 'F');
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...color);
            doc.text(String(value), x + width / 2, y + 14, { align: 'center' });
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.text(label, x + width / 2, y + 22, { align: 'center' });
            doc.setTextColor(0, 0, 0);
        }

        function addNewPage(pageTitle) {
            addFooter();
            doc.addPage();
            totalPages++;
            currentPage++;
            drawMiniHeader(pageTitle);
        }

        // ---- Compute Contributing Factors ----
        let speedCount = 0, seniorCount = 0, youngCount = 0, nightCount = 0, impairedCount = 0, distractedCount = 0;
        catData.crashes.forEach(row => {
            if ((row['Speed?'] || '').toLowerCase() === 'yes') speedCount++;
            if ((row[COL.SENIOR] || row['Senior?'] || '').toLowerCase() === 'yes') seniorCount++;
            if ((row[COL.YOUNG] || row['Young?'] || '').toLowerCase() === 'yes') youngCount++;
            if ((row[COL.NIGHT] || row['Night?'] || '').toLowerCase() === 'yes') nightCount++;
            if ((row['Alcohol?'] || '').toLowerCase() === 'yes' || (row['Drug Related?'] || '').toLowerCase() === 'yes') impairedCount++;
            if ((row['Distracted?'] || '').toLowerCase() === 'yes') distractedCount++;
        });

        // ---- Capture Chart Images ----
        const chartImages = {};
        if (safetyState.charts.breakdown) chartImages.breakdown = safetyState.charts.breakdown.toBase64Image();
        if (safetyState.charts.collision) chartImages.collision = safetyState.charts.collision.toBase64Image();
        // Note: Roadway Description and First Harmful Event are drawn natively in the PDF
        // from crash data for reliability (canvas capture can fail when grids are hidden)
        if (safetyState.charts.yearTrend) chartImages.yearTrend = safetyState.charts.yearTrend.toBase64Image();

        // ================================================================
        // PAGE 1: Cover + Key Statistics + Severity + Cross-Functional Contributing Factors
        // ================================================================

        // Header gradient
        doc.setFillColor(...colors.primary);
        doc.rect(0, 0, pageWidth, 42, 'F');
        doc.setFillColor(...colors.secondary);
        doc.rect(0, 34, pageWidth, 8, 'F');

        // Title
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('CRASH LENS', margin, 16);

        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Safety Category Analysis Report', margin, 26);

        // Category name
        doc.setFontSize(11);
        doc.text(catConfig.name, margin, 37);

        // Info box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 51, 51);
        doc.text('Category: ' + catConfig.name.substring(0, 22), pageWidth - margin - 62, 13);
        doc.text('Period: ' + yearRange, pageWidth - margin - 62, 20);
        doc.text('Total Crashes: ' + total.toLocaleString(), pageWidth - margin - 62, 27);
        doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

        let y = 52;

        // KPI Cards Row
        const kpiWidth = (contentWidth - 15) / 4;
        drawKPI(margin, y, kpiWidth, 'TOTAL CRASHES', total.toLocaleString(), colors.primary);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'FATAL (K)', severity.K, colors.fatal);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'SERIOUS INJURY (A)', severity.A, colors.serious);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'EPDO SCORE', epdo.toLocaleString(), [124, 58, 237]);

        y += 32;

        // KPI Cards Row 2
        drawKPI(margin, y, kpiWidth, 'K+A INJURIES', kaCount, colors.fatal);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'MINOR (B)', severity.B, colors.minor);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'POSSIBLE (C)', severity.C, colors.possible);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'LOCATIONS', locationCount, colors.primary);

        y += 35;

        // Severity Distribution Section
        y = drawSectionHeader(y, 'Severity Distribution');

        // Colored severity bar
        const barHeight = 8;
        const barY = y;
        const sevOrder = [
            { code: 'K', count: severity.K, color: sevColors.K, label: 'Fatal' },
            { code: 'A', count: severity.A, color: sevColors.A, label: 'Serious' },
            { code: 'B', count: severity.B, color: sevColors.B, label: 'Minor' },
            { code: 'C', count: severity.C, color: sevColors.C, label: 'Possible' },
            { code: 'O', count: severity.O, color: sevColors.O, label: 'PDO' }
        ];

        let barX = margin;
        sevOrder.forEach(s => {
            if (s.count > 0) {
                const segWidth = (s.count / total) * contentWidth;
                doc.setFillColor(...s.color);
                doc.rect(barX, barY, Math.max(segWidth, 2), barHeight, 'F');
                if (segWidth > 12) {
                    doc.setFontSize(6.5);
                    doc.setTextColor(255, 255, 255);
                    doc.setFont(undefined, 'bold');
                    doc.text(s.code + ':' + s.count, barX + segWidth / 2, barY + 5.5, { align: 'center' });
                }
                barX += segWidth;
            }
        });
        doc.setFont(undefined, 'normal');
        doc.setTextColor(0, 0, 0);

        y += barHeight + 4;

        // Severity table
        const sevTableData = sevOrder.map(s => {
            const pct = total > 0 ? ((s.count / total) * 100).toFixed(1) + '%' : '0%';
            const epdoContrib = s.code === 'K' ? s.count * 462 : s.code === 'A' ? s.count * 62 : s.code === 'B' ? s.count * 12 : s.code === 'C' ? s.count * 5 : s.count;
            return [s.label + ' (' + s.code + ')', s.count.toString(), pct, epdoContrib.toLocaleString()];
        });
        sevTableData.push(['Total', total.toString(), '100%', epdo.toLocaleString()]);

        doc.autoTable({
            startY: y,
            head: [['Severity Level', 'Count', 'Percentage', 'EPDO Contribution']],
            body: sevTableData,
            margin: { left: margin, right: margin },
            headStyles: {
                fillColor: colors.primary,
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 8.5
            },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'center' }
            }
        });

        y = doc.lastAutoTable.finalY + 8;

        // Cross-Functional Contributing Factors Section
        y = drawSectionHeader(y, 'Cross-Functional Contributing Factors');

        const factors = [
            { name: 'Speed-Related', icon: 'SPD', count: speedCount, color: [239, 68, 68] },
            { name: 'Senior Driver', icon: 'SEN', count: seniorCount, color: [245, 158, 11] },
            { name: 'Young Driver', icon: 'YNG', count: youngCount, color: [59, 130, 246] },
            { name: 'Nighttime', icon: 'NGT', count: nightCount, color: [99, 102, 241] },
            { name: 'Impaired', icon: 'IMP', count: impairedCount, color: [220, 38, 38] },
            { name: 'Distracted', icon: 'DST', count: distractedCount, color: [16, 185, 129] }
        ];

        // 3x2 grid of factor cards
        const factorCardW = (contentWidth - 10) / 3;
        const factorCardH = 20;
        factors.forEach((f, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const fx = margin + col * (factorCardW + 5);
            const fy = y + row * (factorCardH + 4);

            const pct = total > 0 ? ((f.count / total) * 100).toFixed(1) : '0.0';

            // Card background
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(fx, fy, factorCardW, factorCardH, 1.5, 1.5, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(fx, fy, factorCardW, factorCardH, 1.5, 1.5, 'S');

            // Color accent on left
            doc.setFillColor(...f.color);
            doc.rect(fx, fy, 3, factorCardH, 'F');

            // Factor name
            doc.setFontSize(8);
            doc.setTextColor(51, 51, 51);
            doc.setFont(undefined, 'bold');
            doc.text(f.name, fx + 6, fy + 8);
            doc.setFont(undefined, 'normal');

            // Count and percentage
            doc.setFontSize(11);
            doc.setTextColor(...f.color);
            doc.setFont(undefined, 'bold');
            doc.text(f.count.toLocaleString(), fx + 6, fy + 16);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(8);
            doc.setTextColor(120, 120, 120);
            doc.text('(' + pct + '%)', fx + 6 + doc.getTextWidth(f.count.toLocaleString() + ' '), fy + 16);

            doc.setTextColor(0, 0, 0);
        });

        y += (factorCardH + 4) * 2 + 2;

        // ================================================================
        // PAGE 2: Charts & Analysis
        // ================================================================
        addNewPage('Charts & Analysis - ' + catConfig.name);
        y = 18;

        y = drawSectionHeader(y, 'Crash Analysis Charts');

        const chartW = (contentWidth - 6) / 2;
        const chartH = 55;

        // Helper: fit image within a bounding box preserving aspect ratio
        function fitImageInBox(chart, maxW, maxH) {
            if (!chart || !chart.canvas) return { w: maxW, h: maxH, offX: 0, offY: 0 };
            const cw = chart.canvas.width || 1;
            const ch = chart.canvas.height || 1;
            const ar = cw / ch;
            let w = maxW, h = maxW / ar;
            if (h > maxH) { h = maxH; w = maxH * ar; }
            return { w, h, offX: (maxW - w) / 2, offY: (maxH - h) / 2 };
        }

        // Row 1: Subcategory Breakdown + Collision Type
        if (chartImages.breakdown) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text((catConfig.subcategoryField || 'Subcategory') + ' Breakdown', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(safetyState.charts.breakdown, chartW, chartH);
                doc.addImage(chartImages.breakdown, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[Safety PDF] breakdown chart error:', e); }
        }

        if (chartImages.collision) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Collision Type Distribution', margin + chartW + 6, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(safetyState.charts.collision, chartW, chartH);
                doc.addImage(chartImages.collision, 'PNG', margin + chartW + 6 + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[Safety PDF] collision chart error:', e); }
        }

        y += chartH + 14;

        // Row 2: Roadway Description + First Harmful Event
        // Draw these natively from crash data for reliability (canvas capture can fail when grids are hidden)
        let hasRow2Content = false;

        // Helper: Draw a horizontal bar chart natively in the PDF
        function drawNativeHBarChart(crashes, fieldName, xStart, yStart, w, h, barColor, chartTitle) {
            const counts = {};
            crashes.forEach(row => {
                const val = row[fieldName] || 'Unknown';
                counts[val] = (counts[val] || 0) + 1;
            });
            const sorted = Object.entries(counts)
                .filter(([key]) => key !== 'Unknown' && key.trim() !== '')
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8);
            if (sorted.length === 0) return false;

            // Title
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text(chartTitle, xStart, yStart + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);

            const maxVal = sorted[0][1];
            const barAreaY = yStart + 6;
            const barAreaH = h - 8;
            const barSpacing = barAreaH / sorted.length;
            const barH = Math.min(barSpacing * 0.7, 6);
            const labelW = w * 0.45;
            const barMaxW = w * 0.4;
            const countX = xStart + labelW + barMaxW + 2;

            sorted.forEach(([label, count], i) => {
                const bY = barAreaY + i * barSpacing + (barSpacing - barH) / 2;
                // Label
                doc.setFontSize(6.5);
                doc.setTextColor(60, 60, 60);
                const cleanLabel = label.replace(/^\d+\.\s*/, '').substring(0, 22);
                doc.text(cleanLabel, xStart, bY + barH * 0.75);
                // Bar
                const barW = Math.max((count / maxVal) * barMaxW, 2);
                doc.setFillColor(...(typeof barColor === 'string' ? hexToRgbArray(barColor) : barColor));
                doc.roundedRect(xStart + labelW, bY, barW, barH, 1, 1, 'F');
                // Count
                doc.setFontSize(6);
                doc.setTextColor(100, 100, 100);
                doc.text(count.toLocaleString(), countX, bY + barH * 0.75);
            });
            doc.setTextColor(0, 0, 0);
            return true;
        }

        // Draw Roadway Description breakdown
        const hasRoadway = drawNativeHBarChart(catData.crashes, COL.ROAD_DESC, margin, y, chartW, chartH, '#10b981', 'Roadway Description Breakdown');
        if (hasRoadway) hasRow2Content = true;

        // Draw First Harmful Event breakdown
        const hasHarmful = drawNativeHBarChart(catData.crashes, COL.FIRST_HARMFUL, margin + chartW + 6, y, chartW, chartH, '#f59e0b', 'First Harmful Event Breakdown');
        if (hasHarmful) hasRow2Content = true;

        if (hasRow2Content) y += chartH + 14;

        // Year Over Year Chart (full width)
        if (chartImages.yearTrend) {
            doc.setFontSize(9);
            doc.setTextColor(...colors.primary);
            doc.setFont(undefined, 'bold');
            doc.text('Year Over Year Crash Distribution', margin, y + 3);
            doc.setFont(undefined, 'normal');
            doc.setTextColor(0, 0, 0);
            try {
                const fit = fitImageInBox(safetyState.charts.yearTrend, contentWidth, chartH + 10);
                doc.addImage(chartImages.yearTrend, 'PNG', margin + fit.offX, y + 5 + fit.offY, fit.w, fit.h);
            } catch(e) { console.warn('[Safety PDF] year trend chart error:', e); }
            y += chartH + 20;
        }

        // ================================================================
        // PAGE 3: Top Locations Table
        // ================================================================
        addNewPage('Top Locations - ' + catConfig.name);
        y = 18;

        y = drawSectionHeader(y, 'Top Locations by EPDO Score');

        // Build location table data
        const routes = Object.entries(catData.byRoute)
            .map(([route, data]) => ({
                route: route.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || route,
                count: data.crashes.length,
                ka: data.severity.K + data.severity.A,
                epdo: calculateEPDO(data.severity),
                K: data.severity.K,
                A: data.severity.A,
                B: data.severity.B,
                C: data.severity.C,
                O: data.severity.O
            }))
            .sort((a, b) => b.epdo - a.epdo)
            .slice(0, 25);

        const locTableData = routes.map((r, i) => [
            (i + 1).toString(),
            r.route.substring(0, 30),
            r.count.toString(),
            r.K.toString(),
            r.A.toString(),
            r.ka.toString(),
            r.B.toString(),
            r.C.toString(),
            r.O.toString(),
            r.epdo.toLocaleString()
        ]);

        doc.autoTable({
            startY: y,
            head: [['#', 'Route / Location', 'Crashes', 'K', 'A', 'K+A', 'B', 'C', 'O', 'EPDO']],
            body: locTableData,
            margin: { left: margin, right: margin },
            headStyles: {
                fillColor: colors.primary,
                textColor: 255,
                fontStyle: 'bold',
                fontSize: 7.5
            },
            bodyStyles: { fontSize: 7.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 1.8 },
            columnStyles: {
                0: { cellWidth: 8, halign: 'center' },
                1: { cellWidth: 42 },
                2: { halign: 'center', cellWidth: 16 },
                3: { halign: 'center', cellWidth: 10 },
                4: { halign: 'center', cellWidth: 10 },
                5: { halign: 'center', cellWidth: 14, fontStyle: 'bold' },
                6: { halign: 'center', cellWidth: 10 },
                7: { halign: 'center', cellWidth: 10 },
                8: { halign: 'center', cellWidth: 10 },
                9: { halign: 'center', cellWidth: 20, fontStyle: 'bold' }
            },
            didParseCell: function(data) {
                if (data.section === 'body') {
                    // Highlight K+A column
                    if (data.column.index === 5) {
                        const kaVal = parseInt(data.cell.raw);
                        if (kaVal > 0) data.cell.styles.textColor = [220, 53, 69];
                    }
                    // Highlight K column
                    if (data.column.index === 3) {
                        const kVal = parseInt(data.cell.raw);
                        if (kVal > 0) {
                            data.cell.styles.textColor = [220, 53, 69];
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                    // Row highlighting based on severity
                    const kCol = data.row.raw ? data.row.raw[3] : null;
                    const aCol = data.row.raw ? data.row.raw[4] : null;
                    if (kCol && parseInt(kCol) > 0) {
                        data.cell.styles.fillColor = [254, 242, 242];
                    } else if (aCol && parseInt(aCol) > 0) {
                        data.cell.styles.fillColor = [255, 247, 237];
                    }
                }
            }
        });

        y = doc.lastAutoTable.finalY + 8;

        // Summary stats below table
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Showing top ' + routes.length + ' of ' + locationCount + ' locations | Sorted by EPDO score (descending)', margin, y);

        // ================================================================
        // PAGE 4: Year & Severity Distribution Detail
        // ================================================================
        addNewPage('Year & Severity Analysis - ' + catConfig.name);
        y = 18;

        y = drawSectionHeader(y, 'Year-over-Year Severity Breakdown');

        // Compute year-by-year data from crashes
        const yearBreakdown = {};
        catData.crashes.forEach(row => {
            const yearVal = row[COL.YEAR];
            let yr = null;
            if (yearVal !== undefined && yearVal !== null && yearVal !== '') {
                yr = parseInt(yearVal, 10);
                if (isNaN(yr) || yr < 2000 || yr > 2030) yr = null;
            }
            if (!yr) {
                const dateVal = row[COL.DATE];
                if (dateVal) {
                    const ts = typeof dateVal === 'number' ? dateVal : Number(dateVal);
                    if (!isNaN(ts) && ts > 0) {
                        const d = new Date(ts);
                        if (!isNaN(d.getTime())) yr = d.getFullYear();
                    }
                }
            }
            if (!yr) return;
            if (!yearBreakdown[yr]) yearBreakdown[yr] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            yearBreakdown[yr].total++;
            const sev = extractSeverity(row);
            if (yearBreakdown[yr][sev] !== undefined) yearBreakdown[yr][sev]++;
        });

        const ybYears = Object.keys(yearBreakdown).sort();
        if (ybYears.length > 0) {
            const yearBreakdownData = ybYears.map((yr, idx) => {
                const d = yearBreakdown[yr];
                const yrEpdo = d.K*462 + d.A*62 + d.B*12 + d.C*5 + d.O;
                let pctChange = '-';
                if (idx > 0) {
                    const prev = yearBreakdown[ybYears[idx-1]]?.total || 0;
                    if (prev > 0) pctChange = (((d.total - prev) / prev) * 100).toFixed(1) + '%';
                }
                return [yr, d.total.toString(), d.K.toString(), d.A.toString(), d.B.toString(), d.C.toString(), d.O.toString(), yrEpdo.toLocaleString(), pctChange];
            });

            // Totals row
            const totals = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
            ybYears.forEach(yr => {
                const d = yearBreakdown[yr];
                totals.total += d.total; totals.K += d.K; totals.A += d.A; totals.B += d.B; totals.C += d.C; totals.O += d.O;
            });
            const totalEpdo = totals.K*462 + totals.A*62 + totals.B*12 + totals.C*5 + totals.O;
            yearBreakdownData.push(['TOTAL', totals.total.toString(), totals.K.toString(), totals.A.toString(), totals.B.toString(), totals.C.toString(), totals.O.toString(), totalEpdo.toLocaleString(), '-']);

            doc.autoTable({
                startY: y,
                head: [['Year', 'Total', 'K', 'A', 'B', 'C', 'O', 'EPDO', '% Change']],
                body: yearBreakdownData,
                margin: { left: margin, right: margin },
                headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
                bodyStyles: { fontSize: 8.5 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { cellPadding: 2.5 },
                columnStyles: {
                    0: { cellWidth: 18 },
                    1: { halign: 'center', cellWidth: 18 },
                    2: { halign: 'center', cellWidth: 12 },
                    3: { halign: 'center', cellWidth: 12 },
                    4: { halign: 'center', cellWidth: 12 },
                    5: { halign: 'center', cellWidth: 12 },
                    6: { halign: 'center', cellWidth: 12 },
                    7: { halign: 'center', cellWidth: 24, fontStyle: 'bold' },
                    8: { halign: 'center', cellWidth: 20 }
                },
                didParseCell: function(data) {
                    if (data.section === 'body' && data.row.index === yearBreakdownData.length - 1) {
                        data.cell.styles.fontStyle = 'bold';
                        data.cell.styles.fillColor = [226, 232, 240];
                    }
                    if (data.section === 'body' && data.column.index === 8) {
                        const val = parseFloat(data.cell.raw);
                        if (!isNaN(val)) {
                            data.cell.styles.textColor = val < 0 ? [22, 163, 74] : val > 0 ? [220, 53, 69] : [100, 100, 100];
                        }
                    }
                }
            });
            y = doc.lastAutoTable.finalY + 10;
        }

        // Monthly Distribution
        y = drawSectionHeader(y, 'Monthly Crash Distribution');

        const monthBreakdown = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        catData.crashes.forEach(row => {
            const dateVal = row[COL.DATE];
            if (!dateVal) return;
            const ts = typeof dateVal === 'number' ? dateVal : Number(dateVal);
            if (isNaN(ts) || ts <= 0) return;
            const d = new Date(ts);
            if (isNaN(d.getTime())) return;
            const month = d.getMonth();
            if (!monthBreakdown[month]) monthBreakdown[month] = { total: 0, K: 0, A: 0 };
            monthBreakdown[month].total++;
            const sev = extractSeverity(row);
            if (sev === 'K') monthBreakdown[month].K++;
            if (sev === 'A') monthBreakdown[month].A++;
        });

        const monthData = monthNames.map((name, idx) => {
            const d = monthBreakdown[idx] || { total: 0, K: 0, A: 0 };
            return [name, d.total.toString(), d.K.toString(), d.A.toString(), (d.K + d.A).toString()];
        });

        doc.autoTable({
            startY: y,
            head: [['Month', 'Total Crashes', 'Fatal (K)', 'Serious (A)', 'K+A']],
            body: monthData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
            bodyStyles: { fontSize: 8.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2.5 },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { halign: 'center', cellWidth: 25 },
                2: { halign: 'center', cellWidth: 22 },
                3: { halign: 'center', cellWidth: 22 },
                4: { halign: 'center', cellWidth: 22, fontStyle: 'bold' }
            },
            didParseCell: function(data) {
                if (data.section === 'body' && data.column.index === 4) {
                    const val = parseInt(data.cell.raw);
                    if (val > 0) data.cell.styles.textColor = [220, 53, 69];
                }
            }
        });

        // ================================================================
        // PAGE 5: Top 10 Location Profiles
        // ================================================================
        if (routes.length > 0) {
            addNewPage('Location Profiles - ' + catConfig.name);
            y = 18;

            y = drawSectionHeader(y, 'Top Location Detailed Profiles');

            const top10 = routes.slice(0, 10);
            const profileData = top10.map((r, i) => {
                const routeEntry = Object.entries(catData.byRoute).find(([route]) => {
                    const cleaned = route.replace(/^S-VA\d+[A-Z]*\s*/, '').trim() || route;
                    return cleaned === r.route || route === r.route;
                });
                const crashes = routeEntry ? routeEntry[1].crashes : [];

                // Top 3 collision types and contributing factors
                const byCollision = {};
                let speedC = 0, seniorC = 0, youngC = 0, nightC = 0;
                crashes.forEach(row => {
                    const collision = (row[COL.COLLISION] || 'Unknown').replace(/^\d+\.\s*/, '');
                    byCollision[collision] = (byCollision[collision] || 0) + 1;
                    if ((row['Speed?'] || '').toLowerCase() === 'yes') speedC++;
                    if ((row[COL.SENIOR] || row['Senior?'] || '').toLowerCase() === 'yes') seniorC++;
                    if ((row[COL.YOUNG] || row['Young?'] || '').toLowerCase() === 'yes') youngC++;
                    if ((row[COL.NIGHT] || row['Night?'] || '').toLowerCase() === 'yes') nightC++;
                });
                const topColl = Object.entries(byCollision).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t]) => t.substring(0, 15)).join(', ');
                const ct = crashes.length || 1;
                return [
                    (i + 1).toString(),
                    r.route.substring(0, 25),
                    r.count.toString(),
                    r.K + '/' + r.A + '/' + r.B,
                    r.epdo.toLocaleString(),
                    topColl.substring(0, 35) || '-',
                    ((speedC/ct)*100).toFixed(0) + '%',
                    ((nightC/ct)*100).toFixed(0) + '%',
                    ((seniorC/ct)*100).toFixed(0) + '%'
                ];
            });

            doc.autoTable({
                startY: y,
                head: [['#', 'Location', 'Crashes', 'K/A/B', 'EPDO', 'Top Collision Types', 'Speed%', 'Night%', 'Senior%']],
                body: profileData,
                margin: { left: margin, right: margin },
                headStyles: { fillColor: colors.primary, textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
                bodyStyles: { fontSize: 7 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                styles: { cellPadding: 2 },
                columnStyles: {
                    0: { cellWidth: 8, halign: 'center' },
                    1: { cellWidth: 28 },
                    2: { halign: 'center', cellWidth: 15 },
                    3: { halign: 'center', cellWidth: 16 },
                    4: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
                    5: { cellWidth: 45 },
                    6: { halign: 'center', cellWidth: 14 },
                    7: { halign: 'center', cellWidth: 14 },
                    8: { halign: 'center', cellWidth: 14 }
                },
                didParseCell: function(data) {
                    if (data.section === 'body') {
                        const kab = data.row.raw ? data.row.raw[3] : '';
                        if (kab) {
                            const kVal = parseInt(kab.split('/')[0]);
                            if (kVal > 0) data.cell.styles.fillColor = [254, 242, 242];
                        }
                    }
                }
            });

            y = doc.lastAutoTable.finalY + 8;
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('Profiles show top ' + top10.length + ' locations | Speed/Night/Senior percentages indicate contributing factor rates', margin, y);
        }

        // ---- Finalize: Add footer to last page ----
        addFooter();

        // ---- Update total pages on all pages ----
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            // Overwrite page number text
            doc.setFillColor(255, 255, 255);
            doc.rect(pageWidth - margin - 30, pageHeight - 16, 30, 8, 'F');
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text('Page ' + i + ' of ' + pageCount, pageWidth - margin, pageHeight - 12, { align: 'right' });
        }

        // Save
        const safeName = catConfig.name.replace(/[^a-zA-Z0-9]/g, '_');
        doc.save('Safety_' + safeName + '_Report_' + dateStamp + '.pdf');

        hideLoading();
        showToast('PDF report generated successfully!', 'success');

    } catch (err) {
        hideLoading();
        console.error('[Safety PDF] Error generating report:', err);
        showToast('Error generating PDF: ' + err.message, 'error');
    }
}

function viewSafetyOnMap(scope) {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catData = safetyState.data[category];
    
    // Switch to map tab
    showTab('map');
    
    // Filter map to show only this category's crashes
    setTimeout(() => {
        filterMapForSafety(catData.crashes, safetyCategories[category].name);
    }, 300);
}

function viewSafetyLocationOnMap(route, category) {
    const catData = safetyState.data[category];
    const routeData = catData.byRoute[route];
    
    if (!routeData || routeData.crashes.length === 0) {
        alert('No crash data for this location');
        return;
    }
    
    // Switch to map tab
    showTab('map');
    
    // Filter map to this location
    setTimeout(() => {
        filterMapForSafety(routeData.crashes, `${safetyCategories[category].icon} ${route}`);
    }, 300);
}

function getSafetyCMF() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    // Switch to CMF tab
    showTab('cmf');
    
    // Pre-populate CMF search with relevant keywords
    setTimeout(() => {
        const searchInput = document.getElementById('cmfRoadSearch');
        if (searchInput) {
            // Get top route
            const topRoutes = Object.entries(catData.byRoute)
                .sort((a, b) => b[1].crashes.length - a[1].crashes.length);
            
            if (topRoutes.length > 0) {
                const topRoute = topRoutes[0][0].replace(/^S-VA\d+[A-Z]*\s*/, '').trim();
                searchInput.value = topRoute;
                if (typeof filterCMFLocations === 'function') {
                    filterCMFLocations(topRoute);
                }
            }
        }
    }, 300);
}

function getCurrentDetailCMF() {
    if (safetyState.currentDetailRoute && safetyState.currentDetailCategory) {
        getSafetyLocationCMF(safetyState.currentDetailRoute, safetyState.currentDetailCategory);
        closeSafetyModal();
    }
}

function exportCurrentDetailToKML() {
    if (!safetyState.currentDetailCrashes || safetyState.currentDetailCrashes.length === 0) {
        alert('No data to export');
        return;
    }

    const crashes = safetyState.currentDetailCrashes;
    const route = safetyState.currentDetailRoute || 'Location';
    const category = safetyState.currentDetailCategory;
    const catConfig = safetyCategories[category];
    const routeClean = route.replace(/[^a-z0-9]/gi, '_');

    const title = `${catConfig?.name || 'Safety'} - ${route.replace(/^S-VA\d+[A-Z]*\s*/, '')}`;
    const kml = generateKML(crashes, { title });
    downloadKML(kml, `safety_${routeClean}_${new Date().toISOString().split('T')[0]}`);
    showToast(`🌍 Exported ${crashes.length} crashes to KML`, 'success');
}

function addCurrentDetailToReport() {
    if (!safetyState.currentDetailCrashes || safetyState.currentDetailCrashes.length === 0) {
        alert('No data to add to report');
        return;
    }
    
    const crashes = safetyState.currentDetailCrashes;
    const route = safetyState.currentDetailRoute;
    const category = safetyState.currentDetailCategory;
    const catConfig = safetyCategories[category];
    
    const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    crashes.forEach(row => {
        const sev = extractSeverity(row);
        severity[sev]++;
    });
    
    safetyState.reportData = {
        title: `${catConfig.name} - ${route.replace(/^S-VA\d+[A-Z]*\s*/, '')}`,
        crashes: crashes,
        severity: severity,
        epdo: calculateEPDO(severity),
        type: 'location',
        category: category,
        route: route
    };
    
    closeSafetyModal();
    alert(`✅ "${route.replace(/^S-VA\d+[A-Z]*\s*/, '')}" data ready for report!\n\nGo to Reports tab and select "Safety Focus Report" to generate.`);
}

function exportSafetyData() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    exportCrashesToCSV(catData.crashes, `Safety_${catConfig.name.replace(/\s+/g, '_')}`);
}

function exportSafetyLocationData(route, category) {
    const catData = safetyState.data[category];
    const routeData = catData.byRoute[route];
    
    if (!routeData) return;
    
    const routeClean = route.replace(/[^a-z0-9]/gi, '_');
    exportCrashesToCSV(routeData.crashes, `Safety_${routeClean}`);
}

function exportSafetyToKML() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }

    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];

    if (!catData.crashes || catData.crashes.length === 0) {
        alert('No data to export');
        return;
    }

    const title = catConfig.name;
    const safeName = category.replace(/[^a-z0-9]/gi, '_');

    const kml = generateKML(catData.crashes, { title });
    downloadKML(kml, `safety_${safeName}_${new Date().toISOString().split('T')[0]}`);
    showToast(`🌍 Exported ${catData.crashes.length} ${catConfig.name} to KML`, 'success');
}

function generateSafetyCategoryReport() {
    if (!safetyState.activeCategory || safetyState.activeCategory === 'cross' || safetyState.activeCategory === 'custommatrix') {
        alert('Please select a safety category first');
        return;
    }
    
    const category = safetyState.activeCategory;
    const catConfig = safetyCategories[category];
    const catData = safetyState.data[category];
    
    safetyState.reportData = {
        title: catConfig.name,
        crashes: catData.crashes,
        severity: catData.severity,
        epdo: calculateEPDO(catData.severity),
        type: 'category',
        category: category
    };
    
    // Switch to Reports tab and generate
    showTab('reports');
    document.getElementById('reportType').value = 'safetyfocus';
    document.getElementById('reportTitle').value = `${catConfig.name} Analysis`;
    
    setTimeout(() => {
        generateReport();
    }, 200);
}

    // ===== CC 201 dual-API exposure =====
    // After hoisting, each name refers to its LAST function declaration in
    // this IIFE — matching the original inline behavior (3rd dupe wins).
    window.CL = window.CL || {};
    CL.safety = CL.safety || {};
    CL.safety.export = CL.safety.export || {};
    Object.assign(CL.safety.export, {
        askMUTCDForSafetyCategory,
        queryCMFForSafetyCategory,
        exportSfDetailCSV,
        exportSfDetailPDF,
        exportSfDetailKML,
        exportSafetyData,
        exportSafetyLocationData,
        exportSafetyCategoryPDF,
        viewSafetyOnMap,
        viewSafetyLocationOnMap,
        getSafetyCMF,
        getCurrentDetailCMF,
        exportCurrentDetailToKML,
        addCurrentDetailToReport,
        exportSafetyToKML,
        generateSafetyCategoryReport
    });
    Object.assign(window, CL.safety.export);

    CL._registerModule('safety/export');
})();
