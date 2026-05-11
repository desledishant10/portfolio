import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Mail, Send, ShieldCheck, XCircle } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './ui/BrandIcons';
import { profile } from '../data/content';
import { SectionHeader } from './ui/SectionHeader';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string>('');

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileRef.current) return;
    const id = 'cf-turnstile-script';
    const render = () => {
      if (!window.turnstile || !turnstileRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        size: 'flexible',
        callback: (t: string) => setToken(t),
        'error-callback': () => setToken(''),
        'expired-callback': () => setToken(''),
      });
    };
    if (document.getElementById(id)) {
      render();
      return;
    }
    const s = document.createElement('script');
    s.id = id;
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    s.async = true;
    s.defer = true;
    s.onload = render;
    document.body.appendChild(s);
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const fd = new FormData(e.currentTarget);
    const honeypot = String(fd.get('website') || '');
    if (honeypot) {
      // Bot detected — pretend success client-side; server will also reject.
      setStatus('sent');
      return;
    }

    const payload = {
      name: String(fd.get('name') || '').trim(),
      email: String(fd.get('email') || '').trim(),
      message: String(fd.get('message') || '').trim(),
      website: honeypot, // forwarded for server-side honeypot defense in depth
      turnstileToken: token,
    };

    if (!payload.name || !payload.email || !payload.message) {
      setStatus('error');
      setErrorMsg('all fields are required');
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `request failed (${res.status})`);
      }
      setStatus('sent');
      (e.target as HTMLFormElement).reset();
      if (window.turnstile && widgetIdRef.current) window.turnstile.reset(widgetIdRef.current);
      setToken('');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'something went wrong');
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader index="08." title="contact" subtitle="// open_socket()" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 panel p-6 flex flex-col gap-4"
          >
            <p className="text-ink-dim leading-relaxed">
              I'm currently open to <span className="text-neon-green">SOC analyst</span>,{' '}
              <span className="text-neon-cyan">threat detection</span>, and{' '}
              <span className="text-neon-violet">incident response</span> roles starting summer 2026.
              Drop a message — I read every one.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-3 panel panel-hover text-sm font-mono group"
              >
                <Mail size={16} className="text-neon-cyan" />
                <span className="text-ink-dim group-hover:text-neon-cyan break-all">{profile.email}</span>
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 panel panel-hover text-sm font-mono group"
              >
                <LinkedinIcon size={16} className="text-neon-cyan" />
                <span className="text-ink-dim group-hover:text-neon-cyan">/in/dishant-desle</span>
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 panel panel-hover text-sm font-mono group"
              >
                <GithubIcon size={16} className="text-neon-cyan" />
                <span className="text-ink-dim group-hover:text-neon-cyan">@{profile.handle}</span>
              </a>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-mute font-mono">
              <ShieldCheck size={12} className="text-neon-green" />
              <span>protected by turnstile + honeypot</span>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={onSubmit}
            className="lg:col-span-3 panel p-6 flex flex-col gap-4"
          >
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              className="hidden"
            />

            <Field label="name" name="name" required maxLength={120} placeholder="ada lovelace" />
            <Field
              label="email"
              name="email"
              type="email"
              required
              maxLength={200}
              placeholder="ada@analyticalengine.io"
            />
            <Field
              label="message"
              name="message"
              required
              textarea
              maxLength={5000}
              placeholder="hey dishant — would love to chat about a SOC role at..."
            />

            {TURNSTILE_SITE_KEY ? (
              <div ref={turnstileRef} className="cf-turnstile" />
            ) : (
              <div className="text-[10px] font-mono text-ink-mute">
                // turnstile not configured — set VITE_TURNSTILE_SITE_KEY before deploy
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="self-start inline-flex items-center gap-2 px-5 py-2.5 bg-neon-cyan text-bg font-mono text-sm font-semibold rounded hover:shadow-glow-cyan transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> sending...
                </>
              ) : (
                <>
                  <Send size={14} /> send_message()
                </>
              )}
            </button>

            {status === 'sent' && (
              <div className="flex items-center gap-2 text-sm font-mono text-neon-green">
                <CheckCircle2 size={14} /> message delivered. i'll get back to you soon.
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-sm font-mono text-neon-red">
                <XCircle size={14} /> {errorMsg || 'send failed — try email instead'}
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  maxLength,
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls =
    'w-full bg-bg-soft border border-bg-border rounded px-3 py-2.5 font-mono text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/30 transition-colors';
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-xs text-ink-dim">
        <span className="text-neon-green">›</span> {label}
        {required && <span className="text-neon-red ml-1">*</span>}
      </span>
      {textarea ? (
        <textarea name={name} required={required} maxLength={maxLength} rows={5} placeholder={placeholder} className={cls + ' resize-none'} />
      ) : (
        <input name={name} type={type} required={required} maxLength={maxLength} placeholder={placeholder} className={cls} />
      )}
    </label>
  );
}
