# CC Modular Extraction Prompt 37-v2 — `app/modules/map/map-render.js` (RE-ANCHORED)

**Supersedes `modular-prompts/37-map-map-render.md`** (had NO usable anchor —
§0 grep was the literal `[Mm]ap` matching thousands of lines; §1/§2 used the
placeholder `(map render/cluster fns)`; that file is byte-unmodified, see
`modular-prompts/SUPERSEDED.md`). Re-anchored 2026-05-17 (CC Session H) against
live `app/index.html` @ **149,314 lines**. Source risk doc:
`BATCH_5_PROMPT_37_RISK.md`.

**Severity:** Refactor (no behavior change). **One file per session — do NOT
batch.** **Run AFTER prompt 36 (map/map-layers).**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive the ACTUAL block by brace read in §0.

## §0 Pre-flight verification (run BEFORE editing)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the render block by REAL NAMES (replaces the dead [Mm]ap grep).
#    Live core map-render anchors:
#      initMap            ~L44122
#      fitMapToData       ~L44388
#      getFilteredMapPoints ~L44418
#      updateMapDisplay   ~L44621   (primary render entrypoint)
#      createMarker       ~L44742
grep -nE 'function +(initMap|fitMapToData|getFilteredMapPoints|updateMapDisplay|createMarker|isValidMapPoint|getSeverityMarkerColor)\b' app/index.html
#    Read braces around EACH. The render cluster is ≈ L44116–L44930.

# 2. 🔴 INTERLEAVING CHECK (BATCH_5_PROMPT_37_RISK.md §1; MODULAR_PLAN R5).
#    The Map region is NOT one clean contiguous block — FOREIGN decls sit
#    nearby and MUST be excluded from the render band:
#      - PDF-map helpers: addStaticMapToPDF ~L46775, addEnhancedMapSectionToPDF
#        ~L46821  → belong to a reports/PDF band, NOT map-render.
#      - Address-search: buildMapSearchData ~L46084, updateMapSearchPlaceholder
#        ~L45673/~L46250, clearMapAddressSearch ~L46465 → map-search, NOT
#        map-render.
awk -F'|' 'NR>9 && ($2+0)>=44100 && ($2+0)<=47000' INDEX_MAP_part2.md
#    Read each row's feature tag. The extraction band MUST contain ONLY the
#    Map marker/cluster/heat render/popup decls — STOP the band before the
#    address-search / PDF-map decls. Single-contiguous-block model may NOT
#    hold; Cowork picks the precise sub-band (see §1).

# 3. Target module must not exist yet
test -f app/modules/map/map-render.js && echo "ABORT: exists" || echo "OK"

