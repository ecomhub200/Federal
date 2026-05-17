# Batch 5 risk analysis — Prompt 37 `map/map-render.js`

Analysed 2026-05-16 against `app/index.html` @ 151,729 lines (post-regen
INDEX_MAP). Documentation only — nothing extracted.

## §1 Re-derived anchors (current line numbers)

| Anchor (as written in prompt) | Usable? |
|---|---|
| `(map render/cluster fns)` — §0 grep is `grep -nE '[Mm]ap' app/index.html` | ❌ NO |

🔴 **The prompt has no real anchor.** §0 step 1 greps the literal pattern
`[Mm]ap`, which matches many thousands of lines (`map`, `Map`, `mapbox`,
`mapping`, every `.map(`…). It is impossible to "read the braces around the
matches" to derive `[BLK_START, BLK_END]`. §1's anchor bullet is the
placeholder `(map render/cluster fns)` and §2's public API is literally
`window.(map render/cluster fns)`. MODULAR_PLAN §5 item 4 already flags this
soft placeholder as unfixed.

- Snapshot range L56001–L59000 (~3,000 lines) is stale and, like prompt 33,
  unreliable as a size/locator.
- Real anchors must be **derived** from regenerated `INDEX_MAP_part2.md` in
  the Map region (the `Map`-tagged rows for marker/cluster/heat rendering +
  popups) before this prompt is runnable.

## §2 Shared-global usage

Not assessable until real anchors are chosen. The Map cluster broadly touches
app-wide shared state (`crashState`, map instance globals, `jurisdictionContext`);
those stay inline with `window` mirrors per the standard rule. Defer the
precise read-set to the re-anchoring step.

## §3 Onclick consumers

Not assessable without concrete function names. To be enumerated against the
chosen anchor set during re-anchoring (each onclick-bound fn needs
`window.<fn>`).

## §4 Extraction safety verdict

**NEEDS-PRE-WORK** (anchor-derivation) **+ NEEDS-PRE-WORK** (dependency).

1. **Anchor fix required**: replace the `[Mm]ap` / `(map render/cluster fns)`
   placeholders with the real `Map`-tagged render/cluster/heat function names
   from regenerated INDEX_MAP_part2, and rewrite §0/§1/§2/§5 accordingly.
   Until then the prompt **cannot run** (no derivable block).
2. §0 check #4 (`grep '<script src="modules/map/map-layers.js">'`) = **0** —
   load anchor is **prompt 36 (`map/map-layers.js`)**, not extracted.
3. The Map region is also noted as physically interleaved (MODULAR_PLAN R5,
   bands 38↔16) — single-contiguous-block model may not hold; Cowork review
   mandatory.

## §5 Contribution to Batch 5 order

Lowest readiness of the runnable set. Order: **(a)** ship prompt 36
(map-layers); **(b)** re-anchor prompt 37 from the regenerated INDEX_MAP
(documentation pre-work); **(c)** only then schedule the LARGE BLOCK
extraction under Cowork pause. Keep it **after** the 19–22 chain and the
cmf-search/cmf-ai prework; do not attempt before re-anchoring.
