-- 2026-06-16 — Grant-Ready Locations: human-readable location names (kill the "0" rows)
--
-- PROBLEM: mv_grants_baseline derived location_name from the bare crash node
-- (COALESCE(NULLIF(node,''), rte_name)). Delaware crashes with node='0' (a
-- missing-node sentinel, ~49k rows) all collapsed into ONE fake "intersection"
-- named "0" — which then ranked #1 in Grant-Ready Locations (e.g. 7,025 crashes
-- at "0"). The matview also carried no human name, so mv_grant_ready_locations
-- could only show "0" / numeric node ids.
--
-- FIX: use the same canonical name logic the (working) mv_pedbike_locations /
-- mv_location_picker use —
--   intersection (node present and <> '0'):
--       COALESCE(NULLIF(intersection_name,''), NULLIF(rte_name,''), node)
--   segment (no real node):
--       COALESCE(NULLIF(rte_name,''), 'Unknown')
-- node='0' is no longer treated as an intersection, so those crashes attribute
-- to their route (or 'Unknown'), not a bogus "0" intersection. Grant grouping is
-- by named location; crash sums (and therefore scores) are conserved per the
-- underlying crashes. mv_grant_ready_locations additionally drops the unnamed
-- ('' / 'Unknown') bucket — you can't write a grant for an unknown location.
--
-- Cascading rebuild: mv_grant_ready_locations depends on mv_grants_baseline, so
-- both are dropped and recreated with their existing indexes/grants. The nightly
-- cron jobs (refresh-mv-grants-baseline, refresh-mv-grant-ready-locations) and
-- the master refresh proc reference them by name and are unaffected.

DROP MATERIALIZED VIEW IF EXISTS public.mv_grant_ready_locations;
DROP MATERIALIZED VIEW IF EXISTS public.mv_grants_baseline;

-- ── mv_grants_baseline (canonical human location_name) ──────────────────────
CREATE MATERIALIZED VIEW public.mv_grants_baseline AS
SELECT
    crashes.state,
    crashes.physical_juris_name AS county,
    crashes.dot_district        AS region,
    crashes.mpo_name            AS mpo,
    crashes.planning_district,
    CASE
        WHEN crashes.ownership = '1. State Hwy Agency'::text        THEN 'dot_roads'::text
        WHEN crashes.ownership = '2. County Hwy Agency'::text       THEN 'county_roads'::text
        WHEN crashes.ownership = '3. City or Town Hwy Agency'::text THEN 'city_roads'::text
        ELSE 'other_roads'::text
    END AS road_type,
    COALESCE(crashes.functional_class ~~ '1-Interstate%'::text OR crashes.system = 'DOT Interstate'::text, false) AS is_interstate,
    CASE
        WHEN crashes.node IS NOT NULL AND crashes.node <> ''::text AND crashes.node <> '0'::text THEN 'intersection'::text
        ELSE 'segment'::text
    END AS location_type,
    CASE
        WHEN crashes.node IS NOT NULL AND crashes.node <> ''::text AND crashes.node <> '0'::text
            THEN COALESCE(NULLIF(crashes.intersection_name, ''::text), NULLIF(crashes.rte_name, ''::text), crashes.node)
        ELSE COALESCE(NULLIF(crashes.rte_name, ''::text), 'Unknown'::text)
    END AS location_name,
    crashes.rte_name,
    crashes.crash_year,
    count(*) AS total_crashes,
    sum(CASE WHEN crashes.crash_severity = 'K'::text THEN 1 ELSE 0 END) AS k,
    sum(CASE WHEN crashes.crash_severity = 'A'::text THEN 1 ELSE 0 END) AS a,
    sum(CASE WHEN crashes.crash_severity = 'B'::text THEN 1 ELSE 0 END) AS b,
    sum(CASE WHEN crashes.crash_severity = 'C'::text THEN 1 ELSE 0 END) AS c,
    sum(CASE WHEN crashes.crash_severity = 'O'::text THEN 1 ELSE 0 END) AS o,
    sum(CASE crashes.crash_severity WHEN 'K'::text THEN 883 WHEN 'A'::text THEN 94 WHEN 'B'::text THEN 21 WHEN 'C'::text THEN 11 WHEN 'O'::text THEN 1 ELSE 0 END) AS epdo,
    sum(CASE WHEN crashes.pedestrian = 'Yes'::text THEN 1 ELSE 0 END) AS ped,
    sum(CASE WHEN crashes.bike = 'Yes'::text THEN 1 ELSE 0 END) AS bike,
    avg(crashes.x) AS lon_centroid,
    avg(crashes.y) AS lat_centroid
