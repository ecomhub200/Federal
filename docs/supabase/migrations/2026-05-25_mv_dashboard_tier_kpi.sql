-- mv_dashboard_tier_kpi — pre-aggregated dashboard KPIs per (state, tier, jurisdiction_id, crash_year)
-- STATE-AGNOSTIC: matview tier values match dashboard_summary data columns
-- (state, dot_district, mpo, planning_district, jurisdiction) plus a `federal`
-- UNION for cross-state rollup. Frontend tiers like `region`, `county`, `city`
-- translate to these in data-client.js getDashboardTierKpi() — they are NOT
-- emitted as matview tier values because their meaning is per-state metadata.
--
-- Replaces frontend client-side rollup of 58K-row dashboard_summary fetch
-- (1.7s / 31 MB on Delaware → ~400ms / ~50 KB).

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
    crash_severity,
    SUM(crash_count) AS crash_count,
    SUM(fatals) AS fatals,
    SUM(serious_injuries) AS serious_injuries,
    SUM(total_injured) AS total_injured,
    SUM(ped_crashes) AS ped_crashes,
    SUM(bike_crashes) AS bike_crashes,
    SUM(speed_crashes) AS speed_crashes,
    SUM(alcohol_crashes) AS alcohol_crashes,
    SUM(night_crashes) AS night_crashes
  FROM dashboard_summary
  GROUP BY state, crash_year, physical_juris_name, dot_district, mpo_name, planning_district, crash_severity
)
-- FEDERAL tier — cross-state rollup (state IS NULL signals "all states")
SELECT
  NULL::text AS state,
  'federal'::text AS tier,
  'federal'::text AS jurisdiction_id,
  'All States'::text AS jurisdiction_name,
  crash_year,
  SUM(crash_count) AS crashes,
  SUM(fatals) AS fatals,
  SUM(serious_injuries) AS serious,
  SUM(total_injured) AS injuries,
  SUM(ped_crashes) AS ped,
  SUM(bike_crashes) AS bike,
  SUM(speed_crashes) AS speed,
  SUM(alcohol_crashes) AS alcohol,
  SUM(night_crashes) AS night,
  (883 * SUM(fatals) + 94 * SUM(serious_injuries) +
   1 * (SUM(crash_count) - SUM(fatals) - SUM(serious_injuries))) AS epdo
FROM base GROUP BY crash_year
UNION ALL
-- STATE tier — per-state rollup
SELECT state, 'state', state, state, crash_year,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base GROUP BY state, crash_year
UNION ALL
-- DOT_DISTRICT tier — matches data column
SELECT state, 'dot_district', dot_district, dot_district, crash_year,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE dot_district IS NOT NULL GROUP BY state, dot_district, crash_year
UNION ALL
-- MPO tier — matches mpo_name column (tier value normalized to 'mpo')
SELECT state, 'mpo', mpo_name, mpo_name, crash_year,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE mpo_name IS NOT NULL GROUP BY state, mpo_name, crash_year
UNION ALL
-- PLANNING_DISTRICT tier — matches data column
SELECT state, 'planning_district', planning_district, planning_district, crash_year,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE planning_district IS NOT NULL GROUP BY state, planning_district, crash_year
UNION ALL
-- JURISDICTION tier — physical_juris_name (frontend `city`/`county`/`jurisdiction` all
-- collapse to this in data-client.js, per the established pattern in map-points-hydrate.js)
SELECT state, 'jurisdiction', physical_juris_name, physical_juris_name, crash_year,
  SUM(crash_count), SUM(fatals), SUM(serious_injuries), SUM(total_injured),
  SUM(ped_crashes), SUM(bike_crashes), SUM(speed_crashes), SUM(alcohol_crashes), SUM(night_crashes),
  (883*SUM(fatals) + 94*SUM(serious_injuries) + (SUM(crash_count)-SUM(fatals)-SUM(serious_injuries)))
FROM base WHERE physical_juris_name IS NOT NULL GROUP BY state, physical_juris_name, crash_year;

-- Unique constraint: federal rows have state=NULL, so we COALESCE for index dedup.
CREATE UNIQUE INDEX mv_dashboard_tier_kpi_uniq
  ON mv_dashboard_tier_kpi (COALESCE(state,'__federal__'), tier, jurisdiction_id, crash_year);
CREATE INDEX mv_dashboard_tier_kpi_state_tier
  ON mv_dashboard_tier_kpi (state, tier);
CREATE INDEX mv_dashboard_tier_kpi_year
  ON mv_dashboard_tier_kpi (crash_year);
CREATE INDEX mv_dashboard_tier_kpi_federal
  ON mv_dashboard_tier_kpi (tier, crash_year) WHERE tier = 'federal';

GRANT SELECT ON mv_dashboard_tier_kpi TO anon, authenticated;
ANALYZE mv_dashboard_tier_kpi;

-- Expected row count per state: federal ~17 (1/year), state ~17, dot_district ~50,
-- mpo ~17, planning_district ~17, jurisdiction ~1500 = ~1600 rows/state vs 58,745
-- of dashboard_summary. ~37x reduction. Federal block: ~17 rows total across all states.
