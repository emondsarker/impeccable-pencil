// side-tab — one-sided thick stroke on a frame. The #1 AI UI tell.
//
// Detects: node is frame|rectangle with `stroke` whose per-side thickness has
// exactly one side > 1 and the rest at 0/absent.

export default {
  id: 'side-tab',
  severity: 'P1',
  category: 'slop',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const s = n.stroke;
      if (!s || typeof s !== 'object') continue;
      const sides = {
        top: thicknessOf(s.top ?? s.thickness?.top),
        right: thicknessOf(s.right ?? s.thickness?.right),
        bottom: thicknessOf(s.bottom ?? s.thickness?.bottom),
        left: thicknessOf(s.left ?? s.thickness?.left),
      };
      const thick = Object.entries(sides).filter(([, v]) => v > 1);
      const thin = Object.entries(sides).filter(([, v]) => v <= 0);
      if (thick.length === 1 && thin.length === 3) {
        const [side, w] = thick[0];
        out.push({
          nodeId: n.id,
          message: `${side} stroke of ${w}px on a ${n.type} reads as an AI accent stripe.`,
          fix: `Remove the one-sided stroke. If the card needs category signal, use the alert shape vocabulary (asymmetric cornerRadius + oversized italic serif glyph) instead.`,
        });
      }
    }
    return out;
  },
};

function thicknessOf(v) {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && 'width' in v) return Number(v.width) || 0;
  return 0;
}