FROM crashes
WHERE COALESCE(NULLIF(crashes.node, ''::text), crashes.rte_name) IS NOT NULL
GROUP BY crashes.state, crashes.physical_juris_name, crashes.dot_district, crashes.mpo_name, crashes.planning_district,
    (CASE
        WHEN crashes.ownership = '1. State Hwy Agency'::text        THEN 'dot_roads'::text
        WHEN crashes.ownership = '2. County Hwy Agency'::text       THEN 'county_roads'::text
        WHEN crashes.ownership = '3. City or Town Hwy Agency'::text THEN 'city_roads'::text
        ELSE 'other_roads'::text
    END),
    (COALESCE(crashes.functional_class ~~ '1-Interstate%'::text OR crashes.system = 'DOT Interstate'::text, false)),
    (CASE
        WHEN crashes.node IS NOT NULL AND crashes.node <> ''::text AND crashes.node <> '0'::text THEN 'intersection'::text
        ELSE 'segment'::text
    END),
    (CASE
        WHEN crashes.node IS NOT NULL AND crashes.node <> ''::text AND crashes.node <> '0'::text
            THEN COALESCE(NULLIF(crashes.intersection_name, ''::text), NULLIF(crashes.rte_name, ''::text), crashes.node)
        ELSE COALESCE(NULLIF(crashes.rte_name, ''::text), 'Unknown'::text)
    END),
    crashes.rte_name, crashes.crash_year
HAVING count(*) >= 3 OR sum(CASE WHEN crashes.crash_severity = ANY (ARRAY['K'::text,'A'::text]) THEN 1 ELSE 0 END) >= 1;

CREATE UNIQUE INDEX mv_grants_baseline_concurrent_uq ON public.mv_grants_baseline
    USING btree (state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, rte_name, crash_year) NULLS NOT DISTINCT;
CREATE INDEX mv_grants_baseline_county_idx ON public.mv_grants_baseline
    USING btree (state, county, road_type, is_interstate, epdo DESC) INCLUDE (total_crashes, k, a);
CREATE INDEX mv_grants_baseline_year_idx ON public.mv_grants_baseline USING btree (state, crash_year);
GRANT SELECT ON public.mv_grants_baseline TO anon, authenticated;
ANALYZE public.mv_grants_baseline;

-- ── mv_grant_ready_locations (unchanged scoring; drop the unnamed bucket) ────
CREATE MATERIALIZED VIEW public.mv_grant_ready_locations AS
WITH agg AS (
    SELECT state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, rte_name,
        sum(total_crashes) AS total_crashes,
        sum(k) AS k, sum(a) AS a, sum(b) AS b, sum(c) AS c, sum(o) AS o, sum(epdo) AS epdo,
        sum(ped) AS ped, sum(bike) AS bike,
        min(crash_year) AS first_year, max(crash_year) AS last_year,
        avg(lat_centroid) AS lat_centroid, avg(lon_centroid) AS lon_centroid
    FROM mv_grants_baseline
    GROUP BY state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, rte_name
)
SELECT state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, rte_name,
    total_crashes, k, a, b, c, o, epdo, ped, bike, first_year, last_year, lat_centroid, lon_centroid,
    k AS sum_k, a AS sum_a, b AS sum_b, c AS sum_c, ped AS sum_ped, bike AS sum_bike,
    (k * 883::numeric + a * 94::numeric + b * 21::numeric + c * 11::numeric)::bigint AS score_hsip,
    (k * 100::numeric + a * 30::numeric + ped * 25::numeric + bike * 25::numeric)::bigint AS score_ss4a,
    (k * 50::numeric + a * 15::numeric)::bigint AS score_402,
    (k * 500::numeric + a * 50::numeric + ped * 15::numeric + bike * 15::numeric + b * 10::numeric + c * 5::numeric)::bigint AS score_balanced
FROM agg
WHERE total_crashes > 0::numeric
  AND COALESCE(location_name, ''::text) NOT IN (''::text, 'Unknown'::text);

CREATE INDEX idx_mv_grant_ready_locations_county ON public.mv_grant_ready_locations USING btree (state, county);
CREATE INDEX idx_mv_grant_ready_locations_pd ON public.mv_grant_ready_locations USING btree (state, planning_district);
CREATE INDEX idx_mv_grant_ready_locations_state_balanced ON public.mv_grant_ready_locations USING btree (state, score_balanced DESC NULLS LAST);
CREATE INDEX idx_mv_grant_ready_locations_state_hsip ON public.mv_grant_ready_locations USING btree (state, score_hsip DESC NULLS LAST);
CREATE INDEX idx_mv_grant_ready_locations_state_ss4a ON public.mv_grant_ready_locations USING btree (state, score_ss4a DESC NULLS LAST);
-- Unique index for REFRESH CONCURRENTLY (grant-ready had none before; add one).
CREATE UNIQUE INDEX mv_grant_ready_locations_uq ON public.mv_grant_ready_locations
    USING btree (state, county, region, mpo, planning_district, road_type, is_interstate, location_type, location_name, rte_name) NULLS NOT DISTINCT;
GRANT SELECT ON public.mv_grant_ready_locations TO anon, authenticated;
ANALYZE public.mv_grant_ready_locations;
