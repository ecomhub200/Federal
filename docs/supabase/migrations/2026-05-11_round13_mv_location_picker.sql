-- ============================================================================
-- Round 13 — Universal LocationPicker
-- Source matview that backs every "Or Select Location" dropdown across the app.
--
-- State-agnostic: keys on data shape (state, road_type, location_type), not on
-- jurisdiction literals. One row per (state, road_type, location_type, location_name).
--
-- Sources:
--   * Intersections from mv_hotspots (already has intersection_name + rte_name)
--   * Segments from mv_safety_focus_locations (aggregated across categories)
--
-- Verified-against-real-data 2026-05-11 (DE, 569,832 crashes):
--   intersections ≈ 46,621 (after dropping location_name='0')
--   segments      ≈ 1,560
-- ============================================================================

DROP MATERIALIZED VIEW IF EXISTS mv_location_picker CASCADE;

CREATE MATERIALIZED VIEW mv_location_picker AS
WITH intersections AS (
    SELECT
        h.state,
        h.county            AS jurisdiction_county,
        h.mpo               AS jurisdiction_mpo,
        h.planning_district AS jurisdiction_pd,
        NULL::text          AS jurisdiction_dot_district,   -- mv_hotspots lacks dot_district
        h.road_type,
        h.is_interstate,
        h.location_type,                                     -- 'intersection'
        h.location_name,                                     -- node id as text
        -- HUMAN-READABLE DISPLAY NAME (kills the "location name is a number" bug)
        COALESCE(NULLIF(h.intersection_name, ''),
                 NULLIF(h.rte_name, ''),
                 'Intersection #' || h.location_name)        AS display_name,
        h.location_name                                      AS node_id,
        NULL::jsonb                                          AS routes_array,
        h.total_crashes, h.k, h.a, h.b, h.c, h.o, h.epdo,
        h.ped_count, h.bike_count,
        h.lat_centroid AS lat,
        h.lon_centroid AS lon
    FROM mv_hotspots h
    WHERE h.location_type = 'intersection'
      AND h.location_name <> '0'
      AND h.total_crashes > 0
),
segments AS (
    SELECT
        sfl.state,
        sfl.physical_juris_name AS jurisdiction_county,
        sfl.mpo_name            AS jurisdiction_mpo,
        sfl.planning_district   AS jurisdiction_pd,
        sfl.dot_district        AS jurisdiction_dot_district,
        sfl.road_type,
        false                   AS is_interstate,
        'segment'::text         AS location_type,
        sfl.location_name,
        sfl.location_name       AS display_name,
        NULL::text              AS node_id,
        NULL::jsonb             AS routes_array,
        SUM(sfl.total)::bigint  AS total_crashes,
        SUM(sfl.k)::bigint      AS k,
        SUM(sfl.a)::bigint      AS a,
        SUM(sfl.b)::bigint      AS b,
        SUM(sfl.c)::bigint      AS c,
        SUM(sfl.o)::bigint      AS o,
        -- mv_safety_focus_locations lacks an epdo column → compute from K/A
        -- (caller's frontend already uses this profile: K=883, A=94)
        (SUM(sfl.k) * 883 + SUM(sfl.a) * 94)::bigint AS epdo,
        SUM(CASE WHEN sfl.category='pedestrian' THEN sfl.total ELSE 0 END)::bigint AS ped_count,
        SUM(CASE WHEN sfl.category='bicycle'    THEN sfl.total ELSE 0 END)::bigint AS bike_count,
        NULL::double precision  AS lat,
        NULL::double precision  AS lon
    FROM mv_safety_focus_locations sfl
    WHERE sfl.location_type = 'segment'
      AND sfl.total > 0
    GROUP BY 1,2,3,4,5,6,7,8,9,10,11,12
)
SELECT * FROM intersections
UNION ALL
SELECT * FROM segments;

CREATE UNIQUE INDEX mv_location_picker_pk
    ON mv_location_picker(state, road_type, location_type, location_name);
CREATE INDEX mv_location_picker_county_idx
    ON mv_location_picker(state, jurisdiction_county) WHERE jurisdiction_county IS NOT NULL;
CREATE INDEX mv_location_picker_mpo_idx
    ON mv_location_picker(state, jurisdiction_mpo) WHERE jurisdiction_mpo IS NOT NULL;
CREATE INDEX mv_location_picker_pd_idx
    ON mv_location_picker(state, jurisdiction_pd) WHERE jurisdiction_pd IS NOT NULL;
CREATE INDEX mv_location_picker_total_idx
    ON mv_location_picker(state, total_crashes DESC);
CREATE INDEX mv_location_picker_interstate_idx
    ON mv_location_picker(state, is_interstate);
