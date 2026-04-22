// hardcoded-color — literal hex in fill/stroke where a variable defines
// the same color. Encourage token use over raw values.
//
// Strict match: exact normalized-hex equality. Close-but-not-equal matches
// are ignored — tolerating "near" matches causes false positives where a
// designer intentionally picked an adjacent shade for hover state, etc.

import { parseHex, sameHex } from '../color.mjs';

export default {
  id: 'hardcoded-color',
  severity: 'P2',
  category: 'pencil',
  check({ nodes, variables }) {
    if (!variables || typeof variables !== 'object') return [];
    const tokenHexes = [];
    for (const [name, v] of Object.entries(variables)) {
      const hex = typeof v === 'string' ? parseHex(v) : null;
      if (hex) tokenHexes.push({ name, hex: normalize(v) });
    }
    if (tokenHexes.length === 0) return [];
    const out = [];
    for (const n of nodes) {
      for (const f of ['fill', 'stroke', 'color', 'backgroundColor', 'borderColor']) {
        const v = n[f];
        if (typeof v !== 'string') continue;
        const hit = tokenHexes.find((t) => sameHex(v, t.hex));
        if (!hit) continue;
        out.push({
          nodeId: n.id,
          message: `${f} uses literal ${v} where token "$${hit.name}" covers the same color.`,
          fix: `Replace with "$${hit.name}".`,
          meta: { field: f, replacement: `$${hit.name}` },
        });
      }
    }
    return out;
  },
};

function normalize(hex) {
  const p = parseHex(hex);
  if (!p) return hex;
  return `#${[p.r, p.g, p.b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
}
