# Prompt 32 (`cmf/cmf-ai.js`) — SKIPPED (Session M)

**Date:** 2026-05-17
**Session:** M — `claude/extract-prompts-queue-fZvXM` (3 of 4 prompts shipped)
**Outcome:** SKIPPED — severe snapshot drift; the prompt's stated identity
(`~354-line "CMF AI agents + recommendation narrative"` block) does not exist
in the live file. The only thing the §0 anchor `initCMFAI` resolves to is a
17-line provider/API-key loader. Per CLAUDE.md ("If a prompt's §0 disagrees
with reality (drift), ABORT and ask before improvising — never edit
`app/index.html` outside the confirmed block") this is a skip, not an
improvisation. User explicitly approved the skip at Session M planning.

## Why skipped

Prompt 32's identity is the anchor **`initCMFAI`** (§0 grep, §1 anchor decl,
§2 `window.initCMFAI = initCMFAI`, §5 anchor checks) with a stated
responsibility of *"CMF AI agents + recommendation narrative"* and a snapshot
range of **L48345–L48698 (~354 lines)**. In the current `app/index.html`
(~144,245 lines post Session-M extractions) the locators disagree:

| Locator | Resolves to | Problem |
|---|---|---|
| §0/§1/§2/§5 anchor `initCMFAI` | single fn @ **L41053**, header comment `// Initialize CMF AI on page load` @ L41052, closes @ **L41069** | **~17 lines.** Body only: reads `cmfAI_provider`/`grantTool_ai_provider` from `localStorage`, syncs `#headerAIProvider`/`#cmfPopoverProvider`, loads a saved key via `ApiKeySecurity.getKey()` into `cmfAIState`. No "agents", no "recommendation narrative". |
| §1/§2 snapshot `L48345–L48698 (~354 lines)` | stale — file is ~144k now; that range no longer maps to CMF-AI code | The snapshot predates many prior extraction rounds; not usable. |
| Stated responsibility "CMF AI agents + recommendation narrative" | no single contiguous block | The decl immediately after `initCMFAI` (L41071 `// Hook into displayCrashProfile…` / L41072 `const originalDisplayCrashProfile = …`, then L41074 `// AI WRITING ASSISTANT`) is the **grant-writing assistant** feature — a different concern, not CMF-AI agents. |

Extracting the 17-line `initCMFAI` alone would technically satisfy the
prompt's named anchor but would deliver a near-empty module that does **not**
match the prompt's responsibility, and would force self-authoring a different
module identity — exactly the "improvise around drift" failure mode CLAUDE.md
forbids. There is no contiguous "CMF AI agents + recommendation narrative"
block at/around the anchor to extract.

## Findings for a future correctly-anchored prompt 32

For whoever re-authors this prompt (NOT extracted in Session M):

- **`initCMFAI`** live @ `app/index.html:41053` (header L41052), closes
  L41069. ~17 lines. References shared global `cmfAIState` and
  `ApiKeySecurity` — both inline, would resolve via the shared classic-script
  global lexical scope (same pattern proven for `cmfState`/`COL`/`crashState`
  in Session M's prompt 31).
- The genuine "CMF AI" surface (provider/agent/recommendation logic) is **not
  contiguous** with `initCMFAI`. A re-derived prompt must be **function-name
  anchored** to the actual CMF-AI agent/recommendation functions (locate them
  by name, e.g. `grep -nE 'CMFAI|cmfAI|CMFRecommendation' app/index.html`),
  not by the stale L48345–L48698 snapshot, and must size the real contiguous
  block before authoring §1/§2/§5.
- Immediately below `initCMFAI` is the **grant-writing assistant** cluster
  (`originalDisplayCrashProfile` hook L41072, `// AI WRITING ASSISTANT`
  L41074 onward) — a separate feature; do not fold it into a CMF-AI prompt.

## Status

- Prompt 32 NOT run. `app/index.html` `initCMFAI` left inline/untouched.
- Session M shipped prompts **42b2** (`reports/reports-pdf`, oversized
  size-exception), **42b3** (`reports/reports-charts`), **31**
  (`cmf/cmf-search`). Prompt 32 is the only Session-M-queue item skipped.
- Downstream: prompt **33-v2** (`cmf-deficiency`) is only **partially**
  unblocked — its dependency on a working cmf-AI extraction needs a
  re-derived prompt 32 first.
