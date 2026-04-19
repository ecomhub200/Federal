# CrashLens Frontend Data Audit
**Generated: April 19, 2026 — from CLAUDE.md + config.json + app source analysis**

## 1. Dashboard Features Inventory

The frontend is a single-file SPA (`app/index.html`, >1MB) with tab-based navigation plus two standalone pages.

### Main Dashboard Tabs (app/index.html)

| Tab | State Object | Data Source | Description |
|-----|-------------|-------------|-------------|
| Dashboard | `crashState.aggregates` | Pre-computed county-wide stats | Summary cards, severity breakdown, trends |
| Analysis | `crashState.aggregates` | Pre-computed county-wide stats | Deeper statistical analysis, charts |
| Map | `crashState.sampleRows` | Raw crash rows + filters | Interactive map, year/route/severity filters |
| Hotspots | `crashState.aggregates.byRoute` | Route-level aggregates | Top crash locations ranked by EPDO |
| CMF / Countermeasures | `cmfState.filteredCrashes` | Location + date filtered | CMF recommendations for selected location |
| Warrants | `warrantsState.filteredCrashes` | Location + date filtered | MUTCD signal warrant analysis |
| Grants | `grantState.allRankedLocations` | All routes ranked | Grant eligibility scoring |
| Before/After Study | `baState.locationCrashes` | Location filtered | Treatment effectiveness analysis |
| Safety Focus | `safetyState.data[category]` | Category + date filtered | Pedestrian, bike, intersection, speed, etc. |
| AI Assistant | Context-aware | Adapts to selected location or county-wide | Natural language crash analysis |

### Standalone Pages

| Page | File | Description |
|------|------|-------------|
| Sign & Signal Deficiency | `app/asset-deficiency.html` | MUTCD warrant analysis with HPMS/school/rail/transit/NBI enrichment |
| Traffic Inventory | `app/traffic-inventory.html` | Mapillary sign/signal asset viewer |

---

## 2. Data Fetch Points (Current R2 Paths)

### R2 URL Pattern
```
https://data.aicreatesai.com/{state}/{jurisdiction}/{road_type}.parquet
```

### Road Type Files Per Jurisdiction
- `all_roads.parquet` — all crashes (no filter)
- `state_roads.parquet` — Ownership = State Hwy Agency
- `primary_roads.parquet` — FC 1-2 (Interstate + Freeway)
- `non_dot_roads.parquet` — Ownership != State
- `county_roads.parquet` — Ownership = County
- `city_roads.parquet` — Ownership = City/Town
- `no_interstate.parquet` — FC != 1-2

### R2 Folder Hierarchy
```
{state}/
+-- _state/              -> state-level files
+-- _region/             -> DOT District files
+-- _mpo/                -> MPO files
+-- _planning_district/  -> PD files
+-- {county}/            -> county-level files (primary current use)
+-- {city}/              -> city-level files
```

### Parser: hyparquet (SNAPPY/UNCOMPRESSED only)
Full dataset loaded into `crashState.sampleRows[]` array, then client-side aggregation builds `crashState.aggregates`.

---

## 3. Column Usage Map

### Columns Used for FILTERING (need Supabase indexes)

| Column | Used By | Filter Type |
|--------|---------|-------------|
| Crash Severity | All tabs | KABCO filter |
| Crash Year | Map, CMF, Warrants, Safety, B/A | Year range |
| Crash Date | CMF, Warrants, B/A | Date range |
| Physical Juris Name | Jurisdiction selector | Exact match |
| Ownership | Road type filter profiles | Category |
| Functional Class | Analysis, FC gate | Category |
| RTE Name | Map, Hotspots, CMF | Route selection |
| Intersection Type | Warrants, Intersection analysis | Category |
| DOT District | Region tier | Exact match |
| MPO Name | MPO tier | Exact match |
| Planning District | PD tier | Exact match |

### Columns Used for AGGREGATION (matview candidates)

