# Phase 2: Dashboard Rendering Analysis

> Generated 2026-04-20 — maps every function, element ID, and data path that powers the CrashLens Dashboard tab so a `supabase-bridge.js` module can inject pre-fetched Supabase data.

---

## 1. Dashboard Card Functions

### 1.1 Central Function: `updateDashboard()` — line 46421

The single entry point for all dashboard rendering. Called from:

| Caller | Line | Trigger |
|--------|------|---------|
| `showTab('dashboard')` | 30611 | User clicks Dashboard tab (gated by `crashState.loaded`) |
| `applyFilters()` | 46178 | User changes any filter control |
| `resetFilters()` | 46196 | User clears all filters |
| `recalculateAllEPDO()` | 20733 | EPDO weight preset changes |

**Data source:** Calls `getFilteredStats()` (line 46237) which returns `{ agg, total, stats, filtered }`. When no filters are active, `agg` is `crashState.aggregates` directly (O(1) passthrough). When filters are active, it iterates `crashState.sampleRows` to build a filtered copy.

### 1.2 Primary KPI Cards (lines 46440–46500)

| Element ID | Data Read | Line |
|------------|-----------|------|
| `kpiTotal` | `total` (filtered crash count) | 46440 |
| `kpiFatal` | `agg.bySeverity.K` | 46441 |
| `kpiFatalPct` | `pct(sev.K, total)` | 46442 |
| `kpiInjuryA` | `agg.bySeverity.A` | 46443 |
| `kpiAPct` | `pct(sev.A, total)` | 46444 |
| `kpiInjuryBC` | `agg.bySeverity.B + agg.bySeverity.C` | 46445 |
| `kpiPDO` | `agg.bySeverity.O` | 46446 |
| `kpiEPDO` | `calcEPDO(sev)` using EPDO_WEIGHTS | 46456 |
| `kpiYearRange` | `filteredYears[0]–filteredYears[last]` | 46457 |
| `kpiEPDOAvg` | `Math.round(epdo / numYears)` | 46458 |
| `kpiKA` | `sev.K + sev.A` | 46484 |
| `kpiKAPct` | `pct(kaTotal, total)` | 46485 |
| `kpiVRU` | `agg.ped.total + agg.bike.total` | 46489 |
| `kpiVRUPct` | `pct(vruTotal, total)` | 46490 |
| `kpiSpeed` | `agg.speed?.total` | 46494 |
| `kpiSpeedPct` | `pct(speedTotal, total)` | 46495 |
| `kpiNighttime` | `agg.nighttime?.total` | 46499 |
| `kpiNighttimePct` | `pct(nighttimeTotal, total)` | 46500 |

### 1.3 EPDO Breakdown Cards (lines 46461–46481)

| Element ID | Data Read | Line |
|------------|-----------|------|
| `epdoK` / `epdoA` / `epdoB` / `epdoC` / `epdoO` | `sev.X * EPDO_WEIGHTS.X` | 46461–46465 |
| `epdoKPct` … `epdoOPct` | `pct(epdoX, epdo)` | 46467–46471 |
| `epdoKBar` … `epdoOBar` | `.style.width` set to percentage | 46473–46477 |
| `epdoAnnual` | `Math.round(epdo / numYears)` | 46479 |
| `epdoPer100` | `(epdo / total * 100).toFixed(1)` | 46480 |

### 1.4 Conditional Cards (lines 46503–46522)

| Element ID | Data Read | Condition | Line |
|------------|-----------|-----------|------|
| `kpiPersonsInjuredCard` | container visibility | `agg.personsInjured > 0` | 46504 |
| `kpiPersonsInjured` | `agg.personsInjured` | | 46507 |
| `kpiPersonsInjuredSub` | `agg.personsInjured / total` | | 46509 |
| `kpiVehicleCountCard` | container visibility | `agg.vehicleCount?.total > 0` | 46515 |
| `kpiAvgVehicles` | `agg.vehicleCount.sum / agg.vehicleCount.total` | | 46519 |
| `kpiVehicleCountSub` | `agg.vehicleCount.sum` | | 46520 |

### 1.5 YoY Trend Indicators (lines 46671–46715)

