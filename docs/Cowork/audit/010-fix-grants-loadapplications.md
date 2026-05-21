# CC 010 — [P0 BLOCKER] Fix `loadApplications is not defined` in grants-rank-init

**From:** Chrome Claude audit 2026-05-20. **Severity:** P0 blocker.

**Branch:** `claude/fix-grants-loadapplications`. **No PR.**

## The bug

Console error on every Grants tab visit:
```
ReferenceError: loadApplications is not defined
at initGrantModule (grants-rank-init.js:18:4)
```

`grants-rank-init.js:19` calls `loadApplications()` but the function isn't defined or imported in scope. JS crashes during init, likely preventing some grants functionality.

## §0 Pre-flight (MANDATORY — per CLAUDE.md Policy 1)

```bash
# Read the map FIRST
cat app/CODE_MAP.md | grep -A 3 -i "loadApplications\|grants-rank-init"

# Find loadApplications definition (or confirm it doesn't exist)
grep -rn "function loadApplications\b\|loadApplications\s*=\s*function\|loadApplications\s*=\s*async" app/
grep -rn "window\.loadApplications\b" app/

# Find the failing call site
grep -n "loadApplications" app/modules/grants/grants-rank-init.js
```

**ABORT if:** the function is defined and exposed via `window.loadApplications` already (then it's a load-order bug, not a missing function — different fix).

## Fix approach

Three possible root causes — diagnose first, then pick one:

**Case A — Function never existed (just a typo / dead code):**
Remove the call from `grants-rank-init.js:19`. Add a comment explaining.

**Case B — Function exists in inline `app/index.html` but module loads before it:**
Inline functions in `app/index.html` are hoisted into the global scope AFTER the inline `<script>` tag runs. If `grants-rank-init.js` is loaded via `<script src=>` BEFORE the inline definition, the call throws.
Fix: wrap the call in a defer (`requestAnimationFrame` or `setTimeout(..., 0)`) so it runs after inline scripts hoist, OR move the script tag in `app/index.html` AFTER the inline definition site.

**Case C — Function was meant to exist but never written:**
Stub it as a no-op with a `console.warn('loadApplications: stub, real impl pending')`, OR remove the call entirely.

**Diagnose by:** running the §0 greps. If `loadApplications` exists ONLY in `grants-rank-init.js:19` (no definition anywhere), it's Case A or C. If it exists inline in `app/index.html` somewhere, it's Case B.

## Per-CLAUDE.md policies

- **Policy 2 (Extract-on-touch):** the fix is tiny (1-3 lines). No extraction needed.
- **Policy 3 (Update map):** if you delete a call or add a stub, the function list in `app/CODE_MAP.md` doesn't change unless you ADD a new function. If you do, update the Function index row.

## §5 Post-flight

```bash
node --check app/modules/grants/grants-rank-init.js
git diff --stat # expect only app/modules/grants/grants-rank-init.js (and maybe app/index.html if Case B)
```

## §6 Smoke

```
1. Hard-reload https://ecomhub200.github.io/Federal/app/?_cb=fix010
2. Open DevTools console
3. Click Grants tab in sidebar
4. Verify: NO "loadApplications is not defined" error
5. Grants tab still shows "Highway Safety Improvement Program (HSIP)" row
```

## Commit + push

```bash
git add app/modules/grants/grants-rank-init.js  # + app/index.html and app/CODE_MAP.md if applicable
git commit -m "fix(grants): resolve loadApplications ReferenceError in grants-rank-init [P0]

Root cause: <Case A/B/C — explain>
Fix: <what you did>
Console no longer throws on Grants tab visit."
git push -u origin claude/fix-grants-loadapplications
```

## Final report

```
CC 010 complete (P0 grants loadApplications).
Root cause: <case>
Fix: <one line>
Console errors on Grants tab: was 1, now 0.
Branch pushed; no PR.
```
