/**
 * CL spatial.geoTier module
 *
 * Extracted from app/index.html (block L19274-L20630) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/25-spatial-geo-tier.md.
 * Responsibility: Geo dropdown population + tier selection handlers + bounds.
 *
 * Public API (back-compat dual exposure):
 *   - window.loadGeoData → CL.spatial.geoTier.loadGeoData
 *   - window.populateGeoTierDropdown → CL.spatial.geoTier.populateGeoTierDropdown
 *   - window.handleCountySelection → CL.spatial.geoTier.handleCountySelection
 *   - window.getBoundsForTier → CL.spatial.geoTier.getBoundsForTier
 *   - window.getCountyFIPSListForTier → CL.spatial.geoTier.getCountyFIPSListForTier
 *   (all other extracted decls were top-level/global before extraction and are
 *    mirrored to window verbatim to preserve zero behavior change.)
 *
 * Depends on (must load before this file): `core/tier`, `spatial/hierarchy-registry`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// ============================================================
// GEOGRAPHY-BASED TIER HELPERS (City, Town, Planning District)
// ============================================================

/**
 * In-memory cache for geography JSON data loaded from R2.
 */
const _geoDataCache = {};

/**
 * Load geography data from R2 (cached).
 * @param {string} type - 'states' | 'counties' | 'places' | 'mpos' | 'subdivisions'
 * @returns {Promise<Array>} Array of records
 */
async function loadGeoData(type) {
    if (_geoDataCache[type]) return _geoDataCache[type];

    const r2Base = (typeof R2_BASE_URL !== 'undefined') ? R2_BASE_URL : 'https://data.aicreatesai.com';
    const paths = {
        states: '/states/geography/us_states.json',
        counties: '/states/geography/us_counties.json',
        places: '/states/geography/us_places.json',
        mpos: '/states/geography/us_mpos.json',
        subdivisions: '/states/geography/us_county_subdivisions.json'
    };

    try {
        const resp = await fetch(r2Base + paths[type]);
        if (!resp.ok) throw new Error(`Failed to load ${type}: ${resp.status}`);
        const data = await resp.json();
        _geoDataCache[type] = data.records || data;
        console.log(`[Geo] Loaded ${type}: ${_geoDataCache[type].length} records`);
        return _geoDataCache[type];
    } catch (e) {
        console.warn(`[Geo] Failed to load ${type}:`, e.message);
        return [];
    }
}

/**
 * Get the current state's FIPS code (2-digit).
 */
function _getCurrentStateFips() {
    const stateSelect = document.getElementById('stateSelect');
    return stateSelect?.value || null;
}

/**
 * Get the current state's 2-letter abbreviation.
 */
function _getCurrentStateAbbr() {
    const fips = _getCurrentStateFips();
    if (!fips || typeof FIPSDatabase === 'undefined') return null;
    const stInfo = FIPSDatabase.getState(fips);
    return stInfo?.abbreviation || null;
}

/**
 * Extract place type from Census NAMELSAD (e.g. "Aurora city" → "city", "Avon town" → "town").
 */
function _extractPlaceType(namelsad) {
    if (!namelsad) return 'place';
    const lower = namelsad.toLowerCase();
    if (lower.endsWith(' city')) return 'city';
    if (lower.endsWith(' town')) return 'town';
    if (lower.endsWith(' village')) return 'village';
    if (lower.endsWith(' borough')) return 'borough';
    if (lower.endsWith(' cdp')) return 'cdp';
    if (lower.endsWith(' township')) return 'township';
    return 'place';
}

/**
 * Fix 2a — small registry of {slug, place-record} for the active state's
 * places, populated by populateGeoTierDropdown() and consumed by
 * handleCitySelection() to discover a city's parent county. Pre-existing
 * data files (us_places.json) don't carry COUNTY at the place level, so we
 * resolve it via TIGERweb spatial intersection just-in-time and cache the
 * result on the place record.
 */
window.CL = window.CL || {};
CL.geo = CL.geo || {};
CL.geo.places = CL.geo.places || {};

