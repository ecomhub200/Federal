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

---

## 2026-05-17 — Session O live re-verification + 32-v2 authored

**Session:** O — `claude/session-o-extraction-CPjWs`
**Outcome:** Single-file prompt 32 **permanently retired**; replaced by a new
6-child re-split coordinator `modular-prompts/32-v2-cmf-ai.md` (authoring
only — no `app/index.html` edit for 32 this session).

### Live re-verification (against `app/index.html` @ 144,245 lines)

The Session-O queue's corrected anchor `runCMFAgent` was re-checked live:

| Locator | Live | Finding |
|---|---|---|
| `runCMFAgent` | `app/index.html:38010` (`async function runCMFAgent(agentNum, prompt, input, apiKey, tools = null)`) | real CMF-AI agent fn |
| `initCMFAI` | `app/index.html:41053` | still the 17-line loader (unchanged from Session M) |
| Region `runCMFAgent`→end of `initCMFAI` | L38010 → L41073 | **~3,060 LOC / ~59 decls** |

The region is **not** a single CMF-AI block — it interleaves **three
features**, proven by the live divider/decl inventory:

1. **CMF-AI agents** L38010–~L38429 (`runCMFAgent`,`runCMF4AgentAnalysis`,
   `buildCMFAgent1Input`) — clean contiguous island.
2. **Grant-AI / Grant-Search** L~38430–L~38783 (`syncGrant*`,`callGrantAI`,
   `grantSearch*`,`processGrantSearchQuery`,`getStaticGrantRecommendations`) —
   different feature (prompts 27/28/29-v2).
3. **CMF-AI assistant** L~38784–L~39661 (`// AI COUNTERMEASURE ASSISTANT
   FUNCTIONS` → before `// CMF AI Attachment State`).
4. **Attachment + shared PDF** L~39662–L~40481 (`*CMFAIAttachment*`,
   `downloadGrant*PDF`,`sanitizeForPDF`,`parseMarkdownTables`,
   `parseTableLines`,`renderAIChatToPDF`,`downloadCrashAnalysisPDF`) —
   cross-feature utilities shared with the Grant assistants.
5. **CMF-AI query/call core** L~40482–L~41073 (`processCMFAIQuery`,`callCMFAI`,
   `callCMFAIWithTools`,`getStaticCMFRecommendations`,`updateCMFAIDataBadge`,
   `initCMFAI`).
6. **Grant-writing assistant** L41074+ (`// AI WRITING ASSISTANT`) — separate
   feature, as noted in the Session-M findings above.

There is **no clean ≤500-line single-file CMF-AI boundary**, so the original
single-file prompt 32 cannot be salvaged by an anchor swap. Per CLAUDE.md
discipline the extractor must not self-author a sub-boundary inside a stale
prompt; the user (Session O planning) approved authoring a proper multi-child
re-split instead.

### Resolution

`modular-prompts/32-v2-cmf-ai.md` (6 children, one session each):
`32a cmf-ai-agents` (~419, clean) → `32b1 cmf-ai-assistant-core` (~316) →
`32b2 cmf-ai-assistant-chat` (~293) → `32b3 cmf-ai-assistant-lookup` (~269) →
`32c1 cmf-ai-query-core` (~164) → `32c2 cmf-ai-query-tools` (~427, includes
`initCMFAI`). The Grant island and the attachment/shared-PDF zone are
explicitly fenced OUT of 32-v2 (a §0 gate aborts if a Grant or shared-PDF
decl falls inside a child's brace range).

- Original `modular-prompts/32-cmf-cmf-ai.md` is byte-unmodified and retired.
- 32-v2 was **not run** in Session O (authoring only); first runnable child
  is `32a`.
- Prompt **33-v2** stays partially blocked until `32c2` lands (`initCMFAI`).
