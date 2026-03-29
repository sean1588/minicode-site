---
title: Web UI and Serve Mode
description: What ships with `minicode serve`, from the chat UI and sessions to the graph endpoints and OpenAI-compatible API.
weight: 40
kicker: Features
---

`minicode serve` is the browser-facing side of the project. It starts the local chat UI, the OpenAI-compatible API, and the graph-oriented endpoints that power the dependency-graph experience.

## Start serve mode

```bash
minicode serve
minicode serve --port 8080
```

By default this opens:

- the web UI at `http://localhost:4567`
- the OpenAI-compatible API at `http://localhost:4567/v1`
- the WebSocket stream at `ws://localhost:4567`

## What the web UI includes

The shipped interface supports:

- streaming text responses
- compact tool-call pills with elapsed time and expandable results
- visible intermediate reasoning text
- full markdown rendering for final responses
- auto-resize input
- session save and restore
- graph view toggle and resizable panes

## Session management

Sessions can be saved and loaded from the UI. Saved sessions live under `~/.minicode/sessions/` and include the active conversation state.

The UI surfaces:

- session labels
- message counts
- saved timestamps

## OpenAI-compatible API

Serve mode exposes a standard chat-completions surface so other clients can talk to minicode as if it were a model:

```bash
curl http://localhost:4567/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"minicode-agent","messages":[{"role":"user","content":"list files"}]}'
```

The API also supports streaming and `GET /v1/models`.

## REST endpoints

The serve-mode feature guide documents these main groups of endpoints:

### Agent and session endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/status` | Agent status, workspace, model, provider |
| `GET` | `/api/models` | List models when the provider supports model enumeration |
| `POST` | `/api/model` | Switch the active model |
| `GET` | `/api/config` | Formatted agent configuration |
| `POST` | `/api/chat` | Send a message and get a non-streaming response |
| `GET` | `/api/sessions` | List saved sessions |
| `POST` | `/api/sessions/save` | Save current session |
| `POST` | `/api/sessions/load` | Load a saved session |

### Graph and symbol endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/symbols` | All indexed symbols |
| `GET` | `/api/symbols/:name/dependencies` | Dependency cone for a symbol |
| `GET` | `/api/symbols/:name/references` | Referring symbols |
| `GET` | `/api/symbols/:name/source` | Extracted source for a symbol |
| `GET` | `/api/code-map` | Ranked code map |
| `GET` | `/api/graph` | Full dependency graph |
| `GET` | `/api/focus` | Pinned symbols |
| `POST` | `/api/focus` | Pin or unpin a symbol |

### Annotation and explain endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/annotations` | All annotations for the active session |
| `GET` | `/api/symbols/:name/annotations` | Notes for a specific symbol |
| `POST` | `/api/symbols/:name/annotations` | Add a note to a symbol |
| `DELETE` | `/api/symbols/:name/annotations/:index` | Remove a note by index |
| `DELETE` | `/api/symbols/:name/annotations` | Clear all notes for a symbol |
| `GET` | `/api/symbols/:name/explain` | SSE stream for symbol explanation |

## Graph UI capabilities

The current graph experience includes:

- search and ranked symbol lookup
- double-click expansion of 1-hop neighbors
- hover highlighting
- node detail panels
- focus pinning
- graph fit, re-layout, and clear actions
- agent activity pulses when symbol-aware tools run

## Symbol annotations and explain

The web UI also supports symbol-level notes and an `Explain` flow:

- annotations attach user notes to specific symbols
- those notes are injected only when relevant tools touch the symbol
- the explain flow runs a separate research pass for a symbol without polluting the main chat context

## WebSocket protocol

The WebSocket channel supports:

### Client messages

- `chat`
- `cancel`
- `switch_model`

### Server messages

- `turn_start`
- `thinking`
- `streaming_chunk`
- `step`
- `tool_call_start`
- `tool_call_end`
- `turn_end`
- `error`
- `busy`
- `model_changed`

## Related docs

- [Technical Docs: Product Vision](/docs/technical/product-vision/)
- [Technical Docs: Indexing and Graph](/docs/technical/indexing-and-graph/)
