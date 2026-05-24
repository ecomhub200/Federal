/**
 * CL core.tier module
 *
 * Extracted from app/index.html (snapshot L20400-L20766) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/24-core-tier.md.
 * Responsibility: View-tier set/visibility/selector + handleTierChange.
 *
 * Public API (back-compat dual exposure):
 *   - window.setViewTier → CL.core.setViewTier
 *   - window.updateTabVisibilityForTier → CL.core.updateTabVisibilityForTier
 *   - window.updateTierSelectorUI → CL.core.updateTierSelectorUI
 *   - window.handleTierChange → CL.core.handleTierChange
 *
 * _TIER_EXTENSIONS / TIER_TAB_VISIBILITY are app-wide shared (declared in
 * index.html; _TIER_EXTENSIONS spread into jurisdictionContext externally,
 * TIER_TAB_VISIBILITY read here as a free var) — intentionally NOT moved.
 * getTierScopeKey is a detached function (non-contiguous, ~1450 lines away);
 * left in index.html. §1's "move globals/listeners/getTierScopeKey" lines
 * were pre-drift; §8 governs. Verbatim, no behavior change.
 *
 * Depends on (must load before this file): `core/constants`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

function setViewTier(tier) {
    if (!TIER_TAB_VISIBILITY[tier]) { console.warn('[Scope] Unknown tier:', tier); return; }
    const prev = jurisdictionContext.viewTier;
    jurisdictionContext.viewTier = tier;
    updateTabVisibilityForTier(tier);
    updateTierSelectorUI(tier);
    console.log(`[Scope] View tier changed: ${prev} → ${tier}`);

    // Round-4 Patch 1 — reset road-type radio to "allRoads" on tier change so
    // the next bridge fetch under the new tier doesn't carry the previous
    // tier's filter. Without this, state(countyOnly) → federal sends
    // road_type=eq.dot_roads to dashboard_summary and paints 438,501 as the
    // federal allRoads total (true value 569,829). Sub-handlers
    // (handleMPOSelection / handleRegionSelection / etc.) inherit the reset
    // because handleTierChange always calls setViewTier first.
    if (prev !== tier && typeof _resetRoadTypeForTierChange === 'function') {
        _resetRoadTypeForTierChange();
    }

    // Fix 2 — clear stale per-row data on every tier change. Map / Hot Spots /
    // detail tabs read crashState.mapPoints / sampleRows directly — leaving
    // them in place causes "Map shows previous tier's points" bugs (e.g.
    // tier=City→Delaware City still showing 2,047 points cached from Kent).
    // Don't clear crashState.aggregates / .totalRows — the bridge will repaint
    // them right after; Fix 4 keeps totalRows in sync.
    if (prev !== tier) {
        try {
            if (typeof crashState !== 'undefined' && crashState) {
                crashState.mapPoints = [];
                crashState.sampleRows = [];
                crashState.sampleRowsLoaded = false;
            }
            // If the Leaflet map exists, repaint it immediately so the user
            // doesn't see the previous tier's markers while the new tier loads.
            if (typeof crashMap !== 'undefined' && crashMap && typeof updateMapDisplay === 'function') {
                try { updateMapDisplay(); } catch (mapErr) { /* non-fatal */ }
            }
        } catch (e) { /* non-fatal */ }
    }
}

function updateTabVisibilityForTier(tier) {
    const vis = TIER_TAB_VISIBILITY[tier];
    if (!vis) return;
    // Tab IDs mapped to visibility keys
    const tabMap = {
        'dashboard': 'dashboard', 'map': 'map', 'crashtree': 'crashTree',
        'safety': 'safetyFocus', 'fatalspeeding': 'fatalSpeed', 'hotspots': 'hotSpots',
        'intersection': 'intersections', 'pedestrian': 'pedBike', 'analysis': 'analysis'
    };
    Object.entries(tabMap).forEach(([tabId, key]) => {
        const navItems = document.querySelectorAll(`[data-tab="${tabId}"]`);
        navItems.forEach(el => {
            el.style.display = vis[key] ? '' : 'none';
        });
    });
}

