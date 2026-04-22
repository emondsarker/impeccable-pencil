// dark-glow — dark surface + colored drop shadow. The "luxe-looking
// techno-gradient card" trope.

import { resolveFill, relativeLuminance, rgbToHsl } from '../color.mjs';

const DARK = 0.2;
const GLOW_LUMINANCE = 0.4;
const GLOW_SATURATION = 0.3;

export default {
  id: 'dark-glow',
  severity: 'P2',
  category: 'slop',
  check({ nodes, variables }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const bg = resolveFill(n.fill, variables);
      if (!bg) continue;
      if (relativeLuminance(bg) > DARK) continue;
      const shadowColors = extractShadowColors(n.shadow, variables);
      // A glow is either bright OR saturated. Pure black/gray shadows are
      // normal drop shadows, not glows. Flag if ANY shadow layer is a glow.
      const isGlow = shadowColors.some((c) => {
        return relativeLuminance(c) >= GLOW_LUMINANCE || rgbToHsl(c).s >= GLOW_SATURATION;
      });
      if (!isGlow) continue;
      out.push({
        nodeId: n.id,
        message: `Dark surface with a colored drop shadow — AI "glow" tell.`,
        fix: `Remove the glow. If depth is needed, use a slightly lighter surface color.`,
      });
    }
    return out;
  },
};

function extractShadowColors(shadow, variables) {
  if (!shadow) return [];
  const list = Array.isArray(shadow) ? shadow : [shadow];
  const out = [];
  for (const s of list) {
    if (!s) continue;
    if (typeof s === 'string') {
      const c = resolveFill(s, variables);
      if (c) out.push(c);
    } else if (typeof s === 'object' && s.color) {
      const c = resolveFill(s.color, variables);
      if (c) out.push(c);
    }
  }
  return out;
}
