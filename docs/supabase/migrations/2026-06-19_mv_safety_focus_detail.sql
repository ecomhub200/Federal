-- =============================================================================
-- 2026-06-19 — mv_safety_focus_detail
-- Per (jurisdiction, location, Safety Focus category) dimensional breakdowns so
-- the Safety Focus → category → location DETAIL panel renders real charts at
-- AGGREGATE tiers (today those charts are blank — docs/qa/safety-focus-detail-findings.md).
-- Mirrors mv_hotspots_detail's JSONB shape, partitioned by `category`.
--
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
--
-- KEY + PREDICATES VALIDATED by exact reconciliation vs the live
-- mv_safety_focus_locations (REST, 2026-06-20). The location identity is the
-- jurisdiction columns + the node-based segment/intersection split below
-- (NO finer key; the earlier "7 vs 181" was one jurisdiction's slice vs the
-- whole road). Proof: "KOREAN WAR VETERANS MEM. HIGHWAY" / animal /
-- planning_district='Central District' / segment(node null|0) /
-- animal_related='Yes' = 82 = sum of the matview's Central-District segment
-- rows (7+59+6+10). The other 29 crashes carry a real node and route to a
-- separate intersection row, exactly as below. All 18 boolean (='Yes')
-- category predicates reconcile.
--
-- ONE ITEM STILL OPEN: the `curves` predicate. `curvature` is continuous
-- (1.0 ~ straight); the cutoff is not in-repo and didn't reconcile via REST.
-- Confirm with:  SELECT pg_get_viewdef('public.mv_safety_focus_locations'::regclass,true);
-- then set @CURVE_PREDICATE below. The other 18 categories are correct as-is.
--
-- NOTE road_type: mv_safety_focus_locations also splits by road_type; this
-- matview omits it (the detail panel SUMS a location's rows within a tier, so
-- the aggregate is identical — confirmed by 82=82). Add it to GROUP BY+index
-- only if you need 1:1 row parity.
--
-- Test in a transaction (BEGIN; CREATE …; SELECT count(*) …; ROLLBACK;) first.
-- =============================================================================

DROP MATERIALIZED VIEW IF EXISTS public.mv_safety_focus_detail;

