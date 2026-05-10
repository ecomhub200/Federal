-- =============================================================================
-- Round 9 follow-up — actual-schema UNIQUE indexes
-- =============================================================================
-- Purpose: the original 2026-05-10_round9_perf_indexes_and_cron.sql guessed
--          matview column lists (state, tier, value, dim, dim_value, year) that
--          didn't match the actual schemas. The defensive DO/EXCEPTION blocks
--          skipped silently. This file captures the corrected UNIQUE indexes
--          using the actual matview columns + PG15's NULLS NOT DISTINCT so
--          REFRESH MATERIALIZED VIEW CONCURRENTLY actually works for every
--          matview in the cron schedule.
--
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
-- Already applied manually 2026-05-10 — committing as source of truth.
--
-- HOW TO APPLY (Murad only — CC cannot reach this Supabase):
--   1. Open Supabase Studio → SQL Editor for srv1503081.hstgr.cloud
--   2. Paste this entire file. All statements are idempotent.
--   3. Verify with the queries at the bottom.
-- =============================================================================

-- =============================================================================
-- SECTION 1 — Schema-correct UNIQUE indexes for matviews missing them
-- =============================================================================
-- All use NULLS NOT DISTINCT (requires PG15+) because tier columns
-- (mpo_name, planning_district, etc.) are NULL for rows aggregated at
-- coarser levels.

CREATE UNIQUE INDEX IF NOT EXISTS mv_analysis_summary_uniq
    ON public.mv_analysis_summary
       (state, physical_juris_name, dot_district, mpo_name, planning_district,
        road_type, is_interstate, dimension, dim_value)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_safety_categories_uniq
    ON public.mv_safety_categories
       (state, physical_juris_name, dot_district, mpo_name, planning_district,
        road_type, is_interstate, category)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_pedbike_breakdowns_uniq
    ON public.mv_pedbike_breakdowns
       (state, physical_juris_name, dot_district, mpo_name, planning_district,
        road_type, is_interstate, mode, dimension, dim_value)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_intersection_summary_uniq
    ON public.mv_intersection_summary
       (state, physical_juris_name, dot_district, mpo_name, planning_district,
        road_type, is_interstate, intersection_type, traffic_control_type,
        collision_type, crash_year)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_crash_tree_uniq
    ON public.mv_crash_tree
       (tree_type, state, physical_juris_name, dot_district, mpo_name, planning_district,
        road_type, is_interstate, level1, level2, level3)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_hotspots_factors_uniq
    ON public.mv_hotspots_factors
       (state, location_type, location_name)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_hotspots_topcoll_uniq
    ON public.mv_hotspots_topcoll
       (state, location_type, location_name)
    NULLS NOT DISTINCT;

-- =============================================================================
-- SECTION 2 — Sibling UNIQUE indexes for matviews whose existing UNIQUE
--             index uses COALESCE(...) expressions
-- =============================================================================
-- mv_hotspots and mv_grants_baseline already have a UNIQUE index, but the
-- existing ones wrap nullable columns in COALESCE(col, '') for uniqueness.
-- Postgres REFRESH MATERIALIZED VIEW CONCURRENTLY requires a UNIQUE index
-- over plain column names (no expressions). Add sibling indexes using
-- NULLS NOT DISTINCT — same uniqueness semantics, eligible for CONCURRENTLY.

CREATE UNIQUE INDEX IF NOT EXISTS mv_hotspots_concurrent_uq
    ON public.mv_hotspots
       (state, county, region, mpo, planning_district, road_type, is_interstate,
        location_type, location_name, rte_name, intersection_name)
    NULLS NOT DISTINCT;

CREATE UNIQUE INDEX IF NOT EXISTS mv_grants_baseline_concurrent_uq
    ON public.mv_grants_baseline
       (state, county, region, mpo, planning_district, road_type, is_interstate,
        location_type, location_name, rte_name, crash_year)
    NULLS NOT DISTINCT;

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- 1. Every matview in the cron schedule should now have a UNIQUE index:
-- SELECT c.relname AS matview, bool_or(i.indisunique) AS has_unique_index
--   FROM pg_class c
--   JOIN pg_namespace n ON n.oid = c.relnamespace
--   LEFT JOIN pg_index i ON i.indrelid = c.oid
--  WHERE n.nspname = 'public' AND c.relkind = 'm'
--  GROUP BY c.relname
--  ORDER BY c.relname;

-- 2. CONCURRENTLY refresh should now succeed for all of them:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_analysis_summary;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_categories;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_pedbike_breakdowns;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_intersection_summary;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_crash_tree;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots_factors;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots_topcoll;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_grants_baseline;
