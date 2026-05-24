/**
 * CL assets.assetExport module
 *
 * Extracted from app/index.html (snapshot L155491-L155924) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/11-assets-asset-export.md.
 * Responsibility: Shared asset export menu (KML/PDF) for school+transit tabs.
 *
 * Public API (back-compat dual exposure):
 *   - window.switchSchoolTabResourceTab → CL.assets.switchSchoolTabResourceTab
 *   - window.switchTransitTabResourceTab → CL.assets.switchTransitTabResourceTab
 *   - window.toggleAssetExportMenu → CL.assets.toggleAssetExportMenu
 *   - window.hideAssetExportMenu → CL.assets.hideAssetExportMenu
 *   - window.assetExportKML → CL.assets.assetExportKML
 *   - window.assetExportPDF → CL.assets.assetExportPDF
 *   (getPriority is a private nested local in assetExportKML — not exposed)
 *
 * Depends on (must load before this file): `assets/transit-tab`
 */
'use strict';
// ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Switch between resource tabs in School Safety sub-tab (Design Guides, Regulations, Grants)
 */
function switchSchoolTabResourceTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.school-tab-resource-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabId;
        tab.style.color = isActive ? 'var(--primary)' : 'var(--gray)';
        tab.style.borderBottomColor = isActive ? 'var(--primary)' : 'transparent';
        tab.classList.toggle('active', isActive);
    });

    // Update content panels
    document.querySelectorAll('.school-tab-resource-content').forEach(content => {
        content.style.display = 'none';
    });

    const activeContent = document.getElementById(`schoolTabResource${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
}

/**
 * Switch between resource tabs in Transit Safety sub-tab (Design Guides, Regulations, Grants)
 */
function switchTransitTabResourceTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.transit-tab-resource-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabId;
        tab.style.color = isActive ? 'var(--primary)' : 'var(--gray)';
        tab.style.borderBottomColor = isActive ? 'var(--primary)' : 'transparent';
        tab.classList.toggle('active', isActive);
    });

    // Update content panels
    document.querySelectorAll('.transit-tab-resource-content').forEach(content => {
        content.style.display = 'none';
    });

    const activeContent = document.getElementById(`transitTabResource${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
    if (activeContent) {
        activeContent.style.display = 'block';
    }
}

// ═══════════════════════════════════════════════════════════════
// ENHANCED EXPORT FUNCTIONS (CSV, KML, PDF)
// ═══════════════════════════════════════════════════════════════

/**
 * Toggle the export dropdown menu
 */
function toggleAssetExportMenu() {
    const menu = document.getElementById('assetExportMenu');
    if (menu) {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }
}

/**
 * Hide the export dropdown menu
 */
function hideAssetExportMenu() {
    const menu = document.getElementById('assetExportMenu');
    if (menu) {
        menu.style.display = 'none';
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('assetExportMenu');
    const btn = document.getElementById('assetExportBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.style.display = 'none';
    }
});

/**
 * Export asset analysis results to KML format
 */
function assetExportKML() {
    const results = Array.from(assetState.associations.values());
    if (results.length === 0) {
        assetShowNotification('No results to export', 'warning');
        return;
    }

    // Sort by EPDO
    results.sort((a, b) => b.epdo - a.epdo);

    // Determine priority based on K+A crashes
    const getPriority = (r) => {
        if (r.K > 0 || r.A > 0) return 'high';
        if (r.B > 0 || r.C > 0) return 'medium';
        return 'low';
    };

    const priorityStyles = {
        high: { color: 'ff0000ff', icon: 'http://maps.google.com/mapfiles/kml/paddle/red-circle.png' },
        medium: { color: 'ff00ffff', icon: 'http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png' },
        low: { color: 'ffff9900', icon: 'http://maps.google.com/mapfiles/kml/paddle/blu-circle.png' }
    };

    let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
<name>Infrastructure Asset Safety Analysis</name>
<description>Generated: ${new Date().toLocaleDateString()} | Analysis Radius: ${assetState.radiusFeet} ft</description>

<!-- Styles -->
<Style id="highPriority">
  <IconStyle><color>${priorityStyles.high.color}</color><scale>1.2</scale><Icon><href>${priorityStyles.high.icon}</href></Icon></IconStyle>
</Style>
<Style id="mediumPriority">
  <IconStyle><color>${priorityStyles.medium.color}</color><scale>1.0</scale><Icon><href>${priorityStyles.medium.icon}</href></Icon></IconStyle>
</Style>
<Style id="lowPriority">
  <IconStyle><color>${priorityStyles.low.color}</color><scale>0.8</scale><Icon><href>${priorityStyles.low.icon}</href></Icon></IconStyle>
</Style>

<!-- High Priority Locations (Fatal/Serious Injury) -->
<Folder>
<name>High Priority (K+A Crashes)</name>
<open>1</open>
${results.filter(r => getPriority(r) === 'high').map((r, idx) => `
<Placemark>
  <name>${escapeXml(r.location.name)}</name>
  <description><![CDATA[
    <b>Asset Type:</b> ${getAssetIconInfo(r.asset).label}<br>
    <b>Rank:</b> #${results.indexOf(r) + 1}<br>
    <hr>
    <b>Crashes within ${assetState.radiusFeet} ft:</b> ${r.total}<br>
    <b>Pedestrian:</b> ${r.ped || 0} | <b>Bicycle:</b> ${r.bike || 0}<br>
    <b>EPDO Score:</b> ${r.epdo.toLocaleString()}<br>
    <b>Severity:</b> K:${r.K} A:${r.A} B:${r.B} C:${r.C} O:${r.O}<br>
    ${r.asset.type === 'bus_stop' ? `<b>Agency:</b> ${r.location.metadata?.agency || 'N/A'}<br>` : ''}
  ]]></description>
  <styleUrl>#highPriority</styleUrl>
  <Point><coordinates>${r.location.lng},${r.location.lat},0</coordinates></Point>
</Placemark>
`).join('')}
</Folder>

<!-- Medium Priority Locations (Injury) -->
<Folder>
<name>Medium Priority (B+C Crashes)</name>
${results.filter(r => getPriority(r) === 'medium').map(r => `
<Placemark>
  <name>${escapeXml(r.location.name)}</name>
  <description><![CDATA[
    <b>Asset Type:</b> ${getAssetIconInfo(r.asset).label}<br>
    <b>Crashes:</b> ${r.total} | <b>EPDO:</b> ${r.epdo}<br>
    <b>Severity:</b> K:${r.K} A:${r.A} B:${r.B} C:${r.C} O:${r.O}
  ]]></description>
  <styleUrl>#mediumPriority</styleUrl>
  <Point><coordinates>${r.location.lng},${r.location.lat},0</coordinates></Point>
</Placemark>
`).join('')}
</Folder>

<!-- Low Priority Locations (PDO or No Crashes) -->
<Folder>
<name>Low Priority (PDO/No Crashes)</name>
${results.filter(r => getPriority(r) === 'low').map(r => `
<Placemark>
  <name>${escapeXml(r.location.name)}</name>
  <description><![CDATA[
    <b>Asset Type:</b> ${getAssetIconInfo(r.asset).label}<br>
    <b>Crashes:</b> ${r.total} | <b>EPDO:</b> ${r.epdo}
  ]]></description>
  <styleUrl>#lowPriority</styleUrl>
  <Point><coordinates>${r.location.lng},${r.location.lat},0</coordinates></Point>
</Placemark>
`).join('')}
</Folder>

</Document>
</kml>`;

    // Download
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `asset_analysis_${new Date().toISOString().slice(0,10)}.kml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    assetShowNotification('KML exported successfully', 'success');
}

// Note: escapeXml() is defined earlier in the codebase (BUG-006 fix - removed duplicate)

/**
 * Generate professional PDF report for asset analysis
 */
async function assetExportPDF() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        assetShowNotification('PDF library not loaded', 'error');
        return;
    }

    const results = Array.from(assetState.associations.values());
    if (results.length === 0) {
        assetShowNotification('No results to export', 'warning');
        return;
    }

    // Sort by EPDO
    results.sort((a, b) => b.epdo - a.epdo);

    assetShowLoading(true, 'Generating PDF report...');

    try {
        const doc = new jsPDF('p', 'mm', 'letter');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;

        // Colors
        const primaryBlue = [0, 51, 102];

        // ========== COVER PAGE ==========
        doc.setFillColor(...primaryBlue);
        doc.rect(0, 0, pageWidth, 50, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('Infrastructure Asset', pageWidth / 2, 22, { align: 'center' });
        doc.text('Safety Analysis Report', pageWidth / 2, 35, { align: 'center' });

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');

        let yPos = 70;

        // Report metadata
        doc.setFontSize(11);
        doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
        yPos += 8;
        doc.text(`Analysis Radius: ${assetState.radiusFeet} feet`, margin, yPos);
        yPos += 8;
        doc.text(`Total Assets Analyzed: ${results.length}`, margin, yPos);
        yPos += 15;

        // ========== EXECUTIVE SUMMARY ==========
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, yPos, pageWidth - 2 * margin, 45, 'F');

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryBlue);
        doc.text('Executive Summary', margin + 5, yPos + 10);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Calculate summary stats
        const totalCrashes = results.reduce((sum, r) => sum + r.total, 0);
        const totalEPDO = results.reduce((sum, r) => sum + r.epdo, 0);
        const totalK = results.reduce((sum, r) => sum + r.K, 0);
        const totalA = results.reduce((sum, r) => sum + r.A, 0);
        const totalPed = results.reduce((sum, r) => sum + (r.ped || 0), 0);
        const totalBike = results.reduce((sum, r) => sum + (r.bike || 0), 0);
        const withCrashes = results.filter(r => r.total > 0).length;
        const highPriority = results.filter(r => r.K > 0 || r.A > 0).length;

        const summaryY = yPos + 18;
        doc.text(`• ${results.length} infrastructure locations analyzed`, margin + 5, summaryY);
        doc.text(`• ${withCrashes} locations (${Math.round(withCrashes/results.length*100)}%) have crashes within radius`, margin + 5, summaryY + 6);
        doc.text(`• ${totalCrashes} total crashes | ${totalEPDO.toLocaleString()} combined EPDO score`, margin + 5, summaryY + 12);
        doc.text(`• Pedestrian: ${totalPed} crashes | Bicycle: ${totalBike} crashes`, margin + 5, summaryY + 18);
        doc.text(`• ${highPriority} high-priority locations with ${totalK} fatal + ${totalA} serious injury crashes`, margin + 5, summaryY + 24);

        yPos += 55;

        // ========== HIGH-PRIORITY LOCATIONS TABLE ==========
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryBlue);
        doc.text('High-Priority Locations', margin, yPos);
        yPos += 8;

        const topResults = results.slice(0, 15);

        doc.autoTable({
            startY: yPos,
            head: [['#', 'Location', 'Type', 'Crashes', 'K', 'A', 'B+C', 'EPDO']],
            body: topResults.map((r, idx) => [
                idx + 1,
                r.location.name.substring(0, 35),
                getAssetIconInfo(r.asset).label,
                r.total,
                r.K,
                r.A,
                (r.B || 0) + (r.C || 0),
                r.epdo.toLocaleString()
            ]),
            theme: 'striped',
            headStyles: { fillColor: primaryBlue, fontSize: 9 },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 10 },
                1: { cellWidth: 60 },
                2: { cellWidth: 30 },
                3: { halign: 'center', cellWidth: 18 },
                4: { halign: 'center', cellWidth: 12 },
                5: { halign: 'center', cellWidth: 12 },
                6: { halign: 'center', cellWidth: 15 },
                7: { halign: 'right', cellWidth: 22 }
            },
            didParseCell: function(data) {
                if (data.section === 'body') {
                    const rowData = topResults[data.row.index];
                    if (rowData && (rowData.K > 0 || rowData.A > 0)) {
                        data.cell.styles.fillColor = [254, 226, 226];
                    }
                }
            },
            margin: { left: margin, right: margin }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        // Check if we need a new page
        if (yPos > pageHeight - 60) {
            doc.addPage();
            yPos = margin;
        }

        // ========== RECOMMENDATIONS ==========
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...primaryBlue);
        doc.text('Recommended Safety Improvements', margin, yPos);
        yPos += 10;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        // Check if bus stops are in the results
        const hasBusStops = results.some(r => r.asset.type === 'bus_stop');

        const recommendations = [
            'Review sight distance and visibility at high-priority locations',
            'Consider enhanced lighting for locations with dark-condition crashes',
            'Evaluate pedestrian crossing treatments (crosswalks, RRFBs, signals)',
            'Assess geometric improvements (curb extensions, refuge islands)',
            'Apply for HSIP or TAP funding for identified improvements'
        ];

        if (hasBusStops) {
            recommendations.push('Install bus bulb-outs at high-crash transit stops');
            recommendations.push('Improve pedestrian connections to transit stops');
            recommendations.push('Consider Leading Pedestrian Intervals at signalized stops');
        }

        recommendations.forEach((rec, idx) => {
            doc.text(`${idx + 1}. ${rec}`, margin, yPos);
            yPos += 6;
        });

        yPos += 10;

        // ========== FUNDING OPPORTUNITIES ==========
        if (yPos < pageHeight - 50) {
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(...primaryBlue);
            doc.text('Potential Funding Sources', margin, yPos);
            yPos += 8;

            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);

            const fundingSources = [
                'HSIP - Highway Safety Improvement Program (infrastructure focus)',
                'TAP - Transportation Alternatives Program (ped/bike improvements)',
                'Safe Streets for All (SS4A) - Federal discretionary grants',
                'FTA Section 5339 - Bus and Bus Facilities (transit stops)'
            ];

            fundingSources.forEach(src => {
                doc.text(`• ${src}`, margin, yPos);
                yPos += 5;
            });
        }

        // ========== FOOTER ==========
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Generated by ${getReportAttribution()} | Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 8,
                { align: 'center' }
            );
        }

        // Save
        doc.save(`asset_safety_analysis_${new Date().toISOString().slice(0,10)}.pdf`);
        assetShowNotification('PDF report generated successfully', 'success');

    } catch (error) {
        console.error('[Asset] PDF export error:', error);
        assetShowNotification('Error generating PDF: ' + error.message, 'error');
    } finally {
        assetShowLoading(false);
    }
}

// ─── EXTRACTED CODE END ───

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.assets = CL.assets || {};
CL.assets.switchSchoolTabResourceTab = switchSchoolTabResourceTab;
CL.assets.switchTransitTabResourceTab = switchTransitTabResourceTab;
CL.assets.toggleAssetExportMenu = toggleAssetExportMenu;
CL.assets.hideAssetExportMenu = hideAssetExportMenu;
CL.assets.assetExportKML = assetExportKML;
CL.assets.assetExportPDF = assetExportPDF;

// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.assetExportKML = assetExportKML;
window.assetExportPDF = assetExportPDF;
window.toggleAssetExportMenu = toggleAssetExportMenu;

export {
    switchSchoolTabResourceTab,
    switchTransitTabResourceTab,
    toggleAssetExportMenu,
    hideAssetExportMenu,
    assetExportKML,
    assetExportPDF
};

CL._registerModule('assets/asset-export');
