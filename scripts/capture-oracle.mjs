#!/usr/bin/env node
// scripts/capture-oracle.mjs
//
// Phase-1 oracle capture for the comprehensive tier-fix prompt.
//
// Hits the live `dashboard_summary` matview at
//   https://srv1503081.hstgr.cloud/rest/v1
// using the anon key embedded in assets/js/data-client.js, paginates each
// query, sums crash_count, and writes a Markdown table to
//   tests/oracle-captured-<YYYY-MM-DD>.md
// plus a JSON sidecar at
//   tests/oracle-captured-<YYYY-MM-DD>.json
// for downstream test-file ingestion.
//
// Runs the four hard schema invariants the prompt requires; exits non-zero
// if any fails. CC must call this with `node scripts/capture-oracle.mjs`
// before writing any Phase-2 code.
//
// No external dependencies — uses only Node 18+ globals (fetch, URL, fs/promises).
//
// Usage:
//   node scripts/capture-oracle.mjs                  # writes today's file
//   node scripts/capture-oracle.mjs --state=delaware # explicit state
//   node scripts/capture-oracle.mjs --dry            # don't write files, just print
//   node scripts/capture-oracle.mjs --verbose        # log every page

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join, dirname, resolve as pathResolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Config ──────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://srv1503081.hstgr.cloud/rest/v1';
const TABLE        = 'dashboard_summary';
const PAGE_SIZE    = 10000;
const STATE        = parseFlag('--state', 'delaware');
const DRY          = process.argv.includes('--dry');
const VERBOSE      = process.argv.includes('--verbose');

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = pathResolve(__dirname, '..');
const DATA_CLIENT_PATH = pathResolve(REPO_ROOT, 'assets/js/data-client.js');
const OUT_DIR  = pathResolve(REPO_ROOT, 'tests');

// ─── Read anon key from data-client.js (don't hardcode it here) ─────────
async function readAnonKey() {
  const src = await readFile(DATA_CLIENT_PATH, 'utf8');
  const m = src.match(/supabaseKey:\s*['"](eyJ[\w.\-]+)['"]/);
  if (!m) {
    throw new Error(
      'Could not find supabaseKey in ' + DATA_CLIENT_PATH +
      '. Has CrashLensDataClient.DEFAULTS.supabaseKey moved? Update the regex in this script.'
    );
  }
  return m[1];
}

// ─── HTTP with auth + paginated sum ─────────────────────────────────────
async function getJson(url, key) {
  const res = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/json'
    }
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    const hint = res.status === 403
      ? '\n[hint] 403 means either auth headers missing OR egress to srv1503081.hstgr.cloud is blocked from this sandbox. Confirm the URL is reachable.'
      : (res.status === 401
          ? '\n[hint] 401 means the anon key was rejected. Check assets/js/data-client.js → CrashLensDataClient.DEFAULTS.supabaseKey is current.'
          : '');
    throw new Error(`HTTP ${res.status} on ${url}\n${body.slice(0, 500)}${hint}`);
  }
  return res.json();
}

