# Comprehensive Project Changelog

This document outlines every single modification made to the application during this session, spanning both User Interface (UI) adjustments and Search Engine Optimization (SEO) overhauls.

---

## 1. User Interface & Layout Fixes

### Resolving Flexbox/Grid "Blowouts"
**The Problem:** The "CRUD Operations" section and the code terminal blocks were being pushed outside of the central viewing column. This was caused by CSS `<pre>` tags forcing their parent containers to stretch infinitely to fit the code text, breaking the responsive grid.
**The Fix:** 
- Identified the flexbox containers wrapping these elements (such as `.op-card`, `.op-code`, and `.step-item`).
- Implemented a CSS rule (`min-width: 0;`) on these child containers. This forces the browser to calculate the width based on the parent container, constraining the code blocks and forcing the horizontal scrollbars to appear *inside* the block rather than stretching the entire website.

### Terminal & Copy Button Refinements
**The Fix:**
- Addressed user feedback regarding the white borders and copy button alignment in the code terminal blocks.
- Modified the terminal elements to be `contenteditable`, allowing users to interact directly with the text inside the code blocks.

### Cache Busting for Stylesheets
**The Problem:** Changes made to the CSS files (`post.css`, `post-mongo.css`) were not reflecting in the browser because the server aggressively caches static assets.
**The Fix:**
- Modified `src/hbs-templates/layouts/post.hbs` and `src/public/css/post.css`.
- Appended cache-busting query strings (`?v=2`) to the CSS and JS imports (e.g., `<link rel="stylesheet" href="/css/post.css?v=2" />`). This forces the browser to fetch the newly modified UI files instead of serving the broken, cached versions.

---

## 2. Global SEO & Metadata Architecture

### Global Headings & Tags
**Files Modified:** `src/hbs-templates/layouts/main.hbs`
- **Action:** Completely overhauled the global `<head>` tags to aggressively target freelance development keywords.
- **Title Tag:** Updated to dynamically fall back to `Vyshnav P C | Freelance Fullstack Developer | React & Node.js`.
- **Meta Description:** Updated to `"Hire Vyshnav P C, a freelance fullstack developer specializing in React JS, Node.js, and modern web applications. Available for freelance projects."`
- **Social Tags (Open Graph & Twitter):** Synchronized the `og:title`, `og:description`, `twitter:title`, and `twitter:description` to match the new SEO strings so that social media previews clearly advertise freelance services.

### JSON-LD Structured Data Schema
**Files Modified:** `src/hbs-templates/layouts/main.hbs`
- **Action:** Injected a large `<script type="application/ld+json">` block at the end of the `<head>`.
- **Reasoning:** This allows Google to programmatically understand the entity behind the website. It defines a `Person` schema linking to GitHub and LinkedIn, and a `ProfessionalService` schema explicitly stating the website offers freelance fullstack development services. This is a massive boost for local/freelance search queries.

---

## 3. Landing Page Content & Fallback Injection

**The Problem:** The text for the landing page (Hero and About sections) is designed to be fetched dynamically from a MongoDB database and cached via Redis. Because the local database was offline/refusing connections, the site was rendering blank spaces instead of the SEO-optimized text.

### The Javascript Fallback Overrides
**Files Modified:** `src/routes/portfolio.js`
- **Action:** Intercepted the backend data flow immediately after the database fetch attempts fail.
- **The Code:** Added a hardcoded Javascript block that manually builds the `renderData.hero` and `renderData.about` objects.
- **Result:** It forcefully injects `"FREELANCE FULLSTACK DEVELOPER"` and `"React JS & Node.js Expert"` into the data payload before the server sends it to the HTML template. This guarantees the bots will always crawl the correct keywords regardless of database uptime.

### The Handlebars Template Fallbacks
**Files Modified:** `src/hbs-templates/partials/hero.hbs` & `src/hbs-templates/partials/about.hbs`
- **Action:** Wrapped the Handlebars data bindings (e.g., `{{hero.role_label}}` and `{{#each about.bio_paragraphs}}`) in `{{#if}} / {{else}}` blocks.
- **Result:** If the backend completely fails to send the `renderData` object, the raw HTML templates will *still* safely default to rendering the optimized SEO paragraphs rather than collapsing into blank elements.

---

## 4. Crawling, Indexing, and Bot Guidelines

### Generating the Sitemap
**Files Modified:** `src/public/sitemap.xml`
- **Action:** Created the static XML sitemap from scratch (it did not exist previously).
- **Result:** Mapped out the critical routes (`/`, `/portfolio`, `/blogs`) and assigned the highest crawl priority (`1.0`) to the homepage, directly satisfying the website's `robots.txt` configuration.

### Agent Documentation
**Files Created:** `.agents/AGENTS.md` & `seo.md`
- **Action:** Created two instructional documents specifically designed for future AI Agents.
- **Result:** `.agents/AGENTS.md` acts as a global rulebook explaining the CSS flexbox blowouts and the CSS cache-busting requirements. `seo.md` acts as a highly technical SEO manual, providing agents with exact file paths, Handlebars variable names, and explicit instructions on how to use the Javascript Fallback Overrides in `portfolio.js` if they are asked to change the landing page text.
