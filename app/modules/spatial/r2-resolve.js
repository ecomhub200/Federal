/**
 * CL spatial.r2Resolve module
 *
 * Extracted from app/index.html (snapshot L23144-L23763) on 2026-05-16.
 * Round X modular refactor — see modular-prompts/26-spatial-r2-resolve.md.
 * Responsibility: R2 manifest + data-availability + URL resolution + CSV fallback.
 *
 * Public API (back-compat dual exposure): all 11 top-level fns in the block
 * are window.<fn> + CL.spatial.<fn>. R2_BASE_URL/r2State/APP_PATHS (and
 * appConfig/jurisdictionContext) are app-wide shared, declared in index.html
 * (R2_BASE_URL 8 / APP_PATHS 18 / r2State many external refs) — intentionally
 * NOT moved; referenced here as global-lexical free vars (§1 globals list was
 * pre-drift; §8 governs). R2 parquet-only policy preserved verbatim.
 *
 * Depends on (must load before this file): `spatial/aggregate-loader`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

/**
 * Load the R2 manifest from data/r2-manifest.json.
 * Called once during startup, before autoLoadCrashData().
 * Non-blocking: if the manifest fails to load, the app
 * continues with local paths.
 */
async function loadR2Manifest() {
    const manifestPaths = [
        '../data/r2-manifest.json',
        './data/r2-manifest.json',
        'data/r2-manifest.json',
        '/data/r2-manifest.json'
    ];

    const cacheBuster = '?_t=' + Date.now();
    for (const path of manifestPaths) {
        try {
            const response = await fetch(path + cacheBuster);
            if (!response.ok) continue;

            const manifest = await response.json();

            // Validate manifest has minimum required structure
            if (!manifest.r2BaseUrl || !manifest.localPathMapping ||
                Object.keys(manifest.localPathMapping).length === 0) {
                console.log(`[R2] Manifest at ${path} empty or missing r2BaseUrl — trying next`);
                continue;
            }

            r2State.manifest = manifest;
            r2State.loaded = true;
            console.log(`[R2] Manifest loaded from ${path}: ${Object.keys(manifest.localPathMapping).length} files mapped, base URL: ${manifest.r2BaseUrl}`);

            // Check manifest freshness — warn if data pipeline hasn't run recently
            if (manifest.updated) {
                const manifestAge = Date.now() - new Date(manifest.updated).getTime();
                const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
                if (manifestAge > MAX_AGE_MS) {
                    const daysOld = Math.floor(manifestAge / (24 * 60 * 60 * 1000));
                    console.warn(`[R2] WARNING: Manifest is ${daysOld} days old — data may be stale. Run the data pipeline to refresh.`);
                    r2State.stale = true;
                }
            }

            return; // Success — exit
        } catch (e) {
            continue; // Try next path
        }
    }

    // All paths failed
    console.warn('[R2] Manifest not found at any path — using R2_BASE_URL fallback');
    r2State.loaded = true;
}

/**
 * Check if R2 data is available for a given state and jurisdiction.
 * Jurisdiction-agnostic: always returns available=true so the frontend
 * attempts to connect to the R2 folder regardless of manifest state.
 * The actual fetch determines whether data exists (404 = not yet uploaded).
 *
 * @param {string} stateKey - State key (e.g., "alabama", "colorado")
 * @param {string} jurisdiction - Jurisdiction ID (e.g., "baldwin", "douglas")
 * @returns {{ available: boolean, reason: string, inManifest: boolean, correctedR2Prefix?: string }}
 */
