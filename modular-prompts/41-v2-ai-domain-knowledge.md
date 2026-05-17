# CC Modular Extraction Prompt 41-v2 — `app/modules/ai/ai-domain-knowledge*.js` (6-CHILD RE-SPLIT)

**Supersedes `modular-prompts/41-ai-ai-domain-knowledge.md`** (3 prompt-authoring
defects: placeholder anchor `(domain knowledge fns)`; un-satisfiable
`grep 'ai[A-Z]|[Aa]ssistant'` §5; wrong snapshot L86463–L88000 + wrong
"rescue" satellite anchors which are Asset-Deficiency, not DK). That file is
byte-unmodified — see `modular-prompts/SUPERSEDED.md`. Root cause +
verification: `MODULAR_PLAN_PROMPT_41_FIX.md`. Re-anchored 2026-05-17
(CC Session N) against live `app/index.html` @ **145,624 lines**.

**Severity:** Refactor (no behavior change). **One CHILD per session — do NOT
batch.** This is a **SIX-MODULE re-split** (41a→41b→41c→41d→41e→41f), one
session each, in that order, verify green between each.

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are the
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive ACTUAL boundaries by brace read in §0. The block is **~1,795 LOC
total** (3.6× the 500 ceiling) → mandatory MODULAR_PLAN §2 sub-split; never
extract it as one file.

## §0 Pre-flight verification (run BEFORE editing — per child)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Confirm the full DK band boundary (shared by all 6 children):
grep -nE '^// DOMAIN KNOWLEDGE STATE' app/index.html              # START divider is the line ABOVE this
grep -nE '^const dkState' app/index.html                          # ~L76225
grep -nE '^// ASSET DEFICIENCY DETECTION STATE' app/index.html    # END is the line ABOVE this divider
grep -nE '^function runDKDeepAnalysis' app/index.html             # last DK fn, ~L78007
#   Full band ≈ L76221 (divider above DOMAIN KNOWLEDGE STATE) … L78015
#   (line before the ============ divider above ASSET DEFICIENCY DETECTION STATE).

# 2. Locate THIS child's anchors by NAME (live) and brace-read its sub-range:
#   41a ai-domain-knowledge-core     : dkState, initDomainKnowledge, shouldUseQdrantProxy..testQdrantConnection   (~L76221–L76592)
#   41b ai-domain-knowledge-rag      : voyageEmbed..testVoyageConnection, ragSearch..indexSampleDocuments          (~L76593–L76910)
#   41c ai-domain-knowledge-location : populateDKLocationDropdown..buildDKCrashProfile                              (~L76911–L77292)
#   41d ai-domain-knowledge-sources  : renderDomainKnowledgeSources..buildDKContext, _dkResolveOpenAIKey            (~L77293–L77529)
#   41e ai-domain-knowledge-query    : loadCorpusCounts..queryDKSources, callClaudeSimple, getActiveApiKey          (~L77530–L77869)
#   41f ai-domain-knowledge-chat-ui  : addDKMessage..runDKDeepAnalysis                                              (~L77870–L78015)
grep -nE '^(async )?function +(initDomainKnowledge|shouldUseQdrantProxy|testQdrantConnection|voyageEmbed|ragSearch|indexSampleDocuments|populateDKLocationDropdown|buildDKCrashProfile|renderDomainKnowledgeSources|_dkResolveOpenAIKey|loadCorpusCounts|queryDKSources|callClaudeSimple|getActiveApiKey|addDKMessage|runDKDeepAnalysis)\b' app/index.html
#   Read braces around THIS child's first + last anchor → exact [BLK_START,BLK_END].
#   The child band must contain ONLY DK decls (no foreign tag). If a non-DK
#   decl falls inside the brace range, STOP and re-derive.

# 3. Target must not exist
test -f app/modules/ai/ai-domain-knowledge-<child>.js && echo "ABORT: exists" || echo "OK"

