---
name: impeccable-pencil
description: Design-quality principles and anti-pattern catalog for Pencil .pen files. MUST be loaded whenever the agent uses the Pencil MCP server (any mcp__pencil__* tool) or whenever the user mentions a .pen file, a Pencil design, or a /pen-* command. Defines the 31-rule catalog, severity ladder, and "design slop" framing that every other pen-* skill depends on.
version: 0.0.1
user-invocable: true
---

## When to invoke

**Auto-invoke when ANY of these is true:**
- Agent is about to call any `mcp__pencil__*` tool (batch_get, batch_design, get_editor_state, etc.)
- User invokes a `/pen-*` slash command (`/pen-audit`, `/pen-critique`, `/pen-polish`, `/pen-shape`)
- User mentions a `.pen` file by name or path
- User refers to "Pencil" as the design tool (not the CLI editor)

Run this skill once per task, then defer to the specific sub-skill the user is asking for. All `/pen-*` commands assume this skill has already been loaded.

## What this skill provides

1. **The 31-rule catalog** — 23 rules ported from [pbakaus/impeccable](https://github.com/pbakaus/impeccable) + 8 Pencil-specific rules
2. **The P0–P3 severity ladder** — borrowed verbatim from impeccable
3. **The "AI slop" framing** — design tells that make a .pen file look AI-generated
4. **Context Gathering Protocol** — what to know before designing or auditing

## Rule catalog (summary — see `docs/rule-catalog.md` in the repo for full detection logic)

### AI Slop (12 rules)
| id | what it flags |
|---|---|
| side-tab | one-sided thick stroke on a frame (`stroke: { left: N }`, N > 1) |
| border-accent-on-rounded | one-sided stroke + `cornerRadius ≥ 8` |
| overused-font | fontFamily in {Inter, Roboto, Helvetica, SF Pro, system-ui} |
| single-font | distinct fontFamily count across text = 1 |
| flat-type-hierarchy | sorted fontSize set has adjacent ratio < 1.125 |
| gradient-text | text `fill` is a gradient |
| ai-color-palette | fill hue in purple/violet band, or cyan-on-dark combos |
| nested-cards | frame-with-fill ≥ 3 levels deep |
| monotonous-spacing | one gap/padding value dominates > 80% of nodes |
| everything-centered | > 75% of text nodes have `textAlign: center` |
| dark-glow | dark fill + colored drop-shadow |
| icon-tile-stack | small rounded-square frame with icon child stacked above a title |

### Quality (11 rules)
| id | what it flags |
|---|---|
| pure-black-white | fill exactly `#000000` or `#FFFFFF` on background frames |
| gray-on-color | gray text fill on saturated parent fill |
| low-contrast | WCAG ratio < 4.5 between text fill and resolved parent bg |
| line-length | text with width / avg-char-width > 80ch |
| cramped-padding | padding < 12 around text |
| tight-leading | `lineHeight` < 1.3 |
| skipped-heading | heading fontSize bands skipped inside a section |
| justified-text | `textAlign: justify` |
| tiny-text | `fontSize < 12` |
| all-caps-body | body-length text with uppercase transform |
| wide-tracking | body text `letterSpacing > 0.05em` |

### Pencil-native (8 rules)
| id | what it flags |
|---|---|
| text-overflow-hug | sentence-length text in bounded parent missing `textGrowth: "fixed-width"` |
| absolute-negative-offset | `layoutPosition: "absolute"` with negative x or y (Pencil clips these) |
| hardcoded-color | literal hex in `fill`/`stroke` where a token covers that color |
| orphan-token | variable defined but never referenced |
| ghost-node | empty frame, no children, no content |
| shape-monotony | every card uses identical symmetric cornerRadius |
| long-italic-serif | sentence-length text set in Instrument Serif italic (or any italic serif) |
| coral-on-noninteractive | palette-specific: interactive-only token used as fill on a non-interactive surface |

## Severity ladder

- **P0 Blocking** — renders broken, content clipped, WCAG A failure
- **P1 Major** — WCAG AA failure, obvious AI slop tell, confusing hierarchy
- **P2 Minor** — polish-level quality issue, subtle tell
- **P3 Nice** — taste-level refinement

## Context Gathering Protocol

Before generating or evaluating a .pen file, establish:

1. **Audience & brand tone** — who uses this product, what mood
2. **Existing tokens** — call `mcp__pencil__get_variables` to see the design-language already in the file
3. **Target aesthetic** — ask the user if an `.impeccable-pencil.md` file doesn't exist in the project
4. **What's off-limits** — any colors/fonts the brand forbids

If you can't establish #1 and #3, ask the user 2–4 targeted questions before making any node insertions. Skipping this is how AI slop happens.

## Commands provided by this skill pack

| command | purpose |
|---|---|
| `/pen-audit` | run all deterministic rules, produce a scored report |
| `/pen-critique` | LLM design review + detector synthesis (analog of `/critique`) |
| `/pen-polish` | apply fixes to the top findings |
| `/pen-shape` | pre-design discovery interview + brief (analog of `/shape`) |

## Core DOs and DON'Ts

**DO**
- Match shape language to semantic role (alert / insight / tip / message all use distinct asymmetric cornerRadius — see `shape-monotony`)
- Treat `$interactive` / `$action` tokens as exclusive to pressable elements — never decorative
- Set `textGrowth: "fixed-width"` on any text longer than ~4 words inside a bounded parent
- Use tokens (`$surface`, `$ink`, etc.) for every color; hardcoded hex is a finding

**DON'T**
- Apply one-sided thick strokes as a category marker (`side-tab`)
- Stack identical rounded cards in grids (`nested-cards` + `monotonous-spacing` together are the #1 AI tell)
- Put sentence-length copy in italic serif (`long-italic-serif`) — reserve italic serif for short display text
- Position absolute-layout children at negative x/y — Pencil clips them silently
