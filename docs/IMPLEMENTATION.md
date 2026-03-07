# Implementation

## Phase Overview

| # | Name | Status | Commits |
|---|------|--------|---------|
| 0 | Pandoc Template Sandbox | 🔵 Current | 73601f9-HEAD |

## Current Phase: Pandoc Template Sandbox

**Goal**: Prove out a pandoc-based single-page site that mimeo can generate and deploy, with no Node.js or SSG toolchain required.

### Phase 0a: Repo Setup

- [x] Initial commit from Mimeo (placeholder index.html)
- [x] PLAN.md documenting goals and structure
- [x] CLAUDE.md with project context

### Phase 0b: Pandoc Template Implementation

- [ ] Create `index.md` with placeholder content
- [ ] Create `style.css`
- [ ] Create `.github/workflows/pages.yml` (pandoc build + GitHub Pages deploy)
- [ ] Add `.nojekyll`
- [ ] Remove old placeholder `index.html`
- [ ] Verify Pages deploys correctly

### Phase 0c: Mimeo Integration Design

- [ ] Decide: where do bundled templates live in mimeo package? (`mimeo/templates/simple_markdown/`?)
- [ ] Decide: flag name `--template` or `--type`?
- [ ] Document mimeo `create` flow changes for simple-markdown
- [ ] Decide: re-deploy behavior when repo exists + `--template` specified
- [ ] Prototype `mimeo create tantamount.rodeo --template simple-markdown`

### Notes

- Build command: `pandoc index.md -o index.html --css style.css --standalone`
- Deploy source: GitHub Actions (not branch)
- No npm, no Node version matrix -- fast and simple
- See PLAN.md for full context on mimeo integration requirements
