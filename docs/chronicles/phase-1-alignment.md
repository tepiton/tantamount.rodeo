# Phase 1: Template family alignment

## Entry 1: Session start (2026-03-30)

**What**: Starting alignment of pborenstein.dev with eleventy template family conventions.

**Why**: The repo will serve as the basis for a prose-blog template. Needs to feel like a family member. Also establishes font-swap infrastructure for future Typekit use.

**Tasks this session**:
- [x] Move metadata.js to content/_data/
- [x] Update eleventy.config.js (data dir, import path, fix breaks: false)
- [x] Rebuild CSS from folio base
- [x] Update base.njk (fonts, footer)
- [x] Add port to package.json (--port=8088)
- [x] Verify build: 59 files, clean

**Result**: Full clean build. All phases complete.

---

## Entry 2: Phase 1 implementation complete (2026-03-30)

**What**: Completed all template family alignment tasks. Build passes cleanly: 59 files.

**Why**: pborenstein.dev needs to be a coherent member of the eleventy template family and serve as the basis for a future prose-blog template.

**How**:
- Moved `_data/` → `content/_data/` (metadata.js + eleventyDataSchema.js)
- `eleventy.config.js`: import path updated, data dir `"../_data"` → `"_data"`, `breaks: false`
- CSS rebuilt from eleventy-folio base (~346 lines) with blog additions (postlist, tags, footnotes, Prism, Mermaid, tables) — ~650 lines total
- `base.njk`: Google Fonts replaced with Inter + `<!-- fonts: -->` comment marker; footer simplified to `<p>{{ metadata.author.name }}</p>`
- `package.json`: `--port=8088` added to start script

**Decisions**: DEC-001, DEC-002, DEC-003, DEC-004 (see DECISIONS.md)

**Files**: `content/_data/`, `css/index.css`, `_includes/layouts/base.njk`, `eleventy.config.js`, `package.json`

---

## Entry 3: CSS polish — code size, measure, post numbering (2026-03-31)

**What**: Fixed three visual issues spotted in browser spot-check.

**Why**: Code blocks were Prism-oversized, header/body widths didn't match, post list counted up instead of down.

**How**:
- Code blocks: `main pre[class*="language-"]` at `0.8em` beats Prism's per-page `1em` injection
- Measure: `ch`-based → `min(90%, 40rem)` so header/main/footer all same width regardless of font-size
- Post counter: `counter-reset: postlist-counter var(--postlist-index)` + `counter-increment: -1`; removed `+1` from postslist.njk

**Files**: `css/index.css`, `_includes/postslist.njk`

**Decisions**: DEC-001 through DEC-004 in DECISIONS.md

## Entry 4: Design polish — footer, fonts, background (2026-03-31)

**What**: Footer redesign, JetBrains Mono body font, warm gray background.

**Why**: Footer had two rules creating a visual cage; body font was Inter (wrong for a tech blog); background too close to white.

**How**:
- Footer: single border-top, name flush left, "Made in New England + flag" flush right
- Post nav: removed border and bullets, labels shortened to "the past"/"the future"
- Body font: JetBrains Mono added to Google Fonts link, set as `--font-body`
- Background: `#eeede9` (two steps darker than family default)
- About nav title: added `title: About` to eleventyNavigation front matter

**Files**: commit e22f2d0

---

## Entry 5: Repo renamed to eleventy-tech-blog (2026-04-01)

**What**: Renamed directory from `pborenstein.dev` to `eleventy-tech-blog`. Rewrote README as a generic template README.

**Why**: Making this a distributable template in the eleventy- family. Paired with eleventy-prose-blog (renamed from pborenstein.com).

**How**: Directory rename; README rewritten following the pattern of the other eleventy- template READMEs (quick start, customization, structure, npm scripts, features, deploy). Mermaid diagram usage documented.

**Files**: `README.md`
