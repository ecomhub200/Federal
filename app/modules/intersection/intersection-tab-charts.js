/** CL intersection.tab (charts) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/17-v2-intersection-tab.md + MODULAR_PLAN_PROMPT_17-v2_VERIFY.md.
 *  Verbatim. No behavior change. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L55879-L56286) ───
// Initialize charts
function initIntDetailCharts() {
    const data = intDetailState.aggregatedData;
    if (!data) return;
    Object.values(intDetailState.charts).forEach(chart => { if (chart && typeof chart.destroy === 'function') chart.destroy(); });
    intDetailState.charts = {};
    if (intDetailState.viewMode === 'combined') initIntCombinedCharts(data);
    else initIntCompareCharts(data);
}

function initIntCombinedCharts(data) {
    const peakHours = intDetailState.peakHours;
    const years = Object.keys(data.byYear).sort();

    const yearCtx = document.getElementById('intDetailYearChart');
    if (yearCtx) {
        intDetailState.charts.year = new Chart(yearCtx, { type: 'bar', data: { labels: years, datasets: [{ label: 'Total', data: years.map(y => data.byYear[y]?.total || 0), backgroundColor: '#0891b2', borderRadius: 4 }, { label: 'K+A', data: years.map(y => (data.byYear[y]?.K || 0) + (data.byYear[y]?.A || 0)), backgroundColor: '#dc2626', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 10 } } } }, scales: { y: { beginAtZero: true } } } });
    }

    renderIntMonthlyHeatmap(data);

    const peakCtx = document.getElementById('intDetailPeakChart');
    if (peakCtx) {
        const periods = [`AM`, `Midday`, `PM`, 'Night'];
        const periodData = [data.byPeakPeriod.am, data.byPeakPeriod.midday, data.byPeakPeriod.pm, data.byPeakPeriod.night];
        intDetailState.charts.peak = new Chart(peakCtx, { type: 'bar', data: { labels: periods, datasets: [{ label: 'Crashes', data: periodData, backgroundColor: ['#f59e0b', '#3b82f6', '#ef4444', '#1e293b'], borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    const dowCtx = document.getElementById('intDetailDOWChart');
    if (dowCtx) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        intDetailState.charts.dow = new Chart(dowCtx, { type: 'bar', data: { labels: days, datasets: [{ label: 'Crashes', data: days.map((_, i) => data.byDOW[i] || 0), backgroundColor: '#0891b2', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    const firstHarmfulCtx = document.getElementById('intDetailFirstHarmfulChart');
    if (firstHarmfulCtx) {
        const events = Object.entries(data.byFirstHarmful).sort((a, b) => b[1] - a[1]).slice(0, 8);
        intDetailState.charts.firstHarmful = new Chart(firstHarmfulCtx, { type: 'bar', data: { labels: events.map(e => e[0].substring(0, 20)), datasets: [{ label: 'Crashes', data: events.map(e => e[1]), backgroundColor: '#7c3aed', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } } });
    }

    const sevCtx = document.getElementById('intDetailSeverityChart');
    if (sevCtx) {
        const sevColors = ['#dc2626', '#ea580c', '#eab308', '#22c55e', '#64748b'];
        intDetailState.charts.severity = new Chart(sevCtx, { type: 'doughnut', data: { labels: ['Fatal (K)', 'Serious (A)', 'Minor (B)', 'Possible (C)', 'PDO (O)'], datasets: [{ data: [data.severity.K, data.severity.A, data.severity.B, data.severity.C, data.severity.O], backgroundColor: sevColors, borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } } });
    }

    const weatherCtx = document.getElementById('intDetailWeatherChart');
    if (weatherCtx) {
        const weather = Object.entries(data.byWeather).sort((a, b) => b[1] - a[1]).slice(0, 6);
        intDetailState.charts.weather = new Chart(weatherCtx, { type: 'doughnut', data: { labels: weather.map(w => w[0].substring(0, 15)), datasets: [{ data: weather.map(w => w[1]), backgroundColor: ['#0ea5e9', '#64748b', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'], borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } } });
    }

    const lightCtx = document.getElementById('intDetailLightChart');
    if (lightCtx) {
        const light = Object.entries(data.byLight).sort((a, b) => b[1] - a[1]).slice(0, 6);
        intDetailState.charts.light = new Chart(lightCtx, { type: 'doughnut', data: { labels: light.map(l => l[0].substring(0, 15)), datasets: [{ data: light.map(l => l[1]), backgroundColor: ['#fcd34d', '#1e293b', '#94a3b8', '#f97316', '#6366f1', '#14b8a6'], borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '50%', plugins: { legend: { position: 'right', labels: { font: { size: 9 } } } } } });
    }

    const surfaceCtx = document.getElementById('intDetailSurfaceChart');
    if (surfaceCtx) {
        const surface = Object.entries(data.bySurface).sort((a, b) => b[1] - a[1]).slice(0, 5);
        intDetailState.charts.surface = new Chart(surfaceCtx, { type: 'bar', data: { labels: surface.map(s => s[0].substring(0, 15)), datasets: [{ label: 'Crashes', data: surface.map(s => s[1]), backgroundColor: '#059669', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    const ctrlStatusCtx = document.getElementById('intDetailCtrlStatusChart');
    if (ctrlStatusCtx) {
        const status = Object.entries(data.byCtrlStatus).sort((a, b) => b[1] - a[1]).slice(0, 5);
        intDetailState.charts.ctrlStatus = new Chart(ctrlStatusCtx, { type: 'bar', data: { labels: status.map(s => s[0].substring(0, 15)), datasets: [{ label: 'Crashes', data: status.map(s => s[1]), backgroundColor: '#0284c7', borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }
}

function renderIntMonthlyHeatmap(data) {
    const container = document.getElementById('intDetailMonthlyHeatmap');
    if (!container) return;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const years = [...new Set(Object.keys(data.byMonth).map(k => k.split('-')[0]))].sort();
    if (years.length === 0) { container.innerHTML = '<div style="text-align:center;color:#64748b;font-size:.8rem">No monthly data available</div>'; return; }

    const maxCount = Math.max(...Object.values(data.byMonth), 1);
    let html = '<div class="int-heatmap-labels">' + months.map(m => `<div class="int-heatmap-label">${m}</div>`).join('') + '</div>';

    years.forEach(year => {
        html += `<div style="display:flex;align-items:center;gap:4px;margin-bottom:3px"><div style="width:35px;font-size:.65rem;color:#64748b;text-align:right">${year}</div><div class="int-monthly-heatmap" style="flex:1">`;
        for (let m = 0; m < 12; m++) {
            const key = `${year}-${String(m + 1).padStart(2, '0')}`;
            const count = data.byMonth[key] || 0;
            const intensity = count / maxCount;
            const bg = count === 0 ? '#f1f5f9' : `rgba(8, 145, 178, ${0.2 + intensity * 0.8})`;
            const textColor = intensity > 0.5 ? '#fff' : '#1e293b';
            html += `<div class="int-heatmap-cell" style="background:${bg};color:${textColor}" title="${months[m]} ${year}: ${count} crashes">${count}</div>`;
        }
        html += '</div></div>';
    });
    container.innerHTML = html;
}

function initIntCompareCharts(data) {
    const locations = intDetailState.selectedLocations;
    const colors = ['#0891b2', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

    const locCtx = document.getElementById('intCompareLocationChart');
    if (locCtx) {
        intDetailState.charts.compareLocation = new Chart(locCtx, { type: 'bar', data: { labels: locations.map(l => formatNodeId(l.node).substring(0, 15)), datasets: [{ label: 'Crashes', data: locations.map(l => data.byLocation[l.node]?.total || 0), backgroundColor: colors, borderRadius: 4 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } } });
    }

    const sevCtx = document.getElementById('intCompareSeverityChart');
    if (sevCtx) {
        const sevLabels = ['K', 'A', 'B', 'C', 'O'];
        intDetailState.charts.compareSeverity = new Chart(sevCtx, { type: 'bar', data: { labels: sevLabels, datasets: locations.map((loc, i) => ({ label: formatNodeId(loc.node).substring(0, 12), data: sevLabels.map(s => data.byLocation[loc.node]?.severity[s] || 0), backgroundColor: colors[i % 5], borderRadius: 4 })) }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { font: { size: 9 } } } }, scales: { y: { beginAtZero: true } } } });
    }
}

// Export functions
function exportIntDetailCSV() {
    const data = intDetailState.aggregatedData;
    if (!data) { alert('No data to export'); return; }
    const rows = [['Intersection Detailed Analysis Export'], ['Generated', new Date().toLocaleString()], ['Intersections', intDetailState.selectedLocations.map(l => formatNodeId(l.node)).join('; ')], ['Date Range', `${intFilters.startDate || 'All'} to ${intFilters.endDate || 'Present'}`], [], ['SUMMARY METRICS'], ['Total Crashes', data.total], ['Fatal (K)', data.severity.K], ['Serious Injury (A)', data.severity.A], ['Minor Injury (B)', data.severity.B], ['Possible Injury (C)', data.severity.C], ['PDO (O)', data.severity.O], ['EPDO Score', data.epdo], ['KA Rate', ((data.severity.K + data.severity.A) / data.total * 100).toFixed(2) + '%'], [], ['CONTRIBUTING FACTORS'], ['Factor', 'Count', 'Percentage'], ['Alcohol-Related', data.factors.alcohol, (data.factors.alcohol / data.total * 100).toFixed(2) + '%'], ['Speed-Related', data.factors.speed, (data.factors.speed / data.total * 100).toFixed(2) + '%'], ['Distracted', data.factors.distracted, (data.factors.distracted / data.total * 100).toFixed(2) + '%'], ['Drowsy', data.factors.drowsy, (data.factors.drowsy / data.total * 100).toFixed(2) + '%'], ['Drug-Related', data.factors.drug, (data.factors.drug / data.total * 100).toFixed(2) + '%'], ['Hit-and-Run', data.factors.hitrun, (data.factors.hitrun / data.total * 100).toFixed(2) + '%'], [], ['VULNERABLE ROAD USERS'], ['Type', 'Count', 'KA Count'], ['Pedestrian', data.vru.pedestrian.total, data.vru.pedestrian.K + data.vru.pedestrian.A], ['Bicycle', data.vru.bicycle.total, data.vru.bicycle.K + data.vru.bicycle.A], ['Motorcycle', data.vru.motorcycle.total, data.vru.motorcycle.K + data.vru.motorcycle.A], [], ['YEARLY BREAKDOWN'], ['Year', 'Total', 'K', 'A', 'B', 'C', 'O'], ...Object.entries(data.byYear).sort((a, b) => a[0] - b[0]).map(([year, d]) => [year, d.total, d.K, d.A, d.B, d.C, d.O]), [], ['COLLISION TYPES'], ['Type', 'Count'], ...Object.entries(data.byCollision).sort((a, b) => b[1] - a[1]).map(([type, count]) => [type, count]), [], ['FIRST HARMFUL EVENTS'], ['Event', 'Count'], ...Object.entries(data.byFirstHarmful).sort((a, b) => b[1] - a[1]).map(([event, count]) => [event, count])];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, `intersection_detail_analysis_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
}

function exportIntDetailPDF() {
    const data = intDetailState.aggregatedData;
    if (!data) { alert('No data to export'); return; }

    showLoading('Generating Intersection Detailed Analysis PDF...');

    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        const contentWidth = pageWidth - (margin * 2);

        const themeColors = {
            primary: [8, 145, 178],
            secondary: [6, 182, 212],
            fatal: [220, 53, 69],
            serious: [253, 126, 20],
            moderate: [255, 193, 7],
            minor: [23, 162, 184],
            success: [22, 163, 74],
            gray: [100, 116, 139],
            lightGray: [248, 250, 252],
            text: [51, 51, 51]
        };
        const sevColors = SELECTION_PDF_STYLES.severityColors;

        const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const dateStamp = new Date().toISOString().split('T')[0];
        const total = data.total || 1;
        const kaCount = data.severity.K + data.severity.A;
        const kaRate = (kaCount / total * 100).toFixed(1) + '%';
        const vruTotal = data.vru.pedestrian.total + data.vru.bicycle.total + data.vru.motorcycle.total;

        const locationNames = intDetailState.selectedLocations.map(l => formatNodeId(l.node));
        const locationLabel = locationNames.length === 1 ? locationNames[0] : locationNames.length + ' Intersections';

        const filterText = intFilters.startDate || intFilters.endDate
            ? `${intFilters.startDate || 'Start'} to ${intFilters.endDate || 'Present'}`
            : 'All Data';

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
        doc.text('Intersection Detailed Analysis Report', margin, 26);
        doc.setFontSize(11);
        doc.text(locationLabel, margin, 37);

        // Info box
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
        doc.setFontSize(7.5);
        doc.setTextColor(51, 51, 51);
        doc.text('Crashes: ' + data.total.toLocaleString(), pageWidth - margin - 62, 13);
        doc.text('Period: ' + filterText, pageWidth - margin - 62, 20);
        doc.text('Intersections: ' + locationNames.length, pageWidth - margin - 62, 27);
        doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

        let y = 52;

        // === KPI CARDS ===
        const kpiWidth = (contentWidth - 15) / 4;
        drawKPI(margin, y, kpiWidth, 'TOTAL CRASHES', data.total.toLocaleString(), themeColors.primary);
        drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'EPDO SCORE', data.epdo.toLocaleString(), [124, 58, 237]);
        drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'FATAL + SERIOUS', kaCount, themeColors.fatal);
        drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'KA RATE', kaRate, themeColors.success);

        y += 34;

        // === LOCATION INFO BOX ===
        doc.setFillColor(...themeColors.lightGray);
        doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(...themeColors.primary);
        doc.text('Selected Intersection(s):', margin + 5, y + 7);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(...themeColors.text);
        const locText = locationNames.length > 3
            ? locationNames.slice(0, 3).join(', ') + ' (+' + (locationNames.length - 3) + ' more)'
            : locationNames.join(', ');
        doc.text(locText.substring(0, 80), margin + 5, y + 13);
        y += 25;

        // === SEVERITY DISTRIBUTION BAR ===
        y = drawSectionHeader(y, 'Severity Distribution');
        const sevTotal = data.severity.K + data.severity.A + data.severity.B + data.severity.C + data.severity.O;
        if (sevTotal > 0) {
            const barWidth = contentWidth - 20;
            const barHeight = 10;
            let barX = margin;
            const segments = [
                { key: 'K', count: data.severity.K, color: sevColors.K, label: 'Fatal' },
                { key: 'A', count: data.severity.A, color: sevColors.A, label: 'Serious' },
                { key: 'B', count: data.severity.B, color: sevColors.B, label: 'Minor' },
                { key: 'C', count: data.severity.C, color: sevColors.C, label: 'Possible' },
                { key: 'O', count: data.severity.O, color: sevColors.O, label: 'PDO' }
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
                ['Total Crashes', data.total.toLocaleString()],
                ['Fatal (K)', data.severity.K.toString()],
                ['Serious Injury (A)', data.severity.A.toString()],
                ['Moderate Injury (B)', data.severity.B.toString()],
                ['Minor Injury (C)', data.severity.C.toString()],
                ['PDO (O)', data.severity.O.toString()],
                ['EPDO Score', data.epdo.toLocaleString()],
                ['KA Rate', kaRate]
            ],
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: themeColors.primary, textColor: 255 },
            alternateRowStyles: { fillColor: themeColors.lightGray },
            columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 40, halign: 'right', fontStyle: 'bold' } }
        });
        y = doc.lastAutoTable.finalY + 12;

        // === CONTRIBUTING FACTORS ===
        if (y > 220) { doc.addPage(); y = 20; }
        y = drawSectionHeader(y, 'Contributing Factors');
        doc.autoTable({
            startY: y,
            head: [['Factor', 'Count', 'Percentage']],
            body: [
                ['Alcohol-Related', data.factors.alcohol, (data.factors.alcohol / total * 100).toFixed(1) + '%'],
                ['Speed-Related', data.factors.speed, (data.factors.speed / total * 100).toFixed(1) + '%'],
                ['Distracted Driving', data.factors.distracted, (data.factors.distracted / total * 100).toFixed(1) + '%'],
                ['Drowsy Driving', data.factors.drowsy || 0, ((data.factors.drowsy || 0) / total * 100).toFixed(1) + '%'],
                ['Drug-Related', data.factors.drug || 0, ((data.factors.drug || 0) / total * 100).toFixed(1) + '%'],
                ['Hit-and-Run', data.factors.hitrun, (data.factors.hitrun / total * 100).toFixed(1) + '%']
            ],
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: themeColors.primary, textColor: 255 },
            alternateRowStyles: { fillColor: themeColors.lightGray },
            columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 25, halign: 'center' }, 2: { cellWidth: 30, halign: 'center' } }
        });
        y = doc.lastAutoTable.finalY + 12;

        // === VULNERABLE ROAD USERS ===
        if (y > 220) { doc.addPage(); y = 20; }
        y = drawSectionHeader(y, 'Vulnerable Road Users');
        doc.autoTable({
            startY: y,
            head: [['User Type', 'Total Crashes', 'Fatal + Serious']],
            body: [
                ['Pedestrian', data.vru.pedestrian.total, data.vru.pedestrian.K + data.vru.pedestrian.A],
                ['Bicycle', data.vru.bicycle.total, data.vru.bicycle.K + data.vru.bicycle.A],
                ['Motorcycle', data.vru.motorcycle.total, data.vru.motorcycle.K + data.vru.motorcycle.A]
            ],
            margin: { left: margin, right: margin },
            styles: { fontSize: 9, cellPadding: 2 },
            headStyles: { fillColor: themeColors.secondary, textColor: 255 },
            alternateRowStyles: { fillColor: themeColors.lightGray },
            columnStyles: { 0: { cellWidth: 50 }, 1: { cellWidth: 35, halign: 'center' }, 2: { cellWidth: 35, halign: 'center' } }
        });
        y = doc.lastAutoTable.finalY + 12;

        // === TOP COLLISION TYPES ===
        if (y > 200) { doc.addPage(); y = 20; }
        y = drawSectionHeader(y, 'Top Collision Types');
        const collisionData = Object.entries(data.byCollision)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([type, count]) => [type, count, (count / total * 100).toFixed(1) + '%']);
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

        doc.save(`intersection_detail_analysis_${dateStamp}.pdf`);
        hideLoading();
    } catch (e) {
        hideLoading();
        alert('Error generating PDF: ' + e.message);
    }
}

function exportIntDetailKML() {
    const data = intDetailState.aggregatedData;
    if (!data || data.crashes.length === 0) { alert('No data to export'); return; }
    const title = `Intersection Analysis: ${intDetailState.selectedLocations.map(l => formatNodeId(l.node)).join(', ')}`;
    const description = `${data.total} crashes, EPDO: ${data.epdo}`;
    const kmlContent = generateKML(data.crashes, { title, description });
    downloadKML(kmlContent, `intersection_detail_${new Date().toISOString().split('T')[0]}.kml`);
}

// Hook into filter changes for auto-update
const originalApplyIntersectionFilters = applyIntersectionFilters;
applyIntersectionFilters = function() {
    originalApplyIntersectionFilters();
    if (intDetailState.selectedLocations.length > 0) updateIntDetailPanel();
};
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.intersection=CL.intersection||{};
  CL.intersection.tab=CL.intersection.tab||{};
  window.initIntDetailCharts=initIntDetailCharts; CL.intersection.tab.initIntDetailCharts=initIntDetailCharts;
  window.initIntCombinedCharts=initIntCombinedCharts; CL.intersection.tab.initIntCombinedCharts=initIntCombinedCharts;
  window.renderIntMonthlyHeatmap=renderIntMonthlyHeatmap; CL.intersection.tab.renderIntMonthlyHeatmap=renderIntMonthlyHeatmap;
  window.initIntCompareCharts=initIntCompareCharts; CL.intersection.tab.initIntCompareCharts=initIntCompareCharts;
  window.exportIntDetailCSV=exportIntDetailCSV; CL.intersection.tab.exportIntDetailCSV=exportIntDetailCSV;
  window.exportIntDetailPDF=exportIntDetailPDF; CL.intersection.tab.exportIntDetailPDF=exportIntDetailPDF;
  window.exportIntDetailKML=exportIntDetailKML; CL.intersection.tab.exportIntDetailKML=exportIntDetailKML;
  CL._registerModule('intersection/intersection-tab-charts');
})();
