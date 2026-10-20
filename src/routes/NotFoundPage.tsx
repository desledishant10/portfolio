import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Command, Search } from 'lucide-react';
import { GlitchText } from '../components/ui/GlitchText';

// Sanitize the pathname before rendering. React already escapes text nodes, so
// HTML/script injection is impossible. This extra pass strips control chars,
// bidi-override characters (Trojan Source-style), and caps length - preventing
// visual confusion / very-long-path layout abuse from crafted URLs like
// `/foo<bidi-override>bar`. The ranges stay as \u escapes so this file remains
// plain text (not "binary") on GitHub - never paste the raw control bytes here.
function safePath(): string {
  const raw = typeof window !== 'undefined' ? window.location.pathname : '/';
  // eslint-disable-next-line no-control-regex -- stripping control bytes is the point
  return raw.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/gu, '').slice(0, 80);
}

// Real home-page sections. The 404 is not the homepage: these live on "/", so
// each entry is a plain full-navigation anchor to the hash the browser scrolls
// to, NOT a client-side <Link>.
const sections = [
  'about',
  'skills',
  'education',
  'experience',
  'projects',
  'competitions',
  'certifications',
  'contact',
] as const;

// Staggered "printing" of each terminal line - it reads as the shell responding
// line by line, but nothing is actually deferred, so a lost visitor can click a
// destination the instant it paints. prefers-reduced-motion is honored by the
// global <MotionConfig reducedMotion="user"> in main.tsx.
const screen = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const line = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
};

function openPalette() {
  window.dispatchEvent(new CustomEvent('open-palette'));
}

export default function NotFoundPage() {
  const path = safePath();

  // Reflect the error in the tab title; restore the original on navigate-away.
  useEffect(() => {
    const prev = document.title;
    document.title = '404 - page not found | Dishant Desle';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl panel scanline overflow-hidden"
      >
        {/* window chrome (decorative) */}
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-bg-border bg-bg-soft"
          aria-hidden
        >
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-neon-red/70" />
            <span className="h-3 w-3 rounded-full bg-neon-amber/70" />
            <span className="h-3 w-3 rounded-full bg-neon-green/70" />
          </span>
          <span className="ml-2 font-mono text-xs text-ink-mute truncate">
            dishant.desle@portfolio: ~{path}
          </span>
          <span className="ml-auto chip-accent shrink-0">exit 404</span>
        </div>

        <div className="p-6 sm:p-8 md:p-10">
          <div className="font-mono text-xs text-neon-red mb-4" aria-hidden>
            ERR_ROUTE_NOT_FOUND - no such path on this host
          </div>

          <h1 className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight gradient-text mb-3">
            <GlitchText className="">404</GlitchText>
          </h1>
          {/* The real, plain-language recovery message - carries the meaning for
              screen readers, since the terminal transcript below is aria-hidden. */}
          <p className="font-mono text-sm text-ink-dim mb-7 max-w-md">
            That path does not resolve on this site. Pick a section below, or head back home.
          </p>

          {/* Faux shell: cat the bad path, then ls the sections that do exist.
              The echoed-path lines are decorative (aria-hidden); only the
              labelled nav of real sections is exposed to assistive tech. */}
          <motion.div
            variants={screen}
            initial="hidden"
            animate="show"
            className="font-mono text-sm leading-relaxed space-y-1 mb-8"
          >
            <motion.div variants={line} aria-hidden>
              <span className="text-neon-green">$ </span>
              <span className="text-ink">cat {path}</span>
            </motion.div>
            <motion.div variants={line} className="text-neon-red" aria-hidden>
              cat: {path}: No such file or directory
            </motion.div>

            <motion.div variants={line} className="pt-3" aria-hidden>
              <span className="text-neon-green">$ </span>
              <span className="text-ink">ls ~/</span>
              <span className="text-ink-mute"> # routes that resolve:</span>
            </motion.div>

            <motion.div variants={line}>
              <nav aria-label="Site sections">
                <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-1.5 pl-3 pt-1">
                  {sections.map((s) => (
                    <li key={s}>
                      <a
                        href={`/#${s}`}
                        className="group inline-flex items-center gap-1 rounded-sm text-neon-green/90 hover:text-neon-cyan focus:outline-hidden focus-visible:ring-1 focus-visible:ring-neon-cyan transition-colors"
                      >
                        <span aria-hidden className="text-ink-mute group-hover:text-neon-cyan/60">
                          /
                        </span>
                        {s}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>

            <motion.div variants={line} className="pt-2 flex items-center" aria-hidden>
              <span className="text-neon-green">$ </span>
              <span className="ml-1 inline-block h-4 w-2 bg-neon-green/80 animate-blink" />
            </motion.div>
          </motion.div>

          {/* wayfinding */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              aria-label="Return to the homepage"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-bg font-mono text-sm font-semibold rounded-sm hover:shadow-glow-cyan focus:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg transition-all"
            >
              <ArrowLeft size={16} aria-hidden /> cd ~
            </Link>
            <button
              type="button"
              onClick={openPalette}
              aria-label="Open command palette to search (Command or Control + K)"
              className="group inline-flex items-center gap-2 px-4 py-2.5 border border-bg-border text-ink-dim font-mono text-sm rounded-sm hover:border-neon-cyan/50 hover:text-neon-cyan focus:outline-hidden focus-visible:ring-2 focus-visible:ring-neon-cyan transition-all"
            >
              <Search size={15} aria-hidden /> search
              <kbd className="flex items-center gap-1 text-[11px] text-ink-mute border border-bg-border rounded-sm px-1.5 py-0.5 group-hover:border-neon-cyan/40">
                <Command size={11} aria-hidden /> K
              </kbd>
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
