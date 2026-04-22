# impeccable-pencil

A design-quality linter for Pencil `.pen` files. Port of [pbakaus/impeccable](https://github.com/pbakaus/impeccable).

Status: early prototype. 31 rules catalogued, 17 implemented.

## What it catches

AI-slop and quality tells in design files, the same way impeccable catches them in code. Full list in [`docs/rule-catalog.md`](./docs/rule-catalog.md).

- 23 rules ported from impeccable (side-tab, overused-font, nested-cards, low-contrast, …)
- 8 Pencil-specific rules (text-overflow-hug, absolute-negative-offset, hardcoded-color, …)
- 2 impeccable rules don't apply (bounce-easing, layout-transition — no animation runtime in `.pen`)

## Install the skills

Ships as agent skills under `.agents/skills/`. Works with Claude Code, Cursor, Codex CLI, Gemini CLI, Kiro, OpenCode.

```bash
npx skills add emondsarker/impeccable-pencil
npx impeccable-pencil install-hook
```

Provides slash commands: `/impeccable-pencil`, `/pen-audit`, `/pen-critique`, `/pen-polish`, `/pen-shape`.

The second command wires a Claude Code `PreToolUse` hook into `.claude/settings.json` that reminds the agent of the rule catalog before every `mcp__pencil__batch_design` call. Without the hook, the skill still works via description-matching on session start — the hook just makes it deterministic.

```bash
npx impeccable-pencil install-hook -g   # install globally (~/.claude/settings.json)
npx impeccable-pencil install-hook -r   # remove
```

## Heuristics, not gospel

The detector rules target common AI-slop tells, but real designs contain legitimate edge cases that match naive versions of those patterns. Raw detector output typically runs 20–60% false positives on a well-designed file.

The `pen-audit` and `pen-critique` skills include a verification protocol that filters known-FP shapes before reporting. When running the CLI directly, apply the same judgment — the rules are a starting point, not a verdict.

## Run the CLI

`.pen` files are encrypted. The CLI takes a JSON dump of the node tree produced from the Pencil MCP.

```bash
node bin/penlint path/to/nodes.json
node bin/penlint path/to/nodes.json --json
```

Input shape:

```json
{ "nodes": [ ... ], "variables": { "$token": "#hex" } }
```

Exit: `0` clean, `1` findings, `2` usage error. See [`fixtures/`](./fixtures/) for examples.

## Develop

```bash
npm test
```

## License

Apache 2.0. Attribution to pbakaus/impeccable in [`NOTICE`](./NOTICE).
