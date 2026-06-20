-- 2026-06-11 — Map viewport performance fix
--
-- PROBLEM: map_viewport_crashes() ran `FROM crashes` (the partitioned base
-- table). At low zoom (state/region/federal) the whole-state bbox makes the
-- GiST index non-selective, so Postgres parallel-seq-scans all 569k rows of the
-- fat `crashes` table (111 cols + 3 JSONB bags → ~1.1 GB heap read). Measured
-- 7,280 ms for a whole-Delaware aggregate.
--
-- FIX: introduce a SLIM matview `mv_map_crashes` that projects ONLY the ~35
-- scalar columns the RPC reads (no JSONB), with the SAME coordinates (x/y/geom),
-- the SAME `ownership`/`functional_class`/`system` columns, and the SAME factor
-- columns — so results are byte-for-byte identical, just much narrower to scan.
-- Repoint the RPC at it. The RPC arg list + RETURNS TABLE signature are
-- unchanged, so the frontend (supabase-map-bridge.js / getViewportCrashes) needs
-- no change.
--
-- NOTE: we deliberately do NOT reuse the existing `mv_map_points` — it uses
-- different coordinates (road_lat/road_lon vs x/y), a different road_type
-- bucketing (system/sdot-based with a separate 'interstate' bucket), and filters
-- out rows with null road_lat/lon. Reusing it would change map positions, row
-- counts, and road-type semantics. `mv_map_crashes` mirrors the RPC's existing
-- `crashes`-table semantics exactly.

-- ── 1. Slim matview ────────────────────────────────────────────────────────
DROP MATERIALIZED VIEW IF EXISTS public.mv_map_crashes CASCADE;

CREATE MATERIALIZED VIEW public.mv_map_crashes AS
SELECT
    c.objectid,
    c.state,
    c.geom,
    c.x,
    c.y,
    c.crash_year,
    c.crash_severity,
    c.ownership,
    c.functional_class,
    c.system,
    c.dot_district,
    c.mpo_name,
    c.planning_district,
    c.physical_juris_name,
    c.collision_type,
    c.rte_name,
    c.intersection_name,
    c.crash_date,
    c.crash_military_time,
    c.light_condition,
    c.weather_condition,
    c.document_nbr,
    c.pedestrian,
    c.bike,
    c.motorcycle,
    c.alcohol,
    c.speed,
    c.distracted,
    c.unrestrained,
    c.night,
    c.animal_related,
    c.guardrail_related,
    c.work_zone_related,
    c.school_zone,
    c.is_intersection
FROM crashes c
WHERE c.geom IS NOT NULL;

-- REFRESH CONCURRENTLY needs a UNIQUE index. (state, objectid) is the upsert key.
CREATE UNIQUE INDEX mv_map_crashes_uniq      ON public.mv_map_crashes (state, objectid);
CREATE INDEX        mv_map_crashes_geom_idx  ON public.mv_map_crashes USING gist (geom);
CREATE INDEX        mv_map_crashes_state_year ON public.mv_map_crashes (state, crash_year);

GRANT SELECT ON public.mv_map_crashes TO anon, authenticated;
ANALYZE public.mv_map_crashes;

-- ── 2. Repoint the RPC (verbatim body except FROM crashes → FROM mv_map_crashes) ──
CREATE OR REPLACE FUNCTION public.map_viewport_crashes(
    p_state text,
    p_bbox geometry,
    p_zoom integer DEFAULT 12,
    p_tier_col text DEFAULT NULL::text,
    p_tier_val text DEFAULT NULL::text,
    p_year integer DEFAULT NULL::integer,
    p_severity text[] DEFAULT NULL::text[],
    p_road_type text DEFAULT NULL::text,
    p_road_types text[] DEFAULT NULL::text[],
    p_no_interstate boolean DEFAULT false,
    p_limit integer DEFAULT 10000,
    p_factor text DEFAULT NULL::text)
 RETURNS TABLE(cx double precision, cy double precision, n bigint, fatals bigint, serious bigint, epdo bigint, is_cluster boolean, objectid text, crash_severity text, crash_year integer, collision_type text, rte_name text, intersection_name text, crash_date text, crash_military_time text, pedestrian text, bike text, speed text, weather_condition text, light_condition text, document_nbr text, night text)
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    grid_size       numeric;
    state_filter    text := '';
    tier_filter     text := '';
    year_filter     text := '';
    sev_filter      text := '';
    road_filter     text := '';
    no_int_filter   text := '';
    factor_filter   text := '';
    clean_tier_val  text;
