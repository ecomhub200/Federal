# Phase 3: Map Viewport Queries — Pre-Wire Analysis

> Generated 2026-04-21 — precise line numbers and property names from the Federal `app/index.html` for deployment prompts.

---

## 1. Map Initialization

### 1.1 Singleton Pattern

The map is a **lazily-initialized singleton**. It is never created at page load — only when the user clicks the Map tab.

| Item | Line | Detail |
|------|------|--------|
| Global variables | 30428 | `let crashMap = null, markerCluster = null, heatLayer = null, markersLayer = null;` |
| Tile layer vars | 30429 | `let streetTileLayer = null, satelliteTileLayer = null, currentBaseLayer = 'street';` |
| Mode tracking | 30430 | `let currentMapMode = 'cluster';` |
| `initMap()` definition | 48188 | Function declaration; guard `if (crashMap) return;` at line 48189 — idempotent |
| `L.map()` creation | 48205 | `crashMap = L.map('map', { zoomControl: false }).setView(center, zoom);` |

### 1.2 Lazy Init Trigger

Inside `showTab()` (line 30602):

```javascript
// line 30627
if (tabId === 'map' && crashState.loaded) {
    if (!crashMap) {
        setTimeout(initMap, 100);       // line 30629 — first visit
    } else {
        setTimeout(() => {
            crashMap.invalidateSize();   // line 30633 — re-visit
            if (typeof updateMapDisplay === 'function') updateMapDisplay();
        }, 100);
    }
}
```

**Key insight:** `initMap()` is called with `setTimeout(…, 100)` — the 100ms delay exists to let the DOM render the tab-content before Leaflet measures container size.

### 1.3 Center & Zoom Source

| Variable | Declaration | Default | Dynamic Update |
|----------|-------------|---------|----------------|
| `MAP_CENTER` | line 23233 | `[39.33, -104.93]` (Douglas County CO) | Updated at lines 24460, 24959, 25211 from `geoConfig` / jurisdiction config |
| `MAP_ZOOM` | line 23234 | `11` | Updated at lines 24464, 24960 from config |

Inside `initMap()` (lines 48195–48202), if `crashState.mapPoints` has valid coordinates, the center is overridden by averaging up to 1000 sample points.

### 1.4 Custom Panes

Created during `initMap()` for layering control:

| Pane | Line | zIndex | Purpose |
|------|------|--------|---------|
| `jurisdictionBoundaryPane` | 48211 | 340 | County/MPO boundary polygons |
| (Mapillary panes) | 48214–48222 | 350–370 | Mapillary coverage, images, signs |

### 1.5 Map Destruction

At line 32642 inside `resetState()`:

```javascript
if (crashMap) { crashMap.remove(); crashMap = null; markerCluster = null; heatLayer = null; }
if (typeof markersLayer !== 'undefined') markersLayer = null;
streetTileLayer = null; satelliteTileLayer = null; currentBaseLayer = 'street';
```

**Phase 3 implication:** Any Supabase viewport layer references must also be nulled in `resetState()`.

---

## 2. Marker Rendering

### 2.1 Data Source: `crashState.mapPoints`

Map markers are rendered from `crashState.mapPoints` — a **separate array** from `crashState.sampleRows`. Both are populated during data loading, but `mapPoints` contains only coordinates + lightweight display fields.

#### mapPoint Object Shape

Built at lines 27434 and 32836:

```javascript
{
    lat: y,                        // float — COL.Y parsed
    lng: x,                        // float — COL.X parsed
    sev: 'K'|'A'|'B'|'C'|'O',    // first char of COL.SEVERITY
    route: '',                     // COL.ROUTE
    node: '',                      // COL.NODE
    date: '',                      // COL.DATE (raw string or timestamp)
    time: '',                      // COL.TIME
    collision: '',                 // COL.COLLISION
    isPed: bool,                   // isYes(COL.PED)
    isBike: bool,                  // isYes(COL.BIKE)
    isInt: bool,                   // isIntersection(row)
    weather: '',                   // COL.WEATHER
    light: '',                     // COL.LIGHT
    isSpeed: bool,                 // isYes(COL.SPEED)
    isYoung: bool,                 // isYes(COL.YOUNG)
    isNight: bool,                 // isYes(COL.NIGHT)
    docNum: ''                     // COL.ID (crash document number)
}
```

