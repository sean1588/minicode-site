---
title: Runtime Architecture
description: The execution loop, session model, tool registry, and model-client abstraction that power a single minicode turn.
weight: 30
kicker: Technical docs
---

The runtime architecture is centered on a tool-using execution loop. A user message enters the session, the model receives the current prompt plus tool schemas, and the agent alternates between model steps and tool execution until it reaches a final answer or a guardrail stops the turn.

## Main components

The runtime docs call out these core pieces:

- `CodingAgent` as the main orchestrator
- `Session` for all retained message history and trimming behavior
- `ToolRegistry` for tool schemas and safe execution
- provider-specific `ModelClient` implementations
- a system-prompt builder that can inject the code map

## Turn lifecycle

A typical turn looks like this:

1. append the user message to session state
2. build the tool schemas
3. build the optional code map
4. build the system prompt
5. loop up to `maxSteps`
6. call the model
7. if tool calls are returned, execute them and append tool results
8. if no tool calls are returned, finish with assistant text

This is the core mechanic that makes minicode a runtime rather than a static completion wrapper.

## Tool execution model

The default tool registry includes:

- file tools such as `read_file`, `write_file`, and `edit_file`
- search and listing tools
- `run_command`
- symbol-aware tools when a project index is available

Inputs are validated, tool failures are caught and returned as structured errors, and the agent loop continues from there instead of crashing.

## Guardrails

The runtime includes several hard stops:

- max-step limits
- loop detection for repeated identical tool calls
- output truncation for oversized tool results
- tool-level path and command safety checks

These protections matter because coding agents can otherwise get stuck in repetitive or overly destructive loops.

## Provider abstraction

The runtime supports both Anthropic and OpenAI-compatible paths behind a shared internal `ModelResponse` shape. That keeps the high-level agent behavior stable even when the request/response format changes underneath.

## Why this architecture fits coding work

The runtime notes emphasize a few reasons this shape works well:

- coding tasks often need repeated inspect-edit-run cycles
- session continuity matters across many tool calls
- graph-aware tools cut down on wasteful file reads
- loop and step guards are essential for autonomy without chaos
