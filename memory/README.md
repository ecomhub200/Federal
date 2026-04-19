# CrashLens Persistent Knowledge Base

An LLM-maintained wiki for this project, adapted from
[Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

Instead of re-deriving context on every query (RAG), Claude incrementally
compiles the project's conversation history into a structured, queryable
markdown collection that is **kept current** as you work.

## The Compiler Analogy

```
daily/          = source code    (raw conversations, append-only)
LLM             = compiler       (extracts and organizes knowledge)
knowledge/      = executable     (structured, queryable knowledge base)
lint            = test suite     (health checks for consistency)
queries         = runtime        (using the knowledge)
```

See [`AGENTS.md`](AGENTS.md) for the full schema and operator manual.

## Layout

```
memory/
├── AGENTS.md                 # Full schema + operator manual
├── daily/                    # Immutable daily conversation logs
├── knowledge/
│   ├── index.md              # Master catalog (primary retrieval mechanism)
│   ├── log.md                # Append-only build log
│   ├── concepts/             # Atomic knowledge articles
│   ├── connections/          # Cross-cutting insights linking 2+ concepts
│   └── qa/                   # Filed query answers
├── hooks/                    # Claude Code hooks (auto-capture)
├── scripts/                  # compile.py, query.py, lint.py, flush.py
└── reports/                  # Lint reports (gitignored)
```

## Automatic Behavior

Hooks are wired in `../.claude/settings.json` and fire automatically inside
Claude Code:

- **SessionStart** — injects `knowledge/index.md` + the most recent daily log
  into every new session.
- **SessionEnd / PreCompact** — extracts the transcript and spawns `flush.py`
  in the background, appending distilled notes to today's `daily/YYYY-MM-DD.md`.
- **End-of-day auto-compile** — after 6 PM local, `flush.py` triggers
  `compile.py`, which turns daily logs into concept/connection articles and
  updates the index.

No manual curation is needed in normal use.

## Manual CLI

All commands run from this `memory/` directory:

```bash
# Compile new/changed daily logs into knowledge articles
uv run python scripts/compile.py

# Ask a question (index-guided retrieval, no RAG)
uv run python scripts/query.py "What auth patterns do we use?"

# Ask and save the answer as a new qa/ article
uv run python scripts/query.py "..." --file-back

# Run 7 health checks (broken links, orphans, contradictions, ...)
uv run python scripts/lint.py

# Free structural checks only (no LLM)
uv run python scripts/lint.py --structural-only
```

## Authoring Rules

When editing articles directly (compile.py does this automatically):

- **Wikilinks:** `[[concepts/article-name]]` — no `.md` extension, path
  relative to `knowledge/`.
- **Frontmatter:** YAML with at minimum `title`, `sources`, `created`,
  `updated`.
- **Sources:** every article must link back to the `daily/YYYY-MM-DD.md`
  logs that fed it.
- **File naming:** lowercase-kebab (e.g. `epdo-weights.md`).
- **Style:** encyclopedia-tone, factual, self-contained.
- **Prefer updating** an existing concept over creating a near-duplicate.

## Dependencies

Managed by [uv](https://docs.astral.sh/uv/). See `pyproject.toml`. No API key
required — the Agent SDK uses Claude Code's existing credentials.

## Further Reading

- `AGENTS.md` — full schema, article templates, hook internals, cost table
- Root `CLAUDE.md` — project-level Claude guidelines that reference this KB
- [Karpathy's original gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
