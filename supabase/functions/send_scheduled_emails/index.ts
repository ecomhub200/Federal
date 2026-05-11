// Round 16 §6 — scheduled-email transport (Deno Edge Function).
//
// Pulls due rows from email_send_queue, renders payload via the
// format_scheduled_report_email RPC, sends via SendGrid, then marks the row
// sent_at (or increments attempts + records error). Designed to be run from
// Supabase Edge cron every 5 minutes.
//
// Required env:
//   SUPABASE_URL                 — e.g. https://srv1503081.hstgr.cloud
//   SUPABASE_SERVICE_ROLE_KEY    — service role key (bypasses RLS)
//   SENDGRID_API_KEY             — SendGrid Bearer token
//   FROM_EMAIL                   — sender (default: reports@crashlens.local)

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const SUPABASE_URL   = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_KEY   = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SENDGRID_KEY   = Deno.env.get("SENDGRID_API_KEY")!;
const FROM_EMAIL     = Deno.env.get("FROM_EMAIL") || "reports@crashlens.local";

const REST = `${SUPABASE_URL}/rest/v1`;
const AUTH_HEADERS = {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
};

interface QueueRow {
    id: number;
    attempts: number;
    scheduled_for: string;
    sent_at: string | null;
}

interface FormattedEmail {
    to: string;
    subject: string;
    body_html: string;
    body_text?: string;
}

async function fetchDueQueue(): Promise<QueueRow[]> {
    const url = `${REST}/email_send_queue` +
        `?sent_at=is.null` +
        `&scheduled_for=lte.${new Date().toISOString()}` +
        `&select=id,attempts,scheduled_for,sent_at` +
        `&limit=50`;
    const resp = await fetch(url, { headers: AUTH_HEADERS });
    if (!resp.ok) throw new Error(`queue fetch failed: HTTP ${resp.status}`);
    return await resp.json();
}

async function formatEmail(queueId: number): Promise<FormattedEmail> {
    const resp = await fetch(`${REST}/rpc/format_scheduled_report_email`, {
        method: "POST",
        headers: { ...AUTH_HEADERS, "Content-Type": "application/json" },
        body: JSON.stringify({ p_queue_id: queueId }),
    });
    if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`format RPC failed: HTTP ${resp.status} ${txt}`);
    }
    return await resp.json();
}

async function sendViaSendGrid(payload: FormattedEmail): Promise<Response> {
    return await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SENDGRID_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            personalizations: [{ to: [{ email: payload.to }] }],
            from: { email: FROM_EMAIL },
            subject: payload.subject,
            content: [
                { type: "text/plain", value: payload.body_text || "" },
                { type: "text/html",  value: payload.body_html },
            ],
        }),
    });
}

async function patchQueue(id: number, patch: Record<string, unknown>): Promise<void> {
    await fetch(`${REST}/email_send_queue?id=eq.${id}`, {
        method: "PATCH",
        headers: {
            ...AUTH_HEADERS,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
        },
        body: JSON.stringify(patch),
    });
}

Deno.serve(async (_req: Request) => {
    const queueRows = await fetchDueQueue();
    const settled = await Promise.allSettled(queueRows.map(async (q) => {
        try {
            const payload = await formatEmail(q.id);
            const sgResp = await sendViaSendGrid(payload);
            if (sgResp.ok) {
                await patchQueue(q.id, { sent_at: new Date().toISOString(), error: null });
                return { id: q.id, ok: true };
            }
            const err = await sgResp.text();
            await patchQueue(q.id, { attempts: (q.attempts || 0) + 1, error: err.slice(0, 1000) });
            return { id: q.id, ok: false, error: err };
        } catch (e) {
            await patchQueue(q.id, {
                attempts: (q.attempts || 0) + 1,
                error: (e instanceof Error ? e.message : String(e)).slice(0, 1000),
            });
            return { id: q.id, ok: false, error: String(e) };
        }
    }));

    const processed = settled.length;
    const succeeded = settled.filter((r) => r.status === "fulfilled" && (r.value as any).ok).length;
    return new Response(JSON.stringify({ processed, succeeded }), {
        headers: { "Content-Type": "application/json" },
    });
});
