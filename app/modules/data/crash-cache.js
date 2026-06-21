/**
 * CL data.crashCache — extracted verbatim from app/index.html (single cohesive module).
 * NO behavior change. Functions dual-exposed window.<fn> + CL.data.crashCache.<fn>; module-private
 * state (0 external refs) stays inside this IIFE.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
/**
 * Open/Initialize IndexedDB for crash data cache
 */
async function crashCacheOpen() {
    return new Promise((resolve, reject) => {
        if (crashCacheState.db) {
            resolve(crashCacheState.db);
            return;
        }

        const request = indexedDB.open(CRASH_CACHE_CONSTANTS.DB_NAME, CRASH_CACHE_CONSTANTS.DB_VERSION);

        request.onerror = () => {
            console.error('[CrashCache] IndexedDB error:', request.error);
            reject(request.error);
        };

        request.onsuccess = () => {
            crashCacheState.db = request.result;
            console.log('%c[CrashCache] IndexedDB opened successfully', 'color: #22c55e; font-weight: bold');
            resolve(crashCacheState.db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(CRASH_CACHE_CONSTANTS.STORE_NAME)) {
                const store = db.createObjectStore(CRASH_CACHE_CONSTANTS.STORE_NAME, { keyPath: 'id' });
                store.createIndex('cachedAt', 'cachedAt', { unique: false });
                store.createIndex('expiresAt', 'expiresAt', { unique: false });
                console.log('[CrashCache] Object store created');
            }
        };
    });
}

/**
 * Generate cache key from STATE + jurisdiction + filter profile.
 * State is included to prevent cross-state cache collisions
 * (e.g., same jurisdiction ID in Virginia vs Colorado).
 */
function getCrashCacheKey() {
    const stateKey = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : 'unknown';
    const jurisdiction = getActiveJurisdictionId();
    const filterProfile = appSettings?.selectedFilterProfile || localStorage.getItem('selectedFilterProfile') || 'countyOnly';
    // Include tier + scope to prevent statewide data being served for county requests (and vice versa)
    const tier = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext.viewTier : 'county';
    let scopeId = '';
    if (tier === 'region') scopeId = jurisdictionContext.tierRegion?.id || '';
    else if (tier === 'mpo') scopeId = jurisdictionContext.tierMpo?.id || '';
    const tierKey = scopeId ? `${tier}_${scopeId}` : tier;
    return `${stateKey}_${jurisdiction}_${filterProfile}_${tierKey}`;
}

/**
 * Save crash aggregates to IndexedDB cache
 */
