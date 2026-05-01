-- =============================================================================
-- §2 Reality check — RUN THIS FIRST, capture every output to the ticket.
-- =============================================================================
-- Purpose: Confirm baseline before any DDL. The follow-up migrations
-- (01–09) drop and rebuild matviews; if these baselines mismatch, STOP
-- and reconcile with the prompt author before proceeding.
--
-- Run via Supabase MCP execute_sql (read-only — no side effects).
-- =============================================================================

-- (a) Matviews that exist
SELECT matviewname
  FROM pg_matviews
 WHERE schemaname = 'public'
 ORDER BY 1;
-- Expected:
--   dashboard_summary
--   federal_summary
--   jurisdiction_baselines
--   mv_analysis_summary
--   mv_crash_tree
--   mv_grants_baseline
--   mv_hotspots
--   mv_safety_categories
--   scorecard_rankings
--   scorecard_summary

-- (b) dashboard_summary current bucket distribution (3-bucket, system-derived)
SELECT road_type,
       count(*)              AS group_rows,
       sum(crash_count)      AS crashes
  FROM dashboard_summary
 GROUP BY road_type
 ORDER BY crashes DESC;
-- Expected today (Delaware-only):
--   dot_roads      ~424K
--   non_dot_roads  ~136K
--   all_roads      ~  9.6K
-- NOTE: there is NO city_roads bucket today — that is the bug we are fixing.

-- (c) mv_hotspots / mv_grants_baseline buckets (only 2 today, missing all/city)
SELECT 'hotspots'::text AS v, road_type, count(*) AS rows
  FROM mv_hotspots GROUP BY road_type
UNION ALL
SELECT 'grants',           road_type, count(*)
  FROM mv_grants_baseline GROUP BY road_type
 ORDER BY 1, 2;

-- (d) mv_crash_tree / mv_safety_categories / mv_analysis_summary should NOT
--     yet have road_type or is_interstate columns
SELECT c.relname, a.attname
  FROM pg_attribute a
  JOIN pg_class    c ON a.attrelid = c.oid
 WHERE c.relname IN ('mv_crash_tree','mv_safety_categories','mv_analysis_summary')
   AND a.attname IN ('road_type','is_interstate')
   AND NOT a.attisdropped;
-- Expected: 0 rows.

-- (e) map_viewport_crashes signature (no p_road_type today)
SELECT pg_get_function_arguments(oid) AS arguments
  FROM pg_proc
 WHERE proname = 'map_viewport_crashes';
-- Expected today: text, geometry, integer, text, text, integer, text[], integer
-- After step 7:   text, geometry, integer, text, text, integer, text[], text, text[], boolean, integer

-- (f) ownership column distribution — drives the new buckets
SELECT ownership, count(*) AS crashes
  FROM crashes
 GROUP BY ownership
 ORDER BY 2 DESC;
-- Expected (Delaware):
--   "1. State Hwy Agency"        ~438K  → dot_roads
--   "3. City or Town Hwy Agency" ~ 81K  → city_roads      (currently missing!)
--   "2. County Hwy Agency"       ~ 40K  → county_roads
--   NULL                         ~  9.5K → other_roads
--   "4. Federal Roads"           ~  400 → other_roads
--   "6. Private/Unknown Roads"   ~  130 → other_roads

-- (g) Interstate identifier
SELECT functional_class, count(*) AS crashes
  FROM crashes
 WHERE functional_class LIKE '1-Interstate%'
 GROUP BY functional_class;
-- Expected: "1-Interstate (A,1)" ~ 40K

-- (h) Snapshot the existing map_viewport_crashes body so we can splice it
--     into step 7 without losing the PostGIS clustering logic.
--
--     Save the result to docs/rollback/map_viewport_crashes.pre.sql verbatim.
SELECT pg_get_functiondef(
  'public.map_viewport_crashes(text,geometry,integer,text,text,integer,text[],integer)'::regprocedure
) AS body;

-- (i) Confirm pg_cron / pg_prewarm availability for step 9
SELECT extname, extversion
  FROM pg_extension
 WHERE extname IN ('pg_cron','pg_prewarm','postgis')
 ORDER BY extname;
-- If pg_cron is missing, step 9 will skip the schedule (see README §"Special steps").
-- If pg_prewarm is missing, comment out the prewarm calls in step 9.

-- (j) Confirm the bucketing source columns exist
SELECT column_name, data_type
  FROM information_schema.columns
 WHERE table_schema = 'public'
   AND table_name   = 'crashes'
   AND column_name IN ('ownership','functional_class','system','road_type')
 ORDER BY column_name;
-- Required: ownership, functional_class, system. (road_type may or may not exist —
-- the new matviews override it with the ownership-derived bucket regardless.)
