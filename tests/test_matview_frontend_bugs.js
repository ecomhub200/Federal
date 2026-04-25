/**
 * Matview frontend bug test — guards the 7 bugs fixed in
 * `assets/js/data-client.js` for the new mv_* matviews.
 *
 *   1. getHotspots          — must NOT send spurious `limit_n` filter
 *   2. getSafetyCategories  — must accumulate (+=) across rows per category
 *                              (one row per county at aggregate tiers)
 *   3. getAnalysisBreakdown — must accumulate across rows per (dimension, dim_value)
 *   4. Limits raised        — getSafetyCategories=2000, getAnalysisBreakdown=10000
 *   5. getSafetyCategories  — must NOT send `crash_year` filter (column missing)
 *   6. getAnalysisBreakdown — must NOT send `crash_year` filter (column missing)
 *   7. getHotspots / getGrantsBaseline — must merge across `road_type` buckets
 *      (dot_roads / non_dot_roads / all_roads) when no roadType filter is set,
 *      so the same physical location isn't returned 2-3x with split counts.
 *
 * Uses the same vm-sandbox + fetch-stub harness as test_phase4_data_client.js
 * so no Supabase connectivity is required.
 *
 * Run with:  node tests/test_matview_frontend_bugs.js
 */

const vm = require('vm');
const fs = require('fs');
const path = require('path');

// ───────── Test harness ─────────
let passed = 0;
let failed = 0;
const failures = [];

