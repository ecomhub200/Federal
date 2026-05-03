#!/usr/bin/env python3
"""scripts/capture_oracle.py

Python fallback for scripts/capture-oracle.mjs. Same behavior, same outputs,
no external dependencies (uses only stdlib: urllib, json, re, pathlib).

Hits dashboard_summary at https://srv1503081.hstgr.cloud/rest/v1, paginates
each query, sums crash_count, runs hard schema invariants, and writes
tests/oracle-captured-<YYYY-MM-DD>.md plus .json.

Usage:
    python scripts/capture_oracle.py
    python scripts/capture_oracle.py --state delaware
    python scripts/capture_oracle.py --dry --verbose
"""

import argparse
import json
import re
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

SUPABASE_URL = "https://srv1503081.hstgr.cloud/rest/v1"
TABLE        = "dashboard_summary"
PAGE_SIZE    = 10000

REPO_ROOT = Path(__file__).resolve().parent.parent
DATA_CLIENT = REPO_ROOT / "assets" / "js" / "data-client.js"
OUT_DIR     = REPO_ROOT / "tests"

# ─── anon key ──────────────────────────────────────────────────────────
def read_anon_key() -> str:
    src = DATA_CLIENT.read_text(encoding="utf-8")
    m = re.search(r"supabaseKey:\s*['\"](eyJ[\w.\-]+)['\"]", src)
    if not m:
        raise RuntimeError(
            f"Could not find supabaseKey in {DATA_CLIENT}. "
            "Has CrashLensDataClient.DEFAULTS.supabaseKey moved? Update the regex in this script."
        )
    return m.group(1)

# ─── HTTP ──────────────────────────────────────────────────────────────
def http_get_json(url: str, key: str) -> list:
    req = urllib.request.Request(
        url,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}",
            "Accept": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")[:500]
        hint = ""
        if e.code == 403:
            hint = ("\n[hint] 403 means either auth headers are missing OR egress "
                    "to srv1503081.hstgr.cloud is blocked from this sandbox. "
                    "Confirm the URL is reachable.")
        elif e.code == 401:
            hint = ("\n[hint] 401 means the anon key was rejected. Check "
                    "assets/js/data-client.js → CrashLensDataClient.DEFAULTS.supabaseKey is current.")
        raise RuntimeError(f"HTTP {e.code} on {url}\n{body}{hint}")
    return json.loads(data)

def sum_query(qs: str, key: str, distinct_col: str | None = None, verbose: bool = False) -> dict:
    total_sum = 0
    total_rows = 0
    distinct = set() if distinct_col else None
    offset = 0
    while offset < 500_000:
        select = distinct_col if distinct_col else "crash_count"
        url = f"{SUPABASE_URL}/{TABLE}?{(qs + '&') if qs else ''}select={select}&limit={PAGE_SIZE}&offset={offset}"
        if verbose:
            print(f"  GET offset={offset} {qs or '(no filter)'}")
        arr = http_get_json(url, key)
        if not isinstance(arr, list) or not arr:
            break
        if distinct_col:
            for o in arr:
                v = o.get(distinct_col)
                if v is not None:
                    distinct.add(v)
        else:
            for o in arr:
                try:
                    total_sum += int(o.get("crash_count") or 0)
                except (TypeError, ValueError):
                    pass
        total_rows += len(arr)
        if len(arr) < PAGE_SIZE:
            break
        offset += PAGE_SIZE
    if distinct_col:
        return {"rows": total_rows, "distinct": sorted(distinct)}
    return {"rows": total_rows, "sum": total_sum}

