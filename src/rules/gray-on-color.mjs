// gray-on-color — gray text (saturation < 0.1) sitting on a saturated
// parent (saturation > 0.4). Reads as washed-out on brand surfaces.

import { resolveFill, rgbToHsl } from '../color.mjs';

const GRAY_SAT_MAX = 0.1;
const COLOR_SAT_MIN = 0.4;

export default {
  id: 'gray-on-color',
  severity: 'P1',
  category: 'quality',
  check({ nodes, nodeById, parentOf, variables }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const fg = resolveFill(n.fill, variables);
      if (!fg) continue;
      const fgHsl = rgbToHsl(fg);
      if (fgHsl.s > GRAY_SAT_MAX) continue;
      // Walk up to nearest filled ancestor.
      let cursor = parentOf[n.id];
      let bg = null;
      while (cursor) {
        const p = nodeById[cursor];
        if (!p) break;
        bg = resolveFill(p.fill, variables);
        if (bg) break;
        cursor = parentOf[cursor];
      }
      if (!bg) continue;
      const bgHsl = rgbToHsl(bg);
      if (bgHsl.s < COLOR_SAT_MIN) continue;
      out.push({
        nodeId: n.id,
        message: `Gray text (sat ${fgHsl.s.toFixed(2)}) on saturated parent (sat ${bgHsl.s.toFixed(2)}).`,
        fix: `Tint the text toward the background hue or use a high-contrast solid on-brand token.`,
      });
    }
    return out;
  },
};
