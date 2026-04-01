---
title: MCP Server
description: Connect external agents such as Claude Code to minicode's symbol-aware tools, code-map resources, and structural analysis.
weight: 45
kicker: Integration
---

`minicode serve` now exposes a built-in MCP (Model Context Protocol) server. That lets external agents use the same indexed code-intelligence surface that powers the web UI: symbol-aware tools, graph-backed navigation, annotations, and structural-analysis resources.

This is the easiest way to reuse minicode's AST-backed project understanding outside the native UI.

## What it gives you

The MCP server is designed for the cases where a generic coding agent would otherwise fall back to file reads and text search.

With minicode behind MCP, an external client can:

- read a symbol directly instead of dumping a whole file
- trace references and dependency cones through the indexed graph
- search the code map by symbol name
- inspect deterministic structural-analysis findings
- attach and read symbol annotations

If the web UI is open at the same time, you can also watch that exploration live in the dependency graph.

## Start the server

The MCP endpoint is hosted by `minicode serve`:

```bash
minicode serve
```

By default that starts:

- web UI: `http://localhost:4567`
- OpenAI-compatible API: `http://localhost:4567/v1`
- MCP endpoint: `http://localhost:4567/mcp`

## Install the Claude Code plugin

The repository ships a bundled Claude Code plugin, so the quickest integration path is:

```bash
minicode plugin install
```

That command:

- creates `~/.claude/plugins/minicode`
- symlinks it to the plugin bundled with the installed `minicode` package
- configures Claude Code to talk to `http://localhost:4567/mcp` by default

After that, keep `minicode serve` running and open Claude Code in the workspace you want to explore.

## MCP tools

The current MCP server exposes these primary tools:

| Tool | Purpose |
| --- | --- |
| `read_symbol` | Read one function, class, interface, or type with source, signature, dependencies, references, and annotations |
| `find_references` | Find what calls or references a symbol |
| `get_dependencies` | Walk the dependency cone for a symbol |
| `search_code_map` | Search indexed symbols by name or substring |
| `find_path` | Find the shortest graph path between two symbols or trace to an entry point |
| `add_annotation` | Attach a user note to a symbol |
| `list_annotations` | List annotations for one symbol or the whole session |

For TypeScript and JavaScript work, `read_symbol` and `search_code_map` are usually much higher-signal than generic file reads.

## MCP resources

The server also exposes two high-value resources:

| Resource | Purpose |
| --- | --- |
| `minicode://code-map` | Ranked project skeleton showing indexed symbols and signatures |
| `minicode://structural-analysis` | Deterministic findings for cycles, hotspots, fan-out, and coupling |

These are useful when you want a broad picture before drilling into individual symbols.

## Claude plugin behavior

The bundled Claude plugin includes opinionated skill prompts for the most common workflows:

- `symbols` for symbol lookup
- `focus` for exploring one symbol and its neighborhood
- `graph` for high-level architecture overviews
- `analyze` for structural-analysis summaries

Those skills are there to encourage external agents to prefer the AST-backed surface instead of falling back to whole-file reads.

## Why this is useful

The main value of the MCP server is not just “more tools.” It is that those tools are grounded in the same indexed graph that minicode already uses for:

- the code map
- graph navigation
- annotations
- structural analysis
- live UI activity

That means you get one code-intelligence layer serving multiple surfaces:

- native web UI
- OpenAI-compatible clients
- external MCP clients like Claude Code

## Troubleshooting

If the plugin is installed but the tools do not appear:

- make sure `minicode serve` is running
- confirm the MCP endpoint is reachable at `http://localhost:4567/mcp`
- rerun `minicode plugin install` to refresh the plugin symlink

If the MCP client connects but returns little or no symbol data:

- make sure the workspace contains supported files
- remember the deepest built-in indexing path today is TypeScript and JavaScript
- use plugins if you want to expand language coverage

## Related docs

- [Get Started](/docs/get-started/)
- [Web UI and Serve Mode](/docs/web-ui-and-serve/)
- [Plugins and Extensibility](/docs/plugins-and-extensibility/)
