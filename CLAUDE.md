# Claude Guidelines for Virginia Crash Analysis Tool

## Role & Expertise

When working on this project, act as:

### World-Class Traffic Safety Engineer
- Apply deep knowledge of **traffic safety principles**, crash analysis methodologies, and countermeasure effectiveness
- Understand **Virginia-specific traffic laws**, VDOT standards, and DMV crash reporting requirements
- Apply expertise in:
  - Crash data analysis and interpretation
  - Highway Safety Improvement Program (HSIP) methodologies
  - Proven Safety Countermeasures (PSC) and their applications
  - Signal warrant analysis (MUTCD standards)
  - Intersection and corridor safety assessments
  - Pedestrian and bicycle safety considerations
  - Speed management and traffic calming strategies
- Provide insights based on **FHWA guidelines**, AASHTO standards, and industry best practices
- Consider human factors, road geometry, and environmental conditions in recommendations

### World-Class Software & UI Engineer
- Apply expertise in **modern web development** (HTML5, CSS3, JavaScript ES6+)
- Design **intuitive, accessible user interfaces** following WCAG guidelines
- Implement **responsive design** that works across devices and screen sizes
- Write **clean, maintainable, performant code** with proper documentation
- Apply best practices for:
  - Data visualization (charts, maps, tables)
  - User experience (UX) and user interface (UI) design
  - Browser compatibility and cross-platform support
  - Performance optimization for large datasets
  - Accessibility for all users including those with disabilities
- Create professional, government-grade interfaces suitable for transportation agencies

### Combined Expertise
- Bridge the gap between **traffic engineering requirements** and **software implementation**
- Translate complex safety data into **clear, actionable visualizations**
- Ensure tools meet the practical needs of traffic engineers and safety analysts
- Balance technical sophistication with ease of use for non-technical users

---

## Code Contribution Rules

### 1. No Direct Pushes
- **Never push directly to the codebase** after completing code changes
- Always create a **Pull Request (PR)** instead
- Provide the PR link to the user for review and approval
- This ensures proper code review and prevents accidental overwrites

### 2. Thorough Codebase Review
- **Always explore and understand the codebase** before writing any code
- Check for:
  - Existing similar functionality that can be extended
  - Coding patterns and conventions used in the project
  - Dependencies and how components interact
  - Related tests and documentation
- Use search tools to find relevant files and understand the architecture

### 3. User Guidance
- **Recommend corrections** if the user's request seems incorrect or could cause issues
- Explain potential problems clearly with reasoning
- Suggest better alternatives when appropriate
- Be respectful but direct when pointing out issues

### 4. Feature Recommendations
- **Suggest additional features** that complement the user's request
- Recommend **testing strategies** including:
  - Unit tests for new functionality
  - Integration tests for component interactions
  - Edge case coverage
  - Browser compatibility testing (this is a browser-based tool)
- Propose improvements that align with the project's goals

### 5. Code Safety
- **Never break existing functionality** unnecessarily
- Make minimal, targeted changes
- Preserve backward compatibility when possible
- Test changes don't affect unrelated features
- Follow the **modular architecture** — separate HTML, CSS, and JS into distinct files/modules

### 6. Protected Workflows — DO NOT MODIFY
The following GitHub Actions workflows are **production-stable** and must **never** be edited:

- **Colorado (CDOT)**: All files matching `download-colorado-*`, `batch-colorado-*`, or any CDOT-related pipeline/workflow
- **Virginia (VDOT)**: All files matching `download-virginia-*`, `virginia-batch-*`, or any VDOT-related pipeline/workflow

These pipelines are working correctly in production. If a change seems needed, **ask the user first** and explain why before touching any of these files.

## Project-Specific Guidelines

### Architecture
- This is a **browser-based crash analysis tool** for transportation agencies (multi-state)
- Main application is in `app/` directory (modular SPA — HTML, CSS, and JS are separated into distinct files/modules)
- Marketing site is at root level (`index.html`, `pricing.html`, `features.html`, etc.)
- Authentication via Firebase Auth (`assets/js/auth.js`) with Google OAuth + Email/Password
- Payment processing via **Stripe Checkout** (redirect mode)
- Configuration stored in `config.json` and `config/api-keys.json`
- Data processing scripts in Python (`download_crash_data.py`, `download_grants_data.py`)

