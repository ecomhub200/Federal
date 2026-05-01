-- =============================================================================
-- §6.4–6.5 — Refresh procedure + pg_prewarm + nightly pg_cron schedule
-- =============================================================================
-- Wraps every Crash Lens matview in a single CONCURRENTLY refresh, then
-- pulls the matview pages back into shared_buffers via pg_prewarm so the
-- first PostgREST request after refresh hits a warm cache.
--
-- pg_cron line at the bottom assumes the extension is installed and the
-- self-hosted Supabase image enables it. If not, drop that line and wire
-- the procedure call into your existing scheduler (cron / systemd timer /
-- GitHub Action / etc.). The procedure body is independent of the
-- scheduler.
-- =============================================================================

-- Required extensions (no-ops if already present).
CREATE EXTENSION IF NOT EXISTS pg_prewarm;

-- pg_cron is conditional — skip extension creation if it isn't packaged on
-- this image. The schedule below is wrapped so failures don't abort the
-- whole migration.

CREATE OR REPLACE PROCEDURE public.refresh_crash_lens_matviews()
LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_grants_baseline;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_crash_tree;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_categories;
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_analysis_summary;

    -- Pull pages into shared_buffers for warm first-byte after refresh.
    PERFORM pg_prewarm('public.dashboard_summary');
    PERFORM pg_prewarm('public.mv_hotspots');
    PERFORM pg_prewarm('public.mv_grants_baseline');
    PERFORM pg_prewarm('public.mv_crash_tree');
    PERFORM pg_prewarm('public.mv_safety_categories');
    PERFORM pg_prewarm('public.mv_analysis_summary');
END;
$$;

ALTER PROCEDURE public.refresh_crash_lens_matviews() OWNER TO postgres;

-- Initial prewarm so first reads after this migration are fast.
SELECT pg_prewarm('public.dashboard_summary');
SELECT pg_prewarm('public.mv_hotspots');
SELECT pg_prewarm('public.mv_grants_baseline');
SELECT pg_prewarm('public.mv_crash_tree');
SELECT pg_prewarm('public.mv_safety_categories');
SELECT pg_prewarm('public.mv_analysis_summary');

-- Nightly schedule via pg_cron (03:15 server time). Wrapped in DO so a
-- missing pg_cron extension doesn't abort the migration.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
        -- Unschedule any previous job with the same name (idempotent).
        PERFORM cron.unschedule(jobid)
          FROM cron.job
         WHERE jobname = 'crashlens_matview_refresh';

        PERFORM cron.schedule(
            'crashlens_matview_refresh',
            '15 3 * * *',
            $cmd$ CALL public.refresh_crash_lens_matviews(); $cmd$
        );
    ELSE
        RAISE NOTICE
          'pg_cron not installed — schedule public.refresh_crash_lens_matviews() via your external scheduler.';
    END IF;
END
$$;

-- ===== Verification =========================================================
-- Manual smoke test (will take a few minutes the first time on a cold cache):
--   CALL public.refresh_crash_lens_matviews();
--
-- Confirm the schedule is registered (only if pg_cron is present):
--   SELECT jobid, schedule, command
--     FROM cron.job
--    WHERE jobname = 'crashlens_matview_refresh';
--
-- Confirm prewarm is plumbed in:
--   SELECT pg_prewarm('public.dashboard_summary');
-- Returns the number of pages warmed.
