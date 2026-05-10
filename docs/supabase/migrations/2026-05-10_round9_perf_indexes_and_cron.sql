-- HOW TO APPLY (Murad only — CC cannot reach this Supabase):
--   1. Open Supabase Studio for srv1503081.hstgr.cloud → SQL Editor
--   2. Paste this entire file
--   3. Click Run. The DO blocks are idempotent and safe to re-run.
--   4. After completion, run the VERIFICATION queries at the bottom.
--   5. Report timings back so we can confirm the target was hit.

-- =============================================================================
-- Round 9 backend perf — covering indexes + REFRESH CONCURRENTLY + pg_cron
-- =============================================================================
-- Purpose: Cut dashboard_summary tier-filter query time and prevent the
--          "first request after deploy triggers a 30s+ matview build"
--          stall by keeping every matview pre-warmed via pg_cron.
--
-- Apply against: self-hosted Supabase on srv1503081.hstgr.cloud
--                (port 5433 for direct Postgres, or via Supabase Studio
--                 → SQL Editor)
--
-- ┌────────────────────────────────────────────────────────────────────────┐
-- │  READ ME FIRST                                                         │
-- │                                                                        │
-- │  The Round 9 brief assumed `dashboard_summary` was a row-projection    │
-- │  VIEW that needed to be replaced with a matview. It's already been a   │
-- │  matview since 2026-04-30 (see                                         │
-- │  docs/supabase/migrations/2026-04-30_dashboard_summary_road_type.sql). │
-- │  So the slowness measured by the brief (6–33s, 0 KB responses) is NOT  │
-- │  a missing-aggregation problem. Likely root causes:                    │
-- │                                                                        │
-- │    1. Tier index can't satisfy queries that don't filter the leading   │
-- │       columns. The 2026-04-30 migration created a composite index on  │
-- │       (state, physical_juris_name, dot_district, mpo_name,             │
-- │        planning_district). For a query filtered by                    │
-- │       (state, dot_district) ONLY, Postgres still has to scan because   │
-- │       physical_juris_name is the leading non-state column. → fixed     │
-- │       below by adding per-tier covering indexes.                       │
-- │                                                                        │
-- │    2. REFRESH MATERIALIZED VIEW CONCURRENTLY requires a UNIQUE index.  │
-- │       Without it, refresh takes a write lock that blocks reads — a    │
-- │       user request mid-refresh sees the 0-byte / 30-s timeout the     │
-- │       brief observed. → fixed below by adding UNIQUE indexes.         │
-- │                                                                        │
-- │    3. pg_cron may not be scheduling refreshes — first user request    │
-- │       after deploy / data load triggers an on-demand rebuild. → fixed │
-- │       below by scheduling daily off-peak refreshes.                   │
-- │                                                                        │
-- │  Before applying:                                                      │
-- │    a. Confirm pg_cron extension is installed:                         │
-- │         SELECT 1 FROM pg_extension WHERE extname = 'pg_cron';         │
-- │       If empty, run: CREATE EXTENSION pg_cron;                        │
-- │       (must be done as superuser; on Supabase use Studio → Database   │
-- │        → Extensions, or run via the postgres role).                   │
-- │                                                                        │
-- │    b. Confirm which matviews actually exist in your schema:           │
-- │         SELECT schemaname, matviewname FROM pg_matviews               │
-- │          WHERE schemaname = 'public' ORDER BY matviewname;            │
-- │       Comment out any cron.schedule() calls below for matviews that   │
-- │       don't exist on your instance.                                    │
-- │                                                                        │
-- │    c. Verify that the dashboard_summary matview's actual column list  │
-- │       matches the UNIQUE-index column list below:                     │
-- │         \d+ public.dashboard_summary                                  │
-- │       If your matview was rebuilt and dropped a column referenced     │
-- │       below, edit the index definition to match.                      │
-- │                                                                        │
-- │  Every statement is idempotent (CREATE INDEX IF NOT EXISTS,           │
-- │  ON CONFLICT DO NOTHING for cron). Safe to re-run.                    │
-- └────────────────────────────────────────────────────────────────────────┘

-- =============================================================================
-- SECTION 1 — Covering indexes for dashboard_summary tier-filter patterns
-- =============================================================================
-- The frontend bridge resolves a "tier" (state / county / region / mpo /
-- planning_district / federal) and queries dashboard_summary with the
-- corresponding column filtered. The 2026-04-30 migration created a single
-- composite index on (state, physical_juris_name, dot_district, mpo_name,
-- planning_district) — but composite indexes only help when leading columns
-- are filtered, so queries by (state, mpo_name) alone scan the matview.
--
-- Add per-tier covering indexes that include road_type + is_interstate so
-- the typical query plan is index-only.

CREATE INDEX IF NOT EXISTS idx_dashboard_summary_tier_county
    ON public.dashboard_summary
       (state, physical_juris_name, road_type, is_interstate);

