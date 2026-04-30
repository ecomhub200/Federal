-- =============================================================================
-- Recreate `dashboard_summary` matview with a `road_type` column
-- =============================================================================
-- Purpose: Allow the front-end to query dashboard_summary with a road_type
--          filter (dot_roads / non_dot_roads / all_roads) without falling back
--          to a full R2 parquet download (which OOMs the browser at aggregate
--          tiers).
--
-- The column mirrors the exact CASE logic used by `mv_hotspots` and
-- `mv_grants_baseline` so all three matviews bucket crashes the same way.
--
-- Run against:  self-hosted Supabase on srv1503081.hstgr.cloud
--               (port 5433 for direct Postgres, or via Supabase MCP execute_sql)
--
-- Verification queries are at the bottom of this file.
-- =============================================================================

-- Step 1: Drop the old matview
DROP MATERIALIZED VIEW IF EXISTS public.dashboard_summary;

-- Step 2: Recreate with road_type column
CREATE MATERIALIZED VIEW public.dashboard_summary AS
SELECT
    crashes.state,
    COALESCE(crashes.physical_juris_name, ''::text)  AS physical_juris_name,
    COALESCE(crashes.dot_district, ''::text)         AS dot_district,
    COALESCE(crashes.mpo_name, ''::text)             AS mpo_name,
    COALESCE(crashes.planning_district, ''::text)    AS planning_district,
    COALESCE(crashes.crash_year, 0)                  AS crash_year,
    COALESCE(crashes.crash_severity, ''::text)       AS crash_severity,
    COALESCE(crashes.functional_class, ''::text)     AS functional_class,
    COALESCE(crashes.area_type, ''::text)            AS area_type,
    COALESCE(crashes.collision_type, ''::text)       AS collision_type,
    -- NEW: road_type bucket derived from system column
    -- Mirrors the exact CASE logic used by mv_hotspots and mv_grants_baseline
    CASE
        WHEN crashes.system = ANY (ARRAY['DOT Primary'::text, 'DOT Secondary'::text, 'DOT Interstate'::text])
            THEN 'dot_roads'::text
        WHEN crashes.system = ANY (ARRAY['Non-DOT primary'::text, 'Non-DOT secondary'::text])
            THEN 'non_dot_roads'::text
        ELSE 'all_roads'::text
    END                                              AS road_type,
    count(*)                                         AS crash_count,
    sum(crashes.k_people)                            AS fatals,
    sum(crashes.a_people)                            AS serious_injuries,
    sum(crashes.persons_injured)                     AS total_injured,
    sum(CASE WHEN crashes.pedestrian = 'Yes'::text     THEN 1 ELSE 0 END) AS ped_crashes,
    sum(CASE WHEN crashes.bike = 'Yes'::text           THEN 1 ELSE 0 END) AS bike_crashes,
    sum(CASE WHEN crashes.speed = 'Yes'::text          THEN 1 ELSE 0 END) AS speed_crashes,
    sum(CASE WHEN crashes.alcohol = 'Yes'::text        THEN 1 ELSE 0 END) AS alcohol_crashes,
    sum(CASE WHEN crashes.night = 'Yes'::text          THEN 1 ELSE 0 END) AS night_crashes,
    sum(CASE WHEN crashes.animal_related = 'Yes'::text THEN 1 ELSE 0 END) AS animal_crashes
FROM crashes
GROUP BY
    crashes.state,
    COALESCE(crashes.physical_juris_name, ''::text),
    COALESCE(crashes.dot_district, ''::text),
    COALESCE(crashes.mpo_name, ''::text),
    COALESCE(crashes.planning_district, ''::text),
    COALESCE(crashes.crash_year, 0),
    COALESCE(crashes.crash_severity, ''::text),
    COALESCE(crashes.functional_class, ''::text),
    COALESCE(crashes.area_type, ''::text),
    COALESCE(crashes.collision_type, ''::text),
    CASE
        WHEN crashes.system = ANY (ARRAY['DOT Primary'::text, 'DOT Secondary'::text, 'DOT Interstate'::text])
            THEN 'dot_roads'::text
        WHEN crashes.system = ANY (ARRAY['Non-DOT primary'::text, 'Non-DOT secondary'::text])
            THEN 'non_dot_roads'::text
        ELSE 'all_roads'::text
    END;

-- Step 3: Set ownership to postgres (NOT supabase_admin — PostgREST won't see
-- it via the anon key otherwise)
ALTER MATERIALIZED VIEW public.dashboard_summary OWNER TO postgres;

-- Step 4: Grant SELECT to anon role (required for PostgREST access)
GRANT SELECT ON public.dashboard_summary TO anon;

-- Step 5: Create indexes for performance
CREATE INDEX idx_dashboard_summary_state     ON public.dashboard_summary (state);
CREATE INDEX idx_dashboard_summary_road_type ON public.dashboard_summary (road_type);
CREATE INDEX idx_dashboard_summary_tier      ON public.dashboard_summary
    (state, physical_juris_name, dot_district, mpo_name, planning_district);

-- Step 6: Refresh the matview to populate it
REFRESH MATERIALIZED VIEW public.dashboard_summary;

-- =============================================================================
-- Verification
-- =============================================================================

-- 1. Confirm road_type column exists (matviews aren't in information_schema,
--    use pg_attribute):
-- SELECT attname FROM pg_attribute
--  WHERE attrelid = 'public.dashboard_summary'::regclass
--    AND attname = 'road_type' AND NOT attisdropped;
-- Expected: 1 row.

-- 2. Check row counts per road_type bucket:
-- SELECT road_type, count(*) AS groups, sum(crash_count) AS total_crashes
--   FROM dashboard_summary
--  GROUP BY road_type
--  ORDER BY total_crashes DESC;
-- Expected: 3 rows (dot_roads, non_dot_roads, all_roads) with non-zero counts.

-- 3. Verify ownership:
-- SELECT matviewowner FROM pg_matviews WHERE matviewname = 'dashboard_summary';
-- Expected: 'postgres'

-- 4. Test the PostgREST query that was previously failing:
-- SELECT count(*) FROM dashboard_summary
--  WHERE state = 'delaware' AND road_type = 'dot_roads';
-- Expected: non-zero number.
