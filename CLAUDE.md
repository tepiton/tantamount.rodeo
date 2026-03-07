# Memory: eleventy-chapbook

## Project Overview

This is the `eleventy-chapbook` template repo (`github.com/tepiton/eleventy-chapbook`), an Eleventy v3 starter for chaptered literary sites. It is one of three interoperable templates:

- **eleventy-pamphlet** → served from `orobia.lol` (port 8086)
- **eleventy-chapbook** → served from `orobia.dev` (port 8082)
- **eleventy-folio** → served from `orobia.net` (port 8084)

All three live at `/Users/philip/projects/mimeo-sites/TEMPLATES/`.

## Content Portability

The `content/` directory is fully portable across all three templates. Drop a `content/` folder into any of the three repos and it renders correctly.

### Standardized content/ structure

```
content/
  _data/
    metadata.js           # title, author, description, url, etc.
  chapters/
    chapters.11tydata.js  # layout: layouts/chapter.njk
    *.md                  # order + title in frontmatter
  content.11tydata.js     # layout: layouts/base.njk (default)
  index.md
  about.md
  404.md
```

### Single-page vs multi-chapter

- **Multi-chapter**: Keep `content/chapters/` directory
- **Single-page**: Delete `content/chapters/` directory entirely

### Requirements for portability

All three templates must have:
1. `content/_data/metadata.js` (same path, same schema)
2. `_includes/layouts/base.njk` (default layout)
3. `_includes/layouts/chapter.njk` (chapter layout, extends base.njk)
4. `chapters` collection via `getFilteredByGlob("content/chapters/*.md")`
5. Chapter templates use `{{ order }}` (not `{{ chapterNumber }}`)

### Chapter sorting

Chapters are sorted by:
1. `order` property (ascending, fallback to 999 if missing)
2. Filename (alphabetical, for determinism when order is equal)

## Font Setup (all three templates)

All three use the same fonts from esther.lol, baked in directly:

- **Body**: `p22-stickley-pro-text, neue-kabel, Palatino, Georgia, serif`
- **Heading**: `neue-kabel, 'Gill Sans', 'Helvetica Neue', sans-serif`
- **Typekit kits**: `ztn6rcs` (p22-stickley-pro-text) and `pgn7ley` (neue-kabel), loaded as hardcoded `<link>` tags in `base.njk` (not via metadata)
- **Font size**: `clamp(1rem, .8rem + 1vw, 1.25rem)` on `html` — aligned across all three templates
- CSS vars: `--font-serif` and `--font-sans` in `:root`

## File Locations

| File | pamphlet | chapbook | folio |
|------|----------|----------|-------|
| CSS | `css/style.css` | `css/index.css` | `css/index.css` |
| Base layout | `_includes/layouts/base.njk` | `_includes/layouts/base.njk` | `_includes/layouts/base.njk` |
| Chapter layout | `_includes/layouts/chapter.njk` | `_includes/layouts/chapter.njk` | `_includes/layouts/chapter.njk` |
| Home layout | (uses base.njk) | `_includes/layouts/home.njk` | `_includes/layouts/home.njk` |

## Unique to Chapbook

- Has dedicated `home.njk` layout with chapter list TOC
- CSS uses `--font-serif` and `--font-sans` (not `--font-body`/`--font-heading`)
- Literary markdown features documented: drop caps, scene headings, character voice, section breaks

## npm Scripts

All three use `npm start` to serve.

## Key Patterns

- Typekit kit IDs are baked into `base.njk`, not in `metadata.js`
- `metadata.js` does NOT have a `typekit` field
- Chronicles are kept in `docs/CHRONICLE.md` in each repo
- Interoperability plan in `docs/INTEROPERABILITY.md`
- Commit messages must use plain hyphens — em dashes break heredoc syntax in bash

## Git Notes

- eleventy-folio remote frequently has commits ahead of local (user pushes independently) — always `git pull --rebase` before pushing if rejected
- em dashes in `git commit -m` heredocs cause syntax errors; use plain hyphens

## Related Sites

- `esther.lol` is the font/style reference (`/Users/philip/projects/mimeo-sites/esther.lol`)
