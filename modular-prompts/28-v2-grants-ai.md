# CC Modular Extraction Prompt 28-v2 — `app/modules/grants/grants-ai*.js` (3-CHILD RE-SPLIT)

**Supersedes `modular-prompts/28-grants-grants-ai.md`** — **anchor/responsibility
mismatch**: the v1 anchors (`showNotifTab`@33064, `syncFromStandardReportsTab`,
`updateEmailLocationVisibility`, `toggleGrantAlertOptions`,
`calculateGrantNextDelivery`) are **email-notification UI** functions (they
belong to the EMAIL NOTIFICATION SYSTEM band → owned by **29-v2**, which absorbs
them). The v1 *stated responsibility* — "Grant AI agents + narrative
generation" — is the contiguous **AI-POWERED FULL APPLICATION GENERATION** band
`generateFullApplicationContent`@35591 → `exportAppWord`@37035 (~1,452 LOC),
still inline (NOT in the off-limits `grants-ui.js`, which was block
L37263–L39447). Byte-unmodified — see `modular-prompts/SUPERSEDED.md`.
Re-anchored 2026-05-17 (CC Session N) @ live **145,624 lines**. Analysis:
`NEVER_RUN_PROMPTS_ANALYSIS.md`.

**Severity:** Refactor. **One CHILD per session.** **THREE-MODULE re-split** of
the AI-app-generation band only.

## §0 Pre-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
grep -nE '^// AI-POWERED FULL APPLICATION GENERATION' app/index.html   # band START = ============ divider above (~L35588)
grep -nE '^(async )?function +(generateFullApplicationContent|exportAppWord)\b' app/index.html
grep -nE '^// AI COUNTERMEASURE ASSISTANT' app/index.html              # band END = ============ divider above this (~L37040)
# Enumerate the band's fns to design 3 ≤500 children:
grep -nE '^(async )?function [a-zA-Z_]+ *\(' app/index.html | awk -F: '$1>=35588 && $1<=37040'
test -f app/modules/grants/grants-ai-<child>.js && echo ABORT || echo OK
grep -n '<script src="modules/grants/grants-ui.js"></script>' app/index.html  # load-after anchor, expect 1
```
ABORT if band not contiguous / target exists / off-limits / slice splits a fn.
Band ends cleanly at `// AI COUNTERMEASURE ASSISTANT` (~L37040) — that is a
separate CMF-AI feature; do NOT cross it.

## §1 What to move — 3 children (re-derive ≤500 by brace read)
| Order | Child | Candidate band | ~LOC | Anchor set |
|---|---|---|---|---|
| 28a | `grants/grants-ai-generate.js` | `// AI-POWERED FULL APPLICATION GENERATION`@~35588 → first ≤500 brace cut after `generateFullApplicationContent`@35591 | ~480 | `generateFullApplicationContent` + its prompt/section builders |
| 28b | `grants/grants-ai-sections.js` | 28a end → next ≤500 brace cut | ~485 | mid-band narrative/section-assembly helpers (enumerate in §0) |
| 28c | `grants/grants-ai-export.js` | 28b end → band END (`exportAppWord`@37035 close, ~L37039) | ~485 | tail helpers + `exportAppWord` (Word/PDF export of generated application) |

Exact internal boundaries are decided by the §0 fn enumeration + brace read so
each child is ≤500 — there are only 2 pre-known anchors
(`generateFullApplicationContent`, `exportAppWord`); the runner names the rest
from §0. Copy bytes **verbatim**.

## §2 Skeleton (per child)
```js
/** CL grants.ai<X> — extracted (name-anchored) 2026-05-17.
 *  see modular-prompts/28-v2-grants-ai.md. No behavior change.
 *  Depends on (script order): grants/grants-ui. */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // ─── EXTRACTED CODE END ───
  window.CL=window.CL||{}; CL.grants=CL.grants||{};
  CL.grants.ai=CL.grants.ai||{};
  CL._registerModule('grants/grants-ai-<child>');
})();
```

## §3 Script tags (LATE, after `<script src="modules/grants/grants-ui.js">`, 28a→28c)
```html
<script src="modules/grants/grants-ai-generate.js"></script>
<script src="modules/grants/grants-ai-sections.js"></script>
<script src="modules/grants/grants-ai-export.js"></script>
```

## §4 Remove (per child)
```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```

## §5 Post-flight (per child)
```bash
wc -l app/index.html ; grep -cE '^\s*(async\s+)?function ' app/index.html
node --check app/modules/grants/grants-ai-<child>.js
grep -nE 'function +(<this child anchors>)\b' app/index.html         # 0
grep -c '<script src="modules/grants/grants-ai-<child>.js"></script>' app/index.html  # 1
git diff --stat
```
Console: `[CL] Module loaded: grants/grants-ai-<child>`.

## §6 Smoke (after last child)
Open deployed app → Grants tab → select location(s) → **Generate full
application** (AI narrative renders), then **export** to Word/PDF. No new
console errors; `typeof window.generateFullApplicationContent === 'function'`.
`playwright-cli close`.

## §7 Rollback
`git checkout -- app/index.html && rm app/modules/grants/grants-ai-<child>.js`

## §8 Out of scope
The v1 email-UI anchors (now owned by 29-v2); AI COUNTERMEASURE ASSISTANT band;
`grants/grants-ui.js` (off-limits); renames; PR.

---
### Ordering
28a→28b→28c. **Run AFTER 27-v2** (shares the Grants tab; load order via
`grants-ui` anchor). **Session O slot: 6th.**
