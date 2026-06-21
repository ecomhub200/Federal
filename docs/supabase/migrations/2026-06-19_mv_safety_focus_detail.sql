-- =============================================================================
-- 2026-06-19 — mv_safety_focus_detail   (APPLIED + VERIFIED 2026-06-21)
-- Per (jurisdiction, road_type, location, Safety Focus category) breakdowns so
-- the Safety Focus -> category -> location DETAIL panel renders real charts at
-- AGGREGATE tiers (previously blank; see docs/qa/safety-focus-detail-findings.md).
--
-- Mirrors the live mv_safety_focus_locations definition EXACTLY (same base,
-- catfilt category predicates incl. curves = curvature::numeric > 1.005,
-- node-based segment/intersection split, GROUP BY key) and ADDS JSONB
-- dimensional breakdowns + factor/VRU/demographic counts. Because the key is
-- identical, a selected location reconciles with mv_safety_focus_locations.
--
-- Verified on srv1503081.hstgr.cloud: DE = 173,151 rows / 17 categories;
-- "KOREAN WAR VETERANS MEM. HIGHWAY" animal/segment/Central District = 82
-- (sum of its 4 jurisdiction rows) = the matching focus_locations total;
-- by_collision / by_year JSONB reconcile. Nightly cron added at the bottom.
--
-- Replicating for a NEW state: nothing state-specific here (it scans the whole
-- crashes table). Load the state's rows, then the nightly REFRESH (or a manual
-- REFRESH MATERIALIZED VIEW CONCURRENTLY) picks them up. Frontend reads it in
-- app/modules/safety/safety-focus-detail-panel.js (aggregateSfDetailData).
-- =============================================================================
DROP MATERIALIZED VIEW IF EXISTS public.mv_safety_focus_detail;
CREATE MATERIALIZED VIEW public.mv_safety_focus_detail AS
WITH base AS (
  SELECT c.state,
    COALESCE(c.physical_juris_name,'') AS physical_juris_name,
    COALESCE(c.dot_district,'')        AS dot_district,
    COALESCE(c.mpo_name,'')            AS mpo_name,
    COALESCE(c.planning_district,'')   AS planning_district,
    c.crash_severity, c.crash_year, c.rte_name, c.intersection_name, c.node, c.curvature,
    c.weather_condition, c.relation_to_roadway, c.alcohol, c.drug_related, c.bike, c.distracted,
    c.drowsy, c.guardrail_related, c.hitrun, c.motorcycle, c.pedestrian, c.speed, c.senior, c.young,
    c.night, c.school_zone, c.unrestrained, c.animal_related,
    c.collision_type, c.light_condition, c.roadway_surface_cond, c.traffic_control_type,
    c.crash_date_parsed, c.crash_military_time,
    (c.node IS NOT NULL AND c.node<>'' AND c.node<>'0') AS is_intersection,
    CASE WHEN c.ownership='1. State Hwy Agency' THEN 'dot_roads'
         WHEN c.ownership='2. County Hwy Agency' THEN 'county_roads'
         WHEN c.ownership='3. City or Town Hwy Agency' THEN 'city_roads'
         ELSE 'other_roads' END AS road_type
  FROM crashes c
),
ex AS (
  SELECT base.state,base.physical_juris_name,base.dot_district,base.mpo_name,base.planning_district,
    base.road_type, catfilt.category, loctype.location_type, loctype.location_name, base.crash_severity,
    COALESCE(base.crash_year::text,'Unknown') AS d_year,
    CASE WHEN base.crash_date_parsed IS NOT NULL THEN to_char(base.crash_date_parsed::date,'MM') ELSE 'Unknown' END AS d_month,
    CASE WHEN base.crash_date_parsed IS NOT NULL THEN extract(dow FROM base.crash_date_parsed::date)::int::text ELSE 'Unknown' END AS d_dow,
    CASE WHEN base.crash_military_time ~ '^[0-9]+$' THEN floor(base.crash_military_time::int/100)::int::text ELSE 'Unknown' END AS d_hour,
    COALESCE(NULLIF(base.collision_type,''),'Unknown') AS d_coll,
    COALESCE(NULLIF(base.weather_condition,''),'Unknown') AS d_weather,
    COALESCE(NULLIF(base.light_condition,''),'Unknown') AS d_light,
    COALESCE(NULLIF(base.roadway_surface_cond,''),'Unknown') AS d_surf,
    COALESCE(NULLIF(base.traffic_control_type,''),'Unknown') AS d_traf,
    base.alcohol,base.speed,base.distracted,base.drowsy,base.drug_related,base.hitrun,
    base.pedestrian,base.bike,base.motorcycle,base.senior,base.young,base.unrestrained,base.night,
    base.is_intersection
  FROM base,
  LATERAL (VALUES
    ('curves', CASE WHEN base.curvature IS NOT NULL AND base.curvature<>'' AND base.curvature::numeric>1.005 THEN 'Yes' ELSE 'No' END),
    ('pedestrian',base.pedestrian),('bicycle',base.bike),('speed',base.speed),('alcohol',base.alcohol),
    ('drug',base.drug_related),('impaired',CASE WHEN base.alcohol='Yes' OR base.drug_related='Yes' THEN 'Yes' ELSE 'No' END),
    ('distracted',base.distracted),('motorcycle',base.motorcycle),('animal',base.animal_related),
    ('guardrail',base.guardrail_related),('nighttime',base.night),('school',base.school_zone),
    ('intersection',CASE WHEN base.is_intersection THEN 'Yes' ELSE 'No' END),
    ('weather',CASE WHEN base.weather_condition IS NOT NULL AND base.weather_condition <> ALL(ARRAY['Clear','No Adverse Conditions','Unknown','']) THEN 'Yes' ELSE 'No' END),
    ('roaddeparture',CASE WHEN base.relation_to_roadway IS NOT NULL AND base.relation_to_roadway<>'' THEN 'Yes' ELSE 'No' END),
    ('unrestrained',base.unrestrained)
  ) catfilt(category,flag),
  LATERAL (VALUES
    ('intersection',COALESCE(NULLIF(base.intersection_name,''),NULLIF(base.node,''),'Unknown')),
    ('segment',COALESCE(NULLIF(base.rte_name,''),'Unknown'))
  ) loctype(location_type,location_name)
  WHERE catfilt.flag='Yes'
    AND ((loctype.location_type='intersection' AND base.is_intersection)
      OR (loctype.location_type='segment' AND NOT base.is_intersection))
),
agg AS (
  SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,
    count(*)::int total,
    sum((crash_severity='K')::int)::int k, sum((crash_severity='A')::int)::int a,
    sum((crash_severity='B')::int)::int b, sum((crash_severity='C')::int)::int c, sum((crash_severity='O')::int)::int o,
    min(NULLIF(d_year,'Unknown')::int) first_year, max(NULLIF(d_year,'Unknown')::int) last_year,
    sum((is_intersection)::int)::int at_intersection,
    sum((alcohol='Yes')::int)::int alcohol_count, sum((speed='Yes')::int)::int speed_count,
    sum((distracted='Yes')::int)::int distracted_count, sum((drowsy='Yes')::int)::int drowsy_count,
    sum((drug_related='Yes')::int)::int drug_count, sum((hitrun='Yes')::int)::int hitrun_count,
    sum((pedestrian='Yes')::int)::int ped_count, sum((bike='Yes')::int)::int bike_count,
    sum((motorcycle='Yes')::int)::int moto_count, sum((senior='Yes')::int)::int senior_count,
    sum((young='Yes')::int)::int young_count, sum((unrestrained='Yes')::int)::int unrestrained_count,
    sum((night='Yes')::int)::int night_count
  FROM ex GROUP BY 1,2,3,4,5,6,7,8,9
),
d_year AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,
    jsonb_object_agg(d_year, jsonb_build_object('total',t,'K',yk,'A',ya,'B',yb,'C',yc,'O',yo)) j
  FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_year,
        count(*) t, sum((crash_severity='K')::int) yk, sum((crash_severity='A')::int) ya,
        sum((crash_severity='B')::int) yb, sum((crash_severity='C')::int) yc, sum((crash_severity='O')::int) yo
        FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_month AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_month, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_month,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_dow AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_dow, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_dow,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_hour AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_hour, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_hour,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_coll AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_coll, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_coll,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_weat AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_weather, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_weather,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_lite AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_light, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_light,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_surf AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_surf, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_surf,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9),
