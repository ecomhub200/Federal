/**
 * CL map.pointsHydrate module
 *
 * Extracted from app/index.html (snapshot L28242-L28400) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/39-map-map-points-hydrate.md.
 * Responsibility: Map points hydration from matview/IndexedDB cache.
 *
 * Public API (back-compat dual exposure):
 *   - window._hydrateMapPointsFromMatview → CL.map._hydrateMapPointsFromMatview
 *
 * Self-contained: the 3 globals (_MAP_POINTS_CACHE_DB/_STORE,
 * _mapPointsInFlight) and 5 cache helpers (_openMapPointsCache,
 * _mapPointsDayBucket, _mapPointsCacheKey, _readMapPointsCache,
 * _writeMapPointsCache) are module-private (verified 0 external refs).
 *
 * Depends on (must load before this file): `data/matview-cache`, `map/map-render`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

// Round 25 §2 — at aggregate tiers, R2 is skipped (parquet is wrong shape
// for rollups). Instead, lazy-fetch per-marker rows from mv_map_points so
// every per-row filter (Map / HotSpots / Intersections / PedBike / etc.)
// has data to operate on. State-agnostic — keys on resolveTier()'s output.
// Round 25 §6 — IndexedDB cache for matview-fetched mapPoints.
// Keyed by (state, tier, value, day-bucket) so the cache invalidates
// every 24h. Most users browse for <24h; matview data refreshes daily
// per the backend pipeline.
const _MAP_POINTS_CACHE_DB = 'crashlens-map-points-cache';
const _MAP_POINTS_CACHE_STORE = 'points';

function _openMapPointsCache() {
    return new Promise((resolve, reject) => {
        // v2 — purge pre-PR-206 uncapped entries by recreating the store on
        // upgrade. Day-bucket TTL doesn't cover this because the cache key
        // has no cap-version segment, so stale entries (e.g. 132K rows at
        // planning_district from before the tier cap shipped) would hit on
        // read for up to 24h and bypass POINT_CAPS.
        const req = indexedDB.open(_MAP_POINTS_CACHE_DB, 2);
        req.onupgradeneeded = e => {
            const db = e.target.result;
            if (e.oldVersion < 2 && db.objectStoreNames.contains(_MAP_POINTS_CACHE_STORE)) {
                db.deleteObjectStore(_MAP_POINTS_CACHE_STORE);
            }
            if (!db.objectStoreNames.contains(_MAP_POINTS_CACHE_STORE)) {
                db.createObjectStore(_MAP_POINTS_CACHE_STORE, { keyPath: 'cacheKey' });
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = reject;
    });
}

function _mapPointsDayBucket() {
    return Math.floor(Date.now() / (24*60*60*1000));
}

function _mapPointsCacheKey(state, tier, value) {
    return `${state}|${tier}|${value || ''}|${_mapPointsDayBucket()}`;
}

async function _readMapPointsCache(state, tier, value) {
    try {
        const db = await _openMapPointsCache();
        const tx = db.transaction(_MAP_POINTS_CACHE_STORE, 'readonly');
        const store = tx.objectStore(_MAP_POINTS_CACHE_STORE);
        const cacheKey = _mapPointsCacheKey(state, tier, value);
        return await new Promise((res, rej) => {
            const req = store.get(cacheKey);
            req.onsuccess = () => res(req.result?.points || null);
            req.onerror = rej;
        });
    } catch (e) { return null; }
}

async function _writeMapPointsCache(state, tier, value, points) {
    try {
        const db = await _openMapPointsCache();
        const tx = db.transaction(_MAP_POINTS_CACHE_STORE, 'readwrite');
        const store = tx.objectStore(_MAP_POINTS_CACHE_STORE);
        store.put({ cacheKey: _mapPointsCacheKey(state, tier, value), points: points, ts: Date.now() });
        // Also evict stale entries (different day bucket) to bound IDB size.
        const todaySuffix = '|' + _mapPointsDayBucket();
        store.openCursor().onsuccess = e => {
            const cursor = e.target.result;
            if (!cursor) return;
            if (!cursor.value.cacheKey.endsWith(todaySuffix)) {
                cursor.delete();
            }
            cursor.continue();
        };
    } catch (e) { /* non-fatal */ }
}

// Round 26 v3 §2 — in-flight dedupe. Multiple events (jurisdictionChanged +
// tierChanged + crashDataLoaded + filter changes) all trigger
// _hydrateMapPointsFromMatview. Map<key, Promise> coalesces them.
const _mapPointsInFlight = new Map();

