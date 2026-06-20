import { test as setup } from '@playwright/test';
import * as path from 'node:path';

/**
 * Non-interactive auth setup for CI / automated sweeps.
 *
 * Unlike auth.setup.ts (manual, headed), this signs in with credentials
 * supplied via environment variables so the full matrix sweep can run
 * unattended:
 *
 *   E2E_EMAIL=you@example.com E2E_PASSWORD=secret \
 *     npx playwright test auth-auto.setup.ts --project=setup-auto
 *
 * Credentials are NEVER hard-coded here — they come from the environment.
 * The resulting auth artifacts are written to playwright/.auth/user.json,
 * which the chromium project reuses via storageState.
 */
const AUTH_FILE = path.resolve(__dirname, '..', 'playwright', '.auth', 'user.json');

setup('authenticate via env credentials', async ({ page }) => {
    setup.setTimeout(2 * 60_000);

    const email = process.env.E2E_EMAIL;
    const password = process.env.E2E_PASSWORD;
    if (!email || !password) {
        throw new Error('Set E2E_EMAIL and E2E_PASSWORD env vars to use auth-auto.setup.ts');
    }

    // App redirects unauthenticated users to /login/.
    // NOTE: use './' not '/' — the deployed app lives under a subpath
    // (/Federal/app/); '/' would resolve to the origin root and 404.
    // Heavy app (map tiles etc.) — wait for DOM, not full 'load'.
    await page.goto('./', { waitUntil: 'domcontentloaded', timeout: 60_000 });
    await page.waitForURL(/\/login\//, { timeout: 30_000 }).catch(() => { /* may already be authed */ });

    if (/\/login\//.test(page.url())) {
        await page.locator('#signinEmail').fill(email);
        await page.locator('#signinPassword').fill(password);
        await page.locator('#signinBtn').click();
    }

    // Wait until the authenticated app shell is up and the data client exists.
    await page.waitForFunction(() => {
        const w = window as any;
        return /\/app\//.test(location.pathname)
            && !!(w.crashLensClient?.state || w.crashState);
    }, { timeout: 60_000 });

    await page.context().storageState({ path: AUTH_FILE });
    console.log('Auth state saved to', AUTH_FILE);
});
