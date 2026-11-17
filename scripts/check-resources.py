#!/usr/bin/env python3
"""Exercise publication and download behavior in an isolated content tree."""

import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
import shutil
import subprocess
import tempfile
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]


class Links(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.hrefs = []
        self.resource_hrefs = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a" and attrs.get("href"):
            self.hrefs.append(attrs["href"])
            if "resource-row" in attrs.get("class", "").split():
                self.resource_hrefs.append(attrs["href"])


def run(*args, success=True):
    result = subprocess.run(args, cwd=ROOT, text=True, capture_output=True)
    output = result.stdout + result.stderr
    if success and result.returncode:
        raise AssertionError(output)
    if not success and not result.returncode:
        raise AssertionError("Expected the build to reject invalid resource metadata")
    return output


def check_links(output):
    for page in output.rglob("*.html"):
        for href in Links(page.read_text()).hrefs:
            parts = urlsplit(href)
            if parts.scheme or parts.netloc or not parts.path:
                continue
            path = unquote(parts.path)
            target = output / path.lstrip("/") if path.startswith("/") else page.parent / path
            if target.is_dir():
                target /= "index.html"
            assert target.is_file(), f"Broken internal link in {page}: {href}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--keep-preview", action="store_true", help="Keep isolated fixture output for visual review")
    args = parser.parse_args()
    work = Path(tempfile.mkdtemp(prefix="advisory-resources-"))
    passed = False
    try:
        content, output = work / "content", work / "public"
        shutil.copytree(ROOT / "content", content)
        build_args = ("hugo", "--contentDir", str(content), "--destination", str(output), "--cleanDestinationDir", "--noBuildLock")

        # Exercise the documented creation commands, including safe draft defaults.
        for kind in ("training", "deck", "guide"):
            run("hugo", "new", "content", "--contentDir", str(content), "--kind", kind, f"resources/preview-{kind}")
            path = content / "resources" / f"preview-{kind}" / "index.md"
            assert path.is_file(), f"{kind} archetype did not create a leaf bundle"
            assert "draft: true" in path.read_text()

        run(*build_args)
        for kind in ("training", "deck", "guide"):
            assert not (output / "resources" / f"preview-{kind}").exists(), "Draft leaked into production"
        check_links(output)
        baseline = json.loads((output / "resources/search/index.json").read_text())

        training = content / "resources/preview-training/index.md"
        training.write_text('''---
title: Working with agent harnesses
description: A training layout preview with exercises, slides, and related reading.
date: 2026-11-01
draft: false
resource_type: training
resource_topics: [engineering, governance]
resource_selected: true
resource_featured: true
resource_weight: 1
audience: Engineering leads and engineers working with coding agents.
duration: 90 minutes
downloads:
  - label: Exercise notes (TXT)
    file: exercise.txt
related_resources: [read-the-estate, governance-under-scale]
---

This is a layout fixture for checking the publishing structure. It is not a published training.

## What we will work through

Follow a change from the initial brief through implementation and review. At each
step, identify what the agent needs to know and what the engineer needs to check.

1. Define the work and its boundaries.
2. Establish what evidence a completed change must include.
3. Review the result and work through a failure.

## Before you begin

Bring a small change you can explain to another engineer. The exercise notes give
you a place to record the decisions as you work through it.
''')
        (training.parent / "exercise.txt").write_text("Layout fixture. Not published training material.\n")
        # Enough materials to exercise the landing-page cap and full topic collection.
        for index in range(2, 26):
            bundle = content / "resources" / f"preview-extra-{index}"
            bundle.mkdir()
            (bundle / "index.md").write_text(f'''---
title: Preview extra {index}
description: Resource collection fixture.
date: 2026-11-01
resource_type: guide
resource_topics: [engineering]
resource_selected: true
resource_weight: {index}
---
Fixture.
''')

        run(*build_args)
        page = (output / "resources/preview-training/index.html").read_text()
        assert "Time to set aside" in page and "90 minutes" in page
        assert 'download' in page and "/resources/preview-training/exercise.txt" in page
        assert "read-the-estate" in page and "governance-under-scale" in page
        assert (output / "resources/preview-training/exercise.txt").is_file()
        landing = Links((output / "resources/index.html").read_text())
        engineering = Links((output / "resources/engineering/index.html").read_text())
        governance = Links((output / "resources/governance/index.html").read_text())
        assert len(landing.resource_hrefs) <= 3 * len(baseline["topics"])
        total = sum("engineering" in item["topics"] and item["listed"] for item in baseline["items"]) + 25
        total_pages = (total + 11) // 12
        all_items = []
        for number in range(1, total_pages + 1):
            suffix = "" if number == 1 else f"page/{number}/"
            page_path = output / f"resources/engineering/{suffix}index.html"
            html = page_path.read_text()
            rows = Links(html).resource_hrefs
            assert len(rows) == min(12, total - (number - 1) * 12)
            assert 'aria-current="page"' in html
            if number > 1:
                assert f'rel="canonical" href="https://advisory.andrewphunter.com/resources/engineering/page/{number}/"' in html
            all_items.extend(rows)
        assert len(set(all_items)) == total, "Pagination lost or repeated resources"
        if sum("architecture" in item["topics"] for item in baseline["items"]) <= 12:
            assert not (output / "resources/architecture/page/2").exists()
        assert not (output / "resource-links").exists(), "Internal link records must never be rendered"
        index = json.loads((output / "resources/search/index.json").read_text())
        assert len(index["items"]) == len(baseline["items"]) + 25
        assert not any(item["id"] in ("preview-deck", "preview-guide") for item in index["items"])
        training_item = next(item for item in index["items"] if item["id"] == "preview-training")
        assert "Define the work and its boundaries" in training_item["body"]
        assert training_item["format"] == "training"
        assert all(not item["body"] for item in index["items"] if item["external"])
        run("node", "--test", "scripts/check-resource-search.mjs")
        assert "/resources/preview-training/" in governance.resource_hrefs
        assert "/resources/preview-training/" in Links((output / "index.html").read_text()).resource_hrefs
        assert len(Links((output / "index.html").read_text()).resource_hrefs) == 3
        check_links(output)

        original = training.read_text()
        cases = (
            ("file: exercise.txt", "file: missing.pdf", "is missing from the page bundle"),
            ("[engineering, governance]", "[unknown-topic]", "unknown resource topic"),
            ("[read-the-estate, governance-under-scale]", "[preview-deck]", "unknown or unpublished"),
        )
        for old, new, error in cases:
            training.write_text(original.replace(old, new))
            assert error in run(*build_args, success=False)
        training.write_text(original)

        run(*build_args, "--buildDrafts")
        for kind in ("deck", "guide"):
            draft = (output / "resources" / f"preview-{kind}" / "index.html").read_text()
            assert "Draft preview" in draft and "noindex" in draft
        check_links(output)
        passed = True
        print("PASS: archetypes, draft exclusion/preview, topic placement, 12-item pagination, search index/filtering, curated limits, downloads, related links, invalid metadata, and internal links.")
        if args.keep_preview:
            print(f"Visual-review fixtures (not site content): {output}")
    finally:
        if not (args.keep_preview and passed):
            shutil.rmtree(work)


if __name__ == "__main__":
    main()
