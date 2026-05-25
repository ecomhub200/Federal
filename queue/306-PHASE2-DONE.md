# Stage A v3 Phase 2 — COMPLETE (6 of 7 modules converted)

## Modules shipped (in chronological order)

| Phase | Module | Author commit | Merge PR | Merge commit |
|---|---|---|---|---|
| 2.1 | `utils/date-utils.js` | `ae355b3` | [#202](https://github.com/ecomhub200/Federal/pull/202) | `e53c328` |
| 2.2 | `analysis/crash-profile.js` | `64d2f65` | [#204](https://github.com/ecomhub200/Federal/pull/204) | `9988cb5` |
| 2.3 | `core/tier.js` | `6b559f1` | [#207](https://github.com/ecomhub200/Federal/pull/207) | `22b08df` |
| 2.4 | `core/epdo.js` | `6d611f5` | [#211](https://github.com/ecomhub200/Federal/pull/211) | `23a001d` |
| 2.5 | `analysis/baselines.js` | `655fd7e` | [#217](https://github.com/ecomhub200/Federal/pull/217) | `3b16939` |
| 2.6 | `core/epdo-presets.js` | `ca06969` | [#218](https://github.com/ecomhub200/Federal/pull/218) | `b9769f9` |

## Modules NOT converted

| Module | Reason |
|---|---|
| `core/constants.js` | 4 parse-time inline reads of `CL.core.constants.X` in `app/index.html` (L19179, L19181, L19239, L22160). ESM deferred-execution would crash boot because the module body executes after the inline `<script>` at the head of `app/index.html`. Permanent skip per CC 304 diagnostic blocker. |

## Prep commits

| Prep | Purpose | Commit | PR |
|---|---|---|---|
| Phase 1 pre-decl stub | seed `window.X` stubs for the names a later phase will own | `b9b4362` | [#201](https://github.com/ecomhub200/Federal/pull/201) |
| Phase 2-prep | rewrite 9 inline `let`/`const` → `var` so the names auto-attach to `window` from top-level classic-script scope | `f86e36f` | [#203](https://github.com/ecomhub200/Federal/pull/203) |
| Phase 2-prep-2 | explicit `window.crashState` / `window.jurisdictionContext` / `window.crashTreeState` mirrors (those identifiers were not previously global-attached) | `486f12d` | [#205](https://github.com/ecomhub200/Federal/pull/205) |
| Phase 2-prep-2.5 | explicit `window.CRASH_PATTERN_REGEX` exposure from inside the `grants-rank-score.js` IIFE (the `var` inside the IIFE was function-scoped, did NOT auto-attach to `window`) | `778ff39` | [#209](https://github.com/ecomhub200/Federal/pull/209) |

## Architecture as of Phase 2 close

- **Loader**: still classic-script `<script src="modules/loader.js">` — sets up the `window.CL` namespace + module-load tracker.
- **Module mix**: 6 ESM (`type="module"`) + ~47 classic-IIFE modules co-existing under the same `CL.*` namespace. The cross-talk surface is the global object: ESM modules read every shared global via `window.X` (deferred-execution, no shared lexical env with classic scripts), classic modules continue to use bare names (shared classic global lexical env).
- **HTML `onclick=` survival**: every public function from every converted module still has an explicit `window.X = X` mirror in its dual-exposure footer. Inline `onclick=` resolves against the global object, so this preserves back-compat for the ~25-fn onclick survivor set (`STAGE_A_ONCLICK_API.md`).
- **CL singletons**: `CL.data.client`, `CL.data.supabaseBridge`, `CL.data.mapBridge`, `CL.data.lazyLoader` are runtime-populated slots, NOT modules — Phase 2 left them untouched and they continue to work via `CL.data.X` reads from both classic and ESM contexts.
- **No bundler, no `.mjs`, no bare specifiers** — each ESM module is a single `<script type="module" src="modules/.../X.js">` tag with no `import`/`export` from sibling modules. Cross-module access continues to flow through `window.CL.*` exactly like the classic modules.

## EPDO preset propagation — the Phase 2.6 invariant

`app/modules/core/epdo-presets.js` reassigns `EPDO_WEIGHTS` and `EPDO_ACTIVE_PRESET` at 9 sites. The arity-1 wrapper at `app/index.html:26893`

```js
var calcEPDO = s => CL.core.epdo.calcEPDO(s, EPDO_WEIGHTS);
```

reads `EPDO_WEIGHTS` from the global object on every call. Phase 2.6 rewrote every reassignment in epdo-presets.js to `window.EPDO_WEIGHTS = ...` so the mutation reaches that wrapper. **If a future PR adds another reassignment site in this module, it MUST use `window.EPDO_WEIGHTS = ...`** — bare-name reassignment in module scope is a silent no-op against the global, and the EPDO tile freezes.

## Recommendation for Phase 3

**(a) Merge state as final architecture — RECOMMENDED.** 6 ESM modules + 47 classic-IIFE modules under one `CL.*` namespace is the steady-state design. The app is stable, fast, and state-agnostic-ready. No further Stage A work needed. The remaining classic modules (per `MODULAR_PLAN.md` off-limits list) all have shared-global coupling that would require coordinated prep work to convert cleanly, and the payoff is architecture nicety only — runtime behavior is identical.

(b) Plan a coupling-reduction round to convert more modules. Diagnostic §2.2 lists 9 modules with >2 bare reads of app-wide globals — converting any of those requires either (i) hoisting their globals into a singleton accessed via `window.X` and rewriting every reader (weeks of churn, no behavioral payoff), or (ii) a Stage A v4 cutover to a single `<script type="module">` entry point with explicit `import`/`export` between modules (the original Stage A v1/v2 plan; abandoned because of HTML `onclick=` coupling).

(c) Park Stage A entirely. "Classic + dual-exposure + 6 ESM" is the final architecture; remove `modular-prompts/STAGE_A_*` from the queue and close `STAGE_A_*.md` design docs as superseded.

**Cowork recommendation: (a) — adopt the partial-ESM hybrid as the final architecture. Move on to FEATURE_COMPLETE_PLAN Wave 1 (cross-cutting cleanups).**
