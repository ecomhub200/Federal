# Lane D — Round 1 Aggregate Report

**Reference commit:** 6f1f9050bae68e65930fd4ee78cc7cad891a6250
**Branch:** claude/verify-round-2-anchors-dg8rJ
**`app/index.html` size at reference:** 136,581 lines
**Method:** read-only `grep` for `function`/`const`/assignment patterns of
each expected anchor name. Line numbers will drift as Lanes A/B/C land —
all references are pinned to the reference commit above.

| Candidate | Status | Anchor | LOC | Notes |
|---|---|---|---|---|
| 18d | RED | `renderBikeDetail` / `bikeChartUpdate` — MISSING | N/A | Feature exists as `updateBikeDetailPanel` L54749, `initBikeDetailCharts` L55097, `renderBikeMonthlyHeatmap` L55242. Some pedbike already extracted. |
| 18e | RED | `pedbikeSharedFmt` / `pedbikeTableHelpers` — MISSING | N/A | No shared-helper block by these names; pedbike spread across discrete fns. |
| V1b | RED | `computeGrantScore` / `applyGrantWeights` — MISSING | N/A | Scoring exists as `calculateImprovedGrantScore` L30904, `calculateGrantFitScores` L30751, `calculateEnhancedGrantScore_legacy` L30367, `changeGrantScoringProfile` L31516. |
| W2 | RED | `renderFilterChips` / `updateFilterChipState` — MISSING | N/A | Closest: `renderMapFactorChips` L43356, email-chip set L33358+. No `app/modules/filters/` dir. |
| W3 | RED | `saveFilterToLocalStorage` / `restoreFilter` — MISSING | N/A | Closest: `saveFilterProfile` L21827 (single fn). No `app/modules/filters/` dir. |

## Output for Lane E

**All 5 Round 2 candidates are RED.** Every expected anchor name (10 total
across the 5 candidates) returned **0 matches** in `app/index.html` at the
reference commit.

Recommendation: **Lane E should NOT author any Round 2 prompt using these
speculative anchor names.** The underlying features for 18d and V1b do exist
inline (under the alternate names listed per-candidate and in the individual
`MODULAR_PLAN_PROMPT_<id>_VERIFY.md` files), so a Round 2 extraction for those
is *possible* but only after re-deriving a real function-name anchor by
reading the actual code — never by the names in this candidate list. 18e, W2,
and W3 do not correspond to any identifiable single extractable block under
the given (or near-variant) names; treat them as not-actionable until
re-scoped from source.

Per-candidate detail: see `MODULAR_PLAN_PROMPT_18d_VERIFY.md`,
`MODULAR_PLAN_PROMPT_18e_VERIFY.md`, `MODULAR_PLAN_PROMPT_V1b_VERIFY.md`,
`MODULAR_PLAN_PROMPT_W2_VERIFY.md`, `MODULAR_PLAN_PROMPT_W3_VERIFY.md`.
