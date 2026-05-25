/**
 * Shared matview result cache (Round 9 — Fix 7).
 *
 * Round 7 added several matview fetches (mv_hotspots_factors,
 * mv_hotspots_topcoll, mv_pedbike_breakdowns, mv_factor_year,
 * mv_intersection_summary). Each costs ~1–2s. They fire in parallel on the
 * first tab visit, but on every tier change they ALL fire again. This module
 * memoizes results per (matview, tier, value) for 60 seconds so back-and-forth
 * navigation across tabs / tiers becomes effectively free.
 *
 * Usage:
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

    // ─── Perf Phase 4 (CC 314) — opt-in IndexedDB persistence layer ───
    // Mirrors the day-bucket cache pattern in
    // app/modules/map/map-points-hydrate.js (Round 25 §6), generalized to
    // arbitrary matviews + multi-state keys + LRU eviction.
    var _MV_CACHE_DB = 'crashlens-matview-cache';
    var _MV_CACHE_STORE = 'responses';
    var _MV_CACHE_MAX_BYTES = 200 * 1024 * 1024;        // 200 MB total budget
    var _MV_DEFAULT_PERSIST_TTL = 24 * 60 * 60 * 1000;  // 24h

    function _openMvCache() {
        return new Promise(function (resolve, reject) {
            var req = indexedDB.open(_MV_CACHE_DB, 1);
            req.onupgradeneeded = function (e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains(_MV_CACHE_STORE)) {
                    var store = db.createObjectStore(_MV_CACHE_STORE, { keyPath: 'key' });
                    store.createIndex('ts', 'ts');
                }
            };
            req.onsuccess = function (e) { resolve(e.target.result); };
            req.onerror = reject;
        });
    }

    function _mvDayBucket() {
        return Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    }

    function _idbKey(state, mvName, tier, value, keyExtra) {
        var extraStr = '';
        if (keyExtra != null) {
            try { extraStr = JSON.stringify(keyExtra); } catch (e) { extraStr = '?'; }
        }
        return (state || '').toLowerCase() + '|' + mvName + '|' + (tier || '') + '|' + (value || '') + '|' + extraStr + '|' + _mvDayBucket();
    }

    function _idbRead(key, ttlMs) {
        return _openMvCache().then(function (db) {
            return new Promise(function (res, rej) {
                var tx = db.transaction(_MV_CACHE_STORE, 'readonly');
                var store = tx.objectStore(_MV_CACHE_STORE);
                var req = store.get(key);
                req.onsuccess = function () {
                    var v = req.result;
                    if (!v) return res(null);
                    if (Date.now() - v.ts > ttlMs) return res(null);
                    res(v.data);
                };
                req.onerror = rej;
            });
        }).catch(function () { return null; });
    }

    function _idbWrite(key, data) {
        return _openMvCache().then(function (db) {
            var tx = db.transaction(_MV_CACHE_STORE, 'readwrite');
            var store = tx.objectStore(_MV_CACHE_STORE);
            var size = 0;
            try { size = JSON.stringify(data).length; } catch (e) { size = 0; }
            store.put({ key: key, data: data, ts: Date.now(), size_bytes: size });
            // Best-effort LRU eviction when over the global budget.
            _idbEvictIfOver(_MV_CACHE_MAX_BYTES);
        }).catch(function () { /* non-fatal */ });
    }

    function _idbEvictIfOver(maxBytes) {
        return _openMvCache().then(function (db) {
            return new Promise(function (res) {
                var tx = db.transaction(_MV_CACHE_STORE, 'readwrite');
                var store = tx.objectStore(_MV_CACHE_STORE);
                var all = [];
                store.openCursor().onsuccess = function (e) {
                    var c = e.target.result;
                    if (!c) {
                        var total = all.reduce(function (s, x) { return s + x.size; }, 0);
                        if (total <= maxBytes) return res();
                        all.sort(function (a, b) { return a.ts - b.ts; });
                        var freed = 0;
                        var target = total - maxBytes;
                        // Re-open a fresh tx to perform deletes — the cursor's
                        // tx is already drained.
                        var delTx = db.transaction(_MV_CACHE_STORE, 'readwrite');
                        var delStore = delTx.objectStore(_MV_CACHE_STORE);
                        for (var i = 0; i < all.length; i++) {
                            if (freed >= target) break;
                            delStore.delete(all[i].key);
                            freed += all[i].size;
                        }
                        delTx.oncomplete = function () { res(); };
                        delTx.onerror = function () { res(); };
                        return;
                    }
                    all.push({ key: c.value.key, ts: c.value.ts, size: c.value.size_bytes || 0 });
                    c.continue();
                };
            });
        }).catch(function () { /* non-fatal */ });
    }

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

    CL.data.cachedMatview = function (mvName, tier, value, fetcher, keyExtra, opts) {
        var key = _key(mvName, tier, value, keyExtra);
        // Round 21 §1.2 — accept an optional AbortSignal so callers (prewarm)
        // can cancel in-flight fetches when superseded. The signal is passed
        // into the fetcher; fetchers that accept it forward it to fetch().
        var signal = (opts && opts.signal) ? opts.signal : null;
        // Perf Phase 4 (CC 314) — opt-in IDB persistence. Default false for
        // back-compat with the 13 in-memory-only callers.
        var persist = !!(opts && opts.persist);
        var persistTtl = (opts && opts.persistTtlMs) || _MV_DEFAULT_PERSIST_TTL;
        var state = (opts && opts.state) || (window.crashLensClient && window.crashLensClient.state) || '';

        var hit = _cache.get(key);
        if (hit && (Date.now() - hit.ts) < TTL_MS) {
            return Promise.resolve(hit.data);
        }
        if (hit) _cache.delete(key);   // expired

        if (_inflight.has(key)) {
            return _inflight.get(key);
        }

        var idbKey = persist ? _idbKey(state, mvName, tier, value, keyExtra) : null;
        var idbProbe = persist ? _idbRead(idbKey, persistTtl) : Promise.resolve(null);

        var promise = idbProbe.then(function (idbData) {
            if (idbData != null) {
                // Stale-while-revalidate: serve cached, refresh in background.
                _cache.set(key, { ts: Date.now(), data: idbData });
                _evictOldest();
                Promise.resolve()
                    .then(function () { return fetcher(signal ? { signal: signal } : undefined); })
                    .then(function (fresh) {
                        if (signal && signal.aborted) return;
                        _cache.set(key, { ts: Date.now(), data: fresh });
                        _evictOldest();
                        _idbWrite(idbKey, fresh);
                    })
                    .catch(function () { /* swallow background errors */ });
                _inflight.delete(key);
                return idbData;
            }
            return Promise.resolve()
                .then(function () { return fetcher(signal ? { signal: signal } : undefined); })
                .then(function (data) {
                    // Don't poison the cache with a null result returned by an
                    // AbortError-suppressed fetcher.
                    if (signal && signal.aborted) {
                        _inflight.delete(key);
                        return data;
                    }
                    _cache.set(key, { ts: Date.now(), data: data });
                    _evictOldest();
                    if (persist) _idbWrite(idbKey, data);
                    _inflight.delete(key);
                    return data;
                });
        }).catch(function (err) {
            _inflight.delete(key);
            throw err;
        });
        _inflight.set(key, promise);
        return promise;
    };

    /**
     * Drop cache entries. With no args, clears everything. With (tier, value),
     * drops only entries scoped to that jurisdiction.
     */
    CL.data.invalidateMatviewCache = function (tier, value) {
        if (!tier || !value) {
            _cache.clear();
            return;
        }
        var suffix = ':' + tier + ':' + value;
        Array.from(_cache.keys())
            .filter(function (k) { return k.endsWith(suffix); })
            .forEach(function (k) { _cache.delete(k); });
    };

    /**
     * Diagnostic helper — exposes cache stats for DevTools inspection.
     */
    CL.data.matviewCacheStats = function () {
        var entries = [];
        var now = Date.now();
        _cache.forEach(function (v, k) {
            entries.push({ key: k, ageMs: now - v.ts, sizeRows: Array.isArray(v.data) ? v.data.length : null });
        });
        return { entries: entries, inflight: _inflight.size };
    };

    /**
     * Perf Phase 4 (CC 314) — IndexedDB cache inspection.
     * Returns a Promise resolving to an array of { key, ageMs, size } entries.
     */
    CL.data.matviewCacheIdbStats = function () {
        return _openMvCache().then(function (db) {
            return new Promise(function (res) {
                var tx = db.transaction(_MV_CACHE_STORE, 'readonly');
                var store = tx.objectStore(_MV_CACHE_STORE);
                var out = [];
                store.openCursor().onsuccess = function (e) {
                    var c = e.target.result;
                    if (!c) return res(out);
                    out.push({ key: c.value.key, ageMs: Date.now() - c.value.ts, size: c.value.size_bytes || 0 });
                    c.continue();
                };
            });
        }).catch(function () { return []; });
    };

    /**
     * Perf Phase 4 (CC 314) — IndexedDB cache invalidation.
     * With no filterFn, clears everything. With a filter, deletes entries
     * where filterFn(entry) returns truthy.
     */
    CL.data.matviewCacheIdbClear = function (filterFn) {
        return _openMvCache().then(function (db) {
            return new Promise(function (res) {
                var tx = db.transaction(_MV_CACHE_STORE, 'readwrite');
                var store = tx.objectStore(_MV_CACHE_STORE);
                if (typeof filterFn !== 'function') {
                    store.clear();
                    tx.oncomplete = function () { res(true); };
                    tx.onerror = function () { res(false); };
                    return;
                }
                store.openCursor().onsuccess = function (e) {
                    var c = e.target.result;
                    if (!c) return;
                    if (filterFn(c.value)) c.delete();
                    c.continue();
                };
                tx.oncomplete = function () { res(true); };
                tx.onerror = function () { res(false); };
            });
        }).catch(function () { return false; });
    };

    /** Full IDB wipe convenience. */
    CL.data.cacheClearIdb = function () { return CL.data.matviewCacheIdbClear(); };

    /**
     * Per-state IDB wipe. Call from the state-change handler to keep the
     * cache from growing across many states. TODO: wire from app/index.html
     * state-change listener in a follow-up.
     */
    CL.data.cacheClearIdbByState = function (state) {
        var prefix = (state || '').toLowerCase() + '|';
        return CL.data.matviewCacheIdbClear(function (entry) {
            return entry.key && entry.key.indexOf(prefix) === 0;
        });
    };

    if (typeof CL._registerModule === 'function') {
        CL._registerModule('data/matview-cache');
    }
})();