function assert(cond, name, detail) {
    if (cond) { passed++; console.log('  ✓', name); return; }
    failed++;
    failures.push({ name, detail });
    console.log('  ✗', name);
    if (detail) console.log('    →', detail);
}
function assertEq(actual, expected, name) {
    const ok = actual === expected;
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

// ───────── Sandbox loader ─────────
function loadClient() {
    const src = fs.readFileSync(path.join(__dirname, '..', 'assets', 'js', 'data-client.js'), 'utf8')
        + '\nglobalThis.CrashLensDataClient = CrashLensDataClient;';
    const ctx = {
        console,
        setTimeout,
        clearTimeout,
        AbortController,
        URL,
        URLSearchParams,
        DOMException: class DOMException extends Error { constructor(m, n) { super(m); this.name = n; } },
        fetch: null,
    };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return ctx;
}

function stubFetch(ctx, responseBody, responseHeaders = {}) {
    const calls = [];
    ctx.fetch = async (url, init = {}) => {
        calls.push({ url: String(url), init, headers: init.headers || {} });
        const headers = {
            get(name) { return responseHeaders[name.toLowerCase()] || responseHeaders[name] || null; }
        };
        return { ok: true, status: 200, headers, json: async () => responseBody };
    };
    return calls;
}

function makeClient(ctx, opts) {
    return new ctx.CrashLensDataClient(Object.assign({
        state: 'delaware',
        supabaseKey: 'test-key',
        preferSupabase: true,
    }, opts || {}));
}

function decodeUrl(url) {
    return decodeURIComponent(String(url).replace(/\+/g, ' '));
}

// ───────── Tests ─────────

async function test1_getHotspots_no_limit_n() {
    console.log('\n1. getHotspots — must NOT send `limit_n` (PostgREST 400)');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    await makeClient(ctx).getHotspots('county', 'Kent', { limit: 50 });
    const u = decodeUrl(calls[0].url);
    assertNotIncludes(u, 'limit_n', 'no limit_n key in URL');
    assertNotIncludes(u, 'limit_n=', 'no limit_n= filter in URL');
    assertIncludes(u, 'limit=', 'real `limit` param still set');
    assertIncludes(u, 'order=epdo.desc', 'order by epdo.desc preserved');
    assertIncludes(u, 'state=eq.delaware', 'state tier filter preserved');
    assertIncludes(u, 'physical_juris_name=eq.Kent', 'county tier filter preserved');
}

async function test2_safetyCategories_accumulates() {
    console.log('\n2. getSafetyCategories — accumulates across counties at aggregate tier');
    const ctx = loadClient();
    // Simulate a state-tier query that returns 3 rows for "pedestrian"
    // (one per Delaware county) and 2 rows for "speeding".
    stubFetch(ctx, [
        { category: 'pedestrian', total: 100, k: 5, a: 10, b: 20, c: 30, o: 35, physical_juris_name: 'Kent' },
        { category: 'pedestrian', total: 200, k: 8, a: 12, b: 40, c: 50, o: 90, physical_juris_name: 'New Castle' },
        { category: 'pedestrian', total: 50,  k: 2, a:  3, b:  5, c: 15, o: 25, physical_juris_name: 'Sussex' },
        { category: 'speeding',   total: 70,  k: 4, a:  6, b: 10, c: 20, o: 30, physical_juris_name: 'Kent' },
        { category: 'speeding',   total: 30,  k: 1, a:  2, b:  3, c: 10, o: 14, physical_juris_name: 'New Castle' },
    ]);
    const out = await makeClient(ctx).getSafetyCategories('state', 'delaware');
    // Pedestrian: 100+200+50 = 350; K: 5+8+2 = 15; A: 10+12+3 = 25
    assertEq(out.pedestrian.total, 350, 'pedestrian.total = 100+200+50');
    assertEq(out.pedestrian.K,     15,  'pedestrian.K     = 5+8+2');
    assertEq(out.pedestrian.A,     25,  'pedestrian.A     = 10+12+3');
    assertEq(out.pedestrian.B,     65,  'pedestrian.B     = 20+40+5');
    assertEq(out.pedestrian.C,     95,  'pedestrian.C     = 30+50+15');
    assertEq(out.pedestrian.O,     150, 'pedestrian.O     = 35+90+25');
    // Speeding: 70+30 = 100
    assertEq(out.speeding.total,   100, 'speeding.total   = 70+30');
    assertEq(out.speeding.K,       5,   'speeding.K       = 4+1');
    // Crashes array placeholder still empty
    assert(Array.isArray(out.pedestrian.crashes) && out.pedestrian.crashes.length === 0,
        'pedestrian.crashes is empty array (lazy-fetch placeholder)');
}

async function test3_analysisBreakdown_accumulates() {
    console.log('\n3. getAnalysisBreakdown — accumulates across counties at aggregate tier');
    const ctx = loadClient();
    stubFetch(ctx, [
        // year=2023 across 3 counties
        { dimension: 'year',      dim_value: '2023', total: 1000, k: 10, a: 20, b: 100, c: 300, o: 570, physical_juris_name: 'Kent' },
        { dimension: 'year',      dim_value: '2023', total: 2000, k: 15, a: 30, b: 200, c: 600, o: 1155, physical_juris_name: 'New Castle' },
        { dimension: 'year',      dim_value: '2023', total: 500,  k:  5, a: 10, b:  50, c: 150, o:  285, physical_juris_name: 'Sussex' },
        // month=6 across 2 counties
        { dimension: 'month',     dim_value: '6',    total: 80,   k: 1, a: 2, b: 8,  c: 20, o: 49, physical_juris_name: 'Kent' },
        { dimension: 'month',     dim_value: '6',    total: 120,  k: 2, a: 3, b: 12, c: 30, o: 73, physical_juris_name: 'New Castle' },
        // severity=K across 3 counties
        { dimension: 'severity',  dim_value: 'K',    total: 15,   k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'Kent' },
        { dimension: 'severity',  dim_value: 'K',    total: 25,   k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'New Castle' },
        { dimension: 'severity',  dim_value: 'K',    total: 5,    k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'Sussex' },
        // collision=Rear End across 2 counties
        { dimension: 'collision', dim_value: 'Rear End', total: 400, k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'Kent' },
        { dimension: 'collision', dim_value: 'Rear End', total: 600, k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'New Castle' },
        // hour=17 across 2 counties
        { dimension: 'hour',      dim_value: '17', total: 50, k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'Kent' },
        { dimension: 'hour',      dim_value: '17', total: 70, k: 0, a: 0, b: 0, c: 0, o: 0, physical_juris_name: 'New Castle' },
    ]);
    const out = await makeClient(ctx).getAnalysisBreakdown('state', 'delaware');

    assertEq(out.byYear['2023'].total, 3500, 'byYear[2023].total = 1000+2000+500');
    assertEq(out.byYear['2023'].K,     30,   'byYear[2023].K     = 10+15+5');
    assertEq(out.byYear['2023'].A,     60,   'byYear[2023].A     = 20+30+10');
    assertEq(out.byYear['2023'].B,     350,  'byYear[2023].B     = 100+200+50');
    assertEq(out.byYear['2023'].O,     2010, 'byYear[2023].O     = 570+1155+285');

    assertEq(out.byMonth['6'].total,   200,  'byMonth[6].total   = 80+120');
    assertEq(out.bySeverity.K,         45,   'bySeverity.K      = 15+25+5');
    assertEq(out.byCollision['Rear End'], 1000, 'byCollision[Rear End] = 400+600');
    assertEq(out.byHour['17'],         120,  'byHour[17]        = 50+70');
}

async function test4_limits_raised() {
    console.log('\n4. Limits raised — safety=2000, analysis=10000');
    // safety
    let ctx = loadClient();
    let calls = stubFetch(ctx, []);
    await makeClient(ctx).getSafetyCategories('state', 'delaware');
    assertIncludes(decodeUrl(calls[0].url), 'limit=2000', 'getSafetyCategories sends limit=2000');
    assertNotIncludes(decodeUrl(calls[0].url), 'limit=100&', 'old limit=100 removed');

    // analysis
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getAnalysisBreakdown('state', 'delaware');
    assertIncludes(decodeUrl(calls[0].url), 'limit=10000', 'getAnalysisBreakdown sends limit=10000');
    assertNotIncludes(decodeUrl(calls[0].url), 'limit=1000&', 'old limit=1000 removed');
}

async function test5_safetyCategories_no_year_filter() {
    console.log('\n5. getSafetyCategories — must NOT send `crash_year` filter');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    await makeClient(ctx).getSafetyCategories('state', 'delaware', {
        yearFrom: 2020, yearTo: 2024,
    });
    const u = decodeUrl(calls[0].url);
    assertNotIncludes(u, 'crash_year', 'no crash_year token anywhere in URL');
    assertNotIncludes(u, 'and=', 'no and=(...) clause emitted');
}

async function test6_analysisBreakdown_no_year_filter() {
    console.log('\n6. getAnalysisBreakdown — must NOT send `crash_year` filter');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    await makeClient(ctx).getAnalysisBreakdown('state', 'delaware', {
        yearFrom: 2020, yearTo: 2024,
    });
    const u = decodeUrl(calls[0].url);
    assertNotIncludes(u, 'crash_year', 'no crash_year token anywhere in URL');
    assertNotIncludes(u, 'and=', 'no and=(...) clause emitted');
}

async function test7a_hotspots_merge_road_types() {
    console.log('\n7a. getHotspots — merges across road_type buckets when no roadType filter');
    const ctx = loadClient();
    // Same physical location shows up 3x (once per bucket) — must merge into 1.
    // Plus a separate location that only has 1 bucket — must remain as 1.
    stubFetch(ctx, [
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', road_type: 'dot_roads',
          total_crashes: 30, k: 1, a: 2, b: 5, c: 10, o: 12, epdo: 1500, ped_count: 3, bike_count: 1 },
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', road_type: 'non_dot_roads',
          total_crashes: 20, k: 0, a: 1, b: 3, c: 8,  o: 8,  epdo: 800,  ped_count: 1, bike_count: 0 },
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', road_type: 'all_roads',
          total_crashes: 5,  k: 0, a: 0, b: 1, c: 1,  o: 3,  epdo: 100,  ped_count: 0, bike_count: 0 },
        { location_type: 'intersection', location_name: 'C & D', rte_name: 'US-13', road_type: 'dot_roads',
          total_crashes: 10, k: 0, a: 1, b: 2, c: 3,  o: 4,  epdo: 200,  ped_count: 0, bike_count: 0 },
        { location_type: 'segment',      location_name: 'SR-1 mp 5', rte_name: 'SR-1', road_type: 'dot_roads',
          total_crashes: 8,  k: 0, a: 0, b: 1, c: 2,  o: 5,  epdo: 90,   ped_count: 0, bike_count: 0 },
    ]);
    const out = await makeClient(ctx).getHotspots('county', 'Kent', { limit: 100 });

    assertEq(out.intersections.length, 2, 'A&B merged into 1 row, C&D remains; total 2 intersections');
    assertEq(out.segments.length,      1, 'one segment row');

    // Find the merged A&B row (frontend Title-Case key)
    const ab = out.intersections.find(r => r['location_name'] === 'A & B');
    assert(!!ab, 'merged A & B row present');
    if (ab) {
        // total_crashes 30+20+5 = 55, epdo 1500+800+100 = 2400, ped 3+1+0 = 4
        // Note: snake-case keys not in COL_MAP pass through unchanged.
        assertEq(ab.total_crashes, 55,   'total_crashes summed across 3 buckets');
        assertEq(ab.k,             1,    'K summed');
        assertEq(ab.a,             3,    'A summed');
        assertEq(ab.b,             9,    'B summed');
        assertEq(ab.c,             19,   'C summed');
        assertEq(ab.o,             23,   'O summed');
        assertEq(ab.epdo,          2400, 'epdo summed');
        assertEq(ab.ped_count,     4,    'ped_count summed');
        assertEq(ab.bike_count,    1,    'bike_count summed');
    }

    // Sort order: A&B (epdo=2400) should come before C&D (epdo=200)
    assertEq(out.intersections[0]['location_name'], 'A & B', 'highest-EPDO row sorted first after merge');
}

