// orphan-token — variable defined in the .pen file but never referenced.
// Detects by scanning every node's fill/stroke/fontFamily/color-like fields
// for "$name" references; any variable name not seen is orphaned.
//
// This rule only produces accurate output on whole-file scans. When auditing
// a single screen or subtree, tokens used by other screens appear "orphaned"
// even though they're referenced elsewhere. Callers signal partial scans via
// `config.partialScan = true`, which makes this rule a no-op.

const REF_FIELDS = [
  'fill', 'stroke', 'fontFamily', 'color',
  'backgroundColor', 'borderColor', 'shadowColor',
];

export default {
  id: 'orphan-token',
  severity: 'P3',
  category: 'pencil',
  check({ nodes, variables, config }) {
    if (config?.partialScan) return [];
    if (!variables || typeof variables !== 'object') return [];
    // Variables may be stored with or without a leading `$`. Normalize to
    // the name-only form before comparing.
    const keys = Object.keys(variables).map((k) => k.startsWith('$') ? k.slice(1) : k);
    if (keys.length === 0) return [];
    const used = new Set();
    const visit = (v) => {
      if (v == null) return;
      if (typeof v === 'string') {
        if (v.startsWith('$')) used.add(v.slice(1));
        return;
      }
      if (typeof v === 'object') {
        if (Array.isArray(v)) v.forEach(visit);
        else Object.values(v).forEach(visit);
      }
    };
    for (const n of nodes) {
      for (const f of REF_FIELDS) {
        if (f in n) visit(n[f]);
      }
      // Stroke objects may nest a color inside { top: { color: "$..." } }.
      if (n.stroke && typeof n.stroke === 'object') visit(n.stroke);
    }
    const out = [];
    for (const key of keys) {
      if (!used.has(key)) {
        out.push({
          nodeId: null,
          message: `Variable "$${key}" defined but never referenced.`,
          fix: `Delete the variable OR mark it as a design-system export only.`,
          meta: { variable: key },
        });
      }
    }
    return out;
  },
};
