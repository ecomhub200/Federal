# Phase 5: Tier Navigation — Implementation Plan

**Date:** 2026-04-23  
**Status:** Analysis complete — far fewer gaps than expected

---

## What Already Works

### All 7 Tier Handler Functions EXIST

| Tier | Handler Function | Line | Wired in HTML | Context Property Set |
|------|-----------------|------|---------------|---------------------|
| Federal | `handleTierChange('federal')` | 20906 | ✅ button onclick | N/A (no filter) |
| State | `handleTierChange('state')` | 20906 | ✅ button onclick | N/A (state from stateKey) |
| Region | `handleRegionSelection()` | 21474 | ✅ onchange L4849 | `jurisdictionContext.tierRegion` |
| MPO | `handleMPOSelection()` | 21527 | ✅ onchange L4849 | `jurisdictionContext.tierMpo` |
| Plan. District | `handlePlanningDistrictSelection()` | 21241 | ✅ onchange L4855 | `jurisdictionContext.tierPlanningDistrict` |
| County | existing county selection | — | ✅ onchange | `jurisdictionContext.jurisdictionKey` |
| City | `handleCitySelection()` | 21306 | ✅ onchange L4861 | `jurisdictionContext.tierCity` |

### All Dropdown Elements Exist and Are Wired

- `tierRegionSelect` → `onchange="handleRegionSelection()"` (line 4849)
- `tierMPOSelect` → `onchange="handleMPOSelection()"` (line 4849)
- `tierPlanningDistrictSelect` → `onchange="handlePlanningDistrictSelection()"` (line 4855)
- `tierCitySelect` → `onchange="handleCitySelection()"` (line 4861)

### Supporting Infrastructure Exists

- `handleTierChange(tier)` (line 20906): Orchestrates all 7 tiers — populates dropdowns, draws boundaries, loads aggregates
- `setViewTier(tier)` (line 20801): Sets `jurisdictionContext.viewTier` + UI update
- `populatePlanningDistrictDropdown()` (line 21205): Loads PDs from HierarchyRegistry
- `populateGeoTierDropdown('city')` (line 21119): Merges places + subdivisions from R2
- `getTierScopeKey()` (line 21804): Handles ALL 7 tiers correctly ✅
- `HierarchyRegistry` (line 21947): Loads hierarchy.json for regions/MPOs/PDs
- `BoundaryService` (line 22057): TIGERweb + BTS boundary queries
- `AggregateLoader` (line 22547): R2 aggregate loading for all tiers

### Supabase Data Exists for All Tiers (Delaware)

| Tier | Column | Distinct Values | Total Crashes |
|------|--------|----------------|---------------|
| State | `state` | 1 (delaware) | 569,829 |
| Region | `dot_district` | 3 | 569,829 |
| MPO | `mpo_name` | 4 | 569,829 |
| Planning District | `planning_district` | 3 | 569,829 |
| County/City | `physical_juris_name` | 81 | 569,829 |

### Supabase Bridge Already Resolves All Tiers

`resolveTier()` in supabase-bridge.js (line 38-47) maps:
- `federal` → `{ tier: 'state', value: null }`
- `state` → `{ tier: 'state', value: null }`
- `region` → `{ tier: 'region', value: ctx.tierRegion.name }`
- `mpo` → `{ tier: 'mpo', value: ctx.tierMpo.name }`
- `planning_district` → `{ tier: 'planning_district', value: ctx.tierPlanningDistrict.name }`
- `county`/`city` → `{ tier: 'county', value: ctx.jurisdictionName }`

### data-client.js TIER_COLUMNS Covers All Tiers

```javascript
static TIER_COLUMNS = {
    federal:           null,
    state:             'state',
    region:            'dot_district',
    planning_district: 'planning_district',
    mpo:               'mpo_name',
    county:            'physical_juris_name',
    city:              'physical_juris_name',
};
```

---

## What's Missing (Gap Analysis)

### Gap 1: `getTierScopeName()` Missing planning_district and city Cases

**File:** app/index.html, lines 21827-21847

**Current code:**
```javascript
function getTierScopeName() {
    const tier = jurisdictionContext.viewTier;
    switch (tier) {
        case 'state':
            return jurisdictionContext.stateName || jurisdictionContext.tierState?.name || 'Statewide';
        case 'region': { /* ✅ handles region */ }
        case 'mpo': { /* ✅ handles MPO */ }
        case 'county':
        case 'city':       // ❌ Falls through to county default
        default:
            return jurisdictionContext.jurisdictionName || 'County';
    }
}
```

**Problems:**
1. `planning_district` has no case — falls to default, returns county name instead of PD name
2. `city` is grouped with `county` — returns `jurisdictionContext.jurisdictionName` (which is the county name) instead of `jurisdictionContext.tierCity?.name`
3. `federal` has no case — falls to default, returns county name instead of "Nationwide"

### Gap 2: `getTierScopeKey()` Missing federal Case

**File:** app/index.html, lines 21804-21821

`federal` has no explicit case — falls to default `county_` prefix. Should return `federal_all` or similar.

### Gap 3: City Tier Supabase Bridge Resolution

In `resolveTier()` (supabase-bridge.js line 46):
```javascript
if (t === 'county' || t === 'city') return { tier: 'county', value: ctx.jurisdictionName || null };
```

For city tier, `ctx.jurisdictionName` is the COUNTY name (e.g., "Kent"), not the city name (e.g., "Dover"). The city filter should use `ctx.tierCity?.name` to query `physical_juris_name = 'Dover'` from the matview.

---

## Implementation Steps

### Step 1: Fix `getTierScopeName()` at line 21827

