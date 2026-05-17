# Prompt 44-v2 — Whole-IIFE wholesale extraction → `data/dashboard-filter-bindings.js`

> **This SUPERSEDES the BLOCKED prompt `44-data-filter-wiring.md`.**
> After 44-v2 runs and verifies green, **prompt 44 is COMPLETE** — do NOT
> also run `44-data-filter-wiring.md`. See
> `MODULAR_PLAN_44_v2_IIFE_WHOLESALE_PLAN.md` and
> `modular-prompts/SUPERSEDED.md`.

**Why this exists:** prompt 44's 5 target functions are not a standalone
block — they live inside one shared `(function () { 'use strict'; … })();`
IIFE that also holds 9 sibling functions + closure-private state
(`_trafficCtrlCache`). You cannot lift 5 functions out of a closure. The fix
is to extract the **entire IIFE verbatim as one module**. All 14 inner
functions are provably self-contained (zero external / zero `onclick=`
references), so this move is behaviorally inert.

**Module to create:** `app/modules/data/dashboard-filter-bindings.js`
**CL key:** `CL.data` (already in `loader.js` — no new namespace root)
**Load cluster:** LATE (with the other late `data/*` scripts)
**One module per session. Verbatim only. NO behavior changes.**

---

## §0 — Pre-flight (ABORT if any check fails)

Anchor on **function names + the close log**, never on line numbers (the
file drifts between sessions). The Session-I snapshot was
L148182–L148874 / 149,314-line file — treat as advisory only.

```bash
cd /home/user/Federal

# 0.1 — exactly ONE matching IIFE wrapper
grep -nE "^\(function \(\) \{$" app/index.html
#   expect the wrapper line immediately followed by `    'use strict';`
#   and preceded (4 lines up) by the banner:
#   `// All event handlers are idempotent — safe to re-run on tab change.`

# 0.2 — the 14 inner declarations all present, in one contiguous run
for fn in _activeStateKey _yearFromIsoDate populateTrafficControlDropdown \
  _applyTrafficCtrlOptions applyStateAwareCheckboxDefaults \
  _hasCMFLocationSelected _refreshActiveScopeCard \
  _r18ApplyDashboardYearFilter _r18ReloadHotspots _r18ReloadIntersections \
  _r19LoadSafetyCategoriesWithFilter _bindOnce _bindFilterInputs \
  _restoreFilterInputs; do
    n=$(grep -nE "^[[:space:]]+(async )?function ${fn}\b" app/index.html | wc -l)
    echo "$fn: $n decl"   # each MUST be exactly 1
done

# 0.3 — the IIFE close anchor
grep -n "console.log('\[Round 18\] Filter-audit wiring loaded.');" app/index.html
#   the very next non-blank line MUST be `})();` then `</script>`

# 0.4 — target module must NOT already exist
test ! -e app/modules/data/dashboard-filter-bindings.js && echo "OK: target free"

# 0.5 — self-containment: NONE of the 14 names referenced outside the IIFE
#   Derive START = line of `(function () {`, END = line of `})();`
#   after the [Round 18] log. Then:
for fn in _r18ApplyDashboardYearFilter _r18ReloadHotspots \
  _r18ReloadIntersections _r19LoadSafetyCategoriesWithFilter \
  _bindFilterInputs _restoreFilterInputs _bindOnce \
  populateTrafficControlDropdown applyStateAwareCheckboxDefaults \
  _applyTrafficCtrlOptions _hasCMFLocationSelected _refreshActiveScopeCard \
  _yearFromIsoDate _activeStateKey; do
    echo "--- $fn outside [START,END] ---"
    grep -n "\b$fn\b" app/index.html | awk -F: -v S=START -v E=END '$1<S || $1>E'
done
#   `_activeStateKey` may show ONE coincidental hit: a local
#   `const _activeStateKey = …` inside an UNRELATED function (~L100645).
#   That is a different binding, not a call into this IIFE — OK.
#   ANY OTHER name appearing outside [START,END] → ABORT (no longer
#   self-contained; re-evaluate scope before extracting).

