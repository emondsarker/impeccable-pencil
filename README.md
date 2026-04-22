# impeccable-pencil

A design-quality linter for [Pencil](https://penciltool.com) `.pen` files, inspired by and ported from [pbakaus/impeccable](https://github.com/pbakaus/impeccable).

Where `impeccable` detects AI-slop and quality issues in generated **web UI code** (HTML/CSS/JSX/Vue/Svelte), `impeccable-pencil` detects the same class of problems in **`.pen` design files** — the node-tree format used by the Pencil design tool.

> Status: **early prototype**. Rule catalog drafted, detector architecture in place, small number of rules implemented.

## Why

AI-generated designs exhibit the same tells as AI-generated code: overused fonts, centered-everything layouts, nested cards, monotonous spacing, thick one-sided accent stripes, and so on. `impeccable` names ~25 of these patterns and provides deterministic checks over HTML/CSS. The same patterns show up in AI-generated Pencil files — but until now there was no static checker for them at the design-file level.

`impeccable-pencil` walks the node tree of a `.pen` file (via the Pencil MCP server, since `.pen` is encrypted) and reports violations with severity, location, and a suggested fix.

## Rule catalog

31 rules total — see [`docs/rule-catalog.md`](./docs/rule-catalog.md) for the full list and [`docs/port-mapping.md`](./docs/port-mapping.md) for the one-to-one mapping from impeccable's 25 rules.

**Ported from impeccable (23):**
side-tab, border-accent-on-rounded, overused-font, single-font, flat-type-hierarchy, gradient-text, ai-color-palette, nested-cards, monotonous-spacing, everything-centered, dark-glow, icon-tile-stack, pure-black-white, gray-on-color, low-contrast, line-length, cramped-padding, tight-leading, skipped-heading, justified-text, tiny-text, all-caps-body, wide-tracking

**Not applicable (2):** bounce-easing, layout-transition — no animation runtime in `.pen` files.

**New, Pencil-specific (8):**
text-overflow-hug, absolute-negative-offset, hardcoded-color, orphan-token, ghost-node, shape-monotony, long-italic-serif, coral-on-noninteractive

## How it works

`.pen` files are encrypted — they can only be read via the Pencil MCP server's `batch_get` tool. So unlike impeccable (which parses files directly), `impeccable-pencil` is designed to run inside an agent context that has MCP access:

```
agent → batch_get(pattern) → node tree → penlint rules → report
```

A future standalone CLI could wrap the MCP client, but the first cut is agent-native.

## Install as agent skills

impeccable-pencil ships as a set of agent skills in `.agents/skills/`. Any AI harness that reads `.agents/skills/` (Claude Code, Cursor, Codex CLI, Gemini CLI, Kiro, OpenCode, …) can pull them via the `skills` CLI:

```bash
# Install into current project (recommended):
npx skills add emondsarker/impeccable-pencil

# Install globally for your user:
npx skills add emondsarker/impeccable-pencil -g

# Only the auditor, not the whole pack:
npx skills add emondsarker/impeccable-pencil --skill pen-audit
```

Skills included: `impeccable-pencil` (core, auto-invokes), `pen-audit`, `pen-critique`, `pen-polish`, `pen-shape`. Slash commands: `/impeccable-pencil`, `/pen-audit`, `/pen-critique`, `/pen-polish`, `/pen-shape`.

### Auto-invoke when the Pencil MCP is used

The `impeccable-pencil` skill's description tells the agent to load it automatically whenever:

- Any `mcp__pencil__*` tool is called (batch_get, batch_design, get_editor_state, …)
- The user mentions a `.pen` file
- The user invokes any `/pen-*` slash command

No hook configuration required — the description field is written so the agent discovers it during tool-selection. If you want stronger enforcement, add a `PreToolUse` hook in your agent settings that invokes `/impeccable-pencil` when any `mcp__pencil__*` tool is about to run.

## Run the detector directly (CLI)

Because `.pen` files are encrypted, the CLI can't parse them on its own. It takes a JSON dump of the node tree + variables (which an agent produces from `batch_get` + `get_variables`) and runs the rules over it.

```bash
# Directly on a dump:
node bin/penlint path/to/nodes.json

# JSON report for CI:
node bin/penlint path/to/nodes.json --json
```

Input shape:

```json
{
  "nodes":     [{ "id": "...", "type": "frame|text|rectangle|...", ... }],
  "variables": { "$tokenName": "#hex", ... }
}
```

Exit codes: `0` = clean, `1` = findings present, `2` = usage error.

See [`fixtures/slop.json`](./fixtures/slop.json) and [`fixtures/clean.json`](./fixtures/clean.json) for examples.

## License & attribution

Apache 2.0. See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE). This project ports rule ideas, severity model, and command vocabulary from [pbakaus/impeccable](https://github.com/pbakaus/impeccable), also Apache 2.0. Detector implementation is independent.
