---
type: writering
title: How I code with Claude (annotated)
description: 'How I think I code with Claude, annotated by Claude'
created: 2026-03-15T00:27:39.000Z
modified: 2026-03-15T06:29:12.000Z
siphon: pborenstein/pborenstein.2025.dev/content/posts/
date: 2026-03-15T00:27:39.000Z
project: null
source: null
tags:
  - Claude
  - coding
  - annotated
url: null
siphon_status: pending
---

<style>
blockquote, details {
  font-size: 80%;
}

</style>



> I had Claude annotate my original [How I code with Claude](https://pborenstein.dev//posts/how-i-code-with-claude/) by citing from the [apantli](https://github.com/pborenstein/apantli/) history.

I start by telling Claude what I want and ask it to make a plan. We iterate over the plan, refine it, and rework it into a new plan. We do this two or three times before we start code.

<details>
<summary>The plan before the repo</summary>

The first commit in apantli is `fbe7b56`, message: "Make it so." One file: `config.yaml`. 25 lines mapping model names to LiteLLM parameters. No server, no tests, no README. The plan existed before the repo did.

45 minutes later, `326265b` drops 537 lines across 5 files: a working proxy, tests, documentation, requirements. The iteration happened before the first commit. The commit message records the key scope decision:

> "Unlike the full LiteLLM proxy which requires Prisma and Postgres, this uses SQLite for request/cost tracking"

SQLite not Postgres. Local not cloud. That constraint, stated in the second commit message, shaped everything that followed.

At 22:01 on day one, a commit says only: `wip`. Five minutes later: "Add comprehensive dashboard improvement plan" — a 7-phase roadmap written before the next session started. Plan → code → wip → plan again. The loop is in the commit timestamps.
</details>

Once coding starts, we look at the results, reëvaluate the plan, iterate on that, and continue coding. This is the spirit of agile: small loops, real feedback, plans that bend.

<details>
<summary>Four phases in one evening</summary>

Six days of organic growth. Then October 10, one evening, four commits each labeled with a phase number:

```git
0516179  Phase 1: Extract core modules from monolithic server.py
9ca97ea  Phase 2: Add comprehensive unit test suite
e785496  Phase 3: Convert to async database operations
68bae8a  Phase 4: Add Pydantic validation for configuration
```

Each commit message ends: "All integration tests passing (6/6)."

The plan (`REARCHITECTURE.md`) was written the night before, executed in sequence, validated at each step, then archived. `server.py` went from 1,078 to 903 lines. Zero regressions. This is what "plans that bend" looks like when the bending is intentional.

</details>

We do this three or four times till we get an MVP.

<details>
<summary>Three shapes of the same thing</summary>

The codebase has a measurable arc:

| | Oct 4 | Oct 18 | Nov 1 |
|---|---|---|---|
| Python | 386 lines, one file | ~1,100 lines, 7 modules | 1,482 lines, 6 modules |
| Dashboard | inline HTML string | 3,344-line monolith | 6 JS modules, ~45KB |
| Tests | 61 lines | 59 test cases | 59 test cases |

Three passes. Each one a different shape of the same thing.

</details>

I use the MVP for a few days, iterating with Claude as real-world use exposes what I missed.

<details>
<summary>What actual use exposed</summary>

Three days of actual use exposed a 5-second delay on the Stats page. Commit `6aba66c`:

- Before: ~5s with DATE(timestamp, tz) forcing full table scans
- After: 100ms with indexed timestamp range scans

50x improvement. The fix was converting local date ranges to UTC timestamps for index-based filtering. The bug only appeared with real data. Tests passed fine on the empty development database.

### Three timestamp formats (Oct 31)

Running the tool for weeks left three incompatible datetime formats in the production database — artifacts of three different implementations made across the development arc. It took three commits:

```git
eb5a485  Fix timestamp format for JavaScript compatibility
d079b2f  Fix 'Invalid Date' in dashboard by removing blind 'Z' appending
0c07e4f  Fix timestamp parsing to handle all three database formats
```

The third commit explains why it took three:

> Database contains three timestamp formats from different implementations:
> 1. Old (datetime.utcnow): no timezone
> 2. Middle (datetime.now(UTC)): +00:00
> 3. Current (with .replace): Z

You can't find that in a test. You find it by using the thing.

### The iPad bug and WHAT_I_THINK_YOU_WANT.md

October 16. An iPad. The "Today" filter showed 417 requests — all time, not today. An hour of investigation followed: removing persistence, adding a clear button, clearing localStorage. None of it fixed anything.

Then came a document: `WHAT_I_THINK_YOU_WANT.md`. It included a section titled "What I Did Wrong." The actual bug was browser caching of old HTML. The fix was two lines of cache-control headers in the server.

The document exists because I needed to stop, reconstruct what was actually happening, and separate the real problem from the symptoms I'd been chasing.

</details>

After a week or so of that, I chat with Claude about the implementation vs the plan. Early assumptions that weren't borne out, new needs the MVP exposed, ideas for improvement.

<details>
<summary>Reassesment</summary>

After weeks of use, a reassessment conversation produced `CODE_REVIEW.md` — not a plan for new features, but an audit of what existed. It found:

- A bare `except` clause that would catch `KeyboardInterrupt`
- SQL injection risk in time filter clauses
- 4 redundant `import time` statements inside functions
- ~40 lines of duplicated date filter UI between two tabs

`REFACTORING_SUMMARY.md` records what was fixed immediately and what was deferred. Critical security issues: fixed. JavaScript modularization: deferred.

</details>

During this reassessment, Claude creates tools to analyze logs, test ideas, and to search for similar projects.

<details>
<summary>Dr. Ada Stratum, Code Archaeologist</summary>

During a reassessment conversation, I asked Claude to analyze the repo's own history. Rather than do it directly, Claude wrote a persona-prompt first: `Dr. Ada Stratum, Code Archaeologist` — a system prompt with a methodology. Which git commands to run. What patterns to look for. How to distinguish factual narrative from interpretation. What documents to produce when done.

Then it ran the tool against the repo and produced `THE_STORY_OF_APANTLI.md` and `ARCHAEOLOGICAL_LEARNINGS.md` — a factual chronicle and an interpretive account of 189 commits.

The tool didn't exist before the conversation. It was built for this specific need: understanding what had actually been built and how.

</details>

We make a plan. We bend the plan. We make a new plan.

<details>
<summary>The modularization that had to be reverted</summary>

January 29, 2026. The dashboard's main JavaScript file is 2,691 lines. Plan: split it into 6 ES6 modules. Claude built all six, updated the HTML, and shipped it. Everything broke.

The commit message explains why:

> "ES6 modules are always deferred (even without defer attribute).
> Alpine.js also uses defer, creating race condition.
> Dashboard functions must exist when Alpine x-init runs."

Three attempted fixes. All failed. Full revert. The monolith stayed. The six module files remain in `apantli/static/js/modules/`, marked "for reference but unused."

The new plan: a build tool like webpack would work, but "not justified for this project size — adds complexity without meaningful benefit."

This is what "plans that bend" looks like in git. Sometimes the plan bends all the way back to where it started.

</details>