# 0.6 — none of the 14 names maps to an off-limits module
grep -rlnE "\b(_r18ApplyDashboardYearFilter|_r18ReloadHotspots|_r18ReloadIntersections|_r19LoadSafetyCategoriesWithFilter|_bindFilterInputs|_restoreFilterInputs)\b" app/modules || echo "OK: not in any module"

# 0.7 — clean working tree, correct branch
git status --short
```

**ABORT** if: the wrapper is not unique; the block is not contiguous; any of
the 14 declarations ≠ 1; the close anchor is missing; the target module
exists; any name (besides the documented coincidental `_activeStateKey`
local) appears outside the IIFE; any name maps to an off-limits module.

---

## §1 — What to move

The **entire IIFE, verbatim**, from the wrapper line:

```
(function () {
    'use strict';
    … all 14 functions + const _trafficCtrlCache = new Map(); …
    console.log('[Round 18] Filter-audit wiring loaded.');
})();
```

i.e. `(function () {` (the START line from §0.5) through `})();` (the END
line from §0.5), inclusive — the Session-I snapshot was **L148182–L148874,
693 lines**. Optionally also carry the 4-line banner comment immediately
above (`// All event handlers are idempotent …`) as the module header
context; if carried, delete it from `index.html` too.

**Disposition of the 14 inner functions:**

| Mirror via `window.*` + `CL.data.*` | Stay inner-IIFE-private (no mirror) |
|---|---|
| `_r18ApplyDashboardYearFilter` | `_activeStateKey` |
| `_r18ReloadHotspots` | `_yearFromIsoDate` |
| `_r19LoadSafetyCategoriesWithFilter` | `populateTrafficControlDropdown` |
| `_bindFilterInputs` | `_applyTrafficCtrlOptions` |
| `_restoreFilterInputs` | `applyStateAwareCheckboxDefaults` |
| | `_hasCMFLocationSelected` |
| | `_refreshActiveScopeCard` |
| | `_r18ReloadIntersections` |
| | `_bindOnce` |

Verbatim copy. **No** reformatting, renaming, comment edits, or logic
changes anywhere in the block.

---

## §2 — Where to put it

Create `app/modules/data/dashboard-filter-bindings.js`:

```js
/* CL module: data/dashboard-filter-bindings
 * Round 18/19 filter-audit wiring (dashboard year filter, hotspots /
 * intersections reload, safety-category filter, traffic-control dropdown,
 * active-scope card). Verbatim wholesale extraction of the shared
 * end-of-body IIFE (was app/index.html, Session-I snapshot L148182–L148874).
 * Public API (forward-compat mirrors — nothing external calls these today):
 *   window._r18ApplyDashboardYearFilter / CL.data._r18ApplyDashboardYearFilter
 *   window._r18ReloadHotspots          / CL.data._r18ReloadHotspots
 *   window._r19LoadSafetyCategoriesWithFilter / CL.data.*
 *   window._bindFilterInputs           / CL.data._bindFilterInputs
 *   window._restoreFilterInputs        / CL.data._restoreFilterInputs
 */
(function () {
    'use strict';

    /* ===== BEGIN verbatim original IIFE (do not modify) ===== */
    (function () {
        'use strict';

        // … all 14 functions + const _trafficCtrlCache … VERBATIM …

        // --- 44-v2 forward-compat mirrors (5 prompt-44 anchors only) ---
        // Placed INSIDE the inner IIFE, just before its close, where these
        // names are in scope. Skip _r18ReloadIntersections / _bindOnce /
        // the 7 helpers (stay closure-private).
        window._r18ApplyDashboardYearFilter        = _r18ApplyDashboardYearFilter;
        window._r18ReloadHotspots                  = _r18ReloadHotspots;
        window._r19LoadSafetyCategoriesWithFilter  = _r19LoadSafetyCategoriesWithFilter;
        window._bindFilterInputs                   = _bindFilterInputs;
        window._restoreFilterInputs                = _restoreFilterInputs;
        if (window.CL && CL.data) {
            CL.data._r18ApplyDashboardYearFilter       = _r18ApplyDashboardYearFilter;
            CL.data._r18ReloadHotspots                 = _r18ReloadHotspots;
            CL.data._r19LoadSafetyCategoriesWithFilter = _r19LoadSafetyCategoriesWithFilter;
            CL.data._bindFilterInputs                  = _bindFilterInputs;
            CL.data._restoreFilterInputs               = _restoreFilterInputs;
        }

        console.log('[Round 18] Filter-audit wiring loaded.');
    })();
    /* ===== END verbatim original IIFE ===== */

    if (window.CL && CL._registerModule) {
        CL._registerModule('data/dashboard-filter-bindings');
    }
})();
```

