# Phase 4: Table & Pagination Analysis

> **Generated**: 2026-04-22  
> **Codebase**: Federal (`app/index.html` ~151K lines)  
> **Purpose**: Map every crash-data table to understand how to replace in-memory `sampleRows` filtering with paginated Supabase queries

---

## 1. Tab-by-Tab Analysis

### 1.1 Dashboard Search (Crash Explorer)

| Property | Value |
|----------|-------|
| State object | `dashSearchResults` (array), `dashCurrentSearchPage` (int) |
| Table element ID | `dashSearchTable` → `<tbody id="dashSearchBody">` |
| Pagination element | `dashSearchPagination` |
| Data source | `crashState.sampleRows` (full copy on init, filtered on search) |
| Filter logic | Text search across `[COL.ID, COL.ROUTE, COL.COLLISION, COL.WEATHER, COL.NODE]`, year dropdown, severity dropdown, ped/bike toggle |
| Init function | `initDashboardSearch()` at line **48013** |
| Search function | `dashSearchCrashes()` at line **48030** — filters `crashState.sampleRows` |
| Clear function | `dashClearSearch()` at line **48061** — resets to `[...crashState.sampleRows]` |
| Render function | `dashRenderSearchResults()` at line **48071** — slices page from results |
| Pagination render | `dashRenderSearchPagination()` at line **48105** — custom « ‹ 1 2 3 › » controls |
| Page nav | `dashGoSearchPage(p)` at line **48124** |
| Export | `dashExportSearchCSV()` at line **48126** — exports ALL results |
| Page size | `PAGE_SIZE = 100` (line **30431**) |
| Columns | Date, Doc #, Time, Sev, Road Name, Node, Collision Type, Weather, Light, Flags (ped/bike/alcohol/speed/hitrun), Action (CMF button) |
| Existing pagination | ✅ Yes — custom client-side pagination with `PAGE_SIZE = 100` |
| Row count | Typically entire jurisdiction (2K–570K rows) |
| HTML location | Lines **5879–5885** |
| Scrollable container | Yes — `max-height:420px;overflow-y:auto` wrapper |

### 1.2 Analysis Tab Search

| Property | Value |
|----------|-------|
| State object | `analysisSearchResults` (array), `analysisCurrentSearchPage` (int) |
| Table element ID | `analysisSearchBody` |
| Pagination element | `analysisSearchPagination` |
| Data source | `crashState.sampleRows` (full copy on init, filtered on search) |
| Filter logic | Text search, year dropdown, severity dropdown, ped/bike toggle |
| Search function | `analysisSearchCrashes()` at line **65356** — filters `crashState.sampleRows` |
| Render function | `analysisRenderSearchResults()` at line **65388** — slices page from results |
| Page size | `PAGE_SIZE = 100` (shared constant) |
| Columns | Date, Time, Sev, Road, Node, Collision, Weather, Light, Flags, Actions (CMF + Map) |
| Existing pagination | ✅ Yes — same pattern as Dashboard Search |
| Row count | Entire jurisdiction |
| Quick location filter | `analysisQuickLocationFilter()` at line **65248** — searches `quickLocationData` |

### 1.3 CMF Tab

| Property | Value |
|----------|-------|
| State object | `cmfState` (line **79833**) |
| Key properties | `database[]`, `loaded`, `selectedLocation`, `locationCrashes[]`, `filteredCrashes[]`, `recommendations[]`, `aiRecommendations[]`, `crashProfile{}`, `mode`, `roadProperties[]`, `shortlist[]`, `dateFilter{startDate, endDate, preset}` |
| Table element ID | **None** — CMF tab displays KPI cards + crash profile charts, NOT a crash row table |
| Data source | `crashState.sampleRows.filter(row => type === 'route' ? row[COL.ROUTE] === name : row[COL.NODE] === name)` |
| Filter logic | Route OR node exact match → `cmfState.locationCrashes`, then date filter → `cmfState.filteredCrashes` |
| Selection function | `selectCMFLocation(type, value)` at line **85418** |
| Date filter | `filterCMFCrashesByDate()` at line **84694** |
| Profile builder | `buildCMFCrashProfile()` at line **85761** — delegates to `CL.analysis.crashProfile` |
| Display function | `displayCrashProfile()` at line **85765** — renders KPI cards, collision types, contributing factors |
| Existing pagination | ❌ None — displays aggregate profile, not individual crash rows |
| Row count | Typically 50–2,000 per location |
| sampleRows lines | **85608**, **85615** (two paths: async worker vs sync) |

