---
title: tantamount.rodeo
---

A simple site, built with pandoc.

## Features

No Node.js, no npm, no build toolchain. Just markdown and a CSS file.

| Template | Tool | Deploy Time |
|----------|------|-------------|
| simple-markdown | pandoc | ~20s |
| eleventy-pamphlet | eleventy | ~45s |
| eleventy-chapbook | eleventy | ~45s |

## Code Example

```bash
pandoc index.md -o index.html --css style.css --standalone -f gfm
```

That's it. Push to main, GitHub Actions handles the rest.
