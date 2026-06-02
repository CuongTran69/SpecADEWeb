# OpenSpec Friendly Kit Changelog

## [2026-05-31] - Add ROOT-CAUSE COMPLETION critical rule to all edit/plan/review surfaces


### FILES MODIFIED
- `subagents/osf-apply.md` — block after `MODE: IMPLEMENTATION`, before SCOPE BOUNDARIES (implementation tail)
- `commands/chore.md` — block after Scope Discipline (implementation tail)
- `commands/ui.md` — block after Scope Discipline (implementation tail)
- `commands/explore.md` — block after MODE BOUNDARY RESET, before The Stance (planning tail) — covers feat/fix/refactor/perf/docs/test/ci/docker/setup transitively
- `commands/proposal.md` — block after intro, before Phase 0 (planning tail)
- `commands/clean-room.md` — block after Scope Discipline (planning tail)
- `subagents/osf-clean-room.md` — block after Scope Discipline (planning tail)
- `commands/review.md` — block after intro + matching guardrail bullet (review tail)
- `subagents/osf-verify.md` — block after SCOPE BOUNDARIES (review tail)
- `commands/discuss.md` — block after stance intro, before DETECT MODE (plan-challenge tail)
- `commands/apply.md` — verbatim briefing bullet group beside SCOPE DISCIPLINE (implementation)
- `commands/verify.md` — verbatim briefing bullet group beside SCOPE DISCIPLINE (review)
- `commands/autopilot.md` — block after SCOPE DISCIPLINE, before IDENTITY GATE + guardrail bullet (orchestrator)


### CHANGES
- Added a `ROOT-CAUSE COMPLETION (CRITICAL — cannot be bypassed)` rule to every surface that edits code, plans, or reviews. The rule enforces: fix the root cause not the symptom; no workarounds, partial fixes, stubs, or silent TODOs; never leave a task half-done to look finished; if the proper solution is blocked, STOP and surface it rather than taking a shortcut.
- Shared spine wording is identical across all surfaces. A single surface-fitted tail line is appended per category:
  - Implementation (osf-apply, chore, ui, apply, autopilot): don't mark a task complete while a workaround stands in for the real fix.
  - Planning (explore, proposal, clean-room, osf-clean-room): label any partial/staged measure as a conscious tradeoff with limits; never present a workaround as the complete plan.
  - Review (review, osf-verify, verify, discuss): flag superficial fixes/workarounds/symptom-patches/partials as findings — CRITICAL when they mask a real defect; never pass symptom-patches.
- Placement is consistent with the kit's existing top-level CRITICAL gates (SCOPE BOUNDARIES, IDENTITY GATE, MODE: IMPLEMENTATION) so the rule is active before the first tool call.
- For the bullet-style briefing wrappers (apply.md, verify.md), the rule is added as a "include verbatim in the subagent brief" bullet group matching the existing SCOPE DISCIPLINE format, so it reaches osf-apply/osf-verify even on direct `/apply` and `/verify` invocations.
- autopilot.md also carries the rule into every subagent brief and gained a guardrail bullet referencing it.


### FILES NOT MODIFIED (and why)
- `commands/feat.md`, `fix.md`, `refactor.md`, `perf.md`, `docs.md`, `test.md`, `ci.md`, `docker.md`, `setup.md` — thin planning commands that load `explore.md`; they inherit the rule transitively. Same reasoning as the 2026-05-17 scope-discipline entry (planners inherit via explore).
- `commands/archive.md`, `subagents/osf-archive.md` — archival + spec-sync, not code/plan/review surfaces.
- `commands/analyze.md`, `subagents/osf-analyze.md` — read-only structural analysis, no editing/planning/reviewing.
- `commands/uiux-design.md`, `subagents/osf-uiux-designer.md` — design analysis, report-only.
- `commands/explain.md`, `research.md`, `git.md`, `browser.md`, `browser-automation.md`, `osf.md` (dispatcher), `subagents/osf-researcher.md`, `osf-browser-automation.md` — not edit/plan/review surfaces.


### DESIGN DECISIONS
- Followed the 2026-05-17 scope-discipline pattern: inline the critical rule into each self-contained surface, accept duplication as a deliberate trade-off, and rely on the two inheritance hubs (`explore.md` for planning commands, `osf-apply.md` for delegated implementation) so the rule reaches all 30 files without editing every one. 13 sites edited; the 9 thin planners inherit via explore.
- Identical spine + one surface-fitted tail keeps the constraint recognizable everywhere while phrasing it correctly for each role (implementer "don't mark complete", planner "label tradeoffs", reviewer "flag as finding").
- "Cannot be bypassed" framing and placement next to existing CRITICAL gates signal the same enforcement weight as SCOPE BOUNDARIES — the rule is a hard constraint, not advice.
- Briefing wrappers (apply/verify) embed the rule as verbatim brief content rather than as their own behavior, because their job is to construct the subagent's prompt — the subagent (osf-apply/osf-verify) is where the rule must actually fire, and those subagents now carry it both inline and via the brief.
- `discuss.md` (review of plans) frames the rule as a blind-spot detector that respects the existing DEBATE PROTOCOL: an explicitly accepted, time-boxed tradeoff is not flagged, matching how discuss already concedes to user-cited constraints.

## [2026-05-28] - osf-browser-automation: add Page Reading Strategy for heavy pages


### FILES MODIFIED
- `subagents/osf-browser-automation.md` — added Page Reading Strategy section; updated snapshotForAI docs with WARNING; updated Interaction Rules and Workflow to reference new strategy


### CHANGES
- Added WARNING to snapshotForAI docs: it always returns full page regardless of locator scope, produces 40-80KB+ on heavy apps, gets truncated
- New "Page Reading Strategy" section with 3 tiers:
  - Tier 1 (default): targeted `page.evaluate()` extractors — pull only what the task needs (messages, form fields, buttons). ~500-2000 chars vs 40-80KB.
  - Tier 2: landmark scan — get top-level containers (role, aria-label, childCount) to identify the right area, then targeted extract
  - Tier 3 (last resort): full `snapshotForAI()` — only for simple pages or when tiers 1-2 fail
- Included ready-to-use extractor examples for: chat/messaging, forms, navigation
- Playbook integration: save working extractors to playbook so they're reused next session
- Interaction Rule 2 updated: "Use targeted extract or landmark scan" replaces "Use snapshotForAI() first"
- Workflow step 3 updated: "Read page using Page Reading Strategy" replaces "Snapshot"


### DESIGN DECISIONS
- Evidence from live testing on Microsoft Teams: `page.snapshotForAI()` = 76KB, `locator.snapshotForAI()` = still 76KB (does NOT scope), custom `evaluate()` extract = 789 chars. 98% reduction with same actionable info.
- `snapshotForAI()` scoping is a dev-browser/Playwright limitation — locator-scoped snapshots return the full page tree. No workaround exists at the tool level, so the strategy must live in the prompt.
- Tier 1 examples are generic enough to work across similar apps (any chat app, any form) but specific enough that the agent doesn't need to invent the pattern from scratch.
- Playbook integration means the agent saves working extractors per-domain — next session it skips tier 2 entirely and goes straight to the proven extractor.

## [2026-05-28] - osf-browser-automation: replace FIFO cap with intelligent compact


### FILES MODIFIED
- `subagents/osf-browser-automation.md` — replaced "max 20 entries, FIFO eviction" with MERGE/REPLACE/PRUNE compact instructions; ~30 line target


### CHANGES
- Removed hardcoded 20-entry cap and FIFO eviction rule
- Added Compact subsection: agent compacts playbook when it exceeds ~30 lines, using MERGE/REPLACE/PRUNE vocabulary
- MERGE: combine entries about same page/flow into one
- REPLACE: remove entries whose workaround became site default
- PRUNE: remove entries contradicted by site redesign
- Generalization instruction: repeated patterns across pages become one general rule
- Target: keep playbook under ~30 lines after compact


### DESIGN DECISIONS
- FIFO is blind eviction — oldest entry isn't necessarily least valuable. A login flow workaround from 3 months ago can be more critical than 19 recent minor quirks.
- Agent-driven compact produces higher quality knowledge: it reads, evaluates, and consolidates rather than blindly dropping. Same pattern as UI DNA in this kit (MERGE/REPLACE/ADD/PRUNE).
- ~30 lines (not entries) as the threshold because line count is what actually determines context cost. A 5-entry file with verbose entries costs more than a 10-entry file with tight ones.
- Reused MERGE/REPLACE/PRUNE vocabulary from ui.md so the agent already has pattern familiarity.

## [2026-05-28] - osf-browser-automation: add site playbook for cross-session learning


### FILES MODIFIED
- `subagents/osf-browser-automation.md` — added Site Playbook section with read/write gates; updated Workflow to include playbook steps


### CHANGES
- New "Site Playbook" section: persistent per-domain files at `~/.dev-browser/playbooks/<domain>.md` that store learned workarounds
- Mandatory read gate: agent MUST read playbook before first action on any domain — not optional
- Write gate: agent appends entry only after a workaround is verified working (not on failure, only on resolution)
- Entry format: Failed / Works / Why / Date — structured enough to be actionable, brief enough to scan
- Cap: max 20 entries per domain, FIFO eviction
- Workflow updated: step 1 = read playbook, step 7 = write playbook if workaround discovered


### DESIGN DECISIONS
- Mandatory read gate (not suggestion): without a gate, agent will skip reading the file — same failure mode as optional CLAUDE.md reads. Gate ensures knowledge is applied.
- Write only on verified success: prevents polluting playbook with failed attempts that don't help. Only proven workarounds get persisted.
- Per-domain files (not one global file): keeps each file small and relevant. Agent only loads knowledge for the site it's working on.
- FIFO cap at 20: prevents unbounded growth. Oldest entries are least likely to be relevant (sites change). 20 is enough to cover a site's major quirks without overloading context.
- `~/.dev-browser/playbooks/` location: co-located with dev-browser's own tmp dir, doesn't pollute project directories.

## [2026-05-28] - Split browser-automation into thin command + subagent


### FILES CREATED
- `subagents/osf-browser-automation.md` — worker subagent with dev-browser guide, API reference, execution logic, and guardrails


### FILES MODIFIED
- `commands/browser-automation.md` — rewritten as thin wrapper that gathers context and delegates to osf-browser-automation


### CHANGES
- Moved all dev-browser API reference, workflow logic, interaction rules, and guardrails into the subagent
- Command is now ~30 lines: gather task/URL/data/flags → launch Agent → relay result or handle blockers
- Subagent runs in isolation with tools: Bash, Read, Glob, Grep
- Subagent includes SUBAGENT EXECUTION GATE (no Skill tool, no routing)
- Destructive-action confirmation flows back through the caller (subagent reports what it wants to submit, caller asks user, re-launches with answer)


### DESIGN DECISIONS
- Context savings: the ~160-line dev-browser guide only loads into the subagent's context, not the main conversation. Main conversation stays light.
- Same pattern as browser.md (testing) which is a single command — but browser-automation benefits more from subagent isolation because automation tasks can be long-running and the API reference is pure reference material that doesn't need orchestrator-level visibility.
- Blocker re-launch pattern: when subagent hits CAPTCHA/2FA/confirmation, it returns to caller rather than blocking indefinitely. Caller asks user, then re-launches with new info. Matches osf-apply's pattern of returning control on blockers.

## [2026-05-27] - Add browser-automation command for task execution


### FILES CREATED
- `commands/browser-automation.md` — browser automation command for completing web tasks on behalf of the user


### CHANGES
- New `/osf browser-automation` command: drives dev-browser to complete user-requested web tasks (fill forms, scrape data, navigate workflows, interact with web apps)
- Cloned from `browser.md` structure (same dev-browser setup, API guide, CLI usage) but stripped all testing/diagnosis DNA
- Single workflow: UNDERSTAND → EXECUTE → CONFIRM (no modes, no routing to other commands)
- Removed: Mode A (REPRODUCE), Mode B (EXPLORE), Mode C (QA TEST), VERIFY post-fix, codebase mapping, network/WebSocket monitoring, evidence blocks, correlation maps, causal chains, bug reports, exploration reports, QA reports
- Removed: routing to `/osf apply`, `/osf feat`, `/osf fix`, `/osf verify`
- Removed: "evidence at every step", "one script per logical action", "realistic pacing" interaction rules
- Added: destructive-action confirmation gate (show what will be submitted, wait for user OK)
- Added: guardrails for fabricated data, unexpected state, credentials
- Stance: task-focused doer, not evidence-based diagnostician


### DESIGN DECISIONS
- Heavy trim over selective edit: browser.md is 900+ lines of testing infrastructure. Copying and trimming would leave testing DNA scattered throughout. Wrote fresh with only the pieces automation needs.
- No codebase mapping: automation doesn't need to trace "which component renders this button" — it just clicks the button. Removed entirely.
- No network monitoring: automation verifies success by checking page state after actions, not by intercepting HTTP responses. If a user needs to verify an API call went through, they can check the resulting page state.
- Multi-action scripts allowed: browser.md enforced "one script per logical action" for evidence clarity. Automation benefits from chaining steps in one script for efficiency.
- Destructive-action gate is the key safety mechanism: replaces browser.md's "never modify code" and "report-only" rules with a practical "confirm before irreversible external actions" pattern.

## [2026-05-27] - Rename plan-review → discuss, enforce conversation-only mode


### FILES CREATED
- `commands/discuss.md` — replaces plan-review.md with stronger no-edit enforcement


### FILES DELETED
- `commands/plan-review.md` — replaced by discuss.md


### FILES MODIFIED
- `commands/osf.md` — updated skill list and intent mapping: `plan-review` → `discuss`


### CHANGES
- Renamed command from `plan-review` to `discuss` for shorter, more natural invocation
- Added "CONVERSATION MODE — NO FILE CHANGES" block at the very top of the prompt body, before any other instruction. Explicitly stops Edit/Write/Bash file modifications and tells the agent its prior editing work is paused.
- Updated GUARDRAILS to reinforce the same rule with tool-specific language ("Do not use Edit, Write, or Bash to modify any file")
- Added "discuss" as an intent keyword in osf.md dispatcher


### DESIGN DECISIONS
- Top-of-prompt placement for the no-edit block because the agent's momentum from prior editing is the failure mode — it needs to hit the brake before reading anything else
- "Your work is paused. Resume only when the user explicitly asks" addresses the specific scenario where agent was mid-implementation and gets pulled into /discuss — without this, agent treats the discussion as a brief interruption and resumes editing afterward
- Removed the ★ marker from STUCK mode recommendation to keep tone neutral

## [2026-05-25] - Add /plan-review command for evidence-backed plan auditing


### FILES CREATED
- `commands/plan-review.md` — command that challenges plans with evidence-backed arguments, finds blind spots, and helps unstick blocked planning


### FILES MODIFIED
- `commands/osf.md` — added `plan-review` to available skills list and intent mapping


### CHANGES
- New `/osf plan-review` command with two modes: STUCK (brainstorm directions when planning is blocked) and CHALLENGE (audit a ready plan for blind spots before implementing)
- Opinionated stance: every challenge must cite codebase reality, real-world precedent, or established principle — no vague "maybe consider" suggestions
- Autonomous context gathering: reads codebase, searches web for precedents, checks OpenSpec artifacts without asking permission
- Debate protocol: respects user authority when they bring customer requirements or compelling evidence, pivots to "how to make it work best" instead of re-litigating
- Output: severity-classified blind spots (blocker / worth-discussing / minor) with concrete suggestions


### DESIGN DECISIONS
- Command (not subagent) because it needs full conversation context to understand the plan being reviewed — same reasoning as the proposal and review conversions
- Separate from explore.md's built-in zero-fog checks because those are self-checks by the same agent. plan-review brings genuinely fresh scrutiny with an adversarial-but-respectful stance.
- Evidence standard is strict by design: prevents the command from producing generic "have you thought about X?" noise. If it can't back a challenge, it doesn't raise it.
- Debate protocol prevents the command from being annoying: push back once with evidence, then accept the user's decision and help make it succeed.

## [2026-05-22] - Inline implementation: opt-in path that bypasses osf-apply


### FILES MODIFIED
- `commands/explore.md` — added option E (Inline implementation — opt-in only) to the "Routing the user's choice" list; added "Inline implementation (opt-in — NEVER default)" subsection right after it; updated the "Don't implement" guardrail to acknowledge the opt-in exception
- `commands/apply.md` — added "INLINE MODE (opt-in — never default)" block so direct `/apply` invocations also honor the opt-in


