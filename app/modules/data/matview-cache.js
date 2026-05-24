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
'use strict';

var TTL_MS = 60000;
var MAX_ENTRIES = 100;

var _cache = new Map();      // key → { ts, data }
var _inflight = new Map();   // key → Promise

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

export function cachedMatview(mvName, tier, value, fetcher, keyExtra, opts) {
    var key = _key(mvName, tier, value, keyExtra);
    // Round 21 §1.2 — accept an optional AbortSignal so callers (prewarm)
    // can cancel in-flight fetches when superseded. The signal is passed
    // into the fetcher; fetchers that accept it forward it to fetch().
    var signal = (opts && opts.signal) ? opts.signal : null;

    var hit = _cache.get(key);
    if (hit && (Date.now() - hit.ts) < TTL_MS) {
        return Promise.resolve(hit.data);
    }
    if (hit) _cache.delete(key);   // expired

    if (_inflight.has(key)) {
        return _inflight.get(key);
    }

    var promise = Promise.resolve()
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
            _inflight.delete(key);
            return data;
        })
        .catch(function (err) {
            _inflight.delete(key);
            throw err;
        });
    _inflight.set(key, promise);
    return promise;
}

/**
 * Drop cache entries. With no args, clears everything. With (tier, value),
 * drops only entries scoped to that jurisdiction.
 */
export function invalidateMatviewCache(tier, value) {
    if (!tier || !value) {
        _cache.clear();
        return;
    }
    var suffix = ':' + tier + ':' + value;
    Array.from(_cache.keys())
        .filter(function (k) { return k.endsWith(suffix); })
        .forEach(function (k) { _cache.delete(k); });
}

/**
 * Diagnostic helper — exposes cache stats for DevTools inspection.
 */
export function matviewCacheStats() {
    var entries = [];
    var now = Date.now();
    _cache.forEach(function (v, k) {
        entries.push({ key: k, ageMs: now - v.ts, sizeRows: Array.isArray(v.data) ? v.data.length : null });
    });
    return { entries: entries, inflight: _inflight.size };
}

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.data = CL.data || {};
CL.data.cachedMatview = cachedMatview;
CL.data.invalidateMatviewCache = invalidateMatviewCache;
CL.data.matviewCacheStats = matviewCacheStats;

if (typeof CL._registerModule === 'function') {
    CL._registerModule('data/matview-cache');
}
