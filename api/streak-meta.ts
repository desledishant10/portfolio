/**
 * /api/streak-meta - tiny proxy that returns the Last-Modified timestamp of
 * the official TryHackMe streak image on S3.
 *
 * Why this exists: the browser can't read response headers cross-origin from
 * the S3 bucket (no CORS headers from tryhackme-images.s3.amazonaws.com), so
 * we proxy the HEAD request through our own origin. The widget then renders
 * "updated Xh ago" so visitors know how fresh the image really is - which is
 * useful because THM regenerates that S3 image on their own internal schedule
 * (observed: roughly once every 24-48 hours), not on demand.
 *
 * Hardening:
 *   - Username is allowlisted (no SSRF surface, no arbitrary user enumeration)
 *   - Only HEAD upstream, no body
 *   - CDN cache (s-maxage=300) so we never hammer S3
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_USERS = new Set(['ddesle3']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const requested = String(req.query.user || 'ddesle3').toLowerCase().slice(0, 32);
  if (!ALLOWED_USERS.has(requested)) {
    return res.status(400).json({ error: 'user not allowlisted' });
  }

  // CDN cache for 5 min, browser cache 1 min, stale-while-revalidate for 10 min.
  // This means a single Vercel edge region only HEADs S3 once per 5 min window.
  res.setHeader(
    'Cache-Control',
    'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    const upstream = await fetch(
      `https://tryhackme-images.s3.amazonaws.com/streak/${requested}.png`,
      { method: 'HEAD', cache: 'no-store' },
    );

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'upstream not ok', status: upstream.status });
    }

    const lastModified = upstream.headers.get('last-modified');
    const ts = lastModified ? new Date(lastModified).toISOString() : null;
    const ageSeconds = ts ? Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 1000)) : null;

    return res.status(200).json({
      user: requested,
      lastModified,
      ts,
      ageSeconds,
    });
  } catch (err) {
    console.error('[streak-meta] fetch failed', err);
    return res.status(502).json({ error: 'upstream fetch failed' });
  }
}