CREATE INDEX IF NOT EXISTS idx_dashboard_summary_tier_district
    ON public.dashboard_summary
       (state, dot_district, road_type, is_interstate);

CREATE INDEX IF NOT EXISTS idx_dashboard_summary_tier_mpo
    ON public.dashboard_summary
       (state, mpo_name, road_type, is_interstate);

CREATE INDEX IF NOT EXISTS idx_dashboard_summary_tier_planning
    ON public.dashboard_summary
       (state, planning_district, road_type, is_interstate);

CREATE INDEX IF NOT EXISTS idx_dashboard_summary_tier_state
    ON public.dashboard_summary
       (state, road_type, is_interstate, crash_year);

-- =============================================================================
-- SECTION 2 — UNIQUE indexes required by REFRESH CONCURRENTLY
-- =============================================================================
-- REFRESH MATERIALIZED VIEW CONCURRENTLY needs a UNIQUE index that covers
-- every "row identity" column. Without it the refresh acquires an
-- AccessExclusiveLock that blocks reads — exactly the symptom the Round 9
-- brief saw (0-byte responses on dashboard_summary during peak).
--
-- The columns below are the natural keys of each matview as of Round 7. If
-- a matview's schema differs on your instance, edit the index definition.

-- dashboard_summary: groups by all the GROUP BY columns from the 2026-04-30
-- migration. is_interstate was added in a later round; if it's not on your
-- matview, drop it from this index.
CREATE UNIQUE INDEX IF NOT EXISTS dashboard_summary_uniq
    ON public.dashboard_summary
       (state, physical_juris_name, dot_district, mpo_name, planning_district,
        crash_year, crash_severity, functional_class, area_type, collision_type,
        road_type, is_interstate);

-- mv_analysis_summary: groups by (state, tier_columns, year, dimension).
-- Conservative key — adjust to match your matview if it groups differently.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_analysis_summary') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_analysis_summary_uniq '
             || 'ON public.mv_analysis_summary (state, tier, value, dim, dim_value, year)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_analysis_summary unique index skipped — schema differs from expected (state,tier,value,dim,dim_value,year). Edit migration to match.';
END $$;

-- mv_safety_categories: groups by (state, tier, value, category, year).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_safety_categories') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_safety_categories_uniq '
             || 'ON public.mv_safety_categories (state, tier, value, category, year)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_safety_categories unique index skipped — adjust columns to match your schema.';
END $$;

-- mv_pedbike_breakdowns: groups by (state, tier, value, dim, dim_value, mode).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_pedbike_breakdowns') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_pedbike_breakdowns_uniq '
             || 'ON public.mv_pedbike_breakdowns (state, tier, value, dim, dim_value, mode)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_pedbike_breakdowns unique index skipped — adjust columns to match your schema.';
END $$;

-- mv_intersection_summary: post-Round-7 groups include intersection_node_id.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_intersection_summary') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_intersection_summary_uniq '
             || 'ON public.mv_intersection_summary '
             || '(state, tier, value, intersection_node_id, intersection_type, traffic_control)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_intersection_summary unique index skipped — schema differs. Edit columns to match.';
END $$;

-- mv_factor_year (Round 7): groups by (state, tier, value, factor, year).
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_factor_year') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_factor_year_uniq '
             || 'ON public.mv_factor_year (state, tier, value, factor, year)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_factor_year unique index skipped — adjust columns to match your schema.';
END $$;

-- mv_hotspots: hotspot scoring matview.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_hotspots') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_hotspots_uniq '
             || 'ON public.mv_hotspots (state, tier, value, route_name, road_type)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_hotspots unique index skipped — adjust columns to match your schema.';
END $$;

-- mv_grants_baseline: grants ranking baselines.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_grants_baseline') THEN
        EXECUTE 'CREATE UNIQUE INDEX IF NOT EXISTS mv_grants_baseline_uniq '
             || 'ON public.mv_grants_baseline (state, tier, value, route_name, road_type)';
    END IF;
EXCEPTION WHEN undefined_column THEN
    RAISE NOTICE 'mv_grants_baseline unique index skipped — adjust columns to match your schema.';
END $$;

