# Batch Progress Dashboard

> Snapshot 2026-05-17 (CC Session L). Source of truth:
> `REMAINING_WORK_INVENTORY.md`. Bars count numbered prompts whose
> module is shipped & wired (DONE). RETIRED counts as resolved;
> SUPERSEDED rolls into its `-v2`/split replacement.

## Line-count burn-down

```
159,387  ███████████████████████████████  original
153,085  █████████████████████████████░░  spatial batch
151,729  █████████████████████████████░░  + geo-tier (p25)
149,314  ████████████████████████████░░░  Session H baseline
146,633  ███████████████████████████░░░░  CURRENT  (−12,754, 8.0%)
 30,000  ██████░░░░░░░░░░░░░░░░░░░░░░░░░  TARGET (<30k)
```

## Per-area progress

```
spatial          ███████████████  7/7   COMPLETE
warrants         ███████████████  3/3   COMPLETE
assets           ███████████████  3/3   COMPLETE
scorecard        ███████████████  3/3   COMPLETE (1 coord. module)
core             ███████████████  2/2   COMPLETE
map              █████████░░░░░░  3/6   35 inline · 37-v2 verify · 38 RETIRED
grants           ████░░░░░░░░░░░  1/4   27/28/29 never ran
ai               ███░░░░░░░░░░░░  1/5   40c1-3 inline · 41 skipped
reports          ██░░░░░░░░░░░░░  1/8   42b2/42b3 READY · 43 blocked
app/tabs         ██░░░░░░░░░░░░░  1/6   15-18 inline · 46 blocked
cmf              ░░░░░░░░░░░░░░░  0/3   31/32 READY · 33-v2 gated
analysis         ░░░░░░░░░░░░░░░  0/1   19 skipped (needs resolution)
crash-tree       ░░░░░░░░░░░░░░░  0/1   20-v2 blocked on 19
fatal-speeding   ░░░░░░░░░░░░░░░  0/1   21-v2 blocked on 20-v2
safety           ░░░░░░░░░░░░░░░  0/1   22-v2 blocked on 21-v2
data             ░░░░░░░░░░░░░░░  0/1   44-v2 READY
```

## Session M expected delta

```
44-v2  data/dashboard-filter-bindings   ~691 LOC   READY (no gate)
42b2   reports/reports-pdf              ~500-700   READY (42b1 ✓)  🔴 supervised
42b3   reports/reports-charts           ~66        gated → 42b2
31     cmf/cmf-search                   ≥500       READY (grants-ui ✓) 🔴 large/split
32     cmf/cmf-ai                       ~354       gated → 31
                                        ─────────
            projected reduction:        ≈1,700-2,200 lines
            app/index.html after M:     ≈144,400-145,000 lines
```

## Pipeline health

```
READY now ............ 44-v2, 42b2, 42b3*, 31, 32*      (*queue-gated)
BLOCKED (resolution) .. 19, 41, 43, 46
BLOCKED (chain) ....... 20-v2 → 21-v2 → 22-v2, 33-v2
INLINE (not started) .. 15,16,17,18, 27,28,29, 37-v2,
                         40c1-3, 42c1-3, 42d
DEFERRED .............. STAGE_A_01-54 (post-IIFE-round, 1 cutover)
```

**Next bottleneck:** the `19 → 20-v2 → 21-v2 → 22-v2` chain. Authoring
the prompt-19 re-anchor resolution doc unblocks four prompts at once and
should head the Session N backlog (alongside 41/43/46 resolution docs).