| Element ID | Data Read | Line |
|------------|-----------|------|
| `kpiTotalTrend` | last year total vs prior year total | 46671 |
| `kpiFatalTrend` | `lastData.K` vs `prevData.K` | 46674 |
| `kpiATrend` | `lastData.A` vs `prevData.A` | 46677 |
| `kpiKATrend` | `lastData.K+A` vs `prevData.K+A` | 46682 |
| `kpiVRUTrend` | `lastData.ped+bike` vs `prevData.ped+bike` | 46687 |
| `kpiSpeedTrend` | `lastData.speed` vs `prevData.speed` | 46692 |
| `kpiNighttimeTrend` | `lastData.nighttime` vs `prevData.nighttime` | 46697 |

### 1.6 Dashboard Tables (lines 46718–46751)

| Element ID | Data Read | Line |
|------------|-----------|------|
| `dashYearlyBody` | `agg.byYear` — per-year K/A/B/C/O/EPDO/ped/bike with YoY% | 46721–46741 |
| `funcClassBody` | `agg.byFuncClass` — sorted by total, shows total/K/A/EPDO/% | 46746–46751 |

### 1.7 `updateCharts(filteredAgg, filteredTotal)` — line 46763

Called at the end of `updateDashboard()`. Reads from `agg` (fallback: `crashState.aggregates`).

| Chart Canvas ID | Data Source |
|-----------------|-------------|
| `chartYoY` | `agg.byYear` — year-over-year change bars |
| `chartKAYear` | `agg.byYear[y].K` and `.A` — K+A line chart |
| `chartDOW` | `agg.byDOW` — day of week |
| `chartMonth` | `agg.byMonth` — monthly distribution |
| `chartFuncClass` | `agg.byFuncClass` — functional class breakdown |
| `chartCollision` | `agg.byCollision` — collision types |
| `chartWeather` + `legendWeather` | `agg.byWeather` — weather doughnut |
| `chartLight` + `legendLight` | `agg.byLight` — light condition doughnut |

### 1.8 `updateDashboardTierSections()` — line 47647

| Element ID | Purpose |
|------------|---------|
| `districtMatrixWidget` | Show/hide based on `jurisdictionContext.viewTier` |
| `regionComparisonContainer` | Region comparison panel |
| `mpoComparisonContainer` | MPO comparison panel |
| `countyComparisonContainer` | County comparison panel |
| `tierBreadcrumb` | Navigation breadcrumb |
| `tierScopeHeader` / `tierScopeTitle` / `tierScopeSubtitle` / `tierScopeBadge` | Scope display |

### 1.9 Other Dashboard Functions

| Function | Line | Purpose |
|----------|------|---------|
| `initDashboardSearch()` | 47874 | Populates year dropdown, initializes crash search |
| `generateExplorationDashboard()` | 65745 | Separate deep-dive/exploration dashboard |
| `generateDashboardReport()` | 71961 | PDF report generation from dashboard data |
| `renderPredictionDashboard()` | 146580 | Predictive analytics dashboard (separate tab) |

---

## 2. Dashboard HTML Element IDs — Complete List

### 2.1 KPI Grid Container
- `dashboardKPIs` — `<div class="kpi-grid">` wrapping all KPI cards

### 2.2 KPI Value + Sub Elements (39 total)

**Core counts:** `kpiTotal`, `kpiFatal`, `kpiFatalPct`, `kpiInjuryA`, `kpiAPct`, `kpiInjuryBC`, `kpiPDO`

**EPDO:** `kpiEPDO`, `kpiYearRange`, `kpiEPDOAvg`

**Combined metrics:** `kpiKA`, `kpiKAPct`, `kpiVRU`, `kpiVRUPct`, `kpiSpeed`, `kpiSpeedPct`, `kpiNighttime`, `kpiNighttimePct`

**EPDO breakdown:** `epdoK`, `epdoA`, `epdoB`, `epdoC`, `epdoO`, `epdoKPct`, `epdoAPct`, `epdoBPct`, `epdoCPct`, `epdoOPct`, `epdoKBar`, `epdoABar`, `epdoBBar`, `epdoCBar`, `epdoOBar`, `epdoAnnual`, `epdoPer100`

**Conditional:** `kpiPersonsInjuredCard`, `kpiPersonsInjured`, `kpiPersonsInjuredSub`, `kpiVehicleCountCard`, `kpiAvgVehicles`, `kpiVehicleCountSub`

