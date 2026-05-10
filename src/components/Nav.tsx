import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Menu, X } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { profile } from '../data/content';
import clsx from 'clsx';

const links = [
  { href: '#about', label: 'about', idx: '01' },
  { href: '#skills', label: 'skills', idx: '02' },
  { href: '#experience', label: 'experience', idx: '03' },
  { href: '#projects', label: 'projects', idx: '04' },
  { href: '#competitions', label: 'competitions', idx: '05' },
  { href: '#certifications', label: 'certifications', idx: '06' },
  { href: '#education', label: 'education', idx: '07' },
  { href: '#contact', label: 'contact', idx: '08' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group px-3 py-2 font-mono text-xs text-ink-dim hover:text-neon-cyan transition-colors"
            >
              <span className="text-neon-green/70 mr-1">{l.idx}.</span>
              {l.label}
            </a>
          ))}
          <div className="flex items-center gap-2 ml-3 pl-4 border-l border-bg-border">
            <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="p-2.5 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all">
              <GithubIcon size={20} />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="p-2.5 rounded-md border border-bg-border text-ink-dim hover:text-neon-cyan hover:border-neon-cyan/40 hover:shadow-glow-cyan transition-all">
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
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2 font-mono text-sm text-ink-dim hover:text-neon-cyan"
              >
                <span className="text-neon-green/70 mr-2">{l.idx}.</span>
                {l.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
