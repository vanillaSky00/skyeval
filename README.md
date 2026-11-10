# skyeval

A shared workflow for evaluating and improving an agentic application or ML training repository with **Pi-agent through [Oh My Pi (OMP)](https://github.com/can1357/oh-my-pi)** or **Codex**. Install the package for your vendor, open the target repo, then invoke the workflow. It audits data, establishes a baseline, diagnoses failures, and prepares or runs a bounded performance loop.

## Shared workflow, vendor-specific execution

| File | Responsibility |
|---|---|
| [loop.md](loop.md) | Canonical audit, benchmark, diagnosis, experiment and reporting workflow, with a Mermaid loop diagram |
| [skills/agent-eval/SKILL.md](skills/agent-eval/SKILL.md) | Shared entry point that loads the workflow and active vendor adapter |
| [skills/](skills/README.md) | Shared pstack research skills; one copy for both vendors |
| [vendors/pi-agent.md](vendors/pi-agent.md) | OMP native autoresearch tools, notes, artifacts and stop command |
| [vendors/codex.md](vendors/codex.md) | ChatGPT website research through computer use, local trials and persistent run history |

Both vendors load the shared `agent-eval` skill directly. OMP uses `/skill:agent-eval` and native `/autoresearch`; Codex uses `$agent-eval` and local shell/Git tools. Experiment execution depends on the vendor adapter.

## Install for Pi-agent / OMP

With [Oh My Pi installed](https://github.com/can1357/oh-my-pi#install) and a model configured:

```sh
cd /path/to/target-agentic-repo
omp plugin install /absolute/path/to/agentic-eval-tools
omp
```

The path points to this checkout. OMP links it into its user plugin directory, making skills available across repos. To install from Git after committing and pushing the package files:

```sh
omp plugin install github:vanillaSky00/skyeval
```

Restart OMP when upgrading from the former external-extension setup. For later skill edits, use `/reload-plugins`. Check `/skill:agent-eval` in completion, then prepare an evaluation:

```text
/skill:agent-eval
/skill:agent-eval eval inspect existing QA and establish a baseline
/skill:agent-eval dataset audit generated QA, generation instructions and critique decisions
/skill:agent-eval prompt improve source selection
/skill:agent-eval tool+prompt handle retrieval failures
/skill:agent-eval train minimize validation loss with a 10-minute per-trial and 60-minute total limit
```

To run a prepared session:

```text
/autoresearch use the prepared autoresearch.sh and eval-report.md; max_iterations=5
```

Use the actual report path and agreed cap. OMP activates `init_experiment`, `run_experiment`, `log_experiment` and `update_notes`. It runs `bash autoresearch.sh` for each trial and owns session notes, history and artifacts. Stop with `/autoresearch off`.

This preserves the existing Oh My Pi 18.18.3 autoresearch contract. Plain Pi without OMP's native autoresearch is not a supported experiment runtime.

## Install for Codex

With Node.js 18 or newer and Codex installed, run from this checkout:

```sh
npm run install:codex
cd /path/to/target-agentic-repo
codex
```

The installer links every shared skill into `~/.agents/skills`, including `agent-eval`. It installs no dependencies, changes no Codex configuration, and refuses to overwrite existing files, directories or other skill links. Re-running it is safe. Keep this checkout in place: the links point here, so edits apply to both vendors.

For a project-scoped installation, supply that project's skill discovery directory instead:

```sh
npm run install:codex -- /path/to/target-agentic-repo/.agents/skills
```

Open Codex in the target repo, use `/skills` or type `$` to find `agent-eval`, and invoke:

```text
$agent-eval eval inspect existing QA and establish a baseline
$agent-eval dataset audit generated QA and the critic
$agent-eval train minimize validation loss with a 10-minute per-trial and 60-minute total limit
$agent-eval run the prepared autoresearch.sh and eval-report.md; max_iterations=5
```

The modes and evaluation rules are the same as OMP. Preparation is the default; `run` resumes the prepared plan and its remaining budget. An explicit request to run experiments can prepare and continue in one invocation. Codex records local trial history in the repo's existing experiment log, or in `eval-report.md` when none exists, and keeps only measured improvements. To stop, interrupt the session or ask Codex to stop; resume from its recorded state without resetting counters. Do not run both vendors against the same active experiment worktree concurrently.

Codex discovers [local skills and symlinked skill folders](https://learn.chatgpt.com/docs/build-skills). If discovery looks stale, restart the session. This installer is for local checkouts; it does not publish an OpenAI plugin.

### ChatGPT website research

Before selecting the next experiment, Codex uses a configured computer/browser-use tool to operate a signed-in **[chatgpt.com](https://chatgpt.com)** session. It uses ChatGPT **Search** for focused questions and **Deep Research** for broader comparisons or synthesis within the remaining budget. It brings the latest sanitized failure and measured result into the research question, verifies material source claims, and records the conversation URL, mode, findings, sources and chosen hypothesis.

You must provide a computer/browser-use integration and a ChatGPT account with access to the selected research mode. See the [official computer and browser setup guidance](https://developers.openai.com/training/walkthroughs/using-your-computer-and-browser) for supported app integrations; a plain Codex CLI session may need its own browser tool. Installing this repo or enabling CLI web search does not supply website control, login or Deep Research access.

If those prerequisites are missing, Codex can inspect the repo and establish a budgeted local baseline, then saves the research question and reports what is missing before choosing a candidate. It does not silently substitute API search or claim website research occurred. Private code, credentials and raw traces stay out of research prompts unless explicitly authorized; held-out cases and labels stay out of candidate research. See the [Codex adapter](vendors/codex.md) for the full procedure.

## What the loop measures

1. Inspect the target repo's instructions, entry point or trainer, data generation, critique stages, evals, traces, prompts and tools.
2. Reuse its runner, datasets, graders and code helpers. Add only missing coverage; keep code small by removing proven-unused code and consolidating repetition within scope, preserving behavior and validation.
3. Independently audit data and references, verify splits and metrics, test the grader, and measure the unchanged system within its resource budget.
4. Diagnose whether the failure comes from data, prompts, tools, orchestration or training before choosing one edit.
5. Prepare and smoke-test `autoresearch.sh` plus an evaluation report with the metric, scope, acceptance rule, checks, budgets and finite iteration cap (five candidates by default).
6. When requested, research the next hypothesis through the vendor adapter, change one scoped candidate, measure it, record the result, and keep or discard it. Stop at the target, cap, resource limit, cancellation or missing prerequisite.

Modifications run on a dedicated task branch in a clean isolated worktree, preserving unrelated user work. Commit verified setup and accepted candidates separately, with messages describing the change, reason and check results; record the branch and commit hashes in the report. Freeze the harness, grader, datasets and scoring settings while optimizing the application. A declared edit scope does not enforce filesystem access; the workflow checks scope and rejects out-of-scope changes. Required correctness and regression checks must pass before emitting a primary metric. If no candidate earns an improvement, retain the verified baseline.

Existing self-critique does not make generated data trustworthy. Audit source evidence, answerability, labels, duplicates, leakage and coverage; probe whether the critic accepts wrong or unsupported answers. `dataset` mode keeps the application fixed while repairing and versioning generation, critique, references or graders. Independently recheck a small replacement slice before wider generation and rerun comparable baselines after measurement changes. Reports disclose sampling and evidence limits.

`train` reuses the target repo's framework and permits scoped model, hyperparameter, preprocessing or training-code changes. Require finite per-trial and total resource limits, independent train/validation/test splits, and training-only fitting of learned preprocessing. Record initialization, seeds, hardware and runtime settings, verify each trial's fresh checkpoint, and preserve baseline/best artifacts across reverts. Tune on validation data; evaluate the frozen winner on test data only at the end. See [data leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html) and [PyTorch's reproducibility notes](https://docs.pytorch.org/docs/stable/notes/randomness.html).

For agentic tasks, choose relevant benchmark patterns and a domain benchmark where appropriate. Examples include [GAIA](https://huggingface.co/datasets/gaia-benchmark/GAIA), [FinanceBench](https://github.com/patronus-ai/financebench), Terminal-Bench verifier controls, τ-bench stateful outcomes and [Mind2Web 2](https://osu-nlp-group.github.io/Mind2Web-2/) correctness and attribution. Link each scored response and verdict to independently verified answer evidence. Report upstream-compatible benchmark runs separately from local adaptations and private QA; a general benchmark alone does not prove domain correctness. Full rules and references live in [loop.md](loop.md).

The [pstack skills](skills/README.md) include `how`, `why` and `benchmark-checklist`: invoke them as `/skill:how` in OMP or `$how` in Codex. They contain Cursor-specific tool names, models and automation instructions; adapt references to available capabilities and retain this loop's boundaries and budgets. Reading them does not activate setup, shipping or autopilot workflows.

Actual evaluation requires a runnable target, usable evidence or fixtures and access to its dependencies. Training also needs compute and a resource budget. The package adds no training framework, scheduler, cloud provisioning or browser runtime. Existing target-repo experiment data is not automatically migrated.

## Check the installer

```sh
npm test
```

The dependency-free tests cover skill links, shared workflow reference resolution, repeat installs, default discovery, and refusal to overwrite conflicting files, directories or broken links. They do not run OMP, Codex experiments or signed-in ChatGPT research.
