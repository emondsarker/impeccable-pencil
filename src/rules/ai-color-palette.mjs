// ai-color-palette — the #2 AI tell after side-tabs: fills concentrated in
// the purple/violet band (hue 260-290, sat > 0.4), OR a dark frame with
// saturated cyan child (hue 170-210, sat > 0.6). These two combos come out
// of training data more than anywhere else.

import { resolveFill, rgbToHsl, relativeLuminance } from '../color.mjs';

const PURPLE_HUE = [260, 290];
const PURPLE_SAT_MIN = 0.4;
const PURPLE_FRAC = 0.3;

const CYAN_HUE = [170, 210];
const CYAN_SAT_MIN = 0.6;
const DARK_LUMINANCE = 0.2;

export default {
  id: 'ai-color-palette',
  severity: 'P1',
  category: 'slop',
  check({ nodes, nodeById, parentOf, variables }) {
    const findings = [];
    // Check 1: purple/violet concentration.
    const filled = [];
    let purpleCount = 0;
    for (const n of nodes) {
      if (n.type !== 'frame' && n.type !== 'rectangle') continue;
      const rgb = resolveFill(n.fill, variables);
      if (!rgb) continue;
      filled.push(rgb);
      const hsl = rgbToHsl(rgb);
      if (hsl.h >= PURPLE_HUE[0] && hsl.h <= PURPLE_HUE[1] && hsl.s > PURPLE_SAT_MIN) {
        purpleCount++;
      }
    }
    if (filled.length > 0 && purpleCount / filled.length > PURPLE_FRAC) {
      findings.push({
        nodeId: null,
        message: `${purpleCount} of ${filled.length} filled surfaces in the purple/violet band — AI-palette tell.`,
        fix: `Tokenize a bespoke palette from the brand. Purple is the most-common training-data default.`,
      });
    }
    // Check 2: cyan-on-dark child pairings.
    for (const n of nodes) {
      const bg = resolveFill(n.fill, variables);
      if (!bg) continue;
      if (relativeLuminance(bg) > DARK_LUMINANCE) continue;
      for (const id of n.children ?? []) {
        const c = nodeById[id];
        if (!c) continue;
        const fg = resolveFill(c.fill, variables);
        if (!fg) continue;
        const h = rgbToHsl(fg);
        if (h.h >= CYAN_HUE[0] && h.h <= CYAN_HUE[1] && h.s > CYAN_SAT_MIN) {
          findings.push({
            nodeId: c.id,
            message: `Saturated cyan on a dark parent — the other canonical AI combo.`,
            fix: `Soften the cyan or pick a brand accent. Cyan-on-dark is a training-data default.`,
          });
        }
      }
    }
    return findings;
  },
};