### 1.4 Warrants Tab

| Property | Value |
|----------|-------|
| State object | `warrantsState` (line **26281**) |
| Key properties | `loaded`, `currentStudy` ('signal'/'stopsign'/'roundabout'/'pedestrian'/'speedstudy'), `selectedLocation`, `locationType`, `locationCrashes[]`, `filteredCrashes[]`, `crashProfile`, `roadProperties{}`, `polygonCentroid`, `geocodedLocation`, `formData{}`, `signal{}` (multi-day TMC data), `dateFilter{}` |
| Table element ID | **None** — Warrants displays crash profile KPIs + signal warrant form, NOT a crash row table |
| Data source | `crashState.sampleRows.filter(...)` in `loadLocationForWarrants()` |
| Filter logic | Route OR node exact match → `warrantsState.locationCrashes`, then date filter → `warrantsState.filteredCrashes` |
| Selection function | `loadLocationForWarrants()` at line **105516** (also at **105575**) |
| Data loading | `loadLocationDataForWarrants()` at line **105599** — stores crashes, builds profile, auto-sets MUTCD 12-month period |
| Date filter | `filterWarrantCrashesByDate()` (similar to CMF pattern) |
| Profile builder | `buildWarrantCrashProfile()` — builds `warrantsState.crashProfile` |
| Existing pagination | ❌ None — aggregate analysis only |
| Row count | Typically 50–500 per intersection |
| sampleRows lines | **105516**, **105575** |

### 1.5 Hotspots Tab

| Property | Value |
|----------|-------|
| State object | `paginationState.hotspots` (part of shared pagination system) |
| Table element ID | `hotspotTable` → `<tbody id="hotspotBody">` |
| Pagination element | `hotspotPagination` |
| Data source | `crashState.aggregates.byRoute` / `byNode` → scored by `CL.analysis.hotspots.scoreAndRank()` |
| Filter logic | Reads pre-computed aggregates (NOT sampleRows), applies date filter, groups by route or node |
| Render function | `renderHotspots()` at line **58135** — uses `getPaginatedData('hotspots')` |
| Page nav | `goToHotspotPage(tableKey, page)` at line **58194** |
| Detail panel | `renderHotspotDetailContent()` at line **56918** — KPI cards, charts, benchmarks |
| Existing pagination | ✅ Yes — uses shared `paginationState` system with `getPaginatedData()` and `renderPaginationControls()` |
| Page size | Default 50, selectable 25/50/100/200/All |
| Columns | Checkbox, Rank, Location, [County], Total, K, A, B, C, O, EPDO, Per Year, Top Type, Actions (Details/Map/MUTCD/StreetView) |
| Row count | All locations in jurisdiction (100–5,000+) |
| HTML location | Lines **6257–6262** |
| Scrollable container | Yes — `max-height:480px;overflow-y:auto` wrapper |

### 1.6 Grants Tab

