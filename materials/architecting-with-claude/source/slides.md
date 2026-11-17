# Architecting with Claude: slide text and presenter notes

This file mirrors the revised presentation.

## 1. Architecting with Claude

### On the slide

Architecting with Claude

Working through the design and carrying it into code

Andrew Hunter

ANDREW HUNTER ADVISORY

advisory.andrewphunter.com

### Presenter notes

Once an agent can produce code faster than I can read it carefully, I have to change how I work with it. I can spend the rest of the day catching up with the implementation, but by then the decisions that shaped it are already embedded in the code.

I want to work through those decisions while they're still decisions. That means investigating the problem with Claude, comparing approaches, and getting specific about what the system needs to preserve. The implementation then has an agreement to work from, and we have a basis for examining what comes back.

This is how I've organized that work in my projects. The planning conversation continues while separate execution threads carry agreed plans through contracts, implementation, and review. I'll show the handoffs and the small pieces of the harness that make them possible, so you can work through where the same approach would fit your team.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 2. The design is already in the diff

### On the slide

The design is already in the diff

An agent can implement a poor design faithfully, then write tests that preserve the same misunderstanding.

Consider a cache

Who owns the data?
What makes it stale?
What does the caller get when refresh fails?

I want to examine those decisions before code and tests depend on them.

### Presenter notes

An agent can implement a poor design quite faithfully. It can also write tests around that design and give us a convincing explanation of why they pass. By the time we read the diff, choices about responsibility and failure behavior have spread through the implementation.

A cache is a useful example. Choosing a map and writing the lookup are only part of the work. We need to decide who owns the data, what makes a cached value stale, and what a caller should receive if refreshing it fails. A test that confirms the second lookup hits the cache doesn't answer any of those questions.

If we leave those decisions to emerge during implementation, we have to reconstruct them during review. We may then need to change the code, its tests, and whatever has already begun depending on it. Planning gives us an earlier place to question the design while the cost of changing it is still small.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 3. Working through the design together

### On the slide

Working through the design together

STARTING A PLANNING CONVERSATION

/plan Investigate adding a cache here.

Trace ownership and failure behavior.
Compare approaches and their costs.
Show the data flow and invalidation.
Bring back the questions we need
to resolve before implementation.

I question the proposal, ask for alternatives, and revise the design with Claude.

Research

What does the source establish?

Visualize

Where does this relationship lead?

Revise

What else changes if we choose this?

Anthropic docs: Plan mode

### Presenter notes

I use plan mode as a place to work with Claude before committing to the implementation. The prompt on the slide opens an investigation. I expect to question the proposal, ask for another approach, and change my own position when the evidence calls for it.

Research belongs in that conversation. We might need to read the current implementation or investigate a vendor document. I want the relevant evidence brought back with an explanation of what it means for this system. A missing answer can be a reason to keep investigating before choosing an approach.

Diagrams give us something shared to reason over. A sequence diagram can expose a failure between two operations. A data-flow diagram makes ownership and repeated transfers easier to follow. A dependency diagram may show that a supposedly local change ties two components together in a way we didn't intend.

I can point at one of those relationships and ask why it exists, or what happens if the operation fails there. Claude can revise the drawing and work through what else changes. The conversation needs to leave us with reasons for the decisions, so another thread can understand what it's being asked to build.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/common-workflows#plan-before-editing

## 4. What leaves the planning conversation

### On the slide

What leaves the planning conversation

ILLUSTRATIVE PLAN · NOT A PROJECT RECORD

Change: reload application settings
Owner: SettingsStore
Approach: prepare, then replace
Preserve: failed reload keeps active settings
Depends on: parser result and error contract
Check: valid reload; rejected reload
Outside this change: file watching

The next thread needs the reasons behind the decisions.

Link the research and diagrams.

Record dependencies and open questions.

A question that could change the design still needs an answer before execution.

### Presenter notes

The settings-reload plan here is a teaching example, not a record copied from one of my projects. It shows the information I want to carry out of planning.

The next thread won't have lived through the design conversation. It needs the decisions we reached and enough of the reasoning to work within them.

For this small example, we're changing how an application reloads its settings. We have chosen to prepare a replacement before making it active, because a failed reload must leave the running application with its previous settings. The plan names the owner, records that approach, and identifies the parser contract the work depends on. File watching is outside this change.

