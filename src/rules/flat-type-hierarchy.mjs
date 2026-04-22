// flat-type-hierarchy — fontSize values cluster too tightly. Adjacent unique
// sizes with a ratio < 1.125 (~minor second) indicate no clear hierarchy.

const MIN_RATIO = 1.125;
const MIN_SIZES = 3;

export default {
  id: 'flat-type-hierarchy',
  severity: 'P2',
  category: 'slop',
  check({ nodes }) {
    const sizes = new Set();
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const s = Number(n.fontSize);
      if (Number.isFinite(s) && s > 0) sizes.add(s);
    }
    if (sizes.size < MIN_SIZES) return [];
    const sorted = [...sizes].sort((a, b) => a - b);
    const tightPairs = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      const a = sorted[i], b = sorted[i + 1];
      if (b / a < MIN_RATIO) tightPairs.push([a, b]);
    }
    if (tightPairs.length === 0) return [];
    const desc = tightPairs.map(([a, b]) => `${a}→${b} (${(b / a).toFixed(2)}x)`).join(', ');
    return [{
      nodeId: null,
      message: `${tightPairs.length} adjacent font-size pair(s) with ratio < 1.125 — no clear hierarchy: ${desc}.`,
      fix: `Rebuild the type scale on a 1.25 or 1.333 ratio. Drop redundant steps.`,
    }];
  },
};
