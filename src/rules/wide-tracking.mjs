// wide-tracking — body text (< 20px) with letterSpacing > 0.05em.
//
// Wide tracking belongs on eyebrows; on body it signals AI caption styling.
// Eyebrows ARE the exception, so they need to be excluded:
//   - all-caps content (textTransform === 'uppercase' OR the content literally
//     has no lowercase letters) is an eyebrow by convention
//   - mono fontFamily is used almost exclusively for eyebrows/metadata in
//     modern UI design

const MAX_FONT_SIZE = 20;
const MAX_RATIO = 0.05;
const MONO_RE = /mono|courier|consolas|menlo|source code|fira code|jetbrains|ibm plex mono|space mono/i;

export default {
  id: 'wide-tracking',
  severity: 'P3',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const size = Number(n.fontSize);
      if (!Number.isFinite(size) || size >= MAX_FONT_SIZE) continue;
      const ls = Number(n.letterSpacing);
      if (!Number.isFinite(ls) || ls <= 0) continue;
      const ratio = ls / size;
      if (ratio <= MAX_RATIO) continue;

      // Eyebrow exclusions.
      const content = typeof n.content === 'string' ? n.content : '';
      if (n.textTransform === 'uppercase') continue;
      if (isAllCaps(content)) continue;
      const ff = typeof n.fontFamily === 'string' ? n.fontFamily : '';
      if (MONO_RE.test(ff)) continue;

      out.push({
        nodeId: n.id,
        message: `letterSpacing ${ls}px on ${size}px text (${(ratio * 100).toFixed(1)}% of font size) — too wide for body.`,
        fix: `Reset letterSpacing to 0 on body. Wide tracking is for eyebrows only.`,
      });
    }
    return out;
  },
};

function isAllCaps(s) {
  if (!/[A-Za-z]/.test(s)) return false;
  return s === s.toUpperCase();
}
