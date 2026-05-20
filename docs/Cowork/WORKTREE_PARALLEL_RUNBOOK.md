# Worktree-Parallel Extraction Runbook

How to run **3–4 independent module extractions concurrently** in a single
session, compressing what is currently ~4 one-prompt-per-session days into
one. Built on top of the `extract-module` skill (`.claude/skills/extract-module/`)
and the IIFE-round rules in CLAUDE.md.

## When this is worth it

Use the parallel pattern when **all** of these hold:

- ≥ 3 candidate extractions are ready (anchors confirmed, §0 will pass).
- The candidate blocks live in **non-overlapping line bands** of
  `app/index.html` (workers cannot share a band).
- The candidates touch **different `CL.*` roots** (no cross-module shared
  state in flight).
- None of the candidates is on the high-risk list (Round-18 IIFEs,
  `grants-ui`, `ai-domain-knowledge` band, dashboard tier-cache, intersection
  detail state — anything documented as needing window-mirroring for
  reassigned shared globals).

If any of those fails, run the extraction solo. Parallel is a force
multiplier for clean leaves, not a way to push through coupled bands.

## Concurrency model

Each worker runs in its **own git worktree** (`Agent` tool with
`isolation: "worktree"`). Worktrees share `.git` but have independent
working trees, so workers cannot stomp on each other's edits.

```
main branch (claude/plan-refactoring-strategy-XXX)
├── worktree-A → extracts modules/area-1/file-1.js (block L20000-L20800)
├── worktree-B → extracts modules/area-2/file-2.js (block L45000-L45600)
├── worktree-C → extracts modules/area-3/file-3.js (block L92000-L92700)
└── worktree-D → extracts modules/area-4/file-4.js (block L118000-L118500)
```

Each worker:
1. Runs §0 pre-flight against its branch's `app/index.html`.
2. Performs verbatim extract + dual-expose + script-tag wiring.
3. Runs §5 post-flight + `node --check` + `wc -l` delta check.
4. Runs Playwright smoke against the *deployed* GitHub Pages site (note:
   the deploy reflects `main`, not the worker branch — smoke against
   *deployed* validates only that the feature still works in prod; the
   per-branch behavior check is the syntax + load-tracker + diff-stat
   triad in §5).
5. Commits to its worktree branch.

Workers do **not** push. The orchestrator merges them in.

## Sequential merge — line-order, bottom-up

After workers finish, the orchestrator merges in **descending start-line
order** — highest line band first, lowest last.

**Why bottom-up:** every extraction deletes a contiguous block, which
shifts every line below it upward. If you merge worker A (block at
L20000) before worker D (block at L118000), worker D's deletion range is
now off by however many lines A removed. Worker D's patch will either
fail to apply or, worse, delete the wrong bytes. Merging top-down (high
line first) means each merge only shifts lines *above* itself —
already-merged work is unaffected.

```bash
# Order: D (L118000) → C (L92000) → B (L45000) → A (L20000)
git merge --no-ff worktree-D
git merge --no-ff worktree-C
git merge --no-ff worktree-B
git merge --no-ff worktree-A
```

If a merge conflict happens in `app/index.html`, the candidates were
not actually non-overlapping (or the off-limits collision check at §0
was wrong). Abort the merge, throw away the conflicting worker's
branch, and re-run that one extraction solo after the others ship.

## Orchestrator workflow

```
1. Pick 3-4 candidate extractions (anchor names + target paths + line
   bands). Verify bands do not overlap.
2. For each candidate, spawn an Agent with:
     subagent_type: general-purpose
     isolation: "worktree"
     prompt: "Run the extract-module skill on <anchor> → <target>.
              Stop if §0 fails. Report results in < 200 words."
   Send all spawns in a SINGLE message (parallel tool calls).
3. Wait for all workers to report.
4. For any worker that reported a §0 failure, abandon that worktree.
   The remaining workers are still valid.
5. Merge surviving worktrees bottom-up (highest line band first).
6. After all merges land:
   - Re-run python3 scripts/gen_index_map.py (single regen for all)
   - Update CLAUDE.md off-limits list (append all N new modules)
   - Run ONE consolidated Playwright smoke against deployed app
   - Commit the consolidation (index-map + CLAUDE.md updates)
7. Push the branch when the user asks.
```

## Hard rules

- **One worker per line band.** If two candidates share any portion of
  app/index.html, run them sequentially. No exceptions — even if the
  fns appear independent, the diff hunks will conflict.
- **No shared CL root edits in parallel.** Two workers must not both
  add a new top-level key to `loader.js` in the same session. The
  loader edit is a serialization point — do it sequentially before
  spawning workers, OR have only one worker do it.
- **No off-limits collisions across workers.** Run the full off-limits
  scan against the *union* of all candidate moved-names before
  spawning. CLAUDE.md R1 risk (`buildCountyWideCrashProfile` /
  `buildLocationCrashProfile`) is the canonical trap.
- **Each worker reports verifiable artifacts**, not just "done":
  `wc -l` delta, `node --check` exit code, moved-fn count,
  `git diff --stat`. The orchestrator validates before merge.
- **No PR per worker.** Workers commit to their worktree branch; the
  orchestrator pushes the consolidated branch (still no PR unless the
  user asked).

## Failure modes and recovery

| Symptom | Likely cause | Recovery |
|---|---|---|
| Merge conflict in `app/index.html` | Bands overlapped, or off-limits collision | Abort merge, abandon that worker's branch, run solo later |
| `node --check` fails post-merge but passed in worker | Mirror-write site was in a different worker's deletion range | Re-derive the global audit against the merged state, fix the mirror in a follow-up commit |
| `[CL] Module loaded` log missing for one module | Script-tag cluster choice conflicted with another worker's neighbor anchor | Move the script tag to a stable position (after `data/supabase-map-bridge.js` if LATE, after `core/constants.js` if EARLY) |
| Playwright console shows an error post-merge that no worker saw | An onclick survivor lost its `window.*` mirror because another worker's extraction removed the inline declaration | Re-add the `window.fn = fn` line in the affected module |

## When NOT to parallelize

- Any extraction listed in CLAUDE.md as "blocked at §0" or having a
  resolution doc (32-v2, 33-v2, 41-v2, prompts 19/41/44 resolutions) —
  these are the unstable cases, run solo.
- Stage A ESM migration — every conversion is coupled to the cutover.
  Parallel does not help; do the big-bang cutover branch instead.
- Anything touching `app/modules/loader.js` beyond a single
  one-line-key add.
- The first ~3 extractions after a major INDEX_MAP regen, while the
  curated assignments are still being validated by hand.

## Reference

- `.claude/skills/extract-module/SKILL.md` — the per-worker procedure
- `CLAUDE.md` → "Modular Extraction Refactor" section — global rules
- `docs/Cowork/MODULAR_PLAN.md` → load order, risk register
- `Agent` tool docs → `isolation: "worktree"` usage
