// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Resend is network I/O; mock it so the handler never sends real mail.
const { sendMock } = vi.hoisted(() => ({ sendMock: vi.fn() }))
vi.mock('resend', () => ({
  // Must be a regular function (not an arrow) so `new Resend(...)` works.
  Resend: vi.fn(function () {
    return { emails: { send: sendMock } }
  }),
}))

import handler, {
  isValidEmail,
  stripCrlf,
  escapeHtml,
  rateLimit,
  verifyTurnstile,
} from './contact'

// Unique IP per request so the module-level rate-limit map never bleeds
// between tests (except where a test deliberately reuses one).
let ipCounter = 0
const uniqueIp = () => `10.0.${Math.floor(ipCounter / 256)}.${ipCounter++ % 256}`

type ResOpts = Record<string, unknown>
function makeRes() {
  const res = {
    statusCode: 0 as number,
    body: undefined as unknown,
    ended: false,
    headers: {} as Record<string, string>,
    setHeader(k: string, v: string) {
      this.headers[k.toLowerCase()] = v
      return this
    },
    status(code: number) {
      this.statusCode = code
      return this
    },
    json(b: unknown) {
      this.body = b
      return this
    },
    send(b: unknown) {
      this.body = b
      return this
    },
    end() {
      this.ended = true
      return this
    },
  }
  return res
}
function makeReq(opts: ResOpts = {}) {
  return {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': uniqueIp() },
    socket: { remoteAddress: '127.0.0.1' },
    body: {},
    ...opts,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any
}

const validBody = () => ({ name: 'Ada', email: 'ada@example.com', message: 'hello there' })

beforeEach(() => {
  sendMock.mockReset()
  sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null })
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------- pure helpers
describe('isValidEmail', () => {
  it('accepts normal addresses', () => {
    expect(isValidEmail('ada@example.com')).toBe(true)
    expect(isValidEmail('a.b+tag@sub.domain.io')).toBe(true)
  })
  it('rejects malformed addresses', () => {
    for (const bad of ['', 'nope', 'a@b', 'a@b.c', 'a @b.com', 'a@ b.com', 'a@b .com', '@b.com', 'a@@b.com']) {
      expect(isValidEmail(bad), bad).toBe(false)
    }
  })
})

describe('stripCrlf', () => {
  it('removes CR, LF, and other control bytes (header-injection guard)', () => {
    expect(stripCrlf('Ada\r\nBcc: evil@x.com')).toBe('AdaBcc: evil@x.com')
    expect(stripCrlf('a\r\nb')).toBe('ab')
    expect(stripCrlf('a\u0000\u0007\u007fb')).toBe('ab')
  })
  it('leaves normal text intact and caps length at 256', () => {
    expect(stripCrlf('Ada Lovelace')).toBe('Ada Lovelace')
    expect(stripCrlf('x'.repeat(300))).toHaveLength(256)
  })
})

describe('escapeHtml', () => {
  it('escapes all HTML-significant characters', () => {
    expect(escapeHtml(`<script>alert("x")&'`)).toBe('&lt;script&gt;alert(&quot;x&quot;)&amp;&#39;')
  })
  it('does not double-escape plain text', () => {
    expect(escapeHtml('just words')).toBe('just words')
  })
})

describe('rateLimit', () => {
  it('allows 3 requests per IP then blocks the 4th', () => {
    const ip = uniqueIp()
    expect(rateLimit(ip)).toBe(true)
    expect(rateLimit(ip)).toBe(true)
    expect(rateLimit(ip)).toBe(true)
    expect(rateLimit(ip)).toBe(false)
  })
  it('tracks each IP independently', () => {
    const a = uniqueIp()
    const b = uniqueIp()
    expect(rateLimit(a)).toBe(true)
    expect(rateLimit(a)).toBe(true)
    expect(rateLimit(a)).toBe(true)
    expect(rateLimit(a)).toBe(false)
    expect(rateLimit(b)).toBe(true) // b unaffected by a
  })
})

// ------------------------------------------------------------------- Turnstile
describe('verifyTurnstile', () => {
  it('skips (returns true) when no secret and not on Vercel (local dev)', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    vi.stubEnv('VERCEL', '')
    expect(await verifyTurnstile('', '1.1.1.1')).toBe(true)
  })
  it('FAILS CLOSED when no secret but running on Vercel', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '')
    vi.stubEnv('VERCEL', '1')
    expect(await verifyTurnstile('tok', '1.1.1.1')).toBe(false)
  })
  it('rejects an empty token when a secret is configured', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    expect(await verifyTurnstile('', '1.1.1.1')).toBe(false)
  })
  it('accepts a verified token from an allowed hostname', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({ success: true, hostname: 'dishant-desle-portfolio.vercel.app' }),
    })))
    expect(await verifyTurnstile('tok', '1.1.1.1')).toBe(true)
  })
  it('rejects when Cloudflare reports failure', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({ success: false, 'error-codes': ['invalid-input-response'] }),
    })))
    expect(await verifyTurnstile('tok', '1.1.1.1')).toBe(false)
  })
  it('rejects a token minted on a disallowed hostname (replay guard)', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({ success: true, hostname: 'evil.example.com' }),
    })))
    expect(await verifyTurnstile('tok', '1.1.1.1')).toBe(false)
  })
  it('fails closed when the verify request throws', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new Error('network down')
    }))
    expect(await verifyTurnstile('tok', '1.1.1.1')).toBe(false)
  })
})

