# CC Lane 000 — Generate the Crash Lens Code Map + integrate it as a living document (FIRST RUN)

**Goal:** Produce 3 deliverables in one commit:

1. **`app/CODE_MAP.md`** — single navigation map indexing every tab, function, module, and shared global. Lets every future CC task find code without reading the 134K-line `app/index.html`.
2. **`docs/CODE_MAP_DESIGN.md`** — the design/rationale doc (copied from `docs/Cowork/CODE_MAP_DESIGN.md` in Murad's local OneDrive into the repo, so it's versioned with the code).
3. **Updates to `CLAUDE.md`** — adds a section that makes the map MANDATORY first-read for every CC session + codifies the extract-on-touch + living-document policies.

**Severity:** Documentation + policy update. No JavaScript/HTML changes. 1 new file + 1 new file + 1 file modified.

**Branch:** `claude/generate-code-map`

**This prompt runs FIRST in the orchestrator queue (000-) because every later prompt depends on the map + CLAUDE.md policies being in place.**

## Why a living document, not a one-shot map

The map is **rewritten on every PR that touches code.** If CC moves a function, the same PR includes the map update. If CC adds a function, the map gets the new row. The map being out of date is treated as a bug, not an acceptable drift.

This is enforced via the new CLAUDE.md policy section (Step 5 below) — every future CC prompt will read CLAUDE.md, see the policy, and update the map as part of its work.

The auto-regen script (separate, future work) is a SAFETY NET to catch drift between regens — not a substitute for per-PR updates.

## Pre-flight

```bash
cd <repo root>
git checkout main && git pull origin main
git checkout -b claude/generate-code-map
wc -l app/index.html
ls app/modules/**/*.js | wc -l
test -f app/CODE_MAP.md && echo ABORT-EXISTS || echo OK
```

If `app/CODE_MAP.md` already exists: ABORT and report. (We can regenerate later via a separate script.)

## What to scan and how

### Step 1 — Identify all UI tabs

```bash
# Tab content divs
grep -nE 'id="tab-[a-z-]+"' app/index.html | head -30

# Tab navigation triggers
grep -nE "navigateTo\('([a-z-]+)'\)" app/index.html | head -30

# Canonical tab IDs (matches the navigation function in tab-dispatcher)
grep -nE "navigateTo\([\"']([a-z-]+)[\"']\)" app/index.html | grep -oE "['\"][a-z-]+['\"]" | sort -u
```

Expected tabs (verify against grep output, may differ):
upload, dashboard, map, hotspots, crashtree, scorecard, safety, fatalspeeding, intersection, pedestrian, reports, cmf, grants, ai, domain-knowledge, warrants, analysis

For each tab, record:
- Tab ID (the string passed to `navigateTo()`)
- Content div ID (e.g., `tab-hotspots`)
- HTML template inline line range (the `<div id="tab-X">...</div>` block)

### Step 2 — Identify all top-level inline functions

```bash
grep -nE '^(async )?function +[a-zA-Z_][a-zA-Z0-9_]*\s*\(' app/index.html > /tmp/inline-functions.txt
wc -l /tmp/inline-functions.txt   # expect ~700-1500 functions
```

For each function, record:
- Function name
- Line number where declared
- Whether it's exposed via `window.<name>` somewhere in inline code or in a module's dual-API block

### Step 3 — Enumerate extracted modules

```bash
find app/modules -name "*.js" -type f | sort > /tmp/modules-list.txt
```

For each module file:
- Path (e.g., `modules/hotspots/hotspots-tab-core.js`)
- Cluster (first path segment after `modules/`: `hotspots`)
- Module name (filename without `.js`)
- LOC count
- Public API: parse the `window.X = X; CL.area.X = X` block at the end of each IIFE; list every exported function name
- The header comment block (lines 1-30 of each module) — extract responsibility description if present

### Step 4 — Heuristic tab association

