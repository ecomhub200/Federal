# CC Modular Extraction Prompt 40c1 — `app/modules/ai/ai-analyst-chat.js`

**Severity:** Refactor (no behavior change). **One file per session.**
**First of the 40c AI-analyst chain — extracts `aiState` (others depend on it).**

Read `CLAUDE.md` "Modular Extraction Refactor" first. Name-anchored;
re-derive the real block in §0. Background: `NAVIGATETO_STRUCTURE_SURVEY.md`
§4b, `NAVIGATETO_SPLIT_PLAN.md` §3/§5 (R2).

## §0 Pre-flight
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html

grep -nE "^const aiState =|^function (loadSavedKey|handleAIFileSelect|renderAttachments|removeAttachment|askSuggestion|clearAIChat|clearApiKey|addMessage|addTypingIndicator|removeTypingIndicator|buildCrashDataContext)\b" app/index.html
# Block: from `const aiState = {` (snapshot ~L80084) through the closing
# brace of buildCrashDataContext (last fn, snapshot ~L80369), inclusive.
# Preceding decl: downloadFile(). Next decl: initMUTCDLocationDropdown()
# (belongs to 40c2 — do NOT include). Read braces; record [BLK_START,BLK_END].

test -f app/modules/ai/ai-analyst-chat.js && echo "ABORT: exists" || echo OK
grep -n '<script src="modules/ai/ai-mode-toggle.js"></script>' app/index.html  # load anchor (run 40b first)
```
ABORT on: non-contiguous block, target exists, anchor missing, any name in
an off-limits module (none expected for these 11 fns + `aiState`).

## §1 What to move
The block `[BLK_START,BLK_END]` (~286 LOC): `const aiState` + the 11 chat
functions above, verbatim. `aiState` is shared by later 40c modules — it
moves HERE and is window/CL-mirrored.

## §2 Module
Create `app/modules/ai/ai-analyst-chat.js`:
```js
/**
 * CL ai.analystChat — extracted from app/index.html (name-anchored,
 * snapshot ~L80084-L80369). navigateTo-split round, prompt 40c1.
 * Responsibility: AI Analyst chat — state, attachments, message render.
 * Owns `aiState` (mirrored to window.aiState + CL.ai.aiState for the
 * other 40c modules and any remaining inline reader).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste block>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.ai = CL.ai || {};
  CL.ai.analystChat = CL.ai.analystChat || {};
  window.aiState = aiState; CL.ai.aiState = aiState;
  // window.<fn> = <fn>; CL.ai.analystChat.<fn> = <fn>;  (11 fns)
  CL._registerModule('ai/ai-analyst-chat');
})();
```

## §3 Script tag
After `<script src="modules/ai/ai-mode-toggle.js"></script>` (LATE):
```html
<script src="modules/ai/ai-analyst-chat.js"></script>
```

## §4 Remove original
Delete `[BLK_START,BLK_END]`; head/tail-verify before deleting.

## §5 Post-flight
```bash
wc -l app/index.html            # ≈ N_LINES − block size
grep -cE '^\s*(async\s+)?function ' app/index.html   # −11
node --check app/modules/ai/ai-analyst-chat.js
grep -c '<script src="modules/ai/ai-analyst-chat.js">' app/index.html # 1
git diff --stat                 # ONLY index.html + new module
```
Console: `[CL] Module loaded: ai/ai-analyst-chat`.

## §6 Smoke test
`playwright-cli open https://ecomhub200.github.io/Federal/app/` →
open the AI Assistant, send a message, attach a file, clear chat; confirm no
new console errors and `typeof window.addMessage==='function'`,
`window.aiState` present. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/ai/ai-analyst-chat.js`

## §8 Out of scope
Renames/reformatting; other 40c bands; off-limits modules; CLAUDE.md edits;
PR unless asked.
