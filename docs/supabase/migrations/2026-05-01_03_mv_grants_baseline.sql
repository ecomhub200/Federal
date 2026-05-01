-- =============================================================================
-- §7.3 — Recreate `mv_grants_baseline` with ownership-derived road_type +
--       is_interstate.
-- =============================================================================
-- HSIP-eligible grouping: keeps the ≥3 crashes OR ≥1 KA filter; row shape
-- mirrors mv_hotspots plus crash_year. Bucketing matches files 01 and 02.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_grants_baseline CASCADE;

CREATE MATERIALIZED VIEW public.mv_grants_baseline AS
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
    crash_year,
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
    sum(CASE WHEN pedestrian = 'Yes' THEN 1 ELSE 0 END)   AS ped,
    sum(CASE WHEN bike       = 'Yes' THEN 1 ELSE 0 END)   AS bike,
    avg(x)                                                AS lon_centroid,
    avg(y)                                                AS lat_centroid
FROM crashes
WHERE COALESCE(NULLIF(node, ''), rte_name) IS NOT NULL
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
HAVING count(*) >= 3
   OR  sum(CASE WHEN crash_severity IN ('K','A') THEN 1 ELSE 0 END) >= 1;

ALTER MATERIALIZED VIEW public.mv_grants_baseline OWNER TO postgres;
GRANT SELECT ON public.mv_grants_baseline TO anon;

CREATE UNIQUE INDEX mv_grants_baseline_uq_idx
    ON public.mv_grants_baseline
    (state, county, dot_district, mpo, planning_district,
     road_type, is_interstate, location_type, location_name,
     rte_name, crash_year);

CREATE INDEX mv_grants_baseline_county_idx
    ON public.mv_grants_baseline
    (state, county, road_type, is_interstate, epdo DESC)
    INCLUDE (total_crashes, k, a);

CREATE INDEX mv_grants_baseline_state_idx
    ON public.mv_grants_baseline
    (state, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_grants_baseline_region_idx
    ON public.mv_grants_baseline
    (state, dot_district, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_grants_baseline_mpo_idx
    ON public.mv_grants_baseline
    (state, mpo, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_grants_baseline_pd_idx
    ON public.mv_grants_baseline
    (state, planning_district, road_type, is_interstate, epdo DESC);

CREATE INDEX mv_grants_baseline_year_idx
    ON public.mv_grants_baseline (state, crash_year);

REFRESH MATERIALIZED VIEW public.mv_grants_baseline;

-- ===== Verification =========================================================
-- SELECT road_type, count(*) AS rows FROM mv_grants_baseline GROUP BY road_type;
-- Expected: 4 buckets, every count > 0, including city_roads.
