// tiny-text — fontSize < 12 on text whose content is long enough to read as
// body, not a single-word label.

const MIN_FONT_SIZE = 12;
const MIN_CONTENT_LEN = 20;

export default {
  id: 'tiny-text',
  severity: 'P1',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const size = Number(n.fontSize);
      if (!Number.isFinite(size) || size >= MIN_FONT_SIZE) continue;
      const content = typeof n.content === 'string' ? n.content : '';
      if (content.length <= MIN_CONTENT_LEN) continue;
      out.push({
        nodeId: n.id,
        message: `${size}px text on a ${content.length}-char string — too small to read comfortably.`,
        fix: `Bump to 12+ for labels, 14+ for body text.`,
      });
    }
    return out;
  },
};