// --------------------------------------------------------------------- handler
// Make Turnstile pass via the local-dev skip so handler tests focus on the gates.
function stubDevTurnstile() {
  vi.stubEnv('TURNSTILE_SECRET_KEY', '')
  vi.stubEnv('VERCEL', '')
}
function stubMailEnv() {
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.stubEnv('CONTACT_TO_EMAIL', 'to@example.com')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'from@example.com')
}

describe('handler: method + content-type gates', () => {
  it('answers OPTIONS with 204 and an Allow header', async () => {
    const res = makeRes()
    await handler(makeReq({ method: 'OPTIONS' }), res)
    expect(res.statusCode).toBe(204)
    expect(res.headers['allow']).toContain('POST')
    expect(res.ended).toBe(true)
  })
  it('rejects non-POST with 405', async () => {
    const res = makeRes()
    await handler(makeReq({ method: 'GET' }), res)
    expect(res.statusCode).toBe(405)
  })
  it('rejects non-JSON bodies with 415', async () => {
    const res = makeRes()
    await handler(makeReq({ headers: { 'content-type': 'text/plain', 'x-forwarded-for': uniqueIp() } }), res)
    expect(res.statusCode).toBe(415)
  })
  it('sets no-store cache headers on every reply', async () => {
    const res = makeRes()
    await handler(makeReq({ method: 'GET' }), res)
    expect(res.headers['cache-control']).toContain('no-store')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })
})

describe('handler: rate limit', () => {
  it('blocks the 4th request from the same IP with 429', async () => {
    const ip = uniqueIp()
    const run = () => handler(makeReq({ headers: { 'content-type': 'application/json', 'x-forwarded-for': ip } }), makeRes())
    await run()
    await run()
    await run()
    const res = makeRes()
    await handler(makeReq({ headers: { 'content-type': 'application/json', 'x-forwarded-for': ip } }), res)
    expect(res.statusCode).toBe(429)
  })
})

describe('handler: body + validation gates', () => {
  it('rejects a non-object body with 400', async () => {
    const res = makeRes()
    await handler(makeReq({ body: [1, 2, 3] }), res)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'invalid body' })
  })
  it('silently 200s a tripped honeypot without sending mail', async () => {
    stubDevTurnstile()
    stubMailEnv()
    const res = makeRes()
    await handler(makeReq({ body: { ...validBody(), website: 'i-am-a-bot' } }), res)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(sendMock).not.toHaveBeenCalled()
  })
  it('rejects missing required fields with 400', async () => {
    const res = makeRes()
    await handler(makeReq({ body: { name: 'Ada', email: 'ada@example.com' } }), res)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'missing required fields' })
  })
  it('rejects an invalid email with 400', async () => {
    const res = makeRes()
    await handler(makeReq({ body: { ...validBody(), email: 'not-an-email' } }), res)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'invalid email' })
  })
})

describe('handler: turnstile + mail', () => {
  it('rejects a failed captcha with 400 before sending', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'sk')
    vi.stubGlobal('fetch', vi.fn(async () => ({ json: async () => ({ success: false }) })))
    stubMailEnv()
    const res = makeRes()
    await handler(makeReq({ body: { ...validBody(), turnstileToken: 'bad' } }), res)
    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ error: 'captcha verification failed' })
    expect(sendMock).not.toHaveBeenCalled()
  })
  it('returns 500 when mail env vars are missing', async () => {
    stubDevTurnstile()
    // no stubMailEnv()
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('CONTACT_TO_EMAIL', '')
    vi.stubEnv('CONTACT_FROM_EMAIL', '')
    const res = makeRes()
    await handler(makeReq({ body: validBody() }), res)
    expect(res.statusCode).toBe(500)
    expect(res.body).toEqual({ error: 'email service not configured' })
  })
  it('sends mail and returns 200 on the happy path, escaping + stripping input', async () => {
    stubDevTurnstile()
    stubMailEnv()
    const res = makeRes()
    await handler(
      makeReq({
        body: {
          name: 'Ada\r\nBcc: evil@x.com',
          email: 'ada@example.com',
          message: '<script>alert(1)</script>',
        },
      }),
      res,
    )
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(sendMock).toHaveBeenCalledTimes(1)
    const payload = sendMock.mock.calls[0][0]
    // subject is CRLF-stripped onto one line (no header injection)
    expect(payload.subject).not.toContain('\n')
    expect(payload.subject).toContain('AdaBcc: evil@x.com')
    // html body escapes the script tag
    expect(payload.html).toContain('&lt;script&gt;')
    expect(payload.html).not.toContain('<script>')
  })
  it('returns 502 when Resend reports an error', async () => {
    stubDevTurnstile()
    stubMailEnv()
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'bad' } })
    const res = makeRes()
    await handler(makeReq({ body: validBody() }), res)
    expect(res.statusCode).toBe(502)
  })
})
