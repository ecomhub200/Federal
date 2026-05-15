# CC Modular Extraction Prompt 04 — `app/modules/spatial/spatial-clip.js`

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

# 1. Locate the block. Snapshot range: L22865-L22954 (feature: Turf-based point/line/polygon clipping to a jurisdiction polygon.)
grep -nE 'function +SpatialClipService\b|const +SpatialClipService\b|let +SpatialClipService\b|window\.SpatialClipService\b|SpatialClipService *= *function|SpatialClipService *= *async|SpatialClipService *= *\(|function +getJurisdictionPolygon\b|const +getJurisdictionPolygon\b|let +getJurisdictionPolygon\b|window\.getJurisdictionPolygon\b|getJurisdictionPolygon *= *function|getJurisdictionPolygon *= *async|getJurisdictionPolygon *= *\(|function +clipPoints\b|const +clipPoints\b|let +clipPoints\b|window\.clipPoints\b|clipPoints *= *function|clipPoints *= *async|clipPoints *= *\(|function +clipLines\b|const +clipLines\b|let +clipLines\b|window\.clipLines\b|clipLines *= *function|clipLines *= *async|clipLines *= *\(|function +clipPolygons\b|const +clipPolygons\b|let +clipPolygons\b|window\.clipPolygons\b|clipPolygons *= *function|clipPolygons *= *async|clipPolygons *= *\(' app/index.html
#    Read the braces around the matches to find the ACTUAL contiguous
#    block [BLK_START, BLK_END]. Use THOSE, not the snapshot, from here on.

# 2. Authoritative declaration set: every INDEX_MAP_part1.md row whose
#    `Start L` falls in [BLK_START, BLK_END] is a declaration to move
#    (name + Start/End L + type). Snapshot-range preview (if BLK spans a
#    40k boundary, also grep the adjacent INDEX_MAP_part file):
awk -F'|' 'NR>9 && ($2+0)>=22865 && ($2+0)<=22954' INDEX_MAP_part*.md
#    Cross-check: none of those names belong to an off-limits module in CLAUDE.md.

# 3. Target module must not exist yet
test -f app/modules/spatial/spatial-clip.js && echo "ABORT: target exists" || echo "OK: target free"

