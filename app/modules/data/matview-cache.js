/**
 * Shared matview result cache (Round 9 — Fix 7; extended CC 305 §4).
 *
 * Two-tier cache:
 *   L1 — in-memory Map, 60s TTL, 100 entry LRU. Round-trip-free within a
 *        single page session; cleared on full reload.
 *   L2 — IndexedDB persistence, per-matview TTL (default 1h, 24h for the
 *        daily-refreshing mv_dashboard_tier_kpi). Survives page reloads;
 *        cross-state safe because the L2 key includes state.
 *
 * Stale-while-revalidate semantics: on L1 miss + L2 hit, the cached data is
 * returned immediately and a background fetch refreshes L1+L2 silently. The
 * NEXT caller within the L1 TTL sees the fresh data. UI may briefly show
 * stale-but-recent values; acceptable for read-only dashboard views.
 *
 * Bypass: append `?_cb=1` to the URL (or any value) to force a one-shot L2
 * miss. Useful for `?_cb=` cache-bust links + debugging.
 *
 * Usage (unchanged from Round 9):
 *   const data = await CL.data.cachedMatview('mv_hotspots_factors', tier, value,
 *       () => window.crashLensClient.getHotspotFactors(tier, value));
 *
 * If callers pass filter options that affect the result, include them as a
 * 5th `keyExtra` argument so different filter sets get distinct cache slots:
 *   CL.data.cachedMatview('mv_safety_categories', tier, value,
 *       () => client.getSafetyCategories(tier, value, opts), opts);
 *
 * The fetcher is only invoked on cache miss / expiry. In-flight requests for
 * the same key share a single promise so concurrent callers don't race.
 */
window.CL = window.CL || {};
CL.data = CL.data || {};