async function crashCacheSave() {
    try {
        const db = await crashCacheOpen();
        const cacheKey = getCrashCacheKey();
        const now = Date.now();
        const expiresAt = now + (CRASH_CACHE_CONSTANTS.CACHE_DAYS * 24 * 60 * 60 * 1000);

        const record = {
            id: cacheKey,
            stateKey: (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : 'unknown',
            jurisdiction: getActiveJurisdictionId(),
            filterProfile: appSettings?.selectedFilterProfile || localStorage.getItem('selectedFilterProfile') || 'countyOnly',
            dataSource: connectionState.dataSource || 'unknown',
            aggregates: crashState.aggregates,
            years: crashState.years,
            routes: crashState.routes,
            nodes: crashState.nodes,
            totalRows: crashState.totalRows,
            cachedAt: now,
            expiresAt: expiresAt,
            schemaVersion: CRASH_CACHE_CONSTANTS.SCHEMA_VERSION
        };

        return new Promise((resolve, reject) => {
            const tx = db.transaction(CRASH_CACHE_CONSTANTS.STORE_NAME, 'readwrite');
            const store = tx.objectStore(CRASH_CACHE_CONSTANTS.STORE_NAME);
            const request = store.put(record);

            request.onsuccess = () => {
                crashCacheState.cachedAt = now;
                crashCacheState.expiresAt = expiresAt;
                crashCacheState.cacheStatus = 'hit';
                console.log(`%c[CrashCache] Saved: ${cacheKey} (expires in ${CRASH_CACHE_CONSTANTS.CACHE_DAYS} days)`, 'color: #22c55e');
                updateCacheStatusUI();
                resolve(record);
            };
            request.onerror = () => {
                console.error('[CrashCache] Save error:', request.error);
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('[CrashCache] Save failed:', error);
        throw error;
    }
}

/**
 * Load crash aggregates from IndexedDB cache
 * Returns null if cache doesn't exist, is expired, or schema version mismatch
 */
async function crashCacheLoad() {
    try {
        const db = await crashCacheOpen();
        const cacheKey = getCrashCacheKey();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(CRASH_CACHE_CONSTANTS.STORE_NAME, 'readonly');
            const store = tx.objectStore(CRASH_CACHE_CONSTANTS.STORE_NAME);
            const request = store.get(cacheKey);

            request.onsuccess = () => {
                const record = request.result;
                const now = Date.now();

                if (!record) {
                    console.log('[CrashCache] No cache found for:', cacheKey);
                    crashCacheState.cacheStatus = 'miss';
                    resolve(null);
                    return;
                }

                // Check schema version
                if (record.schemaVersion !== CRASH_CACHE_CONSTANTS.SCHEMA_VERSION) {
                    console.log('[CrashCache] Schema version mismatch, invalidating cache');
                    crashCacheState.cacheStatus = 'expired';
                    crashCacheDelete(cacheKey).catch(e => console.warn('[CrashCache] Delete error:', e));
                    resolve(null);
                    return;
                }

                // Check expiration
                if (now > record.expiresAt) {
                    console.log('[CrashCache] Cache expired for:', cacheKey);
                    crashCacheState.cacheStatus = 'expired';
                    crashCacheDelete(cacheKey).catch(e => console.warn('[CrashCache] Delete error:', e));
                    resolve(null);
                    return;
                }

                // Validate cached data matches current state + jurisdiction + filter
                // Even though the cache key should already encode these, this is a safety
                // check against key format changes or collisions
                const currentState = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : null;
                const currentJurisdiction = getActiveJurisdictionId();
                const currentFilter = appSettings?.selectedFilterProfile || localStorage.getItem('selectedFilterProfile') || 'countyOnly';
                if (record.stateKey && currentState && record.stateKey !== currentState) {
                    console.warn(`[CrashCache] State mismatch: cached=${record.stateKey}, current=${currentState} — invalidating`);
                    crashCacheState.cacheStatus = 'miss';
                    crashCacheDelete(cacheKey).catch(e => console.warn('[CrashCache] Delete error:', e));
                    resolve(null);
                    return;
                }
                if (record.jurisdiction && currentJurisdiction && record.jurisdiction !== currentJurisdiction) {
                    console.warn(`[CrashCache] Jurisdiction mismatch: cached=${record.jurisdiction}, current=${currentJurisdiction} — invalidating`);
                    crashCacheState.cacheStatus = 'miss';
                    crashCacheDelete(cacheKey).catch(e => console.warn('[CrashCache] Delete error:', e));
                    resolve(null);
                    return;
                }
                if (record.filterProfile && record.filterProfile !== currentFilter) {
                    console.warn(`[CrashCache] Filter mismatch: cached=${record.filterProfile}, current=${currentFilter} — invalidating`);
                    crashCacheState.cacheStatus = 'miss';
                    crashCacheDelete(cacheKey).catch(e => console.warn('[CrashCache] Delete error:', e));
                    resolve(null);
                    return;
                }

                // Valid cache found — state, jurisdiction, filter all verified
                crashCacheState.cachedAt = record.cachedAt;
                crashCacheState.expiresAt = record.expiresAt;
                crashCacheState.cacheStatus = 'hit';
                console.log(`%c[CrashCache] Cache hit: ${cacheKey} (${record.totalRows} rows)`, 'color: #3b82f6; font-weight: bold');
                resolve(record);
            };

            request.onerror = () => {
                console.error('[CrashCache] Load error:', request.error);
                crashCacheState.cacheStatus = 'error';
                reject(request.error);
            };
        });
    } catch (error) {
        console.error('[CrashCache] Load failed:', error);
        crashCacheState.cacheStatus = 'error';
        return null;
    }
}

/**
 * Delete specific cache entry
 */
async function crashCacheDelete(cacheKey = null) {
    try {
        const db = await crashCacheOpen();
        const key = cacheKey || getCrashCacheKey();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(CRASH_CACHE_CONSTANTS.STORE_NAME, 'readwrite');
            const store = tx.objectStore(CRASH_CACHE_CONSTANTS.STORE_NAME);
            const request = store.delete(key);

            request.onsuccess = () => {
                console.log('[CrashCache] Deleted:', key);
                crashCacheState.cacheStatus = 'miss';
                crashCacheState.cachedAt = null;
                crashCacheState.expiresAt = null;
                updateCacheStatusUI();
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[CrashCache] Delete failed:', error);
    }
}

/**
 * Clear all crash cache entries
 */
async function crashCacheClearAll() {
    try {
        const db = await crashCacheOpen();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(CRASH_CACHE_CONSTANTS.STORE_NAME, 'readwrite');
            const store = tx.objectStore(CRASH_CACHE_CONSTANTS.STORE_NAME);
            const request = store.clear();

            request.onsuccess = () => {
                console.log('[CrashCache] All cache cleared');
                crashCacheState.cacheStatus = 'miss';
                crashCacheState.cachedAt = null;
                crashCacheState.expiresAt = null;
                updateCacheStatusUI();
                showToast('Cache cleared successfully', 'success');
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        console.error('[CrashCache] Clear all failed:', error);
        showToast('Failed to clear cache', 'danger');
    }
}

/**
 * Get cache statistics
 */
async function crashCacheGetStats() {
    try {
        const db = await crashCacheOpen();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(CRASH_CACHE_CONSTANTS.STORE_NAME, 'readonly');
            const store = tx.objectStore(CRASH_CACHE_CONSTANTS.STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const records = request.result;
                let totalSize = 0;
                records.forEach(r => {
                    totalSize += JSON.stringify(r).length;
                });
                resolve({
                    count: records.length,
                    totalSize: totalSize,
                    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
                });
            };
            request.onerror = () => reject(request.error);
        });
    } catch (error) {
        return { count: 0, totalSize: 0, totalSizeMB: '0' };
    }
}
  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.data = CL.data || {};
  CL.data.crashCache = CL.data.crashCache || {};
  window.crashCacheOpen = crashCacheOpen; CL.data.crashCache.crashCacheOpen = crashCacheOpen;
  window.getCrashCacheKey = getCrashCacheKey; CL.data.crashCache.getCrashCacheKey = getCrashCacheKey;
  window.crashCacheSave = crashCacheSave; CL.data.crashCache.crashCacheSave = crashCacheSave;
  window.crashCacheLoad = crashCacheLoad; CL.data.crashCache.crashCacheLoad = crashCacheLoad;
  window.crashCacheDelete = crashCacheDelete; CL.data.crashCache.crashCacheDelete = crashCacheDelete;
  window.crashCacheClearAll = crashCacheClearAll; CL.data.crashCache.crashCacheClearAll = crashCacheClearAll;
  window.crashCacheGetStats = crashCacheGetStats; CL.data.crashCache.crashCacheGetStats = crashCacheGetStats;
  CL._registerModule('data/crash-cache');
})();
