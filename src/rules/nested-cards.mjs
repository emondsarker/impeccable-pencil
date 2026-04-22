// nested-cards — filled frame inside filled frame inside filled frame.

export default {
  id: 'nested-cards',
  severity: 'P1',
  category: 'slop',
  check({ nodes, nodeById, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (!isFilledContainer(n)) continue;
      // Walk ancestors, count filled containers.
      let depth = 1;
      let parent = parentOf[n.id];
      const chain = [n.id];
      while (parent) {
        const p = nodeById[parent];
        if (!p) break;
        if (isFilledContainer(p)) {
          depth++;
          chain.push(p.id);
        }
        parent = parentOf[parent];
      }
      if (depth >= 3) {
        out.push({
          nodeId: n.id,
          message: `Filled frame nested ${depth} deep. Card-in-card-in-card is the canonical AI layout tell.`,
          fix: `Flatten one level. Use typography + spacing for hierarchy instead of another background.`,
          meta: { chain },
        });
      }
    }
    return dedupeDeepest(out);
  },
};

function isFilledContainer(n) {
  if (n.type !== 'frame' && n.type !== 'rectangle') return false;
  const fill = n.fill;
  if (!fill || fill === 'transparent' || fill === 'none') return false;
  return true;
}

// Only report the deepest node in each nested chain — parents get the
// same diagnosis by definition.
function dedupeDeepest(findings) {
  const byChain = new Map();
  for (const f of findings) {
    const key = (f.meta?.chain || [f.nodeId]).slice().sort().join('|');
    const prev = byChain.get(key);
    if (!prev || (f.meta?.chain?.length ?? 0) > (prev.meta?.chain?.length ?? 0)) {
      byChain.set(key, f);
    }
  }
  return [...byChain.values()];
}
