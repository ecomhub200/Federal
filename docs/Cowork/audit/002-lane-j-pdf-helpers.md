# CC Lane J — extract PDF/markdown table helpers (single-lane)

**Goal:** Extract 3 PDF text + markdown table helpers (sanitizeForPDF, parseMarkdownTables, parseTableLines) from `app/index.html` to `reports/pdf-table-helpers.js`. Pure-ish helpers, no shared state.

**Pre-flighted by Cowork (2026-05-19):**
- `sanitizeForPDF` @ L38843, `parseMarkdownTables` @ L38888, `parseTableLines` @ L38941
- Band END marker (NOT moved): the next named function AFTER `parseTableLines`. Cowork didn't scan past — CC must derive at runtime via grep + brace-read.
- Estimated ~150 LOC total.
- Target FREE (`app/modules/reports/pdf-table-helpers.js` does not exist; `reports/` cluster has 6 existing modules).

**Cluster:** `app/modules/reports/` (existing).

## Branch

Harness-designated branch. Nominal: `claude/lane-j-pdf-helpers`. **No PR.**

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout <harness-designated branch>
wc -l app/index.html # baseline
```

## §0 Anchor verification + ABORT gate

```bash
grep -nE '^function +(sanitizeForPDF|parseMarkdownTables|parseTableLines)\b' app/index.html # expect 3 matches
# Find next named function AFTER parseTableLines to bound the band
awk '/^function +parseTableLines\b/{start=1} start && /^function +/ && !/^function +parseTableLines\b/{print NR": "$0; exit}' app/index.html
test -f app/modules/reports/pdf-table-helpers.js && echo ABORT-EXISTS || echo OK
```

Brace-read from `sanitizeForPDF` → last fn at end of `parseTableLines`. Record start/end + LOC.

**ABORT if:** target exists · band not contiguous · slice splits a function · slice swallows code unrelated to PDF/markdown table helpers · any moved name maps to off-limits.

**≤500 rule:** estimated ~150 LOC, no split needed.

## §2 Skeleton

```js
/** CL reports.pdfTableHelpers — PDF text + markdown table helpers extracted 2026-05-19.
* Pure helpers. No shared state. */
(function(){ 'use strict';
// ─── EXTRACTED CODE START (verbatim) ───
// ─── EXTRACTED CODE END ───
window.CL=window.CL||{}; CL.reports=CL.reports||{};
CL.reports.pdfTableHelpers=CL.reports.pdfTableHelpers||{};
window.sanitizeForPDF=sanitizeForPDF; CL.reports.pdfTableHelpers.sanitizeForPDF=sanitizeForPDF;
window.parseMarkdownTables=parseMarkdownTables; CL.reports.pdfTableHelpers.parseMarkdownTables=parseMarkdownTables;
window.parseTableLines=parseTableLines; CL.reports.pdfTableHelpers.parseTableLines=parseTableLines;
CL._registerModule('reports/pdf-table-helpers');
})();
```

## §3 Script tag

Insert in the LATE cluster after the most recent `<script src="modules/reports/*">` tag (probably `reports-standard-types2.js` or `reports-pdf.js`). Verify at runtime.

## §4 Remove

```bash
sed -n '<S>,<E>p' app/index.html | head -5 ; sed -n '<S>,<E>p' app/index.html | tail -5
```
Delete verbatim block.

## §5 Post-flight

```bash
wc -l app/index.html # drops ~150
node --check app/modules/reports/pdf-table-helpers.js
grep -nE 'function +(sanitizeForPDF|parseMarkdownTables|parseTableLines)\b' app/index.html # 0
grep -c '<script src="modules/reports/pdf-table-helpers.js"></script>' app/index.html # 1
git diff --stat
```

Console: `[CL] Module loaded: reports/pdf-table-helpers`.

## §6 Smoke

```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli console # NO new errors
# Generate any PDF report → verify export downloads cleanly + markdown tables in report content render
playwright-cli close
```

## §7 Rollback

```bash
git checkout -- app/index.html && rm app/modules/reports/pdf-table-helpers.js
```

## §8 Out of scope

Any non-PDF/non-table function; downloadGrantSearchPDF/downloadGrantWritingPDF (separate lane); renames; reformatting; PR.

## Commit & push

```bash
git add app/modules/reports/pdf-table-helpers.js app/index.html
git commit -m "refactor: extract PDF + markdown table helpers to reports/pdf-table-helpers.js"
git push -u origin <harness branch>
```

## Final report

```
Lane J complete (PDF table helpers).
- app/index.html: <baseline> → <new>
- new module: reports/pdf-table-helpers.js (node --check clean, registered)
- 3 fns moved (sanitizeForPDF, parseMarkdownTables, parseTableLines)
- Smoke: PDF export green, console clean
- Branch: <harness branch> (pushed; no PR)
```
