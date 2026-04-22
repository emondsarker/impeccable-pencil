// monotonous-spacing — one gap/padding value dominates > 80% of frames.
// Signals a layout where every component uses the same breathing room,
// flattening rhythm.

const DOMINANT_FRACTION = 0.8;
const MIN_SAMPLE = 10;

export default {
  id: 'monotonous-spacing',
  severity: 'P2',
  category: 'slop',
  check({ nodes }) {
    const values = [];
    for (const n of nodes) {
      if (n.type !== 'frame') continue;
      const g = Number(n.gap);
      if (Number.isFinite(g) && g > 0) values.push(g);
      const padding = flattenPadding(n.padding);
      for (const v of padding) {
        if (Number.isFinite(v) && v > 0) values.push(v);
      }
    }
    if (values.length < MIN_SAMPLE) return [];
    const freq = new Map();
    for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
    let mode = null, modeCount = 0;
    for (const [v, c] of freq) {
      if (c > modeCount) { mode = v; modeCount = c; }
    }
    const frac = modeCount / values.length;
    if (frac < DOMINANT_FRACTION) return [];
    return [{
      nodeId: null,
      message: `${mode}px dominates ${Math.round(frac * 100)}% of ${values.length} gap/padding values — layout has no rhythm.`,
      fix: `Introduce a scale (e.g. 4, 8, 12, 24, 48). Use different values for intra-component vs inter-component spacing.`,
    }];
  },
};

function flattenPadding(p) {
  if (p == null) return [];
  if (typeof p === 'number') return [p];
  if (Array.isArray(p)) return p.filter((v) => typeof v === 'number');
  if (typeof p === 'object') {
    return ['top', 'right', 'bottom', 'left', 'vertical', 'horizontal']
      .map((k) => p[k])
      .filter((v) => typeof v === 'number');
  }
  return [];
}
