---
title: Plugins and Extensibility
description: How the plugin system works today, how to add new language support, and where the runtime SDK is headed.
weight: 50
kicker: Extensibility
---

minicode is built around a plugin-based indexer and a broader runtime architecture that is moving toward a reusable SDK. The plugin system is the main extension point for new language support today, while the MCP server is the main extension point for connecting external agents to the same indexed graph intelligence.

## Built-in language support

The README currently documents built-in support for:

| Language | Extensions | Plugin |
| --- | --- | --- |
| TypeScript and JavaScript | `.ts`, `.tsx`, `.js`, `.jsx` | Built-in |

## Installing plugins

There are two supported paths:

### npm package

Install a package that matches the `minicode-plugin-*` naming pattern in the workspace you want minicode to index:

```bash
npm install minicode-plugin-go
```

At startup, minicode scans the workspace `package.json` dependencies and devDependencies for packages with that prefix and attempts to load them.

### Local workspace plugin

Place a JavaScript file in:

```text
<workspace>/.minicode/plugins/
```

The file should export a `LanguagePlugin` as the default export or a named `plugin`.

## What a plugin provides

Plugins power:

- the compact code map
- `read_symbol`
- `find_references`
- `get_dependencies`
- `find_path`

## MCP surface for external agents

If you want another agent surface to consume minicode's indexed tooling directly, use the MCP server exposed by `minicode serve`. The bundled Claude Code plugin is the easiest example of that path:

```bash
minicode serve
minicode plugin install
```

That gives external agents access to:

- symbol-aware tools
- annotations
- code-map and structural-analysis resources
- the same live graph activity you can watch in the web UI

At a minimum, a plugin needs to know how to:

- decide whether it can index a file
- parse file contents
- emit `IndexedSymbol` records

Dependency resolution is optional, but it unlocks richer graph-aware tooling.

## `LanguagePlugin` interface

The plugin spec defines a core interface with:

- `name`
- `extensions`
- `canIndex(filePath)`
- `indexFile(filePath, content)`
- optional `resolveDependencies(symbols, projectFiles)`

The output of `indexFile` is an array of `IndexedSymbol` objects describing names, qualified names, kinds, files, line ranges, signatures, export status, and placeholder dependency arrays.

## What the SDK is aiming for

The draft SDK spec proposes splitting the current app into reusable packages:

- `@minicode/agent-runtime` for the core agent loop
- `@minicode/tools-core` for default file and command tools
- `@minicode/indexer` for indexing, graph logic, and plugin support
- `@minicode/cli` as one consumer of those packages

That direction would make the runtime reusable in:

- custom web apps
- CI bots
- IDE integrations
- agent services that want minicode-style tool orchestration

## Related docs

- [Agent Runtime SDK](/docs/agent-runtime-sdk/)
- [MCP Server](/docs/mcp-server/)
- [Technical Docs: Runtime Architecture](/docs/technical/runtime-architecture/)
- [Technical Docs: Indexing and Graph](/docs/technical/indexing-and-graph/)
