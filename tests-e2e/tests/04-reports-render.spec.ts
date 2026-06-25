/**
 * Reports render regression test — runs WITHOUT Firebase auth by stubbing the
 * login gate (isFirebaseConfigured=false) and hitting the real Supabase data
 * layer (anon key baked into data-client.js). Run via the standalone repro
 * config, against local OR the deployed app:
 *
 *   # deployed (default if you point BASE_URL there):
 *   BASE_URL=https://ecomhub200.github.io/Federal/app/ npx playwright test -c playwright.repro.config.ts tests/04-reports-render.spec.ts
 *   # local (serve repo root: `python -m http.server 8099`):
 *   BASE_URL=http://127.0.0.1:8099/app/ npx playwright test -c playwright.repro.config.ts tests/04-reports-render.spec.ts
 *
 * Why this exists: the Fatal & Speed report came up blank in production because
 * generateFatalSpeedReport was extracted into a module but never dual-exposed
 * on window, so the dispatcher's bare call threw "is not defined". This test
 * generates every Standard Report and FAILS on that exact signature, so an
 * unexported generator can never silently ship again.
 */
import { test, expect, Page } from '@playwright/test';

test.use({ storageState: undefined });

// Reports that require per-row data and intentionally render a gap-state at
// aggregate (county→planning_district) tiers — not expected to fully populate.
const GAP_STATE_OK = new Set(['crashtree']);

const REPORTS = [
    { value: 'dashboard',   needs: null },
    { value: 'corridor',    needs: 'route' },
    { value: 'crashtree',   needs: null },
    { value: 'safetyfocus', needs: null },
    { value: 'fatalspeed',  needs: null },
    { value: 'hotspot',     needs: null },
    { value: 'intersection',needs: 'routenode' },
    { value: 'pedbike',     needs: null },
];

async function selectFixture(page: Page) {
    await page.evaluate(() => (window as any).showTab?.('upload'));
    await page.waitForTimeout(500);
    await page.locator('#stateSelect').selectOption({ label: 'Delaware (DE)' }).catch(() => {});
    await page.waitForTimeout(800);
    await page.getByRole('button', { name: /^\s*County\s*$/ }).first().click().catch(() => {});
    await page.waitForTimeout(500);
    for (const sel of ['#countySelect', '#citySelect', '#jurisdictionSelect']) {
        const dd = page.locator(sel);
        if (await dd.count()) { try { await dd.selectOption({ index: 1 }); break; } catch {} }
    }
    await page.waitForTimeout(500);
    await page.locator('#filterAllRoads').check({ force: true }).catch(() => {});
    await page.waitForFunction(() => {
        const w = window as any; return w.crashState?.loaded === true && w.crashState?.totalRows > 0;
    }, { timeout: 30000 }).catch(() => {});
}

test('every Standard Report generates without an "is not defined" error', async ({ page }) => {
    const dialogs: string[] = [];
    page.on('dialog', d => { dialogs.push(d.message()); d.dismiss().catch(() => {}); });

    await page.route('**/firebasejs/**', r => r.abort());
    await page.route('**/firebase-config.js*', r =>
        r.fulfill({ contentType: 'application/javascript', body: 'window.isFirebaseConfigured=false;' }));

    await page.goto('./', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(4000);
    await selectFixture(page);
    expect(await page.evaluate(() => (window as any).crashState?.totalRows ?? 0), 'fixture failed to load data').toBeGreaterThan(0);

    const failures: string[] = [];
    for (const rep of REPORTS) {
        dialogs.length = 0;
        await page.evaluate(async ({ value, needs }) => {
            const w = window as any;
            w.showTab?.('reports');
            await new Promise(r => setTimeout(r, 400));
            const sel = document.getElementById('reportType') as HTMLSelectElement;
            sel.value = value; w.updateReportOptions?.();
            await new Promise(r => setTimeout(r, 700));
            if (needs === 'route' || needs === 'routenode') {
                const route = document.getElementById('reportRoute') as HTMLSelectElement;
                const o = route ? Array.from(route.options).map(x => x.value).filter(Boolean) : [];
                if (route && o.length) { route.value = o[0]; route.dispatchEvent(new Event('change', { bubbles: true })); }
            }
            if (needs === 'routenode') {
                const node = document.getElementById('reportNode') as HTMLSelectElement;
                const n = node ? Array.from(node.options).map(x => x.value).filter(Boolean) : [];
                if (node && n.length) { node.value = n[0]; node.dispatchEvent(new Event('change', { bubbles: true })); }
            }
            try { await w.generateReport?.(); } catch {}
        }, rep);
        await page.waitForTimeout(5000);

        const body = await page.evaluate(() => {
            const out = document.getElementById('reportOutput');
            return { text: out ? (out.innerText || '').trim().length : 0 };
        });

        // (1) The extraction-break signature must never appear.
        const defErr = dialogs.find(d => /is not defined|Error generating report/i.test(d));
        if (defErr) failures.push(`${rep.value}: ERROR dialog "${defErr}"`);
        // (2) Non-gap-state reports must render a real body.
        else if (!GAP_STATE_OK.has(rep.value) && body.text < 400)
            failures.push(`${rep.value}: body too short (${body.text} chars) — likely blank`);
    }

    expect(failures, `Report regressions:\n${failures.join('\n')}`).toEqual([]);
});
