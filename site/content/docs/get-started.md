---
title: Get Started
description: Install minicode, point it at a model endpoint, and run the CLI or web UI for the first time.
weight: 10
kicker: Quick start
---

`minicode` is a coding agent that can run against local OpenAI-compatible servers such as LM Studio, or against other supported providers depending on how you configure it. The fastest path is to start with a local OpenAI-compatible endpoint, install the CLI globally, and set a small `.env` file in `~/.minicode/`.

## What you need

- Node.js 22+
- `rg` in your `PATH` for fast search
- A model endpoint:
  - LM Studio is the documented happy path in the README
  - any OpenAI-compatible local server works too

## Quick start with LM Studio

1. Start LM Studio, load a model, and start the local server.
2. Install minicode globally.
3. Configure the user-level `.env`.

```bash
npm install -g @sean.holung/minicode

mkdir -p ~/.minicode
cat > ~/.minicode/.env << 'EOF'
MODEL_PROVIDER=openai-compatible
MODEL=zai-org/glm-4.7-flash
OPENAI_BASE_URL=http://localhost:1234/v1
OPENAI_API_KEY=
MAX_STEPS=50
MAX_TOKENS=4096
MAX_CONTEXT_TOKENS=24000
WORKSPACE_ROOT=.
COMMAND_TIMEOUT_MS=30000
MAX_FILE_SIZE_BYTES=1000000
CONFIRM_DESTRUCTIVE=true
KEEP_RECENT_MESSAGES=12
LOOP_DETECTION_WINDOW=6
EOF
```

## Run the CLI

Change into the project you want to work on and launch minicode:

```bash
cd /path/to/your/project
minicode
```

You can also start with an initial task:

```bash
minicode "Add error handling to src/api.ts"
```

## Start the web UI

Serve mode starts the local web app, the graph-backed API, the structural-analysis surface, the MCP endpoint, and the OpenAI-compatible endpoint:

```bash
minicode serve              # http://localhost:4567
minicode serve --port 8080
```

By default you get:

- the web UI at `http://localhost:4567`
- the OpenAI-compatible API at `http://localhost:4567/v1`
- the MCP endpoint at `http://localhost:4567/mcp`
- a WebSocket connection for live tool and streaming events

## Use it with Claude Code via MCP

If you want the same symbol-aware tools inside Claude Code, start `minicode serve` and then install the bundled plugin:

```bash
minicode plugin install
```

That creates the global Claude plugin symlink under `~/.claude/plugins/minicode` and points it at the MCP server exposed by `minicode serve`.

The plugin is built around the MCP tools and resources shipped by minicode:

- `read_symbol`
- `find_references`
- `get_dependencies`
- `search_code_map`
- `find_path`
- `add_annotation`
- `list_annotations`
- `minicode://code-map`
- `minicode://structural-analysis`

Once the plugin is installed, Claude Code can use minicode's AST-backed tools while the web UI still shows live graph activity and structural analysis for the same workspace.

## One-shot mode

For scripts, CI, or higher-level orchestration, you can run a single task and exit:

```bash
minicode --oneshot "Find TODOs and summarize action items"
minicode -1 "Refactor parseArgs and run tests"
minicode --oneshot --json "Summarize recent changes"
minicode --oneshot --out result.txt "Generate release notes"
```

## Install from source

If you want to work directly from the repository:

```bash
git clone https://github.com/sean1588/minicode.git
cd minicode
npm install
npm run install:global
```

## What to read next

- [CLI Reference](/docs/cli-reference/)
- [Configuration](/docs/configuration/)
- [Web UI and Serve Mode](/docs/web-ui-and-serve/)
- [MCP Server](/docs/mcp-server/)
