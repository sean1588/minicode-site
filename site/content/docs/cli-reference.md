---
title: CLI Reference
description: The main command-line entry points, common flags, and the development scripts that ship with the repository.
weight: 20
kicker: Reference
---

The CLI has three primary modes:

- interactive terminal use
- serve mode for the web UI and OpenAI-compatible backend
- one-shot mode for scripting and automation

## Interactive usage

Run `minicode` from the project you want the agent to work in:

```bash
cd /path/to/your/project
minicode
```

You can also provide the initial task on launch:

```bash
minicode "Add error handling to src/api.ts"
```

## Serve mode

Serve mode starts the browser UI plus the local server surfaces:

```bash
minicode serve
minicode serve --port 8080
```

This mode exposes:

- the web chat UI
- session management
- graph and symbol endpoints
- the OpenAI-compatible `/v1/chat/completions` API

It is mutually exclusive with `--oneshot`, `--json`, and `--out`.

## One-shot mode

Use one-shot mode when you want minicode to run a task and exit:

```bash
minicode --oneshot "Fix lint errors and explain changes"
minicode -1 "Refactor parseArgs and run tests"
```

Useful flags:

```bash
minicode --oneshot --json "Summarize TODOs"
minicode --oneshot --out result.txt "Draft changelog"
```

## Verbose mode

Verbose mode logs prompts, model responses, and tool invocations to stderr:

```bash
minicode --verbose "Fix the bug"
minicode -v
```

In development:

```bash
npm run dev -- --verbose "Fix the bug"
```

## Interactive slash commands

The interactive CLI also exposes built-in slash commands:

| Command | Purpose |
| --- | --- |
| `/help` | Show the available commands |
| `/config` | Print the active runtime configuration |
| `/compact` | Compact older session history |
| `/reasoning [level]` | View or change reasoning effort |
| `/models` | List provider models when model listing is supported |
| `/model [name]` | Show or switch the active model |
| `/save [label]` | Save the current session |
| `/load [label]` | Restore a saved session |
| `/sessions` | List saved sessions |
| `/exit` | Quit the session |

Valid reasoning levels are:

- `xhigh`
- `high`
- `medium`
- `low`
- `minimal`
- `none`
- `off` to clear the override

## Exit codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Runtime failure |
| `2` | CLI usage or validation error |

One example of a usage error is calling `--oneshot` without a prompt.

## Repository scripts

If you are working on minicode itself, the repository exposes these scripts:

| Script | Purpose |
| --- | --- |
| `npm run dev` | Build the web client and start the CLI from TypeScript source |
| `npm run dev:ink` | Start the CLI with Ink UI forced on |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled CLI |
| `npm run lint` | Run ESLint on source and tests |
| `npm test` | Run the Node test suite |
| `npm run verify-index` | Run the index verification program |

## Related docs

- [Get Started](/docs/get-started/)
- [Configuration](/docs/configuration/)
- [Web UI and Serve Mode](/docs/web-ui-and-serve/)
