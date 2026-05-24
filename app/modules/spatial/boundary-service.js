/**
 * CL spatial.boundaryService module
 *
 * Extracted from app/index.html (snapshot L22225-L22684) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/02-spatial-boundary-service.md.
 * Responsibility: TIGERweb / BTS MPO boundary queries + ArcGIS→GeoJSON.
 *
 * Public API (back-compat dual exposure) — public singleton ONLY; the
 * _queryTigerWeb/_arcgisJsonToGeoJSON/_queryBtsMpo/_spatialQueryBtsMpo
 * helpers are private to the arrow-IIFE (not in outer scope) and have 0
 * bare-global callers — do NOT expose them (would ReferenceError on load):
 *   - window.BoundaryService → CL.spatial.BoundaryService
 *
 * Depends on (must load before this file): `spatial/hierarchy-registry`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

const BoundaryService = (() => {
    'use strict';

    const TIGERWEB_BASE = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer';
    const BTS_MPO_BASE = 'https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_Metropolitan_Planning_Organizations/FeatureServer/0';

    const LAYERS = {
        states: 80, counties: 82, countySubdivisions: 22,
        incorporatedPlaces: 28, censusDesignatedPlaces: 30,
        censusTracts: 8, censusBlockGroups: 10, urbanAreas: 88,
        schoolDistrictsUnified: 14, schoolDistrictsSecondary: 16,
        schoolDistrictsElementary: 18, congressionalDistricts: 54,
        zipCodeTabAreas: 2
    };

    const _cache = {};
    const DB_NAME = 'CrashLensBoundaries';
    const DB_VERSION = 1;
    let _db = null;

    async function _openDB() {
        if (_db) return _db;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open(DB_NAME, DB_VERSION);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('boundaries')) {
                    db.createObjectStore('boundaries', { keyPath: 'key' });
                }
            };
            req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
            req.onerror = (e) => { console.warn('[BoundaryDB] Open failed:', e); resolve(null); };
        });
    }

    async function _getFromDB(key) {
        try {
            const db = await _openDB();
            if (!db) return null;
            return new Promise((resolve) => {
                const tx = db.transaction('boundaries', 'readonly');
                const store = tx.objectStore('boundaries');
                const req = store.get(key);
                req.onsuccess = () => {
                    const row = req.result;
                    if (!row) return resolve(null);
                    // Check expiration (90 days for boundaries)
                    if (row.expiry && Date.now() > row.expiry) return resolve(null);
                    resolve(row.data);
                };
                req.onerror = () => resolve(null);
            });
        } catch { return null; }
    }

    async function _saveToDB(key, data, ttlDays = 90) {
        try {
            const db = await _openDB();
            if (!db) return;
            const tx = db.transaction('boundaries', 'readwrite');
            tx.objectStore('boundaries').put({
                key, data, expiry: Date.now() + ttlDays * 86400000, savedAt: new Date().toISOString()
            });
        } catch (e) { console.warn('[BoundaryDB] Save failed:', e); }
    }

    async function _queryTigerWeb(layerId, where, outFields = 'NAME,GEOID,STATE,COUNTY', extraParams = null) {
        // Build cache-key suffix from extraParams so simplified queries don't
        // collide with full-detail queries.
        const paramsSuffix = extraParams
            ? '_' + Object.keys(extraParams).sort().map(k => `${k}=${extraParams[k]}`).join('&')
            : '';
        const cacheKey = `tw_${layerId}_${where}${paramsSuffix}`;
        if (_cache[cacheKey]) return _cache[cacheKey];

        // Check IndexedDB
        const cached = await _getFromDB(cacheKey);
        if (cached) { _cache[cacheKey] = cached; return cached; }

        let url = `${TIGERWEB_BASE}/${layerId}/query?` +
            `where=${encodeURIComponent(where)}` +
            `&outFields=${encodeURIComponent(outFields)}&returnGeometry=true&outSR=4326&f=geojson`;
        if (extraParams) {
            for (const [k, v] of Object.entries(extraParams)) {
                url += `&${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
            }
        }

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            _cache[cacheKey] = data;
            _saveToDB(cacheKey, data, 90); // Cache 90 days
            console.log(`[Boundary] TIGERweb layer ${layerId}: ${data.features?.length || 0} features`);
            return data;
        } catch (e) {
            console.error(`[Boundary] TIGERweb query failed (layer ${layerId}):`, e);
            return null;
        }
    }

    /**
     * Convert ArcGIS JSON (f=json) response to GeoJSON FeatureCollection.
     * Handles esriGeometryPolygon rings → GeoJSON Polygon/MultiPolygon.
     */
    function _arcgisJsonToGeoJSON(arcgisData) {
        if (!arcgisData?.features?.length) return { type: 'FeatureCollection', features: [] };
        const features = arcgisData.features.map(f => {
            const props = f.attributes || {};
            let geometry = null;
            if (f.geometry?.rings) {
                // ArcGIS polygon: rings[0] = outer, rings[1+] = holes (or multiple parts)
                if (f.geometry.rings.length === 1) {
                    geometry = { type: 'Polygon', coordinates: f.geometry.rings };
                } else {
                    // Multiple rings — treat as MultiPolygon (each ring as a separate polygon)
                    // This is a simplification; proper handling checks winding order for holes
                    geometry = { type: 'MultiPolygon', coordinates: f.geometry.rings.map(r => [r]) };
                }
            } else if (f.geometry?.x !== undefined && f.geometry?.y !== undefined) {
                geometry = { type: 'Point', coordinates: [f.geometry.x, f.geometry.y] };
            }
            return { type: 'Feature', properties: props, geometry };
        }).filter(f => f.geometry);
        return { type: 'FeatureCollection', features };
    }

    async function _queryBtsMpo(where) {
        const cacheKey = `mpo_${where}`;
        if (_cache[cacheKey]) return _cache[cacheKey];

        const cached = await _getFromDB(cacheKey);
        if (cached) { _cache[cacheKey] = cached; return cached; }

        // Strategy A: Try f=geojson (preferred — direct GeoJSON output)
        const geojsonUrl = `${BTS_MPO_BASE}/query?` +
            `where=${encodeURIComponent(where)}` +
            `&outFields=*` +
            `&returnGeometry=true&outSR=4326&f=geojson`;

        try {
            const resp = await fetch(geojsonUrl);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            if (data.error) {
                console.warn('[Boundary] BTS MPO geojson query returned error:', data.error.message || data.error);
                throw new Error(data.error.message || 'ArcGIS error');
            }
            if (data.features?.length > 0) {
                _cache[cacheKey] = data;
                _saveToDB(cacheKey, data, 90);
                console.log(`[Boundary] BTS MPOs (geojson): ${data.features.length} features`);
                return data;
            }
            // If 0 features, still cache to avoid repeated empty queries
            _cache[cacheKey] = data;
            _saveToDB(cacheKey, data, 90);
            console.log(`[Boundary] BTS MPOs (geojson): 0 features for where=${where}`);
            return data;
        } catch (geojsonErr) {
            console.warn('[Boundary] BTS MPO f=geojson failed, trying f=json fallback:', geojsonErr.message);
        }

        // Strategy B: Fallback to f=json (ArcGIS native) and convert to GeoJSON
        const jsonUrl = `${BTS_MPO_BASE}/query?` +
            `where=${encodeURIComponent(where)}` +
            `&outFields=*` +
            `&returnGeometry=true&outSR=4326&f=json`;

        try {
            const resp = await fetch(jsonUrl);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const arcgisData = await resp.json();
            if (arcgisData.error) {
                console.warn('[Boundary] BTS MPO json query returned error:', arcgisData.error.message || arcgisData.error);
                return null;
            }
            const data = _arcgisJsonToGeoJSON(arcgisData);
            _cache[cacheKey] = data;
            _saveToDB(cacheKey, data, 90);
            console.log(`[Boundary] BTS MPOs (json→geojson): ${data.features?.length || 0} features`);
            return data;
        } catch (e) {
            console.error('[Boundary] BTS MPO query failed (both formats):', e);
            return null;
        }
    }

    /**
     * Spatial envelope query for BTS MPO boundaries — matches BTS GeoData Validator approach.
     * Queries by bounding box geometry instead of attribute where clause for maximum reliability.
     */
    async function _spatialQueryBtsMpo(bbox) {
        const cacheKey = `mpo_spatial_${bbox.xmin}_${bbox.ymin}_${bbox.xmax}_${bbox.ymax}`;
        if (_cache[cacheKey]) return _cache[cacheKey];

        const cached = await _getFromDB(cacheKey);
        if (cached) { _cache[cacheKey] = cached; return cached; }

        const envelope = JSON.stringify({
            xmin: bbox.xmin, ymin: bbox.ymin, xmax: bbox.xmax, ymax: bbox.ymax,
            spatialReference: { wkid: 4326 }
        });

        const baseParams = `where=${encodeURIComponent('1=1')}` +
            `&geometry=${encodeURIComponent(envelope)}` +
            `&geometryType=esriGeometryEnvelope` +
            `&spatialRel=esriSpatialRelIntersects` +
            `&inSR=4326&outFields=*&outSR=4326&returnGeometry=true` +
            `&resultRecordCount=50`;

        // Strategy A: Try f=geojson first
        try {
            const resp = await fetch(`${BTS_MPO_BASE}/query?${baseParams}&f=geojson`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const data = await resp.json();
            if (data.error) throw new Error(data.error.message || 'ArcGIS error');
            if (data.features) {
                _cache[cacheKey] = data;
                _saveToDB(cacheKey, data, 90);
                console.log(`[Boundary] BTS MPOs (spatial geojson): ${data.features.length} features`);
                return data;
            }
        } catch (geojsonErr) {
            console.warn('[Boundary] BTS MPO spatial f=geojson failed, trying f=json:', geojsonErr.message);
        }

        // Strategy B: Fallback to f=json and convert
        try {
            const resp = await fetch(`${BTS_MPO_BASE}/query?${baseParams}&f=json`);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            const arcgisData = await resp.json();
            if (arcgisData.error) {
                console.warn('[Boundary] BTS MPO spatial json query error:', arcgisData.error.message || arcgisData.error);
                return null;
            }
            const data = _arcgisJsonToGeoJSON(arcgisData);
            _cache[cacheKey] = data;
            _saveToDB(cacheKey, data, 90);
            console.log(`[Boundary] BTS MPOs (spatial json→geojson): ${data.features?.length || 0} features`);
            return data;
        } catch (e) {
            console.error('[Boundary] BTS MPO spatial query failed (both formats):', e);
            return null;
        }
    }

    return {
        LAYERS,

        async discoverState(stateFips, stateAbbrev) {
            // Fetch state outline, counties, and MPOs in parallel
            // MPOs use robust fallback: multi-field → single-field STATE query
            const mpoQuery = async () => {
                let mpos = await _queryBtsMpo(`STATE='${stateAbbrev}' OR STATE_2='${stateAbbrev}' OR STATE_3='${stateAbbrev}'`);
                if (!mpos?.features?.length) {
                    mpos = await _queryBtsMpo(`STATE='${stateAbbrev}'`);
                }
                return mpos;
            };
            const [stateOutline, counties, mpos] = await Promise.all([
                _queryTigerWeb(LAYERS.states, `STATE='${stateFips}'`, 'NAME,STATE,GEOID'),
                _queryTigerWeb(LAYERS.counties, `STATE='${stateFips}'`, 'NAME,COUNTY,STATE,GEOID'),
                mpoQuery()
            ]);
            jurisdictionContext.boundariesLoaded = !!(stateOutline && counties);
            return { stateOutline, counties, mpos };
        },

        async getStateOutline(stateFips) {
            return _queryTigerWeb(LAYERS.states, `STATE='${stateFips}'`, 'NAME,STATE,GEOID');
        },

        /**
         * Fetch outlines for multiple states. Used by the federal tier to draw
         * all 50 states + DC.
         *
         * Implementation: N parallel single-state queries (one per FIPS),
         * NOT a batched `STATE IN (...)` query. The batched form was hitting
         * net::ERR_FAILED + missing CORS header against TIGERweb on real
         * deployments, while the single-state form (already used by the State
         * tier) is proven reliable. Per-state results are also individually
         * cached in IndexedDB, so this reuses any State-tier-warmed cache.
         *
         * Each per-state query asks for simplified geometry (~1 km tolerance,
         * ~11 m precision) so the merged payload stays mobile-safe.
         *
         * @param {string[]} fipsArray - Array of 2-digit state FIPS codes
         * @returns {Promise<Object>} merged GeoJSON FeatureCollection
         */
        async getMultipleStateOutlines(fipsArray) {
            if (!Array.isArray(fipsArray) || fipsArray.length === 0) {
                return { type: 'FeatureCollection', features: [] };
            }
            const sorted = [...new Set(fipsArray.map(String))].sort();
            const extraParams = { maxAllowableOffset: 0.01, geometryPrecision: 4 };

            const results = await Promise.all(sorted.map(async fips => {
                try {
                    return await _queryTigerWeb(
                        LAYERS.states,
                        `STATE='${fips}'`,
                        'NAME,STATE,GEOID',
                        extraParams
                    );
                } catch (e) {
                    console.warn(`[Boundary] State ${fips} fetch failed:`, e?.message || e);
                    return null;
                }
            }));

            const features = results
                .filter(r => r && Array.isArray(r.features))
                .flatMap(r => r.features);

            console.log(`[Boundary] Multi-state outlines: ${features.length}/${sorted.length} states resolved`);
            return { type: 'FeatureCollection', features };
        },

        async getCounties(stateFips) {
            return _queryTigerWeb(LAYERS.counties, `STATE='${stateFips}'`, 'NAME,COUNTY,STATE,GEOID');
        },

        async getMPOs(stateAbbrev) {
            // Try attribute query first, fall back to state-bbox spatial query
            let result = await _queryBtsMpo(`STATE='${stateAbbrev}' OR STATE_2='${stateAbbrev}' OR STATE_3='${stateAbbrev}'`);
            if (!result?.features?.length) {
                // Attribute query failed — try simpler single-field query
                result = await _queryBtsMpo(`STATE='${stateAbbrev}'`);
            }
            return result;
        },

        async getMPOByAcronym(acronym) {
            // Try ACRONYM field first, then MPO_NAME as fallback
            let result = await _queryBtsMpo(`ACRONYM='${acronym}'`);
            if (!result?.features?.length) {
                result = await _queryBtsMpo(`MPO_NAME LIKE '%${acronym.replace(/'/g, "''")}%'`);
            }
            return result;
        },

        async getMPOByName(name) {
            return _queryBtsMpo(`MPO_NAME LIKE '%${name.replace(/'/g, "''")}%'`);
        },

        /**
         * Query MPO boundaries by spatial bounding box (envelope).
         * Uses the same approach as the BTS GeoData Validator for maximum reliability.
         * @param {Object} bbox - { xmin, ymin, xmax, ymax } in WGS84
         */
        async getMPOsBySpatialQuery(bbox) {
            return _spatialQueryBtsMpo(bbox);
        },

        async getPlaces(stateFips, countyFips) {
            const [places, cdps] = await Promise.all([
                _queryTigerWeb(LAYERS.incorporatedPlaces, `STATE='${stateFips}'`, 'NAME,PLACEFP,LSAD,STATE'),
                _queryTigerWeb(LAYERS.censusDesignatedPlaces, `STATE='${stateFips}'`, 'NAME,PLACEFP,LSAD,STATE')
            ]);
            return { places, cdps };
        },

        // TIGERweb County Subdivisions (layer 22) — used for Planning District fallback
        // and for township-type cities (NJ, PA, MI, New England).
        async getCountySubdivisions(stateFips, countyFips) {
            const where = countyFips
                ? `STATE='${stateFips}' AND COUNTY='${countyFips}'`
                : `STATE='${stateFips}'`;
            return _queryTigerWeb(LAYERS.countySubdivisions, where, 'NAME,COUSUB,COUNTY,STATE,GEOID,FUNCSTAT');
        },

        // Name-based place lookup: resolves a single place feature for a city handler
        // without re-downloading the entire state. Tries incorporated places first,
        // then falls back to CDPs and county subdivisions.
        async getPlaceByNameAndState(stateFips, placeName) {
            const escaped = String(placeName || '').replace(/'/g, "''");
            const upper = escaped.toUpperCase();
            let data = await _queryTigerWeb(LAYERS.incorporatedPlaces,
                `STATE='${stateFips}' AND UPPER(NAME)='${upper}'`,
                'NAME,PLACEFP,LSAD,STATE,GEOID');
            if (data?.features?.length) return data;
            data = await _queryTigerWeb(LAYERS.censusDesignatedPlaces,
                `STATE='${stateFips}' AND UPPER(NAME)='${upper}'`,
                'NAME,PLACEFP,LSAD,STATE,GEOID');
            if (data?.features?.length) return data;
            data = await _queryTigerWeb(LAYERS.countySubdivisions,
                `STATE='${stateFips}' AND UPPER(NAME)='${upper}'`,
                'NAME,COUSUB,COUNTY,STATE,GEOID,FUNCSTAT');
            return data;
        },

        async getCensusTracts(stateFips, countyFips) {
            return _queryTigerWeb(LAYERS.censusTracts, `STATE='${stateFips}' AND COUNTY='${countyFips}'`, 'NAME,TRACT,GEOID,STATE,COUNTY');
        },

        async getUrbanAreas(stateFips) {
            return _queryTigerWeb(LAYERS.urbanAreas, `STATE='${stateFips}'`, 'NAME10,UATYP10,GEOID10');
        },

        async getSchoolDistricts(stateFips) {
            return _queryTigerWeb(LAYERS.schoolDistrictsUnified, `STATE='${stateFips}'`, 'NAME,SDLEA,GEOID');
        },

        async loadDOTDistricts(stateKey) {
            try {
                const resp = await fetch(`../states/${stateKey}/boundaries.json`);
                if (!resp.ok) return null;
                const cfg = await resp.json();
                if (!cfg.dotDistricts?.endpoint) return null;

                const cacheKey = `dot_${stateKey}`;
                if (_cache[cacheKey]) return _cache[cacheKey];

                const cached = await _getFromDB(cacheKey);
                if (cached) { _cache[cacheKey] = cached; return cached; }

                const url = `${cfg.dotDistricts.endpoint}/query?where=1=1` +
                    `&outFields=${cfg.dotDistricts.nameField},${cfg.dotDistricts.codeField}` +
                    `&returnGeometry=true&outSR=4326&f=geojson`;

                const dotResp = await fetch(url);
                if (!dotResp.ok) throw new Error(`DOT API HTTP ${dotResp.status}`);
                const data = await dotResp.json();
                data._config = cfg.dotDistricts;
                _cache[cacheKey] = data;
                _saveToDB(cacheKey, data, 365); // Cache 1 year — DOT boundaries rarely change
                console.log(`[Boundary] DOT districts for ${stateKey}: ${data.features?.length || 0}`);
                return data;
            } catch (e) {
                console.warn(`[Boundary] DOT districts failed for ${stateKey}, trying fallback:`, e.message);
                // Try fallback GeoJSON from R2
                try {
                    const cfgResp = await fetch(`../states/${stateKey}/boundaries.json`);
                    const cfg = await cfgResp.json();
                    if (cfg.dotDistricts?.fallbackGeojson) {
                        const fbResp = await fetch(`../${cfg.dotDistricts.fallbackGeojson}`);
                        if (fbResp.ok) return await fbResp.json();
                    }
                } catch { /* fallback also failed */ }
                return null;
            }
        },

        clearCache() {
            Object.keys(_cache).forEach(k => delete _cache[k]);
            console.log('[Boundary] In-memory cache cleared');
        }
    };
})();

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.BoundaryService = BoundaryService; CL.spatial.BoundaryService = BoundaryService;
  CL._registerModule('spatial/boundary-service');
})();
