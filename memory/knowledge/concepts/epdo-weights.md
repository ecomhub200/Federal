---
title: "EPDO Weights (FHWA 2025)"
aliases: [EPDO, equivalent-property-damage-only, severity-weights]
tags: [traffic-safety, scoring, methodology]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# EPDO Weights (FHWA 2025)

Equivalent Property Damage Only (EPDO) is the severity-weighted scoring
system the tool uses to rank locations, hotspots, and before/after
outcomes. The project uses the **FHWA 2025 weights (FHWA-SA-25-021)**, not
the older Virginia/VDOT 2024 set.

## Key Points

- Weights (per KABCO severity): **K = 883, A = 94, B = 21, C = 11, O = 1**
- All EPDO math must go through the shared `calcEPDO(severityObject)`
  helper so every tab stays consistent.
- The severity keys match the KABCO codes used in `COL.SEVERITY`.
- EPDO values are comparable across tabs (Hotspots, CMF, Grants,
  Before/After) because they all consume the same weights via the same
  helper.
- Changing the weights is a **breaking, project-wide** change — update
  `CL.core` (or equivalent constants module), re-run any cached aggregates,
  and note the change in a new daily log.

## Details

```javascript
// Defined once in the constants module:
const EPDO_WEIGHTS = { K: 883, A: 94, B: 21, C: 11, O: 1 };  // FHWA 2025

function calcEPDO(sev) {
  return (sev.K || 0) * EPDO_WEIGHTS.K
       + (sev.A || 0) * EPDO_WEIGHTS.A
       + (sev.B || 0) * EPDO_WEIGHTS.B
       + (sev.C || 0) * EPDO_WEIGHTS.C
       + (sev.O || 0) * EPDO_WEIGHTS.O;
}
```

### Severity input shape

Most tabs produce a severity object by reducing over an array of crash
rows and incrementing the key at `COL.SEVERITY`:

```javascript
const sev = { K: 0, A: 0, B: 0, C: 0, O: 0 };
for (const row of crashes) sev[row[COL.SEVERITY]] = (sev[row[COL.SEVERITY]] || 0) + 1;
const epdo = calcEPDO(sev);
```

### Why these weights

The 2025 FHWA update (FHWA-SA-25-021) re-calibrated injury severity costs
based on updated crash-cost research. Older internal spreadsheets (and
some legacy state DOT docs) still cite the 2016 or VDOT 2024 weights;
those must not be reintroduced into the codebase.

### Common pitfalls

- Computing EPDO manually instead of calling `calcEPDO(...)` — leads to
  drift when weights change.
- Feeding in a severity object that still contains strings (e.g.
  `{ K: "2" }`) — `calcEPDO` treats them as NaN; always coerce with
  `+value` or `Number(value)` on ingestion.
- Using EPDO *ranks* across tabs without also propagating the filters
  that produced them — see [[concepts/state-management]] for scope rules.

## Related Concepts

- [[concepts/state-management]] — EPDO is stored on each tab's
  `crashProfile` object
- [[concepts/dot-neutral-naming]] — severity codes themselves are
  DOT-neutral KABCO and are unaffected by the neutralization effort
- [[concepts/module-architecture]] — `EPDO_WEIGHTS` and `calcEPDO` live
  under `CL.core` constants
- [[concepts/ai-context-awareness]] — every `crashProfile` returned by
  the resolver carries an EPDO score
- [[concepts/state-onboarding]] — normalizers must emit KABCO codes so
  these weights apply cleanly
- [[connections/state-scope-and-ai-context]] — EPDO is part of the
  uniform `crashProfile` shape all scopes share

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from the
  "EPDO Calculation" section of CLAUDE.md (FHWA-SA-25-021)
