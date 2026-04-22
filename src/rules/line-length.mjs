// line-length — a single text line wider than ~80 characters.
// Approximates ch-width as fontSize * 0.5. Only applies to text with a
// concrete numeric width; fill_container is unknown at static-analysis time.

const MAX_CH = 80;
const CH_FACTOR = 0.5;
const MIN_WORDS = 12; // too few words and it's a headline, not body — skip

export default {
  id: 'line-length',
  severity: 'P2',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const w = typeof n.width === 'number' ? n.width : null;
      const size = Number(n.fontSize);
      if (w == null || !Number.isFinite(size) || size <= 0) continue;
      const content = typeof n.content === 'string' ? n.content : '';
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < MIN_WORDS) continue;
      const ch = w / (size * CH_FACTOR);
      if (ch <= MAX_CH) continue;
      out.push({
        nodeId: n.id,
        message: `${Math.round(ch)}ch-wide line (${w}px @ ${size}px) — hard to track past 80ch.`,
        fix: `Cap paragraph width at 45–75ch equivalent. Drop width or wrap sooner.`,
      });
    }
    return out;
  },
};