The only edit to the original code is the 10 mirror-assignment lines + the
`if (window.CL && CL.data)` guard, inserted **immediately before** the
original `console.log('[Round 18] …')` line, **inside the inner IIFE**.
Everything else is byte-for-byte the original.

---

## §3 — Wire the script tag

In `app/index.html`, in the **LATE** module cluster (the run of
`<script src="modules/…">` tags near the end of `<body>`, alongside the
other late `data/*` scripts — locate it fresh; the Session-I snapshot had it
near L153000), add:

```html
<script src="modules/data/dashboard-filter-bindings.js"></script>
```

Place it after `loader.js` and after any `data/*` module it conceptually
sits with. It must load before nothing in particular (the IIFE self-invokes;
its handlers bind on DOM-ready / tab change), so LATE-cluster order among
peers is not sensitive — but keep it grouped with `data/*` for readability.

---

## §4 — Remove the original code

Re-derive START/END by the §0 anchors one more time (the file may have
shifted since §0). Confirm with:

```bash
sed -n '<START-2>,<START+2>p' app/index.html   # shows banner + `(function () {`
sed -n '<END-2>,<END+3>p'   app/index.html     # shows `[Round 18]` log, `})();`, `</script>`
```

Delete exactly `<START>`–`<END>` (the IIFE; plus the 4-line banner above if
you carried it into the module header). The `</script>` that followed the
IIFE and the inline HTML after it must remain untouched.

---

## §5 — Post-flight (all must pass)

```bash
node --check app/modules/data/dashboard-filter-bindings.js   # syntax OK
wc -l app/index.html        # decreased by ≈693 (≈697 if banner carried)
git diff --stat             # ONLY app/index.html + the one new module file
grep -c "function _r18ApplyDashboardYearFilter\|function _bindFilterInputs" app/index.html  # 0
```

- Named-function count in `index.html` dropped by 14.
- New module exists, `node --check` clean, script tag in the LATE cluster.
- `git diff --stat` shows exactly two paths.

---

## §6 — Functional smoke test (deployed GitHub Pages)

Per CLAUDE.md, drive the real deployed app — not a local server:

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console            # baseline — note any pre-existing errors
# Navigate to Dashboard, change the year filter:
playwright-cli click e<ref-dashboard-tab>
playwright-cli fill  e<ref-year-filter> "2023"
playwright-cli snapshot           # hotspots / intersections / safety re-render
playwright-cli console            # MUST show no NEW errors
playwright-cli screenshot --filename=44v2-dashboard-filter-after.png
playwright-cli close
```

Confirm: dashboard year filter applies; hotspots, intersections, and safety
categories reload; console shows `[Round 18] Filter-audit wiring loaded.`
and `[CL] Module loaded: data/dashboard-filter-bindings`; **no new console
errors**. (If GitHub Pages has not yet deployed this branch, state that
explicitly in the PR rather than skipping the step.)

---

## §7 — Rollback

```bash
git checkout -- app/index.html
rm -f app/modules/data/dashboard-filter-bindings.js
```

Single-file revert restores prior behavior exactly (the move is inert).

---

## §8 — Out of scope (do NOT do)

- No refactor, rename, reformat, comment rewrite, or "improvement" of any of
  the 14 functions or the IIFE body.
- Do **not** change the visibility of `_r18ReloadIntersections`, `_bindOnce`,
  or the 7 helpers (no `window.*`/`CL.*` for them).
- Do **not** convert any handler to `addEventListener`.
- Do **not** touch any other prompt, any other module, `CLAUDE.md`,
  `INDEX_MAP*`, `MODULAR_PLAN*`, or any protected file.
- Do **not** run a second extraction in this session.
- Do **not** open a PR unless explicitly asked.
