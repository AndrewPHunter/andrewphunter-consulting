# Publishing resources

The library has three topic collections:

| Topic ID | Public page |
| --- | --- |
| `architecture` | `/resources/architecture/` — Architecture and delivery |
| `governance` | `/resources/governance/` — AI and governance |
| `engineering` | `/resources/engineering/` — Engineering in practice |

Each collection includes existing external reading and published local materials,
with 12 resources per page and linked, numbered pagination once needed.
A resource can belong to more than one topic. Downloads are optional, so a written
guide or browser-based training can stand alone.

## Start a training, deck, or guide

From the repository root, choose one:

```sh
hugo new content --kind training resources/your-training-slug
hugo new content --kind deck resources/your-deck-slug
hugo new content --kind guide resources/your-guide-slug
```

These create `content/resources/<slug>/index.md` with `draft: true`. Choose a
descriptive slug and keep it stable once shared. Do not use a topic ID as a slug.

Edit the title, description, date, topics, and body. Delete scaffold comments as
you write. A deck page should give someone who missed the talk enough context to
use it. A training should explain what participants will work through and any
preparation they need.

To preview drafts locally:

```sh
hugo server --buildDrafts --bind 127.0.0.1 --port 1325 --baseURL http://localhost:1325/ --disableFastRender --cleanDestinationDir
```

Draft pages carry a visible preview label and `noindex`. They appear in the local
catalog when `--buildDrafts` is enabled so you can review the whole journey.
Production builds omit them. Do not deploy a build made with `--buildDrafts`.

## Files, links, and related reading

Keep files beside the page that explains them:

```text
content/resources/your-training-slug/
  index.md
  slides.pdf
  slides.pptx
  exercise.zip
```

Enable only downloads that actually exist:

```yaml
downloads:
  - label: Slides (PDF)
    file: slides.pdf
  - label: Slides (PowerPoint)
    file: slides.pptx
  - label: Exercise files (ZIP)
    file: exercise.zip
recording_url: https://example.com/your-recording
related_resources: [read-the-estate, governance-under-scale]
```

Leave `recording_url` empty when there is no recording. Download files are resolved
from the bundle, so a missing file fails the build instead of publishing a broken
button. Only place public material in a published bundle: Hugo may publish bundle
files even when they are not listed in `downloads`.

External resource IDs are in `data/resources.yaml`. A local resource's default ID
is its folder name; set `resource_id` explicitly only if needed. Related resources
can point to either kind. Unknown topics, duplicate IDs, missing files, and
unpublished related resources fail the build with the source file identified.

## Choosing what appears where

| Front matter | Effect |
| --- | --- |
| `resource_type: training` | Display label: Training. Also supports `deck` and `guide`. |
| `resource_topics: [engineering, governance]` | Automatically includes the page in both topic collections. |
| `resource_selected: true` | Eligible for the three-item selection under each topic on Resources. |
| `resource_featured: true` | Eligible for the three-item resource preview on the homepage. |
| `resource_weight: 100` | Lower numbers sort first. At the same weight, newer local materials appear first. |
| `audience` / `duration` | Optional details beside the material, omitted when empty. |

The current external selections have weights 10–22. To put a new resource ahead
of them, choose a lower weight, or unselect an older item. Homepage features are
a separate choice from the Resources selection. Topic pages include the full
collection across pages of 12. If a topic has no selections, Resources uses its first three entries.

## Link from presentations and handouts

Use the landing page URL:

```text
https://advisory.andrewphunter.com/resources/your-training-slug/
```

That page can carry revised files, notes, and related reading without changing the
link in an older deck. Give files versioned names when keeping previous versions
matters. If a landing slug must change, retain the old URL with a Hugo `aliases`
entry on its replacement.

The advisory domain is live. Use these URLs in presentations and handouts.

## Publish

1. Review the material, downloads, and topic placement in the draft preview.
2. Set the publication date and `draft: false` when ready.
3. Run a clean production build and the resource checks:

   ```sh
   hugo --minify --destination /tmp/andy-advisory-production-review --cleanDestinationDir
   python3 scripts/check-resources.py
   ```

4. Review the generated page and its topic collection, then follow the normal
   commit and deployment process. A push to `main` deploys the site.

## Add external reading or a new topic

For an essay or project already hosted elsewhere, add an item to its topic in
`data/resources.yaml`: unique `id`, `title`, `kind`, `format`, `url`, and `description`, plus
optional `selected`, `featured`, and `weight`. Preserve the original destination;
do not copy the article onto the advisory site. Use a `format` ID from
`data/resource_formats.yaml` (for example `essay`, `series`, `project`, or `lesson`).
The display `kind` can remain more descriptive, such as “Essay & reference tables.”

For a new topic, add its metadata to `data/resources.yaml` and create
`content/resources/<topic-id>/_index.md` with `layout: topic` and
`resource_topic: <topic-id>`. The library and topic navigation pick it up
automatically. Add a topic when there is material for it, rather than an empty
collection waiting for content.

This uses Hugo's [directory archetypes](https://gohugo.io/content-management/archetypes/)
and [page resources](https://gohugo.io/content-management/page-resources/).

## Search and pagination

`/resources/search/` searches the complete catalog. Topic and format filters work
alongside the text query, and results use the same 12-item page size. Queries,
filters, and page numbers are stored in the URL for sharing and browser Back.
Only formats represented in the published catalog appear in the dropdown;
training and deck options appear automatically when those materials are published.

The search index at `/resources/search/index.json` contains titles, descriptions,
topics, formats, and the rendered plain text of local materials. External resources
contribute their catalog metadata; their articles and downloadable files are not
crawled or indexed. Drafts and future-dated content follow Hugo's build settings.
Search runs in the visitor's browser without a third-party search service. Topic
pages and their pagination work without JavaScript.

`content/resource-links/` holds non-rendered Hugo records generated from the YAML
catalog. These let external and local resources share Hugo's static pagination.
They do not produce article copies or public landing pages; keep them internal.

The resource checks require Hugo, Python 3, and Node.js. They create isolated
fixtures to test multi-page collections, canonical URLs, draft exclusion from the
index, download links, search matching, filter intersections, and page boundaries.
