# Crash Lens — E2E Test Suite

This replaces the manual audit loop ("click every tab → look for empty
charts → file a bug → fix → re-audit"). Every check the audit runs is now
a Playwright test that runs in CI.

---

## Quick start

```bash
# 1. First time setup
cd "Federal-main (11)/Federal-main/tests-e2e"
npm install
npm run install:browsers

# 2. Sign in once — Playwright captures auth state for re-use
npm run auth
# Sign in manually in the browser window that pops up.
# Test detects success and saves state to playwright/.auth/user.json.

# 3. Run the suite
npm test                 # all tests
npm run test:scan        # 01 — empty matrix scanner only (fastest)
npm run test:matrix      # 02 — tier × road-type sweep (slowest)
npm run test:visual      # 03 — screenshot diff
npm run test:headed      # watch the browser
npm run test:ui          # Playwright UI mode (great for debugging)
npm run report           # open HTML report after a run
```

---

## What's covered

### 01 — Empty matrix scanner (`tests/01-empty-matrix-scan.spec.ts`)

Walks every required tab at the default fixture (Sussex County / Delaware /
county tier / All Roads No Interstate) and asserts:

- No empty Chart.js canvases (the round-3 placeholder helper means a
  *real* empty canvas is always a regression).
- No 0-row tables on tabs that should have data (filter-gated tables are
  allowlisted).
- Critical KPIs aren't 0.
- Required Safety Focus categories have non-zero counts.
- `young / senior / lgtruck / drowsy / hitrun` log as "tracked debt"
  rather than failing — they're upstream-pipeline NULLs.

This is the test that would have caught Round 1 (Dashboard 9 KPIs at 0)
and Round 3 (Ped/Bike all KPIs at 0, F&S 8 empty charts) automatically
on the PR that introduced them.

### 02 — Tier × road-type sweep (`tests/02-tier-matrix.spec.ts`)

For 6 tiers × 4 road-types = 24 cells, asserts the dashboard total > 0
and matches the golden number for the (state, tier, roadtype) combination.
This catches the Round 4 bug class:

- Federal showing 438,501 instead of 569,829 (stale `road_type=dot_roads`
  filter carrying over from previous tier)
- MPO Wilmington showing 17,546 (= WAPC + county_roads stuck filter)

### 03 — Visual regression (`tests/03-visual-regression.spec.ts`)

Pixel-diff snapshots of every tab. Detects "this chart used to render and
now doesn't" without per-element assertions. Tolerance: 2% pixel diff
to allow font-rendering jitter.

---

## Adding a new state

1. Run a one-time spot-check at the new state in your browser to confirm
   the state's `crashes_<state>` table is populated and matviews are
   refreshed.
2. Add a fixture entry to `fixtures/states.yaml`:
   ```yaml
   virginia:
       state_key: virginia
       state_name: Virginia
       state_fips: '51'
       default_jurisdiction: Fairfax County
       counties: [Fairfax County, Loudoun County, ...]
       expected:
           total_crashes_state: 8500000
           total_crashes_default_county: 280000
           # ... etc
       known_null_categories: [drowsy]   # state-specific NULL columns
   ```
3. Run `STATE_KEY=virginia npm test`. Suite auto-extends.
4. Commit fixture + any new snapshot baselines.

In CI, run a matrix strategy:

```yaml
# .github/workflows/e2e.yml
strategy:
    matrix:
        state: [delaware, virginia, colorado, ...]  # 50 states
        shard: [1, 2, 3, 4]
steps:
    - run: STATE_KEY=${{ matrix.state }} npx playwright test --shard=${{ matrix.shard }}/4
```

---

## Failure triage

| Failure | Likely cause | Where to look |
|---|---|---|
| `kpiTotal expected > 0, got 0` | Backend matview returned no rows for this (state, tier, value) | `mv_analysis_summary` / `dashboard_summary` — query directly via Supabase MCP |
| `realZeroRowTables` includes `regionComparisonTable` | Dashboard comparison wiring regressed | `app/index.html updateDashboardTierSections` |
| `emptyCanvases` includes `chartFSFatalCollision` | F&S chart helper not painting | `app/index.html paintFSFatalCollisionChart` |
| Snapshot diff > 2% | UI element moved or re-styled | review HTML report screenshot, decide if intentional → update snapshot |
| Tier × road-type cell wrong total | Round-4-style stale filter regression | `app/modules/data/supabase-bridge.js injectFastDashboard` |

---

## CI integration

Add to `.github/workflows/e2e.yml`:

```yaml
name: E2E
on:
    pull_request:
    push:
        branches: [main]
jobs:
    test:
        runs-on: ubuntu-latest
        timeout-minutes: 30
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with: { node-version: '20' }
            - run: cd "Federal-main (11)/Federal-main/tests-e2e" && npm ci
            - run: cd "Federal-main (11)/Federal-main/tests-e2e" && npx playwright install --with-deps chromium
            - name: Run E2E
              env:
                  BASE_URL: https://ecomhub200.github.io/Federal/app/
                  PLAYWRIGHT_AUTH_USER: ${{ secrets.E2E_USER }}
                  PLAYWRIGHT_AUTH_PASS: ${{ secrets.E2E_PASS }}
              run: cd "Federal-main (11)/Federal-main/tests-e2e" && npm test
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: playwright-report
                  path: Federal-main*/Federal-main/tests-e2e/playwright-report/
```

For CI, you'll need to automate the auth step via env-var credentials in
`auth.setup.ts` (currently it expects manual login). Replace the
`waitForFunction` with explicit form fills using `process.env.PLAYWRIGHT_AUTH_USER`
and `PLAYWRIGHT_AUTH_PASS` from GitHub secrets.

---

## What this replaces in the manual audit

| Manual step (Round 1-5) | Automated by |
|---|---|
| "Click every tab; check for empty charts" | `01-empty-matrix-scan.spec.ts` |
| "Switch View Level radios; verify totals match" | `02-tier-matrix.spec.ts` |
| "Compare KPIs visually before/after a fix" | `03-visual-regression.spec.ts` |
| "Re-audit after every CC merge" | CI runs the full suite on every PR |
| "Re-discover that `young/senior/lgtruck` are NULL" | Logged once per state in fixtures, never re-discovered |

After this suite is green, the audit cycle becomes:

1. CC opens a PR with a fix.
2. CI runs all tests in 5-10 minutes.
3. ✅ green = merge. ❌ red = exact failing test points to the file/function.
4. No human-driven sweep needed unless a brand-new tab is added.

That's how you go from 5 audit rounds per fix to "audit is the CI run".