### CHANGES
- New routing branch E in explore.md: after plan/brainstorm is locked, the orchestrator can implement directly in the main conversation (Edit/Write/Read) instead of delegating to the osf-apply subagent — letting the user watch and interject turn-by-turn
- Strictly opt-in: orchestrator only picks E when the user has explicitly requested inline / direct / no-subagent implementation via trigger phrases ("inline", "no subagent", "implement here", "watch progress", "don't delegate", etc.)
- The visible A/B/C/D path menu shown to the user is unchanged — E is an internal routing branch, not a peer option in the menu, so it cannot be picked by default selection
- Trigger-phrase list kept English-only; the prompt instructs the model to recognize the same intent in any language the user writes in, without enumerating non-English phrases inside the prompt itself
- Default routing is unchanged — silence means delegate to osf-apply (A/B) or autopilot (C)
- Inline path inherits SCOPE DISCIPLINE rules from apply.md (stay within named files, no destructive action on unowned code, report don't auto-fix outside scope, surface deletions)
- Spec-first + inline still runs the proposal skill first; only the implementation phase goes inline
- After-implementation flow (verify/archive) is unchanged


### DESIGN DECISIONS
- E added to the routing list but NOT to the user-facing path-question menu (A/B/C/D). Reason: the user-facing menu shapes the default choice surface; making inline a peer option there would invite the model to pick it when the user gave no signal. Keeping it as an internal routing branch enforces the never-default constraint at the prompt level.
- Autopilot (C) remains subagent-driven; inline does not chain into autopilot because autopilot's value is in delegating itself.
- Trigger phrases listed in English only per user instruction. Cross-language recognition is delegated to the model via a single generic instruction ("recognize the same intent in any language") instead of hardcoding non-English phrases, which avoids fragile per-language enumeration and keeps the prompt readable in one language.
- `chore.md`, `ui.md` not touched — those commands already self-execute without osf-apply, so the opt-in does not apply.
- `osf-apply` subagent itself is unchanged — only the orchestrator routing changes.

## [2026-05-22] - `/perf`: require named algorithms and rejection-table for optimizations


### FILES MODIFIED
- `commands/perf.md` — replaced generic `Compare options` block with mandatory algorithm-naming + rejection-table + workload-tied summary; added Zero-Fog checklist item


### CHANGES
- `/perf` no longer accepts vague optimization suggestions like "optimize the loop" or "make it faster"
- Optimizer must name the concrete algorithm, data structure, or technique (with examples covering hash-join, B-tree, LRU+TTL, SIMD, reservoir sampling so the model has shape references)
- When method is unfamiliar, optimizer must delegate to osf-researcher for web research on established methods/benchmarks and cite the source
- Comparison table with ≥2 rejected alternatives is mandatory, each with explicit rejection reason; baseline (current behavior) listed as one of the rejected rows
- One-paragraph summary required, tying the choice to workload evidence (data shape, N, hot path frequency, memory budget, read/write ratio) — not generic theory
- Zero-Fog Checklist gains an item enforcing the named-algorithm + table + rationale gate


### DESIGN DECISIONS
- Examples list inside the rule is concrete and varied so the model has clear shape patterns to imitate without overfitting to one domain
- Baseline included in the table because "do nothing" is always a valid option and naming it as rejected forces the optimizer to articulate why the current code fails
- Workload-tied summary required because generic complexity arguments often pick the wrong winner at real N; the evidence-from-code clause closes that gap

## [2026-05-21] - `/chore`: augment with `ui` skill on UI/UX requests


### FILES MODIFIED
- `commands/chore.md` — new `UI/UX Augmentation Gate` section between Scope Discipline and Workflow


### CHANGES
- `/chore` now detects UI/UX requests (fix, build, refine, optimize visuals/layout/styling/motion/a11y/polish) and loads the `ui` skill via the Skill tool BEFORE running the chore workflow — the two combine rather than replace each other
- `ui` provides DNA discovery, design lenses, and UI-specific scope rules; `/chore` keeps providing the mini-plan + impact map + direct-execution shape
- Routing signals enumerated so the gate triggers reliably on common phrasings (UI, UX, design, styling, polish, redesign, components, screens, design tokens)


### DESIGN DECISIONS
- Augmentation (not replacement) because `ui` and `/chore` solve different layers: `ui` enforces design DNA and UX lenses, `/chore` enforces parallel-session scope safety and the brief-then-execute cadence; the user needs both for UI maintenance work
- Gate placed before Workflow so `ui` guidance is active by the time the chore mini-plan is drafted

## [2026-05-21] - `osf-apply`: add SCOPE SIZE GATE for refusing oversized assignments


### FILES MODIFIED
- `subagents/osf-apply.md` — new `SCOPE SIZE GATE` section between SCOPE BOUNDARIES and File Editing Discipline; Step 5 references the gate before the implementation loop; Guardrails gains a "check scope size first" bullet


### CHANGES
- osf-apply can now refuse work that's too broad or complex for a single subagent run and ask the orchestrator to split it
- Refusal criteria target the real failure modes: unrelated areas in one run, cross-stack reasoning (backend + frontend + infra + docs), multiple open design decisions, or a single task large enough to warrant its own run
- Explicit non-refusal case included so the gate does not over-fire on mechanical bulk work (rename propagation, repeated small edits)
- Refusal output is a structured contract: reason, suggested batches labeled with dependencies, and an execution hint telling the orchestrator to dispatch independent batches in PARALLEL and dependent batches SEQUENTIALLY with prior results forwarded
- Each suggested batch must be self-contained (own files, tasks, acceptance criteria) so the orchestrator can re-dispatch without re-deriving context


### DESIGN DECISIONS
- Gate runs after context is read (Step 5 end) rather than at the very top, because the subagent needs the task list and contextFiles to judge scope honestly; refusing blindly from the prompt alone would either over-fire or miss real blowups
- Refusal contract explicitly names PARALLEL vs SEQUENTIAL because that distinction is what the orchestrator actually needs to decide; without it the split is just a list

## [2026-05-20] - `/ui`: fix DNA overfit, capture multi-round fixes


### FILES MODIFIED
- `commands/ui.md` — Bootstrap DNA rewritten with anti-overfit rules; Import DNA inherits them; DNA Capture adds multi-round-fix trigger


### CHANGES
- Bootstrap DNA was instructing the model to copy real code values, which read as "paste CSS class names verbatim". Replaced with explicit anti-overfit rules: never paste class names / selectors / file names / feature-specific tokens; translate them into principles a designer would recognize; patterns confined to one screen are not DNA
- Concrete wrong/right examples included so the model has a clear contrast (e.g. `btn-primary-glow-lg` → "primary actions use elevated visual weight via shadow + larger size")
- Import DNA section now inherits the anti-overfit rules alongside its existing anonymity requirement
- DNA Capture gains a new trigger: a fix that needed multiple rounds is itself a signal — capture the rule that would have caught it on round one


### DESIGN DECISIONS
- Anti-overfit is enforced at the wording level (concrete examples) rather than as an abstract instruction, because abstract "be generic" guidance failed in practice
- Multi-round fixes are treated as first-class signals because repeated user corrections at the same surface are the strongest evidence a rule is missing from the DNA

## [2026-05-20] - `/ui`: import DNA from external repo with anonymity guarantee


### FILES MODIFIED
- `commands/ui.md` — new "Import DNA from External Repo" section between Bootstrap DNA and Scope Discipline


### CHANGES
- When user supplies a git URL with a UI task, command shallow-clones into a temp dir, distills DNA patterns, merges into current project's DNA, then removes the clone (cleanup runs even on failure)
- Default merge behavior reuses the existing MERGE / REPLACE / ADD / PRUNE rules; host project's DNA wins on conflict so existing learnings are preserved
- Anonymity is mandatory: the DNA must never mention source repo URL, owner, project name, brand, or any identifying string; verbatim copy/code/assets are forbidden; findings that cannot be abstracted are dropped
- Safety rails: read-only, no script execution from cloned repo, reject on clone failure, sample large repos instead of exhausting them


### DESIGN DECISIONS
- MERGE (not REPLACE) is the default so an import enriches the DNA without erasing prior captures
- Anonymity is enforced at distillation time, not after, to remove any chance of provenance leaking through wording or asset names
- Cleanup uses a trap-style explicit removal so failed distillations do not leave orphan clones on disk

## [2026-05-19] - Add `/ui` command for direct UI/UX work with DNA gate


### FILES MODIFIED
- `commands/ui.md` — new direct-execution command for UI/UX maintenance work


### CHANGES
- New `/ui` command mirrors `/chore` (mini-plan + impact map + direct Edit/Write, no subagent delegation) but specialized for UI/UX tasks: refine UI, optimize visuals, fix UX, polish flows
- Scope filter: refuses non-UI tasks and routes user to the right command (`/fix`, `/feat`, `/refactor`, `/perf`, `/chore`, `/docs`, `/test`)
- Mandatory DNA gate before any file change: discover an existing DNA-equivalent doc (openspec/ui-dna.md, docs/design-system.md, STYLEGUIDE.md, etc.) and read it; only bootstrap a new `openspec/ui-dna.md` when none exists
- Bootstrap procedure distills design tokens, component patterns, motion, a11y baseline, voice & tone, layout/responsive rules, and anti-patterns from real code — not invented values
- After bootstrap, the command appends a one-liner reference to repo-root `CLAUDE.md` and `AGENTS.md` (only if those files already exist) so future sessions read the DNA first
- Mini-plan adds `DNA source` and `DNA alignment` rows so each change is traceable to project DNA
- DNA Capture step added to workflow: after a fix or thoughtful UX decision, distill the learning back into the DNA doc. Captures must MERGE / REPLACE / ADD / PRUNE — never append blindly. DNA stays principle-shaped and skimmable in one read; sections that pass ~7 bullets get consolidated. No dates, no narrative, no journal entries.
- UI Improvement Lenses section added: when user asks to "improve UI", command applies established UX methods (Progressive Disclosure, Smart Defaults, Hick's Law, Pareto 80/20, Cognitive Load, Feature Creep check, "Less but better", "Don't Make Me Think") before reaching for visual tweaks. Relayouting is explicitly authorized when it serves these lenses.


### DESIGN DECISIONS
- Direct-execution shape (like `/chore`) rather than subagent-orchestration: UI work usually has a clear target and benefits from immediate Edit/Write rather than delegated planning
- DNA file lives at `openspec/ui-dna.md` to share the openspec convention used by the rest of the kit, but the command prefers any existing DNA doc to avoid duplicating prior design system work
- The command does not create `CLAUDE.md`/`AGENTS.md` if missing — those are project-level conventions, not the kit's to introduce
- Scope discipline carried over verbatim from `/chore` to keep parallel-session safety consistent across maintenance-style commands

## [2026-05-18] - clean-room: restore explore skill, keep brainstorm inline


### FILES MODIFIED
- `commands/clean-room.md` — top-of-file directive restored to load the `explore` skill; Phase 3 clarified to use the skill's stance but not the Explore subagent


### CHANGES
- The `explore` skill is loaded again at the top of the command (per previous behavior) so Phase 3's brainstorm inherits its stance, verification, OpenSpec awareness, and guardrails
- Phase 3 still runs inline — the command reads the draft directly and uses `codebase-retrieval` to understand the user's project — but now does so under the explore skill's umbrella rather than re-inventing the brainstorm shape
- Explicit note added: the explore **skill** is loaded; the Explore **subagent** is not delegated to


### DESIGN DECISIONS
- Misread the previous instruction — user wanted the Explore subagent excluded, not the skill. Skill provides shared brainstorm behavior that's worth reusing; subagent would lose conversational flow and the draft-centric focus. Splitting the two is the right shape.

## [2026-05-18] - clean-room: Phase 3 handled inline, no explore skill


### FILES MODIFIED
- `commands/clean-room.md` — removed the top-of-file "load explore skill" directive; rewrote Phase 3 as an inline brainstorm


### CHANGES
- Phase 3 no longer loads the `explore` skill and no longer delegates to a brainstorm subagent. The command itself: (1) reads every artifact in `openspec/changes/<name>/` directly, (2) queries `codebase-retrieval` (workspace root) to understand the user's project — placement, conventions, overlaps, in-flight changes via `openspec list --json`, (3) brainstorms the clean-room concerns with the user, (4) edits the artifacts in place to lock each decision.
- Added a "Placement" decision item to the brainstorm list — which modules/layers host each behavioral surface in the user's project, since codebase-retrieval now informs that directly.
- Hard rules during refine reiterated inline: no origin references reintroduced; no test-inventory count reductions without an explicit waiver in the proposal; the source-free firewall from Phase 2 must hold.


### DESIGN DECISIONS
- **Inline brainstorm over `explore` skill** — clean-room work is draft-centric (review and refine existing text), not exploratory. Explore's open-ended stance, Feynman echo, and from-scratch checklist are overkill and pull focus from the draft. A tighter, draft-first review is the right shape.
- **`codebase-retrieval` instead of an analysis subagent** — keeps the brainstorm in the main loop where the user can interject. A subagent would round-trip and lose conversational flow.
- **Placement decision is now explicit** — earlier draft assumed the draft proposal would name placement; making it a brainstorm item lets the user override based on local convention codebase-retrieval surfaces.

## [2026-05-18] - osf-clean-room: source-free behavioral spec + exhaustive test inventory


### FILES MODIFIED
- `subagents/osf-clean-room.md` — rewritten for clean-room legal posture and depth-over-speed
- `commands/clean-room.md` — Phase 1 no longer records source URL/SHA; Phase 2 brief minimized to keep origin identifiers out of artifacts; Phase 3 brainstorm reframed as draft review of a behavioral spec, explicitly forbidding reintroduction of origin references


### CHANGES
- Subagent now produces **source-free behavioral specifications**: no repo URL, SHA, fork name, file paths, copyright/license text, author names, verbatim code/comments/log strings/error messages, distinctive identifier names lifted unchanged, or copied test names land in artifacts. Identifiers are renamed when distinctive; common names are fine.
- Multi-pass observation step (A: surface scan, B: behavior trace, C: edge cases, D: data/contracts) — replaces the previous single feature-map pass. Captures inputs, outputs, side effects, error modes, invariants, concurrency, performance, and environmental assumptions per public surface.
- **Test inventory becomes a non-negotiable correctness gate**: every test found in the source must produce a corresponding behavioral assertion in the spec, with re-described name, scenario, abstracted fixtures, inputs, expected outputs, expected side effects, error/success, timing/ordering assertions, and explicit handling of skipped/quirk tests. The count of spec assertions must be ≥ the count of tests found. Integration/E2E/property/fuzz/golden-file tests documented per category.
- Mandatory final task in `tasks.md`: behavioral parity check — every assertion from the test inventory passes — with verify annotation requiring the passing count to equal the documented count.
- Subagent inputs reduced to `temp-path`, `feature-hint`, `user-project-root`, `license-note`. `source-repo-url` and `source-sha` removed entirely. `license-note` is used only for the analyst's go/no-go decision and never written to artifacts. License explicitly blocks subagent if it forbids clean-room work.
- Change-name derivation no longer uses `port-` prefix or any origin-implying word — names come from the feature's role only.
- Priority order made explicit in the prompt: safety > accuracy > completeness > speed.


### DESIGN DECISIONS
- **No origin identifiers in artifacts** is the load-bearing change. Earlier draft embedded source URL + SHA + license string as "provenance" — that creates legal exposure and contaminates the clean-room firewall. The temp folder is the analyst's private reference; the proposal stands alone as a fresh spec a separate implementer could realize without ever reading the source.
- **Test inventory as the parity contract** — chose to require per-test behavioral assertions rather than a vaguer "describe test strategy" instruction. A port that passes every documented assertion is verifiably equivalent to the source on observable behavior; a spec that handwaves tests cannot anchor that verification.
- **Identifier renaming** applies only to distinctive names — blanket renaming would be hostile to readability. Heuristic: common/standard names (`parse`, `User`, `encode`) stay; branded/unusual names (`FrobnicateBufferPool`) are paraphrased.
- **License-as-gate, not artifact field** — analyst still needs to know the license to refuse impossible jobs (NDAs, no-derivative clauses, patent grants). But the string never propagates downstream; only the binary decision does.
- **Brainstorm forbidden from reintroducing origin** — Phase 3 wording now explicitly tells the explore-driven brainstorm not to add URLs/SHAs/paths back in. Without that guardrail, a well-meaning brainstorm would "add provenance for traceability" and undo the firewall.
- Removed `port-` prefix on change names — origin-implying prefixes are themselves a tell.
- Kept the "best-effort draft + open questions" pattern (no mid-loop user prompts) — subagent has no conversation history; questions belong in the brainstorm.

## [2026-05-18] - osf-clean-room: produce the full artifact set, not just the first ready one


### FILES MODIFIED
- `subagents/osf-clean-room.md` — Step 3 rewritten to mirror the full loop from `commands/proposal.md`: check existing changes, create the change, iterate `openspec status` → `openspec instructions` until every artifact in `applyRequires` is `done`


### CHANGES
- Subagent now authors the complete set of OpenSpec artifacts (proposal, design, tasks, specs, and anything else the schema lists) before exiting — previously the wording stopped at "for each ready artifact" without making the loop or the completeness gate explicit
- Added pre-flight `openspec list --json` check with explicit guidance on name collisions (pick a new name or reuse the existing change)
- Added a final `openspec status --change "<name>"` verification step — exit only when every artifact reports `done`; remaining `ready`/`blocked` artifacts must be finished first
- Unresolved fields go to the "Open questions" section instead of blocking the loop; brainstorm phase resolves them


### DESIGN DECISIONS
- Aligned with `commands/proposal.md` rather than diverging — the subagent fuses the proposal flow with foreign-repo mapping, so the artifact loop should match the canonical flow exactly. Divergence would create two slightly-different proposal pipelines in the same kit.
- Kept the "best-effort draft + open question" fallback (vs. asking the user mid-loop) — the subagent runs without conversation history, so blocking on user input is awkward. The brainstorm phase that follows is the right place for those questions.

## [2026-05-18] - clean-room: draft-first flow with dedicated subagent


### FILES MODIFIED
- `commands/clean-room.md` — new command (initial draft this morning, then reshaped to the draft-first flow described below)
- `subagents/osf-clean-room.md` — new subagent that maps the feature in the temp clone AND drafts the OpenSpec proposal in one job


### CHANGES
- New `/clean-room` command for porting a feature from an external git repo into the user's current project
- Pipeline: shallow-clone to `/tmp/clean-room/<slug>-<ts>` (or accept a local path) → `osf-clean-room` subagent reads the clone, maps the feature, and writes a draft OpenSpec proposal/design/tasks in the user's project → load shared `explore` skill to review the draft with the user, lock decisions on clean-room concerns, and edit artifacts in place → print manual cleanup command
- Clean-room-specific decision points the brainstorm must resolve: license compatibility, adaptation vs lift-and-shift, dependency delta, naming reconciliation, test porting, conflict surface, scope boundary
- Proposal embeds provenance (source URL, source SHA, license decision) and a "Draft — pending brainstorm review" marker that the brainstorm phase removes once decisions are locked


### DESIGN DECISIONS
- **Draft-first, not analysis-first** — earlier sketch had Phase 2 produce a "feature map" blob then handed off to `/proposal` at the end. Switched to a draft-first flow: the subagent writes the proposal upfront so the brainstorm reviews concrete text instead of imagining the port from scratch. User reads real artifacts, raises objections against specific lines, and the artifacts are edited to match their choices.
- **Dedicated subagent (`osf-clean-room`)** instead of reusing the generic Explore agent — the job fuses two responsibilities (read-only foreign-repo mapping + OpenSpec artifact authoring in the user's project) that no existing subagent owns together. Splitting across two subagents would lose the feature-map context between them.
- **Subagent is scope-disciplined by construction** — reads from the temp clone, writes only inside the OpenSpec change directory in the user's project. No deletions anywhere. Aligns with the 2026-05-17 scope-discipline entry.
- **No GitNexus on the temp clone** — the clone isn't indexed; subagent uses Read/Glob/Grep. GitNexus stays for the user's project side when needed.
- License check stays a first-class blocker in Phase 1, before the subagent runs — discovering GPL/AGPL incompatibility after the proposal is drafted wastes work.
- Temp clone stays read-only and is never auto-deleted; command prints a manual `rm -rf` one-liner. Matches the kit's no-delete rule.
- Free-form args (not strict positional) to match feat.md's natural-language style; local-path mode added so users can iterate without re-cloning.
- `/proposal` handoff removed from the final phase — the proposal already exists by Phase 3, so brainstorm refines in place rather than re-running the proposal pipeline.

## [2026-05-17] - explore: suggest a copy-paste /goal command after planning


### FILES MODIFIED
- `commands/explore.md` — added "Optional: /goal one-liner" subsection in the Ready to Implement block, between the path-choice question and "Routing the user's choice"


### CHANGES
- After the A/B/C/D implementation-path question, explore now offers a ready-to-copy `/goal` command matched to the work's complexity
- Three tiers: Simple (apply only), Medium (apply + verify), Complex (proposal + apply + verify)
- Agent picks ONE tier based on the locked plan, tailors wording to the actual work, and skips it for trivial work where `/goal` would be overkill
- Lets users run the whole chain unattended via Claude Code's native `/goal` loop without retyping the plan


### DESIGN DECISIONS
- Placed as a sibling tip to the path question, not as a fifth menu option — `/goal` is a delivery mechanism the user invokes in a fresh turn, not a path explore itself routes to
- Single-tier suggestion (not all three) keeps the offer aligned with the plan instead of dumping a menu
- Examples rewritten in English from user's Vietnamese sketches; "no CRITICAL findings" phrased as an objective end state so the `/goal` evaluator can judge it from the transcript


### FILES MODIFIED
- `commands/apply.md` — inlined SCOPE DISCIPLINE block (briefing rules for osf-apply)
- `commands/verify.md` — inlined SCOPE DISCIPLINE block (report-only stance for unowned files)
- `commands/chore.md` — inlined Scope Discipline section between intro and Workflow
- `commands/archive.md` — inlined SCOPE DISCIPLINE block (limit to change dir + named sync targets)
- `commands/autopilot.md` — inlined SCOPE DISCIPLINE block above ORCHESTRATOR IDENTITY GATE
- `subagents/osf-apply.md` — inlined full SCOPE BOUNDARIES block before File Editing Discipline
- `subagents/osf-verify.md` — inlined SCOPE BOUNDARIES tailored to report-only stance; out-of-scope code = "cannot verify ownership", not CRITICAL
- `subagents/osf-archive.md` — inlined SCOPE BOUNDARIES restricted to change directory + named sync targets


### CHANGES
- Root problem: when multiple sessions worked the same git branch, agents (apply, verify, even chore) would delete or "fix" code belonging to other in-progress sessions because they had no awareness those sessions existed. Failure modes observed: verify flagging out-of-spec files as drift to remove, apply auto-fixing lint errors by deleting unowned code, agents treating "unfamiliar code" as "rubbish to clean up".
- Fix: explicit scope discipline inlined into every write-capable surface in the kit. Three guardrails baked in:
  1. Outside-scope = hands off — no edits, no deletions, no refactors on unowned files
  2. Lint/test failures in unowned files = report, not auto-fix
  3. Wanting to delete something = surface to user, never act unilaterally
- Strict no-delete rule with no escape hatch — if a deletion is needed, the user does it manually. Agents may only recommend.
- Default assumption flipped: unfamiliar code is treated as "another session's work" until proven otherwise, not as garbage.


### DESIGN DECISIONS
- Inlined the scope rules directly into each command and subagent — per user preference, no new shared skill file. Each command/subagent is self-contained. Duplication is accepted as a deliberate trade-off (5 commands + 3 subagents = 8 copies); when rules need updating, all 8 sites get touched together.
- Strict no-delete with no escape hatch — adding "yes, user confirmed, proceed" would re-introduce the failure mode (agent rationalizes that scope rules were overridden by some earlier turn). Deletions stay manual.
- Did NOT modify planning commands (feat/fix/refactor/perf/docker/docs/test/ci) — they plan and delegate to apply, so they inherit scope discipline transitively via apply.md and osf-apply.md. Adding redundant blocks would bloat without benefit.
- Did NOT modify setup.md — setup writes initial files into a known scaffold scope; the failure mode (deletion of parallel-session code) doesn't apply.
- Did NOT add a cross-session detector (e.g., scan other `openspec/changes/*/` for active work and warn) — over-engineering for v1. Scope discipline at the file-touch level is the load-bearing fix. Detection can come later if scope rules prove insufficient.
- osf-verify's scope wording adapted to its report-only nature: out-of-scope code that conflicts with spec is reported as "cannot verify ownership", explicitly NOT CRITICAL, so verify-fix loops won't trigger deletion attempts on unowned files.
- osf-archive scope restricted to the change directory + declared sync targets to prevent it from sweeping other in-progress `openspec/changes/*/` directories during archive.

## [2026-05-16] - chore codebase-retrieval: pin directory_path to workspace root


### FILES MODIFIED
- `commands/chore.md` — "You are the implementer" section now specifies workspace root as `directory_path` for codebase-retrieval (not a single repo subdir)


### CHANGES
- Discovery guidance gains explicit `directory_path` direction: workspace root, not repo subdirectory
- Reason: multi-repo and monorepo setups previously narrowed search to one repo, hiding cross-repo touch-points


### DESIGN DECISIONS
- Scoped to chore only per user choice — same guidance could apply kit-wide later via explore.md

## [2026-05-16] - Prefer codebase-retrieval for chore impact discovery


### FILES MODIFIED
- `commands/chore.md` — "You are the implementer" section now names codebase-retrieval as the preferred discovery tool for impact, with Read/Glob/Grep as fallbacks when path/symbol is known


### CHANGES
- Discovery guidance split by intent: semantic impact search → codebase-retrieval; known path/symbol → Read/Glob/Grep
- Soft preference ("prefer", "fall back"), not a hard rule — agent decides per task


### DESIGN DECISIONS
- Placed in existing tool-palette section rather than UNDERSTAND/MAP steps to keep the workflow steps focused on artifact goals, not tooling

## [2026-05-15] - Add impact map step to chore


### FILES MODIFIED
- `commands/chore.md` — added MAP step between BRIEF and EXECUTE; new "Impact Map Template" section with ASCII graph + touch-points table format


### CHANGES
- chore.md workflow grew from 4 steps to 5: UNDERSTAND → BRIEF → MAP → EXECUTE → REPORT
- New "Impact Map Template" describes the artifact goal (component flow + file/line touch-points) without prescribing structure — agent decides scope and what extras to include (parity invariants, tests, shared contracts) based on the work
- Touch-points table uses `What changes` column (not `What to add`) so it fits chore's broader semantics
- No approval gate added after MAP — agent renders the map then proceeds, same posture as BRIEF


### DESIGN DECISIONS
- "Skip when too small" wording keeps trust-the-agent stance: no hard threshold, agent's judgment call (trivial typo / version bump shouldn't get a diagram)
- Template intentionally sparse — describes goal (show what moves together), shows touch-points columns, lets agent design the graph shape per task

## [2026-05-14] - Slim chore: self-execute, no explore load


### FILES MODIFIED
- `commands/chore.md` — reduced from ~104 to ~30 lines; removed `BEFORE PROCEEDING: invoke "explore"` directive; removed What You Might Do / Stress-test Questions / Zero-Fog Checklist sections; removed OpenSpec CLI dependency; frontmatter slimmed to `name` + `description` only (dropped license, compatibility, metadata block, version)


### CHANGES
- chore.md no longer loads the shared explore skill — chore runs standalone
- chore.md no longer runs Feynman echo, stress-test 4-question protocol, or Zero-Fog checklist before acting
- chore.md now writes code directly via Edit/Write — does NOT delegate to osf-apply
- chore.md retains only: 4-step workflow (UNDERSTAND → BRIEF → EXECUTE → REPORT) and a mini-plan template (Files/areas, Changes, Out of scope, Checks) shown before file modification


### DESIGN DECISIONS
- chore targets work where the user already knows what they want — ceremony added latency without value (over-engineered for `chore: bump axios` or `chore: ignore .env.local`)
- Intentional pattern break: chore is the only command in this kit that self-executes. The ORCHESTRATOR IDENTITY GATE in explore.md does not apply because explore.md is not loaded by chore.
- Did NOT add a "switch to /refactor if scope is large" escape hatch — trust the user's framing and the AI's in-the-moment judgment. Adding a guardrail "just in case" violates the kit's no-paternalism principle.
- Did NOT add a "confirm before destructive changes" guardrail — same reason as above.
- "Light bug fix" use case: still belongs to `/fix` by conventional-commit semantics, but `/chore` no longer blocks the user if they invoke it with a known-root-cause small change — chore's contract is "user knows what to do; just do it", regardless of commit type.
- Kept the mini-plan template (Mức 3 in user discussion) over a single-line announcement (Mức 1) because Files/areas + Out-of-scope give the user a clear catch-handle before execution without re-introducing question loops.

## [2026-05-13] - Fix: autopilot still stops after proposal (TodoWrite tracker + mechanical step transitions)


### FILES MODIFIED
- `commands/autopilot.md` — added "Pre-commit the chain" section before Pipeline (TodoWrite-based tracker); added "YOUR GOAL IS THE WHOLE PIPELINE" reframe at top of Pipeline section; rewrote every Step transition (Full / Verified / Light) as a mechanical "next response = TodoWrite update + next tool call, zero text before them" instruction; bumped version 1.3 → 1.4


### CHANGES
- Root cause re-diagnosis: the 2026-05-10 fix added PIPELINE IS NON-STOP block + red flags + "immediately proceed in same turn" wording. Those are correct in intent but failed in practice because:
  1. All rules are negations ("don't stop", "don't write closing text") — model needs a positive structural anchor, not just prohibitions
  2. "Same turn" / "immediately proceed" are abstract temporal directives — model needs a concrete mechanical action
  3. Rules live in PIPELINE IS NON-STOP block at section top, but the model's attention at the moment of failure is on the Step instructions — proximal salience matters
  4. Model treats `✅ Spec created` as goal-met because the original user request often *was* "create a spec" — needs explicit goal reframe
- Pre-commit step uses TodoWrite to lay out every pipeline step BEFORE invoking the first step. The pending todo list becomes a persistent visual "more work remains" signal that survives skill/agent boundaries.
- Each Step transition now spells out: "next response contains exactly two tool calls (TodoWrite update + next Agent/Skill call) and zero text before them. If you find yourself drafting text, STOP the draft and emit the tool calls." This is mechanical, not aspirational.
- Goal reframe at top of Pipeline section: "Your goal is NOT 'create a spec'. Your goal is the entire selected pipeline." Attacks the model's tendency to treat the first completion marker as the finish line.
- Applied the same mechanical pattern to Verified (implement → verify) and Light (implement only) pipelines for consistency.


### DESIGN DECISIONS
- TodoWrite over a custom marker because TodoWrite is a first-class tool the model already respects as a progress tracker, no new convention needed.
- Kept the existing "PIPELINE IS NON-STOP (CRITICAL)" block and red flags — two layers of safety net don't hurt. The new mechanical instructions sit at the Step level where attention actually is at the failure moment.
- Did NOT modify proposal.md this time. Previous fix already made proposal's output minimal (just the marker). The issue is on the caller side (autopilot), not the callee side (proposal).
- Did NOT add a "next planned action" pre-announcement before invoking proposal. Considered it but chose TodoWrite instead: TodoWrite persists across tool returns, an inline announcement decays in context.
- Kept the change autopilot-only. Other planning commands (feat/fix/etc.) hand off to autopilot for non-stop chaining, so fixing autopilot fixes the chain centrally.

## [2026-05-12] - Convert osf-review from subagent to command


### FILES MODIFIED
- `commands/review.md` — rewritten from thin wrapper to full review logic (v2.0 → v3.0); removed `run-in-subagent: osf-review` frontmatter; dropped SUBAGENT EXECUTION GATE; added preamble that uses conversation context to scope reviews after prior implementation/fix


### FILES DELETED
- `subagents/osf-review.md` — logic merged into commands/review.md


### CHANGES
- Review now runs as a Skill (command) in the same conversation context as the orchestrator, instead of as an isolated subagent
- The orchestrator no longer has to paraphrase "what was just implemented/fixed" when handing off to the reviewer — review sees the full conversation directly
- Added explicit guidance at the top of review.md: if review is invoked right after a change in the same conversation, the changed files are usually the right scope
- All review dimensions, severity classification, report format, remote comment protocol, and guardrails preserved unchanged


### DESIGN DECISIONS
- Root cause: subagents don't have access to conversation history. When `/osf review` ran right after `/osf apply` or `/osf fix`, the orchestrator had to summarize what changed for the subagent, and small nuances (which files were primary vs incidental, which concerns the user already flagged) were lost in paraphrasing.
- Same pattern as the 2026-05-06 osf-proposal conversion — review benefits from full context for the same reason proposal did.
- Review doesn't need subagent isolation: it's read-only, runs once, doesn't pollute context with file modifications, and is most useful exactly when fresh implementation context is available.
- Kept osf-apply, osf-verify, osf-archive, osf-analyze as subagents — they remain isolation-worthy (heavy file modifications, independent verification, indexing overhead).

## [2026-05-12] - Remove paternalistic guardrails across kit


### FILES MODIFIED
- `commands/explain.md` — removed 3 style-judgment don'ts from Guardrails (don't guess, don't dump code, don't over-explain)
- `commands/explore.md` — removed 4 paternalistic don'ts from Guardrails (don't fake understanding, don't rush, don't force structure, don't auto-capture)
- `commands/proposal.md` — removed "Don't over-explore — 2-3 rounds of questions max" from Guardrails
- `subagents/osf-verify.md` — removed "do NOT blindly run every dimension" prohibition, kept the positive guidance


### CHANGES
- Deleted style/judgment-level prohibitions that constrained agent reasoning without encoding any real failure mode.
- "Don't auto-capture" was duplicating the "Offer to save insights" rule already documented in the OpenSpec Awareness section.
- "Don't over-explore (2-3 rounds max)" imposed a hard numeric cap on a judgment call the agent should make based on context.
- "do NOT blindly run every dimension" was paired with positive guidance ("Only check dimensions relevant to what was actually modified") — the positive half does the work alone.


### DESIGN DECISIONS
- Only removed prohibitions that were paternalistic (constrain agent judgment) or duplicated nearby rules. Kept all prohibitions that encode runtime failures, security risks, CLI errors, mode boundaries, or documented past incidents.
- Specifically preserved: SUBAGENT EXECUTION GATE rules, file editing discipline, CLI flag rules, "Never commit", autopilot non-interactive overrides, browser Mode C report-only safety, explore.md workflow/mode rules (don't continue prior apply, don't show code in planning, don't create files unsolicited, don't accept fog, don't ask naked questions, etc.), fix.md debug anti-patterns (intentional Debugging Toolkit design), osf-archive non-interactive rules.

## [2026-05-12] - Remove verification step from osf-apply


### FILES MODIFIED
- `subagents/osf-apply.md` — removed Auto-Verify on Completion, Auto-Fix Loop, and verify-fixes.md log; simplified final output; removed Direct Plan Mode auto-verify/auto-fix steps; removed related guardrails


### CHANGES
- Deleted step 8 "Auto-Verify on Completion" — verification is osf-verify's job, not osf-apply's.
- Deleted step 9 "Auto-Fix Loop" along with the verify-fixes.md log instructions.
- Renumbered step 10 to step 8 "Final Output" and removed the "Implementation Complete & Verified" and "Manual Issues Remain" variants. Now reports a single "Implementation Complete" state.
- Removed Direct Plan Mode step 4 "Auto-verify on completion" and merged step 5 into a simplified "Final output" step.
- Updated OUTPUT line to drop "verification report".
- Removed 4 guardrails: Auto-verify on completion, Auto-fix on first pass, Re-verify loop, Verify fix log.
- Final output now ends with "Return control to the caller. The caller decides whether to invoke osf-verify next."


### DESIGN DECISIONS
- Single responsibility: osf-apply implements, osf-verify verifies. Mixing them blurred the boundary and caused osf-apply to do extra work the caller didn't always want.
- The orchestrator already chains osf-apply → osf-verify when verification is needed (see autopilot.md Verify-Fix Loop and explore.md auto-verify guardrail). osf-apply doing its own inline verify duplicated this.
- Removing the verify-fixes.md log from osf-apply is consistent — that log is written by whoever runs verification.
- Kept the rest of the implementation discipline intact: impact tracing, spec search, real-time task tracking, no-commit rule.

## [2026-05-12] - Remove GitNexus from osf-apply


### FILES MODIFIED
- `subagents/osf-apply.md` — removed GitNexus indexing and context/impact requirements from the implementation workflow


### CHANGES
- Deleted the GitNexus language support policy from osf-apply.
- Removed the mandatory `gitnexus analyze --skip-agents-md` indexing step.
- Replaced `gitnexus context` and `gitnexus impact` checks with codebase-retrieval plus Grep/Read tracing.
- Updated Direct Plan Mode to use the same non-GitNexus tracing approach.


### DESIGN DECISIONS
- Kept codebase-retrieval for broad discovery because osf-apply still needs implementation context before editing.
- Kept exact Grep/Read tracing for call sites and renames so the worker still checks impact without GitNexus.
- Preserved the related archived-spec search before editing files.

## [2026-05-12] - Fix subagents using scripts for file replacements


### FILES MODIFIED
- `subagents/osf-apply.md` — added file editing discipline that requires Edit/Write tools instead of script-based replacements
- `subagents/osf-archive.md` — added the same discipline for spec syncing and archive-related file updates
- `subagents/osf-analyze.md` — added Edit/Write tools for the unsupported-repository CLAUDE.md marker and the same file editing discipline


### CHANGES
- Implementation-capable subagents now explicitly use dedicated file tools for file modifications.
- Added a direct ban on using Bash to run Python, Node, Perl, Ruby, or shell scripts whose purpose is replacing file contents.
- Added a ban on shell redirection, heredocs, and `tee` for writing project files.
- Added a self-check: if the worker is preparing a "read file -> replace text -> write file" script, it must stop and use Edit instead.


### DESIGN DECISIONS
- Fixed the behavior at the worker prompt level because the failure happens inside subagents after delegation.
- Kept the change limited to subagents that can modify files. Read-only subagents were left unchanged.
- osf-analyze already instructed workers to add/update a CLAUDE.md marker for unsupported repositories, so its tool allowlist now matches that responsibility.

## [2026-05-10] - Fix: autopilot and planning commands stop after proposal instead of chaining to apply


### FILES MODIFIED
- `commands/proposal.md` — rewrote "After Completion" section to be an explicit non-stop hand-off contract
- `commands/autopilot.md` — added "PIPELINE IS NON-STOP" block at top of Pipeline section, tightened every Step hand-off wording, added pipeline-non-stop guardrail
- `commands/explore.md` — split Ready-to-Implement routing from the outer menu text, renamed Large Work sub-options from A/B to Path 1/Path 2, added non-stop chaining instruction for spec-first paths, added a new guardrail against stopping mid-chain


### CHANGES
- Root cause: three reinforcing weak spots caused the AI to end its turn after the proposal skill returned, instead of immediately chaining into osf-apply:
  1. `proposal.md` printed `Ready for implementation.` as a closing line and said "return control to the caller" — ambiguous between "caller decides" and "stop turn and wait for user", so the AI treated it as a turn boundary
  2. `autopilot.md` Pipeline listed Step 1 → 2 → 3 sequentially with no explicit "do not pause between steps" rule, so the AI lost pipeline momentum after proposal's completion message
  3. `explore.md` had label collision: outer menu used A/B/C/D, Large Work sub-menu also used A/B, and the "After proposal, immediately run osf-apply" instruction lived only in the Large Work "When user chooses A" branch — when the user chose outer-menu B (Spec-first), the continuation was undocumented
- proposal.md now prints only `✅ Spec created: <change-name>` and explicitly forbids closing text, next-command suggestions, and farewells; explains that the caller will continue in the same turn
- autopilot.md Pipeline now opens with a "PIPELINE IS NON-STOP (CRITICAL)" block: hand-off rule, red flags for wrong stops, explicit parse contract for proposal output, and the only legitimate stop points (3-round verify-fix exhaustion, hard subagent error, final step done)
- Each autopilot Pipeline Step now ends with "When X returns, immediately proceed to Step Y in the same turn"
- explore.md outer menu now has explicit "Routing the user's choice (non-stop contract)" section mapping A/B/C/D to exact tool call sequences, with B (Spec-first) spelled out as proposal → parse marker → osf-apply in one turn
- Large Work sub-options renamed to Path 1 / Path 2 to stop colliding with outer A/B/C/D
- New explore.md guardrail: "Don't stop mid-chain after proposal"


### DESIGN DECISIONS
- Kept the fix prompt-level (no new tools, no new subagents). The workflow was already correct in intent (confirmed by prior changelog entries 2026-03-31 "Auto-run osf-apply after osf-proposal completes" and 2026-05-06 "return control to the caller — prevents proposal from self-chaining into apply"). The fix is about removing turn-boundary signals the AI was reading as "stop".
- "Return control to the caller" was the key ambiguity — replaced with explicit "stop your own execution immediately; the caller will continue in the SAME turn" so the instruction pins down temporal behavior, not just logical ownership.
- Kept proposal's no-self-chain rule (it must NOT launch osf-apply itself) because that rule is still correct — the CALLER chains, not proposal. Fix is about making the caller reliably do its half of the chain.
- Red flag list in autopilot.md targets the exact moment the AI wrongly stops: "you just saw the completion marker and your draft reply looks like a status update → STOP drafting, call osf-apply NOW". Same pattern as earlier delegation-enforcement fixes that succeeded by intercepting the decision at the point it's made.
- A/B/Path 1/Path 2 rename chosen over renaming outer menu because outer menu is user-facing and stable; sub-menu labels are internal routing concerns.

## [2026-05-06] - Add anti-pattern detection dimension to osf-review


### FILES MODIFIED
- `subagents/osf-review.md` — added dimension 9: Anti-Patterns: Fragility & Scalability


### CHANGES
- New review dimension that flags structural patterns which work at current scale but break under growth
- 10 named anti-patterns: god function/class, tight coupling, implicit ordering, manual state sync, string-based dispatch, unbounded linear scan, hardcoded capacity assumptions, deep inheritance chains, copy-paste with variation, global mutable state
- Conditional trigger: runs when code has business logic, data processing, or architectural decisions
- Severity guide: CRITICAL for global mutable state and ordering bugs that cause data corruption, WARNING for most anti-patterns, SUGGESTION for mild cases
- Updated severity classification to include anti-pattern examples at each level
- Added routing example: business logic/services/data layer → include Anti-Patterns


### DESIGN DECISIONS
- Separate dimension (not merged into Simplification or Performance) because anti-patterns are about structural fragility, not code style or runtime cost
- Each pattern includes a "why it's fragile" explanation so the reviewer can justify the flag in the report
- Severity is conservative: most anti-patterns are WARNING because they work today — CRITICAL reserved for patterns that can cause data corruption or security bypass

## [2026-05-06] - Extract osf-review subagent from review command


### FILES MODIFIED
- `commands/review.md` — rewritten as thin wrapper that delegates to osf-review subagent (v1.0 → v2.0)


### FILES CREATED
- `subagents/osf-review.md` — full review logic (8 dimensions, scope detection, report format, remote comments)


### CHANGES
- Review logic now runs in a dedicated subagent with its own tool allowlist
- Command is a thin wrapper: gathers scope context, launches Agent tool with `subagent_type: "osf-review"`
- Same pattern as verify.md, apply.md, archive.md wrappers
- Added `run-in-subagent: osf-review` frontmatter to command
- Added 3 new review dimensions (5 → 8 total):
  - **UI/UX Feedback**: missing loading states, disabled buttons, error/empty states, success feedback, focus management, accessibility
  - **Error Handling**: empty catch blocks, unhandled rejections, missing error boundaries, generic messages, missing fallbacks
  - **Performance & Memory**: N+1 queries, missing pagination, memory leaks (missing cleanup, unbounded growth), unnecessary re-renders, large imports


### DESIGN DECISIONS
- Review benefits from subagent isolation: it's read-only, self-contained, and doesn't need conversation history
- Consistent with other worker subagents in the kit (osf-apply, osf-verify, osf-archive, osf-analyze)
- Subagent has EXECUTION GATE to prevent skill invocation or routing
- UI/UX dimension only flags interactive code missing feedback, not static components
- Performance dimension focuses on patterns detectable from code reading (not runtime profiling)

## [2026-05-06] - Convert osf-proposal from subagent to command (skill)


### FILES MODIFIED
- `commands/proposal.md` — rewritten from thin wrapper to full spec-creation command
- `commands/explore.md` — changed osf-proposal Agent tool refs to Skill("proposal"), removed from subagent table
- `commands/autopilot.md` — changed Agent tool ref to Skill("proposal")
- `commands/osf.md` — removed osf-proposal from supporting subagents list


### FILES DELETED
- `subagents/osf-proposal.md` — logic merged into commands/proposal.md


### CHANGES
- Proposal now runs as a Skill (command) in the same conversation context as the orchestrator
- Orchestrator no longer needs to summarize context for a subagent — proposal skill has full conversation history
- After proposal completes, it outputs the change name and returns control to the caller
- The caller (explore or autopilot) then continues its chosen flow (e.g., launch osf-apply)
- Orchestrator identity gate updated: "Create spec" now delegates via Skill tool, not Agent tool


### DESIGN DECISIONS
- Root cause: orchestrator was summarizing conversation context when briefing the osf-proposal subagent, causing small/nuanced user requirements to be lost in paraphrasing
- Skill (command) runs in the same context window — it sees the full conversation history directly, eliminating information loss
- Proposal does not need isolation: it creates files (openspec artifacts) but doesn't need to run in parallel or protect the orchestrator from context pollution
- "After Completion" section explicitly says "return control to the caller" — prevents proposal from self-chaining into apply
- osf-apply, osf-verify, osf-archive remain subagents because they benefit from isolation (long-running, heavy file modifications, independent verification)

## [2026-05-06] - Add GitHub PR and GitLab MR review support


### FILES MODIFIED
- `commands/review.md` — added remote PR/MR review modes and comment workflow
- `changelog.md` — documented remote review support


### CHANGES
- `/osf review` now detects GitHub Pull Request URLs and reviews them with `gh pr view` and `gh pr diff`
- `/osf review` now detects GitLab Merge Request URLs and reviews them with `glab mr view` and `glab mr diff`
- GitLab support includes GitLab.com and self-hosted/company GitLab when `glab` is configured for the host
- Remote review still uses the same 5 dimensions: impact gaps, hardcoded values, project rules, security, simplification
- Remote comments are supported via `gh pr comment` or `glab mr note`, but only after showing the exact comment body and receiving explicit user confirmation


### DESIGN DECISIONS
- Used official CLI tools (`gh`, `glab`) instead of raw API calls because they handle authentication, host config, and project resolution consistently
- Treated provided URLs as source of truth and explicitly banned guessing or constructing PR/MR URLs
- Posting comments is separated from reviewing because comments affect shared state and may notify other people
- Checkout is not automatic because it can modify the local working tree; the command asks before checkout when full local file context is needed

## [2026-05-06] - Add /review command for post-implementation code quality checks


### FILES MODIFIED
- `commands/review.md` — new utility command for code review
- `commands/osf.md` — added `review` to available skills and intent mapping
- `README.md` — added `/osf review` to Utility Commands table
- `changelog.md` — documented the addition


### CHANGES
- New `/osf review` command: reviews uncommitted git changes (default) or a specific feature/area for quality issues
- 5 review dimensions: impact gaps, hardcoded values, project rules compliance, security, simplification
- Uses codebase-retrieval as primary tool (over Grep) for understanding relationships and finding consumers
- Reads CLAUDE.md and project conventions to validate compliance
- Structured report with CRITICAL/WARNING/SUGGESTION severity
- Fluid routing: report ends with actionable next steps → `/osf apply` (fix directly) or `/osf fix` (investigate deeper)
- Added intent mapping in osf dispatcher: "review code, code quality, missed impacts" → `review`


### DESIGN DECISIONS
- Standalone utility command (like explain, analyze) — does NOT load explore mode because review is not a planning command
- No subagent needed — review is self-contained (read code → produce report). Unlike analyze which needs GitNexus indexing and complex structural tracing, review is primarily about reading code and judging quality.
- codebase-retrieval over GitNexus: review needs to understand "what consumes this API" at a semantic level, not trace exact AST call chains. codebase-retrieval is better for this broad relationship discovery.
- Default scope is uncommitted changes because the primary use case is "I just implemented/fixed something, did I miss anything?"
- Fluid with apply/fix: report format is designed so findings can be passed directly as context to `/osf apply` or `/osf fix`

## [2026-05-04] - Prevent osf dispatcher self-invocation


### FILES MODIFIED
- `commands/osf.md` — added runtime guard that blocks invoking the `osf` skill from inside the expanded osf dispatcher prompt
- `changelog.md` — documented the self-invoke guard


### CHANGES
- The expanded `/osf ...` prompt now says it is already the dispatcher and must not call `Skill("osf")` again.
- Dispatch now starts directly from ARGUMENTS and only invokes the resolved target skill, plus `explore` for planning skills.


### DESIGN DECISIONS
- Slash commands are expanded into prompts before the agent acts, so the prompt must explicitly prevent self-invocation at runtime.
- Kept the guard in `commands/osf.md` only because the bug is specific to the dispatcher prompt.

## [2026-05-04] - Parallel planning skill load with caller context


### FILES MODIFIED
- `commands/osf.md` — added parallel loading for planning skills and shared explore mode
- `commands/feat.md` — allowed skipping duplicate explore when caller context says it is loaded
- `commands/fix.md` — same
- `commands/chore.md` — same
- `commands/refactor.md` — same
- `commands/perf.md` — same
- `commands/docs.md` — same
- `commands/test.md` — same
- `commands/ci.md` — same
- `commands/docker.md` — same
- `commands/setup.md` — same
- `commands/autopilot.md` — aligned Step 0 with the same caller-context duplicate guard
- `changelog.md` — documented the dispatch behavior change


### CHANGES
- `/osf <planning-skill> ...` now instructs the runtime to invoke the planning skill and `explore` in parallel.
- The planning skill receives caller context saying shared explore mode is already loaded for this request, so it must not invoke `explore` again.
- Direct planning aliases like `/feat ...` still load `explore` themselves because they do not receive that caller context.
- Autopilot uses the same caller-context wording for its domain skill + `explore` load.


### DESIGN DECISIONS
- Used caller context instead of slash-command literals because slash commands are expanded into prompts before the skill runs.
- Kept planning commands responsible for loading `explore` by default, preserving direct alias behavior.
- Kept `/osf` fast for planning skills by parallel-loading the domain skill and shared explore mode.

## [2026-05-04] - Require explicit implementation path choice


### FILES MODIFIED
- `commands/explore.md` — added a stop gate before implementation and aligned Autopilot routing with smart pipeline selection
- `commands/autopilot.md` — clarified that Autopilot chooses the appropriate autonomous pipeline, not always the full pipeline
- `changelog.md` — documented the workflow fix


### CHANGES
- Planning commands now stop after the ready-to-implement review plan and must ask the user to choose Small/direct, Spec-first, Autopilot, or discuss more.
- The original task wording no longer counts as permission to call osf-apply or start implementation.
- Autopilot is now described as a smart autonomous mode that selects Full, Verified, or Light based on impact and complexity.
- Explore mode now invokes the `autopilot` skill for Autopilot instead of manually chaining implementation subagents.


### DESIGN DECISIONS
- Fixed the implementation-choice gate in shared `explore.md` so feat, fix, chore, refactor, perf, docs, test, ci, and docker inherit the behavior.
- Kept Spec-first as proposal followed immediately by apply after user selects that path.
- Preserved Autopilot's existing Full/Verified/Light behavior instead of flattening it into spec → implement → verify.

## [2026-04-30] - Require reviewed implementation plan before path choice


### FILES MODIFIED
- `commands/explore.md` — added implementation review plan requirements before the final path choice
- `changelog.md` — documented the prompt behavior refinement


### CHANGES
- Before asking Small/direct, Spec-first, or Autopilot, the planner now drafts an implementation review plan.
- The plan must describe files/areas, behavior changes, out-of-scope items, checks, and OpenSpec follow-up when relevant.
- The planner must self-review and revise the plan until it is zero fog before showing it to the user.
- Planning output must not include code snippets, diffs, or implementation details reserved for osf-apply.


### DESIGN DECISIONS
- Kept the review plan semantic rather than code-level to preserve planning/implementation separation.
- Added guardrails in shared `explore.md` so all planning commands inherit the behavior.

## [2026-04-30] - Delay implementation-path question until zero fog


### FILES MODIFIED
- `commands/explore.md` — clarified that implementation path is a final decision only after confirmed teach-back and zero-fog
- `changelog.md` — documented the prompt behavior fix


### CHANGES
- Prevents Small/direct, Spec-first, and Autopilot options from appearing alongside requirement clarification questions.
- Requires Feynman teach-back confirmation and Zero-Fog Checklist pass before asking implementation scope.


### DESIGN DECISIONS
- Kept the fix in shared `explore.md` so all planning commands inherit it.
- Did not modify domain command stress-test questions because the issue is workflow ordering, not domain-specific prompts.

## [2026-04-29] - Require --skip-agents-md for GitNexus indexing


### FILES MODIFIED
- `subagents/osf-analyze.md` — restored mandatory `--skip-agents-md` on GitNexus indexing commands
- `subagents/osf-apply.md` — restored mandatory `--skip-agents-md` on GitNexus indexing commands in both OpenSpec and Direct Plan modes


### CHANGES
- Every `gitnexus analyze` command in the kit now runs as `gitnexus analyze --skip-agents-md`.
- Install-and-retry commands now use `npm i -g gitnexus@latest` before rerunning `gitnexus analyze --skip-agents-md`.
- If `--skip-agents-md` is reported as an unknown option, the worker treats it as an old GitNexus version and installs the latest version.


### DESIGN DECISIONS
- `--skip-agents-md` is mandatory and must not be omitted because GitNexus indexing should not generate or overwrite agent configuration files.
- This supersedes the 2026-04-17 changelog entry that treated the flag as invalid.

## [2026-04-28] - Mark unsupported GitNexus repos in CLAUDE.md


### FILES MODIFIED
- `subagents/osf-analyze.md` — added unsupported-repository detection rule that writes a CLAUDE.md marker before fallback analysis
- `subagents/osf-apply.md` — added the same marker rule before fallback implementation tracing


### CHANGES
- When a repository is unsupported by GitNexus, such as Godot/GDScript, the worker now adds or updates project `CLAUDE.md` with: "This repo does not support GitNexus. Use codebase-retrieval, Grep, and Read instead."
- Unsupported repositories stop retrying GitNexus and proceed with codebase-retrieval plus Grep/Read manual tracing.


### DESIGN DECISIONS
- Repository-level unsupported status should be persisted where future agents will see it immediately.
- The marker is only for repo-level unsupported stacks, not transient symbol-level GitNexus misses.

## [2026-04-28] - Add GitNexus supported-language routing


### FILES MODIFIED
- `subagents/osf-analyze.md` — added language support policy for when GitNexus is required vs fallback tracing
- `subagents/osf-apply.md` — added the same policy before implementation-time blast-radius checks
- `README.md` — documented the supported-language policy for users


### CHANGES
- GitNexus is now explicitly required for structural analysis on TypeScript, JavaScript, Python, Java, Kotlin, C#, Go, Rust, PHP, Ruby, Swift, C, C++, and Dart codebases.
- Unsupported languages now route to codebase-retrieval for broad discovery plus Grep/Read for manual tracing.
- "Symbol not found" now falls back only for the affected symbol or file, not the whole GitNexus workflow.


### DESIGN DECISIONS
- GitNexus remains the primary structural analysis tool for languages it supports.
- Fallback tracing is reserved for unsupported languages or symbol-level misses, preserving blast-radius rigor without blocking unsupported stacks.

## [2026-04-28] - Refine subagent gate terminology


### FILES MODIFIED
- `subagents/osf-analyze.md` — replaced slash-command and workflow-routing wording with Skill/subagent runtime boundaries
- `subagents/osf-proposal.md` — same
- `subagents/osf-apply.md` — same
- `subagents/osf-verify.md` — same
- `subagents/osf-archive.md` — same
- `subagents/osf-researcher.md` — same
- `subagents/osf-uiux-designer.md` — same


### CHANGES
- Removed command-name-specific wording from the execution gate.
- Removed "slash command" and "route work to another workflow" terminology.
- Replaced it with runtime-specific rules: do not use Skill, do not invoke skills, do not start other subagents, return results to the caller.


### DESIGN DECISIONS
- Skill tool and subagent starts are the actual runtime actions to block; slash commands are only user-facing shorthand.
- Generic wording avoids stale command lists when the kit adds or renames commands later.
- Follow-up work is allowed as a final-report recommendation, not as an action the worker executes.

## [2026-04-28] - Add subagent execution gate to prevent skill invocation


### FILES MODIFIED
- `subagents/osf-analyze.md` — added first-tool-call execution gate and changed workflow routing text to recommendation-only wording
- `subagents/osf-proposal.md` — added execution gate and changed final apply hint to return the change name to the orchestrator
- `subagents/osf-apply.md` — added execution gate and changed verification/archive follow-up to orchestrator decision wording
- `subagents/osf-verify.md` — added execution gate and changed apply/verify follow-ups to recommendation-only wording
- `subagents/osf-archive.md` — added execution gate
- `subagents/osf-researcher.md` — added execution gate
- `subagents/osf-uiux-designer.md` — added execution gate


### CHANGES
- Added a top-of-prompt `SUBAGENT EXECUTION GATE` to every worker subagent.
- The gate explicitly blocks Skill tool usage, slash command invocation, command routing, and subagent-to-command chaining before any workflow step can run.
- The gate constrains the first tool call to the subagent's allowed work tools.
- Replaced subagent output that could trigger `/osf ...` flows with recommendation-only language for the orchestrator.


### DESIGN DECISIONS
- Worker subagents are not routers. They do their assigned work and return facts, artifacts, or recommendations to the orchestrator.
- The guard is placed at the very top of each subagent body so it is active before the first tool call.
- `commands/osf.md` remains the only command-level dispatcher; no worker subagent should invoke skills or slash commands.

## [2026-04-28] - Fix P0 workflow inconsistencies from kit audit


### FILES MODIFIED
- `commands/autopilot.md` — fixed stale `/verify` and `/apply` references to use `/osf verify` and `/osf apply`
- `subagents/osf-proposal.md` — fixed final implementation hint to use `/osf apply`
- `subagents/osf-verify.md` — fixed stale slash command references and clarified verification dimensions run inline, not via phantom verifier subagents
- `subagents/osf-apply.md` — added GitNexus indexing and blast-radius check requirement to Direct Plan Mode; fixed stale `/verify` reference


### CHANGES
- Replaced user-facing bare slash command references with `/osf ...` commands so routing matches the kit dispatcher convention.
- Removed wording in `osf-verify` that implied separate verifier subagents exist. Verification dimensions are now explicitly checked inline by `osf-verify`.
- Aligned Direct Plan Mode with OpenSpec Change Mode safety by requiring `gitnexus analyze`, `context`, and `impact` before editing symbols.


### DESIGN DECISIONS
- Kept the P0 batch narrow: workflow correctness only, no README/doc cleanup or broader prompt quality changes.
- Chose inline verification wording instead of adding new verifier subagents to preserve the kit's current minimal subagent set.
- Duplicated the blast-radius requirement into Direct Plan Mode rather than extracting a new shared section, keeping the edit localized and low risk.

## [2026-04-19] - Fix 10 inconsistencies found during kit audit

### FILES MODIFIED

- `commands/autopilot.md` — removed self-invoke line, removed archive from Verified pipeline, fixed "Terminal" → "Bash" in allowlist, added skip-duplicate-explore note for STEP0
- `commands/explore.md` — fixed "Terminal" → "Bash" in orchestrator identity gate allowlist
- `commands/git.md` — replaced `git add -A` with safe per-file staging
- `commands/browser.md` — replaced hardcoded Vietnamese routing text with user-language instructions
- `subagents/osf-apply.md` — clarified auto-verify runs inline (not via subagent spawn), added `tools` frontmatter
- `subagents/osf-verify.md` — softened "don't auto-select" rule to allow change name passthrough, added `tools` frontmatter
- `subagents/osf-analyze.md` — added `mcp__auggie-mcp__codebase-retrieval` to `tools` frontmatter
- `subagents/osf-archive.md` — added `tools` frontmatter
- `subagents/osf-proposal.md` — added `tools` frontmatter

### CHANGES

**CRITICAL fixes:**
1. Autopilot self-invoke: removed `BEFORE PROCEEDING: You MUST use the Skill tool to invoke "autopilot"` — autopilot calling itself creates a loop
2. Verified pipeline archive: removed Step 4 (archive) from Verified pipeline — Verified has no spec/change, so archive is impossible. Updated Done output to remove archive checkmark
3. osf-apply auto-verify: clarified that auto-verify runs inline (self-verify), not by spawning separate verifier subagents. osf-apply is a worker with full file access and implementation context — spawning subagents was undefined and nonsensical

**HIGH fixes:**
4. osf-analyze missing codebase-retrieval: added `mcp__auggie-mcp__codebase-retrieval` to tools frontmatter — the entire subagent depends on this tool but it wasn't in the allowlist
5. "Terminal" → "Bash": replaced "Terminal" with "Bash" in orchestrator identity gate allowlists in both explore.md and autopilot.md — Claude Code's tool is named "Bash", not "Terminal"
6. git commit `add -A`: replaced blind `git add -A` with per-file staging instruction — prevents accidentally staging secrets, credentials, or large binaries

**MEDIUM fixes:**
7. Duplicate explore load: added note in autopilot STEP0 to skip domain skill's "load explore" instruction since autopilot already loads explore in step 4
8. osf-verify auto-select: rewrote step 1 — if change name is provided in instructions, use it directly. Only ask user to choose when no name is provided
9. Consistent tools frontmatter: added `tools` field to osf-apply, osf-verify, osf-archive, osf-proposal — previously only osf-analyze, osf-researcher, osf-uiux-designer had it
10. Browser hardcoded Vietnamese: replaced 4 hardcoded Vietnamese strings in Mode A routing and Mode C closing with user-language instructions

### DESIGN DECISIONS

- Auto-verify as inline: osf-apply already has full context of what was changed. Spawning a separate verifier subagent would lose that context and require re-discovering what was modified. Inline verification is both simpler and more accurate.
- Verified pipeline no archive: archive requires openspec change artifacts. Verified pipeline explicitly uses "direct plan mode" with no spec. Following explore.md's existing guardrail: "After Verification (if spec was created)".
- Tools frontmatter: used full MCP tool name `mcp__auggie-mcp__codebase-retrieval` for codebase-retrieval since this is an MCP-provided tool, not a built-in. Other subagents (researcher, uiux-designer) don't use codebase-retrieval so they keep their existing tools list.
- git staging: matches Claude Code's own system prompt guidance ("prefer adding specific files by name rather than using git add -A")

## [2026-04-18] - Add alias: auto → autopilot in osf dispatcher

### FILES MODIFIED

- `commands/osf.md` — added Aliases section (`auto` → `autopilot`), updated dispatch rule 1 to resolve aliases before invoking

### CHANGES

- `/osf auto` now routes to `autopilot` skill
- Added Aliases section above Dispatch rules for easy expansion of future aliases
- Dispatch rule 1 updated: resolves alias first, then invokes the resolved skill name

### DESIGN DECISIONS

- Aliases are a separate section (not inline in the skill list) so they're easy to scan and extend without cluttering the skill list
- Rule 1 handles alias resolution before invocation — no special-casing needed in other rules

## [2026-04-18] - Fix: osf-apply using GitNexus commands without running gitnexus analyze first

### FILES MODIFIED

- `subagents/osf-apply.md` — added mandatory `gitnexus analyze` indexing step (new step 6) before implementation loop, renumbered steps 7-11

### CHANGES

- osf-apply was running `npx gitnexus context` and `npx gitnexus impact` in the blast radius check without ever indexing the codebase first
- Without indexing, these commands return stale or empty results — the blast radius check was effectively running on garbage data
- Added step 6 "Index codebase for blast radius checks" with same blocking pattern used in osf-analyze: run `gitnexus analyze`, install if missing, do NOT proceed until complete
- Renumbered subsequent steps (old 6→7, 7→8, 8→9, 9→10, 10→11) and updated internal step reference

### DESIGN DECISIONS

- Same indexing pattern as osf-analyze's MANDATORY FIRST ACTION — proven to work, consistent across both subagents
- Placed as a separate step before the implementation loop (not inside the loop) because indexing only needs to run once per session
- Blocking language matches osf-analyze: "do NOT start implementing until indexing completes"

## [2026-04-17] - Fix: agent skipping blast radius check when GitNexus returns "Symbol not found"

### FILES MODIFIED

- `subagents/osf-analyze.md` — added Grep/Read fallback for "Symbol not found", added tool call failure rule
- `subagents/osf-apply.md` — added same fallback and failure rule to blast radius check

### CHANGES

- When GitNexus returns "Symbol not found" (e.g. file type not supported by Tree-sitter), agent was silently skipping the entire blast radius check
- Added explicit fallback: if GitNexus fails → use Grep to find the symbol, Read to trace usage manually
- Added general tool call failure rule: when ANY tool call fails, agent MUST try an alternative approach — silently skipping is never acceptable
- Root cause: no fallback path was defined, and no rule prohibited skipping failed steps

### DESIGN DECISIONS

- Fallback is unconditional — don't check file type or guess Tree-sitter support, just react to the error
- Tool call failure rule is general (not GitNexus-specific) to cover all future failure modes
- Rule placed inline at point-of-use in both subagents for maximum visibility

## [2026-04-17] - Add Mode C: QA TEST — report-only E2E testing mode

### FILES MODIFIED

- `commands/browser.md` — added Mode C: QA TEST, updated arguments, version 2.0 → 2.1

### CHANGES

- New **Mode C: QA TEST**: activated when first argument is `e2e` or `test` (e.g., `/osf browser e2e login http://localhost:3000`)
- Report-only mode — NEVER modifies code, NEVER routes to osf-apply/feat/fix
- Walks through user-specified flow step by step like a real QA tester
- Logs bugs with console errors, network failures, broken UI
- Logs UX issues: missing feedback, confusing labels, accessibility gaps
- Logs automation difficulties: missing test-ids, dynamic selectors, timing issues
- Combines browser evidence with codebase to investigate root causes of bugs/stucks
- Outputs structured QA test report with: test steps table, bugs (with severity + root cause), UX issues, automation notes, summary
- Report format designed for developer reproducibility — clear steps, evidence, file:line references
- Added `e2e`/`test` argument detection in SETUP section
- Added guardrail: "NEVER modify code in QA TEST mode"
- All skill/command references updated from bare names (`osf-apply`, `/feat`, `/fix`, `/vibe`, `/verify`, `/browser`) to `/osf` prefix format (`/osf apply`, `/osf feat`, `/osf fix`, `/osf verify`, `/osf browser`)
- Removed stale `/osf vibe` reference — no `vibe` command exists in this kit

### DESIGN DECISIONS

- Mode C is strictly report-only with a MANDATORY guardrail — this is the core differentiator from Mode A (which routes to osf-apply) and Mode B (which routes to fix commands)
- Codebase investigation is included in the test flow — a tester who can point to `file:line` root causes produces far more actionable reports than one who only describes symptoms
- Automation notes section helps teams improve their test infrastructure by flagging elements that are hard to target in automated tests
- Report format follows QA industry patterns (bug severity, reproduction steps, expected vs actual) so developers familiar with testing workflows can parse it immediately

## [2026-04-17] - Fix: agent using --file flag with gitnexus impact (unsupported)

### FILES MODIFIED

- `subagents/osf-analyze.md` — added explicit warning that `--file` only works with `context`, not `impact`/`query`/`cypher`; added non-CLI command blocklist (`detect_changes`, `rename`)
- `subagents/osf-apply.md` — added same `--file` warning to blast radius check section; added CLI-only command allowlist (`context`, `impact` only)

### CHANGES

- Agent was running `npx gitnexus impact --repo xxx "symbol" --file "path"` which fails with exit code 1 because `impact` does not support `--file`
- Agent was also running `npx gitnexus detect_changes` which fails because `detect_changes` is not a CLI command
- Added explicit "do NOT use `--file` with `impact`" warnings in both subagents
- Added "do NOT run `detect_changes` or `rename`" blocklist in both subagents
- Root cause: `--file` was documented as a `context`-only tip, but without an explicit prohibition the agent generalized it; `detect_changes` was removed from the tool table earlier but agent found the name elsewhere and tried it

### DESIGN DECISIONS

- Same pattern as previous CLI flag fixes: explicit prohibition at point-of-use prevents agent from generalizing flags/commands
- osf-apply gets a positive allowlist ("only `context` and `impact`") while osf-analyze gets a negative blocklist — because osf-analyze legitimately uses 4 commands (query, context, impact, cypher) vs osf-apply's 2

## [2026-04-17] - Add fallback routing to osf dispatcher

### FILES MODIFIED

- `commands/osf.md` — added intent-based fallback when `$0` is empty or unsupported

### CHANGES

- `/osf` still dispatches directly when `$0` matches a supported skill
- If `$0` is empty or invalid, `/osf` now infers the best matching skill from the user's request instead of blindly invoking an unsupported name
- Added explicit intent mapping examples for common requests like bug fixes, features, refactors, performance work, docs, tests, CI, Docker, analysis, research, setup, and git operations
- Added ambiguity guardrail: if multiple skills are plausible and no best match is clear, ask the user instead of guessing

### DESIGN DECISIONS

- Keep `/osf` as a thin dispatcher — add only fallback routing logic, not full orchestration
- Prefer the most specific skill match so requests like "sửa lỗi" route to `fix` and "thêm tính năng" route to `feat` without requiring the user to name the skill explicitly
- Ambiguous requests must stop and ask rather than silently routing to the wrong workflow

## [2026-04-17] - Align GitNexus CLI usage with actual --help output

### FILES MODIFIED

- `subagents/osf-analyze.md` — rewrote tool table (CLI vs MCP-only), added `--repo` to micro tracing step, added `--file` tip
- `subagents/osf-apply.md` — added `--file` disambiguation tip for `context`

### CHANGES

- Split osf-analyze tool table into CLI-only commands (`query`, `context`, `impact`, `cypher`) — removed MCP-only tools (`detect_changes`, `rename`) entirely to avoid agent trying to run non-existent CLI commands
- Added `--repo` requirement to micro tracing step (step 3) — previously only Impact Propagation (step 4) enforced it, so agent could skip `--repo` in earlier tracing
- Added `--file <path>` tip for `context` in both osf-analyze and osf-apply — CLI supports this for disambiguating common symbol names
- Micro tracing examples now show full `npx gitnexus` commands instead of bare tool names

### DESIGN DECISIONS

- CLI vs MCP distinction: `detect_changes` and `rename` removed from guide because they have no CLI equivalent — keeping them caused agent to run non-existent commands
- `--file` is documented as a tip, not a mandatory flag — only needed when context returns multiple matches

## [2026-04-17] - Fix wrong archive path in osf-apply

### FILES MODIFIED

- `subagents/osf-apply.md` — fixed `openspec/archive/` → `openspec/changes/archive/`

### CHANGES

- The spec traceability grep was searching `openspec/archive/` which does not exist
- Corrected to `openspec/changes/archive/` which is the actual archive location

## [2026-04-17] - Fix invalid --skip-agents-md flag in osf-analyze

### FILES MODIFIED

- `subagents/osf-analyze.md` — removed the invalid `--skip-agents-md` flag from GitNexus indexing commands

### CHANGES

- Replaced `gitnexus analyze --skip-agents-md` with `gitnexus analyze`
- Replaced `npm i -g gitnexus && gitnexus analyze --skip-agents-md` with `npm i -g gitnexus && gitnexus analyze`
- Kept the same blocking indexing flow — only removed the invalid CLI flag

### DESIGN DECISIONS

- The previous command now fails with `error: unknown option '--skip-agents-md'`, so the analyzer was blocked before it could do any work
- This fix is intentionally minimal: preserve the existing indexing requirement, remove only the incompatible flag

## [2026-04-16] - Require --repo for GitNexus context and impact commands

### FILES MODIFIED

- `subagents/osf-apply.md` — made `--repo xxx` mandatory for `npx gitnexus context` and `npx gitnexus impact`
- `subagents/osf-analyze.md` — updated impact propagation examples to include mandatory `--repo xxx`

### CHANGES

- Replaced bare `npx gitnexus context` / `npx gitnexus impact` examples with `npx gitnexus context --repo xxx` / `npx gitnexus impact --repo xxx`
- Added explicit guardrail that these commands must not run without `--repo`
- Added guidance to run `npx gitnexus list` first when the repo value is not yet known
- Updated rename guidance in `osf-apply` to include the required `--repo xxx` flag

### DESIGN DECISIONS

- `context` and `impact` are repo-scoped commands, so leaving out `--repo` creates ambiguity and can target the wrong repository
- The requirement is enforced where the commands are actually taught: `osf-apply` for implementation-time checks and `osf-analyze` for structural analysis

## [2026-04-15] - Replace Playwright MCP with dev-browser in browser command

### FILES MODIFIED

- `commands/browser.md` — full rewrite from Playwright MCP tools to dev-browser CLI (v1.0 → v2.0)

### CHANGES

- Replaced all Playwright MCP tool calls (`browser_click`, `browser_snapshot`, `browser_screenshot`, etc.) with dev-browser CLI scripts piped via Bash heredoc
- New SETUP section: auto-installs dev-browser via `npm install -g dev-browser && dev-browser install`
- New comprehensive "dev-browser Guide" section: CLI usage, Core API, Page API (navigation, snapshots, locators, actions, waiting, screenshots, evaluate, file I/O), workflow loop, 4 practical examples
- Adapted Network & WebSocket monitoring scripts to run inside dev-browser scripts via `page.evaluate()`
- All Mode A/B steps updated to use dev-browser script patterns instead of MCP tool calls
- Cleanup section updated to reference `~/.dev-browser/tmp/` instead of Playwright artifacts
- Added guardrail: "Always use quoted heredoc `<<'SCRIPT'`"
- Supports `--headless`, `--connect` flags
- Removed Playwright MCP server dependency from compatibility

### DESIGN DECISIONS

- **Why dev-browser over Playwright MCP**: dev-browser requires zero MCP configuration — just `npm install -g` and go. Playwright MCP requires server setup in Claude's MCP config. dev-browser is also faster (3m53s vs 4m31s), cheaper ($0.88 vs $1.45), and uses fewer turns (29 vs 51) per benchmark.
- **Comprehensive API guide**: dev-browser is new (agent may not be familiar), so the guide section is thorough with examples for every common pattern. This is intentional — reduces trial-and-error.
- **Named pages emphasized**: `browser.getPage("main")` persists across script invocations — this is dev-browser's key advantage over Playwright MCP where each tool call is stateless. Guide highlights this pattern.
- **One script per logical action**: recommended pattern keeps evidence clear and debuggable, matching the existing evidence-at-every-step philosophy.
- **Reference sources**: nullmastermind/spec-ade-claw-template SKILL.md (dev-browser skill pattern) and SawyerHood/dev-browser README (API reference, benchmarks)

## [2026-04-14] - Add spec traceability: search archived specs before modifying code

### FILES MODIFIED

- `subagents/osf-apply.md` — added spec search step in blast radius check (step 6c)

### CHANGES

- After gitnexus context/impact, osf-apply now greps `openspec/archive/*/tasks.md` for the file being modified
- If a previous spec touched the file, reads its proposal.md and design.md for design intent
- Zero new infrastructure — uses existing archive and tasks.md content

### DESIGN DECISIONS

- **Search over spec-map**: no new file to maintain, no extra prompt to teach agent about a new file. Archive already contains the data (tasks.md lists files touched). Grep is sufficient.
- **Integrated into blast radius check**: agent already pauses here to run gitnexus. Adding spec search at this point costs minimal overhead and the agent is already in "understand before modify" mode.
- **Read proposal + design, not tasks**: tasks.md tells you WHAT was done, but proposal/design tell you WHY — that's what matters for maintenance.

## [2026-04-14] - Fix: osf-apply skipping GitNexus blast radius check

### FILES MODIFIED

- `subagents/osf-apply.md` — rewrote step 6 to make GitNexus check a blocking gate, not an optional bullet

### CHANGES

- Blast radius check promoted from sub-bullet to its own labeled step (c) with MANDATORY tag
- Added blocking language: "Do NOT proceed to writing code until both commands have run"
- Added self-check: "If you catch yourself writing code without having run gitnexus context and impact, STOP"
- Commands shown in code block for visual prominence
- Each sub-step now labeled (a-g) instead of flat bullet list — clearer sequence
- Same pattern as other compliance fixes in this kit (autopilot skill loading, delegation enforcement)

### DESIGN DECISIONS

- Root cause: instructions buried as a sub-bullet in a flat list are treated as optional guidance. Same pattern as autopilot skipping skill loading (2026-04-02) — top-level placement + blocking language + self-check is the proven fix.
- Labeled steps (a-g) instead of bullets because sequence matters: explore → blast radius → code → mark complete. Bullets imply "pick any".

## [2026-04-14] - Add GitNexus blast radius check to osf-apply implementation loop

### FILES MODIFIED

- `subagents/osf-apply.md` — added blast radius check step in task implementation loop (step 6)

### CHANGES

- Before modifying a function/class/method, osf-apply now runs `npx gitnexus context` and `npx gitnexus impact` to understand callers and blast radius
- HIGH/CRITICAL risk triggers d=1 dependent updates and user warning
- Renames use `npx gitnexus context` to find all references instead of blind find-replace
- Uses CLI commands (not MCP function calls) for consistency with terminal-based workflow

### DESIGN DECISIONS

- **Tactical, not strategic**: osf-apply checks blast radius per-symbol during implementation. Strategic analysis (full codebase sweep) remains osf-analyze's job.
- **Only context + impact**: skipped `query`, `cypher`, `detect_changes` (no CLI equivalent), and debugging tools — not relevant to an implementation worker.
- **CLI over MCP functions**: `npx gitnexus context/impact` are the correct invocation for a subagent running in terminal. `gitnexus_rename` MCP tool not used since it has no CLI equivalent — instead, context lookup + manual update.

## [2026-04-11] - Add subagent list to osf dispatcher, rename command → skill

### FILES MODIFIED

- `commands/osf.md` — renamed "command" to "skill" in frontmatter and body, added supporting subagents list (all 7)

### CHANGES

- Frontmatter description and argument-hint now say "skill" instead of "command"
- "Available commands" → "Available skills"
- "beyond the command name" → "beyond the skill name"
- Added "Supporting subagents" section listing all 7 subagents with one-line descriptions for discoverability

### DESIGN DECISIONS

- "Skill" is more accurate than "command" — these are kit skills invoked via the Skill tool, not shell commands
- Subagent list is informational ("used internally by skills") — users don't invoke subagents directly via /osf

## [2026-04-11] - Extract osf-analyze subagent, integrate into all workflows

### FILES CREATED

- `subagents/osf-analyze.md` — full analysis engine (GitNexus + codebase-retrieval), adapted from commands/analyze.md

### FILES MODIFIED

- `commands/analyze.md` — rewritten as thin wrapper (v1.1 → v2.0), delegates to osf-analyze subagent
- `commands/explore.md` — added osf-analyze to Shared Subagent Table with judgment-based guidance
- `commands/autopilot.md` — added Structural Analysis step (step 2) to Autonomous Exploration (v1.2 → v1.3)
- `README.md` — added osf-analyze to subagent table, updated workflow diagrams and tips

### CHANGES

- New `osf-analyze` subagent: full analysis engine with GitNexus indexing, dual-tool system (macro/micro lens), tool discipline, and analysis method. Self-contained — handles its own indexing internally.
- `commands/analyze.md` is now a thin wrapper (same pattern as apply.md, verify.md) — gathers context, delegates to osf-analyze
- All planning commands (feat, fix, chore, refactor, perf, docs, test, ci, docker) can now delegate structural analysis to osf-analyze during exploration via the shared subagent table in explore.md
- Autopilot's autonomous exploration now includes a dedicated Structural Analysis step for complex changes
- Orchestrator calls osf-analyze by judgment — not every exploration needs it, but cross-cutting changes with unclear blast radius do

### DESIGN DECISIONS

- **Subagent over inline integration**: user requested subagent extraction so future upgrades to analyze propagate to all workflows automatically. Single source of truth — no duplication of GitNexus logic in explore.md.
- **Judgment-based, not mandatory**: osf-analyze is called when the orchestrator judges structural insight is needed. Simple, isolated changes don't need blast radius analysis. This avoids unnecessary overhead.
- **Thin wrapper preserved**: `/osf analyze` still works for ad-hoc analysis without planning. Consistent with existing pattern (apply.md, verify.md, proposal.md).
- **Subagent handles indexing internally**: GitNexus indexing runs inside osf-analyze, not in the orchestrator. Orchestrator doesn't need to know implementation details. Future tool changes only affect the subagent.

## [2026-04-11] - Rename osf-skill-explore-mode → explore for naming consistency

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` → `commands/explore.md` — renamed file, updated frontmatter `name: explore`
- `commands/feat.md` — Skill tool invocation: `"osf-skill-explore-mode"` → `"explore"`
- `commands/fix.md` — same
- `commands/chore.md` — same
- `commands/refactor.md` — same
- `commands/perf.md` — same
- `commands/docs.md` — same
- `commands/test.md` — same
- `commands/ci.md` — same
- `commands/docker.md` — same
- `commands/setup.md` — same
- `commands/autopilot.md` — same

### CHANGES

- Renamed `osf-skill-explore-mode.md` to `explore.md` and updated frontmatter name to `explore`
- Updated all 10 planning commands + autopilot to invoke `"explore"` instead of `"osf-skill-explore-mode"`
- All other commands in the kit use short names (feat, fix, apply, verify, etc.) — this rename brings the shared skill in line

### DESIGN DECISIONS

- `osf-skill-explore-mode` was the only command with the `osf-skill-` prefix — inconsistent with the rest of the kit
- Changelog historical references left as-is (they document what happened at the time)

## [2026-04-10] - Add fluid "After Report" routing to analyze command

### FILES MODIFIED

- `commands/analyze.md` — added "After Report" section with dynamic next-step options (v1.2 → v1.3)

### CHANGES

- New "After Report" section: after presenting analysis findings, offers actionable next steps that route into the rest of the kit
- Dynamic options based on findings: fix (if breaking dependents), refactor (if structural problems), feat (if new capability needed), go deeper, create spec, or done
- Command routes (fix/refactor/feat) invoke target command via Skill tool with analysis context passed through
- "Go deeper" loops back into Analysis Method
- "Create spec" delegates to osf-proposal with findings
- Analyze is no longer a dead end — it's a gateway into the kit's workflow

### DESIGN DECISIONS

- Options are dynamic, not static — only show what's relevant to the actual findings. Showing "fix breaking dependents" when none were found is noise.
- Analyze stays read-only — it routes to other commands for implementation, never implements itself. Guardrails unchanged.
- Uses Skill tool for command routing (not Agent tool) because feat/fix/refactor are commands, not subagents. Only osf-proposal uses Agent tool since it's a subagent.

## [2026-04-10] - Add Impact Propagation step + concrete CLI commands in analyze

### FILES MODIFIED

- `commands/analyze.md` — added Impact Propagation step, replaced abstract tool names with `npx gitnexus` commands (v1.1 → v1.2)

### CHANGES

- New step 4 "Impact Propagation" in Analysis Method: systematically traces all dependents of changed symbols via `npx gitnexus context` (depth 2) and `npx gitnexus impact`, then flags breaking dependents
- Interface/type change checklist: implementors, call sites, type assertions, generic constraints — all MUST be traced
- Completeness check: if `context` returns N dependents, all N must appear in report
- Report step now requires a "Breaking dependents" section when impact propagation finds consumers that need updating
- Replaced all abstract "GitNexus `tool`" references with actual CLI commands (`npx gitnexus context "<symbol>"`, `npx gitnexus impact "<symbol>"`, etc.) throughout the entire file — tool table, discipline table, analysis method, guardrails

### DESIGN DECISIONS

- Root cause: the old flow (macro sweep → micro trace → report) never explicitly said "for each changed symbol, walk the dependency graph outward and check every consumer." The AI would spot-check a few symbols but miss transitive dependents — e.g., changing an interface without flagging all implementors
- Impact Propagation is a separate step (not merged into Micro tracing) because it has a different goal: micro tracing verifies what codebase-retrieval found, impact propagation systematically walks outward from the changed symbol regardless of what codebase-retrieval found
- Concrete `npx gitnexus` commands replace abstract tool names because the AI needs to run terminal commands, not call MCP tools — abstract names like "GitNexus `context`" left ambiguity about HOW to invoke them

## [2026-04-09] - Fix: analyze command using Grep instead of GitNexus tools

### FILES MODIFIED

- `commands/analyze.md` — added Tool Discipline section (v1.1)

### CHANGES

- Added "Tool Discipline" section with explicit decision table: "I want to X → use GitNexus Y, NOT Grep"
- Covers 6 common analysis tasks that AI defaults to Grep for: find callers, trace dependencies, find related code, assess blast radius, understand connections, check change impact
- Grep/Read restricted to: reading file content AFTER GitNexus identified the location, or non-code files GitNexus doesn't index
- Explains WHY Grep is wrong: text matches can't distinguish definition vs call site vs comment vs unrelated same-named symbol

### DESIGN DECISIONS

- Root cause: AI defaults to Grep because it's fast and familiar. GitNexus MCP tools require explicit calls. Without a hard "use THIS not THAT" table, the AI rationalizes Grep as "good enough"
- Decision table format chosen because it maps the AI's intent ("I want to find callers") directly to the correct tool, intercepting the decision at the moment it's made

## [2026-04-09] - Fix: analyze command skipping GitNexus indexing

### FILES MODIFIED

- `commands/analyze.md` — moved indexing to top-level blocking gate (v1.1)

### CHANGES

- Moved `gitnexus analyze --skip-agents-md` from a section heading ("Step 0") to a MANDATORY FIRST ACTION at the very top of the prompt, before any tool system description
- Added blocking language: "do NOT proceed until indexing completes"
- Added self-check: "If you find yourself using codebase-retrieval without having run this command first, STOP and run it now"
- Combined install+retry into single command: `npm i -g gitnexus && gitnexus analyze --skip-agents-md`

### DESIGN DECISIONS

- Same root cause as autopilot skill-loading bug (2026-04-02): instructions in section headings are treated as optional guidance. Top-of-prompt imperative placement maximizes compliance.
- Self-check instruction acts as safety net if AI somehow skips past

## [2026-04-09] - Fix: analyze command ignoring GitNexus, using only codebase-retrieval

### FILES MODIFIED

- `commands/analyze.md` — rewrote tool separation, enforced dual-tool usage (v1.0 → v1.1)

### CHANGES

- Hard-separated the two intelligence systems with clear identities: codebase-retrieval = macro lens (semantic discovery), GitNexus = micro lens (structural tracing via Tree-sitter AST)
- Added CRITICAL guardrail: analysis using only codebase-retrieval without GitNexus tool calls is explicitly INCOMPLETE
- Added "Resolve conflicts" step: when tools disagree, trust GitNexus for structural claims (AST-based) over codebase-retrieval (semantic similarity)
- Explained each tool's weakness: codebase-retrieval confuses same-named symbols across different flows; GitNexus can miss semantic context
- Enforced analysis flow: macro first (codebase-retrieval for landscape), then micro (GitNexus to clarify exact connections)

### DESIGN DECISIONS

- Root cause: AI defaults to codebase-retrieval because it's always available and familiar. GitNexus MCP tools require explicit calls that the AI skips when not strongly enforced
- "Macro/micro" framing chosen because it maps to the actual tool strengths: codebase-retrieval finds broadly by meaning, GitNexus traces precisely by AST structure
- Trust hierarchy (GitNexus > codebase-retrieval for structural claims) is justified: Tree-sitter AST parsing is deterministic, semantic similarity is probabilistic

## [2026-04-09] - Add /analyze command for codebase analysis via GitNexus

### FILES CREATED

- `commands/analyze.md` — utility command for codebase analysis using GitNexus knowledge graph + codebase-retrieval

### FILES MODIFIED

- `commands/osf.md` — added `analyze` to available commands list
- `README.md` — added `/osf analyze` to Utility Commands table (5 → 6 commands)

### CHANGES

- New `/osf analyze` command: indexes codebase with GitNexus then uses knowledge graph tools (query, context, impact, detect_changes, rename, cypher) combined with codebase-retrieval for deep structural analysis
- Auto-installs GitNexus if not present (`npm i -g gitnexus`)
- Read-only — reports findings without modifying code
- Covers use cases: impact analysis before changes, dependency tracing, blast radius assessment, feasibility evaluation, refactor scope analysis

### DESIGN DECISIONS

- Standalone utility command (like explain.md) — does NOT load osf-skill-explore-mode because analyze is not a planning command
- Dual intelligence approach: GitNexus for structural/relational data (call chains, dependencies, blast radius) + codebase-retrieval for semantic search (conceptual matches) — cross-validation between both sources increases confidence
- `--skip-agents-md` flag on gitnexus analyze to avoid overwriting project's existing agent config
- Read-only guardrail is strict — analyze never suggests inline code edits, only reports findings with file:line references

## [2026-04-08] - Add /setup command for project scaffolding

### FILES CREATED

- `commands/setup.md` — planning command for project setup from boilerplate, docs, or tech stack

### CHANGES

- New `/setup` command: explores what the user wants to build, researches latest docs/versions via osf-researcher, then scaffolds with informed decisions
- Mandatory research phase — always delegates to osf-researcher before planning (unique to this command)
- Supports 4 input types: tech stack names, boilerplate/template URL, documentation URL, vague goal
- Tech Stack Suggestions section with 3 tiers (quickwin → balanced → prod-ready) for Web fullstack, API/Backend, and Mobile use cases
- 15 stress-test questions covering package manager through security baseline
- Greenfield vs brownfield detection
- Follows same pattern as all planning commands (loads osf-skill-explore-mode)

### DESIGN DECISIONS

- Mandatory research phase is the key differentiator from other commands — setup must always start with current information to avoid scaffolding with outdated versions or deprecated APIs
- Tech stack suggestions are starting points, not prescriptions — osf-researcher validates them against latest state before recommending
- 15 stress-test questions cover the full spectrum from quickwin to prod-ready, so the command works for both prototypes and production projects
- Brownfield support ensures the command works for adding tech to existing projects, not just greenfield scaffolding

## [2026-04-07] - Update README: slash commands now use /osf prefix

### FILES MODIFIED

- `README.md` — all slash command references changed from `/feat`, `/fix`, `/autopilot`, etc. to `/osf feat`, `/osf fix`, `/osf autopilot`, etc.

### CHANGES

- All command references in tables, examples, workflow diagrams, and tips updated to use `/osf [command]` format
- Matches the `/osf` dispatcher command added earlier

## [2026-04-07] - Add /osf dispatcher command (renamed from /skill)

### FILES CREATED

- `commands/osf.md` — dispatcher that routes `/osf [command] [args]` to the target command via Skill tool

### CHANGES

- New `/osf` command: takes first argument as command name, invokes it via Skill tool
- Passes remaining arguments as context to the invoked command
- Lists all 19 available commands for discoverability

### DESIGN DECISIONS

- Pure dispatcher — no orchestration, no context gathering, just routes $0 to Skill tool
- Uses $ARGUMENTS for full arg passthrough so the target command sees everything after its name

## [2026-04-04] - Add direct slash commands for all subagents (flow-aware)

### FILES CREATED

- `commands/apply.md` — direct call to osf-apply subagent
- `commands/archive.md` — direct call to osf-archive subagent
- `commands/proposal.md` — direct call to osf-proposal subagent
- `commands/research.md` — direct call to osf-researcher subagent
- `commands/uiux-design.md` — direct call to osf-uiux-designer subagent
- `commands/verify.md` — direct call to osf-verify subagent

### CHANGES

- 6 new slash commands, one per subagent, for direct invocation
- Each command is context-aware: gathers conversation context (plan, decisions, change name) before launching the subagent
- Works fluid with existing flow — e.g. user brainstorms with /feat then types /apply to implement
- apply/verify/archive detect OpenSpec change names from prior steps and pass them automatically
- proposal/apply include the "Invoking Subagents with Change Names" format from osf-skill-explore-mode
- research/uiux-design pick up active brainstorm context for targeted results
- No skill loading, no explore mode — just context gathering + direct subagent call

### DESIGN DECISIONS

- Flow-aware, not dumb wrappers — commands gather conversation context before launching subagent, matching how the orchestrator (feat/fix/etc.) briefs subagents
- Same briefing format as osf-skill-explore-mode's "Invoking Subagents with Change Names" section
- Commands are still minimal — no orchestration logic, just context pass-through

## [2026-04-04] - Hybrid self-check: ORCHESTRATOR IDENTITY GATE replaces DELEGATION ENFORCEMENT

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — replaced DELEGATION ENFORCEMENT with ORCHESTRATOR IDENTITY GATE
- `commands/autopilot.md` — added ORCHESTRATOR IDENTITY GATE section, simplified Guardrails

### CHANGES

- New ORCHESTRATOR IDENTITY GATE in shared skill (osf-skill-explore-mode) — covers all 9 planning commands (feat, fix, chore, refactor, perf, docs, test, ci, docker) + autopilot
- Autopilot gets its own gate copy before skill loading (active from the start)
- Autopilot Guardrails simplified: 2 redundant rules (NEVER implement + NEVER fix) merged into single gate reference
- Gate uses 3 reinforcing patterns:
  1. Identity-based ("you ARE an orchestrator") instead of rule-based ("don't do X") — harder to rationalize around
  2. Allowlist of permitted tools (Read, Glob, Grep, Agent, Skill, Terminal, codebase-retrieval, WebSearch, WebFetch) — anything not listed = delegate
  3. Procedural checkpoint before Edit/Write/NotebookEdit/Bash — forces a pause-and-ask moment
- Red flag detection: "if you catch yourself writing code content inside a tool call, stop mid-thought"

### DESIGN DECISIONS

- Previous fixes (3 iterations) were all rule-based ("NEVER do X") — AI rationalizes around rules. This fix uses identity + allowlist + checkpoint, a fundamentally different pattern.
- Allowlist > blocklist: listing what's allowed is safer than listing what's forbidden (new tools default to blocked)
- Gate in shared skill covers all planning commands automatically — no per-command duplication needed
- Autopilot gets a separate copy because its gate must be active before skills are loaded (STEP 0)
- Terminal and codebase-retrieval added to allowlist per user request
- Research confirmed Claude Code hooks (PreToolUse) cannot distinguish which skill/command is running — hooks only see tool_name and tool_input, no skill context. Prompt-level enforcement remains the only viable approach for context-aware gating.

## [2026-04-03] - Fix: autopilot implementing code directly instead of delegating to osf-apply

### FILES MODIFIED

- `commands/autopilot.md` — added top-level delegation guardrail, added inline warnings to all pipeline Implement steps

### CHANGES

- New guardrail (first in list): "NEVER implement code yourself — ALL pipelines delegate to osf-apply via Agent tool. No exceptions, not even for 1-line changes."
- Added "Do NOT write or edit code yourself." inline to Full Step 2, Verified Step 1, and Light Step 1
- Root cause: existing guardrail "NEVER fix code yourself after verify" only covered post-verify. The AI interpreted this as permission to implement directly during the initial Implement step, especially in Light pipeline where there's no verify phase.

### DESIGN DECISIONS

- Same pattern as the verify-fix delegation fix: inline warnings at point-of-use + top-level guardrail as safety net
- Existing post-verify guardrail kept separately — it covers a different scenario (fixing after verify vs initial implementation)

## [2026-04-03] - Fix: autopilot self-fixing code after verify instead of delegating

### FILES MODIFIED

- `commands/autopilot.md` — expanded Verify-Fix Loop with explicit Agent tool calls, added guardrail

### CHANGES

- Verify-Fix Loop in Full and Verified pipelines now has numbered steps with explicit `Agent tool with subagent_type: "osf-apply"` and `Agent tool with subagent_type: "osf-verify"` calls
- Added "Do NOT fix code yourself" and "Do NOT skip re-verify" inline warnings at each step
- New guardrail: "NEVER fix code yourself after verify — delegate to osf-apply, then re-verify via osf-verify"
- Root cause: compressed instruction "use osf-apply to fix → osf-verify again" was interpreted as "fix it myself"

## [2026-04-02] - Fix: move skill loading to STEP 0 hard gate at top of command

### FILES MODIFIED

- `commands/autopilot.md` — restructured to put skill loading as absolute first action

### CHANGES

- Created "STEP 0: LOAD SKILLS (MANDATORY — DO THIS FIRST)" section at the very top of the command
- Skill loading is now before Detect Mode, before Autonomous Exploration, before everything
- Includes self-check: "If you find yourself reading code without having made these calls, STOP and make them now"
- Removed duplicate skill loading from old step 1 of Autonomous Exploration
- Renumbered exploration steps (1-4 instead of 1-5)
- Root cause: instruction buried in subsection was treated as optional guidance — AI skipped it and went straight to exploring/implementing

### DESIGN DECISIONS

- Top-of-prompt placement maximizes compliance — AI reads constraints at the top more reliably than nested ones
- Self-check instruction acts as a safety net if the AI somehow skips past

## [2026-04-02] - Fix: flat-load skills in order (skills can't call other skills)

### FILES MODIFIED

- `commands/autopilot.md` — flat-load osf-skill-explore-mode then domain skill

### CHANGES

- Skills cannot invoke other skills internally — chain loading doesn't work
- Autopilot now flat-loads both skills in order via Skill tool:
  1. osf-skill-explore-mode (base layer)
  2. Domain skill like feat/fix/etc. (domain layer)
- Removed "Do NOT load osf-skill-explore-mode directly" — it MUST be loaded directly

## [2026-04-02] - Fix: autopilot skipping Skill tool call after classify

### FILES MODIFIED

- `commands/autopilot.md` — made Skill tool call a blocking, unmissable step

### CHANGES

- Rewrote step 1 instruction to be imperative and blocking: "IMMEDIATELY AFTER ANNOUNCING — before reading any code, before exploring anything — you MUST use the Skill tool"
- Added concrete example: `if you classified as "feat", call Skill tool with skill: "feat"`
- Added "This is BLOCKING — do NOT proceed to step 2 until the Skill tool call completes"
- Root cause: AI was reading "Then you MUST..." as a soft suggestion and skipping ahead to codebase exploration

## [2026-04-02] - Fix: autopilot skill loading order (domain first → chains osf-skill-explore-mode)

### FILES MODIFIED

- `commands/autopilot.md` — fixed skill loading order, removed top-level osf-skill-explore-mode loading

### CHANGES

- Removed top-level "BEFORE PROCEEDING: load osf-skill-explore-mode" — this caused autopilot to load only the shared skill and skip the domain skill
- Domain skill (feat, fix, etc.) is now loaded FIRST via Skill tool in step 1 of exploration
- Domain skill internally chain-loads osf-skill-explore-mode — correct order: feat → osf-skill-explore-mode
- Added explicit instruction: "Do NOT load osf-skill-explore-mode directly. Always load the domain skill first."

### DESIGN DECISIONS

- Same chain as interactive commands: feat.md says "BEFORE PROCEEDING: load osf-skill-explore-mode" — so loading feat triggers the chain automatically
- For Mode B (continuation), skills are already loaded from prior brainstorm session — no re-loading needed

## [2026-04-02] - Autopilot: smart pipeline selection (Full/Verified/Light)

### FILES MODIFIED

- `commands/autopilot.md` — replaced fixed pipeline with 3-tier assessment

### CHANGES

- Autopilot now assesses work complexity/sensitivity after exploration and selects the appropriate pipeline:
  - **Full** (spec → implement → verify → archive): complex, sensitive, high blast radius
  - **Verified** (implement → verify): small scope but sensitive logic (auth, data, concurrency)
  - **Light** (implement only): simple, isolated, low risk
- Added "Assess Pipeline" section with criteria and examples for each tier
- Verify-fix loop (max 3 rounds) applies to both Full and Verified pipelines
- Done output adapts to pipeline used
- Version bumped to 1.2

### DESIGN DECISIONS

- Assessment is AI judgment, not rule-based — criteria are guidelines, not hard thresholds
- Light pipeline still gets osf-apply's internal auto-verify — not completely unverified
- Verified pipeline uses direct plan mode (no spec) — spec overhead not justified for small work
- Full pipeline unchanged from before — spec → implement → verify → archive

## [2026-04-02] - Fix: autopilot loading skills via Skill tool

### FILES MODIFIED

- `commands/autopilot.md` — rewritten to load skills via Skill tool instead of duplicating logic

### CHANGES

- Autopilot now loads `osf-skill-explore-mode` via Skill tool (shared delegation enforcement, subagent table, OpenSpec awareness, guardrails)
- Cold start now loads the domain command (feat, fix, etc.) via Skill tool for domain-specific stress-test questions and zero-fog checklist
- Removed duplicated sections: DELEGATION ENFORCEMENT, CLI NOTE, SETUP, Subagents table — all provided by the shared skill
- Added AUTOPILOT OVERRIDES section that explicitly overrides interactive parts of the skill (no user questions, no "Ready to Implement" options, no archive prompt)
- Self-validate step now references domain skill's stress-test and zero-fog instead of hardcoded checks
- Version bumped to 1.1

### DESIGN DECISIONS

- Same pattern as all 9 planning commands: load shared skill via Skill tool, keep only command-specific content
- Domain skill loading (feat, fix, etc.) gives autopilot access to domain-specific exploration guidance without duplicating it
- AUTOPILOT OVERRIDES section is explicit about what changes from interactive mode — prevents the AI from falling back to interactive behavior

## [2026-04-02] - Autopilot: auto-archive, zero stops

### FILES MODIFIED

- `commands/autopilot.md` — archive is now step 5 in pipeline, no user stops
- `README.md` — updated examples and descriptions to reflect auto-archive

### CHANGES

- Pipeline is now fully autonomous: spec → apply → verify → archive (no stops at all)
- Removed "ask about archive" stop point — archive runs automatically after verify passes
- Updated guardrails, subagent table, done output, and README examples

## [2026-04-02] - Add /autopilot command

### FILES CREATED

- `commands/autopilot.md` — new standalone command for full autonomous pipeline

### CHANGES

- New `/autopilot` command with two modes:
  - Cold start (`/autopilot [request]`): classifies work type → autonomous deep exploration (same depth as brainstorm, all decisions made autonomously based on codebase patterns + web research) → pipeline
  - Continuation (`/autopilot` mid-conversation): picks up existing brainstorm context → pipeline
- Pipeline chains osf-proposal → osf-apply → osf-verify without stopping
- Verify-fix loop: if osf-verify reports CRITICALs → osf-apply (fix) → osf-verify → repeat until 0 CRITICALs (max 3 external rounds)
- Only stop point: ask about archive after pipeline completes
- Reuses all existing subagents (osf-proposal, osf-apply, osf-verify, osf-archive, osf-researcher)

### DESIGN DECISIONS

- Standalone command, not a modification to osf-skill-explore-mode — autopilot is a different workflow (autonomous vs interactive)
- Cold start does same-depth exploration as brainstorm but makes all decisions autonomously — ambiguity resolved via codebase patterns first, web research second
- Max 3 external verify-fix rounds on top of osf-apply's internal 2-round loop — prevents infinite loops while being thorough
- Archive is the only user interaction point — everything else is fully autonomous

## [2026-04-02] - Add Autopilot option to implementation workflow

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — added Autopilot as option C in scope assessment, added Autopilot subsection in Implementation Options

### CHANGES

- New "Autopilot" scope option (C) in "Ready to Implement": full pipeline (spec → implement → verify) runs without stopping after user confirms
- New "Autopilot" subsection in Implementation Options: chains osf-proposal → osf-apply → osf-verify automatically, then asks about archive
- Moved "Unsure" from option C to option D
- Moved ★ recommendation from "Large" to "Autopilot"

### DESIGN DECISIONS

- Autopilot stops after verify and asks about archive — archive is a finalizing action that benefits from user confirmation
- Placed as a top-level scope option (not a sub-option of Large) because it's a distinct workflow mode, not a variant of large work

## [2026-04-01] - Fix: orchestrator self-implementing small changes instead of delegating

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — added "no exceptions for small changes" to DELEGATION ENFORCEMENT

### CHANGES

- Closed the "it's just 1 line" escape hatch in DELEGATION ENFORCEMENT — AI was reasoning that trivially small fixes don't need delegation overhead and implementing directly
- Fix is in the shared skill, so all 9 planning commands (feat, fix, chore, refactor, perf, docs, test, ci, docker) are covered

### DESIGN DECISIONS

- One sentence addition, not a new section — the rule already exists, it just needed the loophole closed explicitly

## [2026-04-01] - Fix: osf-apply auto-committing without user request

### FILES MODIFIED

- `subagents/osf-apply.md` — added "Never commit" guardrail
- `commands/osf-skill-explore-mode.md` — updated osf-apply table entry to say "Does NOT commit"

### CHANGES

- osf-apply now has an explicit guardrail: committing is the user's responsibility
- Shared subagent table clarifies osf-apply does not commit, so the orchestrator's briefing won't include "commit created" as an expected output

### DESIGN DECISIONS

- Root cause was two-fold: orchestrator's briefing template was filled with "commit created" as expected output, and osf-apply had no hard stop against committing
- Fix targets both: the table description prevents the expectation from forming, the guardrail is the hard stop if it does

## [2026-04-01] - Debugging Toolkit for fix command (v3.0)

### FILES MODIFIED

- `commands/fix.md` — rewrote "What You Might Do" into structured Debugging Toolkit, added Tool Priority Chain, enhanced Zero-Fog Checklist

### CHANGES

- New "Debugging Toolkit" section replaces the old loosely-organized investigation bullets
- 8 named debugging methods adapted for AI agents that read code (not interactive debuggers):
  - Backward Reasoning (error → trace writes back to source)
  - Wolf Fence / Binary Search (bisect call chains spatially)
  - Five Whys (operationalized — each "why" = a new search query)
  - Rubber Duck Narration (line-by-line code walkthrough, flag divergence from contract)
  - Scientific Method (hypothesis → falsification — guards against confirmation bias)
  - Mental Mutation ("what if > were >=?" — reason about which mutation explains failure)
  - Delta Debugging (bisect changes between known-good and current-failing state)
  - Suspiciousness Ranking (SBFL-style — rank functions by failure frequency across traces)
- New "Tool Priority Chain" section: codebase-retrieval (semantic, first choice) → grep (pattern) → read (precise) with examples for each
- New "Anti-patterns" section: 5 concrete don'ts (theorize without reading, stop at first explanation, read blindly, fix symptoms, accept file-level localization)
- Zero-Fog Checklist enhanced with 2 new items:
  - Causal chain from root cause to symptom must be traceable in code
  - At least one alternative hypothesis must be explicitly falsified
- Removed redundant sections: "Investigate the codebase" (merged into toolkit), "Look up API documentation" (covered by "Research external knowledge")
- Version bumped to 3.0

### DESIGN DECISIONS

- Methods are presented as a toolkit (pick what fits), not a linear workflow — different bugs need different approaches
- Research-backed: Rubber Duck, Wolf Fence, Five Whys, Scientific Method, Delta Debugging, SBFL are all established debugging methodologies adapted for static code reading
- Key research insight driving the design: line-level fault localization is 27.8x more impactful than file-level (empirical study on LLM bug-fixing agents). Every method is designed to drive toward the exact line.
- Tool priority chain (codebase-retrieval → grep → read) matches the wide-to-narrow search pattern that works best for AI agents
- Anti-patterns section added because the most common AI debugging failure is confirmation bias (fixating on first plausible explanation without falsification)

## [2026-04-01] - Add explain command

### FILES CREATED

- `commands/explain.md` — new command for understanding how features work in the codebase

### CHANGES

- New `/explain` command: explores codebase then applies Feynman Technique to explain features to the user
- Core loop: explore → explain simply → find gaps in understanding → re-explore → re-explain
- Standalone command — does not use osf-skill-explore-mode (not a planning command)
- Read-only: never modifies files
- Uses codebase-retrieval, Grep, Glob, Read for exploration
- Explains with analogies, ASCII diagrams, layered detail (big picture → zoom in)

## [2026-03-31] - Auto-verify after implementation for high-risk work

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — replaced "After Implementation (if spec was created)" with intelligent auto-verify logic

### CHANGES

- osf-verify now auto-runs when AI judges the work warrants it (scope, risk, interacting parts, behavior preservation, cost of mistakes)
- No hard-coded heuristics — AI reasons about the specific context
- Only asks "Want to verify?" when AI judges work is simple and low-risk
- Auto-verify tells user why in one line before running
- Removed "(if spec was created)" gate — verify can now trigger for any risky work regardless of spec

### DESIGN DECISIONS

- Heuristics are intentionally broad — better to auto-verify too much than too little
- "After Verification" section unchanged — archive still requires spec (nothing to archive without one)

## [2026-03-31] - Stress-test: self-answer first, only ask genuine gaps

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — added Stress-test Protocol section, updated guardrail line
- `commands/feat.md` — reframed stress-test header
- `commands/fix.md` — reframed stress-test header
- `commands/chore.md` — reframed stress-test header
- `commands/refactor.md` — reframed stress-test header
- `commands/perf.md` — reframed stress-test header
- `commands/docs.md` — reframed stress-test header
- `commands/test.md` — reframed stress-test header
- `commands/ci.md` — reframed stress-test header
- `commands/docker.md` — reframed stress-test header

### CHANGES

- Added Stress-test Protocol in shared skill: defines 3-step process (explore codebase → Feynman check → classify as self-resolved / style choice / genuine confusion)
- Only 🎨 style choices and ❓ genuine confusion items get surfaced to user; ✅ self-resolved items are woven into teach-back
- When presenting options to user, each option must include Feynman-style pros/cons in the user's language — no jargon
- Cap of 3 questions to user — if more, AI hasn't explored enough
- Updated guardrail from "run through proactive checklist" to "use Stress-test Protocol (self-answer first, only surface gaps)"
- All 9 command stress-test headers changed from "ask user about these" to "resolve these by exploring codebase, only surface genuine gaps"

### DESIGN DECISIONS

- Questions themselves kept unchanged — they're still useful as a self-check list
- Behavior change comes from the protocol + header, not from rewriting questions
- Feynman Technique is the gap detector: if AI can't simplify its answer, that's a real gap worth asking about
- 3-question cap forces the AI to do homework before asking

## [2026-03-31] - Auto-run osf-apply after osf-proposal completes

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — changed Large Work path A to auto-chain osf-apply after osf-proposal without asking

### CHANGES

- After osf-proposal completes (Large Work path A), osf-apply now runs immediately with the change name instead of asking user to confirm

## [2026-03-31] - Fix: orchestrator self-implementing instead of delegating to subagents

### FILES MODIFIED

- `commands/osf-skill-explore-mode.md` — added DELEGATION ENFORCEMENT rule, updated Implementation Options with explicit Agent tool instructions, expanded Guardrails with per-subagent delegation rules

### CHANGES

- Added DELEGATION ENFORCEMENT section near top of skill (after SUBAGENT RULE, before MODE BOUNDARY RESET) — explicitly lists which `subagent_type` to use for each action (implement → osf-apply, spec → osf-proposal, verify → osf-verify, archive → osf-archive)
- Updated Implementation Options (Small Work, Large Work, After Implementation, After Verification) — each option now has an explicit instruction to use Agent tool with the correct subagent_type after user confirms
- Expanded "Don't implement" guardrail into 4 separate guardrails covering implement, create specs, verify, and archive — each explicitly says "delegate via Agent tool"

### DESIGN DECISIONS

- Root cause: the skill said "I'll run osf-apply" in display text but never told the AI HOW to run it. The AI interpreted this as "I should do what osf-apply does" and started writing code itself.
- Fix is in the skill only — all 9 commands inherit the fix automatically since they all load this skill.
- Placed DELEGATION ENFORCEMENT near the top for maximum visibility — AI reads top-of-prompt constraints more reliably than buried ones.

## [2026-03-31] - Fix skill loading: "Launch Skill" → explicit Skill tool invocation

### FILES MODIFIED

**Commands (9 files):**
- `commands/feat.md` — replaced "Launch Skill osf-skill-explore-mode" with explicit Skill tool instruction
- `commands/fix.md` — same
- `commands/chore.md` — same
- `commands/refactor.md` — same
- `commands/perf.md` — same
- `commands/docs.md` — same
- `commands/test.md` — same
- `commands/ci.md` — same
- `commands/docker.md` — same

### CHANGES

- "Launch Skill osf-skill-explore-mode" was plain text — the framework doesn't process it as a directive
- Replaced with an explicit instruction telling Claude to use the Skill tool to invoke the skill before proceeding
- This ensures the shared explore mode behavior actually gets loaded into context when any planning command runs

### DESIGN DECISIONS

- The Skill tool is the reliable mechanism for loading skills at runtime — plain text "Launch Skill" has no framework support
- Instruction is imperative ("You MUST use the Skill tool") to prevent Claude from skipping it

## [2026-03-31] - Extract shared content to skill, fix bugs, version 2.0

### FILES CREATED

**Skills (1 file):**
- `skills/osf-skill-explore-mode.md` - Shared explore mode behavior for all planning commands

### FILES MODIFIED

**Commands (10 files):**
- `commands/feat.md` - Slimmed from ~540 lines to ~130 lines, references skill
- `commands/fix.md` - Slimmed from ~530 lines to ~120 lines, references skill
- `commands/chore.md` - Slimmed from ~515 lines to ~100 lines, references skill, fixed spx-researcher → osf-researcher
- `commands/refactor.md` - Slimmed from ~515 lines to ~100 lines, references skill, fixed spx-researcher → osf-researcher
- `commands/perf.md` - Slimmed from ~525 lines to ~115 lines, references skill, fixed spx-researcher → osf-researcher
- `commands/docs.md` - Slimmed from ~420 lines to ~105 lines, references skill, gained OpenSpec Awareness
- `commands/test.md` - Slimmed from ~430 lines to ~105 lines, references skill, gained OpenSpec Awareness
- `commands/ci.md` - Slimmed from ~435 lines to ~105 lines, references skill, gained OpenSpec Awareness
- `commands/docker.md` - Slimmed from ~435 lines to ~105 lines, references skill, gained OpenSpec Awareness
- `commands/git.md` - Fixed stale reference: spx-ff → osf-proposal

### CHANGES

**Skill extraction (major refactor):**
- Extracted all shared explore mode content into `osf-skill-explore-mode.md`
- Shared content: The Stance, MODE BOUNDARY RESET, SUBAGENT BLACKLIST, Continuous Verification, OpenSpec Awareness, Ending Discovery, Implementation Options, Subagent Briefing Protocol, Shared Subagent Table, Guardrails
- Each command now says `Launch Skill osf-skill-explore-mode` and only contains domain-specific content
- Total lines reduced from ~4230 to ~1290 (~70% reduction, 0% functionality loss)

**Bug fixes:**
- Fixed `spx-researcher` → `osf-researcher` in feat, fix, chore, refactor, perf commands
- Fixed `spx-ff` → `osf-proposal` in git.md conflict resolution routing
- Removed hardcoded `npm run type-check/lint/test` from "Ready to Implement" sections

**Feature additions:**
- All 9 planning commands now have OpenSpec Awareness (previously only feat, fix, chore, refactor, perf had it)
- docs, test, ci, docker commands can now check for existing changes and offer to capture insights

**Version bump:**
- All modified commands bumped to version 2.0

### DESIGN DECISIONS

**Why one skill instead of multiple?**
- All shared content is used together — splitting into multiple skills adds complexity without benefit
- One skill = one `Launch Skill` instruction per command = simple
- The skill is ~300 lines, well within reasonable prompt size

**Why keep separate commands instead of one unified `/plan`?**
- Familiar mental model: git commit types = commands
- Each command has genuinely different domain-specific content (stress-test questions, zero-fog items, "What You Might Do")
- User can type `/feat` or `/fix` without thinking about domain detection
- Preserves the README's documented workflow

**Why `Launch Skill` instead of file path?**
- Agent framework resolves skill by name, no path needed
- Cleaner, more portable across directory structures
- Consistent with how skills are designed to work

## [2026-03-31] - Git Commit Workflow + Fluid Implementation + Archive Support

### FILES CREATED

**Commands (5 files):**
- `commands/feat.md` - Plan and implement new features
- `commands/fix.md` - Investigate and fix bugs
- `commands/chore.md` - Plan maintenance work
- `commands/refactor.md` - Plan code refactoring
- `commands/perf.md` - Plan performance optimization

**Subagents (4 files):**
- `subagents/osf-proposal.md` - Create OpenSpec spec (proposal, design, tasks)
- `subagents/osf-apply.md` - Implement tasks from spec or conversation plan
- `subagents/osf-verify.md` - Verify implementation matches spec
- `subagents/osf-archive.md` - Archive completed change to openspec/changes/archive/

### FILES DELETED

- `commands/spx-plan.md` - Replaced by feat.md, fix.md, chore.md, refactor.md, perf.md
- `commands/spx-ff.md` - Converted to subagent proposal.md
- `commands/spx-apply.md` - Converted to subagent apply.md
- `commands/spx-verify.md` - Converted to subagent verify.md
- `commands/spx-archive.md` - Converted to subagent archive.md
- All other `spx-*.md` commands

### CHANGES

**Workflow Architecture:**
- Converted from linear command-based workflow to fluid, git-commit-type-driven workflow
- Each commit type (feat, fix, chore, refactor, perf) is now a command that orchestrates subagents
- Removed spx-plan, spx-ff, spx-apply, spx-verify, spx-archive as commands; converted to subagents for better separation of concerns

**Command Structure (feat, fix, chore, refactor, perf):**
- All commands follow same explore/brainstorm pattern (adapted from spx-plan.md)
- Each command has context-specific guidance (feature planning, bug investigation, maintenance, refactoring, optimization)
- After planning, commands offer implementation options based on scope assessment:
  - Small work: direct apply (no spec needed)
  - Large work: 2 options - create spec first (proposal subagent) or apply directly
- After implementation, commands offer verification (verify subagent)
- After verification (only if spec was created), commands offer archiving (archive subagent)
- Workflow is fluid: user can go back to plan, switch paths, pause anytime - no linear lock-in

**Subagent Conversion:**
- `osf-proposal.md` (from spx-ff.md): Creates OpenSpec artifacts (proposal, design, tasks) from plan context
- `osf-apply.md` (from spx-apply.md): Implements tasks from spec or conversation plan, auto-verifies on completion
- `osf-verify.md` (from spx-verify.md): Verifies implementation against spec, report-only (no fixes)
- `osf-archive.md` (from spx-archive.md): Archives completed change to openspec/changes/archive/, syncs delta specs

**Archive Integration:**
- Archive is only offered after verification when spec was created (large work)
- Small work (no spec) skips archive step
- Archive subagent handles:
  - Auto-selecting change from context
  - Checking artifact/task completion (non-blocking warnings)
  - Syncing delta specs to main specs
  - Moving change to archive directory with date prefix
  - Suggesting git commit message

**Scope Assessment:**
- Commands now assess work size (small vs large) before offering implementation paths
- Small work: can skip spec creation, implement directly, no archive
- Large work: 2 options for user choice (create spec first or implement directly), archive available after verification
- Enables flexible, efficient workflows without forcing unnecessary formality

**Fluid Workflow Benefits:**
- User can invoke `/feat`, `/fix`, `/chore`, `/refactor`, `/perf` for different work types
- Each command is self-contained with its own planning phase
- Implementation is optional (user can plan without implementing)
- Spec creation is optional (user can implement directly for small work)
- Verification is optional (user can skip if confident)
- Archive is optional (only offered for spec-driven work)
- User can switch between commands without losing context

### DESIGN DECISIONS

**Why convert commands to subagents?**
- Separation of concerns: planning (command) vs spec creation (subagent) vs implementation (subagent) vs verification (subagent) vs archiving (subagent)
- Cleaner orchestration: commands coordinate subagents, don't do the work themselves
- Better autonomy: subagents work independently without conversation history, reducing context bloat
- Reusability: same subagents work with any command type

**Why git commit types as commands?**
- Aligns with conventional commits (feat, fix, chore, refactor, perf)
- Familiar mental model for developers
- Each type has different planning/investigation needs (feature planning vs bug investigation vs optimization)
- Enables spec-driven workflow for all work types, not just features

**Why fluid workflow?**
- Respects developer autonomy: small work doesn't need formal spec
- Reduces friction: user chooses when to create spec, not forced into it
- Maintains rigor: large work still gets spec for tracking and verification
- Enables iteration: user can plan, implement, verify, then go back to plan if needed

**Why scope assessment?**
- Prevents over-engineering: small work doesn't need full spec machinery
- Prevents under-engineering: large work gets proper tracking and verification
- User-driven: user decides scope, not the system
- Flexible: user can change their mind mid-workflow

**Why archive as subagent?**
- Completes the workflow: spec-driven work gets finalized and archived
- Automatic spec syncing: delta specs are synced to main specs before archiving
- Clean separation: archive logic is independent, can be reused
- Optional: only offered for spec-driven work, not for direct implementation
- Unique naming: `osf-*` prefix prevents conflicts with other kits

### COMPATIBILITY

- Requires openspec CLI (same as before)
- Maintains spec-driven workflow philosophy
- All subagents work with spec-driven schema
- Backward compatible with existing openspec changes (can still use old commands if needed)

## [2026-03-31] - Add docs, test, ci, docker, git, browser commands

### FILES CREATED

**Commands (6 files):**
- `commands/docs.md` - Plan and implement documentation changes
- `commands/test.md` - Plan and implement test additions/improvements
- `commands/ci.md` - Plan and implement CI/CD pipeline changes
- `commands/docker.md` - Plan and implement Docker/containerization work
- `commands/git.md` - Comprehensive git operations (status, commit, pull, push, merge, rebase, log, changelog)
- `commands/browser.md` - Reproduce bugs and explore apps via Playwright MCP

### CHANGES

**New commit types added:**
- `/docs` - Documentation work (README, API docs, guides, comments)
- `/test` - Test additions and improvements (unit, integration, E2E)
- `/ci` - CI/CD pipeline automation (GitHub Actions, deployment, monitoring)
- `/docker` - Containerization work (Dockerfiles, images, orchestration)
- `/git` - Git operations (status, commit, pull, push, merge, rebase, log, changelog)
- `/browser` - E2E testing and bug reproduction via Playwright

**Pattern consistency:**
- All 4 new commands follow the exact same explore/brainstorm/implementation flow as existing commands
- Each has context-specific guidance (docs = audience/format, test = coverage/strategy, ci = deployment/automation, docker = image/orchestration)
- All reference the same subagents (osf-proposal, osf-apply, osf-verify, osf-archive)
- All support fluid workflow: small work (direct apply) vs large work (proposal + apply)

### DESIGN DECISIONS

**Why these 4 types?**
- Align with conventional commits ecosystem (widely recognized)
- Each has distinct planning/investigation needs
- All are common in real projects
- All fit the spec-driven workflow

**Why not "style" or "revert"?**
- `style` is too trivial for this workflow (formatting-only changes)
- `revert` is a special case, not a planning type

**Why not "research"?**
- Research is exploratory, not implementation-focused
- Doesn't fit the spec-driven workflow well
- Can be handled ad-hoc without formal planning

### NEXT STEPS

- Test workflow with real features, bugs, refactoring tasks
- Gather feedback on scope assessment accuracy
- Monitor archive workflow for spec syncing correctness
- Validate new commit types in practice
</user_query>
