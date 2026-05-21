# Cowork CC Orchestrator Queue

This folder is **outside the repo** (`Federal/queue/`, not `Federal-main (11)/Federal-main/`) so it survives ZIP re-downloads from GitHub.

## How it works

1. **Cowork writes** numbered `.md` files here (e.g., `010-fix-grants-loadapplications.md`)
2. **You run** `scripts/cowork-cc-orchestrator.ps1` from PowerShell
3. The script picks files in alphabetical order, pipes each to `claude -p --dangerously-skip-permissions`, waits for CC to push a branch, then moves the file to `done/` (or `failed/` if no branch landed)
4. The loop continues until the queue is empty

## Current queue (6 audit fixes — 2026-05-21)

Ordered by severity (P0 → P1 → P2). Each prompt enforces CLAUDE.md's map-first + extract-on-touch + update-map policies.

| # | File | Severity | Bug | Est CC time |
|---|---|---|---|---|
| 010 | fix-grants-loadapplications | **P0** | `ReferenceError: loadApplications is not defined` in grants-rank-init.js:19 | ~10 min |
| 011 | fix-dashboard-tier-kpi | P1 | Dashboard KPIs ignore tier selector (all 7 tiers show 569,829) | ~30 min |
| 012 | fix-dashboard-bc-zero | P1 | "Other Injury (B+C)" = 0 on Dashboard + Hotspots table | ~25 min |
| 013 | fix-crashtree-secondary-spinner | P1 | Crash Tree "Building secondary analysis..." spins forever | ~20 min |
| 014 | fix-hotspots-roadtype-filter | P1 | Road-type radio change doesn't re-run hotspots analyze | ~15 min |
| 015 | fix-reports-location-dropdown | P2 | Reports Location dropdown empty | ~15 min |
| 016 | fix-dashboard-loading-banner | P2 | Dashboard "Data Range: Loading..." stuck | ~10 min |

**Total est: ~2 hours of unattended CC work for 6 PRs ready to merge.**

## Running the loop

```powershell
cd "C:\Users\murad\OneDrive\Desktop\Crash Lens\Obsidian\raw\Federal"

# Dry run first (verifies folder logic, doesn't call CC)
.\scripts\cowork-cc-orchestrator.ps1 -DryRun

# First fix only — to validate the workflow end-to-end
.\scripts\cowork-cc-orchestrator.ps1 -MaxRuns 1

# All remaining fixes (unattended, ~2h)
.\scripts\cowork-cc-orchestrator.ps1
```

## After the loop finishes

You'll have 6 new branches on GitHub:
- `claude/fix-grants-loadapplications`
- `claude/fix-dashboard-tier-kpi`
- `claude/fix-dashboard-bc-zero`
- `claude/fix-crashtree-secondary-spinner`
- `claude/fix-hotspots-roadtype-filter`
- `claude/fix-reports-location-dropdown`
- `claude/fix-dashboard-loading-banner`

Each is an independent PR ready to merge. Merge in priority order (P0 first):
010 → 011 → 012 → 013 → 014 → 015 → 016

Or all at once if diffs look clean.

## After merging — tell Cowork "audit fixes landed"

I (Cowork) will:
1. Re-verify via raw GitHub + Chrome MCP that the bugs are gone
2. Confirm `app/CODE_MAP.md` was updated per Policy 3
3. Recommend the next batch of work (likely: the remaining audit P2 items + Domain Knowledge RAG config)

## What's NOT in this queue (decisions pending)

These items from the audit need YOUR decision before Cowork queues them:

- **Domain Knowledge RAG (P1 config)** — needs OpenAI key OR Supabase pgvector activation. Config decision, not code fix.
- **/api/notify/status 404 (P2)** — needs to know if you have a notification backend planned.
- **Intersection 98.5% anomaly (P2)** — may be real Delaware data, not a bug. Need SQL probe first.
- **Map search placeholder (P3)** — trivial cosmetic.
- **Scorecard 5-yr trend "0.0%" (P2)** — needs prior-period query design. Substantial fix.

Tell Cowork which of these to queue next.

## Recovery

- **Prompt failed** → moved to `failed/`. Review CC's output, fix the prompt, move back to `queue/`.
- **Stopped mid-loop** → re-run the script. Picks up where it left off.
- **Want to skip a prompt** → move it manually to `done/` before running.
- **CC made a bad commit** → roll back the branch yourself: `git push origin --delete claude/<branch>`.

## Safety reminders

- `--dangerously-skip-permissions` lets CC run tools without confirming. Prompts are bounded.
- Script checks for a new branch on origin (not just exit code) — silent CC failures are detected.
- Branch protection on `main` means CC pushes branches but doesn't auto-merge — you review PRs.

## File survival

The `queue/`, `done/`, `failed/` folders and `scripts/cowork-cc-orchestrator.ps1` live OUTSIDE `Federal-main (11)/Federal-main/`. ZIP-downloading from GitHub doesn't touch them.

## Older queue items (archived after Lane 000 introduced map-first strategy)

If you want to re-run the older synthetic extractions (Lanes I/J/K/L/M):

```powershell
ls queue\archive\
# Move back to queue\ if desired
```

These are LOWER priority now — the map+policies make ad-hoc modular extraction less urgent.
