-- 2026-06-21 — Ped/Bike High-Crash Locations: human-readable location names (kill the "Unknown" #1 row)
--
-- PROBLEM: mv_pedbike_locations derived the SEGMENT location_name as
--   COALESCE(NULLIF(rte_name,''), 'Unknown')
-- so every ped/bike crash on a segment with no route name collapsed into ONE
-- group named 'Unknown' per (state, juris, road_type, mode). That bucket
-- aggregated dozens of unrelated crashes (e.g. 78 pedestrian crashes in Kent)
-- and ranked #1 by volume/EPDO in the Ped/Bike "High-Crash Locations" table.
-- The INTERSECTION branch also lacked the rte_name fallback that
-- mv_grants_baseline / mv_location_picker use.
--
-- FIX: align name resolution with the canonical pattern and emit NULL (not the
-- literal 'Unknown') when a segment has no resolvable name, so the row is
-- filterable downstream (the frontend + getPedBikeLocations now exclude
-- location_name IS NULL):
--   intersection (node present and <> '0'):
--       COALESCE(NULLIF(intersection_name,''), NULLIF(rte_name,''), NULLIF(node,''))
--   segment (no real node):
--       COALESCE(NULLIF(rte_name,''), NULLIF(intersection_name,''))   -- NULL if neither
-- Crash sums are conserved per the underlying crashes; only the unnamed-segment
-- bucket is no longer surfaced as a fake top location. The unique index uses
-- NULLS NOT DISTINCT, so NULL-named groups still collapse to one row per group
-- and REFRESH CONCURRENTLY keeps working.
--
-- The nightly refresh proc / cron reference this matview by name and are
-- unaffected. Run REFRESH MATERIALIZED VIEW after apply (see footer).

DROP MATERIALIZED VIEW IF EXISTS public.mv_pedbike_locations;

CREATE MATERIALIZED VIEW public.mv_pedbike_locations AS
WITH base AS (
    SELECT
        c.state,
        c.physical_juris_name,
        c.dot_district,
        c.mpo_name,
        c.planning_district,
        c.pedestrian,
        c.bike,
        c.crash_severity,
        c.crash_year,
        c.night,
        c.node,
        c.rte_name,
        c.intersection_name,
        CASE
            WHEN c.node IS NOT NULL AND c.node <> ''::text AND c.node <> '0'::text THEN true
            ELSE false
        END AS is_intersection,
        CASE
            WHEN c.ownership = '1. State Hwy Agency'::text        THEN 'dot_roads'::text
            WHEN c.ownership = '2. County Hwy Agency'::text       THEN 'county_roads'::text
            WHEN c.ownership = '3. City or Town Hwy Agency'::text THEN 'city_roads'::text
            ELSE 'other_roads'::text
        END AS rt
    FROM crashes c
    WHERE c.pedestrian = 'Yes'::text OR c.bike = 'Yes'::text
)
SELECT
    base.state,
    base.physical_juris_name,
    base.dot_district,
    base.mpo_name,
    base.planning_district,
    base.rt AS road_type,
    modefilt.mode,
    loctype.location_type,
    loctype.location_name,
    count(*)::integer AS total,
    sum(CASE WHEN base.crash_severity = 'K'::text THEN 1 ELSE 0 END)::integer AS k,
    sum(CASE WHEN base.crash_severity = 'A'::text THEN 1 ELSE 0 END)::integer AS a,
    sum(CASE WHEN base.crash_severity = 'B'::text THEN 1 ELSE 0 END)::integer AS b,
    sum(CASE WHEN base.crash_severity = 'C'::text THEN 1 ELSE 0 END)::integer AS c,
    sum(CASE WHEN base.crash_severity = 'O'::text THEN 1 ELSE 0 END)::integer AS o,
    sum(CASE WHEN base.is_intersection THEN 1 ELSE 0 END)::integer AS at_intersection,
    sum(CASE WHEN base.night = 'Yes'::text THEN 1 ELSE 0 END)::integer AS night_count,
    min(base.crash_year) AS first_year,
    max(base.crash_year) AS last_year
FROM base,
    LATERAL (VALUES
        ('pedestrian'::text, base.pedestrian),
        ('bicycle'::text,    base.bike)
    ) modefilt(mode, flag),
    LATERAL (VALUES
        ('intersection'::text, COALESCE(NULLIF(base.intersection_name, ''::text), NULLIF(base.rte_name, ''::text), NULLIF(base.node, ''::text))),
        ('segment'::text,      COALESCE(NULLIF(base.rte_name, ''::text), NULLIF(base.intersection_name, ''::text)))
    ) loctype(location_type, location_name)
WHERE modefilt.flag = 'Yes'::text
  AND (
        (loctype.location_type = 'intersection'::text AND base.is_intersection)
     OR (loctype.location_type = 'segment'::text AND NOT base.is_intersection)
  )
GROUP BY base.state, base.physical_juris_name, base.dot_district, base.mpo_name, base.planning_district,
    base.rt, modefilt.mode, loctype.location_type, loctype.location_name
HAVING count(*) >= 1;

-- Recreate indexes exactly as before (unique index uses NULLS NOT DISTINCT so
-- NULL location_name groups collapse to one row and REFRESH CONCURRENTLY works).
CREATE UNIQUE INDEX mv_pedbike_locations_uniq ON public.mv_pedbike_locations
    USING btree (state, physical_juris_name, dot_district, mpo_name, planning_district, road_type, mode, location_type, location_name) NULLS NOT DISTINCT;
CREATE INDEX mv_pedbike_locations_lookup ON public.mv_pedbike_locations
    USING btree (state, physical_juris_name, mode);
CREATE INDEX mv_pedbike_locations_pd ON public.mv_pedbike_locations
    USING btree (state, planning_district, mode);
GRANT SELECT ON public.mv_pedbike_locations TO anon, authenticated;
ANALYZE public.mv_pedbike_locations;

-- After apply (matview is freshly built by CREATE above; this is the routine
-- way to re-populate on subsequent runs):
--   REFRESH MATERIALIZED VIEW public.mv_pedbike_locations;
-- Validation:
--   SELECT count(*) FILTER (WHERE location_name IS NULL) AS null_names,
--          count(*) FILTER (WHERE location_name = 'Unknown') AS literal_unknown
--   FROM public.mv_pedbike_locations;   -- expect literal_unknown = 0
