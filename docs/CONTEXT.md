---
phase: 0
phase_name: Pandoc Template Sandbox
updated: 2026-03-07
last_commit: 5693da9
last_entry: 2
---

## Current Focus

Phase 0b complete. Pandoc template proven out - build + deploy in ~20s. Next: Phase 0c (mimeo integration design).

## Active Tasks

Phase 0b complete:
- [x] Replace current index.html placeholder with pandoc-based build
- [x] Write style.css for the pandoc template
- [x] Create .github/workflows/pages.yml (pandoc build + Pages deploy)
- [x] Add .nojekyll
- [x] Validate end-to-end: push -> pandoc -> Pages

Phase 0c pending:
- [ ] Decide: where do bundled templates live in mimeo package?
- [ ] Decide: flag name `--template` or `--type`?
- [ ] Document mimeo `create` flow changes for simple-markdown
- [ ] Prototype `mimeo create <domain> --template simple-markdown`

## Blockers

None

## Context

- Pandoc build proven: `pandoc index.md -o index.html --css style.css --standalone`
- Deployed via GitHub Actions (apt-get install pandoc, build, upload artifact, deploy)
- No Node.js, no npm - build + deploy in ~20s total
- Style borrowed from eleventy-pamphlet template (fonts, colors, measure)
- Three interoperable Eleventy templates also exist (pamphlet/chapbook/folio) -- separate effort

## Next Session

Phase 0c: Design mimeo integration for simple-markdown template type.
