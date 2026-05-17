/**
 * CL cmf.search module
 *
 * Extracted from app/index.html on 2026-05-17.
 * Round X modular refactor — see modular-prompts/31-cmf-cmf-search.md.
 * Responsibility: CMF database load + location dropdown population + search data.
 *
 * Public API (back-compat dual exposure):
 *   - window.loadCMFDatabase          -> CL.cmf.loadCMFDatabase
 *   - window.transformCMFData         -> CL.cmf.transformCMFData
 *   - window.showCMFLoadedStatus      -> CL.cmf.showCMFLoadedStatus
 *   - window.initCMFLocationDropdown  -> CL.cmf.initCMFLocationDropdown
 *   - window.updateCMFLocationDropdown-> CL.cmf.updateCMFLocationDropdown
 *   - window.buildCMFSearchData       -> CL.cmf.buildCMFSearchData
 *   - window.populateCMFLocations     -> CL.cmf.populateCMFLocations
 *
 * DEVIATION FROM PROMPT (approved Session G plan + user decision):
 * the prompt §1 lists `cmfState` as a module-private global to move with the
 * code. `cmfState` has 419 references across index.html and is shared by the
 * CMF / Warrants / AI tabs; it is declared inline at index.html L78928
 * (`const cmfState = {`) — OUTSIDE the extracted block — and is intentionally
 * LEFT INLINE so all remaining inline readers keep resolving the same global.
 * The moved functions reference `cmfState` only at runtime. No behavior change.
 *
 * The prompt §2 dual-exposed only loadCMFDatabase + populateCMFLocations;
 * loadCMFDatabase has 6 external inline callers and populateCMFLocations 2,
 * so all 7 moved fns are window-exposed to preserve behavior.
 *
 * Depends on (resolved at runtime): cmfState (inline global), crashState, COL,
 * CMF_EMBEDDED_DATA, loadAIResultsFromSessionStorage, createLocationTypeSelector,
 * getSelectedLocationType, populateLocationDropdown, window.LocationPicker.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// Load CMF database - fetches from JSON file with embedded fallback
async function loadCMFDatabase() {
    const statusEl = document.getElementById('cmfDatabaseStatus');

    // Show loading state
    statusEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:.5rem;color:var(--primary)">
            <span class="spinner" style="width:16px;height:16px;border-width:2px"></span>
            <span>Loading CMF Database...</span>
        </div>
    `;

    try {
        // Try to fetch from processed JSON file first
        const response = await fetch('../data/cmf_processed.json');
        if (response.ok) {
            const data = await response.json();
            // Transform new format to existing expected format
            cmfState.database = transformCMFData(data.records);
            cmfState.loaded = true;
            cmfState.cmfVersion = data.version;
            cmfState.cmfUpdated = data.updated;
            cmfState.cmfStats = data.stats;
            showCMFLoadedStatus();
            loadAIResultsFromSessionStorage();
            console.log('[CMF] Loaded', cmfState.database.length, 'records from processed JSON');
            return;
        }
    } catch (fetchError) {
        console.warn('[CMF] Could not fetch processed JSON:', fetchError);
    }

    // Fallback to embedded data if available
    if (typeof CMF_EMBEDDED_DATA !== 'undefined' && CMF_EMBEDDED_DATA.length > 0) {
        cmfState.database = CMF_EMBEDDED_DATA;
        cmfState.loaded = true;
        showCMFLoadedStatus();
        loadAIResultsFromSessionStorage();
        console.log('[CMF] Using embedded data:', cmfState.database.length, 'records');
        return;
    }

    // Show error if no data available
    statusEl.innerHTML = `
        <div style="color:var(--danger)">
            <strong>❌ Error Loading CMF Database</strong>
            <p style="font-size:.85rem;margin-top:.5rem">Could not load CMF data. Please refresh the page.</p>
        </div>
    `;
}

// Transform new JSON format to existing app format
function transformCMFData(records) {
    return records.map(r => ({
        id: r.id,
        name: r.n,
        desc: r.d || '',
        category: r.c,
        subcategory: r.sc || '',
        cmf: r.cmf,
        crfPct: r.crf,
        rating: r.r,
        crashTypes: r.ct || ['all'],
        severities: r.sev || ['K','A','B','C','O'],
        locationType: r.loc || 'both',
        standardError: r.se,
        inHSM: r.hsm || false,
        isProven: r.psc || false,
        isVirginia: (r.va || 0) >= 50,
        virginiaScore: r.va || 25,
        state: r.st || '',
        areaType: r.at || 'All',
        intersectionGeometry: r.ig || '',
        trafficControl: r.tc || '',
        minAADT: r.aadt ? r.aadt[0] : null,
        maxAADT: r.aadt ? r.aadt[1] : null,
        pubYear: r.yr,
        costTier: r.cost || 2
    }));
}

function showCMFLoadedStatus() {
    const statusEl = document.getElementById('cmfDatabaseStatus');
    
    // Count by category
    const categories = {};
    cmfState.database.forEach(cmf => {
        categories[cmf.category] = (categories[cmf.category] || 0) + 1;
    });
    
    // Count special types
    const provenCount = cmfState.database.filter(c => c.isProven).length;
    const hsmCount = cmfState.database.filter(c => c.inHSM).length;
    const vaCount = cmfState.database.filter(c => c.isVirginia).length;
    
    statusEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:.5rem;color:var(--success);margin-bottom:.75rem">
            <span style="font-size:1.2rem">✅</span>
            <strong>CMF Database Loaded Successfully</strong>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:.5rem;font-size:.8rem">
            <div style="padding:.5rem;background:var(--light);border-radius:var(--radius)">
                <div style="font-size:1.1rem;font-weight:700;color:var(--primary)">${cmfState.database.length.toLocaleString()}</div>
                <div style="color:var(--gray)">Total Countermeasures</div>
            </div>
            <div style="padding:.5rem;background:var(--light);border-radius:var(--radius)">
                <div style="font-size:1.1rem;font-weight:700;color:#059669">${provenCount.toLocaleString()}</div>
                <div style="color:var(--gray)">🏆 FHWA Proven</div>
            </div>
            <div style="padding:.5rem;background:var(--light);border-radius:var(--radius)">
                <div style="font-size:1.1rem;font-weight:700;color:#2563eb">${hsmCount}</div>
                <div style="color:var(--gray)">📘 HSM</div>
            </div>
            <div style="padding:.5rem;background:var(--light);border-radius:var(--radius)">
                <div style="font-size:1.1rem;font-weight:700;color:#7c3aed">${vaCount}</div>
                <div style="color:var(--gray)">🗺️ Virginia</div>
            </div>
        </div>
        <div style="margin-top:.75rem;font-size:.75rem;color:var(--gray);display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem">
            <span>Source: FHWA CMF Clearinghouse | 
            <a href="https://www.cmfclearinghouse.org" target="_blank" style="color:var(--primary)">cmfclearinghouse.org</a></span>
            ${cmfState.cmfVersion ? `<span style="background:var(--light);padding:.15rem .5rem;border-radius:var(--radius);font-weight:500">Version: ${cmfState.cmfVersion} | Updated: ${cmfState.cmfUpdated}</span>` : ''}
        </div>
    `;
    
    // Populate location dropdown
    populateCMFLocations();
}

function initCMFLocationDropdown() {
    // Initialize location type selector if not already done
    const typeSelector = document.getElementById('cmfLocationTypeSelector');
    if (typeSelector && !typeSelector.hasChildNodes()) {
        createLocationTypeSelector('cmfLocationTypeSelector', 'cmfLocationType', 'updateCMFLocationDropdown()', 'all');
    }

    updateCMFLocationDropdown();
}

function updateCMFLocationDropdown() {
    const select = document.getElementById('cmfLocationSelect');
    if (!select) return;

    const locationType = getSelectedLocationType('cmfLocationType');
    const lpType = locationType === 'all' ? null : locationType;

    // Round 13 — Supabase-backed, state-agnostic.
    // Falls back to the legacy R2-aggregate path when LocationPicker hasn't
    // loaded (file:// reviews, hard caching), so the existing code path stays
    // intact.
    if (window.LocationPicker && window.crashLensClient && window.crashLensClient.preferSupabase) {
        window.LocationPicker.register('cmfLocationSelect', {
            placeholder: '-- Select a route or intersection --',
            locationType: lpType,
            useOptgroups: lpType === null,
            showCrashCount: true,
            onPopulated: function (rows) {
                // Mirror rows into legacy cmfState.routeData/nodeData so the
                // existing search box (filterCMFLocations) keeps working.
                cmfState.routeData = rows
                    .filter(function (r) { return r.location_type === 'segment'; })
                    .map(function (r) {
                        return { name: r.location_name, funcClass: '', facilityType: '', areaType: '', crashes: r.total_crashes };
                    });
                cmfState.nodeData = rows
                    .filter(function (r) { return r.location_type === 'intersection'; })
                    .map(function (r) {
                        return {
                            id: r.location_name,
                            routes: new Set((r.routes_array || [])),
                            intType: '',
                            trafficCtrl: '',
                            crashes: r.total_crashes
                        };
                    });
            }
        });
        return;
    }

    // Legacy path
    populateLocationDropdown('cmfLocationSelect', {
        placeholder: '-- Select a route or intersection --',
        locationType: locationType,
        useOptgroups: locationType === 'all',
        showCrashCount: true
    });

    buildCMFSearchData();
}

function buildCMFSearchData() {
    if (!crashState.loaded) return;

    // Build road properties mapping for search
    const routeData = {};
    crashState.sampleRows.forEach(row => {
        const route = row[COL.ROUTE];
        if (!route) return;

        if (!routeData[route]) {
            routeData[route] = {
                name: route,
                funcClass: row[COL.FUNC_CLASS] || '',
                facilityType: row[COL.FACILITY_TYPE] || '',
                areaType: row[COL.AREA_TYPE] || '',
                crashes: 0
            };
        }
        routeData[route].crashes++;
    });

    // Sort routes by crash count
    const sortedRoutes = Object.values(routeData).sort((a, b) => b.crashes - a.crashes);
    cmfState.routeData = sortedRoutes;

    // Build node/intersection data
    const nodeData = {};
    crashState.sampleRows.forEach(row => {
        const node = row[COL.NODE];
        const route = row[COL.ROUTE];
        if (!node) return;

        if (!nodeData[node]) {
            nodeData[node] = {
                id: node,
                routes: new Set(),
                intType: row[COL.INT_TYPE] || '',
                trafficCtrl: row[COL.TRAFFIC_CTRL] || '',
                crashes: 0
            };
        }
        if (route) nodeData[node].routes.add(route);
        nodeData[node].crashes++;
    });

    const sortedNodes = Object.values(nodeData).sort((a, b) => b.crashes - a.crashes);
    cmfState.nodeData = sortedNodes;
}

function populateCMFLocations() {
    // Legacy function - now delegates to new init function
    initCMFLocationDropdown();
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.cmf = CL.cmf || {};
  window.loadCMFDatabase = loadCMFDatabase; CL.cmf.loadCMFDatabase = loadCMFDatabase;
  window.transformCMFData = transformCMFData; CL.cmf.transformCMFData = transformCMFData;
  window.showCMFLoadedStatus = showCMFLoadedStatus; CL.cmf.showCMFLoadedStatus = showCMFLoadedStatus;
  window.initCMFLocationDropdown = initCMFLocationDropdown; CL.cmf.initCMFLocationDropdown = initCMFLocationDropdown;
  window.updateCMFLocationDropdown = updateCMFLocationDropdown; CL.cmf.updateCMFLocationDropdown = updateCMFLocationDropdown;
  window.buildCMFSearchData = buildCMFSearchData; CL.cmf.buildCMFSearchData = buildCMFSearchData;
  window.populateCMFLocations = populateCMFLocations; CL.cmf.populateCMFLocations = populateCMFLocations;
  CL._registerModule('cmf/cmf-search');
})();
