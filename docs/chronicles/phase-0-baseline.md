# Phase 0: Pre-alignment baseline

## Entry 1: Initial state (2026-03-30)

**What**: Fully functional dev blog on Eleventy 3.x, converted from pborenstein.com personal blog.

**Why**: Philip wanted a separate dev-focused blog at pborenstein.dev covering Git, static sites, LLMs, and web development.

**How**:
- Eleventy 3.x with ES modules throughout
- Content in `content/posts/` and `content/pages/`
- Metadata at root `_data/metadata.js` (not template-family-aligned)
- CSS: 1300-line standalone file with own variable conventions
- Fonts: Google Fonts (Source Sans 3, JetBrains Mono)
- Plugins: syntax highlighting, mermaid, RSS, image optimization, footnotes, heading anchors
- Theme switching: light/dark/system with localStorage persistence
- Footnote popovers: CSS-first with JS progressive enhancement
- 14 posts, 2 pages, 38 tag pages

**Files**: See commit e3b8900
