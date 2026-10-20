import { useEffect, useId, useMemo, useRef, useState } from 'react';
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

  { id: 'github', label: 'open GitHub', group: 'links', icon: <GithubIcon size={14} />, action: () => window.open(profile.github, '_blank', 'noopener,noreferrer') },
  { id: 'linkedin', label: 'open LinkedIn', group: 'links', icon: <LinkedinIcon size={14} />, action: () => window.open(profile.linkedin, '_blank', 'noopener,noreferrer') },
  { id: 'email', label: `email ${profile.email}`, group: 'links', icon: <Mail size={14} />, action: () => (window.location.href = `mailto:${profile.email}`) },

  { id: 'resume', label: 'download resume.pdf', hint: 'cat', group: 'actions', icon: <Download size={14} />, keywords: ['resume', 'cv', 'cat'], action: () => (window.location.href = profile.resumePath) },
  { id: 'home', label: 'cd ~ (home)', group: 'actions', icon: <Terminal size={14} />, action: (nav) => nav('/') },

  { id: 'admin', label: 'open /admin (secret SOC)', hint: 'classified', group: 'secret', icon: <Shield size={14} />, keywords: ['admin', 'siem', 'soc', 'secret', 'easter'], action: (nav) => nav('/admin') },
  { id: 'docs', label: 'view source on GitHub', group: 'secret', icon: <BookOpen size={14} />, keywords: ['code', 'source'], action: () => window.open('https://github.com/desledishant10/portfolio', '_blank', 'noopener,noreferrer') },
];

const GROUP_LABELS = {
  sections: 'navigate',
  links: 'social',
  actions: 'actions',
  secret: 'system',
} as const;

export function CommandPalette() {
  const baseId = useId();
  const listboxId = `${baseId}-listbox`;
  const optionId = (id: string) => `${baseId}-opt-${id}`;
  const groupLabelId = (g: string) => `${baseId}-grp-${g}`;

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  // The element focused before opening, so focus returns there on close.
  const triggerRef = useRef<HTMLElement | null>(null);
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
    const onCustom = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onCustom);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onCustom);
    };
  }, []);

  // Focus management: on open, remember the trigger and move focus into the
  // dialog; on close, restore focus to the trigger (dialog pattern).
  useEffect(() => {
    if (open) {
      triggerRef.current = (document.activeElement as HTMLElement) ?? null;
      setQ('');
      setActive(0);
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    triggerRef.current?.focus?.();
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
  const activeItem = flat[active];

  // Keep the active option scrolled into view as the user arrows through it.
  useEffect(() => {
    if (!open || !activeItem) return;
    document.getElementById(`${baseId}-opt-${activeItem.id}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, activeItem, baseId]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % Math.max(1, flat.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a - 1 + flat.length) % Math.max(1, flat.length));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(Math.max(0, flat.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeItem) {
        activeItem.action(navigate);
        setOpen(false);
      }
    } else if (e.key === 'Tab') {
      // The search input is the only focusable element; trap focus on it.
      e.preventDefault();
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
          className="fixed inset-0 z-[80] bg-bg/70 backdrop-blur-xs flex items-start justify-center pt-[12vh] px-4"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ scale: 0.96, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg panel border-neon-cyan/30 shadow-glow-cyan overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-bg-border bg-bg-soft">
              <Search size={14} aria-hidden className="text-neon-cyan shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="type a command..."
                role="combobox"
                aria-label="Search commands"
                aria-expanded={flat.length > 0}
                aria-controls={listboxId}
                aria-activedescendant={activeItem ? optionId(activeItem.id) : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-hidden font-mono text-base sm:text-sm text-ink placeholder:text-ink-mute"
              />
              <kbd aria-hidden className="font-mono text-[10px] text-ink-mute border border-bg-border px-1.5 py-0.5 rounded-sm">
                esc
              </kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto py-1">
              {flat.length === 0 ? (
                <div role="status" className="px-4 py-6 text-center font-mono text-xs text-ink-mute">
                  no commands found · try "github", "resume", or "secret"
                </div>
              ) : (
                <div role="listbox" id={listboxId} aria-label="Commands">
                  {(['sections', 'links', 'actions', 'secret'] as const).map((g) => {
                    const groupItems = grouped[g];
                    if (!groupItems || groupItems.length === 0) return null;
                    return (
                      <div key={g} role="group" aria-labelledby={groupLabelId(g)}>
                        <div
                          id={groupLabelId(g)}
                          className="px-4 pt-2 pb-1 font-mono text-[9px] uppercase tracking-widest text-ink-mute"
                        >
                          <span aria-hidden>// </span>
                          {GROUP_LABELS[g]}
                        </div>
                        {groupItems.map((it) => {
                          const idx = flat.indexOf(it);
                          const isActive = idx === active;
                          return (
                            <div
                              key={it.id}
                              id={optionId(it.id)}
                              role="option"
                              aria-selected={isActive}
                              onMouseEnter={() => setActive(idx)}
                              onClick={() => {
                                it.action(navigate);
                                setOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-left font-mono text-xs cursor-pointer transition-colors ${
                                isActive ? 'bg-neon-cyan/10 text-neon-cyan' : 'text-ink-dim hover:text-ink'
                              }`}
                            >
                              <span aria-hidden className={isActive ? 'text-neon-cyan' : 'text-ink-mute'}>
                                {it.icon}
                              </span>
                              <span className="flex-1 truncate">{it.label}</span>
                              {it.hint && (
                                <span className="text-[10px] text-ink-mute">{it.hint}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div
              aria-hidden
              className="px-4 py-2 border-t border-bg-border bg-bg-soft flex items-center justify-between font-mono text-[10px] text-ink-mute"
            >
              <div className="flex items-center gap-3">
                <span>
                  <kbd className="border border-bg-border px-1 rounded-sm">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="border border-bg-border px-1 rounded-sm">↵</kbd> select
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
