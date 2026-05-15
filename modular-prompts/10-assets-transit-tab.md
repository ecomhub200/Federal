# CC Modular Extraction Prompt 10 — `app/modules/assets/transit-tab.js`

**Severity:** Refactor (no behavior change). **One file per session — do NOT batch with other extraction prompts.**

Read `CLAUDE.md` (repo root) "Modular Extraction Refactor" section first. This
prompt is self-contained. `INDEX_MAP_part4.md` is the **authoritative
declaration list** for this extraction; the function names below are anchors to
locate the block. Snapshot ranges may have drifted from earlier prompts — always
re-derive the ACTUAL block in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
# Snapshot — needed to prove "no behavior change"
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block. Snapshot range: L154516-L155490 (feature: Transit-stop safety tab (transitTab* / transitLoad* fns).)
grep -nE 'function +initTransitSafetyTab\b|const +initTransitSafetyTab\b|let +initTransitSafetyTab\b|window\.initTransitSafetyTab\b|initTransitSafetyTab *= *function|initTransitSafetyTab *= *async|initTransitSafetyTab *= *\(|function +transitTabLoadStopsFromBTS\b|const +transitTabLoadStopsFromBTS\b|let +transitTabLoadStopsFromBTS\b|window\.transitTabLoadStopsFromBTS\b|transitTabLoadStopsFromBTS *= *function|transitTabLoadStopsFromBTS *= *async|transitTabLoadStopsFromBTS *= *\(|function +transitLoadStopsForTier\b|const +transitLoadStopsForTier\b|let +transitLoadStopsForTier\b|window\.transitLoadStopsForTier\b|transitLoadStopsForTier *= *function|transitLoadStopsForTier *= *async|transitLoadStopsForTier *= *\(|function +updateTransitTabTable\b|const +updateTransitTabTable\b|let +updateTransitTabTable\b|window\.updateTransitTabTable\b|updateTransitTabTable *= *function|updateTransitTabTable *= *async|updateTransitTabTable *= *\(|function +transitTabExportKML\b|const +transitTabExportKML\b|let +transitTabExportKML\b|window\.transitTabExportKML\b|transitTabExportKML *= *function|transitTabExportKML *= *async|transitTabExportKML *= *\(' app/index.html
#    Read the braces around the matches to find the ACTUAL contiguous
#    block [BLK_START, BLK_END]. Use THOSE, not the snapshot, from here on.

# 2. Authoritative declaration set: every INDEX_MAP_part4.md row whose
#    `Start L` falls in [BLK_START, BLK_END] is a declaration to move
#    (name + Start/End L + type). Snapshot-range preview (if BLK spans a
#    40k boundary, also grep the adjacent INDEX_MAP_part file):
awk -F'|' 'NR>9 && ($2+0)>=154516 && ($2+0)<=155490' INDEX_MAP_part*.md
#    Cross-check: none of those names belong to an off-limits module in CLAUDE.md.