function _placeSlugFor(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

/**
 * Find an existing jurisdiction key in appConfig.jurisdictions by 5-digit
 * county FIPS (state+county). Returns null when no entry matches — the
 * caller should treat that as "leave jurisdictionContext alone."
 *
 * State-agnostic — relies on appConfig being already populated for the
 * active state, which is true any time handleCitySelection() can run.
 */
function lookupCountyKeyByFips(fips5) {
    if (typeof appConfig === 'undefined' || !appConfig || !appConfig.jurisdictions) return null;
    var target = String(fips5 || '').padStart(5, '0');
    if (target.length !== 5) return null;
    var stateFipsFromTarget = target.substring(0, 2);
    // Resolve active state FIPS from every plausible source in priority order.
    // jurisdictionContext.stateFips is the canonical runtime value; the
    // appConfig sources are fallbacks for early-boot calls. Final fallback:
    // read the dropdown directly. State-agnostic.
    var appStateFips = null;
    if (typeof jurisdictionContext !== 'undefined' && jurisdictionContext && jurisdictionContext.stateFips) {
        appStateFips = String(jurisdictionContext.stateFips).padStart(2, '0');
    }
    if (!appStateFips && appConfig.apis && appConfig.apis.tigerweb && appConfig.apis.tigerweb.stateFips) {
        appStateFips = String(appConfig.apis.tigerweb.stateFips).padStart(2, '0');
    }
    if (!appStateFips && appConfig.state && appConfig.state.fips) {
        appStateFips = String(appConfig.state.fips).padStart(2, '0');
    }
    if (!appStateFips) {
        try {
            var _stSel = document.getElementById('stateSelect');
            if (_stSel && _stSel.value) appStateFips = String(_stSel.value).padStart(2, '0');
        } catch (e) { /* non-fatal */ }
    }
    for (var k in appConfig.jurisdictions) {
        if (!Object.prototype.hasOwnProperty.call(appConfig.jurisdictions, k)) continue;
        var j = appConfig.jurisdictions[k];
        if (!j) continue;
        // Different state configs key FIPS differently. Try every plausible
        // shape and normalize to a 5-digit string before comparing.
        //   Virginia / legacy:  j.fullFips = "51087"
        //   Delaware / modern:  j.fips     = "001" (3-digit county only,
        //                       paired with appStateFips = "10")
        //   Hybrid:             j.stateFips + j.countyFips, or j.state + j.county
        var candidates = [];
        if (j.fullFips) candidates.push(String(j.fullFips));
        if (j.fips5) candidates.push(String(j.fips5));
        if (j.stateFips != null && j.countyFips != null) {
            candidates.push(
                String(j.stateFips).padStart(2, '0') +
                String(j.countyFips).padStart(3, '0')
            );
        }
        // Numeric state + county pair (some configs use 'state'/'county' keys
        // with FIPS digits — only treat as FIPS when both are numeric, since
        // many configs use j.state="DE" as a 2-letter abbreviation instead).
        if (j.state != null && j.county != null && /^\d+$/.test(String(j.state)) && /^\d+$/.test(String(j.county))) {
            candidates.push(
                String(j.state).padStart(2, '0') +
                String(j.county).padStart(3, '0')
            );
        }
        // 3-digit county FIPS combined with the active state's FIPS.
        if (j.fips && String(j.fips).length <= 3 && appStateFips) {
            candidates.push(appStateFips + String(j.fips).padStart(3, '0'));
        }
        // 4-5 digit fips field — already a (partial) full FIPS.
        if (j.fips && String(j.fips).length >= 4) {
            candidates.push(String(j.fips).padStart(5, '0'));
        }
        for (var i = 0; i < candidates.length; i++) {
            if (candidates[i].padStart(5, '0') === target) return k;
        }
    }
    return null;
}

/**
 * Resolve the parent county FIPS-3 for a place using its centroid + the
 * TIGERweb counties layer (point-in-polygon spatial intersect). Cached on
 * the place record so repeat selections are free. Returns null when the
 * place lacks coordinates or TIGERweb is unreachable — caller falls back
 * to whatever jurisdictionContext already has.
 */
async function _resolvePlaceParentCountyFips(place, stateFips) {
    if (!place || !stateFips) return null;
    if (place._parentCountyFips) return place._parentCountyFips;       // cached hit

    // Some Census subdivisions already carry COUNTY directly (CCDs/townships).
    if (place.COUNTY) {
        place._parentCountyFips = String(place.COUNTY).padStart(3, '0');
        return place._parentCountyFips;
    }

    var lat = parseFloat(place.INTPTLAT || place.CENTLAT);
    var lon = parseFloat(place.INTPTLON || place.CENTLON);
    if (!isFinite(lat) || !isFinite(lon)) return null;

    try {
        // TIGERweb counties layer = 82. Spatial point-in-polygon. Filter to
        // the active state to defend against places that straddle a border.
        var base = (typeof TIGERWEB_BASE !== 'undefined' && TIGERWEB_BASE)
            ? TIGERWEB_BASE
            : 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer';
        var url = base + '/82/query?' +
            'geometry=' + encodeURIComponent(lon + ',' + lat) +
            '&geometryType=esriGeometryPoint&inSR=4326' +
            '&spatialRel=esriSpatialRelIntersects' +
            '&outFields=COUNTY,STATE,NAME,GEOID' +
            '&returnGeometry=false&f=json';
        var resp = await fetch(url);
        if (!resp.ok) return null;
        var data = await resp.json();
        var feats = (data && data.features) || [];
        var match = null;
        for (var i = 0; i < feats.length; i++) {
            var attrs = feats[i] && feats[i].attributes;
            if (attrs && String(attrs.STATE).padStart(2, '0') === String(stateFips).padStart(2, '0')) {
                match = attrs;
                break;
            }
        }
        if (!match && feats.length) match = feats[0].attributes;
        if (!match || !match.COUNTY) return null;
        place._parentCountyFips = String(match.COUNTY).padStart(3, '0');
        place._parentCountyName = match.NAME || null;
        return place._parentCountyFips;
    } catch (e) {
        return null;
    }
}

/**
 * Populate the merged City / Town dropdown from geography JSON data.
 * Combines places (cities, towns, villages, CDPs) with active subdivisions (townships).
 */
async function populateGeoTierDropdown() {
    const select = document.getElementById('tierCitySelect');
    if (!select) return;

    select.innerHTML = '<option value="">Loading...</option>';

    const stateFips = _getCurrentStateFips();
    if (!stateFips) {
        select.innerHTML = '<option value="">Select a state first</option>';
        return;
    }

    try {
        // ── Merged City / Town dropdown ──
        // Combine: (1) all active places (cities, villages, CDPs, boroughs)
        //          (2) active subdivisions/townships (FUNCSTAT A/B/G) from states that use them
        // Deduplicate by name — prefer places entry if both exist (has richer NAMELSAD)
        const places = await loadGeoData('places');
        const activePlaces = places.filter(p =>
            p.STATE === stateFips && p.FUNCSTAT === 'A'
        );

        // Also load subdivisions — townships in New England, Midwest, Iowa (FUNCSTAT G)
        const activeFuncstat = new Set(['A', 'B', 'G']);
        const subs = await loadGeoData('subdivisions');
        const activeSubdivisions = subs.filter(s =>
            s.STATE === stateFips && activeFuncstat.has(s.FUNCSTAT)
        );

        // Build merged list with deduplication (places win over subdivisions)
        const seen = new Set();
        const merged = [];

        // Add all places first (they have NAMELSAD with type suffix)
        activePlaces.forEach(p => {
            const key = (p.NAME || '').toLowerCase();
            seen.add(key);
            merged.push({
                name: p.NAME || p.BASENAME,
                displayName: p.NAMELSAD || p.NAME || p.BASENAME, // e.g. "Aurora city", "Avon town"
                slug: key.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
                type: _extractPlaceType(p.NAMELSAD),
                source: 'place'
            });
        });

        // Add subdivisions not already covered by places
        activeSubdivisions.forEach(s => {
            const key = (s.NAME || '').toLowerCase();
            if (!seen.has(key)) {
                seen.add(key);
                merged.push({
                    name: s.NAME || s.BASENAME,
                    displayName: (s.NAMELSAD || s.NAME || s.BASENAME),
                    slug: key.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
                    type: 'township',
                    source: 'subdivision'
                });
            }
        });

        // Sort alphabetically by display name
        merged.sort((a, b) => a.displayName.localeCompare(b.displayName));

        if (merged.length === 0) {
            select.innerHTML = '<option value="">No cities/towns available for this state</option>';
        } else {
            select.innerHTML = '<option value="">Select a city / town...</option>';
            merged.forEach(item => {
                const opt = document.createElement('option');
                opt.value = item.slug;
                opt.textContent = item.displayName;
                opt.dataset.type = item.type; // Store type for R2 path routing
                select.appendChild(opt);
            });
        }
        // Fix 2a — register slug → place record so handleCitySelection() can
        // look up centroid coords + (eventually) parent county FIPS without
        // re-scanning the full us_places.json on every city click.
        CL.geo.places = {};
        activePlaces.forEach(p => {
            const slug = _placeSlugFor(p.NAME);
            if (slug) CL.geo.places[slug] = p;
        });
        activeSubdivisions.forEach(s => {
            const slug = _placeSlugFor(s.NAME);
            if (slug && !CL.geo.places[slug]) CL.geo.places[slug] = s;
        });
        console.log(`[Geo] Populated ${merged.length} cities/towns for FIPS ${stateFips} (${activePlaces.length} places + ${activeSubdivisions.length} subdivisions, deduped)`);
    } catch (e) {
        console.error(`[Geo] Failed to populate city/town dropdown:`, e);
        select.innerHTML = '<option value="">Failed to load city/town list</option>';
    }
}

/**
 * Populate the Planning District dropdown from hierarchy.json.
 */
function populatePlanningDistrictDropdown() {
    const select = document.getElementById('tierPlanningDistrictSelect');
    if (!select) return;

    const hierarchy = (typeof HierarchyRegistry !== 'undefined') ? HierarchyRegistry.getData() : null;
    if (!hierarchy) {
        select.innerHTML = '<option value="">No hierarchy data available</option>';
        return;
    }

    // Look for planningDistricts, then fall back to regions if regionType indicates PDs
    let pds = hierarchy.planningDistricts || {};
    if (Object.keys(pds).length === 0 && hierarchy.regions) {
        // Use regions as planning districts (most states use regions as their PD equivalent)
        pds = hierarchy.regions;
    }

    select.innerHTML = '<option value="">Select a planning district...</option>';
    Object.entries(pds).forEach(([key, val]) => {
        if (key.startsWith('_')) return;
        const name = (typeof val === 'object') ? (val.name || val.shortName || key) : key;
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = name;
        select.appendChild(opt);
    });

    console.log(`[Tier] Populated ${Object.keys(pds).length} planning districts`);
}

/**
 * Handle planning district selection.
 * Mirrors handleRegionSelection: updates context, toggles UI, draws a boundary,
 * loads aggregates, triggers CSV load, and dispatches a tierChanged event so
 * downstream tabs (school, transit, AI) can react.
 */
async function handlePlanningDistrictSelection() {
    try {
        const select = document.getElementById('tierPlanningDistrictSelect');
        const pdId = select?.value;
        if (!pdId) {
            if (typeof removePlanningDistrictBoundaryLayer === 'function') removePlanningDistrictBoundaryLayer();
            return;
        }

        const hierarchy = (typeof HierarchyRegistry !== 'undefined') ? HierarchyRegistry.getData() : null;
        const pdSource = hierarchy?.planningDistricts?.[pdId] || hierarchy?.regions?.[pdId] || null;
        const pdName = select.options[select.selectedIndex]?.textContent || pdId;

        jurisdictionContext.tierPlanningDistrict = pdSource
            ? { id: pdId, name: pdName, ...pdSource }
            : { id: pdId, name: pdName };

        if (typeof updateTierSelectorUI === 'function') updateTierSelectorUI('planning_district');
        if (typeof updateAppSubtitle === 'function') updateAppSubtitle(getJurisdictionLabel());
        if (typeof updateMapSearchPlaceholder === 'function') updateMapSearchPlaceholder();
        if (typeof updateMapScopeLabel === 'function') updateMapScopeLabel();

        // Clear competing boundaries — PD takes precedence while selected
        if (typeof removeRegionBoundaryLayer === 'function') removeRegionBoundaryLayer();
        if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
        if (typeof removeCityBoundaryLayer === 'function') removeCityBoundaryLayer();
        if (typeof removeJurisdictionBoundaryLayer === 'function') {
            removeJurisdictionBoundaryLayer();
            builtInLayersState.jurisdictionBoundary.enabled = false;
        }

        try {
            if (pdSource && typeof displayPlanningDistrictBoundary === 'function') {
                displayPlanningDistrictBoundary(pdSource, pdId);
            }
        } catch (boundaryErr) {
            console.warn('[Tier] displayPlanningDistrictBoundary failed (non-fatal, continuing to data fetch):', boundaryErr && boundaryErr.message);
        }

        const stateKey = _resolveActiveState();
        try {
            const pdAgg = await AggregateLoader.loadPlanningDistrict(stateKey, pdId);
            if (pdAgg) console.log(`[Tier] PD aggregate loaded: ${Object.keys(pdAgg).length} keys`);
        } catch (e) {
            console.warn('[Tier] PD aggregate load failed:', e.message);
        }
        console.log(`[Tier] Planning district selected: ${pdId} (${pdName})`);

        // PD tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
        try {
            // Reset stale R2 state before Supabase fetch
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRowsLoaded = false;
            }
            try { updateDataConnectionStatus('connected'); } catch (e2) {}
            try {
                if (CL.data && CL.data.mapBridge && CL.data.mapBridge.attach) {
                    CL.data.mapBridge.attach();
                    CL.data.mapBridge.refresh();
                }
            } catch (mb) { /* non-fatal */ }
            console.log('[Tier] PD view using Supabase matview (R2 download skipped)');
            console.log('[CrashLens] Data loaded at', new Date().toISOString(),
                        'source: supabase-matview-pd, rows:', (crashState && crashState.totalRows) || 0);
        } catch (e) {
            console.warn('[Tier] PD Supabase bridge failed:', e.message);
        }

        document.dispatchEvent(new CustomEvent('tierChanged', {
            detail: {
                tier: 'planning_district',
                scopeKey: (typeof getTierScopeKey === 'function') ? getTierScopeKey('planning_district') : pdId
            }
        }));
    } catch (e) {
        console.error('[Tier] handlePlanningDistrictSelection failed:', e && e.message, e && e.stack);
    }
    // Fix D2 belt-and-suspenders unlock — radios self-heal regardless of branch.
    try {
        if (typeof showFilterLoadingState === 'function') showFilterLoadingState(false);
        if (typeof showRefreshButton === 'function') showRefreshButton();
    } catch (uiErr) { /* non-fatal */ }
}

