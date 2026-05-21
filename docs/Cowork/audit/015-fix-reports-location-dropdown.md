# CC 015 — [P2] Fix Reports Location dropdown empty

**From:** Chrome Claude audit 2026-05-20. **Severity:** P2 polish.

**Branch:** `claude/fix-reports-location-dropdown`. **No PR.**

## The bug

On Reports tab, the "Location" dropdown shows only "-- Select Location --" with no actual options populated. User cannot select a location to generate a report for.

## §0 Pre-flight

```bash
# Map lookup
sed -n '/^### Reports/,/^###/p' app/CODE_MAP.md | head -40

# Find report location dropdown init
grep -rn "reportLocation\|initReportLocationDropdown\|updateReportLocationDropdown" app/modules/ app/index.html | head -20

# Find what populates similar dropdowns elsewhere (Warrant Analyzer, MUTCD AI both populate location dropdowns)
grep -rn "populateLocationDropdowns\|getTopCrashLocations" app/modules/ app/index.html | head -10
```

## Fix approach

The dropdown likely needs to be populated on tab activation. Options:

1. **Most likely:** there's an init function (e.g., `initReportLocationDropdown` or `populateReportLocationDropdown`) that's not being called when the Reports tab activates.
2. The function exists but reads from a data source that hasn't loaded yet.

Compare with how Warrants or MUTCD AI tabs populate their location dropdowns — model after those.

The fix is likely a one-liner in the Reports tab's onActivate / navigateTo handler that calls `populateReportLocationDropdown()` or similar.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** small fix, no extraction needed unless touching a >100 LOC function.
- **Policy 3 (Update map):** likely no map change unless you add a new function.

## §5 Post-flight

```bash
node --check <touched files>
git diff --stat
```

## §6 Smoke

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix015

Navigate to Reports tab.

Open the Location dropdown — should now contain:
  - "All Sussex County" or similar default option
  - Specific intersection/route options (e.g., "JOHN J. WILLIAMS HWY", "SEASHORE HIGHWAY")

Select a location → date range fields should remain functional → Generate Report should at least attempt.
```

## Commit + push

```bash
git add app/modules/ app/index.html app/CODE_MAP.md
git commit -m "fix(reports): populate Location dropdown on tab activation [P2]

Was: dropdown showed only '-- Select Location --' (empty).
Now: dropdown populated with top crash locations on Reports tab open.
Triggered population from <function> in tab-dispatcher / Reports onActivate."
git push -u origin claude/fix-reports-location-dropdown
```

## Final report

```
CC 015 complete (Reports location dropdown).
Trigger point: <where you called the populate fn>
Dropdown options after fix: <count>
Branch pushed; no PR.
```
