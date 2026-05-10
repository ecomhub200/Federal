-- ============================================================================
-- Round 13 — Nightly cron refresh for mv_location_picker
-- Aligned with the other Round 12 matview refreshes (5-15 min after midnight UTC).
-- ============================================================================

SELECT cron.schedule(
    'refresh-mv-location-picker',
    '15 6 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_location_picker$$
);

SELECT cron.schedule(
    'refresh-mv-grant-ready-locations',
    '20 6 * * *',
    $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_grant_ready_locations$$
);
