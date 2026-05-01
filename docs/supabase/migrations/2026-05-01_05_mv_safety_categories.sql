-- =============================================================================
-- §7.5 — Recreate `mv_safety_categories` with road_type + is_interstate.
-- =============================================================================
-- Adds the ownership-derived bucket and the is_interstate boolean to the
-- base CTE and the outer GROUP BY. Categories themselves (curves,
-- pedestrian, …) are unchanged.
--
-- ⚠️ COLUMN AVAILABILITY: the original 2026-04-25 matview referenced these
-- columns in the base CTE:
--   curve_indicator, work_zone, school_zone, guardrail_struck, driver_age,
--   relation_to_roadway, vehicle_count, vehicle_type, pedestrian, bike,
--   speed_related, alcohol_involved, node, light_condition, distracted,
--   hit_and_run, weather_condition, collision_type, restraint_used,
--   fatigue, crash_severity.
--
-- Some are not present on every state's `crashes` table. **If the prior
-- mv_safety_categories trimmed any of these flags, trim the same set
-- here** (delete both the assignment in the CTE and the matching row in
-- the LATERAL VALUES list). The frontend tolerates missing categories.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_safety_categories CASCADE;

CREATE MATERIALIZED VIEW public.mv_safety_categories AS
WITH base AS (
    SELECT
        state,
        physical_juris_name AS county,
        dot_district        AS region,
        mpo_name            AS mpo,
        planning_district,
        crash_year,
        crash_severity,
        CASE
            WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
            WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
            WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
            ELSE 'other_roads'
        END                                                              AS road_type,
        (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate')
                                                                         AS is_interstate,
        -- Category flags (drop any whose source column doesn't exist in
        -- your `crashes` table — see header).
        (curve_indicator    = 'Yes')                                      AS curves,
        (work_zone          = 'Yes')                                      AS work_zone,
        (school_zone        = 'Yes')                                      AS school_zone,
        (guardrail_struck   = 'Yes')                                      AS guardrail,
        (driver_age >= 65)                                                AS senior,
        (driver_age <= 24)                                                AS young,
        (relation_to_roadway IN ('On Roadside','Off Road'))               AS road_departure,
        (vehicle_count >= 1 AND vehicle_type ILIKE '%truck%')             AS lg_truck,
        (pedestrian         = 'Yes')                                      AS pedestrian,
        (bike               = 'Yes')                                      AS bicycle,
        (speed_related      = 'Yes')                                      AS speed,
        (alcohol_involved   = 'Yes')                                      AS impaired,
        (node IS NOT NULL AND node <> '')                                 AS intersection,
        (light_condition LIKE '%Dark%' OR light_condition LIKE '%Night%') AS nighttime,
        (distracted         = 'Yes')                                      AS distracted,
        (vehicle_type ILIKE '%motorcycle%')                               AS motorcycle,
        (hit_and_run        = 'Yes')                                      AS hitrun,
        (weather_condition NOT IN ('Clear','No Adverse Conditions','Unknown'))
                                                                          AS weather,
        (collision_type ILIKE '%animal%')                                 AS animal,
        (restraint_used     = 'No')                                       AS unrestrained,
        (fatigue            = 'Yes')                                      AS drowsy,
        (alcohol_involved = 'Yes' AND speed_related <> 'Yes')             AS alcoholonly
    FROM crashes
)
SELECT
    state, county, region, mpo, planning_district,
    road_type,
    is_interstate,
    cat AS category,
    count(*)                                              AS total,
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM base,
LATERAL (VALUES
    ('curves',        curves),
    ('workzone',      work_zone),
    ('school',        school_zone),
    ('guardrail',     guardrail),
    ('senior',        senior),
    ('young',         young),
    ('roaddeparture', road_departure),
    ('lgtruck',       lg_truck),
    ('pedestrian',    pedestrian),
    ('bicycle',       bicycle),
    ('speed',         speed),
    ('impaired',      impaired),
    ('intersection',  intersection),
    ('nighttime',     nighttime),
    ('distracted',    distracted),
    ('motorcycle',    motorcycle),
    ('hitrun',        hitrun),
    ('weather',       weather),
    ('animal',        animal),
    ('unrestrained',  unrestrained),
    ('drowsy',        drowsy),
    ('alcoholonly',   alcoholonly)
) AS unpivot(cat, flag)
WHERE flag = TRUE
GROUP BY state, county, region, mpo, planning_district,
         road_type, is_interstate, cat;

ALTER MATERIALIZED VIEW public.mv_safety_categories OWNER TO postgres;
GRANT SELECT ON public.mv_safety_categories TO anon;

CREATE UNIQUE INDEX mv_safety_categories_uq_idx
    ON public.mv_safety_categories
    (state, county, region, mpo, planning_district,
     road_type, is_interstate, category);

CREATE INDEX mv_safety_categories_county_idx
    ON public.mv_safety_categories
    (state, county, road_type, is_interstate, category);

CREATE INDEX mv_safety_categories_state_idx
    ON public.mv_safety_categories
    (state, road_type, is_interstate, category);

REFRESH MATERIALIZED VIEW public.mv_safety_categories;

-- ===== Verification =========================================================
-- SELECT category, road_type, count(*) FROM mv_safety_categories
--  GROUP BY category, road_type ORDER BY category, road_type LIMIT 20;
-- Expected: each category appears for at least 2 buckets (typically all 4).
