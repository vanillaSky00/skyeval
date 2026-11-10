# Shared skills

[agent-eval](agent-eval/SKILL.md) is this repo's shared workflow entry point. It loads the canonical [loop.md](../loop.md) and the active Pi-agent or Codex adapter. The remaining directories are the vendored pstack skills described below.

## Pstack skills

These 58 skill directories come from [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/6b0300214a09fd6029cfb7077043125758cd1fd2/pstack), version `0.15.36`, revision `6b0300214a09fd6029cfb7077043125758cd1fd2`. The [MIT license](LICENSE), copyright Lauren Tan, is retained.

Each skill, including its scripts and reference files, has one canonical location here. OMP discovers these directories directly when this package is installed. The Codex installer links the same directories into its skill discovery path. The `poteto-help` links to upstream setup and guide documents were changed to pinned GitHub URLs after removing the unused Cursor plugin packaging, agents, automations, assets and guide files.

The pstack skills were written for Cursor. Use their research material with the active vendor's available tools and the target repo's instructions; report unsupported steps rather than assuming Cursor tool APIs, model aliases or companion plugins exist. The shared `agent-eval` workflow uses `how`, `why` and `benchmark-checklist` as relevant references and retains its own dataset validation, edit boundaries, acceptance rules and finite iteration cap.

```text
/skill:how explain the agent entry point and retrieval flow
/skill:why investigate the evidence behind generation and critique rules
/skill:benchmark-checklist review the measured latency improvement
```

In Codex, use `$how`, `$why` and `$benchmark-checklist` with the same requests. Reading a skill does not install its script dependencies or activate setup, shipping or autopilot workflows. The remaining pstack skills are available on demand. Experiment execution belongs to the active vendor adapter, not pstack.
