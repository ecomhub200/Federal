# CC Modular Extraction Prompt 26 — `app/modules/spatial/r2-resolve.js`

**Severity:** Refactor (no behavior change). **One file per session — do NOT batch with other extraction prompts.**

Read `CLAUDE.md` (repo root) "Modular Extraction Refactor" section first. This
prompt is self-contained. `INDEX_MAP_part1.md` is the **authoritative
declaration list** for this extraction; the function names below are anchors to
locate the block. Snapshot ranges may have drifted from earlier prompts — always
re-derive the ACTUAL block in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
# Snapshot — needed to prove "no behavior change"
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the block. Snapshot range: L23144-L23763 (feature: R2 manifest + data-availability + URL resolution + CSV fallback.)
grep -nE 'function +loadR2Manifest\b|const +loadR2Manifest\b|let +loadR2Manifest\b|window\.loadR2Manifest\b|loadR2Manifest *= *function|loadR2Manifest *= *async|loadR2Manifest *= *\(|function +checkR2DataAvailability\b|const +checkR2DataAvailability\b|let +checkR2DataAvailability\b|window\.checkR2DataAvailability\b|checkR2DataAvailability *= *function|checkR2DataAvailability *= *async|checkR2DataAvailability *= *\(|function +resolveDataUrl\b|const +resolveDataUrl\b|let +resolveDataUrl\b|window\.resolveDataUrl\b|resolveDataUrl *= *function|resolveDataUrl *= *async|resolveDataUrl *= *\(|function +fetchCsvWithFallback\b|const +fetchCsvWithFallback\b|let +fetchCsvWithFallback\b|window\.fetchCsvWithFallback\b|fetchCsvWithFallback *= *function|fetchCsvWithFallback *= *async|fetchCsvWithFallback *= *\(|function +diagR2Connection\b|const +diagR2Connection\b|let +diagR2Connection\b|window\.diagR2Connection\b|diagR2Connection *= *function|diagR2Connection *= *async|diagR2Connection *= *\(' app/index.html
#    Read the braces around the matches to find the ACTUAL contiguous
#    block [BLK_START, BLK_END]. Use THOSE, not the snapshot, from here on.

# 2. Authoritative declaration set: every INDEX_MAP_part1.md row whose
#    `Start L` falls in [BLK_START, BLK_END] is a declaration to move
#    (name + Start/End L + type). Snapshot-range preview (if BLK spans a
#    40k boundary, also grep the adjacent INDEX_MAP_part file):
awk -F'|' 'NR>9 && ($2+0)>=23144 && ($2+0)<=23763' INDEX_MAP_part*.md
#    Cross-check: none of those names belong to an off-limits module in CLAUDE.md.