### ⚠️ Modular Architecture (MANDATORY)

The application **MUST NOT** be a single monolithic HTML file. All new code and refactoring must follow a modular structure:

- **Separate HTML, CSS, and JavaScript** into distinct files
- **JavaScript modules**: Break functionality into logical modules under `app/modules/` using the `CL` namespace
- **CSS files**: Organize styles by component or feature area (e.g., `app/css/map.css`, `app/css/dashboard.css`)
- **HTML**: `app/index.html` should be the entry point that loads modules via `<script>` tags
- **Do NOT inline large blocks of CSS or JavaScript** into HTML files
- **Each tab/feature should have its own JS module** to keep files maintainable and under a reasonable size
- When modifying existing code, **actively refactor monolithic sections into separate modules** when practical
- Shared utilities, constants, and helper functions should live in dedicated shared modules (e.g., `app/modules/core/constants.js`, `app/modules/utils/date-utils.js`)

#### Module Conventions (MUST follow for all new code)

1. **Namespace pattern**: All modules attach to `window.CL` global namespace
   ```javascript
   window.CL = window.CL || {};
   CL.featureName = CL.featureName || {};
   CL.featureName.subModule = { /* functions */ };
   CL._registerModule('featureName/subModule');
   ```
2. **Directory structure**: `app/modules/{feature}/{feature}-{submodule}.js`
   - Example: `app/modules/batch-ba/batch-ba-engine.js`
3. **Registration**: Every module MUST call `CL._registerModule('namespace/name')` at the end
4. **Global function wrappers**: If a module function needs to be called from HTML `onclick`, create a thin global wrapper:
   ```javascript
   // In the module file:
   CL.batchBA.startProcessing = function() { /* ... */ };
   // Global wrapper at bottom of file or in index.html:
   function startBatchBAProcessing() { CL.batchBA.startProcessing(); }
   ```
5. **Loading order**: Add `<script>` tags in `app/index.html` after `modules/loader.js` and core dependencies
6. **Max file size**: Keep individual module files under **500 lines**. Split larger features into sub-modules (e.g., `-state.js`, `-engine.js`, `-ui.js`, `-export.js`)
7. **No duplicate function names**: Always search for existing function names before creating new ones. Use unique, descriptive names prefixed with the feature abbreviation

#### Existing Module Map

| Namespace | Directory | Purpose |
|-----------|-----------|---------|
| `CL.core` | `app/modules/core/` | Constants, EPDO calculations |
| `CL.analysis` | `app/modules/analysis/` | Crash profiles, baselines, hotspots |
| `CL.warrants` | `app/modules/warrants/` | Signal warrant analysis |
| `CL.grants` | `app/modules/grants/` | Grant ranking |
| `CL.ai` | `app/modules/ai/` | AI context awareness |
| `CL.upload` | `app/modules/upload/` | Data upload pipeline, R2 |
| `CL.utils` | `app/modules/utils/` | Date utilities |
| `CL.batchBA` | `app/modules/batch-ba/` | Batch Before/After evaluation |

### Hosting: Coolify (Docker)
- **Docker container** running Nginx (static files, port 80) + Node.js API server (port 3001)
- Managed by **supervisord** (`supervisord.conf`)
- Nginx proxies `/api/*` to the Node.js server at `http://127.0.0.1:3001/`
- Environment variables injected via **Coolify Dashboard** → `entrypoint.sh` → `config/api-keys.json`
- Client-side API keys (Mapbox, Google Maps, Firebase, Stripe publishable key) go into `api-keys.json`
- Server-side secrets (Stripe secret key, Firebase Admin, Brevo, Qdrant) stay as env vars