Those details give the next thread something usable. It can derive an interface from the responsibility, propose checks for the failure behavior, and see which work has to be settled before it starts. A file list by itself wouldn't carry that reasoning.

For larger work, the same record also links the research and diagrams behind the decision. Open questions stay visible. If an answer could change the design or a dependency, the plan still needs that work before we send it into execution.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 5. Planning continues while work runs

### On the slide

Planning continues while work runs

Planning thread

Me + planner

Research, visualize, and revise the next design.

Backlog

Plan A

Ready

Plan B

Ready; independent of A

Plan C

Waiting on a dependency

Execution threads

A: /architect
Own thread and worktree

B: /architect
Own thread and worktree

Design questions and results return to planning.

### Presenter notes

I keep the planning conversation separate from execution. Once a plan is ready, I can move it into its own thread and continue working through the next design. That keeps the implementation history from taking over the conversation where we're still reasoning about the wider system.

The backlog records the dependencies. Plans A and B can proceed together here because neither needs an unsettled contract from the other. Plan C waits. Having another available agent doesn't make C ready, and giving it a separate worktree doesn't resolve the dependency.

Each execution thread carries its plan through contracts, implementation, and review. Where the work is independent, separate threads and worktrees let it progress in parallel. If a thread uncovers a question that changes the design, it brings that question back to planning. We can then consider what else in the backlog depends on the answer.

The useful unit of parallel work is a plan whose dependencies we understand. That is what lets me keep designing while implementation proceeds without asking each agent to guess how its work fits the rest.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 6. Where the files live

### On the slide

Where the files live

FILE LOCATIONS · ILLUSTRATIVE PLAN NAME

.claude/
  agents/
    researcher.md
    implementer.md
    reviewer.md
  skills/architect/SKILL.md

planning/settings-reload/
  plan.md
  research.md

CLAUDE.md → AGENTS.md

The skill coordinates.
The agents do their assigned work.

Keep shared instructions small.

Link the relevant docs; keep procedures with the role.

Anthropic docs: Skills · Custom subagents · Project instructions

### Presenter notes

CLAUDE.md points to the shared project instructions. The researcher, implementer, and reviewer definitions each carry a persona, tool access, model assignment, and expected result. The architect skill carries the procedure that calls them.

Claude Code finds the role definitions and skill in these directories. The skill calls the names in the agent definitions, so those references need to agree.

The planning/<plan-name>/ path is a convention for working notes. It gives the workflow a place to find the agreed plan and its supporting research. Those notes can remain local. What matters at the handoff is that the execution agent receives the agreed version and later planning edits don't silently change its assignment.

Keep AGENTS.md small. It needs the constraints and recurring corrections that matter across the work, with pointers to the relevant documentation. A researcher reading a paper doesn't need the application setup guide. The role files and skill have room for their procedures; the shared instructions don't need to repeat them.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/memory

## 7. Starting the execution session

### On the slide

Starting the execution session

ILLUSTRATIVE INVOCATION · IN THE PLANNING CONVERSATION

/architect settings-reload

The workflow handles:
  the separate execution thread
  the worktree and project setup
  the agreed plan and starting revision

Keep planning open.

The architect carries the agreed plan into execution.

Your first review is the contract and proposed test list.

Anthropic docs: Worktrees

### Presenter notes

I invoke /architect with the name of the agreed plan. The workflow starts the architect in a separate execution thread and handles its worktree and setup. I can keep working in the planning conversation while that work progresses.

The handoff carries the plan, its dependencies, and the starting revision. The execution agent checks that its working copy matches that assignment and prepares the dependencies using the project's instructions. Those are part of the workflow, so I don't have to create a worktree, change directories, or launch Claude in another terminal.

The first thing I need to examine is the contract: the public interface, invariants, proposed test list, omissions, and implementation ownership. The architect brings that back for review before implementation starts.

Once we've settled the agreement, the same execution thread continues with the implementer and reviewer. A question that changes the design comes back to planning, where I can consider the other work depending on it.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/common-workflows
- https://git-scm.com/docs/git-worktree
- https://code.claude.com/docs/en/worktrees

