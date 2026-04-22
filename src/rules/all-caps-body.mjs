// all-caps-body — long text set in all-caps reads as shouting.
//
// Short eyebrows in caps are fine; this fires only when content is long enough
// to be body copy.

const MIN_CONTENT_LEN = 40;

export default {
  id: 'all-caps-body',
  severity: 'P2',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const content = typeof n.content === 'string' ? n.content : '';
      if (content.length <= MIN_CONTENT_LEN) continue;
      const isCaps = n.textTransform === 'uppercase' || isAllCaps(content);
      if (!isCaps) continue;
      out.push({
        nodeId: n.id,
        message: `${content.length}-char text set in all-caps — reads as shouting.`,
        fix: `Sentence case. Reserve all-caps for eyebrows under 3 words.`,
      });
    }
    return out;
  },
};

function isAllCaps(s) {
  if (!/[A-Za-z]/.test(s)) return false;
  return s === s.toUpperCase();
}