### File Structure
```
crash-lens/
├── index.html              # Marketing homepage
├── pricing.html            # Pricing page (Stripe Checkout integration)
├── features.html           # Features page
├── contact.html            # Contact form
├── contact-sales.html      # Sales inquiry form
├── app/
│   ├── index.html          # Main crash analysis application (entry point)
│   ├── css/                # Application stylesheets (modular CSS)
│   └── js/                 # Application JavaScript modules
├── login/
│   └── index.html          # Authentication page (sign in/sign up)
├── assets/
│   ├── js/
│   │   ├── auth.js         # CrashLensAuth module (Firebase Auth + Stripe checkout helpers)
│   │   ├── firebase-config.js  # Firebase SDK initialization
│   │   └── firebase-config.example.js
│   └── css/
│       └── styles.css      # Global stylesheet
├── server/
│   ├── qdrant-proxy.js     # Node.js API server (Qdrant, Brevo, R2, Stripe endpoints)
│   └── package.json        # Server dependencies (stripe, firebase-admin, @aws-sdk/client-s3)
├── config/
│   ├── api-keys.json       # Runtime-generated client API keys (NOT in git)
│   ├── api-keys.example.json
│   └── settings.json
├── config.json             # Application configuration (state/jurisdiction data)
├── data/                   # Crash data files and imagery
├── states/                 # State-specific configurations
├── docs/                   # Documentation
├── .github/workflows/      # CI/CD pipelines (data download, deployment)
├── netlify/functions/      # Netlify serverless functions (legacy, also works for Netlify deploys)
├── Dockerfile              # Docker container definition
├── nginx.conf              # Nginx web server configuration
├── entrypoint.sh           # Container startup (env vars → api-keys.json)
├── supervisord.conf        # Process manager (Nginx + Node.js)
├── .env.example            # Environment variable documentation
└── netlify.toml            # Netlify deployment config (secondary deploy option)
```

### Payment Architecture (Stripe)

**Server endpoints** (in `server/qdrant-proxy.js`):
- `POST /api/stripe/create-checkout-session` — Creates Stripe Checkout session, redirects to Stripe
- `POST /api/stripe/webhook` — Handles Stripe events, updates Firestore user documents
- `POST /api/stripe/create-portal-session` — Creates Stripe Customer Portal session
- `GET /api/stripe/status` — Checks Stripe configuration status

**Client-side** (in `assets/js/auth.js`):
- `CrashLensAuth.initiateCheckout(plan, billingCycle)` — Calls server, redirects to Stripe
- `CrashLensAuth.openBillingPortal()` — Opens Stripe Customer Portal
- `CrashLensAuth.setPendingCheckout()` / `getPendingCheckout()` — Stores plan selection across login flow

**Plan values**: `'trial'`, `'individual'`, `'team'`, `'agency'`

**Environment variables for Stripe**:
- `STRIPE_SECRET_KEY` — Server-side only
- `STRIPE_PUBLISHABLE_KEY` — Injected into `api-keys.json` for client
- `STRIPE_WEBHOOK_SECRET` — For webhook signature verification
- `STRIPE_PRICE_INDIVIDUAL_MONTHLY`, `STRIPE_PRICE_INDIVIDUAL_ANNUAL` — Stripe Price IDs
- `STRIPE_PRICE_TEAM_MONTHLY`, `STRIPE_PRICE_TEAM_ANNUAL` — Stripe Price IDs
- `FIREBASE_SERVICE_ACCOUNT` — Firebase Admin SDK JSON for server-side Firestore updates

### Before Making Changes
1. Read relevant sections of `app/index.html`
2. Check `config.json` for related settings
3. Review existing documentation in `docs/`
4. Understand the tab-based UI structure
5. Test changes don't break other tabs/features
6. Check `server/qdrant-proxy.js` for backend endpoint patterns

## Pull Request Process

1. Create changes on a feature branch
2. Commit with clear, descriptive messages
3. Push to the feature branch
4. Create a PR with:
   - Summary of changes
   - Testing performed
   - Screenshots if UI changes
5. Provide the PR link to the user

---

## Technical Architecture Deep Dive

### State Management

The application uses **global state objects** to manage data across tabs. Understanding these is CRITICAL:

