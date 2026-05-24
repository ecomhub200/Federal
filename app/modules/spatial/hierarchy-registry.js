/**
 * CL spatial.hierarchyRegistry module
 *
 * Extracted from app/index.html (snapshot L22115-L22219) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/01-spatial-hierarchy-registry.md.
 * Responsibility: Jurisdiction hierarchy registry (regions/TPRs/MPOs/counties lookups).
 *
 * Public API (back-compat dual exposure):
 *   - window.HierarchyRegistry → CL.spatial.HierarchyRegistry
 *
 * Depends on (must load before this file): `core/constants`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

const HierarchyRegistry = (() => {
    'use strict';
    let _data = null;
    let _stateKey = null;

    async function load(stateKey) {
        if (_stateKey === stateKey && _data) return _data;
        const path = `../states/${stateKey}/hierarchy.json`;
        try {
            const resp = await fetch(path);
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            _data = await resp.json();
            _stateKey = stateKey;
            jurisdictionContext.hierarchyLoaded = true;
            console.log(`[Hierarchy] Loaded ${stateKey}: ${Object.keys(_data.regions || {}).length} regions, ${Object.keys(_data.tprs || {}).length} TPRs/MPOs`);
            return _data;
        } catch (e) {
            console.error(`[Hierarchy] Failed to load ${path}:`, e);
            return null;
        }
    }

    function getData() { return _data; }
    function getStateKey() { return _stateKey; }

    function getRegions() {
        return _data?.regions ? Object.entries(_data.regions).map(([id, r]) => ({ id, ...r })) : [];
    }

    function getTPRs(type) {
        if (!_data?.tprs) return [];
        return Object.entries(_data.tprs)
            .filter(([, t]) => !type || t.type === type)
            .map(([id, t]) => ({ id, ...t }));
    }

    function getMPOs() { return getTPRs('mpo'); }
    function getRuralTPRs() { return getTPRs('rural_tpr'); }

    function getCountiesInRegion(regionId) {
        const region = _data?.regions?.[regionId];
        if (!region) return [];
        return region.counties.map(fips => ({
            fips,
            name: region.countyNames?.[fips] || _data.allCounties?.[fips] || fips
        }));
    }

    function getCountiesInTPR(tprId) {
        const tpr = _data?.tprs?.[tprId];
        if (!tpr) return [];
        return tpr.counties.map(fips => ({
            fips,
            name: tpr.countyNames?.[fips] || _data.allCounties?.[fips] || fips
        }));
    }

    function getCountyMemberships(countyFips) {
        const result = { regions: [], tprs: [], corridors: [] };
        if (!_data) return result;
        Object.entries(_data.regions || {}).forEach(([id, r]) => {
            if (r.counties?.includes(countyFips)) result.regions.push({ id, name: r.shortName || r.name });
        });
        Object.entries(_data.tprs || {}).forEach(([id, t]) => {
            if (t.counties?.includes(countyFips)) result.tprs.push({ id, name: t.shortName || t.name, type: t.type });
        });
        Object.entries(_data.corridors || {}).forEach(([id, c]) => {
            if (c.counties?.includes(countyFips)) result.corridors.push({ id, name: c.name });
        });
        return result;
    }

    function getCorridors() {
        return _data?.corridors ? Object.entries(_data.corridors).map(([id, c]) => ({ id, ...c })) : [];
    }

    function getCountiesOnCorridor(corridorId) {
        const corridor = _data?.corridors?.[corridorId];
        if (!corridor) return [];
        return corridor.counties.map(fips => ({
            fips,
            name: _data.allCounties?.[fips] || fips
        }));
    }

    function getCountyName(fips) {
        return _data?.allCounties?.[fips] || null;
    }

    function getRegionTypeLabel(plural) {
        return plural ? (_data?.regionType?.labelPlural || 'Regions') : (_data?.regionType?.label || 'Region');
    }

    function getTPRTypeLabel(plural) {
        return plural ? (_data?.tprType?.labelPlural || 'MPOs') : (_data?.tprType?.label || 'MPO');
    }

    return {
        load, getData, getStateKey,
        getRegions, getTPRs, getMPOs, getRuralTPRs,
        getCountiesInRegion, getCountiesInTPR, getCountyMemberships,
        getCorridors, getCountiesOnCorridor, getCountyName,
        getRegionTypeLabel, getTPRTypeLabel
    };
})();

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.HierarchyRegistry = HierarchyRegistry; CL.spatial.HierarchyRegistry = HierarchyRegistry;
  CL._registerModule('spatial/hierarchy-registry');
})();
