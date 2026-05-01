/**
 * Phase 5 — live API smoke matrix (Delaware).
 *
 * Hits the real self-hosted Supabase at srv1503081.hstgr.cloud and walks the
 * (tier × value × radio) matrix using values verified against the live
 * dashboard_summary matview on 2026-04-30. Catches hierarchy.json dbName
 * drift and matview rebuild regressions early.
 *
 * Run:   node tests/test_phase5_live_matrix.js
 * Skip:  CRASHLENS_SKIP_LIVE=1 node tests/test_phase5_live_matrix.js
 *
 * The unit suite (tests/test_phase5_road_types.js) covers the same wire-
 * format rules with stubFetch and runs offline. This file is the canary
 * that proves the wire format actually matches the matview shape.
 *
 * Each (tier, value, radio) combination must return at least one row for
 * Delaware's 2018-2024 dataset. If any returns zero, that's the bug — read
 * the failure detail to see whether the bucket spec is wrong, the
 * hierarchy.json dbName drifted, or the matview row count itself is empty
 * for that filter.
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

if (process.env.CRASHLENS_SKIP_LIVE === '1') {
    console.log('[Phase 5 live matrix] skipped via CRASHLENS_SKIP_LIVE=1');
    process.exit(0);
}

// Verified live values — see handoff §1 (and the curl smoke commands at the
// bottom of the follow-up prompt). DO NOT swap to acronyms (WILMAPCO) or
// prose names ("Wilmington Area Planning Council MPO") — the matview stores
// the exact strings below, no more no less.
const VALUES = {
    federal: [null],
    state:   [null],
    region:  ['North District', 'South District', 'Central District'],
    planning_district: ['North District', 'South District', 'Central District'],
    mpo: [
        'Wilmington Area Planning Council',
        'Dover / Kent County MPO',
        'Salisbury-Wicomico MPO',
        'Delaware Valley Regional Planning Commission'
    ],
    county: ['New Castle', 'Sussex', 'Kent'],
    city:   ['Dover', 'Wilmington', 'Newark', 'Middletown', 'Smyrna']
};

const RADIOS = ['allRoads', 'countyOnly', 'cityOnly', 'countyPlusVDOT'];

// Load the data-client class into a sandbox with real fetch.
function loadClient() {
    const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'data-client.js'), 'utf8')
        + '\nglobalThis.CrashLensDataClient = CrashLensDataClient;';
    const ctx = {
        console, setTimeout, clearTimeout, AbortController, URL, URLSearchParams,
        DOMException: class DOMException extends Error { constructor(m, n) { super(m); this.name = n; } },
        fetch: (typeof globalThis.fetch === 'function') ? globalThis.fetch : null,
    };
    if (!ctx.fetch) {
        console.error('[Phase 5 live matrix] global fetch is not available — need Node 18+ to run this matrix.');
        process.exit(2);
    }
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return ctx;
}

let passed = 0, failed = 0;
const failures = [];

function record(ok, name, detail) {
    if (ok) { passed++; console.log('  ✓', name); return; }
    failed++; failures.push({ name, detail });
    console.log('  ✗', name);
    if (detail) console.log('    →', detail);
}

async function runMatrix() {
    const ctx = loadClient();
    const C = ctx.CrashLensDataClient;
    const client = new C({ state: 'delaware', preferSupabase: true });

    // Smoke-check connectivity first — if Supabase is unreachable we want to
    // bail with a clear message rather than 200 cryptic failures.
    try {
        const states = await client.getStates();
        if (!Array.isArray(states) || states.length === 0) {
            console.error('[Phase 5 live matrix] /states returned empty — Supabase reachable but unhealthy');
            process.exit(3);
        }
    } catch (e) {
        console.error('[Phase 5 live matrix] could not reach Supabase:', e.message);
        console.error('  Skip this suite locally with CRASHLENS_SKIP_LIVE=1 if you are offline.');
        process.exit(3);
    }

    for (const tier of Object.keys(VALUES)) {
        const values = VALUES[tier];
        for (const value of values) {
            for (const radio of RADIOS) {
                const spec = C.radioToBucket(radio, tier);
                const filters = {};
                if (spec.roadType) filters.roadType = spec.roadType;
                if (spec.roadTypes) filters.roadTypes = spec.roadTypes;
                if (spec.noInterstate) filters.noInterstate = true;

                const label = `[${tier}/${value === null ? '∅' : value}/${radio}]`;
                let rows = null;
                let errMsg = null;
                try {
                    rows = await client.getSummary(tier, value, filters);
                } catch (e) {
                    errMsg = e.message;
                }
                if (errMsg) {
                    record(false, `${label} fetched`, `error: ${errMsg}`);
                    continue;
                }
                const ok = Array.isArray(rows) && rows.length > 0;
                record(ok, `${label} returned non-empty array`,
                    ok ? null : `got ${Array.isArray(rows) ? `${rows.length} rows` : typeof rows} (filters=${JSON.stringify(filters)})`);
            }
        }
    }

    // Targeted RPC sanity checks — same matrix the handoff §5 lists.
    console.log('\n── map_viewport_crashes RPC sanity ──');
    const bbox = { south: 38, west: -76, north: 40, east: -75 };

    // Federal Non-DOT array — should return clusters covering ~131K crashes
    let rpcRows = null;
    try {
        rpcRows = await client.getViewportCrashes(bbox, 9, {
            tier: 'federal',
            roadTypes: C.radioToBucket('countyPlusVDOT', 'federal').roadTypes
        });
    } catch (e) {
        record(false, 'Federal Non-DOT viewport RPC returns rows', e.message);
    }
    if (Array.isArray(rpcRows)) {
        record(rpcRows.length > 0, 'Federal Non-DOT viewport RPC returns rows',
            rpcRows.length === 0 ? 'RPC returned empty array' : null);
    }

    // County Kent No-Interstate — should drop interstate crashes
    let kentNoI = null, kentAll = null;
    try {
        kentNoI = await client.getViewportCrashes(bbox, 9, {
            tier: 'county', tierValue: 'Kent', noInterstate: true
        });
        kentAll = await client.getViewportCrashes(bbox, 9, {
            tier: 'county', tierValue: 'Kent'
        });
    } catch (e) {
        record(false, 'Kent No-Interstate vs all comparison', e.message);
    }
    if (Array.isArray(kentNoI) && Array.isArray(kentAll)) {
        const sumN = (arr) => arr.reduce((a, r) => a + (r.n || 0), 0);
        record(sumN(kentNoI) <= sumN(kentAll),
            'Kent noInterstate crash count <= Kent all',
            `noInterstate=${sumN(kentNoI)}, all=${sumN(kentAll)}`);
    }
}

(async () => {
    console.log('═══════════════════════════════════════════════');
    console.log(' Phase 5 — LIVE matrix (Delaware) ');
    console.log(' Target: srv1503081.hstgr.cloud/rest/v1');
    console.log('═══════════════════════════════════════════════');

    await runMatrix();

    console.log('\n═══════════════════════════════════════════════');
    console.log(` Passed: ${passed}    Failed: ${failed}`);
    console.log('═══════════════════════════════════════════════');
    if (failed > 0) {
        console.log('\nFailures:');
        for (const f of failures) {
            console.log('  •', f.name);
            if (f.detail) console.log('    ', f.detail);
        }
        process.exit(1);
    }
    process.exit(0);
})();
