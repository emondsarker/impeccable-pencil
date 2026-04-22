// single-font — every text node uses the same fontFamily. Introduce a
// second face (display or mono) for hierarchy.

const MIN_TEXT_NODES = 5;

export default {
  id: 'single-font',
  severity: 'P2',
  category: 'slop',
  check({ nodes }) {
    const families = new Set();
    let count = 0;
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const ff = typeof n.fontFamily === 'string' ? n.fontFamily.trim() : '';
      if (!ff) continue;
      families.add(ff.toLowerCase());
      count++;
    }
    if (count < MIN_TEXT_NODES) return [];
    if (families.size !== 1) return [];
    const only = [...families][0];
    return [{
      nodeId: null,
      message: `All ${count} text nodes use "${only}" — one family across the whole design reads flat.`,
      fix: `Introduce a second face: display for titles or mono for metadata.`,
    }];
  },
};