/**
 * Handle county selection from the top-card County dropdown. Mirrors the
 * picked value into the canonical bottom-card jurisdictionSelect (kept in
 * the DOM but visually hidden so the ~30 existing read sites still work),
 * then defers to saveJurisdictionSelection() for the persistence + reload
 * pipeline. Finally re-renders the Active Scope card so the read-only text
 * reflects the new county.
 */
function handleCountySelection() {
    try {
        const top = document.getElementById('tierCountySelect');
        const bottom = document.getElementById('jurisdictionSelect');
        if (!top) return;
        if (bottom && bottom.value !== top.value) {
            bottom.value = top.value;
        }
        if (typeof saveJurisdictionSelection === 'function') {
            saveJurisdictionSelection();
        }
        if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.renderTierScopeCard) {
            CL.upload.tierUI.renderTierScopeCard('county');
        }
    } catch (e) {
        console.error('[Tier] handleCountySelection failed:', e);
    }
}

/**
 * Handle city / town selection from the merged dropdown.
 * Mirrors handleMPOSelection: updates context, toggles UI, fetches and draws a
 * TIGERweb boundary, loads aggregates, triggers CSV load, and dispatches a
 * tierChanged event. The boundary fetch is fire-and-forget so CSV loading is
 * not blocked on the Census API.
 */
