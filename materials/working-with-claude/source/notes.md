# Working with Claude: presenter notes

## Working with Claude

Once Claude is writing substantial pieces of an implementation, the difficult part is deciding whether the result does what we intended. We can spend the time we saved reading everything it produced, but that gets harder as we give it more work. We need a way to carry our decisions through the implementation and check what comes back.

Claude Code gives us quite a few pieces to work with. It can investigate a repository, help develop a plan, run the application, and hand work to another agent for review. We decide how those pieces fit the way our team builds software.

These six habits give us somewhere practical to start. We'll use small examples of the files and commands involved, then bring them together around a change in an existing repository. The aim is to give Claude enough context and feedback to work through the implementation without requiring someone to supervise every edit.

## Three problems that show up quickly

“I asked Claude to double-check it” sounds reassuring. But what did it do? If it reread its answer and said it looked right, we still have the same answer and the same assumptions. Running the code gives it something else to reason from. A failing test, an unexpected response, or a browser showing the wrong state can contradict what it thought it built.

Access creates a different problem. If an agent can change everything in a shared system, a narrow task still leaves it with broad access. Describing the intended action more carefully doesn't change what those credentials allow it to do.

Then there's the correction we made last week. We worked through the mistake, fixed it, and carried on. A new session starts without that conversation, so it has every opportunity to repeat it. The correction needs a home the next session will read.

Those are all parts of the harness: what Claude knows when it starts, what it can reach, and how it finds out whether its work is right. Which of these is happening in your team's work?

## More manual review becomes another queue

The natural response to uncertain code is to read it more carefully. That works until code starts arriving faster than we can give it that attention. The queue grows, and eventually we're skimming a large diff while relying on a summary written by the same agent that produced it.

By then, the design decisions are already spread through the implementation. We may be discussing whether a retry loop is well written when the question we needed to settle was whether that operation could safely be retried at all. Finding that late means unwinding code and tests built around the wrong assumption.

Anthropic's approach brings automated checks and agent review into the development process. We can use those mechanisms to move more of the examination into the work itself. Agree on the behavior before implementation, give Claude checks that can reject a bad result, and have another agent examine the change against that agreement.

In my own projects, I review the design and contracts, inspect the evidence, and follow findings into the code when I need to understand what happened. That gives me a reason to read those functions and a question I'm trying to answer.

## How the work moves through Claude

Start with a change we want to make. Planning gives us a place to investigate the existing code and work through the approach before we commit to it. Once we agree, Claude has something specific to implement and we have something specific to check.

Verification feeds the result back into the work. Claude runs the check, sees the failure, makes a correction, and runs it again. The separate reviewer then examines the change against the plan and the evidence. It can spot a missed requirement even when the checks that ran all passed.

This will take us backwards sometimes. A failed check may expose an implementation mistake Claude can fix immediately. It may also expose a design assumption we need to revisit together. The distinction matters because quietly changing the design to make a test pass changes what we agreed to build.

Shipping uses the project's existing delivery procedure. The instructions and automation around this loop make the decisions available at each step, so the next agent doesn't have to reconstruct them from a completion summary.

## Plan before code

Enter /plan with the change you want to make. That starts the conversation before Claude begins editing. I use that time to investigate the existing implementation, compare approaches, and work through the consequences with it.

Take the retry example. A request can time out after the server has already accepted it. Sending it again could repeat the operation. Before adding retries, we need to understand which requests are safe to repeat and how the system recognizes one it has already handled. Otherwise, we can produce a perfectly working retry loop that causes a business problem.

Ask Claude to show the sequence, including the failure. A diagram often makes an assumption easier to see than another page of explanation. Question it, try another approach, and revise the plan as you learn. The first proposal gives us something to reason over.

By the time we start implementation, we should know what will change, what we're leaving alone, and how we'll establish that the result works. If an unanswered question could change the approach, we still have planning to do.

## Give Claude a way to check its work

Here, npm run check combines the build and test commands the project already has. Giving Claude one command to run lets it get feedback while it works. It can read a failure, investigate the cause, and try the correction without handing that whole cycle back to us.

We still have to choose what the check establishes. If we're fixing a form that loses the user's input after an error, compilation won't tell us whether we fixed it. We need to exercise that failure and observe the form. If we're making a hot path faster, we need a measurement under the conditions that matter.

Tests deserve the same scrutiny. A regression test should fail against the broken behavior. A contract test should continue to pass when we change the implementation but preserve what callers depend on. If every refactor requires rewriting the tests too, we are changing the implementation and its supposed safety net together. A green coverage report doesn't resolve that problem.

Have Claude report the commands it ran and the results they produced. Anything it couldn't exercise should stay visible, so we can decide what remains to be checked.

## Put the rules where Claude reads them

Claude Code loads CLAUDE.md. Mine points to AGENTS.md so the shared instructions have one home. /init can draft the starting file, but I edit it down before keeping it. The README already explains the project and how to build it. Copying that material gives us another version to maintain and makes every agent read it, whether its assignment needs it or not.

The instruction here says “before implementation” for a reason. An implementer needs the build and test instructions. A researcher looking into a paper needs its brief and the paper. We can point each one to the material its work requires.

The most useful entries are often corrections learned from repeated mistakes. In my projects, tests kept reaching into private structure and changing alongside the code they were supposed to protect. The short correction on this slide gives the next agent a different decision to make before it repeats that pattern.

Keep editing the file as you learn. Combine overlapping corrections, remove ones that no longer apply, and put a detailed procedure with the role or workflow that uses it.

