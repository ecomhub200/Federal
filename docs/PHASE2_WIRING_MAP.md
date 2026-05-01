# Phase 2: Wiring Map — Federal Codebase

> Generated 2026-04-20 — precise line numbers and property names from the Federal `app/index.html` for deployment prompts.

---

## 1. `crashState.loaded = true` Locations

| # | Line | Function | Data Path | Context |
|---|------|----------|-----------|---------|
| 1 | 21324 | `loadStatewideCSVForTier()` | CSV main-thread (statewide tier) | Papa.parse `complete` callback → sets loaded → calls `onR2LoadComplete()` → calls `finalizeData()` |
| 2 | 27147 | `restoreCrashStateFromCache()` | IndexedDB cache | Restores aggregates/years/routes/nodes from IDB → sets loaded → calls `onR2LoadComplete()` |
| 3 | 31351 | `_processRowObjects()` | Parquet (upload/drag-drop) | Processes row objects from parquet on main thread → sets loaded → calls `onR2LoadComplete()` → calls `finalizeData()` |
| 4 | 31390 | `_parseCsvText()` | CSV main-thread (upload) | Papa.parse `complete` callback for uploaded CSV → sets loaded → calls `onR2LoadComplete()` → calls `finalizeData()` |
| 5 | 31974 | `autoLoadCrashData()` (parquet branch) | Parquet (auto-load) | `.arrayBuffer().then(...)` parquet processing → sets loaded → calls `onR2LoadComplete()` → calls `finalizeData()` |
| 6 | 32129 | `autoLoadCrashData()` (worker branch) | CSV worker | Worker `onmessage` for `msg.type === 'complete'` → sets loaded → calls `onR2LoadComplete()` |
| 7 | 32209 | `_onAutoLoadComplete()` | Other (redundant) | Shared completion handler called by auto-load paths; redundant safety setter → calls `onR2LoadComplete()` |
| 8 | 76838 | `loadSession()` | Session restore | `FileReader.onload` parsing saved JSON session → sets loaded → calls `onR2LoadComplete()` |

**Every location already has the bridge hook:** `if (CL && CL.data && CL.data.supabaseBridge) CL.data.supabaseBridge.onR2LoadComplete();`

---

## 2. `jurisdictionContext` Properties

### 2.1 Object Declaration — line 23109

```javascript
const jurisdictionContext = {
    stateCode: 'CO',              // line 23110
    stateFips: '08',              // line 23111
    stateName: 'Colorado',        // line 23112
    jurisdictionKey: null,        // line 23113
    jurisdictionName: '',         // line 23114
    countyFips: '',               // line 23115
    fullFips: '',                 // line 23116
    type: 'county',               // line 23117
    ..._TIER_EXTENSIONS           // spread from line 20765
};
```

### 2.2 Tier Extensions — `_TIER_EXTENSIONS` at line 20765

```javascript
const _TIER_EXTENSIONS = {
    viewTier: 'county',              // line 20766
    tierState: null,                 // line 20767
    tierRegion: null,                // line 20768 — object: { id, name, shortName, ... }
    tierPlanningDistrict: null,      // line 20769 — object: { id, name }
    tierMpo: null,                   // line 20770 — object: { id, name, shortName, _cachedBoundary }
    tierCity: null,                  // line 20771 — object: { id, name, type }
    tierCorridor: null,              // line 20772
    tierRoadType: 'all_roads',       // line 20773
    solutionsScopeCounty: null,      // line 20774
    hierarchyLoaded: false,          // line 20775
    boundariesLoaded: false          // line 20776
};
```

### 2.3 All 19 Unique Property Names

| Property | Source | Accessed As | Sample Value |
|----------|--------|-------------|-------------|
| `stateCode` | base | `ctx.stateCode` | `'CO'` |
| `stateFips` | base | `ctx.stateFips` | `'08'` |
| `stateName` | base | `ctx.stateName` | `'Colorado'` |
| `jurisdictionKey` | base | `ctx.jurisdictionKey` | `null` |
| `jurisdictionName` | base | `ctx.jurisdictionName` | `''` |
| `countyFips` | base | (defined but never read directly) | `''` |
| `fullFips` | base | `ctx.fullFips` | `''` |
| `type` | base | (defined but never read directly) | `'county'` |
| `viewTier` | tier ext | `ctx.viewTier` | `'county'` |
| `tierState` | tier ext | `ctx.tierState?.name` | `null` → `{ name }` |
| `tierRegion` | tier ext | `ctx.tierRegion?.name`, `ctx.tierRegion?.id`, `ctx.tierRegion?.shortName` | `null` → `{ id, name, shortName }` |
| `tierPlanningDistrict` | tier ext | `ctx.tierPlanningDistrict?.name`, `ctx.tierPlanningDistrict?.id` | `null` → `{ id, name }` |
| `tierMpo` | tier ext | `ctx.tierMpo?.name`, `ctx.tierMpo?.id`, `ctx.tierMpo?.shortName` | `null` → `{ id, name, shortName, _cachedBoundary }` |
| `tierCity` | tier ext | `ctx.tierCity?.name`, `ctx.tierCity?.id` | `null` → `{ id, name, type }` |
| `tierCorridor` | tier ext | (defined but never read directly) | `null` |
| `tierRoadType` | tier ext | (defined but never read directly) | `'all_roads'` |
| `solutionsScopeCounty` | tier ext | (defined but never read directly) | `null` |
| `hierarchyLoaded` | tier ext | `ctx.hierarchyLoaded` | `false` → `true` |
| `boundariesLoaded` | tier ext | `ctx.boundariesLoaded` | `false` → `true` |