#### Population Paths

| # | Line | Context |
|---|------|---------|
| 1 | 27434 | `restoreCrashStateFromCache()` — IndexedDB cache restore |
| 2 | 27535 | Worker-parsed cache path |
| 3 | 32258 | `_pendingMapPoints` from worker (assigned in bulk) |
| 4 | 32499 | `resetState()` — clears to `[]` |
| 5 | 32836 | `processRow()` — main-thread row-by-row parsing |

### 2.2 `createMarker(p)` — Line 48594

Creates an `L.marker` with an `L.divIcon` (colored circle, sized by severity):

```javascript
const colors = { K: '#dc2626', A: '#ea580c', B: '#eab308', C: '#22c55e', O: '#64748b' };
const size = p.sev === 'K' ? 14 : p.sev === 'A' ? 12 : 10;
```

- **Pedestrian** crashes get a cyan border (`#0891b2`)
- **Bicycle** crashes get a green border (`#059669`)
- Marker icon is a `<div>` with border-radius 50% (circle)

### 2.3 Display Modes — `updateMapDisplay()` at Line 48508

Three modes, all reading from `getFilteredMapPoints()`:

| Mode | Lines | Limit | Layer |
|------|-------|-------|-------|
| `heat` | 48549–48561 | No limit | `L.heatLayer` (gradient from green→red) |
| `markers` | 48563–48571 | **3,000** | `markersLayer` (L.layerGroup) |
| `cluster` | 48573–48582 | **50,000** | `markerCluster` (L.markerClusterGroup) |

**Critical:** Limits are applied silently — `Math.min(filtered.length, 3000)` / `Math.min(filtered.length, 50000)`. No user notification when truncation occurs.

### 2.4 MarkerCluster Configuration — Line 48321

```javascript
markerCluster = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 50,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: function(cluster) { ... }
});
```

Custom `iconCreateFunction` creates size classes: `small` (≤20), `medium` (21–100), `large` (>100).

### 2.5 Stats Overlay

`updateMapDisplay()` writes four KPI elements (lines 48522–48525):

| Element ID | Content |
|------------|---------|
| `mapCount` | Total filtered points |
| `mapFatal` | Fatal (K) count |
| `mapSerious` | Serious injury (A) count |
| `mapEPDO` | EPDO score using `EPDO_WEIGHTS` |

Also writes `mapOfTotal` (total vs filtered) and `mapMissingInfo` (missing GPS count) at lines 48528–48541.

---

## 3. Map Events

### 3.1 Existing Event Handlers

| Event | Line | Handler | Purpose |
|-------|------|---------|---------|
| `zoomend` | 48225 | inline | Updates asset panel, loads BTS/Overture layers at zoom thresholds |
| `moveend` | 139179 | `debounceTrafficSignsRefresh` | Refreshes Mapillary traffic signs on pan |
| `moveend` | 139406 | `debounceTrafficSignsRefresh` | Re-added after layer toggle |

### 3.2 NO Existing `moveend` for Crash Data

**There is NO moveend/zoomend handler that reloads crash markers based on viewport.** The current architecture loads ALL crash data for the jurisdiction up front, then filters client-side. This is the fundamental change Phase 3 introduces.

### 3.3 Drawing Tool Integration

`updateMapDisplay()` calls `refreshDrawingSelectionIfActive()` at line 48589 after re-rendering markers. This function (defined at line 51804) re-applies polygon/circle crash selection against the newly filtered markers.

**Phase 3 implication:** After Supabase viewport data arrives and markers are re-rendered, `refreshDrawingSelectionIfActive()` must still be called to keep drawing selections in sync.

---

## 4. Filter System

### 4.1 `currentFilters` Object — Line 30418

