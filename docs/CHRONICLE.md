# Chronicle

Session log for tantamount.rodeo pandoc template sandbox.

---

## Entry 2: 2026-03-07

**Commit**: 5693da9

**Done**:
- Replaced static placeholder with pandoc build
- Created `index.md`, `style.css`, `.github/workflows/pages.yml`, `.nojekyll`
- Removed `index.html`, `.github/workflows/static.yml`
- Verified build + deploy: ~20s total

**Learned**:
- Pandoc workflow works cleanly with GitHub Actions
- Style borrowed from eleventy-pamphlet works well
- Fast iteration: push -> build -> deploy in seconds

**Next**: Phase 0c - mimeo integration design

---

## Entry 1: 2026-03-06

**Commit**: 6b49dfa

**Done**:
- Initial repo setup from mimeo placeholder
- Created PLAN.md, CLAUDE.md, docs/ (CONTEXT.md, IMPLEMENTATION.md, DECISIONS.md)

**Context**:
- tantamount.rodeo is sandbox for simple-markdown template type
- Goal: pandoc-based single-page site with no Node.js/SSG

**Next**: Phase 0b - implement pandoc template
