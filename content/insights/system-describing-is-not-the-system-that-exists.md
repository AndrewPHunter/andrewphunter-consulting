---
title: "The System You’re Describing Is Not the System That Exists"
description: "System analysis does not begin with understanding. It begins with verifying whether the system being described actually exists."
date: 2026-02-01
draft: false
---

When I am brought into a system, I do not begin by trying to understand it.

I begin by assuming that the system being described—through documentation, architecture diagrams, or team explanations—is not the system that actually exists.

This is not skepticism for its own sake. It is a recognition of how systems evolve. Over time, decisions accumulate, behavior changes, and assumptions drift. What remains is a gap between representation and reality.

System analysis starts by closing that gap.

---

## Establishing a Baseline of Reality

The first step is straightforward.

I pull the codebase and begin a top-down review, not to understand every detail, but to get a sense of structure, boundaries, and how components relate to each other. At the same time, I speak with the teams working in the system. I ask how they feel about the codebase, what they avoid touching, and what is described as “just the way it has always been.”

These conversations are not taken as truth. They are signals. They indicate where the system has accumulated friction, where assumptions have hardened, and where understanding may be incomplete.

In parallel, I look at production logs and uptime reports. Logs are one of the few places where the system reveals how it actually behaves under real conditions. When logs are missing, incomplete, or inconsistent, that absence is itself a signal. Systems that cannot describe their own behavior in production are rarely well understood by the people operating them.

---

## What Can Be Verified

The most reliable way to understand a system is to run it.

If the system can be executed locally in a way that approximates production behavior, it becomes possible to test assumptions directly. If it cannot, that limitation is not incidental. It indicates that the system’s behavior depends on conditions that are not fully known or reproducible.

From there, I trace real flows through the system.

A single request is often enough. How does a transaction occur? How does data move from input to output? Where are decisions made, and what information do they depend on?

These traces reveal the system in motion. They expose dependencies that are not documented, behaviors that are not explicitly defined, and assumptions that exist only in execution.

What emerges is not the system as described, but the system as it actually operates.

---

## Where Systems Reveal Themselves

The gap between representation and reality becomes visible in specific ways.

Unit tests often exist, but they are shallow. They validate isolated behavior without capturing meaningful business conditions. High coverage numbers give the impression of safety, but do not provide confidence in how the system behaves under real scenarios.

Invariant validation is typically absent. There are few, if any, mechanisms ensuring that critical properties of the system remain true as it evolves. The system accepts inputs and produces outputs, but does not enforce the conditions that make those outputs meaningful.

Recovery mechanisms are similarly missing or incomplete. When something goes wrong, the system does not have a clear, reliable path back to a known good state. Instead, recovery is handled through manual intervention or ad hoc processes.

These are not implementation details. They are indicators that the system lacks the structures required to maintain integrity over time.

---

## Signals of Drift

Other signals appear in the shape of the codebase itself.

Repositories show signs of decay: dead code that is no longer referenced, documentation that no longer reflects reality, and setup processes that rely on individual scripts rather than reproducible systems. Each of these indicates that the system has evolved without maintaining alignment between its parts.

None of these issues, in isolation, define the system. But together they form a pattern. The system is not being maintained as a coherent structure. It is being extended and adapted without preserving the properties that make it understandable.

---

## What Not to Trust

Two of the most common metrics used to assess systems are also among the least reliable.

Test coverage is often treated as a proxy for quality. In practice, high coverage frequently correlates with tests that validate implementation details rather than behavior. When coverage approaches completeness, it often indicates that tests have been written to satisfy a metric, not to enforce correctness.

Velocity is similarly misleading. Systems that push for consistently high throughput, especially beyond what would be considered reasonable for their complexity, tend to accumulate fragile implementations and brittle deployment patterns. What appears as speed in the short term often reflects deferred cost rather than sustainable capability.

These metrics describe activity. They do not describe integrity.

---

## The System That Exists

By the time this process is complete, a different picture emerges.

There is the system that is described—through diagrams, documentation, and team understanding—and there is the system that exists, defined by what actually happens when it runs.

System analysis is the process of reconciling these two.

It is not about building a complete mental model of the system. It is about determining where that model is accurate, where it is incomplete, and where it is wrong.

---

## The Principle

A system cannot be understood through description alone.

It must be observed, executed, and tested against reality.

The system that matters is not the one that is intended or documented. It is the one that actually operates.

Until that system is made visible, everything else is assumption.