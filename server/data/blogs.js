/**
 * blog.context.js
 * ─────────────────────────────────────────────────────────────────────────
 * Pass this object (or the result of buildContext()) to Handlebars when
 * rendering blog.hbs.
 *
 * Express + express-handlebars:
 *   const { buildContext } = require('./blog.context');
 *   res.render('blog', buildContext(posts, tagColors));
 *
 * Required Handlebars helpers — register once at app startup:
 * ─────────────────────────────────────────────────────────────────────────
 *   // 1. Render an SVG art object → raw HTML string (triple-stash safe)
 *   Handlebars.registerHelper('renderArt', (art) => new Handlebars.SafeString(renderArt(art)));
 *
 *   // 2. Format ISO date → "Apr 2025"
 *   Handlebars.registerHelper('fmtDate', (iso) =>
 *     new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }));
 *
 *   // 3. Lowercase a string (for data-* search attributes)
 *   Handlebars.registerHelper('lowerCase', (str) => (str || '').toLowerCase());
 */

/* ── SVG thumbnail generators (same as before, used server-side) ──────── */
const ArtRenderers = {
  orbit({ bgFrom, bgTo, accentColor, nodes, nodeColors }) {
    const c = "#0e0e0e",
      id = Math.random().toString(36).slice(2, 6);
    const dots = (nodes || [])
      .map((icon, i) => {
        const a = (i / nodes.length) * 2 * Math.PI - Math.PI / 2;
        const x = (260 + 100 * Math.cos(a)).toFixed(1);
        const y = (150 + 100 * Math.sin(a)).toFixed(1);
        const nc = nodeColors[i] || accentColor;
        return `<circle cx="${x}" cy="${y}" r="20" fill="${nc}22" stroke="${nc}88" stroke-width="1"/>
      <text x="${x}" y="${(+y + 5).toFixed(1)}" text-anchor="middle" font-size="14" fill="${nc}">${icon}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="og${id}" cx="50%" cy="50%" r="60%">
    <stop offset="0%" stop-color="${bgFrom}"/><stop offset="100%" stop-color="${bgTo}"/>
  </radialGradient></defs>
  <rect width="520" height="300" fill="url(#og${id})"/>
  <circle cx="260" cy="150" r="100" fill="none" stroke="${c}33" stroke-width="1" stroke-dasharray="6 4"/>
  <circle cx="260" cy="150" r="65"  fill="none" stroke="${c}1a" stroke-width="1"/>
  ${dots}
  <circle cx="260" cy="150" r="30" fill="${c}26" stroke="${c}66" stroke-width="1.5"/>
  <text x="260" y="146" text-anchor="middle" font-size="9" fill="${accentColor}" font-family="Syne,sans-serif" font-weight="700">Event</text>
  <text x="260" y="158" text-anchor="middle" font-size="9" fill="${accentColor}" font-family="Syne,sans-serif" font-weight="700">Loop</text>
</svg>`;
  },
  boxes({ color, title, labels }) {
    const cols = ["#60a5fa", "#a594ff", "#2dd4bf"],
      bw = 65,
      gap = 8,
      sx = 50;
    const rects = (labels || [])
      .map((l, i) => {
        const x = sx + i * (bw + gap);
        return `<rect x="${x}" y="82" width="${bw}" height="28" rx="5" fill="${cols[i % 3]}1f" stroke="${cols[i % 3]}55" stroke-width="1"/>
      <text x="${x + bw / 2}" y="100" text-anchor="middle" font-size="9" fill="${cols[i % 3]}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="30" width="240" height="100" rx="8" fill="${color}0f" stroke="${color}33" stroke-width="1"/>
  <text x="150" y="68" text-anchor="middle" font-size="11" fill="${color}80" font-family="DM Mono,monospace">${title}</text>
  ${rects}</svg>`;
  },
  selector({ color, label }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="260" height="120" rx="10" fill="${color}0f" stroke="${color}26" stroke-width="1"/>
  <rect x="40" y="45" width="220" height="14" rx="3" fill="${color}1f"/>
  <rect x="40" y="67" width="160" height="10" rx="3" fill="${color}12"/>
  <rect x="40" y="85" width="200" height="10" rx="3" fill="${color}12"/>
  <rect x="40" y="103" width="120" height="10" rx="3" fill="${color}12"/>
  <circle cx="240" cy="115" r="22" fill="${color}1f" stroke="${color}59" stroke-width="1.5"/>
  <text x="240" y="120" text-anchor="middle" font-size="11" fill="${color}" font-family="DM Mono,monospace">${label}</text>
</svg>`;
  },
  react({ color }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="150" cy="80" rx="110" ry="45" fill="none" stroke="${color}40" stroke-width="1.2"/>
  <ellipse cx="150" cy="80" rx="110" ry="45" fill="none" stroke="${color}1f" stroke-width="1" transform="rotate(60 150 80)"/>
  <ellipse cx="150" cy="80" rx="110" ry="45" fill="none" stroke="${color}1f" stroke-width="1" transform="rotate(120 150 80)"/>
  <circle cx="150" cy="80" r="14" fill="${color}33" stroke="${color}99" stroke-width="1.5"/>
  <text x="150" y="84" text-anchor="middle" font-size="10" fill="${color}" font-family="DM Mono,monospace">Re</text>
</svg>`;
  },
  bars({ color, labels, heights }) {
    const bw = 44,
      gap = 12,
      n = (labels || []).length;
    const totalW = n * bw + (n - 1) * gap,
      sx = (300 - totalW) / 2;
    const bars = (labels || [])
      .map((l, i) => {
        const h = (heights || [])[i] || 60,
          x = sx + i * (bw + gap),
          y = 140 - h;
        const a = i === 1 ? ".15" : ".1",
          sa = i === 1 ? ".4" : ".3",
          sw = i === 1 ? "1.5" : "1";
        return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="6" fill="${color}${a}" stroke="${color}${sa}" stroke-width="${sw}"/>
      <text x="${x + bw / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">${bars}</svg>`;
  },
  pipeline({ color, labels }) {
    const n = (labels || []).length,
      bw = n <= 3 ? 70 : 52,
      bh = 34,
      gap = n <= 3 ? 24 : 14;
    const totalW = n * bw + (n - 1) * gap,
      sx = (300 - totalW) / 2,
      y = 63,
      mid = Math.floor(n / 2);
    const boxes = (labels || [])
      .map((l, i) => {
        const x = sx + i * (bw + gap),
          a = i === mid ? ".14" : ".08",
          sa = i === mid ? ".4" : ".25",
          sw = i === mid ? "1.5" : "1";
        return `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="5" fill="${color}${a}" stroke="${color}${sa}" stroke-width="${sw}"/>
      <text x="${x + bw / 2}" y="${y + bh / 2 + 4}" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">${l}</text>`;
      })
      .join("");
    const lines = (labels || [])
      .slice(0, -1)
      .map((_, i) => {
        const x1 = sx + i * (bw + gap) + bw,
          x2 = x1 + gap;
        return `<line x1="${x1}" y1="${y + bh / 2}" x2="${x2}" y2="${y + bh / 2}" stroke="${color}55" stroke-width="1.2"/>`;
      })
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">${boxes}${lines}</svg>`;
  },
  code({ color, lines }) {
    const rows = (lines || [])
      .map(
        (l, i) =>
          `<text x="24" y="${44 + i * 21}" font-size="11" fill="${color}" opacity="${Math.max(0.25, 1 - i * 0.17)}" font-family="DM Mono,monospace">${l}</text>`,
      )
      .join("");
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">${rows}</svg>`;
  },
  boxmodel({ color }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="40" y="30" width="220" height="100" rx="8" fill="none" stroke="${color}26" stroke-width="1"/>
  <rect x="55" y="48" width="185" height="65" rx="5" fill="${color}0f" stroke="${color}33" stroke-width="1" stroke-dasharray="4 3"/>
  <rect x="70" y="62" width="155" height="38" rx="4" fill="${color}1a" stroke="${color}59" stroke-width="1"/>
  <text x="147" y="84" text-anchor="middle" font-size="9" fill="${color}" font-family="DM Mono,monospace">content</text>
  <text x="147" y="44" text-anchor="middle" font-size="8" fill="${color}80" font-family="DM Mono,monospace">padding</text>
  <text x="147" y="120" text-anchor="middle" font-size="8" fill="${color}66" font-family="DM Mono,monospace">border</text>
</svg>`;
  },
  kafka({ color }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <circle cx="150" cy="80" r="50" fill="none" stroke="${color}33" stroke-width="1" stroke-dasharray="3 4"/>
  <circle cx="150" cy="80" r="25" fill="${color}1a" stroke="${color}66" stroke-width="1.5"/>
  <text x="150" y="84" text-anchor="middle" font-size="9" fill="${color}" font-family="DM Mono,monospace">Kafka</text>
  <rect x="20" y="65" width="50" height="30" rx="5" fill="${color}12" stroke="${color}33" stroke-width="1"/>
  <text x="45" y="83" text-anchor="middle" font-size="8" fill="${color}cc" font-family="DM Mono,monospace">Prod.</text>
  <rect x="230" y="55" width="50" height="25" rx="5" fill="${color}12" stroke="${color}33" stroke-width="1"/>
  <rect x="230" y="85" width="50" height="25" rx="5" fill="${color}12" stroke="${color}33" stroke-width="1"/>
  <text x="255" y="71" text-anchor="middle" font-size="7.5" fill="${color}cc" font-family="DM Mono,monospace">Con. 1</text>
  <text x="255" y="101" text-anchor="middle" font-size="7.5" fill="${color}cc" font-family="DM Mono,monospace">Con. 2</text>
  <line x1="70" y1="80" x2="124" y2="80" stroke="${color}55" stroke-width="1"/>
  <line x1="175" y1="70" x2="228" y2="65" stroke="${color}44" stroke-width="1"/>
  <line x1="175" y1="90" x2="228" y2="97" stroke="${color}44" stroke-width="1"/>
</svg>`;
  },
  versus({ colorA, colorB, labelA, labelB }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="30" width="100" height="100" rx="8" fill="${colorA}14" stroke="${colorA}33" stroke-width="1"/>
  <text x="80" y="85" text-anchor="middle" font-size="9" fill="${colorA}" font-family="DM Mono,monospace">${labelA}</text>
  <rect x="170" y="30" width="100" height="100" rx="8" fill="${colorB}14" stroke="${colorB}33" stroke-width="1"/>
  <text x="220" y="85" text-anchor="middle" font-size="9" fill="${colorB}" font-family="DM Mono,monospace">${labelB}</text>
  <line x1="130" y1="80" x2="168" y2="80" stroke="rgba(255,255,255,.15)" stroke-width="1" stroke-dasharray="3 3"/>
  <text x="149" y="75" text-anchor="middle" font-size="8" fill="#5a5a70" font-family="DM Mono,monospace">vs</text>
</svg>`;
  },
  gc({ color }) {
    return `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg">
  <text x="24" y="55"  font-size="12" fill="${color}b3" font-family="DM Mono,monospace">WeakMap</text>
  <text x="24" y="80"  font-size="12" fill="${color}73" font-family="DM Mono,monospace">WeakRef</text>
  <text x="24" y="105" font-size="11" fill="${color}4d" font-family="DM Mono,monospace">FinalizationRegistry</text>
  <circle cx="255" cy="80" r="30" fill="${color}0f" stroke="${color}33" stroke-width="1"/>
  <text x="255" y="77" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">GC</text>
  <text x="255" y="88" text-anchor="middle" font-size="8" fill="${color}" font-family="DM Mono,monospace">safe</text>
</svg>`;
  },
};
const artCache = new Map();
function renderArt(art) {
  const key = JSON.stringify(art);
  if (artCache.has(key)) {
    console.log(
      "Rendering art for:",
      artCache.has(key) ? "cache hit" : "cache miss",
      art,
    );
    return artCache.get(key);
  }
  const fn = ArtRenderers[art && art.type];
  const artResponse = fn
    ? fn(art)
    : `<svg viewBox="0 0 300 160" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="160" fill="#18181f"/></svg>`;
  artCache.set(key, artResponse);
  return artResponse;
}

/* ── Raw data ─────────────────────────────────────────────────────────── */
const TAG_COLORS = {
  "Node.js": {
    bg: "rgba(165,148,255,.08)",
    text: "#c4b5fd",
    border: "rgba(165,148,255,.2)",
  },
  JavaScript: {
    bg: "rgba(96,165,250,.08)",
    text: "#93c5fd",
    border: "rgba(96,165,250,.18)",
  },
  CSS: {
    bg: "rgba(244,114,182,.08)",
    text: "#f9a8d4",
    border: "rgba(244,114,182,.18)",
  },
  React: {
    bg: "rgba(45,212,191,.08)",
    text: "#5eead4",
    border: "rgba(45,212,191,.18)",
  },
  Performance: {
    bg: "rgba(74,222,128,.07)",
    text: "#86efac",
    border: "rgba(74,222,128,.15)",
  },
  "System Design": {
    bg: "rgba(251,191,36,.08)",
    text: "#fde68a",
    border: "rgba(251,191,36,.18)",
  },
};

const RAW_POSTS = [
  {
    id: "event-loop",
    featured: true,
    title: "Understanding the Node.js Event Loop",
    excerpt:
      "The event loop is what makes Node.js non-blocking despite being single-threaded. A deep-dive into all 6 phases — Timers, Pending I/O, Idle, Poll, Check, Close — with interactive diagrams and code examples.",
    tags: ["Node.js", "JavaScript"],
    date: "2025-04-10",
    readTime: 8,
    level: "Intermediate",
    href: "event-loop-blog.html",
    art: {
      type: "orbit",
      bgFrom: "#1e1a3a",
      bgTo: "#0a0a14",
      accentColor: "#a594ff",
      nodes: ["⏱", "🔄", "💤", "👂", "✅", "🔒"],
      nodeColors: [
        "#a594ff",
        "#2dd4bf",
        "#9090a8",
        "#60a5fa",
        "#4ade80",
        "#f87171",
      ],
    },
  },
  {
    id: "v8-compile",
    featured: false,
    title: "How V8 Compiles Your JavaScript",
    excerpt:
      "From source text to optimised machine code — parsing, AST, Ignition bytecode, and TurboFan JIT in plain English.",
    tags: ["JavaScript", "Performance"],
    date: "2025-03-20",
    readTime: 6,
    level: "Advanced",
    href: "#",
    art: {
      type: "boxes",
      bgFrom: "#0d1f3c",
      bgTo: "#0a0a14",
      color: "#60a5fa",
      title: "V8 Engine",
      labels: ["Heap", "Stack", "JIT"],
    },
  },
  {
    id: "css-has",
    featured: false,
    title: "CSS :has() — The Parent Selector We Always Wanted",
    excerpt:
      "Why :has() changes how we think about CSS, practical patterns you can use today, and browser support caveats.",
    tags: ["CSS"],
    date: "2025-03-10",
    readTime: 5,
    level: "Beginner",
    href: "#",
    art: {
      type: "selector",
      bgFrom: "#1a0d2e",
      bgTo: "#0a0a14",
      color: "#f472b6",
      label: ":has",
    },
  },
  {
    id: "react-rec",
    featured: false,
    title: "React Reconciliation — How the Diffing Algorithm Works",
    excerpt:
      "Why React's virtual DOM is fast, what keys actually do, and when to avoid re-render pitfalls in real apps.",
    tags: ["React", "JavaScript"],
    date: "2025-02-28",
    readTime: 7,
    level: "Intermediate",
    href: "#",
    art: {
      type: "react",
      bgFrom: "#0d2a2a",
      bgTo: "#0a0a14",
      color: "#2dd4bf",
    },
  },
  {
    id: "workers",
    featured: false,
    title: "Node.js Worker Threads — True Parallelism in JS",
    excerpt:
      "When the event loop isn't enough. Using worker_threads for CPU-bound tasks, shared memory, and Atomics.",
    tags: ["Node.js", "Performance"],
    date: "2025-02-10",
    readTime: 9,
    level: "Advanced",
    href: "#",
    art: {
      type: "bars",
      bgFrom: "#0d1f0d",
      bgTo: "#0a0a14",
      color: "#4ade80",
      labels: ["Worker", "Main", "Worker", "Pool"],
      heights: [70, 90, 65, 50],
    },
  },
  {
    id: "rate-limiter",
    featured: false,
    title: "Designing a Rate Limiter from Scratch",
    excerpt:
      "Token bucket, sliding window log, and fixed window counter — tradeoffs, Redis implementation, and real-world gotchas.",
    tags: ["System Design"],
    date: "2025-01-22",
    readTime: 11,
    level: "Intermediate",
    href: "#",
    art: {
      type: "pipeline",
      bgFrom: "#1f1a0d",
      bgTo: "#0a0a14",
      color: "#fbbf24",
      labels: ["Client", "Load Bal.", "API 1", "API 2", "API 3"],
    },
  },
  {
    id: "async-await",
    featured: false,
    title: "Async/Await Under the Hood",
    excerpt:
      "How async functions desugar to Promises and generators, what the spec actually says, and common error-handling traps.",
    tags: ["JavaScript"],
    date: "2025-01-08",
    readTime: 5,
    level: "Intermediate",
    href: "#",
    art: {
      type: "code",
      bgFrom: "#1f0d0d",
      bgTo: "#0a0a14",
      color: "#f87171",
      lines: [
        "async function",
        "  fetchData() {",
        "  const data =",
        "    await fetch(url);",
        "}",
      ],
    },
  },
  {
    id: "css-contain",
    featured: false,
    title: "CSS Containment — Isolate Layouts for Speed",
    excerpt:
      "How contain: layout style paint can dramatically reduce browser reflow costs, with real-world benchmarks.",
    tags: ["CSS", "Performance"],
    date: "2024-12-15",
    readTime: 4,
    level: "Beginner",
    href: "#",
    art: {
      type: "boxmodel",
      bgFrom: "#1a0d24",
      bgTo: "#0a0a14",
      color: "#f472b6",
    },
  },
  {
    id: "queues",
    featured: false,
    title: "Message Queues vs Event Streams",
    excerpt:
      "Kafka, RabbitMQ, and SQS — when to use each, partitioning strategies, and consumer group patterns explained clearly.",
    tags: ["System Design"],
    date: "2024-12-01",
    readTime: 13,
    level: "Advanced",
    href: "#",
    art: {
      type: "kafka",
      bgFrom: "#141f1f",
      bgTo: "#0a0a14",
      color: "#2dd4bf",
    },
  },
  {
    id: "usememo",
    featured: false,
    title: "useMemo vs useCallback — When They Actually Help",
    excerpt:
      "The rules for memoisation in React, why most useMemo calls are premature, and where they genuinely matter.",
    tags: ["React", "Performance"],
    date: "2024-11-18",
    readTime: 6,
    level: "Intermediate",
    href: "#",
    art: {
      type: "versus",
      bgFrom: "#0d1f2a",
      bgTo: "#0a0a14",
      colorA: "#60a5fa",
      colorB: "#a594ff",
      labelA: "useMemo",
      labelB: "useCallback",
    },
  },
  {
    id: "streams",
    featured: false,
    title: "Node.js Streams — Stop Loading Everything Into Memory",
    excerpt:
      "Readable, Writable, Transform, and Duplex streams — piping large files and why backpressure matters.",
    tags: ["Node.js"],
    date: "2024-10-30",
    readTime: 8,
    level: "Intermediate",
    href: "#",
    art: {
      type: "pipeline",
      bgFrom: "#1a150d",
      bgTo: "#0a0a14",
      color: "#fbbf24",
      labels: ["Express", "Stream", "S3 / DB"],
    },
  },
  {
    id: "weakmap",
    featured: false,
    title: "WeakMap, WeakRef & FinalizationRegistry",
    excerpt:
      "JavaScript's three GC-aware primitives — what they are, when to use them, and why they're not a memory leak cure-all.",
    tags: ["JavaScript"],
    date: "2024-10-05",
    readTime: 4,
    level: "Advanced",
    href: "#",
    art: { type: "gc", bgFrom: "#111a14", bgTo: "#0a0a14", color: "#4ade80" },
  },
];

/* ── buildContext — call this in your route handler ─────────────────────
   Takes the raw posts array and enriches each post with template-ready
   fields so the .hbs file stays logic-free.                             */
function buildContext(posts = RAW_POSTS, tagColors = TAG_COLORS) {
  const DEFAULT_TAG = {
    bg: "rgba(255,255,255,.06)",
    text: "#9090a8",
    border: "rgba(255,255,255,.12)",
  };

  const enriched = posts.map((p) => ({
    ...p,
    joinedTags: p.tags.join(","), // for data-tags attr
    tagStyles: p.tags.map((t) => ({
      name: t,
      ...(tagColors[t] || DEFAULT_TAG),
    })),
  }));

  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort();
  const totalPosts = posts.length;
  const totalCats = allTags.length;
  const avgReadTime = Math.round(
    posts.reduce((s, p) => s + p.readTime, 0) / posts.length,
  );

  return {
    /* meta */
    siteName: "devnotes",
    pageTitle: "Blog",
    searchPlaceholder: "Search articles…",
    noResultsText:
      "No articles match your search. Try a different keyword or filter.",

    /* nav */
    nav: {
      homeUrl: "/",
      ctaUrl: "/contact",
      ctaLabel: "Contact ↗",
      links: [
        { label: "Home", url: "/", active: false },
        { label: "Blog", url: "/blog", active: true },
        { label: "Projects", url: "/projects", active: false },
        { label: "About", url: "/about", active: false },
      ],
    },

    /* hero stats */
    hero: {
      eyebrow: "Writing & Notes",
      headingLine1: "Things I've",
      headingLine2: "learned & built",
      subheading:
        "Deep dives into JavaScript internals, system design patterns, and the craft of writing software that lasts.",
    },
    totalPosts,
    totalCategories: totalCats,
    avgReadTime,

    /* controls */
    allTags,
    sortOptions: [
      { value: "newest", label: "Newest first" },
      { value: "oldest", label: "Oldest first" },
      { value: "read", label: "Shortest read" },
    ],

    /* posts */
    featuredPost: enriched.find((p) => p.featured) || null,
    posts: enriched,
    nonFeaturedCount: enriched.filter((p) => !p.featured).length,

    /* footer */
    footer: {
      copyright: "© 2025 devnotes — built with ♥ and too much coffee",
      links: [
        { label: "GitHub", url: "https://github.com" },
        { label: "Twitter", url: "https://twitter.com" },
        { label: "RSS", url: "/rss.xml" },
      ],
    },
  };
}

/* ── Handlebars helper registrations ────────────────────────────────────
   Add this block wherever you configure your Handlebars instance.       */

module.exports = {
  buildContext,
  renderArt,
  RAW_POSTS,
  TAG_COLORS,
};