async function test7a_hotspots_no_merge_when_roadType_set() {
    console.log('\n7a-bis. getHotspots — does NOT merge when roadType filter IS set');
    const ctx = loadClient();
    const calls = stubFetch(ctx, [
        { location_type: 'intersection', location_name: 'X', rte_name: 'R1', road_type: 'dot_roads',
          total_crashes: 10, k: 0, a: 0, b: 0, c: 0, o: 10, epdo: 10, ped_count: 0, bike_count: 0 },
    ]);
    await makeClient(ctx).getHotspots('county', 'Kent', { roadType: 'dot_roads', limit: 100 });
    assertIncludes(decodeUrl(calls[0].url), 'road_type=eq.dot_roads', 'road_type filter sent');
}

async function test7b_grants_merge_road_types() {
    console.log('\n7b. getGrantsBaseline — merges across road_type buckets when no roadType filter');
    const ctx = loadClient();
    // Same (location, year) appears in 2 buckets; another year for the same
    // location stays separate; a different location stays separate.
    stubFetch(ctx, [
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', crash_year: 2023, road_type: 'dot_roads',
          total_crashes: 30, k: 1, a: 2, b: 5, c: 10, o: 12, epdo: 1500, ped: 3, bike: 1 },
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', crash_year: 2023, road_type: 'non_dot_roads',
          total_crashes: 20, k: 0, a: 1, b: 3, c: 8,  o: 8,  epdo: 800,  ped: 1, bike: 0 },
        { location_type: 'intersection', location_name: 'A & B', rte_name: 'SR-1', crash_year: 2024, road_type: 'dot_roads',
          total_crashes: 25, k: 1, a: 1, b: 4, c: 9,  o: 10, epdo: 1300, ped: 2, bike: 0 },
        { location_type: 'intersection', location_name: 'C & D', rte_name: 'US-13', crash_year: 2023, road_type: 'dot_roads',
          total_crashes: 10, k: 0, a: 1, b: 2, c: 3,  o: 4,  epdo: 200,  ped: 0, bike: 0 },
    ]);
    const rows = await makeClient(ctx).getGrantsBaseline('county', 'Kent');
    // Expected merged set: (A&B, 2023) [merged], (A&B, 2024) [single], (C&D, 2023) [single] = 3 rows
    assertEq(rows.length, 3, '3 unique (location, year) rows after merge');

    // Note: post-_pgToFrontend, `crash_year` → 'Crash Year' (Title Case from COL_MAP).
    // `location_name`/`location_type`/`total_crashes`/`epdo`/`ped`/`bike` are NOT in
    // COL_MAP so they pass through unchanged.
    const ab2023 = rows.find(r => r['location_name'] === 'A & B' && r['Crash Year'] === 2023);
    assert(!!ab2023, '(A & B, 2023) merged row present');
    if (ab2023) {
        assertEq(ab2023.total_crashes, 50,   'total_crashes 30+20');
        assertEq(ab2023.epdo,          2300, 'epdo 1500+800');
        assertEq(ab2023.ped,           4,    'ped 3+1');
    }
    const ab2024 = rows.find(r => r['location_name'] === 'A & B' && r['Crash Year'] === 2024);
    assert(!!ab2024, '(A & B, 2024) row present (different year, NOT merged with 2023)');
    if (ab2024) assertEq(ab2024.total_crashes, 25, '(A & B, 2024) total preserved');

    // Sorted by epdo desc — A&B 2023 (2300) > A&B 2024 (1300) > C&D 2023 (200)
    assertEq(rows[0]['location_name'], 'A & B', 'first row is highest EPDO');
    assertEq(rows[0]['Crash Year'],    2023,    'first row is the merged 2023');
}