## Boundaries, not prompts

If Claude asks permission to run the same build command twenty times, we will probably approve it twenty times. We can allow that routine command in settings and let the work proceed. /permissions gives us a way to inspect those rules.

The restriction needs to match the action we're trying to prevent. The Read rule here blocks the matching file read. It doesn't stop an unrestricted shell from opening the same file through another command. That's why tool permissions sit alongside the sandbox's filesystem and network restrictions. Use /sandbox to see and configure that part of the environment.

Credentials determine what the agent can do once it reaches a shared system. If the task only needs to query a service, give it access that can query it. Branch protection and required checks belong on the server, where they apply regardless of which local tool produced the change.

The practical question is what this piece of work needs to reach. Configure that access, allow its routine operations, and keep decisions about expanding the work visible. The sample shows two permission rules to add to the project's existing settings.

## Machines review machines

The implementing agent has spent the conversation developing its approach. Asking it whether the result looks right gives it a chance to revisit that reasoning, but it can carry the same misunderstanding into the answer. A reviewer in separate context starts from the agreed behavior and the change that actually arrived.

Give it both. The plan and contracts explain what was supposed to happen. The changed files and check results let it examine what happened. Without the agreement, a reviewer can spend its effort improving code that should never have been written.

This definition gives the reviewer read and search tools. It can't edit the files, and it has no shell to retrieve a git diff, so the calling agent needs to supply the changes. Its job is to identify a specific difference, point to the file and line, and explain which promise the implementation breaks. model: inherit uses the calling session's model. You can assign a particular model to the role when you configure your own workflow.

Work through the findings, correct the change, and rerun the affected checks. A finding that challenges the design comes back to the engineer responsible for that decision. It shouldn't quietly become a new requirement during review.

## Automate the inner loop

Once a sequence is useful, we shouldn't need to type it out in every conversation. The skill on the left puts the checking procedure in one place. Calling /check-change loads those instructions: run the check, investigate failures, correct them, and report what remains. disable-model-invocation keeps that particular skill under explicit invocation.

A hook attaches a command to an event in Claude Code. Here, PostToolUse runs the formatter after the Edit or Write tool finishes. Claude doesn't have to remember a reminder buried earlier in the conversation. The event triggers the command.

That also tells us what this hook covers. A file written through the shell won't trigger the Edit or Write matcher. CI checks the resulting files before merge, so formatting still gets checked when a different editing path was used. Keep the after-edit command quick enough that it doesn't turn every small edit into a long wait.

The hook excerpt belongs inside the settings file's hooks object. Both examples use commands the repository already defines. We can change the checking procedure or formatter in that shared location and have the automation pick it up.

## Where the engineer’s attention goes

We still need to understand what we're building. That starts with why the change exists and which behavior matters. If we leave those questions implicit, Claude will make choices on our behalf and we'll meet them later in the diff.

Deciding what would demonstrate success is engineering work too. A passing check is useful when we understand what it observed and what could still be wrong. Looking at a rendered result, following an unexpected failure, or questioning a performance measurement may send us back into the implementation. We have a concrete reason to investigate.

On a team, the engineer responsible for a change owns its plan and acceptance. If that change alters another component's contract, its owner needs to be part of the decision before dependent work proceeds. Routing all of this through one architect would recreate the queue we're trying to remove.

When a mistake gets through, follow it back. Did we leave a design question unresolved? Did the check observe the wrong thing? Did a correction never reach the next session? The answer tells us which part of the process needs attention.

## How the pieces fit in a repository

These files have different jobs, which helps us decide where a new instruction belongs. CLAUDE.md loads the shared guidance. AGENTS.md holds the short corrections and pointers that should survive across sessions. Settings configure tool access and hooks. A reviewer definition describes the reviewer's responsibility and available tools. A skill holds a procedure we want to invoke again.

The project still owns its build and tests. In these examples, package.json exposes the check command and CI requires the checks before merge. If your project uses another build system, point Claude at that instead. We don't need an agent-specific copy of the build procedure.

That separation matters when something changes. Updating a test command in one shared script is manageable. Hunting through instructions, skills, and CI for several slightly different copies is how those checks drift apart. Give each piece a home and have the other pieces refer to it.

## Start Monday with one repository

Pick a real change small enough to work through with the team. Open the repository, run /init if it needs a starting instruction file, and remove anything that duplicates documentation you already maintain. Add a useful correction from experience and point to the checks Claude will need.

Allow the routine commands, then use /plan to investigate the change together. Challenge an assumption and work through how you'll check the outcome before implementation starts. When the work comes back, look at the actual results and have a separate reviewer compare the change with the plan.

Pay attention to where you had to intervene. If Claude couldn't check something, work out what observation it was missing. If it repeated a known mistake, put the correction where the next session will see it. If the task turned out to depend on an unresolved design choice, bring that into planning next time.

That gives you a working process to improve on the next change, with a reason for each piece you've added.

## Bring it back to your team

Think about the next change your team expects to make. Which part would still leave someone manually checking the same thing every time, and what would Claude need in order to check it during the work?

Perhaps the application needs to expose a failure state that a browser check can exercise. Perhaps the reviewer needs a contract that currently lives in somebody's head. Or perhaps the unresolved issue is a design decision that needs a conversation before anyone starts coding. Work through the actual gap before choosing which mechanism to add.

Architecting with Claude develops this further: how I plan with the agent, turn the design into contracts, and coordinate implementation and review while planning continues. If working through this with your team exposes a problem you'd like another set of eyes on, you can reach me through the advisory site.
