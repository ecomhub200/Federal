# Tier Navigation Analysis — Federal Codebase

> Generated 2026-04-20 — maps everything that exists for multi-tier views (Federal → State → Region → PD → MPO → County → City) and identifies the gaps.

---

## 1. Current State — What Exists

### 1.1 How the County-Only View Works End-to-End

1. **Dropdown:** `<select id="jurisdictionSelect">` (line 4888) populated by `populateJurisdictionDropdown()` (line 24504) with counties and independent cities from `appConfig.jurisdictions`.
2. **Selection:** `saveJurisdictionSelection()` (line 24657) → `applyJurisdictionSelection()` → updates `jurisdictionContext`, flies map, clears cache.
3. **Data path:** `getDataFilePath()` returns `{r2Prefix}/{jurisdiction}/{roadType}.csv.gz` for county tier.
4. **Data load:** `autoLoadCrashData()` → fetches CSV from R2 → Papa.parse chunks through `processRow()` → populates `crashState.aggregates` → `finalizeData()` → `showTab('dashboard')` → `updateDashboard()`.
5. **Default tier:** `jurisdictionContext.viewTier` defaults to `'county'`.

### 1.2 Tier Infrastructure That Already Exists

The multi-tier system is **substantially built**. Here's what's in place:

**Tier selector UI** (line 4820): 7 buttons — Federal, State, Region, MPO, Planning District, County (default), City/Town. Each calls `handleTierChange(tier)`.

**Tier-specific dropdowns** (lines 4835–4858):
- `tierRegionSelect` → `handleRegionSelection()` (line 21382)
- `tierMPOSelect` → `handleMPOSelection()` (line 21435)
- `tierPlanningDistrictSelect` → `populatePlanningDistrictDropdown()` (line 21193)
- `tierCitySelect` → `populateGeoTierDropdown('city')` (line 20943)

**Core tier functions:**
- `setViewTier(tier)` (line 20791) — changes `jurisdictionContext.viewTier`, updates tab visibility, updates tier selector UI
- `handleTierChange(tier)` (line 20896) — full tier switch: clears boundaries, populates dropdowns, loads data, dispatches event
- `updateTabVisibilityForTier(tier)` (line 20800) — shows/hides tabs per `TIER_TAB_VISIBILITY` matrix
- `updateTierSelectorUI(tier)` (line 20818) — toggles dropdown rows, scope indicator text, loads hierarchy on demand

**Hierarchy system:**
- `HierarchyRegistry` (line 21852) — loads `states/{stateKey}/hierarchy.json` on demand, caches per state
- 51 `hierarchy.json` files exist (all 50 states + DC) with regions, MPOs/TPRs, counties, corridors
- `populateRegionDropdown()` (line 21346), `populateMPODropdown()` (line 21357) already work

**Data loading by tier:**
- `getDataFilePath()` (upload-tab.js line 109) — builds correct R2 paths for all 7 tiers + corridor
- `AggregateLoader` (line 22423) — has methods for statewide, region, MPO aggregate JSON loading
- `loadStatewideCSVForTier()` (line 21280) — fetches and parses statewide CSV
- `autoLoadCrashData()` — called by `handleTierChange()` for state/federal tiers, and by region/MPO selection handlers

**Dashboard tier sections:**
- `updateDashboardTierSections()` (line 47654) — shows/hides comparison panels based on tier
- `regionComparisonContainer` (line 5641) — region comparison table (state/federal tiers)
- `mpoComparisonContainer` (line 5671) — MPO comparison table (state/federal tiers)
- `countyComparisonContainer` (line 5701) — county comparison table (state/federal/region/mpo tiers)
- `districtMatrixWidget` (line 5775) — magisterial district matrix (county/city tiers only)

**Breadcrumb and scope header:**
- `tierBreadcrumb` (line 5547) — clickable navigation breadcrumb with `navigateBreadcrumbTier()`
- `tierScopeHeader` (line 5551) — title/subtitle/badge for current scope

**Supabase bridge:**
- `supabase-bridge.js` — `resolveTier()` already maps all tiers to correct `jurisdictionContext` properties
- `data-client.js` — `TIER_COLUMNS` maps all 7 tiers to Supabase columns; `getSummary()` supports all tiers