| Column | Aggregation | Used By |
|--------|------------|---------|
| Crash Severity | COUNT per K/A/B/C/O | Dashboard cards, charts |
| Crash Year | GROUP BY year | Trend charts |
| Collision Type | COUNT per type | Analysis, Safety Focus |
| Functional Class | COUNT per FC | Analysis |
| Area Type | COUNT per urban/rural | Analysis |
| K_People | SUM | Fatal count |
| A_People | SUM | Serious injury count |
| Persons Injured | SUM | Injury total |
| Pedestrian? | COUNT WHERE Yes | Safety Focus |
| Bike? | COUNT WHERE Yes | Safety Focus |
| Speed? | COUNT WHERE Yes | Safety Focus |
| Animal Related? | COUNT WHERE Yes | Safety Focus |
| Alcohol? | COUNT WHERE Yes | Safety Focus |
| Distracted? | COUNT WHERE Yes | Safety Focus |
| Night? | COUNT WHERE Yes | Safety Focus |
| School Zone | COUNT WHERE Yes | Safety Focus |
| Weather Condition | COUNT per type | Analysis |
| Light Condition | COUNT per type | Analysis |
| Max Speed Diff | Histogram bins | Speed analysis |

### Columns Used for DISPLAY ONLY (stay in raw table / road_data JSONB)

| Column | Used By |
|--------|---------|
| x, y (coordinates) | Map dots |
| Document Nbr | Crash detail panel |
| RTE Name | Map tooltip, detail |
| Intersection Name | Map tooltip |
| Intersection Analysis | Detail panel |
| Traffic Control Type | Detail panel |
| Roadway Surface Type | Detail panel |
| Roadway Alignment | Detail panel |
| Roadway Description | Detail panel |
| Vehicle Count | Detail panel |
| All ranking columns (*_Rank_*) | Hotspot ranking |

### EPDO Calculation
```
EPDO_WEIGHTS = { K: 462, A: 62, B: 12, C: 5, O: 1 }
```
Used in: Dashboard, Hotspots, Grants, CMF, Warrants, Asset Deficiency.

---

## 4. Client-Side Aggregations (Materialized View Candidates)

### Aggregation 1: Severity Summary by Year
```
GROUP BY crash_year, crash_severity
SELECT COUNT(*), SUM(k_people), SUM(a_people), SUM(persons_injured)
```
Used by: Dashboard cards, trend line chart. **MATVIEW: YES**

### Aggregation 2: Route-Level Hotspots
```
GROUP BY rte_name, physical_juris_name
SELECT COUNT(*), severity counts, EPDO score
```
Used by: Hotspots tab, Grants tab. **MATVIEW: YES**

### Aggregation 3: Safety Focus Categories
```
For each flag (ped, bike, speed, alcohol, animal, distracted, night, school):
  WHERE {flag} = 'Yes'
  GROUP BY crash_year
  SELECT COUNT(*), severity breakdown
```
Used by: Safety Focus tab. **MATVIEW: MAYBE** (can fold into dashboard_summary)

### Aggregation 4: Intersection / FC / Area Type / Collision Type Distributions
```
GROUP BY intersection_type / functional_class / area_type / collision_type
SELECT COUNT(*), severity breakdown
```
Used by: Analysis tab charts. **MATVIEW: Fold into dashboard_summary**

---

## 5. Recommended Materialized Views

### View 1: `dashboard_summary` (replaces crashState.aggregates)
```sql
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT
  state,
  physical_juris_name,
  dot_district,
  mpo_name,
  planning_district,
  crash_year,
  crash_severity,
  functional_class,
  area_type,
  collision_type,
  COUNT(*) as crash_count,
  SUM(k_people) as fatals,
  SUM(a_people) as serious_injuries,
  SUM(persons_injured) as total_injured,
  SUM(CASE WHEN pedestrian = 'Yes' THEN 1 ELSE 0 END) as ped_crashes,
  SUM(CASE WHEN bike = 'Yes' THEN 1 ELSE 0 END) as bike_crashes,
  SUM(CASE WHEN speed = 'Yes' THEN 1 ELSE 0 END) as speed_crashes,
  SUM(CASE WHEN alcohol = 'Yes' THEN 1 ELSE 0 END) as alcohol_crashes,
  SUM(CASE WHEN night = 'Yes' THEN 1 ELSE 0 END) as night_crashes,
  SUM(CASE WHEN animal_related = 'Yes' THEN 1 ELSE 0 END) as animal_crashes
FROM crashes
GROUP BY 1,2,3,4,5,6,7,8,9,10;
```
**Size:** ~50K rows for Delaware (10 years x 5 severity x ~100 combos). Instant queries.
**Refresh:** After each pipeline sync (already in supabase_sync.py finalize step).

