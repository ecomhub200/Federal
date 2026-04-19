---
title: "Upload Pipeline (app/modules/upload/)"
aliases: [upload, data-upload, upload-tab, api-connector, road-defaults]
tags: [pipeline, upload, r2, module]
sources:
  - "daily/2026-04-19.md"
created: 2026-04-19
updated: 2026-04-19
---

# Upload Pipeline (app/modules/upload/)

The Upload tab is the entry point for a user to load a new crash
dataset, supplemental road files, or traffic inventory into CrashLens.
It lives under `CL.upload` in `app/modules/upload/` and is split across
four sub-modules. Final artifacts land in R2 at the jurisdiction's
tier-specific path.

## Key Points

- **Four sub-modules**:
  `upload-tab.js` (UI), `upload-pipeline.js` (engine),
  `api-connector.js` (server round-trips), `road-defaults.js` (default
  road file choices per jurisdiction).
- **Destination is tier-aware** — paths come from the tier router
  described in [[concepts/r2-storage-paths]], not hard-coded.
- **Upload is server-mediated**: the browser streams the file to the
  Node server, which writes it to R2 using the S3-compatible API.
  Browsers never hold R2 write credentials.
- **Validation runs in the pipeline**: a successful upload produces a
  `validation_report_{fileKey}.json` in the target folder, regardless
  of pass/fail.
- **Corrections** to an uploaded dataset are stored as a diff in
  `corrections_ledger_{fileKey}.json` — uploads are immutable; edits
  append a ledger.

## Details

### Module responsibilities

| File                | Role |
|---------------------|------|
| `upload-tab.js`     | Tab UI, file picker, progress UI, status/errors |
| `upload-pipeline.js`| Engine: validates, normalizes, pushes to server, writes ledgers |
| `api-connector.js`  | Thin wrapper around `/api/*` upload endpoints |
| `road-defaults.js`  | Per-jurisdiction defaults for road file selection (which file to use for analysis by default) |

### Happy path

```
Browser                            Server                     R2
───────                            ──────                     ──
user picks file in upload-tab
  ├─ upload-pipeline validates locally (header, shape)
  └─ upload-pipeline → api-connector
       POST /api/upload/crash      ────►
                                   authenticate user (Firebase Admin)
                                   resolve tier → R2 prefix
                                   write raw file ─────────► raw/{fileKey}
                                   run normalizer (state adapter)
                                   write all_roads / etc. ─► jurisdiction/
                                   write validation_report ─► jurisdiction/
                                   return { fileKey, status, report }
  display report + next steps
```

### Tier resolution

Every upload has a jurisdiction context (picked in the UI or inherited
from the current session). The pipeline calls the same tier router used
everywhere else; see [[concepts/r2-storage-paths]]. If the router can't
classify the jurisdiction, the upload must fail fast — never fall back
to a county path "just in case".

### Interaction with `state_adapter.py`

For crash uploads specifically, the server invokes the appropriate
`{State}Normalizer` (see [[concepts/state-onboarding]]) before the
normalized output is written. This happens server-side to keep the
normalizer logic trusted and the browser lightweight.

### Corrections ledger

`corrections_ledger_{fileKey}.json` is an append-only record of edits
the user makes after upload (e.g. fixing a mis-coded severity). The
ledger is applied when re-reading the dataset so the raw file stays
untouched. Any feature that edits uploaded data must write through the
ledger, not the raw file.

## Common Pitfalls

- **Hard-coding a county path** in a new upload flow — breaks state/
  region/MPO/city tiers. Use the tier router.
- **Writing corrections into the raw file** — destroys the audit trail.
  Always append to the ledger.
- **Skipping the validation report** — even on success, downstream
  tools rely on the report being present; omitting it breaks the
  validator iframe module.
- **Running the normalizer on the client** — the browser should never
  hold state-specific normalization logic; keep it server-side for
  trust + performance.

## Related Concepts

- [[concepts/r2-storage-paths]] — where uploads land
- [[concepts/state-onboarding]] — normalizer contract
- [[concepts/coolify-deployment]] — server credentials for R2 writes
- [[concepts/firebase-auth]] — uploads are authenticated per user
- [[concepts/module-architecture]] — canonical sub-module split
- [[concepts/stripe-payment-flow]] — both flows share the same server
  auth + Firestore user-doc surface

## Sources

- [[daily/2026-04-19.md]] — extracted during initial wiki seeding from
  CLAUDE.md + `app/modules/upload/` directory +
  `.claude/skills/frontend-r2-connection/SKILL.md`
