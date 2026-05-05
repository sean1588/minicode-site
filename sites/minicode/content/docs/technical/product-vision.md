---
title: Product Vision
description: The web UI and graph view as the clearest expression of minicode’s agent-native interface design.
weight: 10
kicker: Technical docs
---

The `WEB_SERVE_VISION.md` document frames minicode as more than a CLI with a browser wrapper. The core idea is an environment designed around how an agent understands a codebase: symbols, dependencies, focus, and structured navigation.

## The core bet

The vision document makes a few strong claims:

- symbols should be first-class objects in the UI
- the dependency graph can replace the file tree as the primary navigation surface
- the agent’s attention should be visible and steerable
- prompts should become structured workspaces, not just text boxes

That framing is what turns minicode from a utility into a product concept.

## The three layers

The envisioned experience has three coordinated layers:

1. a chat interface for multi-turn work with streaming tool activity
2. a live view of the agent’s current code map and focus
3. a human-driven dependency graph for manual exploration

The current web UI already ships meaningful pieces of that stack through `minicode serve`.

## Why the graph matters

The graph is not treated as decoration. In the architecture notes it is the natural UI representation of the same structural model the agent already uses internally.

That matters because the agent does not naturally think in file-tree order. It thinks in:

- which symbol matters now
- what that symbol depends on
- which other symbols reference it
- which focused areas deserve prompt budget

The graph makes that model inspectable.

## Long-term implications

The product vision also opens up richer future workflows:

- symbol attachments in prompts
- saved workspaces of pinned symbols
- graph-linked conversations and diffs
- multi-agent views
- history replay of the agent’s exploration path

Even when those features are not fully built yet, they help explain why the current web UI already feels different from a standard “chat panel in an IDE” story.
