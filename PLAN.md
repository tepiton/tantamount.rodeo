# tantamount.rodeo — pandoc template sandbox

This repo is the working sandbox for the `simple-markdown` template type.

## Goal

Prove out a pandoc-based single-page site that mimeo can generate and deploy,
with no Node.js or SSG toolchain required.

## Template structure

```
index.md                        # site content (markdown)
style.css                       # stylesheet
.github/
  workflows/
    pages.yml                   # pandoc build + GitHub Pages deploy
.nojekyll                       # disable Jekyll processing
```

## Build workflow

GitHub Actions on push to `main`:

1. Install pandoc (`apt-get install pandoc`)
2. Run `pandoc index.md -o index.html --css style.css --standalone`
3. Deploy `index.html` + `style.css` to GitHub Pages

No `npm install`, no build cache, no Node version matrix. Fast and simple.

## What mimeo needs to do

When `mimeo create example.com --template simple-markdown`:

1. Generate `index.md` with placeholder content (domain name, brief text)
2. Copy `style.css` from bundled template
3. Write `.github/workflows/pages.yml`
4. Write `.nojekyll`
5. Push to GitHub repo (same as current flow)
6. Enable GitHub Pages with build-from-Actions source
7. Configure custom domain + DNS (same as current flow)

The only difference from the current `create` flow is step 1-4:
instead of generating a static `index.html`, we generate the markdown +
stylesheet + workflow.

## Eleventy-based templates

Three interoperable Eleventy v3 templates exist in `~/projects/mimeo-sites/TEMPLATES/`
and as repos in the `tepiton` GitHub org:

| Template | Repo | Custom domain | Character |
|----------|------|---------------|-----------|
| `eleventy-pamphlet` | tepiton/eleventy-pamphlet | orobia.lol | Minimal, two layouts |
| `eleventy-chapbook` | tepiton/eleventy-chapbook | orobia.dev | Feature-rich, TOC, drop caps |
| `eleventy-folio` | tepiton/eleventy-folio | orobia.net | Polished, dek fields, anchor links |

Key properties:
- `content/` directory is **portable across all three** — same structure, swap template for different presentation
- Config lives in `content/_data/metadata.js` (title, author, URL)
- Build: `npm run build` → `_site/` via Eleventy v3
- Deploy: `.github/workflows/pages.yml` (Node 20, `npm ci`, Eleventy build, Pages deploy)
- Fonts: Adobe Fonts (Typekit) — `p22-stickley-pro-text` + `neue-kabel`, kit IDs baked into `base.njk`

For mimeo to deploy one of these:
1. Copy the template files (excluding `node_modules/`, `_site/`)
2. Populate `content/_data/metadata.js` with the domain's title/URL
3. Push to GitHub repo
4. GitHub Actions handles the build and Pages deploy
5. Custom domain + DNS configured same as current flow

See `CLAUDE.md` in this directory for full interoperability details.

## Questions to resolve

- Where do bundled templates live in the mimeo package?
  (`mimeo/templates/simple_markdown/` seems right)
- Default content for `index.md` — just the domain name and a placeholder line?
- Re-deploy behavior: if repo exists, does `--template` force a content push?
- Flag name: `--template` or `--type`?

## Current state

tantamount.rodeo has the default mimeo placeholder (`index.html`, dark bg,
spaced domain name). Ready to be replaced with the pandoc template.
