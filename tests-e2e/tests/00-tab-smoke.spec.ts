/**
 * Tab smoke test — the single highest-value guard against "a bug fix broke a tab".
 *
 * Loads the app ONCE on the default fixture, then visits every tab and fails if
 * that tab produced a console error or an uncaught page error. A broken tab in
 * this app almost always shows up as a JS error thrown during showTab() (a
 * ReferenceError from a missing global, a TypeError from a renamed/overwritten
 * function, a syntax error in a touched module). This catches all of those in
 * one fast run — no need to eyeball every tab by hand.
 *
 * Run after EVERY bug fix:
 *   npm run test:smoke                 # against deployed app (default BASE_URL)
 *   BASE_URL=http://localhost:8000/app/ npm run test:smoke   # against local
 *
 * This is intentionally narrow: it does NOT assert data correctness (that's
 * 01-empty-matrix-scan's job). It only asserts "every tab loads without
 * throwing". Keep it that way so it stays fast and rarely flaky.
 */
import { test, expect } from '@playwright/test';
import { selectFixture, gotoTab } from './utils/select-fixture';
import { activeStateKey, loadState } from './utils/fixtures';

const fx = loadState(activeStateKey());

// Every tab id that showTab() accepts. Keep in sync with the sidebar nav in
// app/index.html / app/modules/app/tab-dispatcher.js. Adding a new tab? Add it
// here so the smoke test covers it.
const ALL_TABS = [
    'upload',
    'dashboard',
    'map',
    'analysis',
    'intersection',
    'pedestrian',
    'hotspots',
    'cmf',
    'warrants',
    'reports',
    'grants',
    'ai',
    'domain-knowledge',
    'safety',
    'fatalspeeding',
    'crashtree',
    'scorecard',
    'inventory-manager',
    'traffic-inventory',
];

// Console error substrings that are known-benign noise (third-party widgets,
// expected network 4xx on gated features, etc.). Add to this list ONLY with a
// reason — every entry here is a place a real regression could hide.
const IGNORE = [
    'favicon',                       // missing favicon is cosmetic
    'net::ERR_',                     // transient network blips against tiles/CDN
    'Failed to load resource',       // covered by net::ERR_ / 4xx on gated data
    'mapbox',                        // map tile auth noise when token is rate-limited
    'ResizeObserver loop',           // benign Chrome warning
];

const isReal = (msg: string) => !IGNORE.some(sub => msg.toLowerCase().includes(sub.toLowerCase()));

test.describe(`tab smoke @ ${fx.state_name} / county / ${fx.default_jurisdiction}`, () => {
    // Collected across the whole describe: { tabId -> [error messages] }
    const errorsByTab: Record<string, string[]> = {};
    let currentTab = 'load';

    test.beforeAll(() => {
        for (const t of ALL_TABS) errorsByTab[t] = [];
        errorsByTab['load'] = [];
    });

    test.beforeEach(async ({ page }) => {
        // Attribute every console.error / pageerror to whichever tab is active.
        page.on('console', (m) => {
            if (m.type() === 'error' && isReal(m.text())) {
                (errorsByTab[currentTab] ??= []).push(m.text());
            }
        });
        page.on('pageerror', (err) => {
            const msg = `${err.name}: ${err.message}`;
            if (isReal(msg)) (errorsByTab[currentTab] ??= []).push(msg);
        });

        currentTab = 'load';
        await page.goto('./');
        await selectFixture(page, {
            stateName:    fx.state_name,
            tier:         'county',
            jurisdiction: fx.default_jurisdiction,
            roadType:     'allRoads',
        });
    });

    test('no console/page errors on initial load', () => {
        expect(errorsByTab['load'], errorsByTab['load'].join('\n')).toEqual([]);
    });

    for (const tabId of ALL_TABS) {
        test(`tab '${tabId}' loads without errors and renders`, async ({ page }) => {
            currentTab = tabId;
            await gotoTab(page, tabId);

            // 1. The tab actually became the active panel and has content.
            const active = await page.evaluate((id) => {
                const el = document.getElementById(`tab-${id}`);
                return {
                    exists:  !!el,
                    active:  !!el?.classList.contains('active'),
                    hasHtml: (el?.innerHTML?.trim().length ?? 0) > 0,
                };
            }, tabId);

            expect(active.exists, `#tab-${tabId} element missing`).toBe(true);
            expect(active.active, `#tab-${tabId} did not become active`).toBe(true);
            expect(active.hasHtml, `#tab-${tabId} rendered empty`).toBe(true);

            // 2. No real console/page errors fired while this tab initialized.
            const errs = errorsByTab[tabId] ?? [];
            expect(errs, `Errors on tab '${tabId}':\n${errs.join('\n')}`).toEqual([]);
        });
    }
});