# 3. Target module must not exist yet
test -f app/modules/spatial/r2-resolve.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Confirm load anchor still present
grep -n '<script src="modules/spatial/geo-tier.js"></script>' app/index.html   # expected: 1 match
```
If any check fails (block not found/contiguous, target exists, anchor missing,
any name maps to an off-limits module): **ABORT and report — do not edit.**

## §1 What to move
From `app/index.html`, extract the **single contiguous block [BLK_START,
BLK_END]** confirmed in §0 (snapshot L23144–L23763, ~620 lines). The exact
declarations are the `INDEX_MAP_part1.md` rows inside that range. Anchor
declarations (use to find the block):
- `loadR2Manifest` (and the helpers between it and the next named decl)
- `checkR2DataAvailability` (and the helpers between it and the next named decl)
- `resolveDataUrl` (and the helpers between it and the next named decl)
- `fetchCsvWithFallback` (and the helpers between it and the next named decl)
- `diagR2Connection` (and the helpers between it and the next named decl)

Globals (module-private — move with the code):
- `R2_BASE_URL`
- `r2State`
- `APP_PATHS`
Copy bytes **verbatim** — preserve every blank line, comment, and leading space.
The diff between the original lines and the new module body must be byte-for-byte
identical modulo the IIFE wrapper. **No renames, no reformatting, no "improvements".**
If the confirmed block exceeds ~500 lines, STOP and report — it likely needs the
sub-split noted in `MODULAR_PLAN.md` §2 for this module rather than one file.

## §2 Where to put it
Create `app/modules/spatial/r2-resolve.js`:

```js
/**
 * CL spatial.r2Resolve module
 *
 * Extracted from app/index.html (snapshot L23144-L23763) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/26-spatial-r2-resolve.md.
 * Responsibility: R2 manifest + data-availability + URL resolution + CSV fallback.
 *
 * Public API (back-compat dual exposure):
 *   - window.loadR2Manifest → CL.spatial.r2Resolve.loadR2Manifest
 *   - window.checkR2DataAvailability → CL.spatial.r2Resolve.checkR2DataAvailability
 *   - window.resolveDataUrl → CL.spatial.r2Resolve.resolveDataUrl
 *   - window.fetchCsvWithFallback → CL.spatial.r2Resolve.fetchCsvWithFallback
 *   - window.diagR2Connection → CL.spatial.r2Resolve.diagR2Connection
 *
 * Depends on (must load before this file): `spatial/aggregate-loader`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted lines here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.loadR2Manifest = loadR2Manifest; CL.spatial.loadR2Manifest = loadR2Manifest;
  window.checkR2DataAvailability = checkR2DataAvailability; CL.spatial.checkR2DataAvailability = checkR2DataAvailability;
  window.resolveDataUrl = resolveDataUrl; CL.spatial.resolveDataUrl = resolveDataUrl;
  window.fetchCsvWithFallback = fetchCsvWithFallback; CL.spatial.fetchCsvWithFallback = fetchCsvWithFallback;
  window.diagR2Connection = diagR2Connection; CL.spatial.diagR2Connection = diagR2Connection;
  CL._registerModule('spatial/r2-resolve');
})();
```
Registration string is **path-style** `'spatial/r2-resolve'` (matches `loader.js`
convention — logs `[CL] Module loaded: spatial/r2-resolve`). If `CL.spatial.r2Resolve` needs a new
top-level `CL.` key not in `loader.js`, add ONLY that key to `loader.js`.

## §3 Wire the script tag
Add this line in `app/index.html` immediately AFTER the existing
`<script src="modules/spatial/geo-tier.js"></script>` (this places it in the **EARLY** cluster
with correct load order vs. its dependencies):

```html
<script src="modules/spatial/r2-resolve.js"></script>
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
wc -l app/modules/spatial/r2-resolve.js                      # ≈ extracted + ~25 wrapper
grep -nE 'function +loadR2Manifest\b|const +loadR2Manifest\b|let +loadR2Manifest\b|window\.loadR2Manifest\b|loadR2Manifest *= *function|loadR2Manifest *= *async|loadR2Manifest *= *\(|function +checkR2DataAvailability\b|const +checkR2DataAvailability\b|let +checkR2DataAvailability\b|window\.checkR2DataAvailability\b|checkR2DataAvailability *= *function|checkR2DataAvailability *= *async|checkR2DataAvailability *= *\(|function +resolveDataUrl\b|const +resolveDataUrl\b|let +resolveDataUrl\b|window\.resolveDataUrl\b|resolveDataUrl *= *function|resolveDataUrl *= *async|resolveDataUrl *= *\(|function +fetchCsvWithFallback\b|const +fetchCsvWithFallback\b|let +fetchCsvWithFallback\b|window\.fetchCsvWithFallback\b|fetchCsvWithFallback *= *function|fetchCsvWithFallback *= *async|fetchCsvWithFallback *= *\(|function +diagR2Connection\b|const +diagR2Connection\b|let +diagR2Connection\b|window\.diagR2Connection\b|diagR2Connection *= *function|diagR2Connection *= *async|diagR2Connection *= *\(' app/index.html                     # expected: 0 matches (anchors gone)
grep -nE 'function +loadR2Manifest\b|const +loadR2Manifest\b|let +loadR2Manifest\b|window\.loadR2Manifest\b|loadR2Manifest *= *function|loadR2Manifest *= *async|loadR2Manifest *= *\(|function +checkR2DataAvailability\b|const +checkR2DataAvailability\b|let +checkR2DataAvailability\b|window\.checkR2DataAvailability\b|checkR2DataAvailability *= *function|checkR2DataAvailability *= *async|checkR2DataAvailability *= *\(|function +resolveDataUrl\b|const +resolveDataUrl\b|let +resolveDataUrl\b|window\.resolveDataUrl\b|resolveDataUrl *= *function|resolveDataUrl *= *async|resolveDataUrl *= *\(|function +fetchCsvWithFallback\b|const +fetchCsvWithFallback\b|let +fetchCsvWithFallback\b|window\.fetchCsvWithFallback\b|fetchCsvWithFallback *= *function|fetchCsvWithFallback *= *async|fetchCsvWithFallback *= *\(|function +diagR2Connection\b|const +diagR2Connection\b|let +diagR2Connection\b|window\.diagR2Connection\b|diagR2Connection *= *function|diagR2Connection *= *async|diagR2Connection *= *\(' app/modules/spatial/r2-resolve.js       # expected: the anchors present
grep -c '<script src="modules/spatial/r2-resolve.js"></script>' app/index.html  # 1
node --check app/modules/spatial/r2-resolve.js               # must pass
git diff --stat                 # ONLY app/index.html + the new module file
```
On app load the console must show: `[CL] Module loaded: spatial/r2-resolve`.

## §6 Functional smoke test (deployed GitHub Pages — per CLAUDE.md)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console      # expected: NO new errors; [CL] Module loaded line present
```
- Exercise the feature these functions drive: R2 manifest + data-availability + URL resolution + CSV fallback.
- In DevTools confirm `typeof window.loadR2Manifest` → `'function'` and
  `typeof CL.spatial.r2Resolve` is defined.
- Verify the feature behaves identically to before extraction.
- `playwright-cli close` when done. Capture a screenshot for the PR if UI-visible.

## §7 Rollback
```bash
git diff --stat   # must show only app/index.html and app/modules/spatial/r2-resolve.js
git checkout -- app/index.html
rm app/modules/spatial/r2-resolve.js
```

## §8 Out of scope (do NOT do these here)
- Refactoring/renaming/reformatting the extracted code.
- Extracting any other functions or any of the off-limits modules in `CLAUDE.md`.
- Moving app-wide shared globals still read by remaining inline code (window mirror only).
- Updating `CLAUDE.md` (the orchestrator appends this module to the protected list after this prompt verifies green).
- Creating a PR unless explicitly asked.
