-- =============================================================================
-- §7.7 — `map_viewport_crashes` RPC: add p_road_type / p_road_types /
--       p_no_interstate parameters; preserve existing PostGIS clustering
--       body verbatim.
-- =============================================================================
-- ⚠️ THIS IS A TEMPLATE.
-- The current function body (the PostGIS clustering / aggregation logic)
-- is not in git. Per the prompt §7.7, capture it first and only modify
-- the WHERE fragments — do NOT rewrite the body from scratch.
--
-- Step-by-step:
--
-- 1. Capture the existing body via execute_sql:
--      SELECT pg_get_functiondef(
--        'public.map_viewport_crashes(text,geometry,integer,text,text,integer,text[],integer)'::regprocedure
--      );
--    Save the result verbatim to docs/rollback/map_viewport_crashes.pre.sql
--    (placeholder file already committed in this PR). Commit alongside this
--    migration so future rollbacks have the prior body.
--
-- 2. Open the captured body. Find every `FROM crashes` (or `JOIN crashes`)
--    inside CTEs / subqueries / the final SELECT. For each, add the three
--    WHERE fragments below to the existing AND-chain (do NOT replace the
--    existing tier / state / bbox / year / severity filters).
--
-- 3. Change the function signature to the new one shown below.
--
-- 4. Re-`apply_migration` the spliced result.
--
-- 5. Replace this TEMPLATE file in git with the spliced version (so the
--    next person can review it without repeating step 1).
-- =============================================================================

-- ⬇⬇⬇ NEW FUNCTION SIGNATURE — paste body underneath ⬇⬇⬇

CREATE OR REPLACE FUNCTION public.map_viewport_crashes(
    p_state           text,
    p_bbox            geometry,
    p_zoom            integer DEFAULT 12,
    p_tier_col        text    DEFAULT NULL,
    p_tier_val        text    DEFAULT NULL,
    p_year            integer DEFAULT NULL,
    p_severity        text[]  DEFAULT NULL,
    p_road_type       text    DEFAULT NULL,    -- NEW
    p_road_types      text[]  DEFAULT NULL,    -- NEW
    p_no_interstate   boolean DEFAULT FALSE,   -- NEW
    p_limit           integer DEFAULT 10000
)
RETURNS TABLE (
    -- ⚠ Keep the EXACT same RETURNS TABLE column list as the existing
    -- function. Do NOT change return columns — the front-end depends on
    -- the existing shape (cx, cy, n, fatals, serious, epdo, is_cluster,
    -- and whatever point-level fields exist today).
    --
    -- Paste the captured RETURNS TABLE column list here.
    placeholder_remove_me boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- ⬇⬇⬇ PASTE EXISTING BODY HERE ⬇⬇⬇
    --
    -- For every `FROM crashes` reference inside the body, add this AND
    -- block to its WHERE clause. The existing filters
    -- (state/bbox/tier/year/severity) stay exactly as they are.
    --
    --   ⬇ NEW WHERE FRAGMENT — splice into every CTE that reads `crashes` ⬇
    --
    --   AND (
    --       p_road_type IS NULL
    --       OR (CASE
    --             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
    --             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
    --             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
    --             ELSE 'other_roads'
    --           END) = p_road_type
    --   )
    --   AND (
    --       p_road_types IS NULL
    --       OR (CASE
    --             WHEN ownership = '1. State Hwy Agency'        THEN 'dot_roads'
    --             WHEN ownership = '2. County Hwy Agency'       THEN 'county_roads'
    --             WHEN ownership = '3. City or Town Hwy Agency' THEN 'city_roads'
    --             ELSE 'other_roads'
    --           END) = ANY (p_road_types)
    --   )
    --   AND (
    --       NOT p_no_interstate
    --       OR (functional_class NOT LIKE '1-Interstate%' AND system <> 'DOT Interstate')
    --   )
    --
    --   ⬆ NEW WHERE FRAGMENT — keep the rest of the existing WHERE intact ⬆
    --
    RAISE EXCEPTION 'TEMPLATE not yet spliced — see header comment in 2026-05-01_07_map_viewport_crashes_TEMPLATE.sql';
END;
$$;

GRANT EXECUTE ON FUNCTION public.map_viewport_crashes(
    text, geometry, integer, text, text, integer, text[], text, text[], boolean, integer
) TO anon;

-- ===== Verification =========================================================
-- After splicing & re-applying, the new RPC should return non-empty results
-- when called with p_road_type:
--
--   SELECT count(*) FROM public.map_viewport_crashes(
--     p_state        := 'delaware',
--     p_bbox         := ST_GeomFromText('POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))', 4326),
--     p_zoom         := 10,
--     p_road_type    := 'city_roads'
--   );
-- Expected: > 0.
--
--   SELECT count(*) FROM public.map_viewport_crashes(
--     p_state         := 'delaware',
--     p_bbox          := ST_GeomFromText('POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))', 4326),
--     p_zoom          := 10,
--     p_no_interstate := TRUE
--   );
-- Expected: < count(*) without p_no_interstate (interstates excluded).
--
-- And via PostgREST RPC (front-end's path):
--
--   curl -s -X POST "$URL/rpc/map_viewport_crashes" \
--     -H "apikey: $KEY" -H "Authorization: Bearer $KEY" \
--     -H "Content-Type: application/json" \
--     -d '{"p_state":"delaware",
--          "p_bbox":"SRID=4326;POLYGON((-76 38,-75 38,-75 40,-76 40,-76 38))",
--          "p_zoom":10,
--          "p_road_type":"city_roads"}' | jq length
--   # Expected: > 0
