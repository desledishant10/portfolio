import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Command, Mail, Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { profile } from '../data/content';
import clsx from 'clsx';

const links = [
  { href: '#about', label: 'about', idx: '01' },
  { href: '#skills', label: 'skills', idx: '02' },
  { href: '#education', label: 'education', idx: '03' },
  { href: '#experience', label: 'experience', idx: '04' },
  { href: '#projects', label: 'projects', idx: '05' },
  { href: '#competitions', label: 'competitions', idx: '06' },
  { href: '#certifications', label: 'certifications', idx: '07' },
  { href: '#contact', label: 'contact', idx: '08' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('about');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersection ratio currently in view
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled ? 'bg-bg/70 backdrop-blur-lg border-b border-bg-border' : 'bg-transparent',
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#top" className="font-mono text-sm flex items-center gap-2 group">
          <span className="text-neon-green">$</span>
          <span className="text-ink group-hover:text-neon-cyan transition-colors">
            {profile.handle}
          </span>
          <span className="w-2 h-4 bg-neon-cyan animate-blink" aria-hidden />
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const id = l.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={l.href}
                href={l.href}
                className={clsx(
                  'relative group px-3 py-2 font-mono text-xs transition-colors',
                  isActive ? 'text-neon-cyan' : 'text-ink-dim hover:text-neon-cyan',
                )}
              >
                <span className="text-neon-green/70 mr-1">{l.idx}.</span>
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-2 right-2 -bottom-0.5 h-px bg-neon-cyan shadow-glow-cyan"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </a>
            );
          })}
          <div className="flex items-center gap-2 ml-3 pl-4 border-l border-bg-border">
            <button
              onClick={() => window.dispatchEvent(new Event('open-palette'))}
              aria-label="Open command palette"
              title="Open command palette (⌘K)"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all font-mono text-[11px]"
            >
              <Command size={13} />
              <span>K</span>
            </button>
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="p-2.5 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all">
              <GithubIcon size={20} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all">
              <LinkedinIcon size={20} />
            </a>
            <a href={`mailto:${profile.email}`} aria-label="Email" className="p-2.5 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all">
              <Mail size={20} />
            </a>
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden p-2 text-ink"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden border-t border-bg-border bg-bg/95 backdrop-blur-lg"
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((l) => {
              const id = l.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={clsx(
                    'py-2 font-mono text-sm transition-colors',
                    isActive ? 'text-neon-cyan' : 'text-ink-dim hover:text-neon-cyan',
                  )}
                >
                  <span className="text-neon-green/70 mr-2">{l.idx}.</span>
                  {l.label}
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
