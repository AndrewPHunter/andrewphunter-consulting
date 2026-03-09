---
title: "How to Evaluate the Architecture of an AI Startup"
description: "You don't need to read the code to evaluate an AI startup's architecture. You need the right diagnostic questions — ones that reveal maturity, not just capability."
date: 2026-02-06
draft: false
---

<p class="lede">You do not need to read the code to evaluate the architecture of an AI startup. What you need is a set of questions that reveal architectural maturity rather than surface capability — questions that are difficult to answer well without having actually thought through the hard problems, and easy to answer badly with a confident-sounding non-answer.</p>

## What You Are Actually Evaluating

Technical evaluation of an AI startup is not primarily about whether the technology works. In a demo, it probably works. The question is whether it works under conditions the demo does not represent: production load, adversarial inputs, model errors, dependency failures, changed requirements. The architecture is the set of decisions that determine how the system behaves when conditions are not ideal.

Architectural maturity shows up in how a team talks about their system. Teams with immature architectures describe what the system does. Teams with mature architectures describe what the system does, what it does not do, what happens when it fails, and what they have traded off against what. The difference is specificity. Specificity requires having made the decisions. Absence of specificity indicates the decisions were deferred.

For example, a team that says "we use a retrieval layer to ground the model's responses" has described a component. A team that says "our retrieval layer returns a ranked list of up to five documents, and if none score above our relevance threshold, the model is instructed to decline rather than guess" has described a system with a defined contract. The second answer reveals architectural thinking. The first does not.

Evaluating architecture is evaluating decision quality, not implementation completeness. A system that is incomplete but architecturally sound is a different proposition from a system that is feature-complete but architecturally fragile. The first can be finished. The second will need to be rebuilt.

## The Boundary Test

The first diagnostic is simple: ask the team to describe the system's boundaries. Where does the AI component start and where does it stop? What does it receive as input, and from what? What does it produce as output, and to what? What does it own, and what does it depend on?

A team that can answer this question precisely has explicit architectural boundaries. A team that describes the system as "we use GPT-4 to do X" has not defined a boundary — they have named a component. The component is not the architecture.

Follow up: what happens at the boundary when the AI component produces unexpected output? Is there a validation layer? What does it validate against? What is the contract between the AI component and the system that consumes its output? If the model is updated and its output format changes subtly, how does that get caught?

These questions are not exotic. They are the questions any system architect would ask about any component interface. The fact that the component is a language model does not change the questions. Teams that have thought about their architecture have answers. Teams that have not will tell you about the model's capabilities.

## The Failure Mode Test

Ask the team to describe how the system fails. Not can it fail — what are the actual failure modes, what do they look like, and what happens downstream?

An AI system has at least three distinct failure categories. The model produces a wrong answer that looks right. The model produces output outside the expected distribution. And the system surrounding the model fails for reasons unrelated to the model. Each category has different detection mechanisms and different recovery paths. Teams that have thought about this can describe the failure modes in detail. Teams that have not will say "we validate the output" without being able to specify what validation catches and what it misses.

The follow-up question is equally diagnostic: what is the blast radius of a failure? When the model is wrong, how far does the wrongness propagate before something detects and contains it? Does the system have a human in the loop for high-stakes decisions, or does model error become system action directly? The answer reveals whether the architecture was designed for reliability or for demo conditions.

A useful question for agent architectures: what is the most destructive thing the system could do if the model behaved unexpectedly, and what prevents it? If the team cannot answer the first part, they have not thought about authority boundaries. If they cannot answer the second part, they have not designed any.

## The Change Test

Ask the team what it would take to change something fundamental about the system: switch to a different model, change the chunking strategy in their retrieval layer, replace their embedding model, add a new type of document to the corpus.

These are not hypothetical questions. Systems that are in production get changed. Models get deprecated. Better retrieval strategies become available. Requirements change. The ability to make these changes safely and predictably is an architectural property. Teams with sound architecture can describe the change, the affected components, and the verification approach. Teams with fragile architecture will describe the change as "should be straightforward" without specifics.

A system where every change is "probably fine" has no explicit architectural guarantees. It has accumulated assumptions rather than stated contracts. When those assumptions are violated by a change, the failure is surprising because nobody knew what the system was depending on. This pattern is common in systems built for velocity rather than operability.

The change test also reveals coupling. If changing the model requires changes in five other places because output parsing is scattered across the codebase, the system is tightly coupled to its current model in ways that will make migration expensive. If the team does not know how many places would need to change, they have not mapped their dependencies.

## What Maturity Looks Like

Architectural maturity in an AI startup is not about the complexity of the architecture. It is about the explicitness of the decisions. A simple, well-understood architecture with clear boundaries and explicit contracts is more mature than a sophisticated architecture that nobody can fully explain.

Mature teams know what their system guarantees and what it does not. They know which failure modes they have designed against and which ones they have accepted. They can describe the tradeoffs they made and why. They can point to the places where the architecture is weakest and tell you the plan for strengthening them.

Teams with less architectural maturity describe the system in terms of what it can do rather than how it is structured. They conflate model capability with system reliability. They are uncertain about failure modes because they have not systematically explored them. They describe observability — the system's ability to record what it did so engineers can reconstruct what happened later — as "we have logging" without being able to specify what is logged, what is traceable, and what questions the logs can answer.

The goal of a technical evaluation is not to find a team that has solved all the hard problems. It is to find a team that knows where the hard problems are. A team that can articulate the structural risks of their architecture and describe their plan for addressing them is a team that can be trusted with investment and time. A team that is surprised by architectural questions has hard problems they do not know about yet — and will discover in production.

---

If you're building an AI-driven product and want a second opinion on architecture or scaling risks, I offer [Architecture Discussions](/#what-i-do) — focused sessions for founders and technical teams working through real decisions.

[me@andrewphunter.com](mailto:me@andrewphunter.com)
