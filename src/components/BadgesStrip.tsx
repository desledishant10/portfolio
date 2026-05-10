import { Flame, ShieldCheck, Trophy } from 'lucide-react';
import { badges, profile } from '../data/content';

function BadgesMarquee() {
  // If no badges configured, show placeholder skeletons (still animates)
  const items =
    badges.length > 0
      ? badges
      : [
          { src: '', alt: 'badge-slot-1' },
          { src: '', alt: 'badge-slot-2' },
          { src: '', alt: 'badge-slot-3' },
          { src: '', alt: 'badge-slot-4' },
          { src: '', alt: 'badge-slot-5' },
        ];

  // Duplicate the list so the marquee loops seamlessly
  const looped = [...items, ...items];

  return (
    <div className="panel scanline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <Trophy size={11} className="text-neon-amber" />
          <span>verified_credentials.live</span>
        </div>
        <span className="font-mono text-[9px] text-neon-green">● synced</span>
      </div>

      <div
        className="relative overflow-hidden py-4"
        style={{
          maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        }}
      >
        <div className="flex gap-4 animate-[marquee_24s_linear_infinite] whitespace-nowrap">
          {looped.map((b, i) => {
            const content = b.src ? (
              <img
                src={b.src}
                alt={b.alt}
                className="h-16 w-16 object-contain transition-transform hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="h-16 w-16 flex items-center justify-center rounded-lg border border-dashed border-bg-border bg-bg-soft text-ink-mute font-mono text-[9px] text-center px-1">
                drop badge here
              </div>
            );
            return b.href ? (
              <a
                key={`${b.alt}-${i}`}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className="shrink-0"
                aria-label={b.alt}
              >
                {content}
              </a>
            ) : (
              <div key={`${b.alt}-${i}`} className="shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TryHackMeWidget() {
  const username = profile.tryhackmeUsername;
  const profileUrl = `https://tryhackme.com/p/${username}`;
  const badgeUrl = `https://tryhackme-badges.s3.amazonaws.com/${username}.png`;

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noreferrer"
      className="panel panel-hover block group overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute">
          <Flame size={11} className="text-neon-red" />
          <span>tryhackme.streak</span>
        </div>
        <span className="font-mono text-[9px] text-neon-amber flex items-center gap-1">
          <ShieldCheck size={9} /> live
        </span>
      </div>
      <div className="p-3 flex items-center justify-center bg-[#0a0e14] min-h-[88px]">
        <img
          src={badgeUrl}
          alt={`${username} TryHackMe profile badge`}
          className="max-h-20 w-auto group-hover:scale-105 transition-transform"
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const sib = img.nextElementSibling as HTMLElement | null;
            if (sib) sib.style.display = 'flex';
          }}
        />
        <div
          className="hidden flex-col items-center justify-center gap-1 text-center font-mono text-[10px] text-ink-mute px-2"
          style={{ display: 'none' }}
        >
          <span>// THM badge unavailable</span>
          <span className="text-neon-cyan/80">
            update tryhackmeUsername in src/data/content.ts
          </span>
        </div>
      </div>
    </a>
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
