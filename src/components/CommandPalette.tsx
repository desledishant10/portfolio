import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BookOpen,
  Briefcase,
  Code2,
  Command,
  Download,
  GraduationCap,
  Mail,
  MessageSquare,
  Radar,
  Search,
  Shield,
  Swords,
  Terminal,
  User,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { profile } from '../data/content';

type Item = {
  id: string;
  label: string;
  hint?: string;
  group: 'sections' | 'links' | 'actions' | 'secret';
  icon: React.ReactNode;
  keywords?: string[];
  action: (nav: ReturnType<typeof useNavigate>) => void;
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const items: Item[] = [
  { id: 'about', label: 'about_me', group: 'sections', icon: <User size={14} />, action: () => scrollTo('about') },
  { id: 'skills', label: 'skills_&_tooling', group: 'sections', icon: <Code2 size={14} />, action: () => scrollTo('skills') },
  { id: 'education', label: 'education', group: 'sections', icon: <GraduationCap size={14} />, action: () => scrollTo('education') },
  { id: 'experience', label: 'experience', group: 'sections', icon: <Briefcase size={14} />, action: () => scrollTo('experience') },
  { id: 'projects', label: 'projects', group: 'sections', icon: <Radar size={14} />, action: () => scrollTo('projects') },
  { id: 'competitions', label: 'competitions', group: 'sections', icon: <Swords size={14} />, action: () => scrollTo('competitions') },
  { id: 'certifications', label: 'certifications', group: 'sections', icon: <Award size={14} />, action: () => scrollTo('certifications') },
  { id: 'contact', label: 'contact', group: 'sections', icon: <MessageSquare size={14} />, action: () => scrollTo('contact') },

  { id: 'github', label: 'open GitHub', group: 'links', icon: <GithubIcon size={14} />, action: () => window.open(profile.github, '_blank') },
  { id: 'linkedin', label: 'open LinkedIn', group: 'links', icon: <LinkedinIcon size={14} />, action: () => window.open(profile.linkedin, '_blank') },
  { id: 'email', label: `email ${profile.email}`, group: 'links', icon: <Mail size={14} />, action: () => (window.location.href = `mailto:${profile.email}`) },

  { id: 'resume', label: 'download resume.pdf', hint: 'cat', group: 'actions', icon: <Download size={14} />, keywords: ['resume', 'cv', 'cat'], action: () => (window.location.href = profile.resumePath) },
  { id: 'home', label: 'cd ~ (home)', group: 'actions', icon: <Terminal size={14} />, action: (nav) => nav('/') },

  { id: 'admin', label: 'open /admin (secret SOC)', hint: 'classified', group: 'secret', icon: <Shield size={14} />, keywords: ['admin', 'siem', 'soc', 'secret', 'easter'], action: (nav) => nav('/admin') },
  { id: 'docs', label: 'view source on GitHub', group: 'secret', icon: <BookOpen size={14} />, keywords: ['code', 'source'], action: () => window.open('https://github.com/desledishant10/portfolio', '_blank') },
];

const GROUP_LABELS = {
  sections: 'navigate',
  links: 'social',
  actions: 'actions',
  secret: 'system',
} as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isOpenCombo = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isOpenCombo) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return items;
    return items.filter((it) => {
      const hay = `${it.label} ${it.hint ?? ''} ${(it.keywords ?? []).join(' ')}`.toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  // Reset active when filter changes
  useEffect(() => {
    setActive(0);
  }, [q]);

  // Group filtered items, preserving order
  const grouped = useMemo(() => {
    const out: Record<string, Item[]> = {};
    for (const it of filtered) {
      if (!out[it.group]) out[it.group] = [];
      out[it.group].push(it);
    }
    return out;
  }, [filtered]);

  const flat = filtered;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(1, flat.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flat[active];
      if (item) {
        item.action(navigate);
        setOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] bg-bg/70 backdrop-blur-sm flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg panel border-neon-cyan/30 shadow-glow-cyan overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-bg-border bg-bg-soft">
              <Search size={14} className="text-neon-cyan shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="type a command..."
                className="flex-1 bg-transparent outline-none font-mono text-sm text-ink placeholder:text-ink-mute"
              />
              <kbd className="font-mono text-[10px] text-ink-mute border border-bg-border px-1.5 py-0.5 rounded">
                esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-1">
              {flat.length === 0 ? (
                <div className="px-4 py-6 text-center font-mono text-xs text-ink-mute">
                  no commands found · try "github", "resume", or "secret"
                </div>
              ) : (
                (['sections', 'links', 'actions', 'secret'] as const).map((g) => {
                  const groupItems = grouped[g];
                  if (!groupItems || groupItems.length === 0) return null;
                  return (
                    <div key={g}>
                      <div className="px-4 pt-2 pb-1 font-mono text-[9px] uppercase tracking-widest text-ink-mute">
                        // {GROUP_LABELS[g]}
                      </div>
                      {groupItems.map((it) => {
                        const idx = flat.indexOf(it);
                        const isActive = idx === active;
                        return (
                          <button
                            key={it.id}
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => {
                              it.action(navigate);
                              setOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left font-mono text-xs transition-colors ${
                              isActive ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-ink-dim hover:text-ink'
                            }`}
                          >
                            <span className={isActive ? 'text-neon-cyan' : 'text-ink-mute'}>
                              {it.icon}
                            </span>
                            <span className="flex-1 truncate">{it.label}</span>
                            {it.hint && (
                              <span className="text-[10px] text-ink-mute">{it.hint}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            <div className="px-4 py-2 border-t border-bg-border bg-bg-soft flex items-center justify-between font-mono text-[10px] text-ink-mute">
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="border border-bg-border px-1 rounded">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="border border-bg-border px-1 rounded">↵</kbd> select
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command size={10} /> K
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
