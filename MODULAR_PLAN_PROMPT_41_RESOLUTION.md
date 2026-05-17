# Prompt 41 (`ai/ai-domain-knowledge.js`) — SKIPPED (Session G)

**Date:** 2026-05-17
**Session:** G — Prerequisites batch
**Outcome:** SKIPPED at §0 (anchor unisolable / every spec locator invalid).
Batch continues with prompt 19 (skip-then-continue rule).

## Why skipped

Every spec-provided way to locate the block for prompt 41 is invalid in the
current `app/index.html` (149,314 lines):

| Spec locator | Value in prompt / Session G header | Reality |
|---|---|---|
| Prompt §0 anchor | literal placeholder `(domain knowledge fns)` | never resolved — not a real symbol |
| Prompt §0 grep | `grep -nE 'ai[A-Z]\|[Aa]ssistant'` | matches thousands of lines; §5 "expected: 0 matches (anchors gone)" is impossible to satisfy |
| Prompt §0 snapshot | L86463–L88000 | per `INDEX_MAP_part3.md` these rows are `getADCacheKey`, `loadADAnalysisCache`, `applyCMFDatePreset`, CMF date-filter fns — owned by `analysis/*`, `cmf/*`, `app/unassigned.js`, **not** `ai/ai-domain-knowledge.js` |
| Prompt §3 load anchor | `<script src="modules/ai/ai-mode.js">` | file is `modules/ai/ai-mode-toggle.js`; `ai-mode.js` does not exist |
| Session G header anchors | `initSatelliteConnection`@82357, `loadADSatelliteImage`@82464 | these are **Asset-Deficiency satellite-imagery** functions, a different feature, ~1,350 lines below the real DK block |

With no valid anchor or snapshot, defining `BLK_START..BLK_END` would require
fully self-authoring the boundary. CLAUDE.md "Modular Extraction Refactor →
When in doubt": *"If a prompt's §0 disagrees with reality (drift), ABORT and
ask before improvising. Never edit `app/index.html` outside the confirmed
block."* Prompt 41 was also previously **BLOCKED in Batch 4** (per CLAUDE.md
Batch-4 note). Forcing an extraction off a self-invented boundary risks a
real behavior change and violates the verbatim/valid-anchor discipline.

## Findings for a future correctly-anchored prompt 41

A genuine, largely self-contained **Domain Knowledge** feature block DOES
exist and was located by re-derivation (record for whoever re-authors this
prompt — NOT extracted in Session G):

- **Approx. range:** L79162 (`document.addEventListener('DOMContentLoaded', …)`
  immediately preceding the `DOMAIN KNOWLEDGE STATE` comment header @ L79176)
  through **L81006** (closing `}` of the last DK function), ending cleanly
  immediately before the `ASSET DEFICIENCY DETECTION STATE` comment block
  @ L81007 / `const assetDeficiencyState` @ L81011 / `switchCMFSubtab`
  @ L81252 (those belong to the CMF/Asset-Deficiency feature — prompt 33).
- **~1,830 lines.** Contiguous run: `initDomainKnowledge`@79292;
  Qdrant helpers `shouldUseQdrantProxy`/`qdrantFetch`/`initQdrantConnection`/
  `qdrant*`@79346–79552; Voyage embedding `voyage*`@79588–79626; RAG pipeline
  `ragSearch`/`generateQdrantId`/`indexDocument*`/`testRAGPipeline`/
  `indexSampleDocuments`@79648–79812; DK location/date `*DK*`@79902–80282;
  `renderDomainKnowledgeSources`@80284; DK sources/chat
  `toggleDKSource`…`runDKDeepAnalysis`@80339–80998 (incl. internal helpers
  `callClaudeSimple`@80821, `getActiveApiKey`@80848, `_dk*`@80509–80683).
- **Shared-helper risk: LOW.** `callClaudeSimple` and `getActiveApiKey` are
  each referenced only twice (definition + one internal caller, both inside
  the DK block). `qdrantFetch`/`ragSearch`/`voyageEmbed`/`shouldUseQdrantProxy`
  references appear confined to the DK/RAG region — re-verify externally
  before any future extraction.
- **Namespace:** `CL.ai.domainKnowledge` (CL.ai root exists in loader.js).
- **Recommended placement:** after `<script src="modules/ai/ai-mode-toggle.js">`
  (L4480) — the real ai-mode file.

### Recommended action before re-attempting
Re-author `modular-prompts/41-ai-ai-domain-knowledge.md` with: real anchors
(`initDomainKnowledge`, `renderDomainKnowledgeSources`, the `qdrant*`/`voyage*`/
`rag*`/`*DK*` set), correct snapshot (~L79162–L81006), a satisfiable §5
anchor-gone grep (use the actual moved-fn names, not `ai[A-Z]`), and the
correct load anchor (`ai-mode-toggle.js`). Then run as its own session and
re-verify the L81006 lower boundary and the `qdrant*/rag*/voyage*` external
reference count.

---

## Session J re-attempt (2026-05-17) — SKIPPED again

**Session:** J — retries from G + 44-v2. **Outcome:** SKIPPED, batch
continues with prompt 19 (skip-then-continue rule). No edit to
`app/index.html`.

The Session J runbook listed "cowork-verified" satellite anchors
(`initSatelliteConnection`, `captureMapboxSatelliteImage`,
`loadADSatelliteImage`, `toggleADApiKeyPanel`) and asked for a retry "with
real anchors." Those anchors **do** exist live (file now **146,633 lines**;
drift ≈ −2,681 lines vs. the 149,314-line snapshot above):

| Anchor | Session G line (149,314 file) | Session J line (146,633 file) |
|---|---|---|
| `initSatelliteConnection` | 82357 | 79676 |
| `captureMapboxSatelliteImage` | — | 79707 |
| `loadADSatelliteImage` | 82464 | 79783 |
| `toggleADApiKeyPanel` | — | 79944 |

But the Session G finding still holds: **these are Asset-Deficiency
satellite-imagery functions, not the Domain Knowledge feature.** The
contiguous AD subsystem they belong to runs from the satellite/Mapbox
helpers (`calculateZoomForBoxSize`@79616, `checkMapboxSatelliteConnection`
@79640) — and AD data-source loaders above (`loadAllADDataSources`@79213
etc.) — down through the AD-cache helpers, ending cleanly at the
`// ===` divider @L81644 immediately before the unrelated CMF date-filter
feature (`applyCMFDatePreset`@81647).

- Block from the Session-J start anchor `initSatelliteConnection`@79676 to
  the AD-block end @81646 = **1,971 lines** — ~4× the ~500-line ceiling that
  prompt 41 §1 mandates a STOP-and-report for.
- The prompt's own §0 description ("Domain Knowledge tab init + retrieval",
  snapshot L86463–L88000) still does **not** match the satellite anchors —
  two different features, exactly as Session G documented.

Both candidate blocks (the AD satellite subsystem ≈1,971 lines AND the real
Domain Knowledge block ≈1,830 lines per the Session G re-derivation) exceed
the single-session ≤500-line verbatim limit. Prompt 41 remains
**un-runnable as a single-file verbatim extraction** until it is re-authored
with correct anchors AND a `MODULAR_PLAN.md` §2 sub-split (multiple ≤500-line
child modules), per the recommendation above. No further action in Session J.
