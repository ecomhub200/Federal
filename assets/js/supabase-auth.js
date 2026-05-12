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
            console.warn('[SupabaseAuth] missing supabase URL or anon key — wrapper inert');
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
         * shape. Drops Firebase-specific fields (createdAt timestamp object,
         * Firestore Timestamp wrappers, etc.).
         */
        mapFirestoreToProfile: function (firebaseUid, firestoreDoc) {
            if (!firebaseUid || !firestoreDoc) return null;
            var d = firestoreDoc;
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
                // Phase 2 — user_id is the FIREBASE uid for now. Phase 3 cutover
                // will create matching auth.users rows so the FK aligns.
                user_id: firebaseUid,
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
    // Eager client init so first dual-write call doesn't pay the SDK-load cost.
    // No auth-state listener attached unless useSupabaseAuth is true.
    _ensureClient();

    console.log('[SupabaseAuth] wrapper loaded — flags:', SupabaseAuth.debug());
})(window);
