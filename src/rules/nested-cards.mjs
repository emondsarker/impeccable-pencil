// nested-cards — filled frame inside filled frame inside filled frame.
//
// Only counts "card-like" filled containers. A pill (cornerRadius >= 100), a
// decorative dot/badge (either explicit dimension < threshold), or a 1px
// separator rectangle is NOT a card — stacking those inside cards is how
// dashboards get built, not a tell.

const MIN_CARD_WIDTH = 120;
const MIN_CARD_HEIGHT = 80;
const PILL_RADIUS = 100;

export default {
  id: 'nested-cards',
  severity: 'P1',
  category: 'slop',
  check({ nodes, nodeById, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (!isCardLike(n)) continue;
      // Walk ancestors, count card-like filled containers.
      let depth = 1;
      let parent = parentOf[n.id];
      const chain = [n.id];
      while (parent) {
        const p = nodeById[parent];
        if (!p) break;
        if (isCardLike(p)) {
          depth++;
          chain.push(p.id);
        }
        parent = parentOf[parent];
      }
      if (depth >= 3) {
        out.push({
          nodeId: n.id,
          message: `Card-like filled frame nested ${depth} deep. Card-in-card-in-card is the canonical AI layout tell.`,
          fix: `Flatten one level. Use typography + spacing for hierarchy instead of another background.`,
          meta: { chain },
        });
      }
    }
    return dedupeDeepest(out);
  },
};

function isFilled(n) {
  if (n.type !== 'frame' && n.type !== 'rectangle') return false;
  const fill = n.fill;
  if (!fill || fill === 'transparent' || fill === 'none') return false;
  return true;
}

function isCardLike(n) {
  if (!isFilled(n)) return false;

  // Small explicit dimension → decoration, pill, dot, divider — not a card.
  const w = typeof n.width === 'number' ? n.width : null;
  const h = typeof n.height === 'number' ? n.height : null;
  if (w != null && w < MIN_CARD_WIDTH) return false;
  if (h != null && h < MIN_CARD_HEIGHT) return false;

  // Pill-shaped (cornerRadius ~= full) → badge/status, not a card.
  const cr = n.cornerRadius;
  if (typeof cr === 'number' && cr >= PILL_RADIUS) return false;
  if (Array.isArray(cr) && cr.every((r) => typeof r === 'number' && r >= PILL_RADIUS)) return false;

  return true;
}

// Only report the deepest node in each nested chain.
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
