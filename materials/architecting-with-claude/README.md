# Architecting with Claude

Second presentation in the advisory series. [Open the editable presentation](https://chatgpt.com/space/page_d733ac8e0f548191895b647db39de0dc).

The approved [Architecting with Claude](https://andrewphunter.com/writing/architecting-with-claude/) article supplies the argument. This presentation develops cooperative planning, execution threads, contracts, verification, independent review, and team ownership. The first deck covers Claude Code's foundational habits. Detailed test design remains a separate presentation.

## Review

- [Presenter notes](source/notes.md): spoken explanations for all 23 slides.
- [Slide text and notes](source/slides.md): the presentation's copy together for editorial review.

The agent and architect blocks use source excerpts, with `[...]` marking omissions. The reviewer model is changed to Opus as requested. `source/excerpts.mjs` records each selection, its source file, and the source hash; `source/build-excerpts.py` verifies and regenerates those excerpts. Project-specific setup is omitted. Settings-reload remains explicitly labeled as an illustrative teaching example. There is no accompanying file bundle.

## Source

`source/deck.mjs` contains the initial layouts. `source/revise.mjs` revises the initial 18-slide deck and calls `source/refine.mjs` for the final 23-slide presentation. Supply the notes map keyed by the headings in `source/notes.md`. Do not apply the initial revision twice to an already revised deck.

`source/artifact.json` records the current presentation reference. The saved deck and notes are the review artifacts. Retired drafting material is kept under the ignored `.build/` directory.

The deck resource page and both downloads live at `content/resources/architecting-with-claude-workflow/`. The deck footer links to the series landing page at `/resources/architecting-with-claude/`, which connects the essay and all three presentations in order.

## Advisory downloads

- Resource page: `content/resources/architecting-with-claude-workflow/index.md`
- PDF: `architecting-with-claude-v1.pdf` (slides only)
- PowerPoint: `architecting-with-claude-v1.pptx` (editable slides and speaker notes)

The public files live beside the resource page. `materials/working-with-claude/source/export-series.mjs` exports the approved snapshots and preserves the intended link colors. Export checks cover slide counts, notes, links, and visual inspection of the PDF pages.