**Trend arrows:** `kpiTotalTrend`, `kpiFatalTrend`, `kpiATrend`, `kpiKATrend`, `kpiVRUTrend`, `kpiSpeedTrend`, `kpiNighttimeTrend`

### 2.3 Table Bodies
- `dashYearlyBody` — yearly breakdown table
- `funcClassBody` — functional classification table

### 2.4 Chart Canvases
- `chartYoY`, `chartKAYear`, `chartDOW`, `chartMonth`, `chartFuncClass`, `chartCollision`, `chartWeather`, `chartLight`
- `legendWeather`, `legendLight`

### 2.5 Tier Section Containers
- `districtMatrixWidget`, `regionComparisonContainer`, `mpoComparisonContainer`, `countyComparisonContainer`
- `tierBreadcrumb`, `tierScopeHeader`, `tierScopeTitle`, `tierScopeSubtitle`, `tierScopeBadge`

### 2.6 KPI Card CSS Classes
`total`, `fatal`, `injury-a`, `injury-bc`, `pdo`, `epdo epdo-card`, `ka-combined`, `vru`, `speed-related`, `nighttime`

---

## 3. Data Flow — Step-by-Step

### 3.1 Load → Aggregates → Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  DATA LOAD (3 paths)                                            │
│                                                                 │
│  A. CSV Upload → Papa.parse chunks → processRow() mutates       │
│     crashState.aggregates in-place                              │
│                                                                 │
│  B. Auto-load Worker → Worker builds aggregates in web worker   │
│     → posts msg.aggregates → assigned wholesale:                │
│     crashState.aggregates = msg.aggregates  (line 32120)        │
│                                                                 │
│  C. IndexedDB Cache → crashState.aggregates = cached.aggregates │
│     (line 27141)                                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  crashState.loaded = true                                       │
│  crashState.totalRows = N                                       │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  finalizeData()  (line 32711)                                   │
│  • crashState.years = Object.keys(agg.byYear).sort()            │
│  • crashState.routes = Object.keys(agg.byRoute).sort()          │
│  • crashState.nodes = Object.keys(agg.byNode).sort()            │
│  • grantState.baselines = calculateCountyBaselines(...)         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  _onUploadComplete() / _onAutoLoadComplete()                    │
│  • detectDeepDiveColumns()                                      │
│  • updateDataConnectionStatus('connected')                      │
│  • applyStateAdapterConfig()                                    │
│  • applyAutoDetectedJurisdiction()                              │
│  • setTimeout(500ms):                                           │
│    - showUploadSummary()                                        │
│    - initDropdowns()                                            │
│    - resetFilterUI()                                            │
│    - showTab('dashboard')  ← KEY TRIGGER                        │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  showTab('dashboard')  (line 30468)                             │
│  if (tabId === 'dashboard' && crashState.loaded)                │
│    → updateDashboard()  (line 30611)                            │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  updateDashboard()  (line 46421)                                │
│  1. getFilteredStats() → { agg, total, stats, filtered }       │
│  2. Write 39+ KPI elements via getElementById().textContent     │
│  3. Build yearly & funcClass tables                             │
│  4. Compute YoY trend arrows                                   │
│  5. updateCharts(agg) — 8 Chart.js canvases                    │
│  6. updateDashboardTierSections()                               │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 `crashState.aggregates` Shape (from `resetState()` line 32334, aggregates assignment at line 32338)

```javascript
crashState.aggregates = {
    byYear: {},         // { 2020: { total, K, A, B, C, O, ped, bike, speed, nighttime } }
    bySeverity: { K: 0, A: 0, B: 0, C: 0, O: 0 },
    byCollision: {},    // { "Rear End": N, ... }
    byWeather: {},      // { "Clear": N, ... }
    byLight: {},        // { "Daylight": N, ... }
    byRoute: {},        // { "US 29": N, ... }
    byNode: {},         // { "12345": Set([docNbrs]) }
    byHour: {},         // { 0: N, 1: N, ... 23: N }
    byDOW: {},          // { 0: N (Sun), ... 6: N (Sat) }
    byMonth: {},        // { 1: N, ... 12: N }
    byFuncClass: {},    // { "Principal Arterial": { total, K, A, B, C, O } }
    byIntType: {},
    byTrafficCtrl: {},
    ped:       { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, byYear: {}, byLight: {}, byRoute: {} },
    bike:      { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, byYear: {}, byLight: {}, byRoute: {} },
    speed:     { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, byYear: {} },
    nighttime: { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0, byYear: {} },
    intersection:    { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 },
    nonIntersection: { total: 0, K: 0, A: 0, B: 0, C: 0, O: 0 },
    personsInjured: 0,
    vehicleCount: {
        total: 0, sum: 0,
        bySeverity: {
            K: { count: 0, sum: 0 }, A: { count: 0, sum: 0 },
            B: { count: 0, sum: 0 }, C: { count: 0, sum: 0 },
            O: { count: 0, sum: 0 }
        }
    },
    pedCasualties: { killed: 0, injured: 0, byYear: {} }
};
```

