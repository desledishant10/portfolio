import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Cpu,
  Eye,
  Lock,
  Network,
  ShieldCheck,
  Skull,
  Zap,
} from 'lucide-react';
type LogEntry = { ts: string; src: string; msg: string; level: 'info' | 'warn' | 'crit' };

const SRC_POOL = [
  '203.0.113.42',
  '198.51.100.7',
  '93.184.216.34',
  '10.0.0.13',
  '172.16.4.221',
  '8.8.8.8',
  '45.33.32.156',
  '185.220.101.182',
  '5.79.96.66',
];

const MESSAGE_POOL = [
  { msg: 'Failed SSH login attempt - invalid password (root)', level: 'warn' as const },
  { msg: 'Port scan detected - TCP/22, TCP/80, TCP/443', level: 'warn' as const },
  { msg: 'Suricata alert: ET POLICY potential UA flagged', level: 'info' as const },
  { msg: 'New SIEM event correlated - auth_failure cluster', level: 'info' as const },
  { msg: 'Outbound connection blocked - destination on TI feed', level: 'crit' as const },
  { msg: 'IDS rule sid:2018959 triggered', level: 'warn' as const },
  { msg: 'Process anomaly: powershell -enc spawned by Word', level: 'crit' as const },
  { msg: 'GeoIP anomaly - login from unusual country', level: 'warn' as const },
  { msg: 'YARA match: ransomware_canary_v3 on /tmp/staging', level: 'crit' as const },
  { msg: 'Splunk index rebuild complete · 412k events indexed', level: 'info' as const },
  { msg: 'TLS handshake failed - expired cert on edge-7', level: 'info' as const },
  { msg: 'Egress firewall blocked C2 beacon attempt', level: 'crit' as const },
  { msg: 'AD policy applied - disabled stale service account', level: 'info' as const },
];

function ts() {
  const d = new Date();
  return d.toISOString().slice(11, 19);
}

function randLog(): LogEntry {
  const src = SRC_POOL[Math.floor(Math.random() * SRC_POOL.length)];
  const m = MESSAGE_POOL[Math.floor(Math.random() * MESSAGE_POOL.length)];
  return { ts: ts(), src, msg: m.msg, level: m.level };
}

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

function useCounter(start: number, perSec: [number, number]) {
  const [v, setV] = useState(start);
  useEffect(() => {
    const t = setInterval(() => {
      setV((c) => c + Math.floor(Math.random() * (perSec[1] - perSec[0] + 1)) + perSec[0]);
    }, 1000);
    return () => clearInterval(t);
  }, [perSec]);
  return v;
}

export default function AdminPage() {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    Array.from({ length: 8 }, randLog),
  );
  const cpu = useTicker(34, [10, 92], 1200);
  const net = useTicker(54, [20, 95], 900);
  const mem = useTicker(67, [40, 88], 1500);
  const blocked = useCounter(31_847, [1, 4]);
  const detected = useCounter(112, [0, 1]);

  useEffect(() => {
    const t = setInterval(() => {
      setLogs((prev) => [randLog(), ...prev].slice(0, 30));
    }, 1100);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <main className="relative min-h-screen pt-8 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8 panel p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-neon-red/10 text-neon-red border border-neon-red/30 animate-pulse">
                <Eye size={18} />
              </div>
              <div>
                <div className="font-mono text-[10px] text-neon-red uppercase tracking-widest">
                  classified · clearance: ★★★★★
                </div>
                <h1 className="text-xl font-bold text-ink font-mono">
                  dishant.<span className="text-neon-cyan">soc</span>
                  <span className="text-neon-green"> - admin panel</span>
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-neon-green">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-neon-green" />
                </span>
                ALL SYSTEMS NOMINAL
              </div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-2 border border-bg-border text-ink-dim font-mono text-xs rounded hover:border-neon-cyan/50 hover:text-neon-cyan transition-all"
              >
                <ArrowLeft size={14} /> exit
              </Link>
            </div>
          </motion.header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <StatCard
              icon={<ShieldCheck size={16} />}
              label="threats_blocked"
              value={blocked.toLocaleString()}
              accent="green"
            />
            <StatCard
              icon={<AlertTriangle size={16} />}
              label="threats_detected"
              value={detected.toLocaleString()}
              accent="amber"
            />
            <StatCard icon={<Cpu size={16} />} label="cpu_load" value={`${cpu}%`} accent="cyan" />
            <StatCard
              icon={<Network size={16} />}
              label="net_throughput"
              value={`${net} Mb/s`}
              accent="violet"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Gauge label="cpu" value={cpu} accent="cyan" icon={<Cpu size={14} />} />
            <Gauge label="memory" value={mem} accent="violet" icon={<Zap size={14} />} />
            <Gauge label="network" value={net} accent="green" icon={<Network size={14} />} />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="panel scanline overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
              <div className="flex items-center gap-2 font-mono text-[11px] text-ink-mute">
                <Activity size={12} className="text-neon-cyan" /> live_event_stream.log
              </div>
              <span className="font-mono text-[10px] text-neon-green">tail -f · 30 events</span>
            </div>
            <div className="font-mono text-[12px] max-h-[460px] overflow-y-auto">
              {logs.map((l, i) => (
                <div
                  key={`${l.ts}-${i}`}
                  className={`flex gap-3 px-4 py-1.5 border-b border-bg-border/30 ${
                    i === 0 ? 'bg-neon-cyan/[0.03]' : ''
                  }`}
                >
                  <span className="text-ink-mute">{l.ts}</span>
                  <span
                    className={
                      l.level === 'crit'
                        ? 'text-neon-red'
                        : l.level === 'warn'
                          ? 'text-neon-amber'
                          : 'text-neon-cyan'
                    }
                  >
                    [{l.level.toUpperCase()}]
                  </span>
                  <span className="text-ink-dim">{l.src}</span>
                  <span className="text-ink-dim flex-1 truncate">{l.msg}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-ink-mute">
                <Lock size={12} className="text-neon-green" /> access_log
              </div>
              <pre className="font-mono text-[11px] text-ink-dim whitespace-pre-wrap leading-relaxed">
{`> auth: dishant@localhost (key: ed25519)
> sudo: enabled (NOPASSWD)
> mfa: yubikey active
> session_age: 00:03:42
> rbac: superadmin
> last_login: ${new Date().toLocaleString()}`}
              </pre>
            </div>
            <div className="panel p-5">
              <div className="flex items-center gap-2 mb-3 font-mono text-[11px] text-ink-mute">
                <Skull size={12} className="text-neon-red" /> easter_egg.readme
              </div>
              <p className="font-mono text-[11px] text-ink-dim leading-relaxed">
                congrats - you found the secret <span className="text-neon-cyan">/admin</span> route.
                everything on this page is fake telemetry running in the browser. there is no real
                SIEM behind it, but if you give me a real one to work on, i'd be happy to wire one up.{' '}
                <Link to="/#contact" className="text-neon-green underline">say hi →</Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
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
        <span className={map[accent].split(' ')[0]}>{icon}</span>
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
          {icon} {label}
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
