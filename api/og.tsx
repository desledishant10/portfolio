import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#05070a',
          padding: '64px',
          fontFamily: 'monospace',
          position: 'relative',
        }}
      >
        {/* corner indicators */}
        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', color: '#22d3ee', fontSize: 14, opacity: 0.5 }}>
          ┌
        </div>
        <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', color: '#22d3ee', fontSize: 14, opacity: 0.5 }}>
          ┐
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', color: '#22d3ee', fontSize: 14, opacity: 0.5 }}>
          └
        </div>
        <div style={{ position: 'absolute', bottom: 20, right: 20, display: 'flex', color: '#22d3ee', fontSize: 14, opacity: 0.5 }}>
          ┘
        </div>

        {/* top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', color: '#22d3ee', fontSize: 22 }}>$ dishant.desle</div>
          <div style={{ display: 'flex', alignItems: 'center', color: '#00ff9c', fontSize: 18, gap: 8 }}>
            <span style={{ display: 'flex', width: 10, height: 10, borderRadius: 5, background: '#00ff9c' }} />
            open_to_work
          </div>
        </div>

        {/* center */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', color: '#9ba8b8', fontSize: 20, marginBottom: 12 }}>
            // hello, world. i'm
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 110,
              fontWeight: 800,
              color: '#e6edf3',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontFamily: 'sans-serif',
            }}
          >
            <span style={{ color: '#e6edf3' }}>Dishant&nbsp;</span>
            <span
              style={{
                background: 'linear-gradient(90deg, #00ff9c, #22d3ee, #a855f7)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Desle.
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              color: '#9ba8b8',
              marginTop: 22,
              fontFamily: 'sans-serif',
            }}
          >
            Cybersecurity Analyst · SIEM · Threat Detection
          </div>
        </div>

        {/* bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', color: '#22d3ee', fontSize: 18 }}>
              M.S. Cyber Security · University of Denver
            </div>
            <div style={{ display: 'flex', color: '#5a6877', fontSize: 16 }}>
              grad Aug 2026 · Denver, CO
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              padding: '10px 18px',
              border: '1px solid #22d3ee55',
              borderRadius: 6,
              color: '#22d3ee',
              fontSize: 18,
            }}
          >
            view portfolio →
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