function checkR2DataAvailability(stateKey, jurisdiction) {
    const result = { available: true, reason: '', inManifest: false };

    const r2Prefix = appConfig?.states?.[stateKey]?.r2Prefix || stateKey;

    // If manifest is loaded, check for diagnostic info (cross-state correction)
    // but never block loading based on manifest contents
    if (r2State.manifest?.files) {
        const hasAnyVariant = ['all_roads.parquet.gz', 'county_roads.parquet.gz', 'no_interstate.parquet.gz',
                                'all_roads.csv.gz', 'county_roads.csv.gz', 'no_interstate.csv.gz',
                                'all_roads.csv', 'county_roads.csv', 'no_interstate.csv'].some(variant => {
            const key = `${r2Prefix}/${jurisdiction}/${variant}`;
            const entry = r2State.manifest.files[key];
            return entry && entry.size > 0 && !entry._status;
        });

        if (hasAnyVariant) {
            result.inManifest = true;
            result.reason = 'Data confirmed in R2 manifest';
        } else {
            // Check if jurisdiction exists under a different state (cross-state correction)
            for (const [r2Key, info] of Object.entries(r2State.manifest.files)) {
                if (info.size > 0 && !info._status) {
                    const parts = r2Key.split('/');
                    if (parts.length >= 2 && parts[1] === jurisdiction && parts[0] !== r2Prefix) {
                        console.warn(`[R2] Jurisdiction '${jurisdiction}' not found under '${r2Prefix}' but found under '${parts[0]}' — cross-state match`);
                        result.correctedR2Prefix = parts[0];
                        result.inManifest = true;
                        result.reason = `Data found under ${parts[0]} (cross-state match)`;
                        break;
                    }
                }
            }
            if (!result.inManifest) {
                result.reason = `Not in manifest — will attempt direct R2 fetch at ${r2Prefix}/${jurisdiction}/`;
            }
        }
    } else {
        result.reason = 'No manifest — will attempt direct R2 fetch';
    }

    return result;
}

/**
 * Get a human-readable summary of states/jurisdictions with data in R2.
 * @returns {string} Summary text for UI display
 */
function getR2DataAvailabilitySummary() {
    if (!r2State.manifest?.files) return 'Data availability unknown (manifest not loaded)';

    const stateJurisdictions = {};
    for (const [r2Key, info] of Object.entries(r2State.manifest.files)) {
        if (info.size > 0 && !info._status) {
            const parts = r2Key.split('/');
            if (parts.length >= 2 && !parts[1].startsWith('_')) {
                const stateName = appConfig?.states?.[parts[0]]?.name || parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
                const rawJuris = parts[1];
                const jurisName = appConfig?.jurisdictions?.[rawJuris]?.name || rawJuris.charAt(0).toUpperCase() + rawJuris.slice(1);
                if (!stateJurisdictions[stateName]) stateJurisdictions[stateName] = new Set();
                stateJurisdictions[stateName].add(jurisName);
            }
        }
    }

    const summaryParts = Object.entries(stateJurisdictions).map(([state, jurisdictions]) => {
        return `${state} (${Array.from(jurisdictions).join(', ')})`;
    });
    return summaryParts.length > 0
        ? `Data available for: ${summaryParts.join('; ')}`
        : 'No crash data currently available in cloud storage';
}

/**
 * Resolve a local data file path to an R2 URL if available.
 * Returns the original path unchanged if the manifest hasn't
 * loaded, is empty, or the file isn't tracked.
 *
 * Resolution strategy:
 * 1. Exact match in manifest localPathMapping
 * 2. Dynamic construction using state r2Prefix + jurisdiction + filename
 *    (allows jurisdictions not explicitly listed in the manifest to resolve)
 * 3. Fallback to original local path
 *
 * @param {string} localPath - Relative path like "../data/CDOT/douglas_all_roads.csv"
 * @returns {string} R2 URL or original local path
 */
