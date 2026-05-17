/** CL hotspots.tab (render) — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/16-v2-hotspots-tab.md. No behavior change.
 *  Depends on (script order): analysis/hotspots (math); after hotspots-tab-core. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html L54722-L55034) ───
// Filter crash data for hotspot analysis based on date range
function getFilteredHotspotAggregates(startDate, endDate, groupBy) {
    // If no date filtering, use the pre-built aggregates for reliability
    if (!startDate && !endDate) {
        const numYears = crashState.years.length || 1;
        if (groupBy === 'node') {
            // Transform byNode aggregates to match expected format
            const nodeData = {};
            Object.entries(crashState.aggregates.byNode || {}).forEach(([node, d]) => {
                // Support both old 'route' field and new 'routes' Set
                const routeVal = d.routes ? Array.from(d.routes)[0] || '' : (d.route || '');
                nodeData[node] = {
                    total: d.total || 0,
                    K: d.K || 0,
                    A: d.A || 0,
                    B: d.B || 0,
                    C: d.C || 0,
                    O: d.O || 0,
                    collisions: {},
                    route: routeVal
                };
            });
            // Add collision data and jurisdiction from sampleRows for nodes
            const nodeJuris = {};
            crashState.sampleRows.forEach(row => {
                const node = row[COL.NODE] || '';
                const collision = row[COL.COLLISION] || 'Unknown';
                const juris = (row[COL.JURISDICTION] || '').trim();
                if (node && nodeData[node]) {
                    nodeData[node].collisions[collision] = (nodeData[node].collisions[collision] || 0) + 1;
                    // Phase 3: Track jurisdiction for multi-county tiers
                    if (juris && isMultiCountyTier()) {
                        if (!nodeJuris[node]) nodeJuris[node] = {};
                        nodeJuris[node][juris] = (nodeJuris[node][juris] || 0) + 1;
                    }
                }
            });
            // Resolve most common jurisdiction per node
            if (isMultiCountyTier()) {
                Object.entries(nodeJuris).forEach(([node, counts]) => {
                    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                    if (top && nodeData[node]) nodeData[node].jurisdiction = top[0];
                });
            }
            return { data: nodeData, years: numYears };
        } else {
            // Transform byRoute aggregates to match expected format
            const routeData = {};
            Object.entries(crashState.aggregates.byRoute || {}).forEach(([route, d]) => {
                routeData[route] = {
                    total: d.total || 0,
                    K: d.K || 0,
                    A: d.A || 0,
                    B: d.B || 0,
                    C: d.C || 0,
                    O: d.O || 0,
                    collisions: d.collisions || {},
                    jurisdiction: d.jurisdiction || ''
                };
            });
            // Phase 3: If multi-county tier, resolve jurisdiction from sampleRows
            if (isMultiCountyTier()) {
                const routeJuris = {};
                crashState.sampleRows.forEach(row => {
                    const route = row[COL.ROUTE] || '';
                    const juris = (row[COL.JURISDICTION] || '').trim();
                    if (route && juris && routeData[route]) {
                        if (!routeJuris[route]) routeJuris[route] = {};
                        routeJuris[route][juris] = (routeJuris[route][juris] || 0) + 1;
                    }
                });
                Object.entries(routeJuris).forEach(([route, counts]) => {
                    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
                    if (top && routeData[route]) routeData[route].jurisdiction = top[0];
                });
            }
            return { data: routeData, years: numYears };
        }
    }

    // Date filtering requested - aggregate from sampleRows
    const byRoute = {};
    const byNode = {};
    const yearsSet = new Set();

    crashState.sampleRows.forEach(row => {
        // Parse crash date (timestamps are stored as strings in CSV)
        const dateStr = row[COL.DATE];
        if (!dateStr) return;

        const crashDate = new Date(Number(dateStr));
        if (isNaN(crashDate.getTime())) return;

        // Apply date filters
        if (startDate && crashDate < startDate) return;
        if (endDate && crashDate > endDate) return;

        // Track years for per-year calculation
        const year = row[COL.YEAR];
        if (year) yearsSet.add(year);

        // Get severity
        const sev = (row[COL.SEVERITY] || '').trim().toUpperCase().charAt(0);
        const route = row[COL.ROUTE] || 'Unknown';
        const node = row[COL.NODE] || '';
        const collision = row[COL.COLLISION] || 'Unknown';

        // Phase 3: Track jurisdiction for multi-county tiers
        const jurisdiction = (row[COL.JURISDICTION] || '').trim();

        // Aggregate by route
        if (route !== 'Unknown') {
            if (!byRoute[route]) byRoute[route] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, collisions: {}, _jurisCounts: {} };
            byRoute[route].total++;
            if (['K','A','B','C','O'].includes(sev)) byRoute[route][sev]++;
            byRoute[route].collisions[collision] = (byRoute[route].collisions[collision] || 0) + 1;
            if (jurisdiction) byRoute[route]._jurisCounts[jurisdiction] = (byRoute[route]._jurisCounts[jurisdiction] || 0) + 1;
        }

        // Aggregate by node
        if (node) {
            if (!byNode[node]) byNode[node] = { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, collisions: {}, routes: new Set(), _jurisCounts: {} };
            byNode[node].total++;
            if (['K','A','B','C','O'].includes(sev)) byNode[node][sev]++;
            byNode[node].collisions[collision] = (byNode[node].collisions[collision] || 0) + 1;
            if (route) byNode[node].routes.add(route);
            if (jurisdiction) byNode[node]._jurisCounts[jurisdiction] = (byNode[node]._jurisCounts[jurisdiction] || 0) + 1;
        }
    });

    // Phase 3: Resolve most common jurisdiction per route/node for multi-county tiers
    const resolveJurisdiction = (dataObj) => {
        Object.values(dataObj).forEach(d => {
            if (d._jurisCounts) {
                const sorted = Object.entries(d._jurisCounts).sort((a, b) => b[1] - a[1]);
                d.jurisdiction = sorted.length > 0 ? sorted[0][0] : '';
                delete d._jurisCounts;
            }
        });
    };
    resolveJurisdiction(byRoute);
    resolveJurisdiction(byNode);

    return {
        data: groupBy === 'node' ? byNode : byRoute,
        years: yearsSet.size || 1
    };
}

// Update filter summary display
function updateHotspotFilterSummary(startDate, endDate) {
    const filterDiv = document.getElementById('hsActiveFilters');
    const summarySpan = document.getElementById('hsFilterSummary');

    if (!startDate && !endDate) {
        filterDiv.style.display = 'none';
        return;
    }

    let summary = [];
    if (startDate) summary.push(`From: ${startDate}`);
    if (endDate) summary.push(`To: ${endDate}`);

    summarySpan.textContent = summary.join(' | ');
    filterDiv.style.display = 'block';
}

function renderHotspots() {
    // Get current groupBy type for accurate map location filtering
    const locationType = hotspotFilters.groupBy || 'route';
    const showCounty = isMultiCountyTier();

    // Phase 3: Update thead to include County column at multi-county tiers
    const thead = document.querySelector('#hotspotTable thead tr');
    if (thead) {
        const hasCountyCol = thead.querySelector('.tier-county-col');
        if (showCounty && !hasCountyCol) {
            const th = document.createElement('th');
            th.className = 'tier-county-col';
            th.textContent = 'County';
            th.style.cssText = 'font-size:0.8rem;';
            // Insert after Location column (3rd th)
            const locationTh = thead.children[2];
            if (locationTh && locationTh.nextSibling) {
                thead.insertBefore(th, locationTh.nextSibling);
            }
        } else if (!showCounty && hasCountyCol) {
            hasCountyCol.remove();
        }
    }

    // Get paginated data
    const pageData = getPaginatedData('hotspots');
    const state = paginationState.hotspots;
    const startIndex = (state.page - 1) * state.pageSize;

    document.getElementById('hotspotBody').innerHTML = pageData.map((h, pageIndex) => {
        const globalIndex = startIndex + pageIndex;
        const countyCell = showCounty ? `<td style="font-size:.75rem;" class="tier-county-col">${esc(h.county || '')}</td>` : '';
        // Round 15 §3 — AADT + Crash Rate columns. Empty/null shows '—'.
        const aadtCell = (h.aadt != null)
            ? `<td style="font-size:.78rem">${Number(h.aadt).toLocaleString()}${h.aadtYear ? ` <span style="color:#94a3b8;font-size:.7rem">(${h.aadtYear})</span>` : ''}</td>`
            : `<td style="color:#94a3b8" title="No AADT seeded for this location yet">—</td>`;
        const rateCell = (h.crashRateMvmt != null)
            ? `<td style="font-size:.78rem;font-weight:600">${Number(h.crashRateMvmt).toFixed(2)}</td>`
            : `<td style="color:#94a3b8">—</td>`;
        return `
        <tr>
            <td><input type="checkbox" class="hotspot-checkbox" data-location="${esc(h.loc)}" data-index="${globalIndex}" onchange="toggleHotspotSelection(this)" ${hotspotDetailState.selectedLocations.includes(h.loc) ? 'checked' : ''}></td>
            <td><span class="rank-badge ${globalIndex < 3 ? 'top3' : ''}">${globalIndex+1}</span></td>
            <td><strong>${esc(h.loc)}</strong></td>
            ${countyCell}
            <td>${h.total}</td>
            <td><span class="severity-badge severity-K">${h.K}</span></td>
            <td><span class="severity-badge severity-A">${h.A}</span></td>
            <td><span class="severity-badge severity-B">${h.B}</span></td>
            <td><span class="severity-badge severity-C">${h.C}</span></td>
            <td><span class="severity-badge severity-O">${h.O}</span></td>
            <td><strong>${h.epdo.toLocaleString()}</strong></td>
            ${aadtCell}
            ${rateCell}
            <td>${h.perYear}</td>
            <td style="font-size:.75rem${h.topType === 'N/A' ? ';color:#94a3b8' : ''}" ${h.topType === 'N/A' ? 'title="Top collision-type rollup pending (mv_hotspots backend extension)"' : ''}>${h.topType === 'N/A' ? '—' : esc(h.topType.substring(0,20))}</td>
            <td><button class="btn-details" onclick="showLocationDetail('${esc(h.loc)}', 'hotspot')">📍 Details</button> <button class="btn-map" onclick="zoomToLocation('${esc(h.loc)}', '${locationType}')">🗺️ Map</button> <button class="btn-mutcd" onclick="askMUTCDForHotspot('${esc(h.loc)}')" title="Get MUTCD guidance">📖 MUTCD</button> <button style="background:#0ea5e9;color:white;border:none;padding:4px 8px;border-radius:4px;cursor:pointer;font-size:.7rem" onclick="openHotspotStreetView('${esc(h.loc)}', '${locationType}')" title="View most severe crash location">🛣️</button></td>
        </tr>`;
    }).join('');

    // Render pagination controls
    renderPaginationControls('hotspots', 'hotspotPagination', 'goToHotspotPage');

    // Update selection count display
    updateHotspotSelectionCount();
}

// Page navigation for hotspots table
function goToHotspotPage(tableKey, page) {
    goToPage(tableKey, page);
    renderHotspots();
}

// Get MUTCD guidance for a hotspot location
function askMUTCDForHotspot(location) {
    // BUG-004 fix: use String() for consistent type comparison
    const locStr = String(location);
    const crashes = crashState.sampleRows.filter(r => String(r[COL.ROUTE]) === locStr || String(r[COL.NODE]) === locStr);
    askMUTCDGuidance(location, 'hotspot', crashes);
}

/**
 * Opens Street View for a hotspot location
 * Uses the most severe crash location and respects date filters
 * @param {string} location - Route name or node ID
 * @param {string} type - 'route' or 'node'
 */
