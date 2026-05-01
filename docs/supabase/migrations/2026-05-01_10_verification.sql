-- =============================================================================
-- §10 Verification — read-only post-deploy checks
-- =============================================================================
-- Run via execute_sql AFTER all 01–09 migrations have applied (and the
-- map_viewport_crashes template has been spliced + applied). Capture the
-- output to the ticket — the JS PR depends on every check below being
-- green.
-- =============================================================================

-- (1) Every Crash Lens matview has the new bucket + flag columns.
SELECT c.relname,
       bool_or(a.attname = 'road_type')    AS has_road_type,
       bool_or(a.attname = 'is_interstate') AS has_is_interstate
  FROM pg_attribute a
  JOIN pg_class    c ON a.attrelid = c.oid
 WHERE c.relname IN ('dashboard_summary','mv_hotspots','mv_grants_baseline',
                     'mv_crash_tree','mv_safety_categories','mv_analysis_summary')
   AND NOT a.attisdropped
   AND a.attnum > 0
 GROUP BY c.relname
 ORDER BY c.relname;
-- Expected: 6 rows, has_road_type = true, has_is_interstate = true on all.

-- (2) Every matview has city_roads rows (was missing before).
SELECT 'dashboard_summary' AS view, count(*) FROM dashboard_summary
 WHERE road_type = 'city_roads'
UNION ALL
SELECT 'mv_hotspots',                count(*) FROM mv_hotspots
 WHERE road_type = 'city_roads'
UNION ALL
SELECT 'mv_grants_baseline',         count(*) FROM mv_grants_baseline
 WHERE road_type = 'city_roads'
UNION ALL
SELECT 'mv_crash_tree',              count(*) FROM mv_crash_tree
 WHERE road_type = 'city_roads'
UNION ALL
SELECT 'mv_safety_categories',       count(*) FROM mv_safety_categories
 WHERE road_type = 'city_roads'
UNION ALL
SELECT 'mv_analysis_summary',        count(*) FROM mv_analysis_summary
 WHERE road_type = 'city_roads';
-- Expected: every count > 0.

-- (3) is_interstate filter works (Delaware: ~40K crashes total).
SELECT is_interstate, sum(crash_count) AS crashes
  FROM dashboard_summary
 WHERE state = 'delaware'
 GROUP BY is_interstate
 ORDER BY 1;
-- Expected: 2 rows, both > 0; true ≈ 40K.

-- (4) ownership-bucket distribution sanity check (Delaware).
SELECT road_type, sum(crash_count) AS crashes
  FROM dashboard_summary
 WHERE state = 'delaware'
 GROUP BY road_type
 ORDER BY crashes DESC;
-- Expected (Delaware, approx):
--   dot_roads     ~438K
--   city_roads    ~ 81K
--   county_roads  ~ 40K
--   other_roads   ~ 10K

-- (5) map_viewport_crashes signature now has p_road_type / p_road_types /
--     p_no_interstate.
SELECT pg_get_function_arguments(oid)
  FROM pg_proc
 WHERE proname = 'map_viewport_crashes';
-- Expected: text, geometry, integer, text, text, integer, text[],
--           text, text[], boolean, integer

-- (6) RPC honors p_road_type (Delaware city_roads).
SELECT count(*) FROM public.map_viewport_crashes(
    p_state     := 'delaware',
    p_bbox      := ST_GeomFromText('POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))', 4326),
    p_zoom      := 10,
    p_road_type := 'city_roads'
);
-- Expected: > 0.

-- (7) RPC honors p_no_interstate (excludes interstates).
SELECT
    (SELECT count(*) FROM public.map_viewport_crashes(
        p_state         := 'delaware',
        p_bbox          := ST_GeomFromText('POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))', 4326),
        p_zoom          := 10,
        p_no_interstate := FALSE)) AS with_interstates,
    (SELECT count(*) FROM public.map_viewport_crashes(
        p_state         := 'delaware',
        p_bbox          := ST_GeomFromText('POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))', 4326),
        p_zoom          := 10,
        p_no_interstate := TRUE))  AS no_interstates;
-- Expected: with_interstates > no_interstates (some rows excluded).

-- (8) Refresh procedure exists and has a schedule (if pg_cron is on).
SELECT proname, pronargs FROM pg_proc
 WHERE proname = 'refresh_crash_lens_matviews';
-- Expected: 1 row, pronargs = 0.

-- If pg_cron is installed:
-- SELECT jobid, schedule, command
--   FROM cron.job
--  WHERE jobname = 'crashlens_matview_refresh';
-- Expected: 1 row, schedule '15 3 * * *'.

-- (9) PostgREST cache function present + executable as anon.
SELECT
    p.proname,
    has_function_privilege('anon', p.oid, 'EXECUTE')           AS anon_exec,
    has_function_privilege('authenticator', p.oid, 'EXECUTE')  AS authenticator_exec
  FROM pg_proc p
 WHERE proname = 'add_cache_headers';
-- Expected: 1 row, both true. (PostgREST env var
-- PGRST_DB_PRE_REQUEST=public.add_cache_headers must be set + reload to
-- actually emit the headers.)

-- (10) Refresh time check — drives the nightly cron budget.
\timing on
CALL public.refresh_crash_lens_matviews();
\timing off
-- Capture the wall-clock time and post in the ticket. If > 5 min,
-- consider parallelizing or splitting the procedure.
