import { useCallback, useEffect, useState } from 'react';
import { Award, DoorOpen, Flame, RefreshCw, ShieldCheck, Trophy, Zap } from 'lucide-react';
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

type ThmStats = {
  username: string | null;
  rank: string | null;
  points: number | null;
  streakDays: number | null;
  streakRaw: string | null;
  badges: number | null;
  rooms: number | null;
  avatarUrl: string | null;
  fetchedAt: string | null;
};

function formatAge(seconds: number): string {
  if (seconds < 60) return 'just now';
  if (seconds < 60 * 60) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 60 * 60 * 24) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function StatCell({
  icon,
  value,
  label,
  color,
}: {
  icon: React.ReactNode;
  value: string | number | null;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className={`shrink-0 ${color}`}>{icon}</div>
      <div className="flex flex-col min-w-0 leading-none">
        <span className={`font-mono text-base font-bold ${color} leading-none`}>
          {value ?? '...'}
        </span>
        <span className="font-mono text-[9px] text-ink-mute mt-0.5 uppercase tracking-wider truncate">
          {label}
        </span>
      </div>
    </div>
  );
}

// Stats are refreshed on a schedule by scripts/fetch-thm-stats.mjs (the GitHub
// Action in .github/workflows/thm-stats.yml) and committed to
// public/thm-stats.json. We fetch that published snapshot at runtime rather
// than hitting TryHackMe directly - their profile API is behind a bot challenge
// that only a real browser can pass. The refresh button re-pulls the latest
// published snapshot (and picks up a background redeploy without a full reload).
function TryHackMeWidget() {
  const streakUrl = profile.tryhackmeStreakUrl;

  const [data, setData] = useState<ThmStats | null>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [syncedAt, setSyncedAt] = useState<number | null>(null);
  const [ageSeconds, setAgeSeconds] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await fetch(`/thm-stats.json?t=${Date.now()}`, { cache: 'no-store' });
      if (r.ok) {
        setData((await r.json()) as ThmStats);
        setSyncedAt(Date.now());
      }
    } catch {
      /* offline or blocked - keep whatever we already have */
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const onFocus = () => refresh();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refresh]);

  // "synced Xm ago" counts from the last successful client fetch, so hitting
  // refresh resets it. (The published numbers themselves only change when the
  // scheduled job re-scrapes; that scrape time is shown in the tooltip.)
  useEffect(() => {
    if (syncedAt == null) {
      setAgeSeconds(null);
      return;
    }
    const tick = () => setAgeSeconds(Math.max(0, Math.floor((Date.now() - syncedAt) / 1000)));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [syncedAt]);

  const username = data?.username || profile.tryhackmeUsername;
  const ageLabel = refreshing
    ? 'syncing'
    : ageSeconds != null
      ? `synced ${formatAge(ageSeconds)}`
      : 'live';
  const fetchedTitle = data?.fetchedAt
    ? `Synced with the published stats. Last scraped ${new Date(data.fetchedAt).toLocaleString()} (auto-refreshed daily).`
    : 'Loading latest stats';

  return (
    <div className="panel panel-hover overflow-hidden group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <Flame size={11} className="text-neon-red" />
          <span>tryhackme.live · @{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            aria-label="Refresh stats"
            title="Refresh"
            disabled={refreshing}
            className="text-ink-mute hover:text-neon-cyan transition-colors disabled:opacity-50"
          >
            <RefreshCw size={11} className={refreshing ? 'animate-spin' : ''} />
          </button>
          <span
            className="font-mono text-[9px] text-neon-amber flex items-center gap-1"
            title={fetchedTitle}
          >
            <ShieldCheck size={9} />
            {ageLabel}
          </span>
        </div>
      </div>

      <a
        href={streakUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`TryHackMe profile for ${username}`}
        className="block p-4 bg-gradient-to-br from-[#0a0e14] via-[#10141d] to-[#0a0e14] relative"
      >
        <div className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(239,68,68,0.18),transparent_55%)]" />
        </div>

        <div className="relative flex items-center gap-3 mb-3">
          {data?.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt=""
              className="h-11 w-11 rounded-full border border-neon-cyan/30 shrink-0 group-hover:border-neon-cyan/60 transition-colors"
              loading="lazy"
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center shrink-0">
              <Flame size={18} className="text-neon-red" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-mono text-sm font-bold text-ink leading-tight truncate">
              {username}
            </div>
            <div className="flex items-center gap-1.5 mt-1 font-mono text-[10px] text-neon-amber leading-none">
              <Zap size={10} className="fill-current" />
              <span>{data?.rank ?? '[--]'}</span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-2 gap-x-3 gap-y-3 pt-3 border-t border-bg-border/60">
          <StatCell
            icon={<Trophy size={16} />}
            value={data?.points != null ? data.points.toLocaleString() : null}
            label="points"
            color="text-neon-amber"
          />
          <StatCell
            icon={<Flame size={16} />}
            value={data?.streakDays != null ? `${data.streakDays}d` : null}
            label="day streak"
            color="text-neon-red"
          />
          <StatCell
            icon={<Award size={16} />}
            value={data?.badges ?? null}
            label="badges"
            color="text-neon-cyan"
          />
          <StatCell
            icon={<DoorOpen size={16} />}
            value={data?.rooms ?? null}
            label="rooms"
            color="text-neon-violet"
          />
        </div>
      </a>
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
