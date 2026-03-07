# Decisions

Architectural decisions for this project. Search with `grep -i "keyword" docs/DECISIONS.md`.

## Active Decisions

### DEC-001: Use pandoc as build tool for simple-markdown template (2026-03-06)

**Status**: Active

**Context**: Mimeo needs a template type that deploys with zero Node.js/SSG toolchain. Current templates (eleventy-pamphlet, chapbook, folio) require npm install and Eleventy.

**Decision**: Use pandoc + GitHub Actions as the full build pipeline. `pandoc index.md -o index.html --css style.css --standalone` with `apt-get install pandoc`.

**Alternatives considered**:

- Eleventy: Already proven, but requires Node and npm
- Pre-built static HTML: Simplest, but not author-friendly (no markdown)
- Hugo: Markdown-based, but heavier dependency than pandoc

**Consequences**: Faster deploys, simpler workflow, no npm. Content is a single index.md. Limited to single-page sites (no TOC, chapters, etc.).

---

## Superseded/Deprecated

(none yet)
