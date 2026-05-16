# Stage A — IIFE → ESM Conversion Template

The canonical, byte-discipline transformation every `STAGE_A_*` per-module
prompt applies. **No behavior change.** Only module syntax + exposure
change.

## BEFORE — current IIFE + dual-exposure pattern

```js
(function () {
  'use strict';

  function foo() { return 42; }
  function bar() { return foo() * CL.core.epdo.weight('K'); }
  const PRIVATE = 7;                 // module-private, never exposed

  // legacy globals
  window.foo = foo;                  // used by HTML onclick="foo()"
  window.bar = bar;                  // NOT in onclick set — internal only

  // namespace exposure
  window.CL = window.CL || {};
  CL.area = CL.area || {};
  CL.area.foo = foo;
  CL.area.bar = bar;

  CL._registerModule('area/file');
})();
```

## AFTER — native ES Module

```js
'use strict';

import { weight } from '../core/epdo.js';   // was CL.core.epdo.weight (xdep)

export function foo() { return 42; }
export function bar() { return foo() * weight('K'); }
const PRIVATE = 7;                            // stays module-private

// --- Transitional CL.* namespace (kept one round; stripped in Stage A-cleanup) ---
window.CL = window.CL || {};
CL.area = CL.area || {};
CL.area.foo = foo;
CL.area.bar = bar;

// --- Legacy global exposure for HTML onclick= (see STAGE_A_ONCLICK_API.md) ---
window.foo = foo;          // KEEP: in onclick survivor set
// window.bar removed:     NOT in onclick set — consumers import { bar }

CL._registerModule('area/file');   // keep — load tracker still useful
```

## Transformation rules (apply in this order)

1. **Unwrap the IIFE.** Delete the opening
   `(function () {` / `(function(){` and the closing `})();`. De-indent
   the body by one level (whitespace-only; do not reflow code).
2. **Keep `'use strict';`** at the top (ESM is implicitly strict, but
   keeping the line is a zero-risk no-op and preserves byte intent).
3. **`export` the public API.** For every `function name() {}` or
   `const name = …` that was assigned to `CL.area.*` or `window.*`,
   prefix `export `. Do **not** export module-private helpers.
   - Equivalent: keep declarations, add one
     `export { foo, bar };` block — either style is acceptable, be
     consistent within the file.
4. **Rewrite cross-module reads as imports.** For each cross-module
   `CL.<root>.<member>` this file *reads* (per
   `STAGE_A_IMPORT_GRAPH.md`), add a top-of-file
   `import { member } from '<relative>/<file>.js';` and replace the
   `CL.x.y` reference with the bare imported name.
   - Intra-feature reads (e.g. `batch-ba/charts` → `batch-ba/state`)
     import from sibling files: `import { state } from './batch-ba-state.js';`
   - **Never** drop the trailing `.js` — browsers do not add it.
   - Relative specifier only (`./`, `../`). No bare specifiers (no
     bundler in Stage A).
5. **`window.*` triage** (see `STAGE_A_ONCLICK_API.md`):
   - In survivor set → keep one `window.X = X;` under the legacy comment
     block at the bottom.
   - Not in survivor set → delete the `window.X = X;` line.
6. **`CL.*` exposure stays — transitionally.** Keep the
   `CL.area = CL.area || {}; CL.area.X = X;` writes. Inline code still in
   `app/index.html` and not-yet-converted siblings may read them during
   the single cutover. They are stripped in a later Stage A-cleanup round,
   not here.
7. **Keep `CL._registerModule('area/file');`** — the
   `[CL] Module loaded:` tracker remains the cheapest post-flight signal.
8. **`window.CL = window.CL || {};`** — keep this guard in any module that
   writes `CL.*` (import order means the module may run before inline
   code; `loader.js` still creates the keys but the guard is harmless and
   preserves resilience).

## Hard "do NOT" list

- ❌ No reformatting, renaming, comment rewrites, or "while we're here"
  cleanups. Byte-for-byte except the mechanical changes above.
- ❌ No `import`/`export` of anything not already a cross-module
  dependency or public member.
- ❌ No bare-specifier imports, no import maps, no `.mjs` rename.
- ❌ No converting `onclick=` → `addEventListener` (separate later round).
- ❌ No touching `app/index.html` except (a) the final cutover prompt's
  script-tag swap and (b) the `csv-worker.js` `{ type: 'module' }` edit.
- ❌ No moving app-wide shared globals still read by remaining inline
  code — keep their `window` mirror.

## Special-case templates

### `loader.js` (namespace root — side-effect module)

```js
// AFTER: no exports needed; pure side effect. main.js does
//   import './modules/loader.js';   // first, before any other module
window.CL = window.CL || {};
CL.app = CL.app || {};
/* …all existing namespace keys, unchanged… */
CL._loaded = [];
CL._registerModule = function (name) {
  CL._loaded.push({ name, time: new Date().toISOString() });
  console.log('[CL] Module loaded:', name);
};
// window.CL stays — inline index.html code still reads CL.*
```

### `worker/csv-worker.js` (Web Worker)

- The worker file: convert to ESM only if it `import`s deps; otherwise it
  may stay classic. If converted, the **consumer** edit is mandatory:
  ```js
  // app/index.html:30324  (the one allowed non-script-tag index edit)
  const worker = new Worker('modules/worker/csv-worker.js', { type: 'module' });
  ```
- Worker ESM uses `self.onmessage` / `self.postMessage` as today; any
  shared helper becomes `import { … } from './<file>.js'` resolved
  relative to the worker file.

## Per-file post-flight (every prompt §3)

- `node --check <file>` passes (catches stray IIFE braces / bad import).
- File served as `text/javascript` (GitHub Pages ✓, nginx `mime.types` ✓)
  — never `file://`.
- Browser console: no `Unexpected token 'export'`, no
  `Failed to resolve module specifier`, no `does not provide an export
  named …`.
- `[CL] Module loaded: area/file` still prints.
- Any onclick this module owns still fires (manual click in Playwright
  smoke).
