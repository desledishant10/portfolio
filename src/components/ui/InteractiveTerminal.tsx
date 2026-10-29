/**
 * InteractiveTerminal - security model
 *
 * - All terminal output is rendered as React text nodes ({l.text} / {span.t}),
 *   never via dangerouslySetInnerHTML or any HTML-string injection. XSS via
 *   injected <script>/<img onerror=>/etc. payloads is therefore impossible -
 *   React's auto-escaping converts every value to a text node. The color on a
 *   span is a hardcoded class from this file, never user input.
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

type Span = { t: string; c?: string };
type Line = { kind: 'in' | 'out' | 'err'; text?: string; cls?: string; spans?: Span[] };

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

// Compact DD monogram for the neofetch readout.
const NEOFETCH_LOGO = [
  ' ____  ____ ',
  '|  _ \\|  _ \\',
  '| | | | | | |',
  '| |_| | |_| |',
  '|____/|____/',
];

// Command completions powering the ghost autosuggestion + Tab-complete.
const COMPLETIONS = [
  'help', 'whoami', 'banner', 'neofetch', 'date', 'clear',
  'ls', 'ls projects', 'ls certs', 'ls skills', 'ls competitions',
  'cat bio', 'cat focus', 'cat contact', 'resume',
  'goto about', 'goto skills', 'goto projects', 'goto experience', 'goto contact',
  'contact', 'github', 'linkedin', 'email', 'thm', 'sudo hire-me', 'admin',
  'open github', 'open linkedin', 'open x', 'open bluesky', 'open mastodon',
  'open devto', 'open reddit', 'open hn', 'open thm', 'open resume', 'open profiles',
];

// One-click shortcuts so non-CLI visitors can explore without typing.
const CHIPS = ['help', 'whoami', 'neofetch', 'ls projects', 'resume', 'sudo hire-me'];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Powerline-style prompt. The caret glyph is green on success, red on the last
// command's failure, mirroring a real shell's exit-status prompt.
function Prompt({ ok = true }: { ok?: boolean }) {
  return (
    <>
      <span className="text-neon-cyan">ddesle3</span>
      <span className="text-ink-mute">@portfolio</span>
      <span className="text-neon-violet"> ~ </span>
      <span className={ok ? 'text-neon-green' : 'text-neon-red'}>{'\u276f'} </span>
    </>
  );
}

function helpLines(): Line[] {
  const rows: [string, string][] = [
    ['help', 'show this list'],
    ['whoami', 'short bio'],
    ['neofetch', 'system + stats readout'],
    ['banner', 'big ascii banner'],
    ['ls [dir]', 'list projects / certs / skills / competitions'],
    ['cat <file>', 'show bio / focus / contact'],
    ['resume', 'download resume.pdf'],
    ['goto <section>', 'scroll to a section'],
    ['contact', 'jump to the contact form'],
    ['open <target>', 'github / linkedin / x / bluesky / mastodon / reddit / hn / thm'],
    ['open profiles', 'print every handle (github, socials, hn ...)'],
    ['date', 'current date'],
    ['clear', 'clear the terminal'],
    ['sudo hire-me', 'the good ending'],
  ];
  const out: Line[] = [{ kind: 'out', text: 'available commands:', cls: 'text-ink-mute' }];
  for (const [cmd, desc] of rows) {
    out.push({
      kind: 'out',
      spans: [
        { t: '  ' + cmd.padEnd(20), c: 'text-neon-cyan' },
        { t: desc, c: 'text-ink-dim' },
      ],
    });
  }
  return out;
}

function neofetchLines(): Line[] {
  const skillCount = skills.reduce((n, s) => n + s.items.length, 0);
  const info: [string, string][] = [
    ['OS', 'PortfolioOS'],
    ['host', 'dishant.desle'],
    ['shell', 'zsh 5.9'],
    ['uptime', 'open_to_work'],
    ['skills', `${skillCount} across ${skills.length}`],
    ['certs', `${certifications.length}`],
    ['projects', `${projects.length}`],
    ['competitions', `${competitions.length}`],
    ['contact', 'run: contact'],
  ];
  const rows = Math.max(NEOFETCH_LOGO.length, info.length);
  const out: Line[] = [];
  for (let i = 0; i < rows; i++) {
    const logo = (NEOFETCH_LOGO[i] ?? '').padEnd(14);
    const pair = info[i];
    const spans: Span[] = [{ t: logo, c: 'text-neon-cyan' }, { t: '  ' }];
    if (pair) {
      spans.push({ t: pair[0].padEnd(13), c: 'text-neon-green' });
      spans.push({ t: pair[1], c: 'text-ink' });
    }
    out.push({ kind: 'out', spans });
  }
  out.push({ kind: 'out', text: '' });
  out.push({
    kind: 'out',
    spans: [
      { t: '\u2588\u2588\u2588', c: 'text-neon-green' },
      { t: '\u2588\u2588\u2588', c: 'text-neon-cyan' },
      { t: '\u2588\u2588\u2588', c: 'text-neon-violet' },
      { t: '\u2588\u2588\u2588', c: 'text-neon-amber' },
      { t: '\u2588\u2588\u2588', c: 'text-neon-red' },
      { t: '\u2588\u2588\u2588', c: 'text-neon-pink' },
    ],
  });
  return out;
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<Line[]>([
    { kind: 'out', text: 'dishant.desle@portfolio:~$ booting shell...', cls: 'text-ink-dim' },
    {
      kind: 'out',
      spans: [
        { t: 'type ', c: 'text-ink-dim' },
        { t: "'help'", c: 'text-neon-cyan' },
        { t: ' or tap a chip below to explore.', c: 'text-ink-dim' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number>(-1);
  const [ok, setOk] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  // Ghost autosuggestion: the first completion that extends the current input.
  const suggestion =
    input.trim().length > 0 ? COMPLETIONS.find((c) => c.startsWith(input) && c.length > input.length) : undefined;
  const ghost = suggestion ? suggestion.slice(input.length) : '';

  const print = (out: Line[]) => {
    setLines((prev) => {
      const safe = out.map((l) => {
        if (l.spans) {
          return { ...l, spans: l.spans.slice(0, 64).map((s) => ({ ...s, t: String(s.t ?? '').slice(0, 2000) })) };
        }
        return { ...l, text: String(l.text ?? '').slice(0, 8000) };
      });
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
          out.push(...helpLines());
          break;
        case 'neofetch':
          out.push(...neofetchLines());
          break;
        case 'whoami':
          out.push({
            kind: 'out',
            spans: [
              { t: profile.name, c: 'text-neon-cyan' },
              { t: ' - ' + profile.title, c: 'text-ink-dim' },
            ],
          });
          out.push({ kind: 'out', text: profile.tagline, cls: 'text-ink-dim' });
          break;
        case 'banner':
          out.push({ kind: 'out', text: ASCII, cls: 'text-neon-cyan' });
          break;
        case 'ls':
          if (!arg || arg === '~' || arg === '.') {
            const dirs = ['about', 'skills', 'education', 'experience', 'projects', 'competitions', 'certifications', 'contact'];
            out.push({
              kind: 'out',
              spans: dirs.flatMap((d, i) => (i === 0 ? [{ t: d, c: 'text-neon-cyan' }] : [{ t: '  ' }, { t: d, c: 'text-neon-cyan' }])),
            });
          } else if (arg.startsWith('projects')) {
            projects.forEach((p, i) =>
              out.push({ kind: 'out', spans: [{ t: `${i + 1}. `, c: 'text-ink-mute' }, { t: p.title, c: 'text-ink' }] }),
            );
          } else if (arg.startsWith('certs') || arg.startsWith('certifications')) {
            certifications.forEach((c) =>
              out.push({
                kind: 'out',
                spans: [{ t: '\u00b7 ', c: 'text-neon-green' }, { t: c.name, c: 'text-ink' }, { t: ` (${c.issuer})`, c: 'text-ink-mute' }],
              }),
            );
          } else if (arg.startsWith('skills')) {
            skills.forEach((s) =>
              out.push({ kind: 'out', spans: [{ t: s.label + ': ', c: 'text-neon-cyan' }, { t: s.items.join(', '), c: 'text-ink-dim' }] }),
            );
          } else if (arg.startsWith('competitions')) {
            competitions.forEach((c) =>
              out.push({
                kind: 'out',
                spans: [{ t: '\u00b7 ', c: 'text-neon-amber' }, { t: c.name, c: 'text-ink' }, { t: ` (${c.detail})`, c: 'text-ink-mute' }],
              }),
            );
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
        case 'open': {
          // Forgiving `open <target>` alias for the destination commands - people
          // naturally type `open github` / `open linkedin`.
          const target = arg.toLowerCase().split(/\s+/)[0] || '';
          switch (target) {
            case 'github':
              out.push({ kind: 'out', text: 'opening github.com/desledishant10...' });
              safeOpen(profile.github);
              break;
            case 'linkedin':
              out.push({ kind: 'out', text: 'opening linkedin...' });
              safeOpen(profile.linkedin);
              break;
            case 'thm':
            case 'tryhackme':
              out.push({ kind: 'out', text: `opening tryhackme.com/p/${profile.tryhackmeUsername}...` });
              safeOpen(`https://tryhackme.com/p/${encodeURIComponent(profile.tryhackmeUsername)}`);
              break;
            case 'resume':
            case 'cv':
              out.push({ kind: 'out', text: 'fetching resume.pdf...' });
              safeOpen(profile.resumePath);
              break;
            case 'email':
            case 'mail':
              out.push({ kind: 'out', text: `composing email to ${profile.email}...` });
              safeOpen(`mailto:${profile.email}`);
              break;
            case 'x':
            case 'twitter':
              out.push({ kind: 'out', text: 'opening x.com/dishant_desle...' });
              safeOpen(profile.twitter);
              break;
            case 'bluesky':
            case 'bsky':
              out.push({ kind: 'out', text: 'opening bsky.app/profile/jinjijo...' });
              safeOpen(profile.bluesky);
              break;
            case 'mastodon':
            case 'masto':
              out.push({ kind: 'out', text: 'opening infosec.exchange/@jinjijo...' });
              safeOpen(profile.mastodon);
              break;
            case 'devto':
            case 'dev':
              out.push({ kind: 'out', text: 'opening dev.to/dishant_desle...' });
              safeOpen(profile.devto);
              break;
            case 'reddit':
              out.push({ kind: 'out', text: 'opening reddit.com/user/didesle...' });
              safeOpen(profile.reddit);
              break;
            case 'hn':
            case 'hackernews':
              out.push({ kind: 'out', text: 'opening news.ycombinator.com...' });
              safeOpen(profile.hackernews);
              break;
            case 'admin':
              out.push({ kind: 'out', text: 'authenticating... access granted. navigating to /admin' });
              setTimeout(() => navigate('/admin'), 400);
              break;
            case 'profiles':
            case 'profile':
            case 'socials':
            case 'links':
              out.push({
                kind: 'out',
                text: `github:   ${profile.github}\nlinkedin: ${profile.linkedin}\nx:        ${profile.twitter}\nbluesky:  ${profile.bluesky}\nmastodon: ${profile.mastodon}\ndev.to:   ${profile.devto}\nreddit:   ${profile.reddit}\nhn:       ${profile.hackernews}`,
              });
              break;
            case '':
              out.push({ kind: 'err', text: 'open: usage: open <github|linkedin|x|bluesky|mastodon|devto|reddit|hn|thm|resume|email|profiles>' });
              break;
            default:
              out.push({ kind: 'err', text: `open: unknown target '${target}'. try: open profiles (lists all), or github, linkedin, x, bluesky, mastodon, devto, reddit, hn, thm, resume, email` });
          }
          break;
        }
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
          setOk(true);
          return;
        case 'sudo':
          if (/^hire-?me/i.test(arg)) {
            out.push({ kind: 'out', spans: [{ t: '\u2605 access granted - recruiter mode', c: 'text-neon-green' }] });
            out.push({ kind: 'out', text: 'opening contact form so you can do exactly that \u2193' });
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

    setOk(!out.some((l) => l.kind === 'err'));
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInput(suggestion);
        setHistIdx(-1);
      }
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
      setOk(true);
    }
  };

  const renderLine = (l: Line) => {
    if (l.kind === 'in') {
      return (
        <>
          <Prompt />
          <span className="text-ink">{l.text}</span>
        </>
      );
    }
    const fallback = l.kind === 'err' ? 'text-neon-red' : 'text-ink-dim';
    return (
      <>
        {l.kind === 'err' && <span className="text-neon-red">{'\u2717'} </span>}
        {l.spans
          ? l.spans.map((s, j) => (
              <span key={j} className={s.c ?? fallback}>
                {s.t}
              </span>
            ))
          : <span className={l.cls ?? fallback}>{l.text}</span>}
      </>
    );
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="cursor-text font-mono text-[13px] leading-relaxed min-h-[260px]"
    >
      <div ref={scrollRef} className="max-h-[300px] overflow-y-auto space-y-0.5">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap break-words">
            {renderLine(l)}
          </div>
        ))}

        {/* live input line with ghost autosuggestion */}
        <div className="flex items-center">
          <span className="shrink-0">
            <Prompt ok={ok} />
          </span>
          <div className="relative flex-1 min-w-0">
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none overflow-hidden whitespace-pre text-base sm:text-[13px]"
            >
              <span className="invisible">{input}</span>
              <span className="text-ink-mute/50">{ghost}</span>
            </div>
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
              className="relative w-full bg-transparent outline-hidden text-ink caret-neon-cyan text-base sm:text-[13px]"
              aria-label="terminal input"
              inputMode="text"
            />
          </div>
        </div>
      </div>

      {/* one-click command chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {CHIPS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              run(c);
              inputRef.current?.focus();
            }}
            className="chip hover:border-neon-cyan/40 hover:text-neon-cyan transition-colors focus:outline-hidden focus-visible:ring-1 focus-visible:ring-neon-cyan"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
