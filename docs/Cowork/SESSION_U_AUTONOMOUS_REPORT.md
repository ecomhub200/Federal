# Session U — Autonomous Refactoring Report

**Branch:** `claude/plan-refactoring-strategy-pEsQQ`
**Date:** 2026-05-20
**Mode:** Fully autonomous (user asleep) — extraction batch + infrastructure

## Deliverables

### Infrastructure (commit `5e3fe9a`)

1. **INDEX_MAP regenerated** against live `app/index.html`. Generator fixes:
   - Output path `OUT_DIR = docs/Cowork/` (was repo root)
   - 11-col layout regex (was 9-col only — silently dropped curated mapping
     after the 2026-05-16 regen)
   - Name-join now 100% (`matched=2861/2861` after final regen this session)

2. **`.claude/skills/extract-module/SKILL.md`** — self-driving extraction
   skill. Codifies §0 pre-flight, verbatim extract, dual-exposure wiring,
   §5 post-flight, shared-global audit.

3. **`docs/Cowork/WORKTREE_PARALLEL_RUNBOOK.md`** — 3–4-worker spawn/merge
   protocol with bottom-up merge order and failure-mode recovery.

### Extractions (9 commits, all pushed)

| Commit | Module | Lines | Fns | Notes |
|---|---|---|---|---|
| `de49493` | `ai/ai-analyst-chat` | 278 | 12 | `aiState` window-mirrored (11 external readers) |
| `eaf67d4` | `ai/ai-analyst-mutcd` | 297 | 8 | Pinecone RAG; mutcdState stays inline |
| `20b1776` | `ai/ai-analyst-context` | 287 | 4 | System prompt + multi-source context picker |
| `e1ebeaa` | `reports/reports-recommend` | 249 | 6 | Memo recommendation builders |
| `dad0770` | `reports/reports-memo` | 290 | 6 | Word-memo header/stats/footer/Document factory |
| `64ff98a` | `reports/report-ba-run` | 252 | 6 | BA engine (Part 1, split at createBACharts) |
| `8acd5f7` | `reports/report-ba-charts` | 275 | 5 | BA charts/findings/conclusions (Part 2) |
| `e6590cb` | `reports/report-ba-email` | 427 | 6+1 | Email scheduling (largest, used python slice) |
| `1ed6bc1` | `reports/report-ba-export` | 440 | 4+1 | Print/PDF/CSV/clipboard export |

**Total extracted: 2,795 lines across 9 modules, 57 named functions.**

### Progress against target

| Metric | Start of session | End of session | Delta |
|---|---|---|---|
| `app/index.html` | 134,486 lines | 131,696 lines | **−2,790** |
| Declarations | 2,926 | 2,861 | −65 |
| Named functions | 2,012 | 1,955 | −57 |
| Target | <30,000 | ~102k more to go | — |

## Verification per extraction

Every commit verified with:
- ✅ `node --check` on new module (all green)
- ✅ Line-count delta matches block size (±1 for script tag)
- ✅ Named-function count drop matches moved fns (+ nested where applicable)
- ✅ `git diff --stat` constrained to: `app/index.html`, new module,
  `CLAUDE.md`
- ✅ All declared functions removed from inline (`grep -nE '^function'` verifies)
- ✅ External callers identified and confirmed to resolve via window mirrors

## NOT verified this session

- ❌ **Playwright smoke test** — `playwright-cli` not installed in the
  ephemeral remote container. All extractions need post-deploy validation
  against the GitHub Pages site once this branch lands on `main`.
- ❌ **Module loader console log** — cannot observe `[CL] Module loaded:
  <area>/<file>` without a running browser.

This means the changes are **statically correct** (syntax + line/fn deltas +
mirror logic) but have **no live-behavior validation**. The first thing the
user should do post-wake is open the deployed app and confirm:

1. The 9 features still work (AI Analyst chat, MUTCD AI integration, AI
   context indicator, memo recommendations export, Word memo download,
   Before/After analysis run, B/A charts render, B/A email schedule modal,
   B/A export buttons).
2. No new console errors appear.
3. All 9 new modules show `[CL] Module loaded:` lines.

## Deferred / skipped (not safe for autonomous run)

| Prompt | Reason |
|---|---|
| `08-safety-sign-deficiency` | 1,363-line block, exceeds 500 ceiling, no prompt-authorized split point — needs user decision on size-exception vs split |
| `35-map-map-init` | 2,101-line block (way over ceiling); load anchor doesn't exist |
| `46-app-bootstrap` | Anchors non-contiguous (L28092 vs L132614, 100k+ apart); prompt's `crashState` "module-private" assertion is wrong |
| `40c3(b) ai-analyst-ui` | 498-line block has 5 unlisted helpers (`askAI`, `callOpenAI/Claude/Gemini`, `MUTCD_SECTION_DATA`); cross-tab impact too risky to auto-extract |
| `40c2(b) ai-analyst-engine` | 1,084-line oversized indivisible (`buildProgrammaticCrashAnalysis` is ~646 LOC alone) |
| `40c2(c) ai-analyst-warrant` | Swiss-cheese with 2 off-limits dups (R1 collision risk per CLAUDE.md) |
| `42c2(b) report-ba-monitor` | 743-line block; prompt allows split at `evaluateBAAlertConditions` but better as a user-driven session |
| `42d(a) reports-countermeasures` | 1,236-line band; needs prompt-authorized cut at `generateCrashTreeSystemicReport` |
| `32-v2 cmf-ai`, `33-v2 cmf-deficiency` | Active re-splits; involve cross-module ownership and interleaved bands |
| Stage A (ESM migration) | Single-shot cutover that breaks the app between commits — requires user awake |

## How to continue from here

1. **Validate this batch in a browser.** Open the deployed Pages app once
   `main` picks up this branch (or check out the branch locally and serve
   it). Confirm no console errors and the 9 affected features work.
2. **Use the new `extract-module` skill** for solo follow-ups. It encodes
   all the conventions used this session.
3. **Use the worktree-parallel runbook** for batches of 3–4 candidates.
   Don't parallelize candidates that touch the same `CL.*` root or share
   line bands.
4. **Prioritize the deferred ones above** by complexity ascending:
   `42c2(b) report-ba-monitor` → `40c2(b) ai-analyst-engine` →
   `42d(a) reports-countermeasures` → `40c3(b) ai-analyst-ui`.
5. **Skip Stage A** until the IIFE round is fully done, then do the
   big-bang cutover (one PR, one session, no per-file ESM conversions).

## File-slice fallback (lessons learned)

The Edit tool struggles with verbatim deletes of >300-line blocks (exact
string matching too brittle with template literals, special chars). For
those, `python3 -c "lines[:start] + lines[end:]"` was a clean fallback.
**Trap encountered:** off-by-one on slice indices (cost one revert via
`git checkout app/index.html`). Always double-check both bounds against
`awk '{print NR}'` output before slicing — Python is 0-indexed and the
end index is exclusive.
