---
title: "Modular Architecture (CL Namespace)"
aliases: [CL-namespace, module-conventions, app-modules]
tags: [architecture, conventions, frontend]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Modular Architecture (CL Namespace)

The crash-analysis app is a **modular SPA**, not a single monolithic HTML
file. HTML, CSS, and JS live in separate files; JavaScript is organized
into feature modules under `app/modules/`, all attached to the global
`window.CL` namespace. This is a hard rule — CLAUDE.md marks it MANDATORY.

## Key Points

- **Entry point:** `app/index.html` loads modules via `<script>` tags.
  `app/modules/loader.js` runs first; feature modules follow.
- **Namespace:** every module attaches under `window.CL`, typically as
  `CL.<feature>.<subModule>`.
- **Registration:** every module ends with
  `CL._registerModule('feature/name')` so the loader can track what's
  loaded.
- **Directory layout:** `app/modules/{feature}/{feature}-{submodule}.js`.
- **File size cap:** ~500 lines per module; split larger features into
  `-state.js`, `-engine.js`, `-ui.js`, `-export.js`.
- **No duplicate function names** anywhere on the global scope — JS
  hoisting silently overwrites. Prefix feature abbreviations onto globals
  (e.g. `startBatchBAProcessing`, not `start`).
- **No inline `<style>` blocks or large inline `<script>`** in HTML
  files; always extract to a module file.

## Details

### Namespace pattern (mandatory boilerplate)

```javascript
window.CL = window.CL || {};
CL.featureName = CL.featureName || {};
CL.featureName.subModule = {
  // public functions go here
};
CL._registerModule('featureName/subModule');
```

### Global wrappers for inline HTML handlers

`onclick="..."` attributes run in the global scope and cannot call
`CL.foo.bar()` reliably across browsers and bundlers. Create a thin
global wrapper at the bottom of the module file or in `index.html`:

```javascript
// inside module
CL.batchBA.startProcessing = function () { /* ... */ };

// global wrapper
function startBatchBAProcessing() { CL.batchBA.startProcessing(); }
```

### Existing module map

| Namespace    | Directory                 | Purpose                              |
|--------------|---------------------------|--------------------------------------|
| `CL.core`    | `app/modules/core/`       | Constants (`COL`, `EPDO_WEIGHTS`)    |
| `CL.analysis`| `app/modules/analysis/`   | Crash profiles, baselines, hotspots  |
| `CL.warrants`| `app/modules/warrants/`   | Signal warrant analysis              |
| `CL.grants`  | `app/modules/grants/`     | Grant ranking                        |
| `CL.ai`      | `app/modules/ai/`         | AI context awareness                 |
| `CL.upload`  | `app/modules/upload/`     | Data upload pipeline, R2             |
| `CL.utils`   | `app/modules/utils/`      | Shared date/number helpers           |
| `CL.batchBA` | `app/modules/batch-ba/`   | Batch Before/After evaluation        |

### Where state objects fit

The state globals described in [[concepts/state-management]]
(`crashState`, `cmfState`, etc.) are currently top-level window
properties, **not** under `CL.*`. That's legacy; new state objects for
new features should either:

1. Be attached under their feature namespace (`CL.batchBA.state = {...}`),
   or
2. Continue the top-level pattern *only* if the feature crosses multiple
   modules and every module genuinely needs direct access.

### Refactoring expectations

- When modifying a monolithic section of legacy code, actively split it
  into proper modules where it's practical in the scope of your change.
- Shared utilities, constants, and helpers live in dedicated shared
  modules (e.g. `app/modules/core/constants.js`,
  `app/modules/utils/date-utils.js`).
- CSS follows the same rule — organize by component/feature
  (`app/css/map.css`, `app/css/dashboard.css`), not one giant stylesheet.

## Common Pitfalls

- Creating a second module with the same `CL.foo.bar` function — silent
  overwrite; one of them stops working.
- Forgetting `CL._registerModule(...)` — the module still runs, but the
  loader can't report it.
- Putting server-only logic in a client module (API keys, secrets). Those
  belong in `server/qdrant-proxy.js`; client modules may only read keys
  from `config/api-keys.json`.

## Related Concepts

- [[concepts/state-management]] — state objects consumed by almost every
  module
- [[concepts/epdo-weights]] — lives under `CL.core` constants
- [[concepts/dot-neutral-naming]] — column constants (`COL.*`) live in
  `CL.core.constants`

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  the "Modular Architecture (MANDATORY)" and "Module Conventions"
  sections of CLAUDE.md
