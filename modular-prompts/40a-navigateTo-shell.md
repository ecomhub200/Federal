# CC Modular Prompt 40a — `navigateTo` shell (REFRAMED: INDEX_MAP regen + re-validation)

**Severity:** Documentation / hygiene (no code extraction). **One per session.**

> ⚠️ **This prompt does NOT extract a `navigateTo` shell.** Investigation
> (see `NAVIGATETO_STRUCTURE_SURVEY.md`) proved `navigateTo` is a 12-line
> boot stub (`app/index.html` L121–L132) and the real `showTab`/`navigateTo`
> dispatcher was **already extracted** to `app/modules/app/tab-dispatcher.js`
> by prompt 45. There is no shell to lift. This prompt's payload is the
> **INDEX_MAP regeneration + BLOCKED-claim re-validation** that the
> phantom-mega-function finding requires.

## §0 Pre-flight (confirm the finding still holds)

```bash
wc -l app/index.html                                    # expect ~153,085 (NOT 159,387)
sed -n '121,132p' app/index.html                        # expect the 12-line stub
grep -n '<script src="modules/app/tab-dispatcher.js">' app/index.html   # expect 1 (prompt 45 done)
grep -n 'Snapshot:' INDEX_MAP_part1.md | head -1        # shows the stale 159387 snapshot
```
If `navigateTo` is no longer a 12-line stub, or tab-dispatcher.js is absent:
**ABORT and re-survey** — the premise changed.

## §1 What to do

1. **Regenerate the inventory.** Re-run whatever script produced
   `INDEX_MAP.md` / `INDEX_MAP_part1..4.md` against the **live**
   `app/index.html`. If the generator is not in-repo, document the
   regeneration command used and commit the refreshed files in a dedicated
   session (NOT this one — INDEX_MAP is a protected source-of-truth file).
2. **Fix the heuristic class.** The "End L = next declaration − 1" rule
   wrongly attributes CSS/HTML-body spans to the preceding `window.fn = `
   stub. Note this in the regenerated header so future readers do not trust
   any single >5,000-LOC "function" row without brace verification.
3. **Re-validate every "⛔ BLOCKED — inside `navigateTo` mega-fn" note.**
   For each, re-derive the real block by **function-name anchor** in the
   live file (not snapshot range). Confirmed re-anchors are catalogued in
   `NAVIGATETO_SPLIT_PLAN.md` §3 (supersedes prompts 40 & 42).

## §2 Out of scope
- No edits to `app/index.html` or any `app/modules/*.js`.
- Do NOT hand-edit `INDEX_MAP*.md` (regenerate only, separate session).
- Creating a PR unless explicitly asked.

## §3 Done criteria
- `INDEX_MAP*.md` regenerated against the live line count, OR a documented
  blocker explaining why regen must be deferred (with the exact command).
- `NAVIGATETO_SPLIT_PLAN.md` §3 confirmed accurate against the live file.
- Prompts 40 & 42 marked SUPERSEDED in MODULAR_PLAN.md + CLAUDE.md
  (already done by Session B).
