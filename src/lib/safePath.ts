// Sanitize a pathname before rendering it (used by the 404 page). React escapes
// text nodes, so HTML/script injection is impossible; this strips control
// characters and bidi-override characters (Trojan Source-style) and caps the
// length, preventing visual-confusion and very-long-path layout abuse from
// crafted URLs like `/foo<bidi-override>bar`. The ranges stay as \u escapes so
// this file remains plain text (not "binary") on GitHub - never paste the raw
// control bytes here.
export function safePath(
  raw = typeof window !== 'undefined' ? window.location.pathname : '/',
): string {
  // eslint-disable-next-line no-control-regex -- stripping control bytes is the point
  return raw.replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/gu, '').slice(0, 80);
}
