-- 2026-06-13 — Repair get_location_picker to match the rebuilt mv_location_picker
--
-- PROBLEM: mv_location_picker was rebuilt with columns
--   (state, county, region, mpo, planning_district, road_type, is_interstate,
--    location_type, location_name, location_id, total_crashes, k,a,b,c,o, epdo,
--    ped_count, bike_count, lon, lat, first_year, last_year)
-- but get_location_picker still SELECTed the OLD shape
--   (display_name, node_id, routes_array, jurisdiction_county, jurisdiction_*)
-- → the RPC errors `column "display_name" does not exist`, so the location
-- dropdown's fallback path is dead.
--
-- FIX: read the CURRENT columns and emit the same normalized contract the
-- frontend now uses (see _getLocationPickerMatview in assets/js/data-client.js):
--   * intersection → location_name = location_id (numeric node id; crashes.node
--     stores this), display_name = the human name, node_id = location_id
--   * segment      → location_name = route name (matches crashes.rte_name)
-- Jurisdiction filtering moves to the real columns (county / planning_district /
-- mpo / region). RETURNS-TABLE signature is unchanged so callers are unaffected.

CREATE OR REPLACE FUNCTION public.get_location_picker(
    p_state text,
    p_jurisdiction_kind text DEFAULT NULL::text,
    p_jurisdiction_value text DEFAULT NULL::text,
    p_road_type text DEFAULT 'all_no_interstate'::text,
    p_location_type text DEFAULT NULL::text,
    p_min_crashes integer DEFAULT 1,
    p_limit integer DEFAULT 500)
 RETURNS TABLE(location_type text, location_name text, display_name text, node_id text, routes_array jsonb, total_crashes bigint, k bigint, a bigint, epdo bigint, ped_count bigint, bike_count bigint, lat double precision, lon double precision, jurisdiction_county text, jurisdiction_county_fips text, jurisdiction_physical_juris text, jurisdiction_mpo text, jurisdiction_pd text)
 LANGUAGE sql
 STABLE
AS $function$
    SELECT
        location_type,
        CASE WHEN location_type = 'intersection' THEN location_id::text
             ELSE location_name END                       AS location_name,
        location_name                                      AS display_name,
        location_id::text                                  AS node_id,
        NULL::jsonb                                        AS routes_array,
        total_crashes::bigint, k::bigint, a::bigint, epdo::bigint,
        ped_count::bigint, bike_count::bigint,
        lat, lon,
        county                                             AS jurisdiction_county,
        NULL::text                                         AS jurisdiction_county_fips,
        county                                             AS jurisdiction_physical_juris,
        mpo                                                AS jurisdiction_mpo,
        planning_district                                  AS jurisdiction_pd
    FROM mv_location_picker
    WHERE state = lower(p_state)
      AND total_crashes >= p_min_crashes
      AND (p_location_type IS NULL OR location_type = p_location_type)
      AND (
          p_road_type IS NULL OR p_road_type = 'all'
          OR (p_road_type = 'all_no_interstate' AND is_interstate = false)
          OR road_type = p_road_type
      )
      AND (
          p_jurisdiction_kind IS NULL
          OR (p_jurisdiction_kind IN ('county','physical_juris') AND (
                county = p_jurisdiction_value
                OR county = p_jurisdiction_value || ' County'
                OR regexp_replace(COALESCE(county,''), ' County$','') =
                   regexp_replace(COALESCE(p_jurisdiction_value,''), ' County$','')
          ))
          OR (p_jurisdiction_kind = 'mpo' AND mpo = p_jurisdiction_value)
          OR (p_jurisdiction_kind = 'planning_district' AND planning_district = p_jurisdiction_value)
          OR (p_jurisdiction_kind = 'region' AND region = p_jurisdiction_value)
      )
    ORDER BY total_crashes DESC
    LIMIT p_limit;
$function$;

GRANT EXECUTE ON FUNCTION public.get_location_picker(text,text,text,text,text,integer,integer) TO anon, authenticated;
