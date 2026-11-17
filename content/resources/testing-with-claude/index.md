---
title: Testing with Claude
description: Decide which generated tests to leave out, narrow, or remove so the suite protects behavior without freezing the implementation.
date: 2026-11-16
draft: false
resource_type: deck
resource_series: architecting-with-claude
resource_series_order: 3
resource_topics: [engineering]
resource_selected: false
resource_featured: false
resource_weight: 7
audience: Engineering leads and developers reviewing agent-generated code and tests.
duration: 30–40 minutes with discussion
downloads:
  - label: Slides (PDF)
    file: testing-with-claude-v1.pdf
  - label: PowerPoint with speaker notes
    file: testing-with-claude-v1.pptx
---

An agent can generate a test for every function, then generate another set when asked to review its work. Each assertion becomes something the next implementation has to satisfy, whether or not anyone depends on it.

This 15-slide deck examines tests that do not earn that obligation: assertions about private structure, library and API pass-throughs, duplicate checks, and incidental configuration. It follows how chasing 100% coverage can couple the suite to the implementation until a refactor requires rewriting the very assertions meant to catch regressions.

The examples cover application code and browser/API behavior alongside excerpts from my actual testing instructions. The closing prompts ask Claude to recommend keeping, narrowing, or removing tests, with a contract and a distinct failure to justify each one that remains.

## Use it with your team

Bring a real diff with generated tests, particularly one where the tests changed during a behavior-preserving refactor. Work through what each assertion protects and whether another check already catches the same failure. Include the cost of repeated fixtures and integration cases that replay the unit suite.

The PowerPoint includes my speaker notes for every slide so you can run the discussion. The PDF is the slide-only reading copy.
