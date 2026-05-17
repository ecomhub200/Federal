# CC Modular Extraction Prompt 33-v2 — `app/modules/cmf/cmf-deficiency*.js` (RE-SPLIT)

**Supersedes `modular-prompts/33-cmf-cmf-deficiency.md`** (mis-sized: claimed
snapshot L90000–L99600 / "~9,601 lines" — a next-decl heuristic phantom; that
file is byte-unmodified, see `modular-prompts/SUPERSEDED.md`). Re-anchored
2026-05-17 (CC Session H) against live `app/index.html` @ **149,314 lines**.
Source risk doc: `BATCH_5_PROMPT_33_RISK.md` (**highest-risk of the six**).

**Severity:** Refactor (no behavior change). **One file per session — do NOT
batch.** **Run AFTER prompts 31 (cmf-search) AND 32 (cmf-ai).** This is a
**TWO-MODULE re-split** (33a then 33b) — one session each.

Read `CLAUDE.md` "Modular Extraction Refactor" first. Function names are
locator anchors; line numbers are *live as of 2026-05-17* and **will drift** —
re-derive ACTUAL boundaries by brace read in §0. **The true size is ~1,000 LOC,
NOT 9,601** — the 9.6k figure is the same next-decl-1 over-estimate the
INDEX_MAP regen corrects. Do **not** cut by the 9.6k snapshot.

## §0 Pre-flight verification (run BEFORE editing)

```bash
wc -l app/index.html                                  # record N_LINES
grep -cE '^\s*(async\s+)?function ' app/index.html    # record N_FNS

# 1. Locate the 5 anchors by NAME (live):
#      runADAnalysis        ~L82710   (curated `Analysis`-tagged AI fn)
#      runGPT4VAnalysis     ~L82860   (curated `Analysis`-tagged AI fn)
#      getGPT4VPrompt       ~L82921
#      detectDeficiencies   ~L83307
#      calculateRiskScore   ~L83346
grep -nE 'function +(runADAnalysis|runGPT4VAnalysis|getGPT4VPrompt|detectDeficiencies|calculateRiskScore)\b' app/index.html
#    Span ≈ L82710–L83388 (~680 LOC core; with surrounding helpers ≈ L82710–
#    L86100 ~1,000 LOC). Read braces around EACH anchor.

# 2. 🔴 INTERLEAVING CHECK (BATCH_5_PROMPT_33_RISK.md §2). The block is NOT
#    single-ownership / NOT cleanly contiguous:
#      - runADAnalysis / runGPT4VAnalysis are curated `Analysis` (not
#        `cmf-deficiency`).
#      - long `Unassigned` helper-arrow run after getGPT4VPrompt.
#      - below ~L83388 the band interleaves with CMF/Countermeasures AND
#        Grants decls.
awk -F'|' 'NR>9 && ($2+0)>=82700 && ($2+0)<=86100' INDEX_MAP_part*.md
#    Read every row's feature tag. A single verbatim contiguous extraction
#    WOULD DRAG foreign-tagged (Analysis/Grants/CMF) decls — do NOT do that.

# 3. Targets must not exist
test -f app/modules/cmf/cmf-deficiency.js   && echo "ABORT: 33b exists" || echo "OK 33b"
test -f app/modules/cmf/cmf-deficiency-ai.js && echo "ABORT: 33a exists" || echo "OK 33a"

# 4. Confirm load anchors present (PREREQUISITES — prompts 31 + 32)
grep -n '<script src="modules/cmf/cmf-search.js"></script>' app/index.html
grep -n '<script src="modules/cmf/cmf-ai.js"></script>' app/index.html
#    EXPECTED TODAY: 0 + 0 → prompts 31 and 32 not shipped. Documented
#    double gate: ABORT until BOTH cmf-search.js and cmf-ai.js exist + wired.
```
If any check fails (targets exist, **either anchor missing — 31/32 not
shipped**, any name off-limits): **ABORT and report — do not edit.**

No R1/R3 off-limits-name collision (`buildCountyWideCrashProfile` L79383-region
cluster is outside this band — verify by grep anyway).

## §1 What to move — RE-SPLIT into 33a + 33b

> 🔴 **LARGE BLOCK + NEEDS-SPLIT — Cowork supervised (highest risk).** **STOP
> after the §0 grep + interleaving awk.** Surface §0 output AND the proposed
> 33a/33b name-anchored boundary for an explicit **Cowork sub-split decision
> BEFORE** any §4 delete. The split boundary is decided by **function name**
> against the regenerated INDEX_MAP — **NEVER** by the 9.6k snapshot range and
> **never** as one contiguous cut (it would drag Analysis/Grants/CMF).

**Proposed split (Cowork confirms/adjusts the exact name boundary):**

- **33a — `app/modules/cmf/cmf-deficiency-ai.js`**: the AI-analysis helpers
  `runADAnalysis` (~L82710), `runGPT4VAnalysis` (~L82860), `getGPT4VPrompt`
  (~L82921) + only the `Unassigned` helper-arrows that are *lexically inside
  their bodies*. STOP the 33a band at the first decl tagged
  Grants/CMF/Analysis-foreign per the §0 awk.
