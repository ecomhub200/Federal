import { test, expect } from '@playwright/test';

/**
 * Regression for Gap B — the Map-tab road-type radio labels used to be
 * hardcoded ("County Only / City Only / All No Interstate") and never updated
 * per view level, so at aggregate tiers they disagreed with the actual filter
 * semantics. updateRoadTypeLabels(tier) now also updates the map-panel label
 * spans from the single source of truth (CL.data.roadTypeMapping), so they read
 * "DOT Roads Only / City Roads Only / Non-DOT Roads" at aggregate tiers and
 * "County Roads Only / ... / All Roads (No Interstate)" at place tiers.
 *
 * Uses the no-auth firebase stub so it runs headless against a local server.
 */
test('Map-tab road-type labels are tier-aware', async ({ page }) => {
    await page.route('**/firebasejs/**', r => r.abort());
    await page.route('**/firebase-config.js*', r =>
        r.fulfill({ contentType: 'application/javascript', body: 'window.isFirebaseConfigured=false;' }));

    await page.goto('/app/');

    await page.waitForFunction(
        () => typeof (window as any).updateRoadTypeLabels === 'function'
            && !!(window as any).CL?.data?.roadTypeMapping
            && !!document.getElementById('mapFilterLabelCountyOnly'),
        null,
        { timeout: 60_000 },
    );

    const labels = await page.evaluate(() => {
        const w = window as any;
        const read = () => ({
            countyOnly:     document.getElementById('mapFilterLabelCountyOnly')!.textContent,
            cityOnly:       document.getElementById('mapFilterLabelCityOnly')!.textContent,
            countyPlusVDOT: document.getElementById('mapFilterLabelCountyPlusVDOT')!.textContent,
            allRoads:       document.getElementById('mapFilterLabelAllRoads')!.textContent,
        });
        w.updateRoadTypeLabels('state');
        const aggregate = read();
        w.updateRoadTypeLabels('county');
        const place = read();
        return { aggregate, place };
    });

    // Aggregate tier (state): DOT/City/Non-DOT semantics.
    expect(labels.aggregate.countyOnly).toBe('DOT Roads Only');
    expect(labels.aggregate.cityOnly).toBe('City Roads Only');
    expect(labels.aggregate.countyPlusVDOT).toBe('Non-DOT Roads');

    // Place tier (county): county/city/no-interstate semantics.
    expect(labels.place.countyOnly).toBe('County Roads Only');
    expect(labels.place.countyPlusVDOT).toBe('All Roads (No Interstate)');
});
