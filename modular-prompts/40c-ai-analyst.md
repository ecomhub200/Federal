# CC Modular Prompt 40c — AI Analyst band (PARENT INDEX, not directly runnable)

**Supersedes the AI-analyst slice of the old (BLOCKED) prompt 40.**

The AI Analyst / MUTCD / chat feature is the contiguous band
`app/index.html` ~L80084–L82947 (~2,863 LOC, name-anchored — re-derive in
each child §0). It exceeds the 500-line module cap, so it is split into the
runnable child prompts below (see `NAVIGATETO_SPLIT_PLAN.md` §3 for the full
manifest and §5 for risks). **Run children one per session, in this order**
(`aiState` must extract first; later modules read its window/CL mirror):

| Order | Child prompt | Module(s) produced | Band | Notes |
|---|---|---|---|---|
| 1 | `40c1-ai-analyst-chat.md` | `ai/ai-analyst-chat.js` | L80084–L80369 | owns `const aiState`; chat/attachments/messages |
| 2 | `40c2-ai-analyst-mutcd.md` | `ai/ai-analyst-mutcd.js`, `ai/ai-analyst-engine.js`, `ai/ai-analyst-warrant.js` | L80370–L82143 | §0 cuts at fn boundaries into the 3 ≤500 files; `engine` is an OVERSIZED-EXCEPTION (`buildProgrammaticCrashAnalysis` ~646 LOC indivisible); **SKIP** L81823 `buildCountyWideCrashProfile` & L81878 `buildLocationCrashProfile` (off-limits dups — R1) |
| 3 | `40c3-ai-analyst-context.md` | `ai/ai-analyst-context.js`, `ai/ai-analyst-ui.js` | L82144–L82947 | §0 cuts into 2 ≤500 files; `getAIAnalysisContext` verified NOT owned by off-limits `ai/context` |

Each child follows the standard §0–§8 template (pre-flight snapshot,
name-anchored locate, INDEX_MAP/off-limits cross-check, IIFE module with
dual `window.`+`CL.` exposure + `CL._registerModule`, LATE script tag after
`modules/ai/ai-mode-toggle.js`, verbatim delete, post-flight counts,
Playwright smoke on the deployed app, rollback). When a band still exceeds
500 LOC and is not a single indivisible function, the child §0 STOPs and
cuts at the nearest `function` boundary into the named sub-files (existing
refactor rule). Do not combine children.
