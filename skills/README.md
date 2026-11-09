# Pstack skills

These 58 skill directories come from [cursor/plugins/pstack](https://github.com/cursor/plugins/tree/6b0300214a09fd6029cfb7077043125758cd1fd2/pstack), version `0.15.36`, revision `6b0300214a09fd6029cfb7077043125758cd1fd2`. The [MIT license](LICENSE), copyright Lauren Tan, is retained.

Each skill, including its scripts and reference files, has one canonical location here. OMP discovers these directories directly when this package is installed. The `poteto-help` links to upstream setup and guide documents were changed to pinned GitHub URLs after removing the unused Cursor plugin packaging, agents, automations, assets and guide files.

The skills were written for Cursor. Use their research material with OMP's available tools and the target repo's instructions; report unsupported steps rather than assuming Cursor tool APIs, model aliases or companion plugins exist. `/agent-eval` uses `how`, `why` and `benchmark-checklist` as relevant references and retains its own dataset validation, edit boundaries, acceptance rules and finite iteration cap.

```text
/skill:how explain the agent entry point and retrieval flow
/skill:why investigate the evidence behind generation and critique rules
/skill:benchmark-checklist review the measured latency improvement
```

Reading a skill does not install its script dependencies or activate setup, shipping or autopilot workflows. The remaining pstack skills are available on demand; the experiment engine comes from OMP itself.
