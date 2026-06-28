# Map Tab — Accuracy & Performance Findings (Delaware)

Backend: self-hosted Supabase `srv1503081.hstgr.cloud`. Verified via the live
`map_viewport_crashes` RPC + REST against `mv_map_crashes`.

## ✅ Accuracy — correct
The map renders from the `map_viewport_crashes` RPC (bbox + zoom → clusters at
low zoom, individual points at high zoom). Cluster counts are **exact**:

| Zoom | rows | clusters | `sum(n)` | vs raw DE (569,829) |
|---|---|---|---|---|
| 8  | 258  | 258  | **569,828** | ✅ (−1, the `crash_year=0`/null-geom row) |
| 11 | 1,352 | 1,352 | **569,828** | ✅ |
| 14 | 5,000 | 0 (points) | 5,000 | capped at `p_limit` |

So at any cluster zoom the map represents **every** crash — no accuracy gap.

## ⚠️ Performance — not "instant" (~2.5 s per viewport)
Measured RPC latency is **~2.3–2.9 s on essentially every pan/zoom**, and it is
**constant regardless of viewport size** (whole-state bbox 2.24 s ≈ a 2 km
Wilmington bbox 2.88 s). Repeat calls aren't server-cached (2.24 s → 2.38 s).

Root cause (confirmed by the migration's own header comment,
`docs/supabase/migrations/2026-06-11_map_viewport_slim_matview.sql`):
> "At low zoom the whole-state bbox makes the GiST index non-selective, so
> Postgres parallel-seq-scans all 569k rows … " 

- **State/region/federal view:** the bbox covers ~everything, so the GiST geom
  index can't prune → it **seq-scans + `ST_SnapToGrid`-clusters all 569 k rows**
  every call. The slim matview already makes this scan cheaper, but it's still
  O(n) compute per request.
- **Zoomed-in view:** *should* be index-pruned and fast, but a 2 km viewport
  still measured ~2.9 s — needs `EXPLAIN ANALYZE` to confirm the GiST index is
  actually chosen for the dynamic `geom && %L` (could be a SRID/plan issue).

## Recommended fixes (backend — need DB access to apply; MCP currently down)

1. **Confirm the geom index is present and used** (the constant-time behaviour
   suggests it is NOT pruning zoomed-in views):
   ```sql
   -- present?
   SELECT indexname, indexdef FROM pg_indexes
   WHERE tablename = 'mv_map_crashes';
   -- used? (zoomed-in bbox should be an Index Scan, not Seq Scan)
   EXPLAIN ANALYZE
   SELECT * FROM mv_map_crashes
   WHERE geom && ST_SetSRID(ST_MakeEnvelope(-75.56,39.73,-75.53,39.76),4326)
     AND state='delaware' LIMIT 5000;
   ```
   If it shows `Seq Scan`, the geom SRID likely ≠ 4326 (the RPC builds an
   SRID-4326 bbox). Align it and rebuild the index:
   ```sql
   -- if geom SRID is 0/mismatched:
   UPDATE ... or recreate the matview with ST_SetSRID(geom,4326);
   REINDEX INDEX mv_map_crashes_geom_idx;  -- or CREATE INDEX ... USING gist(geom)
   ```

2. **Make the overview instant — pre-cluster, don't compute live.** Materialise
   the low-zoom clusters (state/region) once per refresh instead of running
   `ST_SnapToGrid` on 569 k rows per request:
   ```sql
   CREATE MATERIALIZED VIEW mv_map_clusters AS
   SELECT state, z, ST_SnapToGrid(geom, g)::... AS cell,
          count(*) n, sum(... fatals ...) ...
   FROM mv_map_crashes,
        LATERAL (VALUES (8,0.05),(10,0.02),(11,0.01),(12,0.005)) AS zg(z,g)
   GROUP BY state, z, cell;
   CREATE INDEX ON mv_map_clusters USING gist(cell);
   ```
   The RPC then returns a cheap indexed read at low zoom and falls back to the
   live `geom &&` point query only at street zoom (small bbox → naturally fast).

## Frontend mitigation (no backend change) — make it *feel* instant
The app already caches per-marker points in IndexedDB
(`map-points-hydrate.js` → `_readMapPointsCache`), but the **map tab renders via
the live RPC and never paints that cache first**. Paint the cached
view immediately on tab open (or a low-zoom client-side cluster from the cached
points) while the RPC refines in the background — the user sees data in <100 ms
on repeat visits instead of waiting ~2.5 s.

## Status
- Accuracy: verified correct, no change needed.
- Performance: diagnosed; backend remediation (index/SRID check + pre-cluster
  matview) requires DB access (Supabase MCP disconnected this session) and is
  a production change — provided as verifiable SQL above for review/apply.

---

## ⚠️ Gap D — `mv_map_points.road_type` diverges from the canonical buckets

The aggregate-tier map (`map_viewport_crashes` RPC over `mv_map_crashes`) and the
dashboard (`dashboard_summary`) both derive `road_type` from **`crashes.ownership`**
(`1. State Hwy Agency → dot_roads`, `2. County Hwy Agency → county_roads`,
`3. City or Town Hwy Agency → city_roads`, else `other_roads`) with `is_interstate`
as a separate boolean. **`mv_map_points` does NOT** — it uses a different scheme.

Verified live against `srv1503081.hstgr.cloud` REST (Delaware):

| road_type bucket | `dashboard_summary` (ownership, all 569,829) | `mv_map_points` (geocoded, 560,234) |
|---|---|---|
| dot_roads     | 438,501 | 266,823 |
| city_roads    | 81,315  | 31,525  |
| county_roads  | 39,885  | **0 (bucket absent)** |
| other(_roads) | 10,128  | 235,262 |
| interstate (separate bucket, only in mv_map_points) | — (folded into `is_interstate`) | 26,624 |

So `mv_map_points` has **no `county_roads` bucket**, splits `interstate` into its own
bucket, and dumps ~42% of crashes into `other`. It is clearly derived from a
different column (likely `system`/`functional_class`), not `ownership`.

### Impact
- **Aggregate-tier map: NOT affected** — it renders from the ownership-based RPC,
  which matches the dashboard.
- **Latent client-side filter bug** (`app/index.html` `getFilteredMapPoints()`):
  the road-type guard does `if (roadTypeSel==='countyOnly' && p.road_type!=='county_roads') return false;`.
  Because `mv_map_points` never carries `county_roads`, this branch is
  **unsatisfiable** — any path that renders mv_map_points-hydrated points while
  "County Roads Only" is selected would show an **empty map**. In practice place
  tiers load pre-filtered `{state}/{county}/{road_type}.parquet` R2 files (the
  filter is skipped when `p.road_type === undefined`), so exposure is conditional
  on the mv_map_points hydration/fallback path — but the mismatch is real.

### Recommended fix (backend matview migration — scoped follow-up, NOT applied here)
Rebuild `mv_map_points.road_type` to use the **same ownership-based CASE** as
`mv_map_crashes` / `dashboard_summary`, add the `county_roads` bucket, and fold
interstate into the existing `is_interstate` flag (drop the `interstate`
road_type bucket). This is a production matview change with broad blast radius
(every `mv_map_points` consumer: map point hydration + hotspots/analysis/
intersection/pedestrian/warrants/CMF/assets) and needs a `REFRESH MATERIALIZED
VIEW` + per-consumer validation, so it is deliberately left as its own scoped
task rather than bundled into the surgical map-tab UI fixes (Gaps A/B/C).
