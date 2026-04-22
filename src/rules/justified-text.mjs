// justified-text — `textAlign: "justify"` creates ugly gaps without
// hyphenation.

export default {
  id: 'justified-text',
  severity: 'P2',
  category: 'quality',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      if (n.textAlign !== 'justify') continue;
      out.push({
        nodeId: n.id,
        message: `textAlign "justify" — produces ugly gaps without hyphenation.`,
        fix: `Use "left" for body text.`,
      });
    }
    return out;
  },
};
