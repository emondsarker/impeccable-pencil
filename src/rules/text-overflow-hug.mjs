// text-overflow-hug — Pencil-specific: sentence-length text in a bounded
// parent defaults to `textGrowth: "hug-text"` and overflows horizontally.
//
// Eyebrows, metadata lines, and short labels (even when they contain 5+
// tokens because of "·" separators) are excluded — they fit on one line and
// aren't what this rule is trying to catch.

const MIN_WORDS = 5;
const MIN_CHARS = 40;
const MIN_FONT_SIZE = 14;

export default {
  id: 'text-overflow-hug',
  severity: 'P1',
  category: 'pencil',
  check({ nodes, nodeById, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const content = typeof n.content === 'string' ? n.content : '';
      if (content.length < MIN_CHARS) continue;
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < MIN_WORDS) continue;

      // Skip eyebrow / label styling — those don't wrap even when 40+ chars.
      if (Number(n.letterSpacing) > 0) continue;
      if (typeof n.fontSize === 'number' && n.fontSize < MIN_FONT_SIZE) continue;
      if (isAllCaps(content)) continue;

      const growth = n.textGrowth ?? 'hug-text';
      if (growth === 'fixed-width' || growth === 'fixed-width-height') continue;

      const parent = nodeById[parentOf[n.id]];
      if (!parent) continue;
      if (!hasBoundedWidth(parent)) continue;

      out.push({
        nodeId: n.id,
        message: `${wordCount}-word text (${content.length} chars) in a bounded parent without textGrowth: "fixed-width" — will overflow.`,
        fix: `Set \`width: "fill_container"\` AND \`textGrowth: "fixed-width"\` on the text node.`,
      });
    }
    return out;
  },
};

function hasBoundedWidth(node) {
  const w = node.width;
  if (typeof w === 'number' && w > 0) return true;
  if (w === 'fill_container') return true;
  return false;
}

function isAllCaps(s) {
  // Heuristic: string has letters AND every letter is uppercase.
  if (!/[A-Za-z]/.test(s)) return false;
  return s === s.toUpperCase();
}
