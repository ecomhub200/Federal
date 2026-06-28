import { test, expect } from '@playwright/test';

/**
 * Regression for the "Map tab doesn't repaint on road-type change at aggregate
 * tiers" bug. At federal/state/region/mpo/planning_district the road-type radio
 * routes through saveFilterProfile() -> _debouncedBridgeRefresh(), which used to
 * refresh ONLY the dashboard matview (injectFastDashboard) and never the map
 * bridge -- so the map stayed stale until the next pan/zoom.
 *
 * The fix adds an isActive()-guarded CL.data.mapBridge.refresh() inside the same
 * debounced callback. This test stubs the map bridge with a spy and asserts the
 * road-type change at an aggregate tier triggers refresh(). Uses the no-auth
 * firebase stub so it can run headless against a local static server.
 */
test('road-type change at an aggregate tier refreshes the map bridge', async ({ page }) => {
    // Stub the firebase gate so the app doesn't redirect to /login/.
    await page.route('**/firebasejs/**', r => r.abort());
    await page.route('**/firebase-config.js*', r =>
        r.fulfill({ contentType: 'application/javascript', body: 'window.isFirebaseConfigured=false;' }));

    await page.goto('/app/');

    // Wait for the filter wiring + CL namespace to be present.
    await page.waitForFunction(
        () => typeof (window as any).saveFilterProfile === 'function'
            && !!(window as any).CL && !!(window as any).CL.data,
        null,
        { timeout: 60_000 },
    );

    const refreshCalled = await page.evaluate(() => {
        const w = window as any;
        // Force an aggregate tier (state) so saveFilterProfile takes the
        // matview branch that calls _debouncedBridgeRefresh().
        w.jurisdictionContext = w.jurisdictionContext || {};
        w.jurisdictionContext.viewTier = 'state';

        // Replace the map bridge with an active spy. _debouncedBridgeRefresh
        // reads CL.data.mapBridge at call time, so the fix should invoke this.
        let called = false;
        w.CL.data.mapBridge = {
            isActive: () => true,
            refresh: () => { called = true; },
            attach: () => {},
        };

        // Select a non-default road-type radio and fire the save handler.
        const radio = document.querySelector(
            'input[name="roadTypeFilter"][value="countyOnly"]') as HTMLInputElement | null;
        if (radio) radio.checked = true;
        w.saveFilterProfile();

        // _debouncedBridgeRefresh waits 250ms; give it margin.
        return new Promise<boolean>(res => setTimeout(() => res(called), 600));
    });

    expect(refreshCalled).toBe(true);
});