### View 2: `jurisdiction_baselines` (already exists - 81 rows)
14 metrics per jurisdiction. Keep as-is.

### View 3: `federal_summary` (already exists - 1,800 rows)
Cross-state aggregation. Keep as-is.

---

## 6. Recommended Supabase Indexes

```sql
-- Tier navigation
CREATE INDEX idx_crashes_state ON crashes(state);
CREATE INDEX idx_crashes_juris ON crashes(physical_juris_name);
CREATE INDEX idx_crashes_district ON crashes(dot_district);
CREATE INDEX idx_crashes_mpo ON crashes(mpo_name);
CREATE INDEX idx_crashes_pd ON crashes(planning_district);

-- Temporal
CREATE INDEX idx_crashes_year ON crashes(crash_year);
CREATE INDEX idx_crashes_date ON crashes(crash_date_parsed);

-- Severity
CREATE INDEX idx_crashes_severity ON crashes(crash_severity);

-- Map viewport (PostGIS)
CREATE INDEX idx_crashes_geom ON crashes USING GIST(geom);

-- Route queries
CREATE INDEX idx_crashes_route ON crashes(rte_name);

-- Composite for common dashboard queries
CREATE INDEX idx_crashes_state_year_sev ON crashes(state, crash_year, crash_severity);
CREATE INDEX idx_crashes_juris_year ON crashes(physical_juris_name, crash_year);
```

---

## 7. Migration Path (R2 -> Supabase Per Feature)

| Phase | Features | Source | Risk | Fallback |
|-------|----------|--------|------|----------|
| 1 | Dashboard + Analysis summary cards/charts | `dashboard_summary` matview | Low | R2 parquet + client aggregation |
| 2 | Map dots + crash detail | Raw `crashes` table + PostGIS viewport | Medium | Full R2 parquet |
| 3 | Safety Focus categories + Hotspots | `dashboard_summary` matview | Low | Client-side aggregation |
| 4 | CMF + Warrants + Grants + B/A | Raw table filtered by location | Medium | R2 parquet filtered |
| 5 | Tier Navigation UI (7 levels) | All of above with tier WHERE clauses | Low | County R2 parquet |
| 6 | Auth + RLS for agency access | Supabase Auth + row policies | Large | Firebase Auth |

---

## 8. Data Client Architecture

```
    Tier Selector UI
    Federal > State > Region > County
              |
       data-client.js
        (dual source)
        /          \
   Supabase      R2 Parquet
   (try first)   (fallback)
```

| Data Need | Supabase Source | R2 Fallback |
|-----------|---------------|-------------|
| Summary cards/charts | `dashboard_summary` matview | Load parquet, aggregate client-side |
| Map dots (viewport) | `crashes` + PostGIS `ST_MakeEnvelope` + LIMIT 5000 | Load full parquet |
| Crash detail table | `crashes` + pagination (25 rows/page) | Filter loaded parquet |
| Single crash detail | `crashes` WHERE objectid = X | Lookup in loaded array |
| Safety Focus | `dashboard_summary` WHERE category flag | Filter loaded parquet |
| Hotspots ranking | `crashes` GROUP BY rte_name (or matview) | crashState.aggregates.byRoute |

---

## 9. When Frontend Changes Need Matview Updates

| Change Type | Matview Update? | Example |
|-------------|----------------|---------|
| Layout/CSS/chart type | NO | Changing chart colors |
| New filter on existing column | NO | "Show only night crashes" |
| New tab using existing columns | NO | New "Elderly Driver" tab |
| New summary metric not yet computed | YES | "Average crashes per mile" |
| New pipeline column added | Refresh only | New flag from enrichment |