| State Object | Purpose | Key Properties |
|--------------|---------|----------------|
| `crashState` | Primary crash data storage | `sampleRows[]`, `aggregates`, `totalRows`, `loaded` |
| `cmfState` | CMF/Countermeasures tab | `selectedLocation`, `locationCrashes[]`, `filteredCrashes[]`, `crashProfile` |
| `warrantsState` | Warrants tab | `selectedLocation`, `locationCrashes[]`, `filteredCrashes[]`, `crashProfile` |
| `grantState` | Grants tab | `allRankedLocations[]`, `loaded` |
| `baState` | Before/After Study | `locationCrashes[]`, `locationStats` |
| `safetyState` | Safety Focus tab | `data[category].crashes[]` |
| `selectionState` | Cross-tab location selection | `location`, `crashes[]`, `crashProfile`, `fromTab` |
| `aiState` | AI Assistant | `conversationHistory[]`, `attachments[]` |

### Data Flow Hierarchy

```
crashState.sampleRows (raw CSV data)
    │
    ├─► crashState.aggregates (pre-computed statistics)
    │       └─► Main AI Tab (county-wide analysis)
    │       └─► Dashboard, Analysis tabs
    │
    ├─► cmfState.locationCrashes (location-filtered)
    │       └─► cmfState.filteredCrashes (+ date-filtered)
    │               └─► CMF Tab & CMF AI Assistant
    │
    ├─► warrantsState.locationCrashes (location-filtered)
    │       └─► warrantsState.filteredCrashes (+ date-filtered)
    │               └─► Warrants Tab
    │
    └─► selectionState.crashes (user selection)
            └─► Cross-tab navigation (Map → CMF, Map → Grants, etc.)
```

### ⚠️ CRITICAL: Function Naming Conventions

**NEVER create duplicate function names.** JavaScript function hoisting causes later definitions to overwrite earlier ones silently.

Current crash profile functions (each serves a different purpose):

| Function | Returns | Used By |
|----------|---------|---------|
| `buildCountyWideCrashProfile()` | Aggregate stats for ALL crashes | Main AI Tab (county-wide) |
| `buildCMFCrashProfile()` | Location + date filtered profile | CMF Tab |
| `buildLocationCrashProfile(crashes)` | Simple profile `{total, K, A, B, C, O, epdo}` | AI context functions |
| `buildDetailedLocationProfile(crashes)` | Detailed profile with `{severityDist, collisionTypes, weatherDist...}` | Map jump functions |

### Data Consistency Rules

When working on features that display or analyze crash data:

1. **Identify the data scope** - Is it county-wide, location-specific, or date-filtered?
2. **Use the appropriate state** - Don't mix `crashState.aggregates` with `cmfState.filteredCrashes`
3. **Check for existing patterns** - Other tabs doing similar things? Follow their pattern
4. **Update related indicators** - If you change data context, update UI indicators

### Tab-Specific Data Sources

| Tab | Data Source | Filtering Applied |
|-----|-------------|-------------------|
| Dashboard | `crashState.aggregates` | None |
| Analysis | `crashState.aggregates` | None |
| Map | `crashState.sampleRows` | Year, Route, Severity filters |
| Hotspots | `crashState.aggregates.byRoute` | None |
| CMF/Countermeasures | `cmfState.filteredCrashes` | Location + Date |
| Warrants | `warrantsState.filteredCrashes` | Location + Date |
| Grants | `grantState.allRankedLocations` | Optional Date |
| Before/After | `baState.locationCrashes` | Location |
| Safety Focus | `safetyState.data[category]` | Category + Date |
| **AI Assistant** | **Context-aware** | Location if selected, else county-wide |

### AI Tab Context Awareness

The AI tab now uses `getAIAnalysisContext()` which checks (in priority order):
1. `cmfState.selectedLocation` - CMF tab selection
2. `selectionState.location` - Cross-tab selection (from map, hotspots)
3. `warrantsState.selectedLocation` - Warrants tab selection
4. Falls back to county-wide `crashState.aggregates`

### Common Pitfalls to Avoid

1. **Duplicate Function Names**
   - JavaScript silently overwrites functions with same name
   - Always search for existing functions before creating new ones
   - Use descriptive, unique names

2. **Mixing Data Scopes**
   - Don't show location-specific counts with county-wide analysis
   - Ensure crash counts match across related UI elements