BEGIN
    IF p_tier_val IS NOT NULL THEN
        clean_tier_val := regexp_replace(p_tier_val,
            '\s+(County|City|Township|Borough|Parish|Municipality)$', '', 'i');
    END IF;

    IF p_state IS NOT NULL THEN
        state_filter := format('AND state = %L', p_state);
    END IF;

    IF p_tier_col IS NOT NULL AND p_tier_val IS NOT NULL THEN
        tier_filter := format(
            'AND (%I = %L OR %I = %L)',
            p_tier_col, p_tier_val,
            p_tier_col, clean_tier_val
        );
    END IF;

    IF p_year IS NOT NULL THEN
        year_filter := format('AND crash_year = %s', p_year);
    END IF;

    IF p_severity IS NOT NULL THEN
        sev_filter := format('AND crash_severity = ANY(%L::text[])', p_severity);
    END IF;

    IF p_road_type IS NOT NULL THEN
        road_filter := format(
            $$ AND (CASE
                       WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
                       WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
                       WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
                       ELSE 'other_roads'
                    END) = %L $$,
            p_road_type
        );
    ELSIF p_road_types IS NOT NULL AND array_length(p_road_types, 1) > 0 THEN
        road_filter := format(
            $$ AND (CASE
                       WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
                       WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
                       WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
                       ELSE 'other_roads'
                    END) = ANY(%L::text[]) $$,
            p_road_types
        );
    END IF;

    IF p_no_interstate THEN
        no_int_filter := $$ AND COALESCE(functional_class LIKE '1-Interstate%' OR system='DOT Interstate', false) = false $$;
    END IF;

    IF p_factor IS NOT NULL AND p_factor <> '' THEN
        factor_filter := CASE p_factor
            WHEN 'fatal'        THEN $$ AND crash_severity = 'K' $$
            WHEN 'ka'           THEN $$ AND crash_severity IN ('K','A') $$
            WHEN 'pedestrian'   THEN $$ AND pedestrian = 'Yes' $$
            WHEN 'bike'         THEN $$ AND bike = 'Yes' $$
            WHEN 'bicycle'      THEN $$ AND bike = 'Yes' $$
            WHEN 'motorcycle'   THEN $$ AND motorcycle = 'Yes' $$
            WHEN 'impaired'     THEN $$ AND alcohol = 'Yes' $$
            WHEN 'alcohol'      THEN $$ AND alcohol = 'Yes' $$
            WHEN 'speed'        THEN $$ AND speed = 'Yes' $$
            WHEN 'distracted'   THEN $$ AND distracted = 'Yes' $$
            WHEN 'unrestrained' THEN $$ AND unrestrained = 'Yes' $$
            WHEN 'nighttime'    THEN $$ AND night = 'Yes' $$
            WHEN 'night'        THEN $$ AND night = 'Yes' $$
            WHEN 'animal'       THEN $$ AND animal_related = 'Yes' $$
            WHEN 'guardrail'    THEN $$ AND guardrail_related = 'Yes' $$
            WHEN 'weather'      THEN $$ AND weather_condition NOT IN ('1. Clear','Clear','Not Provided','') AND weather_condition IS NOT NULL $$
            WHEN 'workzone'     THEN $$ AND work_zone_related IN ('Yes','1. Yes') $$
            WHEN 'school'       THEN $$ AND school_zone = 'Yes' $$
            WHEN 'intersection' THEN $$ AND is_intersection = 'Yes' $$
            ELSE ''
        END;
    END IF;

    IF p_zoom >= 14 THEN grid_size := 0;
    ELSIF p_zoom >= 12 THEN grid_size := 0.005;
    ELSIF p_zoom >= 10 THEN grid_size := 0.02;
    ELSIF p_zoom >= 8  THEN grid_size := 0.05;
    ELSE grid_size := 0.1;
    END IF;

    IF grid_size = 0 THEN
        RETURN QUERY EXECUTE format(
            'SELECT x::float8, y::float8,
                    1::bigint,
                    (CASE WHEN crash_severity = ''K'' THEN 1 ELSE 0 END)::bigint,
                    (CASE WHEN crash_severity = ''A'' THEN 1 ELSE 0 END)::bigint,
                    (CASE crash_severity WHEN ''K'' THEN 883 WHEN ''A'' THEN 94 WHEN ''B'' THEN 21 WHEN ''C'' THEN 11 ELSE 1 END)::bigint,
                    false,
                    objectid::text, crash_severity, crash_year, collision_type, rte_name, intersection_name,
                    crash_date::text, crash_military_time, pedestrian, bike, speed, weather_condition, light_condition,
                    document_nbr, night
             FROM mv_map_crashes
             WHERE geom && %L %s %s %s %s %s %s %s
             LIMIT %s',
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, road_filter, no_int_filter, factor_filter, p_limit
        );
    ELSE
        RETURN QUERY EXECUTE format(
            'SELECT (round(x::numeric / %s) * %s)::float8,
                    (round(y::numeric / %s) * %s)::float8,
                    count(*)::bigint,
                    count(*) filter (where crash_severity = ''K'')::bigint,
                    count(*) filter (where crash_severity = ''A'')::bigint,
                    sum(CASE crash_severity WHEN ''K'' THEN 883 WHEN ''A'' THEN 94 WHEN ''B'' THEN 21 WHEN ''C'' THEN 11 ELSE 1 END)::bigint,
                    true,
                    NULL::text, NULL::text, NULL::int, NULL::text, NULL::text, NULL::text,
                    NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
                    NULL::text, NULL::text
             FROM mv_map_crashes
             WHERE geom && %L %s %s %s %s %s %s %s
             GROUP BY 1, 2
             ORDER BY 3 DESC
             LIMIT %s',
            grid_size, grid_size, grid_size, grid_size,
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, road_filter, no_int_filter, factor_filter, p_limit
        );
    END IF;
