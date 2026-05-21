# CC 013 — [P1] Fix Crash Tree "Secondary Analysis" stuck spinner

**From:** Chrome Claude audit 2026-05-20. **Severity:** P1 regression.

**Branch:** `claude/fix-crashtree-secondary-spinner`. **No PR.**

## The bug

On Crash Tree tab, the "Secondary Analysis" panel shows "Building secondary analysis..." spinner indefinitely. The async computation never completes (likely unhandled promise rejection or timeout).

## §0 Pre-flight

```bash
# Map lookup for Crash Tree
sed -n '/^### Crash Tree/,/^###/p' app/CODE_MAP.md | head -40

# Find the secondary analysis builder
grep -rn "secondary.*analysis\|Building secondary\|secondaryAnalysis\|buildSecondary" app/modules/ app/index.html | head -20

# Find the spinner element
grep -n "Building secondary" app/index.html
```

## Fix approach

Two-step fix:
1. **Add a timeout** (e.g., 15s) to the async computation that builds the secondary analysis. If it doesn't complete: hide the spinner, show "Secondary analysis unavailable" error state.
2. **Add try/catch** around the async chain. On caught error: log to console, hide spinner, show error state.

Pseudocode:

```js
async function buildSecondaryAnalysis() {
  const spinner = document.getElementById('secondaryAnalysisSpinner');
  const errEl = document.getElementById('secondaryAnalysisError');
  spinner.style.display = 'block';
  if (errEl) errEl.style.display = 'none';
  try {
    const result = await Promise.race([
      computeSecondaryAnalysis(),  // existing code
      new Promise((_, reject) => setTimeout(() => reject(new Error('Secondary analysis timeout (15s)')), 15000))
    ]);
    renderSecondaryAnalysis(result);
  } catch (e) {
    console.warn('[CrashTree] Secondary analysis failed:', e.message);
    if (errEl) {
      errEl.textContent = 'Secondary analysis unavailable: ' + e.message;
      errEl.style.display = 'block';
    }
  } finally {
    spinner.style.display = 'none';
  }
}
```

Investigate WHY the computation hangs (likely a missing matview, undefined data, or infinite loop). Document the root cause in your report.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** if `buildSecondaryAnalysis` is inline and >100 LOC, extract to `analysis/crashtree-secondary.js`.
- **Policy 3 (Update map):** update Crash Tree tab's "Inline functions remaining" section if you extracted anything.

## §5 Post-flight

```bash
node --check <touched files>
git diff --stat
```

## §6 Smoke

```
Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix013

Navigate to Crash Tree tab.

Expected (one of two outcomes):
  A. Spinner shows briefly, then secondary analysis renders correctly
  B. Spinner shows for up to 15s, then disappears with an error state

NOT expected: spinner spins forever.
```

## Commit + push

```bash
git add app/modules/ app/index.html app/CODE_MAP.md
git commit -m "fix(crashtree): resolve secondary analysis stuck spinner [P1]

Was: 'Building secondary analysis...' spun indefinitely.
Now: 15s timeout + error state if computation fails.
Root cause: <discovered cause>"
git push -u origin claude/fix-crashtree-secondary-spinner
```

## Final report

```
CC 013 complete (Crash Tree spinner).
Root cause: <discovered cause>
Behavior now: completes in <Xs>, or shows error after 15s timeout.
Branch pushed; no PR.
```
