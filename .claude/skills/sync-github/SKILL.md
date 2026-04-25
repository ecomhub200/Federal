---
name: sync-github
description: >
  Sync the local workspace folder with the GitHub repository, treating GitHub
  as the absolute source of truth. Use this skill whenever the user says
  "sync", "pull from GitHub", "reset to GitHub", "update from repo",
  "overwrite local with GitHub", "refresh codebase", "sync-github", or
  any variation of wanting the local files to match what's on GitHub.
  Also trigger when the user mentions local files are out of date, diverged,
  or need to be replaced with the repo version.
---

# Sync Local Folder with GitHub

This skill resets the local workspace to match the GitHub repository exactly.
GitHub is the **absolute source of truth** — any local modifications are
discarded and replaced with the committed versions.

## Repository Details

- **Repo**: `https://github.com/ecomhub200/Federal.git`
- **Branch**: `main`
- **Local path (file tools)**: `C:\Users\murad\OneDrive\Desktop\Crash Lens\Obsidian\raw\Federal`
- **Local path (bash)**: `/sessions/peaceful-bold-ride/mnt/Federal`

## Sync Procedure

Follow these steps in order. Report progress to the user after each step.

### Step 1: Check for Divergence

Run `git diff --name-only HEAD` from the repo root to list files that differ
from the last committed state. If the output is empty, tell the user
"Already in sync — no local changes detected" and stop.

### Step 2: Attempt `git checkout -- .`

Try resetting all modified files at once:

```bash
cd /sessions/peaceful-bold-ride/mnt/Federal && git checkout -- .
```

If this fails due to an index lock (`index.lock` exists), try removing the
lock file first:

```bash
rm -f /sessions/peaceful-bold-ride/mnt/Federal/.git/index.lock
```

Then retry. If removal itself fails (read-only `.git`), fall through to
Step 3.

### Step 3: Per-File Restore (Fallback)

When git commands can't modify the index (common in sandboxed environments),
restore each changed file individually:

```bash
cd /sessions/peaceful-bold-ride/mnt/Federal
for f in $(git diff --name-only HEAD); do
  git show "HEAD:$f" > "/tmp/_sync_restore"
  cp "/tmp/_sync_restore" "$f"
done
```

This extracts the committed version of each file from the git object store
and overwrites the local copy.

### Step 4: Attempt Remote Fetch

After restoring locally modified files, try to pull the latest from the
remote to pick up any new commits pushed to GitHub:

```bash
cd /sessions/peaceful-bold-ride/mnt/Federal && git fetch origin 2>&1
```

If fetch succeeds, do a hard reset:

```bash
git reset --hard origin/main
```

If fetch fails (no credentials in sandbox), that's OK — the local
files are already synced to the last-fetched commit. Tell the user:
"Restored local files to the last fetched commit. To get the absolute
latest from GitHub, run `git pull` from your terminal outside this session."

### Step 5: Verify

Run `git diff --name-only HEAD` one final time. The output should be empty.

- **Success**: "Sync complete — local folder matches GitHub (commit `<short-hash>`)."
- **Partial**: "Restored N of M files. These could not be restored: [list]. Run `git checkout -- .` from your terminal."

### Step 6: Summary

Show the user a concise summary:

- Number of files restored
- Current commit hash and message (`git log --oneline -1`)
- Whether remote fetch succeeded or was skipped

## Important Notes

- This skill **discards all local changes** without backup. If the user
  might want to keep local work, suggest they commit or stash first.
- The `.git` directory in sandboxed environments is often read-only.
  The per-file restore (Step 3) works around this.
- If the user wants a specific branch other than `main`, adapt the
  commands accordingly.