```javascript
const currentFilters = {
    startDate: null, endDate: null, route: null, intersection: null,
    district: null,
    severity: ['K', 'A', 'B', 'C', 'O'],
    mapFilters: { fatal: false, serious: false, ped: false, bike: false, intersection: false },
    startTime: null, endTime: null
};
```

### 4.2 `getFilteredMapPoints()` — Line 48383

This is the **sole filter function** for map data. It reads from `crashState.mapPoints` and applies:

| Filter | Source | Lines |
|--------|--------|-------|
| Coordinate bounds | `getMapCoordinateBounds()` | 48391–48395 |
| Year | `#mapYearFilter` dropdown | 48397–48402 |
| Date range | `#mapStartDate` / `#mapEndDate` | 48404–48422 |
| Severity | `currentFilters.severity[]` | 48424–48425 |
| Route/Node | `currentFilters.route` (prefix `route:` or `node:`) | 48427–48437 |
| Quick filters | `currentFilters.mapFilters.*` (AND logic) | 48439–48445 |

### 4.3 UI Elements that Trigger Map Updates

| Element | Line | Event |
|---------|------|-------|
| `#mapYearFilter` select | 5907 | `onchange="updateMapDisplay()"` |
| `#mapStartDate` input | 5911 | `onchange="updateMapDisplay()"` |
| `#mapEndDate` input | 5913 | `onchange="updateMapDisplay()"` |
| Quick filter buttons | 48646 | `toggleMapFilter()` → `updateMapDisplay()` |
| Mode buttons | 48638 | `setMapMode()` → `updateMapDisplay()` |

### 4.4 Phase 3 Filter Implications

In Phase 3, filters need to be passed to the Supabase viewport query so the server returns only matching rows. The `_supabaseMapCrashes()` method in `data-client.js` (line 366) already supports `filters.year` and `filters.severity`. Quick filters (ped, bike, intersection, speed) would need new server-side filter support or post-fetch client-side filtering.

---

## 5. Tier Context and the Map

### 5.1 How Tier Affects the Map Today

When a tier changes (county → region → MPO, etc.), the map is affected through:

1. **Data reload**: `handleTierChange()` (line 20896) triggers CSV re-download for the new tier scope, which repopulates `crashState.mapPoints`
2. **Boundary display**: `showTab('map')` at lines 30645–30678 restores the correct boundary layer based on `jurisdictionContext.viewTier`
3. **Center/Zoom**: `MAP_CENTER` and `MAP_ZOOM` are updated when jurisdiction changes (lines 24959–24960), and `initMap()` reads them

### 5.2 `jurisdictionContext.viewTier` Values

From the tier system: `'federal'`, `'state'`, `'region'`, `'planning_district'`, `'mpo'`, `'county'`, `'city'`

### 5.3 Tier → Supabase Column Mapping

Already implemented in `data-client.js` (line 29):

```javascript
static TIER_COLUMNS = {
    federal:           null,                 // no filter
    state:             'state',
    region:            'dot_district',
    planning_district: 'planning_district',
    mpo:               'mpo_name',
    county:            'physical_juris_name',
    city:              'physical_juris_name',
};
```

### 5.4 Phase 3 Implication

The Supabase viewport query must include both:
- **Bounding box** (from `crashMap.getBounds()`)
- **Tier filter** (from `resolveTier()` → TIER_COLUMNS lookup)

This ensures viewport queries only return crashes within the active jurisdiction, not just the visible map area.

---

## 6. `crashState` Dependencies — What Reads `mapPoints`

### 6.1 Direct Consumers of `crashState.mapPoints`

| Consumer | Line | Access Pattern |
|----------|------|----------------|
| `initMap()` | 48195 | `crashState.mapPoints.length > 0` — center calculation |
| `getFilteredMapPoints()` | 48393 | `crashState.mapPoints.filter(...)` — main filter |
| `updateMapDisplay()` | 48508 | Indirect via `getFilteredMapPoints()` |

### 6.2 What Does NOT Read `mapPoints`

