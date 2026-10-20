/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#05070a',
          soft: '#0a0e14',
          panel: '#0d1218',
          border: '#1a2330',
        },
        neon: {
          green: '#00ff9c',
          cyan: '#22d3ee',
          violet: '#a855f7',
          pink: '#f472b6',
          amber: '#fbbf24',
          red: '#ef4444',
        },
        ink: {
          DEFAULT: '#e6edf3',
          dim: '#9ba8b8',
          // 5.7:1 on the darkest bg (#05070a) - passes WCAG AA for small text;
          // was #5a6877 (3.5:1, failed). Still clearly muted vs ink.dim.
          mute: '#7d8a99',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 24px rgba(0, 255, 156, 0.35)',
        'glow-cyan': '0 0 24px rgba(34, 211, 238, 0.35)',
        'glow-violet': '0 0 24px rgba(168, 85, 247, 0.35)',
      },
      animation: {
        // scan + gradient are raw @keyframes in src/index.css: Tailwind only
        // emits config keyframes for classes it can scan, and .scanline /
        // .gradient-text use a raw `animation:`, so the config copies never shipped.
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'grid-lines': 'linear-gradient(rgba(34, 211, 238, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
