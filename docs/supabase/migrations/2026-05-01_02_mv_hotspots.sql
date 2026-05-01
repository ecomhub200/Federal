-- =============================================================================
-- §7.2 — Recreate `mv_hotspots` with ownership-derived road_type +
--       is_interstate.
-- =============================================================================
-- Replaces the prior version that read crashes.road_type directly. Now
-- bucketing is derived in the matview SELECT, matching dashboard_summary
-- (file 2026-05-01_01).
--
-- Filter widened from `WHERE rte_name IS NOT NULL` to
-- `WHERE COALESCE(NULLIF(node,''), rte_name) IS NOT NULL` so intersections
-- with a node but no rte_name are not dropped.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_hotspots CASCADE;

CREATE MATERIALIZED VIEW public.mv_hotspots AS
SELECT
    state,
    physical_juris_name        AS county,
    dot_district               AS region,
    mpo_name                   AS mpo,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END                        AS road_type,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate')
                               AS is_interstate,
    CASE WHEN node IS NOT NULL AND node <> '' THEN 'intersection'
         ELSE 'segment'
    END                        AS location_type,
    COALESCE(NULLIF(node, ''), rte_name) AS location_name,
    rte_name,
    intersection_name,
    count(*)                                              AS total_crashes,
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o,
    sum(CASE crash_severity
            WHEN 'K' THEN 883 WHEN 'A' THEN 94
            WHEN 'B' THEN 21  WHEN 'C' THEN 11
            WHEN 'O' THEN 1   ELSE 0
        END)                                              AS epdo,
    sum(CASE WHEN pedestrian = 'Yes' THEN 1 ELSE 0 END)   AS ped_count,
    sum(CASE WHEN bike       = 'Yes' THEN 1 ELSE 0 END)   AS bike_count,
    avg(x)                                                AS lon_centroid,
    avg(y)                                                AS lat_centroid,
    min(crash_year)                                       AS first_year,
    max(crash_year)                                       AS last_year
FROM crashes
WHERE COALESCE(NULLIF(node, ''), rte_name) IS NOT NULL
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11;

ALTER MATERIALIZED VIEW public.mv_hotspots OWNER TO postgres;
GRANT SELECT ON public.mv_hotspots TO anon;

CREATE UNIQUE INDEX mv_hotspots_uq_idx
    ON public.mv_hotspots
    (state, county, dot_district, mpo, planning_district,
     road_type, is_interstate, location_type, location_name,
     rte_name, intersection_name);

CREATE INDEX mv_hotspots_county_idx
    ON public.mv_hotspots
    (state, county, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_hotspots_state_idx
    ON public.mv_hotspots
    (state, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_hotspots_region_idx
    ON public.mv_hotspots
    (state, dot_district, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_hotspots_mpo_idx
    ON public.mv_hotspots
    (state, mpo, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_hotspots_pd_idx
    ON public.mv_hotspots
    (state, planning_district, road_type, is_interstate, epdo DESC);

REFRESH MATERIALIZED VIEW public.mv_hotspots;

-- ===== Verification =========================================================
-- SELECT road_type, count(*) AS rows FROM mv_hotspots GROUP BY road_type;
-- Expected: 4 buckets, every count > 0, including city_roads.
