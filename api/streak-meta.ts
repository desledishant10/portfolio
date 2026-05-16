/**
 * /api/streak-meta - server-side proxy that returns LIVE TryHackMe stats
 * for the configured public profile.
 *
 * Upstream: https://tryhackme.com/api/v2/badges/public-profile?userPublicId=<id>
 *           (returns an HTML embed widget, not JSON, so we scrape it server-side)
 *
 * We do this proxy because:
 *   - The browser can't read response bodies / headers cross-origin from THM
 *     without CORS, and THM doesn't send CORS on that endpoint.
 *   - Parsing once on the edge + caching also saves bandwidth and shields THM
 *     from us hammering them on every page load.
 *
 * Hardening:
 *   - Public IDs are allowlisted (no SSRF / enumeration surface).
 *   - Only the specific upstream URL is fetched; query string is constructed
 *     from the allowlisted value, never user input.
 *   - Short CDN cache (s-maxage=60) so visitors share a single response per
 *     minute per edge region.
 *   - Returns generic JSON errors; no upstream HTML is leaked.
 */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_PUBLIC_IDS = new Set(['2202803']);

type ThmStatus = {
  username: string | null;
  rank: string | null;
  points: number | null;
  streakDays: number | null;
  streakRaw: string | null;
  badges: number | null;
  rooms: number | null;
  avatarUrl: string | null;
  fetchedAt: string;
};

function parseInt(s: string | undefined | null): number | null {
  if (!s) return null;
  const digits = s.replace(/[^0-9]/g, '');
  if (!digits) return null;
  const n = Number(digits);
  return Number.isFinite(n) ? n : null;
}

function parseStreakDays(raw: string | null): number | null {
  if (!raw) return null;
  // matches "7 days", "1 day", "0 days"
  const m = raw.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

function scrape(html: string): Omit<ThmStatus, 'fetchedAt'> {
  // 4 stats appear in fixed order inside the badge HTML:
  //   trophy (points) -> fire (streak) -> award (badges) -> door (rooms)
  // We grab all "details-text" spans in order and map by index.
  const detailsMatches = [...html.matchAll(/<span class="details-text">([^<]+)<\/span>/g)];
  const stats = detailsMatches.map((m) => m[1].trim());

  const username = (html.match(/<span class="user_name">([^<]+)<\/span>/) || [])[1] ?? null;
  const rank = (html.match(/<span class="rank-title">([^<]+)<\/span>/) || [])[1] ?? null;
  const avatarUrl =
    (html.match(/url\((https:\/\/tryhackme-images\.s3\.amazonaws\.com\/user-avatars\/[^)'"\s]+)\)/) || [])[1] ??
    null;

  return {
    username,
    rank,
    points: parseInt(stats[0]),
    streakDays: parseStreakDays(stats[1] ?? null),
    streakRaw: stats[1] ?? null,
    badges: parseInt(stats[2]),
    rooms: parseInt(stats[3]),
    avatarUrl,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  const id = String(req.query.id || '2202803').replace(/[^0-9]/g, '').slice(0, 32);
  if (!ALLOWED_PUBLIC_IDS.has(id)) {
    return res.status(400).json({ error: 'public id not allowlisted' });
  }

  // Browser caches for 30s; CDN serves cached for 60s; stale-while-revalidate
  // up to 5 min if the proxy is slow. Keeps THM unburdened, keeps us fast.
  res.setHeader(
    'Cache-Control',
    'public, max-age=30, s-maxage=60, stale-while-revalidate=300',
  );
  res.setHeader('X-Content-Type-Options', 'nosniff');

  try {
    const upstream = await fetch(
      `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${id}`,
      {
        headers: {
          // Embed endpoint returns HTML; identify as a plain browser so we
          // get the same content a normal embedder would.
          'User-Agent': 'Mozilla/5.0 (compatible; portfolio-thm-fetch/1.0)',
          Accept: 'text/html,application/xhtml+xml',
        },
        cache: 'no-store',
      },
    );

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'upstream not ok', status: upstream.status });
    }

    const html = await upstream.text();
    const parsed = scrape(html);

    const status: ThmStatus = {
      ...parsed,
      fetchedAt: new Date().toISOString(),
    };

    return res.status(200).json(status);
  } catch (err) {
    console.error('[streak-meta] fetch failed', err);
    return res.status(502).json({ error: 'upstream fetch failed' });
  }
}
