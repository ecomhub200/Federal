// scripts/capture-oracle-browser.js
//
// Manual fallback: paste this whole file into the DevTools Console while
// you have https://ecomhub200.github.io/Federal/app/ open. Same query set
// and invariants as scripts/capture-oracle.mjs, but runs in the browser
// (so it never hits sandbox-egress issues — the live app is already loaded
// and the anon key is already on window.crashLensClient).
//
// At the end it copies the captured oracle JSON to your clipboard and
// prints the markdown table. Paste both into the PR description.

(async () => {
    const SUPABASE_URL = (window.crashLensClient && window.crashLensClient.supabaseUrl)
        || 'https://srv1503081.hstgr.cloud/rest/v1';
    const KEY = (window.crashLensClient && window.crashLensClient.supabaseKey)
        || (window.CrashLensDataClient && window.CrashLensDataClient.DEFAULTS && window.CrashLensDataClient.DEFAULTS.supabaseKey);
    if (!KEY) {
        console.error('Could not find anon key — load the app first, then paste this script.');
        return;
    }
    const TABLE = 'dashboard_summary';
    const PAGE  = 10000;
    const STATE = 'delaware';
    const H = { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' };

    async function sumQuery(qs, distinctCol = null) {
        let totalSum = 0, totalRows = 0, offset = 0;
        const distinct = distinctCol ? new Set() : null;
        while (offset < 500000) {
            const select = distinctCol || 'crash_count';
            const url = `${SUPABASE_URL}/${TABLE}?${qs ? qs + '&' : ''}select=${select}&limit=${PAGE}&offset=${offset}`;
            const r = await fetch(url, { headers: H });
            if (!r.ok) {
                throw new Error(`HTTP ${r.status} on ${url}\n${(await r.text()).slice(0, 500)}`);
            }
            const arr = await r.json();
            if (!Array.isArray(arr) || arr.length === 0) break;
            if (distinctCol) {
                for (const o of arr) if (o[distinctCol] != null) distinct.add(o[distinctCol]);
            } else {
                for (const o of arr) totalSum += parseInt(o.crash_count, 10) || 0;
            }
            totalRows += arr.length;
            if (arr.length < PAGE) break;
            offset += PAGE;
        }
        return distinctCol ? { rows: totalRows, distinct: [...distinct].sort() } : { rows: totalRows, sum: totalSum };
    }

    const Q = [
        ['q01_federal_allRoads',              ''],
        ['q02_state_DE_allRoads',             `state=eq.${STATE}`],
        ['q03_state_DE_dot_roads',            `state=eq.${STATE}&road_type=eq.dot_roads`],
        ['q04_state_DE_county_roads',         `state=eq.${STATE}&road_type=eq.county_roads`],
        ['q05_state_DE_city_roads',           `state=eq.${STATE}&road_type=eq.city_roads`],
        ['q06_state_DE_other_roads',          `state=eq.${STATE}&road_type=eq.other_roads`],
        ['q07_state_DE_nonDOT',               `state=eq.${STATE}&road_type=in.(city_roads,county_roads,other_roads)`],
        ['q08_state_DE_no_interstate',        `state=eq.${STATE}&is_interstate=eq.false`],
        ['q09_state_DE_interstate_only',      `state=eq.${STATE}&is_interstate=eq.true`],
        ['q10_region_North',                  `state=eq.${STATE}&dot_district=eq.North District`],
        ['q11_region_North_dot_roads',        `state=eq.${STATE}&dot_district=eq.North District&road_type=eq.dot_roads`],
        ['q12_region_Central',                `state=eq.${STATE}&dot_district=eq.Central District`],
        ['q13_region_South',                  `state=eq.${STATE}&dot_district=eq.South District`],
        ['q14_pd_North',                      `state=eq.${STATE}&planning_district=eq.North District`],
        ['q15_pd_Central',                    `state=eq.${STATE}&planning_district=eq.Central District`],
        ['q16_pd_South',                      `state=eq.${STATE}&planning_district=eq.South District`],
        ['q17_pd_Central_no_interstate',      `state=eq.${STATE}&planning_district=eq.Central District&is_interstate=eq.false`],
        ['q18_pd_Central_county_roads',       `state=eq.${STATE}&planning_district=eq.Central District&road_type=eq.county_roads`],
        ['q19_pd_South_no_interstate',        `state=eq.${STATE}&planning_district=eq.South District&is_interstate=eq.false`],
        ['q20_mpo_WAPC_all',                  `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council`],
        ['q21_mpo_WAPC_dot_roads',            `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.dot_roads`],
        ['q22_mpo_WAPC_county_roads',         `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.county_roads`],
        ['q23_mpo_WAPC_no_interstate',        `state=eq.${STATE}&mpo_name=eq.Wilmington Area Planning Council&is_interstate=eq.false`],
        ['q24_mpo_DKC_all',                   `state=eq.${STATE}&mpo_name=eq.Dover / Kent County MPO`],
        ['q25_mpo_SW_all',                    `state=eq.${STATE}&mpo_name=eq.Salisbury-Wicomico MPO`],
        ['q26_mpo_DVRPC_all',                 `state=eq.${STATE}&mpo_name=eq.Delaware Valley Regional Planning Commission`],
        ['q27_county_Kent_all',               `state=eq.${STATE}&physical_juris_name=eq.Kent`],
        ['q28_county_Kent_no_interstate',     `state=eq.${STATE}&physical_juris_name=eq.Kent&is_interstate=eq.false`],
        ['q29_county_Sussex_all',             `state=eq.${STATE}&physical_juris_name=eq.Sussex`],
        ['q30_county_NewCastle_all',          `state=eq.${STATE}&physical_juris_name=eq.New Castle`],
        ['q31_city_Wilmington_all',           `state=eq.${STATE}&physical_juris_name=eq.Wilmington`],
        ['q32_city_Dover_all',                `state=eq.${STATE}&physical_juris_name=eq.Dover`],
        ['q33_city_Newark_all',               `state=eq.${STATE}&physical_juris_name=eq.Newark`],
        ['q34_city_Ardentown_all',            `state=eq.${STATE}&physical_juris_name=eq.Ardentown`],
        ['q35_city_Ardentown_county_roads',   `state=eq.${STATE}&physical_juris_name=eq.Ardentown&road_type=eq.county_roads`]
    ];
    const D = [
        ['q36_distinct_road_types',            '',                  'road_type'],
        ['q37_distinct_dot_districts_DE',      `state=eq.${STATE}`, 'dot_district'],
        ['q38_distinct_planning_districts_DE', `state=eq.${STATE}`, 'planning_district'],
        ['q39_distinct_mpo_names_DE',          `state=eq.${STATE}`, 'mpo_name']
    ];

    const out = [];
    for (const [id, qs] of Q) {
        console.log(`  ${id} ...`);
        const r = await sumQuery(qs);
        console.log(`    rows=${r.rows.toLocaleString()} sum=${r.sum.toLocaleString()}`);
        out.push({ id, ...r });
    }
    for (const [id, qs, col] of D) {
        console.log(`  ${id} ...`);
        const r = await sumQuery(qs, col);
        console.log(`    distinct=${JSON.stringify(r.distinct)}`);
        out.push({ id, ...r });
    }

    // Invariants
    const get = (id) => out.find(r => r.id === id)?.sum;
    const dgst = (id) => out.find(r => r.id === id)?.distinct;
    const inv = [];
    inv.push({ id: 'I1', pass: JSON.stringify((dgst('q36_distinct_road_types') || []).slice().sort()) ===
              JSON.stringify(['city_roads','county_roads','dot_roads','other_roads']),
              name: 'road_type partition complete' });
    inv.push({ id: 'I2', pass: (get('q03_state_DE_dot_roads') + get('q04_state_DE_county_roads') +
              get('q05_state_DE_city_roads') + get('q06_state_DE_other_roads')) === get('q02_state_DE_allRoads'),
              name: 'road_type sums to state' });
    inv.push({ id: 'I3', pass: (get('q08_state_DE_no_interstate') + get('q09_state_DE_interstate_only')) === get('q02_state_DE_allRoads'),
              name: 'is_interstate sums to state' });
    inv.push({ id: 'I4', pass: (get('q14_pd_North') + get('q15_pd_Central') + get('q16_pd_South')) === get('q02_state_DE_allRoads'),
              name: 'planning_district sums to state' });
    inv.push({ id: 'I5', pass: get('q15_pd_Central') > get('q27_county_Kent_all'),
              name: 'rollup is necessary (q15 > q27)' });

    console.log('Invariants:');
    for (const c of inv) console.log(`  ${c.pass ? '✅' : '❌'} ${c.id} ${c.name}`);

    // Markdown
    let md = `# Oracle capture — ${new Date().toISOString().slice(0, 10)}\n\nSource: \`${SUPABASE_URL}/${TABLE}\`\nState: \`${STATE}\`\n\n## Oracle\n\n| ID | rows | sum |\n|---|---:|---:|\n`;
    for (const r of out) if (!r.distinct) md += `| \`${r.id}\` | ${r.rows.toLocaleString()} | ${r.sum.toLocaleString()} |\n`;
    md += `\n## Distinct values\n\n`;
    for (const r of out) if (r.distinct) md += `**${r.id}**: ${r.distinct.join(', ')}\n\n`;
    console.log(md);

    const json = JSON.stringify({
        meta: { capturedAt: new Date().toISOString(), state: STATE, supabaseUrl: SUPABASE_URL },
        invariants: inv,
        results: out
    }, null, 2);

    try {
        await navigator.clipboard.writeText(json);
        console.log('✓ JSON oracle copied to clipboard. Paste into tests/oracle-captured-<date>.json');
    } catch (e) {
        console.log('(clipboard write blocked — copy the JSON above manually)');
        console.log(json);
    }
})();