CREATE MATERIALIZED VIEW public.mv_safety_focus_detail AS
WITH base AS (
    SELECT
        c.state,
        c.physical_juris_name, c.mpo_name, c.planning_district, c.dot_district,
        CASE WHEN c.node IS NOT NULL AND c.node <> '' AND c.node <> '0'
             THEN 'intersection' ELSE 'segment' END AS location_type,
        CASE WHEN c.node IS NOT NULL AND c.node <> '' AND c.node <> '0'
             THEN COALESCE(NULLIF(c.intersection_name,''), NULLIF(c.rte_name,''), c.node)
             ELSE COALESCE(NULLIF(c.rte_name,''), c.node) END AS location_name,
        -- ⚠️ add the finer key here to match mv_safety_focus_locations, e.g. c.node
        cat.category,
        c.crash_severity,
        c.crash_year::text                                          AS d_year,
        to_char(c.crash_date_parsed::date, 'MM')                    AS d_month,
        extract(dow FROM c.crash_date_parsed::date)::int::text      AS d_dow,
        (floor(NULLIF(c.crash_military_time,'')::int / 100))::int::text AS d_hour,
        COALESCE(NULLIF(c.collision_type,''),'Unknown')             AS d_collision,
        COALESCE(NULLIF(c.weather_condition,''),'Unknown')          AS d_weather,
        COALESCE(NULLIF(c.light_condition,''),'Unknown')            AS d_light,
        COALESCE(NULLIF(c.roadway_surface_cond,''),'Unknown')       AS d_surface,
        COALESCE(NULLIF(c.traffic_control_type,''),'Unknown')       AS d_traffic,
        c.pedestrian, c.bike, c.motorcycle, c.alcohol, c.speed, c.distracted,
        c.drowsy, c.drug_related, c.hitrun, c.unrestrained, c.night,
        c.senior, c.young
    FROM public.crashes c
    CROSS JOIN LATERAL (VALUES
        ('pedestrian',   c.pedestrian = 'Yes'),
        ('bicycle',      c.bike = 'Yes'),
        ('motorcycle',   c.motorcycle = 'Yes'),
        ('alcohol',      c.alcohol = 'Yes'),
        ('impaired',     c.alcohol = 'Yes'),
        ('speed',        c.speed = 'Yes'),
        ('distracted',   c.distracted = 'Yes'),
        ('unrestrained', c.unrestrained = 'Yes'),
        ('nighttime',    c.night = 'Yes'),
        ('animal',       c.animal_related = 'Yes'),
        ('guardrail',    c.guardrail_related = 'Yes'),
        ('intersection', c.is_intersection = 'Yes'),
        ('school',       c.school_zone = 'Yes'),
        ('workzone',     c.work_zone_related IN ('Yes','1. Yes')),
        ('weather',      c.weather_condition NOT IN ('1. Clear','Clear','Not Provided','')
                          AND c.weather_condition IS NOT NULL),
        ('drug',         c.drug_related = 'Yes'),
        ('hitrun',       c.hitrun = 'Yes'),
        ('drowsy',       c.drowsy = 'Yes'),
        ('curves',       c.curvature > 1.0)          -- @CURVE_PREDICATE — verify threshold
    ) AS cat(category, matched)
    WHERE cat.matched
      AND COALESCE(NULLIF(c.node,''), c.rte_name) IS NOT NULL
      AND c.crash_year IS NOT NULL AND c.crash_year > 0
),
totals AS (
    SELECT state, physical_juris_name, mpo_name, planning_district, dot_district,
           location_type, location_name, category,
           count(*)::bigint                       AS total,
           sum((crash_severity='K')::int)::bigint AS k,
           sum((crash_severity='A')::int)::bigint AS a,
           sum((alcohol='Yes')::int)::bigint      AS alcohol_count,
           sum((speed='Yes')::int)::bigint        AS speed_count,
           sum((distracted='Yes')::int)::bigint   AS distracted_count,
           sum((drowsy='Yes')::int)::bigint       AS drowsy_count,
           sum((drug_related='Yes')::int)::bigint AS drug_count,
           sum((hitrun='Yes')::int)::bigint       AS hitrun_count,
           sum((pedestrian='Yes')::int)::bigint   AS ped_count,
           sum((bike='Yes')::int)::bigint         AS bike_count,
           sum((motorcycle='Yes')::int)::bigint   AS moto_count,
           sum((senior='Yes')::int)::bigint       AS senior_count,
           sum((young='Yes')::int)::bigint        AS young_count,
           sum((unrestrained='Yes')::int)::bigint AS unrestrained_count,
           sum((night='Yes')::int)::bigint        AS night_count
    FROM base GROUP BY 1,2,3,4,5,6,7,8
),
-- one CTE per JSONB dimension (same proven pattern); join on the 8 key cols.
dim_year   AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_year, c)     AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_year, count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_month  AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_month, c)    AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_month,count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_dow    AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_dow, c)      AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_dow,  count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_hour   AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_hour, c)     AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_hour, count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_coll   AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_collision, c) AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_collision,count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_weath  AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_weather, c)   AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_weather,count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_light  AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_light, c)     AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_light,  count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_surf   AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_surface, c)   AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_surface,count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8),
dim_traf   AS (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category, jsonb_object_agg(d_traffic, c)   AS j FROM (SELECT state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category,d_traffic,count(*) c FROM base GROUP BY 1,2,3,4,5,6,7,8,9) s GROUP BY 1,2,3,4,5,6,7,8)
SELECT t.*,
       dy.j AS by_year, dm.j AS by_month, dd.j AS by_dow, dh.j AS by_hour,
       dc.j AS by_collision, dw.j AS by_weather, dl.j AS by_light,
       ds.j AS by_roadsurface, dt.j AS by_trafficctrl
FROM totals t
LEFT JOIN dim_year  dy USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_month dm USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_dow   dd USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_hour  dh USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_coll  dc USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_weath dw USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_light dl USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_surf  ds USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category)
LEFT JOIN dim_traf  dt USING (state,physical_juris_name,mpo_name,planning_district,dot_district,location_type,location_name,category);

-- NOTE: USING(...) treats NULL juris cols as non-equal. The crash juris-hierarchy
-- columns are populated per crash, so this is fine; if any are NULL in your data,
-- switch the joins to `ON ... IS NOT DISTINCT FROM ...`.

CREATE UNIQUE INDEX mv_safety_focus_detail_pk
    ON public.mv_safety_focus_detail
    (state, physical_juris_name, mpo_name, planning_district, dot_district,
     location_type, location_name, category) NULLS NOT DISTINCT;

-- Refresh wiring (refresh_crash_lens_matviews(), after mv_safety_focus_locations):
--   REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_focus_detail;

-- ── FRONTEND wiring (app/modules/safety/safety-focus-detail-panel.js) ─────────
-- In aggregateSfDetailData() matview mode, fetch mv_safety_focus_detail filtered
-- by (state, active-tier-column, category) + location_name IN (selected), and
-- populate data.byYear/byMonth/byDOW/byHour/byCollision/byWeather/byLight/
-- bySurface/byTrafficControl from the by_* JSONB columns, and the factor/VRU/
-- demographic counts from the *_count columns. Keys match
-- mv_safety_focus_locations so the detail totals reconcile with Top Locations.
