---
name: pen-shape
description: Pre-design discovery interview for a .pen feature — produce a design brief before opening Pencil. Use when the user asks to plan a screen, design a flow, or start a new feature in Pencil. Analog of impeccable's /shape, targeted at .pen files.
version: 0.0.1
user-invocable: true
argument-hint: "[feature or screen name]"
---

## MANDATORY PREPARATION

Invoke `/impeccable-pencil` for the design principles and anti-pattern catalog. This skill produces planning artifacts only — no node insertions.

## Process

### Phase 1 — Discovery interview

Ask across five dimensions. Work conversationally; don't dump the checklist.

1. **Purpose & context** — who uses this, what problem, what does success look like
2. **Content & data** — what info appears, in what volume ranges, what edge cases
3. **Design goals** — primary user action, emotional tone
4. **Constraints** — tokens they must use, accessibility bar, responsive targets
5. **Anti-goals** — directions to avoid, failure modes

Do NOT propose visuals yet.

### Phase 2 — Design brief

Produce a 9-section brief:

1. **Feature summary** — one paragraph
2. **Primary action** — the one thing the user should do
3. **Visual direction** — aesthetic tone, reference images if any
4. **Layout strategy** — how the content is spatially organized
5. **Component states** — default, hover, active, loading, empty, error
6. **Interaction patterns** — what happens when, motion expectations (note motion is for downstream dev, not .pen)
7. **Content requirements** — copy, data, labels
8. **Reference recommendations** — which tokens, which existing components to reuse
9. **Unresolved questions** — anything that blocks design

### Phase 3 — Handoff

End with:

> Want to hand this to `/pen-craft` to start inserting nodes, or save it first?

(`/pen-craft` is a planned sibling command — not shipped yet. For now, the user can hand off to a general Pencil workflow.)

## Rules

- NEVER insert `.pen` nodes from this skill — planning only
- Keep interview < 10 questions total; if you don't have answers after that, the user doesn't have enough context either — flag and stop
- Call out anti-goals explicitly — most AI design failure is doing the wrong thing, not doing the right thing poorly
