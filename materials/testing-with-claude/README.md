# Testing with Claude

Third presentation accompanying [Architecting with Claude](https://andrewphunter.com/writing/architecting-with-claude/).

[Open the editable presentation](https://chatgpt.com/space/page_657b563de72081918bcc36dd35ead3d7).

Prepared for the advisory site: 15 slides with presenter notes. Intended for an engineering lead to use with their team without Andrew presenting.

The deck addresses tests agents should leave out or remove: assertions on private structure, pass-throughs, duplicate checks, incidental settings, and tests that force production code to change just to accommodate them. It follows how chasing 100% coverage can couple the regression suite to implementation, then applies the same scrutiny to test-file proliferation, repeated fixtures, and integration duplication. The closing prompts ask Claude to keep, narrow, or remove tests, with a reason for each decision.

## Review material

- [Slide text and notes](source/slides.md)
- [Presenter notes](source/notes.md)
- [Presentation metadata](source/artifact.json)

The API-wrapper pseudocode and prompts are labeled illustrations. Explanations use application examples, including sample customer data, UI state, and browser/API flows. Source excerpts preserve the wording from the actual testing strategies and agent files, with whitespace reflow and `[...]` marking omissions. The reviewer is Opus as requested for this series. No example run results are presented as observed evidence.

## Source

`source/deck.mjs` revises the saved presentation through Artifact Session. The cover retains the advisory site's worktable artwork and the series typography and colors. `source/excerpts.mjs` contains the exact selections and source hashes. `source/build-excerpts.py` validates and regenerates those selections from local source files. Verification records and rendered review images are under ignored `.build/`.

The resource page and PDF/PowerPoint downloads live at `content/resources/testing-with-claude/`. Its series navigation links the existing essay and the preceding decks. There is no companion agent bundle or demo repository.

## Advisory downloads

- Resource page: `content/resources/testing-with-claude/index.md`
- PDF: `testing-with-claude-v1.pdf` (slides only)
- PowerPoint: `testing-with-claude-v1.pptx` (editable slides and speaker notes)

The public files live beside the resource page. `materials/working-with-claude/source/export-series.mjs` exports the approved snapshots and preserves the intended link colors. Export checks cover slide counts, notes, links, and visual inspection of the PDF pages.
