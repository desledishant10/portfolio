import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Ban, ChevronRight, Globe, Pause, Play, Target } from 'lucide-react';
import type { SocEvent } from './useSocFeed';

const sevColor: Record<SocEvent['severity'], string> = {
  crit: 'text-neon-red',
  warn: 'text-neon-amber',
  info: 'text-neon-cyan',
};
const repColor: Record<string, string> = {
  malicious: 'text-neon-red',
  suspicious: 'text-neon-amber',
  clean: 'text-neon-green',
};

export function LogStream({ events }: { events: SocEvent[] }) {
  const [openId, setOpenId] = useState<number | null>(null);
  // Freeze the stream while investigating so the row under inspection holds still.
  const [frozen, setFrozen] = useState<SocEvent[] | null>(null);
  const paused = frozen !== null;
  const display = frozen ?? events;

  const onRow = (ev: SocEvent) => {
    if (openId === ev.id) {
      setOpenId(null);
      setFrozen(null);
    } else {
      setOpenId(ev.id);
      setFrozen(events);
    }
  };
  const togglePause = () => {
    if (paused) {
      setFrozen(null);
      setOpenId(null);
    } else {
      setFrozen(events);
    }
  };

  return (
    <div className="panel scanline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-mute">
          <Activity size={12} className="text-neon-cyan" /> live_event_stream.log
          <span className="text-ink-mute/60">:: click to triage</span>
        </div>
        <button
          type="button"
          onClick={togglePause}
          className="flex items-center gap-1.5 font-mono text-[10px] text-ink-dim hover:text-neon-cyan transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-neon-cyan rounded-sm px-1.5 py-0.5"
        >
          {paused ? <Play size={11} /> : <Pause size={11} />}
          {paused ? 'frozen' : 'tail -f'}
        </button>
      </div>

      <div className="font-mono text-[12px] max-h-[520px] overflow-y-auto">
        {display.length === 0 && (
          <div className="px-4 py-6 text-center text-ink-mute text-xs">priming sensors...</div>
        )}
        {display.map((ev, i) => {
          const open = openId === ev.id;
          return (
            <div key={ev.id} className={ev.incident ? 'bg-neon-red/[0.04]' : ''}>
              <button
                type="button"
                onClick={() => onRow(ev)}
                aria-expanded={open}
                className={`w-full flex items-center gap-3 px-4 py-1.5 text-left border-b border-bg-border/30 hover:bg-neon-cyan/[0.04] focus:outline-hidden focus-visible:bg-neon-cyan/[0.06] ${
                  i === 0 && !paused ? 'bg-neon-cyan/[0.03]' : ''
                }`}
              >
                <ChevronRight
                  size={11}
                  className={`shrink-0 text-ink-mute transition-transform ${open ? 'rotate-90' : ''}`}
                />
                <span className="text-ink-mute shrink-0">{ev.ts}</span>
                <span className={`${sevColor[ev.severity]} shrink-0 w-11`}>[{ev.severity.toUpperCase()}]</span>
                <span className="text-neon-violet shrink-0 w-[70px]">{ev.tech.id}</span>
                <span className="text-ink-mute shrink-0 w-[108px] truncate">{ev.source.ip}</span>
                <span className="text-ink-dim flex-1 truncate">{ev.message}</span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden border-b border-bg-border/40 bg-bg-soft/60"
                  >
                    <div className="px-6 py-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
                      <Detail icon={<Target size={11} />} label="technique">
                        <span className="text-neon-violet">{ev.tech.id}</span> {ev.tech.name}
                        <span className="text-ink-mute"> :: {ev.tech.tactic}</span>
                      </Detail>
                      <Detail icon={<Globe size={11} />} label="source">
                        {ev.source.ip}{' '}
                        <span className="text-ink-mute">
                          ({ev.source.city}, {ev.source.cc} :: {ev.source.asn})
                        </span>
                      </Detail>
                      <Detail icon={<Activity size={11} />} label="reputation">
                        <span className={repColor[ev.source.reputation]}>{ev.source.reputation}</span>
                        <span className="text-ink-mute"> :: target {ev.host}</span>
                      </Detail>
                      <Detail icon={<Ban size={11} />} label="recommended_action">
                        <span className="text-ink-dim">{ev.action}</span>
                      </Detail>
                    </div>
                    <div className="px-6 pb-3 flex gap-2">
                      <span className="chip-accent">block {ev.source.ip}</span>
                      <span className="chip">isolate {ev.host}</span>
                      <span className="chip">create case</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Detail({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-neon-cyan mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-ink-mute uppercase tracking-wide text-[9px]">{label}</div>
        <div className="text-ink-dim break-words">{children}</div>
      </div>
    </div>
  );
}
