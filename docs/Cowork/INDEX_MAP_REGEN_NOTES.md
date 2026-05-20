# INDEX_MAP regeneration notes — 2026-05-20

## 2026-05-20 refresh

Re-ran `scripts/gen_index_map.py` against the live `app/index.html` after
17,243 lines of further extraction (151,729 → **134,486**). Counts:

| Metric | 2026-05-16 | 2026-05-20 |
|---|---|---|
| Source lines | 151,729 | 134,486 |
| Declarations | 3,556 | 2,926 |
| named fns | 2,388 | 2,012 |
| const-arrow | 1,161 | 907 |
| Globals | 287 | 251 |
| Listeners | 58 | 52 |
| Part 1 / 2 / 3 / 4 rows | 513 / 1233 / 1044 / 766 | 496 / 1086 / 969 / 375 |

Two generator fixes shipped this run:

1. **Output path** — generator was writing to repo ROOT; the canonical files
   live under `docs/Cowork/`. Added `OUT_DIR = docs/Cowork` and routed all
   reads + writes through it. Stale root copies (`/INDEX_MAP*.md`) deleted.
2. **Name-join regex** — `parse_old_parts()` only matched the original 9-col
   layout. The 2026-05-16 run wrote 11 columns (added `True End L` /
   `True LOC`), so the join silently produced `matched=0` and dropped every
   curated `Proposed module` assignment. Added an 11-col regex with the 9-col
   pattern as fallback. This run: **matched=2,926 / dup_todo=0 / new=0**
   (100% join — all current declarations preserve their curated mapping).

`navigateTo` row spot-check: heuristic end 19159 (legacy heuristic still
emits the bogus phantom — kept for continuity), **True end 132 / True LOC 12**
— correct. Use only the `True *` columns for span decisions.

No `app/index.html` edits this session. Read-only on source; writes confined
to `docs/Cowork/INDEX_MAP*.md` and `scripts/gen_index_map.py` (generator fix).

---

# INDEX_MAP regeneration notes — 2026-05-16 (historical)

## Why

`INDEX_MAP.md` + `INDEX_MAP_part1..4.md` were generated from a stale
**2026-05-15 / 159,387-line** snapshot of `app/index.html`. The live file is
now **151,729 lines** (−7,658 after Batches 1–3 + Session A geo-tier). Every
"Snapshot line range" in every `modular-prompts/*.md` had drifted ~7.6k lines,
and the `End L = next-declaration-start − 1` heuristic produced a **phantom**:

```
OLD: | 121 | 16561 | 16441 | `navigateTo` | window fn | — | refs:34 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
NEW: | 121 | 19135 |  132  | 19015 | 12 | `navigateTo` | window fn | — | refs:21 | Tab Dispatcher | `app/modules/app/tab-dispatcher.js` |
```

`navigateTo` is a **12-line boot stub (L121–132)**, not a 16,441-LOC function.
The legacy heuristic now reports an even larger bogus span (19,015) because the
next *detected* declaration moved further away — which is exactly why the new
`True End L` / `True LOC` brace-matched columns were added and why the ⚠ note
is now mandatory in every part header.

## Generator

**Script:** [`scripts/gen_index_map.py`](scripts/gen_index_map.py) — Python 3
stdlib only, read-only on `app/index.html`. No prior generator existed in-repo
(confirmed by repo-wide search); this is a fresh implementation that reproduces
the original format byte-for-byte plus the documented 2-column extension.

Pipeline:

1. **Declaration detection** (line-anchored, whitespace tolerant):
   - `window fn`: `^\s*window\.NAME\s*=\s*(async )?function`
   - `fn` / `async fn`: `^\s*(async )?function NAME(`
   - `const arrow` / `async const arrow`: `^\s*const NAME = (async )?(function| … =>)`
2. **End L (heuristic)** = next declaration start − 1 — **kept for continuity
   and to expose the drift**, never trusted for large spans.
3. **True End L / True LOC** = brace-matched via a string / line-comment /
   block-comment / regex-literal / template-literal (`${ }` nesting) aware
   character scanner. Expression-bodied arrows terminate at `;`/`,` at
   paren/bracket depth 0. `?` is emitted only if a `{`-block never closes
   within the cap (0 such cases this run).
4. **Name-join** (preserve curation): the prior map is parsed into
   `name → {Depends on, Tab/feature, Proposed module}`. A current declaration
   inherits those three columns when **all** old rows of that name agree
   (consensus); `Used by` is preserved for **uniquely**-named matches and
   recomputed as a coarse substring fan-out otherwise.
5. **Partition** by Start L into the unchanged bands L1–40000 / 40001–80000 /
   80001–120000 / 120001–end.
