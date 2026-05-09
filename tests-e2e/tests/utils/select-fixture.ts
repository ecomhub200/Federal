import { Page, expect } from '@playwright/test';

export type Tier = 'federal' | 'state' | 'region' | 'mpo' | 'planning_district' | 'county' | 'city';
export type RoadType = 'allRoads' | 'countyOnly' | 'cityOnly' | 'countyPlusVDOT';

const TIER_BUTTON_LABELS: Record<Tier, string> = {
    federal:           'Federal',
    state:             'State',
    region:            'Region',
    mpo:               'MPO',
    planning_district: 'Planning District',
    county:            'County',
    city:              'City / Town',
};

const ROAD_TYPE_RADIO_IDS: Record<RoadType, string> = {
    allRoads:        'filterAllRoads',
    countyOnly:      'filterCountyOnly',
    cityOnly:        'filterCityOnly',
    countyPlusVDOT:  'filterCountyPlusVDOT',
};

/**
 * Set the Upload Data tab's tier + jurisdiction + road-type to a known
 * fixture. Waits for the Supabase bridge to repaint before returning.
 */
export async function selectFixture(
    page: Page,
    opts: {
        stateName: string;
        tier?: Tier;
        jurisdiction?: string;
        roadType?: RoadType;
    }
): Promise<void> {
    // Land on the Upload Data tab — that's where the controls live.
    await page.evaluate(() => (window as any).showTab?.('upload'));
    await page.waitForTimeout(500);

    // 1. State dropdown
    const stateSelect = page.locator('#stateSelect');
    if (await stateSelect.count()) {
        await stateSelect.selectOption({ label: opts.stateName });
        await page.waitForTimeout(800);
    }

    // 2. View Level (tier)
    if (opts.tier) {
        const label = TIER_BUTTON_LABELS[opts.tier];
        await page.getByRole('button', { name: new RegExp('^\\s*' + label + '\\s*$') }).first().click();
        await page.waitForTimeout(500);
    }

    // 3. Jurisdiction dropdown (only meaningful at county/city tier)
    if (opts.jurisdiction && (opts.tier === 'county' || opts.tier === 'city' || !opts.tier)) {
        const jurisDropdowns = ['#countySelect', '#citySelect', '#jurisdictionSelect'];
        for (const sel of jurisDropdowns) {
            const dd = page.locator(sel);
            if (await dd.count()) {
                try {
                    await dd.selectOption({ label: opts.jurisdiction });
                    break;
                } catch { /* try next */ }
            }
        }
        await page.waitForTimeout(500);
    }

    // 4. Road type
    if (opts.roadType) {
        const radioId = ROAD_TYPE_RADIO_IDS[opts.roadType];
        await page.locator(`#${radioId}`).check({ force: true }).catch(() => { /* may not exist at this tier */ });
        await page.waitForTimeout(800);
    }

    // 5. Wait for the bridge to settle. Look for the "Dashboard ready" banner
    // text, which fires after injectFastDashboard completes.
    await page.waitForFunction(() => {
        const w = window as any;
        return w.crashState?.loaded === true && w.crashState?.totalRows > 0;
    }, { timeout: 30_000 }).catch(() => {/* allow tests to assert empty if expected */});
}

/**
 * Click into a tab by id (what showTab uses internally).
 */
export async function gotoTab(page: Page, tabId: string): Promise<void> {
    await page.evaluate((id) => (window as any).showTab?.(id), tabId);
    // Allow time for matview fetches + chart re-render
    await page.waitForTimeout(2_500);
}
