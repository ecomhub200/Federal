/**
 * CRASH LENS — Supabase Auth wrapper
 *
 * Phase 1+2 of the Firebase→Supabase migration. This wrapper:
 *   - Initializes the Supabase JS client (URL + anon key from config.json)
 *   - Exposes window.SupabaseAuth.{signIn,signUp,signOut,getUser,getProfile,upsertProfile}
 *   - Mirrors the CrashLensAuth API surface so Phase 3 (provider cutover) can
 *     swap implementations behind a single feature flag.
 *
 * Behavior:
 *   - When featureFlags.useSupabaseAuth === false (default): wrapper is loaded
 *     but never auto-fires onAuthStateChange. Firebase remains the auth provider.
 *   - When featureFlags.supabaseAuthDualWrite === true: CrashLensAuth's
 *     ensureUserDocument + updateUserProfile call SupabaseAuth.upsertProfile()
 *     to keep the profiles table fresh.
 *   - Phase 3 flips useSupabaseAuth to true; Firebase calls become no-ops.
 *
 * The wrapper has NO side effects on initial load beyond creating the client.
 * Safe to ship before backend is ready.
 */

(function (global) {
    'use strict';

    // ============================================================
    // Identity bridge — Firebase UID -> Supabase auth.users.id (UUID v5)
    // ============================================================
    // Phase 1+2 sync script (scripts/firestore-to-supabase-sync.js) derives
    // every Supabase auth.users.id deterministically from the Firebase UID
    // using uuidv5 + this fixed namespace. The frontend MUST use the same
    // derivation so dual-writes hit the right row and OAuth re-sign-in
    // matches the pre-seeded auth.users row by email + identity.
    //
    // NEVER change CRASHLENS_FIREBASE_NS — it would break the mapping for
    // every migrated user. Verified deployed 2026-05-12 across 25 users.
    var CRASHLENS_FIREBASE_NS = '8e3a0f3d-7b2a-4e5c-9f6a-1c2d3e4f5a6b';

    // RFC-4122 UUID v5 (SHA-1, namespace-based). Inlined to avoid pulling
    // a CDN dep — the algorithm is ~30 LOC and stable since 2005.
    function _bytesToHex(bytes) {
        var s = '';
        for (var i = 0; i < bytes.length; i++) {
            s += (bytes[i] + 0x100).toString(16).slice(1);
        }
        return s;
    }
    function _stringToBytes(str) {
        var u = unescape(encodeURIComponent(str));
        var out = new Array(u.length);
        for (var i = 0; i < u.length; i++) out[i] = u.charCodeAt(i);
        return out;
    }
    function _uuidStringToBytes(uuid) {
        var hex = uuid.replace(/-/g, '');
        var bytes = new Array(16);
        for (var i = 0; i < 16; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
        return bytes;
    }
    async function _sha1Bytes(bytes) {
        var src = new Uint8Array(bytes);
        var digest = await crypto.subtle.digest('SHA-1', src);
        return new Uint8Array(digest).slice(0, 16);
    }
    /**
     * Derive a deterministic UUID v5 from `name` within `namespace`.
     * `namespace` is a UUID string. Returns a UUID string (lowercase).
     */
    async function uuidv5(name, namespace) {
        var nsBytes = _uuidStringToBytes(namespace);
        var nameBytes = _stringToBytes(String(name));
        var combined = nsBytes.concat(nameBytes);
        var hash = await _sha1Bytes(combined);
        hash[6] = (hash[6] & 0x0f) | 0x50;
        hash[8] = (hash[8] & 0x3f) | 0x80;
        var h = _bytesToHex(hash);
        return h.substr(0, 8) + '-' + h.substr(8, 4) + '-' + h.substr(12, 4) + '-' + h.substr(16, 4) + '-' + h.substr(20, 12);
    }

    // Cache derivations per-session — UUID v5 of the same input is always identical.
    var _uuidCache = Object.create(null);
    async function firebaseUidToSupabaseUuid(firebaseUid) {
        if (!firebaseUid) return null;
        var key = String(firebaseUid);
        if (_uuidCache[key]) return _uuidCache[key];
        var u = await uuidv5(key, CRASHLENS_FIREBASE_NS);
        _uuidCache[key] = u;
        return u;
    }
    function firebaseUidToSupabaseUuidSync(firebaseUid) {
        if (!firebaseUid) return null;
        return _uuidCache[String(firebaseUid)] || null;
    }

    var _client = null;
    var _initialized = false;
    var _authStateCallbacks = [];

    function _readConfig() {
        try {
            return (global.appConfig && global.appConfig.apis && global.appConfig.apis.supabase) || null;
        } catch (e) { return null; }
    }

    function _readFeatureFlag(name) {
        try {
            return !!(global.appConfig && global.appConfig.featureFlags && global.appConfig.featureFlags[name]);
        } catch (e) { return false; }
    }

    /**
     * Initialize the Supabase JS client. Idempotent — safe to call multiple
     * times. Returns the client instance.
     *
     * Uses the same supabaseUrl + anon key the matview reads already use
     * (sourced from config.json or defaults baked into data-client.js).
     */
    function _ensureClient() {
        if (_client) return _client;
        if (typeof global.supabase !== 'object' || typeof global.supabase.createClient !== 'function') {
            console.warn('[SupabaseAuth] Supabase JS SDK not loaded — wrapper inert');
            return null;
        }
        // Pull URL + key from the same source data-client.js uses.
        // Falls back to data-client's DEFAULTS if config.json doesn't override.
        var supaCfg = _readConfig() || {};
        var dcDefaults = (global.crashLensClient || {});
        var url = supaCfg.url
                || dcDefaults.supabaseUrl
                || 'https://srv1503081.hstgr.cloud/rest/v1';
        // Strip the /rest/v1 suffix — Supabase client wants the base URL
        url = String(url).replace(/\/rest\/v\d+\/?$/, '');
        var anonKey = supaCfg.anonKey
                   || dcDefaults.supabaseKey
                   || null;
        if (!url || !anonKey) {
            // Silent — the bootstrap poller (bottom of IIFE) logs once
            // after 5s if config genuinely never lands. Returning null here
            // also lets callers retry once config is hydrated.
            return null;
        }
        _client = global.supabase.createClient(url, anonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storageKey: 'crashlens-supabase-auth-token'
            }
        });
        return _client;
    }

    /**
     * Auth state listener. Fires on session restore + every sign-in/out.
     * Only attached when featureFlags.useSupabaseAuth === true (Phase 3).
     */
    function _initAuthStateListener() {
        var c = _ensureClient();
        if (!c || _initialized) return;
        _initialized = true;
        c.auth.onAuthStateChange(function (event, session) {
            console.log('[SupabaseAuth] state change:', event, session ? session.user.email : 'no session');
            _authStateCallbacks.forEach(function (cb) {
                try { cb(session ? session.user : null, event, session); } catch (e) { /* swallow */ }
            });
        });
        // Surface initial session so callers see existing sign-in state immediately.
        c.auth.getSession().then(function (res) {
            var user = res && res.data && res.data.session ? res.data.session.user : null;
            _authStateCallbacks.forEach(function (cb) {
                try { cb(user, 'INITIAL_SESSION', res.data.session); } catch (e) { /* swallow */ }
            });
        });
    }

    var SupabaseAuth = {
        /**
         * Phase 3 entry point. Subscribes a callback to auth-state changes.
         * Equivalent to firebase.auth().onAuthStateChanged + initial fire.
         */
        init: function (callback) {
            if (typeof callback === 'function') _authStateCallbacks.push(callback);
            if (_readFeatureFlag('useSupabaseAuth')) {
                _initAuthStateListener();
            }
            // When the flag is false, do nothing. Firebase owns the session.
        },

        /**
         * Returns the current Supabase user (or null). Synchronous read of
         * the session cache. For an authoritative fetch, await getUserAsync().
         */
        getUser: function () {
            var c = _ensureClient();
            if (!c) return null;
            // The session cache is populated after sign-in or page load
            try {
                // supabase-js v2 doesn't have a sync user getter; expose the
                // last-known session via a localStorage probe.
                var raw = localStorage.getItem('crashlens-supabase-auth-token');
                if (!raw) return null;
                var parsed = JSON.parse(raw);
                return (parsed && parsed.user) || null;
            } catch (e) { return null; }
        },

        getUserAsync: async function () {
            var c = _ensureClient();
            if (!c) return null;
            var res = await c.auth.getUser();
            return res && res.data && res.data.user ? res.data.user : null;
        },

        signInWithEmail: async function (email, password) {
            var c = _ensureClient();
            if (!c) throw new Error('Supabase client unavailable');
            var res = await c.auth.signInWithPassword({ email: email, password: password });
            if (res.error) throw res.error;
            return res.data.user;
        },

        signUpWithEmail: async function (email, password, profileData) {
            var c = _ensureClient();
            if (!c) throw new Error('Supabase client unavailable');
            var res = await c.auth.signUp({
                email: email,
                password: password,
                options: { data: profileData || {} }   // stored in user_metadata
            });
            if (res.error) throw res.error;
            // Note: with email-confirm-required policies, res.data.user is non-null
            // but session is null until verification completes.
            return res.data.user;
        },

        signInWithGoogle: async function () {
            var c = _ensureClient();
            if (!c) throw new Error('Supabase client unavailable');
            var res = await c.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin + window.location.pathname }
            });
            if (res.error) throw res.error;
            return res.data;
        },

        signInWithMicrosoft: async function () {
            var c = _ensureClient();
            if (!c) throw new Error('Supabase client unavailable');
            var res = await c.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'email openid profile',
                    redirectTo: window.location.origin + window.location.pathname
                }
            });
            if (res.error) throw res.error;
            return res.data;
        },

        signOut: async function () {
            var c = _ensureClient();
            if (!c) return;
            await c.auth.signOut();
        },

        /**
         * Read the user's profile row. Returns null if no row exists or
         * if the wrapper is inert (no client / no auth).
         */
        getProfile: async function (userId) {
            var c = _ensureClient();
            if (!c) return null;
            if (!userId) {
                var u = await SupabaseAuth.getUserAsync();
                if (!u) return null;
                userId = u.id;
            }
            var res = await c.from('profiles').select('*').eq('user_id', userId).single();
            if (res.error && res.error.code !== 'PGRST116' /* no rows */) {
                console.warn('[SupabaseAuth] getProfile failed:', res.error.message);
                return null;
            }
            return res.data || null;
        },

        /**
         * Upsert a profile row. Used by the dual-write hooks in auth.js.
         * Caller passes the SAME shape as the Firestore user-doc but with
         * snake_case keys mapped via _mapFirestoreFieldsToProfile().
         *
         * Returns the upserted row, or null on failure (logged, non-fatal).
         */
        upsertProfile: async function (profileData) {
            if (!_readFeatureFlag('supabaseAuthDualWrite')) return null;
            var c = _ensureClient();
            if (!c) return null;
            var res = await c.from('profiles').upsert(profileData, { onConflict: 'user_id' });
            if (res.error) {
                console.warn('[SupabaseAuth] upsertProfile failed (non-fatal):', res.error.message);
                return null;
            }
            return res.data;
        },

        /**
         * Translate a Firestore user-doc shape to the public.profiles row
         * shape. Drops Firebase-specific fields (Firestore Timestamp wrappers,
         * etc.).
         *
         * **Phase 3 update**: `user_id` is now the deterministic UUID v5
         * derived from the Firebase UID via firebaseUidToSupabaseUuid above.
         * This makes dual-write hit the pre-seeded auth.users row instead of
         * creating an orphan that would fail the FK to auth.users(id).
         *
         * NOTE: this function is now ASYNC. All callers (auth.js dual-write
         * hooks at lines 342-355, 537-540) must `await` it.
         */
        mapFirestoreToProfile: async function (firebaseUid, firestoreDoc) {
            if (!firebaseUid || !firestoreDoc) return null;
            var d = firestoreDoc;
            var supabaseUserId = await firebaseUidToSupabaseUuid(firebaseUid);
            if (!supabaseUserId) return null;
            var isoOrNull = function (ts) {
                try {
                    if (!ts) return null;
                    if (ts.toDate) return ts.toDate().toISOString();
                    if (typeof ts === 'string') return ts;
                    if (ts.seconds) return new Date(ts.seconds * 1000).toISOString();
                } catch (e) { /* noop */ }
                return null;
            };
            return {
                user_id: supabaseUserId,                      // <-- was firebaseUid (BROKEN)
                email: d.email || null,
                display_name: d.displayName || null,
                photo_url: d.photoURL || null,
                home_tier: d.userTier || (d.userJurisdiction ? 'county' : 'state'),
                home_state: (d.userStateName || d.userState || '').toLowerCase() || null,
                home_state_fips: d.userState || null,
                home_jurisdiction_id: d.userJurisdiction || null,
                home_jurisdiction_name: d.userJurisdictionName || null,
                employee_type: d.employeeType || null,
                organization_id: d.organizationId || null,
                organization_name: d.organizationName || null,
                plan: d.plan || 'trial',
                billing_cycle: d.billingCycle || null,
                trial_started_at: isoOrNull(d.trialStartedAt),
                trial_ends_at: isoOrNull(d.trialEndsAt),
                subscription_status: d.subscriptionStatus || 'pending_verification',
                stripe_customer_id: d.stripeCustomerId || null,
                stripe_subscription_id: d.stripeSubscriptionId || null,
                ai_queries_used_this_month: (d.ai && d.ai.queriesUsedThisMonth) || 0,
                ai_queries_limit: (d.ai && d.ai.queriesLimit) || 0,
                ai_quota_reset_date: isoOrNull(d.ai && d.ai.quotaResetDate),
                ai_use_byok: !!(d.ai && d.ai.useBYOK),
                email_verified: !!d.emailVerified,
                email_verified_at: isoOrNull(d.emailVerifiedAt),
                profile_complete: !!d.profileComplete,
                profile_completed_at: isoOrNull(d.profileCompletedAt),
                updated_at: new Date().toISOString()
            };
        },

        /**
         * Convert a Firebase UID into the deterministic Supabase auth.users.id
         * (UUID v5). Use this anywhere code holds a Firebase UID and needs
         * to query/upsert against public.profiles or auth.users.
         *
         * Async because the underlying SHA-1 uses Web Crypto SubtleCrypto.
         * Memoized per-session.
         */
        firebaseUidToSupabaseUuid: firebaseUidToSupabaseUuid,
        firebaseUidToSupabaseUuidSync: firebaseUidToSupabaseUuidSync,

        /** Diagnostic — call from DevTools to inspect wrapper state. */
        debug: function () {
            return {
                client: !!_client,
                initialized: _initialized,
                useSupabaseAuth: _readFeatureFlag('useSupabaseAuth'),
                supabaseAuthDualWrite: _readFeatureFlag('supabaseAuthDualWrite'),
                cachedUser: SupabaseAuth.getUser(),
                callbacks: _authStateCallbacks.length
            };
        }
    };

    global.SupabaseAuth = SupabaseAuth;

    // ====================================================================
    // Lazy / deferred init — supabase-auth.js parses BEFORE config.json
    // and data-client.js finish populating window.appConfig + crashLensClient.
    // The original eager init at IIFE end fired before those were ready,
    // producing two false-positive "wrapper inert" warnings and leaving
    // _client = null for the rest of the session.
    //
    // Strategy: poll a few times (~5 sec total) waiting for either signal,
    // then init. Most page loads resolve within 100-500 ms. Any
    // SupabaseAuth.{signInWith*,getProfile,upsertProfile,...} call also
    // re-attempts via _ensureClient() lazily, so a missed poll still works
    // — this is just to warm the client + cache the wrapper-loaded log.
    // ====================================================================
    var _configWaitAttempts = 0;
    var _configWaitMax = 50;             // 50 × 100 ms = 5 sec total
    function _initWhenConfigReady() {
        var cfgReady = !!(global.appConfig && global.appConfig.apis && global.appConfig.apis.supabase)
                    || !!(global.crashLensClient && global.crashLensClient.supabaseUrl && global.crashLensClient.supabaseKey);
        if (cfgReady) {
            _ensureClient();
            console.log('[SupabaseAuth] wrapper loaded — flags:', SupabaseAuth.debug());
            return;
        }
        _configWaitAttempts++;
        if (_configWaitAttempts >= _configWaitMax) {
            console.warn('[SupabaseAuth] config never became available after 5s — wrapper remains inert. ' +
                         'Check appConfig.apis.supabase or crashLensClient.supabaseUrl/Key are populated.');
            return;
        }
        setTimeout(_initWhenConfigReady, 100);
    }
    _initWhenConfigReady();

    // Self-test on load — verifies the v5 derivation is correct. If this
    // ever prints MISMATCH, the namespace constant or algorithm has drifted
    // and dual-writes will start landing on the wrong row.
    (async function _selfTest() {
        try {
            var sample = 'self-test-fixture-firebase-uid';
            var expected = await uuidv5(sample, CRASHLENS_FIREBASE_NS);
            var got = await firebaseUidToSupabaseUuid(sample);
            if (got !== expected) {
                console.error('[SupabaseAuth] UUID v5 self-test FAILED:', { expected: expected, got: got });
            } else {
                console.debug('[SupabaseAuth] UUID v5 self-test ok ->', got);
            }
        } catch (e) {
            console.error('[SupabaseAuth] UUID v5 self-test threw:', e && e.message);
        }
    })();
})(window);