# 3. Target module must not exist yet
test -f app/modules/assets/transit-tab.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Confirm load anchor still present
grep -n '<script src="modules/assets/school-tab.js"></script>' app/index.html   # expected: 1 match
```
If any check fails (block not found/contiguous, target exists, anchor missing,
any name maps to an off-limits module): **ABORT and report — do not edit.**

## §1 What to move
From `app/index.html`, extract the **single contiguous block [BLK_START,
BLK_END]** confirmed in §0 (snapshot L154516–L155490, ~975 lines). The exact
declarations are the `INDEX_MAP_part4.md` rows inside that range. Anchor
declarations (use to find the block):
- `initTransitSafetyTab` (and the helpers between it and the next named decl)
- `transitTabLoadStopsFromBTS` (and the helpers between it and the next named decl)
- `transitLoadStopsForTier` (and the helpers between it and the next named decl)
- `updateTransitTabTable` (and the helpers between it and the next named decl)
- `transitTabExportKML` (and the helpers between it and the next named decl)

Copy bytes **verbatim** — preserve every blank line, comment, and leading space.
The diff between the original lines and the new module body must be byte-for-byte
identical modulo the IIFE wrapper. **No renames, no reformatting, no "improvements".**
If the confirmed block exceeds ~500 lines, STOP and report — it likely needs the
sub-split noted in `MODULAR_PLAN.md` §2 for this module rather than one file.

## §2 Where to put it
Create `app/modules/assets/transit-tab.js`:

```js
/**
 * CL assets.transitTab module
 *
 * Extracted from app/index.html (snapshot L154516-L155490) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/10-assets-transit-tab.md.
 * Responsibility: Transit-stop safety tab (transitTab* / transitLoad* fns).
 *
 * Public API (back-compat dual exposure):
 *   - window.initTransitSafetyTab → CL.assets.transitTab.initTransitSafetyTab
 *   - window.transitTabLoadStopsFromBTS → CL.assets.transitTab.transitTabLoadStopsFromBTS
 *   - window.transitLoadStopsForTier → CL.assets.transitTab.transitLoadStopsForTier
 *   - window.updateTransitTabTable → CL.assets.transitTab.updateTransitTabTable
 *   - window.transitTabExportKML → CL.assets.transitTab.transitTabExportKML
 *
 * Depends on (must load before this file): `assets/school-tab`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted lines here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.assets = CL.assets || {};
  window.initTransitSafetyTab = initTransitSafetyTab; CL.assets.initTransitSafetyTab = initTransitSafetyTab;
  window.transitTabLoadStopsFromBTS = transitTabLoadStopsFromBTS; CL.assets.transitTabLoadStopsFromBTS = transitTabLoadStopsFromBTS;
  window.transitLoadStopsForTier = transitLoadStopsForTier; CL.assets.transitLoadStopsForTier = transitLoadStopsForTier;
  window.updateTransitTabTable = updateTransitTabTable; CL.assets.updateTransitTabTable = updateTransitTabTable;
  window.transitTabExportKML = transitTabExportKML; CL.assets.transitTabExportKML = transitTabExportKML;
  CL._registerModule('assets/transit-tab');
})();
```
Registration string is **path-style** `'assets/transit-tab'` (matches `loader.js`
convention — logs `[CL] Module loaded: assets/transit-tab`). If `CL.assets.transitTab` needs a new
top-level `CL.` key not in `loader.js`, add ONLY that key to `loader.js`.

## §3 Wire the script tag
Add this line in `app/index.html` immediately AFTER the existing
`<script src="modules/assets/school-tab.js"></script>` (this places it in the **LATE** cluster
with correct load order vs. its dependencies):

```html
<script src="modules/assets/transit-tab.js"></script>
```

## §4 Remove the original code from `app/index.html`
Delete exactly the contiguous block you confirmed in §0 (the actual start/end,
not the snapshot if it drifted):

```bash
# Verify the block you are about to delete (use ACTUAL start,end from §0)
sed -n '<start>,<end>p' app/index.html | head -5
sed -n '<start>,<end>p' app/index.html | tail -5
# Only after head/tail confirm this is the right block, delete that line range.
```

## §5 Post-flight verification (run AFTER editing)
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # decreased by the named-fn count moved
wc -l app/modules/assets/transit-tab.js                      # ≈ extracted + ~25 wrapper
grep -nE 'function +initTransitSafetyTab\b|const +initTransitSafetyTab\b|let +initTransitSafetyTab\b|window\.initTransitSafetyTab\b|initTransitSafetyTab *= *function|initTransitSafetyTab *= *async|initTransitSafetyTab *= *\(|function +transitTabLoadStopsFromBTS\b|const +transitTabLoadStopsFromBTS\b|let +transitTabLoadStopsFromBTS\b|window\.transitTabLoadStopsFromBTS\b|transitTabLoadStopsFromBTS *= *function|transitTabLoadStopsFromBTS *= *async|transitTabLoadStopsFromBTS *= *\(|function +transitLoadStopsForTier\b|const +transitLoadStopsForTier\b|let +transitLoadStopsForTier\b|window\.transitLoadStopsForTier\b|transitLoadStopsForTier *= *function|transitLoadStopsForTier *= *async|transitLoadStopsForTier *= *\(|function +updateTransitTabTable\b|const +updateTransitTabTable\b|let +updateTransitTabTable\b|window\.updateTransitTabTable\b|updateTransitTabTable *= *function|updateTransitTabTable *= *async|updateTransitTabTable *= *\(|function +transitTabExportKML\b|const +transitTabExportKML\b|let +transitTabExportKML\b|window\.transitTabExportKML\b|transitTabExportKML *= *function|transitTabExportKML *= *async|transitTabExportKML *= *\(' app/index.html                     # expected: 0 matches (anchors gone)
grep -nE 'function +initTransitSafetyTab\b|const +initTransitSafetyTab\b|let +initTransitSafetyTab\b|window\.initTransitSafetyTab\b|initTransitSafetyTab *= *function|initTransitSafetyTab *= *async|initTransitSafetyTab *= *\(|function +transitTabLoadStopsFromBTS\b|const +transitTabLoadStopsFromBTS\b|let +transitTabLoadStopsFromBTS\b|window\.transitTabLoadStopsFromBTS\b|transitTabLoadStopsFromBTS *= *function|transitTabLoadStopsFromBTS *= *async|transitTabLoadStopsFromBTS *= *\(|function +transitLoadStopsForTier\b|const +transitLoadStopsForTier\b|let +transitLoadStopsForTier\b|window\.transitLoadStopsForTier\b|transitLoadStopsForTier *= *function|transitLoadStopsForTier *= *async|transitLoadStopsForTier *= *\(|function +updateTransitTabTable\b|const +updateTransitTabTable\b|let +updateTransitTabTable\b|window\.updateTransitTabTable\b|updateTransitTabTable *= *function|updateTransitTabTable *= *async|updateTransitTabTable *= *\(|function +transitTabExportKML\b|const +transitTabExportKML\b|let +transitTabExportKML\b|window\.transitTabExportKML\b|transitTabExportKML *= *function|transitTabExportKML *= *async|transitTabExportKML *= *\(' app/modules/assets/transit-tab.js       # expected: the anchors present
grep -c '<script src="modules/assets/transit-tab.js"></script>' app/index.html  # 1
node --check app/modules/assets/transit-tab.js               # must pass
git diff --stat                 # ONLY app/index.html + the new module file
```
On app load the console must show: `[CL] Module loaded: assets/transit-tab`.

## §6 Functional smoke test (deployed GitHub Pages — per CLAUDE.md)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console      # expected: NO new errors; [CL] Module loaded line present
```
- Exercise the feature these functions drive: Transit-stop safety tab (transitTab* / transitLoad* fns).
- In DevTools confirm `typeof window.initTransitSafetyTab` → `'function'` and
  `typeof CL.assets.transitTab` is defined.
- Verify the feature behaves identically to before extraction.
- `playwright-cli close` when done. Capture a screenshot for the PR if UI-visible.

## §7 Rollback
```bash
git diff --stat   # must show only app/index.html and app/modules/assets/transit-tab.js
git checkout -- app/index.html
rm app/modules/assets/transit-tab.js
```

## §8 Out of scope (do NOT do these here)
- Refactoring/renaming/reformatting the extracted code.
- Extracting any other functions or any of the off-limits modules in `CLAUDE.md`.
- Moving app-wide shared globals still read by remaining inline code (window mirror only).
- Updating `CLAUDE.md` (the orchestrator appends this module to the protected list after this prompt verifies green).
- Creating a PR unless explicitly asked.
