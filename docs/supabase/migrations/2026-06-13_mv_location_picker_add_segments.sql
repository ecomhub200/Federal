-- 2026-06-13 — Restore "Road Segments" in the shared Location Picker
--
-- PROBLEM: mv_location_picker was rebuilt from mv_hotspots only. mv_hotspots
-- classifies a crash as 'intersection' whenever it has a node, and every
-- Delaware crash has a node → 0 segment rows → the picker's "Road Segments"
-- option is empty (Warrants / CMF / MUTCD AI / Reports all share the picker).
--
-- FIX: rebuild mv_location_picker as UNION ALL of
--   (A) intersections — unchanged, from mv_hotspots
--   (B) road segments — NEW, aggregated from the crashes table grouped by route
--       (rte_name), reusing mv_hotspots' exact jurisdiction / road_type /
--       is_interstate / EPDO / centroid derivations so segment rows are
--       consistent with intersection rows. location_name = location_id = rte_name
--       so the frontend's 'route:'+location_name value and
--       getCrashesByLocation('route', rte_name) → crashes.rte_name all line up.
-- Frontend already supports segments (Location Type radio); no FE/RPC change.

DROP MATERIALIZED VIEW IF EXISTS public.mv_location_picker;

CREATE MATERIALIZED VIEW public.mv_location_picker AS
-- (A) Intersections — from mv_hotspots (semantics unchanged)
SELECT
    state, county, region, mpo, planning_district, road_type, is_interstate,
    'intersection'::text AS location_type,
    COALESCE(NULLIF(intersection_name, ''::text), NULLIF(rte_name, ''::text), location_name) AS location_name,
    location_name AS location_id,
    sum(total_crashes)::integer AS total_crashes,
    sum(k)::integer  AS k,
    sum(a)::integer  AS a,
    sum(b)::integer  AS b,
    sum(c)::integer  AS c,
    sum(o)::integer  AS o,
    sum(epdo)::integer AS epdo,
    sum(ped_count)::integer  AS ped_count,
    sum(bike_count)::integer AS bike_count,
    avg(lon_centroid) AS lon,
    avg(lat_centroid) AS lat,
    min(first_year) AS first_year,
    max(last_year)  AS last_year
FROM mv_hotspots
WHERE location_type = 'intersection'
  AND COALESCE(intersection_name, ''::text) <> ''::text
  AND location_name IS NOT NULL AND location_name <> ''::text AND location_name <> '0'::text
GROUP BY state, county, region, mpo, planning_district, road_type, is_interstate,
    COALESCE(NULLIF(intersection_name, ''::text), NULLIF(rte_name, ''::text), location_name),
    location_name

UNION ALL

-- (B) Road segments — aggregate crashes grouped by route (rte_name)
SELECT
    state,
    physical_juris_name AS county,
    dot_district        AS region,
    mpo_name            AS mpo,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'::text        THEN 'dot_roads'::text
        WHEN ownership = '2. County Hwy Agency'::text       THEN 'county_roads'::text
        WHEN ownership = '3. City or Town Hwy Agency'::text THEN 'city_roads'::text
        ELSE 'other_roads'::text
    END AS road_type,
    COALESCE(functional_class ~~ '1-Interstate%'::text OR system = 'DOT Interstate'::text, false) AS is_interstate,
    'segment'::text AS location_type,
    rte_name AS location_name,
    rte_name AS location_id,
    count(*)::integer AS total_crashes,
    sum(CASE WHEN crash_severity = 'K'::text THEN 1 ELSE 0 END)::integer AS k,
    sum(CASE WHEN crash_severity = 'A'::text THEN 1 ELSE 0 END)::integer AS a,
    sum(CASE WHEN crash_severity = 'B'::text THEN 1 ELSE 0 END)::integer AS b,
    sum(CASE WHEN crash_severity = 'C'::text THEN 1 ELSE 0 END)::integer AS c,
    sum(CASE WHEN crash_severity = 'O'::text THEN 1 ELSE 0 END)::integer AS o,
    sum(CASE crash_severity
            WHEN 'K'::text THEN 883 WHEN 'A'::text THEN 94 WHEN 'B'::text THEN 21
            WHEN 'C'::text THEN 11  WHEN 'O'::text THEN 1  ELSE 0 END)::integer AS epdo,
    sum(CASE WHEN pedestrian = 'Yes'::text THEN 1 ELSE 0 END)::integer AS ped_count,
    sum(CASE WHEN bike = 'Yes'::text THEN 1 ELSE 0 END)::integer AS bike_count,
    avg(x) AS lon,
    avg(y) AS lat,
    min(crash_year) AS first_year,
    max(crash_year) AS last_year
FROM crashes
WHERE rte_name IS NOT NULL AND rte_name <> ''::text AND rte_name <> '0'::text
GROUP BY state, physical_juris_name, dot_district, mpo_name, planning_district,
    (CASE
        WHEN ownership = '1. State Hwy Agency'::text        THEN 'dot_roads'::text
        WHEN ownership = '2. County Hwy Agency'::text       THEN 'county_roads'::text
        WHEN ownership = '3. City or Town Hwy Agency'::text THEN 'city_roads'::text
        ELSE 'other_roads'::text
    END),
    (COALESCE(functional_class ~~ '1-Interstate%'::text OR system = 'DOT Interstate'::text, false)),
    rte_name;

-- Indexes (recreated exactly as before — unique index is required for the
-- existing REFRESH MATERIALIZED VIEW CONCURRENTLY cron).
CREATE UNIQUE INDEX mv_location_picker_uniq ON public.mv_location_picker
    USING btree (state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, location_id) NULLS NOT DISTINCT;
CREATE INDEX mv_location_picker_state_county ON public.mv_location_picker USING btree (state, county, location_type);
CREATE INDEX mv_location_picker_state_mpo    ON public.mv_location_picker USING btree (state, mpo, location_type);
CREATE INDEX mv_location_picker_state_pd     ON public.mv_location_picker USING btree (state, planning_district, location_type);
CREATE INDEX mv_location_picker_top_epdo     ON public.mv_location_picker USING btree (state, epdo DESC);

GRANT SELECT ON public.mv_location_picker TO anon, authenticated;
ANALYZE public.mv_location_picker;
