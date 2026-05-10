-- ============================================================================
-- Round 13 — CONDITIONAL — Magisterial District (CCD) breakdown
--
-- ⚠️ DO NOT APPLY YET — verified 2026-05-11 that crashes_delaware has no
-- ccd_name column. The frontend renders an honest "TIGERweb spatial join
-- pending" banner via crashLensClient.getMagisterialDistricts() returning
-- a sentinel null when the matview is missing.
--
-- Apply this migration ONLY after the ingest pipeline adds crashes.ccd_name
-- (Round 14 candidate). It's kept here as the scaffold for that future PR.
-- ============================================================================

CREATE MATERIALIZED VIEW IF NOT EXISTS mv_grants_ccd AS
SELECT
    state,
    physical_juris_name AS county,
    ccd_name,
    road_type,
    COUNT(*)                                                         AS crash_count,
    SUM(CASE WHEN crash_severity='K' THEN 1 ELSE 0 END)              AS k,
    SUM(CASE WHEN crash_severity='A' THEN 1 ELSE 0 END)              AS a,
    SUM(CASE WHEN crash_severity='B' THEN 1 ELSE 0 END)              AS b,
    SUM(CASE WHEN crash_severity='C' THEN 1 ELSE 0 END)              AS c,
    SUM(CASE WHEN crash_severity='O' THEN 1 ELSE 0 END)              AS o,
    SUM(epdo_weight)                                                 AS epdo,
    SUM(CASE WHEN pedestrian='Yes' THEN 1 ELSE 0 END)                AS ped_count,
    SUM(CASE WHEN bicycle='Yes' THEN 1 ELSE 0 END)                   AS bike_count
FROM crashes
WHERE ccd_name IS NOT NULL
GROUP BY 1,2,3,4;

CREATE UNIQUE INDEX mv_grants_ccd_pk ON mv_grants_ccd(state, county, ccd_name, road_type);