**R2 storage:**
- `split.py` generates per-tier files: `_state/`, `_region/{id}/`, `_mpo/{id}/`, `_planning_district/{id}/`, `_city/{slug}/`, `{county}/`
- Each tier has road-type variants: `all_roads`, `dot_roads`, `county_roads`, `city_roads`, `no_interstate`, `statewide_all_roads`

**Tab visibility control:**
- `TIER_TAB_VISIBILITY` (line 20780) — matrix controlling which tabs show per tier
- Federal/corridor: some tabs hidden (crashTree, fatalSpeed, intersections, pedBike)
- All other tiers: full tab access

### 1.3 What UI Elements Exist for Tiers

| Element ID | Type | Line | Purpose |
|------------|------|------|---------|
| `tierSelector` | `<div>` container | 4820 | 7 tier buttons |
| `tierRegionRow` / `tierRegionSelect` | row + dropdown | 4835 | Region selection |
| `tierMPORow` / `tierMPOSelect` | row + dropdown | 4841 | MPO selection |
| `tierPlanningDistrictRow` / `tierPlanningDistrictSelect` | row + dropdown | 4847 | PD selection |
| `tierCityRow` / `tierCitySelect` | row + dropdown | 4853 | City/Town selection |
| `tierScopeIndicator` / `tierScopeText` | text | 4861 | Current scope label |
| `jurisdictionSelect` | dropdown | 4888 | County/city selection |
| `jurisdictionLockBadge` | badge | 4885 | Lock icon when non-county tier |
| `tierBreadcrumb` | nav | 5547 | Clickable breadcrumb trail |
| `tierScopeHeader` / `tierScopeTitle` / `tierScopeSubtitle` / `tierScopeBadge` | header | 5551 | Scope display on dashboard |
| `districtMatrixWidget` | panel | 5775 | County-only: magisterial districts |
| `regionComparisonContainer` | panel | 5641 | State/federal: region comparison |
| `mpoComparisonContainer` | panel | 5671 | State/federal: MPO comparison |
| `countyComparisonContainer` | panel | 5701 | State+/region/mpo: county comparison |

---

## 2. Data Layer — Already Tier-Ready

### 2.1 `getDataFilePath()` Handles All Tiers

| Tier | R2 Path Pattern |
|------|----------------|
| `federal` | `_national/{roadType}.csv.gz` |
| `state` | `{r2Prefix}/_state/{roadType}.csv.gz` |
| `region` | `{r2Prefix}/_region/{regionId}/{roadType}.csv.gz` |
| `mpo` | `{r2Prefix}/_mpo/{mpoId}/{roadType}.csv.gz` |
| `planning_district` | `{r2Prefix}/_planning_district/{pdId}/{roadType}.csv.gz` |
| `city` | `{r2Prefix}/_city/{citySlug}/{roadType}.csv.gz` |
| `county` | `{r2Prefix}/{jurisdiction}/{roadType}.csv.gz` |

### 2.2 R2 Has Files for All Tiers (from `split.py`)

`split.py` v2.0 splits statewide normalized CSV into:

| Output Tier | Path | Road-Type Variants |
|-------------|------|--------------------|
| State | `_state/` | `statewide_all_roads`, `dot_roads`, `city_roads`, `non_dot_roads` |
| Region | `_region/{id}/` | `all_roads`, `dot_roads`, `city_roads` |
| MPO | `_mpo/{id}/` | `all_roads` (+ variants if available) |
| Planning District | `_planning_district/{id}/` | `all_roads` |
| City | `_city/{slug}/` | `all_roads` |
| County | `{county_key}/` | `all_roads`, `county_roads`, `city_roads`, `no_interstate` |

### 2.3 Supabase `data-client.js` Supports All Tiers

`TIER_COLUMNS` mapping (line 29):

| Tier | Supabase Column | Filter |
|------|----------------|--------|
| `federal` | `null` | No filter (all states) |
| `state` | `state` | state FIPS |
| `region` | `dot_district` | region/district name |
| `planning_district` | `planning_district` | PD name |
| `mpo` | `mpo_name` | MPO name |
| `county` | `physical_juris_name` | county/jurisdiction name |
| `city` | `physical_juris_name` | city name |

Methods: `getSummary(tier, value)`, `getCrashes(tier, value)`, `getMapCrashes(tier, value, bbox)`, `getBaselines(tier, value)`.