## 8. Architect: scope and contracts

### On the slide

Architect: scope and contracts

.claude/skills/architect/SKILL.md · EXCERPT · [...] MARKS OMISSIONS

[...]
Use the `researcher` agent; do not read a source wholesale yourself.
[...]
Each header states its contract, ownership, lifetimes, resource bounds and failure
behavior, names the source its design follows, and cites the guideline IDs that shape it.
[...]
Write the test list in the plan as one table, per the Testing section of `AGENTS.md`:
name | unit or integration | header declaration asserted | the change this scenario alone
would catch | fixture it needs. A row with no such change is left off.
[...]
The headers and the test list are the approval gate; nothing below runs until the user
has approved them in conversation.
[...]

Anthropic docs: Skills

### Presenter notes

This is an excerpt from the architect skill I use. The wording is unchanged; [...] marks the parts left out of this view. The full procedure also covers scope, research, engineering guidance, ownership, and measurement.

The architect starts from the plan we've already agreed on. It confirms the intended result, dependencies, and omissions, and brings back a conflict before deciding which version to follow. Research answers the specific questions that remain. The applicable engineering guidance then informs the design, with the relevant rules and any proposed departures made visible.

The architect breaks substantial work into steps and works on the next one whose dependencies are ready. It updates the affected architecture documentation, writes the public headers or other interface contracts, and states the invariants: ownership, lifetime, failure behavior, and resource costs. That gives us the design in a form the implementation and its callers will depend on.

It also proposes the test list. Each scenario needs a contract to protect and a distinct failure to catch. The architect names the implementation files the agent may edit, identifies omissions, and records a baseline where the change needs a performance or output comparison.

That package is what I review before implementation. I can examine the consequences of the design, the evidence we intend to collect, and the work we're leaving out while those decisions are still straightforward to change.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents

## 9. Architect: execution and evidence

### On the slide

Architect: execution and evidence

.claude/skills/architect/SKILL.md · EXCERPT · [...] MARKS OMISSIONS

[...]
Run the `implementer` agent with the plan path, the headers, the ownership list and the
presets and machine. Read its Verified table; a missing or failing row is a stop.
[...]
Run the `reviewer` agent once, with the changed files, the headers, the plan and the
implementer's Verified table.
[...]
Findings in the contract, failure, test, facade, omission, performance and guideline
dimensions go back to the implementer as one correction pass with the same ownership
list. A test finding that would add a scenario or a row does not: it goes to the user
with the change it alone would catch.
[...]
Then state what is implemented, what is verified and by which command, what is omitted
and where each note is, and what is open. Keep those four apart.
[...]

Anthropic docs: Skills · Custom subagents

### Presenter notes

These are selected passages from the same skill, in their original order. The omitted measurement procedure belongs to the rendering project; the implementer, reviewer, and reporting instructions shown here are the actual wording.

Once I approve the design and test list, the architect gives the implementer a concrete brief: the agreed plan, contracts, tests, owned files, worktree, and check commands. The implementer works within that assignment and returns its code, verification results, omissions, and anything that needs a decision outside its ownership.

The architect has work to do with that report. It reads the evidence, resolves failed or missing checks, and performs the verification assigned to it. In my rendering work, that includes measuring the change and examining the output. A successful build can't establish that the frame got faster or that the image stayed the same.

The independent reviewer receives the agreed plan as well as the contracts, change, test list, and evidence. The plan explains what the change was meant to accomplish. Without it, a reviewer can find an implementation consistent with its headers while missing that it solves the wrong problem.

Findings that fit within the agreement go through one correction pass, followed by the affected checks. A finding that changes a contract, dependency, or scope returns for a decision. The architect then reports what was implemented, verified, omitted, and left open, and stops for acceptance before starting the next step.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents

## 10. The interface carries the agreement

### On the slide

The interface carries the agreement

ILLUSTRATIVE PUBLIC HEADER

class SettingsStore {
public:
  // Owns the active settings.
  // Success replaces the whole value.
  // Failure preserves the active value.
  [[nodiscard]]
  Result reload(std::string_view source);
};

Before implementation

What can the caller rely on?

What survives a failure?

What would establish each promise?

The tests observe the promised behavior through the interface.

