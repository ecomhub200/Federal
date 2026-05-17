# Lane 4 — Phase 4 Survey · Reference Card

**Survey date:** 2026-05-17
**Reference commit:** `9be31e5c4c0f375bc282c842c174c06bc7ddd9e6`
(`Merge pull request #150 from ecomhub200/claude/session-o-extraction-CPjWs`)
**`app/index.html` size at reference:** 142,804 LOC
**Modules extracted to date:** 69 · **Prompts authored to date:** 139

## Branch routing note

The task body specified creating and pushing branch
`claude/day2-lane4-phase4-survey` off `main`. The active session is pinned to
development branch `claude/survey-index-html-blocks-frYmc`, and the standing
rule is "never push to a different branch without explicit permission." This
conflict was raised with the user, who chose to commit/push the survey docs to
the **pinned branch** `claude/survey-index-html-blocks-frYmc`. No `main`
checkout or branch switch was performed. Anyone consuming these docs in Day 3
Lane 3 should pull from `claude/survey-index-html-blocks-frYmc`.

## Survey method

Three read-only `Explore` agents scanned the live `app/index.html` at the
reference commit:

- **Survey A** — filter wiring (date/severity/route/intersection/district/map
  filters, filter-profile persistence).
- **Survey B** — map orchestration (init, layers, markers, popups, heatmap,
  boundary clip, map filters).
- **Survey C** — settings / auth / admin (preferences, notification settings,
  account/profile, API keys, admin).

Bar for a "genuine candidate": a contiguous inline block ≥150 LOC **not**
already extracted to `app/modules/` and **not** already covered by an authored
(but unrun) prompt. False positives = blocks already extracted; "covered" =
blocks already targeted by an existing prompt.

## Files in this deliverable set

| File | Contents |
|---|---|
| `LANE4_REFERENCE.md` | This card (commit pin, branch note, method) |
| `SURVEY_FILTER_WIRING.md` | Survey A inventory + clusters + aggregate |
| `SURVEY_MAP_ORCH.md` | Survey B coverage matrix + sufficiency verdict |
| `SURVEY_SETTINGS_AUTH.md` | Survey C inventory + clusters + aggregate |
| `DAY2_LANE4_PHASE4_PLAN.md` | Cross-survey rollup, refined plan, Murad Qs |