# 4. Confirm load anchor still present
grep -n '<script src="modules/spatial/federal-boundaries.js"></script>' app/index.html   # expected: 1 match
```
If any check fails (block not found/contiguous, target exists, anchor missing,
any name maps to an off-limits module): **ABORT and report — do not edit.**

## §1 What to move
From `app/index.html`, extract the **single contiguous block [BLK_START,
BLK_END]** confirmed in §0 (snapshot L22865–L22954, ~90 lines). The exact
declarations are the `INDEX_MAP_part1.md` rows inside that range. Anchor
declarations (use to find the block):
- `SpatialClipService` (and the helpers between it and the next named decl)
- `getJurisdictionPolygon` (and the helpers between it and the next named decl)
- `clipPoints` (and the helpers between it and the next named decl)
- `clipLines` (and the helpers between it and the next named decl)
- `clipPolygons` (and the helpers between it and the next named decl)

Globals (module-private — move with the code):
- `SpatialClipService`
Copy bytes **verbatim** — preserve every blank line, comment, and leading space.
The diff between the original lines and the new module body must be byte-for-byte
identical modulo the IIFE wrapper. **No renames, no reformatting, no "improvements".**
If the confirmed block exceeds ~500 lines, STOP and report — it likely needs the
sub-split noted in `MODULAR_PLAN.md` §2 for this module rather than one file.

## §2 Where to put it
Create `app/modules/spatial/spatial-clip.js`:

```js
/**
 * CL spatial.spatialClip module
 *
 * Extracted from app/index.html (snapshot L22865-L22954) on 2026-05-15.
 * Round X modular refactor — see modular-prompts/04-spatial-spatial-clip.md.
 * Responsibility: Turf-based point/line/polygon clipping to a jurisdiction polygon.
 *
 * Public API (back-compat dual exposure):
 *   - window.SpatialClipService → CL.spatial.spatialClip.SpatialClipService
 *   - window.getJurisdictionPolygon → CL.spatial.spatialClip.getJurisdictionPolygon
 *   - window.clipPoints → CL.spatial.spatialClip.clipPoints
 *   - window.clipLines → CL.spatial.spatialClip.clipLines
 *   - window.clipPolygons → CL.spatial.spatialClip.clipPolygons
 *
 * Depends on (must load before this file): `spatial/federal-boundaries`
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the extracted lines here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  // Public API — window.<fn> (HTML onclick/hoisting back-compat) + CL namespace
  window.CL = window.CL || {};
  CL.spatial = CL.spatial || {};
  window.SpatialClipService = SpatialClipService; CL.spatial.SpatialClipService = SpatialClipService;
  window.getJurisdictionPolygon = getJurisdictionPolygon; CL.spatial.getJurisdictionPolygon = getJurisdictionPolygon;
  window.clipPoints = clipPoints; CL.spatial.clipPoints = clipPoints;
  window.clipLines = clipLines; CL.spatial.clipLines = clipLines;
  window.clipPolygons = clipPolygons; CL.spatial.clipPolygons = clipPolygons;
  CL._registerModule('spatial/spatial-clip');
})();
```
Registration string is **path-style** `'spatial/spatial-clip'` (matches `loader.js`
convention — logs `[CL] Module loaded: spatial/spatial-clip`). If `CL.spatial.spatialClip` needs a new
top-level `CL.` key not in `loader.js`, add ONLY that key to `loader.js`.

## §3 Wire the script tag
Add this line in `app/index.html` immediately AFTER the existing
`<script src="modules/spatial/federal-boundaries.js"></script>` (this places it in the **EARLY** cluster
with correct load order vs. its dependencies):

```html
<script src="modules/spatial/spatial-clip.js"></script>
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
wc -l app/modules/spatial/spatial-clip.js                      # ≈ extracted + ~25 wrapper
grep -nE 'function +SpatialClipService\b|const +SpatialClipService\b|let +SpatialClipService\b|window\.SpatialClipService\b|SpatialClipService *= *function|SpatialClipService *= *async|SpatialClipService *= *\(|function +getJurisdictionPolygon\b|const +getJurisdictionPolygon\b|let +getJurisdictionPolygon\b|window\.getJurisdictionPolygon\b|getJurisdictionPolygon *= *function|getJurisdictionPolygon *= *async|getJurisdictionPolygon *= *\(|function +clipPoints\b|const +clipPoints\b|let +clipPoints\b|window\.clipPoints\b|clipPoints *= *function|clipPoints *= *async|clipPoints *= *\(|function +clipLines\b|const +clipLines\b|let +clipLines\b|window\.clipLines\b|clipLines *= *function|clipLines *= *async|clipLines *= *\(|function +clipPolygons\b|const +clipPolygons\b|let +clipPolygons\b|window\.clipPolygons\b|clipPolygons *= *function|clipPolygons *= *async|clipPolygons *= *\(' app/index.html                     # expected: 0 matches (anchors gone)
grep -nE 'function +SpatialClipService\b|const +SpatialClipService\b|let +SpatialClipService\b|window\.SpatialClipService\b|SpatialClipService *= *function|SpatialClipService *= *async|SpatialClipService *= *\(|function +getJurisdictionPolygon\b|const +getJurisdictionPolygon\b|let +getJurisdictionPolygon\b|window\.getJurisdictionPolygon\b|getJurisdictionPolygon *= *function|getJurisdictionPolygon *= *async|getJurisdictionPolygon *= *\(|function +clipPoints\b|const +clipPoints\b|let +clipPoints\b|window\.clipPoints\b|clipPoints *= *function|clipPoints *= *async|clipPoints *= *\(|function +clipLines\b|const +clipLines\b|let +clipLines\b|window\.clipLines\b|clipLines *= *function|clipLines *= *async|clipLines *= *\(|function +clipPolygons\b|const +clipPolygons\b|let +clipPolygons\b|window\.clipPolygons\b|clipPolygons *= *function|clipPolygons *= *async|clipPolygons *= *\(' app/modules/spatial/spatial-clip.js       # expected: the anchors present
grep -c '<script src="modules/spatial/spatial-clip.js"></script>' app/index.html  # 1
node --check app/modules/spatial/spatial-clip.js               # must pass
git diff --stat                 # ONLY app/index.html + the new module file
```
On app load the console must show: `[CL] Module loaded: spatial/spatial-clip`.

## §6 Functional smoke test (deployed GitHub Pages — per CLAUDE.md)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot
playwright-cli console      # expected: NO new errors; [CL] Module loaded line present
```
- Exercise the feature these functions drive: Turf-based point/line/polygon clipping to a jurisdiction polygon.
- In DevTools confirm `typeof window.SpatialClipService` → `'function'` and
  `typeof CL.spatial.spatialClip` is defined.
- Verify the feature behaves identically to before extraction.
- `playwright-cli close` when done. Capture a screenshot for the PR if UI-visible.

## §7 Rollback
```bash
git diff --stat   # must show only app/index.html and app/modules/spatial/spatial-clip.js
git checkout -- app/index.html
rm app/modules/spatial/spatial-clip.js
```

## §8 Out of scope (do NOT do these here)
- Refactoring/renaming/reformatting the extracted code.
- Extracting any other functions or any of the off-limits modules in `CLAUDE.md`.
- Moving app-wide shared globals still read by remaining inline code (window mirror only).
- Updating `CLAUDE.md` (the orchestrator appends this module to the protected list after this prompt verifies green).
- Creating a PR unless explicitly asked.
