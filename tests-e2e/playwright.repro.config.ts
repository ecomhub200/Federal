import { defineConfig, devices } from '@playwright/test';

// Standalone config for the no-auth report repro/verification harness.
// Bypasses the manual-login `setup` dependency in the main config and points at
// a local static server (start: `python -m http.server 8099` from repo root).
//   BASE_URL defaults to the local server; override to test the deployed app.
const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:8099/app/';

export default defineConfig({
    testDir: './tests',
    timeout: 120_000,
    expect: { timeout: 20_000 },
    fullyParallel: false,
    workers: 1,
    reporter: [['list']],
    use: {
        baseURL: BASE_URL,
        storageState: undefined,            // no auth — firebase gate is stubbed per-spec
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        viewport: { width: 1600, height: 900 },
        actionTimeout: 20_000,
        navigationTimeout: 40_000,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
});
