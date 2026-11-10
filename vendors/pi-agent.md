# Pi-agent vendor — Oh My Pi

This adapter preserves the existing Oh My Pi (OMP) integration and its 18.18.3 native autoresearch contract. Use it with the shared [loop.md](../loop.md). Plain Pi without OMP's native autoresearch is not a supported experiment runtime.

## Research and preparation

Research uncertainties using repo code, traces, contracts, version-matched official docs and upstream sources with available OMP tools. Record the evidence behind the next hypothesis. Keep private repo content and credentials out of external searches.

Inspect the installed OMP documentation. Verify `/autoresearch`, `init_experiment`, `run_experiment`, `log_experiment`, `update_notes`, the `bash autoresearch.sh` harness contract and session persistence. Use the installed native schemas. If unavailable, finish any runnable baseline and report the missing prerequisite.

Prepare in the clean isolated worktree required by `loop.md`. OMP requires a clean checkout to create a new autoresearch branch and may commit all pending harness setup during initialization. Keep only intended setup changes there; preserve unrelated user work and existing sessions.

## Activate and iterate

After smoke-testing the harness, return:

```text
/autoresearch use the prepared autoresearch.sh and eval-report.md; max_iterations=5
```

Substitute the actual report path and agreed finite cap. If experiments were already requested and native tools are active, continue without a second confirmation. If activation requires a user-entered command, report it as the remaining prerequisite.

1. Call `init_experiment` with `primary_metric`, `direction`, `scope_paths`, `off_limits`, `constraints`, and `max_iterations` from the prepared plan. Verify the setup is in the baseline, then persist the playbook with `update_notes`.
2. Research and choose one hypothesis, edit within scope, and use `run_experiment` to run the fixed harness with a bounded `timeout_seconds`.
3. Use `log_experiment` for baseline, candidate and failed runs. Use `checks_failed` for correctness failures and `crash` for infrastructure or training failures; never keep them. Keep changes only after the shared acceptance and regression checks pass. Update notes with hypotheses, evidence, outcomes and remaining budget.

`scope_paths` and `off_limits` record deviations rather than enforcing file access. Apply the shared scope checks and reject out-of-scope candidates. Preserve valuable checkpoints and logs outside paths native Git cleanup may remove.

OMP owns run history and artifacts outside the target repo. Use its native notes and state instead of a parallel `.auto/` layout or legacy `autoresearch.md`, `autoresearch.jsonl` or `autoresearch.config.json`. Do not migrate or overwrite old session files automatically. Do not reinitialize to bypass iteration or resource limits.

Stop with `/autoresearch off` at a shared stop condition. Report the baseline and best verified result, or the baseline if nothing improved.

## Native contract references

- [Harness setup](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/autoresearch/prompt-setup.md)
- [Experiment protocol](https://github.com/can1357/oh-my-pi/blob/main/packages/coding-agent/src/autoresearch/prompt.md)
