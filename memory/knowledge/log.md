# Build Log

## [2026-04-19T12:30:00-04:00] compile | Daily Log 2026-04-19 (initial seed)
- Source: daily/2026-04-19.md
- Articles created:
  - [[concepts/state-management]]
  - [[concepts/epdo-weights]]
  - [[concepts/dot-neutral-naming]]
  - [[concepts/module-architecture]]
- Articles updated: (none)
- Notes: manual seed from CLAUDE.md canonical sections; future compiles
  should prefer updating these articles over creating near-duplicates.

## [2026-04-19T13:00:00-04:00] compile | Daily Log 2026-04-19 (seed batch 2)
- Source: daily/2026-04-19.md
- Articles created:
  - [[concepts/stripe-payment-flow]]
  - [[concepts/ai-context-awareness]]
  - [[concepts/state-onboarding]]
  - [[concepts/coolify-deployment]]
  - [[connections/state-scope-and-ai-context]]
- Articles updated:
  - [[concepts/state-management]] — added cross-links to
    `dot-neutral-naming` (from structural lint)
  - [[concepts/epdo-weights]] — added cross-link to `module-architecture`
  - [[concepts/dot-neutral-naming]] — added cross-link to `epdo-weights`
- Notes: batch 2 completes the CLAUDE.md-derived core. Subsequent work
  should come from real daily logs; prefer updating these articles over
  creating new near-duplicates.

## [2026-04-19T13:45:00-04:00] compile | Daily Log 2026-04-19 (seed batch 3)
- Source: daily/2026-04-19.md
- Articles created:
  - [[concepts/grants-ranking]]
  - [[concepts/warrants-analysis]]
  - [[concepts/batch-before-after]]
  - [[concepts/safety-focus]]
  - [[concepts/hotspots]]
  - [[concepts/firebase-auth]]
  - [[concepts/r2-storage-paths]]
  - [[concepts/upload-pipeline]]
  - [[concepts/crash-profile-shapes]]
  - [[connections/epdo-across-tabs]]
  - [[connections/module-namespace-vs-legacy-state]]
- Articles updated:
  - [[concepts/state-management]], [[concepts/epdo-weights]],
    [[concepts/dot-neutral-naming]], [[concepts/module-architecture]],
    [[concepts/ai-context-awareness]], [[concepts/state-onboarding]],
    [[concepts/stripe-payment-flow]], [[concepts/coolify-deployment]]
    — added reverse links so structural linter has no missing-
    backlink suggestions.
- Notes: batch 3 covers every analysis tab (Hotspots, Grants, Warrants,
  Batch B/A, Safety Focus), the auth + upload + R2 platform layer, the
  `build*CrashProfile` naming convention, and two connection articles
  (EPDO parity, namespace split). 17 concept + 3 connection articles
  total.
