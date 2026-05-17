# CC Modular Extraction Prompt 32-v2 — `app/modules/cmf/cmf-ai*.js` (6-CHILD RE-SPLIT)

**Supersedes `modular-prompts/32-cmf-cmf-ai.md`** (stale single-file prompt:
anchor `initCMFAI` resolves to a 17-line provider/key loader @ live L41053,
NOT a "~354-line CMF AI agents + recommendation narrative" block; snapshot
L48345–L48698 long dead). That file is byte-unmodified. Root cause + live
re-verification: `MODULAR_PLAN_PROMPT_32_RESOLUTION.md` (2026-05-17 addendum).
Re-anchored 2026-05-17 (CC Session O) against live `app/index.html`
@ **144,245 lines**.

> ⚠️ The CMF-AI surface is **NOT one contiguous block.** The region
> `runCMFAgent`@38010 … `initCMFAI`@41053 (~3,060 LOC, ~59 decls) **interleaves
> three features**: CMF-AI (this prompt), Grant-AI/Grant-Search (prompts
> 27/28/29-v2), and a shared attachment/PDF-export zone. This prompt extracts
> ONLY the three CMF-AI islands, as 6 feature-coherent ≤500-line children. It
> must NEVER pull a Grant or shared-PDF decl across an island boundary.

**Severity:** Refactor (no behavior change). **One CHILD per session — do NOT
batch.** SIX-MODULE re-split (32a→32b1→32b2→32b3→32c1→32c2), one session each,
in that order, verify green between each.

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are the
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive ACTUAL boundaries by brace read in §0.

## §0 Pre-flight verification (run BEFORE editing — per child)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Confirm the 3 CMF-AI island fences (shared reference, re-derive live):
grep -nE '^(async )?function +runCMFAgent\b' app/index.html              # island A start ~L38010
grep -nE '^function +syncGrantProviderSettings\b' app/index.html         # island A END = line above (Grant starts ~L38430)
grep -nE '^// AI COUNTERMEASURE ASSISTANT FUNCTIONS' app/index.html      # island B start divider ~L38784
grep -nE '^// CMF AI Attachment State' app/index.html                    # island B END = line above (~L39662)
grep -nE '^(async )?function +processCMFAIQuery\b' app/index.html        # island C start ~L40482
grep -nE '^// AI WRITING ASSISTANT' app/index.html                       # island C END = line above (~L41074)

# 2. Locate THIS child's anchors by NAME (live) and brace-read its sub-range:
grep -nE '^(async )?function +(runCMFAgent|runCMF4AgentAnalysis|buildCMFAgent1Input|syncCMFAIProviderSettings|getCMFContext|cmfAIAsk|sendCMFAIPrompt|processAICMFLookupQuery|downloadCMFAIChatPDF|processCMFAIQuery|callCMFAI|callCMFAIWithTools|getStaticCMFRecommendations|updateCMFAIDataBadge|initCMFAI)\b' app/index.html
#   Read braces around THIS child's first + last anchor → exact [BLK_START,BLK_END].
#   The child band must contain ONLY CMF-AI decls. If a Grant decl
#   (sync/clear*Grant*, callGrantAI, grantSearch*, *GrantRecommendations) or a
#   shared-PDF decl (sanitizeForPDF, parseMarkdownTables, parseTableLines,
#   renderAIChatToPDF, downloadCrashAnalysisPDF, downloadGrant*PDF, the
#   handleCMFAIFileSelect..clearCMFAIAttachments attachment cluster) falls in
#   the brace range → STOP and re-derive (you crossed an island fence).

# 3. Target must not exist
test -f app/modules/cmf/cmf-ai-<child>.js && echo "ABORT: exists" || echo "OK"