# ─── Queries ───────────────────────────────────────────────────────────
def queries(state: str):
    return [
        ("q01_federal_allRoads",              ""),
        ("q02_state_DE_allRoads",             f"state=eq.{state}"),
        ("q03_state_DE_dot_roads",            f"state=eq.{state}&road_type=eq.dot_roads"),
        ("q04_state_DE_county_roads",         f"state=eq.{state}&road_type=eq.county_roads"),
        ("q05_state_DE_city_roads",           f"state=eq.{state}&road_type=eq.city_roads"),
        ("q06_state_DE_other_roads",          f"state=eq.{state}&road_type=eq.other_roads"),
        ("q07_state_DE_nonDOT",               f"state=eq.{state}&road_type=in.(city_roads,county_roads,other_roads)"),
        ("q08_state_DE_no_interstate",        f"state=eq.{state}&is_interstate=eq.false"),
        ("q09_state_DE_interstate_only",      f"state=eq.{state}&is_interstate=eq.true"),
        ("q10_region_North",                  f"state=eq.{state}&dot_district=eq.North District"),
        ("q11_region_North_dot_roads",        f"state=eq.{state}&dot_district=eq.North District&road_type=eq.dot_roads"),
        ("q12_region_Central",                f"state=eq.{state}&dot_district=eq.Central District"),
        ("q13_region_South",                  f"state=eq.{state}&dot_district=eq.South District"),
        ("q14_pd_North",                      f"state=eq.{state}&planning_district=eq.North District"),
        ("q15_pd_Central",                    f"state=eq.{state}&planning_district=eq.Central District"),
        ("q16_pd_South",                      f"state=eq.{state}&planning_district=eq.South District"),
        ("q17_pd_Central_no_interstate",      f"state=eq.{state}&planning_district=eq.Central District&is_interstate=eq.false"),
        ("q18_pd_Central_county_roads",       f"state=eq.{state}&planning_district=eq.Central District&road_type=eq.county_roads"),
        ("q19_pd_South_no_interstate",        f"state=eq.{state}&planning_district=eq.South District&is_interstate=eq.false"),
        ("q20_mpo_WAPC_all",                  f"state=eq.{state}&mpo_name=eq.Wilmington Area Planning Council"),
        ("q21_mpo_WAPC_dot_roads",            f"state=eq.{state}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.dot_roads"),
        ("q22_mpo_WAPC_county_roads",         f"state=eq.{state}&mpo_name=eq.Wilmington Area Planning Council&road_type=eq.county_roads"),
        ("q23_mpo_WAPC_no_interstate",        f"state=eq.{state}&mpo_name=eq.Wilmington Area Planning Council&is_interstate=eq.false"),
        ("q24_mpo_DKC_all",                   f"state=eq.{state}&mpo_name=eq.Dover / Kent County MPO"),
        ("q25_mpo_SW_all",                    f"state=eq.{state}&mpo_name=eq.Salisbury-Wicomico MPO"),
        ("q26_mpo_DVRPC_all",                 f"state=eq.{state}&mpo_name=eq.Delaware Valley Regional Planning Commission"),
        ("q27_county_Kent_all",               f"state=eq.{state}&physical_juris_name=eq.Kent"),
        ("q28_county_Kent_no_interstate",     f"state=eq.{state}&physical_juris_name=eq.Kent&is_interstate=eq.false"),
        ("q29_county_Sussex_all",             f"state=eq.{state}&physical_juris_name=eq.Sussex"),
        ("q30_county_NewCastle_all",          f"state=eq.{state}&physical_juris_name=eq.New Castle"),
        ("q31_city_Wilmington_all",           f"state=eq.{state}&physical_juris_name=eq.Wilmington"),
        ("q32_city_Dover_all",                f"state=eq.{state}&physical_juris_name=eq.Dover"),
        ("q33_city_Newark_all",               f"state=eq.{state}&physical_juris_name=eq.Newark"),
        ("q34_city_Ardentown_all",            f"state=eq.{state}&physical_juris_name=eq.Ardentown"),
        ("q35_city_Ardentown_county_roads",   f"state=eq.{state}&physical_juris_name=eq.Ardentown&road_type=eq.county_roads"),
    ]

def distincts(state: str):
    return [
        ("q36_distinct_road_types",            "",                  "road_type"),
        ("q37_distinct_dot_districts_DE",      f"state=eq.{state}", "dot_district"),
        ("q38_distinct_planning_districts_DE", f"state=eq.{state}", "planning_district"),
        ("q39_distinct_mpo_names_DE",          f"state=eq.{state}", "mpo_name"),
    ]

# ─── Invariants ────────────────────────────────────────────────────────
def check_invariants(results: list[dict]) -> list[dict]:
    by_id = {r["id"]: r for r in results}
    def s(i): return by_id[i].get("sum")
    def d(i): return by_id[i].get("distinct") or []

    checks = []
    rt = sorted(d("q36_distinct_road_types"))
    expected = ["city_roads", "county_roads", "dot_roads", "other_roads"]
    checks.append({
        "id": "I1",
        "name": "road_type ∈ {city_roads,county_roads,dot_roads,other_roads}",
        "pass": rt == expected,
        "detail": f"actual={rt!r}",
    })

    sum_rt = s("q03_state_DE_dot_roads") + s("q04_state_DE_county_roads") + \
             s("q05_state_DE_city_roads") + s("q06_state_DE_other_roads")
    checks.append({
        "id": "I2",
        "name": "road_type partition sums to state total",
        "pass": sum_rt == s("q02_state_DE_allRoads"),
        "detail": f"q03+q04+q05+q06={sum_rt}, q02={s('q02_state_DE_allRoads')}",
    })

    sum_ii = s("q08_state_DE_no_interstate") + s("q09_state_DE_interstate_only")
    checks.append({
        "id": "I3",
        "name": "is_interstate partition sums to state total",
        "pass": sum_ii == s("q02_state_DE_allRoads"),
        "detail": f"q08+q09={sum_ii}, q02={s('q02_state_DE_allRoads')}",
    })

    sum_pd = s("q14_pd_North") + s("q15_pd_Central") + s("q16_pd_South")
    checks.append({
        "id": "I4",
        "name": "planning_district partition sums to state total",
        "pass": sum_pd == s("q02_state_DE_allRoads"),
        "detail": f"q14+q15+q16={sum_pd}, q02={s('q02_state_DE_allRoads')}",
    })

    checks.append({
        "id": "I5",
        "name": "q15 (PD Central rollup target) > q27 (Kent unincorp) — proves rollup is needed",
        "pass": s("q15_pd_Central") > s("q27_county_Kent_all"),
        "detail": f"q15={s('q15_pd_Central')}, q27={s('q27_county_Kent_all')}",
    })

    return checks

