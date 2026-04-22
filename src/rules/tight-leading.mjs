// tight-leading — lineHeight < 1.3 on body text.
//
// Pencil stores lineHeight either as a multiplier (1.4) or in px. We treat
// anything < 3 as a multiplier; >= 3 is assumed to be px and normalized by
// fontSize when available.

const MIN_MULTIPLIER = 1.3;
// Display-sized text (hero, numbers) can legitimately ride tighter — 1.1–1.25.
// Rule targets body; skip anything >= this threshold.
const DISPLAY_THRESHOLD = 28;

export default {
  id: 'tight-leading',
  severity: 'P2',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const lh = n.lineHeight;
      if (lh == null) continue;
      const size = Number(n.fontSize);
      if (Number.isFinite(size) && size >= DISPLAY_THRESHOLD) continue;

      let multiplier;
      if (typeof lh === 'number') {
        multiplier = lh < 3 ? lh : (Number.isFinite(size) ? lh / size : null);
      }
      if (!Number.isFinite(multiplier)) continue;
      if (multiplier >= MIN_MULTIPLIER) continue;

      out.push({
        nodeId: n.id,
        message: `lineHeight multiplier ${multiplier.toFixed(2)} — below the 1.3 floor for body text.`,
        fix: `Set lineHeight to 1.4–1.6 for body copy.`,
      });
    }
    return out;
  },
};
