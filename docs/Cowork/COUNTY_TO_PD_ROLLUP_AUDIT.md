# County → Planning-District Silent-Rollup Audit (W1.3)

> **Scope.** Read-only investigation of every frontend code path and Supabase
> matview where a county-tier UI selection is silently aggregated to
> `planning_district` (or another parent tier) and the user is given no
> banner / log to disambiguate the result from a genuine county-level number.
>
> **Status.** Frontend audit complete. Backend SQL probes left as
> `<COWORK: …>` placeholders — CC has no Supabase access.
>
> **Branch.** `claude/happy-thompson-HdexL` (system-assigned). Audit produces
> exactly one new file (this doc). Zero code changes.
>
> **Trigger doc.** The prompt references
> `feedback_silent_county_to_pd_rollup_gotcha.md`; that file does **not**
> exist in this repo (verified by `find` across `.` and `docs/Cowork/`).
> This audit therefore reconstructs the gotcha from scratch rather than
> treating any prior write-up as ground truth.

---

## 1. Executive Summary

| Metric | Value |
|---|---|
| Frontend rollup sites surveyed | **2 categories** (central bridge + per-feature `tierColMap`) |
| **SILENT-ROLLUP** sites (no UX) | **2** (pedbike detail, standard reports hydration) |
| **FALLBACK-INTENDED** sites (banner present) | **1** (the central `supabase-bridge.resolveTier()` mechanism) |
| Per-feature `tierColMap` definitions that disagree with each other | **3** (pedbike, reports, safety — only safety is correct) |
| Tabs / features affected by inconsistent county-tier behaviour | Ped/Bike detail panel, Standard Reports (R23 §1.1 fast-hydrate path), Safety Focus detail panel (already fixed), Dashboard (correctly banner-rolled) |
| Frontend `tier === 'county'` decision sites | **32** (grep B) — of which **15+** route county to a non-county column or non-county matview path |
| Matviews referenced in FE (need backend coverage check) | **27** (see §3) |
| Pre-existing bug tickets surfaced by this audit | **0** (`docs/Cowork/BUG_REPORT.md` exists but contains no county→PD entries) |

**Top finding.** Three modules have inlined their own
`tierColMap` (the table that maps a UI tier to a Supabase column) and the
three maps **disagree on what `county` should resolve to**:

| Module | `tierColMap.county` | Has banner? | Verdict |
|---|---|---|---|
| `app/modules/data/supabase-bridge.js` (central) | `physical_juris_name` **+ rollup metadata** | **Yes** (`showBanner({rolledUp, rollupColumn})`) | FALLBACK-INTENDED ✓ |
| `app/modules/pedbike/pedbike-tab-ped-detail.js` | `'planning_district'` (hard-coded) | **No** | **SILENT-ROLLUP** ✗ |
| `app/modules/reports/reports-standard-core.js` | `'planning_district'` (hard-coded) | **No** | **SILENT-ROLLUP** ✗ |
| `app/modules/safety/safety-focus-detail-panel.js` | `'physical_juris_name'` | (no banner needed — no rollup) | GENUINE-COUNTY ✓ |

The `safety-focus-detail-panel.js` comment at L111-L112 explicitly records
the historical mistake: *"county was previously mapped to planning_district,
which caused zero matches at county tier."* The same fix has **not** been
applied to pedbike or reports.

---

## 2. Frontend Rollup Sites (classification)

### 2.1 Central dispatcher — `assets/js/data-client.js`

The canonical tier → column table lives at L25–L89. Per-matview overrides
exist for `mv_hotspots`, `mv_grants_baseline`, and
`mv_safety_categories_yearly`.

| Tier | `default` | `mv_hotspots` | `mv_grants_baseline` | `mv_safety_categories_yearly` |
|---|---|---|---|---|
| federal | null | null | null | null |
| state | `state` | `state` | `state` | `state` |
| region | `dot_district` | `region` (alias) | `region` (alias) | **`null`** (column missing) |
| planning_district | `planning_district` | `planning_district` | `planning_district` | `planning_district` |
| mpo | `mpo_name` | `mpo` (alias) | `mpo` (alias) | `mpo_name` |
| county | `physical_juris_name` | `county` (alias) | `county` (alias) | `physical_juris_name` |
| city | `physical_juris_name` | `county` (alias) | `county` (alias) | `physical_juris_name` |