END;
$function$;

-- ── 3. Wire mv_map_crashes into the refresh routine ────────────────────────
CREATE OR REPLACE PROCEDURE public.refresh_crash_lens_matviews()
 LANGUAGE plpgsql
AS $procedure$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_map_crashes;
    REFRESH MATERIALIZED VIEW public.mv_hotspots;
    REFRESH MATERIALIZED VIEW public.mv_grants_baseline;
    REFRESH MATERIALIZED VIEW public.mv_crash_tree;
    REFRESH MATERIALIZED VIEW public.mv_safety_categories;
    REFRESH MATERIALIZED VIEW public.mv_analysis_summary;
    PERFORM pg_prewarm('public.dashboard_summary');
    PERFORM pg_prewarm('public.mv_map_crashes');
    PERFORM pg_prewarm('public.mv_hotspots');
    PERFORM pg_prewarm('public.mv_grants_baseline');
    PERFORM pg_prewarm('public.mv_crash_tree');
    PERFORM pg_prewarm('public.mv_safety_categories');
    PERFORM pg_prewarm('public.mv_analysis_summary');
END;
$procedure$;

-- Dedicated nightly cron (mirrors the other MV jobs; 03:50 UTC, before the
-- 04:00 dashboard_summary job so the map MV is fresh for the morning).
SELECT cron.schedule('refresh-mv-map-crashes', '50 3 * * *',
                     'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_map_crashes');
