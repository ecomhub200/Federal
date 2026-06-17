import { test as setup, expect } from '@playwright/test';
import * as path from 'node:path';

/**
 * One-time auth setup. Runs in headed mode so YOU sign in manually,
 * then Playwright captures the cookies / localStorage / sessionStorage
 * into playwright/.auth/user.json. Subsequent tests reuse that file via
 * `storageState` in playwright.config.ts.
 *
 * Run once:
 *   npm run auth
 *
 * The test waits up to 5 minutes for you to sign in. Once you see the
 * Crash Lens dashboard with the Sussex County KPI, just close the popup
 * and the test will detect the authenticated state automatically.
 *
 * **Never put your password in test code.** This pattern keeps
 * credentials in your hands while the test framework only persists
 * the resulting auth artifacts.
 */
const AUTH_FILE = path.resolve(__dirname, '..', 'playwright', '.auth', 'user.json');

setup('authenticate manually', async ({ page }) => {
    setup.setTimeout(5 * 60_000);

    await page.goto('./');
    console.log('\n\n*** Sign in manually in the browser window. ***');
    console.log('*** Test will detect successful auth and save state. ***\n');

    // Wait until the app shell appears AND a real user is on the dashboard.
    // Adjust the selector if the app shell uses different markers.
    await page.waitForFunction(() => {
        const w = window as any;
        return !!document.querySelector('.sidebar-nav-item, [data-tab="dashboard"]')
            && (w.crashState?.loaded === true || w.crashLensClient?.state);
    }, { timeout: 5 * 60_000 });

    await page.context().storageState({ path: AUTH_FILE });
    console.log('Auth state saved to', AUTH_FILE);
});
