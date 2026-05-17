# Day 2 · Lane 4 — Phase 4 Survey Rollup & Refined Plan

Reference: commit `9be31e5` · `app/index.html` @ 142,804 LOC · 2026-05-17
Branch: `claude/survey-index-html-blocks-frYmc` (see `LANE4_REFERENCE.md`)

## Headline

Phase 4 was scoped on an assumed **~25,000 LOC** of remaining large inline
blocks (8K filter + 12K map + 5K settings/auth). The live-file survey finds
only **~1,336 LOC of genuine ≥150 blocks** plus a long sub-150 tail. The big
inline veins were already mined by the 139 existing prompts / 69 modules.
**Phase 4 collapses from ~4 sessions to 1–2.**

## Rollup

| Survey | Genuine ≥150 LOC | Blocks | False-pos / covered | Orig. estimate | Verdict |
|---|---|---|---|---|---|
| A — Filter wiring | 432 | 2 | 1 (`dashboard-filter-bindings.js`) | ~8,000 | 1 small block + email cluster (folds to C) |
| B — Map orchestration | 0 | 0 | ~7 covered by prompts 35/37/38 + 4 extracted modules | ~12,000 | No session; fold ~260 LOC residue into prompt 35 |
| C — Settings/auth/admin | 904 | 2 | 0 (auth lives in protected `assets/js/`) | ~5,000 | One real batch (email + account); no auth work |
| **Total** | **~1,336** | **4** (3 after A2↔C1 merge) | — | **~25,000** | **~18× overstated** |

## Cross-survey insights (dedup & merges)

1. **Email-notification domain spans Survey A & C and is physically adjacent.**
   `openEmailNotificationModal` (L32370–33067, 698) + email-chip cluster
   (L33353–33604, 252), ~285-line gap likely more email helpers → one coherent
   **~950–1,235 LOC `settings/email-notifications.js`**. Counted once, not
   twice.
2. **`getFilteredMapPoints` / `toggleQuickFilter` appear in BOTH A & B.** They
   are map-local filters → assigned to Survey B (map cluster), deduped out of
   filter-wiring.
3. **`getFilteredMapPoints` line numbers disagree between agents** (L44431 vs
   L46833). INDEX_MAP-style range trust is unsafe; the authoring session must
   re-anchor by function name in the live file.
4. **Auth is not inline at all** — zero Phase-4 auth work.

## Refined Phase-4 plan (replaces the 4-session roadmap)

**Session W — Settings / email (the only substantial batch)**
- `settings/email-notifications.js` — `openEmailNotificationModal` +
  email-chip cluster (+ gap helpers) ≈ 950–1,235 LOC. Needs sub-split or an
  oversized-exception (Q2).
- `settings/account-profile.js` — `populateAccountModal` (206 LOC), clean lift.

**Session X — Filter/map tail (small, optional)**
- `analysis/filter-aggregation.js` — `getFilteredStats` (180 LOC), clean
  reducer lift.
- Map-filters residue (~260–280 LOC, sub-150 each): fold into a prompt-35
  revision or one micro-prompt `map/map-filters.js`. Re-anchor
  `getFilteredMapPoints` by name.

**Session Z — HTML template strings** *(unchanged; out of this survey's
scope)* — still needs a Murad design discussion before authoring.

Dropped from the roadmap: the dedicated "supervised map orchestration" session
and any "auth" session — neither has genuine ≥150 inline work.

## Outstanding questions for Murad

1. **Bar height.** ≥150 yields only ~1.3K genuine LOC. Lower the bar to ~80 LOC
   to mop up the ~2,500 LOC filter tail + 72+ settings helpers, or leave all
   sub-150 inline for Stage A (ESM migration) to absorb wholesale?
2. **Oversized email module.** `openEmailNotificationModal` is a single 698-LOC
   function. Oversized-exception (transit-tab / reports-pdf precedent) or force
   a 2-way split?
3. **Auth.** Confirmed already in protected `assets/js/` — OK to delete "auth"
   from the Phase-4 roadmap entirely?
4. **Map.** Accept prompts 34–39 + a micro map-filters fold-in as sufficient
   and cancel the dedicated supervised map session?
5. **HTML template strings.** Extract as `.html.js` partials now, or defer the
   whole class to Stage A?

## Disposition for Day 3 Lane 3 (prompt authoring)

- Author **2 prompts** (`settings/email-notifications`,
  `settings/account-profile`) — high confidence, line ranges verified at
  reference commit.
- Author **1 small prompt** (`analysis/filter-aggregation`) — high confidence.
- **Defer** the map-filters fold-in pending Murad Q4; if approved, revise
  prompt 35 rather than author a new session.
- **Block** on Murad Q1/Q2/Q5 before scoping anything beyond the above.
