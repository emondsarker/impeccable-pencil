// skipped-heading — inside a section, fontSize bands skip a level.
// Bands: H1 >= 48, H2 32-47, H3 24-31, H4 18-23. A section is a frame whose
// descendants contain 2+ text nodes at different bands. If the first band
// present is H1 and the next is H3+ (skipping H2), flag.

const BAND_THRESHOLDS = [
  { band: 1, min: 48 },
  { band: 2, min: 32 },
  { band: 3, min: 24 },
  { band: 4, min: 18 },
];

function bandOf(size) {
  if (!Number.isFinite(size)) return null;
  for (const t of BAND_THRESHOLDS) {
    if (size >= t.min) return t.band;
  }
  return null;
}

export default {
  id: 'skipped-heading',
  severity: 'P3',
  category: 'quality',
  check({ nodes, nodeById }) {
    const out = [];
    for (const frame of nodes) {
      if (frame.type !== 'frame') continue;
      const descendants = collectDescendants(frame, nodeById);
      const bands = [];
      for (const d of descendants) {
        if (d.type !== 'text') continue;
        const b = bandOf(Number(d.fontSize));
        if (b != null) bands.push({ band: b, id: d.id });
      }
      if (bands.length < 2) continue;
      const uniqueBands = [...new Set(bands.map((x) => x.band))].sort((a, b) => a - b);
      // Skip detection: any gap > 1 between adjacent unique bands starting at
      // the minimum band actually seen.
      for (let i = 0; i < uniqueBands.length - 1; i++) {
        if (uniqueBands[i + 1] - uniqueBands[i] > 1) {
          out.push({
            nodeId: frame.id,
            message: `Heading band H${uniqueBands[i]} → H${uniqueBands[i + 1]} skips level(s) inside this frame.`,
            fix: `Introduce the missing heading level or flatten to the bands you actually use.`,
          });
          break;
        }
      }
    }
    return out;
  },
};

function collectDescendants(root, nodeById) {
  const out = [];
  const stack = [...(root.children ?? [])];
  while (stack.length) {
    const id = stack.pop();
    const n = nodeById[id];
    if (!n) continue;
    out.push(n);
    if (Array.isArray(n.children)) stack.push(...n.children);
  }
  return out;
}