| Property | Value |
|----------|-------|
| State object | `grantState` (line **26081+**) |
| Key properties | `loaded`, `csvLoaded`, `opportunities`, `dateRange{startDate, endDate}`, `aggregationLevel` ('intersection'/'route'/'both'), `minCrashThreshold` (default 3), `rankedLocations`, `allRankedLocations`, `rankingCache{key, locations}`, `isRanking`, `baselines`, `scoringProfile` |
| Table element ID | `grantLocationTable` → `<tbody id="grantLocationBody">` |
| Pagination element | `grantPagination` |
| Data source | `crashState.sampleRows` pre-filtered by date, then scored by `calculateImprovedGrantScore()` |
| Filter logic | Date range filter on sampleRows → group by route/node → score each location |
| Ranking function | `rankLocationsForGrants()` at line **34305** — batch processes 30 locations at a time |
| Display function | `displayGrantLocations()` at line **37668** — uses `setPaginationData('grant', allLocations)` + `getPaginatedData('grant')` |
| Existing pagination | ✅ Yes — uses shared `paginationState` system |
| Page size | Default 50, selectable 25/50/100/200/All |
| Columns | Checkbox, Rank, Type (Int/Rte), Location, Crashes, K, A, EPDO, VRU, Patterns, Score, Conf., Best Match, Actions |
| Row count | All scored locations (100–5,000+) |
| HTML location | Lines **12527–12534** |
| sampleRows lines | **34355** (date pre-filter in ranking function) |

### 1.7 Safety Focus Tab

| Property | Value |
|----------|-------|
| State object | `safetyState` (line **91627**) |
| Key properties | `loaded`, `activeCategory`, `filteredTotal`, `data{}` (21 categories, each with `crashes[]`, `byRoute{}`, `severity{}`, `bySubcategory{}`) |
| Table element ID | **None** — renders crash lists with `.safety-crash-list` class (max-height 400px) at lines **103825**, **104198**, **104595** |
| Data source | `crashState.sampleRows` — iterates ALL rows, classifies into 21 categories |
| Filter logic | 21 category-specific `filter()` functions in `safetyCategories` config object (line **91746**) |
| Init function | `initSafetyFocus()` at line **92508** |
| Processing function | `processSafetyData()` at line **92617** — iterates all sampleRows, applies severity + date + category filters |
| Category select | `selectSafetyCategory(category)` at line **92954** |
| Existing pagination | ⚠️ Partial — `paginationState.safety` exists in shared system but detail crash lists use `.safety-crash-list` with `max-height:400px;overflow-y:auto` scroll |
| 21 categories | curves, workzone, school, guardrail, senior, young, roaddeparture, lgtruck, pedestrian, bicycle, speed, impaired, intersection, nighttime, distracted, motorcycle, hitrun, weather, animal, unrestrained, drowsy |
| sampleRows lines | **92619** (main iteration in `processSafetyData()`) |

### 1.8 Before/After Tab

| Property | Value |
|----------|-------|
| State object | `baState` (line **74250**) |
| Key properties | `selectedLocation`, `locationName`, `locationCrashes[]`, `treatmentType`, `treatmentDate`, `constructionDuration`, `studyPeriodYears`, `beforePeriod{}`, `afterPeriod{}`, `analysisMethod` ('eb'), `results`, `mapSelection`, `monitoringActive` |
| Table element ID | Uses batch-ba module tables (separate module system) |
| Data source | `crashState.sampleRows.filter(...)` filtered by location |
| Existing pagination | ❌ None — statistical analysis, not browsable table |
| Batch module | `CL.batchBA` namespace in `app/modules/batch-ba/` (8 module files) |

---

## 2. sampleRows Dependency Map

### 2.1 All `crashState.sampleRows.filter()` Calls (60+ occurrences)

**Display / Table rendering** (candidates for Supabase replacement):

| Line | Function Context | Filter Logic | Candidate? |
|------|-----------------|--------------|------------|
| 48045 | `dashSearchCrashes()` | Year + severity + ped/bike + text search | ✅ High priority |
| 65362 | `analysisSearchCrashes()` | Year + severity + ped/bike + text search | ✅ High priority |
| 85608/85615 | `selectCMFLocation()` | Route OR node match | ✅ Medium |
| 105516/105575 | `loadLocationForWarrants()` | Route OR node match | ✅ Medium |
| 34355 | `rankLocationsForGrants()` | Date range pre-filter | ⚠️ Complex — grants needs client-side scoring |
| 92619 | `processSafetyData()` | All rows → classify into 21 categories | ❌ Must stay client-side |