async function handleCitySelection() {
    try {
        const select = document.getElementById('tierCitySelect');
        const slug = select?.value;
        if (!slug) {
            if (typeof removeCityBoundaryLayer === 'function') removeCityBoundaryLayer();
            return;
        }

        const selectedOption = select.options[select.selectedIndex];
        const displayName = selectedOption?.textContent || slug;
        const placeType = selectedOption?.dataset?.type || 'city';

        jurisdictionContext.tierCity = { id: slug, name: displayName, type: placeType };

        // Fix 2a — reassign jurisdictionContext to the city's parent county
        // BEFORE any path resolution or data fetch. Without this, a stale
        // previous-county selection (e.g. Kent from before the user picked
        // Ardentown which is in New Castle) leaks into the R2 path
        // (delaware/kent/county_roads.parquet) and any other code that reads
        // jurisdictionContext.jurisdictionKey. State-agnostic — uses
        // CL.geo.places (populated by populateGeoTierDropdown) + a TIGERweb
        // point-in-polygon spatial query, no city→county hardcoding.
        try {
            const place = (CL.geo && CL.geo.places) ? CL.geo.places[slug] : null;
            if (place) {
                const fips2 = String(jurisdictionContext.stateFips || _getCurrentStateFips() || '').padStart(2, '0');
                let fips3 = String(place._parentCountyFips || place.COUNTY || '').padStart(3, '0').replace(/^0+$/, '');
                if (!fips3 && fips2) {
                    fips3 = await _resolvePlaceParentCountyFips(place, fips2);
                }
                if (fips2 && fips3) {
                    const fips5 = fips2 + String(fips3).padStart(3, '0');
                    const parentCountyKey = lookupCountyKeyByFips(fips5);
                    if (parentCountyKey && parentCountyKey !== jurisdictionContext.jurisdictionKey) {
                        const prevKey = jurisdictionContext.jurisdictionKey;
                        console.log('[Tier] City ' + slug + ' → reassigning parent county from ' + prevKey + ' to ' + parentCountyKey);
                        jurisdictionContext.jurisdictionKey = parentCountyKey;
                        jurisdictionContext.fullFips = fips5;
                        jurisdictionContext.countyFips = String(fips3).padStart(3, '0');
                        const parentJur = appConfig.jurisdictions[parentCountyKey];
                        if (parentJur) {
                            jurisdictionContext.physicalJurisName = (Array.isArray(parentJur.namePatterns) && parentJur.namePatterns[0]) || jurisdictionContext.physicalJurisName;
                            jurisdictionContext.jurisdictionName = parentJur.fullName || parentJur.name || jurisdictionContext.jurisdictionName;
                        } else if (place._parentCountyName) {
                            jurisdictionContext.physicalJurisName = place._parentCountyName.replace(/\s+County$/i, '');
                        }
                    } else if (!parentCountyKey) {
                        // Fix E — surface the silent "FIPS resolved but no
                        // matching jurisdiction" path so config bugs are
                        // visible in DevTools instead of looking like a
                        // generic data issue.
                        console.warn('[Tier] City ' + slug + ' → fips5=' + fips5 +
                            ' has no matching county in appConfig.jurisdictions; reassignment skipped.');
                    }
                    // else: parentCountyKey === current — nothing to do, intentional silence.
                } else {
                    // Fix E — surface the silent "geo data couldn't resolve
                    // the parent county" path. Likely cause: place record
                    // missing INTPTLAT/INTPTLON, or TIGERweb spatial query
                    // returned no match.
                    console.warn('[Tier] City ' + slug + ' → could not resolve parent county fips (fips2="' +
                        fips2 + '", fips3="' + fips3 + '"); reassignment skipped.');
                }
            } else {
                console.warn('[Tier] City selected (' + slug + ') but no place record found in CL.geo.places — county jurisdiction NOT updated');
            }
        } catch (e) {
            console.warn('[Tier] City→county reassignment failed (non-fatal):', e && e.message);
        }

        if (typeof updateTierSelectorUI === 'function') updateTierSelectorUI('city');
        if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.renderTierScopeCard) {
            CL.upload.tierUI.renderTierScopeCard('city');
        }
        if (typeof updateMapSearchPlaceholder === 'function') updateMapSearchPlaceholder();
        // Page subtitle (".jurisdiction-subtitle"), map stats scope label and
        // any header reading getJurisdictionLabel() should now reflect the
        // city — county dropdown stays locked at the parent county.
        if (typeof updateAppSubtitle === 'function') updateAppSubtitle(displayName);
        if (typeof updateMapScopeLabel === 'function') updateMapScopeLabel();

        // Clear competing boundaries — city takes precedence while selected
        if (typeof removeRegionBoundaryLayer === 'function') removeRegionBoundaryLayer();
        if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
        if (typeof removePlanningDistrictBoundaryLayer === 'function') removePlanningDistrictBoundaryLayer();
        if (typeof removeJurisdictionBoundaryLayer === 'function') {
            removeJurisdictionBoundaryLayer();
            builtInLayersState.jurisdictionBoundary.enabled = false;
        }

        try {
            if (typeof displayCityBoundary === 'function') {
                displayCityBoundary(slug, displayName, placeType).catch(e =>
                    console.warn('[Tier] City boundary fetch failed:', e.message)
                );
            }
        } catch (boundaryErr) {
            console.warn('[Tier] displayCityBoundary failed (non-fatal, continuing to data fetch):', boundaryErr && boundaryErr.message);
        }

        const stateKey = _resolveActiveState();

        // Supabase-first: paint instant KPI placeholders, then kick off a
        // dashboard_summary fetch with the new city scope. The R2 fallback
        // still runs below, but the user sees real numbers in ~1s instead
        // of waiting on the parquet pipeline.
        try {
            if (CL.data && CL.data.supabaseBridge) {
                if (CL.data.supabaseBridge.showSkeletonKPIs) {
                    CL.data.supabaseBridge.showSkeletonKPIs();
                }
                if (CL.data.supabaseBridge.injectFastDashboard) {
                    CL.data.supabaseBridge.injectFastDashboard({ force: true });
                }
                // Warm cache for the parent county tier in the background so
                // navigating up is instant (Phase 6 §6.6 prefetchTier).
                if (window.crashLensClient && typeof window.crashLensClient.prefetchTier === 'function'
                    && typeof jurisdictionContext !== 'undefined' && jurisdictionContext.jurisdictionName) {
                    window.crashLensClient.prefetchTier('county', jurisdictionContext.jurisdictionName, {});
                }
            }
        } catch (e) { /* non-fatal */ }

        try {
            const cityAgg = await AggregateLoader.loadCity(stateKey, slug);
            if (cityAgg) console.log(`[Tier] City aggregate loaded: ${Object.keys(cityAgg).length} keys`);
        } catch (e) {
            // Per-city aggregates.json doesn't exist on R2 — Supabase is the
            // canonical source post-migration. Silenced.
        }
        console.log(`[Tier] City/Town selected: ${slug} (${displayName}, type=${placeType})`);

        // Fix 2b — explicit "skip R2" log + crashState.loaded flag, mirroring
        // the Fix 1 county-rollup pattern. R2 is already not called from
        // handleCitySelection (see note below), but downstream paths
        // (saveFilterProfile, lazy detail tab loaders) still gate on
        // crashState.loaded — ensure it's set so they don't try to refetch
        // the wrong county's parquet.
        try {
            const tierResolved = (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier)
                ? CL.data.supabaseBridge.resolveTier()
                : null;
            if (tierResolved && tierResolved.tier === 'county' && tierResolved.value
                && jurisdictionContext.viewTier === 'city') {
                console.log('[Tier] City view using Supabase matview (R2 download skipped)');
                if (typeof crashState !== 'undefined') {
                    crashState.loaded = true;
                    crashState.sampleRowsLoaded = false;
                }
                // Re-enable the Road Type radios + Refresh button. Same
                // pattern as the county-rollup branch in saveJurisdictionSelection
                // and the aggregate-tier path at line ~33252 — without this,
                // a city pick that converged via the Supabase matview leaves
                // the radios stuck disabled (opacity .6 + pointer-events:none)
                // and the Refresh button stuck on "⏳ Loading..." (Fix D).
                try {
                    if (typeof showFilterLoadingState === 'function') showFilterLoadingState(false);
                    if (typeof showRefreshButton === 'function') showRefreshButton();
                } catch (uiErr) { /* non-fatal */ }
            }
        } catch (skipErr) { /* non-fatal */ }

        // NOTE: do NOT call autoLoadCrashData() here. R2 has no per-city
        // parquet, so the fallback chain would load the parent (or worse,
        // the most-recently-viewed) county's parquet — Bug 1: city view
        // showing 87,073 Sussex crashes for Bellefonte. Supabase preflight
        // above already paints the correct city numbers. Detail tabs that
        // need row-level data will trigger their own fetch via the lazy
        // loader on demand.

        document.dispatchEvent(new CustomEvent('tierChanged', {
            detail: {
                tier: 'city',
                scopeKey: (typeof getTierScopeKey === 'function') ? getTierScopeKey('city') : slug
            }
        }));
    } catch (e) {
        console.error('[Tier] handleCitySelection failed:', e && e.message, e && e.stack);
    }
    // Fix D2 belt-and-suspenders: regardless of which branch we took above,
    // guarantee the radios are clickable when handleCitySelection completes.
    // The bridge fetch is still in flight async, but the user can already
    // start switching road types — the bridge debounces internally.
    try {
        if (typeof showFilterLoadingState === 'function') showFilterLoadingState(false);
        if (typeof showRefreshButton === 'function') showRefreshButton();
    } catch (uiErr) { /* non-fatal */ }
}

/**
 * Load statewide CSV from R2 for the state view tier.
 * Fetches the gzipped CSV (browser auto-decompresses via Content-Encoding: gzip),
 * parses it through the same Papa.parse → processRow pipeline as county data,
 * and populates crashState so Dashboard, Map, Analysis, etc. work at state level.
 *
 * @param {string} stateKey - State key (e.g., 'colorado', 'virginia')
 */
