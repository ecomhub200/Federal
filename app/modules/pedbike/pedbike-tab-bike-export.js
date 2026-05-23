/** CL pedbike.bikeExport — extracted (name-anchored) 2026-05-23.
 *  see queue/203-passb-pedbike.md. No behavior change.
 *  Reads inline shared bikeAnalysisState (window-mirrored). */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Export bicycle crashes to KML
 */
function exportBikeCrashesToKML() {
    const bikeCrashes = crashState.sampleRows.filter(row =>
        row[COL.BIKE] === '1' || row[COL.BIKE] === 1 || row[COL.BIKE] === true || row[COL.BIKE] === 'Y' || row[COL.BIKE] === 'y' || row[COL.BIKE] === 'Yes' || row[COL.BIKE] === 'yes'
    );

    if (bikeCrashes.length === 0) {
        alert('No bicycle crashes found');
        return;
    }

    const title = `Bicycle Crashes - ${bikeCrashes.length} Total`;
    const kml = generateKML(bikeCrashes, { title });
    downloadKML(kml, `bicycle_crashes_${new Date().toISOString().split('T')[0]}`);
}

// ════════════════════════════════════════════════════════════
// BICYCLE VIEW MODE AND EXPORT FUNCTIONS
// ════════════════════════════════════════════════════════════

function setBikeViewMode(mode) {
    bikeAnalysisState.viewMode = mode;
    document.getElementById('btnBikeViewCombined').classList.toggle('active', mode === 'combined');
    document.getElementById('btnBikeViewCompare').classList.toggle('active', mode === 'compare');
    updateBikeDetailPanel();
}

