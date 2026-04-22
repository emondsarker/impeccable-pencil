---
name: pen-polish
description: Apply fixes for anti-pattern and quality findings in a .pen file. Use after /pen-audit or /pen-critique surfaces issues, or when the user asks to clean up / fix / refine a design. Analog of impeccable's /polish, targeted at .pen files.
version: 0.0.1
user-invocable: true
argument-hint: "[comma-separated rule ids, or 'top-n', optional]"
---

## MANDATORY PREPARATION

1. Invoke `/impeccable-pencil` for the rule catalog.
2. Run `/pen-audit` internally if no findings list has been passed in from a prior audit/critique.

## Scope

By default, fix **P0 + P1** findings only. The user can override:

- `/pen-polish all` — every finding
- `/pen-polish top-5` — 5 most severe
- `/pen-polish side-tab,nested-cards` — specific rule ids

## Process

1. **Group findings by rule id** so fixes batch well.
2. **For each rule**, consult the rule's `fix` field (see `src/rules/` in the repo). Examples:
   - `side-tab` → remove the one-sided stroke; if the card needs a category marker, switch to the alert shape vocabulary (`cornerRadius [6,20,20,20]` + oversized italic serif glyph)
   - `hardcoded-color` → replace the literal hex with the closest design token
   - `long-italic-serif` → switch fontFamily to the body font (e.g. DM Sans), keep weight/size
   - `text-overflow-hug` → add `width: "fill_container", textGrowth: "fixed-width"` to the text node
3. **Apply fixes via `mcp__pencil__batch_design`** — one batch per rule group, max 25 operations per batch.
4. **Verify** — take a screenshot and skim; if any fix introduced a new finding, revert and note why.

## Rules

- NEVER silently delete content. Moving, restyling, reparenting are OK; deletion needs an explicit instruction.
- PREFER update (`U(...)`) over replace (`R(...)`) for in-place changes.
- Keep each batch to one semantic intent — don't mix "fix slop" and "rename tokens" in the same batch.
- After fixing, re-run `/pen-audit` and show the score delta.

## Report format

```
## Polish — <file>

### Fixed
- 8 × side-tab removed
- 3 × hardcoded-color → token
- 2 × text-overflow-hug resolved

### Deferred (need your call)
- 1 × nested-cards on the dashboard hero — unclear whether the outer container should stay
- 1 × ai-color-palette on the onboarding welcome — palette decision, not a mechanical fix

### Score
Before: 9/16 → After: 13/16
```

## DON'Ts

- Don't "fix" P3 findings unless explicitly asked — they're polish items, not quality bars
- Don't introduce new nodes to mask a finding (e.g. wrapping a low-contrast text block in a different bg frame is cheating)
- Don't rename tokens without the user's say-so