function openHotspotStreetView(location, type) {
    // Get date filter values from hotspot filters
    const startDate = hotspotFilters.startDate ? new Date(hotspotFilters.startDate) : null;
    let endDate = hotspotFilters.endDate ? new Date(hotspotFilters.endDate) : null;
    if (endDate) endDate.setHours(23, 59, 59, 999);

    // Filter crashes by location
    const locationStr = String(location);
    let crashes = crashState.sampleRows.filter(row => {
        if (type === 'node') return String(row[COL.NODE]) === locationStr;
        if (type === 'route') return row[COL.ROUTE] === location;
        return row[COL.ROUTE] === location || String(row[COL.NODE]) === locationStr;
    });

    // Apply date filter if active
    if (startDate || endDate) {
        crashes = crashes.filter(row => {
            const crashDate = new Date(row[COL.DATE]);
            if (isNaN(crashDate.getTime())) return false;
            if (startDate && crashDate < startDate) return false;
            if (endDate && crashDate > endDate) return false;
            return true;
        });
    }

    if (crashes.length === 0) {
        alert('No crash data found for this location');
        return;
    }

    // Filter for valid coordinates
    const validCrashes = crashes.filter(c => {
        const lat = parseFloat(c[COL.Y]);
        const lng = parseFloat(c[COL.X]);
        const _cb = typeof getMapCoordinateBounds === 'function' ? getMapCoordinateBounds() : { latMin: 24, latMax: 50, lonMin: -125, lonMax: -66 }; return !isNaN(lat) && !isNaN(lng) && lat > _cb.latMin && lat < _cb.latMax && lng > _cb.lonMin && lng < _cb.lonMax;
    });

    if (validCrashes.length === 0) {
        alert('No valid coordinates found for this location');
        return;
    }

    // Sort by severity (K > A > B > C > O) to find most severe crash
    const sevOrder = { K: 0, A: 1, B: 2, C: 3, O: 4 };
    const sorted = validCrashes.sort((a, b) => {
        const sevA = sevOrder[(a[COL.SEVERITY] || '').charAt(0)] ?? 5;
        const sevB = sevOrder[(b[COL.SEVERITY] || '').charAt(0)] ?? 5;
        return sevA - sevB;
    });

    // Use the most severe crash location
    const targetCrash = sorted[0];
    const lat = parseFloat(targetCrash[COL.Y]);
    const lng = parseFloat(targetCrash[COL.X]);

    console.log(`[Hotspot Street View] Opening at ${location} (${type}), ${validCrashes.length} crashes, target: ${targetCrash[COL.SEVERITY]} at ${lat}, ${lng}`);
    openStreetView(lat, lng);
}
  // ─── EXTRACTED CODE END ───

  window.CL=window.CL||{}; CL.hotspots=CL.hotspots||{};
  CL.hotspots.tab=CL.hotspots.tab||{};
  window.getFilteredHotspotAggregates = getFilteredHotspotAggregates; CL.hotspots.getFilteredHotspotAggregates = getFilteredHotspotAggregates; CL.hotspots.tab.getFilteredHotspotAggregates = getFilteredHotspotAggregates;
  window.updateHotspotFilterSummary = updateHotspotFilterSummary; CL.hotspots.updateHotspotFilterSummary = updateHotspotFilterSummary; CL.hotspots.tab.updateHotspotFilterSummary = updateHotspotFilterSummary;
  window.renderHotspots = renderHotspots; CL.hotspots.renderHotspots = renderHotspots; CL.hotspots.tab.renderHotspots = renderHotspots;
  window.goToHotspotPage = goToHotspotPage; CL.hotspots.goToHotspotPage = goToHotspotPage; CL.hotspots.tab.goToHotspotPage = goToHotspotPage;
  window.askMUTCDForHotspot = askMUTCDForHotspot; CL.hotspots.askMUTCDForHotspot = askMUTCDForHotspot; CL.hotspots.tab.askMUTCDForHotspot = askMUTCDForHotspot;
  window.openHotspotStreetView = openHotspotStreetView; CL.hotspots.openHotspotStreetView = openHotspotStreetView; CL.hotspots.tab.openHotspotStreetView = openHotspotStreetView;
  CL._registerModule('hotspots/hotspots-tab-render');
})();