### 2.4 Critical: Properties That Do NOT Exist

These were hypothesized but do **not** exist in the codebase:
- ~~`jurisdictionContext.regionName`~~ → use `tierRegion?.name`
- ~~`jurisdictionContext.region`~~ → use `tierRegion`
- ~~`jurisdictionContext.mpoName`~~ → use `tierMpo?.name`
- ~~`jurisdictionContext.mpo`~~ → use `tierMpo`
- ~~`jurisdictionContext.planningDistrictName`~~ → use `tierPlanningDistrict?.name`
- ~~`jurisdictionContext.planningDistrict`~~ → use `tierPlanningDistrict`
- ~~`jurisdictionContext.countyName`~~ → use `jurisdictionName`
- ~~`jurisdictionContext.cityName`~~ → use `tierCity?.name`

### 2.5 Assignment patterns

| Line | Pattern |
|------|---------|
| 23128 | `Object.assign(jurisdictionContext, updates)` — merges arbitrary updates |
| 23132 | `localStorage.setItem('jurisdictionContext', JSON.stringify(jurisdictionContext))` — persist |
| 23151 | `localStorage.getItem('jurisdictionContext')` — restore |
| 23154 | `Object.assign(jurisdictionContext, parsed)` — restore from localStorage |
| 21395 | `jurisdictionContext.tierRegion = { id: regionId, ...region }` |
| 21449 | `jurisdictionContext.tierMpo = { id: mpoId, ...mpo }` |
| 21232 | `jurisdictionContext.tierPlanningDistrict = { id: pdId, name: pdName }` |
| 21258 | `jurisdictionContext.tierCity = { id: slug, name: displayName, type: placeType }` |
| 20794 | `jurisdictionContext.viewTier = tier` (inside `setViewTier()`) |

---

## 3. Correct `resolveTier()` Implementation

The existing `supabase-bridge.js` already has the correct implementation (lines 33–43):

```javascript
function resolveTier() {
    var ctx = (typeof jurisdictionContext !== 'undefined') ? jurisdictionContext : null;
    if (!ctx) return { tier: 'state', value: null };
    var t = ctx.viewTier || 'county';
    if (t === 'state' || t === 'federal') return { tier: 'state', value: null };
    if (t === 'region') return { tier: 'region', value: ctx.tierRegion && ctx.tierRegion.name };
    if (t === 'mpo')    return { tier: 'mpo',    value: ctx.tierMpo && ctx.tierMpo.name };
    if (t === 'planning_district') return { tier: 'planning_district', value: ctx.tierPlanningDistrict && ctx.tierPlanningDistrict.name };
    if (t === 'county' || t === 'city') return { tier: 'county', value: ctx.jurisdictionName || null };
    return { tier: 'state', value: null };
}
```

**This is verified correct** against the actual property names in the codebase. All `tier*` properties are accessed via `.name` sub-property (not as flat strings), and `jurisdictionName` is used for county/city (not `countyName`).

---

## 4. Phase 1 Init Block

**Line numbers:** 151594–151617

```html
<!-- CrashLens Supabase Data Client (Phase 1 — foundation only) -->       <!-- 151594 -->
<script src="../assets/js/data-client.js"></script>                       <!-- 151595 -->
<script src="modules/data/supabase-bridge.js"></script>                   <!-- 151596 -->
<script>                                                                  <!-- 151597 -->
  // Initialize Supabase data client after page load                      // 151598
  // This does NOT change any existing data loading — it just makes       // 151599
  // the client available for future phases to use.                       // 151600
  document.addEventListener('DOMContentLoaded', function() {              // 151601
    try {                                                                 // 151602
      var stateKey = (typeof _getActiveStateKey === 'function')           // 151603
          ? _getActiveStateKey() : 'delaware';
      window.crashLensClient = CrashLensDataClient.init({ state: stateKey }); // 151604
      if (window.CL && CL.data) CL.data.client = window.crashLensClient; // 151605
      console.log('[Phase1] CrashLens Supabase client ready, state:', stateKey); // 151606
                                                                          // 151607
      // Phase 2: Fast Dashboard pre-load from Supabase                   // 151608
      if (CL.data.supabaseBridge && CL.data.supabaseBridge.injectFastDashboard) { // 151609
        CL.data.supabaseBridge.injectFastDashboard();                     // 151610
      }                                                                   // 151611
    } catch(e) {                                                          // 151612
      console.warn('[Phase1] Supabase client init failed (non-fatal):', e.message); // 151613
    }                                                                     // 151615
  });                                                                     // 151616
</script>                                                                 <!-- 151617 -->
```

