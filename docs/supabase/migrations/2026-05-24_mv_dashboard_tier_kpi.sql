-- =============================================================================
-- CC 305 §2 — mv_dashboard_tier_kpi (2026-05-24)
-- =============================================================================
-- PLACEHOLDER: to be applied by Cowork via
--   mcp__supabase-self-hosted__apply_migration
-- against srv1503081.hstgr.cloud. State-agnostic.
--
-- Purpose: pre-aggregated dashboard KPI rollup keyed on
--   (state, tier, jurisdiction_id, crash_year)
-- so the dashboard KPI tiles can render from ~1.6k rows / ~50 KB instead of
-- the ~50k rows / ~1.3 MB returned by the row-level dashboard_summary fetch.
--
-- Additive: dashboard_summary is retained for row-shape consumers (reports,
-- drill, crash-tree) that need the functional_class / collision_type /
-- road_type / is_interstate dimensions this rollup drops.
--
-- Tier coverage: state, dot_district, mpo, planning_district, jurisdiction
-- (physical_juris_name). Federal-tier rollups can be computed client-side
-- by summing state rows.
--
-- Row-count target per state (~17-year history reference):
--   state-tier:              ~17 (1 per crash_year)
--   dot_district:            ~50
--   mpo:                     ~50
--   planning_district:       ~50
--   jurisdiction:          ~1500
--   Total per state:       ~1700  (vs ~50k in dashboard_summary)
--
-- EPDO weights: FHWA 2025 baseline (K=883, A=94, others=1). Per-state custom
-- weights are applied client-side from CL.core.constants.STATE_EPDO_WEIGHTS;
-- the matview stores the raw severity counts so the client can recompute.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_tier_kpi CASCADE;

CREATE MATERIALIZED VIEW mv_dashboard_tier_kpi AS
WITH base AS (
  SELECT
    state,
    crash_year,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    SUM(crash_count)      AS crashes,
    SUM(fatals)           AS fatals,
    SUM(serious_injuries) AS serious_injuries,
    SUM(total_injured)    AS total_injured,
    SUM(ped_crashes)      AS ped_crashes,
    SUM(bike_crashes)     AS bike_crashes,
    SUM(speed_crashes)    AS speed_crashes,
    SUM(alcohol_crashes)  AS alcohol_crashes,
    SUM(night_crashes)    AS night_crashes,
    SUM(animal_crashes)   AS animal_crashes
  FROM dashboard_summary
  GROUP BY state, crash_year, physical_juris_name, dot_district, mpo_name, planning_district
)
-- state tier
SELECT
  state,
  'state'::text                                    AS tier,
  state                                            AS jurisdiction_id,
  state                                            AS jurisdiction_name,
  crash_year,
  SUM(crashes)::bigint                             AS crashes,
  SUM(fatals)::bigint                              AS fatals,
  SUM(serious_injuries)::bigint                    AS serious_injuries,
  SUM(total_injured)::bigint                       AS total_injured,
  SUM(ped_crashes)::bigint                         AS ped_crashes,
  SUM(bike_crashes)::bigint                        AS bike_crashes,
  SUM(speed_crashes)::bigint                       AS speed_crashes,
  SUM(alcohol_crashes)::bigint                     AS alcohol_crashes,
  SUM(night_crashes)::bigint                       AS night_crashes,
  SUM(animal_crashes)::bigint                      AS animal_crashes
FROM base
GROUP BY state, crash_year

UNION ALL

-- dot_district tier
SELECT
  state,
  'dot_district',
  dot_district,
  dot_district,
  crash_year,
  SUM(crashes)::bigint,
  SUM(fatals)::bigint,
  SUM(serious_injuries)::bigint,
  SUM(total_injured)::bigint,
  SUM(ped_crashes)::bigint,
  SUM(bike_crashes)::bigint,
  SUM(speed_crashes)::bigint,
  SUM(alcohol_crashes)::bigint,
  SUM(night_crashes)::bigint,
  SUM(animal_crashes)::bigint