function updateTierSelectorUI(tier) {
    document.querySelectorAll('.tier-btn').forEach(btn => {
        const isCurrent = btn.dataset.tier === tier;
        btn.classList.toggle('active', isCurrent);
        btn.style.background = isCurrent ? '#7c3aed' : 'white';
        btn.style.color = isCurrent ? 'white' : '#5b21b6';
        btn.style.borderColor = isCurrent ? '#7c3aed' : '#c4b5fd';
        btn.style.fontWeight = isCurrent ? '600' : '500';
    });
    // Show/hide scope-specific dropdowns
    const regionRow = document.getElementById('tierRegionRow');
    const mpoRow = document.getElementById('tierMPORow');
    const pdRow = document.getElementById('tierPlanningDistrictRow');
    const countyRow = document.getElementById('tierCountyRow');
    const cityRow = document.getElementById('tierCityRow');
    if (regionRow) regionRow.style.display = (tier === 'region') ? '' : 'none';
    if (mpoRow) mpoRow.style.display = (tier === 'mpo') ? '' : 'none';
    if (pdRow) pdRow.style.display = (tier === 'planning_district') ? '' : 'none';
    if (countyRow) countyRow.style.display = (tier === 'county') ? '' : 'none';
    if (cityRow) cityRow.style.display = (tier === 'city') ? '' : 'none';

    // Update scope indicator
    const indicator = document.getElementById('tierScopeIndicator');
    const scopeText = document.getElementById('tierScopeText');
    if (tier === 'county') {
        if (indicator) indicator.style.display = 'none';
    } else {
        if (indicator) indicator.style.display = '';
        if (scopeText) {
            const tierLabels = {
                federal: 'National (all states with data)',
                state: jurisdictionContext.tierState?.name ? `${jurisdictionContext.tierState.name} (statewide)` : 'Statewide',
                region: jurisdictionContext.tierRegion?.name || 'Select a region',
                planning_district: jurisdictionContext.tierPlanningDistrict?.name || 'Select a planning district',
                mpo: jurisdictionContext.tierMpo?.name || 'Select an MPO',
                city: jurisdictionContext.tierCity?.name || 'Select a city / town'
            };
            scopeText.textContent = tierLabels[tier] || tier;
        }
    }

    // The bottom-card "Select County/Jurisdiction" filter-group is hidden in
    // every tier now (replaced by the read-only Active Scope card painted by
    // upload-tier-ui.js). Keep the underlying <select> enabled so programmatic
    // .value writes from handleCountySelection() still fire change listeners,
    // and hide the legacy lock badge / "Current: X | Y" panel unconditionally.
    const jurisdictionSelect = document.getElementById('jurisdictionSelect');
    const lockBadge = document.getElementById('jurisdictionLockBadge');
    const currentJurisdictionDisplay = document.getElementById('currentJurisdictionDisplay');
    if (jurisdictionSelect) {
        jurisdictionSelect.disabled = false;
        jurisdictionSelect.title = '';
    }
    if (lockBadge) lockBadge.style.display = 'none';
    if (currentJurisdictionDisplay) currentJurisdictionDisplay.style.display = 'none';
}