**Analysis / AI context** (should stay client-side):

| Line | Function Context | Purpose |
|------|-----------------|---------|
| 58203 | `showLocationDetail()` | Hotspot detail crash profile |
| 58221 | Hotspot map jump | Location crash extraction |
| 59110 | AI context | Location crash profile for AI |
| 59234/59574/59703 | AI analysis | Various AI data assembly |
| 59724/59742/59760 | AI ped/bike/intersection | Category analysis for AI |
| 61656 | Ped safety analysis | Pedestrian crash deep-dive |
| 61986-61991 | County-wide rates | Behavioral factor percentages |
| 62433 | Bike safety analysis | Bicycle crash deep-dive |
| 62755-62760 | County-wide rates (duplicate) | Behavioral factor percentages |
| 64482-64490/64575-64583 | Safety report | Category crashes for PDF export |
| 64917 | `viewLocationCMF()` | Map→CMF jump |
| 65103/65142/65144 | Analysis tab | Location crash extraction |
| 78893 | DK (unknown feature) | Location crash extraction |
| 80663/80667 | DK state | Location crashes for DK analysis |
| 82017 | Analysis | Location crash extraction |
| 105516/105575 | Warrants | Location crash loading |
| 106127 | Warrants location | Crash extraction |
| 120845 | AI deep-dive | Location crash extraction |
| 137072 | District filter | Route crash extraction |

### 2.2 Summary

- **60+ `sampleRows.filter()` calls** in `app/index.html`
- **2 are display tables** (Dashboard Search, Analysis Search) — highest-impact Supabase candidates
- **2 are location data loaders** (CMF, Warrants) — medium-impact
- **1 is aggregate scoring** (Grants) — complex, may need hybrid approach
- **1 is category classification** (Safety) — must stay client-side
- **50+ are analysis/AI/export** — should stay client-side for speed

---

## 3. data-client.js `getCrashes()` Capabilities

### 3.1 Method Signature
```javascript
async getCrashes(tier, value, filters = {})
// Returns: { rows: Array, total: number, page: number }
```

### 3.2 Supported Filters
| Filter | Parameter | Supabase Query |
|--------|-----------|----------------|
| Year | `filters.year` | `crash_year=eq.{year}` |
| Severity | `filters.severity` | `crash_severity=eq.{severity}` |
| Route | `filters.route` | `rte_name=eq.{route}` |
| Page | `filters.page` (1-indexed) | Range header `{start}-{end}` |

### 3.3 Pagination Implementation
- **Page-based** with `pageSize: 25` (configurable in constructor)
- Range header: `Range: {(page-1)*pageSize}-{(page-1)*pageSize + pageSize - 1}`
- Response includes `Content-Range` header → parsed for total count
- `Prefer: count=exact` header enables total count

### 3.4 Missing Filters (need to add for Phase 4)
| Filter | Needed By | Supabase Query Needed |
|--------|-----------|----------------------|
| Node | CMF, Warrants | `node=eq.{node}` |
| Text search | Dashboard Search | `or=(rte_name.ilike.*{text}*,collision_type.ilike.*{text}*,document_nbr.ilike.*{text}*)` |
| Date range | All tabs | `and=(crash_date.gte.{start},crash_date.lte.{end})` |
| Ped/Bike | Search tabs | `pedestrian=eq.Yes` / `bike=eq.Yes` |
| Multi-severity | Search tabs | `crash_severity=in.(K,A)` |

### 3.5 Columns Selected
- `getCrashes()` → **all columns** (`select` not specified → `SELECT *` default, then `_pgToFrontend()` renames)
- `getMapCrashes()` → 8 columns: `objectid,x,y,crash_severity,crash_year,collision_type,rte_name,intersection_name`
- `getCrashDetail()` → `SELECT *` (full record)

