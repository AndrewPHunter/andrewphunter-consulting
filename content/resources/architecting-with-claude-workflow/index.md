---
title: Architecting with Claude
description: Work through a design with Claude, then carry the agreed plan into contracts, implementation, and independent review.
date: 2026-11-16
draft: false
resource_type: deck
resource_series: architecting-with-claude
resource_series_order: 2
resource_topics: [engineering]
resource_selected: false
resource_featured: false
resource_weight: 6
audience: Engineering leads and developers already working with coding agents.
duration: 45–60 minutes with discussion
downloads:
  - label: Slides (PDF)
    file: architecting-with-claude-v1.pdf
  - label: PowerPoint with speaker notes
    file: architecting-with-claude-v1.pptx
---

Coding agents can implement a poor design quite faithfully. I want to work through the decisions while they're still decisions: investigate the problem, compare approaches, draw the relationships, and establish what the system needs to preserve.

This 23-slide deck shows how I carry that conversation into execution. An agreed plan enters a separate thread through my custom `/architect` workflow. The architect derives the contracts and proposed tests, brings them back for review, and then coordinates implementation and an independent reviewer. Planning can continue while work with settled dependencies progresses.

The slides include excerpts from the agent definitions and architect skill I use, with omissions marked. A settings-reload example shows the agreement moving through the workflow, and the same reasoning extends to API behavior and the states a person sees in a frontend.

## Use it with your team

Choose a change whose dependencies you can explain. Identify the decisions the next agent would need, the promises the implementation must preserve, and what would establish that it worked. On a team, named engineers own their plans and acceptance. A change to another component's contract involves its owner.

The PowerPoint includes my speaker notes for every slide. Use the PDF to read or share the slides. If your team is still establishing its Claude Code workflow, begin with [Working with Claude](/resources/working-with-claude/).
