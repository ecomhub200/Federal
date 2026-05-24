/**
 * CrashLens Lazy SampleRows Loader
 * Provides ensureSampleRows() for on-demand loading of raw crash row data.
 * Used by tabs that need individual row access (CMF, Warrants, Search, etc.)
 * while keeping initial load fast (aggregates + mapPoints only).
 *
 * Caches the CSV text from initial fetch to avoid re-downloading (critical for 1M+ row files).
 */
'use strict';

var _loadPromise = null;
var _cachedCsvText = null; // Cached from initial fetch — avoids second network request
var _cachedRowObjects = null; // Cached from parquet parse — { fields: string[], rows: object[] }

/**
 * Cache CSV text from the initial fetch so lazy sampleRows load doesn't re-download.
 * Call this from autoLoadCrashData right after fetching the CSV.
 * @param {string} csvText - The raw CSV text
 */
export function cacheCsvText(csvText) {
    _cachedCsvText = csvText;
    _cachedRowObjects = null; // Clear parquet cache if CSV is cached
}

/**
 * Cache parsed row objects from parquet for lazy sampleRows load.
 * Call this from autoLoadCrashData after parsing parquet data.
 * @param {string[]} fields - Column names
 * @param {object[]} rows - Array of row objects
 */
export function cacheRowObjects(fields, rows) {
    _cachedRowObjects = { fields: fields, rows: rows };
    _cachedCsvText = null; // Clear CSV cache if row objects are cached
}

/**
 * Release cached CSV text to free memory (call after sampleRows are loaded).
 */
export function releaseCsvCache() {
    _cachedCsvText = null;
}

/**
 * Check if CSV text is cached (useful for debugging).
 * @returns {boolean}
 */
export function hasCachedCsv() {
    return _cachedCsvText !== null || _cachedRowObjects !== null;
}

/**
 * Get approximate cached CSV size in MB (for memory monitoring).
 * @returns {number}
 */
export function getCachedCsvSizeMB() {
    if (_cachedCsvText) return Math.round(_cachedCsvText.length / (1024 * 1024) * 10) / 10;
    if (_cachedRowObjects) return Math.round(JSON.stringify(_cachedRowObjects.rows.slice(0, 100)).length * _cachedRowObjects.rows.length / 100 / (1024 * 1024) * 10) / 10;
    return 0;
}

/**
 * Ensure crashState.sampleRows is populated.
 * Returns immediately if already loaded. Otherwise triggers background load
 * and returns a Promise that resolves when sampleRows are ready.
 */
export function ensureSampleRows() {
    // Already loaded — fast path
    if (typeof window.crashState !== 'undefined' && window.crashState.sampleRowsLoaded &&
        window.crashState.sampleRows && window.crashState.sampleRows.length > 0) {
        return Promise.resolve();
    }

    // Load already in progress — return existing promise
    if (_loadPromise) return _loadPromise;

    // Trigger background load
    _loadPromise = _loadSampleRows().then(function() {
        _loadPromise = null;
    }).catch(function(err) {
        _loadPromise = null;
        console.error('[SampleRowsLoader] Load failed:', err);
        throw err;
    });

    return _loadPromise;
}

/**
 * Wait for sampleRows to be available with a timeout.
 * @param {number} timeoutMs - Maximum wait time (default 60s)
 * @returns {Promise<void>}
 */
export function waitForSampleRows(timeoutMs) {
    timeoutMs = timeoutMs || 60000;

    if (typeof window.crashState !== 'undefined' && window.crashState.sampleRowsLoaded &&
        window.crashState.sampleRows && window.crashState.sampleRows.length > 0) {
        return Promise.resolve();
    }

    return new Promise(function(resolve, reject) {
        var start = Date.now();
        var check = setInterval(function() {
            if (window.crashState.sampleRowsLoaded && window.crashState.sampleRows && window.crashState.sampleRows.length > 0) {
                clearInterval(check);
                resolve();
            } else if (Date.now() - start > timeoutMs) {
                clearInterval(check);
                reject(new Error('sampleRows load timeout after ' + timeoutMs + 'ms'));
            }
        }, 100);
    });
}

