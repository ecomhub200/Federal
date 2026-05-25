/**
 * CL app.tabDispatcher module
 *
 * Extracted from app/index.html (snapshot L31759-L32200) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/45-app-tab-dispatcher.md.
 * Responsibility: showTab()/navigateTo() central tab dispatcher.
 *
 * Public API (back-compat dual exposure):
 *   - window.showTab → CL.app.tabDispatcher.showTab
 *   - window.navigateTo → CL.app.tabDispatcher.navigateTo
 *
 * Depends on (must load before this file): `(every feature tab module — all must load before this)`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

function showTab(tabId) {
    console.log('[CrashLens] Tab switched to:', tabId,
                'data loaded:', !!(typeof crashState !== 'undefined' && crashState.loaded));
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById('tab-' + tabId).classList.add('active');

    // Scroll to top when switching tabs to prevent blank-looking tabs
    // (previous tab's scroll position can leave new tab content below viewport)
    const wrapper = document.querySelector('.main-content-wrapper');
    if (wrapper) wrapper.scrollTop = 0;
    window.scrollTo(0, 0);

    // Update sidebar active state (nav items and standalone items)
    document.querySelectorAll('.sidebar-nav-item, .sidebar-standalone-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            // Force animation restart by triggering reflow
            const icon = item.querySelector('span.icon');
            if (icon) {
                icon.style.animation = 'none';
                icon.offsetHeight; // Trigger reflow
                icon.style.animation = '';
            }
            item.classList.add('active');
        }
    });

    // ── Lazy R2 Load Gate ──
    // If this tab needs full R2 data and it hasn't loaded yet, trigger the
    // download and re-fire showTab when complete. Tabs that work off the
    // Supabase summary (Dashboard, Map, CMF, Warrants, AI, Upload, Prediction)
    // bypass this gate entirely.
    if (CL.data && CL.data.lazyLoader
        && CL.data.lazyLoader.tabNeedsR2(tabId)
        && !CL.data.lazyLoader.isR2Loaded()) {
        CL.data.lazyLoader.ensureR2Loaded(tabId).then(function (success) {
            if (success) {
                // Re-trigger tab init now that full data is available
                showTab(tabId);
            }
        });
        return; // Don't run tab init yet — data not ready
    }

    if (tabId === 'map' && (crashState.loaded || _supabaseTabReady('getViewportCrashes'))) {
        // Mirror the canonical road-type radio (Upload tab) into the Map
        // tab's mirror radios so the user sees the right selection.
        const _activeRoadType = document.querySelector('input[name="roadTypeFilter"]:checked');
        if (_activeRoadType) {
            document.querySelectorAll('input[name="roadTypeFilterMap"]').forEach(function (el) {
                el.checked = (el.value === _activeRoadType.value);
            });
        }
        if (!crashMap) {
            setTimeout(initMap, 100);
        } else {
            // Map already exists - invalidate size (fixes blank tile issue after tab switch)
            setTimeout(() => {
                crashMap.invalidateSize();
                if (typeof updateMapDisplay === 'function') updateMapDisplay();
            }, 100);
        }
        // Always update asset panel when switching to map (shows Mapillary even without user assets)
        setTimeout(updateMapAssetPanel, 150);
        // Round 16 §3 — paint the factor-chip parity rail.
        if (typeof renderMapFactorChips === 'function') {
            renderMapFactorChips().catch(() => {});
        }
        // Restore Mapillary layer if it was enabled but map wasn't ready during initial restore
        setTimeout(() => {
            if (builtInLayersState?.mapillary?.enabled && !builtInLayersState.mapillary.layer && crashMap) {
                addMapillaryCoverageLayer();
            }

            // ── Restore boundary layers based on active view tier ──
            const activeTier = jurisdictionContext?.viewTier || 'county';

            if (activeTier === 'county' || !activeTier) {
                // County tier: restore TIGERweb jurisdiction boundary (idempotent — handles missing, detached, or already-showing layers)
                if (typeof ensureJurisdictionBoundary === 'function') {
                    ensureJurisdictionBoundary();
                }
            } else if (activeTier === 'federal') {
                // Federal tier: restore multi-state outlines if not currently displayed
                if (crashMap && !builtInLayersState._federalStatesLayer && typeof FederalBoundaries !== 'undefined') {
                    console.log('[FederalBoundaries] Map tab shown - restoring multi-state outlines');
                    FederalBoundaries.render().catch(e => console.warn('[FederalBoundaries] restore failed:', e.message));
                }
            } else if (activeTier === 'state') {
                // State tier: restore state outline if not displayed
                const stateFips = document.getElementById('stateSelect')?.value;
                if (stateFips && crashMap && !builtInLayersState._stateOutlineLayer && typeof BoundaryService !== 'undefined') {
                    console.log('[TIGERweb] Map tab shown - loading state outline boundary');
                    BoundaryService.getStateOutline(stateFips).then(stateOutline => {
                        if (stateOutline?.features?.length > 0 && !builtInLayersState._stateOutlineLayer) {
                            const stateLayer = L.geoJSON(stateOutline, {
                                pane: 'jurisdictionBoundaryPane',
                                style: { color: '#1e40af', weight: 3, fillColor: '#3b82f6', fillOpacity: 0.05, dashArray: '10, 5' },
                                onEachFeature: (f, l) => l.bindPopup(`<div style="text-align:center;font-weight:600">${f.properties?.NAME || 'State'}</div>`)
                            });
                            stateLayer.addTo(crashMap);
                            builtInLayersState._stateOutlineLayer = stateLayer;
                        }
                    }).catch(e => console.warn('[TIGERweb] State outline restore failed:', e.message));
                }
            } else if (activeTier === 'region') {
                // Region tier: restore region boundary if selected but layer not displayed
                if (jurisdictionContext.tierRegion && crashMap &&
                    !builtInLayersState?.regionBoundary?.layer &&
                    typeof displayRegionBoundary === 'function') {
                    console.log('[Boundary] Map tab shown - restoring region boundary');
                    displayRegionBoundary(jurisdictionContext.tierRegion, jurisdictionContext.tierRegion.id);
                }
            } else if (activeTier === 'mpo') {
                // MPO tier: restore MPO boundary if selected but layer not displayed
                if (jurisdictionContext.tierMpo && crashMap &&
                    !builtInLayersState?.mpoBoundary?.layer &&
                    typeof displayMPOBoundary === 'function') {
                    console.log('[Boundary] Map tab shown - restoring MPO boundary');
                    const mpo = jurisdictionContext.tierMpo;
                    const tryRestore = async () => {
                        // First try cached boundary from handleMPOSelection
                        if (mpo._cachedBoundary?.features?.length > 0) {
                            console.log('[Boundary] Using cached MPO boundary for restore');
                            displayMPOBoundary(mpo._cachedBoundary, mpo.id, mpo.shortName || mpo.name);
                            return;
                        }
                        // Try acronym query (will hit BoundaryService cache if previously fetched)
                        if (mpo.btsAcronym || mpo._resolvedBtsAcronym) {
                            const boundary = await BoundaryService.getMPOByAcronym(mpo.btsAcronym || mpo._resolvedBtsAcronym);
                            if (boundary?.features?.length > 0) {
                                displayMPOBoundary(boundary, mpo.id, mpo.shortName || mpo.name);
                                return;
                            }
                        }
                        // Try spatial query fallback
                        if (mpo.center && typeof BoundaryService.getMPOsBySpatialQuery === 'function') {
                            const bbox = { xmin: mpo.center[0] - 1.0, ymin: mpo.center[1] - 1.0, xmax: mpo.center[0] + 1.0, ymax: mpo.center[1] + 1.0 };
                            const spatialResult = await BoundaryService.getMPOsBySpatialQuery(bbox);
                            if (spatialResult?.features?.length > 0) {
                                const mpoName = (mpo.shortName || mpo.name || '').toLowerCase();
                                const matched = spatialResult.features.find(f => {
                                    const p = f.properties || {};
                                    const acronym = (p.ACRONYM || p.acronym || '').toLowerCase();
                                    const name = (p.MPO_NAME || p.NAME || p.MPO_name || '').toLowerCase();
                                    return acronym === mpoName || name.includes(mpoName) || mpoName.includes(name);
                                });
                                if (matched) {
                                    displayMPOBoundary({ type: 'FeatureCollection', features: [matched] }, mpo.id, mpo.shortName || mpo.name);
                                    return;
                                }
                            }
                        }
                        // Final fallback: fly to center
                        if (mpo.center && crashMap) {
                            safeFlyTo(crashMap, [mpo.center[1], mpo.center[0]], mpo.zoom || 10, { duration: 1.2 });
                        }
                    };
                    tryRestore().catch(e => console.warn('[Boundary] MPO boundary restore failed:', e.message));
                }
            }

            // Also ensure jurisdiction boundary layer is loaded if enabled but not yet displayed (fallback)
            const _mapJurisdiction = localStorage.getItem('selectedJurisdiction');
            if (_mapJurisdiction && crashMap &&
                builtInLayersState?.jurisdictionBoundary?.enabled &&
                !builtInLayersState.jurisdictionBoundary.layer &&
                (activeTier === 'county' || !activeTier)) {
                addJurisdictionBoundaryLayer(_mapJurisdiction);
            }

            // And magisterial districts if enabled but not yet displayed
            if (_mapJurisdiction && crashMap &&
                builtInLayersState?.magisterialDistricts?.enabled &&
                builtInLayersState.magisterialDistricts.layers?.length === 0) {
                console.log('[Districts] Map tab shown - loading magisterial districts');
                loadMagisterialDistricts(_mapJurisdiction);
            }
        }, 200);
    }
    // True when the tab can populate from a Supabase matview without needing
    // crashState.sampleRows (the legacy R2 path). Used as an OR-clause on tab
    // gates so aggregate-tier and rolled-up tiers still init when R2 is skipped.
    function _supabaseTabReady(method) {
        var dc = (window.CL && CL.data) ? CL.data.client : null;
        return !!(dc && typeof dc[method] === 'function');
    }

    if (tabId === 'dashboard' && crashState.loaded) {
        updateDashboard();
        // Auto-load magisterial district statistics when visiting Dashboard tab
        const jurisdictionId = localStorage.getItem('selectedJurisdiction');
        const jurisdiction = appConfig?.jurisdictions[jurisdictionId];
        if (jurisdiction?.type === 'county') {
            const districtStatus = builtInLayersState?.magisterialDistricts?.status;
            // Detect stuck loading state (>45 seconds with no result)
            if (districtStatus === 'loading' && districtState.loadingStartTime
                && (Date.now() - districtState.loadingStartTime > 45000)
                && !districtState.isComputing) {
                console.log('[Districts] Stuck loading state detected (>45s), resetting to retry');
                builtInLayersState.magisterialDistricts.status = 'ready';
            }
            if (!districtState.loaded && !districtState.isComputing) {
                console.log('[Districts] Dashboard tab shown - auto-loading district statistics');
                showDistrictMatrixLoading('Loading district boundaries...');
                preloadDistrictsForStatistics(jurisdictionId, false);
            }
        }
    }
    if (tabId === 'crashtree' && (crashState.loaded || _supabaseTabReady('getCrashTree'))) {
        var _ctCurrentTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext?.viewTier) || 'county';
        if (!crashTreeState.loaded || crashTreeState._lastTier !== _ctCurrentTier) {
            crashTreeState._lastTier = _ctCurrentTier;
            crashTreeState.loaded = false;
            initCrashTreeTab();
        } else {
            // Bug fix (2026-05-08): in Supabase-only mode, crashTreeState.treeData
            // was built from mv_crash_tree by initCrashTreeFromMatview().
            // buildCrashTreeData() reads crashState.sampleRows which is [] in
            // Supabase mode and would null out treeData. Repaint from existing
            // state instead of re-running the row pipeline.
            var _ctSupabaseMode =
                crashTreeState.source === 'supabase' ||
                !(crashState.sampleRows && crashState.sampleRows.length > 0);
            if (_ctSupabaseMode) {
                if (typeof renderCrashTree === 'function') renderCrashTree();
                if (typeof updateCrashTreeStats === 'function') updateCrashTreeStats();
            } else {
                buildCrashTreeData();
            }
        }
    }
    if (tabId === 'analysis' && (crashState.loaded || _supabaseTabReady('getAnalysisBreakdown'))) updateAnalysis();
    if (tabId === 'intersection' && (crashState.loaded || _supabaseTabReady('getHotspots'))) updateIntersectionTab();
    if (tabId === 'pedestrian' && crashState.loaded) updatePedBikeTab();
    if (tabId === 'hotspots' && (crashState.loaded || _supabaseTabReady('getHotspots')) && !crashState.hotspots.length) analyzeHotspots();
    if (tabId === 'hotspots') {
        window.dispatchEvent(new CustomEvent('crashtab:hotspots:shown'));
    }
    if (tabId === 'dashboard') {
        window.dispatchEvent(new CustomEvent('crashtab:dashboard:shown'));
    }
    if (tabId === 'map') {
        window.dispatchEvent(new CustomEvent('crashtab:map:shown'));
    }
    if (tabId === 'knowledge' || tabId === 'cmf') {
        window.dispatchEvent(new CustomEvent('crashtab:' + tabId + ':shown'));
    }
    if (tabId === 'cmf') {
        if (!cmfState.loaded) {
            loadCMFDatabase();
        } else if (typeof populateCMFLocations === 'function') {
            // Bug 7 fix — rebuild dropdown each time CMF is opened so a tier
            // change between visits is reflected. populateCMFLocations() reads
            // crashState.aggregates first and falls back to crashState.hotspots
            // via the matview path inside buildLocationData().
            populateCMFLocations();
        }
    }
    if (tabId === 'reports' && typeof initReportLocationDropdown === 'function') {
        // Audit 2026-05-20 fix — rebuild the Reports Location dropdown each
        // time the tab is opened. initReportLocationDropdown() otherwise only
        // runs from initDropdowns() at data-load time, so opening Reports
        // before that — or after a tier change — left the dropdown showing
        // just "-- Select Location --". Same pattern as the CMF Bug 7 fix.
        initReportLocationDropdown();
    }
    if (tabId === 'grants' && !grantState.loaded) initGrantModule();
    if (tabId === 'grants') initDistrictStatisticsOnGrantsTab();  // Initialize district stats section
    if (tabId === 'warrants') {
        if (!warrantsState.loaded) {
            initWarrantsTab();
        } else {
            onWarrantsTabReentry();
        }
    }
    if (tabId === 'upload') loadValidatorIframe();  // Load/reload validator iframe when upload tab is shown
    if (tabId === 'ai') {
        updateAIContextIndicator();  // Update AI context when tab is shown
        if (typeof initMUTCDLocationDropdown === 'function') initMUTCDLocationDropdown();
    }
    if (tabId === 'domain-knowledge' && crashState.loaded) initDomainKnowledge();  // Initialize Domain Knowledge tab
    if (tabId === 'safety') {
        // Hide/show empty state based on data availability
        const safetyEmptyState = document.getElementById('safetyEmptyState');
        const safetyContainer = document.querySelector('.safety-focus-container');
        if (crashState.loaded || _supabaseTabReady('getSafetyCategories')) {
            if (safetyEmptyState) safetyEmptyState.style.display = 'none';
            if (safetyContainer) safetyContainer.style.display = '';
            if (!safetyState.loaded) {
                initSafetyFocus();
            } else {
                // Always refresh the cards and re-display active category when returning to Safety tab
                updateSafetyCards();
                if (safetyState.activeCategory && safetyState.activeCategory !== 'cross') {
                    setTimeout(() => selectSafetyCategory(safetyState.activeCategory), 100);
                }
            }
            // Round 16 §4 — gate BLOCKED-UPSTREAM Safety Focus categories
            // (drowsy/hitrun/lgtruck/young/senior on DE) with an honest "—".
            if (typeof applySafetyFocusCapabilityGates === 'function') {
                setTimeout(() => applySafetyFocusCapabilityGates().catch(() => {}), 150);
            }
        } else {
            // Show empty state when no data is loaded
            if (safetyContainer) safetyContainer.style.display = 'none';
            if (!safetyEmptyState) {
                const tabEl = document.getElementById('tab-safety');
                if (tabEl) {
                    const emptyDiv = document.createElement('div');
                    emptyDiv.id = 'safetyEmptyState';
                    emptyDiv.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 2rem;color:#64748b;text-align:center';
                    emptyDiv.innerHTML = '<div style="font-size:3rem;margin-bottom:1rem">🛡️</div><h3 style="margin:0 0 .5rem;color:#334155">No Crash Data Loaded</h3><p style="margin:0;font-size:.9rem">Upload or select a dataset from the <strong>Upload Data</strong> tab to view Safety Focus analysis.</p>';
                    tabEl.insertBefore(emptyDiv, tabEl.firstChild);
                }
            } else {
                safetyEmptyState.style.display = 'flex';
            }
        }
    }
    if (tabId === 'fatalspeeding' && crashState.loaded) {
        var _fsCurrentTier = (typeof jurisdictionContext !== 'undefined' && jurisdictionContext?.viewTier) || 'county';
        if (!fatalSpeedingState.loaded || fatalSpeedingState._lastTier !== _fsCurrentTier) {
            fatalSpeedingState._lastTier = _fsCurrentTier;
            fatalSpeedingState.loaded = false;
            initFatalSpeedingTab();
        } else {
            // Bug fix (2026-05-08): in Supabase-only mode, fatalSpeedingState was
            // populated from matviews by initFatalSpeedingFromMatview(). The
            // legacy applyFSFilters() path resets state and iterates
            // crashState.sampleRows, which is [] in Supabase mode — wiping the
            // matview data we just loaded. Detect Supabase mode and just repaint.
            var _fsSupabaseMode =
                fatalSpeedingState.source === 'supabase' ||
                !(crashState.sampleRows && crashState.sampleRows.length > 0);
            if (_fsSupabaseMode) {
                updateFSDisplay();
            } else {
                applyFSFilters();
            }
        }
    }
    if (tabId === 'scorecard') {
        initScorecardTab();
    }

    // CC 313 — lazy hydrate of crashState.mapPoints. Fires only when a
    // consumer tab (per CL.map._MAP_POINTS_CONSUMER_TABS) activates. The
    // length-guard inside _hydrateMapPointsIfNeeded short-circuits once the
    // first hydrate has populated the dataset, so repeat visits are free.
    // Try-wrapped: a hydrate failure must never block the tab switch.
    try {
        const consumerSet = (window.CL && CL.map && CL.map._MAP_POINTS_CONSUMER_TABS) || null;
        if (consumerSet && consumerSet.has(tabId)
            && typeof window._hydrateMapPointsIfNeeded === 'function') {
            window._hydrateMapPointsIfNeeded('tab-activation:' + tabId, true);
        }
    } catch (e) { /* never block tab switch on hydrate gating */ }
}

// ========================================
// SIDEBAR NAVIGATION FUNCTIONS
// ========================================

// Navigate to a tab from sidebar
function navigateTo(tabId) {
    showTab(tabId);
    // Close mobile sidebar after navigation (only if open)
    const sidebar = document.querySelector('.sidebar');
    if (window.innerWidth <= 1024 && sidebar && sidebar.classList.contains('open')) {
        toggleMobileSidebar();
    }
}
// Store as global for early fallback handler
window._mainNavigateTo = navigateTo;
// Handle any pending navigation from early calls
if (window._pendingNavigation) {
    const pending = window._pendingNavigation;
    window._pendingNavigation = null;
    setTimeout(function() { navigateTo(pending); }, 100);
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.app = CL.app || {};
  window.showTab = showTab; CL.app.showTab = showTab;
  window.navigateTo = navigateTo; CL.app.navigateTo = navigateTo;
  CL._registerModule('app/tab-dispatcher');
})();