### 3.3 `getFilteredStats()` (line 46237)

```javascript
function getFilteredStats() {
    const hasFilters = /* checks startDate, endDate, route, intersection, district, severity */;
    if (!hasFilters) {
        return {
            agg: crashState.aggregates,       // O(1) passthrough
            total: crashState.totalRows,
            stats: crashState.aggregates.bySeverity,
            filtered: false
        };
    }
    // ... iterate sampleRows, build filtered agg, return { agg, total, stats, filtered: true }
}
```

---

## 4. Tab Switching

### 4.1 HTML Structure

```html
<li class="sidebar-nav-item" data-tab="dashboard" onclick="navigateTo('dashboard')">
```

### 4.2 Call Chain

```
onclick="navigateTo('dashboard')"        (line 4628)
  → navigateTo(tabId)                    (line 30705)
    → showTab(tabId)                     (line 30468)
      → hides all .tab-content, shows #tab-dashboard
      → updates sidebar active state
      → if (tabId === 'dashboard' && crashState.loaded)
          → updateDashboard()            (line 30611)
```

### 4.3 `navigateTo()` — line 30705

```javascript
function navigateTo(tabId) {
    showTab(tabId);
    // Close mobile sidebar if open
    if (window.innerWidth <= 1024 && sidebar.classList.contains('open'))
        toggleMobileSidebar();
}
window._mainNavigateTo = navigateTo;
```

### 4.4 `showTab()` Dashboard Branch — line 30610

```javascript
if (tabId === 'dashboard' && crashState.loaded) {
    updateDashboard();
    // + district-level stats if applicable
}
```

---

## 5. Integration Points for `supabase-bridge.js`

### 5.1 Existing Supabase Client

`assets/js/data-client.js` already contains `CrashLensDataClient` with:
- Supabase REST API at `https://srv1503081.hstgr.cloud/rest/v1`
- Hardcoded anon key (JWT, expires 2036)
- Methods: `getSummary()`, `getCrashes()`, `getMapCrashes()`, `getBaselines()`, `getStates()`
- Tables: `crashes`, `dashboard_summary`, `jurisdiction_baselines`, `states`
- R2 fallback: `https://data.aicreatesai.com`

### 5.2 Strategy: Fast Supabase Pre-Load

A `supabase-bridge.js` module should:

1. **Register on `app/modules/loader.js` namespace** as `CL.data.supabaseBridge`

2. **Call `dashboard_summary` via Supabase REST** before R2/CSV finishes loading. This table likely contains pre-aggregated data matching the `crashState.aggregates` shape.

3. **Populate `crashState.aggregates` directly** with the Supabase response, matching the exact shape from `resetState()` (Section 3.2 above).

4. **Set `crashState.loaded = true`** and call `finalizeData()` + `showTab('dashboard')` — this triggers the entire dashboard rendering pipeline with zero code changes to `updateDashboard()`.

5. **When R2/CSV finishes later**, overwrite `crashState.aggregates` with the full-resolution data and call `updateDashboard()` again for any corrections.

### 5.3 Key Insertion Points

| What | Where | Line |
|------|-------|------|
| Import bridge module | `<script>` tag after `loader.js` | After module scripts |
| Call bridge on page load | Inside `DOMContentLoaded` or `init()` | Before auto-load starts |
| Set aggregates from Supabase | `crashState.aggregates = bridgeResult` | Same pattern as line 32120 |
| Set loaded flag | `crashState.loaded = true` | Same pattern as line 32124 |
| Trigger dashboard | `finalizeData(); showTab('dashboard')` | Same pattern as `_onAutoLoadComplete()` |
| Handle R2 completion | Normal `_onAutoLoadComplete()` path | Calls `updateDashboard()` again |