async function test7b_grants_no_merge_when_roadType_set() {
    console.log('\n7b-bis. getGrantsBaseline — does NOT merge when roadType filter IS set');
    const ctx = loadClient();
    const calls = stubFetch(ctx, [
        { location_type: 'intersection', location_name: 'X', rte_name: 'R1', crash_year: 2023, road_type: 'dot_roads',
          total_crashes: 10, k: 0, a: 0, b: 0, c: 0, o: 10, epdo: 10, ped: 0, bike: 0 },
    ]);
    const rows = await makeClient(ctx).getGrantsBaseline('county', 'Kent', { roadType: 'dot_roads', yearFrom: 2020, yearTo: 2024 });
    const u = decodeUrl(calls[0].url);
    assertIncludes(u, 'road_type=eq.dot_roads', 'road_type filter sent');
    assertIncludes(u, 'and=(crash_year.gte.2020,crash_year.lte.2024)', 'year filter still works on grants matview (it has crash_year)');
    assertEq(rows.length, 1, 'returned single row unchanged');
}

async function test_county_tier_unchanged() {
    console.log('\nRegression — county tier (single-row-per-category) still works');
    const ctx = loadClient();
    stubFetch(ctx, [
        { category: 'pedestrian', total: 100, k: 5, a: 10, b: 20, c: 30, o: 35, physical_juris_name: 'Kent' },
    ]);
    const out = await makeClient(ctx).getSafetyCategories('county', 'Kent');
    assertEq(out.pedestrian.total, 100, 'county-tier pedestrian.total preserved (single row)');
    assertEq(out.pedestrian.K,     5,   'county-tier K preserved');
}