# 4. Confirm load anchor present (PREREQUISITE — prompt 36)
grep -n '<script src="modules/map/map-layers.js"></script>' app/index.html
#    EXPECTED TODAY: 0 → prompt 36 (map/map-layers.js) not shipped. Documented
#    gate: ABORT until map-layers.js exists + is wired.
```
If any check fails (band not cleanly contiguous, target exists, **anchor
missing — 36 not shipped**, any name maps to an off-limits module — note
`map/map-points-hydrate` + `map/map-safe-helpers` ARE off-limits, cross-check
the §0 awk against them): **ABORT and report — do not edit.**

## §1 What to move

> 🔴 **LARGE BLOCK + RE-ANCHOR — Cowork supervised.** **STOP after the §0 grep
> + interleaving awk.** Surface §0 output AND the proposed render sub-band
> boundary for an explicit **Cowork decision BEFORE** any §4 delete. The Map
> region interleaves render vs. address-search vs. PDF-map vs. the off-limits
> `map-points-hydrate`/`map-safe-helpers`; the render sub-band must be picked
> by **function name** under human review — there is no single trustworthy
> contiguous range.

Move ONLY the map **render/cluster/heat/popup** declarations: anchored on
`initMap`, `fitMapToData`, `getFilteredMapPoints`, `updateMapDisplay`,
`createMarker` (+ `isValidMapPoint`, `getSeverityMarkerColor` and the
render-local helpers between them). **Exclude** the address-search functions
(`buildMapSearchData`, `updateMapSearchPlaceholder`, `clearMapAddressSearch`,
`updateMapSearchClearButton`, `updateMapScopeLabel`, …) and the PDF-map helpers
(`addStaticMapToPDF`, `addEnhancedMapSectionToPDF`) — those are separate
features/bands. Also exclude anything already in the off-limits
`map-points-hydrate` / `map-safe-helpers` modules.

Copy bytes **verbatim**. No renames/reformatting. If the render decls are NOT
contiguous (foreign decls interleaved between them), STOP — Cowork must
re-scope (possibly multiple smaller render modules) rather than a single cut.

## §2 Where to put it
Create `app/modules/map/map-render.js`:

```js
/**
 * CL map.render module — extracted (name-anchored) on 2026-05-17.
 * Round X modular refactor — see modular-prompts/37-v2-map-render-reanchored.md.
 * Responsibility: Map marker/cluster/heat rendering + popups.
 * Public API (dual exposure): each extracted named decl →
 *   window.<fn> + CL.map.render.<fn>  (initMap, updateMapDisplay, createMarker,
 *   fitMapToData, getFilteredMapPoints, …) — enumerate per the confirmed band.
 * Depends on: map/map-layers, map/map-safe-helpers, map/map-points-hydrate
 *   (script-tag load order). crashState / map instance globals app-wide.
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim from index.html) ───

  // <paste the Cowork-confirmed render sub-band here, completely unchanged>

  // ─── EXTRACTED CODE END ───

  window.CL = window.CL || {};
  CL.map = CL.map || {}; CL.map.render = CL.map.render || {};
  // For EACH extracted onclick/callsite-bound decl:
  //   window.<fn> = <fn>; CL.map.render.<fn> = <fn>;
  CL._registerModule('map/map-render');
})();
```
Path-style registration `'map/map-render'`. `CL.map` already exists in
`loader.js` (other map modules). Enumerate the real `window.<fn>` exports from
the confirmed band (the placeholder `window.(map render/cluster fns)` from the
old prompt is GONE).

## §3 Wire the script tag
Immediately AFTER `<script src="modules/map/map-layers.js"></script>` (LATE
cluster):
```html
<script src="modules/map/map-render.js"></script>
```

## §4 Remove the original code from `app/index.html`
**(Cowork render-sub-band decision must have cleared §0/§1 first.)**
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# Re-scan the §0 awk over [BLK_START,BLK_END]: it must contain ONLY Map
# render/cluster/heat/popup decls — zero address-search / PDF-map / off-limits
# rows. Only then delete.
```

## §5 Post-flight verification
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # − moved-fn count
node --check app/modules/map/map-render.js                           # pass
grep -nE 'function +(initMap|updateMapDisplay|createMarker)\b' app/index.html       # 0
grep -nE 'function +(initMap|updateMapDisplay|createMarker)\b' app/modules/map/map-render.js  # present
grep -c '<script src="modules/map/map-render.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the new module
```
Console: `[CL] Module loaded: map/map-render`.

## §6 Functional smoke test
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the Map tab: markers/clusters/heat render, popups open, filters
re-render the map (`updateMapDisplay`), bounds fit (`fitMapToData`). Confirm
`typeof window.updateMapDisplay === 'function'`. `playwright-cli close`.
Screenshot for the PR (UI-visible).

## §7 Rollback
```bash
git checkout -- app/index.html && rm app/modules/map/map-render.js
```

## §8 Out of scope
Renames/reformatting; address-search or PDF-map decls; the off-limits
`map-points-hydrate`/`map-safe-helpers`; moving app-wide map/crash globals
(window mirror only); CLAUDE.md edits; PR unless asked.

---
### Prerequisite & ordering
- **Gated by prompt 36** (`map/map-layers.js` — §0 check #4).
- Lowest readiness of the runnable set: ship 36 → re-confirm these anchors
  (drift) → Cowork render-sub-band decision → only then the LARGE BLOCK
  extraction. Keep **after** the 19–22 chain and the 31/32 cmf prework.
