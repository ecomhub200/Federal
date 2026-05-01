/**
 * Phase 5 — live API smoke matrix (Delaware), exact-numeric edition.
 *
 * Hits the real self-hosted Supabase at srv1503081.hstgr.cloud and walks the
 * (tier × value × radio) matrix using totals verified against the live
 * dashboard_summary matview on 2026-04-30. Every cell must match the
 * recorded crash count exactly — non-empty arrays are NOT enough because a
 * wrong slice (e.g. dot_roads served under the "County Roads Only" radio
 * label) is still non-empty.
 *
 * Run:   node tests/test_phase5_live_matrix.js
 * Skip:  CRASHLENS_SKIP_LIVE=1 node tests/test_phase5_live_matrix.js
 *
 * The unit suite (tests/test_phase5_road_types.js) covers the same wire
 * format with stubFetch and runs offline. This file proves the wire
 * format actually matches the matview shape AND volume.
 *
 * If a cell drifts: regenerate by running each radioToBucket spec against
 * the matview directly and replacing the value below. Drift is expected
 * after every nightly matview refresh on a state with active uploads — see
 * docs/PHASE2_WIRING_MAP.md §9.
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

if (process.env.CRASHLENS_SKIP_LIVE === '1') {
    console.log('[Phase 5 live matrix] skipped via CRASHLENS_SKIP_LIVE=1');
    process.exit(0);
}

// ─────────────────────────────────────────────────────────
// Verified against live Supabase 2026-04-30 — Delaware-only data,
// regenerate after onboarding additional states. Each value is
// sum(crash_count) for the (tier, value, radio) cell after
// radioToBucket → PostgREST round-trip.
//
// Pipe-delimited keys: '<tier>|<value or "null">|<radio>'
// ─────────────────────────────────────────────────────────
const EXPECTED_DELAWARE = {
    'state|null|allRoads':          569829,
    'state|null|countyOnly':        438501,   // dot_roads (aggregate-tier semantics)
    'state|null|cityOnly':           81315,
    'state|null|countyPlusVDOT':     39885,   // county_roads (state/region semantics)

    'federal|null|allRoads':        569829,
    'federal|null|countyOnly':      438501,
    'federal|null|cityOnly':         81315,
    'federal|null|countyPlusVDOT':  131328,   // roadTypes IN (county,city,other) — Federal "Non-DOT"

    'region|North District|allRoads':         337469,
    'region|North District|countyOnly':       262292,
    'region|North District|cityOnly':          52183,
    'region|North District|countyPlusVDOT':    17712,

    'mpo|Wilmington Area Planning Council|allRoads':         335962,
    'mpo|Wilmington Area Planning Council|countyOnly':        17546,   // county_roads — would be ~256K under the pre-fix bug
    'mpo|Wilmington Area Planning Council|cityOnly':          52167,
    'mpo|Wilmington Area Planning Council|countyPlusVDOT':   295576,   // is_interstate=false

    'county|Kent|allRoads':         38614,
    'county|Kent|countyOnly':        4121,    // county_roads — would be ~28K under the pre-fix bug
    'county|Kent|cityOnly':          2047,
    'county|Kent|countyPlusVDOT':   38380,    // is_interstate=false

    'city|Dover|allRoads':          33583,
    'city|Dover|countyOnly':         2884,    // county_roads — would be ~22K under the pre-fix bug
    'city|Dover|cityOnly':           5972,
    'city|Dover|countyPlusVDOT':    33507,    // is_interstate=false
};

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

    console.log('\n── 24-cell exact-numeric matrix ──');
    for (const [key, expected] of Object.entries(EXPECTED_DELAWARE)) {
        const [tier, valueRaw, radio] = key.split('|');
        const value = valueRaw === 'null' ? null : valueRaw;
        const spec = C.radioToBucket(radio, tier);
        let total = null;
        let errMsg = null;
        try {
            const rows = await client.getSummary(tier, value, spec);
            if (!Array.isArray(rows)) {
                errMsg = `expected array, got ${typeof rows}`;
            } else {
                total = rows.reduce((s, r) => s + (parseInt(r.crash_count, 10) || 0), 0);
            }
        } catch (e) {
            errMsg = e.message;
        }
        if (errMsg) {
            record(false, `[${key}]`, `error: ${errMsg} (spec=${JSON.stringify(spec)})`);
            continue;
        }
        record(total === expected, `[${key}] = ${expected}`,
            total === expected ? null
                : `got ${total} (Δ ${total - expected}, spec=${JSON.stringify(spec)})`);
    }

    // Targeted RPC sanity checks — same matrix the handoff §5 lists.
    console.log('\n── map_viewport_crashes RPC sanity ──');
    const bbox = { south: 38, west: -76, north: 40, east: -75 };

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
    console.log(' Phase 5 — LIVE matrix (Delaware), exact-numeric');
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
