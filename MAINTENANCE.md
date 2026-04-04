# Site Maintenance Guide

This document outlines how to maintain both `pborenstein.dev` and `pborenstein.com` sites, ensuring that improvements benefit both projects.

## Overview

Both sites share similar architecture based on Eleventy with the following common features:
- Static site generation with Nunjucks templating
- Footnote support with popup interactions
- Theme switching (light/dark/system preference)
- Syntax highlighting with PrismJS
- Responsive design

## Shared Components

### Footnote System
Both sites use an enhanced footnote system with popup interactions:

**Files to keep synchronized:**
- `js/footnote-interactions.js` - Complete JavaScript interaction system
- CSS footnote styles in `css/index.css`:
  - `.footnote-popover` and related popover styles
  - Mobile responsive behavior (`@media (max-width: 640px)`)
  - Dark theme adjustments
- `eleventy.config.js` - `separateFootnotes` filter implementation
- Post template footnote handling in `_includes/layouts/post.njk`

**Key implementation details:**
- The `separateFootnotes` filter adds `data-footnote-content` and `data-footnote-id` attributes
- JavaScript creates interactive popovers with accessibility support
- CSS provides smooth transitions and responsive positioning
- Traditional footnotes remain as fallback (hidden by default)

### Theme System
Both sites use CSS custom properties for theming:

**Files to keep synchronized:**
- CSS theme variables in `css/index.css` (light/dark color definitions)
- `js/theme-switcher.js` - Theme toggle functionality
- Theme-related HTML structures in `_includes/layouts/base.njk`

### Typography and Fonts
- Google Fonts integration (Source Sans 3, JetBrains Mono)
- PrismJS styling customizations
- Responsive typography with clamp() functions

## Maintenance Workflow

### When Updating Footnotes
1. **Test changes on both sites** - Footnote behavior should be identical
2. **Update these files in sync:**
   - `js/footnote-interactions.js`
   - Footnote CSS styles in `css/index.css`
   - `separateFootnotes` filter in `eleventy.config.js`
   - Post template in `_includes/layouts/post.njk`

### When Updating Styles
1. **CSS Variables** - Ensure color variables remain consistent between sites
2. **Responsive behavior** - Test mobile/desktop layouts on both sites
3. **Dark theme** - Verify all components work in both light and dark themes

### When Adding New Features
1. **Plan for both sites** - Consider if the feature should be shared
2. **Document differences** - Note any site-specific customizations
3. **Update this guide** - Add new shared components to the documentation

## Site-Specific Differences

### Domain and Metadata
- `pborenstein.dev` - Development blog with technical focus
- `pborenstein.com` - Personal blog with broader content
- Each has unique metadata in `_data/metadata.js`

### Content Structure
- Both use similar Eleventy configuration but may have different content organization
- Tag systems may vary between sites

## Testing Checklist

When making shared changes, verify:
- [ ] Footnote popups work on both sites
- [ ] Theme switching functions correctly
- [ ] Mobile responsive behavior is consistent
- [ ] Build process completes without errors
- [ ] All links and navigation work properly

## Git Workflow

### Branch Naming Convention
When working on shared features, use descriptive branch names:
- `feature/footnote-enhancements` - For footnote system improvements
- `fix/theme-contrast` - For theme-related fixes
- `shared/responsive-updates` - For responsive design changes

### Commit Messages
Include both sites when committing shared changes:
```bash
git commit -m "Add popup footnotes to both pborenstein.dev and pborenstein.com

- Enhanced separateFootnotes filter with data attributes
- Added footnote-interactions.js for popup behavior
- Implemented responsive CSS with mobile support
- Added accessibility features and screen reader support"
```

## Deployment Notes

- Each site builds independently
- Shared components should be tested on both sites before deployment
- Consider staging deployments for major changes

## Future Improvements

Consider these potential shared enhancements:
- Unified build scripts for both sites
- Shared component library for common elements
- Automated testing for cross-site consistency
- Performance optimizations that benefit both sites

---

*Last updated: July 2025*
*This document should be updated whenever shared components are modified.*