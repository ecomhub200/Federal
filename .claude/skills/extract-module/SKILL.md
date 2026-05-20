---
name: extract-module
description: "Autonomously extract one contiguous JavaScript block from app/index.html into a new CL.* module under app/modules/. Codifies the §0 pre-flight, verbatim extract, dual-exposure wiring, §5 post-flight, and Playwright smoke that every modular-prompts/*.md prompt repeats by hand. Use when running an IIFE-round extraction (modular-prompts/01..46 + sub-chains), when a `-v2` re-anchor is needed because INDEX_MAP drifted, or when a feature inside app/index.html needs to be lifted into a module without behavior changes. Triggers: modular refactor, IIFE extraction, extract module, run modular prompt, CL namespace, app/modules, INDEX_MAP anchor, off-limits, verbatim block."
---

# extract-module — Autonomous IIFE-Round Extraction

This skill turns a hand-tuned `modular-prompts/NN-*.md` prompt into a
**self-driving extraction**. The skill encodes every rule from CLAUDE.md
"Modular Extraction Refactor" so an agent can run §0 → extract → §5 →
smoke without re-deriving the procedure each time.

**Scope**: ONE contiguous block per invocation. ONE new module file.
ZERO behavior changes. The app must work identically before and after.

## Authoritative inputs

Before doing anything else, the agent MUST have:

| Input | How to obtain |
|---|---|
| **Anchor function name** (or names) | From the active `modular-prompts/NN-*.md` §0, OR from `docs/Cowork/INDEX_MAP_part*.md` `Name` column |
| **Target module path** | `app/modules/{area}/{area}-{submodule}.js` per CLAUDE.md "Module Conventions §2" |
| **Target `CL.*` namespace** | e.g. `CL.hotspots.tab`; new root keys go in `app/modules/loader.js` |
| **Live block start/end line** | Re-derive from current `app/index.html` by anchor regex — **never trust INDEX_MAP `End L`/`LOC` (heuristic phantom); use only `True End L`/`True LOC`** |
| **Off-limits list** | CLAUDE.md "Round X extracted (... off-limits)" sections — all already-shipped modules |

If any of those is missing or ambiguous, **STOP** and surface the gap to
the user with `AskUserQuestion`. Do not improvise an anchor.

## §0 — Pre-flight (ABORT-on-fail)

Run every check. ANY failure → STOP, report the failure verbatim, do not
edit `app/index.html`.

1. **Anchor exists in live file.** `grep -n` each anchor name in
   `app/index.html`. If any returns 0 hits OR more than 1 declaration,
   the anchor is invalid — STOP. (Calls don't count; only the
   declaration line.)
2. **Block is contiguous.** From the first anchor's start line to the
   last anchor's brace-matched end, the only declarations in that range
   are the prompt's named set + any nested helpers the prompt lists.
   Anything outside that set → STOP (would be a non-verbatim split).
3. **Target file does NOT exist.** `ls app/modules/{area}/{file}.js` →
   must not exist. If it does → STOP (would be an overwrite, not an
   extract).
4. **No off-limits collision.** Scan CLAUDE.md "off-limits" sections.
   If the target module name OR any moved function name appears there →
   STOP. (Function-name collision is the R1 risk in
   `NAVIGATETO_SPLIT_PLAN.md` — `buildCountyWideCrashProfile` /
   `buildLocationCrashProfile` are the canonical examples.)
5. **CL namespace root exists or is being added.** If the prompt
   introduces a new root key (`CL.dashboard`, `CL.hotspots`, …),
   `loader.js` must already declare it OR the agent adds exactly one
   line to `loader.js` (no other changes). Per CLAUDE.md "Module
   Conventions §6": `loader.js` edits are allowed ONLY to add a new
   top-level `CL.*` key.
6. **Shared globals audit.** For every `let`/`const`/`var` in the
   block: if it is read OR written by remaining inline code, it stays
   inline AND gets a `window.NAME = NAME` mirror inside the IIFE. If it
   is module-private (zero external refs), it moves with the block and
   no mirror. The audit is a `grep -nE '\b<name>\b' app/index.html`
   against the post-extract state — if any inline ref survives without
   a mirror, the app breaks.

## Extraction (verbatim only)

1. **Byte-for-byte copy** of the confirmed block. No reformatting,
   renaming, comment edits, or "while I'm here" cleanup. The diff
   between the moved bytes and the new module body (sans IIFE wrapper)
   must be empty.
2. **IIFE wrapper, classic script.** New module body:
   ```js
   (function () {
     'use strict';
     window.CL = window.CL || {};
     CL.<root> = CL.<root> || {};
     CL.<root>.<sub> = CL.<root>.<sub> || {};

     // -------- VERBATIM BLOCK --------
     // <bytes from app/index.html>
     // -------- END VERBATIM --------

     // Dual-expose every moved fn (window for onclick=/hoisting,
     // CL.<root>.<sub> for in-module consumers):
     window.foo = foo;
     CL.<root>.<sub>.foo = foo;
     // … one pair per moved declaration …

     CL._registerModule('<root>/<sub>');
   })();
   ```
   No `import`/`export`. No top-level `let`/`const` outside the IIFE.
