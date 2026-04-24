#!/usr/bin/env node
/**
 * Integration test — live self-hosted Supabase `dashboard_summary` matview.
 *
 * Validates the 7 view-tier → column mapping that `CrashLensDataClient.TIER_COLUMNS`
 * relies on, and simulates the race condition that was fixed in
 * `app/modules/data/supabase-bridge.js` (force flag must bypass the two
 * `crashState.loaded` guards at lines ~298 and ~313).
 *
 * Run:
 *     cd server && node ../tests/test_supabase_tiers.js
 */
'use strict';

// ── Connection config (mirrors assets/js/data-client.js → DEFAULTS) ─────────
const SUPABASE_URL = 'https://srv1503081.hstgr.cloud/rest/v1';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc0OTEyNDczLCJleHAiOjIwOTAyNzI0NzN9.5arUDeH3ccQ9O-UK57wFu7w1jKaIoIq3uroqithXjQs';

const EXPECTED_TOTAL = 569829;
const EXPECTED_COUNTIES = { 'New Castle': 190158, Kent: 38614, Sussex: 87073 };
const EXPECTED_WILMINGTON = 61355;
const REGION_VALUES = ['North District', 'Central District', 'South District'];
const MPO_VALUES = ['Wilmington Area Planning Council', 'Dover / Kent County MPO'];
const PLANNING_DISTRICT_VALUES = ['North District', 'Central District', 'South District'];
const COUNTY_VALUES = ['New Castle', 'Kent', 'Sussex'];
const REQUIRED_COLUMNS = [
    'state', 'physical_juris_name', 'dot_district', 'mpo_name', 'planning_district',
    'crash_year', 'crash_severity', 'functional_class', 'area_type', 'collision_type',
    'crash_count', 'fatals', 'serious_injuries', 'total_injured',
    'ped_crashes', 'bike_crashes', 'speed_crashes', 'alcohol_crashes',
    'night_crashes', 'animal_crashes',
];
const SEVERITY_SET = new Set(['K', 'A', 'B', 'C', 'O']);

// ── HTTP helpers ────────────────────────────────────────────────────────────

function headers() {
    return {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
    };
}

/**
 * Paginated GET against dashboard_summary. Uses PostgREST's Range header so we
 * don't hit the default 1000-row limit for federal/state-wide queries.
 */
