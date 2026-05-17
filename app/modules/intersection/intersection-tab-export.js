/** CL intersection.tab (export) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md + MODULAR_PLAN_PROMPT_17-v2_VERIFY.md.
 *  Verbatim. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L54970-L55377) ───
// Export intersection analysis to PDF
async function exportIntersectionPDF() {
    const data = getFilteredIntersectionData();
    let int = data.intersection;
    let total = data.totalRows;

    // Bug 14c — at aggregate tiers sampleRows is empty so getFilteredIntersectionData()
    // returns int.total=0 even though the on-screen charts (sourced from
    // mv_intersection_summary) have data. Pull KPIs from the same matview the
    // charts use so the PDF KPIs and charts agree on tier.
    if ((int.total === 0) && window.crashLensClient && window.CL?.data?.supabaseBridge?.resolveTier) {
        try {
            const t = window.CL.data.supabaseBridge.resolveTier();
            const summary = await CL.data.cachedMatview('mv_intersection_summary', t.tier, t.value,
                () => window.crashLensClient.getIntersectionSummary(t.tier, t.value, {}));
            if (Array.isArray(summary) && summary.length > 0) {
                const kpi = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 };
                summary.forEach(r => {
                    if (/not at intersection/i.test(r.intersection_type || '')) return;
                    kpi.total += r.total || 0;
                    kpi.K += r.k || 0; kpi.A += r.a || 0;
                    kpi.B += r.b || 0; kpi.C += r.c || 0; kpi.O += r.o || 0;
                });
                if (kpi.total > 0) {
                    int = kpi;
                    if (!total || total === 0) total = kpi.total;
                    data.intersection = kpi;
                    console.log('[Intersection PDF] KPIs sourced from mv_intersection_summary (tier=' + t.tier + ')');
                }
            }
            // Round 7 (2026-05-09): the Top Locations table on page 2 reads
            // data.byNode (empty in Supabase mode). Populate it from
            // mv_hotspots intersections — the same source the on-screen
            // intersection table uses — so the PDF's Top Locations matches.
            if (!data.byNode || Object.keys(data.byNode).length === 0) {
                const hot = await CL.data.cachedMatview('mv_hotspots', t.tier, t.value,
                    () => window.crashLensClient.getHotspots(t.tier, t.value, { limit: 200 }),
                    { limit: 200 });
                if (hot && Array.isArray(hot.intersections) && hot.intersections.length) {
                    const byNode = {};
                    hot.intersections.forEach(r => {
                        const intName = String(r['Intersection Name'] || r.intersection_name || '').trim();
                        const rteName = String(r['RTE Name'] || r.rte_name || '').trim();
                        const nodeId  = String(r.location_name || '').trim();
                        if (!nodeId || nodeId === '0' || nodeId === '0.0') return;
                        let display;
                        if (rteName && intName)      display = rteName + ' / ' + intName;
                        else if (intName)            display = intName;
                        else if (rteName)            display = rteName;
                        else                          display = nodeId;
                        byNode[display] = {
                            total: r.total_crashes || 0,
                            K: r.k || 0, A: r.a || 0, B: r.b || 0, C: r.c || 0, O: r.o || 0,
                            route: rteName,
                            ctrl: ''
                        };
                    });
                    if (Object.keys(byNode).length) {
                        data.byNode = byNode;
                        console.log('[Intersection PDF] Top Locations hydrated from mv_hotspots ('
                            + Object.keys(byNode).length + ' nodes).');
                    }
                }
            }
        } catch (e) { console.warn('[Intersection PDF] matview KPI fetch failed:', e && e.message); }
    }

    if (int.total === 0) {
        alert('No intersection crash data to export.');
        return;
    }

    showLoading('Generating Intersection Crash PDF Report...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        // Intersection theme colors
        const themeColors = {
            primary: [8, 145, 178],
            secondary: [6, 182, 212],
            fatal: [220, 53, 69],
            serious: [253, 126, 20]
        };
        const sevColors = SELECTION_PDF_STYLES.severityColors;

        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateStamp = new Date().toISOString().split('T')[0];
        // ROUND-8: in Supabase-only mode crashState.years is empty. Fall back
        // to the year range exposed by aggregates (populated from
        // dashboard_summary), then to the matview's own min/max if available,
        // before giving up on "N/A".
        let yearRange = (crashState.years && crashState.years.length > 0)
            ? `${crashState.years[0]} - ${crashState.years[crashState.years.length - 1]}`
            : null;
        if (!yearRange && crashState.aggregates && crashState.aggregates.yearRange) {
            const yr = crashState.aggregates.yearRange;
            if (yr.min && yr.max) yearRange = `${yr.min} - ${yr.max}`;
        }
        if (!yearRange && crashState.aggregates && crashState.aggregates.byYear) {
            const ys = Object.keys(crashState.aggregates.byYear).map(y => parseInt(y, 10)).filter(y => y >= 2000).sort((a, b) => a - b);
            if (ys.length > 0) yearRange = ys[0] + ' - ' + ys[ys.length - 1];
        }
        if (!yearRange) yearRange = 'N/A';
        const intEPDO = calcEPDO(int);
        const kaCount = int.K + int.A;
        const intPct = total > 0 ? (int.total / total * 100).toFixed(1) : '0';
        const nodeSorted = Object.entries(data.byNode).sort((a, b) => b[1].total - a[1].total).slice(0, 50);

        let filterText = 'All Data';
        if (intFilters.startDate || intFilters.endDate) {
            filterText = `${intFilters.startDate || 'Start'} to ${intFilters.endDate || 'Present'}`;
        }
        if (intFilters.trafficCtrl) {
            filterText += ' | Control: ' + intFilters.trafficCtrl;
        }

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

        function drawSectionHeader(y, title) {
            doc.setFontSize(13);
            doc.setTextColor(...themeColors.primary);
            doc.setFont(undefined, 'bold');
            doc.text(title, margin, y + 5);
            doc.setFont(undefined, 'normal');
            doc.setDrawColor(...themeColors.secondary);
            doc.setLineWidth(0.7);
            doc.line(margin, y + 8, margin + contentWidth, y + 8);
            doc.setTextColor(0, 0, 0);
            return y + 14;
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
        doc.text('Intersection Crash Analysis Report', margin, 26);
        doc.setFontSize(11);
        doc.text(getReportAgencyLabel() + ' ' + getReportDeptLabel(), margin, 37);

        // Info box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 51, 51);
        doc.text('Int. Crashes: ' + int.total.toLocaleString(), pageWidth - margin - 62, 13);
        doc.text('Period: ' + (filterText !== 'All Data' ? filterText.substring(0, 24) : yearRange), pageWidth - margin - 62, 20);
        doc.text('Locations: ' + nodeSorted.length, pageWidth - margin - 62, 27);
        doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

        let y = 52;

        // === KPI CARDS ===
        const kpiWidth = (contentWidth - 15) / 4;
        drawKPI(margin, y, kpiWidth, 'INTERSECTION CRASHES', int.total.toLocaleString(), themeColors.primary);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'FATAL + SERIOUS', kaCount, themeColors.fatal);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'EPDO SCORE', intEPDO.toLocaleString(), [124, 58, 237]);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, '% OF ALL CRASHES', intPct + '%', themeColors.secondary);

        y += 34;

        // === SEVERITY DISTRIBUTION BAR ===
        y = drawSectionHeader(y, 'Severity Distribution');
        const barHeight = 8;
        const sevOrder = [
            { code: 'K', count: int.K, color: sevColors.K, label: 'Fatal' },
            { code: 'A', count: int.A, color: sevColors.A, label: 'Serious' },
            { code: 'B', count: int.B, color: sevColors.B, label: 'Minor' },
            { code: 'C', count: int.C, color: sevColors.C, label: 'Possible' },
            { code: 'O', count: int.O, color: sevColors.O, label: 'PDO' }
        ];
        let barX = margin;
        sevOrder.forEach(s => {
            if (s.count > 0) {
                const rawWidth = (s.count / int.total) * contentWidth;
                // ROUND-8: bump the minimum visible width from 2mm to 4mm so
                // tiny K-fractions (e.g. 253 of 77,715 ≈ 0.6mm) actually
                // render as a discernible red sliver instead of disappearing.
                const segWidth = Math.max(rawWidth, 4);
                doc.setFillColor(...s.color);
                doc.rect(barX, y, segWidth, barHeight, 'F');
                if (rawWidth > 12) {
                    doc.setFontSize(6.5);
                    doc.setTextColor(255, 255, 255);
                    doc.setFont(undefined, 'bold');
                    doc.text(s.code + ':' + s.count, barX + segWidth / 2, y + 5.5, { align: 'center' });
                } else if (s.code === 'K') {
                    // ROUND-8: even with the 4mm floor a K segment is too
                    // narrow for an inline label, so pin a callout above the
                    // bar in K's own color. Without this the K severity
                    // count silently vanishes from the visual.
                    doc.setFontSize(6);
                    doc.setTextColor(...s.color);
                    doc.setFont(undefined, 'bold');
                    doc.text(s.code + ':' + s.count, barX + segWidth / 2, y - 1, { align: 'center' });
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
                doc.text(s.label + ': ' + s.count + ' (' + (s.count / int.total * 100).toFixed(1) + '%)', legendX + 7, y + 2.5);
                legendX += 36;
            }
        });
        y += 12;

        // === CHARTS (2x2 grid) ===
        const chartIds = ['chartIntType', 'chartTrafficControl', 'chartIntCollision', 'chartIntYearTrend'];
        const chartTitles = ['Intersection Type', 'Traffic Control', 'Collision Types', 'Year Trend'];
        const chartW = (contentWidth - 5) / 2;
        const chartH = 45;
        let chartCol = 0;
        let chartStartY = y;

        // ROUND-8: when the user generates the PDF without first opening the
        // Intersections tab, the four chart canvases are blank and toDataURL
        // captures empty rectangles. Force-paint them by re-running the tab
        // loader (mv_intersection_summary) and waiting briefly for Chart.js
        // to finish animating before capture.
        try {
            const _intCanvas = document.getElementById('chartIntType');
            const _intBlank = !_intCanvas || (_intCanvas.width <= 1 && _intCanvas.height <= 1);
            if (_intBlank && typeof updateIntersectionTab === 'function') {
                updateIntersectionTab();
                await new Promise(r => setTimeout(r, 500));
            } else if (_intBlank && typeof _loadIntersectionsFromHotspots === 'function') {
                await _loadIntersectionsFromHotspots();
                await new Promise(r => setTimeout(r, 250));
            }
        } catch (chartPrimeErr) {
            console.warn('[Intersection PDF] Chart prime failed:', chartPrimeErr && chartPrimeErr.message);
        }

        for (let i = 0; i < chartIds.length; i++) {
            const canvas = document.getElementById(chartIds[i]);
            if (!canvas) continue;
            try {
                const imgData = canvas.toDataURL('image/png');
                const cx = margin + (chartCol * (chartW + 5));
                doc.setFontSize(8);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(...themeColors.primary);
                doc.text(chartTitles[i], cx, chartStartY);
                doc.addImage(imgData, 'PNG', cx, chartStartY + 2, chartW, chartH);
                chartCol++;
                if (chartCol >= 2) {
                    chartCol = 0;
                    chartStartY += chartH + 10;
                }
            } catch (e) { /* chart capture failed, skip */ }
        }
        if (chartCol === 1) chartStartY += chartH + 10;

        // === PAGE 2: TOP LOCATIONS TABLE ===
        doc.addPage();

        // Mini header
        doc.setFillColor(...themeColors.primary);
        doc.rect(0, 0, pageWidth, 12, 'F');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont(undefined, 'bold');
        doc.text('CRASH LENS', margin, 8);
        doc.setFont(undefined, 'normal');
        doc.text('Intersection Crash Locations', pageWidth - margin, 8, { align: 'right' });
        doc.setTextColor(0, 0, 0);

        y = 18;
        y = drawSectionHeader(y, 'Top Intersection Crash Locations');

        const tableData = nodeSorted.map(([node, d], idx) => [
            (idx + 1).toString(),
            node.substring(0, 30),
            (d.route || '').substring(0, 25),
            d.total.toString(),
            d.K.toString(),
            d.A.toString(),
            (d.K + d.A).toString(),
            calcEPDO(d).toLocaleString(),
            (d.ctrl || '').substring(0, 18)
        ]);

        doc.autoTable({
            startY: y,
            head: [['#', 'Node/Intersection', 'Route', 'Total', 'K', 'A', 'K+A', 'EPDO', 'Control']],
            body: tableData,
            margin: { left: margin, right: margin },
            headStyles: { fillColor: themeColors.primary, textColor: 255, fontStyle: 'bold', fontSize: 8 },
            bodyStyles: { fontSize: 7.5 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            styles: { cellPadding: 2 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 38 },
                2: { cellWidth: 30 },
                3: { cellWidth: 14, halign: 'center' },
                4: { cellWidth: 10, halign: 'center' },
                5: { cellWidth: 10, halign: 'center' },
                6: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
                7: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
                8: { cellWidth: 24 }
            },
            didParseCell: function(cellData) {
                if (cellData.section === 'body' && cellData.column.index === 6) {
                    const val = parseInt(cellData.cell.raw);
                    if (val > 0) cellData.cell.styles.textColor = [220, 53, 69];
                }
                if (cellData.section === 'body' && cellData.column.index === 4) {
                    const val = parseInt(cellData.cell.raw);
                    if (val > 0) { cellData.cell.styles.textColor = [220, 53, 69]; cellData.cell.styles.fontStyle = 'bold'; }
                }
                if (cellData.section === 'body') {
                    const kCol = cellData.row.raw ? cellData.row.raw[4] : null;
                    const aCol = cellData.row.raw ? cellData.row.raw[5] : null;
                    if (kCol && parseInt(kCol) > 0) {
                        cellData.cell.styles.fillColor = [254, 242, 242];
                    } else if (aCol && parseInt(aCol) > 0) {
                        cellData.cell.styles.fillColor = [255, 247, 237];
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

        doc.save(`intersection_crash_report_${dateStamp}.pdf`);
        hideLoading();
    } catch (e) {
        hideLoading();
        alert('Error generating PDF: ' + e.message);
    }
}

// ============================================================
// INTERSECTION DETAILED ANALYSIS PANEL
// ============================================================

// Intersection Detail State Management
const intDetailState = {
    selectedLocations: [],
    viewMode: 'combined',
    charts: {},
    aggregatedData: null,
    countyBenchmarks: null,
    maxSelections: 5,
    bannerShown: false,
    peakHours: {
        am: { start: '06:00', end: '09:00' },
        midday: { start: '09:00', end: '15:00' },
        pm: { start: '15:00', end: '19:00' },
        night: { start: '19:00', end: '06:00' }
    }
};

  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  window.exportIntersectionPDF=exportIntersectionPDF; CL.intersection.tab.exportIntersectionPDF=exportIntersectionPDF;
  window.intDetailState=intDetailState; CL.intersection.tab.intDetailState=intDetailState;
  CL._registerModule('intersection/intersection-tab-export');
})();
