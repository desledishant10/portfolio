import { useCallback, useEffect, useRef, useState } from 'react';
import { Award, ExternalLink, RefreshCw, ShieldCheck, Trophy } from 'lucide-react';
import { badges, profile, type Badge } from '../data/content';

const accentMap = {
  green: { ring: 'border-neon-green/40', text: 'text-neon-green', glow: 'hover:shadow-glow-green' },
  cyan: { ring: 'border-neon-cyan/40', text: 'text-neon-cyan', glow: 'hover:shadow-glow-cyan' },
  violet: { ring: 'border-neon-violet/40', text: 'text-neon-violet', glow: 'hover:shadow-glow-violet' },
  amber: { ring: 'border-neon-amber/40', text: 'text-neon-amber', glow: 'hover:shadow-[0_0_24px_rgba(251,191,36,0.35)]' },
  pink: { ring: 'border-neon-pink/40', text: 'text-neon-pink', glow: 'hover:shadow-[0_0_24px_rgba(244,114,182,0.35)]' },
};

function BadgeTile({ badge }: { badge: Badge }) {
  const accent = accentMap[badge.accent ?? 'cyan'];
  return (
    <a
      href={badge.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${badge.name} - ${badge.issuer}`}
      className={`shrink-0 w-40 panel ${accent.ring} ${accent.glow} p-3 flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5`}
    >
      {badge.src ? (
        <img
          src={badge.src}
          alt={badge.name}
          className="h-12 w-12 object-contain shrink-0"
          loading="lazy"
        />
      ) : (
        <div className={`h-12 w-12 shrink-0 rounded-md border ${accent.ring} ${accent.text} bg-bg-soft flex items-center justify-center`}>
          <Award size={22} />
        </div>
      )}
      <div className="flex flex-col min-w-0">
        <span className={`font-mono text-[11px] font-semibold ${accent.text} truncate leading-tight`}>
          {badge.name}
        </span>
        <span className="font-mono text-[9px] text-ink-mute truncate">{badge.issuer}</span>
      </div>
    </a>
  );
}

function BadgesMarquee() {
  if (badges.length === 0) return null;
  const looped = [...badges, ...badges];

  return (
    <div className="panel scanline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <Trophy size={11} className="text-neon-amber" />
          <span>verified_credentials.live</span>
        </div>
        <span className="font-mono text-[9px] text-neon-green flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> synced
        </span>
      </div>

      <div
        className="relative overflow-hidden py-3 px-2"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)',
        }}
      >
        <div className="flex gap-3 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max">
          {looped.map((b, i) => (
            <BadgeTile key={`${b.name}-${i}`} badge={b} />
          ))}
        </div>
      </div>
    </div>
  );
}

// TryHackMe renders the badge as a fixed 327x84 card with 12px rounded corners,
// top-left aligned on a transparent page. Rendering the iframe at exactly that
// size (and scaling the whole thing down to fit narrow columns) makes the card
// fill the frame edge to edge - no leftover space for the iframe's white canvas
// to show through, and the corner clip matches the card's own rounding.
const THM_CARD_W = 327;
const THM_CARD_H = 84;
const THM_CARD_RADIUS = 12;

/**
 * Live TryHackMe status.
 *
 * We embed TryHackMe's official badge endpoint in an iframe rather than scraping
 * it. TryHackMe put that endpoint behind a bot challenge (Vercel Security
 * Checkpoint) that blocks servers/CI/scrapers - but a real browser loading it in
 * an iframe passes the challenge and renders the live badge (rank, points,
 * streak, badges, rooms). So it stays current for every visitor with no backend,
 * no scheduled job, and nothing to maintain. Requires tryhackme.com in the CSP
 * frame-src (see vercel.json).
 */
function TryHackMeWidget() {
  const username = profile.tryhackmeUsername;
  const publicId = profile.tryhackmePublicId;
  const streakUrl = profile.tryhackmeStreakUrl;
  const embedUrl = `https://tryhackme.com/api/v2/badges/public-profile?userPublicId=${publicId}`;

  const [reloadKey, setReloadKey] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    setLoaded(false);
    setReloadKey((k) => k + 1);
  }, []);

  // Reload the live badge when the tab regains focus (stats may have changed).
  useEffect(() => {
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  // Scale the fixed-size card down to fit the available width (never up).
  const sizerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = sizerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? THM_CARD_W;
      setScale(Math.min(1, w / THM_CARD_W));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="panel panel-hover overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_6px_rgba(0,255,156,0.8)]" />
          <span>tryhackme.live · @{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={streakUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open TryHackMe profile"
            title="Open profile"
            className="text-ink-mute hover:text-neon-cyan transition-colors"
          >
            <ExternalLink size={11} />
          </a>
          <button
            onClick={refresh}
            aria-label="Reload live badge"
            title="Reload"
            disabled={!loaded}
            className="text-ink-mute hover:text-neon-cyan transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={!loaded ? 'animate-spin' : ''} />
          </button>
          <span
            className="font-mono text-[9px] text-neon-amber flex items-center gap-1"
            title="Live badge embedded from TryHackMe"
          >
            <ShieldCheck size={9} />
            live
          </span>
        </div>
      </div>

      <div className="scanline relative bg-bg-soft px-4 py-5 overflow-hidden">
        {/* Soft neon-green glow that echoes the badge's own green + the site accent. */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_118%,rgba(0,255,156,0.16),transparent_60%)]" />

        {/* Sizer: measures the column so the card can scale to fit; never wider than the card. */}
        <div ref={sizerRef} className="relative mx-auto w-full" style={{ maxWidth: THM_CARD_W }}>
          {/* Clip box: exactly the (scaled) card size, rounded to match the card's corners. */}
          <div
            className="relative overflow-hidden bg-[#0b1220] shadow-[0_0_22px_rgba(0,255,156,0.07)] transition-shadow duration-300 group-hover:shadow-[0_0_30px_rgba(0,255,156,0.16)]"
            style={{
              width: THM_CARD_W * scale,
              height: THM_CARD_H * scale,
              borderRadius: THM_CARD_RADIUS * scale,
            }}
          >
            <iframe
              key={reloadKey}
              title={`TryHackMe live badge for ${username}`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer"
              onLoad={() => setLoaded(true)}
              className="absolute top-0 left-0 border-0 bg-transparent"
              style={{
                width: THM_CARD_W,
                height: THM_CARD_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BadgesStrip() {
  return (
    <div className="flex flex-col gap-3">
      <BadgesMarquee />
      <TryHackMeWidget />
    </div>
  );
}