### 2.4 `dashboard_summary` Matview

Queried by `_supabaseSummary()` (data-client.js line 312). Supports filters: tier column, year range, severity, functional class, area type. Returns aggregate rows that `supabase-bridge.js` `aggregate()` function consumes.

---

## 3. What's Missing — Gap Analysis

| Component | County | State | Region | PD | MPO | City | Federal |
|-----------|--------|-------|--------|-----|-----|------|---------|
| **Tier selector buttons** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Tier dropdown** | ✅ jurisdictionSelect | N/A | ✅ tierRegionSelect | ✅ tierPDSelect | ✅ tierMPOSelect | ✅ tierCitySelect | N/A |
| **getDataFilePath()** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **R2 files** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ `_national/` may be empty |
| **split.py** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | N/A (separate aggregation) |
| **Hierarchy JSON** | ✅ (counties) | N/A | ✅ (regions) | ✅ (PDs) | ✅ (MPOs/TPRs) | ✅ (places) | N/A |
| **handleTierChange()** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Data loading** | ✅ auto | ✅ auto | ✅ on select | ⚠️ partial | ✅ on select | ⚠️ partial | ✅ auto |
| **Dashboard KPI cards** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Dashboard charts** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Comparison tables** | N/A | ✅ region+mpo+county | ✅ county | ✅ county | ✅ county | N/A | ✅ region+mpo+county |
| **Map bounds** | ✅ fly to county | ✅ state outline | ✅ region boundary | ⚠️ no boundary | ✅ MPO boundary | ⚠️ no boundary | ✅ US center |
| **Supabase bridge** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Supabase data-client** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Breadcrumb nav** | hidden | ✅ | ✅ state→region | ⚠️ needs test | ✅ state→mpo | hidden | ✅ |
| **Scope header** | hidden | ✅ | ✅ | ⚠️ needs test | ✅ | hidden | ✅ |

### Legend
- ✅ = Fully implemented and wired
- ⚠️ = Partially implemented or needs testing
- N/A = Not applicable for this tier

### Specific Gaps

1. **Federal `_national/` data**: Files may not exist yet in R2. The `split.py` only operates per-state. A separate national aggregation script would be needed for multi-state federal view.

2. **Planning District data loading**: `handleTierChange()` populates the PD dropdown but doesn't trigger `autoLoadCrashData()` after PD selection — there's no `handlePlanningDistrictSelection()` function analogous to `handleRegionSelection()` and `handleMPOSelection()`.

3. **City data loading**: `populateGeoTierDropdown('city')` populates the dropdown but there's no explicit `handleCitySelection()` trigger for `autoLoadCrashData()`.

4. **PD/City map boundaries**: No boundary drawing for planning districts or cities (unlike state outlines, region boundaries, and MPO boundaries which are handled).

5. **State config `tiers` array**: Currently `["state", "region", "mpo", "county", "city"]` — does NOT include `"federal"` or `"planning_district"`. The tier selector UI has all 7 buttons, but the config only lists 5.

---

## 4. Proposed Enhancement Plan

### Phase A — Validate What's Already Built (0 new code)

1. **Test the tier selector** — click each of the 7 buttons and observe:
   - Does the correct dropdown appear?
   - Does it populate from hierarchy.json?
   - Does data load from R2?
   - Do dashboard cards update?
   - Does the map adjust bounds?
   - Does the breadcrumb update?

2. **Test Supabase bridge per tier** — call `CL.data.supabaseBridge.injectFastDashboard()` after switching tiers. Does it pre-paint KPIs correctly?

3. **Document which tiers actually have R2 data** — check `data.aicreatesai.com` for each state's `_state/`, `_region/`, `_mpo/`, `_planning_district/`, `_city/` folders.

### Phase B — Wire Missing Selection Handlers (small, surgical)

**Add `handlePlanningDistrictSelection()`** — analogous to `handleRegionSelection()`:
- Read selected PD from hierarchy
- Set `jurisdictionContext.tierPlanningDistrict`
- Call `autoLoadCrashData(true)`
- Dispatch `tierChanged` event

**Add `handleCitySelection()`** — analogous pattern:
- Read selected city from geo JSON
- Set `jurisdictionContext.tierCity`
- Call `autoLoadCrashData(true)`
- Dispatch `tierChanged` event