async function sumQuery(qs, key, { distinctCol = null } = {}) {
  let totalSum = 0;
  let totalRows = 0;
  const distinct = distinctCol ? new Set() : null;
  let offset = 0;

  while (offset < 500_000) {
    const select = distinctCol ? distinctCol : 'crash_count';
    const url = `${SUPABASE_URL}/${TABLE}?${qs ? qs + '&' : ''}select=${select}&limit=${PAGE_SIZE}&offset=${offset}`;
    if (VERBOSE) console.log(`  GET offset=${offset} ${qs || '(no filter)'}`);
    const arr = await getJson(url, key);
    if (!Array.isArray(arr) || arr.length === 0) break;

    if (distinctCol) {
      for (const o of arr) if (o[distinctCol] != null) distinct.add(o[distinctCol]);
    } else {
      for (const o of arr) totalSum += parseInt(o.crash_count, 10) || 0;
    }
    totalRows += arr.length;
    if (arr.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  return distinctCol
    ? { rows: totalRows, distinct: [...distinct].sort() }
    : { rows: totalRows, sum: totalSum };
}

// ─── Oracle queries (mirror the comprehensive prompt) ───────────────────
const QUERIES = [
  // q01..q09 — federal / state-level
  ['q01_federal_allRoads',              ''],
  ['q02_state_DE_allRoads',             `state=eq.${STATE}`],
  ['q03_state_DE_dot_roads',            `state=eq.${STATE}&road_type=eq.dot_roads`],
  ['q04_state_DE_county_roads',         `state=eq.${STATE}&road_type=eq.county_roads`],
  ['q05_state_DE_city_roads',           `state=eq.${STATE}&road_type=eq.city_roads`],
  ['q06_state_DE_other_roads',          `state=eq.${STATE}&road_type=eq.other_roads`],
  ['q07_state_DE_nonDOT',               `state=eq.${STATE}&road_type=in.(city_roads,county_roads,other_roads)`],
  ['q08_state_DE_no_interstate',        `state=eq.${STATE}&is_interstate=eq.false`],
  ['q09_state_DE_interstate_only',      `state=eq.${STATE}&is_interstate=eq.true`],
  // q10..q13 — region (dot_district)
  ['q10_region_North',                  `state=eq.${STATE}&dot_district=eq.North District`],
  ['q11_region_North_dot_roads',        `state=eq.${STATE}&dot_district=eq.North District&road_type=eq.dot_roads`],
  ['q12_region_Central',                `state=eq.${STATE}&dot_district=eq.Central District`],
  ['q13_region_South',                  `state=eq.${STATE}&dot_district=eq.South District`],
  // q14..q19 — planning_district (incl. rollup targets for county fix)
  ['q14_pd_North',                      `state=eq.${STATE}&planning_district=eq.North District`],
  ['q15_pd_Central',                    `state=eq.${STATE}&planning_district=eq.Central District`],
  ['q16_pd_South',                      `state=eq.${STATE}&planning_district=eq.South District`],
  ['q17_pd_Central_no_interstate',      `state=eq.${STATE}&planning_district=eq.Central District&is_interstate=eq.false`],
  ['q18_pd_Central_county_roads',       `state=eq.${STATE}&planning_district=eq.Central District&road_type=eq.county_roads`],
  ['q19_pd_South_no_interstate',        `state=eq.${STATE}&planning_district=eq.South District&is_interstate=eq.false`],
  // q20..q26 — MPO
  ['q20_mpo_WAPC_all',                  `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council`],
  ['q21_mpo_WAPC_dot_roads',            `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.dot_roads`],
  ['q22_mpo_WAPC_county_roads',         `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.county_roads`],
  ['q23_mpo_WAPC_no_interstate',        `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&is_interstate=eq.false`],
  ['q24_mpo_DKC_all',                   `state=eq.${STATE}&mpo_name=eq.Dover / Kent County MPO`],
  ['q25_mpo_SW_all',                    `state=eq.${STATE}&mpo_name=eq.Salisbury-Wicomico MPO`],
  ['q26_mpo_DVRPC_all',                 `state=eq.${STATE}&mpo_name=eq.Delaware Valley Regional Planning Commission`],
  // q27..q30 — county (physical_juris_name)
  ['q27_county_Kent_all',               `state=eq.${STATE}&physical_juris_name=eq.Kent`],
  ['q28_county_Kent_no_interstate',     `state=eq.${STATE}&physical_juris_name=eq.Kent&is_interstate=eq.false`],
  ['q29_county_Sussex_all',             `state=eq.${STATE}&physical_juris_name=eq.Sussex`],
  ['q30_county_NewCastle_all',          `state=eq.${STATE}&physical_juris_name=eq.New Castle`],
  // q31..q35 — city (physical_juris_name)
  ['q31_city_Wilmington_all',           `state=eq.${STATE}&physical_juris_name=eq.Wilmington`],
  ['q32_city_Dover_all',                `state=eq.${STATE}&physical_juris_name=eq.Dover`],
  ['q33_city_Newark_all',               `state=eq.${STATE}&physical_juris_name=eq.Newark`],
  ['q34_city_Ardentown_all',            `state=eq.${STATE}&physical_juris_name=eq.Ardentown`],
  ['q35_city_Ardentown_county_roads',   `state=eq.${STATE}&physical_juris_name=eq.Ardentown&road_type=eq.county_roads`],
];

const DISTINCTS = [
  ['q36_distinct_road_types',           '',                        'road_type'],
  ['q37_distinct_dot_districts_DE',     `state=eq.${STATE}`,       'dot_district'],
  ['q38_distinct_planning_districts_DE',`state=eq.${STATE}`,       'planning_district'],
  ['q39_distinct_mpo_names_DE',         `state=eq.${STATE}`,       'mpo_name'],
];

// ─── Hard invariants ────────────────────────────────────────────────────
function checkInvariants(results) {
  const get = (id) => results.find(r => r.id === id)?.sum;
  const dgst = (id) => results.find(r => r.id === id)?.distinct;

  const checks = [];

  // I1: road_type bucket completeness
  const rt = (dgst('q36_distinct_road_types') || []).slice().sort();
  const expected = ['city_roads','county_roads','dot_roads','other_roads'];
  checks.push({
    id: 'I1',
    name: 'road_type ∈ {city_roads,county_roads,dot_roads,other_roads}',
    pass: JSON.stringify(rt) === JSON.stringify(expected),
    detail: `actual=${JSON.stringify(rt)}`
  });

  // I2: q03+q04+q05+q06 == q02 (road_type partition)
  const sumRT = get('q03_state_DE_dot_roads') + get('q04_state_DE_county_roads') +
                get('q05_state_DE_city_roads') + get('q06_state_DE_other_roads');
  checks.push({
    id: 'I2',
    name: 'road_type partition sums to state total',
    pass: sumRT === get('q02_state_DE_allRoads'),
    detail: `q03+q04+q05+q06 = ${sumRT}, q02 = ${get('q02_state_DE_allRoads')}`
  });

  // I3: q08+q09 == q02 (is_interstate partition)
  const sumII = get('q08_state_DE_no_interstate') + get('q09_state_DE_interstate_only');
  checks.push({
    id: 'I3',
    name: 'is_interstate partition sums to state total',
    pass: sumII === get('q02_state_DE_allRoads'),
    detail: `q08+q09 = ${sumII}, q02 = ${get('q02_state_DE_allRoads')}`
  });

  // I4: q14+q15+q16 == q02 (planning_district partition)
  const sumPD = get('q14_pd_North') + get('q15_pd_Central') + get('q16_pd_South');
  checks.push({
    id: 'I4',
    name: 'planning_district partition sums to state total',
    pass: sumPD === get('q02_state_DE_allRoads'),
    detail: `q14+q15+q16 = ${sumPD}, q02 = ${get('q02_state_DE_allRoads')}`
  });

  // I5 (advisory, not blocking): q15 > q27 — rollup is necessary
  checks.push({
    id: 'I5',
    name: 'q15 (PD Central rollup target) > q27 (Kent unincorp) — proves rollup is needed',
    pass: get('q15_pd_Central') > get('q27_county_Kent_all'),
    detail: `q15 = ${get('q15_pd_Central')}, q27 = ${get('q27_county_Kent_all')}`
  });

  return checks;
}

// ─── Output rendering ────────────────────────────────────────────────────
function fmtNum(n) {
  return Number.isFinite(n) ? n.toLocaleString('en-US') : String(n);
}

function buildMarkdown(results, invariants, meta) {
  const lines = [];
  lines.push(`# Oracle capture — ${meta.dateIso}`);
  lines.push('');
  lines.push(`Source: \`${SUPABASE_URL}/${TABLE}\``);
  lines.push(`State: \`${meta.state}\``);
  lines.push(`Anon-key fingerprint (last 8): \`…${meta.keyTail}\``);
  lines.push('');

  lines.push('## Invariants');
  lines.push('');
  lines.push('| ID | Check | Pass | Detail |');
  lines.push('|---|---|---|---|');
  for (const c of invariants) {
    lines.push(`| ${c.id} | ${c.name} | ${c.pass ? '✅' : '❌'} | ${c.detail} |`);
  }
  lines.push('');

  lines.push('## Oracle');
  lines.push('');
  lines.push('| ID | row_count | sum(crash_count) |');
  lines.push('|---|---:|---:|');
  for (const r of results) {
    if (r.distinct) continue;
    lines.push(`| \`${r.id}\` | ${fmtNum(r.rows)} | ${fmtNum(r.sum)} |`);
  }
  lines.push('');

  lines.push('## Distinct values');
  lines.push('');
  for (const r of results) {
    if (!r.distinct) continue;
    lines.push(`### \`${r.id}\``);
    lines.push('');
    for (const v of r.distinct) lines.push(`- ${v}`);
    lines.push('');
  }
  return lines.join('\n');
}

function buildJson(results, invariants, meta) {
  const out = {
    meta,
    invariants,
    queries: {},
    distincts: {}
  };
  for (const r of results) {
    if (r.distinct) out.distincts[r.id] = { rows: r.rows, distinct: r.distinct };
    else out.queries[r.id] = { rows: r.rows, sum: r.sum };
  }
  return JSON.stringify(out, null, 2);
}

// ─── Main ────────────────────────────────────────────────────────────────
function parseFlag(name, fallback) {
  const arg = process.argv.find(a => a.startsWith(name + '='));
  return arg ? arg.split('=')[1] : fallback;
}

(async () => {
  const t0 = Date.now();
  const key = await readAnonKey();
  const keyTail = key.slice(-8);
  console.log(`Loaded anon key (…${keyTail}) from ${DATA_CLIENT_PATH}`);
  console.log(`Hitting ${SUPABASE_URL}/${TABLE} for state=${STATE}`);
  console.log(`(use --verbose for per-page logs)`);
  console.log('');

  const results = [];

  for (const [id, qs] of QUERIES) {
    process.stdout.write(`  ${id} … `);
    try {
      const r = await sumQuery(qs, key);
      console.log(`rows=${r.rows.toLocaleString()} sum=${r.sum.toLocaleString()}`);
      results.push({ id, ...r });
    } catch (e) {
      console.log(`ERROR`);
      console.error(e.message);
      process.exit(2);
    }
  }
  for (const [id, qs, col] of DISTINCTS) {
    process.stdout.write(`  ${id} … `);
    try {
      const r = await sumQuery(qs, key, { distinctCol: col });
      console.log(`distinct=${JSON.stringify(r.distinct)}`);
      results.push({ id, ...r });
    } catch (e) {
      console.log(`ERROR`);
      console.error(e.message);
      process.exit(2);
    }
  }

  const invariants = checkInvariants(results);
  const allPass = invariants.filter(i => i.id !== 'I5').every(i => i.pass);

  const meta = {
    dateIso: new Date().toISOString().slice(0, 10),
    capturedAt: new Date().toISOString(),
    state: STATE,
    supabaseUrl: SUPABASE_URL,
    keyTail,
    elapsedMs: Date.now() - t0
  };

  console.log('');
  console.log('Invariants:');
  for (const c of invariants) {
    console.log(`  ${c.pass ? '✅' : '❌'}  ${c.id}: ${c.name}  (${c.detail})`);
  }

  if (!DRY) {
    await mkdir(OUT_DIR, { recursive: true });
    const mdPath  = join(OUT_DIR, `oracle-captured-${meta.dateIso}.md`);
    const jsonPath = join(OUT_DIR, `oracle-captured-${meta.dateIso}.json`);
    await writeFile(mdPath,  buildMarkdown(results, invariants, meta));
    await writeFile(jsonPath, buildJson(results, invariants, meta));
    console.log('');
    console.log(`Wrote ${mdPath}`);
    console.log(`Wrote ${jsonPath}`);
  } else {
    console.log('');
    console.log('--- markdown (dry) ---');
    console.log(buildMarkdown(results, invariants, meta));
  }

  if (!allPass) {
    console.error('');
    console.error('One or more BLOCKING invariants failed. Stop. Do not proceed to Phase 2.');
    process.exit(1);
  }
  console.log('');
  console.log('All blocking invariants passed. Phase 1 complete.');
})().catch(err => {
  console.error('capture-oracle failed:', err.stack || err.message);
  process.exit(2);
});
