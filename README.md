# dishant.desle - portfolio

Personal portfolio site for Dishant Desle (cybersecurity analyst, M.S. Cyber Security @ University of Denver, grad Aug 2026).

Cyberpunk/terminal aesthetic. Animated matrix rain, glitch typography, 3D-tilt project cards, scroll-triggered reveals, a live TryHackMe status badge, and a secure contact form.

Live: https://dishant-desle-portfolio.vercel.app (Vercel project `di-desle`).

## stack

- **Vite 8 + React 19 + TypeScript 6**
- **Tailwind CSS 3** (custom cyber theme in `tailwind.config.js`)
- **Framer Motion** (scroll/tilt/reveal animations; honors `prefers-reduced-motion` via `MotionConfig reducedMotion="user"`)
- **react-router-dom 7** (`/` home, `/admin` easter-egg console, `*` 404)
- **Self-hosted variable fonts** (Inter + JetBrains Mono, one woff2 per family in `public/fonts/`, no Google Fonts round trip)
- **Lucide** + custom inline brand SVGs (icons)
- **@vercel/analytics** (loads same-origin from `/_vercel/insights/`, no third-party host)
- **Vercel Serverless Function** (`api/contact.ts`) sends mail via **Resend**
- **Cloudflare Turnstile** invisible CAPTCHA + honeypot field + in-memory IP rate limit (3/min)

All resume copy lives in a single source of truth: [`src/data/content.ts`](src/data/content.ts).

## local dev

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # dash-lint + tsc -b + production build to dist/
npm run preview      # preview the dist/ build locally
npm run lint         # eslint
npm run lint:dashes  # fail on em/en dashes in src, index.html, public/og.svg
npm test             # vitest (watch); npm run test:run for a single pass
```

## the TryHackMe live badge

`src/components/BadgesStrip.tsx` embeds the official TryHackMe badge in a sandboxed `<iframe>`. The badge endpoint sits behind a Vercel bot challenge that blocks all server-side fetches (including CI/datacenter IPs), so a real visitor's browser is the only thing that passes it. A prior scraper + custom stat card was removed for that reason; do not reintroduce server-side scraping. The frame is sandboxed (`allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`), has a watchdog that falls back to a plain profile link if it does not load, and refreshes only after the tab has been hidden more than five minutes. `vercel.json` CSP `frame-src` must keep `https://tryhackme.com`.

## security model

The contact form:

| layer | what it stops |
| --- | --- |
| **honeypot field** (`name="website"`, `tabindex="-1"`, `display:none`) | naive bots that fill every input |
| **Cloudflare Turnstile** | sophisticated bots; verified server-side via `siteverify`, fails closed in production if the secret is unset |
| **server-side validation** | malformed payloads, oversized fields, invalid emails, control-byte/header injection |
| **IP rate limit** (3 requests / 60s, in-memory, capped map) | burst spam from a single source |
| **5s fetch timeout** (`AbortSignal.timeout`) | hung upstream calls to Turnstile/Resend |
| **Resend send** | authenticated API; from-address always under your control |

The site:

| header (in `vercel.json`) | effect |
| --- | --- |
| **Content-Security-Policy** | `default-src 'self'`; no `script-src 'unsafe-inline'`; scripts limited to self + Cloudflare challenges; `object-src 'none'`; `base-uri 'self'`; `frame-ancestors 'none'` |
| **Strict-Transport-Security** | 2y, `includeSubDomains; preload` |
| **X-Frame-Options / frame-ancestors** | deny framing of the site |
| **Cross-Origin-Opener-Policy / -Resource-Policy** | `same-origin` isolation |
| **Permissions-Policy** | every optional feature denied, including `browsing-topics=()` |
| **X-Content-Type-Options** | `nosniff` |
| **X-Robots-Tag** on `/admin` | `noindex, nofollow` |

`style-src` intentionally keeps `'unsafe-inline'`: React renders `style={{}}` as inline style attributes, so removing it breaks the UI. The Resend API key and Turnstile secret never reach the client bundle; the only public value is the Turnstile **site** key (public by design).

## deployment

The repo is already connected to Vercel (project `di-desle`). Every push to `main` deploys to production; every PR gets a preview URL. Vite is auto-detected; `npm run build` outputs to `dist/`.

Production environment variables (Vercel -> Project -> Settings -> Environment Variables):