- **33b — `app/modules/cmf/cmf-deficiency.js`**: `detectDeficiencies`
  (~L83307), `calculateRiskScore` (~L83346) + their immediate deficiency
  helpers. STOP 33b's band before the first interleaved
  CMF-Countermeasures/Grants decl (~L83388+ region per risk §2).

Each sub-module is its own session (33a first, then 33b). For EACH: re-derive
`[BLK_START,BLK_END]` by brace read; the band MUST contain only the named
anchors + their lexically-nested helpers — if a foreign-tagged decl falls
inside the brace range, the anchor choice is wrong: STOP and re-derive (do not
extract a mixed-ownership block). Copy bytes **verbatim**.

## §2 Where to put it (per sub-module)

```js
/**
 * CL cmf.deficiency<X> — extracted (name-anchored) on 2026-05-17.
 * Round X modular refactor — see modular-prompts/33-v2-cmf-deficiency-resplit.md.
 * 33a: cmf/cmf-deficiency-ai  (runADAnalysis/runGPT4VAnalysis/getGPT4VPrompt)
 * 33b: cmf/cmf-deficiency     (detectDeficiencies/calculateRiskScore)
 * Depends on: cmf/cmf-search, cmf/cmf-ai (script-tag order). COL app-wide.
 */
(function(){ 'use strict';
  // ─── EXTRACTED CODE START (verbatim) ───
  // <paste the confirmed name-anchored block, unchanged>
  // ─── EXTRACTED CODE END ───
  window.CL = window.CL || {}; CL.cmf = CL.cmf || {};
  CL.cmf.deficiency<X> = CL.cmf.deficiency<X> || {};
  // 33a: window.runADAnalysis=runADAnalysis; window.runGPT4VAnalysis=…;
  //      window.getGPT4VPrompt=…  (+ CL.cmf.deficiencyAi.* mirrors)
  // 33b: window.detectDeficiencies=…; window.calculateRiskScore=…
  //      (+ CL.cmf.deficiency.* mirrors)
  CL._registerModule('cmf/cmf-deficiency<X>');
})();
```
All 5 anchors are onclick/callsite-bound (risk §3: 2/2/2/2/3 refs) → every one
needs its `window.<fn>` back-compat export. Path-style registration. Add
`CL.cmf` to `loader.js` ONLY if absent.

## §3 Wire the script tags
33a immediately AFTER `<script src="modules/cmf/cmf-ai.js"></script>`; 33b
immediately AFTER the 33a tag (LATE cluster):
```html
<script src="modules/cmf/cmf-deficiency-ai.js"></script>
<script src="modules/cmf/cmf-deficiency.js"></script>
```

## §4 Remove the original code (per sub-module)
**(Cowork sub-split decision must have cleared §0/§1 first.)**
```bash
sed -n '<BLK_START>,<BLK_END>p' app/index.html | head -5
sed -n '<BLK_START>,<BLK_END>p' app/index.html | tail -5
# Confirm the band contains ONLY this sub-module's anchors + nested helpers
# (re-scan the §0 awk over [BLK_START,BLK_END] — zero foreign tags), then delete.
```

## §5 Post-flight verification (per sub-module)
```bash
wc -l app/index.html            # ≈ N_LINES − (BLK_END−BLK_START+1)
grep -cE '^\s*(async\s+)?function ' app/index.html   # − moved-fn count
node --check app/modules/cmf/<sub-module>.js                          # pass
grep -nE 'function +(<this sub-module anchors>)\b' app/index.html      # 0
grep -c '<script src="modules/cmf/<sub-module>.js"></script>' app/index.html  # 1
git diff --stat                 # ONLY app/index.html + the new module
```
Console: `[CL] Module loaded: cmf/cmf-deficiency-ai` (33a) /
`cmf/cmf-deficiency` (33b).

## §6 Functional smoke test
```bash
playwright-cli open https://ecomhub200.github.io/Federal/app/
playwright-cli snapshot ; playwright-cli console      # NO new errors
```
Exercise the CMF deficiency / AD-analysis flow (run an AD/GPT4V analysis;
deficiency detection + risk score render). `typeof window.runADAnalysis ===
'function'` and `typeof window.detectDeficiencies === 'function'`.
`playwright-cli close`.

## §7 Rollback (per sub-module)
```bash
git checkout -- app/index.html && rm app/modules/cmf/<sub-module>.js
```

## §8 Out of scope
Renames/reformatting; dragging Analysis/Grants/CMF foreign decls; other
modules; off-limits modules; CLAUDE.md edits; PR unless asked.

---
### Prerequisite & ordering
- **Gated by prompts 31 (cmf-search) → 32 (cmf-ai)** (§0 check #4 double gate).
- Even after 31/32: **do NOT auto-run** — requires the human 33a/33b sub-split
  decision first (§1 Cowork pause). Sequence **after** the 20→21→22 chain.
