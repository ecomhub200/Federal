---
title: "R2 Storage Paths (crash-lens-data bucket)"
aliases: [r2, cloudflare-r2, bucket-structure, r2-folders]
tags: [storage, infra, r2, paths]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# R2 Storage Paths (crash-lens-data bucket)

All crash datasets, road files, and jurisdiction boundary artifacts are
stored in a single **Cloudflare R2 bucket**, `crash-lens-data`, with a
strict hierarchical folder structure. The structure is the **source of
truth** — the front-end and every download pipeline must produce/
consume paths that match exactly. The authoritative document lives in
the `frontend-r2-connection` skill; this article is the condensed
reference every feature should read first.

## Key Points

- **Bucket:** `crash-lens-data`
- **Public URL:** `https://data.aicreatesai.com`
- **Folder builder:** `scripts/create_r2_folders.py`, wired into
  `.github/workflows/create-r2-folders.yml`
- **Tier-aware paths:** jurisdictions have a tier (county, state,
  region, MPO, planning district, city, federal) and each tier has a
  distinct top-level folder under `{state_prefix}/`.
- **Leading underscore** on tier folders (`_state/`, `_region/`,
  `_mpo/`, etc.) distinguishes them from county-level
  `{jurisdiction_id}/` folders at the same level.
- **National/shared assets** live under `_national/` and `shared/`
  outside any state prefix.

## Details

### Canonical hierarchy

```
crash-lens-data/
├── _federal/
├── _national/
│   ├── all_roads.csv
│   ├── dot_roads.csv
│   └── non_dot_roads.csv
├── shared/
│   ├── boundaries/
│   └── mutcd/
├── states/
│   └── geography/
│       ├── us_states.json
│       ├── us_counties.json
│       ├── us_mpos.json
│       ├── us_places.json
│       └── us_county_subdivisions.json
└── {state_prefix}/                # virginia, colorado, delaware, ...
    ├── _state/
    │   ├── hierarchy.json
    │   ├── statewide_all_roads.csv
    │   ├── dot_roads.csv
    │   └── city_roads.csv
    ├── _statewide/
    │   └── snapshots/
    ├── _region/{region_id}/
    │   ├── all_roads.csv
    │   ├── dot_roads.csv
    │   └── city_roads.csv
    ├── _planning_district/{pd_id}/
    │   └── all_roads.csv
    ├── _mpo/{mpo_id}/
    │   └── all_roads.csv
    ├── _city/{city_slug}/
    │   └── all_roads.csv
    └── {jurisdiction_id}/         # county-level (default)
        ├── raw/                   # raw annual source data
        ├── all_roads.csv
        ├── county_roads.csv
        ├── city_roads.csv
        ├── no_interstate.csv
        ├── traffic-inventory.csv
        ├── traffic-inventory-edits.json
        ├── corrections_ledger_{fileKey}.json
        └── validation_report_{fileKey}.json
```

### Tier routing in the front-end

The front-end computes the R2 prefix from the selected jurisdiction's
tier. A minimal router looks like:

```javascript
function r2PrefixFor(jurisdiction) {
  const { state, tier, id } = jurisdiction;
  switch (tier) {
    case "state":              return `${state}/_state`;
    case "region":             return `${state}/_region/${id}`;
    case "planning_district":  return `${state}/_planning_district/${id}`;
    case "mpo":                return `${state}/_mpo/${id}`;
    case "city":               return `${state}/_city/${id}`;
    case "county":             return `${state}/${id}`;         // no underscore
    case "federal":            return `_federal`;
    default:                   throw new Error(`Unknown tier: ${tier}`);
  }
}
```

The full, authoritative version lives in the upload/iframe modules —
consult the `frontend-r2-connection` skill when modifying tier logic
to make sure every child iframe module (validator, inventory, asset
deficiency) stays in sync.

### File key naming

- `{fileKey}` in names like `corrections_ledger_{fileKey}.json` is the
  uploaded file's identifier (usually a slugified filename or uploaded
  ID). Ledger/validation files are pinned to a specific upload, not to
  the jurisdiction.
- `snapshots/` under `_statewide/` stores periodic aggregate exports;
  filename format is documented in the skill.

### Auth & access

- **Reads** are generally public via `data.aicreatesai.com` (CDN).
- **Writes** go through the Node server, which holds R2 credentials as
  env vars (see [[concepts/coolify-deployment]]); the browser never
  gets write creds.
- Per-jurisdiction writes from the upload pipeline use S3-compatible
  R2 API via `@aws-sdk/client-s3` in `server/qdrant-proxy.js`.

## Common Pitfalls

- **Using `{state_prefix}/{jurisdiction_id}/` for a non-county
  jurisdiction** — leaves files in the wrong tier. Always route via
  the tier helper.
- **Hard-coding `virginia/` in new features** — breaks multi-state.
- **Forgetting the leading underscore** on tier folders (`state/` vs
  `_state/`) — creates parallel broken directories.
- **Uploading to R2 from the client** — never; keys must stay server-
  side.
- **Changing the hierarchy without updating `create_r2_folders.py`** —
  produces directories that exist in code but not in R2 (or vice
  versa).

## Related Concepts

- [[concepts/coolify-deployment]] — R2 credentials are server-side env
  vars injected at container startup
- [[concepts/state-onboarding]] — each new state sets its
  `{state_prefix}` and owns its tier inventory
- [[concepts/upload-pipeline]] — reads/writes these paths
- [[concepts/module-architecture]] — path-construction helpers belong
  in a shared module, not duplicated per feature

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  `.claude/skills/frontend-r2-connection/SKILL.md`