# ─── Output ────────────────────────────────────────────────────────────
def fmt_num(n) -> str:
    try:
        return f"{int(n):,}"
    except (TypeError, ValueError):
        return str(n)

def build_markdown(results: list[dict], invariants: list[dict], meta: dict) -> str:
    lines = []
    lines.append(f"# Oracle capture — {meta['dateIso']}")
    lines.append("")
    lines.append(f"Source: `{SUPABASE_URL}/{TABLE}`")
    lines.append(f"State: `{meta['state']}`")
    lines.append(f"Anon-key fingerprint (last 8): `…{meta['keyTail']}`")
    lines.append("")
    lines.append("## Invariants")
    lines.append("")
    lines.append("| ID | Check | Pass | Detail |")
    lines.append("|---|---|---|---|")
    for c in invariants:
        lines.append(f"| {c['id']} | {c['name']} | {'✅' if c['pass'] else '❌'} | {c['detail']} |")
    lines.append("")
    lines.append("## Oracle")
    lines.append("")
    lines.append("| ID | row_count | sum(crash_count) |")
    lines.append("|---|---:|---:|")
    for r in results:
        if "distinct" in r:
            continue
        lines.append(f"| `{r['id']}` | {fmt_num(r['rows'])} | {fmt_num(r['sum'])} |")
    lines.append("")
    lines.append("## Distinct values")
    lines.append("")
    for r in results:
        if "distinct" not in r:
            continue
        lines.append(f"### `{r['id']}`")
        lines.append("")
        for v in r["distinct"]:
            lines.append(f"- {v}")
        lines.append("")
    return "\n".join(lines)

def build_json(results: list[dict], invariants: list[dict], meta: dict) -> str:
    out = {
        "meta": meta,
        "invariants": invariants,
        "queries": {},
        "distincts": {},
    }
    for r in results:
        if "distinct" in r:
            out["distincts"][r["id"]] = {"rows": r["rows"], "distinct": r["distinct"]}
        else:
            out["queries"][r["id"]] = {"rows": r["rows"], "sum": r["sum"]}
    return json.dumps(out, indent=2)

# ─── Main ──────────────────────────────────────────────────────────────
def main():
    p = argparse.ArgumentParser()
    p.add_argument("--state", default="delaware")
    p.add_argument("--dry", action="store_true")
    p.add_argument("--verbose", action="store_true")
    args = p.parse_args()

    t0 = time.time()
    key = read_anon_key()
    key_tail = key[-8:]
    print(f"Loaded anon key (…{key_tail}) from {DATA_CLIENT}")
    print(f"Hitting {SUPABASE_URL}/{TABLE} for state={args.state}")
    print("(use --verbose for per-page logs)")
    print()

    results = []
    for qid, qs in queries(args.state):
        print(f"  {qid} … ", end="", flush=True)
        try:
            r = sum_query(qs, key, verbose=args.verbose)
            print(f"rows={r['rows']:,} sum={r['sum']:,}")
            results.append({"id": qid, **r})
        except Exception as e:
            print("ERROR")
            print(e, file=sys.stderr)
            sys.exit(2)
    for qid, qs, col in distincts(args.state):
        print(f"  {qid} … ", end="", flush=True)
        try:
            r = sum_query(qs, key, distinct_col=col, verbose=args.verbose)
            print(f"distinct={r['distinct']!r}")
            results.append({"id": qid, **r})
        except Exception as e:
            print("ERROR")
            print(e, file=sys.stderr)
            sys.exit(2)

    invariants = check_invariants(results)
    blocking_pass = all(c["pass"] for c in invariants if c["id"] != "I5")

    meta = {
        "dateIso": datetime.now(timezone.utc).date().isoformat(),
        "capturedAt": datetime.now(timezone.utc).isoformat(),
        "state": args.state,
        "supabaseUrl": SUPABASE_URL,
        "keyTail": key_tail,
        "elapsedMs": int((time.time() - t0) * 1000),
    }

    print()
    print("Invariants:")
    for c in invariants:
        print(f"  {'✅' if c['pass'] else '❌'}  {c['id']}: {c['name']}  ({c['detail']})")

    if not args.dry:
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        md_path  = OUT_DIR / f"oracle-captured-{meta['dateIso']}.md"
        json_path = OUT_DIR / f"oracle-captured-{meta['dateIso']}.json"
        md_path.write_text(build_markdown(results, invariants, meta), encoding="utf-8")
        json_path.write_text(build_json(results, invariants, meta), encoding="utf-8")
        print()
        print(f"Wrote {md_path}")
        print(f"Wrote {json_path}")
    else:
        print()
        print("--- markdown (dry) ---")
        print(build_markdown(results, invariants, meta))

    if not blocking_pass:
        print()
        print("One or more BLOCKING invariants failed. Stop. Do not proceed to Phase 2.", file=sys.stderr)
        sys.exit(1)
    print()
    print("All blocking invariants passed. Phase 1 complete.")

if __name__ == "__main__":
    main()