### 3.6 Column Mapping
- 73 columns mapped in `COL_MAP` (lines 39–113)
- `_pgToFrontend(row)` renames snake_case → Title Case
- `PG_TO_FRONTEND` reverse map for query building

---

## 4. Pagination Infrastructure

### 4.1 Shared Pagination System (Reusable)

**Location**: Lines **30459–30572**

```javascript
const paginationState = {
    hotspots:     { page: 1, pageSize: 50, totalItems: 0, allData: [] },
    intersection: { page: 1, pageSize: 50, totalItems: 0, allData: [] },
    grant:        { page: 1, pageSize: 50, totalItems: 0, allData: [] },
    safety:       { page: 1, pageSize: 50, totalItems: 0, allData: [] },
    fatalSpeed:   { page: 1, pageSize: 50, totalItems: 0, allData: [] },
    speedHotspots:{ page: 1, pageSize: 50, totalItems: 0, allData: [] },
    combinedFS:   { page: 1, pageSize: 50, totalItems: 0, allData: [] }
};
```

**Helper functions** (all reusable):
| Function | Line | Purpose |
|----------|------|---------|
| `renderPaginationControls(tableKey, containerId, onPageChange)` | 30470 | Generates « ‹ 1 2 3 › » HTML + "Showing X-Y of Z" + per-page selector (25/50/100/200/All) |
| `changePageSize(tableKey, newSize, refreshCallback)` | 30521 | Handles per-page dropdown changes |
| `getPaginatedData(tableKey)` | 30539 | Returns current page slice from `allData` |
| `setPaginationData(tableKey, data)` | 30552 | Sets data array + recalculates bounds |
| `goToPage(tableKey, page)` | 30566 | Navigates to specific page |

**Used by**: Hotspots, Grants, Safety (location tables), Fatal/Speed focus tables

### 4.2 Dashboard/Analysis Search Pagination (Custom)

**Location**: Lines **48071–48124** (Dashboard), Lines **65388–65432** (Analysis)

- Separate from shared system — uses `PAGE_SIZE = 100` constant
- Manual page button rendering with `dashCurrentSearchPage` / `analysisCurrentSearchPage`
- Same « ‹ 1 2 3 › » UI pattern
- No per-page size selector

### 4.3 Pagination CSS

```css
.pagination-wrapper { ... }
.pagination-btn { ... }
.pagination-btn.active { ... }
.page-btn { ... }  /* Used by Dashboard/Analysis search */
```

---

## 5. Recommended Phase 4 Plan

### Priority 1: Dashboard & Analysis Search Tables (Highest Impact, Easiest)

**Why highest impact**: These two tables currently copy the ENTIRE `sampleRows` array (up to 570K rows) into memory on init. With Supabase, they'd only fetch 25 rows at a time.

**What to change**:
- Replace `dashSearchCrashes()` — instead of `crashState.sampleRows.filter(...)`, call `getCrashes()` with text/year/severity filters
- Replace `analysisSearchCrashes()` — same pattern
- Add new filters to `data-client.js`: text search (`ilike`), ped/bike, node
- Replace custom pagination with shared `paginationState` system (or adapt existing pattern to call Supabase on page change instead of slicing)
- Keep CSV export working — "Export All" would need a bulk Supabase query or stream

**Effort**: ~2 days  
**Risk**: Low — self-contained, no cross-tab dependencies

### Priority 2: CMF Location Crashes (Medium Impact)

**Why**: When user selects a location, `selectCMFLocation()` filters ALL sampleRows to find matching crashes. With Supabase, this becomes a simple `rte_name=eq.{route}` or `node=eq.{node}` query.

**What to change**:
- Add `getCrashesByLocation(type, value)` to `data-client.js` — returns all crashes for a route/node
- Replace sampleRows filter in `selectCMFLocation()` (line 85615)
- Keep `filterCMFCrashesByDate()` client-side (operates on loaded location data)
- `buildCMFCrashProfile()` stays client-side (needs all location crashes for profiling)

