/**
 * Phase 4 — data-client filter & URL-building bug test.
 *
 * Verifies that CrashLensDataClient builds the correct Supabase REST URL for
 * every filter combination introduced in Phase 4 (Dashboard/Analysis search,
 * CMF/Warrants location load, bulk export). Uses a fetch stub that captures
 * the outgoing request, so no Supabase connectivity is required.
 *
 * Covers the bugs that would break the Phase 4 tables:
 *   A. Text-search ilike `or=(...)` clause over route/collision/doc_nbr/
 *      intersection/weather
 *   B. Node filter wired as `node=eq.<value>`
 *   C. pedBike 'ped' / 'bike' / 'either' — the 'either' case must produce an
 *      OR clause combined with any text search
 *   D. Multi-severity via `in.(...)` when array is supplied (single-value
 *      array collapses to eq.)
 *   E. Date range via `and=(crash_date.gte.X,crash_date.lte.Y)`
 *   F. Bulk fetch (filters.all) bypasses pagination and sets `limit`
 *   G. Paginated mode sets `Range` header + `Prefer: count=exact`
 *   H. Tier filter (`physical_juris_name=eq.<value>`) is NOT overridden by
 *      user-supplied filters
 *   I. getCrashesByLocation maps type='route' → rte_name eq, type='node' →
 *      node eq, and rejects anything else
 *   J. Column mapping: snake_case response → Title Case (COL) keys the UI
 *      expects (e.g. rte_name → 'RTE Name')
 *
 * Run with:  node tests/test_phase4_data_client.js
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

// ───────── Load class into a sandbox ─────────
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
        fetch: null,  // filled per test
    };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(src, ctx);
    return ctx;
}

// Build a fetch stub that records the URL + headers, then returns `responseBody`.
function stubFetch(ctx, responseBody, responseHeaders = {}) {
    const calls = [];
    ctx.fetch = async (url, init = {}) => {
        calls.push({ url: String(url), init, headers: init.headers || {} });
        const headers = {
            get(name) { return responseHeaders[name.toLowerCase()] || responseHeaders[name] || null; }
        };
        return {
            ok: true,
            status: 200,
            headers,
            json: async () => responseBody,
        };
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

// ───────── Tests ─────────
// URLSearchParams encodes space as `+` — decodeURIComponent leaves `+` alone, so
// normalise it back to a space before substring assertions.
function decodeUrl(url) {
    return decodeURIComponent(String(url).replace(/\+/g, ' '));
}

async function testTextSearchIlike() {
    console.log('\nA. Text search ilike OR clause');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    const c = makeClient(ctx);
    await c.getCrashes('county', 'Kent', { text: 'main st', page: 1 }).catch(() => {});
    const url = calls[0].url;
    assertIncludes(url, 'or=', 'sends or= parameter');
    const u = decodeUrl(url);
    assertIncludes(u, 'rte_name.ilike.*main st*', 'ilike on rte_name');
    assertIncludes(u, 'collision_type.ilike.*main st*', 'ilike on collision_type');
    assertIncludes(u, 'document_nbr.ilike.*main st*', 'ilike on document_nbr');
    assertIncludes(u, 'intersection_name.ilike.*main st*', 'ilike on intersection_name');
    assertIncludes(u, 'weather_condition.ilike.*main st*', 'ilike on weather_condition');
}

async function testNodeFilter() {
    console.log('\nB. Node filter');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    const c = makeClient(ctx);
    await c.getCrashes('county', 'Kent', { node: 'N12345', page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'node=eq.N12345', 'node=eq.N12345 on URL');
}

async function testPedBikeEither() {
    console.log('\nC. pedBike filter');
    // ped → pedestrian=eq.Yes
    let ctx = loadClient();
    let calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { pedBike: 'ped', page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'pedestrian=eq.Yes', 'pedBike=ped → pedestrian=eq.Yes');

    // bike → bike=eq.Yes
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { pedBike: 'bike', page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'bike=eq.Yes', 'pedBike=bike → bike=eq.Yes');

    // either (alone) → or=(pedestrian.eq.Yes,bike.eq.Yes)
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { pedBike: 'either', page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'or=(pedestrian.eq.Yes,bike.eq.Yes)', 'pedBike=either → or=(...)');

    // either + text — either clause must fall into the `and=` group (not overwrite `or=`)
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { pedBike: 'either', text: 'crash', page: 1 }).catch(() => {});
    const u = decodeURIComponent(calls[0].url);
    assertIncludes(u, 'rte_name.ilike.*crash*', 'text search preserved');
    assertIncludes(u, 'or(pedestrian.eq.Yes,bike.eq.Yes)', 'either pushed into and= group');
}

async function testMultiSeverity() {
    console.log('\nD. Multi-severity filter');
    // Array with 2+ → in.(...)
    let ctx = loadClient();
    let calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { severity: ['K', 'A'], page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'crash_severity=in.(K,A)', 'array severity uses in.()');

    // Array with 1 → eq.
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { severity: ['K'], page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'crash_severity=eq.K', 'single-element array severity uses eq.');

    // String → eq.
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', { severity: 'A', page: 1 }).catch(() => {});
    assertIncludes(decodeURIComponent(calls[0].url), 'crash_severity=eq.A', 'string severity uses eq.');
}

async function testDateRange() {
    console.log('\nE. Date range');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', {
        dateFrom: '2024-01-01', dateTo: '2024-12-31', page: 1
    }).catch(() => {});
    const u = decodeURIComponent(calls[0].url);
    assertIncludes(u, 'and=(crash_date.gte.2024-01-01,crash_date.lte.2024-12-31)', 'date range wired as and=(...)');
}

async function testBulkFetchMode() {
    console.log('\nF. Bulk fetch (filters.all)');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    const c = makeClient(ctx);
    await c.getCrashes('county', 'Kent', { all: true, maxRows: 7777, route: 'SR-1' }).catch(() => {});
    const req = calls[0];
    const u = decodeURIComponent(req.url);
    assertIncludes(u, 'rte_name=eq.SR-1', 'route filter preserved');
    assertIncludes(u, 'limit=7777', 'uses explicit maxRows as limit');
    assertNotIncludes(Object.keys(req.headers).map(h => h.toLowerCase()).join(','), 'range', 'no Range header in bulk mode');
    assertEq(req.headers['Prefer'] || null, null, 'no Prefer: count=exact in bulk mode');
}

async function testPaginationHeaders() {
    console.log('\nG. Pagination headers');
    const ctx = loadClient();
    const calls = stubFetch(ctx, [], { 'content-range': '0-24/5123' });
    const c = makeClient(ctx);
    const result = await c.getCrashes('county', 'Kent', { page: 3, pageSize: 50 });
    const req = calls[0];
    assertEq(req.headers['Range'], '100-149', 'Range header for page 3, size 50');
    assertEq(req.headers['Prefer'], 'count=exact', 'Prefer: count=exact header set');
    assertEq(result.total, 5123, 'total parsed from Content-Range');
    assertEq(result.page, 3, 'echoes page number');
    assertEq(result.pageSize, 50, 'echoes pageSize');
}

async function testTierNotOverridden() {
    console.log('\nH. Tier filter not overridden');
    const ctx = loadClient();
    const calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashes('county', 'Kent', {
        route: 'SR-1', node: 'N123', severity: 'K', page: 1
    }).catch(() => {});
    const u = decodeURIComponent(calls[0].url);
    assertIncludes(u, 'state=eq.delaware', 'state filter preserved');
    assertIncludes(u, 'physical_juris_name=eq.Kent', 'county tier filter preserved');
    assertIncludes(u, 'rte_name=eq.SR-1', 'route filter preserved');
    assertIncludes(u, 'node=eq.N123', 'node filter preserved');
    assertIncludes(u, 'crash_severity=eq.K', 'severity filter preserved');
}

async function testGetCrashesByLocation() {
    console.log('\nI. getCrashesByLocation');
    // route
    let ctx = loadClient();
    let calls = stubFetch(ctx, [{ rte_name: 'SR-1', crash_severity: 'K' }]);
    const rows = await makeClient(ctx).getCrashesByLocation('county', 'Kent', 'route', 'SR-1');
    const u = decodeURIComponent(calls[0].url);
    assertIncludes(u, 'rte_name=eq.SR-1', 'route location maps to rte_name=eq');
    assertIncludes(u, 'limit=10000', 'default bulk cap = 10000');
    assertEq(rows.length, 1, 'returns unwrapped rows array');
    assertEq(rows[0]['RTE Name'], 'SR-1', 'row keys are Title Case (matching COL)');
    assertEq(rows[0]['Crash Severity'], 'K', 'severity mapped to Title Case');

    // node
    ctx = loadClient();
    calls = stubFetch(ctx, []);
    await makeClient(ctx).getCrashesByLocation('county', 'Kent', 'node', 'N12345');
    assertIncludes(decodeURIComponent(calls[0].url), 'node=eq.N12345', 'node location maps to node=eq');

    // invalid type rejected
    ctx = loadClient();
    stubFetch(ctx, []);
    let threw = false;
    try {
        await makeClient(ctx).getCrashesByLocation('county', 'Kent', 'corridor', 'X');
    } catch (e) {
        threw = /locationType must be/.test(e.message);
    }
    assert(threw, 'invalid locationType throws');
}

async function testColumnMapping() {
    console.log('\nJ. Column mapping (snake_case → Title Case)');
    const ctx = loadClient();
    stubFetch(ctx, [{
        objectid: 1,
        document_nbr: 'DOC-1',
        crash_severity: 'K',
        crash_year: 2023,
        rte_name: 'SR-1',
        node: 'N99',
        pedestrian: 'Yes',
        bike: 'No',
        collision_type: 'Angle',
        weather_condition: 'Clear',
    }], { 'content-range': '0-0/1' });
    const c = makeClient(ctx);
    const result = await c.getCrashes('county', 'Kent', { page: 1 });
    const r = result.rows[0];
    // Must match values in app/modules/core/constants.js COL map exactly
    assertEq(r['Document Nbr'], 'DOC-1', 'document_nbr → Document Nbr');
    assertEq(r['Crash Severity'], 'K', 'crash_severity → Crash Severity');
    assertEq(r['Crash Year'], 2023, 'crash_year → Crash Year');
    assertEq(r['RTE Name'], 'SR-1', 'rte_name → RTE Name');
    assertEq(r['Node'], 'N99', 'node → Node');
    assertEq(r['Pedestrian?'], 'Yes', 'pedestrian → Pedestrian?');
    assertEq(r['Bike?'], 'No', 'bike → Bike?');
    assertEq(r['Collision Type'], 'Angle', 'collision_type → Collision Type');
    assertEq(r['Weather Condition'], 'Clear', 'weather_condition → Weather Condition');
}

async function testLocalFilterFallback() {
    console.log('\nK. R2 fallback _filterLocally handles new filters');
    const ctx = loadClient();
    // Force R2 fallback — preferSupabase false
    const c = new ctx.CrashLensDataClient({ state: 'delaware', preferSupabase: false });
    const rows = [
        { 'Document Nbr': 'A', 'Crash Year': 2023, 'Crash Severity': 'K', 'RTE Name': 'R1', 'Node': 'N1', 'Pedestrian?': 'Yes', 'Bike?': 'No', 'Collision Type': 'Angle', 'Weather Condition': 'Clear', 'Crash Date': '2023-05-01', 'Intersection Name': 'Main & 1st' },
        { 'Document Nbr': 'B', 'Crash Year': 2024, 'Crash Severity': 'A', 'RTE Name': 'R2', 'Node': 'N2', 'Pedestrian?': 'No', 'Bike?': 'Yes', 'Collision Type': 'Rear-End', 'Weather Condition': 'Rain', 'Crash Date': '2024-07-15', 'Intersection Name': 'Main & 2nd' },
        { 'Document Nbr': 'C', 'Crash Year': 2024, 'Crash Severity': 'B', 'RTE Name': 'R1', 'Node': 'N3', 'Pedestrian?': 'No', 'Bike?': 'No', 'Collision Type': 'Angle', 'Weather Condition': 'Clear', 'Crash Date': '2024-09-09', 'Intersection Name': 'Main & 3rd' }
    ];
    // Node filter
    let out = c._filterLocally(rows, { node: 'N2', page: 1 });
    assertEq(out.rows.length, 1, 'node filter fallback isolates 1 row');
    assertEq(out.rows[0]['Document Nbr'], 'B', 'node N2 → doc B');

    // Text search (matches Intersection Name)
    out = c._filterLocally(rows, { text: '2nd', page: 1 });
    assertEq(out.rows.length, 1, 'text matches intersection name');
    assertEq(out.rows[0]['Document Nbr'], 'B', 'text 2nd → doc B');

    // pedBike either
    out = c._filterLocally(rows, { pedBike: 'either', page: 1 });
    assertEq(out.rows.length, 2, 'pedBike=either matches ped OR bike');

    // Date range
    out = c._filterLocally(rows, { dateFrom: '2024-01-01', dateTo: '2024-08-01', page: 1 });
    assertEq(out.rows.length, 1, 'date range narrows to 2024-07-15');
    assertEq(out.rows[0]['Document Nbr'], 'B', 'date range → doc B');

    // Multi-severity
    out = c._filterLocally(rows, { severity: ['K', 'A'], page: 1 });
    assertEq(out.rows.length, 2, 'array severity matches K+A');

    // Bulk mode
    out = c._filterLocally(rows, { all: true });
    assertEq(out.rows.length, 3, 'bulk mode returns all rows');
}

// ───────── Runner ─────────
(async () => {
    console.log('═══════════════════════════════════════════════');
    console.log(' Phase 4 data-client bug test');
    console.log('═══════════════════════════════════════════════');

    await testTextSearchIlike();
    await testNodeFilter();
    await testPedBikeEither();
    await testMultiSeverity();
    await testDateRange();
    await testBulkFetchMode();
    await testPaginationHeaders();
    await testTierNotOverridden();
    await testGetCrashesByLocation();
    await testColumnMapping();
    await testLocalFilterFallback();

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