### 5.4 Function Reuse — No Changes Needed

These functions work unchanged with Supabase-sourced data:

| Function | Why it works |
|----------|-------------|
| `updateDashboard()` | Reads from `crashState.aggregates` shape — source-agnostic |
| `getFilteredStats()` | Returns `crashState.aggregates` when no filters (O(1)) |
| `updateCharts()` | Reads same `agg` object |
| `finalizeData()` | Extracts `years`, `routes`, `nodes` from aggregates |
| `showTab()` | Just checks `crashState.loaded` boolean |

**The only thing filters need** is `crashState.sampleRows` — if those aren't loaded yet from R2, the bridge should either disable filter controls or show a "filters loading…" state until R2 data arrives.

### 5.5 Recommended Module Skeleton

```javascript
// app/modules/data/supabase-bridge.js
window.CL = window.CL || {};
CL.data = CL.data || {};

CL.data.supabaseBridge = {
    SUPABASE_URL: 'https://srv1503081.hstgr.cloud/rest/v1',
    SUPABASE_KEY: '/* existing anon key from data-client.js */',

    async fetchDashboardSummary(jurisdictionId) {
        const resp = await fetch(
            `${this.SUPABASE_URL}/dashboard_summary?jurisdiction_id=eq.${jurisdictionId}`,
            { headers: { apikey: this.SUPABASE_KEY, Authorization: `Bearer ${this.SUPABASE_KEY}` } }
        );
        const data = await resp.json();
        return this.transformToAggregates(data);
    },

    transformToAggregates(supabaseData) {
        // Map Supabase response → crashState.aggregates shape
        // Must produce: bySeverity, byYear, byCollision, byWeather, byLight,
        //   byHour, byDOW, byMonth, byFuncClass, ped, bike, speed, nighttime,
        //   personsInjured, vehicleCount
    },

    async injectFast() {
        const agg = await this.fetchDashboardSummary(currentJurisdictionId);
        crashState.aggregates = agg;
        crashState.totalRows = agg.bySeverity.K + agg.bySeverity.A +
                               agg.bySeverity.B + agg.bySeverity.C + agg.bySeverity.O;
        crashState.loaded = true;
        finalizeData();
        showTab('dashboard');
        console.log('[SupabaseBridge] Dashboard rendered from Supabase in <1s');
    }
};

CL._registerModule('data/supabase-bridge');
```

---

## 6. Module Structure Reference

### 6.1 `app/modules/` Directory Tree

```
app/modules/
├── loader.js                          ← Namespace init (CL.*)
├── ai/
│   └── context.js
├── analysis/
│   ├── baselines.js
│   ├── crash-profile.js
│   └── hotspots.js
├── batch-ba/
│   ├── batch-ba-charts.js
│   ├── batch-ba-duration.js
│   ├── batch-ba-engine.js
│   ├── batch-ba-export-csv.js
│   ├── batch-ba-export-kml.js
│   ├── batch-ba-export-pdf-details.js
│   ├── batch-ba-export-pdf.js
│   ├── batch-ba-results.js
│   ├── batch-ba-state.js
│   └── batch-ba-upload.js
├── core/
│   ├── constants.js                   ← COL mappings, EPDO weights
│   └── epdo.js                        ← calcEPDO(), getStateEPDOWeights()
├── grants/
│   └── ranking.js
├── upload/
│   ├── api-connector.js
│   ├── road-defaults.js
│   ├── upload-pipeline.js
│   └── upload-tab.js
├── utils/
│   └── date-utils.js
├── warrants/
│   └── signal.js
└── worker/
    ├── csv-worker.js
    └── sample-rows-loader.js
```

### 6.2 `assets/js/` Files

```
assets/js/
├── auth.js
├── data-client.js                     ← CrashLensDataClient (Supabase + R2)
├── firebase-config.js
├── firebase-config.example.js
├── landing.js
└── three-scene.js
```

### 6.3 Other App JS

```
app/geocode-engine.js                  ← GPS coordinate recovery engine
```
