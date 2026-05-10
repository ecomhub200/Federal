/**
 * Lazy chunk loader (Round 9 — Fix 6 scaffolding).
 *
 * Loads optional `app/chunks/<name>.js` bundles on demand, dedup-safe.
 *
 * Today this scaffolding is wired but no chunks have been physically
 * extracted yet — the index.html is still a single 12 MB monolith.
 * The full code-split is a 1–2 day task per the Round 9 brief; this
 * module is the integration point for future incremental extraction:
 *
 *   1. Extract a tab's JS into `app/chunks/<name>.js` (eg. `reports.js`)
 *   2. Add the tab name to TAB_TO_CHUNK below
 *   3. The showTab wrapper in index.html will await the chunk before
 *      activating the tab
 *
 * Until a chunk file actually exists, requests for it fail soft (warn
 * + continue), so this module is harmless to ship before extraction.
 *
 * Public API:
 *   await CL.data.loadChunkOnce('map')
 *   CL.data.chunkIsLoaded('map') → boolean
 *   CL.data.TAB_TO_CHUNK         → { tabId: chunkName, ... }
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

(function () {
    'use strict';

    // Map showTab(tabId) to its chunk file. When a tab isn't listed
    // here the showTab wrapper passes through with no chunk load.
    var TAB_TO_CHUNK = {
        // Populate as chunks are extracted. Examples (commented until
        // the chunk files actually exist):
        // 'map':           'map',
        // 'crashtree':     'map',
        // 'reports':       'reports',
        // 'warrants':      'warrants',
        // 'prediction':    'prediction'
    };

    var _loaded = new Set();
    var _inflight = new Map();   // chunkName → Promise

    function loadChunkOnce(name) {
        if (!name) return Promise.resolve();
        if (_loaded.has(name)) return Promise.resolve();
        if (_inflight.has(name)) return _inflight.get(name);

        var promise = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src = 'chunks/' + name + '.js';
            s.async = false;   // preserve execution order across siblings
            s.onload = function () {
                _loaded.add(name);
                _inflight.delete(name);
                console.log('[chunk] loaded:', name);
                resolve();
            };
            s.onerror = function (e) {
                _inflight.delete(name);
                console.warn('[chunk] failed to load (likely not yet extracted):', name);
                // Resolve (not reject) — lets the rest of the app keep
                // working even if a chunk is missing. The tab that needed
                // it will simply behave as before (still served from the
                // monolithic index.html during the transition).
                resolve();
            };
            document.head.appendChild(s);
        });
        _inflight.set(name, promise);
        return promise;
    }

    function chunkIsLoaded(name) {
        return _loaded.has(name);
    }

    /**
     * Wraps the global showTab() with chunk pre-loading. Safe to call
     * multiple times — subsequent invocations replace the prior wrapper
     * cleanly.
     */
    function installShowTabHook() {
        if (typeof window.showTab !== 'function') return false;
        if (window.showTab.__chunkWrapped) return true;
        var orig = window.showTab;
        var wrapped = async function (tabId) {
            try {
                var chunk = TAB_TO_CHUNK[tabId];
                if (chunk) await loadChunkOnce(chunk);
            } catch (e) {
                console.warn('[chunk] hook error for', tabId, e && e.message);
            }
            return orig.apply(this, arguments);
        };
        wrapped.__chunkWrapped = true;
        window.showTab = wrapped;
        return true;
    }

    CL.data.loadChunkOnce = loadChunkOnce;
    CL.data.chunkIsLoaded = chunkIsLoaded;
    CL.data.TAB_TO_CHUNK = TAB_TO_CHUNK;
    CL.data.installShowTabHook = installShowTabHook;

    // Try to install the hook now; if showTab isn't defined yet, retry
    // on DOMContentLoaded.
    if (!installShowTabHook()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', installShowTabHook, { once: true });
        } else {
            // showTab is defined inline in index.html, so by the time this
            // module evaluates it should already exist. Defer-retry once
            // anyway via microtask.
            Promise.resolve().then(installShowTabHook);
        }
    }

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('data/chunk-loader');
    }
})();