**Effort**: ~1 day  
**Risk**: Low — isolated to CMF tab, fallback to sampleRows if Supabase fails

### Priority 3: Warrants Location Crashes (Medium Impact)

**Why**: Same pattern as CMF — `loadLocationForWarrants()` filters sampleRows by route/node.

**What to change**:
- Reuse `getCrashesByLocation()` from Priority 2
- Replace sampleRows filter in `loadLocationForWarrants()` (line 105575)
- Keep `filterWarrantCrashesByDate()` and crash profile building client-side

**Effort**: ~0.5 days (reuses CMF infrastructure)  
**Risk**: Low — same pattern

### Priority 4: Hotspots (Already Paginated, Different Architecture)

**Why lower**: Hotspots already uses the shared pagination system and reads from `crashState.aggregates` (pre-computed), NOT from sampleRows directly. The scoring is done client-side via `CL.analysis.hotspots.scoreAndRank()`.

**What to change**:
- Could add a Supabase matview `location_hotspots` that pre-computes EPDO rankings
- Would replace `scoreAndRank()` with a Supabase query
- But current client-side scoring is fast enough and supports custom date ranges

**Effort**: ~3 days (new matview + wiring)  
**Risk**: Medium — complex scoring logic to replicate server-side

### Priority 5: Grants (Complex, Low Priority for Supabase)

**Why lowest**: Grant ranking needs `sampleRows` for complex client-side scoring:
- `analyzeCrashPatterns()` — behavioral pattern detection
- `calculateImprovedGrantScore()` — 5 scoring profiles × ORI × PSI × feasibility
- 30-location batch processing
- Location-specific pattern analysis

**What to change**: Not recommended for Phase 4. Keep client-side.

**Effort**: ~5+ days  
**Risk**: High — scoring logic is deeply integrated with client-side computation

### Priority 6: Safety Focus (Must Stay Client-Side)

**Why**: `processSafetyData()` iterates ALL sampleRows and classifies each crash into 21 overlapping categories using 21 different `filter()` functions. This cross-classification cannot be efficiently done as 21 separate Supabase queries.

**What to change**: Nothing. Keep client-side.

---

## 6. Integration Points

### 6.1 Dashboard Search → Supabase

| Component | Current | Supabase Replacement |
|-----------|---------|---------------------|
| `dashSearchCrashes()` (line 48045) | `crashState.sampleRows.filter(...)` | `client.getCrashes(tier, value, { text, year, severity, pedBike, page })` |
| `dashRenderSearchResults()` (line 48071) | `dashSearchResults.slice(start, start+PAGE_SIZE)` | Direct render from API response `data.rows` |
| `dashRenderSearchPagination()` (line 48105) | Custom, uses `dashSearchResults.length` | Use `data.total` from Supabase Content-Range |
| `dashExportSearchCSV()` (line 48126) | `dashSearchResults.map(...)` | Need bulk query: `client.getCrashes(tier, value, { ...filters, page: 'all' })` |
| `initDashboardSearch()` (line 48013) | Copies ALL sampleRows | Just render page 1 |

**New Supabase query needed**:
```
GET /rest/v1/crashes?state=eq.delaware&physical_juris_name=eq.Sussex
  &crash_year=eq.2023
  &crash_severity=in.(K,A)
  &or=(rte_name.ilike.*main*,collision_type.ilike.*main*,document_nbr.ilike.*main*)
  &order=crash_year.desc,objectid.asc
  &limit=25
  Range: 0-24
  Prefer: count=exact
```

### 6.2 CMF Location → Supabase

| Component | Current | Supabase Replacement |
|-----------|---------|---------------------|
| `selectCMFLocation()` (line 85615) | `crashState.sampleRows.filter(row => row[COL.ROUTE] === name)` | `client.getCrashes(tier, value, { route: name })` (unpaginated, need all for profiling) |

