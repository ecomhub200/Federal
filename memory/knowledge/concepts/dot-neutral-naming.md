---
title: "DOT-Neutral Column Naming Convention"
aliases: [vdot-neutral, state-agnostic-columns, system-codes]
tags: [data-schema, conventions, multi-state]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# DOT-Neutral Column Naming Convention

The crash data schema was originally authored against Virginia / VDOT but
the project is now multi-state. All **column names** and **categorical
values** must use DOT-neutral equivalents; the Virginia-specific wording
is legacy and must not appear in new code or normalized output.

## Key Points

- Column label is **"DOT District"** (not "VDOT District"); the underlying
  column position in `GOLDEN_COLUMNS` is **53**.
- SYSTEM value decodings use **"DOT Interstate/Primary/Secondary"** and
  **"Non-DOT primary/secondary"** — never "VDOT" / "NonVDOT".
- **`VSP`** (column 60) is intentionally Virginia-specific (Virginia State
  Police) and is **not** neutralized.
- References to VDOT **the organization** (e.g. "VDOT Road & Bridge
  Standards", "FHWA/VDOT publications") are fine and must stay.
- The JS property key **`countyPlusVDOT`** is a legacy identifier — keep
  it as-is; do not rename JS variable names.
- This applies to both raw source column headers and normalized output —
  every state adapter's normalizer produces the DOT-neutral labels.

## Details

### Full mapping

| DOT-neutral (use this)   | Legacy Virginia form (do not use) | Notes |
|--------------------------|-----------------------------------|-------|
| `DOT District`           | `VDOT District`                   | Column 53 of `GOLDEN_COLUMNS` |
| `DOT Interstate`         | `VDOT Interstate`                 | SYSTEM code `1` |
| `DOT Primary`            | `VDOT Primary`                    | SYSTEM code `2` |
| `DOT Secondary`          | `VDOT Secondary`                  | SYSTEM code `3` |
| `Non-DOT primary`        | `NonVDOT primary`                 | SYSTEM code `4` |
| `Non-DOT secondary`      | `NonVDOT secondary`               | SYSTEM code `5` |
| `Non-DOT`                | `NONVDOT` / `Non-VDOT`            | Generic non-state-DOT |
| `DOT Intersection`       | `VDOT Intersection`               | Intersection Analysis code `2` |
| `VSP`                    | `VSP`                             | **KEEP** — Virginia State Police, column 60 |

### Why it matters

- **Multi-state onboarding:** every new state adapter is expected to emit
  these labels so downstream analysis code (CMF, Warrants, Grants,
  Hotspots) doesn't need per-state branches.
- **Filter consistency:** filter dropdowns and chart legends pull labels
  directly from the normalized data; mixing legacy and neutral terms
  produces split categories in the UI.
- **State onboarding docs:** the required
  `data/{StateDOT}/{state}_dot_data_config_and_onboarding.md` template
  calls out which raw fields map to each DOT-neutral value — see the
  Delaware doc as the reference implementation.

### Enforcement

- Grep for `VDOT District`, `NonVDOT`, `NONVDOT`, `Non-VDOT` before
  landing any schema-adjacent PR; the only legitimate matches should be
  in `docs/`, historical migration notes, or the CLAUDE.md convention
  table itself.
- `scripts/state_adapter.py` is the canonical place to normalize values —
  new adapters inherit a base that already emits DOT-neutral output.

## Related Concepts

- [[concepts/state-management]] — downstream tabs consume the normalized
  columns via `crashState.sampleRows[...][COL.*]`
- [[concepts/module-architecture]] — column index constants live under
  `CL.core.constants` (the `COL` object)
- [[concepts/epdo-weights]] — KABCO severity codes feed `calcEPDO()`; they
  are KABCO and are *not* touched by the DOT-neutral rewrite
- [[concepts/state-onboarding]] — every new normalizer must emit these
  DOT-neutral labels
- [[concepts/safety-focus]] — category predicates must use normalized
  fields only
- [[concepts/golden-columns]] — full positional schema where the
  DOT-neutral columns live (position 53 = `DOT District`)
- [[concepts/map-tab]] — reads `COL.ROUTE` (a DOT-neutral column)
  from `sampleRows`

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  the "DOT-Neutral Column Naming Convention" section of CLAUDE.md
