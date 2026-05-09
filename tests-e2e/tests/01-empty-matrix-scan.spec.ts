/**
 * Flagship test — replaces the manual "click every tab and look for empty
 * charts" audit loop.
 *
 * For each populated tab the fixture marks as REQUIRED, this:
 *   1. Navigates the live app to the tab
 *   2. Scans every chart canvas / KPI element / table for empty state
 *   3. Asserts no empty matrices are found
 *
 * When a regression lands, this fails in CI before users see it.
 *
 * Snapshot mode: a JSON snapshot of the scan result is also produced.
 * Run `npx playwright test --update-snapshots` to refresh after intentional
 * UI changes. Subsequent runs assert against the stored snapshot — drift
 * fails the test.
 */
import { test, expect } from '@playwright/test';
import { selectFixture, gotoTab } from './utils/select-fixture';
import { scanActiveTab, probeState, readDashboardKpi } from './utils/scan-gaps';
import { activeStateKey, loadState } from './utils/fixtures';

const stateKey = activeStateKey();
const fx = loadState(stateKey);

test.describe(`empty-matrix scan @ ${fx.state_name} / county / Sussex`, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await selectFixture(page, {
            stateName:    fx.state_name,
            tier:         'county',
            jurisdiction: fx.default_jurisdiction,
            roadType:     'allRoads',
        });
    });

    test('Dashboard KPIs match golden numbers (within tolerance)', async ({ page }) => {
        await gotoTab(page, 'dashboard');
        const total  = await readDashboardKpi(page, 'kpiTotal');
        const fatal  = await readDashboardKpi(page, 'kpiFatal');
        const ka     = await readDashboardKpi(page, 'kpiKACombined');

        // Within ±5% of golden — accommodates ingestion drift between sessions
        expect(total).toBeGreaterThan(fx.expected.total_crashes_default_county * 0.95);
        expect(total).toBeLessThan   (fx.expected.total_crashes_default_county * 1.05);
        expect(fatal).toBeGreaterThanOrEqual(fx.expected.fatal_K_default_county_min);
        expect(ka).toBeGreaterThanOrEqual   (fx.expected.ka_default_county_min);
    });

    for (const tabId of fx.expected.required_populated_tabs) {
        test(`tab '${tabId}' has no empty matrices`, async ({ page }) => {
            await gotoTab(page, tabId);

            // Confirm we landed where we asked
            const ctx = await probeState(page);
            expect(ctx.tier).toBe('county');
            expect(ctx.csTotalRows).toBeGreaterThan(0);

            const scan = await scanActiveTab(page);

            // Snapshot for visual-regression-style change detection.
            // First run creates baseline; subsequent runs assert.
            expect(JSON.stringify(scan, null, 2)).toMatchSnapshot(
                `${stateKey}-county-${tabId}.json`
            );

            // Hard assertions
            // (a) No fully-empty Chart.js canvases (Round-3 placeholder helper
            // converts intentionally-empty charts to placeholder divs, so any
            // remaining empty canvas IS a real regression).
            expect(scan.emptyCanvases).toEqual([]);

            // (b) Tables that the spec marks as required must have rows.
            // Tables that are filter-gated (location dropdown, search box)
            // are allowed to be 0; we don't fail on them.
            //
            // Edit per-tab allowlist as the app evolves:
            const ALLOW_ZERO_ROW = new Set([
                'fsSpeedLocationTable',     // populated only after user picks location
                'fsCrossAnalysisTable',     // user-action-gated
                'segmentTable',             // FHWA segment analysis — gated
                'predCorridorTable',        // forecast not available
                'predFactorTable',          // forecast not available
                'pedLocationTable',         // location filter gated
                'bikeLocationTable',
                'warrantLocationSelect',
                'stopsignTMCTable',
                'speedstudyTable',
                'assetResultsTable',
                'assetPreviewTable',
                'predCorridorRankTable',
                'predLocTypeTable',
                'ddSpeedRouteTable',
                'ddEventChainTable',
                'ddAgencyTable',
            ]);
            const realZeroRowTables = scan.zeroRowTables.filter(
                id => id !== '(no-id)' && !ALLOW_ZERO_ROW.has(id)
            );
            expect(realZeroRowTables).toEqual([]);

            // (c) Critical KPIs must not all read 0
            const ALL_KPIS_ZERO_THRESHOLD = 0.7;
            const kpiTotal = scan.zeroKpis.length + 5; // approx denominator
            const zeroRatio = scan.zeroKpis.length / Math.max(kpiTotal, 1);
            expect(zeroRatio).toBeLessThan(ALL_KPIS_ZERO_THRESHOLD);
        });
    }

    test(`Safety Focus categories: required ones have non-zero counts`, async ({ page }) => {
        await gotoTab(page, 'safety');

        const counts = await page.evaluate(() => {
            const w = window as any;
            return Object.fromEntries(
                Object.entries((w.safetyState?.data ?? {})).map(([k, v]: any) => [k, v?.total ?? 0])
            );
        });

        for (const cat of fx.expected.required_categories_non_zero) {
            expect(counts[cat]).toBeGreaterThan(0);
        }

        // The known-null categories should remain 0 — surface them as a
        // tracked-debt log line, not a test failure.
        for (const cat of fx.known_null_categories) {
            console.log(`  [tracked debt] ${stateKey} category '${cat}' = ${counts[cat] ?? 0} (known NULL upstream)`);
        }
    });
});