async function loadStatewideCSVForTier(stateKey) {
    console.log(`[Tier] Loading statewide CSV for ${stateKey}...`);

    const csvText = await AggregateLoader.loadStatewideCSV(stateKey);
    if (!csvText) {
        console.warn(`[Tier] No statewide CSV available for ${stateKey} — tabs will use aggregates only`);
        return;
    }

    // Reset crash state before populating with statewide data
    if (typeof resetState === 'function') resetState();

    const loadingTitle = document.getElementById('loadingTitle');
    const loadingSubtitle = document.getElementById('loadingSubtitle');
    if (CL.upload?.tierUI?.setUploadZoneCompact) CL.upload.tierUI.setUploadZoneCompact(false);
    if (loadingTitle) loadingTitle.textContent = `Loading Statewide Data...`;
    if (loadingSubtitle) loadingSubtitle.textContent = `Parsing ${stateKey} statewide crash records...`;

    const startTime = Date.now();
    let rowCount = 0;

    return new Promise((resolve, reject) => {
        let stateDetected = false;
        Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
            chunk: function(results) {
                // Auto-detect state from first chunk headers
                if (!stateDetected && results.meta?.fields) {
                    if (typeof StateAdapter !== 'undefined') {
                        StateAdapter.detect(results.meta.fields);
                    }
                    stateDetected = true;
                }
                results.data.forEach(row => {
                    try {
                        const normalized = (typeof StateAdapter !== 'undefined' && StateAdapter.needsNormalization())
                            ? StateAdapter.normalizeRow(row) : row;
                        processRow(normalized);
                        rowCount++;
                    } catch (e) { /* skip malformed rows */ }
                });
            },
            complete: function() {
                crashState.totalRows = rowCount;
                crashState.loaded = true;
                console.log('[CrashLens] Data loaded at', new Date().toISOString(),
                            'source: statewide-csv, rows:', rowCount);
                if (CL && CL.data && CL.data.lazyLoader) CL.data.lazyLoader.markR2Loaded();
                if (CL && CL.data && CL.data.supabaseBridge) CL.data.supabaseBridge.onR2LoadComplete();
                if (typeof finalizeData === 'function') finalizeData();
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
                console.log(`[Tier] Statewide CSV parsed: ${rowCount.toLocaleString()} records in ${elapsed}s`);

                if (loadingTitle) loadingTitle.textContent = 'Statewide Data Loaded';
                if (loadingSubtitle) loadingSubtitle.textContent = `${rowCount.toLocaleString()} records (${stateKey})`;

                // Refresh visible tabs
                if (typeof showUploadSummary === 'function') showUploadSummary();
                if (typeof initDropdowns === 'function') initDropdowns();

                // Notify subscribers (Dashboard, Safety Focus, the active-tab
                // refresh listener at the bottom of this file) that data is
                // ready. Without this dispatch the user has to switch tabs
                // and back to see populated detail tabs.
                document.dispatchEvent(new CustomEvent('crashDataLoaded', {
                    detail: { source: 'statewide-csv', rowCount }
                }));
                resolve(rowCount);
            },
            error: function(err) {
                console.error('[Tier] Statewide CSV parse error:', err);
                reject(err);
            }
        });
    });
}

function populateRegionDropdown() {
    const select = document.getElementById('tierRegionSelect');
    if (!select) return;
    const regions = HierarchyRegistry.getRegions();
    const label = HierarchyRegistry.getRegionTypeLabel(false);
    select.innerHTML = `<option value="">Select a ${label}...</option>`;
    regions.forEach(r => {
        select.innerHTML += `<option value="${r.id}">${r.shortName || r.name} (${r.counties.length} counties)</option>`;
    });
}

function populateMPODropdown() {
    const select = document.getElementById('tierMPOSelect');
    if (!select) return;
    const mpos = HierarchyRegistry.getMPOs();
    const tprs = HierarchyRegistry.getRuralTPRs();
    // Filter out NTAD-sourced entries with 0 counties (duplicates of manual entries)
    const validMpos = mpos.filter(m => m.counties && m.counties.length > 0);
    const validTprs = tprs.filter(t => t.counties && t.counties.length > 0);
    select.innerHTML = '<option value="">Select an MPO/TPR...</option>';
    if (validMpos.length > 0) {
        select.innerHTML += '<optgroup label="Metropolitan Planning Organizations">';
        validMpos.forEach(m => {
            select.innerHTML += `<option value="${m.id}">${m.shortName || m.name} (${m.counties.length} counties)</option>`;
        });
        select.innerHTML += '</optgroup>';
    }
    if (validTprs.length > 0) {
        select.innerHTML += '<optgroup label="Rural Transportation Planning Regions">';
        validTprs.forEach(t => {
            select.innerHTML += `<option value="${t.id}">${t.shortName || t.name} (${t.counties.length} counties)</option>`;
        });
        select.innerHTML += '</optgroup>';
    }
}

async function handleRegionSelection() {
    try {
        const select = document.getElementById('tierRegionSelect');
        const regionId = select?.value;
        if (!regionId) {
            if (typeof removeRegionBoundaryLayer === 'function') removeRegionBoundaryLayer();
            return;
        }

        const hierarchy = HierarchyRegistry.getData();
        const region = hierarchy?.regions?.[regionId];
        if (!region) return;

        jurisdictionContext.tierRegion = { id: regionId, ...region };
        updateTierSelectorUI('region');
        if (typeof updateAppSubtitle === 'function') updateAppSubtitle(getJurisdictionLabel());
        if (typeof updateMapSearchPlaceholder === 'function') updateMapSearchPlaceholder();
        if (typeof updateMapScopeLabel === 'function') updateMapScopeLabel();

        // Clear MPO boundary if any
        if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();

        // Clear county jurisdiction boundary — region boundary replaces it
        if (typeof removeJurisdictionBoundaryLayer === 'function') {
            removeJurisdictionBoundaryLayer();
            builtInLayersState.jurisdictionBoundary.enabled = false;
        }

        // Display region boundary on map (uses mapBounds or center/zoom from hierarchy).
        // The data path MUST NOT depend on map state — wrap the boundary draw in
        // its own try/catch so a future map error never blocks the Supabase fetch.
        try {
            if (typeof displayRegionBoundary === 'function') {
                displayRegionBoundary(region, regionId);
            } else if (region.center && crashMap && typeof crashMap.flyTo === 'function') {
                safeFlyTo(crashMap, [region.center[1], region.center[0]], region.zoom || 8, { duration: 1.2 });
            }
        } catch (boundaryErr) {
            console.warn('[Tier] displayRegionBoundary failed (non-fatal, continuing to data fetch):', boundaryErr && boundaryErr.message);
        }

        // Load region aggregate
        // Use _getActiveStateKey() for full state name (e.g., 'colorado') — NOT abbreviation ('co')
        // R2 paths require full state key: colorado/_region/{regionId}/aggregates.json
        const stateKey = _resolveActiveState();
        const regionAgg = await AggregateLoader.loadRegion(stateKey, regionId);
        if (regionAgg) console.log(`[Tier] Region aggregate loaded: ${Object.keys(regionAgg).length} keys`);
        console.log(`[Tier] Region selected: ${region.shortName || region.name}, ${region.counties.length} counties`);

        // Region tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
        // Region R2 files can be 300K+ rows which causes browser OOM.
        try {
            // Reset stale R2 state before Supabase fetch
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRowsLoaded = false;
            }
            try { updateDataConnectionStatus('connected'); } catch (e2) {}
            try {
                if (CL.data && CL.data.mapBridge && CL.data.mapBridge.attach) {
                    CL.data.mapBridge.attach();
                    CL.data.mapBridge.refresh();
                }
            } catch (mb) { /* non-fatal */ }
            console.log('[Tier] Region view using Supabase matview (R2 download skipped)');
            console.log('[CrashLens] Data loaded at', new Date().toISOString(),
                        'source: supabase-matview-region, rows:', (crashState && crashState.totalRows) || 0);
        } catch (e) {
            console.warn('[Tier] Region Supabase bridge failed:', e.message);
        }

        // Dispatch tierChanged event for school/transit tabs
        document.dispatchEvent(new CustomEvent('tierChanged', { detail: { tier: 'region', scopeKey: getTierScopeKey('region') } }));
    } catch (e) {
        console.error('[Tier] handleRegionSelection failed:', e && e.message, e && e.stack);
    }
    // Fix D2 belt-and-suspenders unlock — radios self-heal regardless of branch.
    try {
        if (typeof showFilterLoadingState === 'function') showFilterLoadingState(false);
        if (typeof showRefreshButton === 'function') showRefreshButton();
    } catch (uiErr) { /* non-fatal */ }
}