# 4. Load anchor present
grep -n '<script src="modules/cmf/cmf-search.js"></script>' app/index.html   # expected: 1
```
ABORT and report if: an island band is not contiguous, a child target exists,
the load anchor is missing, any name maps to an off-limits module, a Grant or
shared-PDF decl falls inside the brace range, or `node --check` of the proposed
slice would split a function.

## §1 What to move — RE-SPLIT into 6 children (one session each, in order)

| Order | Child module | Range (live, re-derive by brace) | ~LOC | Anchor set |
|---|---|---|---|---|
| 32a | `cmf/cmf-ai-agents.js` | `runCMFAgent`@38010 → before `syncGrantProviderSettings`@38430 | ~419 | `runCMFAgent`, `runCMF4AgentAnalysis`, `buildCMFAgent1Input` |
| 32b1 | `cmf/cmf-ai-assistant-core.js` | `// AI COUNTERMEASURE ASSISTANT FUNCTIONS`@38784 → before `cmfAIAsk`@39100 | ~316 | `syncCMFAIProviderSettings`,`syncCMFAIApiKey`,`saveCMFAIApiKey`,`clearCMFAIApiKey`,`updateCMFAIKeyHelper`,`updateCrashAIKeyHelper`,`getCMFAIApiKey`,`clearCMFAIChat`,`addCMFAIMessage`,`getCMFContext` |
| 32b2 | `cmf/cmf-ai-assistant-chat.js` | `cmfAIAsk`@39100 → before `processAICMFLookupQuery`@39393 | ~293 | `cmfAIAsk`,`sendCMFAIPrompt`,`getAIRecommendedCountermeasures`,`scrollToAIAndRecommend`,`triggerAICMFLookup` |
| 32b3 | `cmf/cmf-ai-assistant-lookup.js` | `processAICMFLookupQuery`@39393 → before `// CMF AI Attachment State`@39662 | ~269 | `processAICMFLookupQuery`,`downloadCMFAIChatPDF` |
| 32c1 | `cmf/cmf-ai-query-core.js` | `processCMFAIQuery`@40482 → before `callCMFAIWithTools`@40646 | ~164 | `processCMFAIQuery`,`callCMFAI` |
| 32c2 | `cmf/cmf-ai-query-tools.js` | `callCMFAIWithTools`@40646 → before `// AI WRITING ASSISTANT`@41074 | ~427 | `callCMFAIWithTools`,`getStaticCMFRecommendations`,`updateCMFAIDataBadge`,`initCMFAI` |

Each band must contain ONLY that child's anchors + lexically-nested helpers.
Copy bytes **verbatim** — preserve every blank line, comment, leading space.
No renames/reformat/improve. If a brace read shows a child >500 LOC, split it
further at the next named-fn boundary inside the same island and append a
`32xN` row here before extracting (never cross an island fence to balance).

**Explicitly OUT of scope (do NOT extract in 32-v2):**
- **Grant island** L~38430–L~38783: `syncGrantProviderSettings`,`syncGrantApiKey`,
  `syncAllApiKeys`,`clearAllApiKeys`,`saveGrantSearchApiKey`,`saveGrantWritingApiKey`,
  `clearGrantSearchApiKey`,`clearGrantWritingApiKey`,`loadGrantAISettings`,
  `getGrantApiKey`,`callGrantAI`, the `grantSearch*` cluster,
  `processGrantSearchQuery`,`getStaticGrantRecommendations` → grants
  prompts 27/28/29-v2. Leave inline & untouched.
- **Attachment + shared-PDF zone** L~39662–L~40481:
  `handleCMFAIFileSelect`,`renderCMFAIAttachments`,`removeCMFAIAttachment`,
  `clearCMFAIAttachments`,`downloadGrantSearchPDF`,`downloadGrantWritingPDF`,
  `sanitizeForPDF`,`parseMarkdownTables`,`parseTableLines`,`renderAIChatToPDF`,
  `downloadCrashAnalysisPDF` — cross-feature PDF utilities shared with the
  Grant assistants. Leave inline; flag for a future dedicated shared-PDF
  prompt. (The 4 `*CMFAIAttachment*` fns are CMF-specific but lexically
  embedded in the shared-PDF zone; isolating them would split shared-PDF —
  defer to that future prompt, do not carve them out here.)