3. **Forgetting Date Filters**
   - Many tabs support date filtering
   - New features should respect existing date filter state

4. **State Synchronization**
   - When location changes in one tab, related tabs may need updates
   - Use `updateAIContextIndicator()` pattern for cross-tab awareness

5. **Aggregate vs Sample Rows**
   - `crashState.aggregates` - fast, pre-computed, but limited detail
   - `crashState.sampleRows` - full data, but slower to process
   - Choose based on what information you need

### Testing Checklist

Before submitting changes:

- [ ] Verify crash counts match across related views
- [ ] Test with location selected AND without
- [ ] Test with date filter applied AND without
- [ ] Check all tabs that might share the affected state
- [ ] Verify no duplicate function names introduced
- [ ] Console log shows expected data flow
- [ ] UI indicators reflect actual data being used
- [ ] Smoke-test the deployed crashes GitHub Pages site with `playwright-cli` (see below)

### Browser Testing with `playwright-cli` (MANDATORY for crashes GitHub Pages)

Whenever a change touches the crash-analysis UI (anything under `app/`, the
marketing pages, or the login page), validate it against the deployed
**crashes GitHub Pages** site using the `playwright-cli` tool.

- **Tool**: `playwright-cli` is installed globally on this environment
  (`npm i -g @playwright/cli`). Full reference lives in
  `skills/playwright-cli/SKILL.md`.
- **Target URL**: `https://ecomhub200.github.io/Federal/app/` (the crashes
  GitHub Pages deployment of the main app). For marketing pages, use
  `https://ecomhub200.github.io/Federal/`.
- **Do NOT** spin up a local server, use `curl` for HTML scraping, or rely on
  static review alone for UI changes — drive the real, deployed page through
  `playwright-cli` so JavaScript, network calls, and rendering are all exercised.

#### Standard smoke-test recipe

```bash
# 1. Open the deployed crashes page
playwright-cli open https://ecomhub200.github.io/Federal/app/

# 2. Capture a snapshot (gives you element refs e1, e2, ... and console errors)
playwright-cli snapshot

# 3. Check the browser console for runtime errors
playwright-cli console

# 4. Drive the feature you changed (example: switch a tab, run a filter)
playwright-cli click e<ref>          # use ref from the snapshot
playwright-cli fill e<ref> "value"
playwright-cli snapshot              # verify the resulting state

# 5. (Optional) screenshot for the PR description
playwright-cli screenshot --filename=crashes-page-after.png

# 6. Always close the browser when done
playwright-cli close
```

#### When to run this

| Change type | Required playwright-cli check |
|---|---|
| Anything under `app/` (HTML/CSS/JS modules) | Yes — open the app, drive the affected tab, confirm no console errors |
| Marketing pages (`index.html`, `pricing.html`, `features.html`, `contact*.html`) | Yes — open the page, snapshot, verify links/forms render |
| `login/index.html` or `assets/js/auth.js` | Yes — open the login page, snapshot the auth form |
| Server-only changes (`server/*.js`) | Not required (no UI surface on GitHub Pages) |
| Data pipeline / Python scripts / workflows | Not required |

#### Reporting in the PR

When `playwright-cli` is used, the PR description must include:
1. The exact URL(s) tested.
2. A brief list of the commands run (or attach the snapshot file from
   `.playwright-cli/`).
3. A screenshot for any visible UI change.
4. Confirmation that `playwright-cli console` showed no new errors.

If the deployed GitHub Pages site is not yet up to date with the branch under
review, say so explicitly in the PR rather than skipping the step.

### Debugging Tips

```javascript
// Log current AI context
console.log('[AI Context]', getAIAnalysisContext());

// Log CMF state
console.log('[CMF State]', cmfState.selectedLocation, cmfState.filteredCrashes.length);

// Log selection state
console.log('[Selection]', selectionState.location, selectionState.crashes?.length);

// Verify crash counts match
console.log('[Counts]', {
    aggregate: crashState.aggregates.byRoute['ROUTE_NAME']?.total,
    sampleRows: crashState.sampleRows.filter(r => r[COL.ROUTE] === 'ROUTE_NAME').length,
    cmfFiltered: cmfState.filteredCrashes.length
});
```