- **Dashboard** (`updateDashboard()`) — reads `crashState.aggregates`
- **Analysis tabs** — read `crashState.aggregates`
- **CMF/Warrants/Grants** — read their own state objects
- **AI tab** — reads `crashState.aggregates` or state-specific crash arrays
- **Hotspots** — reads `crashState.aggregates.byRoute`

### 6.3 Non-Map Code That Touches `markerCluster`

| Location | Lines | Purpose |
|----------|-------|---------|
| District filter highlight | 135731 | `markerCluster.eachLayer(marker => { marker.setOpacity(...) })` |
| District filter clear | 135749 | `markerCluster.eachLayer(marker => { marker.setOpacity(1) })` |

These iterate existing cluster markers to dim/highlight crashes in a selected magisterial district. They read `marker.crashData` — but **`createMarker()` does not set `marker.crashData`** today. This means the district filter via `markerCluster.eachLayer` is currently non-functional for the `crashData[COL.ID]` check, though it would still set opacity on all markers.

### 6.4 Drawing Selection

`selectCrashesInDrawing()` (called from `refreshDrawingSelectionIfActive` at line 51804) works with `getFilteredMapPoints()` output, not `crashState.mapPoints` directly.

### 6.5 Phase 3 Safety

**No non-map feature depends on `crashState.mapPoints`.** Phase 3 can replace the map data source without affecting Dashboard, Analysis, CMF, Warrants, Grants, or AI tabs.

---

## 7. Popup Content

### 7.1 Current Popup Template — Line 48606

The popup is built inside `createMarker(p)` using template literals that read directly from the mapPoint object `p`:

| Field | Source | Notes |
|-------|--------|-------|
| Route name | `p.route` | Formatted by `formatRouteName()` |
| Node ID | `p.node` | Formatted by `formatNodeId()` |
| Severity badge | `p.sev` | CSS class `severity-{K,A,B,C,O}` |
| Ped/Bike icons | `p.isPed`, `p.isBike` | Emoji indicators |
| Doc number | `p.docNum` | Crash document ID |
| Date | `p.date` | Raw string |
| Time | `p.time` | Formatted by `fmtTime()` |
| Collision type | `p.collision` | Truncated to 35 chars |
| Weather | `p.weather` | Truncated to 25 chars |
| Light | `p.light` | Truncated to 25 chars |

### 7.2 Popup Action Buttons

| Button | Lines | Action |
|--------|-------|--------|
| 💡 CMF | 48620 | `viewLocationCMF(p.route)` |
| 🛣️ Street View | 48624 | `openStreetView(p.lat, p.lng)` |
| 📋 Crossing Eval | 48628 | `openCrossingEvalModal()` — only shown for ped crashes |

### 7.3 Phase 3 Popup Implications

The Supabase `_supabaseMapCrashes()` method (line 396) selects only:
```
objectid, x, y, crash_severity, crash_year, collision_type, rte_name, intersection_name
```

This is **insufficient** for the current popup. Missing fields:
- `date` / `time` (COL.DATE, COL.TIME)
- `weather` / `light` (COL.WEATHER, COL.LIGHT)
- `isPed` / `isBike` / `isInt` flags
- `docNum` (COL.ID)
- `isSpeed` / `isYoung` / `isNight`

**Two options:**
1. **Expand the SELECT** to include all popup fields (increases payload ~2x)
2. **Lazy-fetch on popup open** — use `getCrashDetail(objectid)` when the user clicks a marker (adds latency per click)

Recommended: **Option 1** (expand SELECT) for the core fields (date, time, ped, bike, docNum), with lazy-fetch for rarely-shown fields.

---

## 8. Leaflet Plugins

### 8.1 Loaded Plugins

| Plugin | Version | CDN Line | Purpose |
|--------|---------|----------|---------|
| Leaflet | 1.9.4 | (head) | Core map library |
| MarkerCluster | 1.5.3 | 56–58 | Clustering with `chunkedLoading` |
| Leaflet.heat | 0.2.0 | 59 | Heatmap mode |
| Leaflet.draw | — | **NOT loaded** | Drawing uses custom implementation |

