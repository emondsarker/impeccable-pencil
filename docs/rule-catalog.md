# Rule catalog

31 rules, grouped by category. Each rule has an id, severity default, description, detection logic (in terms of `.pen` node properties accessible via the Pencil MCP), and a fix hint.

**Implementation status**: all 31 rules have executable detectors in `src/rules/`. `coral-on-noninteractive` is a no-op unless the detector config names interactive-reserved tokens.

Severity can escalate or de-escalate based on context (e.g. `low-contrast` is P0 when it causes unreadable text, P2 when it's a subtle shift).

---

## AI Slop (12)

### `side-tab`
**Severity**: P1 · **Ported from impeccable**
A thick stroke on only one side of a frame — the #1 tell of AI-generated UIs.

**Detection**: node is a `frame` or `rectangle`, has `stroke` with one side thickness > 1 and the other three sides = 0 (or absent).

**Fix**: Remove the one-sided stroke. If you need to differentiate the card, use the shape vocabulary: asymmetric `cornerRadius` (e.g. `[6, 20, 20, 20]` for alerts) and/or an oversized italic serif glyph.

---

### `border-accent-on-rounded`
**Severity**: P1 · **Ported**
One-sided stroke combined with a rounded corner — the stroke visually clashes with the radius.

**Detection**: `side-tab` fires AND `cornerRadius >= 8` (number or any element of an array ≥ 8).

**Fix**: Same as `side-tab`.

---

### `overused-font`
**Severity**: P1 · **Ported**
fontFamily is one of the over-deployed defaults. Inherits impeccable's list.

**Detection**: text node `fontFamily` (normalized lower-case) ∈ { inter, roboto, helvetica, helvetica neue, open sans, lato, montserrat, arial, sf pro, sf pro text, sf pro display, system-ui, -apple-system }.

**Fix**: Suggest project-appropriate alternatives. Don't hardcode — ask the user or read from project context.

---

### `single-font`
**Severity**: P2 · **Ported**
Only one fontFamily across all text nodes in the scan scope.

**Detection**: `distinctCount(fontFamily across all text nodes) === 1` AND text-node count ≥ 5.

**Fix**: Introduce a display face for hero/titles OR a mono face for eyebrows/metadata.

---

### `flat-type-hierarchy`
**Severity**: P2 · **Ported**
fontSize values cluster too tightly — no clear hierarchy.

**Detection**: collect all `fontSize` values across text nodes; sort ascending; for any two adjacent unique values `a < b`, if `b / a < 1.125`, flag.

**Fix**: Rebuild the scale on a 1.25 or 1.333 ratio.

---

### `gradient-text`
**Severity**: P1 · **Ported**
Text fill is a gradient.

**Detection**: text node `fill` is a gradient object (`linearGradient`, `radialGradient`) or references a gradient token.

**Fix**: Solid fill. Gradients on text are decorative noise 99% of the time.

---

### `ai-color-palette`
**Severity**: P1 · **Ported**
Fills concentrated in purple/violet (hue 260–290, sat > 40%) or cyan-on-dark combos.

**Detection**: count of fills whose HSL hue is in [260, 290] and saturation > 0.4, divided by total filled nodes, > 0.3; OR a dark frame (luminance < 0.2) containing direct child with saturated cyan fill (hue 170–210, sat > 0.6).

**Fix**: Tokenize a bespoke palette — see impeccable's `/colorize` spirit. Pull hues from brand, not from training data.

---

### `nested-cards`
**Severity**: P1 · **Ported**
Frame with fill inside frame with fill inside frame with fill — three-deep. Only card-like containers count; pills, badges, dots, and dividers are excluded.

**Detection**: chain of 3+ `frame`/`rectangle` ancestors where each is **card-like** (non-transparent fill AND numeric width ≥ 120 AND numeric height ≥ 80 when given, AND not pill-shaped (`cornerRadius < 100`)).

**Known FP**: pill-shaped status badges and decorative dots inside cards trigger the raw depth check but are filtered by the size + pill exclusion above.

**Fix**: Flatten one level. Use spacing/typography for hierarchy instead of another background.

---

### `monotonous-spacing`
**Severity**: P2 · **Ported**
One gap or padding value dominates.

**Detection**: collect all non-zero `gap` + `padding` values across frames; if the mode covers > 80% of values AND total count > 10, flag.

**Fix**: Introduce a scale (4, 8, 12, 24, 48) and use different values for intra-component vs inter-component.

---

### `everything-centered`
**Severity**: P2 · **Ported**
Most text is center-aligned.

**Detection**: for text nodes with an explicit `textAlign`, flag if `textAlign === "center"` fraction > 0.75 and count > 5.

**Fix**: Left-align body. Center is for hero moments.

---

### `dark-glow`
**Severity**: P2 · **Ported**
Dark background + colored drop-shadow glow.

**Detection**: frame/rectangle with fill luminance < 0.2 AND a `shadow` property whose color has luminance > 0.4.

**Fix**: Remove the glow. If depth is needed, use a slightly lighter surface color.

---

### `icon-tile-stack`
**Severity**: P2 · **Ported**
Small rounded-square frame (icon tile) stacked above a heading text — the universal AI feature-card pattern.

**Detection**: frame with 1:1 aspect within ±10%, `cornerRadius` between 8 and 24, containing a single icon-like child, followed immediately by a text node with `fontSize >= 18`.

**Fix**: Inline the icon with the heading or drop the tile entirely. Lean icon-first doesn't require a chrome wrapper.

---

## Quality (11)

### `pure-black-white`
**Severity**: P2 · **Ported**
Fill is exactly `#000000` or `#FFFFFF` on a background frame.

**Detection**: background frame fill equals `#000000` (case-insensitive) or `#FFFFFF`. "Background frame" = top-level or full-bleed child.

**Fix**: Shift toward slightly-off. `#0A0A0F` or `#FAFAF7` read less harsh.

---

### `gray-on-color`
**Severity**: P1 · **Ported**
Gray text on a saturated background.

**Detection**: text node whose resolved fill has saturation < 0.1, where the nearest filled ancestor has saturation > 0.4.

**Fix**: Tint the text toward the background hue or use a high-contrast solid.

---

### `low-contrast`
**Severity**: P0–P1 · **Ported**
WCAG contrast ratio < 4.5 between text fill and resolved parent background.

**Detection**: resolve parent bg by walking up until a filled ancestor is found. Compute relative luminance of each. Flag if ratio < 4.5. P0 if ratio < 3.0.

**Fix**: Darken text or lighten bg. If the bg is a brand color, introduce a dedicated text-on-brand token.

---

### `line-length`
**Severity**: P2 · **Ported**
Text line wider than ~80 characters.

**Detection**: text node with a concrete `width` (fixed or resolved) where `width / (fontSize * 0.5) > 80`. The 0.5 factor approximates ch units.

**Fix**: Cap paragraph width at `45–75ch` equivalent.

---

### `cramped-padding`
**Severity**: P2 · **Ported**
Text touches the edge of its container.

**Detection**: frame containing a text child, with `padding` < 12 (top/right/bottom/left, any side).

**Fix**: Minimum 12 around body text, 16 for cards.

---

### `tight-leading`
**Severity**: P2 · **Ported**
`lineHeight < 1.3`.

**Detection**: text node with numeric `lineHeight < 1.3`.

**Fix**: 1.4–1.6 for body, 1.1–1.25 for display.

---

### `skipped-heading`
**Severity**: P3 · **Partial port**
Fontsize-inferred heading levels skip within a section.

**Detection**: group text nodes by containing frame; within each group, assign a pseudo-heading-level by fontSize bands (H1: ≥ 48, H2: 32–47, H3: 24–31, H4: 18–23). If the first text is H1 and the second is H3 (skipping H2), flag.

**Fix**: Introduce the missing level or flatten the hierarchy to match what's actually there.

---

### `justified-text`
**Severity**: P2 · **Ported**
`textAlign: "justify"`.

**Detection**: any text node with `textAlign === "justify"`.

**Fix**: Left-align. Justified without hyphenation creates ugly gaps.

---

### `tiny-text`
**Severity**: P1 · **Ported**
`fontSize < 12`.

**Detection**: any text node with `fontSize < 12` AND content length > 20 chars (single-word labels are OK small).

**Fix**: Bump to 12+ for labels, 14+ for body.

---

### `all-caps-body`
**Severity**: P2 · **Ported**
Long text set in all-caps.

**Detection**: text node with content length > 40 AND (`textTransform === "uppercase"` OR content has no lowercase characters).

**Fix**: Sentence case. Reserve all-caps for eyebrows/labels under 3 words.

---

### `wide-tracking`
**Severity**: P3 · **Ported**
Body text with `letterSpacing > 0.05em`.

**Detection**: text node with `fontSize < 20` AND resolved `letterSpacing > 0.05em` (or its px equivalent).

**Fix**: Reset letter-spacing on body. Wide tracking is for eyebrows only.

---

## Pencil-native (8)

### `text-overflow-hug`
**Severity**: P1
Sentence-length text in a bounded parent without `textGrowth: "fixed-width"` — will overflow because Pencil defaults to hug-text.

**Detection**: text node whose content is ≥ 5 words AND ≥ 40 characters AND `fontSize ≥ 14` AND `letterSpacing === 0` (or unset) AND not all-caps AND whose parent has a bounded width (either fixed or `width: "fill_container"`) AND the text node itself is missing `textGrowth: "fixed-width"` (or `"fixed-width-height"`).

**Known FP**: eyebrows like `"MONDAY · APRIL 21 · 2026"` split into 5+ tokens but are short, tracked, all-caps, and don't wrap. The letterSpacing + uppercase + fontSize checks filter them.

**Fix**: Set `width: "fill_container"` AND `textGrowth: "fixed-width"` on the text node.

---

### `absolute-negative-offset`
**Severity**: P0
`layoutPosition: "absolute"` with negative x or y. Pencil clips these silently.

**Detection**: any node with `layoutPosition === "absolute"` AND (`x < 0` OR `y < 0`).

**Fix**: Use positive coordinates inside the parent's bounds. Resize the glyph if it's peeking outside.

---

### `hardcoded-color`
**Severity**: P2
Literal hex value in `fill`/`stroke` when a token covers that exact color.

**Detection**: fill/stroke is a string matching `/^#[0-9a-f]{3,8}$/i` AND the project has a variable whose resolved color is within ΔE ≤ 2 of this hex.

**Fix**: Replace with `$tokenName`.

---

### `orphan-token`
**Severity**: P3
Variable defined in the .pen file but never referenced.

**Detection**: variable name from `mcp__pencil__get_variables` not found in any node's `fill`/`stroke`/`fontFamily`/other-ref.

**Fix**: Delete the variable OR mark it as a design-system export only.

---

### `ghost-node`
**Severity**: P3
Empty frame — no children, no text.

**Detection**: frame or rectangle node with `children.length === 0` AND no content text properties.

**Fix**: Delete it. Usually a leftover from a refactor.

---

### `shape-monotony`
**Severity**: P2
Every card-type node has identical symmetric cornerRadius — no shape vocabulary differentiation between alert / insight / tip / message.

**Detection**: among frames with `role`-like names (or >= 3 sibling frames with fills), > 90% share the same symmetric cornerRadius value AND count ≥ 4.

**Fix**: Adopt an asymmetric shape vocabulary per semantic role. (See the corresponding guideline in `docs/shape-vocabulary.md` — not yet written.)

---

### `long-italic-serif`
**Severity**: P2
Sentence-length text set in italic serif — reads as display calligraphy, not body copy.

**Detection**: text node with `fontStyle === "italic"` AND fontFamily is a known serif (matches `/serif|Instrument Serif|Fraunces|Playfair|Lora/i`) AND content word count ≥ 6.

**Fix**: Switch fontFamily to the body face (DM Sans / Inter / whatever the project uses for body) and keep the italic intent only on display-short text.

---

### `coral-on-noninteractive`
**Severity**: P2 · (Project-configurable)
Palette token reserved for interactive use is applied as fill on a non-interactive surface.

**Detection**: requires a project config naming the interactive-reserved token(s) (e.g. `$coral`, `$action`). Flag when that token is used as `fill` on a frame without interactive affordances (button, link, pressable).

**Fix**: Replace with a neutral or surface token.

---

## Severity ladder

Copied verbatim from impeccable — do not diverge.

- **P0 Blocking** — content broken, clipped, or failing WCAG A. Fix before anything ships.
- **P1 Major** — WCAG AA fail, obvious AI slop, confusing hierarchy. Fix before release.
- **P2 Minor** — quality polish, subtle tell. Fix in next pass.
- **P3 Polish** — taste-level, no real user impact. Fix if time permits.