6. Globals + listeners sections regenerated the same way (modules name-joined
   from the old master).

## Decisions (locked with the user before execution)

| Decision | Choice |
|---|---|
| Branch | `claude/regenerate-index-map-KyW86` (system Git Development Branch Requirements; current HEAD). NOT the task-body `claude/session-f-...` name. |
| Regen mode | **Preserve by name-join** — refresh Start/End/LOC/Name/Type; carry forward curated Depends-on / Tab / Proposed-module by name. |
| End-L fix | **Brace-count + note** — keep legacy `End L`/`LOC`, add authoritative `True End L`/`True LOC`, add the ⚠ header note. |

## Counts: old → new

| Metric | Old (2026-05-15) | New (2026-05-16) |
|---|---|---|
| Source lines | 159,387 | 151,729 |
| Declarations | 3,685 | 3,556 |
| named fns | 2,577 | 2,388 |
| window fns | 7 | 7 |
| const-arrow | 1,101 | 1,161 |
| Top-level globals | 332 | 287 |
| Top-level listeners | 74 | 58 |
| Part 1 / 2 / 3 / 4 rows | 633 / 1112 / 1059 / 881 | 513 / 1233 / 1044 / 766 |

Name-join: **matched 2,710** · dup-name TODO-REVIEW **0** · new (no old match)
**846**. All 169 duplicate-name groups in the old map had column consensus, so
none degraded to `TODO-REVIEW`; the 846 "new" rows carry a trailing ` (new)`
marker on the Proposed-module column and default to `Unassigned`.

## Diff summary (old vs regenerated)

| File | Old lines | New lines | diff lines |
|---|---|---|---|
| INDEX_MAP.md | 434 | 373 | 767 |
| INDEX_MAP_part1.md | 643 | 527 | 1165 |
| INDEX_MAP_part2.md | 1122 | 1247 | 2364 |
| INDEX_MAP_part3.md | 1069 | 1058 | 2122 |
| INDEX_MAP_part4.md | 891 | 780 | 1666 |

The diff is intentionally large — every line number shifted ~7.6k and two
columns were added. This is a wholesale replacement, committed as one unit.

## Methodology caveats (read before trusting edge values)

- **`End L` / `LOC` are the legacy heuristic and remain wrong for any block
  whose next detected declaration is far away** (mega-IIFEs, the L84–L134
  early-boot region). Always use `True End L` / `True LOC`. The header note
  states this verbatim.
- **const-arrow 1,101 → 1,161**: the regen regex catches `const NAME = … =>`
  slightly more broadly (incl. some nested arrows). Coarse-inventory
  philosophy, unchanged from the original's intent.
- **Listeners 74 → 58**: detection tightened to indentation-0
  `document.`/`window.addEventListener` (literally "module top-level"). This
  section is advisory; the count delta is methodology, not data loss.
- **`Used by` (refs:N)** is preserved verbatim for uniquely-named matches and
  recomputed (fresh substring fan-out) for duplicate / new names — the column
  is defined as a coarse signal, so recomputation is strictly more current.
- **Stale anchors are now detectable.** Example surfaced during regen:
  `ensureTierBoundaryDisplayed` (modular-prompt 38's primary anchor) no longer
  exists as an inline declaration — it appears only as a *call* at
  `app/index.html:145447`, i.e. already extracted. Such cases are analysed in
  `BATCH_5_PROMPT_*_RISK.md`.

## Verification performed

- `git status` after overwrite shows ONLY the 5 `INDEX_MAP*` files +
  `scripts/gen_index_map.py` — zero changes to `app/index.html` or any
  `app/modules/*.js` (blast radius confirmed).
- `navigateTo` row corrected (True LOC 12); top True-LOC rows are realistic
  report builders (`printFullCMFReport` 1484, `generateCrashTreeReport` 1434)
  — no phantom > ~1.5k.
- Curated assignments spot-checked against the old map for the Batch-5 anchors
  (`initCrashTreeTab`→Crash Tree, `initSafetyFocus`→Safety Focus,
  `runADAnalysis`→Analysis, …) — all preserved.
- `brace_unbalanced_or_expr=0` — all 3,556 declarations resolved a real end.
- **No Playwright smoke test**: this session changes only documentation /
  Python tooling — there is no UI surface on the GitHub Pages deployment, so
  the CLAUDE.md browser-test requirement does not apply.

## Reproduce

```bash
python3 scripts/gen_index_map.py            # overwrite INDEX_MAP*.md
python3 scripts/gen_index_map.py --sidecar  # write *.regenerated for diffing
```
