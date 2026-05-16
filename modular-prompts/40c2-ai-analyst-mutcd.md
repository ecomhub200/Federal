# CC Modular Extraction Prompt 40c2 — AI Analyst MUTCD/engine/warrant

**Severity:** Refactor (no behavior change). **One file per session — but
this band yields THREE modules; extract them as three sequential sessions.**
**Run AFTER 40c1 (needs `window.aiState`).**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored.
Background: `NAVIGATETO_STRUCTURE_SURVEY.md` §4b, `NAVIGATETO_SPLIT_PLAN.md`
§3 + §5 (R1 off-limits dups, R3 oversized exception).

## §0 Pre-flight (band ~L80370–L82143)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html

grep -nE "^function (initMUTCDLocationDropdown|loadMUTCDLocation|clearMUTCDLocation|buildMUTCDContext|buildPineconeRAGContext|buildProgrammaticCrashAnalysis|buildRAGQueries|buildNewAgent1Input|buildNewAgent2Input|formatMUTCDAnalysisForChat|buildCountyWideCrashProfile|askMUTCDGuidance|buildLocationCrashProfile|askMUTCDForSafetyCategory|initSignalWarrantChecker|toggleWarrantChecker|toggleCrossingEvalSection|openCrossingEvalModal|closeCrossingEvalModal|analyzeSignalWarrant|askAboutWarrant7)\b" app/index.html

# ⚠ R1 — off-limits collision: buildCountyWideCrashProfile (~L81823) and
# buildLocationCrashProfile (~L81878) ALREADY exist in off-limits
# app/modules/analysis/crash-profile.js. Verify:
grep -nE "buildCountyWideCrashProfile|buildLocationCrashProfile" app/modules/analysis/crash-profile.js
# These two inline copies are LEGACY DUPS — DO NOT MOVE THEM. They stay
# inline (a separate dedup cleanup removes them later). The three modules
# below extract AROUND these holes (Swiss-cheese ranges).
```

## §1 Three modules to produce (one session each, in order)

**(a) `ai/ai-analyst-mutcd.js`** — band ~L80370–L80738 (~369 LOC):
`initMUTCDLocationDropdown, loadMUTCDLocation, clearMUTCDLocation,
buildMUTCDContext, buildPineconeRAGContext`. ≤500 ✓.

**(b) `ai/ai-analyst-engine.js`** — band ~L80739–L81822 (~1,084 LOC):
`buildProgrammaticCrashAnalysis` (~646 LOC — **OVERSIZED, INDIVISIBLE**),
`buildRAGQueries, buildNewAgent1Input, buildNewAgent2Input,
formatMUTCDAnalysisForChat`. Module legitimately exceeds 500 — add this
header note (precedent `assets/transit-tab` 975 LOC per CLAUDE.md). Stop at
~L81822 (before `buildCountyWideCrashProfile` @ ~L81823 — **excluded, R1**).

**(c) `ai/ai-analyst-warrant.js`** — band ~L81829–L82143 (~315 LOC):
`askMUTCDGuidance, askMUTCDForSafetyCategory, initSignalWarrantChecker,
toggleWarrantChecker, toggleCrossingEvalSection, openCrossingEvalModal,
closeCrossingEvalModal, analyzeSignalWarrant, askAboutWarrant7`. **Skip**
the two off-limits dups (`buildCountyWideCrashProfile` @ ~L81823,
`buildLocationCrashProfile` @ ~L81878) — extract the two contiguous
sub-segments around them (~L81829–L81877 and ~L81883–L82143) into the one
module; preserve byte order. ≤500 ✓.

For each: §0 re-derive exact `[start,end]` by brace read; target must not
exist; off-limits cross-check.

## §2 Module skeleton (per file)
```js
/**
 * CL ai.analyst<X> — extracted from app/index.html (name-anchored).
 * navigateTo-split round, prompt 40c2. Depends: ai/ai-analyst-chat
 * (reads window.aiState). [engine.js ONLY: NOTE — exceeds 500-line cap;
 * buildProgrammaticCrashAnalysis is a single ~646-LOC indivisible fn,
 * documented exception per CLAUDE.md.]
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste segment(s); for warrant.js paste BOTH sub-segments in original order>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.analyst<X> = CL.ai.analyst<X> || {};
  // window.<fn>=<fn>; CL.ai.analyst<X>.<fn>=<fn>;
  CL._registerModule('ai/ai-analyst-<x>');
})();
```

## §3 Script tags (LATE, in dependency order)
After the previous AI-analyst tag, append in order: `ai-analyst-mutcd.js`,
`ai-analyst-engine.js`, `ai-analyst-warrant.js`.

## §4 Remove originals
Per module, delete exactly its confirmed segment(s). For warrant.js delete
the two sub-segments, **leaving L81823 & L81878 dup functions in place**.
head/tail-verify each.

## §5 Post-flight (per module)
`wc -l` drop ≈ segment size; `grep -cE function` drop = moved-fn count;
`node --check` passes; one script tag; `git diff --stat` = index.html + the
one module. Console: `[CL] Module loaded: ai/ai-analyst-<x>`. After all
three, confirm `buildCountyWideCrashProfile`/`buildLocationCrashProfile`
still grep-present inline (R1 preserved).

## §6 Smoke test
Deployed app → run an MUTCD AI analysis from a selected location, trigger
the signal-warrant checker; no new console errors;
`typeof window.analyzeSignalWarrant==='function'`. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/ai/ai-analyst-<x>.js`

## §8 Out of scope
Moving/deduping the R1 off-limits functions; renames/reformatting; other
bands; CLAUDE.md edits; PR unless asked.
