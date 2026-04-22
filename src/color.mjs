// Color utilities — hex parsing, HSL conversion, relative luminance, WCAG
// contrast ratio, and variable resolution. Kept deliberately small — no
// dependency on chroma-js / tinycolor so the package stays zero-install.

const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

export function parseHex(s) {
  if (typeof s !== 'string') return null;
  if (!HEX_RE.test(s)) return null;
  let hex = s.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return { r, g, b };
}

export function rgbToHsl({ r, g, b }) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break;
      case gn: h = ((bn - rn) / d + 2); break;
      case bn: h = ((rn - gn) / d + 4); break;
    }
    h *= 60;
  }
  return { h, s, l };
}

// WCAG relative luminance (0 = black, 1 = white).
export function relativeLuminance({ r, g, b }) {
  const channel = (v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

// WCAG contrast ratio. Returns a number >= 1.
export function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const light = Math.max(la, lb);
  const dark = Math.min(la, lb);
  return (light + 0.05) / (dark + 0.05);
}

// Resolve a fill value to a concrete RGB triple. Handles:
//   - hex strings        "#0A0A0F"
//   - variable refs      "$surface"       → looks up variables
//   - fill objects       { color: "#..." }, { hex: "#..." }
// Returns null for gradients, unresolvable tokens, or anything else.
export function resolveFill(fill, variables = {}) {
  if (fill == null) return null;
  if (typeof fill === 'string') {
    if (fill.startsWith('$')) {
      const key = fill.slice(1);
      const v = variables[key] ?? variables[fill];
      if (v == null) return null;
      if (typeof v === 'string') return parseHex(v);
      if (typeof v === 'object') return resolveFill(v, variables);
      return null;
    }
    return parseHex(fill);
  }
  if (typeof fill === 'object') {
    if (fill.type === 'linearGradient' || fill.type === 'radialGradient') return null;
    if (typeof fill.color === 'string') return resolveFill(fill.color, variables);
    if (typeof fill.hex === 'string') return parseHex(fill.hex);
  }
  return null;
}

// Hex-equality with normalization — "#FFF" and "#ffffff" match.
export function sameHex(a, b) {
  const pa = parseHex(a);
  const pb = parseHex(b);
  if (!pa || !pb) return false;
  return pa.r === pb.r && pa.g === pb.g && pa.b === pb.b;
}