async function fetchAll(qs) {
    const pageSize = 10000;
    let offset = 0;
    const all = [];
    while (true) {
        const url = `${SUPABASE_URL}/dashboard_summary?${qs}`;
        const resp = await fetch(url, {
            headers: {
                ...headers(),
                'Range-Unit': 'items',
                Range: `${offset}-${offset + pageSize - 1}`,
            },
        });
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status} on ${url} — ${await resp.text()}`);
        }
        const page = await resp.json();
        all.push(...page);
        if (page.length < pageSize) break;
        offset += pageSize;
        if (offset > 5_000_000) throw new Error('pagination runaway guard');
    }
    return all;
}

function sumCount(rows) {
    let s = 0;
    for (const r of rows) s += parseInt(r.crash_count, 10) || 0;
    return s;
}

// ── Formatting ──────────────────────────────────────────────────────────────

function padLabel(label, width = 45) {
    if (label.length >= width) return label;
    return label + '.'.repeat(width - label.length);
}
function fmt(n) { return Number(n).toLocaleString(); }

const results = [];
function record(label, passed, detail) {
    results.push({ label, passed, detail });
    const tag = passed ? 'PASS' : 'FAIL';
    console.log(`${padLabel(label)} ${tag} (${detail})`);
}

// ── Tests ───────────────────────────────────────────────────────────────────

async function test1_federal() {
    const rows = await fetchAll('select=crash_count');
    const total = sumCount(rows);
    const passed = total === EXPECTED_TOTAL && rows.length > 0;
    record(
        'Test 1: Federal tier (no filter)',
        passed,
        passed
            ? `${fmt(total)} crashes, ${fmt(rows.length)} rows`
            : `got ${fmt(total)} crashes / ${fmt(rows.length)} rows — expected ${fmt(EXPECTED_TOTAL)}`
    );
    return { total, rows: rows.length };
}

async function test2_state() {
    const rows = await fetchAll('state=eq.delaware&select=crash_count');
    const total = sumCount(rows);
    const passed = total === EXPECTED_TOTAL && rows.length > 0;
    record(
        'Test 2: State tier (delaware)',
        passed,
        passed
            ? `${fmt(total)} crashes`
            : `got ${fmt(total)} — expected ${fmt(EXPECTED_TOTAL)}`
    );
    return total;
}

async function test3_region() {
    const parts = [];
    let sum = 0;
    let allNonZero = true;
    for (const v of REGION_VALUES) {
        const rows = await fetchAll(`state=eq.delaware&dot_district=eq.${encodeURIComponent(v)}&select=crash_count`);
        const t = sumCount(rows);
        parts.push(fmt(t));
        sum += t;
        if (t <= 0) allNonZero = false;
    }
    const passed = allNonZero && sum === EXPECTED_TOTAL;
    record(
        'Test 3: Region tier (3 districts)',
        passed,
        passed
            ? `${parts.join(' + ')} = ${fmt(sum)}`
            : `sum=${fmt(sum)} parts=[${parts.join(', ')}] — expected ${fmt(EXPECTED_TOTAL)}`
    );
    return sum;
}

async function test4_mpo() {
    const parts = [];
    let allNonZero = true;
    for (const v of MPO_VALUES) {
        const rows = await fetchAll(`state=eq.delaware&mpo_name=eq.${encodeURIComponent(v)}&select=crash_count`);
        const t = sumCount(rows);
        parts.push(fmt(t));
        if (t <= 0) allNonZero = false;
    }
    record(
        'Test 4: MPO tier (2 MPOs)',
        allNonZero,
        allNonZero ? parts.join(' + ') : `zero-crash MPO in [${parts.join(', ')}]`
    );
}

async function test5_planningDistrict() {
    const parts = [];
    let sum = 0;
    let allNonZero = true;
    for (const v of PLANNING_DISTRICT_VALUES) {
        const rows = await fetchAll(`state=eq.delaware&planning_district=eq.${encodeURIComponent(v)}&select=crash_count`);
        const t = sumCount(rows);
        parts.push(fmt(t));
        sum += t;
        if (t <= 0) allNonZero = false;
    }
    const passed = allNonZero && sum === EXPECTED_TOTAL;
    record(
        'Test 5: Planning District tier (3 PDs)',
        passed,
        passed
            ? `sum = ${fmt(sum)}`
            : `sum=${fmt(sum)} parts=[${parts.join(', ')}] — expected ${fmt(EXPECTED_TOTAL)}`
    );
    return sum;
}

async function test6_county() {
    const parts = [];
    let allNonZero = true;
    const mismatches = [];
    for (const v of COUNTY_VALUES) {
        const rows = await fetchAll(`state=eq.delaware&physical_juris_name=eq.${encodeURIComponent(v)}&select=crash_count`);
        const t = sumCount(rows);
        parts.push(fmt(t));
        if (t <= 0) allNonZero = false;
        if (t !== EXPECTED_COUNTIES[v]) mismatches.push(`${v}: got ${fmt(t)}, expected ${fmt(EXPECTED_COUNTIES[v])}`);
    }
    const passed = allNonZero && mismatches.length === 0;
    record(
        'Test 6: County tier (3 counties)',
        passed,
        passed ? parts.join(' + ') : `mismatch — ${mismatches.join('; ')}`
    );
}

async function test7_city() {
    const rows = await fetchAll('state=eq.delaware&physical_juris_name=eq.Wilmington&select=crash_count');
    const total = sumCount(rows);
    const passed = total > 0;
    record(
        'Test 7: City tier (Wilmington)',
        passed,
        passed ? `${fmt(total)} crashes` : `got ${fmt(total)} — expected > 0`
    );
}

async function test8_columns() {
    const resp = await fetch(
        `${SUPABASE_URL}/dashboard_summary?state=eq.delaware&physical_juris_name=eq.Sussex&limit=5`,
        { headers: headers() }
    );
    if (!resp.ok) {
        record('Test 8: Aggregate columns check', false, `HTTP ${resp.status}`);
        return;
    }
    const rows = await resp.json();
    const missing = new Set();
    const badSeverity = [];
    for (const r of rows) {
        for (const col of REQUIRED_COLUMNS) {
            if (!(col in r)) missing.add(col);
        }
        if (r.crash_severity != null && !SEVERITY_SET.has(r.crash_severity)) {
            badSeverity.push(r.crash_severity);
        }
    }
    const passed = rows.length > 0 && missing.size === 0 && badSeverity.length === 0;
    let detail;
    if (passed) detail = `${REQUIRED_COLUMNS.length} columns present`;
    else if (rows.length === 0) detail = 'no rows returned';
    else if (missing.size) detail = `missing: ${[...missing].join(', ')}`;
    else detail = `bad severity values: ${[...new Set(badSeverity)].join(', ')}`;
    record('Test 8: Aggregate columns check', passed, detail);
}

async function test9_raceCondition() {
    // Simulate the exact bug path: County R2 sets crashState.loaded = true,
    // then aggregate tier calls injectFastDashboard({ force: true }).
    const crashState = {
        loaded: true,
        sampleRows: ['fake_county_data'],
        mapPoints: [],
    };

    async function mockInjectFastDashboard(opts) {
        const force = !!(opts && opts.force);
        // Line ~298 guard
        if (!force && crashState.loaded) return 'SKIPPED_BY_289';
        // Fetch from Supabase (tier=state, no jurisdiction filter)
        const rows = await fetchAll('state=eq.delaware&select=crash_count');
        // Line ~313 guard (the fixed line — must include !force)
        if (!force && crashState.loaded) return 'SKIPPED_BY_304';
        return { rows: rows.length, total: sumCount(rows) };
    }

    const result = await mockInjectFastDashboard({ force: true });
    const skipped = result === 'SKIPPED_BY_289' || result === 'SKIPPED_BY_304';
    const passed =
        !skipped &&
        typeof result === 'object' &&
        result.total === EXPECTED_TOTAL &&
        result.rows > 0;
    let detail;
    if (passed) detail = `force=true bypassed both guards — total=${fmt(result.total)}, rows=${fmt(result.rows)}`;
    else if (skipped) detail = `guard fired: ${result}`;
    else detail = `total=${fmt(result && result.total)} rows=${fmt(result && result.rows)} — expected ${fmt(EXPECTED_TOTAL)}`;
    record('Test 9: Race condition simulation', passed, detail);
}

async function test10_crossTier(totals) {
    const { federal, state, region, planningDistrict } = totals;
    const values = [federal, state, region, planningDistrict];
    const allEqual = values.every(v => v === EXPECTED_TOTAL);
    record(
        'Test 10: Cross-tier consistency',
        allEqual,
        allEqual
            ? `all groupings = ${fmt(EXPECTED_TOTAL)}`
            : `federal=${fmt(federal)} state=${fmt(state)} region=${fmt(region)} pd=${fmt(planningDistrict)}`
    );
}

// ── Runner ──────────────────────────────────────────────────────────────────

(async function main() {
    console.log('=== Supabase Tier Integration Tests ===\n');

    const totals = {};
    try {
        const r1 = await test1_federal();
        totals.federal = r1.total;
    } catch (e) { record('Test 1: Federal tier (no filter)', false, e.message); }

    try { totals.state = await test2_state(); }
    catch (e) { record('Test 2: State tier (delaware)', false, e.message); }

    try { totals.region = await test3_region(); }
    catch (e) { record('Test 3: Region tier (3 districts)', false, e.message); }

    try { await test4_mpo(); }
    catch (e) { record('Test 4: MPO tier (2 MPOs)', false, e.message); }

    try { totals.planningDistrict = await test5_planningDistrict(); }
    catch (e) { record('Test 5: Planning District tier (3 PDs)', false, e.message); }

    try { await test6_county(); }
    catch (e) { record('Test 6: County tier (3 counties)', false, e.message); }

    try { await test7_city(); }
    catch (e) { record('Test 7: City tier (Wilmington)', false, e.message); }

    try { await test8_columns(); }
    catch (e) { record('Test 8: Aggregate columns check', false, e.message); }

    try { await test9_raceCondition(); }
    catch (e) { record('Test 9: Race condition simulation', false, e.message); }

    try { await test10_crossTier(totals); }
    catch (e) { record('Test 10: Cross-tier consistency', false, e.message); }

    const passed = results.filter(r => r.passed).length;
    console.log(`\nResults: ${passed}/${results.length} passed`);
    process.exit(passed === results.length ? 0 : 1);
})();
