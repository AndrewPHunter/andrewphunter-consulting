---
title: "Technical Diligence for AI Startups"
description: "Technical diligence for AI startups requires a different frame: not code quality, but whether the system's claims are structurally supportable beyond demo conditions."
date: 2026-03-04
draft: false
---

<p class="lede">Technical diligence for AI startups requires a different frame than traditional software diligence because the failure modes are different and the demo is specifically designed to hide them. What the model does in a controlled evaluation is not a reliable predictor of what the system does in production. The diligence process needs to surface that gap.</p>

## The Demo Gap

Every AI startup demonstrates capability under the best conditions available: clean data, representative queries, a domain the founders know well, evaluation criteria the system was implicitly optimized for. The demo is not dishonest. The demo just represents a narrow slice of the conditions under which the system will eventually operate.

The gap between demo and production is structural. It is not about the team's competence or the model's capability. It is about the difference between what was designed for and what will be encountered. Production users submit inputs that were not anticipated. Edge cases accumulate. The corpus changes. The query distribution shifts. New use cases emerge that stress the system in ways the founders had not considered.

Traditional diligence frameworks miss this gap because they evaluate the system as it exists rather than evaluating its structural capacity to handle conditions it has not yet encountered. Code quality, test coverage, deployment practices — these are meaningful signals, but they evaluate the present state of a system that will need to evolve into production conditions it has not yet seen.

The diligence question is not "does this work?" It is "is this designed to work under conditions more demanding than the ones we have seen?"

## What You Are Actually Measuring

Technical diligence for an AI startup is measuring structural maturity, not feature completeness. A system can be architecturally immature and feature-complete — it has all the capabilities the pitch deck describes, implemented in ways that will not survive production conditions. Conversely, a system can be architecturally sound and relatively early in feature development. The first is a more serious risk than the second.

For example, a system that handles the twenty use cases in the demo perfectly but has no defined behavior when the model produces output outside its expected format is architecturally immature. The happy path works. The failure path was never designed. That is the distinction structural maturity captures — not what the system can do, but how it behaves when conditions depart from the expected.

Structural maturity shows up in specific, concrete properties. Are the system's components separated by explicit boundaries? Does the team know what happens when the AI component produces wrong output? Is the system observable enough to diagnose a production failure? Can the system be changed — model swapped, retrieval strategy revised, new data type added — without cascading breakage? These properties are distinguishable from each other and can be evaluated through direct technical discussion.

Structural maturity also shows up in the team's fluency with structural questions. A team that can answer "what are your failure modes?" with specificity has thought about the question. A team that responds with a description of what the system does when it works has not. The quality of the answers to structural questions is a direct signal of whether structural thinking has been applied.

## Structural Questions vs. Technical Questions

Technical questions establish capability: does the system do what the pitch says it does? These questions are necessary but not sufficient for diligence.

Structural questions establish operability: can the system be run, maintained, and evolved in production? These are the questions that traditional diligence underweights for AI startups.

The key structural questions:

What happens when the model produces unexpected output? Not "the model is wrong" — specifically unexpected: output that is syntactically valid but semantically wrong, output that is outside the expected distribution, output that violates an implicit assumption in the system design. A team that has a defined answer to this question has designed for it. A team that says "the model is very good" has not.

What is the blast radius of a failure? When something goes wrong — and it will — how far does the failure propagate before it is detected and contained? Is there a human in the loop for high-stakes decisions, or does model error become system action directly? Does the failure surface visibly or silently?

How is the system instrumented? Observability simply means the system records enough information about what it did and why so engineers can reconstruct what happened later. When a production failure occurs, can the team do that — reconstruct the inputs, the outputs, the model version, the context? Or will the debugging process depend on reproducing the failure from incomplete information?

What does the team not know about their own system? This is the hardest question to ask and the most revealing to receive. A team that can articulate the gaps in their knowledge — the failure modes they have not explored, the scaling assumptions they have not validated, the governance requirements they have not implemented — is a team that is reasoning about their system accurately. A team that cannot identify gaps is not.

## Red Flags

Certain patterns in a technical diligence conversation reliably indicate architectural immaturity.

Capability-dominant answers. Every structural question receives an answer about what the system does rather than how it is designed. "We use a state-of-the-art model" does not answer "what happens when the model is wrong."

Surprise at structural questions. A team that has not been asked structural questions before, and shows visible uncertainty when asked them, has been evaluated primarily on demos. That means the structural problems have not been surfaced yet — not that they do not exist.

Undefined failure modes. "The model is very accurate" is not a failure mode description. Neither is "we validate the output" without specificity about what is validated against what. If the team cannot describe specific failure modes with specific detection and response mechanisms, those failure modes have not been designed for.

No separation between inference and execution. A system where the model's output directly triggers irreversible actions — writes to production databases, external API calls, message sends — without an explicit authorization and validation layer has not been designed for controllability. This is a governance risk, not just an engineering quality concern.

## What Good Architecture Looks Like Under Diligence

A well-architected AI startup system is distinguishable under diligence by several characteristics.

The team can draw the system's boundaries from memory and describe what each boundary enforces. They know what the AI component receives, what it produces, and what the system does with that output before acting on it. They have thought about the AI layer as a component within a larger system, not as the system itself.

The team can describe their failure modes with specificity: what the modes are, how they are detected, what the system does in response, and what the human escalation path looks like for failures that require human judgment.

The team has instrumentation that would allow them to diagnose a production failure after the fact. They can specify what is logged, what is traceable, and what questions the observability infrastructure can answer.

The team has thought about what changes they expect to make and can describe how those changes would be executed safely. They know which parts of the system are most likely to change and have designed those parts to be changeable.

This last point is the most telling. Teams with architectural clarity can anticipate their own evolution. They have built with change in mind. That is the surest indicator of a team that has moved beyond demo thinking into the discipline of building systems that work in production.

---

If you're building an AI-driven product and want a second opinion on architecture or scaling risks, I offer [Architecture Discussions](/#what-i-do) — focused sessions for founders and technical teams working through real decisions.

[me@andrewphunter.com](mailto:me@andrewphunter.com)