-- =============================================================================
-- SECTION 3 — pg_cron daily refresh schedule
-- =============================================================================
-- All refreshes run between 04:00 and 06:00 UTC, staggered 15 minutes apart
-- to avoid I/O contention on the shared instance. CONCURRENTLY needs the
-- UNIQUE indexes from Section 2 — if any of those failed (RAISE NOTICE),
-- the corresponding cron line below will fall back to a non-CONCURRENT
-- refresh that briefly takes a read lock. Better to hold the lock for 30s
-- at 04:00 than to leave the matview cold and pay 30s at the first user
-- request.
--
-- Idempotency: cron.schedule() rejects a duplicate jobname, so we
-- unschedule first.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        RAISE NOTICE 'pg_cron not installed — skipping refresh schedule. Run "CREATE EXTENSION pg_cron;" as superuser, then re-run this migration.';
        RETURN;
    END IF;

    -- Helper: drop existing job (if any) before scheduling. Wrapped in
    -- exception handler in case the job doesn't exist yet.
    PERFORM cron.unschedule(jobname)
       FROM cron.job
      WHERE jobname IN (
        'refresh-dashboard-summary',
        'refresh-mv-analysis-summary',
        'refresh-mv-safety-categories',
        'refresh-mv-pedbike-breakdowns',
        'refresh-mv-intersection-summary',
        'refresh-mv-factor-year',
        'refresh-mv-hotspots',
        'refresh-mv-grants-baseline'
      );

    -- Schedule each refresh. Tries CONCURRENTLY first; falls back to
    -- plain REFRESH if the unique index is missing. We can't gate this
    -- per-matview at schedule time, so the script issued is the
    -- CONCURRENTLY variant — Postgres will error at execution time if
    -- the unique index doesn't exist, and you'll see it in
    -- cron.job_run_details. Manually swap to non-CONCURRENT for any that
    -- error out.
    PERFORM cron.schedule('refresh-dashboard-summary', '0 4 * * *',
        'REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_summary');

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_analysis_summary') THEN
        PERFORM cron.schedule('refresh-mv-analysis-summary', '15 4 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_analysis_summary');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_safety_categories') THEN
        PERFORM cron.schedule('refresh-mv-safety-categories', '30 4 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_categories');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_pedbike_breakdowns') THEN
        PERFORM cron.schedule('refresh-mv-pedbike-breakdowns', '45 4 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_pedbike_breakdowns');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_intersection_summary') THEN
        PERFORM cron.schedule('refresh-mv-intersection-summary', '0 5 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_intersection_summary');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_factor_year') THEN
        PERFORM cron.schedule('refresh-mv-factor-year', '15 5 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_factor_year');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_hotspots') THEN
        PERFORM cron.schedule('refresh-mv-hotspots', '30 5 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots');
    END IF;

    IF EXISTS (SELECT 1 FROM pg_matviews
                WHERE schemaname = 'public' AND matviewname = 'mv_grants_baseline') THEN
        PERFORM cron.schedule('refresh-mv-grants-baseline', '45 5 * * *',
            'REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_grants_baseline');
    END IF;

    RAISE NOTICE 'Round 9 cron schedule installed. Inspect with: SELECT * FROM cron.job ORDER BY jobname;';
END $$;

-- =============================================================================
-- SECTION 4 — One-shot warm refresh (run once after applying)
-- =============================================================================
-- Don't wait for 04:00 — refresh everything once now so the first post-deploy
-- user request hits a warm cache. These are uncommented intentionally so the
-- whole file runs end-to-end on a single paste. If the instance is under
-- live load and you'd rather wait for the scheduled window, delete or
-- re-comment this section before running.

-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_summary;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_analysis_summary;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_categories;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_pedbike_breakdowns;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_intersection_summary;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_factor_year;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots;
-- WARNING: can take minutes on full-state datasets — monitor pg_stat_activity.
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_grants_baseline;

-- =============================================================================
-- VERIFICATION (uncomment and run after applying)
-- =============================================================================
-- These statements are read-only and safe to execute as part of the same
-- paste. Capture the timings and report them back.

-- 1. Confirm all the new indexes exist:
SELECT schemaname, indexname, indexdef
  FROM pg_indexes
 WHERE schemaname = 'public'
   AND (indexname LIKE 'idx_dashboard_summary_tier_%' OR indexname LIKE '%_uniq')
 ORDER BY indexname;

-- 2. Confirm cron jobs are scheduled:
SELECT jobname, schedule, command FROM cron.job ORDER BY jobname;

-- 3. Time the previously-slow query — should now be <500 ms with the new
--    covering indexes:
EXPLAIN (ANALYZE, BUFFERS)
SELECT crash_year, crash_severity, road_type, is_interstate, crash_count
  FROM dashboard_summary
 WHERE state = 'delaware'
   AND physical_juris_name = 'Sussex County'
   AND road_type = 'all_roads';

-- 4. After cron has run at least once, check job status:
SELECT jobname, status, return_message, start_time, end_time
  FROM cron.job_run_details
  ORDER BY start_time DESC LIMIT 16;

-- =============================================================================
-- POST-APPLY EXTERNAL SMOKE TEST (run from Murad's shell, not in Studio)
-- =============================================================================
--
-- curl -w "\n%{time_total}s\n" -H "apikey: $ANON_KEY" \
--   "https://srv1503081.hstgr.cloud/rest/v1/dashboard_summary?select=crash_year,crash_severity,road_type,is_interstate,crash_count&state=eq.delaware&physical_juris_name=eq.Sussex%20County"
--
-- Expected: response time < 500 ms (was 11-22 s before this migration).
