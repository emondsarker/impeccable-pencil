// icon-tile-stack — the canonical AI feature-card composition: small
// rounded-square frame with a single icon child, followed immediately by a
// heading text node.
//
// Detects: frame with 1:1 aspect within ±10%, cornerRadius 8..24, one
// icon-like child (type === "icon" or "svg" or similar), whose NEXT sibling
// in the parent is a text node with fontSize >= 18.

const MIN_RADIUS = 8;
const MAX_RADIUS = 24;
const ASPECT_TOLERANCE = 0.1;
const MIN_HEADING_SIZE = 18;
const ICON_TYPES = new Set(['icon', 'svg', 'vector', 'image']);

export default {
  id: 'icon-tile-stack',
  severity: 'P2',
  category: 'slop',
  check({ nodes, nodeById, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      if (!isSquareish(n)) continue;
      if (!hasTileRadius(n.cornerRadius)) continue;
      const children = (n.children ?? []).map((id) => nodeById[id]).filter(Boolean);
      if (children.length !== 1) continue;
      if (!ICON_TYPES.has(children[0].type)) continue;
      const parentId = parentOf[n.id];
      const parent = parentId ? nodeById[parentId] : null;
      if (!parent || !Array.isArray(parent.children)) continue;
      const idx = parent.children.indexOf(n.id);
      const next = idx >= 0 ? nodeById[parent.children[idx + 1]] : null;
      if (!next || next.type !== 'text') continue;
      const size = Number(next.fontSize);
      if (!Number.isFinite(size) || size < MIN_HEADING_SIZE) continue;
      out.push({
        nodeId: n.id,
        message: `Icon-tile + heading stack — the canonical AI feature-card composition.`,
        fix: `Inline the icon with the heading or drop the tile. Icon-first layouts rarely need a chrome wrapper.`,
        meta: { headingId: next.id },
      });
    }
    return out;
  },
};

function isSquareish(n) {
  const w = Number(n.width);
  const h = Number(n.height);
  if (!Number.isFinite(w) || !Number.isFinite(h)) return false;
  if (w === 0 || h === 0) return false;
  const ratio = w / h;
  return ratio >= 1 - ASPECT_TOLERANCE && ratio <= 1 + ASPECT_TOLERANCE;
}

function hasTileRadius(cr) {
  if (typeof cr === 'number') return cr >= MIN_RADIUS && cr <= MAX_RADIUS;
  if (Array.isArray(cr)) {
    return cr.every((v) => typeof v === 'number' && v >= MIN_RADIUS && v <= MAX_RADIUS);
  }
  return false;
}
