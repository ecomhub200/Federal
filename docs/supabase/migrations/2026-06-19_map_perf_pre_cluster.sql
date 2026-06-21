-- =============================================================================
-- 2026-06-19 — Map tab "instant" performance: pre-clustered overview
--              (APPLIED + VERIFIED 2026-06-21 on srv1503081.hstgr.cloud)
--
-- ROOT CAUSE (EXPLAIN ANALYZE, not theory): map_viewport_crashes' low-zoom
-- branch clusters rows LIVE with round(x/grid)*grid over the bbox match. The
-- GiST geom index IS used (Bitmap Index Scan ~67 ms) — the cost is the Bitmap
-- HEAP SCAN: a whole-state viewport's ~31k+ matching rows are scattered across
-- ~19,435 8-KB heap pages (the fat mv_map_crashes isn't spatially clustered),
-- so fetching them costs ~2.8 s. Locality, not the index, is the bottleneck.
--
-- FIX: pre-aggregate the unfiltered per-state clusters at the 4 low-zoom grid
-- sizes into mv_map_clusters, and serve the unfiltered low-zoom overview from
-- it. Verified BYTE-IDENTICAL to the live cluster query across all 4 grids
-- (0.005/0.02/0.05/0.1): same cell set, same cx/cy/n/fatals/serious/epdo, zero
-- differing rows; DE overview 258 cells / 569,828. ~16 ms vs ~2,500 ms (~150x).
--
-- SAFETY: the RPC fast path triggers ONLY when p_state IS NOT NULL and NO
-- filter is active (tier / year / severity / road-type / no-interstate /
-- factor). ANY active filter, plus the street-zoom point path (grid_size=0),
-- falls through to the original live query UNCHANGED. Verified post-swap:
-- year=2024 -> 37,177; planning_district=North District -> 337,469;
-- street zoom 15 -> point rows, is_cluster=false. Rollback = CREATE OR REPLACE
-- the function body without the ELSIF branch.
--
-- NOTE: serious = count of severity 'A' ONLY and binning = round(x/g)*g — both
-- deliberately mirror the live RPC so the matview is a true drop-in. cell_geom
-- is the cluster CENTER point (the value the RPC returns as cx/cy).
-- =============================================================================

-- 1) Pre-clustered overview matview ------------------------------------------
DROP MATERIALIZED VIEW IF EXISTS public.mv_map_clusters;
CREATE MATERIALIZED VIEW public.mv_map_clusters AS
WITH zoom_grid (g) AS (VALUES (0.005::numeric), (0.02), (0.05), (0.1))
SELECT
  m.state,
  zg.g AS grid_size,
  (round(m.x::numeric / zg.g) * zg.g)::float8 AS cx,
  (round(m.y::numeric / zg.g) * zg.g)::float8 AS cy,
  ST_SetSRID(ST_MakePoint(
     (round(m.x::numeric / zg.g) * zg.g)::float8,
     (round(m.y::numeric / zg.g) * zg.g)::float8), 4326) AS cell_geom,
  count(*)::bigint AS n,
  count(*) FILTER (WHERE m.crash_severity = 'K')::bigint AS fatals,
  count(*) FILTER (WHERE m.crash_severity = 'A')::bigint AS serious,
  sum(CASE m.crash_severity WHEN 'K' THEN 883 WHEN 'A' THEN 94 WHEN 'B' THEN 21 WHEN 'C' THEN 11 ELSE 1 END)::bigint AS epdo
FROM public.mv_map_crashes m
CROSS JOIN zoom_grid zg
WHERE m.x IS NOT NULL AND m.y IS NOT NULL
GROUP BY m.state, zg.g, round(m.x::numeric / zg.g), round(m.y::numeric / zg.g);

CREATE UNIQUE INDEX mv_map_clusters_pk ON public.mv_map_clusters (state, grid_size, cx, cy);
CREATE INDEX mv_map_clusters_geom_idx ON public.mv_map_clusters USING gist (cell_geom);

-- 2) RPC fast path -----------------------------------------------------------
-- Adds ONE ELSIF branch between the grid_size=0 (points) branch and the live
-- cluster branch. Everything else is the verbatim original function body.
CREATE OR REPLACE FUNCTION public.map_viewport_crashes(p_state text, p_bbox geometry, p_zoom integer DEFAULT 12, p_tier_col text DEFAULT NULL::text, p_tier_val text DEFAULT NULL::text, p_year integer DEFAULT NULL::integer, p_severity text[] DEFAULT NULL::text[], p_road_type text DEFAULT NULL::text, p_road_types text[] DEFAULT NULL::text[], p_no_interstate boolean DEFAULT false, p_limit integer DEFAULT 10000, p_factor text DEFAULT NULL::text)
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
        tier_filter := format('AND (%I = %L OR %I = %L)', p_tier_col, p_tier_val, p_tier_col, clean_tier_val);
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
                    END) = %L $$, p_road_type);
    ELSIF p_road_types IS NOT NULL AND array_length(p_road_types, 1) > 0 THEN
        road_filter := format(
            $$ AND (CASE
                       WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
                       WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
                       WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
                       ELSE 'other_roads'
                    END) = ANY(%L::text[]) $$, p_road_types);
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
        -- street zoom: individual points (UNCHANGED)
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
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, road_filter, no_int_filter, factor_filter, p_limit);
    ELSIF p_state IS NOT NULL
          AND tier_filter = '' AND year_filter = '' AND sev_filter = ''
          AND road_filter = '' AND no_int_filter = '' AND factor_filter = '' THEN
        -- FAST PATH: unfiltered low-zoom overview from the pre-clustered matview
        RETURN QUERY EXECUTE format(
            'SELECT cx::float8, cy::float8, n, fatals, serious, epdo,
                    true,
                    NULL::text, NULL::text, NULL::int, NULL::text, NULL::text, NULL::text,
                    NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, NULL::text,
                    NULL::text, NULL::text
             FROM mv_map_clusters
             WHERE state = %L AND grid_size = %s AND cell_geom && %L
             ORDER BY n DESC
             LIMIT %s',
            p_state, grid_size, p_bbox, p_limit);
    ELSE
        -- live clustering (any active filter; UNCHANGED)
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
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, road_filter, no_int_filter, factor_filter, p_limit);
    END IF;
END;
$function$;

-- 3) Nightly refresh (after mv_map_crashes @ 03:50) --------------------------
SELECT cron.schedule('refresh-mv-map-clusters', '10 4 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_map_clusters');
