/**
 * Refresh public/thm-stats.json with live TryHackMe stats.
 *
 * Why a headless browser: TryHackMe's public-profile badge endpoint sits behind
 * a bot challenge (Vercel Security Checkpoint) that blocks plain server-side
 * fetches. A real browser (Playwright / Chromium) solves the challenge and
 * renders the badge, so we drive one and scrape the numbers from the DOM. The
 * portfolio's Hero card fetches this committed JSON at runtime, so it never has
 * to hit TryHackMe itself.
 *
 * Run locally:
 *   npm i playwright && npx playwright install chromium
 *   npm run thm:refresh
 *
 * In CI this runs on a schedule (.github/workflows/thm-stats.yml).
 * On any failure it exits non-zero WITHOUT touching the JSON, so a blocked or
 * partial run never clobbers the last-good stats.
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'public', 'thm-stats.json');
const PUBLIC_ID = process.env.THM_PUBLIC_ID || '2202803';
const URL = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${PUBLIC_ID}`;

// Runs inside the page (same origin as TryHackMe), so it can read the badge DOM
// the challenge blocks us from reading server-side. Kept in sync with the badge
// markup: 4 ".details-text" spans in order -> points, streak, badges, rooms.
function extract() {
  const details = [...document.querySelectorAll('.details-text')].map((e) => e.textContent.trim());
  const digits = (s) => {
    if (!s) return null;
    const d = s.replace(/[^0-9]/g, '');
    return d ? Number(d) : null;
  };
  return {
    username: document.querySelector('.user_name')?.textContent?.trim() ?? null,
    rank: document.querySelector('.rank-title')?.textContent?.trim() ?? null,
    points: digits(details[0]),
    streakRaw: details[1] ?? null,
    streakDays: details[1] ? Number((details[1].match(/\d+/) || [])[0]) : null,
    badges: digits(details[2]),
    rooms: digits(details[3]),
    avatarUrl:
      (document.body.innerHTML.match(
        /https:\/\/tryhackme-images\.s3\.amazonaws\.com\/user-avatars\/[^)'"\s]+/,
      ) || [])[0] ?? null,
    _count: details.length,
  };
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    viewport: { width: 1000, height: 700 },
  });

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60_000 });
  // Wait for the badge to render, i.e. the challenge has been solved.
  await page.waitForSelector('.details-text', { timeout: 45_000 });

  const data = await page.evaluate(extract);

  if (!data.username || data.points == null || data._count < 4) {
    throw new Error(`incomplete scrape (challenge not solved?): ${JSON.stringify(data)}`);
  }
  delete data._count;

  const next = { ...data, fetchedAt: new Date().toISOString() };

  // Only rewrite when a stat actually changed (ignore the timestamp), so we
  // don't create a commit every run when nothing moved.
  let prev = null;
  try {
    prev = JSON.parse(readFileSync(OUT, 'utf8'));
  } catch {
    /* first run or unreadable - treat as changed */
  }
  const unchanged =
    prev &&
    prev.username === next.username &&
    prev.rank === next.rank &&
    prev.points === next.points &&
    prev.streakDays === next.streakDays &&
    prev.badges === next.badges &&
    prev.rooms === next.rooms &&
    prev.avatarUrl === next.avatarUrl;

  if (unchanged) {
    console.log('[thm-stats] no change; leaving file as-is');
  } else {
    writeFileSync(OUT, JSON.stringify(next, null, 2) + '\n');
    console.log('[thm-stats] updated:', next);
  }
} finally {
  await browser.close();
}