# 4. Load anchor present
grep -n '<script src="modules/ai/ai-mode-toggle.js"></script>' app/index.html   # expected: 1
#   (NOT the bogus ai/ai-mode.js the v1 prompt named.)
```
ABORT and report if: band not contiguous, child target exists, anchor missing,
any name maps to an off-limits module, or `node --check` of the proposed slice
would split a function.

## §1 What to move — RE-SPLIT into 6 children (one session each, in order)

| Order | Child module | Range (live, re-derive) | ~LOC | Anchor set |
|---|---|---|---|---|
| 41a | `ai/ai-domain-knowledge-core.js` | L76221–L76592 | ~372 | `dkState`, `initDomainKnowledge`, `shouldUseQdrantProxy`…`testQdrantConnection` |
| 41b | `ai/ai-domain-knowledge-rag.js` | L76593–L76910 | ~318 | `voyageEmbed`…`testVoyageConnection`, `ragSearch`,`generateQdrantId`,`indexDocument`,`indexDocumentsBatch`,`testRAGPipeline`,`indexSampleDocuments` |
| 41c | `ai/ai-domain-knowledge-location.js` | L76911–L77292 | ~382 | `populateDKLocationDropdown`…`applyDKDateFilterInternal`,`buildDKCrashProfile` |
| 41d | `ai/ai-domain-knowledge-sources.js` | L77293–L77529 | ~237 | `renderDomainKnowledgeSources`,`toggleDKSource`,`autoSelectDKSources`,`selectDKFromMap`,`clearDKChat`,`askDKQuestion`,`buildDKContext`,`_dkResolveOpenAIKey` |
| 41e | `ai/ai-domain-knowledge-query.js` | L77530–L77869 | ~340 | `loadCorpusCounts`,`embedPendingCorpus`,`_dkOpenAIEmbed`,`_dkPgvectorSearch`,`queryDKSources`,`callClaudeSimple`,`getActiveApiKey` |
| 41f | `ai/ai-domain-knowledge-chat-ui.js` | L77870–L78015 | ~146 | `addDKMessage`,`showDKCitation`,`updateDKSourcesPanel`,`loadDKStreetView`,`switchDKStreetView`,`changeDKViewDirection`,`toggleDKReferencePanel`,`attachDKImage`,`runDKDeepAnalysis` |

For EACH child: re-derive `[BLK_START,BLK_END]` by brace read; band must contain
only that child's anchors + lexically-nested helpers. Copy bytes **verbatim** —
preserve every blank line, comment, leading space. No renames/reformat/improve.

## §2 Where to put it (per child)

```js
/**
 * CL ai.domainKnowledge<X> — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/41-v2-ai-domain-knowledge.md
 * + MODULAR_PLAN_PROMPT_41_FIX.md.
 * Responsibility: Domain Knowledge tab — <core|rag|location|sources|query|chat-ui>.
 * Depends on (script-tag order): ai/ai-mode-toggle; 41b–41f after 41a.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste the confirmed name-anchored block, unchanged>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.domainKnowledge = CL.ai.domainKnowledge || {};
  // expose EACH moved named decl: window.<fn>=<fn>; CL.ai.domainKnowledge.<fn>=<fn>;
  CL._registerModule('ai/ai-domain-knowledge-<child>');
})();
```
`CL.ai` already exists in `loader.js` — **no loader.js edit**. Every moved fn
gets a `window.<fn>` back-compat export (HTML onclick / hoisting callers).

## §3 Wire the script tags (LATE cluster, in order)
Each child's tag immediately AFTER the previous child's tag; 41a immediately
AFTER `<script src="modules/ai/ai-mode-toggle.js"></script>`:
```html
<script src="modules/ai/ai-domain-knowledge-core.js"></script>
<script src="modules/ai/ai-domain-knowledge-rag.js"></script>
<script src="modules/ai/ai-domain-knowledge-location.js"></script>
<script src="modules/ai/ai-domain-knowledge-sources.js"></script>
<script src="modules/ai/ai-domain-knowledge-query.js"></script>
<script src="modules/ai/ai-domain-knowledge-chat-ui.js"></script>
```

## §4 Remove the original code (per child)
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# Only after head/tail confirm the exact child band, delete that line range.
```

## §5 Post-flight verification (per child)
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # − this child's moved-fn count
node --check app/modules/ai/ai-domain-knowledge-<child>.js            # pass
# Satisfiable anchor-gone grep — REAL moved-fn names, NOT 'ai[A-Z]':
grep -nE 'function +(<this child's anchor names>)\b' app/index.html   # expected: 0
grep -c '<script src="modules/ai/ai-domain-knowledge-<child>.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the one new module
```
Console on load: `[CL] Module loaded: ai/ai-domain-knowledge-<child>`.

## §6 Functional smoke test (after the LAST child of a run)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the Domain Knowledge tab: open it, pick a location, run a DK search /
ask a DK question, confirm sources panel + citations render and Street View
toggles. `typeof window.initDomainKnowledge === 'function'` and
`typeof CL.ai.domainKnowledge` defined. `playwright-cli close`.

## §7 Rollback (per child)
```bash
git checkout -- app/index.html && rm app/modules/ai/ai-domain-knowledge-<child>.js
```

## §8 Out of scope
Renames/reformat/improve; moving non-DK decls; other/off-limits modules;
relocating app-wide shared globals (window-mirror only); CLAUDE.md edits;
PR unless asked.

---
### Ordering
41a → 41b → 41c → 41d → 41e → 41f, one session each, verify green between.
No external prompt gate (DK band is single-ownership). Recommended Session O
slot: after 15-v2, before 27-v2 (see `NEVER_RUN_PROMPTS_ANALYSIS.md`).