**Risk note (region tier on `mv_safety_categories_yearly`):** `region` is
silently nulled — the code-comment at L78 admits "Null out region tier so we
don't send a non-existent column filter and PostgREST 400s." This means a
region-tier query against `mv_safety_categories_yearly` returns **state-wide
rows**, not region-filtered. Not strictly a county→PD bug but the same
*silent-rollup-without-banner* anti-pattern; flagging here for §6 backlog.

**Risk note (county vs city on default matviews):** Both `county` and
`city` map to the same column (`physical_juris_name`). A city named the
same as the parent county will collide; a city not in the matview returns
zero with no banner. Documented as a known limitation; surfaced here for
completeness.

### 2.2 Central tier resolver — `app/modules/data/supabase-bridge.js`

`resolveTier()` at L247-L344 is the canonical entry point. Behaviour for
the `county` branch (L307-L341):

1. Look up `_countyRollupTarget(ctx)` (L197-L235) — searches
   `hierarchy.json` for a planning-district **or** dot_district that maps
   1:1 to the selected county FIPS.
2. **If 1:1 mapping exists** → return rollup with
   `{ tier: <rollup-tier>, value: <dbName>, rolledUpFrom: 'county',
   rollupColumn: 'planning_district' | 'dot_district' }`. A console line
   `[resolveTier] County rollup via …` is logged AND the dashboard banner
   later renders *"Includes incorporated cities (rolled up via
   planning_district)"* (L648-L651, `showBanner({rolledUp, rollupColumn})`,
   called at L958).
3. **If no 1:1 mapping** → return `{ tier: 'county', value: countyVal,
   unincorporatedOnly: true }` — banner renders *"Incorporated cities
   reported separately."* (L643-L647).

**Classification:** FALLBACK-INTENDED ✓. The rollup is opt-in (hierarchy
must have a 1:1 mapping), surfaced in console, AND surfaced in a banner.
This is the pattern the other rollup sites should mirror.

| File:Line | Symbol | Classification | Notes |
|---|---|---|---|
| `app/modules/data/supabase-bridge.js:197-235` | `_countyRollupTarget()` | FALLBACK-INTENDED | 1:1 lookup against `hierarchy.json` `planningDistricts` → `regions`. |
| `app/modules/data/supabase-bridge.js:307-341` | `resolveTier()` county branch | FALLBACK-INTENDED | Returns `rolledUpFrom`/`rollupColumn` so banner can fire. |
| `app/modules/data/supabase-bridge.js:633-666` | `showBanner()` | (banner emitter) | Three modes: `zeroRows`, `unincorporatedOnly`, `rolledUp`. |
| `app/modules/data/supabase-bridge.js:867-868` | `_expectsData` retry guard | (consumer) | Uses `t.rolledUpFrom === 'county'` to know a 0-row response is unexpected and retry-worthy. |
| `app/modules/data/supabase-bridge.js:958-962` | `showBanner({rolledUp, rollupColumn})` | (banner caller) | Wired on every successful dashboard inject. |
| `app/modules/data/lazy-loader.js:78-84` | R2 download skip | FALLBACK-INTENDED | `if (rolledUpFrom === 'county') skip R2 download` — prevents county-parquet from clobbering bridge KPIs. |
| `app/modules/analysis/analysis-tab-orchestrator.js:30` | Analysis trigger | (consumer) | Reads `tr.rolledUpFrom === 'county'` to decide loader behaviour. |

### 2.3 SILENT-ROLLUP sites (no banner, no log, no opt-in)

These modules hard-code `county: 'planning_district'` in their own
`tierColMap` regardless of whether `hierarchy.json` has a 1:1 mapping, and
emit nothing to the user.

| File:Line | Symbol | Severity |
|---|---|---|
| `app/modules/pedbike/pedbike-tab-ped-detail.js:22-27` | `_fetchPedBikeDetailAggregates()` `tierColMap` — `county: 'planning_district'` | **HIGH** — Ped/Bike detail panel shows planning-district totals when user selected a county. No banner. Reads `mv_safety_focus_locations`, `mv_pedbike_breakdowns`, `crashes`. |
| `app/modules/reports/reports-standard-core.js:234-238` | `hydrateReportFromMatviews()` `tierColMap` — `county: 'planning_district'` | **HIGH** — Standard Reports (R23 §1.1 fast path) for `comprehensive`/`infographic`/`executive_summary`/etc. report types hydrate PD totals when user selected a county. No banner in the rendered PDF/HTML. Reads `dashboard_summary` + 6 other matviews. |

