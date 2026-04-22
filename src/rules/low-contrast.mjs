// low-contrast — WCAG ratio < 4.5 between text fill and the resolved
// ancestor background. Escalates to P0 when ratio < 3.0.
//
// Ancestor background = walk up until a filled, non-transparent ancestor is
// found. Gradients and unresolvable tokens cause us to skip the node — we
// can't statically compute contrast against them without knowing which stop
// sits behind the text.

import { resolveFill, contrastRatio } from '../color.mjs';

const AA_BODY = 4.5;
const CRIT = 3.0;

export default {
  id: 'low-contrast',
  severity: 'P1',
  category: 'quality',
  check({ nodes, nodeById, parentOf, variables }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const fg = resolveFill(n.fill, variables);
      if (!fg) continue;
      const bg = findBackground(n, nodeById, parentOf, variables);
      if (!bg) continue;
      const ratio = contrastRatio(fg, bg);
      if (ratio >= AA_BODY) continue;
      out.push({
        nodeId: n.id,
        severity: ratio < CRIT ? 'P0' : 'P1',
        message: `Contrast ratio ${ratio.toFixed(2)}:1 — below WCAG AA (4.5).`,
        fix: `Darken the text or lighten the background. If the bg is a brand color, introduce a dedicated text-on-brand token.`,
        meta: { ratio: Number(ratio.toFixed(2)) },
      });
    }
    return out;
  },
};

function findBackground(textNode, nodeById, parentOf, variables) {
  let cursor = parentOf[textNode.id];
  while (cursor) {
    const p = nodeById[cursor];
    if (!p) break;
    const bg = resolveFill(p.fill, variables);
    if (bg) return bg;
    cursor = parentOf[cursor];
  }
  return null;
}
