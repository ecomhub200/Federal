# Delaware End-to-End QA — Living Report

> Scope: comprehensive tier × road-type × tab × filter examination of Delaware (frontend + backend), accuracy reconciliation, and gap development. Backend DB: self-hosted Supabase at `srv1503081.hstgr.cloud`. Started 2026-06-16.

## Status

| Phase | State |
|---|---|
| 0 — Backend ground-truth | ✅ complete |
| 1 — Playwright matrix sweep | 🟡 harness operational; automated full sweep flaky; key cells verified via driven browser |
| 2 — Accuracy reconciliation | 🟡 baseline + date-filter verified; **date-filter bug found** |
| 3 — Backend gap development | ⏳ not started (sequenced after sweep) |
| 4 — Frontend filter wiring + fixes | ⏳ not started |
| 5 — Report + PR | ⏳ in progress (this doc) |

---

## 🔴 BUG-1 (HIGH) — Dashboard date filter returns an extra prior year (~2× counts)

**Reproduced cleanly on the live deployed app**, Delaware / State tier / All Roads:

| State | kpiTotal | kpiFatal |
|---|---|---|
| No date filter | 569,829 ✅ (= raw truth) | 1,791 ✅ |
| Date filter `2024-01-01 → 2024-12-31` | **74,446** ❌ | **255** ❌ |

- SQL truth for crash_year **2024 only** = **37,177**. The 2023 row = 37,269.
  **37,269 + 37,177 = 74,446** — i.e. the "2024" filter returns **2023 + 2024**.
- `FilterEngine.getSpec()` at the time of the wrong number was **correct**:
  `year_start=2024, year_end=2024, date_start=2024-01-01, date_end=2024-12-31`.
  So the spec is right — the bug is **downstream**, in the KPI aggregate builder
  that turns the spec into the matview query/sum. `paintKPIs()`
  ([app/modules/data/supabase-bridge.js:548](../../app/modules/data/supabase-bridge.js))
  renders `agg.total` / `agg.byYear`, and `agg.byYear` contained **both 2023 and
  2024** — the upstream fetch pulled one extra prior year.
- This is a **data-accuracy** defect: every single-year (and likely every
  N-year) date-filtered dashboard number is inflated by the adjacent prior year.
- Per-tab note: date behavior is tier/road-type-invariant, but this bug is in a
  **shared** dashboard aggregate path, so it affects the Dashboard at every tier.

### Related code-level defect (separate, lower impact)
- [app/modules/dashboard/dashboard-tab-kpi.js:212](../../app/modules/dashboard/dashboard-tab-kpi.js) —
  `const start = new Date(f.startDate)` parses `'2024-01-01'` as **UTC**, which is
  `2023-12-31` in US time zones (test browser is EST/UTC-5). This is the
  county-tier **sampleRows** date path; it leaks ~1 extra day (Dec-31 of the
  prior year), not a whole year, but it is the same class of timezone bug and
  should be fixed with a local-date parse (`new Date(y, m-1, d)`), matching the
  `parseRptLocal` helper already used in `reports/reports-pdf.js`.

### `_r18ApplyDashboardYearFilter` query smell (to review during the fix)
- [app/modules/data/dashboard-filter-bindings.js:290–298](../../app/modules/data/dashboard-filter-bindings.js)
  fetches `dashboard_summary` with `state=eq.<state>` + `crash_year` range but
  **`limit: 2000`**. Delaware/2024 alone is **3,697 rows** in `dashboard_summary`
  — so this path silently **truncates** (under-counts) for any large single-year
  slice. It also does not pin `is_interstate IS NULL`, but since dashboard_summary
  rows are non-overlapping (each crash in exactly one road_type×is_interstate
  cell) that does not double here — the `limit` is the real risk.

## ✅ Verified-correct so far (driven browser + SQL)
- DE / State / All Roads, **no filter**: dashboard total 569,829 and fatal 1,791
  match the raw `crashes` table exactly.
- District partition integrity: North 337,469 + South 134,159 + Central 98,201 =
  569,829 (matviews partition correctly by `dot_district`/`planning_district`).
- **Doubling-on-all-roads (the old memory note) is NOT reproducing** — the
  no-filter all-roads total is exactly correct, and `getDashboardTierKpi` pins
  both `road_type IS NULL AND is_interstate IS NULL`
  ([assets/js/data-client.js:1623-1625](../../assets/js/data-client.js)).
  The previously-noted 2× was fixed by the 2026-06-11 migration. The live 2× now
  appears only **under a date filter** (BUG-1 above) — a different root cause.

## Honest coverage statement
- **NOT yet done:** a complete tier × road-type × tab × date-preset UI sweep. The
  automated harness (`tests-e2e/`) is now installable + auto-auth works, but the
  full unattended run was flaky on this machine and has not produced a clean
  matrix. Date-filter behavior has been verified on the **Dashboard** only so far
  (where BUG-1 was found); the other 15 tabs' date filters are not yet UI-verified.

---

## Phase 0 — Backend ground-truth (complete)

### 0.1 Delaware base facts (raw `crashes` table)
- **Total crashes: 569,829** (years **2009–2025**; plus a `crash_year=0` bad-date sentinel = 3 rows).
- **Severity is 3-level only — no B/C in the database:** K = 1,791 · A = 88,872 · O = 479,166. `A` lumps all injuries. EPDO for DE is effectively K/A/O only. (Matches the known "DE has no B/C severity — keep as-is" decision.)
- **Road ownership IS populated** (corrects the stale onboarding doc):
  | ownership | crashes | road_type bucket |
  |---|---|---|
  | 1. State Hwy Agency | 438,501 | dot_roads |
  | 3. City or Town Hwy Agency | 81,315 | city_roads |
  | 2. County Hwy Agency | 39,885 | county_roads |
  | 4. Federal / 6. Private / null | 404 / 129 / 9,595 | other_roads (10,128) |
  → **Road-type filtering is genuinely viable for Delaware.** County/City/State-route filters return real data, not empty. This revises plan scope decision #1 (which assumed DE had no ownership data).