### 8.2 Drawing Tools

There is **no L.draw or Leaflet.pm/Geoman** plugin. The drawing system (polygon, circle, measure) is a **custom implementation** using direct Leaflet event handlers. Key functions:
- `refreshDrawingSelectionIfActive()` at line 51804
- `selectCrashesInDrawing()` — evaluates point-in-polygon/circle
- `isPointInPolygon()` at line 51825

### 8.3 Phase 3 Plugin Implications

- **MarkerCluster 1.5.3** supports `chunkedLoading: true` — compatible with incremental add from Supabase responses
- **L.heatLayer** accepts a simple `[lat, lng, intensity]` array — can be rebuilt from Supabase rows
- No plugin conflicts expected for Phase 3

---

## 9. Choropleth / Thematic Layers

### 9.1 Current State: No Choropleth Exists

A grep for `choropleth`, `fillColor.*feature`, and `L.choropleth` returned **zero matches**. There is no existing choropleth or thematic coloring of geographic boundaries by crash data.

### 9.2 Existing Boundary Layers

Boundaries are displayed as simple polygons (not data-driven):
- **County boundary** — loaded from TIGERweb on county tier
- **MPO boundary** — loaded from BoundaryService on MPO tier
- **Region boundary** — loaded on region tier

### 9.3 Phase 3+ Choropleth Opportunity

Supabase `dashboard_summary` matview could power a choropleth at higher tiers (state/region/MPO). At state tier, color counties by crash rate; at region tier, color sub-counties. This is a Phase 4+ feature — not needed for Phase 3 viewport queries.

---

## 10. Gotchas & Red Flags

### 🔴 Red Flag 1: Silent Marker Truncation

**Lines 48565, 48575** — Markers mode caps at 3,000, cluster mode at 50,000. No user warning is shown when data exceeds these limits. At state/region tier, crash counts easily exceed 50K.

**Impact on Phase 3:** Supabase viewport queries with `mapLimit: 5000` (data-client.js line 23) would show only 5K dots for a viewport that may contain 100K+ crashes. Must either:
- Increase limit at lower zoom levels
- Switch to aggregate/heatmap at high zoom out
- Show a "zoomed out too far" warning

### 🔴 Red Flag 2: Popup Field Mismatch

As detailed in Section 7.3, the Supabase `_supabaseMapCrashes()` SELECT clause returns 8 columns but the popup template reads 14+ fields. Deploying Phase 3 without expanding the SELECT will produce popups with `undefined` values.

### 🟡 Warning 1: `marker.crashData` Never Set

`createMarker(p)` at line 48594 does NOT set `marker.crashData = p`. The district filter at lines 135731–135749 reads `marker.crashData[COL.ID]` which would be `undefined`. This is a **pre-existing bug** unrelated to Phase 3, but Phase 3 should fix it if we want district filtering to work.

### 🟡 Warning 2: No `moveend` Debounce Infrastructure

There is no existing debounce utility for crash-data map events. The Mapillary `debounceTrafficSignsRefresh` is a one-off. Phase 3 needs its own debounce (300–500ms recommended) to avoid hammering Supabase on rapid pans.

### 🟡 Warning 3: `resetState()` Must Clear Supabase State

Line 32642 destroys the map. Any Phase 3 state (pending fetch abort controllers, cached viewport data, event listeners) must be cleaned up here.

### 🟡 Warning 4: Drawing Selection Sync

`refreshDrawingSelectionIfActive()` is called at the end of `updateMapDisplay()`. If Phase 3 replaces the synchronous filter→render with an async fetch→render, this call must be deferred to after markers are actually added to the map.

### 🟢 Note 1: `initMap()` Center Override

`initMap()` overrides `MAP_CENTER` from the first 1000 mapPoints (line 48198). If Phase 3 loads map data lazily (after `initMap`), the center will use the config default instead of data-derived center. This is likely fine since jurisdiction config already provides accurate centers.

### 🟢 Note 2: Heat Mode Has No Limit

