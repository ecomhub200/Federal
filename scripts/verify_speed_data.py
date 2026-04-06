#!/usr/bin/env python3
"""
Verify and repair speed data integrity in Virginia TREDS crash CSV files.

Background:
-----------
Starting in 2025, Virginia TREDS changed the encoding of the SPEED_DIFF_MAX
field. Instead of storing the actual speed differential (mph over posted limit),
it now stores `900 + posted_speed_limit` for many records. Simultaneously, the
SPEED_NOTSPEED flag is set to "1" (Yes) for ANY record that has a speed-limit
value — not just crashes where speed was a contributing factor.

This causes ~55% of 2025 crashes to be falsely flagged as speed-related
(historical baseline is ~10%).

Detection rule:
    Max Speed Diff >= 100  →  encoded speed-limit value, NOT a real speed diff.

Repair action:
    1. Set  Speed?         = "No"
    2. Set  Max Speed Diff = ""   (clear the bogus value)
    3. Log the original value for audit

Usage:
    python scripts/verify_speed_data.py [--fix] [csv_path ...]

    Without --fix:  audit-only mode (prints report, no file changes)
    With    --fix:  repairs the CSV in-place and writes a .repair-log.json
"""

import argparse
import csv
import json
import os
import sys
from collections import defaultdict
from datetime import datetime


# Threshold: any Max Speed Diff >= this is treated as an encoded speed-limit,
# not a real speed differential.  Real speed diffs rarely exceed 60 mph; using
# 100 gives ample headroom and catches the 900+ encoded values.
CORRUPT_THRESHOLD = 100

# Historical baseline for speed-related crash percentage (Virginia counties).
# Used for the sanity-check warning only.
EXPECTED_SPEED_PCT_LOW = 4.0
EXPECTED_SPEED_PCT_HIGH = 20.0


def audit_csv(csv_path):
    """Audit a single CSV for speed-data anomalies. Returns audit dict."""
    if not os.path.isfile(csv_path):
        return {"error": f"File not found: {csv_path}"}

    year_totals = defaultdict(int)
    year_speed_yes = defaultdict(int)
    year_corrupt = defaultdict(int)
    corrupt_diff_values = defaultdict(int)
    total_rows = 0

    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        if "Speed?" not in reader.fieldnames or "Max Speed Diff" not in reader.fieldnames:
            return {"error": "CSV missing 'Speed?' or 'Max Speed Diff' columns"}

        for row in reader:
            total_rows += 1
            year = row.get("Crash Year", "unknown")
            speed_flag = row.get("Speed?", "").strip()
            diff_raw = row.get("Max Speed Diff", "").strip()

            year_totals[year] += 1

            if speed_flag.upper() in ("Y", "YES", "1", "TRUE", "T"):
                year_speed_yes[year] += 1

            if diff_raw:
                try:
                    diff_val = float(diff_raw)
                    if diff_val >= CORRUPT_THRESHOLD:
                        year_corrupt[year] += 1
                        corrupt_diff_values[int(diff_val)] += 1
                except ValueError:
                    pass

    # Build per-year report
    years_report = []
    for y in sorted(year_totals.keys()):
        total = year_totals[y]
        speed = year_speed_yes.get(y, 0)
        corrupt = year_corrupt.get(y, 0)
        pct = round(speed / total * 100, 1) if total else 0
        flagged = pct > EXPECTED_SPEED_PCT_HIGH or corrupt > 0

        years_report.append({
            "year": y,
            "total_crashes": total,
            "speed_flagged": speed,
            "speed_pct": pct,
            "corrupt_diff_count": corrupt,
            "anomaly": flagged,
        })

    # Decoded speed-limit interpretation (value - 900)
    decoded_limits = {}
    for val, count in sorted(corrupt_diff_values.items()):
        decoded_limits[val] = {
            "count": count,
            "likely_speed_limit_mph": val - 900,
        }

    total_corrupt = sum(year_corrupt.values())

    return {
        "file": csv_path,
        "total_rows": total_rows,
        "total_corrupt_speed_records": total_corrupt,
        "by_year": years_report,
        "corrupt_diff_values": decoded_limits,
    }


