# Batch 5 risk analysis — Prompt 38 `map/map-boundary.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor | §0 grep result on live `app/index.html` |
|---|---|
| `ensureTierBoundaryDisplayed` | **0 declaration matches** |
| `(boundary restore fns)` | soft placeholder — n/a |

🔴 **The primary anchor no longer exists in `app/index.html`.** It has
**already been extracted** into an off-limits module:

```
app/modules/spatial/geo-tier.js:1336  async function ensureTierBoundaryDisplayed() {
app/modules/spatial/geo-tier.js:1414  window.ensureTierBoundaryDisplayed = ensureTierBoundaryDisplayed;
```

In `app/index.html` it survives only as a **call site** (`L145447:
await ensureTierBoundaryDisplayed();`) and is consumed by the already-extracted
`app/modules/assets/transit-tab.js:498`. `spatial/geo-tier` is on the CLAUDE.md
**off-limits** list (Round X batch 4) — its contents must not be touched.

Snapshot L59001–L61499 (~2,499 lines) is doubly stale: MODULAR_PLAN §5 already
noted `ensureTierBoundaryDisplayed` had drifted to ~L22k; in fact the
geo-tier extraction has since moved it (and its tier-boundary-restore logic,
plus the `jurisdictionChanged`/`tierChanged` wiring it owned) out entirely.

## §2 Shared-global usage

N/A — the boundary-display/tier-restore code and its listeners now live in
`spatial/geo-tier.js`. No residual inline block was found for this module's
responsibility ("Boundary display + tier boundary restore"). The
`jurisdictionChanged` listeners still in `app/index.html` (e.g. L32033,
L46166, L47525…) belong to **other** features (dashboard, capability gates),
not to map-boundary.

## §3 Onclick consumers

N/A — `ensureTierBoundaryDisplayed` is already `window`-exposed from
`geo-tier.js:1414`; no inline extraction surface remains.

## §4 Extraction safety verdict

**SUPERSEDED / ALREADY-DONE** (do not run; not extractable).

- §0 step 1 grep returns **0** → the prompt's own ABORT condition ("block not
  found/contiguous") fires unconditionally.
- §0 check #4 (`grep '<script src="modules/map/map-render.js">'`) = **0**
  (prompt 37 not run) — a second independent ABORT.
- The responsibility was absorbed by `spatial/geo-tier.js`. Re-extracting it
  would collide with an off-limits module.

**Recommendation:** retire prompt 38. Mark it SUPERSEDED in MODULAR_PLAN /
NAVIGATETO-style note (orchestrator action — out of scope for this
documentation session, which must not edit MODULAR_PLAN). If a future audit
finds any residual inline boundary-restore helper, scope a fresh, name-anchored
prompt against the regenerated INDEX_MAP rather than reviving prompt 38.

## §5 Contribution to Batch 5 order

**Removed from the Batch 5 queue.** No extraction work; no scheduling slot.
Treat as a verification/close-out item: confirm `geo-tier.js` covers the
boundary-restore responsibility and strike 38 from the LARGE BLOCK list.
