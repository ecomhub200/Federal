# Safety Focus — Location Detail Panel in Aggregate Mode (findings)

Context: the exported PDF (`docs/CRASH LENS - Crash Analysis Tool.pdf`), taken at
an aggregate tier, showed the Safety Focus → category → location detail panel
with a fake flat Yearly Trend and empty dimensional charts.

## Fixed (PR #280)
- **Fabricated flat Yearly Trend** → replaced the even-distribution synthesis
  with a real `mv_safety_categories_yearly` fetch (real YoY counts; honest empty
  when a category isn't in that matview). See `safety-focus-detail-panel.js`.

## The empty dimensional charts (Collision / Weather / Light / Road-Surface /
## Traffic-Control / DOW / Hour) — per-row lazy-load is NOT viable

We evaluated lazy-loading the selected location's crash rows from the `crashes`
table and computing the breakdowns client-side. **It does not work**, proven
against live data:

1. **Location keys don't reconcile.** `mv_safety_focus_locations` keys locations
   by **segment/node** (finer than `rte_name`). Example — "KOREAN WAR VETERANS
   MEM. HIGHWAY" / category `animal` / segment: matview row `total = 7`, but
   `crashes?rte_name=eq.<name>&animal_related=eq.Yes` = **181**. A selected
   matview location cannot be reconstructed from `crashes` by `rte_name`.
2. **Many locations are "Unknown"** (DE crashes with no road name). The top
   pedestrian segment is `location_name = 'Unknown'`; `crashes?rte_name=eq.Unknown`
   returns 0 — unmatchable.
3. **Some category predicates are thresholds, not flags.** `curves` derives from
   the continuous `curvature` column (1.0 = straight, >1.0 = curved); the exact
   threshold the matview uses isn't in-repo (the migration body is a stub:
   `2026-05-10_round12_mv_safety_focus_locations.sql`).

A self-validating per-row fetch (use breakdowns only if the row count matches the
matview total) would therefore **fall back to empty for essentially every
location** — no value, and a real risk of wrong numbers where it half-matches.

Confirmed category→column predicates (from `2026-06-11_map_viewport_slim_matview.sql`)
for reference: `pedestrian='Yes'`, `bike='Yes'`, `motorcycle='Yes'`,
`alcohol='Yes'` (impaired/alcohol), `speed='Yes'`, `distracted='Yes'`,
`unrestrained='Yes'`, `night='Yes'`, `animal_related='Yes'`,
`guardrail_related='Yes'`, `is_intersection='Yes'`, `school_zone='Yes'`,
`work_zone_related IN ('Yes','1. Yes')`, `weather_condition NOT IN ('1. Clear',
'Clear','Not Provided','')`.

## Correct fix = BACKEND matview (needs DB access; Supabase MCP disconnected)

Build a category × location **dimensional-detail** matview keyed by the **same
segment/node key as `mv_safety_focus_locations`**, mirroring `mv_hotspots_detail`
(which already carries JSONB `by_year/by_month/by_dow/by_hour/by_collision/
by_weather/by_light/by_roadsurface/by_trafficctrl` + factor counts) but
partitioned by Safety Focus `category`. The detail panel then fetches one row per
selected (category, location) and populates every chart from the JSONB — keys
match by construction, so counts reconcile.

Sketch:
```sql
CREATE MATERIALIZED VIEW mv_safety_focus_detail AS
SELECT state, <segment/node location key>, location_type, location_name, category,
       count(*) total,
       jsonb_object_agg(...) by_year,  -- per the existing mv_hotspots_detail pattern
       jsonb_object_agg(...) by_collision, by_weather, by_light, by_roadsurface,
       jsonb_object_agg(...) by_trafficctrl, by_dow, by_hour,
       sum(...) alcohol_count, speed_count, ... night_count
FROM crashes
CROSS JOIN LATERAL (<the 17 category predicates, same as mv_safety_focus_locations>) cat
WHERE <location key not null>
GROUP BY 1, <key>, location_type, location_name, category;
CREATE UNIQUE INDEX ... ; -- for REFRESH CONCURRENTLY
```
Also add the categories missing from `mv_safety_categories_yearly` (curves,
road-departure, etc.) in the same pass so their Yearly Trend fills in too.

Until then, the aggregate-tier detail panel correctly shows real totals /
severity / EPDO / Yearly-Trend (PR #280) and honest-empty dimensional charts.
The full per-location breakdowns work today at **County/City tier** (per-row
`sampleRows`).
