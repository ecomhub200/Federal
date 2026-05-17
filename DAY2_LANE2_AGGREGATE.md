# Day 2 Lane 2 — v2 verification aggregate

**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
**Date:** 2026-05-17
**Live file:** `app/index.html` = 142,804 lines, 2,216 `function` decls
**Branch:** `claude/verify-anchor-v2-prompts-BUf5p`

| Prompt | Status | Anchor line | LOC | Children verified | Recommended session |
|---|---|---|---|---|---|
| 18-v2 pedbike-tab | **GREEN** | `updatePedBikeTab`@58158 | 3,468 | 7/7 anchors found | **U** (supervised) |
| 27-v2 grants-rank | **GREEN** | `initGrantModule`@29883 | 2,149 | 5/5 anchors found | **V** |
| 28-v2 grants-ai | **YELLOW** | `generateFullApplicationContent`@35598 | 1,452 | 3/3 anchors found; ≤500 split caveat | **V** |
| 29-v2 grants-email | **YELLOW** | band `// EMAIL NOTIFICATION SYSTEM`@31821 | 3,652 | 7/7 anchors found; ≤500 split caveat | **V** (supervised) |

## Summary

- **0 RED** — no anchor is missing. Every parent + child anchor for all 4
  prompts was located against the reference commit.
- **2 GREEN** (18-v2, 27-v2) — clean: anchors found, bands contiguous, LOC
  matches task estimates exactly, no oversized-fn obstruction. 27-v2's 🔴
  tail-interleave (3 listeners) is verified cleanly separable.
- **2 YELLOW** (28-v2, 29-v2) — anchors and bands fully valid; the only
  caveat is that the planned ≤500-line child split is blocked by single
  oversized functions:
  - **28-v2:** `downloadFullApplicationPDF` (~540) +
    `downloadFullApplicationWord` (~564) → size-exception child(ren).
  - **29-v2:** `openEmailNotificationModal` (~701) → 29b size-exception.
  Both remain **runnable** with the documented oversized-fn precedent
  (`assets/transit-tab`, `reports/reports-pdf`); Session V re-derives the
  §1 child tables by brace read.

## Per-prompt drift (vs prompt's stale 145,624 snapshot)

Drift is **non-uniform across prompts** — do not cross-apply a single delta:

| Prompt band | Δ (live − prompt) |
|---|---|
| 18-v2 (pedbike) | ≈ −1067 |
| 27-v2 (grants engine) | ≈ +7 |
| 28-v2 (grants AI) | ≈ +7 |
| 29-v2 (grants email) | band-relative (START @31821) |

The v2 prompts' §0 blocks use **name/divider greps, not line ranges**, so
they self-correct for drift — no §0 snapshot edit is strictly required. The
§1 child line numbers are advisory sighting aids only.

## Reminder for Session U/V

**Re-derive against latest `main`.** Any parallel extraction lane (R+S+T or
later) will have shifted line numbers since reference commit
`9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`. The line ranges in this report
and the four `MODULAR_PLAN_PROMPT_*_VERIFY.md` files are a **verified
starting point, NOT authoritative** once the file changes further. Always
re-run the §0 name-anchor greps before extracting.

## Recommended scopes

- **Session U:** `18-v2` only (7-child pedbike, highest split risk in the
  GREEN set — supervised).
- **Session V:** the grants chain in order — `27-v2` (GREEN) → `28-v2`
  (YELLOW, size-exception) → `29-v2` (YELLOW, size-exception, supervised).
  29-v2 must run last (it absorbs 28-v2's stray email anchors).
