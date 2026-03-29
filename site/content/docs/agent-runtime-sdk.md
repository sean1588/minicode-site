---
title: Agent Runtime SDK
description: A dedicated overview of the `@minicode/agent-sdk` package, including its current status, core exports, and how to build on top of it.
weight: 55
kicker: SDK
---

The `minicode` repository includes a dedicated SDK package at [packages/agent-sdk](/mnt/c/Users/seanh/Documents/codex-projects/minicode/packages/agent-sdk). It packages the reusable parts of the runtime so the CLI can be just one consumer among others.

## Current status

The SDK is real code, not just a concept. It already has:

- a dedicated README
- a package boundary
- exported runtime types and classes
- built-in core tools
- model clients for Anthropic and OpenAI-compatible providers

One important detail from the current repo state: [package.json](/mnt/c/Users/seanh/Documents/codex-projects/minicode/packages/agent-sdk/package.json) is still marked `private`. So the package exists and is documented, but it is not yet a normal published npm package in the current source tree.

## What it includes

From the current exports in [src/index.ts](/mnt/c/Users/seanh/Documents/codex-projects/minicode/packages/agent-sdk/src/index.ts), the SDK exposes:

- core runtime types such as `AgentConfig`, `ModelClient`, `ModelResponse`, `ToolDefinition`, and `SessionMessage`
- the `CodingAgent` class and UI update event types
- `Session` and compaction-related types
- `AnthropicModelClient`, `OpenAICompatibleModelClient`, and `createModelClient`
- `ToolRegistry` plus `CoreToolHooks`
- the built-in core tool factories
- safety and guardrail helpers
- `buildSystemPrompt`
- `FocusTracker`
- indexer and plugin types such as `LanguagePlugin`, `IndexedSymbol`, and `DependencyEdge`

That makes the package useful both for building new agent runtimes and for building adjacent tooling around the same message, tool, and graph model.

## What it does not include

The SDK exports indexer and plugin _types_, but it does not currently ship the full `minicode` project indexer implementation that the CLI uses for TypeScript-aware graph tools.

In practice, that means:

- the SDK can give you the reusable runtime core
- the CLI repo still carries the richer project-index and serve-mode implementation
- if you want symbol-aware graph tooling in another app today, you would still need to bring over or extract more of the `minicode` indexer layer

## Core building blocks

### `CodingAgent`

`CodingAgent` is the main turn-based runtime. It sends messages to the model, executes tool calls, appends results to session history, and stops when it reaches a final answer or a guardrail condition.

### `Session`

`Session` stores conversation history and supports trimming and compaction. This is part of what makes the SDK useful beyond one-shot prompting: it has explicit long-running session behavior rather than forcing each consumer to invent its own.

### `ToolRegistry`

`ToolRegistry` handles tool registration, schema generation, and execution. In the current implementation it supports:

- `ToolRegistry.createDefault(config)` for the built-in core tools
- custom registries created from your own `ToolDefinition[]`

The default SDK tool set is the general-purpose core layer:

- `read_file`
- `write_file`
- `edit_file`
- `search`
- `list_files`
- `run_command`

### Model clients

The SDK currently exposes:

- `AnthropicModelClient`
- `OpenAICompatibleModelClient`
- `createModelClient(config)`

That lets consumers keep a stable runtime model while swapping the provider transport underneath.

## Typical usage

The SDK README shows the intended flow clearly:

1. define an `AgentConfig`
2. create a model client
3. create a tool registry
4. construct a `CodingAgent`
5. call `runTurn(...)`

At a high level, that looks like:

```ts
import {
  CodingAgent,
  ToolRegistry,
  createModelClient,
} from "@minicode/agent-sdk";

const toolRegistry = ToolRegistry.createDefault(config);
const modelClient = createModelClient(config);
const agent = new CodingAgent({ config, modelClient, toolRegistry });

const result = await agent.runTurn("What files are in this project?");
console.log(result.text);
```

## OpenAI-compatible backends

One of the practical strengths of the SDK is that it supports generic OpenAI-compatible providers, not just one hosted API. The README explicitly calls out use with:

- Ollama
- LM Studio
- OpenRouter
- other OpenAI-compatible endpoints

That lines up well with the broader `minicode` story: local-first origins, but a runtime architecture that works across local and hosted models.

## Streaming and UI hooks

The runtime can emit:

- simple progress callbacks via `onProgress`
- structured UI events via `onUiUpdate`

Those structured updates are what make it possible to build richer frontends on top of the same runtime loop instead of treating the agent as a black box.

The current SDK exports UI event types alongside `CodingAgent`, which is a strong signal that the package is already designed to support UI consumers, not just terminal scripts.

## Custom tools and hooks

The SDK supports custom tools through `ToolDefinition`, and the built-in tool registry can be extended or replaced.

For integrations that maintain their own project index, `CoreToolHooks` let you respond to:

- writes
- edits

That is the bridge between the runtime package and a richer application layer that wants to keep indexes or metadata up to date.

## Safety model

The SDK includes guardrails that are useful even outside the `minicode` CLI:

- workspace path containment
- destructive-command detection
- command denylist enforcement
- file-size checks
- step limits
- loop detection

These helpers are exported directly, so consumers can reuse the same safety model or extend it.

## Relationship to the broader minicode architecture

The SDK sits underneath the broader product story:

- the CLI uses the runtime and adds the project indexer plus symbol-aware tools
- the web app uses the same core runtime behavior with a richer event-driven UI
- the draft SDK architecture points toward a future where those layers are more cleanly split into reusable packages

So the SDK is best understood as the reusable core of the system, while the rest of `minicode` adds graph-aware indexing, serve mode, and the product-facing UI.

## When to use this page versus the technical docs

Use this page when you want to understand:

- what the SDK package already contains
- how close it is to being reusable independently
- how the exported API is organized today

Use the technical docs when you want the deeper system story:

- [Runtime Architecture](/docs/technical/runtime-architecture/)
- [Context Optimization](/docs/technical/context-optimization/)
- [Indexing and Graph](/docs/technical/indexing-and-graph/)