3. **Mirror shared globals.** For each non-module-private global the
   §0 audit flagged: keep the declaration inline AND add
   `window.NAME = NAME` at the existing declaration site (inside the
   inline code's lexical scope). This is the ONLY out-of-block edit to
   `app/index.html` that is permitted.
4. **Script tag.** Add exactly one `<script src="modules/{area}/{file}.js"></script>`
   to `app/index.html` in the correct cluster:
   - **EARLY cluster** (right after `modules/loader.js`): pure
     definitions consumed by inline code below. Use when the moved
     functions must be hoisted before inline code runs.
   - **LATE cluster** (footer, before `bootstrap.js`): UI handlers,
     DOMContentLoaded-attached behavior, anything called only after
     load. Use when the module reads inline state that does not exist
     until later in the file.
   When in doubt, follow the precedent of an adjacent already-shipped
   module in the same `area/`.
5. **Delete the original block** from `app/index.html`. The deletion
   must produce a contiguous removed range — nothing else changes.

## §5 — Post-flight (ALL must pass)

1. **Syntax.** `node --check app/modules/{area}/{file}.js` → exit 0.
2. **Line delta.** `wc -l app/index.html` decreased by ≈ the extracted
   block size (±5 lines for the mirror writes is acceptable).
3. **Declaration delta.** Re-run `python3 scripts/gen_index_map.py`;
   `declarations` count drops by the moved-declaration count. Spot-check
   the moved names no longer appear in `INDEX_MAP_part*.md`.
4. **Blast radius.** `git diff --stat` shows ONLY:
   - `app/index.html`
   - the one new module file
   - optionally `app/modules/loader.js` (single-line `CL.<root> = {}` add)
   - optionally `docs/Cowork/INDEX_MAP*.md` (regen artifact)
   - optionally `CLAUDE.md` (append the new module to the off-limits
     list — required per "After each successful extraction" rule)
   Anything else → STOP, investigate.
5. **Module loader log.** Open the deployed app (or local) and confirm
   the console shows `[CL] Module loaded: <area>/<file>`. Missing log =
   script tag not loaded = silent failure.
6. **Playwright smoke** (mandatory for any change touching `app/`):
   ```bash
   playwright-cli open https://ecomhub200.github.io/Federal/app/
   playwright-cli snapshot
   playwright-cli console   # MUST show no new errors
   # Drive the feature governed by the extracted code:
   playwright-cli click e<ref>     # use ref from snapshot
   playwright-cli snapshot         # verify resulting state
   playwright-cli close
   ```
   If the deployed Pages site is not yet on the branch under review,
   say so explicitly — do not skip the step.

## Stop conditions (no override without user confirmation)

- §0 check fails → STOP, surface failure, no edits.
- Mid-extract: the block is larger than 500 lines AND splits cleanly →
  STOP, ask user whether to follow precedent of an oversized size-exception
  (`assets/transit-tab` 975, `reports/reports-pdf` ~1,100) or re-split.
- A shared global has external readers AND is reassigned (not just
  read) → STOP. Re-assignable shared state is the trickiest case
  (`_tierComparisonCache` in dashboard-tab is the canonical example);
  needs explicit `window.NAME = …` at every reassignment site, not just
  the declaration. Confirm the approach before proceeding.
- The diff includes any file outside the §5 allowlist → STOP.
- `playwright-cli console` shows a new error → STOP, do not commit.

## After success

1. **Append to off-limits list in CLAUDE.md.** Format: follow the
   existing prose convention ("**Round X extracted (Session N,
   off-limits):** `area/file` (NNN-line verbatim block — …)"). Include:
   moved-declaration count, mirror decisions, EARLY/LATE cluster
   choice, any oversized-size-exception note.
2. **Regenerate INDEX_MAP.** `python3 scripts/gen_index_map.py`. Commit
   the diff with the extraction.
3. **Commit message format**:
   ```
   refactor: extract <area>/<file> from app/index.html (Session <N>)

   - Verbatim block L<start>-L<end> (NNN lines, M fns)
   - Dual-expose window/<root> + CL.<root>.<sub>
   - <EARLY|LATE> cluster after <neighbor>.js
   - Shared globals: <names> mirrored; <names> moved
   - No behavior changes
   ```
4. **Do NOT create a PR** unless the user explicitly asked. Push the
   branch when the user asks.

## Parallel extractions (worktree pattern)

When the user wants multiple modules in one session, see
`docs/Cowork/WORKTREE_PARALLEL_RUNBOOK.md` for the spawn/merge protocol.
**Hard rule**: each parallel worker owns a non-overlapping line band in
`app/index.html`. Two workers cannot edit the same band — the merge
will clobber. Coordinate by line range, then merge sequentially in line
order (bottom-up: highest start line merges first so earlier extractions
don't invalidate later anchors).

## When NOT to use this skill

- The change is a behavior fix (not a pure extract). Use a normal edit.
- The "block" is non-contiguous or interleaved with code that must stay
  inline. Use a `-v2` re-split prompt instead.
- The extraction is the cutover for Stage A (ESM migration). Use
  `STAGE_A_54-cutover.md` directly.
- The target is one of the protected files in CLAUDE.md's "Protected
  files" list. Never touch those.

## Reference

- CLAUDE.md → "Modular Extraction Refactor (Round X+)" section
- `docs/Cowork/MODULAR_PLAN.md` → module structure, load order, risk register
- `docs/Cowork/INDEX_MAP*.md` → declaration inventory (use `True *` columns)
- `docs/Cowork/INDEX_MAP_REGEN_NOTES.md` → how the inventory is built
- `modular-prompts/SUPERSEDED.md` → which prompts are dead and why
- `skills/playwright-cli/SKILL.md` → smoke-test reference
