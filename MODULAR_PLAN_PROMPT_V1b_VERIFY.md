# V1b verification (Lane D, Round 1)
**Reference commit:** 6f1f9050bae68e65930fd4ee78cc7cad891a6250
**Branch:** claude/verify-round-2-anchors-dg8rJ
**Candidate:** V1b (grants-rank-scoring)
**Anchor:** `computeGrantScore` / `applyGrantWeights` — MISSING (0 matches)
**BLK_START → BLK_END:** N/A (anchor missing)
**LOC:** N/A
**Target free:** N/A (anchor missing)
**Status:** RED

**Context for Lane E (NOT a substitute anchor — do not auto-prompt against these):**
Grant scoring exists in `app/index.html` under different names:
- `calculateEnhancedGrantScore_legacy` — L30367
- `calculateGrantFitScores` — L30751
- `calculateImprovedGrantScore` — L30904
- `changeGrantScoringProfile` — L31516

Note: `app/modules/grants/ranking.js` and `app/modules/grants/grants-ui.js`
are already extracted (off-limits per CLAUDE.md). The scoring functions above
are still inline. Any V1b extraction must be re-derived by a real anchor from
the list above (and cross-checked against the off-limits grants modules to
avoid duplicate/clobbering names), not by the speculative
`computeGrantScore` / `applyGrantWeights` names.