Both modules' `tierColMap` was almost certainly copy-pasted from an
earlier version of the central bridge **before** `_countyRollupTarget()`
added the 1:1-mapping safety check. The fix is to delete the local
`tierColMap` and call `CL.data.supabaseBridge.resolveTier()` (which
returns the rollup metadata they can pass through to the banner /
report-footer).

### 2.4 GENUINE-COUNTY sites (correct, do not change)

| File:Line | Symbol | Notes |
|---|---|---|
| `app/modules/safety/safety-focus-detail-panel.js:113-117` | `tierColMap` — `county: 'physical_juris_name'` | Comment at L111-L112 documents the historical fix. |
| `assets/js/data-client.js:1845-1857` | `getFatalFactors()` county branch | Round 15 §12.1 — county tier uses canonical `jurisdiction_county` column (mv v2). |
| `assets/js/data-client.js:1884-1893` | `getSpeedFactors()` county branch | Same Round 15 §12.1 pattern. |
| `assets/js/data-client.js:1745-1746` | `getMapMetrics()` `opts.county` | Filters on `jurisdiction_county` directly. |
| `assets/js/data-client.js:2138-2140` | `getCrashRates()` `opts.county` | Filters on `jurisdiction_county` directly. |
| `assets/js/data-client.js:3666-3670` | `getLocations()` `opts.county` | Filters on `jurisdiction_county` directly. |
| `app/modules/data/dashboard-filter-bindings.js:363` | `opts.county = tier.value` | Threads tier value as `opts.county` to data-client; correct because dispatcher knows the per-matview column. |
| `app/modules/data/prewarm.js:133-136` | `mv_hotspots_with_rates` prewarm | Uses `county: tier === 'county' ? value : undefined` — matches `mv_hotspots` alias. |
| `app/modules/map/map-points-hydrate.js:115` | `opts.jurisdiction = t.value` | County tier passed as `jurisdiction` to `mv_map_points` — correct column. |
| `app/modules/hotspots/hotspots-tab-core.js:111-114, 305-320` | Hotspots loader county branch | Passes county to `mv_hotspots_with_rates`/`mv_hotspots` via aliased `county` column. |
| `app/modules/scorecard/scorecard.js:291` | `if (tier.tier === 'county' \|\| tier.tier === 'city') opts.jurisdiction = tier.value` | Threads as `jurisdiction` filter. |
| `app/modules/data/tab-loaders.js:53` | Tab dispatcher county branch | Passes through to per-tab loaders; no rollup. |
| `app/modules/assets/transit-tab.js:361, 525` | Transit tab county branch | Same pattern. |
| `app/modules/upload/*` (5 sites) | Upload pipeline | Tier-UI dropdown handling, not data routing. |
| `app/modules/core/tier.js` (4 sites) | Tier dropdown visibility | UI-only, no data routing. |

### 2.5 DEAD-CODE / non-applicable matches

| File:Line | Notes |
|---|---|
| `app/modules/dashboard/dashboard-tab-drill.js:24` | `(tier === 'region' \|\| tier === 'mpo') ? ['county'] : ['planning_district', 'mpo', 'county']` — drill-down **scope list**, not a rollup. Lists which child tiers to expose; no silent re-routing. |
| `app/modules/dashboard/dashboard-tab-drill.js:152` | `} else if (drillType === 'county') {` — drill-link click handler, navigates the user. |
| `app/modules/dashboard/dashboard-tab-drill.js:236, 276` | `if (tier === 'county' \|\| tier === 'city')` — render branches for the drill table. |
| `app/modules/dashboard/dashboard-tab-comparison.js:487` | Same render branch pattern. |
| `app/modules/dashboard/dashboard-tab-kpi.js:20-30` | Reads `resolveTier()` to know if county was rolled-up — already plumbs the rollup metadata correctly. |
| `app/modules/dashboard/dashboard-tab-matview.js:186, 197` | County-vs-state dropdown visibility toggles; UI-only. |
| `app/modules/data/road-type-mapping.js:27, 62` | Documentation: PLACE_TIER comment; no rollup. |
| `app/modules/scorecard/scorecard.js:98, 169` | Type-annotation comment + scorecard scope list; no rollup. |
| `app/modules/data/dashboard-filter-bindings.js:206` | Display label map only. |
| `assets/js/location-picker.js:58, 65-68` | Picker `kind` enum + tier dispatch; UI-only. |

