// everything-centered — most text nodes are center-aligned. Center is for
// hero moments; body should be left-aligned.
//
// Fires once per scan, not once per node. The returned finding's nodeId is
// null because the issue is systemic.

const MIN_FRACTION = 0.75;
const MIN_SAMPLE = 5;

export default {
  id: 'everything-centered',
  severity: 'P2',
  category: 'slop',
  check({ nodes }) {
    const aligned = nodes.filter((n) => n.type === 'text' && typeof n.textAlign === 'string');
    if (aligned.length < MIN_SAMPLE) return [];
    const centered = aligned.filter((n) => n.textAlign === 'center');
    const frac = centered.length / aligned.length;
    if (frac < MIN_FRACTION) return [];
    return [{
      nodeId: null,
      message: `${centered.length} of ${aligned.length} aligned text nodes use "center" (${Math.round(frac * 100)}%) — body should be left-aligned.`,
      fix: `Reserve center alignment for hero moments. Left-align body copy.`,
      meta: { centeredIds: centered.map((n) => n.id) },
    }];
  },
};
