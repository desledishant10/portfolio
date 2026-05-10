import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

type Body = {
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const ipBuckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    ipBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count++;
  return true;
}

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' });
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (!rateLimit(ip)) {
    return res.status(429).json({ error: 'too many requests — try again in a minute' });
  }

  const body = (req.body || {}) as Body;
  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 200);
  const message = String(body.message || '').trim().slice(0, 5000);
  const turnstileToken = String(body.turnstileToken || '');

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

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Portfolio · ${name}`,
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