### Presenter notes

The header makes the promise visible where the implementer and reviewer will use it. In this example, SettingsStore owns the active settings. A successful reload replaces the whole value, and a failed reload preserves what was already active.

Those statements give us something to examine before there's an implementation to defend. Does the caller need to distinguish invalid input from an unavailable source? Does anything else hold a view into the active settings? If so, what happens to that view after a successful reload? The interface review is where we work through those consequences.

The checks should then observe the promises. We can supply valid settings and observe the replacement. We can supply invalid settings and establish that the previous value remains available. We don't need a test that dictates which private container stores it.

In my C++ work, I put the invariants in the public headers. The important part is that the agreement travels with the interface, so implementation and review refer to the same behavior.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 11. Contracts reach the API and the screen

### On the slide

Contracts reach the API and the screen

Service contract

A rejected settings update leaves the stored value unchanged.

The API defines how a caller resolves a timed-out request.

Frontend contract

A rejected save preserves the entered values and explains the failure.

The person can correct the input and try again.

A timeout needs an explicit recovery path. The API and UI must agree on how to resolve an unknown outcome.

### Presenter notes

The same reasoning carries into a service or frontend. A settings endpoint can promise that a rejected update leaves the stored value unchanged. The interface using it then needs to decide what happens to the person's edits when that rejection comes back.

If the form clears the input, we have lost work even though the service behaved correctly. If it announces success before receiving confirmation, it tells the user something we haven't established. Those are design decisions we can state before asking an agent to build the screen.

The contract here preserves the entered values after a rejected save, explains the failure, and lets the person correct the input and try again. A timeout needs its own treatment because the outcome may be unknown. The UI and API have to agree on how that state is resolved.

The contract can therefore include visible states and transitions, just as a C++ interface includes ownership and failure behavior. The implementation details differ, but we still need to agree on what another part of the system, or a person using it, can depend on.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 12. Reviewing the test list before code

### On the slide

Reviewing the test list before code

Which contract does this test guard?
What distinct failure would it catch?

Keep

A rejected reload preserves the active settings.

Leave out

Assertions about a private container or helper sequence.

A behavior-preserving refactor should leave the contract tests intact.

### Presenter notes

I want to know what each proposed test protects before the agent writes it. Which contract does it guard, and what failure would it catch that the other checks wouldn't? That gives us a reason to keep the scenario.

For the settings example, a valid reload and a rejected reload establish different behavior. Testing the name of a private field or the sequence of internal helper calls adds a different obligation: it makes the implementation harder to change without necessarily protecting anything a caller depends on.

I've had agent work arrive with nearly as many test lines as implementation lines. The tests repeated setup, followed the functions in the implementation, and checked details no caller read. Review kept adding more. I moved the test-list review earlier because adding tests after the fact wasn't resolving that problem.

A behavior-preserving refactor should leave the contract tests intact. If the agent has to rewrite the tests alongside the implementation just to keep them green, we've weakened their value as an independent regression harness. Coverage can show us what ran. We still have to judge what the assertions establish, and which tests don't earn their cost.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 13. The model follows the responsibility

### On the slide

The model follows the responsibility

I watch the cost of an accepted result, including rework and my own time.

Planner: Fable / frontier; Architect: Fable / frontier; Researcher: Sonnet; Implementer: Opus; Reviewer: Opus, fresh context.

### Presenter notes

I assign a frontier reasoning model, currently Fable, to planning and architecting. Those decisions can change the shape of everything that follows, so that's where I want the reasoning capacity and the continuing design context.

Research has a more bounded output. Sonnet can investigate a question and return cited evidence without also having to choose the architecture. Opus implements against the approved contracts. Opus also reviews the change in a separate context, with the agreed plan, contracts, and evidence. The reviewer gets the original intent and the result without inheriting the implementation conversation.

This allocation lets me choose capacity for each responsibility. I don't need the planning model spending its context on every source lookup, or the implementing model repeating the design investigation because the handoff was vague.

I watch the effort required to reach an accepted result, including repeated investigation, corrections, and my time resolving avoidable ambiguity. A cheaper call that causes the next agent to redo the work doesn't help much. The role definitions give me places to adjust those choices as the work changes.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 14. The researcher returns evidence

