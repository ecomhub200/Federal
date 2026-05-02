/**
 * Phase 5 — road type bucket spec, ownership map, SWR, and prefetch tests.
 *
 * These exercise the JS contract changes that pair with the 2026-04-30
 * matview rebuilds (4-bucket road_type + is_interstate model derived from
 * crashes.ownership). Run with:  node tests/test_phase5_road_types.js
 *
 * No Supabase connectivity is required — every test stubs fetch and asserts
 * on the outgoing URL / RPC body / Prefer header.
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

let passed = 0, failed = 0;
const failures = [];

function assert(cond, name, detail) {
    if (cond) { passed++; console.log('  ✓', name); return; }
    failed++; failures.push({ name, detail });
    console.log('  ✗', name);
    if (detail) console.log('    →', detail);
}

function assertEq(actual, expected, name) {
    const ok = JSON.stringify(actual) === JSON.stringify(expected);
    assert(ok, name, ok ? null : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

function assertIncludes(haystack, needle, name) {
    const ok = String(haystack).includes(needle);
    assert(ok, name, ok ? null : `expected ${JSON.stringify(haystack)} to include ${JSON.stringify(needle)}`);
}

function assertNotIncludes(haystack, needle, name) {
    const ok = !String(haystack).includes(needle);
    assert(ok, name, ok ? null : `expected ${JSON.stringify(haystack)} NOT to include ${JSON.stringify(needle)}`);
}

function loadClient() {
    const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'data-client.js'), 'utf8')
        + '\nglobalThis.CrashLensDataClient = CrashLensDataClient;';
    const ctx = {
        console, setTimeout, clearTimeout, AbortController, URL, URLSearchParams,
        DOMException: class DOMException extends Error { constructor(m, n) { super(m); this.name = n; } },
        fetch: null,
    };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return ctx;
}

function stubFetch(ctx, body, headers = {}) {
    const calls = [];
    ctx.fetch = async (url, init = {}) => {
        calls.push({ url: String(url), init, headers: init.headers || {} });
        return {
            ok: true,
            status: 200,
            headers: { get: (n) => headers[n.toLowerCase()] || headers[n] || null },
            json: async () => body,
        };
    };
    return calls;
}

function makeClient(ctx, opts) {
    return new ctx.CrashLensDataClient(Object.assign({
        state: 'delaware', supabaseKey: 'test-key', preferSupabase: true,
    }, opts || {}));
}

function decodeUrl(u) { return decodeURIComponent(String(u).replace(/\+/g, ' ')); }

// ───────── radioToBucket / activeRoadType static helpers ─────────
function testRadioToBucket() {
    console.log('\nA. radioToBucket — tier-aware mapping');
    const ctx = loadClient();
    const C = ctx.CrashLensDataClient;

    // allRoads — empty spec at every tier
    assertEq(C.radioToBucket('allRoads', 'state'),    {}, "allRoads/state → {}");
    assertEq(C.radioToBucket('allRoads', 'federal'),  {}, "allRoads/federal → {}");
    assertEq(C.radioToBucket('allRoads', 'county'),   {}, "allRoads/county → {}");

    // countyOnly is tier-aware: aggregate tiers (federal / state / region /
    // mpo / planning_district) → dot_roads ("DOT Roads Only" radio label).
    // Local tiers (county / city) → county_roads ("County Roads Only" radio
    // label). Mirrors upload-tab labels exactly.
    assertEq(C.radioToBucket('countyOnly', 'federal'),           { roadType: 'dot_roads' },    "countyOnly/federal → dot_roads (aggregate tier)");
    assertEq(C.radioToBucket('countyOnly', 'state'),             { roadType: 'dot_roads' },    "countyOnly/state → dot_roads (aggregate tier)");
    assertEq(C.radioToBucket('countyOnly', 'region'),            { roadType: 'dot_roads' },    "countyOnly/region → dot_roads (aggregate tier)");
    assertEq(C.radioToBucket('countyOnly', 'mpo'),               { roadType: 'dot_roads' },    "countyOnly/mpo → dot_roads (aggregate tier)");
    assertEq(C.radioToBucket('countyOnly', 'planning_district'), { roadType: 'dot_roads' },    "countyOnly/planning_district → dot_roads (aggregate tier)");
    assertEq(C.radioToBucket('countyOnly', 'county'),            { roadType: 'county_roads' }, "countyOnly/county → county_roads (local tier)");
    assertEq(C.radioToBucket('countyOnly', 'city'),              { roadType: 'county_roads' }, "countyOnly/city → county_roads (local tier)");

    // cityOnly = new city_roads bucket at every tier (post-2026-04-30)
    assertEq(C.radioToBucket('cityOnly', 'state'),    { roadType: 'city_roads' }, "cityOnly/state → city_roads");
    assertEq(C.radioToBucket('cityOnly', 'county'),   { roadType: 'city_roads' }, "cityOnly/county → city_roads");

    // countyPlusVDOT — varies by tier
    assertEq(C.radioToBucket('countyPlusVDOT', 'state'),
        { roadType: 'county_roads' }, "countyPlusVDOT/state → county_roads");
    assertEq(C.radioToBucket('countyPlusVDOT', 'mpo'),
        { roadType: 'county_roads' }, "countyPlusVDOT/mpo → county_roads");
    assertEq(C.radioToBucket('countyPlusVDOT', 'planning_district'),
        { roadType: 'county_roads' }, "countyPlusVDOT/planning_district → county_roads");
    assertEq(C.radioToBucket('countyPlusVDOT', 'region'),
        { roadType: 'county_roads' }, "countyPlusVDOT/region → county_roads");
    // Order is sorted alphabetically so the SWR cache key normalizes —
    // SQL IN(...) is order-insensitive so the wire query is unaffected.
    assertEq(C.radioToBucket('countyPlusVDOT', 'federal'),
        { roadTypes: ['city_roads', 'county_roads', 'other_roads'] },
        "countyPlusVDOT/federal → sorted array (Non-DOT Roads)");
    assertEq(C.radioToBucket('countyPlusVDOT', 'county'),
        { noInterstate: true }, "countyPlusVDOT/county → noInterstate");
    assertEq(C.radioToBucket('countyPlusVDOT', 'city'),
        { noInterstate: true }, "countyPlusVDOT/city → noInterstate");
}

// ───────── _supabaseSummary: roadType / roadTypes / noInterstate forwarding ─────────
async function testSummaryForwarding() {
    console.log('\nB. getSummary forwards 4-bucket spec correctly');

    // single bucket — eq.
    let ctx = loadClient();
    let calls = stubFetch(ctx, []);
    await makeClient(ctx).getSummary('state', null, { roadType: 'city_roads' }).catch(()=>{});
    assertIncludes(decodeUrl(calls[0].url), 'road_type=eq.city_roads', "single bucket → road_type=eq.city_roads");

    // array — in.()
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getSummary('federal', null, {
        roadTypes: ['county_roads', 'city_roads', 'other_roads']
    }).catch(()=>{});
    assertIncludes(decodeUrl(calls[0].url),
        'road_type=in.(county_roads,city_roads,other_roads)',
        "array → road_type=in.(...)");

    // noInterstate — is_interstate=eq.false
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getSummary('county', 'Kent', { noInterstate: true }).catch(()=>{});
    assertIncludes(decodeUrl(calls[0].url), 'is_interstate=eq.false', "noInterstate → is_interstate=eq.false");

    // No filter — neither column appears
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getSummary('state', null, {}).catch(()=>{});
    const u = decodeUrl(calls[0].url);
    assertNotIncludes(u, 'road_type=', "no spec → no road_type filter");
    assertNotIncludes(u, 'is_interstate=', "no spec → no is_interstate filter");

    // city_roads guard is GONE — must produce a real eq.city_roads filter
    // (regression from the old `!== 'city_roads'` short-circuit that returned 0 rows).
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getSummary('state', null, { roadType: 'city_roads' }).catch(()=>{});
    assertIncludes(decodeUrl(calls[0].url), 'road_type=eq.city_roads', "city_roads no longer skipped");
}

// ───────── crashes table: ownership map + is_interstate ─────────
async function testCrashesOwnershipMap() {
    console.log('\nC. _supabaseCrashes uses ownership map for road_type buckets');

    // Ownership labels MUST match the literal strings in crashes.ownership —
    // verified live 2026-05-02. The pre-fix labels ("State Highway Agency"
    // etc.) returned 0 rows for every detail-tab query.
    let ctx = loadClient();
    let calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', {
        page: 1, roadType: 'dot_roads'
    }).catch(()=>{});
    const u1 = decodeUrl(calls[0].url);
    assertIncludes(u1, 'ownership=in.', "dot_roads → ownership=in.(...)");
    assertIncludes(u1, '"1. State Hwy Agency"', "dot_roads ownership matches live label");
    assertNotIncludes(u1, '"State Highway Agency"', "dot_roads no longer uses pre-fix label");

    // Array of buckets — concatenates ownership lists for Federal Non-DOT
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('federal', null, {
        page: 1, roadTypes: ['county_roads', 'city_roads', 'other_roads']
    }).catch(()=>{});
    const u2 = decodeUrl(calls[0].url);
    assertIncludes(u2, '"2. County Hwy Agency"',         "Federal Non-DOT keeps County Hwy Agency (live label)");
    assertIncludes(u2, '"3. City or Town Hwy Agency"',   "Federal Non-DOT keeps City or Town Hwy Agency (live label)");
    assertIncludes(u2, '"4. Federal Roads"',             "Federal Non-DOT keeps Federal Roads (live label)");
    assertIncludes(u2, '"6. Private/Unknown Roads"',     "Federal Non-DOT keeps Private/Unknown Roads (live label)");

    // noInterstate must NOT use is_interstate=eq.false — the column doesn't
    // exist on the base crashes table (only on the matviews). The functional
    // class + system fallback is required to avoid a PostgREST 400 error.
    ctx = loadClient(); calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', {
        page: 1, noInterstate: true
    }).catch(()=>{});
    const u3 = decodeUrl(calls[0].url);
    assertNotIncludes(u3, 'is_interstate=', "noInterstate no longer uses non-existent is_interstate column");
    assertIncludes(u3, 'functional_class.not.like.1-Interstate*',
        "noInterstate forwarded as functional_class.not.like clause");
    assertIncludes(u3, 'system.neq.DOT Interstate',
        "noInterstate forwarded as system.neq clause");
}

// ───────── getViewportCrashes RPC body (Phase 3 RPC params) ─────────
async function testViewportRPCBody() {
    console.log('\nD. getViewportCrashes wires p_road_type / p_road_types / p_no_interstate');

    let ctx = loadClient();
    const calls = stubFetch(ctx, []);
    const c = makeClient(ctx);
    const bounds = { south: 38, west: -76, north: 39, east: -75 };

    // single bucket
    await c.getViewportCrashes(bounds, 9, { tier: 'state', roadType: 'city_roads' });
    let body = JSON.parse(calls[0].init.body);
    assertEq(body.p_road_type, 'city_roads', "p_road_type set");
    assertEq(body.p_road_types, null, "p_road_types null when scalar provided");
    assertEq(body.p_no_interstate, null, "p_no_interstate null");

    // array
    ctx = loadClient();
    const calls2 = stubFetch(ctx, []);
    const c2 = makeClient(ctx);
    await c2.getViewportCrashes(bounds, 9, {
        tier: 'federal',
        roadTypes: ['county_roads', 'city_roads', 'other_roads']
    });
    body = JSON.parse(calls2[0].init.body);
    assertEq(body.p_road_type, null, "p_road_type null when array supplied");
    assertEq(body.p_road_types, ['county_roads', 'city_roads', 'other_roads'],
        "p_road_types passes array through");

    // noInterstate
    ctx = loadClient();
    const calls3 = stubFetch(ctx, []);
    const c3 = makeClient(ctx);
    await c3.getViewportCrashes(bounds, 9, { tier: 'county', tierValue: 'Kent', noInterstate: true });
    body = JSON.parse(calls3[0].init.body);
    assertEq(body.p_no_interstate, true, "p_no_interstate=true forwarded");
}

// ───────── §6.2 count=estimated ─────────
async function testCountEstimated() {
    console.log('\nE. Pagination uses Prefer: count=estimated (not count=exact)');
    const ctx = loadClient();
    const calls = stubFetch(ctx, [], { 'content-range': '0-24/12345' });
    const c = makeClient(ctx);
    await c.getCrashes('county', 'Kent', { page: 1, pageSize: 25 });
    assertEq(calls[0].headers['Prefer'], 'count=estimated',
        "Prefer header is count=estimated");
}

// ───────── SWR cache ─────────
async function testSWRCache() {
    console.log('\nF. SWR cache returns within TTL, refetches after');
    const ctx = loadClient();
    let fetchCount = 0;
    ctx.fetch = async () => {
        fetchCount++;
        return {
            ok: true, status: 200,
            headers: { get: () => null },
            json: async () => [{ crash_count: 5, crash_severity: 'K', crash_year: 2023 }]
        };
    };
    const c = makeClient(ctx);
    // First call hits the network
    await c.getSummary('state', null, {});
    assertEq(fetchCount, 1, "first getSummary triggers fetch");
    // Second call within TTL is served from cache
    await c.getSummary('state', null, {});
    assertEq(fetchCount, 1, "second getSummary served from cache");

    // Different filters → different cache key → another fetch
    await c.getSummary('state', null, { roadType: 'dot_roads' });
    assertEq(fetchCount, 2, "different filters → cache miss → fetch");

    // prefetchTier should warm the cache
    await c.prefetchTier('county', 'Kent', { roadType: 'city_roads' });
    assertEq(fetchCount, 3, "prefetchTier triggers fetch");
    await c.getSummary('county', 'Kent', { roadType: 'city_roads' });
    assertEq(fetchCount, 3, "post-prefetch getSummary served from cache");

    // Federal Non-DOT — roadTypes order must NOT split the cache slot.
    // SQL IN(...) is order-insensitive so two different array orders are
    // semantically equivalent and should hit the same cache key.
    await c.getSummary('federal', null, { roadTypes: ['county_roads','city_roads','other_roads'] });
    const beforeReorder = fetchCount;
    await c.getSummary('federal', null, { roadTypes: ['other_roads','city_roads','county_roads'] });
    assertEq(fetchCount, beforeReorder, "reordered roadTypes hits same cache slot");
    await c.getSummary('federal', null, { roadTypes: ['city_roads','county_roads','other_roads'] });
    assertEq(fetchCount, beforeReorder, "third permutation still hits same cache slot");
}

// ───────── _applyRoadTypeMatviewFilters helper directness ─────────
function testApplyMatviewFilters() {
    console.log('\nG. _applyRoadTypeMatviewFilters sanity');
    const ctx = loadClient();
    const c = makeClient(ctx);

    let target = {};
    c._applyRoadTypeMatviewFilters(target, { roadType: 'dot_roads' });
    assertEq(target.road_type, 'eq.dot_roads', "scalar → eq.");

    target = {};
    c._applyRoadTypeMatviewFilters(target, { roadTypes: ['a','b'] });
    assertEq(target.road_type, 'in.(a,b)', "array → in.()");

    target = {};
    c._applyRoadTypeMatviewFilters(target, { noInterstate: true });
    assertEq(target.is_interstate, 'eq.false', "noInterstate → is_interstate=eq.false");

    // Array beats scalar when both supplied
    target = {};
    c._applyRoadTypeMatviewFilters(target, { roadType: 'dot_roads', roadTypes: ['x','y'] });
    assertEq(target.road_type, 'in.(x,y)', "roadTypes wins over roadType");
}

// ───────── agg-worker correctness (off-thread aggregate) ─────────
function testAggWorker() {
    console.log('\nH. agg-worker.js aggregate() correctness');
    const aggPath = path.join(__dirname, '..', 'assets', 'js', 'agg-worker.js');
    const m = require(aggPath);
    assert(typeof m.aggregate === 'function', 'agg-worker exports aggregate()');

    const rows = [
        { crash_count: 10, crash_severity: 'K', crash_year: 2024, fatals: 10 },
        { crash_count:  3, crash_severity: 'A', crash_year: 2024, serious_injuries: 3, ped_crashes: 1 },
        { crash_count: 50, crash_severity: 'O', crash_year: 2023, animal_crashes: 5 }
    ];
    const agg = m.aggregate(rows);
    assertEq(agg.total, 63, "total sums crash_count across rows");
    assertEq(agg.bySeverity.K, 10, "bySeverity.K accumulates K rows");
    assertEq(agg.bySeverity.A, 3,  "bySeverity.A accumulates A rows");
    assertEq(agg.bySeverity.O, 50, "bySeverity.O accumulates O rows");
    assertEq(agg.byYear[2024].total, 13, "byYear.2024.total = 13");
    assertEq(agg.byYear[2023].total, 50, "byYear.2023.total = 50");
    assertEq(agg.safety.fatals, 10,  "safety.fatals collects K_People");
    assertEq(agg.safety.seriousInjured, 3, "safety.seriousInjured collects A_People");
    assertEq(agg.safety.ped, 1, "safety.ped collects ped_crashes");
    assertEq(agg.safety.animal, 5, "safety.animal collects animal_crashes");

    // Empty / non-array input is safe
    assertEq(m.aggregate(null).total, 0, 'null rows → empty agg');
    assertEq(m.aggregate(undefined).total, 0, 'undefined rows → empty agg');
}

// ───────── Runner ─────────
(async () => {
    console.log('═══════════════════════════════════════════════');
    console.log(' Phase 5 — 4-bucket road type + is_interstate');
    console.log('═══════════════════════════════════════════════');

    testRadioToBucket();
    await testSummaryForwarding();
    await testCrashesOwnershipMap();
    await testViewportRPCBody();
    await testCountEstimated();
    await testSWRCache();
    testApplyMatviewFilters();
    testAggWorker();

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