function resolveDataUrl(localPath) {
    console.log('[R2-DEBUG] resolveDataUrl called with:', localPath);
    console.log('[R2-DEBUG] r2State:', { loaded: r2State.loaded, hasManifest: !!r2State.manifest, r2BaseUrl: r2State.manifest?.r2BaseUrl });
    console.log('[R2-DEBUG] localPathMapping keys:', Object.keys(r2State.manifest?.localPathMapping || {}).length);

    // Use manifest base URL if available, otherwise hardcoded fallback
    const baseUrl = r2State.manifest?.r2BaseUrl || R2_BASE_URL;

    // Normalize the local path for manifest lookup.
    // The manifest uses paths like "data/CDOT/douglas_all_roads.csv"
    // but the app uses "../data/CDOT/douglas_all_roads.csv"
    let normalizedPath = localPath;
    if (normalizedPath.startsWith('../')) {
        normalizedPath = normalizedPath.substring(3);
    }
    if (normalizedPath.startsWith('./')) {
        normalizedPath = normalizedPath.substring(2);
    }

    // Strategy 1: Exact match in manifest (requires manifest to be loaded)
    if (r2State.manifest?.localPathMapping) {
        const r2Key = r2State.manifest.localPathMapping[normalizedPath];
        if (r2Key) {
            const r2Url = `${baseUrl}/${r2Key}`;
            console.log(`[R2] Resolved (manifest): ${localPath} -> ${r2Url}`);
            return r2Url;
        }
    }

    // Strategy 2: Dynamic R2 URL construction from state config (LEGACY local paths only)
    // Parses the local path pattern: data/{stateDataDir?}/{jurisdiction}_{filter}.{ext}
    // and constructs: {r2BaseUrl}/{r2Prefix}/{jurisdiction}/{filter}.{ext}
    // Only applies to paths starting with 'data/' — R2-native paths skip to Strategy 3.
    if (normalizedPath.startsWith('data/') && typeof appConfig !== 'undefined' && appConfig?.states) {
        const activeStateKey = (typeof _getActiveStateKey === 'function') ? _getActiveStateKey() : null;
        const stateConfig = activeStateKey ? appConfig.states[activeStateKey] : null;
        if (stateConfig?.r2Prefix) {
            // Extract filename from the normalized path (e.g., "henrico_county_roads.csv" from "data/henrico_county_roads.csv")
            const filename = normalizedPath.split('/').pop();
            if (filename) {
                // Parse jurisdiction and filter from filename by matching known suffixes.
                // Jurisdiction names can contain underscores (e.g., fairfax_county, richmond_city)
                // so we must match from the END, not split at the first underscore.
                // Known suffixes: _county_roads.csv.gz, _city_roads.csv.gz, _no_interstate.csv.gz, _all_roads.csv.gz (and legacy .csv)
                const knownSuffixes = ['_county_roads.parquet.gz', '_city_roads.parquet.gz', '_no_interstate.parquet.gz', '_all_roads.parquet.gz',
                                       '_county_roads.csv.gz', '_city_roads.csv.gz', '_no_interstate.csv.gz', '_all_roads.csv.gz',
                                       '_county_roads.csv', '_city_roads.csv', '_no_interstate.csv', '_all_roads.csv'];
                let jurisdiction = null;
                let filterWithExt = null;
                for (const suffix of knownSuffixes) {
                    if (filename.endsWith(suffix)) {
                        jurisdiction = filename.substring(0, filename.length - suffix.length);
                        filterWithExt = suffix.substring(1); // Remove leading underscore
                        break;
                    }
                }
                // Fallback: split at first underscore for unknown patterns
                if (!jurisdiction) {
                    const underscoreIdx = filename.indexOf('_');
                    if (underscoreIdx > 0) {
                        jurisdiction = filename.substring(0, underscoreIdx);
                        filterWithExt = filename.substring(underscoreIdx + 1);
                    }
                }
                if (jurisdiction && filterWithExt) {
                    const dynamicR2Key = `${stateConfig.r2Prefix}/${jurisdiction}/${filterWithExt}`;
                    // Construct R2 URL directly — no manifest verification needed.
                    // The actual fetch determines if data exists (jurisdiction-agnostic).
                    const r2Url = `${baseUrl}/${dynamicR2Key}`;
                    const inManifest = !!r2State.manifest?.files?.[dynamicR2Key];
                    console.log(`[R2] Resolved (dynamic${inManifest ? '' : ', unverified'}): ${localPath} -> ${r2Url}`);
                    return r2Url;
                }
            }
        }
    }

    // Strategy 3: R2-native paths — direct R2 keys, not local paths.
    // Works even when manifest hasn't loaded (uses hardcoded R2_BASE_URL).
    // Covers two patterns:
    //   a) Tier-level: "{stateKey}/_state/..." or "_national/..." (contain tier prefixes)
    //   b) County-level: "{stateKey}/{jurisdiction}/{roadType}.parquet" (e.g., "delaware/sussex/all_roads.parquet")
    // Detection: paths NOT starting with 'data/' that contain '/' and end with a known data extension
    // are R2-native keys generated by getDataFilePath().
    const tierPrefixes = ['_state/', '_statewide/', '_region/', '_planning_district/', '_mpo/', '_city/', '_federal/', '_national/'];
    const isR2NativePath = !normalizedPath.startsWith('data/') &&
        normalizedPath.includes('/') &&
        (normalizedPath.endsWith('.parquet') || normalizedPath.endsWith('.parquet.gz') ||
         normalizedPath.endsWith('.csv') || normalizedPath.endsWith('.csv.gz') ||
         normalizedPath.endsWith('.json'));
    if (isR2NativePath || tierPrefixes.some(p => normalizedPath.includes(p))) {
        const r2Url = `${baseUrl}/${normalizedPath}`;
        console.log(`[R2] Resolved (R2-native path): ${localPath} -> ${r2Url}`);
        return r2Url;
    }

    console.log(`[R2] No mapping found for: ${normalizedPath}, using local path`);
    return localPath; // Not tracked in R2, use local path
}

