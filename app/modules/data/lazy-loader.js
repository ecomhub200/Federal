/**
 * Lazy R2 Loader — defers full dataset download until a tab needs it.
 *
 * On page load, only Supabase summary data is fetched (via supabase-bridge).
 * When the user clicks a tab that requires sampleRows or full aggregates
 * (Analysis, Hotspots, Grants, etc.), this module triggers the R2 download
 * on demand and shows a loading overlay on the requesting tab.
 *
 * Rules this module follows:
 *   - Never duplicates an in-flight R2 download (singleton promise).
 *   - Never mutates crashState directly — delegates to autoLoadCrashData().
 *   - Feature-flag escape hatch: setEnabled(false) reverts to R2-first.
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

CL.data.lazyLoader = (function () {
    'use strict';

    // ── State ──
    let _r2LoadPromise = null;   // Singleton promise — prevents duplicate downloads
    let _r2Loaded = false;       // True once full R2 data is available
    let _enabled = true;         // Feature flag — can be disabled for debugging

    // Tabs that need individual crash rows (sampleRows) require R2.
    // analyzeHotspots / rankLocationsForGrants / processSafetyData all do
    // per-row aggregation that the existing matview shapes can't replace,
    // so they stay behind the R2 gate until matview-backed init paths exist.
    const R2_REQUIRED_TABS = new Set([
        'map',             // Markers/clusters/heatmap read crashState.mapPoints
        'intersection',    // Needs individual crash rows for intersection table
        'deepdive',        // Drills into individual crash records
        'domain-knowledge',// Needs full dataset for knowledge extraction
        'hotspots',        // analyzeHotspots() needs sampleRows for per-row hotspot scoring
        'grants',          // rankLocationsForGrants() needs sampleRows for location aggregation
        'safety'           // initSafetyFocus() needs sampleRows for processSafetyData()
    ]);

    // Tabs that work without R2 — either Supabase matview-powered or UI-only
    const SUPABASE_ONLY_TABS = new Set([
        'dashboard',      // Supabase bridge paints KPIs directly
        'upload',         // UI only
        'ai',             // Uses its own data sources
        'prediction',     // UI only
        'cmf',            // Has Supabase getCrashesByLocation() path
        'warrants',       // Has Supabase getCrashesByLocation() path
        'analysis',       // mv_analysis_summary matview
        'crashtree',      // mv_crash_tree matview
        'fatalspeeding',  // mv_safety_categories + mv_analysis_summary
        'pedestrian'      // mv_safety_categories matview
    ]);

    function tabNeedsR2(tabId) {
        if (!R2_REQUIRED_TABS.has(tabId)) return false;
        // If a Supabase preloader has already served this tab for the
        // current tier+jurisdiction, the showTab gate should let it open
        // directly — re-running ensureR2Loaded would loop. The preloader
        // cache invalidates on tier/jurisdiction change.
        if (CL.data && CL.data.tabLoaders
            && typeof CL.data.tabLoaders.tabServedBySupabase === 'function'
            && CL.data.tabLoaders.tabServedBySupabase(tabId)) {
            return false;
        }
        return true;
    }

    function isR2Loaded() {
        return _r2Loaded || !_enabled;
    }

    function markR2Loaded() {
        _r2Loaded = true;
        _r2LoadPromise = null;
    }

    /**
     * Ensure data for the requesting tab is loaded.
     *
     * Strategy:
     *   1. If a per-tab Supabase preloader is registered (see tab-loaders.js),
     *      try it first. On success, the tab gets its rows from Supabase
     *      without ever downloading the R2 parquet.
     *   2. On preloader failure (matview missing, network error, empty result
     *      with no fallback), fall through to the legacy R2 download.
     *   3. If neither path works, the tab renders its empty state.
     *
     * Returns a promise that resolves to true on success, false on hard failure.
     */
    function ensureR2Loaded(requestingTabId) {
        if (_r2Loaded || !_enabled) return Promise.resolve(true);

        // If already loading, return the existing promise
        if (_r2LoadPromise) {
            console.log('[LazyLoader] R2 already loading, ' + requestingTabId + ' waiting...');
            _showTabLoadingOverlay(requestingTabId);
            return _r2LoadPromise.then(function (ok) {
                _removeTabLoadingOverlay(requestingTabId);
                return ok;
            });
        }

        _showTabLoadingOverlay(requestingTabId);

        _r2LoadPromise = new Promise(function (resolve) {
            (async function () {
                try {
                    // ── STAGE 1: try the per-tab Supabase preloader ──
                    if (CL.data && CL.data.tabLoaders && CL.data.tabLoaders.hasPreloader(requestingTabId)) {
                        try {
                            var supabaseOk = await CL.data.tabLoaders.tryPreload(requestingTabId);
                            if (supabaseOk) {
                                console.log('[LazyLoader] Tab "' + requestingTabId + '" served by Supabase — skipping R2 download');
                                // Note: we do NOT set _r2Loaded=true here — other tabs
                                // may still need the full R2 dataset and they'll trigger
                                // their own preloader (or this download) on demand.
                                resolve(true);
                                return;
                            }
                        } catch (e) {
                            console.warn('[LazyLoader] Supabase preloader for "' + requestingTabId + '" threw:', e && e.message);
                        }
                    }

                    // ── STAGE 2: fall back to R2 parquet download ──
                    console.log('[LazyLoader] Tab "' + requestingTabId + '" requires R2 data — triggering download');
                    if (typeof autoLoadCrashData === 'function') {
                        // skipCache=true: bypass IndexedDB cache (we want fresh row data)
                        // forceR2=true:   bypass the Supabase-first dashboard guard so we
                        //                 actually download the parquet (this is the only
                        //                 call site that should ever set forceR2=true).
                        await autoLoadCrashData(true, true);
                    }
                    _r2Loaded = true;
                    resolve(true);
                } catch (e) {
                    console.error('[LazyLoader] R2 download failed:', e);
                    resolve(false);
                } finally {
                    _removeTabLoadingOverlay(requestingTabId);
                    _r2LoadPromise = null;
                }
            })();
        });

        return _r2LoadPromise;
    }

    function _showTabLoadingOverlay(tabId) {
        const tabEl = document.getElementById('tab-' + tabId);
        if (!tabEl) return;

        // Don't add duplicate overlays
        if (tabEl.querySelector('.lazy-load-overlay')) return;

        const overlay = document.createElement('div');
        overlay.className = 'lazy-load-overlay';
        overlay.style.cssText = [
            'position:absolute;top:0;left:0;right:0;bottom:0',
            'background:rgba(15,23,42,0.85)',
            'display:flex;flex-direction:column;align-items:center;justify-content:center',
            'z-index:1000;border-radius:8px;color:#e2e8f0;gap:16px'
        ].join(';');
        overlay.innerHTML = [
            '<div style="width:48px;height:48px;border:3px solid #334155;border-top-color:#60a5fa;border-radius:50%;animation:spin 1s linear infinite"></div>',
            '<div style="font-size:15px;font-weight:600">Loading detailed crash data...</div>',
            '<div style="font-size:13px;color:#94a3b8">Downloading full dataset for analysis</div>'
        ].join('');

        // Ensure parent has relative positioning for overlay
        if (getComputedStyle(tabEl).position === 'static') {
            tabEl.style.position = 'relative';
        }
        tabEl.appendChild(overlay);
    }

    function _removeTabLoadingOverlay(tabId) {
        const tabEl = document.getElementById('tab-' + tabId);
        if (!tabEl) return;
        const overlay = tabEl.querySelector('.lazy-load-overlay');
        if (overlay) overlay.remove();
    }

    function setEnabled(enabled) {
        _enabled = enabled;
        console.log('[LazyLoader] ' + (enabled ? 'Enabled' : 'Disabled'));
    }

    function reset() {
        _r2Loaded = false;
        _r2LoadPromise = null;
    }

    return {
        tabNeedsR2:     tabNeedsR2,
        isR2Loaded:     isR2Loaded,
        markR2Loaded:   markR2Loaded,
        ensureR2Loaded: ensureR2Loaded,
        reset:          reset,
        setEnabled:     setEnabled,
        R2_REQUIRED_TABS: R2_REQUIRED_TABS,
        SUPABASE_ONLY_TABS: SUPABASE_ONLY_TABS
    };
})();

CL._registerModule('data/lazyLoader');
