---
title: Context Optimization
description: How minicode keeps long-running coding sessions usable under tighter context budgets.
weight: 20
kicker: Technical docs
---

Context optimization is one of minicode’s original technical wedges. The system is designed to reduce wasted prompt budget, especially for smaller local models, but the same strategies are useful for larger hosted models too.

## Default assumptions

The context-optimization notes describe a few important defaults:

| Parameter | Default | Purpose |
| --- | --- | --- |
| `maxContextTokens` | `40,000` | Target budget for session history |
| `maxToolOutputChars` | `8,000` | Max characters per tool result before truncation |
| `keepRecentMessages` | `12` | Minimum recent messages protected during trimming |

## How context grows

minicode stores user messages, assistant responses, tool call metadata, and tool outputs in a single session history. That means every retained message competes for space in the next model call.

The practical problem is simple: a handful of large tool outputs can consume a huge fraction of the available context window before the model does any real reasoning.

## Strategies in the runtime

The current implementation uses several layers of control:

### Progressive trimming

When the session exceeds the target budget, older tool results are first shrunk into one-line summaries, then old message chunks are dropped, and only in emergency cases are recent protected messages also shrunk.

### Conversation compaction

Older conversation history can be compacted into a structured summary instead of silently disappearing. This can be mechanical or LLM-based depending on configuration.

### Thinking-trace capping

Intermediate model thinking that accompanies tool calls is capped before it is retained in session state, which cuts repeated low-value reasoning tails out of the prompt history.

### Focus-adaptive code map

The code map is regenerated per step and prioritizes symbols the agent has recently explored, plus their nearby graph neighbors. That keeps the injected structural context relevant as the task evolves.

### Tool output truncation

Large tool outputs are clipped to a configured maximum character count.

In the current CLI config loader, content-aware tool output truncation is enabled by default through `ENABLE_TOOL_OUTPUT_TRUNCATION`.

### Symbol-aware tools

Instead of reading whole files whenever possible, minicode prefers:

- `read_symbol`
- `find_references`
- `get_dependencies`

That is the structural side of the context optimization story.

## Additional defaults in the current CLI runtime

The current config loader also enables a few helpful behaviors by default:

- repeated `read_file` deduplication within a turn
- adaptive reduction of the protected recent-message window as context fills up
- auto-compaction with a default threshold of `0.8`

Those defaults are worth knowing because some lower-level type comments still reflect older defaults.

## Practical tuning advice

The technical docs recommend lowering `MAX_CONTEXT_TOKENS` for smaller models:

| Context window | Recommended budget |
| --- | --- |
| `8k` | `6000` |
| `16k` | `12000` |
| `32k` | `25000` |
| `64k+` | `40000` to `60000` |

For especially tight budgets, it is also worth lowering tool output sizes so file reads do not crowd out the reasoning budget.
