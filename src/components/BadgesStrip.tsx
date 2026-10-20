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

function BadgeTile({ badge, duplicate = false }: { badge: Badge; duplicate?: boolean }) {
  const accent = accentMap[badge.accent ?? 'cyan'];
  return (
    <a
      href={badge.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${badge.name} - ${badge.issuer}`}
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
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
        <div className="flex gap-3 animate-[marquee_30s_linear_infinite] whitespace-nowrap w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
          {looped.map((b, i) => (
            <BadgeTile key={`${b.name}-${i}`} badge={b} duplicate={i >= badges.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

// TryHackMe renders the badge as a fixed 327x84 card with 12px rounded-sm corners,
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
  const [failed, setFailed] = useState(false);
  const watchdogRef = useRef<number | null>(null);
  const lastLoadRef = useRef(0);

  const armWatchdog = useCallback(() => {
    if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    // If the badge has not rendered in 12s (third-party frame blocked, challenge
    // stuck, offline), show a fallback link instead of a blank/white box.
    watchdogRef.current = window.setTimeout(() => setFailed(true), 12_000);
  }, []);

  const refresh = useCallback(() => {
    setLoaded(false);
    setFailed(false);
    setReloadKey((k) => k + 1);
    armWatchdog();
  }, [armWatchdog]);

  const handleLoad = useCallback(() => {
    if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    lastLoadRef.current = Date.now();
    setLoaded(true);
    setFailed(false);
  }, []);

  // Arm the watchdog for the initial load; clear it on unmount.
  useEffect(() => {
    armWatchdog();
    return () => {
      if (watchdogRef.current) window.clearTimeout(watchdogRef.current);
    };
  }, [armWatchdog]);

  // Refresh only when returning to a tab hidden for over 5 minutes - not on
  // every window focus (which used to remount the iframe constantly).
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastLoadRef.current > 300_000) {
        refresh();
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  const loading = !loaded && !failed;

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
      {/* monitor titlebar - frames the embedded (cross-origin) badge as a live feed */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-bg-border bg-bg-soft">
        <span aria-hidden className="flex items-center gap-1.5 shrink-0">
          <span className="h-2.5 w-2.5 rounded-full bg-neon-red/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon-amber/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon-green/70" />
        </span>
        <span className="ml-1 font-mono text-[10px] text-ink-mute truncate">
          tryhackme.live :: @{username}
        </span>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span
            className={`font-mono text-[9px] flex items-center gap-1 ${failed ? 'text-ink-mute' : 'text-neon-green'}`}
            title={failed ? 'Could not load the live badge' : 'Live badge embedded from TryHackMe'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                failed
                  ? 'bg-ink-mute'
                  : 'bg-neon-green animate-pulse motion-reduce:animate-none shadow-[0_0_6px_rgba(0,255,156,0.8)]'
              }`}
            />
            {failed ? 'offline' : 'live'}
          </span>
          <button
            onClick={refresh}
            aria-label="Reload live badge"
            title="Reload"
            disabled={loading}
            className="text-ink-mute hover:text-neon-cyan transition-colors disabled:opacity-50 focus:outline-hidden focus-visible:text-neon-cyan"
          >
            <RefreshCw size={11} className={loading ? 'animate-spin motion-reduce:animate-none' : ''} />
          </button>
          <a
            href={streakUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open TryHackMe profile"
            title="Open profile"
            className="text-ink-mute hover:text-neon-cyan transition-colors focus:outline-hidden focus-visible:text-neon-cyan"
          >
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* monitor screen */}
      <div className="scanline relative bg-[#06090f] px-4 py-5 overflow-hidden">
        {/* Soft neon-green glow that echoes the badge's own green + the site accent. */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_120%,rgba(0,255,156,0.16),transparent_62%)]" />

        {/* Sizer: measures the column so the card can scale to fit; never wider than the card. */}
        <div ref={sizerRef} className="relative mx-auto w-full" style={{ maxWidth: THM_CARD_W }}>
          {/* Screen: exactly the (scaled) 327x84 card, so no white iframe canvas shows. */}
          <div
            className="relative overflow-hidden bg-[#0b1220]"
            style={{
              width: THM_CARD_W * scale,
              height: THM_CARD_H * scale,
              borderRadius: THM_CARD_RADIUS * scale,
              boxShadow: '0 0 22px rgba(0,255,156,0.08)',
            }}
          >
            <iframe
              key={reloadKey}
              title={`TryHackMe live badge for ${username}`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
              onLoad={handleLoad}
              className="absolute top-0 left-0 border-0 bg-transparent"
              style={{
                width: THM_CARD_W,
                height: THM_CARD_H,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />

            {/* on-brand loading skeleton (scales with the card) */}
            {loading && (
              <div
                className="absolute inset-0 flex items-center bg-[#0b1220]"
                style={{ gap: 12 * scale, paddingLeft: 14 * scale, paddingRight: 14 * scale }}
                aria-hidden
              >
                <div
                  className="rounded-full bg-bg-border/70 animate-pulse motion-reduce:animate-none shrink-0"
                  style={{ width: 44 * scale, height: 44 * scale }}
                />
                <div className="flex-1 flex flex-col" style={{ gap: 7 * scale }}>
                  <div className="rounded-sm bg-bg-border/70 animate-pulse motion-reduce:animate-none" style={{ height: 10 * scale, width: '64%' }} />
                  <div className="rounded-sm bg-bg-border/50 animate-pulse motion-reduce:animate-none" style={{ height: 8 * scale, width: '86%' }} />
                  <div className="rounded-sm bg-bg-border/40 animate-pulse motion-reduce:animate-none" style={{ height: 8 * scale, width: '48%' }} />
                </div>
              </div>
            )}

            {failed && (
              <a
                href={streakUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 flex items-center justify-center gap-1.5 bg-[#0b1220] font-mono text-neon-cyan hover:underline"
                style={{ fontSize: Math.max(9, Math.round(11 * scale)) }}
              >
                View live stats on TryHackMe
                <ExternalLink size={11} />
              </a>
            )}

            {/* screen bezel + glass reflection, over the badge so it reads as a monitor */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: 'inherit',
                boxShadow: 'inset 0 0 0 1px rgba(34,211,238,0.22)',
                background: 'linear-gradient(180deg, rgba(255,255,255,0.06), transparent 42%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* caption - what the live feed shows */}
      <div className="px-4 py-2 border-t border-bg-border bg-bg-soft flex items-center gap-1.5 font-mono text-[9px] text-ink-mute">
        <ShieldCheck size={9} className="text-neon-green shrink-0" />
        <span className="truncate">streak, rank, points, badges + rooms :: live from tryhackme.com</span>
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