FROM base
WHERE dot_district IS NOT NULL
GROUP BY state, dot_district, crash_year

UNION ALL

-- mpo tier
SELECT
  state,
  'mpo',
  mpo_name,
  mpo_name,
  crash_year,
  SUM(crashes)::bigint,
  SUM(fatals)::bigint,
  SUM(serious_injuries)::bigint,
  SUM(total_injured)::bigint,
  SUM(ped_crashes)::bigint,
  SUM(bike_crashes)::bigint,
  SUM(speed_crashes)::bigint,
  SUM(alcohol_crashes)::bigint,
  SUM(night_crashes)::bigint,
  SUM(animal_crashes)::bigint
FROM base
WHERE mpo_name IS NOT NULL
GROUP BY state, mpo_name, crash_year

UNION ALL

-- planning_district tier
SELECT
  state,
  'planning_district',
  planning_district,
  planning_district,
  crash_year,
  SUM(crashes)::bigint,
  SUM(fatals)::bigint,
  SUM(serious_injuries)::bigint,
  SUM(total_injured)::bigint,
  SUM(ped_crashes)::bigint,
  SUM(bike_crashes)::bigint,
  SUM(speed_crashes)::bigint,
  SUM(alcohol_crashes)::bigint,
  SUM(night_crashes)::bigint,
  SUM(animal_crashes)::bigint
FROM base
WHERE planning_district IS NOT NULL
GROUP BY state, planning_district, crash_year

UNION ALL

-- jurisdiction tier (physical_juris_name — county/city/town/etc.)
SELECT
  state,
  'jurisdiction',
  physical_juris_name,
  physical_juris_name,
  crash_year,
  SUM(crashes)::bigint,
  SUM(fatals)::bigint,
  SUM(serious_injuries)::bigint,
  SUM(total_injured)::bigint,
  SUM(ped_crashes)::bigint,
  SUM(bike_crashes)::bigint,
  SUM(speed_crashes)::bigint,
  SUM(alcohol_crashes)::bigint,
  SUM(night_crashes)::bigint,
  SUM(animal_crashes)::bigint
FROM base
WHERE physical_juris_name IS NOT NULL
GROUP BY state, physical_juris_name, crash_year;

-- Unique index required for CONCURRENTLY refresh
CREATE UNIQUE INDEX mv_dashboard_tier_kpi_uniq
  ON mv_dashboard_tier_kpi (state, tier, jurisdiction_id, crash_year);

CREATE INDEX mv_dashboard_tier_kpi_state_tier
  ON mv_dashboard_tier_kpi (state, tier);

CREATE INDEX mv_dashboard_tier_kpi_year
  ON mv_dashboard_tier_kpi (crash_year);

GRANT SELECT ON mv_dashboard_tier_kpi TO anon, authenticated;

ANALYZE mv_dashboard_tier_kpi;

-- =============================================================================
-- Verification queries (run after apply)
-- =============================================================================
-- Row count per state:
--   SELECT state, tier, COUNT(*) FROM mv_dashboard_tier_kpi GROUP BY state, tier ORDER BY state, tier;
--
-- Spot-check state-tier totals vs the same year's dashboard_summary aggregate
-- (substitute :state_key with the state you're verifying, e.g. 'delaware'):
--   SELECT crash_year, crashes, fatals, serious_injuries
--   FROM mv_dashboard_tier_kpi
--   WHERE state = :state_key AND tier = 'state'
--   ORDER BY crash_year;
--
-- Cross-check (should match within rounding from any client-side aggregate):
--   SELECT crash_year, SUM(crash_count), SUM(fatals), SUM(serious_injuries)
--   FROM dashboard_summary WHERE state = :state_key GROUP BY crash_year ORDER BY crash_year;
-- =============================================================================
