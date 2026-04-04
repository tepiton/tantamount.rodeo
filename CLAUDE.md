# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Philip Borenstein's development blog. It is based on his personal blog, which features:

- Static site generation with Nunjucks templating
- Blog posts with footnote support and syntax highlighting
- Theme switching (light/dark/system preference)
- RSS/Atom feeds with custom styling
- Image optimization and responsive images
- Tag-based organization

## Project Objectives

The primary objective is to make this a good developer blog. It should support Mermaid diagrams, syntax highlighting, and a clean, responsive design. The site should be easy to maintain and extend with new features.

## Essential Commands

```bash
# Development server with hot reload
npm start

# Build for production
npm run build

# Build without colors (useful for CI)
npm run build-nocolor

# Debug build with verbose logging
npm run debug

# Debug development server
npm run debugstart

# Performance benchmarking
npm run benchmark
```

## Architecture Overview

### Directory Structure
- **Input directory**: `content/` (configured in eleventy.config.js)
- **Output directory**: `_site/`
- **Templates**: `_includes/layouts/` (Nunjucks .njk files)
- **Data**: `_data/` (global data files)
- **Config**: `_config/` (filters and other configuration)
- **Assets**: `public/` (copied to root), `css/`, `js/`

### Key Configuration
- **Main config**: `eleventy.config.js` - ES modules, plugins, filters, and build settings
- **Site metadata**: `_data/metadata.js` - centralized site information, author details, feed config
- **Filters**: `_config/filters.js` - date formatting, array manipulation, tag filtering

### Template System
- **Base layout**: `_includes/layouts/base.njk` - main HTML structure with theme switcher
- **Content processing**: Uses Nunjucks with Markdown support
- **CSS bundling**: Inline CSS via Eleventy's bundle plugin (styles included in templates)

### Content Management
- **Posts**: `content/posts/` with front matter and Markdown
- **Pages**: `content/pages/` for static pages
- **Drafts**: Controlled by `draft: true` front matter (excluded in production builds)
- **Tags**: Automatic tag pages generated from post front matter

### Theme System
- **CSS variables**: All theme colors defined in `css/index.css` with light/dark variants
- **Theme switching**: JavaScript in `js/theme-switcher.js` with localStorage persistence
- **System preference**: Respects `prefers-color-scheme` media query
- **User override**: Manual theme selection via dropdown in header

### Markdown Enhancements
- **Footnotes**: Custom footnote rendering with two-column layout (single column on mobile)
- **Typography**: Typographer and line breaks enabled
- **Syntax highlighting**: PrismJS integration with custom theme
- **Content separation**: Custom `separateFootnotes` filter using JSDOM

### Build Pipeline
- **Image optimization**: Auto-generation of AVIF/WebP formats with lazy loading
- **Asset copying**: Public folder contents, JavaScript files, and XSL stylesheets
- **Watch targets**: CSS, JS, and image files for development hot reload
- **Bundle system**: CSS and JS bundling with per-page support

### Development Notes
- **Node requirement**: >=18 (specified in package.json)
- **Module system**: ES modules throughout (type: "module" in package.json)
- **Development server**: Shows all network interfaces for device testing
- **Font loading**: Adobe Typekit fonts (neue-kabel, p22-stickley-pro-text)

## Development Blog Conversion Plan

### Conversion Status
**Current Phase**: COMPLETE ✅
**Target**: Fully functional development blog with enhanced technical features

### Phase 1: Domain Migration ✅ COMPLETE
**Objective**: Update all pborenstein.com references to pborenstein.dev
**Completed**:
- Updated `_data/metadata.js` with new domain and metadata
- Updated all references throughout the site
- Verified build output uses correct domain

### Phase 2: Mermaid Integration ✅ COMPLETE  
**Objective**: Add diagram support for technical documentation
**Completed**:
- Installed `@mermaid-js/mermaid` and `@kevingimbel/eleventy-plugin-mermaid`
- Configured plugin in `eleventy.config.js`
- Added Mermaid initialization to base template
- Verified theme compatibility and diagram rendering

### Phase 3: Metadata Enhancement ✅ COMPLETE
**Objective**: Optimize site metadata for development audience
**Completed**:
- Updated site description: "I take things apart to understand how they work, then write about what I learned. Mostly Git, static sites, LLMs, and the occasional CSS hack."
- Updated tagline: "Taking things apart to see how they work."
- Enhanced social media meta tags with Twitter creator and keywords
- Added development-focused meta keywords

### Phase 4: Content Review ✅ COMPLETE
**Objective**: Ensure existing content is optimized for development blog
**Completed**:
- Added comprehensive development tags to all posts (git-advanced, static-sites, ai, automation, web-development, etc.)
- Renamed UUID-based filenames to descriptive names
- Removed draft URIs from published posts
- Fixed markdown line breaks in several files
- Verified code highlighting across all posts

### Phase 5: Testing & Verification ✅ COMPLETE
**Objective**: Ensure all changes work correctly
**Completed**:
- Build process verification: Clean build, 58 files generated
- Mermaid rendering: Working correctly in git workflow posts
- Domain reference validation: All using pborenstein.dev
- RSS/sitemap generation: Both working with new metadata
- Generated 38 tag pages for comprehensive tagging system

### Typography Improvements ✅ COMPLETE
**Additional Enhancement**: 
- Replaced Adobe Typekit fonts with Google Fonts
- Updated to Source Sans 3 for body text (lighter than Inter)
- JetBrains Mono for code blocks
- Fixed Prism.js styling with proper line-height and font sizing
- Added documentation links for future Prism customization

## Recent Improvements ✅ COMPLETE

### Design and Typography Enhancement (August 2025)
**Objective**: Transform the design from basic styling to a polished, professional developer blog
**Completed**:
- **Typography Hierarchy**: Enhanced heading weights and sizing with clear visual hierarchy using monospace fonts
- **Blockquote Redesign**: Replaced italic-only styling with subtle border-left and background treatment
- **Dark Mode Improvements**: Implemented sophisticated color scheme with proper contrast and blue link colors
- **Tag Contrast Fix**: Resolved CSS specificity issues causing poor readability in dark mode
- **Spacing and Layout**: Improved overall typography, line height, margins, and responsive design
- **Mobile Optimization**: Enhanced responsive behavior for better mobile experience

### UI Polish and Content Structure (August 2025) ✅ COMPLETE
**Objective**: Polish remaining design issues and improve content presentation
**Completed**:
- **Details/Summary Styling**: Added professional styling with borders, hover states, and proper spacing
- **List Typography**: Attempted bullet hanging indentation (reverted to simple approach after complications)
- **Dark Mode Font Weight**: Reduced body font weight from 400 to 300 for better readability
- **Content Restructuring**: Moved Quick Reference Table to top of Claude ecosystem analysis post
- **CSS Cleanup**: Maintained clean, working list styles without complex text-indent manipulations

**Technical Notes**:
- Hanging bullet indentation proved challenging with current CSS approach - kept simple `padding-left` solution
- Details elements now have consistent styling across light/dark themes with `margin: 2em 0` spacing
- Dark mode uses sophisticated blue link colors (#66b3ff) instead of problematic red scheme
