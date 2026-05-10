-- ============================================================================
-- Round 13 — Grant-Ready Locations
-- Per-location matview that backs the Grant-Ready Locations table on the
-- Grants tab. Replaces the empty mv_grants_baseline path which was per-year
-- and required client-side aggregation.
--
-- score_balanced (0-100): EPDO-normalised within (state, road_type) plus a
-- VRU bonus so pedestrian/bicycle hotspots aren't drowned out by interstate
-- volume sites.
--
-- State-agnostic — keys on data shape via mv_location_picker.
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS mv_grant_ready_locations CASCADE;

CREATE MATERIALIZED VIEW mv_grant_ready_locations AS
WITH max_per_road AS (
    SELECT state, road_type, GREATEST(1, MAX(epdo)) AS max_epdo
    FROM mv_location_picker
    GROUP BY state, road_type
)
SELECT
    p.state,
    p.road_type,
    p.is_interstate,
    p.location_type,
    p.location_name,
    p.display_name,
    p.node_id,
    p.routes_array,
    p.jurisdiction_county,
    p.jurisdiction_mpo,
    p.jurisdiction_pd,
    p.total_crashes,
    p.k, p.a, p.epdo,
    p.ped_count, p.bike_count,
    p.lat, p.lon,
    -- VRU flag column the frontend Patterns column needs
    (p.ped_count + p.bike_count)::bigint AS vru_count,
    -- Composite "balanced" grant score: EPDO-normalised + VRU bonus, 0-100
    LEAST(100,
        ROUND(
            (p.epdo::numeric / mr.max_epdo::numeric) * 80
          + (CASE WHEN p.total_crashes > 0
                  THEN (p.ped_count + p.bike_count)::numeric / p.total_crashes::numeric
                  ELSE 0 END) * 20,
            1
        )
    )::numeric AS score_balanced,
    -- High-confidence flag aligns with the frontend "Min Crashes: 3" filter
    (p.total_crashes >= 3) AS confidence_high,
    NULL::text AS pattern_label
FROM mv_location_picker p
JOIN max_per_road mr USING (state, road_type)
WHERE p.total_crashes > 0;

CREATE UNIQUE INDEX mv_grant_ready_locations_pk
    ON mv_grant_ready_locations(state, road_type, location_type, location_name);
CREATE INDEX mv_grant_ready_locations_score_idx
    ON mv_grant_ready_locations(state, score_balanced DESC);
CREATE INDEX mv_grant_ready_locations_county_idx
    ON mv_grant_ready_locations(state, jurisdiction_county);
CREATE INDEX mv_grant_ready_locations_mpo_idx
    ON mv_grant_ready_locations(state, jurisdiction_mpo);
CREATE INDEX mv_grant_ready_locations_pd_idx
    ON mv_grant_ready_locations(state, jurisdiction_pd);