/**
 * R2 Connection Diagnostic — call from browser DevTools: diagR2Connection()
 * Verifies the entire R2 pipeline end-to-end.
 */
async function diagR2Connection() {
    console.group('[R2 Diagnostics]');
    console.log('1. r2State.loaded:', r2State.loaded);
    console.log('2. r2State.error:', r2State.error);
    console.log('3. Manifest present:', !!r2State.manifest);
    console.log('4. r2BaseUrl:', r2State.manifest?.r2BaseUrl);
    console.log('5. Files in manifest:', Object.keys(r2State.manifest?.files || {}).length);
    console.log('6. LocalPathMapping entries:', Object.keys(r2State.manifest?.localPathMapping || {}).length);

    // Test actual R2 fetch
    const testPath = 'colorado/douglas/county_roads.csv';
    const testUrl = resolveDataUrl(testPath);
    console.log('7. resolveDataUrl test:', testPath, '→', testUrl);
    try {
        const resp = await fetch(testUrl, { method: 'HEAD' });
        console.log('8. HEAD response:', resp.status, resp.statusText);
        console.log('9. Content-Type:', resp.headers.get('content-type'));
        console.log('10. CORS OK: true');
    } catch (e) {
        console.error('8. Fetch FAILED:', e.message);
        if (e.message.includes('CORS') || e.message.includes('blocked')) {
            console.error('10. CORS BLOCKED — check R2 bucket CORS config');
        }
    }
    console.groupEnd();
}
window.diagR2Connection = diagR2Connection;

/**
 * Build an ordered list of local fallback paths to try when R2 is inaccessible.
 * Converts R2-native paths (e.g., "colorado/douglas/county_roads.csv") back to
 * legacy local paths (e.g., "../data/CDOT/douglas_county_roads.csv", "../data/all_roads.csv").
 *
 * @param {string} r2NativePath - R2-native path like "colorado/douglas/county_roads.csv"
 * @returns {string[]} Array of local paths to try in order
 */