async function handleTierChange(tier) {
    try {
        setViewTier(tier);

        // ── Update road type filter labels for this tier ──
        if (typeof updateRoadTypeLabels === 'function') updateRoadTypeLabels(tier);

        // ── Repaint upload tab for this tier (hide county dropdown in non-county
        // views, swap in the scope card, reset stale "loaded from delaware/kent"
        // success copy) BEFORE any async fetch so the UI never lies. ──
        if (CL.upload && CL.upload.tierUI && CL.upload.tierUI.applyUploadTierUI) {
            CL.upload.tierUI.applyUploadTierUI(tier);
        }

        // ── Clear previous tier's boundary overlays ──
        if (typeof removeMPOBoundaryLayer === 'function') removeMPOBoundaryLayer();
        if (typeof removeRegionBoundaryLayer === 'function') removeRegionBoundaryLayer();
        if (typeof removePlanningDistrictBoundaryLayer === 'function') removePlanningDistrictBoundaryLayer();
        if (typeof removeCityBoundaryLayer === 'function') removeCityBoundaryLayer();
        // Remove state outline overlay (uses same slot as jurisdiction boundary for state tier)
        if (builtInLayersState._stateOutlineLayer && crashMap) {
            crashMap.removeLayer(builtInLayersState._stateOutlineLayer);
            builtInLayersState._stateOutlineLayer = null;
        }
        // Remove federal-tier multi-state outlines when leaving federal view
        if (tier !== 'federal' && typeof FederalBoundaries !== 'undefined') {
            FederalBoundaries.remove();
        }
        // Remove county jurisdiction boundary when switching to any non-county tier
        if (tier !== 'county' && typeof removeJurisdictionBoundaryLayer === 'function') {
            removeJurisdictionBoundaryLayer();
            builtInLayersState.jurisdictionBoundary.enabled = false;
            console.log('[Tier] Cleared county jurisdiction boundary for tier:', tier);
        }

        // If switching to region/mpo/pd, populate the dropdowns from hierarchy
        if ((tier === 'region' || tier === 'mpo' || tier === 'planning_district') && jurisdictionContext.hierarchyLoaded) {
            if (tier === 'region') populateRegionDropdown();
            if (tier === 'mpo') populateMPODropdown();
            if (tier === 'planning_district') populatePlanningDistrictDropdown();
        } else if ((tier === 'region' || tier === 'mpo' || tier === 'planning_district') && !jurisdictionContext.hierarchyLoaded) {
            // Need to load hierarchy first
            const stateSelect = document.getElementById('stateSelect');
            const stateKey = stateSelect?.value;
            if (stateKey) {
                // Resolve FIPS code to state directory name via FIPSDatabase
                let stateDir = _resolveActiveState() || ''; // null guarded by FIPSDatabase block below
                if (typeof FIPSDatabase !== 'undefined') {
                    const stInfo = FIPSDatabase.getState(stateKey);
                    if (stInfo) stateDir = stInfo.name.toLowerCase().replace(/\s+/g, '_');
                }
                await HierarchyRegistry.load(stateDir);
                if (tier === 'region') populateRegionDropdown();
                if (tier === 'mpo') populateMPODropdown();
                if (tier === 'planning_district') populatePlanningDistrictDropdown();
            }
        }

        // If switching to city/town, populate merged dropdown from geography JSON
        if (tier === 'city') {
            await populateGeoTierDropdown('city');
        }

        // If switching to county, sync the top-card County dropdown with the
        // current (possibly localStorage-restored) value of the canonical
        // jurisdictionSelect so the user sees their saved county.
        if (tier === 'county') {
            const tierCountySelect = document.getElementById('tierCountySelect');
            const jurisdictionSelect = document.getElementById('jurisdictionSelect');
            if (tierCountySelect && jurisdictionSelect && jurisdictionSelect.value) {
                tierCountySelect.value = jurisdictionSelect.value;
            }
        }

        // ── Tier-specific boundary and map actions ──
        const stateSelect = document.getElementById('stateSelect');
        const stateFips = stateSelect?.value;
        const stateInfo = (typeof FIPSDatabase !== 'undefined' && stateFips)
            ? FIPSDatabase.getState(stateFips) : null;

        if (tier === 'federal') {
            // Federal tier: draw outlines for every state with onboarded crash data.
            // FederalBoundaries.render() handles its own fly-to-bounds; only fall
            // back to the continental-US flyTo if rendering fails.
            if (crashMap) {
                if (typeof FederalBoundaries !== 'undefined') {
                    FederalBoundaries.render().then(layer => {
                        if (!layer) {
                            safeFlyTo(crashMap, [39.5, -98.35], 4, { duration: 1.2 });
                        }
                    }).catch(e => {
                        console.warn('[Tier] Federal boundaries render failed:', e.message);
                        safeFlyTo(crashMap, [39.5, -98.35], 4, { duration: 1.2 });
                    });
                } else {
                    safeFlyTo(crashMap, [39.5, -98.35], 4, { duration: 1.2 });
                }
            }
        } else if (tier === 'state') {
            // Load state outline from TIGERweb and display it
            if (stateFips && crashMap && typeof BoundaryService !== 'undefined') {
                try {
                    const stateOutline = await BoundaryService.getStateOutline(stateFips);
                    if (stateOutline?.features?.length > 0) {
                        const stateLayer = L.geoJSON(stateOutline, {
                            pane: 'jurisdictionBoundaryPane',
                            style: {
                                color: '#1e40af',
                                weight: 3,
                                fillColor: '#3b82f6',
                                fillOpacity: 0.05,
                                dashArray: '10, 5'
                            },
                            onEachFeature: function(feature, layer) {
                                const name = feature.properties?.NAME || stateInfo?.name || 'State';
                                layer.bindPopup(`
                                    <div style="text-align:center;padding:0.5rem;">
                                        <div style="font-weight:600;">${name}</div>
                                        <div style="font-size:0.8rem;color:#666;">State Boundary</div>
                                        <div style="font-size:0.75rem;color:#888;">Source: US Census TIGERweb</div>
                                    </div>
                                `);
                            }
                        });
                        stateLayer.addTo(crashMap);
                        builtInLayersState._stateOutlineLayer = stateLayer;
                        safeFlyToBounds(crashMap, stateLayer.getBounds(), { padding: [30, 30], duration: 1.2, maxZoom: stateInfo?.zoom || 7 });
                        console.log('[Tier] State outline boundary loaded for FIPS', stateFips);
                    }
                } catch (e) {
                    console.warn('[Tier] Failed to load state outline:', e.message);
                    // Fallback: fly to state center (stateInfo first, then
                    // Round 18 §3 getStateCenter() fallback table so City→State
                    // never lands in a NaN flyTo, F005).
                    let flown = false;
                    if (stateInfo) {
                        flown = safeFlyTo(crashMap, stateInfo.center, stateInfo.zoom || 7, { duration: 1.2 });
                    }
                    if (!flown && typeof getStateCenter === 'function') {
                        const stateKey = (window.crashLensClient && window.crashLensClient.state) || '';
                        // Round 19 §3 — getStateCenter is now async (DB-driven via
                        // states.capabilities.center). Try sync cache first, then await.
                        let center = (typeof getStateCenterSync === 'function') ? getStateCenterSync(stateKey) : null;
                        if (!center) center = await getStateCenter(stateKey);
                        if (center) safeFlyTo(crashMap, center, 7, { duration: 1.2 });
                    }
                }
            } else if (crashMap && typeof getStateCenter === 'function') {
                // Round 18 §3 — no BoundaryService available; still need to leave
                // the previous tier's centroid (could be a city NaN), so fall
                // back to the state centroid (Round 19 §3 — DB-driven).
                const stateKey = (window.crashLensClient && window.crashLensClient.state) || '';
                let center = (typeof getStateCenterSync === 'function') ? getStateCenterSync(stateKey) : null;
                if (!center) center = await getStateCenter(stateKey);
                if (center) safeFlyTo(crashMap, center, 7, { duration: 1.2 });
            }
        } else if (tier === 'county') {
            // Restore county-level jurisdiction boundary
            const jurisdictionId = localStorage.getItem('selectedJurisdiction');
            if (jurisdictionId && crashMap && typeof updateJurisdictionBoundary === 'function') {
                updateJurisdictionBoundary(jurisdictionId);
            }
        }
        // Region/MPO boundaries load when the user selects from the dropdown
        // (handleRegionSelection / handleMPOSelection)

        // Load aggregate data for the tier
        if (tier === 'federal' || tier === 'state') {
            // Data-source contract for non-county tiers (effective 2026-04-25):
            //   PRIMARY  — Supabase matview (injected via supabaseBridge below)
            //   FALLBACK — R2 parquet at {state}/_state/{road_type}.parquet
            //              (URL surfaced via getDataFilePath() / fallbackR2Url();
            //              not auto-loaded because statewide parquets can OOM
            //              the browser on large states.)
            // Note: a legacy `{state}/_statewide/aggregates.json` was looked up
            // here but was never published — removed to stop the noisy 404.

            // For state/federal tiers: use Supabase matview (pre-aggregated).
            // Do NOT call autoLoadCrashData() — the statewide R2 parquet file
            // (569K+ rows × 550 cols) causes browser out-of-memory crashes.
            // Dashboard/Map render from Supabase summary; detail tabs trigger
            // lazy R2 download for the *county-level* file if needed.
            if (tier === 'state' || tier === 'federal') {
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
                        if (typeof crashState.totalRows !== 'number') crashState.totalRows = 0;
                    }
                    try { updateDataConnectionStatus('connected'); } catch (e2) {}
                    // Re-activate Supabase viewport map bridge: mapPoints are
                    // empty at aggregate tiers, so updateMapDisplay would render
                    // nothing without it.
                    try {
                        if (CL.data && CL.data.mapBridge && CL.data.mapBridge.attach) {
                            CL.data.mapBridge.attach();
                            CL.data.mapBridge.refresh();
                        }
                    } catch (mb) { /* non-fatal */ }
                    console.log(`[Tier] ${tier} view using Supabase matview (R2 download skipped)`);
                    console.log('[CrashLens] Data loaded at', new Date().toISOString(),
                                'source: supabase-matview-' + tier + ', rows:', (crashState && crashState.totalRows) || 0);
                } catch (e) {
                    console.warn(`[Tier] Supabase bridge for ${tier} failed:`, e.message);
                }
            }
        }
        // Reset detail tab loaded flags so they reinitialize on next visit
        try {
            if (typeof crashTreeState !== 'undefined' && crashTreeState) crashTreeState.loaded = false;
            if (typeof fatalSpeedingState !== 'undefined' && fatalSpeedingState) fatalSpeedingState.loaded = false;
        } catch (e) { /* non-fatal */ }
        // Refresh subtitle, search bar, and map stats scope label so they
        // reflect the new tier (federal/state/region/mpo/pd/city). The
        // per-tier selection handlers fire their own refresh once a scope
        // is picked from the secondary dropdown, but we also need the
        // initial transition (e.g. county → state) to repaint headers.
        try {
            if (typeof updateAppSubtitle === 'function') updateAppSubtitle(getJurisdictionLabel());
            if (typeof updateMapSearchPlaceholder === 'function') updateMapSearchPlaceholder();
            if (typeof updateMapScopeLabel === 'function') updateMapScopeLabel();
        } catch (e) { /* non-fatal */ }
        // Dispatch tierChanged event for school/transit tabs
        document.dispatchEvent(new CustomEvent('tierChanged', { detail: { tier, scopeKey: getTierScopeKey(tier) } }));
    } catch (e) {
        console.error(`[Tier] handleTierChange failed for tier '${tier}':`, e);
    }
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.core = CL.core || {};
  window.handleTierChange = handleTierChange; CL.core.handleTierChange = handleTierChange;
  window.setViewTier = setViewTier; CL.core.setViewTier = setViewTier;
  window.updateTabVisibilityForTier = updateTabVisibilityForTier; CL.core.updateTabVisibilityForTier = updateTabVisibilityForTier;
  window.updateTierSelectorUI = updateTierSelectorUI; CL.core.updateTierSelectorUI = updateTierSelectorUI;
  CL._registerModule('core/tier');
})();