| key | value | scope |
| --- | --- | --- |
| `VITE_TURNSTILE_SITE_KEY` | site key from Cloudflare Turnstile (public) | Production, Preview, Development |
| `TURNSTILE_SECRET_KEY` | secret key from Cloudflare Turnstile (server only) | Production, Preview |
| `RESEND_API_KEY` | API key from resend.com | Production, Preview |
| `CONTACT_TO_EMAIL` | `didesle7@gmail.com` | Production, Preview |
| `CONTACT_FROM_EMAIL` | verified sender (or `onboarding@resend.dev` for testing) | Production, Preview |

The `VITE_` prefix exposes a value to the client bundle, so it is only used for the public site key.

### Cloudflare Turnstile

Dashboard -> Turnstile -> Add Site. Add every hostname that serves the form (`dishant-desle-portfolio.vercel.app`, plus any custom domain). Widget mode: Managed. Site key -> `VITE_TURNSTILE_SITE_KEY`, secret key -> `TURNSTILE_SECRET_KEY`.

### Resend

API Keys -> create -> `RESEND_API_KEY`. For testing, `onboarding@resend.dev` only sends to your verified address. For production, add a domain at resend.com/domains, verify SPF/DKIM/DMARC, then set `CONTACT_FROM_EMAIL` to an address on that domain.

## continuous integration

- **`.github/workflows/ci.yml`** runs on every push and PR: install, dash-lint, `tsc -b`, `vite build`, eslint, the Vitest suite, and a production-only `npm audit --omit=dev` advisory gate.
- **Tests** (Vitest + Testing Library, jsdom): unit tests for the contact handler's security logic (validation, sanitizers, rate limit, Turnstile fail-closed, the request-flow gates) and component tests for the 404 page and the command palette's dialog/combobox semantics. Config in `vitest.config.ts`.
- **`.github/dependabot.yml`** opens grouped weekly PRs for npm and GitHub Actions updates.
- Local commits run `.githooks/pre-commit`, which blocks em/en dashes in `src/**`, `index.html`, and `public/og.svg`. `npm run prepare` wires the hooks path.

## file structure

```
portfolio/
├── api/
│   └── contact.ts              # Vercel serverless: Turnstile verify + Resend send
├── public/
│   ├── fonts/                  # self-hosted Inter + JetBrains Mono variable woff2
│   ├── favicon.svg
│   ├── og.svg / og.png         # social card source + rasterized 1200x630
│   ├── resume.pdf
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── check-dashes.sh         # dash-lint, run in prebuild and the pre-commit hook
├── src/
│   ├── components/
│   │   ├── ui/                 # GlitchText, CountUp, Magnetic, SectionHeader, BrandIcons, InteractiveTerminal
│   │   ├── MatrixRain.tsx      # canvas matrix-rain background (portaled to body)
│   │   ├── CRTOverlay.tsx      # scanline/CRT overlay
│   │   ├── BootLoader.tsx      # terminal boot animation
│   │   ├── CommandPalette.tsx  # cmd/ctrl-k navigation
│   │   ├── KonamiListener.tsx  # easter-egg key sequence
│   │   ├── ScrollProgress.tsx
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Competitions.tsx
│   │   ├── Certifications.tsx
│   │   ├── Education.tsx
│   │   ├── BadgesStrip.tsx     # live TryHackMe badge (sandboxed iframe)
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── routes/
│   │   ├── HomePage.tsx
│   │   ├── AdminPage.tsx        # /admin easter-egg console
│   │   └── NotFoundPage.tsx     # 404
│   ├── hooks/
│   │   └── useTilt.ts
│   ├── data/content.ts         # all resume content lives here
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css               # @font-face, Tailwind layers, keyframes
├── .github/
│   ├── workflows/ci.yml
│   └── dependabot.yml
├── .githooks/pre-commit
├── .env.example
├── tailwind.config.js
├── vercel.json                 # headers, CSP, rewrites, cache
└── vite.config.ts
```

## updating content

All copy lives in [`src/data/content.ts`](src/data/content.ts). Edit there, push to `main`, Vercel redeploys. Keep ASCII hyphens (no em/en dashes) in anything under `src/` or the dash-lint gate fails the build.

## custom domain

Vercel -> Project -> Settings -> Domains -> Add, then follow the DNS steps. Add the new hostname to the Cloudflare Turnstile widget config too, or the contact form will reject submissions from it.
