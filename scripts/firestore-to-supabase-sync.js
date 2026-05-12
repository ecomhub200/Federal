#!/usr/bin/env node
/**
 * Firestore -> Supabase one-shot user sync
 * ----------------------------------------
 * Copies every Firebase Auth user into Supabase auth.users and seeds public.profiles.
 * Idempotent — safe to re-run. Defaults to DRY-RUN; pass --apply to actually write.
 *
 * Usage:
 *   # 1. Drop firebase-admin.json (Firebase service account JSON) next to this script
 *   # 2. Set env vars (or use a .env loader of your choice):
 *   #    SUPABASE_URL='https://srv1503081.hstgr.cloud'
 *   #    SUPABASE_SERVICE_ROLE_KEY='eyJ...'  (from /root/supabase/docker/.env -> SERVICE_ROLE_KEY)
 *   # 3. Install deps:  npm install
 *   # 4. DRY-RUN first: node firestore-to-supabase-sync.js
 *   # 5. Apply:         node firestore-to-supabase-sync.js --apply
 *
 * Optional flags:
 *   --apply              Actually write to Supabase (default: dry-run, no writes)
 *   --limit <N>          Stop after N users (useful for spot-check; default: all)
 *   --since <iso>        Only users created after this date (ISO 8601)
 *   --verbose            Print per-user details
 *   --skip-profiles      Only create auth.users; skip Firestore -> profiles upsert
 *   --service-account <path>   Path to Firebase admin JSON (default: ./firebase-admin.json)
 */

const fs = require("fs");
const path = require("path");

// ----- arg parsing -----
const args = process.argv.slice(2);
const APPLY        = args.includes("--apply");
const VERBOSE      = args.includes("--verbose");
const SKIP_PROFILE = args.includes("--skip-profiles");
const LIMIT        = parseInt(getFlag("--limit", "0"), 10) || Infinity;
const SINCE        = getFlag("--since", null);
const SA_PATH      = getFlag("--service-account", path.join(__dirname, "firebase-admin.json"));

function getFlag(name, fallback) {
    const i = args.indexOf(name);
    return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
}

// ----- preflight -----
if (!fs.existsSync(SA_PATH)) {
    console.error(`✗ Firebase service account JSON not found at: ${SA_PATH}`);
    console.error(`  Download from Firebase Console -> Project settings -> Service accounts -> Generate new private key`);
    process.exit(1);
}
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(`✗ Missing env vars. Need:`);
    console.error(`    SUPABASE_URL='https://srv1503081.hstgr.cloud'`);
    console.error(`    SUPABASE_SERVICE_ROLE_KEY='<from /root/supabase/docker/.env>'`);
    process.exit(1);
}

const { createClient } = require("@supabase/supabase-js");
const admin = require("firebase-admin");
const { v5: uuidv5 } = require("uuid");

// Fixed namespace for Crash Lens. NEVER change this — it's how Firebase UIDs
// map deterministically to Supabase auth.users.id. Re-runs are idempotent
// because uuidv5(firebaseUid, NS) always returns the same UUID for the same
// firebaseUid. Frontend dual-write code in assets/js/supabase-auth.js must
// use the SAME namespace to derive the same Supabase UUID for a logged-in
// Firebase user during the dual-write transition window.
const CRASHLENS_FIREBASE_NS = "8e3a0f3d-7b2a-4e5c-9f6a-1c2d3e4f5a6b";

function firebaseUidToSupabaseUuid(firebaseUid) {
    return uuidv5(String(firebaseUid), CRASHLENS_FIREBASE_NS);
}

admin.initializeApp({ credential: admin.credential.cert(require(SA_PATH)) });
const fbAuth = admin.auth();
const fbDb = admin.firestore();

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
});

// ----- helpers -----
function isoOrNull(ts) {
    if (!ts) return null;
    if (typeof ts === "object" && typeof ts.toDate === "function") return ts.toDate().toISOString();
    if (typeof ts === "object" && typeof ts._seconds === "number") return new Date(ts._seconds * 1000).toISOString();
    if (ts instanceof Date) return ts.toISOString();
    if (typeof ts === "string") return ts;
    return null;
}

// Map Firestore user doc -> public.profiles row.
// Mirrors the field shape the Phase 1+2 migration's profiles table expects.
function mapToProfile(uid, fbUser, doc) {
    const homeJurisdictionId = doc.userJurisdiction || null;
    return {
        user_id: uid,
        email: doc.email || fbUser.email || null,
        display_name: doc.displayName || fbUser.displayName || null,
        photo_url: doc.photoURL || fbUser.photoURL || null,

        // Tier defaults — fall back to 'state' if no jurisdiction known
        home_tier: homeJurisdictionId ? "county" : "state",
        home_state: (doc.userStateName || doc.userState || "").toString().toLowerCase() || null,
        home_state_fips: doc.userState || null,
        home_jurisdiction_id: homeJurisdictionId,
        home_jurisdiction_name: doc.userJurisdictionName || null,

        // Role / org
        employee_type: doc.employeeType || null,
        organization_name: doc.organizationName || null,
        // role/organization_id intentionally left to defaults (CHECK allows 'user')

        // Subscription mirror
        plan: doc.plan || "trial",
        billing_cycle: doc.billingCycle || null,
        trial_started_at: isoOrNull(doc.trialStartedAt),
        trial_ends_at: isoOrNull(doc.trialEndsAt),
        subscription_status: doc.subscriptionStatus || "pending_verification",
        stripe_customer_id: doc.stripeCustomerId || null,
        stripe_subscription_id: doc.stripeSubscriptionId || null,

        // AI quota
        ai_queries_used_this_month: (doc.ai && doc.ai.queriesUsedThisMonth) || 0,
        ai_queries_limit: (doc.ai && doc.ai.queriesLimit) || 0,
        ai_quota_reset_date: isoOrNull(doc.ai && doc.ai.quotaResetDate),
        ai_use_byok: !!(doc.ai && doc.ai.useBYOK),

        // Verification
        email_verified: !!(doc.emailVerified || fbUser.emailVerified),
        email_verified_at: isoOrNull(doc.emailVerifiedAt),
        profile_complete: !!doc.profileComplete,
        profile_completed_at: isoOrNull(doc.profileCompletedAt),
    };
}

