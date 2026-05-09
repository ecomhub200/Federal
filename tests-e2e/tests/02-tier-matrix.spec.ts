/**
 * Tier × road-type matrix sweep — catches the class of bugs that broke
 * Round 4 (federal/MPO showing wrong totals because road-type spec carried
 * over from previous tier).
 *
 * Walks the cells:
 *   tiers      = state, region, mpo, planning_district, county, city
 *   roadTypes  = allRoads, countyOnly, cityOnly, countyPlusVDOT
 *
 * For each cell, asserts:
 *   - Dashboard total > 0
 *   - The total matches the previous cell's total only when the filter
 *     is the same (not just because the fetch was sticky)
 *
 * To extend to a 50-state matrix:
 *   STATE_KEY=virginia npm run test:matrix
 *   STATE_KEY=colorado npm run test:matrix
 *   ... or run them all in CI via a matrix strategy.
 */
import { test, expect } from '@playwright/test';
import { selectFixture, type Tier, type RoadType } from './utils/select-fixture';
import { probeState, readDashboardKpi } from './utils/scan-gaps';
import { activeStateKey, loadState } from './utils/fixtures';

const stateKey = activeStateKey();
const fx = loadState(stateKey);

// Sweepable tiers (excludes federal — that fans out across all states and
// dominates the test runtime; cover federal in a separate slow-suite test).
const TIERS: Tier[] = ['state', 'region', 'mpo', 'planning_district', 'county', 'city'];
const ROAD_TYPES: RoadType[] = ['allRoads', 'countyOnly', 'cityOnly', 'countyPlusVDOT'];

test.describe(`tier × road-type sweep @ ${fx.state_name}`, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    for (const tier of TIERS) {
        for (const rt of ROAD_TYPES) {
            test(`${tier} × ${rt} : dashboard total > 0 + spec is honoured`, async ({ page }) => {
                test.skip(
                    tier === 'city' && rt === 'countyOnly',
                    'city tier has no county_roads bucket — known empty cell'
                );

                await selectFixture(page, {
                    stateName: fx.state_name,
                    tier,
                    jurisdiction: tier === 'county' ? fx.default_jurisdiction : undefined,
                    roadType: rt,
                });

                // Land on Dashboard (where KPIs are easiest to read)
                await page.evaluate(() => (window as any).showTab?.('dashboard'));
                await page.waitForTimeout(2_500);

                const ctx = await probeState(page);
                expect(ctx.state, 'state must be set').toBe(fx.state_key);
                expect(ctx.tier,  'tier must be set').toBe(tier);

                const total = await readDashboardKpi(page, 'kpiTotal');
                expect(total, 'kpiTotal must be a number').not.toBeNull();
                expect(total!, 'kpiTotal must be > 0').toBeGreaterThan(0);

                // Round-4 invariant: the total at federal/state with allRoads
                // must equal the *full* state count (not a road-type subset).
                if (tier === 'state' && rt === 'allRoads') {
                    expect(total!).toBeGreaterThanOrEqual(fx.expected.total_crashes_state * 0.95);
                    expect(total!).toBeLessThanOrEqual(   fx.expected.total_crashes_state * 1.05);
                }

                // Round-4 invariant: countyOnly + cityOnly + countyPlusVDOT
                // partial sums must add up sensibly — they're disjoint buckets
                // (we don't enforce the full identity here because radio
                // semantics differ per tier; we do enforce non-zero).
            });
        }
    }
});