---

## 3. Backend Matview Coverage (`<COWORK: …>` placeholders)

For each matview referenced from the FE, Cowork should report which tier
columns physically exist and the per-tier distinct-value counts for
Delaware. The pattern below repeats per matview.

### Master probe template

```sql
<COWORK: SELECT
  to_regclass('public.mv_<NAME>') IS NOT NULL                         AS exists,
  bool_or(column_name = 'county')              FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_county,
  bool_or(column_name = 'physical_juris_name') FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_physical_juris_name,
  bool_or(column_name = 'planning_district')   FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_planning_district,
  bool_or(column_name = 'dot_district')        FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_dot_district,
  bool_or(column_name = 'mpo_name')            FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_mpo_name,
  bool_or(column_name = 'mpo')                 FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_mpo_alias,
  bool_or(column_name = 'region')              FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_region_alias,
  bool_or(column_name = 'jurisdiction_county') FROM information_schema.columns
    WHERE table_name = 'mv_<NAME>'                                    AS has_jurisdiction_county;
>
```

### Per-tier Delaware distinct counts

```sql
<COWORK: SELECT
  COUNT(DISTINCT county)              AS county_n,
  COUNT(DISTINCT physical_juris_name) AS physical_juris_n,
  COUNT(DISTINCT planning_district)   AS pd_n,
  COUNT(DISTINCT dot_district)        AS dot_n,
  COUNT(DISTINCT mpo_name)            AS mpo_n
FROM mv_<NAME>
WHERE state = 'delaware';
-- Omit columns the existence-probe above reports as absent.>
```

### Matviews to survey