def fix_csv(csv_path):
    """
    Repair speed data in-place. Returns (records_fixed, log_path).

    For every row where Max Speed Diff >= CORRUPT_THRESHOLD:
      - Speed?         → "No"
      - Max Speed Diff → ""
    """
    if not os.path.isfile(csv_path):
        print(f"[ERROR] File not found: {csv_path}", file=sys.stderr)
        return 0, None

    # Read entire file
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        rows = list(reader)

    if "Speed?" not in fieldnames or "Max Speed Diff" not in fieldnames:
        print(f"[SKIP] {csv_path}: missing speed columns", file=sys.stderr)
        return 0, None

    repairs = []
    fixed = 0

    for i, row in enumerate(rows):
        diff_raw = row.get("Max Speed Diff", "").strip()
        if not diff_raw:
            continue
        try:
            diff_val = float(diff_raw)
        except ValueError:
            continue

        if diff_val >= CORRUPT_THRESHOLD:
            repairs.append({
                "row": i + 2,  # +2 for 1-indexed + header
                "document_nbr": row.get("Document Nbr", ""),
                "crash_year": row.get("Crash Year", ""),
                "original_speed_flag": row.get("Speed?", ""),
                "original_max_speed_diff": diff_raw,
                "decoded_speed_limit": int(diff_val) - 900,
            })
            row["Speed?"] = "No"
            row["Max Speed Diff"] = ""
            fixed += 1

    if fixed == 0:
        print(f"[OK] {csv_path}: no corrupt speed records found")
        return 0, None

    # Write repaired CSV
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Write repair log
    log_path = csv_path + ".speed-repair-log.json"
    log_data = {
        "repaired_at": datetime.utcnow().isoformat() + "Z",
        "file": csv_path,
        "records_fixed": fixed,
        "threshold_used": CORRUPT_THRESHOLD,
        "action": "Set Speed?=No, cleared Max Speed Diff for encoded speed-limit values",
        "repairs": repairs,
    }
    with open(log_path, "w") as f:
        json.dump(log_data, f, indent=2)

    print(f"[FIXED] {csv_path}: repaired {fixed} records (log: {log_path})")
    return fixed, log_path


def print_report(audit):
    """Pretty-print an audit report."""
    if "error" in audit:
        print(f"[ERROR] {audit['error']}")
        return

    print(f"\n{'=' * 70}")
    print(f"  Speed Data Integrity Report: {os.path.basename(audit['file'])}")
    print(f"{'=' * 70}")
    print(f"  Total rows: {audit['total_rows']:,}")
    print(f"  Corrupt speed records: {audit['total_corrupt_speed_records']:,}")
    print()

    # Year-by-year table
    print(f"  {'Year':<6} {'Total':>7} {'Speed':>7} {'Pct':>7} {'Corrupt':>8} {'Status'}")
    print(f"  {'-'*6} {'-'*7} {'-'*7} {'-'*7} {'-'*8} {'-'*10}")
    for yr in audit["by_year"]:
        status = "⚠ ANOMALY" if yr["anomaly"] else "OK"
        print(
            f"  {yr['year']:<6} {yr['total_crashes']:>7,} {yr['speed_flagged']:>7,} "
            f"{yr['speed_pct']:>6.1f}% {yr['corrupt_diff_count']:>8,} {status}"
        )

    if audit["corrupt_diff_values"]:
        print(f"\n  Corrupt Max Speed Diff values (likely encoded speed limits):")
        print(f"  {'Raw Value':>10} {'Count':>7} {'Decoded (mph)':>14}")
        print(f"  {'-'*10} {'-'*7} {'-'*14}")
        for val, info in sorted(audit["corrupt_diff_values"].items()):
            print(f"  {val:>10} {info['count']:>7,} {info['likely_speed_limit_mph']:>14}")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Verify and repair speed data in Virginia TREDS crash CSV files."
    )
    parser.add_argument(
        "csv_files",
        nargs="*",
        default=["data/henrico_all_roads.csv"],
        help="CSV file(s) to audit/repair (default: data/henrico_all_roads.csv)",
    )
    parser.add_argument(
        "--fix",
        action="store_true",
        help="Repair corrupt records in-place (default: audit only)",
    )
    args = parser.parse_args()

    total_corrupt = 0
    total_fixed = 0

    for csv_path in args.csv_files:
        audit = audit_csv(csv_path)
        print_report(audit)
        total_corrupt += audit.get("total_corrupt_speed_records", 0)

        if args.fix and audit.get("total_corrupt_speed_records", 0) > 0:
            fixed, _ = fix_csv(csv_path)
            total_fixed += fixed

    # Summary
    if args.fix:
        print(f"\nSummary: {total_fixed:,} records repaired across {len(args.csv_files)} file(s).")
    else:
        if total_corrupt > 0:
            print(f"\nSummary: {total_corrupt:,} corrupt records found.")
            print("Run with --fix to repair the data in-place.")
        else:
            print("\nAll files passed speed data integrity checks.")

    return 1 if total_corrupt > 0 and not args.fix else 0


if __name__ == "__main__":
    sys.exit(main())
