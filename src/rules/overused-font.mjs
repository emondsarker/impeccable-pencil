// overused-font — fontFamily is one of the over-deployed defaults.

const OVERUSED = new Set([
  'inter',
  'roboto',
  'helvetica',
  'helvetica neue',
  'open sans',
  'lato',
  'montserrat',
  'arial',
  'sf pro',
  'sf pro text',
  'sf pro display',
  'system-ui',
  '-apple-system',
]);

export default {
  id: 'overused-font',
  severity: 'P1',
  category: 'slop',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      const ff = (n.fontFamily || '').trim().toLowerCase();
      if (!ff) continue;
      if (OVERUSED.has(ff)) {
        out.push({
          nodeId: n.id,
          message: `fontFamily "${n.fontFamily}" is one of the most over-used typefaces online.`,
          fix: `Pick a typeface that reflects the brand. Pair a distinctive display face with a refined body face.`,
        });
      }
    }
    return out;
  },
};