async function handleMPOSelection() {
    try {
        const select = document.getElementById('tierMPOSelect');
        const mpoId = select?.value;
        if (!mpoId) {
            // Clear MPO boundary when deselected
            if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
            return;
        }

        const hierarchy = HierarchyRegistry.getData();
        const mpo = hierarchy?.tprs?.[mpoId];
        if (!mpo) return;

        jurisdictionContext.tierMpo = { id: mpoId, ...mpo };
        updateTierSelectorUI('mpo');
        if (typeof updateAppSubtitle === 'function') updateAppSubtitle(getJurisdictionLabel());
        if (typeof updateMapSearchPlaceholder === 'function') updateMapSearchPlaceholder();
        if (typeof updateMapScopeLabel === 'function') updateMapScopeLabel();

        // Clear previous region boundary if any
        if (typeof removeRegionBoundaryLayer === 'function') removeRegionBoundaryLayer();

        // Clear county jurisdiction boundary — MPO boundary replaces it
        if (typeof removeJurisdictionBoundaryLayer === 'function') {
            removeJurisdictionBoundaryLayer();
            builtInLayersState.jurisdictionBoundary.enabled = false;
        }

        // Load and display MPO boundary from BTS NTAD
        // Uses 3-strategy approach: acronym query → state query → spatial envelope query
        let boundary = null;
        const stateAbbr = hierarchy?.state?.abbreviation || '';
        const mpoName = (mpo.shortName || mpo.name || '').toLowerCase();
        const mpoFullName = (mpo.name || '').toLowerCase();

        // Helper: match an MPO feature by name/acronym against hierarchy entry
        function matchMPOFeature(f) {
            const p = f.properties || {};
            // Try multiple field name variants (BTS API field names can vary)
            const acronym = (p.ACRONYM || p.acronym || '').toLowerCase();
            const name = (p.MPO_NAME || p.NAME || p.MPO_name || p.name || '').toLowerCase();
            return acronym === mpoName || name.includes(mpoName) || mpoName.includes(name) ||
                   (mpoFullName && (name.includes(mpoFullName.split('(')[0].trim()) ||
                    mpoFullName.includes(name.split('(')[0].trim())));
        }

        // Strategy 1: Query by known BTS acronym (attribute where clause)
        if (mpo.btsAcronym) {
            boundary = await BoundaryService.getMPOByAcronym(mpo.btsAcronym);
            if (boundary?.features?.length > 0) {
                console.log(`[Tier] MPO boundary found via acronym query: ${mpo.btsAcronym}`);
            }
        }

        // Strategy 2: Query all MPOs for the state, match by name similarity
        if (!boundary?.features?.length && stateAbbr) {
            const stateMpos = await BoundaryService.getMPOs(stateAbbr);
            if (stateMpos?.features?.length > 0) {
                const matched = stateMpos.features.find(matchMPOFeature);
                if (matched) {
                    boundary = { type: 'FeatureCollection', features: [matched] };
                    const resolvedAcronym = matched.properties?.ACRONYM || matched.properties?.acronym;
                    if (resolvedAcronym && !mpo.btsAcronym) {
                        mpo._resolvedBtsAcronym = resolvedAcronym;
                    }
                    console.log(`[Tier] MPO boundary found via state query name match`);
                }
            }
        }

        // Strategy 3: Spatial envelope query (BTS GeoData Validator approach)
        // Uses the MPO center coordinates to create a search bounding box
        if (!boundary?.features?.length && mpo.center) {
            const lon = mpo.center[0];
            const lat = mpo.center[1];
            // Create a bounding box around the MPO center (±1 degree)
            const spatialBbox = {
                xmin: lon - 1.0, ymin: lat - 1.0,
                xmax: lon + 1.0, ymax: lat + 1.0
            };
            const spatialResult = await BoundaryService.getMPOsBySpatialQuery(spatialBbox);
            if (spatialResult?.features?.length > 0) {
                // Find the best match by name/acronym
                const matched = spatialResult.features.find(matchMPOFeature);
                if (matched) {
                    boundary = { type: 'FeatureCollection', features: [matched] };
                    const resolvedAcronym = matched.properties?.ACRONYM || matched.properties?.acronym;
                    if (resolvedAcronym && !mpo.btsAcronym) {
                        mpo._resolvedBtsAcronym = resolvedAcronym;
                    }
                    console.log(`[Tier] MPO boundary found via spatial envelope query`);
                } else {
                    // If no name match, try the closest MPO by checking if any feature contains the center
                    console.log(`[Tier] Spatial query returned ${spatialResult.features.length} MPOs but no name match for "${mpoName}"`);
                }
            }
        }

        // Display the boundary on the map. Wrapped in try/catch so a map-state
        // failure here NEVER blocks the Supabase fetch below — Bug 1 fix.
        try {
            if (boundary?.features?.length > 0) {
                // Cache the boundary GeoJSON on the MPO context for reuse when map initializes later
                jurisdictionContext.tierMpo._cachedBoundary = boundary;

                if (typeof displayMPOBoundary === 'function') {
                    displayMPOBoundary(boundary, mpoId, mpo.shortName || mpo.name);
                }
            } else if (mpo.center) {
                // Fallback: fly to MPO center from hierarchy data
                if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
                if (crashMap && typeof crashMap.flyTo === 'function') {
                    safeFlyTo(crashMap, [mpo.center[1], mpo.center[0]], mpo.zoom || 10, { duration: 1.2 });
                }
                console.log(`[Tier] No BTS boundary polygon found for ${mpo.shortName}, using hierarchy center`);
            } else if (mpo.mapBounds) {
                // Fallback: use mapBounds from hierarchy
                if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
                if (crashMap && typeof crashMap.flyToBounds === 'function') {
                    const bounds = L.latLngBounds(
                        L.latLng(mpo.mapBounds.sw[0], mpo.mapBounds.sw[1]),
                        L.latLng(mpo.mapBounds.ne[0], mpo.mapBounds.ne[1])
                    );
                    safeFlyToBounds(crashMap, bounds, { padding: [50, 50], duration: 1.2 });
                }
            }
        } catch (boundaryErr) {
            console.warn('[Tier] displayMPOBoundary failed (non-fatal, continuing to data fetch):', boundaryErr && boundaryErr.message);
        }

        // Use _getActiveStateKey() for full state name (e.g., 'colorado') — NOT abbreviation ('co')
        // R2 paths require full state key: colorado/_mpo/{mpoId}/aggregates.json
        const stateKey = _resolveActiveState();
        const mpoAgg = await AggregateLoader.loadMPO(stateKey, mpoId);
        if (mpoAgg) console.log(`[Tier] MPO aggregate loaded: ${Object.keys(mpoAgg).length} keys`);
        console.log(`[Tier] MPO selected: ${mpo.shortName || mpo.name}, ${mpo.counties.length} counties`);

        // MPO tier: use Supabase matview (pre-aggregated) instead of R2 CSV.
        // MPO R2 files can be 300K+ rows which causes browser OOM.
        try {
            // Reset stale R2 state before Supabase fetch
            if (typeof crashState !== 'undefined') {
                crashState.loaded = false;
                crashState.sampleRows = [];
                crashState.mapPoints = [];
            }
            if (CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) {
                await CL.data.supabaseBridge.injectFastDashboard({ force: true });
            }
            if (typeof crashState !== 'undefined') {
                crashState.loaded = true;
                crashState.sampleRowsLoaded = false;
            }
            try { updateDataConnectionStatus('connected'); } catch (e2) {}
            try {
                if (CL.data && CL.data.mapBridge && CL.data.mapBridge.attach) {
                    CL.data.mapBridge.attach();
                    CL.data.mapBridge.refresh();
                }
            } catch (mb) { /* non-fatal */ }
            console.log('[Tier] MPO view using Supabase matview (R2 download skipped)');
            console.log('[CrashLens] Data loaded at', new Date().toISOString(),
                        'source: supabase-matview-mpo, rows:', (crashState && crashState.totalRows) || 0);
        } catch (e) {
            console.warn('[Tier] MPO Supabase bridge failed:', e.message);
        }

        // Dispatch tierChanged event for school/transit tabs
        document.dispatchEvent(new CustomEvent('tierChanged', { detail: { tier: 'mpo', scopeKey: getTierScopeKey('mpo') } }));
    } catch (e) {
        console.error('[Tier] handleMPOSelection failed:', e && e.message, e && e.stack);
    }
    // Fix D2 belt-and-suspenders unlock — radios self-heal regardless of branch.
    try {
        if (typeof showFilterLoadingState === 'function') showFilterLoadingState(false);
        if (typeof showRefreshButton === 'function') showRefreshButton();
    } catch (uiErr) { /* non-fatal */ }
}

