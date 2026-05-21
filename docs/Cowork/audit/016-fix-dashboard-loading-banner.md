# CC 016 — [P2] Fix Dashboard "Data Range: Loading..." stuck banner

**From:** Chrome Claude audit 2026-05-20. **Severity:** P2 polish.

**Branch:** `claude/fix-dashboard-loading-banner`. **No PR.**

## The bug

Dashboard tab shows "📊 Data Range: Loading..." banner indefinitely. The date range metadata fetch never completes (or never resolves the banner).

## §0 Pre-flight

```bash
# Map lookup
sed -n '/^### Dashboard/,/^###/p' app/CODE_MAP.md | head -40

# Find the banner element + handler
grep -n "Data Range:.*Loading\|dataRangeBanner\|dateRangeMetadata" app/index.html | head -10
grep -rn "dataRange\|date.range.metadata\|fetchDataRange\|getDataRange" app/modules/ app/index.html | head -20
```

## Fix approach

Two-part fix:

1. **Add a timeout** (e.g., 10s) to the data range metadata fetch. After timeout: hide the banner OR show "Data range unavailable" instead of leaving "Loading..." forever.

2. **Investigate WHY** the fetch hangs. Likely culprits:
   - Missing matview / RPC (404 silently swallowed)
   - Fetch awaits a promise that never resolves (no `.catch`)
   - Banner updated only on success, not on error

Example fix:

```js
async function loadDataRangeBanner() {
  const banner = document.querySelector('.dashboard-data-range-banner');
  if (!banner) return;
  try {
    const result = await Promise.race([
      fetchDateRangeMetadata(),  // existing call
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 10000))
    ]);
    banner.textContent = `📊 Data Range: ${result.minDate} to ${result.maxDate}`;
  } catch (e) {
    console.warn('[Dashboard] Data range fetch failed:', e.message);
    banner.style.display = 'none';  // or show fallback "Data range unavailable"
  }
}
```

## Per-CLAUDE.md policies

- Small fix. No extraction needed.
- Update map if new function added.

## §5 Post-flight

```bash
node --check <touched files>
git diff --stat
```

## §6 Smoke

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix016

Navigate to Dashboard.

Within 10 seconds:
  - "Data Range: Loading..." should either become "Data Range: 2009 to 2025" (or similar real dates), OR
  - The banner should hide gracefully if data is unavailable.

NOT expected: banner stuck at "Loading..." for >10s.
```

## Commit + push

```bash
git add app/modules/ app/index.html app/CODE_MAP.md
git commit -m "fix(dashboard): resolve 'Data Range: Loading...' stuck banner [P2]

Was: banner showed 'Loading...' indefinitely.
Now: 10s timeout + graceful fallback (banner hides or shows error).
Root cause: <discovered>"
git push -u origin claude/fix-dashboard-loading-banner
```

## Final report

```
CC 016 complete (Dashboard date range banner).
Root cause: <discovered>
Behavior now: resolves in <Xs> or hides after 10s timeout.
Branch pushed; no PR.
```