function buildLocalFallbackPaths(r2NativePath) {
    const fallbacks = [];
    if (!r2NativePath) return fallbacks;

    const parts = r2NativePath.replace(/^\//, '').split('/');
    // Expected format: {statePrefix}/{jurisdiction}/{roadType}.csv
    if (parts.length < 3) {
        // Simple fallback: try the path directly under data/
        fallbacks.push(`../data/${r2NativePath}`);
        return fallbacks;
    }

    const statePrefix = parts[0]; // e.g., "colorado", "virginia"
    const jurisdiction = parts[1]; // e.g., "douglas", "henrico"
    // Normalize to .csv for local fallback paths
    // R2 uses .parquet (current policy), .parquet.gz or .csv.gz (legacy); local files are always .csv
    let filename = parts.slice(2).join('/');
    if (filename.endsWith('.parquet.gz')) {
        filename = filename.slice(0, -11) + '.csv'; // county_roads.parquet.gz → county_roads.csv
    } else if (filename.endsWith('.parquet')) {
        filename = filename.slice(0, -8) + '.csv';  // county_roads.parquet → county_roads.csv
    } else if (filename.endsWith('.gz')) {
        filename = filename.slice(0, -3); // county_roads.csv.gz → county_roads.csv
    }

    // Look up the state's dataDir from config (e.g., colorado→"CDOT", virginia→null)
    const stateKey = statePrefix;
    const stateDataDir = appConfig?.states?.[stateKey]?.dataDir;

    // Strategy A: Legacy local path with state dataDir
    // e.g., ../data/CDOT/douglas_county_roads.csv
    if (stateDataDir) {
        fallbacks.push(`../data/${stateDataDir}/${jurisdiction}_${filename}`);
    }

    // Strategy B: Legacy local path without dataDir
    // e.g., ../data/henrico_county_roads.csv  or  ../data/douglas_county_roads.csv
    fallbacks.push(`../data/${jurisdiction}_${filename}`);

    // Strategy C: Try all_roads variant if not already requesting it
    if (!filename.includes('all_roads')) {
        if (stateDataDir) {
            fallbacks.push(`../data/${stateDataDir}/${jurisdiction}_all_roads.csv`);
        }
        fallbacks.push(`../data/${jurisdiction}_all_roads.csv`);
    }

    // NOTE: Generic ../data/all_roads.csv fallback was REMOVED to prevent loading
    // data from a different state. The generic file contains Colorado data, which
    // would silently load when a different state (e.g., Alabama) is selected.
    // Only state-specific, jurisdiction-prefixed paths are safe fallbacks.

    return fallbacks;
}

/**
 * Fetch a crash data URL with multi-format fallback: .parquet.gz → .csv.gz → .csv
 * Delaware and newer pipelines use .parquet.gz; Colorado uses .csv.gz; Virginia uses .csv.
 * Tries parquet first (best compression), then csv.gz, then plain csv.
 * Tags the successful response with _dataFormat so callers know how to parse it.
 *
 * @param {string} url - The URL to fetch (typically ending in .csv.gz)
 * @param {RequestInit} [opts] - Fetch options
 * @returns {Promise<Response>} Response with _dataFormat property ('parquet.gz'|'csv.gz'|'csv')
 */
async function fetchCsvWithFallback(url, opts) {
    // Build ordered list of URLs to try: parquet → parquet.gz → csv.gz → csv
    const candidates = [];
    if (url.endsWith('.parquet')) {
        // State-tier uncompressed parquet is the primary format on R2
        candidates.push({ url: url,                            format: 'parquet' });
        candidates.push({ url: url + '.gz',                    format: 'parquet.gz' });
        candidates.push({ url: url.slice(0, -8) + '.csv.gz',   format: 'csv.gz' });
        candidates.push({ url: url.slice(0, -8) + '.csv',      format: 'csv' });
    } else if (url.endsWith('.csv.gz')) {
        candidates.push({ url: url.slice(0, -7) + '.parquet',    format: 'parquet' });
        candidates.push({ url: url.slice(0, -7) + '.parquet.gz', format: 'parquet.gz' });
        candidates.push({ url: url,                              format: 'csv.gz' });
        candidates.push({ url: url.slice(0, -3),                 format: 'csv' }); // strip .gz
    } else if (url.endsWith('.parquet.gz')) {
        candidates.push({ url: url,                              format: 'parquet.gz' });
        candidates.push({ url: url.slice(0, -3),                 format: 'parquet' });
        candidates.push({ url: url.slice(0, -11) + '.csv.gz',    format: 'csv.gz' });
        candidates.push({ url: url.slice(0, -11) + '.csv',       format: 'csv' });
    } else if (url.endsWith('.csv')) {
        candidates.push({ url: url.slice(0, -4) + '.parquet',    format: 'parquet' });
        candidates.push({ url: url.slice(0, -4) + '.parquet.gz', format: 'parquet.gz' });
        candidates.push({ url: url + '.gz',                      format: 'csv.gz' });
        candidates.push({ url: url,                              format: 'csv' });
    } else {
        // Unknown extension — try as-is
        candidates.push({ url: url, format: 'csv' });
    }

    let lastResp = null;
    for (const candidate of candidates) {
        try {
            const resp = await fetch(candidate.url, opts);
            if (resp.ok) {
                resp._dataFormat = candidate.format;
                console.log(`[R2] Fetched successfully (${candidate.format}): ${candidate.url}`);
                return resp;
            }
            console.log(`[R2] ${candidate.format} not found (HTTP ${resp.status}): ${candidate.url}`);
            lastResp = resp;
        } catch (netErr) {
            console.log(`[R2] Network error on ${candidate.format}: ${candidate.url}`);
            lastResp = lastResp || new Response('', { status: 0, statusText: 'Network Error' });
        }
    }
    return lastResp; // Return last failed response
}

// ============================================================
// STREAMING DOWNLOAD HELPERS
// Read a Response body in chunks so we can drive a real progress
// bar instead of waiting for the whole transfer to complete before
// the UI shows anything.
//
// Notes:
//  - Content-Length may be missing (e.g. when R2 sends Transfer-
//    Encoding: chunked or when the browser is decoding gzip on the
//    fly). In that case we can't compute a true %, so the caller
//    should switch the bar to indeterminate via setLoadProgress(...).
//  - For binary data (parquet) use streamResponseToArrayBuffer; for
//    text (CSV) use streamResponseToText.
//  - Each call invokes onProgress(received, total) where total is
//    null when unknown.
// ============================================================
async function _streamResponseChunks(response, onProgress) {
    const total = Number(response.headers.get('content-length')) || null;
    const body = response.body;
    if (!body || typeof body.getReader !== 'function') {
        // No streaming support — fall back to one-shot; no intermediate progress.
        const buf = await response.arrayBuffer();
        if (typeof onProgress === 'function') onProgress(buf.byteLength, buf.byteLength);
        return { chunks: [new Uint8Array(buf)], received: buf.byteLength, total: buf.byteLength };
    }
    const reader = body.getReader();
    const chunks = [];
    let received = 0;
    if (typeof onProgress === 'function') onProgress(0, total);
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.byteLength;
        if (typeof onProgress === 'function') onProgress(received, total);
    }
    return { chunks, received, total };
}

