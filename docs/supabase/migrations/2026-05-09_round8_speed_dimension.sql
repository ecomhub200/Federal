-- =============================================================================
-- Round 8 backend additions (2026-05-09) — Speed Cross-Tabs
-- =============================================================================
-- Purpose: unblock the Fatal & Speed PDF report's two remaining missing
--          tables that round 8's frontend patch couldn't fix client-side:
--
--   A2.4  "Year-Over-Year Speed Crashes" column — needs per-year × speed counts
--   A2.5  "Peak Speed Crash Hours" — needs per-hour × speed counts
--   A2.2  "Speed-Related Co-Factors" % — needs speed × every-other-factor cross-tab
--
-- Frontend already handles A2.6 (Peak Fatal Hours) by reading the per-row K
-- column on mv_analysis_summary's hour rows — no backend change needed for
-- that one.
--
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
--                (port 5433 for direct Postgres, or via Supabase MCP
--                 apply_migration / execute_sql)
--
-- All changes are ADDITIVE — no DROP, no breaking schema changes.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 1) mv_analysis_summary additions: dimension='hour_speed', 'year_speed'
-- ─────────────────────────────────────────────────────────────────────────────
-- Strategy: don't touch the existing matview. Instead create a sibling matview
-- with rows that the frontend can union into the same byHour/byYear maps.
-- This avoids DROP CASCADE on a production matview that other tabs depend on.

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_analysis_speed AS
WITH base AS (
    SELECT c.*,
        CASE
            WHEN c.ownership = '1. State Hwy Agency'        THEN 'dot_roads'
            WHEN c.ownership = '2. County Hwy Agency'       THEN 'county_roads'
            WHEN c.ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
            ELSE 'other_roads'
        END AS road_type,
        COALESCE(c.functional_class LIKE '1-Interstate%'
                 OR c.system = 'DOT Interstate', false) AS is_interstate
    FROM public.crashes c
    WHERE c.speed = 'Yes'  -- speed-related only
)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    road_type, is_interstate,
    'hour_speed'::text AS dimension,
    EXTRACT(HOUR FROM crash_date::timestamp)::text AS dim_value,
    count(*)::integer AS total,
    sum((crash_severity = 'K')::int)::integer AS k,
    sum((crash_severity = 'A')::int)::integer AS a,
    0::integer AS b, 0::integer AS c, 0::integer AS o
FROM base
WHERE crash_date IS NOT NULL
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         road_type, is_interstate, EXTRACT(HOUR FROM crash_date::timestamp)
UNION ALL
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    road_type, is_interstate,
    'year_speed'::text AS dimension,
    crash_year::text AS dim_value,
    count(*)::integer AS total,
    sum((crash_severity = 'K')::int)::integer AS k,
    sum((crash_severity = 'A')::int)::integer AS a,
    0::integer AS b, 0::integer AS c, 0::integer AS o
FROM base
WHERE crash_year IS NOT NULL AND crash_year >= 2000
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         road_type, is_interstate, crash_year;

CREATE INDEX IF NOT EXISTS idx_mv_analysis_speed_lookup
    ON public.mv_analysis_speed (state, physical_juris_name);
CREATE INDEX IF NOT EXISTS idx_mv_analysis_speed_pd
    ON public.mv_analysis_speed (state, planning_district);
CREATE INDEX IF NOT EXISTS idx_mv_analysis_speed_dim
    ON public.mv_analysis_speed (state, dimension);

GRANT SELECT ON public.mv_analysis_speed TO anon;

-- Frontend wiring (after migration applied):
--   Update assets/js/data-client.js getAnalysisBreakdown() to also query
--   mv_analysis_speed and surface { byHourSpeed: {...}, byYearSpeed: {...} }.
--   Then update FS loader to read those into speedData.byHour / .byYear.

-- ─────────────────────────────────────────────────────────────────────────────
-- 2) mv_factor_pairs (speed × every-other-factor cross-tab) — fixes A2.2
-- ─────────────────────────────────────────────────────────────────────────────
-- Without this matview, the Co-Factor table in the FS PDF either shows 0%
-- (after Round 8's loader patch removed the global-leak assignment) or 10116%
-- (pre-Round-8). With it, the table shows actual % of speed crashes that also
-- had each co-factor.

CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_factor_pairs AS
WITH base AS (
    SELECT c.*,
        CASE
            WHEN c.ownership = '1. State Hwy Agency'        THEN 'dot_roads'
            WHEN c.ownership = '2. County Hwy Agency'       THEN 'county_roads'
            WHEN c.ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
            ELSE 'other_roads'
        END AS road_type
    FROM public.crashes c
    WHERE c.speed = 'Yes'
),
pairs AS (
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'impaired'   AS co_factor FROM base WHERE alcohol = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'distracted' FROM base WHERE distracted = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'unrestrained' FROM base WHERE unrestrained = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'nighttime' FROM base WHERE night = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'motorcycle' FROM base WHERE motorcycle = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'pedestrian' FROM base WHERE pedestrian = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'bicycle' FROM base WHERE bike = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'intersection' FROM base
       WHERE intersection_analysis IN ('1. Intersection', '2. DOT Intersection',
                                        '3. Intersection-Related')
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           road_type, crash_severity, 'weather' FROM base
       WHERE weather_condition IS NOT NULL
         AND weather_condition NOT IN ('Clear', 'No Adverse Conditions', '');
)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district, road_type,
    'speed'::text AS factor_a,    -- always speed (this matview is speed-anchored)
    co_factor      AS factor_b,
    count(*)::integer                              AS total,
    sum((crash_severity = 'K')::int)::integer      AS k,
    sum((crash_severity = 'A')::int)::integer      AS a,
    sum((crash_severity = 'B')::int)::integer      AS b,
    sum((crash_severity = 'C')::int)::integer      AS c,
    sum((crash_severity = 'O')::int)::integer      AS o
FROM pairs
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         road_type, co_factor;

CREATE INDEX IF NOT EXISTS idx_mv_factor_pairs_lookup
    ON public.mv_factor_pairs (state, physical_juris_name);
CREATE INDEX IF NOT EXISTS idx_mv_factor_pairs_pd
    ON public.mv_factor_pairs (state, planning_district);
CREATE INDEX IF NOT EXISTS idx_mv_factor_pairs_factor
    ON public.mv_factor_pairs (state, factor_b);

GRANT SELECT ON public.mv_factor_pairs TO anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries (run after CREATE)
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Confirm mv_analysis_speed has both hour + year rows:
--      SELECT dimension, count(*) FROM mv_analysis_speed
--      WHERE state = 'delaware' GROUP BY dimension;
--    Expect: ('hour_speed', ~24 × N tier-buckets) and ('year_speed', ~17 × N).
--
-- 2. Confirm mv_factor_pairs returns speed × intersection counts:
--      SELECT factor_b, sum(total) AS speed_x_factor
--      FROM mv_factor_pairs
--      WHERE state = 'delaware' AND physical_juris_name = 'Sussex'
--      GROUP BY factor_b ORDER BY speed_x_factor DESC;
--    Expect: intersection, weather, nighttime are the largest co-factors.
--
-- 3. Sanity-check vs the broken pre-Round-8 numbers: if previous PDF showed
--    "Intersection: 132,125 (10,116% of speed)" and Sussex speed total ≈ 1,300,
--    the correct (true cross-tab) number for speed × intersection is something
--    like 200-400 (15-30% of speed).
