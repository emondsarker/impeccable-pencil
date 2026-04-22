// pure-black-white — `#000000` or `#FFFFFF` on a background surface.
//
// Background = root frame (no parent) or a full-bleed child (width =
// fill_container or numeric >= 600).

const BLACK = new Set(['#000', '#000000', '#000000ff', '#00000000']);
const WHITE = new Set(['#fff', '#ffffff', '#ffffffff']);
const FULL_BLEED_MIN = 600;

export default {
  id: 'pure-black-white',
  severity: 'P2',
  category: 'quality',
  check({ nodes, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const fill = typeof n.fill === 'string' ? n.fill.toLowerCase() : null;
      if (!fill) continue;
      const isBlack = BLACK.has(fill);
      const isWhite = WHITE.has(fill);
      if (!isBlack && !isWhite) continue;
      if (!isBackground(n, parentOf)) continue;
      out.push({
        nodeId: n.id,
        message: `Background fill ${n.fill} — pure black/white reads harsh.`,
        fix: `Use a slightly-off value (e.g. #0A0A0F, #FAFAF7) or a token.`,
      });
    }
    return out;
  },
};

function isBackground(n, parentOf) {
  if (!parentOf[n.id]) return true;
  if (n.width === 'fill_container') return true;
  if (typeof n.width === 'number' && n.width >= FULL_BLEED_MIN) return true;
  return false;
}