function exportBikeDetailCSV() {
    const selected = bikeAnalysisState.selectedLocations;
    if (!selected.length) { alert('No locations selected'); return; }

    const allCrashes = selected.flatMap(s => s.crashes);
    const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
    let intCount = 0, nightCount = 0, alcoholCount = 0, speedCount = 0;

    allCrashes.forEach(c => {
        const sev = (c[COL.SEVERITY]||'').charAt(0);
        if (severity[sev] !== undefined) severity[sev]++;
        if (isIntersection(c)) intCount++;
        if (isYes(c[COL.NIGHT])) nightCount++;
        if (isYes(c[COL.ALCOHOL])) alcoholCount++;
        if (isYes(c[COL.SPEED])) speedCount++;
    });

    const epdo = calcEPDO(severity);
    const total = allCrashes.length || 1;

    const rows = [
        ['Bicycle Crash Detailed Analysis'],
        ['Generated', new Date().toLocaleString()],
        ['Locations', selected.map(s => s.location).join('; ')],
        [],
        ['SUMMARY METRICS'],
        ['Total Crashes', allCrashes.length],
        ['Fatal (K)', severity.K],
        ['Serious Injury (A)', severity.A],
        ['Minor Injury (B)', severity.B],
        ['Possible Injury (C)', severity.C],
        ['PDO (O)', severity.O],
        ['EPDO Score', epdo],
        ['K+A Rate', ((severity.K + severity.A) / total * 100).toFixed(2) + '%'],
        [],
        ['KEY FACTORS'],
        ['Factor', 'Count', 'Percentage'],
        ['Intersection', intCount, (intCount / total * 100).toFixed(2) + '%'],
        ['Nighttime', nightCount, (nightCount / total * 100).toFixed(2) + '%'],
        ['Alcohol-Related', alcoholCount, (alcoholCount / total * 100).toFixed(2) + '%'],
        ['Speed-Related', speedCount, (speedCount / total * 100).toFixed(2) + '%']
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, `bicycle_detail_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

function exportBikeDetailPDF() {
    const selected = bikeAnalysisState.selectedLocations;
    if (!selected.length) { alert('No locations selected'); return; }

    showLoading('Generating Bicycle Detailed Analysis PDF...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        const themeColors = {
            primary: [5, 150, 105],
            secondary: [16, 185, 129],
            fatal: [220, 53, 69],
            serious: [253, 126, 20],
            success: [22, 163, 74],
            gray: [100, 116, 139],
            lightGray: [248, 250, 252],
            text: [51, 51, 51]
        };
        const sevColors = SELECTION_PDF_STYLES.severityColors;

        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateStamp = new Date().toISOString().split('T')[0];

        const allCrashes = selected.flatMap(s => s.crashes);
        const severity = { K: 0, A: 0, B: 0, C: 0, O: 0 };
        let intCount = 0, nightCount = 0, alcoholCount = 0, speedCount = 0, distractedCount = 0, hitrunCount = 0;
        const byCollision = {};

        allCrashes.forEach(c => {
            const sev = (c[COL.SEVERITY]||'').charAt(0);
            if (severity[sev] !== undefined) severity[sev]++;
            if (isIntersection(c)) intCount++;
            if (isYes(c[COL.NIGHT])) nightCount++;
            if (isYes(c[COL.ALCOHOL])) alcoholCount++;
            if (isYes(c[COL.SPEED])) speedCount++;
            if (isYes(c[COL.DISTRACTED])) distractedCount++;
            if (isYes(c[COL.HIT_RUN])) hitrunCount++;
            const coll = c[COL.COLLISION] || 'Unknown';
            byCollision[coll] = (byCollision[coll] || 0) + 1;
        });

        const epdo = calcEPDO(severity);
        const total = allCrashes.length || 1;
        const kaCount = severity.K + severity.A;
        const kaRate = (kaCount / total * 100).toFixed(1) + '%';

        const locationNames = selected.map(s => s.location);
        const locationLabel = locationNames.length === 1 ? locationNames[0] : locationNames.length + ' Locations';

        // Helper: draw KPI card
        function drawKPI(x, yPos, width, label, value, color) {
            doc.setFillColor(255, 255, 255);
            doc.roundedRect(x, yPos, width, 26, 2, 2, 'F');
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.3);
            doc.roundedRect(x, yPos, width, 26, 2, 2, 'S');
            doc.setFillColor(...color);
            doc.rect(x, yPos, width, 3, 'F');
            doc.setFontSize(16);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...color);
            doc.text(String(value), x + width / 2, yPos + 14, { align: 'center' });
            doc.setFont(undefined, 'normal');
            doc.setFontSize(7);
            doc.setTextColor(100, 100, 100);
            doc.text(label, x + width / 2, yPos + 22, { align: 'center' });
            doc.setTextColor(0, 0, 0);
        }

        function drawSectionHeader(yPos, title) {
            doc.setFontSize(11);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...themeColors.primary);
            doc.text(title, margin, yPos);
            doc.setDrawColor(...themeColors.secondary);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos + 3, margin + contentWidth, yPos + 3);
            doc.setTextColor(0, 0, 0);
            doc.setFont(undefined, 'normal');
            return yPos + 10;
        }

        // === COVER HEADER ===
        doc.setFillColor(...themeColors.primary);
        doc.rect(0, 0, pageWidth, 42, 'F');
        doc.setFillColor(...themeColors.secondary);
        doc.rect(0, 34, pageWidth, 8, 'F');

        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('CRASH LENS', margin, 16);
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text('Bicycle Crash Detailed Analysis', margin, 26);
        doc.setFontSize(11);
        doc.text(locationLabel, margin, 37);

        // Info box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 51, 51);
        doc.text('Crashes: ' + allCrashes.length, pageWidth - margin - 62, 13);
        doc.text('Locations: ' + selected.length, pageWidth - margin - 62, 20);
        doc.text('EPDO: ' + epdo.toLocaleString(), pageWidth - margin - 62, 27);
        doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

        let y = 52;

        // === KPI CARDS ===
        const kpiWidth = (contentWidth - 15) / 4;
        drawKPI(margin, y, kpiWidth, 'TOTAL CRASHES', allCrashes.length.toLocaleString(), themeColors.primary);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'EPDO SCORE', epdo.toLocaleString(), [124, 58, 237]);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'FATAL + SERIOUS', kaCount, themeColors.fatal);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'KA RATE', kaRate, themeColors.success);

        y += 34;

        // === LOCATION INFO BOX ===
        doc.setFillColor(...themeColors.lightGray);
        doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...themeColors.primary);
        doc.text('Selected Location(s):', margin + 5, y + 7);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...themeColors.text);
        const locText = locationNames.length > 3
            ? locationNames.slice(0, 3).join(', ') + ' (+' + (locationNames.length - 3) + ' more)'
            : locationNames.join(', ');
        doc.text(locText.substring(0, 80), margin + 5, y + 13);
        y += 25;

        // === SEVERITY DISTRIBUTION BAR ===
        y = drawSectionHeader(y, 'Severity Distribution');
        const sevTotal = severity.K + severity.A + severity.B + severity.C + severity.O;
        if (sevTotal > 0) {
            const barWidth = contentWidth - 20;
            const barHeight = 10;
            let barX = margin;
            const segments = [
                { key: 'K', count: severity.K, color: sevColors.K, label: 'Fatal' },
                { key: 'A', count: severity.A, color: sevColors.A, label: 'Serious' },
                { key: 'B', count: severity.B, color: sevColors.B, label: 'Minor' },
                { key: 'C', count: severity.C, color: sevColors.C, label: 'Possible' },
                { key: 'O', count: severity.O, color: sevColors.O, label: 'PDO' }
            ];
            segments.forEach(seg => {
                if (seg.count > 0) {
                    const segWidth = (seg.count / sevTotal) * barWidth;
                    doc.setFillColor(...seg.color);
                    doc.rect(barX, y, segWidth, barHeight, 'F');
                    barX += segWidth;
                }
            });
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.rect(margin, y, barWidth, barHeight, 'S');
            y += barHeight + 5;

            let legendX = margin;
            doc.setFontSize(7);
            segments.forEach(seg => {
                if (seg.count > 0) {
                    doc.setFillColor(...seg.color);
                    doc.rect(legendX, y, 5, 3, 'F');
                    doc.setTextColor(...themeColors.text);
                    doc.text(seg.label + ': ' + seg.count, legendX + 7, y + 2.5);
                    legendX += 32;
                }
            });
            y += 12;
        }

        // === CRASH METRICS TABLE ===
        y = drawSectionHeader(y, 'Crash Metrics Summary');
        doc.autoTable({
            startY: y,
            head: [['Metric', 'Value']],
            body: [
                ['Total Crashes', allCrashes.length.toLocaleString()],
                ['Fatal (K)', severity.K.toString()],
                ['Serious Injury (A)', severity.A.toString()],
                ['Moderate Injury (B)', severity.B.toString()],
                ['Minor Injury (C)', severity.C.toString()],
                ['PDO (O)', severity.O.toString()],
                ['EPDO Score', epdo.toLocaleString()],
                ['KA Rate', kaRate],
                ['At Intersection', intCount + ' (' + (intCount / total * 100).toFixed(1) + '%)'],
                ['Nighttime', nightCount + ' (' + (nightCount / total * 100).toFixed(1) + '%)']
            ],
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: themeColors.primary, textColor: 255 },
            alternateRowStyles: { fillColor: themeColors.lightGray },
            columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 50, halign: 'right', fontStyle: 'bold' } }
        });
        y = doc.lastAutoTable.finalY + 12;

        // === CONTRIBUTING FACTORS ===
        if (y > 220) { doc.addPage(); y = 20; }
        y = drawSectionHeader(y, 'Contributing Factors');
        doc.autoTable({
            startY: y,
            head: [['Factor', 'Count', 'Percentage']],
            body: [
                ['Alcohol-Related', alcoholCount, (alcoholCount / total * 100).toFixed(1) + '%'],
                ['Speed-Related', speedCount, (speedCount / total * 100).toFixed(1) + '%'],
                ['Distracted Driving', distractedCount, (distractedCount / total * 100).toFixed(1) + '%'],
                ['Hit-and-Run', hitrunCount, (hitrunCount / total * 100).toFixed(1) + '%'],
                ['Nighttime', nightCount, (nightCount / total * 100).toFixed(1) + '%'],
                ['At Intersection', intCount, (intCount / total * 100).toFixed(1) + '%']
            ],
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: themeColors.primary, textColor: 255 },
            alternateRowStyles: { fillColor: themeColors.lightGray },
            columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 25, halign: 'center' }, 2: { cellWidth: 30, halign: 'center' } }
        });
        y = doc.lastAutoTable.finalY + 12;

        // === TOP COLLISION TYPES ===
        if (y > 200) { doc.addPage(); y = 20; }
        y = drawSectionHeader(y, 'Top Collision Types');
        const collisionData = Object.entries(byCollision)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([type, count]) => [type, count, (count / total * 100).toFixed(1) + '%']);
        if (collisionData.length > 0) {
            doc.autoTable({
                startY: y,
                head: [['Collision Type', 'Count', 'Percentage']],
                body: collisionData,
                margin: { left: margin, right: margin },
                styles: { fontSize: 9, cellPadding: 2 },
                headStyles: { fillColor: themeColors.primary, textColor: 255 },
                alternateRowStyles: { fillColor: themeColors.lightGray },
                columnStyles: { 0: { cellWidth: 70 }, 1: { cellWidth: 25, halign: 'center' }, 2: { cellWidth: 30, halign: 'center' } }
            });
        }

        // === LOCATION COMPARISON TABLE (if 2+ selected) ===
        if (selected.length >= 2) {
            y = (doc.lastAutoTable ? doc.lastAutoTable.finalY : y) + 12;
            if (y > 200) { doc.addPage(); y = 20; }
            y = drawSectionHeader(y, 'Location Comparison');
            const compData = selected.map(s => [
                s.location.substring(0, 35),
                s.total.toString(),
                s.K.toString(),
                s.A.toString(),
                (s.K + s.A).toString(),
                s.epdo.toLocaleString(),
                (s.intPct || 0) + '%',
                (s.nightPct || 0) + '%'
            ]);
            doc.autoTable({
                startY: y,
                head: [['Location', 'Total', 'K', 'A', 'K+A', 'EPDO', 'Int%', 'Night%']],
                body: compData,
                margin: { left: margin, right: margin },
                styles: { fontSize: 8.5, cellPadding: 2 },
                headStyles: { fillColor: themeColors.secondary, textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: themeColors.lightGray },
                columnStyles: {
                    0: { cellWidth: 45 },
                    1: { halign: 'center', cellWidth: 16 },
                    2: { halign: 'center', cellWidth: 12 },
                    3: { halign: 'center', cellWidth: 12 },
                    4: { halign: 'center', cellWidth: 16, fontStyle: 'bold' },
                    5: { halign: 'center', cellWidth: 20, fontStyle: 'bold' },
                    6: { halign: 'center', cellWidth: 16 },
                    7: { halign: 'center', cellWidth: 16 }
                },
                didParseCell: function(cellData) {
                    if (cellData.section === 'body' && cellData.column.index === 4) {
                        const val = parseInt(cellData.cell.raw);
                        if (val > 0) cellData.cell.styles.textColor = [220, 53, 69];
                    }
                }
            });
        }

        // === FOOTER ON ALL PAGES ===
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.3);
            doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
            doc.setFontSize(7);
            doc.setTextColor(120, 120, 120);
            doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 12);
            doc.text(generatedDate, pageWidth / 2, pageHeight - 12, { align: 'center' });
            doc.text('Page ' + i + ' of ' + totalPages, pageWidth - margin, pageHeight - 12, { align: 'right' });
        }

        doc.save(`bicycle_analysis_${dateStamp}.pdf`);
        hideLoading();
    } catch (e) {
        hideLoading();
        alert('Error generating PDF: ' + e.message);
    }
}

function exportBikeDetailKML() {
    const selected = bikeAnalysisState.selectedLocations;
    if (!selected.length) { alert('No locations selected'); return; }

    const allCrashes = selected.flatMap(s => s.crashes);
    if (!allCrashes.length) { alert('No crash data to export'); return; }

    const title = `Bicycle Analysis - ${selected.length} Locations, ${allCrashes.length} Crashes`;
    const description = `Locations: ${selected.map(s => s.location).join(', ')}`;
    const kml = generateKML(allCrashes, { title, description });
    downloadKML(kml, `bicycle_detail_${new Date().toISOString().split('T')[0]}`);
}

function exportBikeLocationsCSV() {
    const locations = bikeAnalysisState.allLocations;
    if (!locations.length) { alert('Run analysis first'); return; }

    const rows = [
        ['Bicycle High-Crash Location Analysis'],
        [`Generated: ${new Date().toLocaleDateString()}`],
        [],
        ['Rank', 'Location', 'Total', 'K', 'A', 'B', 'C', 'O', 'EPDO', 'Intersection%', 'Nighttime%'],
        ...locations.map((d, i) => [
            i + 1,
            d.location,
            d.total,
            d.K,
            d.A,
            d.B,
            d.C,
            d.O,
            d.epdo,
            d.intPct !== undefined ? d.intPct + '%' : 'N/A',
            d.nightPct !== undefined ? d.nightPct + '%' : 'N/A'
        ])
    ];

    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, `bicycle_locations_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

function exportBikeLocationsPDF() {
    const locations = bikeAnalysisState.allLocations;
    if (!locations.length) { alert('Run analysis first'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const themeColors = { primary: [5, 150, 105], secondary: [16, 185, 129] };
    const sevColors = SELECTION_PDF_STYLES.severityColors;
    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateStamp = new Date().toISOString().split('T')[0];
    // Period must reflect the Bicycle tab's own date filter (bikeStartDate /
    // bikeEndDate), not the full data range. Falls back to crashState.years.
    const yearRange = resolveReportPeriod('bikeStartDate', 'bikeEndDate');

    const bike = crashState.aggregates.bike;
    const bikeEPDO = calcEPDO(bike);
    const kaCount = bike.K + bike.A;

    // Helper: draw KPI card
    function drawKPI(x, yPos, width, label, value, color) {
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(x, yPos, width, 26, 2, 2, 'F');
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, yPos, width, 26, 2, 2, 'S');
        doc.setFillColor(...color);
        doc.rect(x, yPos, width, 3, 'F');
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...color);
        doc.text(String(value), x + width / 2, yPos + 14, { align: 'center' });
        doc.setFont(undefined, 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text(label, x + width / 2, yPos + 22, { align: 'center' });
        doc.setTextColor(0, 0, 0);
    }

    // === COVER HEADER ===
    doc.setFillColor(...themeColors.primary);
    doc.rect(0, 0, pageWidth, 42, 'F');
    doc.setFillColor(...themeColors.secondary);
    doc.rect(0, 34, pageWidth, 8, 'F');

    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('CRASH LENS', margin, 16);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Bicycle High-Crash Locations Report', margin, 26);
    doc.setFontSize(11);
    doc.text(locations.length + ' Ranked Locations', margin, 37);

    // Info box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 51, 51);
    doc.text('Locations: ' + locations.length, pageWidth - margin - 62, 13);
    doc.text('Period: ' + yearRange, pageWidth - margin - 62, 20);
    doc.text('Total Bike Crashes: ' + bike.total.toLocaleString(), pageWidth - margin - 62, 27);
    doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

    let y = 52;

    // === KPI CARDS ===
    const kpiWidth = (contentWidth - 15) / 4;
    drawKPI(margin, y, kpiWidth, 'TOTAL BIKE CRASHES', bike.total.toLocaleString(), themeColors.primary);
    drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'FATAL (K)', bike.K, [220, 53, 69]);
    drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'FATAL + SERIOUS', kaCount, [253, 126, 20]);
    drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'EPDO SCORE', bikeEPDO.toLocaleString(), [124, 58, 237]);

    y += 34;

    // === SEVERITY DISTRIBUTION BAR ===
    doc.setFontSize(13);
    doc.setTextColor(...themeColors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('Severity Distribution', margin, y + 5);
    doc.setFont(undefined, 'normal');
    doc.setDrawColor(...themeColors.secondary);
    doc.setLineWidth(0.7);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);
    doc.setTextColor(0, 0, 0);
    y += 14;

    const sevOrder = [
        { code: 'K', count: bike.K, color: sevColors.K, label: 'Fatal' },
        { code: 'A', count: bike.A, color: sevColors.A, label: 'Serious' },
        { code: 'B', count: bike.B, color: sevColors.B, label: 'Minor' },
        { code: 'C', count: bike.C, color: sevColors.C, label: 'Possible' },
        { code: 'O', count: bike.O, color: sevColors.O, label: 'PDO' }
    ];
    let barX = margin;
    const barHeight = 8;
    sevOrder.forEach(s => {
        if (s.count > 0 && bike.total > 0) {
            const segWidth = (s.count / bike.total) * contentWidth;
            doc.setFillColor(...s.color);
            doc.rect(barX, y, Math.max(segWidth, 2), barHeight, 'F');
            if (segWidth > 12) {
                doc.setFontSize(6.5);
                doc.setTextColor(255, 255, 255);
                doc.setFont(undefined, 'bold');
                doc.text(s.code + ':' + s.count, barX + segWidth / 2, y + 5.5, { align: 'center' });
            }
            barX += segWidth;
        }
    });
    doc.setFont(undefined, 'normal');
    doc.setTextColor(0, 0, 0);
    y += barHeight + 4;

    // Legend
    let legendX = margin;
    doc.setFontSize(7);
    sevOrder.forEach(s => {
        if (s.count > 0) {
            doc.setFillColor(...s.color);
            doc.rect(legendX, y, 5, 3, 'F');
            doc.setTextColor(51, 51, 51);
            const pctStr = bike.total > 0 ? (s.count / bike.total * 100).toFixed(1) + '%' : '0%';
            doc.text(s.label + ': ' + s.count + ' (' + pctStr + ')', legendX + 7, y + 2.5);
            legendX += 36;
        }
    });
    y += 12;

    // === SECTION HEADER ===
    doc.setFontSize(13);
    doc.setTextColor(...themeColors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('Ranked Bicycle Crash Locations', margin, y + 5);
    doc.setFont(undefined, 'normal');
    doc.setDrawColor(...themeColors.secondary);
    doc.setLineWidth(0.7);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);
    doc.setTextColor(0, 0, 0);
    y += 14;

    // === TABLE ===
    const tableBody = locations.map((d, i) => [
        (i + 1).toString(),
        d.location.substring(0, 35),
        d.total.toString(),
        d.K.toString(),
        d.A.toString(),
        (d.K + d.A).toString(),
        d.B.toString(),
        d.C.toString(),
        d.O.toString(),
        d.epdo.toLocaleString(),
        d.intPct !== undefined ? d.intPct + '%' : 'N/A',
        d.nightPct !== undefined ? d.nightPct + '%' : 'N/A'
    ]);

    doc.autoTable({
        startY: y,
        head: [['#', 'Location', 'Total', 'K', 'A', 'K+A', 'B', 'C', 'O', 'EPDO', 'Int%', 'Night%']],
        body: tableBody,
        margin: { left: margin, right: margin },
        headStyles: { fillColor: themeColors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 7.5 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 40 },
            2: { cellWidth: 14, halign: 'center' },
            3: { cellWidth: 10, halign: 'center' },
            4: { cellWidth: 10, halign: 'center' },
            5: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
            6: { cellWidth: 10, halign: 'center' },
            7: { cellWidth: 10, halign: 'center' },
            8: { cellWidth: 10, halign: 'center' },
            9: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
            10: { cellWidth: 14, halign: 'center' },
            11: { cellWidth: 14, halign: 'center' }
        },
        didParseCell: function(data) {
            if (data.section === 'body' && data.column.index === 5) {
                const val = parseInt(data.cell.raw);
                if (val > 0) data.cell.styles.textColor = [220, 53, 69];
            }
            if (data.section === 'body' && data.column.index === 3) {
                const val = parseInt(data.cell.raw);
                if (val > 0) { data.cell.styles.textColor = [220, 53, 69]; data.cell.styles.fontStyle = 'bold'; }
            }
            if (data.section === 'body') {
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

    // === FOOTER ON ALL PAGES ===
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        doc.text('Generated by ' + getReportAttribution(), margin, pageHeight - 12);
        doc.text(generatedDate, pageWidth / 2, pageHeight - 12, { align: 'center' });
        doc.text('Page ' + i + ' of ' + totalPages, pageWidth - margin, pageHeight - 12, { align: 'right' });
    }

    doc.save(`bicycle_locations_${dateStamp}.pdf`);
}

function updateBikeLocationTypeChart(crashes) {
    let intCount = 0, nonIntCount = 0;
    crashes.forEach(c => {
        if (isIntersection(c)) intCount++;
        else nonIntCount++;
    });

    createChart('chartBikeLocationType', 'doughnut', {
        labels: ['At Intersection', 'Non-Intersection'],
        datasets: [{ data: [intCount, nonIntCount], backgroundColor: ['#059669', '#94a3b8'], borderWidth: 2, borderColor: '#fff' }]
    }, { cutout: '50%', plugins: { legend: { display: false } } });

    const total = crashes.length || 1;
    document.getElementById('bikeLocationTypeLegend').innerHTML = `
        <div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:#059669;border-radius:2px"></span>
            <span style="flex:1">Intersection</span>
            <span style="font-weight:600">${intCount}</span>
            <span style="color:#64748b">(${(intCount/total*100).toFixed(1)}%)</span>
        </div>
        <div style="display:flex;align-items:center;gap:.5rem">
            <span style="width:12px;height:12px;background:#94a3b8;border-radius:2px"></span>
            <span style="flex:1">Non-Intersection</span>
            <span style="font-weight:600">${nonIntCount}</span>
            <span style="color:#64748b">(${(nonIntCount/total*100).toFixed(1)}%)</span>
        </div>
    `;
}
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.pedbike=CL.pedbike||{};
  CL.pedbike.bikeExport=CL.pedbike.bikeExport||{};
  window.exportBikeCrashesToKML=exportBikeCrashesToKML; CL.pedbike.bikeExport.exportBikeCrashesToKML=exportBikeCrashesToKML;
  window.setBikeViewMode=setBikeViewMode; CL.pedbike.bikeExport.setBikeViewMode=setBikeViewMode;
  window.exportBikeDetailCSV=exportBikeDetailCSV; CL.pedbike.bikeExport.exportBikeDetailCSV=exportBikeDetailCSV;
  window.exportBikeDetailPDF=exportBikeDetailPDF; CL.pedbike.bikeExport.exportBikeDetailPDF=exportBikeDetailPDF;
  window.exportBikeDetailKML=exportBikeDetailKML; CL.pedbike.bikeExport.exportBikeDetailKML=exportBikeDetailKML;
  window.exportBikeLocationsCSV=exportBikeLocationsCSV; CL.pedbike.bikeExport.exportBikeLocationsCSV=exportBikeLocationsCSV;
  window.exportBikeLocationsPDF=exportBikeLocationsPDF; CL.pedbike.bikeExport.exportBikeLocationsPDF=exportBikeLocationsPDF;
  window.updateBikeLocationTypeChart=updateBikeLocationTypeChart; CL.pedbike.bikeExport.updateBikeLocationTypeChart=updateBikeLocationTypeChart;
  CL._registerModule('pedbike/pedbike-tab-bike-export');
})();
