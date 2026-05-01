-- =============================================================================
-- §7.4 — Recreate `mv_crash_tree` with road_type + is_interstate on every
--       UNION arm.
-- =============================================================================
-- The existing matview used `crashes.road_type` directly as the level3 of
-- the facility/crashType trees. It now uses the ownership-derived bucket
-- (4 buckets) so all 6 matviews bucket the same way. The contributing tree
-- keeps location_type as level3 (intersection vs segment).
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_crash_tree CASCADE;

CREATE MATERIALIZED VIEW public.mv_crash_tree AS

-- ─── facility tree: severity → relation_to_roadway → road_type ─────────────
SELECT
    'facility'::text                                AS tree_type,
    state,
    physical_juris_name                             AS county,
    dot_district                                    AS region,
    mpo_name                                        AS mpo,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END                                             AS road_type,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate')
                                                    AS is_interstate,
    crash_severity                                  AS level1,
    relation_to_roadway                             AS level2,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END                                             AS level3,
    count(*)                                              AS total,
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END) AS k,
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END) AS a,
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END) AS b,
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END) AS c,
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END) AS o
FROM crashes
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11

UNION ALL

-- ─── crashType tree: collision_type → severity → road_type ─────────────────
SELECT
    'crashType'::text,
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    collision_type,
    crash_severity,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    count(*),
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11

UNION ALL

-- ─── contributing tree: contributing_factor → severity → location_type ────
SELECT
    'contributing'::text,
    state,
    physical_juris_name,
    dot_district,
    mpo_name,
    planning_district,
    CASE
        WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
        WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
        WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
        ELSE 'other_roads'
    END,
    (functional_class LIKE '1-Interstate%' OR system = 'DOT Interstate'),
    contributing_factor,
    crash_severity,
    CASE WHEN node IS NOT NULL AND node <> '' THEN 'intersection'
         ELSE 'segment'
    END,
    count(*),
    sum(CASE WHEN crash_severity = 'K' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'A' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'B' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'C' THEN 1 ELSE 0 END),
    sum(CASE WHEN crash_severity = 'O' THEN 1 ELSE 0 END)
FROM crashes
WHERE contributing_factor IS NOT NULL
  AND contributing_factor <> ''
GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11;

ALTER MATERIALIZED VIEW public.mv_crash_tree OWNER TO postgres;
GRANT SELECT ON public.mv_crash_tree TO anon;

-- Unique index covers tree_type + every grouping key.
CREATE UNIQUE INDEX mv_crash_tree_uq_idx
    ON public.mv_crash_tree
    (tree_type, state, county, region, mpo, planning_district,
     road_type, is_interstate, level1, level2, level3);

CREATE INDEX mv_crash_tree_lookup_idx
    ON public.mv_crash_tree (state, tree_type, county, road_type, is_interstate);

CREATE INDEX mv_crash_tree_state_idx
    ON public.mv_crash_tree (state, tree_type, road_type, is_interstate);

REFRESH MATERIALIZED VIEW public.mv_crash_tree;

-- ===== Verification =========================================================
-- SELECT tree_type, road_type, count(*) FROM mv_crash_tree
--  GROUP BY tree_type, road_type ORDER BY 1, 2;
-- Expected: 12 rows total (3 tree types × 4 buckets), every count > 0.
