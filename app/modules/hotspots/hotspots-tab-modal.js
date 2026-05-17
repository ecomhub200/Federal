/** CL hotspots.tab (modal) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/16-v2-hotspots-tab.md. No behavior change.
 *  Depends on (script order): analysis/hotspots (math); after hotspots-tab-render. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L54723-L55048) ───
function showLocationModal(loc) {
    // BUG-004 fix: use String() for consistent type comparison
    const locStr = String(loc);
    const crashes = crashState.sampleRows.filter(r => String(r[COL.ROUTE]) === locStr || String(r[COL.NODE]) === locStr);
    const stats = { total: crashes.length, K: 0, A: 0, B: 0, C: 0, O: 0 };
    crashes.forEach(c => { const s = (c[COL.SEVERITY]||'').charAt(0); if(stats[s] !== undefined) stats[s]++; });

    document.getElementById('modalTitle').textContent = loc;
    document.getElementById('modalBody').innerHTML = `
        <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr);margin-bottom:1rem">
            <div class="kpi-card total" style="padding:.75rem"><div class="kpi-value" style="font-size:1.2rem">${stats.total}</div><div class="kpi-label">Total</div></div>
            <div class="kpi-card fatal" style="padding:.75rem"><div class="kpi-value" style="font-size:1.2rem">${stats.K}</div><div class="kpi-label">Fatal</div></div>
            <div class="kpi-card injury-a" style="padding:.75rem"><div class="kpi-value" style="font-size:1.2rem">${stats.A}</div><div class="kpi-label">Serious</div></div>
            <div class="kpi-card injury-bc" style="padding:.75rem"><div class="kpi-value" style="font-size:1.2rem">${stats.B + stats.C}</div><div class="kpi-label">Other Inj</div></div>
            <div class="kpi-card epdo" style="padding:.75rem"><div class="kpi-value" style="font-size:1.2rem">${calcEPDO(stats)}</div><div class="kpi-label">EPDO</div></div>
        </div>
        <h4 style="font-size:.9rem;margin-bottom:.5rem">Recent Crashes</h4>
        <div class="table-wrapper" style="max-height:280px;overflow-y:auto">
            <table class="data-table"><thead><tr><th>Date</th><th>Sev</th><th>Type</th><th>Weather</th><th>Light</th></tr></thead>
            <tbody>${crashes.slice(0,25).map(c => `<tr>
                <td>${c[COL.DATE] || '--'}</td>
                <td><span class="severity-badge severity-${(c[COL.SEVERITY]||'').charAt(0)}">${(c[COL.SEVERITY]||'').charAt(0)}</span></td>
                <td style="font-size:.75rem">${esc((c[COL.COLLISION]||'').substring(0,30))}</td>
                <td style="font-size:.75rem">${esc((c[COL.WEATHER]||'').substring(0,20))}</td>
                <td style="font-size:.75rem">${esc((c[COL.LIGHT]||'').substring(0,20))}</td>
            </tr>`).join('')}</tbody></table>
        </div>
    `;
    document.getElementById('locationModal').classList.add('visible');
}

function zoomToLocation(loc, type) {
    // Get crashes for this location
    const locStr = String(loc);
    const crashes = crashState.sampleRows.filter(row => {
        if (type === 'node') {
            return String(row[COL.NODE]) === locStr;
        } else if (type === 'route') {
            return row[COL.ROUTE] === loc;
        }
        // Fallback: try both
        return row[COL.ROUTE] === loc || String(row[COL.NODE]) === locStr;
    });

    if (crashes.length === 0) {
        alert('No crash data found for this location');
        return;
    }

    // Switch to map tab
    showTab('map');

    // Display crashes on map similar to safety focus
    setTimeout(() => {
        filterMapForLocation(crashes, loc, type);
    }, 300);
}

function filterMapForLocation(crashes, locationName, locationType) {
    // Check if map exists
    if (typeof crashMap === 'undefined' || !crashMap) {
        console.log('Map not initialized');
        return;
    }

    // Clear existing markers
    if (typeof markerCluster !== 'undefined' && markerCluster) {
        markerCluster.clearLayers();
    }

    // Add filtered markers
    const bounds = [];
    crashes.forEach(row => {
        const lat = parseFloat(row[COL.Y]);
        const lng = parseFloat(row[COL.X]);

        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
            const sev = (row[COL.SEVERITY] || '').charAt(0) || 'O';
            const color = { K: '#dc2626', A: '#ea580c', B: '#eab308', C: '#22c55e', O: '#64748b' }[sev] || '#64748b';

            const marker = L.circleMarker([lat, lng], {
                radius: sev === 'K' ? 10 : sev === 'A' ? 8 : 6,
                fillColor: color,
                color: '#fff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            });

            marker.bindPopup(`
                <strong>${row[COL.ROUTE] || 'Unknown'}</strong><br>
                ${row[COL.NODE] ? `Node: ${formatNodeId(row[COL.NODE])}<br>` : ''}
                Date: ${row[COL.DATE] || 'N/A'}<br>
                Severity: <span class="severity-badge severity-${sev}">${sev}</span><br>
                Collision: ${row[COL.COLLISION] || 'N/A'}
            `);

            if (markerCluster) {
                markerCluster.addLayer(marker);
            }
            bounds.push([lat, lng]);
        }
    });

    // Fit map to bounds with appropriate zoom
    if (bounds.length > 0) {
        if (locationType === 'node') {
            // For intersections, zoom in precisely
            const avgLat = bounds.reduce((s, b) => s + b[0], 0) / bounds.length;
            const avgLng = bounds.reduce((s, b) => s + b[1], 0) / bounds.length;
            crashMap.setView([avgLat, avgLng], 17);
        } else {
            // For routes, fit to bounds
            safeFitBounds(crashMap, bounds, { padding: [50, 50], maxZoom: 16 });
        }
    }

    // Show filter badge
    const icon = locationType === 'node' ? '🚦' : '📍';
    showMapFilterBadge(`${icon} ${locationName}`, crashes.length);
}

function exportHotspotsCSV() {
    if (!crashState.hotspots.length) { alert('Run analysis first'); return; }

    // Build filter info header
    let filterInfo = [];
    filterInfo.push(['High-Crash Location Analysis - ' + getJurisdictionLabel()]);
    filterInfo.push([`Generated: ${new Date().toLocaleDateString()}`]);
    if (hotspotFilters.startDate || hotspotFilters.endDate) {
        let dateRange = 'Date Range: ';
        if (hotspotFilters.startDate) dateRange += `From ${hotspotFilters.startDate}`;
        if (hotspotFilters.startDate && hotspotFilters.endDate) dateRange += ' ';
        if (hotspotFilters.endDate) dateRange += `To ${hotspotFilters.endDate}`;
        filterInfo.push([dateRange]);
    }
    filterInfo.push(['']); // Empty row separator

    const csv = [
        ...filterInfo,
        ['Rank','Location','Total','K','A','B','C','O','EPDO','Per Year','Top Type'],
        ...crashState.hotspots.map((h,i) => [i+1, h.loc, h.total, h.K, h.A, h.B, h.C, h.O, h.epdo, h.perYear, h.topType])
    ].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    downloadFile(csv, 'hotspots_analysis.csv', 'text/csv');
}

function exportHotspotsPDF() {
    if (!crashState.hotspots.length) { alert('Run analysis first'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'letter');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const colors = SELECTION_PDF_STYLES.colors;
    const sevColors = SELECTION_PDF_STYLES.severityColors;

    const hotspots = crashState.hotspots;
    const totalCrashes = hotspots.reduce((sum, h) => sum + h.total, 0);
    const totalFatal = hotspots.reduce((sum, h) => sum + h.K, 0);
    const totalSerious = hotspots.reduce((sum, h) => sum + h.A, 0);
    const totalEPDO = hotspots.reduce((sum, h) => sum + h.epdo, 0);

    const generatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dateStamp = new Date().toISOString().split('T')[0];
    const yearRange = crashState.years && crashState.years.length > 0 ? `${crashState.years[0]} - ${crashState.years[crashState.years.length - 1]}` : 'N/A';

    let filterText = 'All Data';
    if (hotspotFilters.startDate || hotspotFilters.endDate) {
        filterText = `${hotspotFilters.startDate || 'Start'} to ${hotspotFilters.endDate || 'Present'}`;
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

    // === COVER HEADER ===
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
    doc.text('High-Crash Location Analysis', margin, 26);
    doc.setFontSize(11);
    doc.text(hotspots.length + ' Ranked Locations', margin, 37);

    // Info box
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - margin - 65, 6, 60, 30, 2, 2, 'F');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 51, 51);
    doc.text('Locations: ' + hotspots.length, pageWidth - margin - 62, 13);
    doc.text('Period: ' + (filterText !== 'All Data' ? filterText : yearRange), pageWidth - margin - 62, 20);
    doc.text('Total Crashes: ' + totalCrashes.toLocaleString(), pageWidth - margin - 62, 27);
    doc.text('Generated: ' + generatedDate, pageWidth - margin - 62, 34);

    let y = 52;

    // === KPI CARDS ===
    const kpiWidth = (contentWidth - 15) / 4;
    drawKPI(margin, y, kpiWidth, 'TOTAL LOCATIONS', hotspots.length, colors.primary);
    drawKPI(margin + kpiWidth + 5, y, kpiWidth, 'TOTAL CRASHES', totalCrashes.toLocaleString(), colors.secondary);
    drawKPI(margin + (kpiWidth + 5) * 2, y, kpiWidth, 'FATAL + SERIOUS', (totalFatal + totalSerious), colors.fatal);
    drawKPI(margin + (kpiWidth + 5) * 3, y, kpiWidth, 'TOTAL EPDO', totalEPDO.toLocaleString(), [124, 58, 237]);

    y += 34;

    // === SECTION HEADER ===
    doc.setFontSize(13);
    doc.setTextColor(...colors.primary);
    doc.setFont(undefined, 'bold');
    doc.text('Ranked High-Crash Locations', margin, y + 5);
    doc.setFont(undefined, 'normal');
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.7);
    doc.line(margin, y + 8, margin + contentWidth, y + 8);
    doc.setTextColor(0, 0, 0);
    y += 14;

    // === DATA TABLE ===
    const tableBody = hotspots.map((h, i) => [
        (i + 1).toString(),
        h.loc.substring(0, 40),
        h.total.toString(),
        h.K.toString(),
        h.A.toString(),
        (h.K + h.A).toString(),
        h.B.toString(),
        h.C.toString(),
        h.O.toString(),
        h.epdo.toLocaleString(),
        h.perYear
    ]);

    doc.autoTable({
        startY: y,
        head: [['Rank', 'Location', 'Total', 'K', 'A', 'K+A', 'B', 'C', 'O', 'EPDO', '/Year']],
        body: tableBody,
        margin: { left: margin, right: margin },
        headStyles: {
            fillColor: colors.primary,
            textColor: 255,
            fontStyle: 'bold',
            fontSize: 8
        },
        bodyStyles: { fontSize: 7.5 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        styles: { cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 12, halign: 'center' },
            1: { cellWidth: 44 },
            2: { cellWidth: 14, halign: 'center' },
            3: { cellWidth: 10, halign: 'center' },
            4: { cellWidth: 10, halign: 'center' },
            5: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
            6: { cellWidth: 10, halign: 'center' },
            7: { cellWidth: 10, halign: 'center' },
            8: { cellWidth: 10, halign: 'center' },
            9: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
            10: { cellWidth: 14, halign: 'center' }
        },
        didParseCell: function(data) {
            // Bold K+A column red when > 0
            if (data.section === 'body' && data.column.index === 5) {
                const val = parseInt(data.cell.raw);
                if (val > 0) data.cell.styles.textColor = [220, 53, 69];
            }
            // Highlight K column red when > 0
            if (data.section === 'body' && data.column.index === 3) {
                const val = parseInt(data.cell.raw);
                if (val > 0) { data.cell.styles.textColor = [220, 53, 69]; data.cell.styles.fontStyle = 'bold'; }
            }
            // Row highlighting by severity
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

    // === FOOTER ON ALL PAGES (post-render for correct page count) ===
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

    doc.save(`hotspots_report_${dateStamp}.pdf`);
}
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.hotspots=CL.hotspots||{};
  CL.hotspots.tab=CL.hotspots.tab||{};
  window.showLocationModal = showLocationModal; CL.hotspots.showLocationModal = showLocationModal; CL.hotspots.tab.showLocationModal = showLocationModal;
  window.zoomToLocation = zoomToLocation; CL.hotspots.zoomToLocation = zoomToLocation; CL.hotspots.tab.zoomToLocation = zoomToLocation;
  window.filterMapForLocation = filterMapForLocation; CL.hotspots.filterMapForLocation = filterMapForLocation; CL.hotspots.tab.filterMapForLocation = filterMapForLocation;
  window.exportHotspotsCSV = exportHotspotsCSV; CL.hotspots.exportHotspotsCSV = exportHotspotsCSV; CL.hotspots.tab.exportHotspotsCSV = exportHotspotsCSV;
  window.exportHotspotsPDF = exportHotspotsPDF; CL.hotspots.exportHotspotsPDF = exportHotspotsPDF; CL.hotspots.tab.exportHotspotsPDF = exportHotspotsPDF;
  CL._registerModule('hotspots/hotspots-tab-modal');
})();
