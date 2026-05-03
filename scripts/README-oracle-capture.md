# Phase 1 oracle capture — runner reference

Three equivalent runners are provided. Try them in this order; each later one is the fallback for the previous one.

## 1. Node 18+ (preferred — runs in CC's sandbox)

```
node scripts/capture-oracle.mjs
node scripts/capture-oracle.mjs --verbose
node scripts/capture-oracle.mjs --state=delaware --dry
```

Reads the anon key from `assets/js/data-client.js`, paginates each query (limit=10000), runs five schema invariants, writes `tests/oracle-captured-<YYYY-MM-DD>.{md,json}`. Exits non-zero if a blocking invariant fails — Phase 2 must not start until this exits 0.

**If you see HTTP 403** the issue is sandbox egress, not auth. The script tells you which. Switch to runner 2 or ask the operator to allow `srv1503081.hstgr.cloud` from CC's egress list.

## 2. Python 3.10+ stdlib only

```
python scripts/capture_oracle.py
python scripts/capture_oracle.py --state delaware --verbose
```

Identical behavior to the Node version, written entirely against `urllib`/`json`/`re`. Use this if Node isn't available in the sandbox.

## 3. Browser console (manual fallback for the operator)

If both Node and Python fail (egress is locked down), the operator pastes `scripts/capture-oracle-browser.js` into DevTools while https://ecomhub200.github.io/Federal/app/ is open. The app already has the anon key on `window.crashLensClient.supabaseKey` and is allowlisted to talk to the matview. The script prints the markdown table to the console and copies the JSON to the clipboard. Operator pastes both into the PR / chat. CC then writes the same content to `tests/oracle-captured-<date>.{md,json}`.

## What CC does with the captured oracle

Every Phase-2 acceptance test references query IDs (`q15`, `q22`, etc.), not raw numbers. After capture, open `tests/oracle-captured-<date>.json` and resolve each `qN` to its `.sum` or `.distinct` value when writing acceptance assertions.

If the captured numbers disagree with the older prompt's pasted oracle, **the captured numbers win** — the prompt may have been written hours or days ago and the matview may have refreshed.

## Hard invariants

Every runner asserts the same five invariants. Four are blocking (failure = stop, do not proceed):

| ID | Invariant | Blocking? |
|---|---|---|
| I1 | `road_type ∈ {city_roads, county_roads, dot_roads, other_roads}` | yes |
| I2 | `q03 + q04 + q05 + q06 == q02` (road_type partition sums to state) | yes |
| I3 | `q08 + q09 == q02` (is_interstate partition sums to state) | yes |
| I4 | `q14 + q15 + q16 == q02` (planning_district partition sums to state) | yes |
| I5 | `q15 > q27` (Kent rollup target larger than unincorp Kent — proves rollup is needed) | advisory |

If any blocking invariant fails, the matview schema has shifted. Stop, paste the failure, and ask for guidance before writing code.
