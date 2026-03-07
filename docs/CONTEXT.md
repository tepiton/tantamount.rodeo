---
phase: 0
phase_name: Pandoc Template Sandbox
updated: 2026-03-06
last_commit: 6b49dfa
last_entry: 1
---

## Current Focus

Proving out the `simple-markdown` pandoc template type for mimeo. tantamount.rodeo is the sandbox site.

## Active Tasks

- [ ] Replace current index.html placeholder with pandoc-based build
- [ ] Write style.css for the pandoc template
- [ ] Create .github/workflows/pages.yml (pandoc build + Pages deploy)
- [ ] Add .nojekyll
- [ ] Validate end-to-end: push -> pandoc -> Pages

## Blockers

None

## Context

- This site currently has a default mimeo placeholder (index.html, dark bg, spaced domain name)
- Build: `pandoc index.md -o index.html --css style.css --standalone`
- No Node.js, no npm, no SSG -- that's the whole point
- Three interoperable Eleventy templates also exist (pamphlet/chapbook/folio) -- separate effort
- Open questions: where do bundled templates live in mimeo package? flag name --template vs --type?

## Next Session

Replace the placeholder index.html with index.md + style.css + pages.yml workflow. Start with the workflow file.