### 0.2 Matview inventory (35 matviews) — dimension presence
Queried live via `pg_matviews` + `pg_attribute`. Key dimension columns per matview:

**Has `road_type` already (most do):** dashboard_summary, mv_dashboard_tier_kpi, mv_analysis_summary, mv_analysis_extra, mv_crash_tree, mv_hotspots, mv_hotspots_with_rates, mv_grant_ready_locations, mv_grants_baseline, mv_intersection_summary, mv_location_picker, mv_map_points, mv_pedbike_breakdowns, mv_pedbike_locations, mv_safety_categories, mv_safety_focus_locations.

**Missing `road_type`:** **mv_fatal_factors, mv_speed_summary** (Fatal & Speeding tab), mv_safety_categories_yearly, mv_safety_co_factors, mv_hotspots_yearly, mv_map_crashes, scorecard_rankings, scorecard_summary, federal_summary.

**Has date dimension (`crash_year`):** dashboard_summary, mv_dashboard_tier_kpi, mv_fatal_factors, mv_speed_summary, mv_grants_baseline, mv_intersection_summary, mv_map_points, mv_map_crashes, mv_hotspots_yearly, mv_safety_categories_yearly, mv_speed_severity_matrix, scorecard_*, federal_summary.

**Missing date dimension (`crash_year`) — the real gap:** **mv_analysis_summary, mv_analysis_extra, mv_crash_tree, mv_hotspots, mv_hotspots_with_rates, mv_safety_categories, mv_pedbike_breakdowns, mv_pedbike_locations, mv_safety_focus_locations, mv_safety_co_factors, mv_location_picker, mv_grant_ready_locations.** No matview has `crash_month`.

> **Reframing vs. the original exploration:** the explorer agents read stale SQL migration files and concluded road_type was broadly missing. Live DB shows the opposite — **road_type is mostly present; the dominant gap is the date (`crash_year`) dimension** on ~12 aggregate matviews. So "date filter does nothing on Crash Tree / Analysis / Hot Spots / Ped/Bike / Safety Focus" is a **real backend gap**, while road-type is mostly a **frontend-wiring** question.

### 0.3 `mv_dashboard_tier_kpi` — the "2× doubling" explained
Columns: `state, tier, jurisdiction_id, jurisdiction_name, crash_year, road_type, is_interstate, crashes, fatals, serious, injuries, ped, bike, speed, alcohol, night, epdo`.

For DE / `tier=state`, the matview stores **three overlapping representations of the same total** (per year):
- grand total `(road_type=NULL, is_interstate=NULL)` = **569,829** ✓ (= raw)
- road_type partition (city 81,315 + county 39,885 + dot 438,501 + other 10,128) = 569,829 ✓
- is_interstate partition (false 529,069 + true 40,760) = 569,829 ✓

**The data is internally correct.** The doubling is a **query-construction hazard**: selecting "All Roads" must pin **both** `road_type IS NULL AND is_interstate IS NULL`. A query that filters only `road_type IS NULL` pulls the is_interstate marginal rows too → 2× (and other partial filters can 1.5×/2×). → Fix is primarily **frontend query construction** (Phase 4); optionally harden the matview to a single non-overlapping representation (Phase 3).

### 0.4 Tier coverage (`mv_dashboard_tier_kpi`, DE)
`state`(1), `dot_district`(3 = North/Central/South), `mpo`(4), `planning_district`(3), `jurisdiction`(81 = cities/towns + unincorporated). No `county` tier row (county selections roll up to planning_district/dot_district by design via `resolveTier`); Federal is served by the separate `federal_summary` matview.

### 0.5 Advisors (low priority, out of scope for this pass)
- INFO: `stripe_events` RLS enabled, no policy.
- WARN ×19: `function_search_path_mutable` on many functions (incl. `refresh_crash_lens_matviews`, `map_viewport_crashes`, `run_before_after_study`, `search_knowledge_corpus`).
- WARN ×4: extensions in `public` schema (postgis, pg_trgm, pg_prewarm, vector).
These are standard hardening items; noted, not addressed in this correctness pass.

### 0.6 Revised gap list (drives Phase 3 / Phase 4)
1. **Date dimension missing** on ~12 aggregate matviews → date filter silently ignored on Crash Tree, Analysis, Hot Spots, Ped/Bike, Safety Focus, location picker, grants-ready. **(Phase 3: add `crash_year`.)**
2. **`road_type` missing** on Fatal & Speeding matviews (`mv_fatal_factors`, `mv_speed_summary`) and a few others. **(Phase 3: add `road_type`.)**
3. **KPI doubling** = overlapping marginal rows; fix query construction (Phase 4) ± harden matview (Phase 3).
4. **Frontend not threading** road_type/date params to several tabs even where columns exist. **(Phase 4.)**
5. **`hierarchy.json`** duplicate/empty MPO entry `dover_kent_county_mpo`. **(Phase 4.)**
6. DE severity is K/A/O only and `crash_year=0` sentinel exists — verify the frontend handles both gracefully (no fake B/C, exclude year 0 from filters).
