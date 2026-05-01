-- =============================================================================
-- §7.6 — Recreate `mv_analysis_summary` with road_type + is_interstate on
--       every UNION arm (year, month, severity, collision, hour).
-- =============================================================================
-- Each arm gains the same two columns derived from ownership /
-- functional_class+system. Output column count goes from 12 to 14; the
-- frontend's pivot logic ignores extra columns until it needs them.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_analysis_summary CASCADE;

CREATE MATERIALIZED VIEW public.mv_analysis_summary AS

-- ─── by year ───────────────────────────────────────────────────────────────
SELECT
    state,
    physical_juris_name AS county,
    dot_district        AS region,
    mpo_name            AS mpo,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END                                                   AS road_type,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate')
                                                          AS is_interstate,
    'year'::text                                          AS dimension,
    crash_year::text                                      AS dim_value,
    count(*)                                              AS total,
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
GROUP BY state, county, region, mpo, planning_district,
         road_type, is_interstate, crash_year

UNION ALL

-- ─── by month (1-12) ───────────────────────────────────────────────────────
SELECT
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    'month',
    EXTRACT(MONTH FROM crash_date)::text,
    count(*),
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE crash_date IS NOT NULL
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         CASE
             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
             ELSE 'other_roads'
         END,
         (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
         EXTRACT(MONTH FROM crash_date)

UNION ALL

-- ─── by severity (5 rows per jurisdiction × bucket × interstate) ───────────
SELECT
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    'severity',
    crash_severity,
    count(*),
    0, 0, 0, 0, 0
FROM crashes
WHERE crash_severity IN ('K','A','B','C','O')
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         CASE
             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
             ELSE 'other_roads'
         END,
         (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
         crash_severity

UNION ALL

-- ─── by collision_type ─────────────────────────────────────────────────────
SELECT
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    'collision',
    collision_type,
    count(*),
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE collision_type IS NOT NULL AND collision_type <> ''
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         CASE
             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
             ELSE 'other_roads'
         END,
         (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
         collision_type

UNION ALL

-- ─── by hour (00-23) ───────────────────────────────────────────────────────
SELECT
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    'hour',
    SUBSTRING(LPAD(crash_military_time, 4, '0') FROM 1 FOR 2),
    count(*),
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE crash_military_time IS NOT NULL AND crash_military_time <> ''
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         CASE
             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
             ELSE 'other_roads'
         END,
         (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
         SUBSTRING(LPAD(crash_military_time, 4, '0') FROM 1 FOR 2);

ALTER MATERIALIZED VIEW public.mv_analysis_summary OWNER TO postgres;
GRANT SELECT ON public.mv_analysis_summary TO anon;

CREATE UNIQUE INDEX mv_analysis_summary_uq_idx
    ON public.mv_analysis_summary
    (state, county, region, mpo, planning_district,
     road_type, is_interstate, dimension, dim_value);

CREATE INDEX mv_analysis_summary_lookup_idx
    ON public.mv_analysis_summary
    (state, county, dimension, road_type, is_interstate);

CREATE INDEX mv_analysis_summary_state_idx
    ON public.mv_analysis_summary
    (state, dimension, road_type, is_interstate);

REFRESH MATERIALIZED VIEW public.mv_analysis_summary;

-- ===== Verification =========================================================
-- SELECT dimension, road_type, count(*) FROM mv_analysis_summary
--  GROUP BY dimension, road_type ORDER BY 1, 2;
-- Expected: 5 dimensions × up to 4 buckets (= up to 20 rows), each > 0.
