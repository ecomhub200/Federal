/**
 * Delaware end-to-end matrix sweep — SELF-CONTAINED (no local TS imports).
 *
 * Why self-contained: Node 23 + Playwright's TS loader throws
 * "context.conditions?.includes is not a function" on relative `./utils/*.ts`
 * imports. Inlining the helpers sidesteps that so the sweep runs on any Node.
 * The modular specs (01/02) remain the preferred runner on LTS Node.
 *
 * Produces test-results/de-sweep.json (the QA matrix) + screenshots, and
 * asserts the headline invariants:
 *   - state × allRoads dashboard total ≈ 569,829  (catches the 2× doubling)
 *   - every tier × roadType renders a non-zero dashboard total
 *   - no fully-empty Chart.js canvases on the required tabs at county tier
 *
 * Run:
 *   E2E_AUTO_AUTH=1 E2E_EMAIL=.. E2E_PASSWORD=.. \
 *   BASE_URL=https://ecomhub200.github.io/Federal/app/ \
 *   npx playwright test tests/de-sweep.spec.ts --project=chromium
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'node:fs';
import * as path from 'node:path';

const STATE_NAME = 'Delaware';
const STATE_KEY = 'delaware';
const DEFAULT_COUNTY = 'Sussex County';

// Truth table from live Supabase (all-years, the single correct
// road_type=NULL AND is_interstate=NULL row). Used to flag the doubling.
const EXPECTED_STATE_ALLROADS_TOTAL = 569829;
const EXPECTED_STATE_FATAL = 1791;
const EXPECTED_SUSSEX_ALLROADS_TOTAL = 134159;

type Tier = 'state' | 'region' | 'mpo' | 'planning_district' | 'county' | 'city';
type RoadType = 'allRoads' | 'countyOnly' | 'cityOnly' | 'countyPlusVDOT';

const TIERS: Tier[] = ['state', 'region', 'mpo', 'planning_district', 'county', 'city'];
const ROAD_TYPES: RoadType[] = ['allRoads', 'countyOnly', 'cityOnly', 'countyPlusVDOT'];

const TIER_BUTTON: Record<Tier, string> = {
    state: 'State', region: 'Region', mpo: 'MPO',
    planning_district: 'Planning District', county: 'County', city: 'City / Town',
};
const ROAD_RADIO: Record<RoadType, string> = {
    allRoads: 'filterAllRoads', countyOnly: 'filterCountyOnly',
    cityOnly: 'filterCityOnly', countyPlusVDOT: 'filterCountyPlusVDOT',
};
const REQUIRED_TABS = [
    'dashboard', 'map', 'crashtree', 'scorecard', 'safety',
    'fatalspeeding', 'hotspots', 'intersection', 'pedestrian', 'analysis',
];

const results: any = { generatedNote: 'DE e2e sweep', matrix: [], tabs: [], consoleErrors: {} };
const OUT_DIR = path.resolve(__dirname, '..', 'test-results');
const SHOT_DIR = path.join(OUT_DIR, 'de-shots');

async function selectFixture(page: Page, tier: Tier, roadType: RoadType, jurisdiction?: string) {
    await page.evaluate(() => (window as any).showTab?.('upload'));
    await page.waitForTimeout(400);
    const stateSelect = page.locator('#stateSelect');
    if (await stateSelect.count()) {
        await stateSelect.selectOption({ label: STATE_NAME }).catch(() => {});
        await page.waitForTimeout(600);
    }
    await page.getByRole('button', { name: new RegExp('^\\s*' + TIER_BUTTON[tier] + '\\s*$') })
        .first().click().catch(() => {});
    await page.waitForTimeout(500);
    if (jurisdiction && (tier === 'county' || tier === 'city')) {
        for (const sel of ['#countySelect', '#citySelect', '#jurisdictionSelect']) {
            const dd = page.locator(sel);
            if (await dd.count()) { try { await dd.selectOption({ label: jurisdiction }); break; } catch {} }
        }
        await page.waitForTimeout(500);
    }
    await page.locator(`#${ROAD_RADIO[roadType]}`).check({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
    // Aggregate tiers paint from matviews (no sampleRows), so crashState.loaded
    // may never flip — cap the wait so the matrix doesn't stall 25s/cell.
    await page.waitForFunction(() => {
        const w = window as any;
        return w.crashState?.loaded === true || (w.crashState?.totalRows ?? 0) > 0;
    }, { timeout: 8_000 }).catch(() => {});
}

async function readKpi(page: Page, id: string): Promise<number | null> {
    const txt = await page.locator(`#${id}`).textContent().catch(() => null);
    if (!txt) return null;
    const m = txt.replace(/[, ]/g, '').match(/-?\d+/);
    return m ? Number(m[0]) : null;
}

async function scanTab(page: Page) {
    return await page.evaluate(() => {
        const t = (document.querySelector('.tab-content.active') as HTMLElement) ?? document.body;
        const canvases = Array.from(t.querySelectorAll('canvas')) as HTMLCanvasElement[];
        const emptyCanvases: string[] = [];
        for (const c of canvases) {
            try { const u = c.toDataURL('image/png'); if (!u || u.length < 5000) emptyCanvases.push(c.id || '(no-id)'); } catch {}
        }
        const tables = Array.from(t.querySelectorAll('table')) as HTMLTableElement[];
        const zeroRowTables: string[] = []; let populated = 0;
        for (const tb of tables) { const r = tb.querySelectorAll('tbody tr').length; if (r === 0) zeroRowTables.push(tb.id || '(no-id)'); else populated++; }
        return { scrollH: t.scrollHeight, canvasCount: canvases.length, emptyCanvases, zeroRowTables, populatedTables: populated };
    });
}

test.describe('Delaware E2E sweep', () => {
    test.beforeAll(() => { for (const d of [OUT_DIR, SHOT_DIR]) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

    test('tier × road-type dashboard matrix', async ({ page }) => {
        test.setTimeout(8 * 60_000);
        await page.goto('./', { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForTimeout(1500);

        for (const tier of TIERS) {
            for (const rt of ROAD_TYPES) {
                if (tier === 'city' && rt === 'countyOnly') { results.matrix.push({ tier, rt, skipped: 'city has no county_roads bucket' }); continue; }
                await selectFixture(page, tier, rt, tier === 'county' ? DEFAULT_COUNTY : undefined);
                await page.evaluate(() => (window as any).showTab?.('dashboard'));
                await page.waitForTimeout(2200);
                const ctx = await page.evaluate(() => {
                    const w = window as any;
                    return { state: w.crashLensClient?.state ?? w.CL?.data?.client?.state ?? null, tier: w.jurisdictionContext?.viewTier ?? null, juris: w.jurisdictionContext?.jurisdictionName ?? null };
                });
                const total = await readKpi(page, 'kpiTotal');
                const fatal = await readKpi(page, 'kpiFatal');
                results.matrix.push({ tier, rt, ctxTier: ctx.tier, juris: ctx.juris, total, fatal });
            }
        }
        fs.writeFileSync(path.join(OUT_DIR, 'de-sweep.json'), JSON.stringify(results, null, 2));

        // Invariant: state × allRoads must be the true total, NOT 2×.
        const stateAll = results.matrix.find((m: any) => m.tier === 'state' && m.rt === 'allRoads');
        expect(stateAll?.total, 'state allRoads total present').not.toBeNull();
        expect(stateAll!.total).toBeGreaterThan(EXPECTED_STATE_ALLROADS_TOTAL * 0.95);
        expect(stateAll!.total, 'state allRoads must not be doubled')
            .toBeLessThan(EXPECTED_STATE_ALLROADS_TOTAL * 1.20);

        // Every non-skipped cell renders > 0
        for (const cell of results.matrix.filter((m: any) => !m.skipped)) {
            expect(cell.total, `${cell.tier} × ${cell.rt} total > 0`).toBeGreaterThan(0);
        }
    });

    test('per-tab empty-matrix scan @ county / Sussex / allRoads', async ({ page }) => {
        test.setTimeout(6 * 60_000);
        const consoleErrors: string[] = [];
        page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
        page.on('pageerror', e => consoleErrors.push('PAGEERROR: ' + e.message.slice(0, 300)));

        await page.goto('./', { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await page.waitForTimeout(1500);
        await selectFixture(page, 'county', 'allRoads', DEFAULT_COUNTY);

        for (const tab of REQUIRED_TABS) {
            const before = consoleErrors.length;
            await page.evaluate((id) => (window as any).showTab?.(id), tab);
            await page.waitForTimeout(2500);
            // scroll full page to force lazy renders
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await page.waitForTimeout(600);
            await page.evaluate(() => window.scrollTo(0, 0));
            const scan = await scanTab(page);
            await page.screenshot({ path: path.join(SHOT_DIR, `county-${tab}.png`), fullPage: true }).catch(() => {});
            results.tabs.push({ tab, ...scan, newConsoleErrors: consoleErrors.slice(before) });
        }
        results.consoleErrors.county = consoleErrors;
        fs.writeFileSync(path.join(OUT_DIR, 'de-sweep.json'), JSON.stringify(results, null, 2));

        // No fully-empty canvases on required tabs (placeholder helper should
        // have replaced intentionally-empty charts with divs).
        const offenders = results.tabs.filter((t: any) => t.emptyCanvases.length > 0)
            .map((t: any) => `${t.tab}: ${t.emptyCanvases.join(',')}`);
        expect(offenders, 'no empty canvases on required tabs').toEqual([]);
    });
});
