// ghost-node — empty frame with no children, no content, usually a refactor
// leftover.
//
// We don't flag page-level canvases (top-level frames with no parent), since
// they legitimately start empty during construction.

export default {
  id: 'ghost-node',
  severity: 'P3',
  category: 'pencil',
  check({ nodes, parentOf }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const children = Array.isArray(n.children) ? n.children : [];
      if (children.length > 0) continue;
      if (typeof n.content === 'string' && n.content.length > 0) continue;
      // Skip root-level / unparented frames — those are scaffolding.
      if (!parentOf[n.id]) continue;
      out.push({
        nodeId: n.id,
        message: `Empty ${n.type} with no children and no content — likely a refactor leftover.`,
        fix: `Delete the node if it's unused; if it's a spacer, add a comment or role name.`,
      });
    }
    return out;
  },
};