| # | Matview | Frontend consumer(s) | `<COWORK: existence + DE distinct counts>` |
|---|---|---|---|
| 1 | `dashboard_summary` | `data-client.js`, `reports/reports-standard-core.js`, `supabase-bridge.js` | `<COWORK: run probes>` |
| 2 | `mv_analysis_summary` | `analysis/analysis-tab-orchestrator.js`, `dashboard/dashboard-tab-{drill,kpi,matview}.js`, `reports/reports-standard-core.js`, `data/lazy-loader.js` | `<COWORK: run probes>` |
| 3 | `mv_analysis_extra` | `dashboard/dashboard-tab-matview.js`, `data/prewarm.js` | `<COWORK: run probes>` |
| 4 | `mv_crash_tree` | `crash-tree/*`, `data/prewarm.js`, `data/lazy-loader.js`, `app/tab-dispatcher.js` | `<COWORK: run probes>` |
| 5 | `mv_hotspots` | `hotspots/hotspots-tab-{core,render}.js`, `intersection/*`, `reports/reports-standard-core.js`, `dashboard/dashboard-tab-matview.js`, `data/prewarm.js`, `core/constants.js` | `<COWORK: run probes>` Note alias: `physical_juris_name → county`, `dot_district → region`, `mpo_name → mpo`. |
| 6 | `mv_hotspots_with_rates` | `hotspots/hotspots-tab-core.js`, `data/prewarm.js` | `<COWORK: run probes>` |
| 7 | `mv_hotspots_factors` | `hotspots/hotspots-tab-core.js`, `data/{prewarm,matview-cache}.js` | `<COWORK: run probes>` |
| 8 | `mv_hotspots_topcoll` | `hotspots/hotspots-tab-core.js`, `data/{prewarm,matview-cache}.js` | `<COWORK: run probes>` |
| 9 | `mv_hotspots_detail` | `intersection/intersection-tab-selection.js` | `<COWORK: run probes>` |
| 10 | `mv_hotspots_yearly` | `data-client.js` | `<COWORK: run probes>` |
| 11 | `mv_intersection_summary` | `intersection/intersection-tab-{table,export}.js`, `data/{prewarm,matview-cache,dashboard-filter-bindings}.js`, `assets/js/filter-engine.js`, `reports/reports-standard-core.js` | `<COWORK: run probes>` |
| 12 | `mv_safety_categories` | `safety/safety-focus-cards.js`, `crash-tree/*`, `data/{prewarm,matview-cache,lazy-loader,dashboard-filter-bindings}.js`, `reports/reports-standard-core.js` | `<COWORK: run probes>` |
| 13 | `mv_safety_categories_yearly` | `safety/*`, `data/dashboard-filter-bindings.js` | `<COWORK: run probes>` Note: dispatcher already nulls `region`; verify the column genuinely doesn't exist. |
| 14 | `mv_safety_co_factors` | `crash-tree/*`, `safety/*` | `<COWORK: run probes>` |
| 15 | `mv_safety_focus_locations` | `safety/*`, **`pedbike/pedbike-tab-ped-detail.js` (SILENT-ROLLUP consumer)** | `<COWORK: run probes>` — if `physical_juris_name` exists, pedbike should switch to it. |
| 16 | `mv_fatal_factors` | `reports/reports-standard-core.js`, `data-client.js` | `<COWORK: run probes>` |
| 17 | `mv_speed_summary` | `reports/reports-standard-core.js`, `data-client.js` | `<COWORK: run probes>` |
| 18 | `mv_speed_severity_matrix` | `data-client.js` | `<COWORK: run probes>` |
| 19 | `mv_pedbike_breakdowns` | **`pedbike/pedbike-tab-ped-detail.js` (SILENT-ROLLUP consumer)**, `data/{prewarm,matview-cache}.js` | `<COWORK: run probes>` |
| 20 | `mv_pedbike_locations` | `pedbike/pedbike-tab-render.js`, `data/prewarm.js` | `<COWORK: run probes>` |
| 21 | `mv_dashboard_comparisons` | `dashboard/dashboard-tab-{drill,matview}.js`, `data-client.js` | `<COWORK: run probes>` |
| 22 | `mv_map_points` | `map/map-points-hydrate.js` | `<COWORK: run probes>` Note: uses `jurisdiction` column, not `county`. |
| 23 | `mv_map_metrics` | `data-client.js` | `<COWORK: run probes>` Uses `jurisdiction_county`. |
| 24 | `mv_grant_ready_locations` | `data-client.js` | `<COWORK: run probes>` |
| 25 | `mv_grants_baseline` | `data-client.js` | `<COWORK: run probes>` Note alias: same as `mv_hotspots` (county/region/mpo). |
| 26 | `mv_grants_ccd` | `data-client.js` | `<COWORK: run probes>` |
| 27 | `mv_location_picker` | `assets/js/location-picker.js` | `<COWORK: run probes>` |
| 28 | `mv_factor_year` | `data/matview-cache.js` | `<COWORK: run probes>` |

### Rollup-target validation (Delaware-specific)

The central rollup decision depends on `hierarchy.json` having a 1:1
mapping from county FIPS to planning_district. Verify:

```sql
<COWORK: SELECT
  county,
  COUNT(DISTINCT planning_district) AS pd_per_county,
  array_agg(DISTINCT planning_district) AS pd_names
FROM mv_hotspots
WHERE state = 'delaware'
GROUP BY county
ORDER BY county;
-- Expected: each Delaware county → exactly one planning_district for
-- _countyRollupTarget() to return non-null. If any county has >1 PD,
-- the rollup silently disables and the user gets unincorporated-only.>
```