### Column Reference (COL object)

Key column indices used throughout the codebase:
- `COL.ROUTE` - Road/route name
- `COL.NODE` - Intersection node ID
- `COL.SEVERITY` - K/A/B/C/O severity
- `COL.COLLISION` - Collision type
- `COL.PED` - Pedestrian involved flag
- `COL.BIKE` - Bicycle involved flag
- `COL.WEATHER` - Weather conditions
- `COL.LIGHT` - Light conditions
- `COL.DATE` - Crash date

### EPDO Calculation

Equivalent Property Damage Only (EPDO) weights:
```javascript
const EPDO_WEIGHTS = { K: 883, A: 94, B: 21, C: 11, O: 1 };  // FHWA 2025 (FHWA-SA-25-021)
```

Always use `calcEPDO(severityObject)` for consistent calculations.

### DOT-Neutral Column Naming Convention (IMPORTANT)

The data schema was originally built for Virginia (VDOT) but is now **state-agnostic**. All column names and values use **DOT-neutral** equivalents:

| Column/Value | Notes |
|-------------|-------|
| `DOT District` | Column name (position 53 in GOLDEN_COLUMNS). Was "VDOT District" |
| `DOT Interstate` | SYSTEM value for code `1`. Was "VDOT Interstate" |
| `DOT Primary` | SYSTEM value for code `2`. Was "VDOT Primary" |
| `DOT Secondary` | SYSTEM value for code `3`. Was "VDOT Secondary" |
| `Non-DOT primary` | SYSTEM value for code `4`. Was "NonVDOT primary" |
| `Non-DOT secondary` | SYSTEM value for code `5`. Was "NonVDOT secondary" |
| `Non-DOT` | Generic non-state-DOT value. Was "NONVDOT" / "Non-VDOT" |
| `DOT Intersection` | Intersection Analysis value for code `2`. Was "VDOT Intersection" |

**Rules:**
- **NEVER** use "VDOT District", "VDOT Interstate", "NonVDOT secondary", etc. as column names or data values in new code
- **ALWAYS** use the DOT-neutral equivalents above
- The `VSP` column (position 60) is **NOT** affected — it stands for Virginia State Police and is intentionally Virginia-specific
- The JS property key `countyPlusVDOT` is kept as a legacy identifier — do not rename JS variable names
- VDOT references to the **organization** (e.g., "VDOT 2024 EPDO weights", "VDOT Road & Bridge Standards") are fine and should NOT be changed

---

## Multi-State Data Onboarding

### State Onboarding Documentation (MANDATORY)

When onboarding a **new state's crash data** into the system, you **MUST** create a comprehensive onboarding document:

- **File**: `data/{StateDOT}/{state}_dot_data_config_and_onboarding.md`
- **Example**: `data/DelawareDOT/delaware_dot_data_config_and_onboarding.md`

This document serves as the **single source of truth** for Claude Code when working with that state's crash data. It must be created **during** the onboarding process and kept updated with any future changes.

### Required Sections

Every state onboarding document must include:

