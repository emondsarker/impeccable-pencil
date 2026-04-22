// wide-tracking — body text (< 20px) with letterSpacing > 0.05em.
//
// Wide tracking belongs on eyebrows; on body it signals AI caption styling.

const MAX_FONT_SIZE = 20;
const MAX_RATIO = 0.05;

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
      out.push({
        nodeId: n.id,
        message: `letterSpacing ${ls}px on ${size}px text (${(ratio * 100).toFixed(1)}% of font size) — too wide for body.`,
        fix: `Reset letterSpacing to 0 on body. Wide tracking is for eyebrows only.`,
      });
    }
    return out;
  },
};
