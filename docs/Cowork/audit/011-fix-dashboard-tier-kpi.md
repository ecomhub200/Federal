# CC 011 — [P1] Fix Dashboard KPI ignoring tier selector

**From:** Chrome Claude audit 2026-05-20. **Severity:** P1 regression (cascading impact).

**Branch:** `claude/fix-dashboard-tier-kpi`. **No PR.**

## The bug

On Dashboard tab, all 7 tiers (Federal / State / Region / MPO / Planning District / County / City) show **identical KPIs** — always 569,829 total crashes (the Delaware-statewide value).

Expected: KPIs should change with tier:
- Federal → all US crashes (multi-state)
- State → Delaware (~569K)
- County → Sussex County (~134K)
- City → city-only subset

The Map tab tier switching works correctly. The Dashboard KPI fetch is the bug.

## §0 Pre-flight (MANDATORY — per CLAUDE.md Policy 1)

```bash
# Read the map FIRST — find the Dashboard tab section + KPI rendering functions
sed -n '/^### Dashboard/,/^###/p' app/CODE_MAP.md | head -80

# Find the KPI fetcher
grep -rn "fetchDashboardSummary\|fetchDashboardKPIs\|loadDashboardData\|getDashboardSummary\|dashboardKpi" app/modules/dashboard/ app/index.html | head -20

# Find tier-aware calls in the codebase for reference (Map tab works — model after it)
grep -rn "currentTier\|geoTier\|getCurrentTier\|tierState" app/modules/dashboard/ app/modules/map/ | head -20

# Find the matview/RPC the dashboard hits
grep -rn "mv_dashboard\|getDashboardSummary\|rpc/dashboard" app/modules/ app/index.html | head -10
```

**ABORT if:** you can't locate the Dashboard KPI fetcher in either modules or inline. Tell Murad and stop.

## Fix approach

Compare how Map tab fetches data (works) vs Dashboard KPI fetcher (broken).

Likely root causes:
1. **Dashboard fetcher hardcodes `state=eq.delaware` and ignores tier** → add tier-aware filter
2. **Dashboard fetcher doesn't pass `currentTier` / `currentJurisdiction` to the matview RPC** → wire up the filter param
3. **Dashboard fetcher subscribes to tier-change events incorrectly** → re-bind subscription

For the **Federal tier specifically:** when `tier === 'federal'`, the query must NOT add a `state=eq.X` filter. Either:
- Call a different RPC like `get_federal_summary` (if it exists)
- Or modify the query to omit state filter when federal

Look for similar pattern in `core/tier.js` or `data/supabase-bridge.js`.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** the Dashboard KPI fetcher is likely already extracted (`dashboard/dashboard-tab-matview.js` or `dashboard/dashboard-tab-kpi.js`). If you're touching a function >100 LOC that's still inline, extract it. Otherwise just fix in place.
- **Policy 3 (Update map):** if any function locations shift, update `app/CODE_MAP.md` rows.

## §5 Post-flight

```bash
node --check app/modules/dashboard/dashboard-tab-kpi.js   # or whichever file you touched
git diff --stat
```

## §6 Smoke (CRITICAL — verify all 7 tiers)

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix011

For each tier in [Federal, State, Region, MPO, Planning District, County, City]:
  1. Click the tier button
  2. Wait 3-5 seconds
  3. Read the Total Crashes KPI

Expected sanity rules:
  - Federal ≥ State (since Federal aggregates all states)
  - State ≥ Region ≥ County ≥ City (each scope is narrower)
  - County (Sussex) should be ~134,000
  - State (Delaware) should be ~569,000
  - Federal should be SIGNIFICANTLY higher than State (millions)

If Federal === State, the federal-specific case wasn't fixed.
```

Take a screenshot of EACH tier showing different KPIs. Console: NO new errors.

## Commit + push

```bash
git add app/modules/dashboard/ app/index.html app/CODE_MAP.md
git commit -m "fix(dashboard): KPI fetcher respects tier selector [P1]

Was: all 7 tiers showed 569,829 (state-wide Delaware count) regardless of tier.
Now: KPIs cascade Federal ≥ State ≥ County ≥ City.
Federal tier omits state filter to aggregate multi-state data."
git push -u origin claude/fix-dashboard-tier-kpi
```

## Final report

```
CC 011 complete (Dashboard tier KPI).
Root cause: <e.g., 'fetchDashboardSummary hardcoded state=delaware'>
Fix: <one line>
Tier sweep: Federal X, State Y, County Z (all different now)
Smoke: 0 console errors
Branch pushed; no PR.
```
