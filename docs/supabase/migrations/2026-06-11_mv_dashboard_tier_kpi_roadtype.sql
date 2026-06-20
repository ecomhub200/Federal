-- 2026-06-11 — Add a road_type / is_interstate dimension to mv_dashboard_tier_kpi
--
-- PROBLEM: mv_dashboard_tier_kpi (the ~400 ms fast-path KPI matview) summed
-- across ALL road types. Any road-type selection other than "all" bypassed it
-- and fell back to a seq scan of dashboard_summary (~254 ms) on every rotation.
--
-- FIX: pre-aggregate along the SAME dimensions the frontend uses to filter
-- dashboard_summary — road_type ∈ {dot_roads, county_roads, city_roads,
-- other_roads} and is_interstate ∈ {true,false} — using GROUPING SETS so the
-- matview answers every frontend road-type case with one indexed row read:
--   * "all roads"            → road_type IS NULL  AND is_interstate IS NULL   (grand total)
--   * specific road_type X   → road_type = X       AND is_interstate IS NULL   ((road_type) rollup)
--   * road_type list [a,b]   → road_type IN (a,b)  AND is_interstate IS NULL   (summed client-side)
--   * "all no interstate"    → road_type IS NULL  AND is_interstate = false   ((is_interstate) rollup)
--
-- The frontend getDashboardTierKpi() is updated in lockstep (assets/js/data-client.js)
-- to add the matching road_type / is_interstate predicate. With no predicate it now
-- selects the grand-total rollup row, preserving the previous "all roads" numbers.

DROP MATERIALIZED VIEW IF EXISTS mv_dashboard_tier_kpi CASCADE;

CREATE MATERIALIZED VIEW mv_dashboard_tier_kpi AS
WITH base AS (
  SELECT
    state, crash_year,
    physical_juris_name, dot_district, mpo_name, planning_district,
    road_type, is_interstate,
    SUM(crash_count)     AS crash_count,
    SUM(fatals)          AS fatals,
    SUM(serious_injuries) AS serious_injuries,
    SUM(total_injured)   AS total_injured,
    SUM(ped_crashes)     AS ped_crashes,
    SUM(bike_crashes)    AS bike_crashes,
    SUM(speed_crashes)   AS speed_crashes,
    SUM(alcohol_crashes) AS alcohol_crashes,
    SUM(night_crashes)   AS night_crashes
  FROM dashboard_summary
  GROUP BY state, crash_year, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, is_interstate
)
-- FEDERAL tier — cross-state rollup (state IS NULL signals "all states")
SELECT
  NULL::text AS state, 'federal'::text AS tier, 'federal'::text AS jurisdiction_id,
  'All States'::text AS jurisdiction_name, crash_year,
  road_type, is_interstate,
  SUM(crash_count) AS crashes, SUM(fatals) AS fatals, SUM(serious_injuries) AS serious,
  SUM(total_injured) AS injuries, SUM(ped_crashes) AS ped, SUM(bike_crashes) AS bike,
  SUM(speed_crashes) AS speed, SUM(alcohol_crashes) AS alcohol, SUM(night_crashes) AS night,
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries))) AS epdo
FROM base
GROUP BY crash_year, GROUPING SETS ((road_type),(is_interstate),())
UNION ALL
-- STATE tier
SELECT state, 'state', state, state, crash_year, road_type, is_interstate,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base GROUP BY state, crash_year, GROUPING SETS ((road_type),(is_interstate),())
UNION ALL
-- DOT_DISTRICT tier
SELECT state, 'dot_district', dot_district, dot_district, crash_year, road_type, is_interstate,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE dot_district IS NOT NULL
GROUP BY state, dot_district, crash_year, GROUPING SETS ((road_type),(is_interstate),())
UNION ALL
-- MPO tier
SELECT state, 'mpo', mpo_name, mpo_name, crash_year, road_type, is_interstate,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE mpo_name IS NOT NULL
GROUP BY state, mpo_name, crash_year, GROUPING SETS ((road_type),(is_interstate),())
UNION ALL
-- PLANNING_DISTRICT tier
SELECT state, 'planning_district', planning_district, planning_district, crash_year, road_type, is_interstate,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE planning_district IS NOT NULL
GROUP BY state, planning_district, crash_year, GROUPING SETS ((road_type),(is_interstate),())
UNION ALL
-- JURISDICTION tier (physical_juris_name; frontend city/county/jurisdiction collapse here)
SELECT state, 'jurisdiction', physical_juris_name, physical_juris_name, crash_year, road_type, is_interstate,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE physical_juris_name IS NOT NULL
GROUP BY state, physical_juris_name, crash_year, GROUPING SETS ((road_type),(is_interstate),());

-- Unique index for REFRESH CONCURRENTLY. road_type / is_interstate are NULL in
-- the rollup rows, so COALESCE them into sentinels to keep keys distinct.
CREATE UNIQUE INDEX mv_dashboard_tier_kpi_uniq
  ON mv_dashboard_tier_kpi (
    COALESCE(state,'__federal__'), tier, jurisdiction_id, crash_year,
    COALESCE(road_type,'__all__'), COALESCE(is_interstate::text,'__all__')
  );
CREATE INDEX mv_dashboard_tier_kpi_lookup
  ON mv_dashboard_tier_kpi (state, tier, road_type, is_interstate, crash_year);
CREATE INDEX mv_dashboard_tier_kpi_year
  ON mv_dashboard_tier_kpi (crash_year);
CREATE INDEX mv_dashboard_tier_kpi_federal
  ON mv_dashboard_tier_kpi (tier, crash_year) WHERE tier = 'federal';

GRANT SELECT ON mv_dashboard_tier_kpi TO anon, authenticated;
ANALYZE mv_dashboard_tier_kpi;

-- Wire into the nightly refresh routine (it is rebuilt here so it isn't in the
-- master proc; add a dedicated concurrent-refresh cron, 04:05 UTC after
-- dashboard_summary at 04:00 which it depends on).
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname='refresh-mv-dashboard-tier-kpi';
SELECT cron.schedule('refresh-mv-dashboard-tier-kpi', '5 4 * * *',
                     'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_dashboard_tier_kpi');
