/**
 * CL assets.schoolTab module
 *
 * Extracted from app/index.html (snapshot L154035-L154515) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/09-assets-school-tab.md.
 * Responsibility: School-zone safety tab (schoolTab* fns + escapeXML/KML export).
 *
 * Public API (back-compat dual exposure):
 *   - window.updateSchoolTabTable → CL.assets.updateSchoolTabTable
 *   - window.schoolTabExportData → CL.assets.schoolTabExportData
 *   - window.schoolTabExportKML → CL.assets.schoolTabExportKML
 *   - window.escapeXML → CL.assets.escapeXML
 *   - window.softActivateSchoolLayer → CL.assets.softActivateSchoolLayer
 *   - (all other moved schoolTab* helpers are ALSO window-mirrored below —
 *      they are referenced from HTML onclick=/dynamically-generated rows, so
 *      trapping them in the IIFE would regress behavior. No behavior change.)
 *
 * Depends on (must load before this file): `core/constants`, `map/map-layers`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Update school results table with enriched data (matching Infrastructure tab)
 */
function updateSchoolTabTable(results) {
    const tbody = document.getElementById('schoolTabBody');
    const pagination = document.getElementById('schoolTabPagination');
    const summaryKPIs = document.getElementById('schoolTabSummaryKPIs');
    if (!tbody) return;

    if (results.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align:center;color:var(--gray);padding:2rem">No school data available. Load schools first.</td></tr>';
        if (pagination) pagination.innerHTML = '';
        if (summaryKPIs) summaryKPIs.style.display = 'none';
        return;
    }

    // Sort results based on current sort state
    const { sortColumn, sortDirection } = schoolTabTableState;
    results.sort((a, b) => {
        let valA, valB;
        switch (sortColumn) {
            case 'name':
                valA = a.location?.name || '';
                valB = b.location?.name || '';
                break;
            case 'level':
                valA = a.level || 'ZZZ';
                valB = b.level || 'ZZZ';
                break;
            case 'enrollment':
                valA = a.enrollment || 0;
                valB = b.enrollment || 0;
                break;
            case 'crashRate':
                valA = parseFloat(a.crashRate) || 0;
                valB = parseFloat(b.crashRate) || 0;
                break;
            case 'vulnEpdo':
                valA = a.vulnEpdo || a.epdo || 0;
                valB = b.vulnEpdo || b.epdo || 0;
                break;
            case 'lat':
                valA = a.location?.lat || 0;
                valB = b.location?.lat || 0;
                break;
            case 'lng':
                valA = a.location?.lng || 0;
                valB = b.location?.lng || 0;
                break;
            case 'crashes':
                valA = a.total || 0;
                valB = b.total || 0;
                break;
            case 'epdo':
                valA = a.epdo || 0;
                valB = b.epdo || 0;
                break;
            case 'fatal':
                valA = a.K || 0;
                valB = b.K || 0;
                break;
            case 'serious':
                valA = a.A || 0;
                valB = b.A || 0;
                break;
            case 'injury':
                valA = (a.B || 0) + (a.C || 0);
                valB = (b.B || 0) + (b.C || 0);
                break;
            case 'pdo':
                valA = a.O || 0;
                valB = b.O || 0;
                break;
            default:
                valA = a.epdo || 0;
                valB = b.epdo || 0;
        }
        if (typeof valA === 'string') {
            return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    // Calculate and display summary KPIs
    const schoolCount = results.length;
    const totalEnrollment = results.reduce((sum, r) => sum + (r.enrollment || 0), 0);
    const totalCrashes = results.reduce((sum, r) => sum + (r.total || 0), 0);
    const avgCrashRate = totalEnrollment > 0 ? ((totalCrashes / totalEnrollment) * 1000).toFixed(2) : '0.00';
    const highRiskSchools = results.filter(r => parseFloat(r.crashRate) > 5 || r.K > 0 || r.A > 0).length;
    const elementarySchools = results.filter(r => r.level === 'Elementary' || r.level === 'Pre-K/Early').length;

    if (summaryKPIs) {
        summaryKPIs.style.display = 'grid';
        document.getElementById('schoolTabSummaryCount').textContent = schoolCount.toLocaleString();
        document.getElementById('schoolTabSummaryEnrollment').textContent = totalEnrollment.toLocaleString();
        document.getElementById('schoolTabSummaryCrashRate').textContent = avgCrashRate;
        document.getElementById('schoolTabSummaryHighRisk').textContent = highRiskSchools.toLocaleString();
        document.getElementById('schoolTabSummaryElementary').textContent = elementarySchools.toLocaleString();
    }

    // Pagination
    const totalPages = Math.ceil(results.length / schoolTabTableState.rowsPerPage);
    const start = (schoolTabTableState.currentPage - 1) * schoolTabTableState.rowsPerPage;
    const pageResults = results.slice(start, start + schoolTabTableState.rowsPerPage);

    // Render table rows (matching Infrastructure tab format)
    tbody.innerHTML = pageResults.map((r, idx) => {
        const rank = start + idx + 1;
        const name = r.location?.name || 'Unknown';
        const level = r.level || '-';
        const enrollment = r.enrollment || 0;
        const crashRate = r.crashRate || '0.00';
        const vulnEpdo = r.vulnEpdo || r.epdo || 0;
        const lat = r.location?.lat || 0;
        const lng = r.location?.lng || 0;
        const injury = (r.B || 0) + (r.C || 0);

        return `
            <tr>
                <td style="text-align:center;font-weight:700">${rank}</td>
                <td style="font-weight:500" title="${esc(name)}">${esc(name.substring(0, 30))}${name.length > 30 ? '...' : ''}</td>
                <td style="font-size:.8rem">${level}</td>
                <td style="text-align:right">${enrollment.toLocaleString()}</td>
                <td style="text-align:right;color:${parseFloat(crashRate) > 5 ? '#dc2626' : parseFloat(crashRate) > 2 ? '#ea580c' : 'inherit'}">${crashRate}</td>
                <td style="text-align:right;font-weight:600;color:#7c3aed">${vulnEpdo.toLocaleString()}</td>
                <td>${lat.toFixed(5)}</td>
                <td>${lng.toFixed(5)}</td>
                <td style="font-weight:600">${r.total || 0}</td>
                <td style="font-weight:700;color:var(--primary)">${(r.epdo || 0).toLocaleString()}</td>
                <td style="color:#dc2626;font-weight:${r.K > 0 ? '700' : '400'}">${r.K || 0}</td>
                <td style="color:#ea580c;font-weight:${r.A > 0 ? '600' : '400'}">${r.A || 0}</td>
                <td>${injury}</td>
                <td style="color:var(--gray)">${r.O || 0}</td>
                <td><button class="btn btn-sm btn-info" onclick="schoolTabViewOnMapSingle(${lat}, ${lng})" title="View on map">📍</button></td>
            </tr>
        `;
    }).join('');

    // Render pagination
    if (pagination) {
        if (totalPages > 1) {
            let paginationHtml = '';
            if (schoolTabTableState.currentPage > 1) {
                paginationHtml += `<button onclick="schoolTabGoToPage(${schoolTabTableState.currentPage - 1})">← Prev</button>`;
            }
            paginationHtml += `<span style="margin:0 .5rem">Page ${schoolTabTableState.currentPage} of ${totalPages}</span>`;
            if (schoolTabTableState.currentPage < totalPages) {
                paginationHtml += `<button onclick="schoolTabGoToPage(${schoolTabTableState.currentPage + 1})">Next →</button>`;
            }
            pagination.innerHTML = paginationHtml;
        } else {
            pagination.innerHTML = '';
        }
    }
}

/**
 * Clear schools
 */
function schoolTabClearSchools() {
    const schoolAsset = assetState?.assets?.find(a => a.type === 'school');
    if (schoolAsset) {
        assetDeleteAsset(schoolAsset.id);
    }
    setTimeout(updateSchoolTabUI, 300);
}

/**
 * Clear ALL school assets (handles duplicates)
 * Used when leaving school tab to ensure clean state
 */
function schoolTabClearAllSchools() {
    const schoolAssets = assetState?.assets?.filter(a => a.type === 'school') || [];
    if (schoolAssets.length === 0) return;

    console.log(`[Schools] Clearing ${schoolAssets.length} school asset(s)`);

    // Remove each school asset
    schoolAssets.forEach(asset => {
        // Remove map layer and visibility state
        assetRemoveMapLayer(asset.id);
        delete mapAssetVisibility[asset.id];

        const idx = assetState.assets.findIndex(a => a.id === asset.id);
        if (idx !== -1) {
            assetState.assets.splice(idx, 1);
        }
        const activeIdx = assetState.activeAssetIds.indexOf(asset.id);
        if (activeIdx !== -1) {
            assetState.activeAssetIds.splice(activeIdx, 1);
        }
        // Remove from IndexedDB
        assetDbDelete(asset.id);
    });

    // Persist visibility state
    saveMapAssetVisibility();

    // Save and update UI
    assetSaveSettings();
    assetRenderList();
    updateMapAssetPanel();
    setTimeout(updateSchoolTabUI, 300);
}

/**
 * Radius change handlers
 */
function schoolTabRadiusChange(value) {
    schoolTabState.radius = parseInt(value);
    const el = document.getElementById('schoolTabRadiusValue');
    if (el) el.textContent = `${value} ft`;
}

function schoolTabSetRadius(value) {
    schoolTabState.radius = value;
    const slider = document.getElementById('schoolTabRadius');
    const el = document.getElementById('schoolTabRadiusValue');
    if (slider) slider.value = value;
    if (el) el.textContent = `${value} ft`;

    // Update global radius if schools loaded
    if (typeof assetState !== 'undefined' && schoolTabState.loaded) {
        assetState.radiusFeet = value;
        assetRunAnalysis().then(() => updateSchoolTabMetrics());
    }
}

/**
 * View schools on map
 */
function schoolTabViewOnMap() {
    const schoolAsset = assetState?.assets?.find(a => a.type === 'school');
    if (schoolAsset) {
        // Enable school layer visibility
        mapAssetVisibility[schoolAsset.id] = true;
        saveMapAssetVisibility();
        assetShowOnMap(schoolAsset.id);
        showTab('map');
    } else {
        alert('Please load schools first.');
    }
}

function schoolTabViewOnMapSingle(lat, lng) {
    if (lat && lng && crashMap) {
        showTab('map');
        setTimeout(() => {
            crashMap.setView([lat, lng], 17);
        }, 100);
    }
}

/**
 * Focus View - show only school layer
 */
function schoolTabFocusView() {
    const schoolAsset = assetState?.assets?.find(a => a.type === 'school');
    if (!schoolAsset) {
        alert('Please load schools first.');
        return;
    }

    // Disable all other asset layers, enable only schools
    assetState.assets.forEach(asset => {
        mapAssetVisibility[asset.id] = (asset.type === 'school');
    });
    saveMapAssetVisibility();

    // Refresh map panel
    if (typeof updateMapAssetPanel === 'function') {
        updateMapAssetPanel();
    }

    // Show school layer on map
    assetShowOnMap(schoolAsset.id);
    showTab('map');
}

/**
 * Export school data with enriched columns (matching Infrastructure tab)
 */
function schoolTabExportData() {
    const results = Array.from(assetState?.associations?.values() || [])
        .filter(r => r.asset?.type === 'school');

    if (results.length === 0) {
        alert('No school data to export.');
        return;
    }

    // Create CSV with enriched columns matching the table display
    const headers = [
        'Rank',
        'School Name',
        'Level',
        'Enrollment',
        'Crash Rate (per 1K)',
        'Vuln EPDO',
        'Latitude',
        'Longitude',
        'Total Crashes',
        'EPDO',
        'Fatal (K)',
        'Serious (A)',
        'Minor (B)',
        'Possible (C)',
        'PDO (O)',
        'B+C Combined'
    ];
    const rows = results.sort((a, b) => (b.epdo || 0) - (a.epdo || 0)).map((r, i) => [
        i + 1,
        r.location?.name || 'Unknown',
        r.level || '-',
        r.enrollment || 0,
        r.crashRate || '0.00',
        r.vulnEpdo || r.epdo || 0,
        r.location?.lat || '',
        r.location?.lng || '',
        r.total || 0,
        r.epdo || 0,
        r.K || 0,
        r.A || 0,
        r.B || 0,
        r.C || 0,
        r.O || 0,
        (r.B || 0) + (r.C || 0)
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_safety_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Export school data as KML for Google Earth / GIS (with enriched data)
 */
function schoolTabExportKML() {
    const results = Array.from(assetState?.associations?.values() || [])
        .filter(r => r.asset?.type === 'school');

    if (results.length === 0) {
        alert('No school data to export.');
        return;
    }

    // Sort by EPDO for ranking
    const sortedResults = results.sort((a, b) => (b.epdo || 0) - (a.epdo || 0));

    // Build KML content with enriched data
    let placemarks = sortedResults.map((r, i) => {
        const name = r.location?.name || 'Unknown School';
        const lat = r.location?.lat || 0;
        const lng = r.location?.lng || 0;
        const level = r.level || 'N/A';
        const enrollment = r.enrollment || 0;
        const crashRate = r.crashRate || '0.00';
        const vulnEpdo = r.vulnEpdo || r.epdo || 0;
        const crashes = r.total || 0;
        const epdo = r.epdo || 0;
        const ka = (r.K || 0) + (r.A || 0);

        // Color based on risk (red = high, yellow = medium, green = low)
        let styleId = 'lowRisk';
        if (vulnEpdo > 100 || ka > 0) styleId = 'highRisk';
        else if (vulnEpdo > 50 || crashes > 3) styleId = 'medRisk';

        const description = `<![CDATA[
<b>Rank:</b> ${i + 1}<br/>
<b>Level:</b> ${level}<br/>
<b>Enrollment:</b> ${enrollment.toLocaleString()}<br/>
<b>Crash Rate (per 1K):</b> ${crashRate}<br/>
<hr/>
<b>Total Crashes:</b> ${crashes}<br/>
<b>Fatal + Serious (K+A):</b> ${ka}<br/>
<b>EPDO Score:</b> ${epdo.toLocaleString()}<br/>
<b>Vuln EPDO:</b> ${vulnEpdo.toLocaleString()}<br/>
]]>`;

        return `
    <Placemark>
      <name>${escapeXML(name)}</name>
      <description>${description}</description>
      <styleUrl>#${styleId}</styleUrl>
      <Point>
        <coordinates>${lng},${lat},0</coordinates>
      </Point>
    </Placemark>`;
    }).join('');

    const kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
  <name>School Safety Analysis - ${new Date().toLocaleDateString()}</name>
  <description>Schools ranked by crash risk (EPDO). Generated by ${getReportAttribution()}.</description>

  <Style id="highRisk">
    <IconStyle>
      <color>ff0000ff</color>
      <scale>1.2</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/red-circle.png</href></Icon>
    </IconStyle>
  </Style>
  <Style id="medRisk">
    <IconStyle>
      <color>ff00aaff</color>
      <scale>1.0</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/ylw-circle.png</href></Icon>
    </IconStyle>
  </Style>
  <Style id="lowRisk">
    <IconStyle>
      <color>ff00ff00</color>
      <scale>0.8</scale>
      <Icon><href>http://maps.google.com/mapfiles/kml/paddle/grn-circle.png</href></Icon>
    </IconStyle>
  </Style>

  <Folder>
    <name>Schools (${sortedResults.length})</name>
    ${placemarks}
  </Folder>
</Document>
</kml>`;

    const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `school_safety_analysis_${new Date().toISOString().split('T')[0]}.kml`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Helper function to escape XML special characters
 */
function escapeXML(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Soft activate school layer (without deactivating others)
 */
function softActivateSchoolLayer() {
    const schoolAsset = assetState?.assets?.find(a => a.type === 'school');
    if (schoolAsset && !mapAssetVisibility[schoolAsset.id]) {
        mapAssetVisibility[schoolAsset.id] = true;
        saveMapAssetVisibility();
        if (typeof updateMapAssetPanel === 'function') {
            updateMapAssetPanel();
        }
        console.log('[SchoolTab] Soft-activated school layer');
    }
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  window.updateSchoolTabTable = updateSchoolTabTable; CL.assets.updateSchoolTabTable = updateSchoolTabTable;
  window.schoolTabClearSchools = schoolTabClearSchools; CL.assets.schoolTabClearSchools = schoolTabClearSchools;
  window.schoolTabClearAllSchools = schoolTabClearAllSchools; CL.assets.schoolTabClearAllSchools = schoolTabClearAllSchools;
  window.schoolTabRadiusChange = schoolTabRadiusChange; CL.assets.schoolTabRadiusChange = schoolTabRadiusChange;
  window.schoolTabSetRadius = schoolTabSetRadius; CL.assets.schoolTabSetRadius = schoolTabSetRadius;
  window.schoolTabViewOnMap = schoolTabViewOnMap; CL.assets.schoolTabViewOnMap = schoolTabViewOnMap;
  window.schoolTabViewOnMapSingle = schoolTabViewOnMapSingle; CL.assets.schoolTabViewOnMapSingle = schoolTabViewOnMapSingle;
  window.schoolTabFocusView = schoolTabFocusView; CL.assets.schoolTabFocusView = schoolTabFocusView;
  window.schoolTabExportData = schoolTabExportData; CL.assets.schoolTabExportData = schoolTabExportData;
  window.schoolTabExportKML = schoolTabExportKML; CL.assets.schoolTabExportKML = schoolTabExportKML;
  window.escapeXML = escapeXML; CL.assets.escapeXML = escapeXML;
  window.softActivateSchoolLayer = softActivateSchoolLayer; CL.assets.softActivateSchoolLayer = softActivateSchoolLayer;
  CL._registerModule('assets/school-tab');
})();
