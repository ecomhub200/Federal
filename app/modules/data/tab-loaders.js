/**
 * tab-loaders.js
 *
 * Per-tab Supabase preloaders for the Crash Lens detail tabs.
 *
 * The architecture:
 *   1. lazyLoader.ensureR2Loaded(tabId) checks if a Supabase preloader is
 *      registered for this tab. If yes, it tries that first.
 *   2. Each preloader calls window.crashLensClient (CrashLensDataClient) with
 *      a tab-specific filter and stashes the result in tabLoaders.cache[tabId].
 *   3. Tab init code reads from CL.data.tabLoaders.getTabRows(tabId) instead
 *      of crashState.sampleRows directly. Returns the cache if present, else
 *      falls back to crashState.sampleRows.
 *   4. If the preloader fails OR returns no rows, lazyLoader falls back to
 *      the standard R2 parquet download.
 *
 * Adding a new tab to Supabase-first:
 *   a. Pick a query shape that works with existing crashLensClient methods
 *      (e.g., getCrashes with a server-side filter) OR add a new method to
 *      data-client.js backed by a Supabase matview.
 *   b. Register a preloader in PRELOADERS below — fetch + return the rows.
 *      ALWAYS return rows in the COL.* (Title Case) shape — _pgToFrontend
 *      already handles this for getCrashes results.
 *   c. In the tab's processing code, replace `crashState.sampleRows` with
 *      `CL.data.tabLoaders.getTabRows('<tabId>')`.
 *   d. Drop the tabId from R2_REQUIRED_TABS in lazy-loader.js.
 *   e. Test: tab opens without triggering an R2 download.
 */
(function () {
    'use strict';
    if (typeof window === 'undefined') return;
    window.CL = window.CL || {};
    CL.data = CL.data || {};

    // Cache key: `${tabId}|${tier}|${value}` so a tier/jurisdiction change
    // invalidates without us tracking it explicitly.
    var _cache = {};
    var _inflight = {};

    function _activeTier() {
        try {
            if (typeof jurisdictionContext !== 'undefined') {
                return jurisdictionContext.viewTier || 'county';
            }
        } catch (e) {}
        return 'county';
    }

    function _activeTierValue(tier) {
        try {
            var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
            if (!ctx) return null;
            if (tier === 'county' || tier === 'city') {
                if (tier === 'city' && ctx.tierCity && ctx.tierCity.name) return ctx.tierCity.name;
                return ctx.jurisdictionName || null;
            }
            if (tier === 'region') return ctx.tierRegion && ctx.tierRegion.name;
            if (tier === 'mpo')    return ctx.tierMpo && ctx.tierMpo.name;
            if (tier === 'planning_district') return ctx.tierPlanningDistrict && ctx.tierPlanningDistrict.name;
        } catch (e) {}
        return null;
    }

    function _cacheKey(tabId, tier, value) {
        return tabId + '|' + (tier || '') + '|' + (value || '');
    }

    function _hasClient() {
        return !!(window.crashLensClient && window.crashLensClient.supabaseKey);
    }

    // Preloader registry for tabs that still need row-level Supabase data
    // before they can render. Most tabs now use matviews directly (loaded
    // inside their own init functions) and don't need preloaders.
    var PRELOADERS = {
        // Currently empty — all former preloaders (fatalspeeding, pedestrian)
        // have been replaced by direct matview calls inside the tab init
        // functions. intersection and deepdive still fall through to R2.
    };

    /**
     * True if a tab has a Supabase preloader registered.
     */
    function hasPreloader(tabId) {
        return !!PRELOADERS[tabId];
    }

    /**
     * Run the preloader for a tab. Returns true if Supabase served the tab,
     * false if we should fall back to R2.
     *
     * Caching: a successful result is cached under {tabId, tier, value}; a
     * second call with the same context is instant.
     */
    async function tryPreload(tabId) {
        if (!hasPreloader(tabId)) return false;
        if (!_hasClient()) return false;

        var tier = _activeTier();
        var value = _activeTierValue(tier);
        var key = _cacheKey(tabId, tier, value);

        if (_cache[key]) return true;
        if (_inflight[key]) return _inflight[key];

        var fn = PRELOADERS[tabId];
        _inflight[key] = (async function () {
            try {
                console.log('[TabLoader] Preloading "' + tabId + '" from Supabase (tier=' + tier + ', value=' + value + ')');
                var rows = await fn(window.crashLensClient, tier, value);
                if (!Array.isArray(rows)) {
                    console.log('[TabLoader] "' + tabId + '" preloader returned null — falling back to R2');
                    return false;
                }
                _cache[key] = rows;
                console.log('[TabLoader] "' + tabId + '" preloaded ' + rows.length.toLocaleString() + ' rows from Supabase');
                return true;
            } catch (e) {
                console.warn('[TabLoader] "' + tabId + '" preloader threw:', e && e.message);
                return false;
            } finally {
                delete _inflight[key];
            }
        })();

        return _inflight[key];
    }

    /**
     * Public accessor used by tab processing code.
     *
     * Returns the Supabase-preloaded rows for this tab if available, else
     * crashState.sampleRows (which is the R2 result if loaded, or [] if not).
     *
     * Tabs that have been refactored to be Supabase-first should call this
     * everywhere they previously read crashState.sampleRows.
     */
    function getTabRows(tabId) {
        var tier = _activeTier();
        var value = _activeTierValue(tier);
        var key = _cacheKey(tabId, tier, value);
        if (_cache[key]) return _cache[key];
        try {
            return (typeof crashState !== 'undefined' && crashState && Array.isArray(crashState.sampleRows))
                ? crashState.sampleRows
                : [];
        } catch (e) { return []; }
    }

    /**
     * True if the tab's data was served by Supabase (vs falling back to R2).
     * Useful for the tab to display a source indicator.
     */
    function tabServedBySupabase(tabId) {
        var tier = _activeTier();
        var value = _activeTierValue(tier);
        return !!_cache[_cacheKey(tabId, tier, value)];
    }

    function clearCache() {
        _cache = {};
        _inflight = {};
    }

    function clearTabCache(tabId) {
        Object.keys(_cache).forEach(function (k) {
            if (k.indexOf(tabId + '|') === 0) delete _cache[k];
        });
    }

    // Invalidate cache when tier or jurisdiction changes — the rows we
    // preloaded for Kent County aren't valid for Sussex County.
    document.addEventListener('jurisdictionChanged', clearCache);
    document.addEventListener('tierChanged', clearCache);

    CL.data.tabLoaders = {
        hasPreloader:        hasPreloader,
        tryPreload:          tryPreload,
        getTabRows:          getTabRows,
        tabServedBySupabase: tabServedBySupabase,
        clearCache:          clearCache,
        clearTabCache:       clearTabCache,
        PRELOADERS:          PRELOADERS
    };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('data/tabLoaders');
    }
})();