**Wire onchange handlers** on `tierPlanningDistrictSelect` and `tierCitySelect`.

### Phase C — Map Boundary Support (medium)

- Add PD boundary drawing using TIGERweb County Subdivision API
- Add city boundary drawing using TIGERweb Place API
- Both follow the existing pattern: fetch GeoJSON → L.geoJSON → flyToBounds

### Phase D — Federal Multi-State View (largest)

- Create a national aggregation script that combines state-level CSVs
- Upload to `_national/` in R2
- Or: use Supabase `dashboard_summary` with `tier='federal'` (no column filter) — this already works if the matview has data from multiple states

### What to NEVER Touch

- **Existing county flow** (`saveJurisdictionSelection` → `applyJurisdictionSelection` → `autoLoadCrashData`) — this is production-stable
- **`processRow()`** — the row processing pipeline is tier-agnostic, processes any CSV the same way
- **`updateDashboard()`** — reads from `crashState.aggregates` which is source-agnostic
- **`getFilteredStats()`** — works regardless of tier
- **Protected workflows** per CLAUDE.md: Colorado and Virginia download/batch workflows

---

## 5. Recommended UI Design

### 5.1 Current Layout

The tier selector already exists as a button bar in the **Upload/Data tab** (line 4820), above the jurisdiction dropdown. This is logical since tier selection determines what data scope to load.

### 5.2 Navigation Flow (already implemented)

```
Federal ─────────────────────────────────────────► US-wide view (map zoom 4)
  │
  └─► State ─────────────────────────────────────► State-wide view (state outline)
        │
        ├─► Region ──► pick from dropdown ────────► Region view (region boundary)
        │     └─► County ──► pick from dropdown ──► County view (existing)
        │
        ├─► MPO ──► pick from dropdown ───────────► MPO view (MPO boundary)
        │     └─► County ──► pick from dropdown ──► County view (existing)
        │
        ├─► Planning District ──► pick dropdown ──► PD view
        │     └─► County ──► pick from dropdown ──► County view (existing)
        │
        ├─► County ──► pick from dropdown ────────► County view (existing, DEFAULT)
        │
        └─► City/Town ──► pick from dropdown ─────► City view
```

### 5.3 Breadcrumb (already implemented, line 5547)

```
State: "Colorado (Statewide)"
Region: "Colorado > Region 1 — Front Range"
MPO: "Colorado > DRCOG"
County: hidden (county name shown elsewhere)
```

Clickable: clicking "Colorado" in the breadcrumb calls `navigateBreadcrumbTier('state')` to zoom back to state level.

---

## 6. Risk Assessment

### What Could Break

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| County flow disrupted | Low | Critical | Never modify `saveJurisdictionSelection`, `applyJurisdictionSelection`, or county data path. Tier system is additive. |
| Large state CSV overwhelms browser | Medium | High | State CSVs can be 200k+ rows. Web Worker path handles this. Consider sampling or pagination for very large states. |
| Missing R2 files at non-county tiers | Medium | Medium | `getDataFilePath()` builds paths optimistically. If R2 returns 404, the `autoLoadCrashData()` error handler fires. Need graceful fallback messaging. |
| `crashState.aggregates` overwritten by tier switch | Medium | Medium | Each tier switch calls `resetState()` then rebuilds from new CSV. This is by design — the app only holds one tier's data at a time. |
| Supabase `dashboard_summary` missing higher-tier data | Low | Low | Bridge skips gracefully (try/catch). R2 CSV pipeline is the primary source. |

### Safest Integration Approach

1. **The tier system is already built.** Don't reinvent it.
2. **Focus on the 2 missing selection handlers** (PD and City) — these are the only functional gaps.
3. **Test with Colorado first** — it has complete hierarchy.json and R2 data.
4. **Don't modify any existing functions** — add new `handlePlanningDistrictSelection()` and `handleCitySelection()` functions and wire `onchange` handlers.

### Testing Checklist