async function streamResponseToArrayBuffer(response, onProgress) {
    const { chunks, received } = await _streamResponseChunks(response, onProgress);
    if (chunks.length === 1) return chunks[0].buffer.slice(chunks[0].byteOffset, chunks[0].byteOffset + chunks[0].byteLength);
    const out = new Uint8Array(received);
    let offset = 0;
    for (const c of chunks) { out.set(c, offset); offset += c.byteLength; }
    return out.buffer;
}

async function streamResponseToText(response, onProgress) {
    const { chunks } = await _streamResponseChunks(response, onProgress);
    // Concatenate chunks then decode once (TextDecoder handles split UTF-8 sequences correctly
    // when given the full buffer, avoiding the corruption you'd get from per-chunk decoding).
    let totalLen = 0;
    for (const c of chunks) totalLen += c.byteLength;
    const merged = new Uint8Array(totalLen);
    let offset = 0;
    for (const c of chunks) { merged.set(c, offset); offset += c.byteLength; }
    return new TextDecoder('utf-8').decode(merged);
}

// ============================================================
// STARTUP VALIDATION - Verify critical paths are accessible
// ============================================================
async function validateAppPaths() {
    const results = { config: false, settings: false, errors: [] };

    // Check config.json
    try {
        const configResponse = await fetch(APP_PATHS.CONFIG, { method: 'HEAD' });
        results.config = configResponse.ok;
        if (!configResponse.ok) {
            results.errors.push(`Config not accessible: ${APP_PATHS.CONFIG} (HTTP ${configResponse.status})`);
        }
    } catch (e) {
        results.errors.push(`Config fetch failed: ${APP_PATHS.CONFIG} - ${e.message}`);
    }

    // Check settings.json
    try {
        const settingsResponse = await fetch(APP_PATHS.SETTINGS, { method: 'HEAD' });
        results.settings = settingsResponse.ok;
        if (!settingsResponse.ok) {
            results.errors.push(`Settings not accessible: ${APP_PATHS.SETTINGS} (HTTP ${settingsResponse.status})`);
        }
    } catch (e) {
        results.errors.push(`Settings fetch failed: ${APP_PATHS.SETTINGS} - ${e.message}`);
    }

    // Log results
    if (results.errors.length > 0) {
        console.warn('[Startup Validation] Issues detected:', results.errors);
    } else {
        console.log('[Startup Validation] All paths accessible');
    }

    return results;
}

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window._streamResponseChunks = _streamResponseChunks; CL.spatial._streamResponseChunks = _streamResponseChunks;
  window.buildLocalFallbackPaths = buildLocalFallbackPaths; CL.spatial.buildLocalFallbackPaths = buildLocalFallbackPaths;
  window.checkR2DataAvailability = checkR2DataAvailability; CL.spatial.checkR2DataAvailability = checkR2DataAvailability;
  window.diagR2Connection = diagR2Connection; CL.spatial.diagR2Connection = diagR2Connection;
  window.fetchCsvWithFallback = fetchCsvWithFallback; CL.spatial.fetchCsvWithFallback = fetchCsvWithFallback;
  window.getR2DataAvailabilitySummary = getR2DataAvailabilitySummary; CL.spatial.getR2DataAvailabilitySummary = getR2DataAvailabilitySummary;
  window.loadR2Manifest = loadR2Manifest; CL.spatial.loadR2Manifest = loadR2Manifest;
  window.resolveDataUrl = resolveDataUrl; CL.spatial.resolveDataUrl = resolveDataUrl;
  window.streamResponseToArrayBuffer = streamResponseToArrayBuffer; CL.spatial.streamResponseToArrayBuffer = streamResponseToArrayBuffer;
  window.streamResponseToText = streamResponseToText; CL.spatial.streamResponseToText = streamResponseToText;
  window.validateAppPaths = validateAppPaths; CL.spatial.validateAppPaths = validateAppPaths;
  CL._registerModule('spatial/r2-resolve');
})();
