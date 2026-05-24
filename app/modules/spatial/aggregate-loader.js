/**
 * CL spatial.aggregateLoader module
 *
 * Extracted from app/index.html (snapshot L22955-L23146) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/05-spatial-aggregate-loader.md.
 * Responsibility: R2/Supabase aggregate fetch + URL resolution.
 *
 * Public API (back-compat dual exposure) — public singleton ONLY; the
 * _resolveR2Url/_isSupabaseOnlyAggregatePath/_fetch helpers are private to
 * the arrow-IIFE (not in outer scope) and have 0 bare-global callers — do
 * NOT expose them (would ReferenceError on load):
 *   - window.AggregateLoader → CL.spatial.AggregateLoader
 *
 * Depends on (must load before this file): `spatial/spatial-clip`
 */
'use strict';
// ─── EXTRACTED CODE START (verbatim from index.html) ───

const AggregateLoader = (() => {
    'use strict';

    const _cache = {};

    function _resolveR2Url(path) {
        // Use R2 base URL from manifest (primary), appConfig (secondary), R2_BASE_URL (tertiary), or fallback to local data dir
        const r2Base = (typeof r2State !== 'undefined' && r2State.manifest?.r2BaseUrl)
            ? r2State.manifest.r2BaseUrl
            : (typeof window.appConfig !== 'undefined' && window.appConfig?.r2?.publicUrl)
                ? window.appConfig.r2.publicUrl
                : (typeof R2_BASE_URL !== 'undefined')
                    ? R2_BASE_URL
                    : '../data';
        console.log('[AggregateLoader] _resolveR2Url base:', r2Base, 'path:', path, 'url:', `${r2Base}/${path}`);
        return `${r2Base}/${path}`;
    }

    // Round-4 Patch 4 — these path patterns have no R2 publication post-
    // migration; Supabase dashboard_summary / federal_summary is the canonical
    // source. Short-circuit BEFORE the fetch fires so the live console isn't
    // littered with 404s on every tier change. The negative-cache path below
    // already silenced repeat 404s, but the FIRST 404 per scope still hit
    // the network.
    function _isSupabaseOnlyAggregatePath(path) {
        if (!path) return false;
        if (path === '_national/state_comparison.json') return true;
        if (path.endsWith('/_statewide/aggregates.json')) return true;
        if (path.includes('/_region/') && path.endsWith('/aggregates.json')) return true;
        if (path.includes('/_mpo/') && path.endsWith('/aggregates.json')) return true;
        if (path.includes('/_planning_district/') && path.endsWith('/aggregates.json')) return true;
        if (path.includes('/_city/') && path.endsWith('/aggregates.json')) return true;
        if (path.includes('/_state/forecasts_') && path.endsWith('.json')) return true;
        return false;
    }

    async function _fetch(path) {
        if (_cache[path] !== undefined) return _cache[path];
        // Round-4 Patch 4 — skip known-unpublished paths without firing a
        // network request. Cache null so subsequent callers also short-circuit.
        if (_isSupabaseOnlyAggregatePath(path)) {
            _cache[path] = null;
            return null;
        }
        try {
            const url = _resolveR2Url(path);
            const resp = await fetch(url);
            if (!resp.ok) {
                // Per-scope aggregates.json files for region/mpo/planning_district/city
                // are not published — Supabase dashboard_summary is the canonical
                // source post-migration. 404s here are expected, not errors.
                // Cache the negative so we don't re-request the same missing file
                // on every tier toggle. Other HTTP errors still log loudly.
                if (resp.status === 404) {
                    _cache[path] = null;
                    return null;
                }
                throw new Error(`HTTP ${resp.status}`);
            }
            const data = await resp.json();
            _cache[path] = data;
            return data;
        } catch (e) {
            console.error(`[AggregateLoader] Failed to load ${path}:`, e);
            return null;
        }
    }

    return {
        async loadNational() {
            return _fetch('_national/state_comparison.json');
        },

        async loadStatewide(stateKey) {
            return _fetch(`${stateKey}/_statewide/aggregates.json`);
        },

        async loadCountySummary(stateKey) {
            return _fetch(`${stateKey}/_statewide/county_summary.json`);
        },

        async loadMPOSummary(stateKey) {
            return _fetch(`${stateKey}/_statewide/mpo_summary.json`);
        },

        async loadRegion(stateKey, regionId) {
            return _fetch(`${stateKey}/_region/${regionId}/aggregates.json`);
        },

        async loadRegionHotspots(stateKey, regionId) {
            return _fetch(`${stateKey}/_region/${regionId}/hotspots.json`);
        },

        async loadMPO(stateKey, mpoId) {
            return _fetch(`${stateKey}/_mpo/${mpoId}/aggregates.json`);
        },

        async loadMPOHotspots(stateKey, mpoId) {
            return _fetch(`${stateKey}/_mpo/${mpoId}/hotspots.json`);
        },

        async loadPlanningDistrict(stateKey, pdId) {
            return _fetch(`${stateKey}/_planning_district/${pdId}/aggregates.json`);
        },

        async loadPlanningDistrictHotspots(stateKey, pdId) {
            return _fetch(`${stateKey}/_planning_district/${pdId}/hotspots.json`);
        },

        async loadCity(stateKey, citySlug) {
            return _fetch(`${stateKey}/_city/${citySlug}/aggregates.json`);
        },

        async loadCityHotspots(stateKey, citySlug) {
            return _fetch(`${stateKey}/_city/${citySlug}/hotspots.json`);
        },

        /**
         * Fetch the statewide crash CSV from R2 (gzipped, browser auto-decompresses).
         * Returns raw CSV text string, or null on failure.
         * R2 path: {stateKey}/_state/{roadType}.csv (or .csv.gz for legacy)
         * The server sends Content-Encoding: gzip so fetch() returns decompressed text.
         *
         * @param {string} stateKey - State key (e.g., 'colorado')
         * @param {string} [roadType] - Road type suffix (e.g., 'dot_roads', 'non_dot_roads', 'statewide_all_roads')
         */
        async loadStatewideCSV(stateKey, roadType) {
            const suffix = roadType || 'statewide_all_roads';
            const r2Path = `${stateKey}/_state/${suffix}.csv.gz`;
            const cacheKey = `csv:${r2Path}`;
            if (_cache[cacheKey]) return _cache[cacheKey];
            try {
                const url = _resolveR2Url(r2Path);
                console.log(`[AggregateLoader] Fetching statewide CSV: ${url}`);
                let resp = await fetch(url);
                // Fallback to legacy .csv path (without .gz) if .csv.gz not found
                if (!resp.ok) {
                    const legacyUrl = _resolveR2Url(`${stateKey}/_state/${suffix}.csv`);
                    console.log(`[AggregateLoader] Trying legacy non-gz path: ${legacyUrl}`);
                    resp = await fetch(legacyUrl);
                }
                if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                const csvText = await resp.text();
                _cache[cacheKey] = csvText;
                console.log(`[AggregateLoader] Statewide CSV loaded: ${(csvText.length / 1024 / 1024).toFixed(1)} MB text`);
                return csvText;
            } catch (e) {
                console.error(`[AggregateLoader] Failed to load statewide CSV (${r2Path}):`, e);
                return null;
            }
        },

        /**
         * Get the R2 URL for a statewide CSV (for use with resolveDataUrl fallback).
         * @param {string} stateKey - State key
         * @param {string} [roadType] - Road type suffix
         */
        getStatewideCSVUrl(stateKey, roadType) {
            const suffix = roadType || 'statewide_all_roads';
            return _resolveR2Url(`${stateKey}/_state/${suffix}.csv.gz`);
        },

        async loadForTier(tier, stateKey, scopeId) {
            switch (tier) {
                case 'federal': return this.loadNational();
                case 'state': return this.loadStatewide(stateKey);
                case 'region': return this.loadRegion(stateKey, scopeId);
                case 'mpo': return this.loadMPO(stateKey, scopeId);
                case 'planning_district': return this.loadPlanningDistrict(stateKey, scopeId);
                case 'city': return this.loadCity(stateKey, scopeId);
                default: return null; // County tier uses CSV, not aggregates
            }
        },

        clearCache() {
            Object.keys(_cache).forEach(k => delete _cache[k]);
        }
    };
})();

// ─── EXTRACTED CODE END ───

// --- Transitional CL.* namespace (stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.spatial = CL.spatial || {};
CL.spatial.AggregateLoader = AggregateLoader;

export { AggregateLoader };

CL._registerModule('spatial/aggregate-loader');