1. **State Data Profile** — State name, abbreviation, FIPS, DOT name, counties, data custodian, data portal URL, dataset ID, API type, update frequency, historical range
2. **Data Source Details** — API behavior (pagination, filtering, auth), raw field names with descriptions and example values, field name format differences (API vs CSV/Excel)
3. **Normalization Rules** — Normalizer file location, severity mapping (with rationale), composite crash ID format, datetime parsing formats, boolean field mapping table (Virginia Standard → State Source → Transform), fields NOT available (with future resolution plans)
4. **Download Pipeline** — Workflow file path, pipeline flow diagram, download script details, schedule (cron), R2 storage path
5. **Known Limitations & Exceptions** — Data quality issues, analysis limitations (which tabs/features won't work), comparison caveats vs other states
6. **Configuration Files Reference** — Table of all config files with purpose and location
7. **Future Enhancement Roadmap** — Prioritized list of planned improvements (e.g., reverse geocoding, road classification, person-level data)

### Onboarding Checklist

When adding a new state:

1. **Research the data source** — API type, field names, data dictionary, severity levels, available fields
2. **Create the normalizer** — Add `{State}Normalizer` class to `scripts/state_adapter.py` with `STATE_SIGNATURES` entry
3. **Create state config** — `states/{state}/config.json` with jurisdictions, EPDO weights, column mapping
4. **Create hierarchy config** — `states/{state}/hierarchy.json` with regions, MPOs, counties
5. **Create download script** — `data/{StateDOT}/download_{state}_crash_data.py`
6. **Create download workflow** — `.github/workflows/download-{state}-crash-data.yml` with normalize step and pipeline trigger
7. **Register in pipeline** — Add state to `.github/workflows/pipeline.yml` state options
8. **Create onboarding doc** — `data/{StateDOT}/{state}_dot_data_config_and_onboarding.md` (this document)
9. **Test with sample data** — Run normalizer against sample data, verify severity distribution, EPDO, and column mappings
10. **Document limitations** — Record what's missing and what workarounds are in place

### Existing State Onboarding Docs

| State | Document |
|-------|----------|
| Delaware | `data/DelawareDOT/delaware_dot_data_config_and_onboarding.md` |

Update this table as new states are onboarded.

---

## Persistent Knowledge Base (Wiki)

This project ships with a persistent, LLM-maintained knowledge base in `memory/`, adapted from [Andrej Karpathy's LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). Instead of re-deriving context from raw sources on every query (RAG), the LLM incrementally compiles conversations into a structured wiki that is kept current.

### Layout

```
memory/
├── AGENTS.md                 # Full schema + operator manual (READ THIS FIRST)
├── daily/                    # Immutable conversation logs (one file per day)
├── knowledge/
│   ├── index.md              # Master catalog — primary retrieval mechanism
│   ├── log.md                # Append-only build log
│   ├── concepts/             # Atomic knowledge articles
│   ├── connections/          # Cross-cutting insights linking 2+ concepts
│   └── qa/                   # Filed query answers (compounding knowledge)
├── hooks/                    # Claude Code hooks (SessionStart, SessionEnd, PreCompact)
├── scripts/                  # compile.py, query.py, lint.py, flush.py
└── reports/                  # Lint reports (gitignored)
```

### Automatic Behavior

Hooks are wired in `.claude/settings.json` and fire automatically:

- **SessionStart** → injects `knowledge/index.md` + most-recent daily log into every new session (the context you're seeing right now under "Knowledge Base Index")
- **SessionEnd / PreCompact** → extracts the conversation transcript and spawns `flush.py` in the background, which appends distilled notes to today's `daily/YYYY-MM-DD.md`
- **End-of-day** → after 6 PM local, `flush.py` triggers `compile.py`, which turns daily logs into concept/connection articles and updates the index

No manual curation is required in normal use.

### When to Consult the Wiki

Before answering a question about recurring project decisions, architecture, gotchas, or past debugging, **check `memory/knowledge/index.md` first**. If a relevant concept/connection/qa article exists, read it and cite it in your answer using `[[wikilinks]]`.

### Manual CLI (from `memory/`)

```bash
uv run python scripts/compile.py                # compile new/changed daily logs
uv run python scripts/query.py "your question"  # ask the KB
uv run python scripts/query.py "..." --file-back   # also save answer to knowledge/qa/
uv run python scripts/lint.py                   # 7 health checks
uv run python scripts/lint.py --structural-only # free, no LLM
```

### Authoring Rules (when compiling or editing articles directly)

- **Wikilinks**: `[[concepts/supabase-auth]]` (no `.md` extension, path relative to `knowledge/`)
- **Frontmatter**: every article needs YAML with `title`, `sources`, `created`, `updated`
- **Sources**: every article must link back to the `daily/YYYY-MM-DD.md` logs that fed it
- **File naming**: lowercase-kebab (`epdo-weights.md`, `cmf-state-data-flow.md`)
- **Style**: encyclopedia-tone, factual, self-contained
- **Prefer updating** an existing concept over creating a near-duplicate

See `memory/AGENTS.md` for the complete schema, article templates, hook internals, and customization guide.
