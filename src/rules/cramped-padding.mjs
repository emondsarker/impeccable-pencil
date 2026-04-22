// cramped-padding — text touches the edge of its container.

const MIN_PADDING = 12;

export default {
  id: 'cramped-padding',
  severity: 'P2',
  category: 'quality',
  check({ nodes, nodeById }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame') continue;
      const children = Array.isArray(n.children) ? n.children : [];
      const hasTextChild = children.some((id) => nodeById[id]?.type === 'text');
      if (!hasTextChild) continue;
      const sides = resolvePadding(n);
      if (!sides) continue;
      const tight = Object.entries(sides).filter(([, v]) => v < MIN_PADDING);
      if (tight.length === 0) continue;
      const desc = tight.map(([k, v]) => `${k}=${v}`).join(', ');
      out.push({
        nodeId: n.id,
        message: `Text-holding frame with padding ${desc} — below the ${MIN_PADDING}px floor.`,
        fix: `Use ≥ 12 around body text, ≥ 16 inside cards.`,
      });
    }
    return out;
  },
};

function resolvePadding(n) {
  const p = n.padding;
  if (p == null) return null;
  if (typeof p === 'number') {
    return { top: p, right: p, bottom: p, left: p };
  }
  if (Array.isArray(p)) {
    // [top, right, bottom, left] — CSS shorthand order.
    const [t = 0, r = 0, b = 0, l = 0] = p;
    return { top: t, right: r, bottom: b, left: l };
  }
  if (typeof p === 'object') {
    return {
      top: Number(p.top ?? p.vertical ?? 0),
      right: Number(p.right ?? p.horizontal ?? 0),
      bottom: Number(p.bottom ?? p.vertical ?? 0),
      left: Number(p.left ?? p.horizontal ?? 0),
    };
  }
  return null;
}
