# skyeval

A reusable prompt workflow for evaluating and improving an agentic or ML training repository with [Oh My Pi (OMP)](https://github.com/can1357/oh-my-pi) and its built-in autoresearch. Install it, open the target repo in `omp`, then invoke `/agent-eval`. OMP researches that repo, audits its datasets and generation workflow, evaluates outputs, diagnoses failures, and prepares a measured improvement loop.

This package contains [one workflow command](commands/agent-eval.md) and [pstack skills](skills/README.md). OMP supplies the coding agent and experiment engine. The target repo supplies the application or trainer, data and dependencies. Each command and skill lives in one place; there are no discovery symlinks or bundled runtime extensions.

With [Oh My Pi installed](https://github.com/can1357/oh-my-pi#install) and a model configured, run:

```sh
cd /path/to/target-agentic-repo
omp plugin install /absolute/path/to/agentic-eval-tools
omp
```

The local path points to your checkout of this repo. OMP links the package into its user plugin directory, so the workflow is available across repos and runs against the current working directory. To install from Git instead, after the package files are committed and pushed:

```sh
omp plugin install github:vanillaSky00/skyeval
```

Restart `omp` once when upgrading from the former external-extension setup so its loaded adapter is removed. For subsequent command and skill edits, `/reload-plugins` refreshes discovery. Check that `/agent-eval` appears in completion, then use:

```text
/agent-eval
/agent-eval eval inspect the existing QA and establish a baseline
/agent-eval dataset audit generated QA, generation instructions and critique decisions
/agent-eval eval benchmark domain responses and verify answer references
/agent-eval prompt improve source selection
/agent-eval tool+prompt handle retrieval failures
/agent-eval train minimize validation loss with a 10-minute limit per trial and a 60-minute total limit
```

The package also exposes pstack skills through OMP, such as `/skill:how`, `/skill:why` and `/skill:benchmark-checklist`. Use them for code exploration, evidence-backed rationale and performance measurement review. `/agent-eval` can read the relevant skills as research references. Pstack contains Cursor-specific tool names, model choices and automation workflows; adapt these to available OMP capabilities and keep the eval scope and iteration cap. See [source revision, license and compatibility notes](skills/README.md).

The workflow adapts to the target repo:

1. Inspect its instructions, agent entry point or trainer, evals, data generators, critique stages, traces, prompts and tools.
2. Reuse its runner, datasets and graders; build only missing coverage in its existing conventions.
3. Independently audit existing or generated data and its generation/critique instructions. Verify references, splits and metrics, then run the unchanged system within its resource budget to establish a baseline.
4. Diagnose whether the failure comes from the dataset, prompt, tool, orchestration or training before choosing an edit.
5. Prepare `autoresearch.sh` with the measurement and required checks, plus an evaluation report containing the experiment plan. Smoke-test the harness before reporting readiness.

The default command prepares the experiment. To run a prepared session:

```text
/autoresearch use the prepared autoresearch.sh and eval-report.md; max_iterations=5
```

Use the actual report path returned by `/agent-eval` if the repo has an existing report convention. Preparation uses an isolated `autoresearch/<goal>` branch or worktree so native initialization can commit the harness setup without including unrelated user changes. The native command activates `init_experiment`, `run_experiment`, `log_experiment` and `update_notes`. The workflow initializes with the declared metric, scope and a finite `max_iterations`, defaulting to five, and stores the playbook through `update_notes`.

OMP runs `bash autoresearch.sh` for every trial and manages notes, run history and artifacts in its own storage. Required correctness and regression checks run in the harness before a primary metric is emitted. Stop the loop with `/autoresearch off`.

Existing self-critique does not make generated data trustworthy. OMP checks source evidence, answerability, labels, duplicates, leakage and coverage, and probes whether the critic accepts wrong or unsupported answers. It can repair generation instructions or the workflow, generate a small replacement slice, and independently recheck it. Audit reports state what was checked and any sampling limits.

`dataset` keeps the evaluated application fixed while generation, critique, references or graders are repaired and versioned. Application optimization keeps the eval fixed so improvements can be compared fairly. The prompt requires isolated git state before OMP auto-commits or reverts candidate changes. Native scope settings record deviations; they do not enforce file access. The workflow requires scope checks and rejects out-of-scope candidates. If no candidate meets the declared improvement and regression checks, the baseline remains the result.

`train` applies the same loop to automatic ML training or fine-tuning: audit data and splits, run a budgeted baseline, change one training hypothesis, retrain, and compare validation results. It reuses the repo's trainer and permits scoped model, hyperparameter, preprocessing or training-code changes. Training, validation and test data remain separate; learned preprocessing fits training data only. See [scikit-learn's leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html).

Training experiments require finite per-trial and total resource limits as well as the iteration cap. The loop records initialization, seeds, hardware and runtime settings, verifies each trial's fresh checkpoint, and preserves the baseline and best artifacts across code reverts. It tunes on validation data and reserves test evaluation for the frozen winner. Seed control helps comparisons but cannot guarantee reproducibility across all platforms or releases; see [PyTorch's reproducibility notes](https://docs.pytorch.org/docs/stable/notes/randomness.html). No training framework, scheduler or cloud provisioning is added by this package.

For domain tasks, OMP selects relevant common agent benchmarks and an appropriate domain benchmark, then checks actual responses against independently verified references. Examples include [GAIA](https://huggingface.co/datasets/gaia-benchmark/GAIA) for general assistants and [FinanceBench](https://github.com/patronus-ai/financebench) for financial document QA. The workflow also draws on Terminal-Bench for verifier controls, τ-bench for stateful outcomes, and [Mind2Web 2](https://osu-nlp-group.github.io/Mind2Web-2/) for correctness and source attribution. Benchmark fit, official references and limitations must be reported; a common benchmark alone cannot prove domain correctness.

Reports link each scored case's response and verdict to a verified reference answer or outcome and its source evidence. Public benchmark results use compatible upstream tasks and official evaluation procedures and are reported separately from local adaptations and private QA. See the [command and its references](commands/agent-eval.md) for the full workflow.

The workflow can adapt to different agentic and ML repos, but actual evaluation requires a runnable entry point, usable evidence or fixtures, and access to its dependencies. Training also requires suitable compute and a resource budget. OMP should report missing prerequisites instead of inventing a baseline or score.

This workflow follows Oh My Pi 18.18.3's native autoresearch contract. The package is Markdown and skills only; it has no application dependencies, adapter or runtime test suite. Keep existing target-repo experiment data intact when upgrading; the workflow prepares native sessions rather than automatically migrating old session files.