**Status:** Phase 2 bridge call is already wired at lines 151609–151611. The `injectFastDashboard()` call fires inside the DOMContentLoaded try/catch.

---

## 5. Script Tag Locations

| Script | Line |
|--------|------|
| `<script src="../assets/js/data-client.js"></script>` | 151595 |
| `<script src="modules/data/supabase-bridge.js"></script>` | 151596 |
| Inline Phase 1/Phase 2 init `<script>` | 151597–151617 |

These are the **last three script elements** in the file, placed right before `</body></html>`.

---

## 6. `loader.js` Full Contents

**File:** `app/modules/loader.js` (27 lines)

```javascript
/**
 * CrashLens Module Namespace
 * All extracted modules attach to window.CL
 * This file initializes the namespace structure.
 */
window.CL = window.CL || {};
CL.core = CL.core || {};
CL.analysis = CL.analysis || {};
CL.warrants = CL.warrants || {};
CL.grants = CL.grants || {};
CL.cmf = CL.cmf || {};
CL.safety = CL.safety || {};
CL.ai = CL.ai || {};
CL.data = CL.data || {};
CL.data.client = null;          // Populated by data-client.js init (Phase 1)
CL.data.supabaseBridge = null;  // Populated by supabase-bridge.js (Phase 2)
CL.spatial = CL.spatial || {};
CL.upload = CL.upload || {};
CL.utils = CL.utils || {};
CL.batchBA = CL.batchBA || {};

// Module loading tracker (for debugging)
CL._loaded = [];
CL._registerModule = function(name) {
    CL._loaded.push({ name: name, time: new Date().toISOString() });
    console.log('[CL] Module loaded:', name);
};
```

**Confirmed:** Both `CL.data.client = null` (Phase 1) and `CL.data.supabaseBridge = null` (Phase 2) namespace slots are already reserved.

---

## 7. `supabase-bridge.js` Already Exists

**File:** `app/modules/data/supabase-bridge.js` (317 lines)

The Phase 2 bridge module is **already fully implemented** with:

| Feature | Status |
|---------|--------|
| `resolveTier()` using correct property names | ✅ verified correct |
| `aggregate()` — builds KPI aggregates from Supabase rows | ✅ |
| `paintKPIs()` — writes to all 39+ element IDs | ✅ |
| `paintYearlyTable()` → writes `dashYearlyBody` | ✅ |
| `paintFuncClassTable()` → writes `funcClassBody` | ✅ |
| `showBanner()` / `removeBanner()` — loading indicator | ✅ |
| `injectFastDashboard()` — main entry point, skips if `crashState.loaded` | ✅ |
| `onR2LoadComplete()` — removes banner, called from all 8 load paths | ✅ |
| Never mutates `crashState` | ✅ by design |
| All failures swallowed (try/catch) | ✅ |

---

## 8. Deployment Checklist — What's Already Wired

| # | What | Where | Status |
|---|------|-------|--------|
| 1 | `<script>` tag for `data-client.js` | line 151595 | ✅ Already present |
| 2 | `<script>` tag for `supabase-bridge.js` | line 151596 | ✅ Already present |
| 3 | `injectFastDashboard()` call in DOMContentLoaded | line 151610 | ✅ Already present |
| 4 | `onR2LoadComplete()` hooks in all 8 load paths | lines 21325, 27148, 31352, 31391, 31975, 32130, 32210, 76839 | ✅ All 8 already wired |
| 5 | `CL.data.client` namespace in `loader.js` | line 15 of loader.js | ✅ Already present |
| 6 | `CL.data.supabaseBridge` namespace in `loader.js` | line 16 of loader.js | ✅ Already present |
| 7 | `supabase-bridge.js` module file | `app/modules/data/supabase-bridge.js` | ✅ Already exists (317 lines) |

### What Still Needs Attention

1. **Supabase `dashboard_summary` matview must exist** with columns: `crash_count`, `crash_severity`, `crash_year`, `functional_class`, `collision_type`, `ped_crashes`, `bike_crashes`, `speed_crashes`, `night_crashes`, `alcohol_crashes`, `animal_crashes`, `fatals`, `serious_injuries`, `total_injured` — these are the column names the `aggregate()` function reads.

