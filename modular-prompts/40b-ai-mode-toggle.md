# CC Modular Extraction Prompt 40b — `app/modules/ai/ai-mode-toggle.js`

**Severity:** Refactor (no behavior change). **One file per session.**
**Supersedes the AI-mode-toggle slice of the old (BLOCKED) prompt 40.**

Read `CLAUDE.md` "Modular Extraction Refactor" first. This prompt is
self-contained and **name-anchored** (snapshot ranges are stale — always
re-derive the real block in §0). Background: `NAVIGATETO_STRUCTURE_SURVEY.md`
§4a, `NAVIGATETO_SPLIT_PLAN.md` §3.

## §0 Pre-flight verification (run BEFORE editing)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# Locate by NAME anchor (snapshot ~L28041–L28273; do NOT trust the number)
grep -nE "^const AI_MODE_STORAGE_KEY =|^function (toggleAIMode|handleAIToggleKeydown|initAIModeToggle|saveHeaderApiKey|clearHeaderApiKey|updateHeaderKeyStatus|updateAllAIStatusIndicators|updateHeaderProviderLink|initHeaderApiKey)\b" app/index.html
# Block = from the `const AI_MODE_STORAGE_KEY` line through the closing brace
# of initHeaderApiKey (the last fn above), inclusive. The DOMContentLoaded
# listener calling initAIModeToggle (~12 lines after initAIModeToggle) is
# INSIDE the block — confirm and include it. Read the braces; record
# [BLK_START, BLK_END]. Next decl after the block: STATE_HSO_REGISTRY const.

test -f app/modules/ai/ai-mode-toggle.js && echo "ABORT: target exists" || echo "OK"
grep -n '<script src="modules/app/tab-dispatcher.js"></script>' app/index.html  # load anchor: expect 1
```
ABORT if: block not contiguous, target exists, anchor missing, or any name
maps to an off-limits module in CLAUDE.md (none expected — these 9 fns +
const are AI-mode-toggle-private).

## §1 What to move
The single contiguous block `[BLK_START, BLK_END]` confirmed in §0
(~232 LOC): `const AI_MODE_STORAGE_KEY` + `toggleAIMode`,
`handleAIToggleKeydown`, `initAIModeToggle`, `saveHeaderApiKey`,
`clearHeaderApiKey`, `updateHeaderKeyStatus`, `updateAllAIStatusIndicators`,
`updateHeaderProviderLink`, `initHeaderApiKey`, **and** the inline
`document.addEventListener('DOMContentLoaded', initAIModeToggle)` listener.
Copy bytes **verbatim** — no renames, reformatting, or "improvements".

## §2 Where to put it
Create `app/modules/ai/ai-mode-toggle.js`:

```js
/**
 * CL ai.modeToggle module
 * Extracted from app/index.html (name-anchored; snapshot ~L28041-L28273).
 * navigateTo-split round — see NAVIGATETO_SPLIT_PLAN.md §3, prompt 40b.
 * Responsibility: AI Mode header toggle + header API-key manager.
 * Public API (dual exposure): window.<fn> ↔ CL.ai.modeToggle.<fn>
 * Module-private: AI_MODE_STORAGE_KEY (window.AI_MODE_STORAGE_KEY mirror
 *   only if still read by remaining inline code — verify).
 */
(function(){
  'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste block here, unchanged>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {};
  CL.ai = CL.ai || {};
  CL.ai.modeToggle = CL.ai.modeToggle || {};
  // window.<fn> = <fn>; CL.ai.modeToggle.<fn> = <fn>;  (all 9 fns)
  // if remaining inline code reads AI_MODE_STORAGE_KEY: window.AI_MODE_STORAGE_KEY = AI_MODE_STORAGE_KEY;
  CL._registerModule('ai/ai-mode-toggle');
})();
```

## §3 Wire the script tag
Add immediately AFTER `<script src="modules/app/tab-dispatcher.js"></script>`
(LATE cluster):
```html
<script src="modules/ai/ai-mode-toggle.js"></script>
```

## §4 Remove the original block
Delete exactly `[BLK_START, BLK_END]` from §0. Verify with
`sed -n '<s>,<e>p' app/index.html | head -3` / `| tail -3` before deleting.

## §5 Post-flight
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # decreased by 9
node --check app/modules/ai/ai-mode-toggle.js        # must pass
grep -c '<script src="modules/ai/ai-mode-toggle.js">' app/index.html  # 1
grep -nE '^function (toggleAIMode|initHeaderApiKey)\b' app/index.html  # 0 (gone)
git diff --stat                 # ONLY app/index.html + the new module
```
Console must show `[CL] Module loaded: ai/ai-mode-toggle`.

## §6 Smoke test (deployed GitHub Pages)
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console     # no new errors; module-loaded line present
```
Toggle AI Mode in the header; open/save/clear the header API key; confirm
status indicators update. `typeof window.toggleAIMode==='function'`,
`CL.ai.modeToggle` defined. `playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/ai/ai-mode-toggle.js`

## §8 Out of scope
Renames/reformatting; other fns; off-limits modules; moving app-wide
shared globals (window mirror only); editing CLAUDE.md; PR unless asked.
