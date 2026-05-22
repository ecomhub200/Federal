-- CC 018 v3 — Delaware B+C severity fix [P1]
--
-- Apply this AFTER the Delaware download workflow has been re-run with
-- jurisdiction = statewide (GitHub → Actions → "Download Delaware Crash
-- Data" → Run workflow → jurisdiction: statewide). That re-ingests the
-- raw Delaware crashes through the current state_adapter.py normalizer,
-- which splits "Personal Injury Crash" into A/B/C (8/32/60). Until the
-- matviews below are refreshed, the dashboard keeps serving the stale
-- pre-split aggregate (B = 0, C = 0).
--
-- Run in Supabase Studio (Monaco SQL editor).

REFRESH MATERIALIZED VIEW CONCURRENTLY public.dashboard_summary;
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_hotspots_with_rates;
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_map_points;
REFRESH MATERIALIZED VIEW CONCURRENTLY public.mv_safety_co_factors;
