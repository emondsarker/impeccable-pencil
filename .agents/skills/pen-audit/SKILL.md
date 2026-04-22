---
name: pen-audit
description: Run deterministic anti-pattern checks on a .pen file (or a specific node in one) and produce a scored report with P0–P3 severities. Use when the user asks for an audit, quality check, design review, or anti-pattern scan on a Pencil design. Analog of impeccable's /audit, targeted at .pen files.
version: 0.0.1
user-invocable: true
argument-hint: "[file path or node id, optional]"
---

## MANDATORY PREPARATION

1. Invoke `/impeccable-pencil` — loads the 31-rule catalog and severity ladder.
2. If the target is a file, open it via `mcp__pencil__open_document`. If a node id is given, stay in the current document.
3. Pull the full editor state with `mcp__pencil__get_editor_state({ include_schema: true })` if the schema hasn't been loaded this session.

## Process

### 1. Collect

- `mcp__pencil__get_variables` → token set (needed for `hardcoded-color` and `orphan-token`)
- `mcp__pencil__batch_get` with a broad pattern (e.g. `[{ type: "frame" }, { type: "text" }, { type: "rectangle" }]`) → full node tree, paginating if necessary

### 2. Run every applicable rule

Walk the tree and apply each rule from `/impeccable-pencil`'s catalog. For each finding, record:

```
{
  ruleId:    "side-tab",
  severity:  "P1",
  nodeId:    "aBc12",
  location:  "Dashboard hero / reminder card",
  message:   "Left stroke of 4px on a rounded card reads as an AI accent stripe.",
  fix:       "Remove the one-sided stroke. Use the alert shape vocabulary: cornerRadius [6, 20, 20, 20] + oversized italic serif glyph."
}
```

### 3. Score

Score each of 4 dimensions 0–4:

| Dimension | What it covers |
|-----------|----------------|
| Slop | 12 AI-slop rules |
| Quality | 11 quality rules |
| Pencil-native | 8 Pencil-specific rules |
| Design-system adherence | hardcoded-color, orphan-token, token misuse |

Band totals (out of 16):
- 14–16 Excellent
- 11–13 Good (polish the weak dimension)
- 7–10 Acceptable (meaningful work needed)
- 4–6 Poor (major rework)
- 0–3 Critical

### 4. Report format

```
## Audit — <file / node name>

### Health Score: X/16 (<band>)
| Dim | Score | Key finding |
|---|---|---|
| Slop | ? | ... |
| Quality | ? | ... |
| Pencil-native | ? | ... |
| Design-system | ? | ... |

### AI Slop Verdict
Pass/fail. Name the tells.

### Top findings (P0 first)
[list]

### Systemic issues
Recurring patterns, not one-offs.

### Recommended follow-ups
1. /pen-polish — fix top 3 P0/P1
2. /pen-typeset — resolve overused-font + flat-type-hierarchy
3. ...
```

## Rules

- NEVER fix anything in this skill — audit only. Fixes belong to `/pen-polish`.
- ALWAYS cite the specific `nodeId` for each finding so the user can jump to it.
- If a rule fires but you're unsure (e.g. ambiguous color classification), mark severity one step lower than the default.
- If the file has fewer than 5 nodes, do not score — it's a stub; say so and stop.

## Handoff

End the report with:

> Re-run `/pen-audit` after any `/pen-polish` pass to see the score change.
