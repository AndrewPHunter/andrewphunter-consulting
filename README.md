# Andrew Hunter advisory site

Hugo site for independent technical advisory, with the visual family of Andrew's
personal blog and Plainsight Systems. First-pass repositioning: November 12, 2026.

## Local preview

```sh
hugo server --bind 127.0.0.1 --port 1324 --baseURL http://localhost:1324/ --disableFastRender --cleanDestinationDir
```

For a clean production build separate from the running preview:

```sh
hugo --minify --destination /tmp/andy-advisory-production-review --cleanDestinationDir
```

## Content

- `content/_index.md`: homepage identity and introduction.
- `themes/consulting/layouts/index.html`: advisory situations, engagement approach,
  selected experience, and resource preview.
- `data/resources.yaml`: topic definitions and external resource links.
- `content/resources/_index.md`: resource-page introduction.
- `content/resources/<topic>/_index.md`: topic introductions.
- `themes/consulting/layouts/resources/`: library, topic, and material layouts.
- `archetypes/`: draft starters for trainings, decks, and guides.
- [Resource publishing guide](docs/resource-publishing.md): add and publish materials.
- `content/about/index.md`: background and approach.
- `themes/consulting/layouts/contact/single.html`: contact copy.
- The original consulting articles and `/insights/` archive were removed at
  Andrew's request. The current resource library links to his blog and lab work.
- `.impeccable.md`: approved positioning and design context.

Published local materials are collected automatically by topic. Resources shows up
to three selected entries per topic; each topic page holds the full collection, paginated at 12 items.
Trainings, decks, and guides use permanent `/resources/<slug>/` landing pages with
optional downloads and related reading. Existing blog and lab links keep their
original URLs. Search at `/resources/search/` covers the catalog with topic and
format filters. See the publishing guide for the complete workflow.

## Production deployment

Live at **https://advisory.andrewphunter.com/** as of November 12, 2026.
The existing Cloudflare Worker remains `andrewphunter-consulting`.
`wrangler.toml` declares `advisory.andrewphunter.com` as its Custom Domain;
Cloudflare manages the DNS record and HTTPS certificate.

The former `consulting.andrewphunter.com` binding and DNS record were removed at
Andrew's request. There is no redirect, and the old hostname should not be restored.
`hugo.yaml` uses the advisory URL for canonical metadata and the sitemap.

A push to `main` runs the resource checks, builds the production site, and deploys
through GitHub Actions. For a direct deployment, build into a separate directory
so a running Hugo preview cannot overwrite the production assets:

```sh
python3 scripts/check-resources.py
hugo --minify --destination /tmp/andy-advisory-release --cleanDestinationDir
wrangler deploy --assets /tmp/andy-advisory-release
```

After deployment, verify the homepage, topic pages, filtered resource search,
Contact, and HTTPS. Retired `/insights/` paths return 404. The static
`.assetsignore` excludes local filesystem metadata from Cloudflare uploads.

## Artwork

The new shared-worktable illustration is in `assets/images/advisory-worktable.png`.
Its full prompt and built-in generation provenance are saved in
`assets/images/README.md`. Hugo creates responsive WebP derivatives. Plex font
files are self-hosted; their license is in `static/fonts/OFL.txt`.