/**
 * Reset the loader state (call when data is cleared/reloaded).
 */
export function resetSampleRowsLoader() {
    _loadPromise = null;
    _cachedCsvText = null;
    _cachedRowObjects = null;
}

/**
 * Internal: Load sampleRows from cached CSV text or by re-fetching.
 * Prefers cached CSV (no network request) over background loader.
 */
function _loadSampleRows() {
    console.log('[SampleRowsLoader] Starting lazy sampleRows load...');

    // Preferred path A: use cached row objects from parquet (avoids re-download & re-parse)
    if (_cachedRowObjects && typeof processSampleRowsFromObjects === 'function') {
        console.log('[SampleRowsLoader] Using cached parquet row objects (' +
            _cachedRowObjects.rows.length + ' rows) — no network request');
        var rowData = _cachedRowObjects;
        return Promise.resolve().then(function() {
            return processSampleRowsFromObjects(rowData.fields, rowData.rows);
        }).then(function() {
            _cachedRowObjects = null;
            console.log('[SampleRowsLoader] sampleRows loaded from parquet cache, cache released');
        });
    }

    // Preferred path B: use cached CSV text (avoids re-download)
    if (_cachedCsvText && typeof processSampleRowsFromText === 'function') {
        console.log('[SampleRowsLoader] Using cached CSV text (' +
            getCachedCsvSizeMB() + 'MB) — no network request');
        var text = _cachedCsvText;
        // Release cache after starting parse to free memory during processing
        return Promise.resolve().then(function() {
            return processSampleRowsFromText(text);
        }).then(function() {
            _cachedCsvText = null;
            console.log('[SampleRowsLoader] sampleRows loaded from cache, CSV cache released');
        });
    }

    // Fallback: use existing background loader if available (it handles R2 fallback, generation checks, etc.)
    if (typeof loadSampleRowsInBackground === 'function') {
        console.log('[SampleRowsLoader] No cached data — falling back to network fetch');
        var gen = (typeof window._autoLoadGeneration !== 'undefined') ? window._autoLoadGeneration : 0;
        return loadSampleRowsInBackground(gen);
    }

    // Last resort: direct fetch (with multi-format fallback)
    if (typeof getDataFilePath !== 'function' || typeof resolveDataUrl !== 'function') {
        return Promise.reject(new Error('Data path functions not available'));
    }

    console.log('[SampleRowsLoader] No cached data — falling back to direct network fetch');
    var dataFilePath = getDataFilePath();
    var fetchUrl = resolveDataUrl(dataFilePath);
    return (typeof fetchCsvWithFallback === 'function' ? fetchCsvWithFallback(fetchUrl) : fetch(fetchUrl))
        .then(function(response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            var fmt = response._dataFormat || 'csv';
            if (fmt === 'parquet.gz' && typeof _parseParquetGz === 'function' && typeof processSampleRowsFromObjects === 'function') {
                return response.arrayBuffer().then(function(buf) {
                    return _parseParquetGz(buf);
                }).then(function(result) {
                    return processSampleRowsFromObjects(result.fields, result.rows);
                });
            }
            return response.text().then(function(csvText) {
                if (typeof processSampleRowsFromText === 'function') {
                    return processSampleRowsFromText(csvText);
                }
                throw new Error('processSampleRowsFromText not available');
            });
        });
}

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.worker = CL.worker || {};
CL.worker.cacheCsvText = cacheCsvText;
CL.worker.cacheRowObjects = cacheRowObjects;
CL.worker.releaseCsvCache = releaseCsvCache;
CL.worker.hasCachedCsv = hasCachedCsv;
CL.worker.getCachedCsvSizeMB = getCachedCsvSizeMB;
CL.worker.ensureSampleRows = ensureSampleRows;
CL.worker.waitForSampleRows = waitForSampleRows;
CL.worker.resetSampleRowsLoader = resetSampleRowsLoader;

CL._registerModule('worker/sample-rows-loader');