// ----- per-user pipeline -----
async function syncOne(fbUser) {
    const firebaseUid = fbUser.uid;
    const supabaseUuid = firebaseUidToSupabaseUuid(firebaseUid);  // deterministic v5 derivation
    const email = fbUser.email || "(no email)";

    // 1. Check Supabase auth.users by the derived UUID
    let { data: existing } = await sb.auth.admin.getUserById(supabaseUuid).catch(() => ({ data: null }));
    let createdAuthUser = false;
    if (!existing?.user) {
        if (APPLY) {
            const { error } = await sb.auth.admin.createUser({
                id: supabaseUuid,                       // UUID v5 derived from Firebase UID
                email: fbUser.email,
                email_confirm: !!fbUser.emailVerified,
                user_metadata: {
                    firebase_uid: firebaseUid,          // original Firebase UID preserved here
                    provider: fbUser.providerData?.[0]?.providerId || "unknown",
                    migrated_at: new Date().toISOString(),
                },
            });
            if (error) {
                return { ok: false, email, reason: `auth.users.createUser: ${error.message}` };
            }
            createdAuthUser = true;
        } else {
            createdAuthUser = true;  // would have been created
        }
    }

    if (SKIP_PROFILE) {
        return { ok: true, email, createdAuthUser, profileUpserted: false, dryRun: !APPLY };
    }

    // 2. Pull Firestore user doc (still keyed by Firebase UID) and upsert profile row (keyed by Supabase UUID)
    const docSnap = await fbDb.collection("users").doc(firebaseUid).get();
    if (!docSnap.exists) {
        return { ok: true, email, createdAuthUser, profileUpserted: false, reason: "no Firestore doc", dryRun: !APPLY };
    }
    const profileRow = mapToProfile(supabaseUuid, fbUser, docSnap.data());

    if (APPLY) {
        const { error } = await sb.from("profiles").upsert(profileRow, { onConflict: "user_id" });
        if (error) {
            return { ok: false, email, createdAuthUser, reason: `profiles.upsert: ${error.message}` };
        }
    }
    return { ok: true, email, createdAuthUser, profileUpserted: true, dryRun: !APPLY };
}

// ----- main loop -----
async function main() {
    console.log(`============================================================`);
    console.log(` Firestore -> Supabase user sync`);
    console.log(`   Mode: ${APPLY ? "APPLY (writes enabled)" : "DRY-RUN (no writes)"}`);
    console.log(`   Supabase URL: ${SUPABASE_URL}`);
    console.log(`   Service account: ${SA_PATH}`);
    if (LIMIT !== Infinity) console.log(`   Limit: ${LIMIT}`);
    if (SINCE) console.log(`   Since: ${SINCE}`);
    if (SKIP_PROFILE) console.log(`   Skipping profile upserts (auth.users only)`);
    console.log(`============================================================\n`);

    let nextPageToken = undefined;
    let total = 0, ok = 0, fail = 0, newAuth = 0, profilesWritten = 0, skipped = 0;
    const failures = [];
    const sinceMs = SINCE ? Date.parse(SINCE) : null;

    outer:
    do {
        const result = await fbAuth.listUsers(1000, nextPageToken);
        for (const u of result.users) {
            if (sinceMs && Date.parse(u.metadata?.creationTime || 0) < sinceMs) continue;
            if (total >= LIMIT) break outer;
            total++;

            const r = await syncOne(u);
            if (r.ok) {
                ok++;
                if (r.createdAuthUser) newAuth++;
                if (r.profileUpserted) profilesWritten++;
                if (r.reason === "no Firestore doc") skipped++;
                if (VERBOSE) console.log(`  ✓ ${r.email}${r.reason ? `  (${r.reason})` : ""}`);
            } else {
                fail++;
                failures.push(r);
                console.warn(`  ✗ ${r.email}: ${r.reason}`);
            }

            if (total % 25 === 0) {
                console.log(`[progress] ${total} processed | ${ok} ok | ${fail} fail | ${newAuth} new auth.users | ${profilesWritten} profiles upserted`);
            }
        }
        nextPageToken = result.pageToken;
    } while (nextPageToken);

    console.log(`\n============================================================`);
    console.log(` Done.`);
    console.log(`   Total processed:        ${total}`);
    console.log(`   Successful:             ${ok}`);
    console.log(`   Failed:                 ${fail}`);
    console.log(`   New auth.users:         ${newAuth}${APPLY ? "" : " (would be created)"}`);
    console.log(`   Profile rows upserted:  ${profilesWritten}${APPLY ? "" : " (would be upserted)"}`);
    console.log(`   No Firestore doc:       ${skipped}`);
    if (!APPLY) console.log(`\n   ** DRY-RUN: re-run with --apply to actually write **`);
    console.log(`============================================================`);

    if (fail > 0) {
        console.log(`\nFailures detail:`);
        for (const f of failures.slice(0, 20)) console.log(`  - ${f.email}: ${f.reason}`);
        if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
        process.exit(2);
    }
}

main().catch(e => {
    console.error(`✗ fatal:`, e);
    process.exit(1);
});
