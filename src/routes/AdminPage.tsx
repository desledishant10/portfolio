import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Cpu,
  Eye,
  Lock,
  Network,
  ShieldCheck,
  Siren,
  Skull,
  Zap,
} from 'lucide-react';
import { INCIDENT } from '../data/soc';
import { useSocFeed } from '../components/admin/useSocFeed';
import { AttackMap } from '../components/admin/AttackMap';
import { AttackMatrix } from '../components/admin/AttackMatrix';
import { LogStream } from '../components/admin/LogStream';

// Stable module consts so the gauge effects do not reset on every re-render.
const CPU_RANGE: [number, number] = [10, 92];
const NET_RANGE: [number, number] = [20, 95];
const MEM_RANGE: [number, number] = [40, 88];

function useTicker(initial: number, range: [number, number], intervalMs: number) {
  const [v, setV] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      setV((cur) => Math.max(range[0], Math.min(range[1], cur + (Math.random() - 0.4) * 5)));
    }, intervalMs);
    return () => clearInterval(t);
  }, [intervalMs, range]);
  return Math.round(v);
}

export default function AdminPage() {
  const feed = useSocFeed();
  const cpu = useTicker(34, CPU_RANGE, 1200);
  const net = useTicker(54, NET_RANGE, 900);
  const mem = useTicker(67, MEM_RANGE, 1500);
  const total = INCIDENT.steps.length;

  return (
    <main className="relative min-h-screen pt-8 pb-16 px-6">
      {/* flex column so the attack map can lead on mobile (order-3) while the
          desktop layout keeps its original top-to-bottom sequence. */}
      <div className="max-w-7xl mx-auto flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="order-1 flex items-center justify-between mb-6 panel p-4"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-sm bg-neon-red/10 text-neon-red border border-neon-red/30 animate-pulse">
              <Eye size={18} aria-hidden />
            </div>
            <div>
              <div className="font-mono text-[10px] text-neon-red uppercase tracking-widest">
                classified :: clearance 5
              </div>
              <h1 className="text-xl font-bold text-ink font-mono">
                dishant.<span className="text-neon-cyan">soc</span>
                <span className="text-neon-green"> :: threat console</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-neon-green">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
              </span>
              SENSORS ONLINE
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 border border-bg-border text-ink-dim font-mono text-xs rounded-sm hover:border-neon-cyan/50 hover:text-neon-cyan transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan"
            >
              <ArrowLeft size={14} aria-hidden /> exit
            </Link>
          </div>
        </motion.header>

        {/* active-incident banner */}
        {feed.incidentPhase > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-2 mb-6 panel border-neon-red/40 bg-neon-red/[0.06] p-3 flex items-center gap-3"
          >
            <Siren size={16} className="text-neon-red animate-pulse shrink-0" aria-hidden />
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[11px] text-neon-red uppercase tracking-widest">
                active incident :: {feed.incidentName} :: step {feed.incidentPhase}/{total}
              </div>
              <div className="mt-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-neon-red rounded-full"
                  animate={{ width: `${(feed.incidentPhase / total) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* stat cards */}
        <div className="order-4 lg:order-3 grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<ShieldCheck size={16} />} label="threats_blocked" value={feed.blocked.toLocaleString()} accent="green" />
          <StatCard icon={<AlertTriangle size={16} />} label="threats_detected" value={feed.detected.toLocaleString()} accent="amber" />
          <StatCard icon={<Cpu size={16} />} label="cpu_load" value={`${cpu}%`} accent="cyan" />
          <StatCard icon={<Network size={16} />} label="net_throughput" value={`${net} Mb/s`} accent="violet" />
        </div>

        {/* map + gauges (leads on mobile) */}
        <div className="order-3 lg:order-4 grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <AttackMap activeIp={feed.activeIp} />
          </div>
          <div className="flex flex-col gap-4">
            <Gauge label="cpu" value={cpu} accent="cyan" icon={<Cpu size={14} />} />
            <Gauge label="memory" value={mem} accent="violet" icon={<Zap size={14} />} />
            <Gauge label="network" value={net} accent="green" icon={<Network size={14} />} />
          </div>
        </div>

        {/* ATT&CK matrix */}
        <div className="order-5 mb-6">
          <AttackMatrix firedAt={feed.firedAt} />
        </div>

        {/* stream + side panels */}
        <div className="order-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <LogStream events={feed.events} />
          </div>
          <div className="flex flex-col gap-4">
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-ink-mute">
                <Lock size={12} className="text-neon-green" aria-hidden /> access_log
              </div>
              <pre className="font-mono text-[11px] text-ink-dim whitespace-pre-wrap leading-relaxed">
{`> auth: dishant@localhost (key: ed25519)
> sudo: enabled (NOPASSWD)
> mfa: yubikey active
> rbac: superadmin
> tap: span mirror on eth0
> last_login: ${new Date().toLocaleString()}`}
              </pre>
            </div>
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-ink-mute">
                <Skull size={12} className="text-neon-red" aria-hidden /> easter_egg.readme
              </div>
              <p className="font-mono text-[11px] text-ink-dim leading-relaxed">
                congrats - you found the secret <span className="text-neon-cyan">/admin</span> route.
                every alert here is mapped to a real MITRE ATT&amp;CK technique, and a scripted kill
                chain (<span className="text-neon-red">{INCIDENT.name}</span>) plays out over the noise.
                click any log line to triage it. it is all fake telemetry in the browser - but if you
                give me a real SIEM to run, i would happily wire one up.{' '}
                <Link to="/#contact" className="text-neon-green underline">say hi -&gt;</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: 'green' | 'cyan' | 'violet' | 'amber';
}) {
  const map = {
    green: 'text-neon-green border-neon-green/30',
    cyan: 'text-neon-cyan border-neon-cyan/30',
    violet: 'text-neon-violet border-neon-violet/30',
    amber: 'text-neon-amber border-neon-amber/30',
  };
  return (
    <div className={`panel p-4 border-l-2 ${map[accent]}`}>
      <div className="flex items-center gap-2 font-mono text-[10px] text-ink-mute mb-2">
        <span className={map[accent].split(' ')[0]} aria-hidden>{icon}</span>
        {label}
      </div>
      <div className={`font-mono text-2xl font-bold ${map[accent].split(' ')[0]}`}>{value}</div>
    </div>
  );
}

function Gauge({
  label,
  value,
  accent,
  icon,
}: {
  label: string;
  value: number;
  accent: 'green' | 'cyan' | 'violet';
  icon: React.ReactNode;
}) {
  const color = { green: '#00ff9c', cyan: '#22d3ee', violet: '#a855f7' }[accent];
  return (
    <div className="panel p-4">
      <div className="flex items-center justify-between font-mono text-[11px] text-ink-mute mb-2">
        <span className="flex items-center gap-2" style={{ color }}>
          <span aria-hidden>{icon}</span> {label}
        </span>
        <span style={{ color }}>{value}%</span>
      </div>
      <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}55, ${color})` }}
        />
      </div>
    </div>
  );
}
