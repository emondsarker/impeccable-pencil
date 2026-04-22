// gradient-text — text fill is a gradient. 99% of the time decorative noise.

export default {
  id: 'gradient-text',
  severity: 'P1',
  category: 'slop',
  check({ nodes, variables }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      if (!isGradient(n.fill, variables)) continue;
      out.push({
        nodeId: n.id,
        message: `Text fill is a gradient — decorative noise on type.`,
        fix: `Use a solid token fill. If the type needs emphasis, use weight/size/color, not a gradient.`,
      });
    }
    return out;
  },
};

function isGradient(fill, variables) {
  if (fill == null) return false;
  if (typeof fill === 'object') {
    if (fill.type === 'linearGradient' || fill.type === 'radialGradient') return true;
    if (Array.isArray(fill.stops)) return true;
    if (fill.gradient) return true;
  }
  if (typeof fill === 'string') {
    if (/^linear-gradient|^radial-gradient/i.test(fill)) return true;
    if (fill.startsWith('$')) {
      const resolved = variables?.[fill.slice(1)] ?? variables?.[fill];
      if (resolved && isGradient(resolved, variables)) return true;
    }
  }
  return false;
}
