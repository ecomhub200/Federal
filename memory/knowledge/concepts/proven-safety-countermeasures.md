---
title: "Proven Safety Countermeasures (PSC)"
aliases: [psc, fhwa-psc, proven-countermeasures]
tags: [traffic-safety, methodology, fhwa, countermeasures]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Proven Safety Countermeasures (PSC)

**Proven Safety Countermeasures** are an FHWA-designated shortlist of
infrastructure countermeasures with strong, repeatable evidence of
crash reduction. CrashLens references PSCs throughout the CMF and
Grants flows because selecting a PSC is the defensible default —
HSIP grant reviewers expect to see PSCs used where applicable before
alternative countermeasures are considered.

## Key Points

- **FHWA maintains the official list**: https://highways.dot.gov/safety/proven-safety-countermeasures
- **PSCs are a strict subset of the CMF Clearinghouse** — every PSC
  has one or more CMFs, but not every CMF is a PSC.
- **Applicability matters**: each PSC targets a specific setting
  (e.g. rural two-lane roads, signalized intersections, crosswalks).
  Misapplying a PSC inflates expected effect with no evidence.
- **CrashLens should surface PSC status on countermeasures** in the
  CMF picker so users can prefer them.
- **Grant narratives** in the Grants tab or its exports should cite
  PSC designations explicitly.

## Details

### Typical PSC categories

(Non-exhaustive; consult the FHWA source for the current list.)

- **Roadway departure**: rumble strips, SafetyEdge, enhanced
  delineation, median barriers.
- **Intersections**: corridor access management, reduced left-turn
  conflict intersections, roundabouts, backplates with retroreflective
  borders, systemic application of low-cost countermeasures.
- **Pedestrian/bicycle**: leading pedestrian intervals (LPI),
  pedestrian hybrid beacons, walkways, crosswalk visibility
  enhancements, road diets.
- **Speed management**: appropriate speed limits, USLIMITS2-based
  limit setting, speed safety cameras where permitted.
- **Crosscutting**: lighting, local road safety plans, systemic
  approaches.

### How CrashLens uses PSCs

- **CMF picker** (see [[concepts/cmf-tab]]): mark PSC-designated
  countermeasures with a visible badge and a short description of
  FHWA's evidence category. Prefer showing PSCs at the top of the
  picker when the selected location matches the PSC's setting.
- **Grants exports** (see [[concepts/grants-ranking]]): include PSC
  status in the per-location rationale so the final grant narrative
  reads "applies FHWA PSC: Leading Pedestrian Interval" instead of
  a bare CMF number.
- **AI Assistant**: when asked "what should we do here?", the AI
  should prefer PSC-first recommendations when the observed crash
  profile matches a PSC's applicability, and flag when the
  recommendation departs from the PSC list.

### Authoring PSC entries

PSC references live alongside CMF definitions in the constants
module. Each entry should carry:

```javascript
{
  id:           "PSC-LPI",
  name:         "Leading Pedestrian Interval",
  psc:          true,                     // explicit flag
  fhwaCategory: "Proven Safety Countermeasure — Pedestrian/Bicycle",
  appliesTo:    {
    settings:  ["signalized-intersection", "urban", "suburban"],
    crashTypes:["pedestrian", "vehicle-pedestrian"],
  },
  cmfs: [
    { factor: 0.41, target: "pedestrian crashes", source: "FHWA Tech Brief" },
    // ...
  ],
}
```

### Evidence hygiene

- Only label a countermeasure `psc: true` if FHWA currently lists it
  as a PSC. (The list updates periodically; re-sync when FHWA
  releases a new edition.)
- Keep CMF factors per-severity or per-crash-type where the source
  data allows; single composite factors mask the actual behavior.
- Prefer Clearinghouse-verified factors over trade-group marketing
  numbers. See [[concepts/cmf-tab]] for the broader CMF rules.

## Common Pitfalls

- **Promoting a non-PSC to "Proven Safety Countermeasure"** in UI —
  misleading to engineers and to HSIP reviewers.
- **Applying a PSC outside its setting** — e.g. recommending a
  roundabout on a freeway ramp junction — inflates expected effect
  without evidence.
- **Stapling PSC status to an entire category** instead of the
  specific countermeasure — not every pedestrian countermeasure is
  a PSC.

## Related Concepts

- [[concepts/cmf-tab]] — PSCs surface here as a picker badge
- [[concepts/grants-ranking]] — grant narratives cite PSCs
- [[concepts/ai-context-awareness]] — AI recommendations should
  default to PSC-first
- [[concepts/epdo-weights]] — expected-EPDO math uses CMFs; PSC
  status is about **which** CMFs to prefer

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding
  from CLAUDE.md's "Traffic Safety Engineer" role section (mentions
  Proven Safety Countermeasures explicitly) + FHWA PSC public page
