# impeccable-pencil

A design-quality linter for Pencil `.pen` files. Port of [pbakaus/impeccable](https://github.com/pbakaus/impeccable).

Status: early prototype. 31 rules catalogued, 5 implemented.

## What it catches

AI-slop and quality tells in design files, the same way impeccable catches them in code. Full list in [`docs/rule-catalog.md`](./docs/rule-catalog.md).

- 23 rules ported from impeccable (side-tab, overused-font, nested-cards, low-contrast, …)
- 8 Pencil-specific rules (text-overflow-hug, absolute-negative-offset, hardcoded-color, …)
- 2 impeccable rules don't apply (bounce-easing, layout-transition — no animation runtime in `.pen`)

## Install the skills

Ships as agent skills under `.agents/skills/`. Works with Claude Code, Cursor, Codex CLI, Gemini CLI, Kiro, OpenCode.

```bash
npx skills add emondsarker/impeccable-pencil
```

Provides slash commands: `/impeccable-pencil`, `/pen-audit`, `/pen-critique`, `/pen-polish`, `/pen-shape`. The core skill auto-loads whenever any `mcp__pencil__*` tool is used or a `.pen` file is mentioned.

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
