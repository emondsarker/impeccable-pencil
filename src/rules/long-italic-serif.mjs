// long-italic-serif — sentence-length text in italic serif reads as
// display calligraphy, not body copy. Reserve italic serif for short display.

const SERIF_RE = /serif|instrument serif|fraunces|playfair|lora|eb garamond|merriweather/i;
const MIN_WORDS = 6;

export default {
  id: 'long-italic-serif',
  severity: 'P2',
  category: 'pencil',
  check({ nodes }) {
    const out = [];
    for (const n of nodes) {
      if (n.type !== 'text') continue;
      if (n.fontStyle !== 'italic') continue;
      const ff = typeof n.fontFamily === 'string' ? n.fontFamily : '';
      if (!SERIF_RE.test(ff)) continue;
      const content = typeof n.content === 'string' ? n.content : '';
      const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < MIN_WORDS) continue;
      out.push({
        nodeId: n.id,
        message: `${wordCount}-word italic ${ff} — sentence-length italic serif reads as display, not body.`,
        fix: `Switch fontFamily to the body face (e.g. DM Sans). Reserve italic serif for short display text.`,
      });
    }
    return out;
  },
};
