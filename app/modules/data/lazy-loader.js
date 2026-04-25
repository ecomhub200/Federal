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

    // Tabs that require full R2 dataset (sampleRows + full aggregates)
    const R2_REQUIRED_TABS = new Set([
        'analysis',
        'intersection',
        'pedestrian',
        'hotspots',
        'crashtree',
        'grants',
        'deepdive',
        'safety',
        'fatalspeeding',
        'domain-knowledge'
    ]);

    // Tabs that work with Supabase alone (no R2 needed)
    const SUPABASE_ONLY_TABS = new Set([
        'dashboard',
        'map',        // Map works partially — boundary/tier UI works, markers need R2
        'upload',
        'ai',
        'prediction',
        'cmf',        // Has Supabase getCrashesByLocation() path
        'warrants'    // Has Supabase getCrashesByLocation() path
    ]);

    function tabNeedsR2(tabId) {
        return R2_REQUIRED_TABS.has(tabId);
    }

    function isR2Loaded() {
        return _r2Loaded || !_enabled;
    }

    function markR2Loaded() {
        _r2Loaded = true;
        _r2LoadPromise = null;
    }

    /**
     * Trigger lazy R2 download if not already loaded/loading.
     * Returns a promise that resolves when the data is ready.
     * Shows a loading overlay on the requesting tab while downloading.
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

        console.log('[LazyLoader] Tab "' + requestingTabId + '" requires R2 data — triggering download');
        _showTabLoadingOverlay(requestingTabId);

        _r2LoadPromise = new Promise(function (resolve) {
            (async function () {
                try {
                    if (typeof autoLoadCrashData === 'function') {
                        // skipCache=true: bypass IndexedDB cache (we want fresh row data)
                        // forceR2=true:   bypass the Supabase-first guard so we actually
                        //                 download the parquet (this is the only call site
                        //                 that should ever set forceR2=true).
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
