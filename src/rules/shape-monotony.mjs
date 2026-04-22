// shape-monotony — every card-type node uses the same symmetric
// cornerRadius. No shape vocabulary to signal semantic role (alert vs
// insight vs tip vs message).

const DOMINANT_FRACTION = 0.9;
const MIN_CARDS = 4;

export default {
  id: 'shape-monotony',
  severity: 'P2',
  category: 'pencil',
  check({ nodes }) {
    const cardRadii = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      if (!n.fill) continue;
      const w = typeof n.width === 'number' ? n.width : null;
      const h = typeof n.height === 'number' ? n.height : null;
      if (w != null && w < 120) continue;
      if (h != null && h < 80) continue;
      const cr = n.cornerRadius;
      if (!isSymmetric(cr)) continue;
      const val = typeof cr === 'number' ? cr : cr[0];
      if (val >= 100) continue; // pill, not card
      cardRadii.push(val);
    }
    if (cardRadii.length < MIN_CARDS) return [];
    const freq = new Map();
    for (const v of cardRadii) freq.set(v, (freq.get(v) ?? 0) + 1);
    let mode = null, modeCount = 0;
    for (const [v, c] of freq) {
      if (c > modeCount) { mode = v; modeCount = c; }
    }
    const frac = modeCount / cardRadii.length;
    if (frac < DOMINANT_FRACTION) return [];
    return [{
      nodeId: null,
      message: `${modeCount} of ${cardRadii.length} card-like frames share cornerRadius ${mode} — no shape vocabulary.`,
      fix: `Adopt asymmetric corner radii per semantic role (alert / insight / tip / message). E.g. alerts: [6, 20, 20, 20].`,
    }];
  },
};

function isSymmetric(cr) {
  if (typeof cr === 'number') return true;
  if (Array.isArray(cr)) {
    return cr.every((v) => typeof v === 'number' && v === cr[0]);
  }
  return false;
}
