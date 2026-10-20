/**
 * InteractiveTerminal - security model
 *
 * - All terminal output is rendered as React text nodes ({l.text}), never via
 *   dangerouslySetInnerHTML or any HTML-string injection. XSS via injected
 *   <script>/<img onerror=>/etc. payloads is therefore impossible - React's
 *   auto-escaping converts every value to a text node.
 * - Command dispatch is a strict allowlist (switch on the first token). Unknown
 *   commands return a static error message with the user's input embedded as
 *   text only.
 * - User input is sanitized: stripped of control characters / zero-width chars
 *   and hard-capped at INPUT_MAX before being processed.
 * - Output (`lines`) and history are length-capped to prevent runaway memory.
 * - External navigations are routed through `safeOpen()`, which validates the
 *   target via the URL parser and only permits same-origin paths, a small
 *   hardcoded host allowlist, and mailto:. All popups use noopener+noreferrer
 *   to prevent reverse-tabnabbing.
 * - No eval, Function constructor, dynamic import, or remote command execution.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile, projects, certifications, skills, competitions } from '../../data/content';

type Line = { kind: 'in' | 'out' | 'err'; text: string };

const INPUT_MAX = 200;
const LINES_MAX = 250;
const HISTORY_MAX = 50;

const ALLOWED_EXTERNAL_HOSTS = new Set([
  'github.com',
  'www.linkedin.com',
  'linkedin.com',
  'tryhackme.com',
]);

function sanitizeInput(s: string): string {
  // strip:
  //   \x00-\x1F     C0 control chars (incl. NUL, TAB, LF, CR - we don't want pasted newlines)
  //   \x7F-\x9F     DEL + C1 control chars
  //   U+200B-U+200D zero-width spaces / joiners (could hide input visually)
  //   U+FEFF        BOM / zero-width no-break space
  //   U+202A-U+202E bidirectional override controls (Trojan Source-style attacks)
  //   U+2066-U+2069 isolates
  // then cap to INPUT_MAX
  return s
    // eslint-disable-next-line no-control-regex -- stripping control bytes is the point
    .replace(/[\x00-\x1f\x7f-\x9f\u200b-\u200d\ufeff\u202a-\u202e\u2066-\u2069]/gu, '')
    .slice(0, INPUT_MAX);
}

function safeOpen(rawUrl: string) {
  let url: URL;
  try {
    url = new URL(rawUrl, window.location.origin);
  } catch {
    return;
  }
  if (url.protocol === 'mailto:') {
    window.location.href = url.toString();
    return;
  }
  if (url.origin === window.location.origin) {
    window.open(url.toString(), '_self', 'noopener,noreferrer');
    return;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  if (!ALLOWED_EXTERNAL_HOSTS.has(url.hostname)) return;
  window.open(url.toString(), '_blank', 'noopener,noreferrer');
}

const ASCII = `   _ _     _                _
 _| (_)___| |__   __ _ _ __ | |_
/ _\` | / __| '_ \\ / _\` | '_ \\| __|
\\__,_|_|___/_| |_|\\__,_|_| |_|\\__|`;

const COMMANDS_HELP = `available commands:
  help              show this list
  whoami            short bio
  banner            big ascii banner
  ls                list directories
  ls projects       list projects
  ls certs          list certifications
  ls skills         list skills
  ls competitions   list competitions
  cat <file>        show file (bio, focus, contact)
  resume            download resume.pdf
  goto <section>    scroll to section (about, skills, projects, etc.)
  contact           scroll to contact form
  github            open GitHub profile
  linkedin          open LinkedIn profile
  email             compose email
  thm               open TryHackMe profile
  date              current date
  clear             clear terminal
  sudo hire-me      ★`;

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'dishant.desle@portfolio:~$ booting shell...' },
    { kind: 'out', text: "type 'help' to see what i can do." },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const print = (out: Line[]) => {
    setLines((prev) => {
      // Defensively stringify and length-cap each line, then bound the buffer.
      const safe = out.map((l) => ({ ...l, text: String(l.text ?? '').slice(0, 8_000) }));
      const next = [...prev, ...safe];
      return next.length > LINES_MAX ? next.slice(next.length - LINES_MAX) : next;
    });
  };

  const run = (raw: string) => {
    const sanitized = sanitizeInput(raw);
    const cmd = sanitized.trim();
    const echo: Line = { kind: 'in', text: cmd };

    if (!cmd) {
      print([echo]);
      return;
    }

    const [head = '', ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ').slice(0, INPUT_MAX);

    const out: Line[] = [echo];

    try {
      switch (head.toLowerCase()) {
        case 'help':
          out.push({ kind: 'out', text: COMMANDS_HELP });
          break;
        case 'whoami':
          out.push({ kind: 'out', text: `${profile.name} - ${profile.title}` });
          out.push({ kind: 'out', text: profile.tagline });
          break;
        case 'banner':
          out.push({ kind: 'out', text: ASCII });
          break;
        case 'ls':
          if (!arg || arg === '~' || arg === '.') {
            out.push({ kind: 'out', text: 'about  skills  education  experience  projects  competitions  certifications  contact' });
          } else if (arg.startsWith('projects')) {
            out.push({ kind: 'out', text: projects.map((p, i) => `${i + 1}. ${p.title}`).join('\n') });
          } else if (arg.startsWith('certs') || arg.startsWith('certifications')) {
            out.push({ kind: 'out', text: certifications.map((c) => `· ${c.name} (${c.issuer})`).join('\n') });
          } else if (arg.startsWith('skills')) {
            out.push({ kind: 'out', text: skills.map((s) => `${s.label}: ${s.items.join(', ')}`).join('\n') });
          } else if (arg.startsWith('competitions')) {
            out.push({ kind: 'out', text: competitions.map((c) => `· ${c.name} (${c.detail})`).join('\n') });
          } else {
            out.push({ kind: 'err', text: `ls: cannot access '${arg}': No such directory` });
          }
          break;
        case 'cat':
          if (!arg) {
            out.push({ kind: 'err', text: 'cat: missing operand. try: cat bio | cat focus | cat contact' });
          } else if (/^bio|readme/i.test(arg)) {
            out.push({ kind: 'out', text: profile.bio });
          } else if (/^focus|stack/i.test(arg)) {
            out.push({ kind: 'out', text: profile.focus });
          } else if (/^contact|info/i.test(arg)) {
            out.push({ kind: 'out', text: `email:    ${profile.email}\ngithub:   ${profile.github}\nlinkedin: ${profile.linkedin}` });
          } else if (/^resume/i.test(arg)) {
            out.push({ kind: 'out', text: 'downloading resume.pdf...' });
            safeOpen(profile.resumePath);
          } else {
            out.push({ kind: 'err', text: `cat: ${arg}: No such file` });
          }
          break;
        case 'resume':
          out.push({ kind: 'out', text: 'fetching resume.pdf...' });
          safeOpen(profile.resumePath);
          break;
        case 'goto': {
          const section = arg.toLowerCase().replace(/[^a-z]/g, '').slice(0, 32);
          const valid = ['about', 'skills', 'education', 'experience', 'projects', 'competitions', 'certifications', 'contact'];
          if (valid.includes(section)) {
            out.push({ kind: 'out', text: `scrolling to /${section}...` });
            setTimeout(() => scrollToId(section), 100);
          } else {
            out.push({ kind: 'err', text: `goto: unknown section '${arg}'. try one of: ${valid.join(', ')}` });
          }
          break;
        }
        case 'contact':
          out.push({ kind: 'out', text: 'opening contact form...' });
          setTimeout(() => scrollToId('contact'), 100);
          break;
        case 'github':
          out.push({ kind: 'out', text: 'opening github.com/desledishant10...' });
          safeOpen(profile.github);
          break;
        case 'linkedin':
          out.push({ kind: 'out', text: 'opening linkedin...' });
          safeOpen(profile.linkedin);
          break;
        case 'email':
          out.push({ kind: 'out', text: `composing email to ${profile.email}...` });
          safeOpen(`mailto:${profile.email}`);
          break;
        case 'thm':
        case 'tryhackme':
          out.push({ kind: 'out', text: `opening tryhackme.com/p/${profile.tryhackmeUsername}...` });
          safeOpen(`https://tryhackme.com/p/${encodeURIComponent(profile.tryhackmeUsername)}`);
          break;
        case 'date':
          out.push({ kind: 'out', text: new Date().toString() });
          break;
        case 'echo':
          out.push({ kind: 'out', text: arg });
          break;
        case 'clear':
        case 'cls':
          setLines([]);
          setInput('');
          return;
        case 'sudo':
          if (/^hire-?me/i.test(arg)) {
            out.push({ kind: 'out', text: '★ access granted - recruiter mode' });
            out.push({ kind: 'out', text: 'opening contact form so you can do exactly that ↓' });
            setTimeout(() => scrollToId('contact'), 250);
          } else if (/^rm/i.test(arg)) {
            out.push({ kind: 'err', text: 'nice try.' });
          } else {
            out.push({ kind: 'err', text: `sudo: ${arg || 'usage: sudo <command>'}: command not found` });
          }
          break;
        case 'admin':
        case '/admin':
          out.push({ kind: 'out', text: 'authenticating... access granted. navigating to /admin' });
          setTimeout(() => navigate('/admin'), 400);
          break;
        case 'exit':
        case 'quit':
          out.push({ kind: 'out', text: "can't exit a portfolio. you're stuck with me." });
          break;
        default:
          out.push({ kind: 'err', text: `command not found: ${head}. type 'help' for options.` });
      }
    } catch (err) {
      out.push({ kind: 'err', text: 'internal terminal error - please refresh.' });
      if (import.meta.env.DEV) console.error('[terminal] dispatch failed:', err);
    }

    print(out);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      if (val.trim()) {
        setHistory((h) => {
          const next = [...h, val.slice(0, INPUT_MAX)];
          return next.length > HISTORY_MAX ? next.slice(next.length - HISTORY_MAX) : next;
        });
        setHistIdx(-1);
      }
      run(val);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx === -1) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="cursor-text font-mono text-[13px] leading-relaxed min-h-[260px]"
    >
      <div ref={scrollRef} className="max-h-[300px] overflow-y-auto space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {l.kind === 'in' && (
              <>
                <span className="text-neon-green">$ </span>
                <span className="text-ink">{l.text}</span>
              </>
            )}
            {l.kind === 'out' && <span className="text-ink-dim">{l.text}</span>}
            {l.kind === 'err' && <span className="text-neon-red">{l.text}</span>}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-neon-green shrink-0">$&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(sanitizeInput(e.target.value))}
            onKeyDown={onKeyDown}
            maxLength={INPUT_MAX}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            className="flex-1 bg-transparent outline-hidden text-ink caret-neon-cyan text-base sm:text-[13px]"
            aria-label="terminal input"
            inputMode="text"
          />
        </div>
      </div>
    </div>
  );
}
