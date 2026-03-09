---
title: "The Hidden Complexity of LLM Agent Architectures"
description: "Agent architectures look simple on a whiteboard and accumulate complexity faster than any other pattern because the complexity is behavioral, not structural."
date: 2026-02-01
draft: false
---

<p class="lede">Agent architectures look simple on a whiteboard. A model, some tools, a loop. The simplicity is an illusion. Agents accumulate complexity faster than almost any other architectural pattern because the complexity is behavioral — it emerges from the interaction of components that are each individually plausible — and behavioral complexity does not show up in diagrams.</p>

## The Whiteboard Problem

A whiteboard diagram of an agent architecture is a lie by omission. It shows components and connections. It does not show state accumulation across turns. It does not show authority boundaries and what happens when they are violated. It does not show how errors propagate when one agent's output becomes another agent's input. It does not show what recovery looks like when an action cannot be undone.

These are not implementation details. They are the hard problems. And they are invisible in every diagram that has ever been drawn of an agent architecture, because diagrams show topology and agents fail on semantics.

A common pattern: teams that build agent architectures from whiteboard diagrams discover the hard problems in production. State becomes inconsistent. An agent takes an action it was not authorized to take. A cascade of agents produces a result that is coherent at each step and catastrophically wrong in aggregate. Recovery is impossible because there is no rollback and the side effects are already committed.

The architecture looked clean. The behavior is not.

## State Management Across Agent Turns

The hardest state management problem in agent architectures is not within a single turn — it is across turns. Agents maintain context across multiple interactions, accumulate state incrementally, and make decisions based on that accumulated state. When the state is wrong — stale, inconsistent, or corrupted by an earlier model error — every subsequent decision inherits the problem.

The challenge is that agent state is not managed by a database with transactional guarantees. It is managed by the model's context window, or by application state that is built around the model's context window. Neither provides the isolation, consistency, or durability that traditional state management provides. A model that misremembers something from three turns ago has no error correction mechanism. It will confidently proceed on a false premise until something external contradicts it.

Explicit state management is the fix. Treat agent state as a first-class system concern: define what state exists, where it lives, how it is validated, and when it is cleared. Do not trust the model to maintain consistent state across a long interaction. The model's context is a cache, not a database. Design accordingly.

Checkpoint state at meaningful boundaries. Know what a clean state looks like. Have a mechanism for detecting when state has diverged from a known-good condition. Without these properties, a multi-turn agent is a system where errors accumulate invisibly across interactions until they cause a failure that is difficult to trace back to its source.

## Authority Boundaries

An agent's authority boundary defines what it is permitted to do without human confirmation. Authority boundaries refer to what the system is actually permitted to do — not what it can produce as output, but what actions it can take. In traditional software, those boundaries are enforced structurally: access controls, permission systems, transaction limits. In agent architectures, authority boundaries are almost never enforced structurally. They are expressed in prompts, which the model may or may not respect, under conditions that are difficult to predict.

A common pattern is authority creep. An agent designed to read and summarize documents gradually starts editing them. An agent authorized to draft messages starts sending them. An agent given broad tool access uses tools in combinations that were not anticipated and produce outcomes that were not authorized. Each step looks locally reasonable. The aggregate behavior is outside the intended authority.

Structural authority enforcement means the execution layer — not the model — gates actions against defined authority rules. The model can suggest. The execution layer decides whether the suggestion is within bounds. This requires knowing, explicitly, what each agent is authorized to do and not do. That specification is harder to write than a prompt, and far more reliable than one.

Without structural authority enforcement, you do not have an agent with bounded authority. You have an agent with suggested authority, which is a different thing entirely.

## Cascading Failures in Multi-Agent Systems

In multi-agent architectures, one agent's output is another agent's input. This creates a failure propagation path that is specific to agents: a plausible-looking error that does not trigger any error handling in the first agent becomes a premise for the second agent's reasoning. The second agent produces output that is locally coherent with its input and globally wrong. The third agent builds on that.

This cascade is qualitatively different from error propagation in deterministic systems. In deterministic systems, type errors and null checks prevent many classes of invalid input from propagating. In agent systems, the input is natural language or structured data that is syntactically valid and semantically wrong. There is no type system for semantic correctness. The agents process the bad input without complaint.

For example, if a research agent incorrectly identifies a company's founding year and passes that to a writing agent, the writing agent will produce a polished, confident paragraph with the wrong date. No error was thrown. Both agents performed their functions correctly. The system produced a bad outcome because there was no validation gate between them.

Designing against cascade failures requires validation gates between agents — explicit checks that the output of one agent meets the preconditions for the next. These gates need to be designed before the system is built, not discovered in production. They need to specify what valid output looks like, what to do when output is invalid, and how to surface the failure rather than absorbing it and continuing.

A multi-agent system without explicit inter-agent contracts and validation gates is not a designed system. It is a collection of agents that happen to pass data to each other.

## The Absence of Rollback

Software systems that modify state have rollback. Databases have transactions. Message queues have acknowledgment semantics. Infrastructure changes have deployment rollbacks. Agent architectures have none of these by default — and agent architectures are uniquely prone to taking irreversible actions because the entire point of an agent is to act in the world.

An agent that sends an email, deletes a file, posts to an API, makes a purchase, or modifies a database record has taken an action that cannot be recalled. If the action was wrong — based on a model error, a stale state, an unauthorized decision — the damage is done. The rollback question is not engineering trivia. It is the question that determines whether the system can be operated safely.

Designing for rollback means classifying actions by reversibility before they are taken. Read-only actions carry no rollback risk. Reversible writes — soft deletes, draft states, staged changes — carry manageable risk. Irreversible actions — hard deletes, sent messages, committed transactions in external systems — require explicit confirmation before execution.

This classification should be part of the architecture, not a runtime judgment by the model. The model should not be deciding in the moment whether an action is sufficiently reversible to proceed without confirmation. That decision belongs in the execution layer, as a structural constraint, enforced before any action is taken.

Agent architectures are a governance problem before they are an engineering problem. The governance questions — who can authorize what, what happens when something goes wrong, how you recover — need answers before the engineering work begins. Teams that skip the governance questions and build the engineering first discover that the engineering they built cannot accommodate the governance they need.

---

If you're building an AI-driven product and want a second opinion on architecture or scaling risks, I offer [Architecture Discussions](/#what-i-do) — focused sessions for founders and technical teams working through real decisions.

[me@andrewphunter.com](mailto:me@andrewphunter.com)
