---
title: "Multi-State Crash Data Onboarding"
aliases: [onboard-state, state-adapter, new-state, normalizer]
tags: [data-pipeline, multi-state, python, workflow]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Multi-State Crash Data Onboarding

Adding a new state's crash data is a **10-step checklist** covering a
normalizer class, state/hierarchy configs, a download script, a GitHub
Actions workflow, pipeline registration, and a mandatory onboarding
document. Every step is required before the new state is usable end-to-
end.

## Key Points

- **Each state gets its own `{State}Normalizer` class** in
  `scripts/state_adapter.py`, registered via a `STATE_SIGNATURES` entry.
- **The onboarding doc is non-optional**: every state must have
  `data/{StateDOT}/{state}_dot_data_config_and_onboarding.md` and it is
  the single source of truth for that state's quirks.
- **Normalizer output must be DOT-neutral** — no `VDOT`/`NonVDOT` strings
  in any state's output. See [[concepts/dot-neutral-naming]].
- **Protected pipelines must not be touched**: Colorado (CDOT) and
  Virginia (VDOT) pipelines are production-stable; ask the user before
  editing any `download-colorado-*`, `batch-colorado-*`,
  `download-virginia-*`, or `virginia-batch-*` file.
- **Delaware is the reference implementation** — mirror
  `data/DelawareDOT/delaware_dot_data_config_and_onboarding.md` for new
  states until the template is formalized.

## Details

### The 10-step checklist

1. **Research the source** — API type (Socrata, ArcGIS, REST, CSV drop),
   pagination behavior, auth requirements, data dictionary, severity
   levels, available fields.
2. **Create the normalizer** — add `{State}Normalizer` class to
   `scripts/state_adapter.py`, plus a `STATE_SIGNATURES` entry so the
   adapter can auto-detect the input schema.
3. **Create `states/{state}/config.json`** — jurisdictions list, EPDO
   weights (should match [[concepts/epdo-weights]] unless the state
   mandates different ones), column mapping from source field → target
   column index in `GOLDEN_COLUMNS`.
4. **Create `states/{state}/hierarchy.json`** — regions, MPOs, planning
   districts, counties, cities. Drives filter dropdowns and R2 folder
   paths.
5. **Create `data/{StateDOT}/download_{state}_crash_data.py`** — fetches
   raw data from the state's endpoint and writes it to a canonical path.
6. **Create `.github/workflows/download-{state}-crash-data.yml`** — runs
   the download script on a cron, normalizes the result, and triggers
   the shared pipeline with the state name.
7. **Register in `.github/workflows/pipeline.yml`** — add the state to
   the allowed `state` workflow input options.
8. **Write the onboarding doc** (`data/{StateDOT}/{state}_dot_data_config_and_onboarding.md`)
   — see "Required sections" below.
9. **Test against sample data** — run the normalizer, verify severity
   distribution, EPDO totals, and column mappings match expectations.
10. **Document limitations** — record what's missing (e.g. no person-
    level data, no reverse-geocoded city), which tabs break because of
    it, and the future plan to close the gap.

### Onboarding document: required sections

1. **State Data Profile** — state, abbreviation, FIPS, DOT name,
   counties, data custodian, portal URL, dataset ID, API type, update
   frequency, historical range.
2. **Data Source Details** — API behavior (pagination, filtering, auth),
   raw field names with descriptions and example values, field-name
   differences between API and CSV/Excel exports.
3. **Normalization Rules** — normalizer file location, severity mapping
   with rationale, composite crash ID format, datetime parsing formats,
   boolean field mapping table (Virginia Standard → state source →
   transform), fields NOT available (with future-resolution plans).
4. **Download Pipeline** — workflow file path, pipeline flow diagram,
   download script details, cron schedule, R2 storage path.
5. **Known Limitations & Exceptions** — data quality issues, analysis
   limitations (which tabs/features won't work), comparison caveats vs
   other states.
6. **Configuration Files Reference** — table of all config files with
   purpose and location.
7. **Future Enhancement Roadmap** — prioritized list (reverse
   geocoding, road classification, person-level data, ...).

### Normalizer contract

A normalizer must:

- Emit the canonical `GOLDEN_COLUMNS` column order.
- Produce KABCO severity codes (`K`, `A`, `B`, `C`, `O`) — see
  [[concepts/epdo-weights]].
- Produce DOT-neutral SYSTEM values and "DOT District" column name.
- Parse datetimes into ISO 8601.
- Provide a composite crash ID stable across daily ingests (so dedup
  works).
- Leave unavailable fields empty (never fabricate, never copy from a
  similar-but-different field).

### Existing onboarding docs

| State    | Document |
|----------|----------|
| Delaware | `data/DelawareDOT/delaware_dot_data_config_and_onboarding.md` |

Update this table in the root CLAUDE.md "Existing State Onboarding Docs"
section each time a new state is added.

## Common Pitfalls

- **Emitting legacy `VDOT` values** instead of DOT-neutral — silently
  splits filter categories in the UI.
- **Copy-pasting severity mapping** from another state without
  confirming KABCO definitions match — produces wrong EPDO totals.
- **Forgetting the `STATE_SIGNATURES` entry** — the adapter falls back
  to a generic parser and quietly mis-maps columns.
- **Editing Colorado or Virginia workflows** — protected. Open an issue
  or ask first.

## Related Concepts

- [[concepts/dot-neutral-naming]] — output format required from every
  normalizer
- [[concepts/epdo-weights]] — severity codes the normalizer must emit
- [[concepts/state-management]] — how normalized output ends up inside
  `crashState.sampleRows` at runtime
- [[concepts/r2-storage-paths]] — where each state's normalized
  artifacts land
- [[concepts/upload-pipeline]] — invokes the normalizer server-side on
  user uploads
- [[concepts/safety-focus]] — relies on normalizer-emitted flags for
  category predicates
- [[concepts/golden-columns]] — the positional schema every
  normalizer must emit
- [[concepts/map-tab]] — normalizer must leave null coordinates as
  null (not zero) so the Map tab can filter them
- [[connections/epdo-across-tabs]] — normalizer must emit KABCO so
  EPDO parity holds across every tab

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  the "Multi-State Data Onboarding" section of CLAUDE.md
