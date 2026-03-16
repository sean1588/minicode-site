---
title: "A coding agent for local models"
description: "minicode helps coding models read less, reason better, and use fewer tokens."
---

minicode is a local-first coding agent built around a simple idea: **more context is not always better**.

Most coding agents treat a codebase like a pile of text. They read whole files, bloat the prompt, and waste attention on code that does not matter for the task at hand. That is expensive for API-backed models and actively harmful for smaller local models with tighter effective context windows.

minicode takes a different approach. It gives agents a **structural way to navigate code** using code maps, dependency-aware context, and specialized tools for following symbols, dependencies, and the code that actually matters.

## Why this matters

- **Read less** — avoid whole-file dumping when a task only needs a few symbols
- **Reason better** — reduce attention dilution by increasing signal density
- **Use fewer tokens** — cut prompt bloat, latency, and API cost

## How minicode works

### 1. Build a structural map
minicode indexes a codebase into symbols, signatures, and relationships so the agent starts with orientation instead of guessing.

### 2. Follow the dependency cone
Instead of reading an entire file, the agent can pull the body, types, and adjacent dependencies relevant to the task.

### 3. Walk code structurally
The agent uses specialized tools to navigate code by symbol, dependency, and reference instead of scanning raw files like prose.

### 4. Preserve context for reasoning
By keeping retrieval targeted, more of the model's limited context window is available for planning, editing, and validation.

## What makes it different

- built for **small and local models**
- optimized for **context conservation**
- uses **dependency-aware code understanding**
- relies on **specialized tooling**, not just generic file reads
- helps both **local workflows** and **cost-sensitive API usage**

## Where it shines

- scoped bug fixes and targeted edits
- context-efficient coding loops on consumer hardware
- agent workflows where token cost matters
- projects that benefit from structural code navigation instead of brute-force reading

## Read less. Reason better. Use fewer tokens.

That is the core bet behind minicode: coding models perform better when you give them **less context, but better context**.
