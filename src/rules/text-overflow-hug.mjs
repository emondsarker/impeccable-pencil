// text-overflow-hug — Pencil-specific: sentence-length text in a bounded
// parent defaults to `textGrowth: "hug-text"` and overflows horizontally.

export default {
  id: 'text-overflow-hug',
  severity: 'P1',
  category: 'pencil',
  check({ nodes, nodeById, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const content = n.content || '';
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 5) continue;
      const growth = n.textGrowth ?? 'hug-text';
      if (growth === 'fixed-width') continue;
      const parent = nodeById[parentOf[n.id]];
      if (!parent) continue;
      if (!hasBoundedWidth(parent)) continue;
      out.push({
        nodeId: n.id,
        message: `${wordCount}-word text in a bounded parent without textGrowth: "fixed-width" — will overflow.`,
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
