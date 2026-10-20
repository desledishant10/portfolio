import { useEffect, useState } from 'react';
import { TACTICS, TECHNIQUES } from '../../data/soc';

const GLOW_MS = 9000;

// A compact MITRE ATT&CK matrix: one column per tactic, technique cells that
// light up (and decay) as alerts for them fire. During the scripted incident
// the glow sweeps left-to-right across tactics, visualising the kill chain.
export function AttackMatrix({ firedAt }: { firedAt: Record<string, number> }) {
  // `now` lives in state and is advanced by a ticker, so render stays a pure
  // function of props/state while the cell glow still decays between updates.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const t = setInterval(() => setNow(Date.now()), 700);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="panel p-4" aria-hidden>
      <div className="flex items-center justify-between mb-3 font-mono text-[11px] text-ink-mute">
        <span className="flex items-center gap-2 text-neon-cyan">mitre_att&amp;ck :: coverage</span>
        <span className="text-[9px] uppercase tracking-widest">tactic -&gt; technique</span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TACTICS.map((tactic) => {
          const techs = TECHNIQUES.filter((t) => t.tactic === tactic);
          return (
            <div key={tactic} className="shrink-0 w-[108px]">
              <div className="font-mono text-[8px] uppercase tracking-wide text-ink-mute mb-1.5 h-6 leading-tight">
                {tactic}
              </div>
              <div className="flex flex-col gap-1.5">
                {techs.map((t) => {
                  const age = now - (firedAt[t.id] ?? -Infinity);
                  const live = age < GLOW_MS;
                  const intensity = live ? Math.max(0, 1 - age / GLOW_MS) : 0;
                  return (
                    <div
                      key={t.id}
                      title={`${t.id} ${t.name}`}
                      className="rounded-sm border px-1.5 py-1 font-mono text-[9px] leading-tight transition-colors duration-500"
                      style={{
                        borderColor: live
                          ? `rgba(34,211,238,${0.3 + 0.6 * intensity})`
                          : 'rgba(26,35,48,1)',
                        background: live
                          ? `rgba(34,211,238,${0.05 + 0.18 * intensity})`
                          : 'rgba(10,14,20,0.5)',
                        boxShadow: live ? `0 0 ${Math.round(14 * intensity)}px rgba(34,211,238,${0.4 * intensity})` : 'none',
                      }}
                    >
                      <div className={live ? 'text-neon-cyan' : 'text-ink-mute'}>{t.id}</div>
                      <div className="text-ink-dim truncate">{t.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