Add `planning_district`, `city`, and `federal` cases.

**Change lines 21842-21846 from:**
```javascript
        case 'county':
        case 'city':
        default:
            return jurisdictionContext.jurisdictionName || 'County';
```

**To:**
```javascript
        case 'planning_district': {
            const pd = jurisdictionContext.tierPlanningDistrict;
            const countyCount = pd?.counties?.length || 0;
            return pd ? `${pd.shortName || pd.name}${countyCount ? ` (${countyCount} counties)` : ''}` : 'Planning District';
        }
        case 'city': {
            const c = jurisdictionContext.tierCity;
            return c ? (c.name || c.id) : 'City/Town';
        }
        case 'federal':
            return 'Nationwide';
        case 'county':
        default:
            return jurisdictionContext.jurisdictionName || 'County';
```

### Step 2: Fix `getTierScopeKey()` at line 21804

Add `federal` case.

**Change line 21806 — add before the `case 'state':` line:**
```javascript
        case 'federal':
            return 'federal_all';
```

### Step 3: Fix `resolveTier()` city handling in supabase-bridge.js

**File:** app/modules/data/supabase-bridge.js, line 46

**Change from:**
```javascript
if (t === 'county' || t === 'city') return { tier: 'county', value: ctx.jurisdictionName || null };
```

**To:**
```javascript
if (t === 'city') return { tier: 'county', value: (ctx.tierCity && ctx.tierCity.name) || ctx.jurisdictionName || null };
if (t === 'county') return { tier: 'county', value: ctx.jurisdictionName || null };
```

This ensures that when a city like "Dover" is selected, the Supabase query filters by `physical_juris_name = 'Dover'` instead of `physical_juris_name = 'Kent'` (the county).

---

## Test Plan

### Test 1: getTierScopeName returns correct names

| Tier | Input Context | Expected Return |
|------|--------------|-----------------|
| federal | viewTier='federal' | "Nationwide" |
| state | viewTier='state', stateName='Delaware' | "Delaware" |
| region | viewTier='region', tierRegion={name:'North District', counties:['003']} | "North District (1 counties)" |
| mpo | viewTier='mpo', tierMpo={name:'WILMAPCO', counties:['003']} | "WILMAPCO (1 counties)" |
| planning_district | viewTier='planning_district', tierPlanningDistrict={name:'Central District'} | "Central District" |
| county | viewTier='county', jurisdictionName='Kent County' | "Kent County" |
| city | viewTier='city', tierCity={name:'Dover'} | "Dover" |

### Test 2: getTierScopeKey returns correct keys

| Tier | Expected Key Pattern |
|------|---------------------|
| federal | `federal_all` |
| state | `state_10` |
| region | `region_de_1` |
| mpo | `mpo_wilmapcowapc` |
| planning_district | `planning_district_de_2` |
| county | `county_10001` |
| city | `city_dover` |

### Test 3: resolveTier returns correct Supabase filter for city

```javascript
// With city selected:
jurisdictionContext.viewTier = 'city';
jurisdictionContext.tierCity = { id: 'dover', name: 'Dover' };
jurisdictionContext.jurisdictionName = 'Kent County';

CL.data.supabaseBridge.resolveTier();
// Expected: { tier: 'county', value: 'Dover' }
// NOT: { tier: 'county', value: 'Kent County' }
```

### Test 4: Supabase matview returns data for city-level queries

```sql
SELECT SUM(crash_count) FROM dashboard_summary 
WHERE state='delaware' AND physical_juris_name='Dover';
-- Expected: 33,583 crashes
```

### Test 5: Regression — no existing functions modified

Count these functions before and after:
- `handleTierChange` — 1
- `handleRegionSelection` — 1
- `handleMPOSelection` — 1
- `handlePlanningDistrictSelection` — 1
- `handleCitySelection` — 1
- `autoLoadCrashData` — 1
- `processRow` — 1
- `updateDashboard` — 1

All counts must be identical before and after changes.

### Test 6: Full flow trace for Planning District

1. User clicks "Planning District" button → `handleTierChange('planning_district')` fires (line 20906)
2. `setViewTier('planning_district')` sets viewTier (line 20801)
3. `populatePlanningDistrictDropdown()` populates dropdown from HierarchyRegistry (line 21205)
4. User picks "Central District" → `handlePlanningDistrictSelection()` fires (line 21241)
5. Sets `jurisdictionContext.tierPlanningDistrict = { id: 'de_2', name: 'Central District' }`
6. Calls `autoLoadCrashData(true)` → R2 path or Supabase
7. `jurisdictionChanged` event → supabase-bridge `refresh()` fires
8. `resolveTier()` → `{ tier: 'planning_district', value: 'Central District' }`
9. `getSummary('planning_district', 'Central District')` → filters matview by `planning_district = 'Central District'`
10. Dashboard KPIs painted with Central District data

### Test 7: Full flow trace for City

1. User clicks "City/Town" button → `handleTierChange('city')` fires
2. `populateGeoTierDropdown('city')` fetches places from R2 + Census
3. User picks "Dover" → `handleCitySelection()` fires (line 21306)
4. Sets `jurisdictionContext.tierCity = { id: 'dover', name: 'Dover', type: 'city' }`
5. `autoLoadCrashData(true)` → R2 or Supabase
6. `jurisdictionChanged` event → supabase-bridge `refresh()`
7. `resolveTier()` → `{ tier: 'county', value: 'Dover' }` (AFTER fix, was 'Kent County')
8. `getSummary('county', 'Dover')` → filters matview by `physical_juris_name = 'Dover'`
9. Dashboard KPIs show Dover-specific data (33,583 crashes)