### On the slide

The researcher returns evidence

.claude/agents/researcher.md · EXCERPT · [...] MARKS OMISSIONS

---
name: researcher
[...]
tools: Read, Grep, Glob, Bash, WebFetch
disallowedTools: Write, Edit, NotebookEdit
model: sonnet
---
[...]
Output the mechanism as the document states it, its preconditions and its stated limits,
each cited to a section, page or timestamp. Separate what the document states from what
you infer, and label each inference as one.
[...]
- Do not propose designs, simplifications or alternatives.
[...]
- Do not summarize a file you did not read in this session.

Anthropic docs: Custom subagents

### Presenter notes

The definition assigns Sonnet and names the tools the researcher can use. The description and project instructions are omitted here. The body passage comes from its document-reading procedure, followed by two of its prohibitions. These are the words in the file, with [...] marking the gaps.

I want the researcher to tell me what a paper, specification, or vendor document establishes, including the conditions under which it holds. An inference can be useful, but I need to know it is an inference before the design starts depending on it.

The same definition has a separate procedure for pinned source reads. That procedure asks for file and line citations and an include cross-check. The architect gets the evidence and makes the design decision; the researcher doesn't turn a source lookup into an alternative architecture.

The tool list excludes editing tools, but Bash remains available for inspection. Its instructions prohibit shell writes. Enforcing that boundary also takes the session's permissions and sandbox.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents

## 15. The implementer has a bounded assignment

### On the slide

The implementer has a bounded assignment

.claude/agents/implementer.md · EXCERPT · [...] MARKS OMISSIONS

---
name: implementer
[...]
model: opus
---
[...]
- Create or edit only files inside the ownership list.
- Public headers are the approved contract. If the work needs a header change, stop at
the boundary and record it under "Needs outside ownership" with the file, the change and
why; do not edit it, do not work around it, do not move logic into a file you own to
avoid it.
[...]
- The plan's test list is closed. Write the scenarios it names and no others; one you
think is missing goes under "Needs outside ownership" with the change it alone would
catch.
[...]

Anthropic docs: Custom subagents

### Presenter notes

The quoted passages are from my implementer definition. I have omitted the description, project instructions, and other sections, and retained the ownership and test-list wording.

The role definition establishes how the implementing agent works across assignments. The brief supplies the particular step, contract, owned files, and agreed checks. Both are needed. A role that says “implement carefully” leaves the agent to decide what careful means for this change.

I assign Opus here. The definition inherits the session's available tools, so the agent can build, investigate failures, and correct its implementation. The ownership list tells it where that work belongs. If the fix requires changing a contract or another component, it reports the dependency and brings the decision back.

In Serenity, we agree on the test list first, then the implementer writes those scenarios in its assigned test files. In Frizzle, the tests are already written before the implementer starts. Choose the procedure your project needs and keep the assignment explicit.

The four report sections are the same ones I use: verified, not verified, omissions and open differences, and needs outside ownership. They give the coordinator the evidence and remaining decisions without asking it to reconstruct them from a reassuring completion message.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents

## 16. The brief ties the role to this change

### On the slide

The brief ties the role to this change

implementer.md · EXCERPT · [...] MARKS OMISSIONS

[...]
## Inputs you must receive
The prompt gives you the absolute path of the slice plan,
the public headers already written for this step, an
explicit list of files or globs you own, and the presets
and machine to build on. If any of these is missing, stop
and report what is missing instead of guessing.
[...]

The header stays outside implementation ownership.

The architect supplies absolute paths for this worktree.

The role definition names the inputs. The architect supplies them for each assignment.

### Presenter notes

This is the input requirement in the implementer definition. The architect has to supply the plan, approved headers, owned files, and the build environment for this assignment. If something is missing, the agent is told to stop rather than fill in the gap.

That matters when the implementing agent starts in a separate context. It has the role definition, but it hasn't lived through the design conversation. The brief has to identify the agreement it is implementing and where it may work.

The source calls the unit of work a slice. The planning/<plan-name>/ paths elsewhere in this presentation are a generalized naming convention. They are illustrative paths, not a copied project record.

