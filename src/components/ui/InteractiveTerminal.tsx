import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { profile, projects, certifications, skills, competitions } from '../../data/content';

type Line = { kind: 'in' | 'out' | 'err'; text: string };

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

  const print = (out: Line[]) => setLines((prev) => [...prev, ...out]);

  const run = (raw: string) => {
    const cmd = raw.trim();
    const echo: Line = { kind: 'in', text: cmd };

    if (!cmd) {
      print([echo]);
      return;
    }

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(' ');

    let out: Line[] = [echo];

    switch (head.toLowerCase()) {
      case 'help':
        out.push({ kind: 'out', text: COMMANDS_HELP });
        break;
      case 'whoami':
        out.push({ kind: 'out', text: `${profile.name} — ${profile.title}` });
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
          window.location.href = profile.resumePath;
        } else {
          out.push({ kind: 'err', text: `cat: ${arg}: No such file` });
        }
        break;
      case 'resume':
        out.push({ kind: 'out', text: 'fetching resume.pdf...' });
        window.location.href = profile.resumePath;
        break;
      case 'goto': {
        const section = arg.toLowerCase().replace(/[^a-z]/g, '');
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
        window.open(profile.github, '_blank');
        break;
      case 'linkedin':
        out.push({ kind: 'out', text: 'opening linkedin...' });
        window.open(profile.linkedin, '_blank');
        break;
      case 'email':
        out.push({ kind: 'out', text: `composing email to ${profile.email}...` });
        window.location.href = `mailto:${profile.email}`;
        break;
      case 'thm':
      case 'tryhackme':
        out.push({ kind: 'out', text: `opening tryhackme.com/p/${profile.tryhackmeUsername}...` });
        window.open(`https://tryhackme.com/p/${profile.tryhackmeUsername}`, '_blank');
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
        if (/hire-?me/i.test(arg)) {
          out.push({ kind: 'out', text: '★ access granted — recruiter mode' });
          out.push({ kind: 'out', text: 'opening contact form so you can do exactly that ↓' });
          setTimeout(() => scrollToId('contact'), 250);
        } else if (arg.toLowerCase().startsWith('rm')) {
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
    print(out);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = input;
      if (val.trim()) {
        setHistory((h) => [...h, val]);
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
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            className="flex-1 bg-transparent outline-none text-ink caret-neon-cyan"
            aria-label="terminal input"
          />
        </div>
      </div>
    </div>
  );
}
