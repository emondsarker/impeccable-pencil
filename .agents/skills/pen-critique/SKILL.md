---
name: pen-critique
description: Opinionated design review of a .pen file — LLM aesthetic critique combined with deterministic rule detection. Use when the user asks for a critique, a designer's take, a review with feel (not just mechanics), or a gut-check on whether something looks AI-generated. Analog of impeccable's /critique, targeted at .pen files.
user-invocable: true
argument-hint: "[file path or node id, optional]"
---

## MANDATORY PREPARATION

Invoke `/impeccable-pencil` first for the rule catalog and severity ladder.

## Process

Run **two independent assessments**, then synthesize.

### Assessment A — Design-director review (LLM)

Evaluate through a senior designer's lens. Score each 0–4:

1. **Visual hierarchy** — does the eye know where to land?
2. **Cognitive load** — how much mental work to parse a screen?
3. **Emotional resonance** — what feeling does it evoke? Is that intentional?
4. **Aesthetic commitment** — is there a clear directional tone or is it generic?
5. **Nielsen heuristics** — visibility of system status, match with real world, etc.

Take a screenshot via `mcp__pencil__get_screenshot` if available — visual review is unreliable from node tree alone.

### Assessment B — Deterministic detection

Same as `/pen-audit`: run the 31 rules, collect findings.

**Rule**: Do NOT let Assessment A see Assessment B's output before forming its opinion. Run them in sequence with isolated notes, or delegate one to a subagent.

### Synthesis

Combine into a single report:

```
## Critique — <file>

### Overall Impression
One paragraph. What it feels like.

### AI Slop Verdict
Does this look AI-generated? Name the tells.

### What's Working (2–3 highlights)
Celebrate what's intentional.

### Priority Issues (3–5, tagged P0–P3)
Each: what element, what's wrong, what to do.

### Persona Red Flags (optional)
"A new user trying to submit a claim would hit X because..."

### Minor Observations
Nice-to-fix polish items.

### Provocative Questions
2–3 questions that push the design further than any single fix would.
```

## Tone

Direct, specific, actionable. Name the node. Explain impact. Propose a concrete move. Vague criticism is banned — every finding ties to a nodeId and a suggested fix.

## Handoff

End with 2–4 clarifying questions grounded in actual findings (give the user concrete options, not open-ended prompts), and a recommended command order:

> Want me to run `/pen-polish` on the P0/P1 items, or start with `/pen-typeset` to fix the type scale?