- [ ] Switch to each tier → verify dropdown appears and populates
- [ ] Select an item in each dropdown → verify data loads
- [ ] After data loads → verify dashboard KPIs update with correct numbers
- [ ] Verify map bounds adjust for each tier
- [ ] Verify breadcrumb updates and is clickable
- [ ] Switch back to county tier → verify county flow still works exactly as before
- [ ] Verify Supabase bridge pre-paints for each tier
- [ ] Verify tab visibility respects `TIER_TAB_VISIBILITY` matrix
- [ ] Test with no R2 data → verify graceful error handling

---

## 7. Implementation Priority

Ordered by safety and impact:

### 1. Test the existing tier system (zero code changes)

Click each tier button in a browser. Document what works and what doesn't. Most of the system is already implemented — the question is whether R2 data exists for each state's sub-tiers.

### 2. Add PD and City selection handlers (~30 lines each)

Create `handlePlanningDistrictSelection()` and `handleCitySelection()` following the exact pattern of `handleRegionSelection()` (line 21382) and `handleMPOSelection()` (line 21435). Wire `onchange` on the dropdowns.

### 3. Run `split.py` for target states

Ensure the batch pipeline has run for the states you want to demo. Verify R2 has `_region/`, `_mpo/`, `_planning_district/`, `_city/` folders with data.

### 4. Add PD/City map boundaries (~50 lines each)

Use `BoundaryService` (TIGERweb API) to fetch and render GeoJSON boundaries for planning districts and cities, following the existing region/MPO boundary pattern.

### 5. Populate `dashboard_summary` matview for all tiers

Run the Supabase data pipeline to ensure `dashboard_summary` has rows for every tier/value combination. This enables the Supabase bridge to pre-paint KPIs for all tiers.

### 6. Add config.json `tiers` entries for `federal` and `planning_district`

Currently config only lists `["state", "region", "mpo", "county", "city"]`. Add `"federal"` and `"planning_district"` if they should be available.

### 7. Federal multi-state aggregation (largest effort)

Create a national aggregation pipeline that either: (a) combines state CSVs into `_national/all_roads.csv.gz`, or (b) relies exclusively on Supabase `dashboard_summary` with `tier='federal'` for a DB-only federal view.

---

## Appendix: Key Function Reference

| Function | Line | Purpose |
|----------|------|---------|
| `setViewTier(tier)` | 20791 | Changes tier, updates tabs and UI |
| `handleTierChange(tier)` | 20896 | Full tier switch with data loading |
| `updateTierSelectorUI(tier)` | 20818 | Toggles dropdowns, scope indicator, loads hierarchy |
| `updateTabVisibilityForTier(tier)` | 20800 | Shows/hides tabs per tier |
| `handleRegionSelection()` | 21382 | Region dropdown change → load data |
| `handleMPOSelection()` | 21435 | MPO dropdown change → load data |
| `populateRegionDropdown()` | 21346 | Fills region dropdown from hierarchy |
| `populateMPODropdown()` | 21357 | Fills MPO dropdown from hierarchy |
| `populatePlanningDistrictDropdown()` | 21193 | Fills PD dropdown from hierarchy |
| `loadStatewideCSVForTier(stateKey)` | 21280 | Fetches and parses statewide CSV |
| `getDataFilePath()` | upload-tab.js:109 | Builds R2 URL by tier |
| `getActiveRoadTypeSuffix(tier)` | upload-tab.js:31 | Road type suffix by tier |
| `resolveDataUrl(path)` | 22820 | 3-strategy R2 URL resolution |
| `HierarchyRegistry.load(stateKey)` | 21852 | Loads/caches hierarchy.json |
| `AggregateLoader.loadForTier(tier, stateKey, scopeId)` | 22423 | Tier-aware JSON aggregate loader |
| `updateDashboardTierSections()` | 47654 | Shows/hides dashboard comparison panels |
| `updateTierBreadcrumb()` | 47568 | Updates breadcrumb navigation |
| `updateTierScopeHeader()` | 47608 | Updates scope title/subtitle/badge |
| `buildTierComparison()` | 46890 | Groups crashes by jurisdiction for comparison |
| `buildRegionComparison()` | 46943 | Aggregates county data into region summaries |
| `buildMPOComparison()` | 47002 | Aggregates county data into MPO summaries |
| `saveJurisdictionSelection()` | 24657 | County dropdown change handler (DO NOT MODIFY) |
| `applyJurisdictionSelection()` | 24669 | Applies county selection (DO NOT MODIFY) |
