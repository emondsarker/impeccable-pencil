// coral-on-noninteractive — project-configurable. Flags use of a
// reserved-for-interactive token as fill on surfaces that aren't
// interactive. Requires a config list; without it, the rule is a no-op.
//
// Config:
//   { interactiveTokens: ["coral", "action"] }
//
// Interactivity heuristics (any one counts):
//   - `interactive: true` on the node
//   - `onPress` / `onClick` / `href` / `action` property exists
//   - name matches /button|link|cta|action|press|tap|clickable/i

const INTERACTIVE_NAME_RE = /button|link|cta|action|press|tap|clickable/i;

export default {
  id: 'coral-on-noninteractive',
  severity: 'P2',
  category: 'pencil',
  check({ nodes, config }) {
    const reserved = new Set((config?.interactiveTokens ?? []).map(stripDollar));
    if (reserved.size === 0) return [];
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const fill = typeof n.fill === 'string' ? n.fill : null;
      if (!fill || !fill.startsWith('$')) continue;
      const tokenName = fill.slice(1);
      if (!reserved.has(tokenName)) continue;
      if (isInteractive(n)) continue;
      out.push({
        nodeId: n.id,
        message: `$${tokenName} is reserved for interactive use; this ${n.type} is not interactive.`,
        fix: `Use a neutral or surface token, OR mark the node interactive if it should be pressable.`,
        meta: { token: tokenName },
      });
    }
    return out;
  },
};

function stripDollar(s) {
  return typeof s === 'string' && s.startsWith('$') ? s.slice(1) : s;
}

function isInteractive(n) {
  if (n.interactive === true) return true;
  if ('onPress' in n || 'onClick' in n || 'href' in n || 'action' in n) return true;
  if (typeof n.name === 'string' && INTERACTIVE_NAME_RE.test(n.name)) return true;
  return false;
}
