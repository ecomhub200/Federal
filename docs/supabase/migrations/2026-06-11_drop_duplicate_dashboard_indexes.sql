-- 2026-06-11 — Drop redundant dashboard_summary indexes
--
-- get_advisors('performance') flagged duplicate indexes on dashboard_summary.
-- Each DROP below keeps an identical-or-superset index, so query plans are
-- unaffected; the win is faster nightly REFRESH MATERIALIZED VIEW CONCURRENTLY
-- (fewer indexes to rebuild) and less disk/bloat.
--
--   uq_idx            ≡ _uniq                         (identical 12-col UNIQUE)         → keep _uniq
--   mpo_road_idx      ≡ idx_..._tier_mpo              (identical key, no INCLUDE)       → keep tier_mpo
--   pd_road_idx       ≡ idx_..._tier_planning         (identical key)                   → keep tier_planning
--   region_road_idx   ≡ idx_..._tier_district         (identical key)                   → keep tier_district
--   idx_..._tier_county ⊂ county_road_idx             (county_road_idx adds INCLUDE)    → keep covering county_road_idx
--   state_road_idx    ⊂ idx_..._tier_state            (tier_state adds crash_year)      → keep superset tier_state

DROP INDEX IF EXISTS public.dashboard_summary_uq_idx;
DROP INDEX IF EXISTS public.dashboard_summary_mpo_road_idx;
DROP INDEX IF EXISTS public.dashboard_summary_pd_road_idx;
DROP INDEX IF EXISTS public.dashboard_summary_region_road_idx;
DROP INDEX IF EXISTS public.idx_dashboard_summary_tier_county;
DROP INDEX IF EXISTS public.dashboard_summary_state_road_idx;
