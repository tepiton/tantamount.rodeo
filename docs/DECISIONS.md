# Decisions

Architectural decisions for pborenstein.dev.

---

### DEC-001: Inter for fonts, not Typekit (2026-03-30)

**Status**: Active

**Context**: The eleventy template family (chapbook, folio, pamphlet) uses Adobe Typekit fonts (p22-stickley-pro-text, neue-kabel). The dev blog had been using Google Fonts (Source Sans 3, JetBrains Mono). Both are wrong for what we want.

**Decision**: Use Inter from Google Fonts now. Structure font loading (two `<link>` tags in `base.njk`, three CSS variables in `index.css`) so swapping to Typekit is a minimal change.

**Why**: This repo will serve as the basis for a future prose-blog template. That template will want Typekit. Inter is appropriate for a dev blog aesthetic. Making the swap easy is the priority.

**How to apply**: Fonts live only in `base.njk` as `<link>` tags under a `<!-- fonts: -->` comment. CSS uses only `--font-body`, `--font-heading`, `--font-mono` variables — never hardcoded font names.

---

### DEC-002: CSS rebuilt from folio base (2026-03-30)

**Status**: Active

**Context**: The existing CSS was a 1300-line standalone file with its own variable conventions that didn't match the template family. The folio template CSS is the most polished in the family.

**Decision**: Take folio's `css/index.css` as the starting point. Preserve all folio patterns (color variables, typography scale, theme switching, nav). Add blog-specific sections on top (postlist, tags, footnote popovers, Prism, Mermaid, tables).

**Why**: The template family has established conventions for color variable naming (`--color-bg`, `--color-text`, etc.) and theme switching that are cleaner than what the blog had. Starting from folio ensures alignment without rewriting everything from scratch.

**How to apply**: The color variables, `@media prefers-color-scheme`, and `html[data-force-theme]` pattern all come from folio. Blog additions are appended as clearly labeled sections.

---

### DEC-003: Metadata moved to content/_data/ (2026-03-30)

**Status**: Active

**Context**: The eleventy template family stores `metadata.js` at `content/_data/metadata.js`, making the content directory self-contained and portable across templates. The dev blog had it at the root `_data/`.

**Decision**: Move to `content/_data/metadata.js`.

**Why**: Content portability. The content directory should be droppable into any template in the family. Also matches all three existing templates exactly.

**How to apply**: Update `eleventy.config.js` config export to use `data: "_data"` (relative to `content/` input dir). Remove the explicit `import metadata` from `eleventy.config.js` — Eleventy auto-discovers it.

---

### DEC-004: Post ordering stays reverse-chrono (2026-03-30)

**Status**: Active

**Context**: The template family uses explicit `order` front matter (like chapter numbers) rather than date-based ordering. The blog owner dislikes pure reverse-chrono but the fix is not yet decided.

**Decision**: Keep reverse-chrono for now. Revisit when there's a clear direction.

**Why**: The right alternative (explicit order, oldest-first, curated) needs more thought. Don't change what works until there's a better answer.

**How to apply**: No action. Default Eleventy date-based collection sort stands.