d_traf AS (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name, jsonb_object_agg(d_traf, cc) j FROM (SELECT state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name,d_traf,count(*) cc FROM ex GROUP BY 1,2,3,4,5,6,7,8,9,10) s GROUP BY 1,2,3,4,5,6,7,8,9)
SELECT agg.*,
  d_year.j by_year, d_month.j by_month, d_dow.j by_dow, d_hour.j by_hour,
  d_coll.j by_collision, d_weat.j by_weather, d_lite.j by_light, d_surf.j by_roadsurface, d_traf.j by_trafficctrl
FROM agg
LEFT JOIN d_year  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_month USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_dow   USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_hour  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_coll  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_weat  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_lite  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_surf  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name)
LEFT JOIN d_traf  USING(state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name);
CREATE UNIQUE INDEX mv_safety_focus_detail_pk ON public.mv_safety_focus_detail (state,physical_juris_name,dot_district,mpo_name,planning_district,road_type,category,location_type,location_name);
CREATE INDEX mv_safety_focus_detail_lookup ON public.mv_safety_focus_detail (state,category,location_name);
-- Nightly refresh (per-matview cron pattern, after mv_safety_focus_locations @ 06:45):
SELECT cron.schedule('refresh-mv-safety-focus-detail', '0 7 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_focus_detail');