## §2 Where to put it (per child)

```js
/**
 * CL cmf.ai<X> — extracted (name-anchored) 2026-05-17.
 * Round X modular refactor — see modular-prompts/32-v2-cmf-ai.md
 * + MODULAR_PLAN_PROMPT_32_RESOLUTION.md.
 * Responsibility: CMF-AI — <agents|assistant-core|assistant-chat|
 *   assistant-lookup|query-core|query-tools>.
 * Depends on (script-tag order): cmf/cmf-search; 32b/32c after 32a.
 * Shared globals cmfAIState / ApiKeySecurity / cmfState / COL / crashState
 * stay INLINE (resolved via the shared classic-script global scope —
 * same precedent as cmf/cmf-search.js); do NOT move or mirror them.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste the confirmed name-anchored block, unchanged>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.cmf = CL.cmf || {};
  CL.cmf.ai = CL.cmf.ai || {};
  // expose EACH moved named decl: window.<fn>=<fn>; CL.cmf.ai.<fn>=<fn>;
  CL._registerModule('cmf/cmf-ai-<child>');
})();
```
`CL.cmf` already exists in `loader.js` — **no loader.js edit**. Every moved fn
gets a `window.<fn>` back-compat export (HTML onclick / hoisting callers).

## §3 Wire the script tags (after `<script src="modules/cmf/cmf-search.js">`, in order)
Each child's tag immediately AFTER the previous child's tag; 32a immediately
AFTER `<script src="modules/cmf/cmf-search.js"></script>`:
```html
<script src="modules/cmf/cmf-ai-agents.js"></script>
<script src="modules/cmf/cmf-ai-assistant-core.js"></script>
<script src="modules/cmf/cmf-ai-assistant-chat.js"></script>
<script src="modules/cmf/cmf-ai-assistant-lookup.js"></script>
<script src="modules/cmf/cmf-ai-query-core.js"></script>
<script src="modules/cmf/cmf-ai-query-tools.js"></script>
```
(`cmf/cmf-search.js` is in the EARLY cluster — place these tags there, right
after it; do NOT relocate to a "LATE" cluster.)

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
node --check app/modules/cmf/cmf-ai-<child>.js                       # pass
grep -nE 'function +(<this child's anchor names>)\b' app/index.html  # expected: 0
grep -c '<script src="modules/cmf/cmf-ai-<child>.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the one new module
```
Console on load: `[CL] Module loaded: cmf/cmf-ai-<child>`.

## §6 Functional smoke test (after the LAST child of a run)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the CMF / Countermeasures tab: open it, select a location, click
"AI Recommended" countermeasures, ask the CMF-AI assistant a question, confirm
the agent run + recommendation narrative render and the chat PDF export works.
`typeof window.initCMFAI === 'function'` and `typeof CL.cmf.ai` defined.
`playwright-cli close`.

## §7 Rollback (per child)
```bash
git checkout -- app/index.html && rm app/modules/cmf/cmf-ai-<child>.js
```

## §8 Out of scope
Renames/reformat/improve; the Grant island; the attachment/shared-PDF zone;
other/off-limits modules; relocating app-wide shared globals (window-mirror
only — but for CMF-AI the shared globals stay inline, NOT mirrored, per §2);
CLAUDE.md edits; PR unless asked.

---
### Ordering
32a → 32b1 → 32b2 → 32b3 → 32c1 → 32c2, one session each, verify green
between. No external prompt gate (the 3 CMF-AI islands are single-ownership
once the Grant/shared-PDF decls are fenced out). Unblocks prompt **33-v2**
(`cmf-deficiency`) once 32c2 lands. See `NEVER_RUN_PROMPTS_ANALYSIS.md`.