async function _hydrateMapPointsFromMatview(reason) {
    const dc = window.crashLensClient;
    if (!dc || typeof dc.getMapPoints !== 'function') return;
    let opts = {};
    let tier = 'state', value = '';
    try {
        const t = (window.CL && CL.data && CL.data.supabaseBridge && CL.data.supabaseBridge.resolveTier)
            ? CL.data.supabaseBridge.resolveTier()
            : null;
        if (t && t.tier) {
            tier = t.tier; value = t.value || '';
            if (t.tier === 'dot_district')      opts.dotDistrict      = t.value;
            if (t.tier === 'planning_district') opts.planningDistrict = t.value;
            if (t.tier === 'mpo')               opts.mpoName          = t.value;
            if (t.tier === 'county' || t.tier === 'city') opts.jurisdiction = t.value;
            // 'state' / 'federal' → no tier filter; the state= eq filter alone scopes it.
        }
        // Pass tier through so getMapPoints can apply CL.core.POINT_CAPS.
        opts.tier = tier;
    } catch (e) { /* fall through to state-only scope */ }

    const stateKey = (dc.state || '').toLowerCase();
    const dedupeKey = `${stateKey}|${tier}|${value}`;
    if (_mapPointsInFlight.has(dedupeKey)) {
        console.log('[mapPointsHydrate] DEDUPE — already fetching ' + dedupeKey + ' (reason: ' + reason + ')');
        return _mapPointsInFlight.get(dedupeKey);
    }

    const promise = (async () => {
        // Round 25 §6 — try IndexedDB cache first
        const cached = await _readMapPointsCache(stateKey, tier, value);
        if (cached) {
            // Defensive: clamp stale cache entries to the current tier cap.
            // The cache key has no cap-version segment, so a pre-PR-206 entry
            // (uncapped) can hit here on a 24h-bucket day where the cap value
            // changed. Re-apply.
            const POINT_CAPS = (window.CL && window.CL.core && window.CL.core.POINT_CAPS) || {};
            const cap = POINT_CAPS[tier] || 200000;
            let clampedCache = cached;
            if (cached.length > cap) {
                console.log('[mapPointsHydrate] clamping stale cache ' + cached.length + ' → ' + cap + ' for ' + tier + ' tier');
                clampedCache = cached.slice(0, cap);
            }
            crashState.mapPoints = clampedCache;
            console.log('[mapPointsHydrate] HIT cache (' + reason + ') ' + clampedCache.length + ' points');
            document.dispatchEvent(new CustomEvent('crashDataLoaded', { detail: { source: 'mv_map_points_cached' } }));
            showBackgroundLoadingIndicator(false);
            return;
        }

        console.log('[mapPointsHydrate] MISS cache (' + reason + '), fetching mv_map_points', opts);
        const t0 = Date.now();
        const rows = await dc.getMapPoints(opts);
        crashState.mapPoints = rows || [];
        console.log('[mapPointsHydrate] populated ' + crashState.mapPoints.length +
                    ' points in ' + (Date.now() - t0) + 'ms — filters now operational');
        // Write to cache (best-effort)
        _writeMapPointsCache(stateKey, tier, value, crashState.mapPoints);
        document.dispatchEvent(new CustomEvent('crashDataLoaded', { detail: { source: 'mv_map_points' } }));
        showBackgroundLoadingIndicator(false);
    })();

    _mapPointsInFlight.set(dedupeKey, promise);
    try { return await promise; }
    finally { _mapPointsInFlight.delete(dedupeKey); }
}

  // ─── EXTRACTED CODE END ───

  // CC 313 — lazy-hydrate gate. The original event-driven hydrate above fired
  // on every jurisdictionChanged / tierChanged regardless of which tab the
  // user was on, paying a ~4s 50K-row fetch even when no consumer tab was
  // open. Map-tab Leaflet rendering goes through supabase-map-bridge.js
  // (viewport RPC, never touches crashState.mapPoints) — only the
  // per-row-filter tabs below actually read the dataset.
  //
  // Wide/safer consumer set per the §1 audit doc. Other tabs (upload,
  // dashboard, scorecard, etc.) defer until the user navigates to a
  // consumer. State-agnostic — keys on tab activation, not on state.
  const _MAP_POINTS_CONSUMER_TABS = new Set([
      'map', 'hotspots', 'intersection', 'pedestrian', 'analysis',
      'warrants', 'cmf', 'assets'
  ]);

  function _readActiveTabId() {
      // No CL.app.activeTab global — derive from DOM.
      const el = document.querySelector(
          '.sidebar-nav-item.active[data-tab], .sidebar-standalone-item.active[data-tab]'
      );
      if (el && el.dataset && el.dataset.tab) return el.dataset.tab;
      const tc = document.querySelector('.tab-content.active');
      if (tc && tc.id && tc.id.indexOf('tab-') === 0) return tc.id.slice(4);
      return '';
  }

  async function _hydrateMapPointsIfNeeded(reason, forceFetch) {
      // Already hydrated this session? Short-circuit — covers the case where
      // a consumer tab forced the fetch earlier, then a tierChanged event
      // fires while still on that tab (or any other tab — the data is
      // already there).
      if (Array.isArray(crashState.mapPoints) && crashState.mapPoints.length > 0) {
          return crashState.mapPoints;
      }
      if (!forceFetch) {
          const activeTab = _readActiveTabId();
          if (!_MAP_POINTS_CONSUMER_TABS.has(activeTab)) {
              console.log('[mapPointsHydrate] LAZY-SKIP (' + reason
                  + ') — active tab "' + activeTab
                  + '" does not consume crashState.mapPoints');
              return null;
          }
      }
      return _hydrateMapPointsFromMatview(reason);
  }

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.map = CL.map || {};
  window._hydrateMapPointsFromMatview = _hydrateMapPointsFromMatview; CL.map._hydrateMapPointsFromMatview = _hydrateMapPointsFromMatview;
  window._hydrateMapPointsIfNeeded = _hydrateMapPointsIfNeeded; CL.map._hydrateMapPointsIfNeeded = _hydrateMapPointsIfNeeded;
  CL.map._MAP_POINTS_CONSUMER_TABS = _MAP_POINTS_CONSUMER_TABS;
  CL._registerModule('map/map-points-hydrate');
})();
