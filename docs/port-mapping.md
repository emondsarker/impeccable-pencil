# Port mapping: impeccable → impeccable-pencil

One-to-one mapping from [pbakaus/impeccable](https://github.com/pbakaus/impeccable)'s 25 rules to `impeccable-pencil`'s equivalents.

| # | impeccable rule | impeccable-pencil rule | Status | Note |
|---|---|---|---|---|
| 1 | side-tab | side-tab | ✅ ported | one-sided `stroke` on frame |
| 2 | border-accent-on-rounded | border-accent-on-rounded | ✅ ported | `side-tab` + `cornerRadius ≥ 8` |
| 3 | overused-font | overused-font | ✅ ported | fontFamily in overused list |
| 4 | single-font | single-font | ✅ ported | distinct fontFamily count = 1 |
| 5 | flat-type-hierarchy | flat-type-hierarchy | ✅ ported | adjacent fontSize ratio < 1.125 |
| 6 | gradient-text | gradient-text | ✅ ported | text `fill` is a gradient object |
| 7 | ai-color-palette | ai-color-palette | ✅ ported | purple-band hue concentration |
| 8 | nested-cards | nested-cards | ✅ ported | filled-frame depth ≥ 3 |
| 9 | monotonous-spacing | monotonous-spacing | ✅ ported | single mode covers > 80% |
| 10 | everything-centered | everything-centered | ✅ ported | > 75% of text center-aligned |
| 11 | bounce-easing | — | ❌ N/A | no animation runtime in .pen |
| 12 | dark-glow | dark-glow | ✅ ported | dark fill + colored shadow |
| 13 | icon-tile-stack | icon-tile-stack | ✅ ported | icon tile + heading composition |
| 14 | pure-black-white | pure-black-white | ✅ ported | #000 / #fff background fill |
| 15 | gray-on-color | gray-on-color | ✅ ported | low-sat text on saturated bg |
| 16 | low-contrast | low-contrast | ✅ ported | WCAG ratio < 4.5 |
| 17 | layout-transition | — | ❌ N/A | no animation runtime in .pen |
| 18 | line-length | line-length | ✅ ported | width / fontSize × 2 > 80ch |
| 19 | cramped-padding | cramped-padding | ✅ ported | padding < 12 around text |
| 20 | tight-leading | tight-leading | ✅ ported | lineHeight < 1.3 |
| 21 | skipped-heading | skipped-heading | 🟡 partial | fontSize-band inference, not DOM levels |
| 22 | justified-text | justified-text | ✅ ported | textAlign = justify |
| 23 | tiny-text | tiny-text | ✅ ported | fontSize < 12 |
| 24 | all-caps-body | all-caps-body | ✅ ported | long text in uppercase |
| 25 | wide-tracking | wide-tracking | ✅ ported | body letterSpacing > 0.05em |

**Coverage**: 23 of 25 ported, 2 genuinely N/A (both animation-runtime dependent).

## New rules (Pencil-native)

Eight rules that don't have an impeccable analog because they target Pencil-specific affordances or Pencil gotchas:

| id | why it doesn't exist in impeccable |
|---|---|
| text-overflow-hug | Pencil's `textGrowth: "hug-text"` default has no CSS analog |
| absolute-negative-offset | Pencil-specific renderer quirk (negative abs coords clip) |
| hardcoded-color | impeccable's audit skill mentions this but there's no detector rule; we promote it to a rule |
| orphan-token | Pencil variables ≠ CSS custom properties; deletion is safer here |
| ghost-node | .pen's node tree is edited incrementally; orphans are common |
| shape-monotony | impeccable has `nested-cards` but no "every card same shape" rule |
| long-italic-serif | impeccable bans ~23 specific fonts but doesn't regulate italic-serif-at-body-length |
| coral-on-noninteractive | project-configurable rule for palette semantic enforcement |

## Command mapping

| impeccable command | impeccable-pencil analog | Shipped |
|---|---|---|
| /impeccable | /impeccable-pencil | ✅ v0.0.1 |
| /audit | /pen-audit | ✅ v0.0.1 |
| /critique | /pen-critique | ✅ v0.0.1 |
| /polish | /pen-polish | ✅ v0.0.1 |
| /shape | /pen-shape | ✅ v0.0.1 |
| /teach | /pen-teach | planned |
| /extract | /pen-extract | planned |
| /typeset | /pen-typeset | planned |
| /colorize | /pen-colorize | planned |
| /layout | /pen-layout | planned |
| /clarify | /pen-clarify | planned |
| /distill | /pen-distill | planned |
| /bolder | /pen-bolder | planned |
| /delight | /pen-delight | planned |
| /quieter | /pen-quieter | planned |
| /harden | /pen-harden | planned |
| /overdrive | /pen-overdrive | planned |
| /animate | — | N/A (no runtime) |
| /optimize | — | N/A (no runtime) |
| /adapt | /pen-adapt | planned (responsive variant gen) |