2. **`CrashLensDataClient.getSummary(tier, value)`** must return rows from the matview filtered by tier/value. Verify this method exists and works in `data-client.js`.

3. **State key default** is hardcoded to `'delaware'` at line 151603. For Federal deployment, this should use `_getActiveStateKey()` which must be defined before the DOMContentLoaded listener fires.

---

## 9. 2026-04-30 — `road_type` is now `ownership`-derived (4-bucket model)

The 6 matviews and the `map_viewport_crashes` RPC were rebuilt to derive
`road_type` from `crashes.ownership` instead of `crashes.system`. This widened
the bucket list and introduced a separate `is_interstate` boolean.

### 9.1 Bucket contract

`road_type ∈ {dot_roads, county_roads, city_roads, other_roads}` —
**not** the previous 3-bucket `{dot_roads, non_dot_roads, all_roads}`.
`is_interstate` is a boolean that is `true` only on the interstate subset of
`dot_roads`. Every other bucket has `is_interstate = false`.

Verified live row counts (Delaware-only baseline):

| Bucket | dashboard_summary | mv_hotspots | mv_grants_baseline |
|---|---|---|---|
| city_roads | 81,315 | 81,315 | 31,007 |
| county_roads | 39,885 | 39,885 | 19,883 |
| dot_roads | 438,501 | 438,501 | 326,697 |
| other_roads | 10,128 | 533 | 413 |
| `is_interstate=true` | 40,760 (subset of dot_roads) | – | – |

### 9.2 New `is_interstate` column

Present on every matview and on `map_viewport_crashes` results. Used by the
County / City "All Roads (No Interstate)" radio (`countyPlusVDOT` in
that tier sends `noInterstate=true`, which becomes `is_interstate=eq.false`
on the matview query and `p_no_interstate=true` on the RPC).

### 9.3 New `map_viewport_crashes` RPC params

The RPC is now 11-arg (was 8-arg). New params, all NULL = unfiltered:

- `p_road_type` — single bucket, e.g. `'city_roads'`
- `p_road_types` — array of buckets, e.g. `ARRAY['county_roads','city_roads','other_roads']`
- `p_no_interstate` — boolean; when `true`, RPC adds `AND is_interstate = false`

`p_road_types` takes precedence over `p_road_type` when both are supplied.
The original 8-arg signature body is saved at
`docs/rollback/map_viewport_crashes.pre.sql` for emergency rollback.

### 9.4 Tier-aware radio mapping (frontend)

`CrashLensDataClient.radioToBucket(radioValue, tier)` is the canonical mapper.
The Phase 2 bridge's `roadTypeSpec()` mirrors it for DOM-aware contexts.

| Radio | State / Region / MPO / PD | Federal | County / City |
|---|---|---|---|
| `countyOnly` | `dot_roads` | `dot_roads` | `dot_roads` |
| `cityOnly` | `city_roads` | `city_roads` | `city_roads` |
| `countyPlusVDOT` | `county_roads` | `[county_roads, city_roads, other_roads]` | `noInterstate=true` |
| `allRoads` | (no filter) | (no filter) | (no filter) |

The previous `'city_roads' → null` short-circuit is gone — `cityOnly` now
returns a real `road_type=eq.city_roads` filter at every tier.

### 9.5 Performance contract

- All Supabase responses go out with `Prefer: count=estimated` (§6.2).
  Pagination totals are now planner-stat estimates, accurate within ~5% on
  freshly-VACUUM'd tables.
- `getSummary()` is wrapped in a 60-second stale-while-revalidate cache
  (`CrashLensDataClient._swrCache`). Cache key includes state + tier +
  value + filter spec — toggling road type evicts cleanly.
- `prefetchTier(tier, value, opts)` exposes a fire-and-forget cache warmer
  used by `handleCitySelection()` to make navigation up to the parent
  county feel instant.
- `aggregate(rows)` runs in a Web Worker (`assets/js/agg-worker.js`) when
  `Worker` is available, falling back to the synchronous path otherwise.

### 9.6 PostgREST cache headers (dormant)

`public.add_cache_headers()` is installed but inert until the user sets
`PGRST_DB_PRE_REQUEST=public.add_cache_headers` and restarts PostgREST. Until
then, the client-side SWR cache is the only HTTP-cache-equivalent in play.

### 9.7 Rollback

JS: every change is < 60 lines per file — revert the diff. DB: see
`docs/rollback/map_viewport_crashes.pre.sql` and the matview definitions
in git history (handoff §6).

4. **Charts are NOT pre-painted** — the bridge only paints KPI cards, yearly table, and funcClass table. Chart.js canvases (`chartYoY`, `chartKAYear`, `chartDOW`, etc.) are left empty until R2 data arrives and `updateDashboard()` → `updateCharts()` runs.