Heat mode at line 48549 maps ALL `filtered` points without a cap. For Supabase viewport queries, this means heatmap will be limited by the query's `LIMIT` parameter, not by a client-side cap.

---

## Ready-to-Wire Checklist

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1 | `crashMap` singleton accessible globally | ✅ Ready | `window` scope at line 30428 |
| 2 | `crashMap.getBounds()` available for viewport | ✅ Ready | Standard Leaflet API, works after `initMap()` |
| 3 | `data-client.js` has `getMapCrashes(bounds, filters, limit)` | ✅ Ready | Line 205 — already implemented |
| 4 | `_supabaseMapCrashes()` filters by bbox + tier | ✅ Ready | Lines 366–401 — uses x/y range + `and` param |
| 5 | `resolveTier()` maps context to tier/value | ✅ Ready | Bridge at lines 33–43, data-client TIER_COLUMNS at line 29 |
| 6 | MarkerCluster supports incremental add | ✅ Ready | `addLayer()` / `addLayers()` supported by 1.5.3 |
| 7 | Supabase SELECT includes all popup fields | ❌ Needs fix | Line 397 — only 8 columns, popup needs 14+ (see Section 7.3) |
| 8 | `moveend`/`zoomend` debounce for crash data | ❌ Needs build | No existing handler — must create with 300–500ms debounce |
| 9 | Viewport query includes tier filter | ❌ Needs wire | `_supabaseMapCrashes` filters by state only, not by active tier |
| 10 | `marker.crashData` set for district filter compat | ❌ Needs fix | `createMarker()` doesn't set it (pre-existing bug) |
| 11 | `resetState()` cleans up Phase 3 state | ❌ Needs wire | Line 32642 — must add abort controller + state cleanup |
| 12 | `updateMapDisplay()` async-aware | ❌ Needs refactor | Currently synchronous — needs async fetch + render pipeline |
| 13 | Drawing selection works with async render | ❌ Needs wire | `refreshDrawingSelectionIfActive()` must fire after async render |
| 14 | Zoom-aware strategy (dots vs heat vs aggregate) | ❌ Needs design | No existing zoom→mode switching logic |
| 15 | `crashes` table has required columns | ⚠️ Verify | Confirm `x`, `y`, `crash_severity`, `rte_name`, etc. exist |
| 16 | Map overlay stats update after Supabase fetch | ✅ Ready | `updateMapDisplay()` already computes stats from filtered points |

**Summary:** 5 items ✅ ready, 1 ⚠️ needs verification, 8 items ❌ need building. The ❌ items are all Phase 3 implementation work — no blockers from the existing codebase architecture.

---

## Appendix: Key Line Number Reference

| Item | Line | File |
|------|------|------|
| `crashMap` declaration | 30428 | index.html |
| `currentFilters` | 30418 | index.html |
| `showTab()` | 30602 | index.html |
| Map tab branch | 30627 | index.html |
| `MAP_CENTER` / `MAP_ZOOM` | 23233–23234 | index.html |
| `resetState()` map destruction | 32642 | index.html |
| `mapPoints.push` (processRow) | 32836 | index.html |
| `mapPoints.push` (cache restore) | 27434 | index.html |
| `initMap()` | 48188 | index.html |
| `L.map()` creation | 48205 | index.html |
| `zoomend` handler | 48225 | index.html |
| MarkerCluster init | 48321 | index.html |
| `getFilteredMapPoints()` | 48383 | index.html |
| `updateMapDisplay()` | 48508 | index.html |
| `createMarker(p)` | 48594 | index.html |
| `refreshDrawingSelectionIfActive()` | 51804 | index.html |
| `markerCluster.eachLayer` (district) | 135731, 135749 | index.html |
| `moveend` (Mapillary only) | 139179, 139406 | index.html |
| `getMapCrashes()` | 205 | data-client.js |
| `_supabaseMapCrashes()` | 366 | data-client.js |
| `TIER_COLUMNS` | 29 | data-client.js |
| `mapLimit` default | 23 | data-client.js |
