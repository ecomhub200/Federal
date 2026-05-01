-- =============================================================================
-- ROLLBACK CAPTURE: map_viewport_crashes (pre-2026-04-30 body)
-- =============================================================================
-- Original 8-arg signature, captured via pg_get_functiondef() on
-- 2026-04-30 before the §7.7 migration extended it to 11 args.
--
-- To restore: feed this statement to apply_migration / execute_sql.
-- WARNING: the new front-end (post 2026-05-01 JS PR) calls the 11-arg
-- signature; reverting here without simultaneously reverting the JS will
-- 404 every map viewport request. Coordinate a JS revert in the same window.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.map_viewport_crashes(
    p_state    text,
    p_bbox     geometry,
    p_zoom     integer DEFAULT 12,
    p_tier_col text    DEFAULT NULL::text,
    p_tier_val text    DEFAULT NULL::text,
    p_year     integer DEFAULT NULL::integer,
    p_severity text[]  DEFAULT NULL::text[],
    p_limit    integer DEFAULT 10000
)
 RETURNS TABLE(
    cx double precision, cy double precision, n bigint,
    fatals bigint, serious bigint, epdo bigint, is_cluster boolean,
    objectid text, crash_severity text, crash_year integer,
    collision_type text, rte_name text, intersection_name text,
    crash_date text, crash_military_time text,
    pedestrian text, bike text, speed text,
    weather_condition text, light_condition text,
    document_nbr text, night text
 )
 LANGUAGE plpgsql
 STABLE
AS $function$
DECLARE
    grid_size numeric;
    state_filter text := '';
    tier_filter text := '';
    year_filter text := '';
    sev_filter text := '';
    clean_tier_val text;
BEGIN
    IF p_tier_val IS NOT NULL THEN
        clean_tier_val := regexp_replace(p_tier_val, '\s+(County|City|Township|Borough|Parish|Municipality)$', '', 'i');
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

    IF p_zoom >= 14 THEN
        grid_size := 0;
    ELSIF p_zoom >= 12 THEN
        grid_size := 0.005;
    ELSIF p_zoom >= 10 THEN
        grid_size := 0.02;
    ELSIF p_zoom >= 8 THEN
        grid_size := 0.05;
    ELSE
        grid_size := 0.1;
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
             FROM crashes
             WHERE geom && %L %s %s %s %s
             LIMIT %s',
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, p_limit
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
             FROM crashes
             WHERE geom && %L %s %s %s %s
             GROUP BY 1, 2
             ORDER BY 3 DESC
             LIMIT %s',
            grid_size, grid_size, grid_size, grid_size,
            p_bbox, state_filter, tier_filter, year_filter, sev_filter, p_limit
        );
    END IF;
END;
$function$;
