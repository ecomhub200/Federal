/**
 * Visual-regression test. Takes a screenshot of every required tab at the
 * default fixture, diffs against a stored snapshot, fails if pixel diff
 * exceeds the threshold.
 *
 * First run captures the baseline. Subsequent runs assert.
 *
 *   npm run test:visual               # update missing snapshots
 *   npx playwright test 03-visual --update-snapshots
 *
 * Catches "this chart used to render and now doesn't" without you having
 * to write per-element assertions.
 */
import { test, expect } from '@playwright/test';
import { selectFixture, gotoTab } from './utils/select-fixture';
import { activeStateKey, loadState } from './utils/fixtures';

const fx = loadState(activeStateKey());

test.describe(`visual regression @ ${fx.state_name} / county`, () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('./');
        await selectFixture(page, {
            stateName:    fx.state_name,
            tier:         'county',
            jurisdiction: fx.default_jurisdiction,
            roadType:     'allRoads',
        });
    });

    for (const tabId of fx.expected.required_populated_tabs) {
        test(`${tabId} screenshot`, async ({ page }) => {
            await gotoTab(page, tabId);
            // Allow Chart.js animations to settle
            await page.waitForTimeout(1_500);

            // Mask elements known to vary between runs (date inputs,
            // current-time displays, etc.)
            const tab = page.locator(`#tab-${tabId}`);
            await expect(tab).toHaveScreenshot(`${activeStateKey()}-${tabId}.png`, {
                maxDiffPixelRatio: 0.02, // 2% pixel-diff tolerance
                animations: 'disabled',
                mask: [
                    page.locator('input[type="date"]'),
                    page.locator('.timestamp, [data-timestamp]'),
                ],
            });
        });
    }
});
