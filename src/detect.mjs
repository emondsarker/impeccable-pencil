// impeccable-pencil — detector entry point.
//
// Unlike impeccable, we can't parse .pen files directly — they're encrypted.
// The detector is fed a pre-resolved node tree (from Pencil MCP `batch_get`)
// plus the variable table (from `get_variables`).
//
// detect({ nodes, variables }) -> Finding[]

import { rules } from './rules/index.mjs';

export function detect({ nodes, variables = {}, config = {} }) {
  const findings = [];
  const ctx = {
    nodes,
    variables,
    config,
    nodeById: Object.fromEntries(nodes.map(n => [n.id, n])),
    parentOf: buildParentMap(nodes),
  };
  for (const rule of rules) {
    if (config.disable?.includes(rule.id)) continue;
    try {
      const results = rule.check(ctx) ?? [];
      for (const r of results) {
        findings.push({
          ruleId: rule.id,
          severity: r.severity ?? rule.severity,
          ...r,
        });
      }
    } catch (err) {
      findings.push({
        ruleId: rule.id,
        severity: 'P3',
        nodeId: null,
        message: `Rule threw: ${err.message}`,
        meta: { error: true },
      });
    }
  }
  return findings;
}

function buildParentMap(nodes) {
  const m = {};
  for (const n of nodes) {
    for (const childId of n.children ?? []) m[childId] = n.id;
  }
  return m;
}
