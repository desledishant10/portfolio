/**
 * /api/contact — serverless contact form handler.
 *
 * Security model (defense in depth — each layer is independent):
 *
 *  1. Method gate              — POST only; OPTIONS returns 204 for completeness.
 *  2. Content-Type gate        — only application/json bodies are processed.
 *  3. IP rate limit            — 3 requests / 60s per IP, in-memory bucket map with
 *                                periodic cleanup + size cap (prevents slow leak).
 *  4. Server-side honeypot     — rejects requests where the "website" field is set
 *                                (bots fill all fields; humans don't see this one).
 *  5. Field validation         — required-field, length, email-format checks.
 *  6. CRLF stripping           — prevents email-header injection via name/email
 *                                fields that flow into Subject:/Reply-To:.
 *  7. Cloudflare Turnstile     — server-side siteverify; we also verify the
 *                                hostname claim matches an allowlist so a token
 *                                minted on a different site can't be replayed here.
 *  8. HTML escaping            — all user input is escaped before being inlined
 *                                into the email body HTML.
 *  9. No PII leakage in errors — error responses never echo user input.
 * 10. No caching               — explicit Cache-Control: no-store on every reply.
 *
 * Failures intentionally return generic messages (no "your IP X is blocked" etc.)
 * so an attacker can't probe the filter behavior.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import { Resend } from 'resend';

/**
 * Minimal local types for the Vercel Node runtime. The full `@vercel/node`
 * package is only needed for these two types during local type-checking - the
 * function runs under Vercel's own runtime in production - and it drags in a
 * large tree of vulnerable build-tooling deps (path-to-regexp, undici,
 * ts-morph, ...). We define exactly what this handler uses instead.
 */
type VercelRequest = IncomingMessage & {
  body: unknown;
};

type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
  send: (body: unknown) => VercelResponse;
};

type Body = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
  website?: string;
};

// ---------- rate limiting ----------
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const MAX_BUCKETS = 5_000;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();
let lastCleanup = 0;

function cleanupBuckets(now: number) {
  // Run at most once per window to avoid O(n) on every request.
  if (now - lastCleanup < RATE_LIMIT_WINDOW_MS) return;
  lastCleanup = now;
  for (const [k, v] of ipBuckets) {
    if (v.resetAt < now) ipBuckets.delete(k);
  }
}

// Hard cap on map size: evict oldest-inserted entries so a flood of unique IPs
// can't grow the map without bound between the once-a-minute cleanups. Called on
// every new-bucket insert (not just during cleanup) so the bound is real-time.
function evictIfOverCap() {
  while (ipBuckets.size > MAX_BUCKETS) {
    const firstKey = ipBuckets.keys().next().value;
    if (firstKey === undefined) break;
    ipBuckets.delete(firstKey);
  }
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  cleanupBuckets(now);
  const bucket = ipBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    evictIfOverCap();
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count++;
  return true;
}

// ---------- validation ----------
function isValidEmail(s: string): boolean {
  // RFC-shaped: local@domain.tld. Anchored, no whitespace, TLD min 2 chars.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function stripCrlf(s: string): string {
  // Used on values that feed email headers (Subject, Reply-To) — prevents
  // injection of additional headers like "\r\nBcc: attacker@evil.com".
  // eslint-disable-next-line no-control-regex -- stripping control bytes is the point
  return s.replace(/[\r\n\x00-\x1f\x7f]/g, '').slice(0, 256);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---------- Turnstile ----------
const ALLOWED_TURNSTILE_HOSTNAMES = new Set<string>([
  'dishant-desle-portfolio.vercel.app',
  // Add custom domain(s) here once configured:
  // 'dishantdesle.com',
  // Vercel previews:
  // 'localhost',
]);

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // Local dev / unconfigured: skip. But in any deployed (Vercel) environment
    // a missing secret must FAIL CLOSED, not silently accept every submission.
    return !process.env.VERCEL;
  }
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as {
      success?: boolean;
      hostname?: string;
      'error-codes'?: string[];
    };
    if (!data.success) {
      console.warn('turnstile verification failed', data['error-codes'] || []);
      return false;
    }
    // Bind token to expected hostname — prevents replay of a token minted on a
    // different domain (e.g. attacker proxies our site through their domain to
    // harvest tokens). If the response doesn't include hostname, fall through.
    if (
      data.hostname &&
      ALLOWED_TURNSTILE_HOSTNAMES.size > 0 &&
      !ALLOWED_TURNSTILE_HOSTNAMES.has(data.hostname) &&
      !data.hostname.endsWith('.vercel.app') // accept any preview/prod vercel host
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ---------- handler ----------
function applySecurityHeaders(res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, max-age=0, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  applySecurityHeaders(res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ error: 'method not allowed' });
  }

  // Reject anything that isn't JSON. Vercel auto-parses JSON bodies; other
  // content types yield unpredictable body shapes we don't want to handle.
  const ct = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (ct !== 'application/json') {
    return res.status(415).json({ error: 'unsupported media type' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'too many requests — try again in a minute' });
  }

  const rawBody = req.body;
  if (rawBody === null || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return res.status(400).json({ error: 'invalid body' });
  }
  const body = rawBody as Body;

  // Honeypot: a hidden form field bots fill but humans don't. Reject silently
  // with a 200 so the bot doesn't learn that it was filtered (no signal to
  // adapt against).
  const honeypot = String(body.website || '').trim();
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);
  const turnstileToken = String(body.turnstileToken || '').slice(0, 4096);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'missing required fields' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'invalid email' });
  }

  const ok = await verifyTurnstile(turnstileToken, ip);
  if (!ok) {
    return res.status(400).json({ error: 'captcha verification failed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error('missing email env vars');
    return res.status(500).json({ error: 'email service not configured' });
  }

  // CRLF-strip values that flow into mail headers (Subject + Reply-To).
  const safeName = stripCrlf(name);
  const safeEmail = stripCrlf(email);

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: safeEmail,
      subject: `Portfolio · ${safeName}`.slice(0, 200),
      html: `
        <div style="font-family:ui-monospace,Menlo,monospace;background:#0a0e14;color:#e6edf3;padding:24px;border-radius:8px;max-width:640px;">
          <h2 style="color:#22d3ee;margin:0 0 16px;">new message · portfolio</h2>
          <p style="margin:4px 0;"><strong style="color:#00ff9c;">from:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
          <p style="margin:4px 0;"><strong style="color:#00ff9c;">ip:</strong> ${escapeHtml(ip)}</p>
          <hr style="border:none;border-top:1px solid #1a2330;margin:16px 0;" />
          <pre style="white-space:pre-wrap;font-family:inherit;line-height:1.55;">${escapeHtml(message)}</pre>
        </div>
      `,
      text: `from: ${name} <${email}>\nip: ${ip}\n\n${message}`,
    });
    if (error) {
      console.error('resend error', error);
      return res.status(502).json({ error: 'send failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('handler error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