(function () {
    'use strict';

    var TTL_MS = 60000;
    var MAX_ENTRIES = 100;

    var _cache = new Map();      // key → { ts, data }
    var _inflight = new Map();   // key → Promise

    // ─── CC 305 §4 — L2 IndexedDB layer ────────────────────────────────
    // State-agnostic: the L2 key includes state (read from
    // window.crashLensClient.state at fetch time) so multi-state users get
    // independent cache slots and never see cross-state contamination on
    // reload. The L1 in-memory cache above is unchanged.
    var L2_DB_NAME = 'crashlens-matview-cache';
    var L2_DB_VERSION = 1;
    var L2_STORE = 'responses';
    var L2_TTL_DEFAULT_MS = 60 * 60 * 1000;          // 1h
    var L2_TTL_BY_MV = {
        // matviews that only refresh daily backend-side can be held longer
        'mv_dashboard_tier_kpi': 24 * 60 * 60 * 1000,
    };
    var _l2DbPromise = null;
    var _l2BypassOnce = false;
    try {
        // ?_cb= in the URL forces a one-shot L2 bypass (hard-refresh affordance).
        if (typeof window !== 'undefined' && window.location && window.location.search) {
            _l2BypassOnce = /[?&]_cb=/.test(window.location.search);
        }
    } catch (e) { /* non-fatal */ }

    function _l2Available() {
        return typeof indexedDB !== 'undefined' && !_l2BypassOnce;
    }

    function _l2OpenDb() {
        if (_l2DbPromise) return _l2DbPromise;
        if (!_l2Available()) {
            _l2DbPromise = Promise.resolve(null);
            return _l2DbPromise;
        }
        _l2DbPromise = new Promise(function (resolve) {
            try {
                var req = indexedDB.open(L2_DB_NAME, L2_DB_VERSION);
                req.onupgradeneeded = function (e) {
                    var db = e.target.result;
                    if (!db.objectStoreNames.contains(L2_STORE)) {
                        db.createObjectStore(L2_STORE, { keyPath: 'cacheKey' });
                    }
                };
                req.onsuccess = function (e) { resolve(e.target.result); };
                req.onerror = function () { resolve(null); };
                req.onblocked = function () { resolve(null); };
            } catch (e) { resolve(null); }
        });
        return _l2DbPromise;
    }

    function _activeStateKey() {
        try {
            if (typeof window !== 'undefined' && window.crashLensClient && window.crashLensClient.state) {
                return String(window.crashLensClient.state).toLowerCase();
            }
        } catch (e) { /* non-fatal */ }
        return '';
    }

    function _l2KeyFromL1(l1Key) {
        return _activeStateKey() + '|' + l1Key;
    }

    function _l2Ttl(mvName) {
        return L2_TTL_BY_MV[mvName] || L2_TTL_DEFAULT_MS;
    }

    function _l2Read(mvName, l1Key) {
        return _l2OpenDb().then(function (db) {
            if (!db) return null;
            return new Promise(function (resolve) {
                try {
                    var tx = db.transaction(L2_STORE, 'readonly');
                    var req = tx.objectStore(L2_STORE).get(_l2KeyFromL1(l1Key));
                    req.onsuccess = function () {
                        var row = req.result;
                        if (!row) return resolve(null);
                        if ((Date.now() - row.ts) > _l2Ttl(mvName)) return resolve(null);
                        resolve(row.data);
                    };
                    req.onerror = function () { resolve(null); };
                } catch (e) { resolve(null); }
            });
        });
    }

    function _l2Write(mvName, l1Key, data) {
        // Fire-and-forget; never block the caller, never throw.
        _l2OpenDb().then(function (db) {
            if (!db) return;
            try {
                var tx = db.transaction(L2_STORE, 'readwrite');
                tx.objectStore(L2_STORE).put({
                    cacheKey: _l2KeyFromL1(l1Key),
                    mv: mvName,
                    ts: Date.now(),
                    data: data
                });
            } catch (e) { /* non-fatal */ }
        });
    }

    function _l2Clear(predicate) {
        // predicate(row) → true to delete. predicate omitted = wipe all.
        return _l2OpenDb().then(function (db) {
            if (!db) return;
            return new Promise(function (resolve) {
                try {
                    var tx = db.transaction(L2_STORE, 'readwrite');
                    var store = tx.objectStore(L2_STORE);
                    if (!predicate) { store.clear(); tx.oncomplete = function () { resolve(); }; return; }
                    var req = store.openCursor();
                    req.onsuccess = function (e) {
                        var cursor = e.target.result;
                        if (!cursor) return resolve();
                        try { if (predicate(cursor.value)) cursor.delete(); } catch (err) { /* non-fatal */ }
                        cursor.continue();
                    };
                    req.onerror = function () { resolve(); };
                } catch (e) { resolve(); }
            });
        });
    }
    // ─── /CC 305 §4 ────────────────────────────────────────────────────

    function _key(mvName, tier, value, keyExtra) {
        var extra = '';
        if (keyExtra != null) {
            try { extra = ':' + JSON.stringify(keyExtra); } catch (e) { extra = ':?'; }
        }
        return mvName + ':' + (tier || '') + ':' + (value || '') + extra;
    }

    function _evictOldest() {
        if (_cache.size <= MAX_ENTRIES) return;
        var oldestKey = null, oldestTs = Infinity;
        _cache.forEach(function (v, k) {
            if (v.ts < oldestTs) { oldestTs = v.ts; oldestKey = k; }
        });
        if (oldestKey) _cache.delete(oldestKey);
    }

    function _runFetch(mvName, key, fetcher, signal) {
        // The full "fetch + populate L1 + populate L2" path, deduped via
        // _inflight. Used both for cold misses and SWR background revalidation.
        if (_inflight.has(key)) return _inflight.get(key);
        var promise = Promise.resolve()
            .then(function () { return fetcher(signal ? { signal: signal } : undefined); })
            .then(function (data) {
                if (signal && signal.aborted) {
                    _inflight.delete(key);
                    return data;
                }
                _cache.set(key, { ts: Date.now(), data: data });
                _evictOldest();
                _inflight.delete(key);
                // L2 write is fire-and-forget (best-effort persistence).
                if (data != null) _l2Write(mvName, key, data);
                return data;
            })
            .catch(function (err) {
                _inflight.delete(key);
                throw err;
            });
        _inflight.set(key, promise);
        return promise;
    }

    CL.data.cachedMatview = function (mvName, tier, value, fetcher, keyExtra, opts) {
        var key = _key(mvName, tier, value, keyExtra);
        // Round 21 §1.2 — accept an optional AbortSignal so callers (prewarm)
        // can cancel in-flight fetches when superseded. The signal is passed
        // into the fetcher; fetchers that accept it forward it to fetch().
        var signal = (opts && opts.signal) ? opts.signal : null;

        // L1 hit
        var hit = _cache.get(key);
        if (hit && (Date.now() - hit.ts) < TTL_MS) {
            return Promise.resolve(hit.data);
        }
        if (hit) _cache.delete(key);   // L1 expired

        // L1 miss → L2 check (SWR). On L2 hit: return immediately, refresh in background.
        if (_l2Available() && !_inflight.has(key)) {
            return _l2Read(mvName, key).then(function (l2Data) {
                if (l2Data != null) {
                    // Populate L1 with the L2 result so subsequent same-session
                    // hits within 60s skip both layers.
                    _cache.set(key, { ts: Date.now(), data: l2Data });
                    _evictOldest();
                    // Fire background revalidation (don't await, swallow errors).
                    try {
                        _runFetch(mvName, key, fetcher, signal).catch(function () { /* non-fatal */ });
                    } catch (e) { /* non-fatal */ }
                    return l2Data;
                }
                return _runFetch(mvName, key, fetcher, signal);
            });
        }

        // No L2 or already in flight — fall through to the normal fetch path.
        return _runFetch(mvName, key, fetcher, signal);
    };

    /**
     * Drop cache entries. With no args, clears L1 (in-memory) only — the L2
     * IDB persistence is intentionally left intact so subsequent navigations
     * still benefit from cross-session reuse. To wipe L2 too, pass
     * `{ persistent: true }` as a 3rd argument, or call `dropPersistentCache()`.
     *
     * With (tier, value), drops only L1 entries scoped to that jurisdiction.
     */
    CL.data.invalidateMatviewCache = function (tier, value, flags) {
        if (!tier || !value) {
            _cache.clear();
            if (flags && flags.persistent) _l2Clear();
            return;
        }
        var suffix = ':' + tier + ':' + value;
        Array.from(_cache.keys())
            .filter(function (k) { return k.endsWith(suffix); })
            .forEach(function (k) { _cache.delete(k); });
        if (flags && flags.persistent) {
            _l2Clear(function (row) { return row && row.cacheKey && row.cacheKey.endsWith(suffix); });
        }
    };

    /** Wipe the L2 IndexedDB store entirely. Diagnostic / hard-reset. */
    CL.data.dropPersistentCache = function () { return _l2Clear(); };

    /**
     * Diagnostic helper — exposes cache stats for DevTools inspection.
     */
    CL.data.matviewCacheStats = function () {
        var entries = [];
        var now = Date.now();
        _cache.forEach(function (v, k) {
            entries.push({ key: k, ageMs: now - v.ts, sizeRows: Array.isArray(v.data) ? v.data.length : null });
        });
        return {
            entries: entries,
            inflight: _inflight.size,
            l2Available: _l2Available(),
            l2BypassOnce: _l2BypassOnce
        };
    };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('data/matview-cache');
    }
})();
