# Survey C — Settings / Auth / Admin

Reference: commit `9be31e5` · `app/index.html` @ 142,804 LOC · 2026-05-17

Scope: inline settings/preferences UI, notification settings, account/profile
modal, API-key management, admin. Plus a determination of whether auth logic is
inline at all.

## Auth is NOT inline

Authentication (login/logout/session/Firebase init/Supabase auth) is **fully
contained in protected files** `assets/js/auth.js` and
`assets/js/supabase-auth.js`. Nothing auth-specific is inline in
`app/index.html`. **The "auth" branch of this survey is empty — there is no
Phase-4 auth extraction work, and "auth" should be dropped from the Phase-4
roadmap.**

## Genuine candidates (≥150 LOC, not extracted, not prompt-covered)

| Function | Start L | End L | LOC | Domain | Key deps | False positive? | Suggested cluster |
|---|---|---|---|---|---|---|---|
| `openEmailNotificationModal` | 32370 | 33067 | 698 | Email notification modal — Brevo email config, report-type selection (fatalities/injuries/PDO), grant alerts, BA monitoring, delivery schedule, localStorage + Firestore persistence | Brevo API, `localStorage`, Firestore, modal UI | No | `settings/email-notifications.js` |
| `populateAccountModal` | 122817 | 123022 | 206 | Account/profile modal — profile completion, state + jurisdiction selection persistence, MCP API-key display/generation, org name, employee type | Firestore, `localStorage`, state/jurisdiction selectors | No | `settings/account-profile.js` |

**Genuine ≥150 LOC: 904 · Blocks: 2 · False positives: 0**

## Below the bar (sub-150 LOC — NOT Phase-4 candidates at current bar)

72+ smaller settings/preference helpers in the 40–130 LOC range: settings
getters/setters, preference loaders (`_loadPreferencesFromFirestore`,
`saveUserPreferences`, …), org settings, API-key revocation helpers, etc.
Coherent as a future utility cluster but each is under the 150 bar; disposition
is a Murad decision (see master plan Q1).

## Cluster groupings

**Cluster C1 — Email notifications (698 LOC, + Survey A's 252 LOC = ~950 LOC)**
- `openEmailNotificationModal` (L32370–33067) is adjacent to Survey A's
  email-chip cluster (L33353–33604); ~285-line gap between them likely holds
  more email helpers. Combined coherent domain ≈ **950–1,235 LOC** →
  `settings/email-notifications.js`.
- ⚠️ Exceeds the 500-line module ceiling. `openEmailNotificationModal` **alone
  is 698 LOC**. Two options (Murad Q2): (a) oversized-exception, precedent
  `assets/transit-tab` / `reports/reports-pdf`; or (b) forced 2-way split
  (`-modal` / `-persistence`).

**Cluster C2 — Account / profile (206 LOC)**
- `populateAccountModal` (L122817–123022) → `settings/account-profile.js`.
  Clean single-function lift; far from the email band (L122k vs L32k) so it is
  a separate module, not part of C1.

## Aggregate

| Metric | Value |
|---|---|
| Genuine ≥150 LOC | 904 |
| Genuine blocks | 2 |
| False positives | 0 |
| Auth inline? | No — lives in protected `assets/js/` |
| Sub-150 helper tail | 72+ fns, 40–130 LOC each (not candidates at current bar) |
| Original Phase-4 estimate for this lane | ~5,000 LOC |
| **Estimate accuracy** | **Overstated; genuine ≥150 work is ~904 LOC, auth portion is zero** |
