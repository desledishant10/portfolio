import { useEffect, useRef, useState } from 'react';
import {
  AMBIENT,
  INCIDENT,
  SOURCES,
  SOURCE_BY_IP,
  TECH_BY_ID,
  type Severity,
  type SourceNode,
  type Technique,
} from '../../data/soc';

export type SocEvent = {
  id: number;
  ts: string;
  tech: Technique;
  severity: Severity;
  message: string;
  action: string;
  source: SourceNode;
  host: string;
  incident: boolean;
};

export type SocFeed = {
  events: SocEvent[];
  blocked: number;
  detected: number;
  incidentPhase: number; // 0 = idle, else 1..steps.length
  incidentName: string | null;
  firedAt: Record<string, number>; // techId -> last fired (ms)
  activeIp: string | null; // most-recent source, for the attack map
};

const clock = () => new Date().toISOString().slice(11, 19);
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const CAP = 40;

export function useSocFeed(): SocFeed {
  const [feed, setFeed] = useState<SocFeed>(() => ({
    events: [],
    blocked: 31847,
    detected: 112,
    incidentPhase: 0,
    incidentName: null,
    firedAt: {},
    activeIp: null,
  }));

  const nextId = useRef(0);

  useEffect(() => {
    const reduced = prefersReduced();
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cancelled = false;

    const emit = (
      seed: { techId: string; severity: Severity; message: string; action: string },
      source: SourceNode,
      host: string,
      incident: boolean,
      phase: number | null,
    ) => {
      if (cancelled) return;
      const tech = TECH_BY_ID[seed.techId];
      if (!tech) return;
      const ev: SocEvent = {
        id: nextId.current++,
        ts: clock(),
        tech,
        severity: seed.severity,
        message: seed.message,
        action: seed.action,
        source,
        host,
        incident,
      };
      setFeed((f) => ({
        ...f,
        events: [ev, ...f.events].slice(0, CAP),
        blocked: f.blocked + (seed.severity === 'info' ? 1 : 2),
        detected: f.detected + (seed.severity === 'crit' ? 1 : 0),
        firedAt: { ...f.firedAt, [tech.id]: Date.now() },
        activeIp: source.ip,
        incidentPhase: phase === null ? f.incidentPhase : phase,
        incidentName: phase === null ? f.incidentName : phase > 0 ? INCIDENT.name : null,
      }));
    };

    // Ambient background noise.
    const ambientEvery = reduced ? 3800 : 1700;
    const ambient = setInterval(() => {
      const seed = pick(AMBIENT);
      // ambient alerts come from any source weighted toward the noisier ones
      emit(seed, pick(SOURCES), `WKS-${100 + Math.floor(Math.random() * 90)}`, false, null);
    }, ambientEvery);

    // Scripted kill chain. Runs once shortly after mount, then on a long loop.
    const runIncident = () => {
      let acc = reduced ? 1200 : 600;
      INCIDENT.steps.forEach((step, i) => {
        acc += step.delayMs * (reduced ? 1.6 : 1);
        timers.push(
          setTimeout(() => {
            const src = SOURCE_BY_IP[step.sourceIp] ?? SOURCES[0];
            emit(step, src, step.host, true, i + 1);
          }, acc),
        );
      });
      // clear the incident banner a little after the last step
      timers.push(
        setTimeout(() => {
          if (!cancelled) setFeed((f) => ({ ...f, incidentPhase: 0, incidentName: null }));
        }, acc + 6000),
      );
    };

    timers.push(setTimeout(runIncident, reduced ? 9000 : 5500));
    const loop = setInterval(runIncident, reduced ? 90000 : 52000);

    return () => {
      cancelled = true;
      clearInterval(ambient);
      clearInterval(loop);
      timers.forEach(clearTimeout);
    };
  }, []);

  return feed;
}
