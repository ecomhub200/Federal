# Prompt 28-v2 verification (Day 2 Lane 2)

**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
**Date:** 2026-05-17
**Prompt:** `modular-prompts/28-v2-grants-ai.md` (3-child re-split, AI-app-gen band only)
**Live file:** `app/index.html` = 142,804 lines (prompt snapshot 145,624 → Δ ≈ +7 in this band)

## Per-anchor status

- Band START `// AI-POWERED FULL APPLICATION GENERATION`: **FOUND @ 35596** (prompt ~35588)
- Anchor `generateFullApplicationContent`: **FOUND @ 35598** (prompt @35591)
- Anchor `exportAppWord`: **FOUND @ 37042** (prompt @37035)
- Band END `// AI COUNTERMEASURE ASSISTANT - SYSTEM PROMPT`: **FOUND @ 37048**
  (the prompt's `// AI COUNTERMEASURE ASSISTANT` ~L37040; full divider title differs but is the correct band terminator)
- BLK_START: **35596**
- BLK_END: **37047** (line before the AI COUNTERMEASURE ASSISTANT divider)
- **Parent LOC: 35596 → 37047 = 1,452** (matches task estimate exactly)

## Per-child status — band fn enumeration (35596–37047)

| Line | Symbol |
|---|---|
| 35596 | `// AI-POWERED FULL APPLICATION GENERATION` (divider) |
| 35598 | `async function generateFullApplicationContent(location, isMulti, locationNames)` |
| 35712 | `async function downloadFullApplicationPDF()` |
| 36252 | `async function downloadFullApplicationWord()` |
| 36816 | `function exportAppPDF()` |
| 37042 | `function exportAppWord()` |

Gross single-fn spans (no intervening top-level fn or `// [A-Z]` divider):

| Fn | Span | ≈LOC | ≤500? |
|---|---|---|---|
| `generateFullApplicationContent` | 35598→35712 | ~114 | ✓ |
| `downloadFullApplicationPDF` | 35712→36252 | **~540** | ✗ over ceiling |
| `downloadFullApplicationWord` | 36252→36816 | **~564** | ✗ over ceiling |
| `exportAppPDF` | 36816→37042 | ~226 | ✓ |
| `exportAppWord` | 37042→37047 | ~6 | ✓ |

- Load-after anchor `<script src="modules/grants/grants-ui.js"></script>`: **FOUND, count = 1** ✓
- Target `app/modules/grants/grants-ai-*.js`: **ABSENT** ✓

## Verdict

**STATUS: YELLOW** (anchors GREEN; child ≤500 split caveat)

All parent anchors FOUND, band contiguous, LOC matches estimate exactly
(1,452). **However** the prompt's planned 3×~485 child split is **not
cleanly achievable**: `downloadFullApplicationPDF` (~540) and
`downloadFullApplicationWord` (~564) each appear to be a **single function
over the 500 ceiling**.

## Required edits before Session V runs

1. **Brace-verify** `downloadFullApplicationPDF`@35712 and
   `downloadFullApplicationWord`@36252. If each is one indivisible function
   > 500 lines (as the gross spans strongly indicate):
2. Apply the documented **oversized-fn size-exception precedent**
   (`assets/transit-tab`, `reports/reports-pdf`) — a child file may exceed
   500 lines when it wraps one indivisible function. Document the exception
   in `MODULAR_PLAN.md` and the module header, as prior sessions did.
3. **Re-derive the §1 child table.** A workable cut respecting fn boundaries:
   - 28a `grants-ai-generate`: 35596 → before 35712
     (`generateFullApplicationContent`, ~116) — small but clean.
   - 28b `grants-ai-pdf` (size-exception): 35712 → before 36252
     (`downloadFullApplicationPDF`, ~540).
   - 28c `grants-ai-word-export` (size-exception): 36252 → 37047
     (`downloadFullApplicationWord` + `exportAppPDF` + `exportAppWord`,
     ~795 — or split into 28c/28d at `exportAppPDF`@36816 to keep the
     Word fn isolated).
   Session V decides final boundaries by brace read; the 3-child count in
   the prompt header may become 3–4.
- This is **runnable, not blocked** — anchors valid, band contiguous.
- **Re-derive against latest `main`** — starting point only.