// ============================================================
// TIER UTILITY FUNCTIONS — Multi-Tier Data Scope Helpers
// Used by school and transit tabs to determine data scope
// ============================================================

/**
 * Get list of 3-digit county FIPS codes for the current view tier.
 * Returns null for state tier (meaning "all counties in state, no filter needed").
 * @returns {string[]|null} Array of 3-digit county FIPS strings, or null for no-filter
 */
function getCountyFIPSListForTier() {
    const tier = jurisdictionContext.viewTier;
    switch (tier) {
        case 'federal':
            // Federal tier skipped for school/transit
            return null;
        case 'state': {
            const hierarchy = HierarchyRegistry.getData();
            if (hierarchy?.allCounties) {
                return Object.keys(hierarchy.allCounties).map(f => String(f).padStart(3, '0'));
            }
            // Fallback: collect from all regions
            if (hierarchy?.regions) {
                const allFips = new Set();
                Object.values(hierarchy.regions).forEach(r => {
                    (r.counties || []).forEach(c => allFips.add(String(c).padStart(3, '0')));
                });
                return [...allFips];
            }
            return null; // no filter
        }
        case 'region': {
            const region = jurisdictionContext.tierRegion;
            if (region?.counties?.length) {
                return region.counties.map(c => String(c).padStart(3, '0'));
            }
            return [];
        }
        case 'mpo': {
            const mpo = jurisdictionContext.tierMpo;
            if (mpo?.counties?.length) {
                return mpo.counties.map(c => String(c).padStart(3, '0'));
            }
            return [];
        }
        case 'county':
        case 'city':
        default: {
            const fullFips = jurisdictionContext.fullFips;
            if (fullFips && fullFips.length >= 5) {
                return [fullFips.substring(2).padStart(3, '0')];
            }
            // Fallback from jurisdiction config
            const jurisdictions = window.appConfig?.jurisdictions || {};
            const jKey = jurisdictionContext.jurisdictionKey;
            const j = jurisdictions[jKey];
            if (j?.fips) {
                const fipsStr = String(j.fips);
                const countyPart = fipsStr.length >= 5 ? fipsStr.substring(2) : fipsStr;
                return [countyPart.padStart(3, '0')];
            }
            return [];
        }
    }
}

/**
 * Get bounding box for the current view tier.
 * @returns {{north:number, south:number, east:number, west:number}|null}
 */
function getBoundsForTier() {
    const tier = jurisdictionContext.viewTier;
    const hierarchy = HierarchyRegistry.getData();

    switch (tier) {
        case 'state': {
            if (hierarchy?.state?.bbox) {
                const [w, s, e, n] = hierarchy.state.bbox;
                return { north: n, south: s, east: e, west: w };
            }
            return null;
        }
        case 'region': {
            const region = jurisdictionContext.tierRegion;
            if (region?.mapBounds) {
                return {
                    north: region.mapBounds.ne[0],
                    south: region.mapBounds.sw[0],
                    east: region.mapBounds.ne[1],
                    west: region.mapBounds.sw[1]
                };
            }
            if (region?.center) {
                return _estimateBoundsFromCenter(region.center, region.zoom || 8);
            }
            // Fallback: union of county bounds from hierarchy
            if (region?.counties?.length && hierarchy?.state?.fips) {
                return _computeMultiCountyBounds(hierarchy.state.fips, region.counties);
            }
            return null;
        }
        case 'mpo': {
            const mpo = jurisdictionContext.tierMpo;
            if (mpo?.mapBounds) {
                return {
                    north: mpo.mapBounds.ne[0],
                    south: mpo.mapBounds.sw[0],
                    east: mpo.mapBounds.ne[1],
                    west: mpo.mapBounds.sw[1]
                };
            }
            if (mpo?.center) {
                return _estimateBoundsFromCenter(mpo.center, mpo.zoom || 10);
            }
            if (mpo?.counties?.length && hierarchy?.state?.fips) {
                return _computeMultiCountyBounds(hierarchy.state.fips, mpo.counties);
            }
            return null;
        }
        case 'county':
        case 'city':
        default: {
            const jurisdictions = window.appConfig?.jurisdictions || {};
            const jKey = jurisdictionContext.jurisdictionKey;
            const jurisdiction = jurisdictions[jKey];
            return jurisdiction ? getCountyBounds(jurisdiction) : null;
        }
    }
}

/**
 * Get a unique cache/scope key for the current tier view.
 * @returns {string}
 */
function getTierScopeKey(tierOverride) {
    // Fix 5 — accept an explicit tier override. Dispatchers like
    // handleRegionSelection / handleMPOSelection know what tier they're
    // firing for; relying on jurisdictionContext.viewTier produced a
    // mismatch when the global tier hadn't propagated yet (symptom:
    // "tier=state, scope=planning_district_*"). Falls back to
    // jurisdictionContext.viewTier when called without an argument.
    const tier = tierOverride || jurisdictionContext.viewTier;
    switch (tier) {
        case 'federal':
            return 'federal_all';
        case 'state':
            return `state_${jurisdictionContext.stateCode || jurisdictionContext.stateFips || 'unknown'}`;
        case 'region':
            return `region_${jurisdictionContext.tierRegion?.id || 'unknown'}`;
        case 'mpo':
            return `mpo_${jurisdictionContext.tierMpo?.id || 'unknown'}`;
        case 'planning_district':
            return `planning_district_${jurisdictionContext.tierPlanningDistrict?.id || 'unknown'}`;
        case 'city':
            return `city_${jurisdictionContext.tierCity?.id || 'unknown'}`;
        case 'county':
        default:
            return `county_${jurisdictionContext.fullFips || jurisdictionContext.jurisdictionKey || 'unknown'}`;
    }
}

