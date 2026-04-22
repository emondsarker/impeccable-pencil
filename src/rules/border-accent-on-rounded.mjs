// border-accent-on-rounded — one-sided stroke + rounded corner. Visually
// clashes because the stroke ends where the radius begins.
//
// This is a strict superset of side-tab: if side-tab fires AND corner radius
// ≥ 8, this also fires. We emit it separately so the fix hint can mention the
// radius clash.

const MIN_RADIUS = 8;

export default {
  id: 'border-accent-on-rounded',
  severity: 'P1',
  category: 'slop',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const s = n.stroke;
      if (!s || typeof s !== 'object') continue;
      const sides = [
        thicknessOf(s.top ?? s.thickness?.top),
        thicknessOf(s.right ?? s.thickness?.right),
        thicknessOf(s.bottom ?? s.thickness?.bottom),
        thicknessOf(s.left ?? s.thickness?.left),
      ];
      const thick = sides.filter((v) => v > 1);
      const thin = sides.filter((v) => v <= 0);
      if (thick.length !== 1 || thin.length !== 3) continue;
      if (!hasRadius(n.cornerRadius, MIN_RADIUS)) continue;
      out.push({
        nodeId: n.id,
        message: `One-sided stroke on a rounded ${n.type} — stroke can't trace the radius.`,
        fix: `Remove the one-sided stroke OR drop the cornerRadius. Category markers belong in shape vocabulary, not strokes.`,
      });
    }
    return out;
  },
};

function thicknessOf(v) {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && 'width' in v) return Number(v.width) || 0;
  return 0;
}

function hasRadius(cr, min) {
  if (typeof cr === 'number') return cr >= min;
  if (Array.isArray(cr)) return cr.some((r) => typeof r === 'number' && r >= min);
  return false;
}
