import { defineConfig, devices } from '@playwright/test';

/**
 * Crash Lens E2E config.
 *
 * Run against the deployed app:
 *   BASE_URL=https://ecomhub200.github.io/Federal/app/ npm test
 *
 * Run against a local file:// or dev server:
 *   BASE_URL=http://localhost:8000/app/ npm test
 *
 * One-time auth flow (saves auth state for re-use):
 *   npm run auth
 *
 * Default fixture: Delaware → Sussex County → county tier → All Roads (No Interstate).
 * Override via env: STATE_KEY=virginia COUNTY=fairfax TIER=county ROAD_TYPE=allRoads
 */
const BASE_URL = process.env.BASE_URL ?? 'https://ecomhub200.github.io/Federal/app/';

export default defineConfig({
    testDir: './tests',
    timeout: 90_000,
    expect: { timeout: 15_000 },
    fullyParallel: false, // tier-change tests must run serially against the same app instance
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : 1,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['json',  { outputFile: 'test-results/results.json' }],
    ],
    use: {
        baseURL: BASE_URL,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        actionTimeout: 15_000,
        navigationTimeout: 30_000,
        viewport: { width: 1600, height: 900 },
        // Pre-auth state (created by auth.setup.ts).
        // If the file doesn't exist yet, run `npm run auth` once.
        storageState: process.env.SKIP_AUTH ? undefined : 'playwright/.auth/user.json',
    },
    projects: [
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
            use: { storageState: undefined }, // setup runs without storageState
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
            dependencies: ['setup'],
        },
    ],
});
