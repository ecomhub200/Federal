# Knowledge Base Index

| Article | Summary | Compiled From | Updated |
|---------|---------|---------------|---------|
| [[concepts/state-management]] | Global state objects (`crashState`, `cmfState`, `selectionState`, ...), cross-tab data flow, AI context priority | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/epdo-weights]] | FHWA 2025 EPDO weights (K=883, A=94, B=21, C=11, O=1) and the shared `calcEPDO()` helper | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/dot-neutral-naming]] | DOT-neutral column names and SYSTEM values required for multi-state data; `VSP` and JS var names excluded | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/module-architecture]] | `CL` namespace conventions, module registration, 500-line cap, global wrapper pattern for inline HTML handlers | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/stripe-payment-flow]] | Stripe Checkout redirect flow, server endpoints, webhook → Firestore truth, Coolify env wiring | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/ai-context-awareness]] | `getAIAnalysisContext()` priority order, cross-tab selection channel, `updateAIContextIndicator()`, crash-profile builders | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/state-onboarding]] | 10-step checklist for adding a new state, required onboarding-doc sections, normalizer contract, protected Colorado/Virginia pipelines | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/coolify-deployment]] | Single-container topology (Nginx + Node under supervisord), env-var → `api-keys.json` flow, client-safe vs secret split | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/grants-ranking]] | Grants tab ranking pipeline, EPDO per location, optional pre-rank date filter, cross-tab jump contract | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/warrants-analysis]] | MUTCD signal warrant evaluation (esp. Warrant 7), location+date scope, required 12-month windows | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/batch-before-after]] | Batch B/A tab architecture, 10 sub-modules, observational B/A math, subcategory filter rules | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/safety-focus]] | Per-category crash rollups (pedestrian, bicycle, night-time, teen driver, ...), category predicates, lazy cache | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/hotspots]] | Route-level ranking from `crashState.aggregates.byRoute`, no date filter, fast sort-render pipeline | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/firebase-auth]] | `CrashLensAuth` surface, Google + Email/Password, Firestore user-doc shape, pending-checkout pattern | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/r2-storage-paths]] | `crash-lens-data` bucket hierarchy, tier-aware path router, file-key ledger naming, write-through-server rule | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/upload-pipeline]] | Upload tab sub-modules, tier-aware destinations, server-mediated writes, corrections ledger | daily/2026-04-19.md | 2026-04-19 |
| [[concepts/crash-profile-shapes]] | The four `build*CrashProfile` helpers, minimum vs detailed shapes, naming collision warning | daily/2026-04-19.md | 2026-04-19 |
| [[connections/state-scope-and-ai-context]] | Why the AI resolver reads *through* state objects, the update-state + update-indicator pairing, scope linearization via priority | daily/2026-04-19.md | 2026-04-19 |
| [[connections/epdo-across-tabs]] | EPDO parity invariants across Hotspots / Grants / CMF / Batch B/A / AI resolver | daily/2026-04-19.md | 2026-04-19 |
| [[connections/module-namespace-vs-legacy-state]] | `CL.*` behavior vs top-level mutable state; why the split is deliberate; future refactor path | daily/2026-04-19.md | 2026-04-19 |