**New Supabase query needed**:
```
GET /rest/v1/crashes?state=eq.delaware&physical_juris_name=eq.Sussex
  &rte_name=eq.SR0001
  &limit=10000
```

Note: CMF needs ALL crashes for the location (for crash profile, pattern analysis, date filtering). Supabase pagination doesn't help here — we need a single bulk query. Consider a `getCrashesByLocation()` method that returns up to 10K rows without pagination.

### 6.3 Warrants Location → Supabase

Same pattern as CMF — bulk query by route or node, store all in `warrantsState.locationCrashes`.

### 6.4 HTML Elements Needing Pagination Controls

| Tab | Element ID | Currently Has | Needs |
|-----|-----------|---------------|-------|
| Dashboard Search | `dashSearchPagination` | ✅ Custom pagination | Update to call Supabase on page change |
| Analysis Search | `analysisSearchPagination` | ✅ Custom pagination | Update to call Supabase on page change |
| Hotspots | `hotspotPagination` | ✅ Shared system | No change needed |
| Grants | `grantPagination` | ✅ Shared system | No change needed |

---

## 7. Risk Assessment

### Safe to Convert (Low Risk)

| Tab | Why Safe |
|-----|----------|
| Dashboard Search | Self-contained, no cross-tab dependencies, existing pagination |
| Analysis Search | Same architecture as Dashboard Search |
| CMF location loading | Isolated to `selectCMFLocation()`, easy fallback |
| Warrants location loading | Same pattern as CMF |

### Keep on sampleRows (High Risk to Convert)

| Tab | Why Keep |
|-----|----------|
| Safety Focus | 21-category cross-classification needs all rows in memory |
| Grants scoring | Complex multi-factor scoring with behavioral pattern analysis |
| Hotspot scoring | Client-side EPDO ranking needs aggregates, already fast |
| Before/After | Statistical analysis needs complete before/after periods |
| AI context functions | 50+ sampleRows.filter calls for AI data assembly |

### What Could Break

1. **CSV Export** — `dashExportSearchCSV()` exports ALL results. With Supabase pagination, "Export All" needs a bulk query or streaming approach. Same for `analysisExportCSV()`.

2. **Quick location filter** — `analysisQuickLocationFilter()` (line 65248) searches `quickLocationData` which is pre-built from aggregates, not sampleRows. This is SAFE.

3. **Cross-tab jumps** — `viewLocationCMF()` (line 64904) filters sampleRows to get crashes for a location, then jumps to CMF tab. If CMF uses Supabase, the jump function also needs updating.

4. **Worker dependency** — `selectCMFLocation()` checks for `CL.worker.ensureSampleRows()` before filtering. With Supabase, this guard would be replaced by `CL.data.client.getCrashes()`.

5. **Aggregate consistency** — CMF crash profile uses `filteredCrashes` which must contain ALL crashes for the location (not just one page). Supabase query for CMF must NOT paginate — it must fetch all location crashes at once.

---

## 8. Appendix: Existing State Objects Summary

```
crashState           → Primary: sampleRows[], aggregates{}, mapPoints[], loaded, totalRows
cmfState             → Location: locationCrashes[], filteredCrashes[], crashProfile{}, database[]
warrantsState        → Location: locationCrashes[], filteredCrashes[], crashProfile{}, signal{}
grantState           → Ranking: allRankedLocations[], rankingCache{}, baselines{}, scoringProfile
safetyState          → Categories: data{} (21 categories), activeCategory, filteredTotal
baState              → Study: locationCrashes[], treatmentDate, beforePeriod{}, afterPeriod{}, results
paginationState      → Shared: hotspots{}, intersection{}, grant{}, safety{}, fatalSpeed{}, speedHotspots{}, combinedFS{}
selectionState       → Cross-tab: location, crashes[], crashProfile{}, fromTab
dashSearchResults    → Array (copy of filtered sampleRows)
analysisSearchResults → Array (copy of filtered sampleRows)
```
