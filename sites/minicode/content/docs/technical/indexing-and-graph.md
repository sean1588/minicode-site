---
title: Indexing and Graph
description: How minicode parses code, builds a dependency graph, and turns that structure into code-map ranking and symbol-aware tools.
weight: 40
kicker: Technical docs
---

The indexing and graph stack is one of the most distinctive parts of minicode. The built-in TypeScript and JavaScript path uses the TypeScript compiler API for fast syntax-level parsing, then builds a dependency graph over the resulting symbols.

## Indexing pipeline

At startup, minicode scans the workspace for supported source files, skips common build and vendor folders, and runs the matching language plugins. The resulting project index stores:

- extracted symbols
- symbols grouped by file
- project file contents for dependency resolution
- directed dependency edges
- helper APIs such as `getSymbol`, `getDependencyCone`, and `getCodeMap`

## AST parsing strategy

The built-in TypeScript plugin uses `ts.createSourceFile(...)` rather than a full `Program` or type-checking pass. That keeps indexing light and fast while still giving the agent a structural map of declarations.

The plugin walks the tree and extracts:

- functions
- classes
- constructors
- methods
- interfaces
- type aliases
- function-valued variable declarations

Each symbol gets a name, qualified name, kind, file path, line range, signature, and export status.

## Dependency graph construction

After symbol extraction, minicode parses project files again to build edges such as:

| Edge kind | Meaning |
| --- | --- |
| `calls` | one symbol invokes another |
| `references` | one symbol uses another in a type position |
| `extends` | class inheritance |
| `implements` | class-to-interface implementation |

The result is a graph that can power dependency-cone traversal and blast-radius analysis.

## Code map ranking

The code map is a compact project skeleton injected into the system prompt. When it needs to be truncated, minicode ranks symbols by:

1. export status
2. inbound reference count
3. entry-point bias for index files

In practice, that means high-signal APIs survive context compression more often than random implementation details.

## Tools powered by the graph

The graph is not just for visualization. It directly powers:

- `read_symbol`
- `find_references`
- `get_dependencies`
- `search_code_map`

That is the bridge between indexing internals and day-to-day agent behavior.

## Practical tradeoffs

The technical notes are explicit about the boundaries:

- this is syntax-driven, not full semantic type-checking
- name-based matching can collide in rare same-name cases
- the `imports` edge kind exists in shared types but is not yet emitted by the built-in TypeScript resolver

Even with those limits, the system provides much richer structural navigation than plain text search.
