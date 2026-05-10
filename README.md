# dishant.desle — portfolio

Personal portfolio site for Dishant Desle (cybersecurity analyst, M.S. Cyber Security @ University of Denver, grad Aug 2026).

Cyberpunk/terminal aesthetic. Animated matrix rain, glitch typography, 3D-tilt project cards, scroll-triggered reveals, secure contact form.

## stack

- **Vite + React 19 + TypeScript**
- **Tailwind CSS 3** (custom cyber theme)
- **Framer Motion** (scroll/tilt/reveal animations)
- **Lucide** + custom inline brand SVGs (icons)
- **Vercel Serverless Function** (`api/contact.ts`) — sends mail via **Resend**
- **Cloudflare Turnstile** invisible CAPTCHA + honeypot field + IP rate limit (3/min)

## local dev

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # type-check + production build to dist/
npm run preview      # preview the dist/ build locally
```

## first-time deploy to vercel

### 1. push to GitHub

```bash
cd ~/portfolio
git init
git add .
git commit -m "init: cyberpunk portfolio"
gh repo create portfolio --public --source=. --remote=origin --push
# or manually: git remote add origin https://github.com/desledishant10/portfolio.git && git push -u origin main
```

### 2. import to vercel

1. https://vercel.com/new → "Import Git Repository" → select `portfolio`
2. Framework preset: **Vite** (auto-detected — confirm)
3. Don't deploy yet — set env vars first (step 3).

### 3. set environment variables (Vercel → Project → Settings → Environment Variables)

| key | value | scope |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | site key from Cloudflare Turnstile | Production, Preview, Development |
| `TURNSTILE_SECRET_KEY` | secret key from Cloudflare Turnstile | Production, Preview |
| `RESEND_API_KEY` | API key from resend.com | Production, Preview |
| `CONTACT_TO_EMAIL` | `didesle7@gmail.com` | Production, Preview |
| `CONTACT_FROM_EMAIL` | `onboarding@resend.dev` (or your verified domain) | Production, Preview |

> The `VITE_` prefix exposes a value to the client bundle — only use it for keys that are safe to be public. Turnstile **site keys** are public by design; the **secret key** must stay server-side (no `VITE_` prefix).

### 4. set up cloudflare turnstile (free, ~2 min)

1. https://dash.cloudflare.com → Turnstile → Add Site
2. Hostname: your Vercel domain (e.g. `dishant-desle.vercel.app`) and your custom domain if you add one
3. Widget mode: **Managed** (recommended)
4. Copy site key → `VITE_TURNSTILE_SITE_KEY`
5. Copy secret key → `TURNSTILE_SECRET_KEY`

### 5. set up resend (free, ~2 min)

1. https://resend.com → sign up
2. API Keys → Create API Key (full access) → copy → `RESEND_API_KEY`
3. For testing: leave `CONTACT_FROM_EMAIL=onboarding@resend.dev` (Resend's shared sandbox sender, only sends to your verified address — works fine for a personal portfolio)
4. For production: add your own domain at resend.com/domains, verify SPF/DKIM, then set `CONTACT_FROM_EMAIL=hello@yourdomain.com`

### 6. deploy

Click **Deploy** in Vercel. Every `git push` to `main` redeploys; every PR gets a preview URL.

## security model for the contact form

| layer | what it stops |
| --- | --- |
| **honeypot field** (`name="website"`, `tabindex="-1"`, `display:none`) | naive form-spamming bots that fill every input |
| **Cloudflare Turnstile** | sophisticated bots; verified server-side via `siteverify` API |
| **server-side validation** | malformed payloads, oversized fields, invalid emails |
| **IP rate limit** (3 requests / 60s, in-memory) | burst spam from a single source |
| **Resend send** | authenticated SMTP; from-address always under your control |
| **vercel.json security headers** | X-Frame-Options, HSTS, Referrer-Policy, Permissions-Policy |

The Resend API key never touches the client bundle. The only secret in the browser is the Turnstile **site** key, which is intended to be public.

## file structure

```
portfolio/
├── api/
│   └── contact.ts            # Vercel serverless: Turnstile verify + Resend send
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/               # GlitchText, TerminalText, SectionHeader, BrandIcons
│   │   ├── MatrixRain.tsx    # canvas matrix-rain background
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Competitions.tsx
│   │   ├── Certifications.tsx
│   │   ├── Education.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/content.ts       # all resume content lives here — edit this to update the site
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── tailwind.config.js
├── vercel.json
└── vite.config.ts
```

## updating content

All copy lives in [`src/data/content.ts`](src/data/content.ts) — edit there, push to GitHub, Vercel redeploys.

## custom domain

After the first deploy, Vercel → Project → Settings → Domains → Add. Vercel walks you through DNS records. Don't forget to add the new hostname to your Cloudflare Turnstile widget config.
