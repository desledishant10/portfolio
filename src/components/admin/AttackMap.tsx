import { motion } from 'framer-motion';
import { HOME, SOURCES, type SourceNode } from '../../data/soc';

const W = 720;
const H = 360;

// Equirectangular projection: lon/lat -> SVG x/y.
const px = (lon: number) => ((lon + 180) / 360) * W;
const py = (lat: number) => ((90 - lat) / 180) * H;

// Rough continent outlines (lon,lat) - a dim dotted backdrop only, the plotted
// threat sources are the real signal. Deliberately low-detail / stylised.
const CONTINENTS: number[][][] = [
  [[-165, 68], [-125, 70], [-80, 62], [-60, 60], [-55, 50], [-75, 38], [-82, 25], [-98, 16], [-112, 23], [-125, 40], [-140, 58], [-165, 68]],
  [[-80, 10], [-60, 8], [-50, 0], [-40, -20], [-55, -35], [-72, -52], [-77, -30], [-80, -5], [-80, 10]],
  [[-10, 43], [-5, 36], [12, 38], [28, 36], [40, 46], [35, 58], [22, 62], [8, 58], [-2, 50], [-10, 43]],
  [[-16, 15], [-16, 30], [10, 37], [33, 31], [43, 12], [51, 11], [40, -5], [35, -20], [20, -35], [12, -16], [8, 5], [-8, 6], [-16, 15]],
  [[42, 46], [55, 40], [48, 30], [62, 24], [74, 10], [88, 22], [100, 8], [110, 18], [122, 40], [142, 50], [160, 66], [120, 74], [70, 72], [45, 60], [42, 46]],
  [[114, -22], [130, -12], [143, -11], [151, -24], [146, -38], [132, -37], [120, -34], [114, -22]],
];

function inPoly(lon: number, lat: number, poly: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Precompute the land dot field once at module load.
const LAND: { x: number; y: number }[] = (() => {
  const dots: { x: number; y: number }[] = [];
  for (let lon = -178; lon < 180; lon += 4) {
    for (let lat = 80; lat > -58; lat -= 4) {
      if (CONTINENTS.some((p) => inPoly(lon, lat, p))) dots.push({ x: px(lon), y: py(lat) });
    }
  }
  return dots;
})();

const repColor: Record<SourceNode['reputation'], string> = {
  malicious: '#ef4444',
  suspicious: '#fbbf24',
  clean: '#22d3ee',
};

// Quadratic arc from a source to the SOC, bowed upward.
function arcPath(s: SourceNode): string {
  const x1 = px(s.lon);
  const y1 = py(s.lat);
  const x2 = px(HOME.lon);
  const y2 = py(HOME.lat);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.28;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function AttackMap({ activeIp }: { activeIp: string | null }) {
  const hx = px(HOME.lon);
  const hy = py(HOME.lat);

  return (
    <div className="panel scanline overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-bg-border bg-bg-soft">
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-mute">
          <span className="text-neon-cyan">global_threat_origin.map</span>
        </div>
        <span className="font-mono text-[10px] text-neon-green flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" /> live
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block" role="img" aria-label="World map of simulated threat origins">
        {/* graticule */}
        {[-120, -60, 0, 60, 120].map((lon) => (
          <line key={`v${lon}`} x1={px(lon)} y1={0} x2={px(lon)} y2={H} stroke="rgba(34,211,238,0.05)" />
        ))}
        {[-45, 0, 45].map((lat) => (
          <line key={`h${lat}`} x1={0} y1={py(lat)} x2={W} y2={py(lat)} stroke="rgba(34,211,238,0.05)" />
        ))}
        {/* continents */}
        {LAND.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={0.9} fill="rgba(90,110,130,0.55)" />
        ))}

        {/* arcs */}
        {SOURCES.map((s) => {
          const active = s.ip === activeIp;
          return (
            <path
              key={`arc-${s.ip}`}
              d={arcPath(s)}
              fill="none"
              stroke={active ? repColor[s.reputation] : 'rgba(34,211,238,0.12)'}
              strokeWidth={active ? 1.6 : 0.6}
              opacity={active ? 0.95 : 0.5}
            />
          );
        })}

        {/* source nodes */}
        {SOURCES.map((s) => {
          const active = s.ip === activeIp;
          const c = repColor[s.reputation];
          return (
            <g key={`src-${s.ip}`} transform={`translate(${px(s.lon)} ${py(s.lat)})`}>
              {active && (
                <motion.circle
                  key={`ping-${activeIp}`}
                  r={3}
                  fill="none"
                  stroke={c}
                  strokeWidth={1.2}
                  initial={{ r: 3, opacity: 0.9 }}
                  animate={{ r: 16, opacity: 0 }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              )}
              <circle r={active ? 2.6 : 1.8} fill={c} opacity={active ? 1 : 0.8}>
                {s.reputation === 'malicious' && (
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2.4s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          );
        })}

        {/* SOC home node */}
        <g transform={`translate(${hx} ${hy})`}>
          <motion.circle
            r={4}
            fill="none"
            stroke="#00ff9c"
            strokeWidth={1}
            animate={{ r: [4, 11], opacity: [0.8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
          <circle r={3} fill="#00ff9c" />
          <text x={7} y={3} fontSize={9} fontFamily="monospace" fill="#00ff9c">{HOME.label}</text>
        </g>
      </svg>
    </div>
  );
}
