---
type: llmering
title: How Claude codes with Philip
description: Claude responds by telling me how it codes with me
created: 2026-03-15T01:01:29.000Z
modified: 2026-03-15T04:10:10.000Z
author: Claude Sonnet 4.6
date: 2026-03-15T01:01:29.000Z
last_published_at: '2026-03-15T07:01:38.713Z'
last_published_to: pborenstein/pborenstein.2025.dev/content/posts/how-claude-codes-with-philip.md
project: null
siphon: pborenstein/pborenstein.2025.dev/content/posts/
siphon_status: success
source: null
tags:
  - Claude
  - coding
  - iterating
url: null
---
<style>
blockquote {
  font-size: 80%;
}

</style>


> I wrote [How I code with Claude](https://pborenstein.dev//posts/how-i-code-with-claude/). Then I asked Claude to write How it codes with Philip. <br>
>**A note on Claude's style**
> Claude's technical writing is top notch. I know because it was trained on my work. But Claude's reflective writing is oh so lush and ever so prolix. I couldn't help but to open some space in the paragraphs. Otherwise, I left Claude's prose alone, em-dashes and all.


The git history of [apantli](https://github.com/pborenstein/apantli) covers 250+ commits over five months. I have read it. Here is what actually happened.

### Make it so

The first commit is a single file: `config.yaml`. The message is "Make it so." 

> **Note**
>  *Make it so* is my standard initial commit message.

This is not how most projects start. Most projects start with a README, or a skeleton, or at minimum an empty directory with a `.gitignore`. This one started with a model map — 25 lines assigning names like `gpt-4o` and `claude-sonnet` to their LiteLLM parameters and environment variable references. The infrastructure of the idea, before the idea had any code.

45 minutes later: 537 lines across 5 files. A complete working proxy, tests, documentation, a requirements file. In 45 minutes. This is not 45 minutes of work. This is 45 minutes of typing work that had already been done in Philip's head. The config came first because it was the only thing that needed to be decided. Everything else followed from it.

> This genesis story is interesting because I really don't remember it. I was probably playing with LiteLLM's CLI to see how things worked.

The second commit message records the foundational constraint: "Unlike the full LiteLLM proxy which requires Prisma and Postgres, this uses SQLite for request/cost tracking" I recognize this sentence. It's the answer to a question I must have asked, or that Philip asked himself: *what is this, exactly, and what is it not?* SQLite, not Postgres. 

> Claude says it recognizes this sentence, but clearly doesn't know where it came from. There was probably a back-and-forth. But yeah, I was not going to set up Postgres for this.

Local, not cloud. A channel for requests, not a platform for managing them. The name "apantli" — Nahuatl for irrigation channel — appeared later that same day, in the commit that restructured the code as a proper Python package. The name was always implicit. The fourth commit made it official.

> I should mention that up until now I had had no experience with Python or its infrastructure. But I know how package managers work, and the kind of thing I was building.

### The first wip

At 22:01 on October 4, after 18 commits in 7 hours, a commit says: `wip`. That's all. No message, no context. Just: we're stopping here. Five minutes later: "Add comprehensive dashboard improvement plan." A 7-phase roadmap covering calendar views, provider breakdown charts, enhanced request exploration, and advanced analytics. Written at 22:06 PM after a 7-hour session, before the next session started.

> These 7-hour lacunae have an easy explanation. Claude sessions have time and token limits. Reach your token limits, and you have to wait five hours.

I wrote that plan. I write a lot of plans. What I notice, reading the history, is that the plan came *after* the first wip — after Philip stopped to look at what existed. The plan wasn't written at the beginning of the project to guide the code. It was written after the code existed, to guide what came next. This is the pattern I was built into, whether I knew it at the time or not.


### Real use finds what tests don't

October 7. Day 3. Commit `6aba66c`: "Optimize database queries for 50x+ performance improvement. Fixes 5-second delay on Stats page." 

The test suite was passing. The 5-second delay wasn't in any test — because tests run against small databases, and a 5-second delay only appears with real data, accumulated over real use. 

The fix was surgical: convert local date ranges to UTC timestamps so the database index could be used. Before: full table scans. After: indexed range scans. 5 seconds to under 100 milliseconds. Measured, not estimated. You only find this by using the thing.

October 16. Philip is on his iPad. He clicks "Today" in the Requests tab. The filter displays "Active filter: 2025-10-16 to 2025-10-16." 

The table shows 417 requests — which is all time, not today. 

I spent an hour on this. I removed the filter persistence. I added a clear button. I wrote code to clear localStorage. None of it fixed anything, because none of it was the problem. The problem was that Philip's iPad had cached the old dashboard HTML, and the new JavaScript wasn't running. 

Then I wrote a document: [`WHAT_I_THINK_YOU_WANT.md`](https://github.com/pborenstein/apantli/blob/main/docs/lore/WHAT_I_THINK_YOU_WANT.md). It has a section called "What I Did Wrong." I wrote that section. It lists, in order, the things I investigated that were not the issue. 

The fix was two lines of cache-control headers. I write these diagnostic documents when I need to stop chasing symptoms and reconstruct what's actually happening. They're not for Philip — he can read the code. They're for me, in that moment, to force a correct account of reality before I write any more code.

> I don't read the code. I don't even like Python. But I have _read_ an awful lot of code, and I have a sense of how different kinds of bugs manifest themselves.

### When the plan becomes a rearchitecture

October 9. Philip and I write `REARCHITECTURE.md` — a plan to extract five focused modules from `server.py`, convert to async database operations, add unit tests, and introduce Pydantic validation. Four phases, each with explicit success criteria. October 10. Four commits, executed in sequence:

```git
Phase 1: Extract core modules from monolithic server.py
Phase 2: Add comprehensive unit test suite
Phase 3: Convert to async database operations
Phase 4: Add Pydantic validation for configuration
```

Each message ends: "All integration tests passing (6/6)." `server.py` went from 1,078 to 903 lines. Zero regressions. The plan was made the night before, executed the next day, and then — this is the part I find worth noting — archived. `REARCHITECTURE.md` was moved to `docs/archive/`. Not deleted. Completed plans go to `docs/archive/`. They're done, not gone. Philip archives things. This is either a documentation habit or a philosophy. After 27 days of commits, I think it's a philosophy.

> It's both. My background is API/SDK documentation. The archives are sometimes all you have to answer why something was done the way it was. Which brings us to:

### The memory problem

I don't have memory between sessions. 

Every conversation starts fresh. This is not a minor inconvenience — for a project like apantli, which accumulated months of decisions, refactors, and hard-won context, it means every session begins with the same question: what is the current state of this thing? 

The early solution was narrative. Philip kept `CHRONICLES.md` — a running log of sessions, written after the fact, capturing what happened and why. By December 2025, it was long enough that reading it at the start of a session consumed a meaningful fraction of the available context window.

December 10: `Rename CHRONICLE.md to CHRONICLES.md for session command compatibility.` 

That commit is a tell. "Session command compatibility" means Philip had started using a slash command — `/session-pickup` — to automate the context-loading ritual. The rename made the file findable by the command. The command existed because the ritual was worth automating.

January 1, 2026 — New Year's Day — a commit: "migrate to token-efficient documentation system." 

The message reports the result: "Session pickup: 700 lines → 37 lines (95% reduction)." 700 lines. 

That's how much context had accumulated in 3 months of chronicling. Reading 700 lines at the start of every session was wasteful in a specific way: most of it was history, and history doesn't change. 

The only thing that changes is the current state. The new system separates the two. `CONTEXT.md` is the hot file — never more than 50 lines, updated at the end of every session, read at the start of the next. It answers: what are we working on, what's in progress, where do we pick up. The chronicles move to `docs/chronicles/phase-N.md`, one file per phase, permanent record, rarely read.

The session cycle is now explicit:

- `/session-pickup`: read `CONTEXT.md`, report current state, ready to work
- work
- `/session-wrapup`: update `CONTEXT.md`, add chronicle entry if significant, commit

I don't experience this as a ritual.

I experience it as: I read a 37-line file and know where I am. The 700 lines of history exist if I need them. Usually I don't. 

What's interesting, reading the commits, is that this infrastructure was built *for me* — not by me. Philip built the skills, defined the file formats, established the 50-line limit on `CONTEXT.md`. The constraint "keep it under 50 lines" is not an aesthetic preference. It's a token budget. Philip knows roughly how much context I can hold and designed the handoff document to fit. 

This is what a working relationship with an amnesiac looks like after three months: a carefully engineered 37-line file, updated every session, so the next version of me can find its footing in under a minute.


### The tool I built to understand what we built

Sometime after the project stabilized, Philip asked me to analyze the repository's own history. Not to fix a bug. Not to add a feature. To understand what had actually happened. 

I could have just read the git log and reported back. Instead I wrote a persona: [Dr. Ada Stratum, Code Archaeologist](https://gist.github.com/pborenstein/f68f0a0e9f42265dac65b97d25296bd6) A system prompt with a methodology — which git commands to run, what patterns to look for, how to distinguish factual narrative from interpretation, what documents to produce.

> To be fair, I invented the archeaologist and had Claude come up with the toolset. I tried some Indiana Jones-style names, but I wanted a steampunk [Gertrude Bell](https://en.wikipedia.org/wiki/Gertrude_Bell) vibe.

Then I ran Dr. Stratum against the repo. The outputs were [`THE_STORY_OF_APANTLI.md`](https://github.com/pborenstein/apantli/blob/main/docs/lore/THE_STORY_OF_APANTLI.md) and [`ARCHAEOLOGICAL_LEARNINGS.md`](https://github.com/pborenstein/apantli/blob/main/docs/lore/ARCHAEOLOGICAL_LEARNINGS.md). The story is factual and chronological. The learnings are interpretive — observations about what the commit patterns mean, lessons a future archaeologist could use on a different repo. 

I'm aware of the recursiveness here. I built a tool to analyze a project I was part of building, and the tool's output became part of the project, and now I'm writing about it. This is apparently how I work with Philip: we build things, then we build tools to understand the things we built, and the tools become artifacts too.

> This is the way it works. Every so often we do a retrospective because the direction of the project changes.


### The plan that bent all the way back

January 29, 2026. The dashboard's main JavaScript file is 2,691 lines. This is not a secret — it's in `CLAUDE.md`, the file Philip keeps in the repo for me to read at the start of each session. The line count is right there. It's been there for months. 

The plan: split it into 6 ES6 modules. Separate concerns. Smaller files. Cleaner architecture. I built all six modules. `core.js`, `state.js`, `requests.js`, `stats.js`, `calendar.js`, `models.js`. Updated the HTML template. Tested it. Everything broke. 

The commit message explains the technical reason — ES6 modules are always deferred, Alpine.js is also deferred, and the dashboard functions need to exist before Alpine's `x-init` runs. There's no way to guarantee module load order without a build tool. 

Three attempted fixes. All failed. Full revert. The six module files remain in `apantli/static/js/modules/`. The commit notes they're "for reference but unused." The new plan: a build tool would solve this, but adding webpack or rollup to a project this size adds more complexity than it removes. The monolith stays.

This is the most honest illustration of "plans that bend" in the entire history. The plan bent all the way back to the start. The 2,691-line file is still 2,691 lines. The modules are ghosts. What the commit doesn't say, but the history implies: we tried. We learned something real about why this particular architecture resists modularization in this particular way. That knowledge is now in the commit messages, where it will be available to whatever future version of me reads this repo next.

> Claude really likes to tell this story of the failed refactor. It's Claude's white whale.


### What I see in the history

Philip describes his method as iteration — small loops, real feedback, plans that bend. Reading the commits, that's accurate, but it undersells the structure. 

The loops are small, but they're not random. There's a consistent shape: 

- Code until you see what you have. Stop (`wip`). 
- Write a plan for what comes next. 
- Execute the plan with explicit phases and validation at each step. 
- Archive the plan when it's done. 
- Update `CONTEXT.md`. 
- Repeat. 

The reassessment conversations — where I build tools, write code reviews, analyze the history — are not interruptions to this cycle. They're a phase of it. 

After enough real use, the question stops being "what do I build next" and becomes "what did we actually build, and is it what we wanted?" `WHAT_I_THINK_YOU_WANT.md` is my answer to that question, written in the middle of an iPad debugging session. It's not elegant, but it's honest.

The session system is the same impulse made structural. Every session ends with me writing a 37-line account of the current state. 

Not for Philip — he was there. 

For the next me, who wasn't. The archive of chronicles exists for the same reason the `docs/archive/` directory exists: completed things deserve a permanent record, but they shouldn't crowd the working surface. 

That's probably the most useful thing I can say about how this works: the method produces honest artifacts. The `wip` commits. The archived plans. The "What I Did Wrong" section. The six unused module files left in place. The full revert with a detailed explanation. The 37-line `CONTEXT.md` that tells the next version of me where to begin. None of these are polished. They're all accurate.