/**
 * Get a human-readable display name for the current tier scope.
 * @returns {string}
 */
function getTierScopeName() {
    const tier = jurisdictionContext.viewTier;
    switch (tier) {
        case 'state':
            return jurisdictionContext.stateName || jurisdictionContext.tierState?.name || 'Statewide';
        case 'region': {
            const r = jurisdictionContext.tierRegion;
            const countyCount = r?.counties?.length || 0;
            return r ? `${r.shortName || r.name}${countyCount ? ` (${countyCount} counties)` : ''}` : 'Region';
        }
        case 'mpo': {
            const m = jurisdictionContext.tierMpo;
            const countyCount = m?.counties?.length || 0;
            return m ? `${m.shortName || m.name}${countyCount ? ` (${countyCount} counties)` : ''}` : 'MPO';
        }
        case 'planning_district': {
            const pd = jurisdictionContext.tierPlanningDistrict;
            const countyCount = pd?.counties?.length || 0;
            return pd ? `${pd.shortName || pd.name}${countyCount ? ` (${countyCount} counties)` : ''}` : 'Planning District';
        }
        case 'city': {
            const c = jurisdictionContext.tierCity;
            return c ? (c.name || c.id) : 'City/Town';
        }
        case 'federal':
            return 'Nationwide';
        case 'county':
        default:
            return jurisdictionContext.jurisdictionName || 'County';
    }
}

/** Estimate bounds from center [lng, lat] and zoom level */
function _estimateBoundsFromCenter(center, zoom) {
    const [lng, lat] = center;
    // Approximate degrees per pixel at given zoom
    const degreesPerTile = 360 / Math.pow(2, zoom);
    const tilesVisible = 4; // ~4 tiles visible at typical screen size
    const span = degreesPerTile * tilesVisible / 2;
    return {
        north: lat + span,
        south: lat - span,
        east: lng + span,
        west: lng - span
    };
}

/** Compute union bounds from multiple county FIPS codes by looking up jurisdiction configs */
function _computeMultiCountyBounds(stateFips, countyFipsList) {
    const jurisdictions = window.appConfig?.jurisdictions || {};
    let north = -90, south = 90, east = -180, west = 180;
    let found = false;
    const stFips = String(stateFips).padStart(2, '0');

    for (const jKey of Object.keys(jurisdictions)) {
        const j = jurisdictions[jKey];
        if (!j?.bbox) continue;
        const jFips = String(j.fips || '');
        // Match by full FIPS or county-part
        const countyPart = jFips.length >= 5 ? jFips.substring(2) : jFips;
        if (countyFipsList.includes(countyPart.padStart(3, '0'))) {
            const [w, s, e, n] = j.bbox;
            if (n > north) north = n;
            if (s < south) south = s;
            if (e > east) east = e;
            if (w < west) west = w;
            found = true;
        }
    }

    if (!found) return null;
    // Add small padding
    const padLat = (north - south) * 0.05;
    const padLng = (east - west) * 0.05;
    return { north: north + padLat, south: south - padLat, east: east + padLng, west: west - padLng };
}

/**
 * Ensure the appropriate boundary overlay is displayed for the current tier.
 * Called when loading school/transit data at higher tiers.
 */
async function ensureTierBoundaryDisplayed() {
    const tier = jurisdictionContext.viewTier;
    try {
        if (tier === 'region') {
            const region = jurisdictionContext.tierRegion;
            if (region && typeof displayRegionBoundary === 'function') {
                // Check if region boundary is already displayed
                if (!builtInLayersState.regionBoundary?.layer) {
                    displayRegionBoundary(region, region.id);
                    console.log('[Tier] Ensured region boundary displayed for asset loading');
                }
            }
        } else if (tier === 'mpo') {
            // MPO boundary requires a BTS query — check if already displayed
            if (!builtInLayersState.mpoBoundary?.layer) {
                // Trigger the MPO selection handler which loads the boundary
                const mpoSelect = document.getElementById('tierMPOSelect');
                if (mpoSelect?.value) {
                    console.log('[Tier] MPO boundary not yet displayed, triggering load');
                    handleMPOSelection();
                }
            }
        } else if (tier === 'state') {
            // State outline — check if already displayed
            if (!builtInLayersState._stateOutlineLayer && crashMap) {
                const stateFips = jurisdictionContext.stateFips;
                if (stateFips && typeof BoundaryService !== 'undefined') {
                    const stateOutline = await BoundaryService.getStateOutline(stateFips);
                    if (stateOutline?.features?.length > 0) {
                        const stateLayer = L.geoJSON(stateOutline, {
                            pane: 'jurisdictionBoundaryPane',
                            style: { color: '#1e40af', weight: 3, fillColor: '#3b82f6', fillOpacity: 0.05, dashArray: '10, 5' }
                        });
                        stateLayer.addTo(crashMap);
                        builtInLayersState._stateOutlineLayer = stateLayer;
                        console.log('[Tier] Ensured state outline boundary displayed for asset loading');
                    }
                }
            }
        }
    } catch (e) {
        console.warn('[Tier] Failed to ensure boundary display:', e.message);
    }
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  CL.spatial.geoTier = CL.spatial.geoTier || {};

  // Restore prior global surface: every declaration above was a top-level
  // (global) function before extraction; mirror all to window so remaining
  // inline code in index.html keeps working unchanged.
  window.loadGeoData = loadGeoData;
  window._getCurrentStateFips = _getCurrentStateFips;
  window._getCurrentStateAbbr = _getCurrentStateAbbr;
  window._extractPlaceType = _extractPlaceType;
  window._placeSlugFor = _placeSlugFor;
  window.lookupCountyKeyByFips = lookupCountyKeyByFips;
  window._resolvePlaceParentCountyFips = _resolvePlaceParentCountyFips;
  window.populateGeoTierDropdown = populateGeoTierDropdown;
  window.populatePlanningDistrictDropdown = populatePlanningDistrictDropdown;
  window.handlePlanningDistrictSelection = handlePlanningDistrictSelection;
  window.handleCountySelection = handleCountySelection;
  window.handleCitySelection = handleCitySelection;
  window.loadStatewideCSVForTier = loadStatewideCSVForTier;
  window.populateRegionDropdown = populateRegionDropdown;
  window.populateMPODropdown = populateMPODropdown;
  window.handleRegionSelection = handleRegionSelection;
  window.handleMPOSelection = handleMPOSelection;
  window.getCountyFIPSListForTier = getCountyFIPSListForTier;
  window.getBoundsForTier = getBoundsForTier;
  window.getTierScopeKey = getTierScopeKey;
  window.getTierScopeName = getTierScopeName;
  window._estimateBoundsFromCenter = _estimateBoundsFromCenter;
  window._computeMultiCountyBounds = _computeMultiCountyBounds;
  window.ensureTierBoundaryDisplayed = ensureTierBoundaryDisplayed;

  // Prompt 25 §2 — CL.spatial + CL.spatial.geoTier exposure for the anchors
  CL.spatial.loadGeoData = CL.spatial.geoTier.loadGeoData = loadGeoData;
  CL.spatial.populateGeoTierDropdown = CL.spatial.geoTier.populateGeoTierDropdown = populateGeoTierDropdown;
  CL.spatial.handleCountySelection = CL.spatial.geoTier.handleCountySelection = handleCountySelection;
  CL.spatial.getBoundsForTier = CL.spatial.geoTier.getBoundsForTier = getBoundsForTier;
  CL.spatial.getCountyFIPSListForTier = CL.spatial.geoTier.getCountyFIPSListForTier = getCountyFIPSListForTier;

  CL._registerModule('spatial/geo-tier');
})();
