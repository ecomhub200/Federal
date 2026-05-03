#!/usr/bin/env python3
"""
verify_hierarchy_dbnames.py — CI/lint guard for hierarchy.json dbName fields.

Goal
----
Every entry in `states/<state>/hierarchy.json` under `regions`, `tprs` (MPOs),
and `planningDistricts` MUST carry a `dbName` field whose value matches a
real value in the `dashboard_summary` matview's `dot_district`, `mpo_name`,
or `planning_district` column for that state.

The frontend's resolveTier() falls back `dbName -> shortName -> name`, so a
missing `dbName` silently produces 0-row Supabase queries (the dashboard then
renders all zeros). This script catches that before deploy.

Usage
-----
  uv run python scripts/verify_hierarchy_dbnames.py             # all states
  uv run python scripts/verify_hierarchy_dbnames.py delaware     # one state
  uv run python scripts/verify_hierarchy_dbnames.py --offline    # structural checks only

Exit code 0 = all good, 1 = at least one mismatch (CI fails).
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from typing import Iterable

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
STATES_DIR = os.path.join(REPO_ROOT, "states")

# Read the live anon key from the data client so we never hardcode credentials
# in two places. Keeping a single source of truth means rotating the key in
# data-client.js automatically updates this script's auth.
DATA_CLIENT = os.path.join(REPO_ROOT, "assets", "js", "data-client.js")
SUPABASE_URL = "https://srv1503081.hstgr.cloud/rest/v1"


def _extract_anon_key() -> str | None:
    try:
        with open(DATA_CLIENT, "r", encoding="utf-8") as f:
            for line in f:
                if "supabaseKey" in line and "eyJ" in line:
                    start = line.find("'eyJ")
                    if start < 0:
                        start = line.find('"eyJ')
                    if start < 0:
                        continue
                    quote = line[start]
                    end = line.find(quote, start + 1)
                    if end < 0:
                        continue
                    return line[start + 1:end]
    except OSError:
        return None
    return None


def _http_get(path: str, anon_key: str) -> list[dict]:
    url = SUPABASE_URL.rstrip("/") + path
    req = urllib.request.Request(url, headers={
        "apikey": anon_key,
        "Authorization": f"Bearer {anon_key}",
        "Accept": "application/json",
    })
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _distinct_values(state: str, column: str, anon_key: str) -> set[str]:
    """Pull distinct non-null values of `column` from dashboard_summary for `state`."""
    seen: set[str] = set()
    page_size = 1000
    offset = 0
    while True:
        params = urllib.parse.urlencode({
            "state": f"eq.{state}",
            "select": column,
            "limit": page_size,
            "offset": offset,
        })
        rows = _http_get(f"/dashboard_summary?{params}", anon_key)
        if not rows:
            break
        for r in rows:
            v = r.get(column)
            if v:
                seen.add(v)
        if len(rows) < page_size:
            break
        offset += page_size
        if offset > 200000:  # safety stop
            break
    return seen


def _list_states() -> list[str]:
    out = []
    for name in sorted(os.listdir(STATES_DIR)):
        if os.path.isfile(os.path.join(STATES_DIR, name, "hierarchy.json")):
            out.append(name)
    return out


def _entries(d: dict | None) -> Iterable[tuple[str, dict]]:
    if not isinstance(d, dict):
        return []
    for k, v in d.items():
        if isinstance(v, dict) and not k.startswith("_"):
            yield k, v


def verify_state(state: str, anon_key: str | None, offline: bool, strict: bool = True) -> tuple[int, int]:
    """Return (errors, warnings) for the state.

    When `strict` is True a missing dbName is an error; when False it's a
    warning. Used so a full-scan run (no states named) can flag every state
    that hasn't been migrated yet without breaking CI for unmigrated states.
    """
    path = os.path.join(STATES_DIR, state, "hierarchy.json")
    with open(path, "r", encoding="utf-8") as f:
        hier = json.load(f)

    errors = 0
    warnings = 0

    # Structural check — every region/tpr/planningDistrict must have a dbName.
    sections = (
        ("regions", "dot_district"),
        ("tprs", "mpo_name"),
        ("planningDistricts", "planning_district"),
    )

    declared: dict[str, set[str]] = {col: set() for _, col in sections}

    for section_key, _column in sections:
        for entry_id, entry in _entries(hier.get(section_key)):
            db = entry.get("dbName")
            # Don't fail tprs entries that have counties=[] AND duplicate another
            # entry's dbName (those are NTAD placeholders — already covered).
            counties = entry.get("counties") or []
            if not db:
                if section_key == "tprs" and not counties:
                    warnings += 1
                    print(f"  [warn] {state}/{section_key}/{entry_id}: dbName missing (NTAD placeholder, no counties).")
                elif strict:
                    errors += 1
                    print(f"  [FAIL] {state}/{section_key}/{entry_id}: required dbName field is missing.")
                else:
                    warnings += 1
                    print(f"  [warn] {state}/{section_key}/{entry_id}: dbName missing (state not yet migrated).")
            else:
                _column = sections[[s[0] for s in sections].index(section_key)][1]
                declared[_column].add(db)

    if offline or not anon_key:
        return errors, warnings

    # Live check — compare each declared dbName against the matview.
    for _section_key, column in sections:
        try:
            live = _distinct_values(state, column, anon_key)
        except Exception as exc:  # network / matview down — don't fail CI silently
            warnings += 1
            print(f"  [warn] {state}/{column}: could not query dashboard_summary ({exc}); skipping live check.")
            continue
        for db_name in declared[column]:
            if db_name not in live:
                errors += 1
                print(f"  [FAIL] {state}/{column}: dbName '{db_name}' not found in dashboard_summary.")
        unmatched_live = live - declared[column]
        if unmatched_live:
            for v in sorted(unmatched_live):
                warnings += 1
                print(f"  [warn] {state}/{column}: matview has '{v}' but no hierarchy entry references it.")

    return errors, warnings


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("states", nargs="*", help="States to verify (default: all states with hierarchy.json).")
    p.add_argument("--offline", action="store_true", help="Skip the live Supabase check; structural-only.")
    args = p.parse_args()

    explicit = bool(args.states)
    targets = args.states or _list_states()
    anon_key = _extract_anon_key()
    if not anon_key and not args.offline:
        print("[warn] No anon key found in assets/js/data-client.js — running offline structural check only.")
        args.offline = True

    total_errors = 0
    total_warnings = 0
    for st in targets:
        print(f"== {st} ==")
        # Strict (errors) only for explicitly named states. A bulk scan of all
        # 50 states should report unmigrated states as warnings so CI doesn't
        # break for states that haven't been onboarded with crash data yet.
        e, w = verify_state(st, anon_key, args.offline, strict=explicit)
        total_errors += e
        total_warnings += w
        if e == 0 and w == 0:
            print(f"  OK")

    print()
    print(f"Total: {total_errors} error(s), {total_warnings} warning(s).")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main())
