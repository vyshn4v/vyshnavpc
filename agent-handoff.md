# AI Agent Handoff Document

This document contains the context, progress, and next steps for the "Premium Light" UI redesign of the Vyshnav P C portfolio project.

## Current State of the Codebase
The application is a Node.js/Express app using Handlebars (`.hbs`) for templating and MongoDB for data storage. The CSS is vanilla, and the site relies on caching (so CSS cache busters like `?v=X` are required when updating stylesheets).

We are in the middle of a massive architectural UI shift. We are migrating away from a dark-themed, complex hacker aesthetic towards a clean, professional **"Premium Light"** layout.

### What has been completed:
1. **Landing Page:** (`landing-page.hbs`, `main.hbs`) Now uses the `.layout-container` (max-width 1200px) and a `.layout-grid` (70/30 split) with `.premium-card` components.
2. **Components Fixed:** Resolved a critical flexbox/grid "blowout" bug where grid items (`.layout-grid > div`) were lacking `min-width: 0`, causing the right column to push the left column out of proportion when text couldn't wrap.
3. **Journey Page:** (`journey-page.hbs`, `journey.hbs`) Completely rewritten to use the `.premium-timeline` CSS and `.premium-card` layout.
4. **Blogs List Page:** (`blogs.hbs`, `view-blog-home.hbs`, `blog-card.hbs`) Completely rewritten to use a `.premium-banner` and a `.projects-grid` style layout for blog cards.

### What is currently in progress / broken:
1. **Blog Post Page (`post.hbs`):** I was in the middle of refactoring `src/hbs-templates/layouts/post.hbs`. I reverted my changes because of a fuzzy-matching error. 
    - **Your immediate task:** Refactor `post.hbs`. You need to replace `<header class="post-hero">` with `<div class="premium-banner">` (and style it similarly to the one in `blogs.hbs`). Then, wrap `<article class="post-article">` inside a `<div class="layout-container"><div class="premium-card">` wrapper so it matches the rest of the site. Make sure you correctly close the `</div></div>` tags at the bottom of the file without accidentally deleting the `{{#each paragraphs}}` block!
2. **CSS Cache Busting:** Whenever you touch `premium-theme.css`, you MUST bump the cache buster string in `main.hbs` (e.g., `<link rel="stylesheet" href="/css/premium-theme.css?v=5" />`). The browser caches aggressively.

## Important CSS Classes to Reuse
- `.premium-banner`: The blue gradient header at the top of pages.
- `.layout-container`: The 1200px wrapper that has a negative top margin (`margin-top: -5rem;`) to pull content up over the blue banner.
- `.premium-card`: The white, rounded-corner card with a subtle border and shadow. Use this to wrap page content.
- `.projects-grid`: A generic grid layout (`repeat(auto-fill, minmax(280px, 1fr))`) useful for lists of cards.

## Critical Rules to Follow
1. **Flexbox Blowouts:** If you add flex rows (`display: flex; gap: X;`), ALWAYS add `min-width: 0;` to the child element that contains text. Otherwise, the text will refuse to wrap and will stretch the parent grid out of bounds.
2. **Do Not Delete Data Logic:** The `.hbs` files are deeply intertwined with the `portfolio.js` router. Be very careful not to delete Handlebars variable bindings (e.g., `{{#each paragraphs}}`, `{{{this}}}`) when restructuring HTML.
