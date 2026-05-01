-- =============================================================================
-- §7.1 — Recreate `dashboard_summary` with ownership-derived 4-bucket
--       road_type and an is_interstate boolean.
-- =============================================================================
-- Replaces the 2026-04-30 system-derived 3-bucket version. The frontend
-- radios resolve to 4 buckets (dot_roads / county_roads / city_roads /
-- other_roads) via assets/js/data-client.js radioToBucket(...).
--
-- "non_dot_roads" is no longer a stored bucket — Federal "Non-DOT" is
-- expressed at PostgREST level as
--   road_type=in.(county_roads,city_roads,other_roads).
--
-- "is_interstate" is true when functional_class starts with "1-Interstate"
-- OR system = 'DOT Interstate'. Used by the local-tier "All Roads (No
-- Interstate)" radio.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.dashboard_summary CASCADE;

CREATE MATERIALIZED VIEW public.dashboard_summary AS
SELECT
    state,
    COALESCE(physical_juris_name, '')                                AS physical_juris_name,
    COALESCE(dot_district, '')                                       AS dot_district,
    COALESCE(mpo_name, '')                                           AS mpo_name,
    COALESCE(planning_district, '')                                  AS planning_district,
    COALESCE(crash_year, 0)                                          AS crash_year,
    COALESCE(crash_severity, '')                                     AS crash_severity,
    COALESCE(functional_class, '')                                   AS functional_class,
    COALESCE(area_type, '')                                          AS area_type,
    COALESCE(collision_type, '')                                     AS collision_type,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END                                                              AS road_type,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate')
                                                                     AS is_interstate,
    count(*)                                                         AS crash_count,
    sum(k_people)                                                    AS fatals,
    sum(a_people)                                                    AS serious_injuries,
    sum(persons_injured)                                             AS total_injured,
    sum(CASE WHEN pedestrian      = 'Yes' THEN 1 ELSE 0 END)         AS ped_crashes,
    sum(CASE WHEN bike            = 'Yes' THEN 1 ELSE 0 END)         AS bike_crashes,
    sum(CASE WHEN speed           = 'Yes' THEN 1 ELSE 0 END)         AS speed_crashes,
    sum(CASE WHEN alcohol         = 'Yes' THEN 1 ELSE 0 END)         AS alcohol_crashes,
    sum(CASE WHEN night           = 'Yes' THEN 1 ELSE 0 END)         AS night_crashes,
    sum(CASE WHEN animal_related  = 'Yes' THEN 1 ELSE 0 END)         AS animal_crashes
FROM crashes
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12;

ALTER MATERIALIZED VIEW public.dashboard_summary OWNER TO postgres;
GRANT SELECT ON public.dashboard_summary TO anon;

-- Unique index covers the full GROUP BY → enables REFRESH … CONCURRENTLY.
CREATE UNIQUE INDEX dashboard_summary_uq_idx
    ON public.dashboard_summary
    (state, physical_juris_name, dot_district, mpo_name, planning_district,
     crash_year, crash_severity, functional_class, area_type, collision_type,
     road_type, is_interstate);

-- Covering indexes — ordered by the tier most likely to filter first.
CREATE INDEX dashboard_summary_state_road_idx
    ON public.dashboard_summary (state, road_type, is_interstate);

CREATE INDEX dashboard_summary_state_year_road_idx
    ON public.dashboard_summary (state, road_type, crash_year)
    INCLUDE (crash_count, fatals, ped_crashes, bike_crashes,
             speed_crashes, night_crashes, alcohol_crashes);

CREATE INDEX dashboard_summary_county_road_idx
    ON public.dashboard_summary
    (state, physical_juris_name, road_type, is_interstate)
    INCLUDE (crash_count, fatals);

CREATE INDEX dashboard_summary_region_road_idx
    ON public.dashboard_summary (state, dot_district, road_type, is_interstate);

CREATE INDEX dashboard_summary_mpo_road_idx
    ON public.dashboard_summary (state, mpo_name, road_type, is_interstate);

CREATE INDEX dashboard_summary_pd_road_idx
    ON public.dashboard_summary (state, planning_district, road_type, is_interstate);

REFRESH MATERIALIZED VIEW public.dashboard_summary;

-- ===== Verification =========================================================
-- SELECT road_type, count(*) groups, sum(crash_count) crashes
--   FROM dashboard_summary GROUP BY road_type ORDER BY crashes DESC;
-- Expected: 4 rows — dot_roads / city_roads / county_roads / other_roads,
--           every count > 0 (Delaware: dot ~438K, city ~81K, county ~40K,
--           other ~10K).
--
-- SELECT is_interstate, count(*) groups, sum(crash_count) crashes
--   FROM dashboard_summary GROUP BY is_interstate ORDER BY 1;
-- Expected: 2 rows — false (~520K), true (~40K).
--
-- SELECT count(*) FROM dashboard_summary
--  WHERE state='delaware' AND road_type='city_roads';
-- Expected: > 0  (was 0 before this migration).