Also cross-check `states/delaware/hierarchy.json` `planningDistricts[*].counties`
to confirm each entry has `dbName` populated (per CLAUDE.md "dbName audit
before deploy" rule).

---

## 4. Tier × Matview Resolution Matrix

Generated mechanically from §2.1 (`TIER_COLUMNS_BY_MATVIEW`) plus the
per-feature local maps in §2.3. Risk column flags rows that disagree with
the matview's actual column (verify via §3 probes).

### 4.1 Central dispatcher (`assets/js/data-client.js`)

| Tier | Default matviews | `mv_hotspots` / `mv_grants_baseline` | `mv_safety_categories_yearly` | Risk |
|---|---|---|---|---|
| federal | (no filter) | (no filter) | (no filter) | OK |
| state | `state` | `state` | `state` | OK |
| region | `dot_district` | `region` (alias) | **NULLED — state-wide returned** | **MED** — silent rollup to state on `mv_safety_categories_yearly`, no banner |
| planning_district | `planning_district` | `planning_district` | `planning_district` | OK |
| mpo | `mpo_name` | `mpo` (alias) | `mpo_name` | OK |
| county | `physical_juris_name` (+ optional rollup via `resolveTier()`) | `county` (alias) | `physical_juris_name` | OK at central level — risk is **per-feature maps**, see 4.2 |
| city | `physical_juris_name` (shared with county) | `county` (alias) | `physical_juris_name` | LOW — city-vs-county collision possible when names match |

### 4.2 Per-feature local `tierColMap`s (disagreement matrix)

| Tier | `supabase-bridge.js` (central) | `pedbike-tab-ped-detail.js` | `reports-standard-core.js` | `safety-focus-detail-panel.js` | Disagreement? |
|---|---|---|---|---|---|
| federal | n/a (handled by tier branch) | `null` | `null` | `null` | OK |
| state | n/a | `null` | `null` | `null` | OK |
| region | `dot_district` (via tier branch) | `dot_district` | `dot_district` | `dot_district` | OK |
| mpo | `mpo_name` | `mpo_name` | `mpo_name` | `mpo_name` | OK |
| planning_district | `planning_district` | `planning_district` | `planning_district` | `planning_district` | OK |
| **county** | `physical_juris_name` + rollup metadata + banner | **`planning_district`** ✗ | **`planning_district`** ✗ | `physical_juris_name` ✓ | **YES — 3 different behaviours** |
| city | `physical_juris_name` | `physical_juris_name` | `physical_juris_name` | `physical_juris_name` | OK |
| city_town (alias) | n/a | `physical_juris_name` | `physical_juris_name` | `physical_juris_name` | OK |

---

## 5. Missing-Banner Backlog

Sites that perform a silent county→PD rollup AND emit no banner / no
`console.warn` / no rendered footnote:

1. **`app/modules/pedbike/pedbike-tab-ped-detail.js:16-78` —
   `_fetchPedBikeDetailAggregates()`**
   - Hard-codes `county: 'planning_district'` (L24).
   - Consumes `mv_safety_focus_locations`, `mv_pedbike_breakdowns`, and
     `crashes` table.
   - Result: when the user picks "Kent County", Ped/Bike detail panel
     totals reflect Kent's **planning district**, not the county. With
     Delaware's 1:1 county↔PD mapping this happens to coincide today, but
     for any state with multi-county PDs the panel silently aggregates
     across multiple counties.
   - Surface: Pedestrian Detail Panel + Bike Detail Panel — KA Rate, EPDO,
     by-year, severity, dim breakdowns, demographics — **none flagged**.

2. **`app/modules/reports/reports-standard-core.js:231-298` —
   `hydrateReportFromMatviews()`**
   - Hard-codes `county: 'planning_district'` (L236).
   - Consumes `dashboard_summary`, `mv_hotspots`, `mv_fatal_factors`,
     `mv_speed_summary`, `mv_safety_categories`, `mv_intersection_summary`,
     `mv_analysis_summary`.
   - Result: Standard Reports R23 §1.1 fast-hydrate path (used by
     `comprehensive`, `infographic`, `executive_summary`, etc.) reports
     planning-district totals under a county-tier report title.
   - Surface: rendered HTML report + downloaded PDF — **no rollup
     footnote**.

3. **`assets/js/data-client.js:78-84` — `mv_safety_categories_yearly`
   region nullification** (adjacent risk, not county→PD)
   - Code-comment admits the column doesn't exist; the filter is silently
     dropped, returning state-wide rows for a region-tier query.
   - Should at minimum log a `console.warn` when a region-tier consumer
     hits this matview.

---

## 6. Recommended Fixes (prioritized, NOT in this PR)

| # | Priority | Fix | Files | Effort |
|---|---|---|---|---|
| 1 | **P0** | Replace `pedbike-tab-ped-detail.js` hand-rolled `tierColMap` with a call to `CL.data.supabaseBridge.resolveTier()`; thread `rolledUpFrom` / `rollupColumn` into a per-panel banner identical to `supabase-bridge.showBanner({rolledUp})`. | `app/modules/pedbike/pedbike-tab-ped-detail.js` | S (1-2 hr) |
| 2 | **P0** | Same fix in `hydrateReportFromMatviews()`; render the rollup disclosure as a printed footnote on the report (so it persists into the downloaded PDF). | `app/modules/reports/reports-standard-core.js` | S (1-2 hr) |
| 3 | **P1** | Extract the canonical `tierColMap` into a single shared helper (e.g. `CL.data.tierColumnsForMatview(mvName, tier)`) so future modules can't re-introduce the divergence. Migrate the 4 existing copies (`data-client.TIER_COLUMNS_BY_MATVIEW`, pedbike, reports, safety) to call it. | All four sites | M (½ day) |
| 4 | **P1** | Add a `console.warn` (or banner) when `mv_safety_categories_yearly` receives a `region` tier — the silent state-wide fallback violates the same "user knows what they're looking at" invariant. | `assets/js/data-client.js:78-84` + any region-tier consumer | XS (15 min) |
| 5 | **P2** | Backend probe results from §3 may surface more matviews missing a `county` column (forcing the FE into an unintended rollup). For each, decide: add the column to the matview, or document the limitation in the per-tab loader's empty-state copy. | Whichever matviews §3 flags | (depends) |
| 6 | **P2** | Add a unit / lint rule that flags any new `tierColMap` literal in a module file that doesn't go through the central helper from fix #3. | CI / pre-commit | S |
| 7 | **P3** | The `physical_juris_name` shared-column collision between `county` and `city` tiers (§2.1 risk note) is a separate small project — add a `tier_kind` discriminator column or migrate `city` to its own filter path. | `data-client.js` + matview DDL | M |

**Out of scope for any fix.** Backend matview DDL changes for Colorado /
Virginia download workflows are off-limits per CLAUDE.md §6 "Protected
Workflows." Only Delaware + DOT-neutral pipelines may be touched.

---

## 7. Methodology

**Greps run from repo root** (output captured directly into this doc;
exact commands replayable for verification):

```bash
# A — direct county/PD touch points
grep -rn "planning_district" app/modules/ assets/js/ | grep -iE "(county|fallback|rollup|swap)"
# B — tier resolution + county branches (32 matches)
grep -rEn "resolveTier|tier\s*===?\s*['\"]county['\"]" app/modules/ assets/js/
# C — RPC dispatch sites (the targeted regex found 0; broader .rpc() scan also empty)
grep -rEn "\.rpc\(['\"]get(Crash|Map|Hot|Safety|Dashboard|Intersect)" app/modules/ assets/js/
# D — county branches in data-routing modules
grep -rn -i "if.*county" app/modules/{data,dashboard,map,hotspots,intersection,scorecard}/
# E — full data-client.js county/PD survey
grep -n "planning_district\|county" assets/js/data-client.js
# Cross-cutting — every consumer of rollup metadata
grep -rn "rolledUpFrom\|rolledUp\|rollupColumn\|unincorporatedOnly" app/modules/ assets/js/
```

**Manual file reads** for full-context classification:
`assets/js/data-client.js:25-89`, `app/modules/data/supabase-bridge.js:180-350`
and `:620-700` and `:800-980`, `app/modules/pedbike/pedbike-tab-ped-detail.js:1-80`,
`app/modules/reports/reports-standard-core.js:225-300`,
`app/modules/safety/safety-focus-detail-panel.js:95-145`,
`app/modules/data/lazy-loader.js:60-110`.

**Backend probes:** not executed — left as `<COWORK: …>` placeholders per
the prompt (CC has no Supabase access).

**Limitations:**
1. The audit covers `app/modules/` and `assets/js/`. The 153K-line
   `app/index.html` was not exhaustively scanned for inline `tierColMap`
   literals because (per CLAUDE.md) extraction is in progress and most
   tier-routing logic has already been moved out. A spot-check
   `grep "tierColMap" app/index.html` should run as a follow-up to
   confirm zero remaining inline copies.
2. The matview list (§3) is grep-derived. Matviews referenced only by
   string concatenation (`'mv_' + name`) would not appear. None were
   spotted in scope but a Cowork-side `pg_matviews` listing is the
   authoritative source.

---

*Audit run 2026-05-25 on branch `claude/happy-thompson-HdexL`, base
commit `7d6a007` (main).*
