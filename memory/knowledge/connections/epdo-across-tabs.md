---
title: "Connection: EPDO Across Tabs"
connects:
  - "concepts/epdo-weights"
  - "concepts/hotspots"
  - "concepts/grants-ranking"
  - "concepts/batch-before-after"
  - "concepts/crash-profile-shapes"
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Connection: EPDO Across Tabs

## The Connection

EPDO (equivalent property damage only) is computed in many different
places — the Hotspots aggregate, the Grants ranking pipeline, the CMF
tab's filtered profile, the Batch Before/After results, even the AI
resolver's fallback. For any of the cross-tab workflows to be
defensible ("the EPDO the user sees on the Grants row is the same EPDO
the AI tab quotes"), every one of those sites must use the same
weights, the same `calcEPDO` helper, and the same severity keys.

## Key Insight

**EPDO is the one number that's supposed to be comparable across every
tab.** If a user ranks hotspots, drills into Grants, jumps to the Map,
and then asks the AI, the reported EPDO must not change. That parity
holds *only* if three invariants are maintained:

1. **Single source of weights.** `EPDO_WEIGHTS = { K: 883, A: 94, B: 21,
   C: 11, O: 1 }` is declared exactly once (in `CL.core` constants) and
   imported everywhere. See [[concepts/epdo-weights]].
2. **Single helper.** Every site that computes EPDO calls `calcEPDO(sev)`
   — no inline dot-products, no shortcut sums that skip a severity
   class.
3. **Consistent severity input.** The severity object fed to `calcEPDO`
   must come from a [[concepts/crash-profile-shapes]] builder or the
   `aggregates.byRoute` rollup, both of which guarantee KABCO keys and
   numeric values.

Breaking any one of those invariants makes two tabs disagree about a
location's EPDO, which is a credibility bug — once spotted by a user,
the whole tool looks unreliable.

## Evidence

- **Hotspots reads `crashState.aggregates.byRoute[...].epdo`** — that
  number was produced by `calcEPDO` at aggregate-build time. See
  [[concepts/hotspots]].
- **Grants computes EPDO fresh per location** via `calcEPDO` during
  the ranking pass. Optional pre-rank date filter can legitimately
  change the EPDO relative to Hotspots — that's a *scope* difference,
  not a methodology difference. See [[concepts/grants-ranking]].
- **Batch Before/After** computes EPDO separately for the before and
  after windows per location, then reports the delta. Same weights,
  same helper. See [[concepts/batch-before-after]].
- **AI resolver** carries EPDO on the `crashProfile` returned from
  `buildLocationCrashProfile` or `buildCountyWideCrashProfile`. See
  [[concepts/ai-context-awareness]] and
  [[concepts/crash-profile-shapes]].

## Implications

- **Changing the weights** (e.g. migrating to a later FHWA publication)
  is a project-wide change: invalidate cached aggregates, regenerate
  `grantState.allRankedLocations`, re-run any saved B/A reports. A
  daily log must record the date and rationale of the change.
- **Allowing a second EPDO helper** — even a "just for this tab" one —
  is how the tabs silently diverge. Extend `calcEPDO` with an optional
  weights parameter if a tab genuinely needs a different schedule (very
  rare), but default to the canonical weights.
- **Adding a new tab that ranks by severity** should pull the aggregate
  or call the existing builders; it should not re-derive severity
  weights.
- **Per-state weight overrides** are in scope for the ranking config
  ([[concepts/state-onboarding]]), but in practice every state
  currently uses the FHWA 2025 set.

## Related Concepts

- [[concepts/epdo-weights]]
- [[concepts/hotspots]]
- [[concepts/grants-ranking]]
- [[concepts/batch-before-after]]
- [[concepts/crash-profile-shapes]]
- [[concepts/ai-context-awareness]] — every AI answer quotes an EPDO
  from one of these pipelines
