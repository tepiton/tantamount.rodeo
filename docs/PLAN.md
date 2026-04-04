# Plan: Align pborenstein.dev with eleventy template family conventions

## Context

pborenstein.dev is a dev blog built on Eleventy. The template family (eleventy-chapbook, eleventy-folio, eleventy-pamphlet) has established conventions for directory structure, config patterns, font loading, CSS architecture, and data organization. The goal is to align pborenstein.dev with those conventions so it feels like a coherent member of the family — and so it can serve as the basis for a future prose-blog template using Typekit fonts.

Key decisions:
- **Post ordering**: Keep reverse-chrono for now (not in scope)
- **Fonts**: Inter (Google Fonts) now, but font loading must be structured to make Typekit swap easy
- **Metadata location**: Move `_data/metadata.js` → `content/_data/metadata.js`
- **CSS**: Rebuild from folio's CSS as base, layer blog-specific additions on top
- **Structure**: Preserve blog-specific features (footnotes, mermaid, syntax highlighting, RSS, tags)

---

## Phase 1: Metadata migration

**Move** `_data/metadata.js` → `content/_data/metadata.js`

This is the single most important structural change. Content becomes self-contained and portable, matching all three existing templates.

- Delete `_data/` at root (or leave empty if other files exist there)
- Update `eleventy.config.js` data dir reference: `data: "../_data"` → `data: "_data"` (relative to input)
- Remove explicit `import metadata` in `eleventy.config.js` (Eleventy finds it automatically)

Critical file: `_data/metadata.js`

---

## Phase 2: Font system refactor

**Goal**: Inter now, Typekit-ready always.

Pattern from the templates: fonts are loaded in `base.njk` only (never in metadata or CSS files), as `<link>` tags. CSS uses variables only: `--font-body`, `--font-heading`, `--font-mono`.

### Changes to `_includes/layouts/base.njk`:
Replace the current Google Fonts `<link>` tags with a comment block marking where fonts load, then the Inter link:
```html
<!-- fonts: swap these links to change font family -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap">
```

### Changes to `css/index.css`:
Replace all hardcoded font family strings with three variables:
```css
:root {
  --font-body: Inter, system-ui, sans-serif;
  --font-heading: Inter, system-ui, sans-serif;
  --font-mono: ui-monospace, 'JetBrains Mono', monospace;
}
```

To swap to Typekit later: change the two `<link>` tags + update the three CSS variables.

---

## Phase 3: CSS rebuild from folio base

**Approach**: Take folio's `css/index.css` as the foundation. It has the template family's established typography, theme system, and variable conventions. Layer blog-specific CSS on top.

### Additions over folio base:
- Font variables updated for Inter (not Typekit)
- Tag styles (`.post-tag`, `.post-metadata`)
- Post list styles (`.postlist`, `.postlist-item`, etc. with reversed counter)
- Footnote popover styles (the complex popover positioning system)
- Syntax highlighting (Prism + diff)
- Mermaid diagram styles
- Details/summary element styles
- Table styles with striped rows
- Mobile media queries

### What folio already provides (keep as-is):
- CSS custom properties (light/dark theme variables)
- `@media prefers-color-scheme` + `html[data-force-theme]` pattern
- Typography scale with `clamp()`
- Navigation styles (`.nav`, `.nav-item`, `.home-link`)
- Theme switcher button
- Skip link / `.visually-hidden` class
- Blockquote treatment
- Prev/next navigation (`.links-nextprev`)
- Basic `img`, `a`, `body` styles

Critical files:
- `/Users/philip/projects/mimeo-sites/TEMPLATES/eleventy-folio/css/index.css` (source)
- `/Users/philip/projects/mimeo-sites/TEMPLATES/pborenstein.dev/css/index.css` (current)

---

## Phase 4: eleventy.config.js cleanup

Align the config with template conventions while preserving blog-specific plugins.

### Changes:
1. Remove explicit `import metadata` (Eleventy finds it automatically after Phase 1)
2. Update `data` dir in config export: `"../_data"` → `"_data"`
3. Fix markdown-it: `breaks: true` → `breaks: false` (template convention)
4. Remove `_data/eleventyDataSchema.js` comment reference — it stays but Eleventy auto-discovers it

Blog-specific plugins to keep (unchanged):
- `@11ty/eleventy-plugin-syntaxhighlight`
- `@kevingimbel/eleventy-plugin-mermaid`
- `@11ty/eleventy-plugin-rss`
- Image plugin
- Footnote separation filter
- ID attribute / heading anchors

Critical file: `eleventy.config.js`

---

## Phase 5: package.json alignment

Minor changes to match template conventions:

1. Add dev port: `--port=8088` to `start` script
2. Scripts `build-nocolor`, `debugstart`, `benchmark` are already present — confirm only

Critical file: `package.json`

---

## Phase 6: Layout cleanup (`base.njk`)

1. Font loading: replace Google Fonts links with comment-marked Inter links (per Phase 2)
2. Footer: simplify to match template pattern (just author name, no "Made in New England" etc.)
3. Skip link: already uses `.visually-hidden` — no change needed

---

## Not in scope

- Post ordering (keeping reverse-chrono)
- Content changes
- New features
- Footnote JS logic
- Theme switcher JS

---

## Verification

1. `npm start` — dev server builds without errors
2. All posts render with syntax highlighting
3. Mermaid diagrams render (check a git post)
4. RSS feed at `/feed/feed.xml`
5. Dark mode toggle works
6. Fonts load (Inter only)
7. `npm run build` — clean production build
8. Footnotes work on a post that has them