In this workflow, the public headers stay outside implementation ownership. A needed header change comes back as a decision, with the file and the reason. The implementer can explain what it needs without quietly changing the agreement.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 17. What comes back from implementation

### On the slide

What comes back from implementation

.claude/agents/implementer.md · EXCERPT · [...] MARKS OMISSIONS

[...]
## Report format
Return exactly these four sections, in this order:
1. **Verified**: a table with columns Command | Exit code | Evidence. Only commands you
ran in this session, with their actual exit codes, and the machine they ran on.
2. **Not verified**: everything the plan expects of this step that you did not
demonstrate.
3. **Omissions and open differences**: each source step you omitted, with the note's
location; each header promise you could not meet, one line each as `UNRESOLVED:
<path>:<line> <what>`.
4. **Needs outside ownership**: files outside your list that the work requires.
Never use "complete", "ready" or a synonym unless the Verified table is non-empty and
every row passed.

### Presenter notes

This is the actual report-format instruction from my implementer file. It is a requirement for the report, not an example of a run or a claim that any particular command passed.

The Verified table names the command, its exit code, the evidence, and the machine. That gives me something to inspect. The next section says what the plan expected that the agent did not demonstrate, so a successful build can't quietly stand in for every other check.

Omissions and open differences keep unfinished obligations visible. Needs outside ownership brings back the work the implementer couldn't take on within its assignment. Those may need a design decision or another component owner before execution can continue.

The architect reads this report before asking for review. It sends the agreed plan, contracts, changed files, test list, and evidence together. The reviewer can then examine what was promised against what the implementation and observations establish.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 18. Review against the plan and contracts

### On the slide

Review against the plan and contracts

.claude/agents/reviewer.md · EXCERPT · [...] MARKS OMISSIONS · OPUS

---
name: reviewer
[...]
tools: Read, Grep, Glob, Bash
disallowedTools: Write, Edit, NotebookEdit
model: opus
---
[...]
The brief names the files changed in the step, the public headers they implement, the
slice plan, and the verification the implementer ran. Read all of them.
[...]
<path>:<line> | <dimension> | <header line or AGENTS.md rule> | <one-sentence difference>
[...]
Do not judge, approve or excuse.
[...]

Anthropic docs: Custom subagents

### Presenter notes

These passages are from the reviewer definition. The model is set to Opus for this presentation; the source file names Fable. The other quoted wording is unchanged, and [...] marks omitted text.

The architect supplies the changed files, public headers, agreed plan, and the verification the implementer ran. The reviewer reads all of them in a separate context. The plan explains what the change was supposed to accomplish, and its test list belongs in that review as well.

The finding format names the file and line, the dimension being examined, the header promise or project rule, and the difference. The full definition lists those dimensions and tells the reviewer what to report when it finds nothing: the files and ranges it actually inspected, without extending that claim to code it hasn't read.

The role excludes editing tools and instructs Bash to read only. Those instructions still need enforcement where a hard filesystem boundary matters. The reviewer reports departures and missing evidence; the engineer responsible for the change decides whether the result is acceptable.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents

## 19. A finding becomes a correction or a decision

### On the slide

A finding becomes a correction or a decision

ILLUSTRATIVE REVIEW FINDING

src/settings_store.cpp:42 | failure
Contract: rejected reload preserves active settings.
Observed: active settings cleared before parse succeeds.

Fix within the agreement

Return to the implementer.
Correct the code and rerun checks.

Change the parser contract

Return to the plan owner and parser owner before dependent work proceeds.

### Presenter notes

Here the reviewer finds that the implementation clears the active settings before it knows whether parsing succeeded. That violates the failure contract we agreed on. The architect can send the finding back to the implementer within its existing ownership, then have it rerun the affected checks.

The second possibility is that the implementer cannot fix the problem without changing the parser's public contract. Now another component and its callers are involved. The architect brings that question back to the engineer owning the plan and the parser's owner before the agreement changes.

My workflow uses one review pass and one correction pass. Repeating review until nobody can suggest another improvement lets the review grow into another design exercise. After the correction and checks, the architect returns the evidence and any unresolved findings for acceptance.

That result can lead to a specific further correction or a revised design. We can make that decision from the finding rather than letting an agent keep expanding the work until it declares itself satisfied.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 20. What the harness enforces

