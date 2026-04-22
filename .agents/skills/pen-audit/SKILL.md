---
name: pen-audit
description: Run deterministic anti-pattern checks on a .pen file (or a specific node in one) and produce a scored report with P0–P3 severities. Use when the user asks for an audit, quality check, design review, or anti-pattern scan on a Pencil design. Analog of impeccable's /audit, targeted at .pen files.
user-invocable: true
argument-hint: "[file path or node id, optional]"
---

## MANDATORY PREPARATION

1. Invoke `/impeccable-pencil` — loads the 31-rule catalog and severity ladder.
2. If the target is a file, open it via `mcp__pencil__open_document`. If a node id is given, stay in the current document.
3. Pull the full editor state with `mcp__pencil__get_editor_state({ include_schema: true })` if the schema hasn't been loaded this session.

## Process

### 1. Collect

Gather three inputs. Keep them to the side; the detector needs them all.

```
editor     = mcp__pencil__get_editor_state({ include_schema: true })
variables  = mcp__pencil__get_variables()
nodes      = mcp__pencil__batch_get({ patterns: ["*"] })
guidelines = mcp__pencil__get_guidelines()   // if the tool is available
```

Scope notes:
- If the user named a node id or frame, narrow `batch_get` to that subtree (`nodeIds: [...]`) instead of `*` — faster and more relevant.
- If the file is large (> 500 nodes), paginate the `batch_get` by subtree and run the detector per-subtree.
- `get_guidelines` may return project-specific style rules that override or add to the 31-rule catalog — treat them as authoritative.

### 2. Run every applicable rule

All 31 rules run via the `detect()` function in `impeccable-pencil/src/detect.mjs`. No LLM-detected rules remain — everything is deterministic.

Detector input shape:

```json
{
  "nodes":     [ ...all nodes as returned by batch_get... ],
  "variables": { "$coral": "#FF6A5B", ... },
  "config":    { "partialScan": true }
}
```

Set `config.partialScan = true` whenever you're auditing anything less than the full `.pen` file (a single screen, a subtree, a component). It disables `orphan-token`, which produces noise on scoped scans because tokens used elsewhere in the file look "orphaned" locally. Omit the flag (or set `false`) for whole-file audits.

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

## False-positive filtering (MANDATORY)

Raw detector output typically contains 20–60% false positives on a well-designed file because rules are heuristic. **Do not dump raw output on the user.** Follow `/impeccable-pencil`'s Verification Protocol:

1. Run the detector, get raw findings.
2. For each finding, inspect the node: size, role-name, ancestors, styling context.
3. Drop findings that match known FP shapes (pills inside cards for `nested-cards`, eyebrows for `text-overflow-hug`, etc. — see `/impeccable-pencil`'s FP table).
4. Report the filtered set.
5. At the end, disclose: `"filtered N false positives"` with the breakdown. Users should see that judgment was applied, not detector output verbatim.

If after filtering the report has zero findings, say so plainly: `"Clean against the 31-rule catalog."` Don't manufacture low-severity items to fill space.

## Handoff

End the report with:

> Re-run `/pen-audit` after any `/pen-polish` pass to see the score change.
