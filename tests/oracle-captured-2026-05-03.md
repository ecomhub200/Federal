# Supabase `dashboard_summary` Oracle — Captured 2026-05-03

- **Captured at:** `2026-05-03T04:22:32.297Z`
- **State:** `delaware`
- **Supabase URL:** `https://srv1503081.hstgr.cloud/rest/v1`
- **Source:** `scripts/capture-oracle-browser.js` (browser fallback — sandbox egress to `srv1503081.hstgr.cloud` returned HTTP 403)

## Invariants

| ID  | Name                              | Result |
| --- | --------------------------------- | ------ |
| I1  | road_type partition complete      | ✅ pass |
| I2  | road_type sums to state           | ✅ pass |
| I3  | is_interstate sums to state       | ✅ pass |
| I4  | planning_district sums to state   | ✅ pass |
| I5  | rollup is necessary (q15 > q27)   | ✅ pass |

All four blocking invariants (I1–I4) ✅. Advisory I5 also ✅.

## Oracle Queries

| ID                              | Rows   | Sum (crash_count) |
| ------------------------------- | -----: | ----------------: |
| q01_federal_allRoads            | 58,745 |           569,829 |
| q02_state_DE_allRoads           | 58,745 |           569,829 |
| q03_state_DE_dot_roads          | 40,745 |           438,501 |
| q04_state_DE_county_roads       |  7,883 |            39,885 |
| q05_state_DE_city_roads         |  9,301 |            81,315 |
| q06_state_DE_other_roads        |    816 |            10,128 |
| q07_state_DE_nonDOT             | 18,000 |           131,328 |
| q08_state_DE_no_interstate      | 57,075 |           529,069 |
| q09_state_DE_interstate_only    |  1,670 |            40,760 |
| q10_region_North                | 24,661 |           337,469 |
| q11_region_North_dot_roads      | 16,910 |           262,292 |
| q12_region_Central              | 15,296 |            98,201 |
| q13_region_South                | 18,788 |           134,159 |
| q14_pd_North                    | 24,661 |           337,469 |
| q15_pd_Central                  | 15,296 |            98,201 |
| q16_pd_South                    | 18,788 |           134,159 |
| q17_pd_Central_no_interstate    | 15,125 |            97,877 |
| q18_pd_Central_county_roads     |  2,033 |             8,694 |
| q19_pd_South_no_interstate      | 18,766 |           134,123 |
| q20_mpo_WAPC_all                | 23,851 |           335,962 |
| q21_mpo_WAPC_dot_roads          | 16,237 |           260,967 |
| q22_mpo_WAPC_county_roads       |  3,399 |            17,546 |
| q23_mpo_WAPC_no_interstate      | 22,387 |           295,576 |
| q24_mpo_DKC_all                 | 19,002 |           107,908 |
| q25_mpo_SW_all                  | 15,838 |           125,901 |
| q26_mpo_DVRPC_all               |     54 |                58 |
| q27_county_Kent_all             |  5,038 |            38,614 |
| q28_county_Kent_no_interstate   |  4,936 |            38,380 |
| q29_county_Sussex_all           |  5,059 |            87,073 |
| q30_county_NewCastle_all        |  6,046 |           190,158 |
| q31_city_Wilmington_all         |  2,104 |            61,355 |
| q32_city_Dover_all              |  2,034 |            33,583 |
| q33_city_Newark_all             |  1,368 |            22,123 |
| q34_city_Ardentown_all          |     46 |                49 |
| q35_city_Ardentown_county_roads |      0 |                 0 |

## Distinct Values

### q36 — `road_type` (rows scanned: 58,745)

- `city_roads`
- `county_roads`
- `dot_roads`
- `other_roads`

### q37 — `dot_district` (state=delaware, rows scanned: 58,745)

- `Central District`
- `North District`
- `South District`

### q38 — `planning_district` (state=delaware, rows scanned: 58,745)

- `Central District`
- `North District`
- `South District`

### q39 — `mpo_name` (state=delaware, rows scanned: 58,745)

- `Delaware Valley Regional Planning Commission`
- `Dover / Kent County MPO`
- `Salisbury-Wicomico MPO`
- `Wilmington Area Planning Council`