### On the slide

What the harness enforces

Role briefs and skills

Carry the procedure, inputs, and stopping conditions.

Permissions and sandbox

Restrict available tools, resources, and access.

Hooks and merge checks

Invoke checks at covered events and block failed merges.

A brief can say “do not edit.” Blocking a write takes a rule the harness enforces.

Anthropic docs: Permissions · Sandboxing · Hooks

### Presenter notes

The reviewer says “do not edit,” and its tool list excludes Write and Edit. Bash is still available, though, and a shell command can write a file. The instruction tells it how to behave; the harness has to block the operation if we need that boundary enforced.

A pre-tool hook can reject an operation. An after-edit hook can run a formatter. Required checks on the shared branch can prevent a merge while the checks fail. Each has a particular event or boundary it covers, so we have to choose one that actually reaches the action we care about.

The same care applies to a stop hook. A session waiting for a contract decision hasn't finished its implementation. A check that treats every stop as a completion claim will get in the way of the conversation we need.

I keep the workflow pointed at the project's shared check commands. The brief, local execution, and merge checks should agree on what they run. That lets us strengthen enforcement without quietly creating a second definition of success for the agent.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/sandboxing
- https://code.claude.com/docs/en/permissions

## 21. The team owns its plans and acceptance

### On the slide

The team owns its plans and acceptance

The engineer owning the change

Develops the plan, resolves its contracts, and accepts the result.

Owners of affected components

Resolve shared-contract changes before dependent work proceeds.

The handoff

Pass the agreed plan, decisions, and results to the next engineer or agent.

Independent work can proceed without routing every decision through one architect.

### Presenter notes

On my own projects, I make the contract decisions and accept the result. On a team, those responsibilities belong with the engineers doing the work. The engineer responsible for a change owns its plan and the decision that the result satisfies it.

When the change affects another component's contract, that component's owner needs to help resolve it before dependent implementation proceeds. Otherwise, one agent can make a locally sensible change that breaks the assumptions another engineer is building against.

When work passes to another engineer or agent, the agreed plan, decisions, and relevant results go with it. They need to know what they are building against and what has already been established. Planning notes and run output can remain working material; this handoff does not require committing them with the source. The receiving person or agent needs the context to make the next decision.

The method works across a team when ownership is clear enough for people to make decisions in their own areas and recognize when a decision crosses into someone else's.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 22. The result changes what is ready next

### On the slide

The result changes what is ready next

An accepted contract

The plans depending on it can proceed.

A changed assumption

Revisit the plans written against the earlier agreement.

A required check still missing

Keep that dependency visible before starting the next piece.

Execution returns evidence and questions to the continuing design conversation.

### Presenter notes

Execution has to return something the planning conversation can use. Completing a piece of code doesn't by itself tell us whether the plans that depend on it are ready.

If Plan A's contract has been accepted and its checks establish what we needed, work depending on that contract can proceed. If A required a change to the contract, we need to revisit the plans written against the earlier version. If a required behavior is still unverified, the dependent work needs that limitation made explicit.

This is why the backlog includes dependencies and the reasons for them. We can follow the result back to the plans it affects rather than treating each finished thread as an isolated success.

Meanwhile, independent design work can continue. The planning conversation retains the wider view, and each execution thread brings back the evidence and questions needed for the next decision.

### References

- https://andrewphunter.com/writing/architecting-with-claude/

## 23. Trying it on the next change

### On the slide

Trying it on the next change

Read Architecting with Claude

Work through this with your team

Choose a change where the design still needs work.

Work through the design. Agree on the contracts and tests. Hand the plan to execution, then examine the evidence and findings.

### Presenter notes

Choose a meaningful change whose dependencies you can resolve. Work through the design, record why you chose it, and invoke /architect to hand it to execution. Examine the proposed interface and test list before letting implementation begin.

As the work returns, notice where you had to reconstruct a decision or ask for evidence that should have accompanied the result. Improve that handoff before adding more parallel work. A team should be able to follow the agreement without relying on one person remembering every conversation.

The full article develops the reasoning behind the method. If you'd like help applying it to your team's systems, the advisory link is here as well.

### References

- https://andrewphunter.com/writing/architecting-with-claude/
