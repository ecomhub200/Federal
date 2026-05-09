-- =============================================================================
-- Round 7 backend additions (2026-05-09)
-- =============================================================================
-- Purpose: Unblock per-intersection PDF reports and per-factor × per-year
--          breakdowns in the Fatal & Speed report.
--
-- Two changes:
--   B7a  Recreate mv_intersection_summary with intersection_node_id grouping
--        so per-intersection detail PDFs can filter by node id (instead of
--        the current grouping which only supports tier-level aggregates).
--   B7b  Create mv_factor_year for per-factor × per-year cross-tab so the
--        Year-Over-Year Speed Crashes column in the Fatal & Speed report
--        can render real numbers.
--
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
--                (port 5433 for direct Postgres, or via Supabase MCP
--                 apply_migration / execute_sql)
--
-- WARNING: B7a drops the existing mv_intersection_summary CASCADE. Verify no
--          other matviews depend on it before applying. Refresh time on
--          Delaware fixture is ~15s; on full-state datasets allow ~2 min.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- B7a: mv_intersection_summary regenerated with intersection_node_id
-- ─────────────────────────────────────────────────────────────────────────────
DROP MATERIALIZED VIEW IF EXISTS public.mv_intersection_summary CASCADE;

CREATE MATERIALIZED VIEW public.mv_intersection_summary AS
SELECT
    crashes.state,
    crashes.physical_juris_name,
    crashes.dot_district,
    crashes.mpo_name,
    crashes.planning_district,
    CASE
        WHEN crashes.ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN crashes.ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN crashes.ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END AS road_type,
    COALESCE(crashes.functional_class LIKE '1-Interstate%'
             OR crashes.system = 'DOT Interstate', false) AS is_interstate,
    crashes.intersection_type,
    crashes.traffic_control_type,
    COALESCE(NULLIF(crashes.collision_type, ''), 'Unknown') AS collision_type,
    crashes.crash_year,
    crashes.intersection_node_id,
    count(*)                                                                       AS total,
    sum(CASE WHEN crashes.crash_severity = 'K' THEN 1 ELSE 0 END)                  AS k,
    sum(CASE WHEN crashes.crash_severity = 'A' THEN 1 ELSE 0 END)                  AS a,
    sum(CASE WHEN crashes.crash_severity = 'B' THEN 1 ELSE 0 END)                  AS b,
    sum(CASE WHEN crashes.crash_severity = 'C' THEN 1 ELSE 0 END)                  AS c,
    sum(CASE WHEN crashes.crash_severity = 'O' THEN 1 ELSE 0 END)                  AS o,
    sum(CASE WHEN crashes.crash_severity = ANY(ARRAY['K','A']) THEN 1 ELSE 0 END)  AS ka,
    sum(CASE crashes.crash_severity
        WHEN 'K' THEN 883
        WHEN 'A' THEN 94
        WHEN 'B' THEN 21
        WHEN 'C' THEN 11
        WHEN 'O' THEN 1
        ELSE 0
    END)                                                                            AS epdo
FROM public.crashes
WHERE crashes.intersection_node_id IS NOT NULL
  AND crashes.intersection_node_id <> ''
GROUP BY
    crashes.state,
    crashes.physical_juris_name,
    crashes.dot_district,
    crashes.mpo_name,
    crashes.planning_district,
    (CASE
        WHEN crashes.ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN crashes.ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN crashes.ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END),
    (COALESCE(crashes.functional_class LIKE '1-Interstate%'
              OR crashes.system = 'DOT Interstate', false)),
    crashes.intersection_type,
    crashes.traffic_control_type,
    crashes.collision_type,
    crashes.crash_year,
    crashes.intersection_node_id;

CREATE INDEX idx_mv_intersection_summary_lookup
    ON public.mv_intersection_summary (state, physical_juris_name);
CREATE INDEX idx_mv_intersection_summary_pd
    ON public.mv_intersection_summary (state, planning_district);
CREATE INDEX idx_mv_intersection_summary_node
    ON public.mv_intersection_summary (state, intersection_node_id);

GRANT SELECT ON public.mv_intersection_summary TO anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- B7b: mv_factor_year (per-factor × per-year cross-tab)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE MATERIALIZED VIEW IF NOT EXISTS public.mv_factor_year AS
WITH base AS (
    SELECT c.*,
        CASE
            WHEN c.ownership = '1. State Hwy Agency'        THEN 'dot_roads'
            WHEN c.ownership = '2. County Hwy Agency'       THEN 'county_roads'
            WHEN c.ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
            ELSE 'other_roads'
        END                                                                          AS rt,
        COALESCE(c.functional_class LIKE '1-Interstate%'
                 OR c.system = 'DOT Interstate', false)                              AS isi
    FROM public.crashes c
    WHERE c.crash_year IS NOT NULL
),
expanded AS (
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'speed'        AS factor
    FROM base WHERE speed = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'impaired'
    FROM base WHERE alcohol = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'distracted'
    FROM base WHERE distracted = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'pedestrian'
    FROM base WHERE pedestrian = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'bicycle'
    FROM base WHERE bike = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'motorcycle'
    FROM base WHERE motorcycle = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'nighttime'
    FROM base WHERE night = 'Yes'
    UNION ALL
    SELECT state, physical_juris_name, dot_district, mpo_name, planning_district,
           rt, isi, crash_year, crash_severity, 'unrestrained'
    FROM base WHERE unrestrained = 'Yes'
)
SELECT
    state, physical_juris_name, dot_district, mpo_name, planning_district,
    rt AS road_type, isi AS is_interstate,
    factor, crash_year,
    count(*)::integer                                AS total,
    sum((crash_severity = 'K')::int)::integer        AS k,
    sum((crash_severity = 'A')::int)::integer        AS a
FROM expanded
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
         rt, isi, factor, crash_year;

CREATE INDEX idx_mv_factor_year_lookup
    ON public.mv_factor_year (state, factor, crash_year);

GRANT SELECT ON public.mv_factor_year TO anon;

-- ─────────────────────────────────────────────────────────────────────────────
-- Verification queries (run after CREATE)
-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Confirm mv_intersection_summary now groups by node:
--      SELECT state, intersection_node_id, count(*) AS rows
--      FROM mv_intersection_summary
--      WHERE state = 'delaware' AND intersection_node_id IS NOT NULL
--      GROUP BY state, intersection_node_id ORDER BY rows DESC LIMIT 10;
--
-- 2. Confirm mv_factor_year produces per-year speed counts:
--      SELECT state, factor, crash_year, total, k, a
--      FROM mv_factor_year
--      WHERE state = 'delaware' AND factor = 'speed'
--      ORDER BY crash_year DESC LIMIT 20;
