# CC Modular Extraction Prompt 40c3 — AI Analyst context + UI

**Severity:** Refactor (no behavior change). **Two modules; one session each.**
**Run AFTER 40c1/40c2.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4b, `NAVIGATETO_SPLIT_PLAN.md`
§3.

## §0 Pre-flight (band ~L82144–L82947)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html

grep -nE "^function (buildSystemPrompt|getAIAnalysisContext|buildLocationCrashContext|updateAIContextIndicator|updateMUTCDAILocationBar|copyMessageContent|updateMUTCDRefCounters|askAboutMUTCDSection|formatAIResponse|convertMUTCDReferencesToCards|renderMUTCDCitationCard|copyMUTCDCitation)\b" app/index.html

# getAIAnalysisContext: confirm NOT owned by off-limits ai/context:
grep -n "getAIAnalysisContext" app/modules/ai/context.js   # expect: no match → safe to move
# Next decl after the band: the CMF module banner (~L82948 "// CMF
# COUNTERMEASURES MODULE") — stop before it.
```

## §1 Two modules

**(a) `ai/ai-analyst-context.js`** — ~L82144–L82431 (~288 LOC):
`buildSystemPrompt, getAIAnalysisContext, buildLocationCrashContext,
updateAIContextIndicator`. ≤500 ✓.

**(b) `ai/ai-analyst-ui.js`** — ~L82432–L82947 (~515 LOC):
`updateMUTCDAILocationBar, copyMessageContent, updateMUTCDRefCounters,
askAboutMUTCDSection, formatAIResponse, convertMUTCDReferencesToCards,
renderMUTCDCitationCard, copyMUTCDCitation`. If §0 brace count > 500, cut at
the nearest `function` boundary so the file lands ≤500 and name the
remainder `ai/ai-analyst-ui2.js` (record the split point); else single file.

Per file: §0 re-derive exact `[start,end]`; target must not exist.

## §2 Skeleton (per file)
```js
/**
 * CL ai.analyst<X> — extracted (name-anchored). navigateTo-split round,
 * prompt 40c3. Depends: ai/ai-analyst-chat (window.aiState),
 * ai/ai-analyst-engine (formatMUTCDAnalysisForChat via window mirror).
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste segment>
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.ai=CL.ai||{};
  CL.ai.analyst<X>=CL.ai.analyst<X>||{};
  // window.<fn>=<fn>; CL.ai.analyst<X>.<fn>=<fn>;
  CL._registerModule('ai/ai-analyst-<x>');
})();
```

## §3 Script tags
LATE cluster, after the 40c2 tags, in order: `ai-analyst-context.js` then
`ai-analyst-ui.js` (and `ai-analyst-ui2.js` if split).

## §4 Remove originals
Per module delete its confirmed segment; head/tail-verify.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment; `grep -cE function` drop = moved count;
`node --check` ok; one script tag; `git diff --stat` clean. Console:
`[CL] Module loaded: ai/ai-analyst-<x>`.

## §6 Smoke test
Deployed app → run an AI analysis; verify response formatting + MUTCD
citation cards render, location bar updates; no new console errors;
`typeof window.formatAIResponse==='function'`,
`typeof window.getAIAnalysisContext==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/ai/ai-analyst-<x>.js`

## §8 Out of scope
Renames/reformatting; other bands; off-limits modules; CLAUDE.md edits; PR
unless asked.
