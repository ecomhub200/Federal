-- ============================================================================
-- Round 13 — get_location_picker(...) RPC
-- Jurisdiction-aware filter on mv_location_picker. Drives every "Or Select
-- Location" dropdown via crashLensClient.getLocationPicker().
--
-- road_type pseudo-filter contract:
--   'all_no_interstate' → translated to is_interstate=false predicate (every
--                          road_type bucket, but no Interstate)
--   'all' / NULL         → no road_type filter at all
--   anything else        → exact-match against road_type column
--
-- jurisdiction_value contract:
--   For p_jurisdiction_kind='county', the trailing ' County' suffix is stripped
--   before matching. mv_hotspots stores 'Kent', not 'Kent County'.
--
-- State-agnostic: lower(p_state) filter, no hardcoded jurisdiction values.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_location_picker(
    p_state              text,
    p_jurisdiction_kind  text DEFAULT NULL,    -- 'county' | 'mpo' | 'planning_district' | 'dot_district' | NULL
    p_jurisdiction_value text DEFAULT NULL,
    p_road_type          text DEFAULT 'all_no_interstate',
    p_location_type      text DEFAULT NULL,    -- 'intersection' | 'segment' | NULL=both
    p_min_crashes        int  DEFAULT 1,
    p_limit              int  DEFAULT 500
)
RETURNS TABLE (
    location_type    text,
    location_name    text,
    display_name     text,
    node_id          text,
    routes_array     jsonb,
    total_crashes    bigint,
    k                bigint,
    a                bigint,
    epdo             bigint,
    ped_count        bigint,
    bike_count       bigint,
    lat              double precision,
    lon              double precision,
    jurisdiction_county text,
    jurisdiction_mpo    text,
    jurisdiction_pd     text
)
LANGUAGE sql STABLE AS $$
    SELECT
        location_type, location_name, display_name, node_id, routes_array,
        total_crashes, k, a, epdo, ped_count, bike_count, lat, lon,
        jurisdiction_county, jurisdiction_mpo, jurisdiction_pd
    FROM mv_location_picker
    WHERE state = lower(p_state)
      AND total_crashes >= p_min_crashes
      AND (p_location_type IS NULL OR location_type = p_location_type)
      AND (
          p_road_type IS NULL
          OR p_road_type = 'all'
          OR (p_road_type = 'all_no_interstate' AND is_interstate = false)
          OR road_type = p_road_type
      )
      AND (
          p_jurisdiction_kind IS NULL
          OR (p_jurisdiction_kind = 'county'
              AND jurisdiction_county = regexp_replace(COALESCE(p_jurisdiction_value, ''), ' County$', ''))
          OR (p_jurisdiction_kind = 'mpo'                AND jurisdiction_mpo    = p_jurisdiction_value)
          OR (p_jurisdiction_kind = 'planning_district'  AND jurisdiction_pd     = p_jurisdiction_value)
          OR (p_jurisdiction_kind = 'dot_district'       AND jurisdiction_dot_district = p_jurisdiction_value)
      )
    ORDER BY total_crashes DESC
    LIMIT p_limit;
$$;

GRANT EXECUTE ON FUNCTION public.get_location_picker(text,text,text,text,text,int,int) TO anon, authenticated;