async function test_no_data_returns_empty() {
    console.log('\nRegression — empty matview response returns empty containers');
    let ctx = loadClient();
    stubFetch(ctx, []);
    const safety = await makeClient(ctx).getSafetyCategories('state', 'delaware');
    assertEq(typeof safety, 'object', 'safety returns an object even when empty');
    assertEq(Object.keys(safety).length, 0, 'safety object has no keys when empty');

    ctx = loadClient();
    stubFetch(ctx, []);
    const analysis = await makeClient(ctx).getAnalysisBreakdown('state', 'delaware');
    assertEq(typeof analysis.byYear,    'object', 'analysis.byYear exists');
    assertEq(typeof analysis.byMonth,   'object', 'analysis.byMonth exists');
    assertEq(analysis.bySeverity.K,     0,        'analysis.bySeverity.K initialized to 0');

    ctx = loadClient();
    stubFetch(ctx, []);
    const hotspots = await makeClient(ctx).getHotspots('state', 'delaware');
    assertEq(hotspots.intersections.length, 0, 'hotspots.intersections=[] when empty');
    assertEq(hotspots.segments.length,      0, 'hotspots.segments=[] when empty');

    ctx = loadClient();
    stubFetch(ctx, []);
    const grants = await makeClient(ctx).getGrantsBaseline('state', 'delaware');
    assert(Array.isArray(grants) && grants.length === 0, 'grants=[] when empty');
}

// ───────── Runner ─────────
(async () => {
    console.log('═══════════════════════════════════════════════');
    console.log(' Matview frontend bug test (7 bugs)');
    console.log('═══════════════════════════════════════════════');

    await test1_getHotspots_no_limit_n();
    await test2_safetyCategories_accumulates();
    await test3_analysisBreakdown_accumulates();
    await test4_limits_raised();
    await test5_safetyCategories_no_year_filter();
    await test6_analysisBreakdown_no_year_filter();
    await test7a_hotspots_merge_road_types();
    await test7a_hotspots_no_merge_when_roadType_set();
    await test7b_grants_merge_road_types();
    await test7b_grants_no_merge_when_roadType_set();
    await test_county_tier_unchanged();
    await test_no_data_returns_empty();

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
