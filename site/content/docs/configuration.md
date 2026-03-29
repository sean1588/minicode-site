---
title: Configuration
description: Where minicode reads its settings from, which environment variables it supports, and how to tune it for tighter model context windows.
weight: 30
kicker: Reference
---

minicode keeps its configuration and cache outside your project directory. That lets you reuse the same setup across workspaces while keeping project roots clean.

## Configuration precedence

Later sources override earlier ones:

1. `~/.minicode/.env`
2. `~/.minicode/agent.config.json`
3. project `.env` and `agent.config.json` in the workspace root
4. environment variables in the active shell

The cache lives under `~/.minicode/cache/<workspace-hash>/`.

## Environment variables

| Variable | Default | Notes |
| --- | --- | --- |
| `MODEL_PROVIDER` | `openai-compatible` | `anthropic` or `openai-compatible`; aliases include `openai`, `lmstudio`, and `lm-studio` |
| `MODEL` | `zai-org/glm-4.7-flash` | Model name for the configured provider |
| `ANTHROPIC_API_KEY` | none | Required when `MODEL_PROVIDER=anthropic` |
| `OPENAI_BASE_URL` | `http://localhost:1234/v1` | Base URL for LM Studio or another compatible endpoint |
| `OPENAI_API_KEY` | none | Optional for local servers, required when the endpoint enforces auth |
| `OPENROUTER_API_KEY` | none | Used when `OPENAI_BASE_URL` points at OpenRouter; preferred over `OPENAI_API_KEY` there |
| `MAX_STEPS` | `50` | Max loop iterations per user turn |
| `MAX_TOKENS` | `4096` | Max output tokens per model call |
| `MAX_CONTEXT_TOKENS` | `40000` | Approximate session trimming target |
| `MAX_TOOL_OUTPUT_CHARS` | `8000` | Max characters per tool result before truncation |
| `WORKSPACE_ROOT` | current directory | Root directory tools can access |
| `COMMAND_TIMEOUT_MS` | `30000` | Timeout for search and shell commands |
| `MAX_FILE_SIZE_BYTES` | `1000000` | Read limit for `read_file` |
| `CONFIRM_DESTRUCTIVE` | `true` | Blocks destructive shell commands unless confirmed |
| `KEEP_RECENT_MESSAGES` | `12` | Minimum recent messages preserved during trimming |
| `LOOP_DETECTION_WINDOW` | `6` | Window used for repeated tool-call detection |
| `ENABLE_FILE_READ_DEDUP` | `true` | Deduplicate repeated `read_file` calls within a turn |
| `ENABLE_ADAPTIVE_KEEP_RECENT` | `true` | Scale the protected recent-message window as context fills up |
| `ENABLE_TOOL_OUTPUT_TRUNCATION` | `true` | Apply content-aware truncation strategies to tool output |
| `COMPACTION_THRESHOLD` | `0.8` | Auto-compaction threshold as a fraction of context fullness |
| `COMPACTION_MODEL` | none | Optional model used for LLM-based compaction |
| `REASONING_EFFORT` | none | Optional reasoning level for models that support reasoning tokens |

## `agent.config.json`

You can put `agent.config.json` either in `~/.minicode/` for user defaults or in a workspace root for project-specific overrides:

```json
{
  "modelProvider": "openai-compatible",
  "model": "zai-org/glm-4.7-flash",
  "maxSteps": 50,
  "maxTokens": 4096,
  "maxContextTokens": 40000,
  "workspaceRoot": ".",
  "commandTimeout": 30000,
  "commandDenylist": [],
  "confirmDestructive": true,
  "maxFileSizeBytes": 1000000,
  "keepRecentMessages": 12,
  "loopDetectionWindow": 6,
  "maxToolOutputChars": 8000,
  "openAiBaseUrl": "http://localhost:1234/v1",
  "openAiApiKey": "",
  "enableFileReadDedup": true,
  "enableAdaptiveKeepRecent": true,
  "enableToolOutputTruncation": true,
  "compactionThreshold": 0.8,
  "compactionModel": ""
}
```

### Field mapping

| JSON field | Env var |
| --- | --- |
| `modelProvider` | `MODEL_PROVIDER` |
| `model` | `MODEL` |
| `maxSteps` | `MAX_STEPS` |
| `maxTokens` | `MAX_TOKENS` |
| `maxContextTokens` | `MAX_CONTEXT_TOKENS` |
| `workspaceRoot` | `WORKSPACE_ROOT` |
| `commandTimeout` | `COMMAND_TIMEOUT_MS` |
| `confirmDestructive` | `CONFIRM_DESTRUCTIVE` |
| `maxFileSizeBytes` | `MAX_FILE_SIZE_BYTES` |
| `keepRecentMessages` | `KEEP_RECENT_MESSAGES` |
| `loopDetectionWindow` | `LOOP_DETECTION_WINDOW` |
| `maxToolOutputChars` | `MAX_TOOL_OUTPUT_CHARS` |
| `openAiBaseUrl` | `OPENAI_BASE_URL` |
| `openAiApiKey` | `OPENAI_API_KEY` |
| `enableFileReadDedup` | `ENABLE_FILE_READ_DEDUP` |
| `enableAdaptiveKeepRecent` | `ENABLE_ADAPTIVE_KEEP_RECENT` |
| `enableToolOutputTruncation` | `ENABLE_TOOL_OUTPUT_TRUNCATION` |
| `compactionThreshold` | `COMPACTION_THRESHOLD` |
| `compactionModel` | `COMPACTION_MODEL` |
| `reasoningEffort` | `REASONING_EFFORT` |

`commandDenylist` is JSON-config only. It accepts regex strings that are appended to the built-in destructive-command denylist.

## Tuning for smaller context windows

The context-optimization docs recommend lower `MAX_CONTEXT_TOKENS` values for smaller local models:

| Model context window | Recommended `MAX_CONTEXT_TOKENS` |
| --- | --- |
| `8k` | `6000` |
| `16k` | `12000` |
| `32k` | `25000` |
| `64k+` | `40000` to `60000` |

If you are running tighter local models, it is also worth lowering tool output sizes so read-heavy sessions do not dominate the prompt budget.

## Related docs

- [Get Started](/docs/get-started/)
- [Technical Docs: Context Optimization](/docs/technical/context-optimization/)
