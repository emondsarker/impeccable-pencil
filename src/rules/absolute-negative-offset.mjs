// absolute-negative-offset — Pencil-specific: `layoutPosition: "absolute"`
// with negative x or y is silently clipped by Pencil's renderer.

export default {
  id: 'absolute-negative-offset',
  severity: 'P0',
  category: 'pencil',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.layoutPosition !== 'absolute') continue;
      const x = Number(n.x);
      const y = Number(n.y);
      if (Number.isFinite(x) && x < 0 || Number.isFinite(y) && y < 0) {
        out.push({
          nodeId: n.id,
          message: `Absolute-positioned node at (x=${n.x}, y=${n.y}) — Pencil clips negative coordinates.`,
          fix: `Use positive x/y inside the parent's bounds. If the element needs to visually overflow, resize the parent or reposition the child.`,
        });
      }
    }
    return out;
  },
};
