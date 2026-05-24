/**
 * CL spatial.spatialClip module
 *
 * Extracted from app/index.html (snapshot L22865-L22954) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/04-spatial-spatial-clip.md.
 * Responsibility: Turf-based point/line/polygon clipping to a jurisdiction polygon.
 *
 * Public API (back-compat dual exposure) — public singleton ONLY; the
 * getJurisdictionPolygon/clipPoints/clipLines/clipPolygons helpers are
 * private to the arrow-IIFE (not in outer scope) and have 0 bare-global
 * callers (consumers use SpatialClipService.clipPoints(...)) — do NOT
 * expose them (would ReferenceError on load):
 *   - window.SpatialClipService → CL.spatial.SpatialClipService
 *
 * Depends on (must load before this file): `spatial/federal-boundaries`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

const SpatialClipService = (() => {
    'use strict';

    function getJurisdictionPolygon(jurisdictionId) {
        const geojson = typeof builtInLayersState !== 'undefined'
            ? builtInLayersState?.jurisdictionBoundary?.geojsonCache?.[jurisdictionId]
            : null;
        if (!geojson?.features?.[0]) return null;
        return geojson.features[0];
    }

    function clipPoints(features, jurisdictionId) {
        const polygon = getJurisdictionPolygon(jurisdictionId);
        if (!polygon) {
            console.warn('[SpatialClip] No polygon cached for', jurisdictionId, '— returning unclipped');
            return features;
        }

        const before = features.length;
        const result = features.filter(f => {
            const geom = f.geometry || {};
            let lng, lat;

            if (geom.x !== undefined && geom.y !== undefined) {
                lng = geom.x; lat = geom.y;
            } else if (geom.coordinates) {
                [lng, lat] = geom.coordinates;
            } else {
                const attrs = f.attributes || f.properties || f;
                lng = parseFloat(attrs.longitude || attrs.lng || attrs.LON || attrs.x);
                lat = parseFloat(attrs.latitude || attrs.lat || attrs.LAT || attrs.y);
            }

            if (isNaN(lng) || isNaN(lat)) return false;
            return typeof pointInFeature === 'function' ? pointInFeature(lng, lat, polygon) : true;
        });

        if (before !== result.length) {
            console.log(`[SpatialClip] Points: ${before} → ${result.length} (${before - result.length} outside polygon)`);
        }
        return result;
    }

    function clipLines(features, jurisdictionId) {
        const polygon = getJurisdictionPolygon(jurisdictionId);
        if (!polygon) return features;

        if (typeof turf === 'undefined') {
            console.warn('[SpatialClip] turf.js not loaded — returning unclipped lines');
            return features;
        }

        const polyTurf = turf.feature(polygon.geometry);
        const before = features.length;
        const result = features.filter(f => {
            try {
                return turf.booleanIntersects(turf.feature(f.geometry), polyTurf);
            } catch { return true; }
        });

        if (before !== result.length) {
            console.log(`[SpatialClip] Lines: ${before} → ${result.length}`);
        }
        return result;
    }

    function clipPolygons(features, jurisdictionId) {
        const polygon = getJurisdictionPolygon(jurisdictionId);
        if (!polygon) return features;

        if (typeof turf === 'undefined') return features;

        const polyTurf = turf.feature(polygon.geometry);
        return features.map(f => {
            try {
                const intersection = turf.intersect(
                    turf.featureCollection([turf.feature(f.geometry), polyTurf])
                );
                if (!intersection) return null;
                return { ...f, geometry: intersection.geometry };
            } catch { return f; }
        }).filter(Boolean);
    }

    return { clipPoints, clipLines, clipPolygons, getJurisdictionPolygon };
})();

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.SpatialClipService = SpatialClipService; CL.spatial.SpatialClipService = SpatialClipService;
  CL._registerModule('spatial/spatial-clip');
})();