For each function, determine which tab it belongs to using these rules (in order of priority):

1. **Module path match:** if the function is in `app/modules/hotspots/...`, it belongs to the `hotspots` tab
2. **Name prefix match:** function name contains the tab ID (case-insensitive):
   - `analyzeHotspots`, `renderHotspots*` → hotspots
   - `updateDashboard*`, `renderDashboard*` → dashboard
   - `cmfAI*`, `executeCMF*` → cmf
   - `grantS*`, `*Grant*` → grants
   - etc.
3. **DOM ID reference:** function reads/writes elements with `id="<tab-id>*"` (grep the function body)
4. **No match:** tag as `shared` (utilities, infrastructure) or `unknown`

For multi-tab functions (e.g., a helper used by both hotspots and intersection), tag with comma-separated tabs.

### Step 5 — Identify shared globals

```bash
# State objects declared at top level
grep -nE '^(let|var|const) +[a-zA-Z_][a-zA-Z0-9_]*State\b' app/index.html | head -30

# Other big-letter globals
grep -nE '^(let|var|const) +(GRANT_SCORING_PROFILES|CRASH_CACHE|TIER_LABELS|.*_PROFILES|.*_CONSTANTS)\b' app/index.html | head -30
```

For each global:
- Name
- Type (object, array, constant, function)
- Declared at (inline L## OR module path)
- Consumed by (which tabs read/write it — grep for references)

## §2 Output structure

Write `app/CODE_MAP.md` with EXACTLY this structure:

```markdown
# Crash Lens Code Map

> **Purpose:** Single navigation index for the Crash Lens app. Read this BEFORE editing any code. It tells you which tab a feature belongs to, whether it's inline or extracted, and the exact line numbers / module paths.
>
> **Last generated:** <ISO date>
> **app/index.html:** <wc -l> lines
> **Total modules:** <count>
> **Generated by:** `queue/000-generate-code-map.md` via CC

## How to use this map (instructions for Claude Code)

Before any code edit:
1. Read this map fully
2. Look up the relevant tab section (or function in the function index)
3. Read ONLY the specific section indicated:
   - If extracted: read just the module file
   - If inline: read the specific line range in app/index.html
4. Make the edit
5. If function moved OR new function added: update this map too (your PR must include the map diff)

**Trust but verify.** Line numbers drift as code changes. Always run a quick `grep -n 'function +X'` to confirm the location matches what the map says. If mismatch: update the map.

## Tab index

[ONE SECTION PER TAB, in order: upload, dashboard, map, hotspots, crashtree, scorecard, safety, fatalspeeding, intersection, pedestrian, reports, cmf, grants, ai, domain-knowledge, warrants, analysis]

### <Tab display name>
- **Tab ID:** `<id>`
- **Content div:** `#tab-<id>`
- **Status:** ✅ Fully modularized | 🟡 Partially modularized | ⬜ Inline only
- **HTML template:** inline L<start>-L<end>
- **Modules (<count>):**
  - `app/modules/<cluster>/<name>.js` — <one-line purpose from module header comment>
  - ...
- **Inline functions remaining (<count>):**
  - `funcName(params)` @ L<line> — <one-line purpose from preceding comment or first statement>
  - ...
- **Shared globals:** `stateVar1` (declared <where>), `stateVar2` (declared <where>)
- **Dependencies:** <comma-separated list of other clusters/modules this tab needs>

[Repeat for each tab]

## Function index (alphabetical)

| Function | Location | Type | Tab(s) |
|---|---|---|---|
| addEmailChip | inline @ L32406 | window+inline | notifications |
| analyzeHotspots | modules/hotspots/hotspots-tab-core.js | window+CL | hotspots |
| applyLocationLimit | modules/grants/grants-controls.js | window+CL | grants |
| ... | ... | ... | ... |

[ONE ROW PER FUNCTION — there will be 700-1500 rows. That's expected.]

## Module index

| Module path | LOC | Cluster | Public API (count) | Tab(s) served |
|---|---|---|---|---|
| ai/ai-domain-knowledge-core.js | ~370 | ai | initDomainKnowledge, ... (7 fns) | ai, domain-knowledge |
| grants/grants-controls.js | 96 | grants | 6 fns | grants |
| ... | ... | ... | ... | ... |

[ONE ROW PER MODULE — 92 rows currently.]

## Global state index

| Global | Type | Declared at | Consumed by |
|---|---|---|---|
| crashState | object | inline @ L24500 | ALL tabs (universal) |
| dashboardState | object | inline @ L41950 | dashboard tab |
| hotspotState | object | modules/hotspots/hotspots-tab-core.js | hotspots tab |
| grantState | object | inline @ L29900 | grants tab |
| GRANT_SCORING_PROFILES | constant object | inline @ L<line> | grants tab |
| ... | ... | ... | ... |

## Coverage stats

- **Tabs fully modularized:** <count> / 17
- **Tabs partially modularized:** <count> / 17
- **Tabs inline only:** <count> / 17
- **Inline functions remaining:** <count>
- **Modules:** <count>
- **Inline LOC:** <wc -l>
- **Module LOC total:** <sum>

## Notes for CC

**Common mistakes to avoid:**
- Don't trust line numbers blindly — re-grep before editing (especially after recent PRs)
- Functions in modules use `window.<name>` for back-compat; they're still callable from inline code
- `crashState` is the universal state object touched by every tab; don't reorganize without coordinating

**Where to find related docs:**
- Modular extraction history: `docs/Cowork/MODULAR_REFACTOR_ROADMAP.md`
- Project conventions: `CLAUDE.md` (root)
- Activity log: `log.md` (root)
```

## §3 No script tag changes (this is doc-only)

This prompt does not touch `app/index.html`. No script tag insertion. No module file creation.

## §4 No deletions

This prompt does not delete anything from `app/index.html`.

## §4.5 Copy design doc into the repo

Murad maintains the design doc in his local OneDrive at `<OneDrive>/Federal/docs/Cowork/CODE_MAP_DESIGN.md` (outside the repo). For this PR, copy that file into the repo at `docs/CODE_MAP_DESIGN.md` so it's versioned alongside the map.

If `docs/` doesn't exist in the repo, create it. If the file already exists in the repo, overwrite with the latest from OneDrive.

The harness should provide CC with the file's contents (or CC can fetch it from `https://raw.githubusercontent.com/ecomhub200/Federal/main/docs/Cowork/CODE_MAP_DESIGN.md` if it's been pushed there separately — check both locations).

If neither location has the design doc, generate `docs/CODE_MAP_DESIGN.md` inline using the template provided in §5.5 below.

## §4.6 Update CLAUDE.md with the mandatory policies (CRITICAL)

Append this exact section to `CLAUDE.md` (at the root of the repo) immediately AFTER the existing intro paragraph and BEFORE the "Modular Extraction Refactor" section (if that exists). If no clear insertion point, append at the end of the file.

```markdown
## Code Map (REQUIRED — read first on every session)

**The map at `app/CODE_MAP.md` is your primary navigation aid.** It indexes every tab, top-level function, extracted module, and shared global with exact line numbers and module paths. Without it you'll waste context searching the 134K-line `app/index.html`.

### Mandatory policies for every CC session

**Policy 1 — Read the map first.**
Before any `grep`/`Read`/`Edit` on `app/index.html` or a module file, read `app/CODE_MAP.md` and identify the affected sections. Then read ONLY those specific sections (the module file, OR a narrow line range in `app/index.html`). Do NOT scan the whole `app/index.html` looking for code — the map tells you where to look.

**Policy 2 — Extract-on-touch.**
When you modify code in `app/index.html`:
- If you're editing an existing function in-place (small change): leave it inline, update the map's location row if line numbers shifted.
- If the function you're touching is >100 LOC AND has a tight cohesive cluster of neighbors AND extracting it cleanly is feasible in the same diff: **extract it to a module in the same commit.** This avoids a separate "refactor pass" later.
- If extraction would balloon the diff or risk other code: defer extraction. In the map, tag the function with `extract-candidate: true` so a future session knows to revisit.

The goal: the inline `app/index.html` shrinks naturally as features are touched. No separate modular refactor effort needed.

**Policy 3 — Update the map after EVERY code change.**
Your PR diff MUST include `app/CODE_MAP.md` changes if you:
- Added a new function
- Moved a function (inline → module, or module → module)
- Renamed a function
- Deleted a function
- Changed the tab a function serves
- Changed line numbers (any non-trivial edit shifts numbers — re-grep affected entries)

A PR that touches code without updating the map will be rejected at review.

**Policy 4 — Map drift is a bug.**
If you find the map says a function is at L###, but it's actually at L###+50, fix the map in the same PR. Don't leave drift. The map is the source of truth for navigation; if it lies, future CC sessions waste context.

**Policy 5 — Living document.**
The map is rewritten constantly. Never treat its line numbers as eternal — always re-grep to verify before editing. But always trust its STRUCTURE (which tab, which module, what cluster). Structure changes slowly; line numbers change every PR.

### See also
- `docs/CODE_MAP_DESIGN.md` — full rationale, format spec, maintenance strategy
- `app/CODE_MAP.md` — the map itself

### What if the map seems wrong?
- Re-grep to confirm. If grep matches the map: edit normally.
- If grep contradicts the map: edit the code AND fix the map in the same PR.
- If the function the map references doesn't exist anymore: someone deleted it without updating the map. Find the actual location (or confirm it's gone), fix the map.
- If a whole tab seems to be missing from the map: this is a regression — the map was incompletely regenerated. Run the auto-regen script (or queue a `regenerate-code-map.md` prompt) to fix.
```

Verify the section was added cleanly:

```bash
grep -c "## Code Map (REQUIRED" CLAUDE.md   # expect: 1
grep -c "Extract-on-touch" CLAUDE.md         # expect: 1
grep -c "Living document" CLAUDE.md          # expect: 1
```

## §5 Post-flight verification

```bash
# Three files should be touched
test -f app/CODE_MAP.md && echo OK_MAP || echo FAIL_MAP
test -f docs/CODE_MAP_DESIGN.md && echo OK_DESIGN || echo FAIL_DESIGN
grep -c "## Code Map (REQUIRED" CLAUDE.md   # expect: 1

# Map sanity
wc -l app/CODE_MAP.md   # expect 3000-8000 lines
head -50 app/CODE_MAP.md   # spot-check format

# Coverage
grep -cE '^### ' app/CODE_MAP.md   # expect ~17 (one per tab)
grep -cE '^\| ' app/CODE_MAP.md    # expect 800-1700 rows (function + module + global tables)

# Policy sanity in CLAUDE.md
grep -c "Read the map first" CLAUDE.md       # expect: 1
grep -c "Extract-on-touch" CLAUDE.md         # expect: 1
grep -c "Living document" CLAUDE.md          # expect: 1

# Diff scope
git diff --stat   # expect 3 files touched: app/CODE_MAP.md (new), docs/CODE_MAP_DESIGN.md (new), CLAUDE.md (modified)
```

## §5.5 Inline template for `docs/CODE_MAP_DESIGN.md` (fallback if Murad's local copy isn't accessible)

If CC can't find the design doc in either the local OneDrive path or the raw GitHub fallback, generate `docs/CODE_MAP_DESIGN.md` with this content:

```markdown
# Crash Lens Code Map — Design

The map at `app/CODE_MAP.md` is the navigation index for the Crash Lens codebase. It exists because `app/index.html` is 134K+ lines and CC was wasting context budget searching through it.

## What the map indexes
1. **Tabs** — every UI tab, its status (inline/modularized), HTML template lines, modules, remaining inline functions, shared globals, dependencies
2. **Functions** — every top-level function (alphabetical) with location (inline L## or module path) and tab association
3. **Modules** — every extracted module with public API, cluster, tabs served
4. **Globals** — every shared state object with declaration site and consumers

## How CC uses it
See `CLAUDE.md` "Code Map (REQUIRED)" section for the mandatory policies.

## Maintenance
- **Per-PR:** CC updates affected entries (enforced by Policy 3)
- **Periodic:** auto-regen script (future work) catches drift
- **Manual:** Cowork can rewrite sections via raw GitHub when needed

## Why not just keep modularizing?
Modular extraction is slow, risky, and only helps after the extraction is done. The map helps EVERY CC task immediately, without touching code. Already-extracted modules are still represented in the map. Future extractions become OPTIONAL — done when the value justifies the risk (e.g., during extract-on-touch).
```

## §6 Smoke test (no app changes, so just verify the map is usable)

Pick 3 functions from the function index. For each:
- Grep `app/index.html` (or the module path) to confirm the location matches what the map says
- If any mismatch: fix the map row before committing

This catches generation bugs early.

## §7 Rollback

```bash
git checkout -- app/CODE_MAP.md   # if file existed previously
# or:
rm app/CODE_MAP.md   # if newly created
```

## §8 Out of scope

- DO NOT modify `app/index.html` (this PR is doc-only)
- DO NOT modify any existing module
- DO NOT extract any new modules (extract-on-touch starts NEXT session, after CLAUDE.md is in place)
- DO NOT create a PR (push branch only)
- DO NOT change `loader.js`
- DO NOT regenerate or remove sections of CLAUDE.md other than the new "Code Map (REQUIRED)" section

## Commit & push

```bash
git add app/CODE_MAP.md docs/CODE_MAP_DESIGN.md CLAUDE.md
git commit -m "docs: add app/CODE_MAP.md + docs/CODE_MAP_DESIGN.md + CLAUDE.md policies

Three deliverables in one commit:
1. app/CODE_MAP.md — navigation index for tabs, functions, modules, globals.
   - 17 UI tabs with status + module list + inline function list
   - ~1000 top-level functions with location + tab association
   - 92 extracted modules with public API
   - Shared globals with declaration + consumers
2. docs/CODE_MAP_DESIGN.md — full rationale + format spec + maintenance strategy.
3. CLAUDE.md — adds mandatory 'Code Map (REQUIRED)' section with 5 policies:
   - Policy 1: Read map first before any code task
   - Policy 2: Extract-on-touch (modularize when you touch a function)
   - Policy 3: Update map after every code change (PRs without map update rejected)
   - Policy 4: Map drift is a bug
   - Policy 5: Living document — re-verify line numbers, trust structure

Future CC tasks will read CLAUDE.md → see policies → read CODE_MAP.md → edit
targeted code. Reduces context usage 50-90% per task and starts the
extract-on-touch flywheel.

The map is a LIVING DOCUMENT. Every PR that touches code must update it."
git push -u origin claude/generate-code-map
```

## Final report

```
Code Map generated.
- File: app/CODE_MAP.md (<wc -l> lines)
- Tabs indexed: <count> / 17
- Functions indexed: <count>
- Modules indexed: <count>
- Globals indexed: <count>
- Branch: claude/generate-code-map (pushed; no PR)
- Smoke test: 3 sample lookups verified against actual code
```

## Why this prompt matters

Every CC prompt AFTER this one will be faster, cheaper, and more accurate because it reads the map first. The map is the single biggest productivity improvement for CC-driven development on this codebase.

**Estimated CC token savings per future task: 50-90%.** Over 50 more CC runs (the projected remaining work), that's significant cost + time savings.
