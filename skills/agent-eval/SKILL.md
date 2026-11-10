---
name: agent-eval
description: Audit datasets, evaluate an agentic application or ML training pipeline, and prepare or run a bounded performance improvement loop in the current repository.
---

# Evaluate and improve the target repository

Use the user's request as the workflow arguments. The optional first word selects `auto`, `eval`, `dataset`, `prompt`, `tool`, `tool+prompt`, `agent`, or `train`; default to `auto`. A `run ...` request resumes a prepared plan through the selected vendor adapter.

Resolve this installed skill directory to its physical path first (follow any symlink). The package root is two directories above it. Read [the shared workflow](../../loop.md) and exactly one adapter:

- In Oh My Pi (`omp`), read [Pi-agent](../../vendors/pi-agent.md).
- In Codex, read [Codex](../../vendors/codex.md), including its ChatGPT website research requirement before selecting a candidate.

Resolve these references from the physical skill directory, never from the target repo or the lexical parent of a discovery symlink. The shared pstack skills are siblings of this directory. If the host or package path is unknown, resolve it before executing the loop; do not assume native autoresearch or computer-use tools exist.

Run against the current target repository. Preparation is the default. An explicit request to run experiments authorizes bounded iteration under `loop.md` and the selected adapter; loading the skill alone does not start a search.
