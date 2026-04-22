---
name: impeccable-pencil
description: Design-quality principles and anti-pattern catalog for Pencil .pen files. MUST be loaded whenever the agent uses the Pencil MCP server (any mcp__pencil__* tool) or whenever the user mentions a .pen file, a Pencil design, or a /pen-* command. Defines the 31-rule catalog, severity ladder, and "design slop" framing that every other pen-* skill depends on.
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

**Implementation status**: all 31 rules have executable detectors in `src/rules/`. `coral-on-noninteractive` is a no-op until you pass `config.interactiveTokens` to the detector.

### AI Slop (12 rules)
| id | what it flags |
|---|---|
| side-tab | one-sided thick stroke on a frame (`stroke: { left: N }`, N > 1) |
| border-accent-on-rounded | one-sided stroke + `cornerRadius ≥ 8` |
| overused-font | fontFamily in {Inter, Roboto, Helvetica, SF Pro, system-ui} |
| single-font | distinct fontFamily count across text = 1 (≥ 5 text nodes) |
| flat-type-hierarchy | sorted fontSize set has adjacent ratio < 1.125 |
| gradient-text | text `fill` is a gradient |
| ai-color-palette | > 30% purple/violet fills, or saturated cyan on a dark parent |
| nested-cards | card-like filled frame ≥ 3 levels deep |
| monotonous-spacing | one gap/padding value dominates > 80% of ≥ 10 values |
| everything-centered | > 75% of aligned text nodes have `textAlign: center` |
| dark-glow | dark fill + bright or saturated drop-shadow |
| icon-tile-stack | rounded-square icon tile stacked above a heading |

### Quality (11 rules)
| id | what it flags |
|---|---|
| pure-black-white | fill exactly `#000000` or `#FFFFFF` on background frames |
| gray-on-color | gray text fill on saturated parent fill |
| low-contrast | WCAG ratio < 4.5 between text fill and resolved parent bg (P0 if < 3.0) |
| line-length | body text (≥ 12 words) with `width / (fontSize × 0.5) > 80ch` |
| cramped-padding | frame with text child, padding < 12 on any side |
| tight-leading | body text `lineHeight` multiplier < 1.3 |
| skipped-heading | heading fontSize bands skip a level inside a section |
| justified-text | `textAlign: justify` |
| tiny-text | `fontSize < 12` with content > 20 chars |
| all-caps-body | content > 40 chars set in all-caps |
| wide-tracking | body text `letterSpacing / fontSize > 0.05` |

### Pencil-native (8 rules)
| id | what it flags |
|---|---|
| text-overflow-hug | sentence-length text in bounded parent missing `textGrowth: "fixed-width"` |
| absolute-negative-offset | `layoutPosition: "absolute"` with negative x or y (Pencil clips these) |
| hardcoded-color | literal hex in `fill`/`stroke` where a token covers that exact color |
| orphan-token | variable defined but never referenced |
| ghost-node | non-root empty frame, no children, no content |
| shape-monotony | ≥ 4 cards share identical symmetric cornerRadius (> 90%) |
| long-italic-serif | sentence-length text (≥ 6 words) set in italic serif |
| coral-on-noninteractive | config-named interactive token used as fill on a non-interactive surface |

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

## Pencil-native conventions

Things the Pencil MCP requires or expects that the rule catalog doesn't capture — follow these regardless of findings.

### Always at session start
- Call `mcp__pencil__get_editor_state` first to know which .pen file is active and what the user has selected.
- Call `mcp__pencil__get_guidelines` when starting a design task to load project-specific style guides. Pencil ships its own design guidance — read it before running your own rules.
- Call `mcp__pencil__get_variables` before any insertion so you use existing tokens instead of hardcoding hex.

