# Superseded Extraction Prompts

Append-only ledger of `modular-prompts/*.md` prompts that have been replaced
by a newer prompt. One entry per line-group. Do **not** delete superseded
prompt files — this ledger is the authoritative "do not run" list.

Format:

```
<old prompt>  →  SUPERSEDED BY  <new prompt>  (<session/date>)
  reason: <one-line why>
```

---

`44-data-filter-wiring.md`  →  SUPERSEDED BY  `44-v2-iife-wholesale.md`  (Session I, 2026-05-17)
  reason: the 5 target anchors (`_r18ApplyDashboardYearFilter`,
  `_r18ReloadHotspots`, `_r19LoadSafetyCategoriesWithFilter`,
  `_bindFilterInputs`, `_restoreFilterInputs`) are NOT a standalone block —
  they live inside one shared `(function(){'use strict';…})()` IIFE
  (Session-I snapshot L148182–L148874, 693 lines, 14 inner functions +
  closure-private `_trafficCtrlCache`; re-derive by function-name anchor,
  the line range drifts). Isolated extraction would break closure
  semantics. 44-v2 extracts the entire IIFE verbatim as
  `app/modules/data/dashboard-filter-bindings.js`. After 44-v2 runs and
  verifies green, prompt 44 is COMPLETE — do NOT run
  `44-data-filter-wiring.md`. See
  `MODULAR_PLAN_44_v2_IIFE_WHOLESALE_PLAN.md`.

---

> Note: prompts `40-ai-ai-mode.md` and `42-reports-reports-standard.md` are
> also "do not run" but are tracked in `CLAUDE.md` / `MODULAR_PLAN.md`
> (navigateTo split round), not here, because they were redirected to a
> chain of replacements rather than a single 1:1 supersession.
