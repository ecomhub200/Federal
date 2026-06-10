/**
 * CL.app.stateBanner — surfaces a clear warning when the user's profile state
 * has no rows in the live Supabase matviews, instead of letting tabs / reports
 * silently render empty.
 *
 * Trigger: called after the data-client is initialized (DOMContentLoaded
 * handler in app/index.html). Probes a sentinel matview (`dashboard_summary`)
 * for the user's resolved state. If that state has zero rows AND at least one
 * other state has rows, shows a dismissible banner above the app shell.
 *
 * Jurisdiction-agnostic: never hardcodes a state name. The "active loaded
 * states" list is read live from Supabase. A user on Wyoming sees the same
 * banner with "Active loaded states: delaware" if Wyoming isn't loaded yet.
 *
 * Module conventions: CL.app namespace; ~150 LOC; no inline styles in HTML.
 */
(function () {
  'use strict';
  window.CL = window.CL || {};
  CL.app = CL.app || {};

  const BANNER_ID = 'cl-state-mismatch-banner';
  const DISMISS_KEY = 'cl.stateBanner.dismissed';
  const SENTINEL_MATVIEW = 'dashboard_summary';

  function readClient() {
    const c = window.crashLensClient;
    if (!c || !c.supabaseUrl || !c.supabaseKey) return null;
    const state = (c.state || '').toLowerCase();
    if (!state) return null;
    return { client: c, state };
  }

  function build(state, loadedStates) {
    const existing = document.getElementById(BANNER_ID);
    if (existing) existing.remove();
    const wrap = document.createElement('div');
    wrap.id = BANNER_ID;
    wrap.setAttribute('role', 'status');
    wrap.style.cssText = [
      'background: linear-gradient(90deg,#7f1d1d,#991b1b)',
      'color: #fff',
      'padding: 10px 16px',
      'font: 500 13px/1.4 system-ui, sans-serif',
      'display: flex',
      'align-items: center',
      'justify-content: space-between',
      'gap: 12px',
      'border-bottom: 1px solid rgba(0,0,0,0.2)',
      'z-index: 9999',
    ].join(';');
    const msg = document.createElement('div');
    const loadedTxt = loadedStates.length
      ? loadedStates.slice(0, 5).join(', ') + (loadedStates.length > 5 ? '…' : '')
      : '(none)';

    // Safe DOM construction — never set innerHTML with values derived from
    // user-controlled fields (profile state, matview column values). textContent
    // and appendChild are XSS-safe.
    msg.appendChild(document.createTextNode('⚠️ No live crash data is loaded for '));
    const stateEl = document.createElement('b');
    stateEl.textContent = state;
    msg.appendChild(stateEl);
    msg.appendChild(document.createTextNode(
      '. Tabs and reports will show empty results until the pipeline finishes. '
    ));
    const loadedEl = document.createElement('span');
    loadedEl.style.opacity = '0.85';
    loadedEl.textContent = 'Active loaded states: ' + loadedTxt + '.';
    msg.appendChild(loadedEl);
    const dismiss = document.createElement('button');
    dismiss.textContent = '✕';
    dismiss.setAttribute('aria-label', 'Dismiss');
    dismiss.style.cssText =
      'background:transparent;color:inherit;border:0;font-size:18px;cursor:pointer;padding:0 4px;';
    dismiss.addEventListener('click', function () {
      try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch (e) { /* ignore */ }
      wrap.remove();
    });
    wrap.appendChild(msg);
    wrap.appendChild(dismiss);
    const insertBefore = document.body.firstChild;
    document.body.insertBefore(wrap, insertBefore);
  }

  async function probeState(client, state) {
    const url = `${client.supabaseUrl}/${SENTINEL_MATVIEW}?state=eq.${encodeURIComponent(state)}&select=state&limit=1`;
    try {
      const resp = await fetch(url, {
        headers: {
          apikey: client.supabaseKey,
          Authorization: 'Bearer ' + client.supabaseKey,
          Prefer: 'count=exact',
        },
      });
      const range = resp.headers.get('content-range') || '*/0';
      const total = parseInt(range.split('/')[1] || '0', 10) || 0;
      return total;
    } catch (e) {
      return -1; // unknown — don't false-positive a banner on transient errors
    }
  }

  async function listLoadedStates(client) {
    // Distinct states currently present in the sentinel matview. PostgREST
    // exposes this via a small fetch + JS dedupe; keeps RPC churn out of the
    // banner critical path.
    const url = `${client.supabaseUrl}/${SENTINEL_MATVIEW}?select=state&limit=2000`;
    try {
      const resp = await fetch(url, {
        headers: { apikey: client.supabaseKey, Authorization: 'Bearer ' + client.supabaseKey },
      });
      if (!resp.ok) return [];
      const rows = await resp.json();
      const set = new Set((rows || []).map(r => (r.state || '').toLowerCase()).filter(Boolean));
      return Array.from(set).sort();
    } catch (e) {
      return [];
    }
  }

  CL.app.stateBanner = {
    async check() {
      try { if (sessionStorage.getItem(DISMISS_KEY) === '1') return; } catch (e) { /* ignore */ }
      const ctx = readClient();
      if (!ctx) return;
      const total = await probeState(ctx.client, ctx.state);
      if (total > 0) return; // happy path
      if (total < 0) return; // probe failed — stay quiet
      const loaded = await listLoadedStates(ctx.client);
      // If THIS state is in `loaded`, the sentinel was just slow; don't show.
      if (loaded.includes(ctx.state)) return;
      build(ctx.state, loaded);
    },
  };

  CL._registerModule && CL._registerModule('app/state-banner');

  // Run once a short delay after DOMContentLoaded so crashLensClient has been
  // initialized by the bootstrap path in app/index.html.
  function schedule() {
    setTimeout(function () {
      CL.app.stateBanner.check().catch(function () { /* swallow */ });
    }, 1500);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
