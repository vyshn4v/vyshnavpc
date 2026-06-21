# Profile Website - Agent Guidelines

This file contains important context and rules for working on this project (Vyshnav P C's profile website). Please review this before making changes to the codebase.

## 1. CSS & Layout Blowouts
When modifying or creating new UI components that contain code blocks (`<pre>`) inside a `flex` or `grid` layout (such as the `.operations-grid` or `.topics-list`), be aware of **flexbox blowout**. 
- Code blocks with `min-width: max-content` can force their parent containers to stretch wider than the screen, breaking the layout and pushing elements "outside" the central column.
- **Rule**: Always add `min-width: 0;` to the flex/grid child containers (e.g., `.op-card`, `.op-code`, `.step-item`) to constrain their width and force the scrollbar to appear properly inside the element rather than stretching the parent.

## 2. Browser Caching
The website frontend is aggressively cached.
- **Rule**: If you modify CSS files (like `post.css` or `post-mongo.css`), you must update the cache-busting version string in the handlebars layout file (e.g., `<link rel="stylesheet" href="/css/post.css?v=2" />` inside `post.hbs` or `main.hbs`). If the user reports that changes are not visible, advise them to do a Hard Refresh (Ctrl+F5).

## 3. SEO Optimization Strategy
The site is highly optimized to rank for **"Freelance Fullstack Developer"**, **"React JS"**, and **"Node.js"**. Do not accidentally overwrite or remove these keywords.
- **Meta Tags**: Handled in `src/hbs-templates/layouts/main.hbs` and `post.hbs`.
- **JSON-LD Schema**: The `<head>` includes a JSON-LD block defining a `Person` and a `ProfessionalService`. This is critical for local/freelance SEO. Keep it intact.
- **Data Source**: The landing page text (Hero and About sections) is normally fetched from a MongoDB `landingpages` collection and cached via Redis.
- **Fallback Mechanism**: Because the local database might be offline or fail to connect during development, there is a hardcoded SEO fallback block inside `src/routes/portfolio.js`. This guarantees that the "Freelance Fullstack Developer" keywords are always injected into the HTML response. If you need to update landing page text, update both the database and the fallback in `portfolio.js`.

## 4. Sitemap
The sitemap is a static XML file located at `src/public/sitemap.xml`. `robots.txt` points to it. If you add major new routes, make sure to manually add them to the sitemap with appropriate `<priority>` and `<changefreq>`.
