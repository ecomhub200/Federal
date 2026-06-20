-- =============================================================================
-- 2026-06-19 — Map tab "instant" performance: pre-clustered overview + index fix
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
--
-- WHY: map_viewport_crashes runs ST_SnapToGrid clustering over the bbox-matched
-- rows LIVE on every pan/zoom. At low zoom the whole-state bbox matches all
-- ~570k rows, so each call seq-scans + clusters everything (~2.5 s, measured
-- 2.3-2.9 s, constant regardless of viewport — see docs/qa/map-tab-findings.md).
--
-- FIX (two parts):
--   A. Make sure the GiST geom index exists AND is SRID-4326 so the live
--      point query (street zoom) is index-pruned (currently constant-time =
--      not pruning → likely SRID mismatch or missing index).
--   B. Pre-materialise the low-zoom clusters (mv_map_clusters) so the overview
--      is a cheap indexed read instead of a live 570k-row clustering.
--
-- ⚠️ VALIDATE BEFORE APPLY:
--   1) Confirm mv_map_crashes.geom SRID:  SELECT DISTINCT ST_SRID(geom) FROM mv_map_crashes LIMIT 5;
--      If 0 / not 4326, the matview's geom must be rebuilt with ST_SetSRID(...,4326).
--   2) EXPLAIN ANALYZE the street-zoom query (see findings doc) before/after.
-- =============================================================================

-- ── A. geom GiST index (idempotent) ──────────────────────────────────────────
-- If ST_SRID(geom) <> 4326 this index won't be used by the RPC's
-- `geom && ST_GeomFromText('SRID=4326;...')`. Recreate the matview's geom as
-- 4326 first if so (out of scope here — flagged above).
CREATE INDEX IF NOT EXISTS mv_map_crashes_geom_idx
    ON public.mv_map_crashes USING gist (geom);
-- A composite (state, geom) helps the common single-state path.
CREATE INDEX IF NOT EXISTS mv_map_crashes_state_geom_idx
    ON public.mv_map_crashes USING gist (state, geom);

-- ── B. Pre-clustered overview matview ────────────────────────────────────────
-- One row per (state, zoom-bucket, grid cell). Grid sizes mirror the RPC's
-- grid_size ladder (zoom 8→0.05, 10→0.02, 11→0.01, 12→0.005). Street zoom
-- (>=14, grid_size 0) keeps the existing live point query (small bbox → fast).
DROP MATERIALIZED VIEW IF EXISTS public.mv_map_clusters;
CREATE MATERIALIZED VIEW public.mv_map_clusters AS
WITH zoom_grid (z, g) AS (
    VALUES (8, 0.05::numeric), (10, 0.02), (11, 0.01), (12, 0.005)
)
SELECT
    m.state,
    zg.z                                                      AS zoom_bucket,
    round((floor(m.x / zg.g) * zg.g + zg.g / 2)::numeric, 6)  AS cx,
    round((floor(m.y / zg.g) * zg.g + zg.g / 2)::numeric, 6)  AS cy,
    ST_SetSRID(ST_MakePoint(
        floor(m.x / zg.g) * zg.g + zg.g / 2,
        floor(m.y / zg.g) * zg.g + zg.g / 2), 4326)           AS cell_geom,
    count(*)::bigint                                          AS n,
    sum((m.crash_severity = 'K')::int)::bigint                AS fatals,
    sum((m.crash_severity IN ('K','A'))::int)::bigint         AS serious,
    sum((CASE m.crash_severity
            WHEN 'K' THEN 883 WHEN 'A' THEN 94 WHEN 'B' THEN 21
            WHEN 'C' THEN 11 ELSE 1 END))::bigint             AS epdo
FROM public.mv_map_crashes m
CROSS JOIN zoom_grid zg
WHERE m.x IS NOT NULL AND m.y IS NOT NULL
GROUP BY m.state, zg.z,
    floor(m.x / zg.g), floor(m.y / zg.g);

-- Unique key for REFRESH … CONCURRENTLY; GiST on the cell for bbox pruning.
CREATE UNIQUE INDEX mv_map_clusters_pk
    ON public.mv_map_clusters (state, zoom_bucket, cx, cy);
CREATE INDEX mv_map_clusters_geom_idx
    ON public.mv_map_clusters USING gist (cell_geom);
CREATE INDEX mv_map_clusters_state_zoom_idx
    ON public.mv_map_clusters (state, zoom_bucket);

-- ── RPC change (apply alongside) ─────────────────────────────────────────────
-- In public.map_viewport_crashes, when grid_size > 0 (zoom < 14), serve from
-- the pre-clustered matview instead of clustering live:
--
--   IF grid_size > 0 THEN
--     RETURN QUERY EXECUTE format(
--       'SELECT cx, cy, sum(n)::bigint, sum(fatals)::bigint, sum(serious)::bigint,
--               sum(epdo)::bigint, true AS is_cluster, NULL::text, ... NULLs ...
--        FROM mv_map_clusters
--        WHERE zoom_bucket = %s AND cell_geom && %L %s
--        GROUP BY cx, cy
--        LIMIT %s',
--       <nearest zoom_bucket for p_zoom>, p_bbox, state_filter, p_limit);
--   ELSE  -- existing street-zoom live point query (unchanged)
--   END IF;
--
-- NOTE: the pre-cluster path covers state/road-type-unfiltered overview (the hot
-- path). Year/severity/road-type filtered overviews can keep the live path
-- (those bboxes are usually zoomed-in) OR add the same dims to mv_map_clusters
-- if filtered overviews are common.
--
-- ── Refresh wiring ───────────────────────────────────────────────────────────
-- Add to the nightly refresh_crash_lens_matviews() AFTER mv_map_crashes:
--   REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_map_clusters;