### Writing nodes (`batch_design`)
- **25 operations per call, max.** Split larger edits into sequential batches. Going over causes the tool to reject the batch.
- **Prefer `U(id, {...})` (update) over `R(id, {...})` (replace)** for in-place changes. Replace is destructive on children.
- **One semantic intent per batch** — don't mix "fix slop findings" with "rename tokens" in the same call. Makes diffs reviewable.
- **Use `placeholder: true`** on text whose copy is a draft you expect the user to refine. Signals to downstream tooling that the content isn't final.
- **Absolute children with `layoutPosition: "absolute"`** need positive x/y (see `absolute-negative-offset` — Pencil clips negatives silently).
- **Text inside bounded parents** needs `width: "fill_container"` AND `textGrowth: "fixed-width"` (see `text-overflow-hug`) — Pencil defaults text to hug, which overflows.

### Verifying output
- After each batch, call `mcp__pencil__get_screenshot` and visually review before moving on. The detector catches structural slop but misses visual misalignment, cramped layout, and Z-index collisions.
- If a fix introduces a new finding, **revert the batch** rather than layering another fix on top. Compounding band-aids is how design debt accrues.
- For large audits, call `mcp__pencil__snapshot_layout` to capture before/after layout trees for diffing.

### Reading nodes (`batch_get`)
- Use `patterns` with wildcards (`["*"]`) for whole-file scans.
- Use `nodeIds` when you already know the targets — cheaper than pattern-matching.
- `batch_get` is read-only — do not emit the impeccable-pencil reminder before it.

## Commands provided by this skill pack

| command | purpose |
|---|---|
| `/pen-audit` | run all deterministic rules, produce a scored report |
| `/pen-critique` | LLM design review + detector synthesis (analog of `/critique`) |
| `/pen-polish` | apply fixes to the top findings |
| `/pen-shape` | pre-design discovery interview + brief (analog of `/shape`) |

## False-positive discipline (read before reporting ANY finding)

The 31 rules are heuristics, not gospel. They're calibrated on AI-slop patterns, but any heuristic fires on some legitimate design moves. **Before reporting a finding, verify it against the actual node.**

### Known FP patterns to always check

| Rule | FP shape | How to verify |
|---|---|---|
| `nested-cards` | Pill badges, dots, icon tiles, 1-px dividers inside a card inside a screen bg all register as "3-deep filled frames." Ignore them. | Is the flagged node actually **card-like** (substantial panel ≥120×80, padding > 0, not pill-shaped)? If no, it's a FP — drop it. |
| `text-overflow-hug` | Eyebrows like `"MONDAY · APRIL 21 · 2026"` have 5+ tokens but don't wrap. | Does the text have `letterSpacing > 0`, `fontSize < 14`, or all-caps content? Those are eyebrows — drop it. |
| `overused-font` | Project might legitimately use Inter as a conscious choice | Check if the project context file or brand direction sanctions the font. If yes, demote to P3 or drop. |
| `nested-cards` / `shape-monotony` | Design systems frame or component library naturally has many similar shapes side-by-side | Is the node inside a frame named like "Design System", "Components", or similar meta? If yes, drop it. |
| `ai-color-palette` | A single purple card for branding reasons is fine | Check whether the purple/violet is ≥30% of all filled nodes, not just 1–2. |
| `low-contrast` | Light text on a gradient intentionally uses the brightest stop for legibility | Compute against the lightest stop of any gradient, not the average. |
| `cramped-padding` | A list row with `padding: [12, 0]` inside a padded panel is fine — the panel provides the side breathing room. | Check if the flagged frame sits inside a container with padding >= 12. If so, drop. |
| `orphan-token` | Scoped audits mis-flag tokens used by other screens. | Pass `config.partialScan: true` to the detector for any non-full-file scan. With that flag the rule is a no-op. |

### Verification protocol

When running `/pen-audit` or `/pen-critique`:

1. Run the detector, collect raw findings.
2. For each finding, **read the node's surrounding context** (size, role-name, ancestors) before promoting it into the report.
3. If the finding matches a known FP shape above, **drop it** — do not report it, do not demote it. (Listing false positives wastes the user's time more than missing a subtle true positive.)
4. If you dropped findings, briefly note the count at the end of the report: `"filtered 14 false positives (8 pill badges, 6 decorative dots)"`. The user should know you applied judgment.

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
