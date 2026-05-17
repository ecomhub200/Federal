# Prompt 41 (`ai/ai-domain-knowledge.js`) — ROOT CAUSE + FIX

**Date:** 2026-05-17 · **Session:** N (investigate-blocked, documentation only)
**Verdict:** **B (re-anchor) + mandatory MODULAR_PLAN §2 sub-split.**
**Action:** Retire the single broken prompt; run
`modular-prompts/41-v2-ai-domain-knowledge.md` (6-child coordinator) instead.

Supersedes the "SKIPPED" disposition in
`MODULAR_PLAN_PROMPT_41_RESOLUTION.md` (Sessions G + J). That doc's
re-derivation was correct; this doc converts it into an executable plan.

---

## 1. Why prompt 41 keeps blocking (3 independent prompt-authoring defects)

`app/index.html` is **145,624 lines** live (snapshot all prompts were authored
against = 159,387). Sessions A, G, J each aborted at §0. The block reason is
**not codebase drift** — it is three defects baked into
`modular-prompts/41-ai-ai-domain-knowledge.md`:

| # | Defect | Evidence |
|---|---|---|
| 1 | **Placeholder anchor** | §0/§1 anchor literal is `(domain knowledge fns)` — never a real symbol. `grep` for it returns nothing. |
| 2 | **Un-satisfiable grep** | §0 step 1 and §5 use `grep -nE 'ai[A-Z]\|[Aa]ssistant'` → thousands of hits; §5 "expected: 0 matches (anchors gone)" can never be satisfied even after a correct extraction. |
| 3 | **Wrong snapshot + wrong rescue anchors** | Snapshot L86463–L88000 maps (per `INDEX_MAP_part3.md`) to `analysis/*` + CMF date-filter rows. The "rescue" anchors the Session G/J runbooks offered (`initSatelliteConnection`@79366, `loadADSatelliteImage`@79473, `toggleADApiKeyPanel`@79634, `captureMapboxSatelliteImage`@79397) are **Asset-Deficiency satellite-imagery** functions — a *different feature* (prompt 33 territory), ~1.1k lines below the real Domain Knowledge block. |

Because all three locators are wrong, any runner that follows the prompt
literally must either ABORT (correct, per CLAUDE.md "When in doubt") or
self-invent a boundary (forbidden). Hence the perpetual skip.

## 2. The real Domain Knowledge block — verified live (Session N)

Contiguous, single-ownership, cleanly bounded:

| Boundary | Line | Anchor (re-confirmed 2026-05-17) |
|---|---|---|
| **START** | **L76221** | `// ============` divider immediately before `// DOMAIN KNOWLEDGE STATE`@76222; `const dkState`@76225 |
| **END** | **L78015** | last DK fn `runDKDeepAnalysis`@78007 body close; clean stop immediately before `// ============`@78016 / `// ASSET DEFICIENCY DETECTION STATE`@78017 / `const assetDeficiencyState`@78020 |

**Size ≈ 1,795 lines** → 3.6× the 500-line single-session ceiling that
prompt 41 §1 itself mandates a STOP for. **It cannot be one verbatim session.**
`loader.js` already has `CL.ai = CL.ai || {};` (L14) — no loader.js edit needed.

## 3. The fix — 6-child ≤500-line sub-split (one session each, in order)

Boundaries follow the block's own comment headers (every child is DK-owned;
no foreign-tagged decls interleave):

| Order | Child module | Range | ~LOC | Contents |
|---|---|---|---|---|
| 41a | `ai/ai-domain-knowledge-core.js` | L76221–L76592 | ~372 | `dkState`@76225, `initDomainKnowledge`@76301, Qdrant block `shouldUseQdrantProxy`@76355 … `testQdrantConnection`@76561 |
| 41b | `ai/ai-domain-knowledge-rag.js` | L76593–L76910 | ~318 | Voyage embeddings `voyageEmbed`@76597 … `testVoyageConnection`@76635; RAG pipeline `ragSearch`@76657, `generateQdrantId`@76690, `indexDocument`@76701, `indexDocumentsBatch`@76738, `testRAGPipeline`@76781, `indexSampleDocuments`@76821 |
| 41c | `ai/ai-domain-knowledge-location.js` | L76911–L77292 | ~382 | `populateDKLocationDropdown`@76911 … `applyDKDateFilterInternal`@77185, `buildDKCrashProfile`@77203 |
| 41d | `ai/ai-domain-knowledge-sources.js` | L77293–L77529 | ~237 | `renderDomainKnowledgeSources`@77293, `toggleDKSource`@77348, `autoSelectDKSources`@77373, `selectDKFromMap`@77420, `clearDKChat`@77431, `askDKQuestion`@77452, `buildDKContext`@77499, `_dkResolveOpenAIKey`@77518 |
| 41e | `ai/ai-domain-knowledge-query.js` | L77530–L77869 | ~340 | `loadCorpusCounts`@77530, `embedPendingCorpus`@77576, `_dkOpenAIEmbed`@77643, `_dkPgvectorSearch`@77663, `queryDKSources`@77692, `callClaudeSimple`@77830, `getActiveApiKey`@77857 |
| 41f | `ai/ai-domain-knowledge-chat-ui.js` | L77870–L78015 | ~146 | `addDKMessage`@77870, `showDKCitation`@77906, `updateDKSourcesPanel`@77931, `loadDKStreetView`@77950, `switchDKStreetView`@77969, `changeDKViewDirection`@77982, `toggleDKReferencePanel`@77988, `attachDKImage`@78002, `runDKDeepAnalysis`@78007 |

**Load order:** 41a → 41b → 41c → 41d → 41e → 41f, all in the LATE cluster
immediately after `<script src="modules/ai/ai-mode-toggle.js"></script>`
(NOT the prompt's bogus `ai/ai-mode.js`).

**Shared-helper risk: LOW.** Session G noted `callClaudeSimple` /
`getActiveApiKey` are each definition + 1 internal caller, both inside the
block; Session N confirms both land in **41e** with their sole callers in
41d/41e. Each child's §0 still re-verifies external reference count by
brace-read before its delete (standard discipline).

## 4. Disposition

- `modular-prompts/41-ai-ai-domain-knowledge.md` — **byte-unmodified, do NOT
  run.** Logged in `modular-prompts/SUPERSEDED.md`.
- `modular-prompts/41-v2-ai-domain-knowledge.md` — the executable 6-child
  coordinator (written this session). Each child is its own session; run
  41a→41f in order, verify green between each.
- This supersedes the Session G/J "un-runnable" disposition: the block IS
  runnable — as six correctly-anchored ≤500-line sessions, not one.
